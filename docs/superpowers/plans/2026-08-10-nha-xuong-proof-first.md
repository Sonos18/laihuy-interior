# Nhà xưởng Proof-first Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign `/nha-xuong` into a shorter proof-first B2B capability page with no gallery, shared bilingual data, four production stages, combined people/QC proof, two audience messages, four FAQs, and a factory-visit CTA.

**Architecture:** Keep `app/pages/nha-xuong.vue` as the route-level composition layer. Move bilingual business content into `app/data/factory.ts`, join catalog assets to business alt text in a new `app/media/factory-media.ts`, and extract only the three bounded presentation units approved in the design: stats, production proof, and visit CTA. All interactions remain local and link-based; no backend or new remote state is introduced.

**Tech Stack:** Nuxt 4.3.1, Vue 3.5.28, TypeScript 5.9.3, Tailwind CSS 4.1.18, Nuxt UI 4.4.0, Vitest 4.1.9, Playwright 1.61.1, `@axe-core/playwright` 4.12.1, pnpm 10.29.3, Node 22.

## Global Constraints

- Use `pnpm@10.29.3` and Node 22; do not use npm or yarn.
- Do not add, upgrade, or remove dependencies.
- Keep Vietnamese as the default locale and provide complete `LocalizedText` values for VI and EN.
- Keep business copy and alt text in `app/data/`; never edit generated catalog files or the media manifest by hand.
- Render media through generated entries plus `MediaImage`/`useMediaUrl`; do not hardcode `/images/` or Supabase object URLs.
- Do not add a backend, database, email service, analytics transport, booking system, or third-party form transport.
- Do not claim that a visit was booked or an enquiry was delivered; CTA actions only open `tel:` and Google Maps.
- Keep `app/assets/css/layers.css` before `app/assets/css/main.css` in `nuxt.config.ts`; this plan does not modify either order.
- Preserve the shared header, drawer, footer, `AppHero`, locale and SEO contracts.
- Do not run `test:vr:approve`, `test:vr:all:approve`, or update snapshots without explicit user approval.
- Verify both locales at `390`, `767/768`, `1279/1280`, and `1440`.
- Recheck `git status --short` before execution. The current worktree has unrelated user work in `app/components/MediaImage.vue`, `tests/e2e/image-loading-motion.spec.ts` and matching remove-image-loading-pulse docs; preserve it and do not fold it into this redesign.
- Repository instructions override the skill's frequent-commit default: end every task with a diff/status checkpoint and do not commit unless the user explicitly authorizes it. Suggested commit messages are recorded for later use only.

## File Map

### Create

- `app/media/factory-media.ts` — deterministic workshop-asset lookup and five named, alt-complete factory images.
- `app/components/FactoryStatsStrip.vue` — semantic four-stat proof rail.
- `app/components/FactoryProcessProof.vue` — production overview image plus four machinery process groups.
- `app/components/FactoryVisitCta.vue` — factory address, hours, phone and Maps actions.
- `tests/factory-page.test.ts` — bilingual data-shape and content-contract tests.
- `tests/factory-media.test.ts` — media lookup, uniqueness and missing-asset failure tests.
- `tests/e2e/factory-proof-first.spec.ts` — route structure, CTA, locale, FAQ/JSON-LD and responsive contracts.

### Modify

- `app/data/factory.ts` — add page content, stats, pillars, audiences, media alt text and four FAQs; reduce QC to the approved four checkpoints; retain shared homepage machinery exports.
- `app/pages/nha-xuong.vue` — remove inline business data, gallery/filter/lightbox state and legacy equipment/capacity sections; compose the seven approved content rhythms.
- `tests/e2e/workflow-density.spec.ts` — update the factory-owned QC contract from five legacy bullets to four approved checkpoints.

### Explicitly unchanged

- `app/media/catalog.generated.ts`
- `app/media/fallback.generated.ts`
- `app/shared/media/manifest.json`
- `app/assets/css/layers.css`
- `app/components/MediaImage.vue` — consume its existing public props only; preserve the unrelated loading-placeholder change.
- `nuxt.config.ts`
- Playwright snapshots until a separate approval gate

---

### Task 1: Establish the bilingual factory-page data contract

**Files:**

- Create: `tests/factory-page.test.ts`
- Modify: `app/data/factory.ts`

**Interfaces:**

- Produces: `FactoryStat`, `FactoryPillar`, `FactoryAudience`, `FactoryFaq`, `FactoryMediaKey`, `FactoryPageContent`.
- Produces values: `factoryPageContent`, `factoryStats`, `factoryPillars`, `factoryAudiences`, `factoryFaqs`, `factoryMediaAlt`, `qualityControl`.
- Preserves: `factoryCapabilities`, `machinerySectionContent`, `machineryProcessGroups`, `productionWorkflow`.

- [ ] **Step 1: Write the failing data-contract test**

Create `tests/factory-page.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import {
  factoryAudiences,
  factoryFaqs,
  factoryMediaAlt,
  factoryPageContent,
  factoryPillars,
  factoryStats,
  machineryProcessGroups,
  qualityControl
} from '../app/data/factory'

const locales = ['vi', 'en'] as const

describe('factory proof-first page data', () => {
  it('defines the approved proof-first section data in stable order', () => {
    expect(factoryStats.map(item => item.id)).toEqual([
      'footprint',
      'throughput',
      'end-to-end',
      'reach'
    ])
    expect(factoryPillars.map(item => item.id)).toEqual([
      'direct-factory',
      'machinery',
      'craft',
      'quality'
    ])
    expect(factoryAudiences.map(item => item.id)).toEqual([
      'owners',
      'design-contractors'
    ])
    expect(factoryFaqs.map(item => item.id)).toEqual([
      'lead-time',
      'make-to-drawing',
      'materials-quality',
      'nationwide-installation'
    ])
    expect(machineryProcessGroups).toHaveLength(4)
    expect(qualityControl).toHaveLength(4)
  })

  it.each(locales)('contains no empty approved copy in %s', (locale) => {
    expect(factoryPageContent.hero.topic[locale]).not.toBe('')
    expect(factoryPageContent.hero.title[locale]).not.toBe('')
    expect(factoryPageContent.hero.specialTitle[locale]).not.toBe('')
    expect(factoryPageContent.hero.subtitle[locale]).not.toBe('')
    expect(factoryPageContent.hero.primaryCta[locale]).not.toBe('')
    expect(factoryPageContent.hero.secondaryCta[locale]).not.toBe('')
    for (const section of [
      factoryPageContent.pillars,
      factoryPageContent.process,
      factoryPageContent.peopleQuality,
      factoryPageContent.audiences
    ]) {
      expect(section.eyebrow[locale]).not.toBe('')
      expect(section.title[locale]).not.toBe('')
      expect(section.description[locale]).not.toBe('')
    }
    expect(factoryPageContent.faq.eyebrow[locale]).not.toBe('')
    expect(factoryPageContent.faq.title[locale]).not.toBe('')
    expect(factoryPageContent.visit.eyebrow[locale]).not.toBe('')
    expect(factoryPageContent.visit.title[locale]).not.toBe('')
    expect(factoryPageContent.visit.description[locale]).not.toBe('')
    expect(factoryPageContent.visit.phoneCta[locale]).not.toBe('')
    expect(factoryPageContent.visit.mapCta[locale]).not.toBe('')

    for (const stat of factoryStats) {
      expect(stat.value[locale]).not.toBe('')
      expect(stat.label[locale]).not.toBe('')
    }
    for (const pillar of factoryPillars) {
      expect(pillar.title[locale]).not.toBe('')
      expect(pillar.description[locale]).not.toBe('')
    }
    for (const audience of factoryAudiences) {
      expect(audience.title[locale]).not.toBe('')
      expect(audience.points).toHaveLength(3)
      expect(audience.points.every(point => point[locale] !== '')).toBe(true)
    }
    for (const faq of factoryFaqs) {
      expect(faq.question[locale]).not.toBe('')
      expect(faq.answer[locale]).not.toBe('')
    }
    for (const alt of Object.values(factoryMediaAlt)) {
      expect(alt[locale]).not.toBe('')
    }
  })

  it('keeps FAQ questions unique in each locale', () => {
    for (const locale of locales) {
      const questions = factoryFaqs.map(faq => faq.question[locale])
      expect(new Set(questions).size).toBe(questions.length)
    }
  })
})
```

- [ ] **Step 2: Run the test and verify the missing exports fail**

Run:

```powershell
pnpm exec vitest run tests/factory-page.test.ts
```

Expected: non-zero exit with an import/export error for `factoryPageContent` or another new factory export.

- [ ] **Step 3: Add exact types and data**

Append the following types and exports to `app/data/factory.ts`. Replace the existing five-entry `qualityControl` export with the four-entry version below; do not change the existing machinery groups.

```ts
export type FactoryStat = {
  id: 'footprint' | 'throughput' | 'end-to-end' | 'reach'
  icon: string
  value: LocalizedText
  label: LocalizedText
}

export type FactoryPillar = {
  id: 'direct-factory' | 'machinery' | 'craft' | 'quality'
  icon: string
  title: LocalizedText
  description: LocalizedText
}

export type FactoryAudience = {
  id: 'owners' | 'design-contractors'
  title: LocalizedText
  points: readonly LocalizedText[]
}

export type FactoryFaq = {
  id: 'lead-time' | 'make-to-drawing' | 'materials-quality' | 'nationwide-installation'
  question: LocalizedText
  answer: LocalizedText
}

export type FactoryMediaKey = 'hero' | 'facade' | 'process' | 'people' | 'visit'

export type FactoryPageContent = {
  hero: {
    topic: LocalizedText
    title: LocalizedText
    specialTitle: LocalizedText
    subtitle: LocalizedText
    primaryCta: LocalizedText
    secondaryCta: LocalizedText
  }
  pillars: { eyebrow: LocalizedText, title: LocalizedText, description: LocalizedText }
  process: { eyebrow: LocalizedText, title: LocalizedText, description: LocalizedText }
  peopleQuality: { eyebrow: LocalizedText, title: LocalizedText, description: LocalizedText }
  audiences: { eyebrow: LocalizedText, title: LocalizedText, description: LocalizedText }
  faq: { eyebrow: LocalizedText, title: LocalizedText }
  visit: {
    eyebrow: LocalizedText
    title: LocalizedText
    description: LocalizedText
    phoneCta: LocalizedText
    mapCta: LocalizedText
  }
}

export const factoryPageContent: FactoryPageContent = {
  hero: {
    topic: { vi: 'Năng lực nhà xưởng', en: 'Factory capability' },
    title: { vi: 'Sản xuất trực tiếp.', en: 'Direct manufacturing.' },
    specialTitle: { vi: 'Kiểm soát đến cùng.', en: 'Controlled end to end.' },
    subtitle: {
      vi: 'Xưởng 3.000 m², hệ thống máy đồng bộ và quy trình QC phục vụ nội thất khách sạn, villa, căn hộ và sản xuất theo bản vẽ.',
      en: 'A 3,000 m² workshop, coordinated machinery and quality control for hotels, villas, apartments and make-to-drawing production.'
    },
    primaryCta: { vi: 'Đặt lịch tham quan', en: 'Arrange a factory visit' },
    secondaryCta: { vi: 'Xem năng lực', en: 'View our capability' }
  },
  pillars: {
    eyebrow: { vi: 'Năng lực tại nguồn', en: 'Capability at the source' },
    title: { vi: 'Bốn nền tảng để dự án đi đúng kế hoạch', en: 'Four foundations for dependable delivery' },
    description: {
      vi: 'Mỗi nền tảng trả lời một câu hỏi thực tế về chất lượng, tiến độ và khả năng phối hợp.',
      en: 'Each foundation answers a practical question about quality, schedule and coordination.'
    }
  },
  process: {
    eyebrow: { vi: 'Hệ thống sản xuất', en: 'Production system' },
    title: { vi: 'Bốn công đoạn, một dòng kiểm soát', en: 'Four stages, one controlled line' },
    description: {
      vi: 'Máy móc được tổ chức theo dòng công việc để giữ kích thước, bề mặt và tiến độ ổn định.',
      en: 'Machinery is organised as one workflow to keep dimensions, surfaces and schedule consistent.'
    }
  },
  peopleQuality: {
    eyebrow: { vi: 'Con người & chất lượng', en: 'People & quality' },
    title: { vi: 'Máy tạo độ lặp lại. Con người bảo đảm kết quả.', en: 'Machines create consistency. People secure the result.' },
    description: {
      vi: 'Thợ và kỹ thuật viên theo sát từ vật tư đầu vào đến nghiệm thu trước giao lắp.',
      en: 'Craftspeople and technicians follow the work from incoming materials to pre-installation sign-off.'
    }
  },
  audiences: {
    eyebrow: { vi: 'Đối tác phù hợp', en: 'Built for project partners' },
    title: { vi: 'Một năng lực, hai góc nhìn ra quyết định', en: 'One capability, two decision perspectives' },
    description: {
      vi: 'Thông tin được trình bày theo điều chủ đầu tư và đối tác triển khai cần kiểm chứng.',
      en: 'The same capability is framed around what owners and delivery partners need to verify.'
    }
  },
  faq: {
    eyebrow: { vi: 'Thông tin trước khi trao đổi', en: 'Before we talk' },
    title: { vi: 'Bốn câu hỏi thường gặp', en: 'Four common questions' }
  },
  visit: {
    eyebrow: { vi: 'Tham quan nhà xưởng', en: 'Factory visit' },
    title: { vi: 'Đến xem năng lực thực tế', en: 'See the capability first-hand' },
    description: {
      vi: 'Gọi trước để Lai Huy sắp xếp người phụ trách và chuẩn bị nội dung phù hợp với dự án của bạn.',
      en: 'Call ahead so Lai Huy can arrange the right host and prepare around your project needs.'
    },
    phoneCta: { vi: 'Gọi đặt lịch', en: 'Call to arrange' },
    mapCta: { vi: 'Mở bản đồ', en: 'Open map' }
  }
}

export const factoryStats: readonly FactoryStat[] = [
  {
    id: 'footprint',
    icon: 'i-lucide-warehouse',
    value: { vi: '3.000 m²', en: '3,000 m²' },
    label: { vi: 'Xưởng & kho', en: 'Workshop & warehouse' }
  },
  {
    id: 'throughput',
    icon: 'i-lucide-gauge',
    value: { vi: 'Đến 50', en: 'Up to 50' },
    label: { vi: 'Phòng / tháng', en: 'Rooms / month' }
  },
  {
    id: 'end-to-end',
    icon: 'i-lucide-workflow',
    value: { vi: 'Trọn gói', en: 'End-to-end' },
    label: { vi: 'Thiết kế → lắp đặt', en: 'Design → install' }
  },
  {
    id: 'reach',
    icon: 'i-lucide-globe',
    value: { vi: 'Toàn quốc', en: 'Nationwide' },
    label: { vi: 'Giao lắp & xuất khẩu', en: 'Delivery & export' }
  }
]

export const factoryPillars: readonly FactoryPillar[] = [
  {
    id: 'direct-factory',
    icon: 'i-lucide-factory',
    title: { vi: 'Xưởng sản xuất trực tiếp', en: 'Directly operated factory' },
    description: {
      vi: 'Chủ động vật liệu, tiến độ và xử lý kỹ thuật ngay tại nguồn.',
      en: 'Materials, schedule and technical resolution controlled at the source.'
    }
  },
  {
    id: 'machinery',
    icon: 'i-lucide-cpu',
    title: { vi: 'Hệ thống máy đồng bộ', en: 'Coordinated machinery' },
    description: {
      vi: 'Các công đoạn nối tiếp giúp kích thước và bề mặt ổn định trên số lượng lớn.',
      en: 'Connected stages keep dimensions and surfaces consistent at project scale.'
    }
  },
  {
    id: 'craft',
    icon: 'i-lucide-hard-hat',
    title: { vi: 'Đội ngũ tay nghề', en: 'Skilled project team' },
    description: {
      vi: 'Thợ và kỹ thuật viên phối hợp từ shop drawing đến hoàn thiện tại công trình.',
      en: 'Craftspeople and technicians coordinate from shop drawings to site finishing.'
    }
  },
  {
    id: 'quality',
    icon: 'i-lucide-shield-check',
    title: { vi: 'Kiểm soát chất lượng', en: 'Quality control' },
    description: {
      vi: 'Vật tư, gia công và thành phẩm được đối chiếu theo hồ sơ dự án.',
      en: 'Materials, machining and finished work are checked against project documents.'
    }
  }
]

export const factoryAudiences: readonly FactoryAudience[] = [
  {
    id: 'owners',
    title: { vi: 'Dành cho chủ đầu tư', en: 'For project owners' },
    points: [
      { vi: 'Kiểm soát chất lượng và tiến độ tại nguồn', en: 'Quality and schedule controlled at the source' },
      { vi: 'Một đầu mối từ thiết kế đến lắp đặt', en: 'One accountable team from design to installation' },
      { vi: 'Năng lực ổn định cho dự án nhiều phòng', en: 'Steady capacity for multi-room projects' }
    ]
  },
  {
    id: 'design-contractors',
    title: { vi: 'Dành cho thiết kế & tổng thầu', en: 'For designers & main contractors' },
    points: [
      { vi: 'Sản xuất theo hồ sơ, bản vẽ riêng và OEM', en: 'Make-to-drawing and OEM production' },
      { vi: 'Hỗ trợ bóc tách và triển khai shop drawing', en: 'Technical take-off and shop-drawing support' },
      { vi: 'Giao lắp toàn quốc và nhận đơn xuất khẩu', en: 'Nationwide installation and export orders' }
    ]
  }
]

export const factoryFaqs: readonly FactoryFaq[] = [
  {
    id: 'lead-time',
    question: { vi: 'Thời gian sản xuất mất bao lâu?', en: 'How long does production take?' },
    answer: {
      vi: 'Tiến độ phụ thuộc quy mô, vật liệu và hồ sơ kỹ thuật. Năng lực xưởng đạt đến khoảng 50 phòng khách sạn mỗi tháng; lịch cụ thể được xác nhận sau khi rà soát bản vẽ và BOQ.',
      en: 'Timing depends on scale, materials and technical documents. Workshop capacity reaches about 50 hotel rooms per month; the exact programme is confirmed after drawings and BOQ review.'
    }
  },
  {
    id: 'make-to-drawing',
    question: { vi: 'Lai Huy có nhận sản xuất theo thiết kế hoặc bản vẽ riêng không?', en: 'Can Lai Huy manufacture to our own design or drawings?' },
    answer: {
      vi: 'Có. Lai Huy nhận gia công theo bản vẽ/OEM và có thể bóc tách, triển khai shop drawing cần thiết trước khi đưa vào sản xuất.',
      en: 'Yes. Lai Huy provides make-to-drawing/OEM production and can prepare the technical take-off and shop drawings needed before manufacturing.'
    }
  },
  {
    id: 'materials-quality',
    question: { vi: 'Vật liệu và chất lượng được kiểm soát như thế nào?', en: 'How are materials and quality controlled?' },
    answer: {
      vi: 'Vật tư được kiểm tra theo chủng loại, màu sắc và tiêu chuẩn dự án; kích thước, cạnh, bề mặt và phụ kiện được đối chiếu trong sản xuất và trước khi đóng gói.',
      en: 'Materials are checked for type, colour and project standard; dimensions, edges, surfaces and hardware are verified during production and before packing.'
    }
  },
  {
    id: 'nationwide-installation',
    question: { vi: 'Lai Huy có giao lắp toàn quốc không?', en: 'Does Lai Huy install nationwide?' },
    answer: {
      vi: 'Có. Đội thi công triển khai tại công trình trên toàn quốc; xưởng đồng thời nhận các đơn hàng gia công xuất khẩu theo phạm vi thống nhất.',
      en: 'Yes. Installation teams work at project sites nationwide, and the factory also accepts export production orders within an agreed scope.'
    }
  }
]

export const factoryMediaAlt: Record<FactoryMediaKey, LocalizedText> = {
  hero: {
    vi: 'Toàn cảnh bên trong xưởng sản xuất nội thất Lai Huy',
    en: 'Interior view of the Lai Huy furniture workshop'
  },
  facade: {
    vi: 'Biển hiệu nhà xưởng Lai Huy Interior',
    en: 'Lai Huy Interior workshop signage'
  },
  process: {
    vi: 'Toàn cảnh hệ thống máy sản xuất tại xưởng Lai Huy',
    en: 'Overview of the production machinery inside the Lai Huy workshop'
  },
  people: {
    vi: 'Đội ngũ thợ Lai Huy đang làm việc tại xưởng',
    en: 'Lai Huy craftspeople working on the factory floor'
  },
  visit: {
    vi: 'Mặt tiền và địa chỉ nhà xưởng Lai Huy',
    en: 'Lai Huy workshop facade and address'
  }
}

export const qualityControl: readonly LocalizedText[] = [
  {
    vi: 'Kiểm tra vật tư đầu vào theo chủng loại, màu sắc và tiêu chuẩn dự án',
    en: 'Incoming materials checked against type, colour and project standards'
  },
  {
    vi: 'Đối chiếu hồ sơ, shop drawing và kích thước gia công',
    en: 'Documents, shop drawings and machined dimensions cross-checked'
  },
  {
    vi: 'Kiểm tra cạnh, bề mặt, phụ kiện và độ hoàn thiện trong sản xuất',
    en: 'Edges, surfaces, hardware and finish inspected during production'
  },
  {
    vi: 'Nghiệm thu, phân loại và kiểm tra lần cuối trước giao lắp',
    en: 'Final sign-off, sorting and inspection before delivery and installation'
  }
]
```

- [ ] **Step 4: Run the focused and shared factory-data tests**

Run:

```powershell
pnpm exec vitest run tests/factory-page.test.ts tests/homepage-machinery.test.ts
```

Expected: exit 0; both files pass. The homepage machinery test proves the shared four-stage data did not drift.

- [ ] **Step 5: Review the task diff**

Run:

```powershell
git diff --check
git diff -- app/data/factory.ts tests/factory-page.test.ts
git status --short
```

Expected: no whitespace errors; only the intended data and test files plus already-known design artifacts appear. Do not commit. Suggested later commit message: `feat(factory): define proof-first page content`.

---

### Task 2: Add deterministic factory media joins

**Files:**

- Create: `app/media/factory-media.ts`
- Create: `tests/factory-media.test.ts`

**Interfaces:**

- Consumes: `factoryMediaAlt: Record<FactoryMediaKey, LocalizedText>`.
- Produces: `requireWorkshopAsset(filename: string, assets?: readonly MediaAsset[]): MediaAsset`.
- Produces: `factoryMedia: Record<FactoryMediaKey, MediaImage>`.

- [ ] **Step 1: Write the failing media test**

Create `tests/factory-media.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { factoryMedia, requireWorkshopAsset } from '../app/media/factory-media'

describe('factory media', () => {
  it('resolves five unique named images with bilingual alt text', () => {
    expect(Object.keys(factoryMedia)).toEqual([
      'hero',
      'facade',
      'process',
      'people',
      'visit'
    ])
    const paths = Object.values(factoryMedia).map(image => image.path)
    expect(new Set(paths).size).toBe(paths.length)

    for (const image of Object.values(factoryMedia)) {
      expect(image.alt).not.toBe('')
      if (image.alt !== '') {
        expect(image.alt.vi).not.toBe('')
        expect(image.alt.en).not.toBe('')
      }
    }
  })

  it('fails with the missing filename instead of returning undefined', () => {
    expect(() => requireWorkshopAsset('missing.webp', [])).toThrow(
      'Missing workshop media asset: company/workshop/missing.webp'
    )
  })
})
```

- [ ] **Step 2: Run the test and verify the missing module fails**

Run:

```powershell
pnpm exec vitest run tests/factory-media.test.ts
```

Expected: non-zero exit because `app/media/factory-media.ts` does not exist.

- [ ] **Step 3: Implement the media lookup and joins**

Create `app/media/factory-media.ts`:

```ts
import { factoryMediaAlt, type FactoryMediaKey } from '../data/factory'
import { companyMedia, workshopMedia } from './catalog.generated'
import { withAlt } from './project-media'
import type { MediaAsset, MediaImage } from '~/shared/media/types'

export const requireWorkshopAsset = (
  filename: string,
  assets: readonly MediaAsset[] = workshopMedia
): MediaAsset => {
  const asset = assets.find(item => item.path.endsWith(`/workshop/${filename}`))
  if (!asset) {
    throw new Error(`Missing workshop media asset: company/workshop/${filename}`)
  }
  return asset
}

export const factoryMedia = {
  hero: withAlt(requireWorkshopAsset('4.webp'), factoryMediaAlt.hero),
  facade: withAlt(requireWorkshopAsset('1.webp'), factoryMediaAlt.facade),
  process: withAlt(requireWorkshopAsset('3.webp'), factoryMediaAlt.process),
  people: withAlt(companyMedia.companyStory, factoryMediaAlt.people),
  visit: withAlt(requireWorkshopAsset('2.webp'), factoryMediaAlt.visit)
} satisfies Record<FactoryMediaKey, MediaImage>
```

- [ ] **Step 4: Run the focused media and media-literal checks**

Run:

```powershell
pnpm exec vitest run tests/factory-media.test.ts
pnpm lint:media
```

Expected: both commands exit 0.

- [ ] **Step 5: Review the task diff**

Run:

```powershell
git diff --check
git diff -- app/media/factory-media.ts tests/factory-media.test.ts
git status --short
```

Expected: no generated catalog or manifest changes. Do not commit. Suggested later commit message: `feat(factory): add named workshop media joins`.

---

### Task 3: Replace the hero proof with the approved CTA and stats rail

**Files:**

- Create: `app/components/FactoryStatsStrip.vue`
- Create: `tests/e2e/factory-proof-first.spec.ts`
- Modify: `app/pages/nha-xuong.vue`

**Interfaces:**

- Consumes: `FactoryStat[]`, `factoryPageContent.hero`, `factoryMedia.hero`, `company.phone`.
- Produces DOM contracts: `[data-testid="factory-hero"]`, `#factory-capability`, `[data-testid="factory-stat"]`, `[data-testid="factory-hero-phone"]`.

- [ ] **Step 1: Create the failing route test for hero and stats**

Create `tests/e2e/factory-proof-first.spec.ts`:

```ts
import type { Page } from '@playwright/test'
import { expect, test } from './fixtures'

const TEST_ORIGIN = process.env.DENSITY_TEST_ORIGIN ?? 'http://localhost:3000'
const TRANSPARENT_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M/wHwAF/gL+X9j7WQAAAABJRU5ErkJggg==',
  'base64'
)

const copy = {
  vi: {
    heading: 'Sản xuất trực tiếp. Kiểm soát đến cùng.',
    primary: 'Đặt lịch tham quan',
    secondary: 'Xem năng lực'
  },
  en: {
    heading: 'Direct manufacturing. Controlled end to end.',
    primary: 'Arrange a factory visit',
    secondary: 'View our capability'
  }
} as const

async function openFactory(page: Page, locale: keyof typeof copy, width = 1440) {
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
  await page.goto('/nha-xuong', { waitUntil: 'load' })
  await page.evaluate(() => document.fonts.ready)
}

for (const locale of ['vi', 'en'] as const) {
  test(`factory hero and proof stats are complete in ${locale}`, async ({ page }) => {
    await openFactory(page, locale)

    await expect(
      page.getByRole('heading', { level: 1, name: copy[locale].heading, exact: true })
    ).toHaveCount(1)
    await expect(page.locator('[data-testid="factory-stat"]')).toHaveCount(4)

    const phone = page.getByRole('link', { name: copy[locale].primary, exact: true })
    await expect(phone).toHaveAttribute('href', 'tel:+84903102012')

    const capability = page.getByRole('link', { name: copy[locale].secondary, exact: true })
    await expect(capability).toHaveAttribute('href', '#factory-capability')
  })
}
```

- [ ] **Step 2: Build the current app and verify the new contract fails**

Run:

```powershell
pnpm build
pnpm exec playwright test tests/e2e/factory-proof-first.spec.ts --project=vr
```

Expected: build exits 0; Playwright exits non-zero because the old hero copy, CTA href and stat test IDs do not satisfy the new contract.

- [ ] **Step 3: Create the semantic stats component**

Create `app/components/FactoryStatsStrip.vue`:

```vue
<script setup lang="ts">
import type { FactoryStat } from '~/data/factory'

defineProps<{ stats: readonly FactoryStat[] }>()

const { t } = useLanguage()
</script>

<template>
  <div
    id="factory-capability"
    data-testid="factory-stats"
    class="scroll-mt-[calc(var(--header-h)+1rem)] border-b border-ink-200 bg-white"
  >
    <div class="shell">
      <dl class="grid grid-cols-2 lg:grid-cols-4">
        <div
          v-for="(stat, index) in stats"
          :key="stat.id"
          v-reveal="index * 70"
          data-testid="factory-stat"
          class="reveal border-b border-ink-200 px-4 py-6 odd:border-r lg:border-b-0 lg:border-r lg:last:border-r-0"
        >
          <Icon :name="stat.icon" class="h-5 w-5 text-wood-600" aria-hidden="true" />
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

- [ ] **Step 4: Update the page hero and insert the stats rail**

In `app/pages/nha-xuong.vue`:

1. Import `factoryPageContent`, `factoryStats` and `factoryMedia`.
2. Add `const factoryPhoneHref = `tel:${company.phone.replaceAll(' ', '')}``.
3. Delete the page-local `heroImage` definition; `factoryMedia.hero` is now the only hero source.
4. Replace the hero props and actions with:

```vue
<AppHero
  data-testid="factory-hero"
  :topic="t(factoryPageContent.hero.topic)"
  :title="t(factoryPageContent.hero.title)"
  :special-title="t(factoryPageContent.hero.specialTitle)"
  :subtitle="t(factoryPageContent.hero.subtitle)"
  :image="factoryMedia.hero"
  focal="50% 48%"
>
  <template #actions>
    <a
      data-testid="factory-hero-phone"
      :href="factoryPhoneHref"
      class="btn-primary"
    >
      {{ t(factoryPageContent.hero.primaryCta) }}
      <Icon name="i-lucide-phone" class="h-4 w-4" />
    </a>
    <a href="#factory-capability" class="btn-secondary">
      {{ t(factoryPageContent.hero.secondaryCta) }}
    </a>
  </template>
</AppHero>

<FactoryStatsStrip :stats="factoryStats" />
```

Keep the remaining legacy sections temporarily; later tasks replace them.

- [ ] **Step 5: Rebuild and verify the hero/stats contract passes**

Run:

```powershell
pnpm build
pnpm exec playwright test tests/e2e/factory-proof-first.spec.ts --project=vr
```

Expected: both commands exit 0.

- [ ] **Step 6: Review the task diff**

Run:

```powershell
git diff --check
git diff -- app/components/FactoryStatsStrip.vue app/pages/nha-xuong.vue tests/e2e/factory-proof-first.spec.ts
git status --short
```

Expected: no header, footer or shared hero edits. Do not commit. Suggested later commit message: `feat(factory): add proof-first hero stats`.

---

### Task 4: Replace gallery and equipment cards with one production-proof section

**Files:**

- Create: `app/components/FactoryProcessProof.vue`
- Modify: `app/pages/nha-xuong.vue`
- Modify: `tests/e2e/factory-proof-first.spec.ts`

**Interfaces:**

- Consumes: `factoryPageContent.process`, `machineryProcessGroups`, `factoryMedia.process`.
- Produces DOM contracts: `[data-testid="factory-process"]`, `[data-testid="factory-process-layout"]`, `[data-testid="factory-process-groups"]`, four `[data-testid="factory-process-group"]`.
- Removes: `activeFilter`, `filteredImages`, `lightboxOpen`, `lightboxIndex`, `galleryConfig`, `galleryFilters`, `GalleryLightbox` usage and legacy equipment cards.

- [ ] **Step 1: Extend the E2E spec with the failing production-proof contract**

Add:

```ts
test('factory uses one four-stage production proof and no standalone gallery', async ({ page }) => {
  await openFactory(page, 'vi')

  await expect(page.locator('[data-testid="factory-process"]')).toHaveCount(1)
  await expect(page.locator('[data-testid="factory-process-group"]')).toHaveCount(4)
  await expect(page.getByRole('heading', { name: 'Bước vào không gian sản xuất', exact: true }))
    .toHaveCount(0)
  await expect(page.getByRole('heading', { name: 'Công nghệ tạo nên chất lượng bạn nhận được', exact: true }))
    .toHaveCount(0)
  await expect(page.locator('main [role="dialog"]')).toHaveCount(0)
})
```

- [ ] **Step 2: Run the new test and verify it fails**

Run:

```powershell
pnpm build
pnpm exec playwright test tests/e2e/factory-proof-first.spec.ts --project=vr --grep "production proof"
```

Expected: Playwright exits non-zero because the new process test IDs do not exist and both legacy headings still render.

- [ ] **Step 3: Create the process-proof component**

Create `app/components/FactoryProcessProof.vue`:

```vue
<script setup lang="ts">
import type {
  FactoryPageContent,
  MachineryProcessGroup
} from '~/data/factory'
import type { MediaImage } from '~/shared/media/types'

defineProps<{
  content: FactoryPageContent['process']
  groups: readonly MachineryProcessGroup[]
  image: MediaImage
}>()

const { t } = useLanguage()
const sequence = (index: number) => String(index + 1).padStart(2, '0')
</script>

<template>
  <section data-testid="factory-process" class="section-y bg-ink-950 text-white">
    <div class="shell">
      <p v-reveal class="eyebrow reveal text-wood-200">{{ t(content.eyebrow) }}</p>
      <h2 v-reveal="80" class="text-section-title reveal mt-4 max-w-4xl font-black uppercase">
        {{ t(content.title) }}
      </h2>
      <p v-reveal="140" class="measure-lead reveal mt-5 text-white/70">
        {{ t(content.description) }}
      </p>

      <div
        data-testid="factory-process-layout"
        class="mt-10 grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch"
      >
        <MediaImage
          :image="image"
          sizes="sm:100vw lg:52vw"
          class="group min-h-64 rounded-2xl"
          img-class="object-center transition-transform duration-[1200ms] group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
        <div
          data-testid="factory-process-groups"
          class="grid gap-3 md:grid-cols-2"
        >
          <article
            v-for="(group, index) in groups"
            :key="group.id"
            v-reveal="index * 70"
            data-testid="factory-process-group"
            class="reveal flex flex-col border-t-2 border-wood-500 bg-white/[0.05] p-5"
          >
            <span class="text-xs font-black tracking-[0.16em] text-wood-300">
              {{ sequence(index) }}
            </span>
            <h3 class="mt-3 text-lg font-black">{{ t(group.title) }}</h3>
            <p class="mt-3 text-sm leading-6 text-white/70">{{ t(group.benefit) }}</p>
            <p class="mt-auto pt-5 text-xs font-bold leading-5 text-white/85">
              {{ group.machines.map(machine => t(machine)).join(' · ') }}
            </p>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>
```

- [ ] **Step 4: Remove gallery/equipment code and insert the process component**

In `app/pages/nha-xuong.vue`:

- Delete the `equipment` array.
- Delete gallery types/config/filter/count/computed/lightbox state and watcher.
- Delete the gallery and equipment template sections.
- Insert after the pillars section:

```vue
<FactoryProcessProof
  :content="factoryPageContent.process"
  :groups="machineryProcessGroups"
  :image="factoryMedia.process"
/>
```

- [ ] **Step 5: Rebuild and run the focused route test**

Run:

```powershell
pnpm build
pnpm exec playwright test tests/e2e/factory-proof-first.spec.ts --project=vr
```

Expected: both commands exit 0; no gallery or legacy equipment heading is present.

- [ ] **Step 6: Review the task diff**

Run:

```powershell
git diff --check
git diff -- app/components/FactoryProcessProof.vue app/pages/nha-xuong.vue tests/e2e/factory-proof-first.spec.ts
git status --short
```

Expected: gallery/lightbox state is fully removed from the page; shared gallery components remain untouched because other routes may use them. Do not commit. Suggested later commit message: `feat(factory): replace gallery with production proof`.

---

### Task 5: Complete people/QC, audiences, FAQ and factory-visit CTA

**Files:**

- Create: `app/components/FactoryVisitCta.vue`
- Modify: `app/pages/nha-xuong.vue`
- Modify: `tests/e2e/factory-proof-first.spec.ts`
- Modify: `tests/e2e/workflow-density.spec.ts`

**Interfaces:**

- Consumes: `factoryPageContent`, `factoryPillars`, `qualityControl`, `factoryAudiences`, `factoryFaqs`, `factoryMedia`, `company`.
- Produces DOM contracts: `factory-pillars`, `factory-pillars-layout`, `factory-pillars-grid`, `factory-people-quality`, `factory-people-quality-layout`, `factory-audiences`, `factory-faq`, `factory-visit-cta`, `factory-visit-actions`, `factory-visit-phone`, `factory-visit-map`.
- Keeps FAQ visual content and JSON-LD sourced from the same `factoryFaqs` array.

- [ ] **Step 1: Extend the failing E2E contract**

Add to `tests/e2e/factory-proof-first.spec.ts`:

```ts
test('factory closes with audience proof, four FAQs and direct visit actions', async ({ page }) => {
  await openFactory(page, 'en')

  await expect(page.locator('[data-testid="factory-pillars"] [data-testid="factory-pillar"]'))
    .toHaveCount(4)
  await expect(page.locator('[data-testid="factory-quality-step"]')).toHaveCount(4)
  await expect(page.locator('[data-testid="factory-audience"]')).toHaveCount(2)
  await expect(page.locator('[data-testid="factory-faq"] details')).toHaveCount(4)

  await expect(page.locator('[data-testid="factory-visit-phone"]'))
    .toHaveAttribute('href', 'tel:+84903102012')
  const map = page.locator('[data-testid="factory-visit-map"]')
  await expect(map).toHaveAttribute('target', '_blank')
  await expect(map).toHaveAttribute('rel', 'noopener noreferrer')

  await expect(page.getByRole('heading', { name: 'Production capacity', exact: true }))
    .toHaveCount(0)
})

test('visible FAQ questions match FAQ structured data', async ({ page }) => {
  await openFactory(page, 'vi')

  const visibleQuestions = (await page.locator('[data-testid="factory-faq"] summary').allTextContents())
    .map(text => text.trim())
  const faqNames = await page.locator('script[type="application/ld+json"]').evaluateAll((scripts) => {
    const entries = scripts.flatMap(script => {
      try {
        const value = JSON.parse(script.textContent ?? 'null')
        return Array.isArray(value) ? value : [value]
      } catch {
        return []
      }
    })
    const faq = entries.find(entry => entry?.['@type'] === 'FAQPage')
    return faq?.mainEntity?.map((item: { name: string }) => item.name) ?? []
  })

  expect(faqNames).toEqual(visibleQuestions)
})
```

- [ ] **Step 2: Run the new tests and verify they fail**

Run:

```powershell
pnpm build
pnpm exec playwright test tests/e2e/factory-proof-first.spec.ts --project=vr --grep "audience proof|structured data"
```

Expected: Playwright exits non-zero because the final section test IDs, four-question FAQ contract and direct visit CTA do not yet exist.

- [ ] **Step 3: Create the visit CTA component**

Create `app/components/FactoryVisitCta.vue`:

```vue
<script setup lang="ts">
import type { AddressEntry } from '~/data/company'
import type { FactoryPageContent } from '~/data/factory'
import type { MediaImage } from '~/shared/media/types'
import type { LocalizedArray } from '~/shared/types/localization'

const props = defineProps<{
  content: FactoryPageContent['visit']
  image: MediaImage
  phone: string
  address: AddressEntry
  workingHours: LocalizedArray
}>()

const { t, ta } = useLanguage()
const phoneHref = computed(() => `tel:${props.phone.replaceAll(' ', '')}`)
</script>

<template>
  <section data-testid="factory-visit-cta" class="bg-wood-700 text-white">
    <div class="shell grid gap-8 py-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:py-16">
      <MediaImage
        :image="image"
        sizes="sm:100vw lg:40vw"
        class="aspect-[16/10] rounded-2xl"
      />
      <div>
        <p class="eyebrow text-wood-100">{{ t(content.eyebrow) }}</p>
        <h2 class="mt-4 text-3xl font-black uppercase md:text-5xl">
          {{ t(content.title) }}
        </h2>
        <p class="mt-5 max-w-2xl leading-7 text-white/80">
          {{ t(content.description) }}
        </p>
        <p class="mt-6 font-bold">{{ t(address.address) }}</p>
        <p class="mt-2 text-sm text-white/75">{{ ta(workingHours).join(' · ') }}</p>
        <div
          data-testid="factory-visit-actions"
          class="mt-8 flex flex-col gap-3 sm:flex-row"
        >
          <a
            data-testid="factory-visit-phone"
            :href="phoneHref"
            class="btn-primary"
          >
            {{ t(content.phoneCta) }}
          </a>
          <a
            data-testid="factory-visit-map"
            :href="address.mapUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="btn-secondary"
          >
            {{ t(content.mapCta) }}
          </a>
        </div>
      </div>
    </div>
  </section>
</template>
```

- [ ] **Step 4: Replace the remaining page script with imported data only**

The final `<script setup>` in `app/pages/nha-xuong.vue` must:

```ts
import { company } from '~/data/company'
import {
  factoryAudiences,
  factoryFaqs,
  factoryPageContent,
  factoryPillars,
  factoryStats,
  machineryProcessGroups,
  qualityControl
} from '~/data/factory'
import { factoryMedia } from '~/media/factory-media'

const { t } = useLanguage()
const factoryAddress = company.addresses.find(address => address.icon === 'i-lucide-factory')

if (!factoryAddress) {
  throw new Error('Missing company address entry: Nhà xưởng')
}

const factoryPhoneHref = `tel:${company.phone.replaceAll(' ', '')}`
const seoTitle = computed(() => t(company.seo.factory.title))
const seoDescription = computed(() => t(company.seo.factory.description))

usePageSeo({
  path: '/nha-xuong',
  title: seoTitle,
  description: seoDescription,
  imagePath: factoryMedia.hero.path,
  jsonLd: ({ base }) => [
    buildBreadcrumbLd(base, t, [
      { name: { vi: 'Trang chủ', en: 'Home' }, path: '/' },
      { name: { vi: 'Nhà xưởng', en: 'Factory' }, path: '/nha-xuong' }
    ]),
    buildOrganizationLd(base, t),
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': factoryFaqs.map(faq => ({
        '@type': 'Question',
        'name': t(faq.question),
        'acceptedAnswer': { '@type': 'Answer', 'text': t(faq.answer) }
      }))
    }
  ]
})
```

- [ ] **Step 5: Replace remaining legacy sections in exact order**

After `FactoryStatsStrip`, the template order must be:

1. Pillars section with `data-testid="factory-pillars"`, the facade image, and four `data-testid="factory-pillar"` articles.
2. `FactoryProcessProof`.
3. People/QC section with `data-testid="factory-people-quality"`, `factoryMedia.people`, and four `data-testid="factory-quality-step"` list items.
4. Audience section with `data-testid="factory-audiences"` and two `data-testid="factory-audience"` articles.
5. FAQ section with `data-testid="factory-faq"` and four native `<details>` elements.
6. `FactoryVisitCta`.

Use these exact layout classes:

```vue
<!-- Pillars -->
<section data-testid="factory-pillars" class="section-y bg-white">
  <div class="shell">
    <div
      data-testid="factory-pillars-layout"
      class="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center"
    >
      <MediaImage :image="factoryMedia.facade" class="rounded-2xl" />
      <div>
        <p class="eyebrow">{{ t(factoryPageContent.pillars.eyebrow) }}</p>
        <h2 class="text-section-title mt-4 font-black uppercase text-ink-950">
          {{ t(factoryPageContent.pillars.title) }}
        </h2>
        <p class="measure-lead mt-5 text-ink-600">
          {{ t(factoryPageContent.pillars.description) }}
        </p>
        <div data-testid="factory-pillars-grid" class="mt-8 grid grid-cols-2 gap-4">
          <article
            v-for="pillar in factoryPillars"
            :key="pillar.id"
            data-testid="factory-pillar"
            class="border-t-2 border-wood-500 pt-5"
          >
            <Icon :name="pillar.icon" class="h-5 w-5 text-wood-600" />
            <h3 class="mt-4 font-black text-ink-950">{{ t(pillar.title) }}</h3>
            <p class="mt-2 text-sm leading-6 text-ink-600">{{ t(pillar.description) }}</p>
          </article>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- People + QC -->
<section data-testid="factory-people-quality" class="section-y bg-ink-50">
  <div
    data-testid="factory-people-quality-layout"
    class="shell grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center"
  >
    <MediaImage :image="factoryMedia.people" class="rounded-2xl" />
    <div>
      <p class="eyebrow">{{ t(factoryPageContent.peopleQuality.eyebrow) }}</p>
      <h2 class="text-section-title mt-4 font-black uppercase text-ink-950">
        {{ t(factoryPageContent.peopleQuality.title) }}
      </h2>
      <p class="mt-5 leading-7 text-ink-600">{{ t(factoryPageContent.peopleQuality.description) }}</p>
      <ul class="mt-8 grid gap-4">
        <li
          v-for="(item, index) in qualityControl"
          :key="t(item)"
          data-testid="factory-quality-step"
          class="flex gap-4 border-b border-ink-200 pb-4"
        >
          <span class="font-black text-wood-600">{{ String(index + 1).padStart(2, '0') }}</span>
          <span class="text-sm leading-6 text-ink-700">{{ t(item) }}</span>
        </li>
      </ul>
    </div>
  </div>
</section>

<!-- Audiences -->
<section data-testid="factory-audiences" class="section-y bg-white">
  <div class="shell">
    <p class="eyebrow">{{ t(factoryPageContent.audiences.eyebrow) }}</p>
    <h2 class="text-section-title mt-4 max-w-4xl font-black uppercase text-ink-950">
      {{ t(factoryPageContent.audiences.title) }}
    </h2>
    <p class="measure-lead mt-5 text-ink-600">{{ t(factoryPageContent.audiences.description) }}</p>
    <div class="mt-10 grid gap-5 md:grid-cols-2">
      <article
        v-for="audience in factoryAudiences"
        :key="audience.id"
        data-testid="factory-audience"
        class="rounded-2xl border border-ink-200 bg-ink-50 p-6 md:p-8"
      >
        <h3 class="text-xl font-black uppercase text-ink-950">{{ t(audience.title) }}</h3>
        <ul class="mt-6 grid gap-4">
          <li v-for="point in audience.points" :key="t(point)" class="flex gap-3 text-ink-700">
            <Icon name="i-lucide-check" class="mt-1 h-4 w-4 shrink-0 text-wood-600" />
            <span>{{ t(point) }}</span>
          </li>
        </ul>
      </article>
    </div>
  </div>
</section>
```

Keep the existing accessible native `details/summary` pattern for FAQ, but render `factoryFaqs` and exactly four entries. Pass the visit component:

```vue
<FactoryVisitCta
  :content="factoryPageContent.visit"
  :image="factoryMedia.visit"
  :phone="company.phone"
  :address="factoryAddress"
  :working-hours="company.workingHours"
/>
```

- [ ] **Step 6: Update the existing QC density fixture**

In `tests/e2e/workflow-density.spec.ts`, replace both locale `qcBullets` arrays with the exact four `qualityControl` strings from Task 1, and change:

```ts
expect(await countExactText(page, 'main li span', copy.qcBullets)).toBe(5)
```

to:

```ts
expect(await countExactText(page, 'main li span', copy.qcBullets)).toBe(4)
```

- [ ] **Step 7: Rebuild and run factory behavior tests**

Run:

```powershell
pnpm build
pnpm exec playwright test tests/e2e/factory-proof-first.spec.ts tests/e2e/workflow-density.spec.ts --project=vr
```

Expected: exit 0; both locales pass, visible FAQs equal FAQ JSON-LD, and the factory owns exactly four QC steps.

- [ ] **Step 8: Review the task diff and page cleanup**

Run:

```powershell
$legacy = rg -n "activeFilter|filteredImages|lightbox|galleryConfig|galleryFilters|const strengths|const equipment|capacityStats|const faqs" app/pages/nha-xuong.vue
if ($LASTEXITCODE -eq 0) { $legacy; throw 'Legacy factory page code remains.' }
if ($LASTEXITCODE -gt 1) { exit $LASTEXITCODE }
Write-Output 'No legacy factory page code found.'
git diff --check
git diff -- app/components/FactoryVisitCta.vue app/pages/nha-xuong.vue tests/e2e/factory-proof-first.spec.ts tests/e2e/workflow-density.spec.ts
git status --short
```

Expected: `rg` finds no legacy page-local state/data; diff has no unrelated route changes. Do not commit. Suggested later commit message: `feat(factory): complete proof-first capability page`.

---

### Task 6: Lock responsive, overflow, locale and accessibility behavior

**Files:**

- Modify: `tests/e2e/factory-proof-first.spec.ts`
- Modify only if a test exposes a defect: the three factory components or `app/pages/nha-xuong.vue`

**Interfaces:**

- Verifies approved breakpoints without adding a new CSS breakpoint system.
- Verifies native FAQ keyboard behavior and reduced-motion activation.

- [ ] **Step 1: Add responsive geometry helpers and tests**

Add to `tests/e2e/factory-proof-first.spec.ts`:

```ts
async function gridColumns(page: Page, testId: string) {
  return page.locator(`[data-testid="${testId}"]`).evaluate((element) =>
    getComputedStyle(element).gridTemplateColumns.split(' ').filter(Boolean).length
  )
}

async function flexDirection(page: Page, testId: string) {
  return page.locator(`[data-testid="${testId}"]`).evaluate((element) =>
    getComputedStyle(element).flexDirection
  )
}

for (const locale of ['vi', 'en'] as const) {
  for (const width of [390, 767, 768, 1279, 1280, 1440] as const) {
    test(`factory responsive contract in ${locale} at ${width}`, async ({ page }) => {
      await openFactory(page, locale, width)

      const overflow = await page.evaluate(() =>
        Math.max(
          document.documentElement.scrollWidth,
          document.body.scrollWidth
        ) - window.innerWidth
      )
      expect(overflow).toBeLessThanOrEqual(1)

      const stats = page.locator('[data-testid="factory-stats"] dl')
      const statColumns = await stats.evaluate(element =>
        getComputedStyle(element).gridTemplateColumns.split(' ').filter(Boolean).length
      )
      expect(statColumns).toBe(width >= 1024 ? 4 : 2)

      expect(await gridColumns(page, 'factory-pillars-layout')).toBe(width >= 1024 ? 2 : 1)
      expect(await gridColumns(page, 'factory-pillars-grid')).toBe(2)
      expect(await gridColumns(page, 'factory-process-layout')).toBe(width >= 1024 ? 2 : 1)
      expect(await gridColumns(page, 'factory-process-groups')).toBe(width >= 768 ? 2 : 1)
      expect(await gridColumns(page, 'factory-people-quality-layout')).toBe(width >= 1024 ? 2 : 1)

      const audienceGrid = page.locator('[data-testid="factory-audiences"] article').first()
        .locator('xpath=..')
      const audienceColumns = await audienceGrid.evaluate(element =>
        getComputedStyle(element).gridTemplateColumns.split(' ').filter(Boolean).length
      )
      expect(audienceColumns).toBe(width >= 768 ? 2 : 1)

      const heroActions = page.locator('[data-testid="factory-hero"] a').first().locator('xpath=..')
      expect(await heroActions.evaluate(element => getComputedStyle(element).flexDirection))
        .toBe(width >= 640 ? 'row' : 'column')
      expect(await flexDirection(page, 'factory-visit-actions'))
        .toBe(width >= 640 ? 'row' : 'column')
    })
  }
}

test('factory FAQ is keyboard operable and reduced motion is active', async ({ page }) => {
  await openFactory(page, 'vi', 390)
  expect(await page.evaluate(() =>
    matchMedia('(prefers-reduced-motion: reduce)').matches
  )).toBe(true)

  const firstSummary = page.locator('[data-testid="factory-faq"] summary').first()
  await firstSummary.focus()
  await expect(firstSummary).toBeFocused()
  await firstSummary.press('Enter')
  await expect(firstSummary.locator('xpath=..')).toHaveAttribute('open', '')
})
```

- [ ] **Step 2: Run the responsive suite and observe the first failure**

Run:

```powershell
pnpm build
pnpm exec playwright test tests/e2e/factory-proof-first.spec.ts --project=vr
```

Expected before responsive fixes: any mismatch exits non-zero with the exact viewport and locale in the test title. If all assertions pass from the planned utility classes, no implementation edit is needed.

- [ ] **Step 3: Apply only the class corrections identified by the test**

The approved class contract is:

- Stats: `grid-cols-2 lg:grid-cols-4`.
- Pillars: `grid-cols-2`.
- Process outer layout: one column below `lg`, split at `lg`.
- Process groups: one column below `md`, two columns at `md`.
- People/QC: one column below `lg`, split at `lg`.
- Audiences: one column below `md`, two columns at `md`.
- Hero actions already use `flex-col sm:flex-row` in `AppHero`; do not edit `AppHero`.
- CTA actions: `flex-col sm:flex-row`.

Do not add CSS media queries to `main.css` unless the utility classes cannot express the approved contract.

- [ ] **Step 4: Run accessibility and layout gates**

Run:

```powershell
pnpm build
pnpm exec playwright test tests/e2e/factory-proof-first.spec.ts --project=vr
pnpm test:gates:text
pnpm test:gates:layout
pnpm test:gates:a11y
```

Expected: every command exits 0. Record any remote Supabase or Google Maps dependency failure separately; do not increase timeouts or add retries.

- [ ] **Step 5: Review the task diff**

Run:

```powershell
git diff --check
git diff -- tests/e2e/factory-proof-first.spec.ts app/pages/nha-xuong.vue app/components/FactoryStatsStrip.vue app/components/FactoryProcessProof.vue app/components/FactoryVisitCta.vue
git status --short
```

Expected: responsive fixes remain local to the factory page/components. Do not commit. Suggested later commit message: `test(factory): lock responsive proof-first layout`.

---

### Task 7: Run the complete verification and visual approval gate

**Files:**

- No source files expected.
- Playwright may write `test-results/` and `tests/.report/`; these are generated artifacts.
- Snapshot files remain unchanged unless the user separately authorizes a baseline update.

**Interfaces:**

- Verifies the complete data → media → page → browser story.
- Produces the final command report and visual diff evidence.

- [ ] **Step 1: Run static checks and unit tests**

Run:

```powershell
pnpm lint
pnpm lint:media
pnpm typecheck
pnpm test
```

Expected: all four commands exit 0.

- [ ] **Step 2: Run a fresh production build**

Run:

```powershell
pnpm build
```

Expected: exit 0; prerender includes `/nha-xuong`; no missing-media exception.

- [ ] **Step 3: Run focused and shared browser gates**

Run:

```powershell
pnpm exec playwright test tests/e2e/factory-proof-first.spec.ts tests/e2e/workflow-density.spec.ts --project=vr
pnpm test:gates:text
pnpm test:gates:layout
pnpm test:gates:a11y
```

Expected: every command exits 0.

- [ ] **Step 4: Run factory visual regression without approving snapshots**

Run:

```powershell
pnpm exec playwright test tests/e2e/visual.spec.ts --project=vr --grep "factory"
```

Expected: the factory full-page snapshots at 390, 768 and 1440 report intentional diffs against the old gallery-heavy page; the scrolled header strip should remain stable. A non-zero exit is recorded as an unapproved baseline change, not reported as a passing test.

- [ ] **Step 5: Stop for explicit visual-baseline approval**

Present the generated diff images and ask the user whether the new 390, 768, 1440 and factory header snapshots should replace the committed baselines. Do not run an approval command in the same turn as the request.

If and only if the user explicitly approves, run:

```powershell
pnpm exec playwright test tests/e2e/visual.spec.ts --project=vr --grep "factory" --update-snapshots
```

Then immediately rerun:

```powershell
pnpm exec playwright test tests/e2e/visual.spec.ts --project=vr --grep "factory"
```

Expected after approved update: exit 0.

- [ ] **Step 6: Inspect final diff and status**

Run:

```powershell
git diff --check
git diff --stat
git diff -- app/data/factory.ts app/media/factory-media.ts app/components/FactoryStatsStrip.vue app/components/FactoryProcessProof.vue app/components/FactoryVisitCta.vue app/pages/nha-xuong.vue tests/factory-page.test.ts tests/factory-media.test.ts tests/e2e/factory-proof-first.spec.ts tests/e2e/workflow-density.spec.ts
git status --short
```

Expected: only the approved factory redesign, its tests, the approved plan/spec, and any separately approved factory snapshots appear. Report `.superpowers/` as generated Visual Companion material unless the user chooses to ignore or remove it. Do not commit. Suggested later commit message for an explicitly authorized commit: `feat(factory): redesign capability page proof-first`.

## Completion Report

The final implementation report must include:

- The seven rendered content rhythms and confirmation that the gallery/filter/lightbox were removed.
- Exact exits for lint, media guard, typecheck, unit tests, build and focused Playwright suites.
- Results for both locales and breakpoint boundaries.
- External-resource conditions for Supabase media and Google Maps.
- The visual-regression result and whether snapshot replacement received explicit approval.
- Final `git status --short`, separating user/pre-existing files, implementation files and generated Visual Companion files.
