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
// Two photographs the rest of the page does not show (each image has one home). A short set has
// none to spare, so the chapter is text only.
const experienceImage = computed(() => props.images[0])
const materialImage = computed(() => props.images[1])
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
            {{ t({ vi: 'Vật liệu', en: 'Materials' }) }}
          </p>
          <h2
            v-reveal.head
            class="home-section-heading reveal mt-4 text-ink-950"
          >
            {{ t({ vi: 'Vật liệu và chi tiết', en: 'Materials and details' }) }}
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
          v-reveal.curtain
          :image="experienceImage"
          preset="gallery"
          class="reveal aspect-[16/8] w-full"
          img-class="rounded-[4px]"
        />
      </figure>

      <div
        v-if="highlights.length"
        class="grid gap-8 md:grid-cols-[0.65fr_1.35fr]"
      >
        <p class="home-eyebrow-text text-wood-600">
          {{ t({ vi: 'Chi tiết thiết kế', en: 'Design details' }) }}
        </p>
        <ul class="divide-y divide-[var(--rule-light)] border-y border-[var(--rule-light)]">
          <li
            v-for="(highlight, index) in highlights"
            :key="highlight"
            v-reveal.item.rule
            class="reveal grid grid-cols-[3rem_1fr] gap-4 py-5"
          >
            <span class="text-xs font-semibold text-wood-600">{{ String(index + 1).padStart(2, '0') }}</span>
            <span class="text-base leading-[1.7] text-ink-950">{{ highlight }}</span>
          </li>
        </ul>
      </div>

      <!-- The material palette: beside its photograph when there is one, otherwise laid out like
           the design details above (label column, list column). -->
      <div
        v-if="materials.length"
        class="grid gap-10 md:items-start"
        :class="materialImage ? 'md:grid-cols-2' : 'md:grid-cols-[0.65fr_1.35fr] gap-8'"
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
        <p
          v-if="!materialImage"
          class="home-eyebrow-text text-wood-600"
        >
          {{ t({ vi: 'Bảng vật liệu', en: 'Material palette' }) }}
        </p>
        <div>
          <p
            v-if="materialImage"
            class="home-eyebrow-text mb-5 text-wood-600"
          >
            {{ t({ vi: 'Bảng vật liệu', en: 'Material palette' }) }}
          </p>
          <ul class="divide-y divide-[var(--rule-light)] border-y border-[var(--rule-light)]">
            <li
              v-for="(material, index) in materials"
              :key="material"
              v-reveal.item.rule
              class="reveal grid grid-cols-[3rem_1fr] gap-4 py-4 text-base leading-[1.7] text-ink-600"
            >
              <span
                class="pt-1 text-xs font-semibold text-wood-600"
                aria-hidden="true"
              >{{ String.fromCharCode(65 + index) }}</span>
              <span>{{ material }}</span>
            </li>
          </ul>
        </div>
      </div>

      <div
        v-if="craftsmanship"
        class="grid gap-6 border-t border-[var(--rule-light)] pt-10 md:grid-cols-[0.65fr_1.35fr]"
      >
        <p class="home-eyebrow-text text-wood-600">
          {{ t({ vi: 'Sản xuất và lắp đặt', en: 'How it was made and installed' }) }}
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
