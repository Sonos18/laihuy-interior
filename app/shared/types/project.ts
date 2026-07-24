import type { LocalizedArray, LocalizedText } from './localization'
import type { ProjectMediaId } from '~/media/catalog.generated'

/** The single canonical project classification. Labels, icons and ordering are
 *  derived from `categoryDefinitions` — never stored on the project. */
export type ProjectCategory = 'hotel' | 'villa' | 'house' | 'office' | 'commercial' | 'retreat'

export type CategoryDefinition = {
  label: LocalizedText
  icon: string
  order: number
}

/** Narrative case-study content. Every field is optional so each project tells
 *  its own story and small projects are never padded with empty sections. */
export type ProjectContent = {
  overview?: LocalizedText
  challenge?: LocalizedText
  solution?: LocalizedText
  designHighlights?: LocalizedArray
  materials?: LocalizedArray
  craftsmanship?: LocalizedText
  experience?: LocalizedText
}

/** A verified client quote. Rendered only when authored — never fabricated. */
export type ProjectTestimonial = {
  quote: LocalizedText
  author: LocalizedText
  role?: LocalizedText
}

/** A verified headline metric (e.g. workforce, furniture count) shown as a fact card. */
export type ProjectMetric = {
  label: LocalizedText
  value: LocalizedText
  icon?: string
}

/** One phase of the execution timeline; `duration` is optional. */
export type ProjectTimelinePhase = {
  phase: LocalizedText
  duration?: LocalizedText
}

/** A before/after pair. Paths are relative to the project media folder
 *  (`projects/${mediaId}/...`). UI is deferred until real assets exist. */
export type ProjectBeforeAfter = {
  before: string
  after: string
  label?: LocalizedText
}

/** Override-only. When omitted, SEO derives from `name` / `content.overview` /
 *  `shortDescription`; `keywords` is optional and curated. */
export type ProjectSeo = {
  title?: LocalizedText
  description?: LocalizedText
  keywords?: LocalizedArray
}

export type Project = {
  /** Catalog identifier (infrastructure) — links to the generated media catalog. */
  mediaId: ProjectMediaId
  /** Public identifier — route param and list key. */
  slug: string
  category: ProjectCategory
  name: LocalizedText
  shortDescription: LocalizedText
  /** Cover image, stored relative to the project's media folder (e.g.
   *  `'sanh-don/24.webp'`); resolves to `projects/${mediaId}/${coverImage}`,
   *  falling back to the catalog cover. */
  coverImage?: string
  client?: LocalizedText
  location?: LocalizedText
  area?: LocalizedText
  year?: LocalizedText
  style?: LocalizedText
  scope?: LocalizedArray
  /** How long delivery took (e.g. "4 tháng" / "4 months"). */
  duration?: LocalizedText
  /** Key/unit count for the fact strip (e.g. "42 phòng" / "42 rooms"). */
  rooms?: LocalizedText
  /** Extra verified headline metrics (workforce, furniture count, …). */
  metrics?: ProjectMetric[]
  /** Execution phases with optional durations; complements `scope`. */
  timeline?: ProjectTimelinePhase[]
  /** Verified awards or recognitions, if any. */
  awards?: LocalizedArray
  /** Verified client quote — rendered only when present. */
  testimonial?: ProjectTestimonial
  /** Human labels for the media catalog's gallery folder slugs, keyed by slug
   *  (e.g. `{ 'sanh-don': { vi: 'Sảnh đón', en: 'Reception' } }`). */
  galleryLabels?: Record<string, LocalizedText>
  /** Before/after pairs (UI deferred until assets exist). */
  beforeAfter?: ProjectBeforeAfter[]
  content?: ProjectContent
  seo?: ProjectSeo
  featured?: boolean
}
