// How every page closes (DESIGN.md "Closing CTA" and "Page door").
//
// quoteCtaContent: the one quote CTA shared by the pages whose closing action is a quote (home,
// projects, services, about). The factory and careers pages keep their own closing CTA because
// their action differs (book a visit, send a CV).
//
// pageDoors: the photograph at the very end of a page, above the footer, that opens the next
// page. Its photograph is that page's hero (app/media/page-heroes.ts), so following the door
// lands on the same picture. The contact page is the end of the path and has none; project
// detail pages close on their related projects.
import type { PageHeroKey } from '~/media/page-heroes'
import type { LocalizedText } from '~/shared/types/localization'

export type QuoteCtaContent = {
  eyebrow: LocalizedText
  title: LocalizedText
  description: LocalizedText
  primaryCta: LocalizedText
  phoneCta: LocalizedText
}

export const quoteCtaContent = {
  eyebrow: { vi: 'Có bản vẽ?', en: 'Have drawings?' },
  title: { vi: 'Gửi bản vẽ, nhận BOQ sơ bộ và báo giá', en: 'Send your drawings for a preliminary BOQ and a quote' },
  description: {
    vi: 'Đội kỹ thuật bóc tách và lập BOQ sơ bộ, báo giá trong 24 giờ làm việc kể từ khi nhận đủ hồ sơ. Chưa có bản vẽ thì gọi để trao đổi phạm vi.',
    en: 'Our technical team does the take-off and a preliminary BOQ, and quotes within 24 working hours of receiving complete documents. No drawings yet? Call to talk through the scope.'
  },
  primaryCta: { vi: 'Gửi bản vẽ, nhận BOQ sơ bộ', en: 'Send drawings for a preliminary BOQ' },
  phoneCta: { vi: 'Gọi', en: 'Call' }
} as const satisfies QuoteCtaContent

export type PageDoor = {
  to: string
  hero: PageHeroKey
  text: LocalizedText
  linkLabel: LocalizedText
}

export type PageDoorFrom = 'home' | 'projects' | 'services' | 'factory' | 'about' | 'careers'

export const pageDoors = {
  home: {
    to: '/du-an',
    hero: 'projects',
    text: { vi: 'Những công trình Lai Huy đã thiết kế, sản xuất và bàn giao', en: 'Projects Lai Huy has designed, made and handed over' },
    linkLabel: { vi: 'Xem dự án', en: 'View projects' }
  },
  projects: {
    to: '/dich-vu',
    hero: 'services',
    text: { vi: 'Mỗi công trình ở đây đi qua cùng một đội, từ bản vẽ tới lắp đặt', en: 'Every project here went through one team, from drawings to fit-out' },
    linkLabel: { vi: 'Xem dịch vụ', en: 'View services' }
  },
  services: {
    to: '/nha-xuong',
    hero: 'factory',
    text: { vi: 'Mọi hạng mục trên được làm tại xưởng riêng ở Vĩnh Long', en: 'Everything above is made in our own factory in Vinh Long' },
    linkLabel: { vi: 'Xem nhà xưởng', en: 'View the factory' }
  },
  factory: {
    to: '/gioi-thieu',
    hero: 'about',
    text: { vi: 'Những người đứng sau xưởng và cách họ làm việc', en: 'The people behind the factory and how they work' },
    linkLabel: { vi: 'Giới thiệu Lai Huy', en: 'About Lai Huy' }
  },
  about: {
    to: '/lien-he',
    hero: 'contact',
    text: { vi: 'Kể cho Lai Huy về dự án của bạn', en: 'Tell Lai Huy about your project' },
    linkLabel: { vi: 'Liên hệ', en: 'Contact' }
  },
  careers: {
    to: '/nha-xuong',
    hero: 'factory',
    text: { vi: 'Nơi bạn sẽ làm việc: xưởng 3.000 m² ở Vĩnh Long', en: 'Where you would work: a 3,000 m² factory in Vinh Long' },
    linkLabel: { vi: 'Xem nhà xưởng', en: 'View the factory' }
  }
} as const satisfies Record<PageDoorFrom, PageDoor>
