# Phase 3 Project Detail Quiet Luxury Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Modernize `/du-an/[slug]` into the approved Quiet Luxury / Architectural Editorial visual language, establishing intentional dark/light editorial pacing while preserving the proven Editorial Proof Spine architecture, data integrity, routing, SEO, media behavior, and scope-safety.

**Architecture:** The route retains its August 2026 seven-chapter architecture (Hero + Facts rail, Story, Curated Gallery, Delivery Proof, Material Story, Related Work, Conversion Finale) and 4-anchor sticky subnav. Phase 3 aligns component styling with the Obsidian and warm bronze design system tokens across an alternating dark/light rhythm without altering the pure view-model, data schemas, or media pipelines.

**Tech Stack:** Nuxt 4, Vue 3, Tailwind CSS v4, `@nuxt/ui`, Playwright, Vitest.

**Spec:** `docs/superpowers/specs/2026-09-16-laihuy-phase-3-project-detail-quiet-luxury-design.md`

---

## Global Constraints

1. **Pure Visual Redesign**:
   - Strictly visual and layout alignment. No data schema changes, no project content rewrites, no route changes, no gallery carousel rewrite, and no new conversion funnels.
   - `app/data/projects.ts` is complete across all 11 projects and must NOT be edited.
2. **Explicit Alternating Dark/Light Editorial Rhythm**:
   - **Chapter 1: Hero + Facts Rail** (`ProjectHeroFacts.vue`) — **DARK / Obsidian** (`--color-obsidian`).
   - **Chapter 2: Sticky Subnav** (`app/pages/du-an/[slug].vue`) — **DARK / Obsidian** (`color-mix(in srgb, var(--color-obsidian) 92%, transparent)`).
   - **Chapter 3: Story** (`ProjectStoryChapter.vue`) — **LIGHT / existing editorial light surface** (`bg-white` / `bg-ink-50`).
   - **Chapter 4: Curated Gallery** (`section#gallery`) — **DARK / Obsidian** (`--color-obsidian`).
   - **Chapter 5: Delivery Proof** (`ProjectDeliveryProof.vue`) — **LIGHT / existing editorial light surface** (`bg-white` / `bg-ink-50`).
   - **Chapter 6: Material Story** (`ProjectMaterialStory.vue`) — **DARK / elevated Obsidian** (`--color-surface-dark` / `--color-obsidian`).
   - **Chapter 7: Related Work** (`ProjectRelatedProjects.vue`) — **LIGHT / existing editorial light surface** (`bg-white` / `bg-ink-50`).
   - **Chapter 8: Conversion Finale** (`ProjectConversionFinale.vue`) — **DARK / Obsidian** (`--color-obsidian`).
3. **No New CSS Tokens**:
   - Use only existing design tokens declared in `app/assets/css/main.css`.
   - Dark surfaces: `--color-obsidian`, `--color-surface-dark`, `--color-card-dark`, `--color-ivory`, `--text-muted`, `--text-subtle`, `--bronze`, `--bronze-light`, `--hairline`, `--hairline-gold`.
   - Light surfaces: `bg-white`, `bg-ink-50`, `--fg-light`, `--fg-light-muted`, `--fg-light-subtle`, `--rule-light`, `--accent-light`.
   - Strictly forbidden: `--color-raw-silk`, `--text-muted-dark`, or new raw palette tokens.
4. **Scope-Safety & Truthfulness**:
   - Design-only projects (e.g., `nha-vuon-chily` with scope `Thiết kế`) must never display manufacturing, factory, or craft execution proofs.
   - Prohibit fabricated material swatches, invented wood species, or unverified client claims.
   - Prohibit fake PDF downloads or illustrative BOQ sample download actions. Real actions remain strictly `/lien-he` and telephone consultation.
5. **Protected Local Dirty Work**:
   - `tests/e2e/project-detail-editorial.spec.ts` contains unapproved local exploration work and must be preserved byte-for-byte untouched.
   - All Phase 3 visual and layout tests MUST be authored in a new test file: `tests/e2e/project-detail-phase3-visual.spec.ts`.
6. **Visual Regression Snapshot Policy**:
   - No automated `--update-snapshots` command is permitted during task execution.
   - If visual changes cause snapshot mismatches on existing baselines, record the failures and request separate explicit user authorization before updating snapshots.
7. **Typecheck Policy**:
   - If `pnpm typecheck` fails due to pre-existing dirty work in `app/pages/tuyen-dung.vue`, it must never be reported as PASS. It must be investigated and classified as KNOWN UNRELATED only if Phase 3 files have zero errors.

---

## Responsive Test Matrix

All layout and visual reflow behaviors are verified against the **8 canonical viewports**:

| Viewport Width | Device Class | Facts Rail Columns | Delivery Timeline Rail | Subnav Reflow | Locales | Fixture |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **390 px** | Mobile Small | 2 columns | Vertical stacked | Horizontal scroll, no overflow | VI, EN | `khach-san-eo-gio` |
| **767 px** | Mobile Max | 2 columns | Vertical stacked | Horizontal scroll, no overflow | VI, EN | `khach-san-eo-gio` |
| **768 px** | Tablet Portrait | 3 columns | Horizontal grid (5 cols) | Inline / horizontal | VI, EN | `khach-san-eo-gio` |
| **1023 px** | Tablet Max | 3 columns | Horizontal grid (5 cols) | Inline / horizontal | VI, EN | `khach-san-eo-gio` |
| **1024 px** | Small Desktop | 5 columns | Horizontal grid (5 cols) | Inline horizontal | VI, EN | `khach-san-eo-gio` |
| **1279 px** | Desktop Interm. | 5 columns | Horizontal grid (5 cols) | Inline horizontal | VI, EN | `khach-san-eo-gio` |
| **1280 px** | Desktop Standard | 5 columns | Horizontal grid (5 cols) | Inline horizontal | VI, EN | `khach-san-eo-gio`, `nha-vuon-chily`, `nha-xuong-anh-cuong` |
| **1440 px** | Desktop Large | 5 columns | Horizontal grid (5 cols) | Inline horizontal | VI, EN | `khach-san-eo-gio` |

- **Exhaustive coverage**: Viewport reflow, scrollWidth sanity (`scrollWidth <= window.innerWidth`), and chapter surface rhythm are tested across all 8 viewports for `khach-san-eo-gio` in both `vi` and `en`.
- **Representative coverage**: Scope-safety tests for design-only projects (`nha-vuon-chily`) and short media flow tests (`nha-xuong-anh-cuong`) are tested at desktop (1280 px) and mobile (390 px).

---

## Implementation Tasks

### Checkpoint P3-1: Hero + Facts Rail + Sticky Subnav

#### Task 1: P3-1 Visual Test Contract (TDD Scaffold)
**Checkpoint:** P3-1  
**Files:**  
- Create: `tests/e2e/project-detail-phase3-visual.spec.ts`  
- Modify: none  
- Test: `tests/e2e/project-detail-phase3-visual.spec.ts`  

**Interfaces:**  
- Consumes: `/du-an/[slug]` route DOM structure  
- Produces: Playwright test suite defining observable visual contracts for Hero facts rail and sticky subnav  

- [ ] **Step 1: Create test file with harness helpers**  
  Initialize `tests/e2e/project-detail-phase3-visual.spec.ts` importing `test` and `expect` from `./fixtures`. Implement `openProject(page, locale, path, width, height)` with image mocks and font readiness check.
- [ ] **Step 2: Write failing test for Hero facts rail geometry and tokens**  
  Add test `P3-1-HERO-01: facts rail reflows to 2 cols on mobile, 3 cols on tablet, and 5 cols on desktop`:
  - Viewports 390 & 767 assert `grid-template-columns` count is 2.
  - Viewports 768 & 1023 assert `grid-template-columns` count is 3.
  - Viewports 1024, 1280 & 1440 assert `grid-template-columns` count is 5.
  - Assert `[data-project-facts]` uses obsidian background (`--color-obsidian` / `rgb(11, 10, 9)`).
  - Assert fact borders use hairline tokens (`--hairline` / `--hairline-gold`).
  - Assert category chip has uppercase tracking and bronze kicker styling (`--bronze-light`).
- [ ] **Step 3: Write failing test for Sticky Subnav visual contract**  
  Add test `P3-1-SUBNAV-01: sticky subnav renders dark obsidian backdrop with bronze active chip and zero overflow`:
  - Assert `nav[data-project-subnav]` has computed background matching obsidian translucent mix (`color-mix` / dark backdrop) and gold hairline border (`--hairline-gold`).
  - Assert active chip has bronze active background (`--bronze`) with dark text (`--color-obsidian`).
  - Assert at 390px viewport that `document.documentElement.scrollWidth <= window.innerWidth`.
- [ ] **Step 4: Run Playwright to verify RED state**  
  Execute `pnpm exec playwright test --project=vr tests/e2e/project-detail-phase3-visual.spec.ts -g "P3-1"` and record failing assertions.

---

#### Task 2: Implement Hero Facts & Subnav Quiet Luxury Visuals
**Checkpoint:** P3-1  
**Files:**  
- Create: none  
- Modify: `app/components/ProjectHeroFacts.vue`, `app/pages/du-an/[slug].vue`  
- Test: `tests/e2e/project-detail-phase3-visual.spec.ts`  

**Interfaces:**  
- Consumes: `ProjectDetailFact[]`, `AppHero.vue` slot props  
- Produces: Refined architectural masthead and dark translucent sticky subnav  

- [ ] **Step 1: Refine `ProjectHeroFacts.vue` masthead styling**  
  - In `#chips` slot, style category tag with `text-xs uppercase tracking-[0.16em] text-[var(--bronze-light)] bg-transparent border border-[var(--hairline-gold)] px-3 py-1 rounded-full`.
  - In `#chips` slot, style verified status with `border border-[var(--hairline)] text-[var(--color-ivory)]`.
  - In `#meta` slot, ensure description uses `text-[var(--text-muted)] leading-relaxed`.
  - In `[data-project-facts]`, replace `bg-ink-950` with `bg-[var(--color-obsidian)] border-y border-[var(--hairline)] text-[var(--color-ivory)]`.
  - In `[data-project-fact]`, replace `border-white/12` with `border-[var(--hairline)]`. Update grid layout: `grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5`. Update labels to `text-[var(--text-subtle)]` and values to `text-[var(--color-ivory)]`.
- [ ] **Step 2: Refine Sticky Subnav in `app/pages/du-an/[slug].vue`**  
  - Update `nav[data-project-subnav]` classes:
    `sticky z-30 border-b border-[var(--hairline-gold)] bg-[var(--color-obsidian)]/92 backdrop-blur-md text-[var(--color-ivory)]`.
  - Update chip link styles:
    - Inactive: `text-[var(--text-muted)] hover:text-[var(--color-ivory)] hover:bg-white/5`.
    - Active: `bg-[var(--bronze)] text-[var(--color-obsidian)] font-semibold shadow-sm`.
  - Ensure `.shell flex gap-1 overflow-x-auto py-3 no-scrollbar` maintains mobile touch scrolling without viewport overflow.
- [ ] **Step 3: Run Playwright to verify GREEN state**  
  Execute `pnpm exec playwright test --project=vr tests/e2e/project-detail-phase3-visual.spec.ts -g "P3-1"`. All P3-1 tests must pass.
- [ ] **Step 4: Run existing content spine and view-model unit tests**  
  Execute `pnpm exec vitest run tests/project-content-spine.test.ts tests/project-detail-view-model.test.ts`.
- [ ] **Step 5: Verify protected dirty files integrity**  
  Confirm SHA-256 hashes of all six protected files match preflight.
- [ ] **Step 6: P3-1 Checkpoint Commit & Push**  
  Stage `tests/e2e/project-detail-phase3-visual.spec.ts`, `app/components/ProjectHeroFacts.vue`, `app/pages/du-an/[slug].vue`.
  Commit: `feat(laihuy): align project hero facts and subnav with quiet luxury design`.
  Push to `origin/feat/laihuy-redesign-phase-3`.
  **STOP for independent ChatGPT + user review.**

---

### Checkpoint P3-2: Story + Curated Gallery

#### Task 3: P3-2 Visual Test Contract
**Checkpoint:** P3-2  
**Files:**  
- Create: none  
- Modify: `tests/e2e/project-detail-phase3-visual.spec.ts`  
- Test: `tests/e2e/project-detail-phase3-visual.spec.ts`  

**Interfaces:**  
- Consumes: `/du-an/[slug]` Story and Gallery DOM nodes  
- Produces: Playwright test assertions for light editorial story chapter and dark cinematic gallery  

- [ ] **Step 1: Write failing test for Story Chapter editorial surface**  
  Add test `P3-2-STORY-01: story chapter renders on light editorial surface with asymmetric layout and challenge emphasis`:
  - Assert `section#story` has light background (`bg-white` or `bg-ink-50`).
  - Assert heading uses `text-ink-950` / `var(--fg-light)` and eyebrow uses bronze / wood tone (`--accent-light`).
  - Assert challenge beat has prominent emphasis (`border-l-2 border-[var(--bronze)]` or `--rule-light`).
  - Assert zero horizontal scroll on viewports 390, 768, and 1280.
- [ ] **Step 2: Write failing test for Curated Gallery dark framing and chrome**  
  Add test `P3-2-GALLERY-01: gallery chapter renders on dark obsidian surface with hairline tabs and preserved carousel`:
  - Assert `section#gallery` has computed background matching obsidian (`rgb(11, 10, 9)` / `--color-obsidian`).
  - Assert gallery filter tabs render with subtle hairlines (`border-[var(--hairline)]` / `border-[var(--hairline-gold)]`).
  - Assert long-media disclosure button (`[data-project-full-gallery] button`) renders with bronze outline styling.
  - Assert `[data-carousel-track]` or `[data-gallery-carousel]` is present and visible.
- [ ] **Step 3: Run Playwright to verify RED state**  
  Execute `pnpm exec playwright test --project=vr tests/e2e/project-detail-phase3-visual.spec.ts -g "P3-2"`.

---

#### Task 4: Implement Story & Gallery Visual Alignment
**Checkpoint:** P3-2  
**Files:**  
- Create: none  
- Modify: `app/components/ProjectStoryChapter.vue`, `app/pages/du-an/[slug].vue`  
- Test: `tests/e2e/project-detail-phase3-visual.spec.ts`  

**Interfaces:**  
- Consumes: Story props (`overview`, `challenge`, `solution`, `leadImage`), Gallery props (`filteredGallery`, `galleryTabs`)  
- Produces: Editorial light story chapter and dark obsidian gallery section  

- [ ] **Step 1: Refine `ProjectStoryChapter.vue`**  
  - Ensure container surface remains Light Editorial (`bg-white` or `bg-ink-50`).
  - Style eyebrow with `text-xs font-bold uppercase tracking-[0.16em] text-[var(--accent-light)]`.
  - Style main title with `text-section-title font-black uppercase text-[var(--fg-light)]`.
  - In `[data-story-beat="challenge"]`, strengthen visual hierarchy using `border-l-2 border-[var(--bronze)] pl-6 bg-ink-50/50 py-4 rounded-r-lg`.
  - Keep beat numbers in `text-[var(--accent-light)] font-mono text-xs`.
  - Maintain `figure` lead image framing with clean rounded edges and aspect ratio.
  - Zero modifications to copy text or data contracts.
- [ ] **Step 2: Refine Gallery Section in `app/pages/du-an/[slug].vue`**  
  - In `section#gallery`, change surface from `bg-ink-50` to `bg-[var(--color-obsidian)] text-[var(--color-ivory)]`.
  - Eyebrow: `text-[var(--bronze-light)] uppercase tracking-[0.16em] text-xs font-bold`.
  - Heading: `text-section-title font-black uppercase text-[var(--color-ivory)]`.
  - Gallery filter tabs:
    - Inactive: `border border-[var(--hairline)] bg-white/5 text-[var(--text-muted)] hover:border-[var(--bronze)] hover:text-[var(--color-ivory)]`.
    - Active: `border border-[var(--hairline-gold)] bg-[var(--bronze)] text-[var(--color-obsidian)] font-semibold`.
  - Disclosure button in `[data-project-full-gallery]`:
    `border border-[var(--bronze)] text-[var(--bronze-light)] hover:bg-[var(--bronze)] hover:text-[var(--color-obsidian)] rounded-full px-6 py-3 text-sm font-bold`.
  - Preserve `AppGalleryCarousel.vue` and `GalleryLightbox.vue` intact.
- [ ] **Step 3: Run Playwright to verify GREEN state**  
  Execute `pnpm exec playwright test --project=vr tests/e2e/project-detail-phase3-visual.spec.ts -g "P3-2"`.
- [ ] **Step 4: Run media density tests**  
  Execute `pnpm exec playwright test --project=vr tests/e2e/project-media-density.spec.ts`.
- [ ] **Step 5: Verify protected dirty files integrity**  
  Confirm SHA-256 hashes of all six protected files match preflight.
- [ ] **Step 6: P3-2 Checkpoint Commit & Push**  
  Stage `tests/e2e/project-detail-phase3-visual.spec.ts`, `app/components/ProjectStoryChapter.vue`, `app/pages/du-an/[slug].vue`.
  Commit: `feat(laihuy): align project story chapter and gallery with quiet luxury rhythm`.
  Push to `origin/feat/laihuy-redesign-phase-3`.
  **STOP for independent ChatGPT + user review.**

---

### Checkpoint P3-3: Delivery Proof + Material Story

#### Task 5: P3-3 Scope-Safety & Material Board Test Contract
**Checkpoint:** P3-3  
**Files:**  
- Create: none  
- Modify: `tests/e2e/project-detail-phase3-visual.spec.ts`  
- Test: `tests/e2e/project-detail-phase3-visual.spec.ts`  

**Interfaces:**  
- Consumes: Delivery Proof and Material Story DOM nodes  
- Produces: Playwright test assertions for scope-safety, timeline reflow, and material board styling  

- [ ] **Step 1: Write failing test for Delivery Proof surface and timeline reflow**  
  Add test `P3-3-DELIVERY-01: delivery proof renders on light surface with responsive timeline and scope cards`:
  - Assert `section#delivery` has light background (`bg-white` / `bg-ink-50`).
  - At 390px, assert `[data-delivery-timeline]` has 1 column.
  - At 768px and 1280px, assert `[data-delivery-timeline]` has 5 columns.
  - Assert scope chips render with `--rule-light` / `--fg-light` styling.
- [ ] **Step 2: Write failing test for Delivery Proof Scope-Safety Contract**  
  Add test `P3-3-DELIVERY-02: design-only project has zero manufacturing and installation execution proofs`:
  - Open `/du-an/khach-san-eo-gio` (rich project): assert `[data-execution-proof]` count is 3.
  - Open `/du-an/nha-vuon-chily` (design-only project): assert `[data-scope-key="Thiết kế"]` is visible and assert `[data-execution-proof]` count is strictly 0.
- [ ] **Step 3: Write failing test for Material Story elevated obsidian styling**  
  Add test `P3-3-MATERIAL-01: material story renders on elevated obsidian surface with tactile proof list and no fake swatches`:
  - Assert `section#materials` has dark surface (`--color-surface-dark` / `--color-obsidian`).
  - Assert highlight items have bronze numbers (`--bronze-light`).
  - Assert materials list items have bronze icons and clean typography (`--color-ivory`).
  - Assert no fake color gradient swatch boxes exist.
- [ ] **Step 4: Run Playwright to verify RED state**  
  Execute `pnpm exec playwright test --project=vr tests/e2e/project-detail-phase3-visual.spec.ts -g "P3-3"`.

---

#### Task 6: Implement Delivery Proof & Material Story Visual Alignment
**Checkpoint:** P3-3  
**Files:**  
- Create: none  
- Modify: `app/components/ProjectDeliveryProof.vue`, `app/components/ProjectMaterialStory.vue`  
- Test: `tests/e2e/project-detail-phase3-visual.spec.ts`  

**Interfaces:**  
- Consumes: Delivery props (`scopeItems`, `phases`, `executionProof`), Material props (`experience`, `highlights`, `materials`, `craftsmanship`, `quote`, `images`)  
- Produces: Architectural delivery sequence and tactile material board  

- [ ] **Step 1: Refine `ProjectDeliveryProof.vue`**  
  - Ensure surface is Light Editorial (`bg-white` / `bg-ink-50`) with `--fg-light` typography.
  - Scope list: wrap in crisp architectural border `border-y border-[var(--rule-light)]`, items separated by `border-r border-[var(--rule-light)]` with bronze icon accents (`text-[var(--accent-light)]`).
  - Delivery timeline: preserve scoped grid styling (`1fr` mobile, `repeat(var(--phase-count), 1fr)` md+). Number indicator in `text-[var(--accent-light)] font-mono text-xs`. Subtle hairline divider `border-t border-[var(--rule-light)] md:border-t-0 md:border-l`.
  - Execution proof cards: framed in light architectural card surface with top bronze accent rule `border-t-2 border-[var(--bronze)] pt-5`. Ensure design-only projects render 0 execution proof cards.
- [ ] **Step 2: Refine `ProjectMaterialStory.vue`**  
  - Section surface: Elevated Dark Obsidian (`bg-[var(--color-surface-dark)] text-[var(--color-ivory)]`).
  - Eyebrows: `text-[var(--bronze-light)] uppercase tracking-[0.16em] text-xs font-bold`.
  - Lead experience copy: `text-xl leading-9 text-[var(--text-muted)]`.
  - Proof in the details list: `divide-y divide-[var(--hairline)] border-y border-[var(--hairline)]`. Number in `text-[var(--bronze-light)] font-mono text-xs`. Text in `text-[var(--color-ivory)]`.
  - Material list: `divide-y divide-[var(--hairline)] border-y border-[var(--hairline)]`, icon in `text-[var(--bronze-light)]`, copy in `text-[var(--text-muted)]`.
  - Craftsmanship block: `border-t border-[var(--hairline)] pt-10`, secondary button `btn-secondary` linking to `/nha-xuong`.
  - Testimonial quote: `border-y border-[var(--hairline)] py-10`, bronze quote icon `text-[var(--bronze-light)]`, italic typography in `text-[var(--color-ivory)]`.
  - Media images: preserve real project photography framing without adding fake color swatches.
- [ ] **Step 3: Run Playwright to verify GREEN state**  
  Execute `pnpm exec playwright test --project=vr tests/e2e/project-detail-phase3-visual.spec.ts -g "P3-3"`.
- [ ] **Step 4: Run unit tests for view-model and content spine**  
  Execute `pnpm exec vitest run tests/project-detail-view-model.test.ts tests/project-content-spine.test.ts`.
- [ ] **Step 5: Verify protected dirty files integrity**  
  Confirm SHA-256 hashes of all six protected files match preflight.
- [ ] **Step 6: P3-3 Checkpoint Commit & Push**  
  Stage `tests/e2e/project-detail-phase3-visual.spec.ts`, `app/components/ProjectDeliveryProof.vue`, `app/components/ProjectMaterialStory.vue`.
  Commit: `feat(laihuy): align delivery proof and material story with quiet luxury design`.
  Push to `origin/feat/laihuy-redesign-phase-3`.
  **STOP for independent ChatGPT + user review.**

---

### Checkpoint P3-4: Related Work + Conversion Finale + Full Verification

#### Task 7: P3-4 Visual Test Contract
**Checkpoint:** P3-4  
**Files:**  
- Create: none  
- Modify: `tests/e2e/project-detail-phase3-visual.spec.ts`  
- Test: `tests/e2e/project-detail-phase3-visual.spec.ts`  

**Interfaces:**  
- Consumes: Related Work and Finale DOM nodes  
- Produces: Playwright test assertions for related project cards, B2B conversion bar, and absence of fake actions  

- [ ] **Step 1: Write failing test for Related Work light surface and cards**  
  Add test `P3-4-RELATED-01: related work renders on light surface with max 3 architectural cards`:
  - Assert `section[data-project-chapter="related"]` has light background (`bg-ink-50` / `bg-white`).
  - Assert related project cards count is <= 3.
  - Assert card hover respects `motion-reduce`.
- [ ] **Step 2: Write failing test for Conversion Finale dark surface and real actions only**  
  Add test `P3-4-FINALE-01: conversion finale renders on dark obsidian with gold primary CTA and no fake PDF buttons`:
  - Assert `section[data-project-chapter="finale"]` has dark background (`--color-obsidian` / `rgb(11, 10, 9)`).
  - Assert `/lien-he` link has solid gold button styling (`bg-[var(--bronze)] text-[var(--color-obsidian)]`).
  - Assert phone link exists with `tel:` protocol.
  - Assert strictly 0 PDF download buttons or links with `.pdf` exist in finale.
- [ ] **Step 3: Run Playwright to verify RED state**  
  Execute `pnpm exec playwright test --project=vr tests/e2e/project-detail-phase3-visual.spec.ts -g "P3-4"`.

---

#### Task 8: Implement Related Work & Conversion Finale Visual Alignment
**Checkpoint:** P3-4  
**Files:**  
- Create: none  
- Modify: `app/components/ProjectRelatedProjects.vue`, `app/components/ProjectConversionFinale.vue`, `app/pages/du-an/[slug].vue` (if wrapper styling needed)  
- Test: `tests/e2e/project-detail-phase3-visual.spec.ts`  

**Interfaces:**  
- Consumes: Related cards (`item`, `cover`), Finale props (`stats`, `phone`)  
- Produces: Refined architectural related work section and authoritative B2B conversion bar  

- [ ] **Step 1: Refine `ProjectRelatedProjects.vue`**  
  - Section surface: Light Editorial (`bg-ink-50`).
  - Eyebrow: `text-xs font-bold uppercase tracking-[0.16em] text-[var(--accent-light)]`.
  - Heading: `text-section-title font-black uppercase text-[var(--fg-light)]`.
  - Cards: `overflow-hidden rounded-2xl bg-white border border-[var(--rule-light)] hover:border-[var(--bronze)] transition-all`.
  - Cover image: aspect ratio `aspect-[4/3]` with `group-hover:scale-[1.02] motion-reduce:transform-none`.
  - Category: `text-xs font-bold uppercase tracking-[0.16em] text-[var(--accent-light)]`.
  - Title: `text-xl font-black text-[var(--fg-light)]`.
- [ ] **Step 2: Refine `ProjectConversionFinale.vue`**  
  - Section surface: Dark Obsidian (`bg-[var(--color-obsidian)] text-[var(--color-ivory)]`).
  - Factory stats rail: `border-b border-[var(--hairline)] pb-12`, icons in `text-[var(--bronze-light)]`, numbers in `text-[var(--color-ivory)] font-black text-xl`, labels in `text-[var(--text-subtle)] text-xs font-bold uppercase tracking-[0.14em]`.
  - Heading: `text-3xl md:text-5xl font-black uppercase leading-tight text-[var(--color-ivory)]`.
  - Description: `text-lg text-[var(--text-muted)]`.
  - Primary CTA (`/lien-he`): solid gold button styling `bg-[var(--bronze)] text-[var(--color-obsidian)] hover:bg-[var(--bronze-light)] font-bold rounded-full px-8 py-4`.
  - Telephone CTA: outline button `border border-[var(--hairline-gold)] text-[var(--bronze-light)] hover:border-[var(--bronze)] hover:text-[var(--color-ivory)] rounded-full px-8 py-4`.
  - Strictly no PDF download actions.
- [ ] **Step 3: Run Playwright to verify GREEN state**  
  Execute `pnpm exec playwright test --project=vr tests/e2e/project-detail-phase3-visual.spec.ts -g "P3-4"`.

---

#### Task 9: Full Verification Gate & Phase 3 Sign-Off
**Checkpoint:** P3-4  
**Files:**  
- Create: none  
- Modify: none  
- Test: Full test harness  

**Interfaces:**  
- Consumes: Entire application test suite  
- Produces: Final verification report for Phase 3  

- [ ] **Step 1: Run focused Phase 3 visual suite across all viewports**  
  Execute `pnpm exec playwright test --project=vr tests/e2e/project-detail-phase3-visual.spec.ts`. Must be 100% GREEN.
- [ ] **Step 2: Run unit and data-spine tests**  
  Execute `pnpm exec vitest run tests/project-content-spine.test.ts tests/project-detail-view-model.test.ts`. Must be 100% GREEN.
- [ ] **Step 3: Run full Vitest suite**  
  Execute `pnpm test`. Must be 100% GREEN.
- [ ] **Step 4: Run media density and media lint**  
  Execute `pnpm exec playwright test --project=vr tests/e2e/project-media-density.spec.ts`.
  Execute `pnpm lint:media`.
- [ ] **Step 5: Run layout and accessibility gates**  
  Execute `pnpm test:gates:a11y`.
  Execute `pnpm test:gates:layout`.
- [ ] **Step 6: Run ESLint**  
  Execute `pnpm lint`.
- [ ] **Step 7: Run TypeScript check**  
  Execute `pnpm typecheck`. Inspect output: if only pre-existing dirty `app/pages/tuyen-dung.vue` fails, record as KNOWN UNRELATED. Phase 3 files must have 0 type errors.
- [ ] **Step 8: Snapshot baseline diff check**  
  Verify `git status` shows no modified snapshot image files unless explicitly authorized.
- [ ] **Step 9: Verify protected dirty files integrity**  
  Confirm SHA-256 hashes of all six protected files match preflight.
- [ ] **Step 10: P3-4 Checkpoint Commit & Push**  
  Stage `tests/e2e/project-detail-phase3-visual.spec.ts`, `app/components/ProjectRelatedProjects.vue`, `app/components/ProjectConversionFinale.vue`, `app/pages/du-an/[slug].vue`.
  Commit: `feat(laihuy): complete phase 3 project detail quiet luxury redesign`.
  Push to `origin/feat/laihuy-redesign-phase-3`.
  **STOP for independent review and user acceptance.**
