# Homepage Existing-Condition Story — Design Specification

**Date:** 2026-08-14
**Route:** `/`
**Section:** “Một hành trình, một đầu mối”
**Status:** Approved design; awaiting written-spec review
**Supersedes:** The stage sequence, generated-frame count, and media-publication direction in `2026-08-14-homepage-eo-gio-material-story-design.md`

## Objective

Reframe the homepage delivery story around the transformation of one real Eo Gió reception space:

`Hiện trạng → Hồ sơ kỹ thuật → Vật liệu & mẫu → Không gian hoàn thiện`

The revised sequence begins before design documentation, removes the visually mismatched workshop frame, and ends with the unchanged documentary photograph of the completed Eo Gió reception. It should help owners and main contractors understand that Lai Huy starts by reading actual site constraints, then controls documentation and material decisions through completion.

The separate factory-proof and capability sections remain responsible for demonstrating direct manufacturing. Removing the factory frame from this story must not remove or weaken those sections.

## Approved Direction

Use **four stages in the same Eo Gió space**:

1. generate one new clean-shell existing-condition image from the immutable completed photograph;
2. reuse the approved technical-drawing image;
3. reuse the approved material-resolution image;
4. reuse the existing completed Eo Gió project photograph unchanged.

Only the first image is newly generated. The approved drawing and material images are not regenerated. The former factory image is removed from this section’s data and media join but remains in the media catalog as an unused asset; deleting or cleaning it up is outside this scope.

## Content Contract

### Section header

- Eyebrow remains:
  - VI: `Một hành trình, một đầu mối`
  - EN: `One journey, one accountable team`
- Title becomes:
  - VI: `Từ hiện trạng đến không gian hoàn thiện`
  - EN: `From existing condition to completed space`
- Description becomes:
  - VI: `Một đầu mối xuyên suốt từ khảo sát hiện trạng, triển khai hồ sơ, chốt vật liệu đến nghiệm thu không gian hoàn thiện.`
  - EN: `One accountable team leads the work from the existing-condition survey through documentation, material approval, and final sign-off.`

### Stage 01 — Hiện trạng

- ID: `existing`
- Label:
  - VI: `Hiện trạng`
  - EN: `Existing condition`
- Title:
  - VI: `Đọc đúng mặt bằng trước khi thiết kế`
  - EN: `Read the space before designing`
- Description:
  - VI: `Kích thước, cao độ, kết cấu và các đầu chờ MEP được khảo sát để khóa ràng buộc ngay từ đầu.`
  - EN: `Dimensions, levels, structure, and MEP interfaces are surveyed so site constraints are understood from the outset.`

### Stage 02 — Hồ sơ kỹ thuật

Reuse the current localized stage copy unchanged:

- ID: `drawing`
- Label: `Hồ sơ kỹ thuật` / `Technical documents`
- Title: `Đọc đúng trước khi làm` / `Read it right before making`
- Description continues to cover drawings, BOQ, finish standards, and trade interfaces.

### Stage 03 — Vật liệu & mẫu

Reuse the current localized stage copy unchanged:

- ID: `material`
- Label: `Vật liệu & mẫu` / `Materials & samples`
- Title: `Chạm vào quyết định thiết kế` / `Make the design decision tangible`
- Description continues to cover colour, grain, hardware, and construction checks before volume production.

### Stage 04 — Không gian hoàn thiện

Reuse the current localized stage copy unchanged:

- ID: `space`
- Label: `Không gian hoàn thiện` / `Completed space`
- Title: `Bản vẽ trở thành trải nghiệm` / `The drawing becomes an experience`
- Description continues to cover site installation, coordination, and sign-off.

## Master Photograph

- Existing media identity: `projects/khach-san-eo-gio/sanh-don/24.webp`.
- Existing source dimensions: `2560 × 1600` (`16:10`).
- It remains the frame-04 source and the immutable visual reference for the new frame 01.
- It must not be retouched, relit, extended, regenerated, or duplicated as a new homepage asset.
- The existing catalog record is reused with decorative alt text because adjacent semantic copy explains the frame.

## New Frame 01 Image Contract

Generate a single versioned image representing a **clean unfinished shell** before design documentation. Use the unchanged completed Eo Gió photograph as the direct image-editing reference.

The image must preserve:

- the same camera position, eye level, lens character, vanishing points, room proportions, and principal architectural divisions;
- the same direction and broad quality of natural light;
- critical geometry inside the central 80% so responsive crops remain stable;
- a calm right-side field suitable for the stage copy;
- a `16:10` canvas matching the approved generated drawing and material frames (`1586 × 992`) unless the image tool returns a technically equivalent size that the media pipeline normalizes without cropping.

The unfinished state must show:

- a clean bare concrete floor;
- unfinished wall and ceiling surfaces;
- restrained, credible exposed MEP interfaces or service points;
- an empty reception footprint with no finished joinery.

It must not contain:

- the reception counter, furniture, upholstery, decorative lighting, wall cladding, finish materials, loose samples, props, plants, or artwork;
- people, readable text, logos, watermarks, fabricated signage, safety slogans, or invented branding;
- demolition rubble, excessive dust, unsafe cables, dirty-construction theatre, or dramatic damage;
- warped architecture, duplicated openings, implausible MEP, or a changed camera perspective.

The result should feel like a professionally surveyed, ready-to-start interior shell rather than an abandoned building or active demolition site. Inspect it at original detail and at an exact `640 × 400` reduction before acceptance.

## Image Sequence and Media Mapping

The stage order and media join become:

| Order | Stage ID | Image source | Action |
| --- | --- | --- | --- |
| 01 | `existing` | `company/homepage-material-story/home-material-eo-gio-00-existing-v1.webp` | Generate and register locally |
| 02 | `drawing` | `company/homepage-material-story/home-material-eo-gio-01-drawing-v2.webp` | Reuse unchanged |
| 03 | `material` | `company/homepage-material-story/home-material-eo-gio-02-material-v2.webp` | Reuse unchanged |
| 04 | `space` | `projects/khach-san-eo-gio/sanh-don/24.webp` | Reuse real project photo unchanged |

The `HomeStoryStageId` union and `homeMaterialStoryMedia` mapping must replace `factory` with `existing`. No unresolved stage key or missing catalog lookup is acceptable.

Register the new image through the documented scan, catalog, and optimization workflow. Do not hand-edit `manifest.json`, `catalog.generated.ts`, or `fallback.generated.ts`.

This project uses **local fallback media only** for this scope:

- do not configure, call, upload to, or verify against Supabase;
- do not add Supabase environment variables or remote publication steps;
- verify the optimized local master and responsive variants through the production build and local preview;
- retain the existing media abstraction so this scoped change does not rewrite unrelated media architecture.

## Motion and Responsive Behaviour

- Preserve the existing sticky desktop story, four-stage progress model, copy rail, and transition timing.
- Present the images in the exact order `existing`, `drawing`, `material`, `space`.
- Use aligned crossfades and the existing restrained colour progression; do not introduce stage-specific zoom, scale, pan, parallax, or crop transforms.
- The bare shell should begin cool and neutral, the drawing remain technical, the material frame introduce walnut and finish warmth, and the real image provide the warm documentary payoff.
- Preserve the normal-flow mobile layout at widths below the desktop story threshold.
- Preserve the reduced-motion fallback in normal document flow, with all four per-stage images visible and non-zero in size.
- Do not add a motion library, scroll hijacking, autoplay, sound, or a second cinematic section.

## Component and Data Scope

Expected implementation surfaces are limited to:

- typed homepage stage data and bilingual story copy;
- homepage story media mapping;
- the one new generated source and its generated local media records/variants;
- focused homepage story unit and browser tests;
- any minimal component adjustment strictly required to support the `existing` stage’s presentation.

The component should continue to render from stage data rather than hard-code the four labels or sources. Drawing-specific grid or grayscale styling may remain keyed to `drawing`; the new `existing` frame must not inherit drawing-only treatment.

## Failure Handling

- Generate or retry only the new existing-condition frame. Never regenerate the accepted drawing or material frames as part of a retry.
- Always derive retries from the unchanged Eo Gió master, never from a generated derivative.
- Reject a candidate if its perspective, room divisions, crop safety, unfinished-state semantics, right copy field, or absence of forbidden content fails the image contract.
- If the new media entry does not resolve locally, do not commit a homepage mapping with a missing key.
- The completed frame must always resolve to the existing project photograph and never to an AI substitute.

## Verification Contract

### Data and media

- Confirm the stage ID union and rendered order are exactly `existing`, `drawing`, `material`, `space`.
- Confirm `factory` is absent from this story’s stage data and media join.
- Confirm the drawing and material media identities are unchanged.
- Confirm frame 04 resolves to `projects/khach-san-eo-gio/sanh-don/24.webp`.
- Confirm the new source is `16:10`, registered once, optimized locally, and resolvable without Supabase.
- Confirm no raw `/images/` literal is introduced in application code.

### Automated checks

Run, with Node 22 and exact exit-code reporting:

- focused homepage story unit tests;
- focused homepage story Playwright tests;
- `pnpm lint:media`;
- `pnpm lint`;
- `pnpm typecheck`;
- `pnpm test`;
- `pnpm build`.

Do not update committed visual snapshots without separate approval.

### Browser and visual review

- Inspect motion-enabled desktop at widths `768`, `1279`, `1280`, and `1440` at progress `0`, `0.5`, and `1`.
- Inspect normal-flow mobile at `390` and `767`, confirming four visible real image boxes in the correct order.
- Inspect reduced motion at desktop width, confirming the layered canvas is hidden and all four normal-flow stage images are visible.
- Compare transition seams to ensure all layers have the same rendered geometry with no scale or perspective jump.
- Confirm no horizontal overflow, console error, missing request, failed local story asset, or stage-specific crop regression.
- Confirm the first frame reads as an empty clean shell, not a finished lobby, workshop, demolition site, or generic unrelated room.
- Confirm the final frame remains visibly the real Eo Gió reception photograph.

## Out of Scope

- Regenerating the accepted drawing or material images.
- Retouching or replacing the real Eo Gió completion photograph.
- Deleting the old factory image or performing broad media cleanup.
- Removing or redesigning the separate factory-proof, machinery, capability, project, process, or CTA sections.
- Changing sticky timing, layout structure, breakpoints, or global design tokens beyond a minimal stage-specific correction.
- Adding Supabase, another remote image provider, a backend, analytics, or a new animation dependency.

## Acceptance Summary

The change is accepted when the section communicates one coherent same-space journey from surveyed shell to completed reception, the first frame is a credible clean Eo Gió existing condition, the approved middle frames remain intact, the final frame remains documentary, all four stages work across motion and fallback modes, and the entire flow resolves from local media without Supabase.
