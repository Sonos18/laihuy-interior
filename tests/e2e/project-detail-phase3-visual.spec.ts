import type { Page } from '@playwright/test'
import { expect, test } from './fixtures'
import { APP_ORIGIN } from './origin'

const TEST_ORIGIN = process.env.PROJECT_DETAIL_TEST_ORIGIN ?? APP_ORIGIN

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

  test(`P3-1-HERO-02 warm facts rail ${locale}`, async ({ page }) => {
    await openProject(
      page,
      locale,
      '/du-an/khach-san-eo-gio',
      1280,
      900
    )

    // The facts zone sits on Raw Silk (var(--color-ivory)) and the rail itself on Paper White:
    // warm light below the hero photograph, never an obsidian band.
    const { zoneBg, expectedRawSilk, stripColor, actualRailBg } = await page.evaluate(() => {
      const rail = document.querySelector('[data-project-facts]')
      const zone = rail?.closest('[data-project-facts-zone]') ?? null

      const probe = document.createElement('div')
      probe.style.backgroundColor = 'var(--color-ivory)'
      document.body.appendChild(probe)
      const expectedRawSilk = getComputedStyle(probe).backgroundColor
      probe.remove()

      // Sample the seam directly between AppHero and the facts rail (8px above the rail)
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
        expectedRawSilk,
        stripColor,
        actualRailBg: rail ? getComputedStyle(rail).backgroundColor : ''
      }
    })

    expect(zoneBg).toBe(expectedRawSilk)
    expect(stripColor).toBe(expectedRawSilk)
    expect(actualRailBg).toBe('rgb(255, 255, 255)')

    // Specs rail: shell-bounded, Plaster Line hairline, 4px edge, flat at rest
    const railMetrics = await page.evaluate(() => {
      const rail = document.querySelector('[data-project-facts]')
      if (!rail) return null
      const rect = rail.getBoundingClientRect()
      const style = getComputedStyle(rail)

      return {
        width: rect.width,
        windowWidth: window.innerWidth,
        borderColor: style.borderTopColor,
        borderRadius: parseFloat(style.borderTopLeftRadius) || 0,
        boxShadow: style.boxShadow
      }
    })

    expect(railMetrics).not.toBeNull()
    expect(railMetrics!.width).toBeLessThan(railMetrics!.windowWidth)
    // Plaster Line #d8d2ca
    expect(railMetrics!.borderColor).toBe('rgb(216, 210, 202)')
    expect(railMetrics!.borderRadius).toBe(4)
    expect(railMetrics!.boxShadow).toBe('none')

    // Fact dividers resolve to the light-surface hairline (--rule-light)
    const { actualBorder, expectedBorder } = await page.evaluate(() => {
      const factEl = document.querySelector('[data-project-fact]')
      const actualBorder = factEl ? getComputedStyle(factEl).borderBottomColor : ''
      const probe = document.createElement('div')
      probe.style.borderBottomColor = 'var(--rule-light)'
      document.body.appendChild(probe)
      const expectedBorder = getComputedStyle(probe).borderBottomColor
      probe.remove()
      return { actualBorder, expectedBorder }
    })
    expect(actualBorder).toBe(expectedBorder)

    // Fact values are Charcoal Ink Title-role type, never weight 900
    const value = await page.locator('[data-project-fact] dd').first().evaluate((el) => {
      const style = getComputedStyle(el)
      return { color: style.color, weight: style.fontWeight, family: style.fontFamily }
    })
    expect(value.color).toBe('rgb(24, 22, 20)')
    expect(value.weight).toBe('500')
    expect(value.family).toContain('Outfit')

    // Category treatment on the dark hero stays bronze/kicker-like
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

  test(`P3-1-SUBNAV-01 light glass contract ${locale}`, async ({ page }) => {
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

    // Light glass: white at 92% (--surface-chrome), the same fill as the scrolled header
    const { actualNavBg, expectedNavBg } = await page.evaluate(() => {
      const nav = document.querySelector('nav[data-project-subnav]')
      const actualNavBg = nav ? getComputedStyle(nav).backgroundColor : ''
      const probe = document.createElement('div')
      probe.style.backgroundColor = 'var(--surface-chrome)'
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

    // Plaster hairline bottom divider (--rule-light)
    const { actualBorderBottom, expectedBorderBottom } = await page.evaluate(() => {
      const nav = document.querySelector('nav[data-project-subnav]')
      const actualBorderBottom = nav ? getComputedStyle(nav).borderBottomColor : ''
      const probe = document.createElement('div')
      probe.style.borderBottomColor = 'var(--rule-light)'
      document.body.appendChild(probe)
      const expectedBorderBottom = getComputedStyle(probe).borderBottomColor
      probe.remove()
      return { actualBorderBottom, expectedBorderBottom }
    })
    expect(actualBorderBottom).toBe(expectedBorderBottom)

    // Chips use the Action type (600) in both states; the colors are pinned by PD-WARM-06
    const weights = await page.evaluate(() => {
      const read = (el: Element | null) => (el ? getComputedStyle(el).fontWeight : '')
      return {
        active: read(document.querySelector('nav[data-project-subnav] a[aria-current="location"]')),
        inactive: read(document.querySelector('nav[data-project-subnav] a:not([aria-current="location"])'))
      }
    })
    expect(weights.active).toBe('600')
    expect(weights.inactive).toBe('600')
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

      // Section surface resolves to Linen (bg-wood-50: rgb(250, 246, 240))
      const storyBg = await story.evaluate(el => getComputedStyle(el).backgroundColor)
      expect(storyBg).toBe('rgb(250, 246, 240)')

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

    test(`P3-2-GALLERY-01 raw silk rhythm ${locale} @ ${viewport.width}`, async ({ page }) => {
      await openProject(
        page,
        locale,
        '/du-an/khach-san-eo-gio',
        viewport.width,
        viewport.height
      )

      const gallery = page.locator('section#gallery')
      await expect(gallery).toBeVisible()

      // Section surface resolves to Raw Silk (var(--color-ivory): rgb(245, 242, 235))
      const { actualBg, expectedRawSilk } = await gallery.evaluate((el) => {
        const probe = document.createElement('div')
        probe.style.backgroundColor = 'var(--color-ivory)'
        document.body.appendChild(probe)
        const expectedRawSilk = getComputedStyle(probe).backgroundColor
        probe.remove()
        return {
          actualBg: getComputedStyle(el).backgroundColor,
          expectedRawSilk
        }
      })
      expect(actualBg).toBe(expectedRawSilk)

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

    // Challenge beat is set apart by type and a full Plaster hairline above it, never a side tab
    const challengeStyle = await story.locator('[data-story-beat="challenge"]').evaluate((el) => {
      const style = getComputedStyle(el)
      return {
        borderLeftWidth: style.borderLeftWidth,
        borderTopWidth: style.borderTopWidth,
        borderTopColor: style.borderTopColor,
        statementWeight: getComputedStyle(el.querySelector('p:nth-of-type(2)')!).fontWeight
      }
    })
    expect(challengeStyle.borderLeftWidth).toBe('0px')
    expect(challengeStyle.borderTopWidth).toBe('1px')
    expect(challengeStyle.borderTopColor).toBe('rgb(216, 210, 202)')
    expect(challengeStyle.statementWeight).toBe('500')

    // No quote pullquote or blockquote in story
    expect(await story.locator('blockquote').count()).toBe(0)
    expect(await story.locator('[data-story-quote]').count()).toBe(0)
  })

  test(`P3-2-GALLERY-02 warm light chrome ${locale}`, async ({ page }) => {
    await openProject(
      page,
      locale,
      '/du-an/khach-san-eo-gio',
      1280,
      900
    )

    const gallery = page.locator('section#gallery')
    await expect(gallery).toBeVisible()

    const resolveToken = (token: string, property: 'color' | 'borderColor' | 'backgroundColor') =>
      page.evaluate(([tokenName, prop]) => {
        const probe = document.createElement('div')
        probe.style.setProperty(prop === 'color' ? 'color' : prop === 'borderColor' ? 'border-color' : 'background-color', `var(${tokenName})`)
        document.body.appendChild(probe)
        const value = getComputedStyle(probe)[prop as 'color']
        probe.remove()
        return value
      }, [token, property] as const)

    // Eyebrow resolves to the light-surface accent (Deep Timber)
    const eyebrow = await gallery.locator('p.eyebrow').evaluate(el => getComputedStyle(el).color)
    expect(eyebrow).toBe(await resolveToken('--accent-light', 'color'))

    // Heading resolves to Charcoal Ink
    const heading = await gallery.locator('h2').evaluate(el => getComputedStyle(el).color)
    expect(heading).toBe(await resolveToken('--fg-light', 'color'))

    // Filter tabs: active is Charcoal Ink with Linen text; idle is a Plaster border with Walnut Grey text
    const filterTabs = gallery.locator('[data-gallery-filters] button[aria-pressed]')
    if (await filterTabs.count() > 0) {
      const active = await gallery.locator('[data-gallery-filters] button[aria-pressed="true"]').evaluate((el) => {
        const style = getComputedStyle(el)
        return { bg: style.backgroundColor, color: style.color }
      })
      expect(active.bg).toBe('rgb(24, 22, 20)')
      expect(active.color).toBe('rgb(250, 246, 240)')

      const inactiveTab = gallery.locator('[data-gallery-filters] button[aria-pressed="false"]').first()
      if (await inactiveTab.count() > 0) {
        const inactive = await inactiveTab.evaluate((el) => {
          const style = getComputedStyle(el)
          return { border: style.borderTopColor, color: style.color }
        })
        expect(inactive.border).toBe('rgb(216, 210, 202)')
        expect(inactive.color).toBe('rgb(93, 83, 73)')
      }
    }

    // Long-media disclosure is the light outline secondary action: a pill in Charcoal Ink
    const disclosureBtn = gallery.locator('[data-project-full-gallery] button')
    if (await disclosureBtn.count() > 0) {
      const btn = await disclosureBtn.evaluate((el) => {
        const style = getComputedStyle(el)
        return { color: style.color, radius: parseFloat(style.borderTopLeftRadius) }
      })
      expect(btn.color).toBe('rgb(24, 22, 20)')
      expect(btn.radius).toBeGreaterThanOrEqual(9000)
    }

    // AppGalleryCarousel track is visible
    const carousel = gallery.locator('[data-gallery-carousel]')
    await expect(carousel).toBeVisible()

    // Carousel counter is light-tone (ink-700) at weight 600, not 900
    const counter = carousel.locator('p[aria-live="polite"]')
    await expect(counter).toBeVisible()
    const counterStyle = await counter.evaluate((el) => {
      const style = getComputedStyle(el)
      return { color: style.color, weight: style.fontWeight }
    })
    expect(counterStyle.color).toBe(await resolveToken('--color-ink-700', 'color'))
    expect(counterStyle.weight).toBe('600')

    // Carousel controls stay visible, pill-shaped and keyboard-focusable with a visible ring
    const prevBtn = carousel.getByRole('button', { name: /trước|previous/i })
    await expect(prevBtn).toBeVisible()
    const nextBtn = carousel.getByRole('button', { name: /tiếp theo|next/i })
    await expect(nextBtn).toBeVisible()
    await prevBtn.focus()
    const ring = await prevBtn.evaluate((el) => {
      const style = getComputedStyle(el)
      return { width: parseFloat(style.outlineWidth), style: style.outlineStyle }
    })
    expect(ring.style).not.toBe('none')
    expect(ring.width).toBeGreaterThanOrEqual(2)
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
    const filterTabs = page.locator('[data-gallery-filters] button[aria-pressed]')
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

      // Linen surface (bg-wood-50: rgb(250, 246, 240))
      const deliveryBg = await delivery.evaluate(el => getComputedStyle(el).backgroundColor)
      expect(deliveryBg).toBe('rgb(250, 246, 240)')

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

      // Raw Silk surface (var(--color-ivory): rgb(245, 242, 235))
      const { actualBg, expectedRawSilk } = await materials.evaluate((el) => {
        const probeSurface = document.createElement('div')
        probeSurface.style.backgroundColor = 'var(--color-ivory)'
        document.body.appendChild(probeSurface)
        const expectedRawSilk = getComputedStyle(probeSurface).backgroundColor
        probeSurface.remove()

        return {
          actualBg: getComputedStyle(el).backgroundColor,
          expectedRawSilk
        }
      })
      expect(actualBg).toBe(expectedRawSilk)

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
        expect(combinedScope).toContain('Fit-out')
      }

      // Rich fixture has exactly 3 execution proofs
      expect(await richDelivery.locator('[data-execution-proof]').count()).toBe(3)

      // No-production fixture: /du-an/nha-ta-dung (design + fit-out). Every other project now
      // covers all three scopes, so this is the one whose scope has no factory in it.
      await openProject(
        page,
        locale,
        '/du-an/nha-ta-dung',
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

      // Without a production scope only the on-site team proof remains
      expect(await designDelivery.locator('[data-execution-proof]').count()).toBe(1)

      // No manufacturing proof, no factory claims
      expect(await designDelivery.locator('[data-execution-proof="direct-factory"]').count()).toBe(0)
      expect(await designDelivery.locator('[data-execution-proof="craft"]').count()).toBe(1)
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

      // Eyebrow resolves to the light-surface accent
      const { actualEyebrow, expectedBronzeLight } = await materials.evaluate((el) => {
        const eyebrow = el.querySelector('p.eyebrow, p.reveal')
        const probe = document.createElement('div')
        probe.style.color = 'var(--accent-light)'
        document.body.appendChild(probe)
        const expectedBronzeLight = getComputedStyle(probe).color
        probe.remove()
        return {
          actualEyebrow: eyebrow ? getComputedStyle(eyebrow).color : '',
          expectedBronzeLight
        }
      })
      expect(actualEyebrow).toBe(expectedBronzeLight)

      // Title resolves to Charcoal Ink
      const { actualTitle, expectedIvory } = await materials.evaluate((el) => {
        const h2 = el.querySelector('h2')
        const probe = document.createElement('div')
        probe.style.color = 'var(--fg-light)'
        document.body.appendChild(probe)
        const expectedIvory = getComputedStyle(probe).color
        probe.remove()
        return {
          actualTitle: h2 ? getComputedStyle(h2).color : '',
          expectedIvory
        }
      })
      expect(actualTitle).toBe(expectedIvory)

      // Experience copy uses Walnut Grey (var(--fg-light-muted))
      const { actualExp, expectedMuted } = await materials.evaluate((el) => {
        const p = el.querySelector('[data-material-layout] > p')
        const probe = document.createElement('div')
        probe.style.color = 'var(--fg-light-muted)'
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
        probeBronze.style.color = 'var(--accent-light)'
        document.body.appendChild(probeBronze)
        const expectedBronze = getComputedStyle(probeBronze).color
        probeBronze.remove()

        const probeHairline = document.createElement('div')
        probeHairline.style.borderColor = 'var(--rule-light)'
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
        probeBronze.style.color = 'var(--accent-light)'
        document.body.appendChild(probeBronze)
        const expectedBronze = getComputedStyle(probeBronze).color
        probeBronze.remove()

        const probeHairline = document.createElement('div')
        probeHairline.style.borderColor = 'var(--rule-light)'
        document.body.appendChild(probeHairline)
        const expectedHairline = getComputedStyle(probeHairline).borderColor
        probeHairline.remove()

        const probeMuted = document.createElement('div')
        probeMuted.style.color = 'var(--fg-light-muted)'
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
          probeHairline.style.borderColor = 'var(--rule-light)'
          document.body.appendChild(probeHairline)
          const expectedHairline = getComputedStyle(probeHairline).borderColor
          probeHairline.remove()

          const probeMuted = document.createElement('div')
          probeMuted.style.color = 'var(--fg-light-muted)'
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

      // Testimonial styling uses light semantic tokens (when present)
      const quoteFigure = materials.locator('figure:has(blockquote)')
      if (await quoteFigure.count() > 0) {
        const quoteStyles = await quoteFigure.evaluate((el) => {
          const icon = el.querySelector('svg, span')
          const bq = el.querySelector('blockquote')
          const figcaption = el.querySelector('figcaption')

          const probeBronze = document.createElement('div')
          probeBronze.style.color = 'var(--accent-light)'
          document.body.appendChild(probeBronze)
          const expectedBronze = getComputedStyle(probeBronze).color
          probeBronze.remove()

          const probeIvory = document.createElement('div')
          probeIvory.style.color = 'var(--fg-light)'
          document.body.appendChild(probeIvory)
          const expectedIvory = getComputedStyle(probeIvory).color
          probeIvory.remove()

          const probeSubtle = document.createElement('div')
          probeSubtle.style.color = 'var(--fg-light-muted)'
          document.body.appendChild(probeSubtle)
          const expectedSubtle = getComputedStyle(probeSubtle).color
          probeSubtle.remove()

          const probeHairline = document.createElement('div')
          probeHairline.style.borderColor = 'var(--rule-light)'
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

      // Linen surface (bg-wood-50: rgb(250, 246, 240))
      const bg = await related.evaluate(el => getComputedStyle(el).backgroundColor)
      expect(bg).toBe('rgb(250, 246, 240)')

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

      // Raw Silk surface (var(--color-ivory): rgb(245, 242, 235))
      const { actualBg, expectedRawSilk } = await finale.evaluate((el) => {
        const probe = document.createElement('div')
        probe.style.backgroundColor = 'var(--color-ivory)'
        document.body.appendChild(probe)
        const expectedRawSilk = getComputedStyle(probe).backgroundColor
        probe.remove()
        return {
          actualBg: getComputedStyle(el).backgroundColor,
          expectedRawSilk
        }
      })
      expect(actualBg).toBe(expectedRawSilk)

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

      // Card is a 4px Paper White frame with a Plaster Line border
      const card = await related.evaluate((el) => {
        const link = el.querySelector('a[href^="/du-an/"]')
        const style = link ? getComputedStyle(link) : null
        return {
          border: style?.borderBottomColor ?? '',
          radius: style ? parseFloat(style.borderTopLeftRadius) : -1,
          bg: style?.backgroundColor ?? ''
        }
      })
      expect(card.border).toBe('rgb(216, 210, 202)')
      expect(card.radius).toBe(4)
      expect(card.bg).toBe('rgb(255, 255, 255)')

      // Category uses --accent-light
      const { catColor, expectedAccent } = await related.evaluate((el) => {
        const catEl = el.querySelector('span.home-eyebrow-text')
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

      // Heading resolves to Charcoal Ink
      const { h2Color, expectedInk } = await finale.evaluate((el) => {
        const h2 = el.querySelector('h2')
        const probe = document.createElement('div')
        probe.style.color = 'var(--fg-light)'
        document.body.appendChild(probe)
        const expectedInk = getComputedStyle(probe).color
        probe.remove()
        return {
          h2Color: h2 ? getComputedStyle(h2).color : '',
          expectedInk
        }
      })
      expect(h2Color).toBe(expectedInk)

      // Description resolves to Walnut Grey
      const { pColor, expectedWalnut } = await finale.evaluate((el) => {
        const p = el.querySelector('p')
        const probe = document.createElement('div')
        probe.style.color = 'var(--fg-light-muted)'
        document.body.appendChild(probe)
        const expectedWalnut = getComputedStyle(probe).color
        probe.remove()
        return {
          pColor: p ? getComputedStyle(p).color : '',
          expectedWalnut
        }
      })
      expect(pColor).toBe(expectedWalnut)

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

      // Phone CTA is the light outline secondary action: Charcoal Ink text on a pill
      const phoneStyles = await phoneCta.evaluate((el) => {
        const style = getComputedStyle(el)
        return { color: style.color, radius: parseFloat(style.borderTopLeftRadius) }
      })
      expect(phoneStyles.color).toBe('rgb(24, 22, 20)')
      expect(phoneStyles.radius).toBeGreaterThanOrEqual(9000)

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

      // The finale opens on the shared Facts Band (DESIGN.md "Facts Band"): Linen with a
      // Plaster hairline under it, no icons, values in Charcoal Ink, labels in Walnut Grey.
      const band = finale.locator('[data-facts-band]')
      await expect(band).toHaveCount(1)
      const bandStyles = await band.evaluate((el) => {
        const probe = document.createElement('div')
        probe.style.borderColor = 'var(--rule-light)'
        probe.style.color = 'var(--fg-light)'
        probe.style.backgroundColor = 'var(--color-wood-50)'
        document.body.appendChild(probe)
        const expected = getComputedStyle(probe)
        const result = {
          expectedBorder: expected.borderTopColor,
          expectedInk: expected.color,
          expectedLinen: expected.backgroundColor
        }
        probe.remove()
        const walnutProbe = document.createElement('div')
        walnutProbe.style.color = 'var(--fg-light-muted)'
        document.body.appendChild(walnutProbe)
        const expectedWalnut = getComputedStyle(walnutProbe).color
        walnutProbe.remove()
        return {
          ...result,
          expectedWalnut,
          borderBottomColor: getComputedStyle(el).borderBottomColor,
          background: getComputedStyle(el).backgroundColor,
          icons: el.querySelectorAll('svg, .iconify, [class*="i-lucide"]').length,
          valueColor: getComputedStyle(el.querySelector('dd')!).color,
          labelColor: getComputedStyle(el.querySelector('dt')!).color
        }
      })
      expect(bandStyles.borderBottomColor).toBe(bandStyles.expectedBorder)
      expect(bandStyles.background).toBe(bandStyles.expectedLinen)
      expect(bandStyles.icons).toBe(0)
      expect(bandStyles.valueColor).toBe(bandStyles.expectedInk)
      expect(bandStyles.labelColor).toBe(bandStyles.expectedWalnut)

      // Rendered fact count matches the supplied factory facts (>=3)
      expect(await band.locator('[data-testid="project-fact"]').count()).toBeGreaterThanOrEqual(3)
    })
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// PD-WARM: the case study sits on the warm-light canvas (DESIGN.md, Warm Light Rule).
// Obsidian lives behind the hero photograph and in the footer only.
// ─────────────────────────────────────────────────────────────────────────────

const WARM_SLUGS = ['khach-san-eo-gio', 'nha-xuong-anh-cuong'] as const
const WARM_WIDTHS = [768, 1440] as const

const LINEN = 'rgb(250, 246, 240)'
const CHARCOAL_INK = 'rgb(24, 22, 20)'
const WALNUT_GREY = 'rgb(93, 83, 73)'

/**
 * In-page colour helpers, installed once per page. `resolveBackground` walks up the tree and
 * composites translucent layers (the light-glass sub-nav is white at 92%) until an opaque one
 * is found; Chrome may report `color-mix()` fills as `color(srgb …)`, so both forms are parsed.
 */
type Rgb = [number, number, number]
type WarmHelpers = {
  resolveBackground: (el: Element) => Rgb
  luminance: (rgb: Rgb) => number
  contrast: (a: Rgb, b: Rgb) => number
  parse: (value: string) => Rgb | null
}

async function installWarmHelpers(page: Page) {
  await page.evaluate(() => {
    const parse = (value: string): [number, number, number, number] | null => {
      const rgb = value.match(/^rgba?\(([^)]+)\)$/)
      if (rgb) {
        const p = rgb[1]!.split(/[,/\s]+/).filter(Boolean).map(Number)
        return [p[0]!, p[1]!, p[2]!, p[3] ?? 1]
      }
      const srgb = value.match(/^color\(srgb ([^)]+)\)$/)
      if (srgb) {
        const p = srgb[1]!.split(/[\s/]+/).filter(Boolean).map(Number)
        return [p[0]! * 255, p[1]! * 255, p[2]! * 255, p[3] ?? 1]
      }
      return null
    }
    const resolveBackground = (el: Element): Rgb => {
      const layers: [number, number, number, number][] = []
      let current: Element | null = el
      while (current) {
        const layer = parse(getComputedStyle(current).backgroundColor)
        if (layer && layer[3] > 0) {
          layers.push(layer)
          if (layer[3] === 1) break
        }
        current = current.parentElement
      }
      let result: Rgb = [255, 255, 255]
      for (const [r, g, b, a] of layers.reverse()) {
        result = [r * a + result[0] * (1 - a), g * a + result[1] * (1 - a), b * a + result[2] * (1 - a)]
      }
      return result
    }
    const channel = (c: number) => {
      const v = c / 255
      return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
    }
    const luminance = ([r, g, b]: Rgb) =>
      0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)
    const contrast = (a: Rgb, b: Rgb) => {
      const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number]
      return (hi + 0.05) / (lo + 0.05)
    }
    ;(window as unknown as { __warm: WarmHelpers }).__warm = {
      resolveBackground,
      luminance,
      contrast,
      parse: (value: string) => {
        const p = parse(value)
        return p ? [p[0], p[1], p[2]] : null
      }
    }
  })
}

for (const locale of ['vi', 'en'] as const) {
  for (const slug of WARM_SLUGS) {
    for (const width of WARM_WIDTHS) {
      const tag = `${slug} ${locale} @ ${width}`

      test(`PD-WARM-01 no dark band ${tag}`, async ({ page }) => {
        await openProject(page, locale, `/du-an/${slug}`, width, 900)
        await installWarmHelpers(page)

        const surfaces = await page.evaluate(() => {
          const warm = (window as unknown as { __warm: WarmHelpers }).__warm
          const targets = [
            ...document.querySelectorAll('main [data-project-chapter]:not([data-project-chapter="hero"])'),
            ...document.querySelectorAll('[data-project-facts-zone]'),
            ...document.querySelectorAll('nav[data-project-subnav]')
          ]
          return targets.map(el => ({
            name: el.getAttribute('data-project-chapter') ?? (el.hasAttribute('data-project-facts-zone') ? 'facts-zone' : 'subnav'),
            luminance: warm.luminance(warm.resolveBackground(el))
          }))
        })

        // facts zone, subnav, then story, gallery, delivery, materials, related and finale
        expect(surfaces.length).toBe(8)
        for (const surface of surfaces) {
          expect(surface.luminance, `${surface.name} background is a dark band`).toBeGreaterThanOrEqual(0.8)
        }
      })

      test(`PD-WARM-02 headings ${tag}`, async ({ page }) => {
        await openProject(page, locale, `/du-an/${slug}`, width, 900)

        const result = await page.evaluate(() => {
          const outside = (el: Element) => !el.closest('.app-hero') && !el.closest('[role="dialog"]')
          const headings = [...document.querySelectorAll('main h2')].filter(outside).map((el) => {
            const style = getComputedStyle(el)
            return {
              text: (el.textContent ?? '').trim().slice(0, 40),
              weight: style.fontWeight,
              transform: style.textTransform,
              family: style.fontFamily
            }
          })
          const heavy = [...document.querySelectorAll('main *')]
            .filter(outside)
            .filter(el => getComputedStyle(el).fontWeight === '900')
            .map(el => `${el.tagName.toLowerCase()}: ${(el.textContent ?? '').trim().slice(0, 30)}`)
          return { headings, heavy }
        })

        expect(result.headings.length).toBeGreaterThanOrEqual(4)
        for (const heading of result.headings) {
          expect(heading.weight, heading.text).toBe('500')
          expect(heading.transform, heading.text).toBe('none')
          expect(heading.family, heading.text).toContain('Outfit')
        }
        expect(result.heavy).toEqual([])
      })

      test(`PD-WARM-03 radii ${tag}`, async ({ page }) => {
        await openProject(page, locale, `/du-an/${slug}`, width, 900)

        const offenders = await page.evaluate(() => {
          const corners = [
            'borderTopLeftRadius',
            'borderTopRightRadius',
            'borderBottomRightRadius',
            'borderBottomLeftRadius'
          ] as const
          const found: string[] = []
          for (const el of document.querySelectorAll('main *')) {
            if (el.closest('.app-hero') || el.closest('[role="dialog"]')) continue
            const style = getComputedStyle(el)
            for (const corner of corners) {
              const raw = style[corner]
              const value = parseFloat(raw)
              const pill = raw.endsWith('%') ? value >= 50 : value >= 9000
              if (!pill && value > 4) {
                found.push(`${el.tagName.toLowerCase()}.${String(el.className).slice(0, 60)} ${corner}=${raw}`)
              }
            }
          }
          return found
        })

        expect(offenders).toEqual([])
      })

      test(`PD-WARM-04 facts ${tag}`, async ({ page }) => {
        await openProject(page, locale, `/du-an/${slug}`, width, 900)
        await installWarmHelpers(page)

        const labels = await page.evaluate(() => {
          const warm = (window as unknown as { __warm: WarmHelpers }).__warm
          return [...document.querySelectorAll('[data-project-facts] dt')].map((el) => {
            const style = getComputedStyle(el)
            const color = warm.parse(style.color)
            return {
              text: (el.textContent ?? '').trim(),
              size: parseFloat(style.fontSize),
              contrast: color ? warm.contrast(color, warm.resolveBackground(el)) : 0
            }
          })
        })

        expect(labels.length).toBeGreaterThan(0)
        for (const label of labels) {
          expect(label.size, label.text).toBeGreaterThanOrEqual(12)
          expect(label.contrast, label.text).toBeGreaterThanOrEqual(4.5)
        }
      })

      test(`PD-WARM-05 no side-tab ${tag}`, async ({ page }) => {
        await openProject(page, locale, `/du-an/${slug}`, width, 900)

        const beat = page.locator('[data-story-beat="challenge"]')
        await expect(beat).toHaveCount(1)
        const style = await beat.evaluate((el) => {
          const computed = getComputedStyle(el)
          return {
            borderLeftWidth: computed.borderLeftWidth,
            radius: parseFloat(computed.borderTopLeftRadius) || 0
          }
        })
        expect(style.borderLeftWidth).toBe('0px')
        expect(style.radius).toBeLessThanOrEqual(4)
      })

      test(`PD-WARM-06 chips ${tag}`, async ({ page }) => {
        await openProject(page, locale, `/du-an/${slug}`, width, 900)

        const chips = await page.evaluate(() => {
          const read = (el: Element) => {
            const style = getComputedStyle(el)
            return { background: style.backgroundColor, color: style.color }
          }
          const nav = document.querySelector('nav[data-project-subnav]')!
          return {
            active: read(nav.querySelector('a[aria-current="location"]')!),
            idle: [...nav.querySelectorAll('a:not([aria-current="location"])')].map(read)
          }
        })

        expect(chips.active.background).toBe(CHARCOAL_INK)
        expect(chips.active.color).toBe(LINEN)
        expect(chips.idle.length).toBeGreaterThan(0)
        for (const chip of chips.idle) {
          expect(chip.color).toBe(WALNUT_GREY)
        }
      })
    }
  }
}
