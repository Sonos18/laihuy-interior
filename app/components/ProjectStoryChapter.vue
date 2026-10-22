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
    class="section-y scroll-mt-[calc(var(--header-h)+var(--subnav-h)+1rem)] bg-wood-50"
  >
    <div class="shell">
      <!-- The case study's lead section: a rail head with the page's Statement heading. -->
      <SectionHead
        layout="rail"
        statement
        :eyebrow="t({ vi: 'Câu chuyện dự án', en: 'Project story' })"
        :title="t({ vi: 'Từ bối cảnh đến lời giải', en: 'From context to response' })"
      />

      <div
        data-story-layout
        class="mt-12 grid gap-12 md:grid-cols-[0.82fr_1.18fr] xl:gap-20"
      >
        <div class="space-y-10">
          <article
            v-if="overview"
            data-story-beat="overview"
          >
            <p class="home-eyebrow-text text-wood-600">
              01 · {{ t({ vi: 'Bối cảnh', en: 'Context' }) }}
            </p>
            <p class="home-lead-text mt-4 text-ink-600">
              {{ overview }}
            </p>
          </article>
          <article
            v-if="challenge"
            data-story-beat="challenge"
            class="border-t border-ink-200 pt-8"
          >
            <p class="home-eyebrow-text text-wood-600">
              02 · {{ t({ vi: 'Bài toán', en: 'Challenge' }) }}
            </p>
            <p class="home-card-heading mt-4 text-ink-950">
              {{ challenge }}
            </p>
          </article>
        </div>

        <article
          v-if="solution"
          data-story-beat="solution"
        >
          <p class="home-eyebrow-text text-wood-600">
            03 · {{ t({ vi: 'Lời giải', en: 'Response' }) }}
          </p>
          <p class="home-lead-text mt-4 text-ink-600">
            {{ solution }}
          </p>
          <figure
            v-if="leadImage"
            class="mt-8 overflow-hidden rounded-[4px]"
          >
            <MediaImage
              :image="leadImage"
              preset="card"
              class="aspect-[16/10] w-full"
              img-class="rounded-[4px]"
            />
          </figure>
        </article>
      </div>
    </div>
  </section>
</template>
