<script setup lang="ts">
import { company } from '~/data/company'
import {
  factoryCapabilities,
  machineryProcessGroups,
  machinerySectionContent,
  productionWorkflow
} from '~/data/factory'
import { homeCapabilities, homeStoryStages, type HomeStoryStageId } from '~/data/home-page'
import { projects } from '~/data/projects'
import { siteImages } from '~/data/site-images'
import { projectMedia, workshopMedia } from '~/media/catalog.generated'
import { projectCoverAsset } from '~/media/project-media'
import type { MediaAsset, MediaImage } from '~/shared/media/types'
import type { Project } from '~/shared/types/project'

const { t } = useLanguage()

const heroImage = projectMedia['khach-san-eo-gio'].cover
const eoGioMedia = projectMedia['khach-san-eo-gio'].images

function requireMedia(asset: MediaAsset | undefined, label: string) {
  if (!asset) throw new Error(`Missing homepage media asset: ${label}`)
  return asset
}

const drawingAsset = requireMedia(
  eoGioMedia.find(asset => asset.path.endsWith('/sanh-don/21.webp')),
  'khach-san-eo-gio/sanh-don/21.webp'
)
const materialAsset = requireMedia(
  eoGioMedia.find(asset => asset.path.endsWith('/can-ho-3-phong-ngu/12.webp')),
  'khach-san-eo-gio/can-ho-3-phong-ngu/12.webp'
)
const factoryAsset = requireMedia(
  workshopMedia.find(asset => asset.path.endsWith('/4.webp')),
  'company/workshop/4.webp'
)
const completedAsset = requireMedia(
  eoGioMedia.find(asset => asset.path.endsWith('/sanh-don/24.webp')),
  'khach-san-eo-gio/sanh-don/24.webp'
)

const decorative = (asset: MediaAsset): MediaImage => ({ ...asset, alt: '' })

const storyImages: Record<HomeStoryStageId, MediaImage> = {
  drawing: decorative(drawingAsset),
  material: decorative(materialAsset),
  factory: decorative(factoryAsset),
  space: decorative(completedAsset)
}

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
      :images="storyImages"
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
