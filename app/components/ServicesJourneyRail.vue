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

// Copy and photograph alternate sides from 1280px; below it the stage stacks copy then image.
const stageGridClass = (index: number) => index % 2 === 1
  ? 'xl:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]'
  : 'xl:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)]'

const copyClass = (index: number) => index % 2 === 1
  ? 'xl:col-start-2 xl:row-start-1'
  : 'xl:col-start-1 xl:row-start-1'

const mediaClass = (index: number) => index % 2 === 1
  ? 'xl:col-start-1 xl:row-start-1'
  : 'xl:col-start-2 xl:row-start-1'
</script>

<template>
  <section
    id="delivery-journey"
    data-services-chapter="journey"
    class="section-y scroll-mt-[calc(var(--header-h)+1rem)] border-t border-[var(--rule-light)] bg-[var(--color-ivory)]"
  >
    <div class="sr-only">
      <h2 class="home-section-heading">
        {{ t(content.title) }}
      </h2>
      <p>{{ t(content.description) }}</p>
    </div>

    <ol
      v-trace
      role="list"
      data-testid="services-journey-layout"
      class="shell grid grid-cols-1 gap-16 md:gap-24"
    >
      <li
        v-for="(service, index) in services"
        :id="service.anchor"
        :key="service.id"
        v-reveal.item.image
        data-testid="services-core-stage"
        class="reveal grid scroll-mt-[calc(var(--header-h)+1rem)] grid-cols-1 gap-8 xl:items-center xl:gap-16"
        :class="stageGridClass(index)"
      >
        <div
          class="max-w-xl"
          :class="copyClass(index)"
        >
          <span
            data-trace-number
            data-testid="services-sequence"
            class="home-eyebrow-text block text-wood-600"
            aria-hidden="true"
          >
            {{ sequence(index) }}
          </span>
          <h3 class="home-card-heading mt-3 text-ink-950">
            {{ t(service.title) }}
          </h3>
          <p class="mt-5 text-base leading-[1.7] text-ink-600">
            {{ t(service.description) }}
          </p>
          <ul
            data-trace-rule
            class="mt-7 space-y-3 border-t border-[var(--rule-light)] pt-6 text-base leading-[1.7] text-ink-950"
          >
            <li
              v-for="detail in ta(service.details)"
              :key="detail"
              class="flex max-w-sm items-start gap-3"
            >
              <Icon
                name="i-lucide-minus"
                class="mt-[0.4rem] h-4 w-4 shrink-0 text-wood-600"
                aria-hidden="true"
              />
              <span>{{ detail }}</span>
            </li>
          </ul>
        </div>

        <MediaImage
          v-reveal.curtain
          :image="images[index]!"
          sizes="sm:100vw xl:55vw"
          class="reveal aspect-[4/3] rounded-[4px] bg-ink-100 xl:aspect-[16/10]"
          :class="mediaClass(index)"
          img-class="object-center"
        />
      </li>
    </ol>
  </section>
</template>
