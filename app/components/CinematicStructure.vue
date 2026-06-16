<script setup lang="ts">
defineOptions({
  name: 'CinematicStructure'
})

/**
 * The architectural "skeleton" revealed during Screen 2's Structure Reveal step.
 *
 * A hand-built, multi-storey structural framework (foundation, columns, floor
 * slabs, roof framing) split into far / mid / near depth layers so the journey
 * timeline can build it up with staggered, parallaxed line-drawing — visually
 * communicating that Lai Huy turns a concept into real construction, not just a
 * pretty render.
 *
 * Lines carry pathLength="1" and a [data-structure-line] hook; useCinematicJourney
 * draws them on via strokeDashoffset. With no JS / reduced motion they stay fully
 * drawn (CSS default). Decorative, so hidden from assistive tech.
 */
type Props = {
  label?: string
}

withDefaults(defineProps<Props>(), {
  label: 'STRUCTURE — 02'
})
</script>

<template>
  <svg
    class="structure"
    viewBox="0 0 800 600"
    fill="none"
    aria-hidden="true"
    preserveAspectRatio="xMidYMid meet"
  >
    <!-- FAR: rear plane of the frame, offset up/right to imply depth -->
    <g
      class="structure-far"
      data-depth="far"
      stroke="currentColor"
    >
      <path
        data-structure-line
        pathLength="1"
        d="M 250 130 L 690 130 L 690 470 L 250 470 Z"
      />
      <path
        data-structure-line
        pathLength="1"
        d="M 250 243 L 690 243"
      />
      <path
        data-structure-line
        pathLength="1"
        d="M 250 356 L 690 356"
      />
      <path
        data-structure-line
        pathLength="1"
        d="M 470 130 L 470 470"
      />
    </g>

    <!-- MID: floor slabs + primary columns of the near plane -->
    <g
      class="structure-mid"
      data-depth="mid"
      stroke="currentColor"
    >
      <!-- Floor slabs (ground, L1, L2, roof line) -->
      <path
        data-structure-line
        pathLength="1"
        d="M 110 500 L 560 500"
      />
      <path
        data-structure-line
        pathLength="1"
        d="M 110 386 L 560 386"
      />
      <path
        data-structure-line
        pathLength="1"
        d="M 110 272 L 560 272"
      />
      <path
        data-structure-line
        pathLength="1"
        d="M 110 158 L 560 158"
      />
      <!-- Columns -->
      <path
        data-structure-line
        pathLength="1"
        d="M 110 158 L 110 500"
      />
      <path
        data-structure-line
        pathLength="1"
        d="M 335 158 L 335 500"
      />
      <path
        data-structure-line
        pathLength="1"
        d="M 560 158 L 560 500"
      />
    </g>

    <!-- NEAR: depth connectors, bracing, roof framing + foundation -->
    <g
      class="structure-near"
      data-depth="near"
      stroke="currentColor"
    >
      <!-- Connectors tying near plane to far plane (perspective edges) -->
      <path
        data-structure-line
        pathLength="1"
        d="M 110 158 L 250 130"
      />
      <path
        data-structure-line
        pathLength="1"
        d="M 560 158 L 690 130"
      />
      <path
        data-structure-line
        pathLength="1"
        d="M 560 500 L 690 470"
      />
      <!-- Diagonal bracing -->
      <path
        data-structure-line
        pathLength="1"
        d="M 110 386 L 335 272"
      />
      <path
        data-structure-line
        pathLength="1"
        d="M 335 500 L 560 386"
      />
      <!-- Roof framing -->
      <path
        data-structure-line
        pathLength="1"
        d="M 110 158 L 335 96 L 560 158"
      />
      <!-- Foundation -->
      <path
        data-structure-line
        pathLength="1"
        d="M 92 512 L 578 512"
        class="structure-base"
      />
    </g>

    <text
      class="structure-label"
      x="92"
      y="78"
      fill="currentColor"
    >{{ label }}</text>
  </svg>
</template>

<style scoped>
.structure {
  width: 100%;
  height: 100%;
  color: var(--color-wood-200, #ddc4aa);
}

.structure g {
  fill: none;
  stroke-width: 1.6;
  stroke-linecap: round;
  stroke-linejoin: round;
}

/* Depth cue: rear plane is fainter and thinner than the near frame. */
.structure-far {
  opacity: 0.4;
  stroke-width: 1.1;
}

.structure-mid {
  opacity: 0.85;
}

.structure-near {
  opacity: 1;
}

.structure-base {
  stroke-width: 2.6;
}

.structure-label {
  font-family: var(--font-sans, sans-serif);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.28em;
  opacity: 0.72;
}

/*
 * Default (no JS / reduced motion): the skeleton is fully drawn. The journey
 * timeline overrides these to draw the lines on progressively.
 */
[data-structure-line] {
  stroke-dasharray: 1;
  stroke-dashoffset: 0;
}
</style>
