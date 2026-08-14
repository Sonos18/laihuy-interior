<script setup lang="ts">
import { homePageContent } from '~/data/home-page'
import type { Capability, MachineryProcessGroup, MachinerySectionContent } from '~/data/factory'
import type { MediaImage } from '~/shared/media/types'

defineProps<{
  capabilities: readonly Capability[]
  groups: readonly MachineryProcessGroup[]
  content: MachinerySectionContent
  image: MediaImage
}>()

const { t } = useLanguage()
const sequence = (index: number) => String(index + 1).padStart(2, '0')
</script>

<template>
  <section class="home-factory bg-ink-50 text-ink-950">
    <div class="shell">
      <div class="home-factory__intro">
        <div>
          <p
            v-reveal
            class="eyebrow reveal"
          >
            {{ t(homePageContent.factory.eyebrow) }}
          </p>
          <h2
            v-reveal="80"
            class="home-factory__title reveal mt-4"
          >
            {{ t(homePageContent.factory.title) }}
          </h2>
        </div>
        <p
          v-reveal="140"
          class="reveal max-w-2xl text-base leading-7 text-ink-600"
        >
          {{ t(homePageContent.factory.description) }}
        </p>
      </div>

      <dl class="home-factory__facts mt-12">
        <div
          v-for="(capability, index) in capabilities"
          :key="t(capability.label)"
          v-reveal="index * 70"
          class="home-factory__fact reveal"
        >
          <dt class="text-[0.67rem] font-extrabold uppercase tracking-[0.14em] text-wood-600">
            {{ t(capability.label) }}
          </dt>
          <dd class="mt-3 text-xl font-semibold tracking-[-0.035em] md:text-2xl">
            {{ t(capability.value) }}
          </dd>
        </div>
      </dl>

      <div
        data-testid="homepage-machinery"
        class="home-factory__machinery mt-16"
      >
        <div class="home-factory__machinery-heading">
          <div>
            <p class="eyebrow">
              {{ t(content.photoCaption) }}
            </p>
            <h3
              data-testid="homepage-machinery-title"
              class="home-factory__machinery-title mt-4"
            >
              {{ t(content.titleLead) }} <span class="text-wood-600">{{ t(content.titleAccent) }}</span>
            </h3>
          </div>
          <p
            data-testid="homepage-machinery-description"
            class="max-w-xl text-sm leading-6 text-ink-600"
          >
            {{ t(content.description) }}
          </p>
        </div>

        <div
          data-testid="homepage-machinery-proof"
          class="home-factory__proof mt-8"
        >
          <div
            data-testid="homepage-machinery-image"
            class="home-factory__image"
          >
            <MediaImage
              :image="image"
              sizes="sm:100vw md:100vw lg:55vw xl:55vw"
              class="absolute inset-0 h-full w-full"
              img-class="object-center transition-transform duration-[1100ms] ease-out hover:scale-[1.03]"
            />
            <div
              data-testid="homepage-machinery-caption"
              aria-hidden="true"
              class="home-factory__caption"
            >
              <span>{{ t(content.photoCaption) }}</span>
              <span>{{ t(content.lineCaption) }}</span>
            </div>
          </div>

          <div
            data-testid="homepage-machinery-groups"
            class="home-factory__groups"
          >
            <article
              v-for="(group, index) in groups"
              :key="group.id"
              data-testid="homepage-machinery-card"
              class="home-factory__group"
            >
              <span
                data-machinery-sequence
                aria-hidden="true"
                class="home-factory__sequence"
              >{{ sequence(index) }}</span>
              <h4 class="mt-3 text-base font-extrabold">
                {{ t(group.title) }}
              </h4>
              <p class="mt-2 text-sm leading-6 text-ink-600">
                {{ t(group.benefit) }}
              </p>
              <p class="mt-auto border-t border-ink-200 pt-4 text-xs font-bold leading-5 text-ink-700">
                <template
                  v-for="(machine, machineIndex) in group.machines"
                  :key="t(machine)"
                >
                  <span>{{ t(machine) }}</span><span
                    v-if="machineIndex < group.machines.length - 1"
                    aria-hidden="true"
                  > · </span>
                </template>
              </p>
            </article>
          </div>
        </div>

        <div class="mt-7 flex justify-start lg:justify-end">
          <NuxtLink
            data-testid="homepage-machinery-cta"
            to="/nha-xuong"
            class="btn-outline"
          >{{ t(homePageContent.cta.secondaryCta) }}</NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.home-factory { padding-block: var(--section-py); }
.home-factory__intro { display: grid; gap: 2rem; }
.home-factory__title { max-width: 55rem; font-size: clamp(2.4rem, 5vw, 5.5rem); font-weight: 500; line-height: 0.98; letter-spacing: -0.06em; }
.home-factory__facts { display: grid; border-top: 1px solid var(--color-ink-300); }
.home-factory__fact { border-bottom: 1px solid var(--color-ink-300); padding: 1.25rem 0; }
.home-factory__machinery { border-top: 1px solid var(--color-ink-400); padding-top: 2rem; }
.home-factory__machinery-heading { display: grid; gap: 1.5rem; }
.home-factory__machinery-title { max-width: 53rem; font-size: clamp(2rem, 4vw, 4rem); font-weight: 550; line-height: 1; letter-spacing: -0.055em; }
.home-factory__proof { display: grid; gap: 1rem; }
.home-factory__image { position: relative; aspect-ratio: 4 / 3; overflow: hidden; background: var(--color-ink-200); }
.home-factory__caption { position: absolute; inset-inline: 0; bottom: 0; display: flex; justify-content: space-between; gap: 1rem; background: rgb(11 10 9 / 0.78); padding: 0.85rem 1rem; color: white; font-size: 0.65rem; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; }
.home-factory__groups { display: grid; gap: 0.75rem; }
.home-factory__group { display: flex; min-height: 0; flex-direction: column; border-top: 1px solid var(--color-ink-300); background: white; padding: 1rem; }
.home-factory__sequence { color: var(--color-wood-600); font-size: 0.67rem; font-weight: 900; letter-spacing: 0.16em; }

@media (min-width: 768px) {
  .home-factory__facts { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .home-factory__fact { padding: 1.5rem; }
  .home-factory__fact:nth-child(odd) { padding-left: 0; }
  .home-factory__fact:nth-child(even) { border-left: 1px solid var(--color-ink-300); }
  .home-factory__image { aspect-ratio: 16 / 9; }
  .home-factory__groups { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

@media (min-width: 1024px) {
  .home-factory__intro { grid-template-columns: minmax(0, 1.15fr) minmax(20rem, 0.85fr); align-items: end; }
  .home-factory__facts { grid-template-columns: repeat(4, minmax(0, 1fr)); }
  .home-factory__fact { border-bottom: 0; padding: 1.5rem; }
  .home-factory__fact + .home-factory__fact { border-left: 1px solid var(--color-ink-300); }
  .home-factory__proof { grid-template-columns: minmax(0, 11fr) minmax(0, 9fr); align-items: stretch; }
  .home-factory__image { min-height: 0; aspect-ratio: auto; }
  .home-factory__groups { height: 100%; grid-template-rows: repeat(2, minmax(0, 1fr)); }
}
</style>
