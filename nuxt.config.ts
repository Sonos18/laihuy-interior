import process from 'node:process'

const useSupabaseMedia = process.env.NUXT_PUBLIC_USE_SUPABASE_MEDIA === 'true'
const supabaseUrl = process.env.NUXT_PUBLIC_SUPABASE_URL ?? ''
const siteUrl = (process.env.NUXT_PUBLIC_SITE_URL?.trim() || 'https://www.noithatlaihuy.vn')
  .replace(/\/+$/, '')

if (useSupabaseMedia && !supabaseUrl) {
  throw new Error(
    '[media] NUXT_PUBLIC_USE_SUPABASE_MEDIA=true requires NUXT_PUBLIC_SUPABASE_URL to be set'
  )
}

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({

  modules: ['@nuxt/eslint', '@nuxt/image', '@nuxt/ui'],

  devtools: {
    enabled: false
  },

  // Route continuity (DESIGN.md "Motion", page transition): an opacity crossfade through Linen.
  // `out-in` so the two pages are never stacked, which would double the height of <main>. The
  // durations and the reduced-motion switch-off live in main.css (`.page-*-active`).
  app: {
    pageTransition: { name: 'page', mode: 'out-in' }
  },

  // layers.css MUST precede main.css: it carries the cascade-layer order
  // statement, which has to be read before Tailwind's own layer blocks. See the
  // comment in that file for the defect it fixes.
  css: [
    '~/assets/css/layers.css',
    '~/assets/css/fonts.css',
    '~/assets/css/main.css'
  ],

  runtimeConfig: {
    public: {
      supabaseUrl: '',
      useSupabaseMedia: false,
      // One normalized origin for canonical, Open Graph, JSON-LD, robots and sitemap URLs.
      // NUXT_PUBLIC_SITE_URL can override it per environment.
      siteUrl
    }
  },

  routeRules: {
    '/': { prerender: true },
    '/gioi-thieu': { prerender: true },
    '/du-an': { prerender: true },
    '/nha-xuong': { prerender: true },
    '/dich-vu': { prerender: true },
    '/tuyen-dung': { prerender: true },
    '/lien-he': { prerender: true },
    '/privacy-policy': { prerender: true },
    '/terms-of-use': { prerender: true },
    '/du-an/codi-villa-hien-dai': {
      redirect: { to: '/du-an/codi-villa-phan-thiet', statusCode: 301 }
    }
  },

  // Pinned off :3000, which every other `nuxt dev` on this machine grabs by default. The
  // Playwright harness defaults to the same port (tests/e2e/origin.ts).
  devServer: {
    port: 3001
  },

  compatibilityDate: '2025-01-15',

  nitro: {
    prerender: {
      crawlLinks: true,
      failOnError: true,
      routes: ['/robots.txt', '/sitemap.xml']
    }
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },

  // Fonts are imported above from installed @fontsource packages so production builds never
  // depend on an external font API. Provider lookup stays disabled here; the family declaration
  // still records every real weight used by the design. `normal` only — no italics are used.
  fonts: {
    families: [
      { name: 'Inter', provider: 'none', weights: [400, 500, 600, 700, 900], styles: ['normal'] },
      { name: 'Outfit', provider: 'none', weights: [300, 400, 500, 600, 700], styles: ['normal'] },
      { name: 'Syne', provider: 'none', weights: [400, 500, 600, 700, 800], styles: ['normal'] }
    ]
  },

  // @nuxt/ui defaults this to `components` (its module.mjs), which makes
  // @nuxt/icon's PREPENDED <style> the first declaration of the `components`
  // layer and silently inverts the cascade — preflight then beats every
  // component class. Giving icons their own layer name keeps the injected sheet
  // from claiming `components`; layers.css pins `icons` to lowest priority,
  // which is the precedence @nuxt/icon prepends to achieve anyway.
  icon: {
    cssLayer: 'icons'
  },

  image: {
    provider: 'supabaseMedia',
    providers: {
      supabaseMedia: {
        name: 'supabaseMedia',
        provider: '~/providers/supabase-media',
        options: {
          supabaseUrl,
          useSupabaseMedia
        }
      }
    }
  }
})
