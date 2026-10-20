---
description: "LaiHuy Interior project-specific UX/UI design constitution, visual source of truth, and frontend skill guardrails"
always_on: true
---

# LaiHuy Interior — UX/UI Workspace Rule

## 1. Brand Positioning & Identity

Lai Huy Interior is an established, high-capacity interior manufacturing and construction contractor specializing in hospitality (3–5 star hotels and resorts), premium villas and apartments, and commercial projects. Product truth lives in [`PRODUCT.md`](../../PRODUCT.md).

All frontend interfaces must visually communicate:
- Direct manufacturing capability and workshop craftsmanship (CNC precision, joinery, QC rigor)
- High-end architectural credibility and B2B professional authority
- Quiet Luxury and refined restraint

**Strict Anti-Patterns:** The interface must NEVER resemble:
- A generic consumer furniture e-commerce catalog
- A boilerplate construction company template
- A generic SaaS dashboard or tech startup product
- An AI-generated cookie-cutter landing page

---

## 2. Visual Source of Truth

[`DESIGN.md`](../../DESIGN.md) is the **authoritative visual specification** (palette, surfaces, typography, shapes, components, motion), with its machine-readable sidecar `.impeccable/design.json` and the tokens in `app/assets/css/main.css`.

The interactive prototype [`docs/design/redesign-concept-showcase.html`](../../docs/design/redesign-concept-showcase.html) remains a reference for composition and motion only. Its fully dark obsidian canvas was superseded on 2026-10-20 by the owner's decision for a continuous warm-light canvas.

### Conflict Precedence Contract
1. **DESIGN.md First:** Whenever skill output, model defaults, third-party guidelines or the prototype conflict with `DESIGN.md`, **`DESIGN.md` prevails**. Only a direct instruction from the owner ranks above it.
2. **No Silent Art Direction Drift:** Skills may audit, improve accessibility, refine responsive behavior, or guide Nuxt technical implementation, but they must not alter the approved art direction, color palette, or typography without explicit owner approval. An approved change is recorded in `DESIGN.md` first, then implemented.
3. **Converge, don't spread:** The "Drift" section of `DESIGN.md` lists incumbent code that does not match yet. Fix it inside the section being worked on; do not restyle unrelated routes to chase it.

---

## 3. Approved Visual Direction ("The Quiet Workshop")

Summary only; exact values, named rules and component specs are in `DESIGN.md`.

### Palette & Surfaces
- **Canvas:** one continuous warm-light surface: Linen (`wood-50` #faf6f0), Raw Silk (`--color-ivory` #f5f2eb) and Sawdust (`wood-100` #f0e3d4), with Paper White (#ffffff) for cards, forms and inputs. Step between sections by tone and hairlines, never by switching to dark.
- **Dark:** Obsidian (`ink-950` #0b0a09) only behind the photographic hero (as a scrim) and in the footer. A dark band in the middle of a page is drift.
- **Accent:** Workshop Bronze (`wood-400` #b8875a) is the single accent: primary action, eyebrow rules, active markers. Polished Bronze (#d4a373) for hover. On light surfaces a bronze button carries a 1px Deep Timber (`wood-600` #7c5032) border for 3:1 edge contrast.
- **Text:** Charcoal Ink (`ink-900`) primary, Walnut Grey (`ink-600`) secondary, Dust Grey (`ink-500`) for captions only (never on Sawdust). Accent text in Deep Timber.
- **Hairlines:** Plaster Line (`ink-200` at 60%) on light surfaces; bronze hairline (`--hairline-gold`) for metric frames.

### Typography System
- **Display & Headings:** `Outfit` weight 500, sentence case.
- **Body, labels, nav, buttons:** `Inter`. Prose keeps line-height ≥ 1.65 for Vietnamese diacritics.
- **Rule:** Do not introduce other display or serif fonts without explicit owner approval (`Syne` is loaded but unused). Uppercase is limited to short eyebrows and nav items; headings in continuous uppercase or weight 900 are drift.

### Shape & Depth
- 4px edges for anything that holds content (cards, images, metric frames, form panels, inputs); full pills for anything pressed (buttons, chips, controls).
- Flat at rest; a slight shadow only on hover or focus, and the drawer's single shadow.

### Layout & Composition
- **Editorial Asymmetry:** Prefer balanced asymmetric grids, intentional image scale variations, and editorial breathing room over monotonous symmetric boxes.
- **Above the Fold Discipline:** Hero visual and content hierarchy strictly follows:
  **Kicker → Headline → Sublead → B2B CTA row → Floating Metrics Rail**.
  Keep hero copy restrained and eliminate redundant legacy accent copy or repetitive tagline blocks above the fold.
- **Factory & Craftsmanship Proof:** Present workshop scale through crisp metric strips, technical capability badges, and structured QC workflows rather than repetitive card walls.

### Motion & Micro-Interactions
- **Tone:** Slow, cinematic, purposeful, and quiet.
- **Approved:** Gentle Ken Burns zoom on featured architectural imagery, subtle bronze light sweep on the primary CTA, a soft pulsing metric dot, and clean scroll reveals on the editorial curve (`cubic-bezier(0.22, 0.61, 0.36, 1)`).
- **Forbidden:** Bouncing animations, rapid spring physics, loud gradients, excessive parallax, or constant looping distractions.
- **Always:** every reveal, zoom, sweep and pulse is disabled under `prefers-reduced-motion`.

---

## 4. Skill Routing & Roles

Design skills are installed at project level in `.claude/skills/`. Their roles, precedence and the per-section workflow are defined in [`CLAUDE.md`](../../CLAUDE.md) ("Design skills — phân vai"): `impeccable` leads design within `DESIGN.md`, `high-end-visual-design` adds polish only on request, `emil-design-eng` owns motion, `web-design-guidelines` audits, and `webapp-testing` verifies in a real browser. Earlier references to `redesign-existing-projects` and `ui-ux-pro-max` are retired.

---

## 5. Anti-Generic-UI Guardrails

Actively reject and remove:
- Alternating light and dark section bands
- Repetitive `p-6 border rounded-2xl` card grids
- Glassmorphism panels and heavy frosted blurs (the scrolled header's 16px glass is the one sanctioned blur)
- Neon accents, multi-color gradient text, and saturated badges
- Pointless pills, badges, or tag clouds that crowd the view
- Deep drop-shadows that conflict with clean architectural hairlines
- Generic 3-column symmetrical feature cards
- Animations added purely for visual flair that degrade reading speed or performance

---

## 6. UX & B2B Conversion Priorities

Prioritize requirements in this exact order:
1. **Architectural Visual Credibility** (photographic scale, materiality, bespoke prestige)
2. **Clear Hierarchy & Reading Comfort** (breathing room, scannable specifications)
3. **Project Storytelling & Evidence** (curated case studies, scope, timeline, materials)
4. **Manufacturing & Factory Proof** (direct workshop capacity, CNC nesting, BOQ bóc tách, QC)
5. **B2B Conversion Actions** (Capability profile PDF download, sample BOQ download, technical consultation CTA)
6. **Responsive Usability** (smooth touch targets, no horizontal scroll, deliberate mobile layout)
7. **Accessibility** (WCAG AA contrast floors, skip link, visible focus, ARIA labels)
8. **Performance** (Core Web Vitals, optimal LCP, no cumulative layout shift)
9. **Decorative Polish**

*Note:* Do not invent new conversion funnels or alter form submission destinations without approval.

---

## 7. Implementation & Architecture Safeguards

Preserve existing application integrity:
- **Architecture:** Keep Nuxt 4, Vue 3, Tailwind 4, and Nuxt UI structures. Do not rewrite components from scratch if targeted refactoring preserves stability.
- **Data & Routing:** Maintain file-based routes (`app/pages/`), composables (`app/composables/`), and typed bilingual data records (`app/data/`).
- **Bilingual Integrity:** Preserve Vietnamese-default (`vi`) and English (`en`) parity across all UI strings, labels, and metadata.
- **Testing Contracts:** Never remove or alter `data-testid` attributes relied upon by Playwright and Vitest suites.
- **Media Pipeline:** Respect the `@nuxt/image` pipeline, Supabase storage integration, and `manifest.json`.

---

## 8. Responsive & Quality Gates

### Responsive Verification Checkpoints
Every significant visual component must be verified across four key viewports:
- **Mobile:** ~390px (clean single-column editorial stack, pinned high-priority CTAs, preserved contrast)
- **Tablet:** ~768px (adapted grid, balanced typography scale)
- **Laptop / Standard Desktop:** ~1024px (full asymmetric layout, metric strips)
- **Wide Display:** ~1440px (bounded content measure `--shell-measure: 80rem`, generous architectural margin)

### Quality Gate Commands
Before marking any frontend task complete, run and pass:
```powershell
pnpm lint
pnpm typecheck
pnpm test
pnpm test:gates:a11y
pnpm lint:media
```
Never modify visual regression baselines merely to force a failing test to pass.
