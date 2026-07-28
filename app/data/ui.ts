import type { Locale, LocalizedText } from '~/shared/types/localization'

export type LocalizedNavLink = {
  label: LocalizedText
  to: string
}

export type LocaleOption = {
  label: string
  value: Locale
}

/** Shared by AppHeader and AppDrawer. Extracted verbatim from app.vue in Phase 1. */
export const localeOptions: LocaleOption[] = [
  { label: 'VI', value: 'vi' },
  { label: 'EN', value: 'en' }
]

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
      vi: 'Nhà thầu sản xuất, thiết kế & thi công nội thất',
      en: 'Manufacturing, design & interior contracting'
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
    exploreMore: { vi: 'Khám phá thêm', en: 'Explore more' },
    /** Footer copyright, minus the year and company name the component supplies. */
    rightsReserved: { vi: 'Bảo lưu mọi quyền.', en: 'All rights reserved.' }
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
  form: {
    heading: { vi: 'Gửi yêu cầu tư vấn dự án', en: 'Send a project consultation request' },
    intro: {
      vi: 'Điền thông tin công trình, Lai Huy Interior phản hồi phương án sản xuất và thi công trong 24 giờ làm việc.',
      en: 'Tell us about the project and Lai Huy Interior will respond with a production and contracting approach within 24 working hours.'
    },
    orCall: { vi: 'hoặc gọi ngay', en: 'or call us now' },
    name: { vi: 'Họ tên', en: 'Name' },
    namePlaceholder: { vi: 'Tên của bạn', en: 'Your name' },
    phonePlaceholder: { vi: '+84...', en: '+84...' },
    emailPlaceholder: { vi: 'email@example.com', en: 'email@example.com' },
    projectType: { vi: 'Loại dự án', en: 'Project type' },
    projectTypePlaceholder: { vi: 'Chọn loại dự án', en: 'Select project type' },
    message: { vi: 'Thông tin công trình', en: 'Project information' },
    messagePlaceholder: {
      vi: 'Quy mô, số phòng, vật liệu mong muốn, tiến độ dự kiến...',
      en: 'Scale, room count, preferred materials, target schedule...'
    },
    submit: { vi: 'Gửi yêu cầu', en: 'Send request' },
    submitting: { vi: 'Đang gửi...', en: 'Sending...' },
    /** The hero promises "gửi bản vẽ, BOQ" but the form has no upload — this is the honest route. */
    attachmentNote: { vi: 'Có bản vẽ hoặc BOQ? Gửi kèm qua', en: 'Have drawings or a BOQ? Send them to' },
    mailtoNote: {
      vi: 'Biểu mẫu mở ứng dụng email trên thiết bị của bạn với nội dung đã điền sẵn.',
      en: 'This form opens your email app with a prepared message.'
    },
    noEmailApp: { vi: 'Không mở được email?', en: 'No email app?' },
    call: { vi: 'Gọi', en: 'Call' },
    responsePromise: { vi: 'Phản hồi trong 24 giờ làm việc', en: 'A reply within 24 working hours' },
    errors: {
      required: { vi: 'Vui lòng điền thông tin này.', en: 'This field is required.' },
      emailFormat: { vi: 'Email chưa đúng định dạng.', en: 'That email address is not valid.' },
      phoneFormat: { vi: 'Số điện thoại chưa đủ chữ số.', en: 'That phone number is too short.' },
      tooShort: { vi: 'Vui lòng mô tả thêm về công trình.', en: 'Please describe the project in a little more detail.' }
    },
    errorSummary: {
      vi: 'Biểu mẫu còn thông tin chưa hợp lệ. Vui lòng kiểm tra các ô được đánh dấu.',
      en: 'The form has invalid fields. Please check the marked inputs.'
    },
    successHeading: { vi: 'Đã mở email của bạn', en: 'Your email app is open' },
    successBody: {
      vi: 'Nội dung đã được điền sẵn — bạn chỉ cần bấm gửi. Lai Huy Interior sẽ phản hồi trong 24 giờ làm việc.',
      en: 'The message is prepared — just press send. Lai Huy Interior will reply within 24 working hours.'
    },
    successReset: { vi: 'Gửi một yêu cầu khác', en: 'Send another request' },
    failureHeading: { vi: 'Chưa gửi được', en: 'That did not go through' },
    failureBody: {
      vi: 'Vui lòng thử lại, hoặc gọi trực tiếp để được tư vấn ngay.',
      en: 'Please try again, or call us directly for immediate help.'
    },
    retry: { vi: 'Thử lại', en: 'Try again' }
  },
  projectFacts: {
    category: { vi: 'Hạng mục', en: 'Category' },
    location: { vi: 'Địa điểm', en: 'Location' },
    scale: { vi: 'Quy mô', en: 'Scale' },
    rooms: { vi: 'Tổng khối lượng', en: 'Total volume' },
    duration: { vi: 'Tiến độ', en: 'Timeline' },
    year: { vi: 'Năm hoàn thành', en: 'Completion year' },
    scope: { vi: 'Phạm vi', en: 'Scope' },
    materials: { vi: 'Vật liệu chính', en: 'Main materials' },
    fallbackMetric: { vi: 'Dự án nội thất', en: 'Interior project' }
  }
}
