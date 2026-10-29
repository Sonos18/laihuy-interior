<script setup lang="ts">
import { categoryDefinitions } from '~/data/categories'
import { company } from '~/data/company'
import { factoryStats } from '~/data/factory'
import { projects } from '~/data/projects'
import { projectsPageContent } from '~/data/projects-page'
import { siteImages } from '~/data/site-images'
import { uiText } from '~/data/ui'
import { caseStudyBreath } from '~/media/breath-media'
import {
  buildProjectMediaFlow,
  galleryHeadline,
  projectCoverAsset,
  projectGalleryGroups,
  projectImages,
  withAlt
} from '~/media/project-media'
import type { MediaImage } from '~/shared/media/types'
import type { LocalizedText } from '~/shared/types/localization'
import { buildProjectDetailViewModel, projectStatusText } from '~/utils/project-detail-view-model'

// Remount this component on every path change. `project` and everything derived from it are
// read once from route.params.slug, so related-project navigation must recreate the instance.
definePageMeta({ key: route => route.path })

const { locale, t, ta } = useLanguage()
const { resolve: mediaUrl } = useMediaUrl()
const route = useRoute()
const slug = Array.isArray(route.params.slug) ? route.params.slug[0] : route.params.slug

const project = projects.find(item => item.slug === slug)

if (!project) {
  throw createError({ statusCode: 404, statusMessage: 'Project not found', fatal: true })
}

const categoryLabel = categoryDefinitions[project.category].label

// Media joins stay route-owned because they drive gallery tabs, lightbox state and SEO images.
// The hero names the project and where it is; every other image is named by its room (or its place
// in the set), so the carousel, the lightbox and the story images all read the same alt.
const heroAlt: LocalizedText = project.location
  ? { vi: `${project.name.vi}, ${project.location.vi}`, en: `${project.name.en}, ${project.location.en}` }
  : project.name
const heroImage = computed<MediaImage>(() =>
  withAlt(projectCoverAsset(project.mediaId, project.coverImage) ?? siteImages.bannerHome, heroAlt)
)
const allImages: MediaImage[] = projectImages(project.mediaId, project.name, project.galleryLabels)
const galleryGroups = projectGalleryGroups(project.mediaId, project.name, project.galleryLabels)
const hasGalleryGroups = galleryGroups.length > 0
const mediaFlow = buildProjectMediaFlow(allImages, galleryGroups)
const showGalleryFilters = computed(() =>
  mediaFlow.eligible.length > 10 && hasGalleryGroups
)

const detail = computed(() => buildProjectDetailViewModel({
  project,
  projects,
  imageCount: mediaFlow.eligible.length,
  locale: locale.value
}))

// The finale opens on the Facts Band. Its "end-to-end" cell (design → install) is a claim
// about this project's delivery, so it only shows when the scope really spans design,
// production and construction; every other cell is about the factory and always shows.
const finaleFacts = computed(() => factsFromStats(
  detail.value.coversEndToEnd ? factoryStats : factoryStats.filter(stat => stat.id !== 'end-to-end'),
  t
))

// Each image has one home (DESIGN.md "Case-study images"). The gallery mosaic shows the highlights;
// only a long set has photographs left over, and only those dress the story (one per beat) and the
// material chapter (two). A short set keeps both chapters as text.
const storyImages = mediaFlow.remaining.slice(0, 3)
const materialImages = mediaFlow.remaining.slice(3, 5)

// The case study's one breath photograph (DESIGN.md "Breath"), between the material story and
// the related projects: from the long set's still-unused photographs, or, for a short set, from
// the gallery beyond its first four (a breath is decorative and may repeat one). A project
// without a landscape in that pool has none.
const breathImage = caseStudyBreath(mediaFlow.isLongMedia ? mediaFlow.remaining.slice(5) : allImages.slice(4))

const prettifySlug = (value: string): string =>
  value.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase())

const headline = galleryHeadline(mediaFlow)
const galleryTabs = computed(() => [
  {
    value: 'all',
    label: headline.kind === 'highlights' ? t({ vi: 'Tiêu biểu', en: 'Highlights' }) : t({ vi: 'Tất cả', en: 'All' }),
    count: headline.count
  },
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
    return mediaFlow.inline
  }
  const group = galleryGroups.find(group => group.slug === activeGalleryTab.value)
  return group ? buildProjectMediaFlow(group.images).inline : mediaFlow.inline
})

const lightboxOpen = ref(false)
const lightboxIndex = ref(0)
const lightboxImages = ref<MediaImage[]>([])
const openLightbox = (index: number) => {
  const selected = filteredGallery.value[index]
  const images = mediaFlow.isLongMedia && activeGalleryTab.value === 'all'
    ? mediaFlow.eligible
    : filteredGallery.value
  lightboxImages.value = images
  lightboxIndex.value = selected
    ? Math.max(0, images.findIndex(image => image.path === selected.path))
    : 0
  lightboxOpen.value = true
}
const openFullGallery = () => {
  lightboxImages.value = mediaFlow.eligible
  lightboxIndex.value = 0
  lightboxOpen.value = true
}
watch(activeGalleryTab, () => {
  lightboxOpen.value = false
})

// "Completed" only when the scope includes the build; a design-only project shows "Design year".
const statusText = computed(() => projectStatusText(project, locale.value))

// The full-gallery button names the whole set, so its count matches the lightbox counter.
const fullGalleryLabel = computed(() => t({
  vi: `Xem đủ ${mediaFlow.eligible.length} hình`,
  en: `View all ${mediaFlow.eligible.length} images`
}))

const relatedCards = computed(() => detail.value.relatedProjects.map(item => ({
  item,
  cover: projectCoverAsset(item.mediaId, item.coverImage)
})))

// Keep the existing SEO fallback chain and schema shape intact.
const seoName = computed(() => t(project.seo?.title ?? project.name))
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
  <div class="home-page bg-wood-50 text-ink-950">
    <!-- `home-page` only supplies the shared Headline/Title/Label type tokens that
         `.home-section-heading` and friends read; the case study stays one warm-light canvas. -->
    <ProjectHeroFacts
      :title="t(project.name)"
      :image="heroImage"
      :category="t(categoryLabel)"
      :status="statusText"
      :description="t(project.shortDescription)"
      :facts="detail.facts"
    />

    <ProjectChapterRuler
      :category="t(categoryLabel)"
      :title="t(project.name)"
      :sections="detail.navSections"
    />

    <ProjectStoryChapter
      :overview="t(project.content?.overview)"
      :challenge="t(project.content?.challenge)"
      :solution="t(project.content?.solution)"
      :images="storyImages"
    />

    <section
      v-if="mediaFlow.eligible.length"
      id="gallery"
      data-project-chapter="gallery"
      class="section-y scroll-mt-[calc(var(--header-anchor)+var(--subnav-h)+1.5rem)] border-t border-[var(--rule-light)] bg-[var(--color-ivory)] text-ink-950"
      :data-media-flow="mediaFlow.isLongMedia ? 'long' : 'short'"
      :data-eligible-media="mediaFlow.eligible.length"
      :data-inline-media="filteredGallery.length"
    >
      <div class="shell">
        <!-- A split head: the full-set button sits on the heading's last line. The room filters
             are one row of their own below it, at the full measure. -->
        <SectionHead
          layout="split"
          :eyebrow="t(uiText.labels.completedImages)"
          :title="t(uiText.labels.gallery)"
        >
          <template #aside>
            <div
              v-if="mediaFlow.isLongMedia"
              data-project-full-gallery
            >
              <button
                type="button"
                class="btn-outline"
                @click="openFullGallery"
              >
                {{ fullGalleryLabel }}
              </button>
            </div>
            <p
              v-else
              class="home-lead-text text-ink-600"
            >
              {{ t({ vi: 'Chạm vào một ảnh để xem cỡ lớn.', en: 'Tap a photograph to see it full size.' }) }}
            </p>
          </template>
        </SectionHead>

        <!-- One row of room chips (DESIGN.md Chips): every room stays reachable and the row
             scrolls sideways instead of wrapping into several lines. -->
        <ChipRow
          v-if="showGalleryFilters"
          v-reveal
          data-gallery-filters
          class="reveal mt-8"
          :label="t(projectsPageContent.galleryFilterLabel)"
        >
          <FilterChip
            v-for="tab in galleryTabs"
            :key="tab.value"
            :pressed="activeGalleryTab === tab.value"
            @click="activeGalleryTab = tab.value"
          >
            {{ tab.label }}
            <span
              class="text-xs font-semibold"
              :class="activeGalleryTab === tab.value ? 'text-wood-50/80' : 'text-ink-600'"
            >{{ tab.count }}</span>
          </FilterChip>
        </ChipRow>

        <ProjectGalleryMosaic
          class="mt-8"
          :images="filteredGallery"
          @select="openLightbox"
        />
      </div>
    </section>

    <ProjectDeliveryProof
      :project-name="t(project.name)"
      :scope-items="detail.scopeItems"
      :phases="detail.deliveryPhases"
      :execution-proof="detail.executionProof"
    />

    <ProjectMaterialStory
      :experience="t(project.content?.experience)"
      :highlights="ta(project.content?.designHighlights)"
      :materials="ta(project.content?.materials)"
      :craftsmanship="t(project.content?.craftsmanship)"
      :show-factory-link="detail.scopeItems.some(item => item.key === 'Sản xuất')"
      :quote="project.testimonial
        ? {
          quote: t(project.testimonial.quote),
          author: t(project.testimonial.author),
          role: t(project.testimonial.role)
        }
        : undefined"
      :images="materialImages"
    />

    <BreathImage
      v-if="breathImage"
      :image="breathImage"
    />

    <ProjectRelatedProjects :projects="relatedCards" />
    <ProjectConversionFinale
      :facts="finaleFacts"
      :phone="company.phone"
    />

    <GalleryLightbox
      :images="lightboxImages"
      :index="lightboxIndex"
      :open="lightboxOpen"
      @close="lightboxOpen = false"
      @update:index="lightboxIndex = $event"
    />
  </div>
</template>
