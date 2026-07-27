# Project Detail Storytelling Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Sharpen the narrative pacing and visual rhythm of the shared project case-study template (`app/pages/du-an/[slug].vue`), used by all 11 projects in `app/data/projects.ts`, without adding new content fields or requiring new photography.

**Architecture:** All changes live in the single existing template file. No new components, no new data fields, no new Tailwind tokens. Section order and two section treatments change; the underlying `Project` data model (`app/shared/types/project.ts`) is untouched.

**Tech Stack:** Nuxt 4 / Vue 3 `<script setup>` + Tailwind v4 utility classes, existing `Icon` (`@iconify-json/lucide`) and `MediaImage` components, existing `v-reveal` scroll directive.

## Global Constraints

- Single file to modify: `app/pages/du-an/[slug].vue`. No new files, no new npm dependencies.
- No new color tokens or backgrounds — use only existing `ink-*` / `wood-*` classes already present in `app/assets/css/main.css`.
- No new `Project` data fields — every change must work with data that already exists on all 11 projects in `app/data/projects.ts` (some fields, e.g. `content.challenge`, are optional per-project; the template's existing `v-if` guards must keep working for projects that omit them).
- Never use `any` (user global rule). This file has no `any` today — keep it that way.
- Before every commit: run `pnpm typecheck` and `pnpm lint` (fast checks). Reserve the slow `pnpm build` and the Playwright VR suite for Task 5, run once at the end — matches this repo's existing convention of one `test(vr): rebaseline …` commit following a batch of `feat`/`refactor` commits (see `git log`: `fd6a598` + `3c9907f` → `6a6fa44`; `b896bc7` → `e68dab0`).
- This page has a Playwright visual-regression baseline (`tests/e2e/visual.spec.ts`, page name `project-detail`, fixture slug `khach-san-eo-gio` per `tests/e2e/helpers.ts:8`). Any layout change here **will** fail `pnpm test:vr` until rebaselined with `pnpm test:vr:approve` — this is expected, not a bug.
- Verify against a project **with** `content.challenge`/`content.materials` and, if one exists, a project **without** them (optional fields — see `app/shared/types/project.ts:16-24`), in both `vi` and `en` locales.

---

## File Structure

Only one file changes:

- Modify: `app/pages/du-an/[slug].vue`
  - `<script setup>`: reorder the `navSections` push order (Task 1); add one new computed (`materialsImage`, Task 4).
  - `<template>`: relocate the Facts section (Task 1); restyle the Challenge section (Task 2); swap the walkthrough marker (Task 3); add an image to the Materials section (Task 4).

---

### Task 1: Move "Project facts" after the Challenge → Solution arc

**Why:** Today the section order is Hero → Overview → **Facts (spec sheet)** → Challenge → Solution → Services → Gallery → Experience → Materials → Testimonial → Related → CTA. The Facts section is a dense data grid that currently interrupts the story right as it starts (Overview sets up the project, then the reader is handed a spec sheet before ever hearing the problem or the solution). Moving it to after Solution lets Overview flow straight into Challenge → Solution, and Facts becomes a "here's the proof, in numbers" beat right before Services — which is where a reader who's just been convinced by the narrative wants confirmation/detail.

**Files:**
- Modify: `app/pages/du-an/[slug].vue:171-184` (script, `navSections` computed)
- Modify: `app/pages/du-an/[slug].vue:385-425` (template, Facts `<section>`)
- Modify: `app/pages/du-an/[slug].vue:427,457` (template, renumber comments)

**Interfaces:**
- Consumes: nothing new — uses existing `facts`, `project.content`, `services` already defined earlier in the script.
- Produces: nothing new — no other task depends on section order.

- [ ] **Step 1: Reorder `navSections` so the in-page nav matches the new visual order**

In `app/pages/du-an/[slug].vue`, replace the `navSections` computed (currently lines 171-184):

```ts
const navSections = computed(() => {
  const sections: { id: string, label: LocalizedText }[] = [
    { id: 'overview', label: { vi: 'Tổng quan', en: 'Overview' } }
  ]
  if (project.content?.challenge) sections.push({ id: 'challenge', label: { vi: 'Thách thức', en: 'Challenge' } })
  if (project.content?.solution) sections.push({ id: 'solution', label: { vi: 'Giải pháp', en: 'Solution' } })
  sections.push({ id: 'facts', label: { vi: 'Thông tin', en: 'Facts' } })
  if (services.length) sections.push({ id: 'services', label: { vi: 'Dịch vụ', en: 'Services' } })
  if (allImages.length) sections.push({ id: 'gallery', label: { vi: 'Hình ảnh', en: 'Gallery' } })
  if (project.content?.experience || highlights.value.length) sections.push({ id: 'experience', label: { vi: 'Trải nghiệm', en: 'Experience' } })
  if (ta(project.content?.materials).length || project.content?.craftsmanship) sections.push({ id: 'materials', label: { vi: 'Vật liệu', en: 'Materials' } })
  if (project.testimonial) sections.push({ id: 'testimonial', label: { vi: 'Cảm nhận', en: 'Testimonial' } })
  return sections
})
```

Only the order of the pushes changed (`facts` moved from first to after `solution`); every id/label pair is unchanged.

- [ ] **Step 2: Cut the Facts `<section>` and relocate it after Solution**

In the template, cut this entire block (currently lines 385-425):

```html
    <!-- 3 · Project facts ---------------------------------------------------->
    <section
      id="facts"
      class="section-y scroll-mt-[calc(var(--header-h)+var(--subnav-h)+1rem)] bg-ink-50"
    >
      <div class="shell">
        <div class="mb-10 max-w-2xl">
          <p
            v-reveal
            class="eyebrow reveal"
          >
            {{ t({ vi: 'Thông tin dự án', en: 'Project facts' }) }}
          </p>
          <h2
            v-reveal="80"
            class="reveal text-section-title mt-4 font-black uppercase text-ink-950"
          >
            {{ t({ vi: 'Những con số đã được xác thực', en: 'The verified essentials' }) }}
          </h2>
        </div>
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <article
            v-for="(fact, index) in facts"
            :key="t(fact.label)"
            v-reveal="(index % 3) * 80"
            class="reveal rounded-2xl border border-ink-200 bg-white p-6 transition-colors hover:border-wood-400"
          >
            <Icon
              :name="fact.icon"
              class="h-7 w-7 text-wood-500"
            />
            <p class="mt-4 text-xl font-black text-ink-950">
              {{ fact.value }}
            </p>
            <p class="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-ink-500">
              {{ t(fact.label) }}
            </p>
          </article>
        </div>
      </div>
    </section>
```

Paste it back in immediately after the Solution section closes (after the current line 498 `</section>`, before the current line 500 `<!-- 6 · Services -->` comment), renumbered:

```html
    <!-- 5 · Project facts ---------------------------------------------------->
    <section
      id="facts"
      class="section-y scroll-mt-[calc(var(--header-h)+var(--subnav-h)+1rem)] bg-ink-50"
    >
      <div class="shell">
        <div class="mb-10 max-w-2xl">
          <p
            v-reveal
            class="eyebrow reveal"
          >
            {{ t({ vi: 'Thông tin dự án', en: 'Project facts' }) }}
          </p>
          <h2
            v-reveal="80"
            class="reveal text-section-title mt-4 font-black uppercase text-ink-950"
          >
            {{ t({ vi: 'Những con số đã được xác thực', en: 'The verified essentials' }) }}
          </h2>
        </div>
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <article
            v-for="(fact, index) in facts"
            :key="t(fact.label)"
            v-reveal="(index % 3) * 80"
            class="reveal rounded-2xl border border-ink-200 bg-white p-6 transition-colors hover:border-wood-400"
          >
            <Icon
              :name="fact.icon"
              class="h-7 w-7 text-wood-500"
            />
            <p class="mt-4 text-xl font-black text-ink-950">
              {{ fact.value }}
            </p>
            <p class="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-ink-500">
              {{ t(fact.label) }}
            </p>
          </article>
        </div>
      </div>
    </section>
```

`bg-ink-50` staying on Facts still gives it a distinct surface from the white Overview/Challenge and dark Solution sections around its new position — the alternation rhythm (white → white → dark → light → white…) is preserved.

- [ ] **Step 3: Renumber the two comments left behind**

Change `<!-- 4 · Challenge -->` (the comment immediately above the Challenge section, now the section right after Overview) to `<!-- 3 · Challenge -->`, and `<!-- 5 · Solution -->` to `<!-- 4 · Solution -->`. These are comments only — no behavior change.

- [ ] **Step 4: Manual check — section order and nav**

Run `pnpm dev`, open `http://localhost:3000/du-an/khach-san-eo-gio`, and confirm:
- Page order reads Hero → Overview → Challenge → Solution → Facts → Services → Gallery → Experience → Materials → Testimonial → Related → CTA.
- The sticky sub-nav pills read in that same order, and clicking each one still scrolls to the right section (the `id`s didn't change, only their position).

- [ ] **Step 5: Typecheck, lint, commit**

```bash
pnpm typecheck
pnpm lint
git add app/pages/du-an/[slug].vue
git commit -m "refactor(project-detail): move facts after the challenge/solution arc"
```

---

### Task 2: Turn Challenge into a centered statement, distinct from Overview

**Why:** Overview and Challenge currently share the exact same `grid gap-12 lg:grid-cols-[0.8fr_1.2fr]` two-column layout — a reader skimming can't visually tell "context" from "problem", they're the same shape with different words. The Testimonial section later in the page already proves a centered, large-type statement works in this design system (`app/pages/du-an/[slug].vue:773-790`). Reusing that same register for Challenge — text alone, no image, large and centered — turns the current lack of a Challenge photo from an oversight into a deliberate beat: the problem is stated starkly in words, and Solution (which already pairs prose with `leadImage`) becomes the first visual payoff on the page after the hero.

**Files:**
- Modify: `app/pages/du-an/[slug].vue:427-455` (the Challenge `<section>`, comment already renumbered to `<!-- 3 · Challenge -->` by Task 1)

**Interfaces:**
- Consumes: `project.content.challenge` (`LocalizedText`, existing), `uiText.labels.challenge` (existing import).
- Produces: nothing new.

- [ ] **Step 1: Replace the Challenge section markup**

Current (post-Task-1) block:

```html
    <!-- 3 · Challenge -------------------------------------------------------->
    <section
      v-if="project.content?.challenge"
      id="challenge"
      class="section-y scroll-mt-[calc(var(--header-h)+var(--subnav-h)+1rem)] bg-white"
    >
      <div class="shell grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p
            v-reveal
            class="eyebrow reveal"
          >
            {{ t(uiText.labels.challenge) }}
          </p>
          <h2
            v-reveal="80"
            class="reveal text-section-title mt-4 font-black uppercase text-ink-950"
          >
            {{ t({ vi: 'Bài toán đặt ra', en: 'The problem to solve' }) }}
          </h2>
        </div>
        <p
          v-reveal="140"
          class="reveal text-lg leading-9 text-ink-600"
        >
          {{ t(project.content.challenge) }}
        </p>
      </div>
    </section>
```

Replace with:

```html
    <!-- 3 · Challenge -------------------------------------------------------->
    <section
      v-if="project.content?.challenge"
      id="challenge"
      class="section-y scroll-mt-[calc(var(--header-h)+var(--subnav-h)+1rem)] bg-white"
    >
      <div class="shell">
        <div class="mx-auto max-w-3xl text-center">
          <p
            v-reveal
            class="eyebrow reveal"
          >
            {{ t(uiText.labels.challenge) }}
          </p>
          <p
            v-reveal="100"
            class="reveal mt-6 text-2xl font-black leading-snug text-ink-950 md:text-3xl"
          >
            {{ t(project.content.challenge) }}
          </p>
        </div>
      </div>
    </section>
```

This drops the `h2` (matching the Testimonial section, which also has no `h2` — headings do not need to appear in every section, and the eyebrow still gives the section a labelled landmark for the sub-nav / skim-reading).

- [ ] **Step 2: Manual check — visual contrast with Overview and Testimonial**

With `pnpm dev` running, view `/du-an/khach-san-eo-gio` (has `content.challenge`) and confirm:
- Challenge now reads as a centered, large statement — visually distinct from Overview's two-column layout right above it.
- It doesn't look like a duplicate of the Testimonial section further down (Testimonial has the quote icon + attribution; Challenge does not — that's expected, they should rhyme, not be identical).
- Check a project whose `content.challenge` is missing (grep `app/data/projects.ts` for an entry without a `challenge` key, if any exist) — the section must not render at all, same as before.

- [ ] **Step 3: Typecheck, lint, commit**

```bash
pnpm typecheck
pnpm lint
git add app/pages/du-an/[slug].vue
git commit -m "feat(project-detail): restyle challenge as a centered statement"
```

---

### Task 3: Replace the walkthrough's numbered badges with a non-sequential marker

**Why:** The "Space walkthrough" list (`walkthroughSteps`, built from `content.designHighlights`) renders each item with a `01 / 02 / 03…` badge (`app/pages/du-an/[slug].vue:682-685`). `designHighlights` is a curated list of standout details (see `app/data/projects.ts:45-61` for the `khach-san-eo-gio` example — reception desk, shelving, niches, kitchen, chairs, lounge), not a literal, ordered walking path a visitor follows room-by-room. Numbering implies a sequence the content doesn't actually promise. The Delivery Process list a few sections earlier (`app/pages/du-an/[slug].vue:549-567`) is a genuine ordered sequence and correctly keeps its `01 / 02…` index — that one is untouched by this task.

**Files:**
- Modify: `app/pages/du-an/[slug].vue:682-685`

**Interfaces:**
- Consumes: nothing new.
- Produces: nothing new.

- [ ] **Step 1: Replace the numbered badge with an icon badge**

Current:

```html
              <span class="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-wood-500 text-sm font-black text-white">
                {{ String(index + 1).padStart(2, '0') }}
              </span>
```

Replace with:

```html
              <span class="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-wood-500 text-white">
                <Icon
                  name="i-lucide-sparkles"
                  class="h-4 w-4"
                />
              </span>
```

Same circle size/color as before (`h-9 w-9 rounded-full bg-wood-500`), so the walkthrough's rhythm and spacing are unaffected — only the badge content changes from a number to an icon, and `index` is no longer read inside the badge (it's still used a few lines up for the `v-reveal="(index % 2) * 90"` stagger and the `md:[&>figure]:order-last` alternation — leave those as-is).

- [ ] **Step 2: Manual check**

On `/du-an/khach-san-eo-gio`, scroll to "Space walkthrough" and confirm each highlight now shows a sparkle icon instead of `01`, `02`, etc., at the same size/position as before.

- [ ] **Step 3: Typecheck, lint, commit**

```bash
pnpm typecheck
pnpm lint
git add app/pages/du-an/[slug].vue
git commit -m "fix(project-detail): stop implying a sequence in walkthrough highlights"
```

---

### Task 4: Give the Materials section a visual anchor

**Why:** Materials & Craftsmanship (`app/pages/du-an/[slug].vue:696-759`) is currently text-only on a dark background — a bulleted list plus a paragraph. It's the one section most tied to this being an *interior* portfolio (specific finishes, specific fabrication), yet it's the least visual section on the page. Adding one representative photo from the project's own gallery — the same editorial license the Solution section already uses (its `leadImage` isn't claimed to depict any single sentence of the solution copy either, see `app/pages/du-an/[slug].vue:484-496`) — gives this section a visual identity instead of being the page's plainest block.

**Files:**
- Modify: `app/pages/du-an/[slug].vue:45-51` (script, add `materialsImage` next to the other media computeds)
- Modify: `app/pages/du-an/[slug].vue:702-729` (template, materials column)

**Interfaces:**
- Consumes: `allImages: MediaImage[]` (existing, defined at line 48).
- Produces: `materialsImage: ComputedRef<MediaImage | undefined>` — local to this file, no other task uses it.

- [ ] **Step 1: Add the `materialsImage` computed**

In `<script setup>`, immediately after the existing `leadImage` computed (currently line 49):

```ts
const leadImage = computed<MediaImage | undefined>(() => allImages[0])
```

add:

```ts
// A fourth gallery image (if the project has one) gives the Materials section a visual
// anchor, the same editorial license `leadImage` already uses for Solution — it isn't
// claimed to depict any one bullet in `content.materials`, just the project's palette.
const materialsImage = computed<MediaImage | undefined>(() =>
  allImages.length > 3 ? allImages[3] : undefined
)
```

- [ ] **Step 2: Render it above the materials list**

In the template, the materials column currently reads (lines 702-729):

```html
        <div v-if="ta(project.content?.materials).length">
          <p
            v-reveal
            class="eyebrow reveal text-wood-300"
          >
            {{ t({ vi: 'Vật liệu & hoàn thiện', en: 'Materials & finishes' }) }}
          </p>
          <h2
            v-reveal="80"
            class="reveal text-section-title mt-4 font-black uppercase"
          >
            {{ t({ vi: 'Bảng vật liệu', en: 'The material palette' }) }}
          </h2>
          <ul class="mt-8 space-y-4">
```

Insert an image block between the `h2` and the `ul`:

```html
        <div v-if="ta(project.content?.materials).length">
          <p
            v-reveal
            class="eyebrow reveal text-wood-300"
          >
            {{ t({ vi: 'Vật liệu & hoàn thiện', en: 'Materials & finishes' }) }}
          </p>
          <h2
            v-reveal="80"
            class="reveal text-section-title mt-4 font-black uppercase"
          >
            {{ t({ vi: 'Bảng vật liệu', en: 'The material palette' }) }}
          </h2>
          <div
            v-if="materialsImage"
            v-reveal="120"
            class="reveal mt-8 overflow-hidden rounded-2xl"
          >
            <MediaImage
              :image="materialsImage"
              preset="card"
              class="aspect-[16/10] w-full"
              img-class="rounded-2xl"
            />
          </div>
          <ul class="mt-8 space-y-4">
```

(The rest of the `<ul>` block, lines 716-729, is unchanged.)

- [ ] **Step 3: Manual check**

On `/du-an/khach-san-eo-gio` (which has more than 4 gallery images), confirm the Materials section now shows a photo above the bullet list, still on the dark `ink-950` background, same rounded-corner treatment as elsewhere on the page. Check a project with 3 or fewer images (if any) to confirm the section still renders correctly with no image (the `v-if="materialsImage"` guard).

- [ ] **Step 4: Typecheck, lint, commit**

```bash
pnpm typecheck
pnpm lint
git add app/pages/du-an/[slug].vue
git commit -m "feat(project-detail): anchor the materials section with a gallery photo"
```

---

### Task 5: Full verification and VR rebaseline

**Why:** All four prior tasks touch the same shared template rendered by all 11 projects. This task is the single, repo-convention-matching gate (`build`, then Playwright VR rebaseline in its own commit — see `git log`: `e68dab0`, `6a6fa44`) that confirms nothing broke across the whole catalog before calling the work done.

**Files:** none (verification only).

- [ ] **Step 1: Full build**

```bash
pnpm build
```

Expected: exits 0. If it fails, fix the reported error before continuing — do not skip.

- [ ] **Step 2: Cross-project manual sweep**

With `pnpm dev` running, check at least these combinations in the browser (toggle the language switcher for the `vi`/`en` check):

- `/du-an/khach-san-eo-gio` — has `challenge`, `solution`, `materials`, `craftsmanship`, many gallery images. Confirm the full new section order and all four task changes render correctly, in both `vi` and `en`.
- One other project slug from `app/data/projects.ts` with a **different** shape (e.g. missing `content.challenge`, or 3 or fewer gallery images) — confirm the `v-if` guards on Challenge and on the Materials image still correctly hide what's missing, and nothing throws in the console.

- [ ] **Step 3: Accessibility spot-check**

```bash
pnpm exec playwright test tests/e2e/a11y.spec.ts
```

Expected: passes. This exercises axe-core against the page set including `project-detail`; the Challenge section's dropped `h2` (Task 2) and the new `Icon`-only badge (Task 3) are exactly the kind of change this catches if it introduces a real accessibility regression.

- [ ] **Step 4: Visual regression — see the expected diff, then approve it**

```bash
pnpm test:vr
```

Expected: **fails** on the 4 `project-detail-*` screenshots (390/768/1440 full-page + header-scrolled) — this is the expected, intended result of Tasks 1-4, not a bug. Open the Playwright HTML report and confirm the diffs are exactly: reordered sections, restyled Challenge, icon badges in the walkthrough, and the new Materials image. If any *other* page's snapshot fails, stop and investigate — that would mean this file's changes leaked into shared chrome (they shouldn't; this file only touches its own template).

Once confirmed, rebaseline:

```bash
pnpm test:vr:approve
```

- [ ] **Step 5: Commit the rebaselined snapshots**

```bash
git add tests/e2e/**/project-detail-*.png
git status
```

Review the `git status` output — it should show only the `project-detail-*.png` snapshot files as changed/added, nothing else. Then:

```bash
git commit -m "test(vr): rebaseline project-detail for the storytelling restructure"
```

---

## Self-Review

- **Spec coverage:** Task 1 → facts-interrupts-narrative. Task 2 → Overview/Challenge visual monotony (also folds in the "Challenge has no image" point from the review — resolved by design, not by adding a mismatched photo). Task 3 → walkthrough numbering implying a false sequence. Task 4 → Materials section lacking a signature visual moment. Task 5 → the "verify" step every task's manual checks feed into, plus the repo's required VR rebaseline.
- **Out of scope, by design:** personalizing the Services / Delivery process / Trust band copy (identified in the review as company-wide boilerplate) is **not** in this plan — fixing it needs new per-project content fields and 11 projects' worth of authored copy, which is a data/content decision, not a template change. Flagging it here so it isn't lost; worth its own plan once someone decides what that copy should say per project.
- **Type consistency:** `materialsImage` (Task 4) follows the exact `computed<MediaImage | undefined>` pattern already used by `leadImage` one line above it — same type, same import (`MediaImage` from `~/shared/media/types`, already imported at the top of the file).
