# `/gioi-thieu` Proof-First Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild `/gioi-thieu` as the approved seven-chapter proof-first company profile for project owners and design consultants.

**Architecture:** Keep `gioi-thieu.vue` as the route orchestrator, move About-specific bilingual copy and media alt text into `app/data/about.ts`, and derive facts/workflow/projects from their canonical data files. Add three page-specific presentation components for the proof strip, workflow rail, and project feature while reusing `AppHero`, `MediaImage`, the application shell, and the existing SEO/media/locale contracts.

**Tech Stack:** Nuxt 4.3.1, Vue 3.5.28, TypeScript 5.9.3, Tailwind CSS 4.1.18, Nuxt UI 4.4.0, Vitest 4.1.9, Playwright 1.61.1, pnpm 10.29.3, Node 22.

## Global Constraints

- Use Node 22 and pnpm 10.29.3; do not install, upgrade, or regenerate dependencies.
- Keep Vietnamese as the default and author every visible string and meaningful alt text as `LocalizedText` in `app/data/`.
- Reuse `company.ts`, `factory.ts`, `projects.ts`, generated media records, and current media helpers; do not duplicate verified facts.
- Never manually edit `app/media/catalog.generated.ts`, `app/media/fallback.generated.ts`, or `app/shared/media/manifest.json`.
- Do not hardcode `/images/` paths, Supabase URLs, or a deployment platform.
- Do not add a backend, database, email transport, analytics transport, form service, or new dependency.
- Preserve the global header, drawer, footer, skip link, shared `AppHero` geometry, SEO, and locale contracts.
- Keep `#production-workflow` and the complete six-step workflow because the homepage links to that anchor.
- Do not render unauthored founder, timeline, team, certification, award, client-logo, or testimonial content.
- Contact actions may navigate or call only; never imply that the frontend-only contact form sent, stored, or delivered an enquiry.
- Do not update Playwright visual baselines without separate explicit user approval.
- Do not commit, push, create branches, or stage changes unless the user explicitly authorizes that Git operation. Review checkpoints replace the commit steps normally present in this planning skill.
- Preserve unrelated user changes and inspect `git status --short` before and after every task.

---

## File Map

### Create

- `app/data/about.ts` — typed bilingual About-page editorial content, media alt text, ordered proof-stat IDs, and ordered case-study slugs.
- `app/components/AboutProofStrip.vue` — semantic three-fact `<dl>` using canonical `FactoryStat` records.
- `app/components/AboutWorkflowRail.vue` — the six-step responsive rail and `#production-workflow` anchor.
- `app/components/AboutProjectFeature.vue` — one accessible project feature using a `Project`, resolved cover `MediaImage`, labels, and an emphasis variant.
- `tests/about-page.test.ts` — Vitest contract for bilingual content, canonical selections, and media alt text.
- `tests/e2e/about-proof-first.spec.ts` — Playwright contract for seven-chapter order, canonical proof, responsive boundaries, SEO, focus, reduced motion, and removal of unauthored/legacy sections.

### Modify

- `app/pages/gioi-thieu.vue` — replace the current 776-line repeated section sequence with the approved data orchestration, SEO, and seven chapters.

### Do not modify

- `app/data/company.ts`, `app/data/factory.ts`, `app/data/projects.ts` — canonical inputs already expose the required facts, `ProductionStep`, workflow, contacts, SEO, and project records.
- `app/components/AppHero.vue`, `app/components/AppHeader.vue`, `app/components/AppFooter.vue` — shared contracts remain unchanged.
- `app/assets/css/main.css` — existing tokens and Tailwind utilities are sufficient; avoid global token churn.
- Visual snapshot PNGs — approval is a separate user-gated task.

---

### Task 1: Add the typed About content contract

**Files:**

- Create: `tests/about-page.test.ts`
- Create: `app/data/about.ts`

**Interfaces:**

- Consumes: `FactoryStat['id']`, `LocalizedText`, and canonical slugs from `projects.ts` in tests.
- Produces:
  - `AboutPageContent`
  - `AboutProjectLabels`
  - `AboutMediaKey`
  - `aboutPageContent`
  - `aboutMediaAlt`
  - `aboutProofStatIds`
  - `aboutProjectSlugs`

- [ ] **Step 1: Confirm the worktree is still scoped**

Run:

```powershell
git status --short
```

Expected: only the approved design spec and implementation plan are new; no application file is modified yet. If other files are dirty, record them and do not overwrite them.

- [ ] **Step 2: Write the failing data-contract test**

Create `tests/about-page.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import {
  aboutMediaAlt,
  aboutPageContent,
  aboutProjectSlugs,
  aboutProofStatIds
} from '../app/data/about'
import { factoryStats } from '../app/data/factory'
import { projects } from '../app/data/projects'

const locales = ['vi', 'en'] as const

const collectStrings = (value: unknown): string[] => {
  if (typeof value === 'string') return [value]
  if (Array.isArray(value)) return value.flatMap(collectStrings)
  if (value && typeof value === 'object') {
    return Object.values(value).flatMap(collectStrings)
  }
  return []
}

describe('about proof-first page data', () => {
  it('selects canonical proof facts in the approved order', () => {
    expect(aboutProofStatIds).toEqual([
      'footprint',
      'throughput',
      'end-to-end'
    ])

    const availableIds = new Set(factoryStats.map(stat => stat.id))
    expect(aboutProofStatIds.every(id => availableIds.has(id))).toBe(true)
  })

  it('selects the two approved project records in order', () => {
    expect(aboutProjectSlugs).toEqual([
      'khach-san-eo-gio',
      'codi-villa-phan-thiet'
    ])

    const availableSlugs = new Set(projects.map(project => project.slug))
    expect(aboutProjectSlugs.every(slug => availableSlugs.has(slug))).toBe(true)
  })

  it.each(locales)('contains no empty editorial or media copy in %s', (locale) => {
    const editorialStrings = collectStrings(aboutPageContent)
    expect(editorialStrings.every(value => value.trim().length > 0)).toBe(true)

    for (const alt of Object.values(aboutMediaAlt)) {
      expect(alt[locale].trim()).not.toBe('')
    }
  })

  it('does not duplicate canonical numeric factory facts in editorial copy', () => {
    const editorial = JSON.stringify(aboutPageContent)
    expect(editorial).not.toContain('3.000')
    expect(editorial).not.toContain('3,000')
    expect(editorial).not.toContain('50 phòng')
    expect(editorial).not.toContain('50 rooms')
  })
})
```

- [ ] **Step 3: Run the test and verify the expected failure**

Run:

```powershell
pnpm exec vitest run tests/about-page.test.ts
```

Expected: non-zero exit because `app/data/about.ts` does not exist.

- [ ] **Step 4: Add the complete About data module**

Create `app/data/about.ts`:

```ts
import type { FactoryStat } from './factory'
import type { LocalizedText } from '~/shared/types/localization'

type SectionIntro = {
  eyebrow: LocalizedText
  title: LocalizedText
  description: LocalizedText
}

type AboutResponse = {
  id: 'technical' | 'factory-control' | 'site-coordination'
  title: LocalizedText
  description: LocalizedText
}

export type AboutProjectLabels = {
  area: LocalizedText
  location: LocalizedText
  year: LocalizedText
  view: LocalizedText
}

export type AboutPageContent = {
  hero: {
    topic: LocalizedText
    title: LocalizedText
    specialTitle: LocalizedText
    subtitle: LocalizedText
    primaryCta: LocalizedText
    secondaryCta: LocalizedText
  }
  problem: SectionIntro & {
    lead: LocalizedText
    responses: readonly AboutResponse[]
  }
  workflow: SectionIntro
  factory: SectionIntro & { cta: LocalizedText }
  projects: SectionIntro & { labels: AboutProjectLabels }
  fit: {
    eyebrow: LocalizedText
    title: LocalizedText
    items: readonly LocalizedText[]
  }
  contact: {
    eyebrow: LocalizedText
    title: LocalizedText
    description: LocalizedText
    primaryCta: LocalizedText
    phoneCta: LocalizedText
  }
}

export type AboutMediaKey = 'hero' | 'factory' | 'machinery' | 'craft'

export const aboutProofStatIds = [
  'footprint',
  'throughput',
  'end-to-end'
] as const satisfies readonly FactoryStat['id'][]

export const aboutProjectSlugs = [
  'khach-san-eo-gio',
  'codi-villa-phan-thiet'
] as const

export const aboutPageContent = {
  hero: {
    topic: { vi: 'Nhà thầu nội thất dự án', en: 'Project interior contractor' },
    title: { vi: 'Từ bản vẽ đến', en: 'From drawings to' },
    specialTitle: { vi: 'công trình hoàn thiện', en: 'finished interiors' },
    subtitle: {
      vi: 'Một đầu mối cho phát triển kỹ thuật, sản xuất tại xưởng, kiểm soát chất lượng và lắp dựng tại công trình.',
      en: 'One accountable partner for technical development, in-house production, quality control and on-site installation.'
    },
    primaryCta: { vi: 'Trao đổi hồ sơ dự án', en: 'Discuss your project documents' },
    secondaryCta: { vi: 'Xem dự án đã thực hiện', en: 'View delivered work' }
  },
  problem: {
    eyebrow: { vi: 'Bài toán của chủ đầu tư', en: 'The owner’s delivery challenge' },
    title: {
      vi: 'Một thiết kế đẹp chỉ có giá trị khi triển khai được',
      en: 'A good design creates value only when it can be delivered'
    },
    description: {
      vi: 'Giá trị của hồ sơ thiết kế được quyết định bởi khả năng chuyển thành sản phẩm, phối hợp tại hiện trường và nghiệm thu đúng yêu cầu.',
      en: 'The value of a design is decided by whether it can become a finished product, coordinate on site and pass the agreed sign-off.'
    },
    lead: {
      vi: 'Chủ đầu tư cần kiểm soát đồng thời chất lượng, tiến độ và tính nhất quán giữa bản vẽ với hiện trường.',
      en: 'Owners need quality, schedule and consistency between drawings and site conditions controlled at the same time.'
    },
    responses: [
      {
        id: 'technical',
        title: { vi: 'Phát triển kỹ thuật', en: 'Technical development' },
        description: {
          vi: 'Chuyển ý tưởng thiết kế thành hồ sơ có thể bóc tách, sản xuất và phối hợp.',
          en: 'Turn design intent into documents that can be taken off, produced and coordinated.'
        }
      },
      {
        id: 'factory-control',
        title: { vi: 'Kiểm soát tại nguồn', en: 'Control at the source' },
        description: {
          vi: 'Đối chiếu vật liệu, kích thước và chất lượng hoàn thiện ngay tại xưởng.',
          en: 'Check materials, dimensions and finishing quality directly at the workshop.'
        }
      },
      {
        id: 'site-coordination',
        title: { vi: 'Phối hợp hiện trường', en: 'Site coordination' },
        description: {
          vi: 'Tổ chức giao lắp, phối hợp bộ môn và nghiệm thu theo từng giai đoạn.',
          en: 'Coordinate delivery, other trades and sign-off through each project stage.'
        }
      }
    ]
  },
  workflow: {
    eyebrow: { vi: 'Mô hình triển khai', en: 'Delivery model' },
    title: { vi: 'Sáu bước, một luồng trách nhiệm', en: 'Six stages, one line of responsibility' },
    description: {
      vi: 'Từ tiếp nhận bản vẽ và BOQ đến sản xuất, QC, lắp dựng và bàn giao, thông tin được chuyển tiếp trong một quy trình thống nhất.',
      en: 'From drawing and BOQ intake through production, QC, installation and handover, information moves through one coordinated process.'
    }
  },
  factory: {
    eyebrow: { vi: 'Năng lực nhìn thấy được', en: 'Capability you can see' },
    title: {
      vi: 'Xưởng, máy móc và tay nghề trong cùng một bằng chứng',
      en: 'Workshop, machinery and craft in one body of evidence'
    },
    description: {
      vi: 'Sản xuất trực tiếp giúp các quyết định về vật liệu, kỹ thuật và hoàn thiện được kiểm tra tại nguồn trước khi chuyển ra công trình.',
      en: 'Direct production lets material, technical and finishing decisions be checked at the source before work moves to site.'
    },
    cta: { vi: 'Xem đầy đủ năng lực nhà xưởng', en: 'Explore the full factory capability' }
  },
  projects: {
    eyebrow: { vi: 'Dự án tiêu biểu', en: 'Selected work' },
    title: { vi: 'Dự án nói thay năng lực', en: 'Delivered work is the evidence' },
    description: {
      vi: 'Hai quy mô khác nhau cho thấy cách Lai Huy giữ thiết kế, sản xuất và thi công trong cùng một phạm vi trách nhiệm.',
      en: 'Two different project scales show how Lai Huy keeps design, production and construction within one accountable scope.'
    },
    labels: {
      area: { vi: 'Diện tích', en: 'Area' },
      location: { vi: 'Địa điểm', en: 'Location' },
      year: { vi: 'Năm', en: 'Year' },
      view: { vi: 'Xem case study', en: 'View case study' }
    }
  },
  fit: {
    eyebrow: { vi: 'Dự án phù hợp', en: 'Project fit' },
    title: { vi: 'Lai Huy phù hợp khi dự án cần…', en: 'Lai Huy is a fit when the project needs…' },
    items: [
      {
        vi: 'Nội thất khách sạn và lưu trú với nhiều loại phòng cần đồng bộ.',
        en: 'Hospitality interiors with multiple room types that need consistent delivery.'
      },
      {
        vi: 'Villa hoặc căn hộ cần kiểm soát chi tiết từ bản vẽ đến lắp dựng.',
        en: 'Villas or apartments requiring detail control from drawings through installation.'
      },
      {
        vi: 'Gia công theo bản vẽ, OEM hoặc đơn hàng cần tổ chức sản xuất rõ ràng.',
        en: 'Make-to-drawing, OEM or export-ready orders requiring a clear production system.'
      }
    ]
  },
  contact: {
    eyebrow: { vi: 'Bắt đầu từ hồ sơ hiện có', en: 'Start with what you have' },
    title: {
      vi: 'Trao đổi bản vẽ, BOQ hoặc yêu cầu dự án',
      en: 'Discuss your drawings, BOQ or project requirements'
    },
    description: {
      vi: 'Xem thông tin liên hệ hoặc gọi trực tiếp để trao đổi phạm vi sản xuất và thi công phù hợp.',
      en: 'View the contact details or call directly to discuss an appropriate production and installation scope.'
    },
    primaryCta: { vi: 'Xem thông tin liên hệ', en: 'View contact details' },
    phoneCta: { vi: 'Gọi trực tiếp', en: 'Call directly' }
  }
} as const satisfies AboutPageContent

export const aboutMediaAlt: Record<AboutMediaKey, LocalizedText> = {
  hero: {
    vi: 'Toàn cảnh xưởng sản xuất nội thất Lai Huy',
    en: 'Inside the Lai Huy interior manufacturing workshop'
  },
  factory: {
    vi: 'Không gian xưởng sản xuất trực tiếp của Lai Huy',
    en: 'The directly operated Lai Huy production workshop'
  },
  machinery: {
    vi: 'Máy CNC nesting đang vận hành trong xưởng Lai Huy',
    en: 'A CNC nesting router operating in the Lai Huy workshop'
  },
  craft: {
    vi: 'Đội ngũ thợ Lai Huy hoàn thiện sản phẩm nội thất tại xưởng',
    en: 'Lai Huy craftspeople finishing interior work in the workshop'
  }
}
```

- [ ] **Step 5: Run the data-contract test and verify it passes**

Run:

```powershell
pnpm exec vitest run tests/about-page.test.ts
```

Expected: exit 0 with four passing tests.

- [ ] **Step 6: Run focused static checks for the new data module**

Run:

```powershell
pnpm exec eslint app/data/about.ts tests/about-page.test.ts
pnpm typecheck
```

Expected: both commands exit 0.

- [ ] **Step 7: Review the Task 1 diff without committing**

Run:

```powershell
git diff -- app/data/about.ts tests/about-page.test.ts
git diff --check
git status --short
```

Expected: only Task 1 files plus the approved spec/plan are new; no generated or unrelated file changed.

---

### Task 2: Implement the seven-chapter page with behavioral coverage

**Files:**

- Create: `tests/e2e/about-proof-first.spec.ts`
- Create: `app/components/AboutProofStrip.vue`
- Create: `app/components/AboutWorkflowRail.vue`
- Create: `app/components/AboutProjectFeature.vue`
- Modify: `app/pages/gioi-thieu.vue:1-776`

**Interfaces:**

- Consumes:
  - `aboutPageContent`, `aboutMediaAlt`, `aboutProofStatIds`, and `aboutProjectSlugs` from Task 1.
  - `factoryStats: readonly FactoryStat[]`.
  - `productionWorkflow: ProductionStep[]`.
  - `projects: Project[]`.
  - `requireWorkshopAsset(filename: string): MediaAsset`.
  - `projectCover(mediaId, alt, coverImage): MediaImage | undefined`.
- Produces:
  - `AboutProofStrip` props: `{ stats: readonly FactoryStat[] }`.
  - `AboutWorkflowRail` props: `{ content: AboutPageContent['workflow'], steps: readonly ProductionStep[] }`.
  - `AboutProjectFeature` props: `{ project: Project, image: MediaImage, labels: AboutProjectLabels, emphasis: 'primary' | 'secondary' }`.
  - Stable DOM contracts: `data-about-chapter`, `data-testid="about-proof-stat"`, `data-testid="about-workflow-step"`, `data-testid="about-factory-grid"`, `data-testid="about-project-grid"`, and `data-testid="about-project-feature"`.

- [ ] **Step 1: Write the failing browser contract**

Create `tests/e2e/about-proof-first.spec.ts`:

```ts
import type { Page } from '@playwright/test'
import {
  aboutPageContent,
  aboutProjectSlugs,
  aboutProofStatIds
} from '../../app/data/about'
import { factoryStats, productionWorkflow } from '../../app/data/factory'
import { projects } from '../../app/data/projects'
import { expect, test } from './fixtures'

const TEST_ORIGIN = process.env.DENSITY_TEST_ORIGIN ?? 'http://localhost:3000'
const TRANSPARENT_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M/wHwAF/gL+X9j7WQAAAABJRU5ErkJggg==',
  'base64'
)
const locales = ['vi', 'en'] as const
const chapterOrder = [
  'promise',
  'problem',
  'workflow',
  'factory',
  'projects',
  'fit',
  'contact'
] as const

async function openAbout(page: Page, locale: typeof locales[number], width = 1440) {
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
  await page.setViewportSize({ width, height: 900 })
  await page.goto('/gioi-thieu', { waitUntil: 'load' })
  await page.evaluate(() => document.fonts.ready)
}

const columnCount = (page: Page, testId: string) =>
  page.getByTestId(testId).evaluate(element =>
    getComputedStyle(element).gridTemplateColumns.trim().split(/\s+/).filter(Boolean).length
  )

for (const locale of locales) {
  test(`about renders the approved proof-first chapters in ${locale}`, async ({ page }) => {
    await openAbout(page, locale)

    const chapters = page.locator('main [data-about-chapter]')
    await expect(chapters).toHaveCount(7)
    expect(await chapters.evaluateAll(elements =>
      elements.map(element => element.getAttribute('data-about-chapter'))
    )).toEqual(chapterOrder)

    const hero = page.locator('[data-about-chapter="promise"]')
    await expect(hero.locator('h1')).toContainText(aboutPageContent.hero.title[locale])
    await expect(hero.locator('h1')).toContainText(aboutPageContent.hero.specialTitle[locale])
    await expect(hero.getByText(aboutPageContent.hero.subtitle[locale], { exact: true }))
      .toHaveCount(1)

    await expect(page.getByRole('heading', {
      name: aboutPageContent.problem.title[locale],
      exact: true
    })).toHaveCount(1)
    await expect(page.getByRole('heading', {
      name: aboutPageContent.workflow.title[locale],
      exact: true
    })).toHaveCount(1)
    await expect(page.getByRole('heading', {
      name: aboutPageContent.factory.title[locale],
      exact: true
    })).toHaveCount(1)
    await expect(page.getByRole('heading', {
      name: aboutPageContent.projects.title[locale],
      exact: true
    })).toHaveCount(1)
    await expect(page.getByRole('heading', {
      name: aboutPageContent.fit.title[locale],
      exact: true
    })).toHaveCount(1)
    await expect(page.getByRole('heading', {
      name: aboutPageContent.contact.title[locale],
      exact: true
    })).toHaveCount(1)
  })

  test(`about uses canonical proof, workflow and project data in ${locale}`, async ({ page }) => {
    await openAbout(page, locale)

    const selectedStats = aboutProofStatIds.map(id =>
      factoryStats.find(stat => stat.id === id)!
    )
    const stats = page.getByTestId('about-proof-stat')
    await expect(stats).toHaveCount(3)
    for (const [index, stat] of selectedStats.entries()) {
      await expect(stats.nth(index).locator('dt')).toHaveText(stat.label[locale])
      await expect(stats.nth(index).locator('dd')).toHaveText(stat.value[locale])
    }

    const workflow = page.getByTestId('about-workflow-step')
    await expect(workflow).toHaveCount(6)
    for (const [index, step] of productionWorkflow.entries()) {
      await expect(workflow.nth(index).getByRole('heading')).toHaveText(step.title[locale])
      await expect(workflow.nth(index).locator('p')).toHaveText(step.description[locale])
    }

    const features = page.getByTestId('about-project-feature')
    await expect(features).toHaveCount(2)
    for (const [index, slug] of aboutProjectSlugs.entries()) {
      const project = projects.find(item => item.slug === slug)!
      const feature = features.nth(index)
      await expect(feature).toHaveAttribute('href', `/du-an/${slug}`)
      await expect(feature.getByRole('heading')).toHaveText(project.name[locale])
      if (project.area) await expect(feature).toContainText(project.area[locale])
      if (project.location) await expect(feature).toContainText(project.location[locale])
      if (project.year) await expect(feature).toContainText(project.year[locale])
    }
  })
}

for (const width of [390, 767, 768, 1279, 1280, 1440] as const) {
  test(`about responsive contract at ${width}`, async ({ page }) => {
    await openAbout(page, 'vi', width)

    const overflow = await page.evaluate(() =>
      Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth
    )
    expect(overflow).toBeLessThanOrEqual(1)

    expect(await columnCount(page, 'about-proof-grid')).toBe(width >= 768 ? 3 : 1)
    expect(await columnCount(page, 'about-workflow-layout')).toBe(width >= 1280 ? 2 : 1)
    expect(await columnCount(page, 'about-workflow-grid')).toBe(width >= 768 ? 2 : 1)
    expect(await columnCount(page, 'about-factory-grid')).toBe(width >= 768 ? 2 : 1)
    expect(await columnCount(page, 'about-project-grid')).toBe(width >= 1280 ? 2 : 1)
  })
}

test('about preserves SEO, focus, reduced motion and authored-content boundaries', async ({ page }) => {
  await openAbout(page, 'vi', 390)

  await expect(page.locator('html')).toHaveAttribute('lang', 'vi')
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /\/gioi-thieu$/)
  expect(await page.evaluate(() =>
    matchMedia('(prefers-reduced-motion: reduce)').matches
  )).toBe(true)

  const aboutJsonLd = await page.locator('script[type="application/ld+json"]').evaluateAll(scripts =>
    scripts.flatMap((script) => {
      try {
        const value = JSON.parse(script.textContent ?? 'null')
        return Array.isArray(value) ? value : [value]
      } catch {
        return []
      }
    }).find(entry => entry?.['@type'] === 'AboutPage')
  )
  expect(aboutJsonLd).toBeTruthy()

  await expect(page.locator('#production-workflow')).toHaveCount(1)
  await expect(page.locator('main [role="dialog"]')).toHaveCount(0)
  await expect(page.locator('[data-about-optional="founder"]')).toHaveCount(0)
  await expect(page.locator('[data-about-optional="team"]')).toHaveCount(0)
  await expect(page.locator('[data-about-optional="testimonial"]')).toHaveCount(0)

  const firstProject = page.getByTestId('about-project-feature').first()
  await firstProject.focus()
  await expect(firstProject).toBeFocused()

  const contact = page.locator('[data-about-chapter="contact"]')
  await expect(contact.getByRole('link', {
    name: aboutPageContent.contact.primaryCta.vi,
    exact: true
  })).toHaveAttribute('href', '/lien-he')
  await expect(contact.getByRole('link', {
    name: new RegExp(aboutPageContent.contact.phoneCta.vi)
  })).toHaveAttribute('href', 'tel:+84903102012')
  await expect(contact).not.toContainText(/đã gửi|đã nhận|gửi thành công/i)
})
```

- [ ] **Step 2: Build the current application and verify the browser contract fails**

Run:

```powershell
pnpm build
pnpm exec playwright test --project=vr tests/e2e/about-proof-first.spec.ts
```

Expected: build exits 0; Playwright exits non-zero because the current page has no approved chapter/test IDs and still renders the legacy structure.

- [ ] **Step 3: Implement the semantic proof strip**

Create `app/components/AboutProofStrip.vue`:

```vue
<script setup lang="ts">
import type { FactoryStat } from '~/data/factory'

defineProps<{ stats: readonly FactoryStat[] }>()

const { t } = useLanguage()
</script>

<template>
  <div class="border-b border-ink-200 bg-white">
    <div class="shell">
      <dl
        data-testid="about-proof-grid"
        class="grid grid-cols-1 md:grid-cols-3"
      >
        <div
          v-for="(stat, index) in stats"
          :key="stat.id"
          v-reveal="index * 70"
          data-testid="about-proof-stat"
          :data-stat-id="stat.id"
          class="reveal border-b border-ink-200 py-6 md:border-b-0 md:border-r md:px-6 md:first:pl-0 md:last:border-r-0 md:last:pr-0"
        >
          <Icon
            :name="stat.icon"
            class="h-5 w-5 text-wood-600"
            aria-hidden="true"
          />
          <dt class="mt-4 text-xs font-bold uppercase tracking-[0.14em] text-ink-600">
            {{ t(stat.label) }}
          </dt>
          <dd class="mt-2 text-2xl font-black text-ink-950 md:text-3xl">
            {{ t(stat.value) }}
          </dd>
        </div>
      </dl>
    </div>
  </div>
</template>
```

- [ ] **Step 4: Implement the responsive workflow rail**

Create `app/components/AboutWorkflowRail.vue`:

```vue
<script setup lang="ts">
import type { AboutPageContent } from '~/data/about'
import type { ProductionStep } from '~/data/factory'

defineProps<{
  content: AboutPageContent['workflow']
  steps: readonly ProductionStep[]
}>()

const { t } = useLanguage()
const sequence = (index: number) => String(index + 1).padStart(2, '0')
</script>

<template>
  <section
    id="production-workflow"
    data-about-chapter="workflow"
    class="section-y scroll-mt-[calc(var(--header-h)+1rem)] bg-ink-950 text-white"
  >
    <div class="shell">
      <div
        data-testid="about-workflow-layout"
        class="grid gap-10 xl:grid-cols-[0.7fr_1.3fr] xl:gap-16"
      >
        <div>
          <p
            v-reveal
            class="eyebrow reveal text-wood-200"
          >
            {{ t(content.eyebrow) }}
          </p>
          <h2
            v-reveal="80"
            class="text-section-title reveal mt-4 font-black uppercase"
          >
            {{ t(content.title) }}
          </h2>
          <p
            v-reveal="140"
            class="reveal mt-5 text-lg leading-8 text-white/70"
          >
            {{ t(content.description) }}
          </p>
        </div>

        <ol
          data-testid="about-workflow-grid"
          class="grid border-l border-t border-white/15 md:grid-cols-2"
        >
          <li
            v-for="(step, index) in steps"
            :key="t(step.title)"
            v-reveal="(index % 2) * 70"
            data-testid="about-workflow-step"
            class="reveal border-b border-r border-white/15 p-6"
          >
            <span class="text-xs font-black tracking-[0.16em] text-wood-300">
              {{ sequence(index) }}
            </span>
            <h3 class="mt-5 text-lg font-black">
              {{ t(step.title) }}
            </h3>
            <p class="mt-3 text-sm leading-6 text-white/70">
              {{ t(step.description) }}
            </p>
          </li>
        </ol>
      </div>
    </div>
  </section>
</template>
```

- [ ] **Step 5: Implement the project feature component**

Create `app/components/AboutProjectFeature.vue`:

```vue
<script setup lang="ts">
import type { AboutProjectLabels } from '~/data/about'
import { categoryDefinitions } from '~/data/categories'
import type { MediaImage } from '~/shared/media/types'
import type { Project } from '~/shared/types/project'

const props = defineProps<{
  project: Project
  image: MediaImage
  labels: AboutProjectLabels
  emphasis: 'primary' | 'secondary'
}>()

const { t, ta } = useLanguage()
const scope = computed(() => props.project.scope ? ta(props.project.scope).join(' · ') : '')
</script>

<template>
  <NuxtLink
    :to="`/du-an/${project.slug}`"
    data-testid="about-project-feature"
    :data-project-slug="project.slug"
    class="group block overflow-hidden rounded-2xl bg-ink-950 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-wood-500"
  >
    <article>
      <MediaImage
        :image="image"
        preset="card"
        :sizes="emphasis === 'primary' ? 'sm:100vw xl:60vw' : 'sm:100vw xl:40vw'"
        :class="emphasis === 'primary' ? 'aspect-[16/10]' : 'aspect-[4/3]'"
        img-class="transition-transform duration-700 ease-out group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
      />
      <div class="p-6 md:p-8">
        <p class="text-xs font-black uppercase tracking-[0.14em] text-wood-300">
          {{ t(categoryDefinitions[project.category].label) }}
          <span v-if="scope"> · {{ scope }}</span>
        </p>
        <h3
          class="mt-4 font-black uppercase"
          :class="emphasis === 'primary' ? 'text-2xl md:text-3xl' : 'text-xl md:text-2xl'"
        >
          {{ t(project.name) }}
        </h3>
        <p class="mt-4 text-sm leading-6 text-white/70">
          {{ t(project.shortDescription) }}
        </p>

        <dl class="mt-6 grid gap-4 border-t border-white/15 pt-5 sm:grid-cols-3">
          <div v-if="project.area">
            <dt class="text-xs uppercase tracking-[0.12em] text-white/50">
              {{ t(labels.area) }}
            </dt>
            <dd class="mt-1 text-sm font-bold">
              {{ t(project.area) }}
            </dd>
          </div>
          <div v-if="project.location">
            <dt class="text-xs uppercase tracking-[0.12em] text-white/50">
              {{ t(labels.location) }}
            </dt>
            <dd class="mt-1 text-sm font-bold">
              {{ t(project.location) }}
            </dd>
          </div>
          <div v-if="project.year">
            <dt class="text-xs uppercase tracking-[0.12em] text-white/50">
              {{ t(labels.year) }}
            </dt>
            <dd class="mt-1 text-sm font-bold">
              {{ t(project.year) }}
            </dd>
          </div>
        </dl>

        <span class="mt-7 inline-flex items-center gap-2 text-sm font-black text-wood-200">
          {{ t(labels.view) }}
          <Icon
            name="i-lucide-arrow-right"
            class="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none"
            aria-hidden="true"
          />
        </span>
      </div>
    </article>
  </NuxtLink>
</template>
```

- [ ] **Step 6: Replace the About page script with canonical orchestration and preserved SEO**

Replace the `<script setup>` block in `app/pages/gioi-thieu.vue` with:

```vue
<script setup lang="ts">
import {
  aboutMediaAlt,
  aboutPageContent,
  aboutProjectSlugs,
  aboutProofStatIds
} from '~/data/about'
import { company } from '~/data/company'
import { factoryStats, productionWorkflow } from '~/data/factory'
import { projects } from '~/data/projects'
import { companyMedia } from '~/media/catalog.generated'
import { requireWorkshopAsset } from '~/media/factory-media'
import { projectCover, withAlt } from '~/media/project-media'

const { t } = useLanguage()
const { resolve: mediaUrl } = useMediaUrl()

const heroImage = withAlt(requireWorkshopAsset('3.webp'), aboutMediaAlt.hero)
const factoryImages = {
  main: withAlt(requireWorkshopAsset('4.webp'), aboutMediaAlt.factory),
  machinery: withAlt(requireWorkshopAsset('8.webp'), aboutMediaAlt.machinery),
  craft: withAlt(companyMedia.companyStory, aboutMediaAlt.craft)
}

const proofStats = aboutProofStatIds.flatMap((id) => {
  const stat = factoryStats.find(item => item.id === id)
  return stat ? [stat] : []
})

const projectFeatures = aboutProjectSlugs.flatMap((slug) => {
  const project = projects.find(item => item.slug === slug)
  if (!project) return []

  const image = projectCover(project.mediaId, project.name, project.coverImage)
  return image ? [{ project, image }] : []
})

const phoneHref = `tel:${company.phone.replaceAll(' ', '')}`
const seoTitle = computed(() => t(company.seo.about.title))
const seoDescription = computed(() => t(company.seo.about.description))

usePageSeo({
  path: '/gioi-thieu',
  title: seoTitle,
  description: seoDescription,
  imagePath: heroImage.path,
  jsonLd: ({ base, canonical }) => [
    buildBreadcrumbLd(base, t, [
      { name: { vi: 'Trang chủ', en: 'Home' }, path: '/' },
      { name: { vi: 'Giới thiệu', en: 'About' }, path: '/gioi-thieu' }
    ]),
    buildOrganizationLd(base, t),
    {
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      '@id': `${canonical}#about`,
      'url': canonical,
      'name': seoTitle.value,
      'description': seoDescription.value,
      'primaryImageOfPage': mediaUrl(heroImage.path, { width: 1600 }),
      'about': { '@id': `${base}#organization` },
      'mainEntity': { '@id': `${base}#organization` }
    }
  ]
})
</script>
```

- [ ] **Step 7: Replace the About page template with the seven approved chapters**

Replace the `<template>` block in `app/pages/gioi-thieu.vue` with:

```vue
<template>
  <div class="bg-white">
    <div data-about-chapter="promise">
      <AppHero
        data-testid="about-hero"
        :topic="t(aboutPageContent.hero.topic)"
        :title="t(aboutPageContent.hero.title)"
        :special-title="t(aboutPageContent.hero.specialTitle)"
        :subtitle="t(aboutPageContent.hero.subtitle)"
        :image="heroImage"
        focal="50% 40%"
      >
        <template #actions>
          <NuxtLink
            to="/lien-he"
            class="btn-primary"
          >
            {{ t(aboutPageContent.hero.primaryCta) }}
            <Icon
              name="i-lucide-arrow-right"
              class="h-4 w-4"
              aria-hidden="true"
            />
          </NuxtLink>
          <NuxtLink
            to="/du-an"
            class="btn-secondary"
          >
            {{ t(aboutPageContent.hero.secondaryCta) }}
          </NuxtLink>
        </template>
      </AppHero>

      <AboutProofStrip :stats="proofStats" />
    </div>

    <section
      data-about-chapter="problem"
      class="section-y bg-ink-50"
    >
      <div class="shell">
        <p
          v-reveal
          class="eyebrow reveal"
        >
          {{ t(aboutPageContent.problem.eyebrow) }}
        </p>
        <h2
          v-reveal="80"
          class="text-section-title reveal mt-4 max-w-4xl font-black uppercase text-ink-950"
        >
          {{ t(aboutPageContent.problem.title) }}
        </h2>
        <p
          v-reveal="140"
          class="measure-lead reveal mt-5 text-ink-600"
        >
          {{ t(aboutPageContent.problem.description) }}
        </p>

        <div class="mt-12 grid gap-10 xl:grid-cols-[0.72fr_1.28fr] xl:gap-16">
          <p
            v-reveal
            class="reveal border-l-2 border-wood-500 pl-6 text-xl font-black leading-8 text-ink-950"
          >
            {{ t(aboutPageContent.problem.lead) }}
          </p>
          <ol class="border-t border-ink-200">
            <li
              v-for="(response, index) in aboutPageContent.problem.responses"
              :key="response.id"
              v-reveal="index * 70"
              class="reveal grid gap-3 border-b border-ink-200 py-6 sm:grid-cols-[3rem_0.8fr_1.2fr] sm:gap-6"
            >
              <span class="text-xs font-black tracking-[0.16em] text-wood-600">
                {{ String(index + 1).padStart(2, '0') }}
              </span>
              <h3 class="text-lg font-black text-ink-950">
                {{ t(response.title) }}
              </h3>
              <p class="text-sm leading-6 text-ink-600">
                {{ t(response.description) }}
              </p>
            </li>
          </ol>
        </div>
      </div>
    </section>

    <AboutWorkflowRail
      :content="aboutPageContent.workflow"
      :steps="productionWorkflow"
    />

    <section
      data-about-chapter="factory"
      class="section-y bg-white"
    >
      <div class="shell">
        <p
          v-reveal
          class="eyebrow reveal"
        >
          {{ t(aboutPageContent.factory.eyebrow) }}
        </p>
        <h2
          v-reveal="80"
          class="text-section-title reveal mt-4 max-w-4xl font-black uppercase text-ink-950"
        >
          {{ t(aboutPageContent.factory.title) }}
        </h2>
        <p
          v-reveal="140"
          class="measure-lead reveal mt-5 text-ink-600"
        >
          {{ t(aboutPageContent.factory.description) }}
        </p>

        <div
          data-testid="about-factory-grid"
          class="mt-10 grid gap-5 md:grid-cols-[1.15fr_0.85fr]"
        >
          <MediaImage
            :image="factoryImages.main"
            sizes="sm:100vw md:58vw"
            class="min-h-72 rounded-2xl md:min-h-full"
            img-class="object-center"
          />
          <div class="grid gap-5">
            <MediaImage
              :image="factoryImages.machinery"
              sizes="sm:100vw md:42vw"
              class="aspect-[16/10] rounded-2xl"
              img-class="object-center"
            />
            <MediaImage
              :image="factoryImages.craft"
              sizes="sm:100vw md:42vw"
              class="aspect-[16/10] rounded-2xl"
              img-class="object-center"
            />
          </div>
        </div>

        <NuxtLink
          v-reveal="120"
          to="/nha-xuong"
          class="btn-dark reveal mt-8"
        >
          {{ t(aboutPageContent.factory.cta) }}
          <Icon
            name="i-lucide-arrow-right"
            class="h-4 w-4"
            aria-hidden="true"
          />
        </NuxtLink>
      </div>
    </section>

    <section
      v-if="projectFeatures.length"
      data-about-chapter="projects"
      class="section-y bg-ink-50"
    >
      <div class="shell">
        <p
          v-reveal
          class="eyebrow reveal"
        >
          {{ t(aboutPageContent.projects.eyebrow) }}
        </p>
        <h2
          v-reveal="80"
          class="text-section-title reveal mt-4 max-w-4xl font-black uppercase text-ink-950"
        >
          {{ t(aboutPageContent.projects.title) }}
        </h2>
        <p
          v-reveal="140"
          class="measure-lead reveal mt-5 text-ink-600"
        >
          {{ t(aboutPageContent.projects.description) }}
        </p>

        <div
          data-testid="about-project-grid"
          class="mt-10 grid gap-5"
          :class="projectFeatures.length > 1 ? 'xl:grid-cols-[3fr_2fr]' : 'grid-cols-1'"
        >
          <AboutProjectFeature
            v-for="(feature, index) in projectFeatures"
            :key="feature.project.slug"
            :project="feature.project"
            :image="feature.image"
            :labels="aboutPageContent.projects.labels"
            :emphasis="index === 0 ? 'primary' : 'secondary'"
          />
        </div>
      </div>
    </section>

    <section
      data-about-chapter="fit"
      class="section-y bg-white"
    >
      <div class="shell">
        <p
          v-reveal
          class="eyebrow reveal"
        >
          {{ t(aboutPageContent.fit.eyebrow) }}
        </p>
        <h2
          v-reveal="80"
          class="text-section-title reveal mt-4 max-w-4xl font-black uppercase text-ink-950"
        >
          {{ t(aboutPageContent.fit.title) }}
        </h2>
        <ol class="mt-10 grid border-l border-t border-ink-200 md:grid-cols-3">
          <li
            v-for="(item, index) in aboutPageContent.fit.items"
            :key="t(item)"
            v-reveal="index * 70"
            class="reveal border-b border-r border-ink-200 p-6"
          >
            <span class="text-xs font-black tracking-[0.16em] text-wood-600">
              {{ String(index + 1).padStart(2, '0') }}
            </span>
            <p class="mt-5 text-base font-black leading-7 text-ink-950">
              {{ t(item) }}
            </p>
          </li>
        </ol>
      </div>
    </section>

    <section
      data-about-chapter="contact"
      class="section-y bg-ink-950 text-white"
    >
      <div class="shell text-center">
        <p class="eyebrow text-wood-200">
          {{ t(aboutPageContent.contact.eyebrow) }}
        </p>
        <h2 class="mx-auto mt-4 max-w-4xl text-3xl font-black uppercase leading-tight md:text-5xl">
          {{ t(aboutPageContent.contact.title) }}
        </h2>
        <p class="mx-auto mt-5 max-w-2xl text-lg leading-8 text-white/70">
          {{ t(aboutPageContent.contact.description) }}
        </p>
        <div class="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <NuxtLink
            to="/lien-he"
            class="btn-primary"
          >
            {{ t(aboutPageContent.contact.primaryCta) }}
          </NuxtLink>
          <a
            :href="phoneHref"
            class="btn-secondary"
          >
            {{ t(aboutPageContent.contact.phoneCta) }} · {{ company.phone }}
          </a>
        </div>
      </div>
    </section>
  </div>
</template>
```

- [ ] **Step 8: Build and run the focused unit and browser tests**

Run:

```powershell
pnpm exec vitest run tests/about-page.test.ts
pnpm build
pnpm exec playwright test --project=vr tests/e2e/about-proof-first.spec.ts
pnpm exec playwright test --project=vr tests/e2e/workflow-density.spec.ts
```

Expected: all four commands exit 0. The workflow-density suite confirms the homepage anchor still lands below sticky chrome and the About page still owns all six descriptions.

- [ ] **Step 9: Run focused lint, media, and type checks**

Run:

```powershell
pnpm exec eslint app/data/about.ts app/components/AboutProofStrip.vue app/components/AboutWorkflowRail.vue app/components/AboutProjectFeature.vue app/pages/gioi-thieu.vue tests/about-page.test.ts tests/e2e/about-proof-first.spec.ts
pnpm lint:media
pnpm typecheck
```

Expected: all commands exit 0; the media guard finds no raw `/images/` or Supabase literal.

- [ ] **Step 10: Review the vertical-slice diff without committing**

Run:

```powershell
git diff -- app/data/about.ts app/components/AboutProofStrip.vue app/components/AboutWorkflowRail.vue app/components/AboutProjectFeature.vue app/pages/gioi-thieu.vue tests/about-page.test.ts tests/e2e/about-proof-first.spec.ts
git diff --check
git status --short
```

Expected: the diff contains only the approved About redesign, its content module, three bounded components, and tests. Generated media, snapshots, and unrelated routes remain untouched.

---

### Task 3: Run the complete verification and visual-review gate

**Files:**

- Verify: all files from Tasks 1–2.
- Potentially modify only after a real failure is diagnosed: files already listed in Tasks 1–2.
- Restricted: `tests/e2e/visual.spec.ts-snapshots/about-*.png` remain unchanged unless the user grants separate explicit baseline approval.

**Interfaces:**

- Consumes: the complete seven-chapter implementation and the repository's existing CI/gate commands.
- Produces: an evidence report with exact exit codes, affected external resources, visual diffs, and any remaining blocker.

- [ ] **Step 1: Re-check repository state before broad verification**

Run:

```powershell
git status --short
git diff --check
```

Expected: no unrelated or generated files are present. Stop and investigate any unexpected change before running broad checks.

- [ ] **Step 2: Run the CI-parity static sequence**

Run each command separately and record its exit code:

```powershell
pnpm lint
pnpm lint:media
pnpm test
pnpm typecheck
pnpm build
```

Expected: every command exits 0. Build before Playwright so `.output` matches the new source.

- [ ] **Step 3: Run the targeted About and shared workflow browser coverage**

Run:

```powershell
pnpm exec playwright test --project=vr tests/e2e/about-proof-first.spec.ts
pnpm exec playwright test --project=vr tests/e2e/workflow-density.spec.ts
```

Expected: both commands exit 0 in Chromium with images stubbed by the focused About spec and normal route behavior in the existing workflow suite.

- [ ] **Step 4: Run the affected shared gates**

Run each command separately:

```powershell
pnpm test:gates:layout
pnpm test:gates:a11y
pnpm test:gates:hero
```

Expected: each command exits 0. If the known Windows Playwright shutdown hang occurs after passing assertions, report the timeout/non-zero exit as a failure; do not call the command passing.

- [ ] **Step 5: Run the visual comparison without approving snapshots**

Run:

```powershell
pnpm exec playwright test --project=vr tests/e2e/visual.spec.ts --grep "about"
```

Expected: the command may exit non-zero because the approved redesign intentionally differs from the committed About snapshots. Preserve the generated diff artifacts and report the result. Do not run `pnpm test:vr:approve`, `pnpm test:vr:all:approve`, or any `--update-snapshots` command.

- [ ] **Step 6: Perform direct responsive and locale review**

Using the built application, inspect `/gioi-thieu` in Chromium at these widths for both `vi` and `en`:

```text
390, 767, 768, 1279, 1280, 1440
```

Verify:

```text
- Hero crop is stable between locales.
- Proof strip changes from one to three columns at 768px.
- Workflow changes from one to two step columns at 768px and gains the 40/60 shell split at 1280px.
- Factory proof changes from one to two columns at 768px.
- Project features change from one column to 60/40 at 1280px.
- No horizontal overflow, clipped English copy, empty metadata row, or nested interactive target appears.
- Keyboard order follows the seven chapters and focus remains visible.
- Reduced motion shows every section immediately.
```

Record whether Supabase images are available, blocked, or slow. External media availability is evidence context, not a reason to hide a failed assertion.

- [ ] **Step 7: Request the separate visual-baseline decision**

Present the About visual diffs to the user. If and only if the user explicitly approves changing the baselines, run:

```powershell
pnpm exec playwright test --project=vr tests/e2e/visual.spec.ts --grep "about" --update-snapshots
pnpm exec playwright test --project=vr tests/e2e/visual.spec.ts --grep "about"
```

Expected after explicit approval: the update command exits 0, only the Chromium `about-*.png` baselines change, and the comparison rerun exits 0. Do not update Edge, Firefox, or WebKit baselines unless the user separately approves the broader scope.

- [ ] **Step 8: Inspect the final diff and status**

Run:

```powershell
git diff --stat
git diff --check
git status --short
```

Review every modified/untracked file. Confirm:

```text
- No generated catalog, manifest, dependency, lockfile, historical screenshot, or unrelated route changed.
- The contact CTA does not claim successful delivery.
- Both selected projects use canonical scope/area/location/year values.
- All checks that are claimed passing exited 0.
- Any skipped, timed-out, non-zero, or externally blocked check is named in the handoff.
```

Do not stage or commit unless the user explicitly authorizes that Git operation after reviewing the completed implementation.

---

## Execution Checkpoints

1. **After Task 1:** The bilingual data contract and canonical selections pass Vitest and typecheck.
2. **After Task 2:** The complete seven-chapter page passes its focused Playwright contract and the pre-existing workflow anchor suite.
3. **After Task 3:** Static checks, build, shared gates, responsive review, and visual-diff evidence are reported with exact command results.
4. **Separate approval gate:** Snapshot updates and all Git operations remain user-controlled.
