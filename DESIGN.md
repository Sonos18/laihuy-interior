---
name: Lai Huy Interior
description: Factory-direct interiors for hospitality and premium residences, presented as a quiet, warm workshop.
colors:
  bronze: "#b8875a"
  bronze-light: "#d4a373"
  timber-deep: "#7c5032"
  timber-mid: "#9b6a43"
  linen: "#faf6f0"
  raw-silk: "#f5f2eb"
  sawdust: "#f0e3d4"
  paper-white: "#ffffff"
  obsidian: "#0b0a09"
  charcoal-ink: "#181614"
  walnut-grey: "#5d5349"
  dust-grey: "#74685d"
  plaster-line: "#d8d2ca"
  kiln-red: "#b23c2a"
  kiln-red-deep: "#8a2e1f"
typography:
  display:
    fontFamily: "Outfit, Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 1.75rem + 2.8vw, 4.5rem)"
    fontWeight: 500
    lineHeight: 1.04
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Outfit, Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: "clamp(1.875rem, 1.4rem + 1.8vw, 3rem)"
    fontWeight: 500
    lineHeight: 1.12
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Outfit, Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: "clamp(1.25rem, 1.15rem + 0.5vw, 1.5625rem)"
    fontWeight: 500
    lineHeight: 1.24
    letterSpacing: "-0.02em"
  stat:
    fontFamily: "Outfit, Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: "clamp(1.5rem, 1.3rem + 1vw, 2.125rem)"
    fontWeight: 500
    lineHeight: 1.15
  lead:
    fontFamily: "Inter, Segoe UI, sans-serif"
    fontSize: "clamp(1rem, 0.95rem + 0.35vw, 1.1875rem)"
    fontWeight: 400
    lineHeight: 1.65
  body:
    fontFamily: "Inter, Segoe UI, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.7
  label:
    fontFamily: "Inter, Segoe UI, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "0.18em"
  nav:
    fontFamily: "Inter, Segoe UI, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "0.12em"
  action:
    fontFamily: "Inter, Segoe UI, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.01em"
rounded:
  edge: "4px"
  pill: "9999px"
spacing:
  gutter: "24px"
  gutter-md: "32px"
  section: "64px"
  section-md: "88px"
  shell-measure: "1280px"
  control: "44px"
components:
  button-primary:
    backgroundColor: "{colors.bronze}"
    textColor: "{colors.obsidian}"
    typography: "{typography.action}"
    rounded: "{rounded.pill}"
    padding: "14px 28px"
    height: "48px"
  button-primary-hover:
    backgroundColor: "{colors.bronze-light}"
    textColor: "{colors.obsidian}"
  button-outline:
    textColor: "{colors.charcoal-ink}"
    typography: "{typography.action}"
    rounded: "{rounded.pill}"
    padding: "14px 28px"
  button-outline-hover:
    backgroundColor: "{colors.charcoal-ink}"
    textColor: "{colors.linen}"
  card:
    backgroundColor: "{colors.paper-white}"
    textColor: "{colors.charcoal-ink}"
    rounded: "{rounded.edge}"
    padding: "24px"
  input:
    backgroundColor: "{colors.paper-white}"
    textColor: "{colors.charcoal-ink}"
    rounded: "{rounded.edge}"
    padding: "12px 16px"
    height: "50px"
  chip:
    textColor: "{colors.walnut-grey}"
    typography: "{typography.action}"
    rounded: "{rounded.pill}"
    padding: "12px 20px"
  chip-active:
    backgroundColor: "{colors.charcoal-ink}"
    textColor: "{colors.linen}"
  nav-item:
    textColor: "{colors.walnut-grey}"
    typography: "{typography.nav}"
    height: "{spacing.control}"
    padding: "0 8px"
---

# Design System: Lai Huy Interior

## Overview

**Creative North Star: "The Quiet Workshop"**

Lai Huy's interface behaves like a well-run workshop at midday: warm light on linen and sawn timber, tools put away, the work itself on display. Capability is shown, not announced. Photography of real rooms and the factory carries the drama; the interface stays calm, warm and exact around it, the way a finished cabinet face is calm because the joinery behind it is precise.

The page reads as one continuous warm-light surface. Darkness is reserved for two places only: the photographic hero, where an obsidian scrim lets copy sit on the image, and the footer, which closes the page. Sections are separated by small steps in warm tone (linen, raw silk, sawdust) and by hairlines, never by flipping between light and dark. Components feel warm and tactile, like a finished timber surface: soft bronze, gently eased edges, generous padding, nothing glossy.

The system rejects consumer furniture e-commerce, boilerplate construction templates, SaaS product pages and generic AI landing pages. It also rejects alternating light and dark section bands, which the owner found jarring.

**Key Characteristics:**
- One continuous warm-light canvas; dark only for the photo hero and the footer.
- Outfit at weight 500 for display and headings, Inter for reading; sentence case throughout.
- Bronze is the single accent: the primary action, eyebrow rules, active markers.
- Flat surfaces separated by tone and hairlines; shadow only as a response to interaction.
- 4px edges for anything that holds content, pills for anything you press.
- Slow, editorial motion that always yields to `prefers-reduced-motion`.

## Colors

A warm, low-chroma palette of linen, timber and bronze, anchored by a near-black obsidian that never reaches pure black.

### Primary
- **Workshop Bronze** (#b8875a): the one accent. Fills the primary action, draws the 20×1px rule before eyebrows, marks active and current states. Its rarity is what makes it read as a decision.
- **Polished Bronze** (#d4a373): hover state of the primary action, and eyebrow text where it sits on the dark hero scrim.

### Secondary
- **Deep Timber** (#7c5032): accent text on light surfaces (eyebrows, inline links, active nav), and the 1px border that gives bronze buttons enough edge contrast on light surfaces.
- **Mid Timber** (#9b6a43): the focus ring color and hover border for interactive outlines.

### Neutral
- **Linen** (#faf6f0): the default page canvas.
- **Raw Silk** (#f5f2eb): the alternate section surface, one quiet step from linen.
- **Sawdust** (#f0e3d4): the emphasis band, used sparingly for the factory proof chapter or a closing CTA.
- **Paper White** (#ffffff): cards, form panels and inputs lifted off the linen canvas.
- **Obsidian** (#0b0a09): hero scrim, footer surface, and text on bronze fills. Never pure #000.
- **Charcoal Ink** (#181614): primary text and headings on light surfaces.
- **Walnut Grey** (#5d5349): secondary text, idle nav and chip labels (7.4:1 on white).
- **Dust Grey** (#74685d): captions and metadata only (5.4:1 on white, 5.0:1 on linen). Never on Sawdust, where it drops to 4.3:1; use Walnut Grey there.
- **Plaster Line** (#d8d2ca): the base of every hairline and card border on light surfaces, usually at 60% opacity.
- **Kiln Red** (#b23c2a) and **Deep Kiln Red** (#8a2e1f): form error border and error message text. Nowhere else.

### Named Rules
**The One Accent Rule.** Bronze is the only accent hue. No second brand color, no gradients between accents, no saturated badges.

**The Warm Light Rule.** Body sections sit on linen, raw silk or sawdust. Obsidian surfaces appear only behind the hero photograph and in the footer; a dark band in the middle of a page is drift.

**The Bronze Edge Rule.** On light surfaces a bronze-filled button carries a 1px Deep Timber border: bronze alone reaches only about 2.9:1 against linen, under the 3:1 non-text contrast floor.

## Typography

**Display Font:** Outfit (with Plus Jakarta Sans, system-ui)
**Body Font:** Inter (with Segoe UI, sans-serif)

**Character:** Outfit's open geometry at a measured weight 500 gives headings the composure of an architect's title block; Inter carries long Vietnamese copy with clean diacritics at small sizes. Neither ever shouts.

### Hierarchy
- **Display** (Outfit 500, clamp(2.25rem → 4.5rem), 1.04, -0.025em): the home hero headline only, balanced wrapping, max width about 64rem.
- **Headline** (Outfit 500, clamp(1.875rem → 3rem), 1.12, -0.02em): section headings on every page.
- **Title** (Outfit 500, clamp(1.25rem → 1.5625rem), 1.24, -0.02em): card and pillar headings.
- **Stat** (Outfit 500, clamp(1.5rem → 2.125rem), 1.15): metric values in hero metrics and factory stats.
- **Lead** (Inter 400, clamp(1rem → 1.1875rem), 1.65): section introductions, measure 48ch.
- **Body** (Inter 400, 1rem, 1.7): running text, measure 56ch (about 68 characters), never beyond 75 characters per line.
- **Label** (Inter 600, 0.75rem, 0.18em, uppercase): eyebrows and kickers. The only uppercase text in the system besides nav items.
- **Nav** (Inter 600, 0.8125rem, 0.12em, uppercase, line-height 1): header navigation.
- **Action** (Inter 600, 0.875rem, 0.01em, sentence case): every button and chip label.

### Named Rules
**The Vietnamese Leading Rule.** Any prose at body size or smaller keeps line-height at 1.65 or more; tone marks need the room. This is enforced by the typography gate (T1).

**The Sentence Case Rule.** Headings and buttons are sentence case. Uppercase is limited to short labels and nav; a heading in continuous uppercase or weight 900 is drift.

## Layout

Content sits on a single rail: `.shell` caps content at 1280px with 24px gutters (32px from 768px), and every shell on every page resolves to one left edge and one measure. Sections breathe on a fixed vertical rhythm of 64px (88px from 768px). The footer runs looser: 80px of bottom padding (112px from 768px).

Composition favors editorial asymmetry over symmetric card walls: projects use a 1.35fr / 1fr split with one dominant case study and two satellites; the factory introduction runs 1.15fr / 0.85fr from 1024px; the closing CTA runs 1.45fr / 0.55fr. Collections that are genuinely uniform (the project index) step 1 → 2 → 3 columns.

Breakpoints are 768px (gutter and rhythm step, tablet grids) and 1280px (the chrome breakpoint: desktop navigation appears, header grows from 72px to 88px). 1024px is used by a few home compositions. Verify layouts immediately below, at and above 768 and 1280.

## Elevation & Depth

The system is flat at rest. Depth comes from tone (paper white on linen, raw silk against linen) and from hairlines of Plaster Line at 60%. Shadows exist only as a response to interaction or for genuinely floating chrome: a card lifts slightly on hover, the drawer casts one shadow, the scrolled header uses a 16px glass blur.

### Shadow Vocabulary
- **Rest lift** (`box-shadow: 0 2px 8px rgb(11 10 9 / 0.04)`): project cards at rest; barely there.
- **Hover lift** (`box-shadow: 0 8px 24px rgb(11 10 9 / 0.08)`): project cards on hover or focus.
- **Drawer** (`box-shadow: 0 0 40px rgb(11 10 9 / 0.28)`): the mobile drawer only, the one chrome shadow.

### Named Rules
**The Flat-By-Default Rule.** Surfaces are flat at rest. A shadow appears only on hover, focus or for floating chrome; glows and deep drop shadows are drift.

## Shapes

Two shape words only. Anything that holds content (cards, images, metric frames, form panels, inputs) has a gently eased 4px edge, like a sanded timber arris. Anything you press (buttons, chips, filter pills, carousel controls, language toggle targets) is a full pill. Images are cropped to fixed aspect ratios (16:10 for a lead image, 16:9 for satellites, 21:9 for the factory panorama) and never float without a frame. The material story reveals photographic layers with a left-to-right `clip-path` wipe.

## Components

### Buttons
Warm and tactile: a soft bronze surface that warms further under the hand.
- **Shape:** full pill (9999px), 48px tall, 44px minimum hit target.
- **Primary:** Workshop Bronze fill, Obsidian text, Action type in sentence case, 14px × 28px padding; 1px Deep Timber border on light surfaces.
- **Hover / Focus:** fill warms to Polished Bronze; an optional slow bronze sheen sweeps across on hover (disabled under reduced motion). Focus shows a 2px Mid Timber outline with 2px offset.
- **Outline:** transparent with a 1px Plaster Line border and Charcoal Ink text; fills Charcoal Ink with Linen text on hover. On the dark hero it uses a bronze hairline and Raw Silk text instead.

### Chips
- **Style:** pill, 12px × 20px, Action type; idle has a 1px Plaster Line border and Walnut Grey text.
- **State:** hover shifts the border to Mid Timber and text to Deep Timber; active fills Charcoal Ink with Linen text.

### Cards / Containers
- **Corner Style:** 4px edge.
- **Background:** Paper White on linen or raw silk.
- **Shadow Strategy:** Rest lift, Hover lift on interaction (see Elevation).
- **Border:** 1px Plaster Line; darkens to Dust Grey on hover.
- **Internal Padding:** 24px (28px from 1024px). Images scale to 1.03 over 700ms on hover.

### Inputs / Fields
- **Style:** Paper White field, 1px Plaster Line border, 4px edge, 12px × 16px padding, 16px text, labels in Inter 700 at 14px.
- **Focus:** border shifts to Mid Timber and the 2px Mid Timber focus outline stays visible.
- **Error:** Kiln Red border with the message in Deep Kiln Red, Inter 600 at 14px, phrased as how to fix the field.

### Navigation
- **Header:** transparent over the hero with a soft obsidian scrim; after scrolling it becomes white glass at 92% with a 16px blur and a Plaster Line bottom hairline, and hides on scroll down and returns on scroll up. Desktop items appear from 1280px.
- **Items:** Nav type, Walnut Grey on light glass (white at 72% over the hero), full color on hover and current, with a 1.5px underline that scales in over 400ms on the editorial curve.
- **Mobile:** a white drawer up to 336px wide over an obsidian overlay at 60% with an 8px blur; links in 24px Inter 600 with hairline dividers, current item in Deep Timber.

### Hero Metrics Strip
A four-up strip framed by a bronze hairline with a 4px edge; each metric pairs a Label in bronze with a Stat value and a softly pulsing bronze dot. The pulse stops under reduced motion.

### Spotlight Gallery Carousel
A centered 16:10 slide with its neighbours scaled to about 0.7 and dimmed; slides move on a 650ms transform, autoplay every 5 seconds, and controls are 44px pill buttons. Under reduced motion transitions collapse and autoplay stops.

## Do's and Don'ts

### Do:
- **Do** keep every body section on Linen, Raw Silk or Sawdust, and step between them by tone, not by switching to dark.
- **Do** use Workshop Bronze for the primary action and give it a 1px Deep Timber border on light surfaces.
- **Do** set headings in Outfit 500, sentence case, and keep prose at line-height 1.65 or more.
- **Do** use the 4px edge for content containers and pills for controls.
- **Do** separate content with Plaster Line hairlines at 60% before reaching for a shadow.
- **Do** move with the editorial curve (`cubic-bezier(0.22, 0.61, 0.36, 1)`), 240ms for hover and 400ms for state, and disable reveal, zoom, Ken Burns, sheen and pulse under `prefers-reduced-motion`.

### Don't:
- **Don't** alternate light and dark section bands; obsidian appears only behind the hero photograph and in the footer.
- **Don't** set headings in Inter 900 or continuous uppercase.
- **Don't** use 16px card or input radii; they belong to the retired interior-page system.
- **Don't** add a second accent hue, gradient text, neon, saturated badges, glassmorphism panels or deep drop shadows.
- **Don't** use bouncing or spring motion, constant looping distractions or heavy parallax.
- **Don't** hardcode hex values in components; use the palette tokens.

## Drift from this system (incumbent code, 2026-10-20)

This document records the target chosen with the owner. These parts of the current implementation do not yet match it and should converge section by section:

- Dark mid-page bands: the services and about dark sections, and most of `/du-an/[slug]` (facts, gallery, material story, finale) sit on obsidian or ink-950.
- Interior pages use the older type system (Inter 900 uppercase `.text-hero` and `.text-section-title`) and 16px radii on cards, forms and inputs.
- Interior pages (services, about, factory, careers, contact, projects index, project detail, error) still use the wood `.btn-primary` for their primary action; the home hero, the header, the footer and the home closing CTA already use the bronze sentence-case `.btn-bronze`. The shared `.btn-outline` is still Inter 700 rather than the Action type (600).
- Home card headings are split: the HomeMaterialStory and HomeCapabilities h3s are Inter 600, while the HomeProjectStage and HomeFactoryProof h3s are Outfit 500 (the Title role).
- Duplicate token declarations (obsidian/bronze/ivory in both `:root` and `@theme`), unused legacy tokens (`--color-wood`, `--color-warm`, `--radius-*`), the unused Syne font, and Nuxt UI `primary: 'amber'` with no Nuxt UI components rendered.
- `docs/design/redesign-concept-showcase.html` still renders a fully dark obsidian world; it remains a composition and motion reference only, and the owner's 2026-10-20 decision for a continuous warm-light canvas supersedes its surfaces. (`.agents/rules/laihuy-ux-ui.md` was aligned with this document on the same date.)
