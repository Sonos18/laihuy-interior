export type MediaPreset = 'hero' | 'full' | 'card' | 'gallery' | 'thumbnail'

export type MediaPresetConfig = {
  /**
   * `@nuxt/image` sizes syntax. Every segment MUST be breakpoint-prefixed (sm:/md:/…) —
   * a bare default segment makes @nuxt/image v2 emit broken `1w`/`2w` srcset entries.
   */
  sizes: string
  loading: 'eager' | 'lazy'
  fetchpriority: 'high' | 'auto'
  skeleton: boolean
}

export const mediaPresets: Record<MediaPreset, MediaPresetConfig> = {
  hero: {
    sizes: 'sm:100vw md:100vw lg:100vw xl:100vw',
    loading: 'eager',
    fetchpriority: 'high',
    skeleton: false
  },
  full: {
    sizes: 'sm:100vw md:100vw lg:100vw xl:100vw',
    loading: 'lazy',
    fetchpriority: 'auto',
    skeleton: true
  },
  card: {
    sizes: 'sm:100vw md:50vw lg:33vw',
    loading: 'lazy',
    fetchpriority: 'auto',
    skeleton: true
  },
  gallery: {
    sizes: 'sm:100vw md:50vw',
    loading: 'lazy',
    fetchpriority: 'auto',
    skeleton: true
  },
  thumbnail: {
    sizes: 'sm:100vw md:400px',
    loading: 'lazy',
    fetchpriority: 'auto',
    skeleton: false
  }
}
