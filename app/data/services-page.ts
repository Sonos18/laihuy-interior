import type { ServiceId } from './services'
import type { LocalizedText } from '~/shared/types/localization'

type SectionIntro = {
  eyebrow: LocalizedText
  title: LocalizedText
  description: LocalizedText
}

type DocumentInput = {
  id: 'drawings' | 'technical' | 'materials'
  icon: string
  title: LocalizedText
  description: LocalizedText
}

type ProofItem = {
  id: 'factory' | 'quality'
  label: LocalizedText
  title: LocalizedText
  description: LocalizedText
}

type ServicesMediaKey = 'hero' | 'design' | 'construction' | ProofItem['id']

export type ServicesPageContent = {
  hero: {
    topic: LocalizedText
    title: LocalizedText
    specialTitle: LocalizedText
    subtitle: LocalizedText
  }
  documents: SectionIntro & {
    items: readonly DocumentInput[]
    primaryCta: LocalizedText
    secondaryCta: LocalizedText
  }
  journey: SectionIntro
  proof: SectionIntro & {
    items: readonly ProofItem[]
    cta: LocalizedText
  }
  programmes: SectionIntro
  contact: {
    eyebrow: LocalizedText
    title: LocalizedText
    description: LocalizedText
    primaryCta: LocalizedText
    phoneCta: LocalizedText
  }
}

export const serviceCoreIds = [
  'design',
  'factory-production',
  'construction'
] as const satisfies readonly ServiceId[]

export const serviceProgrammeIds = [
  'hotel-interior',
  'commercial-projects',
  'export-oem'
] as const satisfies readonly ServiceId[]

export const servicesPageContent = {
  hero: {
    topic: { vi: 'Dịch vụ nội thất dự án', en: 'Project interior services' },
    title: { vi: 'Từ hồ sơ đến', en: 'From project documents to' },
    specialTitle: { vi: 'công trình hoàn thiện', en: 'finished interiors' },
    subtitle: {
      vi: 'Một đầu mối cho triển khai kỹ thuật, sản xuất tại xưởng và thi công nội thất theo yêu cầu của từng dự án.',
      en: 'One accountable partner for technical development, in-house production and interior contracting around each project brief.'
    }
  },
  documents: {
    eyebrow: { vi: 'Hồ sơ đầu vào', en: 'Starting documents' },
    title: {
      vi: 'Bắt đầu từ bản vẽ và yêu cầu bạn đang có',
      en: 'Start with the drawings and requirements you already have'
    },
    description: {
      vi: 'Lai Huy tiếp nhận hồ sơ ở nhiều mức độ hoàn thiện để cùng xác định phạm vi kỹ thuật, sản xuất và thi công phù hợp.',
      en: 'Lai Huy can review documents at different stages to define an appropriate technical, production and installation scope.'
    },
    items: [
      {
        id: 'drawings',
        icon: 'i-lucide-file-pen-line',
        title: { vi: 'Concept & bản vẽ thiết kế', en: 'Concept & design drawings' },
        description: {
          vi: 'Mặt bằng, phối cảnh, định hướng công năng và vật liệu của dự án.',
          en: 'Layouts, visuals, functional direction and project material intent.'
        }
      },
      {
        id: 'technical',
        icon: 'i-lucide-clipboard-list',
        title: { vi: 'Hồ sơ kỹ thuật & BOQ', en: 'Technical documents & BOQ' },
        description: {
          vi: 'Shop drawing, chi tiết cấu tạo, danh mục khối lượng hoặc phạm vi mời thầu.',
          en: 'Shop drawings, construction details, bill of quantities or tender scope.'
        }
      },
      {
        id: 'materials',
        icon: 'i-lucide-swatch-book',
        title: { vi: 'Mẫu & tiêu chuẩn hoàn thiện', en: 'Samples & finish standards' },
        description: {
          vi: 'Mẫu vật liệu, yêu cầu bề mặt, phụ kiện hoặc quy cách đóng gói.',
          en: 'Material samples, surface requirements, hardware or packing specifications.'
        }
      }
    ],
    primaryCta: { vi: 'Trao đổi hồ sơ dự án', en: 'Discuss project documents' },
    secondaryCta: { vi: 'Xem hành trình triển khai', en: 'See the delivery journey' }
  },
  journey: {
    eyebrow: { vi: 'Hệ thống thực thi', en: 'Delivery system' },
    title: {
      vi: 'Ba chặng chính, một luồng trách nhiệm',
      en: 'Three core stages, one line of responsibility'
    },
    description: {
      vi: 'Thiết kế kỹ thuật, sản xuất tại xưởng và thi công được kết nối thành một hành trình có thứ tự rõ ràng.',
      en: 'Technical development, workshop production and site contracting connect as one clearly ordered journey.'
    }
  },
  proof: {
    eyebrow: { vi: 'Bằng chứng vận hành', en: 'Operating proof' },
    title: {
      vi: 'Năng lực sản xuất phải nhìn thấy và kiểm tra được',
      en: 'Production capability should be visible and verifiable'
    },
    description: {
      vi: 'Xưởng sản xuất trực tiếp giúp vật liệu, kích thước và chất lượng hoàn thiện được đối chiếu trước khi chuyển ra công trình.',
      en: 'Direct production lets materials, dimensions and finish quality be checked before work moves to site.'
    },
    items: [
      {
        id: 'factory',
        label: { vi: 'Năng lực vận hành', en: 'Operating capacity' },
        title: { vi: 'Sản xuất theo quy mô dự án', en: 'Production organised around project scale' },
        description: {
          vi: 'Mặt bằng xưởng và hệ thống máy hỗ trợ tổ chức gia công theo hạng mục, module và giai đoạn giao hàng.',
          en: 'Workshop space and machinery support production by package, module and delivery stage.'
        }
      },
      {
        id: 'quality',
        label: { vi: 'Kiểm soát chất lượng', en: 'Quality control' },
        title: { vi: 'Kiểm soát tại nguồn', en: 'Control at the source' },
        description: {
          vi: 'Hồ sơ, vật liệu và chi tiết hoàn thiện được đối chiếu trong quá trình sản xuất trước khi giao lắp.',
          en: 'Documents, materials and finishing details are checked during production before delivery and installation.'
        }
      }
    ],
    cta: { vi: 'Xem năng lực nhà xưởng', en: 'Explore the factory capability' }
  },
  programmes: {
    eyebrow: { vi: 'Lĩnh vực & loại hình hợp tác', en: 'Sectors & engagement models' },
    title: {
      vi: 'Một hệ thống triển khai cho nhiều loại dự án',
      en: 'One delivery system for different project types'
    },
    description: {
      vi: 'Năng lực cốt lõi được tổ chức theo yêu cầu vận hành của khách sạn, không gian thương mại và đơn hàng gia công.',
      en: 'The core capability adapts to hospitality, commercial interiors and production-from-drawings orders.'
    }
  },
  contact: {
    eyebrow: { vi: 'Bắt đầu từ hồ sơ hiện có', en: 'Start with what you have' },
    title: {
      vi: 'Có bản vẽ hoặc BOQ? Cùng xác định phạm vi phù hợp',
      en: 'Have drawings or a BOQ? Let’s define the right scope'
    },
    description: {
      vi: 'Xem thông tin liên hệ hoặc gọi trực tiếp để trao đổi yêu cầu kỹ thuật, sản xuất và thi công của dự án.',
      en: 'View the contact details or call directly to discuss the project’s technical, production and installation requirements.'
    },
    primaryCta: { vi: 'Xem thông tin liên hệ', en: 'View contact details' },
    phoneCta: { vi: 'Gọi trực tiếp', en: 'Call directly' }
  }
} as const satisfies ServicesPageContent

export const servicesMediaAlt = {
  hero: {
    vi: 'Cầu thang và tiểu cảnh trong dự án nội thất Codi',
    en: 'Staircase and interior garden in the Codi interior project'
  },
  design: {
    vi: 'Không gian phòng điển hình trong dự án nội thất Codi Boutique Hotel',
    en: 'Typical guest room interior in the Codi Boutique Hotel project'
  },
  factory: {
    vi: 'Không gian sản xuất trực tiếp tại xưởng nội thất Lai Huy',
    en: 'The directly operated Lai Huy interior production workshop'
  },
  construction: {
    vi: 'Không gian nội thất hoàn thiện trong dự án Codi Boutique Hotel',
    en: 'Completed interior space in the Codi Boutique Hotel project'
  },
  quality: {
    vi: 'Hệ thống máy gia công trong xưởng nội thất Lai Huy',
    en: 'Production machinery inside the Lai Huy interior workshop'
  }
} as const satisfies Record<ServicesMediaKey, LocalizedText>
