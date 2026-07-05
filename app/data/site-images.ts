import type { MediaImage } from '~/shared/media/types'

export const siteImages = {
  bannerHome: {
    path: 'hero/banner-home.webp',
    alt: {
      vi: 'Không gian nội thất do Lai Huy Interior thi công',
      en: 'Interior space built by Lai Huy Interior'
    },
    width: 2560,
    height: 1636
  },
  aboutWorkspace: {
    path: 'company/about-workspace.webp',
    alt: {
      vi: 'Không gian làm việc và sản xuất Lai Huy Interior',
      en: 'Lai Huy Interior workspace and production capability'
    },
    width: 2048,
    height: 2560
  },
  companyStory: {
    path: 'company/company-story.webp',
    alt: {
      vi: 'Câu chuyện thương hiệu Lai Huy Interior',
      en: 'The Lai Huy Interior company story'
    },
    width: 900,
    height: 603
  },
  mapAddress: {
    path: 'company/map-address.webp',
    alt: {
      vi: 'Bản đồ địa chỉ nhà xưởng Lai Huy Interior',
      en: 'Map of the Lai Huy Interior factory location'
    },
    width: 1105,
    height: 637
  }
} satisfies Record<string, MediaImage>
