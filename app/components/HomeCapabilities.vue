<script setup lang="ts">
import { homePageContent, type HomeCapability } from '~/data/home-page'

defineProps<{ capabilities: readonly HomeCapability[] }>()
const { t } = useLanguage()

// The bronze trace (DESIGN.md "Capabilities motion", owner 2026-10-28) loops for as long as the
// list is on screen, and stops the moment it leaves. Reduced motion never starts it.
const list = ref<HTMLElement>()
const tracing = ref(false)
let observer: IntersectionObserver | null = null

onMounted(() => {
  if (!list.value || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return
  }

  observer = new IntersectionObserver((entries) => {
    const entry = entries[entries.length - 1]

    if (entry) {
      tracing.value = entry.isIntersecting
    }
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' })
  observer.observe(list.value)
})

onBeforeUnmount(() => {
  observer?.disconnect()
})
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
        ref="list"
        class="home-capabilities__list mt-14"
        :data-trace="tracing ? 'run' : undefined"
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
          <span
            class="home-capabilities__trace"
            aria-hidden="true"
          />
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
   The bronze trace, one cell after another, on a loop: in cell 01 a Workshop Bronze line runs
   along the top rule (left to right) while another climbs its right-hand divider (bottom to
   top), and the two meet at the top-right corner together; cell 02 does the same; cell 03, which
   has no divider on its right, runs its top rule to the end. The traced lines hold, fade back to
   the Plaster Line hairlines, and the next pass begins. One pass is 5s: 1s per cell on the
   sheen's in-out curve (on-screen travel), a 0.7s hold, a 0.6s fade and a 0.7s rest. It runs
   only while the list is on screen (`data-trace`, set from the script) and never under reduced
   motion. Below 768px the cells stack, there are no dividers, and each top rule traces in turn.

   Each line is a 2px strip (owner, 2026-10-28: one step weightier than the 1px hairline it
   covers, so the bronze reads clearly) scaled from 0 (transform only, so it never touches layout); the
   cell's slot picks which fifth of the pass it draws in, and the fade is shared so every traced
   line clears in the same frame. */
.home-capabilities__trace {
  position: absolute;
  inset: -1px 0 0;
  pointer-events: none;
}

.home-capabilities__trace::before,
.home-capabilities__trace::after {
  content: '';
  position: absolute;
  background: var(--color-bronze-warm);
}

.home-capabilities__trace::before {
  --cap-from: 0 1;
  top: 0;
  right: 0;
  left: 0;
  height: 2px;
  scale: 0 1;
  transform-origin: left;
}

/* The right-hand divider of a cell is the next cell's left border, one pixel past this cell;
   the 2px strip covers it and the pixel inside this cell, as the top strip covers the rule and
   the pixel below it. */
.home-capabilities__trace::after {
  --cap-from: 1 0;
  display: none;
  top: 0;
  right: -1px;
  bottom: 0;
  width: 2px;
  scale: 1 0;
  transform-origin: bottom;
}

[data-trace='run'] .home-capabilities__trace {
  animation: capability-trace-fade 5000ms linear infinite;
}

[data-trace='run'] .home-capabilities__trace::before,
[data-trace='run'] .home-capabilities__trace::after {
  animation: capability-trace-1 5000ms linear infinite;
}

/* Literal names, not a custom property: scoped styles rename keyframes and rewrite only the
   names they can see in `animation`. */
[data-trace='run'] .home-capabilities__item:nth-child(2) .home-capabilities__trace::before,
[data-trace='run'] .home-capabilities__item:nth-child(2) .home-capabilities__trace::after {
  animation-name: capability-trace-2;
}

[data-trace='run'] .home-capabilities__item:nth-child(3) .home-capabilities__trace::before,
[data-trace='run'] .home-capabilities__item:nth-child(3) .home-capabilities__trace::after {
  animation-name: capability-trace-3;
}

@keyframes capability-trace-1 {
  0% { scale: var(--cap-from); animation-timing-function: cubic-bezier(0.45, 0, 0.25, 1); }
  20%, 100% { scale: 1; }
}

@keyframes capability-trace-2 {
  0%, 20% { scale: var(--cap-from); animation-timing-function: cubic-bezier(0.45, 0, 0.25, 1); }
  40%, 100% { scale: 1; }
}

@keyframes capability-trace-3 {
  0%, 40% { scale: var(--cap-from); animation-timing-function: cubic-bezier(0.45, 0, 0.25, 1); }
  60%, 100% { scale: 1; }
}

@keyframes capability-trace-fade {
  0%, 74% { opacity: 1; }
  86%, 100% { opacity: 0; }
}

/* Hover acknowledgement line (see the hover block below). */
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

@media (min-width: 768px) {
  .home-capabilities__list {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  /* Cells 01 and 02 trace their right-hand divider too; cell 03 has none. */
  .home-capabilities__item:not(:last-child) .home-capabilities__trace::after {
    display: block;
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
   acknowledgement only. */
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
  .home-capabilities__trace {
    display: none;
  }

  .home-capabilities__item::after,
  .home-capabilities__number {
    transition: none;
  }

  .home-capabilities__item:hover .home-capabilities__number {
    transform: none;
  }
}
</style>
