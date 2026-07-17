import { expect, test } from './fixtures'
import { HEADER_CLIP_H, PAGES, SCROLLED_Y, VIEWPORTS, scrollTo, settle } from './helpers'

/**
 * The canonical 32-shot suite — docs/header-footer-art-direction.md §14.
 *
 *   24 · full-page, rest state      (8 pages × 3 viewports)
 *    8 · header strip, NAVIGATION   (8 pages × 1440px)
 *
 * These are APPROVAL artefacts (§41), not diagnostics. An unexpected diff fails CI and stays
 * failed until a human approves it with `pnpm test:vr:approve` in a commit containing nothing
 * else.
 */

test.describe('rest state — full page', () => {
  for (const vp of VIEWPORTS) {
    for (const p of PAGES) {
      test(`${p.name} @ ${vp.name}`, async ({ page }) => {
        await page.setViewportSize({ width: vp.width, height: vp.height })
        await page.goto(p.path, { waitUntil: 'load' })
        await settle(page)

        await expect(page).toHaveScreenshot(`${p.name}-${vp.name}.png`, {
          fullPage: true,
          maxDiffPixelRatio: 0.02
        })
      })
    }
  }
})

test.describe('scrolled state — header strip', () => {
  for (const p of PAGES) {
    test(`${p.name} header @ 1440`, async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 })
      await page.goto(p.path, { waitUntil: 'load' })
      await settle(page)
      await scrollTo(page, SCROLLED_Y)

      await expect(page).toHaveScreenshot(`${p.name}-header-scrolled.png`, {
        clip: { x: 0, y: 0, width: 1440, height: HEADER_CLIP_H },
        maxDiffPixelRatio: 0.001
      })
    })
  }
})
