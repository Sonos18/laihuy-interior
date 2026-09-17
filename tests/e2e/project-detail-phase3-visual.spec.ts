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

    // The immediate facts-rail zone surrounding [data-project-facts] resolves to the dark masthead surface (var(--color-obsidian))
    const { zoneBg, expectedObsidian, stripColor, actualRailBg, expectedRailBg } = await page.evaluate(() => {
      const rail = document.querySelector('[data-project-facts]')
      const zone = rail?.closest('[data-project-facts-zone]') || (rail?.parentElement?.classList.contains('shell') ? rail.parentElement.parentElement : null)

      const probeObsidian = document.createElement('div')
      probeObsidian.style.backgroundColor = 'var(--color-obsidian)'
      document.body.appendChild(probeObsidian)
      const expectedObsidian = getComputedStyle(probeObsidian).backgroundColor
      probeObsidian.remove()

      const probeSurface = document.createElement('div')
      probeSurface.style.backgroundColor = 'var(--color-surface-dark)'
      document.body.appendChild(probeSurface)
      const expectedRailBg = getComputedStyle(probeSurface).backgroundColor
      probeSurface.remove()

      // Sample seam point directly between AppHero and facts rail (8px above the rail)
      let stripColor = ''
      if (rail) {
        const rect = rail.getBoundingClientRect()
        const el = document.elementFromPoint(rect.left + 24, rect.top - 8)
        let cur: HTMLElement | null = el as HTMLElement
        while (cur && cur !== document.documentElement) {
          const bg = getComputedStyle(cur).backgroundColor
          if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
            stripColor = bg
            break
          }
          cur = cur.parentElement
        }
      }

      return {
        zoneBg: zone ? getComputedStyle(zone).backgroundColor : '',
        expectedObsidian,
        stripColor,
        actualRailBg: rail ? getComputedStyle(rail).backgroundColor : '',
        expectedRailBg
      }
    })

    // Immediate facts-rail zone resolves to dark masthead surface
    expect(zoneBg).toBe(expectedObsidian)
    // No white/light strip between AppHero and facts rail
    expect(stripColor).toBe(expectedObsidian)
    // Rail surface resolves to elevated dark surface
    expect(actualRailBg).toBe(expectedRailBg)

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

// ─────────────────────────────────────────────────────────────────────────────
// Checkpoint P3-2: Story + Curated Gallery
// ─────────────────────────────────────────────────────────────────────────────

for (const locale of ['vi', 'en'] as const) {
  for (const viewport of PHASE3_VIEWPORTS) {
    test(`P3-2-STORY-01 surface rhythm ${locale} @ ${viewport.width}`, async ({ page }) => {
      await openProject(
        page,
        locale,
        '/du-an/khach-san-eo-gio',
        viewport.width,
        viewport.height
      )

      const story = page.locator('section#story')
      await expect(story).toBeVisible()

      // Section surface resolves to light editorial (bg-white: rgb(255, 255, 255))
      const storyBg = await story.evaluate(el => getComputedStyle(el).backgroundColor)
      expect(['rgb(255, 255, 255)', 'rgba(255, 255, 255, 1)']).toContain(storyBg)

      // Zero horizontal scroll overflow
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)
      ).toBe(true)
    })

    test(`P3-2-GALLERY-01 dark obsidian rhythm ${locale} @ ${viewport.width}`, async ({ page }) => {
      await openProject(
        page,
        locale,
        '/du-an/khach-san-eo-gio',
        viewport.width,
        viewport.height
      )

      const gallery = page.locator('section#gallery')
      await expect(gallery).toBeVisible()

      // Section surface resolves to obsidian (var(--color-obsidian): rgb(11, 10, 9))
      const { actualBg, expectedObsidian } = await gallery.evaluate((el) => {
        const probe = document.createElement('div')
        probe.style.backgroundColor = 'var(--color-obsidian)'
        document.body.appendChild(probe)
        const expectedObsidian = getComputedStyle(probe).backgroundColor
        probe.remove()
        return {
          actualBg: getComputedStyle(el).backgroundColor,
          expectedObsidian
        }
      })
      expect(actualBg).toBe(expectedObsidian)

      // Zero horizontal scroll overflow
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)
      ).toBe(true)
    })
  }

  test(`P3-2-STORY-02 quiet luxury styles ${locale}`, async ({ page }) => {
    await openProject(
      page,
      locale,
      '/du-an/khach-san-eo-gio',
      1280,
      900
    )

    const story = page.locator('section#story')
    await expect(story).toBeVisible()

    // Eyebrow uses wood/bronze tone (text-wood-600)
    const eyebrowColor = await story.locator('.eyebrow').evaluate(el => getComputedStyle(el).color)
    const probeWood = await page.evaluate(() => {
      const probe = document.createElement('div')
      probe.className = 'text-wood-600'
      document.body.appendChild(probe)
      const color = getComputedStyle(probe).color
      probe.remove()
      return color
    })
    expect(eyebrowColor).toBe(probeWood)

    // Heading uses ink-950
    const headingColor = await story.locator('h2').evaluate(el => getComputedStyle(el).color)
    const probeInk = await page.evaluate(() => {
      const probe = document.createElement('div')
      probe.className = 'text-ink-950'
      document.body.appendChild(probe)
      const color = getComputedStyle(probe).color
      probe.remove()
      return color
    })
    expect(headingColor).toBe(probeInk)

    // Challenge beat has prominent emphasis (border-l-2 with var(--bronze))
    const challengeStyle = await story.locator('[data-story-beat="challenge"]').evaluate((el) => {
      const style = getComputedStyle(el)
      const probe = document.createElement('div')
      probe.style.borderColor = 'var(--bronze)'
      document.body.appendChild(probe)
      const expectedBorder = getComputedStyle(probe).borderColor
      probe.remove()
      return {
        borderColor: style.borderLeftColor,
        borderLeftWidth: parseFloat(style.borderLeftWidth) || 0,
        expectedBorder
      }
    })
    expect(challengeStyle.borderLeftWidth).toBeGreaterThanOrEqual(2)
    expect(challengeStyle.borderColor).toBe(challengeStyle.expectedBorder)

    // No quote pullquote or blockquote in story
    expect(await story.locator('blockquote').count()).toBe(0)
    expect(await story.locator('[data-story-quote]').count()).toBe(0)
  })

  test(`P3-2-GALLERY-02 quiet luxury chrome ${locale}`, async ({ page }) => {
    await openProject(
      page,
      locale,
      '/du-an/khach-san-eo-gio',
      1280,
      900
    )

    const gallery = page.locator('section#gallery')
    await expect(gallery).toBeVisible()

    // Eyebrow resolves to var(--bronze-light)
    const { actualEyebrow, expectedBronzeLight } = await gallery.evaluate((el) => {
      const eyebrow = el.querySelector('p.eyebrow, p.reveal')
      const probe = document.createElement('div')
      probe.style.color = 'var(--bronze-light)'
      document.body.appendChild(probe)
      const expectedBronzeLight = getComputedStyle(probe).color
      probe.remove()
      return {
        actualEyebrow: eyebrow ? getComputedStyle(eyebrow).color : '',
        expectedBronzeLight
      }
    })
    expect(actualEyebrow).toBe(expectedBronzeLight)

    // Heading resolves to var(--color-ivory)
    const { actualHeading, expectedIvory } = await gallery.evaluate((el) => {
      const h2 = el.querySelector('h2')
      const probe = document.createElement('div')
      probe.style.color = 'var(--color-ivory)'
      document.body.appendChild(probe)
      const expectedIvory = getComputedStyle(probe).color
      probe.remove()
      return {
        actualHeading: h2 ? getComputedStyle(h2).color : '',
        expectedIvory
      }
    })
    expect(actualHeading).toBe(expectedIvory)

    // Filter tabs styling: active tab uses var(--bronze) background, obsidian text; inactive uses hairline border and text-muted
    const filterTabs = gallery.locator('[data-gallery-filters] button')
    if (await filterTabs.count() > 0) {
      const activeTab = gallery.locator('[data-gallery-filters] button[aria-pressed="true"]')
      const inactiveTab = gallery.locator('[data-gallery-filters] button[aria-pressed="false"]').first()

      const activeStyles = await activeTab.evaluate((el) => {
        const probeBg = document.createElement('div')
        probeBg.style.backgroundColor = 'var(--bronze)'
        document.body.appendChild(probeBg)
        const expectedBg = getComputedStyle(probeBg).backgroundColor
        probeBg.remove()

        const probeColor = document.createElement('div')
        probeColor.style.color = 'var(--color-obsidian)'
        document.body.appendChild(probeColor)
        const expectedColor = getComputedStyle(probeColor).color
        probeColor.remove()

        const style = getComputedStyle(el)
        return {
          bg: style.backgroundColor,
          color: style.color,
          expectedBg,
          expectedColor
        }
      })
      expect(activeStyles.bg).toBe(activeStyles.expectedBg)
      expect(activeStyles.color).toBe(activeStyles.expectedColor)

      if (await inactiveTab.count() > 0) {
        const inactiveStyles = await inactiveTab.evaluate((el) => {
          const probeBorder = document.createElement('div')
          probeBorder.style.borderColor = 'var(--hairline)'
          document.body.appendChild(probeBorder)
          const expectedBorder = getComputedStyle(probeBorder).borderColor
          probeBorder.remove()

          const probeColor = document.createElement('div')
          probeColor.style.color = 'var(--text-muted)'
          document.body.appendChild(probeColor)
          const expectedColor = getComputedStyle(probeColor).color
          probeColor.remove()

          const style = getComputedStyle(el)
          return {
            borderColor: style.borderColor,
            color: style.color,
            expectedBorder,
            expectedColor
          }
        })
        expect(inactiveStyles.borderColor).toBe(inactiveStyles.expectedBorder)
        expect(inactiveStyles.color).toBe(inactiveStyles.expectedColor)
      }
    }

    // Long-media disclosure button: bronze outline styling
    const disclosureBtn = gallery.locator('[data-project-full-gallery] button')
    if (await disclosureBtn.count() > 0) {
      const btnStyles = await disclosureBtn.evaluate((el) => {
        const probeBorder = document.createElement('div')
        probeBorder.style.borderColor = 'var(--bronze)'
        document.body.appendChild(probeBorder)
        const expectedBorder = getComputedStyle(probeBorder).borderColor
        probeBorder.remove()

        const probeColor = document.createElement('div')
        probeColor.style.color = 'var(--bronze-light)'
        document.body.appendChild(probeColor)
        const expectedColor = getComputedStyle(probeColor).color
        probeColor.remove()

        const style = getComputedStyle(el)
        return {
          borderColor: style.borderColor,
          color: style.color,
          expectedBorder,
          expectedColor
        }
      })
      expect(btnStyles.borderColor).toBe(btnStyles.expectedBorder)
      expect(btnStyles.color).toBe(btnStyles.expectedColor)
    }

    // AppGalleryCarousel track is visible
    const carousel = gallery.locator('[data-gallery-carousel]')
    await expect(carousel).toBeVisible()
  })
}

test('P3-2-GALLERY-03 sparse project with short media flow renders without filter tabs', async ({ page }) => {
  await openProject(
    page,
    'vi',
    '/du-an/nha-xuong-anh-cuong',
    1280,
    900
  )

  const gallery = page.locator('section#gallery')
  await expect(gallery).toBeVisible()
  await expect(gallery).toHaveAttribute('data-media-flow', 'short')
  expect(await page.locator('[data-gallery-filters]').count()).toBe(0)
  expect(await page.locator('[data-project-full-gallery]').count()).toBe(0)
})

test('P3-2-GALLERY-04 rich project gallery interactions', async ({ page }) => {
  await openProject(
    page,
    'vi',
    '/du-an/khach-san-eo-gio',
    1280,
    900
  )

  const filterTabs = page.locator('[data-gallery-filters] button')
  const tabCount = await filterTabs.count()
  if (tabCount > 1) {
    const secondTab = filterTabs.nth(1)
    await secondTab.click()
    await expect(secondTab).toHaveAttribute('aria-pressed', 'true')
  }

  const disclosureBtn = page.locator('[data-project-full-gallery] button')
  if (await disclosureBtn.count() > 0) {
    await disclosureBtn.click()
    const dialog = page.locator('div[role="dialog"]')
    await expect(dialog).toBeVisible()
  }
})
