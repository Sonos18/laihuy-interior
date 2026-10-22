<script setup lang="ts">
import type { FactoryStat } from '~/data/factory'

defineProps<{ stats: readonly FactoryStat[] }>()

const { t } = useLanguage()
</script>

<template>
  <div
    id="factory-capability"
    data-testid="factory-stats"
    class="scroll-mt-[calc(var(--header-h)+1rem)] border-b border-[var(--rule-light)] bg-wood-50"
  >
    <div class="shell">
      <dl class="grid grid-cols-2 lg:grid-cols-4">
        <div
          v-for="(stat, index) in stats"
          :key="stat.id"
          v-reveal="index * 70"
          data-testid="factory-stat"
          class="reveal border-b border-[var(--rule-light)] px-4 py-6 odd:border-r lg:border-b-0 lg:border-r lg:last:border-r-0"
        >
          <Icon
            :name="stat.icon"
            class="h-5 w-5 text-wood-600"
            aria-hidden="true"
          />
          <dt class="home-eyebrow-text mt-4 text-ink-600">
            {{ t(stat.label) }}
          </dt>
          <dd class="home-stat-value mt-2 font-display font-medium tracking-tight text-ink-950">
            {{ t(stat.value) }}
          </dd>
        </div>
      </dl>
    </div>
  </div>
</template>
