# Theme and styling source

Tailwind CSS 4, Nuxt UI, and project tokens in `main.css` form the authoritative styling system. `layers.css` must remain before `main.css` in Nuxt configuration.

## app/assets/css/layers.css

```css
/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   CASCADE LAYER ORDER â€” pinned, not inferred.
   â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   This file exists for ONE statement, and it is loaded before main.css so that
   the statement precedes Tailwind's own layer blocks. It cannot live in
   main.css: Tailwind v4 strips a bare `@layer` statement placed before its
   `@import`, and a statement placed AFTER the import is too late â€” the import
   has already expanded into `@layer theme{â€¦} @layer base{â€¦}`, so first-
   appearance ordering is settled before the statement is read.

   WHY IT IS NEEDED â€” the defect it fixes:

   CSS orders layers by FIRST DECLARATION. `@nuxt/icon` renders each icon's CSS
   into a `<style>` and deliberately PREPENDS it before the first stylesheet
   (runtime/components/css.js: `document.head.insertBefore(style, firstStyle)`)
   so icon rules stay low-priority. `@nuxt/ui` configures that CSS to be wrapped
   in `@layer components` (its module.mjs: `icon: { cssLayer: 'components' }`).

   The two combine badly: the prepended sheet declares `components` FIRST, so the
   document order became

       components â†’ theme â†’ properties â†’ base â†’ utilities        (measured)

   i.e. Tailwind's preflight (`@layer base`) outranked every component class.
   The damage only appeared once an icon was injected CLIENT-side â€” opening the
   mobile drawer mounts `i-lucide:x`, which prepends a sheet and re-orders the
   cascade mid-session. From that moment:

       img { height: auto }     beat  .app-drawer-logo { height: â€¦ }  â†’ 168px logo
       *   { padding: 0 }       beat  .drawer-link { padding-block: â€¦ }
       *   { border: 0 }        beat  .drawer-link { border-bottom: â€¦ }
       a   { color: inherit }   beat  every chrome colour rule

   â€” the drawer rendered unstyled, and the footer's links turned white the moment
   the drawer opened.

   THE FIX: `icon.cssLayer` is set to `icons` (nuxt.config.ts) so the prepended
   sheet no longer claims `components`, and this statement pins the full order.
   `icons` is declared FIRST â€” i.e. lowest priority â€” which is exactly the
   precedence @nuxt/icon prepends to achieve, so Tailwind's `h-6 w-6` utilities
   still size icons.

   The statement makes the order deterministic REGARDLESS of where the icon sheet
   lands: prepended (client-mounted icons) or appended (SSR icons, which use
   useHead with tagPriority 'low'). Both orders occur on the same page today.

   docs/header-footer-art-direction.md Â§37 (CSS architecture) â€” the layer order is
   now a declared contract rather than an emergent property of injection timing.

   `properties` is included because Tailwind emits it first (it holds the
   @property polyfill's `*{--tw-*: initial}` fallbacks). Omitting it here would
   let it first-appear AFTER `utilities` and become the HIGHEST layer, so on a
   browser without @property support `*{--tw-translate-x:0}` would outrank
   `.translate-x-4`. This statement reproduces Tailwind's own order exactly and
   only adds `icons` beneath it.
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
@layer icons, properties, theme, base, components, utilities;
```

## app/assets/css/main.css

```css
@import "tailwindcss";
@import "@nuxt/ui";

:root {
  --font-sans: "Inter", "Segoe UI", sans-serif;
  --color-wood: #6f4f37;
  --color-warm: #b8875a;
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   DESIGN TOKEN CONTRACT â€” docs/header-footer-art-direction.md Â§29
   â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   Phase 3A (refactor) DECLARES this set. Only the shell/rhythm tokens are
   consumed today, by `.shell` and `.section-y` below â€” and their values are
   transcribed to match what the body already renders, so adopting them moves
   nothing (ADR-001: "Body sections move 0px at every viewport").

   The rest are declared and deliberately UNCONSUMED. They are the contract the
   later phases transcribe against: chrome + hero converge onto the rail in
   Phase 3B, the header state machine in Phase 4, the drawer in Phase 5, the
   footer in Phase 6. Declaring a token renders nothing; a token is not a
   dependency (Â§2).

   Tokens flow downward only: L0 (@theme primitives) â†’ L1 â†’ L2. No component
   may invent a colour; new colours enter at L0 via a doc PR (Â§22.1).
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */

:root {
  /* â”€â”€ L1 Â· Shell / rhythm â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
     The alignment rail (ADR-001). --shell-measure is CONTENT width, not box
     width: the gutter is added to the max-width rather than subtracted from
     the measure, so changing one knob never silently changes the other. That
     coupling is exactly why ADR-001 rejected Option B. */
  --shell-measure: 80rem; /* 1280px of CONTENT                        */
  --shell-gutter: 1.5rem; /*   24px  < md  â€” matches today's px-6     */
  --shell-gutter-md: 2rem; /*   32px  â‰¥ md  â€” matches today's md:px-8  */
  /* Body vertical rhythm. `padding-block`, so the SPACE BETWEEN two sections is twice
     these numbers â€” that doubling is the thing to keep in mind when reading them, and it
     is what made the old 112px feel like a gap rather than a breath: 224px between every
     pair of sections, six times down the homepage, is ~1.75 laptop viewports of nothing.

     80/112 -> 64/88 (boundary 160/224 -> 128/176). Deliberately still generous: this is a
     premium architecture site, and the fix for "too far apart" is not "tight". 88px reads
     as composed; 112px read as unfinished. Below md the cut is proportionally larger
     because mobile pays the boundary cost most often â€” the homepage crosses six of them.

     One token, site-wide, on purpose: a homepage with a different rhythm from /du-an would
     re-create exactly the two-system divergence ADR-001 and the single `.shell` exist to
     prevent (Â§26.7). Every page moves together or the rhythm is not a system. */
  --section-py: 4rem; /*   64px  < md                             */
  --section-py-md: 5.5rem; /*   88px  â‰¥ md                             */

  /* THE hero floor â€” one token for the homepage AND every <AppHero> page, so the photograph is
     the same height everywhere. Home is the standard: it is a bespoke cover (Â§30.1, it inlines
     its own hero), and the shared AppHero component now adopts this same token as both min-h and
     max-h. NOT decorative â€” this is what keeps the hero's crop locale-INDEPENDENT, and it is a
     MEASURED value.

     A cover hero is `min-height` + an `absolute inset-0 h-full object-cover` photograph, so the
     image's box height is slaved to the CONTENT height, and content height is locale-dependent
     (the EN homepage headline wraps to 3 lines where VI takes 2, +79.8px). Left on 100dvh,
     switching language silently upscaled the photo â€” cover scale = max(boxW/naturalW,
     boxH/naturalH), so while the image is height-constrained any content-driven height change
     rescales it. A floor no locale's content can reach makes box height constant, so it cannot.

     Tiered, measured against home content (floor neutralised, Chromium, both locales), + headroom:
       < 360px   909.9px  (320, en)   -> 59rem = 944px
       360-767   805.1px  (414, en)   -> 52rem = 832px
       >= 768    709.4px  (1280, en)  -> 46rem = 736px
     The old single token took the worst case across ALL widths (narrow-and-EN, 320px), so every
     desktop inherited a floor derived from a phone; tiering lets desktop drop 224px without
     weakening the guarantee. The svh term drops to 78svh at md+ (from 100svh) so the next section
     clears the fold on laptops; below md it stays 100svh (a phone hero shorter than the screen
     reads as broken).

     AppHero bottom-anchors its copy in this same box (like home), so the block ends at the same
     baseline on every page. The floor only has to clear the tallest hero copy anywhere; home's
     copy is that tallest case (which is why the floor is measured against it), and every AppHero
     page's copy is shorter and fits with room above.

     svh, not vh/dvh: dvh re-triggers the growth every time a mobile URL bar collapses. Re-measure
     if hero copy, --text-hero, or the hero padding changes; the homepage metrics band must stay
     OUTSIDE the hero (index.vue) or these numbers are void. tests/e2e/hero.spec.ts G1/G2 enforce
     both halves. */
  --hero-min-h-home: max(100svh, 59rem);

  /* Internal rhythm of the SHARED hero copy block (<AppHero> only).
     These three gaps were hand-tuned literals (mb-5 / mt-6 / mt-9) â€” the only
     values in the hero system with no derivation behind them, which is how they
     drifted from home's in the first place. Naming them does not unify them with
     home: index.vue is a bespoke cover (Â§22.1 / Â§30.1) and owns its own rhythm
     deliberately. It gives the SHARED component one place to change.

     Values are transcribed 1:1 from the classes they replace â€” this is a
     tokenisation, not a retune. Changing any of them changes hero content height,
     which is the input to --hero-min-h-home above; re-measure the floor and re-run
     tests/e2e/hero.spec.ts G1/G2 if you do. */
  --hero-gap-eyebrow: 1.25rem; /* was mb-5 â€” eyebrow â†’ headline   */
  --hero-gap-lead: 1.5rem; /* was mt-6 â€” headline â†’ subtitle */
  --hero-gap-actions: 2.25rem; /* was mt-9 â€” copy â†’ CTA row      */

  /* Hero readability contract â€” the shared-family invariant.
     The two <AppHero> modes are members of ONE family: they must reach the SAME measured
     readability target, and may reach it however each photograph requires. This is an
     OUTCOME, not an opacity â€” the scrim stops in AppHero.vue are tuned per mode to satisfy
     it, and verified by measurement at visual QA, never assumed.

       Body / lead      >= 4.5:1   (white on the composited backdrop, WCAG AA normal text)
       Kicker / meta    >= 4.5:1   (wood-200, 12px â€” normal text)
       Headline         >= 3.0:1   (>=24px bold â€” WCAG AA large text)

     What is deliberately NOT specified here: gradient direction, stop positions, falloff.
     Those are the image-emphasis lever (Â§Image prominence) and differ by mode ON PURPOSE â€”
     offset opens the subject side, caption keeps its upper frame photographic. The contract
     governs legibility inside the reading band; it says nothing about the photograph above
     it. If a brighter photo needs a deeper local floor, that is tuning, not a contract change. */

  /* â”€â”€ L1 Â· Breakpoints (reference; media queries use the literal) â”€â”€â”€â”€â”€â”€â”€ */
  --bp-md: 48rem; /*  768px                                   */
  --bp-xl: 80rem; /* 1280px â€” the chrome breakpoint.
                                  `lg` is NOT a chrome breakpoint (Â§9)     */

  /* â”€â”€ L1 Â· Foreground on DARK â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  --fg-dark: #fff;
  --fg-dark-muted: rgb(255 255 255 / 0.72); /* 10.1:1 on ink-950        */
  --fg-dark-subtle: rgb(255 255 255 / 0.48); /*  5.0:1 on ink-950 (Â§25.2)*/
  --rule-dark: rgb(255 255 255 / 0.12);
  --accent-dark: var(--color-wood-300); /*  7.8:1 on ink-950        */

  /* â”€â”€ L1 Â· Foreground on LIGHT â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  --fg-light: var(--color-ink-950);
  --fg-light-muted: var(--color-ink-600); /*  7.4:1 on white          */
  --fg-light-subtle: var(--color-ink-500); /*  5.4:1 on white (Â§25.2)  */
  --rule-light: rgb(216 210 202 / 0.6); /* ink-200/60               */
  --accent-light: var(--color-wood-600);

  /* â”€â”€ L1 Â· Motion â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  --ease-editorial: cubic-bezier(0.22, 0.61, 0.36, 1);
  --ease-exit: cubic-bezier(0.4, 0, 1, 1);
  --dur-hover: 240ms;
  --dur-state: 400ms;
  --dur-drawer: 300ms;
  --dur-reveal: 700ms;

  /* â”€â”€ L1 Â· Radius / shadow â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  --radius-pill: 9999px;
  --radius-card: 1rem;
  --shadow-drawer: 0 0 40px rgb(11 10 9 / 0.28); /* the ONLY chrome shadow */

  /* â”€â”€ L1 Â· Layer contract (Â§36) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
     The COMPLETE hierarchy. No z-index may exist outside this table, and raw
     `z-*` utilities are forbidden in chrome (Â§37 R7).

     The drawer, its overlay and the header were ALL z-50 and stacked correctly
     only by DOM ORDER in app.vue â€” a coincidence, not a contract. Any reorder
     silently put the header on top of an open drawer. 60/61 makes it explicit. */
  --z-base: 0;
  --z-hero-content: 10;
  --z-subnav: 30;
  --z-header: 50;
  --z-drawer-overlay: 60; /* was z-50 â€” raised (Â§36)                   */
  --z-drawer: 61; /* was z-50 â€” raised (Â§36)                   */
  --z-lightbox: 80;
  --z-skiplink: 90; /* new (Â§36)                                 */

  /* â”€â”€ L2 Â· Header (consumed in Phase 4) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  --header-h: 4.5rem; /*  72px  < xl                              */
  --header-h-xl: 5.5rem; /*  88px  â‰¥ xl                              */
  --header-scrim-h: 10rem; /* 160px                                    */
  --logo-h-header: 2.5rem; /*  40px OPTICAL (trimmed) < xl             */
  --logo-h-header-xl: 3rem; /*  48px OPTICAL (trimmed) â‰¥ xl             */
  --logo-aspect: 2 / 1; /* measured: 424 Ã— 212                      */
  /* O3 RESOLUTION (was 1rem) â€” Â§16 listed O3 as unresolved and blocking, and
     measurement proved why: the VI NAVIGATION row needs 1421px against 1216px of
     content at 1280, i.e. âˆ’205px, where V11 requires +8px.

     Â§9's arithmetic ("918px of content in a 1232px shell, ~314px of negative
     space") assumed a nav of ~654px. The 7 uppercase VI labels at --type-nav's
     0.12em tracking actually measure 798px â€” +144px â€” and the ~314px of negative
     space has to absorb phone + CTA + gaps, which need 359px. The spec was ~45px
     short by its own numbers before the 144px nav error. That is the whole 205px.

     FG-16 sanctions two levers: reduce --nav-item-px, or reduce --type-nav
     tracking. Together they yield only ~156px against the 213px needed (205 + 8),
     so they cannot close it alone â€” the row does not fit while the 7 links (D.1),
     the CTA's 206px (D.1) and the phone (Â§5.2) all hold.

     Resolved by decision: this halves to 0.5rem (saves 7 Ã— 16 = 112px) and the
     PHONE LEAVES the desktop NAVIGATION row for the drawer, where Â§9 says it
     belongs (saves 109 + 16 = 125px). Total 237px â†’ 1184px required, +32px slack.
     --type-nav-track stays 0.12em: it is the masthead's editorial signature (Â§3.3)
     and this resolution does not spend it.

     Docs owed (Â§17 rule 1): Â§9's desktop figures, Â§5.2/Â§32's Phone rows, and O3
     in Â§16 must all be updated to match. */
  --nav-item-px: 0.5rem;
  --nav-item-min-h: 2.75rem; /*  44px â€” WCAG 2.5.5                       */
  --nav-item-gap: 0.25rem;
  --nav-rule-h: 1.5px;
  --header-group-gap: 2rem;
  --header-action-gap: 1rem;
  --surface-chrome: rgb(255 255 255 / 0.92);
  --surface-chrome-blur: 16px; /* the ONE blur radius                      */
  --header-border-a: 0.6;
  --header-scrim-a1: 0.55;
  --header-scrim-a2: 0.18;
  --scrim-chrome: linear-gradient(
    to bottom,
    rgb(11 10 9 / var(--header-scrim-a1)),
    rgb(11 10 9 / var(--header-scrim-a2)) 45%,
    transparent
  );
  --header-blur-in: 0.05; /* p at which backdrop-filter engages       */
  --header-action-in: 0.5; /* p at which CTA/phone become focusable    */

  /* Runtime â€” written by useHeaderState AND NOTHING ELSE (Â§29 R2). */
  --header-p: 0; /* 0 â€¦ 1                                    */
  --header-shift: 0px; /* 0 | calc(-1 * var(--header-h))           */

  /* â”€â”€ L2 Â· Header typography (Phase 4) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  --type-nav-size: 0.8125rem;
  --type-nav-weight: 600;
  --type-nav-track: 0.12em;
  --type-nav-leading: 1;
  --type-lang-size: 0.75rem;
  --type-lang-weight: 600;
  --type-lang-track: 0.08em;
  --type-meta-size: 0.8125rem;
  --type-meta-weight: 600;
  --type-meta-track: 0.02em;
  --type-action-size: 0.875rem;
  --type-action-weight: 700;
  --type-action-track: 0.01em;

  /* â”€â”€ L2 Â· Drawer (consumed in Phase 5) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  /* SPEC DEFECT, raised not decided (Â§0, D.4): Â§29 declares every drawer
     value EXCEPT the panel's own surface, yet Â§32 puts --fg-light /
     --fg-light-muted / --accent-light on it, all of which presuppose a light
     surface. R2 forbids a literal `#fff` in the component, so the value enters
     as a token here rather than inline. Â§29 needs this row added. */
  --drawer-surface: #fff;
  --drawer-w: 21rem; /* 336px                                    */
  --drawer-w-max: 88vw;
  --drawer-px: 1.5rem;
  --drawer-item-py: 1.25rem;
  --drawer-overlay: rgb(11 10 9 / 0.6);
  --drawer-blur: 8px;
  --type-drawer-nav-size: 1.5rem;
  --type-drawer-nav-weight: 600;
  --type-drawer-nav-track: -0.01em;
  --type-drawer-nav-leading: 1.3;

  /* â”€â”€ L2 Â· Footer (consumed in Phase 6) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  /* The footer's rhythm is a HIERARCHY, and the levels are what make it scannable â€”
     spacing inside a group must read as tighter than spacing between groups, or the
     eye crosses a gap expecting new information and finds the same thought continued.

        8px  within a pair / list item   --footer-item-gap
       16px  between contact pairs        (item-gap doubled by `dd + dt`)
       32px  within a group               --footer-group-gap
       48px  between blocks               --footer-col-gap
       40/56px   page -> footer           --footer-pt / -md
       80/112px  footer -> page bottom    --footer-py / -md

     --footer-py exceeds body spacing DELIBERATELY (Â§10): the finale should have more
     air than an ordinary section, which the old py-16 denied it. The multiplier is the
     point, not the number â€” 112/88 = 1.27x, matching the 144/112 = 1.29x this shipped
     with when --section-py was still 112. When body rhythm changed to 64/88, holding
     144 silently stretched the ratio to 1.64x. Re-derive this if --section-py moves…11870 tokens truncated…
     `aria-hidden`, so without it a screen reader would read a bare phone number with no field
     name. */
  .footer-contact {
    display: flex;
    flex-direction: column;
    /* 20px â€” wider than --footer-item-gap (8px, which governs items INSIDE one list) and
       narrower than --footer-group-gap (32px, which separates blocks). Three icon-led rows are
       neither: at 8px the glyphs stack into a column of noise, at 32px the column outgrows the
       three beside it. */
    gap: 1.25rem;
    margin-top: var(--footer-eyebrow-gap);
  }

  .footer-contact > div {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .footer-contact dt {
    display: flex;
  }

  /* 18px, nudged to the optical centre of the 24px lead line it sits on, so a wrapped value
     keeps its glyph on the FIRST line rather than centring it against two. */
  .footer-contact-icon {
    width: 1.125rem;
    height: 1.125rem;
    flex: none;
    margin-top: 0.1875rem;
    color: var(--accent-dark);
  }

  /* â”€â”€ BAND 2 â€” WHERE THE COMPANY PHYSICALLY IS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
     Two equal halves, one hairline between them. A large wood glyph leads each block; the
     title and the address stack beside it.

     The addresses are the widest strings in the footer, which is why they get a band rather
     than a column: inside a ~250px column they wrap to four ragged lines each. Given half the
     rail they set on two.

     No card, no border box, no shadow â€” the divider and the gap are the entire grouping
     gesture. */
  .footer-locations {
    margin-top: var(--footer-col-gap);
    display: grid;
    gap: var(--footer-group-gap);
  }

  /* The glyph is absolutely positioned out of this box (it has to live inside the <dt> to keep
     the <dl> valid â€” see the template), so the block reserves its column with padding instead:
     36px of icon + 16px of gap.

     --place-inset is how far the whole lockup (glyph included) is pushed in from the block's
     left edge. It is 0 for the first block, which starts at the rail, and the divider gap for
     the second, which starts at a hairline. Driving BOTH the padding and the glyph's `left`
     from one variable is what keeps them in step: a plain `padding-left` override on the
     divided block silently won over this rule's 3.25rem and dropped the reservation to 32px,
     which slid the address underneath its own factory glyph. */
  .footer-locations > div {
    --place-inset: 0px;

    position: relative;
    display: flex;
    flex-direction: column;
    gap: var(--footer-item-gap);
    padding-left: calc(var(--place-inset) + 3.25rem);
  }

  /* The band's only ornament. Wood, per the reference's icon rule â€” the glyphs are monochrome
     accent, never multi-colour and never full-strength white.

     NOTE for anyone tempted to thin these strokes: @nuxt/icon runs in CSS mode here (see
     nuxt.config `icon.cssLayer`), so each glyph is a <span> painted through a mask-image, NOT an
     inline <svg>. `stroke-width` on this rule is inert â€” it was tried and removed. Changing the
     stroke weight means switching the module to `mode: 'svg'`, which is a site-wide decision. */
  .footer-place-icon,
  .footer-trust-icon {
    flex: none;
    color: var(--accent-dark);
  }

  /* Centred on the whole two-line block rather than on the title line. Taken out of flow
     because its DOM position is fixed by the <dl> validity constraint (inside the <dt>), while
     its VISUAL position belongs to the group â€” absolute positioning is what lets those two
     disagree without a wrapper element. */
  .footer-place-icon {
    position: absolute;
    left: var(--place-inset);
    top: 50%;
    width: 2.25rem;
    height: 2.25rem;
    transform: translateY(-50%);
  }

  /* The place NAME. Band 2 carries no eyebrow â€” these titles are its headings â€” so they take
     full-strength white and a heavier weight than the address beneath them. The hierarchy
     inside the block is title (white/600) -> address (muted/400).

     This replaces `.footer-label`, which is retired rather than renamed. That class meant "a
     subtle FIELD NAME inside a column" and its consumers were the contact column's
     ÄIá»†N THOáº I / EMAIL / GIá»œ LÃ€M VIá»†C captions â€” all of which the reference replaces with
     glyphs, leaving the class with one consumer whose meaning was the opposite of its
     definition (a heading, not a field name, and bright rather than subtle). Keeping the old
     name for a rule that now sets white/600 would have made `--fg-dark-subtle` mean two
     different things depending on which element you looked at.
     It keeps --footer-label-track: 0.12em vs the eyebrow's 0.22em is what separates a title in
     the band from a section title above a column. */
  .footer-place-title {
    font-size: var(--type-eyebrow-size);
    font-weight: 600;
    letter-spacing: var(--footer-label-track);
    line-height: 1.25;
    text-transform: uppercase;
    color: var(--fg-dark);
  }

  @media (min-width: 48rem) {
    .footer-locations {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      column-gap: var(--footer-group-gap);
    }

    /* Sets the inset only â€” the padding is derived from it by the base rule, so the glyph and
       the text move together and the icon reservation can never be lost. */
    .footer-locations > :not(:first-child) {
      --place-inset: var(--footer-group-gap);

      border-left: 1px solid var(--rule-dark);
    }
  }

  /* â”€â”€ BAND 3 â€” TRUST STRIP â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
     Four equal cells, glyph + short label, hairlines between. No heading, no description, no
     card, no shadow, no per-item background: the four read as guarantees because they are four
     identical quiet cells, not because anything frames them. All four carry EXACTLY the same
     weight; there is no first among them.

     TWO PER ROW at mobile (reference), four across from 768 up. */
  .footer-trust {
    margin-top: var(--footer-col-gap);
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--footer-group-gap);
  }

  .footer-trust li {
    display: flex;
    align-items: center;
    gap: 0.875rem;
    font-size: var(--type-body-sm-size);
    line-height: var(--type-body-sm-leading);
    color: var(--fg-dark-muted);
  }

  .footer-trust-icon {
    width: 2rem;
    height: 2rem;
  }

  /* Mobile: the rule divides the two cells of each row, so it belongs to the SECOND of each
     pair. At md the `:not(:first-child)` rule below supersedes it with identical values.
     20px for the same reason as the md rule â€” at 390 each cell is ~155px, and divider padding
     comes straight off the label. */
  .footer-trust li:nth-child(even) {
    border-left: 1px solid var(--rule-dark);
    padding-left: 1.25rem;
  }

  @media (min-width: 48rem) {
    .footer-trust {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }

    .footer-trust li:not(:first-child) {
      border-left: 1px solid var(--rule-dark);
      /* 20px, not the 32px used elsewhere. Four cells share the rail here, so every pixel of
         divider padding comes straight off the label: at 32px each cell left ~73px of text
         width and `Kiá»ƒm soÃ¡t cháº¥t lÆ°á»£ng` broke across THREE lines, which made the strip taller
         than the addresses above it. Restored to the standard gap once there is room for it. */
      padding-left: 1.25rem;
    }
  }

  @media (min-width: 80rem) {
    .footer-trust li:not(:first-child) {
      padding-left: var(--footer-group-gap);
    }
  }

  /* â”€â”€ BAND 4 â€” BOTTOM BAR â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
     Three groups: copyright, Facebook, legal.

     `1fr auto 1fr` is the whole point. The centre cell is positioned by the RAIL, not by the
     width of the two groups flanking it, so Facebook sits on the exact centre line however long
     the copyright string or the legal list becomes â€” including under translation, where the
     Vietnamese and English copyright differ by ~40px. Two earlier treatments failed here:
     `space-between` pinned Facebook to the far right edge of a 1360px rail with ~1,000px of
     nothing beside it, and a two-column grid moved that stranded end to the 50% line.

     Mobile stacks the three, centred, in the order copyright -> Facebook -> legal. */
  .footer-meta {
    margin-top: var(--footer-meta-gap);
    display: grid;
    gap: var(--footer-group-gap);
    justify-items: center;
    text-align: center;
    font-size: var(--type-meta-sm-size);
    line-height: var(--type-meta-sm-leading);
    color: var(--fg-dark-subtle);
  }

  .footer-meta a {
    transition: color var(--dur-hover) var(--ease-editorial);
    /* Tap target (WCAG 2.5.8) â€” the same non-invasive pad-and-cancel as `.footer-link`: the
       meta row's height is set by the copyright text, so padding the link and cancelling it
       with a negative margin lifts the hit area to ~35px without moving the row. */
    display: inline-block;
    padding-block: 0.4375rem;
    margin-block: -0.4375rem;
  }

  .footer-meta a:hover {
    color: var(--fg-dark);
  }

  .footer-social a {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
  }

  /* 16px â€” matched to the meta row's own type, not scaled up. The glyph takes currentColor: no
     brand blue, no filled badge. It brightens with the label on hover through
     `.footer-meta a:hover`, so the whole control responds as one. An oversized glyph is the
     fastest way to make a quiet footer look like a social-media banner. */
  .footer-social-icon {
    width: 1rem;
    height: 1rem;
    flex: none;
  }

  .footer-legal {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
  }

  /* Separates two items INSIDE one group, so it stays tighter than --footer-group-gap â€” at 32px
     the pair stops reading as a single legal cluster. 12px until there is room for 20: the three
     groups only just fit on one row at 768 (measured: 704px of rail against ~250px of copyright,
     ~101px of Facebook and ~274px of legal), and this is one of the two places the slack comes
     from. See `.footer-social` below for the other. */
  .footer-legal li + li {
    border-left: 1px solid var(--rule-dark);
    margin-left: 0.75rem;
    padding-left: 0.75rem;
  }

  @media (min-width: 48rem) {
    .footer-meta {
      grid-template-columns: 1fr auto 1fr;
      align-items: center;
      justify-items: stretch;
      text-align: start;
    }

    /* Centred by the RAIL, not by its neighbours: `1fr auto 1fr` makes the two flanking tracks
       equal, so the middle cell sits on the exact centre line whatever the copyright and legal
       strings measure â€” including under translation, where they differ by ~40px. */
    .footer-social {
      justify-self: center;
    }

    .footer-legal {
      justify-self: end;
    }
  }

  @media (min-width: 80rem) {
    .footer-legal li + li {
      margin-left: 1.25rem;
      padding-left: 1.25rem;
    }

    /* The band's one rule, closing the copyright rather than fencing anything. Desktop only: at
       768 its 48px of padding was the difference between the legal links sitting on one line and
       wrapping into the group above them. */
    .footer-social {
      border-left: 1px solid var(--rule-dark);
      padding-left: var(--footer-col-gap);
    }
  }

  /* `.section-shell` (mx-auto max-w-7xl, padding applied outside it by each
     consumer) was the second of the two conflicting shells (Â§4.1). Phase 3B
     moved its last consumer onto `.shell`, so it is gone. Do not reintroduce it:
     a component that owns both a max-width and horizontal padding couples the
     gutter to the measure, which is precisely what ADR-001 rejected. */

  /* Subtle cinematic treatment for hero photography â€” gentle contrast + warmth only.
     No dramatic grading; readability comes from composition + the single scrim. */
  .hero-media {
    filter: contrast(1.04) saturate(1.04);
  }

  .eyebrow {
    /* wood-600, not wood-500: on the light warm surfaces this kicker sits on (ink-50 #f7f7f5,
       wood-50 #faf6f0) wood-500 measures 4.29â€“4.31:1 â€” just under the 4.5:1 AA floor for small
       text (axe-core). wood-600 (#7c5032) clears it, and is exactly --accent-light, the token
       the system already designates for accents on light surfaces. */
    @apply text-xs font-semibold uppercase tracking-[0.22em] text-wood-600;
  }

  .btn-primary {
    @apply inline-flex items-center justify-center gap-2 rounded-full bg-wood-500 px-7 py-3.5 text-sm font-bold text-white shadow-sm shadow-wood-950/10 transition-all duration-300 hover:bg-wood-600 hover:shadow-md hover:shadow-wood-950/15;
  }

  .btn-secondary {
    @apply inline-flex items-center justify-center gap-2 rounded-full border border-white/35 px-7 py-3.5 text-sm font-bold text-white transition-all duration-300 hover:bg-white hover:text-ink-950;
  }

  .btn-dark {
    @apply inline-flex items-center justify-center gap-2 rounded-full bg-ink-950 px-7 py-3.5 text-sm font-bold text-white shadow-sm shadow-ink-950/10 transition-all duration-300 hover:bg-ink-800 hover:shadow-md hover:shadow-ink-950/15;
  }

  .btn-outline {
    @apply inline-flex items-center justify-center gap-2 rounded-full border border-ink-300 px-7 py-3.5 text-sm font-bold text-ink-900 transition-all duration-300 hover:border-ink-950 hover:bg-ink-950 hover:text-white;
  }

  .metric-card {
    @apply rounded-2xl border border-ink-200 bg-white p-6;
  }

  .industrial-card {
    @apply rounded-2xl border border-ink-200 bg-white p-6 transition-colors hover:border-wood-400;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }

  .slide-right-enter-active,
  .slide-right-leave-active {
    transition: transform 0.3s ease;
  }

  .slide-right-enter-from,
  .slide-right-leave-to {
    transform: translateX(100%);
  }
}

@layer components {
  /* Responsive typography â€” fluid scale so headings stay premium on desktop
     and never overflow / oversize on small screens. */
  .text-hero {
    font-size: clamp(2.25rem, 1.4rem + 4.2vw, 4.75rem);
    line-height: 1.05;
    letter-spacing: -0.02em;
    text-wrap: balance;
  }

  .text-section-title {
    font-size: clamp(1.75rem, 1.2rem + 2.6vw, 3rem);
    line-height: 1.12;
    letter-spacing: -0.01em;
    text-wrap: balance;
  }

  .text-lead {
    font-size: clamp(1.0625rem, 1rem + 0.4vw, 1.25rem);
    line-height: 1.7;
  }

  /* MEASURE â€” the one control for line length (Â§ reading comfort, 45â€“75 characters).
     Measure was previously an accident of whichever `max-w-*` a column happened to inherit,
     which is how the same 14px body ended up setting 30 characters per line inside a 258px
     card and 91 inside a 672px column on /nha-xuong â€” a 3x spread at one type size, and the
     91 is roughly double the comfortable maximum.

     `ch` is the correct unit here because the constraint IS characters: it tracks the font
     size, so a paragraph stays inside the band when the type scale moves. `min()` with 100%
     keeps it a cap rather than a width â€” narrow columns are unaffected, so applying it is
     always safe.

     CALIBRATION â€” `ch` is NOT one character. It is the advance width of "0", a lining figure,
     which in Inter is materially wider than the average lowercase glyph. Measured on this
     site's Vietnamese copy, 1ch renders ~1.22 actual characters, so a naive `68ch` sets ~83
     characters per line â€” past the cap it was meant to enforce. These values are therefore
     derived from measurement, not from the target read as a unit:

         56ch â†’ ~68 characters   (body, â‰¤ 15px)
         48ch â†’ ~59 characters   (lead, â‰¥ 16px â€” larger type, tighter character target)

     tests/e2e/typography.spec.ts T2 asserts the OUTCOME (â‰¤ 75 rendered characters per line),
     so if the typeface or the type scale changes and this calibration drifts, the gate fails
     and these numbers get re-derived. Do not tune them by eye. */
  .measure {
    max-width: min(100%, 56ch);
  }

  .measure-lead {
    max-width: min(100%, 48ch);
  }

  /* Elegant underline animation for inline links. */
  .link-underline {
    background-image: linear-gradient(currentcolor, currentcolor);
    background-position: 0 100%;
    background-repeat: no-repeat;
    background-size: 0% 1.5px;
    transition: background-size 0.4s cubic-bezier(0.22, 0.61, 0.36, 1);
  }

  .link-underline:hover {
    background-size: 100% 1.5px;
  }

  /* Consistent, on-brand keyboard focus indicator for all interactive elements.
     Wood-500 clears WCAG 2.4.11 (>= 3:1) against both the light and dark surfaces
     used across the site. */
  :focus-visible {
    outline: 2px solid var(--color-wood-500);
    outline-offset: 2px;
  }

  /* Scroll-reveal â€” default (no-JS / SSR) state is fully visible.
     The hidden state only applies once the client adds `reveal-ready`. */
  html.reveal-ready .reveal {
    opacity: 0;
    transform: translateY(24px);
    transition:
      opacity 0.7s cubic-bezier(0.22, 0.61, 0.36, 1),
      transform 0.7s cubic-bezier(0.22, 0.61, 0.36, 1);
    will-change: opacity, transform;
  }

  html.reveal-ready .reveal.is-visible {
    opacity: 1;
    transform: none;
    /* Release the compositor layer once the animation has run. `will-change` above is a
       PROMISE, not a style: it holds a dedicated layer for the element's whole life unless
       something takes it back. `.is-visible` overrode opacity and transform but not this, so
       every revealed element stayed promoted â€” 50+ permanent layers on the project detail
       page, for an animation that fires once and never repeats (the observer unobserves on
       intersect, see plugins/reveal.ts). Memory cost with zero benefit after first paint. */
    will-change: auto;
  }

  /* Gentle one-time zoom-in for the hero image (image reveal). */
  .hero-image {
    animation: hero-zoom 1.6s cubic-bezier(0.22, 0.61, 0.36, 1) both;
  }

  @media (prefers-reduced-motion: reduce) {
    html.reveal-ready .reveal {
      opacity: 1;
      transform: none;
      transition: none;
    }

    .hero-image {
      animation: none;
    }
  }
}
```

## nuxt.config.ts

```ts
import process from 'node:process'

const useSupabaseMedia = process.env.NUXT_PUBLIC_USE_SUPABASE_MEDIA === 'true'
const supabaseUrl = process.env.NUXT_PUBLIC_SUPABASE_URL ?? ''
const siteUrl = (process.env.NUXT_PUBLIC_SITE_URL?.trim() || 'https://www.noithatlaihuy.vn')
  .replace(/\/+$/, '')

if (useSupabaseMedia && !supabaseUrl) {
  throw new Error(
    '[media] NUXT_PUBLIC_USE_SUPABASE_MEDIA=true requires NUXT_PUBLIC_SUPABASE_URL to be set'
  )
}

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/eslint', '@nuxt/image', '@nuxt/ui'],

  devtools: {
    enabled: true
  },

  // layers.css MUST precede main.css: it carries the cascade-layer order
  // statement, which has to be read before Tailwind's own layer blocks. See the
  // comment in that file for the defect it fixes.
  css: [
    '~/assets/css/layers.css',
    '@fontsource/inter/400.css',
    '@fontsource/inter/500.css',
    '@fontsource/inter/600.css',
    '@fontsource/inter/700.css',
    '@fontsource/inter/900.css',
    '~/assets/css/main.css'
  ],

  runtimeConfig: {
    public: {
      supabaseUrl: '',
      useSupabaseMedia: false,
      // One normalized origin for canonical, Open Graph, JSON-LD, robots and sitemap URLs.
      // NUXT_PUBLIC_SITE_URL can override it per environment.
      siteUrl
    }
  },

  routeRules: {
    '/': { prerender: true },
    '/gioi-thieu': { prerender: true },
    '/du-an': { prerender: true },
    '/nha-xuong': { prerender: true },
    '/dich-vu': { prerender: true },
    '/tuyen-dung': { prerender: true },
    '/lien-he': { prerender: true },
    '/privacy-policy': { prerender: true },
    '/terms-of-use': { prerender: true },
    '/du-an/codi-villa-hien-dai': {
      redirect: { to: '/du-an/codi-villa-phan-thiet', statusCode: 301 }
    }
  },

  compatibilityDate: '2025-01-15',

  nitro: {
    prerender: {
      crawlLinks: true,
      failOnError: true,
      routes: ['/robots.txt', '/sitemap.xml']
    }
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },

  // Inter is imported above from the installed @fontsource package so production builds never
  // depend on an external font API. Provider lookup stays disabled here; the family declaration
  // still records every real weight used by the design. `normal` only â€” no italics are used.
  fonts: {
    families: [
      { name: 'Inter', provider: 'none', weights: [400, 500, 600, 700, 900], styles: ['normal'] }
    ]
  },

  // @nuxt/ui defaults this to `components` (its module.mjs), which makes
  // @nuxt/icon's PREPENDED <style> the first declaration of the `components`
  // layer and silently inverts the cascade â€” preflight then beats every
  // component class. Giving icons their own layer name keeps the injected sheet
  // from claiming `components`; layers.css pins `icons` to lowest priority,
  // which is the precedence @nuxt/icon prepends to achieve anyway.
  icon: {
    cssLayer: 'icons'
  },

  image: {
    provider: 'supabaseMedia',
    providers: {
      supabaseMedia: {
        name: 'supabaseMedia',
        provider: '~/providers/supabase-media',
        options: {
          supabaseUrl,
          useSupabaseMedia
        }
      }
    }
  }
})
```
