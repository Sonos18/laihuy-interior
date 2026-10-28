<script setup lang="ts">
import type {
  FactoryPageContent,
  MachineryProcessGroup
} from '~/data/factory'
import type { MediaImage } from '~/shared/media/types'

defineProps<{
  content: FactoryPageContent['process']
  groups: readonly MachineryProcessGroup[]
  image: MediaImage
  /** The page's one Monument figure, opening this chapter (DESIGN.md "Monument"). */
  monument?: { label: string, value: string }
}>()

const { t } = useLanguage()
const sequence = (index: number) => String(index + 1).padStart(2, '0')
</script>

<template>
  <!-- The factory proof chapter: the page's one Sawdust emphasis band (DESIGN.md). The four
       stages are a real manufacturing order, so each keeps a Label-sized marker. -->
  <section
    data-testid="factory-process"
    class="section-y border-t border-[var(--rule-light)] bg-wood-100 text-ink-950"
  >
    <div class="shell">
      <!-- The heading comes first in the document, so a screen reader announces the chapter
           before its figure; the figure still opens the chapter on screen (`order-first`). It and
           the head hold nothing focusable, so the visual order costs keyboard users nothing. -->
      <div class="flex flex-col">
        <FactMonument
          v-if="monument"
          class="order-first mb-16 md:mb-24"
          :label="monument.label"
          :value="monument.value"
        />

        <SectionHead
          layout="split"
          :eyebrow="t(content.eyebrow)"
          :title="t(content.title)"
          :lead="t(content.description)"
        />
      </div>

      <div
        data-testid="factory-process-layout"
        class="mt-10 grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch"
      >
        <MediaImage
          :image="image"
          sizes="sm:100vw lg:52vw"
          class="group min-h-64 rounded-[4px] bg-ink-100"
          img-class="object-center transition-transform duration-[var(--dur-image)] ease-[var(--ease-editorial)] group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
        <div
          v-trace
          data-testid="factory-process-groups"
          class="grid gap-4 md:grid-cols-2"
        >
          <article
            v-for="(group, index) in groups"
            :key="group.id"
            v-reveal.item
            data-testid="factory-process-group"
            class="reveal flex flex-col card p-6"
          >
            <span
              data-trace-number
              class="home-eyebrow-text block text-wood-600"
              aria-hidden="true"
            >
              {{ sequence(index) }}
            </span>
            <h3 class="home-card-heading mt-3 text-ink-950">
              {{ t(group.title) }}
            </h3>
            <p class="mt-3 text-base leading-[1.7] text-ink-600">
              {{ t(group.benefit) }}
            </p>
            <p
              data-trace-rule
              class="mt-auto border-t border-[var(--rule-light)] pt-4 text-base font-medium leading-[1.7] text-ink-800"
            >
              {{ group.machines.map(machine => t(machine)).join(' · ') }}
            </p>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>
