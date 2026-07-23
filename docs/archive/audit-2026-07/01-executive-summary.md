# Report 1 — Executive Summary

**Repository:** `laihuy-interior`
**Audited:** 2026-07-10 · branch `feat/media-supabase-catalog` (`6e37820`)
**Stack:** Nuxt 4.3 · Vue 3 · Tailwind CSS v4 · Nuxt UI v4 · `@nuxt/image` (custom Supabase provider) · TypeScript · Vitest · pnpm
**Method:** Full read of all 73 tracked files, plus a production build, a running preview server, and browser instrumentation. Every claim below is backed by a command or measurement, not inference.

---

## Verdict

This is a **well-engineered media pipeline attached to a marketing site that cannot yet do its job**.

The media layer (`app/media/`, `app/shared/media/`, `scripts/media/`) is genuinely senior-level work: immutable content-addressed assets, checksummed uploads, resumable and idempotent migration, a schema-versioned manifest, a CI guard against hardcoded paths, and 26 passing unit tests. It is the strongest thing in this repository and should be preserved as-is.

Everything downstream of it — how pages are rendered, indexed, translated, and converted — has gaps that would block a production launch. The site is a **lead-generation asset for a B2B interior contractor**, and today it cannot capture a lead, cannot be found in English, and tells Google that every misspelled URL is a valid page.

Nothing here is unrecoverable. The architecture is sound; the defects are concentrated, specific, and mostly cheap to fix. Roughly **60% of the critical findings are under a day of work each.**

---

## The five things that matter most

### 1. Unknown project URLs return HTTP 200 (soft 404)

`/du-an/<any-string-at-all>` renders a "Project not found" page **with a 200 status code**:

```
/du-an/nha-anh-nam                  200
/du-an/this-project-does-not-exist  200   ← should be 404
/khong-ton-tai                      404   ← Nuxt's own handler, correct
```

`app/pages/du-an/[slug].vue` renders its own 404 body but never calls `createError` or `setResponseStatus`. Google will happily index an unbounded space of URLs, diluting the eleven real case studies that are the company's entire portfolio proof. **This is the single highest-leverage fix in the repo and it is a five-line change.**

### 2. The English site is invisible to search, and broken on arrival

Language is a **cookie** (`lai-huy-locale`), not a URL. Both languages share one URL. Consequences, all verified:

- Every marketing page is prerendered as Vietnamese with `lang="vi"`. An English visitor gets Vietnamese HTML, then a client-side swap. The browser console reports `Hydration completed but contains mismatches.`
- There is no `/en` route, no `hreflang`, no alternate URL. **Google can never index a single word of the English content.** The English translation work is currently unreachable by search.
- The one SSR route (`/du-an/[slug]`) *does* vary by cookie but sends no `Vary: Cookie` header — it only escapes cache poisoning because it also sends `Set-Cookie`, which incidentally makes it uncacheable at any CDN.

And the English that does exist is partial: `services.ts`, `factory.ts`, `careers.ts` and the entire `gioi-thieu.vue` template are Vietnamese-only. **64% of the visible text on the About page stays Vietnamese when the site is set to English.** The type `LocalizedText = string | { vi, en? }` accepts a bare Vietnamese string, so the compiler never objected.

### 3. The generated media catalog is 59% stale, and the tests do not notice

`app/media/catalog.generated.ts` declares itself auto-generated from `manifest.json`. It is not reproducible from it:

```
$ pnpm media:catalog && git diff --stat app/media/catalog.generated.ts
 app/media/catalog.generated.ts | 260 +++++------
 1 file changed, 130 insertions(+), 130 deletions(-)
```

**130 of 221 asset references (59%) carry wrong dimensions** — the catalog says `3000×2000`, the manifest and the real uploaded file say `2560×1707`. Root cause: `scripts/media/optimize.ts` caps masters at `MASTER_MAX_EDGE = 2560`, and nobody re-ran `pnpm media:catalog` afterwards.

Visual impact today is near zero (the downscale was uniform, so aspect ratios survived). The real damage is that **the guarantee is broken**: `tests/media.test.ts` asserts every catalog path exists in the manifest but never compares `width`/`height`, so all 26 tests pass on a 59%-wrong file. The next change that alters an aspect ratio will ship silently.

### 4. Every visitor downloads the hero image twice, plus 117 KB of build metadata

Two independent, measured waste sources on the critical path:

**The hero downloads twice.** `AppHero.vue` and `index.vue` preload a fixed `-w1600` variant, but the `<img>` `srcset` offers the full 2560px master at the `2048w`/`2560w` candidates. On an ordinary 1536px laptop at DPR 1.25, the browser fetched **both**:

```
1-2-w1600.webp   91 KB   (preloaded, then discarded)
1-2.webp        243 KB   (what it actually rendered)
```

The preload has no `imagesrcset`/`imagesizes`, so it can never agree with the `srcset`. ~91 KB is burned on the LCP path for nothing.

**The whole media manifest ships to the browser.** `app/media/fallback.ts` does a top-level `import manifest from '.../manifest.json'` (188 KB on disk) to build a path→path map. The bundler cannot tree-shake it — the map is computed at runtime. Verified present in the main client chunk:

| | raw | gzip |
|---|---:|---:|
| What ships | 131,809 B | 21,940 B |
| What is actually needed | 14,415 B | 1,350 B |
| **Wasted** | **117,394 B** | **20,590 B** |

That is ~17% of the 118 KB gzipped main chunk, and it consists of SHA-256 checksums, local build paths (`public/images/banner_home.jpg`), and upload timestamps. Worse: `fallbackPaths` is **only consulted when `USE_SUPABASE_MEDIA=false`**. In production it is `true`, so this payload is 100% dead weight.

### 5. The site cannot capture a lead

`app/pages/lien-he.vue` `submitForm()` sets `window.location.href = 'mailto:...'`. There is no backend, no persistence, no validation beyond HTML `required`, no spam protection, and **no analytics or conversion tracking anywhere in the codebase**.

For a B2B contractor whose entire funnel is "owner sends drawings → we quote", this means: mobile users without a configured mail client silently fail; no lead is ever recorded; no campaign can be attributed; and the "Get a quote within 24h" CTA — repeated on all eight pages — resolves to an unmonitored Gmail address. The page even admits it in the UI copy. **This is the largest business gap and it is not a technical limitation; it is an unimplemented feature.**

---

## Also verified, and material

| Area | Finding | Evidence |
|---|---|---|
| Design system | `.text-hero` / `.text-section-title` sit in `@layer base`; `h1`/`h2` sit in `@layer components`. Later layer wins. The fluid type scale **never applies**. `<h1 class="text-hero">` computes to `60px`; the clamp intends `76px`. | Layer walk of `entry.css` + `getComputedStyle` |
| Typography | 45 elements use `font-black` (900). Only Inter 400/500/600/700 are loaded — **no 900 face exists**, so every heading is browser-synthesised faux-bold. 32 italic faces ship; zero italics are used. No font preload. | `document.fonts` inspection |
| Brand | `logo-white.png` is **not white** — it is a navy + orange mark on transparency. It is used in the footer (`bg-ink-950`) and over the dark hero, where the navy wordmark is barely legible. `favicon.png` is a byte-identical, unreferenced duplicate. An actual SVG logo (`AppLogo.vue`) exists and is unused. | sha256 + pixel analysis + screenshots |
| Hero | The homepage overlay (`from-wood-950/86` + a second gradient) veils the interior photograph almost completely. For an interior company, the photo *is* the product. | Mobile screenshot |
| SEO | No `robots.txt`, no `sitemap.xml`, no `canonical`, no `og:url`, no `og:type`, no `og:site_name`, no JSON-LD, no `hreflang`. Eleven case studies with rich structured content and zero `Article`/`LocalBusiness` markup. | 404s + zero occurrences in rendered HTML |
| Security | **Zero** security headers (`CSP`, `X-Content-Type-Options`, `Referrer-Policy`, `HSTS`, `X-Frame-Options`, `Permissions-Policy`). `x-powered-by: Nuxt` disclosed. | Response header dump |
| Security (good) | No secret leaks. `SUPABASE_SERVICE_ROLE_KEY` scanned against all 440 build artefacts: **absent**. `assertNotCI()` correctly refuses uploads in CI. | Full `.output/` scan |
| Accessibility | Three real contrast failures on small text: `text-white/42` (4.05:1), `text-white/45` (4.49:1), `text-ink-400` (3.49:1) — all need 4.5:1. Mobile menu has no `role="dialog"`, no focus trap, no `Esc`, no `aria-expanded`. 13 tap targets under 44 px. | WCAG maths + DOM measurement |
| Accessibility (good) | The `:focus-visible` ring genuinely clears 3:1 on every surface it is used against (4.13–4.63:1). The code comment claiming this is **accurate**. | Contrast computation |
| Dead code | `motion` (a *production* dependency) is never bundled — its only consumer, `useScrollReveal.ts`, is unreferenced. `@nuxtjs/device` is a dependency that isn't even registered as a module. `TemplateMenu.vue` (starter leftover) is the **only** consumer of `@nuxt/ui` components. Plus ~10 dead exports. | Bundle grep + reference count |
| Docs | `README.md` is still the **unmodified Nuxt starter template**, advertising `starter-template.nuxt.dev`. | Read |

---

## What is genuinely good

Worth stating plainly, because it should not be refactored away:

- **The media pipeline.** Content-addressed, checksummed, immutable, resumable, schema-versioned, CI-guarded. `scripts/media/upload.ts` correctly distinguishes `upload`/`skip`/`resume`/`conflict` and checkpoints after every asset. `assertNotCI()` is exactly right.
- **The business/media separation.** `catalog.generated.ts` owns paths and dimensions; `projects.ts` owns copy; `withAlt()` joins them at the presentation boundary. The comments explaining *why* are unusually good.
- **`docs/media-migration/`.** Five phase documents including a forward-looking Phase 5 that correctly identifies `ProjectMediaId ≡ folder name` as a future primary-key problem. This is the kind of document most teams never write.
- **CI hygiene.** Lint, media guard, unit tests, and typecheck all run and all pass cleanly.
- **`scripts/check-media-literals.mjs`.** A cheap, targeted guard that actually enforces the architecture boundary it claims to.

The team clearly knows how to build things well. The gap is that **this discipline was applied to the infrastructure layer and not yet to the product layer.**

---

## Recommended sequence

| Horizon | Focus | Why this order |
|---|---|---|
| **Quick wins** (< 1 day) | Soft 404 · robots + sitemap · canonical/OG · lazy-load the fallback map · fix the CSS layer inversion · delete dead deps and code | Each is independent, low-risk, and unblocks indexing or removes weight. |
| **Short term** (1–3 days) | Real contact form + analytics · hero preload/`srcset` reconciliation · catalog-drift CI check · contrast + mobile-menu a11y · logo assets | Restores lead capture and closes the regressions that let the drift happen. |
| **Medium term** (~1 week) | `/en` URL-based i18n with `hreflang` · finish the translations · JSON-LD (`LocalBusiness`, `Article`) · prerender project pages | Turns the site into something search engines can fully consume. |
| **Long term** (multi-week) | Design-system consolidation · CMS / media database (Phase 5) · gallery lightbox · testimonials & trust signals | Compounding value once the foundation is correct. |

Full breakdown in **Report 10 — Improvement Roadmap** and **Report 11 — Prioritized TODO Checklist**.

---

## Confidence notes

Every finding above was verified by execution. Two items are explicitly **lower confidence** and are labelled as such in the detailed reports:

1. **`og:image` becomes a relative URL when `USE_SUPABASE_MEDIA=false`** — reasoned from `buildMediaUrl()`, not observed, because the local `.env` has the flag set to `true`. Verify by building with the flag off and reading `og:image`.
2. **Non-reactive `project` lookup in `[slug].vue`** — likely safe today because `NuxtPage` keys on route, but it is a latent trap. Verify by client-side navigating between two related projects.
