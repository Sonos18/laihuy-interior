<script setup lang="ts">
// The contractor file (owner, 2026-11-15): founding, legal entity, sign-off and warranty, the
// checks an owner or main contractor runs before choosing a subcontractor. A Rail head (the
// factory head above is Stacked, the closing CTA below is Split: No-Echo), then four hairline
// columns without icons, the same treatment as the case-study capability proof. Under them the
// warranty commitment (owner, 2026-11-17) is a spec sheet in the factory-details pattern: a
// label column and a term per row on hairlines, with the contract reference as a footnote.
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

      <div
        v-reveal
        data-testid="home-warranty"
        class="home-warranty reveal"
      >
        <h3 class="home-warranty__heading">
          {{ t(homePageContent.trust.warranty.title) }}
        </h3>
        <div>
          <dl class="home-warranty__list">
            <div
              v-for="term in homePageContent.trust.warranty.terms"
              :key="term.id"
              :data-warranty="term.id"
              class="home-warranty__row"
            >
              <dt class="home-warranty__label">
                {{ t(term.label) }}
              </dt>
              <dd class="home-warranty__value">
                {{ t(term.value) }}
              </dd>
            </div>
          </dl>
          <p class="home-warranty__note">
            {{ t(homePageContent.trust.warranty.note) }}
          </p>
        </div>
      </div>
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

/* Warranty sheet: the factory-details row (Label + value on a Plaster Line hairline). */
.home-warranty {
  margin-top: 3.5rem;
  display: grid;
  gap: 1rem;
}

.home-warranty__heading {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  line-height: 1.3;
  color: var(--color-ink-600);
}

.home-warranty__row {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding-block: 1rem;
  border-top: 1px solid var(--rule-light);
}

.home-warranty__row:last-child {
  border-bottom: 1px solid var(--rule-light);
}

.home-warranty__label {
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.4;
  color: var(--color-ink-950);
}

.home-warranty__value {
  font-size: 0.875rem;
  line-height: 1.7;
  color: var(--color-ink-600);
}

.home-warranty__note {
  margin-top: 0.75rem;
  font-size: 0.8125rem;
  line-height: 1.6;
  color: var(--color-ink-600);
}

@media (min-width: 640px) {
  .home-warranty__row {
    display: grid;
    grid-template-columns: 12rem minmax(0, 1fr);
    align-items: baseline;
    gap: 1.5rem;
  }
}

@media (min-width: 768px) {
  .home-warranty__value {
    font-size: 1rem;
  }

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

  /* The heading sits in the first trust column, the sheet spans the other three. */
  .home-warranty {
    margin-top: 4rem;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    column-gap: 2rem;
  }

  .home-warranty > div {
    grid-column: span 3 / span 3;
  }

  .home-warranty__heading {
    padding-top: 1.0625rem;
  }
}
</style>
