import type { Page } from '@playwright/test'
import { expect, test } from './fixtures'
import { APP_ORIGIN } from './origin'

const TEST_ORIGIN = process.env.DENSITY_TEST_ORIGIN ?? APP_ORIGIN
const VIEWPORT_HEIGHT = 1000
const TRANSPARENT_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M/wHwAF/gL+X9j7WQAAAABJRU5ErkJggg==',
  'base64'
)

const COPY = {
  vi: {
    heading: 'Hệ thống máy phục vụ sản xuất nội thất dự án',
    description: 'Xưởng ứng dụng hệ thống máy đồng bộ theo bốn công đoạn chính, giúp kiểm soát độ chính xác, chất lượng bề mặt và tiến độ cho các dự án khách sạn, villa và căn hộ cao cấp.',
    // Evidence blocks that live on /nha-xuong and must not return to the home page.
    removedEvidence: ['Tiếp nhận bản vẽ & BOQ', 'Cắt & tạo hình', 'Khoan & liên kết', 'Dán cạnh & hoàn thiện', 'Xử lý bề mặt & ép', 'Điều phối dự án', 'QC trước khi giao hàng', 'Lắp đặt tại công trình'],
    machines: [
      'CNC Nesting',
      'Cưa bàn trượt',
      'Máy khoan liên kết CNC',
      'Máy dán cạnh tự động',
      'Máy bào cuốn',
      'Máy chà nhám thùng',
      'Máy ép nguội thủy lực'
    ],
    imageAlt: 'Toàn cảnh hệ thống máy sản xuất tại xưởng Lai Huy',
    title: 'Kiểm soát tại nguồn',
    detailsTitle: 'Xưởng Lai Huy · Vĩnh Long',
    detailLabels: ['Diện tích', 'Vị trí', 'Công suất', 'Máy móc', 'Kiểm tra chất lượng'],
    cta: 'Xem năng lực nhà xưởng'
  },
  en: {
    heading: 'Machinery built for project interiors',
    description: 'The workshop uses a coordinated machinery line across four core stages, controlling precision, surface quality, and schedule for hotel, villa, and premium apartment projects.',
    removedEvidence: ['Drawing & BOQ intake', 'Cutting & shaping', 'Boring & connections', 'Edge banding & finishing', 'Surface treatment & pressing', 'Project coordination', 'Pre-delivery QC', 'On-site installation'],
    machines: [
      'CNC nesting router',
      'Sliding table saw',
      'CNC boring machine',
      'Automatic edge bander',
      'Thickness planer',
      'Wide-belt sander',
      'Hydraulic cold press'
    ],
    imageAlt: 'Overview of the machinery line inside the Lai Huy workshop',
    title: 'Control at the source',
    detailsTitle: 'Lai Huy factory · Vinh Long',
    detailLabels: ['Area', 'Location', 'Capacity', 'Machinery', 'Quality checks'],
    cta: 'View factory capability'
  }
} as const

const WIDTHS = [390, 767, 768, 1023, 1024, 1279, 1280, 1440] as const

type MachineryLocale = keyof typeof COPY

async function prepareHome(page: Page, locale: MachineryLocale, width: number) {
  const consoleErrors: string[] = []
  const pageErrors: string[] = []

  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text())
  })
  page.on('pageerror', error => pageErrors.push(error.message))

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

  await page.setViewportSize({ width, height: VIEWPORT_HEIGHT })
  await page.goto(new URL('/', TEST_ORIGIN).toString(), { waitUntil: 'load' })
  await page.evaluate(() => document.fonts.ready)
  await expect(page.locator('html')).toHaveAttribute('lang', locale)

  return { consoleErrors, pageErrors }
}

for (const locale of ['vi', 'en'] as const) {
  const copy = COPY[locale]

  // Owner decisions (2026-10-23/24): the home factory section is a title, one photograph with
  // the factory facts on it, and a link. No eyebrow, monument, pillars or machinery evidence.
  test(`MACHINERY-CONTENT is head, photograph with facts, and link in ${locale}`, async ({ page }) => {
    const errors = await prepareHome(page, locale, 1440)
    const section = page.getByTestId('homepage-machinery')

    await expect(section.getByRole('heading', { level: 2 })).toHaveText(copy.title)
    await expect(section.locator('[data-head]')).toHaveAttribute('data-head', 'stacked')
    await expect(section.locator('.section-head__eyebrow')).toHaveCount(0)
    // The facts are always in the accessibility tree, whether or not the panel is raised.
    const details = section.getByTestId('homepage-machinery-details')
    await expect(details.getByRole('heading', { level: 3 })).toHaveText(copy.detailsTitle)
    await expect(details.locator('dt')).toHaveText(copy.detailLabels)
    await expect(details.locator('dd')).toHaveCount(copy.detailLabels.length)
    expect(await details.evaluate(el => el.closest('[aria-hidden="true"]') === null)).toBe(true)
    await expect(section.getByTestId('homepage-machinery-pillar')).toHaveCount(0)
    await expect(section.locator('[data-monument]')).toHaveCount(0)

    const sectionText = (await section.textContent()) ?? ''
    for (const item of copy.removedEvidence) expect(sectionText).not.toContain(item)
    for (const machine of copy.machines) expect(sectionText).not.toContain(machine)

    const image = section.getByRole('img', { name: copy.imageAlt, exact: true })
    await expect(image).toHaveAttribute(
      'src',
      /(?:company\/workshop\/3(?:-w\d+)?\.webp|\/images\/hinh-xuong-lai-huy\/3\.jpg)/
    )
    await expect(section.getByTestId('homepage-machinery-caption')).toHaveCount(0)

    const cta = section.getByRole('link', { name: copy.cta, exact: true })
    await expect(cta).toHaveAttribute('href', '/nha-xuong')
    await cta.focus()
    await expect(cta).toBeFocused()

    expect(errors.consoleErrors).toEqual([])
    expect(errors.pageErrors).toEqual([])
  })

  for (const width of WIDTHS) {
    test(`MACHINERY-LAYOUT keeps head, photograph and link in order at ${width}px in ${locale}`, async ({ page }) => {
      const errors = await prepareHome(page, locale, width)
      const section = page.getByTestId('homepage-machinery')
      const geometry = await section.evaluate((element) => {
        const rect = (target: Element) => {
          const box = target.getBoundingClientRect()
          return { top: box.top, bottom: box.bottom, left: box.left, right: box.right, height: box.height }
        }
        const shell = element.querySelector<HTMLElement>('.shell')!
        const shellStyle = getComputedStyle(shell)
        const shellBox = shell.getBoundingClientRect()
        return {
          block: rect(element),
          heading: rect(element.querySelector('h2')!),
          image: rect(element.querySelector('[data-testid="homepage-machinery-image"]')!),
          cta: rect(element.querySelector('[data-testid="homepage-machinery-cta"]')!),
          railLeft: shellBox.left + Number.parseFloat(shellStyle.paddingLeft),
          railRight: shellBox.right - Number.parseFloat(shellStyle.paddingRight),
          documentWidth: document.documentElement.scrollWidth,
          viewportWidth: document.documentElement.clientWidth
        }
      })

      expect(geometry.documentWidth).toBeLessThanOrEqual(geometry.viewportWidth)
      expect(geometry.image.top).toBeGreaterThan(geometry.heading.bottom)
      expect(geometry.cta.top).toBeGreaterThan(geometry.image.bottom)
      expect(Math.abs(geometry.image.left - geometry.railLeft)).toBeLessThanOrEqual(1)
      expect(Math.abs(geometry.image.right - geometry.railRight)).toBeLessThanOrEqual(1)
      // The section stays about one screen tall on desktop (it was close to two).
      if (width >= 1280) expect(geometry.block.height).toBeLessThanOrEqual(1100)

      expect(errors.consoleErrors).toEqual([])
      expect(errors.pageErrors).toEqual([])
    })
  }
}

// From 768px on a hover-capable pointer the facts sit on the photograph: only the panel's
// heading strip shows at rest, the panel rises on hover and on keyboard focus. On a phone (or
// any touch-only pointer) the panel is a static list below the photograph.
for (const width of [768, 1440] as const) {
  test(`HFP-03 the factory facts rise over the photograph on hover and focus at ${width}px`, async ({ page }) => {
    const errors = await prepareHome(page, 'vi', width)
    const section = page.getByTestId('homepage-machinery')
    const details = section.getByTestId('homepage-machinery-details')
    const frame = section.locator('[role="group"][tabindex="0"]')
    const visibleShare = () => details.evaluate((el) => {
      const panel = el.getBoundingClientRect()
      const photo = el.parentElement!.querySelector('[data-testid="homepage-machinery-image"]')!.getBoundingClientRect()
      return (photo.bottom - Math.max(panel.top, photo.top)) / panel.height
    })

    await section.getByRole('heading', { level: 2 }).scrollIntoViewIfNeeded()
    expect(await details.evaluate(el => getComputedStyle(el).position)).toBe('absolute')
    expect(await visibleShare()).toBeLessThan(0.5)

    await frame.hover()
    await expect.poll(visibleShare).toBeGreaterThan(0.99)

    await page.mouse.move(0, 0)
    await expect.poll(visibleShare).toBeLessThan(0.5)
    await frame.focus()
    await expect.poll(visibleShare).toBeGreaterThan(0.99)

    expect(errors.consoleErrors).toEqual([])
    expect(errors.pageErrors).toEqual([])
  })
}

test('HFP-04 on a phone the factory facts are a static list below the photograph', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 375, height: VIEWPORT_HEIGHT }, hasTouch: true, isMobile: true })
  const page = await context.newPage()
  await prepareHome(page, 'vi', 375)
  const section = page.getByTestId('homepage-machinery')
  const geometry = await section.evaluate((el) => {
    const details = el.querySelector<HTMLElement>('[data-testid="homepage-machinery-details"]')!
    return {
      position: getComputedStyle(details).position,
      detailsTop: details.getBoundingClientRect().top,
      photoBottom: el.querySelector('[data-testid="homepage-machinery-image"]')!.getBoundingClientRect().bottom
    }
  })
  expect(geometry.position).toBe('static')
  expect(geometry.detailsTop).toBeGreaterThanOrEqual(geometry.photoBottom)
  await context.close()
})

/** Visible text elements under `root` whose computed font-size is below 12px. */
async function findTinyText(page: Page, rootSelector: string) {
  return page.evaluate((selector) => {
    const root = document.querySelector(selector)
    if (!root) throw new Error(`Missing root: ${selector}`)
    const tiny = new Set<string>()
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      if (!node.textContent?.trim()) continue
      const element = node.parentElement
      if (!element || element.closest('script, style, noscript')) continue
      const style = getComputedStyle(element)
      const box = element.getBoundingClientRect()
      if (style.display === 'none' || style.visibility === 'hidden' || box.width === 0 || box.height === 0) continue
      if (Number.parseFloat(style.fontSize) < 12) {
        tiny.add(`${element.tagName.toLowerCase()}.${[...element.classList].join('.')} ${style.fontSize} "${node.textContent.trim().slice(0, 24)}"`)
      }
    }
    return [...tiny]
  }, rootSelector)
}

test('HFP-02 no text in the factory section is under 12px and it links to /nha-xuong', async ({ page }) => {
  await prepareHome(page, 'vi', 1440)
  expect(await findTinyText(page, '[data-testid="homepage-machinery"]')).toEqual([])
  await expect(page.getByTestId('homepage-machinery').locator('a[href="/nha-xuong"]').first()).toBeVisible()
})

for (const width of [1440, 375] as const) {
  test(`HOME-RAMP no visible text on the home page is under 12px at ${width}px`, async ({ page }) => {
    // Motion allowed: the desktop story's measure ticks only render while it is enhanced.
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await prepareHome(page, 'vi', width)
    expect(await findTinyText(page, 'main')).toEqual([])
  })
}
