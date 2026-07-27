# Gallery Editorial Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the masonry `AppGalleryGrid` in the project-detail Gallery section
(`app/pages/du-an/[slug].vue`) with a new editorial layout — a large image alternating with a
stacked pair of small images, in a repeating 3-image beat — without cropping any image and
without touching the shared masonry component used elsewhere.

**Architecture:** Two new presentational components (`AppGalleryEditorialCell.vue` for one
image's hover-to-enlarge treatment, `AppGalleryEditorial.vue` for the beat-grouping layout that
uses it) plus a one-tag swap in `[slug].vue`. No new data fields, no changes to `GalleryLightbox`,
no changes to `AppGalleryGrid` or its other two consumers.

**Tech Stack:** Nuxt 4 / Vue 3 `<script setup>` + Tailwind v4 utility classes, the existing
`MediaImage` and `Icon` components, `useLanguage()`.

**Design source:** `docs/superpowers/specs/2026-07-25-gallery-editorial-layout-design.md` (read
for background/rationale; this plan's code is the authoritative implementation of that spec).

## Global Constraints

- New files: `app/components/AppGalleryEditorialCell.vue`, `app/components/AppGalleryEditorial.vue`.
  Modified: `app/pages/du-an/[slug].vue` (Gallery section only — one component tag swap).
- Do not modify `app/components/AppGalleryGrid.vue`, `app/components/GalleryLightbox.vue`,
  `app/pages/gioi-thieu.vue`, `app/pages/nha-xuong.vue`, or `app/media/presets.ts`. These are
  explicitly out of scope per the design spec.
- No cropping — every image keeps its own `aspect-ratio` via inline `style`, exactly like
  `AppGalleryGrid` and the rest of `[slug].vue` already do (e.g. the Solution section's
  `leadImage`). No fixed-height grid cells, no `object-fit: cover` introduced anywhere here.
- Reuse the exact hover-overlay visual language `AppGalleryGrid` already uses (translucent
  `ink-950` wash, centered `i-lucide-maximize-2` icon in a white pill, `group-hover:scale-105`
  image zoom, `rounded-2xl`, `cursor-zoom-in`) — no new interaction vocabulary.
- No new Tailwind color tokens beyond what's already in `app/assets/css/main.css` (`ink-*`,
  `white`).
- Never use `any`.
- Before every commit: `pnpm typecheck` and `pnpm lint` must both pass clean.
- This page has a Playwright visual-regression baseline (`tests/e2e/visual.spec.ts`, page name
  `project-detail`, fixture slug `khach-san-eo-gio`). This change **will** fail those 4 snapshots
  until rebaselined — expected, not a bug. Per the precedent in
  `docs/superpowers/plans/2026-07-25-project-detail-storytelling.md`, rebaseline **scoped** to
  only the 4 `project-detail` snapshots (`playwright test --project=vr --update-snapshots -g
  "project-detail"`), verified via `git status` before committing — never the unscoped
  `pnpm test:vr:approve`, which would also silently rebaseline any other page failing for
  unrelated reasons at the time.

---

## File Structure

- Create: `app/components/AppGalleryEditorialCell.vue` — one image: the clickable
  aspect-ratio-preserving box, the hover overlay, the `select` emit. No layout/positioning
  decisions live here — a parent controls this component's width via a wrapping element.
- Create: `app/components/AppGalleryEditorial.vue` — groups `images` into repeating 3-image
  beats (1 large + up to 2 small), alternates which side the large image sits on, and renders
  each beat as a responsive flex row using `AppGalleryEditorialCell`.
- Modify: `app/pages/du-an/[slug].vue` — Gallery section (`id="gallery"`), swap the
  `<AppGalleryGrid>` tag for `<AppGalleryEditorial>`. No other line in the file changes.

---

### Task 1: Build the editorial gallery components and wire them into the page

**Files:**
- Create: `app/components/AppGalleryEditorialCell.vue`
- Create: `app/components/AppGalleryEditorial.vue`
- Modify: `app/pages/du-an/[slug].vue:624-630` (the `<AppGalleryGrid>` tag inside the Gallery
  section's `<Transition>`)

**Interfaces:**
- `AppGalleryEditorialCell` consumes: `image: MediaImage`, `index: number`,
  `preset: MediaPreset`, `selectable: boolean` (all required — the parent always knows these).
  Produces: `select: [index: number]` emit, forwarding its own `index` prop unchanged.
- `AppGalleryEditorial` consumes: `images: MediaImage[]`, `preset?: MediaPreset` (default
  `'gallery'`), `selectable?: boolean` (default `false`) — identical public shape to
  `AppGalleryGrid`. Produces: `select: [index: number]` emit — the index is always the image's
  position in the `images` prop array (not a beat-local or row-local index), so
  `GalleryLightbox`'s prev/next and thumbnail-strip order stay correct.

- [ ] **Step 1: Create `AppGalleryEditorialCell.vue`**

```vue
<script setup lang="ts">
// One image cell for AppGalleryEditorial: the image itself plus the site's standard
// hover-to-enlarge treatment — the same visual language AppGalleryGrid's cells already use, so
// the editorial layout introduces no new interaction vocabulary.
import type { MediaPreset } from '~/media/presets'
import type { MediaImage } from '~/shared/media/types'

type Props = {
  image: MediaImage
  index: number
  preset: MediaPreset
  selectable: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  select: [index: number]
}>()

const { t } = useLanguage()
</script>

<template>
  <component
    :is="props.selectable ? 'button' : 'div'"
    :type="props.selectable ? 'button' : undefined"
    class="group block w-full overflow-hidden rounded-2xl"
    :class="props.selectable ? 'cursor-zoom-in' : ''"
    :style="{ aspectRatio: `${props.image.width} / ${props.image.height}` }"
    :aria-label="props.selectable
      ? t({ vi: 'Phóng to ảnh', en: 'Enlarge image' })
      : undefined"
    @click="props.selectable && emit('select', props.index)"
  >
    <div class="relative h-full w-full">
      <MediaImage
        :image="props.image"
        :preset="props.preset"
        class="h-full w-full"
        :img-class="props.selectable
          ? 'transition-transform duration-500 ease-out group-hover:scale-105'
          : ''"
      />
      <div
        v-if="props.selectable"
        class="pointer-events-none absolute inset-0 flex items-center justify-center bg-ink-950/0 opacity-0 transition-all duration-300 group-hover:bg-ink-950/25 group-hover:opacity-100"
      >
        <span class="rounded-full bg-white/90 p-3 text-ink-950 shadow-lg">
          <Icon
            name="i-lucide-maximize-2"
            class="h-5 w-5"
          />
        </span>
      </div>
    </div>
  </component>
</template>
```

This is `AppGalleryGrid`'s existing per-item markup (`app/components/AppGalleryGrid.vue:30-64`),
extracted unchanged apart from becoming prop-driven instead of `v-for`-driven — same classes,
same structure, same aria-label string.

- [ ] **Step 2: Create `AppGalleryEditorial.vue`**

```vue
<script setup lang="ts">
// Editorial gallery: a large image alternating with a stacked pair of small images, in a
// repeating 3-image beat. Every image keeps its own aspect-ratio (no cropping) — the same
// principle AppGalleryGrid documents, applied under a different arrangement. Page-only: used
// exclusively by the project case-study Gallery section. AppGalleryGrid remains the shared
// masonry component for the About and Factory pages.
import type { MediaPreset } from '~/media/presets'
import type { MediaImage } from '~/shared/media/types'

type Props = {
  images: MediaImage[]
  preset?: MediaPreset
  selectable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  preset: 'gallery',
  selectable: false
})

const emit = defineEmits<{
  select: [index: number]
}>()

type Cell = { image: MediaImage, index: number }
type Beat = { large: Cell, smalls: Cell[], reverse: boolean }

// Groups images into 3-image beats in source order (position 0 = large, 1-2 = small). `index`
// on every cell is the image's absolute position in `props.images`, not a beat-local position —
// GalleryLightbox needs that absolute index for correct prev/next and thumbnail-strip order.
// The trailing beat degrades gracefully: 2 images left → large + one small; 1 image left → large
// only (the template's `v-if="beat.smalls.length"` skips the empty small column).
const beats = computed<Beat[]>(() => {
  const result: Beat[] = []
  for (let i = 0; i < props.images.length; i += 3) {
    const large: Cell = { image: props.images[i], index: i }
    const smalls: Cell[] = props.images
      .slice(i + 1, i + 3)
      .map((image, offset) => ({ image, index: i + 1 + offset }))
    result.push({ large, smalls, reverse: result.length % 2 === 1 })
  }
  return result
})
</script>

<template>
  <div class="flex flex-col gap-5">
    <div
      v-for="beat in beats"
      :key="beat.large.image.path"
      class="flex flex-col gap-5 md:flex-row"
      :class="beat.reverse ? 'md:flex-row-reverse' : ''"
    >
      <div class="w-full md:w-[58%]">
        <AppGalleryEditorialCell
          :image="beat.large.image"
          :index="beat.large.index"
          :preset="preset"
          :selectable="selectable"
          @select="emit('select', $event)"
        />
      </div>

      <div
        v-if="beat.smalls.length"
        class="flex flex-col gap-5 md:flex-1"
      >
        <AppGalleryEditorialCell
          v-for="small in beat.smalls"
          :key="small.image.path"
          :image="small.image"
          :index="small.index"
          :preset="preset"
          :selectable="selectable"
          @select="emit('select', $event)"
        />
      </div>
    </div>
  </div>
</template>
```

**Why `md:flex-1` and not bare `flex-1` on the small column:** the beat container is
`flex-col` below `md` and `md:flex-row` at `md`+. A bare `flex-1` would apply
`flex-grow`/`flex-basis` on whichever axis is currently the flex main axis — on mobile that's the
*vertical* axis, which would make the small-image column try to grow to fill vertical space in a
container that has no fixed height (the beat's height is just "however tall its content is").
Scoping it to `md:flex-1` means the property only ever applies once the container is actually a
row (`md:flex-row`), where growing to fill the remaining horizontal width (~42%, alongside the
large image's fixed `md:w-[58%]`) is exactly what's wanted. Below `md`, the column has no
flex-grow at all and just stacks at its natural content height — which, combined with the
large image at `w-full` (no `md:` prefix, so it applies below `md` too) and the small column
itself being `flex-col`, is what produces the mobile fallback: every image full-width, stacked,
in source order (large, small, small, next beat's large, …) — no separate mobile-specific
markup needed.

- [ ] **Step 3: Swap the component in the Gallery section**

In `app/pages/du-an/[slug].vue`, find (around line 624):

```html
        <Transition
          name="fade"
          mode="out-in"
        >
          <AppGalleryGrid
            :key="activeGalleryTab"
            :images="filteredGallery"
            selectable
            @select="openLightbox"
          />
        </Transition>
```

Replace with:

```html
        <Transition
          name="fade"
          mode="out-in"
        >
          <AppGalleryEditorial
            :key="activeGalleryTab"
            :images="filteredGallery"
            selectable
            @select="openLightbox"
          />
        </Transition>
```

Only the tag name changes — all three bindings (`:key`, `:images`, `selectable`, `@select`) stay
identical, since both components share the same public props/emit shape. Nothing else in
`[slug].vue` changes: not the section header, not the filter tabs, not `GalleryLightbox` at the
bottom of the file (it already consumes `filteredGallery` + an index, which is unchanged).

- [ ] **Step 4: Manual check**

Run `pnpm dev`, open `http://localhost:3000/du-an/khach-san-eo-gio` (30 images across several
gallery-group tabs — a good mix of beat sizes) and confirm, at a `md`+ viewport:
- Images render in a repeating pattern: 1 large + up to 2 stacked small, alternating which side
  the large image is on from one beat to the next.
- No image is cropped — every image shows its full frame at its native proportions.
- Clicking any image (large or small) opens `GalleryLightbox` at the correct photo, and
  prev/next/thumbnail-strip navigation moves through the images in the same order they appear in
  the grid.
- Switch to the "Studio room 1" tab (1 image) and confirm it renders as a single full-width large
  image with no small column. Switch to "Lobby" or "Signature single room" (3 images — exactly
  one full beat) and confirm it renders 1 large + 2 small with no partial-beat artifacts.
- Resize below `md` (or use a narrow viewport) and confirm every image collapses to full-width,
  single column, in source order (no large/small distinction).

- [ ] **Step 5: Typecheck, lint, commit**

```bash
pnpm typecheck
pnpm lint
git add app/components/AppGalleryEditorialCell.vue app/components/AppGalleryEditorial.vue app/pages/du-an/[slug].vue
git commit -m "feat(project-detail): replace gallery masonry with an editorial beat layout"
```

---

### Task 2: Full verification and VR rebaseline

**Why:** `AppGalleryEditorial` is new, algorithmic (beat grouping, alternating sides, partial-beat
degradation) and directly affects every project's Gallery section. This task is the gate that
confirms it renders correctly across different gallery sizes/shapes before calling the work done,
and produces the required, correctly-scoped VR rebaseline.

**Files:** none (verification only).

- [ ] **Step 1: Full build**

```bash
pnpm build
```

Expected: exits 0.

- [ ] **Step 2: Cross-project manual sweep**

With `pnpm dev` running, check in the browser (both `vi` and `en` via the language toggle):

- `/du-an/khach-san-eo-gio` — re-confirm Task 1 Step 4's checks (large gallery, multiple tabs
  including the 1-image and 3-image edge cases) in both locales.
- `/du-an/nha-ta-dung` — one of the 9 projects with no `galleryLabels` entry (a flat gallery,
  `hasGalleryGroups` false — confirmed via `grep -c galleryLabels app/data/projects.ts`, only
  `khach-san-eo-gio` and `codi-boutique-hotel` have grouped galleries). Confirm the beat layout
  renders correctly with no tabs to switch (just the ungrouped image list).
- Confirm the browser console shows no new errors on either page.

- [ ] **Step 3: Accessibility spot-check**

```bash
pnpm exec playwright test tests/e2e/a11y.spec.ts
```

Expected: the `vr` (chromium) project passes for all 8 pages, same as the pre-existing baseline
(the `vr-webkit` project is known to fail in this environment due to a missing browser binary,
unrelated to this change — do not attempt to fix that here).

- [ ] **Step 4: Visual regression — expected diff, then scoped approval**

```bash
pnpm test:vr
```

Expected: fails on the 4 `project-detail-*` screenshots (390/768/1440 full-page + header-scrolled)
— this is the intended result of Task 1, not a bug. If any *other* page's snapshot fails, view its
actual/diff images (`test-results/<test-name>/`) before deciding what to do — per the precedent
in the prior plan, a page unrelated to this change failing is not automatically a regression here
(this environment has shown pre-existing flaky baselines before), but it must be looked at, not
assumed away.

Once confirmed the only *real* changes are the 4 project-detail snapshots, rebaseline **only**
those:

```bash
pnpm exec playwright test --project=vr --update-snapshots -g "project-detail" tests/e2e/visual.spec.ts
```

- [ ] **Step 5: Commit the rebaselined snapshots**

```bash
git status --porcelain -- tests/
```

Confirm this shows exactly the 4 `project-detail-*.png` files under
`tests/e2e/visual.spec.ts-snapshots/` and nothing else. Then:

```bash
git add tests/e2e/visual.spec.ts-snapshots/project-detail-390-vr-win32.png tests/e2e/visual.spec.ts-snapshots/project-detail-768-vr-win32.png tests/e2e/visual.spec.ts-snapshots/project-detail-1440-vr-win32.png tests/e2e/visual.spec.ts-snapshots/project-detail-header-scrolled-vr-win32.png
git commit -m "test(vr): rebaseline project-detail for the editorial gallery layout"
```

---

## Self-Review

- **Spec coverage:** every section of the design spec (`2026-07-25-gallery-editorial-layout-design.md`)
  maps to Task 1: the component API (Step 1-2), the beat algorithm including alternation and
  partial-beat degradation (Step 2), the responsive collapse (Step 2's `md:flex-1` explanation),
  the integration point (Step 3), and the edge cases (Step 4's manual checks — 0 images is a
  non-issue since the page-level `v-if="allImages.length"` guard already prevents mounting the
  component with an empty array, same as the spec notes).
- **Deviation from the spec, disclosed:** the spec named one new component
  (`AppGalleryEditorial.vue`); this plan splits it into two (`AppGalleryEditorial.vue` +
  `AppGalleryEditorialCell.vue`) to avoid duplicating the ~20-line image-cell markup between the
  large slot and the small-column `v-for`, per this codebase's own "avoid duplicated logic" rule
  and its established convention of one Nuxt-auto-imported component per file (matching how
  `AppGalleryGrid` and `GalleryLightbox` are already split out as their own files rather than
  inlined into pages). This is an internal structural choice — it changes neither the public
  component's API, its rendered behavior, nor which other pages/files are touched, so it does not
  reopen the approved design.
- **Type consistency:** `AppGalleryEditorialCell`'s props (`image: MediaImage`, `index: number`,
  `preset: MediaPreset`, `selectable: boolean`) are all required (the parent, `AppGalleryEditorial`,
  always supplies them from its own already-defaulted props), while `AppGalleryEditorial`'s own
  props keep the same optional-with-defaults shape (`preset?`, `selectable?`) as `AppGalleryGrid`,
  so the drop-in swap in Task 1 Step 3 needs no prop changes at the call site.
