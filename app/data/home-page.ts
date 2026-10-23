import type { LocalizedText } from '~/shared/types/localization'

export type HomeStoryStageId = 'existing' | 'drawing' | 'material' | 'space'
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
    eyebrow: { vi: 'Thiết kế · Sản xuất · Thi công', en: 'Design · Production · Fit-out' },
    title: { vi: 'Nội thất khách sạn và dự án, sản xuất tại xưởng của chính Lai Huy', en: 'Hotel and project interiors, made in our own factory' },
    description: {
      vi: 'Chủ đầu tư có một đầu mối từ thiết kế đến lắp đặt. Đơn vị thiết kế và tổng thầu có một xưởng sản xuất đúng bản vẽ, kèm bóc tách, BOQ sơ bộ và shop drawing. Lắp đặt trên toàn quốc.',
      en: 'Owners get one accountable team from design to installation. Designers and main contractors get a factory that builds to their drawings, with take-off, a preliminary BOQ and shop drawings. Installation nationwide.'
    },
    primaryCta: { vi: 'Nhận báo giá', en: 'Request a quote' },
    secondaryCta: { vi: 'Gửi bản vẽ, nhận BOQ sơ bộ', en: 'Send drawings for a preliminary BOQ' }
  },
  story: {
    eyebrow: { vi: 'Quy trình 6 bước, tóm trong 4 chặng', en: 'Our six-step process, in four stages' },
    title: { vi: 'Không chuyển tay giữa các nhà thầu', en: 'No hand-offs between contractors' },
    description: {
      vi: 'Cùng một đội chịu trách nhiệm từ lúc nhận bản vẽ, đo hiện trạng, sản xuất đến nghiệm thu tại công trình.',
      en: 'The same team is responsible from drawing intake and site measurement through production to sign-off on site.'
    }
  },
  capabilities: {
    eyebrow: { vi: 'Ba dịch vụ', en: 'Three services' },
    title: { vi: 'Thiết kế, sản xuất, thi công: một đội làm cả ba', en: 'Design, production, fit-out: one team does all three' }
  },
  projects: {
    eyebrow: { vi: 'Dự án tiêu biểu', en: 'Selected projects' },
    title: { vi: 'Ba dự án làm trọn từ thiết kế đến lắp đặt', en: 'Three projects designed, made and installed by Lai Huy' },
    allCta: { vi: 'Xem tất cả dự án', en: 'View all projects' },
    locationLabel: { vi: 'Địa điểm', en: 'Location' },
    scopeLabel: { vi: 'Phạm vi', en: 'Scope' },
    materialsLabel: { vi: 'Vật liệu chính', en: 'Main materials' },
    heroCta: { vi: 'Xem chi tiết dự án', en: 'View project' },
    cardCta: { vi: 'Xem chi tiết dự án', en: 'View project' }
  },
  factory: {
    eyebrow: { vi: 'Xưởng Vĩnh Long', en: 'Our Vinh Long factory' },
    title: { vi: 'Kiểm soát tại nguồn, trước khi ra công trình', en: 'Control at the source, before work reaches site' },
    description: {
      vi: 'Ván được cắt CNC, khoan, dán cạnh và ép ngay tại xưởng; vật liệu, kích thước và bề mặt được kiểm tra ở bốn điểm trước khi giao.',
      en: 'Panels are CNC-cut, bored, edge-banded and pressed in our own factory; materials, dimensions and surfaces are checked at four points before delivery.'
    }
  },
  cta: {
    eyebrow: { vi: 'Có bản vẽ?', en: 'Have drawings?' },
    title: { vi: 'Gửi bản vẽ, nhận BOQ sơ bộ và báo giá', en: 'Send your drawings for a preliminary BOQ and a quote' },
    description: {
      vi: 'Gửi bản vẽ PDF hoặc DWG tới noithatlaihuy@gmail.com. Đội kỹ thuật bóc tách khối lượng và lập BOQ sơ bộ. Báo giá trong 24 giờ làm việc kể từ khi nhận đủ bản vẽ hoặc thông tin dự án. Chưa có bản vẽ? Gọi 0903 102 012.',
      en: 'Email PDF or DWG drawings to noithatlaihuy@gmail.com. Our technical team does the take-off and prepares a preliminary BOQ. We quote within 24 working hours of receiving complete drawings or project details. No drawings yet? Call +84 903 102 012.'
    },
    primaryCta: { vi: 'Gửi bản vẽ, nhận BOQ sơ bộ', en: 'Send drawings for a preliminary BOQ' },
    secondaryCta: { vi: 'Xem năng lực nhà xưởng', en: 'View factory capability' }
  }
} as const

export const homeStoryStages: readonly HomeStoryStage[] = [
  {
    id: 'existing',
    label: { vi: 'Bước 01 · Tiếp nhận hồ sơ', en: 'Step 01 · Intake' },
    title: {
      vi: 'Đối chiếu bản vẽ với hiện trạng',
      en: 'Check the drawings against the site'
    },
    description: {
      vi: 'Bản vẽ, BOQ và tiêu chuẩn hoàn thiện được rà soát; khi cần, kích thước, cao độ, kết cấu và các vị trí chờ điện, nước, điều hòa (MEP) được đo tại công trình.',
      en: 'Drawings, BOQ and finish standards are reviewed; where needed, dimensions, levels, structure and MEP connections are measured on site.'
    }
  },
  {
    id: 'drawing',
    label: { vi: 'Bước 02 · Bóc tách kỹ thuật', en: 'Step 02 · Take-off' },
    title: { vi: 'Bóc tách trước khi cắt ván', en: 'Take-off before the first cut' },
    description: {
      vi: 'Bản vẽ được bóc tách thành BOQ (bảng khối lượng), danh mục vật tư và shop drawing (bản vẽ triển khai sản xuất); điểm giao cắt với các bộ môn khác được chốt ở bước này.',
      en: 'Drawings become a BOQ (bill of quantities), a material schedule and shop drawings (production drawings); interfaces with other trades are settled here.'
    }
  },
  {
    id: 'material',
    label: { vi: 'Bước 03–05 · Mẫu, sản xuất, QC', en: 'Steps 03–05 · Samples, production, QC' },
    title: { vi: 'Duyệt mẫu rồi mới sản xuất hàng loạt', en: 'Approve the sample, then produce in volume' },
    description: {
      vi: 'Màu, vân gỗ, phụ kiện và cấu tạo được duyệt trên mẫu; sau đó xưởng sản xuất theo module và kiểm tra trước khi đóng gói.',
      en: 'Colour, grain, hardware and construction are approved on a sample; the factory then produces in modules and inspects before packing.'
    }
  },
  {
    id: 'space',
    label: { vi: 'Bước 06 · Lắp đặt & bàn giao', en: 'Step 06 · Installation & handover' },
    title: { vi: 'Lắp đặt và nghiệm thu từng khu vực', en: 'Installed and signed off area by area' },
    description: {
      vi: 'Đội lắp đặt của Lai Huy lắp theo mặt bằng, phối hợp với các bộ môn tại công trình và nghiệm thu theo từng khu vực.',
      en: 'Lai Huy’s installation team works to the floor plan, coordinates with the other trades on site and signs off each area.'
    }
  }
]

export const homeCapabilities: readonly HomeCapability[] = [
  {
    id: 'technical',
    title: { vi: 'Thiết kế & triển khai kỹ thuật', en: 'Design & technical development' },
    description: {
      vi: 'Bóc tách, shop drawing và giải pháp cấu tạo được làm rõ trước khi sản xuất.',
      en: 'Take-off, shop drawings, and construction details are resolved before manufacturing.'
    }
  },
  {
    id: 'manufacturing',
    title: { vi: 'Sản xuất tại xưởng', en: 'In-house production' },
    description: {
      vi: 'Vật liệu, tiến độ và chất lượng hoàn thiện do chính xưởng Lai Huy tại Vĩnh Long kiểm soát.',
      en: 'Materials, schedule and finish quality are controlled in Lai Huy’s own factory in Vinh Long.'
    }
  },
  {
    id: 'fitout',
    title: { vi: 'Thi công & lắp đặt', en: 'Fit-out & installation' },
    description: {
      vi: 'Điều phối giao lắp, xử lý hiện trường và nghiệm thu theo từng khu vực dự án.',
      en: 'Delivery, site resolution, and sign-off are coordinated area by area.'
    }
  }
]
