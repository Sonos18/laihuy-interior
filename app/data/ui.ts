import type { Locale, LocalizedText } from '~/shared/types/localization'

export type LocalizedNavLink = {
  label: LocalizedText
  to: string
}

export type LocaleOption = {
  label: string
  value: Locale
}

/** An option of a contact-form select. `id` is the stable value; the label follows the locale. */
export type ContactFormOption = {
  id: string
  label: LocalizedText
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
    /* The number is part of the label: one action, one name. The same string is the visible text
       and the accessible name, so a screen-reader user hears what a sighted user reads. The
       number mirrors `company.phoneDisplay`; the `tel:` target stays `company.phone`. */
    callNow: { vi: 'Gọi 0903 102 012', en: 'Call +84 903 102 012' },
    sendEmail: { vi: 'Gửi email', en: 'Email us' },
    caseStudies: { vi: 'Dự án đã thực hiện', en: 'Our projects' },
    openPositions: { vi: 'Vị trí đang tuyển', en: 'Open positions' },
    /** Careers eyebrow; `{n}` is replaced with the number of open roles. */
    openPositionsCount: { vi: '{n} vị trí · toàn thời gian', en: '{n} roles · full-time' },
    all: { vi: 'Tất cả', en: 'All' },
    gallery: { vi: 'Thư viện ảnh dự án', en: 'Project gallery' },
    completedImages: { vi: 'Hình ảnh', en: 'Images' },
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
  /* One label per action (copy deck 2.1). `quote24h` keeps its historical key although the
     label no longer carries the 24h promise: it is imported by name across the site. The promise
     now lives in a full sentence on /lien-he, the home CTA block and the project finale. */
  cta: {
    quote24h: { vi: 'Nhận báo giá', en: 'Request a quote' },
    sendDrawings: {
      vi: 'Gửi bản vẽ, nhận BOQ sơ bộ',
      en: 'Send drawings for a preliminary BOQ'
    },
    hotelConsult: {
      vi: 'Tư vấn thi công khách sạn',
      en: 'Consult hotel interior solutions'
    },
    factory: { vi: 'Xem năng lực nhà xưởng', en: 'View factory capability' },
    contact: { vi: 'Nhận báo giá', en: 'Request a quote' },
    allProjects: { vi: 'Xem tất cả dự án', en: 'View all projects' },
    /** `{n}` is replaced with the total number of images in the lightbox. */
    allProjectImages: { vi: 'Xem đủ {n} hình', en: 'View all {n} images' },
    sendCv: { vi: 'Gửi CV qua email', en: 'Send your CV by email' }
  },
  galleryCarousel: {
    region: { vi: 'Bộ sưu tập hình ảnh', en: 'Image gallery' },
    role: { vi: 'trình chiếu', en: 'carousel' },
    previous: { vi: 'Ảnh trước', en: 'Previous image' },
    next: { vi: 'Ảnh tiếp theo', en: 'Next image' },
    pause: { vi: 'Tạm dừng trình chiếu', en: 'Pause slideshow' },
    play: { vi: 'Tiếp tục trình chiếu', en: 'Resume slideshow' },
    enlarge: { vi: 'Phóng to ảnh', en: 'Enlarge image' },
    image: { vi: 'Ảnh', en: 'Image' }
  },
  /**
   * /lien-he page copy outside the form: the hero lead, the direct-contact block, the
   * "how to send documents" block and the map caption. Phone and email are quoted literally in
   * running text, as everywhere in the copy deck; `company` is the source for links.
   */
  contactPage: {
    lead: {
      vi: 'Gọi 0903 102 012 hoặc gửi email noithatlaihuy@gmail.com. Báo giá trong 24 giờ làm việc kể từ khi nhận đủ bản vẽ hoặc thông tin dự án.',
      en: 'Call +84 903 102 012 or email noithatlaihuy@gmail.com. We quote within 24 working hours of receiving complete drawings or project details.'
    },
    heroImageAlt: {
      vi: 'Nhà vườn Chi Ly, Vĩnh Long: phòng khách',
      en: 'Chi Ly Garden Villa, Vinh Long: living room'
    },
    direct: {
      eyebrow: { vi: 'Liên hệ trực tiếp', en: 'Reach us directly' },
      /* Owner decision (deck §1): no promise about when an out-of-hours email is answered. */
      note: {
        vi: 'Ngoài giờ làm việc, hãy gửi email.',
        en: 'Outside these hours, please email us.'
      }
    },
    sendDocs: {
      heading: { vi: 'Cách gửi hồ sơ', en: 'How to send your documents' },
      lead: {
        vi: 'Gửi hồ sơ qua email noithatlaihuy@gmail.com. Lai Huy bóc tách khối lượng, lập BOQ sơ bộ (bảng khối lượng) và gửi báo giá.',
        en: 'Email your documents to noithatlaihuy@gmail.com. Lai Huy does the take-off, prepares a preliminary BOQ (bill of quantities) and sends a quote.'
      },
      items: [
        {
          vi: 'Bản vẽ: PDF để xem nhanh; DWG nếu cần bóc tách chính xác.',
          en: 'Drawings: PDF for review; DWG when an accurate take-off is needed.'
        },
        {
          vi: 'BOQ nếu đã có; chưa có thì Lai Huy lập BOQ sơ bộ từ bản vẽ.',
          en: 'Your BOQ, if you have one; if not, Lai Huy prepares a preliminary BOQ from the drawings.'
        },
        {
          vi: 'Tiêu chuẩn hoàn thiện: mã vật liệu, màu, phụ kiện, mẫu đã duyệt (nếu có).',
          en: 'Finish standards: material codes, colours, hardware, approved samples (if any).'
        },
        {
          vi: 'Thông tin dự án: địa điểm, số phòng hoặc diện tích, thời gian cần bàn giao.',
          en: 'Project details: location, room count or floor area, required handover date.'
        },
        {
          vi: 'File quá lớn để đính kèm: gửi link Google Drive (hoặc dịch vụ tương tự) và mở quyền xem cho noithatlaihuy@gmail.com.',
          en: 'Files too large to attach: share a Google Drive link (or similar) with view access for noithatlaihuy@gmail.com.'
        }
      ] satisfies LocalizedText[],
      subjectLabel: { vi: 'Tiêu đề email mẫu', en: 'Subject template' },
      subjectTemplate: {
        vi: '[Báo giá] Loại dự án – Tên dự án – Họ tên / Công ty',
        en: '[Quote] Project type – Project name – Your name / Company'
      },
      subjectExample: {
        vi: '[Báo giá] Khách sạn – 40 phòng tại Đà Nẵng – Công ty ABC',
        en: ''
      },
      exampleLabel: { vi: 'Ví dụ', en: 'Example' },
      confidentiality: {
        vi: 'Tài liệu cần bảo mật? Ghi rõ trong email; Lai Huy chỉ dùng hồ sơ để bóc tách và báo giá.',
        en: 'Confidential documents? Say so in your email; Lai Huy uses them only for take-off and quoting.'
      }
    },
    map: {
      eyebrow: { vi: 'Địa chỉ', en: 'Addresses' },
      heading: { vi: 'Văn phòng và nhà xưởng', en: 'Office and factory' },
      iframeTitle: {
        vi: 'Bản đồ nhà xưởng Lai Huy Interior',
        en: 'Map to the Lai Huy Interior factory'
      },
      caption: {
        vi: 'Bản đồ hiển thị nhà xưởng tại Vĩnh Long. Tham quan theo lịch hẹn: gọi 0903 102 012.',
        en: 'The map shows our factory in Vinh Long. Visits by appointment: call +84 903 102 012.'
      }
    }
  },
  /**
   * /lien-he form copy. Field labels stay in `labels` where they are shared (phone, email);
   * everything here is form-specific — placeholders, validation messages, the mailto template.
   *
   * The form has no transport. Submitting it opens the visitor's own mail client with a prefilled
   * message to the company mailbox, and the visitor presses Send there. No string below may say
   * or imply that a request was sent, received or stored by the site.
   *
   * Validation messages say how to complete the enquiry, not only what went wrong.
   */
  contactForm: {
    eyebrow: { vi: 'Soạn yêu cầu báo giá', en: 'Draft a quote request' },
    heading: { vi: 'Điền thông tin, mở email soạn sẵn', en: 'Fill in the details, open a ready-made email' },
    note: {
      vi: 'Điền các mục bên dưới rồi bấm nút: ứng dụng email trên máy bạn sẽ mở với nội dung soạn sẵn, gửi tới noithatlaihuy@gmail.com. Bạn kiểm tra, đính kèm bản vẽ nếu có, rồi bấm Gửi. Trang này không tự gửi hay lưu thông tin của bạn.',
      en: 'Fill in the fields and press the button: your email app will open with a ready-made message to noithatlaihuy@gmail.com. Check it, attach any drawings, then press Send. This page does not send or store your details.'
    },
    requiredNote: {
      vi: 'Mục có dấu * là bắt buộc.',
      en: 'Fields marked * are required.'
    },
    fields: {
      name: { vi: 'Họ tên', en: 'Full name' },
      company: { vi: 'Công ty / đơn vị (nếu có)', en: 'Company (optional)' },
      projectType: { vi: 'Loại dự án', en: 'Project type' },
      scope: { vi: 'Phạm vi cần báo giá (không bắt buộc)', en: 'Scope to quote (optional)' },
      message: { vi: 'Thông tin dự án', en: 'Project details' }
    },
    placeholders: {
      name: { vi: 'Tên của bạn', en: 'Your name' },
      company: { vi: 'Tên công ty hoặc văn phòng thiết kế', en: 'Company or design studio' },
      phone: { vi: '0903 123 456', en: '+84 903 123 456' },
      email: { vi: 'ten@congty.com', en: 'name@company.com' },
      projectType: { vi: 'Chọn loại dự án', en: 'Select a project type' },
      message: {
        vi: 'Địa điểm, số phòng hoặc diện tích, vật liệu mong muốn, thời gian cần bàn giao. Có bản vẽ thì ghi "có bản vẽ" để nhớ đính kèm vào email.',
        en: 'Location, room count or floor area, preferred materials, required handover date. Have drawings? Note it so you remember to attach them.'
      }
    },
    /** Order is the order of the dropdown. The last entry is the catch-all. */
    projectTypes: [
      { id: 'hotel', label: { vi: 'Khách sạn & resort', en: 'Hotel & resort' } },
      { id: 'residential', label: { vi: 'Villa, căn hộ, nhà phố', en: 'Villa, apartment or townhouse' } },
      { id: 'office', label: { vi: 'Văn phòng & thương mại', en: 'Office & commercial' } },
      { id: 'oem', label: { vi: 'Gia công OEM / xuất khẩu', en: 'OEM / export production' } },
      { id: 'other', label: { vi: 'Khác', en: 'Other' } }
    ] satisfies ContactFormOption[],
    /** Optional. The empty value reads as `scopeUnspecified`, which is also what the mailto says. */
    scopes: [
      { id: 'full', label: { vi: 'Thiết kế, sản xuất và thi công', en: 'Design, production and fit-out' } },
      { id: 'production', label: { vi: 'Sản xuất theo bản vẽ', en: 'Production to drawings' } },
      {
        id: 'production-install',
        label: { vi: 'Sản xuất và lắp đặt theo bản vẽ', en: 'Production and installation to drawings' }
      }
    ] satisfies ContactFormOption[],
    scopeUnspecified: { vi: 'Chưa xác định', en: 'Not sure yet' },
    submit: { vi: 'Soạn email với thông tin này', en: 'Compose an email with these details' },
    submitHint: {
      vi: 'Nút này mở ứng dụng email trên máy bạn. Không thấy gì mở ra? Gửi email tới noithatlaihuy@gmail.com hoặc gọi 0903 102 012.',
      en: 'This opens the email app on your device. Nothing happened? Email noithatlaihuy@gmail.com or call +84 903 102 012.'
    },
    /** Shown after a valid submit. Must never say "sent" or "received": nothing leaves the page. */
    opened: {
      vi: 'Ứng dụng email của bạn đang mở với nội dung soạn sẵn. Lai Huy chỉ nhận được yêu cầu sau khi bạn bấm Gửi trong ứng dụng email.',
      en: 'Your email app should now be open with the details filled in. Lai Huy receives your request only once you press Send there.'
    },
    required: { vi: 'bắt buộc', en: 'required' },
    /** The pieces of the prefilled email, in the visitor's language. See buildQuoteMailto. */
    mailto: {
      subjectTag: { vi: '[Báo giá]', en: '[Quote request]' },
      greeting: { vi: 'Kính gửi Lai Huy Interior,', en: 'Dear Lai Huy Interior,' },
      intro: {
        vi: 'Tôi cần báo giá cho dự án sau.',
        en: 'I would like a quote for the following project.'
      },
      labels: {
        name: { vi: 'Họ tên', en: 'Name' },
        company: { vi: 'Công ty / đơn vị', en: 'Company' },
        phone: { vi: 'Điện thoại', en: 'Phone' },
        email: { vi: 'Email', en: 'Email' },
        projectType: { vi: 'Loại dự án', en: 'Project type' },
        scope: { vi: 'Phạm vi cần báo giá', en: 'Scope to quote' },
        details: { vi: 'Thông tin dự án', en: 'Project details' }
      },
      attachments: {
        vi: 'Hồ sơ đính kèm: [đính kèm bản vẽ PDF/DWG, BOQ, tiêu chuẩn hoàn thiện nếu có, hoặc dán link Google Drive]',
        en: 'Attachments: [attach PDF/DWG drawings, BOQ and finish standards if available, or paste a Google Drive link]'
      },
      footer: {
        vi: '(Email soạn từ trang Liên hệ của noithatlaihuy.vn)',
        en: '(Drafted from the Contact page at noithatlaihuy.vn)'
      }
    },
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
      email: { vi: 'Nhập email để Lai Huy gửi báo giá.', en: 'Enter your email so we can send the quote.' },
      emailInvalid: {
        vi: 'Email chưa hợp lệ — ví dụ: ten@congty.com',
        en: 'That email doesn’t look right — for example: name@company.com'
      },
      projectType: { vi: 'Chọn loại dự án gần nhất với công trình của bạn.', en: 'Choose the project type closest to yours.' },
      message: {
        vi: 'Nhập mô tả ngắn về dự án để hoàn tất yêu cầu báo giá.',
        en: 'Enter a short project description to complete the quote request.'
      },
      messageTooShort: {
        vi: 'Cho chúng tôi thêm một chút chi tiết (ít nhất 10 ký tự).',
        en: 'Tell us a little more (at least 10 characters).'
      },
      messageTooLong: {
        vi: 'Nội dung quá dài để soạn email tự động. Hãy rút gọn, hoặc gửi email trực tiếp tới noithatlaihuy@gmail.com.',
        en: 'That’s too long to pre-fill an email. Shorten it, or email noithatlaihuy@gmail.com directly.'
      }
    }
  },
  /**
   * app/error.vue. Two cases only, because only two are distinguishable to a visitor: the
   * address is wrong (404) or the site is (everything else). The copy takes the blame in the
   * 500 case and does not in the 404 case — a visitor who mistyped a URL should not be
   * apologised to, and a visitor hitting a server fault should not be blamed.
   */
  errorPage: {
    notFound: {
      code: { vi: '404', en: '404' },
      eyebrow: { vi: 'Lỗi 404', en: '404 error' },
      title: {
        vi: 'Không tìm thấy trang',
        en: 'Page not found'
      },
      body: {
        vi: 'Đường dẫn có thể đã thay đổi hoặc dự án đã được sắp xếp lại. Bắt đầu lại từ những trang dưới đây.',
        en: 'The link may have changed or the project may have moved. Start again from one of the pages below.'
      }
    },
    serverError: {
      code: { vi: '500', en: '500' },
      eyebrow: { vi: 'Lỗi hệ thống', en: 'System error' },
      title: {
        vi: 'Có lỗi phía chúng tôi',
        en: 'The error is on our side'
      },
      body: {
        vi: 'Trang không tải được do lỗi hệ thống. Thử tải lại, hoặc gọi trực tiếp nếu bạn đang cần gấp.',
        en: 'The page failed to load because of a fault on our side. Try again, or call us directly if it’s urgent.'
      }
    },
    retry: { vi: 'Tải lại trang', en: 'Reload the page' },
    home: { vi: 'Về trang chủ', en: 'Back to home' }
  }
}
