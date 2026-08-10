# Homepage Machinery Section Redesign — Design Spec

## Status

Approved by the user on 2026-08-10. The approved visual direction is **A · V3**.

This document records the design only. It does not authorize a commit, snapshot rebaseline, media
upload, or unrelated homepage redesign.

## Goal

Redesign the homepage subsection labelled “Máy móc sản xuất / Machinery system” so that it:

- uses a real photograph of Lai Huy's workshop machinery instead of an interior-project image;
- reduces the height and repetition created by seven equally weighted text cards;
- presents the machinery as one coordinated production system rather than seven disconnected
  equipment descriptions;
- keeps the subsection subordinate to the existing “Năng lực nhà xưởng / Factory capability”
  section and preserves the homepage's current section order.

## Current State and Measured Problem

The current implementation is in `app/pages/index.vue` inside the merged factory-capability
section. It renders:

- `siteImages.aboutWorkspace`, a 2048×2560 interior/workspace photograph cropped to 4:3;
- the machinery title and description beside that image at `lg+`;
- all seven entries from `machinery` as a two-column card grid.

Measured in the current production build, the machinery block is approximately:

| Viewport | Current block height |
| --- | ---: |
| 1440×900 | 964px |
| 768×1024 | 1,423px |
| 390×844 | 1,639px |

The seven cards are individually 138–162px tall and the final odd card leaves an unbalanced
half-row on desktop. More importantly, the image depicts finished interior work while the copy
claims machinery and production capability.

## Scope

### In scope

- The machinery subsection inside the homepage's existing factory-capability section.
- A semantic workshop-machinery image mapping with localized alt text.
- A new bilingual four-group presentation model for the seven existing machines.
- Responsive layout, focus/hover styling, and targeted layout/accessibility coverage.

### Out of scope

- The four factory-capability metric cards above this subsection.
- Homepage section ordering, global section-spacing tokens, hero, services, projects, workflow,
  footer, or CTA bands.
- The `/nha-xuong` page and its gallery/equipment layout.
- Uploading or editing media, changing `app/shared/media/manifest.json`, or manually editing
  generated catalog files.
- Removing the existing `machinery` export unless a later implementation plan proves it unused
  and explicitly scopes that cleanup.
- Approving or updating Playwright visual baselines.

## Approved Layout

### 1. Intro becomes a stacked reading hierarchy

The eyebrow, title, and description must no longer be split into two columns on one row. They
form one left-aligned vertical stack:

1. eyebrow: “Máy móc sản xuất / Machinery system”;
2. `h3` title;
3. lead description, with a shorter measure than the title.

The stack has a narrow vertical accent rule using the existing wood token. The title remains one
semantic `h3`, but its final phrase is wrapped in an inline wood-coloured span:

- VI: “Hệ thống máy phục vụ sản xuất” + accent “nội thất dự án”;
- EN: “Machinery system for” + accent “project interior manufacturing”.

The lead text sits below the title with approximately 16–18px separation and a maximum readable
measure around 700–720px. It must not return to a side-by-side title/description arrangement at
any breakpoint.

Approved lead-copy direction:

- VI: “Xưởng ứng dụng hệ thống máy đồng bộ theo bốn công đoạn chính, giúp kiểm soát độ chính xác,
  chất lượng bề mặt và tiến độ cho các dự án khách sạn, villa và căn hộ cao cấp.”
- EN: “The workshop uses a coordinated machinery line across four core stages, controlling
  precision, surface quality, and schedule for hotel, villa, and premium apartment projects.”

### 2. Image and process groups share one row

At desktop widths (`lg+`), the proof area directly below the intro is one two-column grid:

- **55% image column on the left**;
- **45% process-group column on the right**;
- a 16px gap between the columns;
- both columns start and end on the same horizontal lines.

The layout must use intrinsic content and grid stretch, not a brittle fixed pixel height. The four
cards form a 2×2 grid; their content determines the proof area's minimum height and the image
fills the resulting shared height. This lets the English locale wrap safely without clipping.

The expected desktop machinery-block height is approximately 610–680px, down from 964px. This is
a design target for verification, not a fixed CSS height.

### 3. Real machinery image

Use `company/workshop/3.webp` from the existing generated `workshopMedia` collection. It is a wide
real photograph showing the Lai Huy production floor and multiple machines, so it represents a
system rather than one finished interior or one isolated machine.

The semantic media join belongs in `app/data/site-images.ts`, not in the generated catalog and not
as a raw URL/path in the page template. Add a named `machineryOverview` entry by looking up
`3.webp` from `workshopMedia` by filename and attaching localized alt text:

- VI: “Toàn cảnh hệ thống máy sản xuất tại xưởng Lai Huy”;
- EN: “Overview of the machinery line inside the Lai Huy workshop”.

Render it through `MediaImage` with lazy loading, reserved dimensions, skeleton behaviour, and an
explicit responsive `sizes` override appropriate to 100% width below `lg` and 55% at `lg+`.
Use `object-cover` with a centred focal point.

Use the dark translucent caption shown in the approved mockup inside the image's lower edge:

- left: “Hình ảnh thực tế tại xưởng / Real workshop photograph”;
- right: “Hệ thống máy sản xuất / Production machinery line”.

Because the caption repeats the image's meaning, it should be hidden from assistive technology to
avoid duplicate announcements; the image's localized alt text remains authoritative.

### 4. Four grouped process cards

Replace the homepage's seven long machine cards with four bilingual process cards. Keep the
source business copy in `app/data/factory.ts` as a typed `machineryProcessGroups` export. Each
group contains a localized title, concise localized benefit statement, and localized compact
machine-name line.

| No. | Group | Machines represented |
| --- | --- | --- |
| 01 | Cắt & tạo hình / Cutting & shaping | CNC Nesting; Cưa bàn trượt / Sliding table saw |
| 02 | Khoan & liên kết / Boring & connections | Máy khoan liên kết CNC / CNC boring machine |
| 03 | Dán cạnh & hoàn thiện / Edge banding & finishing | Máy dán cạnh tự động / Automatic edge bander |
| 04 | Xử lý bề mặt & ép / Surface treatment & pressing | Máy bào cuốn / Thickness planer; Máy chà nhám thùng / Wide-belt sander; Máy ép nguội thủy lực / Hydraulic cold press |

Every one of the seven existing machines must appear exactly once across these groups.

Use the following benefit statements so the implementation does not need to invent or recombine
business copy:

| No. | VI | EN |
| --- | --- | --- |
| 01 | Cắt và tạo hình chi tiết theo hồ sơ kỹ thuật, tối ưu vật liệu và giữ kích thước đồng nhất. | Cuts and shapes components to the technical documents, optimising material and dimensional consistency. |
| 02 | Gia công chính xác lỗ liên kết và vị trí phụ kiện, giúp lắp ráp nhanh và đồng bộ. | Machines connector holes and hardware positions precisely for faster, consistent assembly. |
| 03 | Hoàn thiện cạnh ván đồng đều, tăng độ bền, thẩm mỹ và độ ổn định của sản phẩm. | Finishes board edges uniformly to improve durability, appearance and product stability. |
| 04 | Kiểm soát độ phẳng, độ mịn và liên kết vật liệu trước khi chuyển sang hoàn thiện. | Controls surface flatness, smoothness and material bonding before final finishing. |

Each card contains:

- a small decorative sequence number;
- an `h4` group title;
- one short benefit-led sentence;
- a separated machine-name line at the bottom.

Cards use existing ink, wood, border, radius, and background tokens. Hover may change the border
and surface subtly, but no information or action may depend on hover.

### 5. CTA placement

Keep the existing “Xem năng lực nhà xưởng / View factory capability” destination and outline
button vocabulary. Place the CTA below the proof grid with a compact top margin and align it to
the right on desktop. On narrow screens it may align left. The explanatory annotation used in the
mockup (“Ảnh và nhóm công đoạn…”) is design guidance only and must not appear in production.

## Responsive Behaviour

### `lg+` (1024px and wider)

- Intro remains stacked.
- Proof grid is 55/45 with the image left and a 2×2 card grid right.
- Image and card column have equal rendered height.

### `md` to below `lg` (768–1023px)

- Intro remains stacked.
- Image moves above the cards and uses a wide 16:9 presentation to limit vertical growth.
- Cards remain 2×2 beneath the image.

### Below `md` (under 768px)

- Intro remains stacked with reduced padding and title size.
- Image uses a compact 4:3 presentation.
- Process cards become one column in numerical order.
- No horizontal scroll, clipped text, or collapsed tap/focus targets.

Locale wrapping must be checked in both Vietnamese and English. Card heights may grow naturally;
the image column must follow the grid height at desktop rather than forcing text into a fixed box.

## Accessibility and Semantics

- Preserve the heading outline: factory section `h2` → machinery title `h3` → group titles `h4`.
- Render the sequence numbers as decorative (`aria-hidden="true"`) or ensure they do not create
  noisy repeated announcements.
- Use the localized meaningful alt text on the machinery image.
- Hide the duplicate visual image caption from assistive technology.
- Preserve visible keyboard focus for the CTA.
- Do not rely on colour or hover alone to communicate group order or meaning.
- Verify both locales for heading wrapping and readable line lengths.

## Expected Implementation Surface

- `app/pages/index.vue`: replace the current image/title/seven-card subsection with the approved
  intro stack and 55/45 proof layout.
- `app/data/factory.ts`: add the typed bilingual four-group content.
- `app/data/site-images.ts`: add the semantic `machineryOverview` media join and alt text.
- A focused Playwright density/layout spec may be added under `tests/e2e/` so the 55/45 desktop
  relationship, equal-height columns, responsive stacking, and seven-machine coverage are not
  protected only by screenshots.

No new shared component is required unless the implementation plan demonstrates a second real
consumer. Keeping this subsection in `index.vue` is the smallest scoped change.

## Acceptance Criteria

1. The homepage uses the real workshop machinery photo, not `siteImages.aboutWorkspace`.
2. At `lg+`, the image is visually wider than the process column at approximately 55/45, and the
   two columns share the same top and bottom edges.
3. The eyebrow, title, and description are vertically stacked at every width.
4. Four cards represent all seven machines exactly once.
5. The final odd-card half-row from the old seven-card layout no longer exists.
6. At 768–1023px, image and cards stack with the cards remaining 2×2; below 768px, cards become
   one column.
7. Vietnamese and English render without overflow, clipping, or broken heading hierarchy.
8. The machinery block is materially shorter than the current measured baseline at representative
   desktop, tablet, and mobile viewports.
9. The CTA destination and factory-capability content above the subsection remain unchanged.
10. No raw `/images/` path, Supabase URL, generated catalog edit, or snapshot approval is added.

## Verification Required During Implementation

- `pnpm lint`
- `pnpm lint:media`
- `pnpm typecheck`
- `pnpm test`
- `pnpm build`
- Targeted Chromium checks for `/` in VI and EN at 390px, 767/768px, 1023/1024px, 1279/1280px,
  and 1440px widths.
- Relevant layout/text/accessibility gates, plus a direct geometry assertion for the desktop 55/45
  relationship and equal-height columns.
- `pnpm test:vr` may be run to report expected visual differences, but baselines must not be
  approved or updated without separate explicit permission.

External Supabase media availability must be recorded for browser evidence. Layout geometry must
remain valid while the image is loading because the media dimensions are known in advance.

## Resolved Decisions

- Chosen direction: A, grouped by production stage.
- Image/process ratio: 55/45.
- Intro: vertically stacked and left-aligned, not side-by-side.
- Desktop proof layout: image and process groups on the same row and equal height.
- Media: existing real workshop photo `3.webp`.
- Group count: four, covering all seven machines.

There are no unresolved design decisions in this scope.
