// Optimization pass: source images → WebP masters + responsive variants in .media-build/.
// Idempotent: unchanged sources (by checksum) with intact outputs are skipped.
// Usage: pnpm media:optimize [--dry-run] [--force]
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import process from 'node:process'
import sharp from 'sharp'
import { MEDIA_VARIANT_WIDTHS } from '../../app/shared/media/constants'
import { isValidMediaPath } from '../../app/shared/media/validation'
import type { MediaManifestAsset, MediaManifestVariant } from '../../app/shared/media/types'
import { variantPath } from '../../app/media/url'
import { BUILD_DIR, fileExists, readManifest, REPO_ROOT, sha256, writeManifest } from './lib'
import { parsePathPrefix, selectAssetsByPrefix } from './selection'

const MASTER_MAX_EDGE = 2560
const WEBP_QUALITY = 80

const dryRun = process.argv.includes('--dry-run')
const force = process.argv.includes('--force')
const pathPrefix = parsePathPrefix(process.argv)

type Outcome = 'built' | 'skipped' | 'error'

const outputsIntact = (asset: MediaManifestAsset): boolean => {
  const master = join(BUILD_DIR, asset.path)
  if (!asset.checksum || !fileExists(master) || sha256(readFileSync(master)) !== asset.checksum) {
    return false
  }
  return asset.variants.every(variant => fileExists(join(BUILD_DIR, variant.path)))
}

const buildRaster = async (asset: MediaManifestAsset, source: Buffer) => {
  const masterBuffer = await sharp(source)
    .rotate()
    .resize({ width: MASTER_MAX_EDGE, height: MASTER_MAX_EDGE, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: WEBP_QUALITY, effort: 6 })
    .toBuffer()

  const metadata = await sharp(masterBuffer).metadata()
  const masterFile = join(BUILD_DIR, asset.path)
  mkdirSync(dirname(masterFile), { recursive: true })
  writeFileSync(masterFile, masterBuffer)

  const variants: MediaManifestVariant[] = []
  for (const width of MEDIA_VARIANT_WIDTHS) {
    const buffer = await sharp(masterBuffer)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY, effort: 6 })
      .toBuffer()
    const path = variantPath(asset.path, width)
    writeFileSync(join(BUILD_DIR, path), buffer)
    variants.push({ path, width, bytes: buffer.byteLength })
  }

  asset.width = metadata.width ?? asset.width
  asset.height = metadata.height ?? asset.height
  asset.bytes = masterBuffer.byteLength
  asset.checksum = sha256(masterBuffer)
  asset.variants = variants
}

const buildVector = (asset: MediaManifestAsset, source: Buffer, sourcePath: string) => {
  const target = join(BUILD_DIR, asset.path)
  mkdirSync(dirname(target), { recursive: true })
  copyFileSync(sourcePath, target)
  asset.bytes = source.byteLength
  asset.checksum = sha256(source)
  asset.variants = []
}

const run = async () => {
  const manifest = readManifest()
  const assets = selectAssetsByPrefix(manifest.assets, pathPrefix)
  const results: { path: string, outcome: Outcome, detail: string }[] = []
  let sourceBytes = 0
  let builtBytes = 0

  for (const asset of assets) {
    if (asset.status === 'skipped') {
      continue
    }
    if (!isValidMediaPath(asset.path)) {
      results.push({ path: asset.path, outcome: 'error', detail: 'invalid media path (grammar)' })
      continue
    }
    if (!asset.sourceFile) {
      results.push({ path: asset.path, outcome: 'error', detail: 'no sourceFile recorded' })
      continue
    }

    const sourcePath = join(REPO_ROOT, asset.sourceFile)
    if (!fileExists(sourcePath)) {
      results.push({ path: asset.path, outcome: 'error', detail: `source missing: ${asset.sourceFile}` })
      continue
    }

    const source = readFileSync(sourcePath)
    const sourceChecksum = sha256(source)
    sourceBytes += source.byteLength

    if (!force && asset.sourceChecksum === sourceChecksum && outputsIntact(asset)) {
      results.push({ path: asset.path, outcome: 'skipped', detail: 'source unchanged, outputs intact' })
      builtBytes += asset.bytes ?? 0
      continue
    }

    if (dryRun) {
      results.push({ path: asset.path, outcome: 'built', detail: 'would build (dry run)' })
      continue
    }

    if (asset.kind === 'vector') {
      buildVector(asset, source, sourcePath)
    } else {
      await buildRaster(asset, source)
    }
    asset.sourceChecksum = sourceChecksum
    builtBytes += asset.bytes ?? 0
    results.push({
      path: asset.path,
      outcome: 'built',
      detail: `${asset.width}x${asset.height}, ${((asset.bytes ?? 0) / 1024).toFixed(0)} KB + ${asset.variants.length} variants`
    })
  }

  if (!dryRun) {
    writeManifest(manifest)
  }

  for (const result of results) {
    console.log(`${result.outcome.toUpperCase().padEnd(8)} ${result.path} — ${result.detail}`)
  }
  const errors = results.filter(result => result.outcome === 'error')
  console.log(`\n[media:optimize] ${results.length} assets: ${results.filter(r => r.outcome === 'built').length} built, ${results.filter(r => r.outcome === 'skipped').length} skipped, ${errors.length} errors${dryRun ? ' (dry run — nothing written)' : ''}`)
  if (!dryRun && builtBytes > 0) {
    console.log(`[media:optimize] masters: ${(sourceBytes / 1048576).toFixed(1)} MB source → ${(builtBytes / 1048576).toFixed(1)} MB WebP`)
  }
  if (errors.length > 0) {
    process.exit(1)
  }
}

run()
