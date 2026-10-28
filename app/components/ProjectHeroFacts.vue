<script setup lang="ts">
import { uiText } from '~/data/ui'
import type { MediaImage } from '~/shared/media/types'
import type { ProjectDetailFact } from '~/shared/types/project-detail'

defineProps<{
  title: string
  image: MediaImage
  category: string
  status?: string
  description: string
  facts: readonly ProjectDetailFact[]
}>()

const { t } = useLanguage()

const COUNTED_FACTS = new Set(['area', 'rooms'])
</script>

<template>
  <div data-project-chapter="hero">
    <AppHero
      :title="title"
      :image="image"
      :topic="status ? `${category} · ${status}` : category"
      mode="caption"
      atmosphere="dark"
      focal="50% 40%"
    >
      <template #breadcrumb>
        <nav
          class="mb-8 flex items-center gap-2 text-sm font-semibold text-white/62"
          :aria-label="t({ vi: 'Đường dẫn', en: 'Breadcrumb' })"
        >
          <NuxtLink
            to="/du-an"
            class="inline-flex items-center gap-2 transition-colors hover:text-white"
          >
            <Icon
              name="i-lucide-arrow-left"
              class="h-4 w-4"
            />
            {{ t({ vi: 'Dự án', en: 'Projects' }) }}
          </NuxtLink>
        </nav>
      </template>

      <template #meta>
        <p class="home-lead-text mt-5 max-w-2xl text-white/80">
          {{ description }}
        </p>
      </template>

      <template #actions>
        <NuxtLink
          to="/lien-he"
          class="btn-bronze btn-bronze--on-dark"
        >
          {{ t(uiText.cta.quote) }}
          <Icon
            name="i-lucide-arrow-right"
            class="h-4 w-4"
          />
        </NuxtLink>
        <NuxtLink
          to="/du-an"
          class="btn-luxury-outline"
        >
          {{ t(uiText.cta.allProjects) }}
        </NuxtLink>
      </template>
    </AppHero>

    <!-- The title block (DESIGN.md "Project facts"): one row of hairline cells, no box and no icons.
         A figure takes the Stat role and counts; a year, scope or place is a phrase in Title. -->
    <div
      data-project-facts-zone
      class="border-b border-[var(--rule-light)] bg-wood-50"
    >
      <div
        data-project-facts
        class="shell"
      >
        <dl class="project-facts">
          <div
            v-for="(fact, index) in facts"
            :key="fact.key"
            v-reveal.item.rule
            data-project-fact
            :data-fact-key="fact.key"
            class="project-facts__cell reveal"
            :class="facts.length % 2 === 1 && index === facts.length - 1 ? 'project-facts__cell--wide' : ''"
          >
            <dt class="home-eyebrow-text text-ink-600">
              {{ fact.label }}
            </dt>
            <dd
              v-count-up="COUNTED_FACTS.has(fact.key)"
              class="mt-3 text-ink-900"
              :class="COUNTED_FACTS.has(fact.key) ? 'home-stat-value whitespace-nowrap' : 'home-card-heading'"
            >
              {{ fact.value }}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Two cells a row below 768px, three to 1279px, the whole row from 1280px. Cells are divided by
   Plaster Line hairlines; the row itself has no frame. */
.project-facts {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.project-facts__cell {
  padding: 1.5rem 1rem 1.5rem 0;
  border-bottom: 1px solid var(--rule-light);
}

.project-facts__cell--wide {
  grid-column: span 2;
}

@media (min-width: 768px) {
  .project-facts {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .project-facts__cell--wide {
    grid-column: auto;
  }
}

@media (min-width: 1280px) {
  .project-facts {
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }

  .project-facts__cell {
    padding: 2.25rem 1.5rem;
    border-bottom: 0;
    border-left: 1px solid var(--rule-light);
  }

  .project-facts__cell:first-child {
    padding-left: 0;
    border-left: 0;
  }
}
</style>
