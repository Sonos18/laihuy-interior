# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two primary audiences, weighted equally:

- **Project owners (chủ đầu tư)** of 3–5 star hotels, villas and resort residences, premium apartments and commercial projects. They want one accountable party from design to installation and steady capacity for multi-room projects.
- **Designers, architects and main contractors (thiết kế & tổng thầu)** who need a factory to build to their drawings: technical take-off, shop drawings, make-to-drawing/OEM production and nationwide installation.

Secondary: OEM and export buyers placing production orders within an agreed scope. Private homeowners appear in the portfolio but are not a named target audience.

## Product Purpose

The site is the bilingual (Vietnamese default, English) marketing site for Lai Huy Interior, a factory-direct interior design, manufacturing and installation business. It exists to make the factory's capability credible to B2B buyers and to turn that credibility into project enquiries: a quote request, a phone call, project documents sent for review, or a factory visit. Success is a qualified enquiry from an owner or a design/contractor team.

## Positioning

Lai Huy owns its production: an in-house panel-furniture factory (CNC nesting and boring, edge banding, pressing) with its own QC and installation teams, so one accountable team controls design, production and installation at the source ("xưởng trực tiếp", "kiểm soát tại nguồn", "một đầu mối"). Segment: 3–5 star hospitality, villas/resorts, premium apartments and commercial projects. Tagline: "Xưởng sản xuất trực tiếp – Kiểm soát chất lượng – An toàn tiến độ" / "Direct factory production – Quality control – On-time delivery".

## Operating Context

- Buyers evaluate with drawings, BOQ (bill of quantities), material schedules and shop drawings. The six-step workflow is the only canonical process model, numbered Step 01–06 (Bước 01–06) everywhere it is mentioned: 01 drawing & BOQ intake (site measurement where needed) → 02 technical take-off → 03 project coordination → 04 in-house production → 05 pre-delivery QC → 06 on-site installation ("Lắp đặt tại công trình"; "thi công" is reserved for the service name and scope). Every other device (the four homepage stages, the four machine operations, the project-page phases) must name the step or steps it corresponds to.
- QC has four checkpoints: incoming materials, cross-check against drawings, in-production inspection, final sign-off before delivery.
- Locations: business office at Lô Q-2, đường số 8, KCN Long Hậu mở rộng, Cần Giuộc, Tây Ninh; factory at 557E1 – KP2 – Phường Phú Khương, Vĩnh Long. Factory visits are by appointment (call ahead).
- Contact: +84 903 102 012, noithatlaihuy@gmail.com, facebook.com/noithatlaihuy; 8:00–17:00, thứ 2 – thứ 7 (EN: Monday–Saturday, UTC+7). Phone display: VI "0903 102 012", EN "+84 903 102 012" (the `tel:` link stays `+84903102012`). No Zalo channel is configured.

## Capabilities and Constraints

- Services: a taxonomy of 3 services × 3 sectors/models. Services: Thiết kế & triển khai kỹ thuật (design & technical development), Sản xuất tại xưởng (in-house production), Thi công & lắp đặt (fit-out & installation). Sectors/models: Khách sạn & resort (hotel & resort interiors), Văn phòng & thương mại (office & commercial interiors), Gia công OEM & xuất khẩu (OEM & export production). The EN term for "thi công" is "fit-out" and for "lắp đặt" "installation". Products: cabinetry, beds, wall panelling, counters, tables, mainly in engineered/panel wood.
- Confirmed claims: about 3,000 m² workshop and warehouse; capacity up to about 50 hotel rooms per month; nationwide installation; export production; a preliminary BOQ (BOQ sơ bộ) prepared from client drawings; and a quote within 24 working hours of receiving complete drawings or project details ("Báo giá trong 24 giờ làm việc kể từ khi nhận đủ bản vẽ hoặc thông tin dự án"). The 24-hour promise appears only as that full sentence on `/lien-he`, in the homepage CTA block and in the project-page finale, never in a button label.
- Content is bilingual with vi/en parity; Vietnamese is the default. Locale is a cookie preference on one URL: there are no `/en` routes or `hreflang`, so English is not separately indexable.
- Production domain: `https://www.noithatlaihuy.vn`.
- The `/lien-he` contact form validates on the client, then opens a pre-filled email (mailto) to noithatlaihuy@gmail.com. The site sends and stores nothing, and copy must say the user sends the email themselves; no copy may claim the site delivers or receives the enquiry until a real transport is approved and built. Phone and email are the channels, and drawings arrive by email or a Drive link. The legal pages describe exactly this, plus the language cookie and the embedded Google Maps.
- No backend, database, email service or analytics without explicit approval.
- Open decisions: founding year and company history; whether a capability profile PDF and a sample BOQ download will exist; a contact-form transport beyond mailto, and analytics; per-image room labels for flat project galleries; whether the project-page finale shows the footprint stat; whether a design-only service is offered.

## Brand Commitments

- Name: Lai Huy Interior (Nội thất Lai Huy).
- Voice: B2B professional authority with quiet, refined restraint; concrete production and process facts over adjectives. Recurring terms: xưởng trực tiếp, kiểm soát tại nguồn, một đầu mối, BOQ, shop drawing, bóc tách. Gloss BOQ (bảng khối lượng), shop drawing (bản vẽ triển khai sản xuất) and OEM on first use on each page. "Một đầu mối" appears at most three times across the site. One primary CTA label, "Nhận báo giá" (Request a quote), and one secondary, "Gửi bản vẽ, nhận BOQ sơ bộ" (Send drawings for a preliminary BOQ). Terminology and per-surface wording live in `docs/content/2026-10-23-copy-deck.md`.
- Must never read as a consumer furniture e-commerce catalog, a boilerplate construction-company template, a SaaS product page or a generic AI landing page.
- Content fields stay empty until authentic content is supplied; nothing is fabricated. No construction warranty is claimed, and the legal pages do not mention warranty either. No "large-scale", "công trình lớn" or "hệ thống xưởng" claims (there is one factory); materials copy must match each project's materials list.
- Visual authority (binding, recorded here only as a pointer): `DESIGN.md` and the tokens in `app/assets/css/main.css`; `.agents/rules/laihuy-ux-ui.md` adds brand guardrails.

## Evidence on Hand

- Portfolio: 11 projects in `app/data/projects.ts`. Featured: Khách sạn Eo Gió (hotel, Vĩnh Long, 2026), Codi Boutique Hotel (hotel, Vĩnh Long, 2024), Codi Villa Phan Thiết (villa, NovaWorld Phan Thiết, 2025). Others cover villas, townhouses, a retreat, offices and a factory-office. Nine of the eleven span design + production + fit-out; Tà Đùng and Nhà xưởng anh Cường are design + fit-out. The craftsmanship copy of the six newly full-scope projects (Codi Boutique, Nhà vườn Chi Ly, Cải tạo nhà phố Quận 8, Nhà phố anh Nam, Phòng giám đốc, Văn phòng Quận 7) is owner-confirmed. Khách sạn Eo Gió has 44–45 rooms (2026); Codi Villa Phan Thiết has 20–25 rooms (2025), the total across its four villas. No project durations exist. Project images are 3D visualisations of built projects: copy must neither label them as renders/visualisations nor call them photographs ("ảnh thực tế", "ảnh chụp", "photography").
- Factory proof: machinery list, workflow, QC checkpoints and factory photography (`app/data/factory.ts`, media catalog). Factory photography is genuine (owner-confirmed), unlike the project images.
- Careers: six open roles (`app/data/careers.ts`).
- Absent, and must not be fabricated: testimonials, client logos, certifications (e.g. ISO), awards, press, founder/team profiles, pricing, founding year, legal entity name and tax ID, project durations, salary and deadlines for open roles, MOQ/incoterms/packing, panel specs and tolerances. Client names in the data (e.g. "Anh Huy") are never surfaced in copy.

## Product Principles

1. Prove capability with production facts (factory, machinery, workflow, QC, completed projects) rather than claims.
2. Serve owners and design/contractor teams equally; each must find their path to an enquiry without the other's being buried.
3. Never promise what the business cannot deliver: no fabricated proof, no delivery claims for the contact form (the user sends the email themselves).
4. Vietnamese first, English at parity.

## Accessibility & Inclusion

Target WCAG 2.x AA: sufficient contrast, skip link, visible focus states and labelled controls. The automated axe gate currently excludes color contrast and covers selected routes only; manual keyboard and screen-reader checks are still pending.
