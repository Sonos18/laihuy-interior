<script setup lang="ts">
import { company } from '~/data/company'
import { uiText } from '~/data/ui'
import { projectMedia } from '~/media/catalog.generated'
import { withAlt } from '~/media/project-media'
import type { LocalizedText } from '~/shared/types/localization'

const { t, ta } = useLanguage()

// Hero: an inviting residential living room — see docs/hero-art-direction.md §10
// (Contact · Conversation). Compact height, then flows into the contact form.
const heroAsset = projectMedia['nha-vuon-chily'].images.find(
  image => image.path.endsWith('nha-vuon-chily/5.webp')
) ?? projectMedia['nha-vuon-chily'].cover
const heroImage = withAlt(heroAsset, {
  vi: 'Phòng khách trong dự án nhà vườn Chi Ly',
  en: 'Living room in the Chi Ly garden villa project'
})

type ContactField = 'name' | 'phone' | 'email' | 'projectType' | 'message'
type ContactDraft = Record<ContactField, string>

/** Field order is the DOM order — `focusFirstError` walks it to land focus on the topmost
 *  invalid field, which is the only order a sighted keyboard user expects. */
const FIELD_ORDER: ContactField[] = ['name', 'phone', 'email', 'projectType', 'message']

const form = reactive<ContactDraft>({
  name: '',
  phone: '',
  email: '',
  projectType: '',
  message: ''
})

const contactCards = computed(() => [
  ...company.addresses.map(address => ({
    icon: 'i-lucide-map-pin',
    title: t(address.label),
    lines: [t(address.address)],
    href: address.mapUrl,
    action: t(uiText.labels.openMaps)
  })),
  {
    icon: 'i-lucide-phone',
    title: t(uiText.labels.phone),
    lines: [company.phone],
    href: `tel:${company.phone.replaceAll(' ', '')}`,
    action: t(uiText.labels.callNow)
  },
  {
    icon: 'i-lucide-mail',
    title: t(uiText.labels.email),
    lines: [company.email],
    href: `mailto:${company.email}`,
    action: t(uiText.labels.sendEmail)
  },
  {
    icon: 'i-lucide-clock',
    title: t(uiText.labels.workingHours),
    lines: ta(company.workingHours),
    href: '',
    action: ''
  }
])

const projectTypes = computed(() => [
  t({ vi: 'Thi công nội thất khách sạn', en: 'Hotel interior contracting' }),
  t({ vi: 'Sản xuất nội thất tại xưởng', en: 'Factory furniture production' }),
  t({ vi: 'Villa / căn hộ / nhà phố', en: 'Villa / apartment / townhouse' }),
  t({ vi: 'Thương mại / văn phòng', en: 'Commercial / office' }),
  t({ vi: 'Gia công theo bản vẽ / xuất khẩu', en: 'Production from drawings / export' })
])

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

const fieldId = (field: ContactField) => `contact-${field}`
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

const submitForm = async () => {
  if (!validate()) {
    await focusFirstError()
    return
  }

  console.log('dữ liệu', form)
}

const hasErrors = computed(() => FIELD_ORDER.some(field => errors.value[field]))

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
  <div>
    <AppHero
      :topic="t({ vi: 'Liên hệ', en: 'Contact' })"
      :title="t({ vi: 'Bắt đầu dự án', en: 'Start a project' })"
      :special-title="t({ vi: 'cùng Lai Huy', en: 'with Lai Huy' })"
      :subtitle="t({ vi: 'Chia sẻ thông tin công trình để Lai Huy chuẩn bị nội dung tư vấn phù hợp với nhu cầu của bạn.', en: 'Share your project information so Lai Huy can prepare consultation around your needs.' })"
      :image="heroImage"
      atmosphere="warm"
      focal="50% 42%"
    >
      <template #actions>
        <a
          :href="`tel:${company.phone.replaceAll(' ', '')}`"
          class="btn-primary"
        >
          {{ t(uiText.labels.callNow) }}
          <Icon
            name="i-lucide-phone"
            class="h-4 w-4"
          />
        </a>
        <a
          href="#contact-form"
          class="btn-secondary"
        >
          {{ t(uiText.contactForm.heroAction) }}
        </a>
      </template>
    </AppHero>

    <section class="section-y bg-ink-50">
      <div class="shell">
        <div
          data-testid="contact-primary"
          class="grid gap-12 lg:grid-cols-[1fr_0.9fr]"
        >
          <div class="rounded-2xl border border-ink-200 bg-white p-6 md:p-8">
            <p class="eyebrow">
              {{ t(uiText.contactForm.eyebrow) }}
            </p>
            <h2 class="mt-4 text-3xl font-black uppercase text-ink-950 md:text-5xl">
              {{ t(uiText.contactForm.heading) }}
            </h2>
            <p
              id="form-note"
              class="mt-4 text-sm leading-6 text-ink-600"
            >
              {{ t(uiText.contactForm.note) }}
            </p>

            <form
              id="contact-form"
              ref="formEl"
              data-testid="contact-form"
              class="mt-8 scroll-mt-[calc(var(--header-h)+1rem)] space-y-5"
              aria-describedby="form-note"
              novalidate
              @submit.prevent="submitForm"
            >
              <div class="grid gap-5 md:grid-cols-2">
                <div class="block">
                  <label
                    :for="fieldId('name')"
                    class="text-sm font-bold text-ink-800"
                  >{{ t(uiText.contactForm.fields.name) }}</label>
                  <input
                    :id="fieldId('name')"
                    v-model="form.name"
                    type="text"
                    autocomplete="name"
                    :aria-invalid="errors.name ? 'true' : undefined"
                    :aria-describedby="errors.name ? errorId('name') : undefined"
                    :class="[
                      'mt-2 w-full rounded-2xl border px-4 py-3 outline-none transition-colors',
                      errors.name
                        ? 'border-alert-500 focus:border-alert-500'
                        : 'border-ink-200 focus:border-wood-500'
                    ]"
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
                  >{{ t(uiText.labels.phone) }}</label>
                  <input
                    :id="fieldId('phone')"
                    v-model="form.phone"
                    type="tel"
                    autocomplete="tel"
                    :aria-invalid="errors.phone ? 'true' : undefined"
                    :aria-describedby="errors.phone ? errorId('phone') : undefined"
                    :class="[
                      'mt-2 w-full rounded-2xl border px-4 py-3 outline-none transition-colors',
                      errors.phone
                        ? 'border-alert-500 focus:border-alert-500'
                        : 'border-ink-200 focus:border-wood-500'
                    ]"
                    placeholder="+84..."
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
                  >{{ t(uiText.labels.email) }}</label>
                  <input
                    :id="fieldId('email')"
                    v-model="form.email"
                    type="email"
                    autocomplete="email"
                    :aria-invalid="errors.email ? 'true' : undefined"
                    :aria-describedby="errors.email ? errorId('email') : undefined"
                    :class="[
                      'mt-2 w-full rounded-2xl border px-4 py-3 outline-none transition-colors',
                      errors.email
                        ? 'border-alert-500 focus:border-alert-500'
                        : 'border-ink-200 focus:border-wood-500'
                    ]"
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
                    :for="fieldId('projectType')"
                    class="text-sm font-bold text-ink-800"
                  >{{ t(uiText.contactForm.fields.projectType) }}</label>
                  <select
                    :id="fieldId('projectType')"
                    v-model="form.projectType"
                    :aria-invalid="errors.projectType ? 'true' : undefined"
                    :aria-describedby="errors.projectType ? errorId('projectType') : undefined"
                    :class="[
                      'mt-2 w-full rounded-2xl border bg-white px-4 py-3 outline-none transition-colors',
                      errors.projectType
                        ? 'border-alert-500 focus:border-alert-500'
                        : 'border-ink-200 focus:border-wood-500'
                    ]"
                    @change="clearError('projectType')"
                  >
                    <option value="">
                      {{ t(uiText.contactForm.placeholders.projectType) }}
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
                    class="mt-2 text-sm font-semibold text-alert-700"
                  >
                    {{ t(errors.projectType) }}
                  </p>
                </div>
              </div>

              <div class="block">
                <label
                  :for="fieldId('message')"
                  class="text-sm font-bold text-ink-800"
                >{{ t(uiText.contactForm.fields.message) }}</label>
                <textarea
                  :id="fieldId('message')"
                  v-model="form.message"
                  rows="6"
                  :aria-invalid="errors.message ? 'true' : undefined"
                  :aria-describedby="errors.message ? errorId('message') : undefined"
                  :class="[
                    'mt-2 w-full rounded-2xl border px-4 py-3 outline-none transition-colors',
                    errors.message
                      ? 'border-alert-500 focus:border-alert-500'
                      : 'border-ink-200 focus:border-wood-500'
                  ]"
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
                class="btn-dark w-full"
              >
                {{ t(uiText.contactForm.submit) }}
              </button>

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
            </form>
          </div>

          <div>
            <p class="eyebrow">
              {{ t({ vi: 'Bản đồ', en: 'Map' }) }}
            </p>
            <h2 class="mt-4 text-3xl font-black uppercase text-ink-950 md:text-5xl">
              {{ t({ vi: 'Văn phòng và nhà xưởng', en: 'Office and factory' }) }}
            </h2>
            <div class="mt-8 overflow-hidden rounded-2xl border border-ink-200 bg-white">
              <iframe
                :src="mapEmbedUrl"
                :title="t({ vi: 'Bản đồ nhà xưởng Lai Huy Interior', en: 'Map to the Lai Huy Interior workshop' })"
                class="h-80 w-full border-0"
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
                allowfullscreen
              />
            </div>
            <div class="mt-6 space-y-4">
              <a
                v-for="address in company.addresses"
                :key="t(address.label)"
                :href="address.mapUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="block rounded-2xl border border-ink-200 bg-white p-5"
              >
                <strong class="text-ink-950">{{ t(address.label) }}</strong>
                <span class="mt-2 block text-sm leading-6 text-ink-600">
                  {{ t(address.address) }}
                </span>
              </a>
            </div>
          </div>
        </div>

        <!-- The five info cards close the band. 64px / 80px off the form+map block: an
             intra-band step, sitting at or just below the --section-py rhythm (64/80 here
             against 64/88 for --section-py), because this is not a section boundary. Five
             equal columns from --bp-xl; below that the long Long Hậu address makes a
             five-up row too narrow to read (3 + 2 instead). -->
        <div
          data-testid="contact-cards"
          class="mt-16 grid gap-5 md:mt-20 md:grid-cols-3 xl:grid-cols-5"
        >
          <article
            v-for="card in contactCards"
            :key="card.title"
            class="industrial-card"
          >
            <Icon
              :name="card.icon"
              class="h-7 w-7 text-wood-500"
            />
            <h3 class="mt-5 text-xl font-black text-ink-950">
              {{ card.title }}
            </h3>
            <p
              v-for="line in card.lines"
              :key="line"
              class="mt-2 text-sm leading-6 text-ink-600"
            >
              {{ line }}
            </p>
            <a
              v-if="card.href"
              :href="card.href"
              target="_blank"
              rel="noopener noreferrer"
              class="mt-5 inline-flex text-sm font-bold text-wood-600"
            >
              {{ card.action }}
            </a>
          </article>
        </div>
      </div>
    </section>
  </div>
</template>
