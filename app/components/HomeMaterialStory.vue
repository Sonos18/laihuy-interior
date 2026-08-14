<script setup lang="ts">
import { homePageContent, type HomeStoryStage, type HomeStoryStageId } from '~/data/home-page'
import type { MediaImage } from '~/shared/media/types'

const props = defineProps<{
  stages: readonly HomeStoryStage[]
  images: Record<HomeStoryStageId, MediaImage>
}>()

const { t } = useLanguage()
const storyRoot = ref<HTMLElement | null>(null)
const { progress, isEnhanced } = useScrollProgress(storyRoot)

const activeIndex = computed(() => {
  if (progress.value < 0.2) return 0
  if (progress.value < 0.47) return 1
  if (progress.value < 0.74) return 2
  return 3
})

const phaseProgress = (start: number, end: number) =>
  Math.min(1, Math.max(0, (progress.value - start) / (end - start)))

const layerStyle = (index: number) => {
  if (!isEnhanced.value) {
    return { opacity: index === props.stages.length - 1 ? 1 : 0, clipPath: 'inset(0 0 0 0)' }
  }

  if (index === 0) return { opacity: 1, clipPath: 'inset(0 0 0 0)' }
  const starts = [0, 0.12, 0.39, 0.66]
  const ends = [0, 0.34, 0.62, 0.92]
  const amount = phaseProgress(starts[index]!, ends[index]!)
  return {
    opacity: amount <= 0 ? 0 : 1,
    clipPath: `inset(0 ${((1 - amount) * 100).toFixed(2)}% 0 0)`
  }
}
</script>

<template>
  <section
    ref="storyRoot"
    data-testid="home-material-story"
    :data-enhanced="isEnhanced ? 'true' : 'false'"
    :style="{ '--story-progress': progress.toFixed(4) }"
    class="home-material-story bg-ink-950 text-white"
  >
    <div
      data-testid="home-story-sticky"
      class="home-material-story__sticky"
    >
      <div class="shell home-material-story__shell">
        <div class="home-material-story__heading">
          <p class="eyebrow text-wood-300">
            {{ t(homePageContent.story.eyebrow) }}
          </p>
          <h2 class="home-material-story__title mt-4">
            {{ t(homePageContent.story.title) }}
          </h2>
          <p class="mt-5 max-w-2xl text-sm leading-6 text-white/62 md:text-base md:leading-7">
            {{ t(homePageContent.story.description) }}
          </p>
        </div>

        <div class="home-material-story__stage">
          <div
            class="home-material-story__media"
            aria-hidden="true"
          >
            <div
              v-for="(stage, index) in stages"
              :key="stage.id"
              class="home-material-story__layer"
              :class="`home-material-story__layer--${stage.id}`"
              :style="layerStyle(index)"
            >
              <MediaImage
                :image="images[stage.id]"
                sizes="sm:100vw md:70vw xl:72vw"
                class="absolute inset-0 h-full w-full"
                :img-class="stage.id === 'material' ? 'scale-[1.34] object-center' : 'object-center'"
              />
              <div
                v-if="stage.id === 'drawing'"
                class="home-material-story__drawing-grid"
              >
                <span
                  v-for="line in 8"
                  :key="line"
                />
              </div>
              <div class="home-material-story__media-shade" />
            </div>

            <div
              class="home-material-story__measure"
              aria-hidden="true"
            >
              <span>00</span>
              <span>{{ String(Math.round(progress * 100)).padStart(2, '0') }}</span>
              <span>100</span>
            </div>
          </div>

          <ol class="home-material-story__copy">
            <li
              v-for="(stage, index) in stages"
              :key="stage.id"
              data-testid="home-story-stage"
              data-mobile-frame
              :data-stage-id="stage.id"
              :class="{ 'is-active': activeIndex === index }"
              class="home-material-story__copy-item"
            >
              <MediaImage
                :image="images[stage.id]"
                sizes="100vw"
                class="home-material-story__mobile-media"
                :img-class="stage.id === 'drawing' ? 'grayscale contrast-125' : ''"
              />
              <div class="home-material-story__copy-body">
                <div class="flex items-center gap-4">
                  <span
                    class="home-material-story__number"
                    aria-hidden="true"
                  >{{ String(index + 1).padStart(2, '0') }}</span>
                  <span
                    data-stage-label
                    class="home-material-story__label"
                  >{{ t(stage.label) }}</span>
                </div>
                <h3 class="mt-5 text-2xl font-semibold tracking-[-0.035em] text-white md:text-3xl">
                  {{ t(stage.title) }}
                </h3>
                <p class="mt-4 text-sm leading-6 text-white/64">
                  {{ t(stage.description) }}
                </p>
              </div>
            </li>
          </ol>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.home-material-story {
  position: relative;
}

.home-material-story__sticky {
  position: relative;
}

.home-material-story__shell {
  padding-block: 5rem;
}

.home-material-story__title {
  max-width: 64rem;
  font-size: clamp(2.35rem, 5vw, 5.8rem);
  font-weight: 500;
  line-height: 0.98;
  letter-spacing: -0.06em;
  text-wrap: balance;
}

.home-material-story__stage {
  margin-top: 3rem;
}

.home-material-story__media {
  display: none;
}

.home-material-story__copy {
  display: grid;
  gap: 3rem;
}

.home-material-story__copy-item {
  border-top: 1px solid rgb(255 255 255 / 0.16);
  padding-top: 1rem;
}

.home-material-story__mobile-media {
  aspect-ratio: 4 / 3;
  margin-bottom: 1.25rem;
}

.home-material-story__number,
.home-material-story__label {
  font-size: 0.69rem;
  font-weight: 800;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.home-material-story__number {
  color: var(--color-wood-300);
}

.home-material-story__label {
  color: rgb(255 255 255 / 0.7);
}

@media (min-width: 768px) {
  .home-material-story[data-enhanced="true"] {
    height: 220vh;
    min-height: 1800px;
  }

  .home-material-story[data-enhanced="true"] .home-material-story__sticky {
    position: sticky;
    top: 0;
    height: 100vh;
    height: 100svh;
    overflow: hidden;
  }

  .home-material-story__shell {
    display: grid;
    height: 100%;
    min-height: 48rem;
    grid-template-rows: auto minmax(0, 1fr);
    padding-block: clamp(4.5rem, 8vh, 7rem) 2rem;
  }

  .home-material-story__heading {
    display: grid;
    grid-template-columns: minmax(0, 1.2fr) minmax(18rem, 0.8fr);
    column-gap: 3rem;
    align-items: end;
  }

  .home-material-story__heading > p:first-child {
    grid-column: 1 / -1;
  }

  .home-material-story__heading > p:last-child {
    align-self: end;
  }

  .home-material-story__stage {
    display: grid;
    min-height: 0;
    grid-template-columns: minmax(0, 3fr) minmax(17rem, 1fr);
    gap: clamp(1.5rem, 3vw, 3rem);
    margin-top: clamp(2rem, 4vh, 3.5rem);
  }

  .home-material-story__media {
    position: relative;
    display: block;
    min-height: 0;
    overflow: hidden;
    background: var(--color-ink-900);
  }

  .home-material-story__layer {
    position: absolute;
    inset: 0;
    will-change: clip-path, opacity;
  }

  .home-material-story__layer--drawing :deep(img) {
    filter: grayscale(1) contrast(1.35) brightness(1.12);
    opacity: 0.58;
  }

  .home-material-story__drawing-grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgb(197 155 117 / 0.22) 1px, transparent 1px),
      linear-gradient(90deg, rgb(197 155 117 / 0.22) 1px, transparent 1px);
    background-size: 4rem 4rem;
  }

  .home-material-story__drawing-grid span {
    position: absolute;
    left: calc(7% + var(--line, 0) * 9%);
    top: 8%;
    width: 1px;
    height: 84%;
    background: rgb(221 196 170 / 0.26);
    transform: rotate(18deg);
  }

  .home-material-story__drawing-grid span:nth-child(1) { left: 10%; }
  .home-material-story__drawing-grid span:nth-child(2) { left: 21%; }
  .home-material-story__drawing-grid span:nth-child(3) { left: 34%; }
  .home-material-story__drawing-grid span:nth-child(4) { left: 47%; }
  .home-material-story__drawing-grid span:nth-child(5) { left: 61%; }
  .home-material-story__drawing-grid span:nth-child(6) { left: 72%; }
  .home-material-story__drawing-grid span:nth-child(7) { left: 83%; }
  .home-material-story__drawing-grid span:nth-child(8) { left: 92%; }

  .home-material-story__media-shade {
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent 58%, rgb(11 10 9 / 0.38));
  }

  .home-material-story__measure {
    position: absolute;
    z-index: 10;
    inset-inline: 1rem;
    bottom: 0.8rem;
    display: flex;
    justify-content: space-between;
    color: rgb(255 255 255 / 0.58);
    font-size: 0.64rem;
    font-weight: 800;
    letter-spacing: 0.18em;
  }

  .home-material-story__copy {
    position: relative;
    min-height: 16rem;
    border-top: 1px solid rgb(255 255 255 / 0.18);
  }

  .home-material-story[data-enhanced="true"] .home-material-story__copy-item {
    position: absolute;
    inset: 0;
    opacity: 0;
    transform: translateY(1rem);
    transition: opacity 220ms ease, transform 360ms cubic-bezier(0.2, 0.8, 0.2, 1);
  }

  .home-material-story[data-enhanced="true"] .home-material-story__copy-item.is-active {
    opacity: 1;
    transform: translateY(0);
  }

  .home-material-story__copy-item {
    border-top: 0;
    padding-top: 1.25rem;
  }

  .home-material-story__mobile-media {
    display: none;
  }

  .home-material-story[data-enhanced="false"] .home-material-story__stage {
    grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
  }

  .home-material-story[data-enhanced="false"] .home-material-story__copy {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1.5rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .home-material-story,
  .home-material-story__sticky {
    height: auto !important;
    min-height: 0 !important;
    position: relative !important;
    overflow: visible !important;
  }

  .home-material-story__copy-item {
    transition: none !important;
  }
}

@media (min-width: 768px) and (prefers-reduced-motion: reduce) {
  .home-material-story__stage {
    display: block;
  }

  .home-material-story__media {
    display: none;
  }

  .home-material-story__mobile-media {
    display: block;
  }
}
</style>
