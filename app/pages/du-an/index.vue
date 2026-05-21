<script setup lang="ts">
import { company } from '~/data/company'
import { projects } from '~/data/projects'
import { uiText } from '~/data/ui'
import type { Project, ProjectSegment } from '~/shared/types/project'

const { t, ta } = useLanguage()

type CategoryOption = {
  value: 'all' | ProjectSegment | 'townhouse'
  label: {
    vi: string
    en: string
  }
}

const selectedCategory = ref<CategoryOption['value']>('all')

const categoryOptions: CategoryOption[] = [
  { value: 'all', label: { vi: 'Tất cả', en: 'All' } },
  { value: 'hotel', label: { vi: 'Khách sạn', en: 'Hotels' } },
  { value: 'commercial', label: { vi: 'Thương mại', en: 'Commercial' } },
  { value: 'villa', label: { vi: 'Villa', en: 'Villas' } },
  { value: 'apartment', label: { vi: 'Căn hộ', en: 'Apartments' } },
  { value: 'townhouse', label: { vi: 'Nhà phố', en: 'Townhouses' } },
  { value: 'other', label: { vi: 'Khác', en: 'Other' } }
]

const segmentPriority: Record<string, number> = {
  hotel: 0,
  commercial: 1,
  office: 1,
  villa: 2,
  apartment: 3,
  house: 4,
  townhouse: 4,
  other: 5
}

const projectMatchesCategory = (project: Project, category: CategoryOption['value']) => {
  if (category === 'all') {
    return true
  }

  if (category === 'townhouse') {
    return project.segment === 'house'
  }

  if (category === 'commercial') {
    return project.segment === 'commercial' || project.segment === 'office'
  }

  return project.segment === category
}

const categories = computed(() =>
  categoryOptions.filter(option =>
    option.value === 'all' || projects.some(project => projectMatchesCategory(project, option.value))
  )
)

const sortedProjects = computed(() =>
  [...projects].sort((first, second) =>
    (segmentPriority[first.segment ?? 'other'] ?? 5) - (segmentPriority[second.segment ?? 'other'] ?? 5)
  )
)

const filteredProjects = computed(() =>
  sortedProjects.value.filter(project => projectMatchesCategory(project, selectedCategory.value))
)

const getProjectMetric = (project: Project) =>
  t(project.rooms)
  || t(project.duration)
  || t(project.area)
  || ta(project.scope)[0]
  || t(uiText.projectFacts.fallbackMetric)

const seoTitle = computed(() => t(company.seo.projects.title))
const seoDescription = computed(() => t(company.seo.projects.description))

useSeoMeta({
  title: seoTitle,
  description: seoDescription,
  ogTitle: seoTitle,
  ogDescription: seoDescription,
  ogImage: company.seo.projects.ogImage
})
</script>

<template>
  <div>
    <AppHero
      :topic="t(uiText.labels.caseStudies)"
      :title="t({ vi: 'Dự án nội thất', en: 'Interior' })"
      :special-title="t({ vi: 'khách sạn & công trình lớn', en: 'case studies' })"
      :subtitle="t({ vi: 'Các dự án được trình bày theo hướng năng lực triển khai: phạm vi công việc, vật liệu, tiến độ và chất lượng bàn giao.', en: 'Projects are presented as delivery case studies, showing scope, materials, schedule, and handover quality.' })"
      bg-image="/images/projects/hotel/eo_gio/bed.png"
    />

    <section class="section-spacing bg-white">
      <div class="section-shell">
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
            v-for="project in filteredProjects"
            :key="project.id"
            :to="`/du-an/${project.slug}`"
            class="group block overflow-hidden rounded-2xl bg-white"
          >
            <div class="relative aspect-[4/3] overflow-hidden bg-ink-100">
              <img
                :src="project.image[0]"
                :alt="t(project.name)"
                class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              >
              <div class="absolute left-4 top-4 rounded-full bg-ink-950 px-3 py-2 text-xs font-bold uppercase tracking-[0.16em] text-white">
                {{ t(project.categoryName) }}
              </div>
            </div>
            <div class="border border-t-0 border-ink-200 p-6">
              <div class="mb-4 inline-flex rounded-full border border-ink-200 px-3 py-2 text-xs font-bold text-wood-700">
                {{ getProjectMetric(project) }}
              </div>
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

    <section class="bg-ink-950 px-6 py-16 text-white">
      <div class="section-shell grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <p class="eyebrow text-wood-300">
            {{ t(uiText.cta.hotelConsult) }}
          </p>
          <h2 class="mt-4 max-w-3xl text-3xl font-black uppercase md:text-5xl">
            {{ t({ vi: 'Bạn cần đội ngũ sản xuất và lắp đặt cho dự án tiếp theo?', en: 'Need a production and installation team for your next project?' }) }}
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
