import type { LocalizedText } from '~/shared/types/localization'

export type Capability = {
  label: LocalizedText
  value: string
  description: LocalizedText
}

export type Machinery = {
  name: LocalizedText
  description: LocalizedText
}

export type FactoryImage = {
  title: LocalizedText
  description?: LocalizedText
  image: string
}

export const factoryCapabilities: Capability[] = [
  {
    label: 'Hệ thống nhà xưởng & kho',
    value: '3.000 m²',
    description: 'Không gian sản xuất trực tiếp cho đồ gỗ công nghiệp, hệ tủ và hạng mục nội thất dự án.'
  },
  {
    label: 'Năng lực sản xuất & thi công',
    value: 'Lên đến 50 phòng khách sạn/tháng',
    description: 'Phù hợp các dự án khách sạn, căn hộ dịch vụ và villa cần tiến độ sản xuất ổn định.'
  },
  {
    label: 'Đội ngũ triển khai dự án',
    value: 'Sản xuất, thiết kế và thi công',
    description: 'Phối hợp xuyên suốt từ bóc tách bản vẽ, sản xuất, kiểm soát chất lượng đến thi công thực tế tại công trình.'
  },
  {
    label: 'Thị trường',
    value: 'Trong nước và xuất khẩu',
    description: 'Khách sạn, resort, căn hộ cao cấp và đơn hàng xuất khẩu theo yêu cầu.'
  }
]

export const machinery: Machinery[] = [
  {
    name: 'CNC Nesting',
    description: 'Gia công cắt, khoan và tạo hình chi tiết theo hồ sơ kỹ thuật với độ chính xác cao, giúp tối ưu vật liệu và đồng bộ sản xuất nội thất dự án.'
  },
  {
    name: 'Máy khoan liên kết CNC',
    description: 'Gia công lỗ liên kết, cam chốt và phụ kiện với độ chính xác cao, giúp tăng tốc độ lắp ráp và đồng bộ sản phẩm nội thất.'
  },
  {
    name: 'Máy dán cạnh tự động',
    description: 'Hoàn thiện cạnh ván đồng bộ và chính xác, tăng độ bền, tính thẩm mỹ và độ ổn định cho sản phẩm nội thất.'
  },
  {
    name: 'Cưa bàn trượt',
    description: 'Cắt và xử lý chi tiết nội thất theo kích thước kỹ thuật, hỗ trợ gia công linh hoạt cho các hạng mục sản xuất.'
  },
  {
    name: 'Máy bào cuốn',
    description: 'Xử lý độ phẳng và đồng đều bề mặt vật liệu, giúp tăng độ chính xác và chất lượng hoàn thiện trong sản xuất nội thất.'
  },
  {
    name: 'Máy chà nhám thùng',
    description: 'Kiểm soát độ phẳng và độ mịn bề mặt, đảm bảo chất lượng hoàn thiện đồng đều cho các dự án nội thất quy mô lớn.'
  },
  {
    name: 'Máy ép nguội thủy lực',
    description: 'Hệ thống ép thủy lực giúp liên kết vật liệu đồng đều, tăng độ ổn định và chất lượng hoàn thiện cho các chi tiết nội thất.'
  }
]

export const productionWorkflow = [
  {
    title: 'Tiếp nhận bản vẽ & BOQ',
    description: 'Rà soát hồ sơ, phạm vi công việc, vật liệu, tiến độ và tiêu chuẩn hoàn thiện trước khi triển khai.'
  },
  {
    title: 'Bóc tách kỹ thuật',
    description: 'Chuyển đổi bản vẽ thiết kế thành hồ sơ sản xuất, danh mục vật tư và kế hoạch triển khai.'
  },
  {
    title: 'Điều phối dự án',
    description: 'Theo dõi tiến độ sản xuất, giao hàng và phối hợp thi công theo từng giai đoạn dự án.'
  },
  {
    title: 'Sản xuất tại xưởng',
    description: 'Sản xuất module nội thất theo hồ sơ kỹ thuật, kiểm soát kích thước, vật liệu và chất lượng hoàn thiện.'
  },
  {
    title: 'QC trước khi giao hàng',
    description: 'Kiểm tra kích thước, bề mặt, phụ kiện và phân loại theo từng khu vực trước khi giao hàng.'
  },
  {
    title: 'Thi công tại công trình',
    description: 'Đội lắp dựng triển khai theo mặt bằng, phối hợp với các bộ môn và xử lý nghiệm thu.'
  }
]

export const qualityControl = [
  'Kiểm tra vật liệu đầu vào theo chủng loại, màu sắc và tiêu chuẩn dự án',
  'Đối chiếu kích thước sau gia công với bản vẽ sản xuất',
  'Kiểm tra cạnh, bề mặt, phụ kiện và độ hoàn thiện trước đóng gói',
  'Phân loại hàng theo phòng, tầng hoặc khu vực để kiểm soát tiến độ thi công',
  'Nghiệm thu sau lắp dựng và ghi nhận hạng mục cần hoàn thiện'
]

export const factoryGallery: FactoryImage[] = []
