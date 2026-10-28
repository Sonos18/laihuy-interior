<script setup lang="ts">
import { homePageContent } from '~/data/home-page'
import type { MediaImage } from '~/shared/media/types'

defineProps<{
  image: MediaImage
}>()

const { t } = useLanguage()
</script>

<template>
  <section
    data-testid="homepage-machinery"
    class="home-factory border-t border-[var(--rule-light)] bg-wood-100 text-ink-950"
  >
    <div class="shell">
      <SectionHead
        layout="stacked"
        lead-class="max-w-2xl"
        :title="t(homePageContent.factory.title)"
        :lead="t(homePageContent.factory.description)"
      />

      <!-- Factory Real Visual Evidence -->
      <div
        class="home-factory__media mt-10 md:mt-12"
        role="group"
        tabindex="0"
        :aria-label="t(homePageContent.factory.detailsTitle)"
      >
        <div
          data-testid="homepage-machinery-image"
          class="home-factory__image-container overflow-hidden rounded-sm border border-[var(--rule-light)] bg-ink-100"
        >
          <div class="relative aspect-[16/9] w-full md:aspect-[21/9]">
            <MediaImage
              v-reveal.curtain
              :image="image"
              sizes="sm:100vw md:100vw lg:100vw xl:1280px"
              class="reveal absolute inset-0 h-full w-full"
              img-class="object-cover object-center w-full h-full transition-transform duration-[var(--dur-image)] ease-[var(--ease-editorial)] hover:scale-[1.02]"
            />
          </div>
        </div>

        <div
          data-testid="homepage-machinery-details"
          class="home-factory__details"
        >
          <h3 class="home-factory__details-heading">
            {{ t(homePageContent.factory.detailsTitle) }}
          </h3>
          <dl class="home-factory__details-list">
            <div
              v-for="item in homePageContent.factory.details"
              :key="item.label.en"
              class="home-factory__detail-item"
            >
              <dt class="home-factory__detail-label">
                {{ t(item.label) }}
              </dt>
              <dd class="home-factory__detail-value">
                {{ t(item.value) }}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <!-- Section CTA -->
      <div class="mt-8 md:mt-10 flex justify-start lg:justify-end">
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
/* Sawdust: DESIGN.md's emphasis band, reserved for this factory proof chapter. */
.home-factory {
  padding-block: var(--section-py);
}

.home-factory__media {
  outline: none;
}

.home-factory__media:focus-visible {
  outline: 2px solid var(--color-wood-500);
  outline-offset: 2px;
}

/* Static mode (below 768px OR (hover: none)): panel in normal flow below photo box */
.home-factory__details {
  margin-top: 1.5rem;
}

.home-factory__details-heading {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  line-height: 1.3;
  color: var(--color-ink-600);
  margin-bottom: 0.75rem;
}

.home-factory__details-list {
  display: flex;
  flex-direction: column;
}

.home-factory__detail-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding-block: 0.75rem;
  border-top: 1px solid var(--rule-light);
}

.home-factory__detail-item:last-child {
  border-bottom: 1px solid var(--rule-light);
}

@media (min-width: 640px) {
  .home-factory__detail-item {
    display: grid;
    grid-template-columns: 14rem minmax(0, 1fr);
    align-items: baseline;
    gap: 1.5rem;
  }
}

.home-factory__detail-label {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  line-height: 1.4;
  color: var(--color-ink-600);
}

.home-factory__detail-value {
  font-size: 0.875rem;
  line-height: 1.6;
  color: var(--color-ink-900);
  font-weight: 400;
}

/* Overlay mode: min-width 768px AND (hover: hover) */
@media (min-width: 768px) and (hover: hover) {
  .home-factory__media {
    position: relative;
    overflow: hidden;
    border-radius: 4px;
  }

  .home-factory__details {
    position: absolute;
    inset-inline: 0;
    bottom: 0;
    margin-top: 0;
    background: color-mix(in srgb, var(--color-ink-950) 80%, transparent);
    padding: 0 1.75rem 1.25rem;
    transform: translateY(calc(100% - 3.5rem));
    transition: transform 400ms var(--ease-editorial);
    pointer-events: auto;
  }

  .home-factory__media:hover .home-factory__details,
  .home-factory__media:focus-within .home-factory__details {
    transform: translateY(0);
  }

  .home-factory__details-heading {
    height: 3.5rem;
    display: flex;
    align-items: center;
    margin-bottom: 0;
    color: var(--accent-dark);
  }

  .home-factory__details-list {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    column-gap: 3rem;
    row-gap: 0.875rem;
    padding-top: 0.75rem;
    border-top: 1px solid rgb(255 255 255 / 0.12);
  }

  .home-factory__detail-item {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    padding-block: 0;
    border-top: none;
  }

  .home-factory__detail-item:last-child {
    border-bottom: none;
  }

  .home-factory__detail-label {
    color: var(--accent-dark);
    margin-bottom: 0;
  }

  .home-factory__detail-value {
    color: var(--color-ivory);
    line-height: 1.5;
  }
}

@media (prefers-reduced-motion: reduce) {
  .home-factory * {
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
  }

  .home-factory__details {
    transition: none !important;
  }
}
</style>
