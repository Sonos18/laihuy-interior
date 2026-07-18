/**
 * Colour maths for the V7 gate — docs/header-footer-art-direction.md §14.1.
 *
 * V7 asserts a RENDERED colour against its SPEC value at ΔE₀₀ ≤ 1.0. ΔE₀₀ (CIEDE2000) is used
 * rather than a channel-wise comparison because it is perceptually uniform: a 1-unit deviation
 * means the same thing in the wood ramp as in the ink ramp, which a raw RGB delta does not.
 *
 * §25.3 names V7 as the TEST layer of the token freeze: lint bans raw utilities, review catches
 * what lint misses, and V7 catches the case both let through — a token whose value silently
 * drifted from the one this document specifies.
 */

export type RGB = [number, number, number]
export type Lab = [number, number, number]

/** An `rgb()` / `rgba()` computed value, split into colour + alpha. */
export function parseRgb(value: string): { rgb: RGB, alpha: number } {
  const match = value.match(/rgba?\(([^)]+)\)/)
  if (!match) throw new Error(`V7: cannot parse colour "${value}"`)
  const parts = match[1]!.split(/[,/]/).map(p => parseFloat(p.trim()))
  return {
    rgb: [parts[0]!, parts[1]!, parts[2]!],
    alpha: parts[3] === undefined ? 1 : parts[3]
  }
}

/**
 * Composite a translucent colour over an opaque backdrop.
 *
 * ΔE₀₀ is defined for opaque colours only, and several tokens are DELIBERATELY translucent
 * (--fg-dark-muted at 0.72, --fg-dark-subtle at 0.48 — §25.2 derives both from their composited
 * contrast). Rendered and expected are composited over the SAME reference backdrop, so the
 * comparison stays faithful regardless of what is actually behind the element.
 */
export function composite(fg: RGB, alpha: number, bg: RGB): RGB {
  return [
    fg[0] * alpha + bg[0] * (1 - alpha),
    fg[1] * alpha + bg[1] * (1 - alpha),
    fg[2] * alpha + bg[2] * (1 - alpha)
  ]
}

export function hexToRgb(hex: string): RGB {
  const h = hex.replace('#', '')
  const full = h.length === 3 ? h.split('').map(c => c + c).join('') : h
  return [
    parseInt(full.slice(0, 2), 16),
    parseInt(full.slice(2, 4), 16),
    parseInt(full.slice(4, 6), 16)
  ]
}

const srgbToLinear = (channel: number) => {
  const v = channel / 255
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
}

/** sRGB → CIE Lab (D65), the space CIEDE2000 is defined in. */
export function rgbToLab([r, g, b]: RGB): Lab {
  const R = srgbToLinear(r)
  const G = srgbToLinear(g)
  const B = srgbToLinear(b)

  // sRGB D65 primaries.
  const x = (R * 0.4124564 + G * 0.3575761 + B * 0.1804375) / 0.95047
  const y = (R * 0.2126729 + G * 0.7151522 + B * 0.0721750) / 1.0
  const z = (R * 0.0193339 + G * 0.1191920 + B * 0.9503041) / 1.08883

  const f = (t: number) => (t > 216 / 24389 ? Math.cbrt(t) : (841 / 108) * t + 4 / 29)
  const fx = f(x)
  const fy = f(y)
  const fz = f(z)

  return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)]
}

const rad = (deg: number) => (deg * Math.PI) / 180

/** CIEDE2000. Reference: Sharma, Wu & Dalal (2005). */
export function deltaE00([L1, a1, b1]: Lab, [L2, a2, b2]: Lab): number {
  const C1 = Math.hypot(a1, b1)
  const C2 = Math.hypot(a2, b2)
  const Cbar = (C1 + C2) / 2
  const C7 = Math.pow(Cbar, 7)
  const G = 0.5 * (1 - Math.sqrt(C7 / (C7 + Math.pow(25, 7))))

  const a1p = (1 + G) * a1
  const a2p = (1 + G) * a2
  const C1p = Math.hypot(a1p, b1)
  const C2p = Math.hypot(a2p, b2)

  const hue = (x: number, y: number) => {
    if (x === 0 && y === 0) return 0
    const deg = (Math.atan2(y, x) * 180) / Math.PI
    return deg >= 0 ? deg : deg + 360
  }
  const h1p = hue(a1p, b1)
  const h2p = hue(a2p, b2)

  const dLp = L2 - L1
  const dCp = C2p - C1p

  let dhp = 0
  if (C1p * C2p !== 0) {
    dhp = h2p - h1p
    if (dhp > 180) dhp -= 360
    else if (dhp < -180) dhp += 360
  }
  const dHp = 2 * Math.sqrt(C1p * C2p) * Math.sin(rad(dhp) / 2)

  const Lbarp = (L1 + L2) / 2
  const Cbarp = (C1p + C2p) / 2

  let hbarp: number
  if (C1p * C2p === 0) {
    hbarp = h1p + h2p
  } else {
    const sum = h1p + h2p
    if (Math.abs(h1p - h2p) <= 180) hbarp = sum / 2
    else hbarp = sum < 360 ? (sum + 360) / 2 : (sum - 360) / 2
  }

  const T
    = 1
      - 0.17 * Math.cos(rad(hbarp - 30))
      + 0.24 * Math.cos(rad(2 * hbarp))
      + 0.32 * Math.cos(rad(3 * hbarp + 6))
      - 0.2 * Math.cos(rad(4 * hbarp - 63))

  const dTheta = 30 * Math.exp(-Math.pow((hbarp - 275) / 25, 2))
  const Cbarp7 = Math.pow(Cbarp, 7)
  const Rc = 2 * Math.sqrt(Cbarp7 / (Cbarp7 + Math.pow(25, 7)))
  const Sl = 1 + (0.015 * Math.pow(Lbarp - 50, 2)) / Math.sqrt(20 + Math.pow(Lbarp - 50, 2))
  const Sc = 1 + 0.045 * Cbarp
  const Sh = 1 + 0.015 * Cbarp * T
  const Rt = -Math.sin(rad(2 * dTheta)) * Rc

  return Math.sqrt(
    Math.pow(dLp / Sl, 2)
    + Math.pow(dCp / Sc, 2)
    + Math.pow(dHp / Sh, 2)
    + Rt * (dCp / Sc) * (dHp / Sh)
  )
}

/** The full V7 comparison: two CSS colour strings, composited over `bg`, in ΔE₀₀. */
export function deviation(rendered: string, expected: string, bg: RGB): number {
  const r = parseRgb(rendered)
  const e = expected.startsWith('#')
    ? { rgb: hexToRgb(expected), alpha: 1 }
    : parseRgb(expected)
  return deltaE00(
    rgbToLab(composite(r.rgb, r.alpha, bg)),
    rgbToLab(composite(e.rgb, e.alpha, bg))
  )
}
