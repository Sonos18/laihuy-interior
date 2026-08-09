import type { ConsoleMessage, Page } from '@playwright/test'
import { expect, test } from './fixtures'
import { settle } from './helpers'

/**
 * /lien-he layout gate — docs/superpowers/plans/2026-07-28-lien-he-card-band-reorder.md
 *
 * Geometry, not pixels: this asserts the structural contract (cards close the band, and the
 * row shape at each viewport) so a future edit cannot silently undo it. The pixel record
 * lives in visual.spec.ts.
 */

const CARDS = '[data-testid="contact-cards"] .industrial-card'

/** Cards on the same visual row share a top edge. Sub-pixel rounding differs per engine, so
 *  rows are bucketed with a 2px tolerance rather than compared exactly. */
async function rowShape(page: Page): Promise<number[]> {
  return page.evaluate((selector: string) => {
    const tops = [...document.querySelectorAll(selector)].map(el => el.getBoundingClientRect().top)
    const rows: number[][] = []
    for (const top of tops) {
      const row = rows.find(r => Math.abs(r[0]! - top) < 2)
      if (row) row.push(top)
      else rows.push([top])
    }
    return rows.map(r => r.length)
  }, CARDS)
}

async function open(page: Page, width: number) {
  await page.setViewportSize({ width, height: 900 })
  await page.route('https://maps.google.com/**', async (route) => {
    await route.fulfill({ status: 200, contentType: 'text/html', body: '<!doctype html><title>Map unavailable in test</title>' })
  })
  await page.goto('/lien-he', { waitUntil: 'load' })
  await page.waitForFunction(() => Boolean(
    (document.querySelector('#__nuxt') as HTMLElement & { __vue_app__?: unknown })?.__vue_app__
  ))
  await settle(page)
}

test('cards close the band — they sit below the form and the map', async ({ page }) => {
  await open(page, 1440)

  const primary = await page.locator('[data-testid="contact-primary"]').boundingBox()
  const cards = await page.locator('[data-testid="contact-cards"]').boundingBox()

  expect(primary).not.toBeNull()
  expect(cards).not.toBeNull()
  expect(cards!.y).toBeGreaterThan(primary!.y + primary!.height)
})

test('cards share the page rail with the form and the map', async ({ page }) => {
  await open(page, 1440)

  const primary = await page.locator('[data-testid="contact-primary"]').boundingBox()
  const cards = await page.locator('[data-testid="contact-cards"]').boundingBox()

  expect(Math.abs(cards!.x - primary!.x)).toBeLessThanOrEqual(1)
  expect(Math.abs(cards!.width - primary!.width)).toBeLessThanOrEqual(1)
})

for (const { width, gap } of [{ width: 390, gap: 64 }, { width: 1440, gap: 80 }] as const) {
  test(`separation from the form+map block is ${gap}px @ ${width}`, async ({ page }) => {
    await open(page, width)

    const primary = await page.locator('[data-testid="contact-primary"]').boundingBox()
    const cards = await page.locator('[data-testid="contact-cards"]').boundingBox()

    expect(cards!.y - (primary!.y + primary!.height)).toBeCloseTo(gap, 0)
  })
}

for (const { width, shape } of [
  { width: 390, shape: [1, 1, 1, 1, 1] },
  { width: 768, shape: [3, 2] },
  { width: 1024, shape: [3, 2] },
  { width: 1440, shape: [5] }
] as const) {
  test(`card grid is ${shape.join(' + ')} @ ${width}`, async ({ page }) => {
    await open(page, width)

    await expect(page.locator(CARDS)).toHaveCount(5)
    expect(await rowShape(page)).toEqual([...shape])
  })
}

test('the five cards are equal width in the desktop row', async ({ page }) => {
  await open(page, 1440)

  const widths = await page.locator(CARDS).evaluateAll(
    els => els.map(el => el.getBoundingClientRect().width)
  )

  expect(widths).toHaveLength(5)
  for (const width of widths) {
    expect(width).toBeCloseTo(widths[0]!, 0)
  }
})

/**
 * Public lead-form behaviour gate.
 *
 * The future internal system is deliberately outside this application. Until its API is wired,
 * a valid draft reaches one explicit console seam and no network write occurs. These assertions
 * protect validation, focus and the integration boundary without inventing a success state.
 */
async function fillValid(page: Page) {
  await page.fill('#contact-name', 'Nguyễn Văn A')
  await page.fill('#contact-phone', '+84 912 345 678')
  await page.fill('#contact-email', 'a@congty.com')
  await page.selectOption('#contact-projectType', { index: 1 })
  await page.fill('#contact-message', 'Khách sạn 40 phòng tại Đà Nẵng, cần báo giá nội thất.')
}

test('an empty submit blocks, marks every field invalid and focuses the first', async ({ page }) => {
  await open(page, 1440)
  const dataLogs: ConsoleMessage[] = []
  page.on('console', (message) => {
    if (message.type() === 'log' && message.text().startsWith('dữ liệu')) dataLogs.push(message)
  })

  await page.click('[data-testid="contact-form"] button[type="submit"]')

  for (const field of ['name', 'phone', 'email', 'projectType', 'message']) {
    await expect(page.locator(`#contact-${field}`)).toHaveAttribute('aria-invalid', 'true')
    await expect(page.locator(`#contact-${field}-error`)).toBeVisible()
  }

  await expect(page.locator('[data-testid="contact-form"]')).toBeVisible()
  await expect(page.locator('[data-testid="contact-reviewed"]')).toHaveCount(0)
  await expect(page.locator('#contact-name')).toBeFocused()
  expect(dataLogs).toHaveLength(0)
})

test('each error is wired to its field for assistive tech', async ({ page }) => {
  await open(page, 1440)
  await page.click('[data-testid="contact-form"] button[type="submit"]')

  await expect(page.locator('#contact-email')).toHaveAttribute('aria-describedby', 'contact-email-error')
})

test('a malformed email is rejected while the rest of the form is valid', async ({ page }) => {
  await open(page, 1440)
  await fillValid(page)
  await page.fill('#contact-email', 'not-an-email')
  await page.click('[data-testid="contact-form"] button[type="submit"]')

  await expect(page.locator('#contact-email-error')).toBeVisible()
  await expect(page.locator('#contact-email')).toBeFocused()
  await expect(page.locator('[data-testid="contact-reviewed"]')).toHaveCount(0)
})

test('correcting a field clears its error immediately', async ({ page }) => {
  await open(page, 1440)
  await page.click('[data-testid="contact-form"] button[type="submit"]')
  await expect(page.locator('#contact-name-error')).toBeVisible()

  await page.fill('#contact-name', 'Nguyễn Văn A')

  await expect(page.locator('#contact-name-error')).toHaveCount(0)
  await expect(page.locator('#contact-name')).not.toHaveAttribute('aria-invalid', 'true')
})

test('a valid submit exposes the draft once for future API integration and keeps the form visible', async ({ page }) => {
  await open(page, 1440)
  await fillValid(page)

  const dataLogs: ConsoleMessage[] = []
  const writeRequests: string[] = []
  page.on('console', (message) => {
    if (message.type() === 'log' && message.text().startsWith('dữ liệu')) dataLogs.push(message)
  })
  page.on('request', (request) => {
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method())) {
      writeRequests.push(request.url())
    }
  })

  await page.click('[data-testid="contact-form"] button[type="submit"]')

  await expect.poll(() => dataLogs.length).toBe(1)
  const args = dataLogs[0]!.args()
  expect(await args[0]!.jsonValue()).toBe('dữ liệu')
  expect(await args[1]!.jsonValue()).toEqual({
    name: 'Nguyễn Văn A',
    phone: '+84 912 345 678',
    email: 'a@congty.com',
    projectType: 'Thi công nội thất khách sạn',
    message: 'Khách sạn 40 phòng tại Đà Nẵng, cần báo giá nội thất.'
  })
  expect(writeRequests).toEqual([])
  await expect(page.locator('[data-testid="contact-form"]')).toBeVisible()
  await expect(page.locator('[data-testid="contact-reviewed"]')).toHaveCount(0)
})
