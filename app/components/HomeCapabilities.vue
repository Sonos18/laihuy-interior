<script setup lang="ts">
import { homePageContent, type HomeCapability } from '~/data/home-page'

defineProps<{ capabilities: readonly HomeCapability[] }>()
const { t } = useLanguage()
</script>

<template>
  <section
    data-testid="home-capabilities"
    class="home-capabilities bg-ink-950 text-white"
  >
    <div class="shell">
      <div class="home-capabilities__intro">
        <p
          v-reveal
          class="eyebrow home-eyebrow-text reveal text-[var(--bronze-light)]"
        >
          {{ t(homePageContent.capabilities.eyebrow) }}
        </p>
        <h2
          v-reveal="80"
          class="home-capabilities__title home-section-heading reveal mt-4 text-white"
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
            class="home-capabilities__number home-meta-text"
            aria-hidden="true"
          >{{ String(index + 1).padStart(2, '0') }}</span>
          <h3 class="home-capabilities__item-title home-card-heading mt-10 font-semibold text-white">
            {{ t(capability.title) }}
          </h3>
          <p class="home-capabilities__item-desc mt-4 text-sm leading-[1.7] text-white/70 md:text-base">
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
  font-weight: 500;
}

.home-capabilities__list {
  display: grid;
}

.home-capabilities__item {
  min-height: 18rem;
  border-top: 1px solid rgb(255 255 255 / 0.15);
  padding: 1rem 0 2rem;
}

.home-capabilities__number {
  color: var(--bronze-light);
  font-weight: 700;
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
  .home-capabilities__item + .home-capabilities__item { border-left: 1px solid rgb(255 255 255 / 0.15); }
}
</style>
