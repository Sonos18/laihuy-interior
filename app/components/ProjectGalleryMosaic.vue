<script setup lang="ts">
// The case-study gallery (DESIGN.md "Project gallery mosaic"): up to nine photographs at once on a
// six-column grid. The first leads (4 x 4) with two stacked beside it; the rest run in rows of
// three, and a last row of one or two widens so no cell is left empty. One, two or three
// photographs take their own layouts. Every tile opens the lightbox on its photograph. A new
// room filter reflows the grid the way the /du-an archive does.
import { uiText } from '~/data/ui'
import type { MediaImage } from '~/shared/media/types'

const props = defineProps<{ images: readonly MediaImage[] }>()

const emit = defineEmits<{ select: [index: number] }>()

const { t } = useLanguage()

const tileClass = (index: number) => {
  const count = props.images.length
  if (count === 1) return 'mosaic-tile--solo'
  if (count === 2) return 'mosaic-tile--half'
  if (index === 0) return 'mosaic-tile--lead'
  if (index <= 2) return 'mosaic-tile--side'
  const rest = count - 3
  const position = index - 3
  const inLastRow = Math.floor(position / 3) === Math.floor((rest - 1) / 3)
  const rowSize = inLastRow ? (rest % 3 || 3) : 3
  return `mosaic-tile--row-${rowSize}`
}

const label = (index: number) =>
  `${t(uiText.galleryTile.enlarge)} · ${t(uiText.galleryTile.image)} ${index + 1} / ${props.images.length}`

// Under reduced motion the group runs without CSS, so a filter swaps the tiles in the same task.
const reflow = ref(true)
onMounted(() => {
  reflow.value = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
})

// A leaving tile is lifted out of the grid at the cell it held, so the others move at once.
function holdLeavingTile(el: Element) {
  if (!(el instanceof HTMLElement)) return
  const { offsetLeft, offsetTop, offsetWidth, offsetHeight } = el
  Object.assign(el.style, {
    left: `${offsetLeft}px`,
    top: `${offsetTop}px`,
    width: `${offsetWidth}px`,
    height: `${offsetHeight}px`
  })
}
</script>

<template>
  <TransitionGroup
    tag="ul"
    name="archive"
    :css="reflow"
    data-gallery-mosaic
    class="project-mosaic"
    :data-gallery-count="images.length"
    @before-leave="holdLeavingTile"
  >
    <li
      v-for="(image, index) in images"
      :key="image.path"
      v-reveal.item.image
      class="reveal mosaic-tile"
      :class="tileClass(index)"
    >
      <button
        type="button"
        class="card-hover mosaic-tile__button"
        :aria-label="label(index)"
        @click="emit('select', index)"
      >
        <MediaImage
          :image="image"
          :preset="index === 0 ? 'full' : 'gallery'"
          class="h-full w-full overflow-hidden rounded-[4px] bg-ink-100"
          img-class="mosaic-tile__img h-full w-full object-cover"
        />
      </button>
    </li>
  </TransitionGroup>
</template>

<style scoped>
.project-mosaic {
  position: relative;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  grid-auto-rows: 9rem;
  gap: 0.75rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.mosaic-tile {
  min-width: 0;
}

.mosaic-tile__button {
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 4px;
}

.mosaic-tile__button:focus-visible {
  outline: 2px solid var(--color-wood-500);
  outline-offset: 3px;
}

/* Below 768px: the lead spans the row, the rest pair up; a tile left alone spans the row. */
.mosaic-tile--solo,
.mosaic-tile--half,
.mosaic-tile--lead {
  grid-column: span 2;
  grid-row: span 2;
}

.mosaic-tile--half + .mosaic-tile--half {
  grid-row: span 2;
}

.project-mosaic > .mosaic-tile:last-child:nth-child(even):not(.mosaic-tile--half) {
  grid-column: span 2;
  grid-row: span 2;
}

@media (min-width: 768px) {
  .project-mosaic {
    grid-template-columns: repeat(6, minmax(0, 1fr));
    grid-auto-rows: clamp(7rem, 2rem + 8vw, 10.5rem);
    gap: 1rem;
  }

  .project-mosaic > .mosaic-tile:last-child:nth-child(even):not(.mosaic-tile--half) {
    grid-column: auto;
    grid-row: auto;
  }

  .mosaic-tile--solo { grid-column: span 6; grid-row: span 4; }
  .mosaic-tile--half { grid-column: span 3; grid-row: span 3; }
  .mosaic-tile--lead { grid-column: span 4; grid-row: span 4; }
  .mosaic-tile--side { grid-column: span 2; grid-row: span 2; }
  .mosaic-tile--row-3 { grid-column: span 2; grid-row: span 2; }
  .mosaic-tile--row-2 { grid-column: span 3; grid-row: span 2; }
  .mosaic-tile--row-1 { grid-column: span 6; grid-row: span 3; }
}

/* The photograph's hover zoom (DESIGN.md "Image hover zoom"); the bronze top line and the lift
   come from `.card-hover`. */
:deep(.mosaic-tile__img) {
  transition: transform var(--dur-image) var(--ease-editorial);
}

@media (hover: hover) and (pointer: fine) {
  .mosaic-tile__button:hover :deep(.mosaic-tile__img) {
    transform: scale(1.03);
  }
}

@media (prefers-reduced-motion: reduce) {
  :deep(.mosaic-tile__img) {
    transition: none;
  }
}
</style>
