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

- Buyers evaluate with drawings, BOQ (bill of quantities), material schedules and shop drawings; projects run through a six-step workflow: drawing & BOQ intake → technical take-off → project coordination → in-house production → pre-delivery QC → on-site installation.
- QC has four checkpoints: incoming materials, cross-check against drawings, in-production inspection, final sign-off before delivery.
- Locations: business office at Lô Q-2, đường số 8, KCN Long Hậu mở rộng, Cần Giuộc, Tây Ninh; factory at 557E1 – KP2 – Phường Phú Khương, Vĩnh Long. Factory visits are by appointment (call ahead).
- Contact: +84 903 102 012, noithatlaihuy@gmail.com, facebook.com/noithatlaihuy; Monday–Saturday 8:00–17:00. No Zalo channel is configured.

## Capabilities and Constraints

- Services: design & technical development; in-house furniture production; project interior contracting; hotel & resort interiors; commercial interiors (showroom, office, retail); OEM & export production. Products: cabinetry, beds, wall panelling, counters, tables, mainly in engineered/panel wood.
- Confirmed claims: about 3,000 m² workshop and warehouse; capacity up to about 50 hotel rooms per month; quote within 24 hours; nationwide installation; export production.
- Content is bilingual with vi/en parity; Vietnamese is the default. Locale is a cookie preference on one URL: there are no `/en` routes or `hreflang`, so English is not separately indexable.
- Production domain: `https://www.noithatlaihuy.vn`.
- The `/lien-he` contact form validates on the client and logs the draft only. It does not send, store or deliver enquiries, and no copy may claim it does until a real transport is approved and built. Phone and email are the working channels. This sits in tension with the 24-hour quote promise until a transport exists.
- No backend, database, email service or analytics without explicit approval.
- Open decisions: founding year and company history; whether a capability profile PDF and a sample BOQ download will exist; contact-form transport and analytics.

## Brand Commitments

- Name: Lai Huy Interior (Nội thất Lai Huy).
- Voice: B2B professional authority with quiet, refined restraint; concrete production and process facts over adjectives. Recurring terms: xưởng trực tiếp, kiểm soát tại nguồn, một đầu mối, BOQ, shop drawing, bóc tách.
- Must never read as a consumer furniture e-commerce catalog, a boilerplate construction-company template, a SaaS product page or a generic AI landing page.
- Content fields stay empty until authentic content is supplied; nothing is fabricated. No construction warranty is claimed.
- Visual authority (binding, recorded here only as a pointer): `DESIGN.md` and the tokens in `app/assets/css/main.css`; `.agents/rules/laihuy-ux-ui.md` adds brand guardrails.

## Evidence on Hand

- Portfolio: 11 projects in `app/data/projects.ts`. Featured: Khách sạn Eo Gió (hotel, Vĩnh Long, 2026), Codi Boutique Hotel (hotel, Vĩnh Long, 2024), Codi Villa Phan Thiết (villa, NovaWorld Phan Thiết, 2025). Others cover villas, townhouses, a retreat, offices and a factory-office. Three of the eleven span design + production + construction; six are design-only.
- Factory proof: machinery list, workflow, QC checkpoints and factory photography (`app/data/factory.ts`, media catalog).
- Careers: six open roles (`app/data/careers.ts`).
- Absent, and must not be fabricated: testimonials, client logos, certifications (e.g. ISO), awards, press, founder/team profiles, pricing, founding year.

## Product Principles

1. Prove capability with production facts (factory, machinery, workflow, QC, completed projects) rather than claims.
2. Serve owners and design/contractor teams equally; each must find their path to an enquiry without the other's being buried.
3. Never promise what the business cannot deliver: no fabricated proof, no delivery claims for the contact form.
4. Vietnamese first, English at parity.

## Accessibility & Inclusion

Target WCAG 2.x AA: sufficient contrast, skip link, visible focus states and labelled controls. The automated axe gate currently excludes color contrast and covers selected routes only; manual keyboard and screen-reader checks are still pending.
