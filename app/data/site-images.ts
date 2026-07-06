import { brandMedia, companyMedia } from '~/media/catalog.generated'
import type { MediaImage } from '~/shared/media/types'

// Business layer: pairs catalog media (company/brand domains) with alt copy.
// Media (path/dimensions) is owned by the generated catalog; only the alt text lives here.
export const siteImages = {
  bannerHome: {
    ...brandMedia.bannerHome,
    alt: {
      vi: 'Không gian nội thất do Lai Huy Interior thi công',
      en: 'Interior space built by Lai Huy Interior'
    }
  },
  aboutWorkspace: {
    ...companyMedia.aboutWorkspace,
    alt: {
      vi: 'Không gian làm việc và sản xuất Lai Huy Interior',
      en: 'Lai Huy Interior workspace and production capability'
    }
  },
  companyStory: {
    ...companyMedia.companyStory,
    alt: {
      vi: 'Câu chuyện thương hiệu Lai Huy Interior',
      en: 'The Lai Huy Interior company story'
    }
  },
  mapAddress: {
    ...companyMedia.mapAddress,
    alt: {
      vi: 'Bản đồ địa chỉ nhà xưởng Lai Huy Interior',
      en: 'Map of the Lai Huy Interior factory location'
    }
  }
} satisfies Record<string, MediaImage>
