import { brandMedia, companyMedia, projectMedia } from '~/media/catalog.generated'
import type { LocalizedArray, LocalizedText } from '~/shared/types/localization'
import type { MediaAsset } from '~/shared/media/types'

export type SeoEntry = {
  title: LocalizedText
  description: LocalizedText
  ogImage: MediaAsset
}

export type AddressEntry = {
  label: LocalizedText
  address: LocalizedText
  mapUrl: string
  /** The action label on the map link. One per address: two links named alike point two places. */
  mapAction: LocalizedText
  /**
   * The glyph for footer band 2. Data, not template: the two entries take DIFFERENT icons (a pin
   * for the office, a factory for the workshop), and the footer previously hardcoded `map-pin`
   * for both — which made the two blocks visually identical and left the icon saying nothing the
   * title beside it wasn't already saying.
   */
  icon: string
}

/**
 * One line of the footer's quality-commitment column: a glyph and a label, and nothing else.
 * Deliberately NOT `CompanyValue` — that type carries a `description`, and a footer column that
 * renders a paragraph per item stops being a column.
 */
export type TrustSignal = {
  icon: string
  label: LocalizedText
}

/** One footer services link: the label and the /dich-vu anchor it jumps to. */
export type FooterServiceLink = {
  label: LocalizedText
  to: string
}

// --- Optional About-page content. Every field renders conditionally and stays
// empty until authored with authentic content — never fabricated. -------------
export type CompanyMilestone = {
  year: string
  title: LocalizedText
  description?: LocalizedText
}

export type CompanyFounder = {
  name: string
  role: LocalizedText
  /** Portrait path relative to the media bucket — authentic photography only. */
  portrait?: string
  story: LocalizedText
  quote?: LocalizedText
  signature?: string
}

export type CompanyTeamMember = {
  name: string
  role: LocalizedText
  /** Portrait path relative to the media bucket — authentic photography only. */
  photo: string
  bio?: LocalizedText
}

export type CompanyTestimonial = {
  quote: LocalizedText
  author: LocalizedText
  role?: LocalizedText
}

const buildMapUrl = (address: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`

const representativeOffice = {
  vi: 'Lô Q-2, đường số 8, KCN Long Hậu mở rộng, Ấp 3, Xã Cần Giuộc, Tỉnh Tây Ninh',
  en: 'Lot Q-2, Road 8, Long Hau Expanded Industrial Park, Hamlet 3, Can Giuoc, Tay Ninh Province'
} satisfies LocalizedText

const factoryAddress = {
  vi: '557E1 - KP2 - Phường Phú Khương, Tỉnh Vĩnh Long, Việt Nam',
  en: '557E1, Quarter 2, Phu Khuong Ward, Vinh Long Province, Vietnam'
} satisfies LocalizedText

export const company = {
  name: 'Lai Huy Interior',
  /** Canonical number: drives every `tel:` link and the JSON-LD. Never shown as-is. */
  phone: '+84 903 102 012',
  /** What visitors read: Vietnamese local format, English international format. */
  phoneDisplay: { vi: '0903 102 012', en: '+84 903 102 012' } satisfies LocalizedText,
  email: 'noithatlaihuy@gmail.com',
  facebook: 'https://www.facebook.com/noithatlaihuy',
  positioning: {
    vi: 'Thiết kế, sản xuất và thi công nội thất cho khách sạn, villa, căn hộ và văn phòng, từ xưởng riêng tại Vĩnh Long.',
    en: 'Interior design, production and fit-out for hotels, villas, apartments and offices, from our own factory in Vinh Long.'
  },
  // --- Optional About-page content (renders only when authored) --------------
  /** Founding year — enables "Since …" cues once set. */
  foundingYear: undefined as string | undefined,
  mission: undefined as LocalizedText | undefined,
  vision: undefined as LocalizedText | undefined,
  milestones: [] as CompanyMilestone[],
  founder: undefined as CompanyFounder | undefined,
  team: [] as CompanyTeamMember[],
  certifications: undefined as LocalizedArray | undefined,
  awards: undefined as LocalizedArray | undefined,
  testimonials: [] as CompanyTestimonial[],
  /* One line per locale. Still an array so consumers can join or stack lines without a type change. */
  workingHours: {
    vi: ['8:00–17:00, thứ 2 – thứ 7'],
    en: ['8:00–17:00, Monday–Saturday (UTC+7)']
  } satisfies LocalizedArray,
  addresses: [
    {
      label: { vi: 'Văn phòng giao dịch', en: 'Business office' },
      address: representativeOffice,
      // Map queries stay on the Vietnamese address: that is the string Google Maps resolves.
      mapUrl: buildMapUrl(representativeOffice.vi),
      mapAction: { vi: 'Mở bản đồ văn phòng', en: 'Open office map' },
      icon: 'i-lucide-map-pin'
    },
    {
      label: { vi: 'Nhà xưởng', en: 'Factory' },
      address: factoryAddress,
      mapUrl: buildMapUrl(factoryAddress.vi),
      mapAction: { vi: 'Mở bản đồ nhà xưởng', en: 'Open factory map' },
      icon: 'i-lucide-factory'
    }
  ] satisfies AddressEntry[],
  /* The six names of the services taxonomy (copy deck 2.3): three services, then three sectors
     and models. Each links to its anchor on /dich-vu, so the footer never lands on the top of
     a page and leaves the visitor to find the item. */
  footerServices: [
    { label: { vi: 'Thiết kế & triển khai kỹ thuật', en: 'Design & technical development' }, to: '/dich-vu#thiet-ke' },
    { label: { vi: 'Sản xuất tại xưởng', en: 'In-house production' }, to: '/dich-vu#san-xuat' },
    { label: { vi: 'Thi công & lắp đặt', en: 'Fit-out & installation' }, to: '/dich-vu#thi-cong' },
    { label: { vi: 'Nội thất khách sạn & resort', en: 'Hotel & resort interiors' }, to: '/dich-vu#khach-san' },
    { label: { vi: 'Nội thất văn phòng & thương mại', en: 'Office & commercial interiors' }, to: '/dich-vu#van-phong' },
    { label: { vi: 'Gia công OEM & xuất khẩu', en: 'OEM & export production' }, to: '/dich-vu#oem-xuat-khau' }
  ] satisfies FooterServiceLink[],
  /* The footer's trust layer. NOT new claims: every entry is a phrase this company already
     publishes about itself (own factory, in-house QC, nationwide installation — the confirmed
     claims in PRODUCT.md) and the services in `footerServices` above. Discrete strings because a
     footer strip cannot render a sentence, not because anything here is newly asserted.

     The line that governs this field is the one at the top of this file: fields stay empty until
     authored with authentic content, never fabricated. A fifth signal — a construction warranty —
     was requested and deliberately NOT added: nothing in this repository states that such a
     warranty exists, and a footer is the last place a business should discover it is promising
     something nobody authored. Add it here only when someone can point at the policy.

     The glyphs are REUSED, not chosen: three of the four labels have an exact title match in
     `differentiators` on /gioi-thieu and take that page's icon verbatim — factory, shield-check,
     truck. The fourth ('Thiết kế & sản xuất đồng bộ') takes `workflow`, which the same page
     already uses for 'Thiết kế → thi công'. One claim, one glyph, site-wide: a footer that picks
     its own iconography for claims the site already illustrates is a second visual vocabulary. */
  trustSignals: [
    { icon: 'i-lucide-factory', label: { vi: 'Xưởng sản xuất trực tiếp', en: 'Own production factory' } },
    { icon: 'i-lucide-workflow', label: { vi: 'Thiết kế & sản xuất đồng bộ', en: 'Design and production under one team' } },
    { icon: 'i-lucide-shield-check', label: { vi: 'Kiểm soát chất lượng', en: 'In-house quality control' } },
    { icon: 'i-lucide-truck', label: { vi: 'Lắp đặt toàn quốc', en: 'Nationwide installation' } }
  ] satisfies TrustSignal[],
  seo: {
    home: {
      title: {
        vi: 'Nội thất khách sạn & dự án, xưởng riêng tại Vĩnh Long | Lai Huy Interior',
        en: 'Hotel & Project Interiors from Our Vinh Long Factory | Lai Huy Interior'
      },
      description: {
        vi: 'Lai Huy thiết kế, sản xuất tại xưởng Vĩnh Long và thi công nội thất khách sạn, villa, căn hộ, văn phòng. Sản xuất theo bản vẽ cho thiết kế và tổng thầu.',
        en: 'Lai Huy designs, makes in its Vinh Long factory and fits out hotels, villas, apartments and offices, and builds to designers’ and contractors’ drawings.'
      },
      ogImage: brandMedia.bannerHome
    },
    projects: {
      title: {
        vi: 'Dự án nội thất khách sạn, villa, văn phòng | Lai Huy Interior',
        en: 'Hotel, Villa & Office Interior Projects | Lai Huy Interior'
      },
      description: {
        vi: 'Dự án nội thất Lai Huy đã thực hiện: khách sạn, villa, nhà phố, văn phòng tại Vĩnh Long, TP.HCM, Phan Thiết, ghi rõ phạm vi, diện tích và vật liệu.',
        en: 'Interior projects by Lai Huy: hotels, villas, townhouses and offices in Vinh Long, Ho Chi Minh City and Phan Thiet, with scope, area and materials.'
      },
      ogImage: projectMedia['khach-san-eo-gio'].cover
    },
    factory: {
      title: {
        vi: 'Xưởng sản xuất nội thất tại Vĩnh Long | Lai Huy Interior',
        en: 'Interior Furniture Factory in Vinh Long | Lai Huy Interior'
      },
      description: {
        vi: 'Xưởng và kho 3.000 m² tại Vĩnh Long: CNC nesting, khoan CNC, dán cạnh tự động, ép nguội, 4 điểm QC; công suất đến 50 phòng khách sạn mỗi tháng.',
        en: 'A 3,000 m² factory and warehouse in Vinh Long: CNC nesting and boring, automatic edge banding, cold pressing, four QC checks, up to 50 hotel rooms a month.'
      },
      ogImage: companyMedia.aboutWorkspace
    },
    services: {
      title: {
        vi: 'Thiết kế, sản xuất & thi công nội thất | Lai Huy Interior',
        en: 'Interior Design, Production & Fit-out | Lai Huy Interior'
      },
      description: {
        vi: 'Ba dịch vụ: thiết kế & triển khai kỹ thuật, sản xuất tại xưởng, thi công & lắp đặt; cho khách sạn, văn phòng, thương mại và đơn hàng OEM, xuất khẩu.',
        en: 'Three services: design and technical development, in-house production, fit-out and installation, for hotels, offices, commercial and OEM or export orders.'
      },
      ogImage: projectMedia['codi-boutique-hotel'].cover
    },
    about: {
      title: {
        vi: 'Giới thiệu: nhà thầu nội thất có xưởng riêng | Lai Huy Interior',
        en: 'About: An Interior Contractor with Its Own Factory | Lai Huy Interior'
      },
      description: {
        vi: 'Lai Huy là nhà thầu nội thất có xưởng riêng tại Vĩnh Long: thiết kế, sản xuất, kiểm tra chất lượng và lắp đặt cho khách sạn, villa, căn hộ, văn phòng.',
        en: 'Lai Huy is an interior contractor with its own factory in Vinh Long: design, production, quality control and installation for hotels, villas and offices.'
      },
      ogImage: companyMedia.companyStory
    },
    careers: {
      title: {
        vi: 'Tuyển dụng: xưởng Vĩnh Long, văn phòng Long Hậu | Lai Huy Interior',
        en: 'Careers at Our Vinh Long Factory & Long Hau Office | Lai Huy Interior'
      },
      description: {
        vi: 'Tuyển quản đốc xưởng, kỹ thuật sản xuất, thiết kế nội thất, thợ mộc, giám sát công trình và kinh doanh dự án tại xưởng Vĩnh Long, văn phòng Long Hậu.',
        en: 'Hiring: workshop foreman, production engineer, interior designer, carpenter, site supervisor, project sales, at our Vinh Long factory and Long Hau office.'
      },
      ogImage: companyMedia.aboutWorkspace
    },
    contact: {
      title: {
        vi: 'Liên hệ & nhận báo giá nội thất | Lai Huy Interior',
        en: 'Contact & Request an Interior Quote | Lai Huy Interior'
      },
      description: {
        vi: 'Gọi 0903 102 012 hoặc gửi bản vẽ PDF/DWG qua email để nhận BOQ sơ bộ và báo giá nội thất khách sạn, villa, văn phòng. 8:00–17:00, thứ 2 – thứ 7.',
        en: 'Call +84 903 102 012 or email PDF/DWG drawings for a preliminary BOQ and a quote on hotel, villa or office interiors. 8:00–17:00, Mon–Sat (UTC+7).'
      },
      ogImage: companyMedia.mapAddress
    },
    /* The two legal routes. They carry full SEO like every other page rather than being left to
       the layout defaults — they are linked site-wide from the footer, so they WILL be crawled,
       and a legal page with no description is the kind of thin result that drags a domain down.
       Both reuse the company story image: neither document has photography of its own, and
       inventing a social card for a privacy policy is not worth a bespoke asset. */
    privacy: {
      title: {
        vi: 'Chính sách bảo mật | Lai Huy Interior',
        en: 'Privacy Policy | Lai Huy Interior'
      },
      description: {
        vi: 'Chính sách bảo mật của Lai Huy Interior: dữ liệu cá nhân chúng tôi thu thập, mục đích sử dụng, thời gian lưu trữ và quyền của bạn đối với dữ liệu.',
        en: 'The Lai Huy Interior privacy policy: what personal data we collect, why we use it, how long we keep it, and the rights you hold over it.'
      },
      ogImage: companyMedia.companyStory
    },
    terms: {
      title: {
        vi: 'Điều khoản sử dụng | Lai Huy Interior',
        en: 'Terms of Use | Lai Huy Interior'
      },
      description: {
        vi: 'Điều khoản sử dụng website Lai Huy Interior: phạm vi dịch vụ, quyền sở hữu trí tuệ, giá trị của báo giá tham khảo và giới hạn trách nhiệm.',
        en: 'Terms of use for the Lai Huy Interior website: scope of services, intellectual property, the status of indicative quotations, and limitation of liability.'
      },
      ogImage: companyMedia.companyStory
    }
  } satisfies Record<string, SeoEntry>
}

/**
 * The generic "Email us" link. Localised because the subject line is read by the visitor in their
 * mail client before they send. The form on /lien-he builds its own, richer message with
 * `buildQuoteMailto`.
 */
export const quoteMailto = {
  vi: `mailto:${company.email}?subject=${encodeURIComponent('[Báo giá] Yêu cầu báo giá nội thất')}`,
  en: `mailto:${company.email}?subject=${encodeURIComponent('[Quote request] Interior quote')}`
} satisfies LocalizedText
