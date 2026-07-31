import type { LocalizedArray, LocalizedText } from '~/shared/types/localization'

/**
 * One section of a legal document: a heading, an optional lead paragraph, and an optional list.
 * Both body and items are optional because the two shapes are genuinely different — some clauses
 * are a paragraph, some are an enumeration, and several are a paragraph that introduces one.
 */
export type LegalSection = {
  heading: LocalizedText
  body?: LocalizedText
  items?: LocalizedArray
}

export type LegalDocument = {
  title: LocalizedText
  /** Rendered under the title as the document's own summary, before the first section. */
  intro: LocalizedText
  sections: LegalSection[]
}

/**
 * The date both documents were last substantively revised. ISO, formatted per locale at render
 * time — a hardcoded "31/07/2026" string would be wrong on the English page.
 *
 * UPDATE THIS whenever a clause changes. It is the only claim on these pages that silently
 * becomes false with age, and a stale "last updated" on a privacy policy is a compliance problem
 * rather than a cosmetic one.
 */
export const legalUpdatedAt = '2026-07-31'

/*
 * ── A NOTE ON THIS FILE ────────────────────────────────────────────────────────
 * This content is written to be accurate about what THIS website actually does:
 * it describes the contact form, the language-preference cookie, and the media
 * host, because those are the only mechanisms the codebase actually has. It does
 * not describe analytics, advertising pixels, remarketing, or newsletter
 * processing — none of which this site runs. If any of those are added later,
 * the corresponding clause has to be added here in the same commit.
 *
 * Deliberately NOT asserted anywhere below: business registration number, tax
 * code, or a named data protection officer. Those are real registry facts that
 * nothing in this repository records, and inventing them on a legal page is
 * worse than omitting them. Add them here once someone can point at the
 * certificate.
 *
 * This is a good-faith operational description, not a substitute for review by
 * a Vietnamese lawyer before launch.
 */

export const privacyPolicy: LegalDocument = {
  title: { vi: 'Chính sách bảo mật', en: 'Privacy Policy' },
  intro: {
    vi: 'Lai Huy Interior tôn trọng và cam kết bảo vệ dữ liệu cá nhân của khách hàng, đối tác và ứng viên khi sử dụng website này. Chính sách dưới đây giải thích chúng tôi thu thập những thông tin nào, sử dụng vào mục đích gì, chia sẻ với ai và bạn có những quyền gì đối với dữ liệu của mình.',
    en: 'Lai Huy Interior respects and is committed to protecting the personal data of the clients, partners, and candidates who use this website. This policy explains what information we collect, why we use it, who we share it with, and what rights you hold over your own data.'
  },
  sections: [
    {
      heading: { vi: '1. Phạm vi áp dụng', en: '1. Scope' },
      body: {
        vi: 'Chính sách này áp dụng cho toàn bộ dữ liệu cá nhân mà Lai Huy Interior thu thập thông qua website, biểu mẫu liên hệ, email, điện thoại và các kênh trao đổi trực tiếp phục vụ hoạt động tư vấn, báo giá, sản xuất và thi công nội thất. Chính sách không áp dụng cho các website của bên thứ ba mà bạn truy cập qua đường dẫn đặt trên website này.',
        en: 'This policy applies to all personal data that Lai Huy Interior collects through the website, contact forms, email, telephone, and direct correspondence in the course of consulting, quoting, manufacturing, and installing interiors. It does not apply to third-party websites you reach through links published here.'
      }
    },
    {
      heading: { vi: '2. Dữ liệu cá nhân chúng tôi thu thập', en: '2. Personal data we collect' },
      body: {
        vi: 'Chúng tôi chỉ thu thập những thông tin cần thiết để phản hồi và triển khai yêu cầu của bạn:',
        en: 'We collect only the information needed to respond to and deliver on your request:'
      },
      items: {
        vi: [
          'Thông tin bạn chủ động cung cấp: họ tên, số điện thoại, địa chỉ email, tên công ty, nội dung yêu cầu và các tài liệu dự án bạn gửi kèm (bản vẽ, danh mục hạng mục, hình ảnh tham khảo).',
          'Thông tin trao đổi trong quá trình làm việc: nội dung email, tin nhắn, biên bản khảo sát và các thống nhất liên quan đến dự án.',
          'Dữ liệu kỹ thuật cơ bản do máy chủ ghi nhận khi bạn truy cập website: địa chỉ IP, loại trình duyệt, thiết bị và thời điểm truy cập, phục vụ mục đích vận hành và bảo mật hệ thống.',
          'Tùy chọn ngôn ngữ hiển thị được lưu trong cookie trên trình duyệt của bạn.'
        ],
        en: [
          'Information you actively provide: full name, telephone number, email address, company name, the substance of your enquiry, and any project documents you attach (drawings, scope schedules, reference images).',
          'Information exchanged during the engagement: emails, messages, site survey records, and agreed project decisions.',
          'Basic technical data logged by the server when you visit the website: IP address, browser type, device, and time of access, used for operating and securing the system.',
          'Your display language preference, stored in a cookie in your browser.'
        ]
      }
    },
    {
      heading: { vi: '3. Mục đích sử dụng dữ liệu', en: '3. How we use your data' },
      items: {
        vi: [
          'Tiếp nhận, tư vấn và phản hồi yêu cầu báo giá hoặc hợp tác của bạn.',
          'Lập báo giá, hợp đồng, hồ sơ kỹ thuật và triển khai sản xuất, thi công nội thất theo thỏa thuận.',
          'Liên hệ trao đổi tiến độ, nghiệm thu và bảo hành hạng mục đã thực hiện.',
          'Xử lý hồ sơ ứng tuyển đối với thông tin do ứng viên gửi qua kênh tuyển dụng.',
          'Vận hành, bảo trì và bảo vệ an toàn cho website.',
          'Thực hiện nghĩa vụ kế toán, thuế và các nghĩa vụ pháp lý khác theo quy định của pháp luật Việt Nam.'
        ],
        en: [
          'Receiving, advising on, and responding to your quotation or partnership enquiry.',
          'Preparing quotations, contracts, and technical documentation, and carrying out the agreed manufacturing and installation work.',
          'Communicating about schedule, handover, and warranty for completed scope.',
          'Processing job applications, for information submitted through our recruitment channel.',
          'Operating, maintaining, and securing the website.',
          'Meeting accounting, tax, and other legal obligations under Vietnamese law.'
        ]
      }
    },
    {
      heading: { vi: '4. Cơ sở pháp lý', en: '4. Legal basis' },
      body: {
        vi: 'Chúng tôi xử lý dữ liệu cá nhân trên cơ sở sự đồng ý của bạn khi chủ động gửi thông tin, trên cơ sở cần thiết để thực hiện hợp đồng hoặc các bước tiền hợp đồng theo yêu cầu của bạn, và trên cơ sở tuân thủ nghĩa vụ pháp lý của doanh nghiệp. Việc xử lý dữ liệu cá nhân tuân theo Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân và các quy định pháp luật Việt Nam có liên quan.',
        en: 'We process personal data on the basis of your consent when you submit information to us, on the basis of necessity for performing a contract or taking pre-contractual steps at your request, and on the basis of compliance with our legal obligations. Processing follows Decree 13/2023/ND-CP on personal data protection and other applicable Vietnamese law.'
      }
    },
    {
      heading: { vi: '5. Chia sẻ dữ liệu', en: '5. Sharing your data' },
      body: {
        vi: 'Lai Huy Interior không mua bán, trao đổi hoặc cho thuê dữ liệu cá nhân của bạn. Chúng tôi chỉ chia sẻ dữ liệu trong các trường hợp sau:',
        en: 'Lai Huy Interior does not sell, trade, or rent your personal data. We share it only in the following cases:'
      },
      items: {
        vi: [
          'Với nhân sự nội bộ trực tiếp phụ trách tư vấn, thiết kế, sản xuất, thi công hoặc kế toán cho yêu cầu của bạn.',
          'Với nhà thầu phụ, đơn vị vận chuyển hoặc đối tác kỹ thuật, chỉ trong phạm vi thông tin cần thiết để hoàn thành hạng mục đã thỏa thuận.',
          'Với nhà cung cấp dịch vụ hạ tầng lưu trữ website và lưu trữ hình ảnh, phục vụ vận hành kỹ thuật.',
          'Khi có yêu cầu hợp pháp từ cơ quan nhà nước có thẩm quyền theo quy định của pháp luật.'
        ],
        en: [
          'With the internal staff directly handling consultation, design, production, installation, or accounting for your request.',
          'With subcontractors, logistics providers, or technical partners, limited to the information required to complete the agreed scope.',
          'With the infrastructure providers hosting this website and its image assets, for technical operation.',
          'Where lawfully requested by a competent state authority in accordance with the law.'
        ]
      }
    },
    {
      heading: { vi: '6. Thời gian lưu trữ', en: '6. Retention' },
      body: {
        vi: 'Dữ liệu liên hệ và hồ sơ dự án được lưu trong thời gian cần thiết để phục vụ tư vấn, thực hiện hợp đồng và nghĩa vụ bảo hành, sau đó được lưu tiếp theo thời hạn mà pháp luật về kế toán và lưu trữ yêu cầu. Hồ sơ ứng tuyển không trúng tuyển được lưu tối đa 12 tháng kể từ ngày nhận, trừ khi ứng viên yêu cầu xóa sớm hơn.',
        en: 'Contact details and project records are kept for as long as needed to advise you, perform the contract, and honour warranty obligations, and thereafter for the periods required by accounting and records-retention law. Unsuccessful job applications are kept for at most 12 months from receipt, unless the candidate asks us to delete them sooner.'
      }
    },
    {
      heading: { vi: '7. Bảo mật dữ liệu', en: '7. Data security' },
      body: {
        vi: 'Chúng tôi áp dụng các biện pháp kỹ thuật và quản lý hợp lý để bảo vệ dữ liệu cá nhân khỏi việc truy cập, tiết lộ, thay đổi hoặc phá hủy trái phép, bao gồm mã hóa kết nối HTTPS cho toàn bộ website và giới hạn quyền truy cập dữ liệu theo phạm vi công việc. Tuy nhiên, không có phương thức truyền tải qua Internet nào an toàn tuyệt đối; bạn nên cân nhắc trước khi gửi các tài liệu có tính bảo mật cao qua email không mã hóa.',
        en: 'We apply reasonable technical and organisational measures to protect personal data against unauthorised access, disclosure, alteration, or destruction, including HTTPS encryption across the whole website and access limited to what each role requires. No method of transmission over the Internet is entirely secure, however, so please consider this before sending highly confidential documents by unencrypted email.'
      }
    },
    {
      heading: { vi: '8. Quyền của bạn đối với dữ liệu', en: '8. Your rights' },
      body: {
        vi: 'Theo quy định của pháp luật Việt Nam, bạn có các quyền sau đối với dữ liệu cá nhân của mình:',
        en: 'Under Vietnamese law you hold the following rights over your personal data:'
      },
      items: {
        vi: [
          'Quyền được biết về việc dữ liệu của bạn đang được xử lý.',
          'Quyền truy cập, yêu cầu cung cấp bản sao dữ liệu cá nhân của bạn.',
          'Quyền yêu cầu chỉnh sửa dữ liệu không chính xác.',
          'Quyền rút lại sự đồng ý và yêu cầu xóa dữ liệu, trừ trường hợp pháp luật yêu cầu lưu trữ.',
          'Quyền yêu cầu hạn chế hoặc phản đối việc xử lý dữ liệu.',
          'Quyền khiếu nại đến cơ quan nhà nước có thẩm quyền.'
        ],
        en: [
          'The right to know that your data is being processed.',
          'The right to access and request a copy of your personal data.',
          'The right to have inaccurate data corrected.',
          'The right to withdraw consent and request deletion, except where retention is legally required.',
          'The right to request restriction of, or to object to, processing.',
          'The right to complain to the competent state authority.'
        ]
      }
    },
    {
      heading: { vi: '9. Cookie', en: '9. Cookies' },
      body: {
        vi: 'Website sử dụng cookie kỹ thuật để ghi nhớ tùy chọn ngôn ngữ hiển thị của bạn giữa các lần truy cập. Cookie này không dùng để theo dõi hành vi, không phục vụ quảng cáo và không chia sẻ với bên thứ ba. Bạn có thể xóa hoặc chặn cookie trong cài đặt trình duyệt; khi đó website vẫn hoạt động bình thường nhưng sẽ hiển thị theo ngôn ngữ mặc định.',
        en: 'This website uses a technical cookie to remember your display language between visits. It is not used for behavioural tracking or advertising and is not shared with third parties. You can delete or block cookies in your browser settings; the site will continue to work, but it will open in the default language.'
      }
    },
    {
      heading: { vi: '10. Thay đổi chính sách', en: '10. Changes to this policy' },
      body: {
        vi: 'Chúng tôi có thể cập nhật chính sách này để phù hợp với thay đổi trong hoạt động kinh doanh hoặc quy định pháp luật. Phiên bản mới sẽ được đăng tải trên trang này kèm theo ngày cập nhật. Chúng tôi khuyến khích bạn xem lại định kỳ.',
        en: 'We may update this policy to reflect changes in our operations or in applicable law. Any new version will be published on this page together with its revision date. We encourage you to review it periodically.'
      }
    }
  ]
}

export const termsOfUse: LegalDocument = {
  title: { vi: 'Điều khoản sử dụng', en: 'Terms of Use' },
  intro: {
    vi: 'Điều khoản dưới đây điều chỉnh việc bạn truy cập và sử dụng website của Lai Huy Interior. Khi tiếp tục sử dụng website, bạn được xem là đã đọc, hiểu và đồng ý với các điều khoản này.',
    en: 'These terms govern your access to and use of the Lai Huy Interior website. By continuing to use the site, you are taken to have read, understood, and accepted them.'
  },
  sections: [
    {
      heading: { vi: '1. Chấp nhận điều khoản', en: '1. Acceptance of terms' },
      body: {
        vi: 'Việc truy cập, duyệt nội dung hoặc gửi yêu cầu qua website này đồng nghĩa với việc bạn chấp nhận các điều khoản sử dụng hiện hành. Nếu bạn không đồng ý với bất kỳ nội dung nào dưới đây, vui lòng ngừng sử dụng website.',
        en: 'Accessing, browsing, or submitting an enquiry through this website means you accept the terms of use in force at that time. If you do not agree with any part of them, please stop using the website.'
      }
    },
    {
      heading: { vi: '2. Nội dung và phạm vi dịch vụ', en: '2. Content and scope of services' },
      body: {
        vi: 'Lai Huy Interior cung cấp dịch vụ thiết kế, sản xuất tại xưởng và thi công nội thất cho khách sạn, villa, căn hộ và công trình thương mại. Thông tin trên website mang tính giới thiệu năng lực và tham khảo. Phạm vi công việc, vật liệu, tiến độ, giá trị và điều kiện bảo hành cụ thể của từng dự án chỉ có hiệu lực khi được xác lập bằng báo giá và hợp đồng ký kết giữa hai bên.',
        en: 'Lai Huy Interior provides interior design, factory production, and installation services for hotels, villas, apartments, and commercial projects. The information on this website is presented to introduce our capability and for reference. The scope, materials, schedule, price, and warranty terms of any particular project take effect only once set out in a quotation and a contract signed by both parties.'
      }
    },
    {
      heading: { vi: '3. Sử dụng website', en: '3. Permitted use' },
      body: {
        vi: 'Bạn đồng ý sử dụng website một cách hợp pháp và không thực hiện các hành vi sau:',
        en: 'You agree to use the website lawfully and not to:'
      },
      items: {
        vi: [
          'Can thiệp, dò quét, tấn công hoặc làm gián đoạn hoạt động bình thường của website và hệ thống máy chủ.',
          'Sử dụng công cụ tự động để thu thập dữ liệu, hình ảnh hoặc nội dung với quy mô lớn khi chưa có sự đồng ý bằng văn bản.',
          'Đăng tải hoặc gửi qua biểu mẫu các nội dung vi phạm pháp luật, xúc phạm, sai sự thật hoặc chứa mã độc.',
          'Mạo danh Lai Huy Interior hoặc gây nhầm lẫn về mối quan hệ của bạn với chúng tôi.'
        ],
        en: [
          'Interfere with, probe, attack, or disrupt the normal operation of the website and its servers.',
          'Use automated tools to harvest data, images, or content at scale without our prior written consent.',
          'Post or submit through our forms any content that is unlawful, abusive, false, or contains malicious code.',
          'Impersonate Lai Huy Interior or misrepresent your relationship with us.'
        ]
      }
    },
    {
      heading: { vi: '4. Quyền sở hữu trí tuệ', en: '4. Intellectual property' },
      body: {
        vi: 'Toàn bộ nội dung trên website — bao gồm logo, tên thương hiệu, văn bản, bố cục, hình ảnh dự án, bản vẽ và tài liệu kỹ thuật — thuộc quyền sở hữu của Lai Huy Interior hoặc được chúng tôi sử dụng hợp pháp. Bạn không được sao chép, phân phối lại, chỉnh sửa hoặc sử dụng cho mục đích thương mại nếu không có sự chấp thuận bằng văn bản của chúng tôi. Việc trích dẫn cho mục đích phi thương mại cần ghi rõ nguồn và kèm đường dẫn về website này.',
        en: 'All content on this website — including the logo, brand name, text, layout, project photography, drawings, and technical documents — is owned by Lai Huy Interior or used by us under licence. You may not copy, redistribute, modify, or use it commercially without our prior written consent. Non-commercial citation must credit the source and link back to this website.'
      }
    },
    {
      heading: { vi: '5. Hình ảnh dự án', en: '5. Project imagery' },
      body: {
        vi: 'Hình ảnh dự án được đăng tải nhằm minh họa năng lực thi công thực tế. Một số hình ảnh có thể được chụp tại các thời điểm khác nhau của quá trình hoàn thiện, hoặc đã được điều chỉnh ánh sáng và bố cục cho mục đích trình bày. Chi tiết vật liệu, màu sắc và hoàn thiện của sản phẩm thực tế được xác định theo mẫu duyệt và hồ sơ kỹ thuật của từng hợp đồng.',
        en: 'Project images are published to illustrate real delivered work. Some were taken at different stages of completion, or have had lighting and framing adjusted for presentation. The material, colour, and finish of any actual product are governed by the approved samples and technical documentation of the relevant contract.'
      }
    },
    {
      heading: { vi: '6. Báo giá và thông tin tham khảo', en: '6. Quotations and reference information' },
      body: {
        vi: 'Mọi thông tin về giá, tiến độ hoặc năng lực nêu trên website chỉ mang tính tham khảo và không cấu thành đề nghị giao kết hợp đồng. Báo giá chính thức được lập riêng cho từng dự án dựa trên bản vẽ, khối lượng, vật liệu và điều kiện thi công thực tế, và có thời hạn hiệu lực ghi trên báo giá đó.',
        en: 'Any price, schedule, or capability information on this website is indicative and does not constitute an offer to contract. Formal quotations are issued per project based on the drawings, quantities, materials, and actual site conditions, and are valid for the period stated on the quotation itself.'
      }
    },
    {
      heading: { vi: '7. Liên kết đến website bên thứ ba', en: '7. Third-party links' },
      body: {
        vi: 'Website có thể chứa đường dẫn đến các trang của bên thứ ba, ví dụ mạng xã hội hoặc bản đồ. Chúng tôi không kiểm soát và không chịu trách nhiệm về nội dung, chính sách bảo mật hoặc hoạt động của các trang đó. Việc truy cập các liên kết này thuộc quyền quyết định và rủi ro của bạn.',
        en: 'The website may contain links to third-party pages, such as social networks or maps. We do not control and are not responsible for their content, privacy practices, or operation. Following those links is at your own discretion and risk.'
      }
    },
    {
      heading: { vi: '8. Giới hạn trách nhiệm', en: '8. Limitation of liability' },
      body: {
        vi: 'Chúng tôi nỗ lực bảo đảm thông tin trên website là chính xác và cập nhật, nhưng không cam kết website luôn hoạt động liên tục, không có lỗi hoặc không bị gián đoạn vì lý do kỹ thuật, bảo trì hay sự kiện bất khả kháng. Trong phạm vi pháp luật cho phép, Lai Huy Interior không chịu trách nhiệm đối với thiệt hại gián tiếp phát sinh từ việc sử dụng hoặc không thể sử dụng website. Điều khoản này không giới hạn trách nhiệm của chúng tôi theo các hợp đồng thi công đã ký kết.',
        en: 'We work to keep the information on this website accurate and current, but we do not warrant that it will operate continuously, without error, or without interruption for technical, maintenance, or force majeure reasons. To the extent permitted by law, Lai Huy Interior is not liable for indirect loss arising from the use of, or inability to use, this website. Nothing in this clause limits our obligations under any signed construction contract.'
      }
    },
    {
      heading: { vi: '9. Bảo vệ dữ liệu cá nhân', en: '9. Personal data' },
      body: {
        vi: 'Việc thu thập và xử lý dữ liệu cá nhân qua website được thực hiện theo Chính sách bảo mật của chúng tôi, là một phần không tách rời của các điều khoản này.',
        en: 'The collection and processing of personal data through this website is governed by our Privacy Policy, which forms an integral part of these terms.'
      }
    },
    {
      heading: { vi: '10. Luật áp dụng và giải quyết tranh chấp', en: '10. Governing law and disputes' },
      body: {
        vi: 'Các điều khoản này được điều chỉnh bởi pháp luật Việt Nam. Mọi tranh chấp phát sinh sẽ được ưu tiên giải quyết thông qua thương lượng, thiện chí giữa hai bên. Trường hợp không đạt được thỏa thuận, tranh chấp sẽ được đưa ra tòa án có thẩm quyền tại Việt Nam để giải quyết theo quy định của pháp luật.',
        en: 'These terms are governed by the laws of Vietnam. Any dispute will first be addressed through good-faith negotiation between the parties. Failing agreement, it will be referred to the competent court in Vietnam for resolution in accordance with the law.'
      }
    },
    {
      heading: { vi: '11. Thay đổi điều khoản', en: '11. Changes to these terms' },
      body: {
        vi: 'Chúng tôi có thể điều chỉnh các điều khoản này khi cần thiết. Phiên bản cập nhật được đăng tải trên trang này kèm ngày hiệu lực và áp dụng cho các lượt truy cập sau thời điểm đăng tải.',
        en: 'We may revise these terms when necessary. The updated version is published on this page with its effective date and applies to visits made after publication.'
      }
    }
  ]
}
