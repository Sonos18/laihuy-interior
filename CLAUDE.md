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
- `app/composables/` — shared composables (e.g. `useCinematicScroll`)
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

## Current Project State

- `main` contains the cinematic homepage experience.
- All quality gates (lint, typecheck, build) pass on `main`.
- Branch `worktree-cinematic-home` is retained (not deleted).
