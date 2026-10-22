<script setup lang="ts">
import { company } from '~/data/company'
import {
  factoryCapabilities,
  factoryStats,
  machinerySectionContent,
  productionWorkflow
} from '~/data/factory'
import { homeCapabilities, homeStoryStages } from '~/data/home-page'
import { projects } from '~/data/projects'
import { siteImages } from '~/data/site-images'
import { projectMedia } from '~/media/catalog.generated'
import { breathMedia } from '~/media/breath-media'
import { homeMaterialStoryMedia } from '~/media/home-media'
import { projectCoverAsset } from '~/media/project-media'
import type { FactoryStat } from '~/data/factory'
import type { MediaAsset } from '~/shared/media/types'
import type { Project } from '~/shared/types/project'
import type { Fact } from '~/utils/facts'

const { t } = useLanguage()

const heroImage = projectMedia['khach-san-eo-gio'].cover

const featuredProjects = computed(() =>
  projects
    .filter(project => project.featured)
    .map(project => ({ project, cover: projectCoverAsset(project.mediaId, project.coverImage) }))
    .filter((entry): entry is { project: Project, cover: MediaAsset } => entry.cover !== undefined)
    .slice(0, 3)
)

// The band's copy is the home page's own, but whether a value is a figure (Stat role) or a phrase
// (Title role) is a property of the fact, read from the shared factory stats so the same fact has
// one treatment on every page that shows it.
const isFigure = (id: FactoryStat['id']) => factoryStats.find(stat => stat.id === id)?.figure ?? false

const homeMetrics = computed<Fact[]>(() => [
  { id: 'footprint', label: t({ vi: 'Xưởng sản xuất & kho', en: 'Factory & warehouse' }), value: t({ vi: '3.000 m²', en: '3,000 m²' }), figure: isFigure('footprint') },
  { id: 'throughput', label: t({ vi: 'Năng lực dự án', en: 'Project capacity' }), value: t({ vi: 'Đến 50 phòng/tháng', en: 'Up to 50 rooms/month' }), figure: isFigure('throughput') },
  { id: 'end-to-end', label: t({ vi: 'Phạm vi', en: 'Coverage' }), value: t({ vi: 'Thiết kế → bàn giao', en: 'Design → handover' }), figure: isFigure('end-to-end') },
  { id: 'reach', label: t({ vi: 'Thị trường', en: 'Markets' }), value: t({ vi: 'Toàn quốc & xuất khẩu', en: 'Nationwide & export' }), figure: isFigure('reach') }
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
  <div class="home-page">
    <HomeHero :image="heroImage" />
    <FactsBand
      :facts="homeMetrics"
      testid="home-metrics"
      cell-testid="home-metric"
    />
    <HomeMaterialStory
      :stages="homeStoryStages"
      :images="homeMaterialStoryMedia"
    />
    <HomeCapabilities :capabilities="homeCapabilities" />
    <BreathImage :image="breathMedia.home" />
    <HomeProjectStage :projects="featuredProjects" />
    <HomeFactoryProof
      :capabilities="factoryCapabilities"
      :content="machinerySectionContent"
      :image="siteImages.machineryOverview"
      :steps="productionWorkflow"
    />
    <HomeProjectCta />
  </div>
</template>
