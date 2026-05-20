<script setup lang="ts">
import { projects } from '~/data/projects'
import type { Project } from '~/shared/types/project'

type MetaItem = {
  icon: string
  label: string
  value: string
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

const currentImageIndex = ref(0)
const heroImage = computed(() => allImages[currentImageIndex.value] ?? getProjectImage(project))

const nextImage = () => {
  if (allImages.length <= 1) {
    return
  }

  currentImageIndex.value = (currentImageIndex.value + 1) % allImages.length
}

const prevImage = () => {
  if (allImages.length <= 1) {
    return
  }

  currentImageIndex.value
    = (currentImageIndex.value - 1 + allImages.length) % allImages.length
}

const metaItems: MetaItem[] = project
  ? [
      {
        icon: 'i-lucide-tag',
        label: 'Hạng mục',
        value: project.categoryName
      },
      project.location
        ? {
            icon: 'i-lucide-map-pin',
            label: 'Vị trí',
            value: project.location
          }
        : null,
      project.area
        ? {
            icon: 'i-lucide-ruler',
            label: 'Quy mô',
            value: project.area
          }
        : null,
      project.year
        ? {
            icon: 'i-lucide-calendar',
            label: 'Năm hoàn thiện',
            value: project.year
          }
        : null,
      project.style
        ? {
            icon: 'i-lucide-palette',
            label: 'Phong cách',
            value: project.style
          }
        : null,
      project.client
        ? {
            icon: 'i-lucide-building-2',
            label: 'Chủ đầu tư',
            value: project.client
          }
        : null
    ].filter((item): item is MetaItem => Boolean(item))
  : []

const fallbackOverview = project?.description.join(' ')

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
    title: `${project.name} | Lai Huy Interior`,
    description: project.content?.overview ?? project.shortDescription,
    ogTitle: `${project.name} | Lai Huy Interior`,
    ogDescription: project.shortDescription,
    ogImage: getProjectImage(project)
  })
}

const heroRef = ref(null)
const overviewRef = ref(null)
const conceptRef = ref(null)
const solutionRef = ref(null)
const galleryRef = ref(null)
const relatedRef = ref(null)
const ctaRef = ref(null)

useScrollReveal(heroRef)
useScrollReveal(overviewRef)
useScrollReveal(conceptRef, { delay: 100 })
useScrollReveal(solutionRef, { delay: 100 })
useScrollReveal(galleryRef)
useScrollReveal(relatedRef)
useScrollReveal(ctaRef)
</script>

<template>
  <div class="bg-stone-50">
    <template v-if="!project">
      <section class="min-h-screen bg-white px-6 py-32">
        <div class="mx-auto max-w-3xl text-center">
          <p class="mb-6 text-8xl font-bold text-orange-500">
            404
          </p>
          <h1 class="mb-4 text-3xl font-bold text-gray-950 md:text-4xl">
            Không tìm thấy dự án
          </h1>
          <p class="mx-auto mb-10 max-w-xl text-lg leading-relaxed text-gray-500">
            Dự án bạn đang tìm kiếm không tồn tại hoặc đã được cập nhật sang một đường dẫn khác.
          </p>
          <NuxtLink
            to="/du-an"
            class="btn-primary inline-flex"
          >
            Quay lại danh sách dự án
          </NuxtLink>
        </div>
      </section>
    </template>

    <template v-else>
      <section class="relative min-h-screen overflow-hidden bg-gray-950 text-white">
        <img
          :src="heroImage"
          :alt="project.name"
          class="absolute inset-0 h-full w-full object-cover"
        >
        <div class="absolute inset-0 bg-gray-950/55" />
        <div class="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-gray-950 via-gray-950/70 to-transparent" />

        <div
          ref="heroRef"
          class="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col justify-end px-6 pb-10 pt-32 md:pb-16"
        >
          <NuxtLink
            to="/du-an"
            class="mb-8 inline-flex w-fit items-center gap-2 text-sm font-semibold text-white/75 transition-colors hover:text-white"
          >
            <Icon
              name="i-lucide-arrow-left"
              class="h-4 w-4"
            />
            Dự án
          </NuxtLink>

          <div class="grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-end">
            <div class="max-w-4xl">
              <span class="mb-5 inline-block text-xs font-semibold uppercase tracking-[0.28em] text-orange-300">
                {{ project.categoryName }}
              </span>
              <h1 class="text-4xl font-bold leading-tight md:text-6xl lg:text-7xl">
                {{ project.name }}
              </h1>
              <p class="mt-6 max-w-2xl text-lg leading-8 text-white/80 md:text-xl">
                {{ project.shortDescription }}
              </p>
            </div>

            <div
              v-if="allImages.length > 1"
              class="rounded-2xl border border-white/15 bg-white/10 p-3 backdrop-blur-md"
            >
              <div class="mb-3 flex items-center justify-between text-sm text-white/80">
                <span>Hình ảnh dự án</span>
                <span>{{ currentImageIndex + 1 }} / {{ allImages.length }}</span>
              </div>
              <div class="grid grid-cols-4 gap-2">
                <button
                  v-for="(image, index) in allImages.slice(0, 8)"
                  :key="image"
                  :class="[
                    'aspect-square overflow-hidden rounded-lg border transition-all',
                    currentImageIndex === index
                      ? 'border-orange-300 opacity-100'
                      : 'border-white/20 opacity-65 hover:opacity-100'
                  ]"
                  type="button"
                  @click="currentImageIndex = index"
                >
                  <img
                    :src="image"
                    :alt="`${project.name} - hình ${index + 1}`"
                    class="h-full w-full object-cover"
                  >
                </button>
              </div>
            </div>
          </div>
        </div>

        <button
          v-if="allImages.length > 1"
          class="absolute left-4 top-1/2 z-20 hidden -translate-y-1/2 rounded-full border border-white/20 bg-white/10 p-3 text-white backdrop-blur-md transition-colors hover:bg-white/20 md:block"
          type="button"
          aria-label="Xem hình trước"
          @click="prevImage"
        >
          <Icon
            name="i-lucide-chevron-left"
            class="h-6 w-6"
          />
        </button>
        <button
          v-if="allImages.length > 1"
          class="absolute right-4 top-1/2 z-20 hidden -translate-y-1/2 rounded-full border border-white/20 bg-white/10 p-3 text-white backdrop-blur-md transition-colors hover:bg-white/20 md:block"
          type="button"
          aria-label="Xem hình tiếp theo"
          @click="nextImage"
        >
          <Icon
            name="i-lucide-chevron-right"
            class="h-6 w-6"
          />
        </button>
      </section>

      <section class="border-b border-stone-200 bg-white px-6 py-8">
        <div class="mx-auto grid max-w-7xl gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <div
            v-for="item in metaItems"
            :key="item.label"
            class="border-l border-stone-200 py-3 pl-5"
          >
            <div class="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-orange-50 text-orange-500">
              <Icon
                :name="item.icon"
                class="h-5 w-5"
              />
            </div>
            <p class="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
              {{ item.label }}
            </p>
            <p class="mt-2 font-semibold leading-6 text-gray-950">
              {{ item.value }}
            </p>
          </div>
        </div>
      </section>

      <section class="px-6 py-20 md:py-28">
        <div class="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div ref="overviewRef">
            <span class="text-xs font-semibold uppercase tracking-[0.24em] text-orange-500">
              Tổng quan dự án
            </span>
            <h2 class="mt-4 max-w-md text-3xl font-bold leading-tight text-gray-950 md:text-5xl">
              Một không gian được kể bằng công năng, vật liệu và cảm xúc.
            </h2>
          </div>
          <div class="max-w-3xl">
            <p class="text-xl leading-9 text-gray-600">
              {{ project.content?.overview ?? fallbackOverview }}
            </p>
          </div>
        </div>
      </section>

      <section class="bg-white px-6 py-20 md:py-28">
        <div
          ref="conceptRef"
          class="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-center"
        >
          <div class="overflow-hidden rounded-[2rem]">
            <img
              :src="allImages[1] ?? getProjectImage(project)"
              :alt="`${project.name} - ý tưởng thiết kế`"
              class="aspect-[4/3] h-full w-full object-cover"
            >
          </div>
          <div class="max-w-xl lg:pl-8">
            <span class="text-xs font-semibold uppercase tracking-[0.24em] text-orange-500">
              Ý tưởng thiết kế
            </span>
            <h2 class="mt-4 text-3xl font-bold leading-tight text-gray-950 md:text-5xl">
              Tinh thần thẩm mỹ được tiết chế để không gian bền vững hơn.
            </h2>
            <p class="mt-6 text-lg leading-8 text-gray-600">
              {{ project.content?.concept }}
            </p>
          </div>
        </div>
      </section>

      <section class="px-6 py-20 md:py-28">
        <div
          ref="solutionRef"
          class="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_1fr]"
        >
          <div class="max-w-xl">
            <span class="text-xs font-semibold uppercase tracking-[0.24em] text-orange-500">
              Giải pháp không gian
            </span>
            <h2 class="mt-4 text-3xl font-bold leading-tight text-gray-950 md:text-5xl">
              Tối ưu từng lớp trải nghiệm trong quá trình sử dụng.
            </h2>
            <p class="mt-6 text-lg leading-8 text-gray-600">
              {{ project.content?.solution }}
            </p>
          </div>

          <div
            v-if="project.content?.highlights?.length"
            class="space-y-4"
          >
            <div
              v-for="(highlight, index) in project.content.highlights"
              :key="highlight"
              class="group flex gap-5 border-b border-stone-200 pb-5 last:border-b-0"
            >
              <span class="mt-1 text-sm font-bold text-orange-500">
                {{ String(index + 1).padStart(2, '0') }}
              </span>
              <p class="text-lg leading-8 text-gray-700">
                {{ highlight }}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        v-if="project.content?.materials?.length"
        class="bg-stone-900 px-6 py-20 text-white md:py-28"
      >
        <div class="mx-auto max-w-7xl">
          <div class="mb-12 max-w-2xl">
            <span class="text-xs font-semibold uppercase tracking-[0.24em] text-orange-300">
              Vật liệu & cảm hứng
            </span>
            <h2 class="mt-4 text-3xl font-bold leading-tight md:text-5xl">
              Chất liệu được chọn để tạo chiều sâu, sự ấm áp và độ bền sử dụng.
            </h2>
          </div>
          <div class="grid gap-4 md:grid-cols-2">
            <div
              v-for="material in project.content.materials"
              :key="material"
              class="border border-white/10 bg-white/[0.03] p-6"
            >
              <div class="mb-5 h-px w-12 bg-orange-300" />
              <p class="text-lg leading-8 text-white/80">
                {{ material }}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        v-if="allImages.length > 0"
        class="bg-white px-6 py-20 md:py-28"
      >
        <div
          ref="galleryRef"
          class="mx-auto max-w-7xl"
        >
          <div class="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <span class="text-xs font-semibold uppercase tracking-[0.24em] text-orange-500">
                Hình ảnh dự án
              </span>
              <h2 class="mt-4 text-3xl font-bold text-gray-950 md:text-5xl">
                Góc nhìn hoàn thiện
              </h2>
            </div>
            <p class="max-w-md text-base leading-7 text-gray-500">
              Bộ hình ghi lại các lớp không gian, vật liệu và ánh sáng đã được hoàn thiện trong dự án.
            </p>
          </div>

          <div class="grid gap-5 md:grid-cols-2">
            <button
              v-for="(image, index) in allImages"
              :key="image"
              :class="[
                'group relative overflow-hidden bg-stone-100 text-left',
                index === 0 ? 'md:col-span-2' : ''
              ]"
              type="button"
              @click="currentImageIndex = index"
            >
              <img
                :src="image"
                :alt="`${project.name} - hình ảnh ${index + 1}`"
                :class="[
                  'w-full object-cover transition-transform duration-700 group-hover:scale-105',
                  index === 0 ? 'aspect-[16/9]' : 'aspect-[4/3]'
                ]"
              >
              <div class="absolute inset-0 bg-gray-950/0 transition-colors group-hover:bg-gray-950/15" />
            </button>
          </div>
        </div>
      </section>

      <section class="px-6 py-20 md:py-28">
        <div
          ref="ctaRef"
          class="mx-auto grid max-w-7xl gap-10 bg-white p-8 md:p-12 lg:grid-cols-[1fr_auto] lg:items-center"
        >
          <div>
            <span class="text-xs font-semibold uppercase tracking-[0.24em] text-orange-500">
              Tư vấn thiết kế
            </span>
            <h2 class="mt-4 max-w-2xl text-3xl font-bold leading-tight text-gray-950 md:text-5xl">
              Bạn muốn sở hữu một không gian có tinh thần tương tự?
            </h2>
            <p class="mt-5 max-w-2xl text-lg leading-8 text-gray-600">
              Lai Huy Interior đồng hành từ định hướng phong cách, bố trí công năng đến hoàn thiện vật liệu, giúp không gian của bạn vừa đẹp, vừa phù hợp với nhịp sống thực tế.
            </p>
          </div>
          <NuxtLink
            to="/lien-he"
            class="btn-primary inline-flex justify-center"
          >
            Liên hệ tư vấn
          </NuxtLink>
        </div>
      </section>

      <section
        v-if="relatedProjects.length > 0"
        class="bg-white px-6 py-20 md:py-28"
      >
        <div
          ref="relatedRef"
          class="mx-auto max-w-7xl"
        >
          <div class="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <span class="text-xs font-semibold uppercase tracking-[0.24em] text-orange-500">
                Khám phá thêm
              </span>
              <h2 class="mt-4 text-3xl font-bold text-gray-950 md:text-5xl">
                Dự án liên quan
              </h2>
            </div>
            <NuxtLink
              to="/du-an"
              class="group inline-flex items-center gap-2 font-semibold text-orange-500 transition-all hover:gap-3"
            >
              Xem tất cả
              <Icon
                name="i-lucide-arrow-right"
                class="h-4 w-4"
              />
            </NuxtLink>
          </div>

          <div class="grid gap-6 md:grid-cols-3">
            <NuxtLink
              v-for="item in relatedProjects"
              :key="item.slug"
              :to="`/du-an/${item.slug}`"
              class="group block"
            >
              <div class="relative mb-5 overflow-hidden">
                <img
                  :src="getProjectImage(item)"
                  :alt="item.name"
                  class="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                >
              </div>
              <span class="text-sm font-semibold text-orange-500">
                {{ item.categoryName }}
              </span>
              <h3 class="mt-2 text-xl font-bold text-gray-950">
                {{ item.name }}
              </h3>
              <p class="mt-3 line-clamp-2 text-sm leading-6 text-gray-500">
                {{ item.shortDescription }}
              </p>
            </NuxtLink>
          </div>
        </div>
      </section>
    </template>
  </div>
</template>
