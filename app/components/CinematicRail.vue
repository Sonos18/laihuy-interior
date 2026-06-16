<script setup lang="ts">
import type { LocalizedText } from '~/shared/types/localization'

defineOptions({
  name: 'CinematicRail'
})

/**
 * The page's signature element: a fixed chapter rail that tracks the
 * idea -> experience journey. Numbering is meaningful here because the screens
 * are a true ordered sequence. The gold track fills with overall scroll
 * progress; the active chapter expands to reveal its label.
 */
type Props = {
  scenes: { id: string, chapter: LocalizedText }[]
  activeIndex: number
  progress: number
}

const props = defineProps<Props>()

const { t } = useLanguage()

const pad = (value: number) => String(value + 1).padStart(2, '0')
</script>

<template>
  <nav
    class="rail"
    aria-label="Journey chapters"
  >
    <div class="rail-track">
      <div
        class="rail-fill"
        :style="{ transform: `scaleY(${props.progress})` }"
      />
    </div>

    <ol class="rail-list">
      <li
        v-for="(scene, i) in props.scenes"
        :key="scene.id"
      >
        <a
          :href="`#${scene.id}`"
          class="rail-item"
          :class="{ 'is-active': i === props.activeIndex }"
          :aria-current="i === props.activeIndex ? 'true' : undefined"
          :aria-label="`${pad(i)} — ${t(scene.chapter)}`"
        >
          <span class="rail-num">{{ pad(i) }}</span>
        </a>
      </li>
    </ol>
  </nav>
</template>

<style scoped>
.rail {
  position: fixed;
  top: 50%;
  left: 2rem;
  z-index: 40;
  transform: translateY(-50%);
  display: none;
}

/* Only show on tall enough, wide enough viewports to avoid clutter. */
@media (min-width: 1024px) and (min-height: 640px) {
  .rail {
    display: block;
  }
}

.rail-track {
  position: absolute;
  left: 0.55rem;
  top: 0.4rem;
  bottom: 0.4rem;
  width: 1px;
  background: rgba(255, 255, 255, 0.18);
}

.rail-fill {
  position: absolute;
  inset: 0;
  background: var(--color-wood-400, #b8875a);
  transform-origin: top;
  transform: scaleY(0);
}

.rail-list {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1.35rem;
  margin: 0;
  padding: 0.4rem 0;
  list-style: none;
}

.rail-item {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  color: rgba(255, 255, 255, 0.55);
  transition: color 0.3s ease;
}

.rail-num {
  position: relative;
  width: 1.1rem;
  font-size: 0.66rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  font-variant-numeric: tabular-nums;
  text-align: center;
  /* Sit the number on the track with a small dark gap so the line reads through. */
  background: var(--color-ink-950, #0b0a09);
  padding: 0.15rem 0;
}

.rail-item:hover,
.rail-item:focus-visible {
  color: #fff;
  outline: none;
}

/* The active number grows a touch and turns gold — the only moving part. */
.rail-item.is-active .rail-num {
  color: var(--color-wood-300, #c59b75);
  transform: scale(1.25);
}

.rail-num {
  transition: color 0.3s ease, transform 0.3s ease;
}

@media (prefers-reduced-motion: reduce) {
  .rail-item.is-active .rail-num {
    transform: none;
  }
}
</style>
