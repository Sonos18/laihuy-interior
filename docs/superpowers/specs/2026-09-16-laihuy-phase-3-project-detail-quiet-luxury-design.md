# Phase 3 Design Specification — Project Detail: Quiet Luxury Architectural Case Study

## 1. Status & Authority

- **Phase Status**: Phase 1 (Foundation & Hero), Phase 2A (Navigation & Footer), Phase 2B (Project Showcase), and Phase 2C (Factory Trinity) are merged into `main`.
- **Phase 3 Status**: **DESIGN APPROVED / IMPLEMENTATION NOT STARTED (P3-0A)**.
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

Modernize the route `/du-an/[slug]` into the approved **Quiet Luxury / Architectural Editorial** visual design language, bringing it into visual and tonal harmony with the completed Homepage redesign (Phases 1, 2B, and 2C).

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

### Color Tokens (declared in `app/assets/css/main.css`)
- **Dark Obsidian Surfaces**: Deep Obsidian (`--color-obsidian: #0b0a09`), Elevated Dark Surface (`--color-surface-dark: #141210`), Card Surface (`--color-card-dark: #1a1815`).
- **Warm Bronze Accents**: Warm Bronze (`--color-bronze-warm: #b8875a`), Light Bronze (`--color-bronze-light: #d4a373`), Deep Bronze (`--color-bronze-dark: #8c6239`).
- **Raw Silk Typography**: Raw Silk Ivory (`--color-ivory: #f5f2eb`), Muted Ivory (`rgba(245, 242, 235, 0.65)`), Subtle Text (`rgba(245, 242, 235, 0.4)`).
- **Hairlines**: Restrained translucent hairlines (`--hairline: rgba(255, 255, 255, 0.08)`), Gold/Bronze hairlines (`--hairline-gold: rgba(184, 135, 90, 0.25)`).

### Editorial Pacing (Dark vs Light Rhythm)
Do **NOT** blanket-convert every section to pure black `#000`. In alignment with View 03 of the redesign showcase:
- **Hero & Masthead**: Deep Obsidian (`#0b0a09`) with floating architectural specs rail.
- **Sticky Subnav**: Dark Obsidian backdrop (`rgba(11, 10, 9, 0.92)`) with hairline gold border and refined bronze active states.
- **Story & Delivery Chapters**: Dark elevated surface (`#141210` / `#0b0a09`) creating architectural intimacy for engineering and problem-solving narrative.
- **Gallery Chapter**: Deep surface framing high-resolution project photography with minimal UI chrome.
- **Material Story**: Tactile editorial layout with subtle hairline framing.
- **Related Projects & Finale**: Dark Obsidian with warm bronze lighting accents.

### Strict Visual Anti-Patterns
- **No** repetitive `p-6 border rounded-2xl` card walls.
- **No** neon gradients, multi-color text, or saturated badge pills.
- **No** heavy glassmorphism, aggressive frosted blurs, or deep muddy drop shadows.
- **No** decorative floating circles, bouncing keyframes, or distracting loop animations.
- **No** generic 3-column symmetrical SaaS card grids.

---

## 5. Chapter-by-Chapter Visual Specifications

### 5.1 Hero + Fact Rail (`ProjectHeroFacts.vue`)
- **Composition**: Retains composition of `AppHero` + integrated architectural specs rail.
- **Visual Target**:
  - Category rendered as a refined bronze kicker tag (`text-xs uppercase tracking-[0.16em] text-[var(--bronze-light)]`).
  - Project title in `Outfit` font-display with Raw Silk Ivory rendering.
  - Short description in muted ivory with comfortable leading (`leading-relaxed`).
  - **Floating Architectural Specs Rail**: Styled as an integrated specs bar (matching View 03 `.detail-specs-rail`) directly under the hero summary. Maximum 5 columns (area, year/completion, style, scope, location). Separated by vertical semantic hairlines (`border-[var(--hairline)]` / `border-[var(--hairline-gold)]`). No standalone floating white cards.
- **Rule**: Do NOT modify `AppHero.vue` to contain project-specific branching; `ProjectHeroFacts.vue` wraps and composes it cleanly.

### 5.2 Project Subnav (`app/pages/du-an/[slug].vue`)
- **Composition**: Sticky navigation anchor bar below hero facts.
- **Visual Target**:
  - Obsidian surface (`background: rgba(11, 10, 9, 0.92); backdrop-filter: blur(16px); border-bottom: 1px solid var(--hairline-gold)`).
  - Chip links in muted ivory (`text-sm font-medium`), transitioning to active state with subtle bronze pill backing (`bg-[var(--bronze)] text-[#0b0a09] font-semibold`) or bronze hairline underline.
  - Mobile: Smooth horizontal scrolling with zero viewport overflow.
- **Rule**: Zero scroll-jacking, zero forced smooth-scrolling that overrides user OS preferences.

### 5.3 Story Chapter (`ProjectStoryChapter.vue`)
- **Composition**: Overview, Challenge, and Solution rendered as one continuous editorial narrative.
- **Visual Target**:
  - Balanced asymmetric grid: narrative column accompanied by transition lead photography.
  - Section eyebrow: `CÂU CHUYỆN THI CÔNG & GIẢI PHÁP / CASE STORY & SOLUTIONS` in bronze.
  - Architectural quote styling: When a project quote or highlighted statement is rendered, style with a vertical bronze hairline quote border (`border-l-2 border-[var(--bronze)] pl-5 italic text-[var(--color-ivory)]`).
  - Generous negative space between beats.

### 5.4 Curated Gallery (`section#gallery`)
- **Composition**: Curated inline presentation via `AppGalleryCarousel.vue` + `GalleryLightbox.vue`.
- **Visual Target**:
  - Clean obsidian gallery frame with restrained editorial heading (`BỘ SƯU TẬP KHÔNG GIAN THỰC TẾ / SPATIAL GALLERY`).
  - Gallery filter tabs styled with subtle hairlines (`border-[var(--hairline)]` with bronze active highlight).
  - Preserves disclosure button (`+21` / `Xem toàn bộ hình ảnh`) styled with luxury outline styling (`border border-[var(--bronze)] text-[var(--bronze-light)]`).
- **Rule**: Retain `AppGalleryCarousel.vue`. Do NOT attempt to reintroduce `AppGalleryEditorial.vue`.

### 5.5 Delivery Proof (`ProjectDeliveryProof.vue`)
- **Composition**: Verified scope list, timeline phases, and scope-safe execution proofs.
- **Visual Target**:
  - Scope list styled as crisp architectural specifications with bronze checkmarks or dots.
  - Delivery phases rendered along a horizontal timeline rail (vertical on mobile) connected with subtle `--hairline` dividers.
  - Execution proof cards (`direct-factory`, `quality`, `craft`) framed in dark card surfaces (`--color-surface-dark`) with top hairline bronze accents (`border-t-2 border-[var(--bronze)]`).
- **Rule**: Delivery timeline and execution proof remain derived from scope. Design-only projects render scope without manufacturing/craft proofs.

### 5.6 Material Story (`ProjectMaterialStory.vue`)
- **Composition**: Experience, Design Highlights, Materials, Craftsmanship, and optional testimonial.
- **Visual Target**:
  - Tactile Material Board atmosphere matching View 03 (`BẢNG VẬT LIỆU CHẾ TÁC / MATERIAL BOARD`).
  - Material items formatted as editorial architectural swatches: crisp title, provenance/origin kicker in bronze, and concise specification notes.
- **Strict Constraint on Swatches**:
  - **Zero fabricated materials**: Do NOT invent brand names (e.g. do not invent An Cường if not in project record), technical specs, or unverified wood types.
  - Do NOT render fake color gradient boxes claiming to be specific real materials unless the project's actual photographs or verified data explicitly substantiate them. Neutral architectural frames using project photography are preferred.

### 5.7 Related Work (`ProjectRelatedProjects.vue`)
- **Composition**: Up to 3 related project cards ranked by view-model.
- **Visual Target**:
  - Architectural case study preview cards on elevated dark surfaces.
  - Aspect-ratio locked project covers with gentle hover zoom (`scale-[1.02]`).
  - Subordinate scale so it does not distract from the primary case study or final CTA.

### 5.8 Conversion Finale (`ProjectConversionFinale.vue`)
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
   - A project with scope `Thiết kế` must never be styled to suggest Lai Huy fabricated or installed the interior.
   - Facts must never be invented (no fabricated completion dates, budgets, client identities, room counts, or awards).

---

## 7. Protected Local Dirty Work & Test Strategy

### Protection of Local Dirty E2E Spec
- The file `tests/e2e/project-detail-editorial.spec.ts` in the local working directory contains modifications from the unapproved September 8 "Project Dossier" exploration.
- **Rule**: Phase 3 must preserve `tests/e2e/project-detail-editorial.spec.ts` byte-for-byte in its current local state. It must **NOT** be committed, staged, overwritten, or reverted during Phase 3.

### Phase 3 Visual Test Contract
- To validate Phase 3 visual and layout changes without interfering with the local dirty file, Phase 3 tests shall be authored in a dedicated, separate test file:
  **`tests/e2e/project-detail-phase3-visual.spec.ts`**
- This file will test the Quiet Luxury visual contract, dark theme classes, specs rail geometry, subnav sticky behavior, and responsive reflow across all 8 canonical viewports.

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
   - Contrast ratio floor: Minimum 4.5:1 for body copy and 3:1 for large display text against dark obsidian surfaces (`--color-ivory` on `--color-obsidian` exceeds 14:1).
   - Fully accessible keyboard navigation and visible focus rings (`focus-visible:ring-2 ring-[var(--bronze)]`).
   - Semantic heading hierarchy: Single `h1` in hero, `h2` per chapter, `h3` for subsection beats.
   - Screen-reader labels on sequence indicators (`aria-hidden="true"` on numerical counters, meaningful text on buttons).
2. **Motion Standards**:
   - Strict `prefers-reduced-motion: reduce` compliance.
   - Cinematic, restrained motion (subtle hover zoom, smooth opacity reveals, no bounce or spring physics).

---

## 10. Sequential Implementation Checkpoints

Phase 3 shall be implemented across **4 sequential, independently verifiable checkpoints**:

### Checkpoint P3-0A (Current): Design Specification
- **Deliverable**: This design spec committed on `feat/laihuy-redesign-phase-3`.
- **Gate**: User and independent remote review approval.

### Checkpoint P3-0B: Implementation Plan
- **Deliverable**: `docs/superpowers/plans/2026-09-16-laihuy-phase-3-project-detail-quiet-luxury.md`.
- **Gate**: Review approval before code editing begins.

### Checkpoint P3-1: Masthead, Facts Rail & Sticky Subnav
- **Scope**: Upgrade `ProjectHeroFacts.vue` and the subnav in `app/pages/du-an/[slug].vue` to Quiet Luxury Obsidian, Raw Silk Ivory typography, and floating specs rail.
- **Verification**: Dedicated Playwright tests in `tests/e2e/project-detail-phase3-visual.spec.ts` across 8 viewports.

### Checkpoint P3-2: Story & Curated Gallery Alignment
- **Scope**: Modernize `ProjectStoryChapter.vue` with asymmetric layout and architectural quote styling. Refine gallery chrome in `section#gallery` while preserving `AppGalleryCarousel.vue`.
- **Verification**: Playwright visual and density tests.

### Checkpoint P3-3: Delivery Proof & Material Board Alignment
- **Scope**: Modernize `ProjectDeliveryProof.vue` (hairline timeline, execution cards) and `ProjectMaterialStory.vue` (tactile material board formatting, verified data only).
- **Verification**: Playwright scope-safety and layout tests across rich and design-only projects.

### Checkpoint P3-4: Related Work, B2B Finale & Full Verification Gate
- **Scope**: Modernize `ProjectRelatedProjects.vue` and `ProjectConversionFinale.vue` (B2B conversion bar, gold button, real contact actions only).
- **Verification**: Complete test pass (`pnpm test`, `tests/project-content-spine.test.ts`, `tests/project-detail-view-model.test.ts`, `pnpm test:gates:a11y` 9/9, `pnpm test:gates:layout`, focused visual Playwright, media lint, and diff audit).
