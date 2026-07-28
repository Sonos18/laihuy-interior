import { mailtoAdapter } from '~/lead/adapters/mailto'
import { validateLead } from '~/shared/lead/validate'
import { FIELD_ORDER } from '~/shared/lead/types'
import type {
  LeadAdapter,
  LeadDraft,
  LeadErrors,
  LeadFailureReason,
  LeadField
} from '~/shared/lead/types'
import type { Locale } from '~/shared/types/localization'

export type LeadStatus = 'idle' | 'submitting' | 'success' | 'error'

export type LeadSubmitOutcome = 'invalid' | 'success' | 'error'

/**
 * Owns everything the contact form does BETWEEN the user pressing submit and the page
 * showing a result: validate, dispatch to an adapter, and expose one status the template
 * can switch on. The adapter is injected so the destination can change without this file
 * (or the page) changing.
 */
export const useLeadSubmission = (adapter: LeadAdapter = mailtoAdapter) => {
  const status = ref<LeadStatus>('idle')
  const errors = ref<LeadErrors>({})
  const failureReason = ref<LeadFailureReason | null>(null)

  /** Drives focus management: the form focuses this field after a failed submit. */
  const firstInvalidField = computed<LeadField | null>(
    () => FIELD_ORDER.find(field => errors.value[field]) ?? null
  )

  const submit = async (draft: LeadDraft, locale: Locale): Promise<LeadSubmitOutcome> => {
    errors.value = validateLead(draft)

    if (firstInvalidField.value) {
      status.value = 'idle'
      return 'invalid'
    }

    status.value = 'submitting'
    failureReason.value = null

    try {
      const result = await adapter(draft, locale)

      if (result.ok) {
        status.value = 'success'
        return 'success'
      }

      failureReason.value = result.reason
    } catch {
      // An adapter that throws is the same event as one that resolves `ok: false` — the
      // lead did not arrive. Collapsing both here keeps one error path in the template.
      failureReason.value = 'unknown'
    }

    status.value = 'error'
    return 'error'
  }

  const reset = () => {
    status.value = 'idle'
    errors.value = {}
    failureReason.value = null
  }

  return { status, errors, failureReason, firstInvalidField, submit, reset }
}
