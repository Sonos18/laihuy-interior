# Report 3 — UI/UX Review

Covers Phase 2 §2 (UI/UX), §3 (Design Consistency), §4 (Component Review), §8 (Mobile), §9 (Image Strategy).

---

## Overall impression

The visual language is coherent and, on paper, well chosen: a warm wood/ink palette, generous section rhythm (`py-20 md:py-28`), consistent `rounded-2xl` cards, restrained motion. It reads as a serious industrial contractor rather than a generic template.

Three things undermine it in practice, and all three are verified defects rather than taste:

1. The fluid typography scale the team wrote **never executes** (U1).
2. The homepage hero **hides the photography** that is the company's entire product (U2).
3. The logo is **illegible on the dark surfaces where it appears most** (U3).

Fix those three and the design reads the way it was designed to.

---

## U1 — The fluid type scale is dead. Every heading uses the fallback step scale.

**Severity: High** · Difficulty: Trivial · ~30m · *Verified in a real browser*

`app/assets/css/main.css` defines a careful fluid scale:

```css
@layer base {
  .text-hero          { font-size: clamp(2.25rem, 1.4rem + 4.2vw, 4.75rem); … }
  .text-section-title { font-size: clamp(1.75rem, 1.2rem + 2.6vw, 3rem);   … }
}
```

…and, 90 lines earlier, an element rule in a *later* cascade layer:

```css
@layer components {
  h1 { @apply text-4xl md:text-6xl; }
  h2 { @apply text-3xl md:text-5xl; }
}
```

Cascade layers beat specificity. Tailwind v4 emits `@layer properties, theme, base, components, utilities`, so **`components` wins over `base`** — a class selector loses to an element selector purely because of layer order. Confirmed by walking the compiled stylesheet:

```
top-level layers: properties -> theme -> base -> components -> utilities
layer base       | .text-hero=true   .text-section-title=true
layer components | h1{text-4xl}=true h2{text-3xl}=true      ← wins
```

And in the page, at a 1536 px viewport:

```js
h1.classList        → ["reveal","text-hero","max-w-5xl","font-black","uppercase","text-white"]
getComputedStyle(h1).fontSize → "60px"     // text-6xl
// .text-hero intends clamp(…, 4.75rem) = 76px
```

Every `<h1 class="text-hero">` and `<h2 class="text-section-title">` on the site silently renders at the step scale. The hero headline is **16 px smaller than designed**, and `text-wrap: balance` / the tuned `letter-spacing` never apply either.

**Why it happened.** The two `@layer` blocks are semantically inverted: element resets (`body`, `h1`–`h6`) sit in `components`, while component classes (`.btn-primary`, `.metric-card`, `.text-hero`) sit in `base`.

**Fix.** Swap them — element resets belong in `base`, component classes in `components`:

```css
@layer base {
  body { … }
  h1, h2, h3, h4, h5, h6 { @apply font-sans font-bold tracking-normal; }
  /* drop the h1/h2/h3 font-size rules entirely — let the utility classes own size */
}

@layer components {
  .btn-primary, .metric-card, .industrial-card, .eyebrow, .section-shell, … { … }
  .text-hero, .text-section-title, .text-lead { … }
}
```

Removing the blanket `h1 { font-size }` rules is the important half: element-level type sizing fights every utility you will ever apply. After the fix, audit every heading, because several pages currently rely on the accidental `md:text-5xl` (e.g. `dich-vu.vue:41`, `nha-xuong.vue:51`, `[slug].vue:265`) and use no fluid class at all — see U4.

---

## U2 — The hero overlay erases the photograph

**Severity: High** · Difficulty: Low · ~2h · *Business-critical*

`app/pages/index.vue:71-73` stacks two overlays on the hero image:

```html
<div class="absolute inset-0 bg-linear-to-t from-wood-950/86 from-70% to-wood-950/68" />
<div class="absolute inset-0 bg-linear-to-t from-wood-950/43 via-transparent via-70% to-transparent" />
```

The first is **68% opaque at its lightest point and 86% at the bottom**. The second adds up to another 43%. Effective opacity across most of the frame exceeds 80%.

Rendered at 390×844, the interior photograph behind it is essentially a texture. For an interior design and fit-out company, the hero image *is* the proof of competence — it is the single most persuasive asset on the page, and it has been dimmed into a background.

The same commit history calls this a "premium warm overlay treatment" (`76f2350`). The intent is right; the execution is ~30 percentage points too strong.

**Recommendation.**

- Drop the base veil to roughly `from-wood-950/70 to-wood-950/25`, and let the **second** gradient do the legibility work only where text sits (bottom-left).
- Better: replace the full-bleed veil with a *directional* scrim — `bg-gradient-to-tr from-wood-950/85 via-wood-950/45 to-transparent` — so the top-right of the photo stays fully visible.
- Verify text contrast after the change: the hero copy uses `text-white/86` and `text-white/68`, which have large headroom (14.6:1 and 9.2:1 on `ink-950`). There is room to lighten the overlay substantially and still clear WCAG AA.

`AppHero.vue`'s `.hero-overlay` (`from-ink-950/95 via-ink-950/70 to-ink-950/30`) has the same problem on the six inner pages, and additionally is a **left-to-right** gradient while `index.vue`'s is bottom-to-top — an inconsistency in its own right (see U5).

---

## U3 — `logo-white.png` is not white, and it is used on dark surfaces

**Severity: High** · Difficulty: Low · ~2h

Pixel analysis of `public/logo-white.png`:

```
500×500, alpha, 69 KB
opaque pixels: 14,075 (6.2%)
near-white (luma > 200): 0.0%      ← there is no white in it
```

It is a **navy wordmark + orange flame mark on transparency**, designed for light backgrounds. Composited onto `ink-950` (`#0b0a09`) the navy "LAI HUY" nearly vanishes.

It is used in three places (`app/app.vue`):

| Location | Background | Result |
|---|---|---|
| `:83` header, unscrolled | dark hero photo + heavy overlay | navy on near-black — barely legible |
| `:83` header, scrolled | `bg-white/95` | correct |
| `:236` footer | `bg-ink-950` | navy on near-black — barely legible |
| `:172` mobile menu | `bg-white` | uses `logo.png` — a navy **circular badge** with a white wordmark, a different lockup entirely |

So the header logo is correct in exactly one of its two states, the footer is wrong, and the mobile menu shows a third variant.

Additionally:

- `public/favicon.png` is **byte-identical** to `logo-white.png` (`sha256 8f225e01…`) and is referenced nowhere. `app.vue:10` links `/logo_favicon.png`. Dead 69 KB.
- `app/components/AppLogo.vue` is a **clean inline SVG of the same logo**, using `currentColor` for the wordmark and `var(--ui-primary)` for the mark — i.e. it already solves the light/dark problem — and it is **referenced by nothing**.
- None of the three `<img>` logos declare `width`/`height`, so each contributes layout shift.

**Recommendation.**

1. Rename the assets truthfully: `logo-color.png` (current `logo-white.png`), `logo-badge.png` (current `logo.png`). Produce a genuinely white/knockout `logo-white.svg`.
2. Better: **use `AppLogo.vue`.** It is already the right tool — `currentColor` inherits the header's `text-white` / `text-ink-950` classes automatically, it is resolution-independent, and it removes 69 KB of PNG from the critical path. Wire `--ui-primary` (or a `wood-400` token) for the flame.
3. Delete `public/favicon.png`.
4. Add `width`/`height` (or a fixed `aspect-ratio`) to any remaining raster logo.

---

## U4 — Design inconsistencies

**Severity: Medium** · Difficulty: Medium · ~1–2 days

### Headings: three competing systems

| Pattern | Where | Example |
|---|---|---|
| Fluid class (dead — see U1) | `index.vue` only | `class="text-section-title"` |
| Inline step scale | `dich-vu`, `nha-xuong`, `gioi-thieu`, `tuyen-dung`, `lien-he`, `du-an/index`, `[slug]` | `class="text-3xl md:text-5xl"` |
| Element default | anywhere without a class | `h2 { text-3xl md:text-5xl }` |

`index.vue` is the only page using the intended scale. Every other page hardcodes `text-3xl md:text-5xl` — twelve times. Once U1 is fixed, replace all of them with `.text-section-title`.

### Font weight: `font-bold` vs `font-black` with no rule

`AppHero.vue:57` uses `font-bold` for its `<h1>`. `index.vue:85` and `[slug].vue:158` use `font-black`. `[slug].vue:112` (the 404 heading) uses `font-black`. There is no stated rule for which. Compounded by the fact that **weight 900 is not loaded at all** (Report 4, P5), so `font-black` and `font-bold` render nearly identically today — the inconsistency is currently invisible and will surface the moment the 900 face is added.

### Buttons: four classes, and one ad-hoc

`main.css` defines `.btn-primary`, `.btn-secondary`, `.btn-dark`, `.btn-outline` — a good, disciplined set with shared geometry (`rounded-full px-7 py-3.5 text-sm font-bold`). But:

- `lien-he.vue:221` submit button uses `.btn-dark w-full` — fine.
- `app.vue:134` uses `class="btn-primary py-3"` — overrides the shared `py-3.5` for one instance, so the header CTA is 4 px shorter than every other primary button.
- `index.vue:116` puts `group-hover:translate-x-1` on an arrow icon inside a `.btn-primary` link that has **no `group` class** (verified: the only `group` ancestors are on the project cards). The animation never fires. Four other `group-hover:` usages *do* have a `group` ancestor and work correctly.

### Cards: two definitions that differ by one property

```css
.metric-card     { @apply rounded-2xl border border-ink-200 bg-white p-6; }
.industrial-card { @apply rounded-2xl border border-ink-200 bg-white p-6 transition-colors hover:border-wood-400; }
```

`index.vue:176` then writes `class="metric-card reveal transition-colors hover:border-wood-400"` — re-implementing `.industrial-card` by hand. Merge into one card with an optional `interactive` variant.

### Dead theme tokens

`main.css:6-7` declares `--color-wood: #6f4f37` and `--color-warm: #b8875a` in `:root`. Neither is referenced anywhere. `--color-warm` duplicates `--color-wood-400`. `@theme` already generates the full `wood-*` scale. Delete both.

### Container width

`.section-shell` (`max-w-7xl`) is applied consistently — a genuine strength. But horizontal padding is inconsistent: `section-spacing` supplies `px-6 md:px-8`, yet `app.vue:77,232` and several sections add `px-6` *again* on the shell, and `index.vue:418` / `du-an/index.vue:145` use `px-6 py-16` in place of `.section-spacing`. Pick one.

---

## U5 — Hero component fragmentation

**Severity: Medium** · Difficulty: Low · ~half day

There are **three** hero implementations:

| Hero | File | Height | Overlay | Preload |
|---|---|---|---|---|
| Homepage | `index.vue:59-144` | `min-h-screen` | two `wood-950` gradients, bottom-up | `useHead` in page |
| Inner pages | `AppHero.vue` | `min-h-[62vh]` | `.hero-overlay`, left-to-right `ink-950` | `useHead` in component |
| Project detail | `[slug].vue:129-180` | `min-h-screen` | flat `bg-ink-950/72` + bottom fade | **none** |

Three different overlay treatments, two different height systems, and the project detail hero — the most important page for conversion — is the only one **without an image preload**, despite being the LCP element.

`AppHero` already accepts `title` / `specialTitle` / `subtitle` / `topic` / `image`. Extend it with `size: 'full' | 'compact'` and an optional metrics slot, then use it for all three. That deletes ~90 lines of duplicated template and gives the detail page its preload for free.

---

## U6 — Component review

| Component | Assessment |
|---|---|
| `MediaImage.vue` | **Good.** Preset-driven, handles skeleton + decorative `alt: ''` correctly. One nit: the component is named `MediaImage` and so is the *type* it imports (`~/shared/media/types`). Inside the SFC, `MediaImage` the type and `MediaImage` the component coexist. Rename the type to `RenderableImage`, or the component to `AppImage`. |
| `AppGalleryGrid.vue` | **Good.** CSS multi-column masonry, reserves height from catalog dimensions, no cropping. The header comment explains the design decision and the deliberate absence of alternate layouts. Correct call. |
| `AppHero.vue` | Fine, but under-used (U5) and hardcodes `sizes="sm:100vw md:100vw lg:100vw xl:100vw"` rather than using `mediaPresets.hero`, which contains that exact string. |
| `AppLogo.vue` | Dead. Should be the *primary* logo (U3). |
| `TemplateMenu.vue` | Dead starter leftover. Delete. |
| `app.vue` | **373 lines, too large.** The header (86 lines), mobile menu (72 lines) and footer (141 lines) are three independent concerns with independent state. Extract `AppHeader.vue`, `AppMobileMenu.vue`, `AppFooter.vue`. |
| `index.vue` | **484 lines, seven sections.** Extract at minimum `HomeHero`, `FeaturedProjects`, `ServicesGrid`. |
| `[slug].vue` | **434 lines.** The `v-if="!project"` 404 branch (lines 106-126) should not live here at all — it should be a real 404 (Report 5, S1). |

**Missing reusable components** (each is currently copy-pasted 3–7 times):

- **`SectionHeader`** — the `eyebrow` + `h2` + optional lead paragraph block appears on every page, ~14 times.
- **`ProjectCard`** — duplicated near-identically in `index.vue:228-281`, `du-an/index.vue:88-140`, and `[slug].vue:404-428`. Three subtly different versions (different `sizes`, different hover scale, different metadata rows).
- **`CtaBanner`** — the dark `bg-ink-950 px-6 py-16` call-to-action strip appears on `index`, `du-an/index`, `[slug]`, `nha-xuong`, `dich-vu`, `gioi-thieu`, `tuyen-dung` — **seven times**, each hand-written.
- **`FactCard`** / **`MetricCard`** — the `label` + big `value` + description block appears in `index.vue`, `gioi-thieu.vue`, `nha-xuong.vue`, `[slug].vue`.

Extracting `CtaBanner` and `ProjectCard` alone removes roughly 200 lines of template and makes the CTA copy editable in one place — which matters, because the CTA is the conversion surface.

**State management** is appropriately simple. No prop drilling, no store, no over-abstraction. `useLanguage` and `useMediaUrl` are the right granularity. Nothing here needs Pinia.

---

## U7 — Mobile experience

**Severity: High** · Difficulty: Medium · ~1 day

Measured at 390×844:

- **No horizontal overflow** (`scrollWidth` 375 ≤ 390). Good.
- **`min-h-screen` (100vh) on both full heroes.** On iOS Safari and Chrome Android, `100vh` exceeds the visible viewport while the URL bar is shown, so the hero CTAs sit below the fold on first paint. Use `min-h-dvh` (Tailwind: `min-h-dvh`). Affects `index.vue:59,75` and `[slug].vue:129,143`.
- **13 tap targets under 44 px.** Worst offenders:

  | Element | Size | Target |
  |---|---|---|
  | Hamburger button | 40 × 46 | 44 × 44 |
  | Footer nav links | ~50 × 17 | 44 tall |
  | Footer contact links | 327 × 20 | 44 tall |
  | Locale toggle buttons (`px-3 py-1.5 text-xs`) | ~34 × 28 | 44 × 44 |

  Fix by adding vertical padding to footer list items and bumping the locale pills to `px-4 py-2.5`.

- **Homepage hero stacks five text levels before the CTA**: eyebrow → `h1` → a `<span>` sub-headline inside the `h1` → tagline paragraph → lead paragraph → buttons. On a 390 px screen this pushes the primary CTA to ~690 px down. Cut one of the two paragraphs (the tagline and the lead say nearly the same thing) and the CTA rises above the fold.
- **The `<span>` inside `<h1>`** (`index.vue:88`) is a second sentence rendered as part of the heading. Semantically it belongs in a `<p>` beneath the `h1`; keeping it inside inflates the accessible name of the page's only `h1`.
- **Sticky header is `h-20` (80 px)** with no `scroll-margin-top` on section anchors. Any future in-page anchor will land under the header.

---

## U8 — Image strategy

**Severity: Medium** · Difficulty: Medium

**What is right.** Every image goes through `@nuxt/image` with a custom provider; every `<img>` carries intrinsic `width`/`height`; `AppGalleryGrid` reserves the exact aspect ratio before load, so gallery CLS is ~0. Presets centralise `sizes`/`loading`/`fetchpriority`. `MediaImage` shows a skeleton and fades in. This is better than most sites of this size.

**What is wrong.**

1. **The variant ladder tops out below the master.** Variants are `[400, 800, 1600]`; masters are capped at 2560. `snapToVariantWidth()` returns `null` above 1600, which means the `<img>` `srcset` offers the **full 2560 px master** at the `2048w`/`2560w` candidates. On a 1536 px laptop at DPR 1.25, that is the candidate the browser picks — 243 KB instead of 91 KB. Add a `2200` or `2560` variant, or cap the srcset. (Full analysis: Report 4, P2.)

2. **The preload can never match the `srcset`.** `AppHero.vue:23-32` and `index.vue:45-54` emit `<link rel=preload as=image href="…-w1600.webp">` with no `imagesrcset`/`imagesizes`. When the browser picks a different candidate, the preload is a **pure waste of 91 KB on the LCP path** — and it was fetched, verified. (Report 4, P1.)

3. **`sizes` is degenerate for full-bleed images.** `mediaPresets.hero` and `.full` are both `'sm:100vw md:100vw lg:100vw xl:100vw'`, which compiles to four identical media queries. The comment above it explains this is a workaround for `@nuxt/image` v2 emitting broken `1w`/`2w` entries on a bare default segment. Worth re-testing against the current version — if fixed, `sizes="100vw"` is clearer.

4. **Galleries are unbounded.** `khach-san-eo-gio` renders **30 images**, `nha-vuon-chily` 26, `codi-boutique-hotel` 20 — all in one masonry, all lazy-loaded, with no lightbox and no pagination. Lazy loading saves the initial load, but a user who scrolls the full page of the flagship project downloads 30 images. Add a lightbox (click to view the master) and consider a "show more" cut at ~12.

5. **Aspect ratios are mixed within a gallery.** The masonry deliberately preserves natural ratios (landscape 3:2 next to portrait 5:6), which is the right editorial choice for interiors. No change needed — but the **cover images** are force-cropped to `aspect-[4/3]` on cards, and several project covers are portrait (`2133×2560`), so they are centre-cropped hard. Consider an explicit `coverCrop` hint in `projects.ts`, or select landscape covers.

6. **Total master weight is 72.8 MB across 160 assets.** Served from Supabase Storage with `cache-control: 31536000` (immutable, correct). Not a page-weight problem, but a Supabase **egress cost** problem at scale, since every master fetch above 1600 px is billed. Fixing (1) largely fixes this too.

---

## U9 — Conversion, trust, and business surface

**Severity: High (business)** · Difficulty: Medium

**The CTA is consistent and well placed.** "Nhận báo giá trong 24h" / "Get a quote within 24h" appears in the header, the hero, the footer, and a dark CTA banner at the bottom of all seven content pages. The value proposition (factory-direct, quality control, on-time) is stated clearly and repeated. The `productionWorkflow` (6 steps) and `qualityControl` (5 checks) sections are exactly the kind of process proof a B2B owner looks for.

**But the funnel terminates in a `mailto:`.** `lien-he.vue:62-78` builds a subject and body and assigns `window.location.href`. There is no backend. The page says so out loud:

> "Biểu mẫu sẽ mở email trên thiết bị của bạn với nội dung đã điền sẵn. Website hiện chưa kết nối backend gửi form tự động."
> *("This form opens your email app with a prepared message. The website is not connected to an automatic form backend.")*

Consequences: mobile users without a configured mail client hit a dead end; no lead is ever stored; nothing is measurable; the file-upload the copy invites ("send drawings, BOQ") is impossible.

**Missing trust signals**, all standard for this sector and all absent:

- No client logos (the case studies name Codi, NovaWorld — permission permitting, show the marks)
- No testimonials or quotes from owners/operators
- No certifications, licences, or ISO marks
- No years-in-business / projects-completed counters (the data exists in `factoryCapabilities`)
- No team photographs — for a "we control the process" pitch, faces matter
- No project completion dates on cards (`year` exists in `Project` but is only shown in the detail facts)

**Missing internal linking.** The footer's "Services" column (`app.vue:282-289`) is a plain `<ul>` of five service names — **not links**. They should point at `/dich-vu`. Likewise, `[slug].vue` mentions materials and scope but never links back to `/dich-vu` or `/nha-xuong`.

**No analytics.** Verified: no GA, no GTM, no Plausible, no Vercel Analytics, no event tracking anywhere. There is currently **no way to know whether any of this works.** This is the first thing to install, before optimising anything.

---

## Priority summary

| ID | Issue | Severity | Effort | Business value |
|---|---|---|---|---|
| U9 | `mailto:` funnel, no analytics, no trust signals | **High** | 2–3d | **Very high** |
| U1 | Fluid type scale never applies (layer inversion) | High | 30m | Medium |
| U2 | Hero overlay hides the photography | High | 2h | **High** |
| U3 | Logo illegible on dark; dead SVG logo exists | High | 2h | Medium |
| U7 | `100vh` heroes, 13 small tap targets, CTA below fold | High | 1d | High |
| U5 | Three hero implementations; detail hero lacks preload | Medium | 0.5d | Medium |
| U8 | srcset/preload mismatch, unbounded galleries | Medium | 1d | Medium |
| U4 | Heading/button/card/token inconsistencies | Medium | 1–2d | Low |
| U6 | `app.vue` 373 lines; `CtaBanner`/`ProjectCard` duplicated ×7 | Medium | 1–2d | Low |

**Sequence.** U1 first (30 minutes, unblocks all heading work). Then U9 (the business depends on it). U2 and U3 together as a "brand pass". U4/U6 last — they are quality-of-life, not revenue.
