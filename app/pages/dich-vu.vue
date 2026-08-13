<script setup lang="ts">
import { company } from '~/data/company'
import {
  serviceCoreIds,
  serviceProgrammeIds,
  servicesMediaAlt,
  servicesPageContent
} from '~/data/services-page'
import { services, type Service, type ServiceId } from '~/data/services'
import { projectMedia } from '~/media/catalog.generated'
import { requireWorkshopAsset } from '~/media/factory-media'
import { withAlt } from '~/media/project-media'

const { t } = useLanguage()

const selectServices = (ids: readonly ServiceId[]): Service[] => ids.flatMap((id) => {
  const service = services.find(item => item.id === id)
  return service ? [service] : []
})

const coreServices = selectServices(serviceCoreIds)
const programmeServices = selectServices(serviceProgrammeIds)

const codiImages = projectMedia['codi-boutique-hotel'].images
const requireCodiAsset = (suffix: string) => {
  const asset = codiImages.find(image => image.path.endsWith(suffix))

  if (!asset) {
    throw new Error(`Missing Services editorial media asset: ${suffix}`)
  }

  return asset
}

// Keep the approved Services hero art direction while moving editorial alt text into app/data.
const heroAsset = requireCodiAsset('/sanh-don/2.webp')
const heroImage = withAlt(heroAsset, servicesMediaAlt.hero)

const workshopFactoryAsset = requireWorkshopAsset('4.webp')
const workshopQualityAsset = requireWorkshopAsset('8.webp')

const coreStageImages = [
  withAlt(requireCodiAsset('/phong-dien-hinh-1/p3-04.webp'), servicesMediaAlt.design),
  withAlt(workshopQualityAsset, servicesMediaAlt.quality),
  withAlt(requireCodiAsset('/phong-dien-hinh-2/p8-01.webp'), servicesMediaAlt.construction)
] as const

const proofImage = withAlt(workshopFactoryAsset, servicesMediaAlt.factory)
const evidenceImages = [
  withAlt(requireCodiAsset('/phong-dien-hinh-2/p8-04.webp'), ''),
  withAlt(workshopQualityAsset, ''),
  withAlt(workshopFactoryAsset, ''),
  withAlt(heroAsset, '')
]

const phoneHref = `tel:${company.phone.replaceAll(' ', '')}`
const seoTitle = computed(() => t(company.seo.services.title))
const seoDescription = computed(() => t(company.seo.services.description))

usePageSeo({
  path: '/dich-vu',
  title: seoTitle,
  description: seoDescription,
  imagePath: company.seo.services.ogImage.path,
  jsonLd: ({ base, canonical }) => [
    buildBreadcrumbLd(base, t, [
      { name: { vi: 'Trang chủ', en: 'Home' }, path: '/' },
      { name: { vi: 'Dịch vụ', en: 'Services' }, path: '/dich-vu' }
    ]),
    buildOrganizationLd(base, t),
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      '@id': `${canonical}#services`,
      'url': canonical,
      'name': seoTitle.value,
      'description': seoDescription.value,
      'mainEntity': {
        '@type': 'ItemList',
        'numberOfItems': services.length,
        'itemListElement': services.map((service, index) => ({
          '@type': 'ListItem',
          'position': index + 1,
          'item': {
            '@type': 'Service',
            'name': t(service.title),
            'description': t(service.description),
            'serviceType': t(service.title),
            'provider': { '@id': `${base}#organization` },
            'areaServed': t({ vi: 'Việt Nam và xuất khẩu', en: 'Vietnam and export' })
          }
        }))
      }
    }
  ]
})
</script>

<template>
  <div class="bg-white">
    <div data-services-chapter="promise">
      <AppHero
        :topic="t(servicesPageContent.hero.topic)"
        :title="t(servicesPageContent.hero.title)"
        :special-title="t(servicesPageContent.hero.specialTitle)"
        :subtitle="t(servicesPageContent.hero.subtitle)"
        :image="heroImage"
        atmosphere="warm"
        focal="55% 45%"
      >
        <template #actions>
          <NuxtLink
            to="/lien-he"
            class="btn-primary"
          >
            {{ t(servicesPageContent.documents.primaryCta) }}
            <Icon
              name="i-lucide-arrow-right"
              class="h-4 w-4"
              aria-hidden="true"
            />
          </NuxtLink>
        </template>
      </AppHero>
    </div>

    <section
      data-services-chapter="documents"
      class="section-y bg-white"
    >
      <div
        data-testid="services-document-layout"
        class="shell grid grid-cols-1 gap-14 md:grid-cols-2 md:gap-16 xl:gap-24"
      >
        <div>
          <p
            v-reveal
            class="eyebrow reveal"
          >
            {{ t(servicesPageContent.documents.eyebrow) }}
          </p>
          <h2
            v-reveal="80"
            class="text-section-title reveal mt-4 max-w-3xl font-black uppercase text-ink-950"
          >
            {{ t(servicesPageContent.documents.title) }}
          </h2>
          <p
            v-reveal="140"
            class="measure-lead reveal mt-5 text-ink-600"
          >
            {{ t(servicesPageContent.documents.description) }}
          </p>

          <div
            v-reveal="180"
            class="reveal mt-9 flex flex-col gap-3 sm:flex-row"
          >
            <NuxtLink
              to="/lien-he"
              class="btn-dark"
            >
              {{ t(servicesPageContent.documents.primaryCta) }}
              <Icon
                name="i-lucide-arrow-right"
                class="h-4 w-4"
                aria-hidden="true"
              />
            </NuxtLink>
            <NuxtLink
              to="#delivery-journey"
              class="btn-outline"
            >
              {{ t(servicesPageContent.documents.secondaryCta) }}
            </NuxtLink>
          </div>
        </div>

        <div
          data-testid="services-document-grid"
          class="grid border-l border-ink-200 pl-8 md:pl-10 xl:pl-12"
        >
          <article
            v-for="(item, index) in servicesPageContent.documents.items"
            :key="item.id"
            v-reveal="index * 70"
            class="reveal flex gap-6 border-b border-ink-200 py-7 first:border-t"
          >
            <span class="pt-1 text-3xl font-black text-ink-200">
              {{ String(index + 1).padStart(2, '0') }}
            </span>
            <div>
              <h3 class="text-xl font-black uppercase text-ink-950">
                {{ t(item.title) }}
              </h3>
              <p class="mt-3 text-sm leading-6 text-ink-600">
                {{ t(item.description) }}
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <ServicesJourneyRail
      :content="servicesPageContent.journey"
      :services="coreServices"
      :images="coreStageImages"
    />

    <section
      data-services-chapter="proof"
      class="section-y overflow-hidden bg-ink-950 text-white"
    >
      <div
        data-testid="services-proof-grid"
        class="shell grid grid-cols-1 gap-14 md:grid-cols-2 md:items-center md:gap-16 xl:gap-24"
      >
        <div>
          <p
            v-reveal
            class="eyebrow reveal text-wood-300"
          >
            {{ t(servicesPageContent.proof.eyebrow) }}
          </p>
          <h2
            v-reveal="80"
            class="text-section-title reveal mt-4 max-w-3xl font-black uppercase"
          >
            {{ t(servicesPageContent.proof.title) }}
          </h2>
          <p
            v-reveal="140"
            class="mt-5 max-w-2xl text-lg leading-8 text-white/70"
          >
            {{ t(servicesPageContent.proof.description) }}
          </p>

          <div class="mt-10 grid gap-7">
            <article
              v-for="(item, index) in servicesPageContent.proof.items"
              :key="item.id"
              v-reveal="index * 70"
              class="reveal border-t border-white/15 pt-6"
            >
              <p class="text-xs font-black uppercase tracking-[0.16em] text-wood-200">
                {{ t(item.label) }}
              </p>
              <h3 class="mt-3 text-xl font-black">
                {{ t(item.title) }}
              </h3>
              <p class="mt-3 text-sm leading-6 text-white/70">
                {{ t(item.description) }}
              </p>
            </article>
          </div>

          <NuxtLink
            v-reveal="160"
            to="/nha-xuong"
            class="btn-secondary reveal mt-9"
          >
            {{ t(servicesPageContent.proof.cta) }}
            <Icon
              name="i-lucide-arrow-right"
              class="h-4 w-4"
              aria-hidden="true"
            />
          </NuxtLink>
        </div>

        <MediaImage
          v-reveal="100"
          :image="proofImage"
          sizes="sm:100vw md:50vw"
          class="reveal aspect-[4/5] min-h-[32rem] bg-ink-900"
          img-class="object-center grayscale opacity-80"
        />
      </div>
    </section>

    <section
      data-services-chapter="evidence"
      class="bg-white py-10 md:py-12"
    >
      <div
        data-testid="services-evidence-grid"
        class="shell grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5"
      >
        <MediaImage
          v-for="(image, index) in evidenceImages"
          :key="image.path"
          v-reveal="index * 60"
          :image="image"
          sizes="sm:50vw md:25vw"
          class="reveal aspect-[8/5] bg-ink-50"
          img-class="object-center"
        />
      </div>
    </section>

    <ServicesProgramList
      :content="servicesPageContent.programmes"
      :services="programmeServices"
      :start-at="4"
    />

    <section
      data-services-chapter="contact"
      class="section-y border-t border-ink-100 bg-white text-ink-950"
    >
      <div class="shell grid gap-10 xl:grid-cols-[1.2fr_0.8fr] xl:items-end xl:gap-16">
        <div>
          <p
            v-reveal
            class="eyebrow reveal"
          >
            {{ t(servicesPageContent.contact.eyebrow) }}
          </p>
          <h2
            v-reveal="80"
            class="text-section-title reveal mt-4 max-w-4xl font-black uppercase"
          >
            {{ t(servicesPageContent.contact.title) }}
          </h2>
          <p
            v-reveal="140"
            class="measure-lead reveal mt-5 text-ink-600"
          >
            {{ t(servicesPageContent.contact.description) }}
          </p>
        </div>

        <div
          v-reveal="120"
          class="reveal flex flex-col gap-3 sm:flex-row xl:justify-end"
        >
          <NuxtLink
            to="/lien-he"
            class="btn-dark"
          >
            {{ t(servicesPageContent.contact.primaryCta) }}
            <Icon
              name="i-lucide-arrow-right"
              class="h-4 w-4"
              aria-hidden="true"
            />
          </NuxtLink>
          <a
            :href="phoneHref"
            class="btn-outline"
          >
            {{ t(servicesPageContent.contact.phoneCta) }} · {{ company.phone }}
          </a>
        </div>
      </div>
    </section>
  </div>
</template>
