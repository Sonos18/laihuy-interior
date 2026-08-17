import { describe, expect, it } from 'vitest'
import { projects } from '../app/data/projects'
import { buildProjectDetailViewModel } from '../app/utils/project-detail-view-model'

const project = (slug: string) => {
  const match = projects.find(item => item.slug === slug)
  if (!match) throw new Error(`Missing test project: ${slug}`)
  return match
}

describe('buildProjectDetailViewModel', () => {
  it('caps hero facts at the approved five verified priorities', () => {
    const view = buildProjectDetailViewModel({
      project: project('khach-san-eo-gio'),
      projects,
      imageCount: 30,
      locale: 'vi'
    })

    expect(view.facts.map(fact => fact.key)).toEqual([
      'area',
      'year',
      'style',
      'scope',
      'location'
    ])
    expect(view.facts).toHaveLength(5)
    expect(view.facts.find(fact => fact.key === 'scope')?.value)
      .toBe('Thiết kế · Sản xuất · Thi công')
  })

  it('derives ordered phases and only the execution proof supported by scope', () => {
    const fullScope = buildProjectDetailViewModel({
      project: project('khach-san-eo-gio'),
      projects,
      imageCount: 30,
      locale: 'en'
    })
    const designOnly = buildProjectDetailViewModel({
      project: project('nha-vuon-chily'),
      projects,
      imageCount: 26,
      locale: 'en'
    })

    expect(fullScope.deliveryPhases.map(phase => phase.key)).toEqual([
      'consultation',
      'design',
      'production',
      'installation',
      'handover'
    ])
    expect(fullScope.executionProof.map(proof => proof.id)).toEqual([
      'direct-factory',
      'quality',
      'craft'
    ])
    expect(designOnly.deliveryPhases.map(phase => phase.key)).toEqual([
      'consultation',
      'design',
      'handover'
    ])
    expect(designOnly.executionProof).toEqual([])
  })

  it('builds only renderable stable anchors', () => {
    const rich = buildProjectDetailViewModel({
      project: project('khach-san-eo-gio'),
      projects,
      imageCount: 30,
      locale: 'vi'
    })
    const withoutMedia = buildProjectDetailViewModel({
      project: project('nha-xuong-anh-cuong'),
      projects,
      imageCount: 0,
      locale: 'vi'
    })

    expect(rich.navSections.map(section => section.id)).toEqual([
      'story',
      'gallery',
      'delivery',
      'materials'
    ])
    expect(withoutMedia.navSections.map(section => section.id)).toEqual([
      'story',
      'delivery',
      'materials'
    ])
  })

  it('keeps material visibility and related ranking deterministic', () => {
    const view = buildProjectDetailViewModel({
      project: project('nha-xuong-anh-cuong'),
      projects,
      imageCount: 3,
      locale: 'vi'
    })

    expect(view.hasMaterialStory).toBe(true)
    expect(view.relatedProjects).toHaveLength(3)
    expect(new Set(view.relatedProjects.map(item => item.slug)).size).toBe(3)
    expect(view.relatedProjects.some(item => item.slug === 'nha-xuong-anh-cuong')).toBe(false)
  })
})
