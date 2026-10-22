<script setup lang="ts">
import { company } from '~/data/company'
import { categoryDefinitions, orderedCategories } from '~/data/categories'
import { projects } from '~/data/projects'
import { uiText } from '~/data/ui'
import { projectMedia } from '~/media/catalog.generated'
import { projectCoverAsset, withAlt } from '~/media/project-media'
import type { LocalizedText } from '~/shared/types/localization'
import type { Project, ProjectCategory } from '~/shared/types/project'

const { t, ta } = useLanguage()

const heroImage = withAlt(projectMedia['codi-villa-phan-thiet'].cover, '')

type CategoryFilter = 'all' | ProjectCategory

const selectedCategory = ref<CategoryFilter>('all')

// Filter options derive from the category source of truth. Only categories with
// at least one project appear, preceded by an "All" entry.
const categories = computed<{ value: CategoryFilter, label: LocalizedText }[]>(() => [
  { value: 'all', label: { vi: 'Tất cả', en: 'All' } },
  ...orderedCategories
    .filter(category => projects.some(project => project.category === category))
    .map(category => ({ value: category, label: categoryDefinitions[category].label }))
])

const sortedProjects = computed(() =>
  [...projects].sort((first, second) =>
    categoryDefinitions[first.category].order - categoryDefinitions[second.category].order
  )
)

const filteredProjects = computed(() =>
  sortedProjects.value
    .filter(project => selectedCategory.value === 'all' || project.category === selectedCategory.value)
    .map(project => ({ project, cover: projectCoverAsset(project.mediaId, project.coverImage) }))
)

const getProjectMetric = (project: Project) =>
  t(project.area)
  || ta(project.scope)[0]
  || t(categoryDefinitions[project.category].label)

const seoTitle = computed(() => t(company.seo.projects.title))
const seoDescription = computed(() => t(company.seo.projects.description))

usePageSeo({
  path: '/du-an',
  title: seoTitle,
  description: seoDescription,
  imagePath: company.seo.projects.ogImage.path,
  jsonLd: ({ base, canonical }) => [
    buildBreadcrumbLd(base, t, [
      { name: { vi: 'Trang chủ', en: 'Home' }, path: '/' },
      { name: { vi: 'Dự án', en: 'Projects' }, path: '/du-an' }
    ]),
    buildOrganizationLd(base, t),
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      '@id': `${canonical}#collection`,
      'url': canonical,
      'name': seoTitle.value,
      'description': seoDescription.value,
      'about': { '@id': `${base}#organization` },
      'mainEntity': {
        '@type': 'ItemList',
        'numberOfItems': projects.length,
        'itemListElement': projects.map((project, index) => ({
          '@type': 'ListItem',
          'position': index + 1,
          'name': t(project.name),
          'item': `${base}/du-an/${project.slug}`
        }))
      }
    }
  ]
})
</script>

<template>
  <!-- `home-page` only supplies the shared Headline/Title/Label type tokens. Below the hero the
       index is Linen: Paper White project cards sit directly on it, and the closing CTA is the
       shared `.section-cta` band. -->
  <div class="home-page bg-wood-50 text-ink-950">
    <AppHero
      :topic="t(uiText.labels.caseStudies)"
      :title="t({ vi: 'Khách sạn, villa', en: 'Hotels, villas' })"
      :special-title="t({ vi: 'và công trình lớn', en: 'and large-scale builds' })"
      :subtitle="t({ vi: 'Các dự án được trình bày theo hướng năng lực triển khai: phạm vi công việc, vật liệu, tiến độ và chất lượng bàn giao.', en: 'Projects are presented as delivery case studies, showing scope, materials, schedule, and handover quality.' })"
      :image="heroImage"
      mode="caption"
      atmosphere="dark"
      focal="50% 42%"
    />

    <section class="section-y">
      <div class="shell">
        <!-- DESIGN.md Chips: pill, Action type, Plaster border and Walnut Grey text at rest, Mid
             Timber border and Deep Timber text on hover, Charcoal Ink fill with Linen text when
             active. 44px minimum hit target. -->
        <div class="mb-10 flex flex-wrap gap-3">
          <button
            v-for="category in categories"
            :key="category.value"
            type="button"
            :class="[
              'inline-flex min-h-11 items-center rounded-full border px-5 py-3 text-sm font-semibold tracking-[0.01em] transition-[border-color,color,background-color] duration-[var(--dur-hover)] ease-[var(--ease-editorial)] motion-reduce:transition-none',
              selectedCategory === category.value
                ? 'border-ink-900 bg-ink-900 text-wood-50'
                : 'border-ink-200 bg-transparent text-ink-600 hover:border-wood-500 hover:text-wood-600'
            ]"
            :aria-pressed="selectedCategory === category.value"
            @click="selectedCategory = category.value"
          >
            {{ t(category.label) }}
          </button>
        </div>

        <!-- Announces the result count to screen readers after each filter change. -->
        <p
          class="sr-only"
          role="status"
          aria-live="polite"
        >
          {{ t({
            vi: `${filteredProjects.length} dự án`,
            en: `${filteredProjects.length} projects`
          }) }}
        </p>

        <div
          data-testid="projects-grid"
          class="grid gap-7 sm:grid-cols-2 lg:grid-cols-3"
        >
          <NuxtLink
            v-for="{ project, cover } in filteredProjects"
            :key="project.slug"
            :to="`/du-an/${project.slug}`"
            class="group flex flex-col overflow-hidden card-link"
          >
            <div
              v-if="cover"
              class="relative aspect-[4/3] overflow-hidden bg-ink-100"
            >
              <NuxtImg
                :src="cover.path"
                :alt="t(project.name)"
                :width="cover.width"
                :height="cover.height"
                sizes="sm:100vw md:50vw lg:33vw"
                loading="lazy"
                class="h-full w-full object-cover transition-transform duration-[var(--dur-image)] ease-[var(--ease-editorial)] group-hover:scale-[1.03] group-focus-visible:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100 motion-reduce:group-focus-visible:scale-100"
              />
              <div class="home-eyebrow-text absolute left-4 top-4 rounded-[4px] bg-white/92 px-3 py-1.5 text-ink-950">
                {{ t(categoryDefinitions[project.category].label) }}
              </div>
            </div>
            <div :class="['flex grow flex-col p-6 lg:p-7', cover ? 'border-t border-[var(--rule-light)]' : '']">
              <div class="home-meta-text mb-4 inline-flex self-start rounded-[4px] border border-ink-200 px-3 py-1.5 font-semibold text-wood-600">
                {{ getProjectMetric(project) }}
              </div>
              <p
                v-if="!cover"
                class="eyebrow mb-3"
              >
                {{ t(categoryDefinitions[project.category].label) }}
              </p>
              <h2 class="home-card-heading text-ink-950">
                {{ t(project.name) }}
              </h2>
              <p class="mt-3 text-base leading-[1.7] text-ink-600">
                {{ t(project.shortDescription) }}
              </p>
              <div
                v-if="ta(project.scope).length"
                class="mt-auto flex flex-wrap gap-2 pt-5"
              >
                <span
                  v-for="scope in ta(project.scope).slice(0, 3)"
                  :key="scope"
                  class="home-meta-text rounded-[4px] bg-[var(--color-ivory)] px-3 py-1.5 font-semibold text-ink-600"
                >
                  {{ scope }}
                </span>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <section class="section-cta">
      <div class="shell grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <p class="eyebrow">
            {{ t(uiText.cta.hotelConsult) }}
          </p>
          <h2 class="home-section-heading mt-4 max-w-3xl text-ink-950">
            {{ t({ vi: 'Bạn cần đội ngũ sản xuất và thi công cho dự án tiếp theo?', en: 'Need a production and contracting team for your next project?' }) }}
          </h2>
        </div>
        <NuxtLink
          to="/lien-he"
          class="btn-bronze"
          data-testid="projects-cta"
        >
          {{ t(uiText.cta.sendDrawings) }}
        </NuxtLink>
      </div>
    </section>
  </div>
</template>
