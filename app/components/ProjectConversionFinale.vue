<script setup lang="ts">
import { uiText } from '~/data/ui'
import type { FactoryStat } from '~/data/factory'

const props = defineProps<{
  stats: readonly FactoryStat[]
  phone: string
}>()

const { t } = useLanguage()
const phoneHref = computed(() => `tel:${props.phone.replaceAll(' ', '')}`)
</script>

<template>
  <section
    data-project-chapter="finale"
    class="section-cta bg-[var(--color-ivory)] text-ink-950"
  >
    <div class="shell">
      <ul class="grid gap-4 border-b border-[var(--rule-light)] pb-12 sm:grid-cols-2 lg:grid-cols-4">
        <li
          v-for="stat in stats"
          :key="stat.id"
          class="flex items-center gap-4"
        >
          <Icon
            :name="stat.icon"
            class="h-9 w-9 shrink-0 text-wood-600"
          />
          <div class="flex flex-col">
            <span class="home-eyebrow-text order-2 text-ink-600">
              {{ t(stat.label) }}
            </span>
            <span class="home-card-heading order-1 text-ink-950">
              {{ t(stat.value) }}
            </span>
          </div>
        </li>
      </ul>

      <div class="grid gap-8 pt-12 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <h2 class="home-section-heading max-w-3xl text-ink-950">
            {{ t({ vi: 'Dự án của bạn cần một lời giải liền mạch?', en: 'Does your project need one connected response?' }) }}
          </h2>
          <p class="home-lead-text mt-4 max-w-2xl text-ink-600">
            {{ t({
              vi: 'Trao đổi với Lai Huy về bối cảnh, phạm vi và cách đưa ý tưởng thành một kế hoạch triển khai rõ ràng.',
              en: 'Talk with Lai Huy about the context, scope and a clear path from design intent to delivery.'
            }) }}
          </p>
        </div>
        <div class="flex flex-col gap-3 sm:flex-row md:flex-col">
          <NuxtLink
            to="/lien-he"
            class="btn-bronze"
          >{{ t(uiText.cta.quote24h) }}</NuxtLink>
          <a
            :href="phoneHref"
            class="btn-outline"
          >{{ phone }}</a>
        </div>
      </div>
    </div>
  </section>
</template>
