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

export const qualityControl: LocalizedText[] = [
  {
    vi: 'Kiểm tra vật liệu đầu vào theo chủng loại, màu sắc và tiêu chuẩn dự án',
    en: 'Incoming materials checked against type, colour and project standards'
  },
  {
    vi: 'Đối chiếu kích thước sau gia công với bản vẽ sản xuất',
    en: 'Machined dimensions verified against the production drawings'
  },
  {
    vi: 'Kiểm tra cạnh, bề mặt, phụ kiện và độ hoàn thiện trước đóng gói',
    en: 'Edges, surfaces, hardware and finish inspected before packing'
  },
  {
    vi: 'Phân loại hàng theo phòng, tầng hoặc khu vực để kiểm soát tiến độ thi công',
    en: 'Goods sorted by room, floor or zone to keep installation on schedule'
  },
  {
    vi: 'Nghiệm thu sau lắp dựng và ghi nhận hạng mục cần hoàn thiện',
    en: 'Post-installation sign-off with a punch list of items to complete'
  }
]
