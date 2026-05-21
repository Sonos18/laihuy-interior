export type Capability = {
  label: string
  value: string
  description: string
}

export type Machinery = {
  name: string
  description: string
}

export type FactoryImage = {
  title: string
  description?: string
  image: string
}

export const factoryCapabilities: Capability[] = [
  {
    label: 'Diện tích xưởng',
    value: '3.000 m²',
    description: 'Không gian sản xuất trực tiếp cho đồ gỗ công nghiệp, hệ tủ và hạng mục nội thất dự án.'
  },
  {
    label: 'Năng lực triển khai',
    value: '50 phòng/tháng',
    description: 'Phù hợp các dự án khách sạn, căn hộ dịch vụ và villa cần tiến độ sản xuất ổn định.'
  },
  {
    label: 'Đội ngũ',
    value: 'Kỹ thuật - sản xuất - lắp đặt',
    description: 'Phối hợp từ bóc tách bản vẽ, gia công, kiểm tra chất lượng đến lắp dựng tại công trình.'
  },
  {
    label: 'Thị trường',
    value: 'Dự án & xuất khẩu',
    description: 'Khách sạn, villa, căn hộ, thương mại, gia công theo bản vẽ và đơn hàng xuất khẩu.'
  }
]

export const machinery: Machinery[] = [
  {
    name: 'CNC',
    description: 'Gia công chi tiết theo bản vẽ kỹ thuật, tăng độ chính xác cho hệ tủ và module nội thất.'
  },
  {
    name: 'Dán cạnh',
    description: 'Hoàn thiện cạnh ván đồng bộ, giảm sai lệch bề mặt và nâng độ bền sử dụng.'
  },
  {
    name: 'Cưa bàn trượt',
    description: 'Cắt ván theo kích thước, kiểm soát độ thẳng và độ đồng nhất giữa các chi tiết.'
  },
  {
    name: 'Phan ngang',
    description: 'Hỗ trợ gia công hàng loạt, phù hợp tiến độ dự án khách sạn nhiều phòng.'
  },
  {
    name: 'Chà nhám',
    description: 'Chuẩn bị bề mặt trước hoàn thiện, đảm bảo độ mịn và cảm giác chạm.'
  },
  {
    name: 'Bào',
    description: 'Xử lý phôi và chi tiết gỗ cần độ phẳng, độ vuông và tính ổn định.'
  },
  {
    name: 'Ép khô',
    description: 'Hỗ trợ kết cấu bề mặt và lớp phủ khi cần độ ổn định trong sản xuất.'
  }
]

export const productionWorkflow = [
  {
    title: 'Tiếp nhận bản vẽ & BOQ',
    description: 'Kiểm tra hồ sơ, làm rõ phạm vi công việc, vật liệu, tiêu chuẩn hoàn thiện và tiến độ.'
  },
  {
    title: 'Bóc tách kỹ thuật',
    description: 'Chuyển bản vẽ thiết kế thành bản vẽ sản xuất, danh mục chi tiết và kế hoạch vật tư.'
  },
  {
    title: 'Sản xuất tại xưởng',
    description: 'Gia công module nội thất theo từng khu vực, kiểm soát kích thước và chất lượng bề mặt.'
  },
  {
    title: 'QC trước khi giao hàng',
    description: 'Kiểm tra chi tiết, đóng gói, phân loại theo phòng/khu vực để giảm sai sót khi lắp dựng.'
  },
  {
    title: 'Lắp đặt tại công trình',
    description: 'Đội lắp dựng triển khai theo mặt bằng, phối hợp với các bộ môn và xử lý nghiệm thu.'
  }
]

export const qualityControl = [
  'Kiểm tra vật liệu đầu vào theo chủng loại, màu sắc và tiêu chuẩn dự án',
  'Đối chiếu kích thước sau gia công với bản vẽ sản xuất',
  'Kiểm tra cạnh, bề mặt, phụ kiện và độ hoàn thiện trước đóng gói',
  'Phân loại hàng theo phòng, tầng hoặc khu vực để kiểm soát tiến độ lắp đặt',
  'Nghiệm thu sau lắp dựng và ghi nhận hạng mục cần hoàn thiện'
]

export const factoryGallery: FactoryImage[] = []
