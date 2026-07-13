<script setup lang="ts">
import type { MediaImage } from '~/shared/media/types'

type Props = {
  images: MediaImage[]
  index: number
  open: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'close': []
  'update:index': [index: number]
}>()

const { t } = useLanguage()

const dialogEl = ref<HTMLElement | null>(null)
const closeButton = ref<HTMLElement | null>(null)
const thumbStrip = ref<HTMLElement | null>(null)
const zoomed = ref(false)
const isFullscreen = ref(false)
const origin = ref('center center')
let previouslyFocused: HTMLElement | null = null

const current = computed<MediaImage | undefined>(() => props.images[props.index])

const altText = computed(() => {
  const image = current.value
  if (!image || image.alt === '') {
    return ''
  }
  return t(image.alt)
})

const counter = computed(() =>
  props.images.length ? `${props.index + 1} / ${props.images.length}` : ''
)

const go = (delta: number) => {
  const total = props.images.length
  if (total < 2) {
    return
  }
  zoomed.value = false
  emit('update:index', (props.index + delta + total) % total)
}

const toggleZoom = (event: MouseEvent) => {
  const target = event.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  const x = ((event.clientX - rect.left) / rect.width) * 100
  const y = ((event.clientY - rect.top) / rect.height) * 100
  origin.value = `${x}% ${y}%`
  zoomed.value = !zoomed.value
}

const onFullscreenChange = () => {
  isFullscreen.value = Boolean(document.fullscreenElement)
}

const toggleFullscreen = async () => {
  if (!import.meta.client) {
    return
  }
  try {
    if (document.fullscreenElement) {
      await document.exitFullscreen()
    } else {
      await dialogEl.value?.requestFullscreen()
    }
  } catch {
    // Fullscreen can be rejected (e.g. permissions) — fail quietly.
  }
}

const selectIndex = (index: number) => {
  zoomed.value = false
  emit('update:index', index)
}

// Touch swipe → prev/next.
let touchStartX = 0
let touchStartY = 0
const onTouchStart = (event: TouchEvent) => {
  touchStartX = event.changedTouches[0]?.clientX ?? 0
  touchStartY = event.changedTouches[0]?.clientY ?? 0
}
const onTouchEnd = (event: TouchEvent) => {
  const dx = (event.changedTouches[0]?.clientX ?? 0) - touchStartX
  const dy = (event.changedTouches[0]?.clientY ?? 0) - touchStartY
  if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy)) {
    go(dx < 0 ? 1 : -1)
  }
}

const focusable = (): HTMLElement[] =>
  Array.from(dialogEl.value?.querySelectorAll<HTMLElement>('button') ?? [])

const onKeydown = (event: KeyboardEvent) => {
  if (!props.open) {
    return
  }
  switch (event.key) {
    case 'Escape':
      emit('close')
      break
    case 'ArrowLeft':
      go(-1)
      break
    case 'ArrowRight':
      go(1)
      break
    case 'Tab': {
      const items = focusable()
      if (items.length === 0) {
        return
      }
      const first = items[0] as HTMLElement
      const last = items[items.length - 1] as HTMLElement
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
      break
    }
  }
}

const scrollActiveThumbIntoView = () => {
  if (!import.meta.client) {
    return
  }
  nextTick(() => {
    thumbStrip.value
      ?.querySelector<HTMLElement>('[data-active="true"]')
      ?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' })
  })
}

watch(() => props.index, scrollActiveThumbIntoView)

watch(
  () => props.open,
  (open) => {
    if (!import.meta.client) {
      return
    }
    if (open) {
      previouslyFocused = document.activeElement as HTMLElement | null
      zoomed.value = false
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', onKeydown)
      document.addEventListener('fullscreenchange', onFullscreenChange)
      nextTick(() => {
        closeButton.value?.focus()
        scrollActiveThumbIntoView()
      })
    } else {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKeydown)
      document.removeEventListener('fullscreenchange', onFullscreenChange)
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {})
      }
      isFullscreen.value = false
      previouslyFocused?.focus()
    }
  }
)

onUnmounted(() => {
  if (import.meta.client) {
    document.body.style.overflow = ''
    window.removeEventListener('keydown', onKeydown)
    document.removeEventListener('fullscreenchange', onFullscreenChange)
  }
})
</script>

<template>
  <Transition name="fade">
    <div
      v-if="open && current"
      ref="dialogEl"
      class="fixed inset-0 z-80 flex items-center justify-center bg-ink-950/95 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      :aria-label="t({ vi: 'Trình xem ảnh', en: 'Image viewer' })"
    >
      <button
        ref="closeButton"
        type="button"
        class="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20"
        :aria-label="t({ vi: 'Đóng', en: 'Close' })"
        @click="emit('close')"
      >
        <Icon
          name="i-lucide-x"
          class="h-5 w-5"
        />
      </button>

      <button
        type="button"
        class="absolute right-16 top-4 z-10 hidden rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20 md:block"
        :aria-label="isFullscreen
          ? t({ vi: 'Thoát toàn màn hình', en: 'Exit fullscreen' })
          : t({ vi: 'Toàn màn hình', en: 'Fullscreen' })"
        @click="toggleFullscreen"
      >
        <Icon
          :name="isFullscreen ? 'i-lucide-minimize' : 'i-lucide-maximize'"
          class="h-5 w-5"
        />
      </button>

      <button
        v-if="images.length > 1"
        type="button"
        class="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20 md:left-6"
        :aria-label="t({ vi: 'Ảnh trước', en: 'Previous image' })"
        @click="go(-1)"
      >
        <Icon
          name="i-lucide-chevron-left"
          class="h-6 w-6"
        />
      </button>

      <button
        v-if="images.length > 1"
        type="button"
        class="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20 md:right-6"
        :aria-label="t({ vi: 'Ảnh tiếp theo', en: 'Next image' })"
        @click="go(1)"
      >
        <Icon
          name="i-lucide-chevron-right"
          class="h-6 w-6"
        />
      </button>

      <div
        class="flex h-full w-full items-center justify-center overflow-hidden px-4 pb-32 pt-16 md:px-20"
        :class="zoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'"
        @click="toggleZoom"
        @touchstart.passive="onTouchStart"
        @touchend="onTouchEnd"
      >
        <NuxtImg
          :key="current.path"
          :src="current.path"
          :alt="altText"
          :width="current.width"
          :height="current.height"
          sizes="sm:100vw md:90vw lg:80vw"
          loading="eager"
          class="max-h-full max-w-full rounded-lg object-contain transition-transform duration-300 ease-out"
          :style="{ transform: zoomed ? 'scale(1.8)' : 'scale(1)', transformOrigin: origin }"
        />
      </div>

      <div class="absolute inset-x-0 bottom-0 flex flex-col items-center gap-3 bg-linear-to-t from-ink-950/90 via-ink-950/60 to-transparent px-4 pb-4 pt-12">
        <div
          v-if="altText || counter"
          class="flex flex-col items-center gap-1 text-center"
        >
          <p
            v-if="altText"
            class="max-w-2xl text-sm text-white/86"
          >
            {{ altText }}
          </p>
          <p
            v-if="counter"
            class="text-xs font-semibold uppercase tracking-[0.2em] text-white/55"
          >
            {{ counter }}
          </p>
        </div>

        <div
          v-if="images.length > 1"
          ref="thumbStrip"
          class="flex max-w-full gap-2 overflow-x-auto px-1 pb-1"
        >
          <button
            v-for="(image, i) in images"
            :key="image.path"
            type="button"
            :data-active="i === index"
            class="relative h-12 w-16 shrink-0 overflow-hidden rounded-md ring-2 transition-all md:h-14 md:w-20"
            :class="i === index ? 'ring-wood-400 opacity-100' : 'ring-transparent opacity-55 hover:opacity-90'"
            :aria-label="t({ vi: `Ảnh ${i + 1}`, en: `Image ${i + 1}` })"
            :aria-current="i === index ? 'true' : undefined"
            @click="selectIndex(i)"
          >
            <NuxtImg
              :src="image.path"
              alt=""
              :width="image.width"
              :height="image.height"
              sizes="sm:80px md:96px"
              loading="lazy"
              class="h-full w-full object-cover"
            />
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>
