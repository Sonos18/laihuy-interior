<script setup lang="ts">
import { company } from '~/data/company'
import { projects } from '~/data/projects'
import type { Project } from '~/shared/types/project'

type Fact = {
  label: string
  value: string
  icon: string
}

const route = useRoute()
const slug = Array.isArray(route.params.slug)
  ? route.params.slug[0]
  : route.params.slug

const project = projects.find(item => item.slug === slug)

const getProjectImage = (item?: Project) =>
  item?.image[0] ?? item?.gallery[0] ?? '/images/banner_home.jpg'

const allImages = project
  ? [...new Set([...project.image, ...project.gallery])]
  : []

const facts: Fact[] = project
  ? [
      {
        label: 'Hạng mục',
        value: project.categoryName,
        icon: 'i-lucide-tag'
      },
      project.location
        ? {
            label: 'Vị trí',
            value: project.location,
            icon: 'i-lucide-map-pin'
          }
        : null,
      project.area
        ? {
            label: 'Quy mô',
            value: project.area,
            icon: 'i-lucide-ruler'
          }
        : null,
      project.rooms
        ? {
            label: 'Số phòng',
            value: project.rooms,
            icon: 'i-lucide-bed-double'
          }
        : null,
      project.duration
        ? {
            label: 'Thời gian',
            value: project.duration,
            icon: 'i-lucide-calendar-clock'
          }
        : null,
      project.year
        ? {
            label: 'Năm',
            value: project.year,
            icon: 'i-lucide-calendar'
          }
        : null,
      project.scope?.length
        ? {
            label: 'Phạm vi',
            value: project.scope.join(', '),
            icon: 'i-lucide-list-checks'
          }
        : null,
      project.materials?.length
        ? {
            label: 'Vật liệu chính',
            value: project.materials.join(', '),
            icon: 'i-lucide-layers-3'
          }
        : null
    ].filter((item): item is Fact => Boolean(item))
  : []

const relatedProjects = project
  ? projects
      .filter(item => item.slug !== project.slug)
      .sort((first, second) => {
        const firstScore = first.category === project.category ? 0 : 1
        const secondScore = second.category === project.category ? 0 : 1

        return firstScore - secondScore
      })
      .slice(0, 3)
  : []

if (project) {
  useSeoMeta({
    title: `${project.name} | Case study nội thất dự án | Lai Huy Interior`,
    description: project.content?.overview ?? project.shortDescription,
    ogTitle: `${project.name} | Lai Huy Interior`,
    ogDescription: project.shortDescription,
    ogImage: getProjectImage(project)
  })
}
</script>

<template>
  <div class="bg-white">
    <template v-if="!project">
      <section class="min-h-screen px-6 py-32">
        <div class="mx-auto max-w-3xl text-center">
          <p class="text-8xl font-black text-wood-500">
            404
          </p>
          <h1 class="mt-6 text-3xl font-black text-ink-950 md:text-5xl">
            Không tìm thấy dự án
          </h1>
          <p class="mx-auto mt-4 max-w-xl text-lg leading-8 text-ink-600">
            Dự án bạn đang tìm kiếm không tồn tại hoặc đã được cập nhật sang một đường dẫn khác.
          </p>
          <NuxtLink
            to="/du-an"
            class="btn-dark mt-9"
          >
            Quay lại danh sách dự án
          </NuxtLink>
        </div>
      </section>
    </template>

    <template v-else>
      <section class="relative min-h-screen overflow-hidden bg-ink-950 text-white">
        <img
          :src="getProjectImage(project)"
          :alt="project.name"
          class="absolute inset-0 h-full w-full object-cover"
        >
        <div class="absolute inset-0 bg-ink-950/72" />
        <div class="absolute inset-x-0 bottom-0 h-52 bg-linear-to-t from-ink-950 to-transparent" />

        <div class="section-shell relative z-10 flex min-h-screen flex-col justify-end px-6 pb-14 pt-32">
          <NuxtLink
            to="/du-an"
            class="mb-8 inline-flex w-fit items-center gap-2 text-sm font-bold text-white/68 transition-colors hover:text-white"
          >
            <Icon
              name="i-lucide-arrow-left"
              class="h-4 w-4"
            />
            Dự án
          </NuxtLink>

          <p class="eyebrow mb-5 text-wood-300">
            {{ project.categoryName }} case study
          </p>
          <h1 class="max-w-5xl text-4xl font-black uppercase leading-tight md:text-6xl lg:text-7xl">
            {{ project.name }}
          </h1>
          <p class="mt-6 max-w-3xl text-lg leading-8 text-white/76 md:text-xl">
            {{ project.shortDescription }}
          </p>

          <div class="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div
              v-for="fact in facts.slice(0, 4)"
              :key="fact.label"
              class="border border-white/12 bg-white/[0.04] p-5 backdrop-blur-sm"
            >
              <p class="text-xs uppercase tracking-[0.18em] text-white/45">
                {{ fact.label }}
              </p>
              <p class="mt-2 text-lg font-black text-white">
                {{ fact.value }}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section class="border-b border-ink-200 bg-white px-6 py-10">
        <div class="section-shell grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div
            v-for="fact in facts"
            :key="fact.label"
            class="border-l border-ink-200 pl-5"
          >
            <Icon
              :name="fact.icon"
              class="mb-4 h-5 w-5 text-wood-500"
            />
            <p class="text-xs font-bold uppercase tracking-[0.18em] text-ink-400">
              {{ fact.label }}
            </p>
            <p class="mt-2 text-sm font-bold leading-6 text-ink-900">
              {{ fact.value }}
            </p>
          </div>
        </div>
      </section>

      <section class="section-spacing bg-white">
        <div class="section-shell grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p class="eyebrow">
              Tổng quan
            </p>
            <h2 class="mt-4 text-3xl font-black uppercase leading-tight text-ink-950 md:text-5xl">
              Dự án được nhìn như một bài toán vận hành, tiến độ và chất lượng
            </h2>
          </div>
          <div class="space-y-6 text-lg leading-9 text-ink-600">
            <p>
              {{ project.content?.overview ?? project.description.join(' ') }}
            </p>
            <p
              v-if="project.content?.challenge"
              class="border-l-4 border-wood-500 pl-6 text-ink-800"
            >
              <strong>Thách thức:</strong>
              {{ project.content.challenge }}
            </p>
          </div>
        </div>
      </section>

      <section class="section-spacing bg-ink-50">
        <div class="section-shell grid gap-10 lg:grid-cols-2">
          <div>
            <p class="eyebrow">
              Phạm vi công việc
            </p>
            <h2 class="mt-4 text-3xl font-black uppercase text-ink-950 md:text-5xl">
              Từ thiết kế đến sản xuất và lắp đặt
            </h2>
            <div
              v-if="project.scope?.length"
              class="mt-8 grid gap-3"
            >
              <div
                v-for="(scope, index) in project.scope"
                :key="scope"
                class="flex gap-4 border border-ink-200 bg-white p-5"
              >
                <span class="font-black text-wood-600">
                  {{ String(index + 1).padStart(2, '0') }}
                </span>
                <span class="font-bold text-ink-800">
                  {{ scope }}
                </span>
              </div>
            </div>
          </div>

          <div>
            <p class="eyebrow">
              Giải pháp triển khai
            </p>
            <h2 class="mt-4 text-3xl font-black uppercase text-ink-950 md:text-5xl">
              Kiểm soát đồng bộ giữa xưởng và công trình
            </h2>
            <p class="mt-6 text-lg leading-8 text-ink-600">
              {{ project.content?.solution }}
            </p>
            <div
              v-if="project.content?.highlights?.length"
              class="mt-8 space-y-4"
            >
              <div
                v-for="highlight in project.content.highlights"
                :key="highlight"
                class="border-b border-ink-200 pb-4 text-base font-semibold leading-7 text-ink-800"
              >
                {{ highlight }}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        v-if="project.content?.materials?.length"
        class="section-spacing bg-ink-950 text-white"
      >
        <div class="section-shell">
          <div class="mb-10 max-w-3xl">
            <p class="eyebrow text-wood-300">
              Vật liệu & tiêu chuẩn
            </p>
            <h2 class="mt-4 text-3xl font-black uppercase leading-tight md:text-5xl">
              Chọn vật liệu theo độ bền, khả năng bảo trì và hình ảnh thương hiệu
            </h2>
          </div>
          <div class="grid gap-4 md:grid-cols-2">
            <div
              v-for="material in project.content.materials"
              :key="material"
              class="border border-white/12 p-6"
            >
              <div class="mb-5 h-px w-12 bg-wood-300" />
              <p class="text-lg leading-8 text-white/72">
                {{ material }}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section class="section-spacing bg-white">
        <div class="section-shell">
          <div class="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p class="eyebrow">
                Hình hoàn thiện
              </p>
              <h2 class="mt-4 text-3xl font-black uppercase text-ink-950 md:text-5xl">
                Gallery dự án
              </h2>
            </div>
            <p class="max-w-md text-sm leading-6 text-ink-500">
              Bộ hình ghi lại các khu vực đã hoàn thiện, giúp chủ đầu tư đánh giá vật liệu, tỷ lệ và chất lượng lắp đặt.
            </p>
          </div>

          <div class="grid gap-5 md:grid-cols-2">
            <img
              v-for="(image, index) in allImages"
              :key="image"
              :src="image"
              :alt="`${project.name} - hình hoàn thiện ${index + 1}`"
              :class="[
                'w-full object-cover',
                index === 0 ? 'aspect-[16/9] md:col-span-2' : 'aspect-[4/3]'
              ]"
            >
          </div>
        </div>
      </section>

      <section class="bg-ink-950 px-6 py-16 text-white">
        <div class="section-shell grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p class="eyebrow text-wood-300">
              Thi công nội thất khách sạn
            </p>
            <h2 class="mt-4 max-w-3xl text-3xl font-black uppercase md:text-5xl">
              Bạn cần tư vấn giải pháp thi công nội thất khách sạn?
            </h2>
          </div>
          <div class="flex flex-col gap-3 sm:flex-row md:flex-col">
            <NuxtLink
              to="/lien-he"
              class="btn-primary"
            >
              Nhận báo giá
            </NuxtLink>
            <a
              :href="`tel:${company.phone.replaceAll(' ', '')}`"
              class="btn-secondary"
            >
              Liên hệ tư vấn
            </a>
          </div>
        </div>
      </section>

      <section
        v-if="relatedProjects.length"
        class="section-spacing bg-ink-50"
      >
        <div class="section-shell">
          <div class="mb-10 flex items-end justify-between gap-6">
            <div>
              <p class="eyebrow">
                Khám phá thêm
              </p>
              <h2 class="mt-4 text-3xl font-black uppercase text-ink-950 md:text-5xl">
                Dự án liên quan
              </h2>
            </div>
            <NuxtLink
              to="/du-an"
              class="btn-outline hidden md:inline-flex"
            >
              Xem tất cả
            </NuxtLink>
          </div>

          <div class="grid gap-6 md:grid-cols-3">
            <NuxtLink
              v-for="item in relatedProjects"
              :key="item.slug"
              :to="`/du-an/${item.slug}`"
              class="group block bg-white"
            >
              <img
                :src="getProjectImage(item)"
                :alt="item.name"
                class="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
              >
              <div class="border border-t-0 border-ink-200 p-5">
                <span class="text-xs font-bold uppercase tracking-[0.16em] text-wood-600">
                  {{ item.categoryName }}
                </span>
                <h3 class="mt-3 text-xl font-black text-ink-950">
                  {{ item.name }}
                </h3>
              </div>
            </NuxtLink>
          </div>
        </div>
      </section>
    </template>
  </div>
</template>
