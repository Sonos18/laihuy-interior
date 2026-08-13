import type { LocalizedArray, LocalizedText } from '~/shared/types/localization'

export type ServiceId
  = 'design'
    | 'factory-production'
    | 'construction'
    | 'hotel-interior'
    | 'commercial-projects'
    | 'export-oem'

export type Service = {
  id: ServiceId
  icon: string
  title: LocalizedText
  description: LocalizedText
  details: LocalizedArray
}

export const services: Service[] = [
  {
    id: 'design',
    icon: 'i-lucide-pencil-ruler',
    title: { vi: 'Thiết kế & triển khai kỹ thuật', en: 'Design & technical development' },
    description: {
      vi: 'Triển khai concept, shopdrawing và hồ sơ kỹ thuật phục vụ sản xuất và thi công nội thất dự án.',
      en: 'Concept development, shop drawings and technical documents for interior production and contracting.'
    },
    details: {
      vi: [
        'Định hướng concept, bố trí công năng và vật liệu',
        'Shopdrawing, bản vẽ 2D và phối cảnh 3D',
        'Hồ sơ kỹ thuật phục vụ sản xuất và thi công'
      ],
      en: [
        'Concept direction, layout planning and materials',
        'Shop drawings, 2D documentation and 3D visuals',
        'Technical documents for production and installation'
      ]
    }
  },
  {
    id: 'factory-production',
    icon: 'i-lucide-factory',
    title: { vi: 'Sản xuất nội thất tại xưởng', en: 'In-house furniture production' },
    description: {
      vi: 'Gia công trực tiếp tại xưởng với quy trình kiểm soát vật liệu, tiến độ và chất lượng hoàn thiện.',
      en: 'Produced directly at our own workshop, with materials, schedule and finish quality under control.'
    },
    details: {
      vi: [
        'Bóc tách bản vẽ sản xuất',
        'Gia công hệ tủ, giường, vách, quầy, bàn và chi tiết nội thất',
        'QC trước đóng gói và giao hàng'
      ],
      en: [
        'Production drawing take-off',
        'Cabinetry, beds, wall panelling, counters, tables and details',
        'QC before packing and delivery'
      ]
    }
  },
  {
    id: 'construction',
    icon: 'i-lucide-hard-hat',
    title: { vi: 'Thi công nội thất dự án', en: 'Project interior contracting' },
    description: {
      vi: 'Triển khai thi công và lắp dựng nội thất khách sạn, resort và căn hộ theo tiến độ công trình.',
      en: 'Interior fit-out and installation for hotels, resorts and apartments, delivered to the project schedule.'
    },
    details: {
      vi: [
        'Khảo sát hiện trạng và lập kế hoạch thi công',
        'Tổ chức nhân sự theo tiến độ công trình',
        'Xử lý hoàn thiện, nghiệm thu và bàn giao'
      ],
      en: [
        'Site survey and installation planning',
        'Crews organised around the construction schedule',
        'Finishing, sign-off and handover'
      ]
    }
  },
  {
    id: 'hotel-interior',
    icon: 'i-lucide-building-2',
    title: { vi: 'Nội thất khách sạn & resort', en: 'Hotel & resort interiors' },
    description: {
      vi: 'Giải pháp nội thất đồng bộ cho khách sạn boutique, resort và mô hình lưu trú cao cấp.',
      en: 'Coordinated interior packages for boutique hotels, resorts and premium hospitality.'
    },
    details: {
      vi: [
        'Phòng ngủ, sảnh, lễ tân, hành lang và khu tiện ích',
        'Sản xuất theo module để kiểm soát số lượng lớn',
        'Bàn giao đồng bộ theo phòng, tầng hoặc giai đoạn dự án'
      ],
      en: [
        'Guest rooms, lobby, reception, corridors and amenities',
        'Module-based production to control large quantities',
        'Handover by room, floor or project stage'
      ]
    }
  },
  {
    id: 'commercial-projects',
    icon: 'i-lucide-briefcase-business',
    title: { vi: 'Nội thất thương mại', en: 'Commercial interiors' },
    description: {
      vi: 'Thi công showroom, văn phòng, retail và không gian thương mại theo yêu cầu vận hành.',
      en: 'Showrooms, offices and retail spaces, built around how the business operates.'
    },
    details: {
      vi: [
        'Giữ đồng bộ thiết kế và vật liệu giữa các khu vực',
        'Tối ưu lưu trữ, vận hành và trải nghiệm người dùng',
        'Phù hợp dự án cần tiến độ và chất lượng ổn định'
      ],
      en: [
        'Design and materials kept consistent across areas',
        'Storage, operations and user experience optimised',
        'For projects that need dependable schedule and quality'
      ]
    }
  },
  {
    id: 'export-oem',
    icon: 'i-lucide-container',
    title: { vi: 'Gia công theo hồ sơ kỹ thuật / xuất khẩu', en: 'OEM & export production' },
    description: {
      vi: 'Nhận gia công theo bản vẽ kỹ thuật, đơn hàng dự án và đơn hàng xuất khẩu.',
      en: 'Production from technical drawings, project orders and export orders.'
    },
    details: {
      vi: [
        'Tiếp nhận bản vẽ, mẫu vật liệu và tiêu chuẩn đóng gói',
        'Sản xuất hàng loạt theo module',
        'Kiểm tra chất lượng trước giao hàng'
      ],
      en: [
        'Drawings, material samples and packing standards received',
        'Batch production in modules',
        'Quality inspection before delivery'
      ]
    }
  }
]
