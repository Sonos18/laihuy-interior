<script setup lang="ts">
// The homepage proof band: four facts on the Linen canvas, directly below the photographic hero.
//
// It lives OUTSIDE the hero on purpose. The hero photograph is `absolute inset-0 h-full
// object-cover`, so anything inside the hero adds to the height the photograph is cropped to,
// and the band was what made the hero a dark box. Out here the hero's height is the floor in
// main.css (--hero-min-h-home) alone, which tests/e2e/hero.spec.ts G1 asserts, and the band is
// the first content step of the warm-light canvas (DESIGN.md "Metrics Band").
//
// Type: labels are the Label role, values the Stat role. A value that is a figure ("3.000 m²")
// keeps Stat; a value that is a phrase ("Thiết kế → bàn giao") drops to Title so it fits on two
// lines without reading as a broken number. The cells are a subgrid of two rows (label, value),
// so the four labels share a top and the four values share a first baseline whatever their size,
// and the cells share one height, which is also the height of the dividers.
type Metric = {
  label: string
  value: string
  /** A numeric figure keeps the Stat size; a phrase uses the Title size. */
  figure?: boolean
}

defineProps<{
  metrics: Metric[]
}>()
</script>

<template>
  <div
    data-testid="home-metrics"
    class="home-metrics border-b border-[var(--rule-light)] bg-wood-50 text-ink-950"
  >
    <div class="shell">
      <!-- The band reveals as ONE unit (DESIGN.md "Motion"): its hairlines and its figures arrive
           together, so a client-side navigation never shows an empty frame first. The cells do
           not stagger individually. -->
      <dl
        v-reveal
        class="home-metrics__grid reveal"
      >
        <div
          v-for="metric in metrics"
          :key="metric.label"
          data-testid="home-metric"
          class="home-metrics__cell"
        >
          <dt class="home-eyebrow-text text-ink-600">
            {{ metric.label }}
          </dt>
          <dd
            class="home-metrics__value font-display font-medium tracking-tight text-ink-950"
            :class="metric.figure ? 'home-stat-value' : 'home-card-heading'"
          >
            {{ metric.value }}
          </dd>
        </div>
      </dl>
    </div>
  </div>
</template>

<style scoped>
/* Two columns on phones and tablets (a 2x2 block of facts), four from 1024px. Each cell spans
   the two subgrid rows, so label and value rows are shared across a grid row. */
.home-metrics__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  grid-template-rows: repeat(2, auto auto);
}

.home-metrics__cell {
  display: grid;
  grid-row: span 2;
  grid-template-rows: subgrid;
  align-items: baseline;
  row-gap: 0.5rem;
  padding: 1.5rem 1rem;
  border: 0 solid var(--rule-light);
}

/* 2-up: hairline between columns, and between the two rows. */
.home-metrics__cell:nth-child(odd) {
  padding-left: 0;
  border-right-width: 1px;
}

.home-metrics__cell:nth-child(even) {
  padding-right: 0;
}

.home-metrics__cell:nth-child(n + 3) {
  border-top-width: 1px;
}

.home-metrics__value {
  /* A phrase never runs past two lines at any width this grid is used at. */
  text-wrap: balance;
}

@media (min-width: 1024px) {
  .home-metrics__grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    grid-template-rows: auto auto;
  }

  .home-metrics__cell,
  .home-metrics__cell:nth-child(odd),
  .home-metrics__cell:nth-child(even) {
    padding: 2rem 1.5rem;
    border-width: 0;
    border-right-width: 1px;
  }

  .home-metrics__cell:first-child {
    padding-left: 0;
  }

  .home-metrics__cell:last-child {
    padding-right: 0;
    border-right-width: 0;
  }
}
</style>
