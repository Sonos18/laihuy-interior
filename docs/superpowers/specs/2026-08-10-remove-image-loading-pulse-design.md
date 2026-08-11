# Remove Image Loading Pulse — Design

## Context

Most below-the-fold images are rendered through `MediaImage.vue`. The `full`, `card`, and
`gallery` presets enable a skeleton layer while the image loads. That layer currently uses
Tailwind's `animate-pulse`, which repeatedly changes its opacity and creates a bright flashing
effect across many images during loading.

## Goal

Remove the repeated light-dark pulse from image loading placeholders across the site so loading
is visually calm and does not cause eye strain.

## Chosen approach

Remove only the `animate-pulse` utility from the shared skeleton layer in `MediaImage.vue`.
Keep the existing `bg-ink-100` placeholder and its `transition-opacity duration-500` classes.
When an image emits its load event, the placeholder will therefore still fade out once over
500 milliseconds, but it will remain visually static before that event.

Because the change is made in the shared component, it applies consistently to every preset
whose `skeleton` configuration is `true` without adding new per-preset options.

## Preserved behavior

- Image dimensions, aspect-ratio reservation, lazy/eager loading, fetch priority, responsive
  sources, and localized alt text remain unchanged.
- Hover zoom effects on galleries and cards remain unchanged.
- Hero images, lightbox transitions, scroll reveals, and other non-loading animations remain
  unchanged.
- Presets with `skeleton: false` remain unchanged.

## Verification

Add a focused Playwright regression test that prevents an image rendered by `MediaImage` from
finishing its load, then checks the visible skeleton's computed style. The test must fail before
the component change because the skeleton has a running pulse animation, and pass afterward
because its computed `animation-name` is `none`. The test will also confirm that the opacity
transition remains present.

After the focused red-green cycle, run lint, unit tests, typecheck, a production build, and the
focused browser test. Do not update visual-regression baselines.

## Non-goals

- Removing the static loading placeholder.
- Removing the one-time fade when an image finishes loading.
- Changing hover, hero, header, drawer, lightbox, or scroll-reveal motion.
- Changing media files, generated media catalogs, presets, or remote storage configuration.
