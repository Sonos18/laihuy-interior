import type { LocalizedText } from '~/shared/types/localization'

export type Capability = {
  label: LocalizedText
  value: LocalizedText
  description: LocalizedText
}

export type Machinery = {
  name: LocalizedText
  description: LocalizedText
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

export const machinery: Machinery[] = [
  {
    name: { vi: 'CNC Nesting', en: 'CNC nesting router' },
    description: {
      vi: 'Gia công cắt, khoan và tạo hình chi tiết theo hồ sơ kỹ thuật với độ chính xác cao, giúp tối ưu vật liệu và đồng bộ sản xuất nội thất dự án.',
      en: 'Cuts, bores and shapes components to the technical documents with high precision, optimising material and keeping project production consistent.'
    }
  },
  {
    name: { vi: 'Máy khoan liên kết CNC', en: 'CNC boring machine' },
    description: {
      vi: 'Gia công lỗ liên kết, cam chốt và phụ kiện với độ chính xác cao, giúp tăng tốc độ lắp ráp và đồng bộ sản phẩm nội thất.',
      en: 'Machines connector holes, cam locks and hardware positions with high precision, speeding up assembly and keeping products uniform.'
    }
  },
  {
    name: { vi: 'Máy dán cạnh tự động', en: 'Automatic edge bander' },
    description: {
      vi: 'Hoàn thiện cạnh ván đồng bộ và chính xác, tăng độ bền, tính thẩm mỹ và độ ổn định cho sản phẩm nội thất.',
      en: 'Finishes board edges uniformly and precisely, improving the durability, look and stability of every piece.'
    }
  },
  {
    name: { vi: 'Cưa bàn trượt', en: 'Sliding table saw' },
    description: {
      vi: 'Cắt và xử lý chi tiết nội thất theo kích thước kỹ thuật, hỗ trợ gia công linh hoạt cho các hạng mục sản xuất.',
      en: 'Cuts and processes interior components to technical dimensions, supporting flexible machining across production items.'
    }
  },
  {
    name: { vi: 'Máy bào cuốn', en: 'Thickness planer' },
    description: {
      vi: 'Xử lý độ phẳng và đồng đều bề mặt vật liệu, giúp tăng độ chính xác và chất lượng hoàn thiện trong sản xuất nội thất.',
      en: 'Levels and evens material surfaces, improving accuracy and finish quality in production.'
    }
  },
  {
    name: { vi: 'Máy chà nhám thùng', en: 'Wide-belt sander' },
    description: {
      vi: 'Kiểm soát độ phẳng và độ mịn bề mặt, đảm bảo chất lượng hoàn thiện đồng đều cho các dự án nội thất quy mô lớn.',
      en: 'Controls surface flatness and smoothness, ensuring a consistent finish across large-scale interior projects.'
    }
  },
  {
    name: { vi: 'Máy ép nguội thủy lực', en: 'Hydraulic cold press' },
    description: {
      vi: 'Hệ thống ép thủy lực giúp liên kết vật liệu đồng đều, tăng độ ổn định và chất lượng hoàn thiện cho các chi tiết nội thất.',
      en: 'Bonds material layers evenly under hydraulic pressure, improving the stability and finish of interior components.'
    }
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
