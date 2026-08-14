# Homepage Eo Gió Material Story — Design Specification

**Date:** 2026-08-14
**Route:** `/`
**Status:** Approved design; awaiting written-spec review
**Supersedes:** The image-source and generation direction in `2026-08-13-homepage-material-story-images-design.md`

## Objective

Upgrade the homepage section “Một hành trình, một đầu mối” / “Từ hồ sơ kỹ thuật đến không gian hoàn thiện” so its final proof is the actual completed reception area of Khách sạn Eo Gió. The three preceding images are purpose-built GPT Image transformations that explain how the curved reception counter moves from documentation through material resolution and direct manufacturing.

The sequence must combine cinematic continuity with documentary credibility. It must not imply that an AI-generated workshop image is an actual photograph of Lai Huy’s factory.

## Approved Direction

The approved direction is **C — Hybrid điện ảnh**:

1. frames 01 and 02 preserve the exact camera, perspective, lobby divisions, and curved-counter silhouette of the completed Eo Gió photograph;
2. frame 03 changes to a clean joinery workshop while preserving the counter silhouette, viewing height, subject scale, and left-to-right composition closely enough to support the transition;
3. frame 04 uses the existing, unmodified Eo Gió project photograph as the factual endpoint.

The curved counter is the visual anchor across the series. Exact background continuity is required for frames 01 and 02; frame 03 prioritises a truthful manufacturing context over an implausible pixel-identical lobby background.

## Master Photograph

- Existing media identity: `projects/khach-san-eo-gio/sanh-don/24.webp`.
- Existing source dimensions: `2560 × 1600` (`16:10`).
- The photograph remains the frame-04 source and is not regenerated, retouched, relit, extended, or replaced by AI.
- The existing generated media catalog entry is reused. A duplicate homepage copy of the project photograph is not created.
- The story presentation may override its editorial alt text to `''` because the adjacent semantic stage copy already identifies and explains the image.
- Normal responsive `object-fit: cover` behaviour is allowed; no destructive source crop is introduced.

## Shared Image Contract

Frames 01–03 are generated as new versioned assets from the master photograph. They must:

- use a `16:10` canvas and the same output dimensions as one another;
- preserve the master’s eye level, lens character, vanishing points, main architectural divisions, and curved-counter footprint where the stage permits;
- keep the counter as the dominant subject, slightly left of centre;
- keep critical counter geometry inside the central 80% for responsive cropping;
- progress from cool technical neutrals to warm raw walnut, ending with the naturally warm completed photograph;
- contain no people, readable labels, invented company branding, added logos, watermarks, branded machinery, or fabricated project signage;
- avoid warped joinery, duplicate counters, impossible reflections, floating tools, dirty-workshop theatre, loose sample clutter, or decorative additions unrelated to the stage;
- remain visually legible when rendered at approximately `640 × 400`.

The real Eo Gió signage already present in frame 04 is retained as part of the documentary photograph. It must not be recreated or invented in frames 01–03.

## Frame Specifications

### 01 — Hồ sơ kỹ thuật

Transform the master into a precise architectural perspective drawing. Preserve the curved counter, lobby divisions, ceiling, glazing, and principal furniture footprints as controlled linework. Use an ivory or pale technical-paper ground with charcoal, muted blue-grey, and restrained wood-coloured construction lines.

Dimension ticks and construction marks may be abstract, but no readable text or numbers are allowed. The result must feel like an authored architectural drawing, not a filtered photograph or a screenshot from CAD software.

### 02 — Vật liệu

Resolve the same composition partway from drawing to built space. Approximately 35–40% of the technical linework remains visible. Walnut, pale stone, matte-black metal, and restrained neutral upholstery appear in their eventual architectural locations rather than as a detached flat-lay or loose sample board.

The frame must be warmer and more materially resolved than frame 01, but clearly less complete than the real photograph. The counter silhouette and background divisions must remain aligned with the master.

### 03 — Xưởng trực tiếp

Show the Eo Gió curved-counter module being assembled in a clean joinery production bay. Preserve the counter’s silhouette, scale, camera height, and left-biased placement; the workshop background may differ from the completed lobby.

Use unfinished walnut, exposed edges, assembly seams, clamps, and a compact secondary CNC or bench cue. Workshop lighting, extraction, and surfaces should make direct manufacturing unmistakable without overwhelming the counter. The environment must read as production, not as on-site lobby installation or a completed showroom.

### 04 — Không gian hoàn thiện

Display the existing `sanh-don/24.webp` project photograph unchanged. This is the documentary proof and the visual payoff. No AI-generated substitute is permitted.

## Generation and Review Strategy

1. Treat `sanh-don/24.webp` as the immutable visual reference.
2. Generate one derivative per GPT Image call so each stage can be accepted or retried independently.
3. Derive frames 01 and 02 directly from the unchanged master.
4. Derive frame 03 from the unchanged master with an explicit instruction to preserve the curved-counter anchor while changing the environment to a credible workshop.
5. Inspect every candidate at original detail and at an exact `640 × 400` reduction.
6. Reject only the failed frame when geometry, semantics, clutter, crop safety, false text, or visual progression does not meet the contract.
7. Never use a generated derivative as the source for another derivative; this prevents cumulative geometry drift.

## Media Integration

- Add only frames 01–03 as new, descriptive, versioned source assets through the documented media scan, catalog, and optimisation workflow.
- Reuse the existing catalog record for `projects/khach-san-eo-gio/sanh-don/24.webp` as frame 04.
- Update the homepage media join so the `drawing`, `material`, and `factory` stage IDs resolve to the new generated entries and `space` resolves to the Eo Gió record with decorative alt text.
- Preserve the existing `HomeMaterialStory` public interface and the page-level stage ordering.
- Do not hand-edit `manifest.json`, `catalog.generated.ts`, or `fallback.generated.ts`.
- Do not delete the earlier generated v1 story assets or their manifest records in this scope. They become unused records unless a separate media-cleanup task is approved.
- Remote upload and verification use the existing media tooling. If Supabase credentials or configuration are unavailable, local fallback verification may proceed, but remote publication remains explicitly incomplete.

## Motion and Responsive Behaviour

- Keep the existing sticky desktop scene, progress thresholds, left-to-right layered reveal, and copy rail.
- Keep the existing normal-flow mobile layout and the reduced-motion fallback that displays all four frames.
- Do not add a motion dependency, scroll hijacking, autoplay, sound, or a second cinematic section.
- Do not apply stage-specific zoom or crop transforms. All story layers use the same static image geometry so the reveal seam does not create an avoidable scale jump.
- Frame 03 may have a different workshop background, but its counter silhouette and subject scale must visually bridge into frame 04.

## Failure Handling

- If an AI frame fails the acceptance contract, retain the last accepted assets and retry only that frame.
- If a new media entry does not resolve, the homepage mapping must not be committed with a missing key.
- If remote objects cannot be uploaded or verified, report that external prerequisite without claiming production readiness.
- Frame 04 must always resolve from the existing Eo Gió catalog entry; it must never fall back to an AI recreation.

## Verification Contract

### Media and code

- Confirm the three generated source files share one exact `16:10` dimension.
- Confirm frame 04 resolves to `projects/khach-san-eo-gio/sanh-don/24.webp` and not a duplicated or generated asset.
- Confirm all four stage IDs resolve and remain ordered `drawing`, `material`, `factory`, `space`.
- Run the focused homepage-story tests, `pnpm lint:media`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm build`.
- Run the media catalog drift and remote verification steps required by the available environment; record any credential-dependent skip or failure explicitly.

### Browser and visual review

- Inspect motion-enabled desktop at widths `768`, `1279`, `1280`, and `1440` at progress `0`, `0.5`, and `1`.
- Inspect normal-flow mobile at `390` and `767`.
- Inspect reduced motion at desktop width and confirm all four per-stage images are visible with non-zero boxes.
- Confirm no horizontal overflow, console error, missing story request, stage-specific scale jump, or incorrect final image.
- Confirm frame 03 reads as direct manufacturing and frame 04 visibly returns to the actual Eo Gió reception area.
- Do not update committed visual snapshots without separate approval.

## Out of Scope

- Changing the section heading, bilingual stage copy, progress timing, layout, or scroll mechanics.
- Retouching the Eo Gió master photograph.
- Replacing project, factory-proof, machinery, or gallery media elsewhere on the site.
- Deleting earlier story assets or performing a broad media cleanup.
- Adding a backend, analytics, a new image provider, or a new animation library.
