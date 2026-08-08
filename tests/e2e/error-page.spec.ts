import { expect, test } from './fixtures'
import { settle } from './helpers'

/**
 * app/error.vue contract.
 *
 * The defect this guards against is a regression to Nuxt's built-in error page: no header, no
 * footer, no `<main>`, no skip link, and English-only copy regardless of the locale cookie —
 * i.e. the one route that drops a visitor out of the site entirely. Every assertion here is a
 * structural fact that the built-in page fails and this one must not.
 *
 * The status code is asserted alongside the markup on purpose. A designed error page that
 * returns 200 is a soft-404: it looks right to a person and lies to everything else.
 */

const MISSING_ROUTE = '/this-route-does-not-exist'

test('an unknown route returns a real 404 status', async ({ page }) => {
  const response = await page.goto(MISSING_ROUTE, { waitUntil: 'load' })

  expect(response?.status()).toBe(404)
})

test('the error page carries the full site shell', async ({ page }) => {
  await page.goto(MISSING_ROUTE, { waitUntil: 'load' })
  await settle(page)

  await expect(page.locator('header.app-header')).toBeVisible()
  await expect(page.locator('main#main')).toBeVisible()
  await expect(page.locator('footer.app-footer')).toBeVisible()
  // First focusable element in the DOM — WCAG 2.4.1, same contract as app.vue.
  await expect(page.locator('a.skip-link')).toHaveCount(1)
})

test('the page has exactly one h1 and it is not the status numeral', async ({ page }) => {
  await page.goto(MISSING_ROUTE, { waitUntil: 'load' })
  await settle(page)

  const headings = page.locator('main#main h1')
  await expect(headings).toHaveCount(1)
  await expect(headings.first()).not.toHaveText('404')
})

test('recovery links reach the three routes a lost visitor wants', async ({ page }) => {
  await page.goto(MISSING_ROUTE, { waitUntil: 'load' })
  await settle(page)

  for (const href of ['/du-an', '/dich-vu', '/lien-he']) {
    await expect(page.locator(`main#main a[href="${href}"]`)).toHaveCount(1)
  }
})

test('an unknown project slug lands on the same designed page, not the built-in one', async ({ page }) => {
  const response = await page.goto('/du-an/khong-ton-tai', { waitUntil: 'load' })
  await settle(page)

  expect(response?.status()).toBe(404)
  await expect(page.locator('header.app-header')).toBeVisible()
  await expect(page.locator('footer.app-footer')).toBeVisible()
})

test('copy follows the locale cookie rather than defaulting to English', async ({ page, context }) => {
  await context.addCookies([
    { name: 'lai-huy-locale', value: 'vi', url: 'http://localhost:3000' }
  ])
  await page.goto(MISSING_ROUTE, { waitUntil: 'load' })
  await settle(page)
  await expect(page.locator('main#main h1')).toHaveText(/Không tìm thấy trang/)

  await context.clearCookies()
  await context.addCookies([
    { name: 'lai-huy-locale', value: 'en', url: 'http://localhost:3000' }
  ])
  await page.goto(MISSING_ROUTE, { waitUntil: 'load' })
  await settle(page)
  await expect(page.locator('main#main h1')).toHaveText(/Page not found/)
})

test('the error page is excluded from indexing', async ({ page }) => {
  await page.goto(MISSING_ROUTE, { waitUntil: 'load' })

  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/)
})
