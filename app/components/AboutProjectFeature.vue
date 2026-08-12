<script setup lang="ts">
import type { AboutProjectLabels } from '~/data/about'
import { categoryDefinitions } from '~/data/categories'
import type { MediaImage } from '~/shared/media/types'
import type { Project } from '~/shared/types/project'

const props = defineProps<{
  project: Project
  image: MediaImage
  labels: AboutProjectLabels
  emphasis: 'primary' | 'secondary'
}>()

const { t, ta } = useLanguage()
const scope = computed(() => props.project.scope ? ta(props.project.scope).join(' · ') : '')
</script>

<template>
  <NuxtLink
    :to="`/du-an/${project.slug}`"
    data-testid="about-project-feature"
    :data-project-slug="project.slug"
    class="group block overflow-hidden rounded-2xl bg-ink-950 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-wood-500"
  >
    <article>
      <MediaImage
        :image="image"
        preset="card"
        :sizes="emphasis === 'primary' ? 'sm:100vw xl:60vw' : 'sm:100vw xl:40vw'"
        :class="emphasis === 'primary' ? 'aspect-[16/10]' : 'aspect-[4/3]'"
        img-class="transition-transform duration-700 ease-out group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
      />
      <div class="p-6 md:p-8">
        <p class="text-xs font-black uppercase tracking-[0.14em] text-wood-300">
          {{ t(categoryDefinitions[project.category].label) }}
          <span v-if="scope"> · {{ scope }}</span>
        </p>
        <h3
          class="mt-4 font-black uppercase"
          :class="emphasis === 'primary' ? 'text-2xl md:text-3xl' : 'text-xl md:text-2xl'"
        >
          {{ t(project.name) }}
        </h3>
        <p class="mt-4 text-sm leading-6 text-white/70">
          {{ t(project.shortDescription) }}
        </p>

        <dl class="mt-6 grid gap-4 border-t border-white/15 pt-5 sm:grid-cols-3">
          <div v-if="project.area">
            <dt class="text-xs uppercase tracking-[0.12em] text-white/50">
              {{ t(labels.area) }}
            </dt>
            <dd class="mt-1 text-sm font-bold">
              {{ t(project.area) }}
            </dd>
          </div>
          <div v-if="project.location">
            <dt class="text-xs uppercase tracking-[0.12em] text-white/50">
              {{ t(labels.location) }}
            </dt>
            <dd class="mt-1 text-sm font-bold">
              {{ t(project.location) }}
            </dd>
          </div>
          <div v-if="project.year">
            <dt class="text-xs uppercase tracking-[0.12em] text-white/50">
              {{ t(labels.year) }}
            </dt>
            <dd class="mt-1 text-sm font-bold">
              {{ t(project.year) }}
            </dd>
          </div>
        </dl>

        <span class="mt-7 inline-flex items-center gap-2 text-sm font-black text-wood-200">
          {{ t(labels.view) }}
          <Icon
            name="i-lucide-arrow-right"
            class="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none"
            aria-hidden="true"
          />
        </span>
      </div>
    </article>
  </NuxtLink>
</template>
