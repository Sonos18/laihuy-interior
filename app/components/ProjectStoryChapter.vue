<script setup lang="ts">
// The case study's lead chapter (DESIGN.md "Case-study story"): context, challenge and solution.
// With photographs to spare (a long set), the copy column holds still beside one photograph per
// beat, and the beat whose photograph is passing the middle of the viewport is the lit one. A
// short set has no spare photographs (each image has one home, in the gallery), so the beats run
// as three columns of text.
import type { MediaImage } from '~/shared/media/types'

const props = defineProps<{
  overview?: string
  challenge?: string
  solution?: string
  images: readonly MediaImage[]
}>()

const { t } = useLanguage()

const beats = computed(() => [
  { key: 'overview', label: t({ vi: 'Bối cảnh', en: 'Context' }), text: props.overview },
  { key: 'challenge', label: t({ vi: 'Bài toán', en: 'Challenge' }), text: props.challenge },
  { key: 'solution', label: t({ vi: 'Giải pháp', en: 'Solution' }), text: props.solution }
].filter(beat => beat.text))

const pictures = computed(() => props.images.slice(0, beats.value.length))
const withImages = computed(() => pictures.value.length > 0)

const pad = (n: number) => String(n).padStart(2, '0')

const media = ref<HTMLElement | null>(null)
const lit = ref(0)
// Until the observer runs (server render, reduced motion) every beat is fully lit.
const syncing = ref(false)

onMounted(() => {
  if (!withImages.value || !media.value) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) lit.value = Number((entry.target as HTMLElement).dataset.storyImage)
    }
  }, { rootMargin: '-45% 0px -50% 0px' })

  media.value.querySelectorAll('[data-story-image]').forEach(element => observer.observe(element))
  syncing.value = true

  onUnmounted(() => observer.disconnect())
})
</script>

<template>
  <section
    v-if="beats.length"
    id="story"
    data-project-chapter="story"
    class="section-y scroll-mt-[calc(var(--header-anchor)+var(--subnav-h)+1.5rem)] bg-wood-50"
  >
    <div class="shell">
      <!-- The case study's lead section: a rail head with the page's Statement heading. -->
      <SectionHead
        layout="rail"
        statement
        :eyebrow="t({ vi: 'Câu chuyện dự án', en: 'Project story' })"
        :title="t({ vi: 'Bối cảnh và giải pháp', en: 'Context and solution' })"
      />

      <div
        data-story-layout
        :data-story-mode="withImages ? 'paired' : 'text'"
        class="project-story mt-12 md:mt-14"
        :class="withImages ? 'project-story--paired' : 'project-story--text'"
      >
        <!-- Text mode: each beat is a row whose hairline traces in bronze as it arrives. -->
        <ol
          v-if="!withImages"
          class="project-story__copy"
        >
          <li
            v-for="(beat, index) in beats"
            :key="beat.key"
            v-reveal.item.rule
            :data-story-beat="beat.key"
            class="project-story__beat reveal"
          >
            <p class="home-eyebrow-text text-wood-600">
              {{ pad(index + 1) }} · {{ beat.label }}
            </p>
            <p
              class="mt-4"
              :class="beat.key === 'challenge' ? 'home-card-heading text-ink-950' : 'project-story__text text-ink-700'"
            >
              {{ beat.text }}
            </p>
          </li>
        </ol>

        <!-- Paired mode: the copy holds still and the lit beat follows the photographs. -->
        <ol
          v-else
          class="project-story__copy"
        >
          <li
            v-for="(beat, index) in beats"
            :key="beat.key"
            :data-story-beat="beat.key"
            class="project-story__beat"
            :class="{ 'is-dim': syncing && lit !== index, 'is-lit': syncing && lit === index }"
          >
            <p class="home-eyebrow-text text-wood-600">
              {{ pad(index + 1) }} · {{ beat.label }}
            </p>
            <p
              class="mt-4"
              :class="beat.key === 'challenge' ? 'home-card-heading text-ink-950' : 'project-story__text text-ink-700'"
            >
              {{ beat.text }}
            </p>
          </li>
        </ol>

        <div
          v-if="withImages"
          ref="media"
          class="project-story__media"
        >
          <div
            v-for="(image, index) in pictures"
            :key="image.path"
            :data-story-image="index"
            class="project-story__frame"
          >
            <MediaImage
              v-reveal.curtain
              :image="image"
              preset="gallery"
              class="reveal aspect-[5/4] w-full overflow-hidden rounded-[4px] bg-ink-100"
              img-class="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.project-story__text {
  font-size: 1.0625rem;
  line-height: 1.75;
}

/* ── Paired: copy beside one photograph per beat ── */
.project-story--paired {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 2.5rem;
}

.project-story--paired .project-story__copy {
  display: grid;
  gap: 2.5rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.project-story--paired .project-story__beat {
  border-top: 1px solid var(--rule-light);
  padding-top: 1.5rem;
  transition: opacity 400ms var(--ease-editorial);
}

/* Below 768px the photographs run as one sideways strip under the copy. */
.project-story__media {
  display: grid;
  grid-auto-columns: 82%;
  grid-auto-flow: column;
  gap: 0.75rem;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
}

.project-story__frame {
  scroll-snap-align: start;
}

@media (min-width: 768px) {
  .project-story--paired {
    grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
    gap: 3rem;
  }

  /* Only beside the photographs: below 768px they run as a strip under the copy, so every beat
     stays fully lit there. */
  .project-story--paired .project-story__beat.is-dim {
    opacity: 0.4;
  }

  .project-story--paired .project-story__copy {
    position: sticky;
    top: calc(var(--header-float-inset) + var(--header-float-h) + 0.5rem + var(--subnav-h) + 2rem);
    align-self: start;
  }

  .project-story__media {
    grid-auto-columns: auto;
    grid-auto-flow: row;
    gap: 5rem;
    overflow: visible;
  }
}

@media (min-width: 1280px) {
  .project-story--paired {
    gap: 5rem;
  }

  .project-story--paired .project-story__copy {
    top: calc(var(--header-float-inset-xl) + var(--header-float-h-xl) + 0.5rem + var(--subnav-h) + 2.5rem);
  }

  .project-story__media {
    gap: 6rem;
  }
}

/* ── Text: three columns of copy ── */
.project-story--text .project-story__copy {
  display: grid;
  gap: 2.5rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.project-story--text .project-story__beat {
  border-top: 1px solid var(--rule-light);
  padding-top: 1.5rem;
}

@media (min-width: 1024px) {
  .project-story--text .project-story__copy {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (prefers-reduced-motion: reduce) {
  .project-story--paired .project-story__beat {
    transition: none;
  }
}
</style>
