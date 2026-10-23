import type { LocalizedText } from '~/shared/types/localization'

type ProjectsSectionContent = {
  eyebrow: LocalizedText
  title: LocalizedText
  lead: LocalizedText
}

/** UI copy of the project index (`/du-an`): the two section heads and the filter group labels (the
 *  archive's, and the case-study gallery's room filter). */
export const projectsPageContent: {
  featured: ProjectsSectionContent
  archive: ProjectsSectionContent
  filterLabel: LocalizedText
  galleryFilterLabel: LocalizedText
} = {
  featured: {
    eyebrow: { vi: 'Thiết kế · Sản xuất · Thi công', en: 'Design · Production · Fit-out' },
    title: { vi: 'Làm trọn từ thiết kế đến lắp đặt', en: 'Designed, made and installed by Lai Huy' },
    lead: {
      vi: 'Những công trình do Lai Huy thiết kế, sản xuất tại xưởng và thi công tại công trình.',
      en: 'Projects Lai Huy designed, produced in its own factory and installed on site.'
    }
  },
  archive: {
    eyebrow: { vi: 'Theo loại hình', en: 'By type' },
    title: { vi: 'Các dự án khác', en: 'More projects' },
    lead: {
      vi: 'Lọc theo loại hình; mỗi thẻ ghi diện tích và phạm vi Lai Huy đảm nhận.',
      en: 'Filter by type; each card shows the floor area and the scope Lai Huy delivered.'
    }
  },
  filterLabel: { vi: 'Lọc dự án theo loại hình', en: 'Filter projects by type' },
  galleryFilterLabel: { vi: 'Lọc ảnh theo phòng', en: 'Filter images by room' }
}
