import { buildMediaUrl, type MediaUrlOptions } from '~/media/url'
import { fallbackPaths } from '~/media/fallback'
import type { MediaPath } from '~/shared/media/types'

export const useMediaUrl = () => {
  const config = useRuntimeConfig()

  const context = {
    supabaseUrl: config.public.supabaseUrl,
    useSupabaseMedia: config.public.useSupabaseMedia,
    fallbackPaths
  }

  const resolve = (path: MediaPath, options: MediaUrlOptions = {}): string => {
    if (import.meta.dev && !context.useSupabaseMedia && !fallbackPaths.has(path)) {
      console.warn(
        `[media] No /public fallback for "${path}" — it will be served from Supabase even with USE_SUPABASE_MEDIA=false`
      )
    }
    return buildMediaUrl(path, options, context)
  }

  return { resolve }
}
