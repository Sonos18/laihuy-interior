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
    pillars: [
      'Bóc tách kỹ thuật',
      'Hệ thống máy phục vụ sản xuất nội thất dự án',
      'Đội ngũ triển khai dự án'
    ],
    pillarEvidence: {
      pillar1: ['Tiếp nhận bản vẽ & BOQ', 'Bóc tách kỹ thuật'],
      pillar2: ['Cắt & tạo hình', 'Khoan & liên kết', 'Dán cạnh & hoàn thiện', 'Xử lý bề mặt & ép'],
      pillar3: ['Sản xuất, thiết kế và thi công', 'Điều phối dự án', 'QC trước khi giao hàng', 'Thi công tại công trình']
    },
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
    cta: 'Xem năng lực nhà xưởng'
  },
  en: {
    heading: 'Machinery system for project interior manufacturing',
    description: 'The workshop uses a coordinated machinery line across four core stages, controlling precision, surface quality, and schedule for hotel, villa, and premium apartment projects.',
    pillars: [
      'Technical take-off',
      'Machinery system for project interior manufacturing',
      'Project delivery team'
    ],
    pillarEvidence: {
      pillar1: ['Drawing & BOQ intake', 'Technical take-off'],
      pillar2: ['Cutting & shaping', 'Boring & connections', 'Edge banding & finishing', 'Surface treatment & pressing'],
      pillar3: ['Design, production & contracting', 'Project coordination', 'Pre-delivery QC', 'On-site installation']
    },
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

  test(`MACHINERY-CONTENT renders three-pillar Trinity proof in ${locale}`, async ({ page }) => {
    const errors = await prepareHome(page, locale, 1440)
    const section = page.getByTestId('homepage-machinery')
    const pillars = section.getByTestId('homepage-machinery-pillar')

    await expect(pillars).toHaveCount(3)

    const titles = pillars.locator('[data-testid="homepage-machinery-pillar-title"]')
    await expect(titles).toHaveCount(3)
    for (let i = 0; i < copy.pillars.length; i += 1) {
      await expect(titles.nth(i)).toHaveText(copy.pillars[i])
      await expect(pillars.nth(i).getByRole('heading', { level: 3 })).toHaveCount(1)
    }

    // Pillar 01 evidence
    const pillar1Text = (await pillars.nth(0).textContent()) ?? ''
    for (const item of copy.pillarEvidence.pillar1) {
      expect(pillar1Text).toContain(item)
    }

    // Pillar 02 evidence: machinery groups and all 7 machines
    const pillar2Text = (await pillars.nth(1).textContent()) ?? ''
    for (const group of copy.pillarEvidence.pillar2) {
      expect(pillar2Text).toContain(group)
    }
    for (const machine of copy.machines) {
      expect(pillar2Text).toContain(machine)
    }

    // Pillar 03 evidence: project delivery and workflow
    const pillar3Text = (await pillars.nth(2).textContent()) ?? ''
    for (const item of copy.pillarEvidence.pillar3) {
      expect(pillar3Text).toContain(item)
    }

    // Factory real image
    const image = section.getByRole('img', { name: copy.imageAlt, exact: true })
    await expect(image).toHaveAttribute(
      'src',
      /(?:company\/workshop\/3(?:-w\d+)?\.webp|\/images\/hinh-xuong-lai-huy\/3\.jpg)/
    )
    await expect(section.getByTestId('homepage-machinery-caption')).toHaveAttribute('aria-hidden', 'true')

    // Sequence numbers
    const sequences = section.locator('[data-machinery-sequence]')
    await expect(sequences).toHaveCount(3)
    expect(await sequences.evaluateAll(nodes =>
      nodes.every(node => node.getAttribute('aria-hidden') === 'true')
    )).toBe(true)

    // CTA link
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
          image: rect('[data-testid="homepage-machinery-image"]'),
          pillars: Array.from(element.querySelectorAll<HTMLElement>('[data-testid="homepage-machinery-pillar"]')).map((pillar) => {
            const box = pillar.getBoundingClientRect()
            return { top: box.top, bottom: box.bottom, left: box.left, right: box.right, width: box.width, height: box.height }
          }),
          documentWidth: document.documentElement.scrollWidth,
          viewportWidth: document.documentElement.clientWidth
        }
      })

      expect(geometry.documentWidth).toBeLessThanOrEqual(geometry.viewportWidth)
      expect(geometry.pillars).toHaveLength(3)

      if (width < 1024) {
        // Stacked Trinity contract
        for (let i = 1; i < geometry.pillars.length; i += 1) {
          expect(Math.abs(geometry.pillars[i]!.left - geometry.pillars[0]!.left)).toBeLessThanOrEqual(2)
          expect(geometry.pillars[i]!.top).toBeGreaterThan(geometry.pillars[i - 1]!.bottom - 1)
        }
      } else {
        // 3-column Trinity contract
        expect(Math.abs(geometry.pillars[0]!.top - geometry.pillars[1]!.top)).toBeLessThanOrEqual(2)
        expect(Math.abs(geometry.pillars[1]!.top - geometry.pillars[2]!.top)).toBeLessThanOrEqual(2)
        expect(geometry.pillars[0]!.left).toBeLessThan(geometry.pillars[1]!.left)
        expect(geometry.pillars[1]!.left).toBeLessThan(geometry.pillars[2]!.left)
      }

      expect(errors.consoleErrors).toEqual([])
      expect(errors.pageErrors).toEqual([])
    })
  }
}
