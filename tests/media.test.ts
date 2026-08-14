import { describe, expect, it } from 'vitest'
import {
  buildMediaUrl,
  snapToVariantWidth,
  storageObjectUrl,
  variantPath,
  type MediaUrlContext
} from '../app/media/url'
import { fallbackPaths } from '../app/media/fallback'
import { assertManifestSchemaVersion, isValidMediaPath, isVectorPath, parseMediaFilename } from '../app/shared/media/validation'
import { MANIFEST_SCHEMA_VERSION } from '../app/shared/media/constants'
import manifest from '../app/shared/media/manifest.json'
import { brandMedia, companyMedia, projectMedia, workshopMedia } from '../app/media/catalog.generated'

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
    expect(variantPath('brand/banner-home.webp', 800)).toBe('brand/banner-home-w800.webp')
    expect(variantPath('projects/khach-san-eo-gio/can-ho-1-phong-ngu/1-2.webp', 400))
      .toBe('projects/khach-san-eo-gio/can-ho-1-phong-ngu/1-2-w400.webp')
  })
})

describe('buildMediaUrl with USE_SUPABASE_MEDIA=true', () => {
  it('builds the public storage URL for the master', () => {
    expect(buildMediaUrl('brand/banner-home.webp', {}, supabaseContext)).toBe(
      'https://example.supabase.co/storage/v1/object/public/media/brand/banner-home.webp'
    )
  })

  it('resolves width requests to snapped variants', () => {
    expect(buildMediaUrl('brand/banner-home.webp', { width: 640 }, supabaseContext)).toBe(
      'https://example.supabase.co/storage/v1/object/public/media/brand/banner-home-w800.webp'
    )
  })

  it('serves the master when wider than the largest variant', () => {
    expect(buildMediaUrl('brand/banner-home.webp', { width: 2400 }, supabaseContext)).toBe(
      'https://example.supabase.co/storage/v1/object/public/media/brand/banner-home.webp'
    )
  })

  it('never produces width variants for vectors', () => {
    expect(buildMediaUrl('brand/logo-partner.svg', { width: 640 }, supabaseContext)).toBe(
      'https://example.supabase.co/storage/v1/object/public/media/brand/logo-partner.svg'
    )
  })

  it('tolerates a trailing slash on the Supabase URL', () => {
    expect(storageObjectUrl('https://example.supabase.co/', 'brand/banner-home.webp')).toBe(
      'https://example.supabase.co/storage/v1/object/public/media/brand/banner-home.webp'
    )
  })
})

describe('buildMediaUrl with USE_SUPABASE_MEDIA=false (fallback)', () => {
  it('resolves migrated assets to their original /public path', () => {
    expect(buildMediaUrl('brand/banner-home.webp', {}, fallbackContext)).toBe('/images/banner_home.jpg')
    expect(buildMediaUrl('projects/khach-san-eo-gio/can-ho-1-phong-ngu/1-2.webp', { width: 640 }, fallbackContext))
      .toBe('/images/projects/khach-san-eo-gio/can-ho-1-phong-ngu/1.2.png')
  })

  it('normalizes the leading slash @nuxt/image adds to provider src', () => {
    expect(buildMediaUrl('/brand/banner-home.webp', {}, fallbackContext)).toBe('/images/banner_home.jpg')
    expect(buildMediaUrl('/brand/banner-home.webp', { width: 640 }, supabaseContext)).toBe(
      'https://example.supabase.co/storage/v1/object/public/media/brand/banner-home-w800.webp'
    )
  })

  it('serves assets with no /public fallback from Supabase', () => {
    expect(buildMediaUrl('projects/new-project/hero.webp', {}, fallbackContext)).toBe(
      'https://example.supabase.co/storage/v1/object/public/media/projects/new-project/hero.webp'
    )
  })
})

describe('media path validation', () => {
  it('accepts conventional and deeply nested business-domain paths', () => {
    expect(isValidMediaPath('brand/banner-home.webp')).toBe(true)
    expect(isValidMediaPath('company/workshop/1.webp')).toBe(true)
    expect(isValidMediaPath('projects/khach-san-eo-gio/can-ho-1-phong-ngu/1-2.webp')).toBe(true)
    expect(isValidMediaPath('projects/a/b/c/d/bed-v2-w800.webp')).toBe(true)
    expect(isValidMediaPath('brand/logo-partner-v3.svg')).toBe(true)
  })

  it('accepts explicit v1 filenames while rejecting invalid version forms', () => {
    expect(isValidMediaPath('company/homepage-material-story/home-material-01-drawing-v1.webp')).toBe(true)
    expect(parseMediaFilename('photo-v1.webp')).toMatchObject({ version: 1 })
    expect(isValidMediaPath('company/homepage-material-story/home-material-01-drawing-v0.webp')).toBe(false)
    expect(isValidMediaPath('company/homepage-material-story/home-material-01-drawing-v-1.webp')).toBe(false)
    expect(isValidMediaPath('company/homepage-material-story/home-material-01-drawing-v01.webp')).toBe(false)
  })

  it('rejects malformed paths and retired top-level folders', () => {
    expect(isValidMediaPath('hero/banner-home.webp')).toBe(false)
    expect(isValidMediaPath('unknown-root/photo.webp')).toBe(false)
    expect(isValidMediaPath('/projects/x.webp')).toBe(false)
    expect(isValidMediaPath('projects/../secrets.webp')).toBe(false)
    expect(isValidMediaPath('banner-home.webp')).toBe(false)
    expect(isValidMediaPath('company/Banner_Home.webp')).toBe(false)
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
    expect(isVectorPath('brand/logo.svg')).toBe(true)
    expect(isVectorPath('brand/logo.webp')).toBe(false)
  })
})

describe('manifest integrity (regenerated from the filesystem)', () => {
  it('every manifest path passes validation', () => {
    for (const asset of manifest.assets) {
      expect(isValidMediaPath(asset.path), asset.path).toBe(true)
    }
  })

  it('manifest paths are unique', () => {
    const paths = manifest.assets.map(asset => asset.path)
    expect(new Set(paths).size).toBe(paths.length)
  })

  it('every asset sits under an allowed business domain', () => {
    const domains = new Set(['projects', 'company', 'brand'])
    for (const asset of manifest.assets) {
      expect(domains.has(asset.path.split('/')[0] as string), asset.path).toBe(true)
      expect(asset.category, asset.path).toBe(asset.path.split('/')[0])
    }
  })

  it('the workshop gallery is a company collection, never a project', () => {
    const workshop = manifest.assets.filter(asset => asset.group === 'workshop')
    expect(workshop.length).toBeGreaterThan(0)
    for (const asset of workshop) {
      expect(asset.path.startsWith('company/workshop/'), asset.path).toBe(true)
      expect(asset.path.startsWith('projects/'), asset.path).toBe(false)
    }
  })

  it('fallback map covers every asset that replaces a /public file', () => {
    const withOldPath = manifest.assets.filter(asset => asset.oldPublicPath)
    expect(fallbackPaths.size).toBe(withOldPath.length)
  })
})

describe('manifest schema version', () => {
  it('the committed manifest is the supported version', () => {
    expect(manifest.schemaVersion).toBe(MANIFEST_SCHEMA_VERSION)
    expect(() => assertManifestSchemaVersion(manifest)).not.toThrow()
  })

  it('rejects an unsupported or missing schema version with a clear error', () => {
    expect(() => assertManifestSchemaVersion({ schemaVersion: 999 })).toThrow(/Unsupported manifest schemaVersion: 999/)
    expect(() => assertManifestSchemaVersion({})).toThrow(/\(missing\)/)
  })
})

describe('media catalog (generated) ↔ manifest separation', () => {
  const manifestPaths = new Set(manifest.assets.map(asset => asset.path))

  const everyCatalogAsset = [
    ...Object.values(projectMedia).flatMap(project => project.images),
    ...workshopMedia,
    ...Object.values(companyMedia),
    ...Object.values(brandMedia)
  ]

  it('every catalog asset resolves to a real manifest entry', () => {
    for (const asset of everyCatalogAsset) {
      expect(manifestPaths.has(asset.path), asset.path).toBe(true)
    }
  })

  it('catalog assets carry media only — never business copy (alt)', () => {
    for (const asset of everyCatalogAsset) {
      expect(Object.keys(asset).sort()).toEqual(['height', 'path', 'width'])
    }
  })

  it('a project cover is the first of its images', () => {
    for (const project of Object.values(projectMedia)) {
      expect(project.cover).toEqual(project.images[0])
    }
  })

  it('workshop assets live only under the company domain', () => {
    for (const asset of workshopMedia) {
      expect(asset.path.startsWith('company/workshop/'), asset.path).toBe(true)
    }
  })
})
