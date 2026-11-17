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

export type PrunePlan = {
  prune: MediaManifestAsset[]
  errors: string[]
}

/**
 * Plans removal of manifest entries that were never uploaded (`status: 'planned'`).
 * An entry is a candidate when its path is named explicitly or its source file is gone
 * (so it can never be uploaded). Uploaded assets are never pruned (no-overwrite rule A1),
 * and a candidate still referenced by app code blocks the whole plan.
 */
export function planPrunePlanned(options: {
  assets: readonly MediaManifestAsset[]
  explicitPaths: readonly string[]
  sourceExists: (sourceFile: string) => boolean
  isReferenced: (asset: MediaManifestAsset) => boolean
}): PrunePlan {
  const errors: string[] = []
  const byPath = new Map(options.assets.map(asset => [asset.path, asset]))
  for (const path of options.explicitPaths) {
    const asset = byPath.get(path)
    if (!asset) {
      errors.push(`not in manifest: ${path}`)
    } else if (asset.status !== 'planned') {
      errors.push(`refusing to prune ${asset.status} asset (only never-uploaded 'planned' entries): ${path}`)
    }
  }

  const explicit = new Set(options.explicitPaths)
  const prune = options.assets.filter(asset =>
    asset.status === 'planned'
    && (explicit.has(asset.path) || !asset.sourceFile || !options.sourceExists(asset.sourceFile))
  )
  for (const asset of prune) {
    if (options.isReferenced(asset)) {
      errors.push(`still referenced in app code: ${asset.path}`)
    }
  }
  return { prune: errors.length > 0 ? [] : prune, errors }
}
