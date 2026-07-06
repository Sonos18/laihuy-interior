<script setup lang="ts">
// Aspect-ratio-respecting gallery. Renders a CSS multi-column masonry so each
// image keeps its natural proportions — no cropping. Every item reserves its
// final height from the catalog dimensions, so nothing shifts while images load.
// Only the masonry layout is needed today; alternate layouts can be added later
// as an optional prop without breaking existing callers.
import type { MediaPreset } from '~/media/presets'
import type { MediaImage } from '~/shared/media/types'

type Props = {
  images: MediaImage[]
  preset?: MediaPreset
}

const props = withDefaults(defineProps<Props>(), {
  preset: 'gallery'
})
</script>

<template>
  <div class="columns-1 gap-5 md:columns-2">
    <div
      v-for="image in props.images"
      :key="image.path"
      class="mb-5 break-inside-avoid"
      :style="{ aspectRatio: `${image.width} / ${image.height}` }"
    >
      <MediaImage
        :image="image"
        :preset="props.preset"
        class="h-full w-full rounded-2xl"
        img-class="rounded-2xl"
      />
    </div>
  </div>
</template>
