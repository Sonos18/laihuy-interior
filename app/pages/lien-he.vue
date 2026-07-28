<script setup lang="ts">
import { company } from '~/data/company'
import { uiText } from '~/data/ui'
import { projectMedia, workshopMedia } from '~/media/catalog.generated'
import { withAlt } from '~/media/project-media'
import type { MediaAsset } from '~/shared/media/types'
import type { LeadDraft, LeadField } from '~/shared/lead/types'

const { t, ta, locale } = useLanguage()

// Hero: an inviting residential living room — see docs/hero-art-direction.md §10
// (Contact · Conversation). Compact height, then flows into the contact form.
const heroAsset = projectMedia['nha-vuon-chily'].images.find(
  image => image.path.endsWith('nha-vuon-chily/5.webp')
) ?? projectMedia['nha-vuon-chily'].cover
const heroImage = withAlt(heroAsset, {
  vi: 'Phòng khách trong dự án nhà vườn Chi Ly',
  en: 'Living room in the Chi Ly garden villa project'
})

// A real photograph of the workshop, not a map tile: "we have a factory" is the claim this
// page has to support, and the building makes it better than a grey embed did. Same
// filename lookup `nha-xuong.vue` uses, so section assignments are not tied to array order.
const workshopByFile: Record<string, MediaAsset> = Object.fromEntries(
  workshopMedia.map(asset => [asset.path.slice(asset.path.lastIndexOf('/') + 1), asset])
)

// 3.webp, not the 1.webp signage shot `nha-xuong.vue` uses: that frame is the ONLY portrait
// asset in the workshop set (1771x2552), and at the full shell width it renders 1844px tall —
// a whole viewport of one photograph. This is the wide view of the production hall (2560x1581),
// which is both the right proportion for a full-width band and the better proof of capacity.
const locationImage = withAlt(workshopByFile['3.webp'] as MediaAsset, {
  vi: 'Toàn cảnh xưởng sản xuất nội thất của Lai Huy Interior',
  en: 'Wide view of the Lai Huy Interior production hall'
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
      :subtitle="t({ vi: 'Gửi bản vẽ, BOQ hoặc thông tin công trình để Lai Huy Interior tư vấn phương án sản xuất và thi công phù hợp.', en: 'Send drawings, BOQ, or project information so Lai Huy Interior can advise on production and contracting solutions.' })"
      :image="heroImage"
      atmosphere="warm"
      focal="50% 42%"
    />

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
  </div>
</template>
