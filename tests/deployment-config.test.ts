import { afterEach, describe, expect, it, vi } from 'vitest'
import { projects } from '../app/data/projects'

type NuxtConfigUnderTest = {
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

  it('bundles every Inter weight from local package CSS and disables provider lookup', async () => {
    const config = await loadNuxtConfig()

    expect(config.fonts.families).toEqual([{
      name: 'Inter',
      provider: 'none',
      weights: [400, 500, 600, 700, 900],
      styles: ['normal']
    }])
    expect(config.css).toEqual([
      '~/assets/css/layers.css',
      '@fontsource/inter/400.css',
      '@fontsource/inter/500.css',
      '@fontsource/inter/600.css',
      '@fontsource/inter/700.css',
      '@fontsource/inter/900.css',
      '~/assets/css/main.css'
    ])
  })
})
