import type { Page } from '@playwright/test'
import { expect, test } from './fixtures'

const TEST_ORIGIN = process.env.DENSITY_TEST_ORIGIN ?? 'http://localhost:3000'
const TRANSPARENT_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M/wHwAF/gL+X9j7WQAAAABJRU5ErkJggg==',
  'base64'
)

const COPY = {
  vi: {
    hero: 'Biến hồ sơ kỹ thuật thành không gian hoàn thiện',
    story: 'Từ hồ sơ kỹ thuật đến không gian hoàn thiện',
    stages: ['Hồ sơ kỹ thuật', 'Vật liệu & mẫu', 'Sản xuất trực tiếp', 'Không gian hoàn thiện'],
    capabilities: ['Thiết kế kỹ thuật', 'Sản xuất trực tiếp', 'Thi công & bàn giao'],
    cta: 'Gửi hồ sơ dự án'
  },
  en: {
    hero: 'Turning technical documents into completed spaces',
    story: 'From technical documentation to completed space',
    stages: ['Technical documents', 'Materials & samples', 'Direct manufacturing', 'Completed space'],
    capabilities: ['Technical design', 'Direct manufacturing', 'Fit-out & handover'],
    cta: 'Send project documents'
  }
} as const

type HomeLocale = keyof typeof COPY

async function prepareHome(page: Page, locale: HomeLocale, width: number, reducedMotion: 'reduce' | 'no-preference') {
  const consoleErrors: string[] = []
  const pageErrors: string[] = []

  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text())
  })
  page.on('pageerror', error => pageErrors.push(error.message))

  await page.emulateMedia({ reducedMotion })
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
  await page.goto(new URL('/', TEST_ORIGIN).toString(), { waitUntil: 'load' })
  await page.evaluate(() => document.fonts.ready)

  return { consoleErrors, pageErrors }
}

for (const locale of ['vi', 'en'] as const) {
  test(`HOME-STORY renders the complete conversion narrative in ${locale}`, async ({ page }) => {
    const errors = await prepareHome(page, locale, 1440, 'reduce')
    const copy = COPY[locale]

    await expect(page.getByTestId('home-hero').getByRole('heading', { level: 1, name: copy.hero, exact: true })).toHaveCount(1)

    const story = page.getByTestId('home-material-story')
    await expect(story.getByRole('heading', { level: 2, name: copy.story, exact: true })).toHaveCount(1)
    await expect(story.getByTestId('home-story-stage')).toHaveCount(4)
    await expect(story.locator('[data-stage-label]')).toHaveText(copy.stages)

    const capabilities = page.getByTestId('home-capabilities')
    await expect(capabilities.getByTestId('home-capability')).toHaveCount(3)
    await expect(capabilities.locator('h3')).toHaveText(copy.capabilities)

    await expect(page.getByTestId('home-projects').locator('a[data-project-card]')).toHaveCount(3)
    await expect(page.getByTestId('homepage-machinery').getByTestId('homepage-machinery-card')).toHaveCount(4)
    await expect(page.getByTestId('home-process').getByTestId('home-process-step')).toHaveCount(6)

    const ctaLinks = page.getByTestId('home-project-cta').getByRole('link', { name: copy.cta, exact: true })
    await expect(ctaLinks).toHaveCount(1)
    await expect(ctaLinks).toHaveAttribute('href', '/lien-he')

    expect(errors.consoleErrors).toEqual([])
    expect(errors.pageErrors).toEqual([])
  })
}

for (const width of [390, 767, 768, 1279, 1280, 1440] as const) {
  test(`HOME-STORY uses the approved responsive motion mode at ${width}px`, async ({ page }) => {
    const errors = await prepareHome(page, 'vi', width, 'no-preference')
    const story = page.getByTestId('home-material-story')
    const sticky = page.getByTestId('home-story-sticky')

    const geometry = await story.evaluate((element) => {
      const stickyElement = element.querySelector<HTMLElement>('[data-testid="home-story-sticky"]')
      if (!stickyElement) throw new Error('Missing home story sticky scene')
      const box = element.getBoundingClientRect()
      return {
        height: box.height,
        stickyPosition: getComputedStyle(stickyElement).position,
        documentWidth: document.documentElement.scrollWidth,
        viewportWidth: document.documentElement.clientWidth
      }
    })

    expect(geometry.documentWidth).toBeLessThanOrEqual(geometry.viewportWidth)
    await expect(sticky).toBeVisible()

    if (width >= 768) {
      expect(geometry.stickyPosition).toBe('sticky')
      expect(geometry.height).toBeGreaterThanOrEqual(1800)
    } else {
      expect(geometry.stickyPosition).not.toBe('sticky')
      await expect(story.locator('[data-mobile-frame]')).toHaveCount(4)
    }

    expect(errors.consoleErrors).toEqual([])
    expect(errors.pageErrors).toEqual([])
  })
}

test('HOME-STORY reduces motion to a normal-flow editorial composition', async ({ page }) => {
  const errors = await prepareHome(page, 'vi', 1440, 'reduce')
  const story = page.getByTestId('home-material-story')
  const stickyPosition = await page.getByTestId('home-story-sticky').evaluate(element => getComputedStyle(element).position)
  const fallbackGeometry = await story.evaluate((element) => {
    const stage = element.querySelector<HTMLElement>('.home-material-story__stage')
    const layeredMedia = element.querySelector<HTMLElement>('.home-material-story__media')
    const copy = element.querySelector<HTMLElement>('.home-material-story__copy')
    if (!stage || !layeredMedia || !copy) throw new Error('Missing reduced-motion story structure')

    return {
      stageDisplay: getComputedStyle(stage).display,
      layeredMediaDisplay: getComputedStyle(layeredMedia).display,
      stageWidth: stage.getBoundingClientRect().width,
      copyWidth: copy.getBoundingClientRect().width
    }
  })
  const frames = story.locator('[data-mobile-frame]')

  expect(stickyPosition).not.toBe('sticky')
  expect(fallbackGeometry.stageDisplay).toBe('block')
  expect(fallbackGeometry.layeredMediaDisplay).toBe('none')
  expect(fallbackGeometry.copyWidth).toBeCloseTo(fallbackGeometry.stageWidth, 0)
  await expect(frames).toHaveCount(4)

  for (const frame of await frames.all()) {
    const media = frame.locator('.home-material-story__mobile-media')
    const image = media.locator('img')
    await expect(media).toBeVisible()
    await expect(image).toBeVisible()

    const box = await media.evaluate((element) => {
      const rect = element.getBoundingClientRect()
      return { width: rect.width, height: rect.height }
    })
    expect(box.width).toBeGreaterThan(0)
    expect(box.height).toBeGreaterThan(0)
  }

  expect(errors.consoleErrors).toEqual([])
  expect(errors.pageErrors).toEqual([])
})

test('HOME-STORY maps desktop scroll to start, middle, and final progress', async ({ page }) => {
  const errors = await prepareHome(page, 'vi', 1440, 'no-preference')
  const story = page.getByTestId('home-material-story')
  const range = await story.evaluate((element) => {
    const rect = element.getBoundingClientRect()
    return {
      top: window.scrollY + rect.top,
      distance: rect.height - window.innerHeight
    }
  })

  const readProgressAt = async (scrollY: number) => {
    await page.evaluate(y => window.scrollTo(0, y), scrollY)
    await page.evaluate(() => new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))))
    return story.evaluate(element => Number.parseFloat((element as HTMLElement).style.getPropertyValue('--story-progress')))
  }

  expect(await readProgressAt(range.top)).toBeLessThanOrEqual(0.05)
  const middle = await readProgressAt(range.top + range.distance / 2)
  expect(middle).toBeGreaterThanOrEqual(0.45)
  expect(middle).toBeLessThanOrEqual(0.55)
  expect(await readProgressAt(range.top + range.distance)).toBeGreaterThanOrEqual(0.95)

  expect(errors.consoleErrors).toEqual([])
  expect(errors.pageErrors).toEqual([])
})
