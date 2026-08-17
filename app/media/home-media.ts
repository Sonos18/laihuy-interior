import type { HomeStoryStageId } from '~/data/home-page'
import { companyMedia, projectMedia } from './catalog.generated'
import type { MediaAsset, MediaImage } from '~/shared/media/types'

const EO_GIO_RECEPTION_PATH = 'projects/khach-san-eo-gio/sanh-don/24.webp'

const decorative = (asset: MediaAsset): MediaImage => ({ ...asset, alt: '' })

const eoGioReception = projectMedia['khach-san-eo-gio'].galleries['sanh-don']
  ?.find(asset => asset.path === EO_GIO_RECEPTION_PATH)

if (!eoGioReception) {
  throw new Error(`[home-media] Missing catalog asset: ${EO_GIO_RECEPTION_PATH}`)
}

export const homeMaterialStoryMedia: Record<HomeStoryStageId, MediaImage> = {
  existing: decorative(companyMedia.homeMaterialEoGio00ExistingV1),
  drawing: decorative(companyMedia.homeMaterialEoGio01DrawingV2),
  material: decorative(companyMedia.homeMaterialEoGio02MaterialV2),
  space: decorative(eoGioReception)
}
