# Phase 3 Design Specification — Project Detail: Quiet Luxury Architectural Case Study

## 1. Status & Authority

- **Phase Status**: Phase 1 (Design Tokens & Core Styling), Phase 2A (Homepage Hero + Metrics), Phase 2B (Project Showcase), and Phase 2C (Factory Trinity) are merged into `main`.
- **Phase 3 Status**: **DESIGN REVIEW CANDIDATE / IMPLEMENTATION NOT STARTED (P3-0A)**.
- **Integration Base SHA**: `67092ec79f77af0d4700cb2a07ff85399b41a1ec` (`origin/main`).
- **Target Branch**: `feat/laihuy-redesign-phase-3`.

### Authority Precedence Order
When requirements or documentation conflict, use this exact precedence order:
1. Direct, explicit user-approved Phase 3 decisions.
2. `AGENTS.md` (root operating guidelines).
3. `.agents/rules/laihuy-ux-ui.md` (LaiHuy UX/UI design constitution).
4. Current repository source code and committed test contracts.
5. This Phase 3 design specification (`docs/superpowers/specs/2026-09-16-laihuy-phase-3-project-detail-quiet-luxury-design.md`).
6. August 2026 Project Detail design spec (`docs/superpowers/specs/2026-08-15-project-detail-editorial-proof-spine-design.md`) for locked functional architecture and data contracts.
7. Interactive prototype View 03 (`docs/design/redesign-concept-showcase.html` View 03: Architectural Case Study) for visual art direction.
8. Historical audit material and superseded implementation plans.

> [!IMPORTANT]
> The unapproved draft document `docs/superpowers/plans/2026-09-08-project-dossier-master-plan.md` ("Project Dossier Master Plan") and the local dirty modifications in `tests/e2e/project-detail-editorial.spec.ts` are **NOT** authoritative design references. They represent an unapproved conceptual exploration and must not alter the approved Phase 3 functional contract.

---

## 2. Objective

Modernize the route `/du-an/[slug]` into the approved **Quiet Luxury / Architectural Editorial** visual design language, bringing it into visual and tonal harmony with the completed Homepage redesign (Phases 1, 2A, 2B, and 2C).

Phase 3 is strictly a **visual redesign and design-system alignment pass**.

It is explicitly **NOT**:
- A content rewrite or editorial copy overhaul.
- A data-model redesign or schema change.
- A route restructuring or URL migration.
- A gallery interaction or media-pipeline rewrite.
- A new B2B conversion funnel, upload form, or backend transport implementation.

---

## 3. Locked Functional Architecture

The functional architecture established in August 2026 (commit `cde8eea`) is proven, unit-tested, and fully retained:

### Chapter Sequence (The Editorial Proof Spine)
1. **Hero + Fact Rail** (`ProjectHeroFacts.vue`): Context, title, category, description, and verified specs rail.
2. **Story** (`ProjectStoryChapter.vue`): Overview → Challenge → Solution narrative sequence with lead transition imagery.
3. **Curated Gallery** (`section#gallery`): Curated inline presentation via `AppGalleryCarousel.vue` + `GalleryLightbox.vue`.
4. **Delivery Proof** (`ProjectDeliveryProof.vue`): Verified scope tags, timeline phases, and scope-safe execution proofs.
5. **Material Story** (`ProjectMaterialStory.vue`): Experience, Design Highlights, Materials, Craftsmanship, and optional client quote.
6. **Related Work** (`ProjectRelatedProjects.vue`): 3 ranked related projects by relevance and recency.
7. **Conversion Finale** (`ProjectConversionFinale.vue`): Verified company factory stats and direct contact CTA.

### Stable Subnav Contract
The sticky subnav `nav[data-project-subnav]` retains its 4 stable anchors:
- `#story`
- `#gallery`
- `#delivery`
- `#materials`

Anchors appear dynamically if and only if the corresponding chapter has content. Related projects and finale remain excluded from the sticky subnav.

### Retained Invariants
- `buildProjectDetailViewModel` in `app/utils/project-detail-view-model.ts` remains the authoritative pure derivation logic.
- Scope-safe execution proof logic is preserved: delivery timelines and execution proof cards remain rendered for verified projects; design-only projects never receive manufacturing or installation proofs.
- Real 404 behavior, SEO/JSON-LD metadata, and breadcrumb schemas remain intact.
- Media flows (`short` vs `long`), gallery category filtering tabs, and full-screen lightbox exploration remain intact.
- Full bilingual Vietnamese (default) and English parity remains intact across all chapters.

---

## 4. Visual Principles & Design Tokens

### Aesthetic Direction: High-End Architectural Editorial & Quiet Luxury
The visual treatment elevates `/du-an/[slug]` from an ordinary white-background presentation into a prestigious architectural case study monograph.

### Color & Surface Tokens (declared in `app/assets/css/main.css`)
- **Dark Obsidian Surfaces**: Deep Obsidian (`--color-obsidian: #0b0a09`), Elevated Dark Surface (`--color-surface-dark: #141210`), Card Surface (`--color-card-dark: #1a1815`).
- **Warm Bronze Accents**: Warm Bronze (`--color-bronze-warm: #b8875a`), Light Bronze (`--color-bronze-light: #d4a373`), Deep Bronze (`--color-bronze-dark: #8c6239`), semantic aliases `--bronze`, `--bronze-light`.
- **Text on Dark Surfaces**: Raw Silk Ivory typography (`--color-ivory: #f5f2eb`), Muted Text (`--text-muted`), Subtle Text (`--text-subtle`).
- **Light Editorial Surfaces & Foreground**: LIGHT / existing editorial light surface using the current `bg-white` / `bg-ink-50` surface system, paired with existing light foreground/rule tokens:
  - `--fg-light`
  - `--fg-light-muted`
  - `--fg-light-subtle`
  - `--rule-light`
  - `--accent-light`
  No new light-surface palette or token is introduced by Phase 3.
- **Hairlines**: Restrained translucent hairlines (`--hairline: rgb(255 255 255 / 0.08)`), Gold/Bronze hairlines (`--hairline-gold: rgb(184 135 90 / 0.25)`), and existing light rule hairlines (`--rule-light`).

### Explicit Editorial Pacing (Dark vs Light Rhythm)
Do **NOT** blanket-convert every section to dark mode. The page follows an explicit, intentional alternating editorial rhythm:

1. **Hero + Facts** — **DARK / Obsidian** (`--color-obsidian`) with floating architectural specs rail.
2. **Sticky Subnav** — **DARK / Obsidian** (e.g. `color-mix(in srgb, var(--color-obsidian) 92%, transparent)`) with hairline gold border and bronze active states.
3. **Story** — **LIGHT / existing editorial light surface** (`bg-white` / `bg-ink-50` with `--fg-light` typography and generous negative space).
4. **Gallery** — **DARK / Obsidian** (deep cinematic frame for high-resolution project photography with minimal chrome).
5. **Delivery Proof** — **LIGHT / existing editorial light surface** (`bg-white` / `bg-ink-50` with crisp architectural engineering feel and `--rule-light` / semantic hairlines).
6. **Material Story** — **DARK / elevated Obsidian** (`--color-surface-dark` / `--color-obsidian`, tactile material board depth).
7. **Related Work** — **LIGHT / existing editorial light surface** (`bg-white` / `bg-ink-50` with warm editorial preview cards, subordinate scale).
8. **Conversion Finale** — **DARK / Obsidian** (`--color-obsidian` with bronze B2B conversion bar).

### Pacing Rules
- Light chapters use the existing repository light surface system (`bg-white` / `bg-ink-50`) paired with existing light foreground tokens (`--fg-light`, `--fg-light-muted`, `--fg-light-subtle`). Light does **NOT** mean generic SaaS card walls.
- Dark chapters use the existing Quiet Luxury tokens (`--color-obsidian`, `--color-surface-dark`, `--color-card-dark`, `--color-ivory`, `--text-muted`, `--text-subtle`, `--bronze`, `--bronze-light`). Dark does **NOT** mean pure `#000`.
- Transitions between light and dark chapters must be intentional, deliberate, and seamless.
- Preserve Quiet Luxury continuity throughout both light and dark passages using bronze accents, typography (`font-display`, `Outfit`), and refined hairlines.
- No new CSS tokens are introduced.

### Strict Visual Anti-Patterns
- **No** repetitive card walls (`p-6 border rounded-2xl`).
- **No** neon gradients, multi-color text, or saturated badge pills.
- **No** heavy glassmorphism, aggressive frosted blurs, or deep muddy drop shadows.
- **No** decorative floating circles, bouncing keyframes, or distracting loop animations.
- **No** generic 3-column symmetrical SaaS card grids.

---

## 5. Chapter-by-Chapter Visual Specifications

### 5.1 Hero + Fact Rail (`ProjectHeroFacts.vue`)
- **Surface**: DARK / Obsidian (`--color-obsidian`).
- **Composition**: Retains composition of `AppHero` + integrated architectural specs rail.
- **Visual Target**:
  - Category rendered as a refined bronze kicker tag (`text-xs uppercase tracking-[0.16em] text-[var(--bronze-light)]`).
  - Project title in `Outfit` font-display with Raw Silk Ivory rendering (`text-[var(--color-ivory)]`).
  - Short description in muted ivory with comfortable leading (`text-[var(--text-muted)] leading-relaxed`).
  - **Floating Architectural Specs Rail**: Styled as an integrated specs bar (matching View 03 `.detail-specs-rail`) directly under the hero summary. Maximum 5 columns (area, year/completion, style, scope, location). Separated by vertical semantic hairlines (`border-[var(--hairline)]` / `border-[var(--hairline-gold)]`). No standalone floating white cards.
  - Component styling should use semantic tokens (e.g. `text-[var(--color-ivory)]`, `text-[var(--text-muted)]`, `border-[var(--hairline)]`).
- **Rule**: Do NOT modify `AppHero.vue` to contain project-specific branching; `ProjectHeroFacts.vue` wraps and composes it cleanly.

### 5.2 Project Subnav (`app/pages/du-an/[slug].vue`)
- **Surface**: DARK / Obsidian.
- **Composition**: Sticky navigation anchor bar below hero facts.
- **Visual Target**:
  - Obsidian surface (`background: color-mix(in srgb, var(--color-obsidian) 92%, transparent); backdrop-filter: blur(16px); border-bottom: 1px solid var(--hairline-gold)`).
  - Chip links in muted ivory (`text-[var(--text-muted)] text-sm font-medium`), transitioning to active state with subtle bronze pill backing (`bg-[var(--bronze)] text-[var(--color-obsidian)] font-semibold`) or bronze hairline underline.
  - Mobile: Smooth horizontal scrolling with zero viewport overflow.
- **Rule**: Zero scroll-jacking, zero forced smooth-scrolling that overrides user OS preferences.

### 5.3 Story Chapter (`ProjectStoryChapter.vue`)
- **Surface**: LIGHT / existing editorial light surface (`bg-white` / `bg-ink-50`).
- **Foreground**: Existing light tokens (`--fg-light`, `--fg-light-muted`, `--fg-light-subtle`).
- **Composition**: Overview, Challenge, and Solution rendered as one continuous editorial narrative.
- **Copy & Narrative Contract**:
  - Preserve the current localized UI labels and copy.
  - Restyle existing headings and eyebrows only; do **NOT** mandate replacement copy strings.
  - No project-detail copy rewrite in Phase 3.
  - Visual implementation must not introduce wording that implies manufacturing or construction for design-only projects.
- **Visual Target**:
  - Balanced asymmetric grid: narrative column accompanied by transition lead photography.
  - Generous negative space between beats.
  - Challenge section may receive stronger visual emphasis using existing text (e.g. refined typography weight, subtle left hairline framing via `--rule-light`, or distinct background tint via `bg-ink-50`).
  - Do **NOT** introduce a fabricated Story quote, callout pull-quote, or highlight-statement data contract. Current `ProjectStoryChapter` has no quote data contract; do not duplicate or rewrite story text into an invented quote. Optional testimonial remains only where current data already supports it in `ProjectMaterialStory`.

### 5.4 Curated Gallery (`section#gallery`)
- **Surface**: DARK / Obsidian.
- **Composition**: Curated inline presentation via `AppGalleryCarousel.vue` + `GalleryLightbox.vue`.
- **Copy Contract**:
  - Preserve current localized UI labels; do **NOT** mandate replacement strings.
  - Restyle existing headings/eyebrows only.
- **Visual Target**:
  - Clean obsidian gallery frame with minimal chrome framing high-resolution project photography.
  - Gallery filter tabs styled with subtle hairlines (`border-[var(--hairline)]` with bronze active highlight).
  - Preserves disclosure button (`+21` / `Xem toàn bộ hình ảnh` / `View all photos`) styled with luxury outline styling (`border border-[var(--bronze)] text-[var(--bronze-light)]`).
- **Rule**: Retain `AppGalleryCarousel.vue`. Do NOT attempt to reintroduce `AppGalleryEditorial.vue`. Do NOT change gallery interaction architecture in Phase 3.

### 5.5 Delivery Proof (`ProjectDeliveryProof.vue`)
- **Surface**: LIGHT / existing editorial light surface (`bg-white` / `bg-ink-50`).
- **Foreground & Rules**: Existing light tokens (`--fg-light`, `--fg-light-muted`, `--rule-light`, `--accent-light`).
- **Composition**: Verified scope list, timeline phases, and scope-safe execution proofs.
- **Copy & Scope Contract**:
  - Preserve current localized UI labels.
  - Delivery timeline and execution proof remain derived from scope.
  - Design-only projects render scope without manufacturing/craft proofs.
  - Visual implementation must not introduce wording that implies manufacturing or construction for design-only projects.
- **Visual Target**:
  - Scope list styled as crisp architectural specifications with bronze accents.
  - Delivery phases rendered along a horizontal timeline rail (vertical on mobile) connected with subtle `--rule-light` dividers.
  - Execution proof cards (`direct-factory`, `quality`, `craft`) framed in clean architectural surfaces with top hairline bronze accents (`border-t-2 border-[var(--bronze)]`).

### 5.6 Material Story (`ProjectMaterialStory.vue`)
- **Surface**: DARK / elevated Obsidian (`--color-surface-dark` / `--color-obsidian`).
- **Foreground**: Existing tokens on dark (`--color-ivory`, `--text-muted`, `--text-subtle`, `--bronze`, `--bronze-light`).
- **Composition**: Experience, Design Highlights, Materials, Craftsmanship, and optional testimonial.
- **Copy & Data Contract**:
  - Preserve current localized UI labels; do **NOT** mandate replacement strings.
  - Material items remain the existing verified text list.
  - Do **NOT** require new provenance/specification fields, origin kickers, or invented specification notes.
  - Optional testimonial remains only where current data already supports it in `ProjectMaterialStory`.
- **Visual Target**:
  - Tactile editorial material-board feeling matching View 03.
  - Phase 3 may improve: typography, spacing, numbering, semantic hairlines, image framing, and editorial hierarchy.
  - Use real project photography as tactile visual evidence.
- **Strict Constraint on Swatches**:
  - **Zero fabricated materials**: Do NOT invent brand names (e.g. do not invent An Cường if not in project record), technical specs, or unverified wood types.
  - Do NOT render fake color gradient boxes claiming to be specific real materials unless the project's actual photographs or verified data explicitly substantiate them. Neutral architectural frames using real project photography are preferred.

### 5.7 Related Work (`ProjectRelatedProjects.vue`)
- **Surface**: LIGHT / existing editorial light surface (`bg-white` / `bg-ink-50`).
- **Foreground**: Existing light tokens (`--fg-light`, `--fg-light-muted`).
- **Composition**: Up to 3 related project cards ranked by view-model.
- **Visual Target**:
  - Architectural case study preview cards on refined light surfaces.
  - Aspect-ratio locked project covers with gentle hover zoom (`scale-[1.02]`).
  - Subordinate scale so it does not distract from the primary case study or final CTA.
  - Clear hierarchy between image, metadata, and CTA.

### 5.8 Conversion Finale (`ProjectConversionFinale.vue`)
- **Surface**: DARK / Obsidian (`--color-obsidian`).
- **Composition**: Trust statistics and contact call-to-action.
- **Visual Target**:
  - High-authority B2B conversion bar matching View 03 (`.detail-cta-bar`).
  - Solid gold/bronze primary button (`.btn-solid-gold` style) for `/lien-he` and outline button for telephone consultation.
  - Company-level stats (workshop size, capacity, reach) clearly demarcated as company capabilities rather than project-specific claims.
- **Strict Constraint on Actions**:
  - **Zero fake PDF downloads**: The prototype showcase showed illustrative buttons for "Tải Hồ Sơ Bản Vẽ & BOQ Mẫu (PDF)". Because no real PDF asset or dynamic generation pipeline exists, **no PDF download buttons or fake download CTAs shall be added**. Real actions remain strictly `/lien-he` and telephone consultation.

---

## 6. Data, Copy & Scope Integrity

1. **No Data Modification in Phase 3**:
   - `app/data/projects.ts` is complete (all 11 narrative spines verified). It shall not be modified during Phase 3 visual redesign.
   - `Project` schema and view-model derivation rules remain unmodified.
2. **Truthfulness and Scope-Safety Contract**:
   - A project with scope `Thiết kế` must never be styled or captioned to suggest Lai Huy fabricated or installed the interior.
   - Facts must never be invented (no fabricated completion dates, budgets, client identities, room counts, or awards).
   - Visual implementation must not introduce wording that implies manufacturing or construction for design-only projects.

---

## 7. Protected Local Dirty Work & Test Strategy

### Protection of Local Dirty E2E Spec
- The file `tests/e2e/project-detail-editorial.spec.ts` in the local working directory contains modifications from the unapproved September 8 "Project Dossier" exploration.
- **Rule**: Phase 3 must preserve `tests/e2e/project-detail-editorial.spec.ts` byte-for-byte in its current local state. It must **NOT** be committed, staged, overwritten, or reverted during Phase 3.

### Phase 3 Visual Test Contract
- To validate Phase 3 visual and layout changes without interfering with the local dirty file, Phase 3 tests shall be authored in a dedicated, separate test file:
  **`tests/e2e/project-detail-phase3-visual.spec.ts`**
- This file will test the Quiet Luxury visual contract, dark and light theme surfaces, specs rail geometry, subnav sticky behavior, and responsive reflow across all 8 canonical viewports.

---

## 8. Responsive Contract

All Phase 3 implementations must be validated across the **8 canonical review viewports**:
1. **390 px** (Mobile Small)
2. **767 px** (Mobile Max)
3. **768 px** (Tablet Portrait)
4. **1023 px** (Tablet Max)
5. **1024 px** (Small Desktop / Tablet Landscape)
6. **1279 px** (Desktop Intermediate)
7. **1280 px** (Desktop Standard)
8. **1440 px** (Desktop Large)

### Responsive Rules
- Both **VI** and **EN** locales must be tested.
- **Zero horizontal scroll**: `document.documentElement.scrollWidth <= window.innerWidth`.
- **Hero specs rail**: Reflows from 2 columns on mobile, to 3 columns on tablet, to 4–5 columns on desktop.
- **Delivery timeline**: Stacks vertically on mobile with clean hairline dividers; expands to horizontal pipeline at `>= 768px`.
- **Subnav**: Horizontally scrollable without layout breakage on mobile.
- Representative test fixtures:
  - Rich project: `khach-san-eo-gio` (Full scope, long media).
  - Design-only project: `nha-vuon-chily` (Design-only scope, no execution proof).
  - Sparse project: `nha-xuong-anh-cuong` (Short media flow).

---

## 9. Accessibility & Motion Contract

1. **Accessibility Standards**:
   - WCAG 2.1 Level AA compliance across `/du-an/[slug]`.
   - Contrast ratio floor: Minimum 4.5:1 for body copy and 3:1 for large display text against dark obsidian surfaces (`--color-ivory` on `--color-obsidian` exceeds 14:1) and light surfaces (`--fg-light` on white exceeds 12:1, `--fg-light-muted` on white exceeds 7:1).
   - Fully accessible keyboard navigation and visible focus rings (`focus-visible:ring-2 ring-[var(--bronze)]`).
   - Semantic heading hierarchy: Single `h1` in hero, `h2` per chapter, `h3` for subsection beats.
   - Screen-reader labels on sequence indicators (`aria-hidden="true"` on numerical counters, meaningful text on buttons).
2. **Motion Standards**:
   - Strict `prefers-reduced-motion: reduce` compliance.
   - Cinematic, restrained motion (subtle hover zoom, smooth opacity reveals, no bounce or spring physics).

---

## 10. Checkpoints & Verification Framework

Phase 3 is structured into documentation gates and sequential implementation checkpoints:

### Documentation Gates
- **P3-0A (Current)**: Design Specification (`docs/superpowers/specs/2026-09-16-laihuy-phase-3-project-detail-quiet-luxury-design.md`).
  - **Gate**: Independent remote design review by ChatGPT + user approval.
- **P3-0B**: Implementation Plan (`docs/superpowers/plans/2026-09-16-laihuy-phase-3-project-detail-quiet-luxury.md`).
  - **Gate**: Review approval of the detailed execution plan before code editing begins.

### Implementation Checkpoints
- **P3-1: Hero + Facts + Sticky Subnav**
  - **Scope**: Upgrade `ProjectHeroFacts.vue` and the subnav in `app/pages/du-an/[slug].vue` to Quiet Luxury Obsidian, Raw Silk Ivory typography, and floating specs rail.
  - **Verification**: Dedicated Playwright tests in `tests/e2e/project-detail-phase3-visual.spec.ts` across 8 viewports.
- **P3-2: Story + Curated Gallery**
  - **Scope**: Modernize `ProjectStoryChapter.vue` on the existing editorial light surface (`bg-white` / `bg-ink-50`) and refine gallery chrome in `section#gallery` (Dark Obsidian) while preserving `AppGalleryCarousel.vue`.
  - **Verification**: Playwright visual and density tests.
- **P3-3: Delivery Proof + Material Story**
  - **Scope**: Modernize `ProjectDeliveryProof.vue` on the existing editorial light surface (`bg-white` / `bg-ink-50`) with hairline timeline and execution cards, and `ProjectMaterialStory.vue` on elevated Obsidian (tactile material board formatting, verified data only).
  - **Verification**: Playwright scope-safety and layout tests across rich and design-only projects.
- **P3-4: Related Work + Conversion Finale + Full Verification**
  - **Scope**: Modernize `ProjectRelatedProjects.vue` on the existing editorial light surface (`bg-white` / `bg-ink-50`) and `ProjectConversionFinale.vue` (Dark Obsidian B2B conversion bar, gold button, real contact actions only).
  - **Verification**: Complete test pass (`pnpm test`, `tests/project-content-spine.test.ts`, `tests/project-detail-view-model.test.ts`, `pnpm test:gates:a11y` 9/9, `pnpm test:gates:layout`, focused visual Playwright, media lint, and diff audit).
