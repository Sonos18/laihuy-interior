import { spawnSync } from 'node:child_process'
import {
  copyFileSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync
} from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import type { MediaManifest, MediaManifestAsset } from '../app/shared/media/types'
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

const repoRoot = resolve(import.meta.dirname, '..')
const tsxCli = join(repoRoot, 'node_modules/tsx/dist/cli.mjs')
const fixtureImage = join(repoRoot, 'public/logo.png')

const scanAsset = (path: string, sourceFile: string, group: string): MediaManifestAsset => ({
  path,
  kind: 'raster',
  category: path.split('/')[0] as string,
  group,
  oldPublicPath: sourceFile.replace(/^public/, ''),
  sourceFile,
  sourceChecksum: null,
  checksum: null,
  width: 64,
  height: 64,
  bytes: null,
  variants: [],
  version: 1,
  supersedes: null,
  status: 'planned',
  uploadedAt: null,
  alt: null
})

const existingScanAssets = [
  scanAsset('projects/kept/1.webp', 'public/images/projects/kept/1.png', 'kept'),
  scanAsset('projects/missing/2.webp', 'public/images/projects/missing/2.png', 'missing'),
  scanAsset('company/workshop/1.webp', 'public/images/hinh-xuong-lai-huy/1.png', 'workshop')
]

const createScanSandbox = (includeMissingSource: boolean) => {
  const root = mkdtempSync(join(repoRoot, 'tests/.tmp-media-scan-'))
  const copiedFiles = [
    'scripts/media/scan.ts',
    'scripts/media/lib.ts',
    'scripts/media/selection.ts',
    'app/shared/media/constants.ts',
    'app/shared/media/types.ts',
    'app/shared/media/validation.ts'
  ]
  for (const relativePath of copiedFiles) {
    const target = join(root, relativePath)
    mkdirSync(dirname(target), { recursive: true })
    copyFileSync(join(repoRoot, relativePath), target)
  }

  const projectSource = join(root, 'public/images/projects/kept/1.png')
  const workshopSource = join(root, 'public/images/hinh-xuong-lai-huy/1.png')
  mkdirSync(dirname(projectSource), { recursive: true })
  mkdirSync(dirname(workshopSource), { recursive: true })
  copyFileSync(fixtureImage, projectSource)
  copyFileSync(fixtureImage, workshopSource)

  if (includeMissingSource) {
    const missingSource = join(root, 'public/images/projects/missing/2.png')
    mkdirSync(dirname(missingSource), { recursive: true })
    copyFileSync(fixtureImage, missingSource)
  }

  const manifest: MediaManifest = {
    schemaVersion: 1,
    bucket: 'media',
    generatedAt: '2026-08-14T00:00:00.000Z',
    assets: existingScanAssets
  }
  const manifestPath = join(root, 'app/shared/media/manifest.json')
  writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8')
  return { root, manifestPath }
}

const runScan = (root: string, ...arguments_: string[]) => spawnSync(
  process.execPath,
  [tsxCli, 'scripts/media/scan.ts', ...arguments_],
  { cwd: root, encoding: 'utf8' }
)

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
  it('refuses an unmerged write when an existing source identity was not discovered', () => {
    expect(() => assertFullRegenerationCanWrite({
      write: true,
      merge: false,
      existing: [existing, newAsset],
      discovered: [existing]
    })).toThrow(/incomplete source library/i)
  })

  it('allows a merge write with a partial discovery set', () => {
    expect(() => assertFullRegenerationCanWrite({
      write: true,
      merge: true,
      existing: [existing, newAsset],
      discovered: [existing]
    })).not.toThrow()
  })

  it('allows full regeneration when every existing source identity was discovered', () => {
    expect(() => assertFullRegenerationCanWrite({
      write: true,
      merge: false,
      existing: [existing, newAsset],
      discovered: [existing, newAsset]
    })).not.toThrow()
  })

  it('allows a first-time full write when no manifest exists', () => {
    expect(() => assertFullRegenerationCanWrite({
      write: true,
      merge: false,
      existing: null,
      discovered: [newAsset]
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

describe('media scan write safety', () => {
  it('rejects a sparse full-regeneration tree without changing manifest bytes', () => {
    const sandbox = createScanSandbox(false)
    try {
      const before = readFileSync(sandbox.manifestPath)
      const result = runScan(sandbox.root, '--write')
      const output = `${result.stdout}\n${result.stderr}`

      expect(result.status, output).not.toBe(0)
      expect(output).toMatch(/incomplete source library/i)
      expect(readFileSync(sandbox.manifestPath)).toEqual(before)
    } finally {
      rmSync(sandbox.root, { recursive: true, force: true })
    }
  })

  it('allows full regeneration when every existing source identity is discovered', () => {
    const sandbox = createScanSandbox(true)
    try {
      const result = runScan(sandbox.root, '--write')
      const output = `${result.stdout}\n${result.stderr}`
      const written = JSON.parse(readFileSync(sandbox.manifestPath, 'utf8')) as MediaManifest

      expect(result.status, output).toBe(0)
      expect(written.assets.map(item => item.sourceFile).sort()).toEqual(
        existingScanAssets.map(item => item.sourceFile).sort()
      )
    } finally {
      rmSync(sandbox.root, { recursive: true, force: true })
    }
  })

  it('allows a sparse merge while retaining undiscovered manifest assets', () => {
    const sandbox = createScanSandbox(false)
    try {
      const result = runScan(sandbox.root, '--write', '--merge')
      const output = `${result.stdout}\n${result.stderr}`
      const written = JSON.parse(readFileSync(sandbox.manifestPath, 'utf8')) as MediaManifest

      expect(result.status, output).toBe(0)
      expect(written.assets.map(item => item.sourceFile).sort()).toEqual(
        existingScanAssets.map(item => item.sourceFile).sort()
      )
    } finally {
      rmSync(sandbox.root, { recursive: true, force: true })
    }
  })
})
