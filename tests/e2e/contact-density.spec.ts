import type { Page } from '@playwright/test'
import { expect, test } from './fixtures'

const VIEWPORT_HEIGHT = 900
const TEST_ORIGIN = process.env.DENSITY_TEST_ORIGIN ?? 'http://localhost:3000'
const TRANSPARENT_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M/wHwAF/gL+X9j7WQAAAABJRU5ErkJggg==',
  'base64'
)

const CONTACT_COPY = {
  vi: {
    call: 'Gọi ngay',
    form: 'Gửi thông tin công trình',
    action: 'Gửi yêu cầu tư vấn',
    forbidden: ['Đã nhận yêu cầu', 'sẽ liên hệ', 'phản hồi trong vòng 24 giờ']
  },
  en: {
    call: 'Call now',
    form: 'Share project information',
    action: 'Send consultation request',
    forbidden: ['received your request', 'will be in touch', 'within one business day']
  }
} as const

async function prepareContentPage(page: Page, locale: 'vi' | 'en', width = 1024) {
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
  await page.route('https://maps.google.com/**', async (route) => {
    await route.fulfill({ status: 200, contentType: 'text/html', body: '<!doctype html><title>Map unavailable in test</title>' })
  })

  await page.setViewportSize({ width, height: VIEWPORT_HEIGHT })
  await page.goto(new URL('/lien-he', TEST_ORIGIN).toString(), { waitUntil: 'load' })
  await page.waitForFunction(() => Boolean(
    (document.querySelector('#__nuxt') as HTMLElement & { __vue_app__?: unknown })?.__vue_app__
  ))
  await page.evaluate(() => document.fonts.ready)

  return {
    consoleErrors,
    pageErrors
  }
}

for (const locale of ['vi', 'en'] as const) {
  for (const width of [390, 430, 768, 1440] as const) {
    test(`DENS-CONTACT-01 exposes direct hero actions in ${locale} at ${width}px`, async ({ page }) => {
      const errors = await prepareContentPage(page, locale, width)
      const hero = page.locator('.hero-image').locator('xpath=ancestor::section[1]')
      const phone = hero.getByRole('link', { name: CONTACT_COPY[locale].call, exact: true })
      const formLink = hero.getByRole('link', { name: CONTACT_COPY[locale].form, exact: true })

      await expect(hero.getByRole('heading', { level: 1 })).toBeVisible()
      await expect(phone).toHaveAttribute('href', /^tel:\+\d{8,15}$/)
      await expect(formLink).toHaveAttribute('href', '#contact-form')

      const [heroBox, phoneBox, formLinkBox] = await Promise.all([
        hero.boundingBox(),
        phone.boundingBox(),
        formLink.boundingBox()
      ])
      expect(heroBox).not.toBeNull()
      expect(phoneBox).not.toBeNull()
      expect(formLinkBox).not.toBeNull()
      expect(phoneBox!.y + phoneBox!.height).toBeLessThanOrEqual(heroBox!.y + heroBox!.height + 1)
      expect(formLinkBox!.y + formLinkBox!.height).toBeLessThanOrEqual(heroBox!.y + heroBox!.height + 1)
      if (width <= 430) {
        expect(phoneBox!.y + phoneBox!.height).toBeLessThanOrEqual(VIEWPORT_HEIGHT)
      }

      expect(errors.consoleErrors).toEqual([])
      expect(errors.pageErrors).toEqual([])
    })
  }

  test(`DENS-CONTACT-01 form action clears sticky chrome in ${locale}`, async ({ page }) => {
    const errors = await prepareContentPage(page, locale, 390)
    const hero = page.locator('.hero-image').locator('xpath=ancestor::section[1]')
    const formLink = hero.getByRole('link', { name: CONTACT_COPY[locale].form, exact: true })

    await formLink.focus()
    await expect(formLink).toBeFocused()
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(/\/lien-he#contact-form$/)

    const geometry = await page.locator('#contact-form').evaluate((form) => {
      const header = document.querySelector('header')
      return {
        formTop: form.getBoundingClientRect().top,
        headerBottom: header?.getBoundingClientRect().bottom ?? 0,
        scrollMarginTop: Number.parseFloat(getComputedStyle(form).scrollMarginTop)
      }
    })
    expect(geometry.scrollMarginTop).toBeGreaterThanOrEqual(geometry.headerBottom)
    expect(geometry.formTop).toBeGreaterThanOrEqual(geometry.headerBottom - 1)
    expect(geometry.formTop - geometry.headerBottom).toBeLessThanOrEqual(24)

    expect(errors.consoleErrors).toEqual([])
    expect(errors.pageErrors).toEqual([])
  })

  test(`contact form exposes the future submit action without delivery claims in ${locale}`, async ({ page }) => {
    await prepareContentPage(page, locale)
    const form = page.getByTestId('contact-form')
    await expect(form.getByRole('button', { name: CONTACT_COPY[locale].action, exact: true })).toBeVisible()
    for (const claim of CONTACT_COPY[locale].forbidden) {
      await expect(form).not.toContainText(claim)
    }
  })
}
