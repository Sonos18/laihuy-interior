<script setup lang="ts">
// Unified immersive hero — see docs/hero-art-direction.md for the design system.
// `mode` is DERIVED (image quality gate + composition + content density), not a
// free style choice. Rendering budget: exactly one localized gradient (the scrim),
// no stacked overlays; glass belongs in the #aside slot only, never behind text.
import type { MediaImage } from '~/shared/media/types'

type Anchor = 'bottom-left' | 'bottom-center' | 'center-left'

type Props = {
  image: MediaImage
  title?: string
  subtitle?: string
  specialTitle?: string
  topic?: string
  mode?: 'offset' | 'caption'
  atmosphere?: 'warm' | 'neutral' | 'dark'
  anchor?: Anchor
  /** CSS object-position for focal control, e.g. '50% 40%'. */
  focal?: string
  size?: 'cover' | 'tall' | 'compact'
  /** LCP hero → eager single fetch. Set false for below-the-fold heroes. */
  eager?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  subtitle: '',
  specialTitle: '',
  topic: '',
  mode: 'offset',
  atmosphere: 'neutral',
  anchor: 'bottom-left',
  focal: '50% 50%',
  size: 'cover',
  eager: true
})

const { t } = useLanguage()

const altText = computed(() => (props.image.alt === '' ? '' : t(props.image.alt)))

const isCentered = computed(() => props.anchor === 'bottom-center')

// `cover` uses --hero-min-h rather than a raw viewport unit. The media below is
// `h-full object-cover`, so its box height follows the CONTENT height — and content
// height is locale-dependent (a longer EN headline wraps to an extra line). Left on
// 100dvh, switching language silently rescaled the photograph. The token holds every
// locale at the same height so the crop is identical. See main.css --hero-min-h.
// `tall` / `compact` are unaffected: they are viewport fractions with slack above the
// content, so no locale reaches their floor.
const sizeClass = computed(() => ({
  cover: 'min-h-[var(--hero-min-h)]',
  tall: 'min-h-[78vh]',
  compact: 'min-h-[68vh]'
}[props.size]))

const itemsClass = computed(() => (props.anchor === 'center-left' ? 'items-center' : 'items-end'))

const contentClass = computed(() =>
  isCentered.value
    ? 'mx-auto max-w-3xl text-center'
    : props.mode === 'caption'
      ? 'max-w-3xl'
      : 'max-w-4xl'
)

// The single localized gradient (rendering budget = 1). Full literal class strings so
// Tailwind's JIT can see them.
//
// SHARED-FAMILY SCRIM (docs/hero-art-direction.md §7). The two modes belong to one family:
// both reach the same readability CONTRACT (main.css "Hero readability contract" —
// body/kicker >= 4.5:1, headline >= 3:1), and differ only in IMAGE EMPHASIS — how much of
// the frame above the reading band stays photographic. That difference is the family trait,
// not an accident, and it lives entirely in the falloff:
//
//   offset  (claim-forward)  diagonal to-tr, deep floor through the lower-left copy corner,
//                            releasing across the subject side. ~40% of the frame stays open.
//   caption (photo-forward)  vertical to-t, floor HELD through the copy band then a STEEP
//                            release, so the upper frame stays photograph. Its earlier
//                            /88→/30-at-50% curve released so early the copy sat on raw photo
//                            (measured 2.01:1) — the caption band now holds its floor to ~34%
//                            and clears it by 55%, satisfying the contract while still
//                            surrendering more of the frame to the image than offset does.
//
// The floor OPACITY is shared; the RELEASE POINT is the lever. Stops are literal so Tailwind's
// JIT emits them. Every value below satisfies the readability contract (main.css "Hero
// readability contract") — an OUTCOME verified by measurement at QA, not a design rule in itself.
const scrimClass = computed(() => {
  const warm = props.atmosphere === 'warm'
  if (props.mode === 'caption') {
    // Caption keeps its photo-forward identity via a STEEP release (transparent well before the
    // top), but the floor is HELD through the copy band so the band behind the copy reaches the
    // same contract as offset. `atmosphere="dark"` is the per-hero DEPTH lever (existing API):
    // caption pages set it, and the tallest caption copy — project detail's breadcrumb sitting
    // high in the block over the brightest photo in the set — needs the floor held further up
    // (46% vs 40%) to clear 4.5:1. Both remain far more photographic than offset (measured
    // upper-frame luminance ~128 vs ~84); the deeper hold only reaches the copy band, not the top.
    const dark = props.atmosphere === 'dark'
    if (warm) {
      return dark
        ? 'bg-linear-to-t from-wood-950/92 via-wood-950/82 via-46% to-transparent to-82%'
        : 'bg-linear-to-t from-wood-950/90 via-wood-950/78 via-40% to-transparent to-76%'
    }
    return dark
      ? 'bg-linear-to-t from-ink-950/92 via-ink-950/82 via-46% to-transparent to-82%'
      : 'bg-linear-to-t from-ink-950/90 via-ink-950/78 via-40% to-transparent to-76%'
  }
  if (props.anchor === 'center-left') {
    return warm
      ? 'bg-linear-to-r from-wood-950/85 via-wood-950/20 to-transparent'
      : 'bg-linear-to-r from-ink-950/85 via-ink-950/20 to-transparent'
  }
  if (props.anchor === 'bottom-center') {
    return warm
      ? 'bg-linear-to-t from-wood-950/82 via-wood-950/20 to-transparent'
      : 'bg-linear-to-t from-ink-950/82 via-ink-950/20 to-transparent'
  }
  // Offset: the copy block (eyebrow → headline → subtitle → CTAs) sits lower-left, so the
  // gradient stays deep through that corner and only then falls away — protecting the small
  // wood-200 kicker on light/warm photography without darkening the whole frame.
  return warm
    ? 'bg-linear-to-tr from-wood-950/92 from-15% via-wood-950/55 via-45% to-transparent'
    : 'bg-linear-to-tr from-ink-950/92 from-15% via-ink-950/50 via-45% to-transparent'
})
</script>

<template>
  <section
    class="relative flex overflow-hidden bg-ink-950 text-white"
    :class="[sizeClass, itemsClass]"
  >
    <!-- `sizes` is NOT 100vw, deliberately. The box is object-cover and taller than it is
         wide on most viewports, so HEIGHT is the binding dimension: a width-only `sizes`
         under-requests badly on narrow screens (a 390px phone would ask for 390px and get
         w400 for a 960px-tall box). 1536px selects w1600; xl+ returns to 100vw where width
         binds again.

         DO NOT copy this value from index.vue, and do not assume it is derived there.
         Home's box floor is --hero-min-h-home (736px at md+); THIS box is --hero-min-h
         (960px flat) and rises to 100svh whenever the viewport is taller than that. The two
         geometries differ by up to 224px, so home's derivation does not transfer — that
         mistaken inheritance is exactly what this comment replaces.

         Derivation for THIS box. No upscaling requires the source to satisfy BOTH axes:
             requiredW = max(boxW, boxH x aspect)
         boxH = max(100svh, 960px); hero aspects on this site run 1.316 → 1.806. Worst case:
             1440x900  → boxH 960  → 960  x 1.806 = 1734px
             834x1112  → boxH 1112 → 1112 x 1.806 = 2009px

         MEASURED CONSEQUENCE (Chromium, resource pixels — note that img.naturalWidth is
         density-corrected on a srcset image and will NOT show this):
             1440 / 1280 / 390 → 2 of 7 heroes upscale, worst 1.084 (project detail)
             834x1112          → 6 of 7 upscale, worst 1.255

         This is a KNOWN, ACCEPTED limitation, not an oversight. MEDIA_VARIANT_WIDTHS is
         [400, 800, 1600] plus the ~2560 master, so the only non-upscaling candidate above
         1600 is the master — which costs 2.07x–2.46x the bytes on the LCP image. Paying that
         to remove an 8% upscale is a bad trade against the recorded vitals baseline.

         The real fix is a ~2048 variant (covers the 2009px worst case at roughly 1.5x w1600
         rather than 2.3x). That is a media-pipeline change, frozen by Appendix D. If the
         ladder ever gains that tier, this `sizes` should be revisited alongside it.

         Do NOT "fix" this by routing through mediaPresets.hero: that preset is 100vw at
         every breakpoint, which selects w400 on a phone for this height-bound box. -->
    <NuxtImg
      :src="image.path"
      :alt="altText"
      :width="image.width"
      :height="image.height"
      sizes="1536px xl:100vw"
      :loading="eager ? 'eager' : 'lazy'"
      :fetchpriority="eager ? 'high' : 'auto'"
      class="hero-media absolute inset-0 h-full w-full object-cover"
      :class="eager ? 'hero-image' : ''"
      :style="{ objectPosition: focal }"
    />
    <div
      class="absolute inset-0"
      :class="scrimClass"
    />

    <div class="relative z-10 w-full">
      <div
        class="shell"
        :class="isCentered ? 'py-36 md:py-44' : 'pb-16 pt-36 md:pb-24 md:pt-44'"
      >
        <div :class="contentClass">
          <slot name="breadcrumb" />
          <slot name="chips" />

          <!-- wood-200 (not wood-300): the small, wide-tracked kicker must clear WCAG AA
               (4.5:1) over warm/light photography — measured 5.84:1 vs 3.87:1. -->
          <p
            v-if="topic"
            v-reveal
            class="eyebrow reveal mb-(--hero-gap-eyebrow) block text-wood-200"
          >
            {{ topic }}
          </p>

          <h1
            v-if="title"
            v-reveal="80"
            class="reveal text-hero font-black uppercase text-white"
          >
            {{ title }}
            <span
              v-if="specialTitle"
              class="text-wood-300"
            >
              {{ specialTitle }}
            </span>
          </h1>

          <slot name="meta" />

          <p
            v-if="subtitle"
            v-reveal="150"
            class="reveal text-lead mt-(--hero-gap-lead) text-white/80"
            :class="isCentered ? 'mx-auto max-w-2xl' : 'max-w-2xl'"
          >
            {{ subtitle }}
          </p>

          <div
            v-if="$slots.actions"
            v-reveal="230"
            class="reveal mt-(--hero-gap-actions) flex flex-col gap-3 sm:flex-row"
            :class="isCentered ? 'sm:justify-center' : ''"
          >
            <slot name="actions" />
          </div>
        </div>

        <slot name="aside" />
      </div>
    </div>
  </section>
</template>
