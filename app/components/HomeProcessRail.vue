<script setup lang="ts">
import { homePageContent } from '~/data/home-page'
import type { ProductionStep } from '~/data/factory'

defineProps<{ steps: readonly ProductionStep[] }>()
const { t } = useLanguage()
</script>

<template>
  <section
    data-testid="home-process"
    class="home-process bg-white text-ink-950"
  >
    <div class="shell">
      <div class="home-process__header">
        <div>
          <p
            v-reveal
            class="eyebrow reveal"
          >
            {{ t(homePageContent.process.eyebrow) }}
          </p>
          <h2
            v-reveal="80"
            class="home-process__title reveal mt-4"
          >
            {{ t(homePageContent.process.title) }}
          </h2>
        </div>
        <NuxtLink
          v-reveal="140"
          to="/gioi-thieu#production-workflow"
          class="btn-outline reveal"
        >{{ t(homePageContent.process.cta) }}</NuxtLink>
      </div>

      <ol class="home-process__rail mt-12">
        <li
          v-for="(step, index) in steps"
          :key="t(step.title)"
          data-testid="home-process-step"
          class="home-process__step"
        >
          <span aria-hidden="true">{{ String(index + 1).padStart(2, '0') }}</span>
          <h3 class="mt-5 text-lg font-extrabold tracking-[-0.025em]">
            {{ t(step.title) }}
          </h3>
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped>
.home-process { padding-block: var(--section-py); }
.home-process__header { display: flex; flex-direction: column; gap: 2rem; }
.home-process__title { max-width: 55rem; font-size: clamp(2.35rem, 5vw, 5.4rem); font-weight: 500; line-height: 0.98; letter-spacing: -0.06em; }
.home-process__rail { display: grid; }
.home-process__step { min-height: 9rem; border-top: 1px solid var(--color-ink-300); padding: 1rem 0 1.5rem; }
.home-process__step > span { color: var(--color-wood-600); font-size: 0.68rem; font-weight: 900; letter-spacing: 0.16em; }
@media (min-width: 768px) {
  .home-process__header { flex-direction: row; align-items: end; justify-content: space-between; }
  .home-process__rail { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .home-process__step { padding-inline: 1.25rem; }
  .home-process__step:nth-child(3n + 1) { padding-left: 0; }
  .home-process__step:not(:nth-child(3n + 1)) { border-left: 1px solid var(--color-ink-300); }
}
@media (min-width: 1280px) {
  .home-process__rail { grid-template-columns: repeat(6, minmax(0, 1fr)); }
  .home-process__step:nth-child(3n + 1) { padding-left: 1.25rem; }
  .home-process__step:first-child { padding-left: 0; }
  .home-process__step + .home-process__step { border-left: 1px solid var(--color-ink-300); }
}
</style>
