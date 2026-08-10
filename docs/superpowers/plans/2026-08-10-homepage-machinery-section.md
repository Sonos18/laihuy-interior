# Homepage Machinery Section Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the homepage's tall seven-card machinery subsection with the approved A · V3 layout: a stacked intro, a real workshop photograph, and four production-stage cards arranged in a responsive 55/45 proof grid.

**Architecture:** Keep the feature inside the existing factory-capability section in `app/pages/index.vue`. Put bilingual editorial content in `app/data/factory.ts`, join the generated workshop asset to localized alt text in `app/data/site-images.ts`, and render it through the existing `MediaImage` boundary. Protect the content model with Vitest and the responsive geometry with a focused Playwright spec instead of relying on screenshot baselines alone.

**Tech Stack:** Nuxt 4.3.1, Vue 3.5.28, TypeScript 5.9.3, Tailwind CSS 4.1.18, `@nuxt/image`, Vitest 4.1.9, Playwright 1.61.1.

## Global Constraints

- Preserve the existing merged **Factory capability + Machinery** section and heading order `h2 → h3 → h4`.
- Keep the eyebrow, title, and description vertically stacked at every viewport width.
- At `lg` and above (`1024px+`), use an intrinsic-height 55/45 image/process grid with a 16px gap and equal top/bottom edges.
- At `768–1023px`, stack a 16:9 image above a 2×2 process grid; below `768px`, use a 4:3 image and one process-card column.
- Use `company/workshop/3.webp` through the generated `workshopMedia` collection and a semantic `siteImages.machineryOverview` join; never add a raw `/images/` path or Supabase URL.
- Keep Vietnamese as the default locale and provide complete Vietnamese and English content and alt text.
- Do not change the four capability cards, homepage section order, `/nha-xuong`, global spacing tokens, generated media catalog, media manifest, dependencies, or Playwright baselines.
- Do not run `test:vr:approve`, `test:vr:all:approve`, or any snapshot-update command.
- Existing user changes in `nuxt.config.ts`, `package.json`, `pnpm-lock.yaml`, `tests/deployment-config.test.ts`, and `.nvmrc` are out of scope and must be preserved.
- The repository does not authorize commits by default. End each task with a diff review; commit only if the user gives separate explicit permission during execution.

## File Structure

- Create `tests/homepage-machinery.test.ts` — unit contract for the four groups and exact seven-machine coverage in both locales.
- Create `tests/e2e/homepage-machinery-density.spec.ts` — content, accessibility, image-source, breakpoint, aspect-ratio, equal-height, and density assertions for the homepage subsection.
- Modify `app/data/factory.ts` — typed intro/caption copy and `machineryProcessGroups`; remove the legacy seven-card model only after the page no longer consumes it.
- Modify `app/data/site-images.ts` — filename-based lookup of `3.webp` and localized `machineryOverview` alt text.
- Modify `app/pages/index.vue` — approved intro stack, responsive proof grid, four cards, real workshop image, caption, and CTA alignment.
- Do not create a shared component: this subsection has one consumer and the existing `MediaImage` component already owns media loading, dimensions, and skeleton behavior.

---

### Task 1: Define and test the bilingual machinery content model

**Files:**
- Create: `tests/homepage-machinery.test.ts`
- Modify: `app/data/factory.ts:3-104`

**Interfaces:**
- Consumes: existing `LocalizedText` from `~/shared/types/localization`.
- Produces: `MachinerySectionContent`, `MachineryProcessGroup`, `machinerySectionContent`, and `machineryProcessGroups` for `app/pages/index.vue`.
- Preserves temporarily: the existing `Machinery` type and `machinery` export until Task 2 switches the homepage consumer.

- [ ] **Step 1: Write the failing unit contract**

Create `tests/homepage-machinery.test.ts` with the exact grouping and locale expectations:

```ts
import { describe, expect, it } from 'vitest'
import {
  machineryProcessGroups,
  machinerySectionContent
} from '../app/data/factory'

const EXPECTED_IDS = [
  'cutting-shaping',
  'boring-connections',
  'edge-finishing',
  'surface-pressing'
] as const

const EXPECTED_MACHINES = {
  vi: [
    'CNC Nesting',
    'Cưa bàn trượt',
    'Máy khoan liên kết CNC',
    'Máy dán cạnh tự động',
    'Máy bào cuốn',
    'Máy chà nhám thùng',
    'Máy ép nguội thủy lực'
  ],
  en: [
    'CNC nesting router',
    'Sliding table saw',
    'CNC boring machine',
    'Automatic edge bander',
    'Thickness planer',
    'Wide-belt sander',
    'Hydraulic cold press'
  ]
} as const

describe('homepage machinery content', () => {
  it('defines the approved four production stages in order', () => {
    expect(machineryProcessGroups.map(group => group.id)).toEqual(EXPECTED_IDS)
    expect(machineryProcessGroups).toHaveLength(4)
  })

  it.each(['vi', 'en'] as const)('represents every machine exactly once in %s', (locale) => {
    const machineNames = machineryProcessGroups.flatMap(group =>
      group.machines.map(machine => machine[locale])
    )

    expect(machineNames).toEqual(EXPECTED_MACHINES[locale])
    expect(new Set(machineNames).size).toBe(7)
  })

  it.each(['vi', 'en'] as const)('provides complete intro and caption copy in %s', (locale) => {
    expect(machinerySectionContent.titleLead[locale]).not.toBe('')
    expect(machinerySectionContent.titleAccent[locale]).not.toBe('')
    expect(machinerySectionContent.description[locale]).not.toBe('')
    expect(machinerySectionContent.photoCaption[locale]).not.toBe('')
    expect(machinerySectionContent.lineCaption[locale]).not.toBe('')

    for (const group of machineryProcessGroups) {
      expect(group.title[locale]).not.toBe('')
      expect(group.benefit[locale]).not.toBe('')
      expect(group.machines.length).toBeGreaterThan(0)
    }
  })
})
```

- [ ] **Step 2: Run the unit test and verify the red state**

Run:

```powershell
pnpm exec vitest run tests/homepage-machinery.test.ts
```

Expected: FAIL because `machinerySectionContent` and `machineryProcessGroups` are not exported yet.

- [ ] **Step 3: Add the typed section and process-group data**

Add these types beside the existing factory data types in `app/data/factory.ts`:

```ts
export type MachinerySectionContent = {
  titleLead: LocalizedText
  titleAccent: LocalizedText
  description: LocalizedText
  photoCaption: LocalizedText
  lineCaption: LocalizedText
}

export type MachineryProcessGroup = {
  id: string
  title: LocalizedText
  benefit: LocalizedText
  machines: readonly LocalizedText[]
}
```

Add the approved content after `factoryCapabilities` and before the existing legacy `machinery` array:

```ts
export const machinerySectionContent: MachinerySectionContent = {
  titleLead: {
    vi: 'Hệ thống máy phục vụ sản xuất',
    en: 'Machinery system for'
  },
  titleAccent: {
    vi: 'nội thất dự án',
    en: 'project interior manufacturing'
  },
  description: {
    vi: 'Xưởng ứng dụng hệ thống máy đồng bộ theo bốn công đoạn chính, giúp kiểm soát độ chính xác, chất lượng bề mặt và tiến độ cho các dự án khách sạn, villa và căn hộ cao cấp.',
    en: 'The workshop uses a coordinated machinery line across four core stages, controlling precision, surface quality, and schedule for hotel, villa, and premium apartment projects.'
  },
  photoCaption: {
    vi: 'Hình ảnh thực tế tại xưởng',
    en: 'Real workshop photograph'
  },
  lineCaption: {
    vi: 'Hệ thống máy sản xuất',
    en: 'Production machinery line'
  }
}

export const machineryProcessGroups: readonly MachineryProcessGroup[] = [
  {
    id: 'cutting-shaping',
    title: { vi: 'Cắt & tạo hình', en: 'Cutting & shaping' },
    benefit: {
      vi: 'Cắt và tạo hình chi tiết theo hồ sơ kỹ thuật, tối ưu vật liệu và giữ kích thước đồng nhất.',
      en: 'Cuts and shapes components to the technical documents, optimising material and dimensional consistency.'
    },
    machines: [
      { vi: 'CNC Nesting', en: 'CNC nesting router' },
      { vi: 'Cưa bàn trượt', en: 'Sliding table saw' }
    ]
  },
  {
    id: 'boring-connections',
    title: { vi: 'Khoan & liên kết', en: 'Boring & connections' },
    benefit: {
      vi: 'Gia công chính xác lỗ liên kết và vị trí phụ kiện, giúp lắp ráp nhanh và đồng bộ.',
      en: 'Machines connector holes and hardware positions precisely for faster, consistent assembly.'
    },
    machines: [
      { vi: 'Máy khoan liên kết CNC', en: 'CNC boring machine' }
    ]
  },
  {
    id: 'edge-finishing',
    title: { vi: 'Dán cạnh & hoàn thiện', en: 'Edge banding & finishing' },
    benefit: {
      vi: 'Hoàn thiện cạnh ván đồng đều, tăng độ bền, thẩm mỹ và độ ổn định của sản phẩm.',
      en: 'Finishes board edges uniformly to improve durability, appearance and product stability.'
    },
    machines: [
      { vi: 'Máy dán cạnh tự động', en: 'Automatic edge bander' }
    ]
  },
  {
    id: 'surface-pressing',
    title: { vi: 'Xử lý bề mặt & ép', en: 'Surface treatment & pressing' },
    benefit: {
      vi: 'Kiểm soát độ phẳng, độ mịn và liên kết vật liệu trước khi chuyển sang hoàn thiện.',
      en: 'Controls surface flatness, smoothness and material bonding before final finishing.'
    },
    machines: [
      { vi: 'Máy bào cuốn', en: 'Thickness planer' },
      { vi: 'Máy chà nhám thùng', en: 'Wide-belt sander' },
      { vi: 'Máy ép nguội thủy lực', en: 'Hydraulic cold press' }
    ]
  }
]
```

- [ ] **Step 4: Run the focused and full unit suites**

Run:

```powershell
pnpm exec vitest run tests/homepage-machinery.test.ts
pnpm test
```

Expected: both commands exit `0`; the new suite reports four ordered groups and seven unique machine names in each locale.

- [ ] **Step 5: Review the Task 1 diff without committing**

Run:

```powershell
git diff -- app/data/factory.ts tests/homepage-machinery.test.ts
git status --short
```

Expected: only the new test and scoped additions to `factory.ts` belong to this task; pre-existing user changes remain untouched. Do not commit without explicit user permission.

---

### Task 2: Lock the responsive contract and implement the approved subsection

**Files:**
- Create: `tests/e2e/homepage-machinery-density.spec.ts`
- Modify: `app/data/site-images.ts:1-35`
- Modify: `app/pages/index.vue:1-14,354-417`
- Modify: `app/data/factory.ts:9-12,54-104` only after the homepage stops importing the legacy export

**Interfaces:**
- Consumes: `machinerySectionContent` and `machineryProcessGroups` from Task 1.
- Consumes: `workshopMedia: readonly MediaAsset[]` from `app/media/catalog.generated.ts`.
- Produces: `siteImages.machineryOverview: MediaImage` with path `company/workshop/3.webp` and localized alt text.
- Produces: stable test hooks `homepage-machinery`, `homepage-machinery-title`, `homepage-machinery-description`, `homepage-machinery-proof`, `homepage-machinery-image`, `homepage-machinery-caption`, `homepage-machinery-groups`, `homepage-machinery-card`, and `homepage-machinery-cta`.

- [ ] **Step 1: Write the failing Playwright content and geometry contract**

Create `tests/e2e/homepage-machinery-density.spec.ts`:

```ts
import type { Page } from '@playwright/test'
import { expect, test } from './fixtures'

const TEST_ORIGIN = process.env.DENSITY_TEST_ORIGIN ?? 'http://localhost:3000'
const VIEWPORT_HEIGHT = 1000
const TRANSPARENT_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M/wHwAF/gL+X9j7WQAAAABJRU5ErkJggg==',
  'base64'
)

const COPY = {
  vi: {
    heading: 'Hệ thống máy phục vụ sản xuất nội thất dự án',
    description: 'Xưởng ứng dụng hệ thống máy đồng bộ theo bốn công đoạn chính, giúp kiểm soát độ chính xác, chất lượng bề mặt và tiến độ cho các dự án khách sạn, villa và căn hộ cao cấp.',
    groups: ['Cắt & tạo hình', 'Khoan & liên kết', 'Dán cạnh & hoàn thiện', 'Xử lý bề mặt & ép'],
    machines: ['CNC Nesting', 'Cưa bàn trượt', 'Máy khoan liên kết CNC', 'Máy dán cạnh tự động', 'Máy bào cuốn', 'Máy chà nhám thùng', 'Máy ép nguội thủy lực'],
    imageAlt: 'Toàn cảnh hệ thống máy sản xuất tại xưởng Lai Huy',
    cta: 'Xem năng lực nhà xưởng'
  },
  en: {
    heading: 'Machinery system for project interior manufacturing',
    description: 'The workshop uses a coordinated machinery line across four core stages, controlling precision, surface quality, and schedule for hotel, villa, and premium apartment projects.',
    groups: ['Cutting & shaping', 'Boring & connections', 'Edge banding & finishing', 'Surface treatment & pressing'],
    machines: ['CNC nesting router', 'Sliding table saw', 'CNC boring machine', 'Automatic edge bander', 'Thickness planer', 'Wide-belt sander', 'Hydraulic cold press'],
    imageAlt: 'Overview of the machinery line inside the Lai Huy workshop',
    cta: 'View factory capability'
  }
} as const

const WIDTHS = [390, 767, 768, 1023, 1024, 1279, 1280, 1440] as const
const BLOCK_HEIGHT_LIMITS = new Map<number, number>([
  [390, 1475],
  [768, 1280],
  [1440, 870]
])

type MachineryLocale = keyof typeof COPY

async function prepareHome(page: Page, locale: MachineryLocale, width: number) {
  const consoleErrors: string[] = []
  const pageErrors: string[] = []

  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text())
  })
  page.on('pageerror', error => pageErrors.push(error.message))

  await page.context().addCookies([
    { name: 'lai-huy-locale', value: locale, url: TEST_ORIGIN }
  ])
  await page.route('**/*', async (route) => {
    if (route.request().resourceType() === 'image') {
      await route.fulfill({ status: 200, contentType: 'image/png', body: TRANSPARENT_PNG })
      return
    }
    await route.continue()
  })

  await page.setViewportSize({ width, height: VIEWPORT_HEIGHT })
  await page.goto(new URL('/', TEST_ORIGIN).toString(), { waitUntil: 'load' })
  await page.evaluate(() => document.fonts.ready)
  await expect(page.locator('html')).toHaveAttribute('lang', locale)

  return { consoleErrors, pageErrors }
}

for (const locale of ['vi', 'en'] as const) {
  const copy = COPY[locale]

  test(`MACHINERY-CONTENT renders grouped workshop proof in ${locale}`, async ({ page }) => {
    const errors = await prepareHome(page, locale, 1440)
    const section = page.getByTestId('homepage-machinery')
    const cards = section.getByTestId('homepage-machinery-card')

    await expect(section.getByRole('heading', { level: 3, name: copy.heading, exact: true })).toHaveCount(1)
    await expect(section.getByTestId('homepage-machinery-description')).toHaveText(copy.description)
    await expect(cards).toHaveCount(4)
    await expect(cards.locator('h4')).toHaveText(copy.groups)

    const machineCopy = (await cards.allTextContents()).join(' ')
    for (const machine of copy.machines) expect(machineCopy).toContain(machine)

    const image = section.getByRole('img', { name: copy.imageAlt, exact: true })
    await expect(image).toHaveAttribute('src', /company\/workshop\/3\.webp/)
    await expect(section.getByTestId('homepage-machinery-caption')).toHaveAttribute('aria-hidden', 'true')
    const sequences = section.locator('[data-machinery-sequence]')
    await expect(sequences).toHaveCount(4)
    expect(await sequences.evaluateAll(nodes =>
      nodes.every(node => node.getAttribute('aria-hidden') === 'true')
    )).toBe(true)

    const cta = section.getByRole('link', { name: copy.cta, exact: true })
    await expect(cta).toHaveAttribute('href', '/nha-xuong')
    await cta.focus()
    await expect(cta).toBeFocused()

    expect(errors.consoleErrors).toEqual([])
    expect(errors.pageErrors).toEqual([])
  })

  for (const width of WIDTHS) {
    test(`MACHINERY-LAYOUT keeps the approved geometry at ${width}px in ${locale}`, async ({ page }) => {
      const errors = await prepareHome(page, locale, width)
      const section = page.getByTestId('homepage-machinery')
      const geometry = await section.evaluate((element) => {
        const rect = (selector: string) => {
          const target = element.matches(selector)
            ? element as HTMLElement
            : element.querySelector<HTMLElement>(selector)
          if (!target) throw new Error(`Missing machinery selector: ${selector}`)
          const box = target.getBoundingClientRect()
          return { top: box.top, right: box.right, bottom: box.bottom, left: box.left, width: box.width, height: box.height }
        }

        return {
          block: rect('[data-testid="homepage-machinery"]'),
          title: rect('[data-testid="homepage-machinery-title"]'),
          description: rect('[data-testid="homepage-machinery-description"]'),
          image: rect('[data-testid="homepage-machinery-image"]'),
          groups: rect('[data-testid="homepage-machinery-groups"]'),
          cards: Array.from(element.querySelectorAll<HTMLElement>('[data-testid="homepage-machinery-card"]')).map((card) => {
            const box = card.getBoundingClientRect()
            return { top: box.top, left: box.left }
          }),
          documentWidth: document.documentElement.scrollWidth,
          viewportWidth: document.documentElement.clientWidth
        }
      })

      expect(geometry.title.bottom).toBeLessThanOrEqual(geometry.description.top + 1)
      expect(Math.abs(geometry.title.left - geometry.description.left)).toBeLessThanOrEqual(2)
      expect(geometry.documentWidth).toBeLessThanOrEqual(geometry.viewportWidth)
      expect(geometry.cards).toHaveLength(4)

      if (width >= 1024) {
        const imageShare = geometry.image.width / (geometry.image.width + geometry.groups.width)
        expect(imageShare).toBeGreaterThanOrEqual(0.53)
        expect(imageShare).toBeLessThanOrEqual(0.57)
        expect(Math.abs(geometry.image.top - geometry.groups.top)).toBeLessThanOrEqual(2)
        expect(Math.abs(geometry.image.bottom - geometry.groups.bottom)).toBeLessThanOrEqual(2)
      } else {
        expect(geometry.image.bottom).toBeLessThanOrEqual(geometry.groups.top)
        const imageRatio = geometry.image.width / geometry.image.height
        if (width >= 768) {
          expect(imageRatio).toBeGreaterThan(1.70)
          expect(imageRatio).toBeLessThan(1.84)
        } else {
          expect(imageRatio).toBeGreaterThan(1.27)
          expect(imageRatio).toBeLessThan(1.40)
        }
      }

      if (width >= 768) {
        expect(Math.abs(geometry.cards[0]!.top - geometry.cards[1]!.top)).toBeLessThanOrEqual(2)
        expect(geometry.cards[0]!.left).toBeLessThan(geometry.cards[1]!.left)
        expect(geometry.cards[2]!.top).toBeGreaterThan(geometry.cards[0]!.top)
      } else {
        for (let index = 1; index < geometry.cards.length; index += 1) {
          expect(Math.abs(geometry.cards[index]!.left - geometry.cards[0]!.left)).toBeLessThanOrEqual(2)
          expect(geometry.cards[index]!.top).toBeGreaterThan(geometry.cards[index - 1]!.top)
        }
      }

      const blockHeightLimit = BLOCK_HEIGHT_LIMITS.get(width)
      if (blockHeightLimit) expect(geometry.block.height).toBeLessThan(blockHeightLimit)

      expect(errors.consoleErrors).toEqual([])
      expect(errors.pageErrors).toEqual([])
    })
  }
}
```

- [ ] **Step 2: Build the current app and verify the browser contract fails**

Run:

```powershell
pnpm build
pnpm exec playwright test --project=vr homepage-machinery-density.spec.ts
```

Expected: `pnpm build` exits `0`; Playwright fails because the current subsection has no `homepage-machinery` hooks, still uses `aboutWorkspace`, and does not implement the approved geometry. Record the actual failure; do not weaken thresholds to make the old layout pass.

- [ ] **Step 3: Add the semantic workshop image join**

Update the import and add a guarded filename lookup at the top of `app/data/site-images.ts`:

```ts
import { brandMedia, companyMedia, workshopMedia } from '~/media/catalog.generated'
import type { MediaImage } from '~/shared/media/types'

const machineryOverviewAsset = workshopMedia.find(asset => asset.path.endsWith('/3.webp'))

if (!machineryOverviewAsset) {
  throw new Error('Missing workshop media asset: company/workshop/3.webp')
}
```

Add this entry to `siteImages` without changing the generated catalog:

```ts
machineryOverview: {
  ...machineryOverviewAsset,
  alt: {
    vi: 'Toàn cảnh hệ thống máy sản xuất tại xưởng Lai Huy',
    en: 'Overview of the machinery line inside the Lai Huy workshop'
  }
},
```

- [ ] **Step 4: Replace the homepage machinery markup with the approved layout**

Change the factory import and add a sequence formatter in `app/pages/index.vue`:

```ts
import {
  factoryCapabilities,
  machineryProcessGroups,
  machinerySectionContent,
  productionWorkflow
} from '~/data/factory'

const formatMachinerySequence = (index: number) => String(index + 1).padStart(2, '0')
```

Replace the current machinery block at `app/pages/index.vue:354-417` with:

```vue
<div
  data-testid="homepage-machinery"
  class="mt-14"
>
  <div class="border-l-2 border-wood-500 pl-5 sm:pl-7">
    <p
      v-reveal
      class="eyebrow reveal"
    >
      {{ t(uiText.labels.machinery) }}
    </p>
    <h3
      v-reveal="80"
      data-testid="homepage-machinery-title"
      class="reveal text-section-title mt-4 max-w-5xl font-black uppercase text-ink-950"
    >
      {{ t(machinerySectionContent.titleLead) }}
      <span class="text-wood-600">{{ t(machinerySectionContent.titleAccent) }}</span>
    </h3>
    <p
      v-reveal="140"
      data-testid="homepage-machinery-description"
      class="reveal mt-4 max-w-[45rem] text-base leading-7 text-ink-600"
    >
      {{ t(machinerySectionContent.description) }}
    </p>
  </div>

  <div
    data-testid="homepage-machinery-proof"
    class="mt-8 grid gap-4 lg:grid-cols-[minmax(0,11fr)_minmax(0,9fr)] lg:items-stretch"
  >
    <div
      v-reveal
      data-testid="homepage-machinery-image"
      class="reveal group relative aspect-[4/3] overflow-hidden rounded-2xl md:aspect-video lg:aspect-auto lg:min-h-0"
    >
      <MediaImage
        :image="siteImages.machineryOverview"
        sizes="sm:100vw md:100vw lg:55vw xl:55vw"
        class="absolute inset-0 h-full w-full"
        img-class="object-center transition-transform duration-[1200ms] ease-out group-hover:scale-105"
      />
      <div
        data-testid="homepage-machinery-caption"
        aria-hidden="true"
        class="absolute inset-x-0 bottom-0 flex flex-col gap-1 bg-ink-950/75 px-4 py-3 text-xs font-bold uppercase tracking-[0.12em] text-white backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between"
      >
        <span>{{ t(machinerySectionContent.photoCaption) }}</span>
        <span class="text-wood-200">{{ t(machinerySectionContent.lineCaption) }}</span>
      </div>
    </div>

    <div
      data-testid="homepage-machinery-groups"
      class="grid gap-3 md:grid-cols-2 lg:h-full lg:grid-rows-2"
    >
      <article
        v-for="(group, index) in machineryProcessGroups"
        :key="group.id"
        v-reveal="(index % 2) * 80"
        data-testid="homepage-machinery-card"
        class="reveal flex min-h-0 flex-col rounded-2xl border border-ink-200 bg-ink-50 p-4 transition-colors hover:border-wood-400 sm:p-5"
      >
        <span
          data-machinery-sequence
          aria-hidden="true"
          class="text-xs font-black tracking-[0.16em] text-wood-600"
        >
          {{ formatMachinerySequence(index) }}
        </span>
        <h4 class="mt-3 text-base font-black text-ink-950">
          {{ t(group.title) }}
        </h4>
        <p class="mt-2 text-sm leading-6 text-ink-600">
          {{ t(group.benefit) }}
        </p>
        <p class="mt-auto border-t border-ink-200 pt-4 text-xs font-bold leading-5 text-ink-700">
          <template
            v-for="(machine, machineIndex) in group.machines"
            :key="t(machine)"
          >
            <span>{{ t(machine) }}</span>
            <span
              v-if="machineIndex < group.machines.length - 1"
              aria-hidden="true"
            > · </span>
          </template>
        </p>
      </article>
    </div>
  </div>

  <div class="mt-6 flex justify-start lg:justify-end">
    <NuxtLink
      data-testid="homepage-machinery-cta"
      to="/nha-xuong"
      class="btn-outline"
    >
      {{ t(uiText.cta.factory) }}
    </NuxtLink>
  </div>
</div>
```

The image is absolutely positioned inside an aspect-ratio wrapper below `lg`. At `lg+`, `lg:aspect-auto` removes the image's intrinsic layout contribution, so the 2×2 card grid determines the row height and the image stretches to the same top and bottom edges without a fixed pixel height.

- [ ] **Step 5: Remove the legacy seven-card source only after proving it has no consumer**

Run:

```powershell
rg -n "import .*\bmachinery\b|v-for=.*\bmachinery\b" app
```

Expected after Step 4: no matches. Then remove only the legacy `Machinery` type and `machinery` array from `app/data/factory.ts`. Keep `Capability`, `ProductionStep`, `factoryCapabilities`, `productionWorkflow`, and `qualityControl` unchanged. This is the explicitly scoped cleanup allowed by the design spec; the new unit test proves all seven machine names survive exactly once.

- [ ] **Step 6: Run static checks that catch template, type, and media-boundary errors**

Run:

```powershell
pnpm lint
pnpm lint:media
pnpm typecheck
pnpm test
```

Expected: every command exits `0`. `lint:media` must confirm that the page did not gain a raw `/images/` or Supabase media literal.

- [ ] **Step 7: Rebuild and verify the focused Playwright contract turns green**

Run:

```powershell
pnpm build
pnpm exec playwright test --project=vr homepage-machinery-density.spec.ts
```

Expected: both commands exit `0`; the focused suite passes for VI and EN at `390`, `767`, `768`, `1023`, `1024`, `1279`, `1280`, and `1440` widths.

- [ ] **Step 8: Review the Task 2 diff without committing**

Run:

```powershell
git diff -- app/data/factory.ts app/data/site-images.ts app/pages/index.vue tests/e2e/homepage-machinery-density.spec.ts
git status --short
```

Expected: no changes to `app/media/catalog.generated.ts`, `app/shared/media/manifest.json`, snapshots, `/nha-xuong`, or unrelated homepage sections. Do not commit without explicit user permission.

---

### Task 3: Verify the complete page contract and hand off visual evidence

**Files:**
- Verify only: `app/pages/index.vue`, `app/data/factory.ts`, `app/data/site-images.ts`
- Verify only: `tests/homepage-machinery.test.ts`, `tests/e2e/homepage-machinery-density.spec.ts`
- Do not modify: Playwright snapshot directories

**Interfaces:**
- Consumes: the production build created in Task 2.
- Produces: command results and direct browser evidence for both locales and all breakpoint boundaries.

- [ ] **Step 1: Run the repository's required static and production checks once from the final tree**

Run in this order:

```powershell
pnpm lint
pnpm lint:media
pnpm typecheck
pnpm test
pnpm build
```

Expected: every process exits `0`. A process that passes assertions but times out or exits non-zero is not a pass and must be reported as such.

- [ ] **Step 2: Run focused and neighboring Chromium gates**

Run:

```powershell
pnpm exec playwright test --project=vr homepage-machinery-density.spec.ts
pnpm test:gates:text
pnpm test:gates:layout
pnpm test:gates:a11y
```

Expected: every command exits `0`. The accessibility gate verifies the homepage heading and ARIA changes; the text and layout gates catch regressions outside the new targeted geometry assertions.

- [ ] **Step 3: Perform direct visual inspection without changing baselines**

Open the production homepage in Chromium and inspect VI and EN at:

```text
390×844
767×900
768×1024
1023×900
1024×900
1279×900
1280×900
1440×900
```

For every width, confirm:

- the intro reads eyebrow → title → description and the accent phrase stays part of the single `h3`;
- the photograph visibly shows workshop machinery and remains centred while cropping;
- the caption remains legible and does not cover important machinery detail;
- VI and EN cards have no clipped text or overflow;
- the `767/768` and `1023/1024` transitions match the one-column/2×2 and stacked/55:45 contracts;
- the CTA is left-aligned below `lg`, right-aligned at `lg+`, links to `/nha-xuong`, and has visible keyboard focus;
- reveal/reduced-motion behavior does not leave the section hidden.

Record whether Supabase media was available. If it was unavailable, keep the geometry result from the mocked-image Playwright test and explicitly mark the photographic visual check as externally blocked rather than claiming it passed.

- [ ] **Step 4: Optionally compare Chromium visual snapshots, never approve them**

Only if visual-regression evidence is needed, run:

```powershell
pnpm test:vr
```

Expected: existing homepage snapshots may fail because the redesign is intentional. Preserve and report the diff; do not run any approve/update-snapshot command. A non-zero visual result prevents an unqualified “all checks pass” claim until the user separately reviews and authorizes new baselines.

- [ ] **Step 5: Inspect final scope and report exact outcomes**

Run:

```powershell
git diff --check
git diff -- app/data/factory.ts app/data/site-images.ts app/pages/index.vue tests/homepage-machinery.test.ts tests/e2e/homepage-machinery-density.spec.ts
git status --short
```

Expected: no whitespace errors; only the approved subsection, its business/media data, and its targeted tests are new. Report exact exits, skipped checks, timeouts, unavailable external resources, and the pre-existing dirty files separately. Do not commit, push, or update baselines without explicit user permission.
