import type { LocalizedArray, LocalizedText } from '~/shared/types/localization'

export type Service = {
  id: string
  icon: string
  title: LocalizedText
  description: LocalizedText
  details: LocalizedArray
}

export const services: Service[] = [
  {
    id: 'design',
    icon: 'i-lucide-pencil-ruler',
    title: 'Thiết kế & triển khai kỹ thuật',
    description:
      'Triển khai concept, shopdrawing và hồ sơ kỹ thuật phục vụ sản xuất và thi công nội thất dự án.',
    details: [
      'Định hướng concept, bố trí công năng và vật liệu',
      'Shopdrawing, bản vẽ 2D và phối cảnh 3D',
      'Hồ sơ kỹ thuật phục vụ sản xuất và thi công'
    ]
  },
  {
    id: 'factory-production',
    icon: 'i-lucide-factory',
    title: 'Sản xuất nội thất tại xưởng',
    description:
      'Gia công trực tiếp tại xưởng với quy trình kiểm soát vật liệu, tiến độ và chất lượng hoàn thiện.',
    details: [
      'Bóc tách bản vẽ sản xuất',
      'Gia công hệ tủ, giường, vách, quầy, bàn và chi tiết nội thất',
      'QC trước đóng gói và giao hàng'
    ]
  },
  {
    id: 'construction',
    icon: 'i-lucide-hard-hat',
    title: 'Thi công nội thất dự án',
    description:
      'Triển khai thi công và lắp dựng nội thất khách sạn, resort và căn hộ theo tiến độ công trình.',
    details: [
      'Khảo sát hiện trạng và lập kế hoạch thi công',
      'Tổ chức nhân sự theo tiến độ công trình',
      'Xử lý hoàn thiện, nghiệm thu và bàn giao'
    ]
  },
  {
    id: 'hotel-interior',
    icon: 'i-lucide-building-2',
    title: 'Nội thất khách sạn & resort',
    description:
      'Giải pháp nội thất đồng bộ cho khách sạn boutique, resort và mô hình lưu trú cao cấp.',
    details: [
      'Phòng ngủ, sảnh, lễ tân, hành lang và khu tiện ích',
      'Sản xuất theo module để kiểm soát số lượng lớn',
      'Bàn giao đồng bộ theo phòng, tầng hoặc giai đoạn dự án'
    ]
  },
  {
    id: 'commercial-projects',
    icon: 'i-lucide-briefcase-business',
    title: 'Nội thất thương mại',
    description:
      'Thi công showroom, văn phòng, retail và không gian thương mại theo yêu cầu vận hành.',
    details: [
      'Giữ đồng bộ thiết kế và vật liệu giữa các khu vực',
      'Tối ưu lưu trữ, vận hành và trải nghiệm người dùng',
      'Phù hợp dự án cần tiến độ và chất lượng ổn định'
    ]
  },
  {
    id: 'export-oem',
    icon: 'i-lucide-container',
    title: 'Gia công theo hồ sơ kỹ thuật / xuất khẩu',
    description:
      'Nhận gia công theo bản vẽ kỹ thuật, đơn hàng dự án và đơn hàng xuất khẩu.',
    details: [
      'Tiếp nhận bản vẽ, mẫu vật liệu và tiêu chuẩn đóng gói',
      'Sản xuất hàng loạt theo module',
      'Kiểm tra chất lượng trước giao hàng'
    ]
  }
]
