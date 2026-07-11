import { projects } from '~/data/projects'

// Static marketing routes (mirrors the prerendered routeRules in nuxt.config).
const STATIC_ROUTES = [
  '/',
  '/du-an',
  '/nha-xuong',
  '/dich-vu',
  '/gioi-thieu',
  '/tuyen-dung',
  '/lien-he'
]

export default defineEventHandler((event) => {
  const { siteUrl } = useRuntimeConfig(event).public
  const base = String(siteUrl).replace(/\/+$/, '')

  const routes = [
    ...STATIC_ROUTES,
    ...projects.map(project => `/du-an/${project.slug}`)
  ]

  const urls = routes
    .map(route => `  <url><loc>${base}${route}</loc></url>`)
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`

  setHeader(event, 'content-type', 'application/xml; charset=utf-8')
  return xml
})
