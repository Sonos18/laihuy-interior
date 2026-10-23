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
import { breathMedia } from '~/media/breath-media'
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
const proofFacts = computed(() => factsFromStats(proofStats, t))

// The page's Monument (DESIGN.md "Monument"): the monthly room capacity opens the factory chapter.
const capacityStat = factoryStats.find(stat => stat.id === 'throughput')

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
  <div class="home-page bg-wood-50 text-ink-950">
    <!-- `home-page` only supplies the shared Headline/Title/Label type tokens that
         `.home-section-heading` and friends read. Below the hero the page is one warm-light
         canvas: Linen and Raw Silk in steps, one Sawdust band (the production workflow) and
         Plaster hairlines. -->
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

      <FactsBand
        :facts="proofFacts"
        testid="about-proof"
        grid-testid="about-proof-grid"
        cell-testid="about-proof-stat"
      />
    </div>

    <!-- The lead section: a rail head with the page's Statement heading. Its chapter ends on the
         page's one breath photograph (DESIGN.md "Breath"), so the section keeps no bottom padding. -->
    <section
      data-about-chapter="problem"
      class="section-y border-t border-[var(--rule-light)] bg-[var(--color-ivory)] pb-0"
    >
      <div class="shell pb-[var(--section-py)]">
        <SectionHead
          layout="rail"
          statement
          :eyebrow="t(aboutPageContent.problem.eyebrow)"
          :title="t(aboutPageContent.problem.title)"
          :lead="t(aboutPageContent.problem.description)"
        />

        <div class="mt-12 grid gap-10 xl:grid-cols-[0.72fr_1.28fr] xl:gap-16">
          <p
            v-reveal
            class="home-card-heading reveal text-ink-950"
          >
            {{ t(aboutPageContent.problem.lead) }}
          </p>
          <ul class="border-t border-[var(--rule-light)]">
            <li
              v-for="response in aboutPageContent.problem.responses"
              :key="response.id"
              v-reveal.item
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

      <BreathImage :image="breathMedia.about" />
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
        <SectionHead
          layout="split"
          :eyebrow="t(aboutPageContent.factory.eyebrow)"
          :title="t(aboutPageContent.factory.title)"
          :lead="t(aboutPageContent.factory.description)"
        />

        <FactMonument
          v-if="capacityStat"
          class="mt-16 md:mt-20"
          :label="t(capacityStat.label)"
          :value="t(capacityStat.value)"
        />

        <div
          data-testid="about-factory-grid"
          class="mt-16 grid gap-5 md:mt-20 md:grid-cols-[1.15fr_0.85fr]"
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
          v-reveal
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
        <SectionHead
          layout="stacked"
          title-class="max-w-4xl"
          :eyebrow="t(aboutPageContent.projects.eyebrow)"
          :title="t(aboutPageContent.projects.title)"
          :lead="t(aboutPageContent.projects.description)"
        />

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
        <SectionHead
          layout="rail"
          :eyebrow="t(aboutPageContent.fit.eyebrow)"
          :title="t(aboutPageContent.fit.title)"
        />
        <ul class="mt-10 grid gap-5 md:grid-cols-3">
          <li
            v-for="item in aboutPageContent.fit.items"
            :key="t(item)"
            v-reveal.item
            class="reveal card p-6 md:p-8"
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
        <div data-head="stacked">
          <p class="eyebrow">
            {{ t(aboutPageContent.contact.eyebrow) }}
          </p>
          <h2 class="home-section-heading mx-auto mt-4 max-w-4xl text-ink-950">
            {{ t(aboutPageContent.contact.title) }}
          </h2>
          <p class="home-lead-text mx-auto mt-5 max-w-2xl text-ink-600">
            {{ t(aboutPageContent.contact.description) }}
          </p>
        </div>
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
            {{ t(aboutPageContent.contact.phoneCta) }} {{ company.phone }}
          </a>
        </div>
      </div>
    </section>
  </div>
</template>
