import type { Page } from '@playwright/test'
import { expect, test } from './fixtures'

const VIEWPORT_HEIGHT = 900
const TEST_ORIGIN = process.env.DENSITY_TEST_ORIGIN ?? 'http://localhost:3000'
const KNOWN_ENGLISH_HYDRATION_ERROR = 'Hydration completed but contains mismatches.'
const TRANSPARENT_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M/wHwAF/gL+X9j7WQAAAABJRU5ErkJggg==',
  'base64'
)

const WORKFLOW_COPY = {
  vi: {
    heading: 'Từ bản vẽ đến bàn giao công trình',
    titles: [
      'Tiếp nhận bản vẽ & BOQ',
      'Bóc tách kỹ thuật',
      'Điều phối dự án',
      'Sản xuất tại xưởng',
      'QC trước khi giao hàng',
      'Thi công tại công trình'
    ],
    descriptions: [
      'Rà soát hồ sơ, phạm vi công việc, vật liệu, tiến độ và tiêu chuẩn hoàn thiện trước khi triển khai.',
      'Chuyển đổi bản vẽ thiết kế thành hồ sơ sản xuất, danh mục vật tư và kế hoạch triển khai.',
      'Theo dõi tiến độ sản xuất, giao hàng và phối hợp thi công theo từng giai đoạn dự án.',
      'Sản xuất module nội thất theo hồ sơ kỹ thuật, kiểm soát kích thước, vật liệu và chất lượng hoàn thiện.',
      'Kiểm tra kích thước, bề mặt, phụ kiện và phân loại theo từng khu vực trước khi giao hàng.',
      'Đội lắp dựng triển khai theo mặt bằng, phối hợp với các bộ môn và xử lý nghiệm thu.'
    ],
    qcBullets: [
      'Kiểm tra vật liệu đầu vào theo chủng loại, màu sắc và tiêu chuẩn dự án',
      'Đối chiếu kích thước sau gia công với bản vẽ sản xuất',
      'Kiểm tra cạnh, bề mặt, phụ kiện và độ hoàn thiện trước đóng gói',
      'Phân loại hàng theo phòng, tầng hoặc khu vực để kiểm soát tiến độ thi công',
      'Nghiệm thu sau lắp dựng và ghi nhận hạng mục cần hoàn thiện'
    ],
    qcReference: 'Quy trình QC từ vật tư đầu vào đến nghiệm thu sau lắp dựng.',
    summaryLink: 'Xem đầy đủ quy trình triển khai'
  },
  en: {
    heading: 'From drawings to project handover',
    titles: [
      'Drawing & BOQ intake',
      'Technical take-off',
      'Project coordination',
      'In-house production',
      'Pre-delivery QC',
      'On-site installation'
    ],
    descriptions: [
      'Documents, scope of work, materials, schedule and finish standards are reviewed before anything moves.',
      'Design drawings are converted into production documents, material schedules and an execution plan.',
      'Production progress, deliveries and installation are tracked and coordinated stage by stage.',
      'Interior modules are produced to the technical documents, with dimensions, materials and finish quality controlled.',
      'Dimensions, surfaces and hardware are checked, and packages sorted by area, before shipping.',
      'Installation teams work to the floor plan, coordinate with the other trades and handle sign-off.'
    ],
    qcBullets: [
      'Incoming materials checked against type, colour and project standards',
      'Machined dimensions verified against the production drawings',
      'Edges, surfaces, hardware and finish inspected before packing',
      'Goods sorted by room, floor or zone to keep installation on schedule',
      'Post-installation sign-off with a punch list of items to complete'
    ],
    qcReference: 'QC from incoming materials through post-installation sign-off.',
    summaryLink: 'View our complete project workflow'
  }
} as const

type WorkflowLocale = keyof typeof WORKFLOW_COPY

async function prepareContentPage(page: Page, locale: WorkflowLocale, path: string, width = 1024) {
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
  await page.goto(new URL(path, TEST_ORIGIN).toString(), { waitUntil: 'load' })
  await page.evaluate(() => document.fonts.ready)

  return {
    consoleErrors: consoleErrors.filter(message => message !== KNOWN_ENGLISH_HYDRATION_ERROR),
    knownConsoleErrors: consoleErrors.filter(message => message === KNOWN_ENGLISH_HYDRATION_ERROR),
    pageErrors
  }
}

async function countExactText(page: Page, selector: string, expected: readonly string[]) {
  const texts = (await page.locator(selector).allTextContents()).map(text => text.trim())
  return texts.filter(text => expected.includes(text)).length
}

for (const locale of ['vi', 'en'] as const) {
  const copy = WORKFLOW_COPY[locale]

  test(`DENS-WORKFLOW-01 home is a compact linked workflow summary in ${locale}`, async ({ page }) => {
    const errors = await prepareContentPage(page, locale, '/')

    expect(await countExactText(page, 'main h3', copy.titles)).toBe(6)
    expect(await countExactText(page, 'main p', copy.descriptions)).toBe(0)
    expect(await countExactText(page, 'main li span', copy.qcBullets)).toBe(0)

    const link = page.getByRole('link', { name: copy.summaryLink, exact: true })
    await expect(link).toHaveAttribute('href', '/gioi-thieu#production-workflow')
    await link.focus()
    await expect(link).toBeFocused()
    expect(errors.consoleErrors).toEqual([])
    expect(errors.knownConsoleErrors.length).toBeLessThanOrEqual(locale === 'en' ? 1 : 0)
    expect(errors.pageErrors).toEqual([])
  })

  test(`DENS-WORKFLOW-01 about owns the full workflow but not the full QC list in ${locale}`, async ({ page }) => {
    const errors = await prepareContentPage(page, locale, '/gioi-thieu')
    const workflow = page.locator('#production-workflow')

    expect(await workflow.count()).toBe(1)
    await expect(workflow.getByRole('heading', { name: copy.heading, exact: true })).toHaveCount(1)
    expect(await countExactText(page, '#production-workflow h3', copy.titles)).toBe(6)
    expect(await countExactText(page, '#production-workflow p', copy.descriptions)).toBe(6)
    expect(await countExactText(page, 'main li span', copy.qcBullets)).toBe(0)
    await expect(page.getByText(copy.qcReference, { exact: true })).toHaveCount(1)
    await expect(page.locator('main a[href="/nha-xuong"]')).not.toHaveCount(0)
    expect(errors.consoleErrors).toEqual([])
    expect(errors.knownConsoleErrors.length).toBeLessThanOrEqual(locale === 'en' ? 1 : 0)
    expect(errors.pageErrors).toEqual([])
  })

  test(`DENS-WORKFLOW-01 factory owns full QC without the company workflow in ${locale}`, async ({ page }) => {
    const errors = await prepareContentPage(page, locale, '/nha-xuong')

    expect(await countExactText(page, 'main h3', copy.titles)).toBe(0)
    expect(await countExactText(page, 'main p', copy.descriptions)).toBe(0)
    expect(await countExactText(page, 'main li span', copy.qcBullets)).toBe(5)
    await expect(page.locator('#production-workflow')).toHaveCount(0)
    expect(errors.consoleErrors).toEqual([])
    expect(errors.knownConsoleErrors.length).toBeLessThanOrEqual(locale === 'en' ? 1 : 0)
    expect(errors.pageErrors).toEqual([])
  })

  test(`DENS-WORKFLOW-01 canonical link clears sticky chrome in ${locale}`, async ({ page }) => {
    const errors = await prepareContentPage(page, locale, '/', 390)
    const link = page.getByRole('link', { name: copy.summaryLink, exact: true })
    expect(await link.count()).toBe(1)
    await link.click()

    await expect(page).toHaveURL(/\/gioi-thieu#production-workflow$/)
    await expect(page.locator('html')).toHaveAttribute('lang', locale)
    const geometry = await page.locator('#production-workflow').evaluate((section) => {
      const header = document.querySelector('header')
      const sectionRect = section.getBoundingClientRect()
      const headerRect = header?.getBoundingClientRect()
      return {
        sectionTop: sectionRect.top,
        headerBottom: headerRect?.bottom ?? 0,
        scrollMarginTop: Number.parseFloat(getComputedStyle(section).scrollMarginTop)
      }
    })

    expect(geometry.scrollMarginTop).toBeGreaterThanOrEqual(geometry.headerBottom)
    expect(geometry.sectionTop).toBeGreaterThanOrEqual(geometry.headerBottom - 1)
    expect(geometry.sectionTop - geometry.headerBottom).toBeLessThanOrEqual(24)
    expect(errors.consoleErrors).toEqual([])
    expect(errors.knownConsoleErrors.length).toBeLessThanOrEqual(locale === 'en' ? 1 : 0)
    expect(errors.pageErrors).toEqual([])
  })
}
