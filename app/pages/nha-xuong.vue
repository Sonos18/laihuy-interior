<script setup lang="ts">
import { company } from '~/data/company'
import {
  factoryAudiences,
  factoryFaqs,
  factoryPageContent,
  factoryPillars,
  factoryStats,
  machineryProcessGroups,
  qualityControl
} from '~/data/factory'
import { factoryMedia } from '~/media/factory-media'

const { t } = useLanguage()
const factoryAddress = company.addresses.find(address => address.icon === 'i-lucide-factory')

if (!factoryAddress) {
  throw new Error('Missing company address entry: Nhà xưởng')
}

const factoryPhoneHref = `tel:${company.phone.replaceAll(' ', '')}`
const seoTitle = computed(() => t(company.seo.factory.title))
const seoDescription = computed(() => t(company.seo.factory.description))

usePageSeo({
  path: '/nha-xuong',
  title: seoTitle,
  description: seoDescription,
  imagePath: factoryMedia.hero.path,
  jsonLd: ({ base }) => [
    buildBreadcrumbLd(base, t, [
      { name: { vi: 'Trang chủ', en: 'Home' }, path: '/' },
      { name: { vi: 'Nhà xưởng', en: 'Factory' }, path: '/nha-xuong' }
    ]),
    buildOrganizationLd(base, t),
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': factoryFaqs.map(faq => ({
        '@type': 'Question',
        'name': t(faq.question),
        'acceptedAnswer': { '@type': 'Answer', 'text': t(faq.answer) }
      }))
    }
  ]
})
</script>

<template>
  <div>
    <AppHero
      data-testid="factory-hero"
      :topic="t(factoryPageContent.hero.topic)"
      :title="t(factoryPageContent.hero.title)"
      :special-title="t(factoryPageContent.hero.specialTitle)"
      :subtitle="t(factoryPageContent.hero.subtitle)"
      :image="factoryMedia.hero"
      focal="50% 48%"
    >
      <template #actions>
        <a
          data-testid="factory-hero-phone"
          :href="factoryPhoneHref"
          class="btn-primary"
        >
          {{ t(factoryPageContent.hero.primaryCta) }}
          <Icon
            name="i-lucide-phone"
            class="h-4 w-4"
          />
        </a>
        <a
          href="#factory-capability"
          class="btn-secondary"
        >
          {{ t(factoryPageContent.hero.secondaryCta) }}
        </a>
      </template>
    </AppHero>

    <FactoryStatsStrip :stats="factoryStats" />

    <section
      data-testid="factory-pillars"
      class="section-y bg-white"
    >
      <div class="shell">
        <div
          data-testid="factory-pillars-layout"
          class="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center"
        >
          <MediaImage
            :image="factoryMedia.facade"
            class="rounded-2xl"
          />
          <div>
            <p class="eyebrow">
              {{ t(factoryPageContent.pillars.eyebrow) }}
            </p>
            <h2 class="text-section-title mt-4 font-black uppercase text-ink-950">
              {{ t(factoryPageContent.pillars.title) }}
            </h2>
            <p class="measure-lead mt-5 text-ink-600">
              {{ t(factoryPageContent.pillars.description) }}
            </p>
            <div
              data-testid="factory-pillars-grid"
              class="mt-8 grid grid-cols-2 gap-4"
            >
              <article
                v-for="pillar in factoryPillars"
                :key="pillar.id"
                data-testid="factory-pillar"
                class="border-t-2 border-wood-500 pt-5"
              >
                <Icon
                  :name="pillar.icon"
                  class="h-5 w-5 text-wood-600"
                />
                <h3 class="mt-4 font-black text-ink-950">
                  {{ t(pillar.title) }}
                </h3>
                <p class="mt-2 text-sm leading-6 text-ink-600">
                  {{ t(pillar.description) }}
                </p>
              </article>
            </div>
          </div>
        </div>
      </div>
    </section>

    <FactoryProcessProof
      :content="factoryPageContent.process"
      :groups="machineryProcessGroups"
      :image="factoryMedia.process"
    />

    <section
      data-testid="factory-people-quality"
      class="section-y bg-ink-50"
    >
      <div
        data-testid="factory-people-quality-layout"
        class="shell grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center"
      >
        <MediaImage
          :image="factoryMedia.people"
          class="rounded-2xl"
        />
        <div>
          <p class="eyebrow">
            {{ t(factoryPageContent.peopleQuality.eyebrow) }}
          </p>
          <h2 class="text-section-title mt-4 font-black uppercase text-ink-950">
            {{ t(factoryPageContent.peopleQuality.title) }}
          </h2>
          <p class="mt-5 leading-7 text-ink-600">
            {{ t(factoryPageContent.peopleQuality.description) }}
          </p>
          <ul class="mt-8 grid gap-4">
            <li
              v-for="(item, index) in qualityControl"
              :key="t(item)"
              data-testid="factory-quality-step"
              class="flex gap-4 border-b border-ink-200 pb-4"
            >
              <span class="font-black text-wood-600">{{ String(index + 1).padStart(2, '0') }}</span>
              <span class="text-sm leading-6 text-ink-700">{{ t(item) }}</span>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <section
      data-testid="factory-audiences"
      class="section-y bg-white"
    >
      <div class="shell">
        <p class="eyebrow">
          {{ t(factoryPageContent.audiences.eyebrow) }}
        </p>
        <h2 class="text-section-title mt-4 max-w-4xl font-black uppercase text-ink-950">
          {{ t(factoryPageContent.audiences.title) }}
        </h2>
        <p class="measure-lead mt-5 text-ink-600">
          {{ t(factoryPageContent.audiences.description) }}
        </p>
        <div class="mt-10 grid gap-5 md:grid-cols-2">
          <article
            v-for="audience in factoryAudiences"
            :key="audience.id"
            data-testid="factory-audience"
            class="rounded-2xl border border-ink-200 bg-ink-50 p-6 md:p-8"
          >
            <h3 class="text-xl font-black uppercase text-ink-950">
              {{ t(audience.title) }}
            </h3>
            <ul class="mt-6 grid gap-4">
              <li
                v-for="point in audience.points"
                :key="t(point)"
                class="flex gap-3 text-ink-700"
              >
                <Icon
                  name="i-lucide-check"
                  class="mt-1 h-4 w-4 shrink-0 text-wood-600"
                />
                <span>{{ t(point) }}</span>
              </li>
            </ul>
          </article>
        </div>
      </div>
    </section>

    <section
      data-testid="factory-faq"
      class="section-y bg-ink-50"
    >
      <div class="shell grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p class="eyebrow">
            {{ t(factoryPageContent.faq.eyebrow) }}
          </p>
          <h2 class="text-section-title mt-4 font-black uppercase text-ink-950">
            {{ t(factoryPageContent.faq.title) }}
          </h2>
        </div>
        <div class="space-y-3">
          <details
            v-for="faq in factoryFaqs"
            :key="faq.id"
            class="group rounded-2xl border border-ink-200 bg-white px-6 open:border-wood-300"
          >
            <summary class="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-base font-black text-ink-950 [&::-webkit-details-marker]:hidden">
              {{ t(faq.question) }}
              <Icon
                name="i-lucide-plus"
                class="h-5 w-5 shrink-0 text-wood-500 transition-transform duration-300 group-open:rotate-45 motion-reduce:transition-none"
              />
            </summary>
            <p class="measure pb-5 text-sm leading-7 text-ink-600">
              {{ t(faq.answer) }}
            </p>
          </details>
        </div>
      </div>
    </section>

    <FactoryVisitCta
      :content="factoryPageContent.visit"
      :image="factoryMedia.visit"
      :phone="company.phone"
      :address="factoryAddress"
      :working-hours="company.workingHours"
    />
  </div>
</template>
