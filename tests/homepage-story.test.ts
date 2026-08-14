import { describe, expect, it } from 'vitest'
import {
  homeCapabilities,
  homePageContent,
  homeStoryStages
} from '../app/data/home-page'
import { homeMaterialStoryMedia } from '../app/media/home-media'
import { calculateScrollProgress } from '../app/utils/scroll-progress'

describe('homepage material story', () => {
  it('keeps the four delivery stages in the order visitors experience them', () => {
    expect(homeStoryStages.map(stage => stage.id)).toEqual([
      'drawing',
      'material',
      'factory',
      'space'
    ])
  })

  it('binds the generated lead-up to the real Eo Gio reception photograph', () => {
    expect(homeMaterialStoryMedia.drawing.path)
      .toBe('company/homepage-material-story/home-material-eo-gio-01-drawing-v2.webp')
    expect(homeMaterialStoryMedia.material.path)
      .toBe('company/homepage-material-story/home-material-eo-gio-02-material-v2.webp')
    expect(homeMaterialStoryMedia.factory.path)
      .toBe('company/homepage-material-story/home-material-eo-gio-03-factory-v2.webp')
    expect(homeMaterialStoryMedia.space).toMatchObject({
      path: 'projects/khach-san-eo-gio/sanh-don/24.webp',
      width: 2560,
      height: 1600,
      alt: ''
    })
    expect(Object.values(homeMaterialStoryMedia).every(image => image.alt === '')).toBe(true)
  })

  it('exposes the three accountable capabilities without duplicating services', () => {
    expect(homeCapabilities.map(capability => capability.id)).toEqual([
      'technical',
      'manufacturing',
      'fitout'
    ])
  })

  it.each(['vi', 'en'] as const)('provides complete conversion copy in %s', (locale) => {
    expect(homePageContent.hero.title[locale]).not.toBe('')
    expect(homePageContent.hero.description[locale]).not.toBe('')
    expect(homePageContent.story.title[locale]).not.toBe('')
    expect(homePageContent.cta.title[locale]).not.toBe('')

    for (const stage of homeStoryStages) {
      expect(stage.label[locale]).not.toBe('')
      expect(stage.title[locale]).not.toBe('')
      expect(stage.description[locale]).not.toBe('')
    }

    for (const capability of homeCapabilities) {
      expect(capability.title[locale]).not.toBe('')
      expect(capability.description[locale]).not.toBe('')
    }
  })
})

describe('calculateScrollProgress', () => {
  it('clamps progress before, within, and after the usable scroll range', () => {
    expect(calculateScrollProgress(500, 700, 1000)).toBe(0)
    expect(calculateScrollProgress(1000, 500, 1000)).toBe(0.5)
    expect(calculateScrollProgress(1600, 500, 1000)).toBe(1)
  })

  it('uses the final state when there is no usable scroll range', () => {
    expect(calculateScrollProgress(500, 500, 0)).toBe(1)
  })
})
