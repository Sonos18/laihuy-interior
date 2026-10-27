<script setup lang="ts">
// The one treatment of the site's proof facts (DESIGN.md "Facts Band"): a full-width Linen band
// with a Plaster hairline under it, used below the home, /gioi-thieu and /nha-xuong heroes and at
// the head of the case-study finale. A page chooses WHICH facts it shows, never how they look.
//
// Type: labels are the Label role, values the Stat role when they are figures ("3.000 m²") and the
// Title role when they are phrases ("Trọn gói"), so a phrase fits on two lines without reading as
// a broken number. The cells are a subgrid of two rows (label, value), so the labels share a top
// and the values a first baseline whatever their size, and the cells share one height, which is
// also the height of the dividers.
//
// The grid follows the number of facts: four are a 2 x 2 block below 1024px and four across from
// 1024px; three stack below 768px and run three across from 768px (a 2 + 1 block would orphan one
// cell). The test ids are props so each route keeps the hooks its specs already address.
import type { Fact } from '~/utils/facts'

withDefaults(defineProps<{
  facts: readonly Fact[]
  /** Wrapper test id (e.g. `home-metrics`, `factory-stats`). */
  testid?: string
  /** Test id on the `<dl>` grid. */
  gridTestid?: string
  /** Test id on every cell. */
  cellTestid?: string
  /** Anchor id for in-page links to the band. */
  anchor?: string
  /** Keep background, top/bottom hairlines and cell dividers inside the shell width. */
  contained?: boolean
}>(), {
  testid: 'facts-band',
  gridTestid: undefined,
  cellTestid: 'fact',
  anchor: undefined,
  contained: false
})
</script>

<template>
  <div
    :id="anchor"
    data-facts-band
    :data-testid="testid"
    class="facts-band scroll-mt-[calc(var(--header-h)+1rem)] text-ink-950"
    :class="[
      contained
        ? 'facts-band--contained'
        : 'border-b border-[var(--rule-light)] bg-wood-50'
    ]"
  >
    <div class="shell">
      <!-- The band reveals as ONE unit (DESIGN.md "Motion"): its hairlines and its figures arrive
           together, so a client-side navigation never shows an empty frame first. The cells do
           not stagger individually. -->
      <dl
        v-reveal
        :data-testid="gridTestid"
        :data-count="facts.length === 3 ? 3 : 4"
        class="facts-band__grid reveal"
      >
        <div
          v-for="fact in facts"
          :key="fact.id"
          :data-testid="cellTestid"
          :data-fact="fact.id"
          :data-stat-id="fact.id"
          class="facts-band__cell"
        >
          <dt class="facts-band__label home-eyebrow-text text-ink-600">
            {{ fact.label }}
          </dt>
          <dd
            class="facts-band__value font-display font-medium tracking-tight text-ink-950"
            :class="fact.figure ? 'home-stat-value' : 'home-card-heading'"
          >
            {{ fact.value }}
          </dd>
        </div>
      </dl>
    </div>
  </div>
</template>

<style scoped>
/* Each cell spans the two subgrid rows, so label and value rows are shared across a grid row. */
.facts-band__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  grid-auto-rows: auto;
}

/* Outer cells sit flush with the rail on the full-bleed band; inside the contained box they
   keep an inset so the figures do not touch its border. */
.facts-band {
  --facts-edge: 0;
}

.facts-band--contained {
  --facts-edge: 1.25rem;
  padding-top: 2rem;
}

/* Contained: the background and hairlines stay inside the shell width. */
.facts-band--contained .facts-band__grid {
  background-color: var(--color-wood-50);
  border: 1px solid var(--rule-light);
  border-radius: 4px;
}

.facts-band__cell {
  display: grid;
  grid-row: span 2;
  grid-template-rows: subgrid;
  align-items: baseline;
  row-gap: 0.5rem;
  padding: 1.5rem 1rem;
  border: 0 solid var(--rule-light);
}

.facts-band__value {
  /* A phrase never runs past two lines at any width this grid is used at. */
  text-wrap: balance;
}

/* Four facts, 2-up: hairline between columns, and between the two rows. */
.facts-band__grid[data-count='4'] > .facts-band__cell:nth-child(odd) {
  padding-left: var(--facts-edge);
  border-right-width: 1px;
}

.facts-band__grid[data-count='4'] > .facts-band__cell:nth-child(even) {
  padding-right: var(--facts-edge);
}

.facts-band__grid[data-count='4'] > .facts-band__cell:nth-child(n + 3) {
  border-top-width: 1px;
}

/* Three facts, stacked: one column, a hairline between rows. */
.facts-band__grid[data-count='3'] {
  grid-template-columns: minmax(0, 1fr);
}

.facts-band__grid[data-count='3'] > .facts-band__cell {
  padding-inline: var(--facts-edge);
}

.facts-band__grid[data-count='3'] > .facts-band__cell + .facts-band__cell {
  border-top-width: 1px;
}

/* N across: a hairline between neighbours, the outer cells flush with the rail. */
@media (min-width: 768px) {
  .facts-band--contained {
    --facts-edge: 1.5rem;
    padding-top: 3rem;
  }

  .facts-band__grid[data-count='3'] {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .facts-band__grid[data-count='3'] > .facts-band__cell,
  .facts-band__grid[data-count='3'] > .facts-band__cell + .facts-band__cell {
    padding: 2rem 1.5rem;
    border-width: 0;
    border-right-width: 1px;
  }

  .facts-band__grid[data-count='3'] > .facts-band__cell:first-child {
    padding-left: var(--facts-edge);
  }

  .facts-band__grid[data-count='3'] > .facts-band__cell:last-child {
    padding-right: var(--facts-edge);
    border-right-width: 0;
  }
}

@media (min-width: 1024px) {
  .facts-band__grid[data-count='4'] {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .facts-band__grid[data-count='4'] > .facts-band__cell,
  .facts-band__grid[data-count='4'] > .facts-band__cell:nth-child(odd),
  .facts-band__grid[data-count='4'] > .facts-band__cell:nth-child(even) {
    padding: 2rem 1.5rem;
    border-width: 0;
    border-right-width: 1px;
  }

  .facts-band__grid[data-count='4'] > .facts-band__cell:first-child {
    padding-left: var(--facts-edge);
  }

  .facts-band__grid[data-count='4'] > .facts-band__cell:last-child {
    padding-right: var(--facts-edge);
    border-right-width: 0;
  }
}
</style>
