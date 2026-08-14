# Homepage Eo Gió Material Story Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the first three homepage material-story images with GPT Image derivatives of the real Eo Gió reception photograph and use that unchanged photograph as the fourth, completed-space frame.

**Architecture:** Treat `projects/khach-san-eo-gio/sanh-don/24.webp` as an immutable visual and catalog master. Generate three independent `16:10` derivatives from that same master, register only those new assets through the existing merge/prefix media workflow, and update the focused `homeMaterialStoryMedia` join so `space` resolves to the existing Eo Gió project asset. Preserve `HomeMaterialStory.vue`, its stage ordering, scroll choreography, responsive modes, and reduced-motion fallback.

**Tech Stack:** OpenAI built-in GPT Image editing, Node `22.23.2`, pnpm `10.29.3`, Sharp `0.34`, Nuxt `4.3.1`, Vue `3.5.28`, TypeScript `5.9.3`, Vitest `4.1.9`, Playwright `1.61.1`, existing Supabase Storage media tooling.

## Global Constraints

- Follow `docs/superpowers/specs/2026-08-14-homepage-eo-gio-material-story-design.md`.
- Frame 04 is the existing `projects/khach-san-eo-gio/sanh-don/24.webp` asset at `2560 × 1600`; do not regenerate, retouch, relight, extend, crop destructively, or duplicate it.
- Generate frames 01–03 independently from the unchanged master; never derive one generated frame from another.
- All three generated sources must share one exact `16:10` dimension and remain legible at `640 × 400`.
- Preserve the master eye level, lens character, principal divisions, curved-counter footprint, left-biased subject, and central-80% crop safety where each stage permits.
- No people, readable labels, invented branding, added logos, watermark, branded machinery, fabricated signage, warped joinery, duplicate counter, impossible reflection, floating tool, dirty-workshop theatre, loose sample clutter, or unrelated decoration.
- The actual Eo Gió signage in frame 04 remains documentary; do not recreate it in frames 01–03.
- Keep every story image decorative with `alt: ''` because adjacent semantic copy owns the narrative.
- Do not change section heading, bilingual stage copy, layout, progress thresholds, scroll mechanics, responsive modes, or `HomeMaterialStory.vue` image geometry.
- Do not add a dependency, animation library, backend, analytics, or new media provider.
- Do not hand-edit `app/shared/media/manifest.json`, `app/media/catalog.generated.ts`, or `app/media/fallback.generated.ts`; use the media scripts.
- Do not delete or supersede the four existing `home-material-*-v1` records in this scope.
- Do not read or print `.env`; media scripts may load approved variables internally.
- Do not update Playwright visual baselines.
- Use Node `22.23.2` for code checks, build, preview, and Playwright to match CI’s Node 22 major.

## File Structure

- Create ignored source `public/images/homepage-material-story/home-material-eo-gio-01-drawing-v2.png`: technical-drawing derivative.
- Create ignored source `public/images/homepage-material-story/home-material-eo-gio-02-material-v2.png`: partially materialised derivative.
- Create ignored source `public/images/homepage-material-story/home-material-eo-gio-03-factory-v2.png`: clean joinery-workshop derivative.
- Modify through tooling `app/shared/media/manifest.json`: add three planned/active records while preserving all 164 existing assets.
- Regenerate through tooling `app/media/catalog.generated.ts`: expose `companyMedia.homeMaterialEoGio01DrawingV2`, `homeMaterialEoGio02MaterialV2`, and `homeMaterialEoGio03FactoryV2`.
- Regenerate through tooling `app/media/fallback.generated.ts`: map the three new storage paths to their local ignored sources.
- Modify `app/media/home-media.ts`: bind the first three stages to the new company assets and `space` to the existing Eo Gió project asset.
- Modify `tests/homepage-story.test.ts`: assert the three generated paths, the exact Eo Gió final path and dimensions, stage order, and decorative alt text.
- Inspect without modifying `app/pages/index.vue`: it already passes `homeMaterialStoryMedia` to `HomeMaterialStory`.
- Inspect without modifying `app/components/HomeMaterialStory.vue`: its shared geometry, sticky scene, mobile flow, and reduced-motion implementation remain the approved contract.
- Restore ignored local fallback `public/images/projects/khach-san-eo-gio/sanh-don/24.png` from the existing `.media-build` master when local fallback mode is used; this is the manifest's documented source path, not a new homepage duplicate.
- Use ignored evidence under `.superpowers/sdd/2026-08-14-homepage-eo-gio-material-story/`; do not commit screenshots or generated review data.

---

### Task 1: Generate and visually approve the three Eo Gió derivatives

**Files:**
- Create ignored: `public/images/homepage-material-story/home-material-eo-gio-01-drawing-v2.png`
- Create ignored: `public/images/homepage-material-story/home-material-eo-gio-02-material-v2.png`
- Create ignored: `public/images/homepage-material-story/home-material-eo-gio-03-factory-v2.png`
- Reference read-only: `D:/work/LaiHuy/laihuy-interior/.media-build/projects/khach-san-eo-gio/sanh-don/24.webp`

**Interfaces:**
- Consumes: immutable master `projects/khach-san-eo-gio/sanh-don/24.webp`, `2560 × 1600`.
- Produces: three accepted PNG sources with identical `16:10` dimensions and stable versioned filenames.
- Produces no tracked code or generated catalog change; Task 2 owns media registration.

- [ ] **Step 1: Verify and inspect the immutable master**

Run:

```powershell
Test-Path 'D:/work/LaiHuy/laihuy-interior/.media-build/projects/khach-san-eo-gio/sanh-don/24.webp'
node -e "const sharp=require('sharp'); const p='D:/work/LaiHuy/laihuy-interior/.media-build/projects/khach-san-eo-gio/sanh-don/24.webp'; sharp(p).metadata().then(m=>console.log(JSON.stringify({width:m.width,height:m.height,format:m.format}))).catch(e=>{console.error(e);process.exit(1)})"
```

Expected: `True` and `{"width":2560,"height":1600,"format":"webp"}`. Open this exact file with the local image viewer and confirm it is the approved wide Eo Gió lobby photograph with the curved reception desk left of centre.

- [ ] **Step 2: Generate frame 01 directly from the master**

Use the built-in GPT Image edit tool with `referenced_image_paths` containing only the immutable master and this prompt:

```text
Use case: technical architectural editorial image, frame 01 of a 4-frame website sequence.
Edit the supplied real Eo Gió hotel reception photograph into a precise authored architectural perspective drawing while preserving the exact 16:10 composition, camera position, eye level, lens character, vanishing points, curved reception-counter footprint, ceiling outline, glazing divisions, principal furniture footprints and subject scale. Keep the counter dominant and slightly left of centre, with all critical geometry inside the central 80%.

Visual treatment: ivory technical-paper ground; crisp charcoal and muted blue-grey architectural linework; very restrained walnut-coloured construction accents; clean depth hierarchy; abstract dimension ticks and construction marks only. It must read as an architectural drawing created before construction, not as a filtered photograph and not as CAD software UI.

Remove the real hotel signage rather than redrawing it. No people, readable text, numbers, logo, watermark, software chrome, shading artefacts, warped joinery, duplicate counter, floating object or decorative clutter. Preserve the real geometry exactly enough to align with the supplied master in a left-to-right reveal.
```

Copy the accepted result to `public/images/homepage-material-story/home-material-eo-gio-01-drawing-v2.png`. If the result contains false text or geometry drift, retry only frame 01 against the unchanged master.

- [ ] **Step 3: Generate frame 02 directly from the master**

Use the built-in GPT Image edit tool with the same single master reference and this prompt:

```text
Use case: architectural material-resolution editorial image, frame 02 of a 4-frame website sequence.
Edit the supplied real Eo Gió hotel reception photograph into the same room partway between technical drawing and built space. Preserve the exact 16:10 composition, camera position, eye level, lens character, vanishing points, curved reception-counter footprint, ceiling outline, glazing divisions, principal furniture footprints and subject scale. Keep the counter dominant and slightly left of centre, with all critical geometry inside the central 80%.

Approximately 35–40% of precise charcoal-and-ivory technical linework remains visible. Resolve warm walnut veneer, pale ivory stone, matte-black metal and restrained neutral upholstery only in their eventual architectural locations. The image must feel like the same drawing becoming a room, not a flat-lay, mood board or loose sample collage. It is warmer and more material than frame 01 but visibly incomplete compared with the real photograph.

Remove the real hotel signage rather than redrawing it. No people, readable text, numbers, logo, watermark, loose samples, fabricated signage, warped joinery, duplicate counter, impossible reflection or unrelated decoration. Preserve exact geometry for a clean reveal against the master.
```

Copy the accepted result to `public/images/homepage-material-story/home-material-eo-gio-02-material-v2.png`. Retry only frame 02 if linework coverage, material placement or geometry fails.

- [ ] **Step 4: Generate frame 03 directly from the master**

Use the built-in GPT Image edit tool with the same single master reference and this prompt:

```text
Use case: photorealistic-natural joinery manufacturing editorial image, frame 03 of a 4-frame website sequence.
Transform the supplied real Eo Gió reception composition into a clean, credible joinery production bay where the same distinctive curved reception-counter module is being assembled. Preserve the 16:10 frame, camera height, lens character, counter silhouette, counter scale and left-biased placement closely enough to bridge into the supplied completed photograph. The workshop background may change, but the counter remains the unmistakable anchor and critical geometry stays inside the central 80%.

Show warm unfinished walnut, exposed edges, controlled assembly seams and several active clamps. Include one compact secondary CNC or bench cue, orderly extraction and clean task lighting so the scene unmistakably reads as direct manufacturing. Keep tools and machinery subordinate to the counter. Use realistic workshop surfaces and raw timber warmth that progresses naturally into the finished image.

Do not recreate the hotel lobby, hotel signage or a showroom. No people, readable text, numbers, logo, watermark, branded machine, leaning stock in the far-right field, rolling-cart clutter, dirt theatre, on-site installation cues, extra counter, warped joinery or floating tool.
```

Copy the accepted result to `public/images/homepage-material-story/home-material-eo-gio-03-factory-v2.png`. Retry only frame 03 if it reads as a lobby installation, loses the curved-counter anchor, or becomes cluttered.

- [ ] **Step 5: Verify dimensions and source identity**

Run:

```powershell
node -e "const sharp=require('sharp'); const ps=['public/images/homepage-material-story/home-material-eo-gio-01-drawing-v2.png','public/images/homepage-material-story/home-material-eo-gio-02-material-v2.png','public/images/homepage-material-story/home-material-eo-gio-03-factory-v2.png']; Promise.all(ps.map(async p=>{const m=await sharp(p).metadata(); return {p,width:m.width,height:m.height,ratio:(m.width??0)/(m.height??1)}})).then(rows=>{console.log(JSON.stringify(rows,null,2)); if(new Set(rows.map(r=>r.width+'x'+r.height)).size!==1||rows.some(r=>Math.abs(r.ratio-1.6)>0.01)) process.exit(1)}).catch(e=>{console.error(e);process.exit(1)})"
```

Expected: one shared dimension and every ratio within `0.01` of `1.6`.

- [ ] **Step 6: Inspect the complete sequence at original and section scale**

View frame 01, frame 02, frame 03, and the immutable master at original detail. Produce ignored `640 × 400` review copies:

```powershell
$reviewDir = Join-Path (Get-Location) '.superpowers/sdd/2026-08-14-homepage-eo-gio-material-story/evidence'
New-Item -ItemType Directory -Force -Path $reviewDir | Out-Null
$env:EO_GIO_REVIEW_DIR = $reviewDir
node -e "const path=require('path'); const sharp=require('sharp'); const items=[['01-drawing.png','public/images/homepage-material-story/home-material-eo-gio-01-drawing-v2.png'],['02-material.png','public/images/homepage-material-story/home-material-eo-gio-02-material-v2.png'],['03-factory.png','public/images/homepage-material-story/home-material-eo-gio-03-factory-v2.png'],['04-space-real.png','D:/work/LaiHuy/laihuy-interior/.media-build/projects/khach-san-eo-gio/sanh-don/24.webp']]; Promise.all(items.map(([name,src])=>sharp(src).resize(640,400,{fit:'cover',position:'centre'}).png().toFile(path.join(process.env.EO_GIO_REVIEW_DIR,name)))).then(()=>console.log('review frames built')).catch(e=>{console.error(e);process.exit(1)})"
```

Inspect the four review files as a set. Confirm drawing → partial materials → clean workshop → real Eo Gió lobby, progressive warmth, safe crop, no false text in generated frames, and a recognisable curved-counter bridge from frame 03 to frame 04.

- [ ] **Step 7: Confirm Task 1 has no tracked diff**

Run: `git status --short`

Expected: no tracked change from the three ignored image sources. Do not create an empty commit; Task 2 will register the accepted assets.

### Task 2: Register, optimise, and conditionally publish the three new media assets

**Files:**
- Modify through tooling: `app/shared/media/manifest.json`
- Regenerate through tooling: `app/media/catalog.generated.ts`
- Regenerate through tooling: `app/media/fallback.generated.ts`
- Create ignored: `.media-build/company/homepage-material-story/home-material-eo-gio-*.webp`

**Interfaces:**
- Consumes: the three accepted Task 1 PNG sources.
- Produces: `companyMedia.homeMaterialEoGio01DrawingV2`, `companyMedia.homeMaterialEoGio02MaterialV2`, `companyMedia.homeMaterialEoGio03FactoryV2`.
- Produces storage prefix: `company/homepage-material-story/home-material-eo-gio-`.
- Leaves the existing Eo Gió project record and four earlier story records unchanged.

- [ ] **Step 1: Switch to the CI-compatible Node runtime**

Run:

```powershell
nvm use 22.23.2
node --version
pnpm --version
```

Expected: Node `v22.23.2` and pnpm `10.29.3`.

- [ ] **Step 2: Dry-run the merge scan**

Run: `pnpm media:scan --merge`

Expected: exit 0, all seven local homepage-story sources are discovered, and no manifest write occurs.

- [ ] **Step 3: Write the merged manifest and prove preservation**

Run: `pnpm media:scan --write --merge`

Then run:

```powershell
$before = (git show HEAD:app/shared/media/manifest.json | Out-String | ConvertFrom-Json).assets
$after = (Get-Content -Raw 'app/shared/media/manifest.json' | ConvertFrom-Json).assets
$beforePaths = @($before.path)
$missing = @($beforePaths | Where-Object { $_ -notin @($after.path) })
$new = @($after | Where-Object { $_.path -notin $beforePaths })
[pscustomobject]@{Before=$before.Count;After=$after.Count;Missing=$missing.Count;New=@($new.path)} | ConvertTo-Json -Compress
if ($before.Count -ne 164 -or $after.Count -ne 167 -or $missing.Count -ne 0 -or $new.Count -ne 3) { exit 1 }
```

Expected: `Before=164`, `After=167`, `Missing=0`, and exactly the three `home-material-eo-gio-*-v2.webp` paths are new.

- [ ] **Step 4: Regenerate and verify the typed catalog**

Run:

```powershell
pnpm media:catalog
rg -n "homeMaterialEoGio(01Drawing|02Material|03Factory)V2" app/media/catalog.generated.ts
```

Expected: three keys, each with the accepted source dimensions. Confirm `app/media/fallback.generated.ts` contains exactly three new Eo Gió story mappings.

- [ ] **Step 5: Optimise only the new filename prefix**

Run:

```powershell
pnpm media:optimize --path-prefix=company/homepage-material-story/home-material-eo-gio-
```

Expected: three masters plus `w400`, `w800`, and `w1600` variants; no attempt to read an unrelated absent source.

- [ ] **Step 6: Dry-run immutable remote publication**

Run:

```powershell
pnpm media:upload --dry-run --path-prefix=company/homepage-material-story/home-material-eo-gio-
```

Expected when configured: twelve `UPLOAD`, `SKIP`, or matching `RESUME` objects, zero conflict, and zero missing build. If `NUXT_PUBLIC_SUPABASE_URL` is unavailable, preserve the non-zero exit in the report, do not inspect `.env`, skip actual upload, and keep the three entries `planned`.

- [ ] **Step 7: Upload only when the dry-run passed and credentials are available**

Run only after Step 6 exits 0:

```powershell
pnpm media:upload --path-prefix=company/homepage-material-story/home-material-eo-gio-
```

Expected: immutable upload with `upsert: false`, three assets become `active`, and no existing object is overwritten. If the service-role key is unavailable, record remote publication as incomplete and do not substitute a dashboard upload.

- [ ] **Step 8: Run focused media verification**

Run:

```powershell
pnpm exec vitest run tests/media.test.ts tests/media-selection.test.ts
pnpm lint:media
pnpm typecheck
git diff --check
```

Expected: all commands exit 0. Inspect the generated diff and confirm there are only three added media identities plus normal `generatedAt`, checksum, variant, byte, and status fields produced by the scripts.

- [ ] **Step 9: Commit the registered media data**

```powershell
git add app/shared/media/manifest.json app/media/catalog.generated.ts app/media/fallback.generated.ts
git commit -m "feat(media): register Eo Gio material story assets"
```

Expected: the commit contains only the three tracked media-pipeline files.

### Task 3: Bind the Eo Gió sequence with a failing unit test first

**Files:**
- Modify: `tests/homepage-story.test.ts`
- Modify: `app/media/home-media.ts`
- Inspect only: `app/pages/index.vue`

**Interfaces:**
- Consumes: the three generated `companyMedia` keys from Task 2.
- Consumes: `projectMedia['khach-san-eo-gio'].galleries['sanh-don']` and exact path `projects/khach-san-eo-gio/sanh-don/24.webp`.
- Preserves: `homeMaterialStoryMedia: Record<HomeStoryStageId, MediaImage>` with IDs `drawing`, `material`, `factory`, `space`.
- Produces: all four entries with `alt: ''`; `space` retains dimensions `2560 × 1600`.

- [ ] **Step 1: Replace the old mapping assertions with the new contract**

In `tests/homepage-story.test.ts`, keep the stage-order test and replace the existing media-binding expectations with:

```ts
it('binds the generated lead-up to the real Eo Gio reception photograph', () => {
  expect(homeMaterialStoryMedia.drawing.path)
    .toBe('company/homepage-material-story/home-material-eo-gio-01-drawing-v2.webp')
  expect(homeMaterialStoryMedia.material.path)
    .toBe('company/homepage-material-story/home-material-eo-gio-02-material-v2.webp')
  expect(homeMaterialStoryMedia.factory.path)
    .toBe('company/homepage-material-story/home-material-eo-gio-03-factory-v2.webp')
  expect(homeMaterialStoryMedia.space).toMatchObject({
    path: 'projects/khach-san-eo-gio/sanh-don/24.webp',
    width: 2560,
    height: 1600,
    alt: ''
  })
  expect(Object.values(homeMaterialStoryMedia).every(image => image.alt === '')).toBe(true)
})
```

- [ ] **Step 2: Run the focused test and verify the red state**

Run: `pnpm exec vitest run tests/homepage-story.test.ts`

Expected: FAIL because `homeMaterialStoryMedia` still points to the four earlier `home-material-*-v1.webp` company assets.

- [ ] **Step 3: Implement the minimal focused media join**

Replace `app/media/home-media.ts` with:

```ts
import type { HomeStoryStageId } from '~/data/home-page'
import { companyMedia, projectMedia } from './catalog.generated'
import type { MediaAsset, MediaImage } from '~/shared/media/types'

const EO_GIO_RECEPTION_PATH = 'projects/khach-san-eo-gio/sanh-don/24.webp'

const decorative = (asset: MediaAsset): MediaImage => ({ ...asset, alt: '' })

const eoGioReception = projectMedia['khach-san-eo-gio'].galleries['sanh-don']
  ?.find(asset => asset.path === EO_GIO_RECEPTION_PATH)

if (!eoGioReception) {
  throw new Error(`[home-media] Missing catalog asset: ${EO_GIO_RECEPTION_PATH}`)
}

export const homeMaterialStoryMedia: Record<HomeStoryStageId, MediaImage> = {
  drawing: decorative(companyMedia.homeMaterialEoGio01DrawingV2),
  material: decorative(companyMedia.homeMaterialEoGio02MaterialV2),
  factory: decorative(companyMedia.homeMaterialEoGio03FactoryV2),
  space: decorative(eoGioReception)
}
```

Do not change `app/pages/index.vue`; it already passes this record into `<HomeMaterialStory>`.

- [ ] **Step 4: Run the focused test and verify green**

Run:

```powershell
pnpm exec vitest run tests/homepage-story.test.ts tests/media.test.ts tests/media-selection.test.ts
```

Expected: all focused tests pass.

- [ ] **Step 5: Run binding-level static checks**

Run:

```powershell
pnpm lint:media
pnpm lint
pnpm typecheck
git diff --check
```

Expected: all commands exit 0. Confirm `app/pages/index.vue` and `app/components/HomeMaterialStory.vue` remain byte-identical to their pre-task versions.

- [ ] **Step 6: Commit the focused binding**

```powershell
git add app/media/home-media.ts tests/homepage-story.test.ts
git commit -m "feat(home): use Eo Gio material story sequence"
```

Expected: the commit contains exactly the media join and its unit test.

### Task 4: Verify production behaviour and leave the updated homepage open

**Files:**
- Test without modification: `tests/e2e/homepage-material-story.spec.ts`
- Inspect without modification: `app/components/HomeMaterialStory.vue`
- Create ignored local fallback when absent: `public/images/projects/khach-san-eo-gio/sanh-don/24.png`
- Create ignored evidence: `.superpowers/sdd/2026-08-14-homepage-eo-gio-material-story/evidence/*`

**Interfaces:**
- Consumes: the committed media registration and homepage binding.
- Produces: evidence for actual image sources, scroll progression, geometry, breakpoints, mobile flow, reduced motion, local/remote media availability, and clean final scope.
- Leaves a production preview available for user review.

- [ ] **Step 1: Run the complete static and unit suite on Node 22**

Run:

```powershell
nvm use 22.23.2
pnpm lint
pnpm lint:media
pnpm test
pnpm typecheck
```

Expected: every command exits 0.

- [ ] **Step 2: Restore the documented Eo Gió local fallback when absent**

The sparse worktree does not contain the ignored manifest source `public/images/projects/khach-san-eo-gio/sanh-don/24.png`. Restore it only for local fallback and production-preview verification from the existing immutable `.media-build` master:

```powershell
$env:EO_GIO_MASTER = 'D:/work/LaiHuy/laihuy-interior/.media-build/projects/khach-san-eo-gio/sanh-don/24.webp'
$env:EO_GIO_FALLBACK = (Join-Path (Get-Location) 'public/images/projects/khach-san-eo-gio/sanh-don/24.png')
New-Item -ItemType Directory -Force -Path (Split-Path -Parent $env:EO_GIO_FALLBACK) | Out-Null
node -e "const sharp=require('sharp'); sharp(process.env.EO_GIO_MASTER).png().toFile(process.env.EO_GIO_FALLBACK).then(()=>console.log('restored Eo Gio fallback')).catch(e=>{console.error(e);process.exit(1)})"
```

Expected: the ignored fallback exists at `2560 × 1600`. Do not stage it, add a duplicate company media entry, or alter the existing project manifest record.

- [ ] **Step 3: Build the production bundle**

Run: `pnpm build`

Expected: exit 0. Record non-fatal Nuxt, Tailwind sourcemap, Nitro externalisation, or Node deprecation warnings separately; a warning does not replace the exit-code requirement.

- [ ] **Step 4: Verify the configured media mode**

Run: `pnpm media:verify`

Expected in local fallback mode: all referenced files resolve on disk. If Task 2 uploaded successfully and Supabase media is enabled, also run `pnpm media:verify --remote` and require the three new masters/variants plus the existing Eo Gió master to return `200 image/*`. If remote publication was skipped, report it as incomplete instead of claiming deployment readiness.

- [ ] **Step 5: Start the fresh production preview without stopping unrelated services**

Inspect port `3020`, stop only this worktree's existing preview, and otherwise select unused port `3021`:

```powershell
$port = 3020
$listener = Get-NetTCPConnection -State Listen -LocalPort $port -ErrorAction SilentlyContinue | Select-Object -First 1
if ($listener) {
  $owner = Get-CimInstance Win32_Process -Filter "ProcessId=$($listener.OwningProcess)"
  if ($owner.CommandLine -like '*home-material-story-images*.output/server/index.mjs*') {
    Stop-Process -Id $listener.OwningProcess
  } else {
    $port = 3021
    if (Get-NetTCPConnection -State Listen -LocalPort $port -ErrorAction SilentlyContinue) { throw 'Ports 3020 and 3021 are both occupied' }
  }
}
$env:NITRO_HOST = '127.0.0.1'
$env:NITRO_PORT = [string]$port
$preview = Start-Process -FilePath (Get-Command node).Source -ArgumentList '.output/server/index.mjs' -WorkingDirectory (Get-Location) -WindowStyle Hidden -PassThru
[pscustomobject]@{Pid=$preview.Id;Origin="http://127.0.0.1:$port"}
```

Use the reported origin for every remaining command. Require HTTP 200 from `/` and the four story image URLs before browser review.

- [ ] **Step 6: Verify real-image sources in Chromium**

Using the in-app browser against the chosen preview origin with image requests enabled, confirm:

```text
drawing  → home-material-eo-gio-01-drawing-v2
material → home-material-eo-gio-02-material-v2
factory  → home-material-eo-gio-03-factory-v2
space    → projects/khach-san-eo-gio/sanh-don/24.webp
```

Require every visible image to have non-zero natural dimensions, every scoped request to return `200 image/*`, and zero console/page errors. Save ignored screenshots of the four stages at `1440 × 900`.

- [ ] **Step 7: Inspect the desktop progress and breakpoint matrix**

At widths `768`, `1279`, `1280`, and `1440`, inspect progress `0`, `0.5`, and `1`. Confirm the order drawing → material → factory → real Eo Gió photograph, no layer-specific scale/transform, no image/frame geometry delta, no uncovered reveal region, no horizontal overflow, and a recognisable curved-counter bridge at the factory-to-space transition.

- [ ] **Step 8: Inspect mobile and reduced motion with real images**

At `390` and `767`, require four normal-flow frames with visible real images, correct order, safe crops, non-zero boxes, and non-sticky layout. At `1440` with `prefers-reduced-motion: reduce`, require the layered desktop canvas to be hidden and all four per-stage images visible in normal flow.

- [ ] **Step 9: Run the focused Playwright story specification**

Use the existing ignored no-webserver config so the test targets the already-verified production preview:

```powershell
$env:DENSITY_TEST_ORIGIN = 'http://127.0.0.1:3020'
pnpm exec playwright test tests/e2e/homepage-material-story.spec.ts --config=.superpowers/sdd/2026-08-13-homepage-material-story-images/playwright.no-webserver.config.ts --project=vr --workers=1 --reporter=line
```

Use `3021` in `DENSITY_TEST_ORIGIN` if Step 5 selected it. Expected: all focused assertions pass and the process exits 0. If Windows completes assertions but hangs during shutdown, preserve the timeout/non-zero result and terminate only the exact leftover Playwright process.

- [ ] **Step 10: Run final checks after browser verification**

Run:

```powershell
pnpm lint
pnpm lint:media
pnpm test
pnpm typecheck
pnpm build
git diff --check
git status --short --branch
```

Expected: all commands exit 0, tracked status is clean after the Task 2 and Task 3 commits, no snapshot changed, and the final two implementation commits have the exact scopes documented above.

- [ ] **Step 11: Rebuild/restart if the final build changed `.output`, then hand off**

After the final successful build, restart only the exact preview PID from Step 5 so the open browser serves the final `.output`. Leave the homepage at the top in Vietnamese with viewport overrides reset. Report the preview URL, exact commit hashes, test counts/exits, image-generation retries, local/remote media status, skipped prerequisites, warnings, and any remaining deployment concern.
