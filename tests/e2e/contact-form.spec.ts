import { expect, test } from './fixtures'
import { settle } from './helpers'
import type { Page } from '@playwright/test'

/**
 * The form's behaviour gate. axe (a11y.spec.ts) checks the page's static markup; it cannot
 * press submit, so the invalid and success states are only ever exercised here.
 */

/**
 * Block until Vue owns the form, then leave it in the invalid state.
 *
 * Typing into a field before hydration writes to the DOM only: the model is still empty, and
 * the first render after hydration puts the input back. A test that fills too early submits a
 * blank form and every field reports "required". `settle()` does not cover this — it waits for
 * fonts and images, not for the framework.
 *
 * The probe is the app's own public behaviour rather than a framework internal or a fixed
 * timeout (§41 P8 — determinism, not re-rolling): submitting an empty form can only produce
 * the alert once the `@submit.prevent` handler is live.
 *
 * The click is RETRIED, not merely awaited. A click that lands before hydration is swallowed
 * for good — there is no handler to receive it and nothing replays it — so waiting on the
 * alert afterwards waits forever. `toPass` re-clicks until the app answers, which is the only
 * form of this probe that actually converges. Everything after this call is racing nothing.
 */
async function submitEmptyAndWaitForVue(page: Page) {
  await expect(async () => {
    await page.getByRole('button', { name: /Gửi yêu cầu/ }).click()
    await expect(page.getByRole('alert')).toBeVisible({ timeout: 1000 })
  }).toPass({ timeout: 30_000 })
}

test.describe('contact form', () => {
  test('an empty submit is blocked, announced and focused', async ({ page }) => {
    await page.goto('/lien-he', { waitUntil: 'load' })
    await settle(page)

    await submitEmptyAndWaitForVue(page)

    // Still on the page: nothing was dispatched.
    await expect(page).toHaveURL(/\/lien-he$/)

    const name = page.getByLabel('Họ tên')
    await expect(name).toHaveAttribute('aria-invalid', 'true')
    await expect(name).toBeFocused()

    // The message is wired to the input, not merely placed near it.
    const describedBy = await name.getAttribute('aria-describedby')
    expect(describedBy).toBeTruthy()
    await expect(page.locator(`#${describedBy}`)).toBeVisible()
  })

  test('fixing the fields clears their errors, and a bad email keeps its own', async ({ page }) => {
    await page.goto('/lien-he', { waitUntil: 'load' })
    await settle(page)

    // Start from the all-invalid state, so this also proves errors CLEAR when fixed rather
    // than only that they appear.
    await submitEmptyAndWaitForVue(page)

    await page.getByLabel('Họ tên').fill('Nguyen Van A')
    await page.getByLabel('Điện thoại').fill('0903102012')
    await page.getByLabel('Email').fill('not-an-email')
    await page.getByLabel('Loại dự án').selectOption({ index: 1 })
    await page.getByLabel('Thông tin công trình').fill('Khách sạn 40 phòng tại Vĩnh Long.')

    await page.getByRole('button', { name: /Gửi yêu cầu/ }).click()

    await expect(page.getByLabel('Email')).toHaveAttribute('aria-invalid', 'true')
    await expect(page.getByLabel('Họ tên')).not.toHaveAttribute('aria-invalid', 'true')
    await expect(page.getByLabel('Điện thoại')).not.toHaveAttribute('aria-invalid', 'true')
    await expect(page.getByLabel('Thông tin công trình')).not.toHaveAttribute('aria-invalid', 'true')
  })

  test('a valid submit reaches the success state', async ({ page }) => {
    await page.goto('/lien-he', { waitUntil: 'load' })
    await settle(page)

    await submitEmptyAndWaitForVue(page)

    await page.getByLabel('Họ tên').fill('Nguyen Van A')
    await page.getByLabel('Điện thoại').fill('0903102012')
    await page.getByLabel('Email').fill('a@example.com')
    await page.getByLabel('Loại dự án').selectOption({ index: 1 })
    await page.getByLabel('Thông tin công trình').fill('Khách sạn 40 phòng tại Vĩnh Long.')

    // The mailto adapter assigns window.location.href. Chromium has no mail handler
    // registered here, so the assignment is a no-op and the page stays put — which is what
    // lets the success state be asserted at all.
    await page.getByRole('button', { name: /Gửi yêu cầu/ }).click()

    await expect(page.getByRole('status')).toContainText('Đã mở email của bạn')
    // Success REPLACES the form; leaving a filled form beside a "sent" message invites a
    // second submission.
    await expect(page.getByLabel('Họ tên')).toBeHidden()
  })
})
