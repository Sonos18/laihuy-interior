/**
 * Fire a GA4 event from a component. A no-op on the server and whenever no GA4 ID is configured
 * (see app/plugins/analytics.client.ts). Never pass personal data in `params`.
 */
export const useAnalytics = () => {
  const nuxtApp = useNuxtApp()
  const track = (name: string, params: Record<string, unknown> = {}) => {
    if (!import.meta.client) return
    const fn = nuxtApp.$track as ((n: string, p?: Record<string, unknown>) => void) | undefined
    fn?.(name, params)
  }
  return { track }
}
