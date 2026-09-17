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
    class="section-cta bg-[var(--color-obsidian)] text-[var(--color-ivory)]"
  >
    <div class="shell">
      <ul class="grid gap-4 border-b border-[var(--hairline)] pb-12 sm:grid-cols-2 lg:grid-cols-4">
        <li
          v-for="stat in stats"
          :key="stat.id"
          class="flex items-center gap-4"
        >
          <Icon
            :name="stat.icon"
            class="h-9 w-9 shrink-0 text-[var(--bronze-light)]"
          />
          <div class="flex flex-col">
            <span class="order-2 text-xs font-bold uppercase tracking-[0.14em] text-[var(--text-subtle)]">
              {{ t(stat.label) }}
            </span>
            <span class="order-1 text-xl font-black text-[var(--color-ivory)]">
              {{ t(stat.value) }}
            </span>
          </div>
        </li>
      </ul>

      <div class="grid gap-8 pt-12 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <h2 class="max-w-3xl text-3xl font-black uppercase leading-tight text-[var(--color-ivory)] md:text-5xl">
            {{ t({ vi: 'Dự án của bạn cần một lời giải liền mạch?', en: 'Does your project need one connected response?' }) }}
          </h2>
          <p class="mt-4 max-w-2xl text-lg text-[var(--text-muted)]">
            {{ t({
              vi: 'Trao đổi với Lai Huy về bối cảnh, phạm vi và cách đưa ý tưởng thành một kế hoạch triển khai rõ ràng.',
              en: 'Talk with Lai Huy about the context, scope and a clear path from design intent to delivery.'
            }) }}
          </p>
        </div>
        <div class="flex flex-col gap-3 sm:flex-row md:flex-col">
          <NuxtLink
            to="/lien-he"
            class="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--bronze)] px-7 py-3.5 text-sm font-bold text-[var(--color-obsidian)] transition-all duration-300 hover:bg-[var(--bronze-light)]"
          >{{ t(uiText.cta.quote24h) }}</NuxtLink>
          <a
            :href="phoneHref"
            class="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--hairline-gold)] px-7 py-3.5 text-sm font-bold text-[var(--bronze-light)] transition-all duration-300 hover:border-[var(--bronze)] hover:text-[var(--color-ivory)]"
          >{{ phone }}</a>
        </div>
      </div>
    </div>
  </section>
</template>
