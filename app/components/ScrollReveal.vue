<script lang="ts">
// Module-level state — persists across all component instances within the SPA session.
// When the user leaves a route, it's added here. On their next visit to that route,
// all ScrollReveal elements render visible immediately — no animation, no flash.
const visitedRoutes = new Set<string>();
</script>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";

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

const route = useRoute();
const routePath = route.path;
const root = ref<HTMLElement | null>(null);

// State persistence: if this route was previously visited, skip animations entirely
const hasAnimated = visitedRoutes.has(routePath);
const isVisible = ref(hasAnimated);

let observer: IntersectionObserver | null = null;
let rafId: number | null = null;

const translateStyle = computed(() => {
  const map: Record<string, string> = {
    up: `translateY(${props.distance})`,
    down: `translateY(-${props.distance})`,
    left: `translateX(${props.distance})`,
    right: `translateX(-${props.distance})`,
  };
  return map[props.direction];
});

function isElementInViewport(el: HTMLElement): boolean {
  const rect = el.getBoundingClientRect();
  return (
    rect.top < window.innerHeight + 40
    && rect.bottom > 0
    && rect.left < window.innerWidth
    && rect.right > 0
  );
}

function reveal() {
  if (isVisible.value) return;
  isVisible.value = true;
  cleanup();
}

function cleanup() {
  if (rafId !== null) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
  if (observer) {
    observer.disconnect();
    observer = null;
  }
}

onMounted(() => {
  // Route already visited — elements are visible from the start, nothing to do
  if (hasAnimated) return;

  if (!root.value) return;
  const el = root.value;

  // Wait one frame for browser layout to settle
  rafId = requestAnimationFrame(() => {
    rafId = null;

    // Element already in viewport (e.g. top of the page on first load)
    if (isElementInViewport(el)) {
      reveal();
      return;
    }

    // Element is off-screen — watch for scroll
    observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          reveal();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
    );

    observer.observe(el);
  });
});

onUnmounted(() => {
  // Mark this route as visited BEFORE components for the next route mount.
  // Next time the user navigates to this route, all ScrollReveal elements
  // will start with isVisible = true — no flash, no race conditions.
  visitedRoutes.add(routePath);
  cleanup();
});
</script>

<template>
  <div
    ref="root"
    :style="{
      opacity: (isVisible || hasAnimated) ? 1 : 0,
      transform: (isVisible || hasAnimated) ? 'translate(0, 0)' : translateStyle,
      transition: hasAnimated
        ? 'none'
        : `opacity ${duration}ms ease-out ${delay}ms, transform ${duration}ms ease-out ${delay}ms`,
    }"
  >
    <slot />
  </div>
</template>
