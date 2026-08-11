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
  <section
    data-testid="factory-visit-cta"
    class="bg-wood-700 text-white"
  >
    <div class="shell grid gap-8 py-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:py-16">
      <MediaImage
        :image="image"
        sizes="sm:100vw lg:40vw"
        class="aspect-[16/10] rounded-2xl"
      />
      <div>
        <p class="eyebrow text-wood-100">
          {{ t(content.eyebrow) }}
        </p>
        <h2 class="mt-4 text-3xl font-black uppercase md:text-5xl">
          {{ t(content.title) }}
        </h2>
        <p class="mt-5 max-w-2xl leading-7 text-white/80">
          {{ t(content.description) }}
        </p>
        <p class="mt-6 font-bold">
          {{ t(address.address) }}
        </p>
        <p class="mt-2 text-sm text-white/75">
          {{ ta(workingHours).join(' · ') }}
        </p>
        <div
          data-testid="factory-visit-actions"
          class="mt-8 flex flex-col gap-3 sm:flex-row"
        >
          <a
            data-testid="factory-visit-phone"
            :href="phoneHref"
            class="btn-primary"
          >
            {{ t(content.phoneCta) }}
          </a>
          <a
            data-testid="factory-visit-map"
            :href="address.mapUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="btn-secondary"
          >
            {{ t(content.mapCta) }}
          </a>
        </div>
      </div>
    </div>
  </section>
</template>
