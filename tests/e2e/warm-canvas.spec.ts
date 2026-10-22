import type { Page } from '@playwright/test'
import { expect, test } from './fixtures'
import { MIN_SURFACE_LUMINANCE, SAWDUST_CEILING_LUMINANCE, nonEdgeRadii, surfaceLuminances } from './helpers/warm-surfaces'
import { APP_ORIGIN } from './origin'

/**
 * WARM: the remaining interior routes sit on the warm-light canvas (DESIGN.md, Warm Light Rule).
 *
 * /tuyen-dung, /lien-he, /du-an, the legal pages and the error shell share one contract below
 * their hero: no dark band, headings in Outfit 500 sentence case, nothing under 12px, 4px edges
 * for content (pills only for controls) and the bronze primary action with its Deep Timber edge.
 * /nha-xuong has the same block in factory-proof-first.spec.ts (FX-WARM).
 */

const TEST_ORIGIN = process.env.DENSITY_TEST_ORIGIN ?? APP_ORIGIN
const TRANSPARENT_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M/wHwAF/gL+X9j7WQAAAABJRU5ErkJggg==',
  'base64'
)

type Route = {
  name: string
  path: string
  /** Minimum h1/h2/h3 outside the hero, so the heading assertions cannot pass on an empty set. */
  minHeadings: number
  /** The primary action, when the route has one. */
  primary?: string
  /** The shell answers with a status, not 200. */
  status?: number
}

const ROUTES: Route[] = [
  { name: 'careers', path: '/tuyen-dung', minHeadings: 7, primary: '[data-testid="careers-apply"]' },
  { name: 'contact', path: '/lien-he', minHeadings: 7, primary: '[data-testid="contact-form"] button[type="submit"]' },
  { name: 'projects', path: '/du-an', minHeadings: 12, primary: '[data-testid="projects-cta"]' },
  { name: 'privacy', path: '/privacy-policy', minHeadings: 3 },
  { name: 'terms', path: '/terms-of-use', minHeadings: 3 },
  { name: 'error', path: '/this-route-does-not-exist', minHeadings: 4, primary: 'main#main button.btn-bronze', status: 404 }
]

const WIDTHS = [768, 1440] as const

async function open(page: Page, route: Route, locale: 'vi' | 'en', width: number) {
  await page.context().addCookies([
    { name: 'lai-huy-locale', value: locale, url: TEST_ORIGIN }
  ])
  await page.route('**/*', async (handler) => {
    if (handler.request().resourceType() === 'image') {
      await handler.fulfill({ status: 200, contentType: 'image/png', body: TRANSPARENT_PNG })
      return
    }
    await handler.continue()
  })
  await page.route('https://maps.google.com/**', async (handler) => {
    await handler.fulfill({ status: 200, contentType: 'text/html', body: '<!doctype html><title>Map unavailable in test</title>' })
  })
  await page.setViewportSize({ width, height: 900 })
  const response = await page.goto(route.path, { waitUntil: 'load' })
  expect(response?.status()).toBe(route.status ?? 200)
  await page.evaluate(() => document.fonts.ready)
}

for (const route of ROUTES) {
  for (const locale of ['vi', 'en'] as const) {
    for (const width of WIDTHS) {
      const tag = `${route.name} ${locale} @ ${width}`

      test(`WARM-01 no dark band ${tag}`, async ({ page }) => {
        await open(page, route, locale, width)

        const surfaces = await surfaceLuminances(page, 'main section', { skipHero: true })

        expect(surfaces.length).toBeGreaterThan(0)
        for (const surface of surfaces) {
          expect(surface.luminance, `${surface.label} background is a dark band`).toBeGreaterThanOrEqual(MIN_SURFACE_LUMINANCE)
        }
        // At most one Sawdust emphasis band per page.
        expect(surfaces.filter(surface => surface.luminance < SAWDUST_CEILING_LUMINANCE).length).toBeLessThanOrEqual(1)
      })

      test(`WARM-02 headings and type ${tag}`, async ({ page }) => {
        await open(page, route, locale, width)

        const result = await page.evaluate(() => {
          const outside = (el: Element) => !el.closest('.app-hero')
          const typeOf = (el: Element) => {
            const style = getComputedStyle(el)
            return {
              text: (el.textContent ?? '').trim().slice(0, 40),
              weight: style.fontWeight,
              transform: style.textTransform,
              family: style.fontFamily
            }
          }
          const headings = [...document.querySelectorAll('main h1, main h2, main h3')].filter(outside).map(typeOf)
          const heavy = [...document.querySelectorAll('main *')]
            .filter(outside)
            .filter(el => getComputedStyle(el).fontWeight === '900')
            .map(el => `${el.tagName.toLowerCase()}: ${(el.textContent ?? '').trim().slice(0, 30)}`)
          const smallest = [...document.querySelectorAll('main *')]
            .filter(outside)
            .filter(el => el.children.length === 0 && (el.textContent ?? '').trim() !== '')
            .map(el => ({
              text: (el.textContent ?? '').trim().slice(0, 30),
              size: parseFloat(getComputedStyle(el).fontSize)
            }))
          return { headings, heavy, smallest }
        })

        expect(result.headings.length).toBeGreaterThanOrEqual(route.minHeadings)
        for (const heading of result.headings) {
          expect(heading.weight, heading.text).toBe('500')
          expect(heading.transform, heading.text).toBe('none')
          expect(heading.family, heading.text).toContain('Outfit')
        }
        expect(result.heavy).toEqual([])
        for (const item of result.smallest) {
          expect(item.size, item.text).toBeGreaterThanOrEqual(12)
        }
      })

      test(`WARM-03 radii ${tag}`, async ({ page }) => {
        await open(page, route, locale, width)

        const offenders = await nonEdgeRadii(page)

        expect(offenders).toEqual([])
      })

      if (route.primary) {
        test(`WARM-04 actions ${tag}`, async ({ page }) => {
          await open(page, route, locale, width)

          const primary = page.locator(route.primary!)
          await expect(primary).toHaveCount(1)
          await expect(primary).toHaveClass(/\bbtn-bronze\b/)
          // Bronze Edge Rule: on a light surface the bronze fill carries the Deep Timber border.
          await expect(primary).toHaveCSS('border-top-color', 'rgb(124, 80, 50)')
        })
      }
    }
  }
}

for (const locale of ['vi', 'en'] as const) {
  for (const width of WIDTHS) {
    test(`WARM-05 filter chips follow DESIGN.md Chips (projects ${locale} @ ${width})`, async ({ page }) => {
      await open(page, ROUTES.find(route => route.name === 'projects')!, locale, width)

      const chips = page.locator('main button[aria-pressed]')
      const count = await chips.count()
      expect(count).toBeGreaterThan(1)

      // Active chip: Charcoal Ink fill, Linen text, pill, 44px hit target.
      const active = chips.first()
      await expect(active).toHaveAttribute('aria-pressed', 'true')
      await expect(active).toHaveCSS('background-color', 'rgb(24, 22, 20)')
      await expect(active).toHaveCSS('color', 'rgb(250, 246, 240)')
      // Idle chip: Plaster border, Walnut Grey text, no fill.
      const idle = chips.nth(1)
      await expect(idle).toHaveAttribute('aria-pressed', 'false')
      await expect(idle).toHaveCSS('border-top-color', 'rgb(216, 210, 202)')
      await expect(idle).toHaveCSS('color', 'rgb(93, 83, 73)')
      await expect(idle).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)')
      for (const chip of [active, idle]) {
        const box = await chip.boundingBox()
        expect(box!.height).toBeGreaterThanOrEqual(44)
        // A pill resolves to a huge radius (Chrome reports it in exponent form).
        expect(await chip.evaluate(el => parseFloat(getComputedStyle(el).borderTopLeftRadius))).toBeGreaterThanOrEqual(9000)
      }

      // Selecting a chip moves the active state to it and filters the grid.
      const cards = page.locator('[data-testid="projects-grid"] > a')
      const unfilteredCount = await cards.count()
      expect(unfilteredCount).toBeGreaterThan(1)
      await idle.click()
      await expect(idle).toHaveAttribute('aria-pressed', 'true')
      await expect(idle).toHaveCSS('background-color', 'rgb(24, 22, 20)')
      await expect.poll(() => cards.count()).toBeLessThan(unfilteredCount)
      expect(await cards.count()).toBeGreaterThan(0)
    })

    test(`WARM-06 project cards follow the card spec (projects ${locale} @ ${width})`, async ({ page }) => {
      await open(page, ROUTES.find(route => route.name === 'projects')!, locale, width)

      const card = page.locator('[data-testid="projects-grid"] > a').first()
      await expect(card).toHaveCSS('background-color', 'rgb(255, 255, 255)')
      await expect(card).toHaveCSS('border-top-color', 'rgb(216, 210, 202)')
      await expect(card).toHaveCSS('border-top-left-radius', '4px')
      // Rest lift is the last layer; Tailwind prepends its empty ring/shadow layers.
      await expect(card).toHaveCSS('box-shadow', /rgba\(11, 10, 9, 0\.04\) 0px 2px 8px 0px$/)
    })

    test(`WARM-07 form fields follow DESIGN.md Inputs (contact ${locale} @ ${width})`, async ({ page }) => {
      await open(page, ROUTES.find(route => route.name === 'contact')!, locale, width)

      const fields = page.locator('[data-testid="contact-form"] :is(input, select, textarea)')
      expect(await fields.count()).toBe(5)
      for (const field of await fields.all()) {
        await expect(field).toHaveCSS('background-color', 'rgb(255, 255, 255)')
        await expect(field).toHaveCSS('border-top-color', 'rgb(216, 210, 202)')
        await expect(field).toHaveCSS('border-top-width', '1px')
        await expect(field).toHaveCSS('border-top-left-radius', '4px')
        await expect(field).toHaveCSS('font-size', '16px')
        await expect(field).toHaveCSS('padding-top', '12px')
        await expect(field).toHaveCSS('padding-left', '16px')
      }
      const labels = page.locator('[data-testid="contact-form"] label')
      for (const label of await labels.all()) {
        await expect(label).toHaveCSS('font-size', '14px')
        await expect(label).toHaveCSS('font-weight', '700')
      }

      // Focus: Mid Timber border. Error: Kiln Red border and a Deep Kiln Red message.
      await page.locator('#contact-name').focus()
      await expect(page.locator('#contact-name')).toHaveCSS('border-top-color', 'rgb(155, 106, 67)')

      await page.click('[data-testid="contact-form"] button[type="submit"]')
      const email = page.locator('#contact-email')
      await expect(email).toHaveCSS('border-top-color', 'rgb(178, 60, 42)')
      const message = page.locator('#contact-email-error')
      await expect(message).toHaveCSS('color', 'rgb(138, 46, 31)')
      await expect(message).toHaveCSS('font-size', '14px')
      await expect(message).toHaveCSS('font-weight', '600')
    })
  }
}

test('WARM-08 legal pages pin the header to its navigation chrome and release it on leaving', async ({ page }) => {
  await open(page, ROUTES.find(route => route.name === 'privacy')!, 'vi', 1440)

  const header = page.locator('header.app-header')
  await expect(header).toHaveAttribute('data-chrome-state', 'nav')

  await page.locator('header.app-header a[href="/"]').first().click()
  await page.waitForURL(`${TEST_ORIGIN}/`)
  await expect(header).toHaveAttribute('data-chrome-state', 'cover')
  // Unhead removed the pin with the page that set it: nothing may stay behind to force the next
  // cover into NAVIGATION.
  await expect(page.locator('html')).not.toHaveAttribute('data-chrome-solid', /.*/)
})

// The pre-hydration pin: the SSR HTML must already paint the header in NAVIGATION on a route
// whose masthead is light. With JavaScript off nothing ever hydrates, so this is also what the
// visitor keeps seeing. Runs at 1440 so the desktop nav row is rendered.
for (const route of ROUTES.filter(({ name }) => ['privacy', 'terms', 'error'].includes(name))) {
  test(`WARM-08 ${route.name} paints the header in navigation chrome without JavaScript`, async ({ browser }) => {
    const context = await browser.newContext({
      javaScriptEnabled: false,
      viewport: { width: 1440, height: 900 },
      reducedMotion: 'reduce'
    })
    try {
      await context.addCookies([{ name: 'lai-huy-locale', value: 'vi', url: TEST_ORIGIN }])
      const page = await context.newPage()
      const response = await page.goto(`${TEST_ORIGIN}${route.path}`, { waitUntil: 'load' })
      expect(response?.status()).toBe(route.status ?? 200)

      await expect(page.locator('html')).toHaveAttribute('data-chrome-solid', '')
      const header = page.locator('header.app-header')
      await expect(header).toHaveCSS('--header-p', '1')
      // NAVIGATION chrome: the coloured logo is shown and the white one is gone.
      await expect(header.locator('.chrome-logo-ink')).toHaveCSS('opacity', '1')
      await expect(header.locator('.chrome-logo-white')).toHaveCSS('opacity', '0')
      // Dark nav text, not the light-on-scrim colour (--fg-dark-muted is white at 72%).
      // color-mix() serialises as oklab(L a b) in Chromium; plain colours as rgb(). Either way the
      // dark nav is a low lightness, the white-on-scrim cover colour a high one.
      const lightness = async (selector: string) => {
        const color = await header.locator(selector).first().evaluate(el => getComputedStyle(el).color)
        const [first, second, third] = color.match(/[\d.]+/g)!.map(Number)
        return color.startsWith('oklab(') ? first! : Math.max(first!, second!, third!) / 255
      }
      expect(await lightness('.nav-link'), 'nav link must be dark').toBeLessThan(0.6)
      // The VI/EN toggle is told its surface by client state; the first paint must already be dark.
      expect(await lightness('.lang-option[aria-pressed="true"]'), 'language toggle must be dark').toBeLessThan(0.6)
    } finally {
      await context.close()
    }
  })
}

test('WARM-08 no header transition runs while a legal page hydrates', async ({ page }) => {
  // Motion on: reduced-motion would switch the transitions off and make this vacuous.
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.context().addCookies([{ name: 'lai-huy-locale', value: 'vi', url: TEST_ORIGIN }])
  await page.addInitScript(() => {
    const seen: string[] = []
    ;(window as unknown as { __headerTransitions: string[] }).__headerTransitions = seen
    const record = (event: Event) => {
      const target = event.target as Element | null
      if (target?.closest?.('.app-header')) seen.push(`${event.type}:${(event as TransitionEvent).propertyName}:${String((target as Element).className)}`)
    }
    document.addEventListener('transitionrun', record, true)
    document.addEventListener('transitionstart', record, true)
  })
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto(`${TEST_ORIGIN}/privacy-policy`, { waitUntil: 'load' })
  await expect(page.locator('header.app-header')).toHaveAttribute('data-chrome-state', 'nav')
  // Give a late transition (started by the post-hydration write) room to appear.
  await page.waitForTimeout(600)

  const seen = await page.evaluate(() => (window as unknown as { __headerTransitions: string[] }).__headerTransitions)
  expect(seen).toEqual([])
})

test('WARM-08 privacy to terms keeps navigation chrome, back to home restores the cover', async ({ page }) => {
  await open(page, ROUTES.find(route => route.name === 'privacy')!, 'vi', 1440)

  const header = page.locator('header.app-header')
  const html = page.locator('html')
  await expect(header).toHaveAttribute('data-chrome-state', 'nav')
  await expect(html).toHaveAttribute('data-chrome-solid', '')

  // Privacy -> terms through the footer: both pin, so the header must stay in NAVIGATION.
  await page.locator('footer a[href="/terms-of-use"]').first().click()
  await page.waitForURL(`${TEST_ORIGIN}/terms-of-use`)
  await expect(header).toHaveAttribute('data-chrome-state', 'nav')
  await expect(html).toHaveAttribute('data-chrome-solid', '')

  // Back to privacy (browser history), then home through the logo.
  await page.goBack()
  await page.waitForURL(`${TEST_ORIGIN}/privacy-policy`)
  await expect(header).toHaveAttribute('data-chrome-state', 'nav')

  await page.locator('header.app-header a[href="/"]').first().click()
  await page.waitForURL(`${TEST_ORIGIN}/`)
  await expect(header).toHaveAttribute('data-chrome-state', 'cover')
  await expect(html).not.toHaveAttribute('data-chrome-solid', /.*/)
  await expect(header).toHaveCSS('--header-p', '0')
})
