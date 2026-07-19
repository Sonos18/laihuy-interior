import { expect, test } from './fixtures'
import { settle } from './helpers'

/**
 * The hero locale-invariance gate — main.css §"Cover-hero floor" (--hero-min-h).
 *
 * ── Why this file exists ──────────────────────────────────────────────────────────────────
 *
 * A cover hero is `min-height` + an `absolute inset-0 h-full object-cover` photograph, so the
 * image's BOX height is slaved to the CONTENT height — and content height is locale-dependent
 * (the EN homepage headline wraps to 3 lines where VI takes 2). Because
 *
 *     cover scale = max(boxW / naturalW, boxH / naturalH)
 *
 * any content-driven height change rescales the photograph while the image is HEIGHT-bound.
 * That is the regression --hero-min-h exists to prevent: same image, same src, same object-fit,
 * same font-size — container height was the only variable, and switching language visibly
 * zoomed the photo (measured 1.0843 → 1.1115 at 1440×900, 1.0695 → 1.1708 at 1366×700).
 *
 * Until now that invariant was documented in a comment and protected ONLY by VR screenshots.
 * That is not protection: rebaselining is a routine, human-approved act (§41 P6), so a
 * regression introduced in the same commit as a legitimate layout change is baked into the new
 * baseline and becomes invisible. A number can tell the difference; a screenshot cannot.
 *
 * ── What is asserted ──────────────────────────────────────────────────────────────────────
 *
 * G1 · The floor BINDS: rendered hero height === computed --hero-min-h. If content ever grows
 *      past the floor, the floor stops applying and the crop becomes content-driven again.
 *      This is the invariant; G2 is its observable consequence.
 * G2 · The photograph's cover scale is identical in both locales, which is what the user sees.
 *
 * 320 is not padding of the matrix — it is the BINDING case. The floor was derived from the
 * tallest hero content measured across 320–1920 in both locales, and that maximum occurs at
 * narrow-and-EN. A gate that only ran at desktop widths would pass against a floor far too low.
 */

const WIDTHS = [
  { name: '320', width: 320, height: 844 },
  { name: '768', width: 768, height: 1024 },
  { name: '1440', width: 1440, height: 900 }
] as const

const LOCALES = ['vi', 'en'] as const

/** Tolerance for sub-pixel layout rounding across engines. The invariant is exactness; this
 *  only absorbs the fractional px a browser may report on a fractional device scale. */
const EPSILON = 1

type HeroGeometry = {
  sectionHeight: number
  floor: number
  scale: number
}

/**
 * Read the hero's geometry. The hero section is the one owning the eager `.hero-image`, found
 * from the image rather than by nth-child so a section reorder cannot silently retarget this.
 */
async function heroGeometry(page: import('@playwright/test').Page): Promise<HeroGeometry> {
  return await page.evaluate(() => {
    const img = document.querySelector<HTMLImageElement>('.hero-image')
    if (!img) throw new Error('hero image (.hero-image) not found')

    const section = img.closest('section')
    if (!section) throw new Error('.hero-image is not inside a <section>')

    const box = img.getBoundingClientRect()
    const floorRaw = getComputedStyle(section).minHeight

    return {
      sectionHeight: section.getBoundingClientRect().height,
      floor: Number.parseFloat(floorRaw),
      // The object-fit: cover scale factor actually applied to the photograph.
      scale: Math.max(box.width / img.naturalWidth, box.height / img.naturalHeight)
    }
  })
}

async function gotoHomeIn(page: import('@playwright/test').Page, locale: string) {
  // The locale is a cookie (useLanguage → useCookie('lai-huy-locale')), so it must be set
  // BEFORE navigation: SSR reads it to pick which copy is rendered, and a post-load switch
  // would measure a client-patched DOM instead of the delivered page.
  await page.context().addCookies([
    { name: 'lai-huy-locale', value: locale, url: 'http://localhost:3000' }
  ])
  await page.goto('/', { waitUntil: 'load' })
  await settle(page)
}

for (const vp of WIDTHS) {
  test(`G1 — the hero floor binds at ${vp.name} in both locales (--hero-min-h)`, async ({ page }) => {
    await page.setViewportSize({ width: vp.width, height: vp.height })

    for (const locale of LOCALES) {
      await gotoHomeIn(page, locale)
      const { sectionHeight, floor } = await heroGeometry(page)

      expect(
        sectionHeight,
        `[${locale} @ ${vp.name}] hero grew past its floor (${sectionHeight}px > ${floor}px). `
        + 'Content is now taller than --hero-min-h, so the floor no longer applies and the '
        + 'photograph\'s crop is content-driven again. Re-measure the floor — do not widen '
        + 'this tolerance.'
      ).toBeLessThanOrEqual(floor + EPSILON)
    }
  })

  test(`G2 — the hero crop is locale-independent at ${vp.name}`, async ({ page }) => {
    await page.setViewportSize({ width: vp.width, height: vp.height })

    const measured: Record<string, HeroGeometry> = {}
    for (const locale of LOCALES) {
      await gotoHomeIn(page, locale)
      measured[locale] = await heroGeometry(page)
    }

    const vi = measured.vi!
    const en = measured.en!

    expect(
      en.sectionHeight,
      `hero height differs by locale at ${vp.name} (vi ${vi.sectionHeight}px, en ${en.sectionHeight}px)`
    ).toBeCloseTo(vi.sectionHeight, 0)

    expect(
      en.scale,
      `the photograph is rescaled by switching language at ${vp.name} `
      + `(vi ${vi.scale.toFixed(4)}×, en ${en.scale.toFixed(4)}×) — this is the regression `
      + '--hero-min-h exists to prevent.'
    ).toBeCloseTo(vi.scale, 3)
  })
}
