<script setup lang="ts">
// Editorial gallery: a large image alternating with a stacked pair of small images, in a
// repeating 3-image beat. Every image keeps its own aspect-ratio (no cropping) — the same
// principle AppGalleryGrid documents, applied under a different arrangement. Page-only: used
// exclusively by the project case-study Gallery section. AppGalleryGrid remains the shared
// masonry component for the About and Factory pages.
import type { MediaPreset } from '~/media/presets'
import type { MediaImage } from '~/shared/media/types'

type Props = {
  images: MediaImage[]
  preset?: MediaPreset
  selectable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  preset: 'gallery',
  selectable: false
})

const emit = defineEmits<{
  select: [index: number]
}>()

type Cell = { image: MediaImage, index: number }
type Beat = { large: Cell, smalls: Cell[], reverse: boolean }

// Groups images into 3-image beats in source order (position 0 = large, 1-2 = small). `index`
// on every cell is the image's absolute position in `props.images`, not a beat-local position —
// GalleryLightbox needs that absolute index for correct prev/next and thumbnail-strip order.
// The trailing beat degrades gracefully: 2 images left → large + one small; 1 image left → large
// only (the template's `v-if="beat.smalls.length"` skips the empty small column).
const beats = computed<Beat[]>(() => {
  const result: Beat[] = []
  for (let i = 0; i < props.images.length; i += 3) {
    const large: Cell = { image: props.images[i]!, index: i }
    const sliced: MediaImage[] = props.images.slice(i + 1, i + 3)
    const smalls: Cell[] = sliced.map((image, offset) => ({ image, index: i + 1 + offset }))
    result.push({ large, smalls, reverse: result.length % 2 === 1 })
  }
  return result
})
</script>

<template>
  <div class="flex flex-col gap-5">
    <div
      v-for="beat in beats"
      :key="beat.large.image.path"
      class="flex flex-col gap-5 md:flex-row"
      :class="beat.reverse ? 'md:flex-row-reverse' : ''"
    >
      <div
        class="w-full"
        :class="beat.smalls.length ? 'md:w-[58%]' : 'md:w-full'"
      >
        <AppGalleryEditorialCell
          :image="beat.large.image"
          :index="beat.large.index"
          :preset="preset"
          :selectable="selectable"
          @select="emit('select', $event)"
        />
      </div>

      <div
        v-if="beat.smalls.length"
        class="flex flex-col gap-5 md:flex-1"
      >
        <AppGalleryEditorialCell
          v-for="small in beat.smalls"
          :key="small.image.path"
          :image="small.image"
          :index="small.index"
          :preset="preset"
          :selectable="selectable"
          @select="emit('select', $event)"
        />
      </div>
    </div>
  </div>
</template>
