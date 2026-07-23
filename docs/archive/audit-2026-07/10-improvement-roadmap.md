# Report 10 — Improvement Roadmap

Effort assumes one engineer familiar with the codebase. Estimates are for implementation *plus* review and verification.

**Legend** — B = business value, T = technical value. ⬤⬤⬤ high · ⬤⬤ medium · ⬤ low

---

## Sequencing principle

Three constraints drive the order below:

1. **Stop the bleeding before optimising.** The soft-404 is actively teaching Google that garbage URLs are valid, and the site cannot capture a lead. Both are cheap to fix and both are losing value every day.
2. **You cannot improve what you cannot measure.** There is zero telemetry. Analytics goes in early, not late.
3. **Translate before you route by locale.** Shipping `/en/gioi-thieu` while 64% of it is Vietnamese is worse than not shipping it. D3 gates D2.

---

## Quick Wins — under 1 day

Everything here is independent, low-risk, and individually shippable.

| # | Task | Effort | B | T | Refs |
|---|---|---|---|---|---|
| QW-1 | **Add `build`, catalog-drift check, and `pnpm audit` to CI.** Three lines of YAML. Closes the hole the 59% drift walked through. | 15m | ⬤ | ⬤⬤⬤ | D8, Q9 |
| QW-2 | **Return a real 404 for unknown project slugs.** Replace the `v-if="!project"` branch with `createError({ statusCode: 404, fatal: true })`. | 1h | ⬤⬤⬤ | ⬤⬤ | S1 |
| QW-3 | **Regenerate `catalog.generated.ts`** and assert `width`/`height` in `tests/media.test.ts`. | 2h | ⬤ | ⬤⬤⬤ | D1, A1, A2 |
| QW-4 | **Fix the CSS layer inversion.** Move element resets to `@layer base`, component classes to `@layer components`, delete the blanket `h1/h2/h3 { font-size }` rules. Restores the fluid type scale on every heading. | 30m | ⬤⬤ | ⬤⬤ | U1 |
| QW-5 | **Add `robots.txt` and `sitemap.xml`.** Slugs are already a compile-time constant. | 2h | ⬤⬤⬤ | ⬤ | S4 |
| QW-6 | **Add `canonical`, `og:url`, `og:type`, `og:site_name`.** Requires a `siteUrl` in `runtimeConfig.public`. | 2h | ⬤⬤⬤ | ⬤ | S3 |
| QW-7 | **Generate `fallback.generated.ts`** in `media:catalog`; drop the `manifest.json` runtime import. **−20.6 KB gzip** off the main chunk. | 2h | ⬤ | ⬤⬤⬤ | D4, P3 |
| QW-8 | **Replace hand-rolled hero preloads with `<NuxtImg preload>`.** Stops the 91 KB double-download on every hero. | 2h | ⬤⬤ | ⬤⬤ | P1 |
| QW-9 | **Prerender `/du-an/**`.** Eleven static files; removes `Set-Cookie`; makes QW-2 trivial. | 2h | ⬤⬤ | ⬤⬤ | P4, SEC-2 |
| QW-10 | **Add security headers** via `routeRules`. Drop `x-powered-by`. | 2h | ⬤ | ⬤⬤ | SEC-1 |
| QW-11 | **Fix three contrast failures** (`text-white/42 → /55`, `text-white/45 → /55`, `text-ink-400 → ink-500`) and **add a skip link**. | 45m | ⬤ | ⬤⬤ | A1, A6 |
| QW-12 | **Delete dead code.** `motion`, `@nuxtjs/device`, `useScrollReveal.ts`, `TemplateMenu.vue`, `favicon.png`, ~10 dead exports, dead CSS tokens and keyframes. Add `group` to the `btn-primary` at `index.vue:109`. | 1h | ⬤ | ⬤⬤ | D9, Q4, Q5 |
| QW-13 | **Write a real README**; link `docs/media-migration/`. Untrack `.claude/`, gitignore `.claude/worktrees/`. | 1h | ⬤ | ⬤⬤ | D10, Q10 |

**Total: ~1.5 engineer-days.** QW-1 → QW-3 should land as one PR; they are the safety net for everything after.

---

## Short Term — 1 to 3 days each

| # | Task | Effort | B | T | Refs |
|---|---|---|---|---|---|
| ST-1 | **Real contact form.** Nitro `server/api/contact.post.ts` + Zod validation + honeypot + Turnstile + rate limit + transactional email (Resend/SES) + a persisted record. Optionally file upload to a **private** bucket. Replaces the `mailto:`. | 2–3d | ⬤⬤⬤ | ⬤⬤ | U9, SEC-3 |
| ST-2 | **Add analytics + error reporting.** Vercel Analytics/Plausible + `web-vitals` + Sentry. Track CTA clicks, form starts, form submits. **Nothing else on this list can be evaluated without it.** | 1d | ⬤⬤⬤ | ⬤⬤ | Q6, P |
| ST-3 | **Add a `2200w` variant rung** (`MEDIA_VARIANT_WIDTHS`), re-run `optimize` + `upload`. Hero drops 243 KB → ~110 KB on common desktops. | 1d | ⬤⬤ | ⬤⬤ | P2 |
| ST-4 | **Fix the fonts.** Declare `Inter` weights `[400,600,700,900]`, `styles:['normal']`, include the `vietnamese` subset, preload the `h1` face. Removes faux-bold on all 45 `font-black` elements. | 3h | ⬤⬤ | ⬤⬤ | P5 |
| ST-5 | **Brand pass.** Adopt `AppLogo.vue` (SVG, `currentColor`) in header, mobile menu, footer. Lighten the hero overlays so the photography reads. Rename/delete the PNGs. | 1d | ⬤⬤⬤ | ⬤ | U2, U3, D7 |
| ST-6 | **Mobile menu accessibility.** `USlideover` (or focus-trap + `Esc` + `aria-expanded`/`aria-controls` + focus restore + `inert` background). | 1d | ⬤ | ⬤⬤ | A2 |
| ST-7 | **Mobile polish.** `min-h-screen` → `min-h-dvh` on both full heroes. Raise 13 tap targets to 44 px. Cut one of the two hero paragraphs so the CTA rises above the fold. | 1d | ⬤⬤ | ⬤ | U7, A3 |
| ST-8 | **`error.vue`.** Branded, bilingual, links to `/` and `/du-an`. Required once QW-2 uses `createError`. | 0.5d | ⬤ | ⬤⬤ | Q6 |
| ST-9 | **Reconcile the address data.** Decide whether careers is in Bến Tre or Vĩnh Long/Tây Ninh; make `company.addresses` the single source. | 0.5d | ⬤⬤ | ⬤ | A8, Q10 |
| ST-10 | **Fix `og:image` absolutisation** in fallback mode; verify with `USE_SUPABASE_MEDIA=false`. | 30m | ⬤ | ⬤ | S6 |

**Total: ~10 engineer-days.**

> **ST-1 and ST-2 are the two items on this entire roadmap with direct revenue impact.** Everything else makes the site better; these two make it *work*.

---

## Medium Term — about a week each

| # | Task | Effort | B | T | Refs |
|---|---|---|---|---|---|
| MT-1 | **Require `en` in `LocalizedText`** (`{ vi: T; en: T }`), then translate `services.ts`, `factory.ts`, `careers.ts`, and the `gioi-thieu.vue` template. `tsc` enumerates the gaps. **Gates MT-2.** | 2–3d | ⬤⬤⬤ | ⬤⬤⬤ | D3, A4, Q8 |
| MT-2 | **URL-based i18n.** `@nuxtjs/i18n`, `prefix_except_default` → `/` + `/en/…`. Prerender both trees. Emit `hreflang` (`vi`, `en`, `x-default`). Correct `lang` in static HTML. Kills the hydration mismatch and the `Vary` problem. | 1w | ⬤⬤⬤ | ⬤⬤⬤ | D2, S2, A5 |
| MT-3 | **JSON-LD structured data.** `LocalBusiness` (two locations!) in `app.vue`; `Article` + `BreadcrumbList` on `[slug]`; `JobPosting` on `tuyen-dung` → Google Jobs eligibility. All the data already exists, typed. | 1d | ⬤⬤⬤ | ⬤ | S5 |
| MT-4 | **Component extraction.** `CtaBanner` (×7), `ProjectCard` (×3), `SectionHeader` (×14), `MetricCard` (×4), `LocaleToggle` (×2). Split `app.vue` into `AppHeader`/`AppMobileMenu`/`AppFooter`. Unify `AppHero` to serve all three hero variants. ~200 lines deleted. | 3–4d | ⬤ | ⬤⬤⬤ | D6, U5, U6, Q2, Q3 |
| MT-5 | **Design-system consolidation.** One card, one heading scale (post-QW-4), one button set with a `size` variant, one container/padding rule. Delete `--color-wood`/`--color-warm`. Document the tokens. | 2–3d | ⬤ | ⬤⬤ | U4 |
| MT-6 | **Trust signals.** Client logos, 2–3 owner testimonials, completion years on project cards, team photos, a projects-completed counter (data exists in `factoryCapabilities`). Link the footer's Services list to `/dich-vu`. | 3d | ⬤⬤⬤ | ⬤ | U9, S7 |
| MT-7 | **Gallery lightbox + pagination.** `khach-san-eo-gio` renders 30 images inline. Add click-to-view (master) and a "show more" cut at ~12. Give images distinct `alt` text. | 2d | ⬤⬤ | ⬤ | U8, S8, A9 |
| MT-8 | **Test the product layer.** Component tests for `MediaImage`, `AppGalleryGrid`, `AppHero`; unit tests for `useLanguage` and `project-media`; a route test asserting the 404 status. | 2–3d | ⬤ | ⬤⬤⬤ | Q1 |

**Total: ~4 engineer-weeks.**

---

## Long Term — multiple weeks

| # | Task | Effort | B | T | Refs |
|---|---|---|---|---|---|
| LT-1 | **Decouple `ProjectMediaId` from the folder name.** Introduce an explicit immutable key with a `mediaId → folder` map in the generated catalog. Do this *before* the CMS, not with it. | 1w | ⬤ | ⬤⬤⬤ | D5, Phase 5 §D1 |
| LT-2 | **CMS / media database.** Per `docs/media-migration/phase-5-roadmap.md`. Marketing cannot currently change a phone number without a deploy. Depends on LT-1 and MT-1/MT-2 (content must be keyed, not inline). Add: admin authn, RLS on the media tables, a separate authoring write path. | 3–4w | ⬤⬤⬤ | ⬤⬤⬤ | D5, SEC |
| LT-3 | **Split `projects.ts`** (643 lines, 11 records) into `data/projects/<slug>.ts` + barrel — or skip if LT-2 lands first. | 2d | ⬤ | ⬤⬤ | Q2 |
| LT-4 | **Content strategy.** The eleven case studies have `overview`/`challenge`/`solution`/`materials`/`craftsmanship`/`experience` — real narrative depth. Add a blog/insights section targeting "thi công nội thất khách sạn" long-tail queries, and cross-link into the case studies. | ongoing | ⬤⬤⬤ | ⬤ | S8 |
| LT-5 | **Evaluate Supabase Image Transformations.** If the plan supports `?width=`, the entire `optimize`/variant/`snapToVariantWidth` machinery could retire. Measure egress cost first. | 1w | ⬤ | ⬤⬤ | P2 |
| LT-6 | **Lighthouse CI with a budget** on every PR, so hero/font/bundle regressions cannot recur. | 2d | ⬤ | ⬤⬤ | P |

---

## Dependency graph

```
QW-1 (CI build + drift check)
  └─► QW-3 (regenerate catalog + assert dims)

QW-9 (prerender /du-an/**)
  └─► QW-2 (real 404)  ──► ST-8 (error.vue)

QW-6 (siteUrl + canonical)
  ├─► ST-10 (absolute og:image)
  └─► MT-3 (JSON-LD)

QW-4 (fix CSS layers)
  └─► MT-5 (design system)   [must precede: heading work is wasted otherwise]

ST-2 (analytics)
  └─► everything measurable  [do early; it gates evaluation of all perf/UX work]

MT-1 (require `en`; translate)
  └─► MT-2 (URL i18n + hreflang)   [HARD GATE — do not ship /en before MT-1]

MT-4 (extract components)
  └─► MT-5 (design system), MT-6 (trust signals)

LT-1 (stable mediaId)
  └─► LT-2 (CMS)
```

Two hard gates worth restating:

- **MT-1 must precede MT-2.** Shipping `/en/*` routes while `services.ts`, `factory.ts`, `careers.ts`, and `gioi-thieu.vue` are Vietnamese-only publishes broken pages to Google under an `hreflang="en"` promise.
- **QW-4 must precede MT-5.** Any heading work done while the fluid type scale is silently overridden will be redone.

---

## Suggested milestones

### Sprint 1 — "Make it correct" (1 week)
QW-1 … QW-13, plus ST-2 (analytics) and ST-8 (`error.vue`).

**Exit criteria:** unknown slugs 404 · `robots.txt` and `sitemap.xml` served · canonical on every page · CI builds and fails on catalog drift · main chunk −20 KB gzip · heroes fetched once · security headers present · zero dead dependencies · analytics reporting.

### Sprint 2 — "Make it convert" (1–2 weeks)
ST-1 (form), ST-3 (variant rung), ST-4 (fonts), ST-5 (brand pass), ST-6, ST-7, ST-9.

**Exit criteria:** leads are captured, stored, and attributed · hero LCP image ≤ ~110 KB · no faux-bold headings · the hero photograph is visible · logo legible on every surface · mobile CTA above the fold · WCAG AA contrast clean.

### Sprint 3 — "Make it findable" (2–3 weeks)
MT-1, MT-2, MT-3, MT-6, MT-7.

**Exit criteria:** `/` and `/en/*` both prerendered with correct `lang` and `hreflang` · zero hydration mismatches · 100% translation coverage enforced by `tsc` · `LocalBusiness`, `Article`, `BreadcrumbList`, `JobPosting` markup live · testimonials and client logos on the homepage.

### Sprint 4 — "Make it maintainable" (2–3 weeks)
MT-4, MT-5, MT-8, LT-3.

**Exit criteria:** CTA copy editable in one file · one card, one heading scale, one button set · component and route tests in CI.

### Beyond
LT-1 → LT-2 (CMS), LT-4 (content), LT-5, LT-6.

---

## Effort summary

| Horizon | Items | Effort | Primary payoff |
|---|---|---|---|
| Quick Wins | 13 | ~1.5 days | Stops SEO damage; −240 KB; CI safety net |
| Short Term | 10 | ~10 days | **Lead capture**, measurability, LCP, brand, a11y |
| Medium Term | 8 | ~4 weeks | English market, structured data, maintainability |
| Long Term | 6 | ~8+ weeks | CMS, content engine, stable identifiers |

**The first 1.5 days deliver disproportionate value.** QW-2 alone (a five-line change) prevents Google from indexing an unbounded URL space around the company's only portfolio proof.
