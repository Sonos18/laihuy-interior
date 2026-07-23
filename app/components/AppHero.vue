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
// `tall` and `compact` are BOTH min-h and max-h (--hero-h-tall / --hero-h-compact): the max-h
// caps the section BELOW the reading zone's --hero-read-h floor, so a shorter hero is possible
// without moving the copy — the reading zone still centres it at ~45svh and its slack overflows
// into the section's overflow-hidden. Without the cap the reading zone inflates every section
// to >= 90svh, which is exactly how `compact` regressed to the tallest utility hero on the
// site. See main.css --hero-h-tall / --hero-h-compact. Only `cover` keeps the reading zone as
// its effective floor (it is intentionally >= the viewport). min-h == max-h also makes both
// variants locale-invariant by construction, which the hero gate (G1/G2) asserts.
const sizeClass = computed(() => ({
  cover: 'min-h-[var(--hero-min-h)]',
  tall: 'min-h-[var(--hero-h-tall)] max-h-[var(--hero-h-tall)]',
  compact: 'min-h-[var(--hero-h-compact)] max-h-[var(--hero-h-compact)]'
}[props.size]))

// Vertical placement of the copy INSIDE the reading zone (main.css --hero-read-h). The zone is
// a viewport-sized band pinned to the TOP of the section; centring the copy in it lands the
// headline at eye level (~45% of the viewport) on every page, regardless of the section's
// taller height. This is the composition fix: the reading zone — not the section, and not the
// `anchor` prop — now owns the vertical axis. `anchor` is left to govern the HORIZONTAL
// alignment only (via contentClass): `bottom-center` centres the copy, the rest keep it left.
const readingPlaceClass = 'justify-center'

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
// SHARED-FAMILY SCRIM, RE-ANCHORED TO THE READING ZONE. The copy now sits at eye level (~45%),
// left-aligned, so the scrim can no longer be bottom-weighted — a bottom-up gradient would
// leave the mid-frame headline on bright photograph. It is LEFT-weighted (to-r) instead: dark
// down the copy's left column, releasing across the open right side. That makes legibility
// VERTICAL-POSITION-INDEPENDENT — the copy is protected wherever content length places it —
// which is exactly what a reading-zone model needs, and it removes the old headline-height
// coupling entirely.
//
// The family trait still lives in the falloff = IMAGE EMPHASIS (how much frame stays photo):
//   offset  (claim-forward)  dark holds across the copy column, releasing late (~88% width).
//   caption (photo-forward)  releases sooner (~78%), surrendering more of the right to image.
// `atmosphere="dark"` remains the per-hero depth lever for the brightest caption photos. Every
// value is an OUTCOME verified against the readability contract (body/kicker >= 4.5:1, headline
// >= 3:1) by measurement at QA — a rule, not a design choice in itself.
const scrimClass = computed(() => {
  const warm = props.atmosphere === 'warm'
  // Horizontally-centred copy (bottom-center) cannot use a left column; it keeps a vertical
  // wash covering the centred block. Unused by the shipped pages but part of the API.
  if (props.anchor === 'bottom-center') {
    return warm
      ? 'bg-linear-to-t from-wood-950/85 via-wood-950/48 via-55% to-wood-950/12'
      : 'bg-linear-to-t from-ink-950/85 via-ink-950/48 via-55% to-ink-950/12'
  }
  if (props.mode === 'caption') {
    // caption's copy column is narrower (max-w-3xl); it releases sooner so more of the frame
    // stays photograph. `atmosphere="dark"` deepens the hold for the brightest photos.
    const dark = props.atmosphere === 'dark'
    if (warm) {
      return dark
        ? 'bg-linear-to-r from-wood-950/92 via-wood-950/60 via-48% to-transparent to-84%'
        : 'bg-linear-to-r from-wood-950/90 via-wood-950/50 via-42% to-transparent to-78%'
    }
    return dark
      ? 'bg-linear-to-r from-ink-950/92 via-ink-950/60 via-48% to-transparent to-84%'
      : 'bg-linear-to-r from-ink-950/90 via-ink-950/50 via-42% to-transparent to-78%'
  }
  // Offset — claim-forward: the dark column holds across the wider max-w-4xl copy, releasing
  // late across the open subject side.
  return warm
    ? 'bg-linear-to-r from-wood-950/94 via-wood-950/62 via-52% to-transparent to-88%'
    : 'bg-linear-to-r from-ink-950/94 via-ink-950/62 via-52% to-transparent to-88%'
})
</script>

<template>
  <section
    class="relative overflow-hidden bg-ink-950 text-white"
    :class="sizeClass"
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

    <!-- Reading zone: a --hero-read-h band pinned to the TOP of the section, with the copy
         centred inside it. Because the band is viewport-sized (not the section's taller box),
         the headline lands at eye level (~45%) on every page. The section's remaining height
         falls BELOW this band as image — breathing room and the scroll affordance. -->
    <div
      class="relative z-10 flex min-h-[var(--hero-read-h)] w-full flex-col"
      :class="readingPlaceClass"
    >
      <div class="shell py-12 md:py-16">
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
