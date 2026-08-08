import { expect, test } from '@playwright/test'

const TRANSPARENT_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
  'base64'
)

test('reloads the persisted English locale without hydration mismatches or stale labels', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.route(/\.(?:avif|gif|jpe?g|png|svg|webp)(?:\?.*)?$/i, async (route) => {
    await route.fulfill({ status: 200, contentType: 'image/png', body: TRANSPARENT_PNG })
  })

  const consoleErrors: string[] = []
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text())
  })

  await page.goto('/du-an/codi-villa-phan-thiet')
  await page.getByRole('button', { name: 'Mở menu' }).click()
  await page.getByRole('button', { name: 'EN', exact: true }).click()
  await page.getByRole('button', { name: 'Close menu' }).click()

  consoleErrors.length = 0
  await page.reload()

  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  await expect(page.getByRole('heading', { level: 1, name: 'Codi Villa, Phan Thiet' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Open menu' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Enlarge image' })).toHaveCount(9)
  expect(consoleErrors).not.toContain('Hydration completed but contains mismatches.')
})
