<script setup lang="ts">
import { company } from '~/data/company'
import { productionWorkflow, qualityControl } from '~/data/factory'
import { uiText } from '~/data/ui'
import { companyMedia, workshopMedia } from '~/media/catalog.generated'
import { withAlt } from '~/media/project-media'
import type { MediaAsset, MediaImage } from '~/shared/media/types'
import type { LocalizedText } from '~/shared/types/localization'

const { t } = useLanguage()
const { resolve: mediaUrl } = useMediaUrl()

// Authentic photography only — real workshop + worker photos. Renders
// (brand/banner-home, company/about-workspace, project covers) are excluded.
const workshopByFile: Record<string, MediaAsset> = Object.fromEntries(
  workshopMedia.map(asset => [asset.path.slice(asset.path.lastIndexOf('/') + 1), asset])
)

const heroImage = withAlt(workshopByFile['3.webp'] as MediaAsset, {
  vi: 'Toàn cảnh xưởng sản xuất nội thất Lai Huy',
  en: 'Inside the Lai Huy interior manufacturing workshop'
})
const storyImage: MediaImage = {
  ...companyMedia.companyStory,
  alt: { vi: 'Đội ngũ thợ Lai Huy đang sản xuất tại xưởng', en: 'Lai Huy craftsmen at work on the production floor' }
}
const factoryImage = withAlt(workshopByFile['4.webp'] as MediaAsset, {
  vi: 'Không gian xưởng sản xuất Lai Huy', en: 'The Lai Huy workshop floor'
})
const craftImage: MediaImage = {
  ...companyMedia.companyStory,
  alt: { vi: 'Thợ Lai Huy hoàn thiện sản phẩm nội thất', en: 'A Lai Huy craftsman finishing an interior piece' }
}
const qualityImage = withAlt(workshopByFile['9.webp'] as MediaAsset, {
  vi: 'Máy khoan liên kết và dán cạnh trong xưởng', en: 'Boring and edge-banding machine in the workshop'
})
const exploreImage = withAlt(workshopByFile['5.webp'] as MediaAsset, {
  vi: 'Khu vực sản xuất nội thất Lai Huy', en: 'Lai Huy interior production area'
})

// Curated "Inside Lai Huy" gallery — a real-photo teaser; the full factory tour
// lives on /nha-xuong.
const galleryImages: MediaImage[] = [
  { ...companyMedia.companyStory, alt: { vi: 'Đội ngũ thợ đang sản xuất', en: 'Craftsmen at work' } },
  withAlt(workshopByFile['3.webp'] as MediaAsset, { vi: 'Toàn cảnh xưởng sản xuất', en: 'The production hall' }),
  withAlt(workshopByFile['1.webp'] as MediaAsset, { vi: 'Mặt tiền nhà xưởng Lai Huy', en: 'Lai Huy workshop facade' }),
  withAlt(workshopByFile['8.webp'] as MediaAsset, { vi: 'Máy CNC nesting đang vận hành', en: 'CNC nesting router on the floor' }),
  withAlt(workshopByFile['6.webp'] as MediaAsset, { vi: 'Dây chuyền máy CNC và hút bụi', en: 'CNC line with dust extraction' }),
  withAlt(workshopByFile['4.webp'] as MediaAsset, { vi: 'Không gian xưởng với cửa cuốn mở', en: 'The workshop with the roller door open' })
]

const lightboxOpen = ref(false)
const lightboxIndex = ref(0)
const openLightbox = (index: number) => {
  lightboxIndex.value = index
  lightboxOpen.value = true
}

// --- Immersive factory floating stats (verified, authored bilingually) -------
const factoryStats: { value: LocalizedText, label: LocalizedText }[] = [
  { value: { vi: '3.000 m²', en: '3,000 m²' }, label: { vi: 'Xưởng & kho', en: 'Workshop & warehouse' } },
  { value: { vi: 'Đến 50', en: 'Up to 50' }, label: { vi: 'Phòng / tháng', en: 'Rooms / month' } },
  { value: { vi: '1 đầu mối', en: 'One partner' }, label: { vi: 'Thiết kế → thi công', en: 'Design → install' } }
]

// --- Why Lai Huy — qualitative differentiators -------------------------------
const differentiators: { icon: string, title: LocalizedText, description: LocalizedText }[] = [
  {
    icon: 'i-lucide-factory',
    title: { vi: 'Xưởng sản xuất trực tiếp', en: 'In-house production' },
    description: { vi: 'Chủ động 3.000 m² xưởng — kiểm soát vật liệu, tiến độ và chất lượng ngay tại nguồn.', en: 'A directly run 3,000 m² workshop — materials, schedule and quality controlled at the source.' }
  },
  {
    icon: 'i-lucide-hard-hat',
    title: { vi: 'Đội ngũ tay nghề cao', en: 'Skilled craftsmen' },
    description: { vi: 'Thợ và kỹ thuật viên giàu kinh nghiệm, quyết định độ hoàn thiện của từng chi tiết.', en: 'Experienced makers and technicians who decide the finish of every detail.' }
  },
  {
    icon: 'i-lucide-truck',
    title: { vi: 'Thi công toàn quốc', en: 'Nationwide installation' },
    description: { vi: 'Đội lắp dựng triển khai tại công trình trên khắp cả nước.', en: 'On-site teams that install at project sites across the country.' }
  },
  {
    icon: 'i-lucide-container',
    title: { vi: 'Gia công & xuất khẩu', en: 'OEM & export' },
    description: { vi: 'Nhận sản xuất theo bản vẽ kỹ thuật và đơn hàng xuất khẩu.', en: 'Production from technical drawings and export orders.' }
  },
  {
    icon: 'i-lucide-shield-check',
    title: { vi: 'Kiểm soát chất lượng', en: 'Quality control' },
    description: { vi: 'Quy trình QC từ vật tư đầu vào đến nghiệm thu sau lắp dựng.', en: 'QC from incoming materials through post-installation sign-off.' }
  }
]

// --- Verified trust band ----------------------------------------------------
const trustStats: { icon: string, value: LocalizedText, label: LocalizedText }[] = [
  { icon: 'i-lucide-warehouse', value: { vi: '3.000 m²', en: '3,000 m²' }, label: { vi: 'Xưởng sản xuất', en: 'Own factory' } },
  { icon: 'i-lucide-gauge', value: { vi: 'Đến 50', en: 'Up to 50' }, label: { vi: 'Phòng / tháng', en: 'Rooms / month' } },
  { icon: 'i-lucide-workflow', value: { vi: 'Trọn gói', en: 'End-to-end' }, label: { vi: 'Thiết kế → thi công', en: 'Design → install' } },
  { icon: 'i-lucide-globe', value: { vi: 'Toàn quốc', en: 'Nationwide' }, label: { vi: 'Giao lắp & xuất khẩu', en: 'Delivery & export' } }
]

// --- SEO --------------------------------------------------------------------
const seoTitle = computed(() => t(company.seo.about.title))
const seoDescription = computed(() => t(company.seo.about.description))

const { public: { siteUrl } } = useRuntimeConfig()
const base = String(siteUrl).replace(/\/+$/, '')
const canonicalUrl = `${base}/gioi-thieu`

useSeoMeta({
  title: seoTitle,
  description: seoDescription,
  ogType: 'website',
  ogTitle: seoTitle,
  ogDescription: seoDescription,
  ogImage: mediaUrl(heroImage.path, { width: 1600 })
})

const structuredData = computed(() => JSON.stringify({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      '@id': `${canonicalUrl}#breadcrumb`,
      'itemListElement': [
        { '@type': 'ListItem', 'position': 1, 'name': t({ vi: 'Trang chủ', en: 'Home' }), 'item': `${base}/` },
        { '@type': 'ListItem', 'position': 2, 'name': t({ vi: 'Giới thiệu', en: 'About' }), 'item': canonicalUrl }
      ]
    },
    {
      '@type': ['Organization', 'LocalBusiness'],
      '@id': `${base}#organization`,
      'name': 'Lai Huy Interior',
      'url': `${base}/`,
      'logo': `${base}/logo.png`,
      'telephone': company.phone,
      'email': company.email,
      'sameAs': [company.facebook],
      'areaServed': t({ vi: 'Việt Nam và xuất khẩu', en: 'Vietnam and export' }),
      'address': company.addresses.map(address => ({
        '@type': 'PostalAddress',
        'name': t(address.label),
        'streetAddress': t(address.address)
      }))
    },
    {
      '@type': 'AboutPage',
      '@id': `${canonicalUrl}#about`,
      'url': canonicalUrl,
      'name': seoTitle.value,
      'description': seoDescription.value,
      'primaryImageOfPage': mediaUrl(heroImage.path, { width: 1600 }),
      'about': { '@id': `${base}#organization` },
      'mainEntity': { '@id': `${base}#organization` }
    }
  ]
}))

useHead({
  link: [{ rel: 'canonical', href: canonicalUrl }],
  script: [{ type: 'application/ld+json', innerHTML: structuredData }]
})
</script>

<template>
  <div class="bg-white">
    <!-- 1 · Hero — offset / neutral (docs/hero-art-direction.md §10, About · Trust) -->
    <AppHero
      :topic="t({ vi: 'Về Lai Huy Interior', en: 'About Lai Huy Interior' })"
      :title="t({ vi: 'Không chỉ làm đẹp không gian —', en: 'More than beautiful spaces —' })"
      :special-title="t({ vi: 'chúng tôi giải bài toán triển khai', en: 'we solve the build' })"
      :subtitle="t(company.positioning)"
      :image="heroImage"
      focal="50% 40%"
    >
      <template #actions>
        <NuxtLink
          to="/lien-he"
          class="btn-primary"
        >
          {{ t(uiText.cta.contact) }}
          <Icon
            name="i-lucide-arrow-right"
            class="h-4 w-4"
          />
        </NuxtLink>
        <NuxtLink
          to="/du-an"
          class="btn-secondary"
        >
          {{ t(uiText.cta.allProjects) }}
        </NuxtLink>
      </template>
    </AppHero>

    <!-- 2 · Who we are (split, image left) ----------------------------------->
    <section class="section-y bg-white">
      <div class="shell grid gap-12 lg:grid-cols-2 lg:items-center">
        <div
          v-reveal
          class="reveal overflow-hidden rounded-2xl"
        >
          <MediaImage
            :image="storyImage"
            preset="full"
            class="w-full"
            :style="{ aspectRatio: `${storyImage.width} / ${storyImage.height}` }"
            img-class="rounded-2xl"
          />
        </div>
        <div>
          <p
            v-reveal
            class="eyebrow reveal"
          >
            {{ t({ vi: 'Chúng tôi là ai', en: 'Who we are' }) }}
          </p>
          <h2
            v-reveal="80"
            class="reveal text-section-title mt-4 font-black uppercase text-ink-950"
          >
            {{ t({ vi: 'Một xưởng nội thất, không chỉ một studio', en: 'A workshop, not just a studio' }) }}
          </h2>
          <div class="mt-6 space-y-5 text-lg leading-8 text-ink-600">
            <p
              v-reveal="140"
              class="reveal"
            >
              {{ t({ vi: 'Trong ngành nội thất dự án, chủ đầu tư không chỉ mua hình ảnh đẹp. Họ cần năng lực quản lý, tiến độ, chất lượng và một đội ngũ xử lý được thực tế tại công trình.', en: 'In project interiors, owners are not just buying a pretty picture. They need management, schedule, quality — and a team that can handle what actually happens on site.' }) }}
            </p>
            <p
              v-reveal="200"
              class="reveal"
            >
              {{ t(company.shortPositioning) }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- 3 · Philosophy (centered + value cards) ------------------------------>
    <section class="section-y bg-ink-50">
      <div class="shell">
        <div class="mx-auto mb-12 max-w-2xl text-center">
          <p
            v-reveal
            class="eyebrow reveal"
          >
            {{ t({ vi: 'Triết lý làm việc', en: 'Our philosophy' }) }}
          </p>
          <h2
            v-reveal="80"
            class="reveal text-section-title mt-4 font-black uppercase text-ink-950"
          >
            {{ t({ vi: 'Điều Lai Huy tập trung trong từng dự án', en: 'What we focus on, every project' }) }}
          </h2>
        </div>

        <div
          v-if="company.mission || company.vision"
          class="mx-auto mb-12 grid max-w-4xl gap-4 sm:grid-cols-2"
        >
          <div
            v-if="company.mission"
            v-reveal
            class="reveal rounded-2xl border border-ink-200 bg-white p-6"
          >
            <p class="eyebrow">
              {{ t({ vi: 'Sứ mệnh', en: 'Mission' }) }}
            </p>
            <p class="mt-3 text-lg leading-8 text-ink-700">
              {{ t(company.mission) }}
            </p>
          </div>
          <div
            v-if="company.vision"
            v-reveal="80"
            class="reveal rounded-2xl border border-ink-200 bg-white p-6"
          >
            <p class="eyebrow">
              {{ t({ vi: 'Tầm nhìn', en: 'Vision' }) }}
            </p>
            <p class="mt-3 text-lg leading-8 text-ink-700">
              {{ t(company.vision) }}
            </p>
          </div>
        </div>

        <div class="grid gap-5 md:grid-cols-3">
          <article
            v-for="(value, index) in company.coreValues"
            :key="t(value.title)"
            v-reveal="index * 90"
            class="industrial-card reveal"
          >
            <Icon
              :name="value.icon"
              class="h-8 w-8 text-wood-500"
            />
            <h3 class="mt-6 text-xl font-black text-ink-950">
              {{ t(value.title) }}
            </h3>
            <p class="mt-3 text-sm leading-6 text-ink-600">
              {{ t(value.description) }}
            </p>
          </article>
        </div>
      </div>
    </section>

    <!-- 4 · Our journey (timeline — horizontal desktop / vertical mobile) ----->
    <section
      v-if="company.milestones.length"
      class="section-y bg-white"
    >
      <div class="shell">
        <div class="mb-12 max-w-2xl">
          <p
            v-reveal
            class="eyebrow reveal"
          >
            {{ t({ vi: 'Hành trình', en: 'Our journey' }) }}
          </p>
          <h2
            v-reveal="80"
            class="reveal text-section-title mt-4 font-black uppercase text-ink-950"
          >
            {{ t({ vi: 'Những dấu mốc của Lai Huy', en: 'The Lai Huy milestones' }) }}
          </h2>
        </div>
        <ol class="grid gap-10 lg:grid-flow-col lg:auto-cols-fr lg:gap-0">
          <li
            v-for="(milestone, index) in company.milestones"
            :key="milestone.year"
            v-reveal="index * 90"
            class="reveal relative border-l border-ink-200 pl-8 lg:border-l-0 lg:border-t lg:pl-0 lg:pr-6 lg:pt-8"
          >
            <span class="absolute left-0 top-1 h-3 w-3 -translate-x-1/2 rounded-full bg-wood-500 lg:top-0 lg:translate-x-0 lg:-translate-y-1/2" />
            <p class="text-sm font-black text-wood-600">
              {{ milestone.year }}
            </p>
            <h3 class="mt-2 text-lg font-black text-ink-950">
              {{ t(milestone.title) }}
            </h3>
            <p
              v-if="milestone.description"
              class="mt-2 text-sm leading-6 text-ink-600"
            >
              {{ t(milestone.description) }}
            </p>
          </li>
        </ol>
      </div>
    </section>

    <!-- 5 · Founder (image-first — conditional) ------------------------------>
    <section
      v-if="company.founder"
      class="section-y bg-ink-50"
    >
      <div class="shell grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div
          v-if="company.founder.portrait"
          v-reveal
          class="reveal overflow-hidden rounded-2xl"
        >
          <NuxtImg
            :src="company.founder.portrait"
            :alt="company.founder.name"
            sizes="sm:100vw lg:45vw"
            loading="lazy"
            class="aspect-[4/5] w-full rounded-2xl object-cover"
          />
        </div>
        <div>
          <p
            v-reveal
            class="eyebrow reveal"
          >
            {{ t({ vi: 'Người sáng lập', en: 'Founder' }) }}
          </p>
          <blockquote
            v-if="company.founder.quote"
            v-reveal="80"
            class="reveal mt-4 text-2xl font-black leading-snug text-ink-950 md:text-3xl"
          >
            “{{ t(company.founder.quote) }}”
          </blockquote>
          <p
            v-reveal="140"
            class="reveal mt-6 text-lg leading-8 text-ink-600"
          >
            {{ t(company.founder.story) }}
          </p>
          <p class="mt-6 text-base font-black text-ink-950">
            {{ company.founder.name }}
            <span class="font-semibold text-ink-500">· {{ t(company.founder.role) }}</span>
          </p>
        </div>
      </div>
    </section>

    <!-- 6 · Inside the factory (immersive full-width + floating stats) -------->
    <section class="relative overflow-hidden bg-ink-950 text-white">
      <NuxtImg
        :src="factoryImage.path"
        :alt="t(factoryImage.alt)"
        :width="factoryImage.width"
        :height="factoryImage.height"
        sizes="sm:100vw md:100vw lg:100vw xl:100vw"
        loading="lazy"
        class="absolute inset-0 h-full w-full object-cover"
      />
      <div class="absolute inset-0 bg-ink-950/70" />
      <div class="shell relative z-10 py-24 md:py-32">
        <div class="max-w-2xl">
          <p
            v-reveal
            class="eyebrow reveal text-wood-300"
          >
            {{ t({ vi: 'Nhà xưởng của chúng tôi', en: 'Inside our factory' }) }}
          </p>
          <h2
            v-reveal="80"
            class="reveal text-section-title mt-4 font-black uppercase"
          >
            {{ t({ vi: 'Năng lực thật, kiểm soát tận gốc', en: 'Real capability, controlled at the source' }) }}
          </h2>
          <p
            v-reveal="140"
            class="reveal mt-5 text-lg leading-8 text-white/76"
          >
            {{ t({ vi: 'Toàn bộ được sản xuất tại xưởng trực tiếp của Lai Huy — nơi vật liệu, máy móc và tay nghề cùng nằm dưới một mái nhà.', en: 'Everything is made at Lai Huy’s own workshop — where materials, machinery and craft sit under one roof.' }) }}
          </p>
        </div>

        <div class="mt-10 grid gap-4 sm:grid-cols-3 lg:max-w-3xl">
          <div
            v-for="(stat, index) in factoryStats"
            :key="t(stat.label)"
            v-reveal="index * 90"
            class="reveal rounded-2xl border border-white/12 bg-white/[0.06] p-6 backdrop-blur-sm"
          >
            <p class="text-3xl font-black text-white">
              {{ t(stat.value) }}
            </p>
            <p class="mt-1 text-sm font-bold uppercase tracking-[0.14em] text-wood-200">
              {{ t(stat.label) }}
            </p>
          </div>
        </div>

        <NuxtLink
          v-reveal="120"
          to="/nha-xuong"
          class="btn-primary reveal mt-8"
        >
          {{ t(uiText.cta.factory) }}
          <Icon
            name="i-lucide-arrow-right"
            class="h-4 w-4"
          />
        </NuxtLink>
      </div>
    </section>

    <!-- 7 · Craftsmanship (split, image right) ------------------------------->
    <section class="section-y bg-white">
      <div class="shell grid gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <p
            v-reveal
            class="eyebrow reveal"
          >
            {{ t({ vi: 'Tay nghề', en: 'Craftsmanship' }) }}
          </p>
          <h2
            v-reveal="80"
            class="reveal text-section-title mt-4 font-black uppercase text-ink-950"
          >
            {{ t({ vi: 'Con người đứng sau từng chi tiết', en: 'The people behind every detail' }) }}
          </h2>
          <p
            v-reveal="140"
            class="reveal mt-6 text-lg leading-8 text-ink-600"
          >
            {{ t({ vi: 'Máy móc tạo ra độ chính xác, nhưng chính đội ngũ thợ và kỹ thuật viên giàu kinh nghiệm mới quyết định độ hoàn thiện cuối cùng — từ ghép nối, xử lý bề mặt đến lắp dựng tại công trình.', en: 'Machines create precision, but it is our experienced makers and technicians who decide the final finish — from joinery and surface work to on-site installation.' }) }}
          </p>
        </div>
        <div
          v-reveal="120"
          class="reveal overflow-hidden rounded-2xl"
        >
          <MediaImage
            :image="craftImage"
            preset="full"
            class="w-full"
            :style="{ aspectRatio: `${craftImage.width} / ${craftImage.height}` }"
            img-class="rounded-2xl"
          />
        </div>
      </div>
    </section>

    <!-- 8 · How we work (stepped process) ------------------------------------>
    <section class="section-y bg-ink-50">
      <div class="shell">
        <div class="mb-12 max-w-2xl">
          <p
            v-reveal
            class="eyebrow reveal"
          >
            {{ t(uiText.labels.productionWorkflow) }}
          </p>
          <h2
            v-reveal="80"
            class="reveal text-section-title mt-4 font-black uppercase text-ink-950"
          >
            {{ t({ vi: 'Từ bản vẽ đến bàn giao công trình', en: 'From drawings to project handover' }) }}
          </h2>
        </div>
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <article
            v-for="(step, index) in productionWorkflow"
            :key="t(step.title)"
            v-reveal="(index % 3) * 80"
            class="reveal rounded-2xl border border-ink-200 bg-white p-6"
          >
            <span class="text-sm font-black text-wood-500">
              {{ String(index + 1).padStart(2, '0') }}
            </span>
            <h3 class="mt-4 text-lg font-black text-ink-950">
              {{ t(step.title) }}
            </h3>
            <p class="mt-2 text-sm leading-6 text-ink-600">
              {{ t(step.description) }}
            </p>
          </article>
        </div>
      </div>
    </section>

    <!-- 9 · Quality commitment (dark split + checklist) ---------------------->
    <section class="section-y bg-ink-950 text-white">
      <div class="shell grid gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <p
            v-reveal
            class="eyebrow reveal text-wood-300"
          >
            {{ t(uiText.labels.qualityControl) }}
          </p>
          <h2
            v-reveal="80"
            class="reveal text-section-title mt-4 font-black uppercase"
          >
            {{ t({ vi: 'Quy trình giúp dự án không phụ thuộc may rủi', en: 'A process that leaves nothing to chance' }) }}
          </h2>
          <ul class="mt-8 space-y-4">
            <li
              v-for="(item, index) in qualityControl"
              :key="item"
              v-reveal="index * 70"
              class="reveal flex gap-3 border-b border-white/12 pb-4 text-base font-semibold leading-7 text-white/76"
            >
              <Icon
                name="i-lucide-circle-check-big"
                class="mt-1 h-5 w-5 shrink-0 text-wood-300"
              />
              <span>{{ item }}</span>
            </li>
          </ul>
        </div>
        <div
          v-reveal="120"
          class="reveal overflow-hidden rounded-2xl"
        >
          <MediaImage
            :image="qualityImage"
            preset="full"
            class="w-full"
            :style="{ aspectRatio: `${qualityImage.width} / ${qualityImage.height}` }"
            img-class="rounded-2xl"
          />
        </div>
      </div>
    </section>

    <!-- 10 · Why Lai Huy (differentiator cards) ------------------------------>
    <section class="section-y bg-white">
      <div class="shell">
        <div class="mb-12 max-w-2xl">
          <p
            v-reveal
            class="eyebrow reveal"
          >
            {{ t({ vi: 'Vì sao chọn Lai Huy', en: 'Why Lai Huy' }) }}
          </p>
          <h2
            v-reveal="80"
            class="reveal text-section-title mt-4 font-black uppercase text-ink-950"
          >
            {{ t({ vi: 'Những điều làm nên khác biệt', en: 'What sets us apart' }) }}
          </h2>
        </div>
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <article
            v-for="(item, index) in differentiators"
            :key="t(item.title)"
            v-reveal="(index % 3) * 80"
            class="reveal flex gap-4 rounded-2xl border border-ink-200 p-6 transition-colors hover:border-wood-400"
          >
            <Icon
              :name="item.icon"
              class="h-8 w-8 shrink-0 text-wood-500"
            />
            <div>
              <h3 class="text-lg font-black text-ink-950">
                {{ t(item.title) }}
              </h3>
              <p class="mt-2 text-sm leading-6 text-ink-600">
                {{ t(item.description) }}
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- 11 · Trust band (stat strip) ----------------------------------------->
    <section class="bg-ink-950 text-white">
      <div class="shell grid gap-4 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div
          v-for="stat in trustStats"
          :key="t(stat.label)"
          class="flex items-center gap-4"
        >
          <Icon
            :name="stat.icon"
            class="h-9 w-9 shrink-0 text-wood-300"
          />
          <div>
            <p class="text-xl font-black text-white">
              {{ t(stat.value) }}
            </p>
            <p class="text-xs font-bold uppercase tracking-[0.14em] text-white/55">
              {{ t(stat.label) }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- 12 · People (portrait grid — conditional) ---------------------------->
    <section
      v-if="company.team.length"
      class="section-y bg-ink-50"
    >
      <div class="shell">
        <div class="mb-12 max-w-2xl">
          <p
            v-reveal
            class="eyebrow reveal"
          >
            {{ t({ vi: 'Đội ngũ', en: 'Our people' }) }}
          </p>
          <h2
            v-reveal="80"
            class="reveal text-section-title mt-4 font-black uppercase text-ink-950"
          >
            {{ t({ vi: 'Những người làm nên Lai Huy', en: 'The team behind Lai Huy' }) }}
          </h2>
        </div>
        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <article
            v-for="(member, index) in company.team"
            :key="member.name"
            v-reveal="(index % 4) * 80"
            class="reveal overflow-hidden rounded-2xl bg-white"
          >
            <NuxtImg
              :src="member.photo"
              :alt="member.name"
              sizes="sm:50vw lg:25vw"
              loading="lazy"
              class="aspect-[4/5] w-full object-cover"
            />
            <div class="border border-t-0 border-ink-200 p-5">
              <h3 class="text-base font-black text-ink-950">
                {{ member.name }}
              </h3>
              <p class="mt-1 text-sm text-ink-500">
                {{ t(member.role) }}
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- 13 · Inside Lai Huy gallery (curated real photos + lightbox) --------->
    <section class="section-y bg-white">
      <div class="shell">
        <div class="mb-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div class="max-w-2xl">
            <p
              v-reveal
              class="eyebrow reveal"
            >
              {{ t({ vi: 'Bên trong Lai Huy', en: 'Inside Lai Huy' }) }}
            </p>
            <h2
              v-reveal="80"
              class="reveal text-section-title mt-4 font-black uppercase text-ink-950"
            >
              {{ t({ vi: 'Hình ảnh thật từ xưởng của chúng tôi', en: 'Real photographs from our floor' }) }}
            </h2>
          </div>
          <NuxtLink
            v-reveal="120"
            to="/nha-xuong"
            class="btn-outline reveal w-fit"
          >
            {{ t(uiText.cta.factory) }}
          </NuxtLink>
        </div>
        <AppGalleryGrid
          :images="galleryImages"
          selectable
          @select="openLightbox"
        />
      </div>
    </section>

    <!-- 14 · Explore our work (editorial image + link) ----------------------->
    <section class="section-y bg-ink-50">
      <div class="shell grid gap-10 lg:grid-cols-2 lg:items-center">
        <div
          v-reveal
          class="reveal group overflow-hidden rounded-2xl"
        >
          <MediaImage
            :image="exploreImage"
            preset="full"
            class="aspect-[16/10] w-full"
            img-class="rounded-2xl transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </div>
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
            {{ t({ vi: 'Xem những gì chúng tôi đã làm', en: 'See what we have built' }) }}
          </h2>
          <p
            v-reveal="140"
            class="reveal mt-5 text-lg leading-8 text-ink-600"
          >
            {{ t({ vi: 'Từ khách sạn và villa đến căn hộ và văn phòng — mỗi dự án là một minh chứng cho năng lực sản xuất và thi công của Lai Huy.', en: 'From hotels and villas to apartments and offices — each project is proof of what Lai Huy can produce and build.' }) }}
          </p>
          <NuxtLink
            v-reveal="200"
            to="/du-an"
            class="btn-dark reveal mt-8"
          >
            {{ t(uiText.cta.allProjects) }}
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- 15 · Testimonials (conditional) -------------------------------------->
    <section
      v-if="company.testimonials.length"
      class="section-y bg-white"
    >
      <div class="shell">
        <div class="mb-12 max-w-2xl">
          <p class="eyebrow">
            {{ t({ vi: 'Khách hàng nói gì', en: 'What clients say' }) }}
          </p>
        </div>
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <blockquote
            v-for="(testimonial, index) in company.testimonials"
            :key="t(testimonial.author)"
            v-reveal="(index % 3) * 90"
            class="reveal rounded-2xl border border-ink-200 bg-ink-50 p-6"
          >
            <Icon
              name="i-lucide-quote"
              class="h-7 w-7 text-wood-400"
            />
            <p class="mt-4 text-base leading-7 text-ink-800">
              “{{ t(testimonial.quote) }}”
            </p>
            <footer class="mt-5 text-sm font-black text-ink-950">
              {{ t(testimonial.author) }}
              <span
                v-if="testimonial.role"
                class="font-semibold text-ink-500"
              >· {{ t(testimonial.role) }}</span>
            </footer>
          </blockquote>
        </div>
      </div>
    </section>

    <!-- 16 · Closing CTA ----------------------------------------------------->
    <section class="bg-ink-950 py-20 text-white">
      <div class="shell text-center">
        <p class="eyebrow text-wood-300">
          {{ t({ vi: 'Bắt đầu cùng Lai Huy', en: 'Start with Lai Huy' }) }}
        </p>
        <h2 class="mx-auto mt-4 max-w-3xl text-3xl font-black uppercase leading-tight md:text-5xl">
          {{ t({ vi: 'Cùng kiến tạo một không gian bền vững', en: 'Let’s build something that lasts' }) }}
        </h2>
        <p class="mx-auto mt-5 max-w-2xl text-lg text-white/72">
          {{ t({ vi: 'Gửi bản vẽ hoặc ý tưởng của bạn — đội ngũ Lai Huy sẽ tư vấn phương án sản xuất và thi công phù hợp.', en: 'Send your drawings or ideas — the Lai Huy team will advise on the right production and delivery plan.' }) }}
        </p>
        <div class="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <NuxtLink
            to="/lien-he"
            class="btn-primary"
          >
            {{ t(uiText.cta.quote24h) }}
          </NuxtLink>
          <a
            :href="`tel:${company.phone.replaceAll(' ', '')}`"
            class="btn-secondary"
          >
            {{ company.phone }}
          </a>
        </div>
      </div>
    </section>

    <GalleryLightbox
      :images="galleryImages"
      :index="lightboxIndex"
      :open="lightboxOpen"
      @close="lightboxOpen = false"
      @update:index="lightboxIndex = $event"
    />
  </div>
</template>
