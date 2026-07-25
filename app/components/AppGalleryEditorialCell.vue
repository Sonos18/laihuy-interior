<script setup lang="ts">
// One image cell for AppGalleryEditorial: the image itself plus the site's standard
// hover-to-enlarge treatment — the same visual language AppGalleryGrid's cells already use, so
// the editorial layout introduces no new interaction vocabulary.
import type { MediaPreset } from '~/media/presets'
import type { MediaImage } from '~/shared/media/types'

type Props = {
  image: MediaImage
  index: number
  preset: MediaPreset
  selectable: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  select: [index: number]
}>()

const { t } = useLanguage()
</script>

<template>
  <component
    :is="props.selectable ? 'button' : 'div'"
    :type="props.selectable ? 'button' : undefined"
    class="group block w-full overflow-hidden rounded-2xl"
    :class="props.selectable ? 'cursor-zoom-in' : ''"
    :style="{ aspectRatio: `${props.image.width} / ${props.image.height}` }"
    :aria-label="props.selectable
      ? t({ vi: 'Phóng to ảnh', en: 'Enlarge image' })
      : undefined"
    @click="props.selectable && emit('select', props.index)"
  >
    <div class="relative h-full w-full">
      <MediaImage
        :image="props.image"
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
</template>
