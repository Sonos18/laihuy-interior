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
