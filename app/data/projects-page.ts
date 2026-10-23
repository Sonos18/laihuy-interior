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
    eyebrow: { vi: 'Thiết kế · Sản xuất · Thi công', en: 'Design · Production · Construction' },
    title: { vi: 'Một đầu mối cho cả công trình', en: 'One team for the whole build' },
    lead: {
      vi: 'Những công trình do Lai Huy thiết kế, sản xuất tại xưởng và thi công tại công trình.',
      en: 'Projects Lai Huy designed, produced in its own factory and built on site.'
    }
  },
  archive: {
    eyebrow: { vi: 'Lưu trữ', en: 'Archive' },
    title: { vi: 'Các dự án khác', en: 'More projects' },
    lead: {
      vi: 'Khách sạn, nhà ở, văn phòng và công trình khác, theo từng phạm vi công việc.',
      en: 'Hotels, homes, offices and other work, by scope of services.'
    }
  },
  filterLabel: { vi: 'Lọc dự án theo loại hình', en: 'Filter projects by type' },
  galleryFilterLabel: { vi: 'Lọc ảnh theo phòng', en: 'Filter photos by room' }
}
