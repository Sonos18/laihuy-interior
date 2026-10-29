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
  monument:
    fontFamily: "Outfit, Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: "clamp(4rem, 2.4rem + 7vw, 9rem)"
    fontWeight: 500
    lineHeight: 0.92
    letterSpacing: "-0.035em"
  display:
    fontFamily: "Outfit, Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 1.75rem + 2.8vw, 4.5rem)"
    fontWeight: 500
    lineHeight: 1.04
    letterSpacing: "-0.025em"
  statement:
    fontFamily: "Outfit, Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 1.6rem + 2.4vw, 3.75rem)"
    fontWeight: 500
    lineHeight: 1.08
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

The page reads as one continuous warm-light surface. Darkness is reserved for two places only: the photographic hero, where a local obsidian wash behind the copy block (not a floor scrim) lets the copy sit on an image that otherwise stays visible, and the footer, which closes the page. Sections are separated by small steps in warm tone (linen, raw silk, sawdust) and by hairlines, never by flipping between light and dark. Components feel warm and tactile, like a finished timber surface: soft bronze, gently eased edges, generous padding, nothing glossy.

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

**The Warm Light Rule.** Body sections sit on linen, raw silk or sawdust. Obsidian surfaces appear only behind the hero photograph and in the footer; a dark band in the middle of a page is drift. One owner-approved exception (2026-10-24): on the home factory photograph, an Obsidian panel at 80% carries the factory facts. From 768px on a hover-capable pointer only its heading strip shows at the photograph's foot, and it rises over the photograph on hover or keyboard focus (transform, 400ms, editorial curve; instant under reduced motion). On a phone or touch-only pointer it is a plain light list below the photograph. It belongs to the photograph, not to the page surface. A second exception (owner, 2026-10-27): the floating header bar is Obsidian glass. It is chrome floating over the page, never a band in it (see Navigation).

**The Bronze Edge Rule.** On light surfaces a bronze-filled button carries a 1px Deep Timber border: bronze alone reaches only about 2.9:1 against linen, under the 3:1 non-text contrast floor.

## Typography

**Display Font:** Outfit (with Plus Jakarta Sans, system-ui)
**Body Font:** Inter (with Segoe UI, sans-serif)

**Character:** Outfit's open geometry at a measured weight 500 gives headings the composure of an architect's title block; Inter carries long Vietnamese copy with clean diacritics at small sizes. Neither ever shouts.

### Hierarchy
- **Monument** (Outfit 500, clamp(4rem → 9rem), 0.92, -0.035em, tabular figures, never wraps): one figure that already exists in the data, set as the statement that opens a chapter. Figures only, never words or headings; at most one per page; Charcoal Ink with its Label (Walnut Grey) directly above it, as in the Facts Band. It is paired with whitespace, never with a rule, box, tint or icon. Where a Monument opens a chapter above its section head, the head still comes first in the document (the figure is moved up with CSS `order`), so a screen reader announces the chapter before its figure. Today: "3.000 m²" opening the production chapter on `/nha-xuong`, the monthly room capacity in the factory chapter of `/gioi-thieu`. The home page has none: its factory section is a title (no eyebrow), one photograph carrying the factory facts, and a link to `/nha-xuong` (owner, 2026-10-23/24).
- **Display** (Outfit 500, clamp(2.25rem → 4.5rem), 1.04, -0.025em): the hero headline on every page (home and interior heroes), balanced wrapping, max width about 64rem.
- **Statement** (Outfit 500, clamp(2.25rem → 3.75rem), 1.08, -0.025em, max 18ch): the headline of the one lead section of a page, the section that states the page's argument after the hero. At most one per page; every other section heading is Headline.
- **Headline** (Outfit 500, clamp(1.875rem → 3rem), 1.12, -0.02em): section headings on every page.
- **Title** (Outfit 500, clamp(1.25rem → 1.5625rem), 1.24, -0.02em): card and pillar headings.
- **Stat** (Outfit 500, clamp(1.5rem → 2.125rem), 1.15): fact values that are figures ("3.000 m²", "Đến 50") in the Facts Band. A value that is a phrase ("Thiết kế → bàn giao", "Trọn gói") uses the Title role instead, so it reads as a statement and not as a broken number.
- **Lead** (Inter 400, clamp(1rem → 1.1875rem), 1.65): section introductions, measure 48ch.
- **Body** (Inter 400, 1rem, 1.7): running text, measure 56ch (about 68 characters), never beyond 75 characters per line.
- **Label** (Inter 600, 0.75rem, 0.18em, uppercase): eyebrows and kickers. The only uppercase text in the system besides nav items.
- **Nav** (Inter 600, 0.8125rem, 0.12em, uppercase, line-height 1): header navigation.
- **Action** (Inter 600, 0.875rem, 0.01em, sentence case): every button and chip label.

### Named Rules
**The Vietnamese Leading Rule.** Any prose at body size or smaller keeps line-height at 1.65 or more; tone marks need the room. This is enforced by the typography gate (T1).

**The Sentence Case Rule.** Headings and buttons are sentence case. Uppercase is limited to short labels and nav; a heading in continuous uppercase or weight 900 is drift.

## Layout

Content sits on a single rail: `.shell` caps content at 1280px with 24px gutters (32px from 768px), and every shell on every page resolves to one left edge and one measure. Sections breathe on a fixed vertical rhythm of 64px (88px from 768px). The footer is compact: 32px of padding above and below (40px from 768px).

Composition favors editorial asymmetry over symmetric card walls: projects use one dominant case study and two satellites, split 1.35fr / 1fr from 768 to 1023px and 2.1fr / 1fr from 1024px (lead 16:10, satellites stacked 16:9); the factory introduction runs 1.15fr / 0.85fr from 1024px; the closing CTA runs 1.45fr / 0.55fr. The project index (`/du-an`) is two chapters, not one wall: the projects whose scope covers design, production and construction open it as that same lead + satellites composition (derived from the scope rule, never from a list of slugs), and every other project follows as a quieter archive grid that steps 1 → 2 → 3 → 4 columns (640, 1024 and 1280px). Collections that are genuinely uniform step the same way.

Breakpoints are 768px (gutter and rhythm step, tablet grids) and 1280px (the chrome breakpoint: desktop navigation appears, header grows from 72px to 88px). 1024px is used by a few home compositions and by the section heads below. Verify layouts immediately below, at and above 768 and 1280.

### Section heads
A section head is its Label eyebrow, its heading and, when there is one, its lead (or one action in place of the lead). Three layouts are sanctioned; each head carries its name in `data-head`, and they all collapse to Stacked below 1024px:
- **Stacked** (`stacked`): eyebrow, heading and lead in one column, left on the rail. Also the layout of a head that sits in a side column of its own section's grid (beside a photograph, above a list of actions). With the Statement role it becomes the stacked-wide head of a page's lead section: the heading spans up to 18ch and the lead runs below it.
- **Split** (`split`): from 1024px the eyebrow and heading take the left column (about 5/8) and the lead, or the section's one action, sits in the right column on the heading's last line (`align-items: end`).
- **Rail** (`rail`): from 1024px the eyebrow sits alone in a narrow left rail (a quarter of the measure) on the heading's first baseline, and the heading and lead take the remaining three quarters. Content that continues the head's argument (the FAQ list) may hang from the same column; other content returns to the full measure.

**The No-Echo Rule.** Two consecutive section heads on a page never share a layout; a head hidden from view (screen-reader only) does not count. Owner exception (2026-10-24): on home the material story head (eyebrow and title only, its lead moved beside the photograph) and the capabilities head are both Stacked. Every head stays inside the shell; a full-width head starts on the shell's content edge (for a Rail head, its eyebrow does).

### Breath
On a long page (`/dich-vu`, `/gioi-thieu`, a case study) one photograph may run full-bleed between two sections as a pause in the reading: the full viewport width, 16:7 below 768px and 21:9 from 768px (capped at 46rem tall), no radius, no caption block, no overlay or scrim, and decorative (`alt=""`, it repeats a photograph the page already shows or one from the same project). At most one per page; never a factory photograph; never a dark band (it is a photograph, not a surface). It reuses an existing media entry (`data-breath`). On a case study it is the widest landscape (aspect 1.5 or more) among the photographs no chapter has used; a short set with none to spare takes it from the gallery's own. The home page carries none (owner, 2026-10-23). It is a `div`, not a `figure`: with no caption, a figure is announced as an empty figure.

### Seams
Every seam between two light sections (Linen, Raw Silk, Sawdust) carries a Plaster Line hairline, even where the tone step exists: Linen and Raw Silk are one quiet step apart and read as one surface without it. A seam against the hero photograph, a breath photograph or the footer needs none.

## Elevation & Depth

The system is flat at rest. Depth comes from tone (paper white on linen, raw silk against linen) and from hairlines of Plaster Line at 60%. Shadows exist only as a response to interaction or for genuinely floating chrome: a card lifts slightly on hover, the drawer casts one shadow, the scrolled header uses a 16px glass blur.

### Shadow Vocabulary
- **Rest lift** (`box-shadow: 0 2px 8px rgb(11 10 9 / 0.04)`): project cards at rest; barely there.
- **Hover lift** (`box-shadow: 0 8px 24px rgb(11 10 9 / 0.08)`): project cards on hover or focus.
- **Drawer** (`box-shadow: 0 0 40px rgb(11 10 9 / 0.28)`): the mobile drawer only, the one chrome shadow.

### Named Rules
**The Flat-By-Default Rule.** Surfaces are flat at rest. A shadow appears only on hover, focus or for floating chrome; glows and deep drop shadows are drift.

## Motion

Motion is slow, editorial and one-shot: things arrive once, settle, and stay still. Nothing loops. Fewer things move, and each move has a job: a heading arrives as one thought, a grid arrives as one row of cards, a photograph arrives by developing and never by sliding.

Motion is assigned by role, not by section (owner, 2026-10-28): a hero headline, a row's hairline, a large standalone photograph, a figure, a sequence of steps and a card each have one motion below, and any section built later that has that role takes that motion without being asked for it.

### Curves and durations
- **Editorial** `cubic-bezier(0.22, 0.61, 0.36, 1)` (`--ease-editorial`): entrances and state changes.
- **Exit** `cubic-bezier(0.4, 0, 1, 1)` (`--ease-exit`): anything leaving.
- **Hover** 240ms (`--dur-hover`): colour, border and arrow nudges. **Image** 700ms (`--dur-image`): the hover zoom of a photograph, always on the editorial curve. **Arrive** 400ms (`--dur-arrive`): a photograph fading in once its bytes land. **State** 280-400ms; **reveal** 600ms (`--dur-reveal`); **hero settle** 1.6s.

### Patterns
- **Scroll reveal.** A one-shot keyframe on the editorial curve over 600ms. The hidden state sets only opacity, and the animation uses `backwards` fill, so after it ends the element's own styles apply again: a reveal never delays hover or any other transition. Not everything moves the same way; each element has one of four roles (`v-reveal` modifiers):
  - **Section head** (`.head`): the eyebrow, headline and lead of one section reveal as one unit. They share a parent, trigger together (when any one of them scrolls into view, all of them do) and carry no delay. Opacity 0 to 1 with a 16px rise.
  - **Item** (`.item`): a card, row or cell of a grid or list. Only the first row staggers, in 70ms steps in reading order, capped at 320ms. Any later row reveals as it scrolls into view with no `animation-delay`, so a vertical list has no stagger beyond its first element. 16px rise.
  - **Image** (`.image`): a photograph, or a card whose substance is a photograph. Opacity only (0 to 1 over 600ms), never a translate: photographs do not slide. It composes with `.item` (first-row stagger) and carries no rise.
  - **Curtain** (`.curtain`): a large photograph that stands alone (a service image, a factory panorama, a breath photograph, a story image), never a card in a grid or a thumbnail. Instead of fading, its frame opens left to right with a `clip-path` wipe over 1.1s on the sheen's in-out curve (`cubic-bezier(0.45, 0, 0.25, 1)`, `--dur-curtain`), and a 1px Workshop Bronze edge rides the wipe and fades as it lands, the same edge as the material story seam. The photograph itself does not move: the frame opens, the picture stays still. No delay, no rise.
  - **Rule** (`.rule`, composes with `.item`): a list row or cell whose separator is a hairline. As it reveals, a 2px Workshop Bronze line (one step weightier than the hairline it covers) traces the hairline left to right over 900ms on the in-out curve, holds, and fades back to the Plaster Line over 400ms; the hairline is there throughout. It traces the row's bottom border when it has one, otherwise its top border, and takes the row's stagger.
  - **Block** (no modifier): any other single element (a button row, a filter bar, a Monument figure). 16px rise, no delay. The hero copy is the one place a numeric delay survives (`v-reveal="80"`, 0 to 240ms): the kicker, headline, lead and actions of a hero are one authored sequence.
- **Count** (`v-count-up`): a figure that stands on its own, outside the Facts Band (a Monument value, a project's floor area or room count). When half of it is on screen it counts from 0 to its value over 2.4s on an ease-out cubic after a 120ms lead, the same count as the Facts Band: every number in the value counts, and the upper end of a range keeps its distance ("44–45 phòng" passes through "22–23 phòng", never "17–17"), thousands keep the copy's grouping, and a bare year never counts. The count is drawn over the real value (transparent meanwhile), so the figure keeps its width and assistive technology reads the final value. A figure painted in view at load stays still. Phrases, years, addresses and scope lists never take it.
- **Trace** (`v-trace`): a sequence of numbered steps (the six production stages on `/gioi-thieu`, the four process stages and the four QC checkpoints on `/nha-xuong`, the three service stages on `/dich-vu`). The page's scroll draws a 2px Workshop Bronze line along each step's hairline, step after step in reading order, so the line advances with the visitor and stops when they stop. It is tied to scroll position, not to time, so it is not a loop and does not replay: scrolling back undraws it. The sequence starts when its top passes 85% of the viewport and is fully traced when its bottom reaches 60%. Each step traces its bottom hairline when it has one, otherwise its top one; a step whose separator is an inner rule (a card's machine line, a service's detail list) traces that rule. When a step's line is complete its number warms from Mid Timber to Bronze Dark over 240ms. It reads scroll only while the sequence is on screen, and under reduced motion it is off (the hairlines stay as they are).
- **Card** (`.card-link`, opt-in `.card-hover`): every link card (project cards on home, `/du-an`, `/gioi-thieu` and the related projects, the service programmes, the error page's way-out cards) and the static cards the owner picked (the `/gioi-thieu` fit cards, the `/nha-xuong` audiences, the `/tuyen-dung` open positions) answer the pointer the way the home capabilities do: a 2px Workshop Bronze line draws the card's top edge from the left (500ms editorial, back in 240ms on the exit curve) and the card's title nudges 4px right. The photograph's hover zoom and the lift stay as they are. Pointer devices only (`hover: hover` and `pointer: fine`); a link card also answers keyboard focus. Under reduced motion the line swaps instantly and nothing nudges.
- **Progress.** On a project page the reading progress lives in the chapter ruler (see Project chapter ruler): one 2px track per chapter, each filling in Workshop Bronze with the part of its chapter already read (from the chapter's top reaching the reading line, 40% down the viewport, to its end passing it); they follow the scroll directly, with no easing of their own, and rest full under reduced motion. Between routes, a page that takes longer than 200ms to load shows a 2px Workshop Bronze loading line across the top of the viewport (`NuxtLoadingIndicator`).
- **Filter.** Changing the `/du-an` archive filter reflows the grid instead of swapping it: a card the filter drops fades out in 120ms on the exit curve, the cards that stay glide to their new cells over 400ms on the editorial curve, and the cards that join fade in over 600ms once the drop has cleared (`TransitionGroup`). Under reduced motion the grid swaps at once.
- **Small interactions.** An FAQ answer opens and closes by easing its height over 320ms (editorial) where the browser supports sizing `::details-content` to auto, and opens at once elsewhere; its plus turns into a cross. A contact field that has focus draws a 2px Workshop Bronze line along its bottom edge from the left (400ms editorial; alert red on a field with an error). The contact form's status box rises 6px into place as it appears (280ms editorial). Under reduced motion the answer opens at once, the line appears at once and the status box does not rise.
- **Hero headline.** Every hero headline (HomeHero, AppHero, project detail) arrives word by word: each word rises from behind its own mask (`translateY(110%)` to rest, 900ms, editorial curve), 120ms after paint plus 45ms per word in reading order, capped at 540ms, so the words read in order like lines being set. It is CSS from the first frame, so the server-painted headline is never shown and then hidden; the heading's own opacity never drops, and the full sentence is one accessible name. The hero kicker's 20px bronze rule draws out from the left over 700ms at the same moment. The headline carries no scroll reveal of its own.
- **Hero image.** One-shot settle from `scale(1.04)` to `1` over 1.6s on the editorial curve. If the image arrives after the page is interactive, it is hidden only while undecoded and then fades in over 360ms, with the settle starting at that moment. No looping Ken Burns.
- **Image arrival.** Every other photograph (`MediaImage`) fades in over `--dur-arrive` (400ms, editorial) when its bytes land, as a one-shot keyframe from opacity 0, on top of a static placeholder. It is hidden only while it has no decoded data at hydration or mount: an image that is already complete, or already partly decoded, is never hidden (a painted frame must not blink), and a failed image is released at once. The placeholder is released on the same curve and duration. Hover transitions on the image are untouched.
- **Image hover zoom.** Scales to 1.02-1.03 over `--dur-image` on the editorial curve. An arrow nudge (a 2-4px translate on an icon) uses `--dur-hover` on the editorial curve.
- **Page transition.** None: moving between routes is a straight cut (owner, 2026-10-29). The earlier opacity crossfade through Linen flashed a dark hero to near-white and back on every navigation. The new page's motion is its own hero (photograph settle, headline words). The header chrome takes the route change with transitions suppressed (see Navigation).
- **Facts Band motion.** Arrival, once, on the trigger of the band's scroll reveal: the cells rise in reading order (label at 160ms plus 140ms per cell, value 60ms after its label; 8px rise, 560ms, editorial curve) while the frame only fades. Each figure counts from 0 to its value over 2.4s on an ease-out cubic, drawn over the real value (transparent meanwhile), so the cell keeps its width and assistive technology reads the final figure; thousands keep the copy's grouping ("3.000", "3,000"). Phrases do not count. A band painted in view at load skips the arrival. The bronze beams: each row of cells carries a pair of Workshop Bronze beams that set off together from the top and bottom edges of its first cell and run left to right in a zigzag. At every divider they swap sides (top goes down, bottom goes up), crossing at its middle; at the row's far end they turn and come back the same way to where they set off, and go round again without leaving the band (both ride one closed loop in opposite directions), so between them they trace every cell's outline. A 4-across band has one pair, the 2 × 2 and stacked layouts one pair per row. A lap takes 7s at an even pace on a linear curve (a loop has no start or end to ease). Each beam is three front-aligned strokes, a 3% head at 2.5px and full strength, a 7% body at 2px and 65%, a 12% tail at 2px and 30% (lengths as a share of the loop), drawn by one SVG over the grid from the cells' measured boxes. It runs only while the band is on screen and is off under reduced motion.
- **Capabilities motion.** The home "Ba dịch vụ" list carries a looping Workshop Bronze trace (owner, 2026-10-28) while it is on screen. From 768px, in cell 01 a 2px line (one step weightier than the hairline it covers) runs along the top rule left to right while another climbs the cell's right-hand divider bottom to top, and the two meet at the top-right corner together; cell 02 does the same; cell 03, which has no divider on its right, runs its top rule to the end. The traced lines hold, fade back to the Plaster Line hairlines, and the next pass starts: 5s a pass, 1s per cell on the sheen's in-out curve (`cubic-bezier(0.45, 0, 0.25, 1)`, on-screen travel), a 0.7s hold, a 0.6s fade and a 0.7s rest. Below 768px the cells stack with no dividers and each top rule traces in turn. It stops whenever the list leaves the viewport and is off under reduced motion. The items themselves keep the standard item reveal. On pointer devices, hovering a step turns its top rule bronze from the left (500ms editorial, back in 240ms on the exit curve) and nudges its number 4px right in Mid Timber; under reduced motion that hover swaps instantly with no nudge.
- **Material story copy swap.** The outgoing copy exits in 120ms on the exit curve; the incoming copy enters over 240ms on the editorial curve after the 120ms exit. Both are never visible together.
- **Material story seam.** The clip-path wipe between two photographs has a leading edge: a 1px Workshop Bronze line that travels with the wipe (it is a 1px clip of a bronze fill, so it costs no layout) and is absent before the wipe starts and once it has finished. The story carries no numeric progress counter: the active stage number and label on the side rail already say where the visitor is.
- **Navigation.** Underline 240ms, header hide/show about 280ms, drawer open 300ms editorial and close 200ms exit (see Components).
- **Primary button sheen.** On hover, one soft warm highlight (a linen-tinted band fading to transparent at both edges, never a hard white bar) crosses the bronze button left to right in 800ms on an ease-in-out curve (`cubic-bezier(0.45, 0, 0.25, 1)`: it is on-screen travel, so it must not front-load like the editorial curve), once per hover. It resets instantly when the pointer leaves, so it never sweeps backwards. Pointer devices only (`hover: hover` and `pointer: fine`), because on touch `:hover` sticks after a tap.

### Named Rules
**The One-Shot Rule.** No infinite animation. Motion plays once on arrival or on interaction, then rests. Two owner exceptions (2026-10-28), each only while its element is on screen: the bronze beams on the Facts Band (see Facts Band motion) and the bronze trace over the home capabilities (see Capabilities motion). They are not a precedent for any other element.

**The Rest-State Rule.** No `will-change` is held at rest; promote a layer only while it animates.

**The Few-Movers Rule.** A section never has more than one thing moving per role at once: one head, one first row, and photographs that only fade or open as a curtain. Do not stagger what is already a row, and do not rise what is a photograph.

**The Reduced-Motion Rule.** Under `prefers-reduced-motion: reduce` the scroll reveal (curtain and rule trace included), hero headline words and kicker rule, hero settle and fade, image arrival fade, copy-swap motion, chapter ruler slide, story beat dimming, Facts Band arrival and line, figure count, step trace, card hover line and title nudge, archive reflow, FAQ height, field line and status rise, capabilities trace, button sheen and press-scale are all off, and the material story uses its static layout. Content is shown immediately, never hidden waiting for an animation.

## Shapes

Two shape words only (the floating header bar's 16px corner is the one exception, see Navigation). Anything that holds content (cards, images, metric frames, form panels, inputs) has a gently eased 4px edge, like a sanded timber arris. Anything you press (buttons, chips, filter pills, language toggle targets) is a full pill. Images are cropped to fixed aspect ratios (16:10 for a lead image, 16:9 for satellites, 21:9 for the factory panorama and a breath photograph) and never float without a frame. The breath photograph is the one image with no edge at all: it runs full-bleed, so a radius would only clip the viewport corners. The home hero crop is art-directed per breakpoint with `object-position` (CSS only), so a phone frames the furnished room, not the ceiling. The material story reveals photographic layers with a left-to-right `clip-path` wipe.

## Components

### Buttons
Warm and tactile: a soft bronze surface that warms further under the hand.
- **Shape:** full pill (9999px), 48px tall, 44px minimum hit target.
- **Primary:** Workshop Bronze fill, Obsidian text, Action type in sentence case, 14px × 28px padding; 1px Deep Timber border on light surfaces.
- **Hover / Focus:** fill warms to Polished Bronze and one soft warm sheen crosses the button once (see Motion; pointer devices only, off under reduced motion). `:active` scales the button to 0.97 (none under reduced motion). Focus shows a 2px Mid Timber outline with 2px offset.
- **Outline:** transparent with a 1px Plaster Line border and Charcoal Ink text; fills Charcoal Ink with Linen text on hover. On the dark hero it uses a bronze hairline and Raw Silk text instead.

### Chips
- **Style:** pill, 12px × 20px, Action type; idle has a 1px Plaster Line border and Walnut Grey text.
- **State:** hover shifts the border to Mid Timber and text to Deep Timber; active fills Charcoal Ink with Linen text.
- **One row, never wrapped.** A set of filter chips is one row (`ChipRow`), however many options it has. Every option stays on the page: when the chips are wider than the row they scroll sideways, and an edge that still has chips beyond it fades out over 48px. From 768px two 44px arrow buttons scroll the row by 80% of its width for pointer users; they are redundant, so they are `aria-hidden` and out of the tab order. Keyboard users Tab from chip to chip (each is a pressed-state button, 44px tall) and a focused chip is always scrolled clear of the fade, never left half hidden. Touch users swipe. Nothing is revealed only on hover, and under reduced motion the scroll is instant. The row carries a group label, and a set of more than about five chips (the 7 project categories, the 8 room filters of a rich case study) uses it; a short set simply fits on the row and shows no arrows or fade.
- **What a filter filters.** The project index filter narrows the archive only; the end-to-end composition above it stays, and the filter sits in the archive's own chapter so that is obvious. Its options are the categories that have an archive project, so no chip is empty. A case study's room filter sits on its own row under the gallery head (a Stacked head), at the full measure.

### Cards / Containers
- **Corner Style:** 4px edge.
- **Background:** Paper White on linen or raw silk.
- **Shadow Strategy:** Rest lift, Hover lift on interaction (see Elevation).
- **Border:** 1px Plaster Line; darkens to Dust Grey on hover.
- **Internal Padding:** 24px (28px from 1024px). Images scale to 1.03 over `--dur-image` (700ms) on hover.
- **One chip type per card.** A project card carries its category as a Label line and nothing else that is a pill, tag or badge: the area is plain meta text, the scope is one short line ("Thiết kế · Thi công") and no pill sits on the photograph. The archive card on the project index is the quiet form: a 3:2 photograph, 20px padding, Label, Title, area and scope, with no description. The home stage keeps its category pill and number on the photograph (`ProjectStage` `badges`); the index turns them off.

### Inputs / Fields
- **Style:** Paper White field, 1px Plaster Line border, 4px edge, 12px × 16px padding, 16px text, labels in Inter 700 at 14px.
- **Focus:** border shifts to Mid Timber and the 2px Mid Timber focus outline stays visible.
- **Error:** Kiln Red border with the message in Deep Kiln Red, Inter 600 at 14px, phrased as how to fix the field.

### Navigation
- **Header:** transparent over the hero with a soft obsidian scrim (0.78 at the top edge, 0.62 at the nav row, gone by the bottom of its 160px, so it reads as a shadow and not a bar; the nav and language toggle clear 4.5:1 over the hero photographs); after scrolling it becomes white glass at 92% with a 16px blur. Once the page leaves its top (past 16px) the bar compacts into a floating bar (owner, 2026-10-27): 8px from the top (12px from 1280px), 52px tall (56px from 1280px), on its own Obsidian glass (88%, the same 16px blur, a white hairline at 8%) with a 16px corner (owner, 2026-10-27: the one radius outside the two shape words, reserved for the floating bar) and no shadow, so it stands off the Linen body; on it the chrome is white, as over the hero: the white logo, nav at 92% white, the dark-surface language toggle and the bronze CTA with a bronze edge. Below 1280px it spans the viewport less 8px each side; from 1280px it hugs its content, centred. Inside it the logo is cropped to its mark alone at 28px (32px from 1280px), the nav type steps from 13px to 11px with tighter item padding, the gaps between logo, nav and the language group close from 32px to 20px (language to CTA 16px to 8px), and the CTA steps down to 36px with tighter padding; the CTA arrives with the bar rather than waiting for the hero to pass, so the bar never carries an empty slot. The compact layout is applied in one frame and played back as a FLIP (transform only, the logo's wordmark cropped by clip-path), while the full-bleed glass cross-fades into the floating one, over 400ms on the editorial curve; under reduced motion it snaps. At the top of the page it is full-bleed again. It hides on scroll down only once the hero has scrolled out of view (on a page without one, after the first 400px) and returns on scroll up. Desktop items appear from 1280px.
- **Pinned routes:** the legal pages and the error shell have no photograph (so no obsidian band; the legal masthead is a Raw Silk step) and the header is pinned in its navigation state from the first paint (server HTML included, so it holds with JavaScript off) and does not hide on scroll. A route opts in with `data-chrome-solid` on the root element (set through `useHead`, released on unmount) plus `useHeaderState().setSolid`; every other route keeps the cover-to-navigation behaviour above.
- **Items:** Nav type, Walnut Grey on light glass (white at 92% over the hero; the unselected language option is white at 80%, the selected one full white), full color on hover and current, with a 1.5px underline that scales in over 240ms (the hover duration) on the editorial curve. The header hides and returns over about 280ms.
- **Mobile:** a white drawer up to 336px wide over an obsidian overlay at 60% with an 8px blur; links in 24px Inter 600 with hairline dividers, current item in Deep Timber. The drawer opens over 300ms on the editorial curve and closes over 200ms on the exit curve.

### Facts Band
The site's proof facts (3.000 m², up to 50 rooms a month, design to handover, nationwide and export) have one treatment, `FactsBand`, used in four places: below the home hero, below the `/gioi-thieu` and `/nha-xuong` heroes, and at the head of the case-study finale. It is a full-width Linen band with a Plaster Line hairline under it (in the finale it opens the Raw Silk section, so the hairline is also the seam to the closing CTA); it is never part of a hero and never a dark box. On home it is the contained variant (owner, 2026-10-23): the Linen grid sits on the shell rail as one frame with a Plaster Line border and the 4px edge, set 32px (48px from 768px) below the hero, and its outer cells keep an inset instead of running flush with the rail; the type, dividers and grid are the same. Each cell pairs a Label (Walnut Grey) with a value; cells are separated by Plaster Line hairlines. The grid follows the number of facts: four facts are a 2 × 2 block below 1024px and four across from 1024px; three facts stack below 768px and run three across from 768px (no orphan cell). The cells are a two-row subgrid (label row, value row), so the labels share a top, the values share a first baseline and the cells share one height whatever the value size. A figure keeps the Stat role, a phrase uses the Title role, and every value fits on at most two lines. There are no icons and no dot. It arrives once (owner, 2026-10-28, replacing the earlier still band): the cells rise in reading order and each figure counts up from 0 to its value; the frame itself only fades in, so the cells are the one thing that rises. A band already painted in view when the page loads keeps its figures still (they never blink to 0). A pair of Workshop Bronze beams keeps zigzagging round the cells' edges, crossing at every divider and coming back round, for as long as the band is on screen: one of the two looping motions on the site (with the home capabilities trace), by owner decision (see Motion, Facts Band motion). Whether a value is a figure or a phrase is a property of the fact, read from the shared factory stats, so "Đến 50" has the Stat role wherever it appears. A page picks which facts it shows (the finale drops "Trọn gói" unless the project's scope covers design, production and construction) but never restyles them.

### Case study (`/du-an/[slug]`)
The case study reads as an editorial file (owner, 2026-10-28, direction A): hero, facts, chapter ruler, then the chapters story, gallery, delivery and materials, a breath photograph, and the finale. Each photograph has one home on the page: the gallery shows the first nine (or all, in a short set), the story takes the next three, the material chapter the two after, and the breath one of the rest.

- **Project facts.** Under the hero, a Linen row on the shell rail: two cells per row below 768px, three from 768px, five from 1280px, separated by Plaster Line hairlines (an odd last cell spans the row on a phone). Each pairs a Label with a value; area and room count are figures in the Stat role and count up once, the rest are phrases in the Title role. Each cell's top hairline traces in bronze on arrival. The hero's topic line carries category and status; there are no chips.
- **Project chapter ruler.** A sticky bar under the header (`data-project-subnav`), on the chrome glass with a Plaster Line under it. One entry per chapter: a two-digit number, the label and its own 2px track along the bar's bottom edge (see Motion, Progress); the chapter under the reading line is current (`aria-current="location"`), numbers rest in Dust Grey and turn Deep Timber once their chapter is current or read. From 1024px it is a full title block: category and project name on the left (one line, ellipsed), the chapters sharing the measure, and the quote CTA on the right. Below 1024px the chapters scroll sideways as 44px targets. When the header hides on scroll down the ruler slides up into its place over the state duration, and its quote CTA appears, so the screen always carries exactly one quote action; when the header returns the CTA leaves. Under reduced motion the header never hides, so the ruler never moves.
- **Case-study story.** A rail head with the page's Statement heading, then context, challenge and solution. With photographs to spare (a long set) the copy column holds still from 768px beside one 5:4 curtain photograph per beat; the beat whose photograph is passing the middle of the viewport is lit and the others rest at 40% opacity (opacity alone: no side rule, the beats keep their Plaster Line top hairline). Below 768px the photographs run as a sideways snap strip under the copy and every beat stays lit. A short set has no spare photographs, so the beats run as three columns of text from 1024px, each hairline tracing on arrival. Under reduced motion every beat stays lit.
- **Project gallery mosaic.** Up to nine photographs at once on a six-column grid from 768px (two columns below): the first leads at 4 × 4 with two stacked beside it, the rest run in rows of three, and a last row of one or two widens so no cell is empty; one, two or three photographs take their own layouts. Every tile is a button that opens the lightbox on its photograph, with the image hover zoom and the card hover line. The room filters above it reflow the grid as the `/du-an` archive does; a long set adds a "see all" outline button in the head that opens the lightbox on the full set. No autoplay, no carousel.
- **Delivery.** A stacked head whose lead names the project's scope, then the phases as a traced sequence (five across from 768px) with their numbers in the Stat role, then the capability proof as three hairline columns without icons.
- **Materials.** An experience photograph (curtain) and a material photograph beside highlights and a lettered list (A, B, C) of materials, each row's hairline tracing on arrival; with no spare photograph the copy takes the width.

## Do's and Don'ts

### Do:
- **Do** keep every body section on Linen, Raw Silk or Sawdust, and step between them by tone, not by switching to dark.
- **Do** use Workshop Bronze for the primary action and give it a 1px Deep Timber border on light surfaces.
- **Do** set headings in Outfit 500, sentence case, and keep prose at line-height 1.65 or more.
- **Do** use the 4px edge for content containers and pills for controls.
- **Do** separate content with Plaster Line hairlines at 60% before reaching for a shadow, and put one on every seam between two light sections.
- **Do** let type make one statement per page after the hero: at most one Monument figure and one Statement headline, with the section heads alternating between Stacked, Split and Rail.
- **Do** show the proof facts only through the Facts Band; a page chooses which facts, never a new treatment.
- **Do** move with the editorial curve (`cubic-bezier(0.22, 0.61, 0.36, 1)`), 240ms for hover, 700ms for image zoom and 280-400ms for state, reveal once at 600ms (photographs by opacity alone), and disable reveal, hero settle and fade, image arrival, copy-swap motion, the chapter ruler slide, the capabilities trace, button sheen and press-scale under `prefers-reduced-motion`; no infinite animation (the Facts Band beams and the capabilities trace are the two owner exceptions).

### Don't:
- **Don't** alternate light and dark section bands; obsidian appears only behind the hero photograph and in the footer.
- **Don't** set headings in Inter 900 or continuous uppercase.
- **Don't** use 16px card or input radii; they belong to the retired interior-page system.
- **Don't** add a second accent hue, gradient text, neon, saturated badges, glassmorphism panels or deep drop shadows.
- **Don't** use bouncing or spring motion, infinite or looping animation (pulsing dots, repeating sheens, Ken Burns drift; the Facts Band beams and the capabilities trace are the two owner exceptions), `will-change` held at rest, or heavy parallax.
- **Don't** hardcode hex values in components; use the palette tokens.
- **Don't** set a heading, a word or a sentence in the Monument role, or give a breath photograph a caption, a scrim or a radius.

## Drift from this system (incumbent code, 2026-10-20)

This document records the target chosen with the owner. These parts of the current implementation do not yet match it and should converge section by section:

- `GalleryLightbox` (the full-screen viewer) still uses 8px and 6px radii (`rounded-lg` frame, `rounded-md` thumbnails); it converges to the 4px content edge when the lightbox is next touched. It is the only code left outside the system: every interior route now uses the Headline/Title roles, the 4px edge and `.btn-bronze`.
- Duplicate token declarations (obsidian/bronze/ivory in both `:root` and `@theme`), unused legacy tokens (`--color-wood`, `--color-warm`, `--radius-*`), the unused Syne font, and Nuxt UI `primary: 'amber'` with no Nuxt UI components rendered.
- Copy formula, recorded for an owner decision and deliberately not rewritten: five headings use the "Từ … đến …" / "From … to …" pattern (the `/gioi-thieu` and `/dich-vu` hero titles, the home material story, and the case-study story and delivery chapters). Rewriting them is a copy change, outside the design system.
- The Facts Band reprises one fact as a Monument on `/gioi-thieu` and `/nha-xuong` (the band near the hero, the Monument at its chapter). Dropping the repeated fact from those bands would change the facts a page shows, which is a content decision.
- The home project stage uses `ProjectStage` with its default `badges`: its cards repeat the category as a pill on the photograph and as a Label line below (the number badge was dropped on home, owner 2026-10-23; `/du-an` keeps it). The one-chip-type rule is met on the project index; the home cards converge when the home stage is next touched.
- `docs/design/redesign-concept-showcase.html` still renders a fully dark obsidian world; it remains a composition and motion reference only, and the owner's 2026-10-20 decision for a continuous warm-light canvas supersedes its surfaces. (`.agents/rules/laihuy-ux-ui.md` was aligned with this document on the same date.)
