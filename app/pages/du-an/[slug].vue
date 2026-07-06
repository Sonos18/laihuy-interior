<script setup lang="ts">
import { company } from '~/data/company'
import { categoryDefinitions } from '~/data/categories'
import { projects } from '~/data/projects'
import { siteImages } from '~/data/site-images'
import { uiText } from '~/data/ui'
import { projectCover, projectCoverAsset, projectImages } from '~/media/project-media'
import type { MediaImage } from '~/shared/media/types'

type Fact = {
  label: string
  value: string
  icon: string
}

const { t, ta } = useLanguage()
const { resolve: mediaUrl } = useMediaUrl()
const route = useRoute()
const slug = Array.isArray(route.params.slug)
  ? route.params.slug[0]
  : route.params.slug

const project = projects.find(item => item.slug === slug)

// Hero / OG cover, honouring the project's optional cover override.
const heroImage = computed<MediaImage>(() =>
  projectCover(project?.mediaId, project?.name ?? '', project?.coverImage) ?? siteImages.bannerHome
)

const allImages: MediaImage[] = projectImages(project?.mediaId, project?.name ?? '')

// The cover opens the gallery as a full-width lead at its natural ratio; the rest
// flow into the aspect-aware masonry. `leadImage` is undefined for projects with
// no media, so the lead is guarded to preserve the existing no-image behaviour.
const leadImage = allImages[0]
const galleryImages = allImages.slice(1)

const facts = computed<Fact[]>(() => {
  if (!project) {
    return []
  }

  return [
    {
      label: t(uiText.projectFacts.category),
      value: t(categoryDefinitions[project.category].label),
      icon: 'i-lucide-tag'
    },
    project.location
      ? { label: t(uiText.projectFacts.location), value: t(project.location), icon: 'i-lucide-map-pin' }
      : null,
    project.area
      ? { label: t(uiText.projectFacts.scale), value: t(project.area), icon: 'i-lucide-ruler' }
      : null,
    project.year
      ? { label: t(uiText.projectFacts.year), value: t(project.year), icon: 'i-lucide-calendar' }
      : null,
    project.style
      ? { label: t({ vi: 'Phong cách', en: 'Style' }), value: t(project.style), icon: 'i-lucide-palette' }
      : null,
    ta(project.scope).length
      ? { label: t(uiText.projectFacts.scope), value: ta(project.scope).join(', '), icon: 'i-lucide-list-checks' }
      : null
  ].filter((item): item is Fact => Boolean(item))
})

const relatedCandidates = project
  ? projects
      .filter(item => item.slug !== project.slug)
      .sort((first, second) => {
        const firstScore = first.category === project.category ? 0 : 1
        const secondScore = second.category === project.category ? 0 : 1

        return firstScore - secondScore
      })
      .map(item => ({ item, cover: projectCoverAsset(item.mediaId, item.coverImage) }))
  : []

const relatedProjects = relatedCandidates.slice(0, 3)

const seoName = computed(() => t(project?.seo?.title ?? project?.name))
const seoTitle = computed(() =>
  project
    ? `${seoName.value} | ${t({ vi: 'Dự án nội thất', en: 'Interior project' })} | Lai Huy Interior`
    : t(company.seo.projects.title)
)
const seoDescription = computed(() =>
  project
    ? t(project.seo?.description) || t(project.content?.overview) || t(project.shortDescription)
    : t(company.seo.projects.description)
)
const seoKeywords = computed(() => (project ? ta(project.seo?.keywords).join(', ') : ''))

useSeoMeta({
  title: seoTitle,
  description: seoDescription,
  keywords: seoKeywords,
  ogTitle: computed(() => (project ? `${seoName.value} | Lai Huy Interior` : t(company.seo.projects.title))),
  ogDescription: seoDescription,
  ogImage: computed(() => mediaUrl(heroImage.value.path))
})
</script>

<template>
  <div class="bg-white">
    <template v-if="!project">
      <section class="min-h-screen px-6 py-32">
        <div class="mx-auto max-w-3xl text-center">
          <p class="text-8xl font-black text-wood-500">
            404
          </p>
          <h1 class="mt-6 text-3xl font-black text-ink-950 md:text-5xl">
            {{ t({ vi: 'Không tìm thấy dự án', en: 'Project not found' }) }}
          </h1>
          <p class="mx-auto mt-4 max-w-xl text-lg leading-8 text-ink-600">
            {{ t({ vi: 'Dự án bạn đang tìm kiếm không tồn tại hoặc đã được cập nhật sang một đường dẫn khác.', en: 'The project you are looking for does not exist or has moved to another URL.' }) }}
          </p>
          <NuxtLink
            to="/du-an"
            class="btn-dark mt-9"
          >
            {{ t(uiText.cta.backToProjects) }}
          </NuxtLink>
        </div>
      </section>
    </template>

    <template v-else>
      <section class="relative min-h-screen overflow-hidden bg-ink-950 text-white">
        <NuxtImg
          :src="heroImage.path"
          :alt="t(project.name)"
          :width="heroImage.width"
          :height="heroImage.height"
          sizes="sm:100vw md:100vw lg:100vw xl:100vw"
          loading="eager"
          fetchpriority="high"
          class="absolute inset-0 h-full w-full object-cover"
        />
        <div class="absolute inset-0 bg-ink-950/72" />
        <div class="absolute inset-x-0 bottom-0 h-52 bg-linear-to-t from-ink-950 to-transparent" />

        <div class="section-shell relative z-10 flex min-h-screen flex-col justify-end px-6 pb-14 pt-32">
          <NuxtLink
            to="/du-an"
            class="mb-8 inline-flex w-fit items-center gap-2 text-sm font-bold text-white/68 transition-colors hover:text-white"
          >
            <Icon
              name="i-lucide-arrow-left"
              class="h-4 w-4"
            />
            {{ t({ vi: 'Dự án', en: 'Projects' }) }}
          </NuxtLink>

          <p class="eyebrow mb-5 text-wood-300">
            {{ t(categoryDefinitions[project.category].label) }}
          </p>
          <h1 class="max-w-5xl text-4xl font-black uppercase leading-tight md:text-6xl lg:text-7xl">
            {{ t(project.name) }}
          </h1>
          <p class="mt-6 max-w-3xl text-lg leading-8 text-white/76 md:text-xl">
            {{ t(project.shortDescription) }}
          </p>

          <div class="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div
              v-for="fact in facts.slice(0, 4)"
              :key="fact.label"
              class="rounded-2xl border border-white/12 bg-white/[0.04] p-5 backdrop-blur-sm"
            >
              <p class="text-xs uppercase tracking-[0.18em] text-white/45">
                {{ fact.label }}
              </p>
              <p class="mt-2 text-lg font-black text-white">
                {{ fact.value }}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section class="border-b border-ink-200 bg-white px-6 py-10">
        <div class="section-shell grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div
            v-for="fact in facts"
            :key="fact.label"
            class="border-l border-ink-200 pl-5"
          >
            <Icon
              :name="fact.icon"
              class="mb-4 h-5 w-5 text-wood-500"
            />
            <p class="text-xs font-bold uppercase tracking-[0.18em] text-ink-400">
              {{ fact.label }}
            </p>
            <p class="mt-2 text-sm font-bold leading-6 text-ink-900">
              {{ fact.value }}
            </p>
          </div>
        </div>
      </section>

      <section
        v-if="project.content?.overview"
        class="section-spacing bg-white"
      >
        <div class="section-shell grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p class="eyebrow">
              {{ t(uiText.labels.overview) }}
            </p>
          </div>
          <div class="space-y-6 text-lg leading-9 text-ink-600">
            <p>{{ t(project.content.overview) }}</p>
            <p
              v-if="project.content?.challenge"
              class="border-l-4 border-wood-500 pl-6 text-ink-800"
            >
              <strong>{{ t(uiText.labels.challenge) }}:</strong>
              {{ t(project.content.challenge) }}
            </p>
          </div>
        </div>
      </section>

      <section
        v-if="project.content?.solution || ta(project.content?.designHighlights).length"
        class="section-spacing bg-ink-50"
      >
        <div class="section-shell grid gap-10 lg:grid-cols-2">
          <div v-if="project.content?.solution">
            <p class="eyebrow">
              {{ t(uiText.labels.solution) }}
            </p>
            <p class="mt-6 text-lg leading-8 text-ink-600">
              {{ t(project.content.solution) }}
            </p>
          </div>
          <div v-if="ta(project.content?.designHighlights).length">
            <p class="eyebrow">
              {{ t({ vi: 'Điểm nhấn thiết kế', en: 'Design highlights' }) }}
            </p>
            <div class="mt-6 space-y-4">
              <div
                v-for="highlight in ta(project.content?.designHighlights)"
                :key="highlight"
                class="border-b border-ink-200 pb-4 text-base font-semibold leading-7 text-ink-800"
              >
                {{ highlight }}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        v-if="ta(project.content?.materials).length"
        class="section-spacing bg-ink-950 text-white"
      >
        <div class="section-shell">
          <div class="mb-10 max-w-3xl">
            <p class="eyebrow text-wood-300">
              {{ t({ vi: 'Vật liệu & hoàn thiện', en: 'Materials and finishes' }) }}
            </p>
            <h2 class="mt-4 text-3xl font-black uppercase leading-tight md:text-5xl">
              {{ t({ vi: 'Bảng vật liệu định hình cảm giác không gian', en: 'The material palette that shapes the space' }) }}
            </h2>
          </div>
          <div class="grid gap-4 md:grid-cols-2">
            <div
              v-for="material in ta(project.content?.materials)"
              :key="material"
              class="rounded-2xl border border-white/12 p-6"
            >
              <div class="mb-5 h-px w-12 bg-wood-300" />
              <p class="text-lg leading-8 text-white/72">
                {{ material }}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        v-if="project.content?.craftsmanship"
        class="section-spacing bg-white"
      >
        <div class="section-shell grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p class="eyebrow">
              {{ t({ vi: 'Sản xuất & thi công', en: 'Craftsmanship' }) }}
            </p>
          </div>
          <div class="text-lg leading-9 text-ink-600">
            <p>{{ t(project.content.craftsmanship) }}</p>
          </div>
        </div>
      </section>

      <section
        v-if="project.content?.experience"
        class="section-spacing bg-ink-50"
      >
        <div class="section-shell grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p class="eyebrow">
              {{ t({ vi: 'Trải nghiệm', en: 'Experience' }) }}
            </p>
          </div>
          <div class="text-lg leading-9 text-ink-600">
            <p>{{ t(project.content.experience) }}</p>
          </div>
        </div>
      </section>

      <section
        v-if="allImages.length"
        class="section-spacing bg-white"
      >
        <div class="section-shell">
          <div class="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p class="eyebrow">
                {{ t(uiText.labels.completedImages) }}
              </p>
              <h2 class="mt-4 text-3xl font-black uppercase text-ink-950 md:text-5xl">
                {{ t(uiText.labels.gallery) }}
              </h2>
            </div>
            <p class="max-w-md text-sm leading-6 text-ink-500">
              {{ t({ vi: 'Bộ hình ghi lại các khu vực đã hoàn thiện, giúp chủ đầu tư đánh giá vật liệu, tỷ lệ và chất lượng thi công.', en: 'The gallery records completed areas so owners can review materials, proportions, and finishing quality.' }) }}
            </p>
          </div>

          <div
            v-if="leadImage"
            class="w-full"
            :style="{ aspectRatio: `${leadImage.width} / ${leadImage.height}` }"
          >
            <MediaImage
              :image="leadImage"
              preset="full"
              class="h-full w-full rounded-2xl"
              img-class="rounded-2xl"
            />
          </div>
          <AppGalleryGrid
            :images="galleryImages"
            class="mt-5"
          />
        </div>
      </section>

      <section class="bg-ink-950 px-6 py-16 text-white">
        <div class="section-shell grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p class="eyebrow text-wood-300">
              {{ t({ vi: 'Hợp tác cùng Lai Huy', en: 'Work with Lai Huy' }) }}
            </p>
            <h2 class="mt-4 max-w-3xl text-3xl font-black uppercase md:text-5xl">
              {{ t({ vi: 'Bạn có một dự án cần thiết kế và thi công?', en: 'Have a project you’d like to design and build?' }) }}
            </h2>
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
              class="btn-secondary"
            >
              {{ t(uiText.cta.contact) }}
            </a>
          </div>
        </div>
      </section>

      <section
        v-if="relatedProjects.length"
        class="section-spacing bg-ink-50"
      >
        <div class="section-shell">
          <div class="mb-10 flex items-end justify-between gap-6">
            <div>
              <p class="eyebrow">
                {{ t(uiText.labels.exploreMore) }}
              </p>
              <h2 class="mt-4 text-3xl font-black uppercase text-ink-950 md:text-5xl">
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
              v-for="{ item, cover } in relatedProjects"
              :key="item.slug"
              :to="`/du-an/${item.slug}`"
              class="group block overflow-hidden rounded-2xl bg-white"
            >
              <NuxtImg
                v-if="cover"
                :src="cover.path"
                :alt="t(item.name)"
                :width="cover.width"
                :height="cover.height"
                sizes="sm:100vw md:33vw"
                loading="lazy"
                class="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
              />
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
    </template>
  </div>
</template>
