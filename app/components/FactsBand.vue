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
//
// Motion (DESIGN.md "Facts Band", owner 2026-10-28):
// - Arrival, once, when the band scrolls into view: the cells rise in reading order and each
//   figure counts up from 0 to its value. The real value stays in the DOM the whole time
//   (transparent while the count runs over it), so the cell never changes width and assistive
//   technology always reads the final figure. A band the server already painted in view at
//   hydration keeps its figures still (they must not blink to 0).
// - The bronze line, the one looping motion on the site (owner decision), running only while
//   the band is on screen. On the contained (home) frame it is a beam with a fading tail that
//   travels round the frame's border at an even pace; the full-bleed band has no frame to go
//   round, so there a short glint crosses its top edge instead.
// Under reduced motion none of this runs.
import type { Fact } from '~/utils/facts'

const props = withDefaults(defineProps<{
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

/** How long a figure takes to count up to its value. */
const COUNT_MS = 2400

/** Lead before the count starts, so the first cell has begun to rise when the digits move. */
const COUNT_DELAY_MS = 120

/**
 * `idle`: no arrival (SSR, reduced motion, painted in view at hydration, or after the arrival).
 * `armed`: below the fold, cells held hidden and figures parked at 0 until the band arrives.
 * `play`: the cell sequence and the count are running.
 */
type ArrivalState = 'idle' | 'armed' | 'play'

type Figure = { prefix: string, suffix: string, target: number, separator: string }

const nuxtApp = useNuxtApp()
const band = ref<HTMLElement>()
const arrival = ref<ArrivalState>('idle')
const counts = ref<Record<string, string>>({})
/** True while the band is on screen and motion is allowed: the bronze line runs. */
const lineRunning = ref(false)

/** The beam is three strokes of falling length, front-aligned, so it reads as a head and a tail. */
const BEAM_LAYERS = ['tail', 'body', 'head'] as const

/** Splits "3.000 m²" / "Đến 50" / "Up to 50" around its one number; null when there is none. */
function parseFigure(value: string): Figure | null {
  const match = value.match(/\d[\d.,]*/)

  if (!match || match.index === undefined) {
    return null
  }

  const digits = match[0]

  return {
    prefix: value.slice(0, match.index),
    suffix: value.slice(match.index + digits.length),
    target: Number(digits.replace(/[.,]/g, '')),
    // Thousands are grouped the way the copy groups them: "3.000" (vi) or "3,000" (en).
    separator: digits.match(/[.,]/)?.[0] ?? ''
  }
}

function formatFigure(figure: Figure, n: number): string {
  const digits = String(n)
  const grouped = figure.separator ? digits.replace(/\B(?=(\d{3})+(?!\d))/g, figure.separator) : digits

  return figure.prefix + grouped + figure.suffix
}

function figures(): [string, Figure][] {
  return props.facts
    .filter(fact => fact.figure)
    .map(fact => [fact.id, parseFigure(fact.value)] as const)
    .filter((entry): entry is [string, Figure] => entry[1] !== null)
}

function clearCounts() {
  counts.value = {}
}

let frame = 0
let observer: IntersectionObserver | null = null
let lineObserver: IntersectionObserver | null = null

function runCount(list: [string, Figure][]) {
  const start = performance.now() + COUNT_DELAY_MS

  const tick = (now: number) => {
    const t = Math.min(1, Math.max(0, (now - start) / COUNT_MS))
    // Ease-out cubic: brisk through the small numbers, settling slowly onto the real one.
    const eased = 1 - (1 - t) ** 3

    counts.value = Object.fromEntries(
      list.map(([id, figure]) => [id, formatFigure(figure, Math.round(figure.target * eased))])
    )

    if (t < 1) {
      frame = requestAnimationFrame(tick)
    } else {
      clearCounts()
      arrival.value = 'idle'
    }
  }

  frame = requestAnimationFrame(tick)
}

onMounted(() => {
  const el = band.value

  if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return
  }

  lineObserver = new IntersectionObserver((entries) => {
    const entry = entries[entries.length - 1]

    if (entry) {
      lineRunning.value = entry.isIntersecting
    }
  })
  lineObserver.observe(el)

  const rect = el.getBoundingClientRect()

  if (nuxtApp.isHydrating && rect.top < window.innerHeight && rect.bottom > 0) {
    return
  }

  const list = figures()

  counts.value = Object.fromEntries(list.map(([id, figure]) => [id, formatFigure(figure, 0)]))

  arrival.value = 'armed'

  // The same trigger as the band's own scroll reveal, so frame, cells and figures start together.
  observer = new IntersectionObserver((entries) => {
    if (!entries.some(entry => entry.isIntersecting)) {
      return
    }

    observer?.disconnect()
    observer = null
    arrival.value = 'play'
    runCount(list)
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' })
  observer.observe(el)
})

onBeforeUnmount(() => {
  observer?.disconnect()
  lineObserver?.disconnect()
  cancelAnimationFrame(frame)
})

// A locale switch mid-count must not leave the old language's digits on screen.
watch(() => props.facts, () => {
  if (arrival.value === 'armed' || arrival.value === 'play') {
    cancelAnimationFrame(frame)
    observer?.disconnect()
    clearCounts()
    arrival.value = 'idle'
  }
})
</script>

<template>
  <div
    :id="anchor"
    ref="band"
    data-facts-band
    :data-arrival="arrival"
    :data-line="lineRunning ? 'run' : undefined"
    :data-testid="testid"
    class="facts-band scroll-mt-[calc(var(--header-h)+1rem)] text-ink-950"
    :class="[
      contained
        ? 'facts-band--contained'
        : 'border-b border-[var(--rule-light)] bg-wood-50'
    ]"
  >
    <div class="shell">
      <!-- The frame takes the band's one scroll reveal (as a fade while the cells rise in
           sequence, see "Arrival" below), so a client-side navigation never shows an empty
           frame for long. -->
      <div class="facts-band__frame">
        <svg
          v-if="contained"
          class="facts-band__beam"
          aria-hidden="true"
          focusable="false"
        >
          <rect
            v-for="layer in BEAM_LAYERS"
            :key="layer"
            :class="`facts-band__beam-${layer}`"
            width="100%"
            height="100%"
            rx="4"
            ry="4"
            pathLength="100"
          />
        </svg>
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
            :style="{ '--fact-index': facts.indexOf(fact) }"
          >
            <dt class="facts-band__label home-eyebrow-text text-ink-600">
              {{ fact.label }}
            </dt>
            <dd
              class="facts-band__value font-display font-medium tracking-tight text-ink-950"
              :class="fact.figure ? 'home-stat-value' : 'home-card-heading'"
            >
              <span
                class="facts-band__text"
                :class="{ 'is-counting': counts[fact.id] }"
              >{{ fact.value }}</span>
              <span
                v-if="counts[fact.id]"
                class="facts-band__count"
                aria-hidden="true"
              >{{ counts[fact.id] }}</span>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ── Arrival (see the script header) ── */

.facts-band__grid {
  position: relative;
}

/* The bronze line, full-bleed band: a 1px strip on the grid's top edge carrying one glint, a bronze segment about a third of the width that fades out at both ends.
   The glint is a background moved by background-position, so it is clipped to the strip and
   never spills past the frame; repainting a 1px strip costs next to nothing. Absent when the
   line is not running. */
.facts-band__grid::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  height: 1px;
  background-image: linear-gradient(90deg, transparent, var(--color-bronze-warm) 50%, transparent);
  background-repeat: no-repeat;
  background-size: 30% 100%;
  background-position: -43% 0;
  pointer-events: none;
  z-index: 1;
}

.facts-band--contained .facts-band__grid::before {
  content: none;
}

/* One crossing takes 3.2s on the sheen's in-out curve (on-screen travel, not the front-loaded
   editorial curve), then the edge rests for 1.3s before the next. -43% and 143% put a 30%-wide
   glint just off the left and right ends. */
[data-line='run'] .facts-band__grid::before {
  animation: facts-line 4500ms cubic-bezier(0.45, 0, 0.25, 1) infinite;
}

@keyframes facts-line {
  0% {
    background-position: -43% 0;
  }

  71% {
    background-position: 143% 0;
  }

  100% {
    background-position: 143% 0;
  }
}

/* The bronze line, contained frame: an SVG laid over the grid's border box, its rect on the
   border's outer edge. The rect's path is normalised to 100 units (pathLength), so each layer is
   one dash of N units and a gap of 100 - N, and shifting the dash offset by 100 is one lap at an
   even speed whatever the frame's proportions. Linear timing: a loop has no start or end to ease
   into. Each layer starts (24 - N) units back so the three dashes share a leading edge. */
.facts-band__frame {
  position: relative;
}

.facts-band__beam {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
  pointer-events: none;
  z-index: 1;
}

.facts-band__beam rect {
  fill: none;
  stroke: var(--color-bronze-warm);
  stroke-linecap: round;
  opacity: 0;
}

.facts-band__beam-tail {
  stroke-width: 2px;
  stroke-dasharray: 24 76;
}

.facts-band__beam-body {
  stroke-width: 2px;
  stroke-dasharray: 14 86;
}

.facts-band__beam-head {
  stroke-width: 2.5px;
  stroke-dasharray: 6 94;
}

[data-line='run'] .facts-band__beam-tail {
  opacity: 0.3;
}

[data-line='run'] .facts-band__beam-body {
  opacity: 0.65;
}

[data-line='run'] .facts-band__beam-head {
  opacity: 1;
}

[data-line='run'] .facts-band__beam rect {
  animation-duration: 7s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

[data-line='run'] .facts-band__beam-tail {
  animation-name: facts-beam-tail;
}

[data-line='run'] .facts-band__beam-body {
  animation-name: facts-beam-body;
}

[data-line='run'] .facts-band__beam-head {
  animation-name: facts-beam-head;
}

@keyframes facts-beam-tail {
  from {
    stroke-dashoffset: 0;
  }

  to {
    stroke-dashoffset: -100;
  }
}

@keyframes facts-beam-body {
  from {
    stroke-dashoffset: -10;
  }

  to {
    stroke-dashoffset: -110;
  }
}

@keyframes facts-beam-head {
  from {
    stroke-dashoffset: -18;
  }

  to {
    stroke-dashoffset: -118;
  }
}

/* The cells arrive in reading order, so the frame itself only fades in (one rise per role: the
   cells rise, the frame does not). */
[data-arrival='armed'] .facts-band__cell > * {
  opacity: 0;
}

[data-arrival='armed'] .facts-band__grid.is-visible,
[data-arrival='play'] .facts-band__grid.is-visible {
  animation-name: reveal-fade;
}

[data-arrival='play'] .facts-band__cell > * {
  animation: facts-cell 560ms var(--ease-editorial) backwards;
  animation-delay: calc(160ms + var(--fact-index, 0) * 140ms);
}

[data-arrival='play'] .facts-band__value {
  animation-delay: calc(220ms + var(--fact-index, 0) * 140ms);
}

@keyframes facts-cell {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
}

/* The count is drawn over the real value, which keeps the cell's width and stays readable to
   assistive technology. Tabular figures stop the digits jittering as they change. */
.facts-band__value {
  position: relative;
}

.facts-band__text.is-counting {
  opacity: 0;
}

.facts-band__count {
  position: absolute;
  top: 0;
  left: 0;
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}
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
