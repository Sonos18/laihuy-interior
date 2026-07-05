# Technical Design: Migrating Image Management from `/public` to Supabase Storage

**Project:** laihuy-interior (Nuxt 4, fully prerendered SSG)
**Status:** Proposed — no implementation yet
**Date:** 2026-07-04

---

## 0. Current state (measured, not assumed)

Everything below was verified against the repository before writing this plan.

| Fact | Value |
|---|---|
| Images in `/public/images` | 47 files, ~71.5 MB (36 JPG = 37.7 MB, 11 PNG = 33.8 MB) |
| Folder layout | `images/projects/{hotel,house,villa,office,apartment,renovation}/{project}/…` plus 8 root-level files (hero/company) |
| Where paths are referenced | `app/data/projects.ts`, `app/data/company.ts`, and inline in ~8 page components (`index`, `du-an/*`, `dich-vu`, `gioi-thieu`, `nha-xuong`, `tuyen-dung`, `lien-he`, `app.vue`) |
| Database | **None.** All content is hard-coded TypeScript data files. No Supabase packages installed in this repo. |
| Image module | **None.** Plain `<img>` / CSS backgrounds; `@nuxt/image` is not installed. |
| Rendering | Every route is prerendered (`routeRules` → `prerender: true`). The site is effectively static HTML at deploy time. |
| CI | Lint + typecheck only; no deploy step in the repo. |

Two consequences shape the whole design:

1. **Because the site is SSG, image URLs are baked into HTML at build time.** The browser never needs Nuxt to resolve an image — it just needs a stable, cacheable URL. Supabase Storage serves that URL directly through its CDN; the Nuxt server is never in the image path.
2. **Because there is no database yet, "migrate images to Supabase" is really two separable projects:** (a) move the *binaries* out of Git into Storage, and (b) move the *metadata* out of TypeScript into the Database. Doing (a) now and (b) when the admin CMS arrives is deliberately supported by this design — (a) is low-risk and delivers all the stated pain relief (repo size, deploys); (b) only pays off once non-developers edit content.

Also verified against live Supabase docs (2026-07): **image transformations require the Pro plan** (100 origin images included, then $5/1,000; Free plan has none). This creates a real decision point handled in §6.

---

## 1. Overall architecture

### Target architecture

```
                       ┌──────────────────────────────────────────┐
                       │              Supabase                    │
   build time          │  ┌────────────┐      ┌───────────────┐  │
┌───────────┐  fetch   │  │  Storage   │      │   Postgres    │  │
│ Nuxt build│──paths──▶│  │  bucket:   │      │ (Phase 5:     │  │
│ (prerender│          │  │  "media"   │      │  media table, │  │
│  all HTML)│          │  └─────┬──────┘      │  projects)    │  │
└─────┬─────┘          │        │             └───────────────┘  │
      │                │  Smart CDN + /render/image (transforms) │
      ▼                └────────┬─────────────────────────────────┘
 static HTML with               │
 absolute Storage URLs          │  direct fetch (browser ⇄ CDN,
      │                         │  Nuxt never proxies images)
      ▼                         ▼
   Hosting  ────────────▶  Visitor's browser
```

**Image delivery flow (runtime):** Browser requests the page from the static host → HTML already contains absolute Supabase Storage URLs → browser fetches images straight from Supabase's CDN edge. Zero load on the Nuxt app; no serverless function in the image path.

**Rendering flow (build time):** Data files (later: DB rows) hold *storage paths*, never full URLs. A single URL-builder utility turns `projects/hotel/eo_gio/reception.webp` into the full CDN URL (optionally a `/render/image/...` transformation URL with width/quality params). This runs during prerender, so the resolved URLs are baked into the HTML.

**Upload flow:**
- *Now (developer-driven):* a repo script (Node + service-role key, run locally only) optimizes and uploads images, and emits a manifest mapping old → new paths.
- *Future (admin CMS):* authenticated admin user uploads from the browser via `supabase-js` directly to Storage (browser → Storage, not through the Nuxt server), guarded by Storage RLS policies; a DB row is created for each upload. Site content updates then require a rebuild trigger (webhook → host deploy hook) because the site is SSG — this is an accepted property of the architecture, not a bug.

**Why the database is optional in phase 1:** Storage paths in typed TS data files are already type-checked, reviewed in PRs, and versioned. Introducing Postgres before there is an editor UI would add a moving part (build-time DB fetch, env coupling in CI) with no user-visible benefit. The design keeps the door open: the URL-builder consumes "a storage path", regardless of whether it came from a TS constant or a DB row.

---

## 2. Folder structure inside Supabase Storage

**One public bucket, content-domain folders, immutable filenames.**

```
media/                                  ← single public bucket
├── hero/                               ← homepage & page-top banners
├── company/                            ← about, team, factory (nhà xưởng)
├── projects/
│   ├── hotel/
│   │   ├── eo-gio/
│   │   │   ├── reception-a1b2c3.webp   ← content-hash suffix
│   │   │   └── bed-d4e5f6.webp
│   │   └── codi/
│   ├── house/{anhduy-house, chily-house}/
│   ├── villa/codi-villa/
│   ├── office/
│   ├── apartment/
│   └── renovation/
├── services/                           ← dịch vụ page imagery
├── careers/                            ← tuyển dụng
└── blog/                               ← future
    └── {post-slug}/
```

**Why this structure:**

- **Single bucket, not one per content type.** Buckets are a *policy* boundary (public vs private, size limits, MIME allowlists), not an organizational one. All of this content shares one policy: publicly readable marketing imagery. Folders give the organization; one bucket keeps policies, upload code, and the URL builder simple. A second, *private* bucket is added only if a genuinely different policy appears later (e.g. customer-submitted documents).
- **Mirrors the existing `/public/images` tree** (`projects/{category}/{slug}/`) so the migration mapping is mechanical and the mental model doesn't change.
- **No `thumbnails/` folder.** Thumbnails are a *rendering* concern, not a *storage* concern — they're derived via transformation URLs (or pre-generated variants, §6), never hand-managed. A manually maintained thumbnails tree always drifts out of sync with originals.
- **Immutable, hash-suffixed filenames** (`reception-a1b2c3.webp`). This is the load-bearing decision for caching: files are uploaded once with `Cache-Control: public, max-age=31536000, immutable` and *never overwritten*. Replacing an image = uploading a new name + updating the reference. This eliminates the entire class of CDN/browser stale-cache bugs (§9) and makes rollback trivial (the old file still exists).
- **Kebab-case, ASCII-only names.** Current names mix `snake_case` and Vietnamese words (`gieng_troi.jpg`); normalize during migration to avoid URL-encoding surprises.

---

## 3. Database design

### The options

**Option A — image paths embedded in owning tables** (e.g. `projects.gallery text[]`):
- ✅ Simple queries, no joins; matches today's TS shape exactly.
- ❌ No per-image metadata (alt text, dimensions, sort order, caption) without parallel arrays — which always rot.
- ❌ No answer to "is this file still referenced?" — orphan cleanup becomes grep-the-database.
- ❌ Reordering/deleting means rewriting arrays; no place for a CMS to hang upload state.

**Option B — one dedicated `media` table + reference from owning tables:**

```
media
  id            uuid pk
  bucket        text            (default 'media')
  path          text unique     ← storage path, NOT full URL
  alt           text            ← per-locale later if needed
  width, height int             ← stored at upload → no CLS, srcset math
  bytes         int
  created_at    timestamptz

project_images                   ← join table per owning entity
  project_id    fk → projects
  media_id      fk → media
  sort_order    int
  role          text            ('cover' | 'gallery')
```

- ✅ One row per file = one source of truth; orphan detection is a `LEFT JOIN`.
- ✅ Alt text, dimensions, ordering live where they belong; exactly what an admin CMS needs.
- ✅ Storing the *path* (not URL) means the Supabase project ref, a future custom domain, or a CDN swap never requires a data migration.
- ❌ More tables, joins in queries — mild cost, and irrelevant to page speed here because queries run at build time.

### Recommendation

**Option B, but deferred to the CMS phase (Phase 5).** In Phases 1–4, the *same shape* lives in TypeScript: the `Project` type gains `images: ProjectImage[]` where `ProjectImage = { path, alt, width, height }`. This is Option B's schema expressed as types — so when the DB arrives, the migration is mechanical (TS constants → seed script → rows) and no component changes.

Do **not** store full URLs anywhere, in TS or DB. Paths only; one utility builds URLs.

When the tables are created: RLS enabled on both, `SELECT` open to `anon` (public content), writes restricted to the admin role via `app_metadata` claims — never `user_metadata`, which is user-editable (see §7).

---

## 4. Migration strategy

Safe because the site is SSG and the old files can keep existing during the entire transition — there is no hard cutover moment, hence effectively **zero downtime**.

### Step 1 — Inventory
Script walks `/public/images`, and greps `app/` for `/images/` string references. Output: `migration/inventory.json` — every file with size, dimensions, hash, and the list of source files referencing it. **Gate:** any file on disk referenced by zero source files (dead asset — delete, don't migrate) and any reference with no file on disk (already-broken link — fix first) are surfaced before anything is uploaded.

### Step 2 — Optimize + upload
For each inventoried file: convert to WebP (quality ~80, keep original as fallback only if visibly degraded), normalize the name (kebab-case + content-hash suffix), upload to `media` bucket with correct `contentType` and `cacheControl: 'public, max-age=31536000, immutable'`. Uses the service-role key **locally only** — never in CI, never in the repo. Output: `migration/manifest.json` mapping `old public path → new storage path + dimensions`. The script is idempotent (hash-suffixed names make re-runs no-ops), so partial failures are just re-run.

### Step 3 — Update references
Using the manifest, rewrite `app/data/projects.ts`, `app/data/company.ts`, and page components to the new path-based shape consumed by the URL helper (§5). This is a reviewable PR — every changed reference is visible in the diff.

### Step 4 — Verification (before removing anything)
- `pnpm typecheck` — the typed `StoragePath` shape catches malformed references.
- Full prerender build, then a link-checker pass over `.output/public/**/*.html`: extract every `<img src>`, `srcset`, and CSS `url()`, HTTP-check each against Supabase. **Gate: zero 404s.**
- Visual pass on each route (7 pages) + Lighthouse on `/` and one project detail page, compared against a pre-migration baseline.
- Confirm response headers from the CDN: `content-type`, `cache-control`, and (on repeat request) `cf-cache-status: HIT` or equivalent.

### Step 5 — Cutover + grace period
Deploy. **Keep `/public/images` in place for one release cycle** — old files continue to serve, so anything cached, hotlinked, or indexed (Google Images) keeps working. Remove the folder in a separate commit after 2–4 weeks (or after Search Console shows the new URLs picked up).

### Rollback strategy
Rollback = `git revert` of the reference-update commit; the old files are still in `/public` during the grace period, so the site is instantly back on local images. Storage uploads are additive and harmless to leave in place. Only after the grace-period deletion does rollback require re-adding files — which Git history still has.

---

## 5. Nuxt integration

Architecture decisions only — no code.

- **Configuration:** `runtimeConfig.public.supabaseUrl` populated by `NUXT_PUBLIC_SUPABASE_URL` in `.env` (and CI/host env). Public URL + publishable key are safe to expose; the **service-role key never enters Nuxt config** — it exists only in the local migration script's env. `.env` stays gitignored with a committed `.env.example`.
- **One URL choke point:** a small utility + composable (e.g. `useMediaUrl(path, { width, quality })`) is the *only* place that knows how a storage path becomes a URL. Components and data files never concatenate URLs. This single seam is what makes every future change cheap: switching Free-plan pre-generated variants → Pro-plan `/render/image` transforms, adding a custom domain, or even leaving Supabase is a one-file change.
- **`@nuxt/image` with a custom Supabase provider** (recommended over hand-rolled `<img>` handling): `<NuxtImg>` gets `srcset`/`sizes` generation, lazy loading, and format handling for free, and a ~20-line custom provider maps its width/quality params onto Supabase transformation URLs (or variant filenames on the Free plan). This is the idiomatic Nuxt seam for exactly this job.
- **Typed paths:** a branded `StoragePath` type on the data-file image fields, so a typo'd path is a typecheck error, not a production 404. Data files store `{ path, alt, width, height }` per image (§3) — dimensions in data mean `width`/`height` attributes in HTML, which eliminates layout shift.
- **Caching strategy:** all responsibility pushed to upload time (immutable hashed names + 1-year `Cache-Control`, §2). The app layer does nothing clever: URLs are stable, the CDN and browser cache do the work. No cache-busting query strings, no revalidation logic.
- **No Supabase client in the browser for Phases 1–4.** The site only *reads public URLs*; it does not need `supabase-js` at runtime at all. The `@nuxtjs/supabase` module joins the stack in Phase 5 when the admin CMS needs auth + uploads. Adding it earlier is dead weight in the bundle.

---

## 6. Performance

- **Formats:** convert JPG/PNG → **WebP at upload time** (the current 33.8 MB of PNGs are photos — expect 60–80 % reduction; the whole library likely drops from ~71 MB to ~20 MB). On the Pro plan, Supabase's `/render/image` additionally auto-negotiates WebP per client; AVIF is on their roadmap but not shipped — don't design around it yet.
- **Responsive images:** `<NuxtImg sizes="...">` generates `srcset` variants. Real breakpoints for this layout: ~400 px (grid thumbnails), ~800 px (cards/detail), ~1600 px (hero/lightbox). Never ship the 2500 px original to a phone.
- **Thumbnails — the Free vs Pro decision:**
  - **Pro plan (transforms):** variants generated on-the-fly via URL params, cached at the CDN. Zero pipeline maintenance. Cost: plan upgrade; 47 origin images is well under the 100 included.
  - **Free plan (pre-generated variants):** the upload script emits each image at the 3 widths + WebP using `sharp`, stored alongside the original (`reception-a1b2c3-w800.webp`). The `@nuxt/image` provider maps width requests to the nearest variant. More upload-time machinery, zero monthly cost.
  - **Recommendation:** if the existing Supabase backend is already on Pro, use transforms — it's the simpler system. If on Free, pre-generate; the §5 choke point makes upgrading later a one-file change. Either way the component code is identical.
- **Lazy loading:** `loading="lazy"` for everything below the fold (galleries, project grids); hero/LCP image gets `loading="eager"` + `fetchpriority="high"` + a `<link rel="preload">` in the prerendered head.
- **CDN:** Supabase serves Storage through its CDN by default; public-bucket objects are cached at the edge (Smart CDN). Because filenames are immutable, edge caches never need invalidation.
- **Browser cache:** 1-year immutable `Cache-Control` set at upload (§2). Repeat visitors re-download nothing.
- **CLS:** width/height stored per image (§3) and always rendered into attributes.

---

## 7. Security

- **Public bucket — correct here, not a compromise.** Every image is public marketing content already served to anonymous visitors; a private bucket + signed URLs would add expiring URLs to *prerendered static HTML* — an outright architecture bug (pages baked at build time would embed URLs that die hours later). Signed URLs become relevant only for genuinely restricted assets (e.g. client-only documents), which would live in a separate private bucket.
- **Public ≠ writable.** Storage RLS on `storage.objects` denies everything not explicitly allowed. The design creates **no INSERT/UPDATE/DELETE policies at all** in Phases 1–4: `anon` and `authenticated` can read (public bucket) and nobody can write via the API. Migration uploads use the service-role key, which bypasses RLS and lives only on the developer's machine.
- **Admin uploads (Phase 5):** authenticated admin in the browser uploads directly to Storage under policies scoped `TO authenticated` **with a role predicate** — role check against `app_metadata` claims (set server-side), never `user_metadata` (user-editable → privilege escalation). `TO authenticated` alone is authentication without authorization. Known Supabase trap to design for: **upsert requires INSERT + SELECT + UPDATE policies** — INSERT alone makes file replacement fail silently. Add bucket-level constraints too: allowed MIME types (`image/*`) and a max file size.
- **Key hygiene:** publishable key only in client-side config; service-role key never in the repo, never in `NUXT_PUBLIC_*`, never in CI for this phase. When Phase 5 needs privileged server operations, they run in Nuxt server routes reading a private runtime-config key.
- **Future auth:** Supabase Auth with admin users flagged via `app_metadata.role = 'admin'`; DB tables (§3) get matching write policies with both `USING` and `WITH CHECK` clauses so an admin can't be tricked into reassigning row ownership.

---

## 8. Cost analysis

Verified against live pricing pages (2026-07). Current library: ~71 MB, ~20 MB post-WebP; assume growth to 2–5 GB over years and a modest-traffic marketing site (tens of GB egress/month at most).

| | Keep in `/public` | **Supabase Storage** | Vercel Blob |
|---|---|---|---|
| Storage cost | "Free" (rides on host) | Free ≤ 1 GB; Pro: 100 GB incl., then $0.0213/GB | $0.023/GB (small free allowance on Hobby) |
| Egress | Host's bandwidth quota | Free: 5 GB/mo; Pro: 250 GB incl., then $0.09/GB | ~$0.05/GB regional + edge-request charges |
| Transforms/optimization | Build-time only (ipx) | Pro: 100 origin images incl., then $5/1k | None built in — BYO pipeline |
| Ops overhead | Git bloat, redeploy per image change, repo clones grow forever | Managed, integrates with existing Supabase stack | Managed, but a **second vendor** with its own keys/billing |
| CMS path | None — every edit is a commit | Native: same auth, same DB, RLS-guarded uploads | Needs custom glue to your DB |

- **`/public` is not actually free:** its costs are paid in Git history growth (images are forever in `.git` even after deletion), slower clones/CI, full redeploys for content changes, and — the stated goal — it structurally blocks a CMS. At 47 images it's tolerable; at "thousands" it is not, and the time to move is *before* the library grows.
- **Vercel Blob** is competitive on raw prices but is a second vendor, has no image transformation service (you'd build the variant pipeline anyway, permanently), and its metadata/permissions story doesn't connect to the Postgres + Auth stack this project already committed to.
- **Supabase Storage**: at current scale the realistic bill is **$0/month on Free** (20 MB stored, well under 5 GB egress for a modest-traffic site — though egress is the number to watch and the one honest risk on Free) or **$25/month on Pro** which this project may already be paying for its backend — in which case images ride along at effectively zero marginal cost with transforms included.

**Verdict:** Supabase Storage wins not on cents-per-GB (all three are cheap at this scale) but on *architecture*: one vendor, one auth system, storage metadata one JOIN away from content tables, and a native path to the admin CMS. That's the long-term criterion this project set.

---

## 9. Risks and mitigations

| Risk | Likelihood | Mitigation |
|---|---|---|
| Broken image URLs after path rewrite | Medium | Typed `StoragePath` + build-time link-checker over prerendered HTML with a zero-404 gate (§4); single URL builder means no hand-built URLs to typo |
| SEO impact (Google Images has old URLs indexed) | Low–medium | Grace period: `/public` files keep serving 2–4 weeks post-cutover; page URLs (the main SEO asset) don't change at all; monitor Search Console before deleting |
| Stale CDN/browser cache after image "update" | **Eliminated by design** | Immutable hash-named files are never overwritten — an update is a new file + new reference + rebuild (§2) |
| Duplicate files across re-runs / re-uploads | Low | Content-hash filenames make uploads idempotent; the manifest is the dedup ledger |
| Missing references (file exists, nothing points at it — or vice versa) | Medium today | Inventory step cross-references disk ↔ code and gates the migration on reconciling both directions (§4) |
| Free-plan egress cap (5 GB/mo) exceeded by a traffic spike | Low, real | WebP + responsive sizes cut per-page image weight ~4×; monitor Supabase usage dashboard; the fix is the Pro upgrade already on the roadmap |
| Supabase project ref baked into content | Eliminated by design | Paths stored, never URLs; the ref lives in one env var |
| Service-role key leakage via migration tooling | Low | Key only in local `.env` (gitignored), scripts refuse to run in CI, never in `NUXT_PUBLIC_*` |
| SSG staleness once a CMS exists (upload ≠ live) | Certain, accepted | Deploy-hook rebuild on content change (Phase 5); acceptable for a marketing site's update cadence |

---

## 10. Execution roadmap

### Phase 0 — Foundations & decisions
**Objective:** Supabase wired to this repo; the two open decisions closed.
**Tasks:** Confirm which Supabase project/plan the backend uses (decides Free-variants vs Pro-transforms path, §6). Create `media` bucket (public). Add `.env` / `.env.example`, `runtimeConfig.public.supabaseUrl`. Decide hosting target's env-var setup.
**Output:** Bucket exists; `pnpm dev` reads the env; plan decision recorded in this doc.
**Validation:** ☐ bucket visible in dashboard ☐ public object fetchable by URL ☐ no secrets in Git ☐ Free/Pro decision written down.

### Phase 1 — Migration tooling
**Objective:** Repeatable, idempotent scripts; no app changes yet.
**Tasks:** Inventory script (disk ↔ code cross-reference); optimize-and-upload script (WebP, rename, hash, cache headers, variants if Free plan); manifest output.
**Output:** `migration/inventory.json`, `migration/manifest.json`, all 47 images live in Storage.
**Validation:** ☐ inventory reconciles both directions ☐ re-run is a no-op ☐ spot-check 5 URLs: correct `content-type`, 1-year `cache-control`, CDN cache HIT on second request ☐ dead assets listed, not uploaded.

### Phase 2 — Nuxt integration
**Objective:** App renders from Storage; `/public/images` untouched but unreferenced.
**Tasks:** URL util/composable; `@nuxt/image` + custom Supabase provider; `StoragePath` type; rewrite `app/data/*.ts` and page components from the manifest; add width/height/alt per image; hero preload + lazy-loading pass.
**Output:** A reviewable PR where every image reference changed shape.
**Validation:** ☐ typecheck + lint pass ☐ grep finds zero remaining `/images/` references in `app/` ☐ all 7 routes visually correct in dev ☐ hero LCP uses eager + preload.

### Phase 3 — Verification & cutover
**Objective:** Deployed to production with proof, not hope.
**Tasks:** Prerender build; automated 404 sweep over output HTML (img/srcset/CSS urls); Lighthouse vs pre-migration baseline on `/` and one project page; deploy; post-deploy re-run of the sweep against production.
**Output:** Live site serving all imagery from Supabase CDN; baseline comparison recorded.
**Validation:** ☐ zero 404s in build sweep ☐ Lighthouse perf/CLS ≥ baseline ☐ production headers correct ☐ Supabase usage dashboard shows egress as expected.

### Phase 4 — Cleanup (after 2–4 week grace period)
**Objective:** `/public/images` gone; migration documented.
**Tasks:** Confirm Search Console/analytics show no meaningful traffic to old image paths; delete `/public/images`; retire migration scripts into `docs/`; update README.
**Output:** Repo without binaries; documented runbook for adding future images (until the CMS exists: "run the upload script, add the path to the data file").
**Validation:** ☐ old paths 404 with no user-facing breakage ☐ repo clone size reduced ☐ runbook exists.

### Phase 5 — Database & admin CMS (future, separate design doc)
**Objective:** Non-developers manage projects and images.
**Tasks:** `media` + `projects` + `project_images` tables per §3; seed from TS data files; RLS per §7; Supabase Auth with `app_metadata` admin role; upload UI (browser → Storage direct); deploy-hook rebuild on content change; switch build-time data source from TS files to DB.
**Output:** Admin can add a project with images and see it live after an automatic rebuild.
**Validation:** ☐ RLS advisor clean (`get_advisors`) ☐ anon cannot write Storage or tables ☐ upsert works (INSERT+SELECT+UPDATE policies) ☐ upload → rebuild → live, end to end.

---

## Final recommendation

**Adopt Supabase Storage with: a single public `media` bucket, immutable hash-named WebP files with 1-year cache headers, storage *paths* (never URLs) in typed data structures, one URL-builder choke point behind a custom `@nuxt/image` provider, and metadata staying in TypeScript until the admin CMS phase — at which point the same shape moves into a dedicated `media` table.**

Why this is the right architecture for this specific project:

1. **It solves the actual stated problems** — Git bloat, deploy weight, redeploy-per-image — in Phases 0–4, without waiting on a database or CMS that doesn't exist yet.
2. **It is right-sized but not short-sighted.** Every scaling requirement (thousands of images, CMS, uploads, auth) maps onto a seam deliberately left in the design: the URL choke point, the path-not-URL rule, the TS types that mirror the future schema. Growth is additive, never a rework.
3. **It exploits what the project already is.** An SSG marketing site needs stable public CDN URLs baked at build time — a public bucket with immutable objects is precisely that primitive. And the backend is already Supabase: one vendor, one auth system, image metadata one JOIN from content.
4. **The riskiest failure modes are removed structurally, not procedurally.** Stale caches can't happen (immutable names), broken URLs are typecheck/build failures (typed paths + 404 gate), rollback is a revert (grace period), and vendor/ref coupling lives in one env var.

The one decision to close before Phase 0 ends: whether the existing Supabase project is on the Pro plan. Pro → use on-the-fly transforms (simpler system). Free → pre-generate size variants at upload (zero cost). The architecture is identical either way; only the URL builder's internals differ.
