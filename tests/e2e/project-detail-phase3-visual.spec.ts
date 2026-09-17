import type { Page } from '@playwright/test'
import { expect, test } from './fixtures'

const TEST_ORIGIN = process.env.PROJECT_DETAIL_TEST_ORIGIN ?? 'http://localhost:3000'

const TRANSPARENT_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M/wHwAF/gL+X9j7WQAAAABJRU5ErkJggg==',
  'base64'
)

async function openProject(
  page: Page,
  locale: 'vi' | 'en',
  path: string,
  width: number,
  height = 900
) {
  await page.context().addCookies([
    { name: 'lai-huy-locale', value: locale, url: TEST_ORIGIN }
  ])

  await page.route('**/*', async (route) => {
    if (route.request().resourceType() === 'image') {
      await route.fulfill({
        status: 200,
        contentType: 'image/png',
        body: TRANSPARENT_PNG
      })
      return
    }

    await route.continue()
  })

  await page.setViewportSize({ width, height })

  await page.goto(
    new URL(path, TEST_ORIGIN).toString(),
    { waitUntil: 'load' }
  )

  await page.waitForFunction(() => Boolean(
    (document.querySelector('#__nuxt') as
      HTMLElement & { __vue_app__?: unknown })?.__vue_app__
  ))

  await page.evaluate(() => document.fonts.ready)
}

async function gridColumnCount(page: Page, selector: string) {
  return page.locator(selector).evaluate((element) => {
    const columns = getComputedStyle(element).gridTemplateColumns
    return columns === 'none'
      ? 1
      : columns.split(' ').filter(Boolean).length
  })
}

const PHASE3_VIEWPORTS = [
  { width: 390, height: 844, facts: 2 },
  { width: 767, height: 900, facts: 2 },
  { width: 768, height: 1024, facts: 3 },
  { width: 1023, height: 900, facts: 3 },
  { width: 1024, height: 900, facts: 3 },
  { width: 1279, height: 900, facts: 3 },
  { width: 1280, height: 900, facts: 5 },
  { width: 1440, height: 900, facts: 5 }
] as const

for (const locale of ['vi', 'en'] as const) {
  for (const viewport of PHASE3_VIEWPORTS) {
    test(`P3-1-HERO-01 ${locale} @ ${viewport.width}`, async ({ page }) => {
      await openProject(
        page,
        locale,
        '/du-an/khach-san-eo-gio',
        viewport.width,
        viewport.height
      )

      expect(
        await page.locator('[data-project-fact]').count()
      ).toBe(5)

      expect(
        await gridColumnCount(page, '[data-project-facts] dl')
      ).toBe(viewport.facts)

      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth
        )
      ).toBe(true)
    })
  }

  test(`P3-1-HERO-02 quiet luxury styles ${locale}`, async ({ page }) => {
    await openProject(
      page,
      locale,
      '/du-an/khach-san-eo-gio',
      1280,
      900
    )

    // Facts rail computed background resolves to the existing Obsidian token
    const { actualBg, expectedBg } = await page.evaluate(() => {
      const el = document.querySelector('[data-project-facts]')
      const actualBg = el ? getComputedStyle(el).backgroundColor : ''
      const probe = document.createElement('div')
      probe.style.backgroundColor = 'var(--color-obsidian)'
      document.body.appendChild(probe)
      const expectedBg = getComputedStyle(probe).backgroundColor
      probe.remove()
      return { actualBg, expectedBg }
    })
    expect(actualBg).toBe(expectedBg)

    // Architectural specs rail: shell-bounded, hairline-gold border, compact radius, no heavy shadow
    const railMetrics = await page.evaluate(() => {
      const rail = document.querySelector('[data-project-facts]')
      if (!rail) return null
      const rect = rail.getBoundingClientRect()
      const style = getComputedStyle(rail)

      const probeGold = document.createElement('div')
      probeGold.style.borderColor = 'var(--hairline-gold)'
      document.body.appendChild(probeGold)
      const expectedGold = getComputedStyle(probeGold).borderColor
      probeGold.remove()

      return {
        width: rect.width,
        windowWidth: window.innerWidth,
        borderColor: style.borderColor || style.borderTopColor,
        expectedGold,
        borderRadius: parseFloat(style.borderRadius) || 0,
        boxShadow: style.boxShadow
      }
    })

    expect(railMetrics).not.toBeNull()
    // Shell-bounded rather than full viewport width
    expect(railMetrics!.width).toBeLessThan(railMetrics!.windowWidth)
    // Outer rail uses hairline-gold
    expect(railMetrics!.borderColor).toBe(railMetrics!.expectedGold)
    // Compact non-zero radius
    expect(railMetrics!.borderRadius).toBeGreaterThan(0)
    // Tactile depth without heavy shadow
    expect(railMetrics!.boxShadow === 'none' || !railMetrics!.boxShadow.includes('50px')).toBe(true)

    // Facts dividers resolve to existing architectural hairline color
    const { actualBorder, expectedBorder } = await page.evaluate(() => {
      const factEl = document.querySelector('[data-project-fact]')
      const actualBorder = factEl ? getComputedStyle(factEl).borderColor : ''
      const probe = document.createElement('div')
      probe.style.borderColor = 'var(--hairline)'
      document.body.appendChild(probe)
      const expectedBorder = getComputedStyle(probe).borderColor
      probe.remove()
      return { actualBorder, expectedBorder }
    })
    expect(actualBorder).toBe(expectedBorder)

    // Category treatment is visually bronze/kicker-like
    const { actualColor, expectedColor } = await page.evaluate(() => {
      const categoryEl = document.querySelector('[data-project-chapter="hero"] span.uppercase')
      const actualColor = categoryEl ? getComputedStyle(categoryEl).color : ''
      const probe = document.createElement('div')
      probe.style.color = 'var(--bronze-light)'
      document.body.appendChild(probe)
      const expectedColor = getComputedStyle(probe).color
      probe.remove()
      return { actualColor, expectedColor }
    })
    expect(actualColor).toBe(expectedColor)
  })

  test(`P3-1-SUBNAV-01 quiet luxury contract ${locale}`, async ({ page }) => {
    await openProject(
      page,
      locale,
      '/du-an/khach-san-eo-gio',
      1280,
      900
    )

    const subnav = page.locator('nav[data-project-subnav]')
    await expect(subnav).toBeVisible()

    // Anchors remain exactly: #story, #gallery, #delivery, #materials
    const hrefs = await subnav.locator('a').evaluateAll(links =>
      links.map(a => a.getAttribute('href'))
    )
    expect(hrefs).toEqual(['#story', '#gallery', '#delivery', '#materials'])

    // Initial active Story anchor remains observable through aria-current="location"
    const activeLink = subnav.locator('a[aria-current="location"]')
    await expect(activeLink).toHaveAttribute('href', '#story')

    // Dark translucent Obsidian backdrop
    const { actualNavBg, expectedNavBg } = await page.evaluate(() => {
      const nav = document.querySelector('nav[data-project-subnav]')
      const actualNavBg = nav ? getComputedStyle(nav).backgroundColor : ''
      const probe = document.createElement('div')
      probe.style.backgroundColor = 'color-mix(in srgb, var(--color-obsidian) 92%, transparent)'
      document.body.appendChild(probe)
      const expectedNavBg = getComputedStyle(probe).backgroundColor
      probe.remove()
      return { actualNavBg, expectedNavBg }
    })
    expect(actualNavBg).toBe(expectedNavBg)

    // Backdrop blur must resolve to 16px (backdrop-blur-lg)
    const backdropFilter = await page.evaluate(() => {
      const nav = document.querySelector('nav[data-project-subnav]')
      return nav ? (getComputedStyle(nav).backdropFilter || '') : ''
    })
    expect(backdropFilter).toContain('16px')

    // --hairline-gold bottom divider
    const { actualBorderBottom, expectedBorderBottom } = await page.evaluate(() => {
      const nav = document.querySelector('nav[data-project-subnav]')
      const actualBorderBottom = nav ? getComputedStyle(nav).borderBottomColor : ''
      const probe = document.createElement('div')
      probe.style.borderBottomColor = 'var(--hairline-gold)'
      document.body.appendChild(probe)
      const expectedBorderBottom = getComputedStyle(probe).borderBottomColor
      probe.remove()
      return { actualBorderBottom, expectedBorderBottom }
    })
    expect(actualBorderBottom).toBe(expectedBorderBottom)

    // Bronze active state (bg-bronze, text-obsidian, font-semibold: 600)
    const { actualActiveBg, actualActiveColor, expectedActiveBg, expectedActiveColor, activeFontWeight } = await page.evaluate(() => {
      const active = document.querySelector('nav[data-project-subnav] a[aria-current="location"]')
      const actualActiveBg = active ? getComputedStyle(active).backgroundColor : ''
      const actualActiveColor = active ? getComputedStyle(active).color : ''
      const activeFontWeight = active ? getComputedStyle(active).fontWeight : ''
      const probe = document.createElement('div')
      probe.style.backgroundColor = 'var(--bronze)'
      probe.style.color = 'var(--color-obsidian)'
      document.body.appendChild(probe)
      const expectedActiveBg = getComputedStyle(probe).backgroundColor
      const expectedActiveColor = getComputedStyle(probe).color
      probe.remove()
      return { actualActiveBg, actualActiveColor, expectedActiveBg, expectedActiveColor, activeFontWeight }
    })
    expect(actualActiveBg).toBe(expectedActiveBg)
    expect(actualActiveColor).toBe(expectedActiveColor)
    expect(activeFontWeight).toBe('600')

    // Inactive text remains readable (var(--text-muted), font-medium: 500)
    const { actualInactiveColor, expectedInactiveColor, inactiveFontWeight } = await page.evaluate(() => {
      const inactive = document.querySelector('nav[data-project-subnav] a:not([aria-current="location"])')
      const actualInactiveColor = inactive ? getComputedStyle(inactive).color : ''
      const inactiveFontWeight = inactive ? getComputedStyle(inactive).fontWeight : ''
      const probe = document.createElement('div')
      probe.style.color = 'var(--text-muted)'
      document.body.appendChild(probe)
      const expectedInactiveColor = getComputedStyle(probe).color
      probe.remove()
      return { actualInactiveColor, expectedInactiveColor, inactiveFontWeight }
    })
    expect(actualInactiveColor).toBe(expectedInactiveColor)
    expect(inactiveFontWeight).toBe('500')
  })

  for (const width of [390, 767] as const) {
    test(`P3-1-SUBNAV-02 mobile scroll ${locale} @ ${width}`, async ({ page }) => {
      await openProject(
        page,
        locale,
        '/du-an/khach-san-eo-gio',
        width,
        844
      )

      const shellOverflowX = await page.locator('nav[data-project-subnav] .shell').evaluate(
        el => getComputedStyle(el).overflowX
      )
      expect(['auto', 'scroll']).toContain(shellOverflowX)

      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth
        )
      ).toBe(true)
    })
  }
}
