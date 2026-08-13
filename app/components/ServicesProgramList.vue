<script setup lang="ts">
import type { ServicesPageContent } from '~/data/services-page'
import type { Service } from '~/data/services'

const props = withDefaults(defineProps<{
  content: ServicesPageContent['programmes']
  services: readonly Service[]
  startAt?: number
}>(), {
  startAt: 4
})

const { t, ta } = useLanguage()
const sequence = (index: number) => String(props.startAt + index).padStart(2, '0')
</script>

<template>
  <section
    data-services-chapter="programmes"
    class="section-y bg-ink-50"
  >
    <div class="shell">
      <p
        v-reveal
        class="eyebrow reveal"
      >
        {{ t(content.eyebrow) }}
      </p>
      <h2
        v-reveal="80"
        class="text-section-title reveal mt-4 max-w-4xl font-black uppercase text-ink-950"
      >
        {{ t(content.title) }}
      </h2>
      <p
        v-reveal="140"
        class="measure-lead reveal mt-5 text-ink-600"
      >
        {{ t(content.description) }}
      </p>

      <ol
        data-testid="services-programme-list"
        class="mt-12 grid gap-4"
        :start="startAt"
      >
        <li
          v-for="(service, index) in services"
          :id="service.id"
          :key="service.id"
          v-reveal="index * 70"
          data-testid="services-programme"
          class="group reveal scroll-mt-[calc(var(--header-h)+1rem)] bg-white transition-colors duration-500 hover:bg-wood-600 hover:text-white focus-within:bg-wood-600 focus-within:text-white"
        >
          <NuxtLink
            to="/lien-he"
            class="block px-6 py-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white md:px-10"
          >
            <div
              data-testid="services-programme-row"
              class="grid grid-cols-1 gap-5 md:grid-cols-[5rem_minmax(0,1fr)_minmax(0,1.8fr)_auto] md:items-center md:gap-8"
            >
              <span
                data-testid="services-sequence"
                class="text-2xl font-black text-ink-200 transition-colors group-hover:text-white/35 group-focus-within:text-white/35"
              >
                {{ sequence(index) }}
              </span>

              <h3 class="text-xl font-black uppercase leading-tight text-ink-950 transition-colors group-hover:text-white group-focus-within:text-white">
                {{ t(service.title) }}
              </h3>

              <div>
                <p
                  data-testid="services-programme-description"
                  class="text-sm leading-6 text-ink-600 transition-colors group-hover:text-white/80 group-focus-within:text-white/80"
                >
                  {{ t(service.description) }}
                </p>
                <ul class="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs leading-5 text-ink-500 transition-colors group-hover:text-white/70 group-focus-within:text-white/70">
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
                class="h-6 w-6 text-wood-600 transition-colors group-hover:text-white group-focus-within:text-white"
                aria-hidden="true"
              />
            </div>
          </NuxtLink>
        </li>
      </ol>
    </div>
  </section>
</template>
