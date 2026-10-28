<script setup lang="ts">
// A hero headline set word by word (DESIGN.md "Motion", Hero headline): each word rises from
// behind its own mask, staggered by its place in reading order. `start` continues the count
// when one headline is split across two calls (AppHero's title + specialTitle).
const props = withDefaults(defineProps<{
  text: string
  start?: number
}>(), { start: 0 })

const words = computed(() => props.text.trim().split(/\s+/).filter(Boolean))
</script>

<template>
  <template
    v-for="(word, index) in words"
    :key="`${index}-${word}`"
  >
    <span class="hero-word"><span
      class="hero-word__inner"
      :style="{ '--word': start + index }"
    >{{ word }}</span></span>{{ index < words.length - 1 ? ' ' : '' }}
  </template>
</template>
