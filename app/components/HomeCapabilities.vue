<script setup lang="ts">
import { homePageContent, type HomeCapability } from '~/data/home-page'

defineProps<{ capabilities: readonly HomeCapability[] }>()
const { t } = useLanguage()
</script>

<template>
  <section
    data-testid="home-capabilities"
    class="home-capabilities bg-wood-50 text-ink-950"
  >
    <div class="shell">
      <div class="home-capabilities__intro">
        <p
          v-reveal
          class="eyebrow reveal"
        >
          {{ t(homePageContent.capabilities.eyebrow) }}
        </p>
        <h2
          v-reveal="80"
          class="home-capabilities__title reveal mt-4"
        >
          {{ t(homePageContent.capabilities.title) }}
        </h2>
      </div>

      <ol class="home-capabilities__list mt-14">
        <li
          v-for="(capability, index) in capabilities"
          :key="capability.id"
          v-reveal="index * 90"
          data-testid="home-capability"
          class="home-capabilities__item reveal"
        >
          <span
            class="home-capabilities__number"
            aria-hidden="true"
          >{{ String(index + 1).padStart(2, '0') }}</span>
          <h3 class="mt-10 text-2xl font-semibold tracking-[-0.035em] md:text-3xl">
            {{ t(capability.title) }}
          </h3>
          <p class="mt-4 text-sm leading-6 text-ink-600">
            {{ t(capability.description) }}
          </p>
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped>
.home-capabilities {
  padding-block: var(--section-py);
}

.home-capabilities__intro {
  display: grid;
  gap: 1rem;
}

.home-capabilities__title {
  max-width: 58rem;
  font-size: clamp(2.4rem, 5vw, 5.6rem);
  font-weight: 500;
  line-height: 0.98;
  letter-spacing: -0.06em;
}

.home-capabilities__list {
  display: grid;
}

.home-capabilities__item {
  min-height: 18rem;
  border-top: 1px solid var(--color-ink-300);
  padding: 1rem 0 2rem;
}

.home-capabilities__number {
  color: var(--color-wood-600);
  font-size: 0.7rem;
  font-weight: 900;
  letter-spacing: 0.16em;
}

@media (min-width: 768px) {
  .home-capabilities__intro {
    grid-template-columns: minmax(10rem, 0.35fr) minmax(0, 1fr);
    align-items: start;
  }

  .home-capabilities__list {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .home-capabilities__item {
    padding-inline: clamp(1rem, 2.5vw, 2.25rem);
  }

  .home-capabilities__item:first-child { padding-left: 0; }
  .home-capabilities__item + .home-capabilities__item { border-left: 1px solid var(--color-ink-300); }
}
</style>
