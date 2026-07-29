import { brandMedia, companyMedia, projectMedia } from '~/media/catalog.generated'
import type { LocalizedArray, LocalizedText } from '~/shared/types/localization'
import type { MediaAsset } from '~/shared/media/types'

export type CtaLink = {
  label: LocalizedText
  to: string
  variant?: 'primary' | 'secondary' | 'dark' | 'light'
}

export type SeoEntry = {
  title: LocalizedText
  description: LocalizedText
  ogImage: MediaAsset
}

export type AddressEntry = {
  label: LocalizedText
  address: LocalizedText
  mapUrl: string
}

// --- Optional About-page content. Every field renders conditionally and stays
// empty until authored with authentic content — never fabricated. -------------
export type CompanyValue = {
  icon: string
  title: LocalizedText
  description: LocalizedText
}

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
  phone: '+84 903 102 012',
  email: 'noithatlaihuy@gmail.com',
  facebook: 'https://www.facebook.com/noithatlaihuy',
  tagline: {
    vi: 'Xưởng sản xuất trực tiếp - Kiểm soát chất lượng - An toàn tiến độ',
    en: 'Direct factory production - Quality control - On-time delivery'
  },
  positioning: {
    vi: 'Nhà thầu sản xuất và thi công nội thất khách sạn, villa và căn hộ cao cấp với hệ thống xưởng trực tiếp và quy trình kiểm soát chất lượng đồng bộ.',
    en: 'A factory-direct contractor that manufactures and builds interiors for hotels, villas, and premium apartments, backed by an integrated quality control process.'
  },
  shortPositioning: {
    vi: 'Sản xuất và thi công nội thất khách sạn, villa, căn hộ và dự án thương mại với năng lực nhà xưởng trực tiếp.',
    en: 'Factory-direct manufacturing and contracting for hotels, villas, apartments, and commercial interior projects.'
  },
  // --- Optional About-page content (renders only when authored) --------------
  /** Founding year — enables "Since …" cues once set. */
  foundingYear: undefined as string | undefined,
  mission: undefined as LocalizedText | undefined,
  vision: undefined as LocalizedText | undefined,
  /** Core values — migrated from the original About page copy, now bilingual. */
  coreValues: [
    {
      icon: 'i-lucide-factory',
      title: { vi: 'Sản xuất trực tiếp', en: 'Direct production' },
      description: {
        vi: 'Chủ động xưởng giúp kiểm soát vật liệu, tiến độ và chất lượng hoàn thiện cho từng hạng mục nội thất.',
        en: 'Owning the workshop lets us control materials, schedule and finishing quality on every interior package.'
      }
    },
    {
      icon: 'i-lucide-list-checks',
      title: { vi: 'Quản lý dự án rõ ràng', en: 'Clear project management' },
      description: {
        vi: 'Quy trình phối hợp giữa thiết kế, kỹ thuật, sản xuất, QC và thi công giúp giảm sai lệch khi triển khai.',
        en: 'A coordinated flow across design, engineering, production, QC and installation reduces gaps during delivery.'
      }
    },
    {
      icon: 'i-lucide-hard-hat',
      title: { vi: 'Thi công thực chiến', en: 'Hands-on installation' },
      description: {
        vi: 'Đội ngũ lắp dựng làm việc tại công trình, phối hợp hiện trường và nghiệm thu theo từng giai đoạn.',
        en: 'Our installation teams work on site, coordinating in the field and signing off stage by stage.'
      }
    }
  ] satisfies CompanyValue[],
  milestones: [] as CompanyMilestone[],
  founder: undefined as CompanyFounder | undefined,
  team: [] as CompanyTeamMember[],
  certifications: undefined as LocalizedArray | undefined,
  awards: undefined as LocalizedArray | undefined,
  testimonials: [] as CompanyTestimonial[],
  workingHours: {
    vi: ['Từ 8:00 - 17:00', 'Từ thứ 2 đến thứ 7'],
    en: ['8:00 - 17:00', 'Monday to Saturday']
  } satisfies LocalizedArray,
  addresses: [
    {
      label: { vi: 'Văn phòng giao dịch', en: 'Business office' },
      address: representativeOffice,
      // Map queries stay on the Vietnamese address: that is the string Google Maps resolves.
      mapUrl: buildMapUrl(representativeOffice.vi)
    },
    {
      label: { vi: 'Nhà xưởng', en: 'Factory' },
      address: factoryAddress,
      mapUrl: buildMapUrl(factoryAddress.vi)
    }
  ] satisfies AddressEntry[],
  primaryCtas: [
    {
      label: { vi: 'Nhận báo giá trong 24h', en: 'Get a quote within 24h' },
      to: '/lien-he',
      variant: 'primary'
    },
    {
      label: { vi: 'Xem năng lực nhà xưởng', en: 'View factory capability' },
      to: '/nha-xuong',
      variant: 'secondary'
    }
  ] satisfies CtaLink[],
  markets: {
    vi: [
      'Khách sạn 3-5 sao',
      'Villa và biệt thự nghỉ dưỡng',
      'Căn hộ cao cấp',
      'Dự án thương mại',
      'Gia công theo bản vẽ',
      'Đơn hàng xuất khẩu'
    ],
    en: [
      '3-5 star hotels',
      'Villas and resort residences',
      'Premium apartments',
      'Commercial projects',
      'Shop drawings and OEM production',
      'Export-ready orders'
    ]
  } satisfies LocalizedArray,
  footerServices: {
    vi: [
      'Thiết kế nội thất khách sạn',
      'Sản xuất nội thất tại xưởng',
      'Thi công nội thất toàn quốc',
      'Gia công theo bản vẽ',
      'Kiểm soát chất lượng dự án'
    ],
    en: [
      'Hotel interior design',
      'Factory-direct furniture production',
      'Nationwide interior contracting',
      'Production from technical drawings',
      'Project quality control'
    ]
  } satisfies LocalizedArray,
  /* The footer's trust layer. NOT new claims: every entry is a phrase this company already
     publishes about itself, lifted verbatim in meaning from `seo.home.description` below
     ("xưởng trực tiếp, kiểm soát chất lượng, thi công toàn quốc" / "own factory, in-house QC,
     nationwide") and from `footerServices` above. Discrete strings because a footer strip cannot
     render a sentence, not because anything here is newly asserted.

     The line that governs this field is the one at the top of this file: fields stay empty until
     authored with authentic content, never fabricated. A fifth signal — a construction warranty —
     was requested and deliberately NOT added: nothing in this repository states that such a
     warranty exists, and a footer is the last place a business should discover it is promising
     something nobody authored. Add it here only when someone can point at the policy. */
  trustSignals: {
    vi: [
      'Xưởng sản xuất trực tiếp',
      'Thiết kế & sản xuất đồng bộ',
      'Kiểm soát chất lượng',
      'Thi công toàn quốc'
    ],
    en: [
      'Own production factory',
      'Design and production in-house',
      'In-house quality control',
      'Nationwide installation'
    ]
  } satisfies LocalizedArray,
  seo: {
    home: {
      title: {
        vi: 'Sản xuất & thi công nội thất khách sạn | Lai Huy Interior',
        en: 'Hotel Interior Manufacturer & Contractor | Lai Huy Interior'
      },
      description: {
        vi: 'Lai Huy Interior thiết kế, sản xuất và thi công nội thất khách sạn, villa, căn hộ và dự án lớn — xưởng trực tiếp, kiểm soát chất lượng, thi công toàn quốc.',
        en: 'Lai Huy Interior designs, manufactures and installs interiors for hotels, villas, apartments and large-scale projects — own factory, in-house QC, nationwide.'
      },
      ogImage: brandMedia.bannerHome
    },
    projects: {
      title: {
        vi: 'Dự án nội thất khách sạn & công trình lớn | Lai Huy Interior',
        en: 'Hotel & Large-Scale Interior Case Studies | Lai Huy Interior'
      },
      description: {
        vi: 'Xem các case study thiết kế, sản xuất và thi công nội thất khách sạn, villa, căn hộ, nhà phố và không gian thương mại của Lai Huy Interior.',
        en: 'Explore Lai Huy Interior case studies across hotel, villa, apartment, townhouse, and commercial interior projects.'
      },
      ogImage: projectMedia['khach-san-eo-gio'].cover
    },
    factory: {
      title: {
        vi: 'Năng lực nhà xưởng nội thất khách sạn | Lai Huy Interior',
        en: 'Factory Capability For Hotel Interiors | Lai Huy Interior'
      },
      description: {
        vi: 'Khám phá năng lực xưởng sản xuất nội thất trực tiếp của Lai Huy Interior: máy móc, quy trình sản xuất, kiểm soát chất lượng và đội thi công.',
        en: 'Discover Lai Huy Interior direct production capability: machinery, workflow, quality control, and on-site contracting.'
      },
      ogImage: companyMedia.aboutWorkspace
    },
    services: {
      title: {
        vi: 'Dịch vụ sản xuất & thi công nội thất | Lai Huy Interior',
        en: 'Interior Production & Fit-out Services | Lai Huy Interior'
      },
      description: {
        vi: 'Dịch vụ thiết kế, sản xuất tại xưởng, thi công nội thất khách sạn 3-5 sao, villa, căn hộ, thương mại và gia công xuất khẩu.',
        en: 'Design, factory production, contracting, hotel interiors, villas, apartments, commercial projects, and export-ready manufacturing services.'
      },
      ogImage: projectMedia['codi-boutique-hotel'].cover
    },
    about: {
      title: {
        vi: 'Giới thiệu Lai Huy | Xưởng nội thất khách sạn & dự án',
        en: 'About Lai Huy Interior | Hotel Interior Factory & Contractor'
      },
      description: {
        vi: 'Lai Huy Interior là đơn vị sản xuất và thi công nội thất dự án với xưởng trực tiếp, đội ngũ kỹ thuật và kinh nghiệm triển khai khách sạn, villa, căn hộ.',
        en: 'Lai Huy Interior is a factory-direct interior manufacturer and contractor for hotels, villas, apartments, and large-scale projects.'
      },
      ogImage: companyMedia.companyStory
    },
    careers: {
      title: {
        vi: 'Tuyển dụng ngành nội thất dự án | Lai Huy Interior',
        en: 'Careers In Project Interior Manufacturing | Lai Huy Interior'
      },
      description: {
        vi: 'Gia nhập Lai Huy Interior để làm việc trong môi trường sản xuất và thi công nội thất chuyên nghiệp cho khách sạn, villa và dự án quy mô lớn.',
        en: 'Join Lai Huy Interior and work in a professional factory and project environment for hotels, villas, and large-scale interiors.'
      },
      ogImage: companyMedia.aboutWorkspace
    },
    contact: {
      title: {
        vi: 'Liên hệ thi công nội thất khách sạn | Lai Huy Interior',
        en: 'Contact Hotel Interior Contractor | Lai Huy Interior'
      },
      description: {
        vi: 'Liên hệ Lai Huy Interior để nhận tư vấn, báo giá và gửi bản vẽ cho dự án nội thất khách sạn, villa, căn hộ hoặc công trình thương mại.',
        en: 'Contact Lai Huy Interior for consultation, quotation, and preliminary BOQ review for hotel, villa, apartment, or commercial interior projects.'
      },
      ogImage: companyMedia.mapAddress
    }
  } satisfies Record<string, SeoEntry>
}

export const quoteMailto = `mailto:${company.email}?subject=${encodeURIComponent(
  'Yêu cầu báo giá nội thất dự án'
)}`
