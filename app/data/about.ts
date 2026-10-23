import type { FactoryStat } from './factory'
import type { LocalizedText } from '~/shared/types/localization'

type SectionIntro = {
  eyebrow: LocalizedText
  title: LocalizedText
  description: LocalizedText
}

type AboutResponse = {
  id: 'technical' | 'factory-control' | 'site-coordination'
  title: LocalizedText
  description: LocalizedText
}

export type AboutProjectLabels = {
  area: LocalizedText
  location: LocalizedText
  view: LocalizedText
}

export type AboutPageContent = {
  hero: {
    topic: LocalizedText
    title: LocalizedText
    specialTitle: LocalizedText
    subtitle: LocalizedText
    primaryCta: LocalizedText
    secondaryCta: LocalizedText
  }
  problem: SectionIntro & {
    lead: LocalizedText
    responses: readonly AboutResponse[]
  }
  workflow: SectionIntro
  factory: SectionIntro & { cta: LocalizedText }
  projects: SectionIntro & { labels: AboutProjectLabels }
  fit: {
    eyebrow: LocalizedText
    title: LocalizedText
    items: readonly LocalizedText[]
  }
  contact: {
    eyebrow: LocalizedText
    title: LocalizedText
    description: LocalizedText
    primaryCta: LocalizedText
    phoneCta: LocalizedText
  }
}

export type AboutMediaKey = 'hero' | 'factory' | 'machinery' | 'craft'

export const aboutProofStatIds = [
  'footprint',
  'throughput',
  'end-to-end'
] as const satisfies readonly FactoryStat['id'][]

export const aboutProjectSlugs = [
  'khach-san-eo-gio',
  'codi-villa-phan-thiet'
] as const

export const aboutPageContent = {
  hero: {
    topic: { vi: 'Nhà thầu nội thất dự án', en: 'Project interior contractor' },
    title: { vi: 'Nhà thầu nội thất', en: 'An interior contractor' },
    specialTitle: { vi: 'có xưởng riêng', en: 'with its own factory' },
    subtitle: {
      vi: 'Lai Huy thiết kế, sản xuất tại xưởng ở Vĩnh Long, kiểm tra chất lượng và lắp đặt tại công trình cho khách sạn, villa, căn hộ và văn phòng.',
      en: 'Lai Huy designs, produces in its own Vinh Long factory, inspects and installs on site for hotels, villas, apartments and offices.'
    },
    primaryCta: { vi: 'Nhận báo giá', en: 'Request a quote' },
    secondaryCta: { vi: 'Xem tất cả dự án', en: 'View all projects' }
  },
  problem: {
    eyebrow: { vi: 'Bài toán của chủ đầu tư', en: 'The owner’s delivery challenge' },
    title: {
      vi: 'Bản vẽ đẹp chưa đủ: phải sản xuất được và lắp khớp hiện trạng',
      en: 'A good drawing is not enough: it has to be buildable and fit the site'
    },
    description: {
      vi: 'Hồ sơ thiết kế chỉ có giá trị khi sản xuất được, lắp khớp với công trình và nghiệm thu đúng yêu cầu.',
      en: 'A design is only worth what can be produced, fitted to the building and signed off as agreed.'
    },
    lead: {
      vi: 'Chủ đầu tư cần kiểm soát đồng thời chất lượng, tiến độ và tính nhất quán giữa bản vẽ với hiện trường.',
      en: 'Owners need quality, schedule and consistency between drawings and site conditions controlled at the same time.'
    },
    responses: [
      {
        id: 'technical',
        title: { vi: 'Phát triển kỹ thuật', en: 'Technical development' },
        description: {
          vi: 'Chuyển ý tưởng thiết kế thành hồ sơ có thể bóc tách, sản xuất và phối hợp.',
          en: 'Turn design intent into documents that can be taken off, produced and coordinated.'
        }
      },
      {
        id: 'factory-control',
        title: { vi: 'Kiểm soát tại nguồn', en: 'Control at the source' },
        description: {
          vi: 'Đối chiếu vật liệu, kích thước và chất lượng hoàn thiện ngay tại xưởng.',
          en: 'Check materials, dimensions and finishing quality directly at the workshop.'
        }
      },
      {
        id: 'site-coordination',
        title: { vi: 'Phối hợp hiện trường', en: 'Site coordination' },
        description: {
          vi: 'Tổ chức giao lắp, phối hợp bộ môn và nghiệm thu theo từng giai đoạn.',
          en: 'Coordinate delivery, installation, other trades and sign-off at each project stage.'
        }
      }
    ]
  },
  workflow: {
    eyebrow: { vi: 'Quy trình 6 bước', en: 'Our six-step process' },
    title: { vi: 'Sáu bước từ bản vẽ đến bàn giao', en: 'Six steps from drawings to handover' },
    description: {
      vi: 'Từ tiếp nhận bản vẽ và BOQ đến sản xuất, QC, lắp đặt và bàn giao, cùng một đội nắm thông tin xuyên suốt.',
      en: 'From drawing and BOQ intake through production, QC, installation and handover, the same team holds the information throughout.'
    }
  },
  factory: {
    eyebrow: { vi: 'Nhà xưởng', en: 'The factory' },
    title: {
      vi: 'Xưởng, máy và thợ của chính Lai Huy',
      en: 'Our own workshop, machines and craftspeople'
    },
    description: {
      vi: 'Sản xuất trực tiếp giúp các quyết định về vật liệu, kỹ thuật và hoàn thiện được kiểm tra tại nguồn trước khi chuyển ra công trình.',
      en: 'Direct production lets material, technical and finishing decisions be checked at the source before work moves to site.'
    },
    cta: { vi: 'Xem năng lực nhà xưởng', en: 'View factory capability' }
  },
  projects: {
    eyebrow: { vi: 'Dự án tiêu biểu', en: 'Selected work' },
    title: { vi: 'Hai dự án, hai quy mô', en: 'Two projects, two scales' },
    description: {
      vi: 'Khách sạn Eo Gió (1.670 m², 44–45 phòng) và Codi Villa Phan Thiết (bốn căn, 20–25 phòng): cả hai do Lai Huy thiết kế, sản xuất và thi công.',
      en: 'Eo Gio Hotel (1,670 m², 44–45 rooms) and Codi Villa, Phan Thiet (four villas, 20–25 rooms): both designed, produced and fitted out by Lai Huy.'
    },
    labels: {
      area: { vi: 'Diện tích', en: 'Area' },
      location: { vi: 'Địa điểm', en: 'Location' },
      view: { vi: 'Xem chi tiết dự án', en: 'View project' }
    }
  },
  fit: {
    eyebrow: { vi: 'Dự án phù hợp', en: 'Project fit' },
    title: { vi: 'Lai Huy phù hợp khi dự án cần…', en: 'Lai Huy is a fit when the project needs…' },
    items: [
      {
        vi: 'Nội thất khách sạn và lưu trú với nhiều loại phòng cần đồng bộ.',
        en: 'Hospitality interiors with multiple room types that need consistent delivery.'
      },
      {
        vi: 'Villa hoặc căn hộ cần kiểm soát chi tiết từ bản vẽ đến lắp đặt.',
        en: 'Villas or apartments requiring detail control from drawings through installation.'
      },
      {
        vi: 'Gia công theo bản vẽ hoặc OEM (sản xuất theo thiết kế và tiêu chuẩn của bên đặt hàng), kể cả đơn hàng xuất khẩu.',
        en: 'Make-to-drawing or OEM production (made to the buyer’s design and specification), including export orders.'
      }
    ]
  },
  contact: {
    eyebrow: { vi: 'Bước tiếp theo', en: 'Next step' },
    title: {
      vi: 'Có bản vẽ hay mới có ý tưởng, đều có thể bắt đầu',
      en: 'Drawings or just an idea: either is a place to start'
    },
    description: {
      vi: 'Gửi bản vẽ để nhận BOQ sơ bộ và báo giá, hoặc gọi để trao đổi phạm vi khi dự án chưa có bản vẽ.',
      en: 'Send drawings for a preliminary BOQ and a quote, or call to talk through the scope if there are no drawings yet.'
    },
    primaryCta: { vi: 'Nhận báo giá', en: 'Request a quote' },
    phoneCta: { vi: 'Gọi', en: 'Call' }
  }
} as const satisfies AboutPageContent

export const aboutMediaAlt: Record<AboutMediaKey, LocalizedText> = {
  hero: {
    vi: 'Toàn cảnh xưởng sản xuất nội thất Lai Huy',
    en: 'Inside the Lai Huy interior manufacturing workshop'
  },
  factory: {
    vi: 'Không gian xưởng sản xuất trực tiếp của Lai Huy',
    en: 'The directly operated Lai Huy production workshop'
  },
  machinery: {
    vi: 'Máy CNC nesting đang vận hành trong xưởng Lai Huy',
    en: 'A CNC nesting router operating in the Lai Huy workshop'
  },
  craft: {
    vi: 'Đội ngũ thợ Lai Huy hoàn thiện sản phẩm nội thất tại xưởng',
    en: 'Lai Huy craftspeople finishing interior work in the workshop'
  }
}
