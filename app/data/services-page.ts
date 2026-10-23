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

type ServicesMediaKey = 'hero' | 'design' | 'construction' | 'evidence' | ProofItem['id']

export type ServicesPageContent = {
  hero: {
    topic: LocalizedText
    title: LocalizedText
    specialTitle: LocalizedText
    subtitle: LocalizedText
    primaryCta: LocalizedText
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
    title: { vi: 'Ba dịch vụ,', en: 'Three services,' },
    specialTitle: { vi: 'một đầu mối', en: 'one accountable team' },
    subtitle: {
      vi: 'Thiết kế & triển khai kỹ thuật, sản xuất tại xưởng, thi công & lắp đặt: nhận trọn gói, hoặc chỉ sản xuất theo bản vẽ của bạn.',
      en: 'Design & technical development, in-house production, fit-out & installation: take the full package, or just production to your drawings.'
    },
    primaryCta: { vi: 'Nhận báo giá', en: 'Request a quote' }
  },
  documents: {
    eyebrow: { vi: 'Hồ sơ đầu vào', en: 'Starting documents' },
    title: {
      vi: 'Bắt đầu từ bản vẽ và yêu cầu bạn đang có',
      en: 'Start with the drawings and requirements you already have'
    },
    description: {
      vi: 'Lai Huy nhận hồ sơ ở mọi mức: từ mặt bằng hiện trạng và yêu cầu sử dụng đến bộ shop drawing hoàn chỉnh.',
      en: 'Lai Huy works from documents at any stage, from a site plan and a brief to a complete set of shop drawings.'
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
        title: { vi: 'Hồ sơ kỹ thuật & BOQ (bảng khối lượng)', en: 'Technical documents & BOQ (bill of quantities)' },
        description: {
          vi: 'Shop drawing (bản vẽ triển khai sản xuất), chi tiết cấu tạo hoặc phạm vi mời thầu. Chưa có BOQ thì Lai Huy lập BOQ sơ bộ từ bản vẽ.',
          en: 'Shop drawings (production drawings), construction details or tender scope. No BOQ yet? Lai Huy prepares a preliminary one from the drawings.'
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
    primaryCta: { vi: 'Gửi bản vẽ, nhận BOQ sơ bộ', en: 'Send drawings for a preliminary BOQ' },
    secondaryCta: { vi: 'Xem các bước triển khai', en: 'See how delivery works' }
  },
  journey: {
    eyebrow: { vi: 'Thứ tự triển khai', en: 'How delivery runs' },
    title: {
      vi: 'Ba dịch vụ, sáu bước',
      en: 'Three services, six steps'
    },
    description: {
      vi: 'Thiết kế & triển khai kỹ thuật gồm bước 01–02; sản xuất tại xưởng gồm điều phối, sản xuất và QC (bước 03–05); thi công & lắp đặt là bước 06.',
      en: 'Design & technical development covers steps 01–02; in-house production covers coordination, production and QC (steps 03–05); fit-out & installation is step 06.'
    }
  },
  proof: {
    eyebrow: { vi: 'Tại xưởng Vĩnh Long', en: 'At our Vinh Long factory' },
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
        label: { vi: 'Công suất', en: 'Capacity' },
        title: { vi: 'Đến 50 phòng khách sạn mỗi tháng', en: 'Up to 50 hotel rooms a month' },
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
          vi: 'Bốn điểm kiểm tra: vật tư đầu vào, đối chiếu bản vẽ, trong sản xuất và trước khi giao.',
          en: 'Four checkpoints: incoming materials, drawing cross-check, in production and before delivery.'
        }
      }
    ],
    cta: { vi: 'Xem năng lực nhà xưởng', en: 'View factory capability' }
  },
  programmes: {
    eyebrow: { vi: 'Lĩnh vực', en: 'Sectors' },
    title: {
      vi: 'Khách sạn, văn phòng và đơn hàng OEM',
      en: 'Hotels, offices and OEM orders'
    },
    description: {
      vi: 'Cùng ba dịch vụ trên, tổ chức theo cách vận hành của từng loại dự án.',
      en: 'The same three services, organised around how each type of project operates.'
    }
  },
  contact: {
    eyebrow: { vi: 'Bước tiếp theo', en: 'Next step' },
    title: {
      vi: 'Có bản vẽ? Gửi để nhận BOQ sơ bộ và báo giá',
      en: 'Have drawings? Send them for a preliminary BOQ and a quote'
    },
    description: {
      vi: 'Gửi bản vẽ PDF hoặc DWG qua email, hoặc gọi để trao đổi nếu dự án chưa có bản vẽ.',
      en: 'Email PDF or DWG drawings, or call to talk it through if there are no drawings yet.'
    },
    primaryCta: { vi: 'Gửi bản vẽ, nhận BOQ sơ bộ', en: 'Send drawings for a preliminary BOQ' },
    phoneCta: { vi: 'Gọi', en: 'Call' }
  }
} as const satisfies ServicesPageContent

export const servicesMediaAlt = {
  hero: {
    vi: 'Khách sạn Codi Boutique: cầu thang và tiểu cảnh ở sảnh đón',
    en: 'Codi Boutique Hotel: lobby staircase and planting'
  },
  design: {
    vi: 'Khách sạn Codi Boutique: phòng điển hình 1',
    en: 'Codi Boutique Hotel: typical room 1'
  },
  evidence: {
    vi: 'Khách sạn Codi Boutique: phòng điển hình 2',
    en: 'Codi Boutique Hotel: typical room 2'
  },
  factory: {
    vi: 'Không gian sản xuất trực tiếp tại xưởng nội thất Lai Huy',
    en: 'The directly operated Lai Huy interior production workshop'
  },
  construction: {
    vi: 'Khách sạn Codi Boutique: phòng điển hình 2, nội thất do Lai Huy sản xuất và lắp đặt',
    en: 'Codi Boutique Hotel: typical room 2, interiors made and installed by Lai Huy'
  },
  quality: {
    vi: 'Hệ thống máy gia công trong xưởng nội thất Lai Huy',
    en: 'Production machinery inside the Lai Huy interior workshop'
  }
} as const satisfies Record<ServicesMediaKey, LocalizedText>
