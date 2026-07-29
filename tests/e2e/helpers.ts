import type { Page } from '@playwright/test'

/** The 8 covers. Every gate runs against all of them — including Home, which is bespoke
 *  (docs/header-footer-art-direction.md §30.1) and is the LCP page. */
export const PAGES = [
  { name: 'home', path: '/' },
  { name: 'projects', path: '/du-an' },
  { name: 'project-detail', path: '/du-an/khach-san-eo-gio' },
  { name: 'factory', path: '/nha-xuong' },
  { name: 'services', path: '/dich-vu' },
  { name: 'about', path: '/gioi-thieu' },
  { name: 'careers', path: '/tuyen-dung' },
  { name: 'contact', path: '/lien-he' }
] as const

/** §38.1 — 1280 is mandatory, not a rounding of 1440: it is the exact width at which the
 *  nav row has ~10px of slack (V11 / O3). */
export const VIEWPORTS = [
  { name: '390', width: 390, height: 844 },
  { name: '768', width: 768, height: 1024 },
  { name: '1440', width: 1440, height: 900 }
] as const

/** Header strip clip: covers --header-h (88px max) + --header-scrim-h (160px) = 248. */
export const HEADER_CLIP_H = 260

/** Scroll depth for the NAVIGATION-state capture. Past P_END = min(0.5vh, 400) at every
 *  viewport we test. */
export const SCROLLED_Y = 600

/**
 * Make a page byte-stable before capture (§14): fonts loaded, images decoded, lazy content
 * materialised, scroll reset. Without this the suite flakes, and §41 P8 forbids "fix" by
 * regenerating baselines.
 */
/**
 * Make a page byte-stable before capture (§14).
 *
 * There is NO scroll-sweep here, deliberately. An earlier version swept the page to
 * "materialise" lazy content — and that sweep was itself the source of nondeterminism: it
 * drove IntersectionObservers and lazy-load decisions at timing-dependent scroll positions,
 * so consecutive runs of the *same commit* produced screenshots differing by ~370,000 pixels,
 * with whole content blocks left unpainted.
 *
 * Forcing `loading="eager"` makes the browser fetch every image immediately, independent of
 * viewport — which is what the sweep was trying to achieve, without the race. Measured: three
 * consecutive full-page captures of the tallest page (home @ 390, ~12,000px) are byte-identical.
 *
 * §41 P8: flake is fixed by determinism, never by re-rolling a baseline.
 */
export async function settle(page: Page) {
  await page.evaluate(() => {
    for (const img of document.images) img.loading = 'eager'
  })

  await page.evaluate(() => document.fonts.ready)

  /**
   * Every image must actually ARRIVE before anything is decoded.
   *
   * Phase 7 defect: this step used to be
   *   `img.decode().catch(() => undefined)`
   * — which **swallowed the failure**. Under load (96 shots against a single-threaded Nitro
   * server) a stalled request rejects, the catch discards it, and the capture proceeds with the
   * image missing. That frame is **stable but WRONG**, so `toHaveScreenshot`'s stability retry
   * cannot see it: the picture is consistent, it is merely incomplete. It reproduced as
   * `home @ 768` on Firefox roughly 1 run in 4, and only in the full 246-test run — never in
   * isolation, which is the signature of a load-dependent race.
   *
   * That is exactly the failure §14 already documents ("whole content blocks left unpainted"),
   * reintroduced through an error handler. §41 P8: flake is fixed by determinism, never by
   * re-rolling a baseline — so the arrival is now WAITED ON and a genuine failure is allowed to
   * surface as a timeout rather than as a silently wrong baseline.
   *
   * `!img.currentSrc` guards the legitimately src-less <img>, which is `complete` with
   * `naturalWidth === 0` and would otherwise hang this wait forever.
   */
  await page.waitForFunction(
    () => Array.from(document.images).every(
      img => img.complete && (img.naturalWidth > 0 || !img.currentSrc)
    ),
    undefined,
    { timeout: 30_000 }
  )

  // Decoded, not merely loaded. Arrival is already proven above, so this cannot mask a
  // missing image any more.
  await page.evaluate(async () => {
    await Promise.all(
      Array.from(document.images).map(img => img.decode().catch(() => undefined))
    )
  })

  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(300)
}

/**
 * Drive the page to `y` and WAIT for the header state machine to finish reacting to it.
 *
 * Every wait here is an assertion; none is a sleep. The previous implementation fired
 * `window.scrollTo` and slept 250ms, which asserts nothing — it only hopes the machine has both
 * hydrated and reacted by the time it returns. That is the shape of defect §41 P8 exists to
 * outlaw: when the hope is wrong the frame is stable but WRONG (chrome frozen in COVER —
 * transparent bar, no CTA), so `toHaveScreenshot`'s stability retry cannot see it and
 * `--update-snapshots` would enshrine it.
 *
 * The three steps mirror how the machine actually works:
 *
 *  1. HYDRATION. `useHeaderState.register()` is what starts observing scroll, and it deletes the
 *     `data-chrome` pre-hydration guard at that same moment (§34.2, set by the inline script in
 *     app.vue). While the attribute is present the chrome is frozen in its SSR state and a scroll
 *     means nothing to it, so the absence of the attribute is the machine's own "I am driving now".
 *
 *  2. REACTION. `onScroll` does no work inline — it schedules a rAF and `update()` writes
 *     `--header-p` on the next frame. A scroll event is dispatched before that frame's rAF
 *     callbacks, so awaiting TWO frames guarantees both the event and the write have run. The
 *     double rAF is the same device, for the same reason, as the load-bearing one at
 *     useHeaderState.ts:327-329.
 *
 *  3. SETTLEMENT. Anything that writes later — the footer IntersectionObserver (§6.2) — is caught
 *     by requiring two consecutive identical samples. `waitForFunction` polls on rAF, so two equal
 *     readings ARE two consecutive frames.
 *
 * No production constant is duplicated here: the helper waits for the machine to stop moving
 * rather than predicting where it should stop.
 */
export async function scrollTo(page: Page, y: number) {
  await page.waitForFunction(
    () => !document.documentElement.dataset.chrome,
    undefined,
    { timeout: 30_000 }
  )

  await page.evaluate((scrollY) => {
    // Cleared with the scroll so a sample memoised by an earlier call cannot satisfy step 3.
    delete (window as unknown as { __headerSample?: string }).__headerSample
    window.scrollTo(0, scrollY)
  }, y)

  await page.evaluate(() => new Promise<void>((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
  }))

  await page.waitForFunction(
    () => {
      const header = document.querySelector('header')
      if (!header) return false

      const sample = `${Math.round(window.scrollY)}:`
        + `${getComputedStyle(header).getPropertyValue('--header-p').trim()}:`
        + `${header.dataset.chromeState}`

      const store = window as unknown as { __headerSample?: string }
      const previous = store.__headerSample
      store.__headerSample = sample
      return previous === sample
    },
    undefined,
    { timeout: 30_000 }
  )
}
