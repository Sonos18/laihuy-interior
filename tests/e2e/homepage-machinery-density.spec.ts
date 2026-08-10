import type { Page } from '@playwright/test'
import { expect, test } from './fixtures'

const TEST_ORIGIN = process.env.DENSITY_TEST_ORIGIN ?? 'http://localhost:3000'
const VIEWPORT_HEIGHT = 1000
const TRANSPARENT_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M/wHwAF/gL+X9j7WQAAAABJRU5ErkJggg==',
  'base64'
)

const COPY = {
  vi: {
    heading: 'Hệ thống máy phục vụ sản xuất nội thất dự án',
    description: 'Xưởng ứng dụng hệ thống máy đồng bộ theo bốn công đoạn chính, giúp kiểm soát độ chính xác, chất lượng bề mặt và tiến độ cho các dự án khách sạn, villa và căn hộ cao cấp.',
    groups: ['Cắt & tạo hình', 'Khoan & liên kết', 'Dán cạnh & hoàn thiện', 'Xử lý bề mặt & ép'],
    machines: ['CNC Nesting', 'Cưa bàn trượt', 'Máy khoan liên kết CNC', 'Máy dán cạnh tự động', 'Máy bào cuốn', 'Máy chà nhám thùng', 'Máy ép nguội thủy lực'],
    imageAlt: 'Toàn cảnh hệ thống máy sản xuất tại xưởng Lai Huy',
    cta: 'Xem năng lực nhà xưởng'
  },
  en: {
    heading: 'Machinery system for project interior manufacturing',
    description: 'The workshop uses a coordinated machinery line across four core stages, controlling precision, surface quality, and schedule for hotel, villa, and premium apartment projects.',
    groups: ['Cutting & shaping', 'Boring & connections', 'Edge banding & finishing', 'Surface treatment & pressing'],
    machines: ['CNC nesting router', 'Sliding table saw', 'CNC boring machine', 'Automatic edge bander', 'Thickness planer', 'Wide-belt sander', 'Hydraulic cold press'],
    imageAlt: 'Overview of the machinery line inside the Lai Huy workshop',
    cta: 'View factory capability'
  }
} as const

const WIDTHS = [390, 767, 768, 1023, 1024, 1279, 1280, 1440] as const
const BLOCK_HEIGHT_LIMITS = new Map<number, number>([
  [390, 1475],
  [768, 1280],
  [1440, 870]
])

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

  test(`MACHINERY-CONTENT renders grouped workshop proof in ${locale}`, async ({ page }) => {
    const errors = await prepareHome(page, locale, 1440)
    const section = page.getByTestId('homepage-machinery')
    const cards = section.getByTestId('homepage-machinery-card')

    await expect(section.getByRole('heading', { level: 3, name: copy.heading, exact: true })).toHaveCount(1)
    await expect(section.getByTestId('homepage-machinery-description')).toHaveText(copy.description)
    await expect(cards).toHaveCount(4)
    await expect(cards.locator('h4')).toHaveText(copy.groups)

    const machineCopy = (await cards.allTextContents()).join(' ')
    for (const machine of copy.machines) expect(machineCopy).toContain(machine)

    const image = section.getByRole('img', { name: copy.imageAlt, exact: true })
    await expect(image).toHaveAttribute(
      'src',
      /(?:company\/workshop\/3(?:-w\d+)?\.webp|\/images\/hinh-xuong-lai-huy\/3\.jpg)/
    )
    await expect(section.getByTestId('homepage-machinery-caption')).toHaveAttribute('aria-hidden', 'true')
    const sequences = section.locator('[data-machinery-sequence]')
    await expect(sequences).toHaveCount(4)
    expect(await sequences.evaluateAll(nodes =>
      nodes.every(node => node.getAttribute('aria-hidden') === 'true')
    )).toBe(true)

    const cta = section.getByRole('link', { name: copy.cta, exact: true })
    await expect(cta).toHaveAttribute('href', '/nha-xuong')
    await cta.focus()
    await expect(cta).toBeFocused()

    expect(errors.consoleErrors).toEqual([])
    expect(errors.pageErrors).toEqual([])
  })

  for (const width of WIDTHS) {
    test(`MACHINERY-LAYOUT keeps the approved geometry at ${width}px in ${locale}`, async ({ page }) => {
      const errors = await prepareHome(page, locale, width)
      const section = page.getByTestId('homepage-machinery')
      const geometry = await section.evaluate((element) => {
        const rect = (selector: string) => {
          const target = element.matches(selector)
            ? element as HTMLElement
            : element.querySelector<HTMLElement>(selector)
          if (!target) throw new Error(`Missing machinery selector: ${selector}`)
          const box = target.getBoundingClientRect()
          return { top: box.top, right: box.right, bottom: box.bottom, left: box.left, width: box.width, height: box.height }
        }

        return {
          block: rect('[data-testid="homepage-machinery"]'),
          title: rect('[data-testid="homepage-machinery-title"]'),
          description: rect('[data-testid="homepage-machinery-description"]'),
          image: rect('[data-testid="homepage-machinery-image"]'),
          groups: rect('[data-testid="homepage-machinery-groups"]'),
          cards: Array.from(element.querySelectorAll<HTMLElement>('[data-testid="homepage-machinery-card"]')).map((card) => {
            const box = card.getBoundingClientRect()
            return { top: box.top, left: box.left }
          }),
          documentWidth: document.documentElement.scrollWidth,
          viewportWidth: document.documentElement.clientWidth
        }
      })

      expect(geometry.title.bottom).toBeLessThanOrEqual(geometry.description.top + 1)
      expect(Math.abs(geometry.title.left - geometry.description.left)).toBeLessThanOrEqual(2)
      expect(geometry.documentWidth).toBeLessThanOrEqual(geometry.viewportWidth)
      expect(geometry.cards).toHaveLength(4)

      if (width >= 1024) {
        const imageShare = geometry.image.width / (geometry.image.width + geometry.groups.width)
        expect(imageShare).toBeGreaterThanOrEqual(0.53)
        expect(imageShare).toBeLessThanOrEqual(0.57)
        expect(Math.abs(geometry.image.top - geometry.groups.top)).toBeLessThanOrEqual(2)
        expect(Math.abs(geometry.image.bottom - geometry.groups.bottom)).toBeLessThanOrEqual(2)
      } else {
        expect(geometry.image.bottom).toBeLessThanOrEqual(geometry.groups.top)
        const imageRatio = geometry.image.width / geometry.image.height
        if (width >= 768) {
          expect(imageRatio).toBeGreaterThan(1.70)
          expect(imageRatio).toBeLessThan(1.84)
        } else {
          expect(imageRatio).toBeGreaterThan(1.27)
          expect(imageRatio).toBeLessThan(1.40)
        }
      }

      if (width >= 768) {
        expect(Math.abs(geometry.cards[0]!.top - geometry.cards[1]!.top)).toBeLessThanOrEqual(2)
        expect(geometry.cards[0]!.left).toBeLessThan(geometry.cards[1]!.left)
        expect(geometry.cards[2]!.top).toBeGreaterThan(geometry.cards[0]!.top)
      } else {
        for (let index = 1; index < geometry.cards.length; index += 1) {
          expect(Math.abs(geometry.cards[index]!.left - geometry.cards[0]!.left)).toBeLessThanOrEqual(2)
          expect(geometry.cards[index]!.top).toBeGreaterThan(geometry.cards[index - 1]!.top)
        }
      }

      const blockHeightLimit = BLOCK_HEIGHT_LIMITS.get(width)
      if (blockHeightLimit) expect(geometry.block.height).toBeLessThan(blockHeightLimit)

      expect(errors.consoleErrors).toEqual([])
      expect(errors.pageErrors).toEqual([])
    })
  }
}
