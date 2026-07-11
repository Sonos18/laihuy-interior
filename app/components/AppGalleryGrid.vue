<script setup lang="ts">
// Aspect-ratio-respecting gallery. Renders a CSS multi-column masonry so each
// image keeps its natural proportions — no cropping. Every item reserves its
// final height from the catalog dimensions, so nothing shifts while images load.
// Purely presentational: when `selectable` is set it forwards clicks via `select`
// (e.g. to open a lightbox) but never owns any viewer state itself.
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

const { t } = useLanguage()
</script>

<template>
  <div class="columns-1 gap-5 md:columns-2">
    <component
      :is="props.selectable ? 'button' : 'div'"
      v-for="(image, index) in props.images"
      :key="image.path"
      :type="props.selectable ? 'button' : undefined"
      class="group mb-5 block w-full break-inside-avoid"
      :class="props.selectable ? 'cursor-zoom-in' : ''"
      :style="{ aspectRatio: `${image.width} / ${image.height}` }"
      :aria-label="props.selectable
        ? t({ vi: 'Phóng to ảnh', en: 'Enlarge image' })
        : undefined"
      @click="props.selectable && emit('select', index)"
    >
      <div class="relative h-full w-full overflow-hidden rounded-2xl">
        <MediaImage
          :image="image"
          :preset="props.preset"
          class="h-full w-full"
          :img-class="props.selectable
            ? 'transition-transform duration-500 ease-out group-hover:scale-105'
            : ''"
        />
        <div
          v-if="props.selectable"
          class="pointer-events-none absolute inset-0 flex items-center justify-center bg-ink-950/0 opacity-0 transition-all duration-300 group-hover:bg-ink-950/25 group-hover:opacity-100"
        >
          <span class="rounded-full bg-white/90 p-3 text-ink-950 shadow-lg">
            <Icon
              name="i-lucide-maximize-2"
              class="h-5 w-5"
            />
          </span>
        </div>
      </div>
    </component>
  </div>
</template>
