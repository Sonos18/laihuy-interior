import { test as base, expect } from '@playwright/test'

/**
 * The VR harness's base test — docs/header-footer-art-direction.md §14, §13.
 *
 * ── Why this file exists ──────────────────────────────────────────────────────────────────
 *
 * §14 mandates that EVERY capture is taken with reduced motion emulated, and the config has
 * declared `use: { reducedMotion: 'reduce' }` since Phase 0. **It was never in effect.**
 *
 * Measured on Playwright 1.61.1: the option resolves correctly
 * (`testInfo.project.use.reducedMotion === 'reduce'`) but never reaches the browser context —
 * `matchMedia('(prefers-reduced-motion: reduce)').matches` returns `false` on about:blank, with
 * the option set at config level, project level AND spec level via `test.use()`. The imperative
 * paths (`page.emulateMedia()`, `browser.newContext({ reducedMotion })`) both work. It is a
 * plumbing bug in the runner's context construction, not in the config.
 *
 * The consequence was not cosmetic. With reduced motion inactive, `scrollTo(page, 600)` is a
 * 600px downward delta, so the header legitimately HIDES (I1 is satisfied at p = 1 in the
 * content zone) — and every scrolled header-strip capture recorded an empty strip instead of the
 * chrome it exists to assert. §13's whole premise ("the design must be signed off as final art
 * with every animation disabled", I6: header permanently REVEALED) was being asserted against a
 * page where I6 was not active.
 *
 * The emulation is therefore applied imperatively, BEFORE navigation, and asserted (below) so it
 * can never silently lapse again. §41 P8 — flake and harness defects are fixed by determinism,
 * never by regenerating a baseline.
 */
export const test = base.extend<{ reducedMotionGuard: boolean }>({
  reducedMotionGuard: [
    async ({ page }, use) => {
      // Before any navigation: useHeaderState reads matchMedia when it registers (onMounted),
      // and I6 must be true from the first frame.
      await page.emulateMedia({ reducedMotion: 'reduce' })
      await use(true)
    },
    { auto: true }
  ]
})

export { expect }
