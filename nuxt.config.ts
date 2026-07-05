import process from "node:process";

const useSupabaseMedia = process.env.NUXT_PUBLIC_USE_SUPABASE_MEDIA === "true";
const supabaseUrl = process.env.NUXT_PUBLIC_SUPABASE_URL ?? "";

if (useSupabaseMedia && !supabaseUrl) {
  throw new Error(
    "[media] NUXT_PUBLIC_USE_SUPABASE_MEDIA=true requires NUXT_PUBLIC_SUPABASE_URL to be set",
  );
}

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxt/eslint", "@nuxt/image", "@nuxt/ui"],

  devtools: {
    enabled: true,
  },

  css: ["~/assets/css/main.css"],

  runtimeConfig: {
    public: {
      supabaseUrl: "",
      useSupabaseMedia: false,
    },
  },

  routeRules: {
    "/": { prerender: true },
    "/gioi-thieu": { prerender: true },
    "/du-an": { prerender: true },
    "/nha-xuong": { prerender: true },
    "/dich-vu": { prerender: true },
    "/tuyen-dung": { prerender: true },
    "/lien-he": { prerender: true },
  },

  compatibilityDate: "2025-01-15",

  eslint: {
    config: {
      stylistic: {
        commaDangle: "never",
        braceStyle: "1tbs",
      },
    },
  },

  image: {
    provider: "supabaseMedia",
    providers: {
      supabaseMedia: {
        name: "supabaseMedia",
        provider: "~/providers/supabase-media",
        options: {
          supabaseUrl,
          useSupabaseMedia,
        },
      },
    },
  },
});
