// Zero-404 gate (Decision #10 + safeguard S4). Runs as part of `pnpm build`.
// 1. Scans app/ source for storage-path references and checks each against the manifest.
// 2. Flag OFF: verifies every referenced asset's /public fallback file exists on disk.
// 3. Flag ON: HEAD-requests every referenced object (master + variants) in Supabase Storage,
//    plus every storage URL found in the prerendered HTML — real objects, not just paths.
// Exits non-zero on any failure so a broken image reference can never reach production.
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import process from 'node:process'
import { isValidMediaPath } from '../../app/shared/media/validation'
import { assetObjects, fileExists, loadEnv, publicObjectUrl, readManifest, REPO_ROOT } from './lib'

const PATH_PATTERN = /['"`]((?:hero|company|projects|services|blog)\/[a-z0-9/-]+(?:-v\d+)?\.(?:webp|svg|jpg|png))['"`]/g

const walk = (dir: string, extensions: string[]): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) {
      return walk(path, extensions)
    }
    return extensions.some(ext => entry.name.endsWith(ext)) ? [path] : []
  })

const collectSourceReferences = (): Set<string> => {
  const references = new Set<string>()
  for (const file of walk(join(REPO_ROOT, 'app'), ['.ts', '.vue'])) {
    if (file.includes(join('app', 'shared', 'media'))) {
      continue
    }
    for (const match of readFileSync(file, 'utf8').matchAll(PATH_PATTERN)) {
      references.add(match[1] as string)
    }
  }
  return references
}

const collectPrerenderedStorageUrls = (): Set<string> => {
  const urls = new Set<string>()
  const outputDir = join(REPO_ROOT, '.output/public')
  if (!fileExists(outputDir)) {
    return urls
  }
  for (const file of walk(outputDir, ['.html'])) {
    for (const match of readFileSync(file, 'utf8').matchAll(/https?:\/\/[^"'\s,]+\/storage\/v1\/object\/public\/[^"'\s,]+/g)) {
      urls.add(match[0])
    }
  }
  return urls
}

const headOk = async (url: string): Promise<{ ok: boolean, detail: string }> => {
  try {
    const response = await fetch(url, { method: 'HEAD' })
    if (!response.ok) {
      return { ok: false, detail: `HTTP ${response.status}` }
    }
    const contentType = response.headers.get('content-type') ?? ''
    if (!contentType.startsWith('image/')) {
      return { ok: false, detail: `unexpected content-type: ${contentType}` }
    }
    return { ok: true, detail: contentType }
  } catch (error) {
    return { ok: false, detail: String(error) }
  }
}

const run = async () => {
  loadEnv()
  const supabaseUrl = process.env.NUXT_PUBLIC_SUPABASE_URL ?? ''
  const useSupabaseMedia = process.env.NUXT_PUBLIC_USE_SUPABASE_MEDIA === 'true'
  const forceRemote = process.argv.includes('--remote')

  const manifest = readManifest()
  const manifestByPath = new Map(manifest.assets.map(asset => [asset.path, asset]))
  const failures: string[] = []

  // 1. Every source-referenced path must be a valid, manifest-known asset
  const references = collectSourceReferences()
  for (const path of references) {
    if (!isValidMediaPath(path)) {
      failures.push(`invalid path grammar referenced in app/: ${path}`)
      continue
    }
    const asset = manifestByPath.get(path)
    if (!asset || asset.status === 'skipped' || asset.status === 'superseded') {
      failures.push(`referenced in app/ but not an active/planned manifest asset: ${path}`)
      continue
    }
    if (useSupabaseMedia && asset.status !== 'active') {
      failures.push(`referenced with USE_SUPABASE_MEDIA=true but not uploaded (status: ${asset.status}): ${path}`)
    }
    // 2. Fallback integrity: flag OFF serves the old /public file — it must exist
    if (!useSupabaseMedia && asset.oldPublicPath && !fileExists(join(REPO_ROOT, 'public', asset.oldPublicPath.replace(/^\//, '')))) {
      failures.push(`fallback file missing from /public for: ${path} (${asset.oldPublicPath})`)
    }
  }

  // 3. Remote object verification — every object the referenced assets own, plus prerendered URLs
  let remoteChecked = 0
  if ((useSupabaseMedia || forceRemote) && supabaseUrl) {
    const urlsToCheck = new Set<string>()
    for (const path of references) {
      const asset = manifestByPath.get(path)
      if (asset) {
        for (const object of assetObjects(asset)) {
          urlsToCheck.add(publicObjectUrl(supabaseUrl, object.path))
        }
      }
    }
    for (const url of collectPrerenderedStorageUrls()) {
      urlsToCheck.add(url)
    }
    for (const url of urlsToCheck) {
      const result = await headOk(url)
      remoteChecked += 1
      if (!result.ok) {
        failures.push(`remote object failed (${result.detail}): ${url}`)
      }
    }
  } else if (useSupabaseMedia && !supabaseUrl) {
    failures.push('USE_SUPABASE_MEDIA=true but NUXT_PUBLIC_SUPABASE_URL is not set')
  }

  if (failures.length > 0) {
    console.error(`[media:verify] FAILED — ${failures.length} problem(s):`)
    for (const failure of failures) {
      console.error(`  ✗ ${failure}`)
    }
    process.exit(1)
  }

  console.log(`[media:verify] OK — ${references.size} referenced assets validated against the manifest${remoteChecked > 0 ? `, ${remoteChecked} storage objects HEAD-verified` : ''}${!useSupabaseMedia ? ' (flag OFF: fallback files verified on disk)' : ''}`)
}

run()
