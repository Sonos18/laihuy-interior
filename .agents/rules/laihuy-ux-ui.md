---
description: "LaiHuy Interior project-specific UX/UI design constitution, visual source of truth, and frontend skill guardrails"
always_on: true
---

# LaiHuy Interior — UX/UI Workspace Rule

## 1. Brand Positioning & Identity

Lai Huy Interior is an established, high-capacity interior manufacturing and construction contractor specializing in high-end hospitality (5-star hotels, luxury resorts) and premium residential villas.

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

The interactive showcase prototype:
[`docs/design/redesign-concept-showcase.html`](../../docs/design/redesign-concept-showcase.html)
is the **authoritative visual specification** for the LaiHuy redesign.

### Conflict Precedence Contract
1. **Approved Prototype First:** Whenever generic advice or output from global skills (`ui-ux-pro-max`, `redesign-existing-projects`), model defaults, or third-party guidelines conflicts with `docs/design/redesign-concept-showcase.html`, **the approved prototype strictly prevails**.
2. **No Silent Art Direction Drift:** Global skills may audit, improve accessibility, refine responsive behavior, or guide Nuxt technical implementation, but they are strictly prohibited from altering the approved art direction, color palette, or typography without explicit user approval.

---

## 3. Approved Visual Direction (Quiet Luxury & Architectural Editorial)

### Palette & Tokens
Use the tokens declared in `app/assets/css/main.css`:
- **Surfaces:** Deep Obsidian (`--color-obsidian: #0b0a09`), Elevated Surface (`--color-surface-dark: #141210`), Card Surface (`--color-card-dark: #1a1815`).
- **Accents:** Warm Bronze (`--color-bronze-warm: #b8875a`), Light Bronze (`--color-bronze-light: #d4a373`), Deep Bronze (`--color-bronze-dark: #8c6239`).
- **Typography:** Raw Silk Ivory (`--color-ivory: #f5f2eb`), Muted Ivory (`rgba(245, 242, 235, 0.65)`), Subtle Text (`rgba(245, 242, 235, 0.4)`).
- **Hairlines:** Restrained translucent borders (`--hairline: rgba(255, 255, 255, 0.08)`), Bronze hairlines (`--hairline-gold: rgba(184, 135, 90, 0.25)`).

### Typography System
- **Display & Headings:** `Outfit` (geometric elegance aligned with brand mark) and `Syne` (artistic, sculptural accents for editorial highlights).
- **Body & Captions:** `Inter` / `Plus Jakarta Sans` for optical clarity at small sizes.
- **Rule:** Do not introduce unrelated display or serif fonts without explicit PO approval. Avoid shouting in continuous uppercase; employ deliberate typographic scale and case hierarchy.

### Layout & Composition
- **Editorial Asymmetry:** Prefer balanced asymmetric grids, intentional image scale variations, and editorial breathing room over monotonous symmetric boxes.
- **Above the Fold Discipline:** Hero visual and content hierarchy strictly follows:
  **Kicker → Headline → Sublead → B2B CTA row → Floating Metrics Rail**.
  Keep hero copy restrained and eliminate redundant legacy accent copy or repetitive tagline blocks above the fold.
- **Factory & Craftsmanship Proof:** Present workshop scale through crisp metric strips, technical capability badges, and structured QC workflows rather than repetitive card walls.

### Motion & Micro-Interactions
- **Tone:** Slow, cinematic, purposeful, and quiet.
- **Approved:** Gentle Ken Burns zoom on featured architectural imagery, subtle bronze light sweep on primary CTA buttons, soft metric glow, and clean scroll reveals.
- **Forbidden:** Bouncing animations, rapid spring physics, loud gradients, excessive parallax, or constant looping distractions.

---

## 4. Skill Routing & Roles

In accordance with the Global Frontend Skill Router:
- **`redesign-existing-projects`** is the **DESIGN AUTHORITY** for existing pages. Follow its `Scan -> Diagnose -> Fix` sequence to upgrade aesthetics while protecting existing markup structure and behavior.
- **`ui-ux-pro-max`** acts as a **TECHNICAL SPECIALIST** for Nuxt/Vue component architecture, Tailwind CSS 4 token integration, Nuxt UI patterns, accessibility audits, and responsive breakpoint troubleshooting.

---

## 5. Anti-Generic-UI Guardrails

Actively reject and remove:
- Repetitive `p-6 border rounded-2xl` card grids
- Glassmorphism overlays and heavy frosted blurs where solid dark surfaces provide better hierarchy
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
