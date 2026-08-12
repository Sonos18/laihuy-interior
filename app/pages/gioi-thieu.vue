<script setup lang="ts">
import {
  aboutMediaAlt,
  aboutPageContent,
  aboutProjectSlugs,
  aboutProofStatIds
} from '~/data/about'
import { company } from '~/data/company'
import { factoryStats, productionWorkflow } from '~/data/factory'
import { projects } from '~/data/projects'
import { companyMedia } from '~/media/catalog.generated'
import { requireWorkshopAsset } from '~/media/factory-media'
import { projectCover, withAlt } from '~/media/project-media'

const { t } = useLanguage()
const { resolve: mediaUrl } = useMediaUrl()

const heroImage = withAlt(requireWorkshopAsset('3.webp'), aboutMediaAlt.hero)
const factoryImages = {
  main: withAlt(requireWorkshopAsset('4.webp'), aboutMediaAlt.factory),
  machinery: withAlt(requireWorkshopAsset('8.webp'), aboutMediaAlt.machinery),
  craft: withAlt(companyMedia.companyStory, aboutMediaAlt.craft)
}

const proofStats = aboutProofStatIds.flatMap((id) => {
  const stat = factoryStats.find(item => item.id === id)
  return stat ? [stat] : []
})

const projectFeatures = aboutProjectSlugs.flatMap((slug) => {
  const project = projects.find(item => item.slug === slug)
  if (!project) return []

  const image = projectCover(project.mediaId, project.name, project.coverImage)
  return image ? [{ project, image }] : []
})

const phoneHref = `tel:${company.phone.replaceAll(' ', '')}`
const seoTitle = computed(() => t(company.seo.about.title))
const seoDescription = computed(() => t(company.seo.about.description))

usePageSeo({
  path: '/gioi-thieu',
  title: seoTitle,
  description: seoDescription,
  imagePath: heroImage.path,
  jsonLd: ({ base, canonical }) => [
    buildBreadcrumbLd(base, t, [
      { name: { vi: 'Trang chủ', en: 'Home' }, path: '/' },
      { name: { vi: 'Giới thiệu', en: 'About' }, path: '/gioi-thieu' }
    ]),
    buildOrganizationLd(base, t),
    {
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      '@id': `${canonical}#about`,
      'url': canonical,
      'name': seoTitle.value,
      'description': seoDescription.value,
      'primaryImageOfPage': mediaUrl(heroImage.path, { width: 1600 }),
      'about': { '@id': `${base}#organization` },
      'mainEntity': { '@id': `${base}#organization` }
    }
  ]
})
</script>

<template>
  <div class="bg-white">
    <div data-about-chapter="promise">
      <AppHero
        data-testid="about-hero"
        :topic="t(aboutPageContent.hero.topic)"
        :title="t(aboutPageContent.hero.title)"
        :special-title="t(aboutPageContent.hero.specialTitle)"
        :subtitle="t(aboutPageContent.hero.subtitle)"
        :image="heroImage"
        focal="50% 40%"
      >
        <template #actions>
          <NuxtLink
            to="/lien-he"
            class="btn-primary"
          >
            {{ t(aboutPageContent.hero.primaryCta) }}
            <Icon
              name="i-lucide-arrow-right"
              class="h-4 w-4"
              aria-hidden="true"
            />
          </NuxtLink>
          <NuxtLink
            to="/du-an"
            class="btn-secondary"
          >
            {{ t(aboutPageContent.hero.secondaryCta) }}
          </NuxtLink>
        </template>
      </AppHero>

      <AboutProofStrip :stats="proofStats" />
    </div>

    <section
      data-about-chapter="problem"
      class="section-y bg-ink-50"
    >
      <div class="shell">
        <p
          v-reveal
          class="eyebrow reveal"
        >
          {{ t(aboutPageContent.problem.eyebrow) }}
        </p>
        <h2
          v-reveal="80"
          class="text-section-title reveal mt-4 max-w-4xl font-black uppercase text-ink-950"
        >
          {{ t(aboutPageContent.problem.title) }}
        </h2>
        <p
          v-reveal="140"
          class="measure-lead reveal mt-5 text-ink-600"
        >
          {{ t(aboutPageContent.problem.description) }}
        </p>

        <div class="mt-12 grid gap-10 xl:grid-cols-[0.72fr_1.28fr] xl:gap-16">
          <p
            v-reveal
            class="reveal border-l-2 border-wood-500 pl-6 text-xl font-black leading-8 text-ink-950"
          >
            {{ t(aboutPageContent.problem.lead) }}
          </p>
          <ol class="border-t border-ink-200">
            <li
              v-for="(response, index) in aboutPageContent.problem.responses"
              :key="response.id"
              v-reveal="index * 70"
              class="reveal grid gap-3 border-b border-ink-200 py-6 sm:grid-cols-[3rem_0.8fr_1.2fr] sm:gap-6"
            >
              <span class="text-xs font-black tracking-[0.16em] text-wood-600">
                {{ String(index + 1).padStart(2, '0') }}
              </span>
              <h3 class="text-lg font-black text-ink-950">
                {{ t(response.title) }}
              </h3>
              <p class="text-sm leading-6 text-ink-600">
                {{ t(response.description) }}
              </p>
            </li>
          </ol>
        </div>
      </div>
    </section>

    <AboutWorkflowRail
      :content="aboutPageContent.workflow"
      :steps="productionWorkflow"
    />

    <section
      data-about-chapter="factory"
      class="section-y bg-white"
    >
      <div class="shell">
        <p
          v-reveal
          class="eyebrow reveal"
        >
          {{ t(aboutPageContent.factory.eyebrow) }}
        </p>
        <h2
          v-reveal="80"
          class="text-section-title reveal mt-4 max-w-4xl font-black uppercase text-ink-950"
        >
          {{ t(aboutPageContent.factory.title) }}
        </h2>
        <p
          v-reveal="140"
          class="measure-lead reveal mt-5 text-ink-600"
        >
          {{ t(aboutPageContent.factory.description) }}
        </p>

        <div
          data-testid="about-factory-grid"
          class="mt-10 grid gap-5 md:grid-cols-[1.15fr_0.85fr]"
        >
          <MediaImage
            :image="factoryImages.main"
            sizes="sm:100vw md:58vw"
            class="min-h-72 rounded-2xl md:min-h-full"
            img-class="object-center"
          />
          <div class="grid gap-5">
            <MediaImage
              :image="factoryImages.machinery"
              sizes="sm:100vw md:42vw"
              class="aspect-[16/10] rounded-2xl"
              img-class="object-center"
            />
            <MediaImage
              :image="factoryImages.craft"
              sizes="sm:100vw md:42vw"
              class="aspect-[16/10] rounded-2xl"
              img-class="object-center"
            />
          </div>
        </div>

        <NuxtLink
          v-reveal="120"
          to="/nha-xuong"
          class="btn-dark reveal mt-8"
        >
          {{ t(aboutPageContent.factory.cta) }}
          <Icon
            name="i-lucide-arrow-right"
            class="h-4 w-4"
            aria-hidden="true"
          />
        </NuxtLink>
      </div>
    </section>

    <section
      v-if="projectFeatures.length"
      data-about-chapter="projects"
      class="section-y bg-ink-50"
    >
      <div class="shell">
        <p
          v-reveal
          class="eyebrow reveal"
        >
          {{ t(aboutPageContent.projects.eyebrow) }}
        </p>
        <h2
          v-reveal="80"
          class="text-section-title reveal mt-4 max-w-4xl font-black uppercase text-ink-950"
        >
          {{ t(aboutPageContent.projects.title) }}
        </h2>
        <p
          v-reveal="140"
          class="measure-lead reveal mt-5 text-ink-600"
        >
          {{ t(aboutPageContent.projects.description) }}
        </p>

        <div
          data-testid="about-project-grid"
          class="mt-10 grid gap-5"
          :class="projectFeatures.length > 1 ? 'xl:grid-cols-[3fr_2fr]' : 'grid-cols-1'"
        >
          <AboutProjectFeature
            v-for="(feature, index) in projectFeatures"
            :key="feature.project.slug"
            :project="feature.project"
            :image="feature.image"
            :labels="aboutPageContent.projects.labels"
            :emphasis="index === 0 ? 'primary' : 'secondary'"
          />
        </div>
      </div>
    </section>

    <section
      data-about-chapter="fit"
      class="section-y bg-white"
    >
      <div class="shell">
        <p
          v-reveal
          class="eyebrow reveal"
        >
          {{ t(aboutPageContent.fit.eyebrow) }}
        </p>
        <h2
          v-reveal="80"
          class="text-section-title reveal mt-4 max-w-4xl font-black uppercase text-ink-950"
        >
          {{ t(aboutPageContent.fit.title) }}
        </h2>
        <ol class="mt-10 grid border-l border-t border-ink-200 md:grid-cols-3">
          <li
            v-for="(item, index) in aboutPageContent.fit.items"
            :key="t(item)"
            v-reveal="index * 70"
            class="reveal border-b border-r border-ink-200 p-6"
          >
            <span class="text-xs font-black tracking-[0.16em] text-wood-600">
              {{ String(index + 1).padStart(2, '0') }}
            </span>
            <p class="mt-5 text-base font-black leading-7 text-ink-950">
              {{ t(item) }}
            </p>
          </li>
        </ol>
      </div>
    </section>

    <section
      data-about-chapter="contact"
      class="section-y bg-ink-950 text-white"
    >
      <div class="shell text-center">
        <p class="eyebrow text-wood-200">
          {{ t(aboutPageContent.contact.eyebrow) }}
        </p>
        <h2 class="mx-auto mt-4 max-w-4xl text-3xl font-black uppercase leading-tight md:text-5xl">
          {{ t(aboutPageContent.contact.title) }}
        </h2>
        <p class="mx-auto mt-5 max-w-2xl text-lg leading-8 text-white/70">
          {{ t(aboutPageContent.contact.description) }}
        </p>
        <div class="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <NuxtLink
            to="/lien-he"
            class="btn-primary"
          >
            {{ t(aboutPageContent.contact.primaryCta) }}
          </NuxtLink>
          <a
            :href="phoneHref"
            class="btn-secondary"
          >
            {{ t(aboutPageContent.contact.phoneCta) }} · {{ company.phone }}
          </a>
        </div>
      </div>
    </section>
  </div>
</template>
