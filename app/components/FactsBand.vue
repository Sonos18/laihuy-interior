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
// - The bronze beams, the one looping motion on the site (owner decision), running only while
//   the band is on screen. Each row of cells carries a pair of beams with fading tails that set
//   off together from the top and bottom edges of its first cell and run left to right in a
//   zigzag: at every divider they swap sides (top goes down, bottom goes up), crossing at its
//   middle, so between them they trace every cell's outline. At the far end they turn and come
//   back the same way to where they set off, and round again, never leaving the band. The beams
//   are one SVG over the grid (a `<dl>` may only hold its dt/dd groups); the paths are built
//   from the cells' measured boxes and rebuilt when the grid resizes.
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

/** A beam is three strokes of falling length, front-aligned, so it reads as a head and a tail. */
const BEAM_LAYERS = ['tail', 'body', 'head'] as const

type CellBox = { id: string, x: number, y: number, width: number, height: number }

const grid = ref<HTMLElement>()
/** Each cell's box in the frame's coordinates; empty until measured on the client. */
const cellBoxes = ref<CellBox[]>([])

type Point = [number, number]

/**
 * The beam pair for each row of cells. Both beams ride one closed loop: out along the zigzag
 * that starts on the first cell's top edge (one cell's edge, then across to the other edge down
 * or up the divider, then down or up the row's outer right edge), and back along the mirror
 * zigzag to the first cell's bottom-left corner, closing up its left edge. One beam rides it
 * from the top-left corner, the other the opposite way from the bottom-left corner, so they set
 * off together, cross at every divider, meet at the far end and come back round.
 */
const beamPaths = computed(() => {
  const rows = new Map<number, CellBox[]>()

  for (const cell of cellBoxes.value) {
    const key = Math.round(cell.y)
    rows.set(key, [...(rows.get(key) ?? []), cell])
  }

  const toPath = (points: Point[]) =>
    `M ${points.map(([x, y]) => `${x} ${y}`).join(' L ')} Z`

  return [...rows.values()].flatMap((row, rowIndex) => {
    const cells = [...row].sort((a, b) => a.x - b.x)
    const first = cells[0]!
    const top = first.y
    const bottom = first.y + first.height
    const zigzag = (startOnTop: boolean): Point[] => {
      let onTop = startOnTop
      const points: Point[] = [[first.x, onTop ? top : bottom]]

      for (const cell of cells) {
        const right = cell.x + cell.width
        points.push([right, onTop ? top : bottom])
        onTop = !onTop
        points.push([right, onTop ? top : bottom])
      }

      return points
    }
    // The way back is the mirror zigzag reversed, less the outer right edge the way out already ran.
    const loop = [...zigzag(true), ...zigzag(false).reverse().slice(2)]

    return [
      { key: `${rowIndex}-top`, d: toPath(loop) },
      { key: `${rowIndex}-bottom`, d: toPath([...loop].reverse()) }
    ]
  })
})

function measureCells() {
  const el = grid.value

  if (!el) {
    return
  }

  // Cells are positioned against the grid's padding box; the SVG covers its border box.
  cellBoxes.value = Array.from(el.children)
    .filter((cell): cell is HTMLElement => cell instanceof HTMLElement)
    .map(cell => ({
      id: cell.dataset.fact ?? '',
      x: el.clientLeft + cell.offsetLeft,
      y: el.clientTop + cell.offsetTop,
      width: cell.offsetWidth,
      height: cell.offsetHeight
    }))
}

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
let resizeObserver: ResizeObserver | null = null

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

  resizeObserver = new ResizeObserver(measureCells)

  if (grid.value) {
    resizeObserver.observe(grid.value)
  }

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
  resizeObserver?.disconnect()
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

  // The cells' set or wrapping may change with the copy. Only re-measured where the beams run
  // (the resize observer exists only then): measuring under reduced motion would draw them.
  if (resizeObserver) {
    nextTick(measureCells)
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
    class="facts-band scroll-mt-[calc(var(--header-anchor)+1rem)] text-ink-950"
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
          v-if="cellBoxes.length"
          class="facts-band__beam"
          aria-hidden="true"
          focusable="false"
        >
          <g
            v-for="beam in beamPaths"
            :key="beam.key"
          >
            <path
              v-for="layer in BEAM_LAYERS"
              :key="layer"
              :class="`facts-band__beam-${layer}`"
              :d="beam.d"
              pathLength="100"
            />
          </g>
        </svg>
        <dl
          ref="grid"
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

/* The bronze beams: an SVG laid over the grid's border box, the closed loops on the cells'
   edges. Each loop is normalised to 100 units (pathLength), so each layer is one dash of N units
   and a gap of 100 - N, and moving the offset from N to N - 100 is one lap with the leading edge
   going from the start back to the start, so the next lap follows on seamlessly. The two paths
   of a pair are the same loop run in opposite directions, so they cross every divider
   together. Linear timing: a loop has no start or end to ease into. */
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

.facts-band__beam path {
  fill: none;
  stroke: var(--color-bronze-warm);
  stroke-linecap: round;
  stroke-linejoin: round;
  opacity: 0;
}

.facts-band__beam-tail {
  stroke-width: 2px;
  stroke-dasharray: 12 88;
}

.facts-band__beam-body {
  stroke-width: 2px;
  stroke-dasharray: 7 93;
}

.facts-band__beam-head {
  stroke-width: 2.5px;
  stroke-dasharray: 3 97;
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

[data-line='run'] .facts-band__beam path {
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
    stroke-dashoffset: 12;
  }

  to {
    stroke-dashoffset: -88;
  }
}

@keyframes facts-beam-body {
  from {
    stroke-dashoffset: 7;
  }

  to {
    stroke-dashoffset: -93;
  }
}

@keyframes facts-beam-head {
  from {
    stroke-dashoffset: 3;
  }

  to {
    stroke-dashoffset: -97;
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
