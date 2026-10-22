<script setup lang="ts">
import { homePageContent } from '~/data/home-page'
import type { Capability, MachinerySectionContent, ProductionStep } from '~/data/factory'
import type { MediaImage } from '~/shared/media/types'

const props = defineProps<{
  capabilities: readonly Capability[]
  content: MachinerySectionContent
  image: MediaImage
  steps: readonly ProductionStep[]
}>()

const { t } = useLanguage()

type Pillar = { title: string, accent?: string, description: string, descriptionTestId?: string }

// Pillar sources are existing strings: technical take-off (workflow step 2), direct
// manufacturing (machinery intro) and the project delivery team (third capability).
const pillars = computed<Pillar[]>(() => {
  const list: Pillar[] = []
  const takeOff = props.steps[1]
  const delivery = props.capabilities[2]
  if (takeOff) list.push({ title: t(takeOff.title), description: t(takeOff.description) })
  list.push({
    title: t(props.content.titleLead),
    accent: t(props.content.titleAccent),
    description: t(props.content.description),
    descriptionTestId: 'homepage-machinery-description'
  })
  if (delivery) list.push({ title: t(delivery.label), description: t(delivery.description) })
  return list
})

const metricFootprint = computed(() => props.capabilities?.[0])
const metricCapacity = computed(() => props.capabilities?.[1])
</script>

<template>
  <section
    data-testid="homepage-machinery"
    class="home-factory bg-wood-100 text-ink-950"
  >
    <div class="shell">
      <!-- Section Intro -->
      <div class="home-factory__intro">
        <div>
          <p
            v-reveal
            class="eyebrow home-eyebrow-text reveal text-wood-600"
          >
            {{ t(homePageContent.factory.eyebrow) }}
          </p>
          <h2
            v-reveal="80"
            class="home-factory__title home-section-heading reveal mt-4 text-ink-950"
          >
            {{ t(homePageContent.factory.title) }}
          </h2>
        </div>
        <p
          v-reveal="140"
          class="home-lead-text reveal max-w-2xl text-ink-600"
        >
          {{ t(homePageContent.factory.description) }}
        </p>
      </div>

      <!-- Proof Metrics Rail (Workshop footprint & capacity) -->
      <dl class="home-factory__metrics mt-12 grid grid-cols-1 gap-6 border-y border-[var(--rule-light)] py-6 sm:grid-cols-2">
        <div
          v-if="metricFootprint"
          class="home-factory__metric"
        >
          <dt class="home-eyebrow-text uppercase text-wood-600">
            {{ t(metricFootprint.label) }}
          </dt>
          <dd class="home-stat-value mt-2 font-display font-medium tracking-tight text-ink-950">
            {{ t(metricFootprint.value) }}
          </dd>
          <dd class="mt-1 text-sm leading-[1.75] text-ink-600">
            {{ t(metricFootprint.description) }}
          </dd>
        </div>
        <div
          v-if="metricCapacity"
          class="home-factory__metric sm:border-l sm:border-[var(--rule-light)] sm:pl-6"
        >
          <dt class="home-eyebrow-text uppercase text-wood-600">
            {{ t(metricCapacity.label) }}
          </dt>
          <dd class="home-stat-value mt-2 font-display font-medium tracking-tight text-ink-950">
            {{ t(metricCapacity.value) }}
          </dd>
          <dd class="mt-1 text-sm leading-[1.75] text-ink-600">
            {{ t(metricCapacity.description) }}
          </dd>
        </div>
      </dl>

      <!-- Factory Real Visual Evidence -->
      <div
        data-testid="homepage-machinery-image"
        class="home-factory__image-container mt-12 overflow-hidden rounded-sm border border-[var(--rule-light)] bg-ink-100"
      >
        <div class="relative aspect-[16/9] w-full md:aspect-[21/9]">
          <MediaImage
            :image="image"
            sizes="sm:100vw md:100vw lg:100vw xl:1280px"
            class="absolute inset-0 h-full w-full"
            img-class="object-cover object-center w-full h-full transition-transform duration-1000 ease-out hover:scale-[1.02]"
          />
          <div
            data-testid="homepage-machinery-caption"
            aria-hidden="true"
            class="home-factory__caption"
          >
            <span>{{ t(content.photoCaption) }}</span>
            <span class="text-[var(--bronze-light)]">{{ t(content.lineCaption) }}</span>
          </div>
        </div>
      </div>

      <!-- Craft & Precision Trinity: one fact and one supporting line per pillar. The machinery,
           production-step and QC evidence lives on /nha-xuong. -->
      <div
        data-testid="homepage-machinery-trinity"
        class="home-factory__trinity mt-16 grid grid-cols-1 gap-12 lg:grid-cols-3 lg:gap-8 lg:divide-x lg:divide-[var(--rule-light)]"
      >
        <article
          v-for="(pillar, index) in pillars"
          :key="index"
          data-testid="homepage-machinery-pillar"
          class="home-factory__pillar flex flex-col lg:px-6 lg:first:pl-0 lg:last:pr-0"
        >
          <span
            data-machinery-sequence
            aria-hidden="true"
            class="home-meta-text font-semibold tracking-[0.2em] text-wood-600"
          >{{ String(index + 1).padStart(2, '0') }}</span>
          <h3
            data-testid="homepage-machinery-pillar-title"
            class="home-card-heading mt-4 text-ink-950"
          >
            {{ pillar.title }}
            <!-- Kept as a span for structure; it takes the heading colour, because a bronze word
                 mid-heading reads as a link. -->
            <span v-if="pillar.accent">{{ pillar.accent }}</span>
          </h3>
          <p
            :data-testid="pillar.descriptionTestId"
            class="mt-3 text-sm leading-[1.75] text-ink-600 md:text-base"
          >
            {{ pillar.description }}
          </p>
        </article>
      </div>

      <!-- Section CTA -->
      <div class="mt-12 flex justify-start lg:justify-end">
        <NuxtLink
          data-testid="homepage-machinery-cta"
          to="/nha-xuong"
          class="btn-outline"
        >
          {{ t(homePageContent.cta.secondaryCta) }}
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Sawdust: DESIGN.md's emphasis band, reserved for this factory proof chapter. Accent text is
   Deep Timber and secondary text Walnut Grey; bronze and Dust Grey both fall under AA here. */
.home-factory {
  padding-block: var(--section-py);
}
.home-factory__intro {
  display: grid;
  gap: 2rem;
}
.home-factory__title {
  max-width: 55rem;
}
.home-factory__caption {
  position: absolute;
  inset-inline: 0;
  bottom: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 1rem;
  background: color-mix(in srgb, var(--color-obsidian) 85%, transparent);
  padding: 0.85rem 1.25rem;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--color-ivory);
}
@media (min-width: 1024px) {
  .home-factory__intro {
    grid-template-columns: minmax(0, 1.15fr) minmax(20rem, 0.85fr);
    align-items: end;
  }
}
@media (prefers-reduced-motion: reduce) {
  .home-factory * {
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
  }
}
</style>
