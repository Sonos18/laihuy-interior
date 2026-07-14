# Hero Art Direction — Lai Huy Interior
<!-- claude --resume 9dafabec-ea3a-40df-8951-cc2067c6c3ef -->
A **long-term design system**, not a one-off spec. It governs how every page hero is
conceived, composed, reviewed, and retired. Future contributors should be able to
read this and understand the *reasoning*, then produce a hero that belongs to the
same publication — even for photography that does not exist yet.

Status: specification (implementation pending approval). Nothing here is optional;
each rule is a **review gate** (see §11).

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

## 5. Image Quality Gate

Evaluate **before** composing. Reject/replace an image with: unclear subject,
excessive clutter, competing focal points, poor/uneven lighting, insufficient
resolution (< ~1600px usable width), or **no usable quiet zone**. Composition must
never compensate for an unsuitable photograph.

Current verdicts: About/Factory (real workshop) **pass**; Home/Projects **pass
(marginal)**; **Services, Contact, Recruitment fail → replace** (busy renders /
competing subjects / no quiet zone).

## 6. Image Selection Matrix

When multiple candidates exist, score objectively; highest total wins. Never pick
subjectively.

| Criterion | Weight |
|---|---|
| Subject clarity (one dominant element) | 5 |
| Usable negative space / quiet zone | 5 |
| Narrative fit (tells the page's story) | 4 |
| Light direction (usable dark zone for type) | 3 |
| Composition (leads eye subject → headline) | 3 |
| Resolution / technical quality | 2 |

`score = Σ (criterion_rating 0–5 × weight)`. Record the matrix for the chosen image
in its metadata (§10).

## 7. Derived modes (mode is an output, not a style choice)

```
mode = derive(ImageQualityGate, Composition, ContentDensity)

  clear generous quiet zone + low/med content        → offset   (type in the quiet zone; one gradient; no glass)
  busy-but-passing frame + strong perspective/density → caption  (organized editorial caption; one gradient)
  high content density (breadcrumb+chips+facts+CTAs)  → caption
  glass                                               → NOT a hero-text mode; only a single info-container bridge
```

If an image is swapped later, **re-derive the mode** — do not keep a page's mode fixed.
Because the quality gate replaces the busy covers, most heroes derive to **offset**;
content-dense pages (Projects list, Project detail) derive to **caption**; glass appears
at most once per hero as a section bridge (metrics/facts).

## 8. Atmosphere tokens (within the existing palette)

| Atmosphere | Scrim | Glass tint | Use |
|---|---|---|---|
| `warm` | `wood-950` | warm | wood/oak interiors (Home) |
| `neutral` | `ink-950` | cool | concrete/industrial (About, Factory, Recruitment) |
| `dark` | `ink-950` | cool | industrial-dark covers (Projects) |

Kicker stays `wood-300`; primary CTA stays the wood primary. Atmosphere is the only
per-hero color lever — no new colors.

## 9. Rendering budget (hard limit)

Per hero: **≤ 1 backdrop blur · ≤ 1 localized gradient · ≤ 1 glass surface · ≤ 1 image
transform.** No nested backdrop filters, no stacked translucent overlays. Premium
quality comes from composition, typography, photography, and spacing — not accumulated
effects.

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
