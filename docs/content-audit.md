# Content Architecture Audit — Lai Huy Interior

**Date:** 2026-07-05
**Scope:** Business-content completeness review of the current repository (pages, data, generated media catalog, filesystem). No code changes. No visual redesign.
**Source of truth:** the repository as it stands. Where business information is absent, this document reports **"Missing business input."** rather than inventing it.

> **How to read this:** every finding is anchored to a real file/line or a real data value. This document is intended to become the working checklist for the next content phase. Part 5 turns the findings into a phased plan.

---

## Executive summary — the five findings that matter most

1. **Bilingual shell, monolingual content.** The site has a working VI/EN toggle (`useLanguage`), and page *chrome* (nav, hero copy, section headings, SEO) is bilingual. But **all business data is Vietnamese-only** — every project (`projects.ts`), service (`services.ts`), job (`careers.ts`), and factory capability (`factory.ts`) is stored as a plain string, so `t()` returns Vietnamese for both locales. An English visitor sees Vietnamese project descriptions, service cards, and job posts. This is the single largest content gap.
2. **8 of 11 real project folders have no business entry; 3 business entries have no media.** The media library holds 11 projects (145 images); `projects.ts` describes 6. Only **3 line up** (Eo Gió, Codi Boutique Hotel, Codi Villa). 8 project folders (145−66 = ~79 images) are invisible to visitors, and 3 described projects (Anh Duy, Chily, Văn phòng Lai Huy) render with **no imagery**.
3. **~78 project images are unused**, while a handful of images are reused as heroes across 3–5 pages each (Eo Gió cover, `about-workspace`). The public site currently shows a small fraction of the delivered work.
4. **No SEO infrastructure for a bilingual site:** no `robots.txt`, no `sitemap.xml`, no i18n routing/hreflang, and **project detail pages (`/du-an/[slug]`) are not prerendered** (only the 7 top-level pages are). English content and project detail pages are effectively invisible to search engines.
5. **Placeholder/interim business data:** 5 of 6 projects have location `"Việt Nam"` (generic), all 6 share year `"2026"`, the contact form is mailto-only (no backend, no drawing upload), the map is a static image, and the only social channel is Facebook.

---

# PART 1 — WEBSITE AUDIT (page by page)

Public routes (all under `app/pages/`, 7 prerendered + 1 dynamic):

| Route | File | Prerendered |
|---|---|---|
| `/` | `index.vue` | ✅ |
| `/gioi-thieu` (About) | `gioi-thieu.vue` | ✅ |
| `/du-an` (Projects list) | `du-an/index.vue` | ✅ |
| `/du-an/[slug]` (Project detail) | `du-an/[slug].vue` | ❌ **not prerendered** |
| `/nha-xuong` (Factory) | `nha-xuong.vue` | ✅ |
| `/dich-vu` (Services) | `dich-vu.vue` | ✅ |
| `/tuyen-dung` (Careers) | `tuyen-dung.vue` | ✅ |
| `/lien-he` (Contact) | `lien-he.vue` | ✅ |

### 1.1 `/` — Home (`index.vue`)

- **Purpose:** Company positioning + funnel to projects, factory, and quote.
- **Data source:** `company` (tagline, positioning, seo.home), `factoryCapabilities`, `productionWorkflow`, `services`, `projects` (featured), `heroMetrics` (page-local array), `projectMedia['khach-san-eo-gio'].cover` (hero), `siteImages.aboutWorkspace`.
- **Components:** `NuxtImg`, `NuxtLink`, `Icon`. (Does not use `AppHero` — custom full-screen hero.)
- **Sections:** hero + metrics · factory capability · featured projects (3) · production workflow · services grid · workspace image + CTA.
- **Missing business info:** none blocking; the home page is the most complete page. No customer logos, testimonials, or trust signals (certifications/partners) — see Part 3.
- **Redundant:** `heroMetrics` (lines 18–19, page-local) largely restates `factoryCapabilities` values ("3.000 m²", "50 phòng/tháng", markets). `factoryCapabilities` also appears on About and Factory (3× site-wide).
- **Placeholder/demo:** none.
- **Broken relationships:** "Featured case studies" shows only the 3 projects that have `featured: true` **and** a `mediaId`. 8 real projects never surface.
- **Missing images:** none (hero + covers present).
- **Weak UX:** hero uses Eo Gió cover which is also the About hero and Projects-list hero (repetition across the funnel).
- **SEO:** `useSeoMeta` sets title/description/og + `twitterCard` (only page that sets Twitter card). No `ogType`, `ogUrl`, canonical. English content is client-toggle only (not a separate indexable URL).
- **Accessibility:** hero has meaningful `alt`; metrics readable. Decorative overlays are divs (fine).
- **Opportunity:** surface more than 3 projects; add trust signals; de-duplicate hero imagery.

### 1.2 `/gioi-thieu` — About (`gioi-thieu.vue`)

- **Purpose:** Company positioning, values, quality narrative.
- **Data source:** `company.positioning`, `factoryCapabilities`, `qualityControl`, `siteImages.companyStory`, `projectMedia['khach-san-eo-gio'].cover` (hero). Plus a **page-local `values` array (lines 13–32).**
- **Components:** `AppHero`, `NuxtImg`, `Icon`.
- **Sections:** hero · story (positioning) · capability metrics · values (3) · quality control · CTA.
- **Missing business info:** No founding year / company history / timeline; no team; no explicit **Vision** or **Mission** (only "positioning" + "values"); no certifications/partners. → **Missing business input** for history, team, vision/mission-as-such.
- **Redundant:** reuses `factoryCapabilities` **and** `qualityControl` — both also on the Factory page, making About and Factory overlap heavily.
- **Placeholder/demo:** none, but content is thin (mostly reused blocks).
- **Broken relationships:** none.
- **Missing images:** only 2 images (companyStory + hero); no team/workshop/story imagery beyond that.
- **Weak UX:** **This page is the least bilingual on the site** — hero props (`topic`/`title`/`special-title`/`subtitle`, lines 49–52), the `values` array, and every section heading are **hardcoded Vietnamese strings**, not `t({vi,en})`. English visitors get an all-Vietnamese About page.
- **SEO:** title/description bilingual via `seo.about`; page body not.
- **Accessibility:** `companyStory` image has alt; icons decorative.
- **Opportunity:** localize the page; add real About content (history, vision/mission, team); stop duplicating Factory blocks.

### 1.3 `/du-an` — Projects list (`du-an/index.vue`)

- **Purpose:** Filterable case-study index.
- **Data source:** `projects`, `company.seo.projects`, `projectMedia` covers via `getProjectMedia`.
- **Components:** `AppHero`, `NuxtImg`, `NuxtLink`, category filter buttons.
- **Sections:** hero · category filter · project grid · CTA.
- **Missing business info:** the grid iterates all 6 `projects` entries, but **cards for Anh Duy / Chily / Văn phòng Lai Huy render with no cover** (`v-if="cover"` hides the image) because they have no `mediaId`. → visibly incomplete cards.
- **Redundant:** none.
- **Placeholder/demo:** the visible filter is `categoryOptions` (page-local, bilingual) and the `categories` computed **auto-hides any option with zero matching projects** (lines 57–61) — so `Căn hộ` (apartment) and `Khác` (other) don't currently render. No filter bug. Separately, **`projectCategories` exported from `projects.ts` (lines 3–11) is dead code — imported nowhere.**
- **Broken relationships:** filter option `townhouse`→`segment==='house'`; `commercial`→`office||commercial`. Works, but 8 real project folders are absent entirely (they have no `projects.ts` entry to match on).
- **Missing images:** 3 of 6 cards imageless (above).
- **Weak UX:** hero reuses Eo Gió image (also home hero). Only 3 of 11 real projects shown.
- **SEO:** bilingual title/description; individual project pages not linked into prerender (see 1.4).
- **Accessibility:** covers have `:alt="t(project.name)"`.
- **Opportunity:** connect the 8 orphan projects; hide empty category filters; give the list real breadth.

### 1.4 `/du-an/[slug]` — Project detail (`du-an/[slug].vue`)

- **Purpose:** Full case study (facts, overview/challenge/solution, gallery, related).
- **Data source:** `projects.find(slug)`, `projectCover`/`projectImages`, `siteImages.bannerHome` (fallback), `uiText`.
- **Components:** `NuxtImg` (hero + related), `MediaImage` (gallery), `Icon`, `NuxtLink`.
- **Sections:** hero · facts · overview/challenge/solution · scope/materials · gallery · related · CTA. (404 state handled.)
- **Missing business info:** for Anh Duy / Chily / office, `getProjectImage` falls back to `siteImages.bannerHome` and `allImages` is `[]` → **hero shows the generic banner and the gallery section is empty**. Only 3 slugs have real galleries.
- **Redundant:** none.
- **Placeholder/demo:** `getProjectMetric`/facts fall back to generic labels when `rooms`/`duration`/`area` are missing (only Eo Gió has rooms + duration).
- **Broken relationships:** **This route is not prerendered** (`nuxt.config.ts` routeRules cover only the 7 top-level pages; no `crawlLinks`). Detail pages render via SSR only and are absent from the static output.
- **Missing images:** 3 of 6 project pages have no gallery.
- **Weak UX:** empty gallery on 3 projects; heavy pages (up to 30 images) with no lazy-batching beyond `MediaImage` presets.
- **SEO:** builds `useSeoMeta` inline (good), but no prerender/sitemap → poor discoverability; no `ogType: article`.
- **Accessibility:** gallery uses `MediaImage` with alt = project name for every image (all gallery images share one alt — acceptable but not descriptive).
- **Opportunity:** prerender detail routes (or a payload route); per-image alt; connect orphan projects so their detail pages exist.

### 1.5 `/nha-xuong` — Factory (`nha-xuong.vue`)

- **Purpose:** Manufacturing capability proof.
- **Data source:** `factoryCapabilities`, `machinery`, `productionWorkflow`, `qualityControl`, `workshopMedia` (11 images), `siteImages.aboutWorkspace` (hero), `company.seo.factory`.
- **Components:** `AppHero`, `MediaImage` (workshop gallery), `Icon`.
- **Sections:** hero · capabilities · machinery (7) · workflow (6) · quality control · **workshop gallery (11, now wired from `company/workshop`)**.
- **Missing business info:** machinery/workflow/QC are Vietnamese-only (data strings). No plant photos beyond the 11 workshop images; no certifications (ISO/quality standards) named.
- **Redundant:** shares `factoryCapabilities` + `qualityControl` + `productionWorkflow` with Home and About.
- **Placeholder/demo:** `factoryGallery` in `factory.ts` is now **dead code** (`= []`, no longer imported anywhere) — the page uses `workshopMedia` directly.
- **Broken relationships:** none (workshop wiring verified).
- **Missing images:** workshop gallery good (11). Machinery section has **no per-machine photos** (icon/text only).
- **Weak UX:** workshop gallery uses a generic shared alt for all 11 images.
- **SEO:** bilingual title/description.
- **Accessibility:** workshop images carry a generic localized alt.
- **Opportunity:** localize machinery/workflow data; add per-machine imagery; name real certifications if any (**Missing business input** until provided).

### 1.6 `/dich-vu` — Services (`dich-vu.vue`)

- **Purpose:** Service catalogue (6 services).
- **Data source:** `services` (6), `company.seo.services`, `projectMedia['codi-boutique-hotel'].cover` (hero).
- **Components:** `AppHero`, `Icon`, `NuxtLink`.
- **Sections:** hero · intro · 6 service cards (each with 3 detail bullets) · "send drawings" CTA.
- **Missing business info:** no pricing/engagement model, no per-service project examples/links, no downloadable capability profile.
- **Redundant:** the 6 services also appear (title + description only) on the Home services grid.
- **Placeholder/demo:** none.
- **Broken relationships:** services don't link to representative projects.
- **Missing images:** service cards are **icon-only** (no imagery per service).
- **Weak UX:** page chrome bilingual, but **`services.ts` content (title/description/details) is Vietnamese-only** → English cards show Vietnamese.
- **SEO:** bilingual title/description.
- **Accessibility:** check icons decorative; card structure semantic (`h3` + `ul`).
- **Opportunity:** localize service data; link each service to a real project; add per-service imagery.

### 1.7 `/tuyen-dung` — Careers (`tuyen-dung.vue`)

- **Purpose:** Recruitment (6 openings + benefits).
- **Data source:** `jobs` (6), `careerBenefits` (4), `company.seo.careers`, `company.email`, `siteImages.aboutWorkspace` (hero).
- **Components:** `AppHero`, `Icon`, `a[mailto]`.
- **Sections:** hero · environment + benefits · open positions (6) · apply CTA.
- **Missing business info:** **no dedicated recruitment email** — the page explicitly states (line 118) applications reuse the company contact email. No salary ranges, no application form, no per-role contact.
- **Redundant:** benefits overlap with About "values".
- **Placeholder/demo:** the "email shared with company contact" note is an interim disclosure.
- **Broken relationships:** none.
- **Missing images:** only the hero (reused workspace image).
- **Weak UX:** page chrome bilingual, but **`jobs`/`careerBenefits` are Vietnamese-only** → English job posts show Vietnamese. Apply = mailto (no tracked applications).
- **SEO:** bilingual title/description; no JobPosting structured data.
- **Accessibility:** cards semantic.
- **Opportunity:** localize jobs; add a real application channel; JobPosting schema.

### 1.8 `/lien-he` — Contact (`lien-he.vue`)

- **Purpose:** Lead capture + company coordinates.
- **Data source:** `company.addresses` (2), `company.phone`, `company.email`, `company.workingHours`, `siteImages.mapAddress`, `projectMedia['nha-vuon-chily'].cover` (hero), `uiText`.
- **Components:** `AppHero`, `NuxtImg`, `form` (mailto), contact cards, map link.
- **Sections:** hero · contact cards (office, factory, phone, email, hours) · form + map.
- **Missing business info:** no Zalo/WhatsApp (common in VN B2B), no secondary phone, no business registration/tax ID, no company map **place** (only a Google Maps *search query* URL, not an embed or place link).
- **Redundant:** addresses shown in both contact cards and the map column, and again in the footer.
- **Placeholder/demo:** form is **mailto-only** — honestly disclosed (line 148) but no backend capture, **no file/drawing upload** despite "send drawings/BOQ" CTAs across the site.
- **Broken relationships:** map is a **static image** (`map-address.webp`) linking to a search URL — not an interactive/embedded map.
- **Missing images:** map is a screenshot, not a live map.
- **Weak UX:** no submission confirmation (leaves the site to the mail client); no spam protection.
- **SEO:** bilingual title/description; no `LocalBusiness`/`Organization` structured data with address/geo.
- **Accessibility:** form inputs use `<label>` wrappers with visible text ✅; `required` set; consider `aria-describedby` for the mailto note.
- **Opportunity:** real form backend + file upload; embedded map; LocalBusiness schema; add Zalo.

---

# PART 2 — PROJECT DATA AUDIT

Cross-reference of `public/images/projects/` (filesystem, via the generated catalog) against `app/data/projects.ts` (business).

- **Filesystem project folders:** 11 · **Business entries:** 6 · **Fully connected (folder + entry + `mediaId`):** 3.

### 2.1 Connection matrix

| Folder (media id) | Folder | Business entry | Media linked (`mediaId`) | Cover | Gallery (imgs) |
|---|---|---|---|---|---|
| `khach-san-eo-gio` | ✅ | ✅ id 1 | ✅ | ✅ | ✅ 30 (7 sub-galleries) |
| `codi-boutique-hotel` | ✅ | ✅ id 2 | ✅ | ✅ | ✅ 20 (4 sub) |
| `codi-villa-phan-thiet` | ✅ | ✅ id 3 | ✅ | ✅ | ✅ 16 (flat) |
| `cai-tao-nha-quan-8` | ✅ | ❌ | ❌ | (catalog only) | 5 (flat) — unused |
| `nha-anh-nam` | ✅ | ❌ | ❌ | (catalog only) | 9 — unused |
| `nha-ta-dung` | ✅ | ❌ | ❌ | (catalog only) | 7 — unused |
| `nha-vuon-chily` | ✅ | ❌ | ❌ | used as **Contact hero** only | 26 — 25 unused |
| `nha-xuong-anh-cuong` | ✅ | ❌ | ❌ | (catalog only) | 3 — unused, **weak gallery** |
| `phong-giam-doc` | ✅ | ❌ | ❌ | (catalog only) | 10 — unused |
| `phong-hop-quan-7` | ✅ | ❌ | ❌ | (catalog only) | 10 — unused (mixed room prefixes) |
| `van-phong-quan-4` | ✅ | ❌ | ❌ | (catalog only) | 9 — unused |
| **(no folder)** `nha-pho-anh-duy` | ❌ | ✅ id 4 | ❌ | ❌ | ❌ |
| **(no folder)** `nha-pho-chily` | ❌ | ✅ id 5 | ❌ | ❌ | ❌ |
| **(no folder)** `khong-gian-van-phong-lai-huy` | ❌ | ✅ id 6 | ❌ | ❌ | ❌ |

> Per the earlier business rule (do not speculate about missing folders): the business entries **Anh Duy**, **Chily**, and **Văn phòng Lai Huy** have **no matching folder**. A folder `nha-vuon-chily` exists but is **not assumed** to be "Nhà phố Chily" — that link requires business confirmation, not inference.

### 2.2 Field-by-field for the 3 connected + 3 orphan-entry projects

Legend: value shown = present (VI-only unless noted); ✗ = missing.

| Field | Eo Gió (id1) | Codi Hotel (id2) | Codi Villa (id3) | Anh Duy (id4) | Chily (id5) | Office (id6) |
|---|---|---|---|---|---|---|
| Title / name | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Subtitle (`title` field) | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ (none use it) |
| shortDescription | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| description (long) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Project type (segment) | hotel | hotel | villa | house | house | office |
| Location | **Bến Tre** | `Việt Nam`* | `Việt Nam`* | `Việt Nam`* | `Việt Nam`* | `Việt Nam`* |
| Area | ✅(desc) | ✅(desc) | ✅(desc) | ✅(desc) | ✅(desc) | ✅(desc) |
| Completion year | 2026 | 2026 | 2026 | 2026 | 2026 | 2026 |
| Services (scope) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Style | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Materials | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| rooms | ✅ 50 | ✗ | ✗ | ✗ | ✗ | ✗ |
| duration | ✅ 60 ngày | ✗ | ✗ | ✗ | ✗ | ✗ |
| client | ✅ | ✅ | ✅ | ✅ | ✅ | **✗** |
| SEO (detail) | inline | inline | inline | inline | inline | inline |
| Hero image | ✅ | ✅ | ✅ | **banner fallback** | **banner fallback** | **banner fallback** |
| Gallery quality | strong (30) | strong (20) | strong (16) | **none** | **none** | **none** |
| CTA | ✅ (shared) | ✅ | ✅ | ✅ | ✅ | ✅ |

`*` `"Việt Nam"` is a generic placeholder location (only Eo Gió has a real city). **Bilingual note:** every value above is a Vietnamese plain string → English detail pages show Vietnamese.

### 2.3 The 8 orphan project folders — **Missing business input** (all)

For each of `cai-tao-nha-quan-8`, `nha-anh-nam`, `nha-ta-dung`, `nha-vuon-chily`, `nha-xuong-anh-cuong`, `phong-giam-doc`, `phong-hop-quan-7`, `van-phong-quan-4`:

- Folder ✅ · Media in catalog ✅ · **Business entry ❌ · name ❌ · subtitle ❌ · description ❌ · project type ❌ · location ❌ · area ❌ · year ❌ · services ❌ · style ❌ · materials ❌ · SEO ❌ · CTA ❌.**
- Cover/gallery exist in the catalog but are **not displayed anywhere** (except `nha-vuon-chily` cover on the Contact hero).
- **Action requires: Missing business input** — display name, type/segment, location, area, year, description, services, style, materials for each. These must come from the business (folder `.docx` specs may hold them; not parsed here).

---

# PART 3 — COMPANY CONTENT AUDIT

| Item | Status | Notes |
|---|---|---|
| Company name | **Present** | `company.name` = "Lai Huy Interior" |
| Tagline | **Present** | bilingual |
| Positioning | **Present** | bilingual (`positioning`, `shortPositioning`) |
| About page | **Present / needs update** | thin; not localized; reuses Factory blocks (§1.2) |
| Company story | **Present (image only)** | `companyStory` image + positioning paragraphs; **no real history/narrative text** |
| Vision | **Missing** | no explicit vision statement → **Missing business input** |
| Mission | **Missing** | "values" array approximates it (VI-only) → **Missing business input** |
| Founding year / history / milestones | **Missing** | → **Missing business input** |
| Team / leadership | **Missing** | no team data or photos → **Missing business input** |
| Process / workflow | **Present** | `productionWorkflow` (6 steps) + `qualityControl` (5) — VI-only |
| Services | **Present** | `services.ts` (6) — VI-only content |
| Workshop / factory | **Present** | `factoryCapabilities`, `machinery` (7), `workshopMedia` (11) — VI-only |
| Contact info | **Present** | phone, email, 2 addresses, hours |
| Address(es) | **Present / verify** | office = Tây Ninh (Cần Giuộc/Long Hậu); factory = Vĩnh Long. **Inconsistency:** jobs & Eo Gió reference "Bến Tre" heavily, which matches neither registered address → **needs verification (do not assume).** |
| Google Maps | **Needs update** | static image + Maps **search-query** URL, not an embed/place link (§1.8) |
| Social links | **Partial** | Facebook only. No Zalo/Instagram/YouTube/LinkedIn → **Missing business input** for others |
| Statistics | **Present (thin)** | 4 `factoryCapabilities` metrics; no project count, client count, years-in-business |
| Hero banners | **Present** | `brand/banner-home` + reused project covers (heavy reuse, §4) |
| Certifications | **Missing** | none referenced → **Missing business input** |
| Partners / clients | **Missing** | no logos/testimonials → **Missing business input** |
| FAQ | **Missing** | none → **Missing business input** (or de-scope) |
| Testimonials / reviews | **Missing** | none → **Missing business input** |
| Recruitment email | **Missing** | reuses company email (§1.7) |
| Business registration / tax ID | **Missing** | none → **Missing business input** |
| Duplicate content | **Present** | `factoryCapabilities` (Home/About/Factory), `qualityControl` (About/Factory), `productionWorkflow` (Home/Factory), `services` (Home/Services), addresses (Contact ×2 + Footer) |
| Dead/unused data | **Present** | `projectCategories` (`projects.ts`) imported nowhere; `factoryGallery` (`factory.ts`) now `= []` and unused |

---

# PART 4 — IMAGE USAGE AUDIT (read-only; catalog not modified)

Totals from the catalog/manifest: **145 project images** across 11 folders, **11 workshop**, **3 company**, **1 brand** = 160.

### 4.1 Unused images

- **~78 project images are never rendered** — the 8 orphan folders (79 images) minus the single `nha-vuon-chily` cover used on the Contact hero.
  - `cai-tao-nha-quan-8` (5), `nha-anh-nam` (9), `nha-ta-dung` (7), `nha-vuon-chily` (25 of 26), `nha-xuong-anh-cuong` (3), `phong-giam-doc` (10), `phong-hop-quan-7` (10), `van-phong-quan-4` (9).
- All connected-project gallery images (Eo Gió 30, Codi Hotel 20, Codi Villa 16) are referenced by their detail pages — **but those pages aren't prerendered** (§1.4), so they aren't in the static output.
- Company/brand/workshop images are all used.

### 4.2 Duplicated / heavily reused images (heroes)

| Image | Used as | Reuse count |
|---|---|---|
| `khach-san-eo-gio` cover | Home hero, About hero, Projects-list hero, `seo.projects` og | **4×** |
| `company/about-workspace` | Careers hero, Factory hero, Home workspace section, `seo.factory` og, `seo.careers` og | **5×** |
| `codi-boutique-hotel` cover | Services hero, `seo.services` og | 2× |
| `brand/banner-home` | Home `seo.home` og, project-detail hero fallback | 2× |
| `nha-vuon-chily` cover | Contact hero | 1× (only image used from a 26-image folder) |

### 4.3 Pages with weak / no dedicated imagery

- **Services:** icon-only cards, **no per-service images**.
- **Factory machinery:** icon+text only, **no per-machine photos**.
- **About:** only 2 images (companyStory + reused hero); no team/history imagery.
- **Careers:** hero only (reused workspace image).

### 4.4 Projects with weak galleries

- `nha-xuong-anh-cuong` — **only 3 images** (thin for a case study).
- `cai-tao-nha-quan-8` (5), `nha-ta-dung` (7) — modest.
- (All moot until they get business entries.)

### 4.5 Opportunities for better image selection

- Replace 3–5× hero reuse with distinct covers drawn from the 78 unused images.
- Give the Contact page a purpose-fit image rather than a random residential cover.
- Use the rich Eo Gió (30) / Codi Villa (16) galleries on the Home/Projects pages instead of a single repeated cover.
- Assign per-project covers deliberately (catalog currently defaults `cover = images[0]`, i.e. filename order).

---

# PART 5 — IMPLEMENTATION PLAN (phased)

Effort key: **S** ≈ ≤0.5 day · **M** ≈ 1–2 days · **L** ≈ 3–5 days. Priority: **P0** critical → **P3** nice-to-have.

### Phase A — Critical business data (unblocks everything visible)
- **Priority:** P0
- **Effort:** L (gated on business input)
- **Objective:** Make the site show the real portfolio and correct facts.
- **Tasks:**
  1. Collect **Missing business input** for the 8 orphan folders (name, type, location, area, year, description, services, style, materials) and add `projects.ts` entries with matching `mediaId`.
  2. Resolve the 3 folderless entries (Anh Duy, Chily, Văn phòng Lai Huy): confirm whether each maps to an existing folder (e.g. Chily↔`nha-vuon-chily`) or should be retired — **business decision, no inference**.
  3. Replace generic `"Việt Nam"` locations and verify the Bến Tre / Tây Ninh / Vĩnh Long address inconsistency.
  4. Fill missing `rooms`/`duration`/`client` where real; add real completion years.
- **Files affected:** `app/data/projects.ts` (+ optionally `company.ts` addresses).
- **Dependencies:** business content (the folder `.docx` specs are the likely source).
- **User-facing improvement:** portfolio grows from 3 visible projects to 11; project cards/detail pages stop rendering empty.

### Phase B — Project content depth & detail-page delivery
- **Priority:** P0/P1
- **Effort:** M
- **Objective:** Make case-study pages complete and indexable.
- **Tasks:**
  1. Prerender `/du-an/[slug]` (add route rule / `crawlLinks`) so detail pages are in the static output.
  2. Curate per-project covers (don't rely on filename-order `images[0]`).
  3. Add per-image alt where feasible (currently one alt per project).
  4. Remove dead `projectCategories` export from `projects.ts` (unused; the live filter is `categoryOptions`). Empty filters already auto-hide.
- **Files affected:** `nuxt.config.ts`, `app/data/projects.ts`, `app/pages/du-an/*`.
- **Dependencies:** Phase A (needs the entries).
- **User-facing improvement:** every project has a real, shareable, search-visible page.

### Phase C — Bilingual content parity
- **Priority:** P0 (business-critical if EN is a target market — export orders are advertised)
- **Effort:** L
- **Objective:** Make the EN toggle deliver English content, not Vietnamese.
- **Tasks:**
  1. Convert business data to `{ vi, en }`: `projects.ts`, `services.ts`, `careers.ts`, `factory.ts`, and the About page's page-local `values`.
  2. Localize `gioi-thieu.vue` hardcoded strings (hero + all section headings).
  3. Add i18n routing + `hreflang` (or document that EN is UI-only) for SEO.
- **Files affected:** all `app/data/*.ts` (content), `app/pages/gioi-thieu.vue`, `nuxt.config.ts` (i18n).
- **Dependencies:** professional EN translations = **Missing business input**.
- **User-facing improvement:** a usable English site for export/international clients.

### Phase D — Company & service pages
- **Priority:** P1
- **Effort:** M
- **Objective:** Fill company-story gaps and enrich services.
- **Tasks:**
  1. Add real About content: history/founding year, vision, mission, team — **Missing business input**.
  2. De-duplicate About vs Factory (each should own distinct blocks).
  3. Link each service to a representative project; consider per-service imagery.
  4. Add certifications/partners/testimonials **if they exist** — **Missing business input**.
  5. Retire dead `factoryGallery` in `factory.ts`.
- **Files affected:** `app/pages/gioi-thieu.vue`, `app/pages/dich-vu.vue`, `app/pages/nha-xuong.vue`, `app/data/{company,services,factory}.ts`.
- **Dependencies:** business input for history/team/certs.
- **User-facing improvement:** stronger trust signals; less repetition.

### Phase E — SEO infrastructure
- **Priority:** P1
- **Effort:** M
- **Objective:** Make the site discoverable and rich-result eligible.
- **Tasks:**
  1. Add `robots.txt` + `sitemap.xml` (module or generated), including project detail routes.
  2. Add structured data: `Organization`/`LocalBusiness` (address, geo, phone), `JobPosting` (careers), `Article`/`CreativeWork` (project pages).
  3. Add `ogType`, `ogUrl`, canonical; per-page Twitter cards (currently home-only).
  4. `hreflang` (with Phase C) or a documented single-locale-indexing decision.
- **Files affected:** `public/robots.txt` (new), sitemap config in `nuxt.config.ts`, page `useSeoMeta`/`useHead`, `app/data/company.ts`.
- **Dependencies:** Phase B (routes), Phase C (locales).
- **User-facing improvement:** search visibility for projects and English content.

### Phase F — Contact, conversion & accessibility
- **Priority:** P2
- **Effort:** M
- **Objective:** Turn honest-but-weak contact/recruitment flows into real capture, and close a11y gaps.
- **Tasks:**
  1. Real contact-form backend + **drawing/BOQ file upload** (the site repeatedly invites "send drawings"); submission confirmation.
  2. Embedded/interactive map (place link, not a search query); consider Zalo.
  3. Dedicated recruitment channel + `JobPosting` (with Phase E).
  4. A11y pass: `aria-describedby` on the form note, verify icon `aria-hidden`, focus states, heading order, color-contrast on `text-white/42`-style muted text.
- **Files affected:** `app/pages/lien-he.vue`, `app/pages/tuyen-dung.vue`, `app/data/company.ts`, a server route/endpoint (new).
- **Dependencies:** backend/service choice; social handles = **Missing business input**.
- **User-facing improvement:** captured leads, working applications, accessible forms.

---

## Consolidated "Missing business input" register

The following cannot be derived from the repository and must be supplied by the business:

1. Full metadata for **8 project folders** (§2.3).
2. Whether **Anh Duy / Chily / Văn phòng Lai Huy** map to existing folders or are retired (§2.1).
3. Real **locations** (5 projects say "Việt Nam") and the **Bến Tre vs Tây Ninh vs Vĩnh Long** address truth (§3).
4. **client** for project id 6; real **completion years** (all say 2026).
5. Company **history, founding year, vision, mission, team** (§3).
6. **Certifications, partners, clients, testimonials, FAQ** (§3).
7. **EN translations** for all business data (Phase C).
8. Additional **social channels** (Zalo, etc.) and **recruitment email** (§1.7, §3).
9. Business **registration / tax details** for `LocalBusiness` schema (§3).

---

*This audit is the single source of truth for the next content phase. It contains no code changes, no invented business values, and no media modifications.*

---
---

# EXECUTION PLAN (extends the audit above)

> Parts 6–10 turn the audit into an executable plan. Legend used throughout:
> **Owner** = Business (supplies a value/decision) · Development (code/wiring) · Both.
> **Blocks production** = must be resolved before a credible public launch of the affected page (the site builds and deploys regardless): **Yes** / **No** / **Conditional** (state the condition).
> **Effort:** S ≤0.5d · M 1–2d · L 3–5d. **Marks:** ✓ Present · ⚠ Missing business input · ✗ Missing implementation.

---

## PART 6 — Field-level change register

Every missing/outdated/unwired field, with its exact location and ownership. `projects[n]` = array index in `app/data/projects.ts` (id = n+1). "Blocks production" is judged for a portfolio/marketing launch.

### 6.1 Project data (`app/data/projects.ts`)

| # | Field / issue | Data object | Property | Current state | Owner | Priority | Blocks prod |
|---|---|---|---|---|---|---|---|
| F1 | 8 folders have no entry | `projects[]` (add 8) | whole entry + `mediaId` | ✗ no entry | Both | P0 | **Yes** (portfolio) |
| F2 | Anh Duy has no media | `projects[3]` | `mediaId` | ✗ unset (no folder) | Business (confirm mapping) | P0 | **Yes** |
| F3 | Chily has no media | `projects[4]` | `mediaId` | ✗ unset (`nha-vuon-chily` exists, unconfirmed) | Business (confirm mapping) | P0 | **Yes** |
| F4 | Office has no media | `projects[5]` | `mediaId` | ✗ unset (no folder) | Business (confirm mapping) | P0 | **Yes** |
| F5 | Generic location | `projects[1,2,3,4,5]` | `location` | ⚠ `"Việt Nam"` | Business | P1 | No (quality) |
| F6 | Year unverified | `projects[0..5]` | `year` | ⚠ all `"2026"` | Business | P1 | No |
| F7 | Missing client | `projects[5]` | `client` | ✗ absent | Business | P2 | No |
| F8 | Missing rooms/duration | `projects[1,2]` (and 3,4,5) | `rooms`,`duration` | ✗ absent (only id1 has both) | Business | P3 | No |
| F9 | No English content | `projects[*]` | `name`,`shortDescription`,`description`,`scope`,`materials`,`style`,`content.*`,`location`,`area` | ⚠ VI-only plain strings | Both (Dev: `{vi,en}` shape; Business: EN copy) | P0/P1 | **Conditional** (EN launch market) |
| F10 | No per-project SEO object | `projects[*]` | (derived inline in `[slug].vue`) | ✓ derived, ✗ not prerendered | Development | P1 | No (SSR works) |
| F11 | Dead export | module scope | `projectCategories` | ✗ unused | Development | P3 | No |

### 6.2 Company data (`app/data/company.ts`)

| # | Field / issue | Data object | Property | Current state | Owner | Priority | Blocks prod |
|---|---|---|---|---|---|---|---|
| F12 | Address consistency | `company` | `addresses[]` (Tây Ninh, Vĩnh Long) vs jobs/Eo Gió "Bến Tre" | ⚠ verify | Business | P0 | **Yes** (trust) |
| F13 | Only one social channel | `company` | `facebook` (no others) | ⚠ Zalo/IG/YouTube absent | Business | P2 | No |
| F14 | No vision statement | `company` | (none) | ⚠ absent | Business | P2 | No |
| F15 | No mission statement | `company` | (none; `values` in page) | ⚠ absent | Business | P2 | No |
| F16 | No history/founding year | `company` | (none) | ⚠ absent | Business | P2 | No |
| F17 | No team/leadership | `company` | (none) | ⚠ absent | Business | P3 | No |
| F18 | No certifications | `company` | (none) | ⚠ absent | Business | P2 | No |
| F19 | No partners/clients/testimonials | `company` | (none) | ⚠ absent | Business | P2 | No |
| F20 | No business registration/tax ID | `company` | (none) | ⚠ absent (needed for `LocalBusiness` schema) | Business | P2 | No |
| F21 | No recruitment email | `company` | (reuses `email`) | ⚠ absent | Business | P2 | No |
| F22 | English SEO strings | `company` | `seo.*.title/description` | ✓ bilingual | — | — | No |

### 6.3 Other data files & cross-cutting

| # | Field / issue | Source file | Data object | Property | Owner | Priority | Blocks prod |
|---|---|---|---|---|---|---|---|
| F23 | Services VI-only | `app/data/services.ts` | `services[*]` | `title`,`description`,`details` | Both | P1 | Conditional (EN) |
| F24 | Jobs VI-only | `app/data/careers.ts` | `jobs[*]`,`careerBenefits` | `title`,`location`,`type`,`description`,`requirements` | Both | P1 | Conditional (EN) |
| F25 | Factory data VI-only | `app/data/factory.ts` | `factoryCapabilities`,`machinery`,`productionWorkflow`,`qualityControl` | all text | Both | P1 | Conditional (EN) |
| F26 | Dead export | `app/data/factory.ts` | `factoryGallery` | `= []`, unused | Development | P3 | No |
| F27 | About page hardcoded VI | `app/pages/gioi-thieu.vue` | template + local `values` | hero props, headings, `values` | Both | P1 | Conditional (EN) |
| F28 | No robots/sitemap | `public/` + `nuxt.config.ts` | — | — | Development | P1 | No |
| F29 | No i18n routing/hreflang | `nuxt.config.ts` | — | — | Development | P1 | Conditional (EN SEO) |
| F30 | Detail routes not prerendered | `nuxt.config.ts` | `routeRules` / `crawlLinks` | — | Development | P1 | No |
| F31 | Contact form mailto-only, no upload | `app/pages/lien-he.vue` | `form` | backend + file upload | Both (Business: choose service) | P2 | No |
| F32 | Static map (not embedded) | `app/pages/lien-he.vue` | map block | embed/place link | Development | P2 | No |
| F33 | No structured data | pages + `company.ts` | `Organization`/`LocalBusiness`/`JobPosting`/`Article` | — | Both (Business: reg/geo) | P1 | No |

---

## PART 7 — Per-project completion checklists

Marks: **✓** Present · **⚠** Missing business input · **✗** Missing implementation. No values invented.

### 7.1 Connected projects (folder + business entry + `mediaId`)

| Project | Cover | Gallery | Hero | Desc | Location | Area | Year | Services | Materials | Style | SEO | CTA |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **Eo Gió** (id1, `khach-san-eo-gio`) | ✓ | ✓ (30) | ✓ | ✓ | ✓ Bến Tre | ✓ | ✓* | ✓ | ✓ | ✓ | ✓† | ✓ |
| **Codi Hotel** (id2, `codi-boutique-hotel`) | ✓ | ✓ (20) | ✓ | ✓ | ⚠ "Việt Nam" | ✓ | ✓* | ✓ | ✓ | ✓ | ✓† | ✓ |
| **Codi Villa** (id3, `codi-villa-phan-thiet`) | ✓ | ✓ (16) | ✓ | ✓ | ⚠ "Việt Nam" | ✓ | ✓* | ✓ | ✓ | ✓ | ✓† | ✓ |

`*` Year present but unverified (all "2026" — F6). `†` SEO is derived inline on `[slug].vue`; detail pages are **not prerendered** (F10/F30) — cross-cutting Dev item, not per-project.

### 7.2 Business entries without media (no matching folder)

| Project | Cover | Gallery | Hero | Desc | Location | Area | Year | Services | Materials | Style | SEO | CTA |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **Anh Duy** (id4) | ⚠ | ⚠ | ⚠ | ✓ | ⚠ | ✓ | ✓* | ✓ | ✓ | ✓ | ✓† | ✓ |
| **Chily** (id5) | ⚠ | ⚠ | ⚠ | ✓ | ⚠ | ✓ | ✓* | ✓ | ✓ | ✓ | ✓† | ✓ |
| **Office** (id6) | ⚠ | ⚠ | ⚠ | ✓ | ⚠ | ✓ | ✓* | ✓ | ✓ | ✓ | ✓† | ✓ |

Cover/Gallery/Hero ⚠ = business must confirm which folder maps (or supply media); no inference. Office also missing `client` (F7).

### 7.3 Orphan media folders (media exists, no business entry) — all gated on F1

| Folder | Cover | Gallery | Hero | Desc | Location | Area | Year | Services | Materials | Style | SEO | CTA |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `cai-tao-nha-quan-8` | ✓ | ✓ (5) | ✗ | ⚠ | ⚠ | ⚠ | ⚠ | ⚠ | ⚠ | ⚠ | ⚠ | ✗ |
| `nha-anh-nam` | ✓ | ✓ (9) | ✗ | ⚠ | ⚠ | ⚠ | ⚠ | ⚠ | ⚠ | ⚠ | ⚠ | ✗ |
| `nha-ta-dung` | ✓ | ✓ (7) | ✗ | ⚠ | ⚠ | ⚠ | ⚠ | ⚠ | ⚠ | ⚠ | ⚠ | ✗ |
| `nha-vuon-chily` | ✓ | ✓ (26) | ✗ | ⚠ | ⚠ | ⚠ | ⚠ | ⚠ | ⚠ | ⚠ | ⚠ | ✗ |
| `nha-xuong-anh-cuong` | ✓ | ✓ (3, weak) | ✗ | ⚠ | ⚠ | ⚠ | ⚠ | ⚠ | ⚠ | ⚠ | ⚠ | ✗ |
| `phong-giam-doc` | ✓ | ✓ (10) | ✗ | ⚠ | ⚠ | ⚠ | ⚠ | ⚠ | ⚠ | ⚠ | ⚠ | ✗ |
| `phong-hop-quan-7` | ✓ | ✓ (10) | ✗ | ⚠ | ⚠ | ⚠ | ⚠ | ⚠ | ⚠ | ⚠ | ⚠ | ✗ |
| `van-phong-quan-4` | ✓ | ✓ (9) | ✗ | ⚠ | ⚠ | ⚠ | ⚠ | ⚠ | ⚠ | ⚠ | ⚠ | ✗ |

For each orphan: **Cover/Gallery ✓ (media in catalog)**; all business fields **⚠** (need content); Hero/CTA/detail wiring **✗** (Dev: add a `projects.ts` entry with `mediaId`, gated on the ⚠ content).

---

## PART 8 — Page ↔ data dependency matrix

Which components each page renders, its data sources, and the exact project/company fields it reads. Use this to see what a data change touches.

| Page (file) | Components rendered | Data sources | Project fields read | Company/other fields read |
|---|---|---|---|---|
| **Home** `index.vue` | custom hero, `NuxtImg`, metric cards, project cards, workflow cards, service cards, `NuxtLink`, `Icon` | `company`, `factoryCapabilities`, `productionWorkflow`, `services`, `projects` (featured), `projectMedia['khach-san-eo-gio']`, `siteImages.aboutWorkspace`, local `heroMetrics` | `featured`, `mediaId`(cover), `name`, `categoryName`, `shortDescription`, `location`, `rooms`, `duration`, `scope`, `slug` | `company.tagline/positioning/seo.home`; `service.icon/title/description`; `capability.*`; `productionWorkflow.*` |
| **About** `gioi-thieu.vue` | `AppHero`, `NuxtImg`, `Icon` | `company.positioning`, `factoryCapabilities`, `qualityControl`, `siteImages.companyStory`, `projectMedia['khach-san-eo-gio']`, local `values` | `mediaId`(cover, hero only) | `company.positioning/seo.about`; `capability.label/value/description`; `qualityControl[]` |
| **Projects** `du-an/index.vue` | `AppHero`, `NuxtImg`, filter buttons, `NuxtLink` | `projects`, `projectMedia`, `company.seo.projects`, local `categoryOptions` | `mediaId`(cover), `segment`, `name`, `categoryName`, `shortDescription`, `scope`, `rooms`/`duration`/`area`, `slug` | `company.seo.projects` |
| **Detail** `du-an/[slug].vue` | `NuxtImg`, `MediaImage`, `Icon`, `NuxtLink` | `projects`, `projectMedia`(cover+images), `siteImages.bannerHome`, `uiText` | `mediaId`, `name`, `slug`, `segment`, `location`, `area`, `year`, `rooms`, `duration`, `client`, `style`, `scope`, `materials`, `content.*`, `shortDescription` | `uiText.*`; `company.seo.projects` (fallback) |
| **Factory** `nha-xuong.vue` | `AppHero`, `MediaImage`, `Icon` | `factoryCapabilities`, `machinery`, `productionWorkflow`, `qualityControl`, `workshopMedia`, `siteImages.aboutWorkspace`, `company.seo.factory` | — | `capability.*`; `machinery.name/description`; `productionWorkflow.*`; `qualityControl[]`; `company.seo.factory` |
| **Services** `dich-vu.vue` | `AppHero`, `Icon`, `NuxtLink` | `services`, `company.seo.services`, `projectMedia['codi-boutique-hotel']` | `mediaId`(hero only) | `service.icon/title/description/details`; `company.seo.services` |
| **Careers** `tuyen-dung.vue` | `AppHero`, `Icon`, `a[mailto]` | `jobs`, `careerBenefits`, `company.seo.careers`, `company.email`, `siteImages.aboutWorkspace` | — | `job.title/location/type/description/requirements`; `careerBenefits[]`; `company.email/seo.careers` |
| **Contact** `lien-he.vue` | `AppHero`, `NuxtImg`, `form`, contact cards | `company.addresses/phone/email/workingHours`, `siteImages.mapAddress`, `projectMedia['nha-vuon-chily']`, `uiText` | `mediaId`(hero only) | `company.addresses[].label/address/mapUrl`, `phone`, `email`, `workingHours`, `seo.contact` |
| **Global** `app.vue` (header/footer) | header nav, mobile menu, footer, `Icon`, `img` | `navLinks`, `company`, `uiText` | — | `company.phone/email/addresses/workingHours/positioning/footerServices/facebook/seo.home` |

### 8.1 Reverse index — high-impact shared fields (change one → pages affected)

| Field / data | Pages affected |
|---|---|
| `projects[n].mediaId` | Home, Projects, Detail |
| `projects[n].name` / `shortDescription` | Home, Projects, Detail |
| `company.addresses` | Contact (×2), Footer (all pages) |
| `company.seo.*` | the matching page |
| `factoryCapabilities` | Home, About, Factory |
| `qualityControl` | About, Factory |
| `productionWorkflow` | Home, Factory |
| `services` | Home, Services |
| `siteImages.aboutWorkspace` | Home, About*, Factory, Careers (hero reuse) |
| `projectMedia['khach-san-eo-gio']` | Home, About, Projects, `seo.projects` |

---

## PART 9 — Ordered execution breakdown (per phase)

Each phase's tasks in execution order. Columns: **Order · Task · Affected files · Dependencies · Effort · User-facing impact.**

### Phase A — Critical business data (P0)

| # | Task | Affected files | Dependencies | Effort | Impact |
|---|---|---|---|---|---|
| A1 | Collect metadata for the 8 orphan folders (F1) | (business doc) | folder `.docx` specs | M (business) | prerequisite |
| A2 | Confirm/deny folder mapping for Anh Duy, Chily, Office (F2–F4) | (business decision) | — | S (business) | prerequisite |
| A3 | Add 8 `projects.ts` entries with `mediaId` | `app/data/projects.ts` | A1 | M | 3→11 projects visible |
| A4 | Wire `mediaId` for the 3 folderless entries (or retire) | `app/data/projects.ts` | A2 | S | 3 imageless projects fixed |
| A5 | Replace generic `"Việt Nam"` locations; verify years (F5,F6) | `app/data/projects.ts` | A1 | S | accurate facts |
| A6 | Verify address inconsistency; fill `client` id6 (F12,F7) | `app/data/company.ts`, `projects.ts` | business verify | S | trust/accuracy |

### Phase B — Project depth & detail-page delivery (P0/P1)

| # | Task | Affected files | Dependencies | Effort | Impact |
|---|---|---|---|---|---|
| B1 | Prerender `/du-an/[slug]` (routeRules or `crawlLinks`) (F30) | `nuxt.config.ts` | A3/A4 | S | detail pages in static output |
| B2 | Curate per-project covers (not filename order) | `app/data/projects.ts` (+ optional catalog cover field) | A3 | S | better first impression |
| B3 | Per-image alt for galleries | `app/pages/du-an/[slug].vue`, data | A3 | M | a11y + image SEO |
| B4 | Remove dead `projectCategories` (F11) | `app/data/projects.ts` | — | S | cleanup |

### Phase C — Bilingual content parity (P0 conditional on EN market)

| # | Task | Affected files | Dependencies | Effort | Impact |
|---|---|---|---|---|---|
| C1 | Restructure business data to `{vi,en}` shape (F9,F23–F25) | `app/data/{projects,services,careers,factory}.ts` | — | M (Dev) | enables EN |
| C2 | Supply EN translations for all business copy | (business) | C1 | L (business) | English content |
| C3 | Localize `gioi-thieu.vue` hardcoded strings + `values` (F27) | `app/pages/gioi-thieu.vue` | C2 | S | English About page |
| C4 | i18n routing + `hreflang` (or document UI-only) (F29) | `nuxt.config.ts` | C1 | M | EN SEO |

### Phase D — Company & service pages (P1)

| # | Task | Affected files | Dependencies | Effort | Impact |
|---|---|---|---|---|---|
| D1 | Supply history, vision, mission, team (F14–F17) | (business) | — | M (business) | credible About |
| D2 | Add company-story/vision/mission/team content + render | `app/data/company.ts`, `app/pages/gioi-thieu.vue` | D1 | M | About depth |
| D3 | De-duplicate About vs Factory blocks | `app/pages/gioi-thieu.vue`, `nha-xuong.vue` | — | S | less repetition |
| D4 | Link services → representative projects | `app/data/services.ts`, `app/pages/dich-vu.vue` | A3 | S | conversion |
| D5 | Add certifications/partners/testimonials **if provided** (F18,F19) | (business) → data + pages | D-business | M | trust signals |
| D6 | Remove dead `factoryGallery` (F26) | `app/data/factory.ts` | — | S | cleanup |

### Phase E — SEO infrastructure (P1)

| # | Task | Affected files | Dependencies | Effort | Impact |
|---|---|---|---|---|---|
| E1 | Add `robots.txt` + `sitemap.xml` incl. detail routes (F28) | `public/robots.txt`, `nuxt.config.ts` | B1 | M | crawlability |
| E2 | `Organization`/`LocalBusiness` schema (needs reg/geo F20) | `app/data/company.ts`, layout | business F20 | M | rich results |
| E3 | `JobPosting` schema | `app/pages/tuyen-dung.vue` | C1 | S | job rich results |
| E4 | `Article`/`CreativeWork` schema on detail | `app/pages/du-an/[slug].vue` | B1 | S | project rich results |
| E5 | `ogType`, `ogUrl`, canonical, per-page Twitter cards | page `useSeoMeta` | — | S | share/SEO completeness |

### Phase F — Contact, conversion & accessibility (P2)

| # | Task | Affected files | Dependencies | Effort | Impact |
|---|---|---|---|---|---|
| F-1 | Choose form backend/service | (business/dev decision) | — | S | prerequisite |
| F-2 | Real contact form + drawing/BOQ upload + confirmation (F31) | `app/pages/lien-he.vue`, new server route | F-1 | M | captured leads |
| F-3 | Embedded/interactive map + place link (F32) | `app/pages/lien-he.vue`, `company.ts` | — | S | usable map |
| F-4 | Dedicated recruitment channel (F21) | `app/data/company.ts`, `tuyen-dung.vue` | business | S | real applications |
| F-5 | Add Zalo/other socials (F13) | `app/data/company.ts`, `app.vue` | business | S | reachability |
| F-6 | A11y pass (form `aria-describedby`, icon `aria-hidden`, heading order, contrast) | pages, components | — | M | accessible site |

---

## PART 10 — Production readiness checklist

All remaining work grouped by owner. Check off before a credible public launch. IDs reference Part 6.

### 10.1 Business input required (cannot proceed without)
- [ ] Metadata for 8 orphan project folders — name, type, location, area, year, description, services, style, materials (F1)
- [ ] Folder mapping decision for Anh Duy / Chily / Office, or retire them (F2–F4)
- [ ] Real locations for 5 projects (replace "Việt Nam") (F5)
- [ ] Verify completion years (all "2026") (F6)
- [ ] Client for project id6 (F7)
- [ ] Resolve Bến Tre vs Tây Ninh vs Vĩnh Long address truth (F12)
- [ ] EN translations for all business copy (F9, F23–F25, F27)
- [ ] Company history, founding year, vision, mission (F14–F16)
- [ ] Team/leadership (F17)
- [ ] Certifications, partners/clients, testimonials, FAQ — if any (F18, F19)
- [ ] Business registration / tax details for schema (F20)
- [ ] Dedicated recruitment email (F21); additional social channels (F13)

### 10.2 Development required
- [ ] Add 8 project entries + wire `mediaId` (A3); wire/retire 3 folderless entries (A4)
- [ ] Restructure business data to `{vi,en}` (C1); localize `gioi-thieu.vue` (C3)
- [ ] Curate per-project covers (B2); per-image alt (B3)
- [ ] De-duplicate About/Factory (D3); link services→projects (D4)
- [ ] Contact form backend + upload + confirmation (F-2); interactive map (F-3)
- [ ] A11y pass (F-6)
- [ ] Remove dead code: `projectCategories` (F11), `factoryGallery` (F26)

### 10.3 SEO required
- [ ] Prerender detail routes (F30 / B1)
- [ ] `robots.txt` + `sitemap.xml` (F28 / E1)
- [ ] i18n routing + `hreflang` or documented single-locale decision (F29 / C4)
- [ ] Structured data: Organization/LocalBusiness, JobPosting, Article (F33 / E2–E4)
- [ ] `ogType`, `ogUrl`, canonical, per-page Twitter cards (E5)

### 10.4 Media required
- [ ] Production upload of the catalog to Supabase + flip `NUXT_PUBLIC_USE_SUPABASE_MEDIA` (from the migration phases — precondition for serving images off `/public`)
- [ ] Reduce hero reuse: assign distinct covers from the ~78 unused images (§4.2, §4.5)
- [ ] Purpose-fit Contact hero (currently a random residential cover) (§4.5)
- [ ] Optional: per-service and per-machine imagery (§4.3)
- [ ] Strengthen weak galleries once entries exist (`nha-xuong-anh-cuong` = 3 images) (§4.4)

---

*End of execution plan. Parts 1–5 are the audit; Parts 6–10 are the executable extension. No code, media, or business data was modified in producing this document.*
