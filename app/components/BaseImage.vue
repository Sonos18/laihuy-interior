<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

interface Props {
  src: string;
  alt: string;
  class?: string;
  imgClass?: string;
  width?: number | string;
  height?: number | string;
}

const props = withDefaults(defineProps<Props>(), {
  class: "",
  imgClass: "",
});

const root = ref<HTMLElement | null>(null);
const isVisible = ref(false);
const isLoaded = ref(false);

let observer: IntersectionObserver | null = null;

onMounted(() => {
  observer = new IntersectionObserver(
    ([entry]) => {
      if (entry?.isIntersecting) {
        isVisible.value = true;
        observer?.disconnect();
      }
    },
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
  );

  if (root.value) observer.observe(root.value);
});

onUnmounted(() => {
  observer?.disconnect();
});
</script>

<template>
  <div ref="root" :class="['relative overflow-hidden', props.class]">
    <!-- Blur placeholder -->
    <div
      :class="[
        'absolute inset-0 bg-gray-200 animate-pulse transition-opacity duration-500',
        isLoaded ? 'opacity-0' : 'opacity-100',
      ]"
    />

    <img
      v-if="isVisible"
      :src="props.src"
      :alt="props.alt"
      :width="props.width"
      :height="props.height"
      loading="lazy"
      decoding="async"
      :class="[
        'w-full h-full object-cover transition-[opacity,transform] duration-700 ease-out',
        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5',
        props.imgClass,
      ]"
      @load="isLoaded = true"
    />
  </div>
</template>
