import { MANIFEST_SCHEMA_VERSION, MEDIA_TOP_LEVEL_FOLDERS } from './constants'
import type { MediaPath } from './types'

/**
 * Guard every manifest load against schema drift. Throws a clear, actionable error
 * when the manifest's `schemaVersion` is missing or not the version this codebase
 * supports (`MANIFEST_SCHEMA_VERSION`), so future format changes are explicit.
 */
export const assertManifestSchemaVersion = (manifest: { schemaVersion?: number }): void => {
  if (manifest.schemaVersion !== MANIFEST_SCHEMA_VERSION) {
    throw new Error(
      `[media] Unsupported manifest schemaVersion: ${manifest.schemaVersion ?? '(missing)'} `
      + `(expected ${MANIFEST_SCHEMA_VERSION}). Regenerate with 'pnpm media:scan --write' `
      + 'or migrate the manifest to the current schema.'
    )
  }
}

const FOLDER_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

// {name}[-v{N}][-w{width}].{ext} — see docs/media-migration/phase-1-storage-architecture.md §1.3
const FILENAME_PATTERN
  = /^([a-z0-9]+(?:-[a-z0-9]+)*?)(?:-v([1-9]\d*))?(?:-w(\d{2,4}))?\.(webp|jpg|png|svg)$/

const RESERVED_SUFFIX_PATTERN = /-[vw]\d+$|-v-\d+$/

export type ParsedMediaFilename = {
  name: string
  version: number
  variantWidth: number | null
  extension: 'webp' | 'jpg' | 'png' | 'svg'
  kind: 'raster' | 'vector'
}

export const parseMediaFilename = (filename: string): ParsedMediaFilename | null => {
  const match = FILENAME_PATTERN.exec(filename)
  if (!match) {
    return null
  }

  const [, name, version, variantWidth, extension] = match as unknown as
    [string, string, string | undefined, string | undefined, ParsedMediaFilename['extension']]

  if (RESERVED_SUFFIX_PATTERN.test(name)) {
    return null
  }

  const kind = extension === 'svg' ? 'vector' : 'raster'

  if (kind === 'vector' && variantWidth) {
    return null
  }

  return {
    name,
    version: version ? Number(version) : 1,
    variantWidth: variantWidth ? Number(variantWidth) : null,
    extension,
    kind
  }
}

export const isValidMediaPath = (path: MediaPath): boolean => {
  if (!path || path.includes('\\') || path.includes('..') || path.startsWith('/') || path.endsWith('/')) {
    return false
  }

  const segments = path.split('/')
  if (segments.length < 2) {
    return false
  }

  const [topLevel] = segments
  if (!MEDIA_TOP_LEVEL_FOLDERS.includes(topLevel as never)) {
    return false
  }

  const folders = segments.slice(1, -1)
  if (!folders.every(folder => FOLDER_PATTERN.test(folder))) {
    return false
  }

  return parseMediaFilename(segments[segments.length - 1] as string) !== null
}

export const assertMediaPath = (path: MediaPath): MediaPath => {
  if (!isValidMediaPath(path)) {
    throw new Error(`[media] Invalid media path: "${path}"`)
  }
  return path
}

export const isVectorPath = (path: MediaPath): boolean => path.endsWith('.svg')
