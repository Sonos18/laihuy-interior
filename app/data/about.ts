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
  year: LocalizedText
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
    title: { vi: 'Từ bản vẽ đến', en: 'From drawings to' },
    specialTitle: { vi: 'công trình hoàn thiện', en: 'finished interiors' },
    subtitle: {
      vi: 'Một đầu mối cho phát triển kỹ thuật, sản xuất tại xưởng, kiểm soát chất lượng và lắp dựng tại công trình.',
      en: 'One accountable partner for technical development, in-house production, quality control and on-site installation.'
    },
    primaryCta: { vi: 'Trao đổi hồ sơ dự án', en: 'Discuss your project documents' },
    secondaryCta: { vi: 'Xem dự án đã thực hiện', en: 'View delivered work' }
  },
  problem: {
    eyebrow: { vi: 'Bài toán của chủ đầu tư', en: 'The owner’s delivery challenge' },
    title: {
      vi: 'Một thiết kế đẹp chỉ có giá trị khi triển khai được',
      en: 'A good design creates value only when it can be delivered'
    },
    description: {
      vi: 'Giá trị của hồ sơ thiết kế được quyết định bởi khả năng chuyển thành sản phẩm, phối hợp tại hiện trường và nghiệm thu đúng yêu cầu.',
      en: 'The value of a design is decided by whether it can become a finished product, coordinate on site and pass the agreed sign-off.'
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
          en: 'Coordinate delivery, other trades and sign-off through each project stage.'
        }
      }
    ]
  },
  workflow: {
    eyebrow: { vi: 'Mô hình triển khai', en: 'Delivery model' },
    title: { vi: 'Sáu bước, một luồng trách nhiệm', en: 'Six stages, one line of responsibility' },
    description: {
      vi: 'Từ tiếp nhận bản vẽ và BOQ đến sản xuất, QC, lắp dựng và bàn giao, thông tin được chuyển tiếp trong một quy trình thống nhất.',
      en: 'From drawing and BOQ intake through production, QC, installation and handover, information moves through one coordinated process.'
    }
  },
  factory: {
    eyebrow: { vi: 'Năng lực nhìn thấy được', en: 'Capability you can see' },
    title: {
      vi: 'Xưởng, máy móc và tay nghề trong cùng một bằng chứng',
      en: 'Workshop, machinery and craft in one body of evidence'
    },
    description: {
      vi: 'Sản xuất trực tiếp giúp các quyết định về vật liệu, kỹ thuật và hoàn thiện được kiểm tra tại nguồn trước khi chuyển ra công trình.',
      en: 'Direct production lets material, technical and finishing decisions be checked at the source before work moves to site.'
    },
    cta: { vi: 'Xem đầy đủ năng lực nhà xưởng', en: 'Explore the full factory capability' }
  },
  projects: {
    eyebrow: { vi: 'Dự án tiêu biểu', en: 'Selected work' },
    title: { vi: 'Dự án nói thay năng lực', en: 'Delivered work is the evidence' },
    description: {
      vi: 'Hai quy mô khác nhau cho thấy cách Lai Huy giữ thiết kế, sản xuất và thi công trong cùng một phạm vi trách nhiệm.',
      en: 'Two different project scales show how Lai Huy keeps design, production and construction within one accountable scope.'
    },
    labels: {
      area: { vi: 'Diện tích', en: 'Area' },
      location: { vi: 'Địa điểm', en: 'Location' },
      year: { vi: 'Năm', en: 'Year' },
      view: { vi: 'Xem case study', en: 'View case study' }
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
        vi: 'Villa hoặc căn hộ cần kiểm soát chi tiết từ bản vẽ đến lắp dựng.',
        en: 'Villas or apartments requiring detail control from drawings through installation.'
      },
      {
        vi: 'Gia công theo bản vẽ, OEM hoặc đơn hàng cần tổ chức sản xuất rõ ràng.',
        en: 'Make-to-drawing, OEM or export-ready orders requiring a clear production system.'
      }
    ]
  },
  contact: {
    eyebrow: { vi: 'Bắt đầu từ hồ sơ hiện có', en: 'Start with what you have' },
    title: {
      vi: 'Trao đổi bản vẽ, BOQ hoặc yêu cầu dự án',
      en: 'Discuss your drawings, BOQ or project requirements'
    },
    description: {
      vi: 'Xem thông tin liên hệ hoặc gọi trực tiếp để trao đổi phạm vi sản xuất và thi công phù hợp.',
      en: 'View the contact details or call directly to discuss an appropriate production and installation scope.'
    },
    primaryCta: { vi: 'Xem thông tin liên hệ', en: 'View contact details' },
    phoneCta: { vi: 'Gọi trực tiếp', en: 'Call directly' }
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
