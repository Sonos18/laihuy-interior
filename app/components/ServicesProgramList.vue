<script setup lang="ts">
import type { ServicesPageContent } from '~/data/services-page'
import type { Service } from '~/data/services'
import type { MediaImage } from '~/shared/media/types'

const props = withDefaults(defineProps<{
  content: ServicesPageContent['programmes']
  services: readonly Service[]
  startAt?: number
  /** The page's one breath photograph (DESIGN.md "Breath"), closing this chapter. */
  breath?: MediaImage
}>(), {
  startAt: 4,
  breath: undefined
})

const { t, ta } = useLanguage()
const sequence = (index: number) => String(props.startAt + index).padStart(2, '0')
</script>

<template>
  <!-- With a breath photograph the chapter ends on it, so the bottom padding moves inside. -->
  <section
    data-services-chapter="programmes"
    class="section-y border-t border-[var(--rule-light)] bg-[var(--color-ivory)]"
    :class="breath ? 'pb-0' : ''"
  >
    <div
      class="shell"
      :class="breath ? 'pb-[var(--section-py)]' : ''"
    >
      <SectionHead
        layout="split"
        :eyebrow="t(content.eyebrow)"
        :title="t(content.title)"
        :lead="t(content.description)"
      />

      <ol
        role="list"
        data-testid="services-programme-list"
        class="mt-12 grid gap-4"
        :start="startAt"
      >
        <li
          v-for="(service, index) in services"
          :id="service.anchor"
          :key="service.id"
          v-reveal.item
          data-testid="services-programme"
          class="group reveal scroll-mt-[calc(var(--header-anchor)+1rem)] card-link"
        >
          <NuxtLink
            to="/lien-he"
            class="block rounded-[4px] px-6 py-8 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-wood-500 md:px-10"
          >
            <div
              data-testid="services-programme-row"
              class="grid grid-cols-1 gap-5 md:grid-cols-[5rem_minmax(0,1fr)_minmax(0,1.8fr)_auto] md:items-center md:gap-8"
            >
              <span
                data-testid="services-sequence"
                class="home-eyebrow-text text-wood-600"
                aria-hidden="true"
              >
                {{ sequence(index) }}
              </span>

              <h3 class="home-card-heading text-ink-950">
                {{ t(service.title) }}
              </h3>

              <div>
                <p
                  data-testid="services-programme-description"
                  class="text-base leading-[1.7] text-ink-600"
                >
                  {{ t(service.description) }}
                </p>
                <ul class="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm leading-[1.7] text-ink-600">
                  <li
                    v-for="detail in ta(service.details)"
                    :key="detail"
                  >
                    {{ detail }}
                  </li>
                </ul>
              </div>

              <Icon
                data-testid="services-programme-arrow"
                name="i-lucide-arrow-up-right"
                class="h-6 w-6 text-wood-600 transition-transform duration-[var(--dur-hover)] ease-[var(--ease-editorial)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-focus-within:translate-x-0.5 group-focus-within:-translate-y-0.5 motion-reduce:transform-none motion-reduce:transition-none"
                aria-hidden="true"
              />
            </div>
          </NuxtLink>
        </li>
      </ol>
    </div>

    <BreathImage
      v-if="breath"
      :image="breath"
    />
  </section>
</template>
