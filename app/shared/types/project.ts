export type ProjectContent = {
  overview?: string
  concept?: string
  solution?: string
  highlights?: string[]
  materials?: string[]
}

export type Project = {
  id: number
  name: string
  shortDescription: string
  description: string[]
  image: string[]
  category: string
  location?: string
  gallery: string[]
  slug: string
  categoryName: string
  area?: string
  year?: string
  client?: string
  style?: string
  content?: ProjectContent
}
