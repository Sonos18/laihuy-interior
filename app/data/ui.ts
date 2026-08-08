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

/**
 * Footer band 4, right group. A LIST, not two hardcoded anchors: the bottom bar's three-group
 * grid is driven by this array, so adding a third legal document is a data change and needs no
 * template or CSS work.
 *
 * Both routes are real pages (app/pages/privacy-policy.vue, app/pages/terms-of-use.vue). Nothing
 * may be added here that does not resolve — a legal link that 404s is worse than an absent one,
 * which is why this array stayed empty until the pages existed.
 */
export const legalLinks: LocalizedNavLink[] = [
  { label: { vi: 'Chính sách bảo mật', en: 'Privacy Policy' }, to: '/privacy-policy' },
  { label: { vi: 'Điều khoản sử dụng', en: 'Terms of Use' }, to: '/terms-of-use' }
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
    rightsReserved: { vi: 'Bảo lưu mọi quyền.', en: 'All rights reserved.' },
    // --- Legal documents (/privacy-policy, /terms-of-use) ---------------------
    lastUpdated: { vi: 'Cập nhật lần cuối', en: 'Last updated' },
    company: { vi: 'Công ty', en: 'Company' },
    legalContactHeading: { vi: 'Thông tin liên hệ', en: 'Contact information' },
    legalContactBody: {
      vi: 'Nếu bạn có câu hỏi hoặc yêu cầu liên quan đến nội dung trang này, vui lòng liên hệ với chúng tôi qua các kênh sau:',
      en: 'If you have a question or a request relating to this document, please contact us through any of the channels below:'
    }
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
    workflow: { vi: 'Xem đầy đủ quy trình triển khai', en: 'View our complete project workflow' },
    projects: { vi: 'Xem dự án tiêu biểu', en: 'View featured projects' },
    contact: { vi: 'Liên hệ tư vấn', en: 'Contact our team' },
    allProjects: { vi: 'Xem tất cả dự án', en: 'View all projects' },
    allProjectImages: { vi: 'Xem toàn bộ hình ảnh', en: 'View all project images' },
    backToProjects: { vi: 'Quay lại danh sách dự án', en: 'Back to projects' },
    sendCv: { vi: 'Gửi CV qua email', en: 'Send CV by email' }
  },
  /**
   * /lien-he form copy. Field labels stay in `labels` where they are shared (phone, email);
   * everything here is form-specific — placeholders, validation messages, and the local
   * review states. The form has no transport; its copy must never imply delivery.
   *
   * Validation messages say how to complete the local review, not only what went wrong.
   */
  contactForm: {
    eyebrow: { vi: 'Kiểm tra cục bộ', en: 'Local review' },
    heading: { vi: 'Kiểm tra thông tin công trình', en: 'Review project information' },
    heroAction: { vi: 'Kiểm tra thông tin công trình', en: 'Review project information' },
    note: {
      vi: 'Công cụ này chỉ kiểm tra thông tin trên thiết bị của bạn và không gửi hoặc lưu dữ liệu. Sau khi kiểm tra, hãy gọi điện hoặc gửi email trực tiếp cho Lai Huy.',
      en: 'This tool only reviews information on your device and does not send or store data. After reviewing it, call or email Lai Huy directly.'
    },
    fields: {
      name: { vi: 'Họ tên', en: 'Name' },
      projectType: { vi: 'Loại dự án', en: 'Project type' },
      message: { vi: 'Thông tin công trình', en: 'Project information' }
    },
    placeholders: {
      name: { vi: 'Tên của bạn', en: 'Your name' },
      email: { vi: 'email@example.com', en: 'email@example.com' },
      projectType: { vi: 'Chọn loại dự án', en: 'Select project type' },
      message: {
        vi: 'Quy mô, số phòng, vật liệu mong muốn, tiến độ dự kiến...',
        en: 'Scale, room count, preferred materials, target schedule...'
      }
    },
    submit: { vi: 'Kiểm tra thông tin', en: 'Review information' },
    submitting: { vi: 'Đang kiểm tra trên thiết bị...', en: 'Reviewing on this device...' },
    required: { vi: 'bắt buộc', en: 'required' },
    errors: {
      summary: {
        vi: 'Vui lòng kiểm tra lại các trường được đánh dấu bên dưới.',
        en: 'Please check the highlighted fields below.'
      },
      name: { vi: 'Nhập họ tên để hoàn tất phần thông tin liên hệ.', en: 'Enter your name to complete the contact details.' },
      phone: { vi: 'Nhập số điện thoại để hoàn tất phần thông tin liên hệ.', en: 'Enter a phone number to complete the contact details.' },
      phoneInvalid: {
        vi: 'Số điện thoại chưa hợp lệ — kiểm tra lại giúp chúng tôi.',
        en: 'That phone number doesn’t look right — please check it.'
      },
      email: { vi: 'Nhập địa chỉ email hợp lệ.', en: 'Enter a valid email address.' },
      emailInvalid: {
        vi: 'Email chưa hợp lệ — ví dụ: ten@congty.com',
        en: 'That email doesn’t look right — for example: name@company.com'
      },
      projectType: { vi: 'Chọn loại dự án gần nhất với công trình của bạn.', en: 'Choose the project type closest to yours.' },
      message: {
        vi: 'Nhập mô tả ngắn về công trình để kiểm tra thông tin.',
        en: 'Enter a short project description for the local review.'
      },
      messageTooShort: {
        vi: 'Cho chúng tôi thêm một chút chi tiết (ít nhất 10 ký tự).',
        en: 'Tell us a little more (at least 10 characters).'
      }
    },
    reviewed: {
      title: { vi: 'Thông tin đã được kiểm tra trên thiết bị này', en: 'Information checked on this device' },
      body: {
        vi: 'Thông tin chưa được gửi cho Lai Huy và không được lưu. Để trao đổi với đội ngũ, vui lòng gọi điện hoặc gửi email trực tiếp.',
        en: 'The information has not been sent to Lai Huy and was not stored. To contact the team, please call or email directly.'
      },
      edit: { vi: 'Sửa thông tin', en: 'Edit information' },
      reset: { vi: 'Xóa thông tin', en: 'Clear information' }
    },
    localError: {
      title: { vi: 'Chưa thể hoàn tất kiểm tra cục bộ', en: 'The local review could not be completed' },
      body: {
        vi: 'Không có dữ liệu nào được gửi hoặc lưu. Bạn có thể thử kiểm tra lại, gọi điện hoặc gửi email trực tiếp.',
        en: 'No data was sent or stored. You can try the review again, call, or email directly.'
      }
    },
    status: {
      pending: { vi: 'Đang kiểm tra thông tin trên thiết bị này.', en: 'Reviewing information on this device.' }
    }
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
