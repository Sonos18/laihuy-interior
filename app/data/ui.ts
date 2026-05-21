import type { LocalizedText } from '~/shared/types/localization'

export type LocalizedNavLink = {
  label: LocalizedText
  to: string
}

export const navLinks: LocalizedNavLink[] = [
  { label: { vi: 'Trang chủ', en: 'Home' }, to: '/' },
  { label: { vi: 'Dự án', en: 'Projects' }, to: '/du-an' },
  { label: { vi: 'Nhà xưởng', en: 'Factory' }, to: '/nha-xuong' },
  { label: { vi: 'Dịch vụ', en: 'Services' }, to: '/dich-vu' },
  { label: { vi: 'Giới thiệu', en: 'About' }, to: '/gioi-thieu' },
  { label: { vi: 'Tuyển dụng', en: 'Careers' }, to: '/tuyen-dung' },
  { label: { vi: 'Liên hệ', en: 'Contact' }, to: '/lien-he' }
]

export const uiText = {
  language: {
    vi: 'Tiếng Việt',
    en: 'English'
  },
  labels: {
    navigation: { vi: 'Điều hướng', en: 'Navigation' },
    services: { vi: 'Dịch vụ', en: 'Services' },
    contact: { vi: 'Liên hệ', en: 'Contact' },
    phone: { vi: 'Điện thoại', en: 'Phone' },
    email: { vi: 'Email', en: 'Email' },
    workingHours: { vi: 'Giờ làm việc', en: 'Working hours' },
    openMaps: { vi: 'Mở Google Maps', en: 'Open Google Maps' },
    callNow: { vi: 'Gọi ngay', en: 'Call now' },
    sendEmail: { vi: 'Gửi email', en: 'Send email' },
    factoryDirectContractor: {
      vi: 'Nhà thầu nội thất trực tiếp từ xưởng',
      en: 'Factory-direct interior contractor'
    },
    caseStudies: { vi: 'Dự án tiêu biểu', en: 'Featured case studies' },
    productionWorkflow: { vi: 'Quy trình triển khai', en: 'Production workflow' },
    machinery: { vi: 'Máy móc sản xuất', en: 'Machinery system' },
    qualityControl: { vi: 'Kiểm soát chất lượng', en: 'Quality control' },
    openPositions: { vi: 'Vị trí đang tuyển', en: 'Open positions' },
    all: { vi: 'Tất cả', en: 'All' },
    overview: { vi: 'Tổng quan', en: 'Overview' },
    challenge: { vi: 'Thách thức', en: 'Challenge' },
    scope: { vi: 'Phạm vi công việc', en: 'Scope of work' },
    solution: { vi: 'Giải pháp triển khai', en: 'Delivery solution' },
    gallery: { vi: 'Gallery dự án', en: 'Project gallery' },
    completedImages: { vi: 'Hình hoàn thiện', en: 'Completed images' },
    relatedProjects: { vi: 'Dự án liên quan', en: 'Related projects' },
    exploreMore: { vi: 'Khám phá thêm', en: 'Explore more' }
  },
  cta: {
    quote24h: { vi: 'Nhận báo giá trong 24h', en: 'Get a quote within 24h' },
    sendDrawings: {
      vi: 'Gửi bản vẽ nhận BOQ sơ bộ',
      en: 'Send drawings for preliminary BOQ'
    },
    hotelConsult: {
      vi: 'Tư vấn thi công khách sạn',
      en: 'Consult hotel interior solutions'
    },
    factory: { vi: 'Xem năng lực nhà xưởng', en: 'View factory capability' },
    projects: { vi: 'Xem dự án tiêu biểu', en: 'View featured projects' },
    contact: { vi: 'Liên hệ tư vấn', en: 'Contact our team' },
    allProjects: { vi: 'Xem tất cả dự án', en: 'View all projects' },
    backToProjects: { vi: 'Quay lại danh sách dự án', en: 'Back to projects' },
    sendCv: { vi: 'Gửi CV qua email', en: 'Send CV by email' }
  },
  projectFacts: {
    category: { vi: 'Hạng mục', en: 'Category' },
    location: { vi: 'Vị trí', en: 'Location' },
    scale: { vi: 'Quy mô', en: 'Scale' },
    rooms: { vi: 'Số phòng', en: 'Rooms' },
    duration: { vi: 'Thời gian', en: 'Duration' },
    year: { vi: 'Năm', en: 'Year' },
    scope: { vi: 'Phạm vi', en: 'Scope' },
    materials: { vi: 'Vật liệu chính', en: 'Main materials' },
    fallbackMetric: { vi: 'Dự án nội thất', en: 'Interior project' }
  }
}
