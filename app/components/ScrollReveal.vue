<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

interface Props {
  direction?: "up" | "down" | "left" | "right";
  delay?: number;
  duration?: number;
  distance?: string;
}

const props = withDefaults(defineProps<Props>(), {
  direction: "up",
  delay: 0,
  duration: 700,
  distance: "30px",
});

const root = ref<HTMLElement | null>(null);
const isVisible = ref(false);

let observer: IntersectionObserver | null = null;

const translateMap: Record<string, string> = {
  up: `translateY(${props.distance})`,
  down: `translateY(-${props.distance})`,
  left: `translateX(${props.distance})`,
  right: `translateX(-${props.distance})`,
};

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
  <div
    ref="root"
    :style="{
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translate(0, 0)' : translateMap[direction],
      transition: `opacity ${duration}ms ease-out ${delay}ms, transform ${duration}ms ease-out ${delay}ms`,
    }"
  >
    <slot />
  </div>
</template>
