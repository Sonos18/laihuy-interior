# Lai Huy Interior

Marketing website for **Lai Huy Interior** — a Vietnamese factory-direct interior manufacturer
and contractor for hotels, villas, apartments, and large-scale projects. Bilingual (Vietnamese
default, English), statically prerendered, with a content-addressed media pipeline backed by
Supabase Storage.

**Stack:** Nuxt 4 · Vue 3 · Tailwind CSS v4 · Nuxt UI v4 · `@nuxt/image` (custom Supabase
provider) · `@nuxt/fonts` (Inter) · TypeScript · Vitest · Playwright (visual regression + axe) ·
pnpm.

## Prerequisites

- Node.js 20+
- **pnpm** (this repo pins `pnpm@10` via `packageManager`; use pnpm, not npm)

## Setup

```bash
pnpm install
cp .env.example .env   # then fill in the values below
```

### Environment

| Variable | Purpose |
|---|---|
| `NUXT_PUBLIC_SUPABASE_URL` | Supabase project URL. Public — safe in the browser. |
| `NUXT_PUBLIC_USE_SUPABASE_MEDIA` | `true` = serve images from Supabase Storage; `false` = fall back to `/public`. Production is `true`. |
| `NUXT_PUBLIC_SITE_URL` | Absolute production origin. Drives `robots.txt`, `sitemap.xml`, canonical and OG URLs. **Set the real domain per deployment** — the default is a placeholder. |
| `SUPABASE_SERVICE_ROLE_KEY` | **Local media-upload scripts only.** Never commit it, never add it to CI/Vercel env, never prefix with `NUXT_PUBLIC_`. |

## Development

```bash
pnpm dev        # dev server at http://localhost:3000
pnpm build      # production build (static prerender + Nitro server)
pnpm preview    # preview the production build
```

## Quality gates

```bash
pnpm lint         # ESLint (+ --fix to autofix)
pnpm typecheck    # nuxt typecheck (vue-tsc)
pnpm test         # Vitest unit tests (media layer)
pnpm test:vr      # Playwright visual regression, Chromium (compares against baselines)
pnpm test:gates   # hero geometry + alignment gates
```

Visual-regression baselines are **approval artefacts**: an unexpected diff fails and stays failed
until a human approves it with `pnpm test:vr:approve` in a commit that contains nothing else. The
axe-core accessibility gate (`tests/e2e/a11y.spec.ts`) asserts zero WCAG A/AA violations on every
route. See [`docs/header-footer-art-direction.md`](docs/header-footer-art-direction.md) §14/§41
for the VR workflow.

## Media pipeline

Images are **content-addressed and immutable**. Business copy (`app/data/`) owns alt text and
meaning; the generated catalog (`app/media/catalog.generated.ts`) owns paths and dimensions;
they are joined at the presentation boundary. The full design is documented in
[`docs/media-migration/`](docs/media-migration/).

```bash
pnpm media:scan       # scan public/images for source assets
pnpm media:catalog    # regenerate app/media/catalog.generated.ts from the manifest
pnpm media:optimize   # generate resized WebP variants
pnpm media:upload     # upload to Supabase Storage (needs SUPABASE_SERVICE_ROLE_KEY; refuses to run in CI)
pnpm media:verify     # verify uploaded assets against the manifest
pnpm lint:media       # guard against hardcoded media paths in source
```

> **Never hand-edit `app/media/catalog.generated.ts`.** It is generated from the manifest by
> `pnpm media:catalog`; edit the source assets/manifest and regenerate. `public/images/` is
> gitignored — the assets live in Supabase Storage.

## Documentation

Start with **[`docs/launch-plan.md`](docs/launch-plan.md)** — the current status and remaining
work. See [`docs/README.md`](docs/README.md) for the full index of engineering specs and
archived material.
