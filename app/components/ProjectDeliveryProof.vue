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
    class="section-y scroll-mt-[calc(var(--header-h)+var(--subnav-h)+1rem)] bg-white"
  >
    <div class="shell">
      <div class="grid gap-10 md:grid-cols-[0.72fr_1.28fr] md:items-end">
        <div>
          <p
            v-reveal
            class="eyebrow reveal"
          >
            {{ t({ vi: 'Triển khai', en: 'Delivery' }) }}
          </p>
          <h2
            v-reveal="80"
            class="reveal text-section-title mt-4 font-black uppercase text-ink-950"
          >
            {{ t({ vi: 'Từ phạm vi đến bàn giao', en: 'From scope to handover' }) }}
          </h2>
        </div>
        <p
          v-reveal="120"
          class="measure-lead reveal text-lg leading-8 text-ink-600"
        >
          {{ t({
            vi: `Từ chiến lược thiết kế, ${projectName} được triển khai theo đúng phạm vi đã xác nhận, với từng bước nối tiếp đến bàn giao.`,
            en: `From the design response, ${projectName} moves through its verified scope as one connected sequence toward handover.`
          }) }}
        </p>
      </div>

      <ul class="mt-10 flex flex-wrap border-y border-ink-200">
        <li
          v-for="scope in scopeItems"
          :key="scope.key"
          :data-scope-key="scope.key"
          class="flex items-center gap-3 border-r border-ink-200 px-5 py-4 text-sm font-black text-ink-950"
        >
          <Icon
            :name="scope.icon"
            class="h-5 w-5 text-wood-500"
          />
          {{ scope.label }}
        </li>
      </ul>

      <ol
        data-delivery-timeline
        class="project-delivery__timeline mt-12"
        :style="timelineStyle"
      >
        <li
          v-for="(phase, index) in phases"
          :key="phase.key"
          class="relative border-t border-ink-300 py-5 md:border-l md:border-t-0 md:px-5"
        >
          <span class="text-xs font-black text-wood-600">{{ String(index + 1).padStart(2, '0') }}</span>
          <Icon
            :name="phase.icon"
            class="mt-3 h-6 w-6 text-ink-950"
          />
          <p class="mt-3 text-sm font-black text-ink-950">
            {{ phase.label }}
          </p>
        </li>
      </ol>

      <div
        v-if="executionProof.length"
        class="mt-14 border-t border-ink-200 pt-8"
      >
        <p class="text-xs font-black uppercase tracking-[0.16em] text-wood-600">
          {{ t({ vi: 'Bằng chứng thực hiện phù hợp phạm vi', en: 'Execution proof aligned to scope' }) }}
        </p>
        <div class="mt-6 grid gap-8 md:grid-cols-3">
          <article
            v-for="proof in executionProof"
            :key="proof.id"
            :data-execution-proof="proof.id"
            class="border-t-2 border-wood-500 pt-5"
          >
            <Icon
              :name="proof.icon"
              class="h-6 w-6 text-wood-600"
            />
            <h3 class="mt-4 text-lg font-black text-ink-950">
              {{ proof.title }}
            </h3>
            <p class="mt-3 text-sm leading-6 text-ink-600">
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

@media (min-width: 768px) {
  .project-delivery__timeline {
    grid-template-columns: repeat(var(--phase-count), minmax(0, 1fr));
  }
}
</style>
