import { categoryDefinitions } from '../data/categories'
import type { Project } from '~/shared/types/project'
import { coversEndToEnd } from './project-detail-view-model'

/** The editorial composition on the project index has room for one lead and two satellites. */
export const FEATURED_LIMIT = 3

const byCategoryOrder = (first: Project, second: Project) =>
  categoryDefinitions[first.category].order - categoryDefinitions[second.category].order

/**
 * Splits the portfolio for the project index: the first `FEATURED_LIMIT` projects that cover design,
 * production and construction (in category order, among those with a cover when `hasCover` is
 * given) are featured, and every other project, including any further end-to-end one, goes to the
 * archive. Nothing is dropped: `featured` and `archive` together are the whole portfolio.
 */
export const splitProjectIndex = (
  projects: readonly Project[],
  hasCover: (project: Project) => boolean = () => true
): { featured: Project[], archive: Project[] } => {
  const ordered = [...projects].sort(byCategoryOrder)
  const featured = ordered.filter(project => coversEndToEnd(project) && hasCover(project)).slice(0, FEATURED_LIMIT)
  const featuredSlugs = new Set(featured.map(project => project.slug))
  return {
    featured,
    archive: ordered.filter(project => !featuredSlugs.has(project.slug))
  }
}
