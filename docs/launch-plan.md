# Kế hoạch hoàn thiện để ra sản phẩm — Lai Huy Interior

**Ngày lập:** 2026-07-23 · **Phạm vi:** UX/UI, nội dung, SEO, dọn docs. **Không đổi technical** (không backend, không đổi kiến trúc i18n, không đụng media pipeline).

> Tài liệu này thay thế vai trò checklist của `docs/audit/11-prioritized-todo-checklist.md` (10/07) — phần lớn mục Critical trong đó đã xong. Trạng thái bên dưới đã được verify lại trên code ngày 23/07.

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
| 3.1 | Chốt branch hero: commit 4 file dở, chạy `test:gates` + VR, merge | đang dở | 2h |
| 3.2 | Fix hero compact trang Liên hệ (90svh → compact đúng nghĩa, cùng cơ chế max-h đã dùng cho About) | đã chẩn đoán xong 21/07 | 2h |
| 3.3 | Verify font weight: rà `font-black` (900) trên ~10 file — xác nhận face 900 có thực sự load qua @nuxt/fonts không; nếu không thì load thêm 900 hoặc hạ về 800/700 | tránh faux-bold | 2h |
| 3.4 | Rà lại 3 lỗi contrast AA từ audit cũ (`text-white/42`, `text-white/45`, `text-ink-400`) — code đã đổi nhiều, cần đo lại bằng tool thay vì tin audit cũ | | 2h |
| 3.5 | A11y forms trang Liên hệ: `autocomplete`, `aria-invalid`, `aria-describedby`, thông báo submit `aria-live` | | 2h |
| 3.6 | `aria-current="page"` cho nav active; `aria-pressed` cho filter dự án; đếm kết quả filter qua `aria-live` | | 1h |
| 3.7 | Tap targets ≥ 44px (footer links, locale pills) — verify lại sau các đợt refactor header/footer | | 1h |
| 3.8 | Map trang Liên hệ: thay ảnh tĩnh bằng Google Maps embed iframe (không cần backend, lazy-load) | | 1h |
| 3.9 | UX form mailto: vì chưa có backend (out of scope), làm rõ hành vi — nút "Gửi qua email" + hiện song song số điện thoại/Zalo, cảnh báo nhẹ nếu không có mail client | `lien-he.vue` | 2h |
| 3.10 | Trust signals trên Home khi có input từ business (logo khách, testimonial, số dự án) | chờ Phase 1 input | 1d |
| 3.11 | Xóa dead UI code: `TemplateMenu.vue` (leftover starter, không nơi nào import) | | 15m |
| 3.12 | Chạy axe-core + keyboard traversal trên 8 route làm gate cuối trước launch | | 0.5d |

## Phase 4 — Làm gọn docs

Hiện có ~8.800 dòng docs, phần lớn là audit/spec đã hoàn thành vai trò hoặc stale:

| # | Việc | Lý do |
|---|------|-------|
| 4.1 | Viết lại `README.md` — hiện vẫn là **Nuxt starter template nguyên bản**. Nội dung: mô tả dự án, lệnh dev/build/test, media pipeline (`pnpm media:*`, `USE_SUPABASE_MEDIA`, `.env`), quy tắc "không sửa tay `catalog.generated.ts`", link docs | Bắt buộc trước khi bàn giao |
| 4.2 | Tạo `docs/README.md` làm index: mỗi doc 1 dòng — còn hiệu lực hay đã archive | Điều hướng |
| 4.3 | Archive `docs/audit/` (12 file, snapshot 10/07): chuyển vào `docs/archive/audit-2026-07/`, thêm header "snapshot lịch sử — trạng thái mới xem launch-plan.md". Không sửa nội dung từng file (tốn công, không giá trị) | Đa số mục Critical đã xong; giữ nguyên làm bằng chứng lịch sử |
| 4.4 | Archive `docs/content-audit.md` (05/07 — nói 6 dự án, giờ là 11) | Stale |
| 4.5 | Giữ nguyên: `header-footer-art-direction.md`, `hero-art-direction.md` (spec kỹ thuật đang được code tham chiếu §…), `homepage-density.md`, `docs/media-migration/`, `supabase-storage-migration-plan.md` | Còn hiệu lực |
| 4.6 | Doc nhỏ stale: comment trong `tests/.../hero.spec.ts` còn mô tả About là cover page — sửa comment cho khớp `size="tall"` | Đã flag từ 21/07 |

Ước lượng Phase 4: ~0.5–1d.

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
