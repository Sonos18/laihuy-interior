# Phase 0 — Architecture Audit: Image Management (laihuy-interior)

**Status:** Complete — awaiting review/approval before Phase 1
**Date:** 2026-07-04
**Method:** Every number below was measured directly from the repository (file hashes, image headers, full-text reference scan of `app/`). Nothing is estimated unless marked.

## Objective

Establish a complete, verified picture of how images are stored, referenced, and rendered today, so that Phases 1–4 (Storage architecture, Media Layer, migration, optimization pipeline) operate on facts, and so the hardcoded-path table below can serve directly as the migration checklist.

---

## 0.1 Stack verification (discrepancies to flag first)

| Stated in brief | Found in repo | Impact |
|---|---|---|
| Nuxt 3 | **Nuxt 4.3.1** (`app/` directory structure, `compatibilityDate: 2025-01-15`) | None negative — plan targets Nuxt 4 conventions (`app/composables`, `shared/`) |
| Nuxt Image | **`@nuxt/image` is NOT installed** | Must be added in Phase 2; today all rendering is raw `<img>` |
| Supabase | **No Supabase packages, config, or env vars in this repo** | Supabase project URL/keys are a Phase 1 prerequisite |
| Deploy on Vercel | No `vercel.json` / deploy workflow in repo (CI = lint + typecheck only) | Zero-404 gate (Decision #10) will hook into `pnpm build` so it runs wherever the build runs, including Vercel |

All routes are prerendered via `routeRules` — the site is static HTML at deploy time. This is favorable: image URLs are resolved once at build time, and the zero-404 gate can validate the complete final HTML output.

---

## 0.2 Current image inventory

**Totals: 47 image files, 71.5 MB. Formats: 36 JPG (37.7 MB), 11 PNG (33.8 MB). Zero WebP, zero SVG.**

### Folder structure (as-is)

```
public/
├── favicon.png                  69 KB   ← ORPHAN (duplicate, see below)
├── logo_favicon.png             35 KB   ← the favicon actually in use (app.vue head)
└── images/
    ├── about_workspace.jpg     1.5 MB   2048×2560
    ├── banner_home.jpg         1.6 MB   2560×1636
    ├── company-story.jpg       0.4 MB    900×603
    ├── laihuy-logo.jpg         0.1 MB             ← ORPHAN (0 references)
    ├── logo.png                0.1 MB    500×500
    ├── logo_white_bg-removebg-preview.png  69 KB  500×500
    ├── logo_white_bg.jpg       0.2 MB             ← ORPHAN (0 references)
    ├── map_address.png         0.3 MB   1105×637
    └── projects/
        ├── apartment/                             ← EMPTY directory
        ├── renovation/                            ← EMPTY directory
        ├── hotel/codi/          3 files  1.9 MB
        ├── hotel/eo_gio/        6 files 33.2 MB   ← 46 % of total library size
        ├── house/anhduy_house/  9 files  7.3 MB
        ├── house/chily_house/   8 files  8.0 MB
        ├── villa/codi_villa/    6 files 14.6 MB
        └── office/              5 files  2.1 MB   ← files sit directly in category (no project folder)
```

### Duplicate files (identical MD5)

| File A | File B | Verdict |
|---|---|---|
| `public/favicon.png` | `public/images/logo_white_bg-removebg-preview.png` | Byte-identical. `favicon.png` is referenced nowhere (the `<link rel="icon">` points to `/logo_favicon.png`) → delete `favicon.png`, keep one copy |

### Orphaned files (on disk, referenced by nothing)

| File | Size | Action |
|---|---|---|
| `images/laihuy-logo.jpg` | 0.10 MB | Delete — do not migrate |
| `images/logo_white_bg.jpg` | 0.18 MB | Delete — do not migrate |
| `favicon.png` (root) | 0.07 MB | Delete — duplicate + unreferenced |

Conversely: **every path referenced in code resolves to a file on disk — zero broken references today.** Clean starting state.

### Largest files / most urgent WebP conversions

| File | Dimensions | Size | Problem |
|---|---|---|---|
| `projects/hotel/eo_gio/image_1.png` | 3200×2000 | 6.71 MB | Photo stored as PNG (wrong format) |
| `projects/hotel/eo_gio/reception.png` | 3200×2000 | 6.64 MB | Photo as PNG — **and used as the homepage hero (LCP)** |
| `projects/hotel/eo_gio/image_2.png` | 3200×2000 | 6.30 MB | Photo as PNG |
| `projects/hotel/eo_gio/toilet.png` | 2500×2500 | 5.77 MB | Photo as PNG |
| `projects/hotel/eo_gio/bed.png` | 2560×1682 | 3.95 MB | Photo as PNG |
| `projects/hotel/eo_gio/table.png` | 2560×1829 | 3.80 MB | Photo as PNG |
| `projects/villa/codi_villa/*.jpg` (6 files) | **6000×4000** (24 MP) | 2.3–2.8 MB each | Straight-from-camera resolution; max useful display width ≈ 1600 px |

**All 47 files are WebP candidates** (no transparency requirements found in content imagery; the logos with transparency stay in `/public`, see §0.7). The six `eo_gio` PNGs alone (33.2 MB) should compress to roughly 2–3 MB as WebP at display resolution. Realistic post-pipeline library size: **~8–12 MB from 71.5 MB** (estimate).

---

## 0.3 Image usage analysis — every reference, classified

Full scan of `app/` (58 hardcoded `/images/…` occurrences in 11 files) plus template/CSS/config sweep:

| Usage type | Count | Locations | Notes |
|---|---|---|---|
| **TS constants (data files)** | **44 refs (76 %)** | `app/data/projects.ts` (37), `app/data/company.ts` (7) | The dominant pattern — galleries, covers, section images |
| **Template `<img :src>` in pages** | 11 refs | `index.vue` (2), `gioi-thieu.vue` (2), `lien-he.vue` (2), `dich-vu.vue` (1), `du-an/index.vue` (1), `du-an/[slug].vue` (1), `nha-xuong.vue` (1), `tuyen-dung.vue` (1) | Mostly passed to `AppHero`'s `bgImage` prop or standalone `<img>` |
| **Template `<img>` in root layout** | 3 refs | `app.vue` (header logo, footer logo ×2) | Brand chrome, not content |
| **`<NuxtImg>` / `<NuxtPicture>`** | 0 | — | Module not installed |
| **CSS `background-image`** | 0 | only a `linear-gradient` in `main.css` | No image URLs in CSS — good |
| **Inline styles with URLs** | 0 | — | |
| **Markdown / JSON content** | 0 | — | No content files reference images |
| **Config (`nuxt.config.ts`, `app.config.ts`)** | 0 | — | Favicon is linked in `app.vue` head: `/logo_favicon.png` |

**Key structural fact:** components (`AppHero`, `BaseImage`) take image paths as **props** — no component hardcodes a path. Coupling to `/public` lives entirely in the two data files, eight pages, and `app.vue`.

---

## 0.4 Component dependency analysis

| Layer | Files touching images | Hardcoded paths? | Migration action |
|---|---|---|---|
| **Shared components** | `AppHero.vue` (renders `bgImage` prop via `<img>`), `BaseImage.vue` (lazy-load wrapper — **currently used by 0 pages, dead code**), `AppLogo.vue` (no image refs) | No | Become consumers of the Media Layer; `BaseImage` is a ready-made seam to revive as the standard media component (it already does IntersectionObserver lazy-load + skeleton + width/height props) |
| **Pages** (8) | `index`, `gioi-thieu`, `dich-vu`, `du-an/index`, `du-an/[slug]`, `nha-xuong`, `tuyen-dung`, `lien-he` | Yes — 11 refs | Replace literals with Media Layer calls / path constants |
| **Layout root** | `app.vue` | Yes — 3 refs (logos) + favicon link | Logos likely stay in `/public` (§0.7) → possibly zero changes |
| **Data** | `data/projects.ts` (37), `data/company.ts` (7) | Yes — 44 refs | The bulk of the migration; mechanical rewrite via manifest |
| **Composables** | `useLanguage`, `useScrollReveal` | No | Untouched |
| **Utilities / shared types** | `shared/types/project.ts` | Type has `image/gallery/thumbnail/images` string fields | Type tightening to `MediaPath` in Phase 2 |

**Files requiring modification: 11 existing** (2 data + 8 pages + `app.vue` — and `app.vue` drops out if logos stay local, → **10**) plus `nuxt.config.ts`, plus new files (composable/util, provider, scripts, `.env.example`).

## 0.5 Nuxt Image audit

- `@nuxt/image`: **not installed, no provider, no `image` key in config.** Greenfield — no legacy provider config to unwind.
- `runtimeConfig`: **absent entirely** from `nuxt.config.ts`; no `.env` / `.env.example` exist. Will be introduced in Phase 2 (`NUXT_PUBLIC_SUPABASE_URL`, `NUXT_PUBLIC_USE_SUPABASE_MEDIA`).
- Current rendering: raw `<img>`, `loading="lazy"` only inside unused `BaseImage`; the homepage hero (`index.vue:36`, the 6.6 MB PNG) has **no** `fetchpriority` and pages have no preload links — LCP is badly served today.
- **Centralization opportunity (high value, low effort):** with 0 existing `NuxtImg` usages and all components prop-driven, the Media Layer can be introduced without fighting any existing abstraction. `BaseImage.vue` is a natural component shell to adopt.

## 0.6 Hardcoded path audit — grouped by directory (the migration checklist)

| Path prefix | Refs | Referencing files |
|---|---|---|
| `/images/projects/hotel/eo_gio/` | 11 | `projects.ts` (6), `company.ts` (2), `index.vue`, `gioi-thieu.vue`, `du-an/index.vue` |
| `/images/projects/house/anhduy_house/` | 10 | `projects.ts` (9), `lien-he.vue` (1) |
| `/images/projects/house/chily_house/` | 8 | `projects.ts` (8) |
| `/images/projects/villa/codi_villa/` | 6 | `projects.ts` (6) |
| `/images/projects/hotel/codi/` | 5 | `projects.ts` (3), `company.ts` (1), `dich-vu.vue` (1) |
| `/images/projects/office/` | 5 | `projects.ts` (5) |
| `/images/about_workspace.jpg` | 5 | `company.ts` (2), `index.vue`, `nha-xuong.vue`, `tuyen-dung.vue` |
| `/images/logo_white_bg-removebg-preview.png` | 2 | `app.vue` (2) |
| `/images/company-story.jpg` | 2 | `company.ts`, `gioi-thieu.vue` |
| `/images/map_address.png` | 2 | `company.ts`, `lien-he.vue` |
| `/images/banner_home.jpg` | 1 | `du-an/[slug].vue` |
| `/images/logo.png` | 1 | `app.vue` |
| **Total** | **58** | 11 files |

Cross-page reuse to be aware of: `about_workspace.jpg` (5 pages/contexts), `eo_gio/reception.png` (homepage hero + 2 service cards), `reception_desk.jpg` (3 contexts) — one migrated file fixes several references, and the manifest must be keyed by old path, not by page.

## 0.7 Public asset classification

**Category A — permanent static assets (stay in `/public` forever):**

| File | Reason |
|---|---|
| `logo_favicon.png` | Favicon — belongs to app shell; referenced from `app.vue` head |
| `images/logo.png`, `images/logo_white_bg-removebg-preview.png` | Header/footer brand chrome: tiny (≤130 KB), transparent PNGs, change ~never, part of the UI not the content. Migrating them buys nothing and adds a network dependency to every page's shell |

**Category B — migratable content assets (move to Supabase `media` bucket): 41 files, ~70.9 MB**

| Group | Files | Size | Target folder |
|---|---|---|---|
| Project photos (`images/projects/**`) | 37 | 67.1 MB | `media/projects/{category}/{project}/` |
| `banner_home.jpg` | 1 | 1.6 MB | `media/hero/` |
| `about_workspace.jpg`, `company-story.jpg` | 2 | 1.9 MB | `media/company/` |
| `map_address.png` | 1 | 0.3 MB | `media/company/` |

**Category C — delete (not migrated):** the 3 orphans from §0.2 (0.35 MB).

Post-migration `/public` footprint: **4 files, ~0.3 MB** (favicon + 2 logos + `robots`-type assets as added later).

## 0.8 Future Media Layer impact estimate

| Work item | Scope |
|---|---|
| Existing files to modify | **10** (`projects.ts`, `company.ts`, 8 pages) — `app.vue` untouched if logos stay local |
| References to rewrite | 55 of 58 (the 3 logo refs stay) |
| New composables/utilities | 1 media-URL layer (`useMediaUrl` / `media-url.ts` util) + 1 typed path module |
| Runtime config additions | `public.supabaseUrl`, `public.useSupabaseMedia` (feature flag) — both via `NUXT_PUBLIC_*` env vars |
| Modules/providers | Install `@nuxt/image` + one custom provider file delegating to the media-URL layer |
| Build tooling | Sharp optimize/upload scripts + zero-404 validation script wired into build |

**Safest migration path** (validated by this audit): rewrite the two data files first (76 % of refs, typecheck-protected, feature-flag-reversible), then the 8 pages (11 refs, mostly `AppHero` props), leave `app.vue` alone. At every step the flag `USE_SUPABASE_MEDIA=false` restores `/public` serving instantly because old files remain in place until Phase 4 sign-off.

## 0.9 Risks discovered in the current codebase

| # | Risk | Evidence | Severity | Handling |
|---|---|---|---|---|
| 1 | **Inconsistent naming** — `snake_case` + romanized Vietnamese (`gieng_troi`, `phong_be_trai_2`), kebab (`company-story`), artifact names (`logo_white_bg-removebg-preview`), generic names (`image_1`, `phong.jpg`) | Inventory §0.2 | Medium | Phase 1 defines naming convention + a rename map (old → new readable English kebab-case); approved before upload |
| 2 | **Structural inconsistency** — `office/` files skip the per-project folder level; `hotel/codi` vs `villa/codi_villa` suffix drift | Folder tree §0.2 | Low | Normalize in Phase 1 target structure |
| 3 | **Oversized originals** — 24 MP camera files, 6.7 MB PNG photos; homepage LCP is a 6.6 MB PNG | §0.2 | **High (already hurting prod today)** | Phase 4 pipeline caps longest edge + WebP; hero gets eager+preload treatment in Phase 2 |
| 4 | **Wrong format** — photographic content as PNG (all 6 `eo_gio` files) | §0.2 | High | WebP conversion |
| 5 | Duplicate + orphan files (4 files) | §0.2 | Low | Delete in Phase 3, listed in manifest as `skipped` |
| 6 | **Empty categories** — `apartment/`, `renovation/` exist in UI category list but have no assets | §0.2 | Low | Confirm intended; empty folders need no migration but the category list should not 404 if projects are added later |
| 7 | **Alt-text gaps** — `AppHero` hardcodes `alt=""` (hero images carry content meaning on 6 pages); `gioi-thieu.vue:55` uses generic `alt="Lai Huy Interior"` | §0.3 grep | Medium (SEO/a11y for an image-led business) | Media Layer makes `alt` a required field on content images (Phase 2); localized alt already exists on newer pages — extend the pattern |
| 8 | **No width/height on most rendered `<img>`** → CLS risk currently masked by fixed-height containers | Template scan | Medium | Pipeline records dimensions per variant; Media Layer emits them |
| 9 | `BaseImage.vue` is dead code (0 usages) | §0.4 | Info | Revive as the media component in Phase 2 or delete — decision recorded in Phase 2 design |
| 10 | **No Supabase credentials/config in repo** | §0.1 | **Blocker-adjacent** | Phase 1 prerequisite: project URL + service key available locally |
| 11 | Free-plan CDN detail (verified against current Supabase docs): **Smart CDN auto-invalidation is Pro-only.** On Free, an overwritten file can serve stale from CDN/browser cache until TTL expiry. With Decision #6 (readable names, overwrites possible) this makes **the cache strategy a first-class Phase 1 design item** (TTL choice + version-param strategy in the URL layer) | Supabase docs `storage/cdn/smart-cdn` | Medium | Designed in Phase 1/2 — flagged now so it's not discovered after upload |

## 0.10 Findings summary & recommendations

**Findings — the five that matter:**
1. The codebase is **exceptionally well-positioned**: 76 % of references sit in two typed data files, components are prop-driven, zero CSS/config image coupling, zero broken references, all routes prerendered.
2. The performance problem is **already live in production**: a 6.6 MB PNG homepage hero and 24 MP gallery JPGs — migration + Sharp pipeline fixes a real user-facing issue, not just repo hygiene.
3. 4 files are dead weight (orphans/duplicate) and must not be migrated.
4. Naming needs a normalization pass before upload (readable-filename decision makes this the moment to fix it — renames are free now, expensive after URLs are public).
5. On the Free plan there is no automatic CDN invalidation — the readable-filename + overwrite model needs an explicit cache strategy (to be designed in Phase 1, options: conservative TTL vs. version query param from the URL layer).

**Recommendations:**
- Keep favicon + 2 logos in `/public` (Category A); migrate 41 content files; delete 4.
- Treat `data/projects.ts` + `data/company.ts` as the primary migration surface; pages second; `app.vue` never.
- Adopt `@nuxt/image` in Phase 2 with a custom provider that delegates to the single URL layer (satisfies Decision #5 while keeping `<NuxtImg>` ergonomics).
- Fix naming per a written convention in Phase 1 (English kebab-case proposed; Vietnamese-romanized names like `phong-khach` acceptable if the team prefers — needs a decision).
- Record image dimensions in the manifest during Phase 4 pipeline runs; thread them through the Media Layer for CLS.

**Migration readiness score: 8.5 / 10.**
Deductions: no Supabase wiring in the repo yet (−1), naming/cache decisions still open (−0.5). Nothing architectural blocks the locked decisions #1–#10; every decision is implementable as specified.

**Blockers:** none hard. Two prerequisites before Phase 1 implementation can *execute* (design can proceed now):
1. Supabase project URL + service-role key available in local env (never committed).
2. Sign-off on the rename map style (English vs. romanized-Vietnamese filenames) — affects public URLs, so it must precede first upload.

---

*Phase 0 ends here. Phase 1 (Storage architecture: bucket/folder/naming conventions, upload workflow, Free-plan cache strategy) will begin after this audit is approved.*
