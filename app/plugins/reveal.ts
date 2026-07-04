// Lightweight scroll-reveal directive (v-reveal).
// Registered universally so SSR can resolve the directive; all DOM work runs
// only in the browser (mounted never fires on the server). SSR renders content
// visible, then the client adds `reveal-ready` to <html> so the hidden state
// only applies when JS + motion are available. Respects prefers-reduced-motion
// and degrades gracefully without JS.
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
              entry.target.classList.add('is-visible')
              observer?.unobserve(entry.target)
            }
          }
        },
        { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
      )
    }
  }

  nuxtApp.vueApp.directive('reveal', {
    mounted(el: HTMLElement, binding) {
      if (!observer) {
        return
      }

      const delay = typeof binding.value === 'number' ? binding.value : 0

      if (delay > 0) {
        el.style.transitionDelay = `${delay}ms`
      }

      observer.observe(el)
    },
    unmounted(el: HTMLElement) {
      observer?.unobserve(el)
    }
  })
})
