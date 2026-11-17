/**
 * `/en` (owner, 2026-11-15). The site has no locale-prefixed URLs: English is the same routes with
 * the `lai-huy-locale` cookie set to `en` (useLanguage). Visitors and old links that try `/en` got
 * a 404; this sets that cookie and sends them to the home page, which then renders in English.
 *
 * A 302, not a 301: `/en` is not a permanent English URL, and should real `/en/...` routes ever
 * ship, browsers must not have cached a redirect away from it.
 */
export default defineEventHandler((event) => {
  setCookie(event, 'lai-huy-locale', 'en', {
    path: '/',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365
  })
  return sendRedirect(event, '/', 302)
})
