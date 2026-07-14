# Header & Footer Art Direction — Lai Huy Interior

The **single source of truth** for site chrome: the Header, the Footer, the mobile
drawer, and the alignment/token/motion systems they share with the Hero.

Companion to [`hero-art-direction.md`](./hero-art-direction.md). That document governs the
*cover*; this one governs the *frame around every cover*. Where they overlap — alignment,
rendering budget, motion, accessibility — **this document defers to the hero doc on hero
internals and owns everything else.**

Status: **frozen engineering specification — implementation pending.** Nothing here is
optional. Every rule is a review gate (§19). Four items are **unverified** and block
implementation (§16).

### The determinism rule

> **Implementation contains no design decisions.** Every visual value, every state, every
> threshold and every acceptance test is fixed by this document or computed by a committed
> script. An implementer who has to *decide* something has found a **defect in this spec** —
> the correct response is to raise it, not to exercise taste.

This rule is what the document is *for*. It is enforced by four mechanisms:

| Mechanism | Kills | Where |
|---|---|---|
| **Token freeze** | Magic numbers | §25 |
| **Component contracts** | "Where does this belong?" | §26 |
| **Animation ownership** | Two systems fighting over one property | §27 |
| **Computed gates** | "Does this look right?" | §21, App. A/B |

Prose in this document that reads as judgement (*"premium"*, *"elegant"*, *"editorial"*) is
**rationale, never criteria.** Only numbers, tokens and scripts are criteria. If a gate cannot
be expressed as a number or a script, it is not a gate — it is an opinion, and it does not
block a merge.

---

## 1. Purpose & design philosophy

The site currently reads as `header → hero`. It must read as **one cover**.

```
  BEFORE                        AFTER
  ┌────────────────┐            ┌────────────────┐
  │ header bar     │            │  ◈ LAI HUY   ≡ │ ← navigation floating IN the scene
  ├────────────────┤            │                │
  │                │            │   [ image ]    │
  │   hero image   │            │                │
  │                │            │   HEADLINE     │
  └────────────────┘            │   CTA          │
                                └────────────────┘
```

Three principles govern every decision below.

1. **The header is part of the cover, not a bar above it.** At rest it owns no background,
   no border and no blur — only a scrim that protects legibility. It is the *signature* on
   the photograph.
2. **The footer is the final page of the magazine, not the bottom of the document.** It
   closes the loop the hero opened: the site begins on ink-950 + wood over photography and
   ends on ink-950 + wood in type.
3. **The chrome never competes with the cover.** Weight, colour and motion are all
   subordinate to the hero. Where the hero is loud, the chrome is silent.

### The invariant the whole system rests on

> **I9 — Every top-level page MUST open with a dark cover** (an `AppHero`, or an equivalent
> dark section ≥ 60vh). The at-rest header is white-on-dark and assumes this.
>
> A page that cannot honour I9 **must** opt into permanent `NAVIGATION` chrome
> (§5) via `<AppHeader solid />`. There is no third option, and a page that violates
> I9 without opting in is a **release blocker**, not a styling bug.

---

## 2. Component boundaries

```
                         ┌──────────────┐
                         │   app.vue    │  shell only: <AppHeader/> <NuxtPage/> <AppFooter/>
                         └──────┬───────┘
              ┌─────────────────┼─────────────────┐
              ▼                 ▼                 ▼
      ┌───────────────┐  ┌────────────┐   ┌──────────────┐
      │  AppHeader    │  │  NuxtPage  │   │  AppFooter   │
      └───────┬───────┘  └─────┬──────┘   └──────────────┘
              │                │                (presentational — no state, no composable)
    ┌─────────┴────────┐       ▼
    ▼                  ▼   ┌─────────┐
┌──────────────┐ ┌─────────┴───┐     │
│useHeaderState│ │AppLangToggle│  AppHero
└──────────────┘ └─────────────┘  (owns cover composition + its own scrim)
   owns: scroll progress,
   direction, visibility,
   route hooks, CSS vars
```

| Component | Owns | Must NOT |
|---|---|---|
| `app.vue` | Layout shell, SEO, drawer mount point | Contain any header/footer markup |
| `AppHeader` | Chrome markup, nav, actions, drawer trigger | Read hero state; know which page it is on |
| `AppFooter` | Footer markup. **Pure presentational.** | Hold state; import a composable |
| `AppHero` | Cover composition, its own scrim, focal/anchor | Read or write header state |
| `useHeaderState` | Scroll progress `p`, direction, visibility, route hooks, **all CSS var writes** | Touch the DOM outside the header element |
| `AppLangToggle` | VI/EN control (used by header **and** drawer) | Duplicate logic — this exists *because* it was duplicated |

**Dependency rule — the graph is acyclic and must stay that way.**

> `AppHero` **never** imports `useHeaderState`. `AppHeader` **never** imports `AppHero`.
> Their *only* shared contract is the CSS token `--header-h` and the invariant I9.
> A token is not a dependency. If chrome and cover ever need to talk through JavaScript,
> the design is wrong — fix the design, not the graph.

`useHeaderState` is a **singleton** (module-scoped shared state). Two header instances would
fight over the same CSS vars; the composable must be safe to call more than once and return
the same instance.

> This section is the **map**. The binding contracts — responsibilities, non-responsibilities,
> public API, and forbidden knowledge for all seven components — are **[§26](#26-component-contracts)**.

---

## 3. Token layer

> **Hard rule: no hardcoded visual values in `AppHeader`, `AppFooter`, or the drawer.**
> Every colour, space, size, duration and easing must resolve to a token defined here.
> A raw Tailwind opacity (`text-white/62`), a raw spacing (`py-16`) or a raw duration
> (`duration-300`) in chrome markup is a **review rejection**, not a nitpick.

Today's chrome uses **six unsystematic white opacities** (`/86 /68 /62 /55 /42`) and picks
spacing per-element. That is what makes it feel template-like. Tokens are the cure.

### 3.1 Colour tokens (semantic — never opacity-in-markup)

```css
/* ── Surfaces ───────────────────────────────────────────────── */
--surface-cover:        transparent;                    /* header at rest: nothing */
--surface-chrome:       rgb(255 255 255 / 0.92);        /* header scrolled: glass */
--surface-chrome-blur:  16px;                           /* the ONE blur */
--surface-footer:       var(--color-ink-950);
--scrim-chrome: linear-gradient(
  to bottom,
  rgb(11 10 9 / 0.55),
  rgb(11 10 9 / 0.18) 45%,
  transparent
);

/* ── Foreground on DARK (cover header, footer) ──────────────── */
--fg-dark:         #fff;                       /* primary            */
--fg-dark-muted:   rgb(255 255 255 / 0.72);    /* nav idle, body     — 10.1:1 on ink-950 */
--fg-dark-subtle:  rgb(255 255 255 / 0.48);    /* meta, copyright    —  5.0:1 on ink-950 */
--rule-dark:       rgb(255 255 255 / 0.12);
--accent-dark:     var(--color-wood-300);      /* footer eyebrows    —  7.8:1 on ink-950 */

/* ── Foreground on LIGHT (scrolled header, drawer) ──────────── */
--fg-light:        var(--color-ink-950);
--fg-light-muted:  var(--color-ink-600);       /*  7.4:1 on white */
--fg-light-subtle: var(--color-ink-500);       /*  5.4:1 on white */
--rule-light:      rgb(216 210 202 / 0.6);     /* ink-200/60      */
--accent-light:    var(--color-wood-600);
```

**Contrast is computed, not assumed.** `--fg-dark-subtle` is `0.48`, not `0.45`, because
`0.45` composites to 4.54:1 on ink-950 — passing AA by 0.04. `0.48` gives 5.0:1 and real
margin. `--fg-light-subtle` is `ink-500` (5.4:1), **not** `ink-400` (3.4:1, which fails for
body text and may only ever be used for rules).

> **`--accent-dark` is `wood-300` and that is correct — do not "fix" it.** The hero doc bans
> `wood-300` for the *kicker*, where it measured **3.87:1 over warm photography**. On the
> footer's flat `ink-950` the same colour measures **7.83:1**. The rule was never "wood-300 is
> banned" — it was "wood-300 fails **over photography**." Context is the variable, not the hue.

> `--fg-dark-muted` is the nav's idle colour at rest, composited over a *photograph*, not a
> flat surface. Its 10.1:1 figure is against ink-950 and is **not** a pass. It must be
> measured per hero — see **O2**, §15.

### 3.2 Spacing tokens

```css
--header-h:            4.5rem;   /* 72px  — mobile/tablet */
--header-h-xl:         5.5rem;   /* 88px  — ≥1280px       */
--header-scrim-h:      10rem;    /* 160px                 */
--subnav-h:            3.5rem;   /* project-detail sticky sub-nav */

--nav-item-px:         1rem;
--nav-item-min-h:      2.75rem;  /* 44px — WCAG 2.5.5 target */
--nav-item-gap:        0.25rem;
--header-group-gap:    2rem;     /* logo↔nav, nav↔actions */
--header-action-gap:   1rem;

--footer-py:           7rem;     /* 112px — mobile */
--footer-py-md:        9rem;     /* 144px — ≥768px */
--footer-masthead-gap: 4rem;
--footer-col-gap:      3rem;
--footer-meta-gap:     4rem;

--logo-h-header:       2.5rem;   /* 40px optical — mobile */
--logo-h-header-xl:    3rem;     /* 48px optical — ≥1280px */
--logo-h-footer:       3.5rem;   /* 56px optical — mobile */
--logo-h-footer-md:    4rem;     /* 64px optical — ≥768px */
```

The footer's current `py-16` (64px) is **less generous than an ordinary body section**
(`py-20 md:py-28`). That single fact is why the finale reads as a bottom bar. `--footer-py`
deliberately exceeds body spacing: the last page gets the most air.

**Logo sizing is *optical*, not box height.** The source PNG's ink fills only 42.4% of its
500×500 canvas, so today's `h-16` box renders a **27px** wordmark. These tokens describe the
height of the **trimmed** asset — i.e. real, visible logo. `--logo-h-header-xl: 3rem` is
therefore a **1.8× optical increase** over today while the box actually *shrinks*.

**Every header-height coupling must consume the token.** Two exist today and both are
hardcoded:

```css
/* du-an/[slug].vue sticky sub-nav */
top: var(--header-h);                                        /* was: top-20 */
/* section scroll anchors on the same page */
scroll-margin-top: calc(var(--header-h) + var(--subnav-h) + 1rem);  /* was: scroll-mt-36 */
```

### 3.3 Typography tokens

Weights are restricted to **400 / 600 / 700**. `font-black` (900) is **reserved for the hero
headline** — chrome may never use it. Today's language toggle uses `font-black`, which steals
the headline's weight; that is a hierarchy violation, not a style choice.

| Token | Element | Size | Weight | Tracking | Leading | Case |
|---|---|---|---|---|---|---|
| `--type-nav` | Header nav link | `0.8125rem` | 600 | `0.12em` | 1 | upper |
| `--type-lang` | VI / EN toggle | `0.75rem` | 600 | `0.08em` | 1 | upper |
| `--type-meta` | Header phone | `0.8125rem` | 600 | `0.02em` | 1 | none |
| `--type-action` | CTA (header + footer) | `0.875rem` | 700 | `0.01em` | 1 | none |
| `--type-eyebrow` | Footer column labels | `0.75rem` | 600 | `0.22em` | 1 | upper |
| `--type-drawer-nav` | Drawer nav link | `1.5rem` | 600 | `-0.01em` | 1.3 | none |
| `--type-body-sm` | Footer links & values | `0.875rem` | 400 | `0` | 1.7 | none |
| `--type-meta-sm` | Copyright, meta row | `0.8125rem` | 400 | `0` | 1.6 | none |
| `--type-lead` | Footer masthead statement | *existing* `.text-lead` | 400 | `0` | 1.7 | none |

`--type-eyebrow` is **deliberately identical to the hero's existing `.eyebrow`**. The kicker
above a hero headline and the label above a footer column are the same typographic gesture.
That single reuse is what makes the top and bottom of the site read as one publication.

> All tracking figures assume **Inter**. If Inter is not actually being served (**O1**, §15),
> every width calculation in §4 and §6 is wrong and these tokens must be re-derived.

### 3.4 Motion tokens

```css
--ease-editorial: cubic-bezier(0.22, 0.61, 0.36, 1);  /* already site-wide — reuse, don't invent */
--ease-exit:      cubic-bezier(0.4, 0, 1, 1);

--dur-hover:   240ms;
--dur-state:   400ms;   /* hide/reveal transform */
--dur-drawer:  300ms;
--dur-reveal:  700ms;   /* existing scroll-reveal */
```

There is **no duration token for the chrome cross-fade**, and that is intentional: it is
**scroll-linked, not time-linked**. Scroll position *is* the timeline (§6).

---

## 4. Alignment system

### 4.1 The defect

The site has **two conflicting shell systems**, and they do not agree.

| | Used by | Padding |
|---|---|---|
| **A** | header, `AppHero`, footer, project sub-nav | `section-shell` + `px-6` — padding **inside** the max-width |
| **B** | every body section | `section-spacing` (`px-6 md:px-8`) wrapping `section-shell` — padding **outside** |

They resolve to different left edges and different measures:

| Viewport | Body title (B) | Hero headline / logo (A) | Δ | Body measure | Hero measure |
|---|---|---|---|---|---|
| 390px | 24px | 24px | — | 342px | 342px |
| 768px | 32px | 24px | **8px** | 704px | 720px |
| 1280px | 32px | 24px | **8px** | 1216px | 1232px |
| 1440px | 80px | **104px** | **24px** | 1280px | 1232px |
| 1920px | 320px | **344px** | **24px** | 1280px | 1232px |

**On desktop the hero headline sits 24px right of every section title beneath it.** No amount
of header polish survives that. Alignment must be solved at the system level or the editorial
claim is false.

### 4.2 The canonical shell

> **This is a decision, not an assumption.** Three candidate geometries were compared —
> body-canonical, hero-canonical, and a new content-grid — on trade-offs, migration cost and
> long-term maintainability. See **[ADR-001](#adr-001--shell-geometry)**. What follows is the
> *outcome* of that comparison; do not treat it as self-evident.

One utility. Padding **inside** a max-width sized to *content*, so the measure is stable and
the gutter is responsive.

```css
:root { --shell-gutter: 1.5rem; }                                /* 24px */
@media (min-width: 48rem) { :root { --shell-gutter: 2rem; } }    /* 32px */

@theme { --shell-measure: 80rem; }                               /* 1280px of CONTENT */

.shell {
  width: 100%;
  margin-inline: auto;
  max-width: calc(var(--shell-measure) + 2 * var(--shell-gutter));
  padding-inline: var(--shell-gutter);
}
```

`.section-spacing` sheds its horizontal padding and becomes vertical-only (`--section-py`).
Markup becomes `<section class="section-y"><div class="shell">` everywhere — chrome included.

### 4.3 The alignment matrix (post-fix)

Every element below shares **one left edge** at every viewport.

| Viewport | Left edge | Measure | Header logo | Hero headline | Section title | Body copy | Footer masthead |
|---|---|---|---|---|---|---|---|
| 390px | 24px | 342px | ✓ | ✓ | ✓ | ✓ | ✓ |
| 768px | 32px | 704px | ✓ | ✓ | ✓ | ✓ | ✓ |
| 1280px | 32px | 1216px | ✓ | ✓ | ✓ | ✓ | ✓ |
| 1440px | 80px | 1280px | ✓ | ✓ | ✓ | ✓ | ✓ |
| 1920px | 320px | 1280px | ✓ | ✓ | ✓ | ✓ | ✓ |

**Blast radius — deliberately minimal.** Adopting B's geometry as canonical means:

- **Body sections move by 0px at every viewport.** They are already correct.
- **Chrome + hero converge onto them**: `+8px` at 768–1280px, `−24px` at ≥1440px, `0px` on mobile.
- Hero/footer content gets **48px wider** at desktop (1232 → 1280).

The largest movement anywhere on the site is 24px, and it moves *toward* correctness.

---

## 5. Header state machine

### 5.1 State variables

State is the product of four orthogonal dimensions. They compose; they are not a flat enum.

| Dimension | Values | Driven by |
|---|---|---|
| **Chrome** | `COVER` → `VEIL` → `NAVIGATION` | scroll progress `p ∈ [0,1]` |
| **Visibility** | `REVEALED` / `HIDDEN` | scroll *direction* |
| **Drawer** | `CLOSED` / `OPEN` | user |
| **Transient** | `ROUTING` | router |

### 5.2 Chrome states

`p = clamp(scrollY / P_END, 0, 1)` where `P_END = min(0.5 × innerHeight, 400px)`.

| | `COVER` (`p = 0`) | `VEIL` (`0 < p < 1`) | `NAVIGATION` (`p = 1`) |
|---|---|---|---|
| Scrim layer | `--scrim-chrome`, `opacity: 1 − p` | fading out | `opacity: 0` |
| Glass layer | `opacity: 0` | `opacity: p` | `opacity: 1` |
| Blur | **none** (`backdrop-filter: none`) | engaged at `p ≥ 0.05` | `--surface-chrome-blur` |
| Hairline | none | rides the glass layer's opacity | `--rule-light` |
| Logo | mono **white** | opacity cross-fade | mono **ink** |
| Nav | `--fg-dark-muted` | `color-mix()` on `p` | `--fg-light-muted` |
| Phone + CTA | absent, `inert` | fading in at `p > 0.5` | visible, CTA **solid wood** |

**The two layers are prebuilt and animated by `opacity` alone — never by interpolating
`background-color`.** This is a compositing decision with real teeth ([ADR-006](#adr-006--rendering--compositing-strategy)):
the scrim div carries a fixed gradient, the glass div carries a fixed
`--surface-chrome` + fixed `--surface-chrome-blur`, and `p` drives only their opacities. Both
are therefore **compositor-only**, and — critically — the glass's backdrop filter is **not
recomputed on every frame of the transition**, which interpolating its `background-color`
would have forced. The hairline rides the glass layer rather than being a third animated
value.

Blur engages at `p ≥ 0.05` (not 0.35): because the glass layer is only 5% opaque there, its
arrival is imperceptible, and gating it this way keeps `backdrop-filter: none` on the cover —
which is the property that actually matters.

**Why the scrim is not optional.** Every hero's own scrim is *weakest exactly where the
header sits*: `offset` mode is `linear-to-tr … to-transparent` — its transparent end lands
**top-right**, under the nav; `caption` and the Home cover are `to-t`, leaving the whole top
strip bare. Today's `bg-ink-950/10` is badly doing a job that genuinely needs doing. Moving
that job to a proper scrim is precisely what allows the *background* to become truly
transparent.

**The budget holds by construction.** `α_scrim + α_glass ≤ 1` at every value of `p` — the two
layers are complementary, never additive. Total overdraw never exceeds one opaque layer, and
the blur does not exist at all on the cover.

**`P_END` can never strand a dark scrim over white content.** The shortest hero is `compact`
(68vh); content reaches the header at `0.68·vh − headerH`:

| Viewport | Content reaches header | `P_END` | Safe |
|---|---|---|---|
| 600px | 336px | 300px | ✓ |
| 800px | 456px | 400px | ✓ |
| 1000px | 592px | 400px | ✓ |
| 1200px | 728px | 400px | ✓ |

### 5.3 Invariants

These are **enforceable assertions**, not aspirations. Each maps to a test in §13.

| # | Invariant | Rationale |
|---|---|---|
| **I1** | `HIDDEN ⟹ chrome = NAVIGATION` | The header may never hide while any part of the cover is visible. It *is* the cover. |
| **I2** | `focus-within(header) ⟹ REVEALED` | A keyboard user must never lose the element they are inside. |
| **I3** | `hover(header) ∧ pointer:fine ⟹ REVEALED` | Do not retract under the cursor. |
| **I4** | `DRAWER_OPEN ⟹ REVEALED ∧ scroll-locked ∧ p frozen` | No chrome churn behind a modal. |
| **I5** | `ROUTING ⟹ transitions suppressed ∧ DRAWER_CLOSED` | §7. |
| **I6** | `prefers-reduced-motion ⟹ HIDDEN unreachable` | Hide/reveal is motion. |
| **I7** | `α_scrim + α_glass ≤ 1` | Rendering budget. |
| **I8** | `CTA/phone focusable ⟺ p ≥ 0.5` | Never tab into an invisible control. |
| **I9** | Every page opens with a dark cover, or opts into `solid` | §1. |

### 5.4 Transition table

Every allowed edge. **Anything not listed is forbidden.**

| From | To | Trigger | Guard | Duration |
|---|---|---|---|---|
| `COVER` | `VEIL` | `scrollY > 0` | — | scroll-linked |
| `VEIL` | `COVER` | `scrollY → 0` | — | scroll-linked |
| `VEIL` | `NAVIGATION` | `p → 1` | — | scroll-linked |
| `NAVIGATION` | `VEIL` | `p < 1` | — | scroll-linked |
| `COVER` | `NAVIGATION` | — | **forbidden** — must pass through `VEIL` | — |
| `REVEALED` | `HIDDEN` | scroll down ≥ 64px cumulative | `I1 ∧ ¬I2 ∧ ¬I3 ∧ ¬I4 ∧ ¬I6` | `--dur-state` |
| `HIDDEN` | `REVEALED` | scroll up ≥ 4px **or** focus-in **or** hover **or** footer exit | — | `--dur-state` |
| `*` | `REVEALED` | route change | — | **0ms** (I5) |
| `CLOSED` | `OPEN` | trigger click / `Enter` / `Space` | `< xl` | `--dur-drawer` |
| `OPEN` | `CLOSED` | `Esc` / overlay click / close / route change / resize ≥ xl | — | `--dur-drawer` |
| `*` | `ROUTING` | `router.beforeEach` | — | 0ms |
| `ROUTING` | `COVER` \| `NAVIGATION` | `page:finish` + rAF | recompute from `scrollY` | 0ms |

`COVER → NAVIGATION` being forbidden is the formal statement of *"never abrupt."* The chrome
must always traverse `VEIL`. The only actor permitted to skip it is the router (§7), which
suppresses transitions entirely rather than animating through them.

### 5.5 Interaction states

| Element | Idle | Hover | Focus-visible | Active/current | Disabled |
|---|---|---|---|---|---|
| Nav link | `--fg-dark-muted` / `--fg-light-muted` | full fg + underline grows 0→100% | `2px --color-wood-500` outline, `2px` offset | full fg + **persistent 1.5px rule** + `aria-current="page"` | n/a |
| Logo | — | no effect | outline | — | n/a |
| VI / EN | inactive `--fg-*-subtle` | full fg | outline | full fg, weight 600 | active option `aria-pressed="true"` |
| CTA | ghost (rest) / solid (nav) | ghost→ tint; solid→ `wood-600` | outline | — | n/a |
| Phone | `--fg-*-muted` | full fg | outline | — | n/a |
| Drawer trigger | full fg | full fg | outline | `aria-expanded="true"` | n/a |

Hover uses `--dur-hover` and the existing `.link-underline` mechanic — **reused, not
reimplemented**. Active state is **never colour-only** (today it is): it carries a persistent
rule *and* `aria-current`, satisfying WCAG 1.4.1.

### 5.6 Submenus

**There are none, and none are planned.** The nav is 7 flat links.

This is recorded so a future contributor does not invent one silently. If a submenu is ever
required it must: use a disclosure pattern with `aria-expanded` + `aria-controls`; open on
click (never hover-only); close on `Esc` and outside-click; return focus to the trigger; be
fully keyboard operable; and — critically — **re-run the §6.4 overflow math**, which the
current row cannot absorb.

---

## 6. Scroll behaviour

### 6.1 Philosophy

> Scroll **position** decides *what the header looks like*. Scroll **direction** decides
> *whether the header is there at all*.

Position and direction answer different questions. Position answers *"am I still on the
cover?"* — that is a fact about the page. Direction answers *"is the reader moving forward
through the story, or coming back for the index?"* — that is a fact about **intent**.

A reader scrolling **down** is reading. Chrome is an interruption; get out of the way.
A reader scrolling **up** is navigating. They want the index; return it instantly.

This is why reveal is far more eager (4px, immediate) than hide (64px cumulative,
deliberate). **The cost of a wrongly-hidden header is much higher than a wrongly-shown one.**

### 6.2 Zones

| Zone | Range | Chrome | Hide allowed |
|---|---|---|---|
| **Cover** | `scrollY < P_END` | `COVER` → `VEIL` | **Never** (I1). The header is part of the cover. |
| **Content** | `P_END ≤ scrollY`, footer < 50% visible | `NAVIGATION` | Yes — direction-driven |
| **Footer** | footer ≥ 50% visible | `NAVIGATION` | Auto-hide: the footer *contains* the full nav, so floating chrome is redundant |

The footer zone is detected with an `IntersectionObserver` (threshold `0.5`, ~24px hysteresis)
— not a scroll calculation. Scrolling up in the footer zone reveals the header immediately,
as everywhere else.

### 6.3 Direction detection

```
hide:    cumulative downward delta ≥ 64px   AND  zone = content|footer  AND  p = 1
reveal:  any upward delta ≥ 4px             OR   focus-in  OR  hover  OR  scrollY < P_END
```

The cumulative accumulator **resets on every direction change**. This prevents flapping from
trackpad jitter and momentum overshoot.

Implementation: **one** `scroll` listener (`passive: true`), rAF-throttled, writing
`--header-p` and `--header-shift` with `el.style.setProperty` **outside Vue reactivity** — no
component re-render on scroll, no layout read in the hot path.

### 6.4 Hide/reveal is a transform, and it must carry its dependants

The header translates: `transform: translateY(var(--header-shift))`, where `--header-shift`
is `0` or `calc(-1 * var(--header-h))`. Transform only — **never `top`, `height` or
`margin`**, which would trigger layout.

**The project-detail sticky sub-nav is anchored to the header and must move with it.** If the
header hides and the sub-nav does not, an 88px gap opens above it.

```css
/* du-an/[slug].vue sub-nav — same shift, same easing, same frame */
top: var(--header-h);
transform: translateY(var(--header-shift));
transition: transform var(--dur-state) var(--ease-editorial);
```

Both elements consume the *same* token, so they move in lockstep by construction rather than
by two coincidentally-matching animations.

### 6.5 Forbidden

**Scroll-jacking is prohibited.** No `scroll-behavior` override on the document, no custom
smooth-scroll, no scroll-snap on the page, no hijacked wheel events, no scroll-driven pinning
of content. The reader's scroll is theirs. The header may respond to scrolling; it may never
*take over* scrolling.

---

## 7. Route transition behaviour

### 7.1 The failure this prevents

Nuxt's default `scrollBehavior` resets to top on a new route. But the new page's DOM can paint
**before** the scroll reset lands. Without intervention:

```
  click nav (scrollY = 2400, chrome = NAVIGATION, solid white)
      │
      ▼
  new page renders — dark hero at top of viewport
  scrollY still 2400 → chrome still NAVIGATION
      │
      ▼
  ⚡ WHITE BAR FLASHES over the new dark cover
      │
      ▼
  scroll resets to 0 → chrome animates 1 → 0 over 500ms
      │
      ▼
  ⚡ visible glass "melt" on a page the reader has just arrived at
```

Two artefacts, both fatal to the illusion that the header belongs to the cover.

### 7.2 The contract

| Phase | Hook | Action |
|---|---|---|
| 1 | `router.beforeEach` | Set `ROUTING`. Add `.chrome-no-transition` (`transition: none`). Close drawer (I5). Force `REVEALED`, `--header-shift: 0`. |
| 2 | — | Nuxt renders + resets scroll |
| 3 | `page:finish` | Recompute `p` **synchronously** from actual `scrollY` (honours `savedPosition` on back/forward). Write vars. |
| 4 | `requestAnimationFrame` ×2 | Remove `.chrome-no-transition`. Clear `ROUTING`. |

**The double rAF is load-bearing.** Removing the class in the same frame the vars are written
lets the browser coalesce both into one style recalc and animate the change anyway — the exact
melt we are preventing. The first rAF commits the new vars; the second re-enables transitions
against them as the new baseline.

**Net effect:** the header **snaps** to the correct state for the new route — never animates
into it. Forward navigation lands in `COVER` with zero flash. Back/forward to a saved mid-page
position lands in `NAVIGATION` instantly, correctly, with no reverse-melt.

### 7.3 Pre-hydration

SSR renders `p = 0` (`COVER` — transparent, mono-white logo). This is correct for a page
loaded at the top, which is essentially every entry. `useHeaderState` runs its first
measurement **synchronously in `onMounted`**, before paint.

Residual edge case: a reload with a browser-restored mid-page scroll position shows `COVER`
chrome for a single frame before hydration corrects it. Accepted — one frame, self-correcting,
and unreachable via normal navigation.

---

## 8. Motion language

### 8.1 Philosophy

> Motion in the chrome exists to make **state changes legible**, never to attract attention.
> If a motion would be noticed *as motion*, it is wrong.

Three tiers, and nothing else:

1. **Scroll-linked** (chrome cross-fade). Duration is meaningless — position *is* the
   timeline. Feels like direct manipulation, not animation. This is what makes the transition
   *progressive rather than binary*.
2. **State transitions** (hide/reveal, drawer). `--dur-state` / `--dur-drawer`, `--ease-editorial`.
3. **Micro-feedback** (hover, focus). `--dur-hover`. Colour and the underline only.

### 8.2 Allowed

| Motion | Property | Cost class | Duration | Easing |
|---|---|---|---|---|
| Scrim fade | `opacity` | **compositor** | scroll-linked | linear in `p` |
| Glass fade | `opacity` | **compositor** | scroll-linked | linear in `p` |
| Logo cross-fade | `opacity` | **compositor** | scroll-linked | linear in `p` |
| Blur engage | `backdrop-filter` | discrete toggle | at `p ≥ 0.05` | none |
| Nav/logo colour | `color` via `color-mix()` | paint (header strip only) | scroll-linked | linear in `p` |
| Hide / reveal | `transform: translateY` | **compositor** | `--dur-state` | `--ease-editorial` |
| Nav underline | `transform: scaleX()` on `::after` | **compositor** | `--dur-state` | `--ease-editorial` |
| Hover colour | `color` | paint | `--dur-hover` | `--ease-editorial` |
| Drawer slide | `transform: translateX` | **compositor** | `--dur-drawer` | `--ease-editorial` |

Two rules do the heavy lifting here.

**The blur radius is toggled, never animated.** Interpolating `blur()` forces a full-surface
re-filter every frame — the single most expensive thing this design could do.

**The glass is faded by `opacity`, never by interpolating its `background-color`.** Both
reach the same picture, but animating `background-color` repaints the glass element each
frame, and repainting a `backdrop-filter` element re-runs its filter. Opacity on a prebuilt
layer is handled by the compositor and re-runs nothing. See [ADR-006](#adr-006--rendering--compositing-strategy).

### 8.3 Forbidden

| Forbidden | Why |
|---|---|
| Scroll-jacking, smooth-scroll override, scroll-snap | The reader's scroll is theirs (§6.5) |
| Parallax (header or hero) | Cheap trick; fights the editorial stillness |
| Animating `blur()` radius | Per-frame full-surface repaint |
| Animating `width`/`height`/`top`/`left`/`margin` | Layout thrash; use `transform` |
| Spring, bounce, elastic easing | Playful ≠ premium |
| Logo scale, rotation, or any logo motion | It is a signature, not a widget |
| Letter-by-letter / typewriter reveals | Not editorial |
| Auto-playing carousels, marquees | Not editorial |
| Chrome transitions > 500ms | Reads as sluggish |
| `transition: all` | Animates properties you did not intend |
| JS animation libraries for chrome | CSS only. Chrome must survive a JS failure. |

### 8.4 Reduced motion

`prefers-reduced-motion: reduce`:

- Hide/reveal **disabled entirely** — the header is permanently `REVEALED` (I6).
- CTA/phone entrance: **opacity only**, no translate.
- Drawer: opacity, no slide.
- Hero zoom + scroll-reveals: already disabled site-wide. Unchanged.
- **Scroll-linked chrome is retained.** It is direct manipulation, not animation — it responds
  to input rather than playing on its own. Removing it would leave white-on-white text.

---

## 9. Responsive narrative

Each breakpoint **restates the whole story** — cover → index → contact. None of them is a
truncated desktop.

### Desktop (≥ 1280px) — *the open cover*

The full masthead. Logo + the 7-link index + VI/EN, and **nothing else**: 918px of content in
a 1232px shell, leaving **~314px of deliberate negative space**. That space is the luxury
signal — it is the design, not a leftover. Phone and CTA are absent, because the hero below
already carries the single primary action. They arrive on scroll, when the hero's CTA has left
the viewport and the header must take over conversion.

### Tablet (768–1279px) — *the quieter cover*

Not "desktop minus some links." At this width the 7-link index would crowd a large logo, so
the story **shifts rather than shrinks**: the cover becomes *purer* — logo + menu affordance
only — and the hero gets **more** image, not less. The index moves into the drawer, where at
`--type-drawer-nav` (24px) it reads as a **contents page**, not a phone menu.

This is why the desktop nav breakpoint is `xl` and not `lg`. It is a narrative decision, not a
width workaround.

### Mobile (< 768px) — *the portrait cover*

Header compresses to 72px; logo to 40px optical — **still ~1.5× the optical size of today's
desktop logo.** The hero recomposes via its own per-breakpoint `focal`/`anchor`
(hero-art-direction §7), so the cover is *recomposed*, never letterboxed. The drawer is the
contents page, and phone + CTA sit at its foot — where tapping a phone number is the natural,
expected act. The phone is not "restored" on mobile; **mobile is where it belongs.**

---

## 10. Footer specification

```
  ◈ LAI HUY                                        ← --logo-h-footer (56/64px optical; today: 34px)
    interior

  [positioning statement — --type-lead, max-w-xl, --fg-dark-muted]

  [ Liên hệ tư vấn ]   Xem năng lực nhà xưởng →    ← ONE solid + ONE text link
  ─────────────────────────────────────────────    ← the ONE hairline (--rule-dark)
  ĐIỀU HƯỚNG        DỊCH VỤ         LIÊN HỆ        ← --type-eyebrow, --accent-dark
  Trang chủ         Sản xuất…       ĐIỆN THOẠI
  Dự án             Thi công…       0900 000 000
  …                 …               EMAIL  …

  © 2026 Lai Huy Interior                Facebook  ← --fg-dark-subtle, separated by space alone
```

| Decision | Was | Is | Why |
|---|---|---|---|
| Masthead | inside a 4-col grid | **promoted out** | Kills the arbitrary `[1.3fr_0.8fr_0.9fr_1.2fr]` weights |
| Columns | 4 arbitrary fractions | **3 equal** | Real rhythm |
| Vertical space | `py-16` (64px) | `--footer-py` (112/144px) | The finale had *less* air than a body section |
| Logo | 34px optical | 56/64px optical | Equal-or-greater weight to the header signature |
| Opacities | 6 ad-hoc values | **3 tokens** | §3.1 |
| Contact icons | one lucide icon per line | **eyebrow labels** | The icon-per-line list is the template tell |
| Borders | 2 | **1** | And it now does editorial work — separating the finale's cover from its index — rather than fencing the copyright |
| CTAs | 2 buttons | 1 solid + 1 text link | The footer closes; it does not re-pitch |

**Continuity.** White content meeting `ink-950` is currently a hard cut. A single
`ink-900 → ink-950` vertical gradient at the footer's top edge makes the dark arrive as
*depth* rather than a slab. One gradient; the footer's entire motion and rendering budget.

---

## 11. Accessibility contract

| Requirement | Standard | Implementation |
|---|---|---|
| Nav text contrast over the cover | 1.4.3 — **4.5:1** | Scrim + `--fg-dark-muted`; **measured per hero** (O2) |
| Logo contrast over the cover | 1.4.11 — **3:1** | Mono-white derivation. *Today's logo is **1.86:1** — a live failure* |
| Active nav state | 1.4.1 | `aria-current="page"` **+ persistent rule** — never colour alone (today it is) |
| Focus indicator | 2.4.11 | Existing `wood-500` 2px `:focus-visible`, ≥3:1 on both surfaces |
| Tap targets | 2.5.5 | `--nav-item-min-h` = 44px |
| Hidden controls unfocusable | 2.4.3 | `inert` + `aria-hidden` while `p < 0.5` (**I8**) |
| Drawer is a modal | 4.1.2 | `role="dialog"` `aria-modal="true"`, **focus trap**, `Esc`, focus returned to trigger, page `inert` |
| Language toggle | 4.1.2 | `role="group"` + `aria-pressed`. *Today `aria-label` sits on a bare `<div>` — ignored by AT* |
| Motion | 2.3.3 | §8.4 |
| Zoom to 200% | 1.4.4 | No fixed heights on text containers |

Five of these are **live defects in the current build**, not new requirements: the 1.86:1 logo,
colour-only active state, the toggle's dead `aria-label`, the drawer's missing focus trap /
`Esc` / focus return, and cramped targets.

---

## 12. Rendering budget

| Surface | Gradients | Backdrop blur | Shadow |
|---|---|---|---|
| Header — `COVER` | 1 (scrim) | **0** | 0 |
| Header — `VEIL` | 1 (fading) + 1 (glass, fading in) — **complementary, α sum ≤ 1** | 1 (from `p > 0.35`) | 0 |
| Header — `NAVIGATION` | 0 | 1 | 0 |
| Hero | 1 | 0 | 0 |
| Footer | 1 | 0 | 0 |
| Drawer | 0 | 1 (overlay) | 1 |

**Never more than one backdrop blur on screen**, and **none at all on the cover**. This is a
net performance *gain*: the current header blurs at page load, on the LCP frame, for no reason.

This amends `hero-art-direction.md` §9, which scoped its budget to the hero alone. The
site-wide statement is: **≤ 1 backdrop blur on screen at any moment; chrome layers must be
complementary (α sum ≤ 1), never additive.**

---

## 13. Static screenshot test

> **The design must be signed off as final art with every animation disabled.**

Motion is a courtesy, never a crutch. With `prefers-reduced-motion: reduce` and
`animations: 'disabled'`:

- Header at rest: scrim + mono-white logo + nav — legible, balanced, premium. **No state may
  depend on motion to become legible or complete.**
- Content is fully visible (`.reveal` already defaults to visible without `reveal-ready` — the
  no-JS default is correct today and must stay).
- Hero holds its composition without the zoom.
- Header is permanently `REVEALED` (I6).
- The drawer opens correctly with no slide.

**Gate — computed, not judged.** With motion disabled, all 24 rest-state screenshots must
satisfy **every** assertion below. There is no "does it look premium" step; that question was
answered when this document was approved.

| # | Assertion | Threshold |
|---|---|---|
| S1 | Nav text contrast over the composited cover | **≥ 4.5:1** |
| S2 | Logo contrast over the composited cover | **≥ 3:1** |
| S3 | Header layers at `p = 0`: computed `opacity` | scrim `1`, glass **exactly `0`** |
| S4 | Header at `p = 0`: `border-width`, `box-shadow`, `backdrop-filter` | `0`, `none`, **`none`** |
| S5 | Every element in the §4.3 matrix shares one left edge | **drift ≤ 0.5px** |
| S6 | Header visible (`--header-shift` = 0) | always, under reduced motion |
| S7 | All below-fold content has computed `opacity: 1` | **100%** of `.reveal` nodes |
| S8 | Hero headline is the largest text node in the viewport | `font-size` rank **1** |
| S9 | Rendered logo optical height | `≥ --logo-h-header` **− 1px** |
| S10 | Elements with `visibility:hidden` / `opacity:0` in tab order | **0** |

A failure here is a **defect**, not a design conversation. Route it through the Chrome
Recovery Sequence (§21.0).

---

## 14. Visual regression budget

**Strategy.** Playwright `toHaveScreenshot`, baselines committed **per browser** — cross-browser
comparison is meaningless and is never done. Every capture: `animations: 'disabled'`,
reduced-motion emulated, `document.fonts.ready` awaited, all images decoded.

**Canonical set — 32 shots:** 8 pages × 3 viewports (390 / 768 / 1440) rest-state = 24, plus 8
scrolled-state **header-strip clips**.

| Target | `maxDiffPixelRatio` | Rationale |
|---|---|---|
| Header strip clip (`0,0,vw,--header-h + --header-scrim-h`) | **0.001** | Deterministic; anti-aliasing noise only |
| Full page, no blur | **0.02** | Photo decode + font rasterisation |
| Full page, blur present | **0.03** | Blur kernels differ across engines and GPUs |
| Layout assertions (left-edge, measure, no-wrap) | **exact** | Numeric, not pixel — see §4.3, O3 |

The alignment matrix (§4.3) is asserted **numerically** — `getBoundingClientRect().left` per
element per viewport — not by screenshot. Pixel diffing cannot tell a 24px misalignment from a
photo re-encode; a number can.

**Any diff over threshold is one of exactly two things:** an approved design change, whose PR
**must** update this document in the same commit (§17), or a bug. There is no third category,
and "looks fine to me" is not a resolution.

### 14.1 Numeric tolerances

Pixel diffing catches *change*. It cannot catch *wrongness* — a 24px misalignment and a JPEG
re-encode look identical to it. Every property below is therefore asserted as a **number**,
independently of the screenshot suite.

| # | Property | Tolerance | Measured by |
|---|---|---|---|
| **V1** | **Alignment drift** — left edge of any §4.3 element vs. the rail | **≤ 0.5px** | `getBoundingClientRect().left` |
| **V2** | **Measure drift** — content width vs. `--shell-measure` | **≤ 1px** | `getBoundingClientRect().width` |
| **V3** | **CLS — chrome** | **= 0.000** (exact) | `PerformanceObserver` `layout-shift`, attributed |
| **V4** | **CLS — page** | **≤ 0.02** | Lighthouse + field |
| **V5** | **Hero height drift** vs. spec (`100dvh` / `78vh` / `68vh`) | **≤ 2px** | `offsetHeight` |
| **V6** | **Header height drift** vs. `--header-h` | **≤ 1px** | `offsetHeight` |
| **V7** | **Colour deviation** — rendered token vs. spec value | **ΔE₀₀ ≤ 1.0** | Sampled `getComputedStyle` → Lab |
| **V8** | **Unexpected horizontal scrollbar** | **0** — `documentElement.scrollWidth ≤ clientWidth` at every viewport | assertion |
| **V9** | **Unexpected vertical scrollbar** while `DRAWER_OPEN` | **0** on `<body>` | assertion |
| **V10** | **Text reflow** — nav row line-count | **= 1** at every viewport, `lang="vi"` **and** `lang="en"` | `getClientRects().length` |
| **V11** | **Nav row overflow slack** at 1280px, VI, `NAVIGATION` | **≥ 8px** (absorbs Safari's ±7px tracking variance) | `clientWidth − scrollWidth` |
| **V12** | **Tap-target size** — every chrome control | **≥ 44 × 44px** | `getBoundingClientRect()` |
| **V13** | **Focus-ring contrast** vs. both surfaces | **≥ 3:1** | computed |
| **V14** | **Blur layers on screen** | **≤ 1** at any `p`; **= 0** at `p = 0` | count of computed `backdrop-filter ≠ none` |
| **V15** | **Composited layers from chrome** | **≤ 3** | DevTools Layers |
| **V16** | **Optical logo height** vs. `--logo-h-*` | **≤ 1px** | trimmed-bbox measure, **not** `<img>` box |

**V16 exists because the `<img>` box lies.** The source PNG's ink fills 42.4% of its canvas, so
asserting the element's height would happily pass a logo that renders at 27px. The assertion
must measure the **trimmed content box** of the rendered asset. This single check is what
prevents the original "logo is too small" defect from silently returning.

---

## 15. Browser compatibility

| Feature | Chrome | Edge | Safari | Firefox | Fallback |
|---|---|---|---|---|---|
| `backdrop-filter` | ✅ | ✅ | ✅ (`-webkit-`, emitted by Tailwind) | ✅ 103+ | `@supports not` → opaque `--surface-chrome` at α 0.98 |
| `color-mix()` | ✅ 111+ | ✅ | ✅ 16.2+ | ✅ 113+ | `@supports not` → discrete class-based colours |
| `inert` | ✅ 102+ | ✅ | ✅ 15.5+ | ✅ 112+ | JS focus trap (implemented regardless) |
| `dvh` | ✅ | ✅ | ✅ 15.4+ | ✅ | `vh` |
| `text-wrap: balance` | ✅ 114+ | ✅ | ✅ 17.5+ | ✅ 121+ | Progressive; already in use |
| CSS var writes on scroll | ✅ | ✅ | ✅ | ✅ | — |

### Accepted rendering differences (these are **not** bugs)

- **Safari** composites backdrop blur with different saturation handling — the glass reads
  marginally warmer than Chrome. Accepted.
- **Firefox** accelerates `backdrop-filter` less aggressively; minor jank is possible on
  low-end hardware during `VEIL`. Mitigated by the blur being a discrete toggle rather than an
  animated radius, and by never blurring on the cover.
- **Safari** sub-pixel text rendering shifts nav tracking by up to ±1px per link. Over 7 links
  that is ±7px — which is why the scrolled-row overflow gate (O3) requires **≥ 8px of slack**,
  not zero.
- **Safari** is known to drop `backdrop-filter` on a `position: fixed` element inside a
  transformed ancestor. The header must therefore **never** be nested under a transformed
  parent. Asserted in the browser matrix test.

Validation: the full §14 suite on Chrome, Safari (WebKit), Firefox and Edge, at all three
viewports, both chrome states.

---

## 16. Open items — **blocking implementation**

These are unresolved. They are recorded rather than guessed, because a source-of-truth
document that guesses is worse than none.

| # | Item | Why it blocks | Resolution |
|---|---|---|---|
| ~~**O1**~~ | ✅ **RESOLVED (Phase 0) — Inter IS served.** `@nuxt/fonts` (via `@nuxt/ui`) *does* detect the `:root` declaration: it provisions Inter, generates fallback-metric faces, and serves 3 woff2 files from `/_fonts/`. **Measured**, not inferred: the nav string at 13px/600/`0.12em` uppercase renders **202.34px**, identical to forced Inter and distinct from Segoe UI's **194.94px**. ⚠️ Note `document.fonts.check('16px Inter')` returns **`false`** despite Inter rendering — a subsetting artefact. **It is not a valid test; do not use it.** | — | **Closed. §3.3 / §29 typography tokens stand; the §6.4 overflow budget is computed against the correct metrics.** |
| **O2** | **Per-hero contrast of nav + logo over the composited scrim.** | The 4.5:1 / 3:1 gates in §11 are asserted against ink-950, not against *photographs*. A hero with a blown-out ceiling could still fail under the nav. | Sample composited pixels beneath each nav link and the logo across all 8 heroes × 3 breakpoints. Any failure → hero-art-direction §12 recovery (adjust **that hero's** focal), **not** a heavier global scrim. |
| **O3** | **Vietnamese scrolled-row overflow at 1280px.** VI labels run longer than EN; the scrolled row has only ~10px of slack, and Safari's tracking variance is ±7px. | The row could wrap on one browser and not another. | Assert at exactly 1280px, `lang="vi"`, `NAVIGATION` state: `scrollWidth ≤ clientWidth`, no wrap. Blocked behind O1. |
| **O4** | The `motion` package is a dependency. | §8.3 forbids JS animation in chrome. | Confirm it is unused by chrome; if unused site-wide, remove it. |

---

## 17. Documentation rules

> **This document is the single source of truth for site chrome. It leads implementation; it
> does not describe it after the fact.**

1. **Doc first.** Any change to header/footer visuals updates this document **in the same PR,
   in a commit that precedes the code.** A PR that changes chrome without a doc delta is
   rejected on sight — the reviewer does not need to read the diff.
2. **No hardcoded values.** Every visual value in `AppHeader`, `AppFooter`, `AppLangToggle` and
   the drawer resolves to a §3 token. A raw opacity, spacing or duration in chrome markup is a
   rejection. This is the rule that prevents the six-ad-hoc-opacities problem from growing back.
3. **Adding a nav item, changing CTA copy, or adding a submenu** requires re-running the §6.4
   overflow math and the O3 gate. The row has ~10px of slack; it cannot absorb an eighth link.
4. **Changing `--header-h`** requires auditing every consumer (§3.2). Two exist. They must both
   read the token — that is the whole point of the token.
5. **Changing the hero system** requires re-validating invariant **I9**, the §12 budget, and O2.
6. **Deprecating a token** requires a migration note here. Tokens are API.
7. **The invariants (§5.3) are tests, not prose.** If you cannot express a change as an
   invariant, you do not yet understand the change.

---

## 18. Migration roadmap

Unchanged from the approved plan, with Phase 3 expanded to absorb the alignment fix (§4).

| # | Phase | Gate |
|---|---|---|
| 0 | **Baseline** — 32 Playwright shots + Lighthouse, committed as "before" | Reproducible |
| 1 | **Pure extraction** — `AppHeader` / `AppFooter` / `AppLangToggle` out of `app.vue`, verbatim. Delete `AppLogo.vue` (**Nuxt UI starter residue**) | Screenshots **pixel-identical** to baseline |
| 2 | **Brand assets** — derive mono logos via a committed script (`scripts/brand/derive-logos.ts`), not hand-made binaries | Visual + size check; aspect 2:1 |
| 3 | **Tokens + canonical `.shell`** (§3, §4). Migrate all pages off `section-spacing`. Fix the `top-20` and `scroll-mt-36` couplings | **Alignment matrix asserted numerically** at 5 viewports |
| 4 | **Header state machine** — `useHeaderState`, scrim, scroll-linked chrome, hide/reveal, route hooks | Invariants I1–I8 as tests; O2 + O3 gates |
| 5 | **Drawer + a11y** — focus trap, `Esc`, `aria-modal`, `inert`, focus return | Keyboard + AT pass |
| 6 | **Footer** (§10) | Token-purity review (rule 2) |
| 7 | **Verification** — §13, §14, §15 across 4 browsers | All gates green |
| 8 | **Docs** — resolve O1–O4, promote this doc from *specification* to *implemented* | — |

**Phase 1 is deliberately a no-op.** It separates *"did moving the code break something"* from
*"did the redesign change something."* Without it the Phase 4–6 diffs are unreviewable.

**Phase 3 is the largest blast radius** — it touches all 8 pages. It is also the phase that
makes the editorial claim true. It ships alone, with numeric assertions, behind its own review.

---

## 19. Review checklist

A chrome change merges only when every box passes.

- [ ] Header is transparent over every cover — no background, no border, no blur at `p = 0`
- [ ] Hero begins at viewport top on every page
- [ ] Chrome never transitions `COVER → NAVIGATION` without traversing `VEIL` (§5.4)
- [ ] Route change **snaps**; no flash, no melt (§7)
- [ ] Logo optical size ≥ `--logo-h-header`; contrast ≥ 3:1 over every cover (O2)
- [ ] Footer logo ≥ header logo in visual weight
- [ ] Alignment matrix asserted numerically at 5 viewports (§4.3)
- [ ] Zero hardcoded visual values in chrome (§17 rule 2)
- [ ] All invariants I1–I9 covered by tests
- [ ] Nav text ≥ 4.5:1 over every cover, measured on composited pixels (O2)
- [ ] Active state is not colour-only; `aria-current` present
- [ ] Drawer: focus trap, `Esc`, focus return, `aria-modal`, page `inert`
- [ ] Tap targets ≥ 44px
- [ ] Reduced-motion: header never hides; design still premium (§13)
- [ ] Static screenshot test signed off as final art (§13)
- [ ] ≤ 1 backdrop blur on screen; none on the cover (§12)
- [ ] No scroll-jacking; natural scroll preserved (§6.5)
- [ ] Visual regression within budget on 4 browsers (§14, §15)
- [ ] **Snapshots**: no unapproved diff; CI never regenerated a baseline (§41)
- [ ] **Animation geometry**: only `opacity` / `color` / `transform` / blur animate; banlist clean (§40)
- [ ] **LCP ≤ 2.5s**, no regression > 100ms or 2% (median of 5) (§42)
- [ ] **CLS: chrome = 0.000**, page ≤ 0.02, no increase > 0.005 (§42)
- [ ] **INP ≤ 200ms**, no regression > 20ms (§42)
- [ ] Lighthouse performance ≥ baseline
- [ ] **Hero registry**: `HeroConfig` typed + Zod-validated at build; zero focal literals in pages (hero §21, §23)
- [ ] **`AppHero` branches on configuration only** — no `useRoute`, no page identity (hero §22)
- [ ] **Selection matrix recorded for every candidate** of every replaced hero (hero §24)
- [ ] This document updated **before** the code (§17 rule 1)

---

## 20. Architecture Decision Records

Format: **Context → Alternatives → Decision → Consequences.** Consequences include the costs
we are choosing to pay — an ADR that lists only benefits is marketing, not a record.

---

### ADR-001 — Shell geometry

**Status:** Accepted · **Supersedes:** the implicit "body shell is canonical" assumption in an
earlier draft of §4.

#### Context

Two conflicting shell systems exist (§4.1). The hero headline sits 24px right of every section
title at 1440px, with a different content measure (1232 vs 1280). One geometry must win. The
choice is load-bearing: it defines the rail that *every* element on the site aligns to, and
reversing it later means touching every page a second time.

#### Alternatives

**Option A — Body shell canonical.** Padding *inside* a max-width sized to content:
`max-width: calc(measure + 2·gutter); padding-inline: gutter`. Measure 1280; gutter 24→32px.

| | |
|---|---|
| Body sections move | **0px at every viewport** — they already have this geometry |
| Chrome + hero move | +8px (768–1280px), **−24px** (≥1440px), 0px mobile |
| Hero text measure | 1232 → **1280** (+48px) |
| Files touched | `main.css`, 3 chrome components, `AppHero`, `[slug]` sub-nav, + a mechanical no-op refactor of 8 pages |
| Visible regression surface | **Chrome and hero only** |

**Option B — Hero shell canonical.** `max-width: 80rem` on the *box*, `padding-inline: 1.5rem`
inside it. Content 1232px; gutter fixed at 24px.

| | |
|---|---|
| Chrome + hero move | 0px |
| Body sections move | **Every section of every page**: narrows 1280 → 1232, shifts +24px at ≥1440px, gutter drops 32 → 24px at tablet |
| Visible regression surface | **The entire site** |

**Option C — New unified content grid.** A CSS Grid rail with named lines, sections opt into
`grid-column: content` or `full`:

```css
grid-template-columns:
  [full-start] minmax(var(--shell-gutter), 1fr)
  [content-start] min(var(--shell-measure), 100% - 2 * var(--shell-gutter)) [content-end]
  minmax(var(--shell-gutter), 1fr) [full-end];
```

| | |
|---|---|
| Capability | Native full-bleed **within** flow — bands, breakout images, pull-quotes — with zero negative margins |
| Files touched | All 8 pages, **structurally** (not a class swap) |
| Complication | The site already nests grids heavily (`lg:grid-cols-[0.8fr_1.2fr]`, `[1fr_auto]`); each becomes a grid-in-grid |
| Visible regression surface | **The entire site**, with a structural diff |

#### Why B and C were rejected

**B is rejected on correctness, not just cost.** Capping the *box* at 1280px means the padding
is subtracted from the content measure — so **changing the gutter silently changes the
measure.** Gutter and measure become coupled, which is a latent footgun: a future contributor
who bumps the tablet gutter to 40px would silently narrow every line of body copy. A shell
whose two knobs interfere is the wrong abstraction regardless of migration cost. It also
inflicts a visible change on the entire site to spare the chrome — precisely backwards, since
the chrome is what we are already rebuilding — and drags the tablet gutter *down* to 24px,
below the 32px the site has already chosen for body copy.

**C is rejected on timing, not on merit.** It is strictly the most capable option and it is
where this system should eventually go. But the full-bleed problem it solves **we do not
currently have**: backgrounds already go on the outer `<section>`, and the hero image is
already `absolute inset-0`. Adopting C now means a structural rewrite of 8 pages, during the
same release that rebuilds the chrome and re-derives alignment — three large changes
interleaved in one reviewable diff. That is how regressions hide.

#### Decision

**Option A.** Body geometry becomes canonical, expressed as a single `.shell` utility (§4.2).

The deciding argument is not migration cost — it is that **A is a strict subset of C.** A uses
the same `--shell-measure` and `--shell-gutter` tokens and produces the same content rail; C's
grid, if ever adopted, is a drop-in replacement that requires **no re-derivation of alignment
and no change to any consumer.** We get the correct rail now and keep the door to C open at
zero cost. B closes that door, because its measure is not a token — it is a residue.

#### Consequences

- ✅ Body sections — the majority of the site — do not move at all. Zero visual regression there.
- ✅ One measure/gutter token pair, shared by chrome, hero and body. Alignment becomes assertable (§4.3).
- ✅ Forward-compatible with C. The migration path is mechanical, not a redesign.
- ⚠️ **The hero's text block moves up to 24px left at desktop and widens by 48px.** This is a
  real cost and it is not free: the hero compositions in `hero-art-direction.md` §10 were tuned
  with the headline at its *old* position. **The architectural-integrity and contrast gates
  (hero §11, and O2 here) must be re-run on all 8 heroes after this change.** A headline that
  previously sat in a photograph's quiet zone may now sit 24px into the subject.
- ⚠️ `section-spacing` loses its horizontal padding and 8 pages get a mechanical refactor.
  Pixel-identical by construction — and verified as such, exactly like Phase 1.

---

### ADR-002 — Alignment system

**Status:** Accepted

#### Context

ADR-001 chooses a geometry. It does not, by itself, *keep* the site aligned. The two-shell
divergence did not arrive deliberately — it accreted, because nothing could detect it. Any fix
that is not enforced will decay the same way.

#### Alternatives

1. **Convention + code review.** Document the shell, trust reviewers. Rejected: this is exactly
   what already failed. A 24px misalignment at 1440px is invisible to a reviewer reading a diff.
2. **Screenshot diffing.** Rejected: pixel diffs cannot distinguish a 24px misalignment from a
   photo re-encode or a font hint change. It would either miss the defect or drown it in noise.
3. **A lint rule** banning `max-w-7xl` / raw `px-*` outside `.shell`. Rejected *as the primary
   mechanism* — it constrains syntax, not geometry, and is trivially circumvented by an
   arbitrary value. Retained as a **secondary** guard.
4. **Numeric runtime assertion** of `getBoundingClientRect().left` per element per viewport.

#### Decision

**Alignment is asserted numerically (4), backed by the lint rule (3).**

For each of 5 viewports, assert that the header logo, hero headline, section title, body copy
and footer masthead share **one** left edge and one measure (§4.3). Alignment is a *number*, so
it is tested as a number.

#### Consequences

- ✅ The defect class that produced this whole exercise becomes impossible to reintroduce silently.
- ✅ The test doubles as executable documentation of the rail.
- ⚠️ New top-level layout elements must be added to the assertion list, or they are unguarded.
  The list is a maintenance surface, and §17 rule 3 exists to keep it honest.

---

### ADR-003 — Header state strategy

**Status:** Accepted

#### Context

The header must traverse transparent → glass → solid in a way that "feels progressive rather
than binary" (§5), without re-rendering Vue on every scroll event.

#### Alternatives

1. **Binary class toggle at a scroll threshold** *(what exists today: `scrollY > 40`)*.
   Rejected: it **commits** on a single pixel of scroll and then plays a fixed animation. That
   is the abruptness being complained about. It is also the direct cause of the route-change
   "melt" (§7.1).
2. **IntersectionObserver sentinel at the hero's bottom edge.** Rejected on two counts: it
   yields a *binary crossing*, not a progress value — so it cannot drive a continuous veil; and
   it requires the hero to expose a sentinel to the header, **violating the acyclic dependency
   rule in §2**. Chrome would have to know about covers.
3. **CSS scroll-driven animations** (`animation-timeline: scroll()`). Genuinely attractive:
   zero JavaScript, runs off the main thread entirely. Rejected **for now** on browser support
   — it is too recent to rely on across Safari/Firefox for a load-bearing legibility mechanism,
   and the failure mode (no state change at all) is white-on-white text, not a cosmetic
   degradation.
4. **Scroll-linked CSS custom property**, rAF-throttled, written outside Vue reactivity.

#### Decision

**Option 4.** `p = clamp(scrollY / P_END, 0, 1)`, written to `--header-p` via
`el.style.setProperty` from a single rAF-throttled passive listener. No Vue re-render.

#### Consequences

- ✅ Genuinely progressive: scroll position *is* the timeline. Direct manipulation, not playback.
- ✅ The router can suppress it (§7) — a time-based animation cannot be meaningfully "snapped".
- ✅ **Forward-compatible with option 3.** Because the model is already a normalised 0→1
  progress value, migrating to `animation-timeline` when support lands is a swap of the
  *producer* of `p`, with every consumer unchanged. We are not painted into a corner.
- ⚠️ One rAF-throttled listener is main-thread work. Bounded by the §23 budget (≤1ms/frame,
  zero layout reads in the hot path — `scrollY` only, never `getBoundingClientRect`).
- ⚠️ Requires JS. Mitigated: SSR renders `p = 0` (`COVER`), which is correct for any page
  loaded at the top (§7.3).

---

### ADR-004 — Logo strategy

**Status:** Accepted

#### Context

`logo-white.png` contains **no white**: its dominant ink is slate blue `#486078`, measuring
**1.86:1** over hero photography — a live WCAG 1.4.11 failure (3:1 required). That blue exists
nowhere in the `ink`/`wood` palette. And the ink fills only **42.4%** of its 500×500 canvas, so
the rendered wordmark is ~27px tall. Meanwhile `logo.png` (mobile drawer) is a *circular badge*
— a **different lockup at a different aspect ratio**. No vector master exists.

The brand rule adopted: **the logo is an adaptive signature, not a coloured badge.** Monochrome
white over dark photography, monochrome ink over light. The official colour lockup is preserved
for print, documents, favicon and social — not for the site.

#### Alternatives

1. **Keep the colour asset, just enlarge it.** Rejected: enlarging a 1.86:1 mark makes the
   accessibility failure *more* prominent, and scales an off-palette colour into a system built
   on warm neutrals.
2. **Vectorise to SVG (autotrace).** Rejected: the peacock's fine feather linework will not
   survive tracing faithfully, there is no vector master to validate against, and the result is
   unverifiable — we would be shipping a guess at the brand mark.
3. **Runtime CSS filter** (`filter: brightness(0) invert(1)`) on the colour PNG. Rejected: it
   still ships the 70KB colour asset; it costs a filter pass on the LCP frame; and `filter`
   establishes a containing block and stacking context, which is a known way to **break
   `backdrop-filter` on ancestors in Safari** (§15) — inside the one component whose entire
   design depends on `backdrop-filter` working.
4. **Derive two monochrome assets from the alpha channel at build time.**

#### Decision

**Option 4.** A committed script (`scripts/brand/derive-logos.ts`) trims the padding, takes the
alpha channel as a mask, fills it with `#fff` and `--color-ink-950`, and emits two @3x PNGs.
The header cross-fades between them by opacity.

This was **validated before being chosen**, not after: the risk was that flattening the blue
drop and the orange swooshes to one colour would merge them into an illegible blob. It does
not — the mark reads clearly, arguably better, in monochrome.

#### Consequences

- ✅ Contrast 1.86:1 → **~15:1**. The mark becomes a system citizen.
- ✅ Trimming alone yields a **2.36× optical increase at identical CSS height** — the "logo is
  too small" complaint is solved by removing padding, not by growing the box.
- ✅ One lockup everywhere. The circular badge is retired from the site, ending the two-lockup
  inconsistency for free.
- ✅ 2-colour PNGs compress far below the 70KB colour asset. Net payload **decreases**.
- ✅ The script — not a hand-made binary — is the source of truth. Regenerable, reviewable.
- ⚠️ Two `<img>` elements in the header instead of one (cross-fade). Both must carry explicit
  `width`/`height` or they contribute CLS (see **FG-15**).
- ⚠️ The colour masters stay in `public/` and become unreferenced by the site. They are
  **brand-archive assets** and must be documented as such, or a future cleanup will delete them.
- ⚠️ If the brand ever supplies a true vector master, it supersedes this: swap it in, delete
  the script.

---

### ADR-005 — Motion strategy

**Status:** Accepted

#### Context

The chrome must change state legibly without ever reading *as animation*, and must survive a JS
failure without becoming illegible.

#### Alternatives

1. **A JS animation library.** `motion` is already a project dependency (**O4**). Rejected: the
   chrome must remain functional and legible with JS broken — an animated `background` that
   never runs leaves white-on-white text. Chrome motion is a **correctness** concern, not a
   decorative one, and belongs in CSS where it degrades safely. It also adds main-thread cost
   to the scroll path.
2. **Time-based transitions on a threshold.** Rejected — see ADR-003 alt 1.
3. **Scroll-linked for continuous state; CSS transitions for discrete state; blur toggled.**

#### Decision

**Option 3**, with three tiers and nothing else: scroll-linked (chrome), state transitions
(hide/reveal, drawer), micro-feedback (hover, focus). Forbidden motions are enumerated
exhaustively (§8.3) rather than left to taste — including **scroll-jacking**, which is
prohibited outright.

#### Consequences

- ✅ Chrome degrades safely without JS.
- ✅ The forbidden list makes "no unnecessary effects" a **reviewable rule** rather than an opinion.
- ✅ Reduced-motion is coherent: hide/reveal is disabled (it is motion), while scroll-linked
  chrome is **retained** (it is direct manipulation — removing it would leave white-on-white text).
- ⚠️ `motion` may now be an unused dependency. **O4** resolves it.

---

### ADR-006 — Rendering & compositing strategy

**Status:** Accepted · **Amends:** `hero-art-direction.md` §9

#### Context

The hero doc set a rendering budget scoped to **one hero**. That budget does not compose: the
header and the hero can each be "within budget" while stacking two backdrop blurs on screen.
Separately, the naive way to fade in glass — interpolating `background-color` — is a
performance trap that a per-component budget would not catch.

#### Alternatives

1. **No budget** — accumulate effects as needed. Rejected: that is how the current header
   arrived at a blur, a tint, and a border on the LCP frame.
2. **Per-component budget** (the hero doc's model). Rejected as insufficient: two components
   individually within budget can still put two blurs on one screen. Budgets must compose.
3. **Screen-wide budget with a complementary-alpha rule.**

And, orthogonally, for fading the glass in:

- **(a) Interpolate `background-color` alpha on the glass element.** Rejected: repainting an
  element that has `backdrop-filter` **re-runs its filter**. This would re-filter the header
  strip on *every frame* of the transition — the exact cost the budget exists to prevent.
- **(b) Two prebuilt layers, animated by `opacity` only.**

#### Decision

**Screen-wide budget (3): ≤ 1 backdrop blur on screen at any moment; chrome layers must be
complementary (`α_scrim + α_glass ≤ 1`), never additive.**

**Compositing: (b).** The scrim div carries a fixed gradient; the glass div carries a fixed
background *and* a fixed blur; `p` drives only their opacities. Both are compositor-only.

#### Consequences

- ✅ The budget is now **checkable on a screenshot** — count the blurs — rather than per-file.
- ✅ Complementary alpha means total overdraw never exceeds one opaque layer, *by construction*.
  It cannot be violated by tuning a number.
- ✅ The transition costs **zero re-filters**. Per frame: two compositor opacity updates plus one
  small text repaint confined to the header strip.
- ✅ Blur is `none` on the cover — so it is absent from the **LCP frame**, which is a measurable
  improvement over today.
- ✅ Honest framing of the residual cost: a glass header re-filters while scrolling *anyway*,
  because its backdrop is moving. That cost is inherent to glass, is paid only in
  `VEIL`/`NAVIGATION`, and is **zero on the cover**.
- ⚠️ Two extra DOM nodes in the header (scrim layer, glass layer). Accepted — they are the
  mechanism.
- ⚠️ This **amends the hero doc**. §12 here is now the site-wide budget; hero §9 is subordinate
  to it. `hero-art-direction.md` must carry a pointer (§17 rule 5).

---

## 21. Failure gallery

Every gate in §19, with a concrete failure. A gate a reviewer cannot *recognise* is not a gate.

### 21.0 The Chrome Recovery Sequence

When a contrast or integrity gate fails, apply **in order, least-invasive first. Stop at the
first pass. Record which step resolved it.** This mirrors `hero-art-direction.md` §12.

| Step | Action | Scope | Cost |
|---|---|---|---|
| **CR1** | Adjust the offending hero's `focal` | that hero | none |
| **CR2** | Adjust the offending hero's `anchor` | that hero | none |
| **CR3** | Raise nav idle colour to `--fg-dark` (full white) | global | negligible |
| **CR4** | Deepen `--scrim-chrome` top stop one step (`0.55 → 0.62`) | global | **immersion** — the header gets visually heavier on *every* cover |
| **CR5** | Force that page into permanent `NAVIGATION` chrome (`<AppHeader solid />`) | that page | **the cover is lost** |

> **Never reach for CR4 before CR1–CR3.** Deepening the global scrim to rescue one photograph
> taxes all eight covers to fix one. That is the trade the current design already made badly,
> and it is how a "transparent header" quietly becomes a dark bar again.

### 21.1 Gallery

| # | Gate | What the reviewer sees | Why it fails | Recovery |
|---|---|---|---|---|
| **FG-01** | Header transparent over every cover | A faint grey band across the top of `/lien-he`, visible against the pale ceiling | A layer is not reaching `opacity: 0` at `p = 0`, or a `border-b` survived. The cover is no longer unbroken | Assert computed `opacity === 0` on both layers and `border-width === 0` at `p = 0`. Not a tuning problem — a bug |
| **FG-02** | Nav ≥ 4.5:1 over every cover | On `/nha-xuong` at 1440px, "DỊCH VỤ" sits over the lit roll-up door. Sampled composite `#c9c2b8`; nav at `--fg-dark-muted` measures **2.9:1** | The scrim is uniform; the photograph is not. The brightest zone of this cover is directly under the nav | **CR1** (shift focal so the door's highlight drops below the header band). If insufficient, **CR3**. **Not CR4** |
| **FG-03** | Logo ≥ 3:1 over every cover | The mark is legible but "washes out" on the Home cover's warm upper-left | Mono-white over a bright warm wall | **CR1**, then **CR3**. If the logo alone fails while nav passes, the fault is focal, not colour |
| **FG-04** | `COVER → NAVIGATION` traverses `VEIL` | Scrolling slowly, the header *snaps* from transparent to solid | `p` is being rounded/thresholded rather than passed through continuously, or a class toggle crept back in | Assert `p` takes ≥ 1 intermediate value in `(0,1)` across a slow programmatic scroll. Restore the continuous var (ADR-003) |
| **FG-05** | Route change: no flash | Clicking "Dự án" from mid-page on `/gioi-thieu`: a **white bar flashes** over the incoming dark hero | New page painted before the scroll reset landed; chrome still `NAVIGATION` (§7.1) | Implement §7.2 phase 1 — suppress transitions and force state in `router.beforeEach` |
| **FG-06** | Route change: no melt | After landing on the new page, the white header **fades away** over ~500ms | Transitions were re-enabled in the same frame the vars were written; the browser coalesced and animated | The **double rAF** in §7.2 phase 4. Removing it reintroduces this exactly |
| **FG-07** | I1 — never hide over a cover | Scrolling down 100px on `/du-an`, the header slides away while the hero is still full-screen | Hide guard is checking scroll delta but not `chrome === NAVIGATION` | Restore the I1 guard. Hide is only legal in the content/footer zone |
| **FG-08** | I2 — focus never lost | Tabbing through the nav with the page scrolled, the header retracts mid-tab and focus lands off-screen | Hide logic does not consult `:focus-within` | Restore I2. A keyboard user must never lose the element they are inside |
| **FG-09** | I8 — no invisible focus targets | On the cover, pressing Tab three times moves focus to *nothing*; the ring is invisible | CTA/phone are `opacity: 0` but still in the tab order | `inert` + `aria-hidden` while `p < 0.5`. `opacity: 0` alone is not hiding |
| **FG-10** | Alignment matrix | At 1440px the hero headline starts 24px right of the "Dịch vụ" section title below it | The two-shell defect (§4.1) — or a new element that bypassed `.shell` | ADR-001 geometry + the §4.3 numeric assertion. Screenshot review will **not** catch this |
| **FG-11** | Sub-nav tracks the header | On a project page, scrolling down leaves an **88px empty gap** above the sticky section nav | The sub-nav is anchored at `top: var(--header-h)` but does not consume `--header-shift` | §6.4 — both elements share the same shift token, in lockstep |
| **FG-12** | ≤ 1 blur on screen | Opening the mobile drawer while scrolled: the blurred drawer overlay sits over the blurred glass header. Text behind reads as mush | Two `backdrop-filter` layers stacked. Each component is "within budget"; the **screen** is not | ADR-006's screen-wide rule. While `DRAWER_OPEN`, the header's blur is disabled |
| **FG-13** | Reduced motion still premium | With reduced-motion on, content below the fold is **invisible** | A `.reveal` element was given an animated-only visible state | The no-JS/reduced default must be *visible* (§13). This already holds today and must not regress |
| **FG-14** | Footer is the final page | The footer still reads as a bottom bar: cramped, logo lost, four ragged columns | `--footer-py` was not applied, or the logo box was sized without accounting for the 42.4% ink fill | §10 + §3.2. Verify **optical** logo height, not box height |
| **FG-15** | CLS = 0 from chrome | A ~0.02 CLS on first load; the nav row twitches as the logo appears | The two cross-fading `<img>` lack explicit `width`/`height` | Explicit dimensions on both (ADR-004). Chrome is `fixed` and *cannot* otherwise contribute CLS — a non-zero chrome CLS is always this bug |
| **FG-16** | VI row does not wrap at 1280px | In Vietnamese at exactly 1280px, scrolled: "LIÊN HỆ" wraps to a second line and the header grows to 120px | ~10px of slack, and Safari's tracking variance is ±7px (§15) | Reduce `--nav-item-px`, or `--type-nav` tracking. Blocked behind **O1** — the numbers are wrong if Inter is not served |
| **FG-17** | No re-filter during `VEIL` | On Firefox, mid-tier hardware: visible stutter while the glass fades in. DevTools shows a full-strip repaint every frame | Someone interpolated the glass's `background-color` instead of its `opacity` | ADR-006(b). This is the trap the ADR exists to prevent, and it will *look* correct in a screenshot |
| **FG-18** | Token purity | `text-white/62` appears in `AppFooter.vue` | A seventh ad-hoc opacity. This is precisely how the current six accumulated | §17 rule 2 — reject the PR. Add the token, or use an existing one |

---

## 22. Token ownership

> Every variable has exactly **one** owner and **one** layer. If you do not know where a token
> belongs, it does not belong anywhere yet — decide before you ship it.

### 22.1 Layers

| Layer | What | Where | Owner | May reference |
|---|---|---|---|---|
| **L0 — Primitive** | `--color-ink-*`, `--color-wood-*`, `--font-*`, keyframes | `main.css` `@theme` | Design system | nothing |
| **L1 — Semantic (global)** | `--fg-dark*`, `--fg-light*`, `--rule-*`, `--accent-*`, `--shell-measure`, `--shell-gutter`, `--section-py`, `--ease-*`, `--dur-*`, `--type-eyebrow` | `main.css` `:root` | **This document** | L0 |
| **L2 — Component** | header / footer / hero tokens (below) | Component or `main.css` | The component's spec | L1, L0 |
| **L3 — Page override** | `--subnav-h` only | The page | The page | L1, L0 |

**Tokens flow downward only.** L1 may never reference an L2 token. A component may never
redefine an L0 colour. **No component may invent a colour** — new colours enter at L0, via a
doc update.

### 22.2 Component tokens (L2)

| Owner | Tokens |
|---|---|
| **Header** | `--header-h`, `--header-h-xl`, `--header-scrim-h`, `--header-p`, `--header-shift`, `--surface-chrome`, `--surface-chrome-blur`, `--scrim-chrome`, `--nav-item-*`, `--header-group-gap`, `--header-action-gap`, `--logo-h-header*`, `--type-nav`, `--type-lang`, `--type-meta` |
| **Footer** | `--footer-py*`, `--footer-masthead-gap`, `--footer-col-gap`, `--footer-meta-gap`, `--logo-h-footer*`, `--type-body-sm`, `--type-meta-sm` |
| **Hero** | Scrim gradients, focal/anchor. Owned by `hero-art-direction.md`. **Currently expressed as inline Tailwind classes, not tokens** — a known inconsistency, out of scope here, recorded so it is not mistaken for a pattern to copy |
| **Shared (L1, deliberately)** | `--type-eyebrow`, `--type-action`, `--type-lead`, `--ease-editorial` |

`--type-eyebrow` living at **L1 rather than under either component is the whole thesis of this
redesign.** The kicker above a hero headline and the label above a footer column are the same
typographic gesture. If a future contributor "tidies" it into two component-local tokens, the
top and bottom of the site will drift apart — which is exactly the state we started from.

### 22.3 Public chrome API

The **only** tokens a page or another component may read. Everything else is private.

| Token | Read by | Contract |
|---|---|---|
| `--header-h` | project sub-nav (`top`), scroll anchors (`scroll-margin-top`) | Current header height |
| `--header-shift` | project sub-nav (`transform`) | `0` or `-1 × --header-h` |
| `--subnav-h` | scroll anchors | L3; page-owned |
| `--shell-measure`, `--shell-gutter` | any layout | The alignment rail |
| `--section-py` | any section | Vertical rhythm |

**`--header-p` and `--header-shift` are written by `useHeaderState` and by nothing else.**
`--header-shift` is readable but never writable outside the composable. Any other component
writing chrome state is a §2 dependency violation.

---

## 23. Performance budget

> **[Appendix A](#appendix-a--performance-budget) is normative and complete.** This section is
> the same budget stated in context. If the two ever disagree, Appendix A wins and this section
> is the bug. Edit Appendix A.

Engineering targets, measured — not adjectives. Baseline is captured in Phase 0; every figure
below is a **gate**, not an aspiration.

### 23.1 Frame budget (scroll hot path)

| Metric | Target | How measured |
|---|---|---|
| Scroll handler cost | **≤ 1ms** per rAF | Performance panel, 2000px programmatic scroll |
| Layout (reflow) during scroll | **0** | Zero "Layout" entries attributable to chrome |
| Forced synchronous layout | **0** | The handler reads `scrollY` only — **never** `getBoundingClientRect`/`offsetTop` |
| Style recalc scope | Header subtree only | No document-wide invalidation from a var write |
| Paint area during `VEIL` | ≤ header strip (`vw × (--header-h + --header-scrim-h)`) | Paint flashing |
| Backdrop re-filters per transition frame | **0** *(beyond the one inherent to a moving backdrop)* | ADR-006(b). A regression here is **FG-17** |
| Vue re-renders during scroll | **0** | Vue DevTools timeline |
| Sustained FPS while scrolling | **≥ 55fps**, no frame > 32ms, on 4× CPU throttle | Performance panel |

### 23.2 Compositing

| Metric | Target |
|---|---|
| Composited layers from chrome | **≤ 3** (header, drawer overlay, drawer panel) |
| Backdrop-filter layers on screen | **≤ 1 at any moment** (ADR-006). **0 on the cover** |
| Chrome animations running off the compositor | Hide/reveal, scrim fade, glass fade, logo fade — **all compositor-only** |
| `will-change` | Only `transform` on the header, and only while in the content/footer zone. Never permanent — it costs memory |

### 23.3 Layout stability

| Metric | Target |
|---|---|
| CLS contributed by chrome | **0.000** |
| CLS, page-wide | ≤ 0.02 |

The header is `position: fixed` — out of flow — and hide/reveal is a `transform`. **Chrome
therefore cannot contribute CLS by construction.** A non-zero chrome CLS has exactly one cause:
the cross-fading logo `<img>` elements are missing explicit `width`/`height` (**FG-15**).

### 23.4 Payload & load

| Metric | Target | Note |
|---|---|---|
| Mono logo assets | **≤ 8KB each** (@3x, 2-colour palette PNG) | vs 70KB colour master |
| Net asset delta | **negative** (≈ −120KB) | Colour masters leave the render path |
| Chrome JS added | **≤ 2KB gz** | `useHeaderState` + `AppLangToggle`; `AppLogo` deleted |
| Blur on the LCP frame | **none** | Today's header blurs at page load. Removing it is a measurable win |
| LCP | **≥ baseline** (expected: improved) | Hero image unchanged; the LCP frame does strictly less work |
| TBT | no increase | |
| Lighthouse Performance | **≥ baseline**, no category regression | |

---

## 24. Definition of Done

The redesign may merge **only** when every row below is satisfied, with the stated evidence
attached to the PR. A row without evidence is not done — it is asserted.

| # | Criterion | Evidence required | Blocking |
|---|---|---|---|
| 1 | **Open items resolved** | O1–O4 (§15) each closed with a finding, not an assumption | ✅ |
| 2 | **Visual review** | 24 rest-state screenshots (8 pages × 3 viewports), signed off **with motion disabled** (§13) | ✅ |
| 3 | **Header integrated into every cover** | Transparent, no border, no blur at `p = 0`, on all 8 pages | ✅ |
| 4 | **Contrast, measured** | Nav ≥ 4.5:1 and logo ≥ 3:1 on **composited pixels**, all 8 heroes × 3 viewports (O2). Any recovery step used is recorded | ✅ |
| 5 | **Alignment** | §4.3 matrix asserted **numerically** at 5 viewports (ADR-002) | ✅ |
| 6 | **Hero gates re-run** | ADR-001 moves hero text ≤ 24px. `hero-art-direction.md` §11 architectural-integrity + poster tests re-run on all 8 heroes | ✅ |
| 7 | **State machine** | Invariants **I1–I9** each covered by a test (§5.3) | ✅ |
| 8 | **Route transitions** | No flash, no melt, forward + back/forward with `savedPosition` (FG-05, FG-06) | ✅ |
| 9 | **Accessibility** | WCAG **AA**: keyboard traversal, focus trap, `Esc`, focus return, `aria-current`, `aria-pressed`, `inert`, 44px targets. Screen-reader pass on header + drawer + footer | ✅ |
| 10 | **Reduced motion** | Header never hides; all content visible; design still premium (§13) | ✅ |
| 11 | **Responsiveness** | 390 / 768 / 1440 each **intentionally composed** (§9) — not a scaled desktop | ✅ |
| 12 | **VI overflow** | No wrap at 1280px, `lang="vi"`, `NAVIGATION` state, **≥ 8px slack** (O3, FG-16) | ✅ |
| 13 | **Visual regression** | 32-shot suite within the §14 budget | ✅ |
| 14 | **Browser validation** | Full suite on **Chrome, Edge, Safari, Firefox**; §15 deltas confirmed as *accepted*, not new | ✅ |
| 15 | **Performance** | §23 budget met. Lighthouse ≥ baseline. **0 chrome CLS. ≤ 1 blur on screen. 0 blur on the cover** | ✅ |
| 16 | **Token purity** | Zero hardcoded visual values in chrome (§17 rule 2, FG-18). Every token has an owner (§22) | ✅ |
| 17 | **Rendering budget** | Screen-wide, verified on screenshots (ADR-006) | ✅ |
| 18 | **Documentation** | This document updated **before** the code, ADRs reflect what was actually built, status promoted *specification → implemented* | ✅ |
| 19 | **Dependency graph** | `AppHero` ↮ `AppHeader`; no cycles; `useHeaderState` is the sole writer of chrome state (§2) | ✅ |
| 20 | **Brand identity** | Logo optically ≥ 1.8× today, contrast-passing, one lockup site-wide; colour masters preserved for print/social | ✅ |
| 21 | **Web Vitals** (§42) | Median of **5 runs**, all 8 pages, 4× throttle: **LCP ≤ 2.5s** and no regression > 100ms/2% · **chrome CLS = 0.000**, page ≤ 0.02 · **INP ≤ 200ms**, no regression > 20ms. A measurable regression **rejects the change** | ✅ |
| 22 | **Snapshot approval** (§41) | No unapproved visual diff. CI never regenerated a baseline. Every approved diff names the design change that explains it | ✅ |
| 23 | **Animation geometry** (§40) | Only `opacity` / `color` / `transform` / blur animate. Banlist clean, incl. `background-size` in chrome. **Chrome CLS = 0 by construction** | ✅ |
| 24 | **Hero registry** (hero §21–§23) | `HeroConfig` strictly typed + Zod-validated at build. **Zero focal/mode/atmosphere literals in page templates.** Zod and `HeroReview` absent from the client bundle | ✅ |
| 25 | **`AppHero` configuration-driven** (hero §22) | No `useRoute`, no page identity, no per-page conditionals. Home remains bespoke (§30.1) | ✅ |
| 26 | **Hero image provenance** (hero §24) | Full §6 matrix recorded for **every candidate** of every replaced hero — not just winners. Score ≥ 70; `approval` recorded for 70–84 | ✅ |

**Every row is blocking.** There is no "ship it and fix later" column, because the failure mode
of this redesign is not a broken build — it is a site that quietly looks like a template again.

---

## 25. Design token freeze

> **No magic numbers.** A component may not contain a spacing, size, colour, opacity, radius,
> shadow, blur, gradient, easing, duration, z-index, breakpoint or type value that is not a
> named token. Not "should not" — **may not.** It is a build failure, not a review comment.

### 25.1 What is frozen

| Class | Frozen set | Escape hatch |
|---|---|---|
| **Colour** | `--color-ink-{50…950}`, `--color-wood-{50…950}` (L0) → semantic `--fg-*`, `--rule-*`, `--accent-*`, `--surface-*` (L1/L2) | **None.** New colours enter at L0 via a doc PR |
| **Opacity** | Only as baked-into a semantic colour token | **None.** `text-white/62` is forbidden — that is how six ad-hoc opacities accumulated |
| **Spacing** | `--header-*`, `--nav-*`, `--footer-*`, `--shell-gutter`, `--section-py` (§3.2) | **None** |
| **Size** | `--header-h*`, `--logo-h-*`, `--shell-measure`, `--subnav-h` | **None** |
| **Typography** | `--type-*` (§3.3) — size, weight, tracking, leading, case | **None** |
| **Blur** | `--surface-chrome-blur` (single value: `16px`) | **None.** A second blur value implies a second blur — see §12 |
| **Gradient** | `--scrim-chrome` (header), footer top gradient | **None** |
| **Easing** | `--ease-editorial`, `--ease-exit` | **None** |
| **Duration** | `--dur-hover`, `--dur-state`, `--dur-drawer`, `--dur-reveal` | **None** |
| **Radius** | `--radius-pill` (`9999px`), `--radius-card` (`1rem`) | **None** |
| **Shadow** | `--shadow-drawer` — the **only** shadow token in chrome | **None.** Chrome has 0 shadows outside the drawer (§12) |
| **Z-index** | `--z-header: 50`, `--z-drawer: 60`, `--z-lightbox: 80` | **None.** Raw `z-*` in chrome is forbidden |
| **Breakpoint** | `--bp-md: 48rem`, `--bp-xl: 80rem` | **None.** `lg` is **not** a chrome breakpoint (ADR: §9) |

### 25.2 Values that look like magic numbers but are derived

Each of these is a **computed constant**, not a taste choice. They are frozen here so nobody
"rounds them off."

| Value | Where | Derivation | Do not change without |
|---|---|---|---|
| `0.48` | `--fg-dark-subtle` | `0.45` composites to **4.54:1** on ink-950 — passes AA by 0.04. `0.48` → **5.0:1** | Re-deriving contrast |
| `ink-500` | `--fg-light-subtle` | `ink-400` = **3.4:1** on white → fails body text. `ink-500` = **5.4:1** | Re-deriving contrast |
| `0.05` | Blur engage threshold | Glass is 5% opaque → blur arrival imperceptible, and `backdrop-filter: none` holds on the cover | ADR-006 |
| `0.5` | CTA/phone focusability | I8 — the point at which they are visible enough to be legitimate targets | §5.3 |
| `min(0.5 × vh, 400px)` | `P_END` | Proven (§5.2) never to strand a dark scrim over white content, down to a 600px viewport | Re-running the table |
| `64px / 4px` | Hide / reveal deltas | Asymmetric **by design** — §6.1. Reveal is eager; hide is deliberate | §6.1 |
| `8px` | Nav overflow slack | Absorbs Safari's ±7px tracking variance over 7 links (§15) | O1, O3 |
| `2:1` | Logo aspect | Measured from the trimmed asset (424×212) | Re-deriving the asset |
| `160px` | `--header-scrim-h` | Covers an 88px header + the type beneath it, decaying to 0 before hero content | O2 |

### 25.3 Enforcement

| Layer | Rule |
|---|---|
| **Lint** | Ban raw Tailwind colour/opacity/spacing/duration/z-index utilities inside `AppHeader`, `AppFooter`, `AppLangToggle`, drawer. Allowed: layout primitives (`flex`, `grid`, `items-*`) which encode no visual value |
| **Review** | §17 rule 2 — a raw value is a rejection, not a discussion (**FG-18**) |
| **Test** | **V7** — rendered colours asserted against token values at **ΔE₀₀ ≤ 1.0** |

---

## 26. Component contracts

Seven components. For each: what it **owns**, what it **must never do**, its **public API**, and
its **forbidden knowledge** — the facts it is not allowed to possess, because possessing them
creates the coupling this architecture exists to prevent.

> **Forbidden knowledge is the load-bearing column here.** Most architectures rot not because a
> component does the wrong thing, but because it *knows* the wrong thing.

### 26.1 `AppHeader`

| | |
|---|---|
| **Responsibilities** | Chrome markup; nav; language toggle mount; CTA + phone; drawer trigger; applying `--header-p` / `--header-shift` to its own subtree |
| **Non-responsibilities** | Computing scroll state (that is `useHeaderState`); knowing what page it is on; knowing what is behind it |
| **Public API** | `<AppHeader :solid="boolean" />` — `solid` forces permanent `NAVIGATION` chrome (the I9 escape hatch). **That is the entire API.** |
| **Emits** | Nothing |
| **Forbidden knowledge** | The current route. Hero mode / atmosphere / focal. Whether a hero exists. Any page's DOM. Its own height in pixels (it reads `--header-h`) |

### 26.2 `AppHero`

| | |
|---|---|
| **Responsibilities** | Cover composition; **its own** scrim; image, focal, anchor, mode, atmosphere; the LCP fetch |
| **Non-responsibilities** | Protecting the header's legibility (that is `--scrim-chrome`); knowing the header's height; reserving space for chrome |
| **Public API** | Props + slots per `hero-art-direction.md` §17 |
| **Forbidden knowledge** | `useHeaderState`. `--header-p`. `--header-shift`. Whether the header is transparent, hidden, or solid |
| **Contract it must uphold** | **I9** — it renders a dark cover. That is the *only* promise the header relies on |

### 26.3 `AppFooter`

| | |
|---|---|
| **Responsibilities** | Footer markup, per §10 |
| **Non-responsibilities** | **All of them.** It is purely presentational |
| **Public API** | `<AppFooter />` — no props |
| **State** | **None.** No composable, no refs, no lifecycle hooks |
| **Forbidden knowledge** | Scroll position. Header state. Route. Everything |

> If `AppFooter` ever needs state, the requirement is wrong. The footer is the one component in
> this system with **zero** moving parts, and that is a feature to be defended.

### 26.4 Drawer (`AppDrawer`)

| | |
|---|---|
| **Responsibilities** | Modal panel; focus trap; `Esc`; focus return; body scroll lock; page `inert`; its own overlay |
| **Non-responsibilities** | Deciding *when* it may open (the header's breakpoint owns that); nav content (it renders the same `navLinks`) |
| **Public API** | `v-model:open` · `@close` |
| **Forbidden knowledge** | `--header-p`. Scroll progress. Which page it is on |
| **Invariant** | `DRAWER_OPEN ⟹ header REVEALED ∧ header blur disabled` (I4, **FG-12**) |

### 26.5 `AppLangToggle`

| | |
|---|---|
| **Responsibilities** | Render VI/EN; call `setLocale`; `role="group"` + `aria-pressed` |
| **Non-responsibilities** | Owning locale state (that is `useLanguage`); styling itself for a surface |
| **Public API** | `<AppLangToggle :surface="'dark' \| 'light'" />` |
| **Forbidden knowledge** | Header state. Scroll. Route |

> `surface` is a **prop, not a detection.** The toggle must never inspect its own background to
> decide its colour. The parent knows the surface; the child is told.

**This component exists specifically because its logic was duplicated** between the header and
the drawer. Re-duplicating it is a regression, not a shortcut.

### 26.6 Hero Bridge (`AppHero` `#aside` slot)

The single glass/info surface permitted to straddle the hero→content seam (metrics, facts,
chips). Governed by `hero-art-direction.md` §13 (*hero exit choreography*).

| | |
|---|---|
| **Responsibilities** | Being an **information container** — metrics, facts, chips |
| **Non-responsibilities** | Readability rescue. **Glass is never a text background** (hero §2, principle 16) |
| **Public API** | `<template #aside>` on `AppHero` |
| **Budget** | **≤ 1 glass surface per hero**, and it counts against the **screen-wide** blur budget (§12) — so a Hero Bridge and a glass header may **never** be visible simultaneously |
| **Forbidden knowledge** | Header state |

> The Hero Bridge is the one place where the hero and the chrome budgets *collide*. §12 resolves
> it: the bridge lives at the hero's bottom edge, the glass header only exists once the cover is
> leaving. They are separated by scroll position, not by luck — but it is **asserted** (V14), not
> assumed.

### 26.7 Shared Layout Shell (`.shell`)

| | |
|---|---|
| **Responsibilities** | The one alignment rail: `--shell-measure` + `--shell-gutter` (ADR-001) |
| **Non-responsibilities** | Vertical rhythm (`--section-py`); background; colour |
| **Public API** | `class="shell"` |
| **Consumers** | Header, hero, every section, footer, project sub-nav — **without exception** |
| **Forbidden** | Any component defining its own `max-width` + horizontal padding. That is precisely the two-shell defect (§4.1) |

### 26.8 Dependency graph — frozen

```
app.vue ──► AppHeader ──► useHeaderState   (sole writer of --header-p / --header-shift)
        │             └─► AppLangToggle ──► useLanguage
        │             └─► AppDrawer ──────► AppLangToggle
        ├─► NuxtPage  ──► AppHero  ────────► (nothing in chrome)
        └─► AppFooter                        (nothing at all)
```

**Zero cycles. Zero back-edges.** No arrow may ever point from `AppHero` into chrome, or from
`AppFooter` anywhere. The only chrome↔cover contract is the token `--header-h` and the invariant
I9 — **a token is not a dependency.**

---

## 27. Animation ownership

> **Every animated property has exactly one owner.** Two systems animating one property is not
> a merge conflict — it is a race, and it will surface as jitter on one device and never
> reproduce on yours.

| Animation | **Owner** | Mechanism | Property | Never touched by |
|---|---|---|---|---|
| Chrome cross-fade (scrim, glass) | **`useHeaderState`** | scroll-linked `--header-p` | `opacity` | Anything else. Ever |
| Header hide / reveal | **`useHeaderState`** | `--header-shift` | `transform` | The page, the sub-nav (it *reads* the token, never writes it) |
| Logo cross-fade | **`AppHeader`** (CSS, from `--header-p`) | derived | `opacity` | JS |
| Nav / logo colour | **`AppHeader`** (CSS, `color-mix` on `--header-p`) | derived | `color` | JS |
| Blur engage | **`AppHeader`** (CSS class at `p ≥ 0.05`) | discrete | `backdrop-filter` | Any interpolation (**FG-17**) |
| Nav underline, hover | **`AppHeader`** (CSS `:hover`) | transition | `transform: scaleX()`, `color` | JS |
| Drawer slide + overlay | **`AppDrawer`** (CSS + `<Transition>`) | transition | `transform`, `opacity` | `useHeaderState` |
| Hero image zoom | **`AppHero`** (CSS `.hero-image`) | one-shot keyframe | `transform` | Chrome, JS, scroll |
| Hero content reveal | **`v-reveal` / `plugins/reveal.ts`** | IntersectionObserver | `opacity`, `transform` | `useHeaderState`, `AppHero` |
| Section reveals | **`v-reveal`** (same observer) | IntersectionObserver | `opacity`, `transform` | Chrome |
| Project sub-nav shift | **`useHeaderState`** (via `--header-shift`) | derived token | `transform` | The page (read-only consumer) |
| Route transition | **`useHeaderState`** (`router` hooks) | suppression, not animation | — | Any component |
| Page scroll | **The browser.** Nobody. | native | — | **Everyone** (§6.5 — scroll-jacking is forbidden) |

### 27.1 The three ownership rules

1. **One owner per property, per element.** `transform` on the header belongs to
   `useHeaderState`. If `AppHeader` also wants to translate something, it translates a *child*.
2. **IntersectionObserver instances are not shared across concerns.** There are exactly
   **three**: `plugins/reveal.ts` (content reveals, site-wide), `useHeaderState` (footer-zone
   detection), and `du-an/[slug].vue` (active section in the sub-nav). A fourth requires a doc
   update — observers are cheap individually and a swamp collectively.
3. **Scroll is never owned.** The browser owns it. Chrome *reacts* to scroll; it never drives,
   smooths, snaps, or hijacks it.

---

## 28. Rollback strategy

> **Every phase is independently revertible, and every commit leaves `main` deployable.**
> A phase that cannot be reverted alone is not a phase — it is two phases that have been
> incorrectly merged.

### 28.1 One commit = one responsibility

**Never mix these three in one commit.** This is the single rule that makes review and rollback
possible:

| Kind | Definition | Screenshot expectation |
|---|---|---|
| **Refactor** | Code moves. Behaviour and pixels identical | **Byte-identical** |
| **Design** | Pixels change. Behaviour identical | Diffs, all explained by the doc |
| **Behaviour** | Interaction changes | Diffs only in the states involved |

A commit whose screenshots change when it claimed to be a refactor is **reverted, not
debugged** — the claim was false, and whatever else it did is now unreviewed.

### 28.2 Phase revert matrix

| Phase | Revert | Independently revertible | Leaves prod deployable | Notes |
|---|---|---|---|---|
| 0 · Baseline | delete artefacts | ✅ | ✅ | No prod code |
| 1 · Extraction *(refactor)* | `git revert` | ✅ | ✅ | Pure move. Byte-identical screenshots |
| 2 · Brand assets *(refactor)* | `git revert` | ✅ | ✅ | Assets unreferenced until Phase 4 — **inert on their own** |
| 3 · Tokens + `.shell` *(design)* | `git revert` | ✅ | ✅ | **Highest blast radius** — see 28.3 |
| 4 · Header state *(behaviour)* | `git revert` | ⚠️ depends on 3 | ✅ | Revert 4 alone → old header on the new shell. **Valid and shippable** |
| 5 · Drawer + a11y *(behaviour)* | `git revert` | ✅ | ✅ | Independent of 4 |
| 6 · Footer *(design)* | `git revert` | ✅ | ✅ | Independent of everything |
| 7 · Verification | n/a | — | ✅ | Tests only |
| 8 · Docs | n/a | — | ✅ | — |

**Dependency edges are one-way: 4 → 3, and nothing else.** Phases 5 and 6 may be reverted in any
order, at any time, without touching the header.

### 28.3 Phase 3 is the one to be afraid of

It touches all 8 pages and moves the hero's text. It therefore ships **alone**, with:

- A **pure-refactor** sub-commit (pages migrated `section-spacing` → `section-y` + `.shell`),
  which must produce **byte-identical screenshots**. If it does not, the shell is wrong — stop.
- A **design** sub-commit (chrome + hero converge onto the rail), which produces exactly the
  drift predicted in ADR-001: **+8px** at 768–1280, **−24px** at ≥1440, **0px** mobile.

> Any pixel movement in Phase 3 that is **not** one of those three numbers is a bug. This is the
> whole reason the phase is split — the refactor half proves the shell is correct *before* the
> design half moves anything.

### 28.4 Kill switch

`--header-p` frozen at `1` and `<AppHeader solid />` globally reproduces a conventional solid
header on every page: legible, accessible, WCAG-passing, no scrim, no scroll coupling. **One
prop.** It is the emergency exit if O2 fails catastrophically across multiple heroes in
production, and it degrades the design without breaking the site.

---

# Appendix A — Performance budget

**Normative.** Baseline captured in Phase 0. Every figure is a gate.

## A.1 JavaScript execution

| Metric | Limit | Method |
|---|---|---|
| Chrome JS added (gz) | **≤ 2KB** | `useHeaderState` + `AppLangToggle`; `AppLogo` deleted |
| Chrome JS **removed** | ≥ 1 component | `AppLogo.vue` (dead template residue) |
| Scroll handler, per rAF | **≤ 1ms** | Performance panel, 2000px programmatic scroll |
| Long tasks introduced (> 50ms) | **0** | Performance panel |
| TBT delta | **≤ 0ms** | Lighthouse |
| Main-thread work during scroll | **≤ 1 rAF callback per frame** | Coalesced; never one handler per `scroll` event |

## A.2 Layout & reflow

| Metric | Limit |
|---|---|
| Layout (reflow) attributable to chrome, during scroll | **0** |
| **Forced synchronous layout** in the scroll path | **0** — the handler reads `scrollY` only. `getBoundingClientRect`, `offsetTop`, `offsetHeight`, `getComputedStyle` are **banned** from the hot path |
| Style-recalc scope on a `--header-p` write | Header subtree only — **no** document-wide invalidation |
| Layout-inducing animated properties | **0** — `width`, `height`, `top`, `left`, `margin` are forbidden (§8.3) |

> The `--header-p` custom property is declared with `@property { inherits: false }` on the
> header element, so a write cannot invalidate the document. Without that declaration a custom
> property write invalidates every descendant that *might* inherit it — the single most common
> way a "cheap" CSS-var animation becomes expensive.

## A.3 rAF & scheduling

| Metric | Limit |
|---|---|
| rAF callbacks registered by chrome | **≤ 1** (shared, coalesced) |
| rAF scheduled while not scrolling | **0** — no idle loop |
| rAF callbacks after unmount | **0** — cancelled in `onScopeDispose` |
| Scroll listeners | **1**, `{ passive: true }` |
| Resize listeners | **1**, debounced ≥ 100ms |

## A.4 Compositing, paint & GPU

| Metric | Limit |
|---|---|
| **Backdrop-blur layers on screen** | **≤ 1** at any moment · **0** at `p = 0` (the cover) · **0** on the LCP frame |
| Composited layers from chrome | **≤ 3** (header, drawer overlay, drawer panel) |
| `will-change` | `transform` on the header **only while in the content/footer zone**. Never permanent — it costs memory |
| Paint area during `VEIL` | ≤ `vw × (--header-h + --header-scrim-h)` |
| **Backdrop re-filters per transition frame** | **0** beyond the one inherent to a moving backdrop (ADR-006 · **FG-17**) |
| Chrome animations off the compositor | **0** — scrim, glass, logo, hide/reveal are all `opacity`/`transform` |
| Shadows in chrome | **0**, outside the drawer (`--shadow-drawer`) |
| Filters (`filter:`) in chrome | **0** — it creates a containing block and **breaks Safari's `backdrop-filter`** (ADR-004 alt 3) |

## A.5 Memory

| Metric | Limit |
|---|---|
| Retained listeners after route change | **0** |
| Retained IntersectionObservers after unmount | **0** |
| Permanent `will-change` layers | **0** |
| Detached DOM nodes after 10 route changes | **0** (heap snapshot) |
| JS heap growth over 10 route changes | **≤ 1MB** |

## A.6 Core Web Vitals

| Metric | Target | Note |
|---|---|---|
| **LCP** | **≥ baseline** (expected *better*) | Hero image unchanged; the LCP frame no longer paints a blur |
| **CLS — chrome** | **= 0.000** (exact) | `fixed` + `transform` ⇒ impossible by construction. Non-zero has exactly one cause: **FG-15** |
| **CLS — page** | **≤ 0.02** | |
| **INP** | **≤ 200ms** (p75) · **≤ baseline** | Drawer open/close and nav activation are the interactions at risk |
| **FPS while scrolling** | **≥ 55fps**, no frame > **32ms**, at **4× CPU throttle** | |
| Lighthouse Performance | **≥ baseline**, no category regression | |

## A.7 Assets

| Metric | Limit |
|---|---|
| Mono logo, each | **≤ 8KB** (@3x, 2-colour palette PNG) |
| Net asset delta | **negative** (≈ **−120KB**) — colour masters leave the render path |
| New font requests | **0** (pending **O1**) |
| New network requests from chrome | **0** |

---

# Appendix B — Accessibility matrix

**WCAG 2.2 Level AA.** Every row is verified; none is assumed.

| Mode | Verification | Pass criteria |
|---|---|---|
| **Keyboard** | Tab through header → drawer → page → footer, on cover and scrolled | Logical order; **no** focus on `inert`/invisible controls (**I8**); header never retracts under focus (**I2**); every control reachable and operable via `Enter`/`Space` |
| **Touch** | 390px, real device | Targets **≥ 44×44px** (V12); drawer opens/closes; no hover-only affordance; `tel:`/`mailto:` links work |
| **Mouse** | Hover across all chrome | Header never retracts under the cursor (**I3**); hover states are not the *only* signal |
| **Screen reader** | NVDA + Firefox · VoiceOver + Safari | Nav announced as navigation; **active link announced via `aria-current`, not colour**; language toggle announced as a group with `aria-pressed`; drawer announced as a modal dialog and traps SR focus; the header's hidden CTA/phone are **not announced** at `p < 0.5` |
| **Reduced motion** | `prefers-reduced-motion: reduce` | Header **never hides** (**I6**); no slide/zoom; **all content visible**; scroll-linked chrome retained (removing it leaves white-on-white) |
| **High contrast** | Windows **Forced Colors Mode** | Chrome remains legible; the scrim is decorative and may vanish — **so the header must fall back to a solid `Canvas` background**, not rely on the scrim for contrast. `forced-colors: active` ⇒ `--surface-chrome: Canvas`, `--fg-*: CanvasText`, blur `none` |
| **200% zoom** | 1280px @ 200% | No content loss; no horizontal scrollbar (**V8**); nav collapses to the drawer |
| **400% zoom** | 1280px @ 400% (= 320px reflow, WCAG 1.4.10) | **Content reflows to one column.** No horizontal scroll. Chrome must not pin content off-screen. **The header must not consume > 25% of viewport height** at this zoom — if it does, its height must be capped in `vh` |
| **Focus visible** | Every interactive element | `wood-500` 2px, offset 2px; **≥ 3:1** against *both* surfaces (V13); never suppressed |
| **Contrast** | Nav + logo over **every** cover | Nav **≥ 4.5:1**, logo **≥ 3:1**, measured on **composited pixels** (O2) — not against a flat colour |

> **Forced Colors Mode is the row most likely to be skipped and most likely to break.** The
> entire at-rest header depends on a scrim for legibility, and forced-colors **removes
> background images and gradients**. Without the `Canvas` fallback the nav becomes
> `CanvasText`-on-photograph — a total failure. This is specified, not discovered.

---

# Appendix C — Browser support matrix

## C.1 Supported

| Browser | Versions | Tier | Verification |
|---|---|---|---|
| **Chrome** | last 2 | **1** — full VR suite | Every gate |
| **Edge** | last 2 | **1** — full VR suite | Every gate |
| **Safari** | last 2 (desktop **+ iOS**) | **1** — full VR suite | Every gate. **iOS Safari is mandatory**, not optional — it is the primary mobile surface for this audience |
| **Firefox** | last 2 | **1** — full VR suite | Every gate |
| Samsung Internet | last 2 | **2** — manual smoke | Header states, drawer, no layout break |
| IE 11 / legacy Edge | — | **Unsupported** | Not tested. Not fixed |

## C.2 Feature support and mandated fallbacks

| Feature | Chrome | Edge | Safari | Firefox | Required fallback |
|---|---|---|---|---|---|
| `backdrop-filter` | ✅ | ✅ | ✅ (`-webkit-`) | ✅ 103+ | `@supports not (backdrop-filter: blur(1px))` → `--surface-chrome` at **α 0.98** (opaque). Never leave the glass translucent-without-blur — text over a moving photo at α 0.92 with no blur **fails contrast** |
| `color-mix()` | ✅ 111+ | ✅ | ✅ 16.2+ | ✅ 113+ | `@supports not` → discrete class-based colours at `p < 0.5` / `p ≥ 0.5` |
| `inert` | ✅ 102+ | ✅ | ✅ 15.5+ | ✅ 112+ | JS focus trap — **implemented regardless**, never relied on alone |
| `@property` | ✅ | ✅ | ✅ 16.4+ | ✅ 128+ | Without it, `--header-p` still works; it only loses the `inherits: false` optimisation (A.2). **Degrades in performance, never in correctness** |
| `dvh` | ✅ | ✅ | ✅ 15.4+ | ✅ | `vh` |
| `text-wrap: balance` | ✅ 114+ | ✅ | ✅ 17.5+ | ✅ 121+ | Progressive; already in use |
| `forced-colors` | ✅ | ✅ | ➖ | ✅ | See Appendix B |

## C.3 Accepted rendering differences — **not bugs**

| # | Difference | Consequence |
|---|---|---|
| C-1 | **Safari** composites backdrop blur with different saturation handling | Glass reads marginally warmer. **Accepted.** Do not "fix" by adding a second filter |
| C-2 | **Firefox** accelerates `backdrop-filter` less aggressively | Possible minor jank on low-end hardware during `VEIL`. Mitigated: blur is a **toggle**, never an animated radius; **zero** blur on the cover |
| C-3 | **Safari** sub-pixel text rendering | Nav tracking varies **±1px per link → ±7px over 7 links.** This is exactly why V11 mandates **≥ 8px** of slack, not zero |
| C-4 | **Safari** drops `backdrop-filter` on a `fixed` element inside a **transformed ancestor** | The header must **never** be nested under a transformed parent. **Asserted**, not trusted |
| C-5 | Font rasterisation differs across engines and OSes | VR baselines are **per-browser**. Cross-browser screenshot comparison is never performed |

---

# Appendix D — Implementation constraints

> **Everything below is out of scope and must not change.** A PR that touches any of it is
> rejected regardless of merit. If a constraint genuinely blocks the redesign, that is a
> **specification defect** — raise it; do not route around it.

## D.1 Frozen — must not change

| Domain | Frozen | Why |
|---|---|---|
| **Routing** | All 7 routes and their paths (`/`, `/du-an`, `/nha-xuong`, `/dich-vu`, `/gioi-thieu`, `/tuyen-dung`, `/lien-he`) + `/du-an/[slug]` | Live URLs; SEO equity |
| **Navigation structure** | The **7** nav links, their labels, their order | Explicitly out of scope. **An 8th link does not fit** (§6.4 / V11) — adding one is a design change requiring a new ADR |
| **Content** | All copy, VI and EN. All `data/*.ts` | Out of scope |
| **CTA copy** | `uiText.cta.*` verbatim — incl. "Nhận báo giá trong 24h" | Its **206px** width is a hard input to the header geometry (§6.4) |
| **SEO** | `useSeoMeta`, titles, descriptions, `ogImage`, `htmlAttrs.lang`, JSON-LD, `robots.txt`, `sitemap.xml`, `routeRules.prerender` | Any change is a separate PR with its own review |
| **Image URLs & asset names** | `public/logo.png`, `logo-white.png`, `logo_favicon.png` **stay, at their current paths** | **Brand-archive assets** — print, documents, favicon, social. They become unreferenced by the site; that is **intended, not dead code.** A cleanup PR deleting them is a regression |
| **Media pipeline** | `app/media/*`, `providers/supabase-media`, `scripts/media/*`, the catalog | Out of scope |
| **Hero images** | The 8 signature images and their ownership | Changing one requires the full `hero-art-direction.md` §3 pipeline |
| **Analytics / CMS** | None currently integrated | If added later, chrome must not become a dependency of it |
| **Public API** | `AppHero`'s props/slots (hero §17) | Consumed by all 8 pages |
| **i18n** | `useLanguage`, `LocalizedText`, VI + EN | Out of scope |
| **Favicon** | `logo_favicon.png` — the **colour** lockup | The adaptive-monochrome rule applies to the **site**, not to brand assets |

## D.2 Permitted to change

Exhaustive. Anything not on this list is frozen.

| Domain | Scope |
|---|---|
| `app/app.vue` | Reduced to a shell. **Plus: a `Skip to content` link and `<main id="main">`** — §33.6. This is **not** a content change; it is a **WCAG 2.4.1 Level-A** fix for a live failure (7 nav links repeated on every page, no bypass mechanism) |
| `AppHeader`, `AppFooter`, `AppDrawer`, `AppLangToggle`, `useHeaderState` | New |
| `AppLogo.vue` | **Deleted** — Nuxt UI starter residue |
| `app/assets/css/main.css` | Tokens, `.shell`, `.section-y`, `.nav-link` |
| `app/pages/**` | **Only**: `section-spacing` → `section-y` + `.shell`; `top-20` → `var(--header-h)`; `scroll-mt-36` → token. **No content, no copy, no structure** |
| `app/components/AppHero.vue` | **Only**: adopt `.shell` |
| `public/logo-mono-{white,ink}.png` | New, derived |
| `scripts/brand/derive-logos.ts` | New |
| `scripts/verify/*` | New — contrast, alignment, overflow gates |
| `docs/*-art-direction.md` | This spec |

## D.3 Requires a new ADR before implementation

- Adding or removing a nav link
- Changing CTA copy
- Adding a submenu (§5.6)
- Changing `--shell-measure` or `--shell-gutter`
- Introducing a second blur, a shadow, or a colour outside L0
- Any JS animation library in chrome (§8.3)
- Replacing a hero image

## D.4 No open design questions

**Implementation must not need to ask anything.** If a decision is required that this document
does not settle, **stop and raise a spec defect** — do not decide it in code. That is the
determinism rule (§0), and it is the whole point of this exercise.

---
---

# Part II — Implementation Contracts

Sections 1–28 and Appendices A–D define *what* is built and *why*. Part II defines *exactly how*,
to the value. **Nothing in Part II changes the design direction** — it removes the remaining
interpretation.

Where Part II and Part I state the same value, **Part II is the transcription target**: it is the
block an implementer copies. They must never diverge; §29 is the one to edit.

---

## 29. Design token contract

**This is the complete, normative token set.** Every value in `AppHeader`, `AppFooter`,
`AppDrawer`, `AppLangToggle` and the Home hero resolves to a name below. **A literal visual value
in a component is a build failure** (§25, §37).

```css
/* ═══════════════════════════════════════════════════════════════════
   L1 — SEMANTIC (global)                                 main.css :root
   ═══════════════════════════════════════════════════════════════════ */

/* ── Shell / rhythm ───────────────────────────────────────────────── */
--shell-measure:        80rem;      /* 1280px of CONTENT (ADR-001)     */
--shell-gutter:         1.5rem;     /*  24px   < md                    */
--shell-gutter-md:      2rem;       /*  32px   ≥ md                    */
--section-py:           5rem;       /*  80px   < md                    */
--section-py-md:        7rem;       /* 112px   ≥ md                    */

/* ── Breakpoints (reference; media queries use the literal) ───────── */
--bp-md:                48rem;      /*  768px                          */
--bp-xl:                80rem;      /* 1280px — the chrome breakpoint  */
                                    /* `lg` is NOT a chrome breakpoint */

/* ── Foreground on DARK ───────────────────────────────────────────── */
--fg-dark:              #fff;
--fg-dark-muted:        rgb(255 255 255 / 0.72);   /* 10.1:1 on ink-950 */
--fg-dark-subtle:       rgb(255 255 255 / 0.48);   /*  5.0:1 on ink-950 */
--rule-dark:            rgb(255 255 255 / 0.12);
--accent-dark:          var(--color-wood-300);     /*  7.8:1 on ink-950 */

/* ── Foreground on LIGHT ──────────────────────────────────────────── */
--fg-light:             var(--color-ink-950);
--fg-light-muted:       var(--color-ink-600);      /*  7.4:1 on white   */
--fg-light-subtle:      var(--color-ink-500);      /*  5.4:1 on white   */
--rule-light:           rgb(216 210 202 / 0.6);
--accent-light:         var(--color-wood-600);

/* ── Motion ───────────────────────────────────────────────────────── */
--ease-editorial:       cubic-bezier(0.22, 0.61, 0.36, 1);
--ease-exit:            cubic-bezier(0.4, 0, 1, 1);
--dur-hover:            240ms;
--dur-state:            400ms;
--dur-drawer:           300ms;
--dur-reveal:           700ms;

/* ── Radius / shadow ──────────────────────────────────────────────── */
--radius-pill:          9999px;
--radius-card:          1rem;
--shadow-drawer:        0 0 40px rgb(11 10 9 / 0.28);   /* the ONLY shadow in chrome */

/* ═══════════════════════════════════════════════════════════════════
   L2 — HEADER
   ═══════════════════════════════════════════════════════════════════ */

/* ── Geometry ─────────────────────────────────────────────────────── */
--header-h:             4.5rem;     /*  72px  < xl                     */
--header-h-xl:          5.5rem;     /*  88px  ≥ xl                     */
--header-scrim-h:       10rem;      /* 160px                           */
--logo-h-header:        2.5rem;     /*  40px OPTICAL (trimmed) < xl    */
--logo-h-header-xl:     3rem;       /*  48px OPTICAL (trimmed) ≥ xl    */
--logo-aspect:          2 / 1;      /* measured: 424 × 212             */
--nav-item-px:          1rem;
--nav-item-min-h:       2.75rem;    /*  44px — WCAG 2.5.5              */
--nav-item-gap:         0.25rem;
--nav-rule-h:           1.5px;
--header-group-gap:     2rem;       /* logo↔nav, nav↔actions           */
--header-action-gap:    1rem;

/* ── Surfaces ─────────────────────────────────────────────────────── */
--surface-chrome:       rgb(255 255 255 / 0.92);
--surface-chrome-blur:  16px;       /* the ONE blur radius             */
--header-border-a:      0.6;        /* hairline alpha at p = 1         */
--header-scrim-a1:      0.55;       /* scrim, top stop                 */
--header-scrim-a2:      0.18;       /* scrim, 45% stop                 */
--scrim-chrome: linear-gradient(
  to bottom,
  rgb(11 10 9 / var(--header-scrim-a1)),
  rgb(11 10 9 / var(--header-scrim-a2)) 45%,
  transparent
);

/* ── Thresholds (see §25.2 — each is derived, not chosen) ─────────── */
--header-blur-in:       0.05;       /* p at which backdrop-filter engages   */
--header-action-in:     0.5;        /* p at which CTA/phone become focusable */

/* ── Runtime — written by useHeaderState AND NOTHING ELSE ─────────── */
--header-p:             0;          /* 0 … 1                           */
--header-shift:         0px;        /* 0 | calc(-1 * var(--header-h))  */

/* ── Header typography ────────────────────────────────────────────── */
--type-nav-size:        0.8125rem;  --type-nav-weight:    600;
--type-nav-track:       0.12em;     --type-nav-leading:   1;
--type-lang-size:       0.75rem;    --type-lang-weight:   600;
--type-lang-track:      0.08em;
--type-meta-size:       0.8125rem;  --type-meta-weight:   600;
--type-meta-track:      0.02em;
--type-action-size:     0.875rem;   --type-action-weight: 700;
--type-action-track:    0.01em;

/* ═══════════════════════════════════════════════════════════════════
   L2 — DRAWER
   ═══════════════════════════════════════════════════════════════════ */
--drawer-w:             21rem;      /* 336px                           */
--drawer-w-max:         88vw;
--drawer-px:            1.5rem;
--drawer-item-py:       1.25rem;    /* → 44px+ target with line-height */
--drawer-overlay:       rgb(11 10 9 / 0.6);
--drawer-blur:          8px;
--type-drawer-nav-size:    1.5rem;
--type-drawer-nav-weight:  600;
--type-drawer-nav-track:  -0.01em;
--type-drawer-nav-leading: 1.3;

/* ═══════════════════════════════════════════════════════════════════
   L2 — FOOTER
   ═══════════════════════════════════════════════════════════════════ */
--footer-py:            7rem;       /* 112px  < md                     */
--footer-py-md:         9rem;       /* 144px  ≥ md                     */
--footer-masthead-gap:  4rem;
--footer-col-gap:       3rem;
--footer-meta-gap:      4rem;
--logo-h-footer:        3.5rem;     /*  56px OPTICAL  < md             */
--logo-h-footer-md:     4rem;       /*  64px OPTICAL  ≥ md             */
--footer-surface:       var(--color-ink-950);
--footer-top-gradient: linear-gradient(
  to bottom, var(--color-ink-900), var(--color-ink-950) 12.5rem
);
--type-eyebrow-size:    0.75rem;    --type-eyebrow-weight:  600;
--type-eyebrow-track:   0.22em;
--type-body-sm-size:    0.875rem;   --type-body-sm-leading: 1.7;
--type-meta-sm-size:    0.8125rem;  --type-meta-sm-leading: 1.6;

/* ═══════════════════════════════════════════════════════════════════
   L2 — PROJECT SUB-NAV (page-adjacent, but header-coupled)
   ═══════════════════════════════════════════════════════════════════ */
--subnav-h:             3.5rem;     /* 56px */
```

### 29.1 Consumption rules

| Rule | Detail |
|---|---|
| **R1** | Components consume **names**, never values. `padding-block: var(--footer-py)` — never `py-28` |
| **R2** | The **only** JS-written tokens are `--header-p` and `--header-shift`, and the **only** writer is `useHeaderState` |
| **R3** | Layout primitives that encode no visual value (`flex`, `grid`, `items-center`, `justify-between`) remain plain utilities |
| **R4** | A new value requires a **new token + a doc PR**. It may not be inlined "just this once" |
| **R5** | Optical logo sizes (`--logo-h-*`) describe the **trimmed** asset, never the `<img>` box. The box lies by 2.36× (V16) |

---

## 30. Component ownership

Extends **§26**. Adds the one component §26 did not cover — and it is the most likely to be
"tidied" into a bug.

### 30.1 The Home hero **stays bespoke**

`app/pages/index.vue` renders its hero **inline**, not via `AppHero`. This is **deliberate and
must not be changed.**

| | |
|---|---|
| **Decision** | The Home hero remains a bespoke section in `index.vue`. It is **not** absorbed into `AppHero` |
| **Why** | It is the **flagship cover** and carries a composition `AppHero` does not model: a stacked two-part headline (`text-hero` + a normal-case sub-headline), a tagline **and** a description (two body layers), and a full-width bottom-up scrim rather than a directional one. Forcing it into `AppHero` means either adding props that exist for exactly one page — bloating the API for all eight — or flattening Home into a template cover. **The homepage is the one page permitted to be singular.** |
| **Cost, accepted** | Two heroes to maintain, and every hero-wide change must be applied twice |

**The Home hero is bound by the same contracts as `AppHero`:**

| Contract | Applies |
|---|---|
| **I9** — renders a dark cover | ✅ **Mandatory.** The transparent header depends on it |
| `.shell` alignment rail (ADR-001, §4) | ✅ Mandatory — it moves with everything else |
| Rendering budget: **1 gradient, 0 blur** (§12) | ✅ Mandatory |
| Design tokens (§29) | ✅ Mandatory |
| Chrome contrast **G6** (nav ≥ 4.5:1, logo ≥ 3:1) | ✅ Mandatory — **and it is the LCP page** |
| Forbidden knowledge: `useHeaderState`, `--header-p`, `--header-shift` | ✅ Mandatory |
| `AppHero` props / `mode` / `atmosphere` derivation | ❌ Does not apply — it has no `mode` |

> **Every hero-wide change must be applied to `index.vue` too.** This is the standing trap: a
> contributor updates `AppHero`, verifies seven pages, and ships a broken homepage — the one page
> that matters most. **Home is verified separately in every gate** (§35, and DoD row 2).

### 30.2 Ownership summary

| Component | Owns | Never |
|---|---|---|
| `AppHeader` | Chrome markup, nav, actions, drawer trigger, applying `--header-p`/`--header-shift` | Computes scroll state; knows the route; knows what is behind it |
| `AppFooter` | Footer markup (§10). **Zero state** | Holds state; imports a composable; knows scroll |
| `AppHero` | Cover composition + **its own** scrim, for 7 pages | Reads chrome state; protects the nav |
| **Home hero** (`index.vue`) | The flagship cover + **its own** scrim | Reads chrome state; is absorbed into `AppHero` |
| `AppDrawer` | Modal, focus trap, scroll lock, overlay | Decides when it may open |
| `AppLangToggle` | VI/EN control | Owns locale; detects its own surface (**`surface` is a prop**) |
| `useHeaderState` | Scroll progress, direction, visibility, route hooks. **Sole writer of chrome tokens** | Touches DOM outside the header |

---

## 31. Motion specification

Every value. No adjectives.

### 31.1 Scroll-linked (chrome) — **no CSS transition**

> **Properties driven by `--header-p` MUST NOT carry a `transition`.** Scroll position *is* the
> timeline. A transition on top of it produces lag and rubber-banding — the header visibly
> "catching up" with the scroll. `transition-duration: 0ms` on all of the following.

| Element | Property | Value |
|---|---|---|
| Scrim layer | `opacity` | `calc(1 - var(--header-p))` |
| Glass layer | `opacity` | `var(--header-p)` |
| Logo — white | `opacity` | `calc(1 - var(--header-p))` |
| Logo — ink | `opacity` | `var(--header-p)` |
| Nav / logo colour | `color` | `color-mix(in oklab, var(--fg-dark-muted), var(--fg-light-muted) calc(var(--header-p) * 100%))` |
| CTA + phone | `opacity` | `clamp((var(--header-p) - 0.5) / 0.5, 0, 1)` |
| CTA + phone | `transform` | `translateY(calc((1 - <above>) * 4px))` · **`0` under reduced motion** |
| Blur | `backdrop-filter` | `blur(var(--surface-chrome-blur))` **iff** `p ≥ 0.05`, else `none`. **Discrete. Never interpolated** |
| Hairline | — | Lives **on** the glass layer; carried by its opacity. **Not a third animated value** |

### 31.2 State transitions — **CSS transitions**

| Motion | Property | From → To | Duration | Delay | Easing |
|---|---|---|---|---|---|
| Header hide | `transform` | `translateY(0)` → `translateY(calc(-1 * var(--header-h)))` | `--dur-state` | `0` | `--ease-editorial` |
| Header reveal | `transform` | reverse | `--dur-state` | `0` | `--ease-editorial` |
| Drawer enter | `transform` | `translateX(100%)` → `translateX(0)` | `--dur-drawer` | `0` | `--ease-editorial` |
| Drawer exit | `transform` | reverse | `--dur-drawer` | `0` | `--ease-exit` |
| Overlay enter/exit | `opacity` | `0` ↔ `1` | `--dur-drawer` | `0` | `linear` |
| Nav underline | `transform` on `::after` | `scaleX(0)` → `scaleX(1)`, origin `left` | `--dur-state` | `0` | `--ease-editorial` |
| Hover colour | `color` | idle → hover | `--dur-hover` | `0` | `--ease-editorial` |

**All delays in chrome are `0`.** Staggered delays belong to `v-reveal` (hero-owned) and nowhere
else.

> `.link-underline` currently hardcodes `0.4s cubic-bezier(0.22, 0.61, 0.36, 1)` — which is
> **exactly** `--dur-state` + `--ease-editorial`. It must be refactored to the tokens. That is a
> duplicated transition (§37 R1), and it is already in the codebase.

### 31.3 Interruption

| Scenario | Behaviour |
|---|---|
| Direction reverses mid hide/reveal | `--header-shift` is reassigned; the **CSS transition interpolates from the current computed value.** No snap, no queue |
| Drawer closed mid-open | Same — reverses from current position |
| Route change mid-anything | `.chrome-no-transition` → **all transitions cancel instantly**, state snaps (§7) |
| Scroll during a hide transition | The transform transition continues; `--header-p` keeps tracking scroll **independently.** They are separate properties and never queue |
| Reduced motion | `--header-shift` forced to `0`; `transition: none` |

**Mandatory:** hide/reveal uses **CSS transitions**, not the Web Animations API. CSS transitions
interrupt correctly from their current value for free. WAAPI with `fill` would require reconciling
animation state on every reversal — a class of bug we are declining to own.

**Never** `transition: all`. **Never** `!important`, except `.chrome-no-transition`.

---

## 32. Interaction states

Complete matrix. `focus-visible` is `2px solid var(--color-wood-500)`, `offset 2px`, on **every**
row — never suppressed, never restyled per element.

| Element | Idle | Hover | Focus-visible | Active (pressed) | Current | Disabled |
|---|---|---|---|---|---|---|
| **Logo** | mono, per `p` | *no change* | ring | `opacity: 0.9` | — | never |
| **Nav item** | `--fg-dark-muted` → `--fg-light-muted` | full fg + underline `0→100%` | ring | `opacity: 0.8` | full fg + **persistent `--nav-rule-h` rule** + `aria-current="page"` | never |
| **Lang toggle — inactive** | `--fg-*-subtle` | full fg | ring | `opacity: 0.8` | — | never |
| **Lang toggle — active** | full fg, weight `600`, `aria-pressed="true"` | *no change* | ring | `opacity: 0.8` | — | **never disabled** |
| **CTA — ghost** (`p < 0.5`) | `1px` border `--fg-dark` @ `0.4`, bg transparent, text `--fg-dark` | bg `rgb(255 255 255 / 0.12)` | ring | bg `rgb(255 255 255 / 0.18)` | — | never |
| **CTA — solid** (`p ≥ 0.5`) | bg `wood-500`, text `#fff` | bg `wood-600` | ring | bg `wood-700` | — | never |
| **Phone** | `--fg-*-muted` | full fg | ring | `opacity: 0.8` | — | never |
| **Drawer trigger** | full fg | `opacity: 0.8` | ring | `opacity: 0.7` | `aria-expanded` | never |
| **Drawer close** | `--fg-light-muted` | `--fg-light` | ring | `opacity: 0.7` | — | never |
| **Drawer nav item** | `--fg-light` | `--accent-light` | ring | `opacity: 0.8` | `--accent-light` + rule + `aria-current` | never |
| **Skip link** (§33.6) | visually hidden | — | **visible**, bg `--fg-light`, text `#fff` | — | — | never |

### 32.1 Two rules that are easy to get wrong

**No chrome control is ever `disabled`.** Not even the currently-active language. `disabled`
removes an element from the tab order and from most screen readers' output — so a VI-speaking
user on the VI locale would find the language control had *vanished*. The active option stays
focusable and carries `aria-pressed="true"`. **If a disabled control is ever genuinely needed, it
uses `aria-disabled="true"` and remains focusable.**

**Hover is never the only signal.** Every hover state has a non-hover equivalent (colour + rule +
`aria-current`), because ~all touch users and all keyboard users never see it.

### 32.2 Reduced motion

| Element | Change |
|---|---|
| Header hide/reveal | **Disabled** — permanently `REVEALED` (I6) |
| CTA / phone entrance | `opacity` only; `translateY` forced to `0` |
| Drawer | `transform` `none`; `opacity` fade at `--dur-hover` |
| Nav underline | Retained — a 400ms `scaleX` on a 1.5px rule is not vestibular motion |
| Scroll-linked chrome | **Retained.** It is direct manipulation, not animation. Removing it leaves white-on-white text |

---

## 33. Mobile system

### 33.1 Drawer geometry

```css
width: min(var(--drawer-w), var(--drawer-w-max));   /* min(336px, 88vw) */
```

### 33.2 Safe-area handling

```css
.app-header  { padding-left:  env(safe-area-inset-left);
               padding-right: env(safe-area-inset-right); }

.app-drawer  { padding-right:  env(safe-area-inset-right);
               padding-bottom: env(safe-area-inset-bottom); }

.app-footer  { padding-bottom: max(var(--footer-py), env(safe-area-inset-bottom)); }
```

The drawer's **bottom** inset is the one that matters: the phone + CTA live at its foot, and on a
notched iPhone they would otherwise sit under the home indicator — **the two most conversion-
critical controls on mobile.**

### 33.3 Body scroll lock — the iOS-safe method

**`overflow: hidden` on `<body>` does not reliably lock scroll in iOS Safari.** The mandated
implementation:

```
on open:   scrollY = window.scrollY
           body { position: fixed; top: -scrollY px; left: 0; right: 0; overflow: hidden }
on close:  body { — all cleared — }
           window.scrollTo(0, scrollY)          // restore, non-smooth
```

| Rule | |
|---|---|
| The saved `scrollY` is restored **exactly**, with instant (non-smooth) scroll | |
| `useHeaderState` **pauses** while the drawer is open — `p` and `--header-shift` are **frozen** (I4). The `position: fixed` body would otherwise report `scrollY: 0` and drive the header to `COVER` **behind the open drawer** | |
| The header is `position: fixed` and therefore **unaffected** by the body becoming fixed | |

> This is a **modal scroll lock**, not scroll-jacking (§6.5). The distinction is consent: the user
> opened a modal. Natural scrolling is restored, to the same pixel, on close.

### 33.4 Overscroll

```css
.app-drawer { overscroll-behavior: contain; }   /* no scroll chaining to the page */
```

`overscroll-behavior` is **never** set on `html`/`body` — that would kill pull-to-refresh site-wide.

### 33.5 Touch targets

| Control | Minimum |
|---|---|
| Drawer trigger | **44 × 44px** |
| Drawer close | **44 × 44px** |
| Drawer nav item | full width × **≥ 48px** |
| Lang toggle option | **44 × 44px** |
| Header nav item | `--nav-item-min-h` (44px) |
| Spacing between adjacent targets | **≥ 8px** |

### 33.6 Keyboard & focus — including the missing skip link

| Behaviour | Spec |
|---|---|
| **Skip link** | **`Skip to content` is REQUIRED.** WCAG **2.4.1 Bypass Blocks is Level A**, and the site repeats **7 nav links** on every page with **no bypass mechanism today** — a live Level-A failure. First focusable element in the DOM; visually hidden until focused; targets `<main id="main">` |
| Drawer open | Focus moves to the **close button** |
| Drawer trap | `Tab`/`Shift+Tab` cycle **within** the panel. The rest of the page is `inert` |
| `Esc` | Closes the drawer, from anywhere within it |
| Drawer close | Focus returns to the **trigger** — always |
| Route change | Drawer closes; focus resets to document start |
| No inputs in the drawer | Virtual-keyboard handling is **N/A**. If an input is ever added, `visualViewport` resizing must be specified first |

### 33.7 iOS / Safari — the four that bite

| # | Issue | Mandated handling |
|---|---|---|
| **M1** | **The address bar collapsing on scroll fires `resize`.** Recomputing `P_END` from the new `innerHeight` mid-scroll would **make the header jump** | **`P_END` is computed on `mount` and on `orientationchange` only — never on `resize`.** This is not an optimisation; it is a correctness requirement |
| **M2** | **Rubber-band overscroll makes `scrollY` negative** | `p = clamp(scrollY / P_END, 0, 1)` — the clamp is **load-bearing**, not defensive |
| **M3** | **Momentum scroll fires events after `touchend`,** including the bounce-back at the top | Direction thresholds (64px hide / 4px reveal) plus **accumulator reset on direction change** absorb it. A naive "any upward delta" reveal would fire on every bounce |
| **M4** | **Safari drops `backdrop-filter` on a `fixed` element inside a transformed ancestor** (C-4) | The header must **never** be nested under a transformed parent. Asserted, not trusted |

Plus: `dvh` (not `vh`) for the cover — already in use.

---

## 34. Hydration & loading contract

> **There must never be a flash of the wrong header state.** Not on first paint, not during
> hydration, not on route change.

### 34.1 The three phases

| Phase | Header state | Mechanism |
|---|---|---|
| **SSR / first paint** | `COVER` — transparent, mono-white logo, no blur | CSS default is `--header-p: 0`. This is **correct for any page loaded at the top**, which is effectively every entry |
| **Pre-hydration, restored scroll** | `NAVIGATION` (static) | A **blocking inline script in `<head>`** (§34.2) |
| **Hydrating** | Frozen; **no transitions** | `.chrome-no-transition` present until the first rAF after mount |
| **Hydrated** | Live | `useHeaderState` runs its first measurement **synchronously in `onMounted`**, then removes `.chrome-no-transition` on the next rAF |

### 34.2 The pre-hydration guard

A reload with browser-restored mid-page scroll would otherwise paint a **transparent header with a
dark scrim over white content** for one frame — white-on-white nav.

```html
<!-- <head>, blocking, ~150 bytes -->
<script>document.documentElement.dataset.chrome=scrollY>0?'nav':'cover'</script>
```

```css
:root[data-chrome="nav"] .app-header { /* static NAVIGATION — no transition */ }
```

`useHeaderState` **removes `data-chrome` on mount** and takes over via `--header-p`.

> Why an attribute and not the custom property directly: `--header-p` is declared
> `@property { inherits: false }` on the header element (A.2) so writes cannot invalidate the
> document. Setting it on `:root` pre-hydration would defeat that. **An attribute costs one class
> match and zero inheritance.**

### 34.3 No-JS

Header stays `COVER` permanently. Correct at the top of the page; degraded (but legible — the
scrim holds) further down. **All content remains visible** — `.reveal` defaults to visible without
`reveal-ready`, which is already true today and must not regress (**FG-13**).

---

## 35. Image loading contract

| Asset | `loading` | `fetchpriority` | `<link rel=preload>` | Rationale |
|---|---|---|---|---|
| **Hero image** (above fold, incl. Home) | `eager` | **`high`** | **No** | LCP. A preload link **double-fetches** against `NuxtImg` — hero doc §11 |
| **Header logo — mono-white** | `eager` | **`high`** | No | In the LCP viewport. ≤ 8KB. It must **never** pop in after the cover |
| **Header logo — mono-ink** | `eager` | `low` | No | `opacity: 0` but must be decoded **before** the user scrolls, or the cross-fade flashes an empty box |
| **Drawer logo** | — | — | — | **Reuses `mono-ink`** — same URL, already cached. Zero extra request |
| **Footer logo** | `lazy` | `auto` | No | Below fold, always |
| **Below-fold hero** (`eager: false`) | `lazy` | `auto` | No | Existing `AppHero` prop |
| **Section / decorative images** | `lazy` | `auto` | No | |

**Rules.**

1. **Both header logos carry explicit `width`/`height`** (aspect `--logo-aspect`). Without them the
   nav row twitches on load → **FG-15**, and chrome CLS ceases to be 0 by construction.
2. **Zero new network requests** from chrome (A.7). The drawer logo reusing `mono-ink` is what
   makes this true.
3. **No `<link rel=preload>` anywhere in chrome.** `fetchpriority` on the element is sufficient and
   cannot double-fetch.

---

## 36. Layer contract (site-wide z-index)

**The complete hierarchy. No `z-index` may exist outside this table.**

| Token | Value | Layer | Current | Change |
|---|---|---|---|---|
| `--z-base` | `0` | Page content | — | — |
| `--z-hero-content` | `10` | Hero copy above its scrim | `z-10` | — |
| `--z-subnav` | `30` | Project-detail sticky sub-nav | `z-30` | — |
| `--z-header` | `50` | `AppHeader` | `z-50` | — |
| `--z-drawer-overlay` | `60` | Drawer scrim | **`z-50`** | ⚠️ **raised** |
| `--z-drawer` | `61` | Drawer panel | **`z-50`** | ⚠️ **raised** |
| `--z-lightbox` | `80` | `GalleryLightbox` | `z-80` | — |
| `--z-skiplink` | `90` | Skip link (on focus) | *(none)* | ✅ **new** |

> **The drawer, its overlay and the header are all `z-50` today.** They stack correctly **only by
> DOM order** — a coincidence, not a contract. Any reorder of `app.vue` silently puts the header
> **on top of the open drawer**. Raising the drawer to `60/61` makes the stack explicit.

Raw `z-*` utilities are **forbidden** in chrome (§37).

---

## 37. CSS architecture rules

| # | Rule | Enforcement |
|---|---|---|
| **R1** | **No duplicated transitions.** One definition per property per component. `--dur-*` + `--ease-*` only | `.link-underline`'s hardcoded `0.4s cubic-bezier(…)` **is an existing violation** — it must be refactored to `--dur-state` + `--ease-editorial` (§31.2) |
| **R2** | **No duplicated colours.** Every colour resolves to L0 → L1/L2. **No literal hex, `rgb()`, or `/opacity` in a component** | This is how six ad-hoc white opacities accumulated. Lint + **V7** (ΔE₀₀ ≤ 1.0) |
| **R3** | **No inline visual values.** No `style="…"` carrying a visual value. The **sole** exception: `--header-p` / `--header-shift`, set via `setProperty` by `useHeaderState` — and those are tokens | Lint |
| **R4** | **Everything derives from tokens** (§29) | Build failure |
| **R5** | **No `transition: all`** | Lint |
| **R6** | **No `!important`** — sole exception `.chrome-no-transition` | Lint |
| **R7** | **No raw `z-*`** in chrome. §36 tokens only | Lint |
| **R8** | **No `filter:`** in chrome — it creates a containing block and **breaks Safari's `backdrop-filter`** (ADR-004 alt 3) | Lint |
| **R9** | `@apply` only inside `main.css`'s component layer, never in an SFC `<style>` | Review |
| **R10** | **One blur radius exists** (`--surface-chrome-blur`). A second blur value implies a second blur — see §12 | Review |

---

## 38. Testing matrix

### 38.1 Browsers × breakpoints

| | 390px | 768px | 1280px | 1440px |
|---|---|---|---|---|
| **Chrome** | ✅ | ✅ | ✅ | ✅ |
| **Edge** | ✅ | ✅ | ✅ | ✅ |
| **Safari** (desktop) | — | ✅ | ✅ | ✅ |
| **Safari** (**iOS, real device**) | ✅ | ✅ | — | — |
| **Firefox** | ✅ | ✅ | ✅ | ✅ |

**1280px is mandatory, not a rounding of 1440.** It is the exact width at which the nav row has
~10px of slack and Safari's tracking variance is ±7px (**V11**, **O3**).

### 38.2 Interaction tests

| # | Test | Pages |
|---|---|---|
| T1 | Scroll `0 → P_END` slowly: `p` takes **≥ 1** intermediate value; no snap (**FG-04**) | all 8 |
| T2 | Scroll down 64px in content zone → header hides; scroll up 4px → reveals | all 8 |
| T3 | Scroll down **on the cover** → header **never** hides (**I1**, FG-07) | all 8 |
| T4 | Focus a nav item, then scroll down → header **stays** (**I2**, FG-08) | all 8 |
| T5 | Hover the header, scroll down → header stays (**I3**) | desktop |
| T6 | Route change from mid-page → **no flash, no melt** (**FG-05/06**) | all pairs |
| T7 | Back/forward with `savedPosition` → lands in `NAVIGATION` instantly | all 8 |
| T8 | Drawer: open → trap → `Esc` → focus returns to trigger | all 8 |
| T9 | Drawer: open, scroll → **body does not move**; close → **exact** scroll restored | iOS + Android |
| T10 | Drawer open while scrolled → header does **not** flip to `COVER` behind it (I4, §33.3) | mobile |
| T11 | Footer ≥ 50% visible → header hides; scroll up → reveals | all 8 |
| T12 | Drawer open → **≤ 1 blur on screen** (**FG-12**, V14) | mobile |
| T13 | iOS: rubber-band to negative `scrollY` → `p` clamps to `0` (**M2**) | iOS |
| T14 | iOS: address bar collapse → header does **not** jump (**M1**) | iOS |

### 38.3 Accessibility tests

| # | Test | Standard |
|---|---|---|
| A1 | **Skip link** is the first focusable element and reaches `<main>` | **2.4.1 (Level A)** |
| A2 | Nav + logo contrast on **composited pixels**, all 8 covers × 3 viewports (**O2**) | 1.4.3 / 1.4.11 |
| A3 | Active nav announced via `aria-current` — **not colour alone** | 1.4.1 |
| A4 | CTA/phone **not focusable and not announced** at `p < 0.5` (**I8**) | 2.4.3 |
| A5 | Drawer: `role="dialog"`, `aria-modal`, trap, `Esc`, focus return, page `inert` | 4.1.2 |
| A6 | Lang toggle: `role="group"` + `aria-pressed`; **active option not `disabled`** (§32.1) | 4.1.2 |
| A7 | Every chrome target **≥ 44×44px** | 2.5.5 |
| A8 | Focus ring **≥ 3:1** on **both** surfaces | 2.4.11 |
| A9 | **Forced Colors Mode**: header falls back to `Canvas` / `CanvasText`, blur `none` (App. B) | 1.4.1 |
| A10 | **400% zoom** (320px reflow): one column, no h-scroll, header **≤ 25%** of viewport height | 1.4.10 |
| A11 | Reduced motion: header never hides; all content visible | 2.3.3 |
| A12 | Screen reader: NVDA+Firefox, VoiceOver+Safari | — |

### 38.4 Required per phase

| Phase | Gates |
|---|---|
| 1 · Extraction | VR **byte-identical** |
| 2 · Assets | Asset size, visual, aspect `2:1` |
| 3 · Tokens + shell | **Alignment matrix (V1/V2) at 5 viewports**, VR byte-identical on the refactor sub-commit |
| 4 · Header | T1–T7, T13–T14, A2–A4, A8–A9, **O2 + O3** |
| 5 · Drawer | T8–T10, T12, A1, A5–A7 |
| 6 · Footer | V7, V16 |
| 7 · Verification | **Everything**, 4 browsers |

---

## 39. Rollback — deployability & reviewability

Extends **§28** (phase revert matrix, `one commit = one responsibility`, kill switch). Two
additional binding criteria:

### 39.1 Every phase leaves production deployable

| Phase | If we stopped here, is `main` shippable? | Resulting product |
|---|---|---|
| 1 | ✅ | Identical to today, better organised |
| 2 | ✅ | Identical — **assets are unreferenced and inert** |
| 3 | ✅ | Today's chrome, **correctly aligned** — a genuine improvement, shippable alone |
| 4 | ✅ | New header on the new shell; old footer. **Coherent** |
| 5 | ✅ | + accessible drawer |
| 6 | ✅ | Complete |

**No phase depends on a later phase to be correct.** Phase 3 in particular is valuable *on its
own* — it fixes a real 24px alignment defect regardless of whether the chrome redesign ever ships.

### 39.2 Every phase is independently reviewable

| Criterion | Requirement |
|---|---|
| **Diff size** | A phase that cannot be reviewed in one sitting is split |
| **One kind per commit** | Refactor · design · behaviour — **never mixed** (§28.1) |
| **Screenshot expectation stated up front** | The PR **declares** what should change. A refactor claiming byte-identical output that produces diffs is **reverted, not debugged** — the claim was false, and everything else in it is now unreviewed |
| **Gates named** | The PR lists which §38.4 gates it must pass |
| **Doc delta first** | §17 rule 1 — the doc commit **precedes** the code commit |

> **Phase 3 is split internally** into a refactor sub-commit (byte-identical) and a design
> sub-commit (chrome + hero converge). The refactor half **proves the shell is correct before the
> design half moves anything.** Any pixel movement in Phase 3 that is not **+8px** (768–1280),
> **−24px** (≥1440), or **0px** (mobile) is a bug — those three numbers are the entire acceptance
> criterion.

---

## 40. Animation geometry constraint

> **Animation may never change layout geometry.** Only `opacity`, `color`, `transform` and
> `backdrop-filter`/`filter` (blur) may animate. Everything else is forbidden — **site-wide**, not
> only in chrome.

### 40.1 The allowlist

| May animate | Cost class | Notes |
|---|---|---|
| `opacity` | compositor | |
| `transform` | compositor | `translate`, `scale`, `rotate` |
| `color` (incl. `color-mix()`) | paint | Bounded to the element |
| `backdrop-filter` / `filter` blur | — | **Toggled, never interpolated** (§8.2). Stricter than the allowlist |

### 40.2 The banlist — **any of these in a `transition` or `@keyframes` is a build failure**

`width` · `height` · `top` · `right` · `bottom` · `left` · `inset` · `margin*` · `padding*` ·
`border-width` · `font-size` · `line-height` · `letter-spacing` · `gap` · `flex-basis` ·
`grid-template-*` · `min/max-*` · `background-size` · `transition: all`

### 40.3 This rule caught a violation in this very specification

**§31.2 had the nav underline animating `background-size`** (`0% 1.5px → 100% 1.5px`), inherited
from the existing `.link-underline`. `background-size` is **not on the allowlist** — it is a paint
property, not a compositor one, and it is banned.

**Corrected mechanic — same appearance, strictly better:**

```css
.nav-link::after {
  content: "";
  position: absolute;
  inset-block-end: 0; inset-inline: 0;
  block-size: var(--nav-rule-h);
  background: currentcolor;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform var(--dur-state) var(--ease-editorial);
}
.nav-link:hover::after,
.nav-link[aria-current="page"]::after { transform: scaleX(1); }
```

Identical visual result — a 1.5px rule growing left-to-right — but `transform: scaleX()` is
**compositor-only**, so it is *cheaper* than the mechanic it replaces as well as compliant.

> ### `.link-underline` survives, for body copy only — and this is not duplication
>
> Inline body links **wrap across lines**. A `::after` pseudo-element only covers the **first**
> line box, so `scaleX` would underline a wrapped link incorrectly. `background-size` handles
> wrapping natively. So:
>
> | Context | Mechanic | Why |
> |---|---|---|
> | **Chrome nav** (never wraps — **V10** asserts line-count = 1) | `transform: scaleX()` | Compositor-only; compliant |
> | **Body inline links** (may wrap) | `background-size` — **documented exception** | Paint-only, **changes no layout geometry**, and correctness requires it |
>
> Two mechanics, one justification each. **R1 (no duplicated transitions) holds** — they share
> `--dur-state` and `--ease-editorial`.

### 40.4 Consequence

**Chrome CLS = 0.000 is now true by construction, not by care.** No animated property in chrome
can move a box: the header is `fixed`, hide/reveal is `transform`, and every other animated value
is `opacity`, `color`, or a toggled blur. A non-zero chrome CLS therefore has exactly **one**
possible cause — the logo `<img>` missing explicit dimensions (**FG-15**).

---

## 41. Snapshot approval workflow

> **Playwright screenshots are approval artefacts, not diagnostics.** An unexpected visual
> regression **fails CI** and stays failed until a human explicitly approves it.

### 41.1 Rules

| # | Rule |
|---|---|
| **P1** | Baselines are **committed to the repo**, per browser (§14) |
| **P2** | CI runs **without** `--update-snapshots`. **CI may never regenerate a baseline.** Ever |
| **P3** | Any diff above the §14 / §14.1 tolerance **fails the job** |
| **P4** | Diff images (`expected`, `actual`, `diff`) are uploaded as CI artefacts on failure |
| **P5** | Approval = a human runs `pnpm test:vr:approve` locally and **commits the new baselines** |
| **P6** | **A baseline-update commit may contain nothing else.** No code, no docs. It is reviewable *because* it is only images |
| **P7** | The PR that approves new baselines **must state which design change explains each diff**, and must carry the §17 doc delta |
| **P8** | "The test is flaky" is **not** an approval reason. Flake is fixed by determinism (fonts ready, images decoded, `animations: 'disabled'`), never by regenerating |

```jsonc
// package.json
"test:vr":         "playwright test --project=vr",              // CI. compares only
"test:vr:approve": "playwright test --project=vr --update-snapshots"  // human only. NEVER in CI
```

### 41.2 Phase 1 and Phase 3 are the tests of this system

Both declare **byte-identical** output. If either produces a diff, the correct response is **revert,
not approve** — the commit's claim was false, and approving the baseline would silently bless an
unreviewed change (§28.1, §39.2).

---

## 42. Web Vitals acceptance criteria

> **A measurable regression in LCP, CLS or INP rejects the change.** Not "is investigated" —
> **rejects.**

### 42.1 Thresholds

> ### Corrected in Phase 0 — the absolute LCP ceiling was a spec contradiction
>
> The original §42 made **LCP ≤ 2.5s** a *merge gate*. The Phase 0 baseline measured
> **5.2s – 7.4s across all 8 pages** — so every page failed the gate **before a line of code was
> written**.
>
> This is not something the chrome redesign caused, and not something it can fix. The LCP is
> dominated by the simulated-network critical path and 4× CPU throttle, **not** image weight
> (total image payload is only **276KB**; the largest single image is **91KB**). Reaching 2.5s
> requires work on the **bundle, fonts, and media pipeline** — every one of which **Appendix D
> explicitly freezes as out of scope**.
>
> **Two rules in this document could not both be satisfied.** §42 demanded an outcome that
> Appendix D forbade the means to achieve. Enforcing it would have made the redesign permanently
> unmergeable for a pre-existing, unrelated defect.
>
> **Resolution:** absolute ceilings become **tracked site goals** (§42.4). The **binding merge
> gate is regression only** — which is precisely what this redesign controls.

**Binding merge gates** — a breach **rejects** the change:

| Metric | Regression gate |
|---|---|
| **LCP** | Median increase **> 100ms** *or* **> 2%** vs. baseline (whichever is larger) → **reject** |
| **CLS — chrome** | Any non-zero value → **reject** (§40.4 makes it impossible by construction; a non-zero result is a bug, never a tolerance) |
| **CLS — page** | Increase **> 0.005** vs. baseline → **reject** |
| **TBT** | Any increase → **reject** |
| **INP** | Median increase **> 20ms** → **reject**. Not measurable in a Lighthouse cold load; gated by the **interaction suite** (§38.2). **TBT is the lab proxy tracked here** |

**Site goals** — tracked, reported, **not** merge gates for this redesign:

| Metric | Goal | Phase 0 baseline | Status |
|---|---|---|---|
| LCP | ≤ 2.5s | **5.2 – 7.4s** | ❌ **Pre-existing failure.** Own workstream (§42.4) |
| CLS (page) | ≤ 0.02 | **0.000** all pages | ✅ Already met |
| Lighthouse Perf | ≥ 90 | **59 – 68** | ❌ Pre-existing |

### 42.2 Method — so "regression" is not arguable

| | |
|---|---|
| **Runs** | **5 per page**, compare **medians** (not means — one slow run must not decide a merge) |
| **Environment** | Lighthouse CI, mobile preset, **4× CPU throttle**, identical between baseline and candidate |
| **Pages** | **All 8.** `/` is mandatory — it is the LCP page **and** the bespoke Home hero (§30.1) |
| **Baseline** | Captured in **Phase 0**, committed, re-used unchanged for every phase |
| **INP interactions** | Drawer open/close, nav activation, language toggle |

### 42.3 Expectations

The redesign should **improve** LCP, not merely hold it: today's header paints a `backdrop-blur`
on the LCP frame, and the redesign removes it entirely from the cover (§12, A.4).

**Phase 0 sharpened this.** `logo-white.png` is **69KB — the second-largest asset on the
homepage**, and it loads on the LCP frame. ADR-004's mono logos (**≤ 8KB each**) remove roughly
**61KB from exactly the wrong place**. That, plus dropping the LCP-frame blur, is the redesign's
whole performance thesis.

**If LCP does not improve, that is itself a signal worth investigating** — it means neither the
blur nor the logo was the cost, and something in §42.4 is.

### 42.4 Pre-existing performance defect — **tracked, out of scope**

Phase 0 recorded **LCP 5.2 – 7.4s** and **Lighthouse Perf 59 – 68** across all 8 pages, against
goals of ≤ 2.5s and ≥ 90.

**This is not a chrome defect and this redesign does not fix it.** The evidence:

| | |
|---|---|
| Total image payload (home) | **276KB** — not the bottleneck |
| Largest single image | **91KB** |
| CLS | **0.000** — already perfect |
| TBT | **23 – 111ms** — already fine |

The cost is the **critical path**: JS bundle execution under 4× CPU throttle, three font files,
and simulated-network RTT. Fixing it means touching the **bundle, the font strategy, and the
media pipeline** — all frozen by **Appendix D**.

**It gets its own ADR and its own workstream.** It must not be silently absorbed into this
redesign, and it must not block it. Recorded here so it is not lost.
```
