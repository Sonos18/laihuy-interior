import type { LocalizedText } from '~/shared/types/localization'

export type HomeStoryStageId = 'existing' | 'drawing' | 'material' | 'space'
export type HomeCapabilityId = 'technical' | 'manufacturing' | 'fitout'

export type HomeStoryStage = {
  id: HomeStoryStageId
  label: LocalizedText
  title: LocalizedText
  description: LocalizedText
}

export type HomeCapability = {
  id: HomeCapabilityId
  title: LocalizedText
  description: LocalizedText
}

export type HomeFactoryDetail = {
  label: LocalizedText
  value: LocalizedText
}

export const homePageContent = {
  /* Hero (owner-approved Stitch mockup, 2026-11-21): the headline names the trade and the
     audience inside the first five seconds, the second action is Zalo (the channel visitors
     already use), and three facts the site already states elsewhere sit under the actions:
     founding year (company.foundingYear), the project count (projects.length) and the 24-month
     warranty from the contractor file. Capacity is left to the facts band directly below. `{year}` and `{count}` are filled by HomeHero. */
  hero: {
    eyebrow: { vi: 'Thiết kế · Sản xuất · Thi công', en: 'Design · Production · Fit-out' },
    title: { vi: 'Nội thất khách sạn & dự án, sản xuất tại xưởng riêng', en: 'Hotel and project interiors, made in our own factory' },
    description: {
      vi: 'Cho chủ đầu tư, đơn vị thiết kế và tổng thầu: từ bản vẽ đến lắp đặt trên toàn quốc.',
      en: 'For owners, designers and main contractors: from drawings to installation nationwide.'
    },
    primaryCta: { vi: 'Gửi bản vẽ, nhận báo giá', en: 'Send drawings, get a quote' },
    zaloCta: { vi: 'Nhắn Zalo', en: 'Chat on Zalo' },
    factsLabel: { vi: 'Lai Huy qua ba con số', en: 'Lai Huy in three figures' },
    facts: [
      {
        id: 'since',
        value: { vi: 'Từ {year}', en: 'Since {year}' },
        label: { vi: 'Xưởng riêng tại Vĩnh Long', en: 'Own factory in Vinh Long' }
      },
      {
        id: 'projects',
        value: { vi: '{count} dự án', en: '{count} projects' },
        label: { vi: 'Trong hồ sơ dự án', en: 'In our portfolio' }
      },
      {
        id: 'warranty',
        value: { vi: '24 tháng', en: '24 months' },
        label: { vi: 'Bảo hành kết cấu, thùng tủ', en: 'Warranty on carcass and structure' }
      }
    ]
  },
  /* Handover record (owner, 2026-11-21): stands in for testimonials until owner-approved client
     quotes exist. Every row comes from app/data/projects.ts (name, category, location, rooms,
     year, cover), so it states nothing the portfolio does not already state. `{count}` is filled
     by HomeHandover. */
  handover: {
    eyebrow: { vi: 'Đã bàn giao', en: 'Handed over' },
    title: { vi: '{count} công trình, từ khách sạn đến văn phòng', en: '{count} projects, from hotels to offices' },
    lead: {
      vi: 'Mỗi công trình do cùng một đội thiết kế, sản xuất tại xưởng Vĩnh Long và lắp đặt đến nghiệm thu.',
      en: 'Each one designed, made in our Vinh Long factory and installed through sign-off by the same team.'
    },
    listLabel: { vi: 'Danh sách công trình đã bàn giao', en: 'Projects handed over' },
    allCta: { vi: 'Xem tất cả dự án', en: 'View all projects' }
  },
  /* Client testimonials: HomeTestimonials renders only when company.testimonials holds real,
     owner-supplied quotes. Never fill it with placeholder or invented reviews. */
  testimonials: {
    eyebrow: { vi: 'Khách hàng nói gì', en: 'What clients say' },
    title: { vi: 'Chủ đầu tư đánh giá sau nghiệm thu', en: 'Owners on Lai Huy after sign-off' }
  },
  story: {
    eyebrow: { vi: 'Cách Lai Huy làm', en: 'How we work' },
    title: { vi: 'Không gian qua thiết kế của Lai Huy', en: 'Spaces shaped by Lai Huy’s design' },
    description: {
      vi: 'Cùng một đội chịu trách nhiệm từ lúc nhận bản vẽ, đo hiện trạng, sản xuất đến nghiệm thu tại công trình.',
      en: 'The same team is responsible from drawing intake and site measurement through production to sign-off on site.'
    }
  },
  capabilities: {
    eyebrow: { vi: 'Ba dịch vụ', en: 'Three services' },
    title: { vi: 'Thiết kế, sản xuất, thi công: một đội làm cả ba', en: 'Design, production, fit-out: one team does all three' },
    /* Moved from the hero (owner, 2026-11-15): the hero keeps one sentence so its actions clear
       the fold on short screens, and the audience split lands here, beside the three services. */
    lead: {
      vi: 'Chủ đầu tư có một đầu mối từ thiết kế đến lắp đặt. Đơn vị thiết kế và tổng thầu có một xưởng sản xuất đúng bản vẽ, kèm bóc tách, BOQ sơ bộ và shop drawing.',
      en: 'Owners get one accountable team from design to installation. Designers and main contractors get a factory that builds to their drawings, with take-off, a preliminary BOQ and shop drawings.'
    }
  },
  projects: {
    eyebrow: { vi: 'Dự án tiêu biểu', en: 'Selected projects' },
    title: { vi: 'Ba dự án làm trọn từ thiết kế đến lắp đặt', en: 'Three projects designed, made and installed by Lai Huy' },
    allCta: { vi: 'Xem tất cả dự án', en: 'View all projects' },
    locationLabel: { vi: 'Địa điểm', en: 'Location' },
    scopeLabel: { vi: 'Phạm vi', en: 'Scope' },
    materialsLabel: { vi: 'Vật liệu chính', en: 'Main materials' },
    heroCta: { vi: 'Xem chi tiết dự án', en: 'View project' },
    cardCta: { vi: 'Xem chi tiết dự án', en: 'View project' }
  },
  /* The contractor file (owner, 2026-11-15): what owners and main contractors check before they
     pick a subcontractor. Every line is owner-supplied (founding date, legal entity, tax code,
     warranty terms, 2026-11-17) or a claim the site already makes (one team to sign-off, four QC checks).
     `{legalName}`, `{taxId}` are filled from `company` by HomeTrust. */
  trust: {
    eyebrow: { vi: 'Hồ sơ nhà thầu', en: 'Contractor file' },
    title: {
      vi: 'Pháp nhân rõ ràng, xưởng riêng, hoạt động từ 2020',
      en: 'A registered company with its own factory, operating since 2020'
    },
    lead: {
      vi: 'Những điều chủ đầu tư và tổng thầu thường kiểm tra trước khi chọn đơn vị thi công nội thất.',
      en: 'What owners and main contractors check before they choose an interior contractor.'
    },
    items: [
      {
        id: 'since',
        title: { vi: 'Hoạt động từ 2020', en: 'Operating since 2020' },
        body: {
          vi: 'Thành lập ngày 10/7/2020, sản xuất tại xưởng riêng ở Phường Phú Khương, Vĩnh Long.',
          en: 'Incorporated on 10 July 2020, producing in our own factory in Phu Khuong Ward, Vinh Long.'
        }
      },
      {
        id: 'entity',
        title: { vi: 'Pháp nhân và mã số thuế', en: 'Registered entity and tax ID' },
        body: {
          vi: 'Hợp đồng ký với {legalName}, mã số thuế {taxId}.',
          en: 'Contracts are signed with {legalName}, tax ID {taxId}.'
        }
      },
      {
        id: 'sign-off',
        title: { vi: 'Nghiệm thu tại công trình', en: 'Sign-off on site' },
        body: {
          vi: 'Một đội theo dự án từ nhận bản vẽ, đo hiện trạng, sản xuất đến nghiệm thu; mỗi hạng mục qua bốn điểm kiểm tra trước khi giao.',
          en: 'One team follows the project from drawings and site survey through production to sign-off; every item passes four checks before delivery.'
        }
      },
      {
        id: 'warranty',
        title: { vi: 'Bảo hành 24 tháng', en: '24-month warranty' },
        body: {
          vi: 'Kết cấu và thùng tủ do xưởng sản xuất được bảo hành 24 tháng; tiếp nhận yêu cầu trong 24 giờ. Chi tiết ở bảng cam kết bên dưới.',
          en: 'Cabinet carcasses and joinery made in our factory carry a 24-month warranty; claims are acknowledged within 24 hours. See the commitment below.'
        }
      }
    ] satisfies Array<{ id: string, title: LocalizedText, body: LocalizedText }>,
    /* Warranty commitment (owner, 2026-11-17): replaces "warranty as regulated, terms in each
       contract", which read as evasive next to other bidders. Every figure here was approved by
       the owner; accessories stay generic because no hardware brand is named anywhere on the
       site. The contract note is a footnote, not the answer. */
    warranty: {
      title: { vi: 'Cam kết bảo hành', en: 'Warranty commitment' },
      terms: [
        {
          id: 'carcass',
          label: { vi: 'Kết cấu, thùng tủ', en: 'Carcasses and joinery' },
          value: {
            vi: '24 tháng cho sản phẩm gỗ do xưởng Lai Huy sản xuất: cong vênh, bong dán, nứt mối ghép.',
            en: '24 months on wood products made in the Lai Huy factory: warping, delamination, cracked joints.'
          }
        },
        {
          id: 'hardware',
          label: { vi: 'Phụ kiện', en: 'Hardware' },
          value: {
            vi: 'Bản lề, ray, tay nâng: theo bảo hành của hãng sản xuất.',
            en: 'Hinges, runners, lift mechanisms: covered by the manufacturer’s warranty.'
          }
        },
        {
          id: 'response',
          label: { vi: 'Thời gian phản hồi', en: 'Response time' },
          value: {
            vi: 'Tiếp nhận yêu cầu trong 24 giờ; kỹ thuật đến kiểm tra trong 72 giờ ở khu vực nội thành, khu vực khác hẹn lịch khi tiếp nhận.',
            en: 'Claims acknowledged within 24 hours; a technician inspects on site within 72 hours in the city area, elsewhere on a date set when the claim is logged.'
          }
        },
        {
          id: 'maintenance',
          label: { vi: 'Bảo trì', en: 'Maintenance' },
          value: {
            vi: 'Miễn phí một lần kiểm tra, cân chỉnh trong 12 tháng đầu.',
            en: 'One free inspection and adjustment within the first 12 months.'
          }
        },
        {
          id: 'exclusions',
          label: { vi: 'Không bảo hành', en: 'Not covered' },
          value: {
            vi: 'Hư hỏng do ngập nước, va đập, hoặc tự ý tháo, sửa.',
            en: 'Damage from flooding, impact, or unauthorised removal or repair.'
          }
        }
      ] satisfies Array<{ id: string, label: LocalizedText, value: LocalizedText }>,
      note: {
        vi: 'Chi tiết theo hợp đồng từng dự án.',
        en: 'Full terms are set out in each project’s contract.'
      }
    }
  },
  factory: {
    title: { vi: 'Kiểm soát tại nguồn', en: 'Control at the source' },
    description: {
      vi: 'Ván được cắt CNC, khoan, dán cạnh và ép ngay tại xưởng; vật liệu, kích thước và bề mặt được kiểm tra ở bốn điểm trước khi giao.',
      en: 'Panels are CNC-cut, bored, edge-banded and pressed in our own factory; materials, dimensions and surfaces are checked at four points before delivery.'
    },
    detailsTitle: { vi: 'Xưởng Lai Huy · Vĩnh Long', en: 'Lai Huy factory · Vinh Long' },
    details: [
      {
        label: { vi: 'Diện tích', en: 'Area' },
        value: { vi: '3.000 m² xưởng và kho', en: '3,000 m² factory and warehouse' }
      },
      {
        label: { vi: 'Vị trí', en: 'Location' },
        value: { vi: 'Phường Phú Khương, Vĩnh Long', en: 'Phu Khuong Ward, Vinh Long' }
      },
      {
        label: { vi: 'Công suất', en: 'Capacity' },
        value: { vi: 'Đến 50 phòng khách sạn mỗi tháng', en: 'Up to 50 hotel rooms a month' }
      },
      {
        label: { vi: 'Máy móc', en: 'Machinery' },
        value: { vi: 'CNC nesting, khoan CNC, dán cạnh tự động, ép nguội', en: 'CNC nesting and boring, automatic edge banding, cold pressing' }
      },
      {
        label: { vi: 'Kiểm tra chất lượng', en: 'Quality checks' },
        value: { vi: '4 điểm kiểm tra trước khi giao', en: 'Four checks before delivery' }
      }
    ]
  },
  cta: {
    eyebrow: { vi: 'Có bản vẽ?', en: 'Have drawings?' },
    title: { vi: 'Gửi bản vẽ, nhận BOQ sơ bộ và báo giá', en: 'Send your drawings for a preliminary BOQ and a quote' },
    description: {
      vi: 'Đội kỹ thuật bóc tách và lập BOQ sơ bộ, báo giá trong 24 giờ làm việc kể từ khi nhận đủ hồ sơ.',
      en: 'Our technical team does the take-off and a preliminary BOQ, and quotes within 24 working hours of receiving complete documents.'
    },
    primaryCta: { vi: 'Gửi bản vẽ, nhận BOQ sơ bộ', en: 'Send drawings for a preliminary BOQ' },
    secondaryCta: { vi: 'Xem năng lực nhà xưởng', en: 'View factory capability' }
  }
} as const

export const homeStoryStages: readonly HomeStoryStage[] = [
  {
    id: 'existing',
    label: { vi: 'Tiếp nhận hồ sơ', en: 'Intake' },
    title: {
      vi: 'Đối chiếu bản vẽ với hiện trạng',
      en: 'Check the drawings against the site'
    },
    description: {
      vi: 'Bản vẽ, BOQ và tiêu chuẩn hoàn thiện được rà soát; khi cần, kích thước, cao độ, kết cấu và các vị trí chờ điện, nước, điều hòa (MEP) được đo tại công trình.',
      en: 'Drawings, BOQ and finish standards are reviewed; where needed, dimensions, levels, structure and MEP connections are measured on site.'
    }
  },
  {
    id: 'drawing',
    label: { vi: 'Bóc tách kỹ thuật', en: 'Take-off' },
    title: { vi: 'Bóc tách trước khi cắt ván', en: 'Take-off before the first cut' },
    description: {
      vi: 'Bản vẽ được bóc tách thành BOQ (bảng khối lượng), danh mục vật tư và shop drawing (bản vẽ triển khai sản xuất); điểm giao cắt với các bộ môn khác được chốt ở bước này.',
      en: 'Drawings become a BOQ (bill of quantities), a material schedule and shop drawings (production drawings); interfaces with other trades are settled here.'
    }
  },
  {
    id: 'material',
    label: { vi: 'Mẫu, sản xuất, QC', en: 'Samples, production, QC' },
    title: { vi: 'Duyệt mẫu rồi mới sản xuất hàng loạt', en: 'Approve the sample, then produce in volume' },
    description: {
      vi: 'Màu, vân gỗ, phụ kiện và cấu tạo được duyệt trên mẫu; sau đó xưởng sản xuất theo module và kiểm tra trước khi đóng gói.',
      en: 'Colour, grain, hardware and construction are approved on a sample; the factory then produces in modules and inspects before packing.'
    }
  },
  {
    id: 'space',
    label: { vi: 'Lắp đặt & bàn giao', en: 'Installation & handover' },
    title: { vi: 'Lắp đặt và nghiệm thu từng khu vực', en: 'Installed and signed off area by area' },
    description: {
      vi: 'Đội lắp đặt của Lai Huy lắp theo mặt bằng, phối hợp với các bộ môn tại công trình và nghiệm thu theo từng khu vực.',
      en: 'Lai Huy’s installation team works to the floor plan, coordinates with the other trades on site and signs off each area.'
    }
  }
]

export const homeCapabilities: readonly HomeCapability[] = [
  {
    id: 'technical',
    title: { vi: 'Thiết kế & triển khai kỹ thuật', en: 'Design & technical development' },
    description: {
      vi: 'Bóc tách, shop drawing và giải pháp cấu tạo được làm rõ trước khi sản xuất.',
      en: 'Take-off, shop drawings, and construction details are resolved before manufacturing.'
    }
  },
  {
    id: 'manufacturing',
    title: { vi: 'Sản xuất tại xưởng', en: 'In-house production' },
    description: {
      vi: 'Vật liệu, tiến độ và chất lượng hoàn thiện do chính xưởng Lai Huy tại Vĩnh Long kiểm soát.',
      en: 'Materials, schedule and finish quality are controlled in Lai Huy’s own factory in Vinh Long.'
    }
  },
  {
    id: 'fitout',
    title: { vi: 'Thi công & lắp đặt', en: 'Fit-out & installation' },
    description: {
      vi: 'Điều phối giao lắp, xử lý hiện trường và nghiệm thu theo từng khu vực dự án.',
      en: 'Delivery, site resolution, and sign-off are coordinated area by area.'
    }
  }
]
