# Documentation index

Start with **[`launch-plan.md`](launch-plan.md)** — the current status and what remains before
launch. It supersedes the archived audits as the source of truth.

## Active

| Doc | What it is |
|---|---|
| [`launch-plan.md`](launch-plan.md) | **Source of truth.** Launch-readiness plan (UX/UI, content, SEO, docs) with per-task status. |
| [`hero-art-direction.md`](hero-art-direction.md) | Engineering spec for the hero system — scrim families, the readability contract (measured contrast floors), sizing. Referenced by `§` from `AppHero.vue`, `main.css`, and `tests/e2e/hero.spec.ts`. |
| [`header-footer-art-direction.md`](header-footer-art-direction.md) | Engineering spec for the header state machine, footer vertical rhythm, and the visual-regression workflow (§14 budget, §38 matrix, §41 approval). Referenced by `§` from the header/footer/drawer components and the VR specs. |
| [`homepage-density.md`](homepage-density.md) | The homepage density / section-ordering pass. |
| [`media-migration/`](media-migration/) | Five-phase design of the content-addressed media pipeline (audit → storage architecture → media layer → migration execution → Phase 5 roadmap). Still the reference for how media works. |
| [`supabase-storage-migration-plan.md`](supabase-storage-migration-plan.md) | The Supabase Storage migration plan behind the media pipeline. |

## Archived

Historical snapshots — kept as the evidence trail behind the launch work, **not** current state.
Each carries a header pointing back to `launch-plan.md`.

| Doc | What it was |
|---|---|
| [`archive/audit-2026-07/`](archive/audit-2026-07/) | Full production audit (2026-07-10): architecture, UI/UX, performance, SEO, a11y, security, code quality, tech debt. Most Critical/High findings are now fixed. |
| [`archive/content-audit.md`](archive/content-audit.md) | Content-completeness audit (2026-07-05). Predates the 11-project bilingual content — counts are stale. |
