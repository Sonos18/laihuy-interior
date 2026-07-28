import { company } from '~/data/company'
import { buildMailtoUrl } from '~/shared/lead/mailto'
import type { LeadAdapter } from '~/shared/lead/types'

/**
 * The only adapter today. It hands the lead to the visitor's own mail client, which means
 * nothing is recorded on our side — see `docs/launch-plan.md` ("Contact backend + analytics"
 * is the first technical job after launch). Replacing this with a Supabase or email-API
 * adapter is a new file of the same shape plus one line in `app/pages/lien-he.vue`.
 *
 * Always resolves `ok: true`: navigation either succeeds or leaves the page untouched, and
 * the browser gives us no signal either way. The form's "no mail app?" call fallback is what
 * covers the silent case.
 */
export const mailtoAdapter: LeadAdapter = async (draft, locale) => {
  window.location.href = buildMailtoUrl(draft, locale, company.email)

  return { ok: true }
}
