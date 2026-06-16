import type { Ref } from 'vue'

type CinematicScroll = {
  /** Overall scroll progress through the experience, 0 -> 1. Drives the rail fill. */
  progress: Ref<number>
  /** Index of the scene currently centered in the viewport. Drives the active chapter. */
  activeIndex: Ref<number>
}

/**
 * Wires the cinematic homepage scroll behaviour.
 *
 * Everything heavy (GSAP, ScrollTrigger, Lenis) is imported dynamically on the
 * client only, so it never ships in the SSR bundle and never runs when the user
 * prefers reduced motion. Without JS / with reduced motion the page is fully
 * legible: content stays at its natural opacity and position.
 *
 * Animations are declared generically via data-attributes on the markup, which
 * keeps the scene components dumb and this orchestration in one place:
 *   - [data-parallax]            slow vertical drift + de-zoom while in view
 *   - [data-reveal]              fade + rise as the scene enters
 *   - [data-transform]           pinned scene that scrubs blueprint -> render
 *       [data-transform-blueprint]  layer that fades out
 *       [data-transform-render]     layer that fades in
 */
export function useCinematicScroll(root: Ref<HTMLElement | null>): CinematicScroll {
  const progress = ref(0)
  const activeIndex = ref(0)

  let cleanup: (() => void) | null = null

  onMounted(async () => {
    if (!import.meta.client || !root.value) {
      return
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Even without animation we still light up the correct chapter in the rail
    // using a lightweight IntersectionObserver, so the side navigation stays useful.
    if (prefersReducedMotion) {
      const scenes = Array.from(root.value.querySelectorAll<HTMLElement>('[data-scene]'))
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              activeIndex.value = scenes.indexOf(entry.target as HTMLElement)
            }
          }
        },
        { threshold: 0.5 }
      )
      scenes.forEach(scene => observer.observe(scene))
      cleanup = () => observer.disconnect()
      return
    }

    const [{ gsap }, { ScrollTrigger }, { default: Lenis }] = await Promise.all([
      import('gsap'),
      import('gsap/ScrollTrigger'),
      import('lenis')
    ])

    gsap.registerPlugin(ScrollTrigger)

    // --- Smooth scrolling -------------------------------------------------
    // Lenis drives the real document scroll; we feed its RAF loop from GSAP's
    // ticker and let ScrollTrigger update off Lenis' scroll events so the two
    // stay perfectly in sync (no jitter between pinned and scrubbed sections).
    const lenis = new Lenis({ duration: 1.05, smoothWheel: true })
    lenis.on('scroll', ScrollTrigger.update)
    const onTick = (time: number) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(onTick)
    gsap.ticker.lagSmoothing(0)

    // gsap.context scopes every selector/trigger to the root and gives us a
    // single revert() that cleans up all tweens + ScrollTriggers on unmount.
    const ctx = gsap.context(() => {
      const scenes = gsap.utils.toArray<HTMLElement>('[data-scene]')

      scenes.forEach((scene, index) => {
        // Slow parallax + de-zoom on the background imagery for cinematic depth.
        const bg = scene.querySelector('[data-parallax]')
        if (bg) {
          gsap.fromTo(
            bg,
            { yPercent: -6, scale: 1.14 },
            {
              yPercent: 6,
              scale: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: scene,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
              }
            }
          )
        }

        // Staggered rise of the title / subtitle / CTA when the scene arrives.
        const reveals = scene.querySelectorAll('[data-reveal]')
        if (reveals.length) {
          gsap.from(reveals, {
            y: 48,
            opacity: 0,
            duration: 1,
            ease: 'power3.out',
            stagger: 0.12,
            scrollTrigger: {
              trigger: scene,
              start: 'top 68%'
            }
          })
        }

        // Light up the matching chapter while this scene owns the viewport.
        ScrollTrigger.create({
          trigger: scene,
          start: 'top center',
          end: 'bottom center',
          onToggle: (self) => {
            if (self.isActive) {
              activeIndex.value = index
            }
          }
        })
      })

      // --- Signature moment: blueprint -> photoreal render ----------------
      // The scene pins while we scrub a cross-dissolve so the architectural
      // wireframe visibly "becomes" the finished space as the user scrolls.
      const transform = root.value?.querySelector<HTMLElement>('[data-transform]')
      if (transform) {
        const blueprint = transform.querySelector('[data-transform-blueprint]')
        const render = transform.querySelector('[data-transform-render]')
        // Override the static CSS defaults (render visible) so the animated path
        // starts on the wireframe; reduced-motion users keep the finished render.
        gsap.set(blueprint, { opacity: 1 })
        gsap.set(render, { opacity: 0, scale: 1.12 })
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: transform,
            start: 'top top',
            end: '+=110%',
            scrub: true,
            pin: true,
            anticipatePin: 1
          }
        })
        tl.to(blueprint, { opacity: 0, scale: 1.04, ease: 'none' }, 0)
          .to(render, { opacity: 1, scale: 1, ease: 'none' }, 0)
      }

      // Whole-page progress for the rail fill.
      ScrollTrigger.create({
        trigger: root.value,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
          progress.value = self.progress
        }
      })
    }, root.value)

    cleanup = () => {
      gsap.ticker.remove(onTick)
      lenis.destroy()
      ctx.revert()
    }
  })

  onBeforeUnmount(() => {
    cleanup?.()
    cleanup = null
  })

  return { progress, activeIndex }
}
