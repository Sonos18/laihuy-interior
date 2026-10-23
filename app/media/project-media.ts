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

/** Human labels for a project's gallery folder slugs (`Project.galleryLabels`). */
export type GalleryLabels = Readonly<Record<string, LocalizedText>>

/** Alt for an image that belongs to a labelled room: "{project}: {room}". */
export const roomImageAlt = (name: LocalizedText, room: LocalizedText): LocalizedText => ({
  vi: `${name.vi}: ${room.vi}`,
  en: `${name.en}: ${room.en}`
})

/** Alt for an image with no room label: "{project}: hình {i}/{n}" (`position` is 1-based). */
export const sequenceImageAlt = (name: LocalizedText, position: number, total: number): LocalizedText => ({
  vi: `${name.vi}: hình ${position}/${total}`,
  en: `${name.en}: image ${position}/${total}`
})

/** One alt per catalog path, shared by the carousel, the lightbox and every other place the image
 *  is rendered. An image in a labelled gallery folder is named by its room; every other image is
 *  named by its place in the project's whole image set. */
const altByPath = (
  media: ProjectMedia,
  name: LocalizedText,
  galleryLabels: GalleryLabels | undefined
): Map<string, LocalizedText> => {
  const alts = new Map<string, LocalizedText>()
  media.images.forEach((asset, index) => {
    alts.set(asset.path, sequenceImageAlt(name, index + 1, media.images.length))
  })
  for (const [slug, assets] of Object.entries(media.galleries)) {
    const room = galleryLabels?.[slug]
    if (!room) continue
    for (const asset of assets) {
      alts.set(asset.path, roomImageAlt(name, room))
    }
  }
  return alts
}

const imageWithAlt = (asset: MediaAsset, alts: ReadonlyMap<string, LocalizedText>, name: LocalizedText): MediaImage =>
  withAlt(asset, alts.get(asset.path) ?? name)

export const projectImages = (
  mediaId: ProjectMediaId | undefined,
  name: LocalizedText,
  galleryLabels?: GalleryLabels
): MediaImage[] => {
  const media = getProjectMedia(mediaId)
  if (!media) {
    return []
  }
  const alts = altByPath(media, name, galleryLabels)
  return media.images.map(asset => imageWithAlt(asset, alts, name))
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
  name: LocalizedText,
  galleryLabels?: GalleryLabels
): ProjectGalleryGroup[] => {
  const media = getProjectMedia(mediaId)
  if (!media) {
    return []
  }
  const alts = altByPath(media, name, galleryLabels)
  return Object.entries(media.galleries).map(([slug, assets]) => ({
    slug,
    images: assets.map(asset => imageWithAlt(asset, alts, name))
  }))
}

export const LONG_MEDIA_THRESHOLD = 12
export const LONG_MEDIA_INLINE_TARGET = 9

export type ProjectMediaFlow = {
  eligible: MediaImage[]
  inline: MediaImage[]
  remaining: MediaImage[]
  isLongMedia: boolean
}

const uniqueMediaByPath = (images: readonly MediaImage[]): MediaImage[] => {
  const paths = new Set<string>()
  return images.filter((image) => {
    if (paths.has(image.path)) return false
    paths.add(image.path)
    return true
  })
}

/** What the gallery's first filter chip counts. It counts what the carousel shows under it: the
 *  curated highlights of a long set (the whole set is counted on the "view all" button instead),
 *  or every image of a short one. */
export const galleryHeadline = (flow: ProjectMediaFlow): { kind: 'highlights' | 'all', count: number } =>
  flow.isLongMedia
    ? { kind: 'highlights', count: flow.inline.length }
    : { kind: 'all', count: flow.eligible.length }

/**
 * Derive the project-story gallery without mutating catalog or project data.
 * Exact identity is the catalog path; distinct paths remain distinct even when
 * they depict similar scenes or crops.
 */
export const buildProjectMediaFlow = (
  images: readonly MediaImage[],
  groups: readonly ProjectGalleryGroup[] = []
): ProjectMediaFlow => {
  const eligible = uniqueMediaByPath(images)
  const isLongMedia = eligible.length > LONG_MEDIA_THRESHOLD

  if (!isLongMedia) {
    return { eligible, inline: eligible, remaining: [], isLongMedia }
  }

  const eligiblePaths = new Set(eligible.map(image => image.path))
  const selectedPaths = new Set<string>()
  const select = (image?: MediaImage) => {
    if (image && eligiblePaths.has(image.path) && selectedPaths.size < LONG_MEDIA_INLINE_TARGET) {
      selectedPaths.add(image.path)
    }
  }

  select(eligible[0])
  for (const group of groups) {
    select(group.images.find(image => eligiblePaths.has(image.path) && !selectedPaths.has(image.path)))
  }
  for (const image of eligible) {
    select(image)
  }

  const inline = eligible.filter(image => selectedPaths.has(image.path))
  const remaining = eligible.filter(image => !selectedPaths.has(image.path))
  return { eligible, inline, remaining, isLongMedia }
}
