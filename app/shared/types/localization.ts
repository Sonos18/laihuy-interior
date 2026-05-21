export type Locale = 'vi' | 'en'

export type LocalizedText = string | {
  vi: string
  en?: string
}

export type LocalizedArray = string[] | {
  vi: string[]
  en?: string[]
}
