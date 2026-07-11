export default defineEventHandler((event) => {
  const { siteUrl } = useRuntimeConfig(event).public
  const base = String(siteUrl).replace(/\/+$/, '')

  const lines = ['User-agent: *', 'Allow: /']
  if (base) {
    lines.push('', `Sitemap: ${base}/sitemap.xml`)
  }

  setHeader(event, 'content-type', 'text/plain; charset=utf-8')
  return `${lines.join('\n')}\n`
})
