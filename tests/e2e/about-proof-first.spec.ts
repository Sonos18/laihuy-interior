import type { Page } from '@playwright/test'
import {
  aboutPageContent,
  aboutProjectSlugs,
  aboutProofStatIds
} from '../../app/data/about'
import { categoryDefinitions } from '../../app/data/categories'
import { factoryStats, productionWorkflow } from '../../app/data/factory'
import { projects } from '../../app/data/projects'
import { expect, test } from './fixtures'
import { APP_ORIGIN } from './origin'

const TEST_ORIGIN = process.env.DENSITY_TEST_ORIGIN ?? APP_ORIGIN
const TRANSPARENT_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M/wHwAF/gL+X9j7WQAAAABJRU5ErkJggg==',
  'base64'
)
const locales = ['vi', 'en'] as const
const chapterOrder = [
  'promise',
  'problem',
  'workflow',
  'factory',
  'projects',
  'fit',
  'contact'
] as const

async function openAbout(page: Page, locale: typeof locales[number], width = 1440) {
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
  await page.setViewportSize({ width, height: 900 })
  await page.goto(new URL('/gioi-thieu', TEST_ORIGIN).toString(), { waitUntil: 'load' })
  await page.evaluate(() => document.fonts.ready)
}

const columnCount = (page: Page, testId: string) =>
  page.getByTestId(testId).evaluate(element =>
    getComputedStyle(element).gridTemplateColumns.trim().split(/\s+/).filter(Boolean).length
  )

for (const locale of locales) {
  test(`about renders the approved proof-first chapters in ${locale}`, async ({ page }) => {
    await openAbout(page, locale)

    const chapters = page.locator('main [data-about-chapter]')
    await expect(chapters).toHaveCount(7)
    expect(await chapters.evaluateAll(elements =>
      elements.map(element => element.getAttribute('data-about-chapter'))
    )).toEqual(chapterOrder)

    const hero = page.locator('[data-about-chapter="promise"]')
    await expect(hero.locator('h1')).toContainText(aboutPageContent.hero.title[locale])
    await expect(hero.locator('h1')).toContainText(aboutPageContent.hero.specialTitle[locale])
    await expect(hero.getByText(aboutPageContent.hero.subtitle[locale], { exact: true }))
      .toHaveCount(1)

    await expect(page.getByRole('heading', {
      name: aboutPageContent.problem.title[locale],
      exact: true
    })).toHaveCount(1)
    await expect(page.getByRole('heading', {
      name: aboutPageContent.workflow.title[locale],
      exact: true
    })).toHaveCount(1)
    await expect(page.getByRole('heading', {
      name: aboutPageContent.factory.title[locale],
      exact: true
    })).toHaveCount(1)
    await expect(page.getByRole('heading', {
      name: aboutPageContent.projects.title[locale],
      exact: true
    })).toHaveCount(1)
    await expect(page.getByRole('heading', {
      name: aboutPageContent.fit.title[locale],
      exact: true
    })).toHaveCount(1)
    await expect(page.getByRole('heading', {
      name: aboutPageContent.contact.title[locale],
      exact: true
    })).toHaveCount(1)
  })

  test(`about uses canonical proof, workflow and project data in ${locale}`, async ({ page }) => {
    await openAbout(page, locale)

    const selectedStats = aboutProofStatIds.map(id =>
      factoryStats.find(stat => stat.id === id)!
    )
    const stats = page.getByTestId('about-proof-stat')
    await expect(stats).toHaveCount(3)
    for (const [index, stat] of selectedStats.entries()) {
      await expect(stats.nth(index).locator('dt')).toHaveText(stat.label[locale])
      await expect(stats.nth(index).locator('dd')).toHaveText(stat.value[locale])
    }

    const workflow = page.getByTestId('about-workflow-step')
    await expect(workflow).toHaveCount(6)
    for (const [index, step] of productionWorkflow.entries()) {
      await expect(workflow.nth(index).getByRole('heading')).toHaveText(step.title[locale])
      await expect(workflow.nth(index).locator('p')).toHaveText(step.description[locale])
    }

    const features = page.getByTestId('about-project-feature')
    await expect(features).toHaveCount(2)
    for (const [index, slug] of aboutProjectSlugs.entries()) {
      const project = projects.find(item => item.slug === slug)!
      const feature = features.nth(index)
      await expect(feature).toHaveAttribute('href', `/du-an/${slug}`)
      await expect(feature.getByRole('heading')).toHaveText(project.name[locale])
      await expect(feature.getByText([
        categoryDefinitions[project.category].label[locale],
        ...(project.scope?.[locale] ?? [])
      ].join(' · '), { exact: true })).toHaveCount(1)
      if (project.area) await expect(feature).toContainText(project.area[locale])
      if (project.location) await expect(feature).toContainText(project.location[locale])
      if (project.year) await expect(feature).toContainText(project.year[locale])
    }
  })
}

for (const locale of locales) {
  for (const width of [390, 767, 768, 1279, 1280, 1440] as const) {
    test(`about responsive contract in ${locale} at ${width}`, async ({ page }) => {
      await openAbout(page, locale, width)

      const overflow = await page.evaluate(() =>
        Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth
      )
      expect(overflow).toBeLessThanOrEqual(1)

      expect(await columnCount(page, 'about-proof-grid')).toBe(width >= 768 ? 3 : 1)
      expect(await columnCount(page, 'about-workflow-layout')).toBe(width >= 1280 ? 2 : 1)
      expect(await columnCount(page, 'about-workflow-grid')).toBe(width >= 768 ? 2 : 1)
      expect(await columnCount(page, 'about-factory-grid')).toBe(width >= 768 ? 2 : 1)
      expect(await columnCount(page, 'about-project-grid')).toBe(width >= 1280 ? 2 : 1)
    })
  }
}

test('about preserves SEO, focus, reduced motion and the seven-chapter structure', async ({ page }) => {
  await openAbout(page, 'vi', 390)

  await expect(page.locator('html')).toHaveAttribute('lang', 'vi')
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /\/gioi-thieu$/)
  expect(await page.evaluate(() =>
    matchMedia('(prefers-reduced-motion: reduce)').matches
  )).toBe(true)

  const revealStates = await page.locator('main .reveal').evaluateAll(elements =>
    elements.map((element) => {
      const style = getComputedStyle(element)
      return {
        opacity: style.opacity,
        transform: style.transform,
        visibility: style.visibility
      }
    })
  )
  expect(revealStates.length).toBeGreaterThan(0)
  for (const state of revealStates) {
    expect(state).toEqual({
      opacity: '1',
      transform: 'none',
      visibility: 'visible'
    })
  }

  const aboutJsonLd = await page.locator('script[type="application/ld+json"]').evaluateAll(scripts =>
    scripts.flatMap((script) => {
      try {
        const value = JSON.parse(script.textContent ?? 'null')
        return Array.isArray(value) ? value : [value]
      } catch {
        return []
      }
    }).find(entry => entry?.['@type'] === 'AboutPage')
  )
  expect(aboutJsonLd).toBeTruthy()

  await expect(page.locator('#production-workflow')).toHaveCount(1)
  await expect(page.locator('main [role="dialog"]')).toHaveCount(0)
  await expect(page.locator('main [data-about-optional]')).toHaveCount(0)

  const aboutPageRoot = page.locator('main > div')
  await expect(aboutPageRoot).toHaveCount(1)
  const directChildren = aboutPageRoot.locator(':scope > *')
  const chapters = aboutPageRoot.locator(':scope > [data-about-chapter]')
  await expect(directChildren).toHaveCount(7)
  await expect(chapters).toHaveCount(7)
  expect(await chapters.evaluateAll(elements =>
    elements.map(element => element.getAttribute('data-about-chapter'))
  )).toEqual(chapterOrder)

  const firstProject = page.getByTestId('about-project-feature').first()
  await firstProject.focus()
  await expect(firstProject).toBeFocused()
  const firstProjectImage = firstProject.locator('img')
  expect(await firstProjectImage.evaluate(element => getComputedStyle(element).transform))
    .toBe('none')
  await firstProject.hover()
  expect(await firstProjectImage.evaluate(element => getComputedStyle(element).transform))
    .toBe('none')

  const contact = page.locator('[data-about-chapter="contact"]')
  await expect(contact.getByRole('link', {
    name: aboutPageContent.contact.primaryCta.vi,
    exact: true
  })).toHaveAttribute('href', '/lien-he')
  await expect(contact.getByRole('link', {
    name: new RegExp(aboutPageContent.contact.phoneCta.vi)
  })).toHaveAttribute('href', 'tel:+84903102012')
  await expect(contact).not.toContainText(/đã gửi|đã nhận|gửi thành công/i)
})

// ─────────────────────────────────────────────────────────────────────────────
// AB-WARM: /gioi-thieu sits on the warm-light canvas below the hero (DESIGN.md, Warm Light Rule).
// Obsidian lives behind the hero photograph and in the footer only.
// ─────────────────────────────────────────────────────────────────────────────

const WARM_WIDTHS = [768, 1440] as const

for (const locale of locales) {
  for (const width of WARM_WIDTHS) {
    const tag = `${locale} @ ${width}`

    test(`AB-WARM-01 no dark band ${tag}`, async ({ page }) => {
      await openAbout(page, locale, width)

      // Composite translucent layers up the tree until an opaque one, so a tinted surface is
      // judged by what the reader sees.
      const surfaces = await page.evaluate(() => {
        const parse = (value: string): number[] | null => {
          const match = value.match(/^(?:rgba?|color)\(([^)]+)\)$/)
          if (!match) return null
          const parts = match[1]!.replace('srgb', '').split(/[,/\s]+/).filter(Boolean).map(Number)
          const scale = value.startsWith('color(') ? 255 : 1
          return [parts[0]! * scale, parts[1]! * scale, parts[2]! * scale, parts[3] ?? 1]
        }
        const background = (el: Element): number[] => {
          const layers: number[][] = []
          let current: Element | null = el
          while (current) {
            const layer = parse(getComputedStyle(current).backgroundColor)
            if (layer && layer[3]! > 0) {
              layers.push(layer)
              if (layer[3] === 1) break
            }
            current = current.parentElement
          }
          let result = [255, 255, 255]
          for (const [r, g, b, a] of layers.reverse()) {
            result = [r! * a! + result[0]! * (1 - a!), g! * a! + result[1]! * (1 - a!), b! * a! + result[2]! * (1 - a!)]
          }
          return result
        }
        const channel = (c: number) => {
          const v = c / 255
          return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
        }
        const luminanceOf = (el: Element) => {
          const [r, g, b] = background(el)
          return 0.2126 * channel(r!) + 0.7152 * channel(g!) + 0.0722 * channel(b!)
        }
        return {
          chapters: [...document.querySelectorAll('main [data-about-chapter]:not([data-about-chapter="promise"])')]
            .map(el => ({ name: el.getAttribute('data-about-chapter'), luminance: luminanceOf(el) })),
          // The promise chapter holds the dark hero; the proof strip under it is part of the canvas.
          proofStrip: luminanceOf(document.querySelector('[data-testid="about-proof-grid"]')!)
        }
      })

      expect(surfaces.chapters.map(surface => surface.name)).toEqual(chapterOrder.slice(1))
      for (const surface of surfaces.chapters) {
        // Sawdust, the darkest allowed band, measures about 0.78.
        expect(surface.luminance, `${surface.name} background is a dark band`).toBeGreaterThanOrEqual(0.7)
      }
      expect(surfaces.proofStrip, 'proof strip background is a dark band').toBeGreaterThanOrEqual(0.7)
    })

    test(`AB-WARM-02 headings and type ${tag}`, async ({ page }) => {
      await openAbout(page, locale, width)

      const result = await page.evaluate(() => {
        const outside = (el: Element) => !el.closest('.app-hero')
        const typeOf = (el: Element) => {
          const style = getComputedStyle(el)
          return {
            text: (el.textContent ?? '').trim().slice(0, 40),
            weight: style.fontWeight,
            transform: style.textTransform,
            family: style.fontFamily
          }
        }
        const headings = [...document.querySelectorAll('main h2')].filter(outside).map(typeOf)
        const cardHeadings = [...document.querySelectorAll('main h3')].filter(outside).map(typeOf)
        const heavy = [...document.querySelectorAll('main *')]
          .filter(outside)
          .filter(el => getComputedStyle(el).fontWeight === '900')
          .map(el => `${el.tagName.toLowerCase()}: ${(el.textContent ?? '').trim().slice(0, 30)}`)
        const markers = [...document.querySelectorAll('[data-testid="about-workflow-step"] > span')]
          .map(el => parseFloat(getComputedStyle(el).fontSize))
        const smallest = [...document.querySelectorAll('main p, main li, main h2, main h3, main a, main span, main dt, main dd')]
          .filter(outside)
          .filter(el => (el.textContent ?? '').trim() !== '' && el.children.length === 0)
          .map(el => parseFloat(getComputedStyle(el).fontSize))
        return { headings, cardHeadings, heavy, markers, smallest }
      })

      // problem, workflow, factory, projects, fit and contact
      expect(result.headings).toHaveLength(6)
      expect(result.cardHeadings.length).toBeGreaterThan(0)
      for (const heading of [...result.headings, ...result.cardHeadings]) {
        expect(heading.weight, heading.text).toBe('500')
        expect(heading.transform, heading.text).toBe('none')
        expect(heading.family, heading.text).toContain('Outfit')
      }
      expect(result.heavy).toEqual([])
      // The six workflow stages are a real order, so they keep Label-sized markers.
      expect(result.markers).toHaveLength(6)
      for (const size of result.markers) {
        expect(size).toBeLessThanOrEqual(14)
      }
      for (const size of result.smallest) {
        expect(size).toBeGreaterThanOrEqual(12)
      }
    })

    test(`AB-WARM-03 radii ${tag}`, async ({ page }) => {
      await openAbout(page, locale, width)

      const offenders = await page.evaluate(() => {
        const corners = [
          'borderTopLeftRadius',
          'borderTopRightRadius',
          'borderBottomRightRadius',
          'borderBottomLeftRadius'
        ] as const
        const found: string[] = []
        for (const el of document.querySelectorAll('main *')) {
          if (el.closest('.app-hero')) continue
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

    test(`AB-WARM-04 actions ${tag}`, async ({ page }) => {
      await openAbout(page, locale, width)

      const primary = page.locator('[data-about-chapter="contact"] a[href="/lien-he"]')
      await expect(primary).toHaveCount(1)
      await expect(primary).toHaveClass(/\bbtn-bronze\b/)
      // Bronze Edge Rule: on a light surface the bronze fill carries the Deep Timber border.
      await expect(primary).toHaveCSS('border-top-color', 'rgb(124, 80, 50)')
      await expect(page.locator('[data-about-chapter="contact"] a[href^="tel:"]'))
        .toHaveClass(/\bbtn-outline\b/)
      await expect(page.locator('[data-about-chapter="factory"] a[href="/nha-xuong"]'))
        .toHaveClass(/\bbtn-outline\b/)
    })
  }
}
