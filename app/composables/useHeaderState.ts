/**
 * The header state machine — docs/header-footer-art-direction.md §5, §6, §7, ADR-003.
 *
 * SOLE WRITER of `--header-p` and `--header-shift` (§22.3, §27). Any other component writing
 * chrome state is a §2 dependency violation.
 *
 * ADR-003 chose a scroll-linked custom property over a binary class toggle (what existed
 * before: `scrollY > 40`), because a threshold COMMITS on a single pixel and then plays a fixed
 * animation — that is the abruptness the redesign exists to remove, and the direct cause of the
 * route-change "melt" (§7.1). Scroll position IS the timeline, so `p` is direct manipulation
 * rather than playback, and the router can snap it (§7).
 *
 * Hot-path rules (§23.1, A.2, A.3):
 *   · ONE scroll listener, `{ passive: true }`, rAF-coalesced — never one handler per event.
 *   · The handler reads `scrollY` ONLY. `getBoundingClientRect` / `offsetTop` / `getComputedStyle`
 *     are banned — a forced synchronous layout here costs a frame.
 *   · Vars are written with `setProperty` OUTSIDE Vue reactivity: zero re-renders while scrolling.
 *     The one reactive value (`actionsFocusable`) flips at most twice per scroll session, because
 *     `inert` is a DOM attribute and I8 is a correctness requirement, not a paint.
 */
import type { Ref } from 'vue'
import { isNavigationFailure, NavigationFailureType } from 'vue-router'

type Zone = 'cover' | 'content' | 'footer'

/** §5.2 — `P_END = min(0.5 × innerHeight, 400px)`. Proven never to strand a dark scrim over
 *  white content down to a 600px viewport (§5.2 table); do not change without re-running it. */
const P_END_CAP = 400

/** §6.3 / §25.2 — asymmetric BY DESIGN. Reveal is eager, hide is deliberate: the cost of a
 *  wrongly-hidden header is much higher than a wrongly-shown one (§6.1). */
const HIDE_DELTA = 64
const REVEAL_DELTA = 4

/** §29 `--header-action-in` — the point at which CTA/phone become legitimate targets (I8).
 *  §29 `--header-blur-in` — glass is 5% opaque here, so the blur's arrival is imperceptible.
 *  Mirrored as constants because the hot path may not call getComputedStyle to read a token. */
const ACTION_IN = 0.5
const BLUR_IN = 0.05

/** Past this scroll offset the glass detaches into a floating bar inset from the viewport edges
 *  (owner, 2026-10-27). A pixel offset, not a `p`, so a pinned (`solid`) route still starts
 *  full-bleed at the top of the page and floats once it scrolls, like every other route. */
const FLOAT_AT_PX = 16

interface HeaderState {
  /** AppHeader hands over its root element; the composable touches no DOM outside it (§2). */
  register: (el: HTMLElement) => void
  /** I4 — while the drawer is open the machine freezes. */
  setDrawerOpen: (open: boolean) => void
  /** I9 escape hatch — `<AppHeader solid />` pins chrome to NAVIGATION. */
  setSolid: (solid: boolean) => void
  /**
   * The discrete half of the chrome, for the things CSS cannot express from a continuous `p`:
   * `inert` (I8) and the lang toggle's binary `surface` prop (§26.5). Flips at most twice per
   * scroll session — the continuous half never re-renders anything (§23.1).
   */
  chromeState: Readonly<Ref<'cover' | 'nav'>>
  /** §5.1 — the drawer is one of the four state dimensions, so the machine owns it. */
  drawerOpen: Readonly<Ref<boolean>>
}

let singleton: HeaderState | null = null

function create(): HeaderState {
  // Reactive ONLY where the DOM needs an attribute (I8). Everything else is plain state:
  // making `p` reactive would re-render the header on every frame of every scroll.
  const chromeState = shallowRef<'cover' | 'nav'>('cover')
  const drawerOpenRef = shallowRef(false)

  let el: HTMLElement | null = null
  let pEnd = P_END_CAP
  let p = 0
  let revealed = true
  let hidden = false
  let zone: Zone = 'cover'
  let solid = false
  let drawerOpen = false
  let lastY = 0
  let accum = 0
  let ticking = false
  let frame = 0
  let observer: IntersectionObserver | null = null
  let footerVisible = false

  const clamp = (value: number, min: number, max: number) =>
    value < min ? min : value > max ? max : value

  // Queried once, not per frame: mayHide() runs inside the rAF callback.
  let reduceMotionQuery: MediaQueryList | null = null
  let finePointerQuery: MediaQueryList | null = null

  let blurOn = false
  let floating = false

  // A discrete toggle like blur: the bar's geometry changes once, on a CSS transition, rather
  // than per frame — interpolating its inset from `p` would re-lay out the glass every frame.
  const writeFloat = (y: number) => {
    const next = y > FLOAT_AT_PX
    if (next === floating || !el) return
    floating = next
    el.dataset.float = next ? 'on' : 'off'
  }

  const writeP = (next: number) => {
    if (next === p || !el) return
    p = next
    el.style.setProperty('--header-p', String(p))

    // Discrete toggles, written straight to the element the composable owns — a dataset write
    // only when the threshold is actually crossed, never per frame. Blur is toggled, NEVER
    // interpolated: animating the radius forces a full-surface re-filter every frame (§8.2).
    const blur = p >= BLUR_IN
    if (blur !== blurOn) {
      blurOn = blur
      el.dataset.blur = blur ? 'on' : 'off'
    }

    const state = p >= ACTION_IN ? 'nav' : 'cover'
    if (state !== chromeState.value) {
      chromeState.value = state
      el.dataset.chromeState = state
    }
  }

  const writeShift = (next: boolean) => {
    if (next === hidden) return
    hidden = next
    // Transform only — never `top`/`height`/`margin`, which trigger layout (§6.4, §8.3).
    //
    // --header-shift lives on the DOCUMENT element, not the header. §22.3 makes it PUBLIC: the
    // project sub-nav reads it so the two move in lockstep by construction rather than by two
    // coincidentally-matching animations (§6.4). Anchored to the header alone it would be
    // invisible outside that subtree and the sub-nav would strand an 88px gap (FG-11).
    // --header-p stays on the header, where its invalidation is confined (§23.1).
    document.documentElement.style.setProperty(
      '--header-shift',
      hidden ? 'calc(-1 * var(--header-h))' : '0px'
    )
  }

  /**
   * I6 — under reduced motion HIDDEN is unreachable: hide/reveal IS motion (§8.4).
   * I1 — the header may never hide while any part of the cover is visible. It IS the cover.
   * I2/I3 — never retract under focus or the cursor.
   * I4 — no chrome churn behind a modal.
   */
  const mayHide = () => {
    // I6 — under reduced motion the header is permanently REVEALED.
    if (solid || drawerOpen || reduceMotionQuery?.matches) return false
    if (zone === 'cover' || p < 1) return false // I1 — never hide over any part of the cover
    if (!el) return false
    if (el.matches(':focus-within')) return false // I2 — never lose the focused element
    if (el.matches(':hover') && finePointerQuery?.matches) return false // I3 — not under the cursor
    return true
  }

  const reveal = () => {
    revealed = true
    writeShift(false)
  }

  const update = () => {
    ticking = false
    if (!el) return

    // I4 / §33.3 — FREEZE COMPLETELY while the drawer is open, before reading anything.
    // The scroll lock makes <body> `position: fixed`, so scrollY reports 0: writing `p` from it
    // would drive the header to COVER *behind* the open drawer (T10), and recording lastY = 0
    // would make the restore-scroll on close look like a 600px downward flick and hide the
    // header. `p` and `--header-shift` are frozen; lastY keeps its pre-open value, so the
    // restored position yields a delta of exactly 0.
    if (drawerOpen) return

    // The ONLY layout-affecting read in the hot path (§23.1, A.2).
    const y = window.scrollY
    writeFloat(y)

    if (!solid) {
      // M2 — the clamp is load-bearing, not defensive: iOS rubber-band drives scrollY negative.
      writeP(clamp(y / pEnd, 0, 1))
    }

    zone = y < pEnd ? 'cover' : footerVisible ? 'footer' : 'content'

    const delta = y - lastY
    lastY = y

    // M3 — accumulator resets on direction change, absorbing momentum bounce and trackpad jitter.
    if ((delta > 0 && accum < 0) || (delta < 0 && accum > 0)) accum = 0
    accum += delta

    if (zone === 'cover') {
      reveal() // §6.3 — scrollY < P_END always reveals
      accum = 0
      return
    }

    if (accum <= -REVEAL_DELTA) {
      reveal()
      accum = 0
      return
    }

    if (accum >= HIDE_DELTA && mayHide()) {
      revealed = false
      writeShift(true)
      accum = 0
    }
  }

  const onScroll = () => {
    if (ticking) return
    ticking = true
    frame = requestAnimationFrame(update)
  }

  /**
   * M1 — `P_END` is computed on mount and orientationchange ONLY, never on resize. iOS collapses
   * the address bar on scroll, which fires `resize`; recomputing mid-scroll would make the header
   * jump. This is a correctness requirement, not an optimisation.
   */
  const measure = () => {
    pEnd = Math.min(0.5 * window.innerHeight, P_END_CAP)
  }

  const onFocusIn = () => reveal() // I2
  const onPointerEnter = () => {
    if (finePointerQuery?.matches) reveal() // I3
  }

  const register = (node: HTMLElement) => {
    el = node

    reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    finePointerQuery = window.matchMedia('(pointer: fine)')

    measure()
    // §7.3 / §34.1 — first measurement runs synchronously here, before paint.
    lastY = window.scrollY
    if (solid) {
      writeP(1)
    } else {
      writeP(clamp(lastY / pEnd, 0, 1))
    }
    writeFloat(lastY)
    writeShift(false)

    // §34.2 — the pre-hydration guard has done its job; take over via --header-p.
    delete document.documentElement.dataset.chrome

    // From here on the header is client-driven. The pre-hydration colour guards in main.css
    // (`data-chrome-solid` without `data-chrome-live`) stand down: the head plugin sets
    // `data-chrome-solid` at page:finish, before the old page has faded out, and a guard that
    // outlived hydration would repaint the cover-state toggle light over the hero scrim.
    document.documentElement.dataset.chromeLive = ''

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('orientationchange', measure)
    el.addEventListener('focusin', onFocusIn)
    el.addEventListener('pointerenter', onPointerEnter)

    // §6.2 — the footer zone is detected with an IntersectionObserver, not a scroll calculation.
    // §27.1 permits exactly three observers site-wide; this is the second.
    const footer = document.querySelector('footer')
    // A remount (app.vue -> error.vue -> app.vue) registers a new header while the singleton's
    // cleanup stays bound to the first scope: never leave the previous footer observer running.
    observer?.disconnect()
    observer = null
    if (footer) {
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) footerVisible = entry.isIntersecting
          if (!footerVisible && !revealed) reveal() // footer exit reveals (§5.4)
          else if (footerVisible && mayHide()) {
            // The footer contains the full nav, so floating chrome is redundant (§6.2).
            revealed = false
            writeShift(true)
          }
        },
        { threshold: 0.5 }
      )
      observer.observe(footer)
    }
  }

  const cleanup = () => {
    // A.3 / A.5 — zero retained listeners, observers or rAF callbacks after unmount.
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('orientationchange', measure)
    el?.removeEventListener('focusin', onFocusIn)
    el?.removeEventListener('pointerenter', onPointerEnter)
    if (frame) cancelAnimationFrame(frame)
    observer?.disconnect()
    observer = null
    el = null
    delete document.documentElement.dataset.chromeLive
  }

  const setDrawerOpen = (open: boolean) => {
    drawerOpen = open
    drawerOpenRef.value = open
    // FG-12 / V14 — while the drawer is open its overlay owns the screen's one blur, so the
    // header drops its own. Two stacked backdrop-filters read as mush; each component is
    // "within budget", the SCREEN is not (ADR-006).
    if (el) el.dataset.drawer = open ? 'open' : 'closed'
    if (open) reveal() // I4 — DRAWER_OPEN ⟹ REVEALED
  }

  const setSolid = (next: boolean) => {
    solid = next
    if (solid) {
      writeP(1)
      reveal()
    }
  }

  // A.3 / A.5 — zero retained listeners, observers or rAF callbacks after unmount. Registered
  // here, in the setup scope that first called the composable, rather than inside register()'s
  // onMounted callback, where there is no active effect scope to attach to.
  if (getCurrentScope()) onScopeDispose(cleanup)

  /**
   * §7.2 — the route contract. Without it the header FLASHES white over an incoming dark cover
   * (FG-05), then MELTS as `p` animates 1 → 0 (FG-06).
   */
  const router = useRouter()
  const nuxtApp = useNuxtApp()

  // Page transition (nuxt.config `app.pageTransition`, mode out-in). With Suspense and out-in,
  // `page:finish` fires as soon as the NEW page is ready and ALWAYS precedes
  // `page:transition:finish`, which fires when the old page has finished fading out; the new page
  // is not in the DOM until then, and the old page's unmount is what releases a pinned header
  // (LegalPage -> setSolid(false)). Phases 3 and 4 must see the swapped DOM: run any earlier, `p`
  // is recomputed with the old pin still set and the chrome transitions come back while the
  // colours are about to flip, which is the melt (FG-06).
  //
  // So a route change settles only once both hooks have fired, and then only when #main holds
  // exactly one page that is not leaving. Each navigation is bound to its target route, so a late
  // hook from an earlier one (A -> B, then B -> C during B's out phase) is ignored. A slow lazy
  // chunk (saveData, 2g) can hold the new page back for any length of time, so the safety timer
  // starts at `page:finish` and bounds only the wait for the transition, never the chunk load.
  const SETTLE_FALLBACK_MS = 1500
  const SETTLE_MAX_FRAMES = 30
  // Last-resort backstop for a navigation that never reaches page:finish by any path the hooks
  // below recognise. Long enough never to cut a real slow chunk load short in practice.
  const NAVIGATION_WATCHDOG_MS = 10000
  let navigating = false
  // The target PATH, not fullPath: a hash or query push (in-page anchors, skip links) while a
  // page change is in flight must neither strand nor misattribute it.
  let target = ''
  let epoch = 0
  let resolved = false
  let swapped = false
  let fallbackTimer = 0
  let watchdogTimer = 0

  const settle = () => {
    if (!el) return
    // Phase 3 — recompute synchronously from the ACTUAL scrollY, so back/forward with a
    // savedPosition lands in NAVIGATION instantly rather than animating into it.
    measure()
    lastY = window.scrollY
    accum = 0
    footerVisible = false
    zone = lastY < pEnd ? 'cover' : 'content'
    if (!solid) writeP(clamp(lastY / pEnd, 0, 1))
    writeFloat(lastY)

    // Phase 4 — the DOUBLE rAF is load-bearing. Removing the class in the same frame the vars
    // are written lets the browser coalesce both into one style recalc and animate the change
    // anyway — the exact melt this prevents. The first frame commits the vars; the second
    // re-enables transitions against them as the new baseline.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => el?.classList.remove('chrome-no-transition'))
    })
  }

  /** The swap is complete: one page child in #main, and it is not the one fading out. */
  const swapDone = () => {
    const pages = document.getElementById('main')?.children
    return pages?.length === 1 && !/\bpage-leave/.test(pages[0]!.className)
  }

  /** Give up on a navigation that will not complete (aborted, failed): bring chrome back. */
  const abandon = () => {
    if (!navigating) return
    navigating = false
    window.clearTimeout(fallbackTimer)
    window.clearTimeout(watchdogTimer)
    settle()
  }

  const settleWhenSwapped = () => {
    if (!navigating || !resolved || !swapped) return
    window.clearTimeout(fallbackTimer)
    window.clearTimeout(watchdogTimer)
    const mine = epoch
    let frames = 0
    // The new page is inserted synchronously right after the transition's afterLeave hook
    // returns; wait for the DOM to say so, with a frame budget so it can never hang.
    const attempt = () => {
      if (!navigating || mine !== epoch) return
      if (!swapDone() && frames++ < SETTLE_MAX_FRAMES) {
        requestAnimationFrame(attempt)
        return
      }
      navigating = false
      settle()
    }
    requestAnimationFrame(attempt)
  }

  /** A hook belongs to the navigation in flight only while the router is still on its target. */
  const isCurrent = () => navigating && router.currentRoute.value.path === target

  router.beforeEach((to, from, next) => {
    if (to.path !== from.path && el) {
      // Phase 1 — suppress transitions and force REVEALED before Nuxt paints.
      el.classList.add('chrome-no-transition')
      revealed = true
      hidden = false
      document.documentElement.style.setProperty('--header-shift', '0px')

      navigating = true
      target = to.path
      epoch += 1
      resolved = false
      swapped = false
      window.clearTimeout(fallbackTimer)
      window.clearTimeout(watchdogTimer)
      watchdogTimer = window.setTimeout(abandon, NAVIGATION_WATCHDOG_MS)
    }
    next()
  })

  router.afterEach((to, from, failure) => {
    // An aborted navigation never reaches page:finish: release the chrome. (A cancelled one has
    // been superseded by a newer navigation, which owns the state now.)
    if (failure) {
      if (isNavigationFailure(failure, NavigationFailureType.aborted) && to.path === target) abandon()
      return
    }
    // A same-path navigation (hash or query push) that superseded a pending page change: the
    // router stays on the old page and no page:finish will follow, so release the chrome.
    if (navigating && to.path === from.path && router.currentRoute.value.path !== target) abandon()
  })
  router.onError(abandon)

  nuxtApp.hook('page:finish', () => {
    if (!el) return
    if (nuxtApp.isHydrating) {
      // First paint: nothing is leaving.
      settle()
      return
    }
    if (!isCurrent()) return
    resolved = true
    if (!swapped) {
      fallbackTimer = window.setTimeout(() => {
        swapped = true
        settleWhenSwapped()
      }, SETTLE_FALLBACK_MS)
    }
    settleWhenSwapped()
  })

  nuxtApp.hook('page:transition:finish', () => {
    if (!isCurrent()) return
    swapped = true
    settleWhenSwapped()
  })

  return {
    register,
    setDrawerOpen,
    setSolid,
    chromeState: chromeState as Readonly<Ref<'cover' | 'nav'>>,
    drawerOpen: drawerOpenRef as Readonly<Ref<boolean>>
  }
}

/**
 * §7.3 — SSR renders p = 0 (COVER: transparent, mono-white logo), which is correct for a page
 * loaded at the top, i.e. essentially every entry. The machine is client-only, so the server
 * gets an inert stub rather than the singleton: module-scoped state on the server is SHARED
 * ACROSS REQUESTS, and a singleton created during SSR would capture one request's router and
 * hand it to every subsequent visitor.
 */
function serverStub(): HeaderState {
  return {
    register: () => {},
    setDrawerOpen: () => {},
    setSolid: () => {},
    chromeState: shallowRef<'cover' | 'nav'>('cover'),
    drawerOpen: shallowRef(false)
  }
}

/**
 * Singleton (§2): two header instances would fight over the same CSS vars, so the composable
 * must be safe to call more than once and return the same instance.
 */
export function useHeaderState(): HeaderState {
  if (import.meta.server) return serverStub()
  if (!singleton) singleton = create()
  return singleton
}
