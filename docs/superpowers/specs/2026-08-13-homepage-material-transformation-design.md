# Homepage Material Transformation Design

**Date:** 2026-08-13
**Route:** `/`
**Status:** Approved for implementation
**Primary audience:** Project owners, developers, general contractors, hotel and hospitality operators

## Goal

Create a memorable homepage that demonstrates how Lai Huy Interior turns technical documentation into a completed interior. The visual impact must reinforce the commercial goal: persuade a qualified visitor to send drawings or begin a project discussion.

## Approved Direction

The approved direction is **“From materials to space”**: an architectural editorial page whose signature moment transforms through four stages as the visitor scrolls:

1. technical drawing;
2. material and wood selection;
3. direct workshop production;
4. completed interior.

Stitch was used as a secondary art-direction pass. Its ivory, charcoal, walnut, technical-rule, large-type, asymmetric-gallery, and bright pre-footer ideas are inputs. Its invented projects, metrics, offices, dates, media, and copy are not source material.

## Brand and Content Constraints

- Keep Vietnamese as the default and provide complete English equivalents through the existing localization helpers.
- Use the existing Inter font, wood/ink/paper tokens, shared shell, shared header, and shared footer.
- Use only generated catalog media and current typed business data.
- Do not add an animation dependency, scroll hijacking, autoplay, sound, custom cursor, or generated production imagery.
- Preserve a bright pre-footer that is visually distinct from the dark footer.
- Contact actions may link to `/lien-he`, email, or phone; they must not imply that a drawing was transmitted or received.

## Page Narrative

### 1. Cinematic hero

The existing Eo Gio project cover remains the eager LCP asset and keeps the `.hero-image` contract. Copy becomes more concise and editorial. The headline communicates design, direct manufacturing, and fit-out. A compact proof rail remains inside the image-backed hero without introducing locale-dependent height.

Primary action: view selected projects.
Secondary action: send drawings / discuss a project through `/lien-he`.

### 2. Signature material story

Heading: **“Từ hồ sơ kỹ thuật đến không gian hoàn thiện”** / **“From technical documentation to completed space.”**

At `768px` and above, the section occupies approximately `220vh` and contains one sticky viewport. Scroll progress drives a CSS custom property from `0` to `1`. Four media/graphic layers are revealed with opacity, transform, and clip-path only:

- 0–18%: technical-grid and linework treatment;
- 18–45%: warm wood/material crop;
- 45–72%: workshop layer takes over;
- 72–100%: completed project fills the stage.

The copy rail exposes the active chapter number and title. The sequence is one transforming stage, not four cards.

Below `768px`, the section becomes four normal-flow editorial frames with no sticky scene or long pinned scroll. Under `prefers-reduced-motion: reduce`, all content remains available as static editorial panels and transition duration becomes effectively zero.

If client JavaScript fails, the completed-space layer and all semantic copy remain visible. The animation is progressive enhancement, never the only way to access content.

### 3. Three core capabilities

Present only the three promises that make the transformation credible:

1. technical design and shop-drawing control;
2. direct factory manufacturing;
3. fit-out, installation, and handover.

The layout uses editorial numbering and technical rules, not generic rounded cards.

### 4. Selected work

Use the first three current featured projects. The first project is a wide visual anchor; the next two form a smaller offset pair. Every project remains a semantic link with name, category, location/scope where available, and current catalog cover media.

Hover may scale media slightly and move a wood-colored rule. Keyboard focus must be as visible as hover.

### 5. Factory proof

Combine current factory facts and machinery proof in a compact image-led composition. Reuse `factoryCapabilities`, `machineryProcessGroups`, `machinerySectionContent`, and `siteImages.machineryOverview`. Do not introduce new measurements or years.

### 6. Process rail

Keep the current `productionWorkflow` as a concise numbered rail and link to the full workflow on `/gioi-thieu#production-workflow`. This is supporting evidence rather than another cinematic section.

### 7. Bright closing conversion section

Close with the current proposition: send drawings so the technical team can assess materials, schedule, cost, and contracting scope. Use a paper/wood surface, strong rule, direct `/lien-he` action, factory link, email, and phone. The section must not share the footer’s dark surface.

## Component Architecture

- `app/pages/index.vue`: route composition, SEO, and current-data selection only.
- `app/data/home-page.ts`: typed bilingual page narrative and capability/story stage definitions.
- `app/components/HomeHero.vue`: home-only LCP hero and proof rail.
- `app/components/HomeMaterialStory.vue`: semantic story markup, responsive variants, and visual layers.
- `app/components/HomeCapabilities.vue`: three numbered promises.
- `app/components/HomeProjectStage.vue`: asymmetric featured-project layout.
- `app/components/HomeFactoryProof.vue`: current factory and machinery evidence.
- `app/components/HomeProcessRail.vue`: compact current workflow.
- `app/components/HomeProjectCta.vue`: bright final conversion section.
- `app/composables/useScrollProgress.ts`: requestAnimationFrame-throttled progress with cleanup and reduced-motion awareness.

## Motion and Performance

- No new runtime dependency.
- The composable listens to scroll/resize only while mounted and batches reads/writes in `requestAnimationFrame`.
- Only transform, opacity, filter, and clip-path are animated.
- The hero remains eager with explicit dimensions and `fetchpriority="high"`.
- Story and gallery media remain lazy and use catalog dimensions.
- The story exposes useful static SSR markup before hydration.

## Accessibility

- Maintain one `h1` and a sequential heading outline.
- Decorative drawing lines are `aria-hidden`.
- The mobile and desktop visual renderings must not duplicate semantic story copy to assistive technology; one ordered list owns the accessible narrative.
- Keyboard focus is visible on every project and CTA.
- Reduced motion removes sticky pinning and layered transforms.
- Color-contrast review remains required because the automated Axe suite excludes contrast.

## Verification Contract

- Content and links in both `vi` and `en`.
- Widths `390`, `767`, `768`, `1279`, `1280`, and `1440`.
- Story progress at start, middle, and end on motion-enabled desktop.
- Normal-flow mobile layout and reduced-motion layout.
- No horizontal overflow, hidden content, duplicate headings, or console errors.
- Existing hero locale-invariance, machinery, text, layout, accessibility, type, media, and build gates remain green.
- Visual snapshots are not updated without separate approval.
