// Removes never-uploaded ('planned') manifest entries that can no longer be uploaded
// (source file gone) or that are named with --path=<storage path>. Uploaded assets are
// never touched, nothing remote changes, and an entry still used by app code blocks the run.
//
// Usage: pnpm media:prune [--path=<storage path> ...] [--write]
//        then: pnpm media:catalog
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import process from 'node:process'
import { readManifest, REPO_ROOT, writeManifest } from './lib'
import { planPrunePlanned } from './selection'

const write = process.argv.includes('--write')
const explicitPaths = process.argv
  .filter(argument => argument.startsWith('--path='))
  .map(argument => argument.slice('--path='.length))

const camelKey = (slug: string): string =>
  slug.replace(/-([a-z0-9])/g, (_, c: string) => c.toUpperCase())

const appSources = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) {
      return path.endsWith(join('app', 'shared', 'media')) ? [] : appSources(path)
    }
    return /\.(ts|vue)$/.test(entry.name) && !entry.name.endsWith('.generated.ts')
      ? [readFileSync(path, 'utf8')]
      : []
  })

const sources = appSources(join(REPO_ROOT, 'app'))
const manifest = readManifest()
const plan = planPrunePlanned({
  assets: manifest.assets,
  explicitPaths,
  sourceExists: sourceFile => existsSync(join(REPO_ROOT, sourceFile)),
  isReferenced: (asset) => {
    const key = camelKey(asset.path.split('/').pop()?.replace(/\.\w+$/, '') ?? '')
    return sources.some(text => text.includes(asset.path) || new RegExp(`\\b${key}\\b`).test(text))
  }
})

if (plan.errors.length > 0) {
  console.error('[media:prune] refused:')
  plan.errors.forEach(error => console.error(`  ✗ ${error}`))
  process.exit(1)
}
if (plan.prune.length === 0) {
  console.log('[media:prune] nothing to prune')
  process.exit(0)
}

plan.prune.forEach(asset => console.log(`  - ${asset.path} (${asset.sourceFile})`))
if (!write) {
  console.log(`[media:prune] DRY RUN — ${plan.prune.length} planned entries would be removed. Re-run with --write.`)
  process.exit(0)
}
const removed = new Set(plan.prune.map(asset => asset.path))
manifest.assets = manifest.assets.filter(asset => !removed.has(asset.path))
writeManifest(manifest)
console.log(`[media:prune] removed ${removed.size} planned entries. Next: pnpm media:catalog`)
