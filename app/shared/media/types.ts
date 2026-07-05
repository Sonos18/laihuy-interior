import type { LocalizedText } from '../types/localization'

/**
 * Storage path relative to the media bucket, e.g. `projects/hotel/eo-gio/reception.webp`.
 * Plain string by design; validate with `isValidMediaPath` / `assertMediaPath`.
 */
export type MediaPath = string

/** `alt: ''` explicitly marks a decorative image; otherwise a localized alt is required. */
export type MediaImage = {
  path: MediaPath
  alt: LocalizedText | ''
  width: number
  height: number
}

export type MediaManifestVariant = {
  path: MediaPath
  width: number
  bytes: number | null
}

export type MediaManifestAssetStatus = 'planned' | 'active' | 'superseded' | 'skipped'

export type MediaManifestAsset = {
  path: MediaPath
  kind: 'raster' | 'vector'
  category: string
  group: string | null
  oldPublicPath: string | null
  sourceFile: string | null
  sourceChecksum: string | null
  checksum: string | null
  width: number | null
  height: number | null
  bytes: number | null
  variants: MediaManifestVariant[]
  version: number
  supersedes: MediaPath | null
  status: MediaManifestAssetStatus
  uploadedAt: string | null
  alt: string | null
}

export type MediaManifest = {
  schemaVersion: number
  bucket: string
  generatedAt: string
  assets: MediaManifestAsset[]
}
