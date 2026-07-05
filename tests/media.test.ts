import { describe, expect, it } from 'vitest'
import {
  buildMediaUrl,
  snapToVariantWidth,
  storageObjectUrl,
  variantPath,
  type MediaUrlContext
} from '../app/media/url'
import { fallbackPaths } from '../app/media/fallback'
import { isValidMediaPath, isVectorPath, parseMediaFilename } from '../app/shared/media/validation'
import manifest from '../app/shared/media/manifest.json'

const supabaseContext: MediaUrlContext = {
  supabaseUrl: 'https://example.supabase.co',
  useSupabaseMedia: true,
  fallbackPaths
}

const fallbackContext: MediaUrlContext = {
  supabaseUrl: 'https://example.supabase.co',
  useSupabaseMedia: false,
  fallbackPaths
}

describe('snapToVariantWidth', () => {
  it('snaps up to the nearest variant', () => {
    expect(snapToVariantWidth(1)).toBe(400)
    expect(snapToVariantWidth(400)).toBe(400)
    expect(snapToVariantWidth(401)).toBe(800)
    expect(snapToVariantWidth(1600)).toBe(1600)
  })

  it('returns null above the largest variant (use master)', () => {
    expect(snapToVariantWidth(1601)).toBeNull()
    expect(snapToVariantWidth(4000)).toBeNull()
  })
})

describe('variantPath', () => {
  it('rewrites only the basename, regardless of nesting depth', () => {
    expect(variantPath('hero/banner-home.webp', 800)).toBe('hero/banner-home-w800.webp')
    expect(variantPath('projects/hotel/eo-gio/rooms/deluxe/bed.webp', 400))
      .toBe('projects/hotel/eo-gio/rooms/deluxe/bed-w400.webp')
  })
})

describe('buildMediaUrl with USE_SUPABASE_MEDIA=true', () => {
  it('builds the public storage URL for the master', () => {
    expect(buildMediaUrl('hero/banner-home.webp', {}, supabaseContext)).toBe(
      'https://example.supabase.co/storage/v1/object/public/media/hero/banner-home.webp'
    )
  })

  it('resolves width requests to snapped variants', () => {
    expect(buildMediaUrl('hero/banner-home.webp', { width: 640 }, supabaseContext)).toBe(
      'https://example.supabase.co/storage/v1/object/public/media/hero/banner-home-w800.webp'
    )
  })

  it('serves the master when wider than the largest variant', () => {
    expect(buildMediaUrl('hero/banner-home.webp', { width: 2400 }, supabaseContext)).toBe(
      'https://example.supabase.co/storage/v1/object/public/media/hero/banner-home.webp'
    )
  })

  it('never produces width variants for vectors', () => {
    expect(buildMediaUrl('company/logo-partner.svg', { width: 640 }, supabaseContext)).toBe(
      'https://example.supabase.co/storage/v1/object/public/media/company/logo-partner.svg'
    )
  })

  it('tolerates a trailing slash on the Supabase URL', () => {
    expect(storageObjectUrl('https://example.supabase.co/', 'hero/banner-home.webp')).toBe(
      'https://example.supabase.co/storage/v1/object/public/media/hero/banner-home.webp'
    )
  })
})

describe('buildMediaUrl with USE_SUPABASE_MEDIA=false (fallback)', () => {
  it('resolves migrated assets to their original /public path', () => {
    expect(buildMediaUrl('hero/banner-home.webp', {}, fallbackContext)).toBe('/images/banner_home.jpg')
    expect(buildMediaUrl('projects/hotel/eo-gio/reception.webp', { width: 640 }, fallbackContext))
      .toBe('/images/projects/hotel/eo_gio/reception.png')
  })

  it('normalizes the leading slash @nuxt/image adds to provider src', () => {
    expect(buildMediaUrl('/hero/banner-home.webp', {}, fallbackContext)).toBe('/images/banner_home.jpg')
    expect(buildMediaUrl('/hero/banner-home.webp', { width: 640 }, supabaseContext)).toBe(
      'https://example.supabase.co/storage/v1/object/public/media/hero/banner-home-w800.webp'
    )
  })

  it('serves post-migration assets from Supabase (nothing local to fall back to)', () => {
    expect(buildMediaUrl('blog/some-post/cover.webp', {}, fallbackContext)).toBe(
      'https://example.supabase.co/storage/v1/object/public/media/blog/some-post/cover.webp'
    )
  })
})

describe('media path validation', () => {
  it('accepts conventional and deeply nested paths (semantic hierarchy)', () => {
    expect(isValidMediaPath('hero/banner-home.webp')).toBe(true)
    expect(isValidMediaPath('projects/hotel/eo-gio/reception.webp')).toBe(true)
    expect(isValidMediaPath('projects/hotel/eo-gio/rooms/deluxe/bed-v2-w800.webp')).toBe(true)
    expect(isValidMediaPath('company/logo-partner-v3.svg')).toBe(true)
  })

  it('rejects malformed paths', () => {
    expect(isValidMediaPath('unknown-root/photo.webp')).toBe(false)
    expect(isValidMediaPath('/hero/banner-home.webp')).toBe(false)
    expect(isValidMediaPath('hero/../secrets.webp')).toBe(false)
    expect(isValidMediaPath('banner-home.webp')).toBe(false)
    expect(isValidMediaPath('hero/Banner_Home.webp')).toBe(false)
  })

  it('rejects reserved-suffix collisions and svg variants', () => {
    expect(parseMediaFilename('photo-w800-v2.webp')).toBeNull()
    expect(parseMediaFilename('logo-w400.svg')).toBeNull()
    expect(parseMediaFilename('photo-v2-w800.webp')).toMatchObject({
      name: 'photo',
      version: 2,
      variantWidth: 800
    })
  })

  it('detects vectors by extension', () => {
    expect(isVectorPath('company/logo.svg')).toBe(true)
    expect(isVectorPath('company/logo.webp')).toBe(false)
  })
})

describe('manifest integrity', () => {
  it('every manifest path passes validation', () => {
    for (const asset of manifest.assets) {
      expect(isValidMediaPath(asset.path), asset.path).toBe(true)
    }
  })

  it('manifest paths are unique', () => {
    const paths = manifest.assets.map(asset => asset.path)
    expect(new Set(paths).size).toBe(paths.length)
  })

  it('fallback map covers every asset that replaces a /public file', () => {
    const withOldPath = manifest.assets.filter(asset => asset.oldPublicPath)
    expect(fallbackPaths.size).toBe(withOldPath.length)
  })
})
