import type { MediaManifestAsset } from '../../app/shared/media/types'

export function assertFullRegenerationCanWrite(options: {
  write: boolean
  merge: boolean
  existing: readonly MediaManifestAsset[] | null
  discovered: readonly MediaManifestAsset[]
}): void {
  if (!options.write || options.merge || !options.existing) return

  const existingSources = new Set(
    options.existing.flatMap(asset => asset.sourceFile ? [asset.sourceFile] : [])
  )
  const discoveredSources = new Set(
    options.discovered.flatMap(asset => asset.sourceFile ? [asset.sourceFile] : [])
  )
  const missingSources = [...existingSources].filter(sourceFile => !discoveredSources.has(sourceFile))
  if (missingSources.length > 0) {
    throw new Error(
      `incomplete source library: ${missingSources.length} manifest source file(s) were not discovered; `
      + `refusing unmerged write (first missing: ${missingSources[0]})`
    )
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
