# `/gioi-thieu` Proof-First Redesign

**Date:** 2026-08-11  
**Status:** Design approved by the user and implemented; see the [implementation plan](../plans/2026-08-11-gioi-thieu-proof-first-redesign.md)  
**Route:** `/gioi-thieu`  
**Primary locale:** Vietnamese, with equivalent English content

## 1. Summary

Redesign the About page as a proof-first company profile for project owners and design
consultants evaluating an interior contractor. The page keeps Lai Huy Interior's existing
industrial visual identity, shared shell, hero family, typography, and media pipeline. It changes
the narrative from a long sequence of partially repetitive sections into seven chapters that move
from promise to operating model, physical proof, delivered work, project fit, and contact.

The page must feel more editorial and premium without introducing a second design system. The new
look comes from asymmetric layouts, authentic photography, numbered rails, and thin rules rather
than new fonts, colors, decorative effects, or widespread card styling.

## 2. Audience and Objective

### Primary audience

- Project owners developing hotels, villas, apartments, or commercial interiors.
- Design consultants and project-management teams evaluating production and installation
  capability.

### Primary objective

Give a qualified visitor enough evidence to decide that Lai Huy is worth contacting about a real
project. The page must answer four questions in order:

1. What responsibility can Lai Huy take?
2. How does Lai Huy control delivery?
3. What physical and project evidence supports that claim?
4. How can the visitor start a conversation?

### Success criteria

- The page has one clear narrative and no repeated factory or trust sections.
- Verified facts appear before qualitative claims.
- The complete six-step production workflow remains available at
  `#production-workflow` in both locales.
- Two real case studies show scope and known facts without invented results or metrics.
- The final CTA provides usable contact routes without implying that a frontend-only form sends
  or stores an enquiry.
- The page remains consistent with the global header, footer, hero, SEO, media, locale, and motion
  contracts.

## 3. Scope

### In scope

- Reorder and rewrite the `/gioi-thieu` page around the approved seven-chapter structure.
- Add typed bilingual About-page content data.
- Add small, page-specific presentation components where they give a clear boundary.
- Reuse canonical company, factory, project, and media data.
- Add targeted Playwright coverage for content, order, locales, responsive boundaries, and
  accessibility-relevant behavior.
- Preserve About-page SEO and structured data.

### Out of scope

- Changes to the global header, drawer, footer, or shared hero geometry.
- Redesigning `/nha-xuong`, `/du-an`, project-detail pages, or `/lien-he`.
- Adding a backend, email transport, database, analytics transport, CRM, or form service.
- Inventing company history, founding year, founder biography, team profiles, certifications,
  awards, client logos, or testimonials.
- Adding dependencies or changing the media manifest/catalog manually.
- Approving or updating Playwright visual-regression baselines without separate explicit user
  approval.

## 4. Current-State Findings

The current page renders eleven visible content bands after conditional sections are excluded. Its
factory capability is repeated across the immersive factory band, craftsmanship split, Why Lai
Huy cards, trust strip, and gallery. Mission, vision, milestones, founder, team, and testimonials
are conditionally supported but currently unauthored.

The redesign therefore cannot use a founder story, timeline, culture story, or social proof as its
primary narrative. It can use the verified workshop facts, production workflow, real media, and
project records already present in the repository.

## 5. Information Architecture

The page renders seven ordered chapters. Section order is identical in Vietnamese and English.

### Chapter 1 — Promise and proof

Reuse the shared `AppHero` family with the current About hero image, `company/workshop/3.webp`,
resolved through the generated media catalog. Keep the approved offset/neutral art direction and
the shared hero height/readability contracts.

The message positions Lai Huy as one accountable partner from technical development to production,
QC, installation, and handover. The hero has:

- A project-contractor eyebrow.
- A short proof-first headline.
- One explanatory lead.
- Primary CTA to `/lien-he`.
- Secondary CTA to `/du-an`.

A three-item proof strip sits outside the hero so it cannot affect image crop or locale-dependent
hero height. It selects canonical factory facts by ID:

- `footprint` — 3,000 m² workshop and warehouse.
- `throughput` — up to 50 rooms per month.
- `end-to-end` — design through installation.

The facts come from `factoryStats`; the About page does not duplicate their labels or values.

### Chapter 2 — The owner's delivery problem

Combine the current Who We Are, Philosophy, core values, and Why Lai Huy arguments into one
editorial section. The section states that a design only creates project value when it can be
produced, coordinated, installed, and signed off.

Its right-hand response list has three continuous rows separated by rules:

1. Convert design intent into production-ready technical documents.
2. Control material and finishing decisions at the workshop.
3. Coordinate installation and phased acceptance on site.

These are not separate rounded cards. On desktop, the problem statement and response list use a
40/60 split. On smaller screens, the statement precedes the list.

### Chapter 3 — Delivery workflow

Keep the existing six `productionWorkflow` steps and the `#production-workflow` anchor. Replace the
current six rounded cards with a numbered rail that reads as one operating system.

On desktop, the section uses a dark surface with a 40/60 introduction-and-steps split; the steps
form a two-column, three-row rule grid. On mobile, the same six steps become one vertical rail.
Descriptions remain visible on the About page because it is the canonical owner of the complete
company workflow.

### Chapter 4 — Factory proof

Combine the current immersive factory section, craftsmanship section, trust strip, and gallery
into one photographic proof chapter. It uses three authentic images resolved through generated
media records:

- Main environmental frame: `company/workshop/4.webp`.
- Machinery detail: `company/workshop/8.webp`.
- Craft/people detail: `companyMedia.companyStory`.

No project render is presented as workshop evidence. Images use localized alt text from About-page
data. The section links to `/nha-xuong` for the complete factory story. It does not provide a
lightbox; the About page is a curated proof summary, not a second factory gallery.

### Chapter 5 — Selected work

Show two real projects selected by canonical slug:

1. `khach-san-eo-gio` as the primary feature.
2. `codi-villa-phan-thiet` as the secondary feature.

The feature includes only existing project data: name, category, scope, area, location, year, and
cover media. It must not invent completion outcomes, room counts, delivery duration, client quotes,
or performance claims. The desktop composition is asymmetric 60/40; mobile renders Eo Gio first.
Each feature links to its existing project-detail route.

### Chapter 6 — Project fit

Conclude the qualification argument with three project-fit statements derived from existing
company markets and services:

- Hospitality interiors with multiple room types.
- Villas or apartments requiring consistent technical detailing.
- Production from drawings, OEM work, or export-ready orders.

This is a compact ruled band, not a new services grid. It helps visitors self-qualify without
duplicating the full `/dich-vu` page.

### Chapter 7 — Contact

Close with a dark CTA inviting the visitor to discuss existing drawings, a BOQ, or project
requirements. Provide two explicit actions:

- Navigate to `/lien-he` to view contact details.
- Call `company.phone` through a `tel:` link.

Do not display a success state, delivery promise, or copy stating that an enquiry was sent,
received, stored, or will be answered. The contact form remains frontend-only unless a separate
transport task is approved and implemented.

## 6. Visual Language

### Existing system to preserve

- Font: Inter only.
- Primary dark: `ink-950` (`#0b0a09`).
- Light surfaces: white and `ink-50` (`#f7f7f5`).
- Accent: existing wood scale, principally `wood-400` and `wood-600`.
- Shared shell measure: 1280px content width with existing gutters.
- Existing section rhythm, hero floor, readability contract, reveal directive, easing, duration,
  focus treatment, and reduced-motion behavior.

### Editorial changes

- Use 40/60 and 60/40 compositions instead of repeated equal card grids.
- Use `ink-200` rules to express sequence and relationships.
- Reserve the existing 16px card radius for media and interactive cards. Numbered rails and data
  bands use straight shared edges.
- Avoid decorative shadows. Media may use the existing radius but should not float as unrelated
  cards.
- Use wood as an accent for sequence, proof labels, and primary actions, not as a large background
  or a new theme.
- Keep headings short, heavy, uppercase, and high-contrast. Body copy remains sentence case with
  generous line height.

### Photography

- Use real workshop, machinery, craft, and project images.
- Preserve image dimensions through `MediaImage` or equivalent existing media-layer components to
  avoid layout shift.
- Maintain intentional quiet zones for overlay text and use existing focal/crop contracts.
- Hero loads according to `AppHero` behavior. Below-the-fold proof and project media load lazily.
- Do not add auto-advancing carousels, parallax, or decorative video.

## 7. Component Architecture

### Page orchestrator

`app/pages/gioi-thieu.vue` owns:

- SEO and JSON-LD orchestration.
- Selection of proof-stat IDs and project slugs.
- Joining canonical content records with generated media records.
- The approved seven-chapter order.
- One-off chapter layouts that do not justify extraction.

The page should not continue to own long bilingual literals or duplicate business facts.

### New page-specific data

Add `app/data/about.ts`. It owns only About-specific editorial content and configuration:

- Hero and section copy.
- Problem/response statements.
- Project-fit statements.
- CTA labels and supporting copy.
- Localized media alt text.
- Ordered proof-stat IDs.
- Ordered case-study slugs.

It does not copy values from `company.ts`, `factory.ts`, or `projects.ts`.

### New presentation components

#### `AboutProofStrip.vue`

- Input: a readonly list of selected `FactoryStat` records.
- Responsibility: render a semantic `<dl>` with the approved three-item geometry.
- No data imports or selection logic.

The existing `FactoryStatsStrip` is not reused because it owns a four-item factory-page layout and
anchor; only its canonical data source is reused.

#### `AboutWorkflowRail.vue`

- Input: a readonly list of production steps plus localized heading content.
- Responsibility: own `id="production-workflow"`, the numbered sequence, and responsive rail
  geometry.
- No project, media, or company imports.

If the current `ProductionStep` type is not exported, export it from `app/data/factory.ts` rather
than recreating the type.

#### `AboutProjectFeature.vue`

- Input: a project record, its resolved cover image, and an emphasis variant (`primary` or
  `secondary`).
- Responsibility: render the image, facts, localized scope, and project-detail link.
- Missing optional project facts are omitted without fallback labels.

### Reused components

- `AppHero` for the shared cover contract.
- `MediaImage` for content-addressed media and dimension-aware rendering.
- `Icon` and `NuxtLink` for existing interaction patterns.
- Shared application shell, header, drawer, footer, locale, SEO, and media composables remain
  unchanged.

## 8. Data Flow

1. `gioi-thieu.vue` reads About-specific labels and ordered IDs from `app/data/about.ts`.
2. It selects proof facts from `factoryStats`, workflow steps from `productionWorkflow`, and project
   records from `projects`.
3. It resolves workshop and project media through generated catalog records and current media
   helpers.
4. It passes complete typed records to presentation components.
5. Components resolve localized values with `useLanguage()` and emit only navigation behavior
   already supported by the router or browser.

No remote API, client-side fetch, storage write, or form submission is added.

## 9. Missing Data and Failure Behavior

- Optional company fields remain absent and do not create empty bands.
- Case-study selection filters missing slugs. One surviving project expands to full width. If both
  are missing, omit Chapter 5 rather than render placeholders.
- Targeted tests assert that both approved slugs exist in the current repository, so accidental
  content removal fails visibly during development.
- Missing optional project facts are not replaced with generic labels.
- Media uses existing catalog dimensions and fallback behavior. Do not add raw `/images/` or
  Supabase URLs.
- The page has no loading state because its content is local and statically available.
- The contact CTA falls back to visible navigation and telephone links; it never fabricates a send
  result.

## 10. Responsive Contract

### Below 768px

- Single-column chapter layouts.
- Proof facts stack without overlapping the hero.
- Workflow is a vertical 01–06 rail.
- Factory proof shows the main image before the two details.
- Case studies stack with Eo Gio first.
- CTA actions become full-width, touch-friendly controls.

### 768px to 1279px

- Proof facts render in three columns.
- Workflow steps use two columns where content fits without compressed copy.
- Factory proof uses a main image plus a secondary stack.
- Do not force the final desktop asymmetry before the 1280px shell boundary.

### 1280px and above

- Use the existing 1280px content rail.
- Problem/response and workflow use 40/60 splits.
- Case studies use a 60/40 asymmetric composition.
- Header, footer, and shared hero geometry remain unchanged.

Both locales must be checked immediately below, at, and above `767/768` and `1279/1280`.

## 11. Interaction and Accessibility

- Preserve the shared skip link and semantic main landmark.
- Render proof facts as a `<dl>` and workflow as an ordered structure.
- All actionable case-study surfaces must have one clear accessible link target; avoid nested
  interactive elements.
- Preserve visible focus styling using existing focus tokens.
- Every meaningful image has localized alt text. Decorative layers have empty alt text or are CSS
  backgrounds only when they carry no content.
- Keep current contrast floors: 4.5:1 for normal text and 3:1 for large bold hero text.
- Use existing reveal motion only. Under `prefers-reduced-motion: reduce`, content appears without
  delayed transforms or hover scaling.
- Do not auto-advance content or require hover to discover facts.

## 12. SEO and Runtime

- Preserve `usePageSeo` for `/gioi-thieu`.
- Preserve Breadcrumb, Organization/LocalBusiness, and AboutPage JSON-LD nodes.
- Use the final hero media path as `primaryImageOfPage` and social image input where currently
  appropriate.
- Preserve the Vietnamese-default, cookie/state-based locale model. Do not add locale-prefixed
  routes or claim `hreflang` coverage.
- Do not change `NUXT_PUBLIC_SITE_URL` or media runtime configuration.

## 13. Verification Plan

### Static and build checks

Run from the repository root with the pinned pnpm toolchain:

```powershell
pnpm lint
pnpm lint:media
pnpm typecheck
pnpm test
pnpm build
```

Every command passes only if it exits with code 0. A test process that finishes assertions but
times out or hangs during shutdown is reported as non-passing.

### Targeted Playwright coverage

Add an About proof-first specification that checks both `vi` and `en`:

- Seven visible chapters appear in the approved order when all canonical records exist.
- Exactly three proof facts render and match the selected canonical factory IDs.
- `#production-workflow` exists, clears the sticky header, and contains all six workflow steps and
  descriptions.
- Eo Gio and Codi Villa links, names, scope, area, and year come from project data.
- No unauthored founder, team, milestone, certification, award, or testimonial content appears.
- Contact and telephone CTAs have correct destinations without send-success copy.
- Focus order follows document order and all interactive controls show visible focus.
- Reduced-motion mode removes reveal transitions without hiding content.
- Layout has no horizontal overflow or overlap at 767, 768, 1279, and 1280 pixels.

Run the smallest relevant suites, then broaden because the task changes a shared hero consumer and
a public route:

```powershell
pnpm test:gates:layout
pnpm test:gates:a11y
pnpm test:gates:hero
pnpm test:vr
```

Record whether Supabase media is available or blocked. The visual suite is expected to detect an
intentional About-page baseline change. Do not run approval commands or update committed snapshots
without separate explicit user approval.

### Manual visual checks

- Vietnamese and English at 390, 767, 768, 1279, 1280, and 1440 pixels.
- Initial hero, scrolled header, keyboard focus, reduced motion, and image-unavailable behavior.
- Hero crop and text wrapping remain locale-independent within the shared floor.
- Project facts remain readable at tablet widths and do not create empty rows when an optional fact
  is absent.

## 14. Acceptance Criteria

- The route implements the seven approved chapters and no parallel About-page narrative remains.
- All visible business copy and alt text is typed and bilingual in `app/data/`.
- Factory facts, workflow steps, company contacts, project records, and media paths have one
  canonical source each.
- No new backend, dependency, global visual system, raw media URL, or fabricated business claim is
  introduced.
- The design remains within the current header/footer/hero/token contracts.
- Relevant static checks, production build, and targeted browser checks exit 0. Any non-zero,
  timeout, skipped, or externally blocked check is reported without an unqualified completion
  claim.
- The final diff excludes generated media files, user changes, historical screenshots, and visual
  baselines unless separately approved.

## 15. Approved Design Decisions

- Audience: project owners and design consultants.
- Direction: industrial–editorial evolution of the current system.
- Narrative: proof-first Option A.
- Structure: seven chapters.
- Visual language: existing Inter and ink–wood system; fewer cards, more rules and asymmetric
  editorial composition.
- Projects: Eo Gio Hotel and Codi Villa, using only canonical facts.
- Contact: navigation and telephone actions only; no implied submission result.
- Implementation contract: typed About data, three bounded page-specific components, canonical
  data selection, graceful omission, and boundary-focused verification.
