export const MEDIA_BUCKET = 'media'

/**
 * Manifest schema version. Bump this ONLY when the shape of `manifest.json`
 * (or its assets) changes in a way that older consumers cannot read. Every tool
 * and the app assert the loaded manifest matches this version, so an unmigrated
 * or future-format manifest fails loudly instead of being silently misread.
 * Bumping it makes a manifest migration an explicit, deliberate step.
 *   1 — filesystem-authoritative manifest (business-domain paths, per-asset
 *       variants, checksums, version lineage).
 */
export const MANIFEST_SCHEMA_VERSION = 1

// Business domains (entities), not UI locations. The storage hierarchy mirrors the
// filesystem organization under public/images.
export const MEDIA_TOP_LEVEL_FOLDERS = ['projects', 'company', 'brand'] as const

export const MEDIA_VARIANT_WIDTHS = [400, 800, 1600] as const

export type MediaTopLevelFolder = (typeof MEDIA_TOP_LEVEL_FOLDERS)[number]

export type MediaVariantWidth = (typeof MEDIA_VARIANT_WIDTHS)[number]
