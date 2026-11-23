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

/**
 * A `srcset` whose `w` descriptors are the widths the files really have.
 *
 * @nuxt/image labels each candidate with the width it ASKED for (e.g. `922w` for a 100vw slot at
 * 768px x 1.2), but buildMediaUrl snaps that request UP to a generated variant, so the `922w`
 * candidate is really the 1600px file. The browser trusts the label, so a phone card that needs
 * ~720 device px picked the "922w" entry and downloaded the 1600px file, and a full-bleed hero
 * picked the master. The HTML spec requires the descriptor to be the resource's intrinsic width;
 * this lists each variant once, at its true width, plus the master.
 *
 * Variants are built with `withoutEnlargement` (scripts/media/optimize.ts), so a variant at or
 * above the master width is the master's size again and is left out. In fallback mode every
 * width resolves to the same /public file; duplicates collapse to one candidate.
 * Returns undefined for vectors, which need no srcset.
 */
export const buildVariantSrcset = (
  path: MediaPath,
  masterWidth: number,
  context: MediaUrlContext
): string | undefined => {
  if (isVectorPath(path.replace(/^\/+/, '')) || !masterWidth) {
    return undefined
  }

  const candidates = new Map<string, number>()
  for (const width of MEDIA_VARIANT_WIDTHS) {
    if (width < masterWidth) {
      candidates.set(buildMediaUrl(path, { width }, context), width)
    }
  }
  const masterUrl = buildMediaUrl(path, {}, context)
  candidates.set(masterUrl, Math.max(candidates.get(masterUrl) ?? 0, masterWidth))

  return [...candidates].map(([url, width]) => `${url} ${width}w`).join(', ')
}
