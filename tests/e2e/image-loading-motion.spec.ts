import { expect, test } from './fixtures'

const TEST_ORIGIN = process.env.DENSITY_TEST_ORIGIN ?? 'http://localhost:3000'

test('MediaImage keeps its loading placeholder static', async ({ page }) => {
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

  const motion = await skeleton.evaluate((element) => {
    const style = getComputedStyle(element)
    return {
      animationName: style.animationName,
      transitionDurations: style.transitionDuration.split(',').map(value => value.trim()),
      transitionProperties: style.transitionProperty.split(',').map(value => value.trim())
    }
  })

  expect(motion.animationName).toBe('none')
  expect(motion.transitionProperties).toContain('opacity')
  expect(motion.transitionDurations).toContain('0.5s')
})
