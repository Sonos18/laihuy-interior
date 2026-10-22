import type { Page } from '@playwright/test'
import { expect, test } from './fixtures'
import { APP_ORIGIN } from './origin'

/**
 * Small-defect guards from the 2026-10-22 critique: one measurable assertion per defect, so each
 * stays fixed. Images are stubbed with a 1x1 PNG (the geometry here does not depend on pixels), as
 * in warm-canvas.spec.ts.
 */

const TRANSPARENT_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M/wHwAF/gL+X9j7WQAAAABJRU5ErkJggg==',
  'base64'
)

async function open(page: Page, path: string, width: number, locale: 'vi' | 'en' = 'vi', height = 900) {
  await page.context().addCookies([{ name: 'lai-huy-locale', value: locale, url: APP_ORIGIN }])
  await page.route('**/*', async (handler) => {
    if (handler.request().resourceType() === 'image') {
      await handler.fulfill({ status: 200, contentType: 'image/png', body: TRANSPARENT_PNG })
      return
    }
    await handler.continue()
  })
  await page.route('https://maps.google.com/**', handler =>
    handler.fulfill({ status: 200, contentType: 'text/html', body: '<!doctype html><title>Map unavailable in test</title>' }))
  await page.setViewportSize({ width, height })
  await page.goto(path, { waitUntil: 'load' })
  await page.evaluate(() => document.fonts.ready)
}

test.describe('buttons never wrap their label', () => {
  for (const locale of ['vi', 'en'] as const) {
    for (const width of [375, 768, 1280, 1440]) {
      test(`/dich-vu closing CTA keeps single-line pills (${locale}, ${width}px)`, async ({ page }) => {
        await open(page, '/dich-vu', width, locale)
        const buttons = await page.locator('.section-cta .btn-bronze, .section-cta .btn-outline').evaluateAll(elements =>
          elements.map((element) => {
            const rect = element.getBoundingClientRect()
            // Text nodes only: the arrow icon beside the label sits on a different box top.
            const lineTops = new Set<number>()
            for (const node of element.childNodes) {
              if (node.nodeType !== Node.TEXT_NODE || !node.textContent?.trim()) continue
              const range = document.createRange()
              range.selectNodeContents(node)
              for (const r of range.getClientRects()) if (r.width > 0) lineTops.add(Math.round(r.top / 4))
            }
            return {
              height: rect.height,
              right: rect.right,
              left: rect.left,
              whiteSpace: getComputedStyle(element).whiteSpace,
              lines: lineTops.size
            }
          })
        )
        expect(buttons.length).toBeGreaterThanOrEqual(2)
        for (const button of buttons) {
          expect(button.whiteSpace).toBe('nowrap')
          expect(button.lines).toBe(1)
          expect(button.height).toBeLessThan(56)
          // Where the pair cannot fit side by side it stacks; it never pushes past the viewport.
          expect(button.left).toBeGreaterThanOrEqual(0)
          expect(button.right).toBeLessThanOrEqual(width)
        }
      })
    }
  }
})

test.describe('home lead project card', () => {
  for (const width of [768, 1024, 1440]) {
    test(`has no dead space and shows its materials whole (${width}px)`, async ({ page }) => {
      await open(page, '/', width)
      const geometry = await page.locator('.home-projects__card--hero').evaluate((card) => {
        const cardBox = card.getBoundingClientRect()
        const meta = card.querySelector('.home-projects__meta')!.getBoundingClientRect()
        const excerpt = card.querySelector('.home-projects__excerpt')!.getBoundingClientRect()
        const ledger = card.querySelector('.home-projects__specs')!.getBoundingClientRect()
        const specs = [...card.querySelectorAll('.home-projects__spec dd')].map((dd) => {
          const style = getComputedStyle(dd)
          return {
            overflow: dd.scrollWidth > dd.clientWidth + 1,
            ellipsis: style.textOverflow === 'ellipsis',
            nowrap: style.whiteSpace === 'nowrap'
          }
        })
        return {
          bottomGap: cardBox.bottom - meta.bottom,
          // Spare height goes into the ledger rows, not into a blank band between blocks.
          excerptToLedger: ledger.top - excerpt.bottom,
          ledgerToMeta: meta.top - ledger.bottom,
          specs
        }
      })
      // Meta sits on the card's padding (24px, 28px from 1024px) and nothing else.
      expect(geometry.bottomGap).toBeLessThanOrEqual(29)
      expect(geometry.ledgerToMeta).toBeLessThanOrEqual(1)
      expect(geometry.excerptToLedger).toBeLessThanOrEqual(32)
      expect(geometry.specs).toHaveLength(3)
      for (const spec of geometry.specs) {
        expect(spec.overflow).toBe(false)
        expect(spec.ellipsis).toBe(false)
        expect(spec.nowrap).toBe(false)
      }
    })
  }

  test('satellite descriptions are not line-clamped mid-word', async ({ page }) => {
    await open(page, '/', 1440)
    const clamps = await page.locator('.home-projects__card--satellite .home-projects__excerpt').evaluateAll(elements =>
      elements.map(element => getComputedStyle(element).webkitLineClamp))
    expect(clamps).toHaveLength(2)
    for (const clamp of clamps) expect(clamp).toBe('none')
  })
})

test('home factory pillar accent takes the heading colour, not a link-like bronze', async ({ page }) => {
  await open(page, '/', 1440)
  const pairs = await page.locator('[data-testid="homepage-machinery-pillar-title"]').evaluateAll(headings =>
    headings.flatMap((heading) => {
      const accent = heading.querySelector('span')
      return accent ? [{ heading: getComputedStyle(heading).color, accent: getComputedStyle(accent).color }] : []
    }))
  expect(pairs.length).toBeGreaterThan(0)
  for (const pair of pairs) expect(pair.accent).toBe(pair.heading)
})

test.describe('case study', () => {
  test('delivery timeline numerals sit on their own line above the icon', async ({ page }) => {
    await open(page, '/du-an/khach-san-eo-gio', 1440)
    const items = await page.locator('[data-delivery-timeline] > li').evaluateAll(list =>
      list.map((li) => {
        const numeral = li.querySelector('span')!.getBoundingClientRect()
        const icon = li.querySelector('svg, [class*="i-lucide"], .iconify')!.getBoundingClientRect()
        return { numeralBottom: numeral.bottom, iconTop: icon.top }
      }))
    expect(items.length).toBeGreaterThanOrEqual(3)
    for (const item of items) {
      expect(item.iconTop - item.numeralBottom).toBeGreaterThanOrEqual(8)
    }
  })

  test('the "end-to-end" cell shows only when scope covers design, production and construction', async ({ page }) => {
    await open(page, '/du-an/khach-san-eo-gio', 1440)
    await expect(page.locator('[data-project-chapter="finale"] ul li')).toHaveCount(4)
    await expect(page.locator('[data-project-chapter="finale"] ul')).toContainText('Trọn gói')

    await open(page, '/du-an/phong-hop-quan-7', 1440)
    await expect(page.locator('[data-project-chapter="finale"] ul li')).toHaveCount(3)
    await expect(page.locator('[data-project-chapter="finale"] ul')).not.toContainText('Trọn gói')
  })

  test('the "end-to-end" cell is omitted in English on a design-only project', async ({ page }) => {
    await open(page, '/du-an/phong-hop-quan-7', 1440, 'en')
    await expect(page.locator('[data-project-chapter="finale"] ul')).not.toContainText('End-to-end')
  })
})

test.describe('legal prose measure', () => {
  for (const path of ['/privacy-policy', '/terms-of-use']) {
    for (const width of [768, 1440]) {
      test(`${path} paragraphs stay within 75 characters (${width}px)`, async ({ page }) => {
        await open(page, path, width)
        const measures = await page.evaluate(() => {
          const prose = [...document.querySelectorAll('main section.section-y p, main section.section-y li span')]
          // 1ch at the page's 16px body size.
          const probe = document.createElement('span')
          probe.style.cssText = 'position:absolute;visibility:hidden;width:1ch;font-size:16px;font-family:inherit'
          prose[0]!.parentElement!.append(probe)
          const ch = probe.getBoundingClientRect().width
          probe.remove()
          return {
            ch,
            paragraphs: prose.map(p => ({
              width: p.getBoundingClientRect().width,
              fontSize: Number.parseFloat(getComputedStyle(p).fontSize)
            }))
          }
        })
        expect(measures.paragraphs.length).toBeGreaterThan(5)
        for (const paragraph of measures.paragraphs) {
          // Characters per line at the element's own font size.
          const chars = paragraph.width / (measures.ch * (paragraph.fontSize / 16))
          expect(chars).toBeLessThanOrEqual(75)
        }
      })
    }
  }
})

test.describe('header over the hero photograph', () => {
  // The idle nav and the unselected language option were 3.7-4.5:1 and 2.2-3.7:1 over the hero
  // photographs. The values below are the tuned ones; their contrast was measured with the lightest
  // pixel behind each label (see the --scrim-chrome comment in main.css). This guard keeps the
  // tuning from being quietly walked back.
  for (const path of ['/', '/du-an/khach-san-eo-gio', '/lien-he']) {
    test(`${path} nav and language toggle keep their raised cover colours`, async ({ page }) => {
      await open(page, path, 1440)
      const readings = await page.evaluate(() => {
        const alphaOf = (value: string) => {
          const canvas = document.createElement('canvas')
          canvas.width = canvas.height = 1
          const context = canvas.getContext('2d', { willReadFrequently: true })!
          context.fillStyle = value
          context.fillRect(0, 0, 1, 1)
          return context.getImageData(0, 0, 1, 1).data[3]! / 255
        }
        const nav = document.querySelector('.app-header .nav-link:not([aria-current="page"])')!
        const idleLang = document.querySelector('.app-header .lang-option[aria-pressed="false"]')!
        const scrim = getComputedStyle(document.querySelector('.chrome-scrim')!).backgroundImage
        const firstStop = /rgba?\(([^)]+)\)/.exec(scrim)![1]!.split(/[\s,/]+/).filter(Boolean)
        return {
          nav: alphaOf(getComputedStyle(nav).color),
          lang: alphaOf(getComputedStyle(idleLang).color),
          scrimTop: firstStop.length >= 4 ? Number(firstStop[3]) : 1
        }
      })
      expect(readings.nav).toBeGreaterThanOrEqual(0.9)
      expect(readings.lang).toBeGreaterThanOrEqual(0.78)
      expect(readings.scrimTop).toBeGreaterThanOrEqual(0.7)
    })
  }
})
