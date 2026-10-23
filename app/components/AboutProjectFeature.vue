<script setup lang="ts">
import type { AboutProjectLabels } from '~/data/about'
import { categoryDefinitions } from '~/data/categories'
import type { MediaImage } from '~/shared/media/types'
import type { Project } from '~/shared/types/project'
import { yearLabelFor } from '~/utils/project-detail-view-model'

const props = defineProps<{
  project: Project
  image: MediaImage
  labels: AboutProjectLabels
  emphasis: 'primary' | 'secondary'
}>()

const { t, ta, locale } = useLanguage()
const scope = computed(() => props.project.scope ? ta(props.project.scope).join(' · ') : '')
</script>

<template>
  <NuxtLink
    :to="`/du-an/${project.slug}`"
    data-testid="about-project-feature"
    :data-project-slug="project.slug"
    class="group block overflow-hidden card-link text-ink-950"
  >
    <article>
      <MediaImage
        :image="image"
        preset="card"
        :sizes="emphasis === 'primary' ? 'sm:100vw xl:60vw' : 'sm:100vw xl:40vw'"
        class="bg-ink-100"
        :class="emphasis === 'primary' ? 'aspect-[16/10]' : 'aspect-[4/3]'"
        img-class="transition-transform duration-[var(--dur-image)] ease-[var(--ease-editorial)] group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
      />
      <div class="p-6 md:p-8">
        <p class="home-eyebrow-text text-wood-600">
          {{ t(categoryDefinitions[project.category].label) }}
          <span v-if="scope"> · {{ scope }}</span>
        </p>
        <h3 class="home-card-heading mt-4 text-ink-950">
          {{ t(project.name) }}
        </h3>
        <p class="mt-4 text-base leading-[1.7] text-ink-600">
          {{ t(project.shortDescription) }}
        </p>

        <dl class="mt-6 grid gap-4 border-t border-[var(--rule-light)] pt-5 sm:grid-cols-3">
          <div v-if="project.area">
            <dt class="home-eyebrow-text text-ink-500">
              {{ t(labels.area) }}
            </dt>
            <dd class="mt-1 text-base font-semibold text-ink-950">
              {{ t(project.area) }}
            </dd>
          </div>
          <div v-if="project.location">
            <dt class="home-eyebrow-text text-ink-500">
              {{ t(labels.location) }}
            </dt>
            <dd class="mt-1 text-base font-semibold text-ink-950">
              {{ t(project.location) }}
            </dd>
          </div>
          <div v-if="project.year">
            <dt class="home-eyebrow-text text-ink-500">
              {{ yearLabelFor(project, locale) }}
            </dt>
            <dd class="mt-1 text-base font-semibold text-ink-950">
              {{ t(project.year) }}
            </dd>
          </div>
        </dl>

        <span class="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-wood-600">
          {{ t(labels.view) }}
          <Icon
            name="i-lucide-arrow-right"
            class="h-4 w-4 transition-transform duration-[var(--dur-hover)] ease-[var(--ease-editorial)] group-hover:translate-x-1 motion-reduce:transition-none"
            aria-hidden="true"
          />
        </span>
      </div>
    </article>
  </NuxtLink>
</template>
