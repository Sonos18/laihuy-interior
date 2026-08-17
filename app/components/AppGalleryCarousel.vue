<script setup lang="ts">
import { uiText } from '~/data/ui'
import type { MediaPreset } from '~/media/presets'
import type { MediaImage } from '~/shared/media/types'
import {
  gallerySlidePosition,
  wrapGalleryIndex
} from '~/utils/gallery-carousel'

type Props = {
  images: MediaImage[]
  preset?: MediaPreset
  selectable?: boolean
  autoplayMs?: number
  paused?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  preset: 'gallery',
  selectable: false,
  autoplayMs: 5000,
  paused: false
})

const emit = defineEmits<{
  select: [index: number]
  change: [index: number]
}>()

const { t } = useLanguage()
const root = ref<HTMLElement | null>(null)
const activeIndex = ref(0)
const suppressClick = ref(false)
const visitorPaused = ref(false)
const hovered = ref(false)
const focusWithin = ref(false)
const dragging = ref(false)
const pageHidden = ref(false)
const reduceMotion = ref(false)

let autoplayTimer: ReturnType<typeof setTimeout> | undefined
let motionQuery: MediaQueryList | undefined
let pointerId: number | undefined
let pointerStartX = 0
let pointerStartY = 0

const positionFor = (index: number) =>
  gallerySlidePosition(index, activeIndex.value, props.images.length)

const goTo = (index: number) => {
  const nextIndex = wrapGalleryIndex(index, props.images.length)
  if (nextIndex === activeIndex.value) return
  activeIndex.value = nextIndex
  emit('change', nextIndex)
}

const previous = () => goTo(activeIndex.value - 1)
const next = () => goTo(activeIndex.value + 1)
const activate = (index: number) => {
  if (suppressClick.value) return
  if (index === activeIndex.value && props.selectable) {
    emit('select', index)
    return
  }
  goTo(index)
}

const temporarilyPaused = computed(() =>
  props.paused || hovered.value || focusWithin.value || dragging.value || pageHidden.value
)
const autoplayEnabled = computed(() =>
  props.images.length > 1 && props.autoplayMs > 0 && !reduceMotion.value
)
const autoplayRunning = computed(() =>
  autoplayEnabled.value && !visitorPaused.value && !temporarilyPaused.value
)
const autoplayState = computed(() =>
  !autoplayEnabled.value ? 'disabled' : autoplayRunning.value ? 'running' : 'paused'
)

const clearAutoplay = () => {
  if (autoplayTimer) clearTimeout(autoplayTimer)
  autoplayTimer = undefined
}

const scheduleAutoplay = () => {
  clearAutoplay()
  if (!autoplayRunning.value) return
  autoplayTimer = setTimeout(next, props.autoplayMs)
}

const onMotionChange = (event: MediaQueryListEvent) => {
  reduceMotion.value = event.matches
}

const onVisibilityChange = () => {
  pageHidden.value = document.hidden
}

const onFocusOut = (event: FocusEvent) => {
  const nextTarget = event.relatedTarget
  if (!(nextTarget instanceof Node) || !root.value?.contains(nextTarget)) {
    focusWithin.value = false
  }
}

const onPointerDown = (event: PointerEvent) => {
  if (pointerId !== undefined) return
  pointerId = event.pointerId
  pointerStartX = event.clientX
  pointerStartY = event.clientY
  dragging.value = true
}

const onPointerMove = (event: PointerEvent) => {
  if (event.pointerId !== pointerId || root.value?.hasPointerCapture(event.pointerId)) return
  const dx = event.clientX - pointerStartX
  const dy = event.clientY - pointerStartY
  if (Math.abs(dx) >= 8 && Math.abs(dx) > Math.abs(dy)) {
    root.value?.setPointerCapture?.(event.pointerId)
  }
}

const clearPointer = () => {
  pointerId = undefined
  dragging.value = false
}

const onPointerUp = (event: PointerEvent) => {
  if (event.pointerId !== pointerId) return
  const dx = event.clientX - pointerStartX
  const dy = event.clientY - pointerStartY
  clearPointer()

  if (Math.abs(dx) >= 44 && Math.abs(dx) > Math.abs(dy)) {
    suppressClick.value = true
    if (dx < 0) next()
    else previous()
    requestAnimationFrame(() => {
      suppressClick.value = false
    })
  }
}

const onPointerCancel = (event: PointerEvent) => {
  if (event.pointerId === pointerId) clearPointer()
}

watch(() => props.images, () => {
  activeIndex.value = 0
})

watch([autoplayRunning, activeIndex, () => props.autoplayMs], scheduleAutoplay)

onMounted(() => {
  motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  reduceMotion.value = motionQuery.matches
  motionQuery.addEventListener('change', onMotionChange)
  pageHidden.value = document.hidden
  document.addEventListener('visibilitychange', onVisibilityChange)
  scheduleAutoplay()
})

onBeforeUnmount(() => {
  clearAutoplay()
  motionQuery?.removeEventListener('change', onMotionChange)
  document.removeEventListener('visibilitychange', onVisibilityChange)
})
</script>

<template>
  <div
    v-if="images.length"
    ref="root"
    data-gallery-carousel
    :data-gallery-count="images.length"
    :data-gallery-active-index="activeIndex"
    :data-gallery-autoplay="autoplayState"
    class="outline-none"
    role="region"
    :aria-roledescription="t(uiText.galleryCarousel.role)"
    :aria-label="t(uiText.galleryCarousel.region)"
    tabindex="-1"
    @mouseenter="hovered = true"
    @mouseleave="hovered = false"
    @focusin="focusWithin = true"
    @focusout="onFocusOut"
    @keydown.left.prevent="previous"
    @keydown.right.prevent="next"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
    @pointercancel="onPointerCancel"
    @dragstart.prevent
  >
    <div
      data-gallery-viewport
      class="gallery-carousel-viewport relative overflow-hidden touch-pan-y"
    >
      <AppGalleryCarouselSlide
        v-for="(image, index) in images"
        :key="image.path"
        :image="image"
        :index="index"
        :total="images.length"
        :position="positionFor(index)"
        :preset="preset"
        :selectable="selectable"
        @activate="activate"
      />
    </div>

    <div
      v-if="images.length > 1"
      class="mt-5 flex items-center justify-center gap-3"
    >
      <button
        type="button"
        class="inline-flex h-11 w-11 items-center justify-center rounded-full border border-ink-200 bg-white text-ink-950 transition-colors hover:border-wood-500 hover:text-wood-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wood-500 motion-reduce:transition-none"
        :aria-label="t(uiText.galleryCarousel.previous)"
        @click="previous"
      >
        <Icon
          name="i-lucide-arrow-left"
          class="h-5 w-5"
        />
      </button>

      <p
        class="min-w-20 text-center text-sm font-black tabular-nums text-ink-700"
        aria-live="polite"
      >
        {{ activeIndex + 1 }} / {{ images.length }}
      </p>

      <button
        v-if="autoplayEnabled"
        type="button"
        class="inline-flex h-11 w-11 items-center justify-center rounded-full border border-ink-200 bg-white text-ink-950 transition-colors hover:border-wood-500 hover:text-wood-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wood-500 motion-reduce:transition-none"
        :aria-label="t(visitorPaused ? uiText.galleryCarousel.play : uiText.galleryCarousel.pause)"
        :aria-pressed="visitorPaused"
        @click="visitorPaused = !visitorPaused"
      >
        <Icon
          :name="visitorPaused ? 'i-lucide-play' : 'i-lucide-pause'"
          class="h-4 w-4"
        />
      </button>

      <button
        type="button"
        class="inline-flex h-11 w-11 items-center justify-center rounded-full border border-ink-200 bg-white text-ink-950 transition-colors hover:border-wood-500 hover:text-wood-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wood-500 motion-reduce:transition-none"
        :aria-label="t(uiText.galleryCarousel.next)"
        @click="next"
      >
        <Icon
          name="i-lucide-arrow-right"
          class="h-5 w-5"
        />
      </button>
    </div>
  </div>
</template>

<style scoped>
.gallery-carousel-viewport {
  height: clamp(13rem, 50vw, 29rem);
}

.gallery-carousel-slide {
  width: 82%;
  opacity: 0;
  pointer-events: none;
  transform: translate(-50%, -50%) scale(0.62);
  transition:
    transform 650ms cubic-bezier(0.22, 1, 0.36, 1),
    opacity 450ms ease,
    box-shadow 450ms ease;
}

.gallery-carousel-slide[data-gallery-position='active'] {
  z-index: 3;
  opacity: 1;
  pointer-events: auto;
  transform: translate(-50%, -50%) scale(1);
  box-shadow: 0 1.5rem 4rem rgb(20 18 16 / 18%);
}

.gallery-carousel-slide[data-gallery-position='previous'] {
  z-index: 2;
  opacity: 0.76;
  pointer-events: auto;
  transform: translate(-112%, -50%) scale(0.68);
}

.gallery-carousel-slide[data-gallery-position='next'] {
  z-index: 2;
  opacity: 0.76;
  pointer-events: auto;
  transform: translate(12%, -50%) scale(0.68);
}

@media (min-width: 768px) {
  .gallery-carousel-viewport {
    height: clamp(21rem, 39vw, 29rem);
  }

  .gallery-carousel-slide {
    width: 64%;
  }

  .gallery-carousel-slide[data-gallery-position='previous'] {
    transform: translate(-116%, -50%) scale(0.72);
  }

  .gallery-carousel-slide[data-gallery-position='next'] {
    transform: translate(16%, -50%) scale(0.72);
  }
}

@media (min-width: 1280px) {
  .gallery-carousel-slide {
    width: 56%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .gallery-carousel-slide {
    transition-duration: 1ms;
  }
}
</style>
