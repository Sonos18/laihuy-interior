export type Locale = 'vi' | 'en'

/* Both locales are REQUIRED. The earlier `T | { vi: T; en?: T }` shape accepted a bare
 * Vietnamese string, which is exactly how services/factory/careers shipped monolingual for
 * months without a single compiler complaint: `t()` silently returned Vietnamese for both
 * locales. Keeping the runtime fallbacks in useLanguage is fine (resilience against bad data
 * at a boundary); the TYPE is where "every visible string exists in both languages" is
 * actually enforced, because tsc enumerates every gap the moment a new field is added. */
export type LocalizedValue<T> = {
  vi: T
  en: T
}

export type LocalizedText = LocalizedValue<string>

export type LocalizedArray = LocalizedValue<string[]>
