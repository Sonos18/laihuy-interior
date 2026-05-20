import type { Project } from "~/shared/types/project";

const eoGioHotelImages: [string, ...string[]] = [
  "/images/projects/hotel/eo_gio/reception.png",
  "/images/projects/hotel/eo_gio/bed.png",
  "/images/projects/hotel/eo_gio/image_1.png",
  "/images/projects/hotel/eo_gio/image_2.png",
  "/images/projects/hotel/eo_gio/table.png",
  "/images/projects/hotel/eo_gio/toilet.png",
];

const codiHotelImages: [string, ...string[]] = [
  "/images/projects/hotel/codi/reception_desk.jpg",
  "/images/projects/hotel/codi/bed_2.jpg",
  "/images/projects/hotel/codi/wardrobe.jpg",
];

const codiVillaImages: [string, ...string[]] = [
  "/images/projects/villa/codi_villa/phong_khach.jpg",
  "/images/projects/villa/codi_villa/phong_khach_2.jpg",
  "/images/projects/villa/codi_villa/phong_bep.jpg",
  "/images/projects/villa/codi_villa/phong_ngu.jpg",
  "/images/projects/villa/codi_villa/phong_ngu_2.jpg",
  "/images/projects/villa/codi_villa/toilet.jpg",
];

const anhDuyHouseImages: [string, ...string[]] = [
  "/images/projects/house/anhduy_house/phong_khach.jpg",
  "/images/projects/house/anhduy_house/phong_khach_2.jpg",
  "/images/projects/house/anhduy_house/phong_an.jpg",
  "/images/projects/house/anhduy_house/bep.jpg",
  "/images/projects/house/anhduy_house/gieng_troi.jpg",
  "/images/projects/house/anhduy_house/phong_ngu.jpg",
  "/images/projects/house/anhduy_house/phong_ngu_2.jpg",
  "/images/projects/house/anhduy_house/may_giat.jpg",
  "/images/projects/house/anhduy_house/toilet.jpg",
];

const chilyHouseImages: [string, ...string[]] = [
  "/images/projects/house/chily_house/phong_khach.jpg",
  "/images/projects/house/chily_house/phong_khach_2.jpg",
  "/images/projects/house/chily_house/ban_an.jpg",
  "/images/projects/house/chily_house/phong_bep.jpg",
  "/images/projects/house/chily_house/phong_ngu.jpg",
  "/images/projects/house/chily_house/phong_ngu_2.jpg",
  "/images/projects/house/chily_house/phong_be_trai.jpg",
  "/images/projects/house/chily_house/phong_be_trai_2.jpg",
];

const officeWorkspaceImages: [string, ...string[]] = [
  "/images/projects/office/long_desk.jpg",
  "/images/projects/office/ban_dai.jpg",
  "/images/projects/office/ban_lam_viec.jpg",
  "/images/projects/office/ke_chua.jpg",
  "/images/projects/office/phong.jpg",
];

export const projects: Project[] = [
  {
    id: 1,
    name: "Eo Gio Boutique Hotel",
    slug: "eo-gio-boutique-hotel",
    shortDescription:
      "Không gian lưu trú boutique ấm áp, kết hợp quầy đón tiếp chỉn chu, phòng nghỉ thư giãn và bảng vật liệu giàu cảm xúc.",
    description: [
      "Eo Gio Boutique Hotel được định hướng như một không gian lưu trú hiện đại, thân thiện và có bản sắc riêng trong từng điểm chạm.",
      "Từ khu lễ tân, phòng ngủ đến các góc tiện ích, thiết kế ưu tiên cảm giác mềm mại, dễ chịu nhưng vẫn đảm bảo tính vận hành của khách sạn.",
      "Bảng màu gỗ ấm, ánh sáng gián tiếp và các đường cong nội thất giúp công trình tạo được ấn tượng nhẹ nhàng ngay từ khoảnh khắc đầu tiên.",
    ],
    image: [eoGioHotelImages[0]],
    category: "HOTEL",
    categoryName: "Khách sạn",
    location: "Việt Nam",
    area: "Khách sạn boutique",
    year: "2026",
    client: "Eo Gio Hotel",
    style: "Hiện đại ấm áp",
    gallery: eoGioHotelImages.slice(1),
    content: {
      overview:
        "Dự án Eo Gio Boutique Hotel được phát triển với mong muốn tạo nên một trải nghiệm lưu trú gần gũi nhưng vẫn giữ được tinh thần chuyên nghiệp của không gian hospitality. Khu vực lễ tân, phòng nghỉ và các góc tiện ích được tổ chức thành một mạch trải nghiệm rõ ràng, giúp khách dễ định hướng, dễ thư giãn và cảm nhận được sự chăm chút trong từng chi tiết.",
      concept:
        "Ý tưởng thiết kế lấy cảm hứng từ sự cân bằng giữa chất liệu tự nhiên, hình khối bo mềm và ánh sáng ấm. Mảng ốp gỗ lớn tại khu lễ tân tạo cảm giác vững chãi, trong khi quầy cong, ghế lounge và các chi tiết chuyển tiếp giúp không gian trở nên thân thiện hơn với khách lưu trú.",
      solution:
        "Lai Huy Interior tổ chức công năng theo từng lớp trải nghiệm: khu đón tiếp có nhận diện rõ ràng, khu chờ thư thái và phòng nghỉ có tính riêng tư cao. Hệ đèn hắt, bề mặt gỗ, đá sáng màu và kính được kết hợp để tăng chiều sâu thị giác, đồng thời giúp công trình vận hành thuận tiện trong thực tế.",
      highlights: [
        "Khu lễ tân có điểm nhận diện sang trọng nhưng không tạo cảm giác xa cách",
        "Bảng màu gỗ, kem và be giúp không gian lưu trú trở nên thư giãn hơn",
        "Ánh sáng gián tiếp làm mềm các mảng tường và nhấn mạnh đường cong nội thất",
        "Các khu chức năng được bố trí mạch lạc, phù hợp với nhịp vận hành khách sạn",
      ],
      materials: [
        "Gỗ phủ veneer hoặc melamine tông ấm",
        "Đá sáng màu cho quầy lễ tân và bề mặt điểm nhấn",
        "Kính, khung kim loại sơn tĩnh điện và đèn LED gián tiếp",
        "Vải bọc nội thất tông trung tính cho khu chờ",
      ],
    },
  },
  {
    id: 2,
    name: "Codi Boutique Hotel",
    slug: "codi-boutique-hotel",
    shortDescription:
      "Thiết kế khách sạn boutique thanh lịch với đường cong mềm, sắc độ trung tính và các chi tiết lưu trú tinh gọn.",
    description: [
      "Codi Boutique Hotel khai thác vẻ đẹp của sự tiết chế, tập trung vào cảm giác thanh lịch và thân thiện.",
      "Không gian lễ tân sử dụng hình khối vòm, ánh sáng hắt và vật liệu sáng màu để tạo dấu ấn nhận diện nhẹ nhàng.",
      "Các chi tiết phòng nghỉ được xử lý tinh gọn, phù hợp với trải nghiệm lưu trú hiện đại và tiện nghi.",
    ],
    image: [codiHotelImages[0]],
    category: "HOTEL",
    categoryName: "Khách sạn",
    location: "Việt Nam",
    area: "Khách sạn boutique quy mô nhỏ",
    year: "2026",
    client: "Codi Hotel",
    style: "Modern Classic tinh giản",
    gallery: codiHotelImages.slice(1),
    content: {
      overview:
        "Codi Boutique Hotel được thiết kế cho mô hình lưu trú quy mô vừa và nhỏ, nơi mỗi mét vuông đều cần đạt được sự cân bằng giữa hình ảnh thương hiệu, công năng vận hành và cảm giác thoải mái của khách. Thiết kế không phô trương mà tạo ấn tượng bằng tỷ lệ đẹp, màu sắc dịu và những chi tiết hoàn thiện gọn gàng.",
      concept:
        "Tinh thần chủ đạo của dự án là sự thanh lịch trong giới hạn. Mảng vòm phía sau quầy lễ tân đóng vai trò như điểm nhấn nhận diện mềm mại, kết hợp cùng ánh sáng viền và màu nâu be để tạo chiều sâu. Những đường nét thẳng, bề mặt phẳng và chi tiết kim loại mảnh giúp tổng thể hiện đại hơn mà vẫn giữ được nét duyên dáng.",
      solution:
        "Giải pháp thiết kế tập trung vào việc làm rõ khu vực đón tiếp, tối ưu hệ tủ và tạo cảm giác sạch sẽ cho phòng nghỉ. Các lớp vật liệu được chọn theo hướng dễ bảo trì, bền bỉ và phù hợp với cường độ sử dụng của không gian khách sạn, đồng thời vẫn đảm bảo trải nghiệm thị giác tinh tế.",
      highlights: [
        "Mảng vòm nhận diện tạo điểm nhấn mềm mại cho khu vực lễ tân",
        "Sắc độ be, trắng ngà và nâu nhạt mang lại cảm giác nhẹ nhàng, sạch sẽ",
        "Chi tiết quầy và hệ tủ được xử lý gọn, phù hợp với diện tích vừa phải",
        "Phòng nghỉ ưu tiên sự tiện dụng, lưu trữ hợp lý và cảm giác thư thái",
      ],
      materials: [
        "Đá nhân tạo sáng màu cho mặt quầy",
        "Lam gỗ, vách sơn hiệu ứng và tấm ốp tông trung tính",
        "Đèn thả, đèn hắt viền và hệ chiếu sáng âm trần",
        "Phụ kiện kim loại mảnh tạo điểm nhấn hiện đại",
      ],
    },
  },
  {
    id: 3,
    name: "Codi Villa hiện đại",
    slug: "codi-villa-hien-dai",
    shortDescription:
      "Không gian villa hiện đại với phòng khách rộng mở, bếp liền mạch và phòng ngủ được xử lý theo tinh thần nghỉ dưỡng riêng tư.",
    description: [
      "Codi Villa hướng đến một trải nghiệm sống rộng rãi, sáng và có chiều sâu vật liệu.",
      "Các khu vực sinh hoạt chung được kết nối bằng bảng màu trung tính, chất liệu gỗ ấm và đường nét nội thất mạnh mẽ.",
      "Phòng ngủ và khu vệ sinh được tiết chế chi tiết để giữ cảm giác riêng tư, sạch gọn và thư giãn.",
    ],
    image: [codiVillaImages[0]],
    category: "VILLA",
    categoryName: "Biệt thự",
    location: "Việt Nam",
    area: "Không gian villa gia đình",
    year: "2026",
    client: "Codi Villa",
    style: "Hiện đại sang trọng",
    gallery: codiVillaImages.slice(1),
    content: {
      overview:
        "Codi Villa được xây dựng như một không gian sống cao cấp dành cho gia đình, nơi phòng khách, bếp, phòng ngủ và khu vệ sinh cùng chia sẻ một ngôn ngữ thiết kế liền mạch. Dự án ưu tiên sự cân bằng giữa cảm giác sang trọng, công năng sinh hoạt hằng ngày và khả năng giữ cho không gian luôn gọn gàng, thoáng sáng.",
      concept:
        "Thiết kế khai thác vẻ đẹp của các mảng khối rõ ràng, vật liệu gỗ ấm và bề mặt đá có sắc độ tinh tế. Phòng khách đóng vai trò trung tâm thị giác với hệ tường điểm nhấn và ánh sáng được kiểm soát, trong khi khu bếp và phòng ngủ tiếp nối bằng tinh thần hiện đại, ít chi tiết nhưng giàu cảm xúc.",
      solution:
        "Các khu chức năng được xử lý theo hướng mở nhưng vẫn có ranh giới sử dụng rõ ràng. Hệ tủ cao, tủ âm và các bề mặt phẳng giúp giảm nhiễu thị giác; ánh sáng được phân tầng để vừa phục vụ sinh hoạt, vừa tạo bầu không khí ấm vào buổi tối. Những vật liệu dễ bảo trì được ưu tiên để phù hợp với nhịp sống gia đình.",
      highlights: [
        "Phòng khách rộng mở với mảng tường điểm nhấn sang trọng và có chiều sâu",
        "Bếp được tổ chức gọn, thuận tiện cho sinh hoạt hằng ngày và tiếp khách",
        "Phòng ngủ sử dụng màu trung tính, ánh sáng mềm và hệ lưu trữ liền mạch",
        "Khu vệ sinh giữ tinh thần sạch, sáng và dễ bảo trì",
        "Tổng thể đồng bộ từ không gian chung đến khu vực riêng tư",
      ],
      materials: [
        "Gỗ công nghiệp phủ veneer hoặc laminate tông ấm",
        "Đá ốp vân nhẹ cho bề mặt bếp và các mảng nhấn",
        "Kính, kim loại sơn tĩnh điện và đèn LED hắt",
        "Vải bọc trung tính, bề mặt sơn hiệu ứng và phụ kiện hoàn thiện cao cấp",
      ],
    },
  },
  {
    id: 4,
    name: "Nhà phố Anh Duy",
    slug: "nha-pho-anh-duy",
    shortDescription:
      "Thiết kế nhà phố gia đình với phòng khách, bếp, giếng trời và phòng ngủ được tổ chức sáng thoáng, tiện nghi.",
    description: [
      "Nhà phố Anh Duy tập trung vào sự cân bằng giữa công năng sống gia đình và cảm giác thoáng đãng trong không gian đô thị.",
      "Phòng khách, phòng ăn và bếp được kết nối mạch lạc, trong khi giếng trời giúp bổ sung ánh sáng và tạo nhịp thở cho công trình.",
      "Các phòng ngủ, khu giặt và vệ sinh được xử lý gọn gàng để đáp ứng nhu cầu sử dụng thực tế.",
    ],
    image: [anhDuyHouseImages[0]],
    category: "HOUSE",
    categoryName: "Nhà phố",
    location: "Việt Nam",
    area: "Nhà phố gia đình",
    year: "2026",
    client: "Gia đình Anh Duy",
    style: "Hiện đại ấm áp",
    gallery: anhDuyHouseImages.slice(1),
    content: {
      overview:
        "Dự án Nhà phố Anh Duy được phát triển quanh nhu cầu sống thực tế của một gia đình trẻ: đủ lưu trữ, dễ di chuyển, có ánh sáng tự nhiên và vẫn giữ được sự ấm cúng trong từng khu vực. Không gian sinh hoạt chung được mở rộng bằng cách tổ chức phòng khách, phòng ăn và bếp theo một mạch liên tục, tạo cảm giác kết nối giữa các thành viên.",
      concept:
        "Tinh thần thiết kế hướng đến sự giản dị có chọn lọc. Bảng màu trung tính, gỗ sáng và ánh sáng tự nhiên từ giếng trời giúp giảm cảm giác hẹp thường gặp ở nhà phố. Các chi tiết nội thất được tiết chế, ưu tiên tỷ lệ gọn, bề mặt sạch và những điểm nhấn vừa đủ để không gian có chiều sâu.",
      solution:
        "Lai Huy Interior khai thác giếng trời như một lõi sáng cho ngôi nhà, đồng thời bố trí hệ tủ và khu phụ trợ theo hướng kín đáo để giữ cho các không gian chính luôn thông thoáng. Phòng ngủ được thiết kế với lưu trữ hợp lý, khu bếp đảm bảo luồng thao tác thuận tiện, còn khu giặt và vệ sinh được xử lý gọn để phù hợp nhịp sinh hoạt hằng ngày.",
      highlights: [
        "Phòng khách và phòng ăn liên thông, tạo cảm giác rộng và gần gũi",
        "Giếng trời đưa ánh sáng tự nhiên vào sâu trong nhà",
        "Bếp được bố trí rõ luồng thao tác, tối ưu cho sinh hoạt gia đình",
        "Phòng ngủ có hệ lưu trữ gọn, giữ được cảm giác yên tĩnh",
        "Khu phụ trợ được xử lý kín đáo, sạch và dễ sử dụng",
      ],
      materials: [
        "Gỗ công nghiệp tông sáng cho hệ tủ và mảng ốp",
        "Đá hoặc bề mặt chống ẩm cho khu bếp",
        "Sơn tường trung tính, kính và đèn âm trần",
        "Gạch vệ sinh dễ bảo trì, phù hợp sử dụng lâu dài",
      ],
    },
  },
  {
    id: 5,
    name: "Nhà phố Chily",
    slug: "nha-pho-chily",
    shortDescription:
      "Không gian nhà phố trẻ trung với phòng khách ấm áp, bếp ăn liền mạch, phòng ngủ thư thái và phòng bé giàu cá tính.",
    description: [
      "Nhà phố Chily được thiết kế cho nhịp sống gia đình hiện đại, đề cao sự tiện nghi và cảm giác gần gũi.",
      "Các không gian chung sử dụng màu sắc ấm, đường nét gọn và bố cục dễ sinh hoạt.",
      "Phòng ngủ và phòng bé được phát triển với ngôn ngữ riêng, vừa cá nhân hóa vừa giữ sự đồng bộ tổng thể.",
    ],
    image: [chilyHouseImages[0]],
    category: "HOUSE",
    categoryName: "Nhà phố",
    location: "Việt Nam",
    area: "Nhà phố gia đình",
    year: "2026",
    client: "Gia đình Chily",
    style: "Hiện đại trẻ trung",
    gallery: chilyHouseImages.slice(1),
    content: {
      overview:
        "Nhà phố Chily là dự án nội thất gia đình có tinh thần trẻ trung, nơi từng khu vực được thiết kế để phục vụ thói quen sinh hoạt cụ thể nhưng vẫn giữ một tổng thể mềm mại và thống nhất. Phòng khách, bàn ăn và bếp tạo thành vùng sinh hoạt chung ấm áp; các phòng riêng được cá nhân hóa bằng màu sắc, hệ tủ và cách tổ chức ánh sáng.",
      concept:
        "Ý tưởng thiết kế dựa trên sự kết hợp giữa nền trung tính, điểm nhấn gỗ và các mảng màu vừa phải. Không gian không chạy theo sự cầu kỳ mà tập trung vào cảm giác sống: dễ sử dụng, dễ giữ gọn và có nét riêng cho từng thành viên. Phòng bé được xử lý sinh động hơn nhưng vẫn tiết chế để phù hợp lâu dài.",
      solution:
        "Bố cục nội thất được tối ưu theo từng hoạt động: tiếp khách, dùng bữa, nấu nướng, nghỉ ngơi và học tập. Hệ tủ được tích hợp sát tường để tiết kiệm diện tích, các bề mặt sử dụng vật liệu bền và dễ vệ sinh. Ánh sáng được đặt theo lớp để không gian ban ngày đủ sáng, ban đêm có cảm giác ấm và thư giãn.",
      highlights: [
        "Phòng khách ấm áp với bố cục dễ tiếp khách và sinh hoạt gia đình",
        "Khu bàn ăn và bếp liên kết chặt chẽ, thuận tiện trong sử dụng hằng ngày",
        "Phòng ngủ chính giữ tinh thần thư thái, gọn và riêng tư",
        "Phòng bé có màu sắc cá tính nhưng vẫn đảm bảo tính linh hoạt lâu dài",
        "Hệ tủ lưu trữ được tích hợp để giảm bề bộn thị giác",
      ],
      materials: [
        "Gỗ công nghiệp phủ melamine hoặc laminate tông ấm",
        "Bề mặt đá hoặc vật liệu chống bám bẩn cho khu bếp",
        "Sơn màu trung tính kết hợp điểm nhấn nhẹ cho phòng bé",
        "Đèn âm trần, đèn hắt và phụ kiện kim loại mảnh",
      ],
    },
  },
  {
    id: 6,
    name: "Không gian văn phòng Lai Huy",
    slug: "khong-gian-van-phong-lai-huy",
    shortDescription:
      "Văn phòng hiện đại, tinh gọn và hiệu quả cho làm việc nhóm, gặp gỡ khách hàng và vận hành hằng ngày.",
    description: [
      "Không gian văn phòng được tổ chức quanh bàn làm việc dài, hệ lưu trữ tích hợp và nền vật liệu hiện đại.",
      "Các đường sáng tuyến tính giúp định hình không gian, đồng thời tạo cảm giác chuyên nghiệp và tập trung.",
      "Thiết kế hướng đến một môi trường làm việc gọn gàng, linh hoạt và có hình ảnh thương hiệu rõ ràng.",
    ],
    image: [officeWorkspaceImages[0]],
    category: "OFFICE",
    categoryName: "Văn phòng",
    location: "Việt Nam",
    area: "Không gian làm việc nhóm",
    year: "2026",
    style: "Hiện đại tối giản",
    gallery: officeWorkspaceImages.slice(1),
    content: {
      overview:
        "Không gian văn phòng được xây dựng với định hướng tạo ra môi trường làm việc có tính tập trung cao, đồng thời vẫn đủ cởi mở cho các hoạt động trao đổi nhóm và tiếp khách. Bố cục bàn dài giúp tăng khả năng kết nối, trong khi hệ tủ âm và các mảng tường tối màu giữ cho văn phòng luôn gọn gàng, có tổ chức.",
      concept:
        "Ý tưởng thiết kế tập trung vào các đường nét tuyến tính, vật liệu trung tính và ánh sáng rõ ràng. Mảng gỗ giúp cân bằng sắc độ lạnh của kính và kim loại, tạo nên tổng thể chuyên nghiệp nhưng không khô cứng. Mọi chi tiết đều được tiết chế để người sử dụng có thể tập trung vào công việc.",
      solution:
        "Không gian được chia thành lớp làm việc chính, lớp lưu trữ phía sau và các vùng kỹ thuật được xử lý kín đáo. Hệ đèn tuyến tính trên trần vừa bổ sung ánh sáng cho bàn làm việc, vừa tạo nhịp điệu thị giác. Vách kính giúp duy trì sự kết nối với môi trường xung quanh nhưng vẫn giữ được tính riêng tư cần thiết.",
      highlights: [
        "Bàn làm việc dài hỗ trợ làm việc nhóm và các buổi trao đổi nhanh",
        "Hệ tủ âm giảm nhiễu thị giác, giữ không gian làm việc luôn gọn gàng",
        "Ánh sáng tuyến tính tạo cảm giác hiện đại và định hướng không gian rõ ràng",
        "Kính, gỗ và bề mặt tối màu tạo hình ảnh chuyên nghiệp, bền vững",
      ],
      materials: [
        "Gỗ công nghiệp phủ melamine hoặc laminate tông trung tính",
        "Kính cường lực và khung nhôm sơn tĩnh điện",
        "Đèn tuyến tính LED cho khu vực làm việc chính",
        "Bề mặt tủ màu tối giúp tăng chiều sâu và sự tập trung",
      ],
    },
  },
];
