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
export async function settle(page: Page) {
  // A full-page screenshot expands the viewport to the document height, which drags every
  // `loading="lazy"` image into view *during* the capture — so Playwright's two stabilisation
  // probes disagree and the shot never settles. Defuse it by making every image eager up
  // front, then waiting for actual decode (not merely `load`).
  await page.evaluate(() => {
    for (const img of document.images) img.loading = 'eager'
  })

  // Sweep the page so any observer-driven content materialises, then return to top.
  await page.evaluate(async () => {
    const step = window.innerHeight
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y)
      await new Promise(r => setTimeout(r, 60))
    }
    window.scrollTo(0, 0)
  })

  await page.evaluate(() => document.fonts.ready)

  // Images added during the sweep are also forced eager, then all are decoded.
  await page.evaluate(async () => {
    for (const img of document.images) img.loading = 'eager'
    await Promise.all(
      Array.from(document.images).map(img =>
        img.decode().catch(() => undefined)
      )
    )
  })

  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(300)
}

export async function scrollTo(page: Page, y: number) {
  await page.evaluate(scrollY => window.scrollTo(0, scrollY), y)
  await page.waitForTimeout(250)
}
