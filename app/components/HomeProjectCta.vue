<script setup lang="ts">
import { company } from '~/data/company'
import { homePageContent } from '~/data/home-page'

const { t } = useLanguage()
</script>

<template>
  <section
    data-testid="home-project-cta"
    class="home-project-cta section-cta"
  >
    <div class="shell home-project-cta__grid">
      <div>
        <p
          v-reveal
          class="eyebrow reveal"
        >
          {{ t(homePageContent.cta.eyebrow) }}
        </p>
        <h2
          v-reveal="80"
          class="home-project-cta__title reveal mt-4"
        >
          {{ t(homePageContent.cta.title) }}
        </h2>
        <p
          v-reveal="140"
          class="reveal mt-5 max-w-2xl text-base leading-7 text-ink-600"
        >
          {{ t(homePageContent.cta.description) }}
        </p>
      </div>

      <div
        v-reveal="180"
        class="home-project-cta__actions reveal"
      >
        <NuxtLink
          to="/lien-he"
          class="btn-primary"
        >{{ t(homePageContent.cta.primaryCta) }}</NuxtLink>
        <NuxtLink
          to="/nha-xuong"
          class="btn-outline"
        >{{ t(homePageContent.cta.secondaryCta) }}</NuxtLink>
        <div class="home-project-cta__direct">
          <a :href="`mailto:${company.email}`"><Icon
            name="i-lucide-mail"
            class="h-4 w-4 text-wood-600"
          />{{ company.email }}</a>
          <a :href="`tel:${company.phone.replaceAll(' ', '')}`"><Icon
            name="i-lucide-phone"
            class="h-4 w-4 text-wood-600"
          />{{ company.phone }}</a>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.home-project-cta { position: relative; overflow: hidden; }
.home-project-cta::before { content: ''; position: absolute; inset: 0; pointer-events: none; opacity: 0.3; background-image: linear-gradient(90deg, transparent calc(25% - 0.5px), var(--color-wood-200) 25%, transparent calc(25% + 0.5px)); background-size: 25% 100%; }
.home-project-cta__grid { position: relative; display: grid; gap: 3rem; }
.home-project-cta__title { max-width: 58rem; font-size: clamp(2.45rem, 5vw, 5.8rem); font-weight: 500; line-height: 0.98; letter-spacing: -0.06em; text-wrap: balance; }
.home-project-cta__actions { display: flex; flex-direction: column; align-items: flex-start; gap: 0.75rem; }
.home-project-cta__direct { display: grid; gap: 0.6rem; margin-top: 1rem; font-size: 0.82rem; font-weight: 700; color: var(--color-ink-600); }
.home-project-cta__direct a { display: inline-flex; align-items: center; gap: 0.6rem; }
@media (min-width: 1024px) {
  .home-project-cta__grid { grid-template-columns: minmax(0, 1.45fr) minmax(18rem, 0.55fr); align-items: end; }
  .home-project-cta__actions { align-items: stretch; }
}
</style>
