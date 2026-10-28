import type { Page } from '@playwright/test'
import { expect, test } from './fixtures'
import { APP_ORIGIN } from './origin'

/**
 * RHYTHM: the contracts that keep the long pages from reading as one template
 * (DESIGN.md "Monument", "Statement", "Section heads", "Facts Band", "Breath", "Seams").
 *
 * RH-01  at most one Monument per page, set in the Monument role, AA against its surface.
 * RH-02  at most one Statement heading per page.
 * RH-03  the Facts Band renders with identical type on all four routes that use it, and one
 *        surface per variant (full-bleed band, or the contained frame on home).
 * RH-04  no two consecutive section heads share a layout, and each head's geometry matches the
 *        layout it declares (split: something beside the heading; rail: the eyebrow in a column
 *        of its own; stacked: one column).
 * RH-05  the breath photograph is full-bleed (the viewport's width) at 1440 and 390, with no
 *        radius, no caption and no text alternative, at most one per page, never a factory one.
 * RH-06  every seam between two light sections carries a Plaster hairline.
 *
 * Images are replaced with a 1x1 PNG: these are geometry and style contracts, not pixels.
 */

const TEST_ORIGIN = process.env.DENSITY_TEST_ORIGIN ?? APP_ORIGIN
const TRANSPARENT_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M/wHwAF/gL+X9j7WQAAAABJRU5ErkJggg==',
  'base64'
)

const LONG_PAGES = [
  { name: 'home', path: '/' },
  { name: 'about', path: '/gioi-thieu' },
  { name: 'factory', path: '/nha-xuong' },
  { name: 'services', path: '/dich-vu' },
  { name: 'case study (rich)', path: '/du-an/khach-san-eo-gio' },
  { name: 'case study (sparse)', path: '/du-an/nha-xuong-anh-cuong' }
] as const

const ALL_PAGES = [
  ...LONG_PAGES,
  { name: 'projects', path: '/du-an' },
  { name: 'careers', path: '/tuyen-dung' },
  { name: 'contact', path: '/lien-he' }
] as const

async function open(page: Page, path: string, width: number, locale: 'vi' | 'en' = 'vi') {
  await page.context().addCookies([{ name: 'lai-huy-locale', value: locale, url: TEST_ORIGIN }])
  await page.route('**/*', async (route) => {
    if (route.request().resourceType() === 'image') {
      await route.fulfill({ status: 200, contentType: 'image/png', body: TRANSPARENT_PNG })
      return
    }
    await route.continue()
  })
  await page.route('https://maps.google.com/**', route =>
    route.fulfill({ status: 200, contentType: 'text/html', body: '<!doctype html><title>Map unavailable in test</title>' }))
  await page.setViewportSize({ width, height: 900 })
  await page.goto(new URL(path, TEST_ORIGIN).toString(), { waitUntil: 'load' })
  await page.evaluate(() => document.fonts.ready)
}

// ─── RH-01 / RH-02 ──────────────────────────────────────────────────────────────────────────

for (const page_ of ALL_PAGES) {
  test(`RH-01/02 one Monument and one Statement at most on ${page_.name}`, async ({ page }) => {
    await open(page, page_.path, 1440)

    const result = await page.evaluate(() => {
      const luminance = (rgb: number[]) => {
        const channel = (c: number) => {
          const v = c / 255
          return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
        }
        return 0.2126 * channel(rgb[0]!) + 0.7152 * channel(rgb[1]!) + 0.0722 * channel(rgb[2]!)
      }
      const parse = (value: string) => (value.match(/[\d.]+/g) ?? []).map(Number)
      const surface = (el: Element): number[] => {
        for (let node: Element | null = el; node; node = node.parentElement) {
          const [r, g, b, a = 1] = parse(getComputedStyle(node).backgroundColor)
          if (a === 1 && r !== undefined) return [r, g!, b!]
        }
        return [255, 255, 255]
      }
      const contrast = (fg: number[], bg: number[]) => {
        const [hi, lo] = [luminance(fg), luminance(bg)].sort((a, b) => b - a)
        return (hi! + 0.05) / (lo! + 0.05)
      }
      const monuments = [...document.querySelectorAll<HTMLElement>('[data-monument] .monument-value')].map((el) => {
        const style = getComputedStyle(el)
        return {
          text: el.textContent?.trim() ?? '',
          fontSize: Number.parseFloat(style.fontSize),
          family: style.fontFamily,
          weight: style.fontWeight,
          whiteSpace: style.whiteSpace,
          lines: Math.round(el.getBoundingClientRect().height / Number.parseFloat(style.lineHeight)),
          contrast: contrast(parse(style.color), surface(el))
        }
      })
      const statements = document.querySelectorAll('main .home-statement-heading').length
      return { monuments, statements }
    })

    expect(result.monuments.length).toBeLessThanOrEqual(1)
    expect(result.statements).toBeLessThanOrEqual(1)
    for (const monument of result.monuments) {
      // Monument sits above Display (72px max at 1440).
      expect(monument.fontSize).toBeGreaterThan(72)
      expect(monument.family).toContain('Outfit')
      expect(monument.weight).toBe('500')
      expect(monument.whiteSpace).toBe('nowrap')
      expect(monument.lines).toBe(1)
      // A figure, never a sentence.
      expect(monument.text).toMatch(/\d/)
      expect(monument.text.length).toBeLessThanOrEqual(10)
      expect(monument.contrast).toBeGreaterThanOrEqual(4.5)
    }
  })
}

test('RH-01 / carries no Monument: its factory section is head, photograph and link', async ({ page }) => {
  await open(page, '/', 1440)
  await expect(page.locator('[data-monument]')).toHaveCount(0)
})

for (const [path, expected] of [['/nha-xuong', '3.000 m²'], ['/gioi-thieu', 'Đến 50']] as const) {
  test(`RH-01 ${path} carries its Monument and it fits at 375`, async ({ page }) => {
    await open(page, path, 375)
    const monument = page.locator('[data-monument] .monument-value')
    await expect(monument).toHaveCount(1)
    await expect(monument).toHaveText(expected)
    const fits = await monument.evaluate(el => el.getBoundingClientRect().right <= document.documentElement.clientWidth)
    expect(fits).toBe(true)
  })
}

// ─── RH-03 ──────────────────────────────────────────────────────────────────────────────────

const BAND_ROUTES = ['/', '/gioi-thieu', '/nha-xuong', '/du-an/khach-san-eo-gio'] as const

async function bandStyles(page: Page) {
  return page.evaluate(() => {
    const band = document.querySelector<HTMLElement>('[data-facts-band]')
    if (!band) throw new Error('Missing [data-facts-band]')
    const pick = (el: Element | null, props: string[]) => {
      if (!el) return null
      const style = getComputedStyle(el)
      return Object.fromEntries(props.map(prop => [prop, style.getPropertyValue(prop)]))
    }
    const type = ['font-family', 'font-size', 'font-weight', 'line-height', 'letter-spacing', 'text-transform', 'color']
    const cells = [...band.querySelectorAll('dl > div')]
    const figure = band.querySelector('dd.home-stat-value')
    const phrase = band.querySelector('dd.home-card-heading')
    return {
      contained: band.classList.contains('facts-band--contained'),
      count: cells.length,
      // The decorative bronze beam round the home frame is an aria-hidden SVG, not an icon.
      icons: band.querySelectorAll('svg:not(.facts-band__beam), .iconify, [class*="i-lucide"]').length,
      band: pick(band, ['background-color', 'border-bottom-width', 'border-bottom-color', 'border-bottom-style']),
      grid: pick(band.querySelector('dl'), ['background-color', 'border-top-width', 'border-top-color', 'border-radius']),
      type: {
        cell: pick(cells[0] ?? null, ['padding-top', 'padding-bottom', 'border-right-width', 'border-right-color', 'row-gap']),
        label: pick(band.querySelector('dt'), type),
        figure: pick(figure, type),
        phrase: pick(phrase, type)
      }
    }
  })
}

test('RH-03 the Facts Band has one treatment on all four routes', async ({ page }) => {
  const samples: Array<{ path: string, styles: Awaited<ReturnType<typeof bandStyles>> }> = []
  for (const path of BAND_ROUTES) {
    await open(page, path, 1440)
    await expect(page.locator('[data-facts-band]')).toHaveCount(1)
    samples.push({ path, styles: await bandStyles(page) })
  }

  const [reference, ...others] = samples
  expect(reference!.styles.type.figure, 'the home band shows a figure').not.toBeNull()
  expect(reference!.styles.type.phrase, 'the home band shows a phrase').not.toBeNull()
  for (const sample of samples) {
    expect(sample.styles.icons, `${sample.path} band carries no icons`).toBe(0)
    expect(sample.styles.count, `${sample.path} band shows three or four facts`).toBeGreaterThanOrEqual(3)
    // Home is the contained variant: the Linen frame sits on the rail. Elsewhere the band itself
    // is Linen, full-bleed, with a Plaster hairline under it.
    expect(sample.styles.contained, `${sample.path} band variant`).toBe(sample.path === '/')
    if (sample.styles.contained) {
      expect(sample.styles.grid!['background-color']).toBe('rgb(250, 246, 240)')
      expect(sample.styles.grid!['border-top-width']).toBe('1px')
    } else {
      expect(sample.styles.band!['background-color']).toBe('rgb(250, 246, 240)')
      expect(sample.styles.band!['border-bottom-width']).toBe('1px')
    }
  }
  for (const sample of others) {
    expect(sample.styles.type, `${sample.path} band type matches the home band`).toEqual(reference!.styles.type)
  }
  const fullBleed = samples.filter(sample => !sample.styles.contained)
  for (const sample of fullBleed.slice(1)) {
    expect(sample.styles.band, `${sample.path} band surface matches ${fullBleed[0]!.path}`).toEqual(fullBleed[0]!.styles.band)
  }
})

// ─── RH-04 ──────────────────────────────────────────────────────────────────────────────────

type Head = {
  layout: string
  text: string
  eyebrow: { left: number, top: number, right: number } | null
  heading: { left: number, top: number, right: number, bottom: number }
  beside: boolean
  width: number
}

/** Eyebrow and heading share a left edge, or (a centred head) a centre line. */
const oneColumn = (head: Head) => {
  const eyebrow = head.eyebrow!
  const centre = (box: { left: number, right: number }) => (box.left + box.right) / 2
  return Math.min(
    Math.abs(eyebrow.left - head.heading.left),
    Math.abs(centre(eyebrow) - centre(head.heading))
  ) <= 1
}

async function sectionHeads(page: Page): Promise<Head[]> {
  return page.evaluate(() => {
    const box = (el: Element | null) => {
      if (!el) return null
      const rect = el.getBoundingClientRect()
      return { left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom }
    }
    return [...document.querySelectorAll<HTMLElement>('main [data-head]')]
      .filter(el => el.getBoundingClientRect().height > 0 && !el.closest('.sr-only'))
      .map((el) => {
        const heading = el.querySelector('h2')!
        const headingBox = box(heading)!
        // Anything in the head (lead, action, filters) that sits wholly to the right of the heading.
        const beside = [...el.querySelectorAll<HTMLElement>('p, a, button, [data-gallery-filters]')]
          .filter(node => node !== heading && !heading.contains(node) && node.getBoundingClientRect().width > 0)
          .some(node => node.getBoundingClientRect().left >= headingBox.right - 1)
        const eyebrow = [...el.querySelectorAll('p')].find(p => p.compareDocumentPosition(heading) & Node.DOCUMENT_POSITION_FOLLOWING) ?? null
        return {
          layout: el.dataset.head ?? '',
          text: heading.textContent?.trim().slice(0, 40) ?? '',
          eyebrow: box(eyebrow),
          heading: headingBox,
          beside,
          width: el.getBoundingClientRect().width
        }
      })
  })
}

for (const page_ of LONG_PAGES) {
  for (const locale of ['vi', 'en'] as const) {
    test(`RH-04 no two consecutive section heads share a layout on ${page_.name} (${locale})`, async ({ page }) => {
      await open(page, page_.path, 1440, locale)
      const heads = await sectionHeads(page)

      expect(heads.length).toBeGreaterThanOrEqual(3)
      for (const head of heads) expect(['stacked', 'split', 'rail'], head.text).toContain(head.layout)
      for (let index = 1; index < heads.length; index += 1) {
        // Owner exception (DESIGN.md "No-Echo Rule", 2026-10-24): on home the material story and
        // the capabilities heads are both stacked. Only that pair, only on home.
        if (page_.path === '/' && index === 1 && heads[0]!.layout === 'stacked' && heads[1]!.layout === 'stacked') continue
        expect(
          heads[index]!.layout,
          `"${heads[index - 1]!.text}" and "${heads[index]!.text}" share the ${heads[index]!.layout} layout`
        ).not.toBe(heads[index - 1]!.layout)
      }

      for (const head of heads) {
        if (head.layout === 'split') {
          expect(head.beside, `split head "${head.text}" has its lead or action beside the heading`).toBe(true)
        }
        if (head.layout === 'rail') {
          expect(head.eyebrow, `rail head "${head.text}" has an eyebrow`).not.toBeNull()
          // The eyebrow owns a column: the heading starts a quarter of the measure further in,
          // and the two share a row.
          expect(head.heading.left - head.eyebrow!.left).toBeGreaterThan(head.width * 0.2)
          expect(head.eyebrow!.right).toBeLessThanOrEqual(head.heading.left)
          expect(head.eyebrow!.top).toBeLessThan(head.heading.bottom)
        }
        if (head.layout === 'stacked') {
          expect(head.beside, `stacked head "${head.text}" keeps one column`).toBe(false)
          if (head.eyebrow) expect(oneColumn(head), head.text).toBe(true)
        }
      }
    })
  }

  test(`RH-04 every head collapses to one column at 390 on ${page_.name}`, async ({ page }) => {
    await open(page, page_.path, 390)
    for (const head of await sectionHeads(page)) {
      if (head.eyebrow) expect(oneColumn(head), head.text).toBe(true)
    }
  })
}

// ─── RH-05 ──────────────────────────────────────────────────────────────────────────────────

const BREATH_PAGES = ['/gioi-thieu', '/dich-vu', '/du-an/khach-san-eo-gio'] as const

for (const path of BREATH_PAGES) {
  for (const width of [1440, 390] as const) {
    test(`RH-05 the breath photograph runs full-bleed on ${path} at ${width}`, async ({ page }) => {
      await open(page, path, width)
      const breath = page.locator('[data-breath]')
      await expect(breath).toHaveCount(1)

      const geometry = await breath.evaluate((el) => {
        const rect = el.getBoundingClientRect()
        const frame = el.firstElementChild as HTMLElement
        const frameRect = frame.getBoundingClientRect()
        const img = el.querySelector('img')!
        const radii = [el, frame, img].flatMap((node) => {
          const style = getComputedStyle(node)
          return [style.borderTopLeftRadius, style.borderTopRightRadius, style.borderBottomLeftRadius, style.borderBottomRightRadius]
        })
        return {
          left: rect.left,
          width: rect.width,
          viewport: document.documentElement.clientWidth,
          ratio: frameRect.width / frameRect.height,
          height: frameRect.height,
          radii,
          inShell: !!el.closest('.shell'),
          caption: el.querySelectorAll('figcaption').length,
          alt: img.getAttribute('alt'),
          src: img.getAttribute('src') ?? ''
        }
      })

      expect(geometry.inShell).toBe(false)
      expect(Math.abs(geometry.left)).toBeLessThanOrEqual(0.5)
      expect(Math.abs(geometry.width - geometry.viewport)).toBeLessThanOrEqual(0.5)
      const expectedRatio = width >= 768 ? 21 / 9 : 16 / 7
      // Exact crop, unless the 46rem cap binds (it does not at these widths).
      expect(Math.abs(geometry.ratio - expectedRatio)).toBeLessThanOrEqual(0.02)
      expect(geometry.height).toBeLessThanOrEqual(736)
      for (const radius of geometry.radii) expect(radius).toBe('0px')
      expect(geometry.caption).toBe(0)
      expect(geometry.alt).toBe('')
      // Owner scope: the factory photographs are not used as a breath.
      expect(geometry.src).not.toMatch(/workshop|hinh-xuong/)
    })
  }
}

test('RH-05 home, the factory page and a sparse case study carry no breath', async ({ page }) => {
  await open(page, '/', 1440)
  await expect(page.locator('[data-breath]')).toHaveCount(0)
  await open(page, '/nha-xuong', 1440)
  await expect(page.locator('[data-breath]')).toHaveCount(0)
  await open(page, '/du-an/phong-hop-quan-7', 1440)
  expect(await page.locator('[data-breath]').count()).toBeLessThanOrEqual(1)
})

// ─── RH-06 ──────────────────────────────────────────────────────────────────────────────────

for (const page_ of LONG_PAGES) {
  test(`RH-06 every seam between light sections carries a hairline on ${page_.name}`, async ({ page }) => {
    await open(page, page_.path, 1440)

    const seams = await page.evaluate(() => {
      const isPhoto = (el: Element) =>
        el.matches('[data-breath], .app-hero, [data-testid="home-hero"], [data-project-chapter="hero"]')
      // Top-level bands of the page, in reading order: sections, the Facts Band and the breath,
      // each counted once (a band nested in a section belongs to that section).
      const blocks = [...document.querySelectorAll('main section, main [data-facts-band], main [data-breath], main [data-project-subnav]')]
        .filter(el => !el.parentElement?.closest('main section, main [data-facts-band], main [data-breath]'))
        .filter(el => el.getBoundingClientRect().height > 0 && !el.closest('.sr-only'))
      const ruled = (value: string) => Number.parseFloat(value) >= 1
      const missing: string[] = []
      for (let index = 1; index < blocks.length; index += 1) {
        const above = blocks[index - 1]!
        const below = blocks[index]!
        if (isPhoto(above) || isPhoto(below)) continue
        // The contained Facts Band is a framed grid on the canvas, not a band: it has no seam.
        if (above.matches('.facts-band--contained') || below.matches('.facts-band--contained')) continue
        // A section that ends on a breath photograph meets the next one at the photograph.
        if (above.lastElementChild?.matches('[data-breath]')) continue
        // A section that opens on the Facts Band meets the previous one at the band's own seam.
        const top = ruled(getComputedStyle(below).borderTopWidth)
          || (below.firstElementChild?.matches('[data-facts-band]') ?? false)
        const bottom = ruled(getComputedStyle(above).borderBottomWidth)
        if (!top && !bottom) {
          const label = (el: Element) => el.getAttribute('data-testid') ?? el.getAttribute('data-about-chapter')
            ?? el.getAttribute('data-services-chapter') ?? el.getAttribute('data-project-chapter') ?? el.tagName.toLowerCase()
          missing.push(`${label(above)} → ${label(below)}`)
        }
      }
      return missing
    })

    expect(seams).toEqual([])
  })
}
