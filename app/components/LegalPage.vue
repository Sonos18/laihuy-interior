<script setup lang="ts">
// The shared shell for /privacy-policy and /terms-of-use.
//
// Both documents have exactly the same shape — masthead, intro, then a run of numbered clauses
// with an optional list each — so the markup lives here once and the two routes supply only
// content. Two near-identical page templates would guarantee they drift the first time one of
// them is edited.
//
// DELIBERATELY NOT AppHero. Every marketing route opens on a full-bleed photograph at
// --hero-min-h-home, and that is right for pages that are selling something. A legal document is
// a reference page: the reader arrived from a footer link with a specific question, and a
// viewport of workshop photography between them and clause 8 is an obstacle, not a welcome.
//
// The masthead below is the same typographic system as those heroes — ink-950 surface, wood
// eyebrow, black uppercase display — at a utility height. Styled with utilities rather than
// bespoke `.legal-*` rules, which is how every other page in this repo is built (see
// tuyen-dung.vue): a reference page is not worth a new component-layer API.
import type { LegalDocument } from '~/data/legal'
import { legalUpdatedAt } from '~/data/legal'
import { company } from '~/data/company'
import { uiText } from '~/data/ui'

// Not assigned to a binding: both props are read from the template, where they are unwrapped
// automatically, and the `updatedAt` computed below closes over the imported constant rather
// than over a prop.
defineProps<{
  document: LegalDocument
  /** Eyebrow above the title, e.g. "Pháp lý" / "Legal". */
  topic: string
}>()

const { t, ta, locale } = useLanguage()

// Formatted per locale rather than hardcoded: `legalUpdatedAt` is ISO, and a literal
// "31/07/2026" would read as a malformed US date on the English page.
const updatedAt = computed(() =>
  new Date(legalUpdatedAt).toLocaleDateString(locale.value === 'en' ? 'en-GB' : 'vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
)
</script>

<template>
  <div>
    <!-- The header is `position: fixed` and there is no hero photograph to sit beneath it, so
         this band clears the chrome itself. --header-h tracks the breakpoint (72/88px), which is
         why the clearance is expressed against the token rather than a literal. -->
    <section class="bg-ink-950 pb-12 pt-[calc(var(--header-h)+3.5rem)] text-white">
      <div class="shell">
        <p class="eyebrow text-wood-300">
          {{ topic }}
        </p>
        <h1 class="mt-4 max-w-3xl text-3xl font-black uppercase leading-tight md:text-5xl">
          {{ t(document.title) }}
        </h1>
        <p class="mt-5 text-sm text-white/48">
          {{ t(uiText.labels.lastUpdated) }}: {{ updatedAt }}
        </p>
      </div>
    </section>

    <section class="section-y bg-white">
      <div class="shell">
        <!-- max-w-3xl (768px) is a reading measure, not the rail: legal prose set across the
             full 1280px rail runs to ~150 characters a line and stops being readable. -->
        <div class="max-w-3xl">
          <p class="text-lg leading-8 text-ink-700">
            {{ t(document.intro) }}
          </p>

          <!-- Each clause is a <section> with its own heading, so the document is navigable by
               heading in a screen reader exactly as it is by eye. -->
          <section
            v-for="section in document.sections"
            :key="section.heading.vi"
            class="mt-10"
          >
            <h2 class="text-xl font-black uppercase text-ink-950">
              {{ t(section.heading) }}
            </h2>

            <p
              v-if="section.body"
              class="mt-3 leading-7 text-ink-600"
            >
              {{ t(section.body) }}
            </p>

            <ul
              v-if="section.items"
              class="mt-4 space-y-3"
            >
              <li
                v-for="item in ta(section.items)"
                :key="item"
                class="flex gap-3 leading-7 text-ink-600"
              >
                <!-- The same bullet glyph /tuyen-dung uses for its requirement lists, so a
                     list on a legal page and a list on a careers page are the same object. -->
                <Icon
                  name="i-lucide-dot"
                  class="mt-1 size-4 shrink-0 text-wood-500"
                  aria-hidden="true"
                />
                <span>{{ item }}</span>
              </li>
            </ul>
          </section>

          <!-- The contact clause is rendered here rather than authored in `legal.ts` because its
               content IS `company` — duplicating the phone number into two legal documents is how
               a site ends up publishing a disconnected number on the one page that has to be
               reachable. -->
          <section class="mt-10">
            <h2 class="text-xl font-black uppercase text-ink-950">
              {{ t(uiText.labels.legalContactHeading) }}
            </h2>
            <p class="mt-3 leading-7 text-ink-600">
              {{ t(uiText.labels.legalContactBody) }}
            </p>

            <dl class="mt-6 grid gap-5 sm:grid-cols-2">
              <div>
                <dt class="text-xs font-semibold uppercase tracking-[0.12em] text-ink-500">
                  {{ t(uiText.labels.company) }}
                </dt>
                <dd class="mt-1 leading-7 text-ink-700">
                  {{ company.name }}
                </dd>
              </div>

              <div>
                <dt class="text-xs font-semibold uppercase tracking-[0.12em] text-ink-500">
                  {{ t(uiText.labels.email) }}
                </dt>
                <dd class="mt-1 leading-7 text-ink-700">
                  <a
                    :href="`mailto:${company.email}`"
                    class="text-wood-600 underline underline-offset-4 transition-colors hover:text-wood-700"
                  >
                    {{ company.email }}
                  </a>
                </dd>
              </div>

              <div>
                <dt class="text-xs font-semibold uppercase tracking-[0.12em] text-ink-500">
                  {{ t(uiText.labels.phone) }}
                </dt>
                <dd class="mt-1 leading-7 text-ink-700">
                  <a
                    :href="`tel:${company.phone.replaceAll(' ', '')}`"
                    class="text-wood-600 underline underline-offset-4 transition-colors hover:text-wood-700"
                  >
                    {{ company.phone }}
                  </a>
                </dd>
              </div>

              <div
                v-for="address in company.addresses"
                :key="address.label.vi"
              >
                <dt class="text-xs font-semibold uppercase tracking-[0.12em] text-ink-500">
                  {{ t(address.label) }}
                </dt>
                <dd class="mt-1 leading-7 text-ink-700">
                  {{ t(address.address) }}
                </dd>
              </div>
            </dl>
          </section>
        </div>
      </div>
    </section>
  </div>
</template>
