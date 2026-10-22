<script setup lang="ts">
import { homePageContent, type HomeCapability } from '~/data/home-page'

defineProps<{ capabilities: readonly HomeCapability[] }>()
const { t } = useLanguage()
</script>

<template>
  <section
    data-testid="home-capabilities"
    class="home-capabilities bg-[var(--color-ivory)] text-ink-950"
  >
    <div class="shell">
      <div class="home-capabilities__intro">
        <p
          v-reveal.head
          class="eyebrow home-eyebrow-text reveal text-wood-600"
        >
          {{ t(homePageContent.capabilities.eyebrow) }}
        </p>
        <h2
          v-reveal.head
          class="home-capabilities__title home-section-heading reveal mt-4 text-ink-950"
        >
          {{ t(homePageContent.capabilities.title) }}
        </h2>
      </div>

      <ol
        class="home-capabilities__list mt-14"
        role="list"
      >
        <li
          v-for="(capability, index) in capabilities"
          :key="capability.id"
          v-reveal.item
          data-testid="home-capability"
          class="home-capabilities__item reveal"
        >
          <span
            class="home-capabilities__number home-meta-text"
            aria-hidden="true"
          >{{ String(index + 1).padStart(2, '0') }}</span>
          <h3 class="home-capabilities__item-title home-card-heading mt-10 text-ink-950">
            {{ t(capability.title) }}
          </h3>
          <p class="home-capabilities__item-desc mt-4 text-sm leading-[1.7] text-ink-600 md:text-base">
            {{ t(capability.description) }}
          </p>
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped>
/* Raw Silk: one tone step from the Linen material story above and the linen project stage
   below (DESIGN.md Warm Light Rule). Hairlines mark both seams, where the step alone is quiet. */
.home-capabilities {
  padding-block: var(--section-py);
  border-block: 1px solid var(--rule-light);
}

.home-capabilities__intro {
  display: grid;
  gap: 1rem;
}

.home-capabilities__title {
  max-width: 58rem;
}

.home-capabilities__list {
  display: grid;
}

.home-capabilities__item {
  border-top: 1px solid var(--rule-light);
  padding: 1rem 0 2rem;
}

.home-capabilities__number {
  color: var(--accent-light);
  font-weight: 700;
  letter-spacing: 0.16em;
}

@media (min-width: 768px) {
  .home-capabilities__list {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  /* The grid stretches the three items to the tallest, so their rules already share one length
     without a min-height floor (which only left an empty block under each item). */
  .home-capabilities__item {
    padding-inline: clamp(1rem, 2.5vw, 2.25rem);
  }

  .home-capabilities__item:first-child { padding-left: 0; }
  .home-capabilities__item + .home-capabilities__item { border-left: 1px solid var(--rule-light); }
}
</style>
