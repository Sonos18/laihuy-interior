# Homepage Material Transformation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an editorial, motion-led homepage that converts technical drawings into material, workshop, and completed-space proof while preserving the current Nuxt data and media contracts.

**Architecture:** Keep `index.vue` as a route composer and move each homepage movement into a focused component. A small requestAnimationFrame composable drives one CSS progress value; all content and final-state media remain present without JavaScript.

**Tech Stack:** Nuxt 4.3.1, Vue 3.5.28, TypeScript 5.9.3, Tailwind CSS 4.1.18, Vitest 4.1.9, Playwright 1.61.1.

## Global Constraints

- Use pnpm 10.29.3 and the existing dependency graph; add no animation package.
- Use current generated media catalog assets and typed bilingual data only.
- Preserve `.hero-image`, shared header/footer, locale, SEO, and contact-form behavior.
- At widths below `768px`, render four normal-flow story frames without sticky pinning.
- Honor `prefers-reduced-motion: reduce` with static content and no long pinned scene.
- Do not update Playwright snapshots or commit without explicit approval.

---

### Task 1: Lock the homepage narrative and scroll-progress contract

**Files:**
- Create: `tests/homepage-story.test.ts`
- Create: `app/data/home-page.ts`
- Create: `app/utils/scroll-progress.ts`
- Create: `app/composables/useScrollProgress.ts`

**Interfaces:**
- Produces: `homePageContent`, `homeStoryStages`, `homeCapabilities`, pure `calculateScrollProgress`, and `useScrollProgress(target)` returning readonly `progress`, `isEnhanced`, and `prefersReducedMotion` refs.

- [ ] **Step 1: Write failing unit tests**

Test that both locales provide four ordered story stages and three capability promises, and that progress calculation clamps values before, within, and after the scroll range.

- [ ] **Step 2: Run the focused unit test and observe the missing-module failure**

Run: `pnpm exec vitest run tests/homepage-story.test.ts`

- [ ] **Step 3: Add minimal typed data and a pure `calculateScrollProgress` helper**

Use literal stage ids `drawing`, `material`, `factory`, `space` and capability ids `technical`, `manufacturing`, `fitout`. Clamp progress with `Math.min(1, Math.max(0, travelled / range))` and return `1` when the usable range is zero.

- [ ] **Step 4: Add the browser lifecycle wrapper**

On mount, create the media query, attach passive scroll and resize listeners, schedule one animation frame, and clean up listeners/frame on unmount. Reduced motion leaves progress at `1`.

- [ ] **Step 5: Run the focused test green**

Run: `pnpm exec vitest run tests/homepage-story.test.ts`

---

### Task 2: Build semantic homepage movements

**Files:**
- Create: `app/components/HomeHero.vue`
- Create: `app/components/HomeMaterialStory.vue`
- Create: `app/components/HomeCapabilities.vue`
- Create: `app/components/HomeProjectStage.vue`
- Create: `app/components/HomeFactoryProof.vue`
- Create: `app/components/HomeProcessRail.vue`
- Create: `app/components/HomeProjectCta.vue`
- Modify: `app/pages/index.vue`
- Create: `tests/e2e/homepage-material-story.spec.ts`

**Interfaces:**
- Consumes: Task 1 data/composable; `MediaImage`, `Project`, current factory/project data.
- Produces: test ids `home-hero`, `home-material-story`, `home-story-sticky`, `home-story-stage`, `home-capabilities`, `home-projects`, `homepage-machinery`, `home-process`, and `home-project-cta`.

- [ ] **Step 1: Write the failing browser contract**

Assert both locales expose one `h1`, four story stages, three capabilities, three project links, existing factory proof, all six current workflow steps, and a `/lien-he` CTA. Assert static mobile, sticky desktop, reduced-motion non-sticky behavior, and no horizontal overflow at the required boundaries.

- [ ] **Step 2: Run the focused browser test and observe missing selectors**

Run: `pnpm build` then `pnpm exec playwright test --project=vr homepage-material-story.spec.ts`

- [ ] **Step 3: Implement the hero and material story**

Keep the current eager hero asset contract. In the story component, bind `--story-progress` and derived chapter classes to the composable, use a single semantic ordered list, and render four visual layers from actual catalog/workshop media plus decorative CSS technical lines.

- [ ] **Step 4: Implement capabilities and asymmetric project stage**

Use sharp editorial rules, responsive grid areas, semantic project links, localized category/location/scope metadata, and visible focus styles.

- [ ] **Step 5: Implement factory proof, process rail, and bright CTA**

Reuse current factory/machinery/workflow/company facts and keep the machinery test-id contract. Keep the CTA surface light and all actions truthful.

- [ ] **Step 6: Replace `index.vue` with composition and existing-data selection**

Leave SEO and JSON-LD at route level. Build `MediaImage` story assets from current project/workshop catalog entries with localized alt copy and throw early if a required workshop asset is absent.

- [ ] **Step 7: Run the focused browser test green**

Run: `pnpm build` then `pnpm exec playwright test --project=vr homepage-material-story.spec.ts`

---

### Task 3: Refine motion and preserve existing contracts

**Files:**
- Modify: Task 2 component files as indicated by focused failures
- Modify only when the existing test encodes geometry replaced by the approved composition: `tests/e2e/homepage-machinery-density.spec.ts`
- Do not modify: snapshot directories

**Interfaces:**
- Consumes: completed homepage components.
- Produces: a stable responsive and reduced-motion experience that remains compatible with existing homepage gates.

- [ ] **Step 1: Run neighboring unit and browser contracts**

Run: `pnpm test`, `pnpm test:gates:hero`, and `pnpm exec playwright test --project=vr homepage-machinery-density.spec.ts workflow-density.spec.ts`.

- [ ] **Step 2: Fix only regressions caused by the new composition**

Retain the existing hero/machinery semantics where they remain user-visible. If a density expectation encoded the replaced layout rather than a still-valid behavior, update the focused expectation without weakening content, accessibility, overflow, or breakpoint assertions.

- [ ] **Step 3: Verify start/middle/end choreography manually in the local browser**

At `1440×900`, inspect the story at progress near `0`, `0.5`, and `1`. At `390×844` and reduced motion, verify all four frames appear in normal flow and no content is pinned or hidden.

---

### Task 4: Full verification and handoff

**Files:**
- Verify all changed files only.

**Interfaces:**
- Produces: exact command results and a local preview for user review.

- [ ] **Step 1: Run static, media, unit, type, and build checks**

Run: `pnpm lint`, `pnpm lint:media`, `pnpm test`, `pnpm typecheck`, and `pnpm build`.

- [ ] **Step 2: Run focused and shared Chromium gates**

Run: `pnpm exec playwright test --project=vr homepage-material-story.spec.ts homepage-machinery-density.spec.ts workflow-density.spec.ts`, `pnpm test:gates:text`, `pnpm test:gates:layout`, and `pnpm test:gates:a11y`.

- [ ] **Step 3: Inspect final scope**

Run: `git diff --check`, `git diff --stat`, and `git status --short`. Confirm no generated catalog, manifest, snapshot, unrelated route, dependency, or lockfile changes.

- [ ] **Step 4: Start the normal Nuxt development server and open `/`**

Use the exact local URL printed by `pnpm dev`; keep it running for user review.
