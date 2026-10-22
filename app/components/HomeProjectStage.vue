<script setup lang="ts">
import { homePageContent } from '~/data/home-page'
import type { MediaAsset } from '~/shared/media/types'
import type { Project } from '~/shared/types/project'

defineProps<{
  projects: readonly { project: Project, cover: MediaAsset }[]
}>()

const { t } = useLanguage()
</script>

<template>
  <section
    data-testid="home-projects"
    class="home-projects bg-wood-50 text-ink-950"
  >
    <div class="shell">
      <!-- Section Header -->
      <!-- A split head (DESIGN.md "Section heads"): the section's one action sits on the
           heading's last line. -->
      <div
        class="home-projects__header"
        data-head="split"
      >
        <div class="max-w-2xl">
          <p
            v-reveal.head
            class="reveal home-eyebrow-text text-wood-600"
          >
            {{ t(homePageContent.projects.eyebrow) }}
          </p>
          <h2
            v-reveal.head
            class="home-projects__title home-section-heading reveal mt-3 text-ink-950"
          >
            {{ t(homePageContent.projects.title) }}
          </h2>
        </div>
        <NuxtLink
          v-reveal
          to="/du-an"
          class="btn-outline reveal group shrink-0 border-ink-300 text-ink-900 hover:border-ink-950 hover:bg-ink-950 hover:text-white"
        >
          <span>{{ t(homePageContent.projects.allCta) }}</span>
          <Icon
            name="i-lucide-arrow-right"
            class="h-4 w-4 transition-transform duration-[var(--dur-hover)] ease-[var(--ease-editorial)] group-hover:translate-x-1"
          />
        </NuxtLink>
      </div>

      <!-- Asymmetric editorial composition: one dominant case study and two satellites. -->
      <ProjectStage
        :projects="projects"
        class="mt-10 md:mt-12 lg:mt-16"
      />
    </div>
  </section>
</template>

<style scoped>
.home-projects {
  padding-block: var(--section-py);
}

.home-projects__header {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.home-projects__title {
  max-width: 61rem;
}

@media (min-width: 768px) {
  .home-projects__header {
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
  }
}
</style>
