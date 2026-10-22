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
    class="section-y scroll-mt-[calc(var(--header-h)+1rem)] border-t border-[var(--rule-light)] bg-wood-100 text-ink-950"
  >
    <div class="shell">
      <div
        data-testid="about-workflow-layout"
        class="grid gap-10 xl:grid-cols-[0.7fr_1.3fr] xl:gap-16"
      >
        <div>
          <p
            v-reveal
            class="eyebrow reveal"
          >
            {{ t(content.eyebrow) }}
          </p>
          <h2
            v-reveal="80"
            class="home-section-heading reveal mt-4 text-ink-950"
          >
            {{ t(content.title) }}
          </h2>
          <p
            v-reveal="140"
            class="home-lead-text reveal mt-5 text-ink-600"
          >
            {{ t(content.description) }}
          </p>
        </div>

        <!-- The six stages are a real order, so each keeps a Label-sized marker; the steps are
             tone-on-tone hairline cells on the Sawdust band rather than cards. -->
        <ol
          data-testid="about-workflow-grid"
          class="grid border-l border-t border-ink-200 md:grid-cols-2"
        >
          <li
            v-for="(step, index) in steps"
            :key="t(step.title)"
            v-reveal="(index % 2) * 70"
            data-testid="about-workflow-step"
            class="reveal border-b border-r border-ink-200 p-6 md:p-8"
          >
            <span class="home-eyebrow-text block text-wood-600">
              {{ sequence(index) }}
            </span>
            <h3 class="home-card-heading mt-3 text-ink-950">
              {{ t(step.title) }}
            </h3>
            <p class="mt-3 text-base leading-[1.7] text-ink-600">
              {{ t(step.description) }}
            </p>
          </li>
        </ol>
      </div>
    </div>
  </section>
</template>
