# LaiHuy Homepage Phase 2C Factory Trinity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use
> superpowers:subagent-driven-development (recommended) or
> superpowers:executing-plans to implement this plan task-by-task.
> Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the homepage Factory Proof section into a concise, three-pillar "Craft & Precision Trinity" and remove the duplicate six-step `HomeProcessRail` from the homepage composition, lowering density while preserving all verified operational and machinery evidence.  
**Architecture:** Vue 3 / Nuxt 4 single-component architectural restructuring with typed data flow (`productionWorkflow` passed via props), semantic heading hierarchy (`h2` section lead, `h3` pillar titles), and a responsive Quiet Luxury editorial layout (`stacked` on mobile, `tablet` on 768–1023px, `3-column grid` on >=1024px).  
**Tech Stack:** Nuxt 4, Vue 3, TypeScript, Tailwind CSS v4, Playwright E2E, Vitest.  
**Spec:** [docs/superpowers/specs/2026-09-16-laihuy-homepage-phase-2c-factory-trinity-design.md](file:///d:/work/LaiHuy/laihuy-interior/docs/superpowers/specs/2026-09-16-laihuy-homepage-phase-2c-factory-trinity-design.md)  

---

## Global Constraints

1. **Safety & Working Tree Integrity**:
   - The local working tree contains pre-existing dirty/untracked files:
     - `AGENTS.md`
     - `app/pages/tuyen-dung.vue`
     - `docs/README.md`
     - `tests/e2e/project-detail-editorial.spec.ts`
     - `docs/ai-development-rules.md`
     - `docs/superpowers/plans/2026-09-08-project-dossier-master-plan.md`
   - Every task MUST preserve these files untouched.
   - NEVER use `git reset`, `git clean`, `git restore .`, `git checkout -- .`, `git stash`, `git add .`, or `git add -A`.
   - Stage ONLY explicitly named files per task.

2. **Locked Implementation Scope**:
   Modifications are authorized to **EXACTLY** these four files:
   - `app/components/HomeFactoryProof.vue`
   - `app/pages/index.vue`
   - `tests/e2e/homepage-material-story.spec.ts`
   - `tests/e2e/homepage-machinery-density.spec.ts`

   **Explicitly Forbidden to Modify or Delete**:
   - `app/components/HomeProcessRail.vue` (must remain untouched in the codebase)
   - `app/data/factory.ts` (canonical data remains untouched)
   - `app/data/home-page.ts` (homepage copy remains untouched)
   - `app/data/site-images.ts` (site images remain untouched)
   - `tests/homepage-machinery.test.ts` (unit test contract must continue passing unchanged)
   - `app/components/HomeHero.vue`, `app/components/HeroMetrics.vue`, `app/components/HomeProjectStage.vue`
   - Any external dependency in `package.json`

3. **Data Integrity & Copy Architecture**:
   - Do NOT invent promotional claims (forbidden: 0.2 mm precision, 15–20% savings, 24-hour guarantees, 24/7 support, 24-month warranties).
   - "Technical Preparation", "Direct Manufacturing", and "Quality & Delivery" are conceptual design labels, NOT literal hardcoded UI strings.
   - Do NOT introduce inline `t({ vi: "...", en: "..." })` translations for user-visible pillar titles in `HomeFactoryProof.vue`.
   - All rendered headings and evidence MUST reuse existing typed localized data passed via props.

4. **Locked Trinity Mapping**:
   - **Pillar 01 — Conceptual Group: Technical Preparation**:
     - Rendered title: `steps[1].title` ("Bóc tách kỹ thuật" / "Technical take-off").
     - Supporting evidence: `steps[0]` (Tiếp nhận bản vẽ & BOQ / Drawing & BOQ intake) and `steps[1]`.
   - **Pillar 02 — Conceptual Group: Direct Manufacturing**:
     - Rendered title: `content.titleLead + content.titleAccent` (Combined: "Hệ thống máy phục vụ sản xuất nội thất dự án" / "Machinery system for project interior manufacturing").
     - Supporting evidence: `capabilities[0]` (3,000 m² footprint), `capabilities[1]` (capacity up to 50 rooms/month), `content`, all four `groups` (`cutting-shaping`, `boring-connections`, `edge-finishing`, `surface-pressing`), all seven machine names, and real factory image (`image`).
   - **Pillar 03 — Conceptual Group: Quality & Delivery**:
     - Rendered title: `capabilities[2].label` ("Đội ngũ triển khai dự án" / "Project delivery team").
     - Supporting evidence: `capabilities[2].value` ("Sản xuất, thiết kế và thi công" / "Design, production & contracting"), `capabilities[2].description`, and complementary workflow steps `steps[2]` (Điều phối dự án), `steps[4]` (QC trước khi giao hàng), `steps[5]` (Thi công tại công trình).
     - `capabilities[3]` ("Markets") is intentionally omitted from the Trinity to maintain compact metrics.

5. **Locked Responsive Geometry Contract**:
   Retain all 8 canonical test viewports: `[390, 767, 768, 1023, 1024, 1279, 1280, 1440]`.
   - `390px / 767px`: Stacked layout (pillars stack vertically; single-column editorial composition; no horizontal overflow).
   - `768px / 1023px`: Tablet / pre-desktop layout (retains `1023px` critical upper tablet boundary immediately preceding desktop transition).
   - `1024px / 1279px / 1280px / 1440px`: Exactly three Trinity columns (`repeat(3, minmax(0, 1fr))`).
   - If implementation discovers a genuine technical obstacle to this breakpoint, it must STOP and request design approval rather than silently changing the breakpoint.

---

## Implementation Tasks

### Task 1: Red Contract — Factory Trinity E2E Test

**Primary File:** `tests/e2e/homepage-machinery-density.spec.ts`  
**Commit Target:** Part of `feat(laihuy): build homepage factory trinity` (combined with Task 2)

- [ ] **Step 1.1: Preflight inspection**
  Verify the current branch and working tree safety:
  ```bash
  git branch --show-current
  git status --porcelain=v1 -uall
  ```
  Ensure `feat/laihuy-redesign-phase-2c` is active and the 6 unrelated dirty files are unchanged.

- [ ] **Step 1.2: Update the E2E contract in `tests/e2e/homepage-machinery-density.spec.ts`**
  Replace the obsolete four-card geometry contract with the approved three-pillar Trinity contract:
  - Update `COPY` to include expected strings for the 3 pillars derived from authoritative production data:
    ```ts
    const COPY = {
      vi: {
        heading: 'Hệ thống máy phục vụ sản xuất nội thất dự án',
        description: 'Xưởng ứng dụng hệ thống máy đồng bộ theo bốn công đoạn chính, giúp kiểm soát độ chính xác, chất lượng bề mặt và tiến độ cho các dự án khách sạn, villa và căn hộ cao cấp.',
        pillars: [
          'Bóc tách kỹ thuật',
          'Hệ thống máy phục vụ sản xuất nội thất dự án',
          'Đội ngũ triển khai dự án'
        ],
        pillarEvidence: {
          pillar1: ['Tiếp nhận bản vẽ & BOQ', 'Bóc tách kỹ thuật'],
          pillar2: ['Cắt & tạo hình', 'Khoan & liên kết', 'Dán cạnh & hoàn thiện', 'Xử lý bề mặt & ép'],
          pillar3: ['Sản xuất, thiết kế và thi công', 'Điều phối dự án', 'QC trước khi giao hàng', 'Thi công tại công trình']
        },
        machines: [
          'CNC Nesting',
          'Cưa bàn trượt',
          'Máy khoan liên kết CNC',
          'Máy dán cạnh tự động',
          'Máy bào cuốn',
          'Máy chà nhám thùng',
          'Máy ép nguội thủy lực'
        ],
        imageAlt: 'Toàn cảnh hệ thống máy sản xuất tại xưởng Lai Huy',
        cta: 'Xem năng lực nhà xưởng'
      },
      en: {
        heading: 'Machinery system for project interior manufacturing',
        description: 'The workshop uses a coordinated machinery line across four core stages, controlling precision, surface quality, and schedule for hotel, villa, and premium apartment projects.',
        pillars: [
          'Technical take-off',
          'Machinery system for project interior manufacturing',
          'Project delivery team'
        ],
        pillarEvidence: {
          pillar1: ['Drawing & BOQ intake', 'Technical take-off'],
          pillar2: ['Cutting & shaping', 'Boring & connections', 'Edge banding & finishing', 'Surface treatment & pressing'],
          pillar3: ['Design, production & contracting', 'Project coordination', 'Pre-delivery QC', 'On-site installation']
        },
        machines: [
          'CNC nesting router',
          'Sliding table saw',
          'CNC boring machine',
          'Automatic edge bander',
          'Thickness planer',
          'Wide-belt sander',
          'Hydraulic cold press'
        ],
        imageAlt: 'Overview of the machinery line inside the Lai Huy workshop',
        cta: 'View factory capability'
      }
    } as const
    ```
  - Keep `WIDTHS = [390, 767, 768, 1023, 1024, 1279, 1280, 1440] as const`.
  - Update `MACHINERY-CONTENT` test:
    - Assert `section.getByTestId('homepage-machinery-pillar')` has count `3`.
    - Assert pillar titles match `copy.pillars` (rendered as `h3`).
    - Assert all seven machines in `copy.machines` are present in Pillar 02.
    - Assert technical preparation evidence (`copy.pillarEvidence.pillar1`) is present.
    - Assert quality/delivery evidence (`copy.pillarEvidence.pillar3`) is present.
    - Assert factory image exists with localized `copy.imageAlt` and valid source.
    - Assert `/nha-xuong` CTA exists and is keyboard focusable.
    - Assert `[data-machinery-sequence]` elements have count `3` and `aria-hidden="true"`.
  - Update `MACHINERY-LAYOUT` test:
    - Query `pillars: Array.from(element.querySelectorAll<HTMLElement>('[data-testid="homepage-machinery-pillar"]'))`.
    - Assert `geometry.pillars` has length `3`.
    - At `width < 768` (390px, 767px):
      - Pillars stack vertically: `geometry.pillars[1].top > geometry.pillars[0].bottom` and `geometry.pillars[2].top > geometry.pillars[1].bottom`.
    - At `768 <= width < 1024` (768px, 1023px):
      - Verify tablet geometry (stacked or 2+1; columns are not forced into 3 cramped columns; no horizontal overflow).
    - At `width >= 1024` (1024px, 1279px, 1280px, 1440px):
      - Verify 3 columns: `Math.abs(geometry.pillars[0].top - geometry.pillars[1].top) <= 2` and `Math.abs(geometry.pillars[1].top - geometry.pillars[2].top) <= 2`.
      - Left positions strictly ascending: `pillars[0].left < pillars[1].left < pillars[2].left`.
    - In all widths: `geometry.documentWidth <= geometry.viewportWidth` (no horizontal overflow).

- [ ] **Step 1.2: Run TDD Red check**
  Execute the test suite and confirm it fails because the component has not yet been updated:
  ```bash
  pnpm exec playwright test --project=vr tests/e2e/homepage-machinery-density.spec.ts
  ```
  Expected failure: `locator('[data-testid="homepage-machinery-pillar"]').toHaveCount(3)` fails with count 0 (still renders 4 `homepage-machinery-card`s).

---

### Task 2: Implement HomeFactoryProof Trinity

**Primary File:** `app/components/HomeFactoryProof.vue`  
**Test File:** `tests/e2e/homepage-machinery-density.spec.ts`  
**Commit Target:** `feat(laihuy): build homepage factory trinity` (Task 1 + Task 2)

- [ ] **Step 2.1: Preflight inspection**
  ```bash
  git status --porcelain=v1 -uall
  ```
  Confirm no unintended files have changed.

- [ ] **Step 2.2: Implement `HomeFactoryProof.vue`**
  Update `HomeFactoryProof.vue` with the following architectural structure:
  - **Script**:
    ```vue
    <script setup lang="ts">
    import { homePageContent } from '~/data/home-page'
    import type { Capability, MachineryProcessGroup, MachinerySectionContent, ProductionStep } from '~/data/factory'
    import type { MediaImage } from '~/shared/media/types'

    const props = defineProps<{
      capabilities: readonly Capability[]
      groups: readonly MachineryProcessGroup[]
      content: MachinerySectionContent
      image: MediaImage
      steps: readonly ProductionStep[]
    }>()

    const { t } = useLanguage()
    const sequence = (index: number) => String(index + 1).padStart(2, '0')

    const pillar1Title = computed(() => (props.steps?.[1] ? t(props.steps[1].title) : ''))
    const pillar2TitleLead = computed(() => t(props.content.titleLead))
    const pillar2TitleAccent = computed(() => t(props.content.titleAccent))
    const pillar3Title = computed(() => (props.capabilities?.[2] ? t(props.capabilities[2].label) : ''))

    const metricFootprint = computed(() => props.capabilities?.[0])
    const metricCapacity = computed(() => props.capabilities?.[1])
    const capabilityDelivery = computed(() => props.capabilities?.[2])
    </script>
    ```
  - **Template Architecture**:
    ```vue
    <template>
      <section
        data-testid="homepage-machinery"
        class="home-factory bg-[var(--color-obsidian)] text-[var(--color-ivory)]"
      >
        <div class="shell">
          <!-- Section Intro -->
          <div class="home-factory__intro">
            <div>
              <p
                v-reveal
                class="eyebrow reveal"
              >
                {{ t(homePageContent.factory.eyebrow) }}
              </p>
              <h2
                v-reveal="80"
                class="home-factory__title reveal mt-4 font-display"
              >
                {{ t(homePageContent.factory.title) }}
              </h2>
            </div>
            <p
              v-reveal="140"
              class="reveal max-w-2xl text-base leading-7 text-[var(--text-muted)]"
            >
              {{ t(homePageContent.factory.description) }}
            </p>
          </div>

          <!-- Proof Metrics Rail (Workshop footprint & capacity) -->
          <dl class="home-factory__metrics mt-12 grid grid-cols-1 gap-6 border-y border-[var(--hairline)] py-6 sm:grid-cols-2">
            <div
              v-if="metricFootprint"
              class="home-factory__metric"
            >
              <dt class="text-xs uppercase tracking-[0.16em] text-[var(--bronze)]">
                {{ t(metricFootprint.label) }}
              </dt>
              <dd class="mt-2 text-2xl font-medium tracking-tight text-[var(--color-ivory)] md:text-3xl">
                {{ t(metricFootprint.value) }}
              </dd>
              <p class="mt-1 text-sm text-[var(--text-muted)]">
                {{ t(metricFootprint.description) }}
              </p>
            </div>
            <div
              v-if="metricCapacity"
              class="home-factory__metric sm:border-l sm:border-[var(--hairline)] sm:pl-6"
            >
              <dt class="text-xs uppercase tracking-[0.16em] text-[var(--bronze)]">
                {{ t(metricCapacity.label) }}
              </dt>
              <dd class="mt-2 text-2xl font-medium tracking-tight text-[var(--color-ivory)] md:text-3xl">
                {{ t(metricCapacity.value) }}
              </dd>
              <p class="mt-1 text-sm text-[var(--text-muted)]">
                {{ t(metricCapacity.description) }}
              </p>
            </div>
          </dl>

          <!-- Factory Real Visual Evidence -->
          <div
            data-testid="homepage-machinery-image"
            class="home-factory__image-container mt-12 overflow-hidden rounded-sm border border-[var(--hairline)] bg-[var(--color-surface-dark)]"
          >
            <div class="relative aspect-[16/9] w-full md:aspect-[21/9]">
              <MediaImage
                :image="image"
                sizes="sm:100vw md:100vw lg:100vw xl:1280px"
                class="absolute inset-0 h-full w-full"
                img-class="object-cover object-center w-full h-full transition-transform duration-1000 ease-out hover:scale-[1.02]"
              />
              <div
                data-testid="homepage-machinery-caption"
                aria-hidden="true"
                class="absolute inset-x-0 bottom-0 flex flex-wrap justify-between gap-4 bg-gradient-to-t from-[rgba(11,10,9,0.9)] via-[rgba(11,10,9,0.6)] to-transparent px-6 py-4 text-xs uppercase tracking-[0.14em] text-[var(--color-ivory)]"
              >
                <span>{{ t(content.photoCaption) }}</span>
                <span class="text-[var(--bronze-light)]">{{ t(content.lineCaption) }}</span>
              </div>
            </div>
          </div>

          <!-- Craft & Precision Trinity -->
          <div
            data-testid="homepage-machinery-trinity"
            class="home-factory__trinity mt-16 grid grid-cols-1 gap-12 lg:grid-cols-3 lg:gap-8 lg:divide-x lg:divide-[var(--hairline)]"
          >
            <!-- Pillar 01: Technical Preparation -->
            <article
              data-testid="homepage-machinery-pillar"
              class="home-factory__pillar flex flex-col lg:pr-6"
            >
              <span
                data-machinery-sequence
                aria-hidden="true"
                class="text-xs font-semibold tracking-[0.2em] text-[var(--bronze)]"
              >01</span>
              <h3
                data-testid="homepage-machinery-pillar-title"
                class="mt-4 font-display text-xl font-medium tracking-tight text-[var(--color-ivory)] md:text-2xl"
              >
                {{ pillar1Title }}
              </h3>
              <p
                v-if="steps?.[1]"
                class="mt-3 text-sm leading-relaxed text-[var(--text-muted)]"
              >
                {{ t(steps[1].description) }}
              </p>

              <!-- Evidence: Step 1 Intake -->
              <div
                v-if="steps?.[0]"
                class="mt-6 border-t border-[var(--hairline)] pt-4"
              >
                <h4 class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-ivory)]">
                  {{ t(steps[0].title) }}
                </h4>
                <p class="mt-1 text-xs leading-normal text-[var(--text-muted)]">
                  {{ t(steps[0].description) }}
                </p>
              </div>
            </article>

            <!-- Pillar 02: Direct Manufacturing -->
            <article
              data-testid="homepage-machinery-pillar"
              class="home-factory__pillar flex flex-col lg:px-6"
            >
              <span
                data-machinery-sequence
                aria-hidden="true"
                class="text-xs font-semibold tracking-[0.2em] text-[var(--bronze)]"
              >02</span>
              <h3
                data-testid="homepage-machinery-pillar-title"
                class="mt-4 font-display text-xl font-medium tracking-tight text-[var(--color-ivory)] md:text-2xl"
              >
                {{ pillar2TitleLead }} <span class="text-[var(--bronze)]">{{ pillar2TitleAccent }}</span>
              </h3>
              <p
                data-testid="homepage-machinery-description"
                class="mt-3 text-sm leading-relaxed text-[var(--text-muted)]"
              >
                {{ t(content.description) }}
              </p>

              <!-- Evidence: 4 Groups & 7 Machines -->
              <div class="mt-6 space-y-4 border-t border-[var(--hairline)] pt-4">
                <div
                  v-for="group in groups"
                  :key="group.id"
                  class="text-xs"
                >
                  <h4 class="font-semibold text-[var(--color-ivory)]">
                    {{ t(group.title) }}
                  </h4>
                  <p class="mt-1 text-[var(--text-muted)]">
                    {{ t(group.benefit) }}
                  </p>
                  <p class="mt-1 text-[0.7rem] text-[var(--bronze-light)]">
                    <template
                      v-for="(machine, mIdx) in group.machines"
                      :key="t(machine)"
                    >
                      <span>{{ t(machine) }}</span><span
                        v-if="mIdx < group.machines.length - 1"
                        aria-hidden="true"
                      > · </span>
                    </template>
                  </p>
                </div>
              </div>
            </article>

            <!-- Pillar 03: Quality & Delivery -->
            <article
              data-testid="homepage-machinery-pillar"
              class="home-factory__pillar flex flex-col lg:pl-6"
            >
              <span
                data-machinery-sequence
                aria-hidden="true"
                class="text-xs font-semibold tracking-[0.2em] text-[var(--bronze)]"
              >03</span>
              <h3
                data-testid="homepage-machinery-pillar-title"
                class="mt-4 font-display text-xl font-medium tracking-tight text-[var(--color-ivory)] md:text-2xl"
              >
                {{ pillar3Title }}
              </h3>
              <div
                v-if="capabilityDelivery"
                class="mt-3"
              >
                <p class="text-sm font-medium text-[var(--bronze-light)]">
                  {{ t(capabilityDelivery.value) }}
                </p>
                <p class="mt-1 text-sm leading-relaxed text-[var(--text-muted)]">
                  {{ t(capabilityDelivery.description) }}
                </p>
              </div>

              <!-- Evidence: Steps 3, 5, 6 -->
              <div class="mt-6 space-y-4 border-t border-[var(--hairline)] pt-4">
                <div
                  v-if="steps?.[2]"
                  class="text-xs"
                >
                  <h4 class="font-semibold text-[var(--color-ivory)]">
                    {{ t(steps[2].title) }}
                  </h4>
                  <p class="mt-1 text-[var(--text-muted)]">
                    {{ t(steps[2].description) }}
                  </p>
                </div>
                <div
                  v-if="steps?.[4]"
                  class="text-xs"
                >
                  <h4 class="font-semibold text-[var(--color-ivory)]">
                    {{ t(steps[4].title) }}
                  </h4>
                  <p class="mt-1 text-[var(--text-muted)]">
                    {{ t(steps[4].description) }}
                  </p>
                </div>
                <div
                  v-if="steps?.[5]"
                  class="text-xs"
                >
                  <h4 class="font-semibold text-[var(--color-ivory)]">
                    {{ t(steps[5].title) }}
                  </h4>
                  <p class="mt-1 text-[var(--text-muted)]">
                    {{ t(steps[5].description) }}
                  </p>
                </div>
              </div>
            </article>
          </div>

          <!-- Section CTA -->
          <div class="mt-12 flex justify-start lg:justify-end">
            <NuxtLink
              data-testid="homepage-machinery-cta"
              to="/nha-xuong"
              class="btn-outline border-[var(--hairline)] text-[var(--color-ivory)] hover:border-[var(--bronze)] hover:text-[var(--bronze)] focus-visible:outline-2 focus-visible:outline-[var(--bronze)]"
            >
              {{ t(homePageContent.cta.secondaryCta) }}
            </NuxtLink>
          </div>
        </div>
      </section>
    </template>
    ```
  - **Scoped CSS**:
    ```vue
    <style scoped>
    .home-factory {
      padding-block: var(--section-py);
    }
    .home-factory__intro {
      display: grid;
      gap: 2rem;
    }
    .home-factory__title {
      max-width: 55rem;
      font-size: clamp(2.4rem, 5vw, 5.5rem);
      font-weight: 500;
      line-height: 0.98;
      letter-spacing: -0.06em;
    }
    @media (min-width: 1024px) {
      .home-factory__intro {
        grid-template-columns: minmax(0, 1.15fr) minmax(20rem, 0.85fr);
        align-items: end;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .home-factory * {
        transition-duration: 0.01ms !important;
        animation-duration: 0.01ms !important;
      }
    }
    </style>
    ```

- [ ] **Step 2.3: Run TDD Green check**
  Execute the focused machinery test suite:
  ```bash
  pnpm exec playwright test --project=vr tests/e2e/homepage-machinery-density.spec.ts
  ```
  Verify all tests across all eight viewports (`390`, `767`, `768`, `1023`, `1024`, `1279`, `1280`, `1440`) pass cleanly.

- [ ] **Step 2.4: Stage and commit Task 1 + Task 2**
  ```bash
  git status --short
  git add app/components/HomeFactoryProof.vue tests/e2e/homepage-machinery-density.spec.ts
  git diff --cached --name-only
  git commit -m "feat(laihuy): build homepage factory trinity"
  ```
  Verify that the commit contains ONLY these two files and that all unrelated dirty files remain untouched.

---

### Task 3: Homepage Composition & Contract

**Primary Files:**
- `tests/e2e/homepage-material-story.spec.ts`
- `app/pages/index.vue`  
**Commit Target:** `refactor(laihuy): remove duplicate homepage process rail`

- [ ] **Step 3.1: Preflight inspection**
  ```bash
  git status --porcelain=v1 -uall
  ```
  Ensure only the 6 unrelated files are present in the working tree.

- [ ] **Step 3.2: Update composition contract in `tests/e2e/homepage-material-story.spec.ts` (TDD Red)**
  In `tests/e2e/homepage-material-story.spec.ts`:
  - Locate lines 77–78:
    ```ts
    await expect(page.getByTestId('homepage-machinery').getByTestId('homepage-machinery-card')).toHaveCount(4)
    await expect(page.getByTestId('home-process').getByTestId('home-process-step')).toHaveCount(6)
    ```
  - Update to assert 3 Trinity pillars and 0 `[data-testid="home-process"]` sections:
    ```ts
    await expect(page.getByTestId('homepage-machinery').getByTestId('homepage-machinery-pillar')).toHaveCount(3)
    await expect(page.locator('[data-testid="home-process"]')).toHaveCount(0)
    ```
  - Keep all other assertions (Hero, Material Story, Capabilities, 3 Project cards, CTA, locale tests, responsive tests) completely intact.

- [ ] **Step 3.3: Run TDD Red check**
  ```bash
  pnpm exec playwright test --project=vr tests/e2e/homepage-material-story.spec.ts
  ```
  Expected failure: `page.locator('[data-testid="home-process"]')` fails because `app/pages/index.vue` still renders `HomeProcessRail` (count is 1, expected 0).

- [ ] **Step 3.4: Update `app/pages/index.vue` (TDD Green)**
  In `app/pages/index.vue`:
  - Pass `:steps="productionWorkflow"` to `HomeFactoryProof`:
    ```vue
    <HomeFactoryProof
      :capabilities="factoryCapabilities"
      :groups="machineryProcessGroups"
      :content="machinerySectionContent"
      :image="siteImages.machineryOverview"
      :steps="productionWorkflow"
    />
    ```
  - Remove `<HomeProcessRail :steps="productionWorkflow" />` from the template.
  - Retain `import { ..., productionWorkflow } from '~/data/factory'` on line 7 because `HomeFactoryProof` now consumes `productionWorkflow`.
  - Do NOT modify or delete `app/components/HomeProcessRail.vue`.

- [ ] **Step 3.5: Run TDD Green check**
  Rerun the test to confirm success:
  ```bash
  pnpm exec playwright test --project=vr tests/e2e/homepage-material-story.spec.ts
  ```
  Verify all assertions pass cleanly.

- [ ] **Step 3.6: Stage and commit Task 3**
  ```bash
  git status --short
  git add app/pages/index.vue tests/e2e/homepage-material-story.spec.ts
  git diff --cached --name-only
  git commit -m "refactor(laihuy): remove duplicate homepage process rail"
  ```
  Verify that the commit contains ONLY these two files and that all unrelated dirty files remain untouched.

---

### Task 4: Cross-Check & Final Verification

**Primary Files:** None (Verification only)  
**Goal:** Verify entire test suite, gates, accessibility, and spec acceptance criteria without introducing new feature scope.

- [ ] **Step 4.1: Preflight inspection**
  ```bash
  git status --porcelain=v1 -uall
  ```
  Confirm clean status relative to the 6 preserved files.

- [ ] **Step 4.2: Run full unit test suite**
  ```bash
  pnpm test
  ```
  Specifically confirm `tests/homepage-machinery.test.ts` passes, verifying that canonical factory data is intact.

- [ ] **Step 4.3: Run typecheck and linters**
  ```bash
  pnpm typecheck
  pnpm lint
  pnpm lint:media
  ```
  Ensure 0 errors and 0 warnings on modified files.

- [ ] **Step 4.4: Run accessibility & layout gate checks**
  ```bash
  pnpm test:gates:a11y
  pnpm test:gates:layout
  ```
  Ensure all accessibility and layout gates pass cleanly.

- [ ] **Step 4.5: Run focused E2E test suites together**
  ```bash
  pnpm exec playwright test --project=vr tests/e2e/homepage-material-story.spec.ts tests/e2e/homepage-machinery-density.spec.ts
  ```
  Confirm 100% passing across all viewports and locales.

- [ ] **Step 4.6: Audit against Spec Acceptance Criteria**
  Verify each criterion from Section 17 of the approved spec:
  1. [x] Homepage no longer renders `HomeProcessRail`.
  2. [x] `HomeProcessRail.vue` remains untouched in the repository.
  3. [x] Factory Proof is presented as exactly three architectural evidence pillars.
  4. [x] All four machinery groups remain represented.
  5. [x] All seven existing machines remain represented.
  6. [x] Existing technical, workflow, and project delivery team evidence (`capabilities[2]`) is preserved without new hardcoded UI strings or data changes.
  7. [x] No unsupported prototype claims enter production.
  8. [x] Homepage density is materially reduced.
  9. [x] Vietnamese and English locales remain fully functional.
  10. [x] Responsive layout is intentional across all eight canonical viewport boundaries (`390, 767, 768, 1023, 1024, 1279, 1280, 1440`).
  11. [x] No horizontal overflow at any supported viewport.
  12. [x] Existing project and homepage sections outside Phase 2C are unchanged.
  13. [x] Tests reflect the new approved contract rather than the superseded old composition.
  14. [x] Independent remote code review occurs before merge.

- [ ] **Step 4.7: Inspect git diff from main base**
  ```bash
  git diff 431fa47252eceddb0793b3daee7874dec37fff7a...HEAD --stat
  ```
  Verify that ONLY the approved files (`HomeFactoryProof.vue`, `index.vue`, `homepage-material-story.spec.ts`, `homepage-machinery-density.spec.ts`, and the spec/plan docs) have been touched.
