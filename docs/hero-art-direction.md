# Hero Art Direction — Lai Huy Interior
A **long-term design system**, not a one-off spec. It governs how every page hero is
conceived, composed, reviewed, and retired. Future contributors should be able to
read this and understand the *reasoning*, then produce a hero that belongs to the
same publication — even for photography that does not exist yet.

Status: **frozen engineering specification** (implementation pending approval). Nothing here is
optional; each rule is a **review gate** (see §11).

> **Companion document:** [`header-footer-art-direction.md`](./header-footer-art-direction.md)
> governs the chrome *around* every cover — and it is **superordinate** on four shared concerns:
>
> | Concern | Owner |
> |---|---|
> | Rendering budget (**screen-wide**, not per-hero) | chrome doc §12 / ADR-006 — **supersedes §9 below** |
> | Alignment rail (`.shell`) | chrome doc ADR-001 — the hero **adopts** it; see §18 |
> | Design tokens (no magic numbers) | chrome doc §25 |
> | Animation ownership | chrome doc §27 |

### The determinism rule

> **Implementation contains no design decisions.** Where this document previously said
> *evaluate*, *judge*, or *pick*, it now specifies a **computed threshold**. Image score, mode,
> atmosphere and focal are **outputs of `scripts/hero/analyze.ts`** (§19) — not opinions.
>
> An implementer who has to *decide* something has found a **defect in this spec**. Raise it;
> do not exercise taste.

Prose here that reads as judgement (*"cinematic"*, *"quiet luxury"*) is **rationale, never
criteria.** Only numbers, tokens and scripts are criteria.

---

## 1. Brand Visual DNA

The north star for every hero.

- **Visual keywords:** editorial, architectural, cinematic, warm, grounded, spacious, precise.
- **Emotional keywords:** trust, craftsmanship, calm confidence, quality, permanence.
- **Never looks like:** a corporate SaaS banner, a stock-photo carousel, a discount
  promo, a cluttered brochure, a neon/gradient tech landing page, a template with a
  dark box of text over a random image.
- **Acceptable drama:** low–moderate. Depth and light, never theatrics. No dramatic
  color grading, lens flares, or heavy vignettes.
- **Acceptable luxury:** high, but *quiet* luxury — restraint, whitespace, materials,
  and light. Never ostentatious.
- **Photography personality:** real spaces and real production; natural warm light;
  honest materials; one clear subject; generous negative space; architectural, not
  "lifestyle."

## 2. Design philosophy (mandatory principles)

1. **Narrative-first.** Every hero tells *one story*, understandable with zero scroll.
   Document per page: what the visitor understands, why this image, why this headline (§10).
2. **One emotion per hero** (§ emotion map, §10).
3. **Editorial cover, not banner.** Cinematic composition, generous whitespace, strong
   type hierarchy.
4. **Typography belongs to the image** — integrated via placement + spacing + a
   *localized* scrim, never a full-frame dark panel.
5. **Negative-space-driven placement.** Compose around the image; place type in the
   photograph's natural quiet zone; per-image `focal`/`anchor`.
6. **Depth, not darkness.** Build hierarchy with spacing, soft shadow, one atmospheric
   gradient, and layered planes — never by raising overlay opacity.
7. **Responsive recomposition.** Desktop/tablet/mobile are each composed on purpose
   (focal, anchor, crop, type), never a scaled desktop.
8. **Emotion before information.** Reading order: atmosphere → headline → supporting
   copy → proof → CTA.
9. **Reading pace.** Whitespace is hierarchy: atmosphere → *pause* → headline → *pause*
   → copy → *pause* → CTA. Gaps are intentional and unequal.
10. **Silence / subtractive.** Every layer must justify itself; if removing it improves
    clarity, remove it. Empty space is a tool, never filled just because it exists.
11. **Story hierarchy.** One primary message; the headline is the unmistakable focal
    point; secondary info demotes to supporting layers or below the fold.
12. **Visual-weight hierarchy:** headline → subject → CTA → subtitle → eyebrow → chips →
    decoration. No two adjacent elements compete for equal attention.
13. **Image ownership.** Each top-level page owns a distinct signature image. Reuse must
    be documented with a reason.
14. **Light direction.** Headline sits where the photo is naturally *darker*; type works
    with the light, never fights it with overlays.
15. **Editorial rhythm.** Compositions vary, but spacing, typography, alignment, and
    vertical rhythm are identical site-wide — different covers, one publication.
16. **Glass principle.** Glass is never a readability rescue; it is only an information
    container (metrics/facts/chips/nav), never the primary text background.
17. **Poster test & logo-removal test** are pass/fail gates (§11).

## 3. The hero workflow pipeline

```
Image Analysis
  → Image Quality Gate (§5)        reject/replace unsuitable photos
  → Image Selection Matrix (§6)    objectively rank candidates
  → Mode Derivation (§7)           mode is an OUTPUT, not a choice
  → Atmosphere Selection (§8)
  → Focal / Anchor (per image, per breakpoint)
  → Poster Test  (single eye path, no competing focals)
  → Logo-Removal Test  (still bespoke editorial?)
  → Hero-to-Section Continuity (§13)
  → Design Review (§11, all gates)  → merge, or Recovery Sequence (§12)
```

## 4. Emotion map

| Page | Emotion |
|---|---|
| Home | Inspiration |
| About | Trust |
| Factory | Capability |
| Services | Expertise |
| Projects (list) | Proof |
| Project detail | Craftsmanship |
| Contact | Conversation |
| Recruitment | Culture |

## 5. Image Quality Gate — **hard gates (computed)**

Run **before** composing. Every gate is measured by `scripts/hero/analyze.ts` (§19). Composition
must never compensate for an unsuitable photograph.

### 5.1 Hard rejects — any single failure rejects the image, regardless of score

| # | Gate | Threshold | Measurement |
|---|---|---|---|
| **G1** | Usable width | **≥ 1600px** | Intrinsic width |
| **G2** | **Quiet zone exists** | ≥ **20%** of frame area is a contiguous region with local luminance σ **≤ 12** (0–255) | 32×32px tile grid; 4-connected region growing |
| **G3** | Single dominant subject | **≤ 1** saliency region occupying **> 20%** of frame | Saliency map, thresholded |
| **G4** | Exposure | Clipped highlights **< 5%** of pixels (L > 250); crushed shadows **< 5%** (L < 5) | Histogram |
| **G5** | Headline legibility | Composited contrast of the headline over its placement region **≥ 4.5:1** *(large text: ≥ 3:1)* after §12 recovery | Pixel sampling |
| **G6** | Chrome legibility | Nav **≥ 4.5:1**, logo **≥ 3:1** over the top `--header-scrim-h` band | Chrome doc **O2** |

> **G6 is new and is not negotiable.** A photograph now has to carry the *header* as well as the
> headline. An image that passes G1–G5 and fails G6 is **still a reject** — see chrome doc §21.0
> (never deepen the global scrim to rescue one photograph).

### 5.2 Score

```
raw   = Σ (rating(0–5) × weight)          max = 110
score = round(raw / 110 × 100)            → 0–100
```

| Score | Verdict | Action |
|---|---|---|
| **≥ 85** | **Use** | Auto-approved. No discussion |
| **70 – 84** | **Manual approval required** | Must be signed off **and the reason recorded in `HeroMeta.approval`** (§10). A hero at 70–84 without a recorded approval is a **merge blocker** |
| **< 70** | **Reject** | Replace. Not recoverable by composition |

### 5.3 Scoring rubric — objective anchors

Ratings are **measured**, not felt. `0`, `3` and `5` are defined; `1`, `2`, `4` interpolate.

| Criterion | W | `5` | `3` | `0` |
|---|---|---|---|---|
| **Subject clarity** | 5 | Exactly 1 saliency region, **25–60%** of frame | 1 region, `<25%` or `>60%` | ≥ 2 regions each `>20%` |
| **Quiet zone** | 5 | ≥ **35%** of frame, σ ≤ 12, contiguous | **20–34%** | `< 20%` → **G2 reject** |
| **Narrative fit** | 4 | Matches the page's §4 emotion **and** shows the page's subject matter | Matches one of the two | Matches neither |
| **Light direction** | 3 | Quiet zone mean L **≤ 90** (type sits in natural shadow) | Quiet zone mean L **91–150** | Quiet zone mean L **> 150** (type must fight the light) |
| **Composition** | 3 | Dominant lines converge **toward** the type anchor (±30°) | Neutral | Lines lead **away** from the anchor |
| **Resolution** | 2 | ≥ 2400px | 1600–2399px | `< 1600px` → **G1 reject** |

### 5.4 Current verdicts

| Page | Gate | Score | Verdict |
|---|---|---|---|
| About, Factory | pass | — | **Use** |
| Home, Projects | pass | — | **Use** *(previously "marginal" — a non-verdict. Re-score with §5.2; if 70–84, record the approval)* |
| Services, Contact, Recruitment | **fail** | `< 70` | **Reject → replace** (busy renders / competing subjects / no quiet zone) |

> "Pass (marginal)" was a taste hedge. It is abolished. An image is **Use**, **Manual approval**,
> or **Reject** — there is no fourth state.

## 6. Image Selection Matrix

When multiple candidates exist, **the highest §5.2 score wins.** No exceptions, no override.

| Criterion | Weight |
|---|---|
| Subject clarity (one dominant element) | 5 |
| Usable negative space / quiet zone | 5 |
| Narrative fit (tells the page's story) | 4 |
| Light direction (usable dark zone for type) | 3 |
| Composition (leads eye subject → headline) | 3 |
| Resolution / technical quality | 2 |

**Ties** (equal score) break in this order — deterministically, never by preference:

1. Higher **quiet-zone** rating
2. Higher **subject-clarity** rating
3. Higher resolution
4. **Image not already used elsewhere on the site** (§13 image ownership)

Record the full matrix and the final score in the chosen image's metadata (§10).

## 7. Derived modes — **computed, not chosen**

Mode is an **output**. It is never a style preference.

```
D = count of populated slots among:
    { topic, title, specialTitle, subtitle, actions,
      breadcrumb, chips, meta, aside }          → 0…9

Q = quiet-zone area, % of frame (§5.1 G2)

mode = caption   if  D ≥ 5  OR  Q < 30
     = offset    otherwise
```

| | `offset` | `caption` |
|---|---|---|
| Condition | `D ≤ 4` **and** `Q ≥ 30%` | `D ≥ 5` **or** `Q < 30%` |
| Type placement | In the quiet zone | Organised editorial caption block |
| Gradient | 1 | 1 |
| Glass | **0** | **0** |

**`glass` is not a mode.** It is a single info-container bridge (§13, chrome doc §26.6) and may
never be a text background.

**Re-derivation is mandatory.** If an image is swapped, `D` changes, or the shell changes, the
mode is **recomputed** — a page's mode is never inherited. `scripts/hero/analyze.ts` emits it;
a hand-set `mode` prop that disagrees with the computed value is a **build failure**.

## 8. Atmosphere — **computed, not chosen**

```
meanL  = mean luminance of the image           (0–255)
warmth = mean(R) − mean(B)                     (−255…255)

atmosphere = dark     if  meanL < 60
           = warm     if  warmth ≥ 20
           = neutral  otherwise
```

Evaluated **in that order** — `dark` wins over `warm`.

| Atmosphere | Scrim | Glass tint | Derives from |
|---|---|---|---|
| `warm` | `wood-950` | warm | `warmth ≥ 20` (wood/oak interiors) |
| `neutral` | `ink-950` | cool | otherwise (concrete/industrial) |
| `dark` | `ink-950` | cool | `meanL < 60` |

**Atmosphere is the only per-hero colour lever. No new colours.** The primary CTA stays the wood
primary.

> ### Correction — the kicker is `wood-200`, not `wood-300`
>
> This section previously read *"Kicker stays `wood-300`"*, which **contradicted §11's own review
> finding** — `wood-300` was **measured at 3.87:1** over warm/light photography and **fails** the
> 4.5:1 requirement. `wood-200` measured 5.84:1 / 5.45:1 / 4.81:1 and is what ships.
>
> **The kicker is `wood-200`.** The contradiction is resolved here in favour of the measurement.
> Do not "restore" `wood-300` for brand consistency — it is an accessibility fix, and `wood-200`
> is the same accent one step lighter.

## 9. Rendering budget

> **Superseded by [`header-footer-art-direction.md`](./header-footer-art-direction.md) §12 /
> ADR-006.** The budget below is **per-hero** and does **not compose** — the header and the hero
> can each satisfy it while stacking two backdrop blurs on one screen. The chrome doc's
> **screen-wide** budget is normative.

**Per hero (subordinate):** ≤ 1 localized gradient · ≤ 1 glass surface · ≤ 1 image transform ·
**0 backdrop blurs in the hero itself.**

**Screen-wide (normative, chrome doc §12):**

- **≤ 1 backdrop blur on screen at any moment.**
- Chrome layers must be **complementary** (`α_scrim + α_glass ≤ 1`), never additive.
- **0 blur on the cover** — therefore 0 blur on the LCP frame.

**Consequence for the Hero Bridge:** a glass `#aside` bridge and the glass header may **never**
be visible simultaneously. They are separated by scroll position — and this is **asserted**
(chrome doc **V14**), not assumed.

## 10. Per-hero art direction + metadata

Each hero carries a non-rendered metadata object (for maintainability and future
redesigns). Shape:

```ts
type HeroMeta = {
  page: string
  narrative: string        // what the visitor understands with zero scroll
  emotion: string
  dominantSubject: string
  quietZone: string
  atmosphere: 'warm' | 'neutral' | 'dark'
  focal: string            // object-position, may be responsive
  anchor: string
  mode: 'offset' | 'caption'   // derived
  lightDirection: string
  visualPath: string       // subject → headline → CTA
  exit: string             // §13
  imageOwnership: string   // signature image + reuse note if any
}
```

| Page | Image (signature) | Subject | Quiet zone | Focal / Anchor | Mode (derived) | Atmosphere | Light → type | Narrative |
|---|---|---|---|---|---|---|---|---|
| Home | flagship interior (distinct; see note) | furniture composition (center/right) | left cabinet wall | `48% 45%` / center-left | offset | warm | window R → type on darker left | "Warm, complete, high-end interiors." |
| About | `company/workshop/3` | machinery hall depth | lower-left floor | `50% 40%` / bottom-left | offset | neutral | skylights top → type lower-left | "A real factory, not just a studio." |
| Factory | `company/workshop/4` | lit roll-up door | lower-center floor | `50% 48%` / bottom-left | offset | neutral | door light center → type lower-left | "Serious in-house capability." |
| Services | `projects/codi-boutique-hotel/sanh-don/2.webp` | staircase + interior garden | left wall / foreground | `55% 45%` / bottom-left | offset | warm | window right → type on darker left | "End-to-end interior services, expertly done." |
| Projects | `projects/codi-villa-phan-thiet/1.webp` | perspective → kitchen | darker foreground-left | `50% 42%` / bottom-left | caption | dark | rear window → type on darker left | "Proof — real delivered work." |
| Project detail | the project's own cover | per project | per project | per-project; portrait → top-biased | caption | per project | per project | "This project's craftsmanship." |
| Contact | `projects/nha-vuon-chily/5.webp` | classical living room | shadowed left | `50% 42%` / bottom-left (compact) | offset | warm | windows right → type on darker left | "Start a conversation." |
| Recruitment | `company/workshop/5.webp` | production hall | darker lower-left floor | `50% 40%` / bottom-left | offset | neutral | roof light center → type lower-left | "Join a real production culture." |

**Notes.** *Home ownership:* the Eo Gio cover is also that project's detail hero — give
Home a distinct flagship frame, or document the reuse. *Recruitment:* must differ from
About/Factory; `companyStory` best fits "Culture" (note its ~900px resolution tradeoff).
*Services/Contact/Recruitment images* are chosen with the §6 matrix on view; their
`focal`/`anchor`/`light` are finalized then.

## 11. Design Review Checklist (all gates; a hero merges only when every box passes)

- [ ] **Narrative statement** written; hero is understandable with zero scroll
- [ ] **One primary message**; headline is the unmistakable focal point
- [ ] **Visual-weight order** correct; no equal-weight neighbors
- [ ] **Visual hierarchy** — single entry point; eye order kicker→headline→copy→proof→CTA
- [ ] **Reading pace** — intentional whitespace between stages
- [ ] **Subtractive** — every layer justified
- [ ] **Image quality gate** passed (§5)
- [ ] **Image ownership** — distinct signature (or documented reuse)
- [ ] **Light direction** — type in the naturally darker zone
- [ ] **Architectural integrity** — type never covers entrances, furniture, staircases, branding, or people
- [ ] **Readability** — legible over the actual composited region, not via heavy overlay
- [ ] **Intended emotion** matches the page
- [ ] **Atmosphere** tokens applied
- [ ] **Rendering budget** not exceeded (§9)
- [ ] **Responsiveness** — desktop/tablet/mobile each intentionally composed
- [ ] **WCAG AA** — measured ≥ 4.5:1 body / ≥ 3:1 large over the composited region
- [ ] **Reduced-motion** — fully premium with motion disabled; content visible without JS
- [ ] **Poster test** — single eye path, no competing focals
- [ ] **Logo-removal test** — still bespoke editorial, not a template
- [ ] **Hero exit** — continuity choreographed (§13)
- [ ] **Single LCP fetch** — one hero image request (eager + `fetchpriority=high`, no preload double-fetch)
- [ ] **Editorial rhythm** — spacing/type/alignment consistent with the system

### Review findings from the first build (keep these lessons)

1. **`wood-300` fails AA as a kicker over warm/light photography** (measured 3.87:1 against
   the required 4.5:1). The hero eyebrow uses **`wood-200`** (measured 5.45:1 on Services,
   4.81:1 on Contact). Do not revert it to `wood-300` for "brand consistency" — it is a
   measured accessibility fix, and `wood-200` is the same accent one step lighter.
2. **`bottom-center` anchoring is unsafe on frames with a bright, busy middle.** Both
   Recruitment and Projects initially placed centered type over the architecture (doorway /
   dining table) and failed the poster + architectural-integrity gates. Recovery step 2
   (adjust anchor → `bottom-left`) resolved both. Prefer a bottom-left offset unless the
   photograph has a genuinely calm centre.

## 12. Recovery sequence (when a gate fails)

Apply in order, least-invasive first; re-run the checklist after each; stop at the first
pass; record which step resolved it.

1. Adjust **focal** (`object-position`)
2. Adjust **anchor** (type placement)
3. Refine **crop** (focal + `size`/height)
4. Switch **mode** (offset ↔ caption)
5. **Replace the hero image** — last resort only

## 13. Hero exit choreography (per hero)

Never a hard cut. Define per hero: **fade** (bottom edge resolves into the next
section's tone), **overlap** (metrics/facts straddle the seam with `-mt` + soft shadow),
**rhythm** (shared `section-shell` alignment continues), **image persistence** (bottom
atmosphere carries into the section background), **section reveal** (first section's
`v-reveal` timing continues the sequence). Examples: Home → glass metrics overlap into
the capability band; Project detail → hero chips *become* the facts strip; About → ground
tone carries into the "Who we are" split.

## 14. Photography direction (for future shoots)

Improve future photos, not only today's selection.

- **Focal length:** ~24–35mm equivalent for rooms (natural perspective, minimal
  distortion); ~50mm for detail/craft.
- **Framing:** one dominant subject; deliberately leave a **quiet zone** (a wall, floor,
  or ceiling band) for typography.
- **Negative space:** compose with ~⅓ of the frame calm; avoid filling every corner.
- **Lighting:** natural, warm, directional; expose for highlight retention; keep one
  side/zone darker for type. No harsh mixed color temperatures.
- **Composition:** lead the eye with lines/perspective toward the intended headline
  zone; avoid symmetric two-subject frames.
- **Architectural storytelling:** show materials, craft, scale, and real production;
  prefer honesty over staged lifestyle.

## 15. Hero lifecycle (living content)

Heroes are reviewed periodically and replaced when: stronger photography exists; the
page's narrative changes; a homepage/brand refresh occurs; or branding evolves. On any
replacement, re-run the full pipeline (§3) — including **mode re-derivation** (§7). Hero
selection is living content, not a fixed asset.

## 16. Success metrics (validate design with behaviour)

After launch, evaluate hero effectiveness with: **scroll depth** past the hero, **CTA
click-through** from the hero, **engagement/time** on page, and periodic **qualitative
review** against this document. Design quality is confirmed by real behaviour, not
assertion.

## 17. `AppHero` API reference

```ts
type AppHeroProps = {
  image: MediaImage
  eyebrow?: LocalizedText          // "topic"
  title: LocalizedText
  specialTitle?: LocalizedText
  subtitle?: LocalizedText
  mode?: 'offset' | 'caption'      // DERIVED (§7) — not a free style choice
  atmosphere?: 'warm' | 'neutral' | 'dark'
  anchor?: string                  // responsive, e.g. 'bottom-left' | 'lg:center-left'
  focal?: string                   // responsive object-position
  size?: 'cover' | 'tall' | 'compact'
  eager?: boolean                  // LCP hero → true (single fetch, fetchpriority high)
}
// Slots: #breadcrumb  #chips  #meta  #actions  #aside(glass bridge)
```

The component enforces the rendering budget (§9) and the atmosphere tokens (§8); the
mode/atmosphere/focal/anchor for each page come from §10.

---

## 18. Alignment — the hero adopts the shared rail

**Consequence of chrome doc [ADR-001](./header-footer-art-direction.md#adr-001--shell-geometry).**

The site had two conflicting shell systems. The hero used `section-shell px-6` (padding *inside*
the max-width); body sections used `section-spacing` + `section-shell` (padding *outside*). They
resolved to **different left edges and different measures** — so on desktop **the hero headline
sat 24px right of every section title beneath it.**

`AppHero` now adopts the canonical `.shell`. The measurable consequences:

| Viewport | Hero text moves | Hero measure |
|---|---|---|
| 390px | **0px** | unchanged |
| 768–1280px | **+8px** (right) | 1216px |
| ≥ 1440px | **−24px** (left) | 1232 → **1280px** (+48px) |

> ### This invalidates the tuning in §10 — re-run the gates
>
> The compositions in §10 were tuned with the headline at its **old** position. Moving it up to
> 24px left and widening it by 48px means **a headline that previously sat in a photograph's
> quiet zone may now sit 24px into the subject.**
>
> After the shell migration, the following are **mandatory** on **all 8 heroes**:
>
> - **§5.1 G5** — headline contrast over its *new* composited region
> - **§11** — architectural integrity (type must not cover entrances, furniture, stairs, people)
> - **§11** — poster test
> - Recompute `Q` (quiet zone under the new anchor) → **re-derive `mode`** per §7
>
> Any failure routes through **§12**, least-invasive first. This is a **blocking row** in the
> chrome doc's Definition of Done (§24, row 6).

## 19. `scripts/hero/analyze.ts` — the source of truth for every derived value

Taste is replaced by a committed script. Given an image path, it emits:

```ts
type HeroAnalysis = {
  // Hard gates (§5.1)
  width: number                  // G1
  quietZonePct: number           // G2 — % of frame, σ ≤ 12
  quietZoneBox: [x, y, w, h]     // largest contiguous quiet region, % units
  quietZoneMeanL: number         // light-direction rating input
  salientRegions: number         // G3 — count occupying > 20%
  clippedHighlightPct: number    // G4
  crushedShadowPct: number       // G4

  // Derived (§5.2, §7, §8)
  score: number                  // 0–100
  verdict: 'use' | 'manual' | 'reject'
  mode: 'offset' | 'caption'     // §7 — computed from D + Q
  atmosphere: 'warm' | 'neutral' | 'dark'   // §8 — computed from meanL + warmth
  focal: string                  // object-position centring the dominant subject
  anchor: Anchor                 // the quiet zone's quadrant
}
```

**Rules.**

1. `mode`, `atmosphere`, `verdict` and `score` are **computed**. A prop that disagrees with the
   computed value is a **build failure**, not an override.
2. `focal` and `anchor` are **computed defaults**. A manual override is permitted **only** with a
   recorded reason in `HeroMeta.overrideReason` — typically because §12 recovery moved it.
3. Re-run on **every** image swap, **every** content-density change, and after the §18 shell
   migration.

### `HeroMeta` — extended (supersedes the shape in §10)

```ts
type HeroMeta = {
  // …all existing fields…
  score: number                    // §5.2
  verdict: 'use' | 'manual'        // 'reject' may never ship
  approval?: string                // REQUIRED when verdict === 'manual' (score 70–84)
  overrideReason?: string          // REQUIRED when focal/anchor differ from computed
  chromeContrast: {                // §5.1 G6 — the header must survive this cover
    nav: number                    // ≥ 4.5
    logo: number                   // ≥ 3.0
  }
}
```

A hero with `verdict: 'manual'` and **no `approval` string** is a **merge blocker**. That is the
entire mechanism preventing "pass (marginal)" from creeping back in.

## 20. Ownership — deferred to the chrome doc

To avoid two sources of truth, the hero's contracts live in the chrome document.

| Concern | Where |
|---|---|
| `AppHero` component contract (responsibilities, non-responsibilities, public API, **forbidden knowledge**) | chrome doc **§26.2** |
| Hero Bridge (`#aside`) contract | chrome doc **§26.6** |
| Animation ownership — hero zoom, content reveal | chrome doc **§27** |
| Design token freeze — no magic numbers | chrome doc **§25** |
| Implementation constraints — what may not change | chrome doc **Appendix D** |

**The two contracts that matter most, restated here because violating them is silent:**

> `AppHero` **may not** import `useHeaderState`, read `--header-p` / `--header-shift`, or know
> whether the header is transparent, hidden or solid.
>
> `AppHero` **must** uphold **I9**: it renders a dark cover. That is the *only* promise the
> header relies on — and the reason the header can be transparent at all.

**Animations owned by the hero, and by nothing else:**

| Animation | Owner | Never touched by |
|---|---|---|
| Hero image zoom (`.hero-image`, one-shot) | `AppHero` (CSS keyframe) | Chrome, JS, scroll |
| Hero content reveal (`v-reveal`) | `plugins/reveal.ts` (IntersectionObserver) | `useHeaderState`, `AppHero` |
| The hero scrim | `AppHero` | The header — which owns its **own** scrim (`--scrim-chrome`) |

> The hero scrim and the chrome scrim are **two different layers with two different owners**,
> and that is deliberate. The hero's scrim protects the **headline**; the chrome's protects the
> **nav**. Merging them would couple the components (chrome doc §26) and re-break the budget.

---

## 21. The hero registry — typed, validated, single source of truth

### 21.1 The problem it solves

Today `focal`, `anchor`, `mode` and `atmosphere` are **literal strings scattered across 8 page
templates** (`focal="50% 42%"`, `mode="caption"`). That is three defects at once:

1. **Magic numbers in pages** — violates the token freeze (chrome doc §25).
2. **`HeroMeta` is prose, not a type** — §10 described "a non-rendered metadata object". Nothing
   enforces it, so nothing has ever validated it.
3. **It invites page-specific conditionals** in `AppHero` — the exact thing §22 forbids.

One registry fixes all three: **`app/data/heroes.ts`**.

### 21.2 Types — `app/shared/types/hero.ts` (types only; safe to import from components)

```ts
export type Anchor     = 'bottom-left' | 'bottom-center' | 'center-left'
export type HeroMode   = 'offset' | 'caption'
export type Atmosphere = 'warm' | 'neutral' | 'dark'
export type HeroSize   = 'cover' | 'tall' | 'compact'

/** §23 — the semantic focal vocabulary. New heroes MUST use one of these. */
export type FocalToken =
  | 'center'      | 'upper'       | 'upper-mid'   | 'lower-mid'  | 'lower'
  | 'left-mid'    | 'right-mid'   | 'left-upper'  | 'right-upper'

/**
 * A precise object-position. BRANDED: constructible only from the output of
 * scripts/hero/analyze.ts. It cannot be hand-typed — that is the point (§23).
 */
export type ComputedFocal = string & { readonly __computedFocal: unique symbol }

export type Focal = FocalToken | ComputedFocal

/** Exactly what AppHero consumes. Nothing more. */
export interface HeroConfig {
  image:         MediaImage
  topic?:        LocalizedText
  title:         LocalizedText
  specialTitle?: LocalizedText
  subtitle?:     LocalizedText
  mode:          HeroMode      // §7  — COMPUTED
  atmosphere:    Atmosphere    // §8  — COMPUTED
  anchor:        Anchor
  focal:         Focal         // §23
  size:          HeroSize
  eager:         boolean
}

/** Audit trail. NEVER imported by a component. */
export interface HeroReview {
  page:            string
  narrative:       string
  emotion:         string
  dominantSubject: string
  quietZone:       string
  lightDirection:  string
  visualPath:      string
  exit:            string
  imageOwnership:  string
  score:           number                 // §5.2 — 0–100
  verdict:         'use' | 'manual'       // 'reject' may never ship
  approval?:       string                 // REQUIRED iff verdict === 'manual'
  overrideReason?: string                 // REQUIRED iff focal/anchor ≠ computed
  matrix:          SelectionMatrix        // §6 — per-criterion ratings
  chromeContrast:  { nav: number, logo: number }   // §5.1 G6
}

export interface HeroEntry { config: HeroConfig, review: HeroReview }
```

### 21.3 Validation — Zod, at build time only

The schema lives in **`scripts/hero/schema.ts`**. Zod is a **`devDependency`**.

```ts
const HeroEntrySchema = z.object({ config: …, review: … })
  .refine(e => e.review.verdict !== 'manual' || !!e.review.approval?.trim(),
    'verdict "manual" (score 70–84) requires a recorded approval — §5.2')
  .refine(e => e.review.score >= 70,
    'score < 70 is a REJECT and may never ship — §5.2')
  .refine(e => e.review.chromeContrast.nav >= 4.5 && e.review.chromeContrast.logo >= 3.0,
    'the cover must carry the header — §5.1 G6')
  .refine(e => e.config.mode === analyze(e.config.image).mode,
    'mode is COMPUTED (§7). A hand-set value that disagrees is a build failure')
  .refine(e => e.config.atmosphere === analyze(e.config.image).atmosphere,
    'atmosphere is COMPUTED (§8)')
  .refine(e => isTokenFocal(e.config.focal) || !!e.review.overrideReason?.trim(),
    'a non-token focal requires an analyzer origin + overrideReason — §23')
```

> **Zod must never reach the client bundle, and neither must `HeroReview`.**
> `HeroConfig` is imported by `AppHero`; `HeroReview` and the schema are imported **only** by
> `scripts/` and the test suite. Importing the schema from a component would ship the validator
> *and* every narrative string to every visitor. **Enforced by lint:** `scripts/hero/schema` may
> not appear in any `app/**` import graph.

### 21.4 Pages

```vue
<AppHero v-bind="heroes.about.config" />
```

That is the **entire** hero call site. No focal, no mode, no atmosphere, no magic numbers.

---

## 22. `AppHero` is configuration-driven

> **`AppHero` may branch on *configuration*. It may never branch on *identity*.**

| | |
|---|---|
| **Allowed** — configuration | `mode`, `atmosphere`, `anchor`, `size`, `focal`, slot presence |
| **Forbidden** — identity | Page name, `useRoute()`, `route.path`, slug, `$route`, any `v-if="page === …"` |

**Enforcement:** an import of `useRoute` / `vue-router` in `AppHero.vue` is a **build failure**.

**A slot used by exactly one page must be justified in this document.** `#breadcrumb`, `#chips`
and `#meta` are used by the project-detail hero — justified by its `caption` **mode**, not by its
identity. If a slot's only justification is "the X page needs it", it belongs in **that page**, not
in `AppHero`'s API.

### 22.1 This is precisely why the Home hero stays bespoke

Chrome doc **§30.1** keeps `index.vue`'s hero bespoke. The two rules **agree, and reinforce each
other**: absorbing Home into `AppHero` would require branching on **identity** — a stacked
two-part headline, two body layers, and a full-width scrim that exist for exactly one page. That
is the one thing §22 forbids.

**The alternative is worse than the duplication.** Either `AppHero` grows props that exist for one
page (bloating the API for the other seven), or Home is flattened into a template cover. Keeping it
bespoke is the *consequence* of the configuration-driven rule, not an exception to it.

---

## 23. Focal tokens

### 23.1 The vocabulary

Tokens map to CSS **inside `AppHero`** (`focalToCss()`). A page never sees a percentage.

| Token | `object-position` |
|---|---|
| `center` | `50% 50%` |
| `upper` | `50% 35%` |
| `upper-mid` | `50% 40%` |
| `lower-mid` | `50% 60%` |
| `lower` | `50% 70%` |
| `left-mid` | `35% 45%` |
| `right-mid` | `60% 45%` |
| `left-upper` | `35% 35%` |
| `right-upper` | `60% 35%` |

### 23.2 Why the existing eight heroes keep computed values — and that is correct

**Full tokenisation is not practical here, and forcing it would be a visual redesign.**

The current heroes sit at **`40% / 42% / 45% / 48%`** on the y-axis and **`48% / 50% / 55%`** on x.
A token scale coarse enough to be *semantic* (5% steps) would move several of those crops by
**3–5%** — recropping photographs that were tuned against their quiet zones. **This document
forbids visual change.** A scale fine enough to preserve them (1% steps) would be percentages
wearing names, which buys nothing.

So the rule is split, honestly:

| Case | Rule |
|---|---|
| **New heroes** | **MUST** use a `FocalToken`. No exceptions |
| **The existing 8** | Keep their analyzer-computed values, typed as **`ComputedFocal`** — branded, so they **cannot be hand-typed**, only produced by `scripts/hero/analyze.ts` and recorded in `HeroReview.overrideReason` |
| **Both** | The value lives in the **registry** (§21), **never in a page template** |

> **This is what "no hardcoded percentages" actually buys.** The win is not that `50% 42%` becomes
> a word — it is that **pages stop carrying magic numbers at all**, and that every non-token value
> is provably an analyzer output rather than someone's guess. The brand on `ComputedFocal` is the
> mechanism: you cannot type one by hand, even if you want to.

### 23.3 §12 recovery still works

Recovery step 1 is *"adjust focal"*. Under this system that means: **re-run the analyzer** with an
adjusted subject weighting, and record the new `ComputedFocal` + `overrideReason`. It does **not**
mean nudging a percentage by hand until it looks right — that is exactly the taste this
specification exists to remove.

---

## 24. Replacement image log — **mandatory before merge**

§5.4 rejects **Services, Contact and Recruitment** (score < 70). Each replacement must record the
**full §6 matrix for every candidate considered** — not only the winner. A replacement merged
without this table is a **blocker**.

### Template — one per replaced page

| Candidate | Subject (×5) | Quiet zone (×5) | Narrative (×4) | Light (×3) | Composition (×3) | Resolution (×2) | Raw | **Score** | Verdict |
|---|---|---|---|---|---|---|---|---|---|
| `path/to/a.webp` | | | | | | | | | |
| `path/to/b.webp` | | | | | | | | | |
| **Winner** | | | | | | | | | |

Plus, for the winner: `mode` (computed), `atmosphere` (computed), `focal`, `anchor`,
`chromeContrast.nav`, `chromeContrast.logo`, and — if the score is **70–84** — the recorded
**`approval`**.

> Recording only the winner's score is **not** compliance. The matrix exists to prove the choice
> was *ranked*, not preferred. Without the losing candidates, "highest score wins" (§6) is an
> unverifiable claim.

### Status

| Page | Current | Required |
|---|---|---|
| Services | **REJECT** — busy render, no quiet zone | Matrix + replacement |
| Contact | **REJECT** — competing subjects | Matrix + replacement |
| Recruitment | **REJECT** — no quiet zone | Matrix + replacement |
| Home, Projects | Re-score (was "pass (marginal)" — a non-verdict, §5.4) | Score + verdict; `approval` if 70–84 |
| About, Factory | Pass | Score recorded |
