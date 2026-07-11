import { fallbackEntries } from './fallback.generated'

// Sourced from the generated map (built by `pnpm media:catalog`) rather than a
// runtime `manifest.json` import, so only the ~14 KB of path pairs reach the
// client bundle instead of the full 188 KB manifest. The manifest's schema
// version is still asserted at generation time and in the test suite.
/** Storage path → original `/public` path, for the USE_SUPABASE_MEDIA=false fallback. */
export const fallbackPaths: ReadonlyMap<string, string> = new Map(fallbackEntries)
