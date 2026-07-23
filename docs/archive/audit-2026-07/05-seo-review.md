# Report 5 — SEO Review

Verified against the rendered HTML of a production build.

## Inventory

| Signal | Status | Evidence |
|---|---|---|
| `<title>` | ✅ per-page, keyword-rich, bilingual | `company.seo.*.title` |
| `<meta name=description>` | ✅ per-page | `company.seo.*.description` |
| `og:title` / `og:description` | ✅ | all 8 pages |
| `og:image` | ✅ absolute Supabase URL | `…/media/brand/banner-home.webp` |
| `twitter:card` | ✅ `summary_large_image` | set once in `app.vue` |
| `<html lang>` | ⚠️ always `vi` in prerendered HTML | see S2 |
| **`rel=canonical`** | ❌ **absent** | 0 occurrences |
| **`og:url`** | ❌ **absent** | 0 occurrences |
| **`og:type`** | ❌ **absent** | 0 occurrences |
| **`og:site_name`** | ❌ **absent** | 0 occurrences |
| **`hreflang`** | ❌ **absent** | 0 occurrences |
| **JSON-LD structured data** | ❌ **absent** | 0 occurrences |
| **`robots.txt`** | ❌ **404** | `curl /robots.txt` → 404 |
| **`sitemap.xml`** | ❌ **404** | `curl /sitemap.xml` → 404 |
| Unknown project URL | ❌ **HTTP 200** | see S1 |

Heading outline on `/`: `1× h1, 6× h2, 22× h3, 3× h4`. Structurally sound — one `h1`, no skipped levels within a section.

---

## S1 — Unknown project URLs return HTTP 200 (soft 404)

**Severity: Critical** · Difficulty: Trivial · ~1h · **Highest ROI fix in the repository**

```console
$ for u in /du-an/nha-anh-nam /du-an/this-project-does-not-exist /khong-ton-tai; do
    curl -s -o /dev/null -w "%{http_code}  $u\n" localhost:3000$u; done
200  /du-an/nha-anh-nam
200  /du-an/this-project-does-not-exist    ← should be 404
404  /khong-ton-tai                        ← Nuxt's own handler, correct
```

`app/pages/du-an/[slug].vue:106` renders a bespoke "Project not found" page inside a `v-if="!project"` branch, but never sets the response status:

```vue
<template v-if="!project">
  <section class="min-h-screen px-6 py-32">
    <p class="text-8xl font-black text-wood-500">404</p>
    …
```

The body says 404. The HTTP status says 200.

**Consequences.**

- Google indexes an **unbounded space of URLs**. Any typo, any stale backlink, any crawler-invented path becomes a "valid" thin page duplicating the 404 content.
- Those pages compete with — and dilute — the eleven real case studies, which are the company's entire portfolio proof.
- Search Console will eventually flag this as *"Soft 404"* and may deindex legitimate `/du-an/*` URLs alongside it.
- With no `canonical` (S3) there is nothing to consolidate the duplicates.

**Fix.** Delete the hand-rolled branch and raise a real error, letting Nuxt's `error.vue` render it:

```ts
const project = projects.find(item => item.slug === slug)

if (!project) {
  throw createError({ statusCode: 404, statusMessage: 'Project not found', fatal: true })
}
```

Everything below in the template then unconditionally has `project`, which also removes the `project?.` optional chaining throughout the file and the `?? siteImages.bannerHome` hero fallback.

**Do this together with prerendering `/du-an/**` (Report 4, P4)** — once every real slug is a static file, an unknown slug never reaches the page component at all.

---

## S2 — Two languages share one URL. The English site cannot be indexed.

**Severity: Critical** · Difficulty: High · ~1 week · *see Report 2, A3*

Locale is a cookie (`lai-huy-locale`), resolved at render time by `useLanguage()`. There is one URL per page.

```console
$ curl -H 'Cookie: lai-huy-locale=en' localhost:3000/ | grep -o '<html  lang="[a-z]*"'
<html  lang="vi"
$ curl -H 'Cookie: lai-huy-locale=en' localhost:3000/ | grep -o '<title>[^<]*'
<title>Thi công &amp; sản xuất nội thất khách sạn 3-5 sao | Lai Huy Interior
```

The prerendered HTML is Vietnamese regardless of cookie. Googlebot does not send cookies. **Therefore no English content on this site is discoverable by any search engine.** The English strings in `projects.ts`, `company.ts`, and `ui.ts` — a substantial translation investment — return zero SEO value today.

Secondary effects:

- `lang="vi"` is served to English readers (a WCAG 3.1.1 failure and a screen-reader pronunciation bug).
- Hydration mismatch on every prerendered page for `en` users (Report 4, P8).
- The one SSR route (`/du-an/[slug]`) *does* vary by cookie but sends **no `Vary: Cookie`**. It avoids serving the wrong language from a shared cache only because it also sends `Set-Cookie`, which makes it uncacheable.

**Fix.** URL-based locales. `@nuxtjs/i18n` with `strategy: 'prefix_except_default'` yields `/` (vi) and `/en/…`. Then:

- prerender **both** locale trees → correct `lang` in static HTML, no hydration mismatch
- emit `<link rel="alternate" hreflang="vi" href="…">`, `hreflang="en"`, and `hreflang="x-default"`
- keep the cookie only as a *first-visit redirect hint*, never as the render input

**Prerequisite:** finish the translations first (Report 2, A4) — 64% of `/gioi-thieu` is still Vietnamese in `en` mode. Shipping `/en/gioi-thieu` as a mostly-Vietnamese page is worse than not shipping it.

---

## S3 — No canonical URLs

**Severity: High** · Difficulty: Low · ~2h

Zero `rel="canonical"` tags site-wide. The site is therefore defenceless against:

- trailing-slash duplicates (`/du-an` vs `/du-an/`)
- protocol/host duplicates (`www` vs apex, http vs https)
- query-string duplicates (`?utm_source=…`, `?fbclid=…` — inevitable given the Facebook link in the footer)
- the soft-404 duplicates from S1

**Fix.** Add a site URL to `runtimeConfig.public` and emit a canonical in `app.vue`:

```ts
const route = useRoute()
const { siteUrl } = useRuntimeConfig().public
useHead({
  link: [{ rel: 'canonical', href: () => `${siteUrl}${route.path}` }]
})
```

Then add `og:url`, `og:type` (`website` / `article` on `[slug]`), and `og:site_name` in the same place. These are three lines and they are currently all missing.

---

## S4 — No `robots.txt`, no `sitemap.xml`

**Severity: High** · Difficulty: Low · ~2h

```console
$ curl -o /dev/null -w '%{http_code}' localhost:3000/robots.txt   → 404
$ curl -o /dev/null -w '%{http_code}' localhost:3000/sitemap.xml  → 404
```

`public/` contains only four PNGs. Neither file exists anywhere.

Without a sitemap, the eleven project pages — which are **not linked from any prerendered page except `/du-an`**, and which are not prerendered themselves (Report 4, P4) — depend entirely on crawl discovery.

**Fix.** Install `@nuxtjs/sitemap` and `@nuxtjs/robots` (or hand-write both). The project slugs are already a compile-time constant:

```ts
// server/routes/sitemap.xml.ts — or let @nuxtjs/sitemap do it
import { projects } from '~/data/projects'
const urls = ['/', '/du-an', '/nha-xuong', '/dich-vu', '/gioi-thieu', '/tuyen-dung', '/lien-he',
              ...projects.map(p => `/du-an/${p.slug}`)]
```

`robots.txt` should reference the sitemap and — critically — nothing should be disallowed once S1 is fixed.

---

## S5 — No structured data, on a site that is a textbook candidate for it

**Severity: High** · Difficulty: Medium · ~1 day · *highest untapped SEO value*

Zero `application/ld+json`. Yet `app/data/` already contains, in typed form, everything three schema types need:

**`LocalBusiness` / `HomeAndConstructionBusiness`** — from `company.ts`:
`name`, `telephone`, `email`, `sameAs` (Facebook), two `address` entries with map URLs, `openingHours` (`workingHours`), `areaServed` (`markets`), `logo`.
This is what drives the Google Business panel and local-pack eligibility. The company has **two physical locations** (office in Tây Ninh, factory in Vĩnh Long) and neither is marked up.

**`Article` / `CreativeWork`** per project — from `projects.ts`:
`name`, `description`, `image` (the whole gallery), `dateCreated` (`year`), `locationCreated` (`location`), `material` (`content.materials`), `about` (`category`).
Eleven rich case studies with `overview`, `challenge`, `solution`, `designHighlights`, `materials`, `craftsmanship`, `experience` — narrative depth most competitors do not have, invisible to structured search.

**`BreadcrumbList`** — `/` → `/du-an` → `/du-an/{slug}`. Trivial, and it renders breadcrumbs in the SERP.

**`JobPosting`** — `careers.ts` has six jobs with `title`, `location`, `type` (`Toàn thời gian` → `FULL_TIME`), `description`, `requirements`. This makes them eligible for **Google Jobs**, for free. (Note the location inconsistency flagged in Report 2, A8 — fix that first, since `JobPosting` requires a valid `jobLocation`.)

**Fix.** A single `useJsonld` composable + one `<script type="application/ld+json">` per page. `LocalBusiness` in `app.vue`, `Article`+`BreadcrumbList` in `[slug].vue`, `JobPosting` in `tuyen-dung.vue`.

---

## S6 — `og:image` is probably relative in fallback mode

**Severity: Medium** · **Confidence: Medium — reasoned, not observed** · Difficulty: Trivial

Every page does `ogImage: mediaUrl(company.seo.*.ogImage.path)`. `buildMediaUrl` returns:

```ts
if (!context.useSupabaseMedia) {
  const fallback = context.fallbackPaths?.get(path)
  if (fallback) return fallback          // ← "/images/banner_home.jpg" — a relative path
}
return storageObjectUrl(context.supabaseUrl, target)   // absolute
```

With `NUXT_PUBLIC_USE_SUPABASE_MEDIA=false`, `og:image` becomes `/images/banner_home.jpg`. **The Open Graph spec requires an absolute URL**; Facebook, LinkedIn, and Zalo will all fail to render the card.

I could not observe this directly because the local `.env` has the flag set to `true` (verified: `og:image` resolved to `https://…supabase.co/…/banner-home.webp`).

**To confirm:** build with `NUXT_PUBLIC_USE_SUPABASE_MEDIA=false` and read `og:image` from `/index.html`.

**Fix regardless.** Absolutise OG images at the point of use: `` ogImage: `${siteUrl}${mediaUrl(path)}` `` when the result starts with `/`. This becomes free once `siteUrl` exists for S3.

---

## S7 — Weak internal linking

**Severity: Medium** · Difficulty: Low · ~half day

- The footer's **"Services" column is a plain `<ul>` of five service names, not links** (`app.vue:282-289`). Five keyword-rich anchor opportunities to `/dich-vu`, discarded on every page.
- `[slug].vue` discusses materials, scope, and craftsmanship at length but never links to `/dich-vu` or `/nha-xuong`.
- `du-an/index.vue` links out to project pages, but no project page links laterally except through `relatedProjects` (max 3).
- The `machinery` and `productionWorkflow` sections appear on both `/` and `/nha-xuong` with identical copy — near-duplicate content across two indexed pages. Consider trimming the homepage version to a summary that links through.

---

## S8 — Keyword and content observations

The `seo` blocks in `company.ts` are genuinely well written: natural Vietnamese, specific ("khách sạn 3-5 sao", "xưởng sản xuất trực tiếp"), and each page targets a distinct intent. `projects.ts` even carries curated `seo.keywords` per project. This is above average.

Gaps:

- **`keywords` is only emitted on `[slug]`** (`useSeoMeta({ keywords: seoKeywords })`). Google ignores the meta keywords tag entirely; the *content* of those keywords should instead appear in headings and body copy. Harmless, but it is doing nothing.
- **No local-SEO surface.** Two addresses, a phone number, and working hours exist in `company.ts` but appear only as footer text. No `LocalBusiness` markup (S5), no Google Business Profile link, no embedded map (the contact page shows a **static screenshot image** of a map that links out).
- **`h2` on `/du-an` project cards** (`du-an/index.vue:121`) — every card title is an `h2`, so the listing page has ~11 `h2`s and no descriptive section heading. Consider `h3` under a single `h2` "Dự án".
- **Image `alt` text is uniform per project.** `projectImages(mediaId, project.name)` gives **every image in a gallery the same alt text** — the project name. A 30-image gallery therefore has 30 identical `alt`s. The `MediaAsset` type deliberately excludes copy, so per-image alt would need a business-layer map keyed by path. Worth doing for the flagship projects at least.

---

## Priority summary

| ID | Issue | Severity | Effort | Business value |
|---|---|---|---|---|
| S1 | Soft 404 on unknown project slugs | **Critical** | 1h | **Very high** |
| S2 | Cookie i18n → English unindexable, `lang` wrong | **Critical** | 1w | **Very high** |
| S4 | No `robots.txt` / `sitemap.xml` | High | 2h | High |
| S3 | No canonical / `og:url` / `og:type` | High | 2h | High |
| S5 | No JSON-LD (`LocalBusiness`, `Article`, `JobPosting`) | High | 1d | **High** |
| S6 | `og:image` relative in fallback mode *(medium confidence)* | Medium | 15m | Medium |
| S7 | Footer services not linked; duplicate homepage/factory copy | Medium | 0.5d | Medium |
| S8 | Identical `alt` across a gallery; no local-SEO surface | Low | 0.5d | Low |

**Sequence.** S1 → S4 → S3 → S5 in the first week (these are all small and compounding). S2 is the large one and depends on completing translations (Report 2, A4) first.
