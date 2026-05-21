<script setup lang="ts">
type Props = {
  title: string
  subtitle?: string
  bgImage: string
  specialTitle?: string
  topic?: string
}

withDefaults(defineProps<Props>(), {
  subtitle: '',
  specialTitle: '',
  topic: ''
})
</script>

<template>
  <section class="relative flex min-h-[62vh] items-end overflow-hidden bg-ink-950">
    <img
      :src="bgImage"
      alt=""
      class="absolute inset-0 h-full w-full object-cover object-center"
    >
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
