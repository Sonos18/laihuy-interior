import { MEDIA_BUCKET, MEDIA_VARIANT_WIDTHS } from '../shared/media/constants'
import { isVectorPath } from '../shared/media/validation'
import type { MediaPath } from '../shared/media/types'

export type MediaUrlContext = {
  supabaseUrl: string
  useSupabaseMedia: boolean
  fallbackPaths?: ReadonlyMap<string, string>
}

export type MediaUrlOptions = {
  width?: number
}

/** Snap a requested width UP to the nearest generated variant; null = use the master. */
export const snapToVariantWidth = (width: number): number | null => {
  for (const variantWidth of MEDIA_VARIANT_WIDTHS) {
    if (width <= variantWidth) {
      return variantWidth
    }
  }
  return null
}

export const variantPath = (path: MediaPath, width: number): MediaPath => {
  const dotIndex = path.lastIndexOf('.')
  return `${path.slice(0, dotIndex)}-w${width}${path.slice(dotIndex)}`
}

export const storageObjectUrl = (supabaseUrl: string, path: MediaPath): string =>
  `${supabaseUrl.replace(/\/+$/, '')}/storage/v1/object/public/${MEDIA_BUCKET}/${path}`

export const buildMediaUrl = (
  path: MediaPath,
  options: MediaUrlOptions,
  context: MediaUrlContext
): string => {
  // @nuxt/image normalizes provider src to a leading-slash path; storage paths are relative
  path = path.replace(/^\/+/, '')

  if (!context.useSupabaseMedia) {
    const fallback = context.fallbackPaths?.get(path)
    if (fallback) {
      return fallback
    }
  }

  let target = path
  if (options.width && !isVectorPath(path)) {
    const snapped = snapToVariantWidth(options.width)
    if (snapped) {
      target = variantPath(path, snapped)
    }
  }

  return storageObjectUrl(context.supabaseUrl, target)
}
