export type ProjectSegment = 'hotel' | 'villa' | 'apartment' | 'house' | 'commercial' | 'office' | 'other'

export type ProjectContent = {
  overview?: string
  challenge?: string
  concept?: string
  solution?: string
  highlights?: string[]
  materials?: string[]
}

export type Project = {
  id: number
  name: string
  title?: string
  shortDescription: string
  description: string[]
  image: string[]
  gallery: string[]
  category: string
  categoryName: string
  slug: string
  segment?: ProjectSegment
  location?: string
  area?: string
  year?: string
  client?: string
  style?: string
  scope?: string[]
  materials?: string[]
  duration?: string
  rooms?: string
  thumbnail?: string
  images?: string[]
  content?: ProjectContent
  featured?: boolean
}
