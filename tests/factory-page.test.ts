import { describe, expect, it } from 'vitest'
import {
  factoryAudiences,
  factoryFaqs,
  factoryMediaAlt,
  factoryPageContent,
  factoryPillars,
  factoryStats,
  machineryProcessGroups,
  qualityControl
} from '../app/data/factory'

const locales = ['vi', 'en'] as const

describe('factory proof-first page data', () => {
  it('defines the approved proof-first section data in stable order', () => {
    expect(factoryStats.map(item => item.id)).toEqual([
      'footprint',
      'throughput',
      'end-to-end',
      'reach'
    ])
    expect(factoryPillars.map(item => item.id)).toEqual([
      'direct-factory',
      'machinery',
      'craft',
      'quality'
    ])
    expect(factoryAudiences.map(item => item.id)).toEqual([
      'owners',
      'design-contractors'
    ])
    expect(factoryFaqs.map(item => item.id)).toEqual([
      'lead-time',
      'make-to-drawing',
      'materials-quality',
      'nationwide-installation'
    ])
    expect(machineryProcessGroups).toHaveLength(4)
    expect(qualityControl).toHaveLength(4)
  })

  it.each(locales)('contains no empty approved copy in %s', (locale) => {
    expect(factoryPageContent.hero.topic[locale]).not.toBe('')
    expect(factoryPageContent.hero.title[locale]).not.toBe('')
    expect(factoryPageContent.hero.specialTitle[locale]).not.toBe('')
    expect(factoryPageContent.hero.subtitle[locale]).not.toBe('')
    expect(factoryPageContent.hero.primaryCta[locale]).not.toBe('')
    expect(factoryPageContent.hero.secondaryCta[locale]).not.toBe('')
    for (const section of [
      factoryPageContent.pillars,
      factoryPageContent.process,
      factoryPageContent.peopleQuality,
      factoryPageContent.audiences
    ]) {
      expect(section.eyebrow[locale]).not.toBe('')
      expect(section.title[locale]).not.toBe('')
      expect(section.description[locale]).not.toBe('')
    }
    expect(factoryPageContent.faq.eyebrow[locale]).not.toBe('')
    expect(factoryPageContent.faq.title[locale]).not.toBe('')
    expect(factoryPageContent.visit.eyebrow[locale]).not.toBe('')
    expect(factoryPageContent.visit.title[locale]).not.toBe('')
    expect(factoryPageContent.visit.description[locale]).not.toBe('')
    expect(factoryPageContent.visit.phoneCta[locale]).not.toBe('')
    expect(factoryPageContent.visit.mapCta[locale]).not.toBe('')

    for (const stat of factoryStats) {
      expect(stat.value[locale]).not.toBe('')
      expect(stat.label[locale]).not.toBe('')
    }
    for (const pillar of factoryPillars) {
      expect(pillar.title[locale]).not.toBe('')
      expect(pillar.description[locale]).not.toBe('')
    }
    for (const audience of factoryAudiences) {
      expect(audience.title[locale]).not.toBe('')
      expect(audience.points).toHaveLength(3)
      expect(audience.points.every(point => point[locale] !== '')).toBe(true)
    }
    for (const faq of factoryFaqs) {
      expect(faq.question[locale]).not.toBe('')
      expect(faq.answer[locale]).not.toBe('')
    }
    for (const alt of Object.values(factoryMediaAlt)) {
      expect(alt[locale]).not.toBe('')
    }
  })

  it('keeps FAQ questions unique in each locale', () => {
    for (const locale of locales) {
      const questions = factoryFaqs.map(faq => faq.question[locale])
      expect(new Set(questions).size).toBe(questions.length)
    }
  })
})
