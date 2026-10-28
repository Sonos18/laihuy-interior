<script setup lang="ts">
import { company, quoteMailto } from '~/data/company'
import { uiText } from '~/data/ui'
import { projectMedia } from '~/media/catalog.generated'
import { withAlt } from '~/media/project-media'
import type { LocalizedText } from '~/shared/types/localization'
import { buildQuoteMailto, type QuoteMailtoCopy } from '~/utils/contact-mailto'

const { t, ta } = useLanguage()

// Hero: an inviting residential living room — see docs/hero-art-direction.md §10
// (Contact · Conversation). Compact height, then flows into the contact details.
const heroAsset = projectMedia['nha-vuon-chily'].images.find(
  image => image.path.endsWith('nha-vuon-chily/5.webp')
) ?? projectMedia['nha-vuon-chily'].cover
const heroImage = withAlt(heroAsset, uiText.contactPage.heroImageAlt)

/** Required fields: validated, in DOM order, announced with aria-required. */
type ContactField = 'name' | 'phone' | 'email' | 'projectType' | 'message'
/** Optional fields: never validated, still written into the email. */
type OptionalField = 'company' | 'scope'
type ContactDraft = Record<ContactField | OptionalField, string>

/** Field order is the DOM order — `focusFirstError` walks it to land focus on the topmost
 *  invalid field, which is the only order a sighted keyboard user expects. */
const FIELD_ORDER: ContactField[] = ['name', 'phone', 'email', 'projectType', 'message']

const form = reactive<ContactDraft>({
  name: '',
  company: '',
  phone: '',
  email: '',
  projectType: '',
  scope: '',
  message: ''
})

// Keyless Google Maps embed pointed at the factory address (the vi string is what Maps
// resolves). No API key or backend needed; the iframe lazy-loads below the fold.
const mapEmbedUrl = computed(() => {
  const address = t(company.addresses[1]?.address ?? company.addresses[0]!.address)
  return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&z=15&output=embed`
})

type FieldErrors = Partial<Record<ContactField, LocalizedText>>

// Replaced wholesale rather than mutated: `validate` rebuilds the map every run, so a field
// that has become valid cannot leave a stale message behind.
const errors = ref<FieldErrors>({})
const formEl = ref<HTMLFormElement | null>(null)
/** Set after a valid submit has handed the draft to the visitor's mail client; `paste` when the
 * message went to the clipboard because it was too long for the mailto URL. */
const mailState = ref<'idle' | 'opened' | 'paste'>('idle')

const fieldId = (field: ContactField | OptionalField) => `contact-${field}`
const errorId = (field: ContactField) => `contact-${field}-error`

const digitsIn = (value: string) => value.replace(/\D/g, '')
// Deliberately permissive: it rejects obvious typos, not unusual-but-valid formats. A lead
// form that argues with a real phone number costs more than one that accepts a bad one.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const validate = (): boolean => {
  const messages = uiText.contactForm.errors
  const next: FieldErrors = {}

  if (!form.name.trim()) {
    next.name = messages.name
  }

  if (!form.phone.trim()) {
    next.phone = messages.phone
  } else {
    const digits = digitsIn(form.phone)
    if (digits.length < 8 || digits.length > 15) next.phone = messages.phoneInvalid
  }

  if (!form.email.trim()) {
    next.email = messages.email
  } else if (!EMAIL_PATTERN.test(form.email.trim())) {
    next.email = messages.emailInvalid
  }

  if (!form.projectType) {
    next.projectType = messages.projectType
  }

  if (!form.message.trim()) {
    next.message = messages.message
  } else if (form.message.trim().length < 10) {
    next.message = messages.messageTooShort
  }

  errors.value = next
  return FIELD_ORDER.every(field => !next[field])
}

const focusFirstError = async () => {
  await nextTick()
  const first = FIELD_ORDER.find(field => errors.value[field])
  if (!first) return
  formEl.value?.querySelector<HTMLElement>(`#${fieldId(first)}`)?.focus()
}

// Clearing on input rather than on blur: dropping the error the moment a field is corrected
// removes it while the user is still looking at it. `validate` re-runs over every field on
// submit, so nothing can be cleared into a false pass.
const clearError = (field: ContactField) => {
  if (!errors.value[field]) return
  const next: FieldErrors = {}
  for (const key of FIELD_ORDER) {
    const message = errors.value[key]
    if (key !== field && message) next[key] = message
  }
  errors.value = next
}

const labelOf = (options: readonly { id: string, label: LocalizedText }[], id: string) =>
  t(options.find(option => option.id === id)?.label)

const mailtoCopy = computed<QuoteMailtoCopy>(() => {
  const copy = uiText.contactForm.mailto
  return {
    subjectTag: t(copy.subjectTag),
    intro: t(copy.intro),
    labels: {
      name: t(copy.labels.name),
      company: t(copy.labels.company),
      phone: t(copy.labels.phone),
      email: t(copy.labels.email),
      projectType: t(copy.labels.projectType),
      scope: t(copy.labels.scope),
      details: t(copy.labels.details)
    },
    emptyValue: '—',
    attachments: t(copy.attachments),
    messageMoved: t(copy.messageMoved)
  }
})

// The site has no transport, so the hand-off to the visitor's own mail client IS the submit. An
// anchor click rather than `window.location.href = …`: the same hand-off, but a Location
// assignment cannot be intercepted by a test while a click can.
const openMailClient = (href: string) => {
  const link = document.createElement('a')
  link.href = href
  link.hidden = true
  document.body.append(link)
  link.click()
  link.remove()
}

const submitForm = async () => {
  // Reset and let the DOM settle, so a second submit re-announces the status line.
  mailState.value = 'idle'
  await nextTick()
  if (!validate()) {
    await focusFirstError()
    return
  }

  const { href, messageMoved, tooLong } = buildQuoteMailto(company.email, mailtoCopy.value, {
    name: form.name,
    company: form.company,
    phone: form.phone,
    email: form.email,
    projectType: labelOf(uiText.contactForm.projectTypes, form.projectType),
    scope: form.scope
      ? labelOf(uiText.contactForm.scopes, form.scope)
      : t(uiText.contactForm.scopeUnspecified),
    message: form.message
  })

  // A message too long for the URL is never cut: it goes to the clipboard and the email marks
  // where to paste it. Only when that hand-off is impossible does the visitor get an error.
  if (messageMoved && !tooLong) {
    try {
      await navigator.clipboard.writeText(form.message.trim())
    } catch {
      errors.value = { message: uiText.contactForm.errors.messageTooLong }
      await focusFirstError()
      return
    }
  }
  if (tooLong) {
    errors.value = { message: uiText.contactForm.errors.messageTooLong }
    await focusFirstError()
    return
  }

  openMailClient(href)
  mailState.value = messageMoved ? 'paste' : 'opened'
}

// The status line describes the draft that was handed over; once the visitor edits the form it no
// longer does.
watch(form, () => {
  mailState.value = 'idle'
})

const hasErrors = computed(() => FIELD_ORDER.some(field => errors.value[field]))

const inputClass = (invalid: boolean) => [
  'mt-2 w-full rounded-[4px] border bg-white px-4 py-3 text-base text-ink-950 transition-colors duration-[var(--dur-hover)] placeholder:text-ink-500 motion-reduce:transition-none',
  invalid ? 'border-alert-500 focus:border-alert-500' : 'border-ink-200 focus:border-wood-500'
]

const seoTitle = computed(() => t(company.seo.contact.title))
const seoDescription = computed(() => t(company.seo.contact.description))

usePageSeo({
  path: '/lien-he',
  title: seoTitle,
  description: seoDescription,
  imagePath: company.seo.contact.ogImage.path,
  jsonLd: ({ base, canonical }) => [
    buildBreadcrumbLd(base, t, [
      { name: { vi: 'Trang chủ', en: 'Home' }, path: '/' },
      { name: { vi: 'Liên hệ', en: 'Contact' }, path: '/lien-he' }
    ]),
    buildOrganizationLd(base, t),
    {
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      '@id': `${canonical}#contact`,
      'url': canonical,
      'name': seoTitle.value,
      'description': seoDescription.value,
      'about': { '@id': `${base}#organization` },
      'mainEntity': { '@id': `${base}#organization` }
    }
  ]
})
</script>

<template>
  <div class="home-page bg-wood-50 text-ink-950">
    <!-- `home-page` only supplies the shared Headline/Title/Label type tokens. Below the hero the
         page is one Linen surface; the contact blocks, form panel and map frame are Paper White
         4px containers with a Plaster border (DESIGN.md Cards / Inputs).

         Order is the visitor's order of need (copy deck B-06): the two channels that work today
         (phone, email) come first, then what to send, then the form that composes the email,
         then where the company is. -->
    <AppHero
      :topic="t({ vi: 'Liên hệ', en: 'Contact' })"
      :title="t({ vi: 'Bắt đầu dự án', en: 'Start a project' })"
      :special-title="t({ vi: 'cùng Lai Huy', en: 'with Lai Huy' })"
      :subtitle="t(uiText.contactPage.lead)"
      :image="heroImage"
      atmosphere="warm"
      focal="50% 42%"
    >
      <template #actions>
        <a
          :href="`tel:${company.phone.replaceAll(' ', '')}`"
          class="btn-bronze btn-bronze--on-dark"
        >
          {{ t(uiText.labels.callNow) }}
          <Icon
            name="i-lucide-phone"
            class="h-4 w-4"
          />
        </a>
        <a
          :href="t(quoteMailto)"
          class="btn-luxury-outline"
        >
          {{ t(uiText.labels.sendEmail) }}
        </a>
      </template>
    </AppHero>

    <section class="section-y">
      <div class="shell">
        <div
          data-testid="contact-intake"
          class="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-12"
        >
          <div
            data-testid="contact-direct"
            class="card p-6 md:p-8"
          >
            <h2 class="home-card-heading text-ink-950">
              {{ t(uiText.contactPage.direct.eyebrow) }}
            </h2>
            <dl class="mt-6 space-y-5">
              <!-- A <dl> group may hold only <dt> and <dd> (axe: definition-list), so the glyph
                   lives inside the <dt> and the <dd> is indented to sit under the label. -->
              <div>
                <dt class="flex items-center gap-3 text-sm font-bold text-ink-800">
                  <Icon
                    name="i-lucide-phone"
                    class="h-5 w-5 shrink-0 text-wood-600"
                    aria-hidden="true"
                  />
                  {{ t(uiText.labels.phone) }}
                </dt>
                <dd class="mt-1 pl-8">
                  <a
                    :href="`tel:${company.phone.replaceAll(' ', '')}`"
                    class="home-card-heading inline-flex min-h-11 items-center text-ink-950 underline-offset-4 hover:underline"
                  >{{ t(company.phoneDisplay) }}</a>
                </dd>
              </div>
              <div>
                <dt class="flex items-center gap-3 text-sm font-bold text-ink-800">
                  <Icon
                    name="i-lucide-mail"
                    class="h-5 w-5 shrink-0 text-wood-600"
                    aria-hidden="true"
                  />
                  {{ t(uiText.labels.email) }}
                </dt>
                <dd class="mt-1 pl-8">
                  <a
                    :href="t(quoteMailto)"
                    class="inline-flex min-h-11 items-center break-all text-lg font-semibold text-ink-950 underline-offset-4 hover:underline"
                  >{{ company.email }}</a>
                </dd>
              </div>
              <div>
                <dt class="flex items-center gap-3 text-sm font-bold text-ink-800">
                  <Icon
                    name="i-lucide-clock"
                    class="h-5 w-5 shrink-0 text-wood-600"
                    aria-hidden="true"
                  />
                  {{ t(uiText.labels.workingHours) }}
                </dt>
                <dd class="mt-1 pl-8 text-base leading-[1.7] text-ink-600">
                  <span
                    v-for="line in ta(company.workingHours)"
                    :key="line"
                    class="block"
                  >{{ line }}</span>
                </dd>
              </div>
            </dl>
            <p class="mt-6 border-t border-ink-200 pt-5 text-sm leading-[1.7] text-ink-600">
              {{ t(uiText.contactPage.direct.note) }}
            </p>
          </div>

          <div
            id="cach-gui-ho-so"
            data-testid="contact-send-docs"
            class="card scroll-mt-[calc(var(--header-anchor)+1rem)] p-6 md:p-8"
          >
            <h2 class="home-section-heading text-ink-950">
              {{ t(uiText.contactPage.sendDocs.heading) }}
            </h2>
            <p class="mt-4 text-base leading-[1.7] text-ink-600">
              {{ t(uiText.contactPage.sendDocs.lead) }}
            </p>
            <ol class="mt-5 list-decimal space-y-2 pl-5 text-base leading-[1.7] text-ink-800 marker:font-semibold marker:text-wood-600">
              <li
                v-for="item in uiText.contactPage.sendDocs.items"
                :key="item.vi"
              >
                {{ t(item) }}
              </li>
            </ol>
            <div class="mt-6 space-y-2 border-t border-ink-200 pt-5 text-sm leading-[1.7] text-ink-600">
              <p>
                <span class="font-bold text-ink-800">{{ t(uiText.contactPage.sendDocs.subjectLabel) }}:</span>
                <code class="ml-1 inline-block rounded-[4px] bg-wood-100 px-2 py-1 text-ink-950 [overflow-wrap:anywhere]">{{ t(uiText.contactPage.sendDocs.subjectTemplate) }}</code>
              </p>
              <p>
                <span class="font-bold text-ink-800">{{ t(uiText.contactPage.sendDocs.exampleLabel) }}:</span>
                <code class="ml-1 inline-block rounded-[4px] bg-wood-100 px-2 py-1 text-ink-950 [overflow-wrap:anywhere]">{{ t(uiText.contactPage.sendDocs.subjectExample) }}</code>
              </p>
              <p>{{ t(uiText.contactPage.sendDocs.confidentiality) }}</p>
            </div>
          </div>
        </div>

        <div
          data-testid="contact-primary"
          class="mt-16 grid gap-12 md:mt-20 lg:grid-cols-[1fr_0.9fr]"
        >
          <div class="card p-6 md:p-8">
            <p class="eyebrow">
              {{ t(uiText.contactForm.eyebrow) }}
            </p>
            <h2 class="home-section-heading mt-4 text-ink-950">
              {{ t(uiText.contactForm.heading) }}
            </h2>
            <p
              id="form-note"
              class="mt-4 text-base leading-[1.7] text-ink-600"
            >
              {{ t(uiText.contactForm.note) }}
            </p>
            <p class="mt-2 text-sm text-ink-600">
              {{ t(uiText.contactForm.requiredNote) }}
            </p>

            <form
              id="contact-form"
              ref="formEl"
              data-testid="contact-form"
              class="mt-8 scroll-mt-[calc(var(--header-anchor)+1rem)] space-y-5"
              aria-describedby="form-note"
              novalidate
              @submit.prevent="submitForm"
            >
              <div class="grid gap-5 md:grid-cols-2">
                <div class="block">
                  <label
                    :for="fieldId('name')"
                    class="text-sm font-bold text-ink-800"
                  >{{ t(uiText.contactForm.fields.name) }}<span aria-hidden="true"> *</span><span class="sr-only"> ({{ t(uiText.contactForm.required) }})</span></label>
                  <input
                    :id="fieldId('name')"
                    v-model="form.name"
                    type="text"
                    autocomplete="name"
                    aria-required="true"
                    :aria-invalid="errors.name ? 'true' : undefined"
                    :aria-describedby="errors.name ? errorId('name') : undefined"
                    :class="inputClass(Boolean(errors.name))"
                    :placeholder="t(uiText.contactForm.placeholders.name)"
                    @input="clearError('name')"
                  >
                  <p
                    v-if="errors.name"
                    :id="errorId('name')"
                    class="mt-2 text-sm font-semibold text-alert-700"
                  >
                    {{ t(errors.name) }}
                  </p>
                </div>

                <div class="block">
                  <label
                    :for="fieldId('phone')"
                    class="text-sm font-bold text-ink-800"
                  >{{ t(uiText.labels.phone) }}<span aria-hidden="true"> *</span><span class="sr-only"> ({{ t(uiText.contactForm.required) }})</span></label>
                  <input
                    :id="fieldId('phone')"
                    v-model="form.phone"
                    type="tel"
                    autocomplete="tel"
                    aria-required="true"
                    :aria-invalid="errors.phone ? 'true' : undefined"
                    :aria-describedby="errors.phone ? errorId('phone') : undefined"
                    :class="inputClass(Boolean(errors.phone))"
                    :placeholder="t(uiText.contactForm.placeholders.phone)"
                    @input="clearError('phone')"
                  >
                  <p
                    v-if="errors.phone"
                    :id="errorId('phone')"
                    class="mt-2 text-sm font-semibold text-alert-700"
                  >
                    {{ t(errors.phone) }}
                  </p>
                </div>
              </div>

              <div class="grid gap-5 md:grid-cols-2">
                <div class="block">
                  <label
                    :for="fieldId('email')"
                    class="text-sm font-bold text-ink-800"
                  >{{ t(uiText.labels.email) }}<span aria-hidden="true"> *</span><span class="sr-only"> ({{ t(uiText.contactForm.required) }})</span></label>
                  <input
                    :id="fieldId('email')"
                    v-model="form.email"
                    type="email"
                    autocomplete="email"
                    aria-required="true"
                    :aria-invalid="errors.email ? 'true' : undefined"
                    :aria-describedby="errors.email ? errorId('email') : undefined"
                    :class="inputClass(Boolean(errors.email))"
                    :placeholder="t(uiText.contactForm.placeholders.email)"
                    @input="clearError('email')"
                  >
                  <p
                    v-if="errors.email"
                    :id="errorId('email')"
                    class="mt-2 text-sm font-semibold text-alert-700"
                  >
                    {{ t(errors.email) }}
                  </p>
                </div>

                <div class="block">
                  <label
                    :for="fieldId('company')"
                    class="text-sm font-bold text-ink-800"
                  >{{ t(uiText.contactForm.fields.company) }}</label>
                  <input
                    :id="fieldId('company')"
                    v-model="form.company"
                    type="text"
                    autocomplete="organization"
                    :class="inputClass(false)"
                    :placeholder="t(uiText.contactForm.placeholders.company)"
                  >
                </div>
              </div>

              <div class="grid gap-5 md:grid-cols-2">
                <div class="block">
                  <label
                    :for="fieldId('projectType')"
                    class="text-sm font-bold text-ink-800"
                  >{{ t(uiText.contactForm.fields.projectType) }}<span aria-hidden="true"> *</span><span class="sr-only"> ({{ t(uiText.contactForm.required) }})</span></label>
                  <select
                    :id="fieldId('projectType')"
                    v-model="form.projectType"
                    aria-required="true"
                    :aria-invalid="errors.projectType ? 'true' : undefined"
                    :aria-describedby="errors.projectType ? errorId('projectType') : undefined"
                    :class="inputClass(Boolean(errors.projectType))"
                    @change="clearError('projectType')"
                  >
                    <option value="">
                      {{ t(uiText.contactForm.placeholders.projectType) }}
                    </option>
                    <option
                      v-for="type in uiText.contactForm.projectTypes"
                      :key="type.id"
                      :value="type.id"
                    >
                      {{ t(type.label) }}
                    </option>
                  </select>
                  <p
                    v-if="errors.projectType"
                    :id="errorId('projectType')"
                    class="mt-2 text-sm font-semibold text-alert-700"
                  >
                    {{ t(errors.projectType) }}
                  </p>
                </div>

                <div class="block">
                  <label
                    :for="fieldId('scope')"
                    class="text-sm font-bold text-ink-800"
                  >{{ t(uiText.contactForm.fields.scope) }}</label>
                  <select
                    :id="fieldId('scope')"
                    v-model="form.scope"
                    :class="inputClass(false)"
                  >
                    <option value="">
                      {{ t(uiText.contactForm.scopeUnspecified) }}
                    </option>
                    <option
                      v-for="scope in uiText.contactForm.scopes"
                      :key="scope.id"
                      :value="scope.id"
                    >
                      {{ t(scope.label) }}
                    </option>
                  </select>
                </div>
              </div>

              <div class="block">
                <label
                  :for="fieldId('message')"
                  class="text-sm font-bold text-ink-800"
                >{{ t(uiText.contactForm.fields.message) }}<span aria-hidden="true"> *</span><span class="sr-only"> ({{ t(uiText.contactForm.required) }})</span></label>
                <textarea
                  :id="fieldId('message')"
                  v-model="form.message"
                  rows="6"
                  aria-required="true"
                  :aria-invalid="errors.message ? 'true' : undefined"
                  :aria-describedby="errors.message ? errorId('message') : undefined"
                  :class="inputClass(Boolean(errors.message))"
                  :placeholder="t(uiText.contactForm.placeholders.message)"
                  @input="clearError('message')"
                />
                <p
                  v-if="errors.message"
                  :id="errorId('message')"
                  class="mt-2 text-sm font-semibold text-alert-700"
                >
                  {{ t(errors.message) }}
                </p>
              </div>

              <button
                type="submit"
                class="btn-bronze w-full"
                aria-describedby="submit-hint"
              >
                {{ t(uiText.contactForm.submit) }}
              </button>
              <p
                id="submit-hint"
                class="text-sm leading-[1.7] text-ink-600"
              >
                {{ t(uiText.contactForm.submitHint) }}
              </p>

              <!-- Field errors are announced by aria-describedby when focus lands on the first
                   invalid field; this live region also exposes the form-level summary. -->
              <p
                class="sr-only"
                role="status"
                aria-live="polite"
              >
                <template v-if="hasErrors">
                  {{ t(uiText.contactForm.errors.summary) }}
                </template>
              </p>

              <!-- Visible, because a visitor with no mail client configured sees nothing else
                   happen. It says the email app is open, never that anything was sent: the
                   request exists only once the visitor presses Send there. -->
              <p
                data-testid="contact-mail-opened"
                role="status"
                aria-live="polite"
                :class="mailState !== 'idle' ? 'rounded-[4px] border border-ink-200 bg-wood-100 p-4 text-sm leading-[1.7] text-ink-800' : ''"
              >
                <template v-if="mailState === 'opened'">
                  {{ t(uiText.contactForm.opened) }}
                </template>
                <template v-else-if="mailState === 'paste'">
                  {{ t(uiText.contactForm.openedPaste) }}
                </template>
              </p>
            </form>
          </div>

          <div>
            <p class="eyebrow">
              {{ t(uiText.contactPage.map.eyebrow) }}
            </p>
            <h2 class="home-section-heading mt-4 text-ink-950">
              {{ t(uiText.contactPage.map.heading) }}
            </h2>
            <div class="mt-8 overflow-hidden rounded-[4px] border border-ink-200 bg-white">
              <iframe
                :src="mapEmbedUrl"
                :title="t(uiText.contactPage.map.iframeTitle)"
                class="h-80 w-full border-0"
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
                allowfullscreen
              />
            </div>
            <p class="mt-3 text-sm leading-[1.7] text-ink-600">
              {{ t(uiText.contactPage.map.caption) }}
            </p>
            <div class="mt-6 space-y-4">
              <a
                v-for="address in company.addresses"
                :key="t(address.label)"
                :href="address.mapUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="block card-link p-5"
              >
                <strong class="text-ink-950">{{ t(address.label) }}</strong>
                <span class="mt-2 block text-base leading-[1.7] text-ink-600">
                  {{ t(address.address) }}
                </span>
                <span class="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-wood-600">
                  {{ t(address.mapAction) }}
                  <Icon
                    name="i-lucide-arrow-up-right"
                    class="h-4 w-4"
                    aria-hidden="true"
                  />
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
