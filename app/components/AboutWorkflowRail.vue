<script setup lang="ts">
import type { AboutPageContent } from '~/data/about'
import type { ProductionStep } from '~/data/factory'

defineProps<{
  content: AboutPageContent['workflow']
  steps: readonly ProductionStep[]
}>()

const { t } = useLanguage()
const sequence = (index: number) => String(index + 1).padStart(2, '0')
</script>

<template>
  <section
    id="production-workflow"
    data-about-chapter="workflow"
    class="section-y scroll-mt-[calc(var(--header-h)+1rem)] bg-ink-950 text-white"
  >
    <div class="shell">
      <div
        data-testid="about-workflow-layout"
        class="grid gap-10 xl:grid-cols-[0.7fr_1.3fr] xl:gap-16"
      >
        <div>
          <p
            v-reveal
            class="eyebrow reveal text-wood-200"
          >
            {{ t(content.eyebrow) }}
          </p>
          <h2
            v-reveal="80"
            class="text-section-title reveal mt-4 font-black uppercase"
          >
            {{ t(content.title) }}
          </h2>
          <p
            v-reveal="140"
            class="reveal mt-5 text-lg leading-8 text-white/70"
          >
            {{ t(content.description) }}
          </p>
        </div>

        <ol
          data-testid="about-workflow-grid"
          class="grid border-l border-t border-white/15 md:grid-cols-2"
        >
          <li
            v-for="(step, index) in steps"
            :key="t(step.title)"
            v-reveal="(index % 2) * 70"
            data-testid="about-workflow-step"
            class="reveal border-b border-r border-white/15 p-6"
          >
            <span class="text-xs font-black tracking-[0.16em] text-wood-300">
              {{ sequence(index) }}
            </span>
            <h3 class="mt-5 text-lg font-black">
              {{ t(step.title) }}
            </h3>
            <p class="mt-3 text-sm leading-6 text-white/70">
              {{ t(step.description) }}
            </p>
          </li>
        </ol>
      </div>
    </div>
  </section>
</template>
