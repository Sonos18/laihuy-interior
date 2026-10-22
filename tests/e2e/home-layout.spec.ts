import { expect, test } from './fixtures'
import { APP_ORIGIN } from './origin'

/**
 * Home layout contract for the critique fixes: a lead project image that keeps its 16:10 frame,
 * satellites that are not slivers, a capabilities heading on the shell rail, and a hero scrim
 * light enough for the photograph to read. Reduced motion (fixtures.ts) is fine here: these are
 * pure geometry and computed-style checks.
 */

const HOME = new URL('/', APP_ORIGIN).toString()

async function openHome(page: import('@playwright/test').Page, width: number) {
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

test('HL-04 hero wash is lighter than the retired 0.94 scrim', async ({ page }) => {
  await openHome(page, 1440)
  const image = await page.locator('.home-hero__wash').evaluate(element => getComputedStyle(element).backgroundImage)
  // Computed colours serialise as rgb(r, g, b) (alpha 1, not listed) or rgba(r, g, b, a).
  const alphas = [...image.matchAll(/rgba?\(([^)]+)\)/g)].map((match) => {
    const parts = match[1]!.split(/[\s,/]+/).filter(Boolean)
    return parts.length >= 4 ? Number(parts[3]) : 1
  })
  expect(alphas.length).toBeGreaterThan(0)
  expect(Math.max(...alphas)).toBeLessThanOrEqual(0.8)
})
