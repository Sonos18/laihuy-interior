<script setup lang="ts">
import type {
  ProjectDeliveryPhase,
  ProjectExecutionProof,
  ProjectScopeItem
} from '~/shared/types/project-detail'

const props = defineProps<{
  projectName: string
  scopeItems: readonly ProjectScopeItem[]
  phases: readonly ProjectDeliveryPhase[]
  executionProof: readonly ProjectExecutionProof[]
}>()

const { t } = useLanguage()
const timelineStyle = computed(() => ({ '--phase-count': String(props.phases.length) }))
</script>

<template>
  <section
    v-if="scopeItems.length"
    id="delivery"
    data-project-chapter="delivery"
    class="section-y scroll-mt-[calc(var(--header-h)+var(--subnav-h)+1rem)] border-t border-[var(--rule-light)] bg-wood-50"
  >
    <div class="shell">
      <!-- A stacked head; the lead names this project's scope, one entry per scope item. -->
      <div
        class="section-head max-w-3xl"
        data-head="stacked"
      >
        <p
          v-reveal.head
          class="eyebrow reveal"
        >
          {{ t({ vi: 'Triển khai', en: 'Delivery' }) }}
        </p>
        <h2
          v-reveal.head
          class="home-section-heading reveal mt-4 text-ink-950"
        >
          {{ t({ vi: 'Từng bước đã làm', en: 'The steps we took' }) }}
        </h2>
        <p
          v-reveal.head
          data-delivery-scope
          class="home-lead-text measure-lead reveal mt-5 text-ink-600"
        >
          {{ t({ vi: `Phạm vi ở ${projectName}:`, en: `Scope on ${projectName}:` }) }}
          <template
            v-for="(scope, index) in scopeItems"
            :key="scope.key"
          >
            <span
              :data-scope-key="scope.key"
              class="font-semibold text-ink-900"
            >{{ scope.label }}</span>{{ index < scopeItems.length - 1 ? ' · ' : '.' }}
          </template>
        </p>
      </div>

      <!-- The steps as a traced sequence (DESIGN.md "Motion", Trace): the scroll draws a bronze
           line along each step's top hairline, and a finished step's number warms. -->
      <ol
        v-trace
        role="list"
        data-delivery-timeline
        class="project-delivery__timeline mt-12"
        :style="timelineStyle"
      >
        <li
          v-for="(phase, index) in phases"
          :key="phase.key"
          class="trace-step project-delivery__step"
        >
          <span
            data-trace-number
            class="home-stat-value block text-wood-600"
            aria-hidden="true"
          >{{ String(index + 1).padStart(2, '0') }}</span>
          <p class="home-card-heading mt-3 text-ink-950">
            {{ phase.label }}
          </p>
        </li>
      </ol>

      <div
        v-if="executionProof.length"
        class="mt-16"
      >
        <p class="home-eyebrow-text text-wood-600">
          {{ t({ vi: 'Năng lực đứng sau phạm vi này', en: 'What stands behind this scope' }) }}
        </p>
        <div class="mt-6 grid gap-8 md:grid-cols-3">
          <article
            v-for="proof in executionProof"
            :key="proof.id"
            v-reveal.item.rule
            :data-execution-proof="proof.id"
            class="reveal border-t border-[var(--rule-light)] pt-6"
          >
            <h3 class="home-card-heading text-ink-950">
              {{ proof.title }}
            </h3>
            <p class="mt-3 text-sm leading-[1.7] text-ink-600">
              {{ proof.description }}
            </p>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.project-delivery__timeline {
  display: grid;
  grid-template-columns: 1fr;
}

.project-delivery__step {
  border-top: 1px solid var(--rule-light);
  padding: 1.25rem 0;
}

@media (min-width: 768px) {
  .project-delivery__timeline {
    grid-template-columns: repeat(var(--phase-count), minmax(0, 1fr));
  }

  .project-delivery__step {
    padding: 1.75rem 1.5rem 0 0;
  }
}
</style>
