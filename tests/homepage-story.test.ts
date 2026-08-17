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
      'existing',
      'drawing',
      'material',
      'space'
    ])
  })

  it('binds the same-space journey to local Eo Gio media', () => {
    expect(Object.keys(homeMaterialStoryMedia)).toEqual([
      'existing',
      'drawing',
      'material',
      'space'
    ])
    expect(homeMaterialStoryMedia).toHaveProperty(
      'existing.path',
      'company/homepage-material-story/home-material-eo-gio-00-existing-v1.webp'
    )
    expect(homeMaterialStoryMedia.drawing.path)
      .toBe('company/homepage-material-story/home-material-eo-gio-01-drawing-v2.webp')
    expect(homeMaterialStoryMedia.material.path)
      .toBe('company/homepage-material-story/home-material-eo-gio-02-material-v2.webp')
    expect(homeMaterialStoryMedia.space).toMatchObject({
      path: 'projects/khach-san-eo-gio/sanh-don/24.webp',
      width: 2560,
      height: 1600,
      alt: ''
    })
    expect('factory' in homeMaterialStoryMedia).toBe(false)
    expect(Object.values(homeMaterialStoryMedia).every(image => image.alt === '')).toBe(true)
  })

  it('starts the story from the surveyed existing condition', () => {
    expect(homePageContent.story).toEqual({
      eyebrow: { vi: 'Một hành trình, một đầu mối', en: 'One journey, one accountable team' },
      title: {
        vi: 'Từ hiện trạng đến không gian hoàn thiện',
        en: 'From existing condition to completed space'
      },
      description: {
        vi: 'Một đầu mối xuyên suốt từ khảo sát hiện trạng, triển khai hồ sơ, chốt vật liệu đến nghiệm thu không gian hoàn thiện.',
        en: 'One accountable team leads the work from the existing-condition survey through documentation, material approval, and final sign-off.'
      }
    })
    expect(homeStoryStages[0]).toEqual({
      id: 'existing',
      label: { vi: 'Hiện trạng', en: 'Existing condition' },
      title: {
        vi: 'Đọc đúng mặt bằng trước khi thiết kế',
        en: 'Read the space before designing'
      },
      description: {
        vi: 'Kích thước, cao độ, kết cấu và các đầu chờ MEP được khảo sát để khóa ràng buộc ngay từ đầu.',
        en: 'Dimensions, levels, structure, and MEP interfaces are surveyed so site constraints are understood from the outset.'
      }
    })
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
