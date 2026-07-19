<script setup lang="ts">
// The homepage hero's 4-up proof band.
//
// It renders at exactly ONE placement: directly below the hero, on the hero's own ink-950
// surface, at every breakpoint. It previously had two (inside the hero at lg+, below it
// under lg), which is the arrangement this comment used to defend.
//
// Keep it OUT of the hero — this is a layout CONTRACT, not styling. The hero photograph is
// `absolute inset-0 h-full object-cover`, so the image's box height follows the hero's
// CONTENT height, and this band is content: 138px as a single row at lg+, and 400.8px
// stacked to 4 rows under sm, where it once pushed the hero to 1277px on an 844px viewport.
// Any height it contributes inside the hero is height the photograph must absorb, which
// makes the crop depend on how tall the copy happens to be — and copy height is
// locale-dependent, so switching language visibly rescaled the photo.
//
// Putting it back inside the hero reintroduces that regression AND breaks the per-breakpoint
// --hero-min-h floor, which is sized on the assumption that this band sits outside.
// tests/e2e/hero.spec.ts (G1/G2) fails if either happens.
type Metric = { label: string, value: string }

defineProps<{
  metrics: Metric[]
  /** Reveal delay of the element this band follows, so the stagger stays continuous. */
  baseDelay?: number
}>()
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
