import { expect, test } from './fixtures'
import { deviation } from './color'
import { settle } from './helpers'

/**
 * The numeric gates that pixels cannot catch — docs/header-footer-art-direction.md §14.1.
 *
 *   V7  · Colour deviation — rendered token vs spec value, ΔE₀₀ ≤ 1.0
 *   V16 · Optical logo height — trimmed-bbox measure vs --logo-h-*, ≤ 1px
 *
 * §38.4 assigns both to Phase 6. They live here rather than in the VR suite because pixel
 * diffing catches CHANGE but not WRONGNESS (§14.1): a drifted token and a JPEG re-encode look
 * identical to a screenshot comparison, and a logo rendering at 42% of its box passes a
 * screenshot happily. A number can tell the difference.
 */

/** L0 primitives, transcribed from `@theme` in main.css — the values §29 resolves to. */
const INK_950 = '#0b0a09'
const INK_600 = '#5d5349'
const INK_500 = '#74685d'
const WOOD_300 = '#c59b75'
const WOOD_600 = '#7c5032'

/** Every composite is taken over the footer's own surface. */
const ON_INK_950: [number, number, number] = [11, 10, 9]
const ON_WHITE: [number, number, number] = [255, 255, 255]

/**
 * V7 — the footer's token set (§38.4 Phase 6 gate).
 *
 * Chrome's nav colour is deliberately excluded: §31.1 drives it through color-mix() on a
 * CONTINUOUS --header-p, so it has a fixed expected value only at p = 0 and p = 1 and is a
 * moving target everywhere between. Its endpoints are covered by the @supports fallback rules.
 */
const V7_FOOTER = [
  { selector: '.footer-eyebrow', prop: 'color', expected: WOOD_300, token: '--accent-dark' },
  { selector: '.footer-link', prop: 'color', expected: 'rgba(255,255,255,0.72)', token: '--fg-dark-muted' },
  { selector: '.footer-label', prop: 'color', expected: 'rgba(255,255,255,0.48)', token: '--fg-dark-subtle' },
  { selector: '.footer-meta', prop: 'color', expected: 'rgba(255,255,255,0.48)', token: '--fg-dark-subtle' },
  { selector: '.footer-textlink', prop: 'color', expected: '#ffffff', token: '--fg-dark' },
  { selector: 'footer', prop: 'backgroundColor', expected: INK_950, token: '--footer-surface' }
] as const

/**
 * The harness guard. §14 requires reduced motion on EVERY capture, and it silently was not
 * applied for the whole of Phases 0–6 (see fixtures.ts). If this fails, every screenshot in the
 * suite is being taken in the wrong state and no other result in this file means anything.
 */
test('harness — reduced motion is actually emulated (§14, I6)', async ({ page }) => {
  await page.goto('/', { waitUntil: 'load' })
  const matches = await page.evaluate(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
  expect(matches, '§14 mandates reduced-motion emulation on every capture').toBe(true)
})

/**
 * I6 — under reduced motion HIDDEN is unreachable: hide/reveal IS motion (§8.4, §32.2).
 *
 * This is the invariant the harness bug was masking. §13 signs the design off as final art with
 * motion disabled, and it can only do that if the header is present in the frame.
 */
test('I6 — the header never hides under reduced motion (§13, §8.4)', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/', { waitUntil: 'load' })
  await settle(page)
  await page.evaluate(() => window.scrollTo(0, 600))
  await page.waitForTimeout(400)

  const state = await page.evaluate(() => {
    const header = document.querySelector('.app-header') as HTMLElement
    return {
      top: header.getBoundingClientRect().top,
      shift: getComputedStyle(document.documentElement).getPropertyValue('--header-shift').trim()
    }
  })
  expect(state.shift, 'I6 — --header-shift must stay 0 under reduced motion').toBe('0px')
  expect(state.top, 'I6 — the header must remain at the viewport top').toBe(0)
})

test.describe('V7 — colour deviation ≤ ΔE₀₀ 1.0', () => {
  test('footer tokens resolve to their §29 values', async ({ page }) => {
    await page.goto('/', { waitUntil: 'load' })
    await settle(page)

    const rendered = await page.evaluate((rows) => {
      return rows.map((row) => {
        const el = document.querySelector(row.selector)
        if (!el) return { ...row, value: null as string | null }
        const style = getComputedStyle(el)
        return { ...row, value: style[row.prop as 'color' | 'backgroundColor'] }
      })
    }, V7_FOOTER as unknown as { selector: string, prop: string, expected: string, token: string }[])

    for (const row of rendered) {
      expect(row.value, `${row.token} — ${row.selector} must exist`).not.toBeNull()
      const dE = deviation(row.value!, row.expected, ON_INK_950)
      // §24 requires evidence, not assertion: record the measured value, not just the verdict.
      console.log(`V7 ${row.token.padEnd(18)} ${row.selector.padEnd(18)} ΔE₀₀=${dE.toFixed(3)}  rendered=${row.value}`)
      expect(dE, `${row.token} on ${row.selector}: rendered ${row.value} vs spec ${row.expected}`)
        .toBeLessThanOrEqual(1.0)
    }
  })

  test('drawer + light-surface tokens resolve to their §29 values', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/', { waitUntil: 'load' })
    await settle(page)

    await page.getByRole('button', { name: /Mở menu|Open menu/ }).click()
    await expect(page.getByRole('dialog')).toBeVisible()

    // The drawer slides in UNDER the cursor — the close button lands where the trigger was, so
    // it inherits :hover and V7 samples --fg-light mid-transition instead of the idle
    // --fg-light-muted. Park the pointer and let --dur-hover (240ms) settle. §41 P8: flake is
    // fixed by determinism.
    await page.mouse.move(0, 400)
    await page.waitForTimeout(300)

    const rows = await page.evaluate(() => {
      const pick = (selector: string, prop: 'color' | 'backgroundColor') => {
        const el = document.querySelector(selector)
        return el ? getComputedStyle(el)[prop] : null
      }
      return {
        // :not([aria-current]) is load-bearing — the suite runs on '/', where the FIRST drawer
        // link is the current page and is therefore --accent-light by design (§32), not
        // --fg-light. Selecting `.drawer-link` blind asserts the idle token against the current
        // state and fails at ΔE₀₀ 30.9.
        drawerLink: pick('.drawer-link:not([aria-current])', 'color'),
        drawerCurrent: pick('.drawer-link[aria-current="page"]', 'color'),
        drawerClose: pick('.drawer-close', 'color'),
        drawerSurface: pick('.app-drawer', 'backgroundColor'),
        langInactive: pick('.lang-toggle-light .lang-option[aria-pressed="false"]', 'color')
      }
    })

    const record = (token: string, rendered: string, expected: string) => {
      const dE = deviation(rendered, expected, ON_WHITE)
      console.log(`V7 ${token.padEnd(18)} ${'(drawer)'.padEnd(18)} ΔE₀₀=${dE.toFixed(3)}  rendered=${rendered}`)
      return dE
    }

    // --fg-light — drawer nav item idle (§32).
    expect(record('--fg-light', rows.drawerLink!, INK_950)).toBeLessThanOrEqual(1.0)
    // --accent-light — drawer nav item CURRENT (§32). Never colour-alone: the rule and
    // aria-current are asserted by the a11y gates, this asserts the colour is the right one.
    expect(record('--accent-light', rows.drawerCurrent!, WOOD_600)).toBeLessThanOrEqual(1.0)
    // --fg-light-muted — drawer close idle (§32).
    expect(record('--fg-light-muted', rows.drawerClose!, INK_600)).toBeLessThanOrEqual(1.0)
    // --drawer-surface.
    expect(record('--drawer-surface', rows.drawerSurface!, '#ffffff')).toBeLessThanOrEqual(1.0)
    // --fg-light-subtle — lang toggle inactive (§32). §25.2: ink-500, NOT ink-400.
    expect(record('--fg-light-subtle', rows.langInactive!, INK_500)).toBeLessThanOrEqual(1.0)
  })
})

/**
 * V11 / O3 — Vietnamese nav-row overflow in the NAVIGATION state.
 *
 * §16 lists O3 as UNRESOLVED AND BLOCKING; §38.4 makes it a Phase 4 gate; §38.1 makes 1280
 * mandatory rather than a rounding of 1440, because that is the width the budget was drawn at.
 *
 * The row must be measured at its NATURAL width, not as laid out. `.chrome-nav` and
 * `.chrome-right` are flex items with the default `flex-shrink: 1`, so an over-budget row does
 * not overflow — it SILENTLY COMPRESSES, and the labels wrap inside their own boxes. That is why
 * `scrollWidth === clientWidth` here even when the row is 205px over budget, and why a naive
 * overflow assertion reports a pass. V10's line-count is equally blind: `.nav-link` is
 * `inline-flex`, so `getClientRects()` returns 1 whatever the text does inside it.
 *
 * Forcing `flex-shrink: 0` + `white-space: nowrap` and re-measuring is the only reading that
 * answers the question V11 actually asks.
 */
for (const width of [1280, 1440] as const) {
  test(`V11 / O3 — VI nav row has ≥ 8px slack @ ${width}, NAVIGATION`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/', { waitUntil: 'load' })
    await settle(page)
    // NAVIGATION: p = 1, so phone + CTA are present (§5.2, §9).
    await page.evaluate(() => window.scrollTo(0, 600))
    await page.waitForTimeout(400)

    const row = await page.evaluate(() => {
      const q = (s: string) => document.querySelector(s) as HTMLElement
      const style = document.createElement('style')
      style.textContent = `
        .chrome-nav, .chrome-right, .chrome-logo { flex-shrink: 0 !important; }
        .nav-link, .chrome-phone, .app-header .btn-primary { white-space: nowrap !important; flex-shrink: 0 !important; }
      `
      document.head.appendChild(style)

      const w = (s: string) => {
        const el = document.querySelector(s) as HTMLElement | null
        return el ? Math.round(el.getBoundingClientRect().width) : 0
      }
      const groupGap = parseFloat(getComputedStyle(q('.chrome-bar')).columnGap) || 32
      const required = w('.chrome-logo') + w('.chrome-nav') + w('.chrome-right') + 2 * groupGap
      const available = q('.chrome-bar').clientWidth
        - parseFloat(getComputedStyle(q('.chrome-bar')).paddingLeft)
        - parseFloat(getComputedStyle(q('.chrome-bar')).paddingRight)

      style.remove()
      return {
        lang: w('.lang-toggle'),
        nav: w('.chrome-nav'),
        cta: w('.app-header .btn-primary'),
        // 0 by design after the O3 resolution — the phone lives in the drawer now. Kept in the
        // measurement so a future contributor who re-adds it sees exactly what it costs.
        phone: w('.chrome-phone'),
        logo: w('.chrome-logo'),
        required,
        available,
        slack: available - required
      }
    })

    console.log(
      `V11 @${width} required=${row.required}px available=${row.available}px SLACK=${row.slack}px  `
      + `(logo ${row.logo} · nav ${row.nav} · lang ${row.lang} · phone ${row.phone} · cta ${row.cta})`
    )

    expect(row.phone, 'O3 — the phone must not return to the NAVIGATION row (§9, FG-16)').toBe(0)

    expect(
      row.slack,
      `V11 — the VI NAVIGATION row needs ${row.required}px but has ${row.available}px `
      + `(logo ${row.logo} · nav ${row.nav} · lang ${row.lang} · phone ${row.phone} · cta ${row.cta}). `
      + '≥ 8px of slack is required to absorb Safari\'s ±7px tracking variance over 7 links (C-3).'
    ).toBeGreaterThanOrEqual(8)
  })
}

/**
 * V16 — optical logo height.
 *
 * "V16 exists because the <img> box LIES." The source PNG's ink filled 42.4% of its canvas, so
 * asserting the element's height would happily pass a logo rendering at 27px. This measures the
 * TRIMMED CONTENT BOX of the rendered asset — the alpha bounding box — which is the only
 * measurement that can tell a correctly-sized mark from a padded one.
 *
 * It is therefore also the standing test of ADR-004's claim that trimming alone yields a 2.36×
 * optical increase: if a future contributor swaps in an untrimmed asset, this is what fails.
 */
async function opticalHeight(page: import('@playwright/test').Page, selector: string) {
  return page.evaluate(async (sel) => {
    const img = document.querySelector<HTMLImageElement>(sel)
    if (!img) return null
    await img.decode()

    const canvas = document.createElement('canvas')
    canvas.width = img.naturalWidth
    canvas.height = img.naturalHeight
    const ctx = canvas.getContext('2d')!
    ctx.drawImage(img, 0, 0)
    const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height)

    // Alpha bounding box: the first and last rows carrying any ink.
    let top = -1
    let bottom = -1
    for (let y = 0; y < canvas.height; y++) {
      let inked = false
      for (let x = 0; x < canvas.width; x++) {
        if (data[(y * canvas.width + x) * 4 + 3]! > 8) {
          inked = true
          break
        }
      }
      if (inked) {
        if (top === -1) top = y
        bottom = y
      }
    }
    if (top === -1) return null

    const inkRatio = (bottom - top + 1) / canvas.height
    const box = img.getBoundingClientRect().height
    return { optical: inkRatio * box, box, inkRatio }
  }, selector)
}

/** Resolve a token to px through a probe, rather than re-deriving rem maths in the test. */
async function tokenPx(page: import('@playwright/test').Page, token: string) {
  return page.evaluate((name) => {
    const probe = document.createElement('div')
    probe.style.position = 'absolute'
    probe.style.visibility = 'hidden'
    probe.style.height = `var(${name})`
    document.body.appendChild(probe)
    const px = probe.getBoundingClientRect().height
    probe.remove()
    return px
  }, token)
}

test.describe('V16 — optical logo height within 1px of its token', () => {
  test('header logos @ 390 (--logo-h-header)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/', { waitUntil: 'load' })
    await settle(page)

    const expected = await tokenPx(page, '--logo-h-header')
    for (const sel of ['.chrome-logo-white', '.chrome-logo-ink']) {
      const measured = await opticalHeight(page, sel)
      expect(measured, `${sel} must render`).not.toBeNull()
      console.log(
        `V16 ${sel.padEnd(20)} optical=${measured!.optical.toFixed(2)}px  token=${expected}px  `
        + `Δ=${Math.abs(measured!.optical - expected).toFixed(2)}px  ink=${(measured!.inkRatio * 100).toFixed(1)}%`
      )
      expect(
        Math.abs(measured!.optical - expected),
        `${sel}: optical ${measured!.optical.toFixed(2)}px vs --logo-h-header ${expected}px `
        + `(ink fills ${(measured!.inkRatio * 100).toFixed(1)}% of the asset — ADR-004 requires a trimmed master)`
      ).toBeLessThanOrEqual(1)
    }
  })

  test('header logos @ 1440 (--logo-h-header-xl)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/', { waitUntil: 'load' })
    await settle(page)

    const expected = await tokenPx(page, '--logo-h-header-xl')
    const measured = await opticalHeight(page, '.chrome-logo-white')
    console.log(
      `V16 ${'.chrome-logo-white@1440'.padEnd(20)} optical=${measured!.optical.toFixed(2)}px  `
      + `token=${expected}px  Δ=${Math.abs(measured!.optical - expected).toFixed(2)}px  ink=${(measured!.inkRatio * 100).toFixed(1)}%`
    )
    expect(Math.abs(measured!.optical - expected)).toBeLessThanOrEqual(1)
  })

  test('footer logo @ 390 and 1440 (--logo-h-footer / -md)', async ({ page }) => {
    for (const [width, token] of [[390, '--logo-h-footer'], [1440, '--logo-h-footer-md']] as const) {
      await page.setViewportSize({ width: width as number, height: 900 })
      await page.goto('/', { waitUntil: 'load' })
      await settle(page)

      const expected = await tokenPx(page, token)
      const measured = await opticalHeight(page, '.footer-logo')
      expect(measured, 'footer logo must render').not.toBeNull()
      console.log(
        `V16 ${`.footer-logo@${width}`.padEnd(20)} optical=${measured!.optical.toFixed(2)}px  `
        + `token=${expected}px  Δ=${Math.abs(measured!.optical - expected).toFixed(2)}px  ink=${(measured!.inkRatio * 100).toFixed(1)}%`
      )
      expect(
        Math.abs(measured!.optical - expected),
        `footer logo @ ${width}: optical ${measured!.optical.toFixed(2)}px vs ${token} ${expected}px`
      ).toBeLessThanOrEqual(1)
    }
  })

  /** §10 — "Footer logo ≥ header logo in visual weight" (§19 review checklist). */
  test('footer logo is optically ≥ the header logo', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/', { waitUntil: 'load' })
    await settle(page)

    const header = await opticalHeight(page, '.chrome-logo-white')
    const footer = await opticalHeight(page, '.footer-logo')
    expect(footer!.optical).toBeGreaterThanOrEqual(header!.optical)
  })
})
