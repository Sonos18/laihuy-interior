import type { Page } from '@playwright/test'
import { expect, test } from './fixtures'
import { MIN_SURFACE_LUMINANCE, SAWDUST_CEILING_LUMINANCE, nonEdgeRadii, surfaceLuminances } from './helpers/warm-surfaces'
import { APP_ORIGIN } from './origin'

const TEST_ORIGIN = process.env.DENSITY_TEST_ORIGIN ?? APP_ORIGIN
const TRANSPARENT_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M/wHwAF/gL+X9j7WQAAAABJRU5ErkJggg==',
  'base64'
)
const FACTORY_MAP_URL = 'https://www.google.com/maps/search/?api=1&query=557E1%20-%20KP2%20-%20Ph%C6%B0%E1%BB%9Dng%20Ph%C3%BA%20Kh%C6%B0%C6%A1ng%2C%20T%E1%BB%89nh%20V%C4%A9nh%20Long%2C%20Vi%E1%BB%87t%20Nam'

const copy = {
  vi: {
    topic: 'Nhà xưởng Vĩnh Long',
    heading: 'Sản xuất trực tiếp. Kiểm soát đến cùng.',
    subtitle: 'Xưởng tại Phú Khương, Vĩnh Long: máy CNC, dán cạnh tự động, ép nguội và bốn điểm kiểm tra chất lượng, phục vụ khách sạn, villa, căn hộ và sản xuất theo bản vẽ.',
    primary: 'Gọi đặt lịch tham quan',
    secondary: 'Xem số liệu nhà xưởng',
    legacyCapacityHeading: 'Năng lực sản xuất',
    visit: {
      phone: 'Gọi đặt lịch tham quan',
      map: 'Mở bản đồ nhà xưởng'
    },
    faqs: [
      {
        question: 'Thời gian sản xuất mất bao lâu?',
        answer: 'Tiến độ phụ thuộc quy mô, vật liệu và hồ sơ kỹ thuật. Năng lực xưởng đạt đến khoảng 50 phòng khách sạn mỗi tháng; lịch cụ thể được xác nhận sau khi rà soát bản vẽ và BOQ.'
      },
      {
        question: 'Lai Huy có nhận sản xuất theo thiết kế hoặc bản vẽ riêng không?',
        answer: 'Có. Lai Huy nhận gia công theo bản vẽ/OEM và có thể bóc tách, triển khai shop drawing cần thiết trước khi đưa vào sản xuất.'
      },
      {
        question: 'Lai Huy có lập BOQ sơ bộ từ bản vẽ của chúng tôi không?',
        answer: 'Có. Gửi bản vẽ PDF hoặc DWG tới noithatlaihuy@gmail.com; Lai Huy bóc tách khối lượng, lập BOQ sơ bộ (bảng khối lượng) và gửi kèm báo giá. File lớn có thể gửi qua link Google Drive.'
      },
      {
        question: 'Vật liệu và chất lượng được kiểm soát như thế nào?',
        answer: 'Vật tư được kiểm tra theo chủng loại, màu sắc và tiêu chuẩn dự án; kích thước, cạnh, bề mặt và phụ kiện được đối chiếu trong sản xuất và trước khi đóng gói.'
      },
      {
        question: 'Lai Huy có giao lắp toàn quốc không?',
        answer: 'Có. Đội thi công triển khai tại công trình trên toàn quốc; xưởng đồng thời nhận các đơn hàng gia công xuất khẩu theo phạm vi thống nhất.'
      }
    ],
    stats: [
      { label: 'Xưởng & kho', value: '3.000 m²' },
      { label: 'Phòng khách sạn / tháng', value: 'Đến 50' },
      { label: 'Thiết kế → lắp đặt', value: 'Trọn gói' },
      { label: 'Giao lắp & xuất khẩu', value: 'Toàn quốc' }
    ]
  },
  en: {
    topic: 'Our Vinh Long factory',
    heading: 'Direct manufacturing. Controlled end to end.',
    subtitle: 'Our factory in Phu Khuong, Vinh Long: CNC machining, automatic edge banding, cold pressing and four quality checkpoints, for hotels, villas, apartments and make-to-drawing production.',
    primary: 'Call to book a visit',
    secondary: 'See the factory figures',
    legacyCapacityHeading: 'Production capacity',
    visit: {
      phone: 'Call to book a visit',
      map: 'Open factory map'
    },
    faqs: [
      {
        question: 'How long does production take?',
        answer: 'Timing depends on scale, materials and technical documents. Workshop capacity reaches about 50 hotel rooms per month; the exact programme is confirmed after drawings and BOQ review.'
      },
      {
        question: 'Can Lai Huy manufacture to our own design or drawings?',
        answer: 'Yes. Lai Huy provides make-to-drawing/OEM production and can prepare the technical take-off and shop drawings needed before manufacturing.'
      },
      {
        question: 'Can Lai Huy prepare a preliminary BOQ from our drawings?',
        answer: 'Yes. Email PDF or DWG drawings to noithatlaihuy@gmail.com; Lai Huy does the take-off, prepares a preliminary BOQ (bill of quantities) and sends it with the quote. Large files can be shared as a Google Drive link.'
      },
      {
        question: 'How are materials and quality controlled?',
        answer: 'Materials are checked for type, colour and project standard; dimensions, edges, surfaces and hardware are verified during production and before packing.'
      },
      {
        question: 'Does Lai Huy install nationwide?',
        answer: 'Yes. Installation teams work at project sites nationwide, and the factory also accepts export production orders within an agreed scope.'
      }
    ],
    stats: [
      { label: 'Factory & warehouse', value: '3,000 m²' },
      { label: 'Hotel rooms / month', value: 'Up to 50' },
      { label: 'Design → install', value: 'End-to-end' },
      { label: 'Delivery & export', value: 'Nationwide' }
    ]
  }
} as const

async function openFactory(page: Page, locale: keyof typeof copy, width = 1440) {
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
  await page.goto('/nha-xuong', { waitUntil: 'load' })
  await page.evaluate(() => document.fonts.ready)
}

async function gridColumns(page: Page, testId: string) {
  return page.locator(`[data-testid="${testId}"]`).evaluate(element =>
    getComputedStyle(element).gridTemplateColumns.split(' ').filter(Boolean).length
  )
}

async function flexDirection(page: Page, testId: string) {
  return page.locator(`[data-testid="${testId}"]`).evaluate(element =>
    getComputedStyle(element).flexDirection
  )
}

for (const locale of ['vi', 'en'] as const) {
  test(`factory hero uses the approved copy and actions in ${locale}`, async ({ page }) => {
    await openFactory(page, locale)

    const hero = page.locator('[data-testid="factory-hero"]')
    await expect(hero).toHaveCount(1)
    await expect(hero.getByText(copy[locale].topic, { exact: true })).toHaveCount(1)
    await expect(
      hero.getByRole('heading', { level: 1, name: copy[locale].heading, exact: true })
    ).toHaveCount(1)
    await expect(hero.getByText(copy[locale].subtitle, { exact: true })).toHaveCount(1)

    const phone = hero.getByRole('link', { name: copy[locale].primary, exact: true })
    await expect(phone).toHaveAttribute('href', 'tel:+84903102012')

    const capability = hero.getByRole('link', { name: copy[locale].secondary, exact: true })
    await expect(capability).toHaveAttribute('href', '#factory-capability')
  })

  test(`factory stats use semantic approved proof in ${locale}`, async ({ page }) => {
    await openFactory(page, locale)

    const target = page.locator('#factory-capability')
    await expect(target).toHaveCount(1)

    const definitionList = target.locator('dl')
    await expect(definitionList).toHaveCount(1)

    const stats = definitionList.locator(':scope > [data-testid="factory-stat"]')
    await expect(stats).toHaveCount(4)

    for (const [index, statCopy] of copy[locale].stats.entries()) {
      const stat = stats.nth(index)
      await expect(stat.locator('dt')).toHaveText(statCopy.label)
      await expect(stat.locator('dd')).toHaveText(statCopy.value)
    }
  })
}

test('factory stats switch from two to four columns at the lg boundary', async ({ page }) => {
  await openFactory(page, 'vi', 1023)

  const grid = page.locator('#factory-capability dl')
  const columnCount = () => grid.evaluate(element =>
    getComputedStyle(element).gridTemplateColumns.trim().split(/\s+/).length
  )

  expect(await columnCount()).toBe(2)

  await page.setViewportSize({ width: 1024, height: 900 })
  expect(await columnCount()).toBe(4)
})

for (const locale of ['vi', 'en'] as const) {
  test(`factory action breakpoint is exact in ${locale}`, async ({ page }) => {
    await openFactory(page, locale, 639)

    const heroActions = page.getByTestId('factory-hero-phone').locator('..')
    expect(await heroActions.evaluate(element => getComputedStyle(element).flexDirection))
      .toBe('column')
    expect(await flexDirection(page, 'factory-visit-actions')).toBe('column')

    await page.setViewportSize({ width: 640, height: 900 })
    expect(await heroActions.evaluate(element => getComputedStyle(element).flexDirection))
      .toBe('row')
    expect(await flexDirection(page, 'factory-visit-actions')).toBe('row')
  })

  test(`factory lg breakpoint is exact in ${locale}`, async ({ page }) => {
    await openFactory(page, locale, 1023)

    const stats = page.locator('[data-testid="factory-stats"] dl')
    const statColumns = () => stats.evaluate(element =>
      getComputedStyle(element).gridTemplateColumns.split(' ').filter(Boolean).length
    )

    expect(await statColumns()).toBe(2)
    expect(await gridColumns(page, 'factory-pillars-layout')).toBe(1)
    expect(await gridColumns(page, 'factory-pillars-grid')).toBe(2)
    expect(await gridColumns(page, 'factory-process-layout')).toBe(1)
    expect(await gridColumns(page, 'factory-people-quality-layout')).toBe(1)

    await page.setViewportSize({ width: 1024, height: 900 })
    expect(await statColumns()).toBe(4)
    expect(await gridColumns(page, 'factory-pillars-layout')).toBe(2)
    expect(await gridColumns(page, 'factory-pillars-grid')).toBe(2)
    expect(await gridColumns(page, 'factory-process-layout')).toBe(2)
    expect(await gridColumns(page, 'factory-people-quality-layout')).toBe(2)
  })
}

for (const locale of ['vi', 'en'] as const) {
  for (const width of [390, 767, 768, 1279, 1280, 1440] as const) {
    test(`factory responsive contract in ${locale} at ${width}`, async ({ page }) => {
      await openFactory(page, locale, width)

      const overflow = await page.evaluate(() =>
        Math.max(
          document.documentElement.scrollWidth,
          document.body.scrollWidth
        ) - window.innerWidth
      )
      expect(overflow).toBeLessThanOrEqual(1)

      const stats = page.locator('[data-testid="factory-stats"] dl')
      const statColumns = await stats.evaluate(element =>
        getComputedStyle(element).gridTemplateColumns.split(' ').filter(Boolean).length
      )
      expect(statColumns).toBe(width >= 1024 ? 4 : 2)

      expect(await gridColumns(page, 'factory-pillars-layout')).toBe(width >= 1024 ? 2 : 1)
      expect(await gridColumns(page, 'factory-pillars-grid')).toBe(2)
      expect(await gridColumns(page, 'factory-process-layout')).toBe(width >= 1024 ? 2 : 1)
      expect(await gridColumns(page, 'factory-process-groups')).toBe(width >= 768 ? 2 : 1)
      expect(await gridColumns(page, 'factory-people-quality-layout')).toBe(width >= 1024 ? 2 : 1)

      const audienceGrid = page.getByTestId('factory-audience').first().locator('..')
      const audienceColumns = await audienceGrid.evaluate(element =>
        getComputedStyle(element).gridTemplateColumns.split(' ').filter(Boolean).length
      )
      expect(audienceColumns).toBe(width >= 768 ? 2 : 1)

      const heroActions = page.getByTestId('factory-hero-phone').locator('..')
      expect(await heroActions.evaluate(element => getComputedStyle(element).flexDirection))
        .toBe(width >= 640 ? 'row' : 'column')
      expect(await flexDirection(page, 'factory-visit-actions'))
        .toBe(width >= 640 ? 'row' : 'column')
    })
  }
}

test('factory FAQ is keyboard operable and reduced motion is active', async ({ page }) => {
  await openFactory(page, 'vi', 390)
  expect(await page.evaluate(() =>
    matchMedia('(prefers-reduced-motion: reduce)').matches
  )).toBe(true)

  const firstSummary = page.locator('[data-testid="factory-faq"] summary').first()
  const disclosureIcon = firstSummary.locator('[aria-hidden="true"]')
  await expect(disclosureIcon).toHaveCount(1)
  expect(await disclosureIcon.evaluate(element =>
    getComputedStyle(element).transitionProperty
  )).toBe('none')

  await firstSummary.focus()
  await expect(firstSummary).toBeFocused()
  await firstSummary.press('Enter')
  await expect(firstSummary.locator('xpath=..')).toHaveAttribute('open', '')
})

test('factory uses one four-stage production proof and no standalone gallery', async ({ page }) => {
  await openFactory(page, 'vi')

  await expect(page.locator('[data-testid="factory-process"]')).toHaveCount(1)
  await expect(page.locator('[data-testid="factory-process-group"]')).toHaveCount(4)
  await expect(page.getByRole('heading', { name: 'Bước vào không gian sản xuất', exact: true }))
    .toHaveCount(0)
  await expect(page.getByRole('heading', { name: 'Công nghệ tạo nên chất lượng bạn nhận được', exact: true }))
    .toHaveCount(0)
  await expect(page.locator('main [role="dialog"]')).toHaveCount(0)
})

for (const locale of ['vi', 'en'] as const) {
  test(`factory closes with audience proof and direct visit actions in ${locale}`, async ({ page }) => {
    await openFactory(page, locale)

    await expect(page.locator('[data-testid="factory-pillars"] [data-testid="factory-pillar"]'))
      .toHaveCount(4)
    await expect(page.locator('[data-testid="factory-quality-step"]')).toHaveCount(4)
    await expect(page.locator('[data-testid="factory-audience"]')).toHaveCount(2)

    const visit = page.locator('[data-testid="factory-visit-cta"]')
    await expect(visit.getByRole('link')).toHaveCount(2)

    const phone = visit.getByRole('link', { name: copy[locale].visit.phone, exact: true })
    await expect(phone).toBeVisible()
    await expect(phone).toHaveAccessibleName(copy[locale].visit.phone)
    await expect(phone).toHaveAttribute('href', 'tel:+84903102012')

    const map = visit.getByRole('link', { name: copy[locale].visit.map, exact: true })
    await expect(map).toBeVisible()
    await expect(map).toHaveAccessibleName(copy[locale].visit.map)
    await expect(map).toHaveAttribute('href', FACTORY_MAP_URL)
    await expect(map).toHaveAttribute('target', '_blank')
    await expect(map).toHaveAttribute('rel', 'noopener noreferrer')

    await expect(page.getByRole('heading', { name: copy[locale].legacyCapacityHeading, exact: true }))
      .toHaveCount(0)
  })

  test(`factory exposes the approved native FAQ content and canonical structured data in ${locale}`, async ({ page }) => {
    await openFactory(page, locale)

    await expect(page.locator('html')).toHaveAttribute('lang', locale)
    await expect(page.locator('meta[property="og:locale"]'))
      .toHaveAttribute('content', locale === 'en' ? 'en_US' : 'vi_VN')

    const details = page.locator('[data-testid="factory-faq"] details')
    await expect(details).toHaveCount(5)

    const visibleFaqs: { question: string, answer: string }[] = []
    for (const [index, expectedFaq] of copy[locale].faqs.entries()) {
      const item = details.nth(index)
      const summary = item.locator('summary')
      const answer = item.locator('p')

      await expect(summary).toHaveText(expectedFaq.question)
      await summary.click()
      await expect(answer).toBeVisible()
      await expect(answer).toHaveText(expectedFaq.answer)
      visibleFaqs.push({
        question: (await summary.textContent())?.trim() ?? '',
        answer: (await answer.textContent())?.trim() ?? ''
      })
    }

    expect(visibleFaqs).toEqual(copy[locale].faqs)

    // Locale is a cookie preference on one URL, so the FAQPage schema must not follow it: every
    // render carries both languages, each question and answer tagged with its own inLanguage.
    const structuredFaqs = await page.locator('script[type="application/ld+json"]').evaluateAll((scripts) => {
      const entries = scripts.flatMap((script) => {
        try {
          const value = JSON.parse(script.textContent ?? 'null')
          return Array.isArray(value) ? value : [value]
        } catch {
          return []
        }
      })
      const faq = entries.find(entry => entry?.['@type'] === 'FAQPage')
      type StructuredQuestion = {
        inLanguage?: unknown
        name?: unknown
        acceptedAnswer?: { inLanguage?: unknown, text?: unknown }
      }
      return faq?.mainEntity?.map((item: StructuredQuestion) => ({
        inLanguage: typeof item.inLanguage === 'string' ? item.inLanguage : '',
        answerLanguage: typeof item.acceptedAnswer?.inLanguage === 'string' ? item.acceptedAnswer.inLanguage : '',
        question: typeof item.name === 'string' ? item.name : '',
        answer: typeof item.acceptedAnswer?.text === 'string' ? item.acceptedAnswer.text : ''
      })) ?? []
    })

    const tagged = (language: 'vi' | 'en') =>
      copy[language].faqs.map(faq => ({ inLanguage: language, answerLanguage: language, ...faq }))
    expect(structuredFaqs).toEqual([...tagged('vi'), ...tagged('en')])
  })
}

// ─────────────────────────────────────────────────────────────────────────────
// FX-WARM: /nha-xuong sits on the warm-light canvas below the hero (DESIGN.md, Warm Light Rule).
// Obsidian lives behind the hero photograph and in the footer only.
// ─────────────────────────────────────────────────────────────────────────────

const WARM_WIDTHS = [768, 1440] as const
const warmSections = [
  'factory-stats',
  'factory-pillars',
  'factory-process',
  'factory-people-quality',
  'factory-audiences',
  'factory-faq',
  'factory-visit-cta'
] as const

for (const locale of ['vi', 'en'] as const) {
  for (const width of WARM_WIDTHS) {
    const tag = `${locale} @ ${width}`

    test(`FX-WARM-01 no dark band ${tag}`, async ({ page }) => {
      await openFactory(page, locale, width)

      const surfaces = await surfaceLuminances(
        page,
        warmSections.map(id => `[data-testid="${id}"]`).join(', '),
        { nameAttribute: 'data-testid' }
      )

      for (const surface of surfaces) {
        expect(surface.luminance, `${surface.name} background is a dark band`).toBeGreaterThanOrEqual(MIN_SURFACE_LUMINANCE)
      }
      // Sawdust is the emphasis band: the process chapter, and nothing else.
      const sawdust = surfaces.filter(surface => surface.luminance < SAWDUST_CEILING_LUMINANCE).map(surface => surface.name)
      expect(sawdust).toEqual(['factory-process'])
    })

    test(`FX-WARM-02 headings and type ${tag}`, async ({ page }) => {
      await openFactory(page, locale, width)

      const result = await page.evaluate(() => {
        const outside = (el: Element) => !el.closest('.app-hero')
        const typeOf = (el: Element) => {
          const style = getComputedStyle(el)
          return {
            text: (el.textContent ?? '').trim().slice(0, 40),
            weight: style.fontWeight,
            transform: style.textTransform,
            family: style.fontFamily
          }
        }
        const headings = [...document.querySelectorAll('main h2')].filter(outside).map(typeOf)
        const cardHeadings = [...document.querySelectorAll('main h3')].filter(outside).map(typeOf)
        const heavy = [...document.querySelectorAll('main *')]
          .filter(outside)
          .filter(el => getComputedStyle(el).fontWeight === '900')
          .map(el => `${el.tagName.toLowerCase()}: ${(el.textContent ?? '').trim().slice(0, 30)}`)
        const markers = [...document.querySelectorAll('[data-testid="factory-process-group"] > span')]
          .map(el => parseFloat(getComputedStyle(el).fontSize))
        const smallest = [...document.querySelectorAll('main p, main li, main h2, main h3, main a, main span, main dt, main dd, main summary')]
          .filter(outside)
          .filter(el => (el.textContent ?? '').trim() !== '' && el.children.length === 0)
          .map(el => parseFloat(getComputedStyle(el).fontSize))
        return { headings, cardHeadings, heavy, markers, smallest }
      })

      // pillars, process, people and quality, audiences, FAQ and visit
      expect(result.headings).toHaveLength(6)
      // 4 pillars, 4 process groups and 2 audiences
      expect(result.cardHeadings).toHaveLength(10)
      for (const heading of [...result.headings, ...result.cardHeadings]) {
        expect(heading.weight, heading.text).toBe('500')
        expect(heading.transform, heading.text).toBe('none')
        expect(heading.family, heading.text).toContain('Outfit')
      }
      expect(result.heavy).toEqual([])
      // The four production stages are a real order, so they keep Label-sized markers.
      expect(result.markers).toHaveLength(4)
      for (const size of result.markers) {
        expect(size).toBeLessThanOrEqual(14)
      }
      for (const size of result.smallest) {
        expect(size).toBeGreaterThanOrEqual(12)
      }
    })

    test(`FX-WARM-03 radii ${tag}`, async ({ page }) => {
      await openFactory(page, locale, width)

      const offenders = await nonEdgeRadii(page)

      expect(offenders).toEqual([])
    })

    test(`FX-WARM-04 actions ${tag}`, async ({ page }) => {
      await openFactory(page, locale, width)

      const primary = page.getByTestId('factory-visit-phone')
      await expect(primary).toHaveClass(/\bbtn-bronze\b/)
      // Bronze Edge Rule: on a light surface the bronze fill carries the Deep Timber border.
      await expect(primary).toHaveCSS('border-top-color', 'rgb(124, 80, 50)')
      await expect(page.getByTestId('factory-visit-map')).toHaveClass(/\bbtn-outline\b/)
    })
  }
}
