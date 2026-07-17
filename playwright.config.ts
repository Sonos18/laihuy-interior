import { defineConfig, devices } from '@playwright/test'

/**
 * Visual-regression + gate harness.
 * See docs/header-footer-art-direction.md §14 (budget), §38 (matrix), §41 (approval workflow).
 *
 * CI never regenerates a baseline (§41 P2). `pnpm test:vr` compares; approving a diff is a
 * deliberate, human-run `pnpm test:vr:approve` whose commit contains nothing else (§41 P6).
 */
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: true,
  // Retries are banned: a flaky VR suite is a broken VR suite (§41 P8). Determinism comes
  // from settle(), not from re-rolling.
  retries: 0,
  // Serialised on purpose. The app is a single-threaded Nitro server; concurrent workers
  // starve it, and full-page shots of image-heavy pages then fail to stabilise. Baselines
  // are approval artefacts — a shot that depends on machine load is worthless. Determinism
  // over speed (§41 P8: flake is fixed by determinism, never by re-rolling).
  workers: 1,
  timeout: 60_000,
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'tests/.report' }]],

  // §14: every capture is deterministic — motion disabled, reduced-motion emulated.
  use: {
    baseURL: 'http://localhost:3000',
    reducedMotion: 'reduce'
  },

  expect: {
    // Long, image-heavy pages need room for the full-page stitch to stabilise; the default
    // 5s is not enough for /gioi-thieu and /du-an/[slug] at 1440.
    timeout: 20_000,
    toHaveScreenshot: {
      animations: 'disabled',
      caret: 'hide',
      scale: 'css'
    }
  },

  /**
   * §14 — baselines are committed PER BROWSER, and cross-browser comparison is meaningless and
   * is never done (C-5: font rasterisation differs across engines and OSes). Playwright's
   * default snapshot path carries `{-projectName}`, so each project below owns its own baseline
   * set by construction rather than by convention.
   *
   * `vr` stays named `vr` — it is Chromium, and renaming it would orphan every baseline
   * committed in Phase 0.
   *
   * §38.1 requires all four engines. Tier 1 (C.1) = full VR suite on each.
   */
  projects: [
    {
      name: 'vr',
      // --font-render-hinting=none is a CHROMIUM flag and is scoped to the Chromium family:
      // Firefox and WebKit take their own CLI arguments and would reject it.
      use: { ...devices['Desktop Chrome'], launchOptions: { args: ['--font-render-hinting=none'] } }
    },
    {
      name: 'vr-edge',
      use: {
        ...devices['Desktop Edge'],
        channel: 'msedge',
        launchOptions: { args: ['--font-render-hinting=none'] }
      }
    },
    {
      name: 'vr-firefox',
      use: { ...devices['Desktop Firefox'] }
    },
    {
      // WebKit is the engine behind Safari. C.1 marks iOS Safari MANDATORY — this covers the
      // engine, not the device; a real-device pass remains a manual gate (§38.1).
      name: 'vr-webkit',
      use: { ...devices['Desktop Safari'] }
    }
  ],

  webServer: {
    command: 'node .output/server/index.mjs',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
    timeout: 120_000
  }
})
