import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

/**
 * Automated accessibility gate — axe-core across every public route, asserting zero WCAG 2.0/2.1
 * Level A + AA violations. Complements the hero readability contract (docs/hero-art-direction.md)
 * and the header state machine; it catches the structural failures those specs don't: missing
 * accessible names, broken roles/ARIA, unlabelled controls, list/heading structure, etc.
 *
 * color-contrast is deliberately disabled here. On the image-heavy pages axe cannot sample the
 * background under text that sits over the hero's gradient scrim or over a photograph, so it
 * oscillates between reporting those nodes as `violations` and as `incomplete` depending on how
 * far the background images have decoded when the scan runs — a non-deterministic result, and
 * §41 P8 forbids a flaky gate. Contrast on those surfaces is guaranteed instead by the hero
 * scrim's measured contract; contrast on solid surfaces was verified clean by a full axe pass
 * (color-contrast enabled) when this gate landed, after fixing the eyebrow kicker (wood-500 →
 * wood-600) and the filter count badges (ink-400 → ink-500).
 */
const ROUTES = [
  '/',
  '/gioi-thieu',
  '/du-an',
  '/du-an/khach-san-eo-gio',
  '/nha-xuong',
  '/dich-vu',
  '/tuyen-dung',
  '/lien-he',
  // app/error.vue renders the full site shell, so it is held to the same bar as every other
  // route. Playwright does not fail a navigation on a 404 status, so this scans normally.
  '/this-route-does-not-exist'
] as const

for (const route of ROUTES) {
  test(`a11y — ${route} has no WCAG A/AA violations`, async ({ page }, testInfo) => {
    // axe evaluates the DOM/ARIA, which is engine-independent — running it under all four VR
    // browsers would just quadruple the cost for identical results. Chromium (`vr`) only.
    test.skip(testInfo.project.name !== 'vr', 'axe runs on Chromium only')

    await page.goto(route, { waitUntil: 'networkidle' })
    const { violations } = await new AxeBuilder({ page })
      // Nuxt injects this custom element only in dev. Its own nested close button violates
      // axe's rule, but it is not application DOM and is absent from the production build.
      .exclude('nuxt-error-overlay')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .disableRules(['color-contrast'])
      .analyze()

    expect(
      violations,
      violations.map(v => `${v.id} (${v.impact}, ${v.nodes.length}): ${v.help}`).join('\n')
    ).toEqual([])
  })
}
