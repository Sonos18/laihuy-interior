import { expect, test } from './fixtures'
import { PAGES, settle } from './helpers'

/**
 * The alignment matrix — docs/header-footer-art-direction.md §4.3, V1/V2, ADR-002.
 *
 * Alignment is a NUMBER, so it is tested as a number. Screenshot diffing cannot tell a 24px
 * misalignment from a photo re-encode or a font-hint change (§14, ADR-002 alt 2): it would
 * either miss the defect or drown it in noise. This suite is what makes the defect class that
 * produced the whole redesign impossible to reintroduce silently, and it doubles as executable
 * documentation of the rail.
 *
 * Every `.shell` on every page must resolve to ONE left edge and ONE measure, at each of the
 * five viewports in §4.3 — 1280 included, and it is mandatory rather than a rounding of 1440
 * (§38.1).
 */

/** §4.3 — five viewports. `--shell-gutter` steps at --bp-md (768). */
const VIEWPORTS = [390, 768, 1280, 1440, 1920] as const

/** §29 — --shell-measure: 80rem of CONTENT. */
const SHELL_MEASURE = 1280
const gutterFor = (vw: number) => (vw >= 768 ? 32 : 24)

/**
 * The rail, derived from the tokens rather than hardcoded — if `.shell` and this disagree, one
 * of them is wrong, and the test says which.
 *
 *   element = min(vw, measure + 2·gutter)   ← max-width, centred by margin-inline: auto
 *   left    = (vw − element) / 2 + gutter   ← padding-inline is INSIDE the element
 */
function expectedRail(vw: number) {
  const gutter = gutterFor(vw)
  const element = Math.min(vw, SHELL_MEASURE + 2 * gutter)
  return {
    left: (vw - element) / 2 + gutter,
    measure: Math.min(SHELL_MEASURE, element - 2 * gutter)
  }
}

for (const vw of VIEWPORTS) {
  for (const page_ of PAGES) {
    test(`${page_.name} @ ${vw} — one left edge, one measure`, async ({ page }) => {
      await page.setViewportSize({ width: vw, height: 900 })
      await page.goto(page_.path, { waitUntil: 'load' })
      await settle(page)

      const shells = await page.evaluate(() =>
        Array.from(document.querySelectorAll('.shell'))
          .map((el) => {
            const rect = el.getBoundingClientRect()
            const style = getComputedStyle(el)
            return {
              // Content-box edges: padding-inline is the gutter, so the CONTENT left is the rail.
              left: rect.left + parseFloat(style.paddingLeft),
              width: rect.width - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight),
              tag: `${el.tagName.toLowerCase()}.${(el.className || '').toString().split(' ')[0]}`
            }
          })
          // Anything not laid out (a v-if'd panel) reports 0 and would be meaningless to assert.
          .filter(box => box.width > 0)
      )

      // A page with no rail is a page that bypassed the shell — the ADR-002 maintenance surface.
      expect(shells.length).toBeGreaterThan(0)

      const rail = expectedRail(vw)

      for (const shell of shells) {
        // V1 — alignment drift vs the rail: ≤ 0.5px.
        expect(Math.abs(shell.left - rail.left), `${shell.tag} left`).toBeLessThanOrEqual(0.5)
        // V2 — measure drift vs --shell-measure: ≤ 1px.
        expect(Math.abs(shell.width - rail.measure), `${shell.tag} measure`).toBeLessThanOrEqual(1)
      }
    })
  }
}
