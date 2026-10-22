import { expect, test } from './fixtures'
import { APP_ORIGIN } from './origin'

const TEST_ORIGIN = process.env.DENSITY_TEST_ORIGIN ?? APP_ORIGIN

async function placeholderMotion(page: import('@playwright/test').Page) {
  await page.route('**/*', async (route) => {
    if (route.request().resourceType() === 'image') {
      await route.abort()
      return
    }
    await route.continue()
  })

  await page.goto(new URL('/nha-xuong', TEST_ORIGIN).toString(), {
    waitUntil: 'domcontentloaded'
  })

  const skeleton = page
    .locator('div.relative.overflow-hidden > div.absolute.inset-0.bg-ink-100')
    .first()
  await expect(skeleton).toBeVisible()

  return skeleton.evaluate((element) => {
    const style = getComputedStyle(element)
    return {
      animationName: style.animationName,
      transitionDurations: style.transitionDuration.split(',').map(value => value.trim()),
      transitionProperties: style.transitionProperty.split(',').map(value => value.trim()),
      transitionCurve: style.transitionTimingFunction
    }
  })
}

test('MediaImage keeps its loading placeholder static, and releases it on the arrival token', async ({ page }) => {
  // The fixture forces reduced motion for the visual baselines; the release only has a duration
  // when motion is allowed.
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  const motion = await placeholderMotion(page)

  expect(motion.animationName).toBe('none')
  expect(motion.transitionProperties).toContain('opacity')
  // --dur-arrive (400ms) on --ease-editorial, not Tailwind's default 500ms.
  expect(motion.transitionDurations).toContain('0.4s')
  expect(motion.transitionCurve).toBe('cubic-bezier(0.22, 0.61, 0.36, 1)')
})

test('MediaImage releases its placeholder instantly under reduced motion', async ({ page }) => {
  const motion = await placeholderMotion(page)

  expect(motion.animationName).toBe('none')
  expect(motion.transitionDurations.every(duration => duration === '0s')).toBe(true)
})
