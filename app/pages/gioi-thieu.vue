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
  <!-- `home-page` only supplies the shared Headline/Title/Label type tokens that
       `.home-section-heading` and friends read. Below the hero the page is one warm-light
       canvas: Linen and Raw Silk in steps, one Sawdust band (the production workflow) and
       Plaster hairlines. -->
  <div class="home-page bg-wood-50 text-ink-950">
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
            class="btn-bronze btn-bronze--on-dark"
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
            class="btn-luxury-outline"
          >
            {{ t(aboutPageContent.hero.secondaryCta) }}
          </NuxtLink>
        </template>
      </AppHero>

      <AboutProofStrip :stats="proofStats" />
    </div>

    <section
      data-about-chapter="problem"
      class="section-y border-t border-[var(--rule-light)] bg-[var(--color-ivory)]"
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
          class="home-section-heading reveal mt-4 max-w-4xl text-ink-950"
        >
          {{ t(aboutPageContent.problem.title) }}
        </h2>
        <p
          v-reveal="140"
          class="measure-lead home-lead-text reveal mt-5 text-ink-600"
        >
          {{ t(aboutPageContent.problem.description) }}
        </p>

        <div class="mt-12 grid gap-10 xl:grid-cols-[0.72fr_1.28fr] xl:gap-16">
          <p
            v-reveal
            class="home-card-heading reveal text-ink-950"
          >
            {{ t(aboutPageContent.problem.lead) }}
          </p>
          <ul class="border-t border-[var(--rule-light)]">
            <li
              v-for="(response, index) in aboutPageContent.problem.responses"
              :key="response.id"
              v-reveal="index * 70"
              class="reveal grid gap-3 border-b border-[var(--rule-light)] py-6 sm:grid-cols-[0.8fr_1.2fr] sm:gap-8"
            >
              <h3 class="home-card-heading text-ink-950">
                {{ t(response.title) }}
              </h3>
              <p class="text-base leading-[1.7] text-ink-600">
                {{ t(response.description) }}
              </p>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <AboutWorkflowRail
      :content="aboutPageContent.workflow"
      :steps="productionWorkflow"
    />

    <section
      data-about-chapter="factory"
      class="section-y border-t border-[var(--rule-light)] bg-wood-50"
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
          class="home-section-heading reveal mt-4 max-w-4xl text-ink-950"
        >
          {{ t(aboutPageContent.factory.title) }}
        </h2>
        <p
          v-reveal="140"
          class="measure-lead home-lead-text reveal mt-5 text-ink-600"
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
            class="min-h-72 rounded-[4px] bg-ink-100 md:min-h-full"
            img-class="object-center"
          />
          <div class="grid gap-5">
            <MediaImage
              :image="factoryImages.machinery"
              sizes="sm:100vw md:42vw"
              class="aspect-[16/10] rounded-[4px] bg-ink-100"
              img-class="object-center"
            />
            <MediaImage
              :image="factoryImages.craft"
              sizes="sm:100vw md:42vw"
              class="aspect-[16/10] rounded-[4px] bg-ink-100"
              img-class="object-center"
            />
          </div>
        </div>

        <NuxtLink
          v-reveal="120"
          to="/nha-xuong"
          class="btn-outline reveal mt-8"
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
      class="section-y border-t border-[var(--rule-light)] bg-[var(--color-ivory)]"
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
          class="home-section-heading reveal mt-4 max-w-4xl text-ink-950"
        >
          {{ t(aboutPageContent.projects.title) }}
        </h2>
        <p
          v-reveal="140"
          class="measure-lead home-lead-text reveal mt-5 text-ink-600"
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
      class="section-y border-t border-[var(--rule-light)] bg-wood-50"
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
          class="home-section-heading reveal mt-4 max-w-4xl text-ink-950"
        >
          {{ t(aboutPageContent.fit.title) }}
        </h2>
        <ul class="mt-10 grid gap-5 md:grid-cols-3">
          <li
            v-for="(item, index) in aboutPageContent.fit.items"
            :key="t(item)"
            v-reveal="index * 70"
            class="reveal rounded-[4px] border border-ink-200 bg-white p-6 shadow-[var(--shadow-rest)] md:p-8"
          >
            <p class="home-nested-heading font-display font-medium tracking-tight text-ink-950">
              {{ t(item) }}
            </p>
          </li>
        </ul>
      </div>
    </section>

    <section
      data-about-chapter="contact"
      class="section-cta"
    >
      <div class="shell text-center">
        <p class="eyebrow">
          {{ t(aboutPageContent.contact.eyebrow) }}
        </p>
        <h2 class="home-section-heading mx-auto mt-4 max-w-4xl text-ink-950">
          {{ t(aboutPageContent.contact.title) }}
        </h2>
        <p class="home-lead-text mx-auto mt-5 max-w-2xl text-ink-600">
          {{ t(aboutPageContent.contact.description) }}
        </p>
        <div class="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <NuxtLink
            to="/lien-he"
            class="btn-bronze"
          >
            {{ t(aboutPageContent.contact.primaryCta) }}
          </NuxtLink>
          <a
            :href="phoneHref"
            class="btn-outline"
          >
            {{ t(aboutPageContent.contact.phoneCta) }} · {{ company.phone }}
          </a>
        </div>
      </div>
    </section>
  </div>
</template>
