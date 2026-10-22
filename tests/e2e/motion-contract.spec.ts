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

/**
 * True once Nuxt has finished hydrating the server-rendered page. Assertions about client-added
 * state (`reveal-hidden`, `is-pending`) are meaningless before this: the SSR markup carries none
 * of it, so a check made earlier would pass for the wrong reason.
 */
async function waitForHydration(page: Page): Promise<void> {
  await page.waitForFunction(() => {
    const nuxt = (window as unknown as { useNuxtApp?: () => { isHydrating?: boolean } }).useNuxtApp
    return typeof nuxt === 'function' && nuxt().isHydrating === false
  })
}

/**
 * Holds every image request until `release()` is called, so a test decides when the photographs
 * arrive instead of racing a fixed delay against hydration.
 */
async function holdImages(page: Page): Promise<{ release: () => void }> {
  let release!: () => void
  const gate = new Promise<void>((resolve) => {
    release = resolve
  })
  await page.route('**/*', async (route) => {
    if (route.request().resourceType() === 'image') await gate
    await route.continue().catch(() => undefined)
  })
  return { release }
}

test.describe('motion contract', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(VIEWPORT_DESKTOP)
    await page.emulateMedia({ reducedMotion: 'no-preference' })
  })

  test('MOTION-01 reveal uses a keyframe and a custom-property delay', async ({ page }) => {
    await page.goto(url('/'), { waitUntil: 'load' })
    await waitForHydration(page)
    await expect(page.locator('html')).toHaveClass(/reveal-ready/)

    const results = await page.evaluate(async () => {
      const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
      const out: Array<{
        label: string
        hydratedInView: boolean
        isVisible: boolean
        inlineTransitionDelay: string
        animationName: string
        revealDelay: string
      }> = []

      for (const el of Array.from(document.querySelectorAll<HTMLElement>('main .reveal'))) {
        if (el.getClientRects().length === 0) continue
        // Painted by the server and in view at hydration: neither hidden nor animated.
        const hydratedInView = !el.classList.contains('reveal-hidden') && !el.classList.contains('is-visible')
        el.scrollIntoView({ block: 'center' })
        for (let i = 0; i < 60 && el.classList.contains('reveal-hidden'); i++) await wait(50)
        out.push({
          label: `${el.tagName.toLowerCase()}.${el.className.toString().split(/\s+/).slice(0, 3).join('.')}`,
          hydratedInView,
          isVisible: el.classList.contains('is-visible'),
          inlineTransitionDelay: el.style.transitionDelay,
          animationName: getComputedStyle(el).animationName,
          revealDelay: el.style.getPropertyValue('--reveal-delay').trim()
        })
      }
      return out
    })

    const animated = results.filter(r => !r.hydratedInView)
    expect(animated.length).toBeGreaterThan(5)
    expect(results.some(r => r.hydratedInView), 'the hero copy stays visible through hydration').toBe(true)

    for (const r of results) {
      expect(r.inlineTransitionDelay, `${r.label} must not use style.transitionDelay`).toBe('')
      if (r.hydratedInView) {
        expect(r.animationName, `${r.label} (in view at hydration) must not animate`).toBe('none')
        continue
      }
      expect(r.isVisible, `${r.label} never became visible`).toBe(true)
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
    await waitForHydration(page)
    const card = page.locator('.home-projects__card--hero').first()
    await card.scrollIntoViewIfNeeded()
    await expect(card).not.toHaveClass(/reveal-hidden/)

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

  test('MOTION-04 soft one-shot sheen on hover, press scale kept', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await page.setViewportSize(VIEWPORT_DESKTOP)
    await page.goto(url('/'), { waitUntil: 'load' })
    await waitForHydration(page)

    const button = page.locator('main .btn-bronze').first()
    const sheen = () => button.evaluate((btn) => {
      const style = getComputedStyle(btn, '::after')
      return {
        content: style.content,
        background: style.backgroundImage,
        transform: style.transform,
        duration: style.transitionDuration,
        animation: style.animationName
      }
    })

    // At rest: present, a soft gradient band (not a solid white bar), parked off the left edge,
    // with no transition, so leaving the button resets it instead of sweeping it back.
    const rest = await sheen()
    expect(rest.content).not.toMatch(/^(none|normal)$/)
    expect(rest.background).toContain('linear-gradient')
    expect(rest.duration).toBe('0s')
    expect(rest.animation).toBe('none')

    // On hover: one 800ms pass to a different position; never a looping animation.
    await button.hover()
    const hovered = await sheen()
    expect(hovered.duration).toBe('0.8s')
    expect(hovered.animation).toBe('none')
    // Computed transform reports the in-flight value, so wait for the band to travel.
    await expect.poll(async () => (await sheen()).transform, { timeout: 2000 }).not.toBe(rest.transform)

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

  test('MOTION-04b the button sheen is off under reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.setViewportSize(VIEWPORT_DESKTOP)
    await page.goto(url('/'), { waitUntil: 'load' })

    const button = page.locator('main .btn-bronze').first()
    await button.hover()
    const display = await button.evaluate(btn => getComputedStyle(btn, '::after').display)
    expect(display).toBe('none')
  })

  for (const path of ['/', '/gioi-thieu']) {
    test(`MOTION-05 late hero image fades and settles from the moment it appears (${path})`, async ({ page }) => {
      const images = await holdImages(page)

      await page.goto(url(path), { waitUntil: 'domcontentloaded' })
      const hero = page.locator('img.hero-image').first()
      // The plugin marks the image once hydration runs; the images are still held back.
      await expect(hero).toHaveClass(/is-pending/)

      const pending = await hero.evaluate((el) => {
        const style = getComputedStyle(el)
        return { opacity: style.opacity, animationName: style.animationName }
      })
      expect(pending.opacity).toBe('0')
      expect(pending.animationName).toBe('none')

      // Record, at the instant the class is removed, whether the settle animation has started
      // and where it is. Reading it "later" would only prove the animation exists.
      await hero.evaluate((el) => {
        const w = window as unknown as { __heroRelease?: { currentTime: number | null, count: number } }
        new MutationObserver((_records, observer) => {
          if (el.classList.contains('is-pending')) return
          const keyframed = el.getAnimations().filter(a => a instanceof CSSAnimation)
          w.__heroRelease = {
            count: keyframed.length,
            currentTime: keyframed[0] ? Number(keyframed[0].currentTime) : null
          }
          observer.disconnect()
        }).observe(el, { attributes: true, attributeFilter: ['class'] })
      })

      images.release()

      await expect(hero).not.toHaveClass(/is-pending/, { timeout: 10_000 })
      const settled = await hero.evaluate((el) => {
        const keyframed = el.getAnimations().filter(a => a instanceof CSSAnimation)
        return {
          transitionDuration: getComputedStyle(el).transitionDuration,
          count: keyframed.length,
          currentTime: keyframed[0] ? Number(keyframed[0].currentTime) : null,
          atRelease: (window as unknown as { __heroRelease?: { currentTime: number | null, count: number } }).__heroRelease
        }
      })
      expect(settled.transitionDuration.split(',').map(v => v.trim())).toContain('0.36s')
      expect(settled.count, 'the settle animation runs after the pending mark is removed').toBeGreaterThan(0)
      expect(settled.atRelease?.count, 'the settle animation exists the moment the class is removed').toBeGreaterThan(0)
      expect(settled.atRelease?.currentTime as number).toBeLessThan(100)
      expect(settled.currentTime as number).toBeLessThan(500)
    })
  }

  test('MOTION-05b a hero image that never arrives is released after 3s', async ({ page }) => {
    const images = await holdImages(page)

    try {
      await page.goto(url('/'), { waitUntil: 'domcontentloaded' })
      const hero = page.locator('img.hero-image').first()
      await expect(hero).toHaveClass(/is-pending/)

      // The request is held forever: only the timeout can release the mark.
      await expect(hero).not.toHaveClass(/is-pending/, { timeout: 3500 })
      await expect.poll(
        () => hero.evaluate(el => getComputedStyle(el).opacity),
        { timeout: 2000 }
      ).toBe('1')
    } finally {
      images.release()
    }
  })

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
    const images = await holdImages(page)
    await page.goto(url('/'), { waitUntil: 'domcontentloaded' })
    // The assertions below are about what the client did (or did not) add, so the app must have
    // booted first; the images are still held back, so a pending mark would be visible here.
    await waitForHydration(page)

    expect(await page.evaluate(() => document.documentElement.classList.contains('reveal-ready'))).toBe(false)

    const state = await page.evaluate(() => {
      const hero = document.querySelector<HTMLElement>('img.hero-image')
      if (!hero) throw new Error('no hero image')
      return {
        heroComplete: hero.complete,
        heroAnimation: getComputedStyle(hero).animationName,
        heroPending: hero.classList.contains('is-pending'),
        hiddenClass: document.querySelectorAll('.reveal-hidden').length,
        hidden: Array.from(document.querySelectorAll<HTMLElement>('main .reveal'))
          .filter(el => getComputedStyle(el).opacity !== '1').length
      }
    })
    images.release()
    expect(state.heroComplete, 'the image is still held back, so a pending mark could have appeared').toBe(false)
    expect(state.heroAnimation).toBe('none')
    expect(state.heroPending).toBe(false)
    expect(state.hiddenClass).toBe(0)
    expect(state.hidden).toBe(0)
  })

  test('MOTION-08 services rows reveal', async ({ page }) => {
    await page.goto(url('/dich-vu'), { waitUntil: 'load' })
    await waitForHydration(page)
    const rows = page.getByTestId('services-programme')
    const count = await rows.count()
    expect(count).toBeGreaterThan(0)

    for (let i = 0; i < count; i++) {
      const row = rows.nth(i)
      await expect(row).toHaveClass(/\breveal\b/)
      await row.scrollIntoViewIfNeeded()
      await expect(row).not.toHaveClass(/reveal-hidden/)
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

  test('MOTION-10 no blink on hydration', async ({ page }) => {
    // Sampler from the first frame: the server-rendered hero heading must never drop below
    // full opacity while the client boots, reveal-ready lands and the observers attach.
    await page.addInitScript(() => {
      const w = window as unknown as { __minHeroOpacity: number, __heroSamples: number }
      w.__minHeroOpacity = 1
      w.__heroSamples = 0
      const sample = () => {
        const h1 = document.querySelector('main h1')
        if (h1) {
          w.__heroSamples += 1
          w.__minHeroOpacity = Math.min(w.__minHeroOpacity, Number(getComputedStyle(h1).opacity))
        }
        requestAnimationFrame(sample)
      }
      requestAnimationFrame(sample)
    })

    await page.goto(url('/'), { waitUntil: 'load' })
    await waitForHydration(page)
    await page.waitForTimeout(1500)

    const { min, samples } = await page.evaluate(() => {
      const w = window as unknown as { __minHeroOpacity: number, __heroSamples: number }
      return { min: w.__minHeroOpacity, samples: w.__heroSamples }
    })
    expect(samples, 'the sampler saw the hero heading').toBeGreaterThan(10)
    expect(min).toBe(1)
  })
})

async function openDrawer(page: Page): Promise<void> {
  const open = page.getByRole('button', { name: /Mở menu|Open menu/ })
  await expect(async () => {
    await open.click()
    await expect(page.locator('.app-drawer')).toBeVisible({ timeout: 1000 })
  }).toPass()
}
