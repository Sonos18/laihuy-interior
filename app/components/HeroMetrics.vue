<script setup lang="ts">
// The homepage hero's 4-up proof band, extracted so it has ONE definition.
//
// It exists as a component because it is rendered at two placements — inside the hero on
// md+, as a band directly below the hero under md — and re-inlining the markup at both
// sites would be the duplication AppLangToggle was extracted to end.
//
// Why two placements at all (this is a layout CONTRACT, not styling): the hero photograph
// is `absolute inset-0 h-full object-cover`, so the image's box height follows the hero's
// CONTENT height. Stacked to 4 rows under md this band is 400.8px tall, which pushed the
// hero to 1277px on an 844px viewport — 1.5x the screen. That made the hero's height, and
// therefore the photograph's crop, depend on how tall the copy happened to be, which is
// what made switching langua ge visibly rescale the photo. Out of the hero, the hero's
// natural height drops to 827.9px and fits beneath the floor in BOTH locales.
//
// Keep it out of the hero under md. Putting it back reintroduces the regression.
type Metric = { label: string; value: string };

defineProps<{
  metrics: Metric[];
  /** Reveal delay of the element this band follows, so the stagger stays continuous. */
  baseDelay?: number;
}>();
</script>

<template>
  <div
    class="grid overflow-hidden rounded-2xl border border-white/12 bg-white/[0.04] backdrop-blur-sm sm:grid-cols-2 lg:grid-cols-4"
  >
    <div
      v-for="(metric, index) in metrics"
      :key="metric.label"
      v-reveal="(baseDelay ?? 360) + index * 90"
      class="reveal border-b border-white/10 p-5 sm:border-r lg:border-b-0"
    >
      <p class="text-xs uppercase tracking-[0.18em] text-white/70">
        {{ metric.label }}
      </p>
      <p class="mt-2 text-lg font-black text-white md:text-xl">
        {{ metric.value }}
      </p>
    </div>
  </div>
</template>
