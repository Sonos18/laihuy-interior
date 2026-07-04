---
name: feedback-round2
description: Lai Huy site — standing copy rules and open items from client feedback round 2 (Jun 2026)
metadata:
  type: project
---

Client feedback round 2 (`docs/feedbacks/Góp ý Website Lai Huy- Lần 2-020626.docx`) implemented on 2026-06-28.

Standing rules to keep applying:
- **Use "THI CÔNG", never "LẮP ĐẶT"** anywhere on the site (EN: prefer "contracting" over "installation"). This is a client directive for the whole website.
- Company address province is now **Vĩnh Long** (Phú Khương factory), not Bến Tre (2025 merger).
- Phone display format: `+84 903 102 012`.

Open items still owed by the client:
- **Real factory photos for the machinery section were NOT in the docx** ("gửi kèm theo" but missing). Home/`nha-xuong` machinery still uses `about_workspace.jpg` as placeholder — swap when the client sends photos.
- Project info structure (Địa điểm / Tổng khối lượng / Tiến độ / Năm hoàn thành / Phạm vi) only has real data for **Khách sạn Eo Gió**; other projects await location/timeline data before their facts can be filled.

Scroll-reveal is the `v-reveal` directive in `app/plugins/reveal.ts` (+ `.reveal` CSS in main.css); responsive headings use `.text-hero` / `.text-section-title` clamp utilities. See [[oryzo-visual-layer]].
