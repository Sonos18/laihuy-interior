<script setup lang="ts">
import { categoryDefinitions } from '~/data/categories'
import { uiText } from '~/data/ui'
import type { ProjectRelatedCard } from '~/shared/types/project-detail'

defineProps<{ projects: readonly ProjectRelatedCard[] }>()

const { t } = useLanguage()
</script>

<template>
  <section
    v-if="projects.length"
    data-project-chapter="related"
    class="section-y border-t border-[var(--rule-light)] bg-wood-50"
  >
    <div class="shell">
      <!-- A rail head; the link to the full index hangs under the heading. -->
      <SectionHead
        layout="rail"
        class="mb-10"
        :eyebrow="t(uiText.labels.exploreMore)"
        :title="t(uiText.labels.relatedProjects)"
      >
        <template #aside>
          <NuxtLink
            to="/du-an"
            class="btn-outline hidden md:inline-flex"
          >
            {{ t(uiText.cta.allProjects) }}
          </NuxtLink>
        </template>
      </SectionHead>

      <div class="grid gap-6 md:grid-cols-3">
        <NuxtLink
          v-for="{ item, cover } in projects"
          :key="item.slug"
          v-reveal.item.image
          :to="`/du-an/${item.slug}`"
          class="group reveal block overflow-hidden card-link"
        >
          <div
            v-if="cover"
            class="aspect-[4/3] overflow-hidden bg-ink-100"
          >
            <NuxtImg
              :src="cover.path"
              :alt="t(item.name)"
              :width="cover.width"
              :height="cover.height"
              sizes="sm:100vw md:33vw"
              loading="lazy"
              class="h-full w-full object-cover transition-transform duration-[var(--dur-image)] ease-[var(--ease-editorial)] group-hover:scale-[1.02] motion-reduce:transform-none motion-reduce:transition-none"
            />
          </div>
          <div :class="['p-5', cover ? 'border-t border-[var(--rule-light)]' : '']">
            <span class="home-eyebrow-text text-wood-600">
              {{ t(categoryDefinitions[item.category].label) }}
            </span>
            <h3 class="home-card-heading mt-3 text-ink-950">{{ t(item.name) }}</h3>
          </div>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
