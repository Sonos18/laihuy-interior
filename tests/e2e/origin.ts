import process from 'node:process'

/**
 * The ONE place the harness decides which local server it talks to.
 *
 * `PLAYWRIGHT_PORT` (default 3001) drives `baseURL`, the `webServer` URL, the `PORT` the
 * production server is started with, and the origin specs use for cookies and absolute URLs.
 * The project is pinned to 3001 (also `devServer.port` in nuxt.config.ts and `pnpm preview`)
 * because every other `nuxt dev` on this machine grabs 3000. `reuseExistingServer` still reuses
 * whatever answers on the port, so pick another one if 3001 is busy, and let `global-setup.ts`
 * prove the server answering is actually this app.
 */
function resolvePort(raw: string | undefined): number {
  if (raw === undefined || raw.trim() === '') return 3001
  const port = Number(raw)
  if (!Number.isInteger(port) || port < 1 || port > 65_535) {
    throw new Error(`[playwright] PLAYWRIGHT_PORT must be an integer in 1–65535, got "${raw}"`)
  }
  return port
}

export const APP_PORT = resolvePort(process.env.PLAYWRIGHT_PORT)

export const APP_ORIGIN = `http://localhost:${APP_PORT}`

/** In the home page's `<title>` in both locales (`company.seo.home.title`). */
export const APP_TITLE_MARKER = /Lai Huy Interior/
