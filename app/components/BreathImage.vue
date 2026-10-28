<script setup lang="ts">
// DESIGN.md "Breath": one full-bleed photograph per long page, a pause between two sections. It
// runs the full viewport width with no radius, no caption and no overlay, and it is decorative:
// it repeats a photograph the page (or its project) already shows, so it carries `alt=""`.
// It must be placed outside any `.shell` so it can reach both viewport edges.
import type { MediaImage } from '~/shared/media/types'

defineProps<{ image: MediaImage }>()
</script>

<template>
  <!-- A div, not a figure: a figure with no caption is announced as an empty figure. -->
  <div
    data-breath
    class="breath"
  >
    <MediaImage
      v-reveal.curtain
      :image="image"
      preset="full"
      class="breath__frame reveal bg-ink-100"
      img-class="object-center"
    />
  </div>
</template>
