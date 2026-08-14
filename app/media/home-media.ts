import type { HomeStoryStageId } from '~/data/home-page'
import { companyMedia } from './catalog.generated'
import type { MediaAsset, MediaImage } from '~/shared/media/types'

const decorative = (asset: MediaAsset): MediaImage => ({ ...asset, alt: '' })

export const homeMaterialStoryMedia: Record<HomeStoryStageId, MediaImage> = {
  drawing: decorative(companyMedia.homeMaterial01DrawingV1),
  material: decorative(companyMedia.homeMaterial02MaterialV1),
  factory: decorative(companyMedia.homeMaterial03FactoryV1),
  space: decorative(companyMedia.homeMaterial04SpaceV1)
}
