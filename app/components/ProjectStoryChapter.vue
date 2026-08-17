<script setup lang="ts">
import type { MediaImage } from '~/shared/media/types'

defineProps<{
  overview?: string
  challenge?: string
  solution?: string
  leadImage?: MediaImage
}>()

const { t } = useLanguage()
</script>

<template>
  <section
    v-if="overview || challenge || solution"
    id="story"
    data-project-chapter="story"
    class="section-y scroll-mt-[calc(var(--header-h)+var(--subnav-h)+1rem)] bg-white"
  >
    <div class="shell">
      <p
        v-reveal
        class="eyebrow reveal"
      >
        {{ t({ vi: 'Câu chuyện dự án', en: 'Project story' }) }}
      </p>
      <h2
        v-reveal="80"
        class="reveal text-section-title mt-4 max-w-4xl font-black uppercase text-ink-950"
      >
        {{ t({ vi: 'Từ bối cảnh đến lời giải', en: 'From context to response' }) }}
      </h2>

      <div
        data-story-layout
        class="mt-12 grid gap-12 md:grid-cols-[0.82fr_1.18fr] xl:gap-20"
      >
        <div class="space-y-10">
          <article
            v-if="overview"
            data-story-beat="overview"
          >
            <p class="text-xs font-black uppercase tracking-[0.16em] text-wood-600">
              01 · {{ t({ vi: 'Bối cảnh', en: 'Context' }) }}
            </p>
            <p class="mt-4 text-lg leading-9 text-ink-600">
              {{ overview }}
            </p>
          </article>
          <article
            v-if="challenge"
            data-story-beat="challenge"
            class="border-l-2 border-wood-500 pl-6"
          >
            <p class="text-xs font-black uppercase tracking-[0.16em] text-wood-600">
              02 · {{ t({ vi: 'Bài toán', en: 'Challenge' }) }}
            </p>
            <p class="mt-4 text-xl font-black leading-8 text-ink-950">
              {{ challenge }}
            </p>
          </article>
        </div>

        <article
          v-if="solution"
          data-story-beat="solution"
        >
          <p class="text-xs font-black uppercase tracking-[0.16em] text-wood-600">
            03 · {{ t({ vi: 'Lời giải', en: 'Response' }) }}
          </p>
          <p class="mt-4 text-lg leading-9 text-ink-600">
            {{ solution }}
          </p>
          <figure
            v-if="leadImage"
            class="mt-8 overflow-hidden rounded-2xl"
          >
            <MediaImage
              :image="leadImage"
              preset="card"
              class="aspect-[16/10] w-full"
              img-class="rounded-2xl"
            />
          </figure>
        </article>
      </div>
    </div>
  </section>
</template>
