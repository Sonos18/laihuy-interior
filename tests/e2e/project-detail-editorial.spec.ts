import type { Page } from '@playwright/test'
import { expect, test } from './fixtures'

const TEST_ORIGIN = process.env.PROJECT_DETAIL_TEST_ORIGIN ?? 'http://localhost:3000'
const TRANSPARENT_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M/wHwAF/gL+X9j7WQAAAABJRU5ErkJggg==',
  'base64'
)

const copy = {
  vi: { disclosure: 'Xem toàn bộ hình ảnh', viewer: 'Trình xem ảnh' },
  en: { disclosure: 'View all project images', viewer: 'Image viewer' }
} as const

async function openProject(
  page: Page,
  locale: 'vi' | 'en',
  path: string,
  width: number,
  height = 900
) {
  await page.context().addCookies([
    { name: 'lai-huy-locale', value: locale, url: TEST_ORIGIN }
  ])
  await page.route('**/*', async (route) => {
    if (route.request().resourceType() === 'image') {
      await route.fulfill({ status: 200, contentType: 'image/png', body: TRANSPARENT_PNG })
      return
    }
    await route.continue()
  })
  await page.setViewportSize({ width, height })
  await page.goto(new URL(path, TEST_ORIGIN).toString(), { waitUntil: 'load' })
  await page.waitForFunction(() => Boolean(
    (document.querySelector('#__nuxt') as HTMLElement & { __vue_app__?: unknown })?.__vue_app__
  ))
  await page.evaluate(() => document.fonts.ready)
}

async function gridColumnCount(page: Page, selector: string) {
  return page.locator(selector).evaluate((element) => {
    const columns = getComputedStyle(element).gridTemplateColumns
    return columns === 'none' ? 1 : columns.split(' ').filter(Boolean).length
  })
}

for (const locale of ['vi', 'en'] as const) {
  test(`PD-EDITORIAL-01 hero and story expose one coherent spine in ${locale}`, async ({ page }) => {
    await openProject(page, locale, '/du-an/khach-san-eo-gio', 1440)

    await expect(page.locator('[data-project-chapter="hero"]')).toBeVisible()
    await expect(page.locator('[data-project-facts] [data-project-fact]')).toHaveCount(5)
    expect(await page.locator('[data-project-fact]').evaluateAll(elements =>
      elements.map(element => element.getAttribute('data-fact-key'))
    )).toEqual(['area', 'year', 'style', 'scope', 'location'])
    await expect(page.locator('#story [data-story-beat]')).toHaveCount(3)
  })
}

test('PD-EDITORIAL-02 delivery proof follows the verified project scope', async ({ page }) => {
  await openProject(page, 'vi', '/du-an/khach-san-eo-gio', 1280)
  await expect(page.locator('[data-execution-proof="direct-factory"]')).toHaveCount(1)
  await expect(page.locator('[data-execution-proof="quality"]')).toHaveCount(1)
  await expect(page.locator('[data-execution-proof="craft"]')).toHaveCount(1)

  await openProject(page, 'vi', '/du-an/nha-vuon-chily', 1280)
  await expect(page.locator('#delivery [data-scope-key="Thiết kế"]')).toHaveCount(1)
  await expect(page.locator('#delivery [data-execution-proof]')).toHaveCount(0)
})

test('PD-EDITORIAL-03 rich and sparse projects share the approved chapter order', async ({ page }) => {
  for (const path of ['/du-an/khach-san-eo-gio', '/du-an/nha-xuong-anh-cuong']) {
    await openProject(page, 'vi', path, 1280)
    expect(await page.locator('[data-project-chapter]').evaluateAll(elements =>
      elements.map(element => element.getAttribute('data-project-chapter'))
    )).toEqual(['hero', 'story', 'gallery', 'delivery', 'materials', 'related', 'finale'])
    expect(await page.locator('[data-project-subnav] a').evaluateAll(elements =>
      elements.map(element => element.getAttribute('href'))
    )).toEqual(['#story', '#gallery', '#delivery', '#materials'])
    await expect(page.locator('[data-project-chapter="finale"]'))
      .not.toContainText(/đã gửi|đã nhận|gửi thành công/i)
  }
})

const viewports = [
  { width: 390, height: 844, facts: 2, story: 1, delivery: 1 },
  { width: 767, height: 900, facts: 2, story: 1, delivery: 1 },
  { width: 768, height: 1024, facts: 3, story: 2, delivery: 5 },
  { width: 1279, height: 900, facts: 3, story: 2, delivery: 5 },
  { width: 1280, height: 900, facts: 5, story: 2, delivery: 5 },
  { width: 1440, height: 900, facts: 5, story: 2, delivery: 5 }
] as const

for (const locale of ['vi', 'en'] as const) {
  for (const viewport of viewports) {
    test(`PD-EDITORIAL-04 ${locale} reflows without overflow at ${viewport.width}`, async ({ page }) => {
      await openProject(page, locale, '/du-an/khach-san-eo-gio', viewport.width, viewport.height)

      expect(await gridColumnCount(page, '[data-project-facts] dl')).toBe(viewport.facts)
      expect(await gridColumnCount(page, '[data-story-layout]')).toBe(viewport.story)
      expect(await gridColumnCount(page, '[data-delivery-timeline]')).toBe(viewport.delivery)
      expect(await gridColumnCount(page, '[data-material-layout]')).toBe(viewport.story)
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
    })
  }
}

test('PD-EDITORIAL-05 lightbox uses non-smooth thumbnail movement under reduced motion', async ({ page }) => {
  await openProject(page, 'en', '/du-an/khach-san-eo-gio', 1280)
  await page.evaluate(() => {
    const target = window as unknown as { __projectScrollBehaviors: ScrollBehavior[] }
    target.__projectScrollBehaviors = []
    const original = Element.prototype.scrollIntoView
    Element.prototype.scrollIntoView = function (options?: boolean | ScrollIntoViewOptions) {
      if (typeof options === 'object' && options?.behavior) {
        target.__projectScrollBehaviors.push(options.behavior)
      }
      original.call(this, options)
    }
  })

  await page.getByRole('button', { name: new RegExp(`^${copy.en.disclosure}`) }).click()
  await expect(page.getByRole('dialog', { name: copy.en.viewer })).toBeVisible()
  await expect.poll(() => page.evaluate(() =>
    (window as unknown as { __projectScrollBehaviors: ScrollBehavior[] }).__projectScrollBehaviors
  )).toContain('auto')

  await page.keyboard.press('Shift+Tab')
  expect(await page.getByRole('dialog', { name: copy.en.viewer }).evaluate(dialog =>
    dialog.contains(document.activeElement)
  )).toBe(true)
})

test('PD-EDITORIAL-06 anchors, SEO and hard 404 behavior remain intact', async ({ page }) => {
  await openProject(page, 'vi', '/du-an/khach-san-eo-gio', 1280)

  const deliveryLink = page.locator('[data-project-subnav] a[href="#delivery"]')
  await deliveryLink.click()
  await expect(page).toHaveURL(/#delivery$/)
  await expect(deliveryLink).toHaveAttribute('aria-current', 'location')
  expect(await page.locator('#delivery').evaluate(element => element.getBoundingClientRect().top))
    .toBeGreaterThanOrEqual(120)

  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    /\/du-an\/khach-san-eo-gio$/
  )
  expect((await page.locator('script[type="application/ld+json"]').allTextContents()).join('\n'))
    .toContain('CreativeWork')

  const response = await page.goto(
    new URL('/du-an/du-an-khong-ton-tai', TEST_ORIGIN).toString(),
    { waitUntil: 'load' }
  )
  expect(response?.status()).toBe(404)
})
