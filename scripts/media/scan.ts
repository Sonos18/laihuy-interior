// Filesystem scanner — the canonical source of truth for the media library.
// Walks public/images and regenerates the manifest from scratch: every project,
// nested gallery, and directly-placed image is discovered automatically. No fixed
// depth is assumed; the media domain is derived from the filesystem layout, not
// from folder-name heuristics.
//
// Domains (business entities, not UI locations):
//   public/images/projects/<project>/[<gallery>/...]<file>  → projects/<project>/[<gallery>/]<file>
//   public/images/hinh-xuong-lai-huy/<file>                 → company/workshop/<file>   (company's own workshop)
//   public/images/<loose company/brand file>                → company/<file> | brand/<file>
//
// Usage: pnpm media:scan [--write]   (omit --write for a dry inspection)
import { existsSync, readdirSync, statSync } from 'node:fs'
import { extname, join } from 'node:path'
import process from 'node:process'
import sharp from 'sharp'
import { isValidMediaPath } from '../../app/shared/media/validation'
import type { MediaManifest, MediaManifestAsset } from '../../app/shared/media/types'
import { MANIFEST_PATH, readManifest, REPO_ROOT, writeManifest } from './lib'
import { mergeDiscoveredAssets } from './selection'

const PUBLIC_IMAGES = join(REPO_ROOT, 'public/images')
const PROJECTS_DIR = join(PUBLIC_IMAGES, 'projects')
const WORKSHOP_DIR = join(PUBLIC_IMAGES, 'hinh-xuong-lai-huy')
const HOME_STORY_DIR = join(PUBLIC_IMAGES, 'homepage-material-story')
const IMAGE_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.svg'])

// Loose files directly under public/images that are business assets (not projects).
// Logos are intentionally excluded — they stay in /public (Category A).
const LOOSE_ASSETS: Record<string, { path: string, domain: string }> = {
  'banner_home.jpg': { path: 'brand/banner-home.webp', domain: 'brand' },
  'about_workspace.jpg': { path: 'company/about-workspace.webp', domain: 'company' },
  'company-story.jpg': { path: 'company/company-story.webp', domain: 'company' },
  'map_address.png': { path: 'company/map-address.webp', domain: 'company' }
}

const write = process.argv.includes('--write')
const merge = process.argv.includes('--merge')

const slugifySegment = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/gi, 'd')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const normalizeFilename = (filename: string): string => {
  const ext = extname(filename).toLowerCase()
  const base = filename.slice(0, filename.length - ext.length)
  const outExt = ext === '.svg' ? '.svg' : '.webp'
  return `${slugifySegment(base)}${outExt}`
}

const dimensions = async (file: string): Promise<{ width: number, height: number, kind: 'raster' | 'vector' }> => {
  if (file.toLowerCase().endsWith('.svg')) {
    return { width: 0, height: 0, kind: 'vector' }
  }
  const meta = await sharp(file).metadata()
  let width = meta.width ?? 0
  let height = meta.height ?? 0
  if (meta.orientation && meta.orientation >= 5) {
    [width, height] = [height, width]
  }
  return { width, height, kind: 'raster' }
}

const listImages = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true })
    .filter(entry => entry.isFile() && IMAGE_EXTENSIONS.has(extname(entry.name).toLowerCase()))
    .map(entry => entry.name)

const asset = (input: {
  storagePath: string
  domain: string
  group: string | null
  sourceRel: string
  oldPublicPath: string
  width: number
  height: number
  kind: 'raster' | 'vector'
}): MediaManifestAsset => ({
  path: input.storagePath,
  kind: input.kind,
  category: input.domain,
  group: input.group,
  oldPublicPath: input.oldPublicPath,
  sourceFile: input.sourceRel,
  sourceChecksum: null,
  checksum: null,
  width: input.width || null,
  height: input.height || null,
  bytes: null,
  variants: [],
  version: 1,
  supersedes: null,
  status: 'planned',
  uploadedAt: null,
  alt: null
})

const scanProjectTree = async (
  projectSlug: string,
  absDir: string,
  storageSegments: string[],
  rawSegments: string[]
): Promise<MediaManifestAsset[]> => {
  const assets: MediaManifestAsset[] = []
  const entries = readdirSync(absDir, { withFileTypes: true })

  for (const entry of entries.filter(e => e.isFile() && IMAGE_EXTENSIONS.has(extname(e.name).toLowerCase()))) {
    const normFile = normalizeFilename(entry.name)
    const storagePath = ['projects', ...storageSegments, normFile].join('/')
    const rawRel = ['public/images/projects', ...rawSegments, entry.name].join('/')
    const oldPublic = ['/images/projects', ...rawSegments, entry.name].join('/')
    const dims = await dimensions(join(absDir, entry.name))
    assets.push(asset({
      storagePath,
      domain: 'projects',
      group: storageSegments.join('/'),
      sourceRel: rawRel,
      oldPublicPath: oldPublic,
      width: dims.width,
      height: dims.height,
      kind: dims.kind
    }))
  }

  for (const entry of entries.filter(e => e.isDirectory())) {
    const gallerySlug = slugifySegment(entry.name)
    assets.push(...await scanProjectTree(
      projectSlug,
      join(absDir, entry.name),
      [...storageSegments, gallerySlug],
      [...rawSegments, entry.name]
    ))
  }

  return assets
}

const run = async () => {
  const assets: MediaManifestAsset[] = []

  // 1. Client projects (arbitrary gallery nesting)
  if (existsSync(PROJECTS_DIR)) {
    for (const project of readdirSync(PROJECTS_DIR, { withFileTypes: true }).filter(e => e.isDirectory())) {
      const slug = slugifySegment(project.name)
      assets.push(...await scanProjectTree(slug, join(PROJECTS_DIR, project.name), [slug], [project.name]))
    }
  }

  // 2. Company workshop gallery (business rule: not a project)
  if (existsSync(WORKSHOP_DIR)) {
    for (const file of listImages(WORKSHOP_DIR)) {
      const normFile = normalizeFilename(file)
      const dims = await dimensions(join(WORKSHOP_DIR, file))
      assets.push(asset({
        storagePath: `company/workshop/${normFile}`,
        domain: 'company',
        group: 'workshop',
        sourceRel: `public/images/hinh-xuong-lai-huy/${file}`,
        oldPublicPath: `/images/hinh-xuong-lai-huy/${file}`,
        width: dims.width,
        height: dims.height,
        kind: dims.kind
      }))
    }
  }

  // 3. Loose company / brand assets
  for (const [file, target] of Object.entries(LOOSE_ASSETS)) {
    const absFile = join(PUBLIC_IMAGES, file)
    try {
      statSync(absFile)
    } catch {
      console.warn(`[scan] loose asset not found, skipping: ${file}`)
      continue
    }
    const dims = await dimensions(absFile)
    assets.push(asset({
      storagePath: target.path,
      domain: target.domain,
      group: null,
      sourceRel: `public/images/${file}`,
      oldPublicPath: `/images/${file}`,
      width: dims.width,
      height: dims.height,
      kind: dims.kind
    }))
  }

  // 4. Homepage material story (optional, so the existing library can stay immutable)
  if (existsSync(HOME_STORY_DIR)) {
    for (const file of listImages(HOME_STORY_DIR)) {
      const dims = await dimensions(join(HOME_STORY_DIR, file))
      assets.push(asset({
        storagePath: `company/homepage-material-story/${normalizeFilename(file)}`,
        domain: 'company',
        group: 'homepage-material-story',
        sourceRel: `public/images/homepage-material-story/${file}`,
        oldPublicPath: `/images/homepage-material-story/${file}`,
        width: dims.width,
        height: dims.height,
        kind: dims.kind
      }))
    }
  }

  // Integrity: unique paths + valid grammar
  const seen = new Set<string>()
  const errors: string[] = []
  for (const item of assets) {
    if (seen.has(item.path)) {
      errors.push(`duplicate storage path: ${item.path}`)
    }
    seen.add(item.path)
    if (!isValidMediaPath(item.path)) {
      errors.push(`invalid storage path grammar: ${item.path} (from ${item.sourceFile})`)
    }
  }
  if (errors.length > 0) {
    console.error('[scan] FAILED:')
    errors.forEach(e => console.error(`  ✗ ${e}`))
    process.exit(1)
  }

  assets.sort((a, b) => a.path.localeCompare(b.path))
  const manifestAssets = merge ? mergeDiscoveredAssets(readManifest().assets, assets) : assets

  const manifest: MediaManifest = {
    schemaVersion: 1,
    bucket: 'media',
    generatedAt: new Date().toISOString(),
    assets: manifestAssets
  }

  // Summary
  const byDomain = new Map<string, number>()
  const projectGroups = new Map<string, number>()
  for (const item of assets) {
    byDomain.set(item.category, (byDomain.get(item.category) ?? 0) + 1)
    if (item.category === 'projects') {
      const project = item.group?.split('/')[0] ?? '(root)'
      projectGroups.set(project, (projectGroups.get(project) ?? 0) + 1)
    }
  }
  console.log(`[scan] ${assets.length} assets discovered`)
  for (const [domain, count] of [...byDomain].sort()) {
    console.log(`  ${domain}: ${count}`)
  }
  console.log('  projects breakdown:')
  for (const [project, count] of [...projectGroups].sort()) {
    console.log(`    ${project}: ${count}`)
  }

  if (write) {
    writeManifest(manifest)
    console.log(`[scan] manifest written → ${MANIFEST_PATH}`)
  } else {
    console.log('[scan] dry run — pass --write to regenerate the manifest')
  }
}

run()
