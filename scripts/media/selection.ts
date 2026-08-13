import type { MediaManifestAsset } from '../../app/shared/media/types'

export function assertFullRegenerationCanWrite(options: {
  write: boolean
  merge: boolean
  legacyDirectoriesPresent: boolean
}): void {
  if (options.write && !options.merge && !options.legacyDirectoriesPresent) {
    throw new Error('full source library is required for an unmerged manifest write')
  }
}

export function parsePathPrefix(arguments_: readonly string[]): string | null {
  const prefixArguments = arguments_.filter(argument => argument.startsWith('--path-prefix'))
  if (prefixArguments.length === 0) return null
  if (prefixArguments.length !== 1 || !prefixArguments[0].startsWith('--path-prefix=')) {
    throw new Error('path prefix must appear exactly once as --path-prefix=<prefix>')
  }
  const prefix = prefixArguments[0].slice('--path-prefix='.length)
  if (!prefix) {
    throw new Error('path prefix must not be empty')
  }
  return prefix
}

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
