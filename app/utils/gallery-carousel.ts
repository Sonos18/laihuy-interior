export type GallerySlidePosition = 'previous' | 'active' | 'next' | 'offstage'

export const wrapGalleryIndex = (index: number, length: number): number => {
  if (length <= 0) return 0
  return ((index % length) + length) % length
}

export const gallerySlidePosition = (
  index: number,
  activeIndex: number,
  length: number
): GallerySlidePosition => {
  if (length <= 0) return 'offstage'

  const active = wrapGalleryIndex(activeIndex, length)
  if (index === active) return 'active'

  if (length === 2) {
    return active === 0 ? 'next' : 'previous'
  }

  if (index === wrapGalleryIndex(active - 1, length)) return 'previous'
  if (index === wrapGalleryIndex(active + 1, length)) return 'next'
  return 'offstage'
}
