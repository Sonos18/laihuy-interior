import type { Page } from '@playwright/test'

/**
 * Shared measurements for the warm-light canvas contract (DESIGN.md: Warm Light Rule and
 * Shapes). Every converged route asserts the same two things — no dark band below the hero,
 * and no radius above the 4px edge except pills — so the browser-side maths lives here once.
 *
 * Each function is self-contained on purpose: `page.evaluate` serialises the callback, so it
 * cannot close over module-level helpers.
 */

/** Sawdust, the darkest allowed band, measures about 0.78; anything under this is a dark band. */
export const MIN_SURFACE_LUMINANCE = 0.7

/** Linen and Raw Silk sit above this; only Sawdust falls between MIN_SURFACE_LUMINANCE and it. */
export const SAWDUST_CEILING_LUMINANCE = 0.85

export type SurfaceLuminance = {
  /** `tag.class` for failure messages. */
  label: string
  /** The value of `nameAttribute` when one was requested, otherwise null. */
  name: string | null
  /** Relative luminance (0..1) of the surface as the reader sees it. */
  luminance: number
}

/**
 * The composited background luminance of every element matching `selector`. Translucent layers
 * are composited up the tree until an opaque one, so a tinted surface is judged by what the
 * reader sees rather than by its own alpha.
 */
export async function surfaceLuminances(
  page: Page,
  selector: string,
  options: { nameAttribute?: string, skipHero?: boolean } = {}
): Promise<SurfaceLuminance[]> {
  return page.evaluate(({ selector, nameAttribute, skipHero }) => {
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
    return [...document.querySelectorAll(selector)]
      .filter(el => !skipHero || !el.closest('.app-hero'))
      .map((el) => {
        const [r, g, b] = background(el)
        return {
          label: `${el.tagName.toLowerCase()}.${String(el.className).slice(0, 40)}`,
          name: nameAttribute ? el.getAttribute(nameAttribute) : null,
          luminance: 0.2126 * channel(r!) + 0.7152 * channel(g!) + 0.0722 * channel(b!)
        }
      })
  }, { selector, nameAttribute: options.nameAttribute, skipHero: options.skipHero ?? false })
}

/**
 * Every element in `main` (outside `.app-hero`) with a corner radius above the 4px edge that is
 * not a pill. A pill resolves to a huge px value (Chrome reports it in exponent form) or a
 * percentage of 50 or more. Returns descriptions; an empty array is a pass.
 */
export async function nonEdgeRadii(page: Page): Promise<string[]> {
  return page.evaluate(() => {
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
}
