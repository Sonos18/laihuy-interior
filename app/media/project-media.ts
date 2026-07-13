// Presentation glue between the media catalog (filesystem-authoritative) and the
// business layer. A business Project references media only by its stable `mediaId`;
// these helpers resolve that id into catalog assets and pair them with business alt
// text at the point of use. Neither the catalog nor projects.ts stores the other's data.
import { projectMedia, type ProjectMedia, type ProjectMediaId } from './catalog.generated'
import type { MediaAsset, MediaImage } from '~/shared/media/types'
import type { LocalizedText } from '~/shared/types/localization'

export const getProjectMedia = (mediaId?: ProjectMediaId): ProjectMedia | undefined =>
  mediaId ? projectMedia[mediaId] : undefined

/** Pair a catalog asset with business-supplied alt text, producing a renderable image. */
export const withAlt = (asset: MediaAsset, alt: LocalizedText | ''): MediaImage => ({
  ...asset,
  alt
})

/** Resolve a project's cover asset, honouring an optional business-layer override.
 *  `coverImage` is stored relative to the project folder (e.g. `'sanh-don/24.webp'`);
 *  when it doesn't resolve to a real catalog image, the catalog cover is used. */
export const projectCoverAsset = (mediaId: ProjectMediaId | undefined, coverImage?: string): MediaAsset | undefined => {
  const media = getProjectMedia(mediaId)
  if (!media) {
    return undefined
  }
  const override = coverImage
    ? media.images.find(image => image.path === `projects/${mediaId}/${coverImage}`)
    : undefined
  return override ?? media.cover
}

export const projectCover = (
  mediaId: ProjectMediaId | undefined,
  alt: LocalizedText | '',
  coverImage?: string
): MediaImage | undefined => {
  const asset = projectCoverAsset(mediaId, coverImage)
  return asset ? withAlt(asset, alt) : undefined
}

export const projectImages = (mediaId: ProjectMediaId | undefined, alt: LocalizedText | ''): MediaImage[] => {
  const media = getProjectMedia(mediaId)
  return media ? media.images.map(asset => withAlt(asset, alt)) : []
}

/** A named sub-gallery (media catalog folder group) paired with alt text. */
export type ProjectGalleryGroup = {
  slug: string
  images: MediaImage[]
}

/** Resolve a project's named gallery folders (e.g. `sanh-don`, `phong-studio-01`)
 *  into renderable groups. Empty for projects whose images sit directly in the
 *  project folder — the caller then falls back to a single flat gallery. */
export const projectGalleryGroups = (
  mediaId: ProjectMediaId | undefined,
  alt: LocalizedText | ''
): ProjectGalleryGroup[] => {
  const media = getProjectMedia(mediaId)
  if (!media) {
    return []
  }
  return Object.entries(media.galleries).map(([slug, assets]) => ({
    slug,
    images: assets.map(asset => withAlt(asset, alt))
  }))
}
