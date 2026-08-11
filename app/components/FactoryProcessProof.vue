<script setup lang="ts">
import type {
  FactoryPageContent,
  MachineryProcessGroup
} from '~/data/factory'
import type { MediaImage } from '~/shared/media/types'

defineProps<{
  content: FactoryPageContent['process']
  groups: readonly MachineryProcessGroup[]
  image: MediaImage
}>()

const { t } = useLanguage()
const sequence = (index: number) => String(index + 1).padStart(2, '0')
</script>

<template>
  <section
    data-testid="factory-process"
    class="section-y bg-ink-950 text-white"
  >
    <div class="shell">
      <p
        v-reveal
        class="eyebrow reveal text-wood-200"
      >
        {{ t(content.eyebrow) }}
      </p>
      <h2
        v-reveal="80"
        class="text-section-title reveal mt-4 max-w-4xl font-black uppercase"
      >
        {{ t(content.title) }}
      </h2>
      <p
        v-reveal="140"
        class="measure-lead reveal mt-5 text-white/70"
      >
        {{ t(content.description) }}
      </p>

      <div
        data-testid="factory-process-layout"
        class="mt-10 grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch"
      >
        <MediaImage
          :image="image"
          sizes="sm:100vw lg:52vw"
          class="group min-h-64 rounded-2xl"
          img-class="object-center transition-transform duration-[1200ms] group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
        <div
          data-testid="factory-process-groups"
          class="grid gap-3 md:grid-cols-2"
        >
          <article
            v-for="(group, index) in groups"
            :key="group.id"
            v-reveal="index * 70"
            data-testid="factory-process-group"
            class="reveal flex flex-col border-t-2 border-wood-500 bg-white/[0.05] p-5"
          >
            <span class="text-xs font-black tracking-[0.16em] text-wood-300">
              {{ sequence(index) }}
            </span>
            <h3 class="mt-3 text-lg font-black">
              {{ t(group.title) }}
            </h3>
            <p class="mt-3 text-sm leading-6 text-white/70">
              {{ t(group.benefit) }}
            </p>
            <p class="mt-auto pt-5 text-xs font-bold leading-5 text-white/85">
              {{ group.machines.map(machine => t(machine)).join(' · ') }}
            </p>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>
