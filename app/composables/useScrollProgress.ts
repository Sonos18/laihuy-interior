import type { Ref } from 'vue'
import { calculateScrollProgress } from '~/utils/scroll-progress'

export function useScrollProgress(target: Ref<HTMLElement | null>) {
  const progress = ref(1)
  const isEnhanced = ref(false)
  const prefersReducedMotion = ref(false)
  let frame: number | null = null
  let motionQuery: MediaQueryList | null = null
  let desktopQuery: MediaQueryList | null = null

  const update = () => {
    frame = null
    const element = target.value
    if (!element || !desktopQuery?.matches || motionQuery?.matches) {
      progress.value = 1
      isEnhanced.value = false
      return
    }

    const rect = element.getBoundingClientRect()
    const elementTop = window.scrollY + rect.top
    const range = Math.max(0, rect.height - window.innerHeight)
    progress.value = calculateScrollProgress(window.scrollY, elementTop, range)
    isEnhanced.value = true
  }

  const scheduleUpdate = () => {
    if (frame !== null) return
    frame = window.requestAnimationFrame(update)
  }

  const handleMediaChange = () => {
    prefersReducedMotion.value = motionQuery?.matches ?? false
    scheduleUpdate()
  }

  onMounted(() => {
    motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    desktopQuery = window.matchMedia('(min-width: 768px)')
    prefersReducedMotion.value = motionQuery.matches

    motionQuery.addEventListener('change', handleMediaChange)
    desktopQuery.addEventListener('change', handleMediaChange)
    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate, { passive: true })
    scheduleUpdate()
  })

  onBeforeUnmount(() => {
    motionQuery?.removeEventListener('change', handleMediaChange)
    desktopQuery?.removeEventListener('change', handleMediaChange)
    window.removeEventListener('scroll', scheduleUpdate)
    window.removeEventListener('resize', scheduleUpdate)
    if (frame !== null) window.cancelAnimationFrame(frame)
  })

  return {
    progress: readonly(progress),
    isEnhanced: readonly(isEnhanced),
    prefersReducedMotion: readonly(prefersReducedMotion)
  }
}
