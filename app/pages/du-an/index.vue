<script setup lang="ts">
import { company } from '~/data/company'
import { categoryDefinitions, orderedCategories } from '~/data/categories'
import { projects } from '~/data/projects'
import { uiText } from '~/data/ui'
import { projectMedia } from '~/media/catalog.generated'
import { projectCoverAsset, withAlt } from '~/media/project-media'
import type { LocalizedText } from '~/shared/types/localization'
import type { Project, ProjectCategory } from '~/shared/types/project'

const { t, ta } = useLanguage()
const { resolve: mediaUrl } = useMediaUrl()

const heroImage = withAlt(projectMedia['codi-villa-phan-thiet'].cover, '')

type CategoryFilter = 'all' | ProjectCategory

const selectedCategory = ref<CategoryFilter>('all')

// Filter options derive from the category source of truth. Only categories with
// at least one project appear, preceded by an "All" entry.
const categories = computed<{ value: CategoryFilter, label: LocalizedText }[]>(() => [
  { value: 'all', label: { vi: 'Tất cả', en: 'All' } },
  ...orderedCategories
    .filter(category => projects.some(project => project.category === category))
    .map(category => ({ value: category, label: categoryDefinitions[category].label }))
])

const sortedProjects = computed(() =>
  [...projects].sort((first, second) =>
    categoryDefinitions[first.category].order - categoryDefinitions[second.category].order
  )
)

const filteredProjects = computed(() =>
  sortedProjects.value
    .filter(project => selectedCategory.value === 'all' || project.category === selectedCategory.value)
    .map(project => ({ project, cover: projectCoverAsset(project.mediaId, project.coverImage) }))
)

const getProjectMetric = (project: Project) =>
  t(project.area)
  || ta(project.scope)[0]
  || t(categoryDefinitions[project.category].label)

const seoTitle = computed(() => t(company.seo.projects.title))
const seoDescription = computed(() => t(company.seo.projects.description))

useSeoMeta({
  title: seoTitle,
  description: seoDescription,
  ogTitle: seoTitle,
  ogDescription: seoDescription,
  ogImage: mediaUrl(company.seo.projects.ogImage.path)
})
</script>

<template>
  <div>
    <AppHero
      :topic="t(uiText.labels.caseStudies)"
      :title="t({ vi: 'Dự án nội thất', en: 'Interior' })"
      :special-title="t({ vi: 'khách sạn & công trình lớn', en: 'case studies' })"
      :subtitle="t({ vi: 'Các dự án được trình bày theo hướng năng lực triển khai: phạm vi công việc, vật liệu, tiến độ và chất lượng bàn giao.', en: 'Projects are presented as delivery case studies, showing scope, materials, schedule, and handover quality.' })"
      :image="heroImage"
      mode="caption"
      atmosphere="dark"
      focal="50% 42%"
    />

    <section class="section-y bg-white">
      <div class="shell">
        <div class="mb-10 flex flex-wrap gap-3">
          <button
            v-for="category in categories"
            :key="category.value"
            type="button"
            :class="[
              'rounded-full border px-5 py-3 text-sm font-bold transition-colors',
              selectedCategory === category.value
                ? 'border-ink-950 bg-ink-950 text-white'
                : 'border-ink-200 bg-white text-ink-600 hover:border-wood-500 hover:text-wood-600'
            ]"
            @click="selectedCategory = category.value"
          >
            {{ t(category.label) }}
          </button>
        </div>

        <div class="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
          <NuxtLink
            v-for="{ project, cover } in filteredProjects"
            :key="project.slug"
            :to="`/du-an/${project.slug}`"
            class="group block overflow-hidden rounded-2xl bg-white"
          >
            <div
              v-if="cover"
              class="relative aspect-[4/3] overflow-hidden bg-ink-100"
            >
              <NuxtImg
                :src="cover.path"
                :alt="t(project.name)"
                :width="cover.width"
                :height="cover.height"
                sizes="sm:100vw md:50vw lg:33vw"
                loading="lazy"
                class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div class="absolute left-4 top-4 rounded-full bg-ink-950 px-3 py-2 text-xs font-bold uppercase tracking-[0.16em] text-white">
                {{ t(categoryDefinitions[project.category].label) }}
              </div>
            </div>
            <div :class="['border border-ink-200 p-6', cover ? 'border-t-0' : '']">
              <div class="mb-4 inline-flex rounded-full border border-ink-200 px-3 py-2 text-xs font-bold text-wood-700">
                {{ getProjectMetric(project) }}
              </div>
              <p
                v-if="!cover"
                class="eyebrow mb-3"
              >
                {{ t(categoryDefinitions[project.category].label) }}
              </p>
              <h2 class="text-2xl font-black leading-tight text-ink-950">
                {{ t(project.name) }}
              </h2>
              <p class="mt-3 text-sm leading-6 text-ink-600">
                {{ t(project.shortDescription) }}
              </p>
              <div
                v-if="ta(project.scope).length"
                class="mt-5 flex flex-wrap gap-2"
              >
                <span
                  v-for="scope in ta(project.scope).slice(0, 3)"
                  :key="scope"
                  class="rounded-full bg-ink-50 px-3 py-2 text-xs font-semibold text-ink-600"
                >
                  {{ scope }}
                </span>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <section class="section-cta">
      <div class="shell grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <p class="eyebrow">
            {{ t(uiText.cta.hotelConsult) }}
          </p>
          <h2 class="mt-4 max-w-3xl text-3xl font-black uppercase md:text-5xl">
            {{ t({ vi: 'Bạn cần đội ngũ sản xuất và thi công cho dự án tiếp theo?', en: 'Need a production and contracting team for your next project?' }) }}
          </h2>
        </div>
        <NuxtLink
          to="/lien-he"
          class="btn-primary"
        >
          {{ t(uiText.cta.sendDrawings) }}
        </NuxtLink>
      </div>
    </section>
  </div>
</template>
