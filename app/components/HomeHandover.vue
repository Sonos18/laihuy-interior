<script setup lang="ts">
// Handover record (owner, 2026-11-21): a hairline ledger of every portfolio project, newest first,
// standing in for client testimonials until owner-approved quotes exist. A Stacked head: the
// contractor file above is Rail and the closing CTA below is Split (No-Echo). Each row is a link to the
// case study: a small real cover, the name, category and place (and room count where the record has
// one), and the year. Nothing here is written for the section; it all comes from projects.ts.
import { categoryDefinitions } from '~/data/categories'
import { homePageContent } from '~/data/home-page'
import { projects } from '~/data/projects'
import { projectCoverAsset } from '~/media/project-media'

const { t, localePath } = useLanguage()

const rows = computed(() =>
  projects
    .map((project, index) => ({ project, index, cover: projectCoverAsset(project.mediaId, project.coverImage) }))
    .sort((a, b) => Number(b.project.year?.vi ?? 0) - Number(a.project.year?.vi ?? 0) || a.index - b.index)
)

const title = computed(() => t(homePageContent.handover.title).replace('{count}', String(projects.length)))
</script>

<template>
  <section
    data-testid="home-handover"
    class="home-handover section-y border-t border-[var(--rule-light)]"
  >
    <div class="shell">
      <SectionHead
        layout="stacked"
        eyebrow-class="eyebrow home-eyebrow-text text-wood-600"
        :eyebrow="t(homePageContent.handover.eyebrow)"
        :title="title"
        :lead="t(homePageContent.handover.lead)"
      />

      <ul
        class="home-handover__list mt-12"
        role="list"
        :aria-label="t(homePageContent.handover.listLabel)"
      >
        <li
          v-for="{ project, cover } in rows"
          :key="project.slug"
          :data-project="project.slug"
          class="home-handover__item"
        >
          <NuxtLink
            :to="localePath(`/du-an/${project.slug}`)"
            class="home-handover__row group"
          >
            <span class="home-handover__thumb">
              <NuxtImg
                v-if="cover"
                :src="cover.path"
                alt=""
                :width="cover.width"
                :height="cover.height"
                sizes="160px"
                loading="lazy"
                class="h-full w-full object-cover transition-transform duration-[var(--dur-image)] ease-[var(--ease-editorial)] group-hover:scale-[1.04] motion-reduce:transform-none motion-reduce:transition-none"
              />
            </span>
            <span class="min-w-0 flex-1">
              <span class="home-handover__name">{{ t(project.name) }}</span>
              <span class="home-handover__meta">
                {{ t(categoryDefinitions[project.category].label) }}<template v-if="project.location"> · {{ t(project.location) }}</template><template v-if="project.rooms"> · {{ t(project.rooms) }}</template>
              </span>
            </span>
            <span
              v-if="project.year"
              class="home-handover__year"
            >{{ t(project.year) }}</span>
          </NuxtLink>
        </li>
      </ul>

      <div class="mt-10">
        <NuxtLink
          :to="localePath('/du-an')"
          class="btn-outline group border-ink-300 text-ink-900 hover:border-ink-950 hover:bg-ink-950 hover:text-white"
        >
          <span>{{ t(homePageContent.handover.allCta) }}</span>
          <Icon
            name="i-lucide-arrow-right"
            class="h-4 w-4 transition-transform duration-[var(--dur-hover)] ease-[var(--ease-editorial)] group-hover:translate-x-1"
          />
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.home-handover__list {
  display: grid;
  border-top: 1px solid var(--rule-light);
}

@media (min-width: 1024px) {
  .home-handover__list {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    column-gap: 3rem;
  }
}

.home-handover__item {
  border-bottom: 1px solid var(--rule-light);
}

.home-handover__row {
  display: flex;
  align-items: center;
  gap: 1rem;
  min-height: 44px;
  padding: 0.875rem 0;
  color: var(--color-ink-950);
}

.home-handover__row:focus-visible {
  outline: 2px solid var(--color-bronze-warm);
  outline-offset: 2px;
}

.home-handover__thumb {
  flex: none;
  width: 5rem;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  border-radius: 4px;
  background: var(--color-ink-100);
}

.home-handover__name {
  display: block;
  font-family: var(--font-display);
  font-size: 1.0625rem;
  font-weight: 500;
  line-height: 1.3;
  letter-spacing: -0.01em;
  transition: color var(--dur-hover) var(--ease-editorial);
}

.home-handover__row:hover .home-handover__name {
  color: var(--color-wood-600);
}

.home-handover__meta {
  display: block;
  margin-top: 0.25rem;
  font-size: 0.875rem;
  line-height: 1.5;
  color: var(--color-ink-600);
}

.home-handover__year {
  flex: none;
  font-size: 0.875rem;
  font-variant-numeric: tabular-nums;
  color: var(--color-ink-600);
}
</style>
