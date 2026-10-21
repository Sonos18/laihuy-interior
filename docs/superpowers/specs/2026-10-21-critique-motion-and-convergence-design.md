# Critique fixes: motion system, case-study convergence, home layout — design

Date: 2026-10-21 · Source: impeccable critique `2026-10-21T09-29-12Z__app-pages-index-vue.md` (kept untracked in the main checkout under `.impeccable/critique/`; summary below so this document stands alone).

## Intent and why

The 2026-10-21 critique scored the site beauty 6/10, motion 6/10, Nielsen 25/36. The home page reads ~7/10; interior pages ~4.5/10, mostly because `/du-an/[slug]` still uses the retired dark-band, Inter 900 uppercase, 16px-radius system listed under DESIGN.md "Drift". Motion has one real signature (the material-story clip-path wipe, which stays) and a set of defects: a reveal system that delays hover and loses to component transitions, an infinite pulse dot that reads as a live dashboard, a 26s infinite Ken Burns, a hero image that pops in, a double-exposed copy swap, and a glossy sheen.

The owner wants the site to feel like DESIGN.md's "Quiet Workshop": one warm-light canvas, photography carrying the drama, slow editorial motion that never nags. Success is a site where the flagship case study looks as good as the home page, every motion is one-shot and purposeful, and a re-run critique beats 25/36.

## User decisions (binding)

- Priority: animation first.
- Scope: all critique issues (see "Scope" for the few that cannot be fixed in code).
- Remove the metric pulse dot entirely (not soften it).
- Hero Ken Burns becomes a one-shot settle.
- DESIGN.md is updated to match **before** any code changes, because it currently approves the pulse and the sheen.
- Keep the material-story scroll wipe.

## Goals

1. DESIGN.md documents the new motion contract (task 1).
2. A reveal system that never delays hover, never fights component transitions, and covers every list it should (task 2).
3. Quiet, one-shot motion everywhere else (task 2).
4. `/du-an/[slug]` on the warm-light canvas (task 3).
5. Home photography no longer starved; capabilities heading on the rail (task 4).
6. Home factory proof and type sizes on the DESIGN.md ramp; dead code removed (task 5).
7. Verified at the boundaries, both locales, reduced motion, full gate (task 6).

## Non-goals

- Other interior pages' dark bands and Inter 900 titles (services, about, factory: `AboutWorkflowRail`, `FactoryProcessProof`, etc.). DESIGN.md says drift converges section by section; this round converges the case study only. Proposed as a follow-up.
- Replacing the wood `.btn-primary` on interior pages other than `/du-an/[slug]`.
- Contact-form transport (the "24h quote" CTA leading to a non-sending form, H5). AGENTS.md forbids adding a transport without approval; out of scope.
- Re-grading factory photography (needs new assets).
- Header balance at 1440 and footer length. Recorded as follow-ups.
- The pre-existing "SSR-visible, then hidden, then revealed" replay of above-the-fold reveal elements (the plugin adds `reveal-ready` after first paint). Not made worse; recorded as a follow-up.

## Anti-goals (failure even if it "works")

- Any new infinite or looping animation, bounce or spring.
- Any obsidian band in the middle of a page.
- Hiding an already-painted LCP image to fade it in.
- Reduced-motion users seeing any reveal, zoom, sheen or copy-swap motion.
- Approving Playwright visual baselines without the owner's explicit OK.
- Changing art direction, palette, fonts (Inter + Outfit), Lucide icons or the sticky header.

## Constraints

- DESIGN.md, `app/assets/css/main.css` tokens and PRODUCT.md are authoritative; AGENTS.md workflow and restrictions apply (no generated-file edits, no media paths, bilingual `LocalizedText`).
- Layer order `layers.css` before `main.css` is preserved.
- Verify at 767/768 and 1279/1280 plus 375/768/1440 screenshots, both locales, rich and sparse project records.
- Port 3001 must be free or serving this app before browser tests.

## Design

### Task 1 — DESIGN.md (docs only, lands first)

- **Hero Metrics Strip:** remove "and a softly pulsing bronze dot. The pulse stops under reduced motion." Metrics pair a bronze Label with a Stat value; no dot.
- **Buttons:** remove the "optional slow bronze sheen". Hover only warms the fill; `:active` scales to 0.97 (none under reduced motion).
- **Navigation:** nav underline scales in over 240ms (the hover duration) on the editorial curve; the header hide/show runs about 280ms; drawer opens on 300ms editorial and closes on 200ms exit curve.
- **New "Motion" section** (after Elevation or inside Components):
  - Curve: editorial `cubic-bezier(0.22, 0.61, 0.36, 1)` for entrances and state; exit `cubic-bezier(0.4, 0, 1, 1)` for leaving.
  - Durations: hover 240ms; state 280–400ms; reveal 600ms; hero settle 1.6s.
  - Scroll reveal: one-shot keyframe, opacity 0→1 and 16px rise, 600ms editorial, stagger via animation-delay capped at 320ms; it never delays hover or other transitions.
  - Hero image: one-shot settle from scale 1.04 to 1 over 1.6s ease-out; if the image arrives after the page is interactive it also fades in over 360ms. No looping Ken Burns.
  - Material story copy swap: outgoing copy exits in 120ms (exit curve), incoming copy enters over 240ms (editorial) after the exit; never both visible.
  - No `will-change` held at rest.
  - Under `prefers-reduced-motion`: reveal, zoom, fade, copy-swap motion and press-scale are all off; the material story uses its static reduced layout.
- **Do's and Don'ts:** update the motion "Do" to the list above (drop "sheen and pulse", add "no infinite animation").
- **Drift:** after task 3 lands, remove `/du-an/[slug]` from the dark-band and type drift bullets (task 3 does this edit).

### Task 2 — Motion system

**Reveal (`app/plugins/reveal.ts`, `main.css` reveal block).** Replace the transition-based reveal with a keyframe animation:

- Hidden state applies only to `html.reveal-ready .reveal:not(.is-visible)` (opacity 0). No `transform` and no `transition` declared on `.reveal`, so component transitions (hover lift, opacity on project cards, etc.) are untouched.
- `.is-visible` runs `animation: reveal-rise 600ms var(--ease-editorial) backwards` with `animation-delay: var(--reveal-delay, 0ms)`. Fill mode is `backwards` (not `both`), so after the animation ends the element's own styles apply again and hover transforms work.
- The directive sets `--reveal-delay` as a custom property instead of `style.transitionDelay`. Delays above 320ms are clamped.
- `will-change` is not declared.
- `--dur-reveal` becomes 600ms and the keyframe uses it, so token and DESIGN.md agree.
- `ServicesProgramList.vue` rows gain `v-reveal` with a stagger. `HomeProjectStage.vue` cards keep their own transitions and now reveal correctly.
- Reduced motion: the plugin still skips `reveal-ready`; the CSS reduced-motion block keeps `.reveal` fully visible with no animation.

**Hero image.** Remove the scoped infinite `kenBurnsHero` in `HomeHero.vue`. The global `.hero-image` animation becomes one-shot `scale(1.04) → scale(1)` over 1.6s editorial (the existing `hero-zoom` keyframe changes from 1.08 to 1.04). For the load fade: on client mount, if the eager hero `<img>` is not `complete` **and** has `naturalWidth === 0` (no decoded data yet), mark it pending (opacity 0) and on `load`/`error` remove the mark so it transitions to opacity 1 over 360ms editorial. If it is complete or already partially decoded, nothing changes, so a painted LCP image is never hidden (a progressive partial paint keeps no fade; accepted). Applies to `HomeHero` and `AppHero` (`eager` images). Reduced motion: no zoom, no fade.

**Material story copy swap (`HomeMaterialStory.vue`).** Inactive copy items transition `opacity 120ms` and a small `translateY` on the exit curve with no delay; the active item transitions `opacity 240ms` and `transform 240ms` on the editorial curve with a 120ms delay. Result: sequential exit → enter, no double exposure. Remove the permanent `will-change: clip-path, opacity` on `.home-material-story__layer` (if the wipe measurably janks without it, apply it only while the section is in view and document why).

**Remove pulse.** Delete `.metric-pulse`, `@keyframes pulse-glow` and its reduced-motion rule from `main.css`; remove the spans in `HeroMetrics.vue` and `HomeProjectStage.vue`, adjusting their flex layout so labels stay aligned.

**Remove sheen.** Delete `.btn-bronze::after`, its hover rule and reduced-motion rule; drop `overflow: hidden` / `isolation` from `.btn-bronze` if nothing else needs them. Keep `:active { transform: scale(0.97) }`.

**Chrome timing.** Nav underline uses `--dur-hover` (240ms). Header hide/show uses ~280ms (retune `--dur-state` only if every user of it is chrome; otherwise add a scoped value). Drawer close uses 200ms on the exit curve; open stays 300ms editorial; overlay fade follows the same split.

**No `transition-all`.** `.btn-primary`, `.btn-outline`, `.btn-dark`, the other `@apply` buttons in `main.css`, and icon buttons (header, drawer, carousel controls, lightbox) list explicit properties (`background-color, border-color, color, box-shadow, transform` as needed) on `--dur-hover` / `--ease-editorial`. Same for `transition-all` in `/du-an/[slug]` and `ProjectConversionFinale.vue` (task 3 owns those files).

### Task 3 — `/du-an/[slug]` on the warm-light canvas

Files: `app/pages/du-an/[slug].vue`, `ProjectHeroFacts.vue`, `ProjectStoryChapter.vue`, `ProjectMaterialStory.vue`, `ProjectDeliveryProof.vue`, `ProjectRelatedProjects.vue`, `ProjectConversionFinale.vue`, and the gallery section in the page.

- **Surfaces:** no obsidian or `surface-dark` below the hero. Facts, story, gallery, material story, delivery, related and finale sit on Linen / Raw Silk / Sawdust. Adjacent sections differ by one tone step or a Plaster hairline. The finale may use Sawdust (DESIGN.md allows it for a closing CTA). Exact tone per section is the builder's call within that rule.
- **Sticky subnav:** becomes light glass like the scrolled header (white ~92%, blur, Plaster bottom hairline). Chips follow DESIGN.md: idle Walnut Grey with a Plaster border; active Charcoal Ink fill with Linen text.
- **Type:** section headings use the Headline role (`home-section-heading` or an equivalent shared class: Outfit 500, sentence case). No `font-black`, no `uppercase` on headings, quotes or values. Card/beat headings use Title. Eyebrows stay Label (uppercase allowed). Body copy at ≥1rem with line-height ≥1.65.
- **Hero facts (`ProjectHeroFacts.vue`):** the `dt` labels move to the Label role in Walnut Grey (or Deep Timber) on Paper White/Linen, at 0.75rem minimum (removes the 10.88px text); values use Title or Stat in Charcoal Ink. Frame: 4px edge, Plaster hairline.
- **Story chapter:** remove the side-tab (`border-l-2 … rounded-r-lg` on the challenge beat, line 54). The challenge beat is distinguished by type (Title-sized statement) and spacing, optionally a full Plaster hairline above it; no single-side colored border.
- **Radii:** every `rounded-2xl` / 16px on images, cards and frames becomes 4px (`rounded-[4px]` or the shared edge token). Pills stay pills.
- **Actions:** primary actions use `.btn-bronze`; secondary use the light outline (`.btn-outline`, Action type). No hardcoded hex.
- **Gallery:** the spotlight carousel keeps its behavior; its section moves to a light tone and its controls use light-surface styling with visible focus.
- **Tests:** `tests/e2e/project-detail-phase3-visual.spec.ts` and `project-detail-editorial.spec.ts` currently assert the obsidian facts rail and dark subnav. Update those assertions to the new warm-light contract (surfaces, chip-active colors, heading weight 500); keep the column-count/breakpoint assertions.
- Verify with a rich record (`khach-san-eo-gio`) and at least one sparse design-only record from `app/data/projects.ts`.
- Remove `/du-an/[slug]` ("project detail") from every DESIGN.md Drift bullet that names it: dark bands, type/16px radii, and the wood `.btn-primary` list.

### Task 4 — Home layout

- **Hero scrim (`HomeHero.vue` `.home-hero__wash`):** lighten so the photo reads, especially on mobile. Target peaks around 0.75–0.8 at the copy corner, falling to ≤0.2 on the far side, with a bottom gradient only as tall as the copy + metrics need. Copy must still pass AA: white text ≥4.5:1 against the *lightest* pixel sampled behind the text box (spot-check at 375, 768 and 1440 in both locales). If AA needs a darker scrim than the target, AA wins and the scrim is darkened only locally behind the copy (builder's call). Axe contrast is disabled in the gates, so this is measured by hand in task 6.
- **Lead project media (`HomeProjectStage.vue`):** the hero card media holds 16:10 at all widths (no `flex: 1 1 0` collapse into a strip); the grid stops forcing two equal rows if that is what squashes it. Satellites get larger media: at ≥1024 the horizontal satellite image column grows from 180px to roughly 40–45% of the card, or satellites stay vertical 16:9 — builder's call, judged by screenshots at 1024/1280/1440.
- **Capabilities (`HomeCapabilities.vue`):** the heading block starts on the shell left edge (remove the 0.35fr offset column at md+); the `18rem` min-height only stays if it still aligns rules without leaving an empty block.

### Task 5 — Distill and type ramp

- **HomeFactoryProof:** each of the three pillars shows one fact (title) and one supporting line at ≥14px (0.875rem) with line-height ≥1.65, using existing strings only (no new editorial copy):
  - Pillar 1: title `steps[1].title`, line `steps[1].description`.
  - Pillar 2: title `content.titleLead` + `titleAccent`, line `content.description`.
  - Pillar 3: title `capabilities[2].label`, line `capabilities[2].description` (`value` may stay as a short Label above the title if it reads well).
  - Remove all evidence blocks (step 0, the four machine groups with machine lists, steps 2/5/6): the machinery detail already lives on `/nha-xuong`. If the section has no link to `/nha-xuong`, add one quiet text link with a bilingual UI label in `app/data/`.
  - The two proof metrics and the panorama stay. Data in `app/data/` is not deleted unless nothing else uses it.
- **Off-ramp sizes:** move 0.64rem / 0.68rem / 0.7rem / 0.72rem → Label 0.75rem; 0.92rem → Body 1rem or Action 0.875rem by role; 1.625rem → Title; 5.4rem → Display or Stat by role. Scope: the home components and the files task 3 touches; record any remaining off-ramp sizes found elsewhere as follow-ups.
- **Material story background:** `bg-white` → Linen.
- **Delete `HomeProcessRail.vue`** (unused; only a comment in `workflow-density.spec.ts` mentions it).
- Tests `homepage-machinery.test.ts` and `homepage-machinery-density.spec.ts` may encode the old pillar structure; update them to the distilled contract.

### Task 6 — Polish and verify

- Drawer CTA uses `.btn-bronze` instead of charcoal (consistency, H4).
- `web-design-guidelines` audit of changed sections; fix high-severity findings.
- `webapp-testing`: screenshots at 375/768/1440, both locales, of `/`, `/du-an/khach-san-eo-gio`, one sparse project, and `/dich-vu` (reveal rows); boundary checks at 767/768 and 1279/1280; reduced-motion run; console clean.
- Full gate: `pnpm lint`, `pnpm lint:media`, `pnpm typecheck`, `pnpm test`, `pnpm build`, `pnpm test:gates:ci`, `pnpm test:gates:hero`, and the specs touched above. `pnpm test:vr` is expected to fail on the intended visual changes; it is run to produce diffs, which are shown to the owner with the screenshots. Baselines are **not** approved without the owner's explicit OK; the branch is handed over as "ready except VR baseline approval", with every other command at exit 0.
- `hero.spec.ts` and `image-loading-motion.spec.ts` touch hero/reveal motion; re-run and update only assertions that encode the retired motion.
- Re-run `impeccable critique` and compare against 25/36.

## Left to the builder

Exact tone per project-detail section (within the rule), satellite card orientation, the scrim gradient stops (within the targets), whether `--dur-state` is retuned or a new value is scoped, the clamp on stagger delays, and how the hero `pending` mark is wired (composable vs. per-component).

## Delivery

All work lands on branch `claude/charming-bun-a20cbc`. Task 1 lands first; tasks 2–5 run in parallel worktrees where files don't overlap (task 2 and task 4 both touch `HomeHero.vue` / `HomeProjectStage.vue`, so they are sequenced or split by file); task 6 runs on the integrated branch. No commit to `main`, no push, no merge without the owner asking.
