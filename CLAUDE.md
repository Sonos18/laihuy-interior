@AGENTS.md

## Design skills — phân vai

Các skill dưới đây nằm ở `.claude/skills/` (cấp dự án). Trong dự án này chúng thay vai trò của skill `frontend-design` mà quy tắc global nhắc tới.

| Skill | Vai trò | Khi nào dùng |
|---|---|---|
| impeccable | **Lead designer** — dẫn dắt layout, typography, màu, design tokens trong khuôn khổ đã duyệt (xem thứ tự ưu tiên) | Mọi việc tạo/sửa UI |
| high-end-visual-design | **Lớp phong cách** — tăng độ cao cấp, chi tiết thị giác | Chỉ bổ sung khi impeccable đã chốt hướng; skill chỉ chạy khi gọi đích danh |
| emil-design-eng | **Motion** — animation, easing, duration, micro-interaction, gesture | Mọi thứ liên quan chuyển động |
| web-design-guidelines | **Auditor** — kiểm tra nhất quán, accessibility, UX | Sau khi xong mỗi section, không dùng để sinh UI |
| webapp-testing | **QA** — chạy trang local bằng Playwright, chụp màn hình, đọc console log | Sau audit, trước khi báo xong việc |

### Thứ tự ưu tiên khi xung đột
1. Yêu cầu trực tiếp của mình
2. `DESIGN.md` — nguồn chuẩn thị giác (bảng màu, nhịp nền sáng ấm, typography, shape, component, motion), cùng token trong `app/assets/css/main.css` và `PRODUCT.md` (sự thật sản phẩm). `.agents/rules/laihuy-ux-ui.md` bổ sung định vị thương hiệu và guardrail; khi lệch, `DESIGN.md` thắng
3. impeccable
4. emil-design-eng (chỉ trong phạm vi animation)
5. high-end-visual-design — không được ghi đè lựa chọn đã duyệt của dự án (font Inter, icon Lucide, header sticky, bảng màu) dù skill liệt kê chúng là anti-pattern

Prototype `docs/design/redesign-concept-showcase.html` chỉ còn là tham khảo bố cục và motion; phần nền tối toàn trang của nó đã bị `DESIGN.md` thay thế (2026-10-20). Mục "Drift" trong `DESIGN.md` liệt kê code chưa khớp — sửa dần theo từng section, không sửa lan sang phần ngoài phạm vi việc đang làm.

Không skill nào được tự đổi art direction, bảng màu hoặc typography đã duyệt khi chưa có mình đồng ý. Muốn đổi thì cập nhật `DESIGN.md` trước (qua `/impeccable document` hoặc sửa tay có duyệt), rồi mới sửa code.

### Quy trình cho mỗi section của landing page
1. Thiết kế + code theo impeccable (phong cách bổ sung từ high-end-visual-design)
2. Thêm/tinh chỉnh animation theo emil-design-eng; luôn tôn trọng `prefers-reduced-motion`
3. Audit bằng web-design-guidelines, sửa các lỗi mức cao
4. webapp-testing: chụp màn hình ở 375px, 768px, 1440px và kiểm tra console không có lỗi. Kiểm tra cổng trước khi chạy: `with_server.py` coi cổng đang mở là server đã sẵn sàng, nên nếu app khác đang chiếm cổng thì test sẽ chạy nhầm app
5. Báo lại cho mình kèm ảnh chụp, rồi mới sang section tiếp theo
