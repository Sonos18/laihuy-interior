<script setup lang="ts">
import { homePageContent, type HomeCapability } from '~/data/home-page'

defineProps<{ capabilities: readonly HomeCapability[] }>()
const { t } = useLanguage()
</script>

<template>
  <section
    data-testid="home-capabilities"
    class="home-capabilities bg-[var(--color-ivory)] text-ink-950"
  >
    <div class="shell">
      <!-- The home page's lead section: its heading takes the Statement role (DESIGN.md). -->
      <SectionHead
        layout="stacked"
        statement
        eyebrow-class="eyebrow home-eyebrow-text text-wood-600"
        :eyebrow="t(homePageContent.capabilities.eyebrow)"
        :title="t(homePageContent.capabilities.title)"
      />

      <ol
        class="home-capabilities__list mt-14"
        role="list"
      >
        <li
          v-for="(capability, index) in capabilities"
          :key="capability.id"
          v-reveal.item
          data-testid="home-capability"
          class="home-capabilities__item reveal"
        >
          <span
            class="home-capabilities__number home-meta-text"
            aria-hidden="true"
          >{{ String(index + 1).padStart(2, '0') }}</span>
          <h3 class="home-capabilities__item-title home-card-heading mt-10 text-ink-950">
            {{ t(capability.title) }}
          </h3>
          <p class="home-capabilities__item-desc mt-4 text-sm leading-[1.7] text-ink-600 md:text-base">
            {{ t(capability.description) }}
          </p>
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped>
/* Raw Silk: one tone step from the Linen material story above and the linen project stage
   below (DESIGN.md Warm Light Rule). Hairlines mark both seams, where the step alone is quiet. */
.home-capabilities {
  padding-block: var(--section-py);
  border-block: 1px solid var(--rule-light);
}

.home-capabilities__list {
  display: grid;
}

.home-capabilities__item {
  position: relative;
  border-top: 1px solid var(--rule-light);
  padding: 1rem 0 2rem;
}

.home-capabilities__number {
  display: inline-block;
  color: var(--accent-light);
  font-weight: 700;
  letter-spacing: 0.16em;
}

/* ── Motion (DESIGN.md "Capabilities motion") ──
   The bronze line: when the list scrolls in, a 1px Workshop Bronze line draws over the items'
   top rules, and each step rises as the line reaches it; once the line has crossed, it fades
   back to the Plaster Line hairline, so the section rests exactly as it was drawn. It rides on
   the items' own scroll reveal (`.is-visible`, plugins/reveal.ts), so it inherits that contract:
   an item painted in view at hydration never replays, and under reduced motion `reveal-ready`
   is never set and nothing here runs. Below 768px each stacked step draws its own line as it
   arrives. */
.home-capabilities__item::before,
.home-capabilities__item::after {
  content: '';
  position: absolute;
  top: -1px;
  right: 0;
  left: 0;
  height: 1px;
  background: var(--color-bronze-warm);
  transform: scaleX(0);
  transform-origin: left;
  pointer-events: none;
}

html.reveal-ready .home-capabilities__item.is-visible::before {
  animation:
    capability-line-draw var(--cap-draw, 900ms) var(--cap-draw-ease, var(--ease-editorial)) var(--cap-start, 0ms) both,
    capability-line-rest 600ms var(--ease-editorial) var(--cap-rest, 1100ms) forwards;
}

@keyframes capability-line-draw {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}

@keyframes capability-line-rest {
  to { opacity: 0; }
}

@media (min-width: 768px) {
  .home-capabilities__list {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  /* One line runs 01 -> 02 -> 03 across the row as three chained segments: ease-in over the
     first, constant speed through the second and ease-out over the third (quadratic curves, the
     outer segments twice as long), so the velocity carries across the joins and the line reads
     as a single stroke. Each step rises as the line reaches it (this replaces the 70ms item
     stagger here), and all three segments fade together once the line has crossed. */
  .home-capabilities__item {
    --cap-rest: 1800ms;
  }

  .home-capabilities__item:nth-child(1) {
    --cap-draw: 640ms;
    --cap-draw-ease: cubic-bezier(0.33, 0, 0.67, 0.33);
  }

  .home-capabilities__item:nth-child(2) {
    --cap-start: 640ms;
    --cap-draw: 320ms;
    --cap-draw-ease: linear;
  }

  .home-capabilities__item:nth-child(3) {
    --cap-start: 960ms;
    --cap-draw: 640ms;
    --cap-draw-ease: cubic-bezier(0.33, 0.67, 0.67, 1);
  }

  html.reveal-ready .home-capabilities__item.is-visible {
    animation-delay: var(--cap-start, 0ms);
  }

  /* The grid stretches the three items to the tallest, so their rules already share one length
     without a min-height floor (which only left an empty block under each item). */
  .home-capabilities__item {
    padding-inline: clamp(1rem, 2.5vw, 2.25rem);
  }

  .home-capabilities__item:first-child { padding-left: 0; }
  .home-capabilities__item + .home-capabilities__item { border-left: 1px solid var(--rule-light); }
}

/* Hover (pointer devices only, where :hover does not stick after a tap): the step's top rule
   turns bronze from the left and its number nudges right. The items are not links, so this is
   acknowledgement only; it uses ::after so the arrival line's fill never holds it. */
@media (hover: hover) and (pointer: fine) {
  .home-capabilities__item::after {
    transition: transform var(--dur-hover) var(--ease-exit);
  }

  .home-capabilities__number {
    transition:
      color var(--dur-hover) var(--ease-editorial),
      transform var(--dur-hover) var(--ease-editorial);
  }

  .home-capabilities__item:hover::after {
    transform: scaleX(1);
    transition: transform 500ms var(--ease-editorial);
  }

  .home-capabilities__item:hover .home-capabilities__number {
    color: var(--color-wood-500);
    transform: translateX(4px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .home-capabilities__item::after,
  .home-capabilities__number {
    transition: none;
  }

  .home-capabilities__item:hover .home-capabilities__number {
    transform: none;
  }
}
</style>
