<script setup lang="ts">
import { homePageContent } from '~/data/home-page'
import type { MediaAsset } from '~/shared/media/types'

type Metric = { label: string, value: string }

defineProps<{
  image: MediaAsset
  metrics: Metric[]
}>()

const { t } = useLanguage()
</script>

<template>
  <section
    data-testid="home-hero"
    class="home-hero relative min-h-[var(--hero-min-h-home)] overflow-hidden bg-[var(--bg-dark)] text-[var(--text-main)]"
  >
    <NuxtImg
      :src="image.path"
      :alt="t({ vi: 'Không gian nội thất khách sạn do Lai Huy hoàn thiện', en: 'Hotel interior completed by Lai Huy' })"
      :width="image.width"
      :height="image.height"
      sizes="1536px xl:100vw"
      loading="eager"
      fetchpriority="high"
      class="hero-image hero-media absolute inset-0 h-full w-full object-cover"
    />
    <div
      class="home-hero__wash pointer-events-none absolute inset-0"
      aria-hidden="true"
    />

    <div class="shell relative z-10 flex min-h-[var(--hero-min-h-home)] flex-col justify-end pb-8 pt-28 md:pb-10">
      <div class="home-hero__copy">
        <p
          v-reveal
          class="hero-kicker reveal"
        >
          {{ t(homePageContent.hero.eyebrow) }}
        </p>
        <h1
          v-reveal="80"
          class="home-hero__title reveal font-display text-white"
        >
          {{ t(homePageContent.hero.title) }}
        </h1>
        <p
          v-reveal="160"
          class="home-hero__sublead reveal mt-5 max-w-2xl text-base leading-relaxed text-white/80 md:text-lg"
        >
          {{ t(homePageContent.hero.description) }}
        </p>

        <div
          v-reveal="240"
          class="reveal mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
        >
          <NuxtLink
            to="/du-an"
            class="btn-solid-gold group"
          >
            {{ t(homePageContent.hero.primaryCta) }}
            <Icon
              name="i-lucide-arrow-up-right"
              class="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </NuxtLink>
          <NuxtLink
            to="/lien-he"
            class="btn-luxury-outline"
          >
            {{ t(homePageContent.hero.secondaryCta) }}
          </NuxtLink>
        </div>
      </div>
    </div>

    <div class="shell relative z-10 pb-10 md:pb-12">
      <HeroMetrics :metrics="metrics" />
    </div>
  </section>
</template>

<style scoped>
.hero-image {
  transform-origin: center center;
  animation: kenBurnsHero 26s ease-in-out infinite alternate;
}

@keyframes kenBurnsHero {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.05);
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-image {
    animation: none;
  }
}

.home-hero__wash {
  background:
    linear-gradient(90deg, rgb(23 20 18 / 0.94) 0%, rgb(23 20 18 / 0.65) 45%, rgb(23 20 18 / 0.35) 100%),
    linear-gradient(0deg, rgb(23 20 18 / 0.96) 0%, rgb(23 20 18 / 0.4) 45%, transparent 100%);
}

.home-hero__copy {
  max-width: 68rem;
}

.hero-kicker {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.78rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--bronze-light);
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.hero-kicker::before {
  content: '';
  width: 20px;
  height: 1px;
  background: var(--bronze);
  flex-shrink: 0;
}

.home-hero__title {
  max-width: 64rem;
  font-size: clamp(2.5rem, 5.5vw, 4.5rem);
  font-weight: 500;
  line-height: 1.08;
  letter-spacing: -0.025em;
  text-wrap: balance;
}

@media (max-width: 767px) {
  .home-hero__title {
    font-size: clamp(2.15rem, 8vw, 3rem);
    letter-spacing: -0.02em;
    line-height: 1.15;
  }
}
</style>
