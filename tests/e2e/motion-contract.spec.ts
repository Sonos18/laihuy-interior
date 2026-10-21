import { expect, test, type Page } from '@playwright/test'
import { APP_ORIGIN } from './origin'

/**
 * Motion contract — DESIGN.md "## Motion" and the 2026-10-21 critique spec, Task 2.
 *
 * Motion is ON in this file, so it deliberately does NOT import `./fixtures` (that fixture forces
 * `prefers-reduced-motion: reduce` for the visual baselines). Every test states its own media
 * emulation before navigating.
 */

const TEST_ORIGIN = process.env.DENSITY_TEST_ORIGIN ?? APP_ORIGIN
const url = (path: string) => new URL(path, TEST_ORIGIN).toString()

const VIEWPORT_DESKTOP = { width: 1440, height: 900 }
const VIEWPORT_MOBILE = { width: 390, height: 844 }

/** Deep Timber (`--accent-light`, wood-600) — the Bronze Edge Rule border on light surfaces. */
const DEEP_TIMBER = 'rgb(124, 80, 50)'

test.describe('motion contract', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(VIEWPORT_DESKTOP)
    await page.emulateMedia({ reducedMotion: 'no-preference' })
  })

  test('MOTION-01 reveal uses a keyframe and a custom-property delay', async ({ page }) => {
    await page.goto(url('/'), { waitUntil: 'load' })
    await expect(page.locator('html')).toHaveClass(/reveal-ready/)

    const results = await page.evaluate(async () => {
      const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
      const out: Array<{
        label: string
        isVisible: boolean
        inlineTransitionDelay: string
        animationName: string
        revealDelay: string
      }> = []

      for (const el of Array.from(document.querySelectorAll<HTMLElement>('main .reveal'))) {
        if (el.getClientRects().length === 0) continue
        el.scrollIntoView({ block: 'center' })
        for (let i = 0; i < 60 && !el.classList.contains('is-visible'); i++) await wait(50)
        out.push({
          label: `${el.tagName.toLowerCase()}.${el.className.toString().split(/\s+/).slice(0, 3).join('.')}`,
          isVisible: el.classList.contains('is-visible'),
          inlineTransitionDelay: el.style.transitionDelay,
          animationName: getComputedStyle(el).animationName,
          revealDelay: el.style.getPropertyValue('--reveal-delay').trim()
        })
      }
      return out
    })

    expect(results.length).toBeGreaterThan(5)
    for (const r of results) {
      expect(r.isVisible, `${r.label} never became visible`).toBe(true)
      expect(r.inlineTransitionDelay, `${r.label} must not use style.transitionDelay`).toBe('')
      expect(r.animationName, `${r.label} animation`).toBe('reveal-rise')
      if (r.revealDelay !== '') {
        // The directive clamps every bound delay to 320ms.
        expect(Number.parseFloat(r.revealDelay), `${r.label} --reveal-delay`).toBeLessThanOrEqual(320)
        expect(r.revealDelay.endsWith('ms')).toBe(true)
      }
    }
  })

  test('MOTION-02 no hover lag after reveal', async ({ page }) => {
    await page.goto(url('/'), { waitUntil: 'load' })
    const card = page.locator('.home-projects__card--hero').first()
    await card.scrollIntoViewIfNeeded()
    await expect(card).toHaveClass(/is-visible/)

    await expect
      .poll(() => card.evaluate(el => el.getAnimations().every(a => a.playState === 'finished')))
      .toBe(true)

    const delays = await card.evaluate(el => getComputedStyle(el).transitionDelay)
    expect(delays.split(',').every(v => v.trim() === '0s'), `transition-delay: ${delays}`).toBe(true)
  })

  for (const path of ['/', '/du-an/khach-san-eo-gio']) {
    test(`MOTION-03 no infinite animations on ${path}`, async ({ page }) => {
      await page.goto(url(path), { waitUntil: 'load' })
      await page.evaluate(async () => {
        window.scrollTo(0, document.documentElement.scrollHeight)
        await new Promise(resolve => setTimeout(resolve, 400))
        window.scrollTo(0, 0)
        await new Promise(resolve => setTimeout(resolve, 400))
      })

      const infinite = await page.evaluate(() =>
        document
          .getAnimations()
          .filter(a => a.effect?.getTiming().iterations === Infinity)
          .map(a => (a instanceof CSSAnimation ? a.animationName : a.constructor.name))
      )
      expect(infinite, 'infinite animations still running').toEqual([])

      const pulses = await page.evaluate(() => document.querySelectorAll('.metric-pulse').length)
      expect(pulses, '.metric-pulse nodes').toBe(0)
    })
  }

  test('MOTION-04 no sheen, press scale kept', async ({ page }) => {
    await page.goto(url('/'), { waitUntil: 'load' })

    const afterContent = await page.evaluate(() => {
      const btn = document.querySelector('.btn-bronze')
      if (!btn) throw new Error('no .btn-bronze on /')
      return getComputedStyle(btn, '::after').content
    })
    expect(['none', 'normal']).toContain(afterContent)

    const pressRule = await page.evaluate(() => {
      const visit = (rules: CSSRuleList): string | null => {
        for (const rule of Array.from(rules)) {
          if (rule instanceof CSSStyleRule && rule.selectorText.includes('.btn-bronze:active')) {
            if (rule.cssText.includes('scale(0.97)')) return rule.cssText
          }
          const nested = (rule as CSSGroupingRule).cssRules
          if (nested) {
            const hit = visit(nested)
            if (hit) return hit
          }
        }
        return null
      }
      for (const sheet of Array.from(document.styleSheets)) {
        try {
          const hit = visit(sheet.cssRules)
          if (hit) return hit
        } catch {
          // cross-origin sheet
        }
      }
      return null
    })
    expect(pressRule, '.btn-bronze:active { transform: scale(0.97) }').not.toBeNull()
  })

  for (const path of ['/', '/gioi-thieu']) {
    test(`MOTION-05 late hero image fades and settles from the moment it appears (${path})`, async ({ page }) => {
      await page.route('**/*', async (route) => {
        if (route.request().resourceType() === 'image') {
          await new Promise(resolve => setTimeout(resolve, 1500))
        }
        await route.continue()
      })

      await page.goto(url(path), { waitUntil: 'domcontentloaded' })
      const hero = page.locator('img.hero-image').first()
      await expect(hero).toHaveClass(/is-pending/)

      const pending = await hero.evaluate((el) => {
        const style = getComputedStyle(el)
        return { opacity: style.opacity, animationName: style.animationName }
      })
      expect(pending.opacity).toBe('0')
      expect(pending.animationName).toBe('none')

      await expect(hero).not.toHaveClass(/is-pending/, { timeout: 10_000 })
      const settled = await hero.evaluate((el) => {
        const keyframed = el.getAnimations().filter(a => a instanceof CSSAnimation)
        return {
          transitionDuration: getComputedStyle(el).transitionDuration,
          count: keyframed.length,
          currentTime: keyframed[0] ? Number(keyframed[0].currentTime) : null
        }
      })
      expect(settled.transitionDuration.split(',').map(v => v.trim())).toContain('0.36s')
      expect(settled.count, 'the settle animation starts when the pending mark is removed').toBeGreaterThan(0)
      expect(settled.currentTime).not.toBeNull()
      expect(settled.currentTime as number).toBeLessThan(1600)
    })
  }

  test('MOTION-06 chrome timing', async ({ page }) => {
    await page.goto(url('/'), { waitUntil: 'load' })

    const timing = await page.evaluate(() => {
      const header = document.querySelector('.app-header')
      const link = document.querySelector('.nav-link')
      if (!header || !link) throw new Error('header or nav-link missing')
      return {
        header: getComputedStyle(header).transitionDuration,
        underline: getComputedStyle(link, '::after').transitionDuration
      }
    })
    expect(timing.header).toBe('0.28s')
    expect(timing.underline).toBe('0.24s')

    // Drawer: closing runs on 200ms, opening stays on its own (300ms) rule.
    await page.setViewportSize(VIEWPORT_MOBILE)
    await page.goto(url('/'), { waitUntil: 'load' })
    await openDrawer(page)

    const leave = await page.evaluate(async () => {
      const panel = document.querySelector<HTMLElement>('.app-drawer')
      const close = document.querySelector<HTMLElement>('.drawer-close')
      if (!panel || !close) throw new Error('drawer or close button missing')
      close.click()
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))
      return {
        leaving: panel.classList.contains('drawer-panel-leave-active'),
        duration: getComputedStyle(panel).transitionDuration
      }
    })
    expect(leave.leaving).toBe(true)
    expect(leave.duration).toBe('0.2s')
  })

  test('MOTION-07 reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.route('**/*', async (route) => {
      if (route.request().resourceType() === 'image') {
        await new Promise(resolve => setTimeout(resolve, 800))
      }
      await route.continue()
    })
    await page.goto(url('/'), { waitUntil: 'domcontentloaded' })
    await page.waitForSelector('img.hero-image', { state: 'attached' })

    expect(await page.evaluate(() => document.documentElement.classList.contains('reveal-ready'))).toBe(false)

    const state = await page.evaluate(() => {
      const hero = document.querySelector<HTMLElement>('img.hero-image')
      if (!hero) throw new Error('no hero image')
      return {
        heroAnimation: getComputedStyle(hero).animationName,
        heroPending: hero.classList.contains('is-pending'),
        hidden: Array.from(document.querySelectorAll<HTMLElement>('main .reveal'))
          .filter(el => getComputedStyle(el).opacity !== '1').length
      }
    })
    expect(state.heroAnimation).toBe('none')
    expect(state.heroPending).toBe(false)
    expect(state.hidden).toBe(0)
  })

  test('MOTION-08 services rows reveal', async ({ page }) => {
    await page.goto(url('/dich-vu'), { waitUntil: 'load' })
    const rows = page.getByTestId('services-programme')
    const count = await rows.count()
    expect(count).toBeGreaterThan(0)

    for (let i = 0; i < count; i++) {
      const row = rows.nth(i)
      await expect(row).toHaveClass(/\breveal\b/)
      await row.scrollIntoViewIfNeeded()
      await expect(row).toHaveClass(/is-visible/)
    }
    await expect
      .poll(() => rows.evaluateAll(els => els.every(el => getComputedStyle(el).opacity === '1')))
      .toBe(true)
  })

  test('MOTION-09 drawer CTA is bronze with the Deep Timber edge', async ({ page }) => {
    await page.setViewportSize(VIEWPORT_MOBILE)
    await page.goto(url('/'), { waitUntil: 'load' })
    await openDrawer(page)

    const cta = page.locator('.app-drawer a.btn-bronze')
    await expect(cta).toHaveCount(1)
    expect(await cta.evaluate(el => getComputedStyle(el).borderTopColor)).toBe(DEEP_TIMBER)
  })
})

async function openDrawer(page: Page): Promise<void> {
  const open = page.getByRole('button', { name: /Mở menu|Open menu/ })
  await expect(async () => {
    await open.click()
    await expect(page.locator('.app-drawer')).toBeVisible({ timeout: 1000 })
  }).toPass()
}
