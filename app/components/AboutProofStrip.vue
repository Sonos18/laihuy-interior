<script setup lang="ts">
import type { FactoryStat } from '~/data/factory'

defineProps<{ stats: readonly FactoryStat[] }>()

const { t } = useLanguage()
</script>

<template>
  <div class="border-b border-[var(--rule-light)] bg-wood-50">
    <div class="shell">
      <dl
        data-testid="about-proof-grid"
        class="grid grid-cols-1 md:grid-cols-3"
      >
        <div
          v-for="stat in stats"
          :key="stat.id"
          v-reveal.item
          data-testid="about-proof-stat"
          :data-stat-id="stat.id"
          class="reveal border-b border-[var(--rule-light)] py-6 md:border-b-0 md:border-r md:px-6 md:first:pl-0 md:last:border-r-0 md:last:pr-0"
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
