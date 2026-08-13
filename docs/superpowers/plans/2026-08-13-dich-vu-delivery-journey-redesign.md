# `/dich-vu` Delivery-Journey Redesign Implementation Plan

> Historical plan: superseded by `2026-08-13-dich-vu-editorial-v2-implementation.md`.

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the six-card Services page with the approved Option A delivery journey that persuades owners and general contractors to open the contact route with drawings or a BOQ in mind.

**Architecture:** Keep `services.ts` canonical, add one typed Services-page editorial module, and render the approved six chapters from `app/pages/dich-vu.vue` through two focused presentational components. Protect the content ordering and bilingual data with Vitest, then protect page structure, links, SEO, accessibility-relevant behavior, and breakpoint geometry with a targeted Playwright specification.

**Tech Stack:** Nuxt 4.3.1, Vue 3.5.28, TypeScript 5.9.3, Tailwind CSS 4.1.18, Vitest 4.1.9, Playwright 1.61.1, pnpm 10.29.3.

## Global Constraints

- Preserve the current shared `AppHero`, global shell, Inter typography, semantic design tokens, media pipeline, and bilingual locale behavior.
- Keep `app/data/services.ts` canonical for service titles, descriptions, details, icons, and IDs.
- Use generated media records and `MediaImage`; do not hardcode `/images/` or Supabase object URLs.
- CTA links may navigate to `/lien-he` or use `company.phone`; do not add upload or claim that an enquiry or document was sent, received, stored, or will be answered.
- Do not add dependencies, backend services, API routes, analytics, or form transport.
- Do not edit generated media files, the media manifest, or Playwright visual baselines.
- Verify both locales at 767/768 and 1279/1280 boundaries.
- Do not commit, push, rebase, or change branches without explicit user instruction.

---

## File Structure

- Modify `app/data/services.ts`: export the closed `ServiceId` union and keep all six canonical service records.
- Create `app/data/services-page.ts`: own only Services-page framing copy, ordered IDs, document inputs, and localized proof media alt text.
- Create `app/components/ServicesJourneyRail.vue`: render the ordered 01–03 core service rail from props.
- Create `app/components/ServicesProgramList.vue`: render the ordered 04–06 specialist programme rows from props.
- Modify `app/pages/dich-vu.vue`: select canonical services/media, orchestrate six chapters, preserve SEO, and render real CTA destinations.
- Create `tests/services-page.test.ts`: validate the editorial data, canonical service partition, bilingual copy, and media copy.
- Create `tests/e2e/services-delivery-journey.spec.ts`: verify chapter order, canonical content, links, JSON-LD, reduced motion, focus, and breakpoint layouts.

### Task 1: Typed Services-Page Data Contract

**Files:**
- Create: `tests/services-page.test.ts`
- Modify: `app/data/services.ts`
- Create: `app/data/services-page.ts`

**Interfaces:**
- Produces: `ServiceId`, `servicesPageContent`, `serviceCoreIds`, `serviceProgrammeIds`, `servicesMediaAlt`.
- Consumes: `LocalizedText`, `Service`, and the six canonical `services` records.

- [ ] **Step 1: Write the failing data test**

Create `tests/services-page.test.ts` with literal expectations that catch a missing, duplicated, or reordered canonical service:

```ts
import { describe, expect, it } from 'vitest'
import { services } from '../app/data/services'
import {
  serviceCoreIds,
  serviceProgrammeIds,
  servicesMediaAlt,
  servicesPageContent
} from '../app/data/services-page'

const locales = ['vi', 'en'] as const

describe('services delivery-journey page data', () => {
  it('partitions all canonical services into the approved 01-06 order', () => {
    expect(serviceCoreIds).toEqual(['design', 'factory-production', 'construction'])
    expect(serviceProgrammeIds).toEqual(['hotel-interior', 'commercial-projects', 'export-oem'])
    expect([...serviceCoreIds, ...serviceProgrammeIds]).toEqual(services.map(service => service.id))
  })

  it.each(locales)('contains complete editorial and media copy in %s', (locale) => {
    expect(servicesPageContent.documents.items).toHaveLength(3)
    expect(servicesPageContent.documents.items.every(item => item.title[locale].trim())).toBe(true)
    expect(Object.values(servicesMediaAlt).every(alt => alt[locale].trim())).toBe(true)
  })

  it('keeps upload and delivery-success claims out of the contact invitation', () => {
    const copy = JSON.stringify(servicesPageContent)
    expect(copy).not.toMatch(/upload|drag.{0,12}drop|tải tệp|kéo.{0,12}thả/i)
    expect(copy).not.toMatch(/đã gửi|đã nhận|gửi thành công|sent successfully|received/i)
  })
})
```

- [ ] **Step 2: Run the data test and verify RED**

Run: `pnpm exec vitest run tests/services-page.test.ts`

Expected: FAIL because `app/data/services-page.ts` does not exist.

- [ ] **Step 3: Close the service ID type**

In `app/data/services.ts`, add the exact union and use it in `Service`:

```ts
export type ServiceId =
  | 'design'
  | 'factory-production'
  | 'construction'
  | 'hotel-interior'
  | 'commercial-projects'
  | 'export-oem'

export type Service = {
  id: ServiceId
  // existing fields remain unchanged
}
```

- [ ] **Step 4: Add the Services-page editorial module**

Create `app/data/services-page.ts` with these typed boundaries:

```ts
import type { ServiceId } from './services'
import type { LocalizedText } from '~/shared/types/localization'

type SectionIntro = {
  eyebrow: LocalizedText
  title: LocalizedText
  description: LocalizedText
}

export const serviceCoreIds = [
  'design',
  'factory-production',
  'construction'
] as const satisfies readonly ServiceId[]

export const serviceProgrammeIds = [
  'hotel-interior',
  'commercial-projects',
  'export-oem'
] as const satisfies readonly ServiceId[]
```

The module must provide localized content for `hero`, `documents`, `journey`, `proof`,
`programmes`, and `contact`. `documents.items` contains exactly `drawings`, `technical`, and
`materials`. `servicesMediaAlt` contains exactly `factory` and `quality`.

- [ ] **Step 5: Run the data test and verify GREEN**

Run: `pnpm exec vitest run tests/services-page.test.ts`

Expected: PASS with no warnings.

- [ ] **Step 6: Review the diff without committing**

Run: `git diff --check -- app/data/services.ts app/data/services-page.ts tests/services-page.test.ts`

Expected: exit 0. Do not commit.

### Task 2: Core Journey and Specialist Presentation Components

**Files:**
- Create: `app/components/ServicesJourneyRail.vue`
- Create: `app/components/ServicesProgramList.vue`
- Create: `tests/e2e/services-delivery-journey.spec.ts`

**Interfaces:**
- Consumes: `readonly Service[]` and the corresponding section intro from `ServicesPageContent`.
- Produces: `data-testid="services-journey-layout"`, `services-core-stage`,
  `services-programme-list`, and `services-programme` contracts for browser verification.

- [ ] **Step 1: Write the failing browser structure test**

Create `tests/e2e/services-delivery-journey.spec.ts`. Add an `openServices()` helper that sets the
`lai-huy-locale` cookie, fulfills image requests with a transparent PNG, selects the requested
viewport, opens `/dich-vu`, and waits for fonts. Add a test for each locale that asserts:

```ts
const chapterOrder = ['promise', 'documents', 'journey', 'proof', 'programmes', 'contact']
const chapters = page.locator('main [data-services-chapter]')
expect(await chapters.evaluateAll(elements =>
  elements.map(element => element.getAttribute('data-services-chapter'))
)).toEqual(chapterOrder)

await expect(page.getByTestId('services-core-stage')).toHaveCount(3)
await expect(page.getByTestId('services-programme')).toHaveCount(3)
```

For each index, assert the rendered heading, description, detail strings, anchor ID, and visible
sequence `01` through `06` against the canonical `services` records.

- [ ] **Step 2: Build and run only the new browser test to verify RED**

Run: `pnpm build`

Then run: `pnpm exec playwright test --project=vr services-delivery-journey.spec.ts`

Expected: FAIL because the approved chapter and component contracts are absent.

- [ ] **Step 3: Implement `ServicesJourneyRail.vue`**

Use props only—no business-data imports:

```ts
defineProps<{
  content: ServicesPageContent['journey']
  services: readonly Service[]
}>()
```

Render a dark `<section id="delivery-journey" data-services-chapter="journey">`, a 40/60 shell
layout at `xl`, and an `<ol>` of three stages. Each item uses `:id="service.id"`,
`data-testid="services-core-stage"`, `scroll-mt-[calc(var(--header-h)+1rem)]`, a literal padded
sequence, canonical copy, icon, and canonical details.

- [ ] **Step 4: Implement `ServicesProgramList.vue`**

Use props only:

```ts
defineProps<{
  content: ServicesPageContent['programmes']
  services: readonly Service[]
  startAt?: number
}>()
```

Render `<section data-services-chapter="programmes">` and an ordered list starting at `4`.
Each `data-testid="services-programme"` row uses the canonical service ID as its anchor and places
sequence/title on the left and description/details on the right at `md+`, stacking on mobile.

- [ ] **Step 5: Rebuild and rerun the browser test**

Run: `pnpm build`

Then run: `pnpm exec playwright test --project=vr services-delivery-journey.spec.ts`

Expected: still FAIL on the page chapter contract because the components are not mounted yet; no
component compile errors are acceptable.

### Task 3: Orchestrate the Approved Six-Chapter Services Page

**Files:**
- Modify: `app/pages/dich-vu.vue`
- Test: `tests/e2e/services-delivery-journey.spec.ts`

**Interfaces:**
- Consumes: `servicesPageContent`, ordered service ID lists, `services`, `requireWorkshopAsset`,
  `withAlt`, `company.phone`, and the two presentation components.
- Produces: six ordered page chapters, stable six service anchors, `/lien-he`, `/nha-xuong`, and
  telephone actions while preserving Services JSON-LD.

- [ ] **Step 1: Add failing CTA, proof, and SEO assertions**

Extend the browser test to assert:

```ts
await expect(page.locator('[data-services-chapter="documents"] a[href="/lien-he"]')).toHaveCount(1)
await expect(page.locator('[data-services-chapter="documents"] a[href="#delivery-journey"]')).toHaveCount(1)
await expect(page.locator('[data-services-chapter="proof"] a[href="/nha-xuong"]')).toHaveCount(1)
await expect(page.locator('[data-services-chapter="contact"] a[href="/lien-he"]')).toHaveCount(1)
await expect(page.locator('[data-services-chapter="contact"] a[href="tel:+84903102012"]')).toHaveCount(1)
await expect(page.locator('[data-services-chapter="contact"]')).not.toContainText(
  /đã gửi|đã nhận|gửi thành công/i
)
```

Parse the page JSON-LD and assert that the `CollectionPage.mainEntity` is an `ItemList` with six
items whose names exactly match visible service order in the active locale.

- [ ] **Step 2: Re-run the browser test and verify RED**

Run: `pnpm exec playwright test --project=vr services-delivery-journey.spec.ts`

Expected: FAIL because the document, proof, and closing-contact chapters do not exist.

- [ ] **Step 3: Select canonical service records and proof media**

In `app/pages/dich-vu.vue`, create a local `selectServices(ids)` function returning service records
in ID order. Select `coreServices` and `programmeServices`. Build `proofImages` from
`requireWorkshopAsset('4.webp')` and `requireWorkshopAsset('8.webp')`, joined with
`servicesMediaAlt.factory` and `servicesMediaAlt.quality` through `withAlt`.

- [ ] **Step 4: Replace the six-card page with six chapters**

Keep the current hero image and `usePageSeo()` contract. Render:

1. `promise`: `AppHero` using typed hero content.
2. `documents`: three semantic document rows, `/lien-he`, and `#delivery-journey` links.
3. `journey`: `ServicesJourneyRail` with the three core records.
4. `proof`: two real `MediaImage` frames, canonical modest proof copy, and `/nha-xuong`.
5. `programmes`: `ServicesProgramList` with three specialist records and sequence start `4`.
6. `contact`: dark CTA with `/lien-he` and the normalized `tel:` link.

Use `data-services-chapter` on each direct chapter root and do not add hidden upload inputs,
dialogs, forms, or success states.

- [ ] **Step 5: Build and run the browser test to verify GREEN**

Run: `pnpm build`

Then run: `pnpm exec playwright test --project=vr services-delivery-journey.spec.ts`

Expected: PASS for content, canonical data, links, chapters, and structured data.

### Task 4: Responsive, Focus, and Reduced-Motion Contracts

**Files:**
- Modify: `tests/e2e/services-delivery-journey.spec.ts`
- Modify: `app/components/ServicesJourneyRail.vue`
- Modify: `app/components/ServicesProgramList.vue`
- Modify: `app/pages/dich-vu.vue`

**Interfaces:**
- Produces: one-column layouts below their breakpoints, 40/60 journey at 1280+, two-column proof
  at 768+, no horizontal overflow, visible focus, and fully resolved reveal states under reduced
  motion.

- [ ] **Step 1: Write failing breakpoint assertions**

For both locales and widths `390`, `767`, `768`, `1279`, `1280`, and `1440`, assert horizontal
overflow is at most one pixel. Count computed grid columns for:

- `services-document-grid`: one below 768, three at 768+.
- `services-journey-layout`: one below 1280, two at 1280+.
- `services-proof-grid`: one below 768, two at 768+.
- `services-programme-row`: one below 768, two at 768+.

Add a 390px reduced-motion test that asserts every `.reveal` element has opacity `1`, transform
`none`, and visibility `visible`. Focus the primary closing CTA and assert it receives focus.

- [ ] **Step 2: Run the targeted browser test and verify RED**

Run: `pnpm exec playwright test --project=vr services-delivery-journey.spec.ts`

Expected: FAIL on any missing test IDs or incorrect grid boundary.

- [ ] **Step 3: Apply the minimal responsive classes and semantic fixes**

Use `md:` for the 768 transitions and `xl:` for the 1280 journey transition. Preserve source
order and do not use CSS `order` to reverse service content. Keep long English copy within the
shell and apply existing measure utilities where appropriate.

- [ ] **Step 4: Rebuild and verify GREEN**

Run: `pnpm build`

Then run: `pnpm exec playwright test --project=vr services-delivery-journey.spec.ts`

Expected: PASS at all 12 locale/width combinations plus the focus/reduced-motion test.

### Task 5: Repository Verification and Final Review

**Files:**
- Review all files listed above.
- Do not update snapshots or unrelated files.

**Interfaces:**
- Produces: evidence that the implementation matches repository-wide static, media, build, hero,
  layout, text, and accessibility contracts.

- [ ] **Step 1: Run static and unit checks**

Run, separately, and require exit 0:

```powershell
pnpm lint
pnpm lint:media
pnpm typecheck
pnpm test
```

- [ ] **Step 2: Run the production build**

Run: `pnpm build`

Expected: exit 0 with `/dich-vu` generated successfully.

- [ ] **Step 3: Run targeted and shared browser gates**

Run, separately:

```powershell
pnpm exec playwright test --project=vr services-delivery-journey.spec.ts
pnpm test:gates:hero
pnpm test:gates:layout
pnpm test:gates:text
pnpm test:gates:a11y
```

Do not run visual approval commands. Record any timeout or non-zero shutdown as a failure even if
assertions appeared to pass.

- [ ] **Step 4: Inspect the final change set**

Run:

```powershell
git diff --check
git diff --stat
git status --short
```

Inspect the actual diff for scope, canonical data reuse, contact-form claims, hardcoded media,
generated files, visual baselines, and unrelated user changes. Do not commit.
