// Count-up directive (v-count-up) for a figure that stands on its own (DESIGN.md "Motion", Count).
//
// The element's own text is the figure. While it counts, the real text stays in the DOM and is
// painted transparent, and the running number is drawn over it from `data-count` (a ::before in
// main.css), so the figure keeps its width and assistive technology reads the final value. The
// count is the Facts Band's: 2.4s ease-out cubic after a 120ms lead.
//
// `v-count-up="false"` opts an element out (a fact that is not a figure). Reduced motion, a value
// with no number in it (a phrase, a year) and a figure the server already painted in view at
// hydration are left alone.
import { formatCountFigure, parseCountFigure, type CountFigure } from '~/utils/count-figure'

/** How long a figure takes to count up to its value. */
const COUNT_MS = 2400

/** Lead before the count starts, so the figure's block has begun to rise when the digits move. */
const COUNT_DELAY_MS = 120

type CountState = { figure: CountFigure, frame: number }

function isInViewport(el: HTMLElement): boolean {
  const rect = el.getBoundingClientRect()

  return rect.bottom > 0 && rect.top < window.innerHeight
}

export default defineNuxtPlugin((nuxtApp) => {
  const states = new WeakMap<HTMLElement, CountState>()
  let observer: IntersectionObserver | null = null

  const stop = (el: HTMLElement) => {
    const state = states.get(el)

    if (state) {
      cancelAnimationFrame(state.frame)
      states.delete(el)
    }

    observer?.unobserve(el)
    el.classList.remove('is-counting')
    el.removeAttribute('data-count')
  }

  const run = (el: HTMLElement, state: CountState) => {
    const start = performance.now() + COUNT_DELAY_MS

    const tick = (now: number) => {
      const t = Math.min(1, Math.max(0, (now - start) / COUNT_MS))
      // Ease-out cubic: brisk through the small numbers, settling slowly onto the real one.
      el.dataset.count = formatCountFigure(state.figure, 1 - (1 - t) ** 3)

      if (t < 1) {
        state.frame = requestAnimationFrame(tick)
      } else {
        stop(el)
      }
    }

    state.frame = requestAnimationFrame(tick)
  }

  if (import.meta.client && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const el = entry.target

          if (!entry.isIntersecting || !(el instanceof HTMLElement)) {
            continue
          }

          observer?.unobserve(el)
          const state = states.get(el)

          if (state) {
            run(el, state)
          }
        }
      },
      { threshold: 0.5 }
    )
  }

  nuxtApp.vueApp.directive('count-up', {
    mounted(el: HTMLElement, binding) {
      if (!observer || binding.value === false) {
        return
      }

      if (nuxtApp.isHydrating && isInViewport(el)) {
        return
      }

      const figure = parseCountFigure((el.textContent ?? '').trim())

      if (!figure) {
        return
      }

      states.set(el, { figure, frame: 0 })
      el.classList.add('count-up', 'is-counting')
      el.dataset.count = formatCountFigure(figure, 0)
      observer.observe(el)
    },
    // A locale switch (or any new value) mid-count must not leave the old digits on screen.
    updated(el: HTMLElement) {
      const state = states.get(el)

      if (state && (el.textContent ?? '').trim() !== state.figure.text) {
        stop(el)
      }
    },
    unmounted(el: HTMLElement) {
      stop(el)
    }
  })
})
