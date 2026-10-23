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
  /** The element id on /dich-vu; the footer and other pages link to `/dich-vu#<anchor>`. */
  anchor: string
  icon: string
  title: LocalizedText
  description: LocalizedText
  details: LocalizedArray
}

export const services: Service[] = [
  {
    id: 'design',
    anchor: 'thiet-ke',
    icon: 'i-lucide-pencil-ruler',
    title: { vi: 'Thiết kế & triển khai kỹ thuật', en: 'Design & technical development' },
    description: {
      vi: 'Triển khai concept, shop drawing và hồ sơ kỹ thuật phục vụ sản xuất và thi công nội thất dự án.',
      en: 'Concept development, shop drawings and technical documents for interior production and contracting.'
    },
    details: {
      vi: [
        'Định hướng concept, bố trí công năng và vật liệu',
        'Shop drawing, bản vẽ 2D và phối cảnh 3D',
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
    anchor: 'san-xuat',
    icon: 'i-lucide-factory',
    title: { vi: 'Sản xuất tại xưởng', en: 'In-house production' },
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
    anchor: 'thi-cong',
    icon: 'i-lucide-hard-hat',
    title: { vi: 'Thi công & lắp đặt', en: 'Fit-out & installation' },
    description: {
      vi: 'Lắp đặt nội thất tại công trình cho khách sạn, villa, căn hộ và văn phòng, theo tiến độ chung của dự án.',
      en: 'On-site interior installation for hotels, villas, apartments and offices, to the project’s overall schedule.'
    },
    details: {
      vi: [
        'Đo kiểm mặt bằng và lập kế hoạch lắp đặt',
        'Tổ chức nhân sự theo tiến độ công trình',
        'Xử lý hoàn thiện, nghiệm thu và bàn giao'
      ],
      en: [
        'Site check and installation planning',
        'Crews organised around the construction schedule',
        'Finishing, sign-off and handover'
      ]
    }
  },
  {
    id: 'hotel-interior',
    anchor: 'khach-san',
    icon: 'i-lucide-building-2',
    title: { vi: 'Nội thất khách sạn & resort', en: 'Hotel & resort interiors' },
    description: {
      vi: 'Giải pháp nội thất đồng bộ cho khách sạn boutique, resort và mô hình lưu trú cao cấp.',
      en: 'Coordinated interior packages for boutique hotels, resorts and premium hospitality.'
    },
    details: {
      vi: [
        'Phòng ngủ, sảnh, lễ tân, hành lang và khu tiện ích',
        'Sản xuất theo module để các phòng giống nhau đồng nhất',
        'Bàn giao đồng bộ theo phòng, tầng hoặc giai đoạn dự án'
      ],
      en: [
        'Guest rooms, lobby, reception, corridors and amenities',
        'Module-based production so identical rooms match',
        'Handover by room, floor or project stage'
      ]
    }
  },
  {
    id: 'commercial-projects',
    anchor: 'van-phong',
    icon: 'i-lucide-briefcase-business',
    title: { vi: 'Nội thất văn phòng & thương mại', en: 'Office & commercial interiors' },
    description: {
      vi: 'Thi công showroom, văn phòng, cửa hàng và không gian thương mại theo cách doanh nghiệp vận hành.',
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
    anchor: 'oem-xuat-khau',
    icon: 'i-lucide-container',
    title: { vi: 'Gia công OEM & xuất khẩu', en: 'OEM & export production' },
    description: {
      vi: 'OEM (sản xuất theo thiết kế và tiêu chuẩn của bên đặt hàng): nhận gia công theo bản vẽ kỹ thuật cho dự án và đơn hàng xuất khẩu.',
      en: 'OEM production to the buyer’s design and specification, for project and export orders.'
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
