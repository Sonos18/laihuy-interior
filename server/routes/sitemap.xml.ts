import { projects } from '~/data/projects'
import { DEFAULT_LOCALE, HREFLANG, LOCALES, localizePath } from '~/utils/locale-path'

// Static marketing routes (mirrors the prerendered routeRules in nuxt.config).
const STATIC_ROUTES = [
  '/',
  '/du-an',
  '/nha-xuong',
  '/dich-vu',
  '/gioi-thieu',
  '/tuyen-dung',
  '/lien-he',
  '/privacy-policy',
  '/terms-of-use'
]

export default defineEventHandler((event) => {
  const { siteUrl } = useRuntimeConfig(event).public
  const base = String(siteUrl).replace(/\/+$/, '')

  const routes = [
    ...STATIC_ROUTES,
    ...projects.map(project => `/du-an/${project.slug}`)
  ]

  // Every page in both languages, each entry listing all its language versions (Google's
  // sitemap form of hreflang): https://developers.google.com/search/docs/specialty/international/localized-versions#sitemap
  const href = (route: string, locale: (typeof LOCALES)[number]) => `${base}${localizePath(route, locale)}`
  const urls = routes
    .flatMap(route => LOCALES.map(locale => [
      '  <url>',
      `    <loc>${href(route, locale)}</loc>`,
      ...LOCALES.map(alternate =>
        `    <xhtml:link rel="alternate" hreflang="${HREFLANG[alternate]}" href="${href(route, alternate)}"/>`),
      `    <xhtml:link rel="alternate" hreflang="x-default" href="${href(route, DEFAULT_LOCALE)}"/>`,
      '  </url>'
    ].join('\n')))
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>
`

  setHeader(event, 'content-type', 'application/xml; charset=utf-8')
  return xml
})
