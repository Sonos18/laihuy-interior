# Production Audit — `laihuy-interior`

> **⚠️ Historical snapshot (2026-07-10). Archived — do not treat as current state.**
> This audit drove the launch work but is now largely resolved. Most 🔴 Critical and 🟠 High
> findings below have been fixed since (soft 404, robots/sitemap, canonical + JSON-LD on all 8
> pages, hero/font/contrast, bilingual data, tap targets, axe gate). For the live status and
> what remains, see [`docs/launch-plan.md`](../../launch-plan.md) — that is the source of truth.
> The reports are kept unedited as the evidence trail behind those changes.

**Date:** 2026-07-10 · **Commit:** `6e37820` · **Branch:** `feat/media-supabase-catalog`

A full-repository audit covering architecture, UI/UX, performance, SEO, accessibility, security, code quality, and technical debt.

Every finding was verified by execution — a production build, a running preview server, browser instrumentation, and direct measurement — not by inspection alone. Where a claim could not be verified, it is labelled with its confidence level and the evidence that would confirm it.

## Reports

| # | Report | Read it for |
|---|---|---|
| 1 | [Executive Summary](./01-executive-summary.md) | The verdict and the five things that matter |
| 2 | [Architecture Review](./02-architecture-review.md) | Layering, i18n model, catalog drift, dead code |
| 3 | [UI/UX Review](./03-ui-ux-review.md) | Design consistency, components, mobile, images, conversion |
| 4 | [Performance Review](./04-performance-review.md) | Measured bundle, image, and font waste |
| 5 | [SEO Review](./05-seo-review.md) | Soft 404, indexability, structured data |
| 6 | [Accessibility Review](./06-accessibility-review.md) | WCAG 2.1 AA findings with computed ratios |
| 7 | [Security Review](./07-security-review.md) | Headers, secrets, form backend readiness |
| 8 | [Code Quality Review](./08-code-quality-review.md) | Tests, types, duplication, CI gaps |
| 9 | [Technical Debt](./09-technical-debt.md) | Debt ranked by interest rate; risk register |
| 10 | [Improvement Roadmap](./10-improvement-roadmap.md) | Sequenced sprints with dependencies |
| 11 | [Prioritized TODO Checklist](./11-prioritized-todo-checklist.md) | Actionable, file-referenced task list |

## Headline findings

| | Finding | Evidence |
|---|---|---|
| 🔴 | `/du-an/<anything>` returns **HTTP 200** — a soft 404 around the entire portfolio | `curl` status codes |
| 🔴 | Cookie-based i18n: **no English content is indexable**; hydration mismatches on every prerendered page | rendered HTML + browser console |
| 🔴 | `catalog.generated.ts` is **59% stale** and all 26 tests still pass | `pnpm media:catalog` → 130-line diff |
| 🟠 | Every hero is **downloaded twice** (91 KB preload discarded + 243 KB master) | `performance.getEntriesByType('resource')` |
| 🟠 | **117 KB** of checksums and build paths ship to every browser, and are never read in production | bundle measurement |
| 🟠 | The site **cannot capture a lead** — the contact form is a `mailto:` link | `lien-he.vue:77` |
| 🟠 | The fluid type scale **never applies** — `h1` renders at 60px, not the intended 76px | CSS layer walk + `getComputedStyle` |

## What is genuinely good

The media pipeline (`app/media/`, `app/shared/media/`, `scripts/media/`) is senior-level work: content-addressed, checksummed, immutable, resumable, schema-versioned, CI-guarded, and documented across five phase documents. **It should be preserved, not refactored.** The service-role key is handled with more care than most projects manage.

The gap is that this discipline was applied to the infrastructure layer and not yet to the layer that faces the customer.

## Scope note

These reports are analysis only. **No application code was modified.** The single command that writes to the repo (`pnpm media:catalog`, run to prove the drift) was reverted with `git checkout` immediately afterwards.
