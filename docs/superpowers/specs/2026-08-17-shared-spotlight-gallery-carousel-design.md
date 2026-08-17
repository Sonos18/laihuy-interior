# Shared Spotlight Gallery Carousel — Design Spec

## Goal

Replace the project-detail page's long editorial image stack with a reusable spotlight carousel
that becomes the standard gallery presentation across the website. The carousel shows three
visual positions, gives the centre image the strongest emphasis, loops continuously, and advances
automatically every five seconds without taking control away from the visitor.

The first integration is the “Hình hoàn thiện / Completed images” section shared by every
`/du-an/[slug]` route. The component is deliberately reusable so future gallery sections use the
same interaction and visual language.

## Scope

### In scope

- A shared gallery carousel component with a large centre image and smaller previous/next images.
- Infinite previous/next navigation.
- Five-second autoplay with explicit pause/play control and interaction-aware pausing.
- Pointer, touch, keyboard and side-image navigation.
- Full-size viewing through the existing `GalleryLightbox` integration.
- Room/function filters on project galleries that contain more than ten eligible images and have
  valid gallery-group metadata.
- Responsive layouts for mobile, tablet and desktop.
- Bilingual labels and reduced-motion behaviour.
- Replacement of `AppGalleryEditorial` in the shared project-detail template, so all projects
  receive the new gallery.

### Out of scope

- Content-led image compositions that are not galleries, such as the three-image factory story on
  `/gioi-thieu`, project cards, hero images and material-story illustrations.
- New gallery-group metadata or editorial relabelling of existing media.
- Changes to the media catalog, media presets or Supabase media pipeline.
- Changes to the full-screen `GalleryLightbox` visual design.
- Automatic conversion of arbitrary image grids into galleries.

At the time of this design, the project-detail “Hình hoàn thiện” section is the only active
full-gallery surface in application source. `AppGalleryGrid` remains available but has no active
page consumer. The new carousel becomes the standard component for gallery surfaces without
reclassifying unrelated image grids as galleries.

## Visual Design

### Three-position spotlight

The carousel viewport presents up to three unique images:

- The active image is centred and occupies 56% of the desktop viewport width.
- The previous and next images sit to either side at a reduced scale and lower visual emphasis.
- Side images remain recognisable and clickable; they are not decorative slivers.
- The active image uses the strongest opacity and elevation. Side images use a softer opacity and
  shadow so the centre remains the unambiguous focal point.
- Every card uses the same fixed landscape frame and `object-cover` to keep the three-position
  composition stable while images change.
- Selecting the active image opens the original media in the lightbox, where it is not constrained
  by the carousel crop.

Slides are positioned from their logical relationship to the active index (`previous`, `active`,
`next`) rather than laid out as a long masonry grid. Changing the active index transitions those
roles, allowing the same component to loop from the last image to the first without a visible end.

### Controls and status

- Previous and next arrow buttons are always available when there is more than one image.
- Clicking either side image moves that image into the centre.
- Clicking the centre image opens the lightbox at the matching absolute image index.
- A compact pause/play button gives the visitor persistent control over autoplay.
- A visible position indicator uses `current / total`; it reflects the current filtered image set.
- Controls reuse the site's rounded, high-contrast button vocabulary and existing ink/wood tokens.

Autoplay is never presented as an essential way to reach content. Every image remains reachable
through manual controls.

## Responsive Behaviour

### Desktop (`1280px` and wider)

- The centre card occupies about 56% of the available width.
- Both side cards are fully recognisable and frame the centre card symmetrically.
- Controls sit close to the gallery without covering important image content.

### Tablet (`768px` through `1279px`)

- The centre card remains dominant.
- Side cards use the mobile-to-desktop interpolation defined by the component and remain fully
  clickable at both tablet boundaries.
- Gallery controls retain comfortable pointer and touch targets.

### Mobile (below `768px`)

- The centre card occupies most of the viewport width.
- The previous and next cards peek in from the edges to communicate horizontal movement.
- Swipe is the primary gesture, but arrows, pause/play and keyboard behaviour remain available.
- The component must not create horizontal document overflow.

The implementation must be checked immediately below and above `768px` and `1280px`, not only at
representative device widths.

## Interaction Model

### Infinite navigation

The active image index is wrapped with modulo arithmetic. Previous from index `0` selects the last
image; next from the last image selects index `0`. The lightbox receives the original absolute
index, preserving its existing thumbnail and previous/next order.

The component does not duplicate content for sparse galleries:

- One image: one centred card; navigation and autoplay controls are hidden.
- Two images: two unique visible cards; manual navigation swaps the active image, but no third
  duplicate is introduced.
- Three or more images: previous, active and next positions are all populated.

### Autoplay

- Default interval: `5000ms`.
- Autoplay starts only when there is more than one image and reduced motion is not requested.
- Each automatic or manual move schedules the next automatic move for a full interval later.
- Autoplay pauses while the carousel is hovered, contains keyboard focus, is being dragged or
  swiped, the lightbox is open, the page is hidden, or the visitor has pressed pause.
- Temporary pauses resume with a fresh five-second interval when their condition clears.
- A visitor-initiated pause remains paused until that visitor presses play.
- Changing a gallery filter resets the active image to the first image and starts a fresh interval
  unless the visitor has explicitly paused autoplay.

### Pointer, touch and keyboard

- Horizontal drag/swipe past a deliberate threshold selects the adjacent image.
- Small pointer movement still counts as a click, so the centre image can open the lightbox.
- `ArrowLeft` and `ArrowRight` navigate when focus is within the carousel.
- `Enter` or `Space` activates the focused control using native button behaviour.
- Manual navigation interrupts any in-progress transition and restarts the autoplay interval only
  after the transition settles.

## Filtering Rules

The project-detail page continues to own gallery-group data and lightbox state. It passes the
currently selected image array into the shared carousel.

The filter bar is shown only when both conditions are true:

1. The project has more than ten eligible gallery images.
2. At least one valid room/function group exists in `projectGalleryGroups`.

The existing bilingual “Tất cả / All” option remains first, followed by the project's room or
function groups and their counts. Projects with ten or fewer images, or without group metadata,
use the same carousel with no filter bar. Selecting a filter remounts or resets the carousel to
index `0`, while lightbox ordering follows the selected filter exactly as it does today.

## Component Boundary

### `AppGalleryCarousel.vue`

The shared component owns presentation and carousel behaviour. Its public interface is:

```ts
type Props = {
  images: MediaImage[]
  preset?: MediaPreset
  selectable?: boolean
  autoplayMs?: number
  paused?: boolean
}

defineEmits<{
  select: [index: number]
  change: [index: number]
}>()
```

Defaults:

- `preset: 'gallery'`
- `selectable: false`
- `autoplayMs: 5000`
- `paused: false`

`paused` lets a parent stop autoplay while an external overlay such as `GalleryLightbox` is open.
The component owns its active index, autoplay timer, transient interaction state and drag state.
It emits absolute indices only.

`AppGalleryCarouselSlide.vue` owns one slide's image, overlay and accessible button state so the
parent remains focused on carousel state and movement. No new third-party carousel dependency is
needed.

### Project-detail integration

`app/pages/du-an/[slug].vue` keeps responsibility for:

- building eligible and filtered image arrays;
- deciding whether filters are visible;
- resolving group labels and counts;
- opening the lightbox with the matching image array and index;
- passing `:paused="lightboxOpen"` into the carousel.

The existing fade transition remains, while the carousel instance stays mounted across filter
changes so an explicit visitor pause is preserved. The carousel watches the filtered image array
and resets its active index to `0`. Repository-wide reference checks confirm `AppGalleryEditorial` and its cell
component have one consumer, so both are removed after that consumer is migrated.
`AppGalleryGrid` is left untouched because it is a distinct layout primitive and currently has no
active page consumer.

## Accessibility

- The root is labelled as a carousel region using the section's bilingual gallery context.
- Slides expose their position (`n of total`) without announcing every automatic move through a
  noisy live region.
- Only visible slides are focusable; off-stage slides use `aria-hidden` and are removed from the
  tab order.
- Previous, next, pause/play and enlarge controls have bilingual accessible names.
- Focus indicators use the site's existing visible focus treatment.
- Autoplay has an explicit pause/play control to satisfy the visitor-control requirement for
  moving content.
- With `prefers-reduced-motion: reduce`, autoplay is disabled and slide transitions become
  immediate or minimal.
- Hover is never the only way to discover or operate controls.

## Failure and Edge Handling

- Empty image arrays render no carousel markup. The project page already guards its gallery
  section, but the shared component remains safe in isolation.
- If a filter changes while the active index points beyond the new array, the index resets to `0`.
- Timer and visibility listeners are cleaned up on unmount.
- Losing pointer capture during a drag cancels the drag safely without changing images unless the
  movement threshold was crossed.
- Failed image loading keeps the card frame stable; existing `MediaImage` behaviour remains the
  source of fallback handling.

## Verification

### Automated checks

- Add focused Playwright coverage for initial three-position geometry, infinite previous/next
  wrapping, side-image activation, keyboard navigation and lightbox index correctness.
- Verify autoplay does not advance by `4800ms` and has advanced once by `5500ms`, allowing a
  bounded tolerance for browser scheduling around the `5000ms` interval.
- Verify hover, focus, explicit pause and lightbox state stop autoplay.
- Verify reduced motion disables autoplay.
- Verify filter visibility for a project with more than ten images and groups, and its absence for
  a project that does not satisfy both conditions.
- Verify changing filters resets the active position and preserves correct lightbox ordering.
- Extend responsive checks at `390`, `767`, `768`, `1279`, `1280` and `1440` in both Vietnamese
  and English, including document-overflow assertions.
- Run lint, media literal guard, typecheck, relevant Vitest tests, production build, focused
  project-detail Playwright coverage and the accessibility gate.

### Visual regression

The layout intentionally changes the project-detail visual baselines. Run the scoped visual test
to inspect the diff, but do not update or approve committed snapshots without separate explicit
approval. The expected change is limited to the project-detail gallery portion; unrelated route
diffs are defects.

### Manual checks

- Rich grouped project: `/du-an/khach-san-eo-gio`, both locales.
- Project without gallery groups and a different media shape.
- One project at each responsive boundary listed above.
- Mouse, touch emulation, keyboard-only and reduced-motion operation.
- Autoplay pause/resume after hover, focus, manual navigation, filter change and lightbox close.

## Non-goals and Preservation Contracts

- No backend, analytics, media writes or new runtime service.
- No hardcoded media URLs.
- No changes to project copy, alt-text ownership or generated media files.
- No snapshot baseline updates without explicit approval.
- No redesign of heroes, story chapters, delivery proof, material story, related projects or final
  conversion sections.
