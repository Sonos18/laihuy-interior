# Gallery Editorial Layout — Design Spec

## Goal

Redesign the Gallery section on the project case-study page (`app/pages/du-an/[slug].vue`) from
a uniform 2-column masonry grid into an editorial, non-uniform layout — a large image alternating
with a pair of small images in a repeating rhythm — while preserving the site's existing
no-crop-images principle and the lightbox interaction.

## Scope

**In scope:** a new component, `app/components/AppGalleryEditorial.vue`, used only by the Gallery
section of `app/pages/du-an/[slug].vue`.

**Out of scope:** `app/components/AppGalleryGrid.vue`, the shared masonry component, is left
completely untouched. It continues to serve `app/pages/gioi-thieu.vue` (About) and
`app/pages/nha-xuong.vue` (Factory) exactly as it does today. This was an explicit scoping
decision — the user chose "page-only" over "shared component" specifically so this redesign
would not change those two other pages.

Also out of scope: `GalleryLightbox.vue` (unchanged — the new grid emits the same `select: [index]`
event the lightbox already consumes), the Gallery section's header/tabs UI in `[slug].vue`
(eyebrow, heading, filter-by-group tab buttons — unchanged), and `app/media/presets.ts` (no new
preset added; the new component reuses the existing `gallery` preset, same as today).

## Background

The current Gallery section (`app/pages/du-an/[slug].vue`, section `id="gallery"`) renders
`AppGalleryGrid`, a CSS multi-column masonry: 1 column on mobile, 2 on `md+`. Every image keeps
its natural `aspect-ratio` (no cropping — this is a deliberate, commented principle in the
existing component: "Aspect-ratio-respecting gallery... no cropping"). Images fill columns
top-to-bottom in source order. Clicking an image (when `selectable`) emits `select` with the
image's index in the currently-filtered array, which `[slug].vue` uses to open
`GalleryLightbox` at that index.

This produces a clean, gap-free layout, but every image reads at the same visual weight — there
is no editorial "this photograph matters more" moment anywhere in the grid.

## Design

### New component: `AppGalleryEditorial.vue`

Same public interface as `AppGalleryGrid`, so integrating it is a drop-in replacement:

```ts
type Props = {
  images: MediaImage[]
  preset?: MediaPreset   // defaults to 'gallery', same default as AppGalleryGrid
  selectable?: boolean   // defaults to false, same default as AppGalleryGrid
}
defineEmits<{ select: [index: number] }>()
```

### Layout algorithm — repeating 3-image beat

Images are grouped into consecutive beats of 3, **in the order they appear in the `images`
prop** (the prop's order is not changed — only presentation groups it):

- Position 0 of a beat → **large** image.
- Positions 1 and 2 of a beat → **small** images, stacked vertically beside the large one.

At `md` and above, each beat renders as one flex row:
- Large image: ~58% of row width.
- Small-image column: ~42% of row width, the (up to) two small images stacked with a gap between
  them.

Every image keeps its own `aspect-ratio` (via inline `style`, same technique already used
elsewhere in `[slug].vue`, e.g. the Solution section's `leadImage`). No image is cropped, and no
fixed-height grid cell is used. Because the large image and the two-stacked-small-images column
are very unlikely to sum to exactly the same height, **each row's bottom edge is naturally
ragged** — this is intentional (an editorial/photo-book rhythm), not a bug, and was confirmed
with the user as an accepted trade-off of keeping the no-crop principle.

**Alternating side:** even-indexed beats (0th, 2nd, 4th, …) place the large image on the left and
the small column on the right; odd-indexed beats place the large image on the right. This mirrors
the existing alternation already used by the "Experience walkthrough" section a few sections
below Gallery in the same file (`index % 2 === 1 ? 'md:[&>figure]:order-last' : ''`) — reusing an
established pattern rather than inventing a new one.

**Partial trailing beat:** if the image count isn't a multiple of 3, the last beat degrades
gracefully:
- 2 images remaining → 1 large + 1 small (the small column has one image instead of two).
- 1 image remaining → a single full-width large image, no small column.

### Responsive behavior

Below `md`, the large/small distinction collapses: every image renders full-width, stacked in a
single column, in source order — there is no room for a large image beside a small column on a
narrow viewport. This mirrors `AppGalleryGrid`'s own mobile fallback (`columns-1 md:columns-2`).

### Interaction — unchanged from `AppGalleryGrid`

- Hover state: same overlay (translucent dark wash + centered "maximize" icon), same
  `group-hover:scale-105` image zoom, same `rounded-2xl` corners, same `cursor-zoom-in` — the
  goal is zero new interaction vocabulary, only a new arrangement of the same visual language.
- Click emits `select` with the image's **absolute index in the `images` prop array** — not an
  index relative to its position within a beat or a row. This is required for
  `GalleryLightbox`'s prev/next navigation and its thumbnail strip to stay in the same order the
  grid displays, exactly as they do today with `AppGalleryGrid`.
- `aria-label` on each clickable image: reuses the same `t({ vi: 'Phóng to ảnh', en: 'Enlarge
  image' })` string as `AppGalleryGrid`.

### Integration point

In `app/pages/du-an/[slug].vue`, the Gallery section (`id="gallery"`) currently renders:

```html
<Transition name="fade" mode="out-in">
  <AppGalleryGrid
    :key="activeGalleryTab"
    :images="filteredGallery"
    selectable
    @select="openLightbox"
  />
</Transition>
```

This becomes:

```html
<Transition name="fade" mode="out-in">
  <AppGalleryEditorial
    :key="activeGalleryTab"
    :images="filteredGallery"
    selectable
    @select="openLightbox"
  />
</Transition>
```

No other part of the Gallery section (eyebrow, heading, filter tabs, the `Transition` wrapper, the
`:key` that re-triggers the fade on tab switch) changes. `GalleryLightbox` at the bottom of
`[slug].vue` is untouched — it already consumes `filteredGallery` and an index, which is exactly
what the new component still provides.

### Edge cases

- **0 images:** the Gallery `<section>` already has `v-if="allImages.length"` at the page level,
  so `AppGalleryEditorial` is never mounted with an empty array. No empty-state handling needed
  inside the component itself.
- **1–2 images (a project with a very small gallery, or a filtered tab with few images):** handled
  by the partial-trailing-beat rule above — degrades to a single large image or large+small, never
  an empty or broken row.
- **Tab switching:** `filteredGallery` changes when the user clicks a different gallery-group tab;
  the existing `:key="activeGalleryTab"` on the `Transition` already forces
  `AppGalleryEditorial` to remount, so the beat grouping recomputes cleanly from the new array —
  no stale layout state carried across tab switches.

## What does NOT change

- `AppGalleryGrid.vue` — byte-for-byte untouched.
- `app/pages/gioi-thieu.vue`, `app/pages/nha-xuong.vue` — untouched; both keep using
  `AppGalleryGrid`.
- `GalleryLightbox.vue` — untouched.
- `app/media/presets.ts` — untouched; no new preset.
- The Gallery section's header, eyebrow, heading, and filter-tab UI in `[slug].vue` — untouched.

## Testing

This page's coverage is Playwright visual-regression (`tests/e2e/visual.spec.ts`, page name
`project-detail`) plus the a11y suite (`tests/e2e/a11y.spec.ts`) — there is no unit-test harness
for this template's markup, consistent with how the rest of `[slug].vue` is tested. Verification
plan (to be detailed in the implementation plan):
- Manual sweep across at least one project with a large gallery (30 images, multiple gallery-group
  tabs, e.g. `khach-san-eo-gio`) and one with a small gallery (≤2 images in some tab, if one
  exists) — check beat grouping, alternating sides, ragged-bottom rows, and the partial-trailing-
  beat cases.
- Confirm lightbox opens at the correct image and prev/next/thumbnail-strip order is unchanged.
- `pnpm exec playwright test tests/e2e/a11y.spec.ts` — no new WCAG violations.
- `pnpm test:vr` — this will fail the 4 `project-detail` VR snapshots (expected); rebaseline
  scoped to those 4 files only, per the precedent set in the prior `project-detail-storytelling`
  plan (`docs/superpowers/plans/2026-07-25-project-detail-storytelling.md`).
- `pnpm typecheck` and `pnpm lint` clean before each commit.
