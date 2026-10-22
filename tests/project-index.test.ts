import { describe, expect, it } from 'vitest'
import { projects } from '../app/data/projects'
import { FEATURED_LIMIT, splitProjectIndex } from '../app/utils/project-index'
import { coversEndToEnd } from '../app/utils/project-detail-view-model'

describe('splitProjectIndex', () => {
  it('features the end-to-end projects and archives the rest, losing none', () => {
    const { featured, archive } = splitProjectIndex(projects)

    expect(featured.length).toBeGreaterThan(0)
    expect(featured.every(coversEndToEnd)).toBe(true)
    expect(archive.some(coversEndToEnd)).toBe(false)
    expect([...featured, ...archive].map(project => project.slug).sort())
      .toEqual(projects.map(project => project.slug).sort())
  })

  it('features at most FEATURED_LIMIT projects; a further end-to-end project joins the archive', () => {
    const endToEnd = projects.filter(coversEndToEnd)
    // Last in category order, so it comes after the three featured ones.
    const extra = { ...endToEnd[0]!, slug: 'extra-end-to-end-project', category: 'commercial' as const }
    const { featured, archive } = splitProjectIndex([...projects, extra])

    expect(endToEnd).toHaveLength(FEATURED_LIMIT)
    expect(featured).toHaveLength(FEATURED_LIMIT)
    expect(archive.map(project => project.slug)).toContain(extra.slug)
    expect(featured.length + archive.length).toBe(projects.length + 1)
  })

  it('skips an end-to-end project without a cover instead of losing it', () => {
    const [first] = projects.filter(coversEndToEnd)
    const { featured, archive } = splitProjectIndex(projects, project => project.slug !== first!.slug)

    expect(featured.map(project => project.slug)).not.toContain(first!.slug)
    expect(archive.map(project => project.slug)).toContain(first!.slug)
  })
})
