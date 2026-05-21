<script setup lang="ts">
import { company } from '~/data/company'
import { projectCategories, projects } from '~/data/projects'
import type { Project } from '~/shared/types/project'

const selectedCategory = ref('Tất cả')

const categories = computed(() =>
  projectCategories.filter(category =>
    category === 'Tất cả' || projects.some(project => project.categoryName === category)
  )
)

const filteredProjects = computed(() => {
  if (selectedCategory.value === 'Tất cả') {
    return projects
  }

  return projects.filter(project => project.categoryName === selectedCategory.value)
})

const getProjectMetric = (project: Project) =>
  project.rooms
  || project.duration
  || project.area
  || project.scope?.[0]
  || 'Dự án nội thất'

useSeoMeta({
  title: company.seo.projects.title,
  description: company.seo.projects.description,
  ogTitle: company.seo.projects.title,
  ogDescription: company.seo.projects.description,
  ogImage: company.seo.projects.ogImage
})
</script>

<template>
  <div>
    <AppHero
      topic="Case studies"
      title="Dự án nội thất"
      special-title="khách sạn & công trình lớn"
      subtitle="Các dự án được trình bày theo hướng năng lực triển khai: phạm vi công việc, vật liệu, tiến độ và chất lượng bàn giao."
      bg-image="/images/projects/hotel/eo_gio/bed.png"
    />

    <section class="section-spacing bg-white">
      <div class="section-shell">
        <div class="mb-10 flex flex-wrap gap-3">
          <button
            v-for="category in categories"
            :key="category"
            type="button"
            :class="[
              'border px-5 py-3 text-sm font-bold transition-colors',
              selectedCategory === category
                ? 'border-ink-950 bg-ink-950 text-white'
                : 'border-ink-200 bg-white text-ink-600 hover:border-wood-500 hover:text-wood-600'
            ]"
            @click="selectedCategory = category"
          >
            {{ category }}
          </button>
        </div>

        <div class="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
          <NuxtLink
            v-for="project in filteredProjects"
            :key="project.id"
            :to="`/du-an/${project.slug}`"
            class="group block bg-white"
          >
            <div class="relative aspect-[4/3] overflow-hidden bg-ink-100">
              <img
                :src="project.image[0]"
                :alt="project.name"
                class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              >
              <div class="absolute left-4 top-4 bg-ink-950 px-3 py-2 text-xs font-bold uppercase tracking-[0.16em] text-white">
                {{ project.categoryName }}
              </div>
            </div>
            <div class="border border-t-0 border-ink-200 p-6">
              <div class="mb-4 inline-flex border border-ink-200 px-3 py-2 text-xs font-bold text-wood-700">
                {{ getProjectMetric(project) }}
              </div>
              <h2 class="text-2xl font-black leading-tight text-ink-950">
                {{ project.name }}
              </h2>
              <p class="mt-3 text-sm leading-6 text-ink-600">
                {{ project.shortDescription }}
              </p>
              <div
                v-if="project.scope?.length"
                class="mt-5 flex flex-wrap gap-2"
              >
                <span
                  v-for="scope in project.scope.slice(0, 3)"
                  :key="scope"
                  class="bg-ink-50 px-3 py-2 text-xs font-semibold text-ink-600"
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
            Tư vấn thi công khách sạn
          </p>
          <h2 class="mt-4 max-w-3xl text-3xl font-black uppercase md:text-5xl">
            Bạn cần đội ngũ sản xuất và lắp đặt cho dự án tiếp theo?
          </h2>
        </div>
        <NuxtLink
          to="/lien-he"
          class="btn-primary"
        >
          Gửi bản vẽ để nhận BOQ sơ bộ
        </NuxtLink>
      </div>
    </section>
  </div>
</template>
