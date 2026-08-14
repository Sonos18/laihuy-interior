# Homepage Material Story Image Series Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create and integrate four purpose-built, geometrically consistent images that show one hotel-reception module progressing from technical drawing to completed space.

**Architecture:** Generate stage 04 first as the composition master, then use it as the explicit edit reference for stages 03, 02, and 01. Register the selected files under the existing `company/` media domain, using a tested merge mode because this checkout has zero files in the ignored `public/images` source library and a normal full scan would erase the existing 160-asset manifest. Filter optimisation and upload by path prefix so the new series can be processed without touching unrelated media.

**Tech Stack:** OpenAI built-in image generation, Node 22, TypeScript 5.9, Sharp 0.34, Nuxt 4.3, Vue 3.5, Vitest 4.1, Playwright 1.61, existing Supabase Storage media tooling.

## Global Constraints

- Use the approved same-camera reception-module storyboard in `docs/superpowers/specs/2026-08-13-homepage-material-story-images-design.md`.
- Images are conceptual editorial assets, not documentary photographs of a named Lai Huy project or factory.
- Keep a 16:10 landscape composition, 24–28 mm architectural lens, eye-level camera, left-biased subject, and central-80% crop safety.
- Use only ivory, charcoal, walnut, muted stone, and matte-black metal; warm the camera-left light gradually from stage 01 to stage 04.
- No people, logos, signage, readable text, watermark, branded products, clutter, warped joinery, duplicate fixtures, or inconsistent perspective.
- Keep all four images decorative (`alt: ''`); adjacent authored text already communicates the stage meaning.
- Do not change the section layout, copy, timing, scroll mechanics, or factual factory-proof photography.
- Do not hand-edit `app/media/catalog.generated.ts`, `app/media/fallback.generated.ts`, or `app/shared/media/manifest.json`.
- Do not run an unqualified `pnpm media:scan --write`: `public/images` currently contains zero source files while the manifest contains 160 assets.
- Do not upload by dashboard or overwrite existing Storage objects; new filenames use `-v1` and the uploader keeps `upsert: false`.
- Do not read or print `.env`; media scripts may load approved variables internally.
- Preserve all pre-existing homepage redesign changes in the dirty worktree.
- Do not commit, push, update visual baselines, or deploy unless the user separately asks.

## File Structure

- Create `scripts/media/selection.ts`: pure merge and prefix-selection helpers for partial-source checkouts.
- Modify `scripts/media/scan.ts`: discover `public/images/homepage-material-story/` and support `--merge` without deleting absent assets.
- Modify `scripts/media/optimize.ts`: support `--path-prefix=company/homepage-material-story/`.
- Modify `scripts/media/upload.ts`: support the same prefix for dry-run and upload.
- Create `tests/media-selection.test.ts`: unit coverage for idempotent merge, collision rejection, and prefix selection.
- Create ignored sources under `public/images/homepage-material-story/`: four selected generated PNG files.
- Regenerate `app/shared/media/manifest.json`, `app/media/catalog.generated.ts`, and `app/media/fallback.generated.ts` through scripts only.
- Create `app/media/home-media.ts`: own the homepage stage-to-asset mapping.
- Modify `app/pages/index.vue`: consume the focused homepage media join.
- Modify `tests/homepage-story.test.ts`: assert stable catalog paths and stage mapping.
- Keep `tests/e2e/homepage-material-story.spec.ts`: use it for responsive and motion verification without changing approved layout assertions.

---

### Task 1: Add safe partial-library media selection

**Files:**
- Create: `scripts/media/selection.ts`
- Create: `tests/media-selection.test.ts`
- Modify: `scripts/media/scan.ts`
- Modify: `scripts/media/optimize.ts`
- Modify: `scripts/media/upload.ts`

**Interfaces:**
- Produces: `mergeDiscoveredAssets(existing, discovered): MediaManifestAsset[]`
- Produces: `selectAssetsByPrefix(assets, pathPrefix): MediaManifestAsset[]`
- CLI: `pnpm media:scan --write --merge`
- CLI: `pnpm media:optimize --path-prefix=company/homepage-material-story/`
- CLI: `pnpm media:upload --dry-run --path-prefix=company/homepage-material-story/`

- [ ] **Step 1: Write failing unit tests for merge and prefix behavior**

Create `tests/media-selection.test.ts` with fixtures that prove:

```ts
expect(mergeDiscoveredAssets([existing], [newAsset])).toEqual([existing, newAsset])
expect(mergeDiscoveredAssets([existing], [{ ...existing }])).toEqual([existing])
expect(() => mergeDiscoveredAssets([existing], [{ ...existing, sourceFile: 'different.png' }]))
  .toThrow(/storage path collision/)
expect(selectAssetsByPrefix([existing, newAsset], 'company/homepage-material-story/'))
  .toEqual([newAsset])
```

- [ ] **Step 2: Run the focused test and confirm the red state**

Run: `pnpm exec vitest run tests/media-selection.test.ts`
Expected: FAIL because `scripts/media/selection.ts` does not exist.

- [ ] **Step 3: Implement the pure helpers**

Create `scripts/media/selection.ts`:

```ts
import type { MediaManifestAsset } from '../../app/shared/media/types'

export function mergeDiscoveredAssets(
  existing: readonly MediaManifestAsset[],
  discovered: readonly MediaManifestAsset[]
): MediaManifestAsset[] {
  const merged = new Map(existing.map(asset => [asset.path, asset]))
  for (const asset of discovered) {
    const current = merged.get(asset.path)
    if (!current) {
      merged.set(asset.path, asset)
      continue
    }
    if (current.sourceFile !== asset.sourceFile) {
      throw new Error(`storage path collision: ${asset.path}`)
    }
  }
  return [...merged.values()].sort((a, b) => a.path.localeCompare(b.path))
}

export function selectAssetsByPrefix(
  assets: readonly MediaManifestAsset[],
  pathPrefix: string | null
): MediaManifestAsset[] {
  return pathPrefix ? assets.filter(asset => asset.path.startsWith(pathPrefix)) : [...assets]
}
```

- [ ] **Step 4: Add guarded home-story discovery and merge mode**

In `scripts/media/scan.ts`, add an optional directory:

```ts
const HOME_STORY_DIR = join(PUBLIC_IMAGES, 'homepage-material-story')
```

When it exists, discover each image as:

```ts
asset({
  storagePath: `company/homepage-material-story/${normalizeFilename(file)}`,
  domain: 'company',
  group: 'homepage-material-story',
  sourceRel: `public/images/homepage-material-story/${file}`,
  oldPublicPath: `/images/homepage-material-story/${file}`,
  width: dims.width,
  height: dims.height,
  kind: dims.kind
})
```

When `--merge` is present, use `mergeDiscoveredAssets(readManifest().assets, assets)` before writing. Without `--merge`, preserve current full-regeneration behavior.

- [ ] **Step 5: Add prefix selection to optimise and upload**

Parse only the exact form `--path-prefix=<prefix>` in both scripts and pass the manifest assets through `selectAssetsByPrefix`. Reject an empty prefix. The upload audit remains full-manifest only and must not be combined with a prefix.

- [ ] **Step 6: Verify the helper tests and existing media tests**

Run: `pnpm exec vitest run tests/media-selection.test.ts tests/media.test.ts`
Expected: PASS.

- [ ] **Step 7: Run static checks for the tooling change**

Run: `pnpm lint`
Run: `pnpm typecheck`
Expected: both exit 0.

- [ ] **Step 8: Review the diff without committing**

Run: `git diff -- scripts/media tests/media-selection.test.ts` and confirm no unrelated pipeline behavior changed.

### Task 2: Generate and approve the completed-space master

**Files:**
- Create ignored source: `public/images/homepage-material-story/home-material-04-space-v1.png`

**Interfaces:**
- Produces the single geometric reference used by every later generation call.
- Built-in image generation only; no CLI fallback and no API key.

- [ ] **Step 1: Generate frame 04 with the built-in image tool**

Use this final prompt:

```text
Use case: photorealistic-natural
Asset type: scroll-driven architectural editorial website image, frame 04 of a four-image series
Primary request: a completed contemporary hotel reception built around one distinctive reception counter and matching feature-wall module
Scene/backdrop: refined unoccupied hotel lobby, restrained and buildable architecture
Subject: walnut reception counter with ivory stone worktop, matte-black metal shadow details, aligned walnut feature wall, quiet ceiling geometry
Style/medium: high-end natural architectural photography, realistic material response, no CGI gloss
Composition/framing: 16:10 landscape, 24–28 mm architectural lens, eye-level camera, reception module centred slightly left, copy-safe negative space on the right, critical geometry inside central 80%
Lighting/mood: warm diagonal architectural light from camera-left, calm premium hospitality atmosphere
Color palette: ivory, charcoal, walnut brown, muted stone, matte black
Constraints: this image will be the exact perspective and geometry reference for three derivative stages; straight verticals, coherent vanishing points, realistic joinery, empty space
Avoid: people, logo, signage, readable text, watermark, branded products, decorative clutter, warped cabinetry, impossible reflections, duplicate fixtures, floating objects
```

- [ ] **Step 2: Copy the generated file into the workspace**

Copy the selected built-in output from its reported `$CODEX_HOME/generated_images/...` path to `public/images/homepage-material-story/home-material-04-space-v1.png`. Never leave a project-referenced asset only under `$CODEX_HOME`.

- [ ] **Step 3: Inspect the master at original resolution**

Use the local image viewer and reject the image if it contains false text, a watermark, visibly warped joinery, multiple competing counters, cropped critical geometry, or insufficient right-side copy space.

- [ ] **Step 4: If needed, iterate one defect at a time**

Use the same prompt and add only one correction, such as “increase clean negative space on the right while keeping camera and counter unchanged.” Save the accepted result to the stable `-v1` filename.

### Task 3: Derive workshop, materials, and drawing frames

**Files:**
- Create ignored source: `public/images/homepage-material-story/home-material-03-factory-v1.png`
- Create ignored source: `public/images/homepage-material-story/home-material-02-material-v1.png`
- Create ignored source: `public/images/homepage-material-story/home-material-01-drawing-v1.png`

**Interfaces:**
- Consumes: frame 04 as an explicit reference image via `referenced_image_paths`.
- Produces: three stage images with the same camera, counter footprint, ceiling, wall proportions, and vanishing points.

- [ ] **Step 1: Generate frame 03 from the master reference**

Edit the master with: “Transform this exact reception module into a clean real joinery workshop assembly scene. Preserve camera position, lens, vanishing points, counter footprint, ceiling outline, feature-wall proportions, and camera-left light direction. Show unfinished walnut modules, realistic edges, clamps and assembly seams; CNC equipment stays secondary and soft. No people, text, logos, watermark, dirt theatre, warped joinery, or extra modules.”

- [ ] **Step 2: Generate frame 02 from the master reference**

Edit the master with: “Transform this exact composition into a material-approval stage. Preserve camera position, lens, vanishing points, module geometry, and light direction. Materialise walnut veneer, ivory stone, matte-black metal and neutral fabric in their eventual architectural zones while retaining approximately 35% precise charcoal-and-ivory technical linework. It must feel like the same room resolving, not a flat-lay collage. No people, readable text, logos, watermark, loose sample clutter, or distorted geometry.”

- [ ] **Step 3: Generate frame 01 from the master reference**

Edit the master with: “Transform this exact composition into a precise editorial architectural perspective drawing. Preserve camera, vanishing points, reception-counter footprint, ceiling geometry and feature-wall proportions. Use ivory and muted-walnut linework on a charcoal technical grid. Construction ticks may be abstract but there must be no readable labels or numbers. No people, logos, watermark, software UI, or distorted geometry.”

- [ ] **Step 4: Copy every accepted output to its stable workspace path**

Use the exact filenames listed above. Keep discarded variants outside the project source tree.

- [ ] **Step 5: Inspect the four-frame series side by side**

Confirm shared counter silhouette, camera height, vanishing points, wall divisions, light direction, central-80% crop safety, and progressive warming. Iterate only the failing frame against the unchanged master.

### Task 4: Register, optimise, and publish the new media series

**Files:**
- Modify through tooling: `app/shared/media/manifest.json`
- Regenerate through tooling: `app/media/catalog.generated.ts`
- Regenerate through tooling: `app/media/fallback.generated.ts`
- Create ignored outputs: `.media-build/company/homepage-material-story/*.webp`

**Interfaces:**
- Produces `companyMedia.homeMaterial01DrawingV1`, `homeMaterial02MaterialV1`, `homeMaterial03FactoryV1`, and `homeMaterial04SpaceV1`.

- [ ] **Step 1: Dry-run the merge scan**

Run: `pnpm media:scan --merge`
Expected: discovery includes the four new `company/homepage-material-story/` paths and does not write.

- [ ] **Step 2: Write the merged manifest and verify preservation**

Record the pre-run asset count (expected 160), then run `pnpm media:scan --write --merge`.
Expected: 164 assets; all prior manifest paths remain byte-for-byte represented by path and status; only four planned entries are new.

- [ ] **Step 3: Generate the typed catalog**

Run: `pnpm media:catalog`
Expected: all four stable `companyMedia` keys exist with real dimensions.

- [ ] **Step 4: Optimise only the new prefix**

Run: `pnpm media:optimize --path-prefix=company/homepage-material-story/`
Expected: four masters plus w400/w800/w1600 variants; zero attempts to read absent legacy source files.

- [ ] **Step 5: Dry-run the immutable remote upload**

Run: `pnpm media:upload --dry-run --path-prefix=company/homepage-material-story/`
Expected: 16 `UPLOAD` objects, zero conflict, zero missing-build. If public URL configuration is unavailable, stop and report the skipped remote check; do not read `.env` manually.

- [ ] **Step 6: Upload through the existing script when credentials are available**

Run: `pnpm media:upload --path-prefix=company/homepage-material-story/`
Expected: four assets become `active`; no existing object is overwritten. If the service-role key is unavailable, retain local fallback preview and report remote publication as incomplete.

### Task 5: Bind the series to the homepage with a failing test first

**Files:**
- Modify: `tests/homepage-story.test.ts`
- Create: `app/media/home-media.ts`
- Modify: `app/pages/index.vue`

**Interfaces:**
- Consumes: the four `companyMedia` keys generated in Task 4.
- Produces: `homeMaterialStoryMedia: Record<HomeStoryStageId, MediaImage>` with the existing stage ids `drawing`, `material`, `factory`, and `space`.

- [ ] **Step 1: Add a failing catalog mapping test**

In `tests/homepage-story.test.ts`, import `homeMaterialStoryMedia` from the not-yet-created `app/media/home-media.ts` and assert:

```ts
expect(homeMaterialStoryMedia.drawing.path)
  .toBe('company/homepage-material-story/home-material-01-drawing-v1.webp')
expect(homeMaterialStoryMedia.material.path)
  .toBe('company/homepage-material-story/home-material-02-material-v1.webp')
expect(homeMaterialStoryMedia.factory.path)
  .toBe('company/homepage-material-story/home-material-03-factory-v1.webp')
expect(homeMaterialStoryMedia.space.path)
  .toBe('company/homepage-material-story/home-material-04-space-v1.webp')
expect(Object.values(homeMaterialStoryMedia).every(image => image.alt === '')).toBe(true)
```

- [ ] **Step 2: Run the focused test and confirm it fails before binding**

Run: `pnpm exec vitest run tests/homepage-story.test.ts`
Expected: FAIL because `app/media/home-media.ts` does not exist.

- [ ] **Step 3: Create the focused homepage media join**

Create `app/media/home-media.ts`:

```ts
import type { HomeStoryStageId } from '~/data/home-page'
import { companyMedia } from '~/media/catalog.generated'
import type { MediaAsset, MediaImage } from '~/shared/media/types'

const decorative = (asset: MediaAsset): MediaImage => ({ ...asset, alt: '' })

export const homeMaterialStoryMedia: Record<HomeStoryStageId, MediaImage> = {
  drawing: decorative(companyMedia.homeMaterial01DrawingV1),
  material: decorative(companyMedia.homeMaterial02MaterialV1),
  factory: decorative(companyMedia.homeMaterial03FactoryV1),
  space: decorative(companyMedia.homeMaterial04SpaceV1)
}
```

- [ ] **Step 4: Replace the reused asset lookup in `app/pages/index.vue`**

Import `homeMaterialStoryMedia` and pass it to `<HomeMaterialStory :images="homeMaterialStoryMedia">`. Remove only the four old `requireMedia` searches, local `decorative` helper, `storyImages`, and imports made unused by that removal. Keep the hero and featured-project media unchanged.

- [ ] **Step 5: Run focused unit and media tests**

Run: `pnpm exec vitest run tests/homepage-story.test.ts tests/media.test.ts tests/media-selection.test.ts`
Expected: PASS.

- [ ] **Step 6: Run the literal guard and typecheck**

Run: `pnpm lint:media`
Run: `pnpm typecheck`
Expected: both exit 0.

### Task 6: Verify the complete visual story and preview

**Files:**
- Test: `tests/e2e/homepage-material-story.spec.ts`
- Inspect: `app/components/HomeMaterialStory.vue`

**Interfaces:**
- Consumes the unchanged section component and new media series.
- Produces browser evidence for stage continuity, crop safety, responsive mode, and reduced motion.

- [ ] **Step 1: Build the production bundle**

Run: `pnpm build`
Expected: exit 0; record non-fatal Nuxt/Tailwind warnings separately.

- [ ] **Step 2: Verify remote objects when upload succeeded**

Run: `pnpm media:verify --remote` after the fresh build.
Expected: the new prerendered masters and variants return 200 with `image/*` content types. If Task 4 could not upload because credentials were unavailable, skip this command and report remote publication as incomplete.

- [ ] **Step 3: Start the production preview on an unused port**

Start `.output/server/index.mjs` with a local port such as 3010 and keep it alive for user review. Do not stop unrelated services occupying port 3000.

- [ ] **Step 4: Inspect scroll progress at desktop widths**

At 768, 1279, 1280, and 1440 px, inspect progress 0, 0.5, and 1. Confirm the intended image order, consistent module geometry, no uncovered layer, no missing request, and no horizontal overflow.

- [ ] **Step 5: Inspect normal-flow mobile and reduced-motion modes**

At 390 and 767 px, confirm four separate frames, correct order, safe crops, readable adjacent copy, and `position !== sticky`. At 1440 px with reduced motion, confirm the same normal-flow fallback.

- [ ] **Step 6: Run the focused Playwright specification**

Run: `DENSITY_TEST_ORIGIN=http://localhost:3010 pnpm exec playwright test tests/e2e/homepage-material-story.spec.ts --project=vr --workers=1 --reporter=line` using PowerShell environment syntax.
Expected: all assertions pass and the process exits 0. If Windows hangs after assertions, record the timeout/non-zero result and terminate only the exact leftover Playwright process.

- [ ] **Step 7: Run final checks**

Run: `pnpm lint`
Run: `pnpm lint:media`
Run: `pnpm test`
Run: `pnpm typecheck`
Run: `pnpm build`
Run: `git diff --check`
Expected: all commands exit 0; build warnings are documented.

- [ ] **Step 8: Review final scope and leave the preview open**

Run `git status --short` and inspect the full diff. Confirm no snapshots, unrelated routes, secrets, or existing media entries were changed. Leave the homepage at the top in Vietnamese with the temporary viewport override reset.
