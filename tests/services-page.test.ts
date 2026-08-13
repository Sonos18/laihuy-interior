import { describe, expect, it } from 'vitest'
import { services } from '../app/data/services'
import {
  serviceCoreIds,
  serviceProgrammeIds,
  servicesMediaAlt,
  servicesPageContent
} from '../app/data/services-page'

const locales = ['vi', 'en'] as const
const mojibakeSentinel = /(?:Ãƒ[\u0080-\u00BF]|[Ã†Ã…][\u0080-\u00BF]|Ã„[\u0090\u0192\u2018]|Ã¡[ÂºÂ»]|Ã¢â‚¬)/u

const collectStrings = (value: unknown): string[] => {
  if (typeof value === 'string') return [value]
  if (Array.isArray(value)) return value.flatMap(collectStrings)
  if (value && typeof value === 'object') {
    return Object.values(value).flatMap(collectStrings)
  }
  return []
}

describe('services delivery-journey page data', () => {
  it('partitions every canonical service into the approved 01-06 order', () => {
    expect(serviceCoreIds).toEqual([
      'design',
      'factory-production',
      'construction'
    ])
    expect(serviceProgrammeIds).toEqual([
      'hotel-interior',
      'commercial-projects',
      'export-oem'
    ])
    expect([...serviceCoreIds, ...serviceProgrammeIds])
      .toEqual(services.map(service => service.id))
  })

  it('contains no mojibake in editorial or media copy', () => {
    const strings = [
      ...collectStrings(servicesPageContent),
      ...collectStrings(servicesMediaAlt)
    ]

    expect(strings.filter(value => mojibakeSentinel.test(value))).toEqual([])
  })

  it.each(locales)('contains complete editorial and media copy in %s', (locale) => {
    expect(servicesPageContent.documents.items).toHaveLength(3)
    expect(Object.keys(servicesMediaAlt)).toEqual([
      'hero',
      'design',
      'factory',
      'construction',
      'quality'
    ])
    expect(servicesPageContent.documents.items.every(item =>
      item.title[locale].trim().length > 0
      && item.description[locale].trim().length > 0
    )).toBe(true)
    expect(Object.values(servicesMediaAlt).every(alt =>
      alt[locale].trim().length > 0
    )).toBe(true)
    expect(collectStrings(servicesPageContent).every(value => value.trim().length > 0)).toBe(true)
  })

  it('keeps upload and delivery-success claims out of the contact invitation', () => {
    const copy = JSON.stringify(servicesPageContent)

    expect(copy).not.toMatch(/upload|drag.{0,12}drop|tải tệp|kéo.{0,12}thả/i)
    expect(copy).not.toMatch(/đã gửi|đã nhận|gửi thành công|sent successfully|received/i)
  })
})
