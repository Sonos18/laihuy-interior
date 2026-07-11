# Report 11 — Prioritized TODO Checklist

Ordered so that each item is safe to do independently, and earlier items make later ones easier. File references are exact.

**Priority key:** 🔴 Critical · 🟠 High · 🟡 Medium · 🟢 Low · ⚪ Nice to have

---

## 🔴 Critical — do this week

- [ ] **Return a real 404 for unknown project slugs.** `app/pages/du-an/[slug].vue:23` — replace the `v-if="!project"` branch (lines 106–126) with `throw createError({ statusCode: 404, statusMessage: 'Project not found', fatal: true })`. *Verified: `/du-an/this-project-does-not-exist` returns HTTP 200.* → **1h**
- [ ] **Prerender the project pages.** `nuxt.config.ts` — add `'/du-an/**': { prerender: true }` and `nitro.prerender.routes` from `projects.map(p => '/du-an/' + p.slug)`. Removes `Set-Cookie`, enables edge caching, makes the item above trivial. → **2h**
- [ ] **Regenerate `app/media/catalog.generated.ts`.** *Verified: `pnpm media:catalog` produces a 130-line diff; 59% of asset dimensions are stale.* → **15m**
- [ ] **Add CI guards** to `.github/workflows/ci.yml`:
  ```yaml
  - run: pnpm run build
  - run: pnpm media:catalog && git diff --exit-code app/media/catalog.generated.ts
  - run: pnpm audit --audit-level=high
  ```
  *CI currently never builds and never checks catalog freshness.* → **15m**
- [ ] **Assert dimensions in `tests/media.test.ts:193`,** not just path existence. *26 tests pass against a 59%-wrong catalog.* → **1h**
- [ ] **Add `robots.txt` and `sitemap.xml`.** *Verified: both return 404.* Slugs are a compile-time constant. → **2h**
- [ ] **Add `canonical`, `og:url`, `og:type`, `og:site_name`.** Introduce `runtimeConfig.public.siteUrl`. *Verified: zero occurrences of all four.* → **2h**

---

## 🟠 High — next 2 weeks

### Business / conversion

- [ ] **Build a real contact endpoint.** `server/api/contact.post.ts` + Zod validation + honeypot + Turnstile + rate limit + transactional email + persistence. Replace `window.location.href = 'mailto:…'` at `app/pages/lien-he.vue:77`. *The site cannot currently capture a lead.* → **2–3d**
- [ ] **Install analytics and error reporting.** *Verified: no GA, GTM, Plausible, Sentry, or RUM anywhere.* Nothing else on this list is measurable without it. → **1d**
- [ ] **Reconcile the addresses.** `app/data/careers.ts` says jobs are in Bến Tre / Long Hậu; `app/data/company.ts` says Tây Ninh / Vĩnh Long. Make `company.addresses` the source. *Blocks `JobPosting` markup.* → **0.5d**

### Performance

- [ ] **Stop the hero double-download.** Delete the hand-rolled `useHead` preloads (`app/components/AppHero.vue:23-32`, `app/pages/index.vue:45-54`) and pass `preload` to `<NuxtImg>` instead, so `imagesrcset`/`imagesizes` match. *Verified: the browser fetched both `1-2-w1600.webp` (91 KB, discarded) and `1-2.webp` (243 KB).* Also gives `[slug].vue` the preload it currently lacks. → **2h**
- [ ] **Generate `app/media/fallback.generated.ts`** in `scripts/media/catalog.ts`; delete the `import manifest from '.../manifest.json'` in `app/media/fallback.ts`. *Verified: 117,394 B raw / 20,590 B gzip of checksums and build paths ship to every browser and are never read in production.* → **2h**
- [ ] **Add a `2200` rung to `MEDIA_VARIANT_WIDTHS`** (`app/shared/media/constants.ts:18`), re-run `media:optimize && media:upload`. *Verified: `srcset` currently offers the 2560 px / 243 KB master at the `2048w` candidate, which is what a 1536 px / DPR 1.25 laptop selects.* → **1d**
- [ ] **Fix the font declaration.** Weights `[400,600,700,900]`, `styles: ['normal']`, include the `vietnamese` subset, preload the `h1` face. *Verified: 45 elements use `font-black` (900); only 400/600/700 load, so every heading is synthetic faux-bold. 32 unused italic faces are declared.* → **3h**

### Design / brand

- [ ] **Fix the CSS cascade-layer inversion.** `app/assets/css/main.css` — move `body`/`h1`–`h6` into `@layer base`, move `.btn-*`/`.text-hero`/`.text-section-title`/cards into `@layer components`, and **delete the `h1`/`h2`/`h3 { font-size }` rules**. *Verified: `.text-hero` is in `base`, `h1 { text-6xl }` is in `components`; later layer wins, so `<h1 class="text-hero">` renders at 60px instead of the intended 76px. Every fluid heading on the site is dead.* → **30m**
- [ ] **Adopt `app/components/AppLogo.vue`** (inline SVG, `currentColor`) in the header, mobile menu, and footer. *Verified: `logo-white.png` contains 0.0% near-white pixels — it is a navy+orange mark used on `bg-ink-950`, where it is barely legible. `favicon.png` is a byte-identical duplicate (`sha256 8f225e01…`) referenced nowhere.* Delete `public/favicon.png`. → **1d**
- [ ] **Lighten the hero overlays.** `app/pages/index.vue:71-73` stacks `from-wood-950/86 … to-wood-950/68` plus a second `/43` gradient — the interior photograph, which is the product, is nearly invisible. Hero copy sits at `text-white/86` (14.6:1), so there is ample contrast headroom. Same issue in `.hero-overlay` (`main.css:107`). → **2h**

### Security

- [ ] **Add security headers** via `routeRules` in `nuxt.config.ts`: `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, `Strict-Transport-Security`. Remove `x-powered-by: Nuxt`. *Verified: zero security headers on every response.* → **2h**
- [ ] **Confirm the Supabase `media` bucket allows anonymous `SELECT` only** (no anonymous `INSERT`/`UPDATE`/`DELETE`). Not visible from the repository. → **30m**
- [ ] **Delete `NUXT_PUBLIC_SUPABASE_KEY` from `.env`** or document it in `.env.example`. *Verified it does not reach the client, but it is undocumented drift.* → **10m**

### Accessibility

- [ ] **Fix three AA contrast failures.** `app/app.vue:353` `text-white/42` (4.05:1) → `/55`; `app/pages/du-an/[slug].vue:171` `text-white/45` (4.49:1) → `/55`; `[slug].vue:193` `text-ink-400` (3.49:1) → `text-ink-500` (5.41:1). All are small text needing 4.5:1. → **30m**
- [ ] **Make the mobile menu a dialog.** `app/app.vue:140-225` — add `role="dialog"`, `aria-modal`, `aria-expanded`/`aria-controls` on the trigger, focus trap, focus restore, `Escape` to close, `inert` on the background. *Verified: `aria-expanded` and `aria-controls` are both `null`.* Strongly consider `USlideover`. → **1d**
- [ ] **Add a skip link** to `#main` (`app/app.vue:227` already has `<main>`). Eleven header controls precede content on every page. → **15m**

### Mobile

- [ ] **`min-h-screen` → `min-h-dvh`** on `app/pages/index.vue:59,75` and `app/pages/du-an/[slug].vue:129,143`. *`100vh` exceeds the visible viewport on mobile Safari/Chrome, pushing the hero CTAs below the fold.* → **30m**
- [ ] **Raise 13 tap targets to 44 px.** Hamburger `p-2` → `p-2.5` (currently 40×46). Footer nav/contact links need `py-2` (currently 17–20 px tall). Locale pills `px-3 py-1.5` → `px-4 py-2.5` (currently ~34×28). → **2h**

---

## 🟡 Medium — next month

### SEO

- [ ] **Add JSON-LD.** `LocalBusiness` (two locations) in `app.vue`; `Article` + `BreadcrumbList` in `[slug].vue`; `JobPosting` in `tuyen-dung.vue` → Google Jobs eligibility. *All data already exists, typed, in `app/data/`.* Depends on the address reconciliation above. → **1d**
- [ ] **Absolutise `og:image` when `USE_SUPABASE_MEDIA=false`.** *Confidence: medium — reasoned from `buildMediaUrl`, not observed, because the local `.env` sets the flag to `true`. Verify by building with the flag off and reading `og:image` from `/index.html`.* → **30m**
- [ ] **Link the footer's "Services" column** (`app/app.vue:282-289`) to `/dich-vu`. Currently a plain `<ul>` of five keyword-rich strings that are not anchors. → **30m**
- [ ] **Give gallery images distinct `alt` text.** `projectImages()` assigns the project name to all 30 images of `khach-san-eo-gio`. → **0.5d**
- [ ] **Deduplicate the `machinery` / `productionWorkflow` copy** shared verbatim between `/` and `/nha-xuong`. → **0.5d**

### i18n *(strict order — do not invert)*

- [ ] **1. Require both languages.** `app/shared/types/localization.ts` → `LocalizedValue<T> = { vi: T; en: T }`. Let `tsc` enumerate the gaps. → **1h**
- [ ] **2. Translate the gaps** that `tsc` reports: `app/data/services.ts` (all), `app/data/factory.ts` (all), `app/data/careers.ts` (all), and 14 hardcoded strings in `app/pages/gioi-thieu.vue`. *Verified: 64% of the visible text on `/gioi-thieu` stays Vietnamese in EN mode.* → **2d**
- [ ] **3. Move to URL-based locales.** `@nuxtjs/i18n`, `prefix_except_default` → `/` + `/en/…`. Prerender both trees. Emit `hreflang` (`vi`, `en`, `x-default`). *Verified: prerendered HTML always ships `lang="vi"`, and the browser reports `Hydration completed but contains mismatches` for `en` users. No English content is indexable today.* → **1w**

  > **Do not ship step 3 before step 2.** Publishing `/en/gioi-thieu` under an `hreflang="en"` promise while it is 64% Vietnamese is worse than shipping nothing.

### Architecture / quality

- [ ] **Extract `CtaBanner`.** The dark CTA block is hand-written on **7** pages. Puts the conversion copy in one file. → **0.5d**
- [ ] **Extract `ProjectCard`.** Three drifted variants: `index.vue:228`, `du-an/index.vue:88`, `[slug].vue:404`. → **0.5d**
- [ ] **Extract `SectionHeader`** (~14 uses), **`MetricCard`** (×4), **`LocaleToggle`** (×2). → **1d**
- [ ] **Split `app/app.vue`** (373 lines) into `AppHeader` / `AppMobileMenu` / `AppFooter`. → **1d**
- [ ] **Unify the three heroes.** `index.vue` (bespoke), `AppHero.vue`, `[slug].vue` (bespoke) — three overlays, two height systems, one missing preload. Extend `AppHero` with a `size` prop and a metrics slot. → **1d**
- [ ] **Delete `heroMetrics`** (`app/pages/index.vue:27`); map over `factoryCapabilities` instead. *Two sources of truth for "3.000 m²", with different labels and different translation coverage.* → **1h**
- [ ] **Add `error.vue`** — branded, bilingual. Required once `createError` is used. → **0.5d**
- [ ] **Test the product layer.** `useLanguage` (`t`/`ta` fallbacks), `project-media`, `MediaImage`, `AppGalleryGrid`, and a route test asserting the 404 status. *All 26 existing tests cover only the media layer.* → **2–3d**
- [ ] **Harden `[slug].vue` reactivity.** `project`, `allImages`, `leadImage`, `galleryImages`, `relatedProjects` are computed once from a non-reactive `route.params` read (lines 19–79). *Confidence: medium — likely safe because `NuxtPage` keys on route, but verify by client-navigating between two related projects.* Wrap in `computed()` or set `definePageMeta({ key: … })` explicitly. → **30m**

### Design system

- [ ] **Merge `.metric-card` and `.industrial-card`** (they differ by one hover rule; `index.vue:176` re-implements the difference inline). → **1h**
- [ ] **Replace 12 hardcoded `text-3xl md:text-5xl` headings** with `.text-section-title` — *after* the layer fix. → **1h**
- [ ] **Normalise button sizing.** `app/app.vue:134` `btn-primary py-3` overrides the shared `py-3.5`. Encode as a `size` variant or remove. → **30m**
- [ ] **Settle the container padding rule.** `.section-spacing` supplies `px-6 md:px-8`, yet several sections add `px-6` again on `.section-shell`. → **1h**
- [ ] **Delete dead CSS.** `--color-wood`, `--color-warm` (`main.css:6-7`, unreferenced; `--color-warm` duplicates `wood-400`), `--animate-fade-in`, `--animate-fade-in-up` and their `@keyframes`. → **15m**

### Accessibility

- [ ] **Locale toggle:** add `role="group"`, `aria-pressed` per button, and `lang` attributes. *Currently `aria-label` sits on a `<div>` with no `role`, so AT ignores it; the active language is conveyed by background colour alone.* → **1h**
- [ ] **Add `aria-current="page"`** to active nav links and `aria-pressed` to the `/du-an` category filters; announce the filtered count via `aria-live="polite"`. → **1h**
- [ ] **Forms:** add `autocomplete="name|email|tel"`, `aria-invalid`, `aria-describedby` error regions, and an `aria-live` submit confirmation. Remove `resize-none` from the textarea. → **2h**
- [ ] **Move the `<span>` out of the `<h1>`** at `app/pages/index.vue:88` — it is a second sentence inflating the accessible name of the page's only `h1`. → **15m**
- [ ] **Use `<h3>` for project cards** on `/du-an` (`du-an/index.vue:121` produces 11 sibling `h2`s with no section heading). → **30m**
- [ ] **Run axe-core on all 8 routes**, plus a keyboard-only traversal and an NVDA/VoiceOver smoke test of the mobile menu and contact form. → **1d**

---

## 🟢 Low — cleanup

- [ ] **Delete dead dependencies:** `motion` and `@nuxtjs/device`, both in `dependencies`. *Verified: `motion` never reaches the bundle; `@nuxtjs/device` is not even registered in `modules`.* → **15m**
- [ ] **Delete dead files:** `app/composables/useScrollReveal.ts`, `app/components/TemplateMenu.vue`, `public/favicon.png`. → **15m**
- [ ] **Delete dead exports:** `factoryGallery` + `FactoryImage`; `company.{primaryCtas, markets, shortPositioning}`; `quoteMailto`; `uiText.labels.all`; `uiText.projectFacts.{rooms, duration, materials, fallbackMetric}`; `mediaPresets.thumbnail`; un-export `getProjectMedia`. → **1h**
- [ ] **Add `group` to `app/pages/index.vue:109`.** The `group-hover:translate-x-1` arrow at line 116 has no `group` ancestor and never animates. → **5m**
- [ ] **Extract `company.phoneHref`.** `` `tel:${company.phone.replaceAll(' ', '')}` `` is inlined 5× (`app.vue:126,302`, `index.vue:470`, `[slug].vue:372`). → **15m**
- [ ] **Deduplicate `storageObjectUrl`** (`app/media/url.ts:30`) and `publicObjectUrl` (`scripts/media/lib.ts:37`) — identical bodies. Move to `app/shared/media/`. → **30m**
- [ ] **Write a real README.** Document the media pipeline, `pnpm media:*`, `USE_SUPABASE_MEDIA`, `.env`, the gitignored `public/images/`, and "never hand-edit `catalog.generated.ts`". Link `docs/media-migration/`. *Currently the unmodified Nuxt starter template.* → **1h**
- [ ] **Untrack `.claude/projects/…/memory/feedback-round2.md`;** gitignore `.claude/`. → **10m**
- [ ] **Rename the `MediaImage` type** (`app/shared/media/types.ts:25`) to `RenderableImage` — it collides with the `MediaImage.vue` component inside that component's own SFC. → **30m**
- [ ] **Re-test whether `sizes="100vw"` still breaks `@nuxt/image` v2** (the workaround comment at `app/media/presets.ts:5-7`). If fixed, simplify the four identical breakpoint segments. → **30m**
- [ ] **Add `scroll-margin-top`** to section anchors to clear the 80 px fixed header. → **15m**
- [ ] **Throttle the scroll handler** at `app/app.vue:37-47` with `rAF`, or replace it with a sentinel `IntersectionObserver`. → **30m**

---

## ⚪ Nice to have

- [ ] Gallery lightbox + "show more" cut at ~12 images (`khach-san-eo-gio` renders 30 inline). → **2d**
- [ ] Trust signals: client logos, owner testimonials, completion years on cards, team photos, projects-completed counter. → **3d**
- [ ] Embedded interactive map on `/lien-he` (currently a static screenshot image linking out). → **0.5d**
- [ ] Lighthouse CI with a performance budget on every PR. → **2d**
- [ ] Split `app/data/projects.ts` (643 lines) into `data/projects/<slug>.ts` + barrel. → **2d**
- [ ] Decouple `ProjectMediaId` from the folder name — *before* the CMS. See `docs/media-migration/phase-5-roadmap.md` §D1. → **1w**
- [ ] CMS / media database (Phase 5). Marketing cannot change a phone number without a deploy. → **3–4w**
- [ ] Blog / insights section targeting long-tail Vietnamese hospitality-interior queries. → **ongoing**
- [ ] Evaluate Supabase Image Transformations — could retire the entire variant pipeline. Measure egress cost first. → **1w**
- [ ] Per-image `alt` text and `coverCrop` hints in `projects.ts` (several project covers are portrait and get hard centre-cropped to `aspect-[4/3]`). → **1d**

---

## The seven-item version

If only one day is available, in this order:

1. `createError` 404 in `[slug].vue` — **1h** — stops Google indexing an unbounded URL space
2. `pnpm media:catalog` + commit — **15m** — the file has been wrong for 130 lines
3. CI: `build` + catalog-drift check — **15m** — so #2 never recurs
4. Swap the two `@layer` blocks in `main.css` — **30m** — turns on the typography that was already designed
5. `robots.txt` + `sitemap.xml` — **2h** — the eleven case studies are currently undiscoverable
6. `<NuxtImg preload>` instead of the manual `useHead` preloads — **2h** — 91 KB off the LCP path
7. Generate `fallback.generated.ts` — **2h** — 20.6 KB gzip off every page load

**Total ≈ 8 hours.** Two of these are five-line changes.
