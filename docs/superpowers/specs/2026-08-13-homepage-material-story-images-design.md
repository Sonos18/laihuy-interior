# Homepage Material Story Image Series — Design Specification

Date: 2026-08-13
Status: Approved storyboard; awaiting written-spec review

## Objective

Replace the four reused project/workshop photographs in the homepage section “Từ hồ sơ kỹ thuật đến không gian hoàn thiện” with a purpose-built editorial series. The series must make the transformation from technical documents to a completed interior immediately legible while preserving the section’s existing scroll choreography.

These are conceptual editorial images, not documentary photographs of a named Lai Huy project or factory. They remain decorative in the accessibility tree. The actual factory-evidence section below continues to use documented Lai Huy workshop photography.

## Approved Direction

The series follows one hotel-reception module from design to delivery. All four images use the same camera position, eye level, vanishing points, reception-counter footprint, ceiling geometry, and feature-wall proportions.

The visual progression is:

1. technical line drawing;
2. material and sample resolution;
3. workshop assembly;
4. completed hotel reception.

The transition should feel like the same image being progressively resolved, not four unrelated photographs.

## Shared Image Invariants

- Landscape composition designed for a 16:10 display crop.
- Camera equivalent: 24–28 mm architectural lens at eye level.
- Main reception module centred slightly left of frame so the existing right-side copy remains readable.
- One diagonal light source from camera-left; colour temperature warms gradually from stage 1 to stage 4.
- Palette: ivory, charcoal, walnut brown, muted stone, and matte black metal.
- Contemporary hospitality interior; restrained, buildable geometry.
- No people, company logos, signage, readable text, watermark, branded products, or decorative clutter.
- No warped joinery, impossible reflections, duplicate fixtures, floating objects, or inconsistent perspective.
- Critical geometry must remain inside the central 80% to survive responsive `object-fit: cover` cropping.

## Frame Specifications

### 01 — Technical Documents

A precise architectural perspective drawing of the reception counter, ceiling, and feature wall. Ivory and muted-wood linework sits on a charcoal technical-grid background. Dimension ticks and construction marks may appear as abstract linework, but no readable labels or numbers are allowed. The image is graphic and editorial rather than a screenshot from CAD software.

### 02 — Materials & Samples

The same composition is partially materialised. Walnut veneer, ivory stone, dark metal, and neutral fabric occupy their eventual architectural zones. Approximately 35% of the technical linework remains visible as a controlled overlay, visually connecting this frame to stage 1. The result should feel like a material approval board becoming a room, not a loose flat-lay collage.

### 03 — Direct Manufacturing

The same reception module is shown during workshop assembly. The counter and wall modules preserve the approved geometry and viewing angle. CNC equipment, clamps, and tools stay secondary and slightly soft in the background. Surfaces show realistic unfinished edges and assembly seams without making the workshop dirty or theatrical.

### 04 — Completed Space

The module is installed in a refined contemporary hotel lobby. Walnut, ivory stone, and matte-black details are fully resolved under warm architectural lighting. Styling is minimal and the space is unoccupied. The reception module remains the unmistakable subject and matches the geometry of all prior frames.

## Generation Strategy

1. Generate frame 04 as the master architectural composition.
2. Save and inspect the master before deriving other frames.
3. Use the master as the explicit visual reference for frames 03, 02, and 01 so perspective and module geometry remain stable.
4. Generate one frame per call with a stage-specific prompt and repeat the invariants in every prompt.
5. Inspect each output for geometry, cropping safety, false text, watermarking, and visual continuity.
6. If a frame fails, iterate only on the failed stage while retaining the approved master reference.

## Integration

- Store final selected sources under the project’s documented media source tree with descriptive, versioned filenames.
- Add them through the existing scan/catalog/optimisation workflow; do not hand-edit generated catalog or manifest files.
- Join the generated media entries to `HomeMaterialStory` in `app/pages/index.vue`.
- Keep all four images decorative (`alt: ''`) because the adjacent text already names and explains each stage.
- Do not replace the factual workshop photograph used by the factory-proof section.

## Verification

- Confirm all four media entries resolve locally and through the configured media provider.
- Confirm the scroll scene reads correctly at progress 0, 0.5, and 1.
- Check crops at 768, 1279, 1280, and 1440 px; check normal-flow cards at 390 and 767 px.
- Verify no horizontal overflow and no missing image requests.
- Verify reduced-motion mode displays all four frames in normal flow.
- Run media literal guard, catalog drift checks required by the media workflow, unit tests, typecheck, and a production build.

## Out of Scope

- Reworking the section layout, copy, timing, or scroll mechanics.
- Replacing actual project or factory-evidence photography elsewhere on the site.
- Adding new analytics, backend services, or remote upload behaviour beyond the existing media tooling.
