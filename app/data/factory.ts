import type { LocalizedText } from '~/shared/types/localization'

export type Capability = {
  label: LocalizedText
  value: LocalizedText
  description: LocalizedText
}

export type MachinerySectionContent = {
  titleLead: LocalizedText
  titleAccent: LocalizedText
  description: LocalizedText
  photoCaption: LocalizedText
  lineCaption: LocalizedText
}

export type MachineryProcessGroup = {
  id: string
  title: LocalizedText
  benefit: LocalizedText
  machines: readonly LocalizedText[]
}

export type ProductionStep = {
  title: LocalizedText
  description: LocalizedText
}

export const factoryCapabilities: Capability[] = [
  {
    label: { vi: 'Hệ thống nhà xưởng & kho', en: 'Workshop & warehouse' },
    value: { vi: '3.000 m²', en: '3,000 m²' },
    description: {
      vi: 'Không gian sản xuất trực tiếp cho đồ gỗ công nghiệp, hệ tủ và hạng mục nội thất dự án.',
      en: 'Direct production space for panel furniture, cabinetry systems and project interior packages.'
    }
  },
  {
    label: { vi: 'Năng lực sản xuất & thi công', en: 'Production & installation capacity' },
    value: { vi: 'Lên đến 50 phòng khách sạn/tháng', en: 'Up to 50 hotel rooms/month' },
    description: {
      vi: 'Phù hợp các dự án khách sạn, căn hộ dịch vụ và villa cần tiến độ sản xuất ổn định.',
      en: 'Suited to hotel, serviced-apartment and villa projects that need a steady production schedule.'
    }
  },
  {
    label: { vi: 'Đội ngũ triển khai dự án', en: 'Project delivery team' },
    value: { vi: 'Sản xuất, thiết kế và thi công', en: 'Design, production & contracting' },
    description: {
      vi: 'Phối hợp xuyên suốt từ bóc tách bản vẽ, sản xuất, kiểm soát chất lượng đến thi công thực tế tại công trình.',
      en: 'End-to-end coordination from drawing take-off and production through quality control to on-site installation.'
    }
  },
  {
    label: { vi: 'Thị trường', en: 'Markets' },
    value: { vi: 'Trong nước và xuất khẩu', en: 'Domestic & export' },
    description: {
      vi: 'Khách sạn, resort, căn hộ cao cấp và đơn hàng xuất khẩu theo yêu cầu.',
      en: 'Hotels, resorts, premium apartments and made-to-order export orders.'
    }
  }
]

export const machinerySectionContent: MachinerySectionContent = {
  titleLead: {
    vi: 'Hệ thống máy phục vụ sản xuất',
    en: 'Machinery system for'
  },
  titleAccent: {
    vi: 'nội thất dự án',
    en: 'project interior manufacturing'
  },
  description: {
    vi: 'Xưởng ứng dụng hệ thống máy đồng bộ theo bốn công đoạn chính, giúp kiểm soát độ chính xác, chất lượng bề mặt và tiến độ cho các dự án khách sạn, villa và căn hộ cao cấp.',
    en: 'The workshop uses a coordinated machinery line across four core stages, controlling precision, surface quality, and schedule for hotel, villa, and premium apartment projects.'
  },
  photoCaption: {
    vi: 'Hình ảnh thực tế tại xưởng',
    en: 'Real workshop photograph'
  },
  lineCaption: {
    vi: 'Hệ thống máy sản xuất',
    en: 'Production machinery line'
  }
}

export const machineryProcessGroups: readonly MachineryProcessGroup[] = [
  {
    id: 'cutting-shaping',
    title: { vi: 'Cắt & tạo hình', en: 'Cutting & shaping' },
    benefit: {
      vi: 'Cắt và tạo hình chi tiết theo hồ sơ kỹ thuật, tối ưu vật liệu và giữ kích thước đồng nhất.',
      en: 'Cuts and shapes components to the technical documents, optimising material and dimensional consistency.'
    },
    machines: [
      { vi: 'CNC Nesting', en: 'CNC nesting router' },
      { vi: 'Cưa bàn trượt', en: 'Sliding table saw' }
    ]
  },
  {
    id: 'boring-connections',
    title: { vi: 'Khoan & liên kết', en: 'Boring & connections' },
    benefit: {
      vi: 'Gia công chính xác lỗ liên kết và vị trí phụ kiện, giúp lắp ráp nhanh và đồng bộ.',
      en: 'Machines connector holes and hardware positions precisely for faster, consistent assembly.'
    },
    machines: [
      { vi: 'Máy khoan liên kết CNC', en: 'CNC boring machine' }
    ]
  },
  {
    id: 'edge-finishing',
    title: { vi: 'Dán cạnh & hoàn thiện', en: 'Edge banding & finishing' },
    benefit: {
      vi: 'Hoàn thiện cạnh ván đồng đều, tăng độ bền, thẩm mỹ và độ ổn định của sản phẩm.',
      en: 'Finishes board edges uniformly to improve durability, appearance and product stability.'
    },
    machines: [
      { vi: 'Máy dán cạnh tự động', en: 'Automatic edge bander' }
    ]
  },
  {
    id: 'surface-pressing',
    title: { vi: 'Xử lý bề mặt & ép', en: 'Surface treatment & pressing' },
    benefit: {
      vi: 'Kiểm soát độ phẳng, độ mịn và liên kết vật liệu trước khi chuyển sang hoàn thiện.',
      en: 'Controls surface flatness, smoothness and material bonding before final finishing.'
    },
    machines: [
      { vi: 'Máy bào cuốn', en: 'Thickness planer' },
      { vi: 'Máy chà nhám thùng', en: 'Wide-belt sander' },
      { vi: 'Máy ép nguội thủy lực', en: 'Hydraulic cold press' }
    ]
  }
]

export const productionWorkflow: ProductionStep[] = [
  {
    title: { vi: 'Tiếp nhận bản vẽ & BOQ', en: 'Drawing & BOQ intake' },
    description: {
      vi: 'Rà soát hồ sơ, phạm vi công việc, vật liệu, tiến độ và tiêu chuẩn hoàn thiện trước khi triển khai.',
      en: 'Documents, scope of work, materials, schedule and finish standards are reviewed before anything moves.'
    }
  },
  {
    title: { vi: 'Bóc tách kỹ thuật', en: 'Technical take-off' },
    description: {
      vi: 'Chuyển đổi bản vẽ thiết kế thành hồ sơ sản xuất, danh mục vật tư và kế hoạch triển khai.',
      en: 'Design drawings are converted into production documents, material schedules and an execution plan.'
    }
  },
  {
    title: { vi: 'Điều phối dự án', en: 'Project coordination' },
    description: {
      vi: 'Theo dõi tiến độ sản xuất, giao hàng và phối hợp thi công theo từng giai đoạn dự án.',
      en: 'Production progress, deliveries and installation are tracked and coordinated stage by stage.'
    }
  },
  {
    title: { vi: 'Sản xuất tại xưởng', en: 'In-house production' },
    description: {
      vi: 'Sản xuất module nội thất theo hồ sơ kỹ thuật, kiểm soát kích thước, vật liệu và chất lượng hoàn thiện.',
      en: 'Interior modules are produced to the technical documents, with dimensions, materials and finish quality controlled.'
    }
  },
  {
    title: { vi: 'QC trước khi giao hàng', en: 'Pre-delivery QC' },
    description: {
      vi: 'Kiểm tra kích thước, bề mặt, phụ kiện và phân loại theo từng khu vực trước khi giao hàng.',
      en: 'Dimensions, surfaces and hardware are checked, and packages sorted by area, before shipping.'
    }
  },
  {
    title: { vi: 'Thi công tại công trình', en: 'On-site installation' },
    description: {
      vi: 'Đội lắp dựng triển khai theo mặt bằng, phối hợp với các bộ môn và xử lý nghiệm thu.',
      en: 'Installation teams work to the floor plan, coordinate with the other trades and handle sign-off.'
    }
  }
]

export type FactoryStat = {
  id: 'footprint' | 'throughput' | 'end-to-end' | 'reach'
  icon: string
  value: LocalizedText
  label: LocalizedText
}

export type FactoryPillar = {
  id: 'direct-factory' | 'machinery' | 'craft' | 'quality'
  icon: string
  title: LocalizedText
  description: LocalizedText
}

export type FactoryAudience = {
  id: 'owners' | 'design-contractors'
  title: LocalizedText
  points: readonly LocalizedText[]
}

export type FactoryFaq = {
  id: 'lead-time' | 'make-to-drawing' | 'materials-quality' | 'nationwide-installation'
  question: LocalizedText
  answer: LocalizedText
}

export type FactoryMediaKey = 'hero' | 'facade' | 'process' | 'people' | 'visit'

export type FactoryPageContent = {
  hero: {
    topic: LocalizedText
    title: LocalizedText
    specialTitle: LocalizedText
    subtitle: LocalizedText
    primaryCta: LocalizedText
    secondaryCta: LocalizedText
  }
  pillars: { eyebrow: LocalizedText, title: LocalizedText, description: LocalizedText }
  process: { eyebrow: LocalizedText, title: LocalizedText, description: LocalizedText }
  peopleQuality: { eyebrow: LocalizedText, title: LocalizedText, description: LocalizedText }
  audiences: { eyebrow: LocalizedText, title: LocalizedText, description: LocalizedText }
  faq: { eyebrow: LocalizedText, title: LocalizedText }
  visit: {
    eyebrow: LocalizedText
    title: LocalizedText
    description: LocalizedText
    phoneCta: LocalizedText
    mapCta: LocalizedText
  }
}

export const factoryPageContent: FactoryPageContent = {
  hero: {
    topic: { vi: 'Năng lực nhà xưởng', en: 'Factory capability' },
    title: { vi: 'Sản xuất trực tiếp.', en: 'Direct manufacturing.' },
    specialTitle: { vi: 'Kiểm soát đến cùng.', en: 'Controlled end to end.' },
    subtitle: {
      vi: 'Xưởng 3.000 m², hệ thống máy đồng bộ và quy trình QC phục vụ nội thất khách sạn, villa, căn hộ và sản xuất theo bản vẽ.',
      en: 'A 3,000 m² workshop, coordinated machinery and quality control for hotels, villas, apartments and make-to-drawing production.'
    },
    primaryCta: { vi: 'Đặt lịch tham quan', en: 'Arrange a factory visit' },
    secondaryCta: { vi: 'Xem năng lực', en: 'View our capability' }
  },
  pillars: {
    eyebrow: { vi: 'Năng lực tại nguồn', en: 'Capability at the source' },
    title: { vi: 'Bốn nền tảng để dự án đi đúng kế hoạch', en: 'Four foundations for dependable delivery' },
    description: {
      vi: 'Mỗi nền tảng trả lời một câu hỏi thực tế về chất lượng, tiến độ và khả năng phối hợp.',
      en: 'Each foundation answers a practical question about quality, schedule and coordination.'
    }
  },
  process: {
    eyebrow: { vi: 'Hệ thống sản xuất', en: 'Production system' },
    title: { vi: 'Bốn công đoạn, một dòng kiểm soát', en: 'Four stages, one controlled line' },
    description: {
      vi: 'Máy móc được tổ chức theo dòng công việc để giữ kích thước, bề mặt và tiến độ ổn định.',
      en: 'Machinery is organised as one workflow to keep dimensions, surfaces and schedule consistent.'
    }
  },
  peopleQuality: {
    eyebrow: { vi: 'Con người & chất lượng', en: 'People & quality' },
    title: { vi: 'Máy tạo độ lặp lại. Con người bảo đảm kết quả.', en: 'Machines create consistency. People secure the result.' },
    description: {
      vi: 'Thợ và kỹ thuật viên theo sát từ vật tư đầu vào đến nghiệm thu trước giao lắp.',
      en: 'Craftspeople and technicians follow the work from incoming materials to pre-installation sign-off.'
    }
  },
  audiences: {
    eyebrow: { vi: 'Đối tác phù hợp', en: 'Built for project partners' },
    title: { vi: 'Một năng lực, hai góc nhìn ra quyết định', en: 'One capability, two decision perspectives' },
    description: {
      vi: 'Thông tin được trình bày theo điều chủ đầu tư và đối tác triển khai cần kiểm chứng.',
      en: 'The same capability is framed around what owners and delivery partners need to verify.'
    }
  },
  faq: {
    eyebrow: { vi: 'Thông tin trước khi trao đổi', en: 'Before we talk' },
    title: { vi: 'Bốn câu hỏi thường gặp', en: 'Four common questions' }
  },
  visit: {
    eyebrow: { vi: 'Tham quan nhà xưởng', en: 'Factory visit' },
    title: { vi: 'Đến xem năng lực thực tế', en: 'See the capability first-hand' },
    description: {
      vi: 'Gọi trước để Lai Huy sắp xếp người phụ trách và chuẩn bị nội dung phù hợp với dự án của bạn.',
      en: 'Call ahead so Lai Huy can arrange the right host and prepare around your project needs.'
    },
    phoneCta: { vi: 'Gọi đặt lịch', en: 'Call to arrange' },
    mapCta: { vi: 'Mở bản đồ', en: 'Open map' }
  }
}

export const factoryStats: readonly FactoryStat[] = [
  { id: 'footprint', icon: 'i-lucide-warehouse', value: { vi: '3.000 m²', en: '3,000 m²' }, label: { vi: 'Xưởng & kho', en: 'Workshop & warehouse' } },
  { id: 'throughput', icon: 'i-lucide-gauge', value: { vi: 'Đến 50', en: 'Up to 50' }, label: { vi: 'Phòng / tháng', en: 'Rooms / month' } },
  { id: 'end-to-end', icon: 'i-lucide-workflow', value: { vi: 'Trọn gói', en: 'End-to-end' }, label: { vi: 'Thiết kế → lắp đặt', en: 'Design → install' } },
  { id: 'reach', icon: 'i-lucide-globe', value: { vi: 'Toàn quốc', en: 'Nationwide' }, label: { vi: 'Giao lắp & xuất khẩu', en: 'Delivery & export' } }
]

export const factoryPillars: readonly FactoryPillar[] = [
  { id: 'direct-factory', icon: 'i-lucide-factory', title: { vi: 'Xưởng sản xuất trực tiếp', en: 'Directly operated factory' }, description: { vi: 'Chủ động vật liệu, tiến độ và xử lý kỹ thuật ngay tại nguồn.', en: 'Materials, schedule and technical resolution controlled at the source.' } },
  { id: 'machinery', icon: 'i-lucide-cpu', title: { vi: 'Hệ thống máy đồng bộ', en: 'Coordinated machinery' }, description: { vi: 'Các công đoạn nối tiếp giúp kích thước và bề mặt ổn định trên số lượng lớn.', en: 'Connected stages keep dimensions and surfaces consistent at project scale.' } },
  { id: 'craft', icon: 'i-lucide-hard-hat', title: { vi: 'Đội ngũ tay nghề', en: 'Skilled project team' }, description: { vi: 'Thợ và kỹ thuật viên phối hợp từ shop drawing đến hoàn thiện tại công trình.', en: 'Craftspeople and technicians coordinate from shop drawings to site finishing.' } },
  { id: 'quality', icon: 'i-lucide-shield-check', title: { vi: 'Kiểm soát chất lượng', en: 'Quality control' }, description: { vi: 'Vật tư, gia công và thành phẩm được đối chiếu theo hồ sơ dự án.', en: 'Materials, machining and finished work are checked against project documents.' } }
]

export const factoryAudiences: readonly FactoryAudience[] = [
  { id: 'owners', title: { vi: 'Dành cho chủ đầu tư', en: 'For project owners' }, points: [{ vi: 'Kiểm soát chất lượng và tiến độ tại nguồn', en: 'Quality and schedule controlled at the source' }, { vi: 'Một đầu mối từ thiết kế đến lắp đặt', en: 'One accountable team from design to installation' }, { vi: 'Năng lực ổn định cho dự án nhiều phòng', en: 'Steady capacity for multi-room projects' }] },
  { id: 'design-contractors', title: { vi: 'Dành cho thiết kế & tổng thầu', en: 'For designers & main contractors' }, points: [{ vi: 'Sản xuất theo hồ sơ, bản vẽ riêng và OEM', en: 'Make-to-drawing and OEM production' }, { vi: 'Hỗ trợ bóc tách và triển khai shop drawing', en: 'Technical take-off and shop-drawing support' }, { vi: 'Giao lắp toàn quốc và nhận đơn xuất khẩu', en: 'Nationwide installation and export orders' }] }
]

export const factoryFaqs: readonly FactoryFaq[] = [
  { id: 'lead-time', question: { vi: 'Thời gian sản xuất mất bao lâu?', en: 'How long does production take?' }, answer: { vi: 'Tiến độ phụ thuộc quy mô, vật liệu và hồ sơ kỹ thuật. Năng lực xưởng đạt đến khoảng 50 phòng khách sạn mỗi tháng; lịch cụ thể được xác nhận sau khi rà soát bản vẽ và BOQ.', en: 'Timing depends on scale, materials and technical documents. Workshop capacity reaches about 50 hotel rooms per month; the exact programme is confirmed after drawings and BOQ review.' } },
  { id: 'make-to-drawing', question: { vi: 'Lai Huy có nhận sản xuất theo thiết kế hoặc bản vẽ riêng không?', en: 'Can Lai Huy manufacture to our own design or drawings?' }, answer: { vi: 'Có. Lai Huy nhận gia công theo bản vẽ/OEM và có thể bóc tách, triển khai shop drawing cần thiết trước khi đưa vào sản xuất.', en: 'Yes. Lai Huy provides make-to-drawing/OEM production and can prepare the technical take-off and shop drawings needed before manufacturing.' } },
  { id: 'materials-quality', question: { vi: 'Vật liệu và chất lượng được kiểm soát như thế nào?', en: 'How are materials and quality controlled?' }, answer: { vi: 'Vật tư được kiểm tra theo chủng loại, màu sắc và tiêu chuẩn dự án; kích thước, cạnh, bề mặt và phụ kiện được đối chiếu trong sản xuất và trước khi đóng gói.', en: 'Materials are checked for type, colour and project standard; dimensions, edges, surfaces and hardware are verified during production and before packing.' } },
  { id: 'nationwide-installation', question: { vi: 'Lai Huy có giao lắp toàn quốc không?', en: 'Does Lai Huy install nationwide?' }, answer: { vi: 'Có. Đội thi công triển khai tại công trình trên toàn quốc; xưởng đồng thời nhận các đơn hàng gia công xuất khẩu theo phạm vi thống nhất.', en: 'Yes. Installation teams work at project sites nationwide, and the factory also accepts export production orders within an agreed scope.' } }
]

export const factoryMediaAlt: Record<FactoryMediaKey, LocalizedText> = {
  hero: { vi: 'Toàn cảnh bên trong xưởng sản xuất nội thất Lai Huy', en: 'Interior view of the Lai Huy furniture workshop' },
  facade: { vi: 'Biển hiệu nhà xưởng Lai Huy Interior', en: 'Lai Huy Interior workshop signage' },
  process: { vi: 'Toàn cảnh hệ thống máy sản xuất tại xưởng Lai Huy', en: 'Overview of the production machinery inside the Lai Huy workshop' },
  people: { vi: 'Đội ngũ thợ Lai Huy đang làm việc tại xưởng', en: 'Lai Huy craftspeople working on the factory floor' },
  visit: { vi: 'Mặt tiền và địa chỉ nhà xưởng Lai Huy', en: 'Lai Huy workshop facade and address' }
}

export const qualityControl: readonly LocalizedText[] = [
  {
    vi: 'Kiểm tra vật tư đầu vào theo chủng loại, màu sắc và tiêu chuẩn dự án',
    en: 'Incoming materials checked against type, colour and project standards'
  },
  {
    vi: 'Đối chiếu hồ sơ, shop drawing và kích thước gia công',
    en: 'Documents, shop drawings and machined dimensions cross-checked'
  },
  {
    vi: 'Kiểm tra cạnh, bề mặt, phụ kiện và độ hoàn thiện trong sản xuất',
    en: 'Edges, surfaces, hardware and finish inspected during production'
  },
  {
    vi: 'Nghiệm thu, phân loại và kiểm tra lần cuối trước giao lắp',
    en: 'Final sign-off, sorting and inspection before delivery and installation'
  }
]
