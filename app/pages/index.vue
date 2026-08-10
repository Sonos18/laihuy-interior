<script setup lang="ts">
import { company } from '~/data/company'
import {
  factoryCapabilities,
  machineryProcessGroups,
  machinerySectionContent,
  productionWorkflow
} from '~/data/factory'
import { projects } from '~/data/projects'
import { services } from '~/data/services'
import { siteImages } from '~/data/site-images'
import { uiText } from '~/data/ui'
import { categoryDefinitions } from '~/data/categories'
import { projectMedia } from '~/media/catalog.generated'
import { projectCoverAsset } from '~/media/project-media'
import type { MediaAsset } from '~/shared/media/types'
import type { Project } from '~/shared/types/project'

const { t, ta } = useLanguage()

const formatMachinerySequence = (index: number) => String(index + 1).padStart(2, '0')

const heroImage = projectMedia['khach-san-eo-gio'].cover

const featuredProjects = computed(() =>
  projects
    .filter(project => project.featured)
    .map(project => ({ project, cover: projectCoverAsset(project.mediaId, project.coverImage) }))
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

usePageSeo({
  path: '/',
  title: seoTitle,
  description: seoDescription,
  imagePath: company.seo.home.ogImage.path,
  jsonLd: ({ base }) => [
    buildOrganizationLd(base, t),
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${base}#website`,
      'url': `${base}/`,
      'name': company.name,
      'inLanguage': ['vi', 'en'],
      'publisher': { '@id': `${base}#organization` }
    }
  ]
})
</script>

<template>
  <div>
    <!-- min-h is --hero-min-h-HOME, NOT 100vh: the image below is `h-full object-cover`, so a
         content-driven height change rescales the photograph. The EN headline takes one more
         line than VI, which is what made the hero look zoomed after switching language. The
         token holds both locales at the same height.

         This is THE shared hero floor (§30.1): home is a bespoke cover that inlines its own hero,
         and <AppHero> now adopts the same token, so the photograph is exactly this tall on every
         page. The floor is measured against home's copy — the tallest, because home's is
         bottom-anchored while AppHero centres its (shorter) copy in the reading zone. See
         main.css --hero-min-h-home. -->
    <section class="relative min-h-[var(--hero-min-h-home)] overflow-hidden bg-ink-950 text-white">
      <!-- `sizes` is NOT 100vw, deliberately. It describes the box's WIDTH, but this box is
           object-cover and --hero-min-h-home TALL, so height is the binding dimension: the
           source must be ~boxH × 1.807 (master aspect, 2560×1417) wide before it stops being
           upscaled. At 100vw a 390px phone asked for 390px and got the w800 variant — 443px
           tall against the box, a 2.17× vertical upscale on the LCP image. 1536px selects
           w1600 (~91KB vs 31KB). xl+ hands back to 100vw, where the viewport is finally the
           binding dimension.

           The floor is now tiered (944 / 832 / 736px, was a flat 960), so the requirement
           relaxed rather than tightened — 1536px still over-delivers at every tier and no
           variant is upscaled. Left as-is: re-tuning it is a media-pipeline change (Appendix
           D) and would move LCP, which is out of scope for a layout pass. -->
      <NuxtImg
        :src="heroImage.path"
        :alt="t({ vi: 'Thi công nội thất khách sạn Lai Huy Interior', en: 'Lai Huy Interior hotel interior contracting' })"
        :width="heroImage.width"
        :height="heroImage.height"
        sizes="1536px xl:100vw"
        loading="eager"
        fetchpriority="high"
        class="hero-image hero-media absolute inset-0 h-full w-full object-cover"
      />
      <!-- Single localized scrim (rendering budget = 1) — full-width bottom-up. It now has to
           hold the CTAs (mid-section) AND the metrics band (bottom) legible, since the band sits
           inside the hero over the same photo; darker and held further up than the pre-metrics
           version, fading to clear photography in the top third. Home-only (see the metrics band
           below). See docs/hero-art-direction.md §10, Home · Inspiration. -->
      <div class="absolute inset-0 bg-linear-to-t from-wood-950/90 via-wood-950/60 via-50% to-transparent to-75%" />

      <!-- Same token as the section: if these two disagree, the shell drives the section's
           height and the floor stops applying. -->
      <div class="shell relative z-10 flex min-h-[var(--hero-min-h-home)] flex-col justify-end pb-10 pt-28 md:pb-12">
        <div class="max-w-6xl">
          <p
            v-reveal
            class="eyebrow reveal mb-6 text-wood-200"
          >
            {{ t(uiText.labels.factoryDirectContractor) }}
          </p>
          <h1
            v-reveal="90"
            class="reveal text-hero max-w-6xl font-black uppercase text-white"
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
            class="reveal mt-8 flex flex-col gap-3 sm:flex-row"
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
      </div>

      <!-- The metrics band sits INSIDE the hero section, over the same photograph, so the hero
           image spans the copy AND the metrics as one image-backed block (it used to be a
           separate solid ink-950 section directly below). Its z-10 keeps it above the scrim.

           The earlier separation existed because the band's height, rendered INSIDE the copy
           flow, changed the hero's CONTENT height and so the object-cover crop — and it did so
           by a locale-dependent ~200px at the lg boundary. This placement avoids that: the band
           is a sibling of the copy block (not inside it), the copy keeps its own fixed
           --hero-min-h-home floor, and the band's own height is IDENTICAL in both locales
           (measured: 170px desktop / 450px mobile, vi == en), so the total section height — and
           thus the crop — stays locale-invariant. tests/e2e/hero.spec.ts G2 enforces that;
           G1 (the floor binding the section) no longer applies to home, which now intentionally
           runs taller than the floor to seat the band. Home-only. -->
      <div class="shell relative z-10 pb-12">
        <HeroMetrics :metrics="heroMetrics" />
      </div>
    </section>

    <!-- Services first: "what does this company actually do" is the question a visitor arrives
         with, and it used to be answered fifth, at viewport 4.66. Orientation precedes proof. -->
    <section class="section-y bg-white">
      <div class="shell">
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

    <!-- Projects second: the proof for the claim immediately above it. Was third, starting at
         viewport 2.40 — past the point where most visitors stop scrolling. -->
    <section class="section-y bg-ink-50">
      <div class="shell">
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

        <!-- The `md:` step is load-bearing, not symmetry with the other grids: without it this
             grid is single-column from 0 to 1023px, so at 834px the three cards stacked to
             2737px — 2.5 viewports for three cards, and the single largest block on tablet. -->
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
                {{ t(categoryDefinitions[project.category].label) }}
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
                  v-if="project.area"
                  class="rounded-full border border-ink-200 px-3 py-2"
                >
                  {{ t(project.area) }}
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

    <!-- Factory capability + machinery, MERGED. They were sections 2 and 6, four apart, with
         projects and the workflow wedged between — but they are one argument: "we control
         schedule, quality and cost because we own the plant, and here is the plant." Split,
         the claim sat at the top of the page and its evidence 3,000px below it, and machinery
         alone was the LARGEST section on the homepage (1189px) while being the most granular
         content on it. Merged, the capability cards are the claim and the machinery block is
         the proof, under one heading and one boundary instead of two. -->
    <section class="section-y bg-white">
      <div class="shell">
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

        <div class="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
              {{ t(capability.value) }}
            </p>
            <p class="mt-4 text-sm leading-6 text-ink-600">
              {{ t(capability.description) }}
            </p>
          </article>
        </div>

        <!-- The evidence half. `mt-14` rather than a section boundary (176px) is the whole
             point of the merge: enough air to read as its own movement, not enough to read
             as a different subject. Headings step h2 -> h3 -> h4 so the machinery block is
             SUBORDINATE to the capability claim in the outline, not a peer of it. -->
        <div
          data-testid="homepage-machinery"
          class="mt-14"
        >
          <div class="border-l-2 border-wood-500 pl-5 sm:pl-7">
            <p
              v-reveal
              class="eyebrow reveal"
            >
              {{ t(uiText.labels.machinery) }}
            </p>
            <h3
              v-reveal="80"
              data-testid="homepage-machinery-title"
              class="reveal text-section-title mt-4 max-w-5xl font-black uppercase text-ink-950"
            >
              {{ t(machinerySectionContent.titleLead) }}
              <span class="text-wood-600">{{ t(machinerySectionContent.titleAccent) }}</span>
            </h3>
            <p
              v-reveal="140"
              data-testid="homepage-machinery-description"
              class="measure-lead reveal mt-4 text-base leading-7 text-ink-600"
            >
              {{ t(machinerySectionContent.description) }}
            </p>
          </div>

          <div
            data-testid="homepage-machinery-proof"
            class="mt-8 grid gap-4 lg:grid-cols-[minmax(0,11fr)_minmax(0,9fr)] lg:items-stretch"
          >
            <div
              v-reveal
              data-testid="homepage-machinery-image"
              class="reveal group relative aspect-[4/3] overflow-hidden rounded-2xl md:aspect-video lg:aspect-auto lg:min-h-0"
            >
              <MediaImage
                :image="siteImages.machineryOverview"
                sizes="sm:100vw md:100vw lg:55vw xl:55vw"
                class="!absolute inset-0 h-full w-full"
                img-class="object-center transition-transform duration-[1200ms] ease-out group-hover:scale-105"
              />
              <div
                data-testid="homepage-machinery-caption"
                aria-hidden="true"
                class="absolute inset-x-0 bottom-0 flex flex-col gap-1 bg-ink-950/75 px-4 py-3 text-xs font-bold uppercase tracking-[0.12em] text-white backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between"
              >
                <span>{{ t(machinerySectionContent.photoCaption) }}</span>
                <span class="text-wood-200">{{ t(machinerySectionContent.lineCaption) }}</span>
              </div>
            </div>

            <div
              data-testid="homepage-machinery-groups"
              class="grid gap-2 sm:gap-3 md:grid-cols-2 lg:h-full lg:grid-rows-2"
            >
              <article
                v-for="(group, index) in machineryProcessGroups"
                :key="group.id"
                v-reveal="(index % 2) * 80"
                data-testid="homepage-machinery-card"
                class="reveal flex min-h-0 flex-col rounded-2xl border border-ink-200 bg-ink-50 px-4 py-3 transition-colors hover:border-wood-400 sm:p-5"
              >
                <span
                  data-machinery-sequence
                  aria-hidden="true"
                  class="text-xs font-black tracking-[0.16em] text-wood-600"
                >
                  {{ formatMachinerySequence(index) }}
                </span>
                <h4 class="mt-3 text-base font-black text-ink-950">
                  {{ t(group.title) }}
                </h4>
                <p class="mt-2 text-sm leading-6 text-ink-600">
                  {{ t(group.benefit) }}
                </p>
                <p class="mt-auto border-t border-ink-200 pt-4 text-xs font-bold leading-5 text-ink-700">
                  <template
                    v-for="(machine, machineIndex) in group.machines"
                    :key="t(machine)"
                  >
                    <span>{{ t(machine) }}</span>
                    <span
                      v-if="machineIndex < group.machines.length - 1"
                      aria-hidden="true"
                    > · </span>
                  </template>
                </p>
              </article>
            </div>
          </div>

          <div class="mt-6 flex justify-start lg:justify-end">
            <NuxtLink
              data-testid="homepage-machinery-cta"
              to="/nha-xuong"
              class="btn-outline"
            >
              {{ t(uiText.cta.factory) }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Compact process summary: the complete workflow is owned by /gioi-thieu. -->
    <section class="section-y bg-ink-950 text-white">
      <div class="shell">
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
            <NuxtLink
              v-reveal="140"
              to="/gioi-thieu#production-workflow"
              class="btn-secondary reveal mt-8"
            >
              {{ t(uiText.cta.workflow) }}
              <Icon
                name="i-lucide-arrow-right"
                class="h-4 w-4"
              />
            </NuxtLink>
          </div>
          <ol class="grid gap-4 md:grid-cols-2">
            <li
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
            </li>
          </ol>
        </div>
      </div>
    </section>

    <section class="section-cta">
      <div class="shell grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <p
            v-reveal
            class="eyebrow reveal"
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
            class="measure-lead reveal mt-4 text-ink-600"
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
              class="btn-outline"
            >
              {{ t(uiText.cta.factory) }}
            </NuxtLink>
          </div>
          <div class="flex flex-col gap-2 text-sm font-semibold text-ink-600">
            <a
              :href="`mailto:${company.email}`"
              class="inline-flex items-center gap-2.5 transition-colors hover:text-ink-950"
            >
              <Icon
                name="i-lucide-mail"
                class="h-4 w-4 shrink-0 text-wood-500"
              />
              {{ company.email }}
            </a>
            <a
              :href="`tel:${company.phone.replaceAll(' ', '')}`"
              class="inline-flex items-center gap-2.5 transition-colors hover:text-ink-950"
            >
              <Icon
                name="i-lucide-phone"
                class="h-4 w-4 shrink-0 text-wood-500"
              />
              {{ company.phone }}
            </a>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
