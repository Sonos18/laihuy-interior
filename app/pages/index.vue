<script setup lang="ts">
import { company } from '~/data/company'
import { factoryCapabilities, machinery, productionWorkflow } from '~/data/factory'
import { projects } from '~/data/projects'
import { services } from '~/data/services'
import { uiText } from '~/data/ui'

const { t, ta } = useLanguage()

const featuredProjects = computed(() =>
  projects.filter(project => project.featured).slice(0, 3)
)

const heroMetrics = computed(() => [
  { label: t({ vi: 'Xưởng trực tiếp', en: 'Direct factory' }), value: t({ vi: '3.000 m²', en: '3,000 m²' }) },
  { label: t({ vi: 'Năng lực', en: 'Capacity' }), value: t({ vi: '50 phòng/tháng', en: '50 rooms/month' }) },
  { label: t({ vi: 'Lắp đặt', en: 'Installation' }), value: t({ vi: 'Thi công toàn quốc', en: 'Nationwide' }) },
  { label: t({ vi: 'Thị trường', en: 'Markets' }), value: t({ vi: 'Khách sạn / Villa / Thương mại', en: 'Hotels / Villas / Commercial' }) }
])

const seoTitle = computed(() => t(company.seo.home.title))
const seoDescription = computed(() => t(company.seo.home.description))

useSeoMeta({
  title: seoTitle,
  description: seoDescription,
  ogTitle: seoTitle,
  ogDescription: seoDescription,
  ogImage: company.seo.home.ogImage
})
</script>

<template>
  <div>
    <section class="relative min-h-screen overflow-hidden bg-ink-950 text-white">
      <img
        src="/images/projects/hotel/eo_gio/reception.png"
        :alt="t({ vi: 'Thi công nội thất khách sạn Lai Huy Interior', en: 'Lai Huy Interior hotel interior contracting' })"
        class="absolute inset-0 h-full w-full object-cover"
      >
      <div class="absolute inset-0 bg-ink-950/78" />
      <div class="absolute inset-x-0 bottom-0 h-48 bg-linear-to-t from-ink-950 to-transparent" />

      <div class="section-shell relative z-10 flex min-h-screen flex-col justify-end px-6 pb-12 pt-32 md:pb-18">
        <div class="max-w-5xl">
          <p class="eyebrow mb-6 text-wood-300">
            {{ t(uiText.labels.factoryDirectContractor) }}
          </p>
          <h1 class="max-w-5xl text-4xl font-black uppercase leading-[1.05] text-white md:text-6xl lg:text-7xl">
            {{ t({ vi: 'Thi công & sản xuất nội thất khách sạn 3-5 sao', en: 'Hotel interior manufacturing & contracting for 3-5 star projects' }) }}
          </h1>
          <p class="mt-6 max-w-3xl text-xl font-semibold text-white/86 md:text-2xl">
            {{ t(company.tagline) }}
          </p>
          <p class="mt-5 max-w-2xl text-base leading-8 text-white/68 md:text-lg">
            {{ t({ vi: 'Lai Huy Interior cung cấp giải pháp thiết kế, sản xuất và lắp đặt nội thất trọn gói cho khách sạn, villa, căn hộ và các công trình quy mô lớn.', en: 'Lai Huy Interior provides design, manufacturing, and installation solutions for hotels, villas, apartments, and large-scale interior projects.' }) }}
          </p>

          <div class="mt-9 flex flex-col gap-3 sm:flex-row">
            <NuxtLink
              to="/du-an"
              class="btn-primary"
            >
              {{ t(uiText.cta.projects) }}
              <Icon
                name="i-lucide-arrow-right"
                class="h-4 w-4"
              />
            </NuxtLink>
            <NuxtLink
              to="/lien-he"
              class="btn-secondary"
            >
              {{ t(uiText.cta.quote24h) }}
            </NuxtLink>
          </div>
        </div>

        <div class="mt-12 grid overflow-hidden rounded-2xl border border-white/12 bg-white/[0.04] backdrop-blur-sm sm:grid-cols-2 lg:grid-cols-4">
          <div
            v-for="metric in heroMetrics"
            :key="metric.label"
            class="border-b border-white/10 p-5 sm:border-r lg:border-b-0"
          >
            <p class="text-xs uppercase tracking-[0.18em] text-white/45">
              {{ metric.label }}
            </p>
            <p class="mt-2 text-xl font-black text-white md:text-2xl">
              {{ metric.value }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="section-spacing bg-white">
      <div class="section-shell">
        <div class="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p class="eyebrow">
              {{ t({ vi: 'Năng lực nhà xưởng', en: 'Factory capability' }) }}
            </p>
            <h2 class="mt-4 max-w-xl text-3xl font-black uppercase leading-tight text-ink-950 md:text-5xl">
              {{ t({ vi: 'Kiểm soát tiến độ, chất lượng và chi phí từ xưởng trực tiếp', en: 'Control schedule, quality, and cost through direct production' }) }}
            </h2>
          </div>
          <p class="max-w-3xl text-lg leading-8 text-ink-600">
            {{ t({ vi: 'Hệ thống sản xuất trực tiếp giúp Lai Huy Interior chủ động bóc tách bản vẽ, kiểm soát vật liệu, sản xuất theo module và điều phối lắp đặt cho các dự án khách sạn, villa, căn hộ và thương mại.', en: 'Direct production helps Lai Huy Interior control shop drawings, materials, modular manufacturing, and installation coordination for hotel, villa, apartment, and commercial projects.' }) }}
          </p>
        </div>

        <div class="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <article
            v-for="capability in factoryCapabilities"
            :key="t(capability.label)"
            class="metric-card"
          >
            <p class="text-sm font-bold text-wood-600">
              {{ t(capability.label) }}
            </p>
            <p class="mt-3 text-3xl font-black text-ink-950">
              {{ capability.value }}
            </p>
            <p class="mt-4 text-sm leading-6 text-ink-600">
              {{ t(capability.description) }}
            </p>
          </article>
        </div>

        <div class="mt-10">
          <NuxtLink
            to="/nha-xuong"
            class="btn-outline"
          >
            {{ t(uiText.cta.factory) }}
          </NuxtLink>
        </div>
      </div>
    </section>

    <section class="section-spacing bg-ink-50">
      <div class="section-shell">
        <div class="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p class="eyebrow">
              {{ t(uiText.labels.caseStudies) }}
            </p>
            <h2 class="mt-4 text-3xl font-black uppercase text-ink-950 md:text-5xl">
              {{ t({ vi: 'Dự án khách sạn & công trình tiêu biểu', en: 'Hotel and large-scale case studies' }) }}
            </h2>
          </div>
          <NuxtLink
            to="/du-an"
            class="btn-outline w-fit"
          >
            {{ t(uiText.cta.allProjects) }}
          </NuxtLink>
        </div>

        <div class="grid gap-6 lg:grid-cols-3">
          <NuxtLink
            v-for="project in featuredProjects"
            :key="project.slug"
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
              <h3 class="text-2xl font-black text-ink-950">
                {{ t(project.name) }}
              </h3>
              <p class="mt-3 line-clamp-3 text-sm leading-6 text-ink-600">
                {{ t(project.shortDescription) }}
              </p>
              <div class="mt-5 flex flex-wrap gap-2 text-xs font-bold text-ink-700">
                <span
                  v-if="project.rooms"
                  class="rounded-full border border-ink-200 px-3 py-2"
                >
                  {{ t(project.rooms) }}
                </span>
                <span
                  v-if="project.duration"
                  class="rounded-full border border-ink-200 px-3 py-2"
                >
                  {{ t(project.duration) }}
                </span>
                <span
                  v-if="ta(project.scope)[0]"
                  class="rounded-full border border-ink-200 px-3 py-2"
                >
                  {{ ta(project.scope)[0] }}
                </span>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <section class="section-spacing bg-ink-950 text-white">
      <div class="section-shell">
        <div class="grid gap-12 lg:grid-cols-[0.7fr_1.3fr]">
          <div>
            <p class="eyebrow text-wood-300">
              {{ t(uiText.labels.productionWorkflow) }}
            </p>
            <h2 class="mt-4 text-3xl font-black uppercase leading-tight md:text-5xl">
              {{ t({ vi: 'Từ bản vẽ đến bàn giao công trình', en: 'From drawings to project handover' }) }}
            </h2>
          </div>
          <div class="grid gap-4 md:grid-cols-2">
            <article
              v-for="(step, index) in productionWorkflow"
              :key="t(step.title)"
              class="rounded-2xl border border-white/12 p-6"
            >
              <span class="text-sm font-black text-wood-300">
                {{ String(index + 1).padStart(2, '0') }}
              </span>
              <h3 class="mt-5 text-xl font-black text-white">
                {{ t(step.title) }}
              </h3>
              <p class="mt-3 text-sm leading-6 text-white/62">
                {{ t(step.description) }}
              </p>
            </article>
          </div>
        </div>
      </div>
    </section>

    <section class="section-spacing bg-white">
      <div class="section-shell">
        <div class="mb-12 max-w-3xl">
          <p class="eyebrow">
            {{ t(uiText.labels.services) }}
          </p>
          <h2 class="mt-4 text-3xl font-black uppercase text-ink-950 md:text-5xl">
            {{ t({ vi: 'Giải pháp nội thất cho chủ đầu tư, tổng thầu và đơn vị vận hành', en: 'Interior solutions for owners, contractors, and operators' }) }}
          </h2>
        </div>

        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <article
            v-for="service in services"
            :key="service.id"
            class="industrial-card"
          >
            <Icon
              :name="service.icon"
              class="h-8 w-8 text-wood-500"
            />
            <h3 class="mt-6 text-xl font-black text-ink-950">
              {{ t(service.title) }}
            </h3>
            <p class="mt-3 text-sm leading-6 text-ink-600">
              {{ t(service.description) }}
            </p>
          </article>
        </div>
      </div>
    </section>

    <section class="section-spacing bg-ink-50">
      <div class="section-shell grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
        <div>
          <img
            src="/images/about_workspace.jpg"
            :alt="t({ vi: 'Không gian làm việc và sản xuất Lai Huy Interior', en: 'Lai Huy Interior workspace and production capability' })"
            class="aspect-[4/3] w-full rounded-2xl object-cover"
          >
        </div>
        <div>
          <p class="eyebrow">
            {{ t(uiText.labels.machinery) }}
          </p>
          <h2 class="mt-4 text-3xl font-black uppercase leading-tight text-ink-950 md:text-5xl">
            {{ t({ vi: 'Hệ thống máy hỗ trợ gia công nội thất dự án', en: 'Machinery system for project interior production' }) }}
          </h2>
          <div class="mt-8 grid gap-3 sm:grid-cols-2">
            <div
              v-for="item in machinery"
              :key="t(item.name)"
              class="rounded-2xl border border-ink-200 bg-white p-4"
            >
              <h3 class="text-base font-black text-ink-950">
                {{ t(item.name) }}
              </h3>
              <p class="mt-2 text-sm leading-6 text-ink-600">
                {{ t(item.description) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="bg-ink-950 px-6 py-16 text-white">
      <div class="section-shell grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <p class="eyebrow text-wood-300">
            {{ t({ vi: 'Tư vấn dự án', en: 'Project consultation' }) }}
          </p>
          <h2 class="mt-4 max-w-3xl text-3xl font-black uppercase md:text-5xl">
            {{ t({ vi: 'Gửi bản vẽ để nhận BOQ sơ bộ cho dự án khách sạn', en: 'Send drawings for a preliminary BOQ for your hotel project' }) }}
          </h2>
          <p class="mt-4 max-w-2xl text-white/62">
            {{ t({ vi: 'Đội ngũ Lai Huy Interior sẽ tư vấn phạm vi sản xuất, vật liệu, tiến độ và phương án thi công phù hợp mục tiêu đầu tư.', en: 'Our team will advise on production scope, materials, schedule, and installation strategy for your investment goals.' }) }}
          </p>
        </div>
        <div class="flex flex-col gap-3 sm:flex-row md:flex-col">
          <NuxtLink
            to="/lien-he"
            class="btn-primary"
          >
            {{ t(uiText.cta.quote24h) }}
          </NuxtLink>
          <NuxtLink
            to="/nha-xuong"
            class="btn-secondary"
          >
            {{ t(uiText.cta.factory) }}
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>
