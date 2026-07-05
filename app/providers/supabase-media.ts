import { defineProvider } from '@nuxt/image/runtime'
import { buildMediaUrl } from '../media/url'
import { fallbackPaths } from '../media/fallback'

type SupabaseMediaOptions = {
  supabaseUrl?: string
  useSupabaseMedia?: boolean
}

export default defineProvider<SupabaseMediaOptions>({
  getImage(src, { modifiers, supabaseUrl, useSupabaseMedia }) {
    return {
      url: buildMediaUrl(
        src,
        { width: modifiers?.width },
        {
          supabaseUrl: supabaseUrl ?? '',
          useSupabaseMedia: useSupabaseMedia ?? false,
          fallbackPaths
        }
      )
    }
  }
})
