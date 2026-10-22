import { expect, test } from './fixtures'
import { APP_ORIGIN } from './origin'

/**
 * Home layout contract for the critique fixes: a lead project image that keeps its 16:10 frame,
 * satellites that are not slivers, a capabilities heading on the shell rail, and a hero scrim
 * light enough for the photograph to read. Reduced motion (fixtures.ts) is fine here: these are
 * pure geometry and computed-style checks.
 */

const HOME = new URL('/', APP_ORIGIN).toString()

async function openHome(page: import('@playwright/test').Page, width: number, locale: 'vi' | 'en' = 'vi') {
  await page.context().addCookies([{ name: 'lai-huy-locale', value: locale, url: APP_ORIGIN }])
  await page.setViewportSize({ width, height: 900 })
  await page.goto(HOME, { waitUntil: 'load' })
  await page.evaluate(() => document.fonts.ready)
}

for (const width of [375, 767, 768, 1023, 1024, 1279, 1280, 1440]) {
  test(`HL-01 lead project media is 16:10 at ${width}px`, async ({ page }) => {
    await openHome(page, width)
    const box = await page.locator('.home-projects__card--hero .home-projects__media').evaluate((element) => {
      const rect = element.getBoundingClientRect()
      return { width: rect.width, height: rect.height }
    })
    expect(box.height).toBeGreaterThan(0)
    const ratio = box.width / box.height
    expect(ratio).toBeGreaterThanOrEqual(1.55)
    expect(ratio).toBeLessThanOrEqual(1.65)
  })
}

for (const width of [1024, 1280, 1440]) {
  test(`HL-02 satellites are not slivers at ${width}px`, async ({ page }) => {
    await openHome(page, width)
    const satellites = await page.locator('.home-projects__card--satellite').evaluateAll(cards =>
      cards.map((card) => {
        const media = card.querySelector('.home-projects__media')!.getBoundingClientRect()
        const outer = card.getBoundingClientRect()
        return { share: media.width / outer.width, height: media.height }
      })
    )
    expect(satellites).toHaveLength(2)
    for (const satellite of satellites) {
      expect(satellite.share).toBeGreaterThanOrEqual(0.38)
      expect(satellite.height).toBeGreaterThanOrEqual(160)
    }
  })
}

// A classic scrollbar takes 15-17px of layout width without changing the media-query viewport, so
// at a 1024px window the two-column rules apply to a 1007px page. Headless Chromium hides its
// scrollbars, so the loss is simulated by narrowing the root to the width a 17px bar leaves.
test('HL-02 satellites keep the height floor at 1024px with a 17px scrollbar', async ({ page }) => {
  await openHome(page, 1024)
  await page.addStyleTag({ content: 'html { width: 1007px; }' })
  await page.evaluate(() => document.fonts.ready)
  expect(await page.evaluate(() => document.documentElement.getBoundingClientRect().width)).toBe(1007)

  const media = await page.locator('.home-projects__card--satellite .home-projects__media').evaluateAll(
    elements => elements.map(element => element.getBoundingClientRect().height)
  )
  expect(media).toHaveLength(2)
  for (const height of media) {
    expect(height).toBeGreaterThanOrEqual(160)
  }
})

for (const width of [320, 375, 767, 768, 1023, 1024, 1279, 1280, 1440]) {
  test(`HL-05 satellite media is landscape at ${width}px`, async ({ page }) => {
    await openHome(page, width)
    const boxes = await page.locator('.home-projects__card--satellite .home-projects__media').evaluateAll(
      media => media.map((element) => {
        const rect = element.getBoundingClientRect()
        return { width: rect.width, height: rect.height }
      })
    )
    expect(boxes).toHaveLength(2)
    for (const box of boxes) {
      expect(box.height).toBeGreaterThan(0)
      expect(box.width).toBeGreaterThanOrEqual(box.height)
    }
  })
}

for (const locale of ['vi', 'en'] as const) {
  for (const width of [320, 375, 640, 768, 1024, 1280, 1440]) {
    test(`HL-06 tag pill and number badge never overlap (${locale}, ${width}px)`, async ({ page }) => {
      await openHome(page, width, locale)
      const media = await page.locator('.home-projects__media').evaluateAll(
        elements => elements.map((element) => {
          const box = (selector: string) => {
            const target = element.querySelector(selector)
            if (!target || getComputedStyle(target).display === 'none') return null
            const rect = target.getBoundingClientRect()
            return { left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom }
          }
          const frame = element.getBoundingClientRect()
          return {
            frame: { left: frame.left, right: frame.right },
            pill: box('.home-projects__tag-pill'),
            badge: box('.home-projects__index')
          }
        })
      )
      expect(media).toHaveLength(3)
      for (const { frame, pill, badge } of media) {
        expect(badge).not.toBeNull()
        if (!pill || !badge) continue
        // Horizontal separation is what matters: both sit on the same top row of the media.
        expect(pill.right).toBeLessThanOrEqual(badge.left)
        expect(pill.left).toBeGreaterThanOrEqual(frame.left)
        expect(badge.right).toBeLessThanOrEqual(frame.right)
      }
    })
  }
}

for (const width of [768, 1280, 1440]) {
  test(`HL-03 capabilities heading sits on the shell rail at ${width}px`, async ({ page }) => {
    await openHome(page, width)
    const edges = await page.getByTestId('home-capabilities').evaluate((section) => {
      const shell = section.querySelector('.shell')!
      const heading = section.querySelector('h2')!
      const shellStyle = getComputedStyle(shell)
      const contentLeft = shell.getBoundingClientRect().left + Number.parseFloat(shellStyle.paddingLeft)
      return { contentLeft, headingLeft: heading.getBoundingClientRect().left }
    })
    expect(Math.abs(edges.headingLeft - edges.contentLeft)).toBeLessThanOrEqual(1)
  })
}

for (const width of [375, 1440]) {
  test(`HL-04 hero wash is lighter than the retired 0.94 scrim at ${width}px`, async ({ page }) => {
    await openHome(page, width)
    const image = await page.locator('.home-hero__wash').evaluate(element => getComputedStyle(element).backgroundImage)
    // Computed colours serialise as rgb(r, g, b) (alpha 1, not listed) or rgba(r, g, b, a).
    const alphas = [...image.matchAll(/rgba?\(([^)]+)\)/g)].map((match) => {
      const parts = match[1]!.split(/[\s,/]+/).filter(Boolean)
      return parts.length >= 4 ? Number(parts[3]) : 1
    })
    expect(alphas.length).toBeGreaterThan(0)
    expect(Math.max(...alphas)).toBeLessThanOrEqual(0.8)
  })
}

// The proof band is the first content band of the Linen canvas, not a box inside the hero.
for (const locale of ['vi', 'en'] as const) {
  for (const width of [375, 768, 1440]) {
    test(`HL-07 metrics band sits below the hero on Linen with aligned cells (${locale}, ${width}px)`, async ({ page }) => {
      await openHome(page, width, locale)
      const hero = page.getByTestId('home-hero')
      const band = page.getByTestId('home-metrics')
      await expect(hero.getByTestId('home-metrics')).toHaveCount(0)
      await expect(band).toHaveCount(1)

      const geometry = await page.evaluate(() => {
        const heroBox = document.querySelector('[data-testid=home-hero]')!.getBoundingClientRect()
        const bandEl = document.querySelector<HTMLElement>('[data-testid=home-metrics]')!
        const bandBox = bandEl.getBoundingClientRect()
        const baselineOf = (element: Element) => {
          const probe = document.createElement('span')
          probe.style.cssText = 'display:inline-block;width:0;height:0'
          element.prepend(probe)
          const y = probe.getBoundingClientRect().bottom
          probe.remove()
          return y
        }
        const cells = [...document.querySelectorAll('[data-testid=home-metric]')].map((cell) => {
          const label = cell.querySelector('dt')!
          const value = cell.querySelector('dd')!
          const lineHeight = Number.parseFloat(getComputedStyle(value).lineHeight)
          return {
            top: cell.getBoundingClientRect().top,
            height: cell.getBoundingClientRect().height,
            labelBaseline: baselineOf(label),
            valueBaseline: baselineOf(value),
            valueLines: Math.round(value.getBoundingClientRect().height / lineHeight)
          }
        })
        return {
          gap: bandBox.top - heroBox.bottom,
          background: getComputedStyle(bandEl).backgroundColor,
          cells
        }
      })

      expect(Math.abs(geometry.gap)).toBeLessThanOrEqual(1)
      expect(geometry.background).toBe('rgb(250, 246, 240)')
      expect(geometry.cells).toHaveLength(4)
      for (const cell of geometry.cells) expect(cell.valueLines).toBeLessThanOrEqual(2)
      // Cells that share a grid row share a top, a height, a label baseline and a value baseline.
      const rows = new Map<number, typeof geometry.cells>()
      for (const cell of geometry.cells) {
        const key = Math.round(cell.top)
        rows.set(key, [...(rows.get(key) ?? []), cell])
      }
      expect(rows.size).toBe(width >= 1024 ? 1 : 2)
      for (const row of rows.values()) {
        for (const cell of row) {
          expect(Math.abs(cell.height - row[0]!.height)).toBeLessThanOrEqual(1)
          expect(Math.abs(cell.labelBaseline - row[0]!.labelBaseline)).toBeLessThanOrEqual(1)
          expect(Math.abs(cell.valueBaseline - row[0]!.valueBaseline)).toBeLessThanOrEqual(1)
        }
      }
    })
  }
}

// A phone frames the furnished room, not the ceiling: the 1499x830 photograph is height-bound,
// so the only lever is the horizontal object-position.
test('HL-08 hero photograph is cropped toward the furnished room on a phone', async ({ page }) => {
  await openHome(page, 375)
  const position = await page.locator('.home-hero__image').evaluate(element => getComputedStyle(element).objectPosition)
  expect(Number.parseFloat(position.split(' ')[0]!)).toBeGreaterThanOrEqual(70)
  await page.setViewportSize({ width: 1440, height: 900 })
  const wide = await page.locator('.home-hero__image').evaluate(element => getComputedStyle(element).objectPosition)
  expect(Number.parseFloat(wide.split(' ')[0]!)).toBe(50)
})
