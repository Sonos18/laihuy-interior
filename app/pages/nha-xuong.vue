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

const facts = computed(() => factsFromStats(factoryStats, t))

// The page's Monument (DESIGN.md "Monument"): the workshop footprint opens the production chapter.
const footprintStat = factoryStats.find(stat => stat.id === 'footprint')
const monument = computed(() => footprintStat
  ? { label: t(footprintStat.label), value: t(footprintStat.value) }
  : undefined)

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
    buildBilingualFaqPageLd(factoryFaqs)
  ]
})
</script>

<template>
  <div class="home-page bg-wood-50 text-ink-950">
    <!-- `home-page` only supplies the shared Headline/Title/Label type tokens that
         `.home-section-heading` and friends read. Below the hero the page is one warm-light
         canvas: Linen and Raw Silk in steps, one Sawdust band (the production proof chapter) and
         Plaster hairlines. -->
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
          class="btn-bronze btn-bronze--on-dark"
        >
          {{ t(factoryPageContent.hero.primaryCta) }}
          <Icon
            name="i-lucide-phone"
            class="h-4 w-4"
          />
        </a>
        <a
          href="#factory-capability"
          class="btn-luxury-outline"
        >
          {{ t(factoryPageContent.hero.secondaryCta) }}
        </a>
      </template>
    </AppHero>

    <FactsBand
      :facts="facts"
      testid="factory-stats"
      cell-testid="factory-stat"
      anchor="factory-capability"
    />

    <section
      data-testid="factory-pillars"
      class="section-y border-t border-[var(--rule-light)] bg-[var(--color-ivory)]"
    >
      <div class="shell">
        <div
          data-testid="factory-pillars-layout"
          class="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center"
        >
          <MediaImage
            :image="factoryMedia.facade"
            class="rounded-[4px] bg-ink-100"
          />
          <div>
            <SectionHead
              layout="stacked"
              :reveal="false"
              :eyebrow="t(factoryPageContent.pillars.eyebrow)"
              :title="t(factoryPageContent.pillars.title)"
              :lead="t(factoryPageContent.pillars.description)"
            />
            <div
              data-testid="factory-pillars-grid"
              class="mt-8 grid grid-cols-2 gap-x-6 gap-y-8"
            >
              <article
                v-for="pillar in factoryPillars"
                :key="pillar.id"
                data-testid="factory-pillar"
                class="border-t border-ink-200 pt-5"
              >
                <Icon
                  :name="pillar.icon"
                  class="h-5 w-5 text-wood-600"
                  aria-hidden="true"
                />
                <h3 class="home-card-heading mt-4 text-ink-950">
                  {{ t(pillar.title) }}
                </h3>
                <p class="mt-2 text-base leading-[1.7] text-ink-600">
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
      :monument="monument"
    />

    <section
      data-testid="factory-people-quality"
      class="section-y border-t border-[var(--rule-light)] bg-wood-50"
    >
      <div
        data-testid="factory-people-quality-layout"
        class="shell grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center"
      >
        <MediaImage
          :image="factoryMedia.people"
          class="rounded-[4px] bg-ink-100"
        />
        <div>
          <SectionHead
            layout="stacked"
            :reveal="false"
            :eyebrow="t(factoryPageContent.peopleQuality.eyebrow)"
            :title="t(factoryPageContent.peopleQuality.title)"
            :lead="t(factoryPageContent.peopleQuality.description)"
          />
          <!-- The four QC checkpoints run in a fixed order (incoming materials → drawings →
               in production → sign-off), so they keep Label-size sequence markers. -->
          <ol
            role="list"
            class="mt-8 grid gap-4"
          >
            <li
              v-for="(item, index) in qualityControl"
              :key="t(item)"
              data-testid="factory-quality-step"
              class="flex gap-4 border-b border-[var(--rule-light)] pb-4"
            >
              <span
                class="home-eyebrow-text mt-1.5 shrink-0 tabular-nums text-wood-600"
                aria-hidden="true"
              >
                {{ String(index + 1).padStart(2, '0') }}
              </span>
              <span class="text-base leading-[1.7] text-ink-700">{{ t(item) }}</span>
            </li>
          </ol>
        </div>
      </div>
    </section>

    <section
      data-testid="factory-audiences"
      class="section-y border-t border-[var(--rule-light)] bg-[var(--color-ivory)]"
    >
      <div class="shell">
        <SectionHead
          layout="split"
          :reveal="false"
          :eyebrow="t(factoryPageContent.audiences.eyebrow)"
          :title="t(factoryPageContent.audiences.title)"
          :lead="t(factoryPageContent.audiences.description)"
        />
        <div class="mt-10 grid gap-5 md:grid-cols-2">
          <article
            v-for="audience in factoryAudiences"
            :key="audience.id"
            data-testid="factory-audience"
            class="card p-6 md:p-8"
          >
            <h3 class="home-card-heading text-ink-950">
              {{ t(audience.title) }}
            </h3>
            <ul class="mt-6 grid gap-4">
              <li
                v-for="point in audience.points"
                :key="t(point)"
                class="flex gap-3 text-base leading-[1.7] text-ink-700"
              >
                <Icon
                  name="i-lucide-check"
                  class="mt-1 h-4 w-4 shrink-0 text-wood-600"
                  aria-hidden="true"
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
      class="section-y border-t border-[var(--rule-light)] bg-wood-50"
    >
      <!-- A rail head; the questions continue its argument, so they hang from the heading's
           column rather than returning to the full measure. -->
      <div class="shell">
        <SectionHead
          layout="rail"
          :reveal="false"
          :eyebrow="t(factoryPageContent.faq.eyebrow)"
          :title="t(factoryPageContent.faq.title)"
        />
        <div class="rail-hang mt-10 space-y-3">
          <details
            v-for="faq in factoryFaqs"
            :key="faq.id"
            class="group card px-6 transition-[border-color] duration-[var(--dur-hover)] ease-[var(--ease-editorial)] hover:border-ink-500 open:border-ink-500 motion-reduce:transition-none"
          >
            <summary class="home-nested-heading flex cursor-pointer list-none items-center justify-between gap-4 py-5 font-display font-medium text-ink-950 [&::-webkit-details-marker]:hidden">
              {{ t(faq.question) }}
              <Icon
                name="i-lucide-plus"
                class="h-5 w-5 shrink-0 text-wood-600 transition-transform duration-[var(--dur-hover)] ease-[var(--ease-editorial)] group-open:rotate-45 motion-reduce:transition-none"
                aria-hidden="true"
              />
            </summary>
            <p class="measure pb-5 text-base leading-[1.7] text-ink-600">
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
