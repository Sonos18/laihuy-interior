import { readFileSync } from 'node:fs'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { projects } from '../app/data/projects'

type NuxtConfigUnderTest = {
  app?: {
    head?: {
      link?: Array<Record<string, unknown>>
    }
  }
  css: string[]
  fonts: {
    families: Array<{
      name: string
      provider?: string
      weights: number[]
      styles: string[]
    }>
  }
  runtimeConfig: {
    public: {
      siteUrl: string
    }
  }
  nitro: {
    prerender: {
      crawlLinks: boolean
      failOnError: boolean
      routes: string[]
    }
  }
  routeRules: Record<string, {
    redirect?: {
      to: string
      statusCode: number
    }
  }>
}

const loadNuxtConfig = async (siteUrl = ''): Promise<NuxtConfigUnderTest> => {
  vi.resetModules()
  vi.stubEnv('NUXT_PUBLIC_SITE_URL', siteUrl)
  vi.stubGlobal('defineNuxtConfig', <T>(config: T): T => config)

  const { default: config } = await import('../nuxt.config')
  return config as NuxtConfigUnderTest
}

afterEach(() => {
  vi.unstubAllEnvs()
  vi.unstubAllGlobals()
})

describe('production deployment config', () => {
  it('uses the production origin by default and normalizes an environment override', async () => {
    const defaultConfig = await loadNuxtConfig()
    expect(defaultConfig.runtimeConfig.public.siteUrl).toBe('https://www.noithatlaihuy.vn')

    const overrideConfig = await loadNuxtConfig('https://preview.example.com///')
    expect(overrideConfig.runtimeConfig.public.siteUrl).toBe('https://preview.example.com')
  })

  it('crawls linked routes, preserves generated endpoints and fails on prerender errors', async () => {
    const config = await loadNuxtConfig()
    const prerender = config.nitro.prerender

    expect(projects).toHaveLength(11)
    expect(prerender.crawlLinks).toBe(true)
    expect(prerender.failOnError).toBe(true)
    expect(prerender.routes).toEqual(expect.arrayContaining([
      '/robots.txt',
      '/sitemap.xml'
    ]))
  })

  it('redirects only the legacy project slug with a verified one-to-one successor', async () => {
    const config = await loadNuxtConfig()

    expect(config.routeRules['/du-an/codi-villa-hien-dai']).toEqual({
      redirect: {
        to: '/du-an/codi-villa-phan-thiet',
        statusCode: 301
      }
    })
    expect(config.routeRules['/du-an/villa-bien']).toBeUndefined()
    expect(config.routeRules['/du-an/khong-gian-van-phong-lai-huy']).toBeUndefined()
  })

  it('bundles only the rendered Inter and Outfit weights from local package CSS and disables provider lookup', async () => {
    const config = await loadNuxtConfig()

    expect(config.fonts.families).toEqual([
      {
        name: 'Inter',
        provider: 'none',
        weights: [400, 500, 600, 700],
        styles: ['normal']
      },
      {
        name: 'Outfit',
        provider: 'none',
        weights: [500],
        styles: ['normal']
      }
    ])
    // The faces are imported from one local file: bare package ids in `css` made the dev
    // server render <link>s it could not serve (404 on every page).
    expect(config.css).toEqual([
      '~/assets/css/layers.css',
      '~/assets/css/fonts.css',
      '~/assets/css/main.css'
    ])

    // Outfit comes from fontsource's own weight file; Inter is declared by hand (latin,
    // vietnamese and a trimmed latin-ext per weight, see fonts.css). Both must list exactly the
    // weights in nuxt.config, all from the installed packages.
    const fontsCss = readFileSync(new URL('../app/assets/css/fonts.css', import.meta.url), 'utf8')
    const imports = [...fontsCss.matchAll(/@import "([^"]+)";/g)].map(match => match[1])
    expect(imports).toEqual(['@fontsource/outfit/500.css'])
    const interWeights = [...new Set([...fontsCss.matchAll(/font-weight: (\d+);/g)].map(match => Number(match[1])))]
    expect(interWeights).toEqual(config.fonts.families.find(family => family.name === 'Inter')?.weights)
    const sources = [...fontsCss.matchAll(/url\('([^']+)'\)/g)].map(match => match[1])
    expect(sources.every(src => src.startsWith('@fontsource/inter/files/inter-'))).toBe(true)
    expect(sources.some(src => /cyrillic|greek/.test(src))).toBe(false)
  })

  it('does not load external runtime font stylesheets from Google Fonts', async () => {
    const config = await loadNuxtConfig()
    const links = config.app?.head?.link ?? []
    const externalFontLinks = links.filter((link) => {
      const href = typeof link.href === 'string' ? link.href : ''
      return href.includes('fonts.googleapis.com') || href.includes('fonts.gstatic.com')
    })
    expect(externalFontLinks).toEqual([])
  })
})
