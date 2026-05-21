import type { Locale, LocalizedArray, LocalizedText } from '~/shared/types/localization'

const isLocale = (value: unknown): value is Locale =>
  value === 'vi' || value === 'en'

export const useLanguage = () => {
  const locale = useCookie<Locale>('lai-huy-locale', {
    default: () => 'vi',
    sameSite: 'lax'
  })

  if (!isLocale(locale.value)) {
    locale.value = 'vi'
  }

  const setLocale = (value: Locale) => {
    locale.value = value
  }

  const t = (value?: LocalizedText, fallback = '') => {
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
