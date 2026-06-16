import type { Ref } from 'vue'

/**
 * Minimal description of a journey step. `panel` is the index of the
 * `[data-panel]` element this step belongs to. Consecutive steps that share a
 * panel are sub-steps of the same screen (only Screen 2 does this today).
 */
export type JourneyStepDef = {
  panel: number
}

type CinematicJourney = {
  /** Index of the active story step (0 -> totalSteps - 1). Drives the rail. */
  currentStep: Ref<number>
  /** Total number of discrete story steps. */
  totalSteps: number
  /** 0 -> 1 across the whole journey; drives the rail fill. */
  progress: Ref<number>
  /** Jump to an arbitrary step (rail clicks). Clamped + ignored mid-transition. */
  go: (step: number) => void
  /** Advance exactly one step. */
  next: () => void
  /** Retreat exactly one step. */
  prev: () => void
}

const WHEEL_THRESHOLD = 8 // ignore micro wheel/trackpad jitter
const TOUCH_THRESHOLD = 44 // px swipe distance to register a step
const QUIET_MS = 140 // input must rest this long before re-arming (kills momentum skips)
const TRANSLATE_DURATION = 0.9 // panel-to-panel travel
const COOLDOWN_MS = 60 // small breath after a transition

/**
 * Drives the chapter-based cinematic journey: every wheel / trackpad / swipe /
 * key gesture advances exactly one story step, sections snap, and there is no
 * free scrolling. Screen 2 carries two steps (Blueprint -> Structure Reveal)
 * that play an in-place transformation timeline instead of translating panels.
 *
 * Everything heavy (GSAP) loads on the client only. Without JS or with reduced
 * motion the page degrades to plain stacked full-height sections with native
 * scrolling, and the rail tracks the active panel via IntersectionObserver.
 */
export function useCinematicJourney(
  root: Ref<HTMLElement | null>,
  steps: JourneyStepDef[]
): CinematicJourney {
  const totalSteps = steps.length
  const currentStep = ref(0)
  const progress = ref(0)

  const panelOf = (step: number) => steps[step]?.panel ?? 0
  const lastStep = totalSteps - 1

  // Locate the screen that owns two consecutive steps (Screen 2's second step).
  let structureStep = -1
  for (let i = 1; i < steps.length; i++) {
    if (steps[i]!.panel === steps[i - 1]!.panel) {
      structureStep = i
      break
    }
  }
  // Screen 2's render is "done" (structure -> reality complete) from the
  // structure step onward, so jumps land on the correct end state.
  const screen2Done = (step: number) => (structureStep >= 0 && step >= structureStep ? 1 : 0)

  // Late-bound so go/next/prev are stable references the page can pass to the rail.
  let goImpl: (step: number) => void = () => {}
  const go = (step: number) => goImpl(step)
  const next = () => goImpl(currentStep.value + 1)
  const prev = () => goImpl(currentStep.value - 1)

  let cleanup: (() => void) | null = null

  onMounted(async () => {
    if (!import.meta.client || !root.value) {
      return
    }

    const el = root.value
    const panels = Array.from(el.querySelectorAll<HTMLElement>('[data-panel]'))
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // --- Fallback: plain stacked scroll, rail tracks the active panel ---------
    if (prefersReducedMotion) {
      const panelFirstStep = panels.map((_, panelIndex) =>
        steps.findIndex(s => s.panel === panelIndex)
      )
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              const panelIndex = panels.indexOf(entry.target as HTMLElement)
              const step = panelFirstStep[panelIndex]
              if (step !== undefined && step >= 0) {
                currentStep.value = step
                progress.value = lastStep > 0 ? step / lastStep : 0
              }
            }
          }
        },
        { threshold: 0.5 }
      )
      panels.forEach(panel => observer.observe(panel))
      goImpl = (step) => {
        const target = Math.min(Math.max(step, 0), lastStep)
        panels[panelOf(target)]?.scrollIntoView({ behavior: 'smooth' })
      }
      cleanup = () => observer.disconnect()
      return
    }

    // --- Enhanced: step-locked, panel-translating journey ---------------------
    const { gsap } = await import('gsap')

    const track = el.querySelector<HTMLElement>('[data-journey-track]')
    if (!track) {
      return
    }

    el.classList.add('is-enhanced')
    const previousHtmlOverflow = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'

    // Real cumulative offset of each panel within the track — robust to varying
    // panel heights and to mobile viewport-unit quirks (svh vs innerHeight).
    const panelOffset = (panelIndex: number) => panels[panelIndex]?.offsetTop ?? 0

    const setTrack = (panelIndex: number, animate: boolean, onDone?: () => void) => {
      const y = -panelOffset(panelIndex)
      if (animate) {
        gsap.to(track, {
          y,
          duration: TRANSLATE_DURATION,
          ease: 'power3.inOut',
          onComplete: onDone
        })
      } else {
        gsap.set(track, { y })
        onDone?.()
      }
    }

    // Entrance choreography for a panel becoming active: layered rise + de-zoom
    // (more than a flat opacity fade).
    const revealPanel = (panelIndex: number) => {
      const panel = panels[panelIndex]
      if (!panel) {
        return
      }
      const reveals = panel.querySelectorAll('[data-reveal]')
      if (reveals.length) {
        gsap.fromTo(
          reveals,
          { y: 44, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, stagger: 0.1, ease: 'power3.out', overwrite: true }
        )
      }
      const bg = panel.querySelector('[data-parallax]')
      if (bg) {
        gsap.fromTo(bg, { scale: 1.12 }, { scale: 1, duration: 1.4, ease: 'power2.out', overwrite: true })
      }
    }

    // --- Screen 2 transformation timeline (idea -> blueprint -> structure -> reality) ---
    const screen2Panel = panels[panelOf(structureStep)] ?? null
    let screen2Tl: ReturnType<typeof gsap.timeline> | null = null

    if (screen2Panel && structureStep >= 0) {
      const blueprint = screen2Panel.querySelector('[data-screen2-blueprint]')
      const structureWrap = screen2Panel.querySelector('[data-screen2-structure]')
      const render = screen2Panel.querySelector('[data-screen2-render]')
      const stateA = screen2Panel.querySelector('[data-state-a]')
      const stateB = screen2Panel.querySelector('[data-state-b]')
      const farLines = gsap.utils.toArray<SVGElement>(
        screen2Panel.querySelectorAll('[data-depth="far"] [data-structure-line]')
      )
      const midLines = gsap.utils.toArray<SVGElement>(
        screen2Panel.querySelectorAll('[data-depth="mid"] [data-structure-line]')
      )
      const nearLines = gsap.utils.toArray<SVGElement>(
        screen2Panel.querySelectorAll('[data-depth="near"] [data-structure-line]')
      )
      const allLines = [...farLines, ...midLines, ...nearLines]
      const farLayer = screen2Panel.querySelector('[data-depth="far"]')
      const nearLayer = screen2Panel.querySelector('[data-depth="near"]')

      // Override the no-JS CSS defaults so the animated path starts on the blueprint.
      gsap.set(allLines, { strokeDasharray: 1, strokeDashoffset: 1 })
      gsap.set(structureWrap, { opacity: 0 })
      gsap.set(render, { clipPath: 'inset(100% 0% 0% 0%)', scale: 1.1, opacity: 1 })
      gsap.set(stateB, { opacity: 0, yPercent: 8 })

      screen2Tl = gsap.timeline({ paused: true })
      // 1. Blueprint recedes into depth as the structure begins to draw on.
      screen2Tl
        .to(blueprint, { opacity: 0.12, scale: 1.08, yPercent: -4, duration: 0.5, ease: 'power2.inOut' }, 0)
        .set(structureWrap, { opacity: 1 }, 0)
        .fromTo(farLayer, { yPercent: 7 }, { yPercent: 0, duration: 0.9, ease: 'power2.out' }, 0.05)
        .fromTo(nearLayer, { yPercent: -9 }, { yPercent: 0, duration: 0.9, ease: 'power2.out' }, 0.05)
        // 2. Skeleton emerges far -> near (massing builds up).
        .to(farLines, { strokeDashoffset: 0, duration: 0.5, stagger: 0.04, ease: 'power1.out' }, 0.05)
        .to(midLines, { strokeDashoffset: 0, duration: 0.5, stagger: 0.04, ease: 'power1.out' }, 0.25)
        .to(nearLines, { strokeDashoffset: 0, duration: 0.5, stagger: 0.05, ease: 'power1.out' }, 0.45)
        // Copy crossfades from "planning" to "building".
        .to(stateA, { opacity: 0, yPercent: -6, duration: 0.4, ease: 'power2.in' }, 0.15)
        .to(stateB, { opacity: 1, yPercent: 0, duration: 0.5, ease: 'power3.out' }, 0.4)
        // 3. Reality wipes up behind a clip-path mask; structure fades to a faint trace.
        .to(render, { clipPath: 'inset(0% 0% 0% 0%)', scale: 1, duration: 0.75, ease: 'power2.inOut' }, 0.55)
        .to(structureWrap, { opacity: 0.16, duration: 0.5, ease: 'power1.out' }, 0.72)
    }

    // --- Input gating: one gesture = one step, no momentum skipping -----------
    let isAnimating = false
    let lastInputTs = 0
    let releaseTimer: ReturnType<typeof setTimeout> | null = null

    const armRelease = () => {
      if (releaseTimer) {
        clearTimeout(releaseTimer)
      }
      const check = () => {
        if (Date.now() - lastInputTs >= QUIET_MS) {
          isAnimating = false
          releaseTimer = null
        } else {
          releaseTimer = setTimeout(check, QUIET_MS)
        }
      }
      releaseTimer = setTimeout(check, Math.max(QUIET_MS, COOLDOWN_MS))
    }

    goImpl = (step: number) => {
      const target = Math.min(Math.max(step, 0), lastStep)
      if (isAnimating || target === currentStep.value) {
        return
      }

      const from = currentStep.value
      const fromPanel = panelOf(from)
      const toPanel = panelOf(target)
      isAnimating = true
      currentStep.value = target
      progress.value = lastStep > 0 ? target / lastStep : 0

      // In-place Screen 2 transformation (Blueprint <-> Structure Reveal).
      if (fromPanel === toPanel && screen2Tl) {
        const forward = target > from
        screen2Tl.eventCallback('onComplete', armRelease)
        screen2Tl.eventCallback('onReverseComplete', armRelease)
        if (forward) {
          screen2Tl.play()
        } else {
          screen2Tl.reverse()
        }
        return
      }

      // Panel travel: make sure Screen 2 sits in its correct end state instantly.
      if (screen2Tl) {
        screen2Tl.pause()
        screen2Tl.progress(screen2Done(target))
      }

      if (fromPanel === toPanel) {
        armRelease()
        return
      }

      setTrack(toPanel, true, () => {
        revealPanel(toPanel)
        armRelease()
      })
    }

    // Wheel + trackpad.
    const onWheel = (event: WheelEvent) => {
      event.preventDefault()
      lastInputTs = Date.now()
      if (isAnimating || Math.abs(event.deltaY) < WHEEL_THRESHOLD) {
        return
      }
      if (event.deltaY > 0) {
        next()
      } else {
        prev()
      }
    }

    // Touch swipe (mobile).
    let touchStartY = 0
    const onTouchStart = (event: TouchEvent) => {
      touchStartY = event.touches[0]?.clientY ?? 0
    }
    const onTouchMove = (event: TouchEvent) => {
      event.preventDefault()
    }
    const onTouchEnd = (event: TouchEvent) => {
      lastInputTs = Date.now()
      if (isAnimating) {
        return
      }
      const endY = event.changedTouches[0]?.clientY ?? touchStartY
      const delta = touchStartY - endY
      if (Math.abs(delta) < TOUCH_THRESHOLD) {
        return
      }
      if (delta > 0) {
        next()
      } else {
        prev()
      }
    }

    // Keyboard.
    const onKeydown = (event: KeyboardEvent) => {
      const downKeys = ['ArrowDown', 'PageDown', ' ', 'Spacebar']
      const upKeys = ['ArrowUp', 'PageUp']
      if (downKeys.includes(event.key)) {
        event.preventDefault()
        lastInputTs = Date.now()
        next()
      } else if (upKeys.includes(event.key)) {
        event.preventDefault()
        lastInputTs = Date.now()
        prev()
      } else if (event.key === 'Home') {
        event.preventDefault()
        lastInputTs = Date.now()
        go(0)
      } else if (event.key === 'End') {
        event.preventDefault()
        lastInputTs = Date.now()
        go(lastStep)
      }
    }

    const onResize = () => {
      gsap.set(track, { y: -panelOffset(panelOf(currentStep.value)) })
    }

    el.addEventListener('wheel', onWheel, { passive: false })
    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchmove', onTouchMove, { passive: false })
    el.addEventListener('touchend', onTouchEnd, { passive: true })
    window.addEventListener('keydown', onKeydown)
    window.addEventListener('resize', onResize)

    // Land on the first chapter.
    setTrack(0, false)
    revealPanel(0)

    cleanup = () => {
      if (releaseTimer) {
        clearTimeout(releaseTimer)
      }
      el.removeEventListener('wheel', onWheel)
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchmove', onTouchMove)
      el.removeEventListener('touchend', onTouchEnd)
      window.removeEventListener('keydown', onKeydown)
      window.removeEventListener('resize', onResize)
      screen2Tl?.kill()
      gsap.killTweensOf(track)
      el.classList.remove('is-enhanced')
      document.documentElement.style.overflow = previousHtmlOverflow
    }
  })

  onBeforeUnmount(() => {
    cleanup?.()
    cleanup = null
  })

  return { currentStep, totalSteps, progress, go, next, prev }
}
