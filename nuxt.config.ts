import process from 'node:process'

const useSupabaseMedia = process.env.NUXT_PUBLIC_USE_SUPABASE_MEDIA === 'true'
const supabaseUrl = process.env.NUXT_PUBLIC_SUPABASE_URL ?? ''

if (useSupabaseMedia && !supabaseUrl) {
  throw new Error(
    '[media] NUXT_PUBLIC_USE_SUPABASE_MEDIA=true requires NUXT_PUBLIC_SUPABASE_URL to be set'
  )
}

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/eslint', '@nuxt/image', '@nuxt/ui'],

  devtools: {
    enabled: true
  },

  // layers.css MUST precede main.css: it carries the cascade-layer order
  // statement, which has to be read before Tailwind's own layer blocks. See the
  // comment in that file for the defect it fixes.
  css: ['~/assets/css/layers.css', '~/assets/css/main.css'],

  runtimeConfig: {
    public: {
      supabaseUrl: '',
      useSupabaseMedia: false,
      // Absolute production origin, used for robots.txt + sitemap.xml (and later
      // canonical/OG URLs). Override per environment with NUXT_PUBLIC_SITE_URL.
      // TODO: replace the placeholder with the real domain before launch.
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://laihuy-interior.com'
    }
  },

  routeRules: {
    '/': { prerender: true },
    '/gioi-thieu': { prerender: true },
    '/du-an': { prerender: true },
    '/nha-xuong': { prerender: true },
    '/dich-vu': { prerender: true },
    '/tuyen-dung': { prerender: true },
    '/lien-he': { prerender: true }
  },

  compatibilityDate: '2025-01-15',

  nitro: {
    prerender: {
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
