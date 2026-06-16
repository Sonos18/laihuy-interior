<script setup lang="ts">
import { company } from '~/data/company'
import { craftDetailImages, experienceScenes } from '~/data/experience'
import { projects } from '~/data/projects'

const { t } = useLanguage()

// Single source of truth for copy/order — also feeds the chapter rail.
const scenes = experienceScenes
const railScenes = scenes.map(scene => ({ id: scene.id, chapter: scene.chapter }))

const featuredProjects = computed(() =>
  projects.filter(project => project.featured).slice(0, 3)
)

// The cinematic experience is choreographed against this root element.
const root = ref<HTMLElement | null>(null)
const { progress, activeIndex } = useCinematicScroll(root)

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
    class="cinematic"
  >
    <CinematicRail
      :scenes="railScenes"
      :active-index="activeIndex"
      :progress="progress"
    />

    <!-- Screen 1 — Blueprint: a darkened space with gold linework drawing on top. -->
    <CinematicStage
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

    <!-- Screen 2 — Design Development: pinned scrub where the wireframe becomes the render. -->
    <CinematicStage
      :anchor="scenes[1]!.id"
      :index="1"
      :chapter="scenes[1]!.chapter"
      :title="scenes[1]!.title"
      :subtitle="scenes[1]!.subtitle"
      :cta="scenes[1]!.cta"
      align="left"
      transform
    >
      <template #visual>
        <!-- Render layer is the static default (kept for reduced motion); the
             composable hides it and reveals it as the wireframe dissolves. -->
        <img
          data-transform-render
          :src="scenes[1]!.image"
          :alt="t(scenes[1]!.title)"
          class="screen-bg transform-render"
        >
        <div
          data-transform-blueprint
          class="transform-blueprint"
        >
          <CinematicBlueprint :label="`LAI HUY · ${t({ vi: 'DỰNG HÌNH', en: 'WIREFRAME' })}`" />
        </div>
      </template>
    </CinematicStage>

    <!-- Screen 3 — Photorealistic Visualization -->
    <CinematicStage
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

    <!-- Screen 7 — Portfolio Showcase: real projects, cards reveal on scroll. -->
    <section
      :id="scenes[6]!.id"
      class="portfolio"
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
      :anchor="scenes[7]!.id"
      :index="7"
      :chapter="scenes[7]!.chapter"
      :title="scenes[7]!.title"
      :subtitle="scenes[7]!.subtitle"
      :cta="scenes[7]!.cta"
      :image="scenes[7]!.image"
      align="center"
    />
  </div>
</template>

<style scoped>
.cinematic {
  background-color: var(--color-ink-950, #0b0a09);
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

/* Screen 2 transform layers stack on top of one another. */
.transform-render,
.transform-blueprint {
  position: absolute;
  inset: 0;
}

.transform-render {
  opacity: 1;
  will-change: transform, opacity;
}

.transform-blueprint {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6rem 1.5rem;
  background-color: var(--color-ink-950, #0b0a09);
  opacity: 0;
  will-change: opacity;
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
