import { expect, test } from '@playwright/test'

const TRANSPARENT_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
  'base64'
)

test('the language switch moves to the English URL, keeps the scroll offset and hydrates cleanly', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.route(/\.(?:avif|gif|jpe?g|png|svg|webp)(?:\?.*)?$/i, async (route) => {
    await route.fulfill({ status: 200, contentType: 'image/png', body: TRANSPARENT_PNG })
  })

  const consoleErrors: string[] = []
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text())
  })

  await page.goto('/du-an/codi-villa-phan-thiet')
  // Scroll down, then back up a little: the header hides while scrolling down and returns on
  // the way up, which is how a reader reaches the menu mid-page.
  await page.evaluate(() => window.scrollTo(0, 1000))
  await page.waitForTimeout(200)
  await page.evaluate(() => window.scrollTo(0, 900))
  await page.getByRole('button', { name: 'Mở menu' }).click()
  await page.getByRole('button', { name: 'EN', exact: true }).click()

  await expect(page).toHaveURL(/\/en\/du-an\/codi-villa-phan-thiet$/)
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  await expect(page.getByRole('button', { name: 'Open menu' })).toBeVisible()
  await expect.poll(() => page.evaluate(() => Math.round(window.scrollY))).toBe(900)

  consoleErrors.length = 0
  await page.reload()

  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  await expect(page.getByRole('heading', { level: 1, name: 'Codi Villa, Phan Thiet' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Open menu' })).toBeVisible()
  // The spotlight carousel exposes "Enlarge" on the active slide only; its English name proves
  // the gallery labels were delivered in English by the server, not patched after hydration.
  await expect(page.getByRole('button', { name: /^Enlarge image · Image 1 \/ \d+$/ })).toHaveCount(1)
  await expect(page.getByRole('button', { name: /Phóng to ảnh/ })).toHaveCount(0)
  expect(consoleErrors).not.toContain('Hydration completed but contains mismatches.')
})

test('every English link stays in English and each page declares both language versions', async ({ page }) => {
  await page.goto('/en/du-an')
  const hrefs = await page.locator('a[href^="/"]').evaluateAll(links => links.map(link => link.getAttribute('href') ?? ''))
  expect(hrefs.length).toBeGreaterThan(0)
  expect(hrefs.filter(href => href !== '/en' && !href.startsWith('/en/') && !href.startsWith('/en#'))).toEqual([])

  const alternates = await page.locator('link[rel="alternate"][hreflang]').evaluateAll(links =>
    links.map(link => [link.getAttribute('hreflang'), new URL(link.getAttribute('href') ?? '').pathname]))
  expect(alternates).toEqual([['vi', '/du-an'], ['en', '/en/du-an'], ['x-default', '/du-an']])
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /\/en\/du-an$/)
})
