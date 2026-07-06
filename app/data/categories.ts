import type { CategoryDefinition, ProjectCategory } from '~/shared/types/project'

// Single source of truth for category display: label, icon and ordering.
// Every consumer (filters, badges, sorting) derives from this map.
export const categoryDefinitions: Record<ProjectCategory, CategoryDefinition> = {
  hotel: { label: { vi: 'Khách sạn', en: 'Hotels' }, icon: 'i-lucide-bed-double', order: 1 },
  villa: { label: { vi: 'Villa', en: 'Villas' }, icon: 'i-lucide-home', order: 2 },
  house: { label: { vi: 'Nhà phố', en: 'Townhouses' }, icon: 'i-lucide-house', order: 3 },
  retreat: { label: { vi: 'Nghỉ dưỡng', en: 'Retreats' }, icon: 'i-lucide-tree-pine', order: 4 },
  office: { label: { vi: 'Văn phòng', en: 'Offices' }, icon: 'i-lucide-briefcase', order: 5 },
  commercial: { label: { vi: 'Thương mại', en: 'Commercial' }, icon: 'i-lucide-factory', order: 6 }
}

export const orderedCategories = (Object.keys(categoryDefinitions) as ProjectCategory[])
  .sort((first, second) => categoryDefinitions[first].order - categoryDefinitions[second].order)
