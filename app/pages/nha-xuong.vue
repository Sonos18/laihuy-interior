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

// Lookup workshop photos by filename so section assignments stay readable and are
// not tied to array position. Every value is a real photograph of the Lai Huy
// facility — no renders or stock imagery on this page.
const workshopByFile: Record<string, MediaAsset> = Object.fromEntries(
  workshopMedia.map(asset => [asset.path.slice(asset.path.lastIndexOf('/') + 1), asset])
)

const heroImage = withAlt(workshopByFile['4.webp'] as MediaAsset, {
  vi: 'Xưởng sản xuất nội thất Lai Huy nhìn từ bên trong',
  en: 'Inside the Lai Huy interior manufacturing workshop'
})

const facadeImage = withAlt(workshopByFile['1.webp'] as MediaAsset, {
  vi: 'Biển hiệu nhà xưởng Lai Huy Interior',
  en: 'Lai Huy Interior workshop signage'
})

const craftImage: MediaImage = {
  ...companyMedia.companyStory,
  alt: {
    vi: 'Đội ngũ thợ Lai Huy đang sản xuất tại xưởng',
    en: 'Lai Huy craftsmen at work on the production floor'
  }
}

const qualityImage = withAlt(workshopByFile['5.webp'] as MediaAsset, {
  vi: 'Khu vực máy dán cạnh và hệ thống hút bụi trong xưởng',
  en: 'Edge-banding and dust-extraction line inside the workshop'
})

// --- Why our factory -------------------------------------------------------
const strengths: { icon: string, title: LocalizedText, description: LocalizedText }[] = [
  {
    icon: 'i-lucide-factory',
    title: { vi: 'Xưởng sản xuất trực tiếp', en: 'Our own factory' },
    description: {
      vi: 'Chủ động 3.000 m² xưởng và kho — kiểm soát vật liệu, tiến độ và chất lượng ngay tại nguồn.',
      en: 'A directly owned 3,000 m² workshop and warehouse — materials, schedule and quality controlled at the source.'
    }
  },
  {
    icon: 'i-lucide-cpu',
    title: { vi: 'Máy móc hiện đại', en: 'Modern machinery' },
    description: {
      vi: 'Hệ CNC nesting, khoan liên kết, dán cạnh, cưa trượt và chà nhám đồng bộ cho độ chính xác cao.',
      en: 'A synchronised line of CNC nesting, boring, edge-banding, panel saw and sanding for high precision.'
    }
  },
  {
    icon: 'i-lucide-hard-hat',
    title: { vi: 'Đội ngũ tay nghề cao', en: 'Skilled craftsmen' },
    description: {
      vi: 'Thợ và kỹ thuật viên giàu kinh nghiệm, phối hợp từ bóc tách bản vẽ đến hoàn thiện tại công trình.',
      en: 'Experienced makers and technicians who carry a project from shop-drawing breakdown to on-site finishing.'
    }
  },
  {
    icon: 'i-lucide-shield-check',
    title: { vi: 'Kiểm soát chất lượng', en: 'Strict quality control' },
    description: {
      vi: 'Quy trình QC từ vật tư đầu vào đến nghiệm thu, giảm sai lệch giữa bản vẽ và thực tế.',
      en: 'QC from incoming materials to handover, closing the gap between drawings and the finished result.'
    }
  }
]

// --- Equipment (benefit-led) ----------------------------------------------
const equipment: {
  image: MediaImage
  icon: string
  machine: LocalizedText
  title: LocalizedText
  description: LocalizedText
}[] = [
  {
    image: withAlt(workshopByFile['8.webp'] as MediaAsset, { vi: 'Máy CNC nesting', en: 'CNC nesting router' }),
    icon: 'i-lucide-scan-line',
    machine: { vi: 'Máy CNC Nesting', en: 'CNC nesting' },
    title: { vi: 'Độ chính xác từng milimet', en: 'Millimetre precision' },
    description: {
      vi: 'Cắt và khoan theo đúng bản vẽ kỹ thuật, giảm sai số và tối ưu vật liệu cho từng tấm.',
      en: 'Cuts and drills to the exact shop drawing — tight tolerances and optimised material yield on every sheet.'
    }
  },
  {
    image: withAlt(workshopByFile['9.webp'] as MediaAsset, { vi: 'Máy khoan liên kết và dán cạnh', en: 'Boring and edge-banding machine' }),
    icon: 'i-lucide-layers',
    machine: { vi: 'Khoan liên kết & dán cạnh', en: 'Boring & edge-banding' },
    title: { vi: 'Đồng bộ và bền đẹp', en: 'Consistent, durable finishing' },
    description: {
      vi: 'Cạnh ván và lỗ liên kết đồng đều giúp sản phẩm lắp ráp khít, bền và thẩm mỹ trên số lượng lớn.',
      en: 'Uniform edges and joinery holes mean parts assemble tightly and stay beautiful — repeatably, at volume.'
    }
  },
  {
    image: withAlt(workshopByFile['11.webp'] as MediaAsset, { vi: 'Cưa bàn trượt Wood Mac', en: 'Wood Mac sliding table saw' }),
    icon: 'i-lucide-gauge',
    machine: { vi: 'Cưa bàn trượt', en: 'Sliding table saw' },
    title: { vi: 'Tiến độ nhanh và ổn định', en: 'Faster, steadier throughput' },
    description: {
      vi: 'Quy trình cắt – khoan – dán cạnh – ép được đồng bộ, giữ tiến độ ổn định cho các dự án lớn.',
      en: 'A synchronised cut–drill–edge-band–press flow keeps large projects moving on a predictable schedule.'
    }
  },
  {
    image: withAlt(workshopByFile['7.webp'] as MediaAsset, { vi: 'Máy chà nhám thùng', en: 'Wide-belt sander' }),
    icon: 'i-lucide-sparkles',
    machine: { vi: 'Máy chà nhám thùng', en: 'Wide-belt sander' },
    title: { vi: 'Bề mặt hoàn thiện cao cấp', en: 'Premium finished surfaces' },
    description: {
      vi: 'Chà nhám đồng đều tạo bề mặt phẳng mịn, sẵn sàng cho sơn phủ và hoàn thiện chất lượng cao.',
      en: 'Even sanding delivers flat, smooth surfaces ready for high-quality coating and finishing.'
    }
  }
]

// --- Production capacity ----------------------------------------------------
const capacityStats: { icon: string, value: LocalizedText, label: LocalizedText, description: LocalizedText }[] = [
  {
    icon: 'i-lucide-warehouse',
    value: { vi: '3.000 m²', en: '3,000 m²' },
    label: { vi: 'Xưởng & kho', en: 'Workshop & warehouse' },
    description: { vi: 'Không gian sản xuất trực tiếp cho đồ gỗ công nghiệp và hạng mục nội thất dự án.', en: 'Direct production space for panel furniture and project interior packages.' }
  },
  {
    icon: 'i-lucide-gauge',
    value: { vi: 'Đến 50', en: 'Up to 50' },
    label: { vi: 'Phòng / tháng', en: 'Rooms / month' },
    description: { vi: 'Năng lực ổn định cho khách sạn, căn hộ dịch vụ và villa cần tiến độ đều đặn.', en: 'Steady capacity for hotels, serviced apartments and villas that need reliable output.' }
  },
  {
    icon: 'i-lucide-workflow',
    value: { vi: 'Trọn gói', en: 'End-to-end' },
    label: { vi: 'Thiết kế → thi công', en: 'Design → install' },
    description: { vi: 'Thiết kế, kỹ thuật, sản xuất, QC và lắp dựng phối hợp trong một đầu mối.', en: 'Design, engineering, production, QC and installation coordinated under one roof.' }
  },
  {
    icon: 'i-lucide-globe',
    value: { vi: 'Toàn quốc', en: 'Nationwide' },
    label: { vi: 'Giao lắp & xuất khẩu', en: 'Delivery & export' },
    description: { vi: 'Giao và lắp đặt trên toàn quốc, đồng thời nhận đơn hàng gia công xuất khẩu.', en: 'Delivery and installation across the country, plus export production orders.' }
  }
]

// --- FAQ (real customer questions) -----------------------------------------
const faqs: { question: LocalizedText, answer: LocalizedText }[] = [
  {
    question: { vi: 'Tôi có thể đến tham quan nhà xưởng không?', en: 'Can I visit the factory?' },
    answer: {
      vi: 'Được. Chúng tôi luôn chào đón chủ đầu tư và đối tác đến tham quan trực tiếp xưởng sản xuất 3.000 m². Vui lòng liên hệ trước để được sắp xếp lịch.',
      en: 'Yes. We welcome owners and partners to tour our 3,000 m² workshop in person — just contact us in advance to arrange a visit.'
    }
  },
  {
    question: { vi: 'Lai Huy có nhận sản xuất theo thiết kế / bản vẽ riêng không?', en: 'Do you manufacture to our own design or drawings?' },
    answer: {
      vi: 'Có. Chúng tôi sản xuất theo hồ sơ thiết kế và bản vẽ kỹ thuật của bạn (gia công theo bản vẽ / OEM), đồng thời bóc tách và triển khai shop drawing để đưa vào sản xuất.',
      en: 'Yes. We produce from your design and technical drawings (make-to-drawing / OEM) and prepare the shop drawings needed to move a project into production.'
    }
  },
  {
    question: { vi: 'Thời gian sản xuất mất bao lâu?', en: 'How long does production take?' },
    answer: {
      vi: 'Tùy quy mô và hạng mục. Năng lực xưởng đạt tới khoảng 50 phòng khách sạn/tháng; tiến độ cụ thể được xác nhận sau khi rà soát bản vẽ và BOQ.',
      en: 'It depends on scope. Our capacity reaches up to about 50 hotel rooms per month; the exact schedule is confirmed after we review your drawings and BOQ.'
    }
  },
  {
    question: { vi: 'Có thi công lắp đặt toàn quốc không?', en: 'Do you install nationwide?' },
    answer: {
      vi: 'Có. Đội thi công của Lai Huy triển khai lắp đặt tại công trình trên toàn quốc, đồng thời nhận cả đơn hàng gia công xuất khẩu.',
      en: 'Yes. Our on-site teams handle installation at project sites nationwide, and we also take export production orders.'
    }
  },
  {
    question: { vi: 'Vật liệu sử dụng là gì?', en: 'What materials do you use?' },
    answer: {
      vi: 'Chúng tôi làm việc với các vật liệu nội thất phổ biến cho dự án (ván công nghiệp lõi MDF/plywood, veneer, laminate, acrylic, sơn…) và kiểm tra vật tư đầu vào theo chủng loại, màu sắc và tiêu chuẩn dự án trước khi sản xuất.',
      en: 'We work with standard project-grade interior materials (MDF/plywood cores, veneer, laminate, acrylic, lacquer and more) and inspect every incoming batch for type, colour and project standard before production.'
    }
  },
  {
    question: { vi: 'Sản phẩm có được bảo hành không?', en: 'Is your work covered by a warranty?' },
    answer: {
      vi: 'Có. Chúng tôi cam kết chất lượng sản phẩm; điều khoản bảo hành cụ thể được thống nhất theo từng hợp đồng và phạm vi dự án — vui lòng liên hệ để được tư vấn chi tiết.',
      en: 'Yes. We stand behind our work; specific warranty terms are agreed per contract and project scope — contact us for the details that apply to your project.'
    }
  }
]

// --- Factory-tour gallery ---------------------------------------------------
type GalleryCategory = 'factory' | 'equipment'
type GalleryItem = MediaImage & { category: GalleryCategory }

const galleryConfig: { file: string, category: GalleryCategory, alt: LocalizedText }[] = [
  { file: '3.webp', category: 'factory', alt: { vi: 'Toàn cảnh xưởng sản xuất nội thất Lai Huy', en: 'Wide view of the Lai Huy production hall' } },
  { file: '8.webp', category: 'equipment', alt: { vi: 'Máy CNC nesting đang vận hành', en: 'CNC nesting router on the floor' } },
  { file: '1.webp', category: 'factory', alt: { vi: 'Biển hiệu Lai Huy Interior trên mặt tiền nhà xưởng', en: 'Lai Huy Interior sign on the workshop facade' } },
  { file: '6.webp', category: 'equipment', alt: { vi: 'Dây chuyền máy CNC và hệ thống hút bụi', en: 'CNC line with dust-extraction system' } },
  { file: '5.webp', category: 'factory', alt: { vi: 'Khu vực máy dán cạnh trong xưởng', en: 'Edge-banding area inside the workshop' } },
  { file: '9.webp', category: 'equipment', alt: { vi: 'Máy khoan liên kết và dán cạnh', en: 'Boring and edge-banding machine' } },
  { file: '2.webp', category: 'factory', alt: { vi: 'Mặt tiền và địa chỉ nhà xưởng Lai Huy', en: 'Lai Huy workshop facade and address' } },
  { file: '7.webp', category: 'equipment', alt: { vi: 'Máy chà nhám thùng MB635', en: 'MB635 wide-belt sander' } },
  { file: '4.webp', category: 'factory', alt: { vi: 'Không gian xưởng với cửa cuốn mở', en: 'Workshop hall with the roller door open' } },
  { file: '10.webp', category: 'equipment', alt: { vi: 'Máy CNC router và hệ thống ống hút bụi', en: 'CNC router and dust-extraction ducting' } },
  { file: '11.webp', category: 'equipment', alt: { vi: 'Cưa bàn trượt Wood Mac', en: 'Wood Mac sliding table saw' } }
]

const galleryItems: GalleryItem[] = galleryConfig.map(item => ({
  ...withAlt(workshopByFile[item.file] as MediaAsset, item.alt),
  category: item.category
}))

const galleryFilters: { value: 'all' | GalleryCategory, label: LocalizedText }[] = [
  { value: 'all', label: { vi: 'Tất cả', en: 'All' } },
  { value: 'factory', label: { vi: 'Nhà xưởng', en: 'Factory' } },
  { value: 'equipment', label: { vi: 'Máy móc', en: 'Equipment' } }
]

const activeFilter = ref<'all' | GalleryCategory>('all')

const filteredImages = computed<GalleryItem[]>(() =>
  activeFilter.value === 'all'
    ? galleryItems
    : galleryItems.filter(image => image.category === activeFilter.value)
)

const countFor = (value: 'all' | GalleryCategory) =>
  value === 'all' ? galleryItems.length : galleryItems.filter(image => image.category === value).length

const lightboxOpen = ref(false)
const lightboxIndex = ref(0)

const openLightbox = (index: number) => {
  lightboxIndex.value = index
  lightboxOpen.value = true
}

watch(activeFilter, () => {
  lightboxOpen.value = false
})

// --- SEO --------------------------------------------------------------------
const seoTitle = computed(() => t(company.seo.factory.title))
const seoDescription = computed(() => t(company.seo.factory.description))

useSeoMeta({
  title: seoTitle,
  description: seoDescription,
  ogTitle: seoTitle,
  ogDescription: seoDescription,
  // Authentic workshop photo for social cards (not the design render used before).
  ogImage: computed(() => mediaUrl(heroImage.path, { width: 1600 }))
})

const { public: { siteUrl } } = useRuntimeConfig()
const canonicalUrl = `${String(siteUrl).replace(/\/+$/, '')}/nha-xuong`

const breadcrumbLd = computed(() => JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  'itemListElement': [
    { '@type': 'ListItem', 'position': 1, 'name': t({ vi: 'Trang chủ', en: 'Home' }), 'item': `${String(siteUrl).replace(/\/+$/, '')}/` },
    { '@type': 'ListItem', 'position': 2, 'name': t({ vi: 'Nhà xưởng', en: 'Factory' }), 'item': canonicalUrl }
  ]
}))

const faqLd = computed(() => JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  'mainEntity': faqs.map(faq => ({
    '@type': 'Question',
    'name': t(faq.question),
    'acceptedAnswer': { '@type': 'Answer', 'text': t(faq.answer) }
  }))
}))

useHead({
  link: [{ rel: 'canonical', href: canonicalUrl }],
  script: [
    { type: 'application/ld+json', innerHTML: breadcrumbLd },
    { type: 'application/ld+json', innerHTML: faqLd }
  ]
})
</script>

<template>
  <div>
    <!-- 1 · Hero ------------------------------------------------------------->
    <section class="relative flex min-h-screen items-end overflow-hidden bg-ink-950 text-white">
      <NuxtImg
        :src="heroImage.path"
        :alt="t(heroImage.alt)"
        :width="heroImage.width"
        :height="heroImage.height"
        sizes="sm:100vw md:100vw lg:100vw xl:100vw"
        loading="eager"
        fetchpriority="high"
        class="hero-image absolute inset-0 h-full w-full object-cover"
      />
      <div class="absolute inset-0 bg-linear-to-t from-ink-950/92 from-10% via-ink-950/55 to-ink-950/35" />
      <div class="absolute inset-0 bg-linear-to-r from-ink-950/70 via-transparent to-transparent" />

      <div class="section-shell relative z-10 w-full px-6 pb-16 pt-36 md:pb-24 md:pt-44">
        <p
          v-reveal
          class="eyebrow reveal mb-5 text-wood-300"
        >
          {{ t({ vi: 'Năng lực nhà xưởng', en: 'Factory capability' }) }}
        </p>
        <h1
          v-reveal="80"
          class="reveal text-hero max-w-4xl font-black uppercase text-white"
        >
          {{ t({ vi: 'Nơi bản vẽ trở thành', en: 'Where drawings become' }) }}
          <span class="text-wood-300">{{ t({ vi: 'sản phẩm thật', en: 'the real thing' }) }}</span>
        </h1>
        <p
          v-reveal="150"
          class="reveal text-lead mt-6 max-w-2xl text-white/80"
        >
          {{ t({ vi: 'Xưởng sản xuất trực tiếp 3.000 m² của Lai Huy kiểm soát vật liệu, máy móc, tay nghề và chất lượng — để mỗi dự án khách sạn, villa và căn hộ được bàn giao đúng tiến độ.', en: 'Lai Huy’s directly operated 3,000 m² workshop controls materials, machinery, craft and quality — so every hotel, villa and apartment project is delivered on schedule.' }) }}
        </p>
        <div
          v-reveal="230"
          class="reveal mt-9 flex flex-col gap-3 sm:flex-row"
        >
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
        </div>
      </div>
    </section>

    <!-- 2 · Why our factory -------------------------------------------------->
    <section class="section-spacing bg-white">
      <div class="section-shell">
        <div class="grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:items-center">
          <div
            v-reveal
            class="reveal overflow-hidden rounded-2xl"
          >
            <MediaImage
              :image="facadeImage"
              preset="full"
              class="w-full"
              :style="{ aspectRatio: `${facadeImage.width} / ${facadeImage.height}` }"
              img-class="rounded-2xl"
            />
          </div>

          <div>
            <p
              v-reveal
              class="eyebrow reveal"
            >
              {{ t({ vi: 'Vì sao chọn xưởng của chúng tôi', en: 'Why our factory' }) }}
            </p>
            <h2
              v-reveal="80"
              class="reveal text-section-title mt-4 font-black uppercase text-ink-950"
            >
              {{ t({ vi: 'Năng lực thật, kiểm soát tận gốc', en: 'Real capability, controlled at the source' }) }}
            </h2>
            <div class="mt-8 grid gap-4 sm:grid-cols-2">
              <article
                v-for="(strength, index) in strengths"
                :key="t(strength.title)"
                v-reveal="120 + index * 90"
                class="industrial-card reveal"
              >
                <Icon
                  :name="strength.icon"
                  class="h-8 w-8 text-wood-500"
                />
                <h3 class="mt-5 text-lg font-black text-ink-950">
                  {{ t(strength.title) }}
                </h3>
                <p class="mt-2 text-sm leading-6 text-ink-600">
                  {{ t(strength.description) }}
                </p>
              </article>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 3 · Manufacturing process (timeline) --------------------------------->
    <section class="section-spacing bg-ink-950 text-white">
      <div class="section-shell">
        <div class="mb-14 max-w-3xl">
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

        <ol class="relative ml-3 border-l border-white/15">
          <li
            v-for="(step, index) in productionWorkflow"
            :key="t(step.title)"
            v-reveal="index * 90"
            class="reveal relative pb-10 pl-8 last:pb-0"
          >
            <span class="absolute -left-4 flex h-8 w-8 items-center justify-center rounded-full bg-wood-500 text-xs font-black text-white ring-4 ring-ink-950">
              {{ String(index + 1).padStart(2, '0') }}
            </span>
            <h3 class="text-lg font-black text-white">
              {{ t(step.title) }}
            </h3>
            <p class="mt-2 max-w-2xl text-sm leading-6 text-white/62">
              {{ t(step.description) }}
            </p>
          </li>
        </ol>
      </div>
    </section>

    <!-- 4 · Factory-tour gallery --------------------------------------------->
    <section class="section-spacing bg-ink-50">
      <div class="section-shell">
        <div class="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div class="max-w-2xl">
            <p
              v-reveal
              class="eyebrow reveal"
            >
              {{ t({ vi: 'Tham quan nhà xưởng', en: 'Factory tour' }) }}
            </p>
            <h2
              v-reveal="80"
              class="reveal text-section-title mt-4 font-black uppercase text-ink-950"
            >
              {{ t({ vi: 'Bước vào không gian sản xuất', en: 'Step inside the workshop' }) }}
            </h2>
            <p
              v-reveal="140"
              class="reveal mt-4 text-base leading-7 text-ink-600"
            >
              {{ t({ vi: 'Hình ảnh thực tế tại xưởng — nhà máy, dây chuyền máy móc và khu vực sản xuất. Chạm vào từng ảnh để xem chi tiết.', en: 'Real photographs from our floor — the building, the machinery line and the production areas. Tap any image to view it in detail.' }) }}
            </p>
          </div>

          <div
            v-reveal="120"
            class="reveal flex flex-wrap gap-2"
          >
            <button
              v-for="filter in galleryFilters"
              :key="filter.value"
              type="button"
              class="inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-bold transition-colors"
              :class="activeFilter === filter.value
                ? 'border-ink-950 bg-ink-950 text-white'
                : 'border-ink-200 bg-white text-ink-600 hover:border-wood-500 hover:text-wood-600'"
              :aria-pressed="activeFilter === filter.value"
              @click="activeFilter = filter.value"
            >
              {{ t(filter.label) }}
              <span
                class="text-xs font-black"
                :class="activeFilter === filter.value ? 'text-white/70' : 'text-ink-400'"
              >{{ countFor(filter.value) }}</span>
            </button>
          </div>
        </div>

        <Transition
          name="fade"
          mode="out-in"
        >
          <AppGalleryGrid
            :key="activeFilter"
            :images="filteredImages"
            selectable
            @select="openLightbox"
          />
        </Transition>
      </div>
    </section>

    <!-- 5 · Equipment & technology (benefit-led) ----------------------------->
    <section class="section-spacing bg-white">
      <div class="section-shell">
        <div class="mb-12 max-w-3xl">
          <p
            v-reveal
            class="eyebrow reveal"
          >
            {{ t({ vi: 'Máy móc & công nghệ', en: 'Equipment & technology' }) }}
          </p>
          <h2
            v-reveal="80"
            class="reveal text-section-title mt-4 font-black uppercase text-ink-950"
          >
            {{ t({ vi: 'Công nghệ tạo nên chất lượng bạn nhận được', en: 'The technology behind the quality you receive' }) }}
          </h2>
        </div>

        <div class="grid gap-6 md:grid-cols-2">
          <article
            v-for="(item, index) in equipment"
            :key="t(item.title)"
            v-reveal="(index % 2) * 100"
            class="group reveal overflow-hidden rounded-2xl border border-ink-200 bg-white transition-colors hover:border-wood-400"
          >
            <div class="relative aspect-[16/10] overflow-hidden bg-ink-100">
              <MediaImage
                :image="item.image"
                preset="card"
                class="h-full w-full"
                img-class="transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <span class="absolute left-4 top-4 rounded-full bg-ink-950/80 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-white backdrop-blur-sm">
                {{ t(item.machine) }}
              </span>
            </div>
            <div class="p-6">
              <Icon
                :name="item.icon"
                class="h-7 w-7 text-wood-500"
              />
              <h3 class="mt-4 text-xl font-black text-ink-950">
                {{ t(item.title) }}
              </h3>
              <p class="mt-3 text-sm leading-6 text-ink-600">
                {{ t(item.description) }}
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- 6 · Craftsmanship ---------------------------------------------------->
    <section class="section-spacing bg-ink-50">
      <div class="section-shell grid gap-12 lg:grid-cols-2 lg:items-center">
        <div
          v-reveal
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
            class="reveal mt-5 text-lg leading-8 text-ink-600"
          >
            {{ t({ vi: 'Máy móc tạo ra độ chính xác, nhưng chính đội ngũ thợ và kỹ thuật viên giàu kinh nghiệm mới quyết định độ hoàn thiện cuối cùng — từ ghép nối, xử lý bề mặt đến lắp dựng tại công trình.', en: 'Machines create precision, but it is our experienced makers and technicians who decide the final finish — from joinery and surface work to installation on site.' }) }}
          </p>
          <p
            v-reveal="200"
            class="reveal mt-4 text-lg leading-8 text-ink-600"
          >
            {{ t({ vi: 'Mỗi hạng mục được kiểm tra kỹ trước khi rời xưởng, đảm bảo sản phẩm đến công trình đúng như bản vẽ và kỳ vọng của chủ đầu tư.', en: 'Every item is checked carefully before it leaves the workshop, so what arrives on site matches the drawings — and the owner’s expectations.' }) }}
          </p>
        </div>
      </div>
    </section>

    <!-- 7 · Production capacity ---------------------------------------------->
    <section class="section-spacing bg-ink-950 text-white">
      <div class="section-shell">
        <div class="mb-12 max-w-3xl">
          <p
            v-reveal
            class="eyebrow reveal text-wood-300"
          >
            {{ t({ vi: 'Năng lực sản xuất', en: 'Production capacity' }) }}
          </p>
          <h2
            v-reveal="80"
            class="reveal text-section-title mt-4 font-black uppercase"
          >
            {{ t({ vi: 'Quy mô đủ lớn cho dự án của bạn', en: 'Scaled for projects of every size' }) }}
          </h2>
        </div>

        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <article
            v-for="(stat, index) in capacityStats"
            :key="t(stat.label)"
            v-reveal="index * 90"
            class="reveal rounded-2xl border border-white/12 bg-white/[0.04] p-6 backdrop-blur-sm transition-colors hover:border-wood-300/50"
          >
            <Icon
              :name="stat.icon"
              class="h-8 w-8 text-wood-300"
            />
            <p class="mt-5 text-3xl font-black text-white">
              {{ t(stat.value) }}
            </p>
            <p class="mt-1 text-sm font-bold uppercase tracking-[0.14em] text-wood-200">
              {{ t(stat.label) }}
            </p>
            <p class="mt-3 text-sm leading-6 text-white/62">
              {{ t(stat.description) }}
            </p>
          </article>
        </div>
      </div>
    </section>

    <!-- 8 · Quality control -------------------------------------------------->
    <section class="section-spacing bg-white">
      <div class="section-shell grid gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <p
            v-reveal
            class="eyebrow reveal"
          >
            {{ t(uiText.labels.qualityControl) }}
          </p>
          <h2
            v-reveal="80"
            class="reveal text-section-title mt-4 font-black uppercase text-ink-950"
          >
            {{ t({ vi: 'Kiểm soát chất lượng từ vật tư đến nghiệm thu', en: 'Quality control from materials to handover' }) }}
          </h2>
          <ul class="mt-8 space-y-4">
            <li
              v-for="(item, index) in qualityControl"
              :key="item"
              v-reveal="index * 70"
              class="reveal flex gap-3 border-b border-ink-200 pb-4 text-base font-semibold leading-7 text-ink-800"
            >
              <Icon
                name="i-lucide-circle-check-big"
                class="mt-1 h-5 w-5 shrink-0 text-wood-500"
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

    <!-- 9 · FAQ -------------------------------------------------------------->
    <section class="section-spacing bg-ink-50">
      <div class="section-shell grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p
            v-reveal
            class="eyebrow reveal"
          >
            {{ t({ vi: 'Câu hỏi thường gặp', en: 'FAQ' }) }}
          </p>
          <h2
            v-reveal="80"
            class="reveal text-section-title mt-4 font-black uppercase text-ink-950"
          >
            {{ t({ vi: 'Những điều khách hàng thường hỏi', en: 'What customers usually ask' }) }}
          </h2>
        </div>
        <div class="space-y-3">
          <details
            v-for="(faq, index) in faqs"
            :key="t(faq.question)"
            v-reveal="index * 60"
            class="reveal group rounded-2xl border border-ink-200 bg-white px-6 open:border-wood-300"
          >
            <summary class="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-base font-black text-ink-950 [&::-webkit-details-marker]:hidden">
              {{ t(faq.question) }}
              <Icon
                name="i-lucide-plus"
                class="h-5 w-5 shrink-0 text-wood-500 transition-transform duration-300 group-open:rotate-45"
              />
            </summary>
            <p class="pb-5 text-sm leading-7 text-ink-600">
              {{ t(faq.answer) }}
            </p>
          </details>
        </div>
      </div>
    </section>

    <!-- 10 · CTA ------------------------------------------------------------->
    <section class="bg-ink-950 px-6 py-16 text-white">
      <div class="section-shell grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <p class="eyebrow text-wood-300">
            {{ t({ vi: 'Tư vấn năng lực sản xuất', en: 'Production capability review' }) }}
          </p>
          <h2 class="mt-4 max-w-3xl text-3xl font-black uppercase md:text-5xl">
            {{ t({ vi: 'Cần kiểm tra khả năng sản xuất cho dự án của bạn?', en: 'Need to assess production capacity for your project?' }) }}
          </h2>
        </div>
        <div class="flex flex-col gap-3 sm:flex-row md:flex-col">
          <NuxtLink
            to="/lien-he"
            class="btn-primary"
          >
            {{ t(uiText.cta.contact) }}
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
      :images="filteredImages"
      :index="lightboxIndex"
      :open="lightboxOpen"
      @close="lightboxOpen = false"
      @update:index="lightboxIndex = $event"
    />
  </div>
</template>
