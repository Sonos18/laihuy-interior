// Scroll-reveal directive (v-reveal) and the hero-image pending mark.
//
// Registered universally so SSR can resolve the directive; all DOM work runs only in the
// browser (mounted never fires on the server). SSR renders content visible, then the client adds
// `reveal-ready` to <html>. Reduced motion skips everything here and the page stays fully
// visible and static.
//
// The reveal itself is a CSS keyframe (`reveal-rise`, main.css), not a transition: the directive
// only publishes the stagger as the `--reveal-delay` custom property and flips `.reveal-hidden`
// off and `.is-visible` on. It never writes `style.transitionDelay`, which would outlive the
// reveal and lag every later hover transition on the same element.
//
// Content the server already painted inside the viewport is left alone during hydration: hiding
// it now would blink it to 0 and replay it. Everything else is hidden and revealed on scroll.

/** Longest stagger a reveal may wait; later items in a long list all share it. */
const MAX_REVEAL_DELAY_MS = 320

function isInViewport(el: HTMLElement): boolean {
  const rect = el.getBoundingClientRect()

  return rect.bottom > 0
    && rect.right > 0
    && rect.top < window.innerHeight
    && rect.left < window.innerWidth
}

export default defineNuxtPlugin((nuxtApp) => {
  let observer: IntersectionObserver | null = null

  if (import.meta.client) {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (!reduceMotion) {
      document.documentElement.classList.add('reveal-ready')

      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              entry.target.classList.remove('reveal-hidden')
              entry.target.classList.add('is-visible')
              observer?.unobserve(entry.target)
            }
          }
        },
        { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
      )

      // A hero photograph that has no decoded data yet is held at opacity 0 (`.is-pending`) so
      // it fades in and starts its settle the moment it appears, instead of the settle running
      // unseen while the bytes are still in flight. An image that is complete, or already
      // partially decoded, is never touched: a painted LCP frame must not be hidden.
      const markPendingHeroes = () => {
        for (const img of document.querySelectorAll<HTMLImageElement>('img.hero-image')) {
          if (img.complete || img.naturalWidth !== 0 || img.classList.contains('is-pending')) {
            continue
          }

          // One controller per image: whichever of load/error fires first removes both listeners.
          const listeners = new AbortController()
          const release = () => {
            img.classList.remove('is-pending')
            listeners.abort()
          }

          img.classList.add('is-pending')
          img.addEventListener('load', release, { signal: listeners.signal })
          img.addEventListener('error', release, { signal: listeners.signal })
        }
      }

      nuxtApp.hook('app:mounted', markPendingHeroes)
      nuxtApp.hook('page:finish', markPendingHeroes)
    }
  }

  nuxtApp.vueApp.directive('reveal', {
    mounted(el: HTMLElement, binding) {
      if (!observer) {
        return
      }

      // Painted by the server and in view right now: leave it visible, never observe it.
      if (nuxtApp.isHydrating && isInViewport(el)) {
        return
      }

      el.classList.add('reveal-hidden')

      const delay = typeof binding.value === 'number' ? binding.value : 0

      if (delay > 0) {
        el.style.setProperty('--reveal-delay', `${Math.min(delay, MAX_REVEAL_DELAY_MS)}ms`)
      }

      observer.observe(el)
    },
    unmounted(el: HTMLElement) {
      observer?.unobserve(el)
    }
  })
})
