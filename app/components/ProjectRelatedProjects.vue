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
    class="section-y bg-ink-50"
  >
    <div class="shell">
      <div class="mb-10 flex items-end justify-between gap-6">
        <div>
          <p
            v-reveal
            class="eyebrow reveal"
          >
            {{ t(uiText.labels.exploreMore) }}
          </p>
          <h2
            v-reveal="80"
            class="reveal text-section-title mt-4 font-black uppercase text-ink-950"
          >
            {{ t(uiText.labels.relatedProjects) }}
          </h2>
        </div>
        <NuxtLink
          to="/du-an"
          class="btn-outline hidden md:inline-flex"
        >
          {{ t(uiText.cta.allProjects) }}
        </NuxtLink>
      </div>

      <div class="grid gap-6 md:grid-cols-3">
        <NuxtLink
          v-for="({ item, cover }, index) in projects"
          :key="item.slug"
          v-reveal="index * 100"
          :to="`/du-an/${item.slug}`"
          class="group reveal block overflow-hidden rounded-2xl bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-wood-500"
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
              class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transform-none motion-reduce:transition-none"
            />
          </div>
          <div :class="['border border-ink-200 p-5', cover ? 'border-t-0' : '']">
            <span class="text-xs font-bold uppercase tracking-[0.16em] text-wood-600">
              {{ t(categoryDefinitions[item.category].label) }}
            </span>
            <h3 class="mt-3 text-xl font-black text-ink-950">{{ t(item.name) }}</h3>
          </div>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
