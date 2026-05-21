import type { LocalizedArray, LocalizedText } from '~/shared/types/localization'

export type Job = {
  id: string
  title: LocalizedText
  location: LocalizedText
  type: LocalizedText
  description: LocalizedText
  requirements: LocalizedArray
}

export const jobs: Job[] = [
  {
    id: 'quan-doc-xuong',
    title: 'Quản đốc xưởng',
    location: 'Bến Tre',
    type: 'Toàn thời gian',
    description:
      'Quản lý tiến độ sản xuất, nhân sự xưởng và chất lượng đầu ra cho các hạng mục nội thất dự án.',
    requirements: [
      'Có kinh nghiệm quản lý sản xuất nội thất hoặc đồ gỗ',
      'Đọc hiểu bản vẽ kỹ thuật và kế hoạch sản xuất',
      'Có khả năng điều phối nhân sự, vật tư và tiến độ'
    ]
  },
  {
    id: 'ky-thuat-san-xuat',
    title: 'Kỹ thuật sản xuất',
    location: 'Bến Tre',
    type: 'Toàn thời gian',
    description:
      'Bóc tách bản vẽ, triển khai chi tiết sản xuất và phối hợp xưởng trong quá trình gia công nội thất.',
    requirements: [
      'Sử dụng tốt phần mềm triển khai bản vẽ nội thất',
      'Hiểu cấu tạo đồ gỗ công nghiệp và phụ kiện',
      'Cẩn thận, chủ động kiểm tra sai lệch trước sản xuất'
    ]
  },
  {
    id: 'thiet-ke-noi-that',
    title: 'Nhân viên thiết kế nội thất',
    location: 'Long Hậu / Bến Tre',
    type: 'Toàn thời gian',
    description:
      'Phát triển concept, phối cảnh và hồ sơ thiết kế cho khách sạn, villa, căn hộ và dự án thương mại.',
    requirements: [
      'Có tư duy thẩm mỹ hiện đại, hiểu vật liệu nội thất',
      'Thành thạo phần mềm thiết kế 2D/3D phù hợp vị trí',
      'Có khả năng làm việc với hồ sơ dự án và phản hồi kỹ thuật'
    ]
  },
  {
    id: 'tho-moc-lap-dat',
    title: 'Thợ mộc / thợ lắp đặt',
    location: 'Bến Tre / công trình',
    type: 'Toàn thời gian',
    description:
      'Gia công, hoàn thiện và lắp đặt các hạng mục nội thất tại xưởng hoặc công trình theo bản vẽ.',
    requirements: [
      'Có kinh nghiệm mộc nội thất hoặc lắp đặt công trình',
      'Biết sử dụng dụng cụ, máy móc cơ bản an toàn',
      'Kỷ luật, đúng giờ và có trách nhiệm với chất lượng hoàn thiện'
    ]
  },
  {
    id: 'giam-sat-cong-trinh',
    title: 'Giám sát công trình',
    location: 'Toàn quốc theo dự án',
    type: 'Toàn thời gian',
    description:
      'Giám sát tiến độ lắp đặt, phối hợp hiện trường và nghiệm thu hạng mục nội thất dự án.',
    requirements: [
      'Có kinh nghiệm giám sát nội thất hoặc hoàn thiện công trình',
      'Đọc hiểu bản vẽ, biết lập kế hoạch triển khai',
      'Giao tiếp tốt với chủ đầu tư, thầu phụ và đội lắp dựng'
    ]
  },
  {
    id: 'kinh-doanh-du-an',
    title: 'Nhân viên kinh doanh dự án',
    location: 'Long Hậu / linh hoạt',
    type: 'Toàn thời gian',
    description:
      'Phát triển khách hàng B2B, tiếp nhận yêu cầu báo giá và phối hợp nội bộ để tư vấn giải pháp dự án.',
    requirements: [
      'Có kinh nghiệm kinh doanh B2B, xây dựng hoặc nội thất là lợi thế',
      'Có khả năng đọc nhu cầu khách hàng và theo dõi cơ hội dự án',
      'Giao tiếp chuyên nghiệp, chủ động và có trách nhiệm'
    ]
  }
]

export const careerBenefits = [
  'Môi trường sản xuất và thi công nội thất dự án thực tế',
  'Cơ hội tham gia khách sạn, villa và công trình quy mô lớn',
  'Lộ trình phát triển kỹ năng kỹ thuật, quản lý và vận hành',
  'Đội ngũ làm việc trực tiếp giữa thiết kế, xưởng và công trình'
]
