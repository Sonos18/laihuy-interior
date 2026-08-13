# `/dich-vu` Delivery-Journey Redesign

**Date:** 2026-08-13
**Status:** Superseded by the approved [Editorial V2 design](./2026-08-13-dich-vu-editorial-v2-design.md)
**Route:** `/dich-vu`
**Primary locale:** Vietnamese, with equivalent English content
**Approved direction:** Option A — “Hành trình bàn giao”
**Approved mockup:** [Superdesign draft A](https://p.superdesign.dev/draft/2ea04e2a-87e5-4372-b60e-0158fdb1c319)

## 1. Summary

Redesign the Services page as one accountable delivery journey for project owners and general
contractors who already have drawings, a BOQ, material samples, or an early project brief. The
page must persuade a qualified visitor to open the contact route and discuss those documents with
Lai Huy Interior.

The redesign replaces the current six equal service cards with a deliberate sequence:

1. Establish the project-document context.
2. Explain the core delivery system from design through production and installation.
3. Support the claim with real workshop and process evidence.
4. Present hospitality, commercial, and OEM/export work as specialist programmes.
5. Close with a direct drawings/BOQ contact invitation.

The page keeps the existing industrial design system, shared shell, `AppHero`, bilingual data,
media pipeline, and SEO contracts. It does not introduce file upload or claim that the current
frontend-only contact form sends or stores an enquiry.

## 2. Audience, Objective, and Conversion

### Primary audience

- Project owners evaluating an interior design, production, and installation partner.
- General contractors seeking a workshop-backed specialist subcontractor.
- Architects and project managers with drawings that need technical development or production.
- Buyers seeking production from drawings, OEM work, or export-ready orders.

### Primary objective

Build enough confidence for the visitor to navigate to `/lien-he` with a real project in mind.
The page should answer these questions in order:

1. Can Lai Huy work from the documents I already have?
2. Which parts of delivery can Lai Huy own?
3. Is there credible production and quality-control capacity behind the claim?
4. Does my project type fit the service model?
5. What is the next contact action?

### Primary conversion

The primary CTA is an invitation to discuss drawings, BOQ, material samples, or project scope. It
navigates to `/lien-he`; it is not an upload control and does not submit data.

The final CTA may also expose `company.phone` as a `tel:` link. No copy may state that documents
were sent, received, stored, or will receive a guaranteed response while no real transport exists.

## 3. Scope

### In scope

- Reorder `/dich-vu` around the approved delivery-journey narrative.
- Preserve all six canonical services from `app/data/services.ts`.
- Separate the three core delivery stages from the three specialist programmes.
- Add Services-page-specific bilingual editorial content and ordering configuration.
- Use authentic project/workshop media already available through generated media records.
- Add stable section anchors for the six canonical service IDs.
- Preserve existing Services SEO and structured-data coverage.
- Add targeted responsive, locale, content-order, CTA, and accessibility checks.

### Out of scope

- Redesigning the global header, drawer, footer, or contact page.
- Adding file upload, email delivery, a database, API route, CRM, analytics transport, or third-party
  form service.
- Inventing client testimonials, certifications, project outcomes, delivery times, savings, defect
  rates, or production metrics.
- Replacing canonical service facts with mockup-only copy.
- Adding dependencies or manually editing generated media files or the media manifest.
- Updating visual-regression baselines without separate explicit approval.

## 4. Current-State Findings

The current page has a shared hero, one introduction, six visually equal `industrial-card`
services, and one drawings CTA. The data is accurate and bilingual, but the equal grid makes the
visitor interpret six offerings without a clear relationship between them.

The approved redesign keeps the data but changes its meaning through hierarchy:

- `design`, `factory-production`, and `construction` form the delivery spine.
- `hotel-interior`, `commercial-projects`, and `export-oem` become specialist engagement models.
- Workshop evidence sits between the two groups so the specialist claims follow physical proof.
- The drawings/BOQ invitation is introduced early and repeated once as the closing action.

## 5. Information Architecture

The page renders six ordered chapters. Section order is identical in Vietnamese and English.

### Chapter 1 — Shared hero

Reuse the current `AppHero` family, Services hero image, focal treatment, LCP behavior, and warm
atmosphere. Do not create a separate hero system.

The message should position Lai Huy as one accountable partner from technical development through
factory production and site installation. Keep the hero copy concise enough to fit the existing
fixed hero geometry in both locales.

The shared global header remains the above-the-fold contact action. The page-specific drawings CTA
begins immediately after the hero, avoiding a new Services-only API or layout inside `AppHero`.

### Chapter 2 — Project-document intake

Open with the approved context: “Hồ sơ đầu vào”. Present three document categories as a compact
ruled band rather than upload boxes:

1. Concept, layout, or design drawings.
2. Shop drawings, technical documentation, or a BOQ.
3. Material samples, finish standards, or packing requirements.

The band explains that these inputs can begin a scope discussion. It contains one primary link to
`/lien-he` and one secondary in-page link to the delivery journey. It must not use drag-and-drop,
attachment, progress, success, or other affordances that imply upload functionality.

### Chapter 3 — Core delivery journey

Use the heading “Hệ thống thực thi dự án toàn diện” and render the first three canonical services
as one continuous numbered rail:

1. `#design` — Design and technical development.
2. `#factory-production` — In-house furniture production.
3. `#construction` — Project interior contracting.

Each stage includes the canonical title, description, and details from `services.ts`. The rail
communicates handoff and accountability through number, rule, and layout—not through three
unrelated rounded cards.

On wide screens, use a 40/60 introduction-and-stage composition, with the stage content allowed to
alternate or step through the page. On small screens, preserve the same order as one vertical rail.
All three service IDs must be stable anchors.

### Chapter 4 — Production proof

Place a photographic proof chapter after the delivery spine. Its job is to substantiate the
factory-production stage, not to introduce a second factory page.

Use authentic workshop, machinery, material, craft, or QC media resolved through the generated
catalog and existing media joins. The composition may use one large environmental image and one
supporting detail image. Any facts must come from canonical factory/company data; qualitative
captions must remain modest and verifiable.

Use the approved proof framing:

- “Sản xuất quy mô lớn” as the operating-capacity theme.
- “Kiểm soát tại nguồn” as the material/QC theme.

Link to `/nha-xuong` for the complete workshop story. Do not duplicate the full factory workflow,
gallery, or statistics set on this page.

### Chapter 5 — Specialist programmes

Under “Lĩnh vực & loại hình hợp tác”, render the remaining three services in this order:

4. `#hotel-interior` — Hotel and resort interiors.
5. `#commercial-projects` — Commercial interiors.
6. `#export-oem` — OEM and export production.

These programmes answer “where does the delivery system apply?” They should be visually distinct
from the core rail while remaining part of one page system. Use editorial split rows or a restrained
media-and-copy composition rather than returning to a three-card grid.

Each programme retains its canonical description and details. Do not add unsupported hospitality
star ratings, client logos, export markets, certifications, or performance claims.

### Chapter 6 — Drawings/BOQ contact

Close with a dark, high-contrast CTA using the approved intent:

> Có bản vẽ hoặc BOQ? Trao đổi phạm vi dự án và BOQ sơ bộ cùng Lai Huy Interior.

Provide two explicit actions:

- Navigate to `/lien-he` to view the contact options.
- Call `company.phone` through a `tel:` link.

The CTA may say “Gửi bản vẽ” as an invitation only when the adjacent copy makes the actual next
step clear: open contact information and begin a discussion. It must not render an upload surface
or delivery-success message.

## 6. Visual Language

### Preserve

- Inter typography and the existing uppercase, high-weight heading language.
- `ink` and `wood` semantic tokens from `app/assets/css/main.css`.
- The shared 1280px shell, established section rhythm, focus treatment, reveal behavior, and
  reduced-motion contract.
- The shared `AppHero` geometry and readability contract.
- Existing `MediaImage`/media URL behavior and intrinsic image dimensions.

### Change

- Replace six equal cards with a clear 01–06 hierarchy.
- Use thin rules, numbering, asymmetric 40/60 and 60/40 layouts, and large real photography.
- Let the core stages read as one system; let specialist programmes read as applications of that
  system.
- Use wood as a controlled accent for sequence numbers, rules, and primary actions.
- Reserve rounded cards for genuinely bounded interactive/media content; avoid decorative shadows
  and card proliferation.

### Photography

- Hero remains the current Services project image unless implementation review finds a factual or
  crop issue.
- Proof imagery must depict real workshop, machinery, material, craft, or QC activity.
- Below-the-fold media loads lazily and uses localized alt text.
- Do not add autoplay video, carousel, parallax, or decorative stock photography.

## 7. Content and Data Architecture

### Canonical service data

`app/data/services.ts` remains the source of truth for the six service IDs, icons, titles,
descriptions, and detail lists. The redesign must not duplicate these facts in the page component.

### Page-specific content

Add a small typed Services-page content module only if needed. It may own:

- Hero and section framing copy.
- Document-intake labels.
- Core and specialist ordered ID lists.
- Proof captions and localized media alt text.
- CTA support copy and labels.

It must not copy service descriptions or details from `services.ts`, company contact values from
`company.ts`, or factory facts from their canonical data source.

### Page orchestration

`app/pages/dich-vu.vue` owns:

- SEO and JSON-LD orchestration.
- Joining ordered IDs to canonical service records.
- Joining approved media records to presentation content.
- The six-chapter order.
- Page-level links and anchors.

If repeated markup justifies extraction, page-specific presentation components may render the core
journey rail, proof chapter, and specialist programmes. They receive data through props and must
not import or select business data internally.

## 8. Responsive Behavior

### Below 768px

- Render all content in source order.
- Document inputs become three stacked ruled rows.
- Core services form one vertical 01–03 rail.
- Proof images stack with the environmental image first.
- Specialist programmes form three vertical editorial rows.
- CTA actions stack and remain full-width/touch-friendly where appropriate.

### 768px to 1279px

- Use two-column layouts only where copy remains readable in both locales.
- Keep the core rail continuous; do not create a dense three-column service grid.
- Ensure the longer English service titles do not collide with numbers or actions.

### 1280px and above

- Use the approved 40/60 and 60/40 editorial compositions.
- Maintain the shell width and avoid full-viewport text lines.
- Keep proof media subordinate to the page narrative rather than forming an unrelated gallery.

Verify at 767/768 and 1279/1280, plus representative 390px, 834px, and 1440px viewports.

## 9. Accessibility and Interaction

- Use semantic sections and a logical heading hierarchy with one page-level `h1` supplied by the
  hero.
- Use an ordered list for the 01–03 core journey where possible.
- Preserve meaningful source order independently of desktop visual alternation.
- Give all six canonical service anchors a focusable, non-obscured destination.
- Keep link labels explicit in both locales; do not rely on icons alone.
- Provide localized, factual alt text for informative media and empty alt text for decorative media.
- Preserve visible keyboard focus and respect reduced motion.
- Do not create non-functional upload zones or controls.

## 10. SEO and Structured Data

- Preserve the canonical route, organization schema, breadcrumb schema, and `CollectionPage`
  identity.
- Preserve all six services in the JSON-LD `ItemList` using canonical service content.
- Keep `numberOfItems` and list positions aligned with the visible 01–06 order.
- Preserve `company.seo.services` title, description, and Open Graph media unless a separate SEO
  content change is explicitly approved.
- Anchors do not create locale-prefixed or independently indexable routes.

## 11. Verification Criteria

Implementation is acceptable when:

- All six canonical services are present in the approved 01–06 order in Vietnamese and English.
- The first three services read as one delivery journey and the last three as specialist programmes.
- The proof chapter uses real catalog-backed media and no invented claims.
- Both CTA locations navigate to real contact options without implying successful submission.
- `/lien-he`, `/nha-xuong`, phone, and in-page links have correct destinations.
- Responsive layouts remain usable immediately below, at, and above 768px and 1280px.
- Keyboard focus, heading hierarchy, anchors, alt text, and reduced-motion behavior remain sound.
- Existing Services SEO and six-item structured data remain correct.
- Relevant lint, media-literal guard, typecheck, unit, production build, targeted Playwright layout,
  accessibility, text, locale, and hero checks exit successfully.
- No visual-regression baseline is updated without explicit approval.

## 12. Approved Decision and Deferred Work

The user reviewed three layout directions in one browser comparison view and selected Option A,
“Hành trình bàn giao”, on 2026-08-13. Options B and C are not implementation alternatives unless
the user reopens the design decision.

This direction was implemented as an intermediate iteration and then superseded by Editorial V2.
Contact transport, file upload, content claims beyond canonical data, and baseline updates remain
separate decisions.
