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

// Image arrival (DESIGN.md "Motion", image arrival). The server paints this <img>, so by the time
// the component mounts the photograph may already be complete, may be part-decoded, or may still
// be in flight. Only the last case is hidden (`is-pending`), so it can fade in over the
// placeholder the moment it lands (`is-arriving`). An image that already has decoded data is
// never touched: a painted frame must not blink. Reduced motion never hides anything (and the
// CSS ignores the classes under it anyway).
const frame = ref<HTMLElement | null>(null)
const phase = ref<'idle' | 'pending' | 'arriving'>('idle')

function onSettled() {
  isLoaded.value = true
  if (phase.value === 'pending') {
    phase.value = 'arriving'
  }
}

onMounted(() => {
  const img = frame.value?.querySelector('img')
  if (!img) {
    return
  }

  if (img.complete && img.naturalWidth !== 0) {
    isLoaded.value = true
    return
  }

  // Part-decoded (progressive) or errored: show whatever there is, do not hide it.
  if (img.naturalWidth !== 0 || img.complete) {
    return
  }

  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    phase.value = 'pending'
  }
})

// An error releases the hidden state at once (nothing will ever arrive to fade in).
function onError() {
  phase.value = 'idle'
}
</script>

<template>
  <div
    ref="frame"
    :class="['relative isolate overflow-hidden', props.class]"
  >
    <div
      v-if="presetConfig.skeleton"
      :class="[
        'media-skeleton absolute inset-0 -z-10 bg-ink-100',
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
      :class="[
        'media-img h-full w-full object-cover',
        props.imgClass,
        phase === 'pending' && 'is-pending',
        phase === 'arriving' && 'is-arriving'
      ]"
      @load="onSettled"
      @error="onError"
    />
  </div>
</template>
