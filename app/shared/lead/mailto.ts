import type { Locale } from '~/shared/types/localization'
import type { LeadDraft } from './types'

/**
 * Pure URL construction, separated from the navigation side effect in
 * `app/lead/adapters/mailto.ts` so the string this produces can be asserted in a unit test.
 *
 * Copy is inlined here rather than read from `app/data/ui.ts` on purpose: this module is
 * locale-parameterised but dependency-free, which is what lets vitest import it without a
 * Nuxt runtime. The two label sets below are the only strings in `app/shared/`.
 */
const LABELS = {
  vi: {
    subject: 'Yêu cầu tư vấn dự án',
    name: 'Họ tên',
    phone: 'Điện thoại',
    projectType: 'Loại dự án',
    message: 'Nội dung'
  },
  en: {
    subject: 'Project consultation request',
    name: 'Name',
    phone: 'Phone',
    projectType: 'Project type',
    message: 'Message'
  }
} as const satisfies Record<Locale, Record<string, string>>

const SUBJECT_FALLBACK = 'Lai Huy Interior'

export function buildMailtoUrl(draft: LeadDraft, locale: Locale, to: string): string {
  const labels = LABELS[locale]
  const subject = `${labels.subject} - ${draft.projectType || SUBJECT_FALLBACK}`
  const body = [
    `${labels.name}: ${draft.name}`,
    `Email: ${draft.email}`,
    `${labels.phone}: ${draft.phone}`,
    `${labels.projectType}: ${draft.projectType}`,
    '',
    `${labels.message}:`,
    draft.message
  ].join('\n')

  const params = new URLSearchParams({ subject, body })

  // URLSearchParams encodes spaces as `+`, which mail clients render literally in a
  // subject line. %20 is what mailto: expects.
  return `mailto:${to}?${params.toString().replaceAll('+', '%20')}`
}
