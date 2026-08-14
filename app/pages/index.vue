<script setup lang="ts">
import { company } from '~/data/company'
import {
  factoryCapabilities,
  machineryProcessGroups,
  machinerySectionContent,
  productionWorkflow
} from '~/data/factory'
import { homeCapabilities, homeStoryStages } from '~/data/home-page'
import { projects } from '~/data/projects'
import { siteImages } from '~/data/site-images'
import { projectMedia } from '~/media/catalog.generated'
import { homeMaterialStoryMedia } from '~/media/home-media'
import { projectCoverAsset } from '~/media/project-media'
import type { MediaAsset } from '~/shared/media/types'
import type { Project } from '~/shared/types/project'

const { t } = useLanguage()

const heroImage = projectMedia['khach-san-eo-gio'].cover

const featuredProjects = computed(() =>
  projects
    .filter(project => project.featured)
    .map(project => ({ project, cover: projectCoverAsset(project.mediaId, project.coverImage) }))
    .filter((entry): entry is { project: Project, cover: MediaAsset } => entry.cover !== undefined)
    .slice(0, 3)
)

const heroMetrics = computed(() => [
  { label: t({ vi: 'Xưởng sản xuất & kho', en: 'Factory & warehouse' }), value: t({ vi: '3.000 m²', en: '3,000 m²' }) },
  { label: t({ vi: 'Năng lực dự án', en: 'Project capacity' }), value: t({ vi: 'Đến 50 phòng/tháng', en: 'Up to 50 rooms/month' }) },
  { label: t({ vi: 'Phạm vi', en: 'Coverage' }), value: t({ vi: 'Thiết kế → bàn giao', en: 'Design → handover' }) },
  { label: t({ vi: 'Thị trường', en: 'Markets' }), value: t({ vi: 'Toàn quốc & xuất khẩu', en: 'Nationwide & export' }) }
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
  <div>
    <HomeHero
      :image="heroImage"
      :metrics="heroMetrics"
    />
    <HomeMaterialStory
      :stages="homeStoryStages"
      :images="homeMaterialStoryMedia"
    />
    <HomeCapabilities :capabilities="homeCapabilities" />
    <HomeProjectStage :projects="featuredProjects" />
    <HomeFactoryProof
      :capabilities="factoryCapabilities"
      :groups="machineryProcessGroups"
      :content="machinerySectionContent"
      :image="siteImages.machineryOverview"
    />
    <HomeProcessRail :steps="productionWorkflow" />
    <HomeProjectCta />
  </div>
</template>
