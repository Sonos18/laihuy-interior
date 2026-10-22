<script setup lang="ts">
// A row of filter chips that never wraps (DESIGN.md "Chips"). Every option stays on the page and
// reachable: when the chips are wider than the row they scroll sideways, and an edge that still
// has chips beyond it fades out. From 768px two arrow buttons scroll the row for pointer users;
// they are redundant for keyboard users (Tab moves from chip to chip and the browser scrolls the
// focused chip into view, clear of the fade through `scroll-padding`) and for touch users (swipe),
// so they stay out of the tab order and the accessibility tree.
defineProps<{
  /** Names the group of chips for assistive technology. */
  label: string
}>()

const scroller = ref<HTMLElement | null>(null)
const track = ref<HTMLElement | null>(null)
const overflowing = ref(false)
const atStart = ref(true)
const atEnd = ref(true)
let resizeObserver: ResizeObserver | undefined

const measure = () => {
  const element = scroller.value
  if (!element) return
  overflowing.value = element.scrollWidth > element.clientWidth + 1
  atStart.value = element.scrollLeft <= 1
  atEnd.value = element.scrollLeft + element.clientWidth >= element.scrollWidth - 1
}

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

// The browser only scrolls a focused chip when it is wholly out of view, so a chip half hidden
// under the fade would keep keyboard focus with its ring clipped. Bring it clear of the fade.
const FADE_INSET = 48
const revealFocused = (event: FocusEvent) => {
  const element = scroller.value
  const chip = event.target
  if (!element || !(chip instanceof HTMLElement) || !element.contains(chip)) return
  const bounds = element.getBoundingClientRect()
  const box = chip.getBoundingClientRect()
  const startInset = element.scrollLeft > 1 ? FADE_INSET : 4
  const endInset = element.scrollLeft + element.clientWidth < element.scrollWidth - 1 ? FADE_INSET : 4
  const behind = bounds.left + startInset - box.left
  const beyond = box.right - (bounds.right - endInset)
  const left = behind > 0 ? -behind : beyond > 0 ? beyond : 0
  if (left !== 0) element.scrollBy({ left, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
}

const scrollByPage = (direction: -1 | 1) => {
  const element = scroller.value
  if (!element) return
  element.scrollBy({ left: direction * element.clientWidth * 0.8, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
}

onMounted(() => {
  measure()
  resizeObserver = new ResizeObserver(measure)
  if (scroller.value) resizeObserver.observe(scroller.value)
  if (track.value) resizeObserver.observe(track.value)
})

onBeforeUnmount(() => resizeObserver?.disconnect())
</script>

<template>
  <div
    class="chip-row"
    role="group"
    :aria-label="label"
    :data-overflow="overflowing"
    :data-fade-start="overflowing && !atStart"
    :data-fade-end="overflowing && !atEnd"
  >
    <button
      v-if="overflowing"
      type="button"
      class="chip-row__arrow"
      tabindex="-1"
      aria-hidden="true"
      :disabled="atStart"
      @click="scrollByPage(-1)"
    >
      <Icon
        name="i-lucide-arrow-left"
        class="h-4 w-4"
      />
    </button>

    <div
      ref="scroller"
      class="chip-row__scroller"
      @scroll.passive="measure"
      @focusin="revealFocused"
    >
      <div
        ref="track"
        class="chip-row__track"
      >
        <slot />
      </div>
    </div>

    <button
      v-if="overflowing"
      type="button"
      class="chip-row__arrow"
      tabindex="-1"
      aria-hidden="true"
      :disabled="atEnd"
      @click="scrollByPage(1)"
    >
      <Icon
        name="i-lucide-arrow-right"
        class="h-4 w-4"
      />
    </button>
  </div>
</template>

<style scoped>
.chip-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
}

/* The 4px of padding (cancelled by the negative margin) keeps the chips' focus outline inside the
   scroll box, which would otherwise clip it. */
.chip-row__scroller {
  flex: 1 1 auto;
  min-width: 0;
  padding: 4px;
  margin: -4px;
  overflow-x: auto;
  overscroll-behavior-x: contain;
  scroll-padding-inline: 3rem;
  scrollbar-width: none;
}

.chip-row__scroller::-webkit-scrollbar {
  display: none;
}

.chip-row__track {
  display: flex;
  gap: 0.75rem;
  width: max-content;
}

.chip-row[data-fade-end='true'] .chip-row__scroller {
  mask-image: linear-gradient(to right, #000 calc(100% - 3rem), transparent);
}

.chip-row[data-fade-start='true'] .chip-row__scroller {
  mask-image: linear-gradient(to right, transparent, #000 3rem);
}

.chip-row[data-fade-start='true'][data-fade-end='true'] .chip-row__scroller {
  mask-image: linear-gradient(to right, transparent, #000 3rem, #000 calc(100% - 3rem), transparent);
}

.chip-row__arrow {
  display: none;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 2.75rem;
  height: 2.75rem;
  border: 1px solid var(--color-ink-200);
  border-radius: 9999px;
  background: var(--color-white);
  color: var(--color-ink-950);
  transition: border-color var(--dur-hover) var(--ease-editorial), color var(--dur-hover) var(--ease-editorial), opacity var(--dur-hover) var(--ease-editorial);
}

.chip-row__arrow:hover:not(:disabled) {
  border-color: var(--color-wood-500);
  color: var(--color-wood-600);
}

.chip-row__arrow:disabled {
  opacity: 0.4;
}

@media (min-width: 768px) {
  .chip-row__arrow {
    display: inline-flex;
  }
}

@media (prefers-reduced-motion: reduce) {
  .chip-row__arrow {
    transition: none;
  }
}
</style>
