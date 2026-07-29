# /lien-he Card Band Reorder Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** On `/lien-he` only, move the five contact information cards below the form + map block and lay them out 1 / 3 / 5 columns across mobile / tablet / desktop.

**Architecture:** The five cards stop being their own `<section class="section-y bg-white">` and become the closing row of the existing `bg-ink-50` form + map band, inside the same `.shell`. That is what makes the requested 64–80px separation reachable: two stacked `.section-y` bands produce a fixed 176px boundary at desktop, and `.section-y` is a site-wide rhythm token that must not be overridden for one page. Everything is class-level markup change in `app/pages/lien-he.vue`; no CSS file, token, component, or other page is touched.

**Tech Stack:** Nuxt 4 · Vue 3 SFC · Tailwind CSS v4 (utilities in the template, design tokens in `app/assets/css/main.css`) · Playwright (VR + gates harness) · pnpm

## Global Constraints

- **Only `app/pages/lien-he.vue` may be edited** (plus the new test file and regenerated VR baselines). No edits to `app/assets/css/main.css`, `app/components/**`, `app/data/**`, other pages, or any design token.
- **`.industrial-card` is untouched.** The card's icon, heading, lines, action link, border, radius, padding, hover transition and colours stay exactly as they are today. The card markup inside the `v-for` is moved verbatim, not rewritten.
- **Card content is unchanged.** `contactCards` in the `<script setup>` block is not modified.
- The contact form, the Google Maps iframe, the two address links beneath it, the header, and the footer are not modified.
- Column counts: **1 column below 768px · 3 columns from 768px · 5 columns from 1280px** (`md:grid-cols-3 xl:grid-cols-5`). Laptops at 1024–1279px keep the 3 + 2 tablet grid — this is a decision, not an oversight (see Decisions below).
- Vertical separation between the form/map block and the card row: **64px below 768px, 80px from 768px** (`mt-16 md:mt-20`).
- Cards align to the page's existing content rail — they live inside the same `.shell` as the form and map. No new max-width and no new horizontal padding anywhere (the codebase has exactly one shell; see `main.css:499-510`).
- Conventional commits. `pnpm lint` and `pnpm typecheck` pass before every commit.

## Decisions (already settled — do not re-litigate)

1. **Cards merge into the `bg-ink-50` band.** The surface behind the cards changes from white to `ink-50`; the cards themselves stay white with their existing border, so they gain definition and now match the white form panel and white map panel that already sit on `ink-50`. The page still ends on `ink-50` into the footer, exactly as today. The alternative — a separate white band — cannot deliver 64–80px without either a hard colour edge directly under the form or a page-local override of the global `.section-y` rhythm.
2. **Five columns begin at `xl` (1280px), not `lg` (1024px).** At 1440px each card is ~240px wide and at 1280px ~227px (~179px of text after `p-6`), which fits the 78-character Long Hậu office address in about four lines. At 1024px a card would be ~176px (~128px of text), pushing that address to roughly six lines and dragging every card in the row taller. 1280px is also this codebase's declared desktop breakpoint (`--bp-xl`, `main.css:120`, which notes "`lg` is NOT one").

## File Structure

| File | Change | Responsibility |
| --- | --- | --- |
| `app/pages/lien-he.vue` | Modify template only, lines 134–322 | Section order + the card grid's responsive columns |
| `tests/e2e/contact-layout.spec.ts` | Create | Geometry gate: DOM order, column counts per viewport, equal widths, 64/80px separation, rail alignment |
| `tests/e2e/visual.spec.ts-snapshots/contact-{390,768,1440}-{vr,vr-edge,vr-firefox}-win32.png` | Regenerate | Approved visual baselines for the new layout |

Only three `contact-*` full-page baselines per browser change. `contact-header-scrolled-*.png` must **not** change — the edit is entirely below the header strip.

---

## Task 1: Layout gate test (failing)

Write the geometry assertions first, against the current page, so they fail for the right reasons: today the cards are *above* the form and sit in a 3-column grid at 1440px.

**Files:**
- Create: `tests/e2e/contact-layout.spec.ts`

**Interfaces:**
- Consumes: `test`, `expect` from `./fixtures` (applies the mandatory reduced-motion emulation before navigation); `settle` from `./helpers` (waits for fonts + images so geometry is final).
- Produces: two DOM hooks that Task 2 must add to `app/pages/lien-he.vue` — `[data-testid="contact-primary"]` on the form + map grid wrapper, and `[data-testid="contact-cards"]` on the card grid wrapper. The five cards are matched by their existing `.industrial-card` class, which on this page is unique to them (the map's address links use inline `rounded-2xl border …` classes, not `.industrial-card`).

- [ ] **Step 1: Write the failing test**

Create `tests/e2e/contact-layout.spec.ts`:

```ts
import type { Page } from '@playwright/test'
import { expect, test } from './fixtures'
import { settle } from './helpers'

/**
 * /lien-he layout gate — docs/superpowers/plans/2026-07-28-lien-he-card-band-reorder.md
 *
 * Geometry, not pixels: this asserts the structural contract (cards close the band, and the
 * row shape at each viewport) so a future edit cannot silently undo it. The pixel record
 * lives in visual.spec.ts.
 */

const CARDS = '[data-testid="contact-cards"] .industrial-card'

/** Cards on the same visual row share a top edge. Sub-pixel rounding differs per engine, so
 *  rows are bucketed with a 2px tolerance rather than compared exactly. */
async function rowShape(page: Page): Promise<number[]> {
  return page.evaluate((selector: string) => {
    const tops = [...document.querySelectorAll(selector)].map(el => el.getBoundingClientRect().top)
    const rows: number[][] = []
    for (const top of tops) {
      const row = rows.find(r => Math.abs(r[0]! - top) < 2)
      if (row) row.push(top)
      else rows.push([top])
    }
    return rows.map(r => r.length)
  }, CARDS)
}

async function open(page: Page, width: number, height = 900) {
  await page.setViewportSize({ width, height })
  await page.goto('/lien-he', { waitUntil: 'load' })
  await settle(page)
}

test('cards close the band — they sit below the form and the map', async ({ page }) => {
  await open(page, 1440)

  const primary = await page.locator('[data-testid="contact-primary"]').boundingBox()
  const cards = await page.locator('[data-testid="contact-cards"]').boundingBox()

  expect(primary).not.toBeNull()
  expect(cards).not.toBeNull()
  expect(cards!.y).toBeGreaterThan(primary!.y + primary!.height)
})

test('cards share the page rail with the form and the map', async ({ page }) => {
  await open(page, 1440)

  const primary = await page.locator('[data-testid="contact-primary"]').boundingBox()
  const cards = await page.locator('[data-testid="contact-cards"]').boundingBox()

  expect(Math.abs(cards!.x - primary!.x)).toBeLessThanOrEqual(1)
  expect(Math.abs(cards!.width - primary!.width)).toBeLessThanOrEqual(1)
})

for (const { width, gap } of [{ width: 390, gap: 64 }, { width: 1440, gap: 80 }] as const) {
  test(`separation from the form+map block is ${gap}px @ ${width}`, async ({ page }) => {
    await open(page, width)

    const primary = await page.locator('[data-testid="contact-primary"]').boundingBox()
    const cards = await page.locator('[data-testid="contact-cards"]').boundingBox()

    expect(cards!.y - (primary!.y + primary!.height)).toBeCloseTo(gap, 0)
  })
}

for (const { width, shape } of [
  { width: 390, shape: [1, 1, 1, 1, 1] },
  { width: 768, shape: [3, 2] },
  { width: 1024, shape: [3, 2] },
  { width: 1440, shape: [5] }
] as const) {
  test(`card grid is ${shape.join(' + ')} @ ${width}`, async ({ page }) => {
    await open(page, width)

    await expect(page.locator(CARDS)).toHaveCount(5)
    expect(await rowShape(page)).toEqual([...shape])
  })
}

test('the five cards are equal width in the desktop row', async ({ page }) => {
  await open(page, 1440)

  const widths = await page.locator(CARDS).evaluateAll(
    els => els.map(el => el.getBoundingClientRect().width)
  )

  expect(widths).toHaveLength(5)
  for (const width of widths) {
    expect(width).toBeCloseTo(widths[0]!, 0)
  }
})
```

- [ ] **Step 2: Start a server for the harness**

The Playwright `webServer` block runs `node .output/server/index.mjs` but has `reuseExistingServer: true`, so a dev server on port 3000 is picked up instead. Geometry is identical either way, so use the faster path for this gate.

In a second terminal:

```bash
pnpm dev
```

Wait for `http://localhost:3000` to be listed as ready.

- [ ] **Step 3: Run the test to verify it fails**

```bash
pnpm exec playwright test --project=vr contact-layout.spec.ts
```

Expected: FAIL. Specifically —
- `cards close the band` fails because `cards.y` is currently *smaller* than the form block's bottom (the cards render above it).
- `card grid is 5 @ 1440` fails with `[3, 2]` received, because the grid is `lg:grid-cols-3` today.
- `card grid is 3 + 2 @ 768` fails with `[2, 2, 1]`, because the grid is `md:grid-cols-2` today.
- The separation tests fail with the 176px `.section-y` boundary.

If any test fails to *find* `[data-testid="contact-primary"]`, that is also expected — Task 2 adds it.

- [ ] **Step 4: Commit the failing gate**

```bash
git add tests/e2e/contact-layout.spec.ts
git commit -m "test(contact): gate the /lien-he card band order and column shape"
```

---

## Task 2: Reorder the page and reshape the card grid

**Files:**
- Modify: `app/pages/lien-he.vue:134-322` (template only — the `<script setup>` block is untouched)

**Interfaces:**
- Consumes: `contactCards`, `projectTypes`, `mapEmbedUrl`, `form`, `submitForm`, `submitted`, `company`, `uiText`, `t` — all already defined in the file's `<script setup>`; none of them change.
- Produces: `[data-testid="contact-primary"]` and `[data-testid="contact-cards"]` for the Task 1 gate.

- [ ] **Step 1: Delete the standalone cards section**

Remove `app/pages/lien-he.vue:134-168` in full — the entire block from `<section class="section-y bg-white">` through its closing `</section>`, plus the blank line that follows it. After this the `<AppHero />` is followed directly by `<section class="section-y bg-ink-50">`.

Keep the `<article>` markup on the clipboard; Step 3 re-inserts it verbatim.

- [ ] **Step 2: Wrap the form + map grid in the shell**

The band's inner element currently carries both the rail and the grid: `<div class="shell grid gap-12 lg:grid-cols-[1fr_0.9fr]">`. Split those two jobs so the card row can share the rail. Replace that single opening tag with:

```vue
      <div class="shell">
        <div
          data-testid="contact-primary"
          class="grid gap-12 lg:grid-cols-[1fr_0.9fr]"
        >
```

Then indent the two children (the white form panel `<div class="rounded-2xl border border-ink-200 bg-white p-6 md:p-8">` and the map `<div>`) by one level, and add the matching extra `</div>` before the section's closing tag. The form's own markup, the iframe, and the address links are not otherwise edited.

- [ ] **Step 3: Add the card row as the band's closing block**

Immediately after the closing `</div>` of `contact-primary`, and before the closing `</div>` of `.shell`, insert:

```vue
        <!-- The five info cards close the band. 64px / 80px off the form+map block: an
             intra-band step, deliberately below the --section-py rhythm, because this is
             not a section boundary. Five equal columns from --bp-xl; below that the long
             Long Hậu address makes a five-up row too narrow to read (3 + 2 instead). -->
        <div
          data-testid="contact-cards"
          class="mt-16 grid gap-5 md:mt-20 md:grid-cols-3 xl:grid-cols-5"
        >
          <article
            v-for="card in contactCards"
            :key="card.title"
            class="industrial-card"
          >
            <Icon
              :name="card.icon"
              class="h-7 w-7 text-wood-500"
            />
            <h2 class="mt-5 text-xl font-black text-ink-950">
              {{ card.title }}
            </h2>
            <p
              v-for="line in card.lines"
              :key="line"
              class="mt-2 text-sm leading-6 text-ink-600"
            >
              {{ line }}
            </p>
            <a
              v-if="card.href"
              :href="card.href"
              target="_blank"
              rel="noopener noreferrer"
              class="mt-5 inline-flex text-sm font-bold text-wood-600"
            >
              {{ card.action }}
            </a>
          </article>
        </div>
```

The `<article>` is byte-identical to the one deleted in Step 1 apart from indentation.

- [ ] **Step 4: Confirm the resulting template shape**

The template after `<AppHero />` must now read exactly one section deep:

```vue
    <section class="section-y bg-ink-50">
      <div class="shell">
        <div data-testid="contact-primary" class="grid gap-12 lg:grid-cols-[1fr_0.9fr]">
          <div class="rounded-2xl border border-ink-200 bg-white p-6 md:p-8"> … form … </div>
          <div> … eyebrow, heading, iframe, address links … </div>
        </div>
        <div data-testid="contact-cards" class="mt-16 grid gap-5 md:mt-20 md:grid-cols-3 xl:grid-cols-5">
          <article v-for="card in contactCards" … />
        </div>
      </div>
    </section>
```

Check that `bg-white` no longer appears as a `<section>` class anywhere in this file, and that `md:grid-cols-2` and `lg:grid-cols-3` are gone from the card grid.

- [ ] **Step 5: Run lint and typecheck**

```bash
pnpm lint
pnpm typecheck
```

Expected: both clean. If ESLint reports `vue/max-attributes-per-line` on the two new `data-testid` elements, keep the multi-line attribute form shown in Steps 2 and 3 rather than collapsing them onto one line.

- [ ] **Step 6: Run the layout gate to verify it passes**

With the dev server from Task 1 still on port 3000:

```bash
pnpm exec playwright test --project=vr contact-layout.spec.ts
```

Expected: 9 passed — order, rail alignment, 64px @ 390, 80px @ 1440, the four row shapes (`1×5` @ 390, `3+2` @ 768, `3+2` @ 1024, `5` @ 1440), and equal widths.

- [ ] **Step 7: Eyeball the four widths**

Open `http://localhost:3000/lien-he` and check at 390 / 768 / 1024 / 1440:
- The form + map block comes first, the five white cards close the page on the `ink-50` surface.
- At 1440 all five cards are one row of equal width; the tallest card (Văn phòng giao dịch, the long address) sets the row height and the others stretch to match.
- No horizontal scrollbar at 390.

- [ ] **Step 8: Commit**

```bash
git add app/pages/lien-he.vue
git commit -m "feat(contact): move the info cards below the form and map, five-up on desktop"
```

---

## Task 3: Approve the visual baselines

VR baselines are approval artefacts: §41 P6 requires the approving commit to contain nothing else, so this is deliberately its own task and its own commit.

**Files:**
- Modify: `tests/e2e/visual.spec.ts-snapshots/contact-390-{vr,vr-edge,vr-firefox}-win32.png`
- Modify: `tests/e2e/visual.spec.ts-snapshots/contact-768-{vr,vr-edge,vr-firefox}-win32.png`
- Modify: `tests/e2e/visual.spec.ts-snapshots/contact-1440-{vr,vr-edge,vr-firefox}-win32.png`

**Interfaces:**
- Consumes: the shipped page from Task 2.
- Produces: nothing consumed by later tasks. There is no `vr-webkit` contact baseline in the repo — do not create one, and do not pass a bare `--update-snapshots` without `--project`, or the webkit project will mint a fourth baseline set.

- [ ] **Step 1: Stop the dev server and build**

Baselines must be captured against the production server the harness declares, not the dev server. Kill the `pnpm dev` process from Task 1 first — `reuseExistingServer: true` would otherwise silently capture against it.

```bash
pnpm build
```

Expected: build completes and `.output/server/index.mjs` exists.

- [ ] **Step 2: Confirm exactly the three contact shots fail**

```bash
pnpm test:vr
```

Expected: `contact @ 390`, `contact @ 768`, `contact @ 1440` fail with a diff. `contact header @ 1440` and all 28 other shots pass.

Two notes so you do not chase ghosts: the header-strip tests at 1440 have a known pre-existing flake in this harness (see commit `109a1c0` and the S214 session record) — if a *non-contact* header strip fails, re-run that single test in isolation before treating it as a regression. And the contact page's Google Maps iframe is masked in `visual.spec.ts:30`, so live map tiles are not part of the comparison.

- [ ] **Step 3: Regenerate only the contact full-page baselines**

```bash
pnpm exec playwright test --project=vr --project=vr-edge --project=vr-firefox visual.spec.ts --update-snapshots -g "contact @"
```

The `-g "contact @"` filter matches the three full-page tests and excludes `contact header @ 1440`.

- [ ] **Step 4: Verify the change set is exactly nine files**

```bash
git status --short tests/e2e/visual.spec.ts-snapshots/
```

Expected: nine modified `contact-{390,768,1440}-{vr,vr-edge,vr-firefox}-win32.png`. If `contact-header-scrolled-*.png` appears, the header strip moved — that is a regression, not an approval; investigate before committing.

- [ ] **Step 5: Re-run the suites clean**

```bash
pnpm test:vr
pnpm test:gates:a11y
```

Expected: VR green (modulo the known header-strip flake noted in Step 2), and 8/8 a11y routes with no WCAG A/AA violations. The card headings are still `<h2>` under the hero's `<h1>`, so heading order is unaffected by the reorder.

- [ ] **Step 6: Commit the baselines alone**

```bash
git add tests/e2e/visual.spec.ts-snapshots/
git commit -m "test(vr): approve the /lien-he baselines for the reordered card band"
```

---

## Verification Summary

| Requirement | Where it is proven |
| --- | --- |
| Form + map first, cards second | Task 1 `cards close the band`; Task 3 baselines |
| Desktop: 5 equal columns, 1 row | Task 1 `card grid is 5 @ 1440` + `equal width in the desktop row` |
| Tablet: 3 then 2 | Task 1 `card grid is 3 + 2 @ 768` |
| Mobile: 1 column | Task 1 `card grid is 1 + 1 + 1 + 1 + 1 @ 390` |
| 64–80px between the blocks | Task 1 separation tests (64 @ 390, 80 @ 1440) |
| Same content container as the rest of the page | Task 1 `cards share the page rail` |
| Card design, icons, text, colours, interactions unchanged | Task 2 Step 3 re-inserts the `<article>` verbatim; `.industrial-card` in `main.css:1414` is not edited |
| Nothing global changed | `git diff --stat` across the branch touches only `app/pages/lien-he.vue`, `tests/e2e/contact-layout.spec.ts`, and nine PNG baselines |
