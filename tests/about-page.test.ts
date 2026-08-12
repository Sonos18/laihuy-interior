import { describe, expect, it } from 'vitest'
import {
  aboutMediaAlt,
  aboutPageContent,
  aboutProjectSlugs,
  aboutProofStatIds
} from '../app/data/about'
import { factoryStats } from '../app/data/factory'
import { projects } from '../app/data/projects'

const locales = ['vi', 'en'] as const
const mojibakeSentinel = /(?:Ã[\u0080-\u00BF]|[ÆÅ][\u0080-\u00BF]|Ä[\u0090\u0192\u2018]|á[º»]|â€)/u

const collectStrings = (value: unknown): string[] => {
  if (typeof value === 'string') return [value]
  if (Array.isArray(value)) return value.flatMap(collectStrings)
  if (value && typeof value === 'object') {
    return Object.values(value).flatMap(collectStrings)
  }
  return []
}

describe('about proof-first page data', () => {
  it('allows valid uppercase Vietnamese letters', () => {
    expect(mojibakeSentinel.test('Âm thanh và MÃ sản phẩm')).toBe(false)
  })

  it('contains no mojibake in editorial or media copy', () => {
    const strings = [
      ...collectStrings(aboutPageContent),
      ...collectStrings(aboutMediaAlt)
    ]

    expect(strings.filter(value => mojibakeSentinel.test(value))).toEqual([])
  })

  it('selects canonical proof facts in the approved order', () => {
    expect(aboutProofStatIds).toEqual([
      'footprint',
      'throughput',
      'end-to-end'
    ])

    const availableIds = new Set(factoryStats.map(stat => stat.id))
    expect(aboutProofStatIds.every(id => availableIds.has(id))).toBe(true)
  })

  it('selects the two approved project records in order', () => {
    expect(aboutProjectSlugs).toEqual([
      'khach-san-eo-gio',
      'codi-villa-phan-thiet'
    ])

    const availableSlugs = new Set(projects.map(project => project.slug))
    expect(aboutProjectSlugs.every(slug => availableSlugs.has(slug))).toBe(true)
  })

  it.each(locales)('contains no empty editorial or media copy in %s', (locale) => {
    const editorialStrings = collectStrings(aboutPageContent)
    expect(editorialStrings.every(value => value.trim().length > 0)).toBe(true)

    for (const alt of Object.values(aboutMediaAlt)) {
      expect(alt[locale].trim()).not.toBe('')
    }
  })

  it('does not duplicate canonical numeric factory facts in editorial copy', () => {
    const editorial = JSON.stringify(aboutPageContent)
    expect(editorial).not.toContain('3.000')
    expect(editorial).not.toContain('3,000')
    expect(editorial).not.toContain('50 phòng')
    expect(editorial).not.toContain('50 rooms')
  })
})
