<script setup lang="ts">
import type { LocalizedText } from '~/shared/types/localization'

defineOptions({
  name: 'CinematicStage'
})

/**
 * One full-viewport (100vh) storytelling screen.
 *
 * Renders the shared chrome — background image + scrim + chapter eyebrow,
 * display title, subtitle and CTA — and exposes a `visual` slot so special
 * screens (the blueprint, the detail montage) can swap the background while
 * keeping identical typography and spacing. Animation hooks are plain data
 * attributes consumed by useCinematicJourney.
 */
type StateBCopy = {
  chapter: LocalizedText
  title: LocalizedText
  subtitle: LocalizedText
}

type Props = {
  index: number
  chapter: LocalizedText
  title: LocalizedText
  subtitle: LocalizedText
  cta: { label: LocalizedText, to: string }
  image?: string
  align?: 'left' | 'center'
  /** Anchor id so the chapter rail can deep-link to this scene. */
  anchor?: string
  /**
   * When present (Screen 2), the stage carries a second story step. The primary
   * copy becomes State A and this copy crossfades in as State B during the
   * Structure Reveal. useCinematicJourney drives [data-state-a]/[data-state-b].
   */
  stateB?: StateBCopy
}

const props = withDefaults(defineProps<Props>(), {
  image: undefined,
  align: 'left',
  anchor: undefined,
  stateB: undefined
})

const { t } = useLanguage()

const chapterNumber = computed(() => String(props.index + 1).padStart(2, '0'))
</script>

<template>
  <section
    :id="anchor"
    class="cinematic-stage"
    data-scene
  >
    <div class="stage-visual">
      <slot name="visual">
        <img
          v-if="image"
          :src="image"
          :alt="t(title)"
          class="stage-image"
          data-parallax
          loading="lazy"
          decoding="async"
        >
      </slot>
      <div class="stage-scrim" />
      <!-- Sits above the scrim but below the text (e.g. the blueprint linework). -->
      <slot name="overlay" />
    </div>

    <div
      class="stage-content"
      :class="align === 'center' ? 'is-center' : 'is-left'"
      :data-state-a="stateB ? '' : undefined"
    >
      <p
        class="stage-eyebrow"
        data-reveal
      >
        <span class="stage-chapter">{{ chapterNumber }}</span>
        <span class="stage-rule" />
        {{ t(chapter) }}
      </p>

      <h2
        class="stage-title font-display"
        data-reveal
      >
        {{ t(title) }}
      </h2>

      <p
        class="stage-subtitle"
        data-reveal
      >
        {{ t(subtitle) }}
      </p>

      <div data-reveal>
        <NuxtLink
          :to="cta.to"
          class="stage-cta"
        >
          {{ t(cta.label) }}
          <Icon
            name="i-lucide-arrow-right"
            class="stage-cta-icon"
          />
        </NuxtLink>
      </div>

      <slot name="extra" />
    </div>

    <!-- State B (Screen 2 Structure Reveal): overlaid copy that crossfades in. -->
    <div
      v-if="stateB"
      class="stage-overlay"
      data-state-b
    >
      <div
        class="stage-content"
        :class="align === 'center' ? 'is-center' : 'is-left'"
      >
        <p class="stage-eyebrow">
          <span class="stage-chapter">{{ chapterNumber }}</span>
          <span class="stage-rule" />
          {{ t(stateB.chapter) }}
        </p>

        <h2 class="stage-title font-display">
          {{ t(stateB.title) }}
        </h2>

        <p class="stage-subtitle">
          {{ t(stateB.subtitle) }}
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.cinematic-stage {
  position: relative;
  display: flex;
  align-items: center;
  min-height: 100vh;
  min-height: 100svh;
  overflow: hidden;
  background-color: var(--color-ink-950, #0b0a09);
  color: #fff;
}

.stage-visual {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.stage-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  will-change: transform;
}

/* Dark, slightly warm scrim keeps large light type legible over any photo. */
.stage-scrim {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(to top, rgba(11, 10, 9, 0.92) 0%, rgba(11, 10, 9, 0.35) 45%, rgba(11, 10, 9, 0.55) 100%),
    radial-gradient(120% 90% at 20% 80%, rgba(11, 10, 9, 0.55), transparent 60%);
}

.stage-content {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 80rem;
  margin: 0 auto;
  padding: 8rem 1.5rem 6rem;
}

@media (min-width: 1024px) {
  .stage-content {
    padding-inline: 2rem;
  }
}

/* State B copy overlays State A and is crossfaded in by the journey timeline. */
.stage-overlay {
  position: absolute;
  inset: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  pointer-events: none;
}

.stage-overlay .stage-content {
  pointer-events: auto;
}

.stage-content.is-center {
  text-align: center;
}

.stage-content.is-center .stage-eyebrow {
  justify-content: center;
}

.stage-content.is-left {
  max-width: 80rem;
}

.stage-content.is-left .stage-title,
.stage-content.is-left .stage-subtitle {
  max-width: 52rem;
}

.stage-content.is-center .stage-title,
.stage-content.is-center .stage-subtitle {
  margin-inline: auto;
  max-width: 56rem;
}

.stage-eyebrow {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: var(--color-wood-300, #c59b75);
}

.stage-chapter {
  font-variant-numeric: tabular-nums;
}

.stage-rule {
  width: 2.5rem;
  height: 1px;
  background: currentColor;
  opacity: 0.6;
}

.stage-title {
  margin-top: 1.75rem;
  font-weight: 300;
  line-height: 1.02;
  letter-spacing: -0.01em;
  font-size: clamp(2.6rem, 7vw, 5.75rem);
}

.stage-subtitle {
  margin-top: 1.75rem;
  font-size: clamp(1rem, 1.4vw, 1.3rem);
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.74);
}

/* Elegant underline CTA rather than a solid button, to suit the cinematic frames. */
.stage-cta {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  margin-top: 2.5rem;
  padding-bottom: 0.4rem;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #fff;
  border-bottom: 1px solid var(--color-wood-400, #b8875a);
  transition: color 0.3s ease, gap 0.3s ease;
}

.stage-cta:hover {
  color: var(--color-wood-300, #c59b75);
  gap: 1rem;
}

.stage-cta-icon {
  width: 1rem;
  height: 1rem;
}

.stage-cta:focus-visible {
  outline: 2px solid var(--color-wood-300, #c59b75);
  outline-offset: 4px;
}
</style>
