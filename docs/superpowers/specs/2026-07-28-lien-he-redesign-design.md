# Redesign trang Liên hệ (`/lien-he`) — Design Spec

Ngày: 2026-07-28

## Mục tiêu

Trang `/lien-he` là đích đến của mọi CTA trên site ("Nhận báo giá trong 24h" ở header và ở
`.section-cta` của sáu trang). Việc duy nhất nó phải làm là **nhận được yêu cầu tư vấn**. Bản
hiện tại không phục vụ việc đó: form nằm sau năm icon-card, cách đầu trang ~1500px, và bản thân
form chỉ mở mailto — không validation, không trạng thái, không lưu lead.

Redesign này làm hai việc cùng lúc:

1. **Cấu trúc + thị giác** — đưa form thành xương sống của trang, xoá trùng lặp, thay ngôn ngữ
   icon-card bằng ngôn ngữ editorial mà header/footer đã dùng.
2. **Form thật** — validation, trạng thái submit/success/error, và một interface gửi lead
   trừu tượng để chốt backend sau mà không phải đập lại UI.

## Phạm vi

**Trong phạm vi**

- `app/pages/lien-he.vue` — dựng lại toàn bộ phần thân trang (dưới hero).
- `app/shared/lead/` — module thuần (types + validation), unit-testable, không phụ thuộc Vue.
- `app/composables/useLeadSubmission.ts` — state machine của form + điều phối adapter.
- `app/lead/adapters/mailto.ts` — hành vi mailto hiện tại, tách ra thành adapter đầu tiên.
- `app/assets/css/main.css` — thêm token + class `.field` cho form control.
- `app/data/ui.ts` — chuỗi song ngữ mới (nhãn field, lỗi validation, trạng thái).
- `tests/lead.test.ts` — unit test cho validation + mailto builder.
- `tests/e2e/` — một spec nhỏ cho hành vi form (invalid → error, success → announce).

**Ngoài phạm vi**

- **Chốt backend.** Adapter Supabase/Formspree/Resend không nằm trong lần này (quyết định của
  người dùng: thiết kế interface trước, chốt adapter sau). `mailto` vẫn là adapter mặc định và
  hành vi người dùng thấy được **không đổi** cho tới khi chốt.
- **`AppHero.vue` và hero của trang này.** `AppHero.vue:43-50` khoá mọi trang vào
  `--hero-min-h-home` ("home is the single standard"), có gate G1/G2 trong `tests/e2e/hero.spec.ts`
  canh. Không đụng.
- **`AppFooter.vue`.** Xem "Trùng lặp với footer" bên dưới.
- **Trust signals** (logo khách hàng, testimonial, số liệu). `company.testimonials` là `[]`,
  `certifications`/`awards` là `undefined` — chưa có nội dung. Đây là task 3.10 trong
  `launch-plan.md`, đang **chờ input từ business**. Layout chừa chỗ cho nó nhưng không dựng UI rỗng.
- **Upload file.** Xem "Lời hứa gửi bản vẽ" bên dưới.
- **Analytics/tracking.** Ngoài phạm vi launch theo `launch-plan.md`.
- Mọi trang khác.

## Hiện trạng

`app/pages/lien-he.vue` (325 dòng) dựng ba khối dưới hero:

| Khối | Nội dung | Vấn đề |
|---|---|---|
| Section 1 (`bg-white`) | 5 `industrial-card`: 2 địa chỉ, phone, email, giờ làm việc | Grid 3 cột lẻ hàng (3+2). Icon-per-card là đúng "template tell" mà đợt redesign footer đã bỏ. Đứng chắn giữa hero và form. |
| Section 2 trái (`bg-ink-50`) | Form trong card trắng bo góc | Card-trong-section-tint là lớp vỏ thừa. Heading `text-5xl font-black` in hoa nhét cạnh body `text-sm`. Chỉ có `required` của HTML, không có thông báo lỗi. |
| Section 2 phải | Heading + iframe Google Maps + 2 card địa chỉ | Địa chỉ lặp lại lần 2. Cột phải cao hơn nội dung nên rỗng. |

Cộng với footer, **hai địa chỉ xuất hiện 3 lần trên cùng một trang**; phone/email/giờ làm việc
xuất hiện 2 lần.

Về hành vi: `submitForm()` set `submitted = true` rồi gán `window.location.href = mailto:...`.
Không validate ngoài `required`, không có trạng thái nào người dùng thấy được, và nếu thiết bị
không có mail client thì không có gì xảy ra ngoài dòng chữ "Không mở được email?" đặt sẵn.

## Thiết kế

### Bố cục trang

```
┌─ AppHero ──────────────────────────────────────────── (không đổi)
│
├─ Band 1 · "Gửi yêu cầu"            .section-y bg-white
│  ┌───────────────────────────────────────────────┐
│  │ eyebrow: NHẬN BÁO GIÁ 24H                     │
│  │ h2: Gửi yêu cầu tư vấn dự án                  │
│  │ dẫn nhập 1 dòng                               │
│  │ ↳ hoặc gọi ngay +84 903 102 012                │
│  │                                               │
│  │ [ Họ tên        ]  [ Điện thoại  ]            │
│  │ [ Email         ]  [ Loại dự án  ]            │
│  │ [ Thông tin công trình                      ] │
│  │ [ Gửi yêu cầu ]                               │
│  └───────────────────────────────────────────────┘
│
├─ Band 2 · "Văn phòng và nhà xưởng"  .section-y bg-ink-50
│  ┌─────────────────── ảnh xưởng ─────────────────────┐
│  ├───────────────┬───────────────┬───────────────────┤
│  │ VĂN PHÒNG     │ NHÀ XƯỞNG     │ LIÊN HỆ TRỰC TIẾP │
│  │ GIAO DỊCH     │               │                   │
│  │ địa chỉ       │ địa chỉ       │ ĐIỆN THOẠI  +84…  │
│  │ Mở Maps →     │ Mở Maps →     │ EMAIL       noi…  │
│  │               │               │ GIỜ LÀM VIỆC 8–17 │
│  └───────────────┴───────────────┴───────────────────┘
│
└─ AppFooter ─────────────────────────────────────────── (không đổi)
```

Hai band, cùng `.shell`, cùng `.section-y` — giữ nguyên "one left edge, one measure" mà
`tests/e2e/alignment.spec.ts` đang canh.

### Band 1 — form

**Một cột, hết measure.** Không rail, không sidebar. Form là thứ duy nhất trong band này.

**Form không nằm trong card.** Bỏ `rounded-2xl border bg-white p-8`. Section đã là `bg-white`;
một card trắng trên nền trắng-ngà chỉ thêm một đường viền không mang thông tin. Field tự có
viền riêng, đó đã đủ để phân định vùng nhập.

**Gọi nhanh.** Một dòng text link "hoặc gọi ngay {phone}" đặt ngay dưới đoạn dẫn nhập, trước
field đầu tiên. Nhiều khách muốn gọi thẳng thay vì gõ form; dòng này để họ không phải cuộn qua
hết form mới thấy số. Không dùng CSS `order` ở đâu trong trang — thứ tự DOM và thứ tự thị giác
trùng nhau ở mọi viewport.

**Heading.** `AppHero` đã sở hữu `h1` của trang (`AppHero.vue:195`), nên heading của cả hai band
là `h2`. Dùng `.text-section-title` (`main.css:1449` — `clamp(1.75rem, 1.2rem + 2.6vw, 3rem)`),
đúng class mà `du-an/[slug].vue` đã chuyển sang, thay cho cặp ad-hoc `text-3xl md:text-5xl` mà
trang này đang viết tay ở hai chỗ. Giữ `font-black uppercase text-ink-950` như các trang khác.

### Band 1 — field và trạng thái

**Class `.field`.** Hôm nay style field lặp inline 5 lần
(`mt-2 w-full rounded-2xl border border-ink-200 px-4 py-3 outline-none focus:border-wood-500`).
Gom thành một class trong `@layer components` của `main.css`, cạnh `.btn-*` và `.industrial-card`,
với token L2 mới:

| Token | Giá trị | Ghi chú |
|---|---|---|
| `--field-radius` | `0.75rem` | Xuống từ `rounded-2xl` (1rem): field là hộp chữ nhật cao 48px, bo 16px làm nó đọc như pill. |
| `--field-border` | `var(--color-ink-200)` | Như hiện tại. |
| `--field-border-focus` | `var(--color-wood-600)` | wood-600 = `--accent-light`, đạt 4.5:1; wood-500 không đạt (xem `.eyebrow`). |
| `--field-border-error` | `var(--color-ink-950)` | **Không thêm màu mới.** Xem "Rủi ro" #1: field lỗi được đánh dấu bằng viền ink-950 dày hơn + chữ lỗi + `aria-invalid`, không bằng hue. |
| `--field-py` / `--field-px` | `0.75rem` / `1rem` | Bằng hiện tại. |

**Focus.** Hiện tại focus chỉ đổi màu viền (`outline-none focus:border-wood-500`). Đổi viền
không phải focus indicator đạt chuẩn — thêm `:focus-visible { outline: 2px solid
var(--field-border-focus); outline-offset: 2px }`.

**Validation.** Client-side, thuần, ở `app/shared/lead/validate.ts`:

```ts
export type LeadField = 'name' | 'phone' | 'email' | 'projectType' | 'message'
export type LeadErrorCode = 'required' | 'emailFormat' | 'phoneFormat' | 'tooShort'
export type LeadDraft = Record<LeadField, string>
export type LeadErrors = Partial<Record<LeadField, LeadErrorCode>>

export function validateLead(draft: LeadDraft): LeadErrors
```

Module trả **mã lỗi**, không trả chuỗi — chuỗi song ngữ nằm ở `app/data/ui.ts` và được `t()`
resolve trong component. Nhờ đó module không biết gì về locale và test được bằng vitest thuần,
đúng như `app/shared/media/validation.ts` đang làm.

Quy tắc: tất cả field bắt buộc; `email` phải có dạng `x@y.z`; `phone` phải còn ≥ 8 chữ số sau khi
bỏ khoảng trắng/`+`/`-`/`()`; `message` phải ≥ 10 ký tự.

**Trạng thái.** `useLeadSubmission()` giữ `status: 'idle' | 'submitting' | 'success' | 'error'`.

| Trạng thái | UI |
|---|---|
| `idle` | Form bình thường. |
| invalid khi submit | Không gửi. Mỗi field lỗi: `aria-invalid="true"`, `aria-describedby` trỏ tới `<p>` lỗi ngay dưới field. Focus nhảy về field lỗi đầu tiên. Một vùng `role="alert"` tóm tắt số lỗi. |
| `submitting` | Nút disabled + nhãn đổi. (Với adapter mailto, trạng thái này gần như tức thời.) |
| `success` | Form được **thay thế** bằng khối xác nhận: cảm ơn theo tên, nói rõ bước kế tiếp và cam kết 24h, kèm số điện thoại. Announce qua `role="status"`. |
| `error` | Giữ nguyên dữ liệu đã nhập, hiện thông báo + nút thử lại + fallback gọi điện. |

**Interface adapter.**

```ts
export type LeadResult = { ok: true } | { ok: false; reason: 'network' | 'server' | 'unknown' }
export type LeadAdapter = (lead: LeadDraft, locale: Locale) => Promise<LeadResult>
```

`mailtoAdapter` là adapter duy nhất trong lần này: nó tách phần dựng subject/body thành hàm
thuần (test được) và chỉ giữ `window.location.href` làm side effect. Đổi backend sau = viết một
adapter mới + đổi một dòng khai báo, không đụng UI.

### Band 2 — văn phòng, nhà xưởng và kênh liên hệ

Thay cả năm icon-card **và** khối map/địa chỉ ở cột phải bằng một band duy nhất, đặt **sau** form:

- Một ảnh nhà xưởng thật lấy từ `workshopMedia` trong `catalog.generated` (đúng pipeline media
  hiện có, có preset và alt song ngữ).
- Dưới ảnh: **ba nhóm, ba cột** (`grid gap-10 lg:grid-cols-3`), mỗi nhóm mở đầu bằng một
  `.eyebrow`:

| Cột | Nội dung |
|---|---|
| Văn phòng giao dịch | địa chỉ + link "Mở Google Maps" |
| Nhà xưởng | địa chỉ + link "Mở Google Maps" |
| Liên hệ trực tiếp | `<dl>`: ĐIỆN THOẠI, EMAIL, GIỜ LÀM VIỆC |

**Tại sao ba cột chứ không phải năm card.** Năm mục hiện tại không phải năm thứ ngang hàng — chúng
là **ba loại**: hai địa điểm, hai kênh liên hệ, một lịch làm việc (mà giờ làm việc thì không đứng
riêng được, nó bổ nghĩa cho hai kênh kia). Lưới 3×2 chứa 5 card vì thế luôn thừa đúng một ô: đo ở
1440px là **413×206px trống, 17% diện tích lưới**, và cả section cao 631px cho khoảng 12 dòng chữ.
Nhóm lại theo đúng ba loại thì ba nhóm lấp kín ba cột — **không còn ô trống ở bất kỳ breakpoint
nào**, và không phải thêm nội dung nào để lấp.

**Không có bậc 2 cột.** Dưới `lg` xếp dọc một cột. Ba nhóm chia hai cột lại sinh ra đúng cái ô
trống vừa xoá. Ở shell 1280px, mỗi cột ~395px — địa chỉ dài nhất set gọn hai dòng.

**Cột thứ ba dùng `<dl>`** các cặp label/value, cùng vocabulary với cột contact trong footer
(`.footer-label` + giá trị). Không icon: `main.css:1256` đã ghi rõ *"the icon-per-line contact list
was THE template tell"* khi gỡ idiom đó khỏi footer — trang này không dựng lại nó.

**Bỏ iframe Google Maps.** Ảnh xưởng thật chứng minh "có nhà máy" tốt hơn một ô bản đồ xám, và
bỏ được một embed bên thứ ba (nặng, là template tell, và đang phải mask trong VR suite).

> ⚠️ Việc này **đảo ngược task 3.8 trong `launch-plan.md`** ("Google Maps embed iframe (keyless,
> lazy-load), thay ảnh tĩnh — ✅ Done 2026-07-23"). Đây là quyết định có ý thức của người dùng
> trong phiên brainstorm này ("map = bằng chứng đáng tin, bỏ iframe"). `launch-plan.md` phải được
> cập nhật trong cùng lần thay đổi, nếu không doc và code sẽ mâu thuẫn.

### Trùng lặp với footer

Sau redesign, phone/email/giờ làm việc vẫn xuất hiện hai lần trên trang này: một ở cột thứ ba của
Band 2 (nội dung của trang) và một ở cột contact của footer (chrome toàn site).

**Chấp nhận có chủ đích, không sửa.** `AppFooter.vue` là component thuần trình bày theo hợp đồng
(§26.3/§30.2 — "no state, no composable, forbidden knowledge: route"). Muốn footer ẩn cột contact
riêng trên `/lien-he` thì phải cho nó biết route, tức là phá đúng cái hợp đồng mà đợt redesign
footer vừa bảo vệ. Cái giá đó lớn hơn lợi ích. Trùng lặp **trong thân trang** (địa chỉ 3 lần) là
thứ redesign này xoá; trùng lặp giữa thân trang và chrome thì giữ.

### Lời hứa "gửi bản vẽ"

Hero đang viết *"Gửi bản vẽ, BOQ hoặc thông tin công trình…"* nhưng form **không có ô đính kèm
file**. Upload cần storage + adapter đã chốt, nên nằm ngoài phạm vi.

Sửa bằng chữ, không bằng infra: thêm một dòng dưới field cuối — *"Có bản vẽ hoặc BOQ? Gửi kèm
qua {email}"* với `mailto:` link. Trung thực, không cần hạ tầng, và vẫn phục vụ đúng nhu cầu.

## Kiểm chứng

| Loại | Nội dung |
|---|---|
| Unit (`tests/lead.test.ts`) | `validateLead`: từng field thiếu, email sai dạng, phone quá ngắn, message quá ngắn, bản hợp lệ. `buildMailtoUrl`: subject/body đúng, encode đúng, chạy được cả `vi` lẫn `en`. |
| E2E (`tests/e2e/`) | Submit form rỗng → không điều hướng, `aria-invalid` được set, focus ở field lỗi đầu, vùng `role="alert"` có nội dung. Điền hợp lệ → tới trạng thái `success` và được announce. |
| Gates hiện có | `test:gates` (token/alignment/logo), `test:gates:text` (T1 leading, T2 measure), `test:gates:a11y` (axe, phải giữ **0 violation** trên `/lien-he`). |
| VR | `contact-390`, `contact-768`, `contact-1440` sẽ đổi. Rebaseline bằng `pnpm test:vr:approve` trong **một commit riêng không chứa gì khác** (§41). |
| Thủ công | Keyboard-only: tab qua toàn form, submit lỗi, submit thành công. VI và EN. |

## Rủi ro và điểm cần quyết

1. **Màu lỗi — đã chốt: không thêm màu.** Hệ màu hiện tại chỉ có `ink` và `wood`; §22.1 quy định
   "no component may invent a colour; new colours enter at L0 via a doc PR". Thay vì mở hệ màu
   cho một trang, field lỗi được đánh dấu bằng **viền `ink-950` dày hơn + chữ lỗi ngay dưới field
   + `aria-invalid`**. Cách này đạt WCAG 1.4.1 (không dùng riêng màu để truyền thông tin) và
   không phát sinh token màu mới. Nếu khi review bạn muốn có màu đỏ báo lỗi thật, đó là một
   doc PR vào L0 và phải làm trước Phase 2.
2. **Prerender.** `/lien-he` đang `prerender: true`. Điều đó vẫn ổn với form client-side POST,
   nhưng nếu sau này chốt adapter chạy server (`server/api/lead.post.ts`) thì hosting phải chạy
   được Node — không dùng được `nuxt generate` thuần tĩnh. Ghi lại để lúc chốt adapter không vỡ.
3. **Độ dài địa chỉ ở cột hẹp.** Ở `lg` mỗi cột Band 2 rộng ~395px. Chuỗi dài nhất
   (`representativeOffice.vi`, 74 ký tự) set hai dòng ở đó — cần kiểm mắt ở 1024px, nơi cột
   xuống ~310px và nó có thể thành ba dòng. Không phải lỗi, chỉ là điểm cần nhìn.

   *(Rủi ro "sticky rail" ở bản trước đã biến mất cùng cái rail: phương án B2 gộp phone/email/giờ
   làm việc vào Band 2 thay vì dựng một sidebar `position: sticky` cạnh form.)*
