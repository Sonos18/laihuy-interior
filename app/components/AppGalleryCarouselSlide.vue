<script setup lang="ts">
import { uiText } from '~/data/ui'
import type { MediaPreset } from '~/media/presets'
import type { MediaImage } from '~/shared/media/types'
import type { GallerySlidePosition } from '~/utils/gallery-carousel'

const props = defineProps<{
  image: MediaImage
  index: number
  total: number
  position: GallerySlidePosition
  preset: MediaPreset
  selectable: boolean
}>()

const emit = defineEmits<{
  activate: [index: number]
}>()

const { t } = useLanguage()
const isVisible = computed(() => props.position !== 'offstage')
const isActive = computed(() => props.position === 'active')
const accessibleName = computed(() => {
  const position = `${t(uiText.galleryCarousel.image)} ${props.index + 1} / ${props.total}`
  return isActive.value && props.selectable
    ? `${t(uiText.galleryCarousel.enlarge)} · ${position}`
    : position
})
</script>

<template>
  <article
    data-gallery-slide
    :data-gallery-position="position"
    :data-gallery-index="index"
    class="gallery-carousel-slide absolute left-1/2 top-1/2 aspect-[16/10] overflow-hidden rounded-2xl"
    role="group"
    :aria-roledescription="t({ vi: 'ảnh', en: 'slide' })"
    :aria-hidden="!isVisible"
  >
    <button
      type="button"
      class="group relative h-full w-full cursor-pointer overflow-hidden rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-wood-500"
      :tabindex="isVisible ? 0 : -1"
      :aria-label="accessibleName"
      @click="emit('activate', index)"
    >
      <MediaImage
        :image="image"
        :preset="preset"
        class="h-full w-full"
        img-class="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transition-none"
      />
      <span
        v-if="isActive && selectable"
        aria-hidden="true"
        class="pointer-events-none absolute bottom-4 right-4 rounded-full bg-white/90 p-3 text-ink-950 shadow-lg"
      >
        <Icon
          name="i-lucide-maximize-2"
          class="h-5 w-5"
        />
      </span>
    </button>
  </article>
</template>
