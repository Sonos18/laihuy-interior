<script setup lang="ts">
defineOptions({
  name: 'AppReveal'
})

type Props = {
  as?: string
  delay?: number
  duration?: number
  distance?: number | string
}

const props = withDefaults(defineProps<Props>(), {
  as: 'div',
  delay: 0,
  duration: 700,
  distance: 32
})

const root = ref<HTMLElement | null>(null)
const isVisible = ref(false)

let observer: IntersectionObserver | null = null

const distanceValue = computed(() =>
  typeof props.distance === 'number' ? `${props.distance}px` : props.distance
)

const revealStyle = computed(() => ({
  '--reveal-delay': `${props.delay}ms`,
  '--reveal-duration': `${props.duration}ms`,
  '--reveal-distance': distanceValue.value
}))

onMounted(() => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (prefersReducedMotion) {
    isVisible.value = true
    return
  }

  observer = new IntersectionObserver(
    ([entry]) => {
      if (entry?.isIntersecting) {
        isVisible.value = true
        observer?.disconnect()
      }
    },
    { threshold: 0.12, rootMargin: '0px 0px -48px 0px' }
  )

  if (root.value) {
    observer.observe(root.value)
  }
})

onBeforeUnmount(() => {
  observer?.disconnect()
})
</script>

<template>
  <component
    :is="as"
    ref="root"
    class="transition-all ease-out"
    :class="isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'"
    :style="{
      ...revealStyle,
      transitionDelay: 'var(--reveal-delay)',
      transitionDuration: 'var(--reveal-duration)',
      transform: isVisible ? 'translateY(0)' : `translateY(var(--reveal-distance))`
    }"
  >
    <slot />
  </component>
</template>
