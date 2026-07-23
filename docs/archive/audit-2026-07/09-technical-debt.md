# Report 9 — Technical Debt

Debt here means: *something that works today, but that will cost more to change than it should.* Ranked by interest rate — how fast the cost grows.

---

## D1 — The generated catalog broke its own contract, and nothing noticed

**Interest rate: High** · Principal: 2h

`catalog.generated.ts` carries a header that says it is build output, regenerated from `manifest.json`. Today it is neither reproducible nor checked:

```console
$ pnpm media:catalog && git diff --stat app/media/catalog.generated.ts
 1 file changed, 130 insertions(+), 130 deletions(-)
```

130 of 221 asset references carry pre-optimisation dimensions (`3000×2000` instead of `2560×1707`), because `optimize.ts` capped masters at `MASTER_MAX_EDGE = 2560` and the catalog was never regenerated.

**Why the interest rate is high.** The downscale was uniform, so aspect ratios survived by luck — visual impact today is ~zero. The *guarantee* is what broke. `AppGalleryGrid` sets `aspect-ratio` from these numbers and every `<img>` gets `width`/`height` from them. The first change that alters a ratio — a crop, an art-directed variant, a rotation fix — ships a layout-shifting page and **all 26 tests still pass.**

Every day this sits, more code takes a dependency on numbers that are wrong.

**Repayment.** Regenerate + commit. Add `pnpm media:catalog && git diff --exit-code` to CI. Assert dimensions in `tests/media.test.ts`, not just path existence.

---

## D2 — i18n is a render-time cookie, not an architecture

**Interest rate: High** · Principal: ~1 week

Every `t()` call is a runtime lookup against a cookie-backed ref. This choice has already produced four separate defects (hydration mismatch, unindexable English, wrong `lang`, `Vary`-less SSR responses), and each new page adds to the surface.

**Why the interest rate is high.** The cost of migrating to URL-based locales grows linearly with the number of `t()` call sites — which grows with every page and every section. There are already ~200 inline `t({ vi, en })` literals scattered through templates:

```vue
{{ t({ vi: 'Lai Huy Interior cung cấp giải pháp…', en: 'Lai Huy Interior delivers turnkey…' }) }}
```

Content is embedded in templates rather than keyed. Migrating to `@nuxtjs/i18n` means extracting all of them into message files. Doing it at 8 pages costs a week; at 20 pages it costs three.

**Repayment.** Move to URL locales (`/` + `/en`) with `hreflang`. Extract inline literals into keyed messages as you go.

---

## D3 — `LocalizedText` describes the data instead of constraining it

**Interest rate: High** · Principal: 2–3 days (mostly translation)

```ts
export type LocalizedValue<T> = T | { vi: T; en?: T }
```

A bare Vietnamese `string` typechecks. The result, measured:

| Module | Bilingual | Vietnamese-only |
|---|---:|---|
| `ui.ts`, `projects.ts`, `company.ts`, `categories.ts`, `site-images.ts` | 211 objects | — |
| `services.ts` | 0 | 6 services, 18 bullets |
| `factory.ts` | 0 | capabilities, machinery, workflow, QC |
| `careers.ts` | 0 | 6 jobs, benefits |
| `gioi-thieu.vue` | 0 | 14 template strings |

**64% of the visible text on `/gioi-thieu` stays Vietnamese** when the site is set to English.

**Why the interest rate is high.** Nothing stops the next contributor adding another Vietnamese-only string. The debt compounds with every content addition, and it *blocks D2* — you cannot ship `/en/gioi-thieu` as a mostly-Vietnamese page.

**Repayment.** `LocalizedValue<T> = { vi: T; en: T }`. Let `tsc` enumerate the gaps. Two days of translation, one hour of type surgery.

---

## D4 — The whole manifest is a runtime import

**Interest rate: Medium** · Principal: 2h

```ts
// app/media/fallback.ts
import manifest from '../shared/media/manifest.json'   // 188 KB
export const fallbackPaths = new Map(assets.flatMap(a => …))   // built at runtime
```

Because the map is derived at runtime, the bundler cannot tree-shake the JSON. **117 KB raw / 20.6 KB gzip** of checksums, build paths and timestamps ship to every browser — and are then never read, because `fallbackPaths` is only consulted when `USE_SUPABASE_MEDIA=false`.

**Why the interest rate is medium.** The waste scales linearly with the asset count. At 160 assets it is 20 KB gzip; at 500 it is ~65 KB. The library is described as "2GB+" in `.gitignore`.

**Repayment.** Have `pnpm media:catalog` emit `fallback.generated.ts` containing only the `[path, oldPublicPath]` pairs (~14 KB raw, 1.3 KB gzip). Deletes the JSON from the app graph entirely. ~20 lines in `scripts/media/catalog.ts`.

---

## D5 — `ProjectMediaId` is the filesystem folder name

**Interest rate: Medium** · Principal: ~1 week (with the CMS)

Already correctly diagnosed by the team in `docs/media-migration/phase-5-roadmap.md` §D1:

> Because `ProjectMediaId == folder name`, renaming or reorganizing a folder changes the identifier … An identifier that can change is not a good primary key for a CMS or database.

Nothing to add to the analysis — it is right. The only note is a scheduling one: this is currently *deferred until the CMS arrives*, but the identifier is already referenced from `projects.ts` (11 records), `index.vue`, `du-an/index.vue`, `dich-vu.vue`, `nha-xuong.vue`, and `company.ts` (`seo.projects.ogImage`, `seo.services.ogImage`). Each new reference raises the migration cost.

**Repayment.** Introduce the explicit immutable key *before* the CMS, not with it. A `mediaId → folder` lookup in the generated catalog decouples them for the price of one indirection.

---

## D6 — Seven hand-written copies of the conversion surface

**Interest rate: Medium** · Principal: 1–2 days

The dark CTA banner (`bg-ink-950 px-6 py-16` + eyebrow + `h2` + buttons) is written out by hand on **seven** pages. The project card exists in **three** subtly different variants. The `eyebrow` + `h2` section header appears ~14 times.

**Why the interest rate is medium.** This is the *conversion surface*. When marketing wants to A/B the CTA copy, or add a phone number, or change "24h" to "48h", that is a seven-file change with seven chances to miss one. It also means the three project cards have already drifted (different `sizes` attributes, different hover scales, different metadata rows).

**Repayment.** Extract `CtaBanner`, `ProjectCard`, `SectionHeader`. Removes ~200 lines and puts the money copy in one file.

---

## D7 — Two logo systems, neither used correctly

**Interest rate: Low** · Principal: 2h

- `logo-white.png` contains **no white pixels** — it is a navy + orange mark for light backgrounds. It is used on `bg-ink-950` in the footer and over the dark hero.
- `logo.png` is a navy *circular badge* with a white wordmark — a different lockup — used only in the mobile menu.
- `favicon.png` is a **byte-identical duplicate** of `logo-white.png` (`sha256 8f225e01…`), referenced nowhere.
- `AppLogo.vue` is a clean inline SVG using `currentColor` — i.e. it already solves the light/dark problem — and is referenced nowhere.

The correct solution is sitting in the repo, unused, while three PNGs (273 KB total) are used incorrectly.

**Repayment.** Adopt `AppLogo.vue`. Delete `favicon.png`. Rename the survivors honestly.

---

## D8 — The debt that CI cannot see

**Interest rate: Medium** · Principal: 15m

`.github/workflows/ci.yml` runs `lint`, `lint:media`, `test`, `typecheck`. It does **not** run `pnpm build`, does not verify catalog freshness (D1), and does not `pnpm audit`.

Notably, `nuxt.config.ts` throws at config-evaluation time if `USE_SUPABASE_MEDIA=true` without a URL — a safety guard CI never exercises, because CI never evaluates the config.

**Repayment.** Three lines of YAML. This is the highest ratio of value to effort in the entire audit.

---

## D9 — Dead weight

**Interest rate: Low** · Principal: 1h

| Item | Note |
|---|---|
| `motion` | **production** dependency; verified absent from the bundle; only consumer is dead code |
| `@nuxtjs/device` | **production** dependency; not even registered in `modules` |
| `app/composables/useScrollReveal.ts` | superseded by `plugins/reveal.ts`; unreferenced |
| `app/components/TemplateMenu.vue` | Nuxt starter leftover; the **only** consumer of `@nuxt/ui` components |
| `app/components/AppLogo.vue` | should be used (D7) |
| `public/favicon.png` | duplicate |
| `factoryGallery`, `FactoryImage` | `= []` |
| `company.{primaryCtas, markets, shortPositioning}`, `quoteMailto` | unreferenced |
| `uiText.labels.all`, `uiText.projectFacts.{rooms,duration,materials,fallbackMetric}` | unreferenced |
| `mediaPresets.thumbnail` | unreferenced |
| `--color-wood`, `--color-warm` | unreferenced; `--color-warm` duplicates `wood-400` |
| `--animate-fade-in`, `--animate-fade-in-up` + keyframes | unreferenced |

`company.primaryCtas` is instructive: a well-designed CTA abstraction that no page adopted, while seven pages hand-write their CTAs (D6). Good abstractions die when they aren't wired in on day one.

---

## D10 — README is the Nuxt starter template

**Interest rate: Low, but it compounds on every new hire** · Principal: 1h

The README still advertises `starter-template.nuxt.dev` and a "Deploy this starter" Vercel button. It documents none of:

- the media pipeline or the `pnpm media:scan → catalog → optimize → upload → verify` sequence
- the `NUXT_PUBLIC_USE_SUPABASE_MEDIA` flag and what `false` means
- that `public/images/` is gitignored and ~2 GB
- that `catalog.generated.ts` must never be edited by hand
- the service-role-key policy (which `.env.example` documents beautifully and the README ignores)

`docs/media-migration/` contains excellent phase documents. **None of them are linked from anywhere.** The knowledge exists and is undiscoverable.

---

## Code smells, catalogued

| Smell | Instance |
|---|---|
| **Shotgun surgery** | Changing CTA copy touches 7 files (D6) |
| **Divergent change** | `app.vue` changes for header, menu, footer, or SEO reasons |
| **Duplicate code** | `tel:` href built inline 5×; `storageObjectUrl` ≡ `publicObjectUrl` |
| **Speculative generality** | `CtaLink.variant`, `FactoryImage`, `mediaPresets.thumbnail` — all unused |
| **Primitive obsession** | `MediaPath = string` (acknowledged in a comment; validated by function, not by type) |
| **Dead flag** | `useSupabaseMedia=false` path ships to production and is never taken |
| **Lying name** | `logo-white.png` contains no white |
| **Lying comment** | `catalog.generated.ts` header claims it is regenerated from the manifest |
| **Temporal coupling** | `media:scan --write` → `media:catalog` → `media:optimize` → `media:upload`, enforced only by documentation |
| **Feature envy** | `index.vue` re-derives `factoryCapabilities` as `heroMetrics` |

---

## Risk register

| Risk | Likelihood | Impact | Trigger | Mitigation |
|---|---|---|---|---|
| A crop/rotate ships wrong `aspect-ratio` to every gallery | **High** | High | any art-directed image change | D1 |
| Google deindexes `/du-an/*` as soft-404 duplicates | **High** | **Severe** | crawler discovers any bad slug | Report 5, S1 |
| A lead is lost because the visitor has no mail client | **Certain** | High | already happening | Report 3, U9 |
| English launch ships a 64%-Vietnamese page | High | High | anyone enables `/en` before D3 | D3 before D2 |
| A build-breaking change reaches `main` | Medium | Medium | any `nuxt.config` or provider change | D8 |
| Migration to a CMS costs 3× the estimate | Medium | High | `t()` literals + `ProjectMediaId` accumulate | D2, D5 |
| Supabase egress bill spikes | Medium | Medium | traffic on retina desktops fetching 243 KB masters | Report 4, P2 |

---

## Repayment schedule

**Pay first — cheap, and they stop the bleeding** (~half a day total)

1. **D8** — add `build`, catalog-drift check, and `audit` to CI (15 m)
2. **D1** — regenerate the catalog; assert dimensions in tests (2 h)
3. **D9** — delete dead deps, files, exports, tokens (1 h)
4. **D4** — generate `fallback.generated.ts` (2 h)

**Pay next — unblocks the business** (~1 week)

5. Soft 404 + `robots`/`sitemap` + canonical (Report 5, S1/S3/S4)
6. Real contact form + analytics (Report 3, U9)
7. **D7** — adopt `AppLogo.vue`; delete `favicon.png`

**Pay before scaling** (~2 weeks)

8. **D3** — require `en` in `LocalizedText`; translate
9. **D2** — URL-based locales + `hreflang`
10. **D6** — extract `CtaBanner`, `ProjectCard`, `SectionHeader`

**Pay before the CMS**

11. **D5** — decouple `ProjectMediaId` from the folder name
12. **D10** — write a real README; link `docs/media-migration/`

---

## A closing observation

The debt in this repository is **not distributed evenly**, and that is the most useful thing to know about it.

`app/media/`, `app/shared/media/`, and `scripts/media/` are close to debt-free: checksummed, schema-versioned, CI-guarded, documented across five phase documents, and covered by 26 tests. The one defect there (D1) is a *process* failure — someone forgot to run a command — not a design failure.

Everything in `app/pages/` and `app/data/` was written to a different standard: no tests, no error handling, no telemetry, duplicated seven ways, with a type system that permits the exact bug that occurred.

The team demonstrably knows how to build the first kind of code. The recommendation is not "learn to do better" — it is **apply the discipline you already have to the layer that faces the customer.** Start with D8: make CI check the things you already believe are true.
