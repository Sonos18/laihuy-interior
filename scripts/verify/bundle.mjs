/**
 * Client JS budget — docs/header-footer-art-direction.md Appendix A.7.
 *
 *   pnpm bundle:baseline   → record tests/baseline/bundle.json from the pre-change build
 *   pnpm bundle            → compare the current build against it
 *
 * WHY THIS EXISTS
 * Phase 1 showed the Lighthouse gate cannot resolve small JS changes: the same build re-measured
 * swung TBT 44→70ms and LCP by up to 600ms, while a page that provably could not change got
 * *faster* by 900ms. Web Vitals on a loaded machine are noise-dominated at this granularity.
 *
 * Bytes are not. This gate is fully deterministic — same input, same number, every time — and it
 * is the one that actually catches JS bloat. Web Vitals catch what bytes cannot (render-blocking,
 * layout, paint); the two are complementary, and neither alone is sufficient.
 */
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

const DIR = path.join('.output', 'public', '_nuxt')
const BASELINE = path.join('tests', 'baseline', 'bundle.json')

/** Appendix A.7: chrome may add ≤ 2KB gz. Raw bytes ≈ 3x gz, so 6KB raw is the equivalent cap. */
const BUDGET_BYTES = 6 * 1024

const measure = () => {
  const files = fs.readdirSync(DIR).filter(f => f.endsWith('.js'))
  const js = files.reduce((sum, f) => sum + fs.statSync(path.join(DIR, f)).size, 0)
  return { js, files: files.length }
}

if (!fs.existsSync(DIR)) {
  console.error('✘ no build found. Run: pnpm build')
  process.exit(1)
}

const current = measure()

if (process.argv.includes('--baseline')) {
  fs.mkdirSync(path.dirname(BASELINE), { recursive: true })
  fs.writeFileSync(BASELINE, JSON.stringify(current, null, 2) + '\n')
  console.log(`✔ bundle baseline → ${current.js} bytes across ${current.files} files`)
  process.exit(0)
}

if (!fs.existsSync(BASELINE)) {
  console.error(`✘ no baseline at ${BASELINE}. Run: pnpm bundle:baseline`)
  process.exit(1)
}

const base = JSON.parse(fs.readFileSync(BASELINE, 'utf8'))
const delta = current.js - base.js
const sign = delta >= 0 ? '+' : ''

console.log(`client JS: ${base.js} → ${current.js} bytes  (${sign}${delta}, ${sign}${(delta / base.js * 100).toFixed(2)}%)`)

if (delta > BUDGET_BYTES) {
  console.error(`\n✘ client JS budget exceeded: ${sign}${delta} bytes (budget +${BUDGET_BYTES})`)
  process.exit(1)
}

console.log(`\n✔ within the client JS budget (+${BUDGET_BYTES} bytes, Appendix A.7)`)
