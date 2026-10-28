<script setup lang="ts">
// DESIGN.md "Monument": one figure per page, set as the statement that opens a chapter. The figure
// already exists in the data; this only gives it the type that makes it a statement. Its Label
// sits directly above it (Walnut Grey), as in the Facts Band, and nothing decorates it: the
// whitespace around it is the frame.
//
// The default slot holds what supports the figure (a sentence, a companion fact). From 1024px it
// sits in a narrower right column on the figure's baseline; below that it follows the figure.
defineProps<{
  label: string
  value: string
}>()
</script>

<template>
  <div
    v-reveal
    data-monument
    class="monument reveal"
    :class="{ 'monument--with-aside': $slots.default }"
  >
    <dl class="monument__figure">
      <dt class="home-eyebrow-text text-ink-600">
        {{ label }}
      </dt>
      <dd
        v-count-up
        class="monument-value mt-4 text-ink-950"
      >
        {{ value }}
      </dd>
    </dl>
    <div
      v-if="$slots.default"
      class="monument__aside"
    >
      <slot />
    </div>
  </div>
</template>

<style scoped>
.monument {
  display: grid;
  gap: 2rem;
}

@media (min-width: 1024px) {
  .monument--with-aside {
    grid-template-columns: minmax(0, 1.6fr) minmax(18rem, 1fr);
    column-gap: 4rem;
    align-items: end;
  }
}
</style>
