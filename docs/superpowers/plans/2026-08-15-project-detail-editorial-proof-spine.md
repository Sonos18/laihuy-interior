# Project Detail Editorial Proof Spine Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild `/du-an/[slug]` as the approved seven-beat Editorial Proof Spine and give every current project a coherent bilingual narrative grounded only in verified source data and media.

**Architecture:** Keep `app/data/projects.ts` as the editorial source of truth, add one locale-aware pure view-model for all derived project-detail state, and split the 972-line route into six project-specific presentational components while reusing `AppHero`, `AppGalleryEditorial`, and `GalleryLightbox`. The route remains responsible for slug/404, media joins, gallery/lightbox state, SEO/JSON-LD, and chapter order.

**Scope check:** Content enrichment and presentation stay in one plan because the seven-chapter UI contract depends on every shipped record having the same minimum narrative spine. Tasks 1–4 produce a separately testable data/view-model foundation before any route markup changes; Tasks 5–10 consume that foundation.

**Tech Stack:** Nuxt 4.3.1, Vue 3.5.28, TypeScript 5.9.3, Tailwind CSS 4.1.18, Nuxt UI 4.4.0, Vitest 4.1.9, Playwright 1.61.1, pnpm 10.29.3, Node 22.x.

**Approved design:** `docs/superpowers/specs/2026-08-15-project-detail-editorial-proof-spine-design.md`

## Global Constraints

- Preserve Vietnamese-default cookie/state localization and author every new visible string in both `vi` and `en`.
- Keep hard facts, business copy, and alt text in typed data; never infer client, location, area, year, duration, rooms, metrics, awards, testimonials, or measured outcomes.
- Narrative inference may use only project metadata, existing copy, gallery structure, and clearly visible media characteristics; do not claim brands, technical specifications, or hidden client requirements.
- Keep `Project` narrative fields optional at type level; current catalog content tests provide the stronger guarantee for the 11 shipped records.
- Keep `AppHero` route-agnostic and reuse `AppGalleryEditorial`, `GalleryLightbox`, generated media records, `MediaImage`, and `useMediaUrl`.
- Preserve real 404 behavior, SEO/JSON-LD fallbacks, header/subnav token coupling, the 3-image short media flow, and the 30-image/9-inline long media flow.
- Use existing Inter, ink, paper, and wood tokens; do not add dependencies, raw `/images/` paths, Supabase object URLs, carousel behavior, scroll snapping, or scroll-jacking.
- A design-only project must not be described as manufactured or installed by Lai Huy. Factory proof appears only for `Sản xuất`; installation proof appears only for `Thi công`.
- The final CTA remains frontend navigation only and must not imply an enquiry was sent, received, stored, or will be answered.
- Verify `390`, `767/768`, `1279/1280`, and `1440` widths in both locales using rich and sparse project records.
- Do not run snapshot approval commands or edit committed baselines without separate explicit approval.
- Do not commit, push, rebase, or change branches without explicit user instruction. Each task ends with a review checkpoint instead of a commit.

---

## File Structure

### Create

- `tests/project-content-spine.test.ts` — catalog-wide bilingual narrative and scope-safety contract.
- `tests/project-detail-view-model.test.ts` — unit coverage for facts, phases, proof, anchors, and related ranking.
- `tests/e2e/project-detail-editorial.spec.ts` — observable chapter, responsive, locale, proof, and reduced-motion contract.
- `app/shared/types/project-detail.ts` — UI-facing types shared by the view-model and project-detail components.
- `app/utils/project-detail-view-model.ts` — pure locale-aware derivation from `Project` data.
- `app/components/ProjectHeroFacts.vue` — project hero composition and integrated fact rail.
- `app/components/ProjectStoryChapter.vue` — Overview → Challenge → Solution chapter.
- `app/components/ProjectDeliveryProof.vue` — scope, delivery timeline, and scope-safe execution proof.
- `app/components/ProjectMaterialStory.vue` — Experience, Highlights, Materials, Craftsmanship, and optional quote.
- `app/components/ProjectRelatedProjects.vue` — ranked related-project cards.
- `app/components/ProjectConversionFinale.vue` — verified trust stats and contact CTA.

### Modify

- `app/data/projects.ts` — add the missing bilingual narrative beats to eight projects and revise only copy necessary for continuity.
- `app/pages/du-an/[slug].vue` — retain orchestration and replace the twelve-section template with the approved component sequence.
- `app/components/GalleryLightbox.vue` — make thumbnail scrolling respect reduced motion without changing its public props/events.
- `tests/e2e/project-media-density.spec.ts` — move the full-gallery disclosure assertion into the Gallery chapter.

### Explicitly unchanged

- `app/shared/types/project.ts` — no new content fields.
- `app/components/AppHero.vue` — no project-route branching.
- `app/components/AppGalleryEditorial.vue` and `app/components/AppGalleryEditorialCell.vue` — same gallery interface and no-crop behavior.
- `app/media/catalog.generated.ts`, `app/media/fallback.generated.ts`, and `app/shared/media/manifest.json` — generated/restricted media files.
- Playwright snapshot directories — no baseline approval in this plan.

---

### Task 1: Lock the catalog-wide content spine

**Files:**
- Create: `tests/project-content-spine.test.ts`
- Read: `app/data/projects.ts:1-660`
- Read: `app/shared/types/project.ts:16-25`

**Interfaces:**
- Consumes: `projects: Project[]` and the existing optional `ProjectContent` fields.
- Produces: a test contract requiring Overview, Challenge, Solution, Experience, one proof group, both locales, unique narrative beats, and scope-safe Craftsmanship for every shipped project.

- [ ] **Step 1: Write the failing content-contract test**

Create `tests/project-content-spine.test.ts` with this complete content:

```ts
import { describe, expect, it } from 'vitest'
import { projects } from '../app/data/projects'
import type { LocalizedArray, LocalizedText } from '../app/shared/types/localization'

const textFor = (value: LocalizedText | undefined, locale: 'vi' | 'en') =>
  value?.[locale].trim() ?? ''

const listFor = (value: LocalizedArray | undefined, locale: 'vi' | 'en') =>
  value?.[locale].map(item => item.trim()).filter(Boolean) ?? []

describe('project narrative spine', () => {
  it('gives every shipped project a complete bilingual story with at least one proof group', () => {
    expect(projects).toHaveLength(11)

    for (const project of projects) {
      const content = project.content
      expect(content, project.slug).toBeDefined()

      for (const locale of ['vi', 'en'] as const) {
        const narrative = [
          textFor(content?.overview, locale),
          textFor(content?.challenge, locale),
          textFor(content?.solution, locale),
          textFor(content?.experience, locale)
        ]

        expect(narrative.every(Boolean), `${project.slug}:${locale}`).toBe(true)
        expect(new Set(narrative).size, `${project.slug}:${locale}:duplicate narrative`).toBe(4)

        const proofCount =
          listFor(content?.designHighlights, locale).length
          + listFor(content?.materials, locale).length
          + (textFor(content?.craftsmanship, locale) ? 1 : 0)

        expect(proofCount, `${project.slug}:${locale}:proof`).toBeGreaterThan(0)
      }
    }
  })

  it('never assigns craftsmanship to a design-only project', () => {
    for (const project of projects) {
      const scope = project.scope?.vi ?? []
      const includesExecution = scope.includes('Sản xuất') || scope.includes('Thi công')

      if (!includesExecution) {
        expect(project.content?.craftsmanship, project.slug).toBeUndefined()
      }
    }
  })
})
```

- [ ] **Step 2: Run the focused test and record the expected failures**

Run:

```powershell
pnpm exec vitest run tests/project-content-spine.test.ts
```

Expected: non-zero because the current sparse records are missing one or more of `challenge`, `solution`, or `experience`. The scope-safety test should already pass; if it does not, stop and inspect the claimed `craftsmanship` before changing copy.

- [ ] **Step 3: Review checkpoint**

Run `git diff -- tests/project-content-spine.test.ts` and confirm the test only encodes structural/bilingual guarantees; it does not pretend to test semantic coherence or force `craftsmanship` onto design-only work.

---

### Task 2: Complete the eight sparse narrative spines

**Files:**
- Modify: `app/data/projects.ts:267-307,332-358,383-409,434-456,481-507,532-558,583-611,635-651`
- Test: `tests/project-content-spine.test.ts`

**Interfaces:**
- Consumes: the approved evidence rules and the exact existing project metadata/media descriptions.
- Produces: a minimum `overview → challenge → solution → proof → experience` spine for all 11 projects, with no new schema fields.

- [ ] **Step 1: Add Challenge and Solution to `nha-vuon-chily`**

Insert these fields after its existing `overview` and before `designHighlights`:

```ts
      challenge: {
        vi: 'Ngôn ngữ tân cổ điển cần đủ trang trọng cho các không gian chung nhưng không thể áp cùng một sắc thái lên mọi thành viên; bài toán là giữ tổng thể thống nhất trong khi phòng của các bé vẫn có cá tính riêng.',
        en: 'The neo-classical language needed enough formality for the shared rooms without imposing the same mood on every family member; the priority was to keep one coherent home while giving the children’s rooms identities of their own.'
      },
      solution: {
        vi: 'Phòng khách, bếp và phòng ăn dùng chung một kỷ luật về phào chỉ, trần giật cấp, đá sáng và đồ nội thất dáng cổ điển. Hai phòng trẻ chuyển sang bảng màu xanh và đỏ cùng chủ đề xe đua, nhưng vẫn giữ hệ tủ gọn và nhịp bố cục rõ để không tách khỏi tổng thể.',
        en: 'The living room, kitchen and dining room share a disciplined use of mouldings, stepped ceilings, pale stone and classically shaped furniture. The two children’s rooms shift to blue and red racing themes while retaining orderly storage and a clear layout, so they remain part of the same home.'
      },
```

Evidence link: the existing Overview establishes the formal/family contrast; the existing Highlights prove both the classical shared rooms and the blue/red racing rooms.

- [ ] **Step 2: Add Highlights and Experience to `cai-tao-nha-quan-8`**

Insert after its existing `solution`:

```ts
      designHighlights: {
        vi: [
          'Gầm thang được chuyển thành góc ăn và hệ tủ rượu thay vì diện tích bỏ trống',
          'Bảng gỗ ấm, đá sáng và nan trắng nối các phòng bằng một nhịp vật liệu chung',
          'Hệ tủ bám tường giữ lối đi nhà phố gọn và liên tục',
          'Giường bệ nổi cùng ánh sáng hắt làm nhẹ khối nội thất phòng ngủ',
          'Kính và các lớp sáng gián tiếp đưa chiều sâu vào những vùng ít ánh sáng tự nhiên'
        ],
        en: [
          'The under-stair zone becomes a dining nook and wine cabinet instead of leftover space',
          'Warm wood, pale stone and white fluting connect the rooms through one material rhythm',
          'Wall-hugging storage keeps the townhouse circulation clear and continuous',
          'A floating bed base and indirect light lift the visual weight of the bedroom',
          'Glass and layered lighting bring depth to areas with limited natural light'
        ]
      },
```

Insert after its existing `materials`:

```ts
      experience: {
        vi: 'Từ khu ăn dưới gầm thang đến phòng ngủ, ngôi nhà được đọc như một mạch liên tục thay vì các phòng rời; gỗ ấm giữ cảm giác gần gũi, còn đá sáng và ánh sáng hắt giúp chiều ngang nhà phố thoáng hơn.',
        en: 'From the dining nook beneath the stair to the bedroom, the house reads as one continuous sequence rather than a set of separate rooms; warm wood keeps it familiar, while pale stone and indirect light make the townhouse feel more open.'
      }
```

- [ ] **Step 3: Add Challenge, Solution, and Materials to `nha-anh-nam`**

Insert after its existing `overview`:

```ts
      challenge: {
        vi: 'Trong mặt bằng nhà phố, chiều sâu và các khối nội thất dễ làm không gian nặng; ưu tiên thiết kế là đưa ánh sáng đi theo khoảng thông tầng và giữ mặt sàn càng liền mạch càng tốt.',
        en: 'Within a townhouse floorplate, depth and built-in volumes can quickly make the interior feel heavy; the design priority was to carry light through the double-height void and keep the floor plane as continuous as possible.'
      },
      solution: {
        vi: 'Khoảng thông tầng trở thành trục chính, được lọc bằng cầu thang lam thép đen thay cho một khối đặc. Hệ tủ, kệ TV và giường bệ được nhấc khỏi sàn; gỗ ấm, mặt tối và ánh sáng điểm tạo chiều sâu mà không lấp đầy khoảng trống.',
        en: 'The double-height void becomes the main axis, filtered by a black-steel batten stair instead of a solid enclosure. Cabinetry, media units and bed bases lift from the floor; warm wood, dark surfaces and focused lighting add depth without filling the void.'
      },
```

Insert after its existing `designHighlights`:

```ts
      materials: {
        vi: [
          'Gỗ tông ấm cho hệ tủ, kệ và các bề mặt nội thất chính',
          'Thép sơn đen cho lam cầu thang và chi tiết kệ mở',
          'Bề mặt tối cho đảo bếp và các điểm nhấn tương phản',
          'Ánh sáng hắt cùng đèn trang trí hình học để làm rõ chiều cao'
        ],
        en: [
          'Warm-toned wood across cabinetry, shelving and primary furniture surfaces',
          'Black-painted steel for the stair battens and open-shelf details',
          'Dark surfaces on the kitchen island and other contrast points',
          'Indirect light and geometric feature lighting to articulate the height'
        ]
      },
```

- [ ] **Step 4: Add Challenge, Solution, Highlights, and Craftsmanship to `nha-ta-dung`**

Insert after its existing `overview`:

```ts
      challenge: {
        vi: 'Với 32 m², mỗi lớp trang trí hoặc khối lưu trữ đều có thể thu hẹp cảm giác nghỉ dưỡng; bài toán là chứa đủ chức năng lưu trú mà vẫn giữ được khoảng thở và sự tĩnh tại.',
        en: 'At 32 m², every decorative layer or storage volume can erode the sense of retreat; the task was to hold the functions of a stay while preserving breathing room and quiet.'
      },
      solution: {
        vi: 'Hệ tủ, kệ và giường bằng gỗ thông được gom sát biên, kết hợp khung thép mở để lưu trữ không trở thành vách đặc. Các đường vòm, tường vữa trung tính và ánh sáng thấp làm mềm cấu trúc nhỏ, giữ vật liệu mộc làm điểm nhấn chính.',
        en: 'Pine cabinetry, shelving and the bed are gathered along the perimeter, paired with open steel frames so storage never becomes a solid wall. Arched lines, neutral plaster and low lighting soften the compact shell, leaving the raw materials as the primary expression.'
      },
      designHighlights: {
        vi: [
          'Hệ giường và lưu trữ gỗ thông gom sát biên để giải phóng phần giữa phòng',
          'Khung thép mở giữ tầm nhìn xuyên qua khu tủ và giá đỡ',
          'Đường vòm tạo chuyển tiếp mềm trong một mặt bằng nhỏ',
          'Ánh sáng thấp làm nổi thớ gỗ và bề mặt vữa trung tính'
        ],
        en: [
          'Pine sleeping and storage elements gather at the perimeter to free the centre',
          'Open steel frames preserve sightlines through wardrobes and racks',
          'Arched transitions soften the compact plan',
          'Low lighting brings out the pine grain and neutral plaster surfaces'
        ]
      },
```

Insert after its existing `materials` and before `experience`:

```ts
      craftsmanship: {
        vi: 'Trong phạm vi thiết kế và thi công, các mối gặp giữa gỗ thông, khung thép và bề mặt vữa được xử lý như một hệ thống duy nhất; chi tiết được giữ gọn để công năng không làm mất chất mộc của không gian.',
        en: 'Across the design-and-construction scope, the junctions between pine, steel frames and plaster surfaces are resolved as one system; details stay restrained so function does not dilute the retreat’s raw character.'
      },
```

- [ ] **Step 5: Add Challenge, Solution, and Materials to `phong-giam-doc`**

Insert after its existing `overview`:

```ts
      challenge: {
        vi: 'Ba nhu cầu — làm việc, họp nhỏ và tiếp khách — cùng nằm trong 37 m²; ưu tiên là tạo ranh giới đủ rõ mà không chia căn phòng thành những khoang chật.',
        en: 'Three needs — focused work, small meetings and receiving guests — share 37 m²; the priority was to make each zone legible without dividing the room into tight compartments.'
      },
      solution: {
        vi: 'Bàn giám đốc giữ trục chính, được bao bởi mảng gỗ ốp và hệ tủ âm để tạo chiều sâu. Bàn họp nhỏ và sofa lùi về hai vùng phụ, trong khi đèn thả tạo hình cùng nền tường tối liên kết cả ba chức năng bằng một sắc thái chững chạc.',
        en: 'The executive desk holds the main axis, framed by timber panelling and recessed storage to create depth. A small meeting table and sofa occupy two secondary zones, while the sculptural pendant and dark wall planes connect all three functions with one composed tone.'
      },
```

Insert after its existing `designHighlights`:

```ts
      materials: {
        vi: [
          'Gỗ tông ấm cho mảng ốp, lam và hệ tủ âm tường',
          'Kim loại tối cho chân bàn và các đường viền chi tiết',
          'Da tông trầm cho ghế làm việc và khu tiếp khách',
          'Ánh sáng vàng ấm trên các mảng tường tối'
        ],
        en: [
          'Warm timber across wall panelling, battens and recessed storage',
          'Dark metal for desk legs and fine edge details',
          'Deep-toned leather for the working and lounge seats',
          'Warm lighting against the darker wall planes'
        ]
      },
```

- [ ] **Step 6: Add Challenge, Materials, and Experience to `phong-hop-quan-7`**

Insert after its existing `overview` and before `solution`:

```ts
      challenge: {
        vi: 'Phòng họp cần đủ riêng tư cho trao đổi tập trung, trong khi các phòng ban vẫn cần nhìn thấy nhau và cùng chia sẻ một nhận diện; bài toán là phân vùng mà không làm văn phòng 170 m² trở nên khép kín.',
        en: 'The meeting room needed privacy for focused discussion while departments still needed visual connection and a shared identity; the task was to divide the 170 m² office without making it feel enclosed.'
      },
```

Insert after its existing `designHighlights`:

```ts
      materials: {
        vi: [
          'Kính trong cho vách phòng họp và các lớp phân vùng nhẹ',
          'Gỗ tông sáng cho tủ hồ sơ và các mảng nhấn',
          'Kim loại đen cho khung, chân bàn và chi tiết đèn',
          'Thảm sàn hỗ trợ phân vùng và giảm cảm giác cứng'
        ],
        en: [
          'Clear glass for the meeting-room enclosure and light partitions',
          'Pale timber for filing storage and accent planes',
          'Black metal across frames, desk legs and lighting details',
          'Carpet flooring to support zoning and soften the workplace'
        ]
      },
      experience: {
        vi: 'Từ bàn làm việc, các phòng ban vẫn đọc được nhịp chung của văn phòng; bước vào phòng họp, lớp kính giữ sự tập trung nhưng không cắt đứt ánh sáng và kết nối thị giác với bên ngoài.',
        en: 'From the workstations, departments still read as part of one office rhythm; inside the meeting room, glass supports focus without cutting off daylight or visual connection to the wider workplace.'
      }
```

- [ ] **Step 7: Add Materials, Craftsmanship, and Experience to `van-phong-quan-4`**

Insert after its existing `designHighlights`:

```ts
      materials: {
        vi: [
          'Gỗ tông ấm cho hệ kệ và các bề mặt lưu trữ',
          'Lam tông than chì cho mảng nền và nhịp đứng',
          'Khung thép sơn đen tại các vùng mở ra mặt kính',
          'Thảm sàn cùng cây xanh để làm mềm không gian làm việc'
        ],
        en: [
          'Warm timber for shelving and storage surfaces',
          'Charcoal fluting for background planes and vertical rhythm',
          'Black-painted steel frames where the office opens to glazing',
          'Carpet and planting to soften the workplace'
        ]
      },
      craftsmanship: {
        vi: 'Trong gói thiết kế, sản xuất và thi công, hệ kệ gỗ tích hợp hốc cây được triển khai như một mô-đun liên tục; các mối nối với lam than chì và khung thép được kiểm soát để mảng lưu trữ vẫn nhẹ trong mặt bằng 70 m².',
        en: 'Within the design, production and construction scope, the timber shelving and planting niches were delivered as one continuous module; its junctions with charcoal fluting and steel frames were controlled so the storage stayed light within 70 m².'
      },
      experience: {
        vi: 'Cây xanh xuất hiện ngay trong hệ lưu trữ thay vì như lớp trang trí thêm vào; nhờ vậy, nơi làm việc nhỏ vẫn có nhịp thở, còn các mảng gỗ và than chì giữ sự chuyên nghiệp cần thiết.',
        en: 'Planting sits within the storage rather than as an added decorative layer; the compact workplace gains breathing room, while timber and charcoal planes retain the required professional tone.'
      }
```

- [ ] **Step 8: Add Challenge, Highlights, and Materials to `nha-xuong-anh-cuong`**

Insert after its existing `overview` and before `solution`:

```ts
      challenge: {
        vi: 'Khối văn phòng cần đủ sạch, sáng và dễ nhận diện để làm việc tập trung, nhưng vẫn phải ở trong nhịp vận hành của nhà xưởng; ranh giới vì thế cần bảo vệ mà không tách rời.',
        en: 'The office needed to be clean, bright and legible enough for focused work while remaining inside the warehouse’s operating rhythm; its boundary had to protect without disconnecting.'
      },
```

Insert after its existing `solution` and before `craftsmanship`:

```ts
      designHighlights: {
        vi: [
          'Vách panel và kính tạo một khối văn phòng sáng bên trong vỏ công nghiệp',
          'Sàn terrazzo đánh dấu vùng làm việc bằng một bề mặt sạch và liền mạch',
          'Bàn chung cùng hệ kệ gỗ tổ chức công việc mà không làm nặng mặt bằng',
          'Đồ hoạ thương hiệu giúp khu văn phòng dễ nhận diện từ phía xưởng'
        ],
        en: [
          'Panel and glass partitions form a bright office insert within the industrial shell',
          'Terrazzo marks the workplace with one clean, continuous floor surface',
          'Shared desks and oak shelving organise work without weighing down the plan',
          'Brand graphics make the office legible from the warehouse side'
        ]
      },
      materials: {
        vi: [
          'Panel và kính cho hệ vách phân tách văn phòng với khu sản xuất',
          'Terrazzo cho bề mặt sàn liền mạch và dễ nhận diện',
          'Gỗ tông sáng cho kệ và các điểm chạm nội thất',
          'Kim loại tối cùng đồ hoạ thương hiệu trên nền công nghiệp'
        ],
        en: [
          'Panel and glass partitions separating the office from production',
          'Terrazzo for a continuous and clearly defined floor surface',
          'Pale timber for shelving and interior touchpoints',
          'Dark metal and brand graphics against the industrial shell'
        ]
      },
```

- [ ] **Step 9: Run the content test and the full unit suite**

Run:

```powershell
pnpm exec vitest run tests/project-content-spine.test.ts
pnpm test
```

Expected: both commands exit 0. Review every edited project in VI and EN using the five-beat checklist from the approved spec. Confirm the English version adds no fact absent from Vietnamese.

- [ ] **Step 10: Review checkpoint**

Run:

```powershell
git diff -- app/data/projects.ts tests/project-content-spine.test.ts
git diff --check
```

Confirm only `content` fields changed; metadata, scope, SEO, media identifiers, testimonials, metrics, and hard facts are byte-for-byte unchanged.

---

### Task 3: Specify the project-detail view-model with failing tests

**Files:**
- Create: `tests/project-detail-view-model.test.ts`
- Read: `app/data/factory.ts:182-187,293-304`
- Read: `app/data/categories.ts`
- Read: `app/pages/du-an/[slug].vue:18-228`

**Interfaces:**
- Consumes later: `buildProjectDetailViewModel({ project, projects, imageCount, locale })`.
- Produces tests for `ProjectDetailViewModel` and its exact facts, scope, phases, execution proof, four-anchor navigation, material visibility, and related-project ranking.

- [ ] **Step 1: Write the failing view-model test**

Create `tests/project-detail-view-model.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { projects } from '../app/data/projects'
import { buildProjectDetailViewModel } from '../app/utils/project-detail-view-model'

const project = (slug: string) => {
  const match = projects.find(item => item.slug === slug)
  if (!match) throw new Error(`Missing test project: ${slug}`)
  return match
}

describe('buildProjectDetailViewModel', () => {
  it('caps hero facts at the approved five verified priorities', () => {
    const view = buildProjectDetailViewModel({
      project: project('khach-san-eo-gio'),
      projects,
      imageCount: 30,
      locale: 'vi'
    })

    expect(view.facts.map(fact => fact.key)).toEqual([
      'area',
      'year',
      'style',
      'scope',
      'location'
    ])
    expect(view.facts).toHaveLength(5)
    expect(view.facts.find(fact => fact.key === 'scope')?.value)
      .toBe('Thiết kế · Sản xuất · Thi công')
  })

  it('derives ordered phases and only the execution proof supported by scope', () => {
    const fullScope = buildProjectDetailViewModel({
      project: project('khach-san-eo-gio'),
      projects,
      imageCount: 30,
      locale: 'en'
    })
    const designOnly = buildProjectDetailViewModel({
      project: project('nha-vuon-chily'),
      projects,
      imageCount: 26,
      locale: 'en'
    })

    expect(fullScope.deliveryPhases.map(phase => phase.key)).toEqual([
      'consultation',
      'design',
      'production',
      'installation',
      'handover'
    ])
    expect(fullScope.executionProof.map(proof => proof.id)).toEqual([
      'direct-factory',
      'quality',
      'craft'
    ])
    expect(designOnly.deliveryPhases.map(phase => phase.key)).toEqual([
      'consultation',
      'design',
      'handover'
    ])
    expect(designOnly.executionProof).toEqual([])
  })

  it('builds only renderable stable anchors', () => {
    const rich = buildProjectDetailViewModel({
      project: project('khach-san-eo-gio'),
      projects,
      imageCount: 30,
      locale: 'vi'
    })
    const withoutMedia = buildProjectDetailViewModel({
      project: project('nha-xuong-anh-cuong'),
      projects,
      imageCount: 0,
      locale: 'vi'
    })

    expect(rich.navSections.map(section => section.id)).toEqual([
      'story',
      'gallery',
      'delivery',
      'materials'
    ])
    expect(withoutMedia.navSections.map(section => section.id)).toEqual([
      'story',
      'delivery',
      'materials'
    ])
  })

  it('keeps material visibility and related ranking deterministic', () => {
    const view = buildProjectDetailViewModel({
      project: project('nha-xuong-anh-cuong'),
      projects,
      imageCount: 3,
      locale: 'vi'
    })

    expect(view.hasMaterialStory).toBe(true)
    expect(view.relatedProjects).toHaveLength(3)
    expect(new Set(view.relatedProjects.map(item => item.slug)).size).toBe(3)
    expect(view.relatedProjects.some(item => item.slug === 'nha-xuong-anh-cuong')).toBe(false)
  })
})
```

- [ ] **Step 2: Run the focused test and verify the missing-module failure**

Run:

```powershell
pnpm exec vitest run tests/project-detail-view-model.test.ts
```

Expected: non-zero with a module-resolution error for `app/utils/project-detail-view-model` because Task 4 has not created it yet.

- [ ] **Step 3: Review checkpoint**

Confirm the test checks behavior rather than the current route implementation and explicitly proves that a design-only project receives no factory/install proof.

---

### Task 4: Implement the typed pure view-model

**Files:**
- Create: `app/shared/types/project-detail.ts`
- Create: `app/utils/project-detail-view-model.ts`
- Test: `tests/project-detail-view-model.test.ts`

**Interfaces:**
- Consumes: `Project`, `Locale`, `factoryPillars`, project image count, and the full project list.
- Produces: `buildProjectDetailViewModel(args): ProjectDetailViewModel` plus shared props types used by Tasks 6–8.

- [ ] **Step 1: Create the shared project-detail types**

Create `app/shared/types/project-detail.ts`:

```ts
import type { MediaAsset } from '~/shared/media/types'
import type { Project } from '~/shared/types/project'

export type ProjectFactKey = 'area' | 'year' | 'style' | 'scope' | 'location'
export type ProjectScopeKey = 'Thiết kế' | 'Sản xuất' | 'Thi công'
export type ProjectDeliveryPhaseKey =
  | 'consultation'
  | 'design'
  | 'production'
  | 'installation'
  | 'handover'
export type ProjectNavSectionId = 'story' | 'gallery' | 'delivery' | 'materials'
export type ProjectExecutionProofId = 'direct-factory' | 'quality' | 'craft'

export type ProjectDetailFact = {
  key: ProjectFactKey
  icon: string
  label: string
  value: string
}

export type ProjectScopeItem = {
  key: ProjectScopeKey
  icon: string
  label: string
}

export type ProjectDeliveryPhase = {
  key: ProjectDeliveryPhaseKey
  icon: string
  label: string
}

export type ProjectExecutionProof = {
  id: ProjectExecutionProofId
  icon: string
  title: string
  description: string
}

export type ProjectNavSection = {
  id: ProjectNavSectionId
  label: string
}

export type ProjectRelatedCard = {
  item: Project
  cover?: MediaAsset
}

export type ProjectDetailViewModel = {
  facts: ProjectDetailFact[]
  scopeItems: ProjectScopeItem[]
  deliveryPhases: ProjectDeliveryPhase[]
  executionProof: ProjectExecutionProof[]
  navSections: ProjectNavSection[]
  relatedProjects: Project[]
  hasMaterialStory: boolean
}
```

- [ ] **Step 2: Create the locale-aware derivation helper**

Create `app/utils/project-detail-view-model.ts` with this complete content:

```ts
import { factoryPillars } from '~/data/factory'
import type { Locale, LocalizedArray, LocalizedText } from '~/shared/types/localization'
import type {
  ProjectDeliveryPhase,
  ProjectDeliveryPhaseKey,
  ProjectDetailFact,
  ProjectDetailViewModel,
  ProjectExecutionProofId,
  ProjectFactKey,
  ProjectNavSection,
  ProjectScopeItem,
  ProjectScopeKey
} from '~/shared/types/project-detail'
import type { Project } from '~/shared/types/project'

type Args = {
  project: Project
  projects: readonly Project[]
  imageCount: number
  locale: Locale
}

const textFor = (value: LocalizedText | undefined, locale: Locale) =>
  value?.[locale] ?? value?.vi ?? value?.en ?? ''

const listFor = (value: LocalizedArray | undefined, locale: Locale) =>
  value?.[locale] ?? value?.vi ?? value?.en ?? []

const scopeCatalog: Record<ProjectScopeKey, Omit<ProjectScopeItem, 'label'> & { label: LocalizedText }> = {
  'Thiết kế': {
    key: 'Thiết kế',
    icon: 'i-lucide-pencil-ruler',
    label: { vi: 'Thiết kế', en: 'Design' }
  },
  'Sản xuất': {
    key: 'Sản xuất',
    icon: 'i-lucide-factory',
    label: { vi: 'Sản xuất', en: 'Production' }
  },
  'Thi công': {
    key: 'Thi công',
    icon: 'i-lucide-hard-hat',
    label: { vi: 'Thi công', en: 'Installation' }
  }
}

const phaseCatalog: Record<ProjectDeliveryPhaseKey, Omit<ProjectDeliveryPhase, 'label'> & { label: LocalizedText }> = {
  consultation: {
    key: 'consultation',
    icon: 'i-lucide-messages-square',
    label: { vi: 'Tư vấn & khảo sát', en: 'Consultation' }
  },
  design: {
    key: 'design',
    icon: 'i-lucide-pencil-ruler',
    label: { vi: 'Thiết kế', en: 'Design' }
  },
  production: {
    key: 'production',
    icon: 'i-lucide-factory',
    label: { vi: 'Sản xuất tại xưởng', en: 'Production' }
  },
  installation: {
    key: 'installation',
    icon: 'i-lucide-hard-hat',
    label: { vi: 'Thi công lắp đặt', en: 'Installation' }
  },
  handover: {
    key: 'handover',
    icon: 'i-lucide-key-round',
    label: { vi: 'Bàn giao', en: 'Handover' }
  }
}

const isScopeKey = (value: string): value is ProjectScopeKey => value in scopeCatalog

const resolveScope = (project: Project, locale: Locale) =>
  (project.scope?.vi ?? [])
    .filter(isScopeKey)
    .map((key) => {
      const item = scopeCatalog[key]
      return { key: item.key, icon: item.icon, label: textFor(item.label, locale) }
    })

const resolveFacts = (project: Project, locale: Locale): ProjectDetailFact[] => {
  const candidates: Array<ProjectDetailFact | undefined> = [
    project.area
      ? { key: 'area', icon: 'i-lucide-ruler', label: locale === 'vi' ? 'Diện tích' : 'Floor area', value: textFor(project.area, locale) }
      : undefined,
    project.year
      ? { key: 'year', icon: 'i-lucide-calendar-check', label: locale === 'vi' ? 'Hoàn thành' : 'Completed', value: textFor(project.year, locale) }
      : undefined,
    project.style
      ? { key: 'style', icon: 'i-lucide-palette', label: locale === 'vi' ? 'Phong cách' : 'Style', value: textFor(project.style, locale) }
      : undefined,
    listFor(project.scope, locale).length
      ? { key: 'scope', icon: 'i-lucide-list-checks', label: locale === 'vi' ? 'Phạm vi' : 'Scope', value: listFor(project.scope, locale).join(' · ') }
      : undefined,
    project.location
      ? { key: 'location', icon: 'i-lucide-map-pin', label: locale === 'vi' ? 'Địa điểm' : 'Location', value: textFor(project.location, locale) }
      : undefined
  ]

  return candidates.filter((fact): fact is ProjectDetailFact => Boolean(fact)).slice(0, 5)
}

const resolvePhases = (scopeItems: readonly ProjectScopeItem[], locale: Locale) => {
  const keys: ProjectDeliveryPhaseKey[] = ['consultation']
  if (scopeItems.some(item => item.key === 'Thiết kế')) keys.push('design')
  if (scopeItems.some(item => item.key === 'Sản xuất')) keys.push('production')
  if (scopeItems.some(item => item.key === 'Thi công')) keys.push('installation')
  keys.push('handover')

  return keys.map((key) => {
    const phase = phaseCatalog[key]
    return { key: phase.key, icon: phase.icon, label: textFor(phase.label, locale) }
  })
}

const resolveExecutionProof = (scopeItems: readonly ProjectScopeItem[], locale: Locale) => {
  const ids: ProjectExecutionProofId[] = []
  if (scopeItems.some(item => item.key === 'Sản xuất')) ids.push('direct-factory', 'quality')
  if (scopeItems.some(item => item.key === 'Thi công')) ids.push('craft')

  return ids.map((id) => {
    const pillar = factoryPillars.find(item => item.id === id)
    if (!pillar) throw new Error(`Missing factory proof: ${id}`)
    return {
      id,
      icon: pillar.icon,
      title: textFor(pillar.title, locale),
      description: textFor(pillar.description, locale)
    }
  })
}

const resolveRelatedProjects = (project: Project, projects: readonly Project[]) => {
  const scope = new Set(project.scope?.vi ?? [])
  return projects
    .filter(item => item.slug !== project.slug)
    .map((item) => {
      let score = 0
      if (item.category === project.category) score += 100
      if (item.style?.vi && item.style.vi === project.style?.vi) score += 30
      score += (item.scope?.vi ?? []).filter(key => scope.has(key)).length * 10
      score += (Number(item.year?.vi) || 0) * 0.01
      return { item, score }
    })
    .sort((first, second) => second.score - first.score)
    .slice(0, 3)
    .map(({ item }) => item)
}

export const buildProjectDetailViewModel = ({ project, projects, imageCount, locale }: Args): ProjectDetailViewModel => {
  const scopeItems = resolveScope(project, locale)
  const content = project.content
  const hasStory = Boolean(content?.overview || content?.challenge || content?.solution)
  const hasMaterialStory = Boolean(
    content?.experience
    || content?.designHighlights?.vi.length
    || content?.materials?.vi.length
    || content?.craftsmanship
    || project.testimonial
  )

  const navSections: ProjectNavSection[] = []
  if (hasStory) navSections.push({ id: 'story', label: locale === 'vi' ? 'Câu chuyện' : 'Story' })
  if (imageCount > 0) navSections.push({ id: 'gallery', label: locale === 'vi' ? 'Hình ảnh' : 'Gallery' })
  if (scopeItems.length) navSections.push({ id: 'delivery', label: locale === 'vi' ? 'Triển khai' : 'Delivery' })
  if (hasMaterialStory) navSections.push({ id: 'materials', label: locale === 'vi' ? 'Vật liệu' : 'Materials' })

  return {
    facts: resolveFacts(project, locale),
    scopeItems,
    deliveryPhases: resolvePhases(scopeItems, locale),
    executionProof: resolveExecutionProof(scopeItems, locale),
    navSections,
    relatedProjects: resolveRelatedProjects(project, projects),
    hasMaterialStory
  }
}
```

- [ ] **Step 3: Run focused and full unit tests**

Run:

```powershell
pnpm exec vitest run tests/project-detail-view-model.test.ts
pnpm test
pnpm typecheck
```

Expected: all commands exit 0. If typecheck rejects the `MediaAsset` cover type, inspect the exact return type of `projectCoverAsset` and narrow `ProjectRelatedCard.cover` to that exported media type rather than adding `any`.

- [ ] **Step 4: Review checkpoint**

Run:

```powershell
git diff -- app/shared/types/project-detail.ts app/utils/project-detail-view-model.ts tests/project-detail-view-model.test.ts
git diff --check
```

Confirm the helper has no Vue/Nuxt runtime state, no route access, no media URL construction, and no duplicated hard facts.

---
### Task 5: Lock the browser-visible Editorial Proof Spine contract

**Files:**
- Create: `tests/e2e/project-detail-editorial.spec.ts`
- Modify: `tests/e2e/project-media-density.spec.ts:56-88`
- Read: `tests/e2e/fixtures.ts`
- Read: `playwright.config.ts`

**Interfaces:**
- Consumes later: `data-project-chapter`, `data-project-facts`, `data-project-fact`, `data-story-layout`, `data-story-beat`, `data-delivery-timeline`, `data-material-layout`, and `data-execution-proof` attributes.
- Produces: a browser contract for chapter order, four anchors, scope-safe proof, responsive grid boundaries, VI/EN overflow, gallery disclosure placement, and reduced-motion lightbox behavior.

- [ ] **Step 1: Create the failing Editorial Proof Spine Playwright spec**

Create `tests/e2e/project-detail-editorial.spec.ts` with this complete content:

```ts
import type { Page } from '@playwright/test'
import { expect, test } from './fixtures'

const TEST_ORIGIN = process.env.PROJECT_DETAIL_TEST_ORIGIN ?? 'http://localhost:3000'
const TRANSPARENT_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M/wHwAF/gL+X9j7WQAAAABJRU5ErkJggg==',
  'base64'
)

const copy = {
  vi: { disclosure: 'Xem toàn bộ hình ảnh', viewer: 'Trình xem ảnh' },
  en: { disclosure: 'View all project images', viewer: 'Image viewer' }
} as const

async function openProject(
  page: Page,
  locale: 'vi' | 'en',
  path: string,
  width: number,
  height = 900
) {
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
  await page.setViewportSize({ width, height })
  await page.goto(new URL(path, TEST_ORIGIN).toString(), { waitUntil: 'load' })
  await page.waitForFunction(() => Boolean(
    (document.querySelector('#__nuxt') as HTMLElement & { __vue_app__?: unknown })?.__vue_app__
  ))
  await page.evaluate(() => document.fonts.ready)
}

async function gridColumnCount(page: Page, selector: string) {
  return page.locator(selector).evaluate((element) => {
    const columns = getComputedStyle(element).gridTemplateColumns
    return columns === 'none' ? 1 : columns.split(' ').filter(Boolean).length
  })
}

for (const locale of ['vi', 'en'] as const) {
  test(`PD-EDITORIAL-01 hero and story expose one coherent spine in ${locale}`, async ({ page }) => {
    await openProject(page, locale, '/du-an/khach-san-eo-gio', 1440)

    await expect(page.locator('[data-project-chapter="hero"]')).toBeVisible()
    await expect(page.locator('[data-project-facts] [data-project-fact]')).toHaveCount(5)
    expect(await page.locator('[data-project-fact]').evaluateAll(elements =>
      elements.map(element => element.getAttribute('data-fact-key'))
    )).toEqual(['area', 'year', 'style', 'scope', 'location'])
    await expect(page.locator('#story [data-story-beat]')).toHaveCount(3)
  })
}

test('PD-EDITORIAL-02 delivery proof follows the verified project scope', async ({ page }) => {
  await openProject(page, 'vi', '/du-an/khach-san-eo-gio', 1280)
  await expect(page.locator('[data-execution-proof="direct-factory"]')).toHaveCount(1)
  await expect(page.locator('[data-execution-proof="quality"]')).toHaveCount(1)
  await expect(page.locator('[data-execution-proof="craft"]')).toHaveCount(1)

  await openProject(page, 'vi', '/du-an/nha-vuon-chily', 1280)
  await expect(page.locator('#delivery [data-scope-key="Thiết kế"]')).toHaveCount(1)
  await expect(page.locator('#delivery [data-execution-proof]')).toHaveCount(0)
})

test('PD-EDITORIAL-03 rich and sparse projects share the approved chapter order', async ({ page }) => {
  for (const path of ['/du-an/khach-san-eo-gio', '/du-an/nha-xuong-anh-cuong']) {
    await openProject(page, 'vi', path, 1280)
    expect(await page.locator('[data-project-chapter]').evaluateAll(elements =>
      elements.map(element => element.getAttribute('data-project-chapter'))
    )).toEqual(['hero', 'story', 'gallery', 'delivery', 'materials', 'related', 'finale'])
    expect(await page.locator('[data-project-subnav] a').evaluateAll(elements =>
      elements.map(element => element.getAttribute('href'))
    )).toEqual(['#story', '#gallery', '#delivery', '#materials'])
    await expect(page.locator('[data-project-chapter="finale"]'))
      .not.toContainText(/đã gửi|đã nhận|gửi thành công/i)
  }
})

const viewports = [
  { width: 390, height: 844, facts: 2, story: 1, delivery: 1 },
  { width: 767, height: 900, facts: 2, story: 1, delivery: 1 },
  { width: 768, height: 1024, facts: 3, story: 2, delivery: 5 },
  { width: 1279, height: 900, facts: 3, story: 2, delivery: 5 },
  { width: 1280, height: 900, facts: 5, story: 2, delivery: 5 },
  { width: 1440, height: 900, facts: 5, story: 2, delivery: 5 }
] as const

for (const locale of ['vi', 'en'] as const) {
  for (const viewport of viewports) {
    test(`PD-EDITORIAL-04 ${locale} reflows without overflow at ${viewport.width}`, async ({ page }) => {
      await openProject(page, locale, '/du-an/khach-san-eo-gio', viewport.width, viewport.height)

      expect(await gridColumnCount(page, '[data-project-facts] dl')).toBe(viewport.facts)
      expect(await gridColumnCount(page, '[data-story-layout]')).toBe(viewport.story)
      expect(await gridColumnCount(page, '[data-delivery-timeline]')).toBe(viewport.delivery)
      expect(await gridColumnCount(page, '[data-material-layout]')).toBe(viewport.story)
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
    })
  }
}

test('PD-EDITORIAL-05 lightbox uses non-smooth thumbnail movement under reduced motion', async ({ page }) => {
  await openProject(page, 'en', '/du-an/khach-san-eo-gio', 1280)
  await page.evaluate(() => {
    const target = window as unknown as { __projectScrollBehaviors: ScrollBehavior[] }
    target.__projectScrollBehaviors = []
    const original = Element.prototype.scrollIntoView
    Element.prototype.scrollIntoView = function (options?: boolean | ScrollIntoViewOptions) {
      if (typeof options === 'object' && options?.behavior) {
        target.__projectScrollBehaviors.push(options.behavior)
      }
      original.call(this, options)
    }
  })

  await page.getByRole('button', { name: new RegExp(`^${copy.en.disclosure}`) }).click()
  await expect(page.getByRole('dialog', { name: copy.en.viewer })).toBeVisible()
  await expect.poll(() => page.evaluate(() =>
    (window as unknown as { __projectScrollBehaviors: ScrollBehavior[] }).__projectScrollBehaviors
  )).toContain('auto')

  await page.keyboard.press('Shift+Tab')
  expect(await page.getByRole('dialog', { name: copy.en.viewer }).evaluate(dialog =>
    dialog.contains(document.activeElement)
  )).toBe(true)
})

test('PD-EDITORIAL-06 anchors, SEO and hard 404 behavior remain intact', async ({ page }) => {
  await openProject(page, 'vi', '/du-an/khach-san-eo-gio', 1280)

  const deliveryLink = page.locator('[data-project-subnav] a[href="#delivery"]')
  await deliveryLink.click()
  await expect(page).toHaveURL(/#delivery$/)
  await expect(deliveryLink).toHaveAttribute('aria-current', 'location')
  expect(await page.locator('#delivery').evaluate(element => element.getBoundingClientRect().top))
    .toBeGreaterThanOrEqual(120)

  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    /\/du-an\/khach-san-eo-gio$/
  )
  expect((await page.locator('script[type="application/ld+json"]').allTextContents()).join('\n'))
    .toContain('CreativeWork')

  const response = await page.goto(
    new URL('/du-an/du-an-khong-ton-tai', TEST_ORIGIN).toString(),
    { waitUntil: 'load' }
  )
  expect(response?.status()).toBe(404)
})
```

- [ ] **Step 2: Move the existing disclosure assertion into Gallery**

In `tests/e2e/project-media-density.spec.ts`, change the long-project disclosure locator from page-wide:

```ts
const disclosure = page.getByRole('button', { name: new RegExp(`^${MEDIA_COPY[locale].disclosure}`) })
```

to Gallery-scoped:

```ts
const disclosure = gallery.getByRole('button', { name: new RegExp(`^${MEDIA_COPY[locale].disclosure}`) })
```

Delete the current `compareDocumentPosition` assertion that requires the disclosure to follow `#materials`. Replace it with:

```ts
await expect(gallery.locator('[data-project-full-gallery]')).toContainText('21')
```

- [ ] **Step 3: Build current production output and prove the new browser contract fails**

Run:

```powershell
pnpm build
pnpm exec playwright test tests/e2e/project-detail-editorial.spec.ts tests/e2e/project-media-density.spec.ts --project=vr
```

Expected: build exits 0; Playwright exits non-zero because the current page lacks the new chapter/data selectors, still places disclosure after Materials, and uses smooth thumbnail scrolling under reduced motion.

- [ ] **Step 4: Review checkpoint**

Confirm the new spec intercepts images, exercises both representative slugs, covers both locales at every required width, and does not contain screenshots or baseline writes.

---

### Task 6: Implement and integrate Hero + Story

**Files:**
- Create: `app/components/ProjectHeroFacts.vue`
- Create: `app/components/ProjectStoryChapter.vue`
- Modify: `app/pages/du-an/[slug].vue:1-51,121-132,171-228,273-514`
- Test: `tests/e2e/project-detail-editorial.spec.ts`

**Interfaces:**
- Consumes: `ProjectDetailFact[]`, the existing `MediaImage`, resolved project/category/status/copy strings, and the route's `leadImage`.
- Produces: `data-project-chapter="hero"`, `data-project-facts`, five `data-project-fact` items, `#story`, `data-story-layout`, and three `data-story-beat` elements.

- [ ] **Step 1: Create `ProjectHeroFacts.vue`**

Create the file with this complete content:

```vue
<script setup lang="ts">
import { uiText } from '~/data/ui'
import type { MediaImage } from '~/shared/media/types'
import type { ProjectDetailFact } from '~/shared/types/project-detail'

defineProps<{
  title: string
  image: MediaImage
  category: string
  status?: string
  description: string
  facts: readonly ProjectDetailFact[]
}>()

const { t } = useLanguage()
</script>

<template>
  <div data-project-chapter="hero">
    <AppHero
      :title="title"
      :image="image"
      mode="caption"
      atmosphere="dark"
      focal="50% 40%"
    >
      <template #breadcrumb>
        <nav
          class="mb-8 flex items-center gap-2 text-sm font-semibold text-white/62"
          :aria-label="t({ vi: 'Đường dẫn', en: 'Breadcrumb' })"
        >
          <NuxtLink
            to="/du-an"
            class="inline-flex items-center gap-2 transition-colors hover:text-white"
          >
            <Icon name="i-lucide-arrow-left" class="h-4 w-4" />
            {{ t({ vi: 'Dự án', en: 'Projects' }) }}
          </NuxtLink>
        </nav>
      </template>

      <template #chips>
        <div class="mb-5 flex flex-wrap items-center gap-3">
          <span class="rounded-full bg-wood-500 px-3 py-1.5 text-xs font-black uppercase tracking-[0.16em] text-white">
            {{ category }}
          </span>
          <span
            v-if="status"
            class="inline-flex items-center gap-1.5 rounded-full border border-white/25 px-3 py-1.5 text-xs font-bold text-white/86"
          >
            <Icon name="i-lucide-circle-check-big" class="h-3.5 w-3.5 text-wood-300" />
            {{ status }}
          </span>
        </div>
      </template>

      <template #meta>
        <p class="mt-5 max-w-2xl text-lg leading-8 text-white/80">
          {{ description }}
        </p>
      </template>

      <template #actions>
        <NuxtLink to="/lien-he" class="btn-primary">
          {{ t(uiText.cta.contact) }}
          <Icon name="i-lucide-arrow-right" class="h-4 w-4" />
        </NuxtLink>
        <NuxtLink to="/du-an" class="btn-secondary">
          {{ t(uiText.cta.allProjects) }}
        </NuxtLink>
      </template>
    </AppHero>

    <div data-project-facts class="border-y border-white/12 bg-ink-950 text-white">
      <div class="shell">
        <dl class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
          <div
            v-for="(fact, index) in facts"
            :key="fact.key"
            data-project-fact
            :data-fact-key="fact.key"
            class="border-b border-r border-white/12 px-4 py-6 md:px-6"
            :class="facts.length % 2 === 1 && index === facts.length - 1 ? 'col-span-2 md:col-span-1' : ''"
          >
            <dt class="flex items-center gap-2 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-white/52">
              <Icon :name="fact.icon" class="h-4 w-4 text-wood-300" />
              {{ fact.label }}
            </dt>
            <dd class="mt-3 text-base font-black leading-snug text-white">
              {{ fact.value }}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  </div>
</template>
```

- [ ] **Step 2: Create `ProjectStoryChapter.vue`**

Create the file with this complete content:

```vue
<script setup lang="ts">
import type { MediaImage } from '~/shared/media/types'

defineProps<{
  overview?: string
  challenge?: string
  solution?: string
  leadImage?: MediaImage
}>()

const { t } = useLanguage()
</script>

<template>
  <section
    v-if="overview || challenge || solution"
    id="story"
    data-project-chapter="story"
    class="section-y scroll-mt-[calc(var(--header-h)+var(--subnav-h)+1rem)] bg-white"
  >
    <div class="shell">
      <p v-reveal class="eyebrow reveal">
        {{ t({ vi: 'Câu chuyện dự án', en: 'Project story' }) }}
      </p>
      <h2 v-reveal="80" class="reveal text-section-title mt-4 max-w-4xl font-black uppercase text-ink-950">
        {{ t({ vi: 'Từ bối cảnh đến lời giải', en: 'From context to response' }) }}
      </h2>

      <div data-story-layout class="mt-12 grid gap-12 md:grid-cols-[0.82fr_1.18fr] xl:gap-20">
        <div class="space-y-10">
          <article v-if="overview" data-story-beat="overview">
            <p class="text-xs font-black uppercase tracking-[0.16em] text-wood-600">01 · {{ t({ vi: 'Bối cảnh', en: 'Context' }) }}</p>
            <p class="mt-4 text-lg leading-9 text-ink-600">{{ overview }}</p>
          </article>
          <article v-if="challenge" data-story-beat="challenge" class="border-l-2 border-wood-500 pl-6">
            <p class="text-xs font-black uppercase tracking-[0.16em] text-wood-600">02 · {{ t({ vi: 'Bài toán', en: 'Challenge' }) }}</p>
            <p class="mt-4 text-xl font-black leading-8 text-ink-950">{{ challenge }}</p>
          </article>
        </div>

        <article v-if="solution" data-story-beat="solution">
          <p class="text-xs font-black uppercase tracking-[0.16em] text-wood-600">03 · {{ t({ vi: 'Lời giải', en: 'Response' }) }}</p>
          <p class="mt-4 text-lg leading-9 text-ink-600">{{ solution }}</p>
          <figure v-if="leadImage" class="mt-8 overflow-hidden rounded-2xl">
            <MediaImage
              :image="leadImage"
              preset="card"
              class="aspect-[16/10] w-full"
              img-class="rounded-2xl"
            />
          </figure>
        </article>
      </div>
    </div>
  </section>
</template>
```

- [ ] **Step 3: Wire the locale-aware view-model into the route**

In `app/pages/du-an/[slug].vue`:

1. Import `buildProjectDetailViewModel` from `~/utils/project-detail-view-model`.
2. Change `const { t, ta } = useLanguage()` to `const { locale, t, ta } = useLanguage()`.
3. Add this computed immediately after `mediaFlow`:

```ts
const detail = computed(() => buildProjectDetailViewModel({
  project,
  projects,
  imageCount: mediaFlow.eligible.length,
  locale: locale.value
}))
```

4. Delete the old `facts` computed. Keep `statusText`, gallery state, SEO, and the later sections until their replacement tasks.

- [ ] **Step 4: Replace old Hero, Overview, Challenge, Solution, and Facts markup**

Replace the old `AppHero` block at template lines 273–352 with `ProjectHeroFacts`, keep the existing
sticky subnav at lines 354–373 in place for now, then replace the old Overview, Challenge, Solution,
and Facts sections at lines 375–514 with `ProjectStoryChapter`:

```vue
    <ProjectHeroFacts
      :title="t(project.name)"
      :image="heroImage"
      :category="t(categoryLabel)"
      :status="statusText"
      :description="t(project.shortDescription)"
      :facts="detail.facts"
    />

    <!-- Keep the current sticky subnav here until Task 9 replaces its data source. -->

    <ProjectStoryChapter
      :overview="t(project.content?.overview)"
      :challenge="t(project.content?.challenge)"
      :solution="t(project.content?.solution)"
      :lead-image="leadImage"
    />
```

Do not leave the old `#overview`, `#challenge`, `#solution`, or `#facts` sections in the DOM.

- [ ] **Step 5: Verify Hero + Story**

Run:

```powershell
pnpm lint
pnpm typecheck
pnpm build
pnpm exec playwright test tests/e2e/project-detail-editorial.spec.ts --project=vr --grep "hero and story"
```

Expected: all commands exit 0. The rest of `project-detail-editorial.spec.ts` remains red until Tasks 7–9 and is not run in this checkpoint.

- [ ] **Step 6: Review checkpoint**

Inspect the route and confirm `AppHero` itself is untouched, location is no longer duplicated in hero meta plus facts, and Hero + Story contain exactly one `h1` and one Story `h2`.

---

### Task 7: Implement Delivery + Material Story and put disclosure back inside Gallery

**Files:**
- Create: `app/components/ProjectDeliveryProof.vue`
- Create: `app/components/ProjectMaterialStory.vue`
- Modify: `app/pages/du-an/[slug].vue:516-847`
- Test: `tests/e2e/project-detail-editorial.spec.ts`
- Test: `tests/e2e/project-media-density.spec.ts`

**Interfaces:**
- Consumes: `detail.scopeItems`, `detail.deliveryPhases`, `detail.executionProof`, resolved narrative arrays/text, project media, and optional testimonial.
- Produces: `#delivery`, `data-delivery-timeline`, scope-safe `data-execution-proof`, `#materials`, and a Gallery-owned full-gallery disclosure.

- [ ] **Step 1: Create `ProjectDeliveryProof.vue`**

Create the file with this complete content:

```vue
<script setup lang="ts">
import type {
  ProjectDeliveryPhase,
  ProjectExecutionProof,
  ProjectScopeItem
} from '~/shared/types/project-detail'

const props = defineProps<{
  projectName: string
  scopeItems: readonly ProjectScopeItem[]
  phases: readonly ProjectDeliveryPhase[]
  executionProof: readonly ProjectExecutionProof[]
}>()

const { t } = useLanguage()
const timelineStyle = computed(() => ({ '--phase-count': String(props.phases.length) }))
</script>

<template>
  <section
    v-if="scopeItems.length"
    id="delivery"
    data-project-chapter="delivery"
    class="section-y scroll-mt-[calc(var(--header-h)+var(--subnav-h)+1rem)] bg-white"
  >
    <div class="shell">
      <div class="grid gap-10 md:grid-cols-[0.72fr_1.28fr] md:items-end">
        <div>
          <p v-reveal class="eyebrow reveal">{{ t({ vi: 'Triển khai', en: 'Delivery' }) }}</p>
          <h2 v-reveal="80" class="reveal text-section-title mt-4 font-black uppercase text-ink-950">
            {{ t({ vi: 'Từ phạm vi đến bàn giao', en: 'From scope to handover' }) }}
          </h2>
        </div>
        <p v-reveal="120" class="reveal text-lg leading-8 text-ink-600">
          {{ t({
            vi: `Từ chiến lược thiết kế, ${projectName} được triển khai theo đúng phạm vi đã xác nhận, với từng bước nối tiếp đến bàn giao.`,
            en: `From the design response, ${projectName} moves through its verified scope as one connected sequence toward handover.`
          }) }}
        </p>
      </div>

      <ul class="mt-10 flex flex-wrap border-y border-ink-200">
        <li
          v-for="scope in scopeItems"
          :key="scope.key"
          :data-scope-key="scope.key"
          class="flex items-center gap-3 border-r border-ink-200 px-5 py-4 text-sm font-black text-ink-950"
        >
          <Icon :name="scope.icon" class="h-5 w-5 text-wood-500" />
          {{ scope.label }}
        </li>
      </ul>

      <ol
        data-delivery-timeline
        class="project-delivery__timeline mt-12"
        :style="timelineStyle"
      >
        <li
          v-for="(phase, index) in phases"
          :key="phase.key"
          class="relative border-t border-ink-300 py-5 md:border-l md:border-t-0 md:px-5"
        >
          <span class="text-xs font-black text-wood-600">{{ String(index + 1).padStart(2, '0') }}</span>
          <Icon :name="phase.icon" class="mt-3 h-6 w-6 text-ink-950" />
          <p class="mt-3 text-sm font-black text-ink-950">{{ phase.label }}</p>
        </li>
      </ol>

      <div v-if="executionProof.length" class="mt-14 border-t border-ink-200 pt-8">
        <p class="text-xs font-black uppercase tracking-[0.16em] text-wood-600">
          {{ t({ vi: 'Bằng chứng thực hiện phù hợp phạm vi', en: 'Execution proof aligned to scope' }) }}
        </p>
        <div class="mt-6 grid gap-8 md:grid-cols-3">
          <article
            v-for="proof in executionProof"
            :key="proof.id"
            :data-execution-proof="proof.id"
            class="border-t-2 border-wood-500 pt-5"
          >
            <Icon :name="proof.icon" class="h-6 w-6 text-wood-600" />
            <h3 class="mt-4 text-lg font-black text-ink-950">{{ proof.title }}</h3>
            <p class="mt-3 text-sm leading-6 text-ink-600">{{ proof.description }}</p>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.project-delivery__timeline {
  display: grid;
  grid-template-columns: 1fr;
}

@media (min-width: 768px) {
  .project-delivery__timeline {
    grid-template-columns: repeat(var(--phase-count), minmax(0, 1fr));
  }
}
</style>
```

- [ ] **Step 2: Create `ProjectMaterialStory.vue`**

Create the file with this complete content:

```vue
<script setup lang="ts">
import type { MediaImage } from '~/shared/media/types'

type Quote = { quote: string, author: string, role?: string }

const props = defineProps<{
  experience?: string
  highlights: readonly string[]
  materials: readonly string[]
  craftsmanship?: string
  showFactoryLink?: boolean
  quote?: Quote
  images: readonly MediaImage[]
}>()

const { t } = useLanguage()
const experienceImage = computed(() => props.images[1] ?? props.images[0])
const materialImage = computed(() => props.images[3] ?? props.images[0])
</script>

<template>
  <section
    v-if="experience || highlights.length || materials.length || craftsmanship || quote"
    id="materials"
    data-project-chapter="materials"
    class="section-y scroll-mt-[calc(var(--header-h)+var(--subnav-h)+1rem)] bg-ink-950 text-white"
  >
    <div class="shell space-y-16">
      <div data-material-layout class="grid gap-10 md:grid-cols-[0.8fr_1.2fr] md:items-end">
        <div>
          <p v-reveal class="eyebrow reveal text-wood-300">{{ t({ vi: 'Câu chuyện vật liệu', en: 'Material story' }) }}</p>
          <h2 v-reveal="80" class="reveal text-section-title mt-4 font-black uppercase">
            {{ t({ vi: 'Quyết định trở thành trải nghiệm', en: 'Decisions made tangible' }) }}
          </h2>
        </div>
        <p v-if="experience" v-reveal="120" class="reveal text-xl leading-9 text-white/76">
          {{ experience }}
        </p>
      </div>

      <figure v-if="experienceImage" class="overflow-hidden rounded-2xl">
        <MediaImage
          :image="experienceImage"
          preset="gallery"
          class="aspect-[16/8] w-full"
          img-class="rounded-2xl"
        />
      </figure>

      <div v-if="highlights.length" class="grid gap-8 md:grid-cols-[0.65fr_1.35fr]">
        <p class="text-xs font-black uppercase tracking-[0.16em] text-wood-300">
          {{ t({ vi: 'Chi tiết chứng minh', en: 'Proof in the details' }) }}
        </p>
        <ul class="divide-y divide-white/14 border-y border-white/14">
          <li v-for="(highlight, index) in highlights" :key="highlight" class="grid grid-cols-[3rem_1fr] gap-4 py-5">
            <span class="text-xs font-black text-wood-300">{{ String(index + 1).padStart(2, '0') }}</span>
            <span class="text-base leading-7 text-white/80">{{ highlight }}</span>
          </li>
        </ul>
      </div>

      <div v-if="materials.length" class="grid gap-10 md:grid-cols-2 md:items-start">
        <figure v-if="materialImage" class="overflow-hidden rounded-2xl">
          <MediaImage
            :image="materialImage"
            preset="card"
            class="aspect-[4/3] w-full"
            img-class="rounded-2xl"
          />
        </figure>
        <div>
          <p class="text-xs font-black uppercase tracking-[0.16em] text-wood-300">
            {{ t({ vi: 'Bảng vật liệu', en: 'Material palette' }) }}
          </p>
          <ul class="mt-5 divide-y divide-white/14 border-y border-white/14">
            <li v-for="material in materials" :key="material" class="flex gap-3 py-4 text-base leading-7 text-white/76">
              <Icon name="i-lucide-square-stack" class="mt-1 h-5 w-5 shrink-0 text-wood-300" />
              {{ material }}
            </li>
          </ul>
        </div>
      </div>

      <div v-if="craftsmanship" class="grid gap-6 border-t border-white/16 pt-10 md:grid-cols-[0.65fr_1.35fr]">
        <p class="text-xs font-black uppercase tracking-[0.16em] text-wood-300">
          {{ t({ vi: 'Thiết kế được hiện thực hóa', en: 'Design made real' }) }}
        </p>
        <div>
          <p class="text-lg leading-9 text-white/76">{{ craftsmanship }}</p>
          <NuxtLink v-if="showFactoryLink" to="/nha-xuong" class="btn-secondary mt-7">
            {{ t({ vi: 'Xem năng lực nhà xưởng', en: 'View factory capability' }) }}
          </NuxtLink>
        </div>
      </div>

      <figure v-if="quote" class="mx-auto max-w-4xl border-y border-white/16 py-10 text-center">
        <Icon name="i-lucide-quote" class="mx-auto h-8 w-8 text-wood-300" />
        <blockquote class="mt-5 text-2xl font-black leading-snug">“{{ quote.quote }}”</blockquote>
        <figcaption class="mt-5 text-sm text-white/62">
          <strong class="text-white">{{ quote.author }}</strong>
          <span v-if="quote.role"> · {{ quote.role }}</span>
        </figcaption>
      </figure>
    </div>
  </section>
</template>
```

- [ ] **Step 3: Move full-gallery disclosure into the Gallery section**

In `app/pages/du-an/[slug].vue`, add `data-project-chapter="gallery"` to the existing `#gallery` section. Move the entire current `[data-project-full-gallery]` block from after `#materials` to inside the Gallery section, immediately after `AppGalleryEditorial` and before the Gallery `.shell` closes. Change its outer classes from:

```html
class="border-b border-ink-200 bg-white py-10"
```

to:

```html
class="mt-10 flex justify-center border-t border-ink-200 pt-8"
```

Remove the now-redundant nested `.shell`; the disclosure already sits inside Gallery's shell. Keep its button, count, aria-label, and `openFullGallery` handler unchanged.

- [ ] **Step 4: Replace Services, Experience, Materials, and Testimonial with the two new chapters**

Delete the old `#services`, `#experience`, `#materials`, and optional `#testimonial` sections. Immediately after the Gallery section, render:

```vue
    <ProjectDeliveryProof
      :project-name="t(project.name)"
      :scope-items="detail.scopeItems"
      :phases="detail.deliveryPhases"
      :execution-proof="detail.executionProof"
    />

    <ProjectMaterialStory
      :experience="t(project.content?.experience)"
      :highlights="ta(project.content?.designHighlights)"
      :materials="ta(project.content?.materials)"
      :craftsmanship="t(project.content?.craftsmanship)"
      :show-factory-link="detail.scopeItems.some(item => item.key === 'Sản xuất')"
      :quote="project.testimonial
        ? {
            quote: t(project.testimonial.quote),
            author: t(project.testimonial.author),
            role: t(project.testimonial.role)
          }
        : undefined"
      :images="allImages"
    />
```

- [ ] **Step 5: Delete superseded route derivations**

Delete `serviceCatalog`, `services`, `deliveryPhases`, `highlights`, `walkthroughSteps`, and `materialsImage` from the route script. Keep `allImages`, `leadImage`, gallery state, related-project logic, trust data, observer, SEO, and lightbox state until their later tasks.

- [ ] **Step 6: Verify Delivery, Material Story, and media density**

Run:

```powershell
pnpm lint
pnpm typecheck
pnpm build
pnpm exec playwright test tests/e2e/project-detail-editorial.spec.ts --project=vr --grep "delivery proof"
pnpm exec playwright test tests/e2e/project-media-density.spec.ts --project=vr
```

Expected: all commands exit 0. The density spec must still prove 9/30 and 3/3 inline media, full-lightbox count, Escape close, and focus return.

- [ ] **Step 7: Review checkpoint**

Inspect the design-only `nha-vuon-chily` DOM and verify it has no execution proof or factory CTA in Material Story. Inspect construction-only `nha-ta-dung` and verify it may show Craftsmanship but does not show the factory CTA. Inspect `khach-san-eo-gio` and verify the execution proof corresponds exactly to Design + Production + Construction.

---

### Task 8: Implement Related Work + Conversion Finale

**Files:**
- Create: `app/components/ProjectRelatedProjects.vue`
- Create: `app/components/ProjectConversionFinale.vue`
- Modify: `app/pages/du-an/[slug].vue:166-191,849-962`
- Read: `app/data/factory.ts:293-298`
- Test: `tests/e2e/project-detail-editorial.spec.ts`

**Interfaces:**
- Consumes: `ProjectRelatedCard[]`, `factoryStats`, `company.phone`, category labels, and existing CTA labels.
- Produces: `data-project-chapter="related"` and `data-project-chapter="finale"` while removing route-local duplicated trust stats.

- [ ] **Step 1: Create `ProjectRelatedProjects.vue`**

Create the file with this complete content:

```vue
<script setup lang="ts">
import { categoryDefinitions } from '~/data/categories'
import { uiText } from '~/data/ui'
import type { ProjectRelatedCard } from '~/shared/types/project-detail'

defineProps<{ projects: readonly ProjectRelatedCard[] }>()

const { t } = useLanguage()
</script>

<template>
  <section
    v-if="projects.length"
    data-project-chapter="related"
    class="section-y bg-ink-50"
  >
    <div class="shell">
      <div class="mb-10 flex items-end justify-between gap-6">
        <div>
          <p v-reveal class="eyebrow reveal">{{ t(uiText.labels.exploreMore) }}</p>
          <h2 v-reveal="80" class="reveal text-section-title mt-4 font-black uppercase text-ink-950">
            {{ t(uiText.labels.relatedProjects) }}
          </h2>
        </div>
        <NuxtLink to="/du-an" class="btn-outline hidden md:inline-flex">
          {{ t(uiText.cta.allProjects) }}
        </NuxtLink>
      </div>

      <div class="grid gap-6 md:grid-cols-3">
        <NuxtLink
          v-for="({ item, cover }, index) in projects"
          :key="item.slug"
          v-reveal="index * 100"
          :to="`/du-an/${item.slug}`"
          class="group reveal block overflow-hidden rounded-2xl bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-wood-500"
        >
          <div v-if="cover" class="aspect-[4/3] overflow-hidden bg-ink-100">
            <NuxtImg
              :src="cover.path"
              :alt="t(item.name)"
              :width="cover.width"
              :height="cover.height"
              sizes="sm:100vw md:33vw"
              loading="lazy"
              class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transform-none motion-reduce:transition-none"
            />
          </div>
          <div :class="['border border-ink-200 p-5', cover ? 'border-t-0' : '']">
            <span class="text-xs font-bold uppercase tracking-[0.16em] text-wood-600">
              {{ t(categoryDefinitions[item.category].label) }}
            </span>
            <h3 class="mt-3 text-xl font-black text-ink-950">{{ t(item.name) }}</h3>
          </div>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
```

- [ ] **Step 2: Create `ProjectConversionFinale.vue`**

Create the file with this complete content:

```vue
<script setup lang="ts">
import { uiText } from '~/data/ui'
import type { FactoryStat } from '~/data/factory'

const props = defineProps<{
  stats: readonly FactoryStat[]
  phone: string
}>()

const { t } = useLanguage()
const phoneHref = computed(() => `tel:${props.phone.replaceAll(' ', '')}`)
</script>

<template>
  <section data-project-chapter="finale" class="section-cta bg-white text-ink-950">
    <div class="shell">
      <dl class="grid gap-4 border-b border-ink-200 pb-12 sm:grid-cols-2 lg:grid-cols-4">
        <div v-for="stat in stats" :key="stat.id" class="flex items-center gap-4">
          <Icon :name="stat.icon" class="h-9 w-9 shrink-0 text-wood-500" />
          <div class="flex flex-col">
            <dt class="order-2 text-xs font-bold uppercase tracking-[0.14em] text-ink-500">{{ t(stat.label) }}</dt>
            <dd class="order-1 text-xl font-black text-ink-950">{{ t(stat.value) }}</dd>
          </div>
        </div>
      </dl>

      <div class="grid gap-8 pt-12 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <h2 class="max-w-3xl text-3xl font-black uppercase leading-tight md:text-5xl">
            {{ t({ vi: 'Dự án của bạn cần một lời giải liền mạch?', en: 'Does your project need one connected response?' }) }}
          </h2>
          <p class="mt-4 max-w-2xl text-lg text-ink-600">
            {{ t({
              vi: 'Trao đổi với Lai Huy về bối cảnh, phạm vi và cách đưa ý tưởng thành một kế hoạch triển khai rõ ràng.',
              en: 'Talk with Lai Huy about the context, scope and a clear path from design intent to delivery.'
            }) }}
          </p>
        </div>
        <div class="flex flex-col gap-3 sm:flex-row md:flex-col">
          <NuxtLink to="/lien-he" class="btn-primary">{{ t(uiText.cta.quote24h) }}</NuxtLink>
          <a :href="phoneHref" class="btn-outline">{{ phone }}</a>
        </div>
      </div>
    </div>
  </section>
</template>
```

- [ ] **Step 3: Replace route-local related/trust derivations**

In the route script:

1. Import `factoryStats` from `~/data/factory`.
2. Delete the old `rawText`, `rawList`, `scopeKeys`, `relatedProjects`, and `trustStats` blocks after all their remaining consumers have been removed.
3. Add:

```ts
const relatedCards = computed(() => detail.value.relatedProjects.map(item => ({
  item,
  cover: projectCoverAsset(item.mediaId, item.coverImage)
})))
```

- [ ] **Step 4: Replace the old Related and CTA sections**

Delete the old route-local Related section and Trust + CTA section, then render:

```vue
    <ProjectRelatedProjects :projects="relatedCards" />
    <ProjectConversionFinale :stats="factoryStats" :phone="company.phone" />
```

- [ ] **Step 5: Verify chapter order and finale**

Run:

```powershell
pnpm lint
pnpm typecheck
pnpm build
pnpm exec playwright test tests/e2e/project-detail-editorial.spec.ts --project=vr --grep "chapter order"
```

Expected: the focused Playwright test exits 0 for both rich and sparse routes, with exactly `hero, story, gallery, delivery, materials, related, finale`.

- [ ] **Step 6: Review checkpoint**

Confirm the finale imports `factoryStats` rather than retaining duplicate literals, remains a light surface immediately before the ink footer, and uses only links/phone actions with no success or delivery claim.

---

### Task 9: Finish route orchestration, four-anchor navigation, and reduced motion

**Files:**
- Modify: `app/pages/du-an/[slug].vue:1-970`
- Modify: `app/components/GalleryLightbox.vue:129-145`
- Test: `tests/e2e/project-detail-editorial.spec.ts`
- Test: `tests/e2e/project-media-density.spec.ts`

**Interfaces:**
- Consumes: `detail.navSections`, the six new components, existing Gallery/lightbox state, and unchanged SEO/JSON-LD behavior.
- Produces: the final orchestration-only route, active four-anchor subnav, reduced-motion thumbnail behavior, and a green complete browser contract.

- [ ] **Step 1: Replace the old nav derivation and observer source**

Delete the old `navSections` computed. Keep `activeSection = ref('story')`, but change both observer loops to use the view-model:

```ts
const activeSection = ref('story')
onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) activeSection.value = entry.target.id
      }
    },
    { rootMargin: '-45% 0px -50% 0px' }
  )

  for (const section of detail.value.navSections) {
    const element = document.getElementById(section.id)
    if (element) observer.observe(element)
  }

  onUnmounted(() => observer.disconnect())
})
```

- [ ] **Step 2: Replace the sticky subnav markup**

Use this exact markup between `ProjectHeroFacts` and `ProjectStoryChapter`:

```vue
    <nav
      data-project-subnav
      class="subnav-anchor sticky z-30 border-b border-ink-200 bg-white/95 backdrop-blur-md"
      :aria-label="t({ vi: 'Mục lục dự án', en: 'Case study sections' })"
    >
      <div class="shell flex gap-1 overflow-x-auto py-3">
        <a
          v-for="section in detail.navSections"
          :key="section.id"
          :href="`#${section.id}`"
          class="subnav-chip shrink-0 rounded-full px-4 py-2 text-sm font-bold transition-colors motion-reduce:transition-none"
          :class="activeSection === section.id
            ? 'bg-ink-950 text-white'
            : 'text-ink-500 hover:text-wood-600'"
          :aria-current="activeSection === section.id ? 'location' : undefined"
        >
          {{ section.label }}
        </a>
      </div>
    </nav>
```

- [ ] **Step 3: Make lightbox thumbnail movement respect reduced motion**

In `GalleryLightbox.vue`, add this helper immediately above `scrollActiveThumbIntoView`:

```ts
const thumbnailScrollBehavior = (): ScrollBehavior =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
```

Then replace the hardcoded behavior:

```ts
?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' })
```

with:

```ts
?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: thumbnailScrollBehavior() })
```

The helper is called only inside the existing `import.meta.client` guard. Do not change props, emits, keyboard handling, focus trap, fullscreen, swipe, or body scroll locking.

- [ ] **Step 4: Remove all superseded route code and verify retained responsibilities**

The final route script must retain exactly these responsibility groups:

- project lookup, `definePageMeta`, and fatal 404;
- locale access and `detail` computed;
- media/cover/gallery-group/media-flow joins;
- gallery tab filtering and lightbox state;
- hero status and category label;
- related cover join;
- active-section observer;
- SEO, canonical, Open Graph, and JSON-LD.

Delete unused imports/types and all presentational catalogs now owned by components/view-model. Keep the current SEO fallback chain and JSON-LD conditional spreads unchanged.

- [ ] **Step 5: Run the full project-detail browser contract**

Run:

```powershell
pnpm lint
pnpm lint:media
pnpm typecheck
pnpm test
pnpm build
pnpm exec playwright test tests/e2e/project-detail-editorial.spec.ts tests/e2e/project-media-density.spec.ts --project=vr
```

Expected: every command exits 0. This includes 12 VI/EN breakpoint-boundary checks, scope-safe proof, the two project shapes, disclosure placement, 3/30 media behavior, Escape/focus return, and reduced-motion thumbnail scrolling.

- [ ] **Step 6: Review checkpoint**

Use `git diff --stat` and inspect `[slug].vue`; confirm it is now an orchestration file rather than a second data/component layer, no old section IDs remain, and no raw media URL or hardcoded company stat was introduced.

---

### Task 10: Full verification and handoff without baseline mutation

**Files:**
- Review: every file listed in this plan.
- Do not modify: Playwright snapshots, generated media files, lockfile, package manifest, or unrelated routes.

**Interfaces:**
- Consumes: the completed implementation and all contracts from Tasks 1–9.
- Produces: reproducible command evidence, direct route evidence, a final diff review, and an explicit visual-baseline decision for the user.

- [ ] **Step 1: Run all static and unit gates separately**

Run each command independently and record its exit code:

```powershell
pnpm lint
pnpm lint:media
pnpm typecheck
pnpm test
pnpm build
```

Expected: every command exits 0. A test process that passes assertions but hangs or times out is non-zero and must be reported as a failure.

- [ ] **Step 2: Run targeted route and accessibility gates**

Run:

```powershell
pnpm exec playwright test tests/e2e/project-detail-editorial.spec.ts tests/e2e/project-media-density.spec.ts --project=vr
pnpm test:gates:text
pnpm test:gates:layout
pnpm test:gates:a11y
pnpm test:gates:hero
```

Expected: every command exits 0. Record whether Supabase media and Google Maps were enabled, blocked, intercepted, or unavailable for each browser run.

- [ ] **Step 3: Directly inspect all project narratives**

Review all 11 records in `app/data/projects.ts` using this fixed table of questions for VI and EN:

1. Does Overview establish one project-specific thesis?
2. Does Challenge follow from that thesis without inventing a hidden client requirement?
3. Does Solution directly answer Challenge?
4. Do Highlights/Materials/Craftsmanship prove the Solution with existing evidence?
5. Does Experience close the same story without a new claim?
6. Does English preserve meaning without adding facts?
7. Is Craftsmanship absent from design-only projects?

Record any rejected sentence in the implementation notes together with the evidence gap that caused its removal.

- [ ] **Step 4: Directly inspect responsive and interaction boundaries**

Using the production server already built, inspect both `/du-an/khach-san-eo-gio` and `/du-an/nha-xuong-anh-cuong` in VI and EN at `390`, `767`, `768`, `1279`, `1280`, and `1440` widths. Verify:

- fact rail is 2/3/5 columns at the specified breakpoints;
- Story and Material Story preserve source reading order;
- subnav remains attached to the header and all four anchors land below both sticky bars;
- no horizontal overflow or clipped VI/EN labels;
- Gallery remains 9/30 and 3/3;
- disclosure opens the full set and focus returns after Escape;
- design-only work has no execution/factory claim;
- finale is light immediately before the ink footer.

- [ ] **Step 5: Run visual regression as a diagnostic only**

Run:

```powershell
pnpm test:vr
```

Expected: existing `project-detail` snapshots may fail because the redesign intentionally changes the full page. Inspect the diff and verify failures are restricted to approved project-detail changes. Do not run `pnpm test:vr:approve` or any `--update-snapshots` command. Report the exact non-zero result as a pending baseline decision; it prevents an unqualified “all checks pass” claim until the user separately approves baseline changes.

- [ ] **Step 6: Final diff and workspace review**

Run:

```powershell
git diff --check
git diff --stat
git status --short
```

Inspect every changed file. Preserve the existing untracked `graphify-out/` directory and any user-owned dirty files. Confirm no generated artifact, test report, screenshot, `.env`, dependency file, or unrelated route entered the diff.

- [ ] **Step 7: Handoff without committing**

Report:

- the seven final chapters and four anchors;
- which eight projects received narrative additions;
- the exact exit code of every command;
- all skipped, timed-out, externally dependent, or diagnostic-only checks;
- the visual snapshot decision still requiring explicit user approval;
- the final changed/untracked file list.

Do not commit or push. If the user later authorizes commits, group them by the independently reviewable task boundaries above.

---

## Self-Review Checklist

- **Spec coverage:** Task 1 locks bilingual/scope-safe content; Task 2 supplies exact copy for all eight sparse records; Tasks 3–4 implement the pure derivation layer; Task 5 locks browser behavior; Tasks 6–9 implement all seven chapters, four anchors, 3/30 gallery flow, responsive boundaries, and reduced motion; Task 10 verifies the full repository contract.
- **File-boundary consistency:** shared types contain no data imports; the pure helper imports verified factory pillars; components consume resolved view data; the route owns slug/media/SEO/state; generated media remains untouched.
- **Type consistency:** the same names are used throughout: `ProjectDetailFact`, `ProjectScopeItem`, `ProjectDeliveryPhase`, `ProjectExecutionProof`, `ProjectRelatedCard`, `ProjectDetailViewModel`, and `buildProjectDetailViewModel`.
- **Content safety:** no task adds hard facts, testimonials, metrics, awards, rooms, duration, brands, measured outcomes, or production claims to design-only projects.
- **Repository safety:** no dependency, backend, form transport, snapshot approval, commit, branch, or push action appears in the execution steps.
- **Placeholder scan:** every implementation and test step is concrete; none is deferred, generically named, or left without an expected result.
