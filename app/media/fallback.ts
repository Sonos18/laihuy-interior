import manifest from '../shared/media/manifest.json'
import type { MediaManifest } from '../shared/media/types'

const assets = (manifest as MediaManifest).assets

/** Storage path → original `/public` path, for the USE_SUPABASE_MEDIA=false fallback. */
export const fallbackPaths: ReadonlyMap<string, string> = new Map(
  assets.flatMap(asset => (asset.oldPublicPath ? [[asset.path, asset.oldPublicPath] as const] : []))
)
