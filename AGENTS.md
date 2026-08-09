# AGENTS.md

## Purpose

Use this file before planning, editing, testing, reviewing, or documenting this repository. Keep changes scoped, evidence-based, and compatible with the current Nuxt application and its existing tests.

## Instruction Precedence

When instructions disagree, use this order:

1. Direct user instructions for the current task.
2. This root file and any more narrowly scoped `AGENTS.md`.
3. Current application source and current tests.
4. An implementation plan explicitly designated for the current task.
5. Other repository documentation.
6. Historical screenshots, captures, and archived audit material.

Do not silently resolve a material conflict. Record it, verify the current behavior, and ask when the requested outcome remains ambiguous.

## Project Summary

This is the bilingual Vietnamese-default/English marketing site for Lai Huy Interior, an interior design and manufacturing business. It presents services, company and workshop information, careers, contact details, and a data-driven project portfolio.

Routes currently include `/`, `/gioi-thieu`, `/du-an`, `/du-an/[slug]`, `/nha-xuong`, `/dich-vu`, `/tuyen-dung`, `/lien-he`, `/privacy-policy`, and `/terms-of-use`. Unknown routes use the custom bilingual `app/error.vue` shell when that file is present in the working tree.

## Stack and Runtime

- Nuxt `4.3.1`, Vue `3.5.28`, TypeScript `5.9.3`, and Vite `7.3.1` are the currently resolved core versions.
- Styling uses Tailwind CSS `4.1.18`, Nuxt UI `4.4.0`, and project tokens in `app/assets/css/main.css`.
- Images use `@nuxt/image` plus a generated media catalog and optional public Supabase Storage URLs.
- Tests use Vitest `4.1.9`, Playwright `1.61.1`, and `@axe-core/playwright` `4.12.1`.
- `pnpm@10.29.3` is authoritative (`packageManager` and `pnpm-lock.yaml`). Do not use npm or yarn to change dependencies.
- The README requires Node 20 or newer; CI uses Node 22. Prefer Node 22 for CI parity. Do not assume behavior observed only on another Node major is portable.

## Repository Map

| Path | Responsibility |
| --- | --- |
| `app/app.vue` | Shared skip link, header, drawer, main outlet, footer, and locale initialization |
| `app/error.vue` | Full-shell 404/500 experience; not wrapped by `app/app.vue` |
| `app/pages/` | File-based routes; there is no separate `app/layouts/` layer |
| `app/components/` | Shared page, navigation, media, and content components |
| `app/composables/` | Locale, SEO, header-state, active-link, and media URL behavior |
| `app/data/` | Typed bilingual business copy, UI labels, company facts, and project records |
| `app/media/` | Generated media records and presentation joins |
| `app/shared/media/manifest.json` | Media pipeline source manifest; update through the media tooling, not by hand |
| `app/assets/css/layers.css` | CSS layer declaration order |
| `app/assets/css/main.css` | Global tokens, layout contracts, breakpoints, and shared component rules |
| `server/routes/` | Generated `robots.txt` and `sitemap.xml` endpoints |
| `tests/` | Vitest media tests and Playwright UI, accessibility, and visual checks |
| `scripts/media/` | Media scan, catalog generation, optimization, upload, and verification |
| `scripts/verify/` | Lighthouse/vitals and bundle-budget checks |
| `docs/` | Active plans, scoped specifications, historical audits, and visual evidence |

There is no application middleware directory and no committed hosting adapter, Docker, Vercel, or Netlify configuration. Do not infer a deployment platform.

## Authoritative Documentation

- Start with `README.md` for setup and the media workflow, then verify every claim against current source and tests.
- Use `docs/README.md` to distinguish active guidance from archived material.
- For UI-review work, read `docs/ui-review/implementation-plan.md` first if it exists at task time. It does not currently exist; never invent its contents.
- For matching scopes, consult `docs/header-footer-art-direction.md`, `docs/hero-art-direction.md`, `docs/homepage-density.md`, `docs/footer-refinement-spec.md`, and `docs/launch-plan.md`, but treat them as proposals where current behavior differs.
- `docs/archive/`, `docs/media-migration/`, `docs/ui-review/data/`, and UI-review screenshots are historical evidence unless a task explicitly promotes them to the current specification.
- The source and tests currently contradict some older contact-form and error-page documentation. Current code wins unless the user explicitly requests a behavior change.

## Commands

### Install

```powershell
pnpm install
```

Do not install, upgrade, or regenerate the lockfile unless the task explicitly requires dependency changes.

### Development

```powershell
pnpm dev
pnpm build
pnpm preview
```

`pnpm preview` serves the production build. Playwright's configured web server runs `node .output/server/index.mjs`, so run `pnpm build` before Playwright when `.output` is absent or stale.

### Static Checks

```powershell
pnpm lint
pnpm lint:media
pnpm typecheck
pnpm test
```

`pnpm test` currently runs the Vitest unit suite only. `pnpm lint:media` rejects raw `/images/` and Supabase media URLs in application code.

### End-to-End and Visual Checks

```powershell
pnpm test:gates:text
pnpm test:gates:layout
pnpm test:gates:a11y
pnpm test:gates:hero
pnpm test:gates
pnpm test:gates:ci
pnpm test:vr
pnpm test:vr:all
```

- `test:gates:ci` runs text, layout/contact, and accessibility suites sequentially on Chromium. It does not run the hero gate, the pixel visual suite, or all browsers.
- `test:gates` runs numeric gate and alignment specs on Chromium; it is not the complete gate set.
- `test:vr` runs the Chromium visual project. `test:vr:all` runs all configured browser projects and is expensive.
- Never run `test:vr:approve` or `test:vr:all:approve`, or otherwise update committed snapshots, without explicit approval to change baselines.
- Accessibility checks currently disable Axe color-contrast rules and cover only selected routes/data. Treat them as a floor, not proof of full WCAG compliance.

### Media and Performance Tooling

`pnpm media:catalog` regenerates catalog files. `media:scan --write`, `media:optimize`, and `media:upload` write data or assets; `media:upload` also requires credentials and remote access. `media:verify --remote`, baseline commands, and Lighthouse checks can depend on external state or a running server. Run them only when the task requires them and their prerequisites are understood.

## Change Workflow

1. Read the relevant source, tests, active scoped specification, and `git status --short` before editing.
2. Establish the current behavior and identify pre-existing dirty files. Do not attribute them to your work.
3. Make the smallest change that satisfies the task. Do not redesign or rewrite unrelated routes.
4. Run checks proportional to the affected surface. Build before browser tests when production output matters.
5. Inspect the final diff and report exact command exits, failures, timeouts, skipped checks, and external dependencies.

For a data/content change, normally run lint, typecheck, and relevant unit tests. For media references, also run `lint:media`. For UI changes, run the applicable Playwright gate plus direct boundary checks. For hero, header, footer, error-shell, routing, SEO, or media-provider changes, add a production build and the matching broader route coverage.

## Coding and Architecture Rules

- Follow `.editorconfig`: UTF-8, LF, two-space indentation, final newline, and trimmed trailing whitespace except where Markdown requires it.
- Follow the Nuxt ESLint configuration; do not add a separate formatting style.
- Preserve `app/assets/css/layers.css` before `app/assets/css/main.css` in `nuxt.config.ts`. Layer order is a runtime styling contract.
- Reuse semantic tokens and existing shell/section utilities from `main.css`. Avoid unrelated token churn and raw color proliferation.
- Keep bilingual content in typed `LocalizedText` data and resolve it with the existing locale helpers. Do not introduce English-only or Vietnamese-only UI accidentally.
- Keep business copy and alt text in `app/data/`; generated media files contain identity, dimensions, and paths, not editorial content.
- Use generated media entries with `MediaImage`/`useMediaUrl`; do not hardcode `/images/` paths or Supabase object URLs.
- Preserve `useHeaderState` and the shared shell contracts when changing header, footer, skip-link, drawer, or scroll behavior.
- Do not add a backend, database, email service, server endpoint, analytics transport, or third-party form transport without explicit approval.

## UI and Responsive Rules

- Preserve the existing design system and the distinction between the bespoke home hero and shared `AppHero` pages.
- Verify responsive behavior immediately below, at, and above relevant CSS boundaries, especially `767/768` and `1279/1280`, plus content-specific widths. Standard desktop/tablet/mobile screenshots alone are insufficient.
- Test both locales where text length, wrapping, labels, metadata, or navigation can change layout.
- Verify dynamic project pages with representative rich and sparse records from `app/data/projects.ts`; do not test only `/du-an/khach-san-eo-gio`.
- Check initial, loading, empty, validation, success, error, open/closed navigation, scrolled header, reduced-motion, keyboard, and focus states when the affected feature has those states.
- Keep scoped fixes scoped. A contact, footer, or error-page correction is not permission to restyle other routes.
- Do not approve new screenshots to hide nondeterminism, missing assets, or header-state races. Diagnose the cause first.

## Contact Form Constraint

The current `/lien-he` submission is frontend-only: after client-side validation it logs the reactive form draft at the future API integration seam. It does not send, store, or deliver an enquiry and it does not display a success state.

- Never claim that the enquiry was sent, received, stored, or will be answered unless a real transport has been explicitly approved, implemented, and verified.
- Do not add Supabase writes, email, API routes, databases, or third-party form services without explicit user approval.
- Treat production-facing success copy that implies delivery as a known blocker, not evidence that delivery exists.

## SEO and Runtime Configuration

- `NUXT_PUBLIC_SITE_URL` drives canonical, Open Graph, JSON-LD, sitemap, and robots URLs. Its code default is a placeholder; production must provide the real absolute origin.
- `NUXT_PUBLIC_USE_SUPABASE_MEDIA=true` requires `NUXT_PUBLIC_SUPABASE_URL`; configuration fails early without it.
- `SUPABASE_SERVICE_ROLE_KEY` is for local upload tooling only. Never commit it, expose it through `NUXT_PUBLIC_*`, log it, or add it to client/runtime/deployment configuration.
- Do not read or print the ignored local `.env`. Use `.env.example` for variable names and safe placeholders.
- Locale is cookie/state based with Vietnamese as default; there are no locale-prefixed URLs. Do not claim independently indexable English routes or `hreflang` coverage.

## Testing and Verification Rules

- A command passes only when its process exits with code 0. Passing assertions followed by a timeout or failed shutdown are not a passing command; report both facts.
- Do not raise timeouts or add retries merely to hide Playwright server starvation or navigation failures. Isolate and diagnose the failing layer.
- The shared visual sweep currently covers selected routes at `390`, `768`, and `1440` widths; this does not replace breakpoint-boundary testing or all dynamic project shapes.
- Browser tests can depend on remote Supabase images and Google Maps. Record whether external resources were enabled, blocked, or unavailable.
- CI uses Ubuntu and Node 22, then runs lint, media literal guard, media catalog drift detection, unit tests, typecheck, build, Playwright Chromium install, and selected text/layout/accessibility gates. Local success on Windows is useful but not identical to CI.
- Do not run every expensive browser suite by default. Select the smallest suite that exercises the changed contract and broaden coverage for shared or high-risk behavior.

## Generated and Restricted Files

- Never manually edit `app/media/catalog.generated.ts` or `app/media/fallback.generated.ts`; both are generated by `pnpm media:catalog`.
- Do not manually edit `app/shared/media/manifest.json`. Update it through the documented media scan/catalog pipeline and inspect the generated diff.
- Treat `.nuxt/`, `.output/`, `node_modules/`, `test-results/`, `tests/.report/`, `.playwright-mcp/`, `.media-build/`, and the root `--host/` directory as local/generated artifacts.
- `public/images/` is gitignored fallback media, not a normal source directory. Do not delete or bulk-move it without an approved media migration plan.
- Playwright snapshot directories are committed evidence. Change them only through an intentional, reviewed baseline update.
- Do not modify historical screenshots or generated review data to make current behavior appear verified.

## Documentation and Evidence Rules

- Verify documentation against the current checkout before relying on it. Mark claims that cannot be reproduced as unverified.
- Keep historical captures separate from new verified evidence. New screenshots should identify route, viewport, locale, browser, commit/worktree state, and relevant environment flags.
- Do not copy old audit findings into current guidance without checking whether they were fixed or invalidated.
- Update only documentation in scope. Do not rewrite implementation plans while making unrelated code changes.
- Record behavior changes explicitly, especially navigation, form submission, project routing, SEO, media source, and error handling.

## Git and Multi-Agent Safety

- Inspect `git status --short` before and after work. Preserve user changes and unrelated dirty files; never reset, clean, discard, or overwrite them.
- Do not commit, push, rebase, or alter branches unless explicitly requested.
- When multiple coding agents will modify this repository in parallel, use a separate Git worktree per agent. Do not let agents edit the same dirty checkout concurrently.
- Nested instruction files apply only within their directory scope. There are no repository-owned nested `AGENTS.md` files; files under installed dependencies are third-party instructions and do not govern this repository.
- `.claude/worktrees/home-preview/CLAUDE.md` belongs to an ignored linked worktree and describes a different checkout. Do not apply it to the current root.

## Known Issues and Caveats

- The contact form logs a validated draft at a future API integration seam and has no delivery transport.
- The default `siteUrl` is a placeholder and deployment configuration is not committed.
- Some Playwright runs have shown navigation/server-starvation failures; the hero gate is intentionally not in `test:gates:ci` pending diagnosis.
- A Playwright process may finish assertions but hang during shutdown on Windows. Preserve the non-zero/timeout result in reports.
- The current accessibility gate excludes color contrast and is not exhaustive across legal pages or project data shapes.
- Supabase media and embedded Google Maps make some browser evidence dependent on external services.
- Active source and tests may be ahead of untracked or dated documents and screenshots in `docs/ui-review/`.

## Definition of Done

- The requested behavior and boundaries are explicit, with no unresolved implementation decisions hidden in the change.
- The diff is scoped; unrelated routes, user changes, secrets, generated artifacts, and approved baselines are untouched.
- Relevant locales, responsive boundaries, project data shapes, UI states, SEO/runtime effects, and accessibility behavior were checked in proportion to risk.
- Required commands exited 0. Any skipped, unavailable, timed-out, or non-zero check is reported and prevents an unqualified completion claim.
- Documentation matches current source and tests; historical evidence is labeled and kept separate.
- The final `git diff` and `git status --short` have been reviewed before reporting completion.
