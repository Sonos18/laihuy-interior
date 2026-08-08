# Footer Refinement Spec — Phase 10

**Companion to [`header-footer-art-direction.md`](./header-footer-art-direction.md).** That document
governs the footer's *form* and remains authoritative on tokens, contracts and rendering budget.
This document governs a **refinement pass on its content and hierarchy**, and supersedes §10 /
§10.1 only where explicitly stated.

Status: **specification. Not implemented.**

> ### This is a refinement, not a redesign
>
> The shell rail, palette, type scale, spacing hierarchy, `<dl>` idiom, one-hairline rule,
> zero-shadow rule and the purely-presentational component contract (§26.3, §30.2) are **strengths
> and are preserved without exception**. Every change below is expressible in the existing token
> vocabulary plus four new tokens, each justified in §11.
>
> The determinism rule (§0) still applies: prose that reads as judgement is rationale; only
> numbers and tokens are criteria.

---

## 0. What this pass fixes, and the two facts that shape it

Four defects, measured on the running build at 390 / 768 / 1440 (VI, homepage):

| # | Defect | Measurement |
|---|---|---|
| **D1** | Column heading and field label are typographically identical | both `12px / 600 / 2.64px / uppercase`, 12px apart, differing **only in colour** |
| **D2** | The masthead band leaves the rail half empty | rightmost ink 655px of a 1360px rail — **55% void** |
| **D3** | Five service links resolve to one destination | 6 of 18 footer links → `/dich-vu` |
| **D4** | The closing region duplicates itself | phone, email **and** the `/lien-he` CTA appear in both `.section-cta` and the footer, inside 1,490px |

Two facts about this repository determine how D2 is allowed to be fixed.

**F1 — The trust data already exists and is authentic.** `app/data/factory.ts` exports
`factoryCapabilities`: four authored, bilingual `label` / `value` / `description` records, already
rendered on `/nha-xuong`. Two carry hard numbers (`3.000 m²`, `Lên đến 50 phòng khách sạn/tháng`).
**The trust layer requires no new data and no new content type — it is a reuse of an existing
record shape into an existing markup idiom (`<dl>`).**

**F2 — Fabricating company facts is already forbidden.** `app/data/company.ts` keeps
`foundingYear`, `milestones`, `certifications`, `testimonials`, `team` and `founder` empty behind
the comment *"Every field renders conditionally and stays empty until authored with authentic
content — never fabricated."*

> **⚠ Correction to the prior audit.** An earlier draft proposed a masthead metric strip reading
> `12+ NĂM · 180+ DỰ ÁN · 6.000m² · 34 TỈNH THÀNH`. **Every one of those figures was invented.**
> Shipping them would violate F2 and misrepresent a real business. They are withdrawn. This
> specification uses `factoryCapabilities` verbatim and nothing else.

---

## 1. Structure — the revised footer

```
╔══════════════════════════════════════════════════════════════════════════════╗
║  BAND 1 · MASTHEAD + CAPABILITY                                              ║
║                                                                              ║
║  ◈ LAI HUY                          NHÀ XƯỞNG & KHO                          ║
║    interior                         3.000 m²                                 ║
║                                                                              ║
║  Nhà thầu sản xuất và thi công      NĂNG LỰC SẢN XUẤT                        ║
║  nội thất khách sạn, villa và       Lên đến 50 phòng khách sạn/tháng          ║
║  căn hộ cao cấp…                                                             ║
║                                                                              ║
║  [ Đặt lịch tham quan nhà xưởng ]        ← the ask, AFTER the evidence        ║
╟──────────────────────── the ONE hairline (--rule-dark) ──────────────────────╢
║  BAND 2 · REACH US — two horizontal rows, never a tall column                ║
║                                                                              ║
║  ĐIỆN THOẠI            EMAIL                    GIỜ LÀM VIỆC                  ║
║  +84 903 102 012       noithatlaihuy@gmail.com  8:00–17:00 · T2–T7            ║
║                                                                              ║
║  VĂN PHÒNG GIAO DỊCH                    NHÀ XƯỞNG                             ║
║  Lô Q-2, đường số 8, KCN Long Hậu …↗    557E1 - KP2, Phường Phú Khương …↗     ║
╟──────────────────────────────────────────────────────────────────────────────╢
║  BAND 3 · INDEX                                                              ║
║                                                                              ║
║  ĐIỀU HƯỚNG                    DỊCH VỤ                                       ║
║  Trang chủ      Giới thiệu     Thiết kế & triển khai kỹ thuật  →#design       ║
║  Dự án          Tuyển dụng     Sản xuất nội thất tại xưởng     →#factory-…    ║
║  Nhà xưởng      Liên hệ        Thi công nội thất dự án         →#construction ║
║  Dịch vụ                       Nội thất khách sạn & resort     →#hotel-…      ║
║                                Nội thất thương mại             →#commercial-… ║
║                                Gia công / xuất khẩu            →#export-oem   ║
╟──────────────────────────────────────────────────────────────────────────────╢
║  BAND 4 · META (separated by space alone — no border)                        ║
║  © 2026 Lai Huy Interior · MST 0000000000    Bảo mật · Điều khoản    ⓕ ⓩ      ║
╚══════════════════════════════════════════════════════════════════════════════╝
```

Four bands. The change is not addition — **contact leaves the index and becomes a horizontal row**,
which is what pays for the capability strip.

> ### The contact column must not survive as a column — and this is the one trap in the redesign
>
> An earlier draft of this band put `LIÊN HỆ` as a tall `<dl>` in the first of three cells, with
> the two addresses beside it. **That recreates the exact defect §10.1 removed.** Measured, the
> contact `<dl>` is **241px** of content; each address cell is **49px**. A three-cell row sized by
> its worst case would render ~80% of two cells empty, pooling bottom-left — which is the
> 436-vs-270-vs-191 problem verbatim, in a new band.
>
> **Contact is therefore laid out horizontally**, exactly as `.footer-locations` already is: three
> short label/value pairs across the rail (`ĐIỆN THOẠI` 111px, `EMAIL` 166px, `GIỜ LÀM VIỆC` two
> lines), then the two addresses on a second row. Both rows are ~49–66px tall. The band goes from
> a 241px column to **~147px of two balanced rows**, and the pooling cannot occur because no cell
> is more than ~35px taller than its neighbours.

---

## 2. Section ordering — and why the obvious order is wrong

The brief proposed `CTA → Proof → Locations → Navigation → Legal`. **Reject the CTA-first
element**, keep the rest.

A footer that opens with a button opens with a second sales ask within ~200px of the
`.section-cta` band's ask. Two consecutive asks with no new information between them is the
pattern that made D4 a defect; re-ordering would preserve it in a new shape.

The persuasion order that actually works is **claim → evidence → ask**:

| Position | Content | Job |
|---|---|---|
| 1 | Logo + positioning statement | **Claim.** "This is who we say we are." |
| 2 | Capability strip (`3.000 m²`, `50 phòng/tháng`) | **Evidence.** The claim is "factory-direct"; this is the factory, in numbers. |
| 3 | CTA — *Đặt lịch tham quan nhà xưởng* | **Ask.** Now supported. The ask is also *about* the evidence, so the three lines form one argument. |
| 4 | Contact + two physical addresses | **Corroboration.** Two facilities in two provinces is the factory-direct claim made physical. Reach-us and proof are the same content here. |
| 5 | Index | **Reference.** Lowest intent, correctly last. |
| 6 | Meta + legal | **Closure.** |

Bands 1–4 form a continuous confidence arc; bands 5–6 are the reference tail. That is why
locations move **above** the index rather than below it: they are trust content that has been
filed as directory content.

---

## 3. The trust layer

### 3.1 Content — bound, not authored

Render `factoryCapabilities[0]` and `[1]` only.

| # | Label | Value | Why it belongs in a footer |
|---|---|---|---|
| 0 | Hệ thống nhà xưởng & kho | **3.000 m²** | A verifiable physical asset. The single hardest thing to fake and the fastest way to distinguish a manufacturer from a broker — which is precisely the doubt a procurement team brings to an unfamiliar contractor. |
| 1 | Năng lực sản xuất & thi công | **Lên đến 50 phòng khách sạn/tháng** | Answers the only scheduling question a hotel developer has: *can you absorb my programme?* It converts "we have a factory" into "we can deliver your 120 keys in three months." |

Records `[2]` (Đội ngũ triển khai) and `[3]` (Thị trường) are **excluded**: both are qualitative
strings that restate the positioning statement sitting 40px to their left. Including them would
turn a two-line proof into a four-line list and cross from editorial into promotional.

**Do not add years-in-business, project count, certifications or client names.** All are empty in
`company.ts` under the F2 rule. If they are authored later, `foundingYear` and `certifications`
are the two that earn a place; extend the strip to three items maximum and re-run §7's balance
check. Anything beyond three is a dashboard.

### 3.2 Form — the strip is a `<dl>`, not a stat block

```html
<dl class="footer-capability">
  <div v-for="cap in footerCapabilities" :key="...">
    <dt class="footer-label">{{ t(cap.label) }}</dt>
    <dd class="footer-value">{{ t(cap.value) }}</dd>
  </div>
</dl>
```

Identical structure to `.footer-locations`. Same `<dl>`, same wrapper-div-per-pair, same
`--footer-item-gap`, same `.footer-label` / `.footer-value` classes. **No new component
vocabulary, no new typography.**

> ### Rejected: an enlarged metric type (`--type-metric`, 32px / 700)
>
> An earlier draft proposed setting the values at 32px to make them land. **Reject it, for the
> same reason §10.1 rejected enlarging the phone number, and the reasoning is worth preserving
> because it looked like the opposite call.**
>
> The footer's value layer is uniformly `--type-body-sm`, and that flatness *is* the premium
> signal. A 32px `3.000 m²` beside a 14px `+84 903 102 012` asserts that the floor area outranks
> the phone number, which is false. It is also mechanically impossible: `Lên đến 50 phòng khách
> sạn/tháng` is 33 characters and would wrap to three lines in any cell narrow enough to sit
> beside the statement — destroying the big-number effect that justified the exception.
>
> **The strip earns attention from position, not size.** It occupies the top band's right half,
> which is the first place the eye lands after the logo, and it is currently empty. Position is
> free; a type exception costs the system a permanent precedent.

### 3.3 Why this location has the highest impact

Three reasons, in order of weight:

1. **It is the only band the eye reads before deciding whether to keep reading.** Bands 2–4 are
   consulted; band 1 is *seen*. Proof placed in a consulted band is proof that only already-
   convinced users find.
2. **It is adjacent to the claim it supports.** Proof 400px below its claim is a separate
   assertion; proof 40px beside it is evidence. Adjacency is what makes the pair read as an
   argument rather than as two marketing statements.
3. **The space is already paid for.** 705px of the rail is empty in this band (D2). This is the
   only structural change in the entire specification that costs **zero additional footer
   height at desktop** — it converts void into content in place.

---

## 4. Typography — resolving the D1 collision

### 4.1 New token: `--type-field-label`

```css
--type-field-label-size:   0.6875rem;  /* 11px */
--type-field-label-weight: 500;
--type-field-label-track:  0.14em;
```

`.footer-label` consumes these instead of the `--type-eyebrow-*` trio. `.footer-eyebrow` is
unchanged.

| | Column heading (`--type-eyebrow`) | Field label (`--type-field-label`) |
|---|---|---|
| size | 12px | **11px** |
| weight | 600 | **500** |
| tracking | 0.22em | **0.14em** |
| case | uppercase | uppercase |
| colour | `--accent-dark` (wood-300) | `--fg-dark-subtle` |
| **differences** | — | **four, of which three survive colour loss** |

### 4.2 Why a new token rather than reusing an existing one

The system has four candidates and none of them *means* this:

| Token | Its actual semantic | Why it cannot take this role |
|---|---|---|
| `--type-eyebrow` | *"the label above a block of content, at the rank of a hero kicker"* — deliberately shared with `.eyebrow` (§3.3) | Reusing it here **is what caused D1.** Two roles under one token is not reuse, it is **homonymy**: same form, different meaning, and the render cannot tell them apart. |
| `--type-meta-sm` | body copy in the meta row (the copyright sentence) | A field label is not body text; at 13px/400 it would compete with its own 14px value. |
| `--type-body-sm` | the **value** layer | Label and value would be identical — the same defect, moved. |
| `--type-lang` | the VI/EN control | A control, not a label. Borrowing it couples the footer to the header's toggle. |

**A token earns existence when a distinct semantic role has no existing token whose meaning it can
honestly borrow.** "Micro-label subordinate to an eyebrow, above a value" is a role the system
uses in three places (contact pairs, locations, and now capability) and has never named. Naming it
is what makes D1 structurally unrepeatable rather than fixed-once.

Contrast is unaffected: `--fg-dark-subtle` measures **4.99:1** on ink-950 and 11px/500 is small
text, so the 4.5:1 floor applies and is met. *(Conservative fallback if 11px is judged too small
in production: hold 12px and take weight 500 / tracking 0.12em — two differences instead of three,
still colour-independent.)*

### 4.3 Spacing — heading rhythm

**Problem:** the eyebrow→first-item gap is 12px, exactly equal to the item→item gap. Gestalt
proximity sets grouping by *relative* spacing; at a 1:1 ratio the heading reads as item zero.

**Fix:** new token `--footer-label-gap: 1.5rem` (24px), applied as `margin-top` on `.footer-list`,
`.footer-contact` and `.footer-capability`, replacing the current `--footer-item-gap`.

24px is **not a new rhythm level** — it is the level the contact `<dl>` already produces between
pairs (`dd + dt` doubling `--footer-item-gap`, §29's own hierarchy list). The token names an
existing level rather than inventing one. Ratio to item gap: **2.0×**.

Cost: +12px per column. At desktop that is +12px total (columns are side by side); on mobile
+36px across three stacked blocks — paid for many times over by §6.

### 4.4 Rejected: raising `--footer-item-gap` to 16px

The prior audit recommended this for tap-target separation. **Reject.** Measured separation
between adjacent link hit areas is ~7px with 29px targets — which **passes WCAG 2.5.8 AA** (24px
minimum). Raising the gap to 16px costs `6 × 4px = 24px` per column and **+90px on mobile** across
the stack, to improve a metric that already conforms. That trades a real problem (mobile height)
for a conforming one. Item gap holds at 12px; the pad-and-cancel hit area is unchanged.

---

## 5. Information architecture

### 5.1 Services — anchor navigation, and it is nearly free

**Recommendation: anchor navigation into `/dich-vu`, sourced from `services.ts`.**

The other two options and why they lose:

- *Dedicated pages* — six new pages is the SEO-optimal answer and the correct 12-month move, but
  it is a content programme, not a footer change. It cannot gate this pass.
- *Remove the column* — surrenders the footer's only topical keyword surface and re-opens the
  "0 of 14 links in this column" hole Phase 9 closed.

Anchors capture most of the value at a fraction of the cost, and the repository is already
one line away:

1. **`services.ts` already has six stable ids** — `design`, `factory-production`, `construction`,
   `hotel-interior`, `commercial-projects`, `export-oem`.
2. **`dich-vu.vue` already iterates them** with `:key="service.id"` but never emits `id` on the
   rendered card. Adding `:id="service.id"` creates six real anchor targets.
3. **`company.footerServices` is then deleted.** It is a hand-maintained five-string parallel list
   that has already **drifted** from `services.ts`: only one entry matches an authored service
   title, and `Kiểm soát chất lượng dự án` is not a service at all — it is a production step. The
   footer column binds `services` directly, so the two can never diverge again.

Required alongside: `scroll-margin-top: calc(var(--header-h) + 1rem)` on the service cards —
consuming the token exactly as `du-an/[slug].vue` already does (§3.2), not a hardcoded offset.

**Net:** five misleading links → six honest ones, one duplicated data source deleted, six
commercially valuable Vietnamese phrases become linkable section targets.

### 5.2 De-duplication — the band owns conversion, the footer owns reference

`.section-cta` currently carries a primary CTA, a secondary CTA, a `mailto:` **and** a `tel:`.
The footer 300px below repeats the phone, the email and the `/lien-he` destination.

**Remove `mailto:` and `tel:` from `.section-cta`.** Not from the footer.

Rationale: a conversion band's power comes from making **one** offer. Four competing affordances
in one band is dilution, and the two weakest are the ones the footer is *definitionally* the right
home for — reference contact detail is a footer's oldest and least negotiable job. A footer
without a phone number is broken; a CTA band without an inline `tel:` is simply focused.

This costs the band nothing: anyone wanting to phone rather than submit drawings finds the number
~300px below, in the band this specification promotes to position 4.

### 5.3 Navigation supports, does not compete

The nav column keeps all seven links but moves to **band 3, after** contact and locations, and at
mobile renders as a two-column grid (§6). It is reference material presented as reference
material. It cannot compete with the CTA because it now sits two bands below it.

---

## 6. Mobile

### 6.1 An honest budget

The brief asks for a significant height reduction. The prior audit projected **−43% to ~980px**.
**That projection was wrong: it counted the reductions and not the additions.** This pass *adds* a
capability strip and a legal line. The achievable figure is smaller and is stated here rather than
discovered at implementation.

| Change | Δ |
|---|---|
| Nav list → 2-column grid (7 short links, max 103px wide, fits 157px cells) — **applies at every breakpoint**, see §7 | **−107px** |
| Contact leaves the index and becomes a horizontal row (§1) | −80px |
| `--footer-stack-gap` 48 → 32 between stacked blocks (×2) | −32px |
| `--footer-meta-row-gap` 48 → 16 on the wrapped meta row | −32px |
| Locations internal gap 48 → 32 | −16px |
| **Reductions** | **−267px** |
| Capability strip (2 pairs, stacked) | +110px |
| `--footer-label-gap` +12px on each of four headings | +48px |
| Legal links appended to the meta row (not a new band) | +20px |
| **Additions** | **+178px** |
| | |
| **1,724px → ~1,635px** | **−5%** |

**−5% is not a significant reduction, and pretending otherwise would be the wrong call.** Two
further levers exist; both are decisions, not defaults:

| Lever | Δ | Trade-off |
|---|---|---|
| **L1 — Services as `<details>/<summary>` below `md`** | **−167px** | Native, zero-JS, keyboard-operable, and the brief permits accordions where justified. Cost: one collapsed disclosure is one more interaction between a mobile user and six service anchors that most will not open. |
| **L2 — Drop the nav column from the footer below `md`** | **−143px** | The drawer already carries all seven links at `--type-drawer-nav` (24px), where §9 says the index belongs on mobile. Cost: the footer stops being a navigational fallback on the viewport where fallbacks matter most, and the `<nav>` landmark disappears from the mobile footer. |

**Recommendation: take L1, hold L2.** L1 compresses; L2 removes. The brief's own instruction is
*prefer information compression over information removal*, and L2 is removal disguised as
responsiveness. With L1: **1,724 → ~1,470px (−15%), roughly 1.75 screens**, while gaining a trust
layer and a legal layer.

If the team wants ~1,150px, L2 is the only way there, and it should be taken as an explicit
product decision with the landmark loss understood — not folded into a refinement pass.

### 6.2 Stack order at mobile

Bands stack in document order, which already yields the §2 arc: logo → statement → **capability →
CTA** → contact → locations → nav → services → meta. Claim, evidence, ask, in that order, with no
media-query content reordering. **No `order` property anywhere** — DOM order and visual order stay
identical, so the tab sequence needs no special handling.

### 6.3 Button width

The CTA is 153px in a 327px container. **Hold it left-aligned at intrinsic width; do not stretch
to full-width.** A full-width footer button is an app convention that would be the single loudest
element in the component and would break the left-flush editorial column the masthead is built on.
153×48px already exceeds WCAG 2.5.5 (44px).

### 6.4 Meta row

Currently wraps to 90px because the row's `gap` inherits `--footer-col-gap` (48px) — a *horizontal
column* value applied to a *vertical wrap*. With `--footer-meta-row-gap: 1rem` it wraps to ~58px
while carrying more content (copyright + tax code + two legal links + social icons).

---

## 7. Layout balance — is the negative space intentional?

**Diagnosis: the quantity is defensible; the shape is not.**

The 705px void is not excessive whitespace — the site's whole editorial register depends on air,
and §9's "~330px of deliberate negative space" in the header is the same instinct working
correctly. The failure is that this void is **unshaped**: a rectangle to the right of a left-
flushed stack, bounded on one side only. Premium layouts hold large voids all the time, but the
void is bounded by content on at least two edges, which is what makes it read as *composition*
rather than as *unfinished*.

**Fix by bounding, not by filling.** The capability strip occupies roughly 300px of the void's
705px, leaving ~400px of air *between* the statement and the strip. The band goes from
`content | void` to `content | void | content` — the void becomes an interval instead of an edge,
and it stays large.

Measured target at 1440:

| | Now | After |
|---|---|---|
| Rightmost ink in band 1 | 655px | ~1,360px |
| Void | 705px (55%) | ~400px, **interior** |
| Band 1 height | 278px | 278px (strip is shorter than the statement column) |

**The footer does not get denser and does not get taller.** It gets balanced.

Column weighting in band 3 changes from `repeat(3, 1fr)` to a two-column
`grid-template-columns: 1fr 1.4fr` — measured horizontal fill was 26% (nav, widest string 103px)
against 46% (services, 181px), and equal columns for unequal content is a different arbitrary from
the four fractions §10 replaced.

**The nav list runs two columns inside its cell at every breakpoint**, not only on mobile. Seven
labels with a 103px worst case in a ~530px cell is a 20% fill rate; two sub-columns take the block
from 268px to ~131px and bring it into balance with the 195px services list beside it. This is
also what keeps the desktop height budget flat:

### Desktop height budget (1440)

| Band | Now | After | Note |
|---|---|---|---|
| Masthead | 278 | **278** | capability strip is shorter than the statement column — the void absorbs it |
| gap + hairline + gap | 97 | 97 | unchanged |
| Index (3 cols, sized by nav 268) | 317 | — | contact leaves; nav halves |
| Reach us (contact row + locations row) | — | **147** | new band, two balanced horizontal rows |
| gap | 48 | 48 | |
| Index (2 cols, sized by services 195) | — | **207** | 195 + `--footer-label-gap` |
| Locations band | 49 + 48 | — | absorbed into Reach us |
| gap + meta | 48 + 21 | 48 + 21 | |
| `--footer-py` × 2 | 224 | 224 | **not touched** — §15.6 |
| **Total** | **~1,032** | **~1,070** | **+4%** |

**Desktop height is approximately neutral, not reduced — and that is the honest number.** An
earlier draft of this section claimed a fall to ~940px; that arithmetic double-counted the removal
of the locations band while ignoring that promoting contact out of the index *creates* a band. The
correct claim is: **the footer absorbs a trust layer and a legal layer for a ~38px cost**, and
resolves D2's balance failure at zero height. Reducing desktop height was never a stated goal;
not inflating it was.

---

## 8. CTA strategy

Three CTAs currently point at `/lien-he` with three different labels, weakening on approach:
*Nhận báo giá trong 24h* → *Gửi bản vẽ nhận báo giá trong 24h* → *Liên hệ tư vấn*.

**They should represent different intents, not the same promise at different volumes.**

| Position | Intent | Label | Destination |
|---|---|---|---|
| Header (scrolled) | Fast, low commitment | Nhận báo giá trong 24h | `/lien-he` |
| Pre-footer band | High commitment, qualified | Gửi bản vẽ nhận báo giá trong 24h | `/lien-he` |
| **Footer** | **Verification — "prove you are real"** | **Đặt lịch tham quan nhà xưởng** | `/lien-he` |

The footer's user is, by definition, the one who did **not** convert on the band above. Repeating
that band's offer 300px later addresses no new objection. The objection that actually stopped them
is *"I do not yet believe this company can build my project"* — which is why the footer CTA should
ask for a **factory visit**, and why it is placed immediately below the capability strip. The strip
raises the factory; the CTA offers to show it. That is one argument, not two adverts.

> **Dependency, stated rather than assumed.** `/lien-he` has no enquiry-type field, so a
> factory-visit CTA currently lands on a generic contact form — a softer version of the
> self-referential problem §10.1 removed. **This CTA ships only if `/lien-he` gains an enquiry-type
> field or a prefilled subject** (the `quoteMailto` pattern in `company.ts` is the existing
> precedent). If that dependency is refused, the correct fallback is to **remove the footer CTA
> entirely** and let `.section-cta` own conversion alone — *not* to keep a third button pointing at
> the same undifferentiated form.

---

## 9. Accessibility

Everything currently passing is preserved: measured contrast (eyebrow 7.84:1, labels 4.99:1, links
10.24:1, focus ring 4.3:1), `<nav aria-labelledby>` named from its visible heading, `<dl>` for
label/value pairs, `rel="noopener noreferrer"`, no duplicated `aria-label`.

| # | Change | Standard |
|---|---|---|
| A1 | `--type-field-label` gives heading/label **four** differences, three of them non-chromatic | **1.4.1** — currently the distinction is colour-only |
| A2 | Wrap each address `<dd>` content in `<address>` | Semantic; feeds AT and parsers |
| A3 | External-link glyph + `aria-label` on the three `target="_blank"` links, using **`uiText.labels.openMaps`** — the string already exists and is already used on `/lien-he` | **3.2.5** / G201 |
| A4 | Focus ring 1.6px → **2px**, matching the token the spec already declares | **2.4.13** (AAA) |
| A5 | Give the Services column a `<nav aria-labelledby>` landmark, matching the Navigation column | Consistency — either it is navigation and is a landmark, or it is not navigation and should not be links |
| A6 | Social icon links take `aria-label` (`Facebook`, `Zalo`); the glyph is `aria-hidden` | **4.1.2** — icon-only controls need an accessible name |
| A7 | With L1, `<details>/<summary>` below `md` — native disclosure semantics, no ARIA | **4.1.2** |

**Explicitly not added:** `role="contentinfo"` (implicit on `<footer>`), `aria-label` on the
`<footer>` (single instance), `role="list"` on `<ul>`, and any `aria-describedby` wiring on the
capability strip. The `<dl>` already carries the relationship. Redundant ARIA is a regression.

**Keyboard flow** is unchanged and correct: DOM order equals visual order at every breakpoint, no
`tabindex`, no `order`, no positive tab indices, and the new §2 ordering improves the sequence —
a keyboard user now reaches contact before the 13-link index rather than after it.

---

## 10. SEO

| # | Change | Why it fits *this* footer |
|---|---|---|
| S1 | Six `/dich-vu#<id>` anchors replacing six links to `/dich-vu` | Six commercially valuable Vietnamese phrases currently collapse into one credited anchor. Anchors give each a distinct target. |
| S2 | Complete `PostalAddress`: add `addressLocality`, `addressRegion`, `addressCountry: "VN"`, and `geo` | Currently only `name` + `streetAddress`. A two-location manufacturer with incomplete addresses is invisible to local pack. |
| S3 | Add `openingHoursSpecification` from `company.workingHours` | The hours are already **rendered in the DOM and absent from the schema** — free structured data being discarded. |
| S4 | Extend `sameAs` beyond the single Facebook URL as channels are added | Entity confidence scales with corroborating profiles. |
| S5 | Emit `Organization.foundingDate` **only when `company.foundingYear` is authored** | Conditional under F2. Never a placeholder in schema — a wrong `foundingDate` is worse than none. |

`buildOrganizationLd` in `app/composables/usePageSeo.ts` is the single edit point for S2–S5.

---

## 11. Design tokens

### 11.1 Added — four

```css
/* ── Typography ─────────────────────────────────────────────────────── */
/* A micro-label subordinate to an eyebrow, sitting above a value. Used by the
   contact <dl>, the locations band and the capability strip. The system used
   this role in three places and had never named it — which is exactly how
   --type-eyebrow came to serve two meanings and produce D1. */
--type-field-label-size:   0.6875rem;  /* 11px */
--type-field-label-weight: 500;
--type-field-label-track:  0.14em;

/* ── Spacing ────────────────────────────────────────────────────────── */
/* Heading -> the content it labels. NOT a new rhythm level: 24px is the level
   the contact <dl> already emits between pairs (item-gap doubled by dd + dt).
   At --footer-item-gap the heading was 1:1 with its own list items. */
--footer-label-gap: 1.5rem;   /* 24px */

/* Vertical separation between stacked blocks below md. --footer-col-gap is a
   HORIZONTAL column gap; vertical separation is a different perceptual problem
   and 48px was the same number by coincidence, not by system. Each block already
   opens with a wood-300 eyebrow, so 32px reads as a clear boundary. */
--footer-stack-gap: 2rem;     /* 32px */

/* The meta row's WRAP gap. It currently inherits --footer-col-gap, which puts
   48px between the copyright and the social links whenever the row wraps —
   a 90px row for two short strings. */
--footer-meta-row-gap: 1rem;  /* 16px */
```

### 11.2 Narrowed — one

`--footer-col-gap` (48px) keeps its value and **loses three of its four jobs**. It now means
*horizontal gap between columns* and nothing else. A token serving four semantics cannot be
correct for all four; the mobile meta row was where that became visible.

### 11.3 Rejected — two, with reasons

| Rejected | Why |
|---|---|
| **`--type-metric`** (32px / 700 for capability values) | §3.2. Breaks the flat value layer that *is* the premium signal, and the longer value string cannot set at 32px without wrapping to three lines anyway. |
| **`--footer-block-gap`** (proposed in the prior audit) | Only the **mobile stack** needed a value different from 48px. At `md+`, 48px between bands is unchallenged by any measurement. One new token (`--footer-stack-gap`), not two. A token with no evidence behind it is a hardcoded value with a nicer name. |

---

## 12. Commercial credibility & legal

**Everything legal goes in the meta row, at `--type-meta-sm` / `--fg-dark-subtle` — the quietest
layer in the footer.** No legal band, no boxed notice, no separator rule.

```
© 2026 Lai Huy Interior · MST 0000000000        Bảo mật · Điều khoản        ⓕ ⓩ
```

| Item | Placement | Note |
|---|---|---|
| Copyright | meta row, left | unchanged |
| **Business registration / tax code (MST)** | meta row, left, inline after the copyright, `·` separated | **Placeholder `0000000000` until authored (F2).** For a Vietnamese B2B contractor this is a first-order credibility marker to a procurement team — its absence reads as an unregistered operation. It costs zero extra rows. |
| **Privacy policy** (`/chinh-sach-bao-mat`) | meta row, right | new page required |
| **Terms** (`/dieu-khoan`) | meta row, right | new page required |
| Factory information | **already covered** — band 2 carries the factory address, band 1 carries its floor area and capacity | No new block. This is the elegance win: the factory is now described in three places that already existed. |
| Business hours | band 2, contact `<dl>` | unchanged position, plus S3 in schema |
| Company profile PDF | **deferred** | §13 |

Desktop cost: **zero additional rows.** Mobile cost: ~20px. That is how legal completeness is
bought without a legal-heavy footer — legal content is not *reduced*, it is *ranked* into the
layer the design already reserves for quiet information.

---

## 13. Additional opportunities — accepted, deferred, rejected

**Accepted (in this pass):**

- **Zalo** alongside Facebook in the meta row, as icons with `aria-label`. Zalo is the default
  B2B channel in Vietnam and its absence is a genuine functional gap, not a completeness box.
  Two icons, ~40px, no new band.

**Deferred (conditional-render when data exists — the F2 pattern):**

- **Company profile / capability statement PDF.** Genuinely valuable for procurement teams, who
  circulate documents internally. But **no asset exists**, and a download link that serves a thin
  or missing document damages credibility more than its absence. Ship behind
  `v-if="company.profilePdf"`, as a text link in band 1 beneath the CTA — never as a second button.
- **Certifications.** `company.certifications` is `undefined`. When authored, they join the
  capability strip as a third pair, not a logo row.

**Rejected:**

| Rejected | Why |
|---|---|
| Newsletter signup | An interior contractor's buyers do not subscribe to newsletters; they request quotes. It would be the loudest interactive element in the footer serving the lowest-value action. |
| Material library, FAQ, warranty, after-sales | Each is a real content need and **none is a footer problem.** Adding footer links to pages that do not exist recreates D3 in a new column. |
| Supplier registration | Legitimate for a manufacturer, but it serves vendors, not buyers. A footer optimising for the buyer should not spend its scarcest band on the supply side. Belongs on `/lien-he`. |
| Embedded Google Map | Weight and a third-party iframe against §12's rendering budget, to replace two links that already work. |
| Careers link | **Already present** in the nav column. |

---

## 14. Prioritised backlog

### Critical

| | |
|---|---|
| **C1 · Heading/label collision (D1)** | |
| Problem | `.footer-eyebrow` and `.footer-label` are byte-identical in size, weight, tracking and case; 12px apart; differ only in hue. "LIÊN HỆ / ĐIỆN THOẠI" reads as one two-line heading. |
| Reason | Destroys the contact column's hierarchy and puts structure behind colour alone (1.4.1). |
| Recommendation | `--type-field-label` (§4.1) + `--footer-label-gap` (§4.3). |
| UX impact | Contact column becomes scannable; the phone number stops being buried inside its own heading. |
| Business impact | Indirect — the phone number is the highest-intent element in the footer. |
| Complexity | **Low.** Three token declarations, one class edit, one margin change. |

| | |
|---|---|
| **C2 · Five links, one destination (D3)** | |
| Problem | 6 of 18 footer links resolve to `/dich-vu`; five carry specific anchor text the destination does not fulfil. |
| Reason | Broken user promise, anchor dilution, five wasted keyword opportunities, and a drifted duplicate data source. |
| Recommendation | `:id="service.id"` on `/dich-vu` cards; bind the column to `services`; delete `company.footerServices` (§5.1). |
| UX impact | Click lands on the promised content. |
| Business impact | Six commercial phrases become distinct crawl targets. |
| Complexity | **Low.** One attribute, one binding, one deletion, one `scroll-margin-top`. |

| | |
|---|---|
| **C3 · No legal or registration information** | |
| Problem | No privacy policy, no terms, no MST. |
| Reason | Legal exposure, and a hard filter for procurement-driven buyers. |
| Recommendation | Two pages; meta-row placement per §12. |
| UX impact | Small. |
| Business impact | **Removes a blocker for corporate clients.** |
| Complexity | **Medium** — page content is the work, not the footer. |

### High impact

| | |
|---|---|
| **H1 · Trust layer (D2)** | |
| Problem | 55% of band 1 is empty; the footer offers no evidence for its positioning claim. |
| Reason | Highest-attention band, doing the least work per pixel, in a category where buyer risk is the primary obstacle. |
| Recommendation | Bind `factoryCapabilities[0..1]` into a `<dl>` in the band's right half (§3). |
| UX impact | Band 1 becomes balanced; the claim becomes evidenced. |
| Business impact | **Highest in the backlog** — directly addresses the "is this contractor real" objection. |
| Complexity | **Low.** ~12 lines of template, one grid rule, **zero new data, zero new typography.** |

| | |
|---|---|
| **H2 · De-duplicate the closing region (D4)** | |
| Problem | Phone, email and `/lien-he` all appear twice inside 1,490px. |
| Recommendation | Remove `tel:`/`mailto:` from `.section-cta`; differentiate the footer CTA (§5.2, §8). |
| UX impact | One unambiguous conversion point per band. |
| Business impact | A footer CTA that addresses a different objection instead of repeating one already declined. |
| Complexity | **Low** for the band; **Medium** for the CTA — see the §8 dependency. |

| | |
|---|---|
| **H3 · Band merge + reorder (§2)** | |
| Problem | Locations and contact are two bands of the same idea; the index outranks both. |
| Recommendation | Merge into band 2 as **two horizontal rows** (§1), promote above the index. |
| UX impact | Reading order follows intent; the contact `<dl>` stops being a 241px column beside 49px cells; −80px mobile. |
| Business impact | Two facilities — the factory-direct proof — move into the confidence arc. |
| Complexity | **Low.** Markup move, one grid rule. |

| | |
|---|---|
| **H4 · Mobile compression (§6)** | |
| Recommendation | Nav 2-column grid, `--footer-stack-gap`, `--footer-meta-row-gap`, plus L1. |
| UX impact | −14% height with more content. |
| Business impact | Less scroll between a mobile user and the phone number. |
| Complexity | **Low**, except L1 (**Medium** — `<details>` styling). |

### Medium impact

- **M1 · Schema completion (S2–S5).** Local-pack visibility for a two-location business; single
  edit point. **Low** complexity, meaningful discovery upside.
- **M2 · External-link affordance (A3).** The string already exists and is unused here. **Low.**
- **M3 · Column weighting `1fr 1.4fr` (§7).** Removes ~290px of trapped void. **Low.**
- **M4 · Zalo (§13).** Real channel gap. **Low.**

### Low impact

- **L1 · Focus ring 1.6 → 2px (A4)** — AAA only, but it is the project's own declared token.
- **L2 · `<address>` + Services landmark (A2, A5)** — free semantics.
- **L3 · Delete or fix the top gradient.** Measured contrast between its stops is **1.096:1** —
  below the threshold of perception — while the edge it exists to soften (wood-50 → ink-900)
  measures **16.76:1** and is untouched. Either remove it as dead paint, or start it from a value
  that actually transitions. **Low** either way, and honest either way.

---

## 15. Implementation notes

1. **The component contract is unchanged.** `AppFooter.vue` stays purely presentational — no
   state, no composable, no lifecycle, no route awareness (§26.3, §30.2). Every change here is
   markup, tokens and data binding. `factoryCapabilities` and `services` are static imports, the
   same way `company` and `navLinks` already are.
2. **Import discipline.** The footer will import from `~/data/factory` and `~/data/services`. Both
   are static data modules with no side effects; this does not create a dependency cycle and does
   not breach the acyclic graph rule (§2).
3. **Order of work.** C1 → C2 → H1 → H3 → H2 → H4. C1 and C2 are independent and low-risk. H1
   depends on nothing. H3 must land before H4 (mobile measurements assume the merged band). H2's
   CTA half is gated on the §8 dependency and must not block the rest.
4. **Visual regression.** Every band boundary moves. Rebaseline `vr` snapshots for all eight
   pages at all breakpoints **after** H3, not before — H1/H3 both shift band geometry and
   rebaselining twice wastes a review cycle.
5. **Gates.** `alignment.spec.ts` must still pass unchanged — the `.shell` rail is untouched and
   the footer's left edge stays at the canonical 24/32px gutter. `a11y.spec.ts` should be extended
   with an assertion that `.footer-eyebrow` and `.footer-label` do **not** share computed
   `font-size` + `font-weight` + `letter-spacing`, so D1 cannot silently return.
6. **`--footer-py` is not touched.** Reducing it is the obvious way to buy mobile height and it is
   wrong: §29 fixes the 1.25–1.27× multiplier over `--section-py` deliberately, and the finale
   having less air than a body section is the exact defect Phase 6 fixed. Height comes from
   compression, not from the one value the spec derived.

---

## 16. Premium-feel assessment

Does the revised footer communicate the six qualities without decoration?

| | Before | After | By what mechanism |
|---|---|---|---|
| Craftsmanship | implied by the footer's own craft only | stated | `3.000 m²` + `50 phòng/tháng` are craft *capacity*, in the company's own authored words |
| Precision | ⚠️ contradicted by D1 and D3 | ✅ | A footer whose own labels collide cannot claim precision. Fixing D1/D3 is a credibility repair, not a polish task. |
| Factory-direct capability | claimed, unevidenced | evidenced three ways | floor area, monthly capacity, and a factory address — all pre-existing content, newly ranked |
| Attention to detail | ⚠️ | ✅ | five honest links replacing five misleading ones |
| Professional execution | ⚠️ no legal, no registration | ✅ | MST + policy links in the quietest layer |
| Long-term reliability | ❌ | ⚠️ **partial** | Genuinely limited until `foundingYear` and `certifications` are authored. **F2 forbids inventing them, and no layout decision can substitute.** This remains open, and it is a content task, not a design task. |

**Restraint held.** The pass adds **four tokens, one new type size, zero new colours, zero
shadows, zero gradients, zero icons except two social glyphs, and no new component vocabulary** —
the capability strip is the `<dl>` the footer already uses twice. Desktop height is flat
(1,032 → ~1,070px, **+4%**) and mobile falls ~15%, while the footer carries strictly more
information: two capability metrics, a tax code, two policy links and one more social channel.

That is the test this specification set itself: **not more content, but more value per pixel.**
The single change that best embodies it is H1 — it adds the footer's most important missing
content into space that already existed, using data that was already written, in a markup idiom
that was already there, at a type size that was already defined.
