<script setup lang="ts">
// One filter chip (DESIGN.md "Chips"): a pill, Action type, Plaster border and Walnut Grey text
// at rest, Mid Timber border and Deep Timber text on hover, Charcoal Ink fill with Linen text
// when pressed. 44px minimum hit target. Click handlers fall through to the button.
defineProps<{
  pressed: boolean
}>()
</script>

<template>
  <button
    type="button"
    class="inline-flex min-h-11 shrink-0 items-center gap-2 whitespace-nowrap rounded-full border px-5 py-3 text-sm font-semibold tracking-[0.01em] transition-[border-color,color,background-color] duration-[var(--dur-hover)] ease-[var(--ease-editorial)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wood-500 motion-reduce:transition-none"
    :class="pressed
      ? 'border-ink-900 bg-ink-900 text-wood-50'
      : 'border-ink-200 bg-transparent text-ink-600 hover:border-wood-500 hover:text-wood-600'"
    :aria-pressed="pressed"
  >
    <slot />
  </button>
</template>
