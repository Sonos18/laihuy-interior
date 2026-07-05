import type { LocalizedArray, LocalizedText } from './localization'
import type { MediaImage } from '../media/types'

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
  image: MediaImage[]
  gallery: MediaImage[]
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
  thumbnail?: MediaImage
  images?: MediaImage[]
  content?: ProjectContent
  featured?: boolean
}
