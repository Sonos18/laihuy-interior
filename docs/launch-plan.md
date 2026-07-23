# Kế hoạch hoàn thiện để ra sản phẩm — Lai Huy Interior

**Ngày lập:** 2026-07-23 · **Phạm vi:** UX/UI, nội dung, SEO, dọn docs. **Không đổi technical** (không backend, không đổi kiến trúc i18n, không đụng media pipeline).

> Tài liệu này thay thế vai trò checklist của `docs/archive/audit-2026-07/11-prioritized-todo-checklist.md` (10/07) — phần lớn mục Critical trong đó đã xong. Trạng thái bên dưới đã được verify lại trên code ngày 23/07.

---

## 0. Trạng thái hiện tại (đã verify)

**Đã xong so với audit 10/07:**

- ✅ 404 thật cho slug dự án sai (`createError` trong `du-an/[slug].vue:25`)
- ✅ `robots.txt` + `sitemap.xml` (server routes, gồm cả 11 trang dự án)
- ✅ Tách `app.vue` → `AppHeader` / `AppDrawer` / `AppFooter`; skip-link WCAG 2.4.1
- ✅ 11/11 dự án có `mediaId` + đã dịch EN (`projects.ts` có 127 khóa `en:`), location/year thật
- ✅ Canonical + JSON-LD trên 3 trang: `gioi-thieu` (Organization/LocalBusiness), `nha-xuong`, `du-an/[slug]` (Article + Breadcrumb, ogType article)
- ✅ `GalleryLightbox`, testimonial structure trong trang dự án (chờ nội dung)
- ✅ Hero system thống nhất (`AppHero` + reading-zone + token `--hero-h-tall`)

**Việc dở dang:**

- ⏳ Branch `fix/hero-shared-family`: 4 file chưa commit (`main.css`, `AppHero.vue`, `gioi-thieu.vue`, `nha-xuong.vue`) — cần chốt, chạy VR gates, merge.
- ⏳ Trang Liên hệ (`/lien-he`) hero compact bị phồng lên 90svh do reading-zone override — fix đã xác định, chờ duyệt (phiên 21/07).

---

## Phase 1 — Nội dung (ưu tiên cao nhất)

Gap lớn nhất còn lại: **EN mode vẫn hiện tiếng Việt** ở phần thân các trang Dịch vụ / Nhà xưởng / Tuyển dụng.

| # | Việc | File | Ước lượng |
|---|------|------|-----------|
| 1.1 | Dịch EN toàn bộ `factory.ts` (capabilities, machinery, workflow, QC) | `app/data/factory.ts` | 0.5d |
| 1.2 | Dịch EN toàn bộ `services.ts` (6 dịch vụ) | `app/data/services.ts` | 0.5d |
| 1.3 | Dịch EN + đồng bộ địa chỉ `careers.ts` — job đang ghi "Bến Tre / Long Hậu" trong khi `company.ts` là Long Hậu (Tây Ninh) + Vĩnh Long. Lấy `company.addresses` làm nguồn chuẩn | `app/data/careers.ts` | 0.5d |
| 1.4 | Siết type `LocalizedValue<T> = { vi: T; en: T }` để `tsc` liệt kê hết chỗ thiếu (làm **trước** 1.1–1.3, để không sót) | `app/shared/types/localization.ts` | 1h |
| 1.5 | Alt text riêng cho từng ảnh gallery (hiện tất cả ảnh 1 dự án dùng chung alt = tên dự án) | `projects.ts` + `project-media` | 0.5d |
| 1.6 | Rà placeholder còn lại: kiểm tra 11 dự án đủ overview/challenge/solution; facts (rooms/duration/area) trang nào thiếu thì ẩn hàng thay vì hiện label generic | `projects.ts`, `[slug].vue` | 0.5d |

**Cần input từ business (không tự bịa — đánh dấu "Missing business input"):**

- Năm thành lập, lịch sử ngắn, tầm nhìn/sứ mệnh cho trang Giới thiệu
- Chứng nhận/tiêu chuẩn (ISO?…) cho trang Nhà xưởng
- 2–3 testimonial khách hàng (structure đã sẵn trong trang dự án)
- Logo khách hàng/đối tác nếu được phép dùng (trust signals)
- **Domain thật** — `nuxt.config.ts:32` đang là placeholder `https://laihuy-interior.com` (TODO trong code)

## Phase 2 — SEO (chuẩn hóa 8 trang về cùng một mức)

Hiện 3 trang có canonical + JSON-LD, 5 trang chưa. Chuẩn cần đạt cho **mọi** trang: `title` + `description` (song ngữ, đúng độ dài), `canonical`, `ogUrl`, `ogType`, `ogSiteName`, `ogImage` tuyệt đối, JSON-LD phù hợp.

| # | Việc | Ghi chú | Ước lượng |
|---|------|---------|-----------|
| 2.1 | Trích helper `usePageSeo(path, seo)` dùng chung: canonical + og đầy đủ, tránh lặp 8 lần | pattern đã có sẵn ở `gioi-thieu.vue` | 2h |
| 2.2 | `/` (Home): canonical + JSON-LD `LocalBusiness` (2 địa điểm) + `WebSite` | dữ liệu đã có trong `company.ts` | 2h |
| 2.3 | `/du-an`: canonical + `CollectionPage` + `ItemList` 11 dự án | | 1h |
| 2.4 | `/dich-vu`: canonical + `Service`/`ItemList` | | 1h |
| 2.5 | `/lien-he`: canonical + `ContactPage` | | 30m |
| 2.6 | `/tuyen-dung`: canonical + `JobPosting` cho từng vị trí → đủ điều kiện Google Jobs | phụ thuộc 1.3 (địa chỉ chuẩn) | 2h |
| 2.7 | ✅ **Done (2026-07-23)** — rút gọn 4 title bị cắt (home, services, about vi) + nén home description về ≤160; giữ nguyên các mô tả ngắn (không phải lỗi). Tất cả title ≤60, description trong dải hiển thị | `company.ts` seo block | 0.5d |
| 2.8 | ⏳ **CHỜ ASSET** — OG image 1200×630 có logo/tagline thay ảnh hero thô. Cần file thiết kế branded thật (logo + tagline + layout) + quyết định thương hiệu → chờ business cấp logo/brand, hoặc dựng OG template HTML→screenshot nếu được duyệt. Hiện các trang dùng ảnh hero làm OG (vẫn hợp lệ, chưa tối ưu) | asset mới | 0.5d |
| 2.9 | Sitemap: thêm `<lastmod>` (lấy từ build date) — optional | `server/routes/sitemap.xml.ts` | 30m |

**Ghi nhận, KHÔNG làm đợt này (technical):** URL-based i18n `/en` + `hreflang`. Chừng nào ngôn ngữ còn là cookie thì nội dung EN không index được — chấp nhận launch VI-first, EN là tiện ích cho khách quốc tế được gửi link trực tiếp. Đây là hạng mục lớn nhất sau launch.

## Phase 3 — UX/UI hoàn thiện

| # | Việc | Ghi chú | Ước lượng |
|---|------|---------|-----------|
| 3.1 | ✅ **Done** — hero reading-zone đã merge | | 2h |
| 3.2 | ✅ **Done** — `--hero-h-compact` cap trang Liên hệ, đã merge | | 2h |
| 3.3 | ✅ **Done (2026-07-23)** — xác nhận Inter chỉ load 400/500/600/700, không có 900 → font-black là faux-bold. Thêm `fonts` config trong nuxt.config load weight 900 (verify: 8 face 900 trong build); subset vietnamese đã sẵn | tránh faux-bold | 2h |
| 3.4 | ✅ **Done (2026-07-23)** — `text-white/42,/45` đã biến mất từ trước. Sửa `text-ink-400`→`ink-500` ở 2 count badge, và `.eyebrow` `wood-500`→`wood-600` (axe: 4.29–4.31:1 → pass ≥4.5). Verify axe: 0 lỗi contrast thật | | 2h |
| 3.5 | ✅ **Done (2026-07-23)** — `autocomplete` name/tel/email, `aria-describedby` disclosure, status region `aria-live`, bỏ `resize-none` | | 2h |
| 3.6 | ✅ **Done (2026-07-23)** — `aria-current` (đã có), thêm `aria-pressed` + vùng `aria-live` đếm kết quả cho filter du-an & gallery nha-xuong | | 1h |
| 3.7 | ✅ **Done (2026-07-23)** — footer links 17px→29px, footer social 21px→35px (padding + negative margin, layout không đổi). Lang pills đã 44px sẵn. Contact card CTA 20px đạt 2.5.8 qua ngoại lệ spacing (target đơn lẻ) | | 1h |
| 3.8 | ✅ **Done (2026-07-23)** — Google Maps embed iframe (keyless, lazy-load), thay ảnh tĩnh | | 1h |
| 3.9 | ✅ **Done (2026-07-23)** — disclosure mailto (đã có) + status `aria-live` khi submit + fallback "Gọi {số}" dưới nút gửi | `lien-he.vue` | 2h |
| 3.10 | ⏳ **CHỜ INPUT** — trust signals cần logo khách/testimonial/số liệu từ business | chờ Phase 1 input | 1d |
| 3.11 | ✅ **Done (2026-07-23)** — xóa `TemplateMenu.vue` | | 15m |
| 3.12 | ✅ **Automated done (2026-07-23)** — `tests/e2e/a11y.spec.ts` (axe-core, WCAG A/AA, 8 route, chỉ Chromium): 0 violation. color-contrast tắt trong gate vì flaky trên gradient hero (verify riêng qua scrim contract + full axe pass). **Follow-up:** keyboard traversal + NVDA/VoiceOver smoke thủ công | | 0.5d |

## Phase 4 — Làm gọn docs

Hiện có ~8.800 dòng docs, phần lớn là audit/spec đã hoàn thành vai trò hoặc stale:

| # | Việc | Lý do |
|---|------|-------|
| 4.1 | ✅ **Done (2026-07-23)** — `README.md` viết lại: mô tả dự án, stack, setup + env, lệnh dev/build/test/gates, media pipeline (`pnpm media:*`), quy tắc "không sửa tay `catalog.generated.ts`", link docs | Bắt buộc trước khi bàn giao |
| 4.2 | ✅ **Done (2026-07-23)** — `docs/README.md` index: mục Active vs Archived, mỗi doc 1 dòng | Điều hướng |
| 4.3 | ✅ **Done (2026-07-23)** — `docs/audit/` → `docs/archive/audit-2026-07/` (git mv, giữ lịch sử); thêm header "historical snapshot → xem launch-plan.md" vào README của archive, không sửa từng report | Đa số mục Critical đã xong; giữ làm bằng chứng lịch sử |
| 4.4 | ✅ **Done (2026-07-23)** — `content-audit.md` → `docs/archive/`, thêm header stale | Stale |
| 4.5 | ✅ Giữ nguyên: `header-footer-art-direction.md`, `hero-art-direction.md`, `homepage-density.md`, `docs/media-migration/`, `supabase-storage-migration-plan.md` | Còn hiệu lực |
| 4.6 | ✅ **Done** (trong đợt hero) — comment COVER_PAGES trong `hero.spec.ts` đã nêu rõ tall (gioi-thieu) + compact (lien-he) | Đã flag từ 21/07 |

Phase 4 hoàn tất 2026-07-23.

---

## Ngoài phạm vi đợt này (technical — làm sau launch, theo thứ tự giá trị)

1. **Contact backend + analytics** — site hiện **không ghi nhận được lead** (mailto-only, không tracking). Đây là gap kinh doanh lớn nhất; là việc technical đầu tiên nên làm sau khi ra sản phẩm.
2. URL-based i18n `/en` + hreflang (mở khóa index tiếng Anh) — chỉ làm **sau** khi Phase 1 dịch xong.
3. Security headers, CI build + catalog-drift check, hero preload/srcset, `fallback.generated.ts`.
4. Dọn dep chết: `@nuxtjs/device` vẫn trong `dependencies`.

## Thứ tự thực hiện đề xuất

```
Tuần 1: 3.1–3.2 (chốt hero) → 1.4 → 1.1–1.3 (dịch) → 2.1–2.6 (SEO đồng nhất)
Tuần 2: 2.7–2.8 (copy SEO + OG) → 1.5–1.6 (alt/placeholder) → 3.3–3.9 (UI/a11y)
Tuần 3: 4.1–4.6 (docs) → 3.10 (trust signals, nếu có input) → 3.12 (axe gate) → launch
```

**Chặn launch (phải có trước khi go-live):** domain thật cho `siteUrl` · Phase 1 dịch xong (nếu giữ nút EN) hoặc quyết định ẩn nút EN tạm thời · 3.1/3.2 hero chốt xong.
