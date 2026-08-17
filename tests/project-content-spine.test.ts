import { describe, expect, it } from 'vitest'
import { projects } from '../app/data/projects'
import type { LocalizedArray, LocalizedText } from '../app/shared/types/localization'

const textFor = (value: LocalizedText | undefined, locale: 'vi' | 'en') =>
  value?.[locale].trim() ?? ''

const listFor = (value: LocalizedArray | undefined, locale: 'vi' | 'en') =>
  value?.[locale].map(item => item.trim()).filter(Boolean) ?? []

describe('project narrative spine', () => {
  it('gives every shipped project a complete bilingual story with at least one proof group', () => {
    expect(projects).toHaveLength(11)

    for (const project of projects) {
      const content = project.content
      expect(content, project.slug).toBeDefined()

      for (const locale of ['vi', 'en'] as const) {
        const narrative = [
          textFor(content?.overview, locale),
          textFor(content?.challenge, locale),
          textFor(content?.solution, locale),
          textFor(content?.experience, locale)
        ]

        expect(narrative.every(Boolean), `${project.slug}:${locale}`).toBe(true)
        expect(new Set(narrative).size, `${project.slug}:${locale}:duplicate narrative`).toBe(4)

        const proofCount
          = listFor(content?.designHighlights, locale).length
            + listFor(content?.materials, locale).length
            + (textFor(content?.craftsmanship, locale) ? 1 : 0)

        expect(proofCount, `${project.slug}:${locale}:proof`).toBeGreaterThan(0)
      }
    }
  })

  it('never assigns craftsmanship to a design-only project', () => {
    for (const project of projects) {
      const scope = project.scope?.vi ?? []
      const includesExecution = scope.includes('Sản xuất') || scope.includes('Thi công')

      if (!includesExecution) {
        expect(project.content?.craftsmanship, project.slug).toBeUndefined()
      }
    }
  })
})
