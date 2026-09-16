<script setup lang="ts">
// The homepage hero's 4-up proof band — redesigned as an architectural floating metrics strip.
//
// It renders at exactly ONE placement: directly below the hero copy, inside the hero's own
// Obsidian surface, at every breakpoint.
//
// Keep it OUT of the flex copy container — this is a layout CONTRACT, not styling. The hero
// photograph is `absolute inset-0 h-full object-cover`, so the image's box height follows the
// hero's CONTENT height, and this band is content. tests/e2e/hero.spec.ts (G1/G2) asserts locale
// invariance and requires that metrics band height is consistent across locales.
type Metric = { label: string, value: string }

defineProps<{
  metrics: Metric[]
  /** Reveal delay of the element this band follows, so the stagger stays continuous. */
  baseDelay?: number
}>()
</script>

<template>
  <div
    class="floating-metrics-rail relative overflow-hidden rounded-sm border border-[var(--hairline-gold)] bg-[var(--color-surface-dark)] p-5 md:p-6 lg:p-7"
  >
    <div
      class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0"
    >
      <div
        v-for="(metric, index) in metrics"
        :key="metric.label"
        v-reveal="(baseDelay ?? 320) + index * 80"
        class="reveal metric-col flex flex-col justify-center lg:px-6 lg:first:pl-0 lg:last:border-r-0 lg:last:pr-0"
        :class="[
          index % 2 === 0 ? 'sm:border-r sm:border-[var(--hairline)]' : '',
          index < metrics.length - 2 ? 'sm:border-b sm:border-[var(--hairline)] sm:pb-6' : '',
          'lg:border-b-0 lg:pb-0',
          index < metrics.length - 1 ? 'lg:border-r lg:border-[var(--hairline)]' : ''
        ]"
      >
        <div class="flex items-center gap-2">
          <span
            class="metric-pulse shrink-0"
            aria-hidden="true"
          />
          <p class="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[var(--bronze-light)]">
            {{ metric.label }}
          </p>
        </div>
        <p class="mt-2 font-display text-2xl font-medium tracking-tight text-white md:text-3xl">
          {{ metric.value }}
        </p>
      </div>
    </div>
  </div>
</template>
