import { APP_ORIGIN, APP_PORT, APP_TITLE_MARKER } from './origin'

/**
 * Fail fast when the server on the harness port is not Lai Huy Interior.
 *
 * `reuseExistingServer: true` (kept for CI parity) only checks that SOMETHING answers on the
 * port. Twice another project's `nuxt dev` held :3000 and every gate ran against the wrong app,
 * producing false passes and false failures. One request for `/` before any test removes that
 * whole class of result. Playwright starts (or reuses) `webServer` before this runs.
 */
export default async function globalSetup(): Promise<void> {
  const hint
    = `Stop whatever is listening on port ${APP_PORT}, or run the suite on a free port, e.g. `
      + '`$env:PLAYWRIGHT_PORT=3100` (PowerShell) / `PLAYWRIGHT_PORT=3100` (sh), after `pnpm build`.'

  let response: Response
  try {
    response = await fetch(new URL('/', APP_ORIGIN), { signal: AbortSignal.timeout(30_000) })
  } catch (error) {
    throw new Error(`[playwright] ${APP_ORIGIN}/ did not respond: ${String(error)}. ${hint}`)
  }

  const html = await response.text()
  const title = /<title[^>]*>([^<]*)<\/title>/i.exec(html)?.[1]?.trim() ?? '(no <title>)'
  if (!response.ok || !APP_TITLE_MARKER.test(title)) {
    throw new Error(
      `[playwright] ${APP_ORIGIN}/ is not the Lai Huy Interior app `
      + `(HTTP ${response.status}, title "${title}"). ${hint}`
    )
  }

  // The owner's `pnpm dev` holds the default port and passes the title check, so a run without
  // PLAYWRIGHT_PORT silently tested the dev server. Dev renders differently from the build CI
  // ships (it keeps template comments, serves fonts and CSS through Vite), and 22 visual
  // baselines approved that way disagreed with production by up to 16% of their pixels.
  if (html.includes('/_nuxt/@vite/client')) {
    throw new Error(
      `[playwright] ${APP_ORIGIN}/ is a \`nuxt dev\` server; the suites assert the production `
      + `build. ${hint}`
    )
  }
}
