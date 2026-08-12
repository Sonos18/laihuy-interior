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

const TEST_ORIGIN = process.env.DENSITY_TEST_ORIGIN ?? 'http://localhost:3000'
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
