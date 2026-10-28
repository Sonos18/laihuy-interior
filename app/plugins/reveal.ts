// Scroll-reveal directive (v-reveal) and the hero-image pending mark.
//
// Registered universally so SSR can resolve the directive; all DOM work runs only in the
// browser (mounted never fires on the server). SSR renders content visible, then the client adds
// `reveal-ready` to <html>. Reduced motion skips everything here and the page stays fully
// visible and static.
//
// The reveal itself is a CSS keyframe (`reveal-rise` / `reveal-fade`, main.css), not a
// transition: the directive only publishes the stagger as the `--reveal-delay` custom property
// and flips `.reveal-hidden` off and `.is-visible` on. It never writes `style.transitionDelay`,
// which would outlive the reveal and lag every later hover transition on the same element.
//
// Not everything moves the same way (DESIGN.md "Motion", scroll reveal). Each element has one
// role, chosen with a modifier:
//
//   v-reveal.head    Eyebrow / headline / lead of one section. Siblings carrying this role reveal
//                    as ONE unit: the first to scroll into view takes the rest with it, in the
//                    same frame, with no delay.
//   v-reveal.item    A card, row or cell of a grid or list. Only the FIRST ROW staggers (70ms per
//                    element in reading order, capped); every later row reveals without delay.
//   v-reveal.image   Opacity only, no rise: photographs never slide. Combine with `.item` for an
//                    image-led card in a grid.
//   v-reveal.curtain A large standalone photograph: its frame opens left to right with a bronze
//                    edge riding the wipe, instead of fading. Never on a card or a thumbnail.
//   v-reveal.rule    A list row or cell whose separator is a hairline: a bronze line traces that
//                    hairline (the bottom border if the row has one, else the top) and fades
//                    back. Composes with `.item` and takes its stagger.
//   v-reveal         Any other single element: the rise, no delay. A numeric value
//                    (`v-reveal="80"`) is the authored delay of a hero sequence and is the only
//                    place a bound number is honoured.
//
// Content the server already painted inside the viewport is left alone during hydration: hiding
// it now would blink it to 0 and replay it. Everything else is hidden and revealed on scroll.

/** Longest stagger a reveal may wait; later items in a long row all share it. */
const MAX_REVEAL_DELAY_MS = 320

/** Stagger between neighbours in the first row of a grid or list. */
const ITEM_STAGGER_MS = 70

/** How long a hero photograph may stay hidden while its bytes are in flight. */
const PENDING_HERO_TIMEOUT_MS = 3000

const HEAD_ATTR = 'data-reveal-head'
const ITEM_ATTR = 'data-reveal-item'

function isInViewport(el: HTMLElement): boolean {
  const rect = el.getBoundingClientRect()

  return rect.bottom > 0
    && rect.right > 0
    && rect.top < window.innerHeight
    && rect.left < window.innerWidth
}

/** The siblings of `el` (itself included) that opted into the same grouped role through `attr`. */
function groupOf(el: HTMLElement, attr: string): HTMLElement[] {
  return Array.from(el.parentElement?.children ?? [])
    .filter((child): child is HTMLElement => child instanceof HTMLElement && child.hasAttribute(attr))
}

/**
 * The stagger an item earns: its rank in reading order if it sits in the first row of its
 * group, otherwise nothing. The first row is every sibling that starts above the bottom of the
 * topmost one; `offsetTop` is used (not a bounding rect) so a sibling that is mid-rise, and so
 * translated, cannot move a row boundary.
 */
function itemDelay(el: HTMLElement): number {
  const group = groupOf(el, ITEM_ATTR)
  const top = group.reduce((best, child) => (child.offsetTop < best.offsetTop ? child : best), el)
  const firstRow = group.filter(child => child.offsetTop < top.offsetTop + top.offsetHeight)
  const rank = firstRow.indexOf(el)

  return rank <= 0 ? 0 : Math.min(rank * ITEM_STAGGER_MS, MAX_REVEAL_DELAY_MS)
}

function setDelay(el: HTMLElement, ms: number) {
  if (ms > 0) {
    el.style.setProperty('--reveal-delay', `${ms}ms`)
  } else {
    el.style.removeProperty('--reveal-delay')
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  let observer: IntersectionObserver | null = null
  let curtainObserver: IntersectionObserver | null = null

  if (import.meta.client) {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (!reduceMotion) {
      document.documentElement.classList.add('reveal-ready')

      const show = (el: HTMLElement) => {
        el.classList.remove('reveal-hidden')
        el.classList.add('is-visible')
        observer?.unobserve(el)
      }

      observer = new IntersectionObserver(
        (entries) => {
          const arrived = entries
            .filter(entry => entry.isIntersecting)
            .map(entry => entry.target)
            .filter((target): target is HTMLElement => target instanceof HTMLElement)

          // Read everything first, write afterwards: `itemDelay` reads layout, and a class write
          // between two reads would force a style recalc per entry.
          const delays = arrived.map(el => (el.hasAttribute(ITEM_ATTR) ? itemDelay(el) : null))

          arrived.forEach((el, index) => {
            const delay = delays[index]

            if (delay !== null && delay !== undefined) {
              setDelay(el, delay)
            }

            show(el)

            // A section head is one unit: whoever arrives first brings the rest of it along.
            if (el.hasAttribute(HEAD_ATTR)) {
              for (const sibling of groupOf(el, HEAD_ATTR)) {
                if (sibling.classList.contains('reveal-hidden')) {
                  show(sibling)
                }
              }
            }
          })
        },
        { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
      )

      // A curtain waits until a third of the photograph is on screen: started at the general
      // 12% it would open mostly below the fold, where nobody sees the wipe.
      curtainObserver = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting && entry.target instanceof HTMLElement) {
              show(entry.target)
              curtainObserver?.unobserve(entry.target)
            }
          }
        },
        { threshold: 0.33 }
      )

      // A hero photograph that has no decoded data yet is held at opacity 0 (`.is-pending`) so
      // it fades in and starts its settle the moment it appears, instead of the settle running
      // unseen while the bytes are still in flight. An image that is complete, or already
      // partially decoded, is never touched: a painted LCP frame must not be hidden. A photograph
      // that neither loads nor errors within PENDING_HERO_TIMEOUT_MS is released anyway, so a
      // stalled request can never leave the hero blank.
      const markPendingHeroes = () => {
        for (const img of document.querySelectorAll<HTMLImageElement>('img.hero-image')) {
          if (img.complete || img.naturalWidth !== 0 || img.classList.contains('is-pending')) {
            continue
          }

          // One controller per image: whichever of load/error/timeout fires first releases the
          // mark, removes both listeners and clears the timer.
          const listeners = new AbortController()
          let timer = 0
          const release = () => {
            window.clearTimeout(timer)
            img.classList.remove('is-pending')
            listeners.abort()
          }

          img.classList.add('is-pending')
          timer = window.setTimeout(release, PENDING_HERO_TIMEOUT_MS)
          img.addEventListener('load', release, { signal: listeners.signal })
          img.addEventListener('error', release, { signal: listeners.signal })
        }
      }

      nuxtApp.hook('app:mounted', markPendingHeroes)
      nuxtApp.hook('page:finish', markPendingHeroes)
      // With a page transition the new page is not in the DOM at page:finish (it waits for the old
      // one to fade out), so its hero is marked once it has been inserted, a frame after the swap.
      nuxtApp.hook('page:transition:finish', () => {
        requestAnimationFrame(markPendingHeroes)
      })
    }
  }

  nuxtApp.vueApp.directive('reveal', {
    mounted(el: HTMLElement, binding) {
      if (!observer) {
        return
      }

      const { head, item, image, curtain, rule } = binding.modifiers

      // Painted by the server and in view right now: leave it visible, never observe it. An item
      // is still marked as a member of its grid, so a grid that straddles the fold is measured
      // as a whole: the rows below an already-visible row are not "the first row" and do not
      // stagger.
      if (nuxtApp.isHydrating && isInViewport(el)) {
        if (item && !head) {
          el.setAttribute(ITEM_ATTR, '')
        }
        return
      }

      // The markup normally carries `reveal` for the no-JS/SSR contract; adding it here keeps a
      // directive on a component root (which cannot always take a class) working too.
      el.classList.add('reveal', 'reveal-hidden')

      if (curtain) {
        el.classList.add('reveal-curtain')
      } else if (image) {
        el.classList.add('reveal-image')
      }

      if (rule) {
        // A style read, not a layout read: the trace follows whichever hairline the row draws.
        const side = Number.parseFloat(getComputedStyle(el).borderBottomWidth) > 0 ? 'bottom' : 'top'
        el.classList.add('reveal-rule', `reveal-rule--${side}`)
      }

      if (head) {
        el.setAttribute(HEAD_ATTR, '')
      } else if (item) {
        // The delay is worked out when the element is revealed, once layout has settled and its
        // row is known.
        el.setAttribute(ITEM_ATTR, '')
      } else if (typeof binding.value === 'number' && binding.value > 0) {
        setDelay(el, Math.min(binding.value, MAX_REVEAL_DELAY_MS))
      }

      if (curtain) {
        curtainObserver?.observe(el)
      } else {
        observer.observe(el)
      }
    },
    unmounted(el: HTMLElement) {
      observer?.unobserve(el)
      curtainObserver?.unobserve(el)
    }
  })
})
