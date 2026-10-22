import type { Page } from '@playwright/test'
import {
  serviceCoreIds,
  serviceProgrammeIds,
  servicesMediaAlt,
  servicesPageContent
} from '../../app/data/services-page'
import { services } from '../../app/data/services'
import { expect, test } from './fixtures'
import { APP_ORIGIN } from './origin'

const TEST_ORIGIN = process.env.DENSITY_TEST_ORIGIN ?? APP_ORIGIN
const TRANSPARENT_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M/wHwAF/gL+X9j7WQAAAABJRU5ErkJggg==',
  'base64'
)
const locales = ['vi', 'en'] as const
const chapterOrder = [
  'promise',
  'documents',
  'journey',
  'proof',
  'evidence',
  'programmes',
  'contact'
] as const

async function openServices(
  page: Page,
  locale: typeof locales[number],
  width = 1440
) {
  await page.context().addCookies([
    { name: 'lai-huy-locale', value: locale, url: TEST_ORIGIN }
  ])
  await page.route('**/*', async (route) => {
    if (route.request().resourceType() === 'image') {
      await route.fulfill({
        status: 200,
        contentType: 'image/png',
        body: TRANSPARENT_PNG
      })
      return
    }
    await route.continue()
  })
  await page.setViewportSize({ width, height: 900 })
  await page.goto(new URL('/dich-vu', TEST_ORIGIN).toString(), { waitUntil: 'load' })
  await page.evaluate(() => document.fonts.ready)
}

const columnCount = (locator: ReturnType<Page['getByTestId']>) =>
  locator.evaluate(element =>
    getComputedStyle(element).gridTemplateColumns.trim().split(/\s+/).filter(Boolean).length
  )

for (const locale of locales) {
  test(`services renders the approved delivery journey in ${locale}`, async ({ page }) => {
    await openServices(page, locale)

    const chapters = page.locator('main [data-services-chapter]')
    await expect(chapters).toHaveCount(7)
    expect(await chapters.evaluateAll(elements =>
      elements.map(element => element.getAttribute('data-services-chapter'))
    )).toEqual(chapterOrder)

    const hero = page.locator('[data-services-chapter="promise"]')
    await expect(hero.locator('h1')).toContainText(servicesPageContent.hero.title[locale])
    await expect(hero.locator('h1')).toContainText(servicesPageContent.hero.specialTitle[locale])
    await expect(hero.getByText(servicesPageContent.hero.subtitle[locale], { exact: true }))
      .toHaveCount(1)

    await expect(page.getByRole('heading', {
      name: servicesPageContent.documents.title[locale],
      exact: true
    })).toHaveCount(1)
    await expect(page.getByRole('heading', {
      name: servicesPageContent.journey.title[locale],
      exact: true
    })).toHaveCount(1)
    await expect(page.getByRole('heading', {
      name: servicesPageContent.proof.title[locale],
      exact: true
    })).toHaveCount(1)
    await expect(page.getByRole('heading', {
      name: servicesPageContent.programmes.title[locale],
      exact: true
    })).toHaveCount(1)
    await expect(page.getByRole('heading', {
      name: servicesPageContent.contact.title[locale],
      exact: true
    })).toHaveCount(1)
  })

  test(`services uses canonical service content and links in ${locale}`, async ({ page }) => {
    await openServices(page, locale)

    const orderedIds = [...serviceCoreIds, ...serviceProgrammeIds]
    const renderedServices = page.locator('[data-testid="services-core-stage"], [data-testid="services-programme"]')
    await expect(renderedServices).toHaveCount(6)

    for (const [index, id] of orderedIds.entries()) {
      const service = services.find(item => item.id === id)!
      const rendered = renderedServices.nth(index)
      await expect(rendered).toHaveAttribute('id', id)
      await expect(rendered.getByTestId('services-sequence'))
        .toHaveText(String(index + 1).padStart(2, '0'))
      await expect(rendered.getByRole('heading')).toHaveText(service.title[locale])
      await expect(rendered.getByText(service.description[locale], { exact: true })).toHaveCount(1)
      for (const detail of service.details[locale]) {
        await expect(rendered.getByText(detail, { exact: true })).toHaveCount(1)
      }
    }

    const coreMediaAlt = [
      servicesMediaAlt.design[locale],
      servicesMediaAlt.quality[locale],
      servicesMediaAlt.construction[locale]
    ]
    for (const [index, alt] of coreMediaAlt.entries()) {
      const stageImage = page.getByTestId('services-core-stage').nth(index).locator('img')
      await expect(stageImage).toHaveCount(1)
      await expect(stageImage).toHaveAttribute('alt', alt)
    }

    const documents = page.locator('[data-services-chapter="documents"]')
    await expect(documents.locator('a[href="/lien-he"]')).toHaveCount(1)
    await expect(documents.locator('a[href="#delivery-journey"]')).toHaveCount(1)

    const proof = page.locator('[data-services-chapter="proof"]')
    await expect(proof.locator('a[href="/nha-xuong"]')).toHaveCount(1)
    await expect(proof.locator('img')).toHaveCount(1)

    const evidence = page.locator('[data-services-chapter="evidence"]')
    await expect(evidence.locator('img')).toHaveCount(4)

    const contact = page.locator('[data-services-chapter="contact"]')
    await expect(contact.locator('a[href="/lien-he"]')).toHaveCount(1)
    await expect(contact.locator('a[href="tel:+84903102012"]')).toHaveCount(1)
    await expect(contact).not.toContainText(/đã gửi|đã nhận|gửi thành công|sent successfully|received/i)
    await expect(page.locator('main input[type="file"]')).toHaveCount(0)
    await expect(page.locator('main form')).toHaveCount(0)
  })
}

for (const locale of locales) {
  for (const width of [390, 767, 768, 1279, 1280, 1440] as const) {
    test(`services responsive contract in ${locale} at ${width}`, async ({ page }) => {
      await openServices(page, locale, width)

      const overflow = await page.evaluate(() =>
        Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth
      )
      expect(overflow).toBeLessThanOrEqual(1)

      expect(await columnCount(page.getByTestId('services-document-layout')))
        .toBe(width >= 768 ? 2 : 1)
      expect(await columnCount(page.getByTestId('services-journey-layout')))
        .toBe(1)
      expect(await columnCount(page.getByTestId('services-core-stage').first()))
        .toBe(width >= 1280 ? 2 : 1)
      expect(await columnCount(page.getByTestId('services-proof-grid')))
        .toBe(width >= 768 ? 2 : 1)
      expect(await columnCount(page.getByTestId('services-evidence-grid')))
        .toBe(width >= 768 ? 4 : 2)
      expect(await columnCount(page.getByTestId('services-programme-row').first()))
        .toBe(width >= 768 ? 4 : 1)
    })
  }
}

test('services preserves SEO, focus and reduced-motion behavior', async ({ page }) => {
  await openServices(page, 'vi', 390)

  await expect(page.locator('html')).toHaveAttribute('lang', 'vi')
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /\/dich-vu$/)
  expect(await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches)).toBe(true)

  const revealStates = await page.locator('main .reveal').evaluateAll(elements =>
    elements.map((element) => {
      const style = getComputedStyle(element)
      return {
        opacity: style.opacity,
        transform: style.transform,
        visibility: style.visibility
      }
    })
  )
  expect(revealStates.length).toBeGreaterThan(0)
  for (const state of revealStates) {
    expect(state).toEqual({
      opacity: '1',
      transform: 'none',
      visibility: 'visible'
    })
  }

  const servicesJsonLd = await page.locator('script[type="application/ld+json"]').evaluateAll(scripts =>
    scripts.flatMap((script) => {
      try {
        const value = JSON.parse(script.textContent ?? 'null')
        return Array.isArray(value) ? value : [value]
      } catch {
        return []
      }
    }).find(entry => entry?.['@type'] === 'CollectionPage')
  )
  expect(servicesJsonLd?.mainEntity?.['@type']).toBe('ItemList')
  expect(servicesJsonLd?.mainEntity?.numberOfItems).toBe(6)
  expect(servicesJsonLd?.mainEntity?.itemListElement.map(
    (entry: { item: { name: string } }) => entry.item.name
  )).toEqual(services.map(service => service.title.vi))

  const contactLink = page.locator('[data-services-chapter="contact"] a[href="/lien-he"]')
  await contactLink.focus()
  await expect(contactLink).toBeFocused()
})

test('services programme rows lift on hover and the page closes on a light CTA before the dark footer', async ({ page }) => {
  await openServices(page, 'vi', 1440)

  const programme = page.getByTestId('services-programme').first()
  const rest = await programme.evaluate(element => ({
    background: getComputedStyle(element).backgroundColor,
    border: getComputedStyle(element).borderTopColor,
    shadow: getComputedStyle(element).boxShadow
  }))
  expect(rest.background).toBe('rgb(255, 255, 255)')

  await programme.hover()
  // The card keeps its Paper White surface; only the border darkens and the hover lift appears.
  await expect(programme).toHaveCSS('background-color', 'rgb(255, 255, 255)')
  await expect.poll(() => programme.evaluate(element => getComputedStyle(element).borderTopColor))
    .not.toBe(rest.border)
  await expect.poll(() => programme.evaluate(element => getComputedStyle(element).boxShadow))
    .not.toBe(rest.shadow)
  await expect(programme.getByRole('heading')).toHaveCSS('color', 'rgb(11, 10, 9)')

  await page.mouse.move(0, 0)
  const programmeLink = programme.getByRole('link')
  await programmeLink.focus()
  await expect(programmeLink).toBeFocused()
  await expect(programme).toHaveCSS('background-color', 'rgb(255, 255, 255)')

  const contact = page.locator('[data-services-chapter="contact"]')
  expect(await contact.evaluate(element => getComputedStyle(element).backgroundColor))
    .toBe('rgb(250, 246, 240)')
  expect(await page.locator('footer').evaluate(element => getComputedStyle(element).backgroundColor))
    .toBe('rgb(11, 10, 9)')
})

// ─────────────────────────────────────────────────────────────────────────────
// SV-WARM: /dich-vu sits on the warm-light canvas below the hero (DESIGN.md, Warm Light Rule).
// Obsidian lives behind the hero photograph and in the footer only.
// ─────────────────────────────────────────────────────────────────────────────

const WARM_WIDTHS = [768, 1440] as const

for (const locale of locales) {
  for (const width of WARM_WIDTHS) {
    const tag = `${locale} @ ${width}`

    test(`SV-WARM-01 no dark band ${tag}`, async ({ page }) => {
      await openServices(page, locale, width)

      // Composite translucent layers up the tree until an opaque one, so a tinted surface is
      // judged by what the reader sees.
      const surfaces = await page.evaluate(() => {
        const parse = (value: string): number[] | null => {
          const match = value.match(/^(?:rgba?|color)\(([^)]+)\)$/)
          if (!match) return null
          const parts = match[1]!.replace('srgb', '').split(/[,/\s]+/).filter(Boolean).map(Number)
          const scale = value.startsWith('color(') ? 255 : 1
          return [parts[0]! * scale, parts[1]! * scale, parts[2]! * scale, parts[3] ?? 1]
        }
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
        return [...document.querySelectorAll('main [data-services-chapter]:not([data-services-chapter="promise"])')]
          .map((el) => {
            const [r, g, b] = background(el)
            return {
              name: el.getAttribute('data-services-chapter'),
              luminance: 0.2126 * channel(r!) + 0.7152 * channel(g!) + 0.0722 * channel(b!)
            }
          })
      })

      expect(surfaces.map(surface => surface.name)).toEqual(chapterOrder.slice(1))
      for (const surface of surfaces) {
        // Sawdust, the darkest allowed band, measures about 0.78.
        expect(surface.luminance, `${surface.name} background is a dark band`).toBeGreaterThanOrEqual(0.7)
      }
    })

    test(`SV-WARM-02 headings and numerals ${tag}`, async ({ page }) => {
      await openServices(page, locale, width)

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
        const headings = [...document.querySelectorAll('main h2')].filter(outside).map(typeOf)
        const cardHeadings = [...document.querySelectorAll('main h3')].filter(outside).map(typeOf)
        const heavy = [...document.querySelectorAll('main *')]
          .filter(outside)
          .filter(el => getComputedStyle(el).fontWeight === '900')
          .map(el => `${el.tagName.toLowerCase()}: ${(el.textContent ?? '').trim().slice(0, 30)}`)
        const numerals = [...document.querySelectorAll('[data-testid="services-sequence"]')]
          .map(el => parseFloat(getComputedStyle(el).fontSize))
        const smallest = [...document.querySelectorAll('main p, main li, main h2, main h3, main a, main span')]
          .filter(outside)
          .filter(el => (el.textContent ?? '').trim() !== '' && el.children.length === 0)
          .map(el => parseFloat(getComputedStyle(el).fontSize))
        return { headings, cardHeadings, heavy, numerals, smallest }
      })

      // documents, journey (visually hidden), proof, programmes and contact
      expect(result.headings).toHaveLength(5)
      expect(result.cardHeadings.length).toBeGreaterThan(0)
      for (const heading of [...result.headings, ...result.cardHeadings]) {
        expect(heading.weight, heading.text).toBe('500')
        expect(heading.transform, heading.text).toBe('none')
        expect(heading.family, heading.text).toContain('Outfit')
      }
      expect(result.heavy).toEqual([])
      // Sequence numbers stay (the delivery order is real) but only as Label-sized markers.
      expect(result.numerals).toHaveLength(6)
      for (const size of result.numerals) {
        expect(size).toBeLessThanOrEqual(14)
      }
      for (const size of result.smallest) {
        expect(size).toBeGreaterThanOrEqual(12)
      }
    })

    test(`SV-WARM-03 radii ${tag}`, async ({ page }) => {
      await openServices(page, locale, width)

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

    test(`SV-WARM-04 actions ${tag}`, async ({ page }) => {
      await openServices(page, locale, width)

      for (const chapter of ['documents', 'contact'] as const) {
        const primary = page.locator(`[data-services-chapter="${chapter}"] a[href="/lien-he"]`)
        await expect(primary).toHaveCount(1)
        await expect(primary).toHaveClass(/\bbtn-bronze\b/)
        // Bronze Edge Rule: on a light surface the bronze fill carries the Deep Timber border.
        await expect(primary).toHaveCSS('border-top-color', 'rgb(124, 80, 50)')
      }
      await expect(page.locator('[data-services-chapter="documents"] a[href="#delivery-journey"]'))
        .toHaveClass(/\bbtn-outline\b/)
      await expect(page.locator('[data-services-chapter="contact"] a[href^="tel:"]'))
        .toHaveClass(/\bbtn-outline\b/)
      await expect(page.locator('[data-services-chapter="proof"] a[href="/nha-xuong"]'))
        .toHaveClass(/\bbtn-outline\b/)
    })
  }
}

test('services localizes structured data in English', async ({ page }) => {
  await openServices(page, 'en')

  const structuredData = page.locator('script[type="application/ld+json"]')
  await expect(structuredData).toHaveCount(1)

  const servicesJsonLd = await structuredData.evaluateAll(scripts =>
    scripts.flatMap((script) => {
      try {
        const value = JSON.parse(script.textContent ?? 'null')
        return Array.isArray(value) ? value : [value]
      } catch {
        return []
      }
    }).find(entry => entry?.['@type'] === 'CollectionPage')
  )

  expect(servicesJsonLd?.mainEntity?.itemListElement.map(
    (entry: { item: { name: string } }) => entry.item.name
  )).toEqual(services.map(service => service.title.en))
})
