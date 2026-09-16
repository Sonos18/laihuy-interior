<script setup lang="ts">
import { homePageContent } from '~/data/home-page'
import { categoryDefinitions } from '~/data/categories'
import type { MediaAsset } from '~/shared/media/types'
import type { Project } from '~/shared/types/project'

const props = defineProps<{
  projects: readonly { project: Project, cover: MediaAsset }[]
}>()

const { t, ta } = useLanguage()

const heroProject = computed(() => props.projects[0])
const secondaryProjects = computed(() => props.projects.slice(1, 3))
</script>

<template>
  <section
    data-testid="home-projects"
    class="home-projects bg-[var(--color-obsidian)] text-[var(--color-ivory)]"
  >
    <div class="shell">
      <!-- Section Header -->
      <div class="home-projects__header">
        <div class="max-w-2xl">
          <p
            v-reveal
            class="reveal text-[0.75rem] font-semibold uppercase tracking-[0.2em] text-[var(--bronze-light)]"
          >
            {{ t(homePageContent.projects.eyebrow) }}
          </p>
          <h2
            v-reveal="80"
            class="home-projects__title reveal font-display mt-3 text-3xl font-medium tracking-tight text-white sm:text-4xl lg:text-5xl"
          >
            {{ t(homePageContent.projects.title) }}
          </h2>
        </div>
        <NuxtLink
          v-reveal="140"
          to="/du-an"
          class="btn-luxury-outline reveal group shrink-0"
        >
          <span>{{ t(homePageContent.projects.allCta) }}</span>
          <Icon
            name="i-lucide-arrow-right"
            class="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
          />
        </NuxtLink>
      </div>

      <!-- Asymmetric Editorial Grid -->
      <div class="home-projects__grid mt-10 md:mt-12 lg:mt-16">
        <!-- 1. Hero Case Study (Dominant) -->
        <NuxtLink
          v-if="heroProject"
          v-reveal="180"
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
              class="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.03] group-focus-visible:scale-[1.03]"
            />
            <div class="home-projects__tag-pill">
              <span>{{ t(categoryDefinitions[heroProject.project.category].label) }}</span>
              <template v-if="heroProject.project.area">
                <span class="opacity-40">·</span>
                <span>{{ t(heroProject.project.area) }}</span>
              </template>
            </div>
            <span
              class="home-projects__index"
              aria-hidden="true"
            >01</span>
          </div>

          <div class="home-projects__body home-projects__body--hero">
            <div>
              <div class="flex items-center gap-2">
                <span
                  class="metric-pulse shrink-0"
                  aria-hidden="true"
                />
                <span class="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[var(--bronze-light)]">
                  {{ t(categoryDefinitions[heroProject.project.category].label) }}
                </span>
              </div>
              <h3 class="home-projects__title-hero font-display mt-2 text-2xl font-medium tracking-tight text-white lg:text-3xl">
                {{ t(heroProject.project.name) }}
              </h3>
              <p class="home-projects__excerpt mt-3 text-sm leading-relaxed text-[var(--text-muted)] lg:text-[0.92rem]">
                {{ t(heroProject.project.shortDescription) }}
              </p>

              <!-- Editorial specs row -->
              <div
                v-if="heroProject.project.location || ta(heroProject.project.scope).length || ta(heroProject.project.content?.materials).length"
                class="home-projects__specs mt-6 grid grid-cols-2 gap-4 border-t border-[var(--hairline)] pt-5 sm:grid-cols-3"
              >
                <div v-if="heroProject.project.location">
                  <p class="text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-[var(--text-subtle)]">
                    {{ t({ vi: 'Địa điểm', en: 'Location' }) }}
                  </p>
                  <p class="mt-1 text-xs font-medium text-[var(--color-ivory)] lg:text-sm">
                    {{ t(heroProject.project.location) }}
                  </p>
                </div>
                <div v-if="ta(heroProject.project.scope).length">
                  <p class="text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-[var(--text-subtle)]">
                    {{ t({ vi: 'Phạm vi', en: 'Scope' }) }}
                  </p>
                  <p class="mt-1 text-xs font-medium text-[var(--color-ivory)] lg:text-sm">
                    {{ ta(heroProject.project.scope).slice(0, 3).join(' · ') }}
                  </p>
                </div>
                <div
                  v-if="ta(heroProject.project.content?.materials).length"
                  class="col-span-2 sm:col-span-1"
                >
                  <p class="text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-[var(--text-subtle)]">
                    {{ t({ vi: 'Vật liệu chính', en: 'Materials' }) }}
                  </p>
                  <p class="mt-1 text-xs font-medium text-[var(--color-ivory)] lg:text-sm truncate">
                    {{ ta(heroProject.project.content?.materials)[0] }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Footer / Meta row -->
            <div class="home-projects__meta mt-6 flex items-center justify-between border-t border-[var(--hairline)] pt-4">
              <span class="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--bronze-light)] transition-colors duration-300 group-hover:text-white">
                {{ t({ vi: 'Xem chi tiết case study', en: 'View case study' }) }}
              </span>
              <span class="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[var(--hairline-gold)] text-[var(--bronze-light)] transition-all duration-300 group-hover:border-[var(--bronze)] group-hover:bg-[var(--bronze)] group-hover:text-[#0b0a09]">
                <Icon
                  name="i-lucide-arrow-right"
                  class="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
                />
              </span>
            </div>
          </div>
        </NuxtLink>

        <!-- 2. Satellite Secondary Projects (Stacked alongside) -->
        <NuxtLink
          v-for="({ project, cover }, index) in secondaryProjects"
          :key="project.slug"
          v-reveal="240 + index * 80"
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
              class="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.03] group-focus-visible:scale-[1.03]"
            />
            <div class="home-projects__tag-pill sm:hidden lg:inline-flex">
              <span>{{ t(categoryDefinitions[project.category].label) }}</span>
              <template v-if="project.area">
                <span class="opacity-40">·</span>
                <span>{{ t(project.area) }}</span>
              </template>
            </div>
            <span
              class="home-projects__index"
              aria-hidden="true"
            >0{{ index + 2 }}</span>
          </div>

          <div class="home-projects__body home-projects__body--satellite">
            <div>
              <p class="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[var(--bronze-light)]">
                {{ t(categoryDefinitions[project.category].label) }}
                <span
                  v-if="project.area"
                  class="text-[var(--text-subtle)]"
                >
                  · {{ t(project.area) }}
                </span>
              </p>
              <h4 class="home-projects__title-satellite font-display mt-1.5 text-lg font-medium tracking-tight text-white lg:text-xl">
                {{ t(project.name) }}
              </h4>
              <p class="mt-2 line-clamp-2 text-xs leading-relaxed text-[var(--text-muted)] lg:text-sm">
                {{ t(project.shortDescription) }}
              </p>
            </div>

            <!-- Footer / Meta row -->
            <div class="home-projects__meta mt-4 flex items-center justify-between border-t border-[var(--hairline)] pt-3.5">
              <span class="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--bronze-light)] transition-colors duration-300 group-hover:text-white">
                {{ t({ vi: 'Xem chi tiết', en: 'View details' }) }}
              </span>
              <span class="inline-flex h-7 w-7 items-center justify-center rounded-full border border-[var(--hairline-gold)] text-[var(--bronze-light)] transition-all duration-300 group-hover:border-[var(--bronze)] group-hover:bg-[var(--bronze)] group-hover:text-[#0b0a09]">
                <Icon
                  name="i-lucide-arrow-right"
                  class="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
                />
              </span>
            </div>
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
  gap: 1.5rem;
}

.home-projects__title {
  max-width: 61rem;
  line-height: 1.08;
  letter-spacing: -0.04em;
  text-wrap: balance;
}

.home-projects__card {
  position: relative;
  background: var(--bg-card);
  border: 1px solid var(--hairline);
  border-radius: 4px;
  overflow: hidden;
  transition: border-color 0.3s ease, transform 0.3s ease;
  outline-offset: 4px;
}

.home-projects__card:hover,
.home-projects__card:focus-visible {
  border-color: var(--hairline-gold-strong);
}

.home-projects__media {
  position: relative;
  overflow: hidden;
  background: var(--color-surface-dark);
}

.home-projects__tag-pill {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: rgba(11, 10, 9, 0.82);
  border: 1px solid var(--hairline-gold);
  color: var(--bronze-light);
  font-size: 0.68rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 9999px;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  z-index: 2;
}

.home-projects__index {
  position: absolute;
  top: 1rem;
  right: 1rem;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  background: rgba(11, 10, 9, 0.65);
  padding: 2px 8px;
  border-radius: 4px;
  z-index: 2;
}

.home-projects__body {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1.5rem;
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
    grid-template-rows: repeat(2, minmax(0, 1fr));
    gap: 1.5rem;
    align-items: stretch;
  }

  .home-projects__card--hero {
    grid-column: 1;
    grid-row: 1 / 3;
    display: flex;
    flex-direction: column;
  }

  .home-projects__card--hero .home-projects__media {
    flex: 1 1 0;
    height: auto;
    min-height: 200px;
    aspect-ratio: auto;
  }

  .home-projects__card--hero .home-projects__body {
    flex: 0 0 auto;
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

/* Wide / Laptop (≥1024px): Satellite cards become horizontal */
@media (min-width: 1024px) {
  .home-projects__grid {
    gap: 2rem;
  }

  .home-projects__card--hero .home-projects__body {
    padding: 1.75rem;
  }

  .home-projects__card--satellite {
    display: grid;
    grid-template-columns: 180px minmax(0, 1fr);
  }

  .home-projects__card--satellite .home-projects__media {
    height: 100%;
    aspect-ratio: auto;
  }

  .home-projects__card--satellite .home-projects__body {
    padding: 1.75rem;
  }
}
</style>
