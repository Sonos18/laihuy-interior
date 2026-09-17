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
    class="section-y scroll-mt-[calc(var(--header-h)+var(--subnav-h)+1rem)] bg-[var(--color-surface-dark)] text-[var(--color-ivory)]"
  >
    <div class="shell space-y-16">
      <div
        data-material-layout
        class="grid gap-10 md:grid-cols-[0.8fr_1.2fr] md:items-end"
      >
        <div>
          <p
            v-reveal
            class="eyebrow reveal !text-[var(--bronze-light)]"
          >
            {{ t({ vi: 'Câu chuyện vật liệu', en: 'Material story' }) }}
          </p>
          <h2
            v-reveal="80"
            class="reveal text-section-title mt-4 font-black uppercase text-[var(--color-ivory)]"
          >
            {{ t({ vi: 'Quyết định trở thành trải nghiệm', en: 'Decisions made tangible' }) }}
          </h2>
        </div>
        <p
          v-if="experience"
          v-reveal="120"
          class="reveal text-xl leading-9 text-[var(--text-muted)]"
        >
          {{ experience }}
        </p>
      </div>

      <figure
        v-if="experienceImage"
        class="overflow-hidden rounded-2xl"
      >
        <MediaImage
          :image="experienceImage"
          preset="gallery"
          class="aspect-[16/8] w-full"
          img-class="rounded-2xl"
        />
      </figure>

      <div
        v-if="highlights.length"
        class="grid gap-8 md:grid-cols-[0.65fr_1.35fr]"
      >
        <p class="text-xs font-black uppercase tracking-[0.16em] text-[var(--bronze-light)]">
          {{ t({ vi: 'Chi tiết chứng minh', en: 'Proof in the details' }) }}
        </p>
        <ul class="divide-y divide-[var(--hairline)] border-y border-[var(--hairline)]">
          <li
            v-for="(highlight, index) in highlights"
            :key="highlight"
            class="grid grid-cols-[3rem_1fr] gap-4 py-5"
          >
            <span class="text-xs font-black text-[var(--bronze-light)]">{{ String(index + 1).padStart(2, '0') }}</span>
            <span class="text-base leading-7 text-[var(--color-ivory)]">{{ highlight }}</span>
          </li>
        </ul>
      </div>

      <div
        v-if="materials.length"
        class="grid gap-10 md:grid-cols-2 md:items-start"
      >
        <figure
          v-if="materialImage"
          class="overflow-hidden rounded-2xl"
        >
          <MediaImage
            :image="materialImage"
            preset="card"
            class="aspect-[4/3] w-full"
            img-class="rounded-2xl"
          />
        </figure>
        <div>
          <p class="text-xs font-black uppercase tracking-[0.16em] text-[var(--bronze-light)]">
            {{ t({ vi: 'Bảng vật liệu', en: 'Material palette' }) }}
          </p>
          <ul class="mt-5 divide-y divide-[var(--hairline)] border-y border-[var(--hairline)]">
            <li
              v-for="material in materials"
              :key="material"
              class="flex gap-3 py-4 text-base leading-7 text-[var(--text-muted)]"
            >
              <Icon
                name="i-lucide-square-stack"
                class="mt-1 h-5 w-5 shrink-0 text-[var(--bronze-light)]"
              />
              {{ material }}
            </li>
          </ul>
        </div>
      </div>

      <div
        v-if="craftsmanship"
        class="grid gap-6 border-t border-[var(--hairline)] pt-10 md:grid-cols-[0.65fr_1.35fr]"
      >
        <p class="text-xs font-black uppercase tracking-[0.16em] text-[var(--bronze-light)]">
          {{ t({ vi: 'Thiết kế được hiện thực hóa', en: 'Design made real' }) }}
        </p>
        <div>
          <p class="measure-lead text-lg leading-9 text-[var(--text-muted)]">
            {{ craftsmanship }}
          </p>
          <NuxtLink
            v-if="showFactoryLink"
            to="/nha-xuong"
            class="btn-secondary mt-7"
          >
            {{ t({ vi: 'Xem năng lực nhà xưởng', en: 'View factory capability' }) }}
          </NuxtLink>
        </div>
      </div>

      <figure
        v-if="quote"
        class="mx-auto max-w-4xl border-y border-[var(--hairline)] py-10 text-center"
      >
        <Icon
          name="i-lucide-quote"
          class="mx-auto h-8 w-8 text-[var(--bronze-light)]"
        />
        <blockquote class="mt-5 text-2xl font-black leading-snug text-[var(--color-ivory)]">
          “{{ quote.quote }}”
        </blockquote>
        <figcaption class="mt-5 text-sm text-[var(--text-subtle)]">
          <strong class="text-[var(--color-ivory)]">{{ quote.author }}</strong>
          <span v-if="quote.role"> · {{ quote.role }}</span>
        </figcaption>
      </figure>
    </div>
  </section>
</template>
