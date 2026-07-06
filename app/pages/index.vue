<script setup lang="ts">
import { company } from '~/data/company'
import { factoryCapabilities, machinery, productionWorkflow } from '~/data/factory'
import { projects } from '~/data/projects'
import { services } from '~/data/services'
import { siteImages } from '~/data/site-images'
import { uiText } from '~/data/ui'
import { projectMedia } from '~/media/catalog.generated'
import { getProjectMedia } from '~/media/project-media'
import type { MediaAsset } from '~/shared/media/types'
import type { Project } from '~/shared/types/project'

const { t, ta } = useLanguage()
const { resolve: mediaUrl } = useMediaUrl()

const heroImage = projectMedia['khach-san-eo-gio'].cover

const featuredProjects = computed(() =>
  projects
    .filter(project => project.featured)
    .map(project => ({ project, cover: getProjectMedia(project.mediaId)?.cover }))
    .filter((entry): entry is { project: Project, cover: MediaAsset } => entry.cover !== undefined)
    .slice(0, 3)
)

const heroMetrics = computed(() => [
  { label: t({ vi: 'Xưởng sản xuất và kho', en: 'Factory & warehouse' }), value: t({ vi: '3.000 m²', en: '3,000 m²' }) },
  { label: t({ vi: 'Năng lực sản xuất & thi công', en: 'Production & contracting' }), value: t({ vi: 'Lên đến 50 phòng/tháng', en: 'Up to 50 rooms/month' }) },
  { label: t({ vi: 'Thị trường', en: 'Markets' }), value: t({ vi: 'Trong nước và xuất khẩu', en: 'Domestic & export' }) },
  { label: t({ vi: 'Lĩnh vực', en: 'Sectors' }), value: t({ vi: 'Khách sạn, resort, căn hộ cao cấp', en: 'Hotels, resorts, premium apartments' }) }
])

const seoTitle = computed(() => t(company.seo.home.title))
const seoDescription = computed(() => t(company.seo.home.description))

useSeoMeta({
  title: seoTitle,
  description: seoDescription,
  ogTitle: seoTitle,
  ogDescription: seoDescription,
  ogImage: mediaUrl(company.seo.home.ogImage.path)
})

useHead({
  link: [
    {
      rel: 'preload',
      as: 'image',
      href: mediaUrl(heroImage.path, { width: 1600 }),
      fetchpriority: 'high'
    }
  ]
})
</script>

<template>
  <div>
    <section class="relative min-h-screen overflow-hidden bg-ink-950 text-white">
      <NuxtImg
        :src="heroImage.path"
        :alt="t({ vi: 'Thi công nội thất khách sạn Lai Huy Interior', en: 'Lai Huy Interior hotel interior contracting' })"
        :width="heroImage.width"
        :height="heroImage.height"
        sizes="sm:100vw md:100vw lg:100vw xl:100vw"
        loading="eager"
        fetchpriority="high"
        class="hero-image absolute inset-0 h-full w-full object-cover"
      />
      <!-- Primary atmospheric overlay: warm veil that lifts toward the top so the photography reads. -->
      <div class="absolute inset-0 bg-linear-to-t from-wood-950/86 from-70% to-wood-950/68" />
      <!-- Lower protection layer: deepens the base of the frame to keep the metrics and CTAs legible. -->
      <div class="absolute inset-0 bg-linear-to-t from-wood-950/43 via-transparent via-70% to-transparent" />

      <div class="section-shell relative z-10 flex min-h-screen flex-col justify-end px-6 pb-12 pt-32 md:pb-18">
        <div class="max-w-5xl">
          <p
            v-reveal
            class="eyebrow reveal mb-6 text-wood-200"
          >
            {{ t(uiText.labels.factoryDirectContractor) }}
          </p>
          <h1
            v-reveal="90"
            class="reveal text-hero max-w-5xl font-black uppercase text-white"
          >
            {{ t({ vi: 'Sản xuất & thi công nội thất dự án', en: 'Project interior manufacturing & contracting' }) }}
            <span class="mt-3 block text-balance text-xl font-bold normal-case tracking-normal text-wood-200 sm:text-2xl md:text-3xl">
              {{ t({ vi: 'Chuyên khách sạn, resort và căn hộ cao cấp', en: 'Specialised in hotels, resorts and premium apartments' }) }}
            </span>
          </h1>
          <p
            v-reveal="160"
            class="reveal mt-6 max-w-3xl text-lg font-semibold text-white/86 md:text-xl"
          >
            {{ t(company.tagline) }}
          </p>
          <p
            v-reveal="220"
            class="reveal text-lead mt-5 max-w-2xl text-white/68"
          >
            {{ t({ vi: 'Lai Huy Interior cung cấp giải pháp sản xuất, thiết kế và thi công nội thất trọn gói cho khách sạn, resort, villa và các dự án cao cấp.', en: 'Lai Huy Interior delivers turnkey manufacturing, design, and interior contracting for hotels, resorts, villas, and premium projects.' }) }}
          </p>

          <div
            v-reveal="300"
            class="reveal mt-9 flex flex-col gap-3 sm:flex-row"
          >
            <NuxtLink
              to="/du-an"
              class="btn-primary"
            >
              {{ t(uiText.cta.projects) }}
              <Icon
                name="i-lucide-arrow-right"
                class="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
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
            v-for="(metric, index) in heroMetrics"
            :key="metric.label"
            v-reveal="360 + index * 90"
            class="reveal border-b border-white/10 p-5 sm:border-r lg:border-b-0"
          >
            <p class="text-xs uppercase tracking-[0.18em] text-white/70">
              {{ metric.label }}
            </p>
            <p class="mt-2 text-lg font-black text-white md:text-xl">
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
            <p
              v-reveal
              class="eyebrow reveal"
            >
              {{ t({ vi: 'Năng lực nhà xưởng', en: 'Factory capability' }) }}
            </p>
            <h2
              v-reveal="80"
              class="reveal text-section-title mt-4 max-w-xl font-black uppercase text-ink-950"
            >
              {{ t({ vi: 'Kiểm soát tiến độ, chất lượng và chi phí từ xưởng trực tiếp', en: 'Control schedule, quality, and cost through direct production' }) }}
            </h2>
          </div>
          <p
            v-reveal="140"
            class="reveal text-lead max-w-3xl text-ink-600"
          >
            {{ t({ vi: 'Hệ thống sản xuất trực tiếp giúp Lai Huy Interior kiểm soát xuyên suốt từ bóc tách bản vẽ, vật liệu, sản xuất đến thi công cho các dự án khách sạn, resort và căn hộ cao cấp.', en: 'Direct in-house production lets Lai Huy Interior control the whole flow — from shop-drawing breakdown and materials to manufacturing and on-site contracting — across hotel, resort, and premium apartment projects.' }) }}
          </p>
        </div>

        <div class="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <article
            v-for="(capability, index) in factoryCapabilities"
            :key="t(capability.label)"
            v-reveal="index * 100"
            class="metric-card reveal transition-colors hover:border-wood-400"
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
            <p
              v-reveal
              class="eyebrow reveal"
            >
              {{ t(uiText.labels.caseStudies) }}
            </p>
            <h2
              v-reveal="80"
              class="reveal text-section-title mt-4 font-black uppercase text-ink-950"
            >
              {{ t({ vi: 'Dự án khách sạn & công trình tiêu biểu', en: 'Hotel and large-scale case studies' }) }}
            </h2>
          </div>
          <NuxtLink
            v-reveal="140"
            to="/du-an"
            class="btn-outline reveal w-fit"
          >
            {{ t(uiText.cta.allProjects) }}
          </NuxtLink>
        </div>

        <div class="grid gap-6 lg:grid-cols-3">
          <NuxtLink
            v-for="({ project, cover }, index) in featuredProjects"
            :key="project.slug"
            v-reveal="index * 110"
            :to="`/du-an/${project.slug}`"
            class="group reveal block overflow-hidden rounded-2xl bg-white"
          >
            <div class="relative aspect-[4/3] overflow-hidden bg-ink-100">
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
                  v-if="project.location"
                  class="inline-flex items-center gap-1.5 rounded-full border border-ink-200 px-3 py-2"
                >
                  <Icon
                    name="i-lucide-map-pin"
                    class="h-3.5 w-3.5 text-wood-500"
                  />
                  {{ t(project.location) }}
                </span>
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
                  v-else-if="ta(project.scope)[0]"
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
            <p
              v-reveal
              class="eyebrow reveal text-wood-300"
            >
              {{ t(uiText.labels.productionWorkflow) }}
            </p>
            <h2
              v-reveal="80"
              class="reveal text-section-title mt-4 font-black uppercase"
            >
              {{ t({ vi: 'Từ bản vẽ đến bàn giao công trình', en: 'From drawings to project handover' }) }}
            </h2>
          </div>
          <div class="grid gap-4 md:grid-cols-2">
            <article
              v-for="(step, index) in productionWorkflow"
              :key="t(step.title)"
              v-reveal="index * 80"
              class="reveal rounded-2xl border border-white/12 p-6 transition-colors hover:border-wood-300/50"
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
          <p
            v-reveal
            class="eyebrow reveal"
          >
            {{ t(uiText.labels.services) }}
          </p>
          <h2
            v-reveal="80"
            class="reveal text-section-title mt-4 font-black uppercase text-ink-950"
          >
            {{ t({ vi: 'Giải pháp nội thất cho chủ đầu tư, tổng thầu và đơn vị vận hành', en: 'Interior solutions for owners, contractors, and operators' }) }}
          </h2>
        </div>

        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <article
            v-for="(service, index) in services"
            :key="service.id"
            v-reveal="(index % 3) * 90"
            class="industrial-card reveal"
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
        <div
          v-reveal
          class="reveal group overflow-hidden rounded-2xl"
        >
          <NuxtImg
            :src="siteImages.aboutWorkspace.path"
            :alt="t(siteImages.aboutWorkspace.alt)"
            :width="siteImages.aboutWorkspace.width"
            :height="siteImages.aboutWorkspace.height"
            sizes="sm:100vw lg:50vw"
            loading="lazy"
            class="aspect-[4/3] w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
          />
        </div>
        <div>
          <p
            v-reveal
            class="eyebrow reveal"
          >
            {{ t(uiText.labels.machinery) }}
          </p>
          <h2
            v-reveal="80"
            class="reveal text-section-title mt-4 font-black uppercase text-ink-950"
          >
            {{ t({ vi: 'Hệ thống máy phục vụ sản xuất nội thất dự án', en: 'Machinery system for project interior manufacturing' }) }}
          </h2>
          <p
            v-reveal="140"
            class="reveal mt-5 max-w-xl text-base leading-7 text-ink-600"
          >
            {{ t({ vi: 'Xưởng sản xuất nội thất ứng dụng CNC với quy trình cắt – khoan – dán cạnh – ép hoàn thiện đồng bộ, phục vụ các dự án khách sạn, villa và căn hộ cao cấp.', en: 'A CNC-driven interior workshop with a synchronised cut – drill – edge-band – press finishing process, serving hotel, villa, and premium apartment projects.' }) }}
          </p>
          <div class="mt-8 grid gap-3 sm:grid-cols-2">
            <div
              v-for="(item, index) in machinery"
              :key="t(item.name)"
              v-reveal="(index % 2) * 80"
              class="reveal rounded-2xl border border-ink-200 bg-white p-4 transition-colors hover:border-wood-400"
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
          <p
            v-reveal
            class="eyebrow reveal text-wood-300"
          >
            {{ t({ vi: 'Tư vấn dự án', en: 'Project consultation' }) }}
          </p>
          <h2
            v-reveal="80"
            class="reveal text-section-title mt-4 max-w-3xl font-black uppercase"
          >
            {{ t({ vi: 'Gửi bản vẽ để đánh giá chi phí, tiến độ và phạm vi thi công', en: 'Send your drawings to assess cost, schedule, and contracting scope' }) }}
          </h2>
          <p
            v-reveal="140"
            class="reveal mt-4 max-w-2xl text-white/62"
          >
            {{ t({ vi: 'Đội ngũ kỹ thuật Lai Huy Interior sẽ rà soát hồ sơ, tư vấn vật liệu, tiến độ sản xuất và phương án triển khai phù hợp với ngân sách và mục tiêu vận hành dự án.', en: 'The Lai Huy Interior technical team will review your documents and advise on materials, production schedule, and a delivery plan that fits your budget and operational goals.' }) }}
          </p>
        </div>
        <div
          v-reveal="200"
          class="reveal flex flex-col gap-4"
        >
          <div class="flex flex-col gap-3 sm:flex-row md:flex-col">
            <NuxtLink
              to="/lien-he"
              class="btn-primary"
            >
              {{ t({ vi: 'Gửi bản vẽ nhận báo giá trong 24h', en: 'Send drawings for a quote within 24h' }) }}
            </NuxtLink>
            <NuxtLink
              to="/nha-xuong"
              class="btn-secondary"
            >
              {{ t(uiText.cta.factory) }}
            </NuxtLink>
          </div>
          <div class="flex flex-col gap-2 text-sm font-semibold text-white/80">
            <a
              :href="`mailto:${company.email}`"
              class="inline-flex items-center gap-2.5 transition-colors hover:text-white"
            >
              <Icon
                name="i-lucide-mail"
                class="h-4 w-4 shrink-0 text-wood-300"
              />
              {{ company.email }}
            </a>
            <a
              :href="`tel:${company.phone.replaceAll(' ', '')}`"
              class="inline-flex items-center gap-2.5 transition-colors hover:text-white"
            >
              <Icon
                name="i-lucide-phone"
                class="h-4 w-4 shrink-0 text-wood-300"
              />
              {{ company.phone }}
            </a>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
