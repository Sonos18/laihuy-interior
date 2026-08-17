import { describe, expect, it } from 'vitest'
import {
  gallerySlidePosition,
  wrapGalleryIndex
} from '../app/utils/gallery-carousel'

describe('wrapGalleryIndex', () => {
  it('wraps both ends and stays safe for an empty gallery', () => {
    expect(wrapGalleryIndex(-1, 5)).toBe(4)
    expect(wrapGalleryIndex(5, 5)).toBe(0)
    expect(wrapGalleryIndex(7, 5)).toBe(2)
    expect(wrapGalleryIndex(0, 0)).toBe(0)
  })
})

describe('gallerySlidePosition', () => {
  it('exposes previous, active and next positions for a circular gallery', () => {
    expect(gallerySlidePosition(4, 0, 5)).toBe('previous')
    expect(gallerySlidePosition(0, 0, 5)).toBe('active')
    expect(gallerySlidePosition(1, 0, 5)).toBe('next')
    expect(gallerySlidePosition(2, 0, 5)).toBe('offstage')
  })

  it('does not duplicate a second image into both side positions', () => {
    expect(gallerySlidePosition(0, 0, 2)).toBe('active')
    expect(gallerySlidePosition(1, 0, 2)).toBe('next')
    expect(gallerySlidePosition(1, 1, 2)).toBe('active')
    expect(gallerySlidePosition(0, 1, 2)).toBe('previous')
  })

  it('renders a one-image gallery as active only', () => {
    expect(gallerySlidePosition(0, 0, 1)).toBe('active')
  })
})
