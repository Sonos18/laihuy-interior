<script setup lang="ts">
import { uiText } from '~/data/ui'
import type { Fact } from '~/utils/facts'

const props = defineProps<{
  facts: readonly Fact[]
  phone: string
}>()

const { t } = useLanguage()
const phoneHref = computed(() => `tel:${props.phone.replaceAll(' ', '')}`)
</script>

<template>
  <!-- The finale opens on the site's one Facts Band (Linen, hairline under it), so the band is
       also the seam to the Raw Silk closing CTA; the section's top padding moves below it. -->
  <section
    data-project-chapter="finale"
    class="section-cta bg-[var(--color-ivory)] pt-0 text-ink-950"
  >
    <FactsBand
      :facts="facts"
      testid="project-facts-band"
      cell-testid="project-fact"
    />

    <div class="shell pt-[var(--section-py)]">
      <div class="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
        <div data-head="stacked">
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
          >{{ t(uiText.labels.callNow) }}</a>
        </div>
      </div>
    </div>
  </section>
</template>
