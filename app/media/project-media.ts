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

export const projectCover = (mediaId: ProjectMediaId | undefined, alt: LocalizedText | ''): MediaImage | undefined => {
  const media = getProjectMedia(mediaId)
  return media ? withAlt(media.cover, alt) : undefined
}

export const projectImages = (mediaId: ProjectMediaId | undefined, alt: LocalizedText | ''): MediaImage[] => {
  const media = getProjectMedia(mediaId)
  return media ? media.images.map(asset => withAlt(asset, alt)) : []
}
