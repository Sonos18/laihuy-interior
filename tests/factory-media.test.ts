import { describe, expect, it } from 'vitest'
import { factoryMedia, requireWorkshopAsset } from '../app/media/factory-media'

describe('factory media', () => {
  it('resolves five unique named images with bilingual alt text', () => {
    expect(Object.keys(factoryMedia)).toEqual([
      'hero',
      'facade',
      'process',
      'people',
      'visit'
    ])
    expect({
      hero: factoryMedia.hero.path,
      facade: factoryMedia.facade.path,
      process: factoryMedia.process.path,
      people: factoryMedia.people.path,
      visit: factoryMedia.visit.path
    }).toEqual({
      hero: 'company/workshop/4.webp',
      facade: 'company/workshop/1.webp',
      process: 'company/workshop/3.webp',
      people: 'company/company-story.webp',
      visit: 'company/workshop/2.webp'
    })
    const paths = Object.values(factoryMedia).map(image => image.path)
    expect(new Set(paths).size).toBe(paths.length)

    for (const image of Object.values(factoryMedia)) {
      expect(image.alt).not.toBe('')
      if (image.alt !== '') {
        expect(image.alt.vi).not.toBe('')
        expect(image.alt.en).not.toBe('')
      }
    }
  })

  it('fails with the missing filename instead of returning undefined', () => {
    expect(() => requireWorkshopAsset('missing.webp', [])).toThrow(
      'Missing workshop media asset: company/workshop/missing.webp'
    )
  })
})
