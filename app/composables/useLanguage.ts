import type { Locale, LocalizedArray, LocalizedText } from '~/shared/types/localization'

export const useLanguage = () => {
  const route = useRoute()

  /**
   * The locale is the URL's (app/utils/locale-path.ts): `/en/...` is English, everything else
   * Vietnamese. It was a cookie on one shared URL, which meant a crawler (no cookie) only ever
   * saw Vietnamese, and prerendered HTML had to be patched to English after hydration. Reading
   * the path gives the server and the client the same first render in either language.
   */
  const locale = computed<Locale>(() => localeFromPath(route.path))

  /** A site path in the current locale: `localePath('/du-an')` is `/en/du-an` on English pages. */
  const localePath = (path: string) => localizePath(path, locale.value)

  /** The page being viewed, in `target`, keeping its query and hash. */
  const switchLocalePath = (target: Locale) => localizePath(route.fullPath, target)

  const setLocale = (value: Locale) => {
    if (value === locale.value) return
    return navigateTo(switchLocalePath(value))
  }

  // `| ''` admits the media layer's decorative-image contract (MediaImage.alt: LocalizedText
  // | ''). A bare NON-empty string is deliberately not accepted: that loophole is how three
  // data files shipped Vietnamese-only. The string branches below stay as runtime resilience.
  const t = (value?: LocalizedText | '', fallback = '') => {
    if (!value) {
      return fallback
    }

    if (typeof value === 'string') {
      return value || fallback
    }

    return value[locale.value] || value.vi || value.en || fallback
  }

  const ta = (value?: LocalizedArray) => {
    if (!value) {
      return []
    }

    if (Array.isArray(value)) {
      return value
    }

    return value[locale.value] || value.vi || value.en || []
  }

  return {
    locale,
    localePath,
    switchLocalePath,
    setLocale,
    t,
    ta
  }
}
