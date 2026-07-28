import type { Locale } from '~/shared/types/localization'

/** The five inputs the contact form collects. Order is the DOM/tab order. */
export type LeadField = 'name' | 'phone' | 'email' | 'projectType' | 'message'

/**
 * Field order, exported so the form can focus the FIRST invalid field rather than an
 * arbitrary one — `LeadErrors` is an object and object key order is not a contract.
 */
export const FIELD_ORDER: readonly LeadField[] = ['name', 'phone', 'email', 'projectType', 'message']

/**
 * Validation outcomes as CODES, not sentences. The bilingual strings live in
 * `app/data/ui.ts` and are resolved by `t()` in the component, which keeps this module
 * locale-free and unit-testable — the same split `app/shared/media/validation.ts` uses.
 */
export type LeadErrorCode = 'required' | 'emailFormat' | 'phoneFormat' | 'tooShort'

export type LeadDraft = Record<LeadField, string>

export type LeadErrors = Partial<Record<LeadField, LeadErrorCode>>

export type LeadFailureReason = 'network' | 'server' | 'unknown'

export type LeadResult = { ok: true } | { ok: false, reason: LeadFailureReason }

/**
 * Where a lead goes. The whole point of this indirection: swapping mailto for a Supabase
 * table, a form service, or an email API is a new function of this shape plus one line in
 * the page — no UI change.
 */
export type LeadAdapter = (draft: LeadDraft, locale: Locale) => Promise<LeadResult>
