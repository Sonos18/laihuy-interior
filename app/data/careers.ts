import type { LocalizedArray, LocalizedText } from '~/shared/types/localization'

export type Job = {
  id: string
  title: LocalizedText
  location: LocalizedText
  type: LocalizedText
  description: LocalizedText
  requirements: LocalizedArray
}

/* Job locations follow company.addresses (the single source of truth): the factory is at
 * Phú Khương, Vĩnh Long (the pre-merger Bến Tre city address) and the business office is at
 * Long Hậu IP, Tây Ninh. Earlier copies of this file said "Bến Tre", which no longer matches
 * the published company addresses. */

export const jobs: Job[] = [
  {
    id: 'quan-doc-xuong',
    title: { vi: 'Quản đốc xưởng', en: 'Workshop foreman' },
    location: { vi: 'Nhà xưởng — Vĩnh Long', en: 'Factory — Vinh Long' },
    type: { vi: 'Toàn thời gian', en: 'Full-time' },
    description: {
      vi: 'Quản lý tiến độ sản xuất, nhân sự xưởng và chất lượng đầu ra cho các hạng mục nội thất dự án.',
      en: 'Manage production schedule, workshop staffing and output quality for project interior packages.'
    },
    requirements: {
      vi: [
        'Có kinh nghiệm quản lý sản xuất nội thất hoặc đồ gỗ',
        'Đọc hiểu bản vẽ kỹ thuật và kế hoạch sản xuất',
        'Có khả năng điều phối nhân sự, vật tư và tiến độ'
      ],
      en: [
        'Experience managing furniture or woodworking production',
        'Able to read technical drawings and production plans',
        'Able to coordinate staffing, materials and schedules'
      ]
    }
  },
  {
    id: 'ky-thuat-san-xuat',
    title: { vi: 'Kỹ thuật sản xuất', en: 'Production engineer' },
    location: { vi: 'Nhà xưởng — Vĩnh Long', en: 'Factory — Vinh Long' },
    type: { vi: 'Toàn thời gian', en: 'Full-time' },
    description: {
      vi: 'Bóc tách bản vẽ, triển khai chi tiết sản xuất và phối hợp xưởng trong quá trình gia công nội thất.',
      en: 'Take off drawings, detail production documents and work with the workshop through machining.'
    },
    requirements: {
      vi: [
        'Sử dụng tốt phần mềm triển khai bản vẽ nội thất',
        'Hiểu cấu tạo đồ gỗ công nghiệp và phụ kiện',
        'Cẩn thận, chủ động kiểm tra sai lệch trước sản xuất'
      ],
      en: [
        'Proficient with furniture detailing software',
        'Understands panel furniture construction and hardware',
        'Careful; proactively checks for discrepancies before production'
      ]
    }
  },
  {
    id: 'thiet-ke-noi-that',
    title: { vi: 'Nhân viên thiết kế nội thất', en: 'Interior designer' },
    location: { vi: 'VP Long Hậu / Xưởng Vĩnh Long', en: 'Long Hau office / Vinh Long factory' },
    type: { vi: 'Toàn thời gian', en: 'Full-time' },
    description: {
      vi: 'Phát triển concept, phối cảnh và hồ sơ thiết kế cho khách sạn, villa, căn hộ và dự án thương mại.',
      en: 'Develop concepts, visuals and design documents for hotels, villas, apartments and commercial projects.'
    },
    requirements: {
      vi: [
        'Có tư duy thẩm mỹ hiện đại, hiểu vật liệu nội thất',
        'Thành thạo phần mềm thiết kế 2D/3D phù hợp vị trí',
        'Có khả năng làm việc với hồ sơ dự án và phản hồi kỹ thuật'
      ],
      en: [
        'A modern aesthetic sense and knowledge of interior materials',
        'Proficient in the 2D/3D design software the role requires',
        'Comfortable working with project documents and technical feedback'
      ]
    }
  },
  {
    id: 'tho-moc-lap-dat',
    title: { vi: 'Thợ mộc / thợ thi công', en: 'Carpenter / installer' },
    location: { vi: 'Xưởng Vĩnh Long / công trình', en: 'Vinh Long factory / on site' },
    type: { vi: 'Toàn thời gian', en: 'Full-time' },
    description: {
      vi: 'Gia công, hoàn thiện và thi công các hạng mục nội thất tại xưởng hoặc công trình theo bản vẽ.',
      en: 'Fabricate, finish and install interior items at the workshop or on site, to the drawings.'
    },
    requirements: {
      vi: [
        'Có kinh nghiệm mộc nội thất hoặc thi công công trình',
        'Biết sử dụng dụng cụ, máy móc cơ bản an toàn',
        'Kỷ luật, đúng giờ và có trách nhiệm với chất lượng hoàn thiện'
      ],
      en: [
        'Experience in furniture carpentry or site installation',
        'Safe with basic tools and machinery',
        'Disciplined, punctual and accountable for finish quality'
      ]
    }
  },
  {
    id: 'giam-sat-cong-trinh',
    title: { vi: 'Giám sát công trình', en: 'Site supervisor' },
    location: { vi: 'Toàn quốc theo dự án', en: 'Nationwide, by project' },
    type: { vi: 'Toàn thời gian', en: 'Full-time' },
    description: {
      vi: 'Giám sát tiến độ thi công, phối hợp hiện trường và nghiệm thu hạng mục nội thất dự án.',
      en: 'Supervise installation progress, coordinate the site and manage sign-off of interior packages.'
    },
    requirements: {
      vi: [
        'Có kinh nghiệm giám sát nội thất hoặc hoàn thiện công trình',
        'Đọc hiểu bản vẽ, biết lập kế hoạch triển khai',
        'Giao tiếp tốt với chủ đầu tư, thầu phụ và đội lắp dựng'
      ],
      en: [
        'Experience supervising interiors or finishing works',
        'Reads drawings and can plan the execution',
        'Communicates well with owners, subcontractors and install teams'
      ]
    }
  },
  {
    id: 'kinh-doanh-du-an',
    title: { vi: 'Nhân viên kinh doanh dự án', en: 'Project sales executive' },
    location: { vi: 'VP Long Hậu / linh hoạt', en: 'Long Hau office / flexible' },
    type: { vi: 'Toàn thời gian', en: 'Full-time' },
    description: {
      vi: 'Phát triển khách hàng B2B, tiếp nhận yêu cầu báo giá và phối hợp nội bộ để tư vấn giải pháp dự án.',
      en: 'Develop B2B clients, handle quote requests and coordinate internally to advise on project solutions.'
    },
    requirements: {
      vi: [
        'Có kinh nghiệm kinh doanh B2B, xây dựng hoặc nội thất là lợi thế',
        'Có khả năng đọc nhu cầu khách hàng và theo dõi cơ hội dự án',
        'Giao tiếp chuyên nghiệp, chủ động và có trách nhiệm'
      ],
      en: [
        'B2B sales experience; construction or interiors a plus',
        'Able to read client needs and track project opportunities',
        'Professional, proactive and accountable in communication'
      ]
    }
  }
]

export const careerBenefits: LocalizedText[] = [
  {
    vi: 'Môi trường sản xuất và thi công nội thất dự án thực tế',
    en: 'Hands-on project production and installation environment'
  },
  {
    vi: 'Cơ hội tham gia khách sạn, villa và công trình quy mô lớn',
    en: 'Work on hotels, villas and large-scale projects'
  },
  {
    vi: 'Lộ trình phát triển kỹ năng kỹ thuật, quản lý và vận hành',
    en: 'A path to grow technical, management and operations skills'
  },
  {
    vi: 'Đội ngũ làm việc trực tiếp giữa thiết kế, xưởng và công trình',
    en: 'A team working directly across design, workshop and site'
  }
]
