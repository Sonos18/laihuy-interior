import type { LocalizedArray, LocalizedText } from '~/shared/types/localization'

export type CtaLink = {
  label: LocalizedText
  to: string
  variant?: 'primary' | 'secondary' | 'dark' | 'light'
}

export type SeoEntry = {
  title: LocalizedText
  description: LocalizedText
  ogImage?: string
}

export type AddressEntry = {
  label: LocalizedText
  address: LocalizedText
  mapUrl: string
}

const buildMapUrl = (address: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`

const representativeOffice
  = 'Lô Q-2, đường số 8, KCN Long Hậu mở rộng, Ấp 3, Xã Cần Giuộc, Tỉnh Tây Ninh'

const factoryAddress
  = '557E1 - KP2 - Phường Phú Khương, TP. Bến Tre - Bến Tre, Tỉnh Bến Tre, Vietnam'

export const company = {
  name: 'Lai Huy Interior',
  phone: '+84 90 310 20 12',
  email: 'noithatlaihuy@gmail.com',
  facebook: 'https://www.facebook.com/noithatlaihuy',
  tagline: {
    vi: 'Xưởng sản xuất trực tiếp - Kiểm soát chất lượng - Thi công toàn quốc',
    en: 'Direct factory production - Quality control - Nationwide installation'
  },
  positioning: {
    vi: 'Lai Huy Interior chuyên sản xuất và thi công nội thất khách sạn 3-5 sao, villa, căn hộ và các dự án quy mô lớn với hệ thống xưởng trực tiếp, đội ngũ kỹ thuật và quy trình kiểm soát chất lượng rõ ràng.',
    en: 'Lai Huy Interior manufactures and installs interiors for 3-5 star hotels, villas, apartments, and large-scale projects through a direct factory system, technical team, and clear quality control process.'
  },
  shortPositioning: {
    vi: 'Sản xuất và thi công nội thất khách sạn, villa, căn hộ và dự án thương mại với năng lực nhà xưởng trực tiếp.',
    en: 'Factory-direct manufacturing and installation for hotels, villas, apartments, and commercial interior projects.'
  },
  workingHours: {
    vi: ['Từ 8:00 - 17:00', 'Từ thứ 2 đến thứ 7'],
    en: ['8:00 - 17:00', 'Monday to Saturday']
  } satisfies LocalizedArray,
  addresses: [
    {
      label: { vi: 'Văn phòng đại diện', en: 'Representative office' },
      address: representativeOffice,
      mapUrl: buildMapUrl(representativeOffice)
    },
    {
      label: { vi: 'Nhà xưởng', en: 'Factory' },
      address: factoryAddress,
      mapUrl: buildMapUrl(factoryAddress)
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
      'Thi công và lắp đặt toàn quốc',
      'Gia công theo bản vẽ',
      'Kiểm soát chất lượng dự án'
    ],
    en: [
      'Hotel interior design',
      'Factory-direct furniture production',
      'Nationwide installation',
      'Production from technical drawings',
      'Project quality control'
    ]
  } satisfies LocalizedArray,
  seo: {
    home: {
      title: {
        vi: 'Thi công & sản xuất nội thất khách sạn 3-5 sao | Lai Huy Interior',
        en: 'Hotel Interior Manufacturing & Contracting | Lai Huy Interior'
      },
      description: {
        vi: 'Lai Huy Interior chuyên thiết kế, sản xuất và thi công nội thất khách sạn, villa, căn hộ và dự án lớn với xưởng sản xuất trực tiếp, kiểm soát chất lượng và thi công toàn quốc.',
        en: 'Lai Huy Interior provides design, manufacturing, and installation solutions for hotels, villas, apartments, and large-scale interior projects with direct factory production and quality control.'
      },
      ogImage: '/images/projects/hotel/eo_gio/reception.png'
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
      ogImage: '/images/projects/hotel/eo_gio/reception.png'
    },
    factory: {
      title: {
        vi: 'Năng lực nhà xưởng nội thất khách sạn | Lai Huy Interior',
        en: 'Factory Capability For Hotel Interiors | Lai Huy Interior'
      },
      description: {
        vi: 'Khám phá năng lực xưởng sản xuất nội thất trực tiếp của Lai Huy Interior: máy móc, quy trình sản xuất, kiểm soát chất lượng và đội lắp đặt.',
        en: 'Discover Lai Huy Interior direct production capability: machinery, workflow, quality control, and installation coordination.'
      },
      ogImage: '/images/about_workspace.jpg'
    },
    services: {
      title: {
        vi: 'Dịch vụ thi công & sản xuất nội thất khách sạn | Lai Huy Interior',
        en: 'Hotel Interior Manufacturing & Installation Services | Lai Huy Interior'
      },
      description: {
        vi: 'Dịch vụ thiết kế, sản xuất tại xưởng, thi công lắp đặt nội thất khách sạn 3-5 sao, villa, căn hộ, thương mại và gia công xuất khẩu.',
        en: 'Design, factory production, installation, hotel interiors, villas, apartments, commercial projects, and export-ready manufacturing services.'
      },
      ogImage: '/images/projects/hotel/codi/reception_desk.jpg'
    },
    about: {
      title: {
        vi: 'Giới thiệu Lai Huy Interior | Xưởng nội thất khách sạn và dự án',
        en: 'About Lai Huy Interior | Hotel Interior Factory & Contractor'
      },
      description: {
        vi: 'Lai Huy Interior là đơn vị sản xuất và thi công nội thất dự án với xưởng trực tiếp, đội ngũ kỹ thuật và kinh nghiệm triển khai khách sạn, villa, căn hộ.',
        en: 'Lai Huy Interior is a factory-direct interior manufacturer and contractor for hotels, villas, apartments, and large-scale projects.'
      },
      ogImage: '/images/company-story.jpg'
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
      ogImage: '/images/about_workspace.jpg'
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
      ogImage: '/images/map_address.png'
    }
  } satisfies Record<string, SeoEntry>
}

export const quoteMailto = `mailto:${company.email}?subject=${encodeURIComponent(
  'Yêu cầu báo giá nội thất dự án'
)}`
