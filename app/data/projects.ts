import type { Project } from '~/shared/types/project'

// Portfolio source of truth. Every entry is backed by a Supabase media folder
// (`mediaId`) and addressed publicly by `slug`. Facts come from each project's
// brief; narrative `content` and `seo` are authored per project (added in waves).
export const projects: Project[] = [
  {
    mediaId: 'khach-san-eo-gio',
    slug: 'khach-san-eo-gio',
    category: 'hotel',
    name: { vi: 'Khách sạn Eo Gió', en: 'Eo Gio Hotel' },
    shortDescription: {
      vi: 'Tổ hợp khách sạn căn hộ dịch vụ với nhiều loại hình lưu trú, gỗ sáng, đá tự nhiên và hệ khung thép mảnh.',
      en: 'A serviced-apartment hotel spanning studios to suites — pale oak, natural stone and slim steel detailing.'
    },
    client: { vi: 'Anh Huy', en: 'Mr. Huy' },
    location: { vi: 'Vĩnh Long', en: 'Vinh Long' },
    area: { vi: '1.670 m²', en: '1,670 m²' },
    year: { vi: '2026', en: '2026' },
    style: { vi: 'Hiện đại', en: 'Modern' },
    scope: { vi: ['Thiết kế', 'Sản xuất', 'Thi công'], en: ['Design', 'Production', 'Construction'] },
    content: {
      overview: {
        vi: 'Eo Gió là một tổ hợp lưu trú tại Vĩnh Long, tập hợp nhiều loại phòng trong cùng một ngôn ngữ thiết kế: từ phòng đơn, phòng đôi tiêu chuẩn đến studio và căn hộ một, ba phòng ngủ có bếp riêng — tất cả giữ trong bảng màu gỗ sáng, đá tự nhiên và ánh sáng ấm.',
        en: 'Eo Gio is a stay complex in Vinh Long that gathers many room types under one design language — from standard single and double rooms to studios and one- and three-bedroom apartments with their own kitchens — all held in a palette of pale oak, natural stone and warm light.'
      },
      challenge: {
        vi: 'Bài toán nằm ở việc để mỗi loại phòng vận hành độc lập nhưng vẫn thuộc về một tổng thể; một đêm nghỉ ngắn và một kỳ lưu trú dài phải cùng chung một cảm giác.',
        en: 'The task was to let each room type work on its own yet still belong to a single whole — a one-night stay and an extended residency sharing the same feeling.'
      },
      solution: {
        vi: 'Một bộ chi tiết được lặp lại ở nhiều tỉ lệ khác nhau: hệ kệ khung thép mảnh làm vách ngăn nhẹ, các hốc tủ bo cong, quầy và bếp gỗ sáng trên mặt đá. Bếp đầy đủ cho căn hộ dịch vụ, khu nghỉ gọn gàng cho phòng khách sạn.',
        en: 'A single kit of parts recurs at different scales: slim steel shelving that divides space lightly, softly rounded storage niches, pale-oak counters and kitchens on stone tops. Full kitchens serve the serviced apartments; the hotel rooms keep a compact resting layout.'
      },
      designHighlights: {
        vi: [
          'Quầy lễ tân uốn cong mang tên Eo Gió mở đầu hành trình lưu trú',
          'Hệ kệ khung thép đen mảnh vừa lưu trữ vừa phân chia không gian',
          'Các hốc và tủ bo cong làm mềm những căn phòng nhỏ',
          'Bếp tích hợp cho loại hình căn hộ dịch vụ',
          'Ghế da nâu đỏ điểm nhịp ấm trên nền gỗ sáng',
          'Sảnh chờ với sofa bo tròn hướng ra mặt kính lớn'
        ],
        en: [
          'A curved Eo Gio reception desk opens the arrival sequence',
          'Slim black-steel shelving both stores and divides space',
          'Rounded niches and cabinets soften the compact rooms',
          'Fitted kitchens for the serviced-apartment units',
          'Rust-leather chairs mark warm accents against pale oak',
          'A lounge of curved sofas opens to full-height glazing'
        ]
      },
      materials: {
        vi: [
          'Gỗ công nghiệp phủ Melamine/Laminate tông sáng cho hệ tủ và quầy',
          'Đá vân nhẹ cho mặt bếp và bề mặt điểm nhấn',
          'Kim loại sơn tĩnh điện đen cho hệ kệ và khung',
          'Kính và da tông ấm cho khu vực tiếp khách'
        ],
        en: [
          'Pale melamine/laminate engineered wood for cabinetry and counters',
          'Light-veined stone for kitchen and accent surfaces',
          'Black powder-coated metal for shelving and frames',
          'Glass and warm-toned leather in the guest lounges'
        ]
      },
      craftsmanship: {
        vi: 'Với gói thầu thiết kế, sản xuất và thi công, Lai Huy kiểm soát từ bộ tủ bếp, hệ giường tủ đến quầy lễ tân uốn cong và hệ kệ thép — giữ chi tiết đồng nhất giữa hàng loạt phòng.',
        en: 'Delivered as design, production and construction, Lai Huy carried the kitchens, bed-and-wardrobe sets, the curved reception desk and the steel shelving in-house — holding detail consistent across a large number of rooms.'
      },
      experience: {
        vi: 'Khách bước vào những căn phòng sáng, ấm và ngăn nắp; người ở vài đêm hay ở cả tuần đều tìm thấy sự tiện nghi vừa đủ, không phô trương.',
        en: 'Guests step into rooms that read bright, warm and orderly; whether staying a night or a week, they find comfort that is sufficient rather than showy.'
      }
    },
    seo: {
      keywords: {
        vi: ['khách sạn Eo Gió', 'thiết kế khách sạn Vĩnh Long', 'căn hộ dịch vụ', 'nội thất khách sạn gỗ sáng'],
        en: ['Eo Gio hotel', 'hotel interior design Vinh Long', 'serviced apartment interior', 'pale oak hospitality interior']
      }
    },
    featured: true
  },
  {
    mediaId: 'codi-boutique-hotel',
    slug: 'codi-boutique-hotel',
    category: 'hotel',
    name: { vi: 'Khách sạn Codi Boutique', en: 'Codi Boutique Hotel' },
    shortDescription: {
      vi: 'Khách sạn boutique với ba loại phòng đặc trưng, tông màu ấm và các mảng vòm mềm mại tạo trải nghiệm lưu trú nhẹ nhàng.',
      en: 'A boutique hotel of three signature room types, warm two-tone palettes and soft arched forms for a calm stay.'
    },
    coverImage: 'phong-dien-hinh-2/p8-01.webp',
    client: { vi: 'Anh Huy', en: 'Mr. Huy' },
    location: { vi: 'Vĩnh Long', en: 'Vinh Long' },
    area: { vi: '556 m²', en: '556 m²' },
    year: { vi: '2024', en: '2024' },
    style: { vi: 'Hiện đại', en: 'Modern' },
    scope: { vi: ['Thiết kế'], en: ['Design'] },
    content: {
      overview: {
        vi: 'Codi Boutique là một khách sạn nhỏ, nơi ba loại phòng được đặt cạnh nhau như ba tính cách trong cùng một bảng màu trầm ấm. Tường chia hai tông, sàn gỗ xương cá và những đường vòm mềm định hình cảm giác chung.',
        en: 'Codi Boutique is a small hotel where three room types sit side by side like three characters in one warm, muted palette. Two-tone walls, herringbone floors and soft arches set the shared mood.'
      },
      challenge: {
        vi: 'Trong một quy mô khiêm tốn, mỗi loại phòng cần một nét riêng để khách quay lại có trải nghiệm khác, mà không làm rời rạc nhận diện của khách sạn.',
        en: 'At a modest scale, each room type needed its own note so a returning guest meets a different stay — without loosening the hotel’s identity.'
      },
      solution: {
        vi: 'Mảng chân tường hai tông trở thành sợi chỉ xuyên suốt; mỗi phòng thêm một điểm nhấn riêng — sắc be trầm, mảng xanh rêu, hay tấm vách tròn đan sau đầu giường.',
        en: 'The two-tone dado becomes the connecting thread; each room then adds one distinct accent — a deeper taupe, a sage-green field, or a woven round screen behind the bed.'
      },
      designHighlights: {
        vi: [
          'Chân tường hai tông thống nhất ba loại phòng',
          'Tấm vách tròn đan mây làm điểm nhấn sau đầu giường phòng lớn',
          'Một phòng lấy sắc xanh rêu làm chủ đạo',
          'Sảnh đón với chữ Codi phát sáng trong khung vòm',
          'Sàn gỗ lát xương cá và các đường vòm lặp lại',
          'Hệ đầu giường và bàn làm việc liền khối, gọn gàng'
        ],
        en: [
          'A two-tone dado unifies the three room types',
          'A woven round screen anchors the larger room’s headboard wall',
          'One room takes sage green as its lead accent',
          'An arched, backlit “Codi” sign greets at reception',
          'Herringbone floors and repeated arched openings',
          'Integrated headboard-and-desk units keep rooms uncluttered'
        ]
      },
      materials: {
        vi: [
          'Gỗ công nghiệp phủ Melamine/Laminate cho hệ nội thất',
          'Sàn gỗ lát xương cá',
          'Sơn hai tông cho mảng tường và chân tường',
          'Vách tròn đan mây và chi tiết kim loại đen mảnh'
        ],
        en: [
          'Melamine/laminate engineered wood for the joinery',
          'Herringbone timber flooring',
          'Two-tone paint across walls and dado',
          'A woven rattan screen and slim black-metal details'
        ]
      },
      experience: {
        vi: 'Phòng ở Codi không cố gây ấn tượng; chúng nhẹ, sáng và dễ chịu, để lại cảm giác về một nơi được chăm chút hơn là một nơi được trang trí.',
        en: 'Codi’s rooms do not try to impress; they are light, calm and easy, leaving the sense of a place that was cared for rather than decorated.'
      }
    },
    seo: {
      keywords: {
        vi: ['khách sạn Codi Boutique', 'thiết kế khách sạn boutique', 'nội thất khách sạn tông ấm'],
        en: ['Codi Boutique hotel', 'boutique hotel interior design', 'warm-toned hotel rooms']
      }
    },
    featured: true
  },
  {
    mediaId: 'codi-villa-phan-thiet',
    slug: 'codi-villa-phan-thiet',
    category: 'villa',
    name: { vi: 'Codi Villa Phan Thiết', en: 'Codi Villa, Phan Thiet' },
    shortDescription: {
      vi: 'Bốn căn villa biển theo phong cách Industrial Modern: bê tông, khung thép sơn tĩnh điện và điểm nhấn đỏ đất đầy cá tính.',
      en: 'Four beachfront villas in industrial-modern character — concrete, powder-coated steel and confident oxblood accents.'
    },
    client: { vi: 'Anh Huy', en: 'Mr. Huy' },
    location: { vi: 'NovaWorld Phan Thiết, Bình Thuận', en: 'NovaWorld Phan Thiet, Binh Thuan' },
    area: { vi: '120 m² × 4 căn', en: '120 m² × 4 units' },
    year: { vi: '2025', en: '2025' },
    style: { vi: 'Công nghiệp hiện đại', en: 'Industrial Modern' },
    scope: { vi: ['Thiết kế', 'Sản xuất', 'Thi công'], en: ['Design', 'Production', 'Construction'] },
    content: {
      overview: {
        vi: 'Codi Villa gồm bốn căn nhà nghỉ biển tại NovaWorld Phan Thiết, chọn một hướng đi ít gặp cho loại hình này: tinh thần công nghiệp. Bê tông để trần, khung thép đen và sắc đỏ đất chạy xuyên suốt cả bốn căn.',
        en: 'Codi Villa is four beachfront houses at NovaWorld Phan Thiet that take an uncommon route for the type: an industrial spirit. Bare concrete, black steel and an oxblood red run through all four units.'
      },
      challenge: {
        vi: 'Ngôn ngữ công nghiệp thường lạnh; ở đây nó phải trở thành một ngôi nhà nghỉ ấm áp cho gia đình, nơi vật liệu thô vẫn mời gọi người ở.',
        en: 'An industrial language tends to read cold; here it had to become a warm family holiday home, where raw materials still invite you to stay.'
      },
      solution: {
        vi: 'Những đối trọng ấm được đưa vào để cân bằng: gỗ plywood, da, cây xanh và ánh đèn thấp. Sắc đỏ đất — ở tường gạch và mặt tủ lưới — giữ vai trò kết nối, còn một phòng gác lửng ốp plywood dành riêng cho trẻ.',
        en: 'Warm counterweights bring it into balance: plywood, leather, planting and low light. The oxblood red — in tiled walls and mesh cabinet fronts — plays the connective role, while a plywood-clad loft is given over to the children.'
      },
      designHighlights: {
        vi: [
          'Trần bê tông để trần làm nền cho toàn bộ không gian',
          'Hệ tủ và vách kính khung thép đen sơn tĩnh điện',
          'Mảng tường gạch đỏ đất và mặt tủ lưới kim loại',
          'Phòng gác lửng ốp plywood với giường tầng cho trẻ',
          'Sofa da và đèn thả kiểu công nghiệp',
          'Bếp mở kết nối với khu ăn và sinh hoạt chung'
        ],
        en: [
          'Bare concrete ceilings ground the whole interior',
          'Black powder-coated steel wardrobes and glazed frames',
          'Oxblood-red tiled walls and metal mesh cabinet fronts',
          'A plywood loft room with a bunk bed for the children',
          'Leather sofas under industrial pendant lighting',
          'An open kitchen tied to the dining and living areas'
        ]
      },
      materials: {
        vi: [
          'Gỗ plywood phủ Melamine/Laminate cho hệ tủ và ốp',
          'Đá vân nhẹ cho mặt bếp và bề mặt',
          'Kính và kim loại sơn tĩnh điện đen',
          'Gạch và lưới kim loại sắc đỏ đất làm điểm nhấn'
        ],
        en: [
          'Plywood with melamine/laminate for cabinetry and cladding',
          'Light-veined stone for kitchen and worktops',
          'Glass and black powder-coated metal',
          'Oxblood-red tile and metal mesh as accents'
        ]
      },
      craftsmanship: {
        vi: 'Thiết kế, sản xuất và thi công cùng một đầu mối cho phép kiểm soát những chi tiết khó: khung thép cho tủ và vách kính, mặt tủ lưới, và hệ giường tầng plywood của phòng trẻ.',
        en: 'Design, production and construction under one roof made the harder details controllable: the steel framing for wardrobes and glazed partitions, the mesh cabinet fronts, and the plywood bunk of the children’s room.'
      },
      experience: {
        vi: 'Bước vào villa là bước vào một kỳ nghỉ có cá tính rõ ràng — mát, thô mộc mà vẫn ấm; trẻ có góc riêng, người lớn có một không gian không giống bất kỳ căn hộ nghỉ nào khác.',
        en: 'To enter the villa is to enter a holiday with a clear character — cool and raw yet warm; the children keep their own corner, the adults a space unlike any other resort home.'
      }
    },
    seo: {
      keywords: {
        vi: ['Codi Villa Phan Thiết', 'villa biển NovaWorld', 'nội thất villa phong cách công nghiệp'],
        en: ['Codi Villa Phan Thiet', 'NovaWorld beach villa', 'industrial modern villa interior']
      }
    },
    featured: true
  },
  {
    mediaId: 'nha-vuon-chily',
    slug: 'nha-vuon-chily',
    category: 'villa',
    name: { vi: 'Nhà vườn Chi Ly', en: 'Chi Ly Garden Villa' },
    shortDescription: {
      vi: 'Nhà vườn tân cổ điển với phào chỉ, đèn chùm và sàn đá, cân bằng giữa sự trang trọng và ấm cúng gia đình.',
      en: 'A neo-classical garden villa of fine mouldings, chandeliers and stone floors — formal yet warmly residential.'
    },
    client: { vi: 'Chị Ly', en: 'Ms. Ly' },
    location: { vi: 'Vĩnh Long', en: 'Vinh Long' },
    area: { vi: '215 m²', en: '215 m²' },
    year: { vi: '2023', en: '2023' },
    style: { vi: 'Tân cổ điển', en: 'Neo-Classic' },
    scope: { vi: ['Thiết kế'], en: ['Design'] },
    content: {
      overview: {
        vi: 'Nhà vườn Chi Ly là một dinh thự tân cổ điển dành cho gia đình, nơi phào chỉ, đèn chùm và sàn đá được tiết chế để giữ sự trang trọng mà không nặng nề. Các phòng chung theo ngôn ngữ cổ điển, trong khi phòng của các bé lại mở ra một thế giới khác hẳn.',
        en: 'Chi Ly is a neo-classical garden villa for a family, where mouldings, chandeliers and stone floors are measured enough to stay formal without turning heavy. The shared rooms follow a classical language, while the children’s rooms open onto an entirely different world.'
      },
      designHighlights: {
        vi: [
          'Tường ốp phào chỉ PU và trần giật cấp theo lối cổ điển',
          'Đèn chùm pha lê làm điểm nhấn cho phòng khách và phòng ăn',
          'Sàn đá vân nhẹ với đường chỉ viền chạy quanh phòng',
          'Bếp cánh tủ soi chỉ kết hợp mặt đá sáng',
          'Hai phòng trẻ theo chủ đề xe đua — một xanh, một đỏ',
          'Bộ sofa và bàn ăn dáng cổ điển làm trung tâm không gian chung'
        ],
        en: [
          'PU-moulding wall panelling and stepped classical ceilings',
          'Crystal chandeliers anchoring the living and dining rooms',
          'Light-veined stone floors with an inlaid border around each room',
          'A shaker-profile kitchen paired with a pale stone top',
          'Two children’s rooms on a racing-car theme — one blue, one red',
          'Classically shaped sofa and dining sets centring the shared spaces'
        ]
      },
      materials: {
        vi: [
          'Gỗ công nghiệp sơn cho hệ tủ và mảng ốp',
          'Đá vân nhẹ cho sàn và mặt bếp',
          'Phào chỉ nhựa PU cho tường và trần',
          'Pha lê, kim loại mạ và vải bọc cổ điển'
        ],
        en: [
          'Painted engineered wood for cabinetry and panelling',
          'Light-veined stone for floors and worktops',
          'PU mouldings across walls and ceilings',
          'Crystal, plated metal and classic upholstery'
        ]
      },
      experience: {
        vi: 'Không gian chung mang lại cảm giác chỉn chu, đủ trang trọng để tiếp khách; còn với các bé, mỗi tối trở về là bước vào căn phòng của riêng mình — chi tiết khiến một ngôi nhà cổ điển trở nên rất đời.',
        en: 'The shared rooms feel composed, formal enough to receive guests; for the children, each evening ends in a room that is unmistakably their own — the detail that keeps a classical house genuinely lived-in.'
      }
    },
    seo: {
      keywords: {
        vi: ['nhà vườn tân cổ điển', 'thiết kế biệt thự cổ điển', 'nội thất tân cổ điển Vĩnh Long'],
        en: ['neo-classical villa interior', 'classic garden villa design', 'neo-classic residential interior']
      }
    }
  },
  {
    mediaId: 'cai-tao-nha-quan-8',
    slug: 'cai-tao-nha-quan-8',
    category: 'house',
    name: { vi: 'Cải tạo nhà phố Quận 8', en: 'District 8 Townhouse Renovation' },
    shortDescription: {
      vi: 'Cải tạo nhà phố với gỗ ấm, mảng đá sáng và ánh sáng gián tiếp, mang lại không gian sống hiện đại và tinh tế.',
      en: 'A townhouse renovation in warm wood, light stone and indirect lighting — a calm, contemporary family home.'
    },
    coverImage: '3.webp',
    client: { vi: 'Chị Thư', en: 'Ms. Thư' },
    location: { vi: 'Quận 8, TP.HCM', en: 'District 8, HCMC' },
    area: { vi: '152 m²', en: '152 m²' },
    year: { vi: '2025', en: '2025' },
    style: { vi: 'Hiện đại', en: 'Modern' },
    scope: { vi: ['Thiết kế'], en: ['Design'] },
    content: {
      overview: {
        vi: 'Một căn nhà phố tại Quận 8 được làm mới toàn bộ phần nội thất, chuyển từ bố cục cũ sang một không gian sống hiện đại, sáng và liền mạch hơn.',
        en: 'A townhouse in District 8 was reworked throughout — moving from an older layout to a lighter, more continuous contemporary home.'
      },
      challenge: {
        vi: 'Nhà phố thường thiếu sáng và bị chia vụn; thách thức là mở lại mạch không gian và tận dụng cả những khu vực khó như gầm thang.',
        en: 'Townhouses tend to be short on light and broken into fragments; the challenge was to reopen the flow and reclaim awkward zones such as the space beneath the stair.'
      },
      solution: {
        vi: 'Bảng vật liệu được thống nhất — gỗ ấm, mảng nan trắng và đá sáng — để nối các phòng bằng ánh nhìn. Gầm thang trở thành góc ăn có tủ rượu, còn phòng ngủ dùng giường bệ nổi hắt sáng để giảm cảm giác nặng.',
        en: 'A single material palette — warm wood, white fluted panels and pale stone — ties the rooms together by sight. The under-stair becomes a dining nook with a wine cabinet, and the bedroom uses a floating, back-lit bed base to lift the weight of the room.'
      },
      materials: {
        vi: [
          'Gỗ công nghiệp MDF phủ Melamine/Laminate tông ấm',
          'Đá vân nhẹ cho sàn, mảng TV và khu ăn',
          'Nan trắng ốp tường tạo nhịp đứng',
          'Kính và đèn LED hắt gián tiếp'
        ],
        en: [
          'Warm MDF melamine/laminate engineered wood',
          'Light-veined stone for floors, the TV wall and dining',
          'White fluted panelling for a vertical rhythm',
          'Glass and indirect LED lighting'
        ]
      }
    },
    seo: {
      keywords: {
        vi: ['cải tạo nhà phố', 'thiết kế nội thất nhà phố Quận 8', 'nhà phố hiện đại'],
        en: ['townhouse renovation', 'townhouse interior design District 8', 'modern townhouse interior']
      }
    }
  },
  {
    mediaId: 'nha-anh-nam',
    slug: 'nha-anh-nam',
    category: 'house',
    name: { vi: 'Nhà phố anh Nam', en: 'Anh Nam Townhouse' },
    shortDescription: {
      vi: 'Nhà phố hiện đại với thông tầng, cầu thang lam đứng và hệ nội thất treo tối giản, ấm áp.',
      en: 'A modern townhouse with a double-height core, batten staircase and warm, minimal floating joinery.'
    },
    coverImage: '3.webp',
    client: { vi: 'Anh Nam', en: 'Mr. Nam' },
    location: { vi: 'Vĩnh Long', en: 'Vinh Long' },
    area: { vi: '200 m²', en: '200 m²' },
    year: { vi: '2025', en: '2025' },
    style: { vi: 'Hiện đại', en: 'Modern' },
    scope: { vi: ['Thiết kế'], en: ['Design'] },
    content: {
      overview: {
        vi: 'Nhà anh Nam là một căn nhà phố hiện đại lấy khoảng thông tầng làm trung tâm, nơi ánh sáng và tầm nhìn được kéo lên theo chiều cao thay vì trải theo chiều ngang.',
        en: 'Anh Nam is a modern townhouse built around a double-height core, where light and sightlines are drawn upward through height rather than spread across the floor.'
      },
      designHighlights: {
        vi: [
          'Khoảng thông tầng mở nối phòng khách với tầng trên',
          'Cầu thang lam đứng bằng thép đen làm mảng lọc ánh sáng',
          'Hệ tủ và kệ TV treo giữ sàn nhà thông thoáng',
          'Đảo bếp mặt tối kết hợp kệ mở viền kim loại',
          'Giường bệ nổi hắt sáng trong các phòng ngủ',
          'Đèn vòng và đèn cây tạo điểm nhấn mềm trên nền tối giản'
        ],
        en: [
          'A double-height void links the living room to the floor above',
          'A black-steel batten staircase filters light as a screen',
          'Floating cabinetry and media units keep the floor uncluttered',
          'A dark-topped kitchen island with metal-trimmed open shelving',
          'Back-lit floating bed bases in the bedrooms',
          'A ring pendant and floor lamp soften a minimal base'
        ]
      },
      experience: {
        vi: 'Đứng ở phòng khách, người ở cảm nhận được cả chiều cao của ngôi nhà; các chi tiết được giữ tối giản để khoảng trống và ánh sáng trở thành phần trang trí chính.',
        en: 'Standing in the living room, you feel the full height of the house; details are kept minimal so that void and light become the main ornament.'
      }
    },
    seo: {
      keywords: {
        vi: ['thiết kế nhà phố hiện đại', 'nhà phố thông tầng', 'nội thất tối giản ấm'],
        en: ['modern townhouse design', 'double-height townhouse', 'warm minimal interior']
      }
    }
  },
  {
    mediaId: 'nha-ta-dung',
    slug: 'nha-ta-dung',
    category: 'retreat',
    name: { vi: 'Nghỉ dưỡng Tà Đùng', en: 'Ta Dung Retreat' },
    shortDescription: {
      vi: 'Không gian nghỉ dưỡng nhỏ tại Tà Đùng, kết hợp gỗ thông tự nhiên và khung thép, mộc mạc và tĩnh tại.',
      en: 'A compact retreat in Ta Dung pairing natural pine and steel frames — raw, quiet and grounded.'
    },
    coverImage: '3.webp',
    client: { vi: 'Anh Huy', en: 'Mr. Huy' },
    location: { vi: 'Tà Đùng', en: 'Ta Dung' },
    area: { vi: '32 m²', en: '32 m²' },
    year: { vi: '2026', en: '2026' },
    style: { vi: 'Hiện đại', en: 'Modern' },
    scope: { vi: ['Thiết kế', 'Thi công'], en: ['Design', 'Construction'] },
    content: {
      overview: {
        vi: 'Một không gian nghỉ nhỏ 32 m² tại Tà Đùng, nơi vật liệu tự nhiên được để mộc: gỗ thông, tường vữa và khung thép đen, thay cho mọi lớp trang trí thừa.',
        en: 'A compact 32 m² retreat in Ta Dung, where natural materials are left raw — pine, plaster walls and black steel frames standing in for any extra layer of decoration.'
      },
      materials: {
        vi: [
          'Gỗ thông tự nhiên cho hệ tủ, kệ và giường',
          'Khung sắt hộp sơn tĩnh điện cho tủ mở và giá đỡ',
          'Tường vữa hiệu ứng tông trung tính',
          'Mặt đá cho khu vệ sinh'
        ],
        en: [
          'Natural pine for cabinetry, shelving and the bed',
          'Powder-coated steel box frames for the open wardrobe and racks',
          'Neutral micro-plaster wall finishes',
          'A stone top in the bathroom'
        ]
      },
      experience: {
        vi: 'Trong một diện tích nhỏ, cảm giác lại rộng và tĩnh; những đường vòm, ánh sáng thấp và bề mặt mộc khiến nơi này giống một chốn lui về hơn là một căn phòng.',
        en: 'Within a small footprint the feeling is wide and quiet; arched openings, low light and raw surfaces make this read as a place to withdraw to rather than simply a room.'
      }
    },
    seo: {
      keywords: {
        vi: ['nghỉ dưỡng Tà Đùng', 'thiết kế không gian nghỉ nhỏ', 'nội thất gỗ thông mộc'],
        en: ['Ta Dung retreat', 'compact retreat interior', 'natural pine interior']
      }
    }
  },
  {
    mediaId: 'phong-giam-doc',
    slug: 'phong-giam-doc',
    category: 'office',
    name: { vi: 'Phòng giám đốc — Công ty 12 Tháng 05', en: 'Executive Office — 12/05 Company' },
    shortDescription: {
      vi: 'Cải tạo phòng giám đốc với gỗ ốp, ánh sáng tạo hình và góc tiếp khách, thể hiện sự chững chạc và tinh tế.',
      en: 'A director’s office renovation in warm timber, sculptural lighting and a lounge corner — assured and refined.'
    },
    coverImage: '3.webp',
    client: { vi: 'Công ty 12 Tháng 05', en: '12/05 Company' },
    location: { vi: 'Quận 7, TP.HCM', en: 'District 7, HCMC' },
    area: { vi: '37 m²', en: '37 m²' },
    year: { vi: '2022', en: '2022' },
    style: { vi: 'Hiện đại', en: 'Modern' },
    scope: { vi: ['Thiết kế'], en: ['Design'] },
    content: {
      overview: {
        vi: 'Một phòng giám đốc 37 m² được cải tạo tại Quận 7, tổ chức đủ ba chức năng — làm việc, tiếp khách nhỏ và nghỉ ngơi — trong một không gian gọn nhưng có chiều sâu và sự chững chạc.',
        en: 'A 37 m² director’s office reworked in District 7, holding three functions — working, small meetings and a place to sit — inside a compact room that still reads deep and composed.'
      },
      designHighlights: {
        vi: [
          'Gỗ ốp lam và soi chỉ bao quanh khu bàn làm việc',
          'Đèn thả tạo hình uốn lượn làm điểm nhấn phía trên bàn',
          'Bàn giám đốc mặt gỗ chân kim loại và ghế da lưng cao',
          'Hệ tủ sách âm tường và kệ trưng bày',
          'Bàn họp nhỏ và góc sofa nhìn ra thành phố',
          'Mảng tường tối làm nền cho ánh sáng ấm'
        ],
        en: [
          'Slatted and reeded timber wrapping the desk area',
          'A sculptural, wavy pendant marking the desk above',
          'A wood-topped director’s desk on metal legs with a high-back leather chair',
          'A recessed bookcase and display shelving',
          'A compact meeting table and a sofa corner facing the city',
          'Dark wall planes as a backdrop for warm light'
        ]
      },
      experience: {
        vi: 'Người ngồi ở bàn có cảm giác kiểm soát cả căn phòng; khách được tiếp ở một góc riêng, và cùng một không gian vẫn đủ chỗ để lùi lại, nhìn ra thành phố sau một cuộc họp.',
        en: 'From the desk, the occupant commands the whole room; guests are received in a separate corner, and the same space still allows a step back — a view over the city after a meeting.'
      }
    },
    seo: {
      keywords: {
        vi: ['thiết kế phòng giám đốc', 'nội thất phòng giám đốc', 'phòng làm việc giám đốc'],
        en: ['executive office design', 'director office interior', 'modern executive office']
      }
    }
  },
  {
    mediaId: 'phong-hop-quan-7',
    slug: 'phong-hop-quan-7',
    category: 'office',
    name: { vi: 'Văn phòng Quận 7', en: 'District 7 Office' },
    shortDescription: {
      vi: 'Văn phòng với phòng họp kính, các khối làm việc theo phòng ban và mảng đồ hoạ truyền cảm hứng.',
      en: 'An office of a glass boardroom, department work zones and motivational graphic walls.'
    },
    coverImage: 'p-hop3.webp',
    client: { vi: 'Chị Hoa', en: 'Ms. Hoa' },
    location: { vi: 'Quận 7, TP.HCM', en: 'District 7, HCMC' },
    area: { vi: '170 m²', en: '170 m²' },
    year: { vi: '2022', en: '2022' },
    style: { vi: 'Hiện đại', en: 'Modern' },
    scope: { vi: ['Thiết kế'], en: ['Design'] },
    content: {
      overview: {
        vi: 'Một văn phòng 170 m² tại Quận 7 được tổ chức quanh hai cực: một phòng họp kính cho các buổi làm việc tập trung, và các khối bàn mở cho từng phòng ban.',
        en: 'A 170 m² office in District 7 organised around two poles: a glass meeting room for focused sessions, and open desk blocks for each department.'
      },
      solution: {
        vi: 'Phòng họp đặt sau vách kính để vừa tách âm vừa giữ tầm nhìn, với hệ tủ hồ sơ gỗ và đèn tuyến tính hình học phía trên. Các phòng ban dùng bàn liền dãy và những mảng tường đồ hoạ mang thông điệp của công ty.',
        en: 'The meeting room sits behind glass to separate sound while keeping sightlines, with a wood filing wall and a geometric linear light above. The departments use bench desks and graphic walls that carry the company’s message.'
      },
      designHighlights: {
        vi: [
          'Phòng họp vách kính dưới đèn tuyến tính hình học',
          'Hệ tủ hồ sơ gỗ kết hợp chi tiết kim loại đen',
          'Bàn làm việc liền dãy cho từng phòng ban',
          'Mảng tường đồ hoạ và logo tạo nhận diện',
          'Sàn thảm và vách kính phân vùng nhẹ',
          'Mảng gỗ ốp làm điểm ấm trên nền trắng'
        ],
        en: [
          'A glass-walled meeting room under a geometric linear light',
          'A wood filing wall with black-metal detailing',
          'Bench desking for each department',
          'Graphic walls and a logo building identity',
          'Carpet flooring and glass partitions dividing lightly',
          'Oak accent panels warming a white base'
        ]
      }
    },
    seo: {
      keywords: {
        vi: ['thiết kế văn phòng công ty', 'nội thất văn phòng Quận 7', 'thiết kế phòng họp'],
        en: ['office interior design', 'company office design', 'meeting room design']
      }
    }
  },
  {
    mediaId: 'van-phong-quan-4',
    slug: 'van-phong-quan-4',
    category: 'office',
    name: { vi: 'Cải tạo văn phòng Quận 4', en: 'District 4 Office Renovation' },
    shortDescription: {
      vi: 'Cải tạo văn phòng theo hướng xanh: hệ kệ gỗ tích hợp cây, vách lam than chì và khung thép, gần gũi và chuyên nghiệp.',
      en: 'A biophilic office renovation — oak storage integrated with planting, charcoal fluting and steel framing.'
    },
    coverImage: '2.webp',
    client: { vi: 'Công ty TNHH Thanh Kim Long', en: 'Thanh Kim Long Co., Ltd' },
    location: { vi: 'Quận 4, TP.HCM', en: 'District 4, HCMC' },
    area: { vi: '70 m²', en: '70 m²' },
    year: { vi: '2021', en: '2021' },
    style: { vi: 'Hiện đại', en: 'Modern' },
    scope: { vi: ['Thiết kế', 'Sản xuất', 'Thi công'], en: ['Design', 'Production', 'Construction'] },
    content: {
      overview: {
        vi: 'Một văn phòng 70 m² tại Quận 4 được cải tạo theo hướng đưa cây xanh vào không gian làm việc, thay lớp vỏ cũ bằng gỗ ấm, mảng lam than chì và khung thép mở ra ánh sáng.',
        en: 'A 70 m² office in District 4, renovated to bring greenery into the workday — replacing the old shell with warm wood, charcoal fluting and steel frames opening to the light.'
      },
      challenge: {
        vi: 'Diện tích không lớn và dễ trở nên bí; vấn đề là giữ đủ chỗ lưu trữ và làm việc mà không khiến không gian nặng nề, thiếu sức sống.',
        en: 'The floor area is modest and easily feels closed; the problem was to keep enough storage and work space without letting the room turn heavy or lifeless.'
      },
      solution: {
        vi: 'Hệ kệ gỗ chạy dọc tường tích hợp các hốc trồng cây, đưa mảng xanh vào giữa khu lưu trữ. Vách lam than chì và khung thép đen mở ra mặt kính, giúp không gian vừa ấm vừa thoáng.',
        en: 'Oak shelving runs along the walls with planting niches built in, threading green through the storage. Charcoal fluted panels and black steel frames open to glazing, keeping the room both warm and light.'
      },
      designHighlights: {
        vi: [
          'Hệ kệ gỗ tích hợp cây xanh dọc tường',
          'Vách lam than chì làm nền cho khu bàn giám đốc',
          'Khung thép đen mở ra mặt kính và tầm nhìn thành phố',
          'Bàn họp và khu làm việc gọn trong một mặt bằng nhỏ',
          'Sàn thảm và mảng gỗ giữ tông ấm'
        ],
        en: [
          'Oak shelving with integrated planting along the walls',
          'A charcoal fluted wall behind the director’s desk',
          'Black steel frames opening to glazing and a city view',
          'A meeting table and work area fitted into a small floorplate',
          'Carpet and wood holding a warm tone'
        ]
      }
    },
    seo: {
      keywords: {
        vi: ['cải tạo văn phòng', 'thiết kế văn phòng xanh', 'nội thất văn phòng Quận 4'],
        en: ['office renovation', 'biophilic office design', 'green office interior']
      }
    }
  },
  {
    mediaId: 'nha-xuong-anh-cuong',
    slug: 'nha-xuong-anh-cuong',
    category: 'commercial',
    name: { vi: 'Nhà xưởng & văn phòng anh Cường', en: 'Anh Cuong Factory & Office' },
    shortDescription: {
      vi: 'Văn phòng đặt trong nhà xưởng: sàn terrazzo, vách panel và hệ kệ gỗ, gắn với hình ảnh thương hiệu.',
      en: 'An office set within a warehouse — terrazzo floors, panel partitions and oak shelving woven with brand identity.'
    },
    client: { vi: 'Anh Cường', en: 'Mr. Cường' },
    location: { vi: 'Vĩnh Long', en: 'Vinh Long' },
    area: { vi: '320 m²', en: '320 m²' },
    year: { vi: '2025', en: '2025' },
    style: { vi: 'Công nghiệp', en: 'Industrial' },
    scope: { vi: ['Thiết kế', 'Thi công'], en: ['Design', 'Construction'] },
    content: {
      overview: {
        vi: 'Nhà xưởng anh Cường là một công trình 320 m² kết hợp sản xuất và văn phòng, nơi khối làm việc được đặt ngay trong không gian nhà xưởng thay vì tách rời khỏi nó.',
        en: 'Anh Cuong is a 320 m² project combining production and office, where the workspace sits inside the warehouse rather than apart from it.'
      },
      solution: {
        vi: 'Khu văn phòng được dựng bằng hệ vách panel và kính trên nền sàn terrazzo, giữ sự sạch sẽ và sáng sủa giữa một vỏ công nghiệp. Bàn làm việc chung, hệ kệ gỗ và mảng đồ hoạ thương hiệu tạo một môi trường làm việc rõ ràng ngay cạnh khu sản xuất.',
        en: 'The office is built from panel and glass partitions on a terrazzo floor, keeping it clean and bright inside an industrial shell. Shared desks, oak shelving and brand graphics create a legible workplace right beside production.'
      },
      craftsmanship: {
        vi: 'Với gói thầu thiết kế và thi công, hệ vách panel, kệ gỗ và khu làm việc được dựng trực tiếp trong nhà xưởng — một phần hoàn thiện đặt cạnh phần thô của công trình.',
        en: 'Delivered as design and construction, the panel partitions, oak shelving and work area were built directly within the warehouse — a finished insert set against the raw fabric of the building.'
      },
      experience: {
        vi: 'Nhân viên làm việc trong một không gian gọn và sáng, nhưng vẫn ở ngay trong nhịp sản xuất; ranh giới giữa xưởng và văn phòng được giữ mỏng một cách có chủ đích.',
        en: 'Staff work in a compact, bright space while staying within the rhythm of production; the line between workshop and office is kept deliberately thin.'
      }
    },
    seo: {
      keywords: {
        vi: ['thiết kế văn phòng nhà xưởng', 'nội thất nhà xưởng kết hợp văn phòng', 'thiết kế văn phòng công nghiệp'],
        en: ['factory office design', 'warehouse office interior', 'industrial office design']
      }
    }
  }
]
