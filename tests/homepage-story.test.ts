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
      eyebrow: { vi: 'Quy trình 6 bước, tóm trong 4 chặng', en: 'Our six-step process, in four stages' },
      title: {
        vi: 'Không chuyển tay giữa các nhà thầu',
        en: 'No hand-offs between contractors'
      },
      description: {
        vi: 'Cùng một đội chịu trách nhiệm từ lúc nhận bản vẽ, đo hiện trạng, sản xuất đến nghiệm thu tại công trình.',
        en: 'The same team is responsible from drawing intake and site measurement through production to sign-off on site.'
      }
    })
    expect(homeStoryStages[0]).toEqual({
      id: 'existing',
      label: { vi: 'Bước 01 · Tiếp nhận hồ sơ', en: 'Step 01 · Intake' },
      title: {
        vi: 'Đối chiếu bản vẽ với hiện trạng',
        en: 'Check the drawings against the site'
      },
      description: {
        vi: 'Bản vẽ, BOQ và tiêu chuẩn hoàn thiện được rà soát; khi cần, kích thước, cao độ, kết cấu và các vị trí chờ điện, nước, điều hòa (MEP) được đo tại công trình.',
        en: 'Drawings, BOQ and finish standards are reviewed; where needed, dimensions, levels, structure and MEP connections are measured on site.'
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
