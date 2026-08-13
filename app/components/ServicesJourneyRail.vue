<script setup lang="ts">
import type { ServicesPageContent } from '~/data/services-page'
import type { Service } from '~/data/services'
import type { MediaImage } from '~/shared/media/types'

const { content, services, images } = defineProps<{
  content: ServicesPageContent['journey']
  services: readonly Service[]
  images: readonly [MediaImage, MediaImage, MediaImage]
}>()

if (services.length !== images.length) {
  throw new Error('ServicesJourneyRail requires one image for every core service stage.')
}

const { t, ta } = useLanguage()
const sequence = (index: number) => String(index + 1).padStart(2, '0')

const stageGridClass = (index: number) => index % 2 === 1
  ? 'xl:grid-cols-[minmax(0,3fr)_minmax(15rem,1.5fr)_minmax(11rem,0.8fr)]'
  : 'xl:grid-cols-[minmax(11rem,0.8fr)_minmax(15rem,1.5fr)_minmax(0,3fr)]'

const numberClass = (index: number) => index % 2 === 1
  ? 'xl:col-start-3 xl:row-start-1 xl:text-right'
  : 'xl:col-start-1 xl:row-start-1'

const copyClass = (index: number) => index % 2 === 1
  ? 'xl:col-start-2 xl:row-start-1 xl:text-right'
  : 'xl:col-start-2 xl:row-start-1'

const mediaClass = (index: number) => index % 2 === 1
  ? 'xl:col-start-1 xl:row-start-1 xl:aspect-[16/10]'
  : 'xl:col-start-3 xl:row-start-1 xl:aspect-[4/5]'
</script>

<template>
  <section
    id="delivery-journey"
    data-services-chapter="journey"
    class="scroll-mt-[calc(var(--header-h)+1rem)] bg-white py-20 md:py-28"
  >
    <div class="sr-only">
      <h2>{{ t(content.title) }}</h2>
      <p>{{ t(content.description) }}</p>
    </div>

    <ol
      data-testid="services-journey-layout"
      class="shell grid grid-cols-1 gap-24 md:gap-32"
    >
      <li
        v-for="(service, index) in services"
        :id="service.id"
        :key="service.id"
        v-reveal="index * 80"
        data-testid="services-core-stage"
        class="reveal grid scroll-mt-[calc(var(--header-h)+1rem)] grid-cols-1 gap-8 xl:items-center xl:gap-12"
        :class="stageGridClass(index)"
      >
        <span
          data-testid="services-sequence"
          class="text-[clamp(6rem,10vw,9rem)] font-black leading-[0.78] tracking-[-0.06em] text-ink-200"
          :class="numberClass(index)"
        >
          {{ sequence(index) }}
        </span>

        <div
          class="max-w-md"
          :class="[copyClass(index), index % 2 === 1 ? 'xl:ml-auto' : '']"
        >
          <h3 class="text-3xl font-black uppercase leading-tight text-ink-950">
            {{ t(service.title) }}
          </h3>
          <p class="mt-6 text-base leading-7 text-ink-600">
            {{ t(service.description) }}
          </p>
          <ul
            class="mt-8 space-y-3 text-xs font-bold uppercase tracking-[0.14em] text-wood-600"
            :class="index % 2 === 1 ? 'xl:flex xl:flex-col xl:items-end' : ''"
          >
            <li
              v-for="detail in ta(service.details)"
              :key="detail"
              class="flex max-w-sm items-start gap-3 leading-5"
              :class="index % 2 === 1 ? 'xl:flex-row-reverse' : ''"
            >
              <Icon
                name="i-lucide-minus"
                class="mt-0.5 h-4 w-4 shrink-0"
                aria-hidden="true"
              />
              <span>{{ detail }}</span>
            </li>
          </ul>
        </div>

        <MediaImage
          :image="images[index]!"
          sizes="sm:100vw xl:55vw"
          class="aspect-[4/3] bg-ink-50"
          :class="mediaClass(index)"
          img-class="object-center"
        />
      </li>
    </ol>
  </section>
</template>
