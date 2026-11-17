import { buildMediaUrl, buildVariantSrcset, type MediaUrlOptions } from '~/media/url'
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

  /** Honest `srcset` (true file widths) to pass to NuxtImg, overriding its requested-width labels. */
  const srcset = (path: MediaPath, masterWidth: number): string | undefined =>
    buildVariantSrcset(path, masterWidth, context)

  return { resolve, srcset }
}
