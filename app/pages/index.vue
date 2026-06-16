<script setup lang="ts">
import type { LocalizedText } from '~/shared/types/localization'
import { company } from '~/data/company'
import { craftDetailImages, experienceScenes } from '~/data/experience'
import { projects } from '~/data/projects'

const { t } = useLanguage()

const scenes = experienceScenes

const featuredProjects = computed(() =>
  projects.filter(project => project.featured).slice(0, 3)
)

// The cinematic experience is choreographed against this root element.
const root = ref<HTMLElement | null>(null)

/**
 * Discrete story steps -> panels. Screen 2 (panel 1) carries two steps
 * (Blueprint -> Structure Reveal); the closing chapter is panel 8.
 */
const journeySteps = [
  { panel: 0 }, // Screen 1
  { panel: 1 }, // Screen 2 — Blueprint (State A)
  { panel: 1 }, // Screen 2 — Structure Reveal (State B)
  { panel: 2 }, // Screen 3
  { panel: 3 }, // Screen 4
  { panel: 4 }, // Screen 5
  { panel: 5 }, // Screen 6
  { panel: 6 }, // Screen 7 — Portfolio
  { panel: 7 }, // Screen 8 — Consultation
  { panel: 8 } // Closing chapter
]

// Rail ticks mirror the steps: primary chapters show a number, the Screen 2
// Structure Reveal shows a nested sub-dot (number: null).
type RailStepItem = {
  number: string | null
  chapter: LocalizedText
  isSub: boolean
  anchorId: string
}

const railSteps: RailStepItem[] = [
  { number: '01', chapter: scenes[0]!.chapter, isSub: false, anchorId: scenes[0]!.id },
  { number: '02', chapter: scenes[1]!.chapter, isSub: false, anchorId: scenes[1]!.id },
  { number: null, chapter: scenes[1]!.stateB!.chapter, isSub: true, anchorId: scenes[1]!.id },
  { number: '03', chapter: scenes[2]!.chapter, isSub: false, anchorId: scenes[2]!.id },
  { number: '04', chapter: scenes[3]!.chapter, isSub: false, anchorId: scenes[3]!.id },
  { number: '05', chapter: scenes[4]!.chapter, isSub: false, anchorId: scenes[4]!.id },
  { number: '06', chapter: scenes[5]!.chapter, isSub: false, anchorId: scenes[5]!.id },
  { number: '07', chapter: scenes[6]!.chapter, isSub: false, anchorId: scenes[6]!.id },
  { number: '08', chapter: scenes[7]!.chapter, isSub: false, anchorId: scenes[7]!.id },
  { number: '09', chapter: { vi: 'Hợp tác', en: 'Let\'s build' }, isSub: false, anchorId: 'closing' }
]

const { currentStep, progress, go } = useCinematicJourney(root, journeySteps)

const seoTitle = computed(() => t(company.seo.home.title))
const seoDescription = computed(() => t(company.seo.home.description))

useSeoMeta({
  title: seoTitle,
  description: seoDescription,
  ogTitle: seoTitle,
  ogDescription: seoDescription,
  ogImage: company.seo.home.ogImage
})

// Load the display serif only on this page so the rest of the site stays on Inter.
useHead({
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300&display=swap'
    }
  ]
})
</script>

<template>
  <div
    ref="root"
    class="journey"
  >
    <CinematicRail
      :steps="railSteps"
      :active-step="currentStep"
      :progress="progress"
      @select="go"
    />

    <div class="journey-viewport">
      <div
        class="journey-track"
        data-journey-track
      >
        <!-- Screen 1 — Blueprint: a darkened space with gold linework drawing on top. -->
        <CinematicStage
          data-panel
          :anchor="scenes[0]!.id"
          :index="0"
          :chapter="scenes[0]!.chapter"
          :title="scenes[0]!.title"
          :subtitle="scenes[0]!.subtitle"
          :cta="scenes[0]!.cta"
          align="left"
        >
          <template #visual>
            <img
              :src="scenes[0]!.image"
              :alt="t(scenes[0]!.title)"
              class="screen-bg"
              data-parallax
              fetchpriority="high"
            >
          </template>
          <template #overlay>
            <div class="blueprint-layer">
              <CinematicBlueprint :label="`LAI HUY · ${t({ vi: 'BẢN VẼ', en: 'BLUEPRINT' })}`" />
            </div>
          </template>
        </CinematicStage>

        <!-- Screen 2 — the centerpiece: Blueprint (A) -> Structure Reveal (B).
             Layers stack back-to-front: reality (masked) / structure / blueprint. -->
        <CinematicStage
          data-panel
          :anchor="scenes[1]!.id"
          :index="1"
          :chapter="scenes[1]!.chapter"
          :title="scenes[1]!.title"
          :subtitle="scenes[1]!.subtitle"
          :cta="scenes[1]!.cta"
          :state-b="scenes[1]!.stateB"
          align="left"
        >
          <template #visual>
            <!-- Reality: revealed bottom-up behind a clip-path mask in State B. -->
            <img
              data-screen2-render
              :src="scenes[1]!.image"
              :alt="t(scenes[1]!.title)"
              class="screen2-render"
            >
            <!-- Structural skeleton: drawn on, far -> near, during State B. -->
            <div
              data-screen2-structure
              class="screen2-structure"
            >
              <CinematicStructure :label="`LAI HUY · ${t({ vi: 'KẾT CẤU', en: 'STRUCTURE' })}`" />
            </div>
            <!-- Blueprint plan: the resting State A drawing. -->
            <div
              data-screen2-blueprint
              class="screen2-blueprint"
            >
              <CinematicBlueprint :label="`LAI HUY · ${t({ vi: 'DỰNG HÌNH', en: 'WIREFRAME' })}`" />
            </div>
          </template>
        </CinematicStage>

        <!-- Screen 3 — Photorealistic Visualization -->
        <CinematicStage
          data-panel
          :anchor="scenes[2]!.id"
          :index="2"
          :chapter="scenes[2]!.chapter"
          :title="scenes[2]!.title"
          :subtitle="scenes[2]!.subtitle"
          :cta="scenes[2]!.cta"
          :image="scenes[2]!.image"
          align="left"
        />

        <!-- Screen 4 — Completed Works -->
        <CinematicStage
          data-panel
          :anchor="scenes[3]!.id"
          :index="3"
          :chapter="scenes[3]!.chapter"
          :title="scenes[3]!.title"
          :subtitle="scenes[3]!.subtitle"
          :cta="scenes[3]!.cta"
          :image="scenes[3]!.image"
          align="center"
        />

        <!-- Screen 5 — Entering the Interior -->
        <CinematicStage
          data-panel
          :anchor="scenes[4]!.id"
          :index="4"
          :chapter="scenes[4]!.chapter"
          :title="scenes[4]!.title"
          :subtitle="scenes[4]!.subtitle"
          :cta="scenes[4]!.cta"
          :image="scenes[4]!.image"
          align="left"
        />

        <!-- Screen 6 — Interior Details: a three-frame material montage. -->
        <CinematicStage
          data-panel
          :anchor="scenes[5]!.id"
          :index="5"
          :chapter="scenes[5]!.chapter"
          :title="scenes[5]!.title"
          :subtitle="scenes[5]!.subtitle"
          :cta="scenes[5]!.cta"
          align="center"
        >
          <template #visual>
            <div class="detail-montage">
              <figure
                v-for="detail in craftDetailImages"
                :key="detail.src"
                class="detail-frame"
              >
                <img
                  :src="detail.src"
                  :alt="t(detail.label)"
                  class="detail-image"
                  data-parallax
                  loading="lazy"
                >
                <figcaption class="detail-caption">
                  {{ t(detail.label) }}
                </figcaption>
              </figure>
            </div>
          </template>
        </CinematicStage>

        <!-- Screen 7 — Portfolio Showcase: real projects, cards reveal on entry. -->
        <section
          :id="scenes[6]!.id"
          class="portfolio"
          data-panel
          data-scene
        >
          <div class="portfolio-inner">
            <header class="portfolio-head">
              <p
                class="portfolio-eyebrow"
                data-reveal
              >
                <span>07</span>
                <span class="portfolio-rule" />
                {{ t(scenes[6]!.chapter) }}
              </p>
              <h2
                class="portfolio-title font-display"
                data-reveal
              >
                {{ t(scenes[6]!.title) }}
              </h2>
              <p
                class="portfolio-subtitle"
                data-reveal
              >
                {{ t(scenes[6]!.subtitle) }}
              </p>
            </header>

            <div class="portfolio-grid">
              <NuxtLink
                v-for="project in featuredProjects"
                :key="project.slug"
                :to="`/du-an/${project.slug}`"
                class="portfolio-card"
                data-reveal
              >
                <div class="portfolio-card-media">
                  <img
                    :src="project.image[0]"
                    :alt="t(project.name)"
                    class="portfolio-card-image"
                    loading="lazy"
                  >
                  <span class="portfolio-card-tag">{{ t(project.categoryName) }}</span>
                </div>
                <div class="portfolio-card-body">
                  <h3 class="portfolio-card-title font-display">
                    {{ t(project.name) }}
                  </h3>
                  <span class="portfolio-card-link">
                    <Icon
                      name="i-lucide-arrow-right"
                      class="portfolio-card-icon"
                    />
                  </span>
                </div>
              </NuxtLink>
            </div>

            <div
              class="portfolio-cta"
              data-reveal
            >
              <NuxtLink
                :to="scenes[6]!.cta.to"
                class="stage-cta-link"
              >
                {{ t(scenes[6]!.cta.label) }}
                <Icon
                  name="i-lucide-arrow-right"
                  class="portfolio-card-icon"
                />
              </NuxtLink>
            </div>
          </div>
        </section>

        <!-- Screen 8 — Contact & Consultation -->
        <CinematicStage
          data-panel
          :anchor="scenes[7]!.id"
          :index="7"
          :chapter="scenes[7]!.chapter"
          :title="scenes[7]!.title"
          :subtitle="scenes[7]!.subtitle"
          :cta="scenes[7]!.cta"
          :image="scenes[7]!.image"
          align="center"
        />

        <!-- Closing chapter — the cinematic footer (replaces the global footer here). -->
        <CinematicFooter
          id="closing"
          data-panel
          data-scene
          number="09"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.journey {
  position: relative;
  background-color: var(--color-ink-950, #0b0a09);
}

/* --- Step-locked enhancement: viewport is fixed, the track translates. ------ */
.journey.is-enhanced .journey-viewport {
  position: fixed;
  inset: 0;
  height: 100svh;
  overflow: hidden;
  z-index: 1;
}

.journey.is-enhanced .journey-track {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  will-change: transform;
}

/* Each panel is exactly one viewport tall so panel offsets snap cleanly. */
.journey.is-enhanced [data-panel] {
  height: 100svh;
  min-height: 100svh;
  overflow: hidden;
}

.screen-bg {
  width: 100%;
  height: 100%;
  object-fit: cover;
  will-change: transform;
}

/* Screen 1 blueprint overlay — sits within the right portion on desktop. */
.blueprint-layer {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6rem 1.5rem;
  opacity: 0.85;
  pointer-events: none;
}

@media (min-width: 1024px) {
  .blueprint-layer {
    left: auto;
    right: 0;
    width: 58%;
    padding: 4rem;
  }
}

/* --- Screen 2 layered transformation -------------------------------------- */
.screen2-render,
.screen2-structure,
.screen2-blueprint {
  position: absolute;
  inset: 0;
}

.screen2-render {
  width: 100%;
  height: 100%;
  object-fit: cover;
  will-change: transform, clip-path;
}

.screen2-structure,
.screen2-blueprint {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6rem 1.5rem;
  pointer-events: none;
  will-change: opacity, transform;
}

@media (min-width: 1024px) {
  .screen2-structure,
  .screen2-blueprint {
    left: auto;
    right: 0;
    width: 58%;
    padding: 4rem;
  }
}

/*
 * Fallback (no JS / reduced motion): show the finished render with a faint
 * structure overlay; the blueprint stays hidden.
 */
.screen2-blueprint {
  opacity: 0;
}

.screen2-structure {
  opacity: 0.22;
}

/* Enhanced initial state: rest on the blueprint, hide structure + reality. */
.journey.is-enhanced .screen2-blueprint {
  opacity: 1;
}

.journey.is-enhanced .screen2-structure {
  opacity: 0;
}

.journey.is-enhanced .screen2-render {
  clip-path: inset(100% 0% 0% 0%);
}

/* Screen 6 material montage. */
.detail-montage {
  position: absolute;
  inset: 0;
  display: grid;
  grid-template-columns: 1fr;
  grid-auto-rows: 1fr;
}

@media (min-width: 768px) {
  .detail-montage {
    grid-template-columns: repeat(3, 1fr);
    grid-auto-rows: auto;
  }
}

.detail-frame {
  position: relative;
  margin: 0;
  overflow: hidden;
}

.detail-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  will-change: transform;
}

.detail-caption {
  position: absolute;
  left: 1.25rem;
  bottom: 1.25rem;
  font-size: 0.66rem;
  font-weight: 700;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: var(--color-wood-200, #ddc4aa);
}

/* Screen 7 portfolio. */
.portfolio {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  background-color: var(--color-ink-950, #0b0a09);
  color: #fff;
  padding: 7rem 1.5rem;
}

@media (min-width: 1024px) {
  .portfolio {
    padding-inline: 2rem;
  }
}

.portfolio-inner {
  width: 100%;
  max-width: 80rem;
  margin: 0 auto;
}

.portfolio-eyebrow {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: var(--color-wood-300, #c59b75);
}

.portfolio-rule {
  width: 2.5rem;
  height: 1px;
  background: currentColor;
  opacity: 0.6;
}

.portfolio-title {
  margin-top: 1.5rem;
  font-weight: 300;
  line-height: 1.04;
  letter-spacing: -0.01em;
  font-size: clamp(2.2rem, 5vw, 4rem);
  max-width: 40rem;
}

.portfolio-subtitle {
  margin-top: 1.25rem;
  max-width: 38rem;
  font-size: clamp(1rem, 1.2vw, 1.15rem);
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.7);
}

.portfolio-grid {
  margin-top: 3.5rem;
  display: grid;
  gap: 1.5rem;
  grid-template-columns: 1fr;
}

@media (min-width: 768px) {
  .portfolio-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.portfolio-card {
  display: block;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.03);
  transition: border-color 0.4s ease, transform 0.4s ease;
}

.portfolio-card:hover {
  transform: translateY(-6px);
  border-color: var(--color-wood-400, #b8875a);
}

.portfolio-card-media {
  position: relative;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  background: var(--color-ink-900, #181614);
}

.portfolio-card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.7s ease;
}

.portfolio-card:hover .portfolio-card-image {
  transform: scale(1.06);
}

.portfolio-card-tag {
  position: absolute;
  top: 1rem;
  left: 1rem;
  padding: 0.4rem 0.85rem;
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  background: var(--color-ink-950, #0b0a09);
  color: var(--color-wood-200, #ddc4aa);
}

.portfolio-card-body {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.5rem;
}

.portfolio-card-title {
  font-size: 1.5rem;
  font-weight: 400;
  line-height: 1.15;
}

.portfolio-card-link,
.stage-cta-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--color-wood-300, #c59b75);
}

.portfolio-cta {
  margin-top: 3rem;
}

.stage-cta-link {
  padding-bottom: 0.4rem;
  color: #fff;
  border-bottom: 1px solid var(--color-wood-400, #b8875a);
  transition: color 0.3s ease, gap 0.3s ease;
}

.stage-cta-link:hover {
  color: var(--color-wood-300, #c59b75);
  gap: 0.9rem;
}

.portfolio-card-icon {
  width: 0.95rem;
  height: 0.95rem;
}
</style>
