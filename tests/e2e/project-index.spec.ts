import type { Page } from '@playwright/test'
import { expect, test } from './fixtures'
import { APP_ORIGIN } from './origin'

/**
 * PROJECT INDEX (`/du-an`) and the case-study room filter.
 *
 * PI-01  the projects that cover design, production and construction are the featured
 *        composition (one lead + two satellites), and only they are.
 * PI-02  a card carries one chip type: the category as a Label line; no pills.
 * PI-03  the category filter narrows the archive and leaves the featured composition alone.
 * PI-04  the archive filter chips stay on one row (they scroll sideways instead of wrapping).
 * PI-05  the room chips of a rich case study are one row at 1440 and 390 and every one of them is
 *        reachable by keyboard.
 * PI-06  the two section heads of the index never share a layout.
 *
 * Images are replaced with a 1x1 PNG: these are geometry and style contracts, not pixels.
 */

const TEST_ORIGIN = process.env.DENSITY_TEST_ORIGIN ?? APP_ORIGIN
const TRANSPARENT_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M/wHwAF/gL+X9j7WQAAAABJRU5ErkJggg==',
  'base64'
)

// Scope of the 11 projects in app/data/projects.ts: these three span design + production +
// construction, in category order (hotel, villa, office).
const END_TO_END = ['/du-an/khach-san-eo-gio', '/du-an/codi-villa-phan-thiet', '/du-an/van-phong-quan-4']
const ARCHIVE_COUNT = 8

type Locale = 'vi' | 'en'

async function open(page: Page, path: string, width: number, locale: Locale = 'vi') {
  await page.context().addCookies([{ name: 'lai-huy-locale', value: locale, url: TEST_ORIGIN }])
  await page.route('**/*', async (route) => {
    if (route.request().resourceType() === 'image') {
      await route.fulfill({ status: 200, contentType: 'image/png', body: TRANSPARENT_PNG })
      return
    }
    await route.continue()
  })
  await page.setViewportSize({ width, height: 900 })
  await page.goto(new URL(path, TEST_ORIGIN).toString(), { waitUntil: 'load' })
  await page.evaluate(() => document.fonts.ready)
}

for (const locale of ['vi', 'en'] as const) {
  for (const width of [1440, 768, 390] as const) {
    test(`PI-01 the end-to-end projects are a lead + two satellites (${locale} @ ${width})`, async ({ page }) => {
      await open(page, '/du-an', width, locale)

      const cards = page.locator('[data-testid="projects-featured"] [data-project-card]')
      await expect(cards).toHaveCount(3)
      expect(await cards.evaluateAll(links => links.map(link => link.getAttribute('href')))).toEqual(END_TO_END)

      const boxes = await cards.evaluateAll(links => links.map((link) => {
        const rect = link.getBoundingClientRect()
        return { left: rect.left, top: rect.top, width: rect.width, height: rect.height }
      }))
      const [lead, first, second] = boxes as [typeof boxes[number], typeof boxes[number], typeof boxes[number]]

      if (width >= 768) {
        // Lead on the left and wider; the satellites stack in the right column.
        expect(lead.left).toBeLessThan(first.left)
        expect(lead.width).toBeGreaterThan(first.width * 1.2)
        expect(Math.abs(first.left - second.left)).toBeLessThanOrEqual(1)
        expect(second.top).toBeGreaterThan(first.top + first.height - 1)
      } else {
        // One column: lead, then the two satellites.
        expect(Math.abs(lead.left - first.left)).toBeLessThanOrEqual(1)
        expect(first.top).toBeGreaterThan(lead.top + lead.height - 1)
        expect(second.top).toBeGreaterThan(first.top + first.height - 1)
      }

      // None of them repeats in the archive.
      const archiveHrefs = await page.locator('[data-testid="projects-grid"] > a')
        .evaluateAll(links => links.map(link => link.getAttribute('href')))
      expect(archiveHrefs).toHaveLength(ARCHIVE_COUNT)
      for (const href of END_TO_END) expect(archiveHrefs).not.toContain(href)
    })
  }
}

test('PI-02 a card carries the category as one Label line and no pill chips', async ({ page }) => {
  await open(page, '/du-an', 1440)

  const result = await page.evaluate(() => {
    const pills = (card: Element) => [...card.querySelectorAll('*')]
      .filter(el => !(el instanceof SVGElement))
      // A chip is a pill that holds words (the round arrow of a card's call to action is not).
      .filter(el => el.textContent?.trim() && Number.parseFloat(getComputedStyle(el).borderTopLeftRadius) >= 9000)
      .map(el => el.className.toString())
    const archive = [...document.querySelectorAll('[data-testid="projects-grid"] > a')]
    const featured = [...document.querySelectorAll('[data-testid="projects-featured"] [data-project-card]')]
    return {
      archive: archive.map(card => ({
        pills: pills(card),
        labels: card.querySelectorAll('.eyebrow').length,
        // Scope as one short line: no element in the card is a bordered or filled tag.
        tags: [...card.querySelectorAll('p, span, div')].filter((el) => {
          const style = getComputedStyle(el)
          return el.children.length === 0 && el.textContent
            && (Number.parseFloat(style.borderTopWidth) > 0 || style.backgroundColor !== 'rgba(0, 0, 0, 0)')
        }).length,
        scopeLines: [...card.querySelectorAll('p')].filter(p => p.textContent?.includes('·')).length
      })),
      featured: featured.map(card => ({
        pills: pills(card),
        badges: card.querySelectorAll('.home-projects__tag-pill, .home-projects__index').length
      }))
    }
  })

  expect(result.archive).toHaveLength(ARCHIVE_COUNT)
  for (const card of result.archive) {
    expect(card.pills).toEqual([])
    expect(card.labels).toBe(1)
    expect(card.tags).toBe(0)
    expect(card.scopeLines).toBeLessThanOrEqual(1)
  }
  expect(result.featured).toHaveLength(3)
  for (const card of result.featured) {
    expect(card.pills).toEqual([])
    expect(card.badges).toBe(0)
  }
})

test('PI-03 the filter narrows the archive and keeps the featured composition', async ({ page }) => {
  await open(page, '/du-an', 1440)

  const archive = page.locator('[data-testid="projects-grid"] > a')
  const featured = page.locator('[data-testid="projects-featured"] [data-project-card]')
  const chips = page.locator('main button[aria-pressed]')
  await expect(archive).toHaveCount(ARCHIVE_COUNT)

  // Every chip has a result: the options derive from the archive.
  const chipCount = await chips.count()
  for (let index = 1; index < chipCount; index += 1) {
    await chips.nth(index).click()
    await expect(chips.nth(index)).toHaveAttribute('aria-pressed', 'true')
    const count = await archive.count()
    expect(count).toBeGreaterThan(0)
    expect(count).toBeLessThan(ARCHIVE_COUNT)
    await expect(featured).toHaveCount(3)
  }

  await chips.first().click()
  await expect(archive).toHaveCount(ARCHIVE_COUNT)
})

for (const width of [1440, 390] as const) {
  test(`PI-04 the archive filter chips are one row (@ ${width})`, async ({ page }) => {
    await open(page, '/du-an', width)

    const tops = await page.locator('main button[aria-pressed]')
      .evaluateAll(chips => chips.map(chip => Math.round(chip.getBoundingClientRect().top)))
    expect(tops.length).toBeGreaterThan(4)
    expect(new Set(tops).size).toBe(1)
  })
}

for (const width of [1440, 390] as const) {
  test(`PI-05 the room chips of eo-gio are one row and all reachable by keyboard (@ ${width})`, async ({ page }) => {
    await open(page, '/du-an/khach-san-eo-gio', width)

    const row = page.locator('[data-gallery-filters]')
    const chips = row.locator('button[aria-pressed]')
    const count = await chips.count()
    expect(count).toBeGreaterThanOrEqual(8)

    // One row: every chip shares a top.
    const tops = await chips.evaluateAll(all => all.map(chip => Math.round(chip.getBoundingClientRect().top)))
    expect(new Set(tops).size).toBe(1)
    // Every chip is a 44px target.
    const heights = await chips.evaluateAll(all => all.map(chip => chip.getBoundingClientRect().height))
    for (const height of heights) expect(height).toBeGreaterThanOrEqual(44)

    // The row overflows, signals it, and exposes no scroll-only controls to keyboard or screen reader.
    await expect(row).toHaveAttribute('data-overflow', 'true')
    for (const arrow of await row.locator('button:not([aria-pressed])').all()) {
      await expect(arrow).toHaveAttribute('aria-hidden', 'true')
      await expect(arrow).toHaveAttribute('tabindex', '-1')
    }

    // Tab from chip to chip: each one takes focus and ends up inside the visible part of the row.
    await chips.first().focus()
    for (let index = 0; index < count; index += 1) {
      await expect(chips.nth(index)).toBeFocused()
      await expect.poll(() => chips.nth(index).evaluate((chip) => {
        const scroller = chip.closest('.chip-row__scroller')!.getBoundingClientRect()
        const box = chip.getBoundingClientRect()
        return box.left >= scroller.left - 1 && box.right <= scroller.right + 1
      }), { message: `chip ${index} is scrolled into view` }).toBe(true)
      if (index < count - 1) await page.keyboard.press('Tab')
    }

    // The last room can be chosen from the keyboard.
    await page.keyboard.press('Enter')
    await expect(chips.nth(count - 1)).toHaveAttribute('aria-pressed', 'true')
  })
}

for (const locale of ['vi', 'en'] as const) {
  test(`PI-06 the index heads never share a layout (${locale})`, async ({ page }) => {
    await open(page, '/du-an', 1440, locale)

    const heads = await page.locator('main [data-head]').evaluateAll(all =>
      all.filter(el => el.getBoundingClientRect().height > 0)
        .map(el => ({ layout: el.getAttribute('data-head') ?? '', size: el.getAttribute('data-head-size') })))

    expect(heads.map(head => head.layout)).toEqual(['stacked', 'rail'])
    // The featured section is the page's one lead: the Statement role.
    expect(heads[0]!.size).toBe('statement')
    expect(heads[1]!.size).toBe('headline')
  })
}
