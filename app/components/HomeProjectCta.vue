<script setup lang="ts">
import { homePageContent } from '~/data/home-page'

const { t } = useLanguage()
</script>

<template>
  <section
    data-testid="home-project-cta"
    class="home-project-cta section-cta"
  >
    <div
      data-head="split"
      class="shell home-project-cta__grid"
    >
      <div>
        <p
          v-reveal.head
          class="eyebrow home-eyebrow-text reveal text-wood-600"
        >
          {{ t(homePageContent.cta.eyebrow) }}
        </p>
        <h2
          v-reveal.head
          class="home-project-cta__title home-section-heading reveal mt-4 text-ink-950"
        >
          {{ t(homePageContent.cta.title) }}
        </h2>
        <p
          v-reveal.head
          class="home-lead-text reveal mt-5 max-w-2xl text-ink-600"
        >
          {{ t(homePageContent.cta.description) }}
        </p>
      </div>

      <div
        v-reveal
        class="home-project-cta__actions reveal"
      >
        <NuxtLink
          to="/lien-he#cach-gui-ho-so"
          class="btn-bronze"
        >{{ t(homePageContent.cta.primaryCta) }}</NuxtLink>
        <NuxtLink
          to="/nha-xuong"
          class="btn-outline"
        >{{ t(homePageContent.cta.secondaryCta) }}</NuxtLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.home-project-cta { position: relative; overflow: hidden; }
.home-project-cta::before { content: ''; position: absolute; inset: 0; pointer-events: none; opacity: 0.3; background-image: linear-gradient(90deg, transparent calc(25% - 0.5px), var(--color-wood-200) 25%, transparent calc(25% + 0.5px)); background-size: 25% 100%; }
.home-project-cta__grid { position: relative; display: grid; gap: 3rem; }
.home-project-cta__title { max-width: 58rem; }
.home-project-cta__actions { display: flex; flex-direction: column; align-items: flex-start; gap: 0.75rem; }
@media (min-width: 1024px) {
  .home-project-cta__grid { grid-template-columns: minmax(0, 1.45fr) minmax(18rem, 0.55fr); align-items: end; }
  .home-project-cta__actions { align-items: stretch; }
}
</style>
