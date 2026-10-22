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
          class="hero-kicker home-eyebrow-text reveal"
        >
          {{ t(homePageContent.hero.eyebrow) }}
        </p>
        <h1
          v-reveal="80"
          class="home-hero__title home-display-title reveal font-display text-white"
        >
          {{ t(homePageContent.hero.title) }}
        </h1>
        <p
          v-reveal="160"
          class="home-hero__sublead home-lead-text reveal mt-5 max-w-2xl text-white/80"
        >
          {{ t(homePageContent.hero.description) }}
        </p>

        <div
          v-reveal="240"
          class="reveal mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
        >
          <NuxtLink
            to="/du-an"
            class="btn-bronze btn-bronze--on-dark group"
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
/* Scrim: the photograph carries the hero, so the wash is only as dark as the copy needs.
   The floor layer (peak 0.8) covers the copy and metrics and fades out above them; the side
   layer (0.4 at the copy edge, 0.1 on the far side) keeps the upper right of the photograph
   open. Copy contrast is measured, not assumed: against the real Supabase hero photograph, with
   the wash applied and the text hidden, the lightest pixel behind each line of copy gives
   (min over 375/768/1440, vi and en) eyebrow 6.4:1 (need 4.5), h1 12.9:1 (need 3), sublead 9.0:1
   (need 4.5); the metric strip sits on solid obsidian (8.3:1 labels, 18.7:1 values).

   Below 768px the copy stacks over a tall crop of an already dark photograph, so the wash is
   re-cut to the copy's rhythm instead of one tall floor: the eyebrow (bronze, the tightest line)
   sits 51 to 68% up from the bottom across 320 to 767px and gets the 0.72 plateau; the h1,
   sublead and buttons below it only need 0.6; above the eyebrow the wash falls away so the
   photograph reads. Measured the same way (lightest pixel behind each line, vi and en): at 375
   and 390 eyebrow 5.2:1 (need 4.5), h1 10.6:1 (need 3), sublead 5.9:1 (need 4.5), outline button
   label 4.9:1, bronze button label 6.3:1 (solid fill, independent of the wash); the mean
   luminance of the photograph above the copy rises from 0.067 to 0.104. The same stops hold
   every copy line at 4.7:1 or better from 320 to 767px. Re-measure if the copy length, the hero
   photograph, or these stops change. */
.home-hero__wash {
  background:
    linear-gradient(90deg, rgb(11 10 9 / 0.4) 0%, rgb(11 10 9 / 0.25) 50%, rgb(11 10 9 / 0.1) 100%),
    linear-gradient(0deg, rgb(11 10 9 / 0.8) 0%, rgb(11 10 9 / 0.8) 64%, transparent 90%);
}

@media (max-width: 767px) {
  .home-hero__wash {
    background:
      linear-gradient(90deg, rgb(11 10 9 / 0.12) 0%, rgb(11 10 9 / 0.04) 100%),
      linear-gradient(
        0deg,
        rgb(11 10 9 / 0.6) 0%,
        rgb(11 10 9 / 0.6) 44%,
        rgb(11 10 9 / 0.72) 50%,
        rgb(11 10 9 / 0.72) 67%,
        rgb(11 10 9 / 0.2) 76%,
        transparent 85%
      );
  }
}

.home-hero__copy {
  max-width: 68rem;
}

.home-hero__title {
  max-width: 64rem;
  font-weight: 500;
}
</style>
