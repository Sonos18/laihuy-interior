import { describe, expect, it } from 'vitest'
import type { MediaManifestAsset } from '../app/shared/media/types'
import {
  assertFullRegenerationCanWrite,
  mergeDiscoveredAssets,
  parsePathPrefix,
  selectAssetsByPrefix
} from '../scripts/media/selection'

const existing: MediaManifestAsset = {
  path: 'company/about-workspace.webp',
  kind: 'raster',
  category: 'company',
  group: null,
  oldPublicPath: '/images/about_workspace.jpg',
  sourceFile: 'public/images/about_workspace.jpg',
  sourceChecksum: null,
  checksum: null,
  width: 1600,
  height: 900,
  bytes: null,
  variants: [],
  version: 1,
  supersedes: null,
  status: 'planned',
  uploadedAt: null,
  alt: null
}

const newAsset: MediaManifestAsset = {
  ...existing,
  path: 'company/homepage-material-story/raw-timber.webp',
  group: 'homepage-material-story',
  oldPublicPath: '/images/homepage-material-story/raw-timber.jpg',
  sourceFile: 'public/images/homepage-material-story/raw-timber.jpg'
}

describe('mergeDiscoveredAssets', () => {
  it('adds a newly discovered storage path without replacing existing assets', () => {
    expect(mergeDiscoveredAssets([existing], [newAsset])).toEqual([existing, newAsset])
  })

  it('deduplicates a rediscovered asset with the same source file', () => {
    expect(mergeDiscoveredAssets([existing], [{ ...existing }])).toEqual([existing])
  })

  it('rejects a different source file at an existing storage path', () => {
    expect(() => mergeDiscoveredAssets([existing], [{ ...existing, sourceFile: 'different.png' }]))
      .toThrow(/storage path collision/)
  })
})

describe('selectAssetsByPrefix', () => {
  it('returns only assets below the selected storage prefix', () => {
    expect(selectAssetsByPrefix([existing, newAsset], 'company/homepage-material-story/'))
      .toEqual([newAsset])
  })
})

describe('assertFullRegenerationCanWrite', () => {
  it('refuses an unmerged write when the legacy source library is absent', () => {
    expect(() => assertFullRegenerationCanWrite({
      write: true,
      merge: false,
      legacyDirectoriesPresent: false
    })).toThrow(/full source library/i)
  })

  it('allows a merge write when the legacy source library is absent', () => {
    expect(() => assertFullRegenerationCanWrite({
      write: true,
      merge: true,
      legacyDirectoriesPresent: false
    })).not.toThrow()
  })
})

describe('parsePathPrefix', () => {
  it('parses exactly one non-empty prefix flag', () => {
    expect(parsePathPrefix(['--dry-run', '--path-prefix=company/homepage-material-story/']))
      .toBe('company/homepage-material-story/')
  })

  it('rejects duplicate prefix flags', () => {
    expect(() => parsePathPrefix([
      '--path-prefix=company/homepage-material-story/',
      '--path-prefix=company/workshop/'
    ])).toThrow(/exactly once/i)
  })

  it('rejects malformed prefix flags', () => {
    expect(() => parsePathPrefix(['--path-prefix=company/homepage-material-story/', '--path-prefix']))
      .toThrow(/exactly once/i)
  })
})
