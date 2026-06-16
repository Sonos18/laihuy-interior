import type { LocalizedText } from '~/shared/types/localization'

export type ExperienceCta = {
  label: LocalizedText
  to: string
}

/**
 * One full-viewport screen in the cinematic homepage journey.
 * The journey is an ordered sequence (IDEA -> EXPERIENCE), so each scene
 * carries a chapter number that the side rail uses for navigation.
 */
export type ExperienceScene = {
  id: string
  chapter: LocalizedText
  title: LocalizedText
  subtitle: LocalizedText
  cta: ExperienceCta
  /** Local background image. Screens 1-2 layer a drawn blueprint/wireframe instead. */
  image?: string
  align?: 'left' | 'center'
}

export const experienceScenes: ExperienceScene[] = [
  {
    id: 'blueprint',
    chapter: { vi: 'Ý tưởng', en: 'Blueprint' },
    title: {
      vi: 'Mọi kiệt tác bắt đầu từ một ý tưởng',
      en: 'Every masterpiece begins with a vision'
    },
    subtitle: {
      vi: 'Biến ý tưởng thành những trải nghiệm kiến trúc.',
      en: 'Transforming ideas into architectural experiences.'
    },
    cta: { label: { vi: 'Khám phá quy trình', en: 'Explore our process' }, to: '/nha-xuong' },
    image: '/images/projects/hotel/eo_gio/image_1.png',
    align: 'left'
  },
  {
    id: 'design',
    chapter: { vi: 'Thiết kế', en: 'Design' },
    title: {
      vi: 'Nơi trí tưởng tượng thành hình',
      en: 'Where imagination takes shape'
    },
    subtitle: {
      vi: 'Từ phác thảo ý tưởng đến hình ảnh trực quan sống động.',
      en: 'From concept sketches to immersive visualizations.'
    },
    cta: { label: { vi: 'Xem năng lực thiết kế', en: 'View design expertise' }, to: '/dich-vu' },
    image: '/images/projects/hotel/eo_gio/reception.png',
    align: 'left'
  },
  {
    id: 'visualization',
    chapter: { vi: 'Diễn họa', en: 'Visualization' },
    title: {
      vi: 'Thiết kế cho sự thanh lịch',
      en: 'Designed for elegance'
    },
    subtitle: {
      vi: 'Từng chi tiết được chăm chút trước khi thi công.',
      en: 'Every detail carefully crafted before construction begins.'
    },
    cta: { label: { vi: 'Khám phá dự án', en: 'Discover our projects' }, to: '/du-an' },
    image: '/images/projects/hotel/codi/reception_desk.jpg',
    align: 'left'
  },
  {
    id: 'construction',
    chapter: { vi: 'Thi công', en: 'Construction' },
    title: {
      vi: 'Kiến tạo vượt mọi kỳ vọng',
      en: 'Built beyond expectations'
    },
    subtitle: {
      vi: 'Biến ý tưởng thiết kế thành hiện thực ấn tượng.',
      en: 'Turning design concepts into remarkable realities.'
    },
    cta: { label: { vi: 'Xem công trình hoàn thiện', en: 'See completed works' }, to: '/du-an' },
    image: '/images/banner_home.jpg',
    align: 'center'
  },
  {
    id: 'arrival',
    chapter: { vi: 'Bước vào', en: 'Arrival' },
    title: {
      vi: 'Bước vào không gian đẳng cấp',
      en: 'Step into excellence'
    },
    subtitle: {
      vi: 'Trải nghiệm những không gian được tạo ra để truyền cảm hứng.',
      en: 'Experience spaces designed to inspire.'
    },
    cta: { label: { vi: 'Khám phá nội thất', en: 'Explore interiors' }, to: '/du-an' },
    image: '/images/projects/villa/codi_villa/phong_khach.jpg',
    align: 'left'
  },
  {
    id: 'craft',
    chapter: { vi: 'Chi tiết', en: 'Craft' },
    title: {
      vi: 'Sang trọng nằm trong từng chi tiết',
      en: 'Luxury lives in the details'
    },
    subtitle: {
      vi: 'Vật liệu, tay nghề và sự chính xác định hình mỗi dự án.',
      en: 'Materials, craftsmanship, and precision define every project.'
    },
    cta: { label: { vi: 'Xem chất lượng thi công', en: 'View construction quality' }, to: '/nha-xuong' },
    align: 'center'
  },
  {
    id: 'portfolio',
    chapter: { vi: 'Dự án', en: 'Portfolio' },
    title: {
      vi: 'Những dự án làm nên uy tín',
      en: 'Projects that define our reputation'
    },
    subtitle: {
      vi: 'Danh mục dự án được xây dựng từ niềm tin, chuyên môn và sự tận tâm.',
      en: 'A portfolio built through trust, expertise, and excellence.'
    },
    cta: { label: { vi: 'Xem toàn bộ dự án', en: 'View full portfolio' }, to: '/du-an' },
    align: 'center'
  },
  {
    id: 'consultation',
    chapter: { vi: 'Hợp tác', en: 'Consultation' },
    title: {
      vi: 'Cùng kiến tạo điều phi thường',
      en: 'Let\'s build something extraordinary'
    },
    subtitle: {
      vi: 'Hợp tác cùng Lai Huy để hiện thực hóa tầm nhìn của bạn.',
      en: 'Partner with Lai Huy to bring your vision to life.'
    },
    cta: { label: { vi: 'Đặt lịch tư vấn', en: 'Schedule a consultation' }, to: '/lien-he' },
    image: '/images/projects/villa/codi_villa/phong_khach_2.jpg',
    align: 'center'
  }
]

/** Close-up material/craft shots for the "details" screen montage. */
export const craftDetailImages: { src: string, label: LocalizedText }[] = [
  { src: '/images/projects/hotel/codi/wardrobe.jpg', label: { vi: 'Hệ tủ gỗ', en: 'Joinery' } },
  { src: '/images/projects/hotel/eo_gio/table.png', label: { vi: 'Đá & bề mặt', en: 'Stone & surfaces' } },
  { src: '/images/projects/villa/codi_villa/phong_bep.jpg', label: { vi: 'Ánh sáng', en: 'Lighting' } }
]
