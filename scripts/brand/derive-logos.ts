/**
 * Derive the site's monochrome logo assets from the colour master.
 *
 * Phase 2 of docs/header-footer-art-direction.md (§18), implementing ADR-004.
 *
 * WHY THIS SCRIPT EXISTS
 * ----------------------
 * `public/logo-white.png` contains no white: its dominant ink is a slate blue (~#495d80) that
 * exists nowhere in the ink/wood palette, and it measures 1.86:1 over hero photography — a live
 * WCAG 1.4.11 failure (3:1 required). ADR-004 adopts the brand rule "the logo is an adaptive
 * signature, not a coloured badge": monochrome white over dark photography, monochrome ink over
 * light. The header cross-fades between the two by opacity (Phase 4).
 *
 * The assets are DERIVED BY THIS SCRIPT, not hand-made binaries (§18): the script is the source
 * of truth, so the assets are regenerable and reviewable. ADR-004 alt 3 (a runtime CSS filter)
 * was rejected — `filter:` establishes a containing block and breaks Safari's backdrop-filter on
 * ancestors, inside the one component whose design depends on backdrop-filter working.
 *
 * METHOD (ADR-004 option 4)
 * -------------------------
 * Trim the padding → take the alpha channel as a mask → fill it with #fff and --color-ink-950
 * → emit two @3x PNGs. Only the alpha survives; every RGB value in the master is discarded, which
 * is what flattens the blue drop and the orange swooshes to a single ink.
 *
 * BRAND-ARCHIVE ASSETS — DO NOT DELETE (ADR-004 consequences, Appendix D.1)
 * ------------------------------------------------------------------------
 * `public/logo.png`, `public/logo-white.png` and `public/logo_favicon.png` stay at their current
 * paths. Once Phase 4 lands they become unreferenced by the site, and that is INTENDED, not dead
 * code: they are the colour masters, retained for print, documents, favicon and social. The
 * adaptive-monochrome rule applies to the site, not to brand assets. A cleanup PR deleting them
 * is a regression. `logo-white.png` is additionally this script's input.
 *
 * Run: pnpm brand:logos
 */
import { statSync } from 'node:fs'
import process from 'node:process'
import sharp from 'sharp'

/** The colour master. Also a brand-archive asset — see the header note. */
const SOURCE = 'public/logo-white.png'

type Rgb = readonly [number, number, number]

type Variant = {
  /** Output path, per Appendix D.2. */
  readonly file: string
  /** Maps each master pixel's RGB to the output RGB; alpha always survives untouched. */
  readonly recolour: (rgb: Rgb) => Rgb
  /** What the recolour does, for the log line. */
  readonly token: string
}

/** The master holds exactly two inks: slate blue (~#495d80) and orange. Orange is the red-led one. */
const isOrange = ([r, , b]: Rgb) => r > b

const VARIANTS: readonly Variant[] = [
  {
    file: 'public/logo-mono-white.png',
    recolour: () => [0xff, 0xff, 0xff],
    token: 'filled #fff (--fg-dark)'
  },
  {
    file: 'public/logo-mono-ink.png',
    // main.css @theme --color-ink-950: #0b0a09
    recolour: () => [0x0b, 0x0a, 0x09],
    token: 'filled #0b0a09 (--color-ink-950)'
  },
  // 2026-10-27 — the owner asked for the logo in its original colours on the site. These two
  // supersede the mono pair in the render path; the mono pair is still derived for reference.
  {
    // Light surfaces (scrolled header, drawer): the master's own blue + orange, trimmed.
    file: 'public/logo-color.png',
    recolour: rgb => rgb,
    token: 'master colours (blue + orange)'
  },
  {
    // Dark surfaces (header over the cover, footer): the blue ink would sit at 1.86:1 over
    // photography, so it turns white and the orange stays — the same treatment the brand's
    // own badge (public/logo.png) gives the mark on its blue disc.
    file: 'public/logo-color-reverse.png',
    recolour: rgb => (isOrange(rgb) ? rgb : [0xff, 0xff, 0xff]),
    token: 'blue → #fff, orange kept'
  }
]

/** Appendix A.7 / §23.4 — mono logo, each. */
const MAX_BYTES = 8 * 1024

/**
 * §23.4 calls the output a "2-colour palette PNG", and in ink terms it is exactly that: one fill
 * plus transparency — every RGB in the master is discarded above.
 *
 * That is not the same as a 2-ENTRY palette. PNG-8 carries alpha per palette entry (tRNS), so the
 * mark's antialiased edges and the peacock's fine feather linework need many entries at the SAME
 * RGB, differing only in alpha. Quantising to 2 entries collapses those to a hard 1-bit edge —
 * 2.09KB, but visibly jagged, which fails the §38.4 "visual" half of the same gate.
 *
 * Measured at the trimmed native size: 2 → 2.09KB (jagged) · 16…128 → 6.47KB (converged, smooth)
 * · 256 → 13.26KB (over budget). 128 is the most alpha fidelity available inside the 8KB budget,
 * and costs nothing over 16.
 */
const PALETTE_ENTRIES = 128

/** §25.2 / §29 `--logo-aspect` — measured from the trimmed asset (424 × 212). */
const EXPECTED_ASPECT = 2
/** The aspect is a derived constant, not a taste choice; allow only float noise. */
const ASPECT_TOLERANCE = 0.001

/**
 * The largest optical size any consumer renders is --logo-h-footer-md (4rem = 64px), so @3x is
 * 192px tall. The trimmed master is 212px tall — already ≥ @3x — so it is emitted at its native
 * trimmed resolution. Downscaling to exactly 384×192 would resample for a trivial byte saving and
 * lose fidelity; upscaling would invent detail the master does not have. 424×212 is also the exact
 * geometry §25.2 and §29 record for this asset.
 */
const MIN_3X_HEIGHT = 64 * 3

async function derive(variant: Variant, source: Buffer, width: number, height: number) {
  // Recolour RGB, keep alpha: the mask IS the mark (ADR-004).
  const masked = Buffer.alloc(source.length)
  for (let i = 0; i < source.length; i += 4) {
    const [r, g, b] = variant.recolour([source[i]!, source[i + 1]!, source[i + 2]!])
    masked[i] = r
    masked[i + 1] = g
    masked[i + 2] = b
    masked[i + 3] = source[i + 3]!
  }

  await sharp(masked, { raw: { width, height, channels: 4 } })
    .png({ palette: true, colours: PALETTE_ENTRIES, effort: 10 })
    .toFile(variant.file)

  return statSync(variant.file).size
}

async function main() {
  // trim() removes the transparent padding. The master's ink fills only 42.4% of its 500×500
  // canvas vertically (212/500), which is why an h-16 box renders a 27px wordmark today. Trimming
  // alone therefore buys a 2.36x optical increase at identical CSS height — the "logo is too
  // small" defect is solved by removing padding, not by growing the box (ADR-004).
  const { data, info } = await sharp(SOURCE)
    .trim()
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  const { width, height } = info
  const aspect = width / height
  const failures: string[] = []

  console.log(`source   ${SOURCE} → trimmed ${width}x${height}`)

  if (Math.abs(aspect - EXPECTED_ASPECT) > ASPECT_TOLERANCE) {
    failures.push(
      `aspect ${aspect.toFixed(4)} != ${EXPECTED_ASPECT} (§25.2 — re-deriving the asset requires a doc update)`
    )
  }

  if (height < MIN_3X_HEIGHT) {
    failures.push(`trimmed height ${height}px < @3x of the largest optical size (${MIN_3X_HEIGHT}px)`)
  }

  for (const variant of VARIANTS) {
    const bytes = await derive(variant, data, width, height)
    const ok = bytes <= MAX_BYTES
    console.log(
      `derived  ${variant.file} → ${width}x${height}, ${(bytes / 1024).toFixed(2)}KB `
      + `${variant.token} ${ok ? '✔' : '✘'}`
    )
    if (!ok) {
      failures.push(`${variant.file} is ${(bytes / 1024).toFixed(2)}KB > 8KB (Appendix A.7)`)
    }
  }

  console.log(`aspect   ${aspect.toFixed(4)} (--logo-aspect: ${EXPECTED_ASPECT} / 1)`)

  if (failures.length > 0) {
    console.error(`\n✘ Phase 2 gate failed (§38.4):\n - ${failures.join('\n - ')}`)
    process.exit(1)
  }

  console.log('\n✔ Phase 2 gates: size ≤ 8KB each, aspect 2:1 (§38.4)')
}

await main()
