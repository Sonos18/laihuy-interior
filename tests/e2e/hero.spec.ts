import { expect, test } from './fixtures'

/**
 * The hero locale-invariance gate — main.css §"THE hero floor" (--hero-min-h-home).
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
 * That is the regression --hero-min-h-home exists to prevent: same image, same src, same object-fit,
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
 * G1 · The floor BINDS: rendered hero height === computed --hero-min-h-home. If content ever grows
 *      past the floor, the floor stops applying and the crop becomes content-driven again.
 *      This is the invariant; G2 is its observable consequence.
 * G2 · The photograph's cover scale is identical in both locales, which is what the user sees.
 *
 * 320 is not padding of the matrix — it is the BINDING case. The floor was derived from the
 * tallest hero content measured across 320–1920 in both locales, and that maximum occurs at
 * narrow-and-EN. A gate that only ran at desktop widths would pass against a floor far too low.
 */

/**
 * Home carries the full matrix because home owns the TIERED floor (--hero-min-h-home), and a
 * tiered value can only fail at a boundary — so both boundaries are tested rather than assumed.
 */
const HOME_WIDTHS = [
  { name: '320', width: 320, height: 844 },
  { name: '360', width: 360, height: 800 },
  { name: '768', width: 768, height: 1024 },
  { name: '1440', width: 1440, height: 900 }
] as const

/**
 * The AppHero pages now share the SAME tiered floor as home (--hero-min-h-home), applied as
 * min-h == max-h. Because the section is capped at the floor, its height equals the floor at
 * every width by construction — so G1 holds trivially and there are no per-page boundaries to
 * probe; the narrowest width (content tallest, header clearance tightest) and a desktop width
 * are enough. Every navigation here costs an SSR render of an image-heavy page against a
 * single-threaded Nitro server, so the matrix is kept to what actually discriminates.
 */
const SHARED_WIDTHS = [
  { name: '320', width: 320, height: 844 },
  { name: '1440', width: 1440, height: 900 }
] as const

const LOCALES = ['vi', 'en'] as const

/**
 * The AppHero pages — home is driven separately above, on the same token but its own (tiered)
 * width matrix and its own bottom-anchored copy.
 *
 * Every one of these uses <AppHero>, which applies --hero-min-h-home as min-h AND max-h, so the
 * photograph is the same height as the homepage's on every page. min-h == max-h means G1 (the
 * floor binds) holds by construction; the gate's real work here is G2 (the crop is identical in
 * both locales). They are still enumerated because a change to the shared floor — or to any
 * page's hero copy — must be proven not to break the pages home does not resemble, which is the
 * trap the homepage work originally walked into.
 */
const COVER_PAGES = [
  { name: 'projects', path: '/du-an' },
  { name: 'project-detail', path: '/du-an/khach-san-eo-gio' },
  { name: 'factory', path: '/nha-xuong' },
  { name: 'services', path: '/dich-vu' },
  { name: 'about', path: '/gioi-thieu' },
  { name: 'careers', path: '/tuyen-dung' },
  { name: 'contact', path: '/lien-he' }
] as const

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

    // Intrinsic size from the DECLARED width/height attributes, not naturalWidth/naturalHeight.
    // Both describe the same master asset, but naturalWidth is 0 until the bytes arrive from
    // Supabase — which made every measurement depend on a remote host, for a gate that is pure
    // layout. The attributes are present in the SSR markup, so this reads correctly the instant
    // the DOM exists. (These attributes are also what the browser uses to reserve the box, so
    // they are the values actually driving the layout being asserted.)
    const naturalW = Number(img.getAttribute('width'))
    const naturalH = Number(img.getAttribute('height'))
    if (!naturalW || !naturalH) {
      throw new Error('hero image is missing width/height attributes — CLS risk, and this gate '
        + 'cannot compute the cover scale without them')
    }

    return {
      sectionHeight: section.getBoundingClientRect().height,
      floor: Number.parseFloat(floorRaw),
      // The object-fit: cover scale factor actually applied to the photograph.
      scale: Math.max(box.width / naturalW, box.height / naturalH)
    }
  })
}

/**
 * Drop every image request before it leaves the browser.
 *
 * This gate measures layout, and after switching the intrinsic size to the declared width/height
 * attributes it does not read a single pixel — so every image on these pages is pure cost. And
 * the cost was not small: each navigation fans out into hundreds of requests to the remote
 * Supabase media host, and because the two locales are loaded back to back, the second
 * navigation was queuing behind the first page's still-in-flight image downloads. That is what
 * produced 120s `page.goto` timeouts on /gioi-thieu and /du-an while the server itself was
 * answering those same routes in 20-35ms (measured with curl).
 *
 * Aborting them cannot affect the assertions: the boxes are reserved by the width/height
 * attributes and CSS, which is precisely why those attributes are mandatory (FG-15, CLS).
 */
async function blockImages(page: import('@playwright/test').Page) {
  await page.route(
    /\.(png|jpe?g|webp|avif|gif|svg)(\?|$)/i,
    route => route.abort()
  )
}

async function gotoIn(page: import('@playwright/test').Page, path: string, locale: string) {
  // The locale is a cookie (useLanguage → useCookie('lai-huy-locale')), so it must be set
  // BEFORE navigation: SSR reads it to pick which copy is rendered, and a post-load switch
  // would measure a client-patched DOM instead of the delivered page.
  await page.context().addCookies([
    { name: 'lai-huy-locale', value: locale, url: 'http://localhost:3000' }
  ])
  // `domcontentloaded`, NOT `load`: `load` blocks on every subresource on the page, including
  // the dozens of below-the-fold Supabase-hosted images this gate never looks at. That wait —
  // not the assertions — is what made the suite take 9 minutes and time out under its own load.
  // settleHero() below waits on the two things that actually decide the geometry, so waiting
  // for `load` first is redundant as well as slow.
  await page.goto(path, { waitUntil: 'domcontentloaded' })
  await settleHero(page)
}

/**
 * Deterministic wait for the two inputs this gate actually measures — deliberately NOT the
 * VR suite's `settle()`.
 *
 * `settle()` forces EVERY image on the page to `loading="eager"` and blocks until all of them
 * arrive. That is correct for a pixel capture, and wrong here: this gate reads layout geometry,
 * so the only image it needs is the hero's, and the rest are hundreds of Supabase round-trips
 * per run. Using it made the suite take 9.9 minutes and time out 4 of 56 tests under its own
 * load — tests that pass in isolation. §41 P8: flake is fixed by determinism, not by retrying,
 * so the wait is narrowed to its real dependencies rather than the timeout being raised.
 *
 * What geometry actually depends on:
 *   · fonts   — text metrics decide how many lines the headline wraps to, which IS the measure
 *   · the hero image — naturalWidth/Height are 0 until it decodes, and G2 divides by them
 *
 * Reveal state is deliberately not handled: the fixture emulates reduced motion, and
 * plugins/reveal.ts only adds `reveal-ready` (the class that hides anything) when motion is
 * ALLOWED. Under this harness every revealed element is already at its final position.
 */
async function settleHero(page: import('@playwright/test').Page) {
  await page.waitForSelector('.hero-image', { state: 'attached' })
  // Fonts, and only fonts. Text metrics decide how many lines the headline wraps to, and that
  // wrap count IS the thing being measured — everything else on the page is irrelevant here.
  await page.evaluate(() => document.fonts.ready)
  await page.evaluate(() => window.scrollTo(0, 0))
}

/**
 * G1 and G2 share one test per case ON PURPOSE, rather than reading as two.
 *
 * They assert different things but need the SAME two page loads (one per locale), and a
 * navigation here is an SSR render of an image-heavy page against a single-threaded Nitro
 * server — by far the dominant cost. Split, the suite paid for all of them twice: 9 minutes,
 * with 4 of 56 tests exceeding the 120s timeout under load while passing in isolation.
 * Merged, the navigation count halves and each case is measured exactly once.
 *
 * They are also not independent in practice: G2 (crop is locale-stable) is the user-visible
 * SYMPTOM, G1 (the floor binds) is the mechanism. G1 failing explains G2 failing, so reporting
 * them from one place loses nothing — the assertion messages still say which invariant broke.
 */
function heroGate(cover: { name: string, path: string }, vp: { name: string, width: number, height: number }) {
  test(`${cover.name} @ ${vp.name} — floor binds (G1) and crop is locale-independent (G2)`, async ({ page }) => {
    await blockImages(page)
    await page.setViewportSize({ width: vp.width, height: vp.height })

    const measured: Record<string, HeroGeometry> = {}
    for (const locale of LOCALES) {
      await gotoIn(page, cover.path, locale)
      measured[locale] = await heroGeometry(page)

      // G1 — the mechanism. Asserted per locale, because the floor can stop binding in one
      // locale while still holding in the other; that asymmetry IS the bug.
      const { sectionHeight, floor } = measured[locale]!
      expect(
        sectionHeight,
        `[G1 · ${cover.name} ${locale} @ ${vp.name}] hero grew past its floor `
        + `(${sectionHeight}px > ${floor}px). Content is now taller than the floor, so the `
        + 'floor no longer applies and the photograph\'s crop is content-driven again. '
        + 'Re-measure the floor — do not widen this tolerance.'
      ).toBeLessThanOrEqual(floor + EPSILON)
    }

    const vi = measured.vi!
    const en = measured.en!

    // G2 — the symptom.
    expect(
      en.sectionHeight,
      `[G2 · ${cover.name}] hero height differs by locale at ${vp.name} `
      + `(vi ${vi.sectionHeight}px, en ${en.sectionHeight}px)`
    ).toBeCloseTo(vi.sectionHeight, 0)

    expect(
      en.scale,
      `[G2 · ${cover.name}] the photograph is rescaled by switching language at ${vp.name} `
      + `(vi ${vi.scale.toFixed(4)}×, en ${en.scale.toFixed(4)}×) — this is the regression `
      + 'the cover-hero floor exists to prevent.'
    ).toBeCloseTo(vi.scale, 3)
  })
}

for (const vp of HOME_WIDTHS) {
  heroGate({ name: 'home', path: '/' }, vp)
}

for (const cover of COVER_PAGES) {
  for (const vp of SHARED_WIDTHS) {
    heroGate(cover, vp)
  }
}
