import type { Project } from '~/shared/types/project'
import type { MediaImage } from '~/shared/media/types'

export const eoGioHotelPhotos = {
  reception: {
    path: 'projects/hotel/eo-gio/reception.webp',
    alt: { vi: 'Khu lễ tân khách sạn Eo Gió', en: 'Eo Gio hotel reception area' },
    width: 3200,
    height: 2000
  },
  bed: {
    path: 'projects/hotel/eo-gio/bed.webp',
    alt: { vi: 'Phòng ngủ khách sạn Eo Gió', en: 'Eo Gio hotel guest bedroom' },
    width: 2560,
    height: 1682
  },
  room1: {
    path: 'projects/hotel/eo-gio/room-1.webp',
    alt: { vi: 'Phòng nghỉ khách sạn Eo Gió', en: 'Eo Gio hotel guest room' },
    width: 3200,
    height: 2000
  },
  room2: {
    path: 'projects/hotel/eo-gio/room-2.webp',
    alt: { vi: 'Không gian phòng nghỉ khách sạn Eo Gió', en: 'Eo Gio hotel guest room interior' },
    width: 3200,
    height: 2000
  },
  table: {
    path: 'projects/hotel/eo-gio/table.webp',
    alt: { vi: 'Bàn làm việc trong phòng khách sạn Eo Gió', en: 'Eo Gio hotel in-room work desk' },
    width: 2560,
    height: 1829
  },
  toilet: {
    path: 'projects/hotel/eo-gio/toilet.webp',
    alt: { vi: 'Phòng vệ sinh khách sạn Eo Gió', en: 'Eo Gio hotel bathroom' },
    width: 2500,
    height: 2500
  }
} satisfies Record<string, MediaImage>

export const codiHotelPhotos = {
  receptionDesk: {
    path: 'projects/hotel/codi/reception-desk.webp',
    alt: { vi: 'Quầy lễ tân Codi Boutique Hotel', en: 'Codi Boutique Hotel reception desk' },
    width: 2500,
    height: 1500
  },
  bed: {
    path: 'projects/hotel/codi/bed.webp',
    alt: { vi: 'Phòng ngủ Codi Boutique Hotel', en: 'Codi Boutique Hotel bedroom' },
    width: 2500,
    height: 1507
  },
  wardrobe: {
    path: 'projects/hotel/codi/wardrobe.webp',
    alt: { vi: 'Hệ tủ lưu trú Codi Boutique Hotel', en: 'Codi Boutique Hotel wardrobe unit' },
    width: 1000,
    height: 1200
  }
} satisfies Record<string, MediaImage>

const codiVillaPhotos = {
  phongKhach: {
    path: 'projects/villa/codi/phong-khach.webp',
    alt: { vi: 'Phòng khách Codi Villa', en: 'Codi Villa living room' },
    width: 6000,
    height: 4000
  },
  phongKhach2: {
    path: 'projects/villa/codi/phong-khach-2.webp',
    alt: { vi: 'Góc phòng khách Codi Villa', en: 'Codi Villa living room detail' },
    width: 6000,
    height: 4000
  },
  phongBep: {
    path: 'projects/villa/codi/phong-bep.webp',
    alt: { vi: 'Phòng bếp Codi Villa', en: 'Codi Villa kitchen' },
    width: 6000,
    height: 4000
  },
  phongNgu: {
    path: 'projects/villa/codi/phong-ngu.webp',
    alt: { vi: 'Phòng ngủ Codi Villa', en: 'Codi Villa bedroom' },
    width: 5892,
    height: 3928
  },
  phongNgu2: {
    path: 'projects/villa/codi/phong-ngu-2.webp',
    alt: { vi: 'Phòng ngủ thứ hai Codi Villa', en: 'Codi Villa second bedroom' },
    width: 6000,
    height: 4000
  },
  toilet: {
    path: 'projects/villa/codi/toilet.webp',
    alt: { vi: 'Phòng vệ sinh Codi Villa', en: 'Codi Villa bathroom' },
    width: 4000,
    height: 6000
  }
} satisfies Record<string, MediaImage>

export const anhDuyHousePhotos = {
  phongKhach: {
    path: 'projects/house/anhduy/phong-khach.webp',
    alt: { vi: 'Phòng khách nhà phố Anh Duy', en: 'Anh Duy townhouse living room' },
    width: 2500,
    height: 1875
  },
  phongKhach2: {
    path: 'projects/house/anhduy/phong-khach-2.webp',
    alt: { vi: 'Góc phòng khách nhà phố Anh Duy', en: 'Anh Duy townhouse living room detail' },
    width: 2500,
    height: 1875
  },
  phongAn: {
    path: 'projects/house/anhduy/phong-an.webp',
    alt: { vi: 'Phòng ăn nhà phố Anh Duy', en: 'Anh Duy townhouse dining room' },
    width: 2500,
    height: 1875
  },
  bep: {
    path: 'projects/house/anhduy/bep.webp',
    alt: { vi: 'Khu bếp nhà phố Anh Duy', en: 'Anh Duy townhouse kitchen' },
    width: 2500,
    height: 2500
  },
  giengTroi: {
    path: 'projects/house/anhduy/gieng-troi.webp',
    alt: { vi: 'Giếng trời nhà phố Anh Duy', en: 'Anh Duy townhouse skylight well' },
    width: 2500,
    height: 1188
  },
  phongNgu: {
    path: 'projects/house/anhduy/phong-ngu.webp',
    alt: { vi: 'Phòng ngủ nhà phố Anh Duy', en: 'Anh Duy townhouse bedroom' },
    width: 2500,
    height: 1875
  },
  phongNgu2: {
    path: 'projects/house/anhduy/phong-ngu-2.webp',
    alt: { vi: 'Phòng ngủ thứ hai nhà phố Anh Duy', en: 'Anh Duy townhouse second bedroom' },
    width: 2500,
    height: 1500
  },
  mayGiat: {
    path: 'projects/house/anhduy/may-giat.webp',
    alt: { vi: 'Khu giặt nhà phố Anh Duy', en: 'Anh Duy townhouse laundry area' },
    width: 1760,
    height: 2200
  },
  toilet: {
    path: 'projects/house/anhduy/toilet.webp',
    alt: { vi: 'Phòng vệ sinh nhà phố Anh Duy', en: 'Anh Duy townhouse bathroom' },
    width: 1760,
    height: 2200
  }
} satisfies Record<string, MediaImage>

const chilyHousePhotos = {
  phongKhach: {
    path: 'projects/house/chily/phong-khach.webp',
    alt: { vi: 'Phòng khách nhà phố Chily', en: 'Chily townhouse living room' },
    width: 2200,
    height: 1800
  },
  phongKhach2: {
    path: 'projects/house/chily/phong-khach-2.webp',
    alt: { vi: 'Góc phòng khách nhà phố Chily', en: 'Chily townhouse living room detail' },
    width: 2200,
    height: 1672
  },
  banAn: {
    path: 'projects/house/chily/ban-an.webp',
    alt: { vi: 'Bàn ăn nhà phố Chily', en: 'Chily townhouse dining table' },
    width: 2000,
    height: 2000
  },
  phongBep: {
    path: 'projects/house/chily/phong-bep.webp',
    alt: { vi: 'Phòng bếp nhà phố Chily', en: 'Chily townhouse kitchen' },
    width: 1800,
    height: 2200
  },
  phongNgu: {
    path: 'projects/house/chily/phong-ngu.webp',
    alt: { vi: 'Phòng ngủ nhà phố Chily', en: 'Chily townhouse bedroom' },
    width: 2000,
    height: 1600
  },
  phongNgu2: {
    path: 'projects/house/chily/phong-ngu-2.webp',
    alt: { vi: 'Phòng ngủ thứ hai nhà phố Chily', en: 'Chily townhouse second bedroom' },
    width: 1600,
    height: 1600
  },
  phongBeTrai: {
    path: 'projects/house/chily/phong-be-trai.webp',
    alt: { vi: 'Phòng bé trai nhà phố Chily', en: 'Chily townhouse boy bedroom' },
    width: 1600,
    height: 2000
  },
  phongBeTrai2: {
    path: 'projects/house/chily/phong-be-trai-2.webp',
    alt: { vi: 'Góc phòng bé trai nhà phố Chily', en: 'Chily townhouse boy bedroom detail' },
    width: 1600,
    height: 1838
  }
} satisfies Record<string, MediaImage>

const officeWorkspacePhotos = {
  longDesk: {
    path: 'projects/office/lai-huy-office/long-desk.webp',
    alt: { vi: 'Bàn làm việc dài văn phòng Lai Huy', en: 'Lai Huy office long work desk' },
    width: 2200,
    height: 1300
  },
  banDai: {
    path: 'projects/office/lai-huy-office/ban-dai.webp',
    alt: { vi: 'Khu bàn dài văn phòng Lai Huy', en: 'Lai Huy office long table area' },
    width: 2200,
    height: 1300
  },
  banLamViec: {
    path: 'projects/office/lai-huy-office/ban-lam-viec.webp',
    alt: { vi: 'Khu làm việc văn phòng Lai Huy', en: 'Lai Huy office workstation' },
    width: 2200,
    height: 1500
  },
  keChua: {
    path: 'projects/office/lai-huy-office/ke-chua.webp',
    alt: { vi: 'Hệ kệ lưu trữ văn phòng Lai Huy', en: 'Lai Huy office storage shelving' },
    width: 2200,
    height: 1500
  },
  phongLamViec: {
    path: 'projects/office/lai-huy-office/phong-lam-viec.webp',
    alt: { vi: 'Phòng làm việc văn phòng Lai Huy', en: 'Lai Huy office workspace room' },
    width: 1700,
    height: 2200
  }
} satisfies Record<string, MediaImage>

const eoGioHotelImages: [MediaImage, ...MediaImage[]] = [
  eoGioHotelPhotos.reception,
  eoGioHotelPhotos.bed,
  eoGioHotelPhotos.room1,
  eoGioHotelPhotos.room2,
  eoGioHotelPhotos.table,
  eoGioHotelPhotos.toilet
]

const codiHotelImages: [MediaImage, ...MediaImage[]] = [
  codiHotelPhotos.receptionDesk,
  codiHotelPhotos.bed,
  codiHotelPhotos.wardrobe
]

const codiVillaImages: [MediaImage, ...MediaImage[]] = [
  codiVillaPhotos.phongKhach,
  codiVillaPhotos.phongKhach2,
  codiVillaPhotos.phongBep,
  codiVillaPhotos.phongNgu,
  codiVillaPhotos.phongNgu2,
  codiVillaPhotos.toilet
]

const anhDuyHouseImages: [MediaImage, ...MediaImage[]] = [
  anhDuyHousePhotos.phongKhach,
  anhDuyHousePhotos.phongKhach2,
  anhDuyHousePhotos.phongAn,
  anhDuyHousePhotos.bep,
  anhDuyHousePhotos.giengTroi,
  anhDuyHousePhotos.phongNgu,
  anhDuyHousePhotos.phongNgu2,
  anhDuyHousePhotos.mayGiat,
  anhDuyHousePhotos.toilet
]

const chilyHouseImages: [MediaImage, ...MediaImage[]] = [
  chilyHousePhotos.phongKhach,
  chilyHousePhotos.phongKhach2,
  chilyHousePhotos.banAn,
  chilyHousePhotos.phongBep,
  chilyHousePhotos.phongNgu,
  chilyHousePhotos.phongNgu2,
  chilyHousePhotos.phongBeTrai,
  chilyHousePhotos.phongBeTrai2
]

const officeWorkspaceImages: [MediaImage, ...MediaImage[]] = [
  officeWorkspacePhotos.longDesk,
  officeWorkspacePhotos.banDai,
  officeWorkspacePhotos.banLamViec,
  officeWorkspacePhotos.keChua,
  officeWorkspacePhotos.phongLamViec
]

const createImageAliases = (images: [MediaImage, ...MediaImage[]]) => ({
  image: [images[0]],
  gallery: images.slice(1),
  thumbnail: images[0],
  images
})

export const projectCategories = [
  'Tất cả',
  'Khách sạn',
  'Villa',
  'Căn hộ',
  'Nhà phố',
  'Thương mại',
  'Khác'
]

export const projects: Project[] = [
  {
    id: 1,
    name: 'Khách sạn Eo Gió - 50 phòng',
    slug: 'khach-san-eo-gio-50-phong',
    category: 'HOTEL',
    categoryName: 'Khách sạn',
    segment: 'hotel',
    shortDescription:
      'Case study khách sạn boutique 50 phòng, triển khai thiết kế, sản xuất và thi công nội thất gỗ công nghiệp trong 2 tháng.',
    description: [
      'Dự án Eo Gió là mô hình khách sạn boutique cần kiểm soát đồng thời hình ảnh thương hiệu, tiến độ sản xuất và chất lượng hoàn thiện theo số lượng phòng lớn.',
      'Lai Huy Interior tham gia từ giai đoạn thiết kế, bóc tách kỹ thuật đến sản xuất tại xưởng và thi công tại công trình.',
      'Giải pháp tập trung vào module hóa hạng mục nội thất, đồng bộ vật liệu và tổ chức bàn giao theo từng khu vực để giảm rủi ro tiến độ.'
    ],
    ...createImageAliases(eoGioHotelImages),
    location: 'Bến Tre',
    area: 'Khách sạn boutique',
    rooms: '50 phòng',
    duration: '60 ngày',
    year: '2026',
    client: 'Eo Gió Hotel',
    style: 'Hospitality hiện đại ấm áp',
    scope: [
      'Thiết kế nội thất',
      'Bóc tách bản vẽ sản xuất',
      'Sản xuất nội thất gỗ công nghiệp',
      'Thi công tại công trình',
      'Kiểm soát chất lượng và bàn giao'
    ],
    materials: [
      'Gỗ công nghiệp',
      'Đá sáng màu',
      'Kính và kim loại sơn tĩnh điện',
      'Đèn LED gián tiếp'
    ],
    featured: true,
    content: {
      overview:
        'Eo Gió Hotel được phát triển như một dự án hospitality có yêu cầu rõ về tiến độ, tính đồng bộ và trải nghiệm lưu trú. Thay vì chỉ tạo ra hình ảnh đẹp, Lai Huy Interior tập trung vào khả năng sản xuất hàng loạt có kiểm soát, giữ chất lượng hoàn thiện ổn định giữa các phòng và đảm bảo quá trình thi công không làm gián đoạn kế hoạch vận hành.',
      challenge:
        'Thách thức chính nằm ở việc triển khai nhiều hạng mục nội thất trong thời gian ngắn, đồng thời giữ được độ đồng nhất về màu vật liệu, kích thước, phụ kiện và cảm giác hoàn thiện giữa các phòng.',
      solution:
        'Đội ngũ kỹ thuật bóc tách hồ sơ theo module, phân loại chi tiết theo phòng và khu vực, sau đó tổ chức sản xuất tại xưởng theo từng đợt. Quy trình QC trước khi đóng gói giúp giảm sai sót tại công trình, còn đội thi công triển khai theo tiến độ bàn giao đã thống nhất với chủ đầu tư.',
      highlights: [
        'Tổ chức sản xuất theo module để kiểm soát tiến độ 50 phòng',
        'Phối hợp thiết kế, xưởng và thi công trong một quy trình thống nhất',
        'Ưu tiên vật liệu bền, dễ bảo trì cho môi trường khách sạn',
        'Khu lễ tân tạo nhận diện thương hiệu rõ ràng ngay khi khách bước vào',
        'Hệ ánh sáng gián tiếp và bảng màu gỗ ấm nâng trải nghiệm lưu trú'
      ],
      materials: [
        'Gỗ công nghiệp phủ bề mặt tông ấm cho hệ tủ, giường và vách',
        'Đá sáng màu cho quầy lễ tân và bề mặt điểm nhấn',
        'Kính, khung kim loại sơn tĩnh điện và đèn LED gián tiếp',
        'Vải bọc trung tính cho khu chờ và các chi tiết tiếp xúc'
      ]
    }
  },
  {
    id: 2,
    name: 'Codi Boutique Hotel',
    slug: 'codi-boutique-hotel',
    category: 'HOTEL',
    categoryName: 'Khách sạn',
    segment: 'hotel',
    shortDescription:
      'Không gian khách sạn boutique thanh lịch, tối ưu lễ tân, phòng ngủ và hệ tủ lưu trú cho mô hình vận hành quy mô nhỏ.',
    description: [
      'Codi Boutique Hotel khai thác tinh thần hospitality tinh gọn, phù hợp các mô hình lưu trú vừa và nhỏ.',
      'Thiết kế ưu tiên tỷ lệ đẹp, vật liệu sáng màu và chi tiết dễ bảo trì trong vận hành.',
      'Các hạng mục được xử lý theo hướng gọn, đồng bộ và có khả năng nhân rộng cho nhiều phòng.'
    ],
    ...createImageAliases(codiHotelImages),
    location: 'Việt Nam',
    area: 'Khách sạn boutique quy mô nhỏ',
    year: '2026',
    client: 'Codi Hotel',
    style: 'Modern Classic tinh giản',
    scope: [
      'Thiết kế khu lễ tân',
      'Sản xuất hạng mục phòng ngủ',
      'Hoàn thiện hệ tủ và chi tiết lưu trú',
      'Thi công và nghiệm thu'
    ],
    materials: [
      'Gỗ công nghiệp',
      'Đá nhân tạo',
      'Lam gỗ',
      'Phụ kiện kim loại'
    ],
    featured: true,
    content: {
      overview:
        'Codi Boutique Hotel được định hướng là không gian lưu trú có hình ảnh nhẹ nhàng nhưng chuyên nghiệp. Với quy mô vừa phải, từng chi tiết cần vừa đẹp, vừa dễ vận hành, dễ bảo trì và phù hợp ngân sách đầu tư.',
      challenge:
        'Dự án cần tạo điểm nhận diện cho khu lễ tân trong diện tích giới hạn, đồng thời giữ phòng nghỉ sạch, thoáng và đủ lưu trữ.',
      solution:
        'Lai Huy Interior sử dụng mảng vòm sau quầy lễ tân làm điểm nhấn mềm, kết hợp vật liệu tông be, gỗ và ánh sáng viền. Trong phòng nghỉ, hệ tủ và các chi tiết nội thất được xử lý theo bề mặt phẳng, ít chi tiết để tăng hiệu quả sử dụng lâu dài.',
      highlights: [
        'Lễ tân có nhận diện mềm mại, phù hợp thương hiệu khách sạn boutique',
        'Hệ tủ phòng nghỉ tối ưu lưu trữ nhưng không gây nặng không gian',
        'Vật liệu sáng màu giúp công trình sạch, nhẹ và dễ bảo trì',
        'Chi tiết kim loại mảnh tạo điểm nhấn hiện đại'
      ],
      materials: [
        'Đá nhân tạo sáng màu cho mặt quầy',
        'Lam gỗ và vách sơn hiệu ứng tông trung tính',
        'Đèn hắt viền và hệ chiếu sáng âm trần',
        'Phụ kiện kim loại mảnh cho điểm nhấn hiện đại'
      ]
    }
  },
  {
    id: 3,
    name: 'Codi Villa nghỉ dưỡng cao cấp',
    slug: 'codi-villa-hien-dai',
    category: 'VILLA',
    categoryName: 'Villa',
    segment: 'villa',
    shortDescription:
      'Villa hiện đại với không gian sinh hoạt rộng mở, bếp liền mạch và phòng ngủ được sản xuất đồng bộ theo hồ sơ kỹ thuật.',
    description: [
      'Codi Villa hướng đến trải nghiệm sống rộng rãi, sáng và có chiều sâu vật liệu.',
      'Các khu vực sinh hoạt chung được kết nối bằng bảng màu trung tính, gỗ ấm và đường nét nội thất mạnh mẽ.',
      'Phòng ngủ và khu vệ sinh được tiết chế chi tiết để giữ cảm giác riêng tư, sạch gọn và thư giãn.'
    ],
    ...createImageAliases(codiVillaImages),
    location: 'Việt Nam',
    area: 'Không gian villa gia đình',
    year: '2026',
    client: 'Codi Villa',
    style: 'Hiện đại sang trọng',
    scope: [
      'Thiết kế nội thất villa',
      'Sản xuất hệ tủ và đồ rời',
      'Thi công phòng khách, bếp, phòng ngủ',
      'Hoàn thiện và bàn giao'
    ],
    materials: [
      'Gỗ công nghiệp phủ veneer/laminate',
      'Đá vân nhẹ',
      'Kính',
      'Kim loại sơn tĩnh điện'
    ],
    featured: true,
    content: {
      overview:
        'Codi Villa được xây dựng như một không gian sống cao cấp dành cho gia đình, nơi phòng khách, bếp, phòng ngủ và khu vệ sinh cùng chia sẻ một ngôn ngữ thiết kế liền mạch. Dự án ưu tiên sự cân bằng giữa cảm giác sang trọng, công năng sinh hoạt hằng ngày và khả năng giữ cho không gian luôn gọn gàng, thoáng sáng.',
      challenge:
        'Công trình cần giữ sự đồng bộ giữa nhiều khu chức năng, đồng thời xử lý hệ lưu trữ lớn mà không làm nặng tổng thể.',
      solution:
        'Các khu chức năng được tổ chức theo hướng mở nhưng vẫn có ranh giới sử dụng rõ ràng. Hệ tủ cao, tủ âm và các bề mặt phẳng giúp giảm nhiễu thị giác; ánh sáng được phân tầng để phục vụ sinh hoạt và tạo bầu không khí ấm vào buổi tối.',
      highlights: [
        'Phòng khách rộng mở với mảng tường điểm nhấn sang trọng',
        'Bếp được tổ chức gọn, thuận tiện cho sinh hoạt và tiếp khách',
        'Phòng ngủ sử dụng màu trung tính, ánh sáng mềm và hệ lưu trữ liền mạch',
        'Tổng thể đồng bộ từ không gian chung đến khu vực riêng tư'
      ],
      materials: [
        'Gỗ công nghiệp phủ veneer hoặc laminate tông ấm',
        'Đá ốp vân nhẹ cho bề mặt bếp và các mảng nhấn',
        'Kính, kim loại sơn tĩnh điện và đèn LED hắt',
        'Vải bọc trung tính và bề mặt sơn hiệu ứng'
      ]
    }
  },
  {
    id: 4,
    name: 'Nhà phố Anh Duy',
    slug: 'nha-pho-anh-duy',
    category: 'HOUSE',
    categoryName: 'Nhà phố',
    segment: 'house',
    shortDescription:
      'Nhà phố gia đình với phòng khách, bếp, giếng trời và phòng ngủ được tổ chức sáng thoáng, tiện nghi.',
    description: [
      'Nhà phố Anh Duy tập trung vào sự cân bằng giữa công năng sống gia đình và cảm giác thoáng đãng trong không gian đô thị.',
      'Phòng khách, phòng ăn và bếp được kết nối mạch lạc, trong khi giếng trời giúp bổ sung ánh sáng cho công trình.',
      'Các phòng ngủ, khu giặt và vệ sinh được xử lý gọn gàng để đáp ứng nhu cầu sử dụng thực tế.'
    ],
    ...createImageAliases(anhDuyHouseImages),
    location: 'Việt Nam',
    area: 'Nhà phố gia đình',
    year: '2026',
    client: 'Gia đình Anh Duy',
    style: 'Hiện đại ấm áp',
    scope: [
      'Thiết kế nội thất nhà phố',
      'Sản xuất hệ tủ và khu bếp',
      'Thi công các phòng chức năng',
      'Hoàn thiện và bàn giao'
    ],
    materials: [
      'Gỗ công nghiệp tông sáng',
      'Đá hoặc bề mặt chống ẩm',
      'Kính',
      'Gạch vệ sinh dễ bảo trì'
    ],
    content: {
      overview:
        'Dự án Nhà phố Anh Duy được phát triển quanh nhu cầu sống thực tế của một gia đình trẻ: đủ lưu trữ, dễ di chuyển, có ánh sáng tự nhiên và vẫn giữ được sự ấm cúng trong từng khu vực.',
      challenge:
        'Nhà phố cần thêm ánh sáng và cảm giác thoáng, đồng thời phải tối ưu lưu trữ cho nhiều khu vực sinh hoạt.',
      solution:
        'Lai Huy Interior khai thác giếng trời như lõi sáng, bố trí hệ tủ và khu phụ trợ theo hướng kín đáo để giữ cho không gian chính luôn thông thoáng. Phòng ngủ có lưu trữ hợp lý, khu bếp đảm bảo luồng thao tác thuận tiện.',
      highlights: [
        'Phòng khách và phòng ăn liên thông, tạo cảm giác rộng và gần gũi',
        'Giếng trời đưa ánh sáng tự nhiên vào sâu trong nhà',
        'Bếp được bố trí rõ luồng thao tác, tối ưu cho sinh hoạt gia đình',
        'Khu phụ trợ được xử lý kín đáo, sạch và dễ sử dụng'
      ],
      materials: [
        'Gỗ công nghiệp tông sáng cho hệ tủ và mảng ốp',
        'Đá hoặc bề mặt chống ẩm cho khu bếp',
        'Sơn tường trung tính, kính và đèn âm trần',
        'Gạch vệ sinh dễ bảo trì'
      ]
    }
  },
  {
    id: 5,
    name: 'Nhà phố Chily',
    slug: 'nha-pho-chily',
    category: 'HOUSE',
    categoryName: 'Nhà phố',
    segment: 'house',
    shortDescription:
      'Không gian nhà phố trẻ trung với phòng khách ấm áp, bếp ăn liền mạch, phòng ngủ thư thái và phòng bé cá tính.',
    description: [
      'Nhà phố Chily được thiết kế cho nhịp sống gia đình hiện đại, đề cao sự tiện nghi và cảm giác gần gũi.',
      'Các không gian chung sử dụng màu sắc ấm, đường nét gọn và bố cục dễ sinh hoạt.',
      'Phòng ngủ và phòng bé được phát triển với ngôn ngữ riêng, vừa cá nhân hóa vừa giữ sự đồng bộ tổng thể.'
    ],
    ...createImageAliases(chilyHouseImages),
    location: 'Việt Nam',
    area: 'Nhà phố gia đình',
    year: '2026',
    client: 'Gia đình Chily',
    style: 'Hiện đại trẻ trung',
    scope: [
      'Thiết kế nội thất',
      'Sản xuất hệ tủ và đồ nội thất',
      'Thi công phòng khách, bếp, phòng ngủ',
      'Bàn giao hoàn thiện'
    ],
    materials: [
      'Gỗ công nghiệp phủ melamine/laminate',
      'Bề mặt đá khu bếp',
      'Sơn trung tính',
      'Phụ kiện kim loại'
    ],
    content: {
      overview:
        'Nhà phố Chily là dự án nội thất gia đình có tinh thần trẻ trung, nơi từng khu vực được thiết kế để phục vụ thói quen sinh hoạt cụ thể nhưng vẫn giữ một tổng thể mềm mại và thống nhất.',
      challenge:
        'Dự án cần vừa giữ sự đồng bộ trong không gian chung, vừa cá nhân hóa phòng riêng cho từng thành viên.',
      solution:
        'Bố cục nội thất được tối ưu theo từng hoạt động: tiếp khách, dùng bữa, nấu nướng, nghỉ ngơi và học tập. Hệ tủ được tích hợp sát tường để tiết kiệm diện tích; ánh sáng được đặt theo lớp để không gian ban ngày đủ sáng, ban đêm có cảm giác ấm.',
      highlights: [
        'Phòng khách ấm áp với bố cục dễ tiếp khách và sinh hoạt gia đình',
        'Khu bàn ăn và bếp liên kết chặt chẽ, thuận tiện trong sử dụng',
        'Phòng ngủ chính giữ tinh thần thư thái, gọn và riêng tư',
        'Phòng bé có màu sắc cá tính nhưng vẫn linh hoạt lâu dài'
      ],
      materials: [
        'Gỗ công nghiệp phủ melamine hoặc laminate tông ấm',
        'Bề mặt đá hoặc vật liệu chống bám bẩn cho khu bếp',
        'Sơn màu trung tính kết hợp điểm nhấn nhẹ cho phòng bé',
        'Đèn âm trần, đèn hắt và phụ kiện kim loại mảnh'
      ]
    }
  },
  {
    id: 6,
    name: 'Không gian văn phòng Lai Huy',
    slug: 'khong-gian-van-phong-lai-huy',
    category: 'COMMERCIAL',
    categoryName: 'Thương mại',
    segment: 'office',
    shortDescription:
      'Văn phòng hiện đại, tinh gọn và hiệu quả cho làm việc nhóm, gặp gỡ khách hàng và vận hành hằng ngày.',
    description: [
      'Không gian văn phòng được tổ chức quanh bàn làm việc dài, hệ lưu trữ tích hợp và nền vật liệu hiện đại.',
      'Các đường sáng tuyến tính giúp định hình không gian, đồng thời tạo cảm giác chuyên nghiệp và tập trung.',
      'Thiết kế hướng đến một môi trường làm việc gọn gàng, linh hoạt và có hình ảnh thương hiệu rõ ràng.'
    ],
    ...createImageAliases(officeWorkspaceImages),
    location: 'Việt Nam',
    area: 'Không gian làm việc nhóm',
    year: '2026',
    style: 'Hiện đại tối giản',
    scope: [
      'Thiết kế văn phòng',
      'Sản xuất bàn dài và hệ tủ',
      'Thi công khu làm việc',
      'Hoàn thiện ánh sáng và lưu trữ'
    ],
    materials: [
      'Gỗ công nghiệp phủ melamine/laminate',
      'Kính cường lực',
      'Khung nhôm sơn tĩnh điện',
      'Đèn tuyến tính LED'
    ],
    content: {
      overview:
        'Không gian văn phòng được xây dựng với định hướng tạo ra môi trường làm việc có tính tập trung cao, đồng thời vẫn đủ cởi mở cho các hoạt động trao đổi nhóm và tiếp khách.',
      challenge:
        'Văn phòng cần tối ưu diện tích, đủ lưu trữ và giữ hình ảnh chuyên nghiệp trong vận hành hằng ngày.',
      solution:
        'Không gian được chia thành lớp làm việc chính, lớp lưu trữ phía sau và các vùng kỹ thuật được xử lý kín đáo. Hệ đèn tuyến tính trên trần vừa bổ sung ánh sáng cho bàn làm việc, vừa tạo nhịp điệu thị giác.',
      highlights: [
        'Bàn làm việc dài hỗ trợ làm việc nhóm và các buổi trao đổi nhanh',
        'Hệ tủ âm giảm nhiễu thị giác, giữ không gian làm việc gọn gàng',
        'Ánh sáng tuyến tính tạo cảm giác hiện đại và định hướng rõ ràng',
        'Kính, gỗ và bề mặt tối màu tạo hình ảnh chuyên nghiệp'
      ],
      materials: [
        'Gỗ công nghiệp phủ melamine hoặc laminate tông trung tính',
        'Kính cường lực và khung nhôm sơn tĩnh điện',
        'Đèn tuyến tính LED cho khu vực làm việc chính',
        'Bề mặt tủ màu tối giúp tăng chiều sâu và sự tập trung'
      ]
    }
  }
]
