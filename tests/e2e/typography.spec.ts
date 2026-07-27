import { expect, test } from './fixtures'
import { PAGES } from './helpers'

/**
 * Typography gates — the two reading constraints that pixels cannot catch.
 *
 * ── Why this file exists ──────────────────────────────────────────────────────────────────
 *
 * Both invariants below were violated (T2) or nearly reversed (T1) by a design pass that had
 * measured the site carefully and still got them wrong, because neither is visible in a
 * screenshot diff. A rebaseline is a routine, human-approved act (§41 P6): a regression landed
 * in the same commit as a legitimate layout change is baked into the new baseline and becomes
 * invisible. A number can tell the difference.
 *
 * T1 · BODY LEADING IS A FLOOR, NOT A PREFERENCE.
 *      Vietnamese sets marks ABOVE cap height (Ế, Ấ, Ể) and dots BELOW the baseline (Ộ, Ợ, Ụ),
 *      so consecutive lines close from both directions at once — a constraint Latin-only copy
 *      does not have. A UX review recommended cutting body leading to 1.6 "to increase
 *      density"; at 14px that collides. The rendered value is ~1.71 and it is deliberate.
 *      This gate exists so the next density pass has to argue with a number instead of
 *      quietly winning.
 *
 * T2 · MEASURE IS A CAP, NOT AN ACCIDENT.
 *      Line length was whatever `max-w-*` a paragraph's column happened to inherit. Measured
 *      across the site that produced 30 characters per line inside a 258px card and 91 inside
 *      /nha-xuong's FAQ column — a 3x spread at ONE type size, with the top end roughly double
 *      the comfortable maximum. `.measure` / `.measure-lead` in main.css are the fix; this
 *      asserts the outcome rather than the class, so a paragraph that solves it another way
 *      passes and one that drops the class fails.
 *
 * ── Method ────────────────────────────────────────────────────────────────────────────────
 *
 * Line boxes are counted with Range.getClientRects(), NOT height / line-height. A paragraph
 * that is a direct grid child STRETCHES to its row height, so the height-based arithmetic
 * reports phantom lines and silently inflates the measure. One rect per rendered line box is
 * the ground truth.
 *
 * Images are ABORTED and the wait is fonts-only — deliberately NOT the VR suite's `settle()`.
 * `settle()` forces every image to `loading="eager"` and blocks until all of them arrive,
 * which is correct for a pixel capture and pure cost here: these gates read text metrics, and
 * the media pipeline serves from Supabase over the network. Using it cost hundreds of remote
 * round-trips per run and pushed the neighbouring hero gates past their 120s timeout when the
 * suites ran back to back — the exact load-induced flake hero.spec.ts documents. §41 P8: flake
 * is fixed by determinism, not by raising timeouts, so the wait is narrowed to the one input
 * that actually decides line breaking.
 */

/** Prose only. Short strings (labels, chips, values, single-word cells) have no measure to
 *  speak of and would add noise without adding coverage. */
const MIN_PROSE_CHARS = 60

/** T1 — the floor. Applies to body-size type, where diacritic collision actually occurs;
 *  display sizes carry far more absolute leading at a lower ratio and are excluded. */
const BODY_SIZE_CEILING_PX = 15.5
const MIN_BODY_LEADING = 1.65

/** T2 — the cap. 75 is the upper end of the conventional 45–75 comfort band. The gate asserts
 *  the ceiling only: a narrow column is a layout choice, an unbounded one is a defect. */
const MAX_CHARS_PER_LINE = 75

/** Sub-pixel rects and a trailing partial line make an exact count unreliable at the boundary;
 *  this absorbs the rounding without admitting a real overrun (91 vs 75 is not a rounding). */
const CPL_TOLERANCE = 3

type Sample = {
  text: string
  fontSize: number
  leading: number
  lines: number
  cpl: number
}

/**
 * Load a page in the state these gates measure: text laid out, images never requested.
 *
 * Fonts, and only fonts. Text metrics decide where lines break, and where lines break IS the
 * measurement — everything else on the page is irrelevant to it.
 */
async function gotoText(page: import('@playwright/test').Page, path: string) {
  await page.route(/\.(png|jpe?g|webp|avif|gif|svg)(\?|$)/i, route => route.abort())
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto(path, { waitUntil: 'domcontentloaded' })
  await page.evaluate(() => document.fonts.ready)
}

/**
 * Collect every prose paragraph with its rendered line-box count.
 *
 * Runs in the page so Range measurement happens against real layout. Elements with no
 * rendered rects (a collapsed <details>, a v-if'd panel) are skipped rather than asserted:
 * they have no measure until they are opened, and asserting 0 would be meaningless.
 */
async function collectProse(page: import('@playwright/test').Page): Promise<Sample[]> {
  return await page.evaluate(({ minChars }) => {
    const out: Sample[] = []

    for (const el of document.querySelectorAll('p, li, dd')) {
      const text = (el.textContent ?? '').replace(/\s+/g, ' ').trim()
      if (text.length < minChars) continue

      const cs = getComputedStyle(el)
      const fontSize = Number.parseFloat(cs.fontSize)
      const lineHeight = Number.parseFloat(cs.lineHeight)
      if (!fontSize || !lineHeight) continue

      // One rect per rendered line box — immune to grid-stretch, unlike height / line-height.
      const range = document.createRange()
      range.selectNodeContents(el)
      const lines = Array.from(range.getClientRects()).filter(r => r.width > 0 && r.height > 0).length
      range.detach()
      if (lines === 0) continue

      out.push({
        text: text.slice(0, 60),
        fontSize,
        leading: lineHeight / fontSize,
        lines,
        cpl: text.length / lines
      })
    }

    return out
  }, { minChars: MIN_PROSE_CHARS })
}

for (const page_ of PAGES) {
  test(`${page_.name} — body leading holds the Vietnamese floor (T1)`, async ({ page }) => {
    await gotoText(page, page_.path)

    const tooTight = (await collectProse(page))
      .filter(s => s.fontSize <= BODY_SIZE_CEILING_PX && s.leading < MIN_BODY_LEADING)

    expect(
      tooTight,
      `[T1 · ${page_.name}] body copy is set below ${MIN_BODY_LEADING} leading:\n`
      + tooTight.map(s => `  ${s.fontSize}px / ${s.leading.toFixed(2)} — "${s.text}"`).join('\n')
      + '\n\nVietnamese stacks marks above cap height AND dots below the baseline, so lines '
      + 'close from both directions. This floor is deliberate — do not lower it to gain '
      + 'density. Reduce the space BETWEEN blocks instead.'
    ).toEqual([])
  })

  test(`${page_.name} — no paragraph exceeds the measure cap (T2)`, async ({ page }) => {
    await gotoText(page, page_.path)

    // Single-line paragraphs cannot report a meaningful measure: the count is the whole string
    // regardless of how much room it had, so a long unwrapped label reads as a 90-char line.
    const tooWide = (await collectProse(page))
      .filter(s => s.lines > 1 && s.cpl > MAX_CHARS_PER_LINE + CPL_TOLERANCE)

    expect(
      tooWide,
      `[T2 · ${page_.name}] paragraphs set past ${MAX_CHARS_PER_LINE} characters per line:\n`
      + tooWide.map(s => `  ${Math.round(s.cpl)} cpl over ${s.lines} lines @ ${s.fontSize}px — "${s.text}"`).join('\n')
      + '\n\nApply `.measure` (or `.measure-lead` above ~16px) from main.css. The cap is a '
      + 'max-width, so narrow columns are unaffected.'
    ).toEqual([])
  })
}
