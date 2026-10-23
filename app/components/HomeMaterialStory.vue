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

// `--wipe` is how much of the layer is revealed (0..1); the bronze seam reads it to sit exactly
// on the leading edge. The seam only exists while the wipe is moving: before it starts the layer
// is invisible and after it finishes the edge is the frame's own edge.
const layerStyle = (index: number) => {
  if (!isEnhanced.value) {
    return {
      'opacity': index === props.stages.length - 1 ? 1 : 0,
      'clipPath': 'inset(0 0 0 0)',
      '--wipe': 1,
      '--seam': 0
    }
  }

  if (index === 0) return { 'opacity': 1, 'clipPath': 'inset(0 0 0 0)', '--wipe': 1, '--seam': 0 }
  const starts = [0, 0.12, 0.39, 0.66]
  const ends = [0, 0.34, 0.62, 0.92]
  const amount = phaseProgress(starts[index]!, ends[index]!)
  return {
    'opacity': amount <= 0 ? 0 : 1,
    'clipPath': `inset(0 ${((1 - amount) * 100).toFixed(2)}% 0 0)`,
    '--wipe': amount.toFixed(4),
    '--seam': amount > 0 && amount < 1 ? 1 : 0
  }
}
</script>

<template>
  <section
    ref="storyRoot"
    data-testid="home-material-story"
    :data-enhanced="isEnhanced ? 'true' : 'false'"
    :style="{ '--story-progress': progress.toFixed(4) }"
    class="home-material-story bg-wood-50 text-ink-950"
  >
    <div
      data-testid="home-story-sticky"
      class="home-material-story__sticky"
    >
      <div class="shell home-material-story__shell">
        <div
          class="home-material-story__heading"
          data-head="split"
        >
          <p class="eyebrow home-eyebrow-text text-wood-600">
            {{ t(homePageContent.story.eyebrow) }}
          </p>
          <h2 class="home-material-story__title home-section-heading mt-4 text-ink-950">
            {{ t(homePageContent.story.title) }}
          </h2>
          <p class="home-material-story__intro-desc home-lead-text mt-5 max-w-2xl text-ink-600">
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
                img-class="object-center"
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
              <div class="home-material-story__seam" />
            </div>
          </div>

          <ol
            class="home-material-story__copy"
            role="list"
          >
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
                  <!-- The numeral is the workflow step, not the stage index: four stages condense
                       the six-step workflow, so a bare 01–04 would contradict "Bước 06". -->
                  <span
                    data-stage-step
                    class="home-material-story__number home-meta-text"
                  ><span class="sr-only">{{ t({ vi: 'Bước ', en: stage.step.includes('–') ? 'Steps ' : 'Step ' }) }}</span>{{ stage.step }}</span>
                  <span
                    data-stage-label
                    class="home-material-story__label home-meta-text"
                  >{{ t(stage.label) }}</span>
                </div>
                <h3 class="home-material-story__stage-title home-card-heading mt-5 text-ink-950">
                  {{ t(stage.title) }}
                </h3>
                <p class="home-material-story__stage-desc mt-4 text-base leading-[1.7] text-ink-600">
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
  border-top: 1px solid var(--color-ink-200);
  padding-top: 1rem;
}

.home-material-story__mobile-media {
  aspect-ratio: 4 / 3;
  margin-bottom: 1.25rem;
}

.home-material-story__number,
.home-material-story__label {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.home-material-story__number {
  color: var(--color-wood-600);
}

.home-material-story__label {
  color: var(--color-ink-600);
}

@media (min-width: 768px) {
  .home-material-story[data-enhanced="true"] {
    /* 180vh: the four states keep ~140px of scroll each at a 900px viewport (the copy swap and
       the wipes are timed in progress, not pixels), without the long dead stretch of 220vh. */
    height: 180vh;
    min-height: 1500px;
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
    /* A wider rail than 3fr:1fr: the copy is what the visitor reads while the wipe plays, so it
       gets a measure of about 40 characters instead of 30. */
    grid-template-columns: minmax(0, 2.5fr) minmax(20rem, 1fr);
    gap: clamp(1.5rem, 3vw, 3rem);
    margin-top: clamp(2rem, 4vh, 3.5rem);
  }

  .home-material-story__media {
    position: relative;
    display: block;
    min-height: 0;
    overflow: hidden;
    background: var(--color-ink-100);
    box-shadow: inset 0 0 0 1px var(--color-ink-200);
  }

  .home-material-story__layer {
    position: absolute;
    inset: 0;
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
    background: linear-gradient(90deg, transparent 65%, rgb(11 10 9 / 0.12));
  }

  /* The leading edge of the wipe: a 1px Workshop Bronze column at x = --wipe of the frame. A
     full-size bronze fill clipped to that one column, so it moves with clip-path alone (no
     layout, no transform, no will-change) and rides inside its layer's own clip. Absent
     (opacity 0) before the wipe starts and once it has finished. */
  .home-material-story__seam {
    position: absolute;
    inset: 0;
    background: var(--bronze);
    clip-path: inset(0 calc((1 - var(--wipe, 1)) * 100%) 0 calc(var(--wipe, 1) * 100% - 1px));
    opacity: var(--seam, 0);
    pointer-events: none;
  }

  .home-material-story__copy {
    position: relative;
    min-height: 16rem;
    border-top: 1px solid var(--color-ink-200);
  }

  .home-material-story[data-enhanced="true"] .home-material-story__copy-item {
    position: absolute;
    inset: 0;
    /* The copy sits on the bottom edge of the frame, like a caption, instead of hanging from the
       top of the rail: against a media frame this tall, a block pinned to the top left two thirds
       of the column empty and unrelated to the photograph. */
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    opacity: 0;
    transform: translateY(-0.25rem);
    /* Sequenced swap: the outgoing copy leaves first (120ms, exit curve), then the incoming
       copy enters (240ms, editorial curve, delayed by the 120ms exit), so the two are never
       visible together. */
    transition: opacity 120ms var(--ease-exit), transform 120ms var(--ease-exit);
  }

  .home-material-story[data-enhanced="true"] .home-material-story__copy-item.is-active {
    opacity: 1;
    transform: translateY(0);
    transition: opacity 240ms var(--ease-editorial) 120ms, transform 240ms var(--ease-editorial) 120ms;
  }

  /* The hairline belongs to the copy block, not to the empty column above it: a rule spanning
     the whole rail framed a lot of nothing. It travels with the block through the copy swap. */
  .home-material-story[data-enhanced="true"] .home-material-story__copy {
    border-top: 0;
  }

  .home-material-story[data-enhanced="true"] .home-material-story__copy-item {
    padding-top: 0;
  }

  .home-material-story[data-enhanced="true"] .home-material-story__copy-body {
    border-top: 1px solid var(--color-ink-200);
    padding-top: 1.25rem;
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
