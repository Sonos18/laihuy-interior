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
// The masthead below is the same typographic system as those heroes (Label eyebrow, Outfit 500
// title) at a utility height, but on the warm-light canvas: with no photograph behind it, an
// obsidian band would break the Warm Light Rule (DESIGN.md), so it is a Raw Silk step with a
// Plaster hairline instead. Styled with utilities rather than bespoke `.legal-*` rules, which is
// how every other page in this repo is built (see tuyen-dung.vue): a reference page is not worth
// a new component-layer API.
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

// The masthead is light, so the header cannot rest as a scrim over a photograph: pin it to its
// NAVIGATION chrome, as error.vue does with `<AppHeader solid />`. The singleton is released on
// the way out so the next route's cover gets its transparent header back.
const { setSolid } = useHeaderState()
// The same pin, expressed for the first paint: `setSolid` only runs on mount, so the SSR HTML
// (and a visit with JavaScript off) would otherwise show the cover scrim over this light
// masthead. `data-chrome-solid` feeds the pre-hydration guard in main.css; Unhead removes it
// when this page unmounts.
useHead({ htmlAttrs: { 'data-chrome-solid': '' } })
onMounted(() => setSolid(true))
onBeforeUnmount(() => setSolid(false))

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
  <!-- `home-page` only supplies the shared Headline/Title/Label type tokens. -->
  <div class="home-page bg-wood-50 text-ink-950">
    <!-- The header is `position: fixed` and there is no hero photograph to sit beneath it, so
         this band clears the chrome itself. --header-h tracks the breakpoint (72/88px), which is
         why the clearance is expressed against the token rather than a literal. -->
    <section class="border-b border-[var(--rule-light)] bg-[var(--color-ivory)] pb-12 pt-[calc(var(--header-h)+3.5rem)]">
      <div class="shell">
        <p class="eyebrow">
          {{ topic }}
        </p>
        <h1 class="home-section-heading mt-4 max-w-3xl text-ink-950">
          {{ t(document.title) }}
        </h1>
        <p class="mt-5 text-base leading-[1.7] text-ink-600">
          {{ t(uiText.labels.lastUpdated) }}: {{ updatedAt }}
        </p>
      </div>
    </section>

    <section class="section-y">
      <div class="shell">
        <!-- 68ch is the DESIGN.md body measure (never beyond 75 characters a line), set on the
             wrapper so the lead, clause headings, paragraphs and list items share one rail. The
             old max-w-3xl (768px) still ran about 100 characters a line at body size. -->
        <div class="max-w-[68ch]">
          <p class="home-lead-text text-ink-700">
            {{ t(document.intro) }}
          </p>

          <!-- Each clause is a <section> with its own heading, so the document is navigable by
               heading in a screen reader exactly as it is by eye. -->
          <section
            v-for="section in document.sections"
            :key="section.heading.vi"
            class="mt-10"
          >
            <h2 class="home-card-heading text-ink-950">
              {{ t(section.heading) }}
            </h2>

            <p
              v-if="section.body"
              class="mt-3 text-base leading-[1.7] text-ink-600"
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
                class="flex gap-3 text-base leading-[1.7] text-ink-600"
              >
                <!-- The same bullet glyph /tuyen-dung uses for its requirement lists, so a
                     list on a legal page and a list on a careers page are the same object. -->
                <Icon
                  name="i-lucide-dot"
                  class="mt-1.5 size-4 shrink-0 text-wood-600"
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
            <h2 class="home-card-heading text-ink-950">
              {{ t(uiText.labels.legalContactHeading) }}
            </h2>
            <p class="mt-3 text-base leading-[1.7] text-ink-600">
              {{ t(uiText.labels.legalContactBody) }}
            </p>

            <dl class="mt-6 grid gap-5 sm:grid-cols-2">
              <div>
                <dt class="home-eyebrow-text text-ink-600">
                  {{ t(uiText.labels.company) }}
                </dt>
                <dd class="mt-1 text-base leading-[1.7] text-ink-700">
                  {{ company.name }}
                </dd>
              </div>

              <div>
                <dt class="home-eyebrow-text text-ink-600">
                  {{ t(uiText.labels.email) }}
                </dt>
                <dd class="mt-1 text-base leading-[1.7] text-ink-700">
                  <a
                    :href="`mailto:${company.email}`"
                    class="text-wood-600 underline underline-offset-4 transition-colors duration-[var(--dur-hover)] hover:text-wood-700 motion-reduce:transition-none"
                  >
                    {{ company.email }}
                  </a>
                </dd>
              </div>

              <div>
                <dt class="home-eyebrow-text text-ink-600">
                  {{ t(uiText.labels.phone) }}
                </dt>
                <dd class="mt-1 text-base leading-[1.7] text-ink-700">
                  <a
                    :href="`tel:${company.phone.replaceAll(' ', '')}`"
                    class="text-wood-600 underline underline-offset-4 transition-colors duration-[var(--dur-hover)] hover:text-wood-700 motion-reduce:transition-none"
                  >
                    {{ company.phone }}
                  </a>
                </dd>
              </div>

              <div
                v-for="address in company.addresses"
                :key="address.label.vi"
              >
                <dt class="home-eyebrow-text text-ink-600">
                  {{ t(address.label) }}
                </dt>
                <dd class="mt-1 text-base leading-[1.7] text-ink-700">
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
