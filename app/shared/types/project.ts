import type { LocalizedArray, LocalizedText } from './localization'

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
  name: LocalizedText
  title?: LocalizedText
  shortDescription: LocalizedText
  description: LocalizedArray
  image: string[]
  gallery: string[]
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
  thumbnail?: string
  images?: string[]
  content?: ProjectContent
  featured?: boolean
}
