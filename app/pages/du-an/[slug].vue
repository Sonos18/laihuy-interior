<script setup lang="ts">
import { categoryDefinitions } from '~/data/categories'
import { company } from '~/data/company'
import { factoryStats } from '~/data/factory'
import { projects } from '~/data/projects'
import { siteImages } from '~/data/site-images'
import { uiText } from '~/data/ui'
import {
  buildProjectMediaFlow,
  projectCoverAsset,
  projectGalleryGroups,
  projectImages,
  withAlt
} from '~/media/project-media'
import type { MediaImage } from '~/shared/media/types'
import type { LocalizedText } from '~/shared/types/localization'
import { buildProjectDetailViewModel } from '~/utils/project-detail-view-model'

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
const heroImage = computed<MediaImage>(() =>
  withAlt(projectCoverAsset(project.mediaId, project.coverImage) ?? siteImages.bannerHome, project.name)
)
const allImages: MediaImage[] = projectImages(project.mediaId, project.name)
const leadImage = computed<MediaImage | undefined>(() => allImages[0])
const galleryGroups = projectGalleryGroups(project.mediaId, project.name)
const hasGalleryGroups = galleryGroups.length > 0
const mediaFlow = buildProjectMediaFlow(allImages, galleryGroups)

const detail = computed(() => buildProjectDetailViewModel({
  project,
  projects,
  imageCount: mediaFlow.eligible.length,
  locale: locale.value
}))

const prettifySlug = (value: string): string =>
  value.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase())

const galleryTabs = computed(() => [
  { value: 'all', label: t({ vi: 'Tất cả', en: 'All' }), count: mediaFlow.eligible.length },
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

const statusText = computed(() =>
  project.year ? t({ vi: `Hoàn thành ${t(project.year)}`, en: `Completed ${t(project.year)}` }) : ''
)

const relatedCards = computed(() => detail.value.relatedProjects.map(item => ({
  item,
  cover: projectCoverAsset(item.mediaId, item.coverImage)
})))

const activeSection = ref('story')
onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) activeSection.value = entry.target.id
      }
    },
    { rootMargin: '-45% 0px -50% 0px' }
  )

  for (const section of detail.value.navSections) {
    const element = document.getElementById(section.id)
    if (element) observer.observe(element)
  }

  onUnmounted(() => observer.disconnect())
})

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
  <div class="bg-white">
    <ProjectHeroFacts
      :title="t(project.name)"
      :image="heroImage"
      :category="t(categoryLabel)"
      :status="statusText"
      :description="t(project.shortDescription)"
      :facts="detail.facts"
    />

    <nav
      data-project-subnav
      class="subnav-anchor sticky z-30 border-b border-ink-200 bg-white/95 backdrop-blur-md"
      :aria-label="t({ vi: 'Mục lục dự án', en: 'Case study sections' })"
    >
      <div class="shell flex gap-1 overflow-x-auto py-3">
        <a
          v-for="section in detail.navSections"
          :key="section.id"
          :href="`#${section.id}`"
          class="subnav-chip shrink-0 rounded-full px-4 py-2 text-sm font-bold transition-colors motion-reduce:transition-none"
          :class="activeSection === section.id
            ? 'bg-ink-950 text-white'
            : 'text-ink-500 hover:text-wood-600'"
          :aria-current="activeSection === section.id ? 'location' : undefined"
        >
          {{ section.label }}
        </a>
      </div>
    </nav>

    <ProjectStoryChapter
      :overview="t(project.content?.overview)"
      :challenge="t(project.content?.challenge)"
      :solution="t(project.content?.solution)"
      :lead-image="leadImage"
    />

    <section
      v-if="mediaFlow.eligible.length"
      id="gallery"
      data-project-chapter="gallery"
      class="section-y scroll-mt-[calc(var(--header-h)+var(--subnav-h)+1rem)] bg-ink-50"
      :data-media-flow="mediaFlow.isLongMedia ? 'long' : 'short'"
      :data-eligible-media="mediaFlow.eligible.length"
      :data-inline-media="filteredGallery.length"
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
          <AppGalleryEditorial
            :key="activeGalleryTab"
            :images="filteredGallery"
            selectable
            @select="openLightbox"
          />
        </Transition>

        <div
          v-if="mediaFlow.isLongMedia"
          data-project-full-gallery
          class="mt-10 flex justify-center border-t border-ink-200 pt-8"
        >
          <button
            type="button"
            class="btn-outline"
            :aria-label="`${t(uiText.cta.allProjectImages)} (${mediaFlow.remaining.length})`"
            @click="openFullGallery"
          >
            {{ t(uiText.cta.allProjectImages) }}
            <span
              aria-hidden="true"
              class="text-xs font-black text-wood-600"
            >
              +{{ mediaFlow.remaining.length }}
            </span>
          </button>
        </div>
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
      :images="allImages"
    />

    <ProjectRelatedProjects :projects="relatedCards" />
    <ProjectConversionFinale
      :stats="factoryStats"
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
