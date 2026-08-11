import { factoryMediaAlt, type FactoryMediaKey } from '../data/factory'
import { companyMedia, workshopMedia } from './catalog.generated'
import { withAlt } from './project-media'
import type { MediaAsset, MediaImage } from '~/shared/media/types'

export const requireWorkshopAsset = (
  filename: string,
  assets: readonly MediaAsset[] = workshopMedia
): MediaAsset => {
  const asset = assets.find(item => item.path.endsWith(`/workshop/${filename}`))
  if (!asset) {
    throw new Error(`Missing workshop media asset: company/workshop/${filename}`)
  }
  return asset
}

export const factoryMedia = {
  hero: withAlt(requireWorkshopAsset('4.webp'), factoryMediaAlt.hero),
  facade: withAlt(requireWorkshopAsset('1.webp'), factoryMediaAlt.facade),
  process: withAlt(requireWorkshopAsset('3.webp'), factoryMediaAlt.process),
  people: withAlt(companyMedia.companyStory, factoryMediaAlt.people),
  visit: withAlt(requireWorkshopAsset('2.webp'), factoryMediaAlt.visit)
} satisfies Record<FactoryMediaKey, MediaImage>
