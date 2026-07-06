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
  content?: ProjectContent
  seo?: ProjectSeo
  featured?: boolean
}
