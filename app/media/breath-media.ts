// The breath photographs (DESIGN.md "Breath"): one full-bleed pause per long page. Each reuses a
// catalog entry from a project the page already shows; none is a factory photograph. They are
// decorative (`alt: ''`) because the same photograph, or its room, is described elsewhere.
import { projectMedia, type ProjectMediaId } from './catalog.generated'
import type { MediaAsset, MediaImage } from '~/shared/media/types'

const decorative = (asset: MediaAsset): MediaImage => ({ ...asset, alt: '' })

function requireProjectAsset(id: ProjectMediaId, path: string): MediaAsset {
  const asset = projectMedia[id].images.find(image => image.path === path)

  if (!asset) {
    throw new Error(`[breath-media] Missing catalog asset: ${path}`)
  }

  return asset
}

export const breathMedia = {
  /** About: an Eo Gió studio, the first project the about page features. */
  about: decorative(requireProjectAsset('khach-san-eo-gio', 'projects/khach-san-eo-gio/phong-studio-02/1.webp')),
  /** Services: the Codi Boutique Hotel reception, the project the services page is art-directed
   *  on (its stair is already the hero and an evidence tile). */
  services: decorative(requireProjectAsset('codi-boutique-hotel', 'projects/codi-boutique-hotel/sanh-don/1.webp'))
} as const

/** The narrowest landscape a 21:9 crop can take without cutting the room to a strip. */
const MIN_BREATH_ASPECT = 1.5

const aspect = (image: MediaImage) => image.width / image.height

/**
 * A case study's breath: the widest landscape photograph among the ones the page does not show
 * anywhere else (the first of equals), so the 21:9 crop loses the least of the room. The caller
 * passes that unused pool; a project without a landscape in it has no breath.
 */
export function caseStudyBreath(unused: readonly MediaImage[]): MediaImage | undefined {
  const found = unused
    .filter(image => aspect(image) >= MIN_BREATH_ASPECT)
    .reduce<MediaImage | undefined>((widest, image) =>
      !widest || aspect(image) > aspect(widest) ? image : widest, undefined)

  return found ? { ...found, alt: '' } : undefined
}
