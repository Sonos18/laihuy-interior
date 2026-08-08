import type { Page } from '@playwright/test'
import { expect, test } from './fixtures'

const VIEWPORT_HEIGHT = 900
const TEST_ORIGIN = process.env.DENSITY_TEST_ORIGIN ?? 'http://localhost:3000'
const KNOWN_ENGLISH_HYDRATION_ERROR = 'Hydration completed but contains mismatches.'
const TRANSPARENT_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M/wHwAF/gL+X9j7WQAAAABJRU5ErkJggg==',
  'base64'
)

const MEDIA_COPY = {
  vi: {
    disclosure: 'Xem toàn bộ hình ảnh',
    viewer: 'Trình xem ảnh'
  },
  en: {
    disclosure: 'View all project images',
    viewer: 'Image viewer'
  }
} as const

async function prepareContentPage(page: Page, locale: 'vi' | 'en', path: string) {
  const consoleErrors: string[] = []
  const pageErrors: string[] = []

  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text())
  })
  page.on('pageerror', error => pageErrors.push(error.message))

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

  await page.setViewportSize({ width: 1024, height: VIEWPORT_HEIGHT })
  await page.goto(new URL(path, TEST_ORIGIN).toString(), { waitUntil: 'load' })
  await page.waitForFunction(() => Boolean(
    (document.querySelector('#__nuxt') as HTMLElement & { __vue_app__?: unknown })?.__vue_app__
  ))
  await page.evaluate(() => document.fonts.ready)

  return {
    consoleErrors: consoleErrors.filter(message => message !== KNOWN_ENGLISH_HYDRATION_ERROR),
    knownConsoleErrors: consoleErrors.filter(message => message === KNOWN_ENGLISH_HYDRATION_ERROR),
    pageErrors
  }
}

for (const locale of ['vi', 'en'] as const) {
  test(`DENS-MEDIA-01 long project curates inline media and exposes the full gallery in ${locale}`, async ({ page }) => {
    const errors = await prepareContentPage(page, locale, '/du-an/khach-san-eo-gio')
    const gallery = page.locator('#gallery')

    await expect(gallery).toHaveAttribute('data-media-flow', 'long')
    await expect(gallery).toHaveAttribute('data-eligible-media', '30')
    await expect(gallery).toHaveAttribute('data-inline-media', '9')
    await expect(gallery.locator('img')).toHaveCount(9)
    await expect(page.getByRole('dialog', { name: MEDIA_COPY[locale].viewer })).toHaveCount(0)

    const disclosure = page.getByRole('button', { name: new RegExp(`^${MEDIA_COPY[locale].disclosure}`) })
    await expect(disclosure).toHaveCount(1)
    await expect(disclosure).toContainText('21')
    expect(await page.locator('#materials').evaluate((materials, button) =>
      Boolean(materials.compareDocumentPosition(button as Node) & Node.DOCUMENT_POSITION_FOLLOWING),
    await disclosure.elementHandle())).toBe(true)

    await disclosure.focus()
    await expect(disclosure).toBeFocused()
    await disclosure.click()

    const dialog = page.getByRole('dialog', { name: MEDIA_COPY[locale].viewer })
    await expect(dialog).toBeVisible()
    await expect(dialog.getByText('1 / 30', { exact: true })).toBeVisible()
    await expect(dialog.locator('button[data-active]')).toHaveCount(30)
    await expect(dialog.getByRole('button', { name: locale === 'vi' ? 'Đóng' : 'Close' })).toBeFocused()

    await page.keyboard.press('Escape')
    await expect(dialog).toHaveCount(0)
    await expect(disclosure).toBeFocused()

    expect(errors.consoleErrors).toEqual([])
    expect(errors.knownConsoleErrors.length).toBeLessThanOrEqual(locale === 'en' ? 1 : 0)
    expect(errors.pageErrors).toEqual([])
  })

  test(`DENS-MEDIA-01 short project keeps its existing inline-only media flow in ${locale}`, async ({ page }) => {
    const errors = await prepareContentPage(page, locale, '/du-an/nha-xuong-anh-cuong')
    const gallery = page.locator('#gallery')

    await expect(gallery).toHaveAttribute('data-media-flow', 'short')
    await expect(gallery).toHaveAttribute('data-eligible-media', '3')
    await expect(gallery).toHaveAttribute('data-inline-media', '3')
    await expect(gallery.locator('img')).toHaveCount(3)
    await expect(page.getByRole('button', { name: new RegExp(`^${MEDIA_COPY[locale].disclosure}`) })).toHaveCount(0)

    expect(errors.consoleErrors).toEqual([])
    expect(errors.knownConsoleErrors.length).toBeLessThanOrEqual(locale === 'en' ? 1 : 0)
    expect(errors.pageErrors).toEqual([])
  })
}
