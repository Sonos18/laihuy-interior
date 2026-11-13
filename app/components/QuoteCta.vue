<script setup lang="ts">
// DESIGN.md "Closing CTA": the one quote CTA that closes home, projects, services and about.
// Split layout (heading and lead left, the two actions right from 1024px) on the shared
// `.section-cta` band. Page-specific attributes (data-testid, chapter names) fall through to the
// section.
//
// `layout="stacked"` (actions under the lead, never beside it) exists for one case: the No-Echo
// Rule, where the head before the CTA is already Split (`/dich-vu`, after the programmes).
import { company } from '~/data/company'
import { quoteCtaContent } from '~/data/closing'

withDefaults(defineProps<{ layout?: 'split' | 'stacked' }>(), { layout: 'split' })

const { t } = useLanguage()
const phoneHref = `tel:${company.phone.replaceAll(' ', '')}`
</script>

<template>
  <section class="quote-cta section-cta">
    <div
      :data-head="layout"
      class="shell quote-cta__grid"
      :class="{ 'quote-cta__grid--stacked': layout === 'stacked' }"
    >
      <div>
        <p
          v-reveal.head
          class="eyebrow home-eyebrow-text reveal text-wood-600"
        >
          {{ t(quoteCtaContent.eyebrow) }}
        </p>
        <h2
          v-reveal.head
          class="quote-cta__title home-section-heading reveal mt-4 text-ink-950"
        >
          {{ t(quoteCtaContent.title) }}
        </h2>
        <p
          v-reveal.head
          class="home-lead-text reveal mt-5 max-w-2xl text-ink-600"
        >
          {{ t(quoteCtaContent.description) }}
        </p>
      </div>

      <div
        v-reveal
        class="quote-cta__actions reveal"
      >
        <NuxtLink
          to="/lien-he#cach-gui-ho-so"
          class="btn-bronze"
        >{{ t(quoteCtaContent.primaryCta) }}</NuxtLink>
        <a
          :href="phoneHref"
          class="btn-outline"
        >{{ t(quoteCtaContent.phoneCta) }} {{ t(company.phoneDisplay) }}</a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.quote-cta { position: relative; overflow: hidden; }
.quote-cta::before { content: ''; position: absolute; inset: 0; pointer-events: none; opacity: 0.3; background-image: linear-gradient(90deg, transparent calc(25% - 0.5px), var(--color-wood-200) 25%, transparent calc(25% + 0.5px)); background-size: 25% 100%; }
.quote-cta__grid { position: relative; display: grid; gap: 3rem; }
.quote-cta__title { max-width: 58rem; }
.quote-cta__actions { display: flex; flex-direction: column; align-items: flex-start; gap: 0.75rem; }
@media (min-width: 640px) and (max-width: 1023px) {
  .quote-cta__actions { flex-direction: row; flex-wrap: wrap; }
}
@media (min-width: 640px) {
  .quote-cta__grid--stacked .quote-cta__actions { flex-direction: row; flex-wrap: wrap; }
}
.quote-cta__grid--stacked { gap: 2.25rem; }
@media (min-width: 1024px) {
  .quote-cta__grid:not(.quote-cta__grid--stacked) { grid-template-columns: minmax(0, 1.45fr) minmax(18rem, 0.55fr); align-items: end; }
  .quote-cta__grid:not(.quote-cta__grid--stacked) .quote-cta__actions { align-items: stretch; }
}
</style>
