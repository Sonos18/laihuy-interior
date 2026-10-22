<script setup lang="ts">
import type { AddressEntry } from '~/data/company'
import type { FactoryPageContent } from '~/data/factory'
import type { MediaImage } from '~/shared/media/types'
import type { LocalizedArray } from '~/shared/types/localization'

const props = defineProps<{
  content: FactoryPageContent['visit']
  image: MediaImage
  phone: string
  address: AddressEntry
  workingHours: LocalizedArray
}>()

const { t, ta } = useLanguage()
const phoneHref = computed(() => `tel:${props.phone.replaceAll(' ', '')}`)
</script>

<template>
  <!-- Closing CTA on the shared `.section-cta` band (Linen, top hairline); the footer is the
       only dark surface after it. -->
  <section
    data-testid="factory-visit-cta"
    class="section-cta"
  >
    <div class="shell grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-12">
      <MediaImage
        :image="image"
        sizes="sm:100vw lg:40vw"
        class="aspect-[16/10] rounded-[4px] bg-ink-100"
      />
      <div>
        <SectionHead
          layout="stacked"
          :reveal="false"
          lead-class="max-w-2xl"
          :eyebrow="t(content.eyebrow)"
          :title="t(content.title)"
          :lead="t(content.description)"
        />
        <p class="mt-6 text-base font-semibold leading-[1.7] text-ink-950">
          {{ t(address.address) }}
        </p>
        <p class="mt-2 text-base leading-[1.7] text-ink-600">
          {{ ta(workingHours).join(' · ') }}
        </p>
        <div
          data-testid="factory-visit-actions"
          class="mt-8 flex flex-col gap-3 sm:flex-row"
        >
          <a
            data-testid="factory-visit-phone"
            :href="phoneHref"
            class="btn-bronze"
          >
            {{ t(content.phoneCta) }}
          </a>
          <a
            data-testid="factory-visit-map"
            :href="address.mapUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="btn-outline"
          >
            {{ t(content.mapCta) }}
          </a>
        </div>
      </div>
    </div>
  </section>
</template>
