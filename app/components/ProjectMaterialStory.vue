<script setup lang="ts">
import type { MediaImage } from '~/shared/media/types'

type Quote = { quote: string, author: string, role?: string }

const props = defineProps<{
  experience?: string
  highlights: readonly string[]
  materials: readonly string[]
  craftsmanship?: string
  showFactoryLink?: boolean
  quote?: Quote
  images: readonly MediaImage[]
}>()

const { t } = useLanguage()
const experienceImage = computed(() => props.images[1] ?? props.images[0])
const materialImage = computed(() => props.images[3] ?? props.images[0])
</script>

<template>
  <section
    v-if="experience || highlights.length || materials.length || craftsmanship || quote"
    id="materials"
    data-project-chapter="materials"
    class="section-y scroll-mt-[calc(var(--header-h)+var(--subnav-h)+1rem)] border-t border-[var(--rule-light)] bg-[var(--color-ivory)] text-ink-950"
  >
    <div class="shell space-y-16">
      <!-- A split head (DESIGN.md "Section heads"); without the experience lead it is stacked. -->
      <div
        data-material-layout
        :data-head="experience ? 'split' : 'stacked'"
        class="grid gap-10 md:grid-cols-[0.8fr_1.2fr] md:items-end"
      >
        <div>
          <p
            v-reveal.head
            class="eyebrow reveal"
          >
            {{ t({ vi: 'Câu chuyện vật liệu', en: 'Material story' }) }}
          </p>
          <h2
            v-reveal.head
            class="home-section-heading reveal mt-4 text-ink-950"
          >
            {{ t({ vi: 'Quyết định trở thành trải nghiệm', en: 'Decisions made tangible' }) }}
          </h2>
        </div>
        <p
          v-if="experience"
          v-reveal.head
          class="home-lead-text reveal text-ink-600"
        >
          {{ experience }}
        </p>
      </div>

      <figure
        v-if="experienceImage"
        class="overflow-hidden rounded-[4px]"
      >
        <MediaImage
          :image="experienceImage"
          preset="gallery"
          class="aspect-[16/8] w-full"
          img-class="rounded-[4px]"
        />
      </figure>

      <div
        v-if="highlights.length"
        class="grid gap-8 md:grid-cols-[0.65fr_1.35fr]"
      >
        <p class="home-eyebrow-text text-wood-600">
          {{ t({ vi: 'Chi tiết chứng minh', en: 'Proof in the details' }) }}
        </p>
        <ul class="divide-y divide-[var(--rule-light)] border-y border-[var(--rule-light)]">
          <li
            v-for="(highlight, index) in highlights"
            :key="highlight"
            class="grid grid-cols-[3rem_1fr] gap-4 py-5"
          >
            <span class="text-xs font-semibold text-wood-600">{{ String(index + 1).padStart(2, '0') }}</span>
            <span class="text-base leading-[1.7] text-ink-950">{{ highlight }}</span>
          </li>
        </ul>
      </div>

      <div
        v-if="materials.length"
        class="grid gap-10 md:grid-cols-2 md:items-start"
      >
        <figure
          v-if="materialImage"
          class="overflow-hidden rounded-[4px]"
        >
          <MediaImage
            :image="materialImage"
            preset="card"
            class="aspect-[4/3] w-full"
            img-class="rounded-[4px]"
          />
        </figure>
        <div>
          <p class="home-eyebrow-text text-wood-600">
            {{ t({ vi: 'Bảng vật liệu', en: 'Material palette' }) }}
          </p>
          <ul class="mt-5 divide-y divide-[var(--rule-light)] border-y border-[var(--rule-light)]">
            <li
              v-for="material in materials"
              :key="material"
              class="flex gap-3 py-4 text-base leading-[1.7] text-ink-600"
            >
              <Icon
                name="i-lucide-square-stack"
                class="mt-1 h-5 w-5 shrink-0 text-wood-600"
              />
              {{ material }}
            </li>
          </ul>
        </div>
      </div>

      <div
        v-if="craftsmanship"
        class="grid gap-6 border-t border-[var(--rule-light)] pt-10 md:grid-cols-[0.65fr_1.35fr]"
      >
        <p class="home-eyebrow-text text-wood-600">
          {{ t({ vi: 'Thiết kế được hiện thực hóa', en: 'Design made real' }) }}
        </p>
        <div>
          <p class="measure-lead home-lead-text text-ink-600">
            {{ craftsmanship }}
          </p>
          <NuxtLink
            v-if="showFactoryLink"
            to="/nha-xuong"
            class="btn-outline mt-7"
          >
            {{ t({ vi: 'Xem năng lực nhà xưởng', en: 'View factory capability' }) }}
          </NuxtLink>
        </div>
      </div>

      <figure
        v-if="quote"
        class="mx-auto max-w-4xl border-y border-[var(--rule-light)] py-10 text-center"
      >
        <Icon
          name="i-lucide-quote"
          class="mx-auto h-8 w-8 text-wood-600"
        />
        <blockquote class="mt-5 font-display text-2xl font-medium leading-snug text-ink-950 md:text-3xl">
          “{{ quote.quote }}”
        </blockquote>
        <figcaption class="mt-5 text-sm text-ink-600">
          <strong class="font-semibold text-ink-950">{{ quote.author }}</strong>
          <span v-if="quote.role"> · {{ quote.role }}</span>
        </figcaption>
      </figure>
    </div>
  </section>
</template>
