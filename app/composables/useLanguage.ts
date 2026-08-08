import type { Locale, LocalizedArray, LocalizedText } from '~/shared/types/localization'

const isLocale = (value: unknown): value is Locale =>
  value === 'vi' || value === 'en'

export const useLanguage = () => {
  const localeCookie = useCookie<Locale>('lai-huy-locale', {
    default: () => 'vi',
    sameSite: 'lax'
  })

  if (!isLocale(localeCookie.value)) {
    localeCookie.value = 'vi'
  }

  /**
   * Prerendered pages are authored in Vietnamese because there is no request cookie at build
   * time. `useState` carries that exact server value in the Nuxt payload, so the client's first
   * render must use it too. Reading an English cookie directly during hydration made Vue compare
   * an English VDOM with Vietnamese HTML: text happened to update, but translated attributes
   * such as aria-label stayed stale and Vue reported a hydration mismatch.
   *
   * Once hydration has completed, sync the persisted preference. That normal reactive update
   * patches both text and attributes without asking Vue to reconcile two different first renders.
   */
  const locale = useState<Locale>('lai-huy-locale-state', () => localeCookie.value)

  onMounted(() => {
    locale.value = isLocale(localeCookie.value) ? localeCookie.value : 'vi'
  })

  const setLocale = (value: Locale) => {
    locale.value = value
    localeCookie.value = value
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
    setLocale,
    t,
    ta
  }
}
