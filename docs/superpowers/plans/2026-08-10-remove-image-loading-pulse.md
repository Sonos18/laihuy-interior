# Remove Image Loading Pulse Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stop image loading placeholders from pulsing while preserving their static background and one-time opacity fade.

**Architecture:** Keep the existing preset and loading-state model unchanged. Add one browser-level regression test for the computed motion of the shared `MediaImage` skeleton, then remove only the `animate-pulse` utility from that component.

**Tech Stack:** Nuxt 4.3.1, Vue 3.5.28, Tailwind CSS 4.1.18, Playwright 1.61.1, Vitest 4.1.9, pnpm 10.29.3.

## Global Constraints

- Work only on branch `codex/remove-image-flash`; do not switch back to or edit on `main`.
- Preserve the static `bg-ink-100` skeleton and its `transition-opacity duration-500` fade.
- Do not change image presets, loading priorities, media paths, generated catalogs, hover motion, hero motion, lightbox motion, or reveal motion.
- Do not update Playwright visual baselines.
- Do not commit, push, rebase, or alter branches without explicit user approval.
- Preserve the pre-existing untracked `.superpowers/` directory and `docs/superpowers/specs/2026-08-10-nha-xuong-proof-first-design.md` file.

---

## File Structure

- Create `tests/e2e/image-loading-motion.spec.ts`: browser regression coverage for the shared loading placeholder's computed animation and transition styles.
- Modify `app/components/MediaImage.vue`: remove the repeated pulse utility from the existing skeleton layer; leave all other behavior intact.

### Task 1: Make the shared image loading placeholder static

**Files:**
- Create: `tests/e2e/image-loading-motion.spec.ts`
- Modify: `app/components/MediaImage.vue:27-35`

**Interfaces:**
- Consumes: the existing `MediaImage` skeleton rendered as a direct child of `div.relative.overflow-hidden` when `presetConfig.skeleton` is `true`.
- Produces: a skeleton whose computed `animationName` is `none`, with `opacity` still present in `transitionProperty` and `0.5s` still present in `transitionDuration`.

- [ ] **Step 1: Build the current application output for the browser test server**

Run:

```powershell
pnpm build
```

Expected: exit code 0 and a fresh `.output/server/index.mjs` generated from the pre-change component.

- [ ] **Step 2: Write the failing browser regression test**

Create `tests/e2e/image-loading-motion.spec.ts` with:

```ts
import { expect, test } from './fixtures'

const TEST_ORIGIN = process.env.DENSITY_TEST_ORIGIN ?? 'http://localhost:3000'

test('MediaImage keeps its loading placeholder static', async ({ page }) => {
  await page.route('**/*', async (route) => {
    if (route.request().resourceType() === 'image') {
      await route.abort()
      return
    }
    await route.continue()
  })

  await page.goto(new URL('/nha-xuong', TEST_ORIGIN).toString(), {
    waitUntil: 'domcontentloaded'
  })

  const skeleton = page
    .locator('div.relative.overflow-hidden > div.absolute.inset-0.bg-ink-100')
    .first()
  await expect(skeleton).toBeVisible()

  const motion = await skeleton.evaluate((element) => {
    const style = getComputedStyle(element)
    return {
      animationName: style.animationName,
      transitionDurations: style.transitionDuration.split(',').map(value => value.trim()),
      transitionProperties: style.transitionProperty.split(',').map(value => value.trim())
    }
  })

  expect(motion.animationName).toBe('none')
  expect(motion.transitionProperties).toContain('opacity')
  expect(motion.transitionDurations).toContain('0.5s')
})
```

- [ ] **Step 3: Run the focused test and verify the red state**

Run:

```powershell
pnpm exec playwright test --project=vr tests/e2e/image-loading-motion.spec.ts
```

Expected: non-zero exit because `animationName` is `pulse` instead of `none`. The skeleton must be found and visible; a selector, navigation, or server error is not the expected red state.

- [ ] **Step 4: Remove only the pulse utility from the shared component**

In `app/components/MediaImage.vue`, change the skeleton's base class from:

```vue
'absolute inset-0 bg-ink-100 animate-pulse transition-opacity duration-500'
```

to:

```vue
'absolute inset-0 bg-ink-100 transition-opacity duration-500'
```

Do not modify the `v-if`, the loaded-state opacity classes, the `NuxtImg`, or `app/media/presets.ts`.

- [ ] **Step 5: Rebuild and verify the focused test is green**

Run:

```powershell
pnpm build
pnpm exec playwright test --project=vr tests/e2e/image-loading-motion.spec.ts
```

Expected: both commands exit 0 and the single focused Playwright test passes.

- [ ] **Step 6: Run proportional repository verification**

Run each command separately and require exit code 0:

```powershell
pnpm lint
pnpm lint:media
pnpm test
pnpm typecheck
pnpm build
pnpm exec playwright test --project=vr tests/e2e/image-loading-motion.spec.ts
```

Do not treat passing assertions followed by a Playwright shutdown timeout as a pass.

- [ ] **Step 7: Review scope and leave the work uncommitted**

Run:

```powershell
git diff --check
git diff -- app/components/MediaImage.vue tests/e2e/image-loading-motion.spec.ts docs/superpowers/specs/2026-08-10-remove-image-loading-pulse-design.md docs/superpowers/plans/2026-08-10-remove-image-loading-pulse.md
git status --short
git branch --show-current
```

Expected: the branch is `codex/remove-image-flash`; the implementation diff contains only the pulse removal and focused regression test; the two task documents are new; the pre-existing untracked files remain untouched; no files are staged or committed.
