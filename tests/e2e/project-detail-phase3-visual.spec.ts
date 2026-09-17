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

      if (viewport.width === 390) {
        expect(await gridColumnCount(page, '[data-story-layout]')).toBe(1)
      }
      if (viewport.width === 1280) {
        expect(await gridColumnCount(page, '[data-story-layout]')).toBe(2)
      }

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

    // Story grid columns at 1280 resolves to 2 columns
    expect(await gridColumnCount(page, '[data-story-layout]')).toBe(2)

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

    // Carousel counter contrast & token compliance on dark Obsidian surface
    const counter = carousel.locator('p[aria-live="polite"]')
    await expect(counter).toBeVisible()

    const counterEvaluation = await counter.evaluate((el) => {
      const computed = getComputedStyle(el)
      const color = computed.color

      // Create probes for approved dark tokens
      const probeTokens = [
        '--color-ivory',
        '--text-muted',
        '--text-subtle',
        '--bronze',
        '--bronze-light',
        '--hairline',
        '--hairline-gold'
      ]
      const approvedColors = probeTokens.map((token) => {
        const p = document.createElement('div')
        p.style.color = `var(${token})`
        document.body.appendChild(p)
        const c = getComputedStyle(p).color
        p.remove()
        return c
      })

      // Probe legacy text-ink-700
      const probeInk = document.createElement('div')
      probeInk.className = 'text-ink-700'
      document.body.appendChild(probeInk)
      const legacyInk700 = getComputedStyle(probeInk).color
      probeInk.remove()

      return {
        color,
        approvedColors,
        legacyInk700
      }
    })

    // Contrast is not legacy text-ink-700
    expect(counterEvaluation.color).not.toBe(counterEvaluation.legacyInk700)
    // Computed text color resolves to an approved dark-surface text token
    expect(counterEvaluation.approvedColors).toContain(counterEvaluation.color)

    // Control buttons remain visible
    const prevBtn = carousel.getByRole('button', { name: /trước|previous/i })
    await expect(prevBtn).toBeVisible()
    const nextBtn = carousel.getByRole('button', { name: /tiếp theo|next/i })
    await expect(nextBtn).toBeVisible()
  })
}

for (const width of [390, 1280] as const) {
  test(`P3-2-GALLERY-03 sparse project with short media flow @ ${width}`, async ({ page }) => {
    await openProject(
      page,
      'vi',
      '/du-an/nha-xuong-anh-cuong',
      width,
      width === 390 ? 844 : 900
    )

    const gallery = page.locator('section#gallery')
    await expect(gallery).toBeVisible()
    await expect(gallery).toHaveAttribute('data-media-flow', 'short')
    expect(await page.locator('[data-gallery-filters]').count()).toBe(0)
    expect(await page.locator('[data-project-full-gallery]').count()).toBe(0)

    const carousel = gallery.locator('[data-gallery-carousel]')
    await expect(carousel).toBeVisible()

    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)
    ).toBe(true)
  })

  test(`P3-2-GALLERY-04 rich project gallery interactions @ ${width}`, async ({ page }) => {
    await openProject(
      page,
      'vi',
      '/du-an/khach-san-eo-gio',
      width,
      width === 390 ? 844 : 900
    )

    const carousel = page.locator('[data-gallery-carousel]')
    await expect(carousel).toBeVisible()

    // Next changes active index
    await expect(carousel).toHaveAttribute('data-gallery-active-index', '0')
    const nextBtn = carousel.getByRole('button', { name: /tiếp theo|next/i })
    await expect(nextBtn).toBeVisible()
    await nextBtn.click()
    await expect(carousel).toHaveAttribute('data-gallery-active-index', '1')

    // Previous restores / changes index appropriately
    const prevBtn = carousel.getByRole('button', { name: /trước|previous/i })
    await expect(prevBtn).toBeVisible()
    await prevBtn.click()
    await expect(carousel).toHaveAttribute('data-gallery-active-index', '0')

    // Filters still work where available
    const filterTabs = page.locator('[data-gallery-filters] button')
    const tabCount = await filterTabs.count()
    if (tabCount > 1) {
      const secondTab = filterTabs.nth(1)
      await secondTab.click()
      await expect(secondTab).toHaveAttribute('aria-pressed', 'true')
    }

    // Full-gallery disclosure opens lightbox
    const disclosureBtn = page.locator('[data-project-full-gallery] button')
    if (await disclosureBtn.count() > 0) {
      await disclosureBtn.click()
      const dialog = page.locator('div[role="dialog"]')
      await expect(dialog).toBeVisible()
    }
  })
}

// ─────────────────────────────────────────────────────────────────────────────
// Checkpoint P3-3: Delivery Proof + Material Story
// ─────────────────────────────────────────────────────────────────────────────

for (const locale of ['vi', 'en'] as const) {
  for (const viewport of PHASE3_VIEWPORTS) {
    test(`P3-3-DELIVERY-01 responsive timeline ${locale} @ ${viewport.width}`, async ({ page }) => {
      await openProject(
        page,
        locale,
        '/du-an/khach-san-eo-gio',
        viewport.width,
        viewport.height
      )

      const delivery = page.locator('section#delivery')
      await expect(delivery).toBeVisible()

      // Light editorial surface (bg-white: rgb(255, 255, 255) or bg-ink-50: rgb(247, 247, 245))
      const deliveryBg = await delivery.evaluate(el => getComputedStyle(el).backgroundColor)
      expect(['rgb(255, 255, 255)', 'rgba(255, 255, 255, 1)', 'rgb(247, 247, 245)']).toContain(deliveryBg)

      // Timeline column reflow (1 column for <768px, 5 columns for >=768px)
      const cols = await gridColumnCount(page, '[data-delivery-timeline]')
      if (viewport.width < 768) {
        expect(cols).toBe(1)
      } else {
        expect(cols).toBe(5)
      }

      // Zero horizontal scroll overflow
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)
      ).toBe(true)
    })

    test(`P3-3-MATERIAL-01 surface rhythm ${locale} @ ${viewport.width}`, async ({ page }) => {
      await openProject(
        page,
        locale,
        '/du-an/khach-san-eo-gio',
        viewport.width,
        viewport.height
      )

      const materials = page.locator('section#materials')
      await expect(materials).toBeVisible()

      // Dark elevated Obsidian surface (var(--color-surface-dark): rgb(20, 18, 16))
      const { actualBg, expectedSurfaceDark } = await materials.evaluate((el) => {
        const probeDark = document.createElement('div')
        probeDark.style.backgroundColor = 'var(--color-surface-dark)'
        document.body.appendChild(probeDark)
        const expectedSurfaceDark = getComputedStyle(probeDark).backgroundColor
        probeDark.remove()

        return {
          actualBg: getComputedStyle(el).backgroundColor,
          expectedSurfaceDark
        }
      })
      expect(actualBg).toBe(expectedSurfaceDark)

      // Zero horizontal scroll overflow
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)
      ).toBe(true)
    })
  }

  for (const width of [390, 1280] as const) {
    test(`P3-3-DELIVERY-02 visual contract ${locale} @ ${width}`, async ({ page }) => {
      await openProject(
        page,
        locale,
        '/du-an/khach-san-eo-gio',
        width,
        width === 390 ? 844 : 900
      )

      const delivery = page.locator('section#delivery')
      await expect(delivery).toBeVisible()

      // Eyebrow uses light accent system (var(--accent-light))
      const { actualEyebrow, expectedAccent } = await delivery.evaluate((el) => {
        const eyebrow = el.querySelector('p.eyebrow, p.reveal')
        const probe = document.createElement('div')
        probe.style.color = 'var(--accent-light)'
        document.body.appendChild(probe)
        const expectedAccent = getComputedStyle(probe).color
        probe.remove()
        return {
          actualEyebrow: eyebrow ? getComputedStyle(eyebrow).color : '',
          expectedAccent
        }
      })
      expect(actualEyebrow).toBe(expectedAccent)

      // Heading uses light foreground (var(--fg-light))
      const { actualHeading, expectedFg } = await delivery.evaluate((el) => {
        const h2 = el.querySelector('h2')
        const probe = document.createElement('div')
        probe.style.color = 'var(--fg-light)'
        document.body.appendChild(probe)
        const expectedFg = getComputedStyle(probe).color
        probe.remove()
        return {
          actualHeading: h2 ? getComputedStyle(h2).color : '',
          expectedFg
        }
      })
      expect(actualHeading).toBe(expectedFg)

      // Scope rail uses semantic light rules: border uses var(--rule-light)
      const { scopeBorderTop, scopeItemBorderRight, expectedRuleLight } = await delivery.evaluate((el) => {
        const scopeUl = el.querySelector('ul')
        const scopeLi = el.querySelector('li[data-scope-key]')
        const probe = document.createElement('div')
        probe.style.borderColor = 'var(--rule-light)'
        document.body.appendChild(probe)
        const expectedRuleLight = getComputedStyle(probe).borderColor
        probe.remove()
        return {
          scopeBorderTop: scopeUl ? getComputedStyle(scopeUl).borderTopColor : '',
          scopeItemBorderRight: scopeLi ? getComputedStyle(scopeLi).borderRightColor : '',
          expectedRuleLight
        }
      })
      expect(scopeBorderTop).toBe(expectedRuleLight)
      expect(scopeItemBorderRight).toBe(expectedRuleLight)

      // Scope icons use accent (var(--accent-light))
      const { actualScopeIcon, expectedScopeIcon } = await delivery.evaluate((el) => {
        const icon = el.querySelector('li[data-scope-key] svg, li[data-scope-key] span')
        const probe = document.createElement('div')
        probe.style.color = 'var(--accent-light)'
        document.body.appendChild(probe)
        const expectedScopeIcon = getComputedStyle(probe).color
        probe.remove()
        return {
          actualScopeIcon: icon ? getComputedStyle(icon).color : '',
          expectedScopeIcon
        }
      })
      expect(actualScopeIcon).toBe(expectedScopeIcon)

      // Timeline dividers use semantic light rule (var(--rule-light))
      const { timelineBorder, expectedTimelineRule } = await delivery.evaluate((el) => {
        const phaseLi = el.querySelector('[data-delivery-timeline] li')
        const probe = document.createElement('div')
        probe.style.borderColor = 'var(--rule-light)'
        document.body.appendChild(probe)
        const expectedTimelineRule = getComputedStyle(probe).borderColor
        probe.remove()
        return {
          timelineBorder: phaseLi ? (getComputedStyle(phaseLi).borderTopColor || getComputedStyle(phaseLi).borderLeftColor) : '',
          expectedTimelineRule
        }
      })
      expect(timelineBorder).toBe(expectedTimelineRule)

      // Phase numbers use accent (var(--accent-light))
      const { actualPhaseNum, expectedPhaseNum } = await delivery.evaluate((el) => {
        const num = el.querySelector('[data-delivery-timeline] li span')
        const probe = document.createElement('div')
        probe.style.color = 'var(--accent-light)'
        document.body.appendChild(probe)
        const expectedPhaseNum = getComputedStyle(probe).color
        probe.remove()
        return {
          actualPhaseNum: num ? getComputedStyle(num).color : '',
          expectedPhaseNum
        }
      })
      expect(actualPhaseNum).toBe(expectedPhaseNum)

      // Execution proof blocks use restrained bronze top rule
      const proofArticles = delivery.locator('[data-execution-proof]')
      const proofCount = await proofArticles.count()
      expect(proofCount).toBe(3)

      const firstProof = proofArticles.first()
      const proofMetrics = await firstProof.evaluate((el) => {
        const style = getComputedStyle(el)
        const probeBronze = document.createElement('div')
        probeBronze.style.borderColor = 'var(--bronze)'
        document.body.appendChild(probeBronze)
        const expectedBronze = getComputedStyle(probeBronze).borderColor
        probeBronze.remove()

        return {
          borderTopColor: style.borderTopColor,
          borderTopWidth: parseFloat(style.borderTopWidth) || 0,
          boxShadow: style.boxShadow,
          expectedBronze
        }
      })
      expect(proofMetrics.borderTopWidth).toBeGreaterThanOrEqual(2)
      expect(proofMetrics.borderTopColor).toBe(proofMetrics.expectedBronze)
      expect(proofMetrics.boxShadow === 'none' || !proofMetrics.boxShadow.includes('50px')).toBe(true)
    })

    test(`P3-3-DELIVERY-03 scope safety ${locale} @ ${width}`, async ({ page }) => {
      // Rich fixture: /du-an/khach-san-eo-gio
      await openProject(
        page,
        locale,
        '/du-an/khach-san-eo-gio',
        width,
        width === 390 ? 844 : 900
      )

      const richDelivery = page.locator('section#delivery')
      await expect(richDelivery).toBeVisible()

      // Scope items contain design, production, installation
      const scopeTexts = await richDelivery.locator('li[data-scope-key]').allTextContents()
      const combinedScope = scopeTexts.join(' ')
      if (locale === 'vi') {
        expect(combinedScope).toContain('Thiết kế')
        expect(combinedScope).toContain('Sản xuất')
        expect(combinedScope).toContain('Thi công')
      } else {
        expect(combinedScope).toContain('Design')
        expect(combinedScope).toContain('Production')
        expect(combinedScope).toContain('Installation')
      }

      // Rich fixture has exactly 3 execution proofs
      expect(await richDelivery.locator('[data-execution-proof]').count()).toBe(3)

      // Design-only fixture: /du-an/nha-vuon-chily
      await openProject(
        page,
        locale,
        '/du-an/nha-vuon-chily',
        width,
        width === 390 ? 844 : 900
      )

      const designDelivery = page.locator('section#delivery')
      await expect(designDelivery).toBeVisible()

      // Design scope is visible
      const designScopeTexts = await designDelivery.locator('li[data-scope-key]').allTextContents()
      const designCombinedScope = designScopeTexts.join(' ')
      if (locale === 'vi') {
        expect(designCombinedScope).toContain('Thiết kế')
      } else {
        expect(designCombinedScope).toContain('Design')
      }

      // Design-only fixture has strictly 0 execution proofs
      expect(await designDelivery.locator('[data-execution-proof]').count()).toBe(0)

      // No manufacturing proof, no craft proof, no factory claims
      expect(await designDelivery.locator('[data-execution-proof="direct-factory"]').count()).toBe(0)
      expect(await designDelivery.locator('[data-execution-proof="craft"]').count()).toBe(0)
      expect(await designDelivery.locator('[data-execution-proof="quality"]').count()).toBe(0)

      const deliverySectionText = (await designDelivery.textContent()) || ''
      expect(deliverySectionText).not.toMatch(/nhà xưởng|direct factory|xưởng sản xuất/i)
    })

    test(`P3-3-MATERIAL-02 visual contract ${locale} @ ${width}`, async ({ page }) => {
      await openProject(
        page,
        locale,
        '/du-an/khach-san-eo-gio',
        width,
        width === 390 ? 844 : 900
      )

      const materials = page.locator('section#materials')
      await expect(materials).toBeVisible()

      // Eyebrow resolves to bronze-light
      const { actualEyebrow, expectedBronzeLight } = await materials.evaluate((el) => {
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

      // Title resolves to ivory
      const { actualTitle, expectedIvory } = await materials.evaluate((el) => {
        const h2 = el.querySelector('h2')
        const probe = document.createElement('div')
        probe.style.color = 'var(--color-ivory)'
        document.body.appendChild(probe)
        const expectedIvory = getComputedStyle(probe).color
        probe.remove()
        return {
          actualTitle: h2 ? getComputedStyle(h2).color : '',
          expectedIvory
        }
      })
      expect(actualTitle).toBe(expectedIvory)

      // Experience copy uses muted dark-surface text (var(--text-muted))
      const { actualExp, expectedMuted } = await materials.evaluate((el) => {
        const p = el.querySelector('[data-material-layout] > p')
        const probe = document.createElement('div')
        probe.style.color = 'var(--text-muted)'
        document.body.appendChild(probe)
        const expectedMuted = getComputedStyle(probe).color
        probe.remove()
        return {
          actualExp: p ? getComputedStyle(p).color : '',
          expectedMuted
        }
      })
      expect(actualExp).toBe(expectedMuted)

      // Highlights use bronze numbering and hairline dividers
      const highlightsList = materials.locator('ul').first()
      const highlightStyles = await highlightsList.evaluate((el) => {
        const num = el.querySelector('span')
        const probeBronze = document.createElement('div')
        probeBronze.style.color = 'var(--bronze-light)'
        document.body.appendChild(probeBronze)
        const expectedBronze = getComputedStyle(probeBronze).color
        probeBronze.remove()

        const probeHairline = document.createElement('div')
        probeHairline.style.borderColor = 'var(--hairline)'
        document.body.appendChild(probeHairline)
        const expectedHairline = getComputedStyle(probeHairline).borderColor
        probeHairline.remove()

        return {
          numColor: num ? getComputedStyle(num).color : '',
          borderColor: getComputedStyle(el).borderTopColor,
          expectedBronze,
          expectedHairline
        }
      })
      expect(highlightStyles.numColor).toBe(highlightStyles.expectedBronze)
      expect(highlightStyles.borderColor).toBe(highlightStyles.expectedHairline)

      // Material list separators use hairline, icons use bronze-light, copy uses text-muted
      const matList = materials.locator('ul').nth(1)
      const matStyles = await matList.evaluate((el) => {
        const icon = el.querySelector('svg, span')
        const textLi = el.querySelector('li')
        const probeBronze = document.createElement('div')
        probeBronze.style.color = 'var(--bronze-light)'
        document.body.appendChild(probeBronze)
        const expectedBronze = getComputedStyle(probeBronze).color
        probeBronze.remove()

        const probeHairline = document.createElement('div')
        probeHairline.style.borderColor = 'var(--hairline)'
        document.body.appendChild(probeHairline)
        const expectedHairline = getComputedStyle(probeHairline).borderColor
        probeHairline.remove()

        const probeMuted = document.createElement('div')
        probeMuted.style.color = 'var(--text-muted)'
        document.body.appendChild(probeMuted)
        const expectedMuted = getComputedStyle(probeMuted).color
        probeMuted.remove()

        return {
          iconColor: icon ? getComputedStyle(icon).color : '',
          borderColor: getComputedStyle(el).borderTopColor,
          textColor: textLi ? getComputedStyle(textLi).color : '',
          expectedBronze,
          expectedHairline,
          expectedMuted
        }
      })
      expect(matStyles.iconColor).toBe(matStyles.expectedBronze)
      expect(matStyles.borderColor).toBe(matStyles.expectedHairline)
      expect(matStyles.textColor).toBe(matStyles.expectedMuted)

      // Craftsmanship block uses semantic hairline and text-muted
      const craftBlock = materials.locator('div.border-t').first()
      if (await craftBlock.count() > 0) {
        const craftStyles = await craftBlock.evaluate((el) => {
          const p = el.querySelector('p.measure-lead')
          const probeHairline = document.createElement('div')
          probeHairline.style.borderColor = 'var(--hairline)'
          document.body.appendChild(probeHairline)
          const expectedHairline = getComputedStyle(probeHairline).borderColor
          probeHairline.remove()

          const probeMuted = document.createElement('div')
          probeMuted.style.color = 'var(--text-muted)'
          document.body.appendChild(probeMuted)
          const expectedMuted = getComputedStyle(probeMuted).color
          probeMuted.remove()

          return {
            borderColor: getComputedStyle(el).borderTopColor,
            textColor: p ? getComputedStyle(p).color : '',
            expectedHairline,
            expectedMuted
          }
        })
        expect(craftStyles.borderColor).toBe(craftStyles.expectedHairline)
        expect(craftStyles.textColor).toBe(craftStyles.expectedMuted)
      }

      // Testimonial styling uses dark semantic tokens (when present)
      const quoteFigure = materials.locator('figure:has(blockquote)')
      if (await quoteFigure.count() > 0) {
        const quoteStyles = await quoteFigure.evaluate((el) => {
          const icon = el.querySelector('svg, span')
          const bq = el.querySelector('blockquote')
          const figcaption = el.querySelector('figcaption')

          const probeBronze = document.createElement('div')
          probeBronze.style.color = 'var(--bronze-light)'
          document.body.appendChild(probeBronze)
          const expectedBronze = getComputedStyle(probeBronze).color
          probeBronze.remove()

          const probeIvory = document.createElement('div')
          probeIvory.style.color = 'var(--color-ivory)'
          document.body.appendChild(probeIvory)
          const expectedIvory = getComputedStyle(probeIvory).color
          probeIvory.remove()

          const probeSubtle = document.createElement('div')
          probeSubtle.style.color = 'var(--text-subtle)'
          document.body.appendChild(probeSubtle)
          const expectedSubtle = getComputedStyle(probeSubtle).color
          probeSubtle.remove()

          const probeHairline = document.createElement('div')
          probeHairline.style.borderColor = 'var(--hairline)'
          document.body.appendChild(probeHairline)
          const expectedHairline = getComputedStyle(probeHairline).borderColor
          probeHairline.remove()

          return {
            iconColor: icon ? getComputedStyle(icon).color : '',
            bqColor: bq ? getComputedStyle(bq).color : '',
            captionColor: figcaption ? getComputedStyle(figcaption).color : '',
            borderColor: getComputedStyle(el).borderTopColor,
            expectedBronze,
            expectedIvory,
            expectedSubtle,
            expectedHairline
          }
        })
        expect(quoteStyles.iconColor).toBe(quoteStyles.expectedBronze)
        expect(quoteStyles.bqColor).toBe(quoteStyles.expectedIvory)
        expect(quoteStyles.captionColor).toBe(quoteStyles.expectedSubtle)
        expect(quoteStyles.borderColor).toBe(quoteStyles.expectedHairline)
      }

      // Real media images remain present
      expect(await materials.locator('img').count()).toBeGreaterThanOrEqual(1)

      // Explicitly assert absence of fabricated visual swatches
      expect(await materials.locator('[data-material-swatch]').count()).toBe(0)
      expect(await materials.locator('.swatch, [class*="swatch"]').count()).toBe(0)
    })
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Checkpoint P3-4: Related Work + Conversion Finale + Full Verification
// ─────────────────────────────────────────────────────────────────────────────

for (const locale of ['vi', 'en'] as const) {
  for (const viewport of PHASE3_VIEWPORTS) {
    test(`P3-4-RELATED-01 responsive surface and reflow ${locale} @ ${viewport.width}`, async ({ page }) => {
      await openProject(
        page,
        locale,
        '/du-an/khach-san-eo-gio',
        viewport.width,
        viewport.height
      )

      const related = page.locator('section[data-project-chapter="related"]')
      await expect(related).toBeVisible()

      // Light editorial surface (bg-ink-50: rgb(247, 247, 245) or bg-white: rgb(255, 255, 255))
      const bg = await related.evaluate(el => getComputedStyle(el).backgroundColor)
      expect(['rgb(247, 247, 245)', 'rgb(255, 255, 255)', 'rgba(255, 255, 255, 1)']).toContain(bg)

      // Responsive reflow geometry (1 col for mobile <768px, 3 col for desktop >=768px)
      const cols = await gridColumnCount(page, 'section[data-project-chapter="related"] div.grid')
      if (viewport.width < 768) {
        expect(cols).toBe(1)
      } else {
        expect(cols).toBe(3)
      }

      // Zero horizontal scroll overflow
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)
      ).toBe(true)
    })

    test(`P3-4-FINALE-01 surface and layout ${locale} @ ${viewport.width}`, async ({ page }) => {
      await openProject(
        page,
        locale,
        '/du-an/khach-san-eo-gio',
        viewport.width,
        viewport.height
      )

      const finale = page.locator('section[data-project-chapter="finale"]')
      await expect(finale).toBeVisible()

      // Dark Obsidian surface (var(--color-obsidian): rgb(11, 10, 9))
      const { actualBg, expectedObsidian } = await finale.evaluate((el) => {
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

  for (const width of [390, 1280] as const) {
    test(`P3-4-RELATED-02 visual contract and links ${locale} @ ${width}`, async ({ page }) => {
      await openProject(
        page,
        locale,
        '/du-an/khach-san-eo-gio',
        width,
        width === 390 ? 844 : 900
      )

      const related = page.locator('section[data-project-chapter="related"]')
      await expect(related).toBeVisible()

      // Card count > 0 and <= 3
      const cards = related.locator('a[href^="/du-an/"]')
      const count = await cards.count()
      expect(count).toBeGreaterThan(0)
      expect(count).toBeLessThanOrEqual(3)

      // All links point to /du-an/<slug> and no self-links
      for (let i = 0; i < count; i++) {
        const href = await cards.nth(i).getAttribute('href')
        expect(href).toMatch(/^\/du-an\/[a-z0-9-]+$/)
        expect(href).not.toBe('/du-an/khach-san-eo-gio')
      }

      // Card border uses --rule-light
      const { cardBorder, expectedRuleLight } = await related.evaluate((el) => {
        const borderEl = el.querySelector('a > div.border, a > div[class*="border-"]')
        const probe = document.createElement('div')
        probe.style.borderColor = 'var(--rule-light)'
        document.body.appendChild(probe)
        const expectedRuleLight = getComputedStyle(probe).borderColor
        probe.remove()
        return {
          cardBorder: borderEl ? getComputedStyle(borderEl).borderBottomColor : '',
          expectedRuleLight
        }
      })
      expect(cardBorder).toBe(expectedRuleLight)

      // Category uses --accent-light
      const { catColor, expectedAccent } = await related.evaluate((el) => {
        const catEl = el.querySelector('span.tracking-\\[0\\.16em\\]')
        const probe = document.createElement('div')
        probe.style.color = 'var(--accent-light)'
        document.body.appendChild(probe)
        const expectedAccent = getComputedStyle(probe).color
        probe.remove()
        return {
          catColor: catEl ? getComputedStyle(catEl).color : '',
          expectedAccent
        }
      })
      expect(catColor).toBe(expectedAccent)

      // Title uses --fg-light
      const { titleColor, expectedFg } = await related.evaluate((el) => {
        const h3 = el.querySelector('h3')
        const probe = document.createElement('div')
        probe.style.color = 'var(--fg-light)'
        document.body.appendChild(probe)
        const expectedFg = getComputedStyle(probe).color
        probe.remove()
        return {
          titleColor: h3 ? getComputedStyle(h3).color : '',
          expectedFg
        }
      })
      expect(titleColor).toBe(expectedFg)

      // Eyebrow uses --accent-light
      const { eyebrowColor, expectedAccentLight } = await related.evaluate((el) => {
        const eyebrow = el.querySelector('p.eyebrow, p.reveal')
        const probe = document.createElement('div')
        probe.style.color = 'var(--accent-light)'
        document.body.appendChild(probe)
        const expectedAccentLight = getComputedStyle(probe).color
        probe.remove()
        return {
          eyebrowColor: eyebrow ? getComputedStyle(eyebrow).color : '',
          expectedAccentLight
        }
      })
      expect(eyebrowColor).toBe(expectedAccentLight)

      // Heading H2 uses --fg-light
      const { h2Color, expectedFgLight } = await related.evaluate((el) => {
        const h2 = el.querySelector('h2')
        const probe = document.createElement('div')
        probe.style.color = 'var(--fg-light)'
        document.body.appendChild(probe)
        const expectedFgLight = getComputedStyle(probe).color
        probe.remove()
        return {
          h2Color: h2 ? getComputedStyle(h2).color : '',
          expectedFgLight
        }
      })
      expect(h2Color).toBe(expectedFgLight)

      // Real cover image remains present
      expect(await related.locator('img').count()).toBeGreaterThan(0)
    })

    test(`P3-4-RELATED-03 hover motion contract ${locale} @ ${width}`, async ({ page }) => {
      await openProject(
        page,
        locale,
        '/du-an/khach-san-eo-gio',
        width,
        width === 390 ? 844 : 900
      )

      const related = page.locator('section[data-project-chapter="related"]')
      await expect(related).toBeVisible()

      // Motion contract: scale-105 forbidden, scale-[1.02] required, motion-reduce preserved
      const imgClasses = await related.evaluate((el) => {
        const img = el.querySelector('img')
        return img ? img.className : ''
      })
      expect(imgClasses).not.toContain('group-hover:scale-105')
      expect(imgClasses).toContain('group-hover:scale-[1.02]')
      expect(imgClasses).toContain('motion-reduce:transform-none')
    })

    test(`P3-4-FINALE-02 visual contract and CTAs ${locale} @ ${width}`, async ({ page }) => {
      await openProject(
        page,
        locale,
        '/du-an/khach-san-eo-gio',
        width,
        width === 390 ? 844 : 900
      )

      const finale = page.locator('section[data-project-chapter="finale"]')
      await expect(finale).toBeVisible()

      // Heading resolves to ivory
      const { h2Color, expectedIvory } = await finale.evaluate((el) => {
        const h2 = el.querySelector('h2')
        const probe = document.createElement('div')
        probe.style.color = 'var(--color-ivory)'
        document.body.appendChild(probe)
        const expectedIvory = getComputedStyle(probe).color
        probe.remove()
        return {
          h2Color: h2 ? getComputedStyle(h2).color : '',
          expectedIvory
        }
      })
      expect(h2Color).toBe(expectedIvory)

      // Description resolves to text-muted
      const { pColor, expectedMuted } = await finale.evaluate((el) => {
        const p = el.querySelector('p')
        const probe = document.createElement('div')
        probe.style.color = 'var(--text-muted)'
        document.body.appendChild(probe)
        const expectedMuted = getComputedStyle(probe).color
        probe.remove()
        return {
          pColor: p ? getComputedStyle(p).color : '',
          expectedMuted
        }
      })
      expect(pColor).toBe(expectedMuted)

      // /lien-he CTA exists with primary bronze styling
      const contactCta = finale.locator('a[href="/lien-he"]')
      await expect(contactCta).toBeVisible()
      const ctaStyles = await contactCta.evaluate((el) => {
        const probeBronze = document.createElement('div')
        probeBronze.style.backgroundColor = 'var(--bronze)'
        document.body.appendChild(probeBronze)
        const expectedBg = getComputedStyle(probeBronze).backgroundColor
        probeBronze.remove()

        const probeObsidian = document.createElement('div')
        probeObsidian.style.color = 'var(--color-obsidian)'
        document.body.appendChild(probeObsidian)
        const expectedText = getComputedStyle(probeObsidian).color
        probeObsidian.remove()

        return {
          bg: getComputedStyle(el).backgroundColor,
          color: getComputedStyle(el).color,
          expectedBg,
          expectedText
        }
      })
      expect(ctaStyles.bg).toBe(ctaStyles.expectedBg)
      expect(ctaStyles.color).toBe(ctaStyles.expectedText)

      // Exactly one valid telephone CTA using tel:
      const phoneCtas = finale.locator('a[href^="tel:"]')
      expect(await phoneCtas.count()).toBe(1)
      const phoneCta = phoneCtas.first()
      await expect(phoneCta).toBeVisible()

      // Phone CTA border and color
      const phoneStyles = await phoneCta.evaluate((el) => {
        const probeGold = document.createElement('div')
        probeGold.style.borderColor = 'var(--hairline-gold)'
        document.body.appendChild(probeGold)
        const expectedBorder = getComputedStyle(probeGold).borderColor
        probeGold.remove()

        const probeBronzeLight = document.createElement('div')
        probeBronzeLight.style.color = 'var(--bronze-light)'
        document.body.appendChild(probeBronzeLight)
        const expectedColor = getComputedStyle(probeBronzeLight).color
        probeBronzeLight.remove()

        return {
          borderColor: getComputedStyle(el).borderColor,
          color: getComputedStyle(el).color,
          expectedBorder,
          expectedColor
        }
      })
      expect(phoneStyles.borderColor).toBe(phoneStyles.expectedBorder)
      expect(phoneStyles.color).toBe(phoneStyles.expectedColor)

      // Prohibited: no .pdf links, no download action, no BOQ/download lead magnet
      expect(await finale.locator('a[href$=".pdf"]').count()).toBe(0)
      expect(await finale.locator('a[download]').count()).toBe(0)
      expect(await finale.locator('text=/boq|download|tải về|tải xuống|brochure/i').count()).toBe(0)
    })

    test(`P3-4-FINALE-03 factory stats contract ${locale} @ ${width}`, async ({ page }) => {
      await openProject(
        page,
        locale,
        '/du-an/khach-san-eo-gio',
        width,
        width === 390 ? 844 : 900
      )

      const finale = page.locator('section[data-project-chapter="finale"]')
      await expect(finale).toBeVisible()

      // Stats rail has border-b border-[var(--hairline)]
      const statsUl = finale.locator('ul')
      const statsStyles = await statsUl.evaluate((el) => {
        const probe = document.createElement('div')
        probe.style.borderColor = 'var(--hairline)'
        document.body.appendChild(probe)
        const expectedBorder = getComputedStyle(probe).borderColor
        probe.remove()
        return {
          borderBottomColor: getComputedStyle(el).borderBottomColor,
          expectedBorder
        }
      })
      expect(statsStyles.borderBottomColor).toBe(statsStyles.expectedBorder)

      // Rendered stat count matches supplied factory stats (>=3)
      const statLis = statsUl.locator('li')
      const statCount = await statLis.count()
      expect(statCount).toBeGreaterThanOrEqual(3)

      // Stat icon uses bronze-light
      const { iconColor, expectedBronzeLight } = await statLis.first().evaluate((el) => {
        const icon = el.querySelector('svg, span')
        const probe = document.createElement('div')
        probe.style.color = 'var(--bronze-light)'
        document.body.appendChild(probe)
        const expectedBronzeLight = getComputedStyle(probe).color
        probe.remove()
        return {
          iconColor: icon ? getComputedStyle(icon).color : '',
          expectedBronzeLight
        }
      })
      expect(iconColor).toBe(expectedBronzeLight)

      // Stat value uses ivory
      const { valColor, expectedIvory } = await statLis.first().evaluate((el) => {
        const val = el.querySelector('span.text-xl')
        const probe = document.createElement('div')
        probe.style.color = 'var(--color-ivory)'
        document.body.appendChild(probe)
        const expectedIvory = getComputedStyle(probe).color
        probe.remove()
        return {
          valColor: val ? getComputedStyle(val).color : '',
          expectedIvory
        }
      })
      expect(valColor).toBe(expectedIvory)

      // Stat label uses text-subtle
      const { labelColor, expectedSubtle } = await statLis.first().evaluate((el) => {
        const label = el.querySelector('span.text-xs')
        const probe = document.createElement('div')
        probe.style.color = 'var(--text-subtle)'
        document.body.appendChild(probe)
        const expectedSubtle = getComputedStyle(probe).color
        probe.remove()
        return {
          labelColor: label ? getComputedStyle(label).color : '',
          expectedSubtle
        }
      })
      expect(labelColor).toBe(expectedSubtle)
    })
  }
}
