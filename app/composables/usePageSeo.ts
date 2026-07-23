import type { MaybeRefOrGetter } from 'vue'
import { company } from '~/data/company'
import type { MediaPath } from '~/shared/media/types'
import type { LocalizedText } from '~/shared/types/localization'

/** One JSON-LD node. Callers build the shape; the composable only stringifies + injects it. */
export type JsonLdNode = Record<string, unknown>

type Translate = (value?: LocalizedText | '', fallback?: string) => string

export type PageSeoOptions = {
  /** Absolute route path, e.g. '/dich-vu' or '/' — drives canonical and og:url. */
  path: string
  title: MaybeRefOrGetter<string>
  description: MaybeRefOrGetter<string>
  /** og:title when it must differ from the document title (e.g. a suffixed case-study name). */
  ogTitle?: MaybeRefOrGetter<string>
  /** Comma-separated keywords meta, when the page has them. */
  keywords?: MaybeRefOrGetter<string>
  /** Media path of the social-card image; resolved and absolutised at 1200px. A getter for
   *  pages whose hero image is reactive (e.g. the project detail route). */
  imagePath: MaybeRefOrGetter<MediaPath>
  /** og:type — 'website' for hubs, 'article' for a single case study. Defaults to 'website'. */
  ogType?: 'website' | 'article'
  /**
   * JSON-LD builder. Receives the resolved `{ base, canonical }` so nodes can reference the
   * same origin without the page re-deriving it (and without a used-before-assigned dance
   * around the composable's return value). Returns one node or an array of independent nodes —
   * each carrying its own @context — emitted as a single <script>; Google reads a top-level
   * array fine. Called inside a computed, so locale-dependent `t()` output stays reactive.
   */
  jsonLd?: (ctx: { base: string, canonical: string }) => JsonLdNode | JsonLdNode[]
}

/**
 * The one place page SEO is assembled, so every route ships the SAME complete set: title,
 * description, the full og:* block (including url/type/site_name/locale that the pages were
 * individually missing), a Twitter card, a canonical link, and optional JSON-LD. Extracted
 * from the three pages that had hand-rolled versions (gioi-thieu / nha-xuong / du-an[slug]) so
 * the other five stop being second-class.
 *
 * Returns `base` and `canonical` so a page can build its own breadcrumb / entity schema off the
 * same origin without re-deriving it.
 */
export const usePageSeo = (options: PageSeoOptions) => {
  const { locale } = useLanguage()
  const { resolve: mediaUrl } = useMediaUrl()
  const { public: { siteUrl } } = useRuntimeConfig()

  const base = String(siteUrl).replace(/\/+$/, '')
  const canonical = options.path === '/' ? `${base}/` : `${base}${options.path}`

  // Absolutise: mediaUrl returns a Supabase absolute URL in production (USE_SUPABASE_MEDIA=true),
  // but a relative /public path when the flag is off — and og:image MUST be absolute. This makes
  // it correct in both modes instead of only in prod.
  const ogImage = computed(() => {
    const url = mediaUrl(toValue(options.imagePath), { width: 1200 })
    return url.startsWith('http') ? url : `${base}${url}`
  })

  useSeoMeta({
    title: () => toValue(options.title),
    description: () => toValue(options.description),
    keywords: options.keywords ? () => toValue(options.keywords) : undefined,
    ogTitle: () => toValue(options.ogTitle ?? options.title),
    ogDescription: () => toValue(options.description),
    ogImage,
    ogUrl: canonical,
    ogType: options.ogType ?? 'website',
    ogSiteName: company.name,
    ogLocale: () => (locale.value === 'en' ? 'en_US' : 'vi_VN'),
    twitterCard: 'summary_large_image'
  })

  const jsonLd = options.jsonLd
  useHead({
    link: [{ rel: 'canonical', href: canonical }],
    script: jsonLd
      ? [{
          type: 'application/ld+json',
          innerHTML: computed(() => JSON.stringify(jsonLd({ base, canonical })))
        }]
      : []
  })

  return { base, canonical }
}

/** A BreadcrumbList node from an ordered list of crumbs (last one is the current page). */
export const buildBreadcrumbLd = (
  base: string,
  t: Translate,
  crumbs: { name: LocalizedText, path: string }[]
): JsonLdNode => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  'itemListElement': crumbs.map((crumb, index) => ({
    '@type': 'ListItem',
    'position': index + 1,
    'name': t(crumb.name),
    'item': crumb.path === '/' ? `${base}/` : `${base}${crumb.path}`
  }))
})

/**
 * The Organization / LocalBusiness node, keyed on a stable @id so other nodes (AboutPage,
 * ContactPage, WebSite) can reference `${base}#organization` instead of restating it. Single
 * source of truth for the company's structured identity, drawn from `company`.
 */
export const buildOrganizationLd = (base: string, t: Translate): JsonLdNode => ({
  '@context': 'https://schema.org',
  '@type': ['Organization', 'LocalBusiness'],
  '@id': `${base}#organization`,
  'name': company.name,
  'url': `${base}/`,
  'logo': `${base}/logo.png`,
  'image': `${base}/logo.png`,
  'telephone': company.phone,
  'email': company.email,
  'sameAs': [company.facebook],
  'areaServed': t({ vi: 'Việt Nam và xuất khẩu', en: 'Vietnam and export' }),
  'address': company.addresses.map(address => ({
    '@type': 'PostalAddress',
    'name': t(address.label),
    'streetAddress': t(address.address)
  }))
})
