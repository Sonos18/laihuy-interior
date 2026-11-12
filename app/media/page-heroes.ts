// The hero photograph of each route, in one place. A page's hero and the page door that leads to
// it (PageDoor, DESIGN.md "Page door") must show the same photograph, so both read it from here.
// Alt text stays with each page (app/data); these are bare assets.
import { projectMedia } from './catalog.generated'
import { requireWorkshopAsset } from './factory-media'
import type { MediaAsset } from '~/shared/media/types'

const requireProjectAsset = (project: keyof typeof projectMedia, suffix: string): MediaAsset => {
  const asset = projectMedia[project].images.find(image => image.path.endsWith(suffix))
  if (!asset) {
    throw new Error(`Missing hero media asset: projects/${project}${suffix}`)
  }
  return asset
}

export const pageHeroAssets = {
  home: projectMedia['khach-san-eo-gio'].cover,
  projects: projectMedia['codi-villa-phan-thiet'].cover,
  services: requireProjectAsset('codi-boutique-hotel', '/sanh-don/2.webp'),
  factory: requireWorkshopAsset('4.webp'),
  about: requireWorkshopAsset('3.webp'),
  careers: requireWorkshopAsset('5.webp'),
  contact: requireProjectAsset('nha-vuon-chily', '/5.webp')
} as const satisfies Record<string, MediaAsset>

export type PageHeroKey = keyof typeof pageHeroAssets
