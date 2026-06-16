<script setup lang="ts">
import type { LocalizedText } from '~/shared/types/localization'

defineOptions({
  name: 'CinematicRail'
})

/**
 * The page's signature element: a fixed chapter rail that tracks the
 * idea -> experience journey. It mirrors the journey's discrete steps — primary
 * chapters show a number, while Screen 2's Structure Reveal sub-step shows a
 * smaller nested dot, so the rail stays in sync with the sub-step navigation.
 * The gold track fills with overall step progress; clicking a tick jumps to it.
 */
export type RailStep = {
  /** Padded chapter number for primary steps; null for a sub-step (dot). */
  number: string | null
  chapter: LocalizedText
  isSub: boolean
  /** Anchor id used as the reduced-motion / no-JS scroll fallback. */
  anchorId: string
}

type Props = {
  steps: RailStep[]
  activeStep: number
  progress: number
}

const props = defineProps<Props>()
const emit = defineEmits<{ select: [step: number] }>()

const { t } = useLanguage()
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
        v-for="(step, i) in props.steps"
        :key="i"
        :class="{ 'is-sub': step.isSub }"
      >
        <a
          :href="`#${step.anchorId}`"
          class="rail-item"
          :class="{ 'is-active': i === props.activeStep }"
          :aria-current="i === props.activeStep ? 'true' : undefined"
          :aria-label="`${step.number ?? '—'} — ${t(step.chapter)}`"
          @click.prevent="emit('select', i)"
        >
          <span
            v-if="step.number"
            class="rail-num"
          >{{ step.number }}</span>
          <span
            v-else
            class="rail-dot"
          />
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
  transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
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

/* The Screen 2 sub-step sits tighter under its parent chapter. */
.rail-list li.is-sub {
  margin-top: -0.7rem;
  margin-left: 0.1rem;
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
  transition: color 0.3s ease, transform 0.3s ease;
}

/* Sub-step marker: a small dot centered on the track. */
.rail-dot {
  position: relative;
  width: 1.1rem;
  display: flex;
  justify-content: center;
}

.rail-dot::before {
  content: '';
  width: 0.34rem;
  height: 0.34rem;
  border-radius: 50%;
  background: var(--color-ink-950, #0b0a09);
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.4);
  transition: background 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease;
}

.rail-item:hover,
.rail-item:focus-visible {
  color: #fff;
  outline: none;
}

/* The active number grows a touch and turns gold. */
.rail-item.is-active .rail-num {
  color: var(--color-wood-300, #c59b75);
  transform: scale(1.25);
}

.rail-item.is-active .rail-dot::before {
  background: var(--color-wood-300, #c59b75);
  box-shadow: 0 0 0 1px var(--color-wood-300, #c59b75);
  transform: scale(1.2);
}

@media (prefers-reduced-motion: reduce) {
  .rail-item.is-active .rail-num,
  .rail-item.is-active .rail-dot::before {
    transform: none;
  }

  .rail-fill {
    transition: none;
  }
}
</style>
