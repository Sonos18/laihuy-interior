# /lien-he Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the body of `/lien-he` so the enquiry form is the spine of the page, and give that form real validation, real submit states, and a swappable submission adapter.

**Architecture:** Pure, locale-free lead logic lives in `app/shared/lead/` (unit-tested with vitest, mirroring `app/shared/media/validation.ts`). A `LeadAdapter` function type isolates *where the lead goes* from *how the form behaves*; `mailtoAdapter` is the only adapter in this plan and preserves today's user-visible behaviour. The page collapses from three body blocks to two: a full-measure form band, then a locations band that carries a real workshop photograph plus the five contact facts regrouped into three columns. No new colours, no new hero, no footer changes.

**Tech Stack:** Nuxt 4, Vue 3.5, TypeScript, Tailwind v4 (`@theme` + `@layer components` in `app/assets/css/main.css`), vitest (unit), Playwright (VR + gates + axe).

**Spec:** `docs/superpowers/specs/2026-07-28-lien-he-redesign-design.md`

## Global Constraints

- **TypeScript always. Never `any`.** (`CLAUDE.md`)
- **pnpm, not npm.**
- **All user-visible copy is bilingual.** Strings live in `app/data/ui.ts` or `app/data/company.ts` as `LocalizedText` and are resolved with `t()` from `useLanguage()`. Never hardcode a Vietnamese or English string in a component.
- **No new colours.** `main.css` §22.1: "no component may invent a colour; new colours enter at L0 via a doc PR." Error states use `ink-950` + text + `aria-invalid`, never a new hue.
- **ESLint stylistic config:** `commaDangle: 'never'` (no trailing commas), `braceStyle: '1tbs'`, no semicolons, single quotes, 2-space indent. Run `pnpm lint` before every commit.
- **Do not touch:** `app/components/AppHero.vue`, `app/components/AppFooter.vue`, `tests/e2e/hero.spec.ts`, or any page other than `app/pages/lien-he.vue`.
- **Layout rail:** every section wraps its content in `.shell` and spaces with `.section-y`. `tests/e2e/alignment.spec.ts` asserts one left edge and one measure per page.
- **Before each commit:** `pnpm lint` and `pnpm typecheck` must pass.

---

### Task 1: Lead types and validation (pure)

**Files:**
- Create: `app/shared/lead/types.ts`
- Create: `app/shared/lead/validate.ts`
- Test: `tests/lead.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: `LeadField`, `LeadErrorCode`, `LeadDraft`, `LeadErrors`, `LeadFailureReason`, `LeadResult`, `LeadAdapter`, `FIELD_ORDER`, `validateLead(draft: LeadDraft): LeadErrors`.

- [ ] **Step 1: Write the failing test**

Create `tests/lead.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { validateLead } from '../app/shared/lead/validate'
import type { LeadDraft } from '../app/shared/lead/types'

const valid: LeadDraft = {
  name: 'Nguyen Van A',
  phone: '+84 903 102 012',
  email: 'a@example.com',
  projectType: 'Thi công nội thất khách sạn',
  message: 'Khách sạn 40 phòng tại Vĩnh Long, cần báo giá nội thất phòng ngủ.'
}

describe('validateLead', () => {
  it('accepts a complete draft', () => {
    expect(validateLead(valid)).toEqual({})
  })

  it('flags every empty field as required', () => {
    const empty: LeadDraft = { name: '', phone: '', email: '', projectType: '', message: '' }

    expect(validateLead(empty)).toEqual({
      name: 'required',
      phone: 'required',
      email: 'required',
      projectType: 'required',
      message: 'required'
    })
  })

  it('treats whitespace-only input as empty', () => {
    expect(validateLead({ ...valid, name: '   ' }).name).toBe('required')
  })

  it('rejects a malformed email', () => {
    expect(validateLead({ ...valid, email: 'a@example' }).email).toBe('emailFormat')
    expect(validateLead({ ...valid, email: 'a.example.com' }).email).toBe('emailFormat')
    expect(validateLead({ ...valid, email: 'a b@example.com' }).email).toBe('emailFormat')
  })

  it('accepts a phone written with spaces, dashes or parentheses', () => {
    expect(validateLead({ ...valid, phone: '(028) 3822-1234' }).phone).toBeUndefined()
    expect(validateLead({ ...valid, phone: '0903102012' }).phone).toBeUndefined()
  })

  it('rejects a phone with fewer than 8 digits', () => {
    expect(validateLead({ ...valid, phone: '090 310' }).phone).toBe('phoneFormat')
  })

  it('rejects a message shorter than 10 characters', () => {
    expect(validateLead({ ...valid, message: 'Bao gia' }).message).toBe('tooShort')
  })

  it('reports errors for several fields at once', () => {
    expect(validateLead({ ...valid, email: 'nope', message: '' })).toEqual({
      email: 'emailFormat',
      message: 'required'
    })
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm vitest run tests/lead.test.ts`
Expected: FAIL — `Failed to resolve import "../app/shared/lead/validate"`.

- [ ] **Step 3: Write the types**

Create `app/shared/lead/types.ts`:

```ts
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

// One line, not a multi-line union: @stylistic/operator-linebreak rejects a trailing `=`
// with the members indented beneath it.
export type LeadResult = { ok: true } | { ok: false, reason: LeadFailureReason }

/**
 * Where a lead goes. The whole point of this indirection: swapping mailto for a Supabase
 * table, a form service, or an email API is a new function of this shape plus one line in
 * the page — no UI change. See the spec's "Ngoài phạm vi" section.
 */
export type LeadAdapter = (draft: LeadDraft, locale: Locale) => Promise<LeadResult>
```

- [ ] **Step 4: Write the validator**

Create `app/shared/lead/validate.ts`:

```ts
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
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `pnpm vitest run tests/lead.test.ts`
Expected: PASS — 8 tests.

- [ ] **Step 6: Lint, typecheck, commit**

```bash
pnpm lint
pnpm typecheck
git add app/shared/lead tests/lead.test.ts
git commit -m "feat(lead): add pure lead types and validation"
```

---

### Task 2: Mailto builder and adapter

**Files:**
- Create: `app/shared/lead/mailto.ts`
- Create: `app/lead/adapters/mailto.ts`
- Modify: `tests/lead.test.ts` (append a second `describe`)

**Interfaces:**
- Consumes: `LeadDraft`, `LeadAdapter`, `LeadResult` from `app/shared/lead/types.ts` (Task 1).
- Produces: `buildMailtoUrl(draft: LeadDraft, locale: Locale, to: string): string`, `mailtoAdapter: LeadAdapter`.

- [ ] **Step 1: Write the failing test**

Append to `tests/lead.test.ts`:

```ts
import { buildMailtoUrl } from '../app/shared/lead/mailto'

describe('buildMailtoUrl', () => {
  it('addresses the mail to the given recipient', () => {
    const url = buildMailtoUrl(valid, 'vi', 'noithatlaihuy@gmail.com')

    expect(url.startsWith('mailto:noithatlaihuy@gmail.com?')).toBe(true)
  })

  it('puts the project type in the Vietnamese subject', () => {
    const url = buildMailtoUrl(valid, 'vi', 'to@example.com')
    // `searchParams.get` decodes for us — decoding a second time throws on a literal `%`.
    const subject = new URL(url).searchParams.get('subject') ?? ''

    expect(subject).toBe('Yêu cầu tư vấn dự án - Thi công nội thất khách sạn')
  })

  it('switches the subject to English for the en locale', () => {
    const url = buildMailtoUrl(valid, 'en', 'to@example.com')
    // `searchParams.get` decodes for us — decoding a second time throws on a literal `%`.
    const subject = new URL(url).searchParams.get('subject') ?? ''

    expect(subject).toBe('Project consultation request - Thi công nội thất khách sạn')
  })

  it('falls back to the company name when no project type is chosen', () => {
    const url = buildMailtoUrl({ ...valid, projectType: '' }, 'vi', 'to@example.com')
    // `searchParams.get` decodes for us — decoding a second time throws on a literal `%`.
    const subject = new URL(url).searchParams.get('subject') ?? ''

    expect(subject).toBe('Yêu cầu tư vấn dự án - Lai Huy Interior')
  })

  it('lists every field in the body', () => {
    const url = buildMailtoUrl(valid, 'vi', 'to@example.com')
    const body = new URL(url).searchParams.get('body') ?? ''

    expect(body).toContain('Họ tên: Nguyen Van A')
    expect(body).toContain('Email: a@example.com')
    expect(body).toContain('Điện thoại: +84 903 102 012')
    expect(body).toContain('Loại dự án: Thi công nội thất khách sạn')
    expect(body).toContain(valid.message)
  })

  it('percent-encodes characters that would break the URL', () => {
    const url = buildMailtoUrl({ ...valid, message: 'Giá & tiến độ? 100%' }, 'vi', 'to@example.com')

    // `&` and `%` are the two characters that would truncate or corrupt the query string.
    expect(url).toContain('%26')
    expect(url).toContain('100%25')
    expect(url).not.toContain('Giá & tiến độ? 100%')
    expect(new URL(url).searchParams.get('body')).toContain('Giá & tiến độ? 100%')
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm vitest run tests/lead.test.ts`
Expected: FAIL — `Failed to resolve import "../app/shared/lead/mailto"`.

- [ ] **Step 3: Write the builder**

Create `app/shared/lead/mailto.ts`:

```ts
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
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `pnpm vitest run tests/lead.test.ts`
Expected: PASS — 14 tests.

- [ ] **Step 5: Write the adapter**

Create `app/lead/adapters/mailto.ts`:

```ts
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
```

- [ ] **Step 6: Lint, typecheck, commit**

```bash
pnpm lint
pnpm typecheck
git add app/shared/lead/mailto.ts app/lead tests/lead.test.ts
git commit -m "feat(lead): extract the mailto builder and wrap it as an adapter"
```

---

### Task 3: Submission state machine

**Files:**
- Create: `app/composables/useLeadSubmission.ts`

**Interfaces:**
- Consumes: `validateLead` (Task 1), `mailtoAdapter` (Task 2), all types from `app/shared/lead/types.ts`.
- Produces: `useLeadSubmission(adapter?: LeadAdapter)` returning `{ status, errors, failureReason, firstInvalidField, submit, reset }`. `submit(draft, locale)` returns `Promise<'invalid' | 'success' | 'error'>`.

There is no unit test for this task: it is a thin Vue-reactive wrapper whose logic (validation, URL building) is already covered by Tasks 1–2, and whose behaviour is asserted end-to-end in Task 7. Adding `@vue/test-utils` for six lines of glue would be the only reason this repo needed it.

- [ ] **Step 1: Write the composable**

Create `app/composables/useLeadSubmission.ts`:

```ts
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
```

- [ ] **Step 2: Verify it compiles**

Run: `pnpm typecheck`
Expected: no errors.

- [ ] **Step 3: Lint and commit**

```bash
pnpm lint
git add app/composables/useLeadSubmission.ts
git commit -m "feat(lead): add the submission state machine composable"
```

---

### Task 4: Bilingual form copy

**Files:**
- Modify: `app/data/ui.ts` (append a `form` block to the `uiText` object, after `cta`)

**Interfaces:**
- Consumes: `LeadErrorCode` values from Task 1 — the keys of `uiText.form.errors` must be exactly `required`, `emailFormat`, `phoneFormat`, `tooShort`.
- Produces: `uiText.form.*`, consumed by Task 6.

- [ ] **Step 1: Add the copy block**

In `app/data/ui.ts`, insert this after the closing brace of the `cta` block and before `projectFacts`:

```ts
  form: {
    heading: { vi: 'Gửi yêu cầu tư vấn dự án', en: 'Send a project consultation request' },
    intro: {
      vi: 'Điền thông tin công trình, Lai Huy Interior phản hồi phương án sản xuất và thi công trong 24 giờ làm việc.',
      en: 'Tell us about the project and Lai Huy Interior will respond with a production and contracting approach within 24 working hours.'
    },
    orCall: { vi: 'hoặc gọi ngay', en: 'or call us now' },
    name: { vi: 'Họ tên', en: 'Name' },
    namePlaceholder: { vi: 'Tên của bạn', en: 'Your name' },
    phonePlaceholder: { vi: '+84...', en: '+84...' },
    emailPlaceholder: { vi: 'email@example.com', en: 'email@example.com' },
    projectType: { vi: 'Loại dự án', en: 'Project type' },
    projectTypePlaceholder: { vi: 'Chọn loại dự án', en: 'Select project type' },
    message: { vi: 'Thông tin công trình', en: 'Project information' },
    messagePlaceholder: {
      vi: 'Quy mô, số phòng, vật liệu mong muốn, tiến độ dự kiến...',
      en: 'Scale, room count, preferred materials, target schedule...'
    },
    submit: { vi: 'Gửi yêu cầu', en: 'Send request' },
    submitting: { vi: 'Đang gửi...', en: 'Sending...' },
    /** The hero promises "gửi bản vẽ, BOQ" but the form has no upload — this is the honest route. */
    attachmentNote: { vi: 'Có bản vẽ hoặc BOQ? Gửi kèm qua', en: 'Have drawings or a BOQ? Send them to' },
    mailtoNote: {
      vi: 'Biểu mẫu mở ứng dụng email trên thiết bị của bạn với nội dung đã điền sẵn.',
      en: 'This form opens your email app with a prepared message.'
    },
    noEmailApp: { vi: 'Không mở được email?', en: 'No email app?' },
    call: { vi: 'Gọi', en: 'Call' },
    responsePromise: { vi: 'Phản hồi trong 24 giờ làm việc', en: 'A reply within 24 working hours' },
    errors: {
      required: { vi: 'Vui lòng điền thông tin này.', en: 'This field is required.' },
      emailFormat: { vi: 'Email chưa đúng định dạng.', en: 'That email address is not valid.' },
      phoneFormat: { vi: 'Số điện thoại chưa đủ chữ số.', en: 'That phone number is too short.' },
      tooShort: { vi: 'Vui lòng mô tả thêm về công trình.', en: 'Please describe the project in a little more detail.' }
    },
    errorSummary: {
      vi: 'Biểu mẫu còn thông tin chưa hợp lệ. Vui lòng kiểm tra các ô được đánh dấu.',
      en: 'The form has invalid fields. Please check the marked inputs.'
    },
    successHeading: { vi: 'Đã mở email của bạn', en: 'Your email app is open' },
    successBody: {
      vi: 'Nội dung đã được điền sẵn — bạn chỉ cần bấm gửi. Lai Huy Interior sẽ phản hồi trong 24 giờ làm việc.',
      en: 'The message is prepared — just press send. Lai Huy Interior will reply within 24 working hours.'
    },
    successReset: { vi: 'Gửi một yêu cầu khác', en: 'Send another request' },
    failureHeading: { vi: 'Chưa gửi được', en: 'That did not go through' },
    failureBody: {
      vi: 'Vui lòng thử lại, hoặc gọi trực tiếp để được tư vấn ngay.',
      en: 'Please try again, or call us directly for immediate help.'
    },
    retry: { vi: 'Thử lại', en: 'Try again' }
  },
```

- [ ] **Step 2: Verify it compiles**

Run: `pnpm typecheck`
Expected: no errors.

- [ ] **Step 3: Lint and commit**

```bash
pnpm lint
git add app/data/ui.ts
git commit -m "feat(contact): add bilingual copy for the enquiry form"
```

---

### Task 5: Form control tokens and classes

**Files:**
- Modify: `app/assets/css/main.css` — add an L2 token block in `:root` (after the footer block, before `--subnav-h`), and component classes in the `@layer components` block that already holds `.btn-primary` / `.industrial-card`.

**Interfaces:**
- Consumes: existing `--color-ink-*` / `--color-wood-*` primitives.
- Produces: CSS classes `.field`, `.field-label`, `.field-error`, `.field-group`, used by Task 6.

- [ ] **Step 1: Add the tokens**

In `app/assets/css/main.css`, inside `:root`, immediately before the `/* ── L3 · Project sub-nav …` comment:

```css
  /* ── L2 · Form controls (consumed by /lien-he) ──────────────────────────── */
  /* The contact form is the only place the site takes input, and its five controls
     shipped as the same six utility classes copy-pasted inline five times. One class,
     one token row.

     NO ERROR COLOUR. §22.1 forbids a component inventing a hue, and an error state is
     not worth opening the palette for one page: an invalid field is marked by a heavier
     ink-950 border, a message directly beneath it, and aria-invalid. That satisfies
     WCAG 1.4.1 (colour is never the sole carrier) by construction rather than by luck. */
  --field-radius: 0.75rem;
  --field-px: 1rem;
  --field-py: 0.75rem;
  --field-border: var(--color-ink-200);
  /* wood-600 = --accent-light. wood-500 measures 4.29–4.31:1 on these surfaces and fails
     the AA floor — the same reason `.eyebrow` is wood-600. */
  --field-border-focus: var(--color-wood-600);
  --field-border-error: var(--color-ink-950);
  --field-border-w: 1px;
  --field-border-w-error: 2px;
```

- [ ] **Step 2: Add the component classes**

In the same file, in the `@layer components` block, immediately after the `.industrial-card` rule:

```css
  .field-group {
    @apply block;
  }

  .field-label {
    @apply mb-2 block text-sm font-bold text-ink-800;
  }

  .field {
    width: 100%;
    border: var(--field-border-w) solid var(--field-border);
    border-radius: var(--field-radius);
    padding: var(--field-py) var(--field-px);
    background-color: #fff;
    color: var(--color-ink-950);
    transition: border-color var(--dur-hover) var(--ease-editorial);
  }

  /* A colour swap alone is not a focus indicator — it disappears for anyone who cannot
     distinguish the two browns, and it was the previous `outline-none focus:border-wood-500`
     treatment. The ring is the indicator; the border change is decoration on top of it. */
  .field:focus-visible {
    outline: 2px solid var(--field-border-focus);
    outline-offset: 2px;
    border-color: var(--field-border-focus);
  }

  .field[aria-invalid="true"] {
    border-width: var(--field-border-w-error);
    border-color: var(--field-border-error);
  }

  .field-error {
    @apply mt-2 text-sm font-semibold text-ink-950;
  }
```

- [ ] **Step 3: Verify the stylesheet still compiles**

Run: `curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/lien-he` (with `pnpm dev` running)
Expected: `200`. A PostCSS syntax error returns `500` with the parse error in the body.

- [ ] **Step 4: Lint and commit**

```bash
pnpm lint
git add app/assets/css/main.css
git commit -m "feat(css): add form control tokens and field classes"
```

---

### Task 6: Rebuild the page body

**Files:**
- Modify: `app/pages/lien-he.vue` — replace everything from line 19 (`const form = reactive(...)`) through the end of the file. The `<script setup>` header (imports, `useLanguage`, `heroAsset`/`heroImage`) and the `usePageSeo` block are kept as they are.

**Interfaces:**
- Consumes: `useLeadSubmission` (Task 3), `uiText.form.*` (Task 4), `.field` classes (Task 5), `LeadDraft`/`LeadField`/`FIELD_ORDER` (Task 1).
- Produces: the finished page. Nothing consumes it.

This task deletes the five `industrial-card` contact cards, the Google Maps `<iframe>`, and the duplicate address list. All five facts those cards carried survive — regrouped into the three columns of Band 2 — and the two addresses end up on the page exactly once.

The five cards were never five peer items: they are **two locations, two channels, and one schedule**. That is why a 3-column grid holding 5 cards always leaves exactly one cell empty (measured at 1440px: 413×206px, 17% of the grid). Grouping by the three real kinds fills three columns with nothing left over, and needs no invented sixth item — there is none available anyway: `company.facebook` is the only unused contact field in `app/data/`, and `AppFooter` already renders it.

- [ ] **Step 1: Replace the script body**

In `app/pages/lien-he.vue`, replace lines 19–92 (from `const form = reactive({` through the closing brace of `submitForm`) with:

```ts
// A real photograph of the workshop, not a map tile: "we have a factory" is the claim this
// page has to support, and the building makes it better than a grey embed did. Same
// filename lookup `nha-xuong.vue` uses, so section assignments are not tied to array order.
const workshopByFile: Record<string, MediaAsset> = Object.fromEntries(
  workshopMedia.map(asset => [asset.path.slice(asset.path.lastIndexOf('/') + 1), asset])
)

const locationImage = withAlt(workshopByFile['1.webp'] as MediaAsset, {
  vi: 'Nhà xưởng sản xuất nội thất của Lai Huy Interior',
  en: 'The Lai Huy Interior manufacturing workshop'
})

const form = reactive<LeadDraft>({
  name: '',
  phone: '',
  email: '',
  projectType: '',
  message: ''
})

// One id per field, so every <label for>, aria-describedby and focus() call refers to the
// same element without hand-written ids that could collide with the header or footer.
const fieldIds: Record<LeadField, string> = {
  name: useId(),
  phone: useId(),
  email: useId(),
  projectType: useId(),
  message: useId()
}

const errorId = (field: LeadField) => `${fieldIds[field]}-error`

const { status, errors, firstInvalidField, submit, reset } = useLeadSubmission()

// Resolve the error CODE to a sentence here rather than indexing `uiText.form.errors` in
// the template: vue-tsc does not narrow `errors.name` to a defined key across the `v-if`
// boundary, so the inline form fails typecheck. One function, five call sites, no cast.
const errorText = (field: LeadField) => {
  const code = errors.value[field]

  return code ? t(uiText.form.errors[code]) : ''
}

const projectTypes = computed(() => [
  t({ vi: 'Thi công nội thất khách sạn', en: 'Hotel interior contracting' }),
  t({ vi: 'Sản xuất nội thất tại xưởng', en: 'Factory furniture production' }),
  t({ vi: 'Villa / căn hộ / nhà phố', en: 'Villa / apartment / townhouse' }),
  t({ vi: 'Thương mại / văn phòng', en: 'Commercial / office' }),
  t({ vi: 'Gia công theo bản vẽ / xuất khẩu', en: 'Production from drawings / export' })
])

const telHref = computed(() => `tel:${company.phone.replaceAll(' ', '')}`)

const onSubmit = async () => {
  const outcome = await submit(form, locale.value)

  // Moving focus to the first bad field is what makes the error state usable without a
  // mouse; the summary alert alone leaves a keyboard user hunting.
  if (outcome === 'invalid' && firstInvalidField.value) {
    await nextTick()
    document.getElementById(fieldIds[firstInvalidField.value])?.focus()
  }
}

const startOver = () => {
  reset()
  Object.assign(form, { name: '', phone: '', email: '', projectType: '', message: '' })
}
```

- [ ] **Step 2: Update the script imports**

Replace the import block at the top of `app/pages/lien-he.vue` (lines 2–5) with:

```ts
import { company } from '~/data/company'
import { uiText } from '~/data/ui'
import { projectMedia, workshopMedia } from '~/media/catalog.generated'
import { withAlt } from '~/media/project-media'
import type { MediaAsset } from '~/shared/media/types'
import type { LeadDraft, LeadField } from '~/shared/lead/types'
```

Change the existing destructure to pull `locale` as well — `onSubmit` passes it to the adapter,
and `ta` is still used by Band 2's working hours:

```ts
const { t, ta, locale } = useLanguage()
```

- [ ] **Step 3: Replace the template body**

In `app/pages/lien-he.vue`, replace both `<section>` elements (everything after the `<AppHero … />` tag and before the closing `</div>`) with:

```vue
    <!-- Band 1 — the request. The form is the page: it is the first thing under the hero, it
         gets the full measure, and it is not wrapped in a card. A white card on a white section
         is an outline that carries no information; the fields have their own borders and that
         is the boundary. Contact facts live in Band 2, below — this band is one job only. -->
    <section class="section-y bg-white">
      <div class="shell">
        <div class="max-w-3xl">
          <p class="eyebrow">
            {{ t(uiText.cta.quote24h) }}
          </p>
          <h2 class="text-section-title mt-4 font-black uppercase text-ink-950">
            {{ t(uiText.form.heading) }}
          </h2>
          <p class="mt-4 max-w-2xl text-base leading-7 text-ink-600">
            {{ t(uiText.form.intro) }}
          </p>

          <!-- Band 2 carries the phone number too, but it sits after the whole form. Many
               visitors would rather call than type; this line puts that one step from the
               heading at every viewport. -->
          <p class="mt-3 text-base text-ink-600">
            {{ t(uiText.form.orCall) }}
            <a
              :href="telHref"
              class="font-bold text-wood-600 underline underline-offset-2 hover:text-wood-700"
            >{{ company.phone }}</a>
          </p>

          <!-- SUCCESS — the form is replaced, not merely annotated: leaving a filled form on
               screen next to a "sent" message invites a second submission. -->
          <div
            v-if="status === 'success'"
            class="mt-10 rounded-2xl border border-ink-200 bg-ink-50 p-6 md:p-8"
            role="status"
          >
            <h3 class="text-xl font-black text-ink-950">
              {{ t(uiText.form.successHeading) }}
            </h3>
            <p class="mt-3 text-sm leading-6 text-ink-600">
              {{ t(uiText.form.successBody) }}
            </p>
            <button
              type="button"
              class="btn-outline mt-6"
              @click="startOver"
            >
              {{ t(uiText.form.successReset) }}
            </button>
          </div>

          <!-- `novalidate`: validation is ours. Without it the browser's own bubble fires
               first, in the browser's language rather than the site's, and our bilingual
               messages never render. -->
          <form
            v-else
            class="mt-10 space-y-6"
            novalidate
            @submit.prevent="onSubmit"
          >
            <div
              v-if="firstInvalidField"
              class="rounded-2xl border-2 border-ink-950 px-5 py-4 text-sm font-semibold text-ink-950"
              role="alert"
            >
              {{ t(uiText.form.errorSummary) }}
            </div>

            <div class="grid gap-6 md:grid-cols-2">
              <div class="field-group">
                <label
                  class="field-label"
                  :for="fieldIds.name"
                >{{ t(uiText.form.name) }}</label>
                <input
                  :id="fieldIds.name"
                  v-model="form.name"
                  type="text"
                  autocomplete="name"
                  class="field"
                  :placeholder="t(uiText.form.namePlaceholder)"
                  :aria-invalid="errors.name ? 'true' : undefined"
                  :aria-describedby="errors.name ? errorId('name') : undefined"
                >
                <p
                  v-if="errors.name"
                  :id="errorId('name')"
                  class="field-error"
                >
                  {{ errorText('name') }}
                </p>
              </div>

              <div class="field-group">
                <label
                  class="field-label"
                  :for="fieldIds.phone"
                >{{ t(uiText.labels.phone) }}</label>
                <input
                  :id="fieldIds.phone"
                  v-model="form.phone"
                  type="tel"
                  autocomplete="tel"
                  class="field"
                  :placeholder="t(uiText.form.phonePlaceholder)"
                  :aria-invalid="errors.phone ? 'true' : undefined"
                  :aria-describedby="errors.phone ? errorId('phone') : undefined"
                >
                <p
                  v-if="errors.phone"
                  :id="errorId('phone')"
                  class="field-error"
                >
                  {{ errorText('phone') }}
                </p>
              </div>
            </div>

            <div class="grid gap-6 md:grid-cols-2">
              <div class="field-group">
                <label
                  class="field-label"
                  :for="fieldIds.email"
                >{{ t(uiText.labels.email) }}</label>
                <input
                  :id="fieldIds.email"
                  v-model="form.email"
                  type="email"
                  autocomplete="email"
                  class="field"
                  :placeholder="t(uiText.form.emailPlaceholder)"
                  :aria-invalid="errors.email ? 'true' : undefined"
                  :aria-describedby="errors.email ? errorId('email') : undefined"
                >
                <p
                  v-if="errors.email"
                  :id="errorId('email')"
                  class="field-error"
                >
                  {{ errorText('email') }}
                </p>
              </div>

              <div class="field-group">
                <label
                  class="field-label"
                  :for="fieldIds.projectType"
                >{{ t(uiText.form.projectType) }}</label>
                <select
                  :id="fieldIds.projectType"
                  v-model="form.projectType"
                  class="field"
                  :aria-invalid="errors.projectType ? 'true' : undefined"
                  :aria-describedby="errors.projectType ? errorId('projectType') : undefined"
                >
                  <option value="">
                    {{ t(uiText.form.projectTypePlaceholder) }}
                  </option>
                  <option
                    v-for="type in projectTypes"
                    :key="type"
                    :value="type"
                  >
                    {{ type }}
                  </option>
                </select>
                <p
                  v-if="errors.projectType"
                  :id="errorId('projectType')"
                  class="field-error"
                >
                  {{ errorText('projectType') }}
                </p>
              </div>
            </div>

            <div class="field-group">
              <label
                class="field-label"
                :for="fieldIds.message"
              >{{ t(uiText.form.message) }}</label>
              <textarea
                :id="fieldIds.message"
                v-model="form.message"
                rows="6"
                class="field"
                :placeholder="t(uiText.form.messagePlaceholder)"
                :aria-invalid="errors.message ? 'true' : undefined"
                :aria-describedby="errors.message ? errorId('message') : undefined"
              />
              <p
                v-if="errors.message"
                :id="errorId('message')"
                class="field-error"
              >
                {{ errorText('message') }}
              </p>
            </div>

            <!-- The hero says "gửi bản vẽ, BOQ" and the form has no file input. Rather than
                 build upload infrastructure for a destination that is not chosen yet, say
                 where drawings should go. -->
            <p class="text-sm leading-6 text-ink-600">
              {{ t(uiText.form.attachmentNote) }}
              <a
                :href="`mailto:${company.email}`"
                class="font-bold text-wood-600 underline underline-offset-2 hover:text-wood-700"
              >{{ company.email }}</a>
            </p>

            <button
              type="submit"
              class="btn-dark w-full md:w-auto"
              :disabled="status === 'submitting'"
            >
              {{ status === 'submitting' ? t(uiText.form.submitting) : t(uiText.form.submit) }}
            </button>

            <div
              v-if="status === 'error'"
              class="rounded-2xl border-2 border-ink-950 px-5 py-4"
              role="alert"
            >
              <p class="text-sm font-bold text-ink-950">
                {{ t(uiText.form.failureHeading) }}
              </p>
              <p class="mt-2 text-sm leading-6 text-ink-600">
                {{ t(uiText.form.failureBody) }}
                <a
                  :href="telHref"
                  class="font-bold text-wood-600 underline underline-offset-2 hover:text-wood-700"
                >{{ t(uiText.form.call) }} {{ company.phone }}</a>
              </p>
            </div>

            <p class="text-sm leading-6 text-ink-600">
              {{ t(uiText.form.mailtoNote) }}
            </p>
          </form>
        </div>

      </div>
    </section>

    <!-- Band 2 — where we are and how to reach us. Replaces BOTH the five contact cards and
         the map column. Every fact those cards carried is still here; what changed is that
         they are grouped by KIND (two locations, one channel column) instead of being five
         identical boxes in a grid that could never hold five evenly. The two addresses now
         appear once on this page instead of three times, and the proof that there is a real
         factory is a photograph of it. -->
    <section class="section-y bg-ink-50">
      <div class="shell">
        <p class="eyebrow">
          {{ t({ vi: 'Địa điểm', en: 'Locations' }) }}
        </p>
        <h2 class="text-section-title mt-4 font-black uppercase text-ink-950">
          {{ t({ vi: 'Văn phòng và nhà xưởng', en: 'Office and factory' }) }}
        </h2>

        <!-- Natural aspect ratio via inline style, no crop — the pattern `nha-xuong.vue:322`
             already uses for this exact photograph. The site does not crop photographs. -->
        <MediaImage
          :image="locationImage"
          preset="full"
          class="mt-10 w-full"
          :style="{ aspectRatio: `${locationImage.width} / ${locationImage.height}` }"
          img-class="rounded-2xl"
        />

        <!-- Three groups, three columns, no empty cell at any breakpoint. There is no 2-column
             step on purpose: three groups across two columns re-creates the ragged row this
             replaces. Below lg they simply stack. -->
        <div class="mt-10 grid gap-10 lg:grid-cols-3">
          <dl
            v-for="address in company.addresses"
            :key="t(address.label)"
          >
            <dt class="eyebrow">
              {{ t(address.label) }}
            </dt>
            <dd class="mt-3 text-base leading-7 text-ink-700">
              {{ t(address.address) }}
            </dd>
            <dd class="mt-3">
              <a
                :href="address.mapUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="text-sm font-bold text-wood-600 underline underline-offset-2 hover:text-wood-700"
              >
                {{ t(uiText.labels.openMaps) }}
              </a>
            </dd>
          </dl>

          <!-- The third column: the three facts the phone/email/hours cards used to carry,
               as label/value pairs. Same vocabulary as the footer's contact column, so the
               page does not invent a second way to present the same three things — and no
               icons, which is the idiom main.css:1256 removed from the footer. -->
          <div>
            <p class="eyebrow">
              {{ t(uiText.labels.contact) }}
            </p>
            <p class="mt-3 text-base font-bold leading-6 text-ink-950">
              {{ t(uiText.form.responsePromise) }}
            </p>

            <dl class="mt-6 space-y-5">
              <div>
                <dt class="text-xs font-semibold uppercase tracking-[0.22em] text-ink-500">
                  {{ t(uiText.labels.phone) }}
                </dt>
                <dd class="mt-2">
                  <a
                    :href="telHref"
                    class="text-base font-bold text-ink-950 hover:text-wood-600"
                  >{{ company.phone }}</a>
                </dd>
              </div>

              <div>
                <dt class="text-xs font-semibold uppercase tracking-[0.22em] text-ink-500">
                  {{ t(uiText.labels.email) }}
                </dt>
                <dd class="mt-2">
                  <a
                    :href="`mailto:${company.email}`"
                    class="break-all text-base text-ink-700 hover:text-wood-600"
                  >{{ company.email }}</a>
                </dd>
              </div>

              <div>
                <dt class="text-xs font-semibold uppercase tracking-[0.22em] text-ink-500">
                  {{ t(uiText.labels.workingHours) }}
                </dt>
                <dd class="mt-2 text-base text-ink-700">
                  <span
                    v-for="line in ta(company.workingHours)"
                    :key="line"
                    class="block"
                  >{{ line }}</span>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>
```

- [ ] **Step 4: Check it renders**

With `pnpm dev` running, open `http://localhost:3000/lien-he` and confirm:
- No contact-card grid, no map iframe.
- Each address appears once in the page body; phone, email and working hours appear once each.
- Band 2's three columns are full at `lg` — **no empty grid cell**. Resize down through 1024px
  and 768px: the columns stack, and no ragged half-row appears at any width.
- The longest address (`Lô Q-2, đường số 8, KCN Long Hậu mở rộng, Ấp 3, Xã Cần Giuộc, Tỉnh Tây
  Ninh`) sets in at most three lines at 1024px. More than that means the column is too narrow —
  see the spec's Risk #3.
- Submitting the empty form shows the summary alert, marks fields, and moves focus to "Họ tên".
- Filling it in and submitting opens the mail client and swaps the form for the success block.

- [ ] **Step 5: Lint, typecheck, commit**

```bash
pnpm lint
pnpm typecheck
git add app/pages/lien-he.vue
git commit -m "feat(contact): rebuild the page around the enquiry form"
```

---

### Task 7: End-to-end form behaviour test

**Files:**
- Create: `tests/e2e/contact-form.spec.ts`

**Interfaces:**
- Consumes: the rendered page from Task 6.
- Produces: nothing.

- [ ] **Step 1: Write the test**

Create `tests/e2e/contact-form.spec.ts`:

```ts
import { expect, test } from './fixtures'

/**
 * The form's behaviour gate. axe (a11y.spec.ts) checks the page's static markup; it cannot
 * press submit, so the invalid and success states are only ever exercised here.
 */
test.describe('contact form', () => {
  test('an empty submit is blocked, announced and focused', async ({ page }) => {
    await page.goto('/lien-he')

    await page.getByRole('button', { name: /Gửi yêu cầu/ }).click()

    // Still on the page: nothing was dispatched.
    await expect(page).toHaveURL(/\/lien-he$/)

    await expect(page.getByRole('alert')).toBeVisible()

    const name = page.getByLabel('Họ tên')
    await expect(name).toHaveAttribute('aria-invalid', 'true')
    await expect(name).toBeFocused()

    // The message is wired to the input, not merely placed near it.
    const describedBy = await name.getAttribute('aria-describedby')
    expect(describedBy).toBeTruthy()
    await expect(page.locator(`#${describedBy}`)).toBeVisible()
  })

  test('a malformed email is reported on that field alone', async ({ page }) => {
    await page.goto('/lien-he')

    await page.getByLabel('Họ tên').fill('Nguyen Van A')
    await page.getByLabel('Điện thoại').fill('0903102012')
    await page.getByLabel('Email').fill('not-an-email')
    await page.getByLabel('Loại dự án').selectOption({ index: 1 })
    await page.getByLabel('Thông tin công trình').fill('Khách sạn 40 phòng tại Vĩnh Long.')

    await page.getByRole('button', { name: /Gửi yêu cầu/ }).click()

    await expect(page.getByLabel('Email')).toHaveAttribute('aria-invalid', 'true')
    await expect(page.getByLabel('Họ tên')).not.toHaveAttribute('aria-invalid', 'true')
  })

  test('a valid submit reaches the success state', async ({ page }) => {
    await page.goto('/lien-he')

    // The mailto adapter navigates the page. Swallow it so the assertion runs against the
    // success state rather than a half-torn-down page.
    await page.route('mailto:**', route => route.abort())

    await page.getByLabel('Họ tên').fill('Nguyen Van A')
    await page.getByLabel('Điện thoại').fill('0903102012')
    await page.getByLabel('Email').fill('a@example.com')
    await page.getByLabel('Loại dự án').selectOption({ index: 1 })
    await page.getByLabel('Thông tin công trình').fill('Khách sạn 40 phòng tại Vĩnh Long.')

    await page.getByRole('button', { name: /Gửi yêu cầu/ }).click()

    await expect(page.getByRole('status')).toContainText('Đã mở email của bạn')
  })
})
```

- [ ] **Step 2: Run it**

Run: `npx playwright test --project=vr contact-form.spec.ts`
Expected: 3 passed.

If the `mailto:` route interception does not fire in Chromium, replace that line with
`await page.addInitScript(() => { Object.defineProperty(window, 'location', { value: { ...window.location, set href(_v) {} } }) })`
and note the reason in a comment. Do not delete the assertion.

- [ ] **Step 3: Commit**

```bash
git add tests/e2e/contact-form.spec.ts
git commit -m "test(contact): gate the form's invalid and success states"
```

---

### Task 8: Full verification and baseline approval

**Files:**
- Modify: `docs/launch-plan.md` (tasks 3.8 and 3.9)
- Modify: `tests/e2e/visual.spec.ts-snapshots/contact-{390,768,1440}-vr-win32.png` (regenerated, separate commit)

**Interfaces:**
- Consumes: everything above.
- Produces: a green suite.

- [ ] **Step 1: Run every non-pixel check**

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm run test:gates
pnpm run test:gates:text
pnpm run test:gates:a11y
```

Expected: all pass. `test:gates:a11y` must report **0 violations** on `/lien-he` — the new form is the only place on the site with labelled inputs, so a regression here shows up as an axe `label` or `aria-valid-attr-value` failure.

- [ ] **Step 2: Update the launch plan**

In `docs/launch-plan.md`, amend the row for task 3.8 to record the reversal:

```markdown
| 3.8 | ↩️ **Superseded (2026-07-28)** — iframe Google Maps đã được gỡ khỏi `/lien-he` trong đợt redesign trang liên hệ. Thay bằng ảnh nhà xưởng thật + 2 địa chỉ kèm link "Mở Google Maps". Lý do: embed bên thứ ba nặng, là template tell, và phải mask trong VR suite; ảnh xưởng chứng minh năng lực tốt hơn ô bản đồ. Xem `docs/superpowers/specs/2026-07-28-lien-he-redesign-design.md` | | — |
```

Amend task 3.9 to note the form now validates and has real states:

```markdown
| 3.9 | ✅ **Done (2026-07-23)**, mở rộng 2026-07-28 — disclosure mailto + status `aria-live` + fallback "Gọi {số}". Đợt redesign bổ sung: validation song ngữ, `aria-invalid` + `aria-describedby`, focus về field lỗi đầu tiên, trạng thái success/error, và interface `LeadAdapter` để chốt backend sau | `lien-he.vue`, `app/shared/lead/` | 2h |
```

- [ ] **Step 3: Commit the docs**

```bash
git add docs/launch-plan.md
git commit -m "docs: record the /lien-he redesign in the launch plan"
```

- [ ] **Step 4: Confirm the only pixel diffs are the contact page**

Run: `pnpm run test:vr`
Expected: FAIL on exactly `contact @ 390`, `contact @ 768`, `contact @ 1440`. **Any other page failing means the change leaked** — stop and investigate before approving.

- [ ] **Step 5: Approve the new baselines in a commit of their own**

`docs/header-footer-art-direction.md` §41: baselines are approval artefacts and are approved "in a commit containing nothing else".

```bash
pnpm run test:vr:approve
pnpm run test:vr
git add tests/e2e/visual.spec.ts-snapshots
git commit -m "test(vr): rebaseline contact for the redesigned enquiry page"
```

Expected: the second `test:vr` run passes 124/124.

---

## Self-Review

**Spec coverage**

| Spec section | Task |
|---|---|
| Bố cục hai band | 6 |
| Form không nằm trong card | 6 |
| Dòng "hoặc gọi ngay" trước field đầu | 6 |
| Band 2 ba cột: 2 địa chỉ + 1 cột kênh liên hệ (`<dl>`), 0 ô trống | 6 |
| Heading `h2` + `.text-section-title` | 6 |
| `.field` + token L2, focus-visible | 5 |
| `validateLead` + mã lỗi | 1 |
| Chuỗi song ngữ cho lỗi/nhãn/trạng thái | 4 |
| State machine idle/submitting/success/error | 3 |
| `aria-invalid`, `aria-describedby`, focus field lỗi đầu | 6, gated by 7 |
| `LeadAdapter` + mailtoAdapter | 2 |
| Band 2: ảnh xưởng, bỏ iframe | 6 |
| Band 1 một cột, không rail | 6 |
| Ghi chú "gửi bản vẽ qua email" | 4 (copy), 6 (markup) |
| Unit test validation + mailto | 1, 2 |
| E2E form states | 7 |
| Gates + VR rebaseline | 8 |
| Cập nhật `launch-plan.md` cho 3.8 | 8 |
| Không thêm màu lỗi | 5 |

No gaps.

**Known deviations from the spec, recorded deliberately**

- The spec's `--field-py`/`--field-px` table row listed the tokens without stating the error border width; Task 5 adds `--field-border-w` / `--field-border-w-error` so the invalid state is a *width* change as well as a colour one. This is what makes the no-new-colour decision hold up.
- The spec proposed `app/lead/adapters/mailto.ts` for the adapter; Task 2 splits it into a pure builder under `app/shared/lead/mailto.ts` (unit-testable without a Nuxt runtime) plus the thin adapter at the spec's path. The spec's "tách phần dựng subject/body thành hàm thuần" is why.
- The spec's band-2 sketch implies a wide banner crop. Task 6 renders the photograph at its **natural** aspect ratio instead, matching `nha-xuong.vue:322` and the site's no-crop rule for photographs. The band is shorter than the sketch as a result.

**Revision history**

- **2026-07-28, layout B2.** The first version of this plan put phone/email/working-hours in a `position: sticky` rail beside the form, and Band 2 held only the two addresses in two columns. It now has no rail: Band 1 is a single full-measure column, and all five contact facts sit in Band 2's three columns, after the form. Two things improved — the sticky-overflow risk (spec Risk #3) disappeared along with the rail, and the section the user asked about keeps its five facts in one place instead of being split across the page. The "hoặc gọi ngay {phone}" line under the heading still covers the fast-call need the rail was serving.

**Open decision carried forward**

Task 6 pins the location photograph to `workshopMedia` `1.webp` (the workshop signage shot, which `nha-xuong.vue` already uses as `facadeImage`). If a different frame reads better in a full-width band, swap the filename — no other change is needed.
