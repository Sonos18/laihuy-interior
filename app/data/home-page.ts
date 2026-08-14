import type { LocalizedText } from '~/shared/types/localization'

export type HomeStoryStageId = 'drawing' | 'material' | 'factory' | 'space'
export type HomeCapabilityId = 'technical' | 'manufacturing' | 'fitout'

export type HomeStoryStage = {
  id: HomeStoryStageId
  label: LocalizedText
  title: LocalizedText
  description: LocalizedText
}

export type HomeCapability = {
  id: HomeCapabilityId
  title: LocalizedText
  description: LocalizedText
}

export const homePageContent = {
  hero: {
    eyebrow: { vi: 'Thiết kế · Sản xuất · Thi công', en: 'Design · Manufacture · Fit-out' },
    title: { vi: 'Biến hồ sơ kỹ thuật thành không gian hoàn thiện', en: 'Turning technical documents into completed spaces' },
    accent: { vi: 'Nội thất dự án, được kiểm soát từ xưởng.', en: 'Project interiors, controlled from our own factory.' },
    description: {
      vi: 'Lai Huy đồng hành cùng chủ đầu tư và tổng thầu từ bóc tách bản vẽ, vật liệu, sản xuất đến lắp đặt tại công trình.',
      en: 'Lai Huy works with owners and main contractors from drawing take-off and materials through manufacturing and on-site installation.'
    },
    primaryCta: { vi: 'Xem dự án tiêu biểu', en: 'View selected work' },
    secondaryCta: { vi: 'Gửi hồ sơ dự án', en: 'Send project documents' }
  },
  story: {
    eyebrow: { vi: 'Một hành trình, một đầu mối', en: 'One journey, one accountable team' },
    title: { vi: 'Từ hồ sơ kỹ thuật đến không gian hoàn thiện', en: 'From technical documentation to completed space' },
    description: {
      vi: 'Mỗi chuyển động trên trang là một bước thật trong cách Lai Huy kiểm soát dự án: làm rõ hồ sơ, chốt vật liệu, sản xuất trực tiếp và hoàn thiện tại công trình.',
      en: 'Each movement reflects a real control point in Lai Huy’s delivery: clarify documents, confirm materials, manufacture directly, and complete the work on site.'
    }
  },
  capabilities: {
    eyebrow: { vi: 'Ba năng lực cốt lõi', en: 'Three core capabilities' },
    title: { vi: 'Một hệ thống chịu trách nhiệm đến cùng', en: 'One system accountable through completion' }
  },
  projects: {
    eyebrow: { vi: 'Công trình tiêu biểu', en: 'Selected work' },
    title: { vi: 'Không gian đã đi qua toàn bộ quy trình', en: 'Spaces delivered through the complete process' },
    allCta: { vi: 'Xem toàn bộ dự án', en: 'View all projects' }
  },
  factory: {
    eyebrow: { vi: 'Năng lực sản xuất trực tiếp', en: 'Direct production capability' },
    title: { vi: 'Kiểm soát tại nguồn, trước khi ra công trình', en: 'Control at the source, before work reaches site' },
    description: {
      vi: 'Xưởng trực tiếp, hệ thống máy đồng bộ và đội ngũ kỹ thuật giúp vật liệu, kích thước, bề mặt và tiến độ được kiểm tra xuyên suốt.',
      en: 'An own factory, coordinated machinery, and technical teams keep materials, dimensions, finishes, and schedule under continuous control.'
    }
  },
  process: {
    eyebrow: { vi: 'Phương pháp triển khai', en: 'Delivery method' },
    title: { vi: 'Sáu điểm kiểm soát từ hồ sơ đến nghiệm thu', en: 'Six control points from documents to sign-off' },
    cta: { vi: 'Xem đầy đủ quy trình triển khai', en: 'View our complete project workflow' }
  },
  cta: {
    eyebrow: { vi: 'Bắt đầu bằng hồ sơ của bạn', en: 'Start with your project documents' },
    title: { vi: 'Gửi bản vẽ để cùng làm rõ vật liệu, tiến độ và phạm vi thi công', en: 'Send your drawings to clarify materials, schedule, and contracting scope' },
    description: {
      vi: 'Đội ngũ kỹ thuật sẽ rà soát thông tin và trao đổi phương án phù hợp trước khi xác lập báo giá hoặc kế hoạch triển khai.',
      en: 'Our technical team will review the information and discuss a suitable approach before any quotation or delivery plan is established.'
    },
    primaryCta: { vi: 'Gửi hồ sơ dự án', en: 'Send project documents' },
    secondaryCta: { vi: 'Xem năng lực nhà xưởng', en: 'View factory capability' }
  }
} as const

export const homeStoryStages: readonly HomeStoryStage[] = [
  {
    id: 'drawing',
    label: { vi: 'Hồ sơ kỹ thuật', en: 'Technical documents' },
    title: { vi: 'Đọc đúng trước khi làm', en: 'Read it right before making' },
    description: {
      vi: 'Bản vẽ, BOQ, tiêu chuẩn hoàn thiện và giao diện các bộ môn được rà soát để khóa phạm vi ngay từ đầu.',
      en: 'Drawings, BOQ, finish standards, and trade interfaces are reviewed to define the scope from the outset.'
    }
  },
  {
    id: 'material',
    label: { vi: 'Vật liệu & mẫu', en: 'Materials & samples' },
    title: { vi: 'Chạm vào quyết định thiết kế', en: 'Make the design decision tangible' },
    description: {
      vi: 'Màu sắc, vân gỗ, phụ kiện và cấu tạo được đối chiếu trên mẫu trước khi sản xuất số lượng.',
      en: 'Colour, grain, hardware, and construction are checked on samples before volume production.'
    }
  },
  {
    id: 'factory',
    label: { vi: 'Sản xuất trực tiếp', en: 'Direct manufacturing' },
    title: { vi: 'Kiểm soát tại nguồn', en: 'Control at the source' },
    description: {
      vi: 'Kích thước, cạnh, bề mặt và tiến độ được kiểm tra liên tục trên dây chuyền xưởng.',
      en: 'Dimensions, edges, surfaces, and schedule are checked continuously through the workshop line.'
    }
  },
  {
    id: 'space',
    label: { vi: 'Không gian hoàn thiện', en: 'Completed space' },
    title: { vi: 'Bản vẽ trở thành trải nghiệm', en: 'The drawing becomes an experience' },
    description: {
      vi: 'Các module được lắp đặt, phối hợp hiện trường và nghiệm thu để giữ đúng ý đồ đến chi tiết cuối cùng.',
      en: 'Modules are installed, coordinated on site, and signed off so the intent survives through the final detail.'
    }
  }
]

export const homeCapabilities: readonly HomeCapability[] = [
  {
    id: 'technical',
    title: { vi: 'Thiết kế kỹ thuật', en: 'Technical design' },
    description: {
      vi: 'Bóc tách, shop drawing và giải pháp cấu tạo được làm rõ trước khi sản xuất.',
      en: 'Take-off, shop drawings, and construction details are resolved before manufacturing.'
    }
  },
  {
    id: 'manufacturing',
    title: { vi: 'Sản xuất trực tiếp', en: 'Direct manufacturing' },
    description: {
      vi: 'Chủ động vật liệu, tiến độ và chất lượng hoàn thiện tại xưởng của Lai Huy.',
      en: 'Materials, schedule, and finish quality are controlled in Lai Huy’s own workshop.'
    }
  },
  {
    id: 'fitout',
    title: { vi: 'Thi công & bàn giao', en: 'Fit-out & handover' },
    description: {
      vi: 'Điều phối giao lắp, xử lý hiện trường và nghiệm thu theo từng khu vực dự án.',
      en: 'Delivery, site resolution, and sign-off are coordinated area by area.'
    }
  }
]
