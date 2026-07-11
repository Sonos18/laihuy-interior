# Report 8 — Code Quality Review

## Baseline

```console
$ pnpm lint        → clean
$ pnpm lint:media  → [media-guard] OK
$ pnpm test        → 26 passed (1 file)
$ pnpm typecheck   → clean
$ pnpm build       → succeeds
```

```
app/          ~3,000 lines across 14 .vue + 20 .ts
scripts/      ~900 lines
tests/        216 lines, 26 cases, 1 file
```

Everything green. The problems below are the ones a green CI cannot see.

---

## What is genuinely well written

**Comments explain *why*, not *what*.** This is the strongest habit in the codebase:

```ts
// app/media/project-media.ts
// Presentation glue between the media catalog (filesystem-authoritative) and the
// business layer. A business Project references media only by its stable `mediaId`;
// these helpers resolve that id into catalog assets and pair them with business alt
// text at the point of use. Neither the catalog nor projects.ts stores the other's data.
```

```ts
// app/media/presets.ts
/**
 * `@nuxt/image` sizes syntax. Every segment MUST be breakpoint-prefixed (sm:/md:/…) —
 * a bare default segment makes @nuxt/image v2 emit broken `1w`/`2w` srcset entries.
 */
```

That second one records a hard-won workaround with the reason. Most codebases lose that knowledge.

**Naming is consistent and domain-accurate.** `snapToVariantWidth`, `projectCoverAsset`, `withAlt`, `assertManifestSchemaVersion`, `assertNotCI`. No `utils.ts`, no `helpers.ts`, no `data2`.

**Constants are named, not magic.** `MEDIA_VARIANT_WIDTHS`, `MASTER_MAX_EDGE`, `MANIFEST_SCHEMA_VERSION`, `CACHE_CONTROL_SECONDS = '31536000' // 1 year; safe because objects are immutable (A1)` — with a cross-reference to the design doc.

**TypeScript is used properly.** Zero `any` in the entire `app/` tree. Discriminated helpers (`ParsedMediaFilename | null`), `satisfies` for data literals, `as const` for tuples, and a generated string-literal union (`ProjectMediaId`) that turns a typo into a compile error. Type guards are real guards:

```ts
.filter((entry): entry is { project: Project, cover: MediaAsset } => entry.cover !== undefined)
```

**Errors are loud and actionable.**

```ts
throw new Error(
  `[media] Unsupported manifest schemaVersion: ${manifest.schemaVersion ?? '(missing)'} `
  + `(expected ${MANIFEST_SCHEMA_VERSION}). Regenerate with 'pnpm media:scan --write' `
  + 'or migrate the manifest to the current schema.'
)
```

It says what broke, what was expected, and what to run. `nuxt.config.ts` fails the build outright if `USE_SUPABASE_MEDIA=true` without a URL.

---

## Q1 — The test suite guards paths but not values

**Severity: High** · Difficulty: Low · ~1h · *see Report 2, A1/A2*

26 tests pass against a catalog whose dimensions are **59% wrong**. `tests/media.test.ts:193` compares only `manifestPaths.has(asset.path)`.

This is the single most consequential quality gap: the repository has a strong testing culture aimed at the wrong assertion. Fix the assertion, and add a CI step that regenerates the catalog and fails on any diff.

**Test coverage overall:** 26 cases, **all** in `tests/media.test.ts`, **all** covering the media layer. There is not a single test for:

- `useLanguage()` — `t()` / `ta()` fallback behaviour, the `isLocale` guard
- `projectCover` / `projectImages` / `withAlt`
- any component (`MediaImage` skeleton state, `AppGalleryGrid` aspect ratios, `AppHero`)
- any page (`[slug]` 404 branch, `/du-an` filtering)

The media layer is the *least* likely thing to break — it is pure, deterministic, and generated. The untested parts are where the bugs in this audit actually live.

---

## Q2 — Files that do too much

**Severity: Medium** · Difficulty: Medium · ~2 days

| File | Lines | Responsibilities |
|---|---:|---|
| `app/pages/index.vue` | 484 | 7 independent marketing sections + SEO + hero preload |
| `app/pages/du-an/[slug].vue` | 434 | 404 page, hero, facts ×2, 5 content sections, gallery, CTA, related |
| `app/app.vue` | 373 | header, scroll state, mobile menu, locale toggle ×2, footer, global SEO |
| `app/pages/lien-he.vue` | 272 | contact cards, form + submit logic, map, address list |
| `app/data/projects.ts` | 643 | 11 projects × ~58 lines of nested bilingual content |

`app.vue` is the clearest violation of "one file, one responsibility": three unrelated UI regions with three unrelated state concerns (`isScrolled`, `isMobileMenuOpen`, `locale`). Extract `AppHeader.vue`, `AppMobileMenu.vue`, `AppFooter.vue`.

`projects.ts` will become unreviewable around 25–30 projects. Split to `data/projects/<slug>.ts` + a barrel, or accept it as the cost of deferring the CMS.

---

## Q3 — Duplicated UI, duplicated data

**Severity: Medium** · Difficulty: Medium · ~1–2 days

**Duplicated data.** `index.vue:27` defines `heroMetrics` — the same four factory metrics as `data/factory.ts` `factoryCapabilities`, with **different labels and different translation coverage** (inline is bilingual; the data module is Vietnamese-only). Two sources of truth for "3.000 m²".

**Duplicated UI.** Counted across pages:

| Block | Occurrences | Files |
|---|---:|---|
| Dark CTA banner (`bg-ink-950 px-6 py-16` + eyebrow + h2 + buttons) | **7** | `index`, `du-an/index`, `[slug]`, `nha-xuong`, `dich-vu`, `gioi-thieu`, `tuyen-dung` |
| `eyebrow` + `h2` + optional lead (section header) | **~14** | every page |
| Project card | **3** | `index:228`, `du-an/index:88`, `[slug]:404` — three subtly different variants |
| Metric/fact card | **4** | `index`, `gioi-thieu`, `nha-xuong`, `[slug]` |
| Locale toggle | **2** | `app.vue:107` (desktop), `app.vue:202` (mobile) |

Extracting `CtaBanner`, `SectionHeader`, and `ProjectCard` removes roughly 200 lines of template and — more importantly — puts the **conversion copy in one editable place**.

**Duplicated logic.** `` `tel:${company.phone.replaceAll(' ', '')}` `` appears **five times** (`app.vue:126,302`, `index.vue:470`, `[slug].vue:372`). Add `company.phoneHref` once.

`storageObjectUrl` exists twice with identical bodies — `app/media/url.ts:30` and `scripts/media/lib.ts:37` (as `publicObjectUrl`). Intentional (the scripts must not import from `app/media/`)? Possibly, but `scripts/media/lib.ts` already imports `MEDIA_BUCKET` and `assertManifestSchemaVersion` from `app/shared/`, so the boundary is already crossed. Move it to `app/shared/media/` and import it in both.

---

## Q4 — Dead code

**Severity: Medium** · Difficulty: Low · ~1h

Verified zero references outside their own definition:

```
app/composables/useScrollReveal.ts    entire file (and the `motion` dependency with it)
app/components/TemplateMenu.vue       entire file (Nuxt starter leftover, links to starter-template.nuxt.dev)
app/components/AppLogo.vue            entire file — an SVG logo that *should* be used (Report 3, U3)
public/favicon.png                    byte-identical duplicate of logo-white.png (sha256 8f225e01…)
data/factory.ts    factoryGallery     `= []`, plus its `FactoryImage` type
data/company.ts    primaryCtas, markets, shortPositioning, quoteMailto
data/ui.ts         labels.all, projectFacts.{rooms, duration, materials, fallbackMetric}
media/presets.ts   mediaPresets.thumbnail
media/project-media.ts  getProjectMedia (exported; only used internally)
package.json       motion, @nuxtjs/device
main.css           --color-wood, --color-warm (both unreferenced; --color-warm duplicates wood-400)
```

`CtaLink` type and `company.primaryCtas` are especially telling — a well-designed abstraction for CTA variants that no page ever used, while seven pages hand-write their CTAs instead.

---

## Q5 — Dead styles and a broken hover affordance

**Severity: Low** · Difficulty: Trivial · ~30m

- **`index.vue:116`**: `group-hover:translate-x-1` on the arrow icon inside `<NuxtLink class="btn-primary">`. That link has no `group` class. Verified: the only `group` ancestors in the codebase are on project cards. The arrow never moves. Add `group` to the link.
- **`main.css:35-36`**: `--animate-fade-in-up` and `--animate-fade-in` are declared in `@theme` (generating `animate-fade-in-up` / `animate-fade-in` utilities). Neither utility is used anywhere — the site uses `v-reveal` instead. The `@keyframes` blocks are dead too.
- **`app.vue:134`**: `class="btn-primary py-3"` overrides the shared `py-3.5`, making the header CTA 4 px shorter than every other primary button. Either it's intentional (then encode it as a `size` variant) or it's a leftover.
- **`.metric-card` + `transition-colors hover:border-wood-400`** at `index.vue:176` re-implements `.industrial-card` inline.

---

## Q6 — Error handling and observability

**Severity: Medium** · Difficulty: Low

**The app has no error handling.** There is no `error.vue`, no `app/error.vue`, no `onErrorCaptured`, no `NuxtErrorBoundary` anywhere. A thrown error in any page renders Nuxt's default error page. Once `createError` is used for the 404 (Report 5, S1), a custom `error.vue` becomes necessary — and it should be branded, bilingual, and link back to `/du-an` and `/`.

**There is no logging or telemetry of any kind.** No analytics, no error reporting (Sentry et al.), no RUM. `console.warn` appears exactly once, correctly gated:

```ts
// app/composables/useMediaUrl.ts:15
if (import.meta.dev && !context.useSupabaseMedia && !fallbackPaths.has(path)) {
  console.warn(`[media] No /public fallback for "${path}" …`)
}
```

Good instinct, dev-only. But it means **nobody would know if the site broke in production.**

**Scripts handle errors well.** `upload.ts` classifies every outcome, collects `problems[]`, and `process.exit(1)`s on any. `readManifest()` asserts the schema version on every load. The contrast with the app layer is stark.

---

## Q7 — A latent reactivity trap

**Severity: Low** · **Confidence: Medium — likely safe today, verify before relying on it**

`app/pages/du-an/[slug].vue:19-36`:

```ts
const route = useRoute()
const slug = Array.isArray(route.params.slug) ? route.params.slug[0] : route.params.slug
const project = projects.find(item => item.slug === slug)      // plain const, not computed
const allImages: MediaImage[] = projectImages(project?.mediaId, project?.name ?? '')
const leadImage = allImages[0]
const galleryImages = allImages.slice(1)
const relatedProjects = relatedCandidates.slice(0, 3)          // also non-reactive
```

`project`, `allImages`, `leadImage`, `galleryImages`, and `relatedProjects` are all computed **once at setup** from a non-reactive `route.params` read.

This is safe **only if** the page component remounts on every slug change. Nuxt's `<NuxtPage>` keys pages by route by default, so navigating `/du-an/a` → `/du-an/b` (which the "Related projects" section does on every detail page) should remount. But this relies on a framework default that a future `pageKey` customisation could silently break — at which point clicking a related project would keep the old content while the URL changes.

**Verify:** client-side navigate between two related projects and confirm the gallery and facts update.
**Harden regardless:** wrap them in `computed()`, or set `definePageMeta({ key: route => route.fullPath })` explicitly so the intent is recorded.

---

## Q8 — The type system permits the bug it was meant to prevent

**Severity: High** · Difficulty: Medium · *see Report 2, A4*

```ts
export type LocalizedValue<T> = T | { vi: T; en?: T }
```

A bare Vietnamese string satisfies `LocalizedText`. So does `{ vi }` with `en` omitted. The compiler cannot tell "translated" from "not translated", and three data modules plus one whole page drifted to Vietnamese-only.

This is the clearest example in the repo of a type that *describes* the data instead of *constraining* it. Change it to `{ vi: T; en: T }` and `tsc` will enumerate every untranslated string for you. Keep `t()`'s runtime fallback as defence in depth, not as the mechanism.

---

## Q9 — CI does not build

**Severity: Medium** · Difficulty: Trivial · ~15m

`.github/workflows/ci.yml` runs `lint`, `lint:media`, `test`, `typecheck`. It never runs `pnpm build`.

A change that typechecks but breaks the Nitro build, the prerender pass, or the custom `@nuxt/image` provider would reach `main` undetected. Note that `nuxt.config.ts` *throws* at config-evaluation time when `USE_SUPABASE_MEDIA=true` without a URL — a guard CI never exercises.

Add:

```yaml
- name: Build
  run: pnpm run build

- name: Media catalog is up to date
  run: pnpm media:catalog && git diff --exit-code app/media/catalog.generated.ts

- name: Audit
  run: pnpm audit --audit-level=high
```

The middle step is the one that would have caught the 59% drift.

---

## Q10 — Repository hygiene

**Severity: Low** · Difficulty: Trivial · ~30m

- **`README.md` is the unmodified Nuxt starter template.** It advertises `starter-template.nuxt.dev` and a "Deploy this starter" button. It documents none of: the media pipeline, `pnpm media:*`, the `USE_SUPABASE_MEDIA` flag, the `.env` requirements, or the fact that `public/images/` is gitignored and 2 GB. A new engineer cannot start.
- **`.claude/projects/…/memory/feedback-round2.md` is tracked in git.** Agent scratch memory does not belong in version control.
- **`.claude/worktrees/` is untracked and not gitignored.**
- **`.env` contains `NUXT_PUBLIC_SUPABASE_KEY`**, absent from `.env.example` and referenced nowhere in the codebase.
- **Content inconsistency**: `careers.ts` locates jobs in "Bến Tre" / "Long Hậu"; `company.ts` locates the business in "Tây Ninh" / "Vĩnh Long" (post-2025 provincial names). One of them is stale.

---

## Priority summary

| ID | Issue | Severity | Effort |
|---|---|---|---|
| Q1 | Tests assert paths, not dimensions; 26 pass on a 59%-stale file | **High** | 1h |
| Q8 | `LocalizedText` permits untranslated strings | **High** | 2–3d |
| Q9 | CI never builds, never checks catalog drift, never audits | Medium | 15m |
| Q6 | No `error.vue`, no error reporting, no telemetry | Medium | 0.5d |
| Q3 | `CtaBanner` ×7, `ProjectCard` ×3, `heroMetrics` duplicates data | Medium | 1–2d |
| Q2 | `index.vue` 484 lines, `app.vue` 373 lines | Medium | 2d |
| Q4 | ~14 dead exports, 3 dead components, 2 dead prod deps | Medium | 1h |
| Q5 | Dead `group-hover`, dead keyframes, one-off `py-3` | Low | 30m |
| Q7 | Non-reactive `project` in `[slug].vue` *(medium confidence)* | Low | 30m |
| Q10 | Starter README, tracked agent memory, `.env` drift, address mismatch | Low | 30m |

**Start with Q1 + Q9.** Together they are ~90 minutes and they close the exact hole through which the largest defect in this repository (the 59% catalog drift) reached `main` unnoticed. Everything else is cleanup.
