# LaiHuy Homepage Redesign — Phase 2C Factory Trinity Design

## 1. Status

- Phase 1: MERGED
- Phase 2A: MERGED
- Phase 2B: MERGED
- Phase 2C: DESIGN APPROVED, IMPLEMENTATION NOT STARTED

Branch:
`feat/laihuy-redesign-phase-2c`

Base:
`431fa47252eceddb0793b3daee7874dec37fff7a`

## 2. Objective

Phase 2C has two connected goals:

1. Redesign the homepage Factory Proof into a concise, high-end architectural evidence section based on the approved "Craft & Precision Trinity" direction.
2. Remove the duplicated six-step `HomeProcessRail` from the homepage composition while preserving the `HomeProcessRail.vue` component file in the repository.

The goal is **lower homepage density** without losing verified operational evidence.

## 3. Approved Decision

Approved option:

**Option A — Remove HomeProcessRail from homepage composition only.**

`HomeProcessRail.vue`:
- Remains in the repository.
- Is NOT deleted.
- Is NOT modified in Phase 2C.
- May remain reusable elsewhere in the application (e.g. detailed about/process pages).

The homepage stops rendering `HomeProcessRail`.

## 4. Current Problem

Current homepage sequence:

1. `HomeHero`
2. `HomeMaterialStory`
3. `HomeCapabilities`
4. `HomeProjectStage`
5. `HomeFactoryProof`
6. `HomeProcessRail`
7. `HomeProjectCta`

Current Factory Proof already contains:
- 4 capability facts
- Real factory imagery
- 4 grouped machinery stages
- Workshop CTA

Immediately afterwards, `HomeProcessRail` renders six operational steps (`productionWorkflow`):
1. Tiếp nhận bản vẽ & BOQ / Drawing & BOQ intake
2. Bóc tách kỹ thuật / Technical take-off
3. Điều phối dự án / Project coordination
4. Sản xuất tại xưởng / In-house production
5. QC trước khi giao hàng / Pre-delivery QC
6. Thi công tại công trình / On-site installation

This creates overlapping factory/process evidence and excessive homepage density. The approved redesign prototype (`docs/design/redesign-concept-showcase.html` View 4) explicitly identifies this repeated six-step process as a homepage density bottleneck.

## 5. Target Homepage Composition

New homepage sequence:

1. `HomeHero`
2. `HomeMaterialStory`
3. `HomeCapabilities`
4. `HomeProjectStage`
5. `HomeFactoryProof`
6. `HomeProjectCta`

`app/pages/index.vue` will continue importing `productionWorkflow` because the data is passed into `HomeFactoryProof`.

`HomeFactoryProof.vue` receives an additional prop:
```ts
steps: readonly ProductionStep[]
```

`index.vue` passes:
```html
<HomeFactoryProof
  :capabilities="factoryCapabilities"
  :groups="machineryProcessGroups"
  :content="machinerySectionContent"
  :image="siteImages.machineryOverview"
  :steps="productionWorkflow"
/>
```

`HomeProcessRail` is no longer rendered on the homepage.

## 6. Data Integrity

Production data remains authoritative.

Phase 2C must NOT copy unsupported illustrative claims from the prototype.

Forbidden unless already present in verified production data:
- 0.2 mm precision claims
- 15–20% cost savings
- 24-hour guarantees
- 24/7 support claims
- 24-month warranty claims
- Any invented machine performance numbers
- Any invented QC guarantees

Use only existing verified data from:
- `factoryCapabilities`
- `machinerySectionContent`
- `machineryProcessGroups`
- `productionWorkflow`
- Existing real factory `MediaImage` (`siteImages.machineryOverview`)

Do not modify `app/data/factory.ts` for this phase.

## 7. Factory Proof Information Architecture

Target section hierarchy:

```
Factory Proof (HomeFactoryProof)
├── Intro Header
│   ├── Eyebrow (homePageContent.factory.eyebrow)
│   ├── Section H2 (homePageContent.factory.title)
│   └── Description (homePageContent.factory.description)
│
├── Proof Metrics Rail
│   ├── Workshop Footprint (3.000 m² / 3,000 m²)
│   └── Production Capacity (Lên đến 50 phòng khách sạn/tháng / Up to 50 hotel rooms/month)
│
├── Real Factory Visual Evidence
│   ├── Real Workshop Photograph (siteImages.machineryOverview)
│   └── Real Workshop Caption (content.photoCaption & content.lineCaption)
│
├── Craft & Precision Trinity (3 Architectural Columns)
│   ├── Pillar 01: Technical Preparation (Design label; rendered title: steps[1].title)
│   ├── Pillar 02: Direct Manufacturing (Design label; rendered title: content.titleLead + content.titleAccent)
│   └── Pillar 03: Quality & Delivery (Design label; rendered title: capabilities[2].label)
│
└── Workshop CTA (/nha-xuong)
```

Do NOT preserve four equal machinery cards as the final homepage layout. The four machinery groups remain data/evidence inside the Manufacturing pillar.

## 8. Pillar Mapping & Copy Architecture

### Pillar Copy Architecture Rule
The names "Technical Preparation", "Direct Manufacturing", and "Quality & Delivery" are **conceptual design labels** defining architectural grouping and editorial hierarchy, NOT literal hardcoded UI strings.

Per `AGENTS.md`, all UI and business copy must reside in typed `app/data` sources. Because Phase 2C explicitly does NOT modify `app/data/factory.ts` or `app/data/home-page.ts`, `HomeFactoryProof.vue` must NOT introduce inline:
```ts
t({ vi: "...", en: "..." })
```
for new user-visible pillar titles or labels.

Instead, all rendered pillar headings and supporting evidence strictly reuse existing localized properties passed via props (`content`, `capabilities`, `steps`, `groups`).

### Pillar 01 — Conceptual Group: Technical Preparation

**Purpose:**
Show that manufacturing begins with controlled technical preparation, not only workshop machinery.

**Rendered Heading Source:**
`steps[1].title` ("Bóc tách kỹ thuật" / "Technical take-off")

**Supporting Evidence & Workflow Steps:**
Existing `productionWorkflow` steps 1 and 2:
- Step 1: Tiếp nhận bản vẽ & BOQ (`steps[0]` — title & description)
- Step 2: Bóc tách kỹ thuật (`steps[1]` — description)

No invented claims.

### Pillar 02 — Conceptual Group: Direct Manufacturing

**Purpose:**
Demonstrate real production capacity and coordinated machinery.

**Rendered Heading Source:**
`content.titleLead + content.titleAccent`
(Preserves the existing localized machinery heading exactly from `machinerySectionContent`:
- `content.titleLead`: VI: "Hệ thống máy phục vụ sản xuất" / EN: "Machinery system for"
- `content.titleAccent`: VI: "nội thất dự án" / EN: "project interior manufacturing"
Combined rendered heading: "Hệ thống máy phục vụ sản xuất nội thất dự án" / "Machinery system for project interior manufacturing")

**Supporting Evidence:**
- Verified 3,000 m² factory footprint evidence (`capabilities[0]`)
- Verified production capacity (`capabilities[1]`)
- `machinerySectionContent` (`content`)
- All four `machineryProcessGroups` (`groups`):
  1. Cắt & tạo hình (`cutting-shaping`)
  2. Khoan & liên kết (`boring-connections`)
  3. Dán cạnh & hoàn thiện (`edge-finishing`)
  4. Xử lý bề mặt & ép (`surface-pressing`)
- All seven currently recorded machines:
  - CNC Nesting
  - Cưa bàn trượt
  - Máy khoan liên kết CNC
  - Máy dán cạnh tự động
  - Máy bào cuốn
  - Máy chà nhám thùng
  - Máy ép nguội thủy lực
- Real factory image (`image`: `siteImages.machineryOverview`)

The UI may condense/group machine evidence into an elegant editorial summary, but must not silently remove the underlying production evidence from the homepage content.

### Pillar 03 — Conceptual Group: Quality & Delivery

**Purpose:**
Connect production to controlled delivery, project team coordination, and on-site execution.

**Rendered Heading Source:**
`capabilities[2].label` (VI: "Đội ngũ triển khai dự án" / EN: "Project delivery team")

**Supporting Evidence & Capabilities:**
- Existing `capabilities[2]` from `factoryCapabilities` (quoted exactly from source):
  - Label (`capabilities[2].label`):
    - VI: "Đội ngũ triển khai dự án"
    - EN: "Project delivery team"
  - Value / Subtitle (`capabilities[2].value`):
    - VI: "Sản xuất, thiết kế và thi công"
    - EN: "Design, production & contracting"
  - Description (`capabilities[2].description`):
    - VI: "Phối hợp xuyên suốt từ bóc tách bản vẽ, sản xuất, kiểm soát chất lượng đến thi công thực tế tại công trình."
    - EN: "End-to-end coordination from drawing take-off and production through quality control to on-site installation."
- Existing complementary `productionWorkflow` steps:
  - Step 3: Điều phối dự án (`steps[2]` — title & description)
  - Step 5: QC trước khi giao hàng (`steps[4]` — title & description)
  - Step 6: Thi công tại công trình (`steps[5]` — title & description)

Do not invent warranty or support promises.
Do not require `capabilities[3]` ("Markets") to appear in the Trinity; the compact metrics rail intentionally prioritizes the two strong quantitative metrics (`capabilities[0]` footprint and `capabilities[1]` capacity).

## 9. Visual Direction

Follow:
- `docs/design/redesign-concept-showcase.html` View 4 (Factory & Scale / Craft Trinity)
- `.agents/rules/laihuy-ux-ui.md`

Direction:
**High-End Architectural Editorial + Quiet Luxury**

Palette and Tokens:
- Background: Deep Obsidian (`var(--color-obsidian)`) and Dark Surface (`var(--color-surface-dark)`)
- Text: Raw Silk Ivory (`var(--color-ivory)`)
- Subdued/Muted Text: `var(--text-muted)` (~7.0:1 contrast on dark surface)
- Accents: Warm Bronze (`var(--bronze)`, `var(--bronze-light)`)
- Hairlines: `var(--hairline)` (`rgba(255, 255, 255, 0.08)`), `var(--hairline-gold)` (`rgba(184, 135, 90, 0.25)`)
- Typography: Outfit (`font-display`) and Syne per workspace typography roles
- Real factory photography with generous negative space
- Architectural evidence hierarchy

Do NOT use:
- Generic white SaaS cards
- Three large rounded boxes with heavy shadows
- Heavy glassmorphism / blurry white backdrops
- Neon or saturated accent colors
- Gradient text
- Dense badge collections

The three pillars should read as architectural evidence columns, primarily separated by spacing, subtle hairlines, and aligned rhythm rather than heavy card shells.

## 10. Responsive Design

The responsive design contract covers all eight canonical viewport widths: `[390, 767, 768, 1023, 1024, 1279, 1280, 1440]`.

### 390px / 767px (Mobile / Stacked)

**Order:**
1. Intro header (Eyebrow, H2, description)
2. Proof metrics rail (single column or compact grid)
3. Real factory image
4. Pillar 01: Technical Preparation
5. Pillar 02: Direct Manufacturing
6. Pillar 03: Quality & Delivery
7. Workshop CTA link (`/nha-xuong`)

**Requirements:**
- Single-column editorial composition
- No horizontal overflow
- Readable machine/evidence lists with proper line height
- Minimum comfortable touch target (>= 44px) for interactive elements
- No desktop layout mechanically forced onto mobile

### 768px / 1023px (Tablet / Pre-Desktop)

- Proof metrics may use a two-column grid.
- Factory image remains broad.
- Trinity layout should be chosen based on real Vietnamese and English text fit.
- Do NOT force 3 columns if typography becomes cramped. Stacked or 2+1 tablet editorial layout is acceptable and preferred over poor readability.
- Verify immediately around the 767px / 768px boundary.
- **1023px boundary**: Must remain covered and verified as the critical upper tablet boundary immediately before the >=1024px desktop Trinity transition.

### 1024px / 1279px / 1280px / 1440px (Desktop / Wide Trinity)

- Full three-column Trinity grid (`grid-template-columns: repeat(3, minmax(0, 1fr))`).
- Columns share an intentional top alignment and vertical rhythm.
- Restrained vertical separators / bronze hairlines.
- Factory image remains visually significant and well-scaled.
- No boxed SaaS-card appearance.
- **1279px / 1280px boundaries**: Verify transitions where wide breakpoint styling applies.
- **~1440px**: Content remains bounded by existing shell / 80rem measure, generous architectural margins and negative space, total homepage density visibly lower than the old FactoryProof + HomeProcessRail composition.

## 11. Accessibility

Maintain or improve:
- One clear section `<h2>` for Factory Proof.
- Semantic heading hierarchy inside the three pillars (`<h3>` for pillar titles).
- Meaningful factory image alt text matching the localized production source of truth (`siteImages.machineryOverview.alt`, passed via `image.alt`). The E2E test `COPY.imageAlt` value merely mirrors this production source of truth.
- Decorative sequence numbers (`01`, `02`, `03`) marked `aria-hidden="true"`.
- Keyboard-focusable `/nha-xuong` CTA with visible `:focus-visible` ring.
- Sufficient contrast for small metadata (using `var(--text-muted)` >= 4.5:1 WCAG AA).
- Motion respects `prefers-reduced-motion: reduce`.
- No essential information revealed only on hover.

*Note: Automated axe results alone are not sufficient proof of text contrast; contrast must be explicitly verified.*

## 12. Application Scope

Approved application source files:
- `app/components/HomeFactoryProof.vue`
- `app/pages/index.vue`

`HomeFactoryProof.vue` prop interface:
```ts
defineProps<{
  capabilities: readonly Capability[]
  groups: readonly MachineryProcessGroup[]
  content: MachinerySectionContent
  image: MediaImage
  steps: readonly ProductionStep[]
}>()
```

`index.vue`:
- Passes `:steps="productionWorkflow"` to `HomeFactoryProof`.
- Removes `<HomeProcessRail :steps="productionWorkflow" />` from the homepage template.

Do NOT modify or delete:
- `app/components/HomeProcessRail.vue` (must remain untouched in the codebase)
- `app/data/factory.ts`
- `app/data/home-page.ts`
- `HomeHero.vue`
- `HeroMetrics.vue`
- `HomeProjectStage.vue`
- Project/detail pages
- Any routing or API files

No new npm dependencies.

## 13. Test Scope

The previous test contracts encode the old homepage structure and therefore must intentionally change.

Authorized test files:
- `tests/e2e/homepage-material-story.spec.ts`
- `tests/e2e/homepage-machinery-density.spec.ts`

Do NOT weaken unrelated assertions.

### `homepage-material-story.spec.ts`

Update the homepage composition contract so it verifies:
- Home Hero remains present.
- Material Story remains present.
- Capabilities remain present.
- 3 project cards remain present.
- Factory Proof contains exactly 3 Trinity pillars (`[data-testid="homepage-machinery-pillar"]` or equivalent).
- Homepage contains NO rendered home-process section:
  ```ts
  await expect(page.locator('[data-testid="home-process"]')).toHaveCount(0)
  ```
- `HomeProjectCta` remains present and correct.
- Bilingual Vietnamese/English checks remain.
- Existing responsive Material Story tests remain intact.
- Existing project alignment tests remain intact.

The absence assertion confirms that the removal of `HomeProcessRail` from the homepage is intentional and verified.

### `homepage-machinery-density.spec.ts`

Replace the old "4 visual machinery cards" geometry contract with the new Factory Trinity contract.

The updated test must still prove:
- Vietnamese and English content rendering.
- Real factory image exists with correct `src` and descriptive `alt` verified against the production source of truth (`siteImages.machineryOverview.alt`, mirrored by E2E `COPY.imageAlt`).
- Factory CTA points to `/nha-xuong`.
- Exactly 3 Trinity pillars rendered.
- All four machinery process groups remain represented.
- All seven machine names remain represented.
- Technical-preparation evidence is represented (from `productionWorkflow` steps 1 & 2).
- Project delivery team proof and QC/delivery evidence are represented (from `capabilities[2]` and `productionWorkflow` steps 3, 5, 6).
- No horizontal overflow across all test viewports.

Responsive contract:
The test must retain coverage for all eight existing viewport widths: `[390, 767, 768, 1023, 1024, 1279, 1280, 1440]`.

The approved Phase 2C contract is:
- `390px` / `767px`: Stacked layout. Pillars stack vertically. Single-column editorial composition, no horizontal overflow.
- `768px` / `1023px`: Tablet / pre-desktop layout. Verify tablet mode intentionally; do not require 3 columns if content fit demands stacking. `1023px` must remain covered and verified as the critical boundary immediately preceding desktop transition.
- `1024px` / `1279px` / `1280px` / `1440px`: Three-column Trinity layout. Verify desktop Trinity geometry (3 columns at >=1024px; verify 1279/1280 transition and 1440 measure).

If implementation discovers a genuine reason this cannot work, it must STOP and request design approval rather than silently changing the breakpoint.

### `tests/homepage-machinery.test.ts`

**Do NOT change.**

This unit test continues proving the canonical factory data in `app/data/factory.ts` still contains:
- Four machinery groups
- Seven machine names
- Complete bilingual machinery content

This ensures canonical business data remains intact while the presentation evolves.

## 14. Files Expected To Change During Implementation

Exactly four files:

1. `app/components/HomeFactoryProof.vue`
2. `app/pages/index.vue`
3. `tests/e2e/homepage-material-story.spec.ts`
4. `tests/e2e/homepage-machinery-density.spec.ts`

If another source file becomes genuinely necessary during implementation, STOP and request explicit scope approval.

## 15. Non-Goals

Phase 2C does NOT:
- Redesign `/nha-xuong` (Workshop page).
- Redesign `HomeProjectCta`.
- Change factory canonical data in `app/data/factory.ts`.
- Delete or modify `HomeProcessRail.vue`.
- Modify `productionWorkflow` data.
- Add unsupported promotional claims.
- Add external dependencies.
- Modify project pages or detail dossiers.
- Begin Phase 3.
- Fix unrelated `tuyen-dung.vue` work.

## 16. Verification Requirements For Later Implementation

At implementation time, run proportionate verification:

```bash
pnpm lint
pnpm lint:media
pnpm test
pnpm typecheck
pnpm test:gates:a11y
pnpm test:gates:layout

# Focused E2E verification:
pnpm exec playwright test --project=vr tests/e2e/homepage-material-story.spec.ts
pnpm exec playwright test --project=vr tests/e2e/homepage-machinery-density.spec.ts
```

- Inspect typography and heading wrapping on the homepage.
- Do NOT update visual snapshots/baselines merely to make failures disappear.
- Known unrelated local careers/tuyen-dung work must remain separate and uncommitted.

## 17. Acceptance Criteria

Phase 2C will be acceptable only when:

1. Homepage no longer renders `HomeProcessRail`.
2. `HomeProcessRail.vue` remains untouched in the repository.
3. Factory Proof is presented as exactly three architectural evidence pillars.
4. All four machinery groups remain represented.
5. All seven existing machines remain represented.
6. Existing technical, workflow, and project delivery team evidence (`capabilities[2]`) is preserved through the Trinity without requiring new hardcoded UI strings or data file changes.
7. No unsupported prototype claims enter production.
8. Homepage density is materially reduced.
9. Vietnamese and English locales remain fully functional.
10. Responsive layout is intentional across all eight canonical viewport boundaries (`390, 767, 768, 1023, 1024, 1279, 1280, 1440`).
11. No horizontal overflow at any supported viewport.
12. Existing project and homepage sections outside Phase 2C are unchanged.
13. Tests reflect the new approved contract rather than the superseded old composition.
14. Independent remote code review occurs before merge.
