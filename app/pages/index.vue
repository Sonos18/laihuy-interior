<script setup lang="ts">
import { company } from '~/data/company'
import { factoryStats } from '~/data/factory'
import { homeCapabilities, homeStoryStages } from '~/data/home-page'
import { projects } from '~/data/projects'
import { siteImages } from '~/data/site-images'
import { projectMedia } from '~/media/catalog.generated'
import { homeMaterialStoryMedia } from '~/media/home-media'
import { projectCoverAsset } from '~/media/project-media'
import type { MediaAsset } from '~/shared/media/types'
import type { Project } from '~/shared/types/project'
import { splitProjectIndex } from '~/utils/project-index'

const { t } = useLanguage()

const heroImage = projectMedia['khach-san-eo-gio'].cover

// The same rule as /du-an's featured row (end-to-end scope, cover present), so the heading above
// it ("Ba dự án làm trọn từ thiết kế đến lắp đặt") stays true whatever a project's flags say.
const featuredProjects = computed(() =>
  splitProjectIndex(projects, project => projectCoverAsset(project.mediaId, project.coverImage) !== undefined).featured
    .map(project => ({ project, cover: projectCoverAsset(project.mediaId, project.coverImage) }))
    .filter((entry): entry is { project: Project, cover: MediaAsset } => entry.cover !== undefined)
)

// The band shows the shared factory stats, the same facts /nha-xuong shows, so a fact has one
// label, one value and one treatment (figure or phrase) on every page.
const homeMetrics = computed(() => factsFromStats(factoryStats, t))

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
  <div class="home-page">
    <HomeHero :image="heroImage" />
    <FactsBand
      :facts="homeMetrics"
      testid="home-metrics"
      cell-testid="home-metric"
      contained
    />
    <HomeMaterialStory
      :stages="homeStoryStages"
      :images="homeMaterialStoryMedia"
    />
    <HomeCapabilities :capabilities="homeCapabilities" />
    <HomeProjectStage :projects="featuredProjects" />
    <HomeFactoryProof
      :image="siteImages.machineryOverview"
    />
    <HomeProjectCta />
  </div>
</template>
