/**
 * Active-nav predicate, shared by AppHeader and AppDrawer.
 *
 * Extracted verbatim from app.vue during Phase 1. Behaviour is unchanged: '/' matches only
 * the exact path; every other link matches its subtree.
 */
export const useActiveLink = () => {
  const route = useRoute()

  const isActive = (to: string) =>
    to === '/' ? route.path === '/' : route.path.startsWith(to)

  return { isActive }
}
