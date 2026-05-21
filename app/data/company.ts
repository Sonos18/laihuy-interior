export type NavLink = {
  label: string
  to: string
}

export type CtaLink = {
  label: string
  to: string
  variant?: 'primary' | 'secondary' | 'dark' | 'light'
}

export type SeoEntry = {
  title: string
  description: string
  ogImage?: string
}

export type AddressEntry = {
  label: string
  address: string
  mapUrl: string
}

const buildMapUrl = (address: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`

const representativeOffice
  = 'Lô Q-2, đường số 8, KCN Long Hậu mở rộng, Ấp 3, Xã Cần Giuộc, Tỉnh Tây Ninh'

const factoryAddress
  = '557E1 - KP2 - Phường Phú Khương, TP. Bến Tre - Bến Tre, Tỉnh Bến Tre, Vietnam'

export const navLinks: NavLink[] = [
  { label: 'Trang chủ', to: '/' },
  { label: 'Dự án', to: '/du-an' },
  { label: 'Nhà xưởng', to: '/nha-xuong' },
  { label: 'Dịch vụ', to: '/dich-vu' },
  { label: 'Giới thiệu', to: '/gioi-thieu' },
  { label: 'Tuyển dụng', to: '/tuyen-dung' },
  { label: 'Liên hệ', to: '/lien-he' }
]

export const company = {
  name: 'Lai Huy Interior',
  phone: '+84 90 310 20 12',
  email: 'noithatlaihuy@gmail.com',
  facebook: 'https://www.facebook.com/noithatlaihuy',
  tagline: 'Xưởng sản xuất trực tiếp - Kiểm soát chất lượng - Thi công toàn quốc',
  positioning:
    'Lai Huy Interior chuyên sản xuất và thi công nội thất khách sạn 3-5 sao, villa, căn hộ và các dự án quy mô lớn với hệ thống xưởng trực tiếp, đội ngũ kỹ thuật và quy trình kiểm soát chất lượng rõ ràng.',
  shortPositioning:
    'Sản xuất và thi công nội thất khách sạn, villa, căn hộ và dự án thương mại với năng lực nhà xưởng trực tiếp.',
  workingHours: ['Từ 8:00 - 17:00', 'Từ thứ 2 đến thứ 7'],
  addresses: [
    {
      label: 'Văn phòng đại diện',
      address: representativeOffice,
      mapUrl: buildMapUrl(representativeOffice)
    },
    {
      label: 'Nhà xưởng',
      address: factoryAddress,
      mapUrl: buildMapUrl(factoryAddress)
    }
  ] satisfies AddressEntry[],
  primaryCtas: [
    { label: 'Nhận báo giá trong 24h', to: '/lien-he', variant: 'primary' },
    { label: 'Xem năng lực nhà xưởng', to: '/nha-xuong', variant: 'secondary' }
  ] satisfies CtaLink[],
  markets: [
    'Khách sạn 3-5 sao',
    'Villa và biệt thự nghỉ dưỡng',
    'Căn hộ cao cấp',
    'Dự án thương mại',
    'Gia công theo bản vẽ',
    'Đơn hàng xuất khẩu'
  ],
  footerServices: [
    'Thiết kế nội thất khách sạn',
    'Sản xuất nội thất tại xưởng',
    'Thi công và lắp đặt toàn quốc',
    'Gia công theo bản vẽ',
    'Kiểm soát chất lượng dự án'
  ],
  seo: {
    home: {
      title: 'Thi công & sản xuất nội thất khách sạn 3-5 sao | Lai Huy Interior',
      description:
        'Lai Huy Interior chuyên thiết kế, sản xuất và thi công nội thất khách sạn, villa, căn hộ và dự án lớn với xưởng sản xuất trực tiếp, kiểm soát chất lượng và thi công toàn quốc.',
      ogImage: '/images/projects/hotel/eo_gio/reception.png'
    },
    projects: {
      title: 'Dự án nội thất khách sạn & công trình lớn | Lai Huy Interior',
      description:
        'Xem các case study thiết kế, sản xuất và thi công nội thất khách sạn, villa, căn hộ, nhà phố và không gian thương mại của Lai Huy Interior.',
      ogImage: '/images/projects/hotel/eo_gio/reception.png'
    },
    factory: {
      title: 'Năng lực nhà xưởng nội thất khách sạn | Lai Huy Interior',
      description:
        'Khám phá năng lực xưởng sản xuất nội thất trực tiếp của Lai Huy Interior: máy móc, quy trình sản xuất, kiểm soát chất lượng và đội lắp đặt.',
      ogImage: '/images/about_workspace.jpg'
    },
    services: {
      title: 'Dịch vụ thi công & sản xuất nội thất khách sạn | Lai Huy Interior',
      description:
        'Dịch vụ thiết kế, sản xuất tại xưởng, thi công lắp đặt nội thất khách sạn 3-5 sao, villa, căn hộ, thương mại và gia công xuất khẩu.',
      ogImage: '/images/projects/hotel/codi/reception_desk.jpg'
    },
    about: {
      title: 'Giới thiệu Lai Huy Interior | Xưởng nội thất khách sạn và dự án',
      description:
        'Lai Huy Interior là đơn vị sản xuất và thi công nội thất dự án với xưởng trực tiếp, đội ngũ kỹ thuật và kinh nghiệm triển khai khách sạn, villa, căn hộ.',
      ogImage: '/images/company-story.jpg'
    },
    careers: {
      title: 'Tuyển dụng ngành nội thất dự án | Lai Huy Interior',
      description:
        'Gia nhập Lai Huy Interior để làm việc trong môi trường sản xuất và thi công nội thất chuyên nghiệp cho khách sạn, villa và dự án quy mô lớn.',
      ogImage: '/images/about_workspace.jpg'
    },
    contact: {
      title: 'Liên hệ thi công nội thất khách sạn | Lai Huy Interior',
      description:
        'Liên hệ Lai Huy Interior để nhận tư vấn, báo giá và gửi bản vẽ cho dự án nội thất khách sạn, villa, căn hộ hoặc công trình thương mại.',
      ogImage: '/images/map_address.png'
    }
  } satisfies Record<string, SeoEntry>
}

export const quoteMailto = `mailto:${company.email}?subject=${encodeURIComponent(
  'Yêu cầu báo giá nội thất dự án'
)}`
