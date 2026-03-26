<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    default: "",
  },
  bgImage: {
    type: String,
    required: true,
  },
  specialTitle: {
    type: String,
    default: "",
  },
  topic: {
    type: String,
    default: "",
  },
});
</script>

<template>
  <section class="relative flex items-end min-h-[60vh] overflow-hidden">
    <!-- Background image -->
    <img
      :src="bgImage"
      alt=""
      class="absolute inset-0 w-full h-full object-cover object-center"
    />

    <!-- Overlay — reuses the shared .hero-overlay class from main.css -->
    <div class="hero-overlay" />

    <!-- Decorative ambient blurs -->
    <div
      class="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"
    />
    <div
      class="absolute bottom-0 left-1/4 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl pointer-events-none"
    />

    <!-- Content — pt-32 md:pt-40 clears the fixed transparent header -->
    <div
      class="relative z-10 w-full max-w-7xl mx-auto px-6 pt-32 pb-20 md:pt-40 md:pb-28"
    >
      <span
        class="text-orange-400 uppercase tracking-[0.2em] text-xs font-semibold mb-4 block animate-fade-in-up"
      >
        {{ topic }}
      </span>
      <h1
        class="text-5xl md:text-6xl font-bold text-white mb-6 animate-fade-in-up"
        style="animation-delay: 150ms"
      >
        {{ title }} <span class="text-orange-500">{{ specialTitle }}</span>
      </h1>
      <p
        v-if="subtitle"
        class="text-xl text-gray-300 max-w-2xl animate-fade-in-up"
        style="animation-delay: 150ms"
      >
        {{ subtitle }}
      </p>
    </div>
  </section>
</template>
