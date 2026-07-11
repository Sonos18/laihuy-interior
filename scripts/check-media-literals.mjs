// CI guard: application code must never hardcode /public image paths or Supabase URLs.
// All image URL construction goes through the media layer (app/media/).
import { readdirSync, readFileSync } from 'node:fs'
import { join, relative, sep } from 'node:path'
import process from 'node:process'

const ROOT = process.cwd()
const SCAN_DIR = join(ROOT, 'app')
const SCANNED_EXTENSIONS = ['.vue', '.ts', '.js', '.mjs']
const ALLOWED_FILES = new Set([
  ['app', 'media', 'fallback.ts'].join(sep),
  ['app', 'media', 'fallback.generated.ts'].join(sep),
  ['app', 'media', 'url.ts'].join(sep),
  ['app', 'shared', 'media', 'manifest.json'].join(sep)
])
const FORBIDDEN_PATTERNS = [
  { pattern: /['"`(]\/images\//, label: 'hardcoded /images/ path' },
  { pattern: /supabase\.co/, label: 'hardcoded Supabase URL' }
]

const walk = dir =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) {
      return walk(path)
    }
    return SCANNED_EXTENSIONS.some(ext => entry.name.endsWith(ext)) ? [path] : []
  })

const violations = []

for (const file of walk(SCAN_DIR)) {
  const relativePath = relative(ROOT, file)
  if (ALLOWED_FILES.has(relativePath)) {
    continue
  }

  const lines = readFileSync(file, 'utf8').split('\n')
  lines.forEach((line, index) => {
    for (const { pattern, label } of FORBIDDEN_PATTERNS) {
      if (pattern.test(line)) {
        violations.push(`${relativePath}:${index + 1} — ${label}: ${line.trim()}`)
      }
    }
  })
}

if (violations.length > 0) {
  console.error('[media-guard] Image references must go through the media layer (app/media/):\n')
  for (const violation of violations) {
    console.error(`  ${violation}`)
  }
  process.exit(1)
}

console.log('[media-guard] OK — no hardcoded image paths or Supabase URLs in app/')
