<script setup lang="ts">
import { company } from '~/data/company'
import { categoryDefinitions, orderedCategories } from '~/data/categories'
import { projects } from '~/data/projects'
import { projectsPageContent } from '~/data/projects-page'
import { uiText } from '~/data/ui'
import { projectMedia } from '~/media/catalog.generated'
import { projectCoverAsset, withAlt } from '~/media/project-media'
import type { MediaAsset } from '~/shared/media/types'
import type { LocalizedText } from '~/shared/types/localization'
import type { Project, ProjectCategory } from '~/shared/types/project'
import { coversEndToEnd } from '~/utils/project-detail-view-model'

const { t, ta } = useLanguage()

const heroImage = withAlt(projectMedia['codi-villa-phan-thiet'].cover, '')

type CategoryFilter = 'all' | ProjectCategory

const selectedCategory = ref<CategoryFilter>('all')

const byCategoryOrder = (first: Project, second: Project) =>
  categoryDefinitions[first.category].order - categoryDefinitions[second.category].order

const withCover = (project: Project) => ({
  project,
  cover: projectCoverAsset(project.mediaId, project.coverImage)
})

// The featured composition is the work Lai Huy designed, produced and built end to end. It is
// derived from the same scope rule as the case-study view model, never from a list of slugs, and
// it stays on the page whatever the archive filter says.
const featuredProjects = [...projects]
  .filter(coversEndToEnd)
  .sort(byCategoryOrder)
  .map(withCover)
  .filter((entry): entry is { project: Project, cover: MediaAsset } => entry.cover !== undefined)

const featuredSlugs = new Set(featuredProjects.map(({ project }) => project.slug))
const archiveProjects = [...projects]
  .filter(project => !featuredSlugs.has(project.slug))
  .sort(byCategoryOrder)

// Filter options derive from the category source of truth. Only categories with at least one
// archive project appear, preceded by an "All" entry: the filter narrows the archive, so every
// chip has a result.
const categories = computed<{ value: CategoryFilter, label: LocalizedText }[]>(() => [
  { value: 'all', label: uiText.labels.all },
  ...orderedCategories
    .filter(category => archiveProjects.some(project => project.category === category))
    .map(category => ({ value: category, label: categoryDefinitions[category].label }))
])

const filteredArchive = computed(() =>
  archiveProjects
    .filter(project => selectedCategory.value === 'all' || project.category === selectedCategory.value)
    .map(withCover)
)

const scopeLine = (project: Project) => ta(project.scope).join(' · ')

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
       index is two chapters: the end-to-end projects as the editorial lead + satellites
       composition on Linen, then a quieter archive grid on Raw Silk with the category filter. The
       closing CTA is the shared `.section-cta` band. -->
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

    <section
      v-if="featuredProjects.length"
      data-testid="projects-featured"
      class="section-y"
    >
      <div class="shell">
        <!-- The page's lead section: its heading takes the Statement role (DESIGN.md). -->
        <SectionHead
          layout="stacked"
          statement
          :eyebrow="t(projectsPageContent.featured.eyebrow)"
          :title="t(projectsPageContent.featured.title)"
          :lead="t(projectsPageContent.featured.lead)"
        />

        <ProjectStage
          :projects="featuredProjects"
          :badges="false"
          class="mt-10 md:mt-12 lg:mt-16"
        />
      </div>
    </section>

    <section
      data-testid="projects-archive"
      class="section-y border-t border-[var(--rule-light)] bg-[var(--color-ivory)]"
    >
      <div class="shell">
        <SectionHead
          layout="rail"
          :eyebrow="t(projectsPageContent.archive.eyebrow)"
          :title="t(projectsPageContent.archive.title)"
          :lead="t(projectsPageContent.archive.lead)"
        />

        <!-- DESIGN.md Chips: one row that scrolls sideways when the options are wider than it,
             so seven categories never become several rows. The filter narrows the archive only;
             the end-to-end projects above stay. -->
        <ChipRow
          v-reveal
          class="reveal mt-10"
          :label="t(projectsPageContent.filterLabel)"
        >
          <FilterChip
            v-for="category in categories"
            :key="category.value"
            :pressed="selectedCategory === category.value"
            @click="selectedCategory = category.value"
          >
            {{ t(category.label) }}
          </FilterChip>
        </ChipRow>

        <!-- Announces the result count to screen readers after each filter change. -->
        <p
          class="sr-only"
          role="status"
          aria-live="polite"
        >
          {{ t({
            vi: `${filteredArchive.length} dự án`,
            en: `${filteredArchive.length} projects`
          }) }}
        </p>

        <!-- One chip type per card: the category is the Label line; area and scope are plain
             meta text. -->
        <div
          data-testid="projects-grid"
          class="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          <NuxtLink
            v-for="{ project, cover } in filteredArchive"
            :key="project.slug"
            :to="`/du-an/${project.slug}`"
            class="group flex flex-col overflow-hidden card-link"
          >
            <div
              v-if="cover"
              class="relative aspect-[3/2] overflow-hidden bg-ink-100"
            >
              <NuxtImg
                :src="cover.path"
                :alt="t(project.name)"
                :width="cover.width"
                :height="cover.height"
                sizes="sm:100vw md:50vw lg:33vw xl:25vw"
                loading="lazy"
                class="h-full w-full object-cover transition-transform duration-[var(--dur-image)] ease-[var(--ease-editorial)] group-hover:scale-[1.03] group-focus-visible:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100 motion-reduce:group-focus-visible:scale-100"
              />
            </div>
            <div :class="['flex grow flex-col p-5', cover ? 'border-t border-[var(--rule-light)]' : '']">
              <p class="eyebrow">
                {{ t(categoryDefinitions[project.category].label) }}
              </p>
              <h3 class="home-card-heading mt-2 text-ink-950">
                {{ t(project.name) }}
              </h3>
              <p
                v-if="project.area"
                class="home-meta-text mt-3 font-semibold text-ink-900"
              >
                {{ t(project.area) }}
              </p>
              <p
                v-if="scopeLine(project)"
                class="home-meta-text mt-1 text-ink-600"
              >
                {{ scopeLine(project) }}
              </p>
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
