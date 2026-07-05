export const MEDIA_BUCKET = 'media'

export const MEDIA_TOP_LEVEL_FOLDERS = ['hero', 'company', 'projects', 'services', 'blog'] as const

export const MEDIA_VARIANT_WIDTHS = [400, 800, 1600] as const

export type MediaTopLevelFolder = (typeof MEDIA_TOP_LEVEL_FOLDERS)[number]

export type MediaVariantWidth = (typeof MEDIA_VARIANT_WIDTHS)[number]
