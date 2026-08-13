# `/dich-vu` Editorial V2 Design

**Date:** 2026-08-13
**Status:** Approved by the user
**Approved draft:** `76be703c-da2f-4fc1-b512-855edab7ead7`, version 2

## Goal

Convince project owners and general contractors to discuss existing drawings or a BOQ with Lai Huy by presenting design, production, and installation as one image-led delivery story.

## Approved composition

1. Keep the shared Services hero image and shell, add a direct `/lien-he` action.
2. Place a bright editorial document-intake introduction below the hero, with the three accepted input types in a compact vertical index.
3. Render services 01–03 as spacious alternating editorial chapters with oversized sequence numbers, canonical copy, and real catalog-backed project/workshop images.
4. Place one controlled ink proof chapter in the middle of the page with factory imagery, the two existing operating-proof statements, and a `/nha-xuong` link.
5. Add a short four-image evidence strip using existing catalog records.
6. Render services 04–06 as a compact architectural index. Hover uses `wood-600` (`#7c5032`), white headings/arrows, and 80%-white descriptions.
7. Use a white final contact CTA before the shared ink footer so the two closing layers are visibly distinct.

## Constraints

- Preserve all six canonical service records and their visible order in both locales.
- Preserve the shared header, drawer, footer, SEO, JSON-LD, locale behavior, and media pipeline.
- Use Inter and existing ink, paper, and wood tokens only.
- Do not add upload, form transport, success state, invented metrics, dependencies, or hardcoded public/Supabase media URLs.
- Keep semantic source order and usable layouts at 390, 767/768, 1279/1280, and 1440 pixels.
- Do not update visual baselines or modify unrelated routes.

## Approval

The user approved the local mockup after changing the 04–06 hover state from ink to wood.
