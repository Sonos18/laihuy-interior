import type { Page } from '@playwright/test'
import { expect, test } from './fixtures'

const VIEWPORT_HEIGHT = 900
const EXPECTED_PROJECTS = 11
const GRID_SELECTOR = 'main .grid.gap-7'
const TEST_ORIGIN = process.env.DENSITY_TEST_ORIGIN ?? 'http://localhost:3000'

const BREAKPOINT_CASES = [
  { width: 639, columns: 1 },
  { width: 640, columns: 2 },
  { width: 767, columns: 2 },
  { width: 768, columns: 2 },
  { width: 1023, columns: 2 },
  { width: 1024, columns: 3 },
  { width: 1279, columns: 3 },
  { width: 1280, columns: 3 }
] as const

const TRANSPARENT_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M/wHwAF/gL+X9j7WQAAAABJRU5ErkJggg==',
  'base64'
)

async function settleProjectGrid(page: Page) {
  await page.evaluate(() => document.fonts.ready)
  await page.locator(`${GRID_SELECTOR} > a`).first().waitFor({ state: 'visible' })
  await page.evaluate(() => {
    delete (window as typeof window & { __densityGridSample?: string }).__densityGridSample
  })
  await page.waitForFunction(
    ({ gridSelector, expectedProjects }) => {
      const grid = document.querySelector(gridSelector)
      const cards = grid ? Array.from(grid.querySelectorAll(':scope > a')) : []
      if (!grid || cards.length !== expectedProjects || document.fonts.status !== 'loaded') return false

      const gridRect = grid.getBoundingClientRect()
      const cardRects = cards.map(card => card.getBoundingClientRect())
      const sample = JSON.stringify({
        pageHeight: document.documentElement.scrollHeight,
        grid: [gridRect.left, gridRect.top, gridRect.width, gridRect.height],
        cards: cardRects.map(rect => [rect.left, rect.top, rect.width, rect.height])
      })
      const state = window as typeof window & { __densityGridSample?: string }
      const previous = state.__densityGridSample
      state.__densityGridSample = sample
      return previous === sample
    },
    { gridSelector: GRID_SELECTOR, expectedProjects: EXPECTED_PROJECTS }
  )
}

async function prepareProjectsPage(page: Page, width: number) {
  const consoleErrors: string[] = []
  const pageErrors: string[] = []

  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text())
  })
  page.on('pageerror', error => pageErrors.push(error.message))

  await page.route('**/*', async (route) => {
    if (route.request().resourceType() === 'image') {
      await route.fulfill({ status: 200, contentType: 'image/png', body: TRANSPARENT_PNG })
      return
    }
    await route.continue()
  })

  await page.setViewportSize({ width, height: VIEWPORT_HEIGHT })
  await page.goto(new URL('/du-an', TEST_ORIGIN).toString(), { waitUntil: 'load' })
  await settleProjectGrid(page)

  return { consoleErrors, pageErrors }
}

async function projectGridGeometry(page: Page) {
  return page.locator(GRID_SELECTOR).evaluate((grid) => {
    const cards = Array.from(grid.querySelectorAll<HTMLAnchorElement>(':scope > a'))
    const rects = cards.map(card => card.getBoundingClientRect())
    const computedColumns = getComputedStyle(grid).gridTemplateColumns
      .split(' ')
      .filter(Boolean)
      .length
    const distinctLefts = [...new Set(rects.map(rect => Math.round(rect.left * 2) / 2))]
    const overlapPairs: string[] = []

    for (let leftIndex = 0; leftIndex < rects.length; leftIndex += 1) {
      for (let rightIndex = leftIndex + 1; rightIndex < rects.length; rightIndex += 1) {
        const left = rects[leftIndex]!
        const right = rects[rightIndex]!
        const overlapWidth = Math.min(left.right, right.right) - Math.max(left.left, right.left)
        const overlapHeight = Math.min(left.bottom, right.bottom) - Math.max(left.top, right.top)
        if (overlapWidth > 0.5 && overlapHeight > 0.5) {
          overlapPairs.push(`${leftIndex}:${rightIndex}`)
        }
      }
    }

    const textClipping = cards.flatMap((card, index) =>
      Array.from(card.querySelectorAll<HTMLElement>('h2, p'))
        .filter(element => element.scrollWidth > element.clientWidth + 1
          || element.scrollHeight > element.clientHeight + 1)
        .map(element => `${index}:${element.tagName.toLowerCase()}`)
    )

    return {
      columns: computedColumns,
      distinctLefts: distinctLefts.length,
      cardCount: cards.length,
      cardWidths: rects.map(rect => rect.width),
      cardHeights: rects.map(rect => rect.height),
      overlapPairs,
      textClipping,
      invalidActions: cards
        .map((card, index) => ({ index, href: card.getAttribute('href'), tabIndex: card.tabIndex }))
        .filter(card => !card.href?.startsWith('/du-an/') || card.tabIndex < 0),
      pageHeight: document.documentElement.scrollHeight,
      horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth + 1
    }
  })
}

for (const viewport of BREAKPOINT_CASES) {
  test(`/du-an project grid renders ${viewport.columns} column(s) at ${viewport.width}px`, async ({ page }) => {
    const errors = await prepareProjectsPage(page, viewport.width)
    const geometry = await projectGridGeometry(page)

    expect(geometry.cardCount).toBe(EXPECTED_PROJECTS)
    expect(geometry.columns).toBe(viewport.columns)
    expect(geometry.distinctLefts).toBe(viewport.columns)
    expect(geometry.horizontalOverflow).toBe(false)
    expect(geometry.overlapPairs).toEqual([])
    expect(geometry.textClipping).toEqual([])
    expect(geometry.invalidActions).toEqual([])
    expect(errors.consoleErrors).toEqual([])
    expect(errors.pageErrors).toEqual([])

    await page.locator(`${GRID_SELECTOR} > a`).first().focus()
    await expect(page.locator(`${GRID_SELECTOR} > a`).first()).toBeFocused()
  })
}

test('/du-an no longer has a material one-pixel page-height cliff at 767/768', async ({ page }) => {
  const heights: number[] = []

  for (const width of [767, 768]) {
    await prepareProjectsPage(page, width)
    heights.push((await projectGridGeometry(page)).pageHeight)
  }

  const [height767, height768] = heights as [number, number]
  const differenceRatio = Math.abs(height767 - height768) / Math.max(height767, height768)

  expect(differenceRatio).toBeLessThanOrEqual(0.15)
})
