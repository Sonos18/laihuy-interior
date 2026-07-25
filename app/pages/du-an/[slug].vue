<script setup lang="ts">
import { company } from '~/data/company'
import { categoryDefinitions } from '~/data/categories'
import { projects } from '~/data/projects'
import { siteImages } from '~/data/site-images'
import { uiText } from '~/data/ui'
import {
  projectCoverAsset,
  projectGalleryGroups,
  projectImages,
  withAlt
} from '~/media/project-media'
import type { MediaImage } from '~/shared/media/types'
import type { LocalizedArray, LocalizedText } from '~/shared/types/localization'

// Remount this component on every path change. `project` and everything derived from it are
// read ONCE from route.params.slug at setup (non-reactive by design — see below), so without a
// per-path key Vue Router would reuse the instance when navigating between two /du-an/[slug]
// routes and the page would keep showing the previous project. That path is live: the "Related
// projects" section links slug → slug. Keying by path re-runs setup (and the 404 guard) cleanly.
definePageMeta({ key: route => route.path })

const { t, ta } = useLanguage()
const { resolve: mediaUrl } = useMediaUrl()
const route = useRoute()
const slug = Array.isArray(route.params.slug) ? route.params.slug[0] : route.params.slug

const project = projects.find(item => item.slug === slug)

// Unknown slug → a real 404 (status + Nuxt error page), not a 200 soft-404.
if (!project) {
  throw createError({ statusCode: 404, statusMessage: 'Project not found', fatal: true })
}

// --- Locale-stable raw accessors (for keys / scoring, independent of display locale) ---
const rawText = (value?: LocalizedText): string =>
  !value ? '' : typeof value === 'string' ? value : (value.vi ?? value.en ?? '')
const rawList = (value?: LocalizedArray): string[] =>
  !value ? [] : Array.isArray(value) ? value : (value.vi ?? value.en ?? [])

const categoryLabel = categoryDefinitions[project.category].label
const scopeKeys = rawList(project.scope)

// --- Media ------------------------------------------------------------------
const heroImage = computed<MediaImage>(() =>
  withAlt(projectCoverAsset(project.mediaId, project.coverImage) ?? siteImages.bannerHome, project.name)
)
const allImages: MediaImage[] = projectImages(project.mediaId, project.name)
const leadImage = computed<MediaImage | undefined>(() => allImages[0])
// A fourth gallery image (if the project has one) gives the Materials section a visual
// anchor, the same editorial license `leadImage` already uses for Solution — it isn't
// claimed to depict any one bullet in `content.materials`, just the project's palette.
const materialsImage = computed<MediaImage | undefined>(() =>
  allImages.length > 3 ? allImages[3] : undefined
)
const galleryGroups = projectGalleryGroups(project.mediaId, project.name)
const hasGalleryGroups = galleryGroups.length > 0

const prettifySlug = (value: string): string =>
  value.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase())

const galleryTabs = computed(() => [
  { value: 'all', label: t({ vi: 'Tất cả', en: 'All' }), count: allImages.length },
  ...galleryGroups.map(group => ({
    value: group.slug,
    label: project.galleryLabels?.[group.slug]
      ? t(project.galleryLabels[group.slug] as LocalizedText)
      : prettifySlug(group.slug),
    count: group.images.length
  }))
])

const activeGalleryTab = ref('all')
const filteredGallery = computed<MediaImage[]>(() => {
  if (!hasGalleryGroups || activeGalleryTab.value === 'all') {
    return allImages
  }
  return galleryGroups.find(group => group.slug === activeGalleryTab.value)?.images ?? allImages
})

const lightboxOpen = ref(false)
const lightboxIndex = ref(0)
const openLightbox = (index: number) => {
  lightboxIndex.value = index
  lightboxOpen.value = true
}
watch(activeGalleryTab, () => {
  lightboxOpen.value = false
})

// --- Hero meta --------------------------------------------------------------
const statusText = computed(() =>
  project.year ? t({ vi: `Hoàn thành ${t(project.year)}`, en: `Completed ${t(project.year)}` }) : ''
)

// --- Project facts (premium cards) ------------------------------------------
type Fact = { icon: string, label: LocalizedText, value: string }
const facts = computed<Fact[]>(() => {
  const list: (Fact | null)[] = [
    { icon: 'i-lucide-tag', label: { vi: 'Loại hình', en: 'Project type' }, value: t(categoryLabel) },
    project.location ? { icon: 'i-lucide-map-pin', label: { vi: 'Địa điểm', en: 'Location' }, value: t(project.location) } : null,
    project.area ? { icon: 'i-lucide-ruler', label: { vi: 'Diện tích', en: 'Floor area' }, value: t(project.area) } : null,
    project.year ? { icon: 'i-lucide-calendar-check', label: { vi: 'Hoàn thành', en: 'Completed' }, value: t(project.year) } : null,
    project.style ? { icon: 'i-lucide-palette', label: { vi: 'Phong cách', en: 'Style' }, value: t(project.style) } : null,
    project.client ? { icon: 'i-lucide-user-round', label: { vi: 'Chủ đầu tư', en: 'Client' }, value: t(project.client) } : null,
    project.rooms ? { icon: 'i-lucide-bed-double', label: { vi: 'Quy mô', en: 'Rooms' }, value: t(project.rooms) } : null,
    project.duration ? { icon: 'i-lucide-clock', label: { vi: 'Thời gian', en: 'Duration' }, value: t(project.duration) } : null,
    ta(project.scope).length ? { icon: 'i-lucide-list-checks', label: { vi: 'Phạm vi', en: 'Scope' }, value: ta(project.scope).join(' · ') } : null,
    ...(project.metrics ?? []).map(metric => ({ icon: metric.icon ?? 'i-lucide-badge-check', label: metric.label, value: t(metric.value) }))
  ]
  return list.filter((fact): fact is Fact => fact !== null)
})

// --- Services (from the project's real scope) -------------------------------
const serviceCatalog: Record<string, { icon: string, title: LocalizedText, description: LocalizedText }> = {
  'Thiết kế': {
    icon: 'i-lucide-pencil-ruler',
    title: { vi: 'Thiết kế', en: 'Design' },
    description: { vi: 'Phát triển concept, bố trí công năng, chọn vật liệu và hồ sơ triển khai kỹ thuật.', en: 'Concept development, space planning, material selection and technical drawings.' }
  },
  'Sản xuất': {
    icon: 'i-lucide-factory',
    title: { vi: 'Sản xuất', en: 'Production' },
    description: { vi: 'Gia công nội thất tại xưởng trực tiếp 3.000 m² với quy trình kiểm soát chất lượng.', en: 'Manufacturing at our own 3,000 m² workshop with a controlled quality process.' }
  },
  'Thi công': {
    icon: 'i-lucide-hard-hat',
    title: { vi: 'Thi công', en: 'Construction' },
    description: { vi: 'Lắp dựng và hoàn thiện tại công trình, đúng thiết kế và đúng tiến độ.', en: 'On-site installation and finishing — true to the design and on schedule.' }
  }
}
const services = scopeKeys.map(key => serviceCatalog[key]).filter(Boolean) as { icon: string, title: LocalizedText, description: LocalizedText }[]

// --- Delivery process (bookended by consult + handover; middle from scope) ---
const deliveryPhases: { icon: string, label: LocalizedText }[] = [
  { icon: 'i-lucide-messages-square', label: { vi: 'Tư vấn & khảo sát', en: 'Consultation' } },
  ...(scopeKeys.includes('Thiết kế') ? [{ icon: 'i-lucide-pencil-ruler', label: { vi: 'Thiết kế', en: 'Design' } }] : []),
  ...(scopeKeys.includes('Sản xuất') ? [{ icon: 'i-lucide-factory', label: { vi: 'Sản xuất tại xưởng', en: 'Production' } }] : []),
  ...(scopeKeys.includes('Thi công') ? [{ icon: 'i-lucide-hard-hat', label: { vi: 'Thi công lắp đặt', en: 'Installation' } }] : []),
  { icon: 'i-lucide-key-round', label: { vi: 'Bàn giao', en: 'Handover' } }
]

// --- Experience walkthrough (highlights paired with real images) ------------
const highlights = computed(() => ta(project.content?.designHighlights))
const walkthroughSteps = computed(() =>
  highlights.value.map((text, index) => ({
    text,
    image: allImages.length ? allImages[(index + 1) % allImages.length] : undefined
  }))
)

// --- Related projects (category → style → scope → recency) ------------------
const scopeSet = new Set(scopeKeys)
const relatedProjects = projects
  .filter(item => item.slug !== project.slug)
  .map((item) => {
    let score = 0
    if (item.category === project.category) score += 100
    if (rawText(item.style) && rawText(item.style) === rawText(project.style)) score += 30
    score += rawList(item.scope).filter(key => scopeSet.has(key)).length * 10
    score += (Number(rawText(item.year)) || 0) * 0.01
    return { item, score }
  })
  .sort((first, second) => second.score - first.score)
  .slice(0, 3)
  .map(({ item }) => ({ item, cover: projectCoverAsset(item.mediaId, item.coverImage) }))

// --- Verified trust band ----------------------------------------------------
const trustStats: { icon: string, value: LocalizedText, label: LocalizedText }[] = [
  { icon: 'i-lucide-warehouse', value: { vi: '3.000 m²', en: '3,000 m²' }, label: { vi: 'Xưởng sản xuất', en: 'Own factory' } },
  { icon: 'i-lucide-gauge', value: { vi: 'Đến 50', en: 'Up to 50' }, label: { vi: 'Phòng / tháng', en: 'Rooms / month' } },
  { icon: 'i-lucide-workflow', value: { vi: 'Trọn gói', en: 'End-to-end' }, label: { vi: 'Thiết kế → thi công', en: 'Design → install' } },
  { icon: 'i-lucide-globe', value: { vi: 'Toàn quốc', en: 'Nationwide' }, label: { vi: 'Giao lắp & xuất khẩu', en: 'Delivery & export' } }
]

// --- Sticky in-page navigation (only sections that render) ------------------
const navSections = computed(() => {
  const sections: { id: string, label: LocalizedText }[] = [
    { id: 'overview', label: { vi: 'Tổng quan', en: 'Overview' } }
  ]
  if (project.content?.challenge) sections.push({ id: 'challenge', label: { vi: 'Thách thức', en: 'Challenge' } })
  if (project.content?.solution) sections.push({ id: 'solution', label: { vi: 'Giải pháp', en: 'Solution' } })
  sections.push({ id: 'facts', label: { vi: 'Thông tin', en: 'Facts' } })
  if (services.length) sections.push({ id: 'services', label: { vi: 'Dịch vụ', en: 'Services' } })
  if (allImages.length) sections.push({ id: 'gallery', label: { vi: 'Hình ảnh', en: 'Gallery' } })
  if (project.content?.experience || highlights.value.length) sections.push({ id: 'experience', label: { vi: 'Trải nghiệm', en: 'Experience' } })
  if (ta(project.content?.materials).length || project.content?.craftsmanship) sections.push({ id: 'materials', label: { vi: 'Vật liệu', en: 'Materials' } })
  if (project.testimonial) sections.push({ id: 'testimonial', label: { vi: 'Cảm nhận', en: 'Testimonial' } })
  return sections
})

const activeSection = ref('overview')
onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          activeSection.value = entry.target.id
        }
      }
    },
    { rootMargin: '-45% 0px -50% 0px' }
  )
  for (const section of navSections.value) {
    const el = document.getElementById(section.id)
    if (el) observer.observe(el)
  }
  onUnmounted(() => observer.disconnect())
})

// --- SEO --------------------------------------------------------------------
const seoName = computed(() => t(project.seo?.title ?? project.name))
// Two segments only: a third ('Dự án nội thất' / 'Interior project') was filler that pushed
// longer project names past Google's ~60-char title cut. The project name already carries the
// topic; the brand suffix stays. This now equals the og:title, so no separate ogTitle is needed.
const seoTitle = computed(() => `${seoName.value} | Lai Huy Interior`)
const seoDescription = computed(() =>
  t(project.seo?.description) || t(project.content?.overview) || t(project.shortDescription)
)
const seoKeywords = computed(() => ta(project.seo?.keywords).join(', '))

usePageSeo({
  path: `/du-an/${project.slug}`,
  title: seoTitle,
  description: seoDescription,
  keywords: seoKeywords,
  ogType: 'article',
  imagePath: () => heroImage.value.path,
  jsonLd: ({ base, canonical }) => [
    buildBreadcrumbLd(base, t, [
      { name: { vi: 'Trang chủ', en: 'Home' }, path: '/' },
      { name: { vi: 'Dự án', en: 'Projects' }, path: '/du-an' },
      { name: project.name, path: `/du-an/${project.slug}` }
    ]),
    buildOrganizationLd(base, t),
    {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      '@id': `${canonical}#project`,
      'url': canonical,
      'name': t(project.name),
      'description': seoDescription.value,
      'image': allImages.slice(0, 8).map(image => mediaUrl(image.path, { width: 1600 })),
      'about': t(categoryLabel),
      'creator': { '@id': `${base}#organization` },
      ...(project.year ? { dateCreated: t(project.year) } : {}),
      ...(project.location ? { locationCreated: { '@type': 'Place', 'name': t(project.location) } } : {}),
      ...(ta(project.content?.materials).length ? { material: ta(project.content?.materials) } : {}),
      ...(seoKeywords.value ? { keywords: seoKeywords.value } : {})
    }
  ]
})
</script>

<template>
  <div class="bg-white">
    <!-- 1 · Hero — caption / per-project (docs/hero-art-direction.md §10, Project detail · Craftsmanship) -->
    <AppHero
      :title="t(project.name)"
      :image="heroImage"
      mode="caption"
      atmosphere="dark"
      focal="50% 40%"
    >
      <template #breadcrumb>
        <nav
          class="mb-8 flex items-center gap-2 text-sm font-semibold text-white/62"
          :aria-label="t({ vi: 'Đường dẫn', en: 'Breadcrumb' })"
        >
          <NuxtLink
            to="/du-an"
            class="inline-flex items-center gap-2 transition-colors hover:text-white"
          >
            <Icon
              name="i-lucide-arrow-left"
              class="h-4 w-4"
            />
            {{ t({ vi: 'Dự án', en: 'Projects' }) }}
          </NuxtLink>
        </nav>
      </template>

      <template #chips>
        <div class="mb-5 flex flex-wrap items-center gap-3">
          <span class="rounded-full bg-wood-500 px-3 py-1.5 text-xs font-black uppercase tracking-[0.16em] text-white">
            {{ t(categoryLabel) }}
          </span>
          <span
            v-if="statusText"
            class="inline-flex items-center gap-1.5 rounded-full border border-white/25 px-3 py-1.5 text-xs font-bold text-white/86"
          >
            <Icon
              name="i-lucide-circle-check-big"
              class="h-3.5 w-3.5 text-wood-300"
            />
            {{ statusText }}
          </span>
        </div>
      </template>

      <template #meta>
        <p
          v-if="project.location"
          class="mt-4 flex items-center gap-2 text-lg font-semibold text-wood-200"
        >
          <Icon
            name="i-lucide-map-pin"
            class="h-5 w-5"
          />
          {{ t(project.location) }}
        </p>

        <p class="mt-5 text-lg leading-8 text-white/80">
          {{ t(project.shortDescription) }}
        </p>
      </template>

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

    <!-- Sticky in-page nav --------------------------------------------------->
    <nav
      class="subnav-anchor sticky z-30 border-b border-ink-200 bg-white/95 backdrop-blur-md"
      :aria-label="t({ vi: 'Mục lục dự án', en: 'Case study sections' })"
    >
      <div class="shell flex gap-1 overflow-x-auto py-3">
        <a
          v-for="section in navSections"
          :key="section.id"
          :href="`#${section.id}`"
          class="shrink-0 rounded-full px-4 py-2 text-sm font-bold transition-colors"
          :class="activeSection === section.id
            ? 'bg-ink-950 text-white'
            : 'text-ink-500 hover:text-wood-600'"
          :aria-current="activeSection === section.id ? 'true' : undefined"
        >
          {{ t(section.label) }}
        </a>
      </div>
    </nav>

    <!-- 2 · Overview --------------------------------------------------------->
    <section
      v-if="project.content?.overview"
      id="overview"
      class="section-y scroll-mt-[calc(var(--header-h)+var(--subnav-h)+1rem)] bg-white"
    >
      <div class="shell grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p
            v-reveal
            class="eyebrow reveal"
          >
            {{ t(uiText.labels.overview) }}
          </p>
          <h2
            v-reveal="80"
            class="reveal text-section-title mt-4 font-black uppercase text-ink-950"
          >
            {{ t({ vi: 'Nhìn tổng thể dự án', en: 'The project at a glance' }) }}
          </h2>
        </div>
        <div class="space-y-6 text-lg leading-9 text-ink-600">
          <p
            v-reveal
            class="reveal"
          >
            {{ t(project.content.overview) }}
          </p>
        </div>
      </div>
    </section>

    <!-- 3 · Challenge -------------------------------------------------------->
    <section
      v-if="project.content?.challenge"
      id="challenge"
      class="section-y scroll-mt-[calc(var(--header-h)+var(--subnav-h)+1rem)] bg-white"
    >
      <div class="shell">
        <div class="mx-auto max-w-3xl text-center">
          <p
            v-reveal
            class="eyebrow reveal"
          >
            {{ t(uiText.labels.challenge) }}
          </p>
          <p
            v-reveal="100"
            class="reveal mt-6 text-2xl font-black leading-snug text-ink-950 md:text-3xl"
          >
            {{ t(project.content.challenge) }}
          </p>
        </div>
      </div>
    </section>

    <!-- 4 · Solution --------------------------------------------------------->
    <section
      v-if="project.content?.solution"
      id="solution"
      class="section-y scroll-mt-[calc(var(--header-h)+var(--subnav-h)+1rem)] bg-ink-950 text-white"
    >
      <div class="shell grid gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <p
            v-reveal
            class="eyebrow reveal text-wood-300"
          >
            {{ t(uiText.labels.solution) }}
          </p>
          <h2
            v-reveal="80"
            class="reveal text-section-title mt-4 font-black uppercase"
          >
            {{ t({ vi: 'Cách chúng tôi giải quyết', en: 'How we solved it' }) }}
          </h2>
          <p
            v-reveal="140"
            class="reveal mt-6 text-lg leading-9 text-white/72"
          >
            {{ t(project.content.solution) }}
          </p>
        </div>
        <div
          v-if="leadImage"
          v-reveal="120"
          class="reveal overflow-hidden rounded-2xl"
        >
          <MediaImage
            :image="leadImage"
            preset="full"
            class="w-full"
            :style="{ aspectRatio: `${leadImage.width} / ${leadImage.height}` }"
            img-class="rounded-2xl"
          />
        </div>
      </div>
    </section>

    <!-- 5 · Project facts ---------------------------------------------------->
    <section
      id="facts"
      class="section-y scroll-mt-[calc(var(--header-h)+var(--subnav-h)+1rem)] bg-ink-50"
    >
      <div class="shell">
        <div class="mb-10 max-w-2xl">
          <p
            v-reveal
            class="eyebrow reveal"
          >
            {{ t({ vi: 'Thông tin dự án', en: 'Project facts' }) }}
          </p>
          <h2
            v-reveal="80"
            class="reveal text-section-title mt-4 font-black uppercase text-ink-950"
          >
            {{ t({ vi: 'Những con số đã được xác thực', en: 'The verified essentials' }) }}
          </h2>
        </div>
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <article
            v-for="(fact, index) in facts"
            :key="t(fact.label)"
            v-reveal="(index % 3) * 80"
            class="reveal rounded-2xl border border-ink-200 bg-white p-6 transition-colors hover:border-wood-400"
          >
            <Icon
              :name="fact.icon"
              class="h-7 w-7 text-wood-500"
            />
            <p class="mt-4 text-xl font-black text-ink-950">
              {{ fact.value }}
            </p>
            <p class="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-ink-500">
              {{ t(fact.label) }}
            </p>
          </article>
        </div>
      </div>
    </section>

    <!-- 6 · Services --------------------------------------------------------->
    <section
      v-if="services.length"
      id="services"
      class="section-y scroll-mt-[calc(var(--header-h)+var(--subnav-h)+1rem)] bg-white"
    >
      <div class="shell">
        <div class="mb-10 max-w-2xl">
          <p
            v-reveal
            class="eyebrow reveal"
          >
            {{ t({ vi: 'Phạm vi công việc', en: 'Our scope' }) }}
          </p>
          <h2
            v-reveal="80"
            class="reveal text-section-title mt-4 font-black uppercase text-ink-950"
          >
            {{ t({ vi: 'Lai Huy đảm nhận cho dự án này', en: 'What Lai Huy delivered here' }) }}
          </h2>
        </div>
        <div class="grid gap-5 md:grid-cols-3">
          <article
            v-for="(service, index) in services"
            :key="t(service.title)"
            v-reveal="index * 90"
            class="industrial-card reveal"
          >
            <Icon
              :name="service.icon"
              class="h-8 w-8 text-wood-500"
            />
            <h3 class="mt-5 text-xl font-black text-ink-950">
              {{ t(service.title) }}
            </h3>
            <p class="mt-3 text-sm leading-6 text-ink-600">
              {{ t(service.description) }}
            </p>
          </article>
        </div>

        <!-- Delivery process -->
        <div class="mt-14">
          <p
            v-reveal
            class="eyebrow reveal"
          >
            {{ t({ vi: 'Quy trình triển khai', en: 'Delivery process' }) }}
          </p>
          <ol class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <li
              v-for="(phase, index) in deliveryPhases"
              :key="t(phase.label)"
              v-reveal="index * 70"
              class="reveal relative rounded-2xl border border-ink-200 p-5"
            >
              <span class="text-xs font-black text-wood-500">
                {{ String(index + 1).padStart(2, '0') }}
              </span>
              <Icon
                :name="phase.icon"
                class="mt-3 h-6 w-6 text-ink-950"
              />
              <p class="mt-3 text-sm font-black text-ink-950">
                {{ t(phase.label) }}
              </p>
            </li>
          </ol>
        </div>
      </div>
    </section>

    <!-- 7 · Gallery ---------------------------------------------------------->
    <section
      v-if="allImages.length"
      id="gallery"
      class="section-y scroll-mt-[calc(var(--header-h)+var(--subnav-h)+1rem)] bg-ink-50"
    >
      <div class="shell">
        <div class="mb-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div class="max-w-2xl">
            <p
              v-reveal
              class="eyebrow reveal"
            >
              {{ t(uiText.labels.completedImages) }}
            </p>
            <h2
              v-reveal="80"
              class="reveal text-section-title mt-4 font-black uppercase text-ink-950"
            >
              {{ t(uiText.labels.gallery) }}
            </h2>
          </div>

          <div
            v-if="hasGalleryGroups"
            v-reveal="120"
            class="reveal flex flex-wrap gap-2"
          >
            <button
              v-for="tab in galleryTabs"
              :key="tab.value"
              type="button"
              class="inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-bold transition-colors"
              :class="activeGalleryTab === tab.value
                ? 'border-ink-950 bg-ink-950 text-white'
                : 'border-ink-200 bg-white text-ink-600 hover:border-wood-500 hover:text-wood-600'"
              :aria-pressed="activeGalleryTab === tab.value"
              @click="activeGalleryTab = tab.value"
            >
              {{ tab.label }}
              <span
                class="text-xs font-black"
                :class="activeGalleryTab === tab.value ? 'text-white/70' : 'text-ink-500'"
              >{{ tab.count }}</span>
            </button>
          </div>
        </div>

        <Transition
          name="fade"
          mode="out-in"
        >
          <AppGalleryGrid
            :key="activeGalleryTab"
            :images="filteredGallery"
            selectable
            @select="openLightbox"
          />
        </Transition>
      </div>
    </section>

    <!-- 8 · Experience walkthrough ------------------------------------------->
    <section
      v-if="project.content?.experience || walkthroughSteps.length"
      id="experience"
      class="section-y scroll-mt-[calc(var(--header-h)+var(--subnav-h)+1rem)] bg-white"
    >
      <div class="shell">
        <div class="mb-12 max-w-3xl">
          <p
            v-reveal
            class="eyebrow reveal"
          >
            {{ t({ vi: 'Trải nghiệm không gian', en: 'Space walkthrough' }) }}
          </p>
          <h2
            v-reveal="80"
            class="reveal text-section-title mt-4 font-black uppercase text-ink-950"
          >
            {{ t({ vi: 'Đi qua không gian hoàn thiện', en: 'A walk through the finished space' }) }}
          </h2>
          <p
            v-if="project.content?.experience"
            v-reveal="140"
            class="reveal mt-5 text-lg leading-8 text-ink-600"
          >
            {{ t(project.content.experience) }}
          </p>
        </div>

        <div class="space-y-6">
          <article
            v-for="(step, index) in walkthroughSteps"
            :key="step.text"
            v-reveal="(index % 2) * 90"
            class="reveal grid items-center gap-6 md:grid-cols-2"
            :class="index % 2 === 1 ? 'md:[&>figure]:order-last' : ''"
          >
            <figure
              v-if="step.image"
              class="overflow-hidden rounded-2xl"
            >
              <MediaImage
                :image="step.image"
                preset="card"
                class="aspect-[4/3] w-full"
                img-class="rounded-2xl"
              />
            </figure>
            <div class="flex items-start gap-4">
              <span class="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-wood-500 text-white">
                <Icon
                  name="i-lucide-sparkles"
                  class="h-4 w-4"
                />
              </span>
              <p class="text-lg font-semibold leading-8 text-ink-800">
                {{ step.text }}
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- 9 · Materials & craftsmanship ---------------------------------------->
    <section
      v-if="ta(project.content?.materials).length || project.content?.craftsmanship"
      id="materials"
      class="section-y scroll-mt-[calc(var(--header-h)+var(--subnav-h)+1rem)] bg-ink-950 text-white"
    >
      <div class="shell grid gap-12 lg:grid-cols-2">
        <div v-if="ta(project.content?.materials).length">
          <p
            v-reveal
            class="eyebrow reveal text-wood-300"
          >
            {{ t({ vi: 'Vật liệu & hoàn thiện', en: 'Materials & finishes' }) }}
          </p>
          <h2
            v-reveal="80"
            class="reveal text-section-title mt-4 font-black uppercase"
          >
            {{ t({ vi: 'Bảng vật liệu', en: 'The material palette' }) }}
          </h2>
          <div
            v-if="materialsImage"
            v-reveal="120"
            class="reveal mt-8 overflow-hidden rounded-2xl"
          >
            <MediaImage
              :image="materialsImage"
              preset="card"
              class="aspect-[16/10] w-full"
              img-class="rounded-2xl"
            />
          </div>
          <ul class="mt-8 space-y-4">
            <li
              v-for="(material, index) in ta(project.content?.materials)"
              :key="material"
              v-reveal="index * 70"
              class="reveal flex gap-4 border-b border-white/12 pb-4"
            >
              <Icon
                name="i-lucide-square-stack"
                class="mt-1 h-5 w-5 shrink-0 text-wood-300"
              />
              <span class="text-base leading-7 text-white/76">{{ material }}</span>
            </li>
          </ul>
        </div>

        <div v-if="project.content?.craftsmanship">
          <p
            v-reveal
            class="eyebrow reveal text-wood-300"
          >
            {{ t({ vi: 'Sản xuất & thi công', en: 'Craftsmanship' }) }}
          </p>
          <h2
            v-reveal="80"
            class="reveal text-section-title mt-4 font-black uppercase"
          >
            {{ t({ vi: 'Được làm bởi chính xưởng của chúng tôi', en: 'Made in our own workshop' }) }}
          </h2>
          <p
            v-reveal="140"
            class="reveal mt-6 text-lg leading-9 text-white/72"
          >
            {{ t(project.content.craftsmanship) }}
          </p>
          <NuxtLink
            v-reveal="180"
            to="/nha-xuong"
            class="btn-secondary reveal mt-8"
          >
            {{ t(uiText.cta.factory) }}
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- 10 · Testimonial (hidden until authored) ----------------------------->
    <section
      v-if="project.testimonial"
      id="testimonial"
      class="section-y scroll-mt-[calc(var(--header-h)+var(--subnav-h)+1rem)] bg-white"
    >
      <div class="shell">
        <!-- The narrower measure nests INSIDE the rail rather than riding on it.
             `.shell max-w-4xl` would cap the element and then subtract the gutter
             from it, narrowing the text from 896px to 832px — a component owning
             both a max-width and horizontal padding is the two-shell defect in
             miniature (§4.1, §26.7). Nested, the rendered box is unchanged. -->
        <div class="mx-auto max-w-4xl text-center">
          <Icon
            name="i-lucide-quote"
            class="mx-auto h-10 w-10 text-wood-400"
          />
          <blockquote class="mt-6 text-2xl font-black leading-snug text-ink-950 md:text-3xl">
            “{{ t(project.testimonial.quote) }}”
          </blockquote>
          <p class="mt-6 text-base font-bold text-ink-950">
            {{ t(project.testimonial.author) }}
          </p>
          <p
            v-if="project.testimonial.role"
            class="text-sm text-ink-500"
          >
            {{ t(project.testimonial.role) }}
          </p>
        </div>
      </div>
    </section>

    <!-- 11 · Related projects ------------------------------------------------>
    <section
      v-if="relatedProjects.length"
      class="section-y bg-ink-50"
    >
      <div class="shell">
        <div class="mb-10 flex items-end justify-between gap-6">
          <div>
            <p
              v-reveal
              class="eyebrow reveal"
            >
              {{ t(uiText.labels.exploreMore) }}
            </p>
            <h2
              v-reveal="80"
              class="reveal text-section-title mt-4 font-black uppercase text-ink-950"
            >
              {{ t(uiText.labels.relatedProjects) }}
            </h2>
          </div>
          <NuxtLink
            to="/du-an"
            class="btn-outline hidden md:inline-flex"
          >
            {{ t(uiText.cta.allProjects) }}
          </NuxtLink>
        </div>

        <div class="grid gap-6 md:grid-cols-3">
          <NuxtLink
            v-for="({ item, cover }, index) in relatedProjects"
            :key="item.slug"
            v-reveal="index * 100"
            :to="`/du-an/${item.slug}`"
            class="group reveal block overflow-hidden rounded-2xl bg-white"
          >
            <div
              v-if="cover"
              class="aspect-[4/3] overflow-hidden bg-ink-100"
            >
              <NuxtImg
                :src="cover.path"
                :alt="t(item.name)"
                :width="cover.width"
                :height="cover.height"
                sizes="sm:100vw md:33vw"
                loading="lazy"
                class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div :class="['border border-ink-200 p-5', cover ? 'border-t-0' : '']">
              <span class="text-xs font-bold uppercase tracking-[0.16em] text-wood-600">
                {{ t(categoryDefinitions[item.category].label) }}
              </span>
              <h3 class="mt-3 text-xl font-black text-ink-950">
                {{ t(item.name) }}
              </h3>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- 12 · Trust band + conversion CTA ------------------------------------->
    <section class="section-cta">
      <div class="shell">
        <div class="grid gap-4 border-b border-ink-200 pb-12 sm:grid-cols-2 lg:grid-cols-4">
          <div
            v-for="stat in trustStats"
            :key="t(stat.label)"
            class="flex items-center gap-4"
          >
            <Icon
              :name="stat.icon"
              class="h-9 w-9 shrink-0 text-wood-500"
            />
            <div>
              <p class="text-xl font-black text-ink-950">
                {{ t(stat.value) }}
              </p>
              <p class="text-xs font-bold uppercase tracking-[0.14em] text-ink-500">
                {{ t(stat.label) }}
              </p>
            </div>
          </div>
        </div>

        <div class="grid gap-8 pt-12 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <h2 class="max-w-3xl text-3xl font-black uppercase leading-tight md:text-5xl">
              {{ t({ vi: 'Ấn tượng với dự án này?', en: 'Inspired by this project?' }) }}
            </h2>
            <p class="mt-4 max-w-2xl text-lg text-ink-600">
              {{ t({ vi: 'Hãy cùng Lai Huy kiến tạo một không gian tương tự cho công trình của bạn — từ thiết kế đến bàn giao.', en: 'Let’s create something similar for your space — from first sketch to final handover, with Lai Huy.' }) }}
            </p>
          </div>
          <div class="flex flex-col gap-3 sm:flex-row md:flex-col">
            <NuxtLink
              to="/lien-he"
              class="btn-primary"
            >
              {{ t(uiText.cta.quote24h) }}
            </NuxtLink>
            <a
              :href="`tel:${company.phone.replaceAll(' ', '')}`"
              class="btn-outline"
            >
              {{ company.phone }}
            </a>
          </div>
        </div>
      </div>
    </section>

    <GalleryLightbox
      :images="filteredGallery"
      :index="lightboxIndex"
      :open="lightboxOpen"
      @close="lightboxOpen = false"
      @update:index="lightboxIndex = $event"
    />
  </div>
</template>
