<script setup lang="ts">
import { homePageContent } from '~/data/home-page'
import { categoryDefinitions } from '~/data/categories'
import type { MediaAsset } from '~/shared/media/types'
import type { Project } from '~/shared/types/project'

defineProps<{
  projects: readonly { project: Project, cover: MediaAsset }[]
}>()

const { t, ta } = useLanguage()
</script>

<template>
  <section
    data-testid="home-projects"
    class="home-projects bg-white text-ink-950"
  >
    <div class="shell">
      <div class="home-projects__header">
        <div>
          <p
            v-reveal
            class="eyebrow reveal"
          >
            {{ t(homePageContent.projects.eyebrow) }}
          </p>
          <h2
            v-reveal="80"
            class="home-projects__title reveal mt-4"
          >
            {{ t(homePageContent.projects.title) }}
          </h2>
        </div>
        <NuxtLink
          v-reveal="140"
          to="/du-an"
          class="home-projects__all reveal group"
        >
          {{ t(homePageContent.projects.allCta) }}
          <Icon
            name="i-lucide-arrow-right"
            class="h-4 w-4 transition-transform group-hover:translate-x-1"
          />
        </NuxtLink>
      </div>

      <div class="home-projects__grid mt-12">
        <NuxtLink
          v-for="({ project, cover }, index) in projects"
          :key="project.slug"
          v-reveal="index * 100"
          data-project-card
          :to="`/du-an/${project.slug}`"
          class="home-projects__card reveal group"
        >
          <div class="home-projects__media">
            <NuxtImg
              :src="cover.path"
              :alt="t(project.name)"
              :width="cover.width"
              :height="cover.height"
              :sizes="index === 0 ? 'sm:100vw md:66vw' : 'sm:100vw md:34vw'"
              loading="lazy"
              class="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.035] group-focus-visible:scale-[1.035]"
            />
            <span
              class="home-projects__index"
              aria-hidden="true"
            >0{{ index + 1 }}</span>
          </div>
          <div class="home-projects__meta">
            <div>
              <p class="text-[0.68rem] font-extrabold uppercase tracking-[0.16em] text-wood-600">
                {{ t(categoryDefinitions[project.category].label) }}
              </p>
              <h3 class="mt-2 text-xl font-semibold tracking-[-0.035em] md:text-2xl">{{ t(project.name) }}</h3>
            </div>
            <p class="text-xs font-bold text-ink-500">
              {{ project.location ? t(project.location) : ta(project.scope)[0] }}
            </p>
          </div>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.home-projects {
  padding-block: var(--section-py);
}

.home-projects__header {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.home-projects__title {
  max-width: 61rem;
  font-size: clamp(2.4rem, 5vw, 5.75rem);
  font-weight: 500;
  line-height: 0.98;
  letter-spacing: -0.06em;
  text-wrap: balance;
}

.home-projects__all {
  display: inline-flex;
  width: fit-content;
  align-items: center;
  gap: 0.6rem;
  border-bottom: 1px solid var(--color-ink-950);
  padding-bottom: 0.35rem;
  font-size: 0.75rem;
  font-weight: 900;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.home-projects__grid {
  display: grid;
  gap: 2.5rem;
}

.home-projects__card {
  display: block;
  outline-offset: 5px;
}

.home-projects__media {
  position: relative;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  background: var(--color-ink-100);
}

.home-projects__index {
  position: absolute;
  top: 1rem;
  right: 1rem;
  color: white;
  font-size: 0.7rem;
  font-weight: 900;
  letter-spacing: 0.16em;
  text-shadow: 0 1px 20px rgb(0 0 0 / 0.72);
}

.home-projects__meta {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 1rem;
  border-bottom: 1px solid var(--color-ink-300);
  padding-block: 1.25rem;
  transition: border-color 240ms ease;
}

.home-projects__card:hover .home-projects__meta,
.home-projects__card:focus-visible .home-projects__meta {
  border-color: var(--color-wood-500);
}

@media (min-width: 768px) {
  .home-projects__header {
    flex-direction: row;
    align-items: end;
    justify-content: space-between;
  }

  .home-projects__grid {
    grid-template-columns: minmax(0, 1.8fr) minmax(0, 1fr);
    grid-template-rows: repeat(2, minmax(0, 1fr));
    gap: 1.5rem;
  }

  .home-projects__card:first-child {
    display: flex;
    flex-direction: column;
    grid-row: 1 / 3;
  }

  .home-projects__card:first-child .home-projects__media {
    flex: 1 1 0;
    height: auto;
    min-height: 0;
    aspect-ratio: auto;
  }

  .home-projects__card:not(:first-child) .home-projects__media {
    aspect-ratio: 16 / 9;
  }
}
</style>
