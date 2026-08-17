# Shared Spotlight Gallery Carousel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the project-detail editorial image stack with a reusable three-position spotlight carousel that loops infinitely, advances every five seconds, and shows room/function filters only for eligible large galleries.

**Architecture:** Pure index/position helpers live in `app/utils/gallery-carousel.ts` and are covered by Vitest. `AppGalleryCarousel.vue` owns active-slide, autoplay and pointer/focus state; `AppGalleryCarouselSlide.vue` renders one accessible fixed-frame image. The project-detail page continues to own media grouping, filter selection and lightbox state, and passes only the current image array plus external pause state to the shared carousel.

**Tech Stack:** Nuxt 4.3.1, Vue 3.5.28 Composition API, TypeScript 5.9.3, Tailwind CSS 4.1.18, Nuxt Image through `MediaImage`, Vitest 4.1.9, Playwright 1.61.1.

## Global Constraints

- Use pnpm 10.29.3 and Node 22; do not install or upgrade dependencies.
- The carousel interval is exactly `5000ms` by default.
- The centre card uses 56% of the desktop gallery viewport; side cards are smaller and clickable.
- Carousel frames use a fixed landscape aspect ratio and `object-cover`; the existing lightbox displays the original image.
- Autoplay pauses for hover, focus, drag/swipe, page visibility, lightbox state and explicit visitor pause.
- With `prefers-reduced-motion: reduce`, autoplay is disabled and movement is minimal.
- Filters render only when eligible media count is greater than `10` and valid room/function groups exist.
- Do not duplicate images for one- or two-image galleries.
- Keep all UI labels bilingual and typed; use `MediaImage` and generated media records, never raw media URLs.
- Do not change `AppGalleryGrid`, `GalleryLightbox`, media presets, generated media files, unrelated image grids or other project-detail chapters.
- Do not update committed visual snapshots without separate explicit approval.
- Do not commit, push or alter branches during execution unless the user separately requests it. Replace every commit checkpoint below with a diff/status review.

---

## File Structure

### Create

- `app/utils/gallery-carousel.ts` — pure wrapped-index and visible-position functions.
- `app/components/AppGalleryCarousel.vue` — shared carousel state, controls, autoplay and gestures.
- `app/components/AppGalleryCarouselSlide.vue` — one fixed-frame accessible carousel card.
- `tests/gallery-carousel.test.ts` — unit coverage for circular index and sparse-gallery rules.
- `tests/e2e/project-gallery-carousel.spec.ts` — focused browser coverage for geometry, controls, autoplay, filters, lightbox and responsive boundaries.

### Modify

- `app/data/ui.ts` — bilingual carousel control labels.
- `app/pages/du-an/[slug].vue` — filter threshold, shared carousel integration and lightbox pause binding.

### Delete after reference verification

- `app/components/AppGalleryEditorial.vue` — superseded project-only beat layout.
- `app/components/AppGalleryEditorialCell.vue` — superseded beat-layout cell.

### Preserve

- `app/components/AppGalleryGrid.vue` — distinct masonry primitive, currently unused by pages.
- `app/components/GalleryLightbox.vue` — existing full-image viewer and image-order contract.

---

### Task 1: Lock Circular Index and Sparse-Gallery Semantics

**Files:**

- Create: `tests/gallery-carousel.test.ts`
- Create: `app/utils/gallery-carousel.ts`

**Interfaces:**

- Produces: `GallerySlidePosition`, `wrapGalleryIndex(index, length)`, `gallerySlidePosition(index, activeIndex, length)`.
- Consumed by: `AppGalleryCarousel.vue` in Task 2.

- [ ] **Step 1: Write the failing unit tests**

Create `tests/gallery-carousel.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import {
  gallerySlidePosition,
  wrapGalleryIndex
} from '../app/utils/gallery-carousel'

describe('wrapGalleryIndex', () => {
  it('wraps both ends and stays safe for an empty gallery', () => {
    expect(wrapGalleryIndex(-1, 5)).toBe(4)
    expect(wrapGalleryIndex(5, 5)).toBe(0)
    expect(wrapGalleryIndex(7, 5)).toBe(2)
    expect(wrapGalleryIndex(0, 0)).toBe(0)
  })
})

describe('gallerySlidePosition', () => {
  it('exposes previous, active and next positions for a circular gallery', () => {
    expect(gallerySlidePosition(4, 0, 5)).toBe('previous')
    expect(gallerySlidePosition(0, 0, 5)).toBe('active')
    expect(gallerySlidePosition(1, 0, 5)).toBe('next')
    expect(gallerySlidePosition(2, 0, 5)).toBe('offstage')
  })

  it('does not duplicate a second image into both side positions', () => {
    expect(gallerySlidePosition(0, 0, 2)).toBe('active')
    expect(gallerySlidePosition(1, 0, 2)).toBe('next')
    expect(gallerySlidePosition(1, 1, 2)).toBe('active')
    expect(gallerySlidePosition(0, 1, 2)).toBe('previous')
  })

  it('renders a one-image gallery as active only', () => {
    expect(gallerySlidePosition(0, 0, 1)).toBe('active')
  })
})
```

- [ ] **Step 2: Run the test and verify the red state**

Run:

```powershell
pnpm exec vitest run tests/gallery-carousel.test.ts
```

Expected: non-zero exit because `app/utils/gallery-carousel.ts` does not exist.

- [ ] **Step 3: Implement the minimal pure helpers**

Create `app/utils/gallery-carousel.ts`:

```ts
export type GallerySlidePosition = 'previous' | 'active' | 'next' | 'offstage'

export const wrapGalleryIndex = (index: number, length: number): number => {
  if (length <= 0) return 0
  return ((index % length) + length) % length
}

export const gallerySlidePosition = (
  index: number,
  activeIndex: number,
  length: number
): GallerySlidePosition => {
  if (length <= 0) return 'offstage'

  const active = wrapGalleryIndex(activeIndex, length)
  if (index === active) return 'active'

  if (length === 2) {
    return active === 0 ? 'next' : 'previous'
  }

  if (index === wrapGalleryIndex(active - 1, length)) return 'previous'
  if (index === wrapGalleryIndex(active + 1, length)) return 'next'
  return 'offstage'
}
```

- [ ] **Step 4: Run the focused unit test**

Run:

```powershell
pnpm exec vitest run tests/gallery-carousel.test.ts
```

Expected: exit `0`, all tests pass.

- [ ] **Step 5: Review the task diff without committing**

Run:

```powershell
git diff --check
git status --short
git diff -- app/utils/gallery-carousel.ts tests/gallery-carousel.test.ts
```

Expected: only the two Task 1 files plus the already approved spec/plan are new; no generated files or unrelated changes.

---

### Task 2: Build the Manual Shared Spotlight Carousel

**Files:**

- Modify: `app/data/ui.ts`
- Create: `app/components/AppGalleryCarouselSlide.vue`
- Create: `app/components/AppGalleryCarousel.vue`
- Create: `tests/e2e/project-gallery-carousel.spec.ts`
- Modify: `app/pages/du-an/[slug].vue`
- Delete: `app/components/AppGalleryEditorial.vue`
- Delete: `app/components/AppGalleryEditorialCell.vue`

**Interfaces:**

- Consumes: `gallerySlidePosition` and `wrapGalleryIndex` from Task 1.
- Produces:

```ts
type Props = {
  images: MediaImage[]
  preset?: MediaPreset
  selectable?: boolean
  autoplayMs?: number
  paused?: boolean
}

type Emits = {
  select: [index: number]
  change: [index: number]
}
```

- The component must expose `data-gallery-carousel`, `data-gallery-viewport`, `data-gallery-slide`, `data-gallery-position`, `data-gallery-index` and `data-gallery-active-index` for deterministic browser checks.

- [ ] **Step 1: Write failing browser coverage for geometry and manual controls**

Create `tests/e2e/project-gallery-carousel.spec.ts`. Reuse the same local-image interception pattern as `tests/e2e/project-detail-editorial.spec.ts` so the test does not depend on Supabase:

```ts
import type { Page } from '@playwright/test'
import { expect, test } from './fixtures'

const TEST_ORIGIN = process.env.PROJECT_DETAIL_TEST_ORIGIN ?? 'http://localhost:3000'
const TRANSPARENT_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M/wHwAF/gL+X9j7WQAAAABJRU5ErkJggg==',
  'base64'
)

async function openProject(page: Page, path: string, width = 1280) {
  await page.route('**/*', async (route) => {
    if (route.request().resourceType() === 'image') {
      await route.fulfill({ status: 200, contentType: 'image/png', body: TRANSPARENT_PNG })
      return
    }
    await route.continue()
  })
  await page.setViewportSize({ width, height: 900 })
  await page.goto(new URL(path, TEST_ORIGIN).toString(), { waitUntil: 'load' })
  await page.waitForFunction(() => Boolean(
    (document.querySelector('#__nuxt') as HTMLElement & { __vue_app__?: unknown })?.__vue_app__
  ))
}

test('gallery shows a dominant centre image and circular manual navigation', async ({ page }) => {
  await openProject(page, '/du-an/khach-san-eo-gio')

  const carousel = page.locator('[data-gallery-carousel]')
  await expect(carousel).toBeVisible()
  await expect(carousel.locator('[data-gallery-position="previous"]')).toHaveCount(1)
  await expect(carousel.locator('[data-gallery-position="active"]')).toHaveCount(1)
  await expect(carousel.locator('[data-gallery-position="next"]')).toHaveCount(1)

  const active = await carousel.locator('[data-gallery-position="active"]').boundingBox()
  const previous = await carousel.locator('[data-gallery-position="previous"]').boundingBox()
  const next = await carousel.locator('[data-gallery-position="next"]').boundingBox()
  expect(active!.width).toBeGreaterThan(previous!.width)
  expect(active!.width).toBeGreaterThan(next!.width)

  const total = Number(await carousel.getAttribute('data-gallery-count'))
  await carousel.getByRole('button', { name: 'Ảnh trước' }).click()
  await expect(carousel).toHaveAttribute('data-gallery-active-index', String(total - 1))
  await carousel.getByRole('button', { name: 'Ảnh tiếp theo' }).click()
  await expect(carousel).toHaveAttribute('data-gallery-active-index', '0')
})

test('side images activate while the centre image opens the matching lightbox item', async ({ page }) => {
  await openProject(page, '/du-an/khach-san-eo-gio')
  const carousel = page.locator('[data-gallery-carousel]')

  await carousel.locator('[data-gallery-position="next"] button').click()
  await expect(carousel).toHaveAttribute('data-gallery-active-index', '1')
  await carousel.locator('[data-gallery-position="active"] button').click()

  const dialog = page.getByRole('dialog', { name: 'Trình xem ảnh' })
  await expect(dialog).toBeVisible()
  await expect(dialog.getByText(/^2 \/ \d+$/)).toBeVisible()
})
```

- [ ] **Step 2: Build production output before the first browser red run**

Run:

```powershell
pnpm build
```

Expected: exit `0`. This gives Playwright the current production server output.

- [ ] **Step 3: Run the new browser tests and verify the red state**

Run:

```powershell
pnpm exec playwright test --project=vr tests/e2e/project-gallery-carousel.spec.ts -g "dominant centre|side images"
```

Expected: non-zero exit because `[data-gallery-carousel]` and its controls do not exist.

- [ ] **Step 4: Add typed bilingual control labels**

Add this sibling object inside `uiText` in `app/data/ui.ts`:

```ts
galleryCarousel: {
  region: { vi: 'Bộ sưu tập hình ảnh', en: 'Image gallery' },
  previous: { vi: 'Ảnh trước', en: 'Previous image' },
  next: { vi: 'Ảnh tiếp theo', en: 'Next image' },
  pause: { vi: 'Tạm dừng trình chiếu', en: 'Pause slideshow' },
  play: { vi: 'Tiếp tục trình chiếu', en: 'Resume slideshow' },
  enlarge: { vi: 'Phóng to ảnh', en: 'Enlarge image' },
  image: { vi: 'Ảnh', en: 'Image' }
},
```

- [ ] **Step 5: Implement one accessible slide**

Create `app/components/AppGalleryCarouselSlide.vue` with these exact responsibilities:

```vue
<script setup lang="ts">
import { uiText } from '~/data/ui'
import type { MediaPreset } from '~/media/presets'
import type { GallerySlidePosition } from '~/utils/gallery-carousel'
import type { MediaImage } from '~/shared/media/types'

const props = defineProps<{
  image: MediaImage
  index: number
  total: number
  position: GallerySlidePosition
  preset: MediaPreset
  selectable: boolean
}>()

const emit = defineEmits<{ activate: [index: number] }>()
const { t } = useLanguage()
const isVisible = computed(() => props.position !== 'offstage')
const isActive = computed(() => props.position === 'active')
const accessibleName = computed(() => isActive.value && props.selectable
  ? `${t(uiText.galleryCarousel.enlarge)} · ${t(uiText.galleryCarousel.image)} ${props.index + 1} / ${props.total}`
  : `${t(uiText.galleryCarousel.image)} ${props.index + 1} / ${props.total}`)
</script>

<template>
  <article
    data-gallery-slide
    :data-gallery-position="position"
    :data-gallery-index="index"
    class="gallery-carousel-slide absolute left-1/2 top-1/2 aspect-[16/10] overflow-hidden rounded-2xl"
    :aria-hidden="!isVisible"
  >
    <button
      type="button"
      class="group h-full w-full cursor-pointer overflow-hidden rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-wood-500"
      :tabindex="isVisible ? 0 : -1"
      :aria-label="accessibleName"
      @click="emit('activate', index)"
    >
      <MediaImage
        :image="image"
        :preset="preset"
        class="h-full w-full"
        img-class="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transition-none"
      />
      <span
        v-if="isActive && selectable"
        aria-hidden="true"
        class="pointer-events-none absolute bottom-4 right-4 rounded-full bg-white/90 p-3 text-ink-950 shadow-lg"
      >
        <Icon name="i-lucide-maximize-2" class="h-5 w-5" />
      </span>
    </button>
  </article>
</template>
```

The scoped CSS positioning belongs in the parent so every position is defined in one place.

- [ ] **Step 6: Implement manual carousel state, controls and responsive positioning**

Create `app/components/AppGalleryCarousel.vue`. Use this state and event skeleton:

```ts
import { uiText } from '~/data/ui'
import type { MediaPreset } from '~/media/presets'
import type { MediaImage } from '~/shared/media/types'
import {
  gallerySlidePosition,
  wrapGalleryIndex
} from '~/utils/gallery-carousel'

type Props = {
  images: MediaImage[]
  preset?: MediaPreset
  selectable?: boolean
  autoplayMs?: number
  paused?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  preset: 'gallery',
  selectable: false,
  autoplayMs: 5000,
  paused: false
})
const emit = defineEmits<{ select: [index: number], change: [index: number] }>()
const { t } = useLanguage()
const root = ref<HTMLElement>()
const activeIndex = ref(0)
const suppressClick = ref(false)

const positionFor = (index: number) =>
  gallerySlidePosition(index, activeIndex.value, props.images.length)

const goTo = (index: number) => {
  const next = wrapGalleryIndex(index, props.images.length)
  if (next === activeIndex.value) return
  activeIndex.value = next
  emit('change', next)
}
const previous = () => goTo(activeIndex.value - 1)
const next = () => goTo(activeIndex.value + 1)
const activate = (index: number) => {
  if (suppressClick.value) return
  if (index === activeIndex.value && props.selectable) emit('select', index)
  else goTo(index)
}

watch(() => props.images, () => { activeIndex.value = 0 })
```

The template must:

- render nothing for an empty array;
- expose the required data attributes;
- use `role="region"` and `aria-roledescription="carousel"`;
- render every image once and assign one of the four logical positions;
- render previous/next controls only for `images.length > 1`;
- render `current / total` status;
- handle `ArrowLeft` and `ArrowRight` on the root;
- leave a pause/play control placeholder for Task 3 only after its behaviour exists.

Use scoped CSS with these contracts:

```css
.gallery-carousel-viewport {
  height: clamp(13rem, 50vw, 29rem);
}

.gallery-carousel-slide {
  width: 82%;
  transform: translate(-50%, -50%) scale(0.62);
  opacity: 0;
  pointer-events: none;
  transition: transform 650ms cubic-bezier(0.22, 1, 0.36, 1), opacity 450ms ease;
}

.gallery-carousel-slide[data-gallery-position='active'] {
  z-index: 3;
  transform: translate(-50%, -50%) scale(1);
  opacity: 1;
  pointer-events: auto;
}

.gallery-carousel-slide[data-gallery-position='previous'] {
  z-index: 2;
  transform: translate(-112%, -50%) scale(0.68);
  opacity: 0.78;
  pointer-events: auto;
}

.gallery-carousel-slide[data-gallery-position='next'] {
  z-index: 2;
  transform: translate(12%, -50%) scale(0.68);
  opacity: 0.78;
  pointer-events: auto;
}

@media (min-width: 768px) {
  .gallery-carousel-viewport { height: clamp(21rem, 39vw, 29rem); }
  .gallery-carousel-slide { width: 64%; }
  .gallery-carousel-slide[data-gallery-position='previous'] {
    transform: translate(-116%, -50%) scale(0.72);
  }
  .gallery-carousel-slide[data-gallery-position='next'] {
    transform: translate(16%, -50%) scale(0.72);
  }
}

@media (min-width: 1280px) {
  .gallery-carousel-slide { width: 56%; }
}

@media (prefers-reduced-motion: reduce) {
  .gallery-carousel-slide { transition-duration: 1ms; }
}
```

Adjust only transform offsets if boundary testing shows clipping or overlap that prevents side-card activation. Preserve 56% desktop centre width and the no-document-overflow contract.

- [ ] **Step 7: Integrate the shared carousel into every project detail**

Replace `AppGalleryEditorial` in `app/pages/du-an/[slug].vue`:

```vue
<AppGalleryCarousel
  :key="activeGalleryTab"
  :images="filteredGallery"
  selectable
  :paused="lightboxOpen"
  @select="openLightbox"
/>
```

Keep the existing transition, filter bar, `filteredGallery`, `openLightbox` and `GalleryLightbox` ownership unchanged in this task.

- [ ] **Step 8: Verify old components are unreferenced, then delete them**

Run:

```powershell
rg -n "AppGalleryEditorial|AppGalleryEditorialCell" app tests
```

Expected before deletion: only definitions/comments remain; no page or test consumes them. Delete both files with `apply_patch`, then run the same command again and expect no matches.

- [ ] **Step 9: Build and run the focused manual-carousel tests**

Run:

```powershell
pnpm build
pnpm exec playwright test --project=vr tests/e2e/project-gallery-carousel.spec.ts -g "dominant centre|side images"
```

Expected: both commands exit `0`; three positions exist, the centre is larger, wrapping works and the matching lightbox image opens.

- [ ] **Step 10: Review the task diff without committing**

Run:

```powershell
git diff --check
git status --short
git diff -- app/data/ui.ts app/components app/pages/du-an tests/e2e/project-gallery-carousel.spec.ts
```

Expected: only scoped gallery files plus approved docs and Task 1 files.

---

### Task 3: Add Five-Second Autoplay, Pause Control and Gestures

**Files:**

- Modify: `app/components/AppGalleryCarousel.vue`
- Modify: `tests/e2e/project-gallery-carousel.spec.ts`

**Interfaces:**

- Consumes: `autoplayMs?: number` and `paused?: boolean` props defined in Task 2.
- Produces: autoplay state exposed through `data-gallery-autoplay="running|paused|disabled"` and a bilingual pause/play button.

- [ ] **Step 1: Add failing tests for autoplay and visitor control**

Add tests that opt out of the suite fixture's default reduced-motion mode before navigation:

```ts
test('autoplay advances after five seconds and explicit pause stops it', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await openProject(page, '/du-an/khach-san-eo-gio')
  const carousel = page.locator('[data-gallery-carousel]')

  await expect(carousel).toHaveAttribute('data-gallery-active-index', '0')
  await page.waitForTimeout(4800)
  await expect(carousel).toHaveAttribute('data-gallery-active-index', '0')
  await expect.poll(
    () => carousel.getAttribute('data-gallery-active-index'),
    { timeout: 900 }
  ).toBe('1')

  await carousel.getByRole('button', { name: 'Tạm dừng trình chiếu' }).click()
  const pausedAt = await carousel.getAttribute('data-gallery-active-index')
  await page.waitForTimeout(5500)
  await expect(carousel).toHaveAttribute('data-gallery-active-index', pausedAt!)
  await expect(carousel).toHaveAttribute('data-gallery-autoplay', 'paused')
})

test('reduced motion disables autoplay and removes long transitions', async ({ page }) => {
  await openProject(page, '/du-an/khach-san-eo-gio')
  const carousel = page.locator('[data-gallery-carousel]')
  await expect(carousel).toHaveAttribute('data-gallery-autoplay', 'disabled')
  await expect(carousel.getByRole('button', { name: /trình chiếu/i })).toHaveCount(0)
  expect(await carousel.locator('[data-gallery-position="active"]').evaluate((element) =>
    Number.parseFloat(getComputedStyle(element).transitionDuration)
  )).toBeLessThanOrEqual(0.001)
})
```

Add a gesture test using `page.mouse` across the viewport and assert the active index changes exactly once. Add a hover/focus test that waits across one interval only once, covering both conditions by moving hover away and shifting focus before the wait.

- [ ] **Step 2: Run the autoplay tests and verify the red state**

Run:

```powershell
pnpm exec playwright test --project=vr tests/e2e/project-gallery-carousel.spec.ts -g "autoplay|reduced motion|gesture|hover"
```

Expected: non-zero exit because timer state, pause/play and pointer gestures are not implemented.

- [ ] **Step 3: Add autoplay state and lifecycle cleanup**

Add these state categories to `AppGalleryCarousel.vue`:

```ts
const visitorPaused = ref(false)
const hovered = ref(false)
const focusWithin = ref(false)
const dragging = ref(false)
const pageHidden = ref(false)
const reduceMotion = ref(false)
let autoplayTimer: ReturnType<typeof setTimeout> | undefined
let motionQuery: MediaQueryList | undefined

const temporarilyPaused = computed(() =>
  props.paused || hovered.value || focusWithin.value || dragging.value || pageHidden.value
)
const autoplayEnabled = computed(() =>
  props.images.length > 1 && props.autoplayMs > 0 && !reduceMotion.value
)
const autoplayRunning = computed(() =>
  autoplayEnabled.value && !visitorPaused.value && !temporarilyPaused.value
)
const autoplayState = computed(() =>
  !autoplayEnabled.value ? 'disabled' : autoplayRunning.value ? 'running' : 'paused'
)

const clearAutoplay = () => {
  if (autoplayTimer) clearTimeout(autoplayTimer)
  autoplayTimer = undefined
}
const scheduleAutoplay = () => {
  clearAutoplay()
  if (!autoplayRunning.value) return
  autoplayTimer = setTimeout(next, props.autoplayMs)
}

watch([autoplayRunning, activeIndex, () => props.autoplayMs], scheduleAutoplay)
```

On mount, read `matchMedia('(prefers-reduced-motion: reduce)')`, subscribe to its `change` event, subscribe to `document.visibilitychange`, and call `scheduleAutoplay`. On unmount, clear the timer and remove both listeners. Use named handlers so removal is exact.

- [ ] **Step 4: Add pause/play and transient pause handlers**

The pause/play button:

```vue
<button
  v-if="autoplayEnabled"
  type="button"
  class="gallery-control"
  :aria-label="t(visitorPaused ? uiText.galleryCarousel.play : uiText.galleryCarousel.pause)"
  :aria-pressed="visitorPaused"
  @click="visitorPaused = !visitorPaused"
>
  <Icon :name="visitorPaused ? 'i-lucide-play' : 'i-lucide-pause'" class="h-4 w-4" />
</button>
```

Set hover state from `mouseenter`/`mouseleave`. Set focus-within state from `focusin` and from
`focusout` only when `event.relatedTarget` is outside `root`. Temporary pauses must not mutate
`visitorPaused`, so autoplay resumes with a fresh interval after hover/focus/lightbox clears.

- [ ] **Step 5: Add pointer drag/swipe navigation**

Track pointer id and starting coordinates on the root. Use a horizontal threshold of `44px` and
require horizontal movement to exceed vertical movement. On a successful drag:

```ts
const finishPointer = (event: PointerEvent) => {
  if (event.pointerId !== pointerId) return
  const dx = event.clientX - pointerStartX
  const dy = event.clientY - pointerStartY
  dragging.value = false
  if (Math.abs(dx) >= 44 && Math.abs(dx) > Math.abs(dy)) {
    suppressClick.value = true
    dx < 0 ? next() : previous()
    requestAnimationFrame(() => { suppressClick.value = false })
  }
}
```

Use pointer capture where supported and handle `pointercancel` by clearing drag state without
navigating. Do not prevent vertical page scrolling before the horizontal threshold is established;
set `touch-action: pan-y` on the viewport.

- [ ] **Step 6: Run focused tests for autoplay and gestures**

Run:

```powershell
pnpm exec playwright test --project=vr tests/e2e/project-gallery-carousel.spec.ts -g "autoplay|reduced motion|gesture|hover"
```

Expected: exit `0`. Record the exact exit; a timeout after passing assertions is still a failure.

- [ ] **Step 7: Review the task diff without committing**

Run:

```powershell
git diff --check
git status --short
git diff -- app/components/AppGalleryCarousel.vue tests/e2e/project-gallery-carousel.spec.ts
```

Expected: no unrelated changes or visual baselines.

---

### Task 4: Enforce Large-Gallery Filter Rules and Lightbox Pausing

**Files:**

- Modify: `app/pages/du-an/[slug].vue`
- Modify: `tests/e2e/project-gallery-carousel.spec.ts`

**Interfaces:**

- Consumes: `AppGalleryCarousel` and its `paused` prop.
- Produces: `showGalleryFilters: ComputedRef<boolean>` with the exact rule `eligible.length > 10 && hasGalleryGroups`.

- [ ] **Step 1: Write failing filter and lightbox-pause tests**

Add:

```ts
test('filters appear only for more than ten images with valid groups', async ({ page }) => {
  await openProject(page, '/du-an/khach-san-eo-gio')
  await expect(page.locator('[data-gallery-filters]')).toBeVisible()

  await openProject(page, '/du-an/nha-xuong-anh-cuong')
  await expect(page.locator('[data-gallery-filters]')).toHaveCount(0)
  await expect(page.locator('[data-gallery-carousel]')).toBeVisible()
})

test('changing a room filter resets the carousel and lightbox pauses autoplay', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await openProject(page, '/du-an/khach-san-eo-gio')
  const carousel = page.locator('[data-gallery-carousel]')

  await carousel.getByRole('button', { name: 'Ảnh tiếp theo' }).click()
  await expect(carousel).toHaveAttribute('data-gallery-active-index', '1')
  await page.locator('[data-gallery-filters] button').nth(1).click()
  await expect(carousel).toHaveAttribute('data-gallery-active-index', '0')

  await carousel.locator('[data-gallery-position="active"] button').click()
  await expect(carousel).toHaveAttribute('data-gallery-autoplay', 'paused')
})
```

Before relying on `/du-an/nha-xuong-anh-cuong`, confirm from current catalog data that it does not
satisfy both filter conditions. If source data has changed, choose another real project fixture
that does not satisfy them and record that slug in the test name.

- [ ] **Step 2: Run the tests and verify the red state**

Run:

```powershell
pnpm exec playwright test --project=vr tests/e2e/project-gallery-carousel.spec.ts -g "filters appear|changing a room filter"
```

Expected: the first test fails because current filters use `hasGalleryGroups` alone; the second
must fail if lightbox pause/reset wiring is incomplete.

- [ ] **Step 3: Implement the exact filter threshold**

In `app/pages/du-an/[slug].vue`:

```ts
const showGalleryFilters = computed(() =>
  mediaFlow.eligible.length > 10 && hasGalleryGroups
)
```

Change only the filter wrapper condition and add its test hook:

```vue
<div
  v-if="showGalleryFilters"
  v-reveal="120"
  data-gallery-filters
  class="reveal flex flex-wrap gap-2"
>
```

Keep `galleryTabs`, counts, existing bilingual group-label fallback and `activeGalleryTab` logic.

- [ ] **Step 4: Confirm reset, persistent visitor pause and external pause wiring**

Do not key `AppGalleryCarousel` by `activeGalleryTab`: keeping the instance alive preserves an
explicit visitor pause. Its image-array watcher resets the active index to `0` after a filter
change. Confirm the carousel receives `:paused="lightboxOpen"`. Do not move lightbox state into
the shared component.

- [ ] **Step 5: Run the complete focused carousel spec**

Run:

```powershell
pnpm build
pnpm exec playwright test --project=vr tests/e2e/project-gallery-carousel.spec.ts
```

Expected: both commands exit `0`.

- [ ] **Step 6: Review the task diff without committing**

Run:

```powershell
git diff --check
git status --short
git diff -- app/pages/du-an tests/e2e/project-gallery-carousel.spec.ts
```

Expected: no unrelated page changes and no snapshot files.

---

### Task 5: Responsive, Locale and Accessibility Gates

**Files:**

- Modify: `tests/e2e/project-gallery-carousel.spec.ts`
- Modify only if a failure proves it necessary: `app/components/AppGalleryCarousel.vue`, `app/components/AppGalleryCarouselSlide.vue`

**Interfaces:**

- Consumes: the complete carousel and project integration from Tasks 1–4.
- Produces: boundary coverage and final verification evidence; no new public runtime interface.

- [ ] **Step 1: Add responsive and bilingual boundary coverage**

Add a table-driven test for widths `390`, `767`, `768`, `1279`, `1280`, `1440` and locales `vi`,
`en`. For each case:

```ts
expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth))
  .toBe(true)
await expect(page.locator('[data-gallery-position="active"]')).toBeVisible()
await expect(page.locator('[data-gallery-position="previous"]')).toBeVisible()
await expect(page.locator('[data-gallery-position="next"]')).toBeVisible()
```

At `1280` and `1440`, also assert the active card width is within `54%–58%` of
`[data-gallery-viewport]` width and greater than both side-card widths. At mobile widths, assert
the active card is dominant and both side cards intersect the viewport, proving the intended peek.
Use bilingual role names from the `uiText.galleryCarousel` contract rather than locale-neutral
CSS selectors for at least the previous/next controls.

- [ ] **Step 2: Run boundary tests and inspect any red state**

Run:

```powershell
pnpm exec playwright test --project=vr tests/e2e/project-gallery-carousel.spec.ts -g "reflows"
```

Expected on the first boundary run: any non-zero exit identifies an exact carousel offset or size
that must be corrected before proceeding. Fix only the failing carousel measurement; do not
change global shell tokens.

- [ ] **Step 3: Run static and unit checks**

Run sequentially and record every exit:

```powershell
pnpm lint
pnpm lint:media
pnpm typecheck
pnpm test
```

Expected: every command exits `0`.

- [ ] **Step 4: Run production build and focused browser coverage**

Run:

```powershell
pnpm build
pnpm exec playwright test --project=vr tests/e2e/project-gallery-carousel.spec.ts
pnpm exec playwright test --project=vr tests/e2e/project-detail-editorial.spec.ts
pnpm test:gates:a11y
```

Expected: every command exits `0`. External project images are stubbed in the focused carousel
spec; the accessibility gate can still depend on configured remote Supabase media.

- [ ] **Step 5: Run scoped visual comparison without approving snapshots**

Run:

```powershell
pnpm exec playwright test --project=vr tests/e2e/visual.spec.ts -g "project-detail @"
```

Expected: non-zero due only to the intentional project-detail gallery layout difference. Do not
run any `--update-snapshots` command. Inspect the report and record whether every diff is confined
to the gallery section; an unrelated diff must be diagnosed before completion.

- [ ] **Step 6: Inspect the final diff and working tree**

Run:

```powershell
git diff --check
git status --short
git diff --stat
git diff -- app tests docs/superpowers/specs docs/superpowers/plans
```

Confirm:

- only the approved spec/plan, carousel utility/tests/components, UI labels and project-detail
  integration changed;
- `AppGalleryGrid.vue`, `GalleryLightbox.vue`, generated media files and snapshots are untouched;
- no raw media URLs, dependency changes or unrelated route changes exist;
- all command exits, expected visual mismatch, skipped checks and external dependencies are ready
  for the final report.
