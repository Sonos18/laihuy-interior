<script setup lang="ts">
defineOptions({
  name: 'CinematicBlueprint'
})

/**
 * A hand-built architectural line drawing used as the homepage's opening
 * "blueprint" and as the wireframe layer of the blueprint -> render moment.
 * Lines draw themselves on via stroke-dashoffset (see scoped styles), which is
 * the literal interpretation of the brief's "blueprint lines gradually appear".
 *
 * Using a real SVG rather than a stock photo keeps the asset reliable, on-brand,
 * and animatable. It is decorative, so it is hidden from assistive tech.
 */
type Props = {
  label?: string
}

withDefaults(defineProps<Props>(), {
  label: 'FLOOR PLAN — 01'
})
</script>

<template>
  <svg
    class="blueprint"
    viewBox="0 0 800 600"
    fill="none"
    aria-hidden="true"
    preserveAspectRatio="xMidYMid meet"
  >
    <!-- Faint drafting grid (static, sits behind the linework) -->
    <g class="blueprint-grid">
      <path
        v-for="x in 16"
        :key="`v-${x}`"
        :d="`M ${x * 50} 0 L ${x * 50} 600`"
      />
      <path
        v-for="y in 12"
        :key="`h-${y}`"
        :d="`M 0 ${y * 50} L 800 ${y * 50}`"
      />
    </g>

    <!-- Animated architectural linework -->
    <g
      class="blueprint-ink"
      stroke="currentColor"
    >
      <!-- Outer walls -->
      <rect
        x="90"
        y="90"
        width="620"
        height="420"
        pathLength="1"
        style="--d: 0s"
      />
      <!-- Interior partitions -->
      <path
        d="M 90 320 L 430 320"
        pathLength="1"
        style="--d: 0.5s"
      />
      <path
        d="M 430 90 L 430 510"
        pathLength="1"
        style="--d: 0.7s"
      />
      <path
        d="M 430 230 L 710 230"
        pathLength="1"
        style="--d: 0.9s"
      />
      <!-- Door swing arcs -->
      <path
        d="M 290 320 A 60 60 0 0 1 290 380"
        pathLength="1"
        style="--d: 1.2s"
      />
      <path
        d="M 430 150 A 60 60 0 0 0 490 150"
        pathLength="1"
        style="--d: 1.3s"
      />
      <!-- A central round feature (table / rug) -->
      <circle
        cx="250"
        cy="200"
        r="70"
        pathLength="1"
        style="--d: 1.45s"
      />
      <!-- Furniture blocks -->
      <rect
        x="500"
        y="300"
        width="170"
        height="90"
        pathLength="1"
        style="--d: 1.6s"
      />
      <rect
        x="150"
        y="380"
        width="200"
        height="90"
        pathLength="1"
        style="--d: 1.7s"
      />
      <!-- Dimension line -->
      <path
        d="M 90 545 L 710 545"
        pathLength="1"
        style="--d: 1.85s"
      />
      <path
        d="M 90 535 L 90 555 M 710 535 L 710 555"
        pathLength="1"
        style="--d: 1.95s"
      />
    </g>

    <text
      class="blueprint-label"
      x="92"
      y="74"
      fill="currentColor"
    >{{ label }}</text>
  </svg>
</template>

<style scoped>
.blueprint {
  width: 100%;
  height: 100%;
  color: var(--color-wood-300, #c59b75);
}

.blueprint-grid path {
  stroke: currentColor;
  stroke-width: 0.5;
  opacity: 0.12;
}

.blueprint-ink {
  fill: none;
  stroke-width: 1.5;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.blueprint-ink rect,
.blueprint-ink path,
.blueprint-ink circle {
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  animation: blueprint-draw 1.4s ease forwards;
  animation-delay: var(--d, 0s);
}

.blueprint-label {
  font-family: var(--font-sans, sans-serif);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.28em;
  opacity: 0;
  animation: blueprint-fade 0.8s ease forwards;
  animation-delay: 0.2s;
}

@keyframes blueprint-draw {
  to {
    stroke-dashoffset: 0;
  }
}

@keyframes blueprint-fade {
  to {
    opacity: 0.7;
  }
}

/* Respect reduced motion: show the finished drawing immediately. */
@media (prefers-reduced-motion: reduce) {
  .blueprint-ink rect,
  .blueprint-ink path,
  .blueprint-ink circle {
    stroke-dashoffset: 0;
    animation: none;
  }

  .blueprint-label {
    opacity: 0.7;
    animation: none;
  }
}
</style>
