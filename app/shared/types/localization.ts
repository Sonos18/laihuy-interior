export type Locale = 'vi' | 'en'

export type LocalizedValue<T> = T | {
  vi: T
  en?: T
}

export type LocalizedText = LocalizedValue<string>

export type LocalizedArray = LocalizedValue<string[]>
