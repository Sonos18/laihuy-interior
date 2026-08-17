# Project Detail — Editorial Proof Spine Design Spec

## Trạng thái

Thiết kế đã được thông qua theo từng phần trong phiên làm việc ngày 2026-08-15. Tài liệu này đóng
đặc tả cho việc redesign route `/du-an/[slug]`; chưa phải kế hoạch triển khai và không tự cấp quyền
thay đổi visual baseline.

## Mục tiêu

Redesign trang chi tiết dự án theo hướng cân bằng giữa kể chuyện và chuyển đổi:

- biến dữ liệu dự án thành một case study có mạch kể rõ ràng thay vì chuỗi section độc lập;
- giảm bố cục hiện tại xuống một trục nội dung gồm 6–7 chương lớn;
- chứng minh năng lực thiết kế, sản xuất và thi công bằng dữ liệu cùng hình ảnh thật;
- giữ một đường dẫn chuyển đổi rõ nhưng không biến trang thành landing page bán hàng;
- dùng cùng một template cho dự án nhiều media và dự án ít media;
- duy trì đầy đủ VI/EN, SEO, media catalog, lightbox và shell hiện tại.

## Ngoài phạm vi

- Không thay đổi `/du-an` hoặc các route marketing khác.
- Không thêm CMS, AI runtime, API, database, analytics hoặc transport cho form liên hệ.
- Không bịa testimonial, metric, thời lượng, số phòng hay dữ kiện dự án.
- Không thay đổi media manifest/catalog bằng tay.
- Không thêm carousel, scroll snapping hoặc cơ chế điều khiển cuộn.
- Không cập nhật snapshot/baseline nếu chưa được người dùng cho phép riêng.

## Hướng thiết kế được chọn

Phương án A — **Editorial Proof Spine**.

Trang vận hành như một case study biên tập: mở bằng bối cảnh và dữ kiện, đi qua bài toán và lời giải,
chứng minh bằng hình ảnh cùng quy trình thực hiện, rồi khép lại bằng trải nghiệm, năng lực liên quan và
CTA. Nhịp trang ưu tiên khoảng thở, ảnh lớn, đường phân cách và bố cục bất đối xứng; không biến mọi
nội dung thành card bo tròn.

## Kiến trúc thông tin

### 0. Hero + fact rail

- Dùng ảnh cover riêng của dự án qua `AppHero`.
- Category là chip ngữ cảnh; status hoàn thành chỉ hiện khi có năm đã xác minh.
- Fact rail được tích hợp vào chân hero, không tồn tại như một section card riêng.
- Tối đa năm facts theo thứ tự ưu tiên: diện tích, năm, phong cách, phạm vi, địa điểm.
- Không điền giá trị giả để đủ năm cột.

### 1. Story

Gộp Overview, Challenge và Solution thành một chương có nhịp đọc liên tục:

1. Overview thiết lập bối cảnh và luận điểm trung tâm.
2. Challenge nêu bài toán phát sinh trực tiếp từ bối cảnh đó.
3. Solution trả lời đúng bài toán và giới thiệu chiến lược thiết kế.

Ảnh dẫn được đặt như bằng chứng chuyển tiếp, không phải banner trang trí. Challenge và Solution là
các beat trong cùng chương, không xuất hiện thành các section tách rời trên subnav.

### 2. Curated gallery

- Tiếp tục dùng `AppGalleryEditorial` và `GalleryLightbox`.
- Dự án ngắn hiển thị toàn bộ media hợp lệ inline.
- Dự án dài giữ media-flow hiện tại: chín ảnh tuyển chọn inline và disclosure mở toàn bộ gallery.
- Giữ gallery tabs khi media catalog có group có nghĩa.
- Thứ tự ảnh, index mở lightbox và bộ đếm phải dùng cùng một nguồn dữ liệu.

### 3. Delivery proof

Gộp phạm vi dịch vụ, các phase bàn giao và bằng chứng thực hiện phù hợp với scope thành một chương.
Nội dung được trình bày theo tuyến từ brief đến handover, dùng đường nối và nhịp số thứ tự thay cho
một lưới card dịch vụ lặp lại.

- Scope là dữ liệu dự án đã xác minh.
- Phase được suy ra từ scope hiện có và hai đầu mút consultation/handover.
- Bằng chứng xưởng chỉ xuất hiện khi scope có `Sản xuất`; bằng chứng lắp đặt chỉ xuất hiện khi scope
  có `Thi công`. Dự án chỉ có `Thiết kế` không được trình bày như một dự án do Lai Huy sản xuất hoặc
  thi công.
- Company facts trong finale vẫn là năng lực chung của doanh nghiệp và phải được diễn đạt tách biệt
  với scope của dự án.
- Câu dẫn phải liên hệ delivery model với lời giải của dự án, không dùng một đoạn sales copy chung
  đứng độc lập.

### 4. Material story

Gộp Experience, Design Highlights, Materials và Craftsmanship thành một chương gồm 2–4 beat tùy dữ
liệu và media. Mỗi beat phải nối một quyết định thiết kế với biểu hiện hữu hình và trải nghiệm mà nó
tạo ra.

Testimonial, nếu sau này có dữ liệu thật, được đặt như một quote interlude trong chương này; không
tạo section riêng. Không bao giờ tự viết testimonial.

### 5. Related work

Hiển thị tối đa ba dự án liên quan theo logic category → style → scope → recency hiện tại. Phần này
ngắn và phục vụ khám phá tiếp, không cạnh tranh với CTA chính.

### 6. Trust + conversion finale

Gộp trust band và CTA thành một kết thúc duy nhất trên nền sáng trước footer nền ink. CTA dẫn đến
luồng liên hệ hiện tại và không được ngụ ý rằng yêu cầu đã được gửi, nhận hoặc lưu trữ.

## Contract về tính mạch lạc của nội dung

### Một luận điểm xuyên suốt cho mỗi dự án

Trước khi bổ sung copy, mỗi dự án phải được xác định một câu luận điểm nội bộ, dựa trên metadata,
scope, nội dung đang có và media. Câu này không cần thêm vào schema nhưng là chuẩn để biên tập tất cả
các field. Mọi đoạn trong case study phải phục vụ cùng một luận điểm.

Mạch bắt buộc:

`bối cảnh → bài toán/ưu tiên → chiến lược giải quyết → bằng chứng không gian/vật liệu/thi công → trải nghiệm`

Một nội dung được coi là kết nối khi:

- Challenge phát sinh từ chi tiết đã thiết lập trong Overview;
- câu đầu của Solution trả lời Challenge, không mở sang một chủ đề mới;
- Highlights và Materials chứng minh Solution bằng chi tiết quan sát được;
- Craftsmanship chỉ mô tả phần Lai Huy thực sự có scope sản xuất/thi công hoặc bằng chứng đáng tin;
- Experience khép lại kết quả không gian đã được chuẩn bị từ Overview, không đưa thêm một luận điểm
  chưa xuất hiện;
- thuật ngữ chính, tên không gian và giọng văn nhất quán giữa VI và EN;
- không lặp cùng một ý dưới nhiều tiêu đề bằng cách đổi từ đồng nghĩa.

### Bổ sung nội dung còn thiếu

Việc bổ sung là một lần biên tập vào `app/data/projects.ts`, không phải AI sinh nội dung trong trình
duyệt hoặc tại server runtime. Có thể điều chỉnh cả copy hiện hữu khi cần để toàn bộ câu chuyện liền
mạch; không chỉ chèn các field đang thiếu rồi giữ nguyên các đoạn không ăn khớp.

Nguồn bằng chứng được phép:

1. facts đã có trong bản ghi dự án: category, location, area, year, style và scope;
2. `shortDescription`, `content` và `seo` hiện hữu;
3. ảnh cover, gallery, gallery group và các đặc điểm nhìn thấy rõ trong media;
4. company facts đã được xác minh, nhưng chỉ trong Delivery/Trust và không biến thành project fact.

Quy tắc suy luận:

- Có thể viết Challenge như một **mục tiêu thiết kế có thể suy ra** từ loại hình, diện tích và nội
  dung hiện hữu; không khẳng định một khó khăn kỹ thuật hoặc yêu cầu khách hàng chưa được ghi nhận.
- Có thể mô tả bảng màu, hình khối, tổ chức không gian và vật liệu nhìn thấy rõ; không đoán hãng,
  chủng loại kỹ thuật hoặc thông số hoàn thiện từ ảnh.
- Có thể mô tả trải nghiệm dự kiến hoặc cảm nhận không gian; không tuyên bố hiệu quả đo lường, phản
  hồi khách hàng hoặc kết quả vận hành chưa được xác minh.
- Không suy ra client, location, area, year, duration, rooms, metric, award hay testimonial.
- Nếu bằng chứng không đủ, dùng diễn đạt hẹp và trung tính hoặc bỏ beat phụ; không lấp chỗ trống bằng
  copy marketing chung.

Mức phủ tối thiểu cho mỗi dự án sau biên tập:

- Overview;
- Challenge/design priority;
- Solution/design response;
- ít nhất một nhóm proof: Design Highlights, Materials hoặc Craftsmanship;
- Experience.

Mỗi field phải có cả `vi` và `en`. Bản EN là bản chuyển ngữ tương đương về nghĩa và giọng, không cần
dịch từng chữ nhưng không được thêm dữ kiện mới.

### Checklist biên tập từng dự án

Với cả 11 dự án, quá trình triển khai phải lập một bảng rà soát gồm:

- luận điểm trung tâm;
- các facts và media dùng làm bằng chứng;
- field nào được giữ, viết lại hoặc bổ sung;
- khẳng định nào bị loại vì thiếu bằng chứng;
- kiểm tra mạch năm bước ở cả VI và EN.

Checklist là bằng chứng review trong diff/kế hoạch triển khai; không cần thêm vào dữ liệu runtime.

## Component và data boundaries

### `app/pages/du-an/[slug].vue`

Route chỉ còn trách nhiệm điều phối:

- đọc slug và trả 404;
- lấy project và view-model;
- cấu hình SEO/JSON-LD;
- quản lý active gallery tab cùng lightbox state;
- sắp thứ tự các chương.

Logic tạo facts, services, phases, nav anchors và related-project candidates được chuyển khỏi template
972 dòng hiện tại sang một helper/view-model thuần có thể unit test, dự kiến
`app/utils/project-detail-view-model.ts`.

### Component dự kiến

- `ProjectHeroFacts.vue`: compose `AppHero` và fact rail; `AppHero` vẫn route-agnostic.
- `ProjectStoryChapter.vue`: Overview, Challenge, Solution và ảnh dẫn.
- `AppGalleryEditorial.vue`: tái sử dụng, không tạo gallery component mới.
- `GalleryLightbox.vue`: tái sử dụng, giữ public interaction contract.
- `ProjectDeliveryProof.vue`: scope, phases và execution proof phù hợp với scope.
- `ProjectMaterialStory.vue`: Experience, Highlights, Materials, Craftsmanship và optional quote.
- `ProjectRelatedProjects.vue`: ba dự án liên quan.
- `ProjectConversionFinale.vue`: trust + CTA.

Không cần thêm field mới vào `Project` để đạt thiết kế này. Các field narrative vẫn optional ở type
level để dữ liệu cũ/ngoại lệ không làm hỏng render, trong khi content audit bảo đảm mức phủ tối thiểu
cho 11 bản ghi hiện tại.

## Subnav và tương tác cuộn

Subnav sticky chỉ có bốn anchor ổn định:

- `story`;
- `gallery`;
- `delivery`;
- `materials`.

Anchor chỉ xuất hiện khi chapter tương ứng render. IntersectionObserver tiếp tục cập nhật active
section và subnav phải dùng header offset tokens hiện tại. Không thêm smooth-scroll cưỡng ép hoặc
scroll-jacking. Related work và finale không nằm trong subnav.

## Responsive contract

### Mobile, gồm 390 px

- nội dung xếp dọc;
- fact rail hai cột và item cuối có thể span khi số lượng lẻ;
- ảnh Story theo sau copy tương ứng;
- Delivery thành timeline dọc dùng hairline;
- subnav cuộn ngang, không làm tràn viewport;
- gallery giữ source order và ảnh full-width.

### Từ 768 px

- Story và Material Story có thể dùng bố cục editorial hai cột;
- gallery kích hoạt nhịp lớn + cặp ảnh nhỏ hiện tại;
- Delivery chuyển sang nhịp ngang khi nội dung không bị ép hoặc tràn.

### Từ 1280 px

- fact rail tối đa năm cột;
- các chapter dùng tỷ lệ bất đối xứng gần 40/60;
- khoảng trắng và measure giữ theo rail/tokens hiện tại, không tạo container song song.

Phải kiểm tra ngay dưới/tại breakpoint `767/768` và `1279/1280`, không chỉ các viewport ảnh chụp
chuẩn. Cả VI và EN đều thuộc contract vì độ dài copy khác nhau.

## Trạng thái, lỗi và dữ liệu thiếu

- Slug không tồn tại tiếp tục `createError` với HTTP 404; không redirect về `/du-an`.
- Không render heading, anchor hoặc khoảng trắng cho sub-beat không có dữ liệu đáng tin.
- Một project hợp lệ không được lỗi chỉ vì thiếu field narrative optional.
- Gallery không mount khi không có media hợp lệ.
- Dự án có ba ảnh hiển thị cả ba inline; dự án 30 ảnh hiển thị chín inline và cho mở đủ 30 ảnh.
- Media tiếp tục qua generated catalog, `MediaImage` và `useMediaUrl`; không hardcode `/images/` hay
  Supabase URL.
- SEO fallback tiếp tục theo `seo.description → content.overview → shortDescription`; JSON-LD chỉ
  chứa facts thực sự hiện diện.

## Accessibility và motion

- Giữ cấu trúc heading tuần tự và một `h1`.
- Anchor target có scroll margin tương thích với header + sticky subnav.
- Subnav dùng link/button có focus-visible rõ và active state không chỉ dựa vào màu.
- Gallery giữ accessible label; lightbox giữ đóng bằng Escape, focus trap và trả focus về trigger.
- Nút mở full gallery phải công bố đúng số ảnh còn lại/ảnh đầy đủ ở cả hai locale.
- Tôn trọng `prefers-reduced-motion`; bỏ chuyển động trang trí và smooth behavior không thiết yếu.
- Không coi axe color-contrast-disabled gate là bằng chứng WCAG đầy đủ; contrast phải được review trực
  tiếp trên các surface mới.

## Verification

### Unit/data tests

- Thêm test cho view-model: fact priority/cap, scope → phases, bốn anchor, related projects và các
  nhánh thiếu dữ liệu.
- Thêm content-contract test cho cả 11 projects: VI/EN không rỗng, có đủ spine tối thiểu và có ít
  nhất một proof group.
- Giữ và chạy `tests/project-media-flow.test.ts` để bảo toàn media behavior.
- Coherence về nghĩa được review thủ công bằng checklist từng dự án; không giả vờ rằng một assertion
  chuỗi có thể chứng minh chất lượng biên tập.

### Browser checks

Hai route đại diện bắt buộc:

- rich: `/du-an/khach-san-eo-gio` — 30 media, gallery group, đầy đủ narrative;
- sparse: `/du-an/nha-xuong-anh-cuong` — 3 media và dữ liệu narrative hiện còn thiếu.

Kiểm tra cả VI/EN tại 390, 767, 768, 1279, 1280 và 1440 px:

- thứ tự và visibility của bảy chương;
- active subnav, anchor offset và không overflow;
- fact rail, Story, Delivery và Material Story reflow;
- đúng 3 ảnh inline cho route sparse;
- đúng 9 ảnh inline, disclosure và đủ 30 ảnh trong lightbox cho route rich;
- keyboard, focus, Escape, focus return và reduced motion;
- CTA không ngụ ý gửi/nhận form.

### Commands tối thiểu sau triển khai

```powershell
pnpm lint
pnpm lint:media
pnpm typecheck
pnpm test
pnpm build
pnpm exec playwright test tests/e2e/project-media-density.spec.ts --project=chromium
pnpm exec playwright test tests/e2e/a11y.spec.ts --project=chromium
```

Chạy thêm gate layout/alignment hoặc một spec project-detail mới nếu implementation thay đổi contract
được các gate đó bao phủ. Mọi lệnh chỉ được báo pass khi exit code là 0. Không approve snapshot để
che layout race, media dependency hoặc nondeterminism.

## Tiêu chí nghiệm thu

- Route thể hiện đúng Editorial Proof Spine với Hero + sáu chương sau hero.
- Template không còn chuỗi 10–12 section ngang hàng hoặc lưới card lặp lại.
- Mỗi trong 11 dự án có một narrative spine VI/EN mạch lạc, dựa trên bằng chứng hiện có.
- Không có dữ kiện cứng, testimonial hay hiệu quả vận hành bị suy đoán.
- Rich và sparse projects dùng cùng component tree và không tạo khối rỗng.
- Four-anchor subnav, gallery và lightbox giữ đúng interaction/accessibility contract.
- Breakpoint boundaries và hai locale không overflow hoặc tạo thứ tự đọc sai.
- SEO, JSON-LD, media pipeline, 404 và contact behavior hiện tại được bảo toàn.
- Các kiểm tra đã chọn thoát mã 0; mọi check bị bỏ qua hoặc phụ thuộc external state phải được báo rõ.

## Quyết định đã đóng

- Mục tiêu: cân bằng storytelling và conversion.
- Mức thay đổi: gộp mạnh xuống 6–7 chương.
- Hướng UI: Editorial Proof Spine.
- Dữ liệu thiếu: bổ sung biên tập một lần trong source, không sinh runtime.
- Chất lượng copy: một luận điểm xuyên suốt, không chấp nhận các đoạn đơn lẻ/đơn điệu.
- Facts không có bằng chứng: không tự bổ sung.
- Gallery: giữ media-flow 3/30 ảnh và lightbox hiện tại.
- Navigation: bốn anchor, không scroll-jacking.
- Baseline: không thay đổi nếu chưa có phê duyệt riêng.
