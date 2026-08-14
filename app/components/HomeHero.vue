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
    class="home-hero relative min-h-[var(--hero-min-h-home)] overflow-hidden bg-ink-950 text-white"
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
    <div class="home-hero__wash absolute inset-0" />
    <div
      class="home-hero__grid absolute inset-0"
      aria-hidden="true"
    />

    <div class="shell relative z-10 flex min-h-[var(--hero-min-h-home)] flex-col justify-end pb-10 pt-28 md:pb-12">
      <div class="home-hero__copy">
        <p
          v-reveal
          class="eyebrow reveal text-wood-200"
        >
          {{ t(homePageContent.hero.eyebrow) }}
        </p>
        <h1
          v-reveal="80"
          class="home-hero__title reveal mt-6 text-white"
        >
          {{ t(homePageContent.hero.title) }}
        </h1>
        <p
          v-reveal="140"
          class="home-hero__accent reveal mt-5 text-wood-200"
        >
          {{ t(homePageContent.hero.accent) }}
        </p>
        <p
          v-reveal="200"
          class="reveal mt-5 max-w-2xl text-base leading-7 text-white/72 md:text-lg"
        >
          {{ t(homePageContent.hero.description) }}
        </p>

        <div
          v-reveal="260"
          class="reveal mt-8 flex flex-col gap-3 sm:flex-row"
        >
          <NuxtLink
            to="/du-an"
            class="btn-primary group"
          >
            {{ t(homePageContent.hero.primaryCta) }}
            <Icon
              name="i-lucide-arrow-up-right"
              class="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </NuxtLink>
          <NuxtLink
            to="/lien-he"
            class="btn-secondary"
          >
            {{ t(homePageContent.hero.secondaryCta) }}
          </NuxtLink>
        </div>
      </div>
    </div>

    <div class="shell relative z-10 pb-12">
      <HeroMetrics :metrics="metrics" />
    </div>
  </section>
</template>

<style scoped>
.home-hero__wash {
  background:
    linear-gradient(90deg, rgb(11 10 9 / 0.88) 0%, rgb(23 13 9 / 0.56) 45%, transparent 78%),
    linear-gradient(0deg, rgb(11 10 9 / 0.9) 0%, transparent 58%);
}

.home-hero__grid {
  opacity: 0.22;
  background-image:
    linear-gradient(90deg, transparent calc(50% - 0.5px), rgb(255 255 255 / 0.15) 50%, transparent calc(50% + 0.5px)),
    linear-gradient(transparent calc(50% - 0.5px), rgb(255 255 255 / 0.1) 50%, transparent calc(50% + 0.5px));
  background-size: 25vw 100%, 100% 25vh;
}

.home-hero__copy {
  max-width: 71rem;
}

.home-hero__title {
  max-width: 67rem;
  font-size: clamp(3rem, 7.2vw, 7.75rem);
  font-weight: 500;
  line-height: 0.93;
  letter-spacing: -0.065em;
  text-wrap: balance;
}

.home-hero__accent {
  font-size: clamp(1rem, 2vw, 1.45rem);
  font-weight: 700;
  letter-spacing: -0.02em;
}

@media (max-width: 767px) {
  .home-hero__title {
    letter-spacing: -0.052em;
  }
}
</style>
