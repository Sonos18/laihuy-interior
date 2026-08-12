<script setup lang="ts">
import type { FactoryStat } from '~/data/factory'

defineProps<{ stats: readonly FactoryStat[] }>()

const { t } = useLanguage()
</script>

<template>
  <div class="border-b border-ink-200 bg-white">
    <div class="shell">
      <dl
        data-testid="about-proof-grid"
        class="grid grid-cols-1 md:grid-cols-3"
      >
        <div
          v-for="(stat, index) in stats"
          :key="stat.id"
          v-reveal="index * 70"
          data-testid="about-proof-stat"
          :data-stat-id="stat.id"
          class="reveal border-b border-ink-200 py-6 md:border-b-0 md:border-r md:px-6 md:first:pl-0 md:last:border-r-0 md:last:pr-0"
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
