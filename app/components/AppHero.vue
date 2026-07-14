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

const sizeClass = computed(() => ({
  cover: 'min-h-dvh',
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
const scrimClass = computed(() => {
  const warm = props.atmosphere === 'warm'
  if (props.mode === 'caption') {
    return warm
      ? 'bg-linear-to-t from-wood-950/88 via-wood-950/30 to-transparent'
      : 'bg-linear-to-t from-ink-950/88 via-ink-950/30 to-transparent'
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
  // wood-300 eyebrow on light/warm photography without darkening the whole frame.
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
    <NuxtImg
      :src="image.path"
      :alt="altText"
      :width="image.width"
      :height="image.height"
      sizes="sm:100vw md:100vw lg:100vw xl:100vw"
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
        class="section-shell px-6"
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
            class="eyebrow reveal mb-5 block text-wood-200"
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
            class="reveal text-lead mt-6 text-white/80"
            :class="isCentered ? 'mx-auto max-w-2xl' : 'max-w-2xl'"
          >
            {{ subtitle }}
          </p>

          <div
            v-if="$slots.actions"
            v-reveal="230"
            class="reveal mt-9 flex flex-col gap-3 sm:flex-row"
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
