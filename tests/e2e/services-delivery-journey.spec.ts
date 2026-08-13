import type { Page } from '@playwright/test'
import {
  serviceCoreIds,
  serviceProgrammeIds,
  servicesMediaAlt,
  servicesPageContent
} from '../../app/data/services-page'
import { services } from '../../app/data/services'
import { expect, test } from './fixtures'

const TEST_ORIGIN = process.env.DENSITY_TEST_ORIGIN ?? 'http://localhost:3000'
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
        .toBe(width >= 1280 ? 3 : 1)
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

test('services uses the approved wood programme hover and bright closing transition', async ({ page }) => {
  await openServices(page, 'vi', 1440)

  const programme = page.getByTestId('services-programme').first()
  await programme.hover()

  await expect(programme).toHaveCSS('background-color', 'rgb(124, 80, 50)')
  await expect(programme.getByRole('heading')).toHaveCSS('color', 'rgb(255, 255, 255)')
  const descriptionRgba = await programme.getByTestId('services-programme-description')
    .evaluate((element) => {
      const canvas = document.createElement('canvas')
      canvas.width = 1
      canvas.height = 1
      const context = canvas.getContext('2d')!
      context.fillStyle = getComputedStyle(element).color
      context.fillRect(0, 0, 1, 1)
      return [...context.getImageData(0, 0, 1, 1).data]
    })
  expect(descriptionRgba).toEqual([255, 255, 255, 204])
  await expect(programme.getByTestId('services-programme-arrow'))
    .toHaveCSS('color', 'rgb(255, 255, 255)')

  await page.mouse.move(0, 0)
  const programmeLink = programme.getByRole('link')
  await programmeLink.focus()
  await expect(programmeLink).toBeFocused()
  await expect(programme).toHaveCSS('background-color', 'rgb(124, 80, 50)')

  const contact = page.locator('[data-services-chapter="contact"]')
  expect(await contact.evaluate(element => getComputedStyle(element).backgroundColor))
    .toBe('rgb(255, 255, 255)')
  expect(await page.locator('footer').evaluate(element => getComputedStyle(element).backgroundColor))
    .toBe('rgb(11, 10, 9)')
})

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
