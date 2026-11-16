<script setup lang="ts">
// The contractor file (owner, 2026-11-15): founding, legal entity, sign-off and warranty, the
// checks an owner or main contractor runs before choosing a subcontractor. A Rail head (the
// factory head above is Stacked, the closing CTA below is Split: No-Echo), then four hairline
// columns without icons, the same treatment as the case-study capability proof.
import { company } from '~/data/company'
import { homePageContent } from '~/data/home-page'

const { t } = useLanguage()

const fill = (text: string) => text
  .replaceAll('{legalName}', company.legalName)
  .replaceAll('{taxId}', company.taxId)
</script>

<template>
  <section
    data-testid="home-trust"
    class="home-trust section-y border-t border-[var(--rule-light)]"
  >
    <div class="shell">
      <SectionHead
        layout="rail"
        eyebrow-class="eyebrow home-eyebrow-text text-wood-600"
        :eyebrow="t(homePageContent.trust.eyebrow)"
        :title="t(homePageContent.trust.title)"
        :lead="t(homePageContent.trust.lead)"
      />

      <ul
        class="home-trust__list mt-12"
        role="list"
      >
        <li
          v-for="item in homePageContent.trust.items"
          :key="item.id"
          v-reveal
          :data-trust="item.id"
          class="home-trust__item reveal"
        >
          <h3 class="home-card-heading text-ink-950">
            {{ t(item.title) }}
          </h3>
          <p class="mt-3 text-sm leading-[1.7] text-ink-600 md:text-base">
            {{ fill(t(item.body)) }}
          </p>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.home-trust {
  background-color: var(--color-ivory);
}

.home-trust__list {
  display: grid;
  gap: 2rem;
}

.home-trust__item {
  border-top: 1px solid var(--rule-light);
  padding-top: 1.5rem;
}

@media (min-width: 768px) {
  .home-trust__list {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    column-gap: 2rem;
    row-gap: 2.5rem;
  }
}

@media (min-width: 1024px) {
  .home-trust__list {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
</style>
