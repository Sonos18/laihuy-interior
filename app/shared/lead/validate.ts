import type { LeadDraft, LeadErrors } from './types'

/**
 * Deliberately loose: one `@`, a dot in the domain, no whitespace. Stricter patterns reject
 * addresses that are actually deliverable, and the real check is whether the reply lands.
 */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/** Vietnamese mobile numbers are 10 digits; 8 is a floor loose enough for landlines too. */
const MIN_PHONE_DIGITS = 8

/** Shorter than this is not a project brief — it is someone testing the form. */
const MIN_MESSAGE_LENGTH = 10

const countDigits = (value: string) => (value.match(/\d/g) ?? []).length

export function validateLead(draft: LeadDraft): LeadErrors {
  const errors: LeadErrors = {}

  if (!draft.name.trim()) {
    errors.name = 'required'
  }

  if (!draft.phone.trim()) {
    errors.phone = 'required'
  } else if (countDigits(draft.phone) < MIN_PHONE_DIGITS) {
    errors.phone = 'phoneFormat'
  }

  if (!draft.email.trim()) {
    errors.email = 'required'
  } else if (!EMAIL_PATTERN.test(draft.email.trim())) {
    errors.email = 'emailFormat'
  }

  if (!draft.projectType.trim()) {
    errors.projectType = 'required'
  }

  if (!draft.message.trim()) {
    errors.message = 'required'
  } else if (draft.message.trim().length < MIN_MESSAGE_LENGTH) {
    errors.message = 'tooShort'
  }

  return errors
}
