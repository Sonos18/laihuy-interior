# Report 6 — Accessibility Review

Target: **WCAG 2.1 Level AA**. Contrast ratios computed from the actual palette in `main.css`; DOM measurements taken in Chromium.

---

## What is already right

Worth recording, because these are the things teams usually get wrong:

- **The focus indicator is real, global, and verified.** `main.css:198` sets `:focus-visible { outline: 2px solid var(--color-wood-500); outline-offset: 2px; }`. The code comment claims it clears WCAG 2.4.11 (≥3:1) against both light and dark surfaces. **It does:**

  | Against | Ratio |
  |---|---:|
  | `white` | 4.63:1 |
  | `ink-50` `#f7f7f5` | 4.32:1 |
  | `ink-950` `#0b0a09` | 4.27:1 |
  | `wood-950` `#170d09` | 4.13:1 |

- **`prefers-reduced-motion` is honoured properly.** `plugins/reveal.ts` never even constructs the `IntersectionObserver` when reduce-motion is set, and `main.css:224` disables the transitions and the hero zoom. Content is visible without JS because the hidden state only applies once the client adds `.reveal-ready` to `<html>`.
- **Decorative images are marked correctly.** `MediaImage.vue:23` and `AppHero.vue:21` map `alt: ''` to an empty `alt` attribute rather than dropping it. The `MediaImage` type documents `alt: ''` as "explicitly decorative". This is the correct pattern and it is rare.
- **External links carry `rel="noopener noreferrer"`** consistently.
- **Form fields are wrapped in `<label>`**, so every input has a programmatic label without needing `for`/`id`.
- **Semantic landmarks** exist: `<header>`, `<nav>`, `<main>`, `<footer>`, `<article>`, `<section>`.

---

## A1 — Three text/background pairs fail AA

**Severity: High** · Difficulty: Trivial · ~30m

All three are small text (< 18.66 px bold / < 24 px regular), so the required ratio is **4.5:1**.

| Location | Class | Computed | Required | Status |
|---|---|---:|---:|---|
| `app/app.vue:353` — footer copyright + Facebook link | `text-white/42` on `ink-950` | **4.05:1** | 4.5:1 | ❌ fail |
| `app/pages/du-an/[slug].vue:171` — hero fact labels (`text-xs`) | `text-white/45` on `ink-950` | **4.49:1** | 4.5:1 | ❌ fail (marginal) |
| `app/pages/du-an/[slug].vue:193` — fact-strip labels (`text-xs font-bold`) | `text-ink-400` `#958777` on `white` | **3.49:1** | 4.5:1 | ❌ fail |

The footer case is worse than it looks: the Facebook link is *interactive* text at 4.05:1.

Everything else in the alpha ladder passes comfortably:

```
text-white/86 → 14.56:1    text-white/68 →  9.22:1
text-white/80 → 12.57:1    text-white/62 →  7.75:1
text-white/76 → 11.34:1    text-white/55 →  6.27:1
text-white/72 → 10.22:1
```

**Fix.** Raise the three offenders to the next rung: `text-white/42 → /55`, `text-white/45 → /55`, `text-ink-400 → text-ink-500` (`#74685d`, 5.41:1). No design impact; the values are already in the scale.

---

## A2 — The mobile menu is not a dialog

**Severity: High** · Difficulty: Medium · ~half day

`app/app.vue:140-225`. The pattern is a full-screen overlay plus a slide-in panel. Missing, all of it:

| Requirement | Status |
|---|---|
| `aria-expanded` on the trigger | ❌ verified `null` |
| `aria-controls` on the trigger | ❌ verified `null` |
| `role="dialog"` + `aria-modal="true"` on the panel | ❌ absent |
| Focus moved into the panel on open | ❌ focus stays on the (now hidden) trigger |
| Focus trapped inside the panel | ❌ Tab escapes into the page behind |
| Focus restored to the trigger on close | ❌ |
| `Escape` closes the menu | ❌ no key handler |
| Background content hidden from AT (`inert` / `aria-hidden`) | ❌ |

A keyboard or screen-reader user can open the menu and then Tab straight into the page underneath it, which is still rendered and still focusable.

The close overlay is a `<button class="fixed inset-0">` with `aria-label="Đóng menu"` — a full-viewport button. It works for pointer users and is announced sensibly, but it is not a substitute for the above.

Also: `document.body.style.overflow` is set imperatively in a `watch` (`app.vue:60-64`). It works, but if the component ever unmounts while open the scroll lock leaks. Guard it in `onUnmounted`.

**Fix.** This is the strongest argument for *keeping* `@nuxt/ui` (Report 2, A6): `USlideover` gives you `role="dialog"`, focus trap, `Escape`, focus restore, and scroll lock, correctly, for free. If hand-rolling, `focus-trap` + a `keydown.esc` listener is ~30 lines.

---

## A3 — 13 tap targets below 44×44 px

**Severity: Medium** · Difficulty: Low · ~2h

Measured at 390×844. WCAG 2.5.5 (AAA) wants 44×44; WCAG 2.5.8 (AA, 2.2) wants 24×24 minimum with spacing. Several of these fail even the AA threshold once spacing is considered.

| Element | Measured | File |
|---|---|---|
| Hamburger button | **40 × 46** | `app.vue:140` (`p-2` + `h-6 w-6`) |
| Footer nav links (`Home`, `Projects`, …) | 39–57 × **17** | `app.vue:268` |
| Footer contact links (phone, email) | 327 × **20** | `app.vue:302,311` |
| Locale toggle pills | ~34 × **28** | `app.vue:112` (`px-3 py-1.5 text-xs`) |

**Fix.** `p-2` → `p-2.5` on the hamburger (44×44). Add `py-2` to footer `<li>` anchors. Locale pills → `px-4 py-2.5`. None of these change the visual rhythm meaningfully.

---

## A4 — The locale toggle is not an accessible control group

**Severity: Medium** · Difficulty: Low · ~1h

```html
<div class="inline-flex rounded-full border p-1" :aria-label="t(uiText.language)">
  <button v-for="option in localeOptions" …>{{ option.label }}</button>
</div>
```

- `aria-label` is placed on a plain `<div>` with **no `role`**, so it is ignored by assistive technology.
- The buttons have no `aria-pressed` / `aria-current`, so the active language is conveyed **only by background colour**.
- The labels are `VI` / `EN`, with no accessible expansion ("Tiếng Việt" / "English" exist in `uiText.language` but are used for the ignored `aria-label`).

**Fix.**

```html
<div role="group" :aria-label="t(uiText.language)">
  <button
    v-for="option in localeOptions"
    :aria-pressed="locale === option.value"
    :lang="option.value">
    <span aria-hidden="true">{{ option.label }}</span>
    <span class="sr-only">{{ option.value === 'vi' ? 'Tiếng Việt' : 'English' }}</span>
  </button>
</div>
```

Duplicated in the desktop header (`:107`) and the mobile panel (`:202`) — extract one component.

---

## A5 — `lang` is wrong for English visitors

**Severity: High** · Difficulty: (fixed by Report 5, S2)

Prerendered HTML always ships `lang="vi"`. An English visitor's cookie only flips it on the client:

```console
$ curl -H 'Cookie: lai-huy-locale=en' localhost:3000/ | grep -o 'lang="[a-z]*"'
lang="vi"
```

This is a **WCAG 3.1.1 (Language of Page)** failure for the initial render: a screen reader announces English copy with Vietnamese phonemes until hydration completes. Additionally, the site never uses `lang` attributes on inline foreign-language runs (e.g. `special-title="Lai Huy Interior"` inside Vietnamese copy), which is **WCAG 3.1.2**.

Resolved by moving to URL-based locales (Report 5, S2).

---

## A6 — No skip link

**Severity: Medium** · Difficulty: Trivial · ~15m

There is no "skip to main content" link. With seven nav links, a locale toggle, a phone link, and a CTA in the header, a keyboard user tabs through **eleven controls** before reaching page content — on every page.

`<main class="grow">` already exists in `app.vue:227`. Add:

```html
<a href="#main" class="sr-only focus:not-sr-only focus:absolute focus:z-[60] …">
  {{ t({ vi: 'Chuyển đến nội dung chính', en: 'Skip to main content' }) }}
</a>
…
<main id="main" class="grow" tabindex="-1">
```

---

## A7 — Heading semantics

**Severity: Low–Medium** · Difficulty: Low

- **`index.vue:83-91`** wraps a second sentence in a `<span>` *inside* the `<h1>`:
  ```html
  <h1>Sản xuất & thi công nội thất dự án
    <span>Chuyên khách sạn, resort và căn hộ cao cấp</span>
  </h1>
  ```
  The accessible name of the page's only `h1` becomes both sentences. Move the `<span>` out into a sibling `<p>`. Same pattern in `AppHero.vue:57-65` (`specialTitle`), though there it is a genuine continuation of one phrase and is acceptable.

- **`du-an/index.vue:121`** makes every project-card title an `<h2>`, producing eleven sibling `h2`s with no section heading above them. The page's `h1` lives in `AppHero`. Prefer one `<h2>` for the listing and `<h3>` per card.

- **`lien-he.vue:114`** uses `<h2>` for contact-card titles ("Phone", "Email") — reasonable, but they sit inside `<article>`s with no enclosing section heading.

- The footer uses `<h4>` for its four column headings (`app.vue:260,279,293`) with no `h3` ancestor. Harmless in practice; `<h2>` would be more correct since the footer is a top-level landmark.

---

## A8 — Forms

**Severity: Medium** · Difficulty: Low · ~2h

`lien-he.vue` gets the basics right — every control is inside a `<label>`, `type` attributes are correct (`tel`, `email`), and `required` is present. Missing:

- **No `autocomplete` attributes.** Add `autocomplete="name" | "email" | "tel"` — this is WCAG 1.3.5 (AA).
- **No error messaging.** Validation is browser-native only; there is no `aria-describedby`, no `aria-invalid`, no error region. A screen-reader user gets the browser's default bubble, which is inconsistent across engines.
- **No `aria-live` confirmation.** `submitForm()` navigates to a `mailto:` URL. Nothing is announced. If the user has no mail client, **nothing happens at all** and nothing is communicated.
- **`<select>` has no accessible description** of why "Chọn loại dự án" is a placeholder rather than a value.
- **`resize-none` on the textarea** (`:216`) removes the user's ability to enlarge it — a minor but real usability regression for long messages.

Replacing this with `UForm` + `UInput` (Report 2, A6) resolves most of these by default.

---

## A9 — Miscellaneous

- **Logo `<img>`s have no `width`/`height`** (`app.vue:83,171,235`), causing layout shift as the header renders. Not strictly an a11y failure, but CLS harms users with cognitive and motor impairments most.
- **`AppGalleryGrid`** renders up to 30 images with **identical `alt` text** (the project name) — see Report 5, S8. For a screen-reader user this is 30 announcements of the same string. Mark the gallery `role="list"`, give images distinct alts, or mark the decorative ones `alt=""`.
- **`index.vue:116`** has a `group-hover:` transform with no `group` ancestor — a dead animation, not an a11y issue, but it means the affordance the design intended (arrow slides on hover) never communicates.
- **Colour is the only channel** distinguishing the active nav link (`text-wood-600` vs `text-ink-600`) and the active category filter on `/du-an`. Add `aria-current="page"` to the nav and `aria-pressed` to the filter buttons.
- **The category filter buttons** (`du-an/index.vue:71-84`) are a toggle group with no `role="group"` and no `aria-pressed`, and changing the filter does not announce the new result count. Add an `aria-live="polite"` region: "11 dự án" → "3 dự án".

---

## Priority summary

| ID | Issue | WCAG | Severity | Effort |
|---|---|---|---|---|
| A1 | Three contrast failures on small text | 1.4.3 AA | High | 30m |
| A2 | Mobile menu: no dialog role, no focus trap, no Esc | 2.1.2, 4.1.2 | High | 0.5d |
| A5 | `lang="vi"` served to English users | 3.1.1 AA | High | *(via S2)* |
| A6 | No skip link | 2.4.1 A | Medium | 15m |
| A3 | 13 tap targets < 44 px | 2.5.5 / 2.5.8 | Medium | 2h |
| A4 | Locale toggle: no `role`, no `aria-pressed` | 4.1.2 A | Medium | 1h |
| A8 | Forms: no `autocomplete`, no error/status announcements | 1.3.5, 3.3.1 | Medium | 2h |
| A7 | `<span>` inside `h1`; 11 sibling `h2`s on `/du-an` | 1.3.1 A | Low | 1h |
| A9 | No `aria-current`, duplicate gallery alts, logo CLS | 1.4.1, 1.1.1 | Low | 0.5d |

**Quick wins first:** A1 (30 min), A6 (15 min), A4 (1h), A3 (2h) — roughly half a day for four AA-level improvements. A2 is the substantial one and is best solved by adopting `USlideover` rather than hand-rolling.

**Not yet verified.** This audit was static + scripted. Before launch, run: an axe-core pass on all eight routes, a full keyboard-only traversal, and a screen-reader smoke test (NVDA on Windows, VoiceOver on iOS) — particularly of the mobile menu and the contact form.
