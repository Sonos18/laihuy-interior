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
  { label: t({ vi: 'Xưởng trực tiếp', en: 'Direct factory' }), value: t({ vi: '3.000m²', en: '3,000m²' }) },
  { label: t({ vi: 'Năng lực sản xuất', en: 'Production capacity' }), value: t({ vi: '50 phòng/tháng', en: '50 rooms/month' }) },
  { label: t({ vi: 'Lắp đặt', en: 'Installation' }), value: t({ vi: 'Thi công toàn quốc', en: 'Nationwide' }) },
  { label: t({ vi: 'Thị trường mục tiêu', en: 'Target markets' }), value: t({ vi: 'Khách sạn / Villa / Thương mại', en: 'Hotels / Villas / Commercial' }) }
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
  <div class="bg-white">
    <section class="relative overflow-hidden bg-wood-950 text-white">
      <img
        src="/images/projects/hotel/eo_gio/reception.png"
        :alt="t({ vi: 'Thi công nội thất khách sạn Lai Huy Interior', en: 'Lai Huy Interior hotel interior contracting' })"
        class="absolute inset-0 h-full w-full object-cover opacity-20"
      >
      <div class="absolute inset-0 bg-linear-to-br from-ink-950 via-wood-950/92 to-ink-900/72" />
      <div class="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-wood-50/10 to-transparent" />

      <div class="section-shell relative z-10 grid gap-10 px-4 pb-16 pt-28 sm:px-6 sm:pt-32 lg:min-h-[82vh] lg:grid-cols-[0.9fr_1fr] lg:items-center lg:px-8 lg:pb-20">
        <div class="max-w-2xl">
          <p class="eyebrow mb-5 text-wood-300">
            {{ t({ vi: 'Nhà thầu nội thất trực tiếp từ xưởng', en: 'Factory-direct interior contractor' }) }}
          </p>
          <h1 class="max-w-2xl text-[2.25rem] font-black uppercase leading-[1.08] text-white sm:text-[2.7rem] md:text-5xl lg:text-6xl">
            {{ t({ vi: 'Sản xuất & thi công', en: 'Manufacturing & contracting' }) }}
            <span class="block text-wood-200">
              {{ t({ vi: 'nội thất khách sạn 3–5 sao', en: 'for 3–5 star hotel interiors' }) }}
            </span>
          </h1>
          <p class="mt-6 max-w-xl text-base leading-8 text-white/72 sm:text-lg">
            {{ t({ vi: 'Xưởng trực tiếp 3.000m², kiểm soát chất lượng và tiến độ cho dự án khách sạn, villa, căn hộ trên toàn quốc.', en: 'A 3,000m² direct factory controlling quality and schedule for hotel, villa, and apartment projects nationwide.' }) }}
          </p>

          <div class="mt-8 flex flex-col gap-3 sm:flex-row">
            <NuxtLink
              to="/du-an"
              class="btn-primary"
            >
              {{ t({ vi: 'Xem dự án tiêu biểu', en: 'View featured projects' }) }}
              <Icon
                name="i-lucide-arrow-right"
                class="h-4 w-4"
              />
            </NuxtLink>
            <NuxtLink
              to="/lien-he"
              class="btn-secondary"
            >
              {{ t({ vi: 'Nhận báo giá trong 24h', en: 'Get a quote within 24h' }) }}
            </NuxtLink>
          </div>
        </div>

        <div class="lg:pl-8">
          <div class="group relative overflow-hidden rounded-[2rem] border border-white/15 bg-white/10 p-2 shadow-2xl shadow-ink-950/30 backdrop-blur">
            <div class="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-ink-900 lg:aspect-[4/5]">
              <img
                src="/images/projects/hotel/eo_gio/reception.png"
                :alt="t({ vi: 'Không gian nội thất khách sạn đã thi công', en: 'Completed hotel interior space' })"
                class="h-full w-full object-cover opacity-95 transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              >
              <div class="absolute inset-0 bg-linear-to-t from-ink-950/70 via-ink-950/10 to-transparent" />
              <div class="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                <p class="text-xs font-bold uppercase tracking-[0.18em] text-wood-200">
                  {{ t({ vi: 'Triển khai trọn gói', en: 'Turnkey delivery' }) }}
                </p>
                <p class="mt-2 max-w-sm text-sm leading-6 text-white/78">
                  {{ t({ vi: 'Từ bóc tách kỹ thuật, sản xuất tại xưởng đến lắp đặt và nghiệm thu tại công trình.', en: 'From technical drawings and factory production to installation and handover.' }) }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="bg-wood-50 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div class="section-shell">
        <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Reveal
            v-for="(metric, index) in heroMetrics"
            :key="metric.label"
            :delay="index * 70"
            class="rounded-3xl border border-wood-100/90 bg-white/90 p-5 shadow-sm shadow-ink-950/5 transition-all duration-500 ease-out hover:-translate-y-1 hover:border-wood-300 hover:shadow-xl hover:shadow-ink-950/10"
          >
            <p class="text-xs font-bold uppercase tracking-[0.18em] text-ink-500">
              {{ metric.label }}
            </p>
            <p class="mt-2 text-xl font-black leading-tight text-ink-950 md:text-2xl">
              {{ metric.value }}
            </p>
          </Reveal>
        </div>
      </div>
    </section>

    <section class="section-spacing bg-white">
      <div class="section-shell">
        <Reveal class="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
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
        </Reveal>

        <div class="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Reveal
            v-for="(capability, index) in factoryCapabilities"
            :key="t(capability.label)"
            as="article"
            :delay="index * 70"
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
          </Reveal>
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
        <Reveal class="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
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
        </Reveal>

        <div class="grid gap-6 lg:grid-cols-3">
          <Reveal
            v-for="project in featuredProjects"
            :key="project.slug"
            class="h-full"
          >
            <NuxtLink
              :to="`/du-an/${project.slug}`"
              class="group block h-full overflow-hidden rounded-3xl border border-ink-200/80 bg-white shadow-sm shadow-ink-950/5 transition-all duration-500 ease-out hover:-translate-y-1.5 hover:border-wood-300 hover:shadow-xl hover:shadow-ink-950/10"
            >
              <div class="relative aspect-[4/3] overflow-hidden bg-ink-100">
                <img
                  :src="project.image[0]"
                  :alt="t(project.name)"
                  class="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                >
                <div class="absolute left-4 top-4 rounded-full bg-ink-950 px-3 py-2 text-xs font-bold uppercase tracking-[0.16em] text-white">
                  {{ t(project.categoryName) }}
                </div>
              </div>
              <div class="p-6">
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
          </Reveal>
        </div>
      </div>
    </section>

    <section class="section-spacing bg-ink-950 text-white">
      <div class="section-shell">
        <div class="grid gap-12 lg:grid-cols-[0.7fr_1.3fr]">
          <Reveal>
            <p class="eyebrow text-wood-300">
              {{ t(uiText.labels.productionWorkflow) }}
            </p>
            <h2 class="mt-4 text-3xl font-black uppercase leading-tight md:text-5xl">
              {{ t({ vi: 'Từ bản vẽ đến bàn giao công trình', en: 'From drawings to project handover' }) }}
            </h2>
          </Reveal>
          <div class="grid gap-4 md:grid-cols-2">
            <Reveal
              v-for="(step, index) in productionWorkflow"
              :key="t(step.title)"
              as="article"
              :delay="index * 70"
              class="rounded-2xl border border-white/12 bg-white/[0.03] p-6 transition-all duration-500 ease-out hover:-translate-y-1 hover:border-wood-300/60 hover:bg-white/[0.05] hover:shadow-xl hover:shadow-black/20"
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
            </Reveal>
          </div>
        </div>
      </div>
    </section>

    <section class="section-spacing bg-white">
      <div class="section-shell">
        <Reveal class="mb-12 max-w-3xl">
          <p class="eyebrow">
            {{ t(uiText.labels.services) }}
          </p>
          <h2 class="mt-4 text-3xl font-black uppercase text-ink-950 md:text-5xl">
            {{ t({ vi: 'Giải pháp nội thất cho chủ đầu tư, tổng thầu và đơn vị vận hành', en: 'Interior solutions for owners, contractors, and operators' }) }}
          </h2>
        </Reveal>

        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Reveal
            v-for="(service, index) in services"
            :key="service.id"
            as="article"
            :delay="index * 70"
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
          </Reveal>
        </div>
      </div>
    </section>

    <section class="section-spacing bg-ink-50">
      <div class="section-shell grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
        <Reveal>
          <div class="group overflow-hidden rounded-3xl bg-ink-100 shadow-xl shadow-ink-950/10">
            <img
              src="/images/about_workspace.jpg"
              :alt="t({ vi: 'Không gian làm việc và sản xuất Lai Huy Interior', en: 'Lai Huy Interior workspace and production capability' })"
              class="aspect-[4/3] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
            >
          </div>
        </Reveal>
        <div>
          <Reveal>
            <p class="eyebrow">
              {{ t(uiText.labels.machinery) }}
            </p>
            <h2 class="mt-4 text-3xl font-black uppercase leading-tight text-ink-950 md:text-5xl">
              {{ t({ vi: 'Hệ thống máy hỗ trợ gia công nội thất dự án', en: 'Machinery system for project interior production' }) }}
            </h2>
          </Reveal>
          <div class="mt-8 grid gap-3 sm:grid-cols-2">
            <Reveal
              v-for="(item, index) in machinery"
              :key="t(item.name)"
              :delay="index * 60"
              class="rounded-2xl border border-ink-200/80 bg-white p-4 shadow-sm shadow-ink-950/5 transition-all duration-500 ease-out hover:-translate-y-1 hover:border-wood-300 hover:shadow-lg hover:shadow-ink-950/10"
            >
              <h3 class="text-base font-black text-ink-950">
                {{ t(item.name) }}
              </h3>
              <p class="mt-2 text-sm leading-6 text-ink-600">
                {{ t(item.description) }}
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>

    <section class="bg-ink-950 px-4 py-16 text-white sm:px-6 lg:px-8 lg:py-20">
      <div class="section-shell grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
        <Reveal>
          <p class="eyebrow text-wood-300">
            {{ t({ vi: 'Tư vấn dự án', en: 'Project consultation' }) }}
          </p>
          <h2 class="mt-4 max-w-3xl text-3xl font-black uppercase md:text-5xl">
            {{ t({ vi: 'Gửi bản vẽ để nhận BOQ sơ bộ cho dự án khách sạn', en: 'Send drawings for a preliminary BOQ for your hotel project' }) }}
          </h2>
          <p class="mt-4 max-w-2xl text-white/62">
            {{ t({ vi: 'Đội ngũ Lai Huy Interior sẽ tư vấn phạm vi sản xuất, vật liệu, tiến độ và phương án thi công phù hợp mục tiêu đầu tư.', en: 'Our team will advise on production scope, materials, schedule, and installation strategy for your investment goals.' }) }}
          </p>
        </Reveal>
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
