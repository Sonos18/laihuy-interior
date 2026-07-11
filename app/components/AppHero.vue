<script setup lang="ts">
import type { MediaImage } from '~/shared/media/types'

type Props = {
  title: string
  subtitle?: string
  image: MediaImage
  specialTitle?: string
  topic?: string
}

const props = withDefaults(defineProps<Props>(), {
  subtitle: '',
  specialTitle: '',
  topic: ''
})

const { t } = useLanguage()

const altText = computed(() => (props.image.alt === '' ? '' : t(props.image.alt)))
</script>

<template>
  <section class="relative flex min-h-[62vh] items-end overflow-hidden bg-ink-950">
    <NuxtImg
      :src="image.path"
      :alt="altText"
      :width="image.width"
      :height="image.height"
      sizes="sm:100vw md:100vw lg:100vw xl:100vw"
      loading="eager"
      fetchpriority="high"
      class="absolute inset-0 h-full w-full object-cover object-center"
    />
    <div class="hero-overlay" />

    <div class="relative z-10 w-full">
      <div class="section-shell px-6 pb-20 pt-36 md:pb-24 md:pt-44">
        <span
          v-if="topic"
          class="eyebrow mb-5 block text-wood-300"
        >
          {{ topic }}
        </span>
        <h1 class="max-w-4xl text-4xl font-bold leading-tight text-white md:text-6xl">
          {{ title }}
          <span
            v-if="specialTitle"
            class="text-wood-300"
          >
            {{ specialTitle }}
          </span>
        </h1>
        <p
          v-if="subtitle"
          class="mt-6 max-w-2xl text-lg leading-8 text-white/72"
        >
          {{ subtitle }}
        </p>
      </div>
    </div>
  </section>
</template>
