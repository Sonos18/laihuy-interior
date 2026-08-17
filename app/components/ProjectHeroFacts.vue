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
</script>

<template>
  <div data-project-chapter="hero">
    <AppHero
      :title="title"
      :image="image"
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

      <template #chips>
        <div class="mb-5 flex flex-wrap items-center gap-3">
          <span class="rounded-full bg-wood-500 px-3 py-1.5 text-xs font-black uppercase tracking-[0.16em] text-white">
            {{ category }}
          </span>
          <span
            v-if="status"
            class="inline-flex items-center gap-1.5 rounded-full border border-white/25 px-3 py-1.5 text-xs font-bold text-white/86"
          >
            <Icon
              name="i-lucide-circle-check-big"
              class="h-3.5 w-3.5 text-wood-300"
            />
            {{ status }}
          </span>
        </div>
      </template>

      <template #meta>
        <p class="mt-5 max-w-2xl text-lg leading-8 text-white/80">
          {{ description }}
        </p>
      </template>

      <template #actions>
        <NuxtLink
          to="/lien-he"
          class="btn-primary"
        >
          {{ t(uiText.cta.contact) }}
          <Icon
            name="i-lucide-arrow-right"
            class="h-4 w-4"
          />
        </NuxtLink>
        <NuxtLink
          to="/du-an"
          class="btn-secondary"
        >
          {{ t(uiText.cta.allProjects) }}
        </NuxtLink>
      </template>
    </AppHero>

    <div
      data-project-facts
      class="border-y border-white/12 bg-ink-950 text-white"
    >
      <div class="shell">
        <dl class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
          <div
            v-for="(fact, index) in facts"
            :key="fact.key"
            data-project-fact
            :data-fact-key="fact.key"
            class="border-b border-r border-white/12 px-4 py-6 md:px-6"
            :class="facts.length % 2 === 1 && index === facts.length - 1 ? 'col-span-2 md:col-span-1' : ''"
          >
            <dt class="flex items-center gap-2 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-white/52">
              <Icon
                :name="fact.icon"
                class="h-4 w-4 text-wood-300"
              />
              {{ fact.label }}
            </dt>
            <dd class="mt-3 text-base font-black leading-snug text-white">
              {{ fact.value }}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  </div>
</template>
