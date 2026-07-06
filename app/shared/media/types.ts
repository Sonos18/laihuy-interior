import type { LocalizedText } from '../types/localization'

/**
 * Storage path relative to the media bucket, e.g. `projects/khach-san-eo-gio/sanh-don/1.webp`.
 * Plain string by design; validate with `isValidMediaPath` / `assertMediaPath`.
 */
export type MediaPath = string

/**
 * A pure media reference owned by the generated catalog: storage path + intrinsic
 * dimensions, with NO business copy. This is the filesystem-authoritative half of the
 * split — alt text and any editorial meaning live in the business layer.
 */
export type MediaAsset = {
  path: MediaPath
  width: number
  height: number
}

/**
 * A media asset paired with business-supplied alt text, ready to render.
 * `alt: ''` explicitly marks a decorative image; otherwise a localized alt is required.
 * Built at the presentation boundary by combining a catalog `MediaAsset` with business copy.
 */
export type MediaImage = MediaAsset & {
  alt: LocalizedText | ''
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
