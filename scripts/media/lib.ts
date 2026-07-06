import { createHash } from 'node:crypto'
import { existsSync, readFileSync, renameSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import process from 'node:process'
import { MEDIA_BUCKET } from '../../app/shared/media/constants'
import { assertManifestSchemaVersion } from '../../app/shared/media/validation'
import type { MediaManifest, MediaManifestAsset } from '../../app/shared/media/types'

export const REPO_ROOT = resolve(import.meta.dirname, '../..')
export const MANIFEST_PATH = join(REPO_ROOT, 'app/shared/media/manifest.json')
export const BUILD_DIR = join(REPO_ROOT, '.media-build')

export const loadEnv = () => {
  try {
    process.loadEnvFile(join(REPO_ROOT, '.env'))
  } catch {
    // no .env file — rely on process env
  }
}

export const sha256 = (buffer: Buffer): string =>
  `sha256:${createHash('sha256').update(buffer).digest('hex')}`

export const readManifest = (): MediaManifest => {
  const manifest = JSON.parse(readFileSync(MANIFEST_PATH, 'utf8')) as MediaManifest
  assertManifestSchemaVersion(manifest)
  return manifest
}

export const writeManifest = (manifest: MediaManifest) => {
  manifest.generatedAt = new Date().toISOString()
  const tmpPath = `${MANIFEST_PATH}.tmp`
  writeFileSync(tmpPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8')
  renameSync(tmpPath, MANIFEST_PATH)
}

export const publicObjectUrl = (supabaseUrl: string, path: string): string =>
  `${supabaseUrl.replace(/\/+$/, '')}/storage/v1/object/public/${MEDIA_BUCKET}/${path}`

export const contentTypeFor = (path: string): string => {
  if (path.endsWith('.webp')) return 'image/webp'
  if (path.endsWith('.svg')) return 'image/svg+xml'
  if (path.endsWith('.jpg') || path.endsWith('.jpeg')) return 'image/jpeg'
  if (path.endsWith('.png')) return 'image/png'
  throw new Error(`[media] Unknown content type for: ${path}`)
}

/** Every storage object an asset owns: the master plus its variants. */
export const assetObjects = (asset: MediaManifestAsset): { path: string, localFile: string }[] => [
  { path: asset.path, localFile: join(BUILD_DIR, asset.path) },
  ...asset.variants.map(variant => ({ path: variant.path, localFile: join(BUILD_DIR, variant.path) }))
]

export const assertNotCI = (action: string) => {
  if (process.env.CI || process.env.VERCEL) {
    console.error(`[media] Refusing to ${action} in a CI/deploy environment — this is a local-only operation (see docs/media-migration/phase-1-storage-architecture.md §1.5).`)
    process.exit(1)
  }
}

export const remoteObjectExists = async (supabaseUrl: string, path: string): Promise<boolean> => {
  const response = await fetch(publicObjectUrl(supabaseUrl, path), { method: 'HEAD' })
  return response.ok
}

export const fileExists = (path: string): boolean => existsSync(path)
