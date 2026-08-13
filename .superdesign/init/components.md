# Shared UI Components

Framework: Vue 3 single-file components in Nuxt 4. Styling: Tailwind CSS 4 plus project utilities.

## MediaImage

- Path: `app/components/MediaImage.vue`
- Description: Catalog-backed responsive image primitive.

```vue

<script setup lang="ts">
import { mediaPresets, type MediaPreset } from '~/media/presets'
import type { MediaImage } from '~/shared/media/types'

type Props = {
  image: MediaImage
  preset?: MediaPreset
  sizes?: string
  class?: string | string[]
  imgClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  preset: 'full',
  sizes: undefined,
  class: '',
  imgClass: ''
})

const { t } = useLanguage()

const presetConfig = computed(() => mediaPresets[props.preset])
const altText = computed(() => (props.image.alt === '' ? '' : t(props.image.alt)))
const isLoaded = ref(false)
</script>

<template>
  <div :class="['relative overflow-hidden', props.class]">
    <div
      v-if="presetConfig.skeleton"
      :class="[
        'absolute inset-0 bg-ink-100 transition-opacity duration-500',
        isLoaded ? 'opacity-0' : 'opacity-100'
      ]"
    />

    <NuxtImg
      :src="image.path"
      :alt="altText"
      :width="image.width"
      :height="image.height"
      :sizes="sizes ?? presetConfig.sizes"
      :loading="presetConfig.loading"
      :fetchpriority="presetConfig.fetchpriority"
      decoding="async"
      :class="['h-full w-full object-cover', props.imgClass]"
      @load="isLoaded = true"
    />
  </div>
</template>

```
## AppHero

- Path: `app/components/AppHero.vue`
- Description: Shared immersive marketing-page hero.

```vue

<script setup lang="ts">
// Unified immersive hero â€” see docs/hero-art-direction.md for the design system.
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
  /** LCP hero â†’ eager single fetch. Set false for below-the-fold heroes. */
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
  eager: true
})

const { t } = useLanguage()

const altText = computed(() => (props.image.alt === '' ? '' : t(props.image.alt)))

const isCentered = computed(() => props.anchor === 'bottom-center')

// Every AppHero page shares the HOMEPAGE hero's height (--hero-min-h-home), so the photograph
// is exactly as tall on /gioi-thieu, /du-an, /lien-he â€¦ as it is on the homepage â€” home is the
// single standard. Applied as BOTH min-h and max-h: the copy is bottom-anchored in this box (a
// full --hero-min-h-home flow child, see template), so the max-h keeps the section from growing
// past the home height if a locale's copy is unusually tall â€” it clips into overflow-hidden
// instead. min-h == max-h also makes the crop locale-invariant by construction, which the hero
// gate (G1/G2) asserts. See main.css --hero-min-h-home (the shared, tiered floor).
const sizeClass = 'min-h-[var(--hero-min-h-home)] max-h-[var(--hero-min-h-home)]'

// Vertical placement of the copy in the section: BOTTOM-anchored, exactly like the homepage
// hero (index.vue). Every page's copy block therefore ends at the same baseline â€” the CTAs land
// together and taller copy extends upward â€” so the content position is synchronised across all
// pages and with home. Centring instead would drift, because each page's copy is a different
// height, which lands its top and bottom edges at a different place on every page. `anchor` is
// left to govern the HORIZONTAL alignment only (via contentClass): `bottom-center` centres the
// copy, the rest keep it left.
const anchorClass = 'justify-end'

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
// left-aligned, so the scrim can no longer be bottom-weighted â€” a bottom-up gradient would
// leave the mid-frame headline on bright photograph. It is LEFT-weighted (to-r) instead: dark
// down the copy's left column, releasing across the open right side. That makes legibility
// VERTICAL-POSITION-INDEPENDENT â€” the copy is protected wherever content length places it â€”
// which is exactly what a reading-zone model needs, and it removes the old headline-height
// coupling entirely.
//
// The family trait still lives in the falloff = IMAGE EMPHASIS (how much frame stays photo):
//   offset  (claim-forward)  dark holds across the copy column, releasing late (~88% width).
//   caption (photo-forward)  releases sooner (~78%), surrendering more of the right to image.
// `atmosphere="dark"` remains the per-hero depth lever for the brightest caption photos. Every
// value is an OUTCOME verified against the readability contract (body/kicker >= 4.5:1, headline
// >= 3:1) by measurement at QA â€” a rule, not a design choice in itself.
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
  // Offset â€” claim-forward: the dark column holds across the wider max-w-4xl copy, releasing
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
         geometries differ by up to 224px, so home's derivation does not transfer â€” that
         mistaken inheritance is exactly what this comment replaces.

         Derivation for THIS box. No upscaling requires the source to satisfy BOTH axes:
             requiredW = max(boxW, boxH x aspect)
         boxH = max(100svh, 960px); hero aspects on this site run 1.316 â†’ 1.806. Worst case:
             1440x900  â†’ boxH 960  â†’ 960  x 1.806 = 1734px
             834x1112  â†’ boxH 1112 â†’ 1112 x 1.806 = 2009px

         MEASURED CONSEQUENCE (Chromium, resource pixels â€” note that img.naturalWidth is
         density-corrected on a srcset image and will NOT show this):
             1440 / 1280 / 390 â†’ 2 of 7 heroes upscale, worst 1.084 (project detail)
             834x1112          â†’ 6 of 7 upscale, worst 1.255

         This is a KNOWN, ACCEPTED limitation, not an oversight. MEDIA_VARIANT_WIDTHS is
         [400, 800, 1600] plus the ~2560 master, so the only non-upscaling candidate above
         1600 is the master â€” which costs 2.07xâ€“2.46x the bytes on the LCP image. Paying that
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

    <!-- Copy is BOTTOM-anchored in the full --hero-min-h-home box, same as the homepage hero,
         so the block ends at the same baseline (and the CTAs land at the same height) on every
         page â€” that is what synchronises the content position across pages. Same pt-28 / pb
         padding as home. -->
    <div
      class="relative z-10 flex min-h-[var(--hero-min-h-home)] w-full flex-col"
      :class="anchorClass"
    >
      <div class="shell pb-10 pt-28 md:pb-12">
        <div :class="contentClass">
          <slot name="breadcrumb" />
          <slot name="chips" />

          <!-- wood-200 (not wood-300): the small, wide-tracked kicker must clear WCAG AA
               (4.5:1) over warm/light photography â€” measured 5.84:1 vs 3.87:1. -->
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

```
## ServicesJourneyRail

- Path: `app/components/ServicesJourneyRail.vue`
- Description: Services 01–03 delivery rail.

```vue

<script setup lang="ts">
import type { ServicesPageContent } from '~/data/services-page'
import type { Service } from '~/data/services'

defineProps<{
  content: ServicesPageContent['journey']
  services: readonly Service[]
}>()

const { t, ta } = useLanguage()
const sequence = (index: number) => String(index + 1).padStart(2, '0')
</script>

<template>
  <section
    id="delivery-journey"
    data-services-chapter="journey"
    class="section-y scroll-mt-[calc(var(--header-h)+1rem)] bg-ink-950 text-white"
  >
    <div
      data-testid="services-journey-layout"
      class="shell grid gap-10 xl:grid-cols-[0.68fr_1.32fr] xl:gap-16"
    >
      <div>
        <p
          v-reveal
          class="eyebrow reveal text-wood-200"
        >
          {{ t(content.eyebrow) }}
        </p>
        <h2
          v-reveal="80"
          class="text-section-title reveal mt-4 font-black uppercase"
        >
          {{ t(content.title) }}
        </h2>
        <p
          v-reveal="140"
          class="measure-lead reveal mt-5 text-white/70"
        >
          {{ t(content.description) }}
        </p>
      </div>

      <ol class="border-t border-white/15">
        <li
          v-for="(service, index) in services"
          :id="service.id"
          :key="service.id"
          v-reveal="index * 70"
          data-testid="services-core-stage"
          class="reveal scroll-mt-[calc(var(--header-h)+1rem)] border-b border-white/15 py-8 md:grid md:grid-cols-[4rem_minmax(0,0.8fr)_minmax(0,1.2fr)] md:gap-7"
        >
          <div class="flex items-center gap-4 md:block">
            <span
              data-testid="services-sequence"
              class="text-xs font-black tracking-[0.16em] text-wood-300"
            >
              {{ sequence(index) }}
            </span>
            <Icon
              :name="service.icon"
              class="mt-0 h-6 w-6 text-wood-300 md:mt-5"
              aria-hidden="true"
            />
          </div>

          <div class="mt-5 md:mt-0">
            <h3 class="text-xl font-black leading-tight md:text-2xl">
              {{ t(service.title) }}
            </h3>
            <p class="mt-4 text-sm leading-6 text-white/70">
              {{ t(service.description) }}
            </p>
          </div>

          <ul class="mt-6 space-y-3 md:mt-0">
            <li
              v-for="detail in ta(service.details)"
              :key="detail"
              class="flex gap-3 text-sm leading-6 text-white/75"
            >
              <Icon
                name="i-lucide-check"
                class="mt-1 h-4 w-4 shrink-0 text-wood-300"
                aria-hidden="true"
              />
              <span>{{ detail }}</span>
            </li>
          </ul>
        </li>
      </ol>
    </div>
  </section>
</template>

```

## ServicesProgramList

- Path: `app/components/ServicesProgramList.vue`
- Description: Services 04–06 specialist programme list.

```vue

<script setup lang="ts">
import type { ServicesPageContent } from '~/data/services-page'
import type { Service } from '~/data/services'

const props = withDefaults(defineProps<{
  content: ServicesPageContent['programmes']
  services: readonly Service[]
  startAt?: number
}>(), {
  startAt: 4
})

const { t, ta } = useLanguage()
const sequence = (index: number) => String(props.startAt + index).padStart(2, '0')
</script>

<template>
  <section
    data-services-chapter="programmes"
    class="section-y bg-ink-50"
  >
    <div class="shell">
      <p
        v-reveal
        class="eyebrow reveal"
      >
        {{ t(content.eyebrow) }}
      </p>
      <h2
        v-reveal="80"
        class="text-section-title reveal mt-4 max-w-4xl font-black uppercase text-ink-950"
      >
        {{ t(content.title) }}
      </h2>
      <p
        v-reveal="140"
        class="measure-lead reveal mt-5 text-ink-600"
      >
        {{ t(content.description) }}
      </p>

      <ol
        data-testid="services-programme-list"
        class="mt-12 border-t border-ink-200"
        :start="startAt"
      >
        <li
          v-for="(service, index) in services"
          :id="service.id"
          :key="service.id"
          v-reveal="index * 70"
          data-testid="services-programme"
          class="reveal scroll-mt-[calc(var(--header-h)+1rem)] border-b border-ink-200 py-8"
        >
          <div
            data-testid="services-programme-row"
            class="grid gap-6 md:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] md:gap-12"
          >
            <div>
              <div class="flex items-center gap-4">
                <span
                  data-testid="services-sequence"
                  class="text-xs font-black tracking-[0.16em] text-wood-600"
                >
                  {{ sequence(index) }}
                </span>
                <Icon
                  :name="service.icon"
                  class="h-6 w-6 text-wood-600"
                  aria-hidden="true"
                />
              </div>
              <h3 class="mt-5 text-2xl font-black leading-tight text-ink-950 md:text-3xl">
                {{ t(service.title) }}
              </h3>
              <p class="mt-4 text-sm leading-6 text-ink-600">
                {{ t(service.description) }}
              </p>
            </div>

            <ul class="space-y-4 md:border-l md:border-ink-200 md:pl-10">
              <li
                v-for="detail in ta(service.details)"
                :key="detail"
                class="flex gap-3 text-sm leading-6 text-ink-700"
              >
                <Icon
                  name="i-lucide-check"
                  class="mt-1 h-4 w-4 shrink-0 text-wood-600"
                  aria-hidden="true"
                />
                <span>{{ detail }}</span>
              </li>
            </ul>
          </div>
        </li>
      </ol>
    </div>
  </section>
</template>

```
