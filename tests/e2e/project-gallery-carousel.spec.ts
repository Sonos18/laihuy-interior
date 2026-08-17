import type { Page } from '@playwright/test'
import { expect, test } from './fixtures'

const TEST_ORIGIN = process.env.PROJECT_DETAIL_TEST_ORIGIN ?? 'http://localhost:3000'
const TRANSPARENT_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M/wHwAF/gL+X9j7WQAAAABJRU5ErkJggg==',
  'base64'
)

const carouselCopy = {
  vi: {
    region: 'Bộ sưu tập hình ảnh',
    role: 'trình chiếu',
    previous: 'Ảnh trước',
    next: 'Ảnh tiếp theo'
  },
  en: {
    region: 'Image gallery',
    role: 'carousel',
    previous: 'Previous image',
    next: 'Next image'
  }
} as const

async function openProject(
  page: Page,
  path: string,
  width = 1280,
  locale: keyof typeof carouselCopy = 'vi'
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
  await page.setViewportSize({ width, height: 900 })
  await page.goto(new URL(path, TEST_ORIGIN).toString(), { waitUntil: 'load' })
  await page.waitForFunction(() => Boolean(
    (document.querySelector('#__nuxt') as HTMLElement & { __vue_app__?: unknown })?.__vue_app__
  ))
}

test('gallery shows a dominant centre image and circular manual navigation', async ({ page }) => {
  await openProject(page, '/du-an/khach-san-eo-gio')

  const carousel = page.locator('[data-gallery-carousel]')
  await expect(carousel).toBeVisible()
  await expect(carousel.locator('[data-gallery-position="previous"]')).toHaveCount(1)
  await expect(carousel.locator('[data-gallery-position="active"]')).toHaveCount(1)
  await expect(carousel.locator('[data-gallery-position="next"]')).toHaveCount(1)

  const active = await carousel.locator('[data-gallery-position="active"]').boundingBox()
  const previous = await carousel.locator('[data-gallery-position="previous"]').boundingBox()
  const next = await carousel.locator('[data-gallery-position="next"]').boundingBox()
  expect(active!.width).toBeGreaterThan(previous!.width)
  expect(active!.width).toBeGreaterThan(next!.width)

  const total = Number(await carousel.getAttribute('data-gallery-count'))
  await carousel.getByRole('button', { name: 'Ảnh trước' }).click()
  await expect(carousel).toHaveAttribute('data-gallery-active-index', String(total - 1))
  await carousel.getByRole('button', { name: 'Ảnh tiếp theo' }).click()
  await expect(carousel).toHaveAttribute('data-gallery-active-index', '0')
})

test('side images activate while the centre image opens the matching lightbox item', async ({ page }) => {
  await openProject(page, '/du-an/khach-san-eo-gio')
  const carousel = page.locator('[data-gallery-carousel]')

  await carousel.locator('[data-gallery-position="next"] button').click()
  await expect(carousel).toHaveAttribute('data-gallery-active-index', '1')
  await carousel.locator('[data-gallery-position="active"] button').click()

  const dialog = page.getByRole('dialog', { name: 'Trình xem ảnh' })
  await expect(dialog).toBeVisible()
  await expect(dialog.getByText(/^2 \/ \d+$/)).toBeVisible()
})

test('autoplay advances after five seconds and explicit pause stops it', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.clock.install()
  await openProject(page, '/du-an/khach-san-eo-gio')
  const carousel = page.locator('[data-gallery-carousel]')

  await expect(carousel).toHaveAttribute('data-gallery-active-index', '0')
  await page.clock.fastForward(4800)
  await expect(carousel).toHaveAttribute('data-gallery-active-index', '0')
  await page.clock.fastForward(250)
  await expect(carousel).toHaveAttribute('data-gallery-active-index', '1')

  await carousel.getByRole('button', { name: 'Tạm dừng trình chiếu' }).click()
  const pausedAt = await carousel.getAttribute('data-gallery-active-index')
  await page.clock.fastForward(5500)
  await expect(carousel).toHaveAttribute('data-gallery-active-index', pausedAt!)
  await expect(carousel).toHaveAttribute('data-gallery-autoplay', 'paused')
})

test('reduced motion disables autoplay and removes long transitions', async ({ page }) => {
  await openProject(page, '/du-an/khach-san-eo-gio')
  const carousel = page.locator('[data-gallery-carousel]')

  await expect(carousel).toHaveAttribute('data-gallery-autoplay', 'disabled')
  await expect(carousel.getByRole('button', { name: /trình chiếu/i })).toHaveCount(0)
  expect(await carousel.locator('[data-gallery-position="active"]').evaluate(element =>
    Number.parseFloat(getComputedStyle(element).transitionDuration)
  )).toBeLessThanOrEqual(0.001)
})

test('hover and keyboard focus pause autoplay without changing visitor preference', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await openProject(page, '/du-an/khach-san-eo-gio')
  const carousel = page.locator('[data-gallery-carousel]')

  await expect(carousel).toHaveAttribute('data-gallery-autoplay', 'running')
  await carousel.locator('[data-gallery-viewport]').hover()
  await expect(carousel).toHaveAttribute('data-gallery-autoplay', 'paused')

  await page.mouse.move(0, 0)
  await expect(carousel).toHaveAttribute('data-gallery-autoplay', 'running')
  await carousel.getByRole('button', { name: 'Ảnh tiếp theo' }).focus()
  await expect(carousel).toHaveAttribute('data-gallery-autoplay', 'paused')
})

test('horizontal pointer gesture changes the active image exactly once', async ({ page }) => {
  await openProject(page, '/du-an/khach-san-eo-gio')
  const carousel = page.locator('[data-gallery-carousel]')
  const viewportElement = carousel.locator('[data-gallery-viewport]')
  await viewportElement.scrollIntoViewIfNeeded()
  const viewport = await viewportElement.boundingBox()

  await page.mouse.move(viewport!.x + viewport!.width * 0.7, viewport!.y + viewport!.height / 2)
  await page.mouse.down()
  await page.mouse.move(viewport!.x + viewport!.width * 0.3, viewport!.y + viewport!.height / 2)
  await page.mouse.up()

  await expect(carousel).toHaveAttribute('data-gallery-active-index', '1')
})

test('filters appear only for more than ten images with valid groups', async ({ page }) => {
  await openProject(page, '/du-an/khach-san-eo-gio')
  await expect(page.locator('[data-gallery-filters]')).toBeVisible()

  await openProject(page, '/du-an/nha-xuong-anh-cuong')
  await expect(page.locator('[data-gallery-filters]')).toHaveCount(0)
  await expect(page.locator('[data-gallery-carousel]')).toBeVisible()
})

test('changing a room filter resets the carousel and lightbox pauses autoplay', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await openProject(page, '/du-an/khach-san-eo-gio')
  const carousel = page.locator('[data-gallery-carousel]')

  await carousel.getByRole('button', { name: 'Ảnh tiếp theo' }).click()
  await expect(carousel).toHaveAttribute('data-gallery-active-index', '1')
  await page.locator('[data-gallery-filters] button').nth(1).click()
  await expect(carousel).toHaveAttribute('data-gallery-active-index', '0')

  await carousel.locator('[data-gallery-position="active"] button').click()
  await expect(page.getByRole('dialog', { name: 'Trình xem ảnh' })).toBeVisible()
  await page.mouse.move(0, 0)
  await expect(carousel).toHaveAttribute('data-gallery-autoplay', 'paused')

  await page.keyboard.press('Escape')
  await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur())
  await expect(carousel).toHaveAttribute('data-gallery-autoplay', 'running')
})

test('explicit pause persists when a room filter changes', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await openProject(page, '/du-an/khach-san-eo-gio')
  const carousel = page.locator('[data-gallery-carousel]')
  const initialCount = await carousel.getAttribute('data-gallery-count')

  await carousel.getByRole('button', { name: 'Tạm dừng trình chiếu' }).click()
  await page.locator('[data-gallery-filters] button').nth(1).click()

  await expect.poll(() => carousel.getAttribute('data-gallery-count')).not.toBe(initialCount)
  await expect(carousel).toHaveAttribute('data-gallery-active-index', '0')
  await expect(carousel).toHaveAttribute('data-gallery-autoplay', 'paused')
  await expect(carousel.getByRole('button', { name: 'Tiếp tục trình chiếu' })).toBeVisible()
})

for (const locale of ['vi', 'en'] as const) {
  for (const width of [390, 767, 768, 1279, 1280, 1440]) {
    test(`gallery remains balanced at ${width}px in ${locale}`, async ({ page }) => {
      await openProject(page, '/du-an/khach-san-eo-gio', width, locale)
      const carousel = page.getByRole('region', { name: carouselCopy[locale].region })
      const active = await carousel.locator('[data-gallery-position="active"]').boundingBox()
      const previous = await carousel.locator('[data-gallery-position="previous"]').boundingBox()
      const next = await carousel.locator('[data-gallery-position="next"]').boundingBox()

      expect(active).not.toBeNull()
      expect(previous).not.toBeNull()
      expect(next).not.toBeNull()
      expect(active!.width).toBeGreaterThan(previous!.width)
      expect(active!.width).toBeGreaterThan(next!.width)
      expect(previous!.x + previous!.width).toBeGreaterThan(0)
      expect(next!.x).toBeLessThan(width)
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width)

      if (width >= 1280) {
        const viewport = await carousel.locator('[data-gallery-viewport]').boundingBox()
        expect(active!.width / viewport!.width).toBeGreaterThanOrEqual(0.54)
        expect(active!.width / viewport!.width).toBeLessThanOrEqual(0.58)
      }

      await expect(carousel.getByRole('button', { name: carouselCopy[locale].previous })).toBeVisible()
      await expect(carousel.getByRole('button', { name: carouselCopy[locale].next })).toBeVisible()
      await expect(carousel).toHaveAttribute('aria-roledescription', carouselCopy[locale].role)
    })
  }
}
