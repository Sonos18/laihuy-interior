/**
 * GA4, loaded only when `runtimeConfig.public.gaId` (NUXT_PUBLIC_GA_ID) is set.
 *
 * - The standard gtag queue is defined at once, so events fired before the library arrives are
 *   kept; the library itself is fetched on idle, after the page has painted.
 * - Page views on client-side navigation are GA4's own "page changes based on browser history"
 *   enhanced measurement; nothing here sends them.
 * - Contact clicks are tracked by ONE delegated listener on the document, so no component needs
 *   to know about analytics: any `tel:`, Zalo or `mailto:` link anywhere on the site counts, with
 *   the region it sits in as `link_location`. Components fire their own events with `track()`
 *   (useAnalytics) only for actions that are not links, such as the contact form.
 * - No personal data is sent: never a name, phone number, email or message.
 */
type Gtag = (...args: unknown[]) => void

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: Gtag
  }
}

/** Where a click happened, read from the nearest marked region, else from the page landmark. */
const locationOf = (el: Element): string => {
  const marked = el.closest<HTMLElement>('[data-track-location]')
  if (marked?.dataset.trackLocation) return marked.dataset.trackLocation
  if (el.closest('header')) return 'header'
  if (el.closest('footer')) return 'footer'
  if (el.closest('[role="dialog"]')) return 'drawer'
  return 'page'
}

const eventFor = (href: string): string | undefined => {
  if (href.startsWith('tel:')) return 'click_call'
  if (href.startsWith('mailto:')) return 'click_email'
  if (/^https?:\/\/(?:www\.)?zalo\.me\//.test(href)) return 'click_zalo'
  return undefined
}

export default defineNuxtPlugin(() => {
  const gaId = useRuntimeConfig().public.gaId as string

  const track = (name: string, params: Record<string, unknown> = {}) => {
    window.gtag?.('event', name, params)
  }

  if (!gaId) {
    return { provide: { track: (_name: string, _params?: Record<string, unknown>) => {} } }
  }

  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag() {
    // gtag.js reads the `arguments` object itself, not an array copy.
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments)
  }
  window.gtag('js', new Date())
  window.gtag('config', gaId)

  const load = () => {
    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`
    document.head.appendChild(script)
  }
  if ('requestIdleCallback' in window) window.requestIdleCallback(load, { timeout: 3000 })
  else setTimeout(load, 1500)

  document.addEventListener('click', (event) => {
    const link = (event.target as Element | null)?.closest?.('a[href]')
    if (!link) return
    const href = link.getAttribute('href') ?? ''
    const name = eventFor(href)
    if (name) track(name, { link_location: locationOf(link) })
  }, { capture: true })

  return { provide: { track } }
})
