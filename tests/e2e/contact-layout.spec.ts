import type { Page } from '@playwright/test'
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
  await page.goto('/lien-he', { waitUntil: 'load' })
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
