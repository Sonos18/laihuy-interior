<script setup lang="ts">
import { homePageContent } from '~/data/home-page'
import { categoryDefinitions } from '~/data/categories'
import type { MediaAsset } from '~/shared/media/types'
import type { Project } from '~/shared/types/project'

// The editorial project composition: one dominant case study and two satellites (DESIGN.md
// "Layout"). It is shared by the home page and the project index, so both read as the same
// object. `badges` keeps the home cards' photograph chrome (a category/area pill and a number);
// the index turns it off, because there a card carries one chip type only: the category as a
// Label line.
const props = withDefaults(defineProps<{
  projects: readonly { project: Project, cover: MediaAsset }[]
  badges?: boolean
}>(), {
  badges: true
})

const { t, ta } = useLanguage()

const heroProject = computed(() => props.projects[0])
const secondaryProjects = computed(() => props.projects.slice(1, 3))
</script>

<template>
  <div class="home-projects__grid">
    <!-- 1. Hero Case Study (Dominant) -->
    <NuxtLink
      v-if="heroProject"
      v-reveal.item.image
      data-project-card
      :to="`/du-an/${heroProject.project.slug}`"
      class="home-projects__card home-projects__card--hero reveal group"
    >
      <div class="home-projects__media home-projects__media--hero">
        <NuxtImg
          :src="heroProject.cover.path"
          :alt="t(heroProject.project.name)"
          :width="heroProject.cover.width"
          :height="heroProject.cover.height"
          sizes="sm:100vw md:60vw lg:65vw"
          loading="lazy"
          class="h-full w-full object-cover transition-transform duration-[var(--dur-image)] ease-[var(--ease-editorial)] group-hover:scale-[1.03] group-focus-visible:scale-[1.03]"
        />
        <div
          v-if="badges"
          class="home-projects__chrome"
        >
          <div class="home-projects__tag-pill">
            <span class="home-projects__tag-label">{{ t(categoryDefinitions[heroProject.project.category].label) }}</span>
            <template v-if="heroProject.project.area">
              <span class="opacity-40">·</span>
              <span class="shrink-0">{{ t(heroProject.project.area) }}</span>
            </template>
          </div>
          <span
            class="home-projects__index"
            aria-hidden="true"
          >01</span>
        </div>
      </div>

      <div class="home-projects__body home-projects__body--hero">
        <div>
          <p class="home-meta-text font-semibold uppercase tracking-[0.14em] text-wood-700">
            {{ t(categoryDefinitions[heroProject.project.category].label) }}
            <span
              v-if="!badges && heroProject.project.area"
              class="text-ink-500 font-normal"
            >
              · {{ t(heroProject.project.area) }}
            </span>
          </p>
          <h3 class="home-projects__title-hero home-card-heading mt-2 text-ink-950">
            {{ t(heroProject.project.name) }}
          </h3>
          <p class="home-projects__excerpt mt-3 text-sm leading-[1.7] text-ink-600 lg:text-base">
            {{ t(heroProject.project.shortDescription) }}
          </p>
        </div>

        <!-- Editorial spec ledger. The lead card is stretched to the height of the two stacked
             satellites, so this block is the part that absorbs the extra height: its rows
             share it equally and each row centres its content, which turns the spare space
             into ledger rhythm instead of a blank gap above the call to action. -->
        <dl
          v-if="heroProject.project.location || ta(heroProject.project.scope).length || ta(heroProject.project.content?.materials).length"
          class="home-projects__specs mt-6 border-t border-ink-200/80"
        >
          <div
            v-if="heroProject.project.location"
            class="home-projects__spec"
          >
            <dt class="text-xs font-semibold uppercase tracking-[0.12em] text-ink-500">
              {{ t(homePageContent.projects.locationLabel) }}
            </dt>
            <dd class="text-sm font-medium leading-[1.7] text-ink-900 lg:text-base">
              {{ t(heroProject.project.location) }}
            </dd>
          </div>
          <div
            v-if="ta(heroProject.project.scope).length"
            class="home-projects__spec"
          >
            <dt class="text-xs font-semibold uppercase tracking-[0.12em] text-ink-500">
              {{ t(homePageContent.projects.scopeLabel) }}
            </dt>
            <dd class="text-sm font-medium leading-[1.7] text-ink-900 lg:text-base">
              {{ ta(heroProject.project.scope).slice(0, 3).join(' · ') }}
            </dd>
          </div>
          <div
            v-if="ta(heroProject.project.content?.materials).length"
            class="home-projects__spec"
          >
            <dt class="text-xs font-semibold uppercase tracking-[0.12em] text-ink-500">
              {{ t(homePageContent.projects.materialsLabel) }}
            </dt>
            <dd class="text-sm font-medium leading-[1.7] text-ink-900 lg:text-base">
              {{ ta(heroProject.project.content?.materials)[0] }}
            </dd>
          </div>
        </dl>

        <!-- Footer / Meta row -->
        <div class="home-projects__meta flex items-center justify-between border-t border-ink-200/80 pt-4">
          <span class="text-xs font-semibold uppercase tracking-[0.08em] text-wood-700 transition-colors duration-[var(--dur-hover)] ease-[var(--ease-editorial)] group-hover:text-wood-950">
            {{ t(homePageContent.projects.heroCta) }}
          </span>
          <span class="inline-flex h-8 w-8 items-center justify-center rounded-full border border-wood-300 text-wood-700 transition-[background-color,border-color,color] duration-[240ms] ease-[var(--ease-editorial)] group-hover:border-wood-600 group-hover:bg-wood-600 group-hover:text-white">
            <Icon
              name="i-lucide-arrow-right"
              class="h-4 w-4 transition-transform duration-[var(--dur-hover)] ease-[var(--ease-editorial)] group-hover:translate-x-0.5"
            />
          </span>
        </div>
      </div>
    </NuxtLink>

    <!-- 2. Satellite Secondary Projects (Stacked alongside) -->
    <NuxtLink
      v-for="({ project, cover }, index) in secondaryProjects"
      :key="project.slug"
      v-reveal.item.image
      data-project-card
      :to="`/du-an/${project.slug}`"
      class="home-projects__card home-projects__card--satellite reveal group"
    >
      <div class="home-projects__media home-projects__media--satellite">
        <NuxtImg
          :src="cover.path"
          :alt="t(project.name)"
          :width="cover.width"
          :height="cover.height"
          sizes="sm:100vw md:40vw lg:35vw"
          loading="lazy"
          class="h-full w-full object-cover transition-transform duration-[var(--dur-image)] ease-[var(--ease-editorial)] group-hover:scale-[1.03] group-focus-visible:scale-[1.03]"
        />
        <div
          v-if="badges"
          class="home-projects__chrome"
        >
          <div class="home-projects__tag-pill sm:hidden">
            <span class="home-projects__tag-label">{{ t(categoryDefinitions[project.category].label) }}</span>
            <template v-if="project.area">
              <span class="opacity-40">·</span>
              <span class="shrink-0">{{ t(project.area) }}</span>
            </template>
          </div>
          <span
            class="home-projects__index"
            aria-hidden="true"
          >0{{ index + 2 }}</span>
        </div>
      </div>

      <div class="home-projects__body home-projects__body--satellite">
        <div>
          <p class="home-meta-text font-semibold uppercase tracking-[0.14em] text-wood-700">
            {{ t(categoryDefinitions[project.category].label) }}
            <span
              v-if="project.area"
              class="text-ink-500 font-normal"
            >
              · {{ t(project.area) }}
            </span>
          </p>
          <h3 class="home-projects__title-satellite font-display mt-1.5 text-lg font-medium tracking-tight text-ink-950 lg:text-xl">
            {{ t(project.name) }}
          </h3>
          <p class="home-projects__excerpt mt-2 text-sm leading-[1.7] text-ink-600">
            {{ t(project.shortDescription) }}
          </p>
        </div>

        <!-- Footer / Meta row -->
        <div class="home-projects__meta mt-4 flex items-center justify-between border-t border-ink-200/80 pt-3.5">
          <span class="text-xs font-semibold uppercase tracking-[0.08em] text-wood-700 transition-colors duration-[var(--dur-hover)] ease-[var(--ease-editorial)] group-hover:text-wood-950">
            {{ t(homePageContent.projects.cardCta) }}
          </span>
          <span class="inline-flex h-7 w-7 items-center justify-center rounded-full border border-wood-300 text-wood-700 transition-[background-color,border-color,color] duration-[240ms] ease-[var(--ease-editorial)] group-hover:border-wood-600 group-hover:bg-wood-600 group-hover:text-white">
            <Icon
              name="i-lucide-arrow-right"
              class="h-3.5 w-3.5 transition-transform duration-[var(--dur-hover)] ease-[var(--ease-editorial)] group-hover:translate-x-0.5"
            />
          </span>
        </div>
      </div>
    </NuxtLink>
  </div>
</template>

<style scoped>
.home-projects__card {
  position: relative;
  background: var(--color-white);
  border: 1px solid var(--color-ink-200);
  border-radius: 4px;
  overflow: hidden;
  transition: border-color var(--dur-hover) var(--ease-editorial), box-shadow var(--dur-hover) var(--ease-editorial);
  outline-offset: 4px;
  box-shadow: var(--shadow-rest);
}

.home-projects__card:hover,
.home-projects__card:focus-visible {
  border-color: var(--color-ink-400);
  box-shadow: var(--shadow-hover);
}

.home-projects__media {
  position: relative;
  overflow: hidden;
  background: var(--color-ink-100);
}

/* Pill and number badge share one flex row, so they cannot collide: the pill is the flexible
   item (its label truncates), the badge keeps its size and stays on the right. */
.home-projects__chrome {
  position: absolute;
  top: 1rem;
  right: 1rem;
  left: 1rem;
  z-index: 2;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.5rem;
  pointer-events: none;
}

.home-projects__tag-pill {
  min-width: 0;
  background: color-mix(in srgb, var(--color-white) 88%, transparent);
  backdrop-filter: blur(8px);
  border: 1px solid color-mix(in srgb, var(--color-ink-200) 80%, transparent);
  color: var(--color-ink-900);
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 9999px;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  white-space: nowrap;
}

.home-projects__tag-label {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}

.home-projects__index {
  flex-shrink: 0;
  margin-left: auto;
  color: var(--color-wood-700);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  background: color-mix(in srgb, var(--color-white) 88%, transparent);
  backdrop-filter: blur(8px);
  border: 1px solid color-mix(in srgb, var(--color-ink-200) 80%, transparent);
  padding: 2px 8px;
  border-radius: 4px;
}

.home-projects__body {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1.5rem;
}

/* Short curated copy, shown whole: a line clamp ends mid-word ("điề…") at some widths. */
.home-projects__excerpt {
  text-wrap: pretty;
}

/* Spec ledger: label and value on one row, hairline between rows. Rows share the card's spare
   height equally (see the template note), and never shrink below a comfortable 2.75rem. */
.home-projects__specs {
  display: grid;
  grid-auto-rows: minmax(2.75rem, 1fr);
  flex: 1 1 auto;
}

.home-projects__spec {
  display: grid;
  grid-template-columns: 6.5rem minmax(0, 1fr);
  column-gap: 1rem;
  align-items: center;
  padding-block: 0.5rem;
}

.home-projects__spec + .home-projects__spec {
  border-top: 1px solid color-mix(in srgb, var(--color-ink-200) 80%, transparent);
}

.home-projects__spec dd {
  text-wrap: balance;
}

@media (min-width: 1024px) {
  .home-projects__spec {
    grid-template-columns: 8rem minmax(0, 1fr);
  }
}

/* Mobile & base grid: Single column stack */
.home-projects__grid {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.home-projects__media--hero {
  aspect-ratio: 16 / 10;
}

.home-projects__media--satellite {
  aspect-ratio: 16 / 9;
}

/* Tablet & Desktop (≥768px): Asymmetric 2-column grid */
@media (min-width: 768px) {
  .home-projects__header {
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
  }

  .home-projects__grid {
    display: grid;
    grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr);
    /* Rows follow their content. The lead spans both, so its 16:10 image sets the pair's height
       and the satellites stretch to share it; forcing two equal 1fr rows squashed the lead image
       into a strip. */
    grid-template-rows: auto auto;
    gap: 1.5rem;
    align-items: stretch;
  }

  .home-projects__card--hero {
    grid-column: 1;
    grid-row: 1 / 3;
    display: flex;
    flex-direction: column;
  }

  /* The lead image keeps the 16:10 frame from .home-projects__media--hero at every width. */
  .home-projects__card--hero .home-projects__body {
    flex: 1 1 auto;
  }

  .home-projects__card--satellite:nth-of-type(2) {
    grid-column: 2;
    grid-row: 1 / 2;
  }

  .home-projects__card--satellite:nth-of-type(3) {
    grid-column: 2;
    grid-row: 2 / 3;
  }

  .home-projects__card--satellite {
    display: flex;
    flex-direction: column;
  }

  .home-projects__card--satellite .home-projects__media {
    aspect-ratio: 16 / 9;
  }

  .home-projects__card--satellite .home-projects__body {
    flex: 1 1 0;
  }
}

/* Wide / Laptop (≥1024px): more air around the cards. Satellites stay stacked (16:9 image over
   the text): a side-by-side card inherits the row height set by the lead, which turned its image
   into a portrait strip. Two stacked satellites are taller than a lead of the same width, so the
   lead column takes 2.1fr rather than the 1.35fr of the tablet split. The ratio is bounded by
   HL-02's 160px satellite floor: a 1024px window with a 17px classic scrollbar lays out at 1007px,
   where 2.1fr leaves a satellite image about 164px tall and 2.2fr only about 159px. */
@media (min-width: 1024px) {
  .home-projects__grid {
    grid-template-columns: minmax(0, 2.1fr) minmax(0, 1fr);
    gap: 2rem;
  }

  .home-projects__card--hero .home-projects__body,
  .home-projects__card--satellite .home-projects__body {
    padding: 1.75rem;
  }
}
</style>
