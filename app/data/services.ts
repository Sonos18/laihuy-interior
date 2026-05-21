export type Service = {
  id: string
  icon: string
  title: string
  description: string
  details: string[]
}

export const services: Service[] = [
  {
    id: 'hotel-interior',
    icon: 'i-lucide-building-2',
    title: 'Nội thất khách sạn 3-5 sao',
    description:
      'Giải pháp thiết kế, sản xuất và lắp đặt nội thất khách sạn theo tiêu chuẩn vận hành, tiến độ và độ bền sử dụng.',
    details: [
      'Phòng ngủ khách sạn, sảnh, lễ tân, hành lang và khu tiện ích',
      'Sản xuất theo module để kiểm soát số lượng lớn',
      'Bàn giao đồng bộ theo phòng, tầng hoặc giai đoạn dự án'
    ]
  },
  {
    id: 'design',
    icon: 'i-lucide-pencil-ruler',
    title: 'Thiết kế nội thất',
    description:
      'Định hướng concept, bố trí công năng và hoàn thiện hồ sơ thiết kế phù hợp mục tiêu đầu tư và vận hành.',
    details: [
      'Tư vấn phong cách, vật liệu và ngân sách',
      'Bản vẽ 2D, phối cảnh 3D và hồ sơ triển khai',
      'Tối ưu công năng cho khách sạn, villa, căn hộ và thương mại'
    ]
  },
  {
    id: 'factory-production',
    icon: 'i-lucide-factory',
    title: 'Sản xuất nội thất tại xưởng',
    description:
      'Gia công trực tiếp tại xưởng giúp kiểm soát vật liệu, chất lượng hoàn thiện và tiến độ sản xuất.',
    details: [
      'Bóc tách bản vẽ sản xuất',
      'Gia công hệ tủ, giường, vách, quầy, bàn và chi tiết nội thất',
      'QC trước đóng gói và giao hàng'
    ]
  },
  {
    id: 'installation',
    icon: 'i-lucide-hard-hat',
    title: 'Thi công & lắp đặt',
    description:
      'Đội lắp dựng triển khai tại công trình, phối hợp hiện trường và nghiệm thu theo từng hạng mục.',
    details: [
      'Khảo sát hiện trạng và lập kế hoạch lắp đặt',
      'Tổ chức nhân sự theo tiến độ công trình',
      'Xử lý hoàn thiện, nghiệm thu và bàn giao'
    ]
  },
  {
    id: 'commercial-projects',
    icon: 'i-lucide-briefcase-business',
    title: 'Villa, căn hộ & thương mại',
    description:
      'Triển khai nội thất cho villa, căn hộ cao cấp, showroom, văn phòng và không gian thương mại.',
    details: [
      'Giữ đồng bộ thiết kế và vật liệu giữa các khu vực',
      'Tối ưu lưu trữ, vận hành và trải nghiệm người dùng',
      'Phù hợp dự án cần tiến độ và chất lượng ổn định'
    ]
  },
  {
    id: 'export-oem',
    icon: 'i-lucide-container',
    title: 'Gia công theo bản vẽ / xuất khẩu',
    description:
      'Nhận gia công theo hồ sơ kỹ thuật, đơn hàng dự án và nhu cầu xuất khẩu với quy trình sản xuất có kiểm soát.',
    details: [
      'Tiếp nhận bản vẽ, mẫu vật liệu và tiêu chuẩn đóng gói',
      'Sản xuất hàng loạt theo module',
      'Kiểm tra chất lượng trước giao hàng'
    ]
  }
]
