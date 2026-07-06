# Phase 3 — Migration Execution: Pipeline, Upload & Cutover

**Status:** Tooling implemented and verified locally — upload execution blocked on credentials (see §3.6)
**Date:** 2026-07-04
**Inputs:** Phase 1 (rev 2) storage architecture, Phase 2 media layer (implemented, flag OFF), and four approved operational safeguards:
- **S1 — Full idempotency/resumability** via manifest + checksums; interrupted runs resume safely.
- **S2 — `--dry-run`** on the pipeline: complete analysis, zero writes (neither remote nor manifest).
- **S3 — Script-only ingestion.** The upload script is the sole supported path into the bucket; the dashboard is not part of the workflow. The manifest stays the single source of truth, enforced by a drift audit.
- **S4 — Network-verified zero-404 gate.** Validation HEAD-requests the actual Storage objects, not just generated paths.

> ## Revision 3 (2026-07-05) — library reorganized; manifest & storage mapping regenerated from the filesystem
>
> The source library was replaced (business decision). The old rename map and `hotel/villa/house/office` taxonomy are discarded; see Phase 1 rev 3. Impact on Phase 3 tooling:
> - **New first step: `pnpm media:scan --write`** (`scripts/media/scan.ts`) regenerates `manifest.json` from `public/images` — auto-discovering projects, arbitrary-depth galleries, and directly-placed images. This runs before `media:optimize`.
> - **New inventory: 160 assets** (145 project images / 11 projects, 11 `company/workshop`, 3 `company`, 1 `brand`) — replaces the old 41. Optimize/upload/verify counts scale accordingly (masters + 3 variants each ⇒ ~640 objects).
> - **Storage domains** are now `projects/` · `company/` · `brand/` (§3.1's `hero/` etc. retired). The workshop gallery uploads under `company/workshop/`, never `projects/`.
> - `optimize`, `upload`, and `verify` are **unchanged in logic** — they consume whatever the manifest holds, so they inherited the new layout with no edits (verify's path-grammar top-level list was updated to the new domains). Safeguards S1–S4 still hold.
> - **Full pipeline order is now:** `media:scan --write` → `media:catalog` → `media:optimize` → `media:upload` → `media:verify` (the last runs inside `pnpm build`).
> - **App integration DONE (Option 1 separation).** The app now consumes the generated media catalog (see Phase 2 rev 3): `projects.ts` holds business metadata + `mediaId` only, `app/media/catalog.generated.ts` owns all media, and `app/media/project-media.ts` is the presentation glue. `pnpm build` is **green** with `USE_SUPABASE_MEDIA=false` (verify gate validates all 160 catalog references against the manifest and confirms fallback files on disk). Flag-ON generation is correct (workshop → `company/workshop/`, projects → `projects/…`); the flag-ON verify gate remains red only because objects aren't uploaded to a real bucket yet — which is exactly what §3.4 does next.

---

## Objective

Move all 41 content images into the `media` bucket and flip `USE_SUPABASE_MEDIA=true` in production, with every step reversible, resumable, and gated — `/public/images` stays untouched until Phase 4.

## 3.1 Architecture — the three-script pipeline

```
public/images (sources)                      Supabase Storage
      │                                            ▲
      ▼                                            │ service-role key, local only (A2)
pnpm media:optimize          pnpm media:upload ────┘
  sharp → WebP masters         per-object plan: UPLOAD / SKIP / RESUME / CONFLICT
  (≤2560px, q80) + w400/       upsert:false (A1) · cacheControl 1y · checkpointed manifest
  w800/w1600 variants          --dry-run (S2) · --audit drift check (S3)
  → .media-build/ (gitignored)
      │                        pnpm media:verify  (runs inside `pnpm build`)
      ▼                          source-scan refs → manifest check →
manifest.json updated            flag OFF: fallback files exist on disk
(dims, bytes, checksums,         flag ON:  HEAD every master+variant+prerendered URL (S4)
 variants)                       any failure → build exits 1 → deploy blocked
```

**Files:** `scripts/media/{lib,optimize,upload,verify}.ts` (run via `tsx`; they import the same `app/shared/media/` validation/constants the app uses — one grammar, one manifest type). New dev dependencies: `sharp`, `tsx`, `@supabase/supabase-js` (scripts only — the app bundle remains SDK-free per A2; `sharp` allowed in `pnpm.onlyBuiltDependencies`).

## 3.2 How the safeguards are implemented

**S1 — Idempotency & resume:**
- *Optimize:* an asset is skipped when its `sourceChecksum` matches the source file AND the built master's sha256 matches the recorded `checksum` AND all variant files exist. Changed source → rebuilt; intact → no-op. (Proven: second run = 41/41 skipped.)
- *Upload:* per object (master and each variant): not in bucket → `UPLOAD`; in bucket with asset already `active` → `SKIP`; in bucket while manifest says `planned` (the interrupted-run case) → download, sha256-compare against local: identical → `RESUME` (marked done without re-uploading), different → `CONFLICT`, hard error demanding a `-v{N}` bump (immutability, A1). The manifest is **checkpointed to disk after every completed asset**, so a crash at asset 20 resumes at asset 20.
- All uploads use `upsert: false` — the API refuses overwrites even if logic were wrong.

**S2 — Dry run:** `--dry-run` on both scripts performs the complete analysis — checksums, remote existence via keyless HEAD on public URLs, per-object plan labels — and writes nothing. Dry-run needs only `NUXT_PUBLIC_SUPABASE_URL`, not the service key.

**S3 — Script-only ingestion:** documented as the only supported path (runbook, Phase 1 §1.5); `--audit` recursively lists the bucket and reports any object not owned by the manifest, so dashboard strays are detected, not silently tolerated. The upload script refuses to run (non-dry-run) when `CI`/`VERCEL` env vars are present.

**S4 — Real-object verification:** `media:verify` runs as the second half of `pnpm build` (so it executes on Vercel too, where only the public keyless HEAD is needed):
1. Regex-scans `app/**` for storage-path references; each must be a valid-grammar, manifest-known, non-skipped asset.
2. Flag OFF: each referenced asset's `oldPublicPath` file must exist under `public/` (fallback integrity).
3. Flag ON: each referenced asset must be `active`, and **every object it owns (master + 3 variants) plus every storage URL found in the prerendered HTML gets a HEAD request** — expecting 200 with an `image/*` content-type. Any failure fails the build. Dynamic-route images (project detail pages are not prerendered) are covered by path (1) + manifest enumeration, not just HTML crawling.

## 3.3 Optimization results (executed locally, real numbers)

| Metric | Value |
|---|---|
| Assets processed | 41/41, zero errors |
| Masters | 71.0 MB source → **16.1 MB** WebP (≤2560 px longest edge, q80) |
| Total upload payload (masters + 123 variants) | **25.1 MB, 164 objects** |
| Idempotency re-run | 41/41 skipped |
| Gate negative test | Planted bogus reference → build fails with named path; removed → passes |

Notes: variants are always generated at 400/800/1600 with `withoutEnlargement`, so narrow images (e.g. `wardrobe.webp`, 1000 px) still own all three variant names — the URL layer's width-snapping can never produce a missing object. Manifest `width`/`height` now reflect the capped masters; data-file dimensions keep the original values (same aspect ratio, so CLS is unaffected; browsers slightly over-estimate the master in srcset, which only biases toward smaller variants).

## 3.4 Execution checklist (remaining, in order)

- [ ] **Prerequisite (user):** Supabase project URL into `.env` (`NUXT_PUBLIC_SUPABASE_URL`) and Vercel env; service-role key into local `.env` only
- [ ] **Prerequisite (user or assisted):** create bucket `media` per Phase 1 §1.6 (public, 10 MB limit, MIME allowlist) and verify zero write policies
- [ ] `pnpm media:upload --dry-run` — expect 164 × `UPLOAD`, 0 conflicts
- [ ] `pnpm media:upload` — expect 164 uploaded, manifest flips to 41 × `active`; commit the manifest
- [ ] `pnpm media:upload --audit` — bucket ↔ manifest in sync
- [ ] Spot-check headers on 3 objects: `content-type: image/webp`, `cache-control: max-age=31536000`, CDN cache HIT on second request
- [ ] `NUXT_PUBLIC_USE_SUPABASE_MEDIA=true pnpm build` locally — gate HEAD-verifies all objects; visual pass on all 7 routes + one project detail via `pnpm preview`
- [ ] Set both env vars in Vercel; deploy; re-run visual + Lighthouse comparison vs pre-migration baseline
- [ ] Begin the 2–4 week grace period (Phase 4 deletes `/public/images` after it)

## 3.5 Rollback

Unchanged from Phase 2 design, now with tooling: flip `NUXT_PUBLIC_USE_SUPABASE_MEDIA=false` in Vercel + redeploy (or Vercel Instant Rollback). The gate re-verifies fallback files on disk in flag-OFF builds, so a rollback build cannot ship with missing `/public` files either.

## 3.6 Blockers

Execution of §3.4 requires two things only the user can provide:
1. **`NUXT_PUBLIC_SUPABASE_URL`** — the Supabase project URL.
2. **`SUPABASE_SERVICE_ROLE_KEY`** — into local `.env` (gitignored); never CI, never Vercel.

And the one-time **bucket creation** (dashboard, CLI, or via the Supabase MCP with authentication).

## 3.7 Risks

| Risk | Mitigation |
|---|---|
| Interrupted upload leaves half-migrated state | S1: per-asset manifest checkpoints + RESUME logic; flag stays OFF until the gate passes, so production never sees partial state |
| Dashboard upload bypasses manifest | S3: unsupported path + `--audit` drift report on every upload run |
| Object deleted from bucket after cutover | S4: every subsequent build HEAD-verifies and fails before deploy; the grace-period `/public` files enable instant rollback |
| Checksum-compare downloads on resume are slow at scale | Only runs for `planned`+exists collisions (rare); 41 assets is trivial; revisit if the library grows 100× |
| Vercel build lacks network to Supabase | HEAD requests target the public CDN URL — same reachability as the site itself; if Supabase is down, failing the deploy is the correct behavior |

---

*Phase 3 tooling is complete and verified. Upload execution starts as soon as §3.6 is provided; then cutover per §3.4. Phase 4 (grace-period cleanup) follows.*
