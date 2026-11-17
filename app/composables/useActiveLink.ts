/**
 * Active-nav predicate, shared by AppHeader and AppDrawer.
 *
 * Extracted verbatim from app.vue during Phase 1. Behaviour is unchanged: '/' matches only
 * the exact path; every other link matches its subtree.
 */
export const useActiveLink = () => {
  const route = useRoute()

  // Links are authored unprefixed (`/du-an`); the English route carries `/en`, so compare the
  // path without its locale prefix.
  const isActive = (to: string) => {
    const path = stripLocalePrefix(route.path)
    return to === '/' ? path === '/' : path.startsWith(to)
  }

  return { isActive }
}
