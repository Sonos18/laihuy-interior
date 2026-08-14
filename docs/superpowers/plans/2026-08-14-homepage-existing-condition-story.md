# Homepage Existing-Condition Story Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the mismatched factory step in the homepage Eo Gió story with a generated clean-shell existing-condition step while preserving the approved drawing, material, and real completed-space frames.

**Architecture:** Add one locally generated, versioned company-media asset and expose it through the existing generated catalog. Replace the typed `factory` story key with `existing`; keep `HomeMaterialStory.vue` data-driven so its four-stage sticky, mobile, and reduced-motion presentations continue without a structural rewrite.

**Tech Stack:** Nuxt 4.3.1, Vue 3.5.28, TypeScript 5.9.3, Tailwind CSS 4.1.18, GPT Image, Sharp 0.34.5, Vitest 4.1.9, Playwright 1.61.1, pnpm 10.29.3, Node 22.

## Global Constraints

- Authoritative design: `docs/superpowers/specs/2026-08-14-homepage-existing-condition-story-design.md`.
- Exact stage order: `existing`, `drawing`, `material`, `space`.
- Exact section title: `Từ hiện trạng đến không gian hoàn thiện` / `From existing condition to completed space`.
- Generate only `home-material-eo-gio-00-existing-v1.png`; do not regenerate or edit the approved drawing and material sources.
- Keep `projects/khach-san-eo-gio/sanh-don/24.webp` as the unchanged frame-04 source.
- Use local fallback media only. Do not run `media:upload`, `media:verify --remote`, configure Supabase, inspect `.env`, or add remote media variables.
- Do not add dependencies, change scroll timing, change global design tokens, or update committed visual snapshots.
- Run repository commands with Node 22 and pnpm 10.29.3.
- Preserve the separate factory, machinery, capability, project, process, and CTA sections.

## File Structure

- Create ignored `public/images/homepage-material-story/home-material-eo-gio-00-existing-v1.png`: accepted GPT Image source and local fallback.
- Modify through tooling `app/shared/media/manifest.json`: add exactly one company-media identity.
- Regenerate through tooling `app/media/catalog.generated.ts`: expose `companyMedia.homeMaterialEoGio00ExistingV1`.
- Regenerate through tooling `app/media/fallback.generated.ts`: map the new catalog path to the local PNG.
- Modify `app/data/home-page.ts`: own the stage ID union, bilingual section copy, and exact four-stage order.
- Modify `app/media/home-media.ts`: join the four stage IDs to one new image, two approved images, and the real Eo Gió photograph.
- Modify `tests/homepage-story.test.ts`: enforce content, order, sources, and preservation of manufacturing capability.
- Modify `tests/e2e/homepage-material-story.spec.ts`: enforce bilingual labels and rendered stage-ID order.
- Inspect only `app/components/HomeMaterialStory.vue`: confirm the data-driven component needs no structural change.
- Create ignored `.superpowers/sdd/2026-08-14-homepage-existing-condition-story/evidence/*`: section-scale reviews and browser evidence.

---

### Task 1: Generate and accept the Eo Gió existing-condition frame

**Files:**
- Create ignored: `public/images/homepage-material-story/home-material-eo-gio-00-existing-v1.png`
- Create ignored: `.superpowers/sdd/2026-08-14-homepage-existing-condition-story/evidence/01-existing-640x400.png`
- Inspect only: `.media-build/projects/khach-san-eo-gio/sanh-don/24.webp`
- Inspect only: `public/images/homepage-material-story/home-material-eo-gio-01-drawing-v2.png`
- Inspect only: `public/images/homepage-material-story/home-material-eo-gio-02-material-v2.png`

**Interfaces:**
- Consumes immutable master SHA-256 `D96AB9755AE3647BEF2791520170F2F340A09A710FE47CE26A227F1E800504A7`.
- Preserves drawing SHA-256 `7B8BA5E354266F2840F5BFADB4592BD5E15249DD3B74C28207A9DF96F1B0062D`.
- Preserves material SHA-256 `A57B5D4EDD32366E1A0A89025CE2E5B86384439135CFCD3B6945568E20F4FBC3`.
- Preserves unused factory-source SHA-256 `071E1629217FD34B4A26109B7084177C250DA41F1F444DF48EBDB0C0CE5596EA`.
- Produces one accepted `1586 × 992`, approximately `16:10` PNG with the same camera geometry as the master.

- [ ] **Step 1: Confirm runtime, scope, sources, dimensions, and immutable hashes**

~~~powershell
nvm use 22.23.2
node --version
pnpm --version
git status --short
Get-FileHash -Algorithm SHA256 '.media-build/projects/khach-san-eo-gio/sanh-don/24.webp','public/images/homepage-material-story/home-material-eo-gio-01-drawing-v2.png','public/images/homepage-material-story/home-material-eo-gio-02-material-v2.png','public/images/homepage-material-story/home-material-eo-gio-03-factory-v2.png'
node -e "const sharp=require('sharp'); const p=['.media-build/projects/khach-san-eo-gio/sanh-don/24.webp','public/images/homepage-material-story/home-material-eo-gio-01-drawing-v2.png','public/images/homepage-material-story/home-material-eo-gio-02-material-v2.png']; Promise.all(p.map(async path=>({path,...await sharp(path).metadata()}))).then(rows=>console.log(JSON.stringify(rows.map(({path,width,height,format})=>({path,width,height,format})),null,2))).catch(error=>{console.error(error);process.exit(1)})"
~~~

Expected: Node `v22.23.2`, pnpm `10.29.3`, clean tracked status, the three hashes above, master `2560 × 1600`, and both approved generated frames `1586 × 992`.

- [ ] **Step 2: Inspect the immutable master before generation**

Use `view_image` at original detail on `.media-build/projects/khach-san-eo-gio/sanh-don/24.webp`. Record the camera height, ceiling outline, glazing, corridor, wall divisions, left-light direction, and right-side copy field. Do not edit the master.

- [ ] **Step 3: Generate one independent existing-condition candidate**

Required sub-skill: `imagegen`.

Call GPT Image with `referenced_image_paths` containing only the absolute path to the immutable Eo Gió master and this exact prompt:

~~~text
Edit this exact completed Eo Gió hotel reception photograph into the same interior before fit-out: a professionally surveyed, clean unfinished shell. Preserve the exact camera position, eye level, lens character, vanishing points, room proportions, ceiling outline, glazing, corridor, wall divisions, architectural openings, and direction of daylight. Remove the completed reception counter, all furniture, upholstery, wall cladding, finish flooring, decorative lights, plants, artwork, signs, and loose samples. Show a clean bare concrete floor, unfinished plaster or concrete wall and ceiling surfaces, and only restrained credible MEP service points or short exposed interfaces. Keep the room empty and ready for interior work, with a calm low-contrast right-side field for editorial copy. No people, readable text, logos, watermarks, branding, demolition rubble, heavy dust, unsafe cables, damage, props, duplicate openings, warped architecture, or dramatic construction theatre. Maintain the source 16:10 composition and keep critical geometry inside the central 80 percent.
~~~

Generate one candidate per call. Never use a generated derivative as the reference for a retry.

- [ ] **Step 4: Inspect and accept or retry only frame 01**

Inspect the returned candidate with `view_image` at original detail. Reject it if the room no longer matches the Eo Gió perspective, if finished joinery remains, if the result resembles demolition, or if the right copy field is busy.

If rejected, repeat Step 3 against the unchanged master with a short correction describing only the observed defect. If accepted, use the exact local path returned by the image-generation result and copy that file to:

~~~powershell
$target = Resolve-Path 'public/images/homepage-material-story'
$destination = Join-Path $target 'home-material-eo-gio-00-existing-v1.png'
Copy-Item -LiteralPath $acceptedImagegenPath -Destination $destination -Force
~~~

`$acceptedImagegenPath` is the exact output path returned by the accepted image-generation call; validate it with `Test-Path -LiteralPath $acceptedImagegenPath` before copying.

- [ ] **Step 5: Verify source dimensions without cropping or retouching**

~~~powershell
node -e "const sharp=require('sharp'); const p='public/images/homepage-material-story/home-material-eo-gio-00-existing-v1.png'; sharp(p).metadata().then(({width,height,format})=>{console.log({width,height,format,ratio:width/height}); if(width!==1586||height!==992||format!=='png'||Math.abs(width/height-1.6)>0.01) process.exit(1)}).catch(error=>{console.error(error);process.exit(1)})"
~~~

Expected: `1586 × 992`, PNG, ratio within `0.01` of `1.6`. If the generator returns a different size or ratio, reject and regenerate; do not crop, stretch, or upscale it into compliance.

- [ ] **Step 6: Create and inspect exact section-scale evidence**

~~~powershell
$evidence = '.superpowers/sdd/2026-08-14-homepage-existing-condition-story/evidence'
New-Item -ItemType Directory -Force -Path $evidence | Out-Null
$env:EXISTING_REVIEW = (Resolve-Path $evidence)
node -e "const path=require('path'); const sharp=require('sharp'); sharp('public/images/homepage-material-story/home-material-eo-gio-00-existing-v1.png').resize(640,400,{fit:'cover',position:'centre'}).png().toFile(path.join(process.env.EXISTING_REVIEW,'01-existing-640x400.png')).then(()=>console.log('section-scale evidence created')).catch(error=>{console.error(error);process.exit(1)})"
~~~

Inspect the `640 × 400` evidence together with the approved drawing, material, and real final frame. Require a readable progression from empty shell to technical drawing to material resolution to completed space.

- [ ] **Step 7: Prove protected assets and tracked scope remain unchanged**

~~~powershell
Get-FileHash -Algorithm SHA256 '.media-build/projects/khach-san-eo-gio/sanh-don/24.webp','public/images/homepage-material-story/home-material-eo-gio-01-drawing-v2.png','public/images/homepage-material-story/home-material-eo-gio-02-material-v2.png','public/images/homepage-material-story/home-material-eo-gio-03-factory-v2.png'
git status --short
~~~

Expected: the protected hashes still match Step 1 and there is no tracked diff. Do not create an empty commit for ignored image sources.

### Task 2: Register and optimize the one new local media asset

**Files:**
- Modify through tooling: `app/shared/media/manifest.json`
- Regenerate through tooling: `app/media/catalog.generated.ts`
- Regenerate through tooling: `app/media/fallback.generated.ts`
- Create ignored: `.media-build/company/homepage-material-story/home-material-eo-gio-00-existing-v1*.webp`

**Interfaces:**
- Consumes the accepted Task 1 PNG.
- Produces `companyMedia.homeMaterialEoGio00ExistingV1: MediaAsset`.
- Produces catalog path `company/homepage-material-story/home-material-eo-gio-00-existing-v1.webp`.
- Preserves all 167 prior manifest assets and adds exactly one new identity.

- [ ] **Step 1: Run the safe merged scan as a dry run**

Run: `pnpm media:scan --merge`

Expected: exit 0; the new source is discovered and no tracked file changes.

- [ ] **Step 2: Write the merged manifest and prove preservation**

Run: `pnpm media:scan --write --merge`

Then run:

~~~powershell
$before = (git show HEAD:app/shared/media/manifest.json | Out-String | ConvertFrom-Json).assets
$after = (Get-Content -LiteralPath 'app/shared/media/manifest.json' -Raw -Encoding UTF8 | ConvertFrom-Json).assets
$beforePaths = @($before.path)
$afterPaths = @($after.path)
$missing = @($beforePaths | Where-Object { $_ -notin $afterPaths })
$added = @($after | Where-Object { $_.path -notin $beforePaths })
[pscustomobject]@{Before=$before.Count;After=$after.Count;Missing=$missing.Count;Added=@($added.path)} | ConvertTo-Json -Compress
if ($before.Count -ne 167 -or $after.Count -ne 168 -or $missing.Count -ne 0 -or $added.Count -ne 1 -or $added[0].path -ne 'company/homepage-material-story/home-material-eo-gio-00-existing-v1.webp') { exit 1 }
~~~

Expected: `Before=167`, `After=168`, `Missing=0`, and exactly the new existing-condition identity added.

- [ ] **Step 3: Regenerate the typed catalog and local fallback map**

~~~powershell
pnpm media:catalog
rg -n "homeMaterialEoGio00ExistingV1|home-material-eo-gio-00-existing-v1" app/media/catalog.generated.ts app/media/fallback.generated.ts
~~~

Expected: one catalog key with `1586 × 992` and one fallback mapping to `/images/homepage-material-story/home-material-eo-gio-00-existing-v1.png`.

- [ ] **Step 4: Optimize only the new local media identity**

Run:

~~~powershell
pnpm media:optimize --path-prefix=company/homepage-material-story/home-material-eo-gio-00-existing-v1
Get-ChildItem -LiteralPath '.media-build/company/homepage-material-story' -Filter 'home-material-eo-gio-00-existing-v1*.webp' | Sort-Object Name | Select-Object Name,Length
~~~

Expected: one master plus `w400`, `w800`, and `w1600` variants. Do not run any upload command.

- [ ] **Step 5: Run focused media checks**

~~~powershell
pnpm exec vitest run tests/media.test.ts tests/media-selection.test.ts
pnpm lint:media
pnpm typecheck
git diff --check
~~~

Expected: every command exits 0. Inspect the diff and confirm prior media identities are unchanged apart from generated metadata fields required by the scan/catalog workflow.

- [ ] **Step 6: Commit only the registered media data**

~~~powershell
git add app/shared/media/manifest.json app/media/catalog.generated.ts app/media/fallback.generated.ts
git diff --cached --check
git diff --cached --name-only
git commit -m "feat(media): register Eo Gio existing-condition asset"
~~~

Expected: exactly the three media-pipeline files are committed.

### Task 3: Replace the story contract using TDD

**Files:**
- Modify: `tests/homepage-story.test.ts`
- Modify: `tests/e2e/homepage-material-story.spec.ts`
- Modify: `app/data/home-page.ts`
- Modify: `app/media/home-media.ts`
- Inspect only: `app/components/HomeMaterialStory.vue`

**Interfaces:**
- Consumes `companyMedia.homeMaterialEoGio00ExistingV1` from Task 2.
- Produces `HomeStoryStageId = 'existing' | 'drawing' | 'material' | 'space'`.
- Produces `homeMaterialStoryMedia: Record<HomeStoryStageId, MediaImage>` with four decorative images.
- Preserves `HomeCapabilityId = 'technical' | 'manufacturing' | 'fitout'` and all separate manufacturing proof.

- [ ] **Step 1: Write the failing unit contract**

In `tests/homepage-story.test.ts`, replace the stage-order assertion with:

~~~ts
it('keeps the four delivery stages in the order visitors experience them', () => {
  expect(homeStoryStages.map(stage => stage.id)).toEqual([
    'existing',
    'drawing',
    'material',
    'space'
  ])
})
~~~

Replace the media-binding test with:

~~~ts
it('binds the same-space journey to local Eo Gio media', () => {
  expect(Object.keys(homeMaterialStoryMedia)).toEqual([
    'existing',
    'drawing',
    'material',
    'space'
  ])
  expect(homeMaterialStoryMedia).toHaveProperty(
    'existing.path',
    'company/homepage-material-story/home-material-eo-gio-00-existing-v1.webp'
  )
  expect(homeMaterialStoryMedia.drawing.path)
    .toBe('company/homepage-material-story/home-material-eo-gio-01-drawing-v2.webp')
  expect(homeMaterialStoryMedia.material.path)
    .toBe('company/homepage-material-story/home-material-eo-gio-02-material-v2.webp')
  expect(homeMaterialStoryMedia.space).toMatchObject({
    path: 'projects/khach-san-eo-gio/sanh-don/24.webp',
    width: 2560,
    height: 1600,
    alt: ''
  })
  expect('factory' in homeMaterialStoryMedia).toBe(false)
  expect(Object.values(homeMaterialStoryMedia).every(image => image.alt === '')).toBe(true)
})
~~~

Add this content assertion:

~~~ts
it('starts the story from the surveyed existing condition', () => {
  expect(homePageContent.story).toEqual({
    eyebrow: { vi: 'Một hành trình, một đầu mối', en: 'One journey, one accountable team' },
    title: {
      vi: 'Từ hiện trạng đến không gian hoàn thiện',
      en: 'From existing condition to completed space'
    },
    description: {
      vi: 'Một đầu mối xuyên suốt từ khảo sát hiện trạng, triển khai hồ sơ, chốt vật liệu đến nghiệm thu không gian hoàn thiện.',
      en: 'One accountable team leads the work from the existing-condition survey through documentation, material approval, and final sign-off.'
    }
  })
  expect(homeStoryStages[0]).toEqual({
    id: 'existing',
    label: { vi: 'Hiện trạng', en: 'Existing condition' },
    title: {
      vi: 'Đọc đúng mặt bằng trước khi thiết kế',
      en: 'Read the space before designing'
    },
    description: {
      vi: 'Kích thước, cao độ, kết cấu và các đầu chờ MEP được khảo sát để khóa ràng buộc ngay từ đầu.',
      en: 'Dimensions, levels, structure, and MEP interfaces are surveyed so site constraints are understood from the outset.'
    }
  })
})
~~~

- [ ] **Step 2: Update the browser copy contract before production code**

In `tests/e2e/homepage-material-story.spec.ts`, replace only the two `story` strings and the two `stages` arrays in `COPY`:

~~~ts
story: 'Từ hiện trạng đến không gian hoàn thiện',
stages: ['Hiện trạng', 'Hồ sơ kỹ thuật', 'Vật liệu & mẫu', 'Không gian hoàn thiện'],
~~~

~~~ts
story: 'From existing condition to completed space',
stages: ['Existing condition', 'Technical documents', 'Materials & samples', 'Completed space'],
~~~

After the existing stage-label assertion, add:

~~~ts
expect(await story.locator('[data-stage-id]').evaluateAll(elements =>
  elements.map(element => element.getAttribute('data-stage-id'))
)).toEqual(['existing', 'drawing', 'material', 'space'])
~~~

- [ ] **Step 3: Run the unit test and verify the red state**

Run: `pnpm exec vitest run tests/homepage-story.test.ts`

Expected: FAIL showing the old `drawing, material, factory, space` order, old story title/copy, and missing `existing` media entry. If it passes before production changes, stop and diagnose why the test is not exercising the current source.

- [ ] **Step 4: Implement the typed content and stage sequence**

In `app/data/home-page.ts`, change the ID union to:

~~~ts
export type HomeStoryStageId = 'existing' | 'drawing' | 'material' | 'space'
~~~

Replace `homePageContent.story` with:

~~~ts
story: {
  eyebrow: { vi: 'Một hành trình, một đầu mối', en: 'One journey, one accountable team' },
  title: {
    vi: 'Từ hiện trạng đến không gian hoàn thiện',
    en: 'From existing condition to completed space'
  },
  description: {
    vi: 'Một đầu mối xuyên suốt từ khảo sát hiện trạng, triển khai hồ sơ, chốt vật liệu đến nghiệm thu không gian hoàn thiện.',
    en: 'One accountable team leads the work from the existing-condition survey through documentation, material approval, and final sign-off.'
  }
},
~~~

Insert this object at the start of `homeStoryStages`:

~~~ts
{
  id: 'existing',
  label: { vi: 'Hiện trạng', en: 'Existing condition' },
  title: {
    vi: 'Đọc đúng mặt bằng trước khi thiết kế',
    en: 'Read the space before designing'
  },
  description: {
    vi: 'Kích thước, cao độ, kết cấu và các đầu chờ MEP được khảo sát để khóa ràng buộc ngay từ đầu.',
    en: 'Dimensions, levels, structure, and MEP interfaces are surveyed so site constraints are understood from the outset.'
  }
},
~~~

Delete the complete stage object whose ID is `factory`. Leave the `drawing`, `material`, and `space` objects byte-for-byte unchanged.

- [ ] **Step 5: Implement the four-image media join**

Replace only the exported record in `app/media/home-media.ts` with:

~~~ts
export const homeMaterialStoryMedia: Record<HomeStoryStageId, MediaImage> = {
  existing: decorative(companyMedia.homeMaterialEoGio00ExistingV1),
  drawing: decorative(companyMedia.homeMaterialEoGio01DrawingV2),
  material: decorative(companyMedia.homeMaterialEoGio02MaterialV2),
  space: decorative(eoGioReception)
}
~~~

Do not change the Eo Gió lookup, `decorative` helper, or project path.

- [ ] **Step 6: Run focused unit tests and typecheck for the green state**

~~~powershell
pnpm exec vitest run tests/homepage-story.test.ts tests/media.test.ts tests/media-selection.test.ts
pnpm lint:media
pnpm typecheck
~~~

Expected: every command exits 0; the unit contract now passes and the catalog key is type-safe.

- [ ] **Step 7: Confirm no component or unrelated capability rewrite occurred**

~~~powershell
git diff -- app/components/HomeMaterialStory.vue
git diff -- app/data/home-page.ts | Select-String -Pattern "manufacturing|factory:|Năng lực sản xuất trực tiếp|Sản xuất trực tiếp" -Context 2,2
~~~

Expected: no component diff; the separate factory content and `manufacturing` capability remain present. Only the story’s `factory` stage is removed.

- [ ] **Step 8: Commit the tested homepage contract**

~~~powershell
git add app/data/home-page.ts app/media/home-media.ts tests/homepage-story.test.ts tests/e2e/homepage-material-story.spec.ts
git diff --cached --check
git diff --cached --name-only
git commit -m "feat(home): start Eo Gio story from existing condition"
~~~

Expected: exactly the four named files are committed.

### Task 4: Verify the production UI in local-only media mode

**Files:**
- Test without further modification: `tests/e2e/homepage-material-story.spec.ts`
- Inspect without modification: `app/components/HomeMaterialStory.vue`
- Create ignored: `.superpowers/sdd/2026-08-14-homepage-existing-condition-story/playwright.no-webserver.config.ts`
- Create ignored: `.superpowers/sdd/2026-08-14-homepage-existing-condition-story/evidence/*`

**Interfaces:**
- Consumes the two implementation commits from Tasks 2 and 3.
- Produces local production evidence for real image loading, bilingual copy, stage order, layer alignment, responsive boundaries, reduced motion, and clean final scope.
- Leaves a local production preview running for user inspection without opening an additional mockup tab.

- [ ] **Step 1: Run the complete static and unit suite on Node 22**

~~~powershell
nvm use 22.23.2
pnpm lint
pnpm lint:media
pnpm test
pnpm typecheck
pnpm media:verify
~~~

Expected: every command exits 0 in local mode. Do not run remote verification.

- [ ] **Step 2: Build the production bundle**

Run: `pnpm build`

Expected: exit 0. Record warnings separately; they do not replace the exit-code requirement.

- [ ] **Step 3: Start the fresh production preview safely**

~~~powershell
$port = 3020
$listener = Get-NetTCPConnection -State Listen -LocalPort $port -ErrorAction SilentlyContinue | Select-Object -First 1
if ($listener) {
  $owner = Get-CimInstance Win32_Process -Filter "ProcessId=$($listener.OwningProcess)"
  $repoOutput = [IO.Path]::GetFullPath((Join-Path (Get-Location) '.output/server/index.mjs'))
  if ($owner.CommandLine -like "*$repoOutput*") {
    Stop-Process -Id $listener.OwningProcess
  } else {
    $port = 3021
    if (Get-NetTCPConnection -State Listen -LocalPort $port -ErrorAction SilentlyContinue) {
      throw 'Ports 3020 and 3021 are occupied by unrelated processes'
    }
  }
}
$env:NITRO_HOST = '127.0.0.1'
$env:NITRO_PORT = [string]$port
$preview = Start-Process -FilePath (Get-Command node).Source -ArgumentList '.output/server/index.mjs' -WorkingDirectory (Get-Location) -WindowStyle Hidden -PassThru
$origin = "http://127.0.0.1:$port"
[pscustomobject]@{Pid=$preview.Id;Origin=$origin}
~~~

Require HTTP `200` from `/` and these local paths:

~~~text
/images/homepage-material-story/home-material-eo-gio-00-existing-v1.png
/images/homepage-material-story/home-material-eo-gio-01-drawing-v2.png
/images/homepage-material-story/home-material-eo-gio-02-material-v2.png
/images/projects/khach-san-eo-gio/sanh-don/24.png
~~~

- [ ] **Step 4: Create a durable ignored no-webserver Playwright config**

Create `.superpowers/sdd/2026-08-14-homepage-existing-condition-story/playwright.no-webserver.config.ts` with:

~~~ts
import { defineConfig } from '@playwright/test'
import baseConfig from '../../../playwright.config'

export default defineConfig({
  ...baseConfig,
  webServer: undefined,
  use: {
    ...baseConfig.use,
    baseURL: process.env.DENSITY_TEST_ORIGIN ?? 'http://127.0.0.1:3020'
  }
})
~~~

This file is ignored evidence infrastructure and must not be staged.

- [ ] **Step 5: Run the focused Playwright story contract**

~~~powershell
$env:DENSITY_TEST_ORIGIN = $origin
pnpm exec playwright test tests/e2e/homepage-material-story.spec.ts --config=.superpowers/sdd/2026-08-14-homepage-existing-condition-story/playwright.no-webserver.config.ts --project=vr --workers=1 --reporter=line
~~~

Expected: all focused tests pass and the process exits 0. A passed assertion followed by a timeout or shutdown failure is not a passing command.

- [ ] **Step 6: Inspect the desktop progress and alignment matrix with real images**

Use a real Chromium session with image interception disabled. At widths `768`, `1279`, `1280`, and `1440`, inspect progress `0`, `0.5`, and `1`.

Require:

- stage IDs and visible labels follow `existing → drawing → material → space`;
- all four image requests return `200 image/*` and have non-zero natural dimensions;
- every desktop image has `transform: none`, `scale: none`, and the same rendered box as the shared media frame;
- the empty shell, drawing, and material frames preserve recognisable Eo Gió geometry before the real completed payoff;
- no horizontal overflow, console error, page error, uncovered reveal seam, or stage-specific crop jump.

Save ignored `1440 × 900` screenshots for progress `0`, `0.5`, and `1`.

- [ ] **Step 7: Inspect mobile and reduced motion with real images**

At `390` and `767`, require four normal-flow stage images, correct order, safe crops, non-zero boxes, and non-sticky layout. At `1440` with `prefers-reduced-motion: reduce`, require the layered desktop canvas to be hidden and all four per-stage images visible in normal flow.

Check both Vietnamese and English headings/labels for clipping or overflow. Do not open a separate mockup or storyboard tab.

- [ ] **Step 8: Run final verification after browser review**

~~~powershell
pnpm lint
pnpm lint:media
pnpm test
pnpm typecheck
pnpm build
git diff --check
git status --short --branch
~~~

Expected: every command exits 0, tracked status is clean, no snapshot changed, and the only new commits after the design spec are the media-registration and homepage-contract commits.

- [ ] **Step 9: Restart the preview from the final build and hand off**

After the final successful build, validate and stop only the exact preview PID created in Step 3, then restart `.output/server/index.mjs` on the same port with Node 22. Confirm the homepage and all four local image URLs still return `200`.

Leave the production preview running, but do not navigate or open an additional user-facing browser tab. Report the preview URL, exact commit hashes, test counts and exits, generation retries, local media status, warnings, and any remaining concern.
