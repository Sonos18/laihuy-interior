import type { Locale } from '~/shared/types/localization'

/**
 * Locale lives in the URL (owner, 2026-11-17). Vietnamese is the default and stays unprefixed
 * (`/du-an`); English is the same route under `/en` (`/en/du-an`), the `prefix_except_default`
 * strategy of @nuxtjs/i18n. Routing borrows that idea only: copy lives in typed `LocalizedText`
 * data, so a message-file i18n module would add weight without replacing anything.
 *
 * One URL, one language, is what lets a crawler (which never sends a cookie) index English.
 */
export const LOCALES: readonly Locale[] = ['vi', 'en']
export const DEFAULT_LOCALE: Locale = 'vi'
export const EN_PREFIX = '/en'

/** BCP 47 tags for `hreflang` and `og:locale`, keyed by locale. */
export const HREFLANG: Record<Locale, string> = { vi: 'vi', en: 'en' }
export const OG_LOCALE: Record<Locale, string> = { vi: 'vi_VN', en: 'en_US' }

const splitSuffix = (path: string): [string, string] => {
  const index = path.search(/[?#]/)
  return index === -1 ? [path, ''] : [path.slice(0, index), path.slice(index)]
}

const hasEnPrefix = (pathname: string) =>
  pathname === EN_PREFIX || pathname.startsWith(`${EN_PREFIX}/`)

export const localeFromPath = (path: string): Locale =>
  hasEnPrefix(splitSuffix(path)[0]) ? 'en' : DEFAULT_LOCALE

/** `/en/du-an?x#y` → `/du-an?x#y`; `/en` → `/`. Unprefixed paths are returned as they are. */
export const stripLocalePrefix = (path: string): string => {
  const [pathname, suffix] = splitSuffix(path)
  if (!hasEnPrefix(pathname)) return path
  return (pathname.slice(EN_PREFIX.length) || '/') + suffix
}

/**
 * The same page in `locale`. Only site-relative paths are rewritten: `mailto:`, `tel:`, absolute
 * URLs and bare `#hash` links pass through untouched.
 */
export const localizePath = (path: string, locale: Locale): string => {
  if (!path.startsWith('/') || path.startsWith('//')) return path
  const [pathname, suffix] = splitSuffix(stripLocalePrefix(path))
  if (locale === DEFAULT_LOCALE) return pathname + suffix
  return (pathname === '/' ? EN_PREFIX : `${EN_PREFIX}${pathname}`) + suffix
}
