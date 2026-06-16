## Session Handoff Rule

Every Claude Code session must update this file before finishing.

Required updates:
- What was completed
- What was changed
- What remains
- Important decisions made
- Files modified

This file is the single source of truth for future sessions.

# LaiHuy Interior

Marketing website for LaiHuy Interior built with Nuxt 4.

## Tech Stack

- **Framework:** Nuxt 4 (Vue 3, SSR/Nitro)
- **UI:** @nuxt/ui 4, Tailwind CSS 4
- **Animation:** GSAP, Lenis (smooth scroll), Motion
- **Icons:** @iconify-json/lucide, @iconify-json/simple-icons
- **Tooling:** TypeScript, ESLint (@nuxt/eslint), vue-tsc
- **Package manager:** pnpm

## Scripts

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Start dev server |
| `pnpm build` | Production build |
| `pnpm preview` | Preview production build |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | `nuxt typecheck` (vue-tsc) |

## Project Structure

- `app/pages/` — routes: `index`, `gioi-thieu`, `projects`, `nha-xuong`, `tuyen-dung`, `lien-he`
- `app/components/` — UI components, including the cinematic home set
- `app/composables/` — shared composables (e.g. `useCinematicJourney`)
- `app/data/` — static content modules (e.g. `experience.ts`)
- `app/assets/css/main.css` — global styles

## Merge Log

### 2026-06-16 — merged `worktree-cinematic-home` into `main`

- **Merge commit:** `48cf0bd`
- **Merged features:** Cinematic, scroll-driven homepage experience powered by GSAP + Lenis:
  - `CinematicStage`, `CinematicRail`, `CinematicBlueprint` components
  - `useCinematicScroll` composable driving scroll-linked animation
  - `experience.ts` data module backing the new sections
  - Reworked `app/pages/index.vue` to compose the cinematic sections
  - Added `gsap` and `lenis` dependencies
- **Verification:** lint clean, typecheck clean, production build succeeds.

## Session Log

### 2026-06-16 — chapter-based cinematic journey + Screen 2 transformation

**What was completed**

Converted the continuously-scrolling homepage into a **step-locked cinematic
journey**: every wheel / trackpad / swipe / arrow-key gesture advances exactly one
story step, sections snap, and there is no free scrolling. Added Screen 2's
two-chapter transformation (Blueprint → Structure Reveal) and a closing footer
chapter. All gates pass (lint, typecheck, build) and behaviour was verified in a
real browser (Playwright).

**Step model — 9 panels / 10 steps** (Screen 2 owns two steps):

| Step | Panel | Meaning |
|---|---|---|
| 0 | 0 | Screen 1 — Ý tưởng / Blueprint intro |
| 1 | 1 | Screen 2 **State A** — Blueprint |
| 2 | 1 | Screen 2 **State B** — Structure Reveal |
| 3 | 2 | Screen 3 — Visualization |
| 4 | 3 | Screen 4 — Construction |
| 5 | 4 | Screen 5 — Arrival |
| 6 | 5 | Screen 6 — Craft montage |
| 7 | 6 | Screen 7 — Portfolio |
| 8 | 7 | Screen 8 — Consultation |
| 9 | 8 | Closing chapter (cinematic footer) |

**What changed (files)**

- `app/composables/useCinematicJourney.ts` **(new)** — the step controller.
  Translates a `.journey-track` of panels via GSAP; gates input so one gesture =
  one step (`isAnimating` + a quiet-window release that swallows trackpad/swipe
  momentum). Handles wheel, touch swipe, keyboard (Arrows/PageUp-Down/Space/
  Home/End), and resize. Returns `{ currentStep, totalSteps, progress, go, next, prev }`.
- `app/composables/useCinematicScroll.ts` **(deleted)** — replaced by the above.
- `app/pages/index.vue` — restructured into `.journey > .journey-viewport >
  .journey-track` with one `[data-panel]` per panel; declares the step → panel map
  and the rail step list; wires the composable and Screen 2's layered visuals.
- `app/components/CinematicStructure.vue` **(new)** — the architectural skeleton
  SVG (foundation / columns / floor slabs / roof) in far/mid/near depth layers with
  `[data-structure-line]` paths drawn on by the Screen 2 timeline.
- `app/components/CinematicFooter.vue` **(new)** — the closing full-screen chapter
  (company, contact, addresses, working hours, social, final CTA).
- `app/components/CinematicStage.vue` — added optional `stateB` prop + overlaid
  `[data-state-b]` content block for Screen 2's copy crossfade; removed the now-dead
  `transform` prop / `data-transform` binding from the old pinned-scrub design.
- `app/components/CinematicRail.vue` — now step/sub-step aware: primary chapters
  show numbers (01–09), the Screen 2 Structure Reveal shows a nested sub-dot;
  emits `select(step)` for click-to-jump; `#id` anchors kept as the no-JS fallback.
- `app/data/experience.ts` — added `stateB` copy to the `design` scene + the
  `ExperienceStateB` type.
- `app/app.vue` — global `<footer>` hidden on the homepage (`route.path !== '/'`)
  since the closing chapter replaces it there.
- `.gitignore` — added `coverage`, `tmp`, `cache`, `.vscode`, `Thumbs.db`, and a
  Claude-local section (`.claude`, `.agents`, `skills-lock.json`).

**Architectural decisions**

- **Panel-translate controller** (not CSS scroll-snap): gives exact "one gesture =
  one step" control and lets Screen 2's two steps live in one panel.
- **Screen 2 = two story steps in one panel.** Forward plays a GSAP timeline
  (blueprint recedes → structure draws on far→near with depth parallax → reality
  wipes up behind a `clip-path` mask → structure fades to a faint trace); reverse
  plays it backwards. Panel travel only happens between different panels.
- **Translate uses real `panel.offsetTop`** (not `index * innerHeight`) so it is
  robust to varying panel heights and mobile viewport-unit quirks.
- **Progressive enhancement.** Enhanced mode (client + motion allowed) adds
  `.is-enhanced`, fixes the viewport, locks `document.documentElement` overflow, and
  translates the track. Without JS / with `prefers-reduced-motion` the page stays
  plain stacked full-height sections with native scroll; the rail tracks the active
  panel via `IntersectionObserver` and `go()` falls back to `scrollIntoView`. Screen
  2 then shows the finished render with a faint structure overlay (CSS defaults).
- **Lenis is no longer used on the homepage** (discrete navigation supplies its own
  GSAP-tween smoothness). The dependency remains installed but unused.

**Remaining / future tasks**

- Consider a brief on-screen affordance (e.g. an animated scroll cue) on Screen 1.
- Optional: progress percentage / chapter label tooltip on the rail.
- Optional: richer per-screen entrance choreography (currently a shared rise +
  de-zoom on `[data-reveal]` / `[data-parallax]`).

**Known limitations**

- Each enhanced panel is forced to `100svh` with `overflow:hidden`; very short
  viewports can clip tall panels (closing chapter was compacted to mitigate). The
  rail is already hidden below 640px height.

## Current Project State

- `main` contains the chapter-based cinematic homepage journey (step-locked
  navigation + Screen 2 Blueprint→Structure transformation + closing footer chapter).
- All quality gates (lint, typecheck, build) pass; verified in-browser via Playwright.
- Branch `worktree-cinematic-home` is retained (not deleted).

