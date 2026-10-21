# Critique fixes: motion, case study, home layout — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the approved critique fixes: a quiet one-shot motion system, `/du-an/[slug]` on the warm-light canvas, and a home page whose photography and type sit on the DESIGN.md system.

**Architecture:** DESIGN.md changes first (Task 1). Then three file-disjoint streams run in parallel worktrees: global motion (Task 2: `main.css`, `reveal.ts`, chrome and shared components), home (Tasks 3→4→5, sequential in one worktree: home components only), and project detail (Task 6: project components only, no `main.css`). Task 7 integrates and verifies. Behavior is pinned by Playwright specs that run with motion allowed or reduced as each test states.

**Tech Stack:** Nuxt 4.3, Vue 3.5, TypeScript 5.9, Tailwind 4.1, Playwright 1.61 (`--project=vr`), Vitest 4.1, pnpm 10.

**Spec:** `docs/superpowers/specs/2026-10-21-critique-motion-and-convergence-design.md` (approved, commit a7ca4d1). Read it with this plan.

## Global Constraints

- DESIGN.md, `main.css` tokens and PRODUCT.md are authoritative; follow AGENTS.md (no edits to `app/media/*.generated.ts` or `manifest.json`, no `/images/` literals, bilingual `LocalizedText` in `app/data/`).
- Curves: editorial `cubic-bezier(0.22, 0.61, 0.36, 1)` (`--ease-editorial`), exit `cubic-bezier(0.4, 0, 1, 1)` (`--ease-exit`). Hover 240ms (`--dur-hover`).
- No infinite animation, bounce or spring. No `will-change` held at rest. Every new motion is off under `prefers-reduced-motion: reduce`.
- No obsidian / `surface-dark` band below a hero; obsidian only behind the hero photo and in the footer.
- Headings Outfit 500 sentence case; uppercase only for Label/Nav; no `font-black` (900) headings or values; content containers 4px, controls pill.
- Text sizes on the ramp: never below 0.75rem (12px); supporting prose ≥0.875rem with line-height ≥1.65.
- No new dependencies, no new editorial copy (UI labels in `app/data/` only where the spec says so), no changes to other interior pages (services/about/factory/careers/contact dark bands are out of scope).
- **Never** run `test:vr:approve` / `--update-snapshots`. VR diffs are expected and are shown to the owner.
- **File ownership per parallel stream is exclusive** (see each task's Files). If a task needs a file outside its list, stop and report it instead of editing.
- Worktree setup (no junctions, see memory "worktree junction hazard"): in a fresh worktree run `pnpm install --frozen-lockfile --prefer-offline` and `cp -r <main checkout>/public/images public/images` (13 MB, gitignored) before any build or browser test. Never create junctions or symlinks to the main checkout.
- Browser tests: `pnpm build` first, then `$env:PLAYWRIGHT_PORT=<free port>` (each worktree its own: Task 2 → 3110, home stream → 3120, Task 6 → 3130, integration → 3100); `global-setup.ts` rejects a port held by another app.
- Motion-allowed specs must not use `tests/e2e/fixtures.ts` (it forces reduced motion). Import `test, expect` from `@playwright/test` and call `await page.emulateMedia({ reducedMotion: 'no-preference' })` before `goto`; reduced-motion cases call `emulateMedia({ reducedMotion: 'reduce' })`.
- Commits: conventional, ending with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. Scoped checks per task: `pnpm lint` on the changed files, related specs, `pnpm typecheck` only when types change.

## Review Focus

1. Hover on a revealed card right after its reveal finishes — expect zero transition delay and the card's own hover transition intact (pinned in Task 2, `MOTION-02`).
2. A hero image that arrives slowly (throttled/delayed network) — expect it hidden only while undecoded, then a 360ms fade and the 1.6s settle starting at that moment, not before (Task 2, `MOTION-05`).
3. Reduced-motion user on every changed surface — expect no reveal hiding, no hero animation, no copy-swap transition (Task 2 `MOTION-07`, Task 3 `HMS-swap-reduced`).
4. Sparse project record (design-only, few fields) on the warm-light case study — expect no empty dark frame, no orphaned dividers, chips still correct (Task 6, `PD-WARM-01..05` over rich + sparse).
5. English locale wrapping on the slimmed factory pillars and the lightened hero — expect one title + one line per pillar and AA copy contrast in both locales (Task 5 `HFP-01`, Task 4 manual AA in Task 7).

---

### Task 1: DESIGN.md motion contract

**Files:**
- Modify: `DESIGN.md` (Components → Buttons, Navigation, Hero Metrics Strip; new `## Motion` section after `## Elevation & Depth`; Do's and Don'ts)

**Interfaces:**
- Produces: the documented values every later task implements — reveal 600ms / 16px rise / editorial / delay cap 320ms; hero settle `scale(1.04)→1` over 1.6s editorial, late-image fade 360ms; copy swap exit 120ms exit-curve, enter 240ms editorial after 120ms; nav underline 240ms; header hide/show 280ms; drawer open 300ms editorial, close 200ms exit.

- [ ] **Step 1:** Edit exactly the items listed under spec "Task 1 — DESIGN.md" (pulse dot removed from Hero Metrics Strip; sheen removed from Buttons; Navigation timings; new Motion section with the values above, including "no infinite animation", "no `will-change` at rest", and the reduced-motion list; Do's motion line updated to "disable reveal, hero settle and fade, copy-swap motion and press-scale under reduced motion; no infinite animation"). Do not touch the Drift section (Task 6 owns that edit). Keep the YAML front matter unchanged.
- [ ] **Step 2:** Verify: `grep -n "puls\|sheen" DESIGN.md` returns no approval of either (only, at most, a "Don't"); `grep -n "## Motion" DESIGN.md` returns one line.
- [ ] **Step 3:** Commit `docs(design): one-shot motion contract, drop pulse and sheen`.

---

### Task 2: Global motion system (stream A, worktree, port 3110)

**Files:**
- Modify: `app/plugins/reveal.ts`
- Modify: `app/assets/css/main.css` — tokens (~L150-156), header/subnav/nav/drawer transitions (~L606, 636, 838, 1075, 1083-1100), `@apply` buttons (~L1722-1734), reveal + `.hero-image` block (~L1840-1876), `.btn-bronze` (~L1927-1990), `.metric-pulse` + `pulse-glow` + its reduced-motion rule (~L2046-2088), `hero-zoom` keyframe (~L517)
- Modify: `app/components/HeroMetrics.vue` (remove pulse span, retune delays)
- Modify: `app/components/ServicesProgramList.vue` (add `v-reveal` rows)
- Modify: `app/components/AppDrawer.vue` (CTA `btn-dark` → `btn-bronze`; icon button transitions)
- Modify: `app/components/AppHeader.vue`, `app/components/GalleryLightbox.vue` (only `transition-all` → explicit properties on icon buttons/overlays). The gallery components belong to Task 6.
- Modify (only if an assertion encodes retired motion): `tests/e2e/hero.spec.ts`, `tests/e2e/image-loading-motion.spec.ts`
- Create: `tests/e2e/motion-contract.spec.ts`

**Interfaces:**
- Consumes: Task 1 values.
- Produces (later tasks rely on these names):
  - `v-reveal="ms"` API unchanged; the directive sets CSS custom property `--reveal-delay: <min(ms, 320)>ms` on the element, never `style.transitionDelay`.
  - Keyframe `reveal-rise` (opacity 0 + `translateY(16px)` → opacity 1 + none), run by `html.reveal-ready .reveal.is-visible { animation: reveal-rise var(--dur-reveal) var(--ease-editorial) backwards; animation-delay: var(--reveal-delay, 0ms) }`. Hidden state is `html.reveal-ready .reveal:not(.is-visible) { opacity: 0 }`. `.reveal` declares no `transition`, `transform` or `will-change`.
  - Tokens: `--dur-reveal: 600ms`, `--dur-state: 280ms` (all four users are chrome: header, subnav anchor, nav underline, drawer link underline), new `--dur-drawer-exit: 200ms`.
  - `.hero-image`: `animation: hero-zoom 1.6s var(--ease-editorial) both; transition: opacity 360ms var(--ease-editorial)`; `hero-zoom` from `scale(1.04)`. `html.reveal-ready .hero-image.is-pending { opacity: 0; animation: none }`. Removing `is-pending` therefore starts the zoom at that moment (parent note 1).
  - Plugin marks pending heroes: on `app:mounted` and `page:finish`, for each `img.hero-image` with `!img.complete && img.naturalWidth === 0`, add `is-pending` and remove it on the first `load` or `error`. Skipped entirely under reduced motion.
  - `.metric-pulse` and `@keyframes pulse-glow` no longer exist. (Task 3 removes the remaining span in `HomeProjectStage.vue`.)
  - `.btn-bronze` has no `::after` sheen; keeps `:active { transform: scale(0.97) }`.

- [ ] **Step 1: Write the failing spec `tests/e2e/motion-contract.spec.ts`** (motion allowed unless the test says otherwise; viewport 1440×900 unless stated):
  - `MOTION-01 reveal uses a keyframe and a custom-property delay`: on `/`, scroll each `main .reveal` into view, wait until it has `is-visible`; for every one: `el.style.transitionDelay === ''`, `getComputedStyle(el).animationName === 'reveal-rise'` while running or after (check `animationName`), and when the bound delay was > 320 the `--reveal-delay` value is `'320ms'`.
  - `MOTION-02 no hover lag after reveal`: on `/`, scroll to `.home-projects__card--hero`, wait for its animation to finish (`el.getAnimations().every(a => a.playState === 'finished')` or none), then `getComputedStyle(card).transitionDelay.split(',').every(v => v.trim() === '0s')`.
  - `MOTION-03 no infinite animations`: on `/` and `/du-an/khach-san-eo-gio`, after `load` + scrolling to bottom and back, `document.getAnimations().filter(a => a.effect?.getTiming().iterations === Infinity).length === 0`; `document.querySelectorAll('.metric-pulse').length === 0`.
  - `MOTION-04 no sheen`: `getComputedStyle(document.querySelector('.btn-bronze'), '::after').content` is `'none'` or `'normal'`; `.btn-bronze:active` scale preserved — skip hover assertion, assert the stylesheet still contains a rule `.btn-bronze:active` with `scale(0.97)` via `document.styleSheets` scan.
  - `MOTION-05 late hero image fades and settles from the moment it appears`: route `**/*` image requests for the home hero source to wait 1500ms before `continue()`; `goto('/', { waitUntil: 'domcontentloaded' })`; assert `img.hero-image` has class `is-pending` and computed `opacity === '0'` and `animationName === 'none'`; after the delayed load, assert no `is-pending`, computed `transitionDuration` includes `0.36s`, and `img.getAnimations()[0].currentTime < 1600` measured within 300ms after load.
  - `MOTION-06 chrome timing`: `getComputedStyle(document.querySelector('.app-header')).transitionDuration === '0.28s'`; `getComputedStyle(document.querySelector('.nav-link'), '::after').transitionDuration === '0.24s'` (at 1440); open the drawer at 390×844, then close it and assert the panel element carries `drawer-panel-leave-active` with computed `transitionDuration === '0.2s'` during the leave.
  - `MOTION-07 reduced motion`: `emulateMedia({ reducedMotion: 'reduce' })`; on `/` `document.documentElement.classList.contains('reveal-ready') === false`, every `main .reveal` computed opacity `'1'`, `img.hero-image` computed `animationName === 'none'` and no `is-pending`.
  - `MOTION-08 services rows reveal`: on `/dich-vu`, every program row rendered by `ServicesProgramList` has class `reveal`; after scrolling all into view, all have `is-visible` and computed opacity `'1'`.
  - `MOTION-09 drawer CTA`: at 390×844 open the drawer; its CTA has class `btn-bronze` and computed `borderTopColor` equals the Deep Timber token (`rgb(124, 80, 50)`), per the Bronze Edge Rule on light surfaces (parent note 2).
- [ ] **Step 2:** `pnpm build` then `pnpm exec playwright test --project=vr motion-contract.spec.ts` → expect failures in MOTION-01..06, 08, 09 (MOTION-07 may already pass).
- [ ] **Step 3: Rewrite `app/plugins/reveal.ts`** to the Interfaces above (directive sets `--reveal-delay`, clamp 320; hero pending marking on `app:mounted` and `page:finish`; all DOM work client-only; reduced motion skips both).
- [ ] **Step 4: Edit `main.css`:** tokens; reveal block and its reduced-motion block (keep `.reveal` visible and `animation: none` under reduce); `.hero-image` + `hero-zoom` 1.04 + pending rule; delete `.metric-pulse`, `pulse-glow` and its reduced-motion rule; delete `.btn-bronze::after` + hover rule + its reduced-motion rule and drop `overflow:hidden`/`isolation` from `.btn-bronze` if nothing else needs them; nav-link underline `--dur-hover`; `.drawer-panel-leave-active` and `.drawer-overlay-leave-active` use `--dur-drawer-exit` (`--ease-exit` for the panel, linear for the overlay); `@apply` buttons replace `transition-all duration-300` with `transition-[background-color,border-color,color,box-shadow] duration-[240ms] ease-[var(--ease-editorial)]` (or the equivalent plain `transition:` declaration).
- [ ] **Step 5: Components:** `HeroMetrics.vue` remove the pulse span and keep label alignment; default delay `(baseDelay ?? 200) + index * 40` and check any caller passing `baseDelay` keeps the last metric ≤320. `ServicesProgramList.vue` rows get `v-reveal="index * 70"` + `class="reveal"`. `AppDrawer.vue` CTA → `btn-bronze` (light surface: no `--on-dark`, so the Deep Timber border applies). Replace `transition-all` in `AppHeader.vue`, `AppDrawer.vue`, `GalleryLightbox.vue` with the properties that actually change.
- [ ] **Step 6:** Rebuild, run `motion-contract.spec.ts`, `hero.spec.ts`, `image-loading-motion.spec.ts`, `gates.spec.ts`, `services-delivery-journey.spec.ts` → all pass. Update `hero.spec.ts` / `image-loading-motion.spec.ts` only where an assertion encodes the retired motion (record which in the commit body).
- [ ] **Step 7:** `pnpm lint`, `pnpm typecheck` → exit 0. Commit `feat(motion): keyframe reveal, one-shot hero settle, drop pulse and sheen`.
- [ ] **Step 8:** High-risk review (shared plugin used by every page): `reviewer` (opus) on this task's diff.

---

### Task 3: Home motion (stream B, worktree, port 3120; Tasks 3→4→5 run sequentially in this one worktree)

**Files:**
- Modify: `app/components/HomeHero.vue` (delete scoped `.hero-image` Ken Burns rule, `@keyframes kenBurnsHero` and its reduced-motion block)
- Modify: `app/components/HomeProjectStage.vue` (remove the `metric-pulse` span; icon circles `transition-all` → explicit properties)
- Modify: `app/components/HomeMaterialStory.vue` (copy swap timing; remove layer `will-change`)
- Modify: `tests/e2e/homepage-material-story.spec.ts`

**Interfaces:**
- Consumes: Task 2's global `.hero-image` rule (HomeHero then inherits the one-shot settle); `.metric-pulse` removed globally. Stream B does not edit `main.css`; its branch may render without those rules until integration, which is expected.
- Produces: nothing new.

- [ ] **Step 1: Add failing tests to `homepage-material-story.spec.ts`** (motion allowed via `emulateMedia` per Global Constraints):
  - `HMS-swap-sequenced`: with the story enhanced (`[data-enhanced="true"]`), an inactive `.home-material-story__copy-item` has computed `transitionDuration` starting `0.12s` and `transitionDelay` `0s`; the `.is-active` item has `transitionDuration` `0.24s` and `transitionDelay` `0.12s`.
  - `HMS-no-will-change`: every `.home-material-story__layer` computed `willChange === 'auto'`.
  - `HMS-swap-reduced`: under reduced motion the copy items have `transitionDuration` `0s` (or the static reduced layout renders and no `.is-active` swap runs).
  - `HOME-no-pulse`: `.home-projects` contains no `.metric-pulse` element (the hero metrics pulse is Task 2's, covered by MOTION-03 after integration) and the home hero image has no scoped animation named `kenBurnsHero` (`getComputedStyle(img).animationName !== 'kenBurnsHero'`).
- [ ] **Step 2:** `pnpm build`; run the spec → new tests fail.
- [ ] **Step 3:** Implement: inactive item `transition: opacity 120ms var(--ease-exit), transform 120ms var(--ease-exit)` with `transform: translateY(-0.25rem)` when leaving; active item `transition: opacity 240ms var(--ease-editorial) 120ms, transform 240ms var(--ease-editorial) 120ms`; reduced-motion block sets `transition: none`. Remove `will-change` from `.home-material-story__layer` (if the wipe visibly janks at 4× CPU throttle, scope it to the in-view state and comment why). HomeHero/HomeProjectStage edits per Files.
- [ ] **Step 4:** Rebuild; run `homepage-material-story.spec.ts` → pass. `pnpm lint` → exit 0.
- [ ] **Step 5:** Commit `feat(home): sequenced story copy swap, drop Ken Burns loop and pulse`.

---

### Task 4: Home layout (stream B, after Task 3)

**Files:**
- Modify: `app/components/HomeHero.vue` (`.home-hero__wash` only)
- Modify: `app/components/HomeProjectStage.vue` (grid/media rules ~L305-400)
- Modify: `app/components/HomeCapabilities.vue` (`.home-capabilities__intro`, item min-height)
- Create: `tests/e2e/home-layout.spec.ts` (reduced motion via `fixtures.ts` is fine here)

**Interfaces:** none produced.

- [ ] **Step 1: Write failing `home-layout.spec.ts`:**
  - `HL-01 lead project media is 16:10` at widths 375, 767, 768, 1023, 1024, 1279, 1280, 1440: `.home-projects__card--hero .home-projects__media` width/height in `[1.55, 1.65]`.
  - `HL-02 satellites are not slivers` at 1024, 1280, 1440: for each `.home-projects__card--satellite`, media width / card width ≥ 0.38 and media height ≥ 160px.
  - `HL-03 capabilities heading on the rail` at 768, 1280, 1440: left edge of the capabilities `h2` equals the content-box left of its `.shell` within 1px.
  - `HL-04 hero wash is lighter`: parse every `rgb(… / a)` / `rgba(…, a)` alpha from computed `backgroundImage` of `.home-hero__wash`; max alpha ≤ 0.8.
- [ ] **Step 2:** Run → HL-01, HL-03, HL-04 fail (HL-02 may fail at ≥1024).
- [ ] **Step 3:** Implement per spec Task 4: lead card media keeps `aspect-ratio: 16 / 10` at every width (drop the `flex: 1 1 0` / `aspect-ratio: auto` override and the forced equal two-row grid if it squashes the lead); satellites either vertical 16:9 or a horizontal media column of ~42% — choose by screenshots at 1024/1280/1440 and say which in the commit body. Capabilities intro becomes a single column on the shell edge; keep the 18rem floor only if rules still align without empty blocks. Wash: copy-corner peak ≈0.75–0.8, far side ≤0.2, bottom gradient only as tall as copy + metrics.
- [ ] **Step 4:** Manual AA: screenshot the hero at 375, 768, 1440 (vi and en); sample the lightest pixel inside each copy text box (title, sublead, eyebrow) and compute white-text contrast; each ≥4.5:1 (title ≥3:1 as large text). If not, darken locally behind the copy and re-measure. Record the numbers in the commit body.
- [ ] **Step 5:** Run `home-layout.spec.ts`, `alignment.spec.ts`, `hero.spec.ts` → pass. `pnpm lint` → exit 0. Commit `feat(home): lighter hero scrim, 16:10 lead project, capabilities on the rail`.

---

### Task 5: Home distill and type ramp (stream B, after Task 4)

**Files:**
- Modify: `app/components/HomeFactoryProof.vue`
- Modify: `app/components/HomeMaterialStory.vue` (`bg-white` → Linen; 0.72rem / 0.64rem → 0.75rem)
- Modify: `app/components/HomeProjectStage.vue` (0.68rem / 0.72rem → 0.75rem; `lg:text-[1.625rem]` → Title role; `lg:text-[0.92rem]` → 1rem)
- Link label: reuse an existing bilingual label for `/nha-xuong` (e.g. its navigation label in `app/data/`); no new string. If none fits, stop and report (new copy needs owner approval).
- Delete: `app/components/HomeProcessRail.vue`; update the comment in `tests/e2e/workflow-density.spec.ts:110` only if it now misleads
- Modify: `tests/homepage-machinery.test.ts`, `tests/e2e/homepage-machinery-density.spec.ts`

**Interfaces:** none produced. Records for the final report: the exact home blocks removed (parent note 4).

- [ ] **Step 1: Update tests first** to the distilled contract:
  - `HFP-01` (density spec, at 375/768/1280/1440, vi and en): exactly 3 `[data-testid="homepage-machinery-pillar"]`; each has exactly one `h3`, zero `h4`, and at most one supporting `p` (plus an optional Label); every `p` in a pillar has computed font-size ≥14px and line-height/font-size ≥1.65.
  - `HFP-02`: no visible text element inside `[data-testid="homepage-machinery"]` has font-size < 12px; the section contains a link with `href="/nha-xuong"`.
  - `HOME-RAMP`: on `/` (1440 and 375), no visible text node's element in `main` has computed font-size < 12px.
  - `HMS-linen`: `[data-testid]`/`.home-material-story` computed background-color `rgb(250, 246, 240)`.
  - Rewrite `tests/homepage-machinery.test.ts` assertions that require machine-group / step evidence on the home page; keep assertions about `app/data/factory.ts` content that `/nha-xuong` uses.
- [ ] **Step 2:** Run → fail.
- [ ] **Step 3:** Implement the spec's pillar mapping (Pillar 1 `steps[1].title` + `steps[1].description`; Pillar 2 `content.titleLead` + `titleAccent` + `content.description`; Pillar 3 `capabilities[2].label` + `capabilities[2].description`, `value` optionally as Label). Remove the evidence blocks (step 0, the four machine groups with machine lists, steps 2/5/6). Add the quiet `/nha-xuong` text link if none exists, reusing an existing label. Keep `app/data/` entries that `/nha-xuong` or tests still use (`grep` before deleting anything). Ramp fixes and Linen per Files. Delete `HomeProcessRail.vue`.
- [ ] **Step 4:** `pnpm test`, `pnpm lint`, `pnpm typecheck` (props/types changed) → exit 0; rebuild and run `homepage-machinery-density.spec.ts`, `homepage-material-story.spec.ts`, `typography.spec.ts`, `home-layout.spec.ts` → pass.
- [ ] **Step 5:** Commit `refactor(home): one fact per factory pillar, type on the ramp, drop HomeProcessRail` with the removed blocks listed in the body.

---

### Task 6: `/du-an/[slug]` on the warm-light canvas (stream C, worktree, port 3130)

**Files:**
- Modify: `app/pages/du-an/[slug].vue` (subnav, gallery section, CTA classes, `transition-all`)
- Modify: `app/components/ProjectHeroFacts.vue`, `ProjectStoryChapter.vue`, `ProjectMaterialStory.vue`, `ProjectDeliveryProof.vue`, `ProjectRelatedProjects.vue`, `ProjectConversionFinale.vue`
- Modify: `app/components/AppGalleryCarouselSlide.vue` (`rounded-2xl` at ~L36, L43 → 4px), `app/components/AppGalleryGrid.vue` (~L43 radius → 4px; `transition-all` → explicit), `app/components/AppGalleryCarousel.vue` (`transition-all` → explicit). These are shared: record every other route that renders them for before/after screenshots in Task 7.
- Leave `AboutProjectFeature`, `FactoryProcessProof`, `FactoryVisitCta`, `GalleryLightbox` radii alone (follow-ups).
- Modify: `DESIGN.md` Drift section only (after Task 1 is merged into this worktree's base)
- Modify: `tests/e2e/project-detail-phase3-visual.spec.ts`, `tests/e2e/project-detail-editorial.spec.ts`
- **Not** `main.css`: use existing classes (`.btn-bronze`, `.btn-outline`, `.home-section-heading`, `.home-card-heading`, `.eyebrow`, `.shell`, `section-y`) and Tailwind utilities with tokens. If a shared rule is truly needed, stop and report it.

**Interfaces:**
- Consumes: Task 1 merged (Drift edit). Uses `.btn-bronze` / `.btn-outline` as they exist; Task 2 changes only their transitions.
- Produces: nothing new.

- [ ] **Step 1: Write failing tests** (add a `PD-WARM` block to `project-detail-phase3-visual.spec.ts`, over `khach-san-eo-gio` and the sparse slug already used by `PD-EDITORIAL-03`, at 768 and 1440, vi and en):
  - `PD-WARM-01 no dark band`: for every `main section` after the hero chapter, and for the sticky sub-nav, the first non-transparent background up the tree has relative luminance ≥ 0.8 (use `tests/e2e/color.ts` helpers).
  - `PD-WARM-02 headings`: every `main h2` has font-weight `500`, `text-transform` `none`, font-family containing `Outfit`; no element in `main` below the hero has computed font-weight `900`.
  - `PD-WARM-03 radii`: no element in `main` below the hero has a computed `border-radius` between 5px and 9000px (4px edges and pills only).
  - `PD-WARM-04 facts`: every `[data-project-facts] dt` has font-size ≥12px and contrast ≥4.5:1 against its resolved background.
  - `PD-WARM-05 no side-tab`: `[data-story-beat="challenge"]` computed `borderLeftWidth` is `0px` and `borderTopLeftRadius` ≤4px.
  - `PD-WARM-06 chips`: the active sub-nav chip has background Charcoal Ink `rgb(24, 22, 20)` and Linen text `rgb(250, 246, 240)`; idle chips have Walnut Grey text `rgb(93, 83, 73)`.
  - Replace the existing assertions that require obsidian / `surface-dark` facts rail and dark sub-nav and the bronze active chip with these; keep the column-count and breakpoint assertions (767/768/1023/1024/1279/1280/1440) unchanged.
- [ ] **Step 2:** `pnpm build`; run both project-detail specs → PD-WARM fail.
- [ ] **Step 3:** Implement spec Task 6 (surfaces Linen/Raw Silk/Sawdust with one-step or hairline separation, finale may be Sawdust; light-glass sub-nav; Headline/Title/Label roles; facts card Paper White/Linen, 4px, Plaster hairline, `dt` Label in Walnut Grey; challenge beat without side border; all 16px radii → 4px; `.btn-bronze` primary and `.btn-outline` secondary; gallery section light with visible control focus; no `transition-all`, no hex).
- [ ] **Step 4:** Edit DESIGN.md Drift: remove "project detail" / `/du-an/[slug]` from the dark-band, type/16px-radius and wood `.btn-primary` bullets.
- [ ] **Step 5:** Rebuild; run `project-detail-phase3-visual.spec.ts`, `project-detail-editorial.spec.ts`, `project-gallery-carousel.spec.ts`, `project-media-density.spec.ts` → pass. `pnpm lint` → exit 0. Screenshot rich + sparse at 375/768/1440 for self-check.
- [ ] **Step 6:** Commit `feat(project-detail): converge case study on the warm-light canvas`.

---

### Task 7: Integrate, verify, report (orchestrator, this worktree, port 3100)

- [ ] **Step 1:** Merge stream branches into `claude/charming-bun-a20cbc` in order Task 2 → home stream → Task 6 (`--no-ff`, merge commits `merge: …`); resolve conflicts (expected none: file sets are disjoint).
- [ ] **Step 2 (parallel):** `verifier` runs `pnpm lint`, `pnpm lint:media`, `pnpm typecheck`, `pnpm test`, `pnpm build`, `pnpm test:gates:ci`, `pnpm test:gates:hero`, and the specs `motion-contract`, `home-layout`, `homepage-material-story`, `homepage-machinery-density`, `project-detail-phase3-visual`, `project-detail-editorial`, `services-delivery-journey`; then `pnpm test:vr` to produce diffs (expected red; never approve). `reviewer` (opus) reviews the whole branch against the spec and this plan.
- [ ] **Step 3:** `web-design-guidelines` audit of changed surfaces; fix high-severity findings in one fix wave (send back to the owning implementer); scoped re-review (sonnet) and targeted verifier re-run.
- [ ] **Step 4:** `webapp-testing`: confirm port 3100 serves this app; screenshots at 375/768/1440, vi and en, of `/`, `/du-an/khach-san-eo-gio`, the sparse project, `/dich-vu`; before/after shots (before = `main`) of every other route rendering the shared gallery components; boundary shots at 767/768 and 1279/1280 for `/` and the case study; one reduced-motion pass; console has no errors.
- [ ] **Step 5:** Re-run `impeccable critique` on the same target and compare with 25/36.
- [ ] **Step 6:** Report to the parent session: exact command exits, VR diff list awaiting the owner's approval, screenshots, removed home blocks, critique delta, follow-ups (other interior pages' drift, header 1440 balance, footer length, reveal replay, contact transport). Do not push, merge to `main`, or approve baselines.
