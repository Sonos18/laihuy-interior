<script setup lang="ts">
import type { FactoryStat } from '~/data/factory'

defineProps<{ stats: readonly FactoryStat[] }>()

const { t } = useLanguage()
</script>

<template>
  <div
    id="factory-capability"
    data-testid="factory-stats"
    class="scroll-mt-[calc(var(--header-h)+1rem)] border-b border-ink-200 bg-white"
  >
    <div class="shell">
      <dl class="grid grid-cols-2 lg:grid-cols-4">
        <div
          v-for="(stat, index) in stats"
          :key="stat.id"
          v-reveal="index * 70"
          data-testid="factory-stat"
          class="reveal border-b border-ink-200 px-4 py-6 odd:border-r lg:border-b-0 lg:border-r lg:last:border-r-0"
        >
          <Icon
            :name="stat.icon"
            class="h-5 w-5 text-wood-600"
            aria-hidden="true"
          />
          <dt class="mt-4 text-xs font-bold uppercase tracking-[0.14em] text-ink-600">
            {{ t(stat.label) }}
          </dt>
          <dd class="mt-2 text-2xl font-black text-ink-950 md:text-3xl">
            {{ t(stat.value) }}
          </dd>
        </div>
      </dl>
    </div>
  </div>
</template>
