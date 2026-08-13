# `/dich-vu` Editorial V2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the approved image-led Editorial V2 mockup on the real Nuxt `/dich-vu` route.

**Architecture:** Keep page content and service facts in the existing typed data modules. Recompose the page with two Services-specific presentational components: one owns the image-led 01–03 chapters and one owns the hoverable 04–06 index; `dich-vu.vue` continues to own media joins, chapter order, links, SEO, and JSON-LD.

**Tech Stack:** Nuxt 4.3.1, Vue 3.5.28, TypeScript 5.9.3, Tailwind CSS 4.1.18, Vitest 4.1.9, Playwright 1.61.1, pnpm 10.29.3.

## Global Constraints

- Preserve the shared header, drawer, footer, `AppHero`, bilingual data, media catalog, SEO, and six-service JSON-LD order.
- Use only current Inter, ink, paper, and wood tokens; the 04–06 hover background is `wood-600`.
- The final CTA is white and the following shared footer remains `ink-950`.
- Do not add upload, form transport, success copy, dependencies, hardcoded media URLs, or visual baseline updates.
- Do not commit or change branches without explicit user instruction.

---

### Task 1: Lock the approved layout contract

**Files:**
- Modify: `tests/e2e/services-delivery-journey.spec.ts`

**Interfaces:**
- Produces: observable chapter, responsive-grid, hover-color, CTA/footer contrast, and media contracts.

- [ ] Add the `evidence` chapter to the literal visible chapter order.
- [ ] Assert three editorial core stages, four evidence images, three compact programme rows, and real contact/factory links.
- [ ] Assert the document layout switches at 768px, editorial stages at 1280px, proof at 768px, evidence grid remains two/four columns, and programme rows switch at 768px.
- [ ] Hover programme 04 and assert computed background `rgb(124, 80, 50)`, white title/arrow, and 80%-white description.
- [ ] Assert the final CTA computes to white while the adjacent shared footer computes to `rgb(11, 10, 9)`.
- [ ] Build and run the targeted spec; confirm it fails because Editorial V2 is not implemented.

### Task 2: Recompose services 01–06

**Files:**
- Modify: `app/components/ServicesJourneyRail.vue`
- Modify: `app/components/ServicesProgramList.vue`

**Interfaces:**
- `ServicesJourneyRail` consumes `readonly Service[]`, `readonly MediaImage[]`, and the typed journey intro.
- `ServicesProgramList` consumes the typed programme intro and `readonly Service[]`.

- [ ] Add an `images` prop to the journey component and render each canonical service as one ordered image-led article.
- [ ] Preserve source order and stable service IDs while alternating the desktop composition through index-derived grid classes.
- [ ] Rebuild programme rows as the approved four-column desktop index.
- [ ] Apply `hover:bg-wood-600`, white title/arrow, 80%-white descriptions, and visible keyboard-within parity.

### Task 3: Orchestrate the seven approved chapters

**Files:**
- Modify: `app/pages/dich-vu.vue`
- Modify: `app/data/services-page.ts` only if an approved localized label is missing.

**Interfaces:**
- Consumes: canonical services, generated project/workshop records, company contact values, typed page content.
- Produces: promise, documents, journey, proof, evidence, programmes, and bright contact chapters.

- [ ] Join three core-stage images and four evidence images from existing catalog records.
- [ ] Add the hero action without changing `AppHero` itself.
- [ ] Recompose document intake as a bright two-column editorial introduction and compact input index.
- [ ] Recompose proof as one middle ink chapter with image, existing modest proof statements, and `/nha-xuong` link.
- [ ] Add a four-image evidence strip and pass stage images into the journey component.
- [ ] Change the final contact section to white with dark/outline actions immediately before the shared footer.
- [ ] Rebuild and run the targeted browser spec until green.

### Task 4: Verify the repository contract

**Files:**
- Review all modified files; do not update snapshots.

- [ ] Run `pnpm lint`, `pnpm lint:media`, `pnpm typecheck`, and `pnpm test` separately.
- [ ] Run `pnpm build`.
- [ ] Run the targeted Services Playwright spec and applicable text/layout/accessibility gates.
- [ ] Inspect `/dich-vu` directly at mobile and desktop, including hover and CTA/footer transition.
- [ ] Run `git diff --check`, inspect the final diff, and report skipped or failed checks without committing.
