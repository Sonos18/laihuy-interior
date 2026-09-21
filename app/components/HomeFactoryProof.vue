<script setup lang="ts">
import { homePageContent } from '~/data/home-page'
import type { Capability, MachineryProcessGroup, MachinerySectionContent, ProductionStep } from '~/data/factory'
import type { MediaImage } from '~/shared/media/types'

const props = defineProps<{
  capabilities: readonly Capability[]
  groups: readonly MachineryProcessGroup[]
  content: MachinerySectionContent
  image: MediaImage
  steps: readonly ProductionStep[]
}>()

const { t } = useLanguage()

const pillar1Title = computed(() => (props.steps?.[1] ? t(props.steps[1].title) : ''))
const pillar2TitleLead = computed(() => t(props.content.titleLead))
const pillar2TitleAccent = computed(() => t(props.content.titleAccent))
const pillar3Title = computed(() => (props.capabilities?.[2] ? t(props.capabilities[2].label) : ''))

const metricFootprint = computed(() => props.capabilities?.[0])
const metricCapacity = computed(() => props.capabilities?.[1])
const capabilityDelivery = computed(() => props.capabilities?.[2])
</script>

<template>
  <section
    data-testid="homepage-machinery"
    class="home-factory bg-[var(--color-obsidian)] text-[var(--color-ivory)]"
  >
    <div class="shell">
      <!-- Section Intro -->
      <div class="home-factory__intro">
        <div>
          <p
            v-reveal
            class="eyebrow home-eyebrow-text reveal text-[var(--bronze-light)]"
          >
            {{ t(homePageContent.factory.eyebrow) }}
          </p>
          <h2
            v-reveal="80"
            class="home-factory__title home-section-heading reveal mt-4 font-display text-white"
          >
            {{ t(homePageContent.factory.title) }}
          </h2>
        </div>
        <p
          v-reveal="140"
          class="home-lead-text reveal max-w-2xl text-[var(--text-muted)]"
        >
          {{ t(homePageContent.factory.description) }}
        </p>
      </div>

      <!-- Proof Metrics Rail (Workshop footprint & capacity) -->
      <dl class="home-factory__metrics mt-12 grid grid-cols-1 gap-6 border-y border-[var(--hairline)] py-6 sm:grid-cols-2">
        <div
          v-if="metricFootprint"
          class="home-factory__metric"
        >
          <dt class="home-eyebrow-text uppercase text-[var(--bronze)]">
            {{ t(metricFootprint.label) }}
          </dt>
          <dd class="home-stat-value mt-2 font-display font-medium tracking-tight text-[var(--color-ivory)]">
            {{ t(metricFootprint.value) }}
          </dd>
          <dd class="mt-1 text-sm leading-[1.75] text-[var(--text-muted)]">
            {{ t(metricFootprint.description) }}
          </dd>
        </div>
        <div
          v-if="metricCapacity"
          class="home-factory__metric sm:border-l sm:border-[var(--hairline)] sm:pl-6"
        >
          <dt class="home-eyebrow-text uppercase text-[var(--bronze)]">
            {{ t(metricCapacity.label) }}
          </dt>
          <dd class="home-stat-value mt-2 font-display font-medium tracking-tight text-[var(--color-ivory)]">
            {{ t(metricCapacity.value) }}
          </dd>
          <dd class="mt-1 text-sm leading-[1.75] text-[var(--text-muted)]">
            {{ t(metricCapacity.description) }}
          </dd>
        </div>
      </dl>

      <!-- Factory Real Visual Evidence -->
      <div
        data-testid="homepage-machinery-image"
        class="home-factory__image-container mt-12 overflow-hidden rounded-sm border border-[var(--hairline)] bg-[var(--color-surface-dark)]"
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

      <!-- Craft & Precision Trinity -->
      <div
        data-testid="homepage-machinery-trinity"
        class="home-factory__trinity mt-16 grid grid-cols-1 gap-12 lg:grid-cols-3 lg:gap-8 lg:divide-x lg:divide-[var(--hairline)]"
      >
        <!-- Pillar 01: Technical Preparation -->
        <article
          data-testid="homepage-machinery-pillar"
          class="home-factory__pillar flex flex-col lg:pr-6"
        >
          <span
            data-machinery-sequence
            aria-hidden="true"
            class="home-meta-text font-semibold tracking-[0.2em] text-[var(--bronze)]"
          >01</span>
          <h3
            data-testid="homepage-machinery-pillar-title"
            class="home-card-heading mt-4 font-display font-medium tracking-tight text-[var(--color-ivory)]"
          >
            {{ pillar1Title }}
          </h3>
          <p
            v-if="steps?.[1]"
            class="mt-3 text-sm leading-[1.75] text-[var(--text-muted)]"
          >
            {{ t(steps[1].description) }}
          </p>

          <!-- Evidence: Step 1 Intake -->
          <div
            v-if="steps?.[0]"
            class="mt-6 border-t border-[var(--hairline)] pt-4"
          >
            <h4 class="home-nested-heading font-semibold text-[var(--color-ivory)]">
              {{ t(steps[0].title) }}
            </h4>
            <p class="mt-1 text-xs leading-[1.75] text-[var(--text-muted)]">
              {{ t(steps[0].description) }}
            </p>
          </div>
        </article>

        <!-- Pillar 02: Direct Manufacturing -->
        <article
          data-testid="homepage-machinery-pillar"
          class="home-factory__pillar flex flex-col lg:px-6"
        >
          <span
            data-machinery-sequence
            aria-hidden="true"
            class="home-meta-text font-semibold tracking-[0.2em] text-[var(--bronze)]"
          >02</span>
          <h3
            data-testid="homepage-machinery-pillar-title"
            class="home-card-heading mt-4 font-display font-medium tracking-tight text-[var(--color-ivory)]"
          >
            {{ pillar2TitleLead }} <span class="text-[var(--bronze)]">{{ pillar2TitleAccent }}</span>
          </h3>
          <p
            data-testid="homepage-machinery-description"
            class="mt-3 text-sm leading-[1.75] text-[var(--text-muted)]"
          >
            {{ t(content.description) }}
          </p>

          <!-- Evidence: 4 Groups & 7 Machines -->
          <div class="mt-6 space-y-4 border-t border-[var(--hairline)] pt-4">
            <div
              v-for="group in groups"
              :key="group.id"
              class="text-xs"
            >
              <h4 class="home-nested-heading font-semibold text-[var(--color-ivory)]">
                {{ t(group.title) }}
              </h4>
              <p class="mt-1 text-xs leading-[1.75] text-[var(--text-muted)]">
                {{ t(group.benefit) }}
              </p>
              <p class="mt-1 text-[0.7rem] leading-[1.75] text-[var(--bronze-light)]">
                <template
                  v-for="(machine, mIdx) in group.machines"
                  :key="t(machine)"
                >
                  <span>{{ t(machine) }}</span><span
                    v-if="mIdx < group.machines.length - 1"
                    aria-hidden="true"
                  > · </span>
                </template>
              </p>
            </div>
          </div>
        </article>

        <!-- Pillar 03: Quality & Delivery -->
        <article
          data-testid="homepage-machinery-pillar"
          class="home-factory__pillar flex flex-col lg:pl-6"
        >
          <span
            data-machinery-sequence
            aria-hidden="true"
            class="home-meta-text font-semibold tracking-[0.2em] text-[var(--bronze)]"
          >03</span>
          <h3
            data-testid="homepage-machinery-pillar-title"
            class="home-card-heading mt-4 font-display font-medium tracking-tight text-[var(--color-ivory)]"
          >
            {{ pillar3Title }}
          </h3>
          <div
            v-if="capabilityDelivery"
            class="mt-3"
          >
            <p class="text-sm font-medium leading-[1.75] text-[var(--bronze-light)]">
              {{ t(capabilityDelivery.value) }}
            </p>
            <p class="mt-1 text-sm leading-[1.75] text-[var(--text-muted)]">
              {{ t(capabilityDelivery.description) }}
            </p>
          </div>

          <!-- Evidence: Steps 3, 5, 6 -->
          <div class="mt-6 space-y-4 border-t border-[var(--hairline)] pt-4">
            <div
              v-if="steps?.[2]"
              class="text-xs"
            >
              <h4 class="home-nested-heading font-semibold text-[var(--color-ivory)]">
                {{ t(steps[2].title) }}
              </h4>
              <p class="mt-1 text-xs leading-[1.75] text-[var(--text-muted)]">
                {{ t(steps[2].description) }}
              </p>
            </div>
            <div
              v-if="steps?.[4]"
              class="text-xs"
            >
              <h4 class="home-nested-heading font-semibold text-[var(--color-ivory)]">
                {{ t(steps[4].title) }}
              </h4>
              <p class="mt-1 text-xs leading-[1.75] text-[var(--text-muted)]">
                {{ t(steps[4].description) }}
              </p>
            </div>
            <div
              v-if="steps?.[5]"
              class="text-xs"
            >
              <h4 class="home-nested-heading font-semibold text-[var(--color-ivory)]">
                {{ t(steps[5].title) }}
              </h4>
              <p class="mt-1 text-xs leading-[1.75] text-[var(--text-muted)]">
                {{ t(steps[5].description) }}
              </p>
            </div>
          </div>
        </article>
      </div>

      <!-- Section CTA -->
      <div class="mt-12 flex justify-start lg:justify-end">
        <NuxtLink
          data-testid="homepage-machinery-cta"
          to="/nha-xuong"
          class="btn-outline border-[var(--hairline)] text-[var(--color-ivory)] hover:border-[var(--bronze)] hover:text-[var(--bronze)] focus-visible:outline-2 focus-visible:outline-[var(--bronze)]"
        >
          {{ t(homePageContent.cta.secondaryCta) }}
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.home-factory {
  padding-block: var(--section-py);
}
.home-factory__intro {
  display: grid;
  gap: 2rem;
}
.home-factory__title {
  max-width: 55rem;
  font-weight: 500;
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
