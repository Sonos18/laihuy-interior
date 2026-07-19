#!/usr/bin/env node
/**
 * Build, then restart the prod server — in that order, atomically.
 *
 * A Nitro prod server resolves `.output/public` assets against the index it had when it
 * booted. Rebuild underneath a running server and it starts 500ing on `_nuxt/<hash>.js` and
 * 404ing the `entry.<hash>.css` that is sitting right there on disk under that exact name.
 *
 * The failure is nasty because it does not look like a failure. The page still returns 200,
 * just without its stylesheet — so a layout measurement comes back as a plausible number that
 * is simply wrong (13911px against a true 7094px, every section padding reported as 0), and a
 * Playwright run hangs on `waitUntil: 'load'` until the 120s test timeout with no hint as to
 * why. It cost three separate debugging detours during the homepage density work before the
 * cause was identified.
 *
 * Usage:  node scripts/verify/serve-fresh.mjs [--no-build]
 */
import { spawn, spawnSync } from 'node:child_process'
import { setTimeout as sleep } from 'node:timers/promises'

const BASE = 'http://localhost:3000'
const skipBuild = process.argv.includes('--no-build')

/** Free port 3000 regardless of who owns it — a stray `nuxt dev` binds it just as happily. */
function killPort3000() {
  const ps = [
    '$c = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue;',
    'if ($c) { $c | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue } }'
  ].join(' ')
  spawnSync('powershell', ['-NoProfile', '-Command', ps], { stdio: 'ignore' })
}

async function waitFor(url, timeoutMs = 60_000) {
  const deadline = Date.now() + timeoutMs
  while (Date.now() < deadline) {
    try {
      const res = await fetch(url)
      if (res.ok) return res
    } catch { /* not up yet */ }
    await sleep(500)
  }
  throw new Error(`timed out waiting for ${url}`)
}

console.log('· freeing port 3000')
killPort3000()
await sleep(1500)

if (!skipBuild) {
  console.log('· building')
  const build = spawnSync('pnpm', ['build'], { stdio: 'inherit', shell: true })
  if (build.status !== 0) process.exit(build.status ?? 1)
}

console.log('· starting server')
const server = spawn('node', ['.output/server/index.mjs'], { detached: true, stdio: 'ignore' })
server.unref()

const html = await (await waitFor(BASE)).text()

/**
 * Prove the asset index matches what was just built. Serving the HTML is not enough — a stale
 * server serves HTML happily and then fails only on the referenced assets, which is exactly the
 * silent-corruption case this script exists to prevent.
 */
const assets = [
  ...new Set([
    ...(html.match(/\/_nuxt\/[A-Za-z0-9_.-]+\.css/g) || []),
    ...(html.match(/\/_nuxt\/[A-Za-z0-9_.-]+\.js/g) || [])
  ])
].slice(0, 12)

if (assets.length === 0) throw new Error('no _nuxt assets referenced in the served HTML')

const bad = []
for (const a of assets) {
  const res = await fetch(BASE + a)
  if (!res.ok) bad.push(`${a} -> ${res.status}`)
}

if (bad.length) {
  console.error('\n✗ STALE ASSET INDEX — the server is not serving this build:')
  for (const b of bad) console.error(`    ${b}`)
  process.exit(1)
}

console.log(`✓ server fresh — ${assets.length} assets verified, ready at ${BASE}`)
