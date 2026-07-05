import type { LocalizedArray, LocalizedText } from './localization'
import type { ProjectMediaId } from '~/media/catalog.generated'

export type ProjectSegment = 'hotel' | 'villa' | 'apartment' | 'house' | 'commercial' | 'office' | 'other'

export type ProjectContent = {
  overview?: LocalizedText
  challenge?: LocalizedText
  concept?: LocalizedText
  solution?: LocalizedText
  highlights?: LocalizedArray
  materials?: LocalizedArray
}

export type Project = {
  id: number
  /** Stable media identifier — the project's folder name in the media catalog.
   *  Absent when no matching media folder exists (business content awaiting media). */
  mediaId?: ProjectMediaId
  name: LocalizedText
  title?: LocalizedText
  shortDescription: LocalizedText
  description: LocalizedArray
  category: string
  categoryName: LocalizedText
  slug: string
  segment?: ProjectSegment
  location?: LocalizedText
  area?: LocalizedText
  year?: LocalizedText
  client?: LocalizedText
  style?: LocalizedText
  scope?: LocalizedArray
  materials?: LocalizedArray
  duration?: LocalizedText
  rooms?: LocalizedText
  content?: ProjectContent
  featured?: boolean
}
