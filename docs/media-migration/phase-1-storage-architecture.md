# Phase 1 — Storage Architecture

**Status:** Design complete — awaiting review/approval before Phase 2
**Date:** 2026-07-04
**Inputs:** Phase 0 audit (`phase-0-audit.md`), locked decisions #1–#10, and two approved adjustments:
- **A1 — No overwrites.** Replacing an image = uploading a new versioned filename (`-v2`, `-v3`, …) and updating the stored path. Objects in Storage are immutable once uploaded.
- **A2 — Key separation.** The Nuxt app never sees the service-role key. It is used only by local migration/upload scripts (and future server-side admin endpoints). The frontend needs the project URL (and later, for the CMS, the anon/publishable key — not before).

**Revision 2 (2026-07-04), approved refinements incorporated below:**
- **R1 — Semantic hierarchy.** Folder layout conveys meaning; no tool may assume a fixed directory depth. Deeper structures (room-level folders, nested galleries) are valid without tooling changes.
- **R2 — Vector assets.** SVG is a first-class asset kind: logos/icons/vectors are optimized (SVGO) and uploaded as-is — never converted to WebP, no responsive variants.
- **R3 — Canonical manifest.** `manifest.json` is the system of record for every managed asset, carrying full metadata (dimensions, checksums, category, timestamps, variants, version lineage) sufficient to seed the future `media` table without re-inspection.

> ## Revision 3 (2026-07-05) — business-driven reorganization: the FILESYSTEM is now canonical
>
> The image library was reorganized as a business decision. **This supersedes §1.2 (folder structure) and §1.3's rename map entirely.** Do not translate or preserve the old `hotel/villa/house/office` taxonomy or the old rename map — both are discarded.
>
> - **The filesystem under `public/images` is the single source of truth.** `scripts/media/scan.ts` discovers every project, nested gallery, and directly-placed image automatically (no fixed depth), and regenerates `manifest.json` from scratch. `pnpm media:scan --write` is the canonical regeneration command. Folder names are the official identifiers.
> - **Storage taxonomy is by business domain (entity), not UI location.** Top-level folders are now **`projects/`, `company/`, `brand/`** (`MEDIA_TOP_LEVEL_FOLDERS`). The UI-location names `hero/`, `services/`, `blog/` are retired.
>   - `public/images/projects/<project>/[<gallery>/…]<file>` → `projects/<project>/[<gallery>/]<file>`
>   - `public/images/hinh-xuong-lai-huy/<file>` → `company/workshop/<file>` — the company's own workshop gallery is a **`company` collection, not a project** (business rule), consumed directly by the Nhà xưởng page.
>   - loose `banner_home` → `brand/banner-home.webp`; `about_workspace`, `company-story`, `map_address` → `company/*`.
> - **Filenames are normalized deterministically** at scan time: lowercase, diacritics stripped, any non-`[a-z0-9]` run → `-`, extension → `.webp`. E.g. `P3 03.png`→`p3-03.webp`, `P.HOP1.jpg`→`p-hop1.webp`, `1.2.png`→`1-2.webp`. The `{name}[-v{N}][-w{width}]` grammar (§1.3) is unchanged.
> - **Current inventory:** 160 assets — 145 project images across 11 projects, 11 `company/workshop`, 3 other `company`, 1 `brand`.
> - **Typed business metadata is NOT filesystem-derived.** The filesystem regenerates image references, gallery hierarchy, dimensions, storage paths, and manifest entries only. Project descriptions, SEO, categories, and marketing copy remain hand-maintained business content (see Phase 2 rev 3).

---

## Objective

Define the complete Storage-side architecture — bucket, folder layout, naming grammar, versioning, cache policy, access policy, and upload workflow — precisely enough that Phase 3 (migration) and Phase 4 (pipeline) implement it without further design decisions.

---

## 1.1 Bucket design

**Exactly one bucket: `media`** (Decision #2).

| Setting | Value | Reasoning |
|---|---|---|
| Visibility | **Public** | All content is public marketing imagery already served to anonymous visitors. Public buckets serve objects at a stable keyless URL (`/storage/v1/object/public/media/...`) straight from Supabase's CDN — no tokens in prerendered HTML, nothing to expire |
| File size limit | **10 MB** | Post-pipeline files are ≤ ~1 MB; the limit is a tripwire against accidentally uploading raw 24 MP camera files (Phase 0 risk #3) |
| Allowed MIME types | `image/webp`, `image/jpeg`, `image/png`, `image/svg+xml` | The bucket stores exactly what the pipeline produces: WebP for photographic/raster content, SVG for vectors (R2). Anything else (video, PDF) is a policy decision for a future phase, not an accident. SVG hygiene: only trusted, script-audited files enter the bucket (uploads are service-key-only), and the app renders storage SVGs exclusively via `<img>`/`NuxtImg` — never inlined into the DOM — so embedded scripts can't execute |
| Write access via API | **None** — no INSERT/UPDATE/DELETE policies on `storage.objects` for `anon`/`authenticated` | Storage RLS denies by default; we create no write policies in this phase. Uploads happen only through the service-role key (bypasses RLS) in local scripts — A2. When the CMS arrives (Phase 5), scoped policies are added deliberately |
| Read access | Public bucket read (no policy work needed) | — |

**Why not per-environment buckets:** the assets are public, immutable, and environment-independent — dev, preview, and prod all read the same objects. One bucket, one source of truth. (A future CMS with draft content may justify a second *private* bucket; that is a different policy boundary and explicitly out of scope per Decision #2.)

---

## 1.2 Folder structure

```
media/
├── hero/                                  page-top banners
│   └── banner-home.webp
├── company/                               brand & about imagery
│   ├── about-workspace.webp
│   ├── company-story.webp
│   └── map-address.webp
├── projects/
│   └── {category}/{project}/{image}.webp
│       ├── hotel/eo-gio/                  (reception, bed, table, toilet, room-1, room-2)
│       ├── hotel/codi/                    (reception-desk, bed, wardrobe)
│       ├── villa/codi/                    (phong-khach, phong-bep, …)
│       ├── house/anhduy/                  (9 images)
│       ├── house/chily/                   (8 images)
│       └── office/lai-huy-office/         (5 images — gains the project level it lacks today)
├── services/                              (empty today — dich-vu currently reuses project photos)
└── blog/
    └── {post-slug}/                       (future)
```

**Conventions (binding):**

1. **The hierarchy is semantic, not fixed-depth (R1).** The layouts above are the *conventional* shapes — `projects/` normally nests `category/project/file` (which still fixes the Phase 0 `office/` inconsistency) — but no script, validator, or component may assume an exact depth. Tooling treats a path as `{known-top-level-folder}/…/{grammar-valid-filename}` and validates only those two ends; everything between is free-form. This means future structures like `projects/hotel/eo-gio/rooms/deluxe/bed.webp` or per-gallery subfolders work with zero tooling changes.
2. **Category names are English and closed-set:** `hotel`, `house`, `villa`, `office`, `apartment`, `renovation` — matching today's `/public` tree and the UI category list. Adding a category is a deliberate act (new folder + UI entry), not a typo.
3. **Project folder names drop redundant suffixes** the category already provides: `villa/codi` not `villa/codi_villa` (fixes Phase 0 naming drift), `hotel/eo-gio` not `eo_gio`.
4. **`services/` exists but starts empty.** Today `dich-vu.vue` reuses a hotel photo; that stays a `projects/` path. The folder reserves the namespace so service-specific imagery later lands in a predictable place.

---

## 1.3 Naming convention & versioning grammar

**Filename grammar (binding):**

```
{name}[-v{N}][-w{width}].{ext}

name      kebab-case, ASCII [a-z0-9-], descriptive of the scene
-v{N}     version, N ≥ 2; ABSENT on first upload (implicit v1)
-w{width} responsive variant width in px (Phase 4); raster only, ABSENT on the master file
ext       webp for raster pipeline output · svg for vectors (R2) · jpg/png permitted edge cases
```

Examples: `phong-khach.webp` → replaced by `phong-khach-v2.webp`; its 800 px variant is `phong-khach-v2-w800.webp`; a vector asset is `logo-partner.svg` (versioned the same way: `logo-partner-v2.svg`, but never given `-w` variants — vectors scale natively).

- `-v` and `-w` are **reserved suffixes** — a base name may not itself end in `-v{digits}` or `-w{digits}`. The Phase 4 tooling rejects violations.
- One dot, one extension. Raster photography is always converted to WebP by the pipeline; SVG passes through untouched apart from SVGO optimization (R2).
- **No date-based versions.** `-v2` beats `-20260704` because ordering is obvious, names stay short, and "what changed when" belongs in the manifest (which records upload timestamps), not in URLs.

**Descriptive-name language — recommendation requiring sign-off (last open naming decision):** keep **romanized Vietnamese** for room/scene names (`phong-khach`, `ban-an`, `gieng-troi`). Reasoning: the team managing the bucket by hand (Decision #6's stated purpose) thinks in these terms; 30 of 37 project photos already use them; only clean-ups are applied (kebab-case, drop `_2` → `-2`, rename the meaningless `image_1`/`phong.jpg`). English (`living-room`) is the alternative if international collaborators will manage media — say the word and the rename map flips.

**The no-overwrite rule (A1) and what it buys:**

| Property | Consequence |
|---|---|
| An object's content never changes after upload | `Cache-Control: max-age=31536000, immutable` is safe on the **Free plan** — the Pro-only Smart CDN invalidation (Phase 0 risk #11) becomes irrelevant, closing that risk entirely |
| Replacement = new `-v{N}` file + path update in code | The change rides the normal Git/deploy flow; the new URL is cold in every cache, so it propagates instantly |
| Old versions remain in the bucket | Rollback = revert the path reference; the previous URL still serves. Old versions are garbage-collected manually/scripted after a grace period (they cost ~nothing at this scale) |
| Uploads use `upsert: false` | The API itself enforces immutability — an upload to an existing path **fails loudly** instead of silently replacing content. This is the technical guardrail behind A1, including against dashboard habits |

### Rename map (complete — this is the Phase 3 upload checklist)

Old `/public/images/...` → new `media` path. All 41 migratable files; 4 orphans excluded per Phase 0.

| Old path | New storage path |
|---|---|
| `banner_home.jpg` | `hero/banner-home.webp` |
| `about_workspace.jpg` | `company/about-workspace.webp` |
| `company-story.jpg` | `company/company-story.webp` |
| `map_address.png` | `company/map-address.webp` |
| `projects/hotel/eo_gio/reception.png` | `projects/hotel/eo-gio/reception.webp` |
| `projects/hotel/eo_gio/bed.png` | `projects/hotel/eo-gio/bed.webp` |
| `projects/hotel/eo_gio/table.png` | `projects/hotel/eo-gio/table.webp` |
| `projects/hotel/eo_gio/toilet.png` | `projects/hotel/eo-gio/toilet.webp` |
| `projects/hotel/eo_gio/image_1.png` | `projects/hotel/eo-gio/room-1.webp` |
| `projects/hotel/eo_gio/image_2.png` | `projects/hotel/eo-gio/room-2.webp` |
| `projects/hotel/codi/reception_desk.jpg` | `projects/hotel/codi/reception-desk.webp` |
| `projects/hotel/codi/bed_2.jpg` | `projects/hotel/codi/bed.webp` |
| `projects/hotel/codi/wardrobe.jpg` | `projects/hotel/codi/wardrobe.webp` |
| `projects/villa/codi_villa/phong_khach.jpg` | `projects/villa/codi/phong-khach.webp` |
| `projects/villa/codi_villa/phong_khach_2.jpg` | `projects/villa/codi/phong-khach-2.webp` |
| `projects/villa/codi_villa/phong_bep.jpg` | `projects/villa/codi/phong-bep.webp` |
| `projects/villa/codi_villa/phong_ngu.jpg` | `projects/villa/codi/phong-ngu.webp` |
| `projects/villa/codi_villa/phong_ngu_2.jpg` | `projects/villa/codi/phong-ngu-2.webp` |
| `projects/villa/codi_villa/toilet.jpg` | `projects/villa/codi/toilet.webp` |
| `projects/house/anhduy_house/phong_khach.jpg` | `projects/house/anhduy/phong-khach.webp` |
| `projects/house/anhduy_house/phong_khach_2.jpg` | `projects/house/anhduy/phong-khach-2.webp` |
| `projects/house/anhduy_house/phong_an.jpg` | `projects/house/anhduy/phong-an.webp` |
| `projects/house/anhduy_house/bep.jpg` | `projects/house/anhduy/bep.webp` |
| `projects/house/anhduy_house/gieng_troi.jpg` | `projects/house/anhduy/gieng-troi.webp` |
| `projects/house/anhduy_house/phong_ngu.jpg` | `projects/house/anhduy/phong-ngu.webp` |
| `projects/house/anhduy_house/phong_ngu_2.jpg` | `projects/house/anhduy/phong-ngu-2.webp` |
| `projects/house/anhduy_house/may_giat.jpg` | `projects/house/anhduy/may-giat.webp` |
| `projects/house/anhduy_house/toilet.jpg` | `projects/house/anhduy/toilet.webp` |
| `projects/house/chily_house/phong_khach.jpg` | `projects/house/chily/phong-khach.webp` |
| `projects/house/chily_house/phong_khach_2.jpg` | `projects/house/chily/phong-khach-2.webp` |
| `projects/house/chily_house/ban_an.jpg` | `projects/house/chily/ban-an.webp` |
| `projects/house/chily_house/phong_bep.jpg` | `projects/house/chily/phong-bep.webp` |
| `projects/house/chily_house/phong_ngu.jpg` | `projects/house/chily/phong-ngu.webp` |
| `projects/house/chily_house/phong_ngu_2.jpg` | `projects/house/chily/phong-ngu-2.webp` |
| `projects/house/chily_house/phong_be_trai.jpg` | `projects/house/chily/phong-be-trai.webp` |
| `projects/house/chily_house/phong_be_trai_2.jpg` | `projects/house/chily/phong-be-trai-2.webp` |
| `projects/office/long_desk.jpg` | `projects/office/lai-huy-office/long-desk.webp` |
| `projects/office/ban_dai.jpg` | `projects/office/lai-huy-office/ban-dai.webp` |
| `projects/office/ban_lam_viec.jpg` | `projects/office/lai-huy-office/ban-lam-viec.webp` |
| `projects/office/ke_chua.jpg` | `projects/office/lai-huy-office/ke-chua.webp` |
| `projects/office/phong.jpg` | `projects/office/lai-huy-office/phong-lam-viec.webp` |

Two judgment renames for review: `image_1`/`image_2` → `room-1`/`room-2` (eo-gio), `phong.jpg` → `phong-lam-viec.webp` (office). Better descriptive names welcome — cheap to change now, fixed after upload.

---

## 1.4 Cache policy

| Layer | Policy | Mechanism |
|---|---|---|
| Supabase CDN + browser | `Cache-Control: public, max-age=31536000, immutable` | Set per-object at upload via the `cacheControl` upload option; safe because of A1 (no object ever changes) |
| URL layer (Phase 2) | **No cache-busting query params, ever** | Version lives in the filename; URLs are permanently stable |
| Deploys | No image-cache interaction | Prerendered HTML changes; image URLs it embeds either already exist (cached fine) or are new `-v{N}` names (cold, fetched fresh) |

This is the entire cache design. Its simplicity is the payoff of A1.

---

## 1.5 Upload workflow

Uploads are **script-only** (dashboard uploads discouraged — they bypass the pipeline, naming validation, and manifest; the runbook makes the script path the easy path).

```
source image (any format/size, e.g. from photographer)
        │
        ▼
scripts/media/optimize   (Phase 4: Sharp → WebP master + -w variants, records dimensions)
        │                 output: local .media-build/ mirror of bucket layout (gitignored)
        ▼
scripts/media/upload     (supabase-js, SERVICE ROLE KEY from local .env — A2)
        │                 • validates name grammar + folder depth (§1.3 rules)
        │                 • upsert:false — collision with existing object = hard error,
        │                   message tells operator to bump -v{N}
        │                 • sets contentType + cacheControl (§1.4)
        │                 • idempotent: identical re-run skips already-present objects
        ▼
manifest update          shared/media/manifest.json (committed — canonical, R3)
                         one entry per managed asset; full schema below
        │
        ▼
code change              path reference added/updated in data files (Phase 2 shapes)
        │
        ▼
pnpm build               zero-404 gate (Decision #10) verifies every referenced path
                         exists in the bucket before deploy
```

**Environment & key handling (A2, binding):**

| Variable | Where it lives | Who reads it |
|---|---|---|
| `NUXT_PUBLIC_SUPABASE_URL` | `.env` (local), Vercel env, `.env.example` (committed, placeholder) | Nuxt runtime config → URL layer |
| `NUXT_PUBLIC_USE_SUPABASE_MEDIA` | same | Feature flag (Decision #9) |
| `SUPABASE_SERVICE_ROLE_KEY` | `.env` (local, gitignored) **only** | Upload/migration scripts exclusively. Never `NUXT_PUBLIC_*`, never in `nuxt.config.ts`, never in Vercel env for this phase. Scripts hard-fail if `CI=true` or `VERCEL=1` — mechanical enforcement, not convention |
| Anon/publishable key | **Not introduced.** Public-bucket reads are keyless | Nobody until Phase 5 (CMS auth) |

**Manifest as the canonical migration artifact (R3):** `shared/media/manifest.json` is the system of record for every managed asset — the bridge between the bucket and the repo. Phase 3 rewrites references from it, the Phase 2 fallback map derives from it, the zero-404 validator pre-checks against it before hitting the network, and Phase 5 seeds the `media` table from it row-for-row. It is committed (and lives under `shared/` rather than `docs/`) so it versions with the code that references it and is importable by both app code and scripts.

Schema (one entry per asset; written by the upload script, never by hand):

```jsonc
{
  "schemaVersion": 1,
  "bucket": "media",
  "generatedAt": "2026-07-04T00:00:00Z",
  "assets": [
    {
      "path": "projects/hotel/eo-gio/reception.webp",  // canonical storage path (master)
      "kind": "raster",                                // "raster" | "vector"
      "category": "projects",                          // top-level folder (semantic root)
      "group": "hotel/eo-gio",                         // free-form semantic grouping (R1) — null for flat folders
      "oldPublicPath": "/images/projects/hotel/eo_gio/reception.png", // null for post-migration assets
      "sourceFile": "media-src/projects/hotel/eo-gio/reception.png",  // provenance (not committed)
      "sourceChecksum": "sha256:…",                    // of the original source — idempotency/dedup key
      "checksum": "sha256:…",                          // of the uploaded master object — bucket-drift audits
      "width": 3200,                                   // master dimensions (null for vectors w/o intrinsic size)
      "height": 2000,
      "bytes": 148230,                                 // uploaded master size
      "variants": [                                    // raster only; [] for vectors
        { "path": "projects/hotel/eo-gio/reception-w400.webp",  "width": 400,  "bytes": 18400 },
        { "path": "projects/hotel/eo-gio/reception-w800.webp",  "width": 800,  "bytes": 52300 },
        { "path": "projects/hotel/eo-gio/reception-w1600.webp", "width": 1600, "bytes": 96100 }
      ],
      "version": 1,
      "supersedes": null,                              // path of the -v{N-1} asset this replaced
      "status": "active",                              // "active" | "superseded" | "skipped"
      "uploadedAt": "2026-07-04T00:00:00Z",
      "alt": null                                      // reserved — future media-table seed field
    }
  ]
}
```

Field-to-future-`media`-table mapping is 1:1 by design: `path`→`media.path`, `checksum`→`media.checksum`, `width/height/bytes/kind/category/group/alt` map to identically-named columns, `supersedes`/`version` give version lineage, and `variants` becomes either a JSONB column or a child table. Phase 5's seed script is a straight read of this file.

**Schema versioning (added 2026-07-05).** The manifest's top-level `schemaVersion` (currently `1`) is the contract between the manifest format and everything that reads it. Its meaning: bump it *only* when the manifest/asset shape changes in a way older consumers can't read. The value lives in one constant (`MANIFEST_SCHEMA_VERSION` in `app/shared/media/constants.ts`) and is asserted on **every** manifest load — both the scripts (`readManifest` in `scripts/media/lib.ts`) and the app (`app/media/fallback.ts`) call `assertManifestSchemaVersion`, which throws a clear, actionable error if the version is missing or unsupported. This makes future manifest migrations an explicit, deliberate step (bump the constant + migrate) rather than a silently mis-read file.

**Runbook — "add or replace an image" (until the CMS exists):**
1. Drop source file(s) into `media-src/{target-folder}/` locally (gitignored staging dir), named per §1.3.
2. Run optimize + upload scripts. Replacing an existing image? Name it with the next `-v{N}` — the script suggests the next free version if a collision occurs.
3. Update the path in the data file (or page). Commit code + manifest.
4. `pnpm build` (CI) — zero-404 gate proves the reference resolves. Deploy.

---

## 1.6 Implementation checklist (execution order for this phase)

- [ ] Create bucket `media` in the Supabase project: public = true, file size limit 10 MB, MIME allowlist `image/webp`, `image/jpeg`, `image/png`, `image/svg+xml`
- [ ] Confirm **zero** write policies exist on `storage.objects` for the `media` bucket (default state — verify, don't assume)
- [ ] Create `.env.example` with `NUXT_PUBLIC_SUPABASE_URL`, `NUXT_PUBLIC_USE_SUPABASE_MEDIA` placeholders (+ commented `SUPABASE_SERVICE_ROLE_KEY=` marked "local scripts only — never deploy")
- [ ] Verify `.gitignore` covers `.env`; add `media-src/` and `.media-build/` entries
- [ ] Upload one throwaway probe object via dashboard; fetch its public URL; confirm `content-type` and CDN response; delete it
- [ ] Record the sign-offs: filename language (romanized-Vietnamese vs English), the two judgment renames (§1.3), and the rename map as a whole
- [ ] Run `get_advisors` (or dashboard advisors) after bucket creation — confirm no storage-related warnings

*(No application code changes in this phase — Nuxt integration is Phase 2.)*

## 1.7 Risks

| Risk | Mitigation |
|---|---|
| Someone uploads via dashboard, bypassing naming rules and manifest | Runbook makes scripts the easy path; zero-404 gate only validates *referenced* paths, so a stray unmanifested object is inert clutter, not breakage; periodic `list()` audit script (Phase 4) diffs bucket vs manifest |
| Rename map contains a wrong judgment call (e.g. `room-1` mislabels the scene) | Map is reviewed before upload (this document); post-upload renames = new upload + reference update, cheap at 41 files, so even a miss is recoverable |
| Version discipline erodes — someone deletes and re-uploads same name to "replace" | `upsert:false` blocks the overwrite path; delete-then-reupload via dashboard remains physically possible → runbook states the rule, and the stale-cache consequence is contained to that one image for the TTL duration |
| Service-role key leaks into deploy env by habit | Scripts refuse to run under `CI`/`VERCEL` env; key name deliberately lacks `NUXT_` prefix so Nuxt never exposes it; `.env.example` comment documents the rule |
| Bucket/project ref changes later (project migration) | Only `NUXT_PUBLIC_SUPABASE_URL` changes — paths in code are ref-agnostic (Decision #4) |
| Old versions accumulate | Non-issue at scale (41 objects, ~10 MB post-pipeline); Phase 4 audit script lists unreferenced objects for optional manual cleanup after grace periods |

## 1.8 Validation checklist (phase exit criteria)

- [ ] Probe object served at `https://{ref}.supabase.co/storage/v1/object/public/media/...` with correct `content-type` and `cache-control: max-age=31536000` (header verified with curl, response documented)
- [ ] Second fetch of probe returns a CDN cache HIT header
- [ ] Upload of a >10 MB file **fails** (size limit works)
- [ ] Upload of a non-image MIME **fails** (allowlist works)
- [ ] API upload without service key (anon) **fails** (no write policies confirmed)
- [ ] `.env` gitignored; `.env.example` committed; `git log -p` shows no key material
- [ ] Rename map signed off (language + judgment renames)
- [ ] Advisors clean

---

*Phase 1 ends here. On approval, Phase 2 designs the Media Layer: the single URL abstraction (`useMediaUrl`), typed `MediaPath`, `@nuxt/image` custom provider, runtime config, the feature-flag fallback mechanics, and the revival of `BaseImage.vue` as the standard media component.*
