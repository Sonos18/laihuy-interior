import type { Page } from '@playwright/test'
import { expect, test } from './fixtures'
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

        const surfaces = await page.evaluate(() => {
          const parse = (value: string): number[] | null => {
            const match = value.match(/^(?:rgba?|color)\(([^)]+)\)$/)
            if (!match) return null
            const parts = match[1]!.replace('srgb', '').split(/[,/\s]+/).filter(Boolean).map(Number)
            const scale = value.startsWith('color(') ? 255 : 1
            return [parts[0]! * scale, parts[1]! * scale, parts[2]! * scale, parts[3] ?? 1]
          }
          // Composite translucent layers up the tree until an opaque one, so a tinted surface is
          // judged by what the reader sees.
          const background = (el: Element): number[] => {
            const layers: number[][] = []
            let current: Element | null = el
            while (current) {
              const layer = parse(getComputedStyle(current).backgroundColor)
              if (layer && layer[3]! > 0) {
                layers.push(layer)
                if (layer[3] === 1) break
              }
              current = current.parentElement
            }
            let result = [255, 255, 255]
            for (const [r, g, b, a] of layers.reverse()) {
              result = [r! * a! + result[0]! * (1 - a!), g! * a! + result[1]! * (1 - a!), b! * a! + result[2]! * (1 - a!)]
            }
            return result
          }
          const channel = (c: number) => {
            const v = c / 255
            return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
          }
          const luminanceOf = (el: Element) => {
            const [r, g, b] = background(el)
            return 0.2126 * channel(r!) + 0.7152 * channel(g!) + 0.0722 * channel(b!)
          }
          return [...document.querySelectorAll('main section')]
            .filter(el => !el.closest('.app-hero'))
            .map(el => ({
              label: `${el.tagName.toLowerCase()}.${String(el.className).slice(0, 40)}`,
              luminance: luminanceOf(el)
            }))
        })

        expect(surfaces.length).toBeGreaterThan(0)
        for (const surface of surfaces) {
          // Sawdust, the darkest allowed band, measures about 0.78.
          expect(surface.luminance, `${surface.label} background is a dark band`).toBeGreaterThanOrEqual(0.7)
        }
        // At most one Sawdust emphasis band per page.
        expect(surfaces.filter(surface => surface.luminance < 0.85).length).toBeLessThanOrEqual(1)
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

        const offenders = await page.evaluate(() => {
          const corners = [
            'borderTopLeftRadius',
            'borderTopRightRadius',
            'borderBottomRightRadius',
            'borderBottomLeftRadius'
          ] as const
          const found: string[] = []
          for (const el of document.querySelectorAll('main *')) {
            if (el.closest('.app-hero')) continue
            const style = getComputedStyle(el)
            for (const corner of corners) {
              const raw = style[corner]
              const value = parseFloat(raw)
              const pill = raw.endsWith('%') ? value >= 50 : value >= 9000
              if (!pill && value > 4) {
                found.push(`${el.tagName.toLowerCase()}.${String(el.className).slice(0, 60)} ${corner}=${raw}`)
              }
            }
          }
          return found
        })

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
      await idle.click()
      await expect(idle).toHaveAttribute('aria-pressed', 'true')
      await expect(idle).toHaveCSS('background-color', 'rgb(24, 22, 20)')
      expect(await page.locator('main .grid.gap-7 > a').count()).toBeLessThan(11)
    })

    test(`WARM-06 project cards follow the card spec (projects ${locale} @ ${width})`, async ({ page }) => {
      await open(page, ROUTES.find(route => route.name === 'projects')!, locale, width)

      const card = page.locator('main .grid.gap-7 > a').first()
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
})
