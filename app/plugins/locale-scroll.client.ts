// Switching language keeps the reader where they are.
//
// `/du-an` → `/en/du-an` is a different path, so Nuxt's default scrollBehavior would treat it as
// a new page and jump to the top. For a language switch that is wrong: the content is the same,
// only its words change. Opting the navigation out of scroll-to-top (route meta, read by the
// default scrollBehavior) is not enough on its own, because the `out-in` page swap briefly
// empties <main> and the browser clamps scrollY to the shorter document. So the offset is saved
// before the swap and put back once the new page is in place. The drawer closes on the route
// change as it does for any navigation (app.vue).
export default defineNuxtPlugin((nuxtApp) => {
  const router = useRouter()

  router.beforeEach((to, from) => {
    const isLocaleSwitch = to.path !== from.path
      && localeFromPath(to.path) !== localeFromPath(from.path)
      && stripLocalePrefix(to.fullPath) === stripLocalePrefix(from.fullPath)
    if (!isLocaleSwitch) return

    to.meta.scrollToTop = false
    // With the mobile drawer open the body is locked `position: fixed; top: -Ypx` (AppDrawer),
    // so scrollY reads 0 and the real offset is in the lock.
    const { style } = document.body
    const top = style.position === 'fixed' ? Math.abs(Number.parseFloat(style.top) || 0) : window.scrollY
    nuxtApp.hooks.hookOnce('page:finish', () => {
      requestAnimationFrame(() => window.scrollTo({ top, left: 0, behavior: 'instant' }))
    })
  })
})
