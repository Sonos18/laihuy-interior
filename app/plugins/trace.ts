// Step-trace directive (v-trace) for a sequence of numbered steps (DESIGN.md "Motion", Trace).
//
// Put it on the list; every element child is a step. The page's scroll draws a 2px bronze line
// along each step's hairline in reading order: the sequence starts when its top passes 85% of the
// viewport and is fully traced when its bottom reaches 60%, and step i owns the i-th slice of
// that run. It is a function of scroll position, not of time, so it neither loops nor replays,
// and scrolling back undraws it.
//
// The directive only publishes each step's progress as `--trace` (0 to 1) and marks a finished
// step `data-traced`; the line itself is a ::after in main.css. The line rides the step's bottom
// hairline when it has one, otherwise its top one. A step whose separator is an inner rule marks
// that rule `data-trace-rule`, and the line rides it instead. The step number, marked
// `data-trace-number`, warms when its step is traced.
//
// Scroll is read only while the list is on screen, once per frame. Reduced motion leaves the
// list untouched.

const START = 0.85
const END = 0.6

type TraceState = { steps: HTMLElement[] }

function clamp(n: number): number {
  return Math.min(1, Math.max(0, n))
}

function hostOf(step: HTMLElement): HTMLElement {
  return step.querySelector<HTMLElement>('[data-trace-rule]') ?? step
}

export default defineNuxtPlugin((nuxtApp) => {
  const states = new WeakMap<HTMLElement, TraceState>()
  const active = new Set<HTMLElement>()
  let observer: IntersectionObserver | null = null
  let frame = 0

  const paint = (list: HTMLElement, state: TraceState) => {
    const rect = list.getBoundingClientRect()
    const vh = window.innerHeight
    const progress = clamp((vh * START - rect.top) / (rect.height + vh * (START - END)))
    const n = state.steps.length

    state.steps.forEach((step, index) => {
      const f = clamp(progress * n - index)
      step.style.setProperty('--trace', f.toFixed(4))
      step.toggleAttribute('data-traced', f >= 1)
    })
  }

  const schedule = () => {
    if (frame) {
      return
    }

    frame = requestAnimationFrame(() => {
      frame = 0

      for (const list of active) {
        const state = states.get(list)

        if (state) {
          paint(list, state)
        }
      }
    })
  }

  const listen = (on: boolean) => {
    if (on) {
      window.addEventListener('scroll', schedule, { passive: true })
      window.addEventListener('resize', schedule, { passive: true })
    } else {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }

  if (import.meta.client && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    observer = new IntersectionObserver((entries) => {
      const wasIdle = active.size === 0

      for (const entry of entries) {
        if (!(entry.target instanceof HTMLElement)) {
          continue
        }

        if (entry.isIntersecting) {
          active.add(entry.target)
        } else {
          active.delete(entry.target)
          // Leaving the viewport between two frames must not strand a half-drawn line.
          const state = states.get(entry.target)

          if (state) {
            paint(entry.target, state)
          }
        }
      }

      if (wasIdle && active.size > 0) {
        listen(true)
      } else if (!wasIdle && active.size === 0) {
        listen(false)
      }

      schedule()
    })
  }

  const setup = (list: HTMLElement) => {
    const steps = Array.from(list.children).filter((child): child is HTMLElement => child instanceof HTMLElement)

    for (const step of steps) {
      const host = hostOf(step)
      // A style read, not a layout read: the line follows whichever hairline the step draws.
      const side = Number.parseFloat(getComputedStyle(host).borderBottomWidth) > 0 ? 'bottom' : 'top'
      step.classList.add('trace-step')
      host.classList.add('trace-host', `trace-host--${side}`)
    }

    const state = { steps }
    states.set(list, state)
    paint(list, state)
  }

  nuxtApp.vueApp.directive('trace', {
    mounted(list: HTMLElement) {
      if (!observer) {
        return
      }

      setup(list)
      observer.observe(list)
    },
    // A locale switch can re-render the steps; pick the new ones up.
    updated(list: HTMLElement) {
      if (!observer || !states.has(list)) {
        return
      }

      setup(list)
    },
    unmounted(list: HTMLElement) {
      observer?.unobserve(list)
      active.delete(list)
      states.delete(list)

      if (active.size === 0) {
        listen(false)
      }
    }
  })
})
