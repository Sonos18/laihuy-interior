import type { MediaManifestAsset } from '../../app/shared/media/types'

export function mergeDiscoveredAssets(
  existing: readonly MediaManifestAsset[],
  discovered: readonly MediaManifestAsset[]
): MediaManifestAsset[] {
  const merged = new Map(existing.map(asset => [asset.path, asset]))
  for (const asset of discovered) {
    const current = merged.get(asset.path)
    if (!current) {
      merged.set(asset.path, asset)
      continue
    }
    if (current.sourceFile !== asset.sourceFile) {
      throw new Error(`storage path collision: ${asset.path}`)
    }
  }
  return [...merged.values()].sort((a, b) => a.path.localeCompare(b.path))
}

export function selectAssetsByPrefix(
  assets: readonly MediaManifestAsset[],
  pathPrefix: string | null
): MediaManifestAsset[] {
  return pathPrefix ? assets.filter(asset => asset.path.startsWith(pathPrefix)) : [...assets]
}
