# Homepage density & scroll rhythm

Why the homepage was restructured, what moved, and the numbers it was judged against.

Scope: layout only. No copy was removed, no colour, type scale, radius, icon, image or motion
token changed. `company.tagline` and every section's text are intact — the reduction is
structural.

---

## 1 · The problem, measured

Production build, Chromium, VI locale, reveal animations forced complete.

| Viewport | Document height | In viewports |
| --- | --- | --- |
| 1366×768 | 7437px | 9.68 |
| 1440×900 | 7437px | 8.26 |
| 1920×1080 | 7557px | 7.00 |
| 834×1112 | 10874px | 9.78 |
| 390×844 | 12549px | 14.87 |

Four findings drove the work.

**F1 — the hero was never smaller than the viewport, on any screen.**
`--hero-min-h: max(100svh, 60rem)` put a 960px floor under a 768px laptop viewport. The next
section began at scroll offset 960px (viewport 1.25); at 1920×1080 it began at *exactly*
viewport 1.00. There was no desktop size where any of it was visible.

**F2 — home was paying another page's floor.**
The 60rem is a measured value, but it is measured across the six shared `<AppHero>` cover
pages, and the tallest of those is `/gioi-thieu` at **839.2px** — not home, at **709.4px**.
Home does not render `AppHero` at all; it is a bespoke cover (§30.1). It inherited a floor
sized by copy on a different page.

**F3 — the floor took a global worst case for a per-breakpoint invariant.**
The contract is `floor ≥ max(content height)`, and that maximum occurs at **320px in EN**
(909.9px), because the headline wraps hardest when narrowest. A single global token therefore
made every desktop inherit a floor derived from a phone.

**F4 — 224px of dead space at every section boundary.**
`--section-py-md` is `padding-block`, so the gap *between* two sections is twice the token.
Six boundaries × 224px ≈ 1.75 laptop viewports of nothing. Uniform, so nothing in the rhythm
signalled which sections were related.

Plus two ordering problems: **Services** — "what does this company do" — was the fifth section,
starting at viewport 4.66; and **Factory capability** and **Machinery** were sections 2 and 6,
four apart, despite being one argument.

---

## 2 · What changed

### Information architecture

```
before                          after
──────                          ─────
Hero                            Hero
Factory capability              Services            ← was 5th
Featured projects               Featured projects   ← was 3rd
Production workflow             Factory capability
Services                          + Machinery       ← merged, were 2nd and 6th
Machinery                       Production workflow
CTA                             CTA
```

- **Services first.** Orientation precedes proof. It was answered fifth.
- **Projects second.** It is the evidence for the claim immediately above it.
- **Capability + machinery merged.** One argument — "we control schedule, quality and cost
  because we own the plant, and here is the plant." Split, the claim sat at the top of the page
  and its evidence ~3,000px below. Machinery alone was also the largest section on the page
  (1189px) while being the most granular content on it. Merged, the capability cards are the
  claim and the machinery block is the proof, under one heading, separated by `mt-14` rather
  than a 176px section boundary. Headings step h2 → h3 → h4 so machinery is subordinate in the
  document outline, not a peer.
- **Process last before the CTA.** "How do you work" is asked once a company is already
  credible.

Colour bands were reassigned so the new order still alternates and no two identical surfaces
ever touch: white → ink-50 → white → ink-950 → wood-50.

### The hero

The metrics band now has **one placement**, below the hero, at every breakpoint. It previously
rendered inside the hero at lg+ and below it under lg.

This is the enabling change, and it is a layout contract rather than styling. The hero
photograph is `absolute inset-0 h-full object-cover`, so its box height follows the hero's
*content* height. Inside the hero the band added 138px at lg+, which pushed home's content from
709.4px to 923.4px — and that is what forced the floor up in the first place. One render site
also retires the dual-placement contract, so the two can no longer disagree.

`--hero-min-h-home` is then tiered against home's own measured content, both locales:

| Width | Max content | Floor | Headroom |
| --- | --- | --- | --- |
| < 360px | 909.9px (320, en) | 59rem = 944px | +34.1 |
| 360–767px | 805.1px (414, en) | 52rem = 832px | +26.9 |
| ≥ 768px | 709.4px (1280, en) | 46rem = 736px | +26.6 |

The svh term drops to `78svh` at md+ so the fold stops landing on the hero's bottom edge.
Below md it stays `100svh`: a phone hero shorter than the screen reads as broken, not generous.

The shared `--hero-min-h` is **untouched**, so the other six cover heroes move 0px.

Supporting trims, none of which remove content: hero padding `pt-32/pb-12 md:pb-18` →
`pt-28/pb-10 md:pb-12`, the CTA gap `mt-9` → `mt-8`, and a wider headline measure
(`max-w-5xl` → `max-w-6xl`) so the EN headline wraps less at the same font size.

### Rhythm

`--section-py` 80 → **64px**, `--section-py-md` 112 → **88px** (boundary 224 → 176px). Applied
at the token, site-wide: a homepage with a different rhythm from `/du-an` would re-create the
two-system divergence ADR-001 and the single `.shell` exist to prevent (§26.7).

Still deliberately generous. The brief was "too far apart"; the answer to that is not "tight".

### Tablet

The featured-projects grid was `lg:grid-cols-3` with no `md:` step, so it stayed single-column
from 0 to 1023px. At 834px that stacked three cards into a **2737px** section. Adding
`md:grid-cols-2` alone removed 1278px from the tablet page. The image `sizes` already declared
`md:50vw`, so it had been describing a layout the grid never produced.

---

## 3 · Result

| Viewport | Before | After | Δ |
| --- | --- | --- | --- |
| 1366×768 | 7437px (9.68 vp) | 6966px (9.07 vp) | −471px |
| 1440×900 | 7437px (8.26 vp) | 6966px (7.74 vp) | −471px |
| 1920×1080 | 7557px (7.00 vp) | 7073px (6.55 vp) | −484px |
| 834×1112 | 10874px (9.78 vp) | 8935px (8.04 vp) | **−1939px** |
| 390×844 | 12549px (14.87 vp) | 12160px (14.41 vp) | −389px |

Hero height, and where the next content starts:

| Viewport | Hero before → after | Next content at viewport |
| --- | --- | --- |
| 1366×768 | 960 → **736px** | 1.25 → **0.96** |
| 1440×900 | 960 → **736px** | 1.07 → **0.82** |
| 1920×1080 | 1080 → **842px** | 1.00 → **0.78** |
| 834×1112 | 1112 → **867px** | 1.00 → **0.78** |
| 390×844 | 960 → **844px** | 1.14 → **1.00** |

The scanning gain is larger than the length gain. Within the first three viewports at
1366×768 a visitor now sees the hero, the four-metric proof band, **all six service cards**,
and the featured-projects heading with its first cards. Before, the same three screens showed
the hero, four factory-capability cards, and a heading.

### Known limit

At 1366×768 the hero is 736px against a 768px viewport — 96%, leaving 32px of the metrics band
visible. Home's hero content is 709.4px at that width, so with the copy preserved this is close
to the floor of what layout alone can do. Going meaningfully below it means shortening the
headline, the tagline or the lead paragraph, or reducing the `--text-hero` clamp maximum — all
of which are copy or type decisions, deliberately out of scope here. 1440×900 and above have
comfortable clearance (164px and 238px).

---

## 4 · What protects this

`tests/e2e/hero.spec.ts` — the cover-hero floor invariant, previously documented in a comment
and guarded only by screenshots. Screenshots are not protection here: rebaselining is a routine
approved act (§41 P6), so a regression landing beside a legitimate layout change is baked into
the new baseline and disappears.

- **G1** the floor binds — rendered hero height never exceeds the computed floor
- **G2** the `object-fit: cover` scale is identical in both locales

Run across all seven cover heroes; home additionally at both of its tier boundaries (360, 768),
since a tiered value can only fail at a boundary. 320px is included because it is the *binding*
case, not for coverage.

The gate was verified to fail: temporarily lowering the floor to 30rem reproduces the original
regression exactly (1440×900, hero vi 900px vs en 923.39px).

### If you change the hero

Re-measure and re-tier. The floors above are only valid while the metrics band stays **outside**
the hero and the hero copy and `--text-hero` are unchanged. Neutralise the floor
(`--hero-min-h-home: 0`), measure section height across 320–1920 in both locales, take the
maximum per tier, add ~25px of cross-engine headroom.

### Two traps worth knowing

Both cost real time during this work.

1. **A stale prod server serves an unstyled page.** A Nitro server started *before* a rebuild
   keeps an in-memory asset index, and then 404s the very `entry.<hash>.css` now sitting on disk
   under that exact name. The page renders with no Tailwind — and it does not look broken in the
   numbers, it looks like a plausible layout that is simply much taller (13911px vs 7094px,
   every section padding 0). Always restart the server after building. The measurement harness
   now refuses to run if `.section-y` has zero padding.

2. **Stray `nuxt dev` processes bind port 3000 alongside the prod server**, so a test suite
   silently measures an on-demand-compiling dev server. This presented as 120s timeouts and a
   9.9-minute gate run; with the strays killed the same 16 tests run in 11.4s.

---

## 5 · Follow-ups, not done here

- **Section-header gaps are still hardcoded**: `mb-12` / `mt-12` appears 21 times across 7
  pages. It is a genuine repeated pattern and belongs in a token, but tokenising it touches
  every page and was out of scope for a homepage pass.
- **The other six cover heroes are still 960px minimum**, now for their own measured reason
  (`/gioi-thieu` at 839.2px) rather than home's. The same tiering would help them; it needs its
  own measurement pass per page.
- **The hero `sizes` attribute is unchanged.** The floor dropped, so the requirement relaxed
  rather than tightened and no variant is upscaled — but there is now headroom to serve a
  smaller LCP image. That is a media-pipeline change (Appendix D) and would move LCP.
