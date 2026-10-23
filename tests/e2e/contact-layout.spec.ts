import type { ConsoleMessage, Page } from '@playwright/test'
import { expect, test } from './fixtures'
import { APP_ORIGIN } from './origin'

/**
 * /lien-he layout gate — copy deck B-06.
 *
 * Geometry, not pixels: this asserts the structural contract so a future edit cannot silently
 * undo it. Order is the visitor's order of need: direct contact and "how to send documents" sit
 * above the form + map band, and the old five-card strip is gone. The pixel record lives in
 * visual.spec.ts.
 */

const INTAKE = '[data-testid="contact-intake"]'
const DIRECT = '[data-testid="contact-direct"]'
const SEND_DOCS = '[data-testid="contact-send-docs"]'
const PRIMARY = '[data-testid="contact-primary"]'

const TRANSPARENT_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M/wHwAF/gL+X9j7WQAAAABJRU5ErkJggg==',
  'base64'
)

async function open(page: Page, width: number, locale: 'vi' | 'en' = 'vi') {
  await page.setViewportSize({ width, height: 900 })
  await page.context().addCookies([{ name: 'lai-huy-locale', value: locale, url: APP_ORIGIN }])
  // Geometry and behaviour only: images are stubbed so the gate does not depend on remote media
  // (AGENTS.md: browser tests can depend on Supabase images). Layout here never reads image pixels.
  await page.route('**/*', async (route) => {
    if (route.request().resourceType() === 'image') {
      await route.fulfill({ status: 200, contentType: 'image/png', body: TRANSPARENT_PNG })
      return
    }
    await route.continue()
  })
  await page.route('https://maps.google.com/**', async (route) => {
    await route.fulfill({ status: 200, contentType: 'text/html', body: '<!doctype html><title>Map unavailable in test</title>' })
  })
  await page.goto('/lien-he', { waitUntil: 'load' })
  await page.waitForFunction(() => Boolean(
    (document.querySelector('#__nuxt') as HTMLElement & { __vue_app__?: unknown })?.__vue_app__
  ))
  await page.evaluate(() => document.fonts.ready)
}

test('the old five-card strip is gone', async ({ page }) => {
  await open(page, 1440)
  await expect(page.locator('[data-testid="contact-cards"]')).toHaveCount(0)
})

for (const width of [390, 1440] as const) {
  test(`direct contact and how-to-send sit above the form and the map @ ${width}`, async ({ page }) => {
    await open(page, width)

    const intake = await page.locator(INTAKE).boundingBox()
    const primary = await page.locator(PRIMARY).boundingBox()

    expect(intake).not.toBeNull()
    expect(primary).not.toBeNull()
    expect(primary!.y).toBeGreaterThan(intake!.y + intake!.height)
  })
}

test('the two intake blocks share the page rail with the form and the map', async ({ page }) => {
  await open(page, 1440)

  const intake = await page.locator(INTAKE).boundingBox()
  const primary = await page.locator(PRIMARY).boundingBox()

  expect(Math.abs(intake!.x - primary!.x)).toBeLessThanOrEqual(1)
  expect(Math.abs(intake!.width - primary!.width)).toBeLessThanOrEqual(1)
})

for (const { width, gap } of [{ width: 390, gap: 64 }, { width: 1440, gap: 80 }] as const) {
  test(`separation between the intake band and the form+map band is ${gap}px @ ${width}`, async ({ page }) => {
    await open(page, width)

    const intake = await page.locator(INTAKE).boundingBox()
    const primary = await page.locator(PRIMARY).boundingBox()

    expect(primary!.y - (intake!.y + intake!.height)).toBeCloseTo(gap, 0)
  })
}

for (const { width, sideBySide } of [
  { width: 390, sideBySide: false },
  { width: 768, sideBySide: false },
  { width: 1024, sideBySide: true },
  { width: 1440, sideBySide: true }
] as const) {
  test(`intake blocks are ${sideBySide ? 'side by side' : 'stacked, direct contact first'} @ ${width}`, async ({ page }) => {
    await open(page, width)

    const direct = await page.locator(DIRECT).boundingBox()
    const docs = await page.locator(SEND_DOCS).boundingBox()

    expect(direct).not.toBeNull()
    expect(docs).not.toBeNull()
    if (sideBySide) {
      expect(Math.abs(direct!.y - docs!.y)).toBeLessThan(2)
      expect(docs!.x).toBeGreaterThan(direct!.x + direct!.width - 1)
    } else {
      expect(docs!.y).toBeGreaterThan(direct!.y + direct!.height - 1)
    }
  })
}

test('phone and email in the direct block are real links that do not open a new tab', async ({ page }) => {
  await open(page, 1440)

  const phone = page.locator(`${DIRECT} a[href^="tel:"]`)
  const email = page.locator(`${DIRECT} a[href^="mailto:"]`)

  await expect(phone).toHaveAttribute('href', 'tel:+84903102012')
  await expect(phone).toHaveText('0903 102 012')
  await expect(email).toHaveText('noithatlaihuy@gmail.com')
  await expect(email).toHaveAttribute('href', /^mailto:noithatlaihuy@gmail\.com\?subject=/)
  await expect(phone).not.toHaveAttribute('target', /.+/)
  await expect(email).not.toHaveAttribute('target', /.+/)
})

test('the how-to-send block is the #cach-gui-ho-so anchor and clears the sticky header', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 900 })
  await page.route('https://maps.google.com/**', route =>
    route.fulfill({ status: 200, contentType: 'text/html', body: '<!doctype html><title>Map unavailable in test</title>' }))
  await page.goto('/lien-he#cach-gui-ho-so', { waitUntil: 'load' })
  await page.waitForFunction(() => Boolean(
    (document.querySelector('#__nuxt') as HTMLElement & { __vue_app__?: unknown })?.__vue_app__
  ))

  const target = page.locator('#cach-gui-ho-so')
  await expect(target).toHaveAttribute('data-testid', 'contact-send-docs')

  const geometry = await target.evaluate((el) => {
    const header = document.querySelector('header')
    return {
      scrollMarginTop: Number.parseFloat(getComputedStyle(el).scrollMarginTop),
      headerBottom: header?.getBoundingClientRect().bottom ?? 0
    }
  })
  expect(geometry.scrollMarginTop).toBeGreaterThanOrEqual(geometry.headerBottom)
})

test('the address cards name the map they open, once each', async ({ page }) => {
  await open(page, 1440)

  const links = page.locator(`${PRIMARY} a[target="_blank"]`)
  await expect(links).toHaveCount(2)
  await expect(links.nth(0)).toContainText('Mở bản đồ văn phòng')
  await expect(links.nth(1)).toContainText('Mở bản đồ nhà xưởng')
})

/**
 * Public lead-form behaviour gate.
 *
 * There is no transport. A valid submit composes a mailto link and hands it to the visitor's
 * own mail client; the page must say the email app is open, never that anything was sent. The
 * mailto is observed by intercepting the click that opens it, since a navigation to `mailto:`
 * leaves no trace the test could read.
 */
const FORBIDDEN_CLAIMS = [
  'Đã nhận', 'đã gửi', 'sẽ liên hệ', 'phản hồi trong vòng',
  'received your', 'has been sent', 'will be in touch', 'within one business day'
]

async function captureMailtos(page: Page) {
  await page.addInitScript(() => {
    const w = window as unknown as { __mailtos: string[] }
    w.__mailtos = []
    document.addEventListener('click', (event) => {
      const link = (event.target as Element | null)?.closest?.('a[href^="mailto:"]') as HTMLAnchorElement | null
      if (!link) return
      event.preventDefault()
      w.__mailtos.push(link.href)
    }, true)
  })
}

const mailtos = (page: Page) =>
  page.evaluate(() => (window as unknown as { __mailtos: string[] }).__mailtos)

async function fillValid(page: Page, projectType = 'hotel') {
  await page.fill('#contact-name', 'Nguyễn Văn A')
  await page.fill('#contact-phone', '+84 912 345 678')
  await page.fill('#contact-email', 'a@congty.com')
  await page.selectOption('#contact-projectType', projectType)
  await page.fill('#contact-message', 'Khách sạn 40 phòng tại Đà Nẵng, cần báo giá nội thất.')
}

const submit = (page: Page) => page.click('[data-testid="contact-form"] button[type="submit"]')

test('an empty submit blocks, marks every required field invalid and focuses the first', async ({ page }) => {
  await captureMailtos(page)
  await open(page, 1440)
  const dataLogs: ConsoleMessage[] = []
  page.on('console', (message) => {
    if (message.type() === 'log') dataLogs.push(message)
  })

  await submit(page)

  for (const field of ['name', 'phone', 'email', 'projectType', 'message']) {
    await expect(page.locator(`#contact-${field}`)).toHaveAttribute('aria-invalid', 'true')
    await expect(page.locator(`#contact-${field}-error`)).toBeVisible()
  }

  await expect(page.locator('#contact-name')).toBeFocused()
  await expect(page.locator('[data-testid="contact-mail-opened"]')).toBeEmpty()
  expect(await mailtos(page)).toEqual([])
  expect(dataLogs).toHaveLength(0)
})

test('an empty email asks for the email, it does not call it invalid', async ({ page }) => {
  await open(page, 1440)
  await submit(page)

  await expect(page.locator('#contact-email-error')).toHaveText('Nhập email để Lai Huy gửi báo giá.')
})

test('required fields carry a visible marker, a screen-reader word and aria-required; optional ones do not', async ({ page }) => {
  await open(page, 1440)

  for (const field of ['name', 'phone', 'email', 'projectType', 'message']) {
    const label = page.locator(`label[for="contact-${field}"]`)
    await expect(label).toContainText('*')
    await expect(label.locator('.sr-only')).toHaveText('(bắt buộc)')
    await expect(page.locator(`#contact-${field}`)).toHaveAttribute('aria-required', 'true')
  }
  for (const field of ['company', 'scope']) {
    await expect(page.locator(`label[for="contact-${field}"]`)).not.toContainText('*')
    await expect(page.locator(`#contact-${field}`)).not.toHaveAttribute('aria-required', 'true')
  }
  await expect(page.locator('#form-note')).toBeVisible()
})

test('each error is wired to its field for assistive tech', async ({ page }) => {
  await open(page, 1440)
  await submit(page)

  await expect(page.locator('#contact-email')).toHaveAttribute('aria-describedby', 'contact-email-error')
})

test('a malformed email is rejected while the rest of the form is valid', async ({ page }) => {
  await captureMailtos(page)
  await open(page, 1440)
  await fillValid(page)
  await page.fill('#contact-email', 'not-an-email')
  await submit(page)

  await expect(page.locator('#contact-email-error')).toBeVisible()
  await expect(page.locator('#contact-email')).toBeFocused()
  expect(await mailtos(page)).toEqual([])
})

test('correcting a field clears its error immediately', async ({ page }) => {
  await open(page, 1440)
  await submit(page)
  await expect(page.locator('#contact-name-error')).toBeVisible()

  await page.fill('#contact-name', 'Nguyễn Văn A')

  await expect(page.locator('#contact-name-error')).toHaveCount(0)
  await expect(page.locator('#contact-name')).not.toHaveAttribute('aria-invalid', 'true')
})

for (const locale of ['vi', 'en'] as const) {
  test(`a valid submit opens one prefilled mailto and never claims delivery in ${locale}`, async ({ page }) => {
    await captureMailtos(page)
    await open(page, 1440, locale)
    await fillValid(page, 'hotel')
    await page.fill('#contact-company', 'Công ty ABC')
    await page.selectOption('#contact-scope', 'production')

    const writeRequests: string[] = []
    page.on('request', (request) => {
      if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method())) writeRequests.push(request.url())
    })

    await submit(page)

    await expect.poll(async () => (await mailtos(page)).length).toBe(1)
    const url = new URL((await mailtos(page))[0]!)
    expect(decodeURIComponent(url.pathname)).toBe('noithatlaihuy@gmail.com')

    const subject = url.searchParams.get('subject')!
    const body = url.searchParams.get('body')!
    if (locale === 'vi') {
      expect(subject).toBe('[Báo giá] Khách sạn & resort – Nguyễn Văn A')
      expect(body).toContain('Tôi cần báo giá cho dự án sau.')
      expect(body).toContain('Loại dự án: Khách sạn & resort')
      expect(body).toContain('Phạm vi cần báo giá: Sản xuất theo bản vẽ')
      expect(body).toContain('Công ty / đơn vị: Công ty ABC')
    } else {
      expect(subject).toBe('[Quote request] Hotel & resort – Nguyễn Văn A')
      expect(body).toContain('I would like a quote for the following project.')
      expect(body).toContain('Project type: Hotel & resort')
      expect(body).toContain('Scope to quote: Production to drawings')
      expect(body).toContain('Company: Công ty ABC')
    }
    expect(body).toContain('Khách sạn 40 phòng tại Đà Nẵng, cần báo giá nội thất.')
    expect(body).toContain('+84 912 345 678')
    expect(body).toContain('a@congty.com')

    const form = page.locator('[data-testid="contact-form"]')
    const notice = page.locator('[data-testid="contact-mail-opened"]')
    await expect(form).toBeVisible()
    await expect(notice).toBeVisible()
    await expect(notice).toContainText(locale === 'vi' ? 'chỉ nhận được yêu cầu sau khi bạn bấm Gửi' : 'only once you press Send')
    for (const claim of FORBIDDEN_CLAIMS) {
      await expect(form).not.toContainText(claim)
    }
    expect(writeRequests).toEqual([])
  })
}

test('an empty optional field is written as a dash and an unset scope as "not specified"', async ({ page }) => {
  await captureMailtos(page)
  await open(page, 1440)
  await fillValid(page, 'office')
  await submit(page)

  await expect.poll(async () => (await mailtos(page)).length).toBe(1)
  const url = new URL((await mailtos(page))[0]!)
  const body = url.searchParams.get('body')!
  expect(body).toContain('Công ty / đơn vị: —')
  expect(body).toContain('Phạm vi cần báo giá: Chưa xác định')
  expect(url.searchParams.get('subject')).toBe('[Báo giá] Văn phòng & thương mại – Nguyễn Văn A')
})

const LONG_MESSAGE = 'Phòng ngủ có tủ âm tường. '.repeat(120).trim()

for (const locale of ['vi', 'en'] as const) {
  test(`a message too long for a mailto goes to the clipboard, whole, and the email marks where to paste it, in ${locale}`, async ({ page, context, browserName }) => {
    // Clipboard permissions can only be granted in Chromium; the other engines cover the error path.
    test.skip(browserName !== 'chromium', 'clipboard permissions are Chromium-only')
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])
    await captureMailtos(page)
    await open(page, 1440, locale)
    await fillValid(page)
    await page.fill('#contact-message', LONG_MESSAGE)

    await submit(page)

    await expect.poll(async () => (await mailtos(page)).length).toBe(1)
    const href = (await mailtos(page))[0]!
    expect(href.length).toBeLessThanOrEqual(2000)
    const body = new URL(href).searchParams.get('body')!
    expect(body).toContain(locale === 'vi' ? 'Dán nội dung đã sao chép vào đây' : 'Paste the copied details here')
    expect(body).not.toContain('Phòng ngủ có tủ âm tường.')
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(LONG_MESSAGE)
    await expect(page.locator('[data-testid="contact-mail-opened"]')).toContainText(locale === 'vi' ? 'dán (Ctrl+V' : 'paste them (Ctrl+V')
    await expect(page.locator('#contact-message-error')).toHaveCount(0)
  })
}

test('when the clipboard is unavailable an over-long message is refused with an error, not truncated', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: () => Promise.reject(new Error('denied')) },
      configurable: true
    })
  })
  await captureMailtos(page)
  await open(page, 1440)
  await fillValid(page)
  await page.fill('#contact-message', LONG_MESSAGE)

  await submit(page)

  await expect(page.locator('#contact-message-error')).toBeVisible()
  await expect(page.locator('#contact-message-error')).toContainText('noithatlaihuy@gmail.com')
  await expect(page.locator('#contact-message')).toBeFocused()
  await expect(page.locator('[data-testid="contact-mail-opened"]')).toBeEmpty()
  expect(await mailtos(page)).toEqual([])
})

test('the status line clears once the visitor edits the form again', async ({ page }) => {
  await captureMailtos(page)
  await open(page, 1440)
  await fillValid(page)
  await submit(page)
  await expect(page.locator('[data-testid="contact-mail-opened"]')).not.toBeEmpty()

  await page.fill('#contact-name', 'Nguyễn Văn B')

  await expect(page.locator('[data-testid="contact-mail-opened"]')).toBeEmpty()
})
