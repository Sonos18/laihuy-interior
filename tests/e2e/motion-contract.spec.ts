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

/** A 1x1 PNG for every image request: the page paints at once and nothing waits on the network. */
async function stubImages(page: Page): Promise<void> {
  const png = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M/wHwAF/gL+X9j7WQAAAABJRU5ErkJggg==',
    'base64'
  )
  await page.route('**/*', async (route) => {
    if (route.request().resourceType() === 'image') {
      await route.fulfill({ status: 200, contentType: 'image/png', body: png })
      return
    }
    await route.continue()
  })
}

test.describe('motion contract', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(VIEWPORT_DESKTOP)
    await page.emulateMedia({ reducedMotion: 'no-preference' })
  })

  test('MOTION-01 reveal uses a keyframe and a custom-property delay', async ({ page }) => {
    await page.goto(url('/'), { waitUntil: 'load' })
    await waitForHydration(page)
    // The material story switches to its tall sticky layout one frame after hydration; scrolling
    // before that measures a layout that is about to move.
    await expect(page.getByTestId('home-material-story')).toHaveAttribute('data-enhanced', 'true')
    await expect(page.locator('html')).toHaveClass(/reveal-ready/)

    const results = await page.evaluate(async () => {
      const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
      const out: Array<{
        label: string
        hydratedInView: boolean
        isVisible: boolean
        isImage: boolean
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
          isImage: el.classList.contains('reveal-image'),
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
      // Photographs fade, everything else rises (DESIGN.md "Motion", scroll reveal roles).
      expect(r.animationName, `${r.label} animation`).toBe(r.isImage ? 'reveal-fade' : 'reveal-rise')
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

  for (const path of ['/', '/gioi-thieu', '/du-an', '/du-an/khach-san-eo-gio', '/nha-xuong', '/dich-vu', '/tuyen-dung', '/lien-he']) {
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
        mediaPending: document.querySelectorAll('img.media-img.is-pending').length,
        hiddenClass: document.querySelectorAll('.reveal-hidden').length,
        hidden: Array.from(document.querySelectorAll<HTMLElement>('main .reveal'))
          .filter(el => getComputedStyle(el).opacity !== '1').length
      }
    })
    images.release()
    expect(state.heroComplete, 'the image is still held back, so a pending mark could have appeared').toBe(false)
    expect(state.heroAnimation).toBe('none')
    expect(state.heroPending).toBe(false)
    expect(state.mediaPending, 'no MediaImage is hidden waiting for its bytes under reduced motion').toBe(0)
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

  test('MOTION-11 a section head reveals as one unit', async ({ page }) => {
    await page.goto(url('/dich-vu'), { waitUntil: 'load' })
    await waitForHydration(page)

    // A head that is still hidden after hydration (the first one is painted by the server and
    // never animates), with at least the eyebrow, the headline and the lead.
    const marked = await page.evaluate(() => {
      for (const el of Array.from(document.querySelectorAll<HTMLElement>('[data-reveal-head].reveal-hidden'))) {
        const group = Array.from(el.parentElement!.children).filter(c => c.hasAttribute('data-reveal-head'))
        if (group.length >= 3 && group.every(c => c.classList.contains('reveal-hidden'))) {
          group.forEach((c, i) => c.setAttribute('data-test-head', String(i)))
          return group.length
        }
      }
      return 0
    })
    expect(marked, 'a hidden section head with eyebrow, headline and lead').toBeGreaterThanOrEqual(3)

    const head = page.locator('[data-test-head]')
    // Only the first member is scrolled to; the others must come with it.
    await head.first().scrollIntoViewIfNeeded()
    await expect(head.first()).not.toHaveClass(/reveal-hidden/)
    await expect.poll(() => head.evaluateAll(els => els.every(el => el.classList.contains('is-visible')))).toBe(true)

    const members = await head.evaluateAll(els => els.map((el) => {
      const animation = el.getAnimations().find((a): a is CSSAnimation => a instanceof CSSAnimation)
      return {
        name: animation?.animationName,
        delay: getComputedStyle(el).animationDelay,
        revealDelay: (el as HTMLElement).style.getPropertyValue('--reveal-delay'),
        start: animation ? Number(animation.startTime) : null
      }
    }))
    for (const member of members) {
      expect(member.name).toBe('reveal-rise')
      expect(member.delay, 'a head member carries no delay').toBe('0s')
      expect(member.revealDelay).toBe('')
    }
    expect(new Set(members.map(m => m.start)).size, 'every member starts in the same frame').toBe(1)
  })

  test('MOTION-12 only the first row of a grid staggers', async ({ page }) => {
    await page.goto(url('/gioi-thieu'), { waitUntil: 'load' })
    await waitForHydration(page)

    // Scroll the whole page so every item is revealed, then read the delay each one got.
    const groups = await page.evaluate(async () => {
      for (let y = 0; y < document.documentElement.scrollHeight; y += 300) {
        window.scrollTo(0, y)
        await new Promise(resolve => setTimeout(resolve, 80))
      }
      const byParent = new Map<Element, HTMLElement[]>()
      for (const el of Array.from(document.querySelectorAll<HTMLElement>('[data-reveal-item]'))) {
        const list = byParent.get(el.parentElement!) ?? []
        list.push(el)
        byParent.set(el.parentElement!, list)
      }
      return Array.from(byParent.values()).map((items) => {
        const top = items.reduce((best, el) => (el.offsetTop < best.offsetTop ? el : best), items[0]!)
        const bandEnd = top.offsetTop + top.offsetHeight
        return items.map(el => ({
          firstRow: el.offsetTop < bandEnd,
          delay: Number.parseFloat(getComputedStyle(el).animationDelay) * 1000,
          visible: el.classList.contains('is-visible')
        }))
      })
    })

    expect(groups.some(items => items.some(i => !i.firstRow)), 'a grid with more than one row was measured').toBe(true)
    for (const items of groups) {
      let rank = 0
      for (const item of items) {
        if (!item.visible) continue
        if (item.firstRow) {
          expect(item.delay, 'first-row stagger').toBe(Math.min(rank * 70, 320))
          rank += 1
        } else {
          expect(item.delay, 'a later row has no animation-delay').toBe(0)
        }
      }
    }
  })

  test('MOTION-13 an image reveal is opacity only and never slides', async ({ page }) => {
    await page.goto(url('/dich-vu'), { waitUntil: 'load' })
    await waitForHydration(page)

    // Pinned with an attribute: a locator on `.reveal-hidden` would re-resolve to a different
    // element once the first one has been revealed.
    await page.evaluate(() => document.querySelector('.reveal-image.reveal-hidden')?.setAttribute('data-test-image', ''))
    const target = page.locator('[data-test-image]')
    await expect(target).toHaveCount(1)
    await target.scrollIntoViewIfNeeded()
    await expect(target).toHaveClass(/is-visible/)

    const probe = await target.evaluate(async (el) => {
      const animation = el.getAnimations().find((a): a is CSSAnimation => a instanceof CSSAnimation)
      const keyframes = animation ? (animation.effect as KeyframeEffect).getKeyframes() : []
      const samples: string[] = []
      for (let i = 0; i < 12; i++) {
        samples.push(getComputedStyle(el).transform)
        await new Promise(resolve => requestAnimationFrame(resolve))
      }
      return {
        name: animation?.animationName,
        properties: Array.from(new Set(keyframes.flatMap(k => Object.keys(k))))
          .filter(k => !['offset', 'computedOffset', 'easing', 'composite'].includes(k)),
        transforms: Array.from(new Set(samples))
      }
    })
    expect(probe.name).toBe('reveal-fade')
    expect(probe.properties).toEqual(['opacity'])
    expect(probe.transforms, 'no translate at any frame').toEqual(['none'])
  })

  test('MOTION-14 a photograph that arrives late fades in over 400ms', async ({ page }) => {
    const images = await holdImages(page)
    await page.goto(url('/nha-xuong'), { waitUntil: 'domcontentloaded' })
    await waitForHydration(page)

    const pending = page.locator('img.media-img.is-pending')
    await expect.poll(() => pending.count()).toBeGreaterThan(0)
    expect(await pending.first().evaluate(el => getComputedStyle(el).opacity)).toBe('0')

    images.release()
    const arriving = page.locator('img.media-img.is-arriving').first()
    await expect(arriving).toBeAttached({ timeout: 10_000 })
    // The keyframe may already have finished on a fast machine: its declared shape is what counts.
    const declared = await arriving.evaluate(el => ({
      name: getComputedStyle(el).animationName,
      duration: getComputedStyle(el).animationDuration,
      easing: getComputedStyle(el).animationTimingFunction
    }))
    expect(declared).toEqual({ name: 'media-arrive', duration: '0.4s', easing: 'cubic-bezier(0.22, 0.61, 0.36, 1)' })

    // The placeholder is released on the same duration and curve.
    const skeleton = await page.locator('.media-skeleton').first().evaluate(el => ({
      duration: getComputedStyle(el).transitionDuration,
      easing: getComputedStyle(el).transitionTimingFunction
    }))
    expect(skeleton).toEqual({ duration: '0.4s', easing: 'cubic-bezier(0.22, 0.61, 0.36, 1)' })
  })

  test('MOTION-14b an image that is already painted at hydration is never hidden', async ({ page }) => {
    // Hold the app's scripts so the server-rendered page paints and its images load without any
    // client code, then let hydration run and sample every frame from there.
    let releaseScripts!: () => void
    const scriptGate = new Promise<void>((resolve) => {
      releaseScripts = resolve
    })
    await page.route('**/_nuxt/**', async (route) => {
      if (route.request().resourceType() === 'script') await scriptGate
      await route.continue().catch(() => undefined)
    })

    // Deferred module scripts hold DOMContentLoaded back, so wait for the markup, not the event.
    await page.goto(url('/nha-xuong'), { waitUntil: 'commit' })
    await page.waitForSelector('main#main img', { state: 'attached' })
    // Scroll through the page so every lazy image is requested, with no JavaScript involved.
    const painted = await page.evaluate(async () => {
      for (let y = 0; y < document.documentElement.scrollHeight; y += 400) {
        window.scrollTo(0, y)
        await new Promise(resolve => setTimeout(resolve, 120))
      }
      const framed = () => Array.from(document.querySelectorAll<HTMLImageElement>('img.media-img'))
      for (let i = 0; i < 60; i++) {
        const imgs = framed()
        if (imgs.length > 0 && imgs.every(img => img.complete && img.naturalWidth > 0)) break
        await new Promise(resolve => setTimeout(resolve, 100))
      }
      const imgs = framed().filter(img => img.complete && img.naturalWidth > 0)
      imgs.forEach(img => img.setAttribute('data-was-painted', ''))
      window.scrollTo(0, 0)

      const w = window as unknown as { __minOpacity: number }
      w.__minOpacity = 1
      const sample = () => {
        for (const img of Array.from(document.querySelectorAll('img[data-was-painted]'))) {
          w.__minOpacity = Math.min(w.__minOpacity, Number(getComputedStyle(img).opacity))
        }
        requestAnimationFrame(sample)
      }
      requestAnimationFrame(sample)
      return imgs.length
    })
    expect(painted, 'the server painted some photographs').toBeGreaterThan(0)

    releaseScripts()
    await waitForHydration(page)
    await page.waitForTimeout(800)

    const state = await page.evaluate(() => ({
      min: (window as unknown as { __minOpacity: number }).__minOpacity,
      marked: document.querySelectorAll('img[data-was-painted].is-pending, img[data-was-painted].is-arriving').length
    }))
    expect(state.marked, 'a painted image is not given the arrival classes').toBe(0)
    expect(state.min, 'a painted image never drops below full opacity').toBe(1)
  })

  test('MOTION-15 a route change is a 120ms + 200ms opacity crossfade, no translate', async ({ page }) => {
    await page.goto(url('/'), { waitUntil: 'load' })
    await waitForHydration(page)

    type PageEvent = { type: string, property: string, duration: string, t: number }
    await page.evaluate(() => {
      const w = window as unknown as { __page: PageEvent[] }
      w.__page = []
      const record = (event: Event) => {
        const target = event.target as Element | null
        if (!target || target.parentElement?.id !== 'main') return
        w.__page.push({
          type: event.type,
          property: (event as TransitionEvent).propertyName,
          duration: getComputedStyle(target).transitionDuration,
          t: performance.now()
        })
      }
      for (const type of ['transitionrun', 'transitionend']) document.addEventListener(type, record, true)
    })
    await page.locator('header.app-header a[href="/dich-vu"]').first().click()
    await page.waitForURL(url('/dich-vu'))
    // Vue ends the leaving page on its own timer and removes it, so its transitionend may never
    // be dispatched; the entering page's is the end of the whole crossfade.
    await expect.poll(() => page.evaluate(() =>
      (window as unknown as { __page: PageEvent[] }).__page.filter(e => e.type === 'transitionend').length
    )).toBeGreaterThanOrEqual(1)

    const events = await page.evaluate(() => (window as unknown as { __page: PageEvent[] }).__page)
    const runs = events.filter(e => e.type === 'transitionrun')
    expect(runs.map(e => e.property), 'opacity only: nothing translates').toEqual(['opacity', 'opacity'])
    expect(runs.map(e => e.duration)).toEqual(['0.12s', '0.2s'])
    const total = events.at(-1)!.t - runs[0]!.t
    // 120 + 200 = 320ms of motion; the allowance covers the frame Vue waits before each phase.
    expect(total, `crossfade took ${Math.round(total)}ms`).toBeLessThan(420)
  })

  test('MOTION-15b reduced motion changes route without a transition', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto(url('/'), { waitUntil: 'load' })
    await waitForHydration(page)

    await page.evaluate(() => {
      const w = window as unknown as { __page: string[] }
      w.__page = []
      document.addEventListener('transitionrun', (event) => {
        if ((event.target as Element).parentElement?.id === 'main') w.__page.push((event as TransitionEvent).propertyName)
      }, true)
    })
    await page.locator('header.app-header a[href="/dich-vu"]').first().click()
    await page.waitForURL(url('/dich-vu'))
    await page.waitForTimeout(600)

    expect(await page.evaluate(() => (window as unknown as { __page: string[] }).__page)).toEqual([])
    await expect(page.locator('main#main > *')).toHaveCount(1)
  })

  test('MOTION-15c header chrome takes a client navigation with no transition, and settles after the swap', async ({ page }) => {
    await page.context().addCookies([{ name: 'lai-huy-locale', value: 'vi', url: TEST_ORIGIN }])
    await page.goto(url('/privacy-policy'), { waitUntil: 'load' })
    await waitForHydration(page)
    const header = page.locator('header.app-header')
    await expect(header).toHaveAttribute('data-chrome-state', 'nav')

    // Header chrome only: the nav underline's ::after is a pseudo-element and is not part of the
    // suppressed chrome (it marks the current link).
    await page.evaluate(() => {
      const w = window as unknown as { __chrome: string[] }
      w.__chrome = []
      document.addEventListener('transitionrun', (event) => {
        const e = event as TransitionEvent
        const target = e.target as Element
        if (!e.pseudoElement && target.closest?.('.app-header')) w.__chrome.push(`${e.propertyName}:${String(target.className)}`)
      }, true)
    })

    // Legal (pinned header) to home (cover): the pin is released by the unmounting page, which
    // happens after the old page has faded out, so the chrome must stay frozen until then.
    await header.locator('a[href="/"]').first().click()
    await page.waitForURL(`${TEST_ORIGIN}/`)
    await expect(header).toHaveAttribute('data-chrome-state', 'cover')
    await expect(header).toHaveCSS('--header-p', '0')
    await expect(header).not.toHaveClass(/chrome-no-transition/)
    await page.waitForTimeout(500)
    expect(await page.evaluate(() => (window as unknown as { __chrome: string[] }).__chrome)).toEqual([])
  })

  test('MOTION-17 the gallery autoplay only runs in view, makes one pass and rests', async ({ page }) => {
    await page.clock.install()
    await stubImages(page)
    await page.goto(url('/du-an/khach-san-eo-gio'), { waitUntil: 'load' })
    await waitForHydration(page)

    const carousel = page.locator('[data-gallery-carousel]')
    const total = Number(await carousel.getAttribute('data-gallery-count'))
    expect(total).toBeGreaterThan(2)

    // Below the fold: it does not run, however long the page waits.
    await expect(carousel).toHaveAttribute('data-gallery-autoplay', 'paused')
    await page.clock.fastForward(12_000)
    await expect(carousel).toHaveAttribute('data-gallery-active-index', '0')

    // In view: it runs, one slide per 5 seconds.
    await carousel.scrollIntoViewIfNeeded()
    await expect(carousel).toHaveAttribute('data-gallery-autoplay', 'running')
    await page.clock.fastForward(5100)
    await expect(carousel).toHaveAttribute('data-gallery-active-index', '1')

    // Scrolled away it holds again.
    await page.evaluate(() => window.scrollTo(0, 0))
    await expect(carousel).toHaveAttribute('data-gallery-autoplay', 'paused')
    await page.clock.fastForward(12_000)
    await expect(carousel).toHaveAttribute('data-gallery-active-index', '1')

    // Back in view it finishes the pass, lands on the first slide and stops for good.
    await carousel.scrollIntoViewIfNeeded()
    await expect(carousel).toHaveAttribute('data-gallery-autoplay', 'running')
    for (let step = 0; step < total; step++) {
      if ((await carousel.getAttribute('data-gallery-autoplay')) === 'ended') break
      await page.clock.fastForward(5100)
    }
    await expect(carousel).toHaveAttribute('data-gallery-autoplay', 'ended')
    await expect(carousel).toHaveAttribute('data-gallery-active-index', '0')
    await page.clock.fastForward(20_000)
    await expect(carousel).toHaveAttribute('data-gallery-active-index', '0')
  })

  test('MOTION-17b the first manual navigation ends the gallery autoplay', async ({ page }) => {
    await page.clock.install()
    await stubImages(page)
    await page.goto(url('/du-an/khach-san-eo-gio'), { waitUntil: 'load' })
    await waitForHydration(page)

    const carousel = page.locator('[data-gallery-carousel]')
    await carousel.scrollIntoViewIfNeeded()
    await expect(carousel).toHaveAttribute('data-gallery-autoplay', 'running')
    await carousel.getByRole('button', { name: 'Ảnh tiếp theo' }).click()
    await page.mouse.move(0, 0)
    await expect(carousel).toHaveAttribute('data-gallery-autoplay', 'ended')
    await expect(carousel).toHaveAttribute('data-gallery-active-index', '1')
    await page.clock.fastForward(20_000)
    await expect(carousel).toHaveAttribute('data-gallery-active-index', '1')

    // The play button starts a fresh pass.
    await carousel.getByRole('button', { name: 'Tiếp tục trình chiếu' }).click()
    await page.mouse.move(0, 0)
    // Focus within pauses it (a separate, existing rule); once focus leaves, the pass runs.
    await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur())
    await expect(carousel).toHaveAttribute('data-gallery-autoplay', 'running')
  })
})

async function openDrawer(page: Page): Promise<void> {
  const open = page.getByRole('button', { name: /Mở menu|Open menu/ })
  await expect(async () => {
    await open.click()
    await expect(page.locator('.app-drawer')).toBeVisible({ timeout: 1000 })
  }).toPass()
}
