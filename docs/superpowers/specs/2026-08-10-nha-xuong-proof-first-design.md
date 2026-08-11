# Redesign trang Nhà xưởng — Proof-first

**Ngày:** 2026-08-10  
**Trạng thái:** Thiết kế đã được người dùng duyệt trong phiên brainstorming  
**Phạm vi:** Route `/nha-xuong` và dữ liệu/component trực tiếp phục vụ route này

## 1. Bối cảnh

Trang Nhà xưởng hiện có chín nhịp nội dung: hero, lý do chọn xưởng, gallery có filter và lightbox, thiết bị, tay nghề, năng lực sản xuất, kiểm soát chất lượng, FAQ và CTA. Trang có nhiều ảnh xưởng thật và thông tin B2B hữu ích, nhưng gallery chiếm quá nhiều chiều dài và các phần máy móc, năng lực, tay nghề và QC lặp lại một phần thông điệp.

Thiết kế mới chọn hướng **Proof-first**: cho người ra quyết định thấy bằng chứng năng lực trước, sau đó giải thích cơ chế tạo ra năng lực đó. Trang phải thuyết phục đồng thời:

- Chủ đầu tư khách sạn, villa và căn hộ.
- Công ty thiết kế, kiến trúc sư và tổng thầu đang tìm đối tác sản xuất.

Hành động chính là **đặt lịch tham quan xưởng**.

## 2. Mục tiêu

- Chứng minh nhanh năng lực sản xuất B2B bằng số liệu, ảnh xưởng thật, máy móc, con người và quy trình QC.
- Rút ngắn đáng kể trải nghiệm cuộn so với trang hiện tại.
- Loại bỏ gallery độc lập; mỗi ảnh phải chứng minh cho luận điểm của section chứa ảnh đó.
- Phục vụ hai nhóm khách B2B mà không tạo hai luồng trang tách biệt.
- Tạo một CTA tham quan xưởng rõ ràng, khả dụng ngay với hạ tầng hiện có.
- Giữ nguyên nhận diện, shell, hệ thống locale, SEO và media pipeline hiện tại.

## 3. Ngoài phạm vi

- Không redesign header, drawer, footer hoặc các route khác.
- Không thêm backend, database, email transport, analytics hoặc dịch vụ form bên thứ ba.
- Không tuyên bố form `/lien-he` đã gửi hoặc lưu yêu cầu.
- Không thêm carousel, lightbox, filter ảnh, tải hồ sơ năng lực hoặc chức năng đặt lịch tự động.
- Không thay đổi dependency hoặc media manifest bằng tay.
- Không cập nhật visual-regression baseline nếu chưa có phê duyệt riêng.

## 4. Cấu trúc nội dung

Trang mới có bảy nhịp.

### 4.1 Hero và dải số liệu

Hero dùng ảnh toàn cảnh xưởng thật và biến thể trung tính/tối của `AppHero`.

- Topic: “Năng lực nhà xưởng” / “Factory capability”.
- Heading định hướng: “Sản xuất trực tiếp. Kiểm soát đến cùng.” / “Direct manufacturing. Controlled end to end.”
- Nội dung nêu xưởng trực tiếp, hệ thống máy đồng bộ và QC cho nội thất dự án.
- CTA chính: “Đặt lịch tham quan” / “Arrange a factory visit”.
- CTA phụ: cuộn đến phần năng lực chi tiết.

Dải số liệu nằm ngay sau hero:

1. 3.000 m² xưởng và kho.
2. Đến 50 phòng mỗi tháng.
3. Quy trình trọn gói từ thiết kế đến lắp đặt.
4. Giao lắp toàn quốc và nhận đơn hàng xuất khẩu.

Mục đích của dải này là giúp khách hiểu quy mô trong năm giây đầu, trước khi đọc diễn giải.

### 4.2 Bốn trụ cột năng lực

Bốn trụ cột giữ lại giá trị từ phần “Vì sao chọn xưởng của chúng tôi” nhưng giảm copy:

1. Xưởng sản xuất trực tiếp.
2. Hệ thống máy đồng bộ.
3. Đội ngũ tay nghề.
4. Kiểm soát chất lượng.

Mỗi trụ cột chỉ gồm tên, một icon và một câu trả lời “khách được lợi gì”. Section không lặp lại số liệu đã có trong dải stats.

### 4.3 Hệ thống sản xuất đồng bộ

Section này thay thế cả gallery lẫn bốn card thiết bị hiện tại.

- Một ảnh toàn cảnh dây chuyền làm bằng chứng chính.
- Bốn nhóm công đoạn:
  1. Cắt và tạo hình.
  2. Khoan và liên kết.
  3. Dán cạnh và hoàn thiện.
  4. Xử lý bề mặt và ép.
- Mỗi nhóm hiển thị lợi ích đầu ra và tên các máy liên quan.

Không có filter, lightbox, masonry hoặc ảnh trang trí rời khỏi ngữ cảnh.

### 4.4 Con người và kiểm soát chất lượng

Hai section hiện tại được gộp thành một chuyển động nội dung:

- Ảnh đội ngũ đang làm việc.
- Một đoạn ngắn về vai trò của thợ và kỹ thuật viên.
- Checklist QC:
  1. Kiểm tra vật tư đầu vào.
  2. Đối chiếu hồ sơ và shop drawing.
  3. Kiểm tra trong quá trình sản xuất.
  4. Nghiệm thu trước giao và lắp đặt.

Thông điệp: máy móc tạo độ lặp lại; con người và QC bảo đảm kết quả cuối cùng.

### 4.5 Năng lực phù hợp với ai

Hai cột sử dụng cùng bằng chứng nhưng diễn giải theo tiêu chí ra quyết định khác nhau.

**Chủ đầu tư**

- Kiểm soát tiến độ và chất lượng tại nguồn.
- Một đầu mối từ thiết kế, sản xuất đến lắp đặt.
- Năng lực ổn định cho khách sạn, villa và căn hộ.

**Đối tác thiết kế và tổng thầu**

- Sản xuất theo hồ sơ/bản vẽ riêng và hỗ trợ shop drawing.
- Quy trình máy đồng bộ, dung sai và bề mặt ổn định.
- Nhận gia công theo bản vẽ/OEM, giao lắp toàn quốc và đơn hàng xuất khẩu.

### 4.6 FAQ rút gọn

Giữ bốn câu hỏi có giá trị cao trước khi liên hệ:

1. Thời gian sản xuất mất bao lâu?
2. Lai Huy có nhận sản xuất theo thiết kế hoặc bản vẽ riêng không?
3. Vật liệu và chất lượng được kiểm soát như thế nào?
4. Lai Huy có giao lắp toàn quốc không?

FAQ hiển thị và FAQ JSON-LD phải lấy từ cùng một nguồn dữ liệu để tránh lệch nội dung.

### 4.7 CTA tham quan xưởng

CTA cuối trang là một section riêng, không chỉ là nút nằm trong footer.

- Heading: “Đến xem năng lực thực tế” / “See the capability first-hand”.
- Hiển thị địa chỉ nhà xưởng và giờ làm việc hiện có trong dữ liệu công ty.
- Nút chính dùng liên kết `tel:` để gọi đặt lịch.
- Nút phụ mở địa chỉ nhà xưởng trên Google Maps.
- Không hiển thị form hoặc email trong CTA này; các kênh đó vẫn có trên route `/lien-he`.

## 5. Phong cách thị giác

### 5.1 Màu sắc

Giữ token hiện có:

- `ink-950` cho hero và section dây chuyền.
- Trắng và `ink-50`/nền ấm cho các section còn lại.
- `wood-500`/`wood-600` cho số liệu, đường dẫn mắt và CTA.

Chỉ section dây chuyền sử dụng nền tối toàn chiều rộng. Nâu gỗ là màu nhấn, không trở thành nền chính lặp lại trên toàn trang.

### 5.2 Typography và nhịp

- Giữ Inter và heading black uppercase của hệ thống hiện tại.
- Giảm số heading cạnh tranh trong một viewport.
- Stats lớn, mô tả ngắn và khoảng trắng rộng tạo cảm giác hồ sơ năng lực.
- Dùng shell, section spacing và border radius hiện có; không tạo một design system thứ hai.

### 5.3 Media

- Chỉ dùng 4–5 ảnh xưởng thật từ generated media catalog.
- Không dùng stock, render hoặc ảnh AI.
- Không lặp cùng một ảnh ở nhiều section.
- Crop phải làm rõ chủ thể: toàn cảnh xưởng, dây chuyền, đội ngũ và khu vực QC.
- Alt text song ngữ nằm ở tầng business data; không đưa editorial copy vào catalog generated.

### 5.4 Chuyển động

- Giữ reveal nhẹ hiện có.
- Ảnh zoom nhẹ với transition 1.200 ms khi hover ở thiết bị hỗ trợ hover.
- Không có animation tự chạy hoặc thành phần cần vuốt.
- `prefers-reduced-motion` phải tắt reveal/zoom không cần thiết.

## 6. Responsive

### Desktop

- Hero và dải stats hiển thị đủ bốn cột.
- Section dây chuyền và section con người/QC dùng split layout.
- Hai nhóm khách hiển thị hai cột.

### Tablet

- Trong khoảng `768–1023px`, stats và bốn trụ cột dùng lưới 2×2.
- Section dây chuyền xếp ảnh trước, sau đó là lưới công đoạn 2×2.
- Section con người/QC xếp ảnh trước checklist.
- Hai nhóm khách B2B giữ hai cột.
- Kiểm tra trực tiếp tại `767px` và `768px`.

### Mobile

- Dưới `640px`, hero action xếp dọc.
- Dưới `768px`, stats và bốn trụ cột dùng lưới 2×2 với copy đã rút gọn.
- Ảnh đứng trước nội dung mà nó chứng minh.
- Bốn công đoạn xếp một cột theo thứ tự 01–04.
- Hai nhóm khách xếp một cột.
- CTA cuối trang xếp dọc, nút rộng và không tràn ngang.

Từ `1024px`, section dây chuyền và section con người/QC chuyển sang split layout; stats trở lại bốn cột.

Ngoài `767/768`, phải kiểm tra `1279/1280` vì đây là ranh giới shared shell quan trọng của dự án.

## 7. Kiến trúc component và dữ liệu

### 7.1 Page

`app/pages/nha-xuong.vue` chịu trách nhiệm:

- Ghép thứ tự section.
- Gọi `useLanguage()` và `usePageSeo()`.
- Chọn media đã được định nghĩa ở tầng business.
- Không chứa các mảng copy song ngữ lớn hoặc state gallery.

### 7.2 Data

`app/data/factory.ts` là nguồn dữ liệu cho:

- Hero content.
- Stats.
- Bốn trụ cột.
- Nhóm công đoạn và máy móc.
- Hai nhóm khách B2B.
- Checklist QC.
- FAQ.

Các kiểu dữ liệu dùng `LocalizedText` và readonly arrays phù hợp với pattern hiện tại. Nội dung máy móc đã dùng trên homepage phải được tái sử dụng thay vì tạo bản sao lệch nghĩa.

### 7.3 Page-specific components

Tạo tối đa ba component có ranh giới rõ:

- `FactoryStatsStrip.vue`: hiển thị bốn số liệu.
- `FactoryProcessProof.vue`: ảnh dây chuyền và bốn nhóm công đoạn.
- `FactoryVisitCta.vue`: địa chỉ, giờ làm việc, liên kết gọi điện và bản đồ.

Bốn trụ cột, audience split và FAQ nằm trực tiếp trong page. Không tạo component một lần dùng chỉ để bọc một card đơn giản.

### 7.4 Media lookup

Dùng generated media entries với `MediaImage`/`useMediaUrl`. Tạo helper `requireWorkshopAsset(filename)` tra cứu asset theo filename và ném lỗi có tên asset rõ ràng ngay khi module page được khởi tạo; asset thiếu vì vậy làm production build thất bại. Không dùng ép kiểu để che trường hợp `undefined`, không hardcode `/images/` hoặc Supabase object URL.

## 8. Luồng dữ liệu và tương tác

1. Dữ liệu business song ngữ được import từ `app/data/factory.ts`.
2. `useLanguage().t` resolve copy theo locale cookie/state hiện có.
3. Media business layer ghép generated asset với alt text.
4. Page/component render nội dung; không có fetch hoặc remote application state mới.
5. FAQ dùng native disclosure có keyboard semantics.
6. CTA gọi điện dùng `tel:`; bản đồ dùng URL hiện có trong `company.addresses`.

Xóa toàn bộ `activeFilter`, `filteredImages`, lightbox index/open state và watcher liên quan gallery.

## 9. Error handling và accessibility

- Thiếu workshop media phải tạo lỗi build/runtime rõ ràng với filename, không render ảnh rỗng.
- CTA không được tuyên bố đã đặt lịch thành công; nó chỉ mở kênh gọi điện hoặc bản đồ.
- External map link dùng `target="_blank"` và `rel="noopener noreferrer"`.
- Heading order giữ `h1 → h2 → h3`.
- Stats dùng markup có nhãn đọc được, không dựa vào icon.
- FAQ có focus state, keyboard access và vùng click đủ lớn.
- Màu chữ và nền tuân theo contrast contract hiện có; accessibility gate vẫn chỉ là mức sàn vì color contrast rule đang bị loại khỏi suite.

## 10. SEO

- Giữ canonical, Open Graph, breadcrumb và organization JSON-LD hiện có.
- Hero image mới vẫn là ảnh xưởng thật từ media catalog.
- FAQ JSON-LD chỉ chứa bốn FAQ đang hiển thị.
- Không thay đổi mô hình locale cookie/state hoặc tạo URL locale mới.

## 11. Kiểm thử và xác minh

### Static và unit

- `pnpm lint`
- `pnpm lint:media`
- `pnpm typecheck`
- `pnpm test`
- Thêm unit test cho dữ liệu/contract quan trọng nếu logic mới vượt quá template thuần.

### Build

- `pnpm build` vì thay đổi hero, SEO/FAQ JSON-LD và media references.

### Browser

- Kiểm tra VI và EN tại `390`, `767/768`, `1279/1280` và `1440`.
- Kiểm tra CTA `tel:`, map URL, heading order, focus, keyboard, FAQ open/closed và reduced motion.
- Chạy Playwright text/layout/accessibility gate phù hợp.
- Chạy visual regression để ghi nhận khác biệt có chủ đích, nhưng không approve snapshot khi chưa có yêu cầu riêng.
- Ghi nhận trạng thái Supabase media và Google Maps nếu external resources không khả dụng.

## 12. Tiêu chí chấp nhận

- Không còn gallery, filter hoặc lightbox trên `/nha-xuong`.
- Trang có đúng bảy nhịp nội dung đã duyệt.
- Hero và CTA cuối trang đều dẫn đến hành động đặt lịch tham quan khả dụng.
- Bốn số liệu năng lực xuất hiện sớm và đọc được ở cả hai locale.
- Dây chuyền sản xuất được trình bày thành bốn nhóm công đoạn, không phải danh sách ảnh.
- Nội dung cho chủ đầu tư và đối tác thiết kế/tổng thầu đều hiện diện.
- FAQ hiển thị và JSON-LD dùng chung nguồn dữ liệu.
- Không có copy ngụ ý form đã gửi yêu cầu.
- Không có hardcoded media URL, dependency mới, backend mới hoặc thay đổi ngoài route Nhà xưởng.
- Các check bắt buộc trong phạm vi đều exit 0; mọi timeout, external dependency hoặc visual baseline chưa duyệt được báo cáo rõ.
