import { describe, expect, it } from 'vitest'
import { projects } from '../app/data/projects'
import type { Project } from '../app/shared/types/project'
import { buildProjectDetailViewModel, projectStatusText } from '../app/utils/project-detail-view-model'

const project = (slug: string) => {
  const match = projects.find(item => item.slug === slug)
  if (!match) throw new Error(`Missing test project: ${slug}`)
  return match
}

/** A project Lai Huy only designed: none of the current portfolio is, so the rule is tested on a copy. */
const designOnly = (): Project => ({
  ...project('nha-vuon-chily'),
  scope: { vi: ['Thiết kế'], en: ['Design'] }
})

const view = (target: Project, locale: 'vi' | 'en') =>
  buildProjectDetailViewModel({ project: target, projects, imageCount: 10, locale })

describe('buildProjectDetailViewModel', () => {
  it('caps hero facts at five, with the room count in the place of the style', () => {
    const rich = view(project('khach-san-eo-gio'), 'vi')

    expect(rich.facts.map(fact => fact.key)).toEqual([
      'area',
      'rooms',
      'year',
      'scope',
      'location'
    ])
    expect(rich.facts).toHaveLength(5)
    expect(rich.facts.find(fact => fact.key === 'scope')?.value)
      .toBe('Thiết kế · Sản xuất · Thi công')
  })

  it('keeps the style fact for a project without a room count', () => {
    expect(view(project('nha-vuon-chily'), 'vi').facts.map(fact => fact.key))
      .toEqual(['area', 'year', 'style', 'scope', 'location'])
  })

  it('states the room counts the owner confirmed, in both locales, and only those', () => {
    const fact = (slug: string, locale: 'vi' | 'en') =>
      view(project(slug), locale).facts.find(item => item.key === 'rooms')

    expect(fact('khach-san-eo-gio', 'vi')).toMatchObject({ label: 'Số phòng', value: '44–45 phòng' })
    expect(fact('khach-san-eo-gio', 'en')).toMatchObject({ label: 'Rooms', value: '44–45 rooms' })
    expect(fact('codi-villa-phan-thiet', 'vi')).toMatchObject({ label: 'Số phòng', value: '20–25 phòng' })
    expect(fact('codi-villa-phan-thiet', 'en')).toMatchObject({ label: 'Rooms', value: '20–25 rooms' })
    expect(projects.filter(item => item.rooms).map(item => item.slug))
      .toEqual(['khach-san-eo-gio', 'codi-villa-phan-thiet'])
    expect(projects.some(item => item.duration)).toBe(false)
  })

  it('labels the year "Completed" when the scope includes the build and "Design year" otherwise', () => {
    const yearFact = (target: Project, locale: 'vi' | 'en') =>
      view(target, locale).facts.find(item => item.key === 'year')

    expect(yearFact(project('khach-san-eo-gio'), 'vi')?.label).toBe('Hoàn thành')
    expect(yearFact(project('khach-san-eo-gio'), 'en')?.label).toBe('Completed')
    expect(yearFact(designOnly(), 'vi')?.label).toBe('Năm thiết kế')
    expect(yearFact(designOnly(), 'en')?.label).toBe('Design year')
  })

  it('writes the hero status chip with the same label as the year fact', () => {
    expect(projectStatusText(project('khach-san-eo-gio'), 'vi')).toBe('Hoàn thành 2026')
    expect(projectStatusText(project('khach-san-eo-gio'), 'en')).toBe('Completed 2026')
    expect(projectStatusText(designOnly(), 'vi')).toBe('Năm thiết kế 2023')
    expect(projectStatusText(designOnly(), 'en')).toBe('Design year 2023')
    expect(projectStatusText({ ...designOnly(), year: undefined }, 'vi')).toBe('')
  })

  it('names the build "Fit-out" in English everywhere, never "Construction" or "Installation"', () => {
    for (const item of projects) {
      expect(item.scope?.en, item.slug).not.toContain('Construction')
    }
    expect(view(project('nha-ta-dung'), 'en').scopeItems.map(scope => scope.label))
      .toEqual(['Design', 'Fit-out'])
    expect(view(project('khach-san-eo-gio'), 'en').facts.find(fact => fact.key === 'scope')?.value)
      .toBe('Design · Production · Fit-out')
  })

  it('shows the production and installation phases with the six-step vocabulary', () => {
    expect(view(project('khach-san-eo-gio'), 'vi').deliveryPhases.map(phase => phase.label)).toEqual([
      'Tiếp nhận hồ sơ',
      'Thiết kế & bóc tách',
      'Sản xuất & QC',
      'Lắp đặt',
      'Bàn giao'
    ])
    expect(view(project('khach-san-eo-gio'), 'en').deliveryPhases.map(phase => phase.label)).toEqual([
      'Brief & documents',
      'Design & take-off',
      'Production & QC',
      'Installation',
      'Handover'
    ])
  })

  it('gives all six re-scoped projects a production phase, factory proof and a craftsmanship story', () => {
    const rescoped = [
      'codi-boutique-hotel',
      'nha-vuon-chily',
      'cai-tao-nha-quan-8',
      'nha-anh-nam',
      'phong-giam-doc',
      'phong-hop-quan-7'
    ]

    for (const slug of rescoped) {
      const target = project(slug)
      const model = view(target, 'vi')

      expect(target.scope?.vi, slug).toEqual(['Thiết kế', 'Sản xuất', 'Thi công'])
      expect(target.scope?.en, slug).toEqual(['Design', 'Production', 'Fit-out'])
      expect(model.deliveryPhases.map(phase => phase.key), slug).toContain('production')
      expect(model.executionProof.map(proof => proof.id), slug).toEqual(['direct-factory', 'quality', 'craft'])
      expect(target.content?.craftsmanship?.vi, slug).toBeTruthy()
      expect(target.content?.craftsmanship?.en, slug).toBeTruthy()
    }
  })

  it('gives every project its own SEO title and description in both locales', () => {
    for (const item of projects) {
      expect(item.seo?.title?.vi, item.slug).toBeTruthy()
      expect(item.seo?.title?.en, item.slug).toBeTruthy()
      expect(item.seo?.description?.vi.length, item.slug).toBeLessThanOrEqual(156)
      expect(item.seo?.description?.en.length, item.slug).toBeLessThanOrEqual(156)
    }
  })

  it('derives ordered phases and only the execution proof supported by scope', () => {
    const fullScope = buildProjectDetailViewModel({
      project: project('khach-san-eo-gio'),
      projects,
      imageCount: 30,
      locale: 'en'
    })
    const designOnlyView = view(designOnly(), 'en')

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
    expect(designOnlyView.deliveryPhases.map(phase => phase.key)).toEqual([
      'consultation',
      'design',
      'handover'
    ])
    expect(designOnlyView.executionProof).toEqual([])
  })

  it('claims end-to-end delivery only when the scope covers design, production and construction', () => {
    const coverage = (slug: string) => buildProjectDetailViewModel({
      project: project(slug),
      projects,
      imageCount: 10,
      locale: 'vi'
    }).coversEndToEnd

    expect(coverage('khach-san-eo-gio')).toBe(true)
    expect(coverage('phong-hop-quan-7')).toBe(true)
    expect(coverage('nha-ta-dung')).toBe(false)
    expect(coverage('nha-xuong-anh-cuong')).toBe(false)
    expect(projects.filter(item => coverage(item.slug))).toHaveLength(9)
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
