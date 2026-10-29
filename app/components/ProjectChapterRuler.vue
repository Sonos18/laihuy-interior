<script setup lang="ts">
// The case study's chapter ruler (DESIGN.md "Project chapter ruler"): the project's name, one
// entry per chapter and, while the header is away, the quote action. Each chapter has its own
// 2px track that fills in bronze with the part of that chapter already read, so the bar is the
// page's reading progress split by chapter. The tracks follow the scroll directly (no easing of
// their own) and rest full under reduced motion.
import { uiText } from '~/data/ui'
import type { ProjectNavSection } from '~/shared/types/project-detail'

const props = defineProps<{
  category: string
  title: string
  sections: readonly ProjectNavSection[]
}>()

const { t } = useLanguage()

const active = ref('')
const progress = ref<Record<string, number>>({})

const pad = (n: number) => String(n).padStart(2, '0')

onMounted(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const elements = () => props.sections
    .map(section => document.getElementById(section.id))
    .filter((element): element is HTMLElement => Boolean(element))

  // A chapter is read from the moment its top reaches the reading line (40% down the viewport)
  // to the moment its bottom passes it. The current chapter is the one the line is inside; above
  // the first chapter the first one is current (it is the next to read), below the last none is.
  let frame = 0
  const measure = () => {
    frame = 0
    const line = window.innerHeight * 0.4
    const next: Record<string, number> = {}
    const list = elements()
    let current = list[0] && list[0].getBoundingClientRect().top > line ? list[0].id : ''
    for (const element of list) {
      const rect = element.getBoundingClientRect()
      next[element.id] = reduced ? 1 : Math.min(1, Math.max(0, (line - rect.top) / rect.height))
      if (rect.top <= line && rect.bottom > line) current = element.id
    }
    progress.value = next
    active.value = current
  }
  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(measure)
  }

  window.addEventListener('scroll', schedule, { passive: true })
  window.addEventListener('resize', schedule, { passive: true })
  measure()

  onUnmounted(() => {
    window.removeEventListener('scroll', schedule)
    window.removeEventListener('resize', schedule)
    cancelAnimationFrame(frame)
  })
})
</script>

<template>
  <nav
    data-project-subnav
    class="project-ruler sticky z-30 border-b border-[var(--rule-light)] bg-[var(--surface-chrome)] text-ink-900 backdrop-blur-lg"
    :aria-label="t({ vi: 'Mục lục dự án', en: 'Project sections' })"
  >
    <div class="shell project-ruler__inner">
      <p
        class="project-ruler__title"
        aria-hidden="true"
      >
        <span class="project-ruler__kicker">{{ category }}</span>
        <span class="project-ruler__name">{{ title }}</span>
      </p>

      <ol class="project-ruler__list">
        <li
          v-for="(section, index) in sections"
          :key="section.id"
        >
          <a
            :href="`#${section.id}`"
            class="project-ruler__item"
            :data-ruler-item="section.id"
            :data-done="(progress[section.id] ?? 0) >= 1 ? '' : undefined"
            :aria-current="active === section.id ? 'location' : undefined"
          >
            <span
              class="project-ruler__num"
              aria-hidden="true"
            >{{ pad(index + 1) }}</span>
            {{ section.label }}
            <span
              class="project-ruler__track"
              aria-hidden="true"
            ><span
              data-project-progress
              :style="{ transform: `scaleX(${progress[section.id] ?? 0})` }"
            /></span>
          </a>
        </li>
      </ol>

      <!-- Shown only while the header is hidden, so the screen always carries exactly one quote
           action. Hidden by `visibility`, so it also leaves the tab order and the a11y tree. -->
      <NuxtLink
        to="/lien-he"
        class="btn-bronze project-ruler__cta"
      >
        {{ t(uiText.cta.quote) }}
      </NuxtLink>
    </div>
  </nav>
</template>

<style scoped>
.project-ruler__inner {
  display: flex;
  align-items: stretch;
  gap: 2.5rem;
  height: var(--subnav-h);
}

.project-ruler__title {
  display: none;
}

.project-ruler__list {
  display: flex;
  flex: 1 1 auto;
  gap: 1.5rem;
  min-width: 0;
  margin: 0;
  padding: 0;
  overflow-x: auto;
  list-style: none;
  scrollbar-width: none;
}

.project-ruler__list::-webkit-scrollbar {
  display: none;
}

.project-ruler__list > li {
  display: flex;
  flex: 0 0 auto;
}

.project-ruler__item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  min-height: 44px;
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.2;
  white-space: nowrap;
  color: var(--color-ink-600);
  transition: color var(--dur-hover) var(--ease-editorial);
}

.project-ruler__item:hover {
  color: var(--color-wood-700);
}

.project-ruler__item:focus-visible {
  outline: 2px solid var(--color-wood-500);
  outline-offset: 2px;
}

.project-ruler__item[aria-current='location'] {
  color: var(--color-ink-900);
}

.project-ruler__num {
  font-size: 0.6875rem;
  letter-spacing: 0.12em;
  font-variant-numeric: tabular-nums;
  color: var(--color-ink-500);
  transition: color var(--dur-hover) var(--ease-editorial);
}

.project-ruler__item[data-done] .project-ruler__num,
.project-ruler__item[aria-current='location'] .project-ruler__num {
  color: var(--color-wood-600);
}

.project-ruler__track {
  position: absolute;
  right: 0;
  bottom: -1px;
  left: 0;
  height: 2px;
  overflow: hidden;
  background: var(--rule-light);
}

.project-ruler__track > span {
  position: absolute;
  inset: 0;
  background: var(--bronze);
  transform-origin: left;
}

.project-ruler__cta {
  display: none;
}

/* From 1024px the ruler is the full title block: the project's name on the left, the chapters
   sharing the measure, and the quote action on the right while the header is away. */
@media (min-width: 1024px) {
  .project-ruler__title {
    display: flex;
    flex: 0 1 15rem;
    flex-direction: column;
    justify-content: center;
    gap: 2px;
    min-width: 0;
  }

  .project-ruler__kicker {
    font-size: 0.6875rem;
    font-weight: 600;
    line-height: 1.3;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--color-wood-600);
  }

  .project-ruler__name {
    overflow: hidden;
    font-family: var(--font-display);
    font-size: 1.0625rem;
    font-weight: 500;
    line-height: 1.2;
    letter-spacing: -0.015em;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .project-ruler__list {
    gap: 0.75rem;
    overflow: visible;
  }

  .project-ruler__list > li {
    flex: 1 1 0;
    min-width: 0;
  }

  .project-ruler__item {
    flex: 1 1 auto;
  }

  .project-ruler__cta {
    display: inline-flex;
    flex: 0 0 auto;
    align-self: center;
    min-height: 2.5rem;
    padding: 0.5rem 1.25rem;
    visibility: hidden;
    opacity: 0;
    transform: translateY(6px);
    transition:
      opacity var(--dur-state) var(--ease-editorial),
      transform var(--dur-state) var(--ease-editorial),
      visibility 0s linear var(--dur-state);
  }

  :root[data-header-hidden] .project-ruler__cta {
    visibility: visible;
    opacity: 1;
    transform: none;
    transition:
      opacity var(--dur-state) var(--ease-editorial),
      transform var(--dur-state) var(--ease-editorial),
      visibility 0s;
  }
}

@media (prefers-reduced-motion: reduce) {
  .project-ruler__item,
  .project-ruler__num,
  .project-ruler__cta {
    transition: none;
  }
}
</style>
