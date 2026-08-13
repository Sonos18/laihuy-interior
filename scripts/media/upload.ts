// Upload pass: .media-build/ → Supabase Storage `media` bucket. The ONLY supported
// ingestion path — dashboard uploads bypass the manifest and are not part of the workflow.
// Idempotent and resumable: remote existence + checksums decide per object; the manifest
// is checkpointed after every completed asset, so an interrupted run resumes safely.
// Usage: pnpm media:upload [--dry-run] [--audit]
//   --dry-run  full analysis (including remote existence checks), zero writes
//   --audit    also list bucket objects that are not in the manifest (drift detection)
import { readFileSync } from 'node:fs'
import process from 'node:process'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { MEDIA_BUCKET } from '../../app/shared/media/constants'
import {
  assertNotCI,
  assetObjects,
  contentTypeFor,
  fileExists,
  loadEnv,
  publicObjectUrl,
  readManifest,
  remoteObjectExists,
  sha256,
  writeManifest
} from './lib'
import { selectAssetsByPrefix } from './selection'

const CACHE_CONTROL_SECONDS = '31536000' // 1 year; safe because objects are immutable (A1)

const dryRun = process.argv.includes('--dry-run')
const audit = process.argv.includes('--audit')
const pathPrefixArgument = process.argv.find(argument => argument.startsWith('--path-prefix'))
const pathPrefix = (() => {
  if (!pathPrefixArgument) return null
  if (!pathPrefixArgument.startsWith('--path-prefix=')) {
    throw new Error('path prefix must use --path-prefix=<prefix>')
  }
  const prefix = pathPrefixArgument.slice('--path-prefix='.length)
  if (!prefix) {
    throw new Error('path prefix must not be empty')
  }
  return prefix
})()

type Plan = 'upload' | 'skip' | 'resume' | 'conflict' | 'missing-build'

const planLabel: Record<Plan, string> = {
  'upload': 'UPLOAD',
  'skip': 'SKIP (already uploaded)',
  'resume': 'RESUME (remote matches local — marking done)',
  'conflict': 'CONFLICT (remote content differs — immutability violation, bump -v version)',
  'missing-build': 'MISSING BUILD (run pnpm media:optimize first)'
}

const remoteChecksum = async (supabaseUrl: string, path: string): Promise<string | null> => {
  const response = await fetch(publicObjectUrl(supabaseUrl, path))
  if (!response.ok) {
    return null
  }
  return sha256(Buffer.from(await response.arrayBuffer()))
}

const listBucketRecursive = async (client: SupabaseClient, prefix = ''): Promise<string[]> => {
  const { data, error } = await client.storage.from(MEDIA_BUCKET).list(prefix, { limit: 1000 })
  if (error) {
    throw new Error(`[media:upload] list failed at "${prefix}": ${error.message}`)
  }
  const paths: string[] = []
  for (const entry of data ?? []) {
    const path = prefix ? `${prefix}/${entry.name}` : entry.name
    if (entry.id === null) {
      paths.push(...await listBucketRecursive(client, path))
    } else {
      paths.push(path)
    }
  }
  return paths
}

const run = async () => {
  if (audit && pathPrefix) {
    console.error('[media:upload] --audit must use the full manifest and cannot be combined with --path-prefix.')
    process.exit(1)
  }

  loadEnv()
  if (!dryRun) {
    assertNotCI('upload media')
  }

  const supabaseUrl = process.env.NUXT_PUBLIC_SUPABASE_URL ?? ''
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''

  if (!supabaseUrl) {
    console.error('[media:upload] NUXT_PUBLIC_SUPABASE_URL is not set. Dry-run analysis needs it for remote existence checks; uploads cannot proceed without it.')
    process.exit(1)
  }
  if (!dryRun && !serviceKey) {
    console.error('[media:upload] SUPABASE_SERVICE_ROLE_KEY is not set (local .env only — never CI/deploy env).')
    process.exit(1)
  }

  const client = serviceKey ? createClient(supabaseUrl, serviceKey) : null
  const manifest = readManifest()
  const assets = selectAssetsByPrefix(manifest.assets, pathPrefix)
  let uploaded = 0
  let skipped = 0
  let resumed = 0
  const problems: string[] = []

  for (const asset of assets) {
    if (asset.status === 'skipped' || asset.status === 'superseded') {
      continue
    }

    let assetComplete = true
    for (const object of assetObjects(asset)) {
      if (!fileExists(object.localFile)) {
        console.log(`${planLabel['missing-build']}: ${object.path}`)
        problems.push(object.path)
        assetComplete = false
        continue
      }

      const localBuffer = readFileSync(object.localFile)
      const exists = await remoteObjectExists(supabaseUrl, object.path)

      let plan: Plan
      if (!exists) {
        plan = 'upload'
      } else if (asset.status === 'active') {
        plan = 'skip'
      } else {
        const remote = await remoteChecksum(supabaseUrl, object.path)
        plan = remote === sha256(localBuffer) ? 'resume' : 'conflict'
      }

      console.log(`${planLabel[plan]}: ${object.path}`)

      if (plan === 'conflict') {
        problems.push(object.path)
        assetComplete = false
        continue
      }
      if (plan === 'skip' || plan === 'resume') {
        skipped += plan === 'skip' ? 1 : 0
        resumed += plan === 'resume' ? 1 : 0
        continue
      }

      if (dryRun) {
        uploaded += 1
        continue
      }

      const { error } = await client!.storage.from(MEDIA_BUCKET).upload(object.path, localBuffer, {
        contentType: contentTypeFor(object.path),
        cacheControl: CACHE_CONTROL_SECONDS,
        upsert: false
      })
      if (error) {
        console.error(`[media:upload] upload failed for ${object.path}: ${error.message}`)
        problems.push(object.path)
        assetComplete = false
        continue
      }
      uploaded += 1
    }

    if (assetComplete && asset.status === 'planned' && !dryRun) {
      asset.status = 'active'
      asset.uploadedAt = new Date().toISOString()
      writeManifest(manifest) // checkpoint after every completed asset — interrupted runs resume here
    }
  }

  if (audit && client) {
    const manifestPaths = new Set(manifest.assets.flatMap(asset => assetObjects(asset).map(object => object.path)))
    const remotePaths = await listBucketRecursive(client)
    const unknown = remotePaths.filter(path => !manifestPaths.has(path) && !path.endsWith('.emptyFolderPlaceholder'))
    if (unknown.length > 0) {
      console.log(`\n[media:upload] AUDIT — ${unknown.length} bucket object(s) NOT in the manifest (dashboard uploads are unsupported; reconcile or remove):`)
      for (const path of unknown) {
        console.log(`  ${path}`)
      }
    } else {
      console.log('\n[media:upload] AUDIT — bucket and manifest are in sync.')
    }
  }

  console.log(`\n[media:upload] ${dryRun ? 'DRY RUN — nothing written. ' : ''}${uploaded} to upload/uploaded, ${skipped} skipped, ${resumed} resumed, ${problems.length} problems`)
  if (problems.length > 0) {
    process.exit(1)
  }
}

run()
