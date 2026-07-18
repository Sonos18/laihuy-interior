<script setup lang="ts">
import { company } from '~/data/company'

const { locale, t } = useLanguage()
const { resolve: mediaUrl } = useMediaUrl()

useHead({
  meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
  link: [{ rel: 'icon', href: '/logo_favicon.png' }],
  htmlAttrs: {
    lang: locale
  },
  // §34.2 — the pre-hydration guard. SSR renders p = 0 (COVER), which is correct for any page
  // loaded at the top. A reload with a browser-RESTORED mid-page scroll would otherwise paint a
  // transparent header with a dark scrim over white content for a frame — white-on-white nav.
  // An attribute, not --header-p directly: setting the property on :root would defeat the
  // confinement of its invalidation to the header subtree (A.2). One class match, zero
  // inheritance. useHeaderState removes the attribute on mount and takes over.
  script: [{
    innerHTML: 'document.documentElement.dataset.chrome=scrollY>0?"nav":"cover"',
    tagPosition: 'head'
  }]
})

const title = computed(() => t(company.seo.home.title))
const description = computed(() => t(company.seo.home.description))

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogImage: mediaUrl(company.seo.home.ogImage.path),
  twitterCard: 'summary_large_image'
})

const route = useRoute()
const isMobileMenuOpen = ref(false)

// §5.1 — the drawer is one of the four state dimensions, so the machine has to know about it:
// I4 (DRAWER_OPEN ⟹ REVEALED ∧ p frozen) and FG-12 (the screen's one blur belongs to the
// drawer overlay while it is open) both depend on it.
const { setDrawerOpen } = useHeaderState()

// §33.6 — a route change closes the drawer AND resets focus to document start.
//
// The reset is sequenced here rather than in AppDrawer because the drawer cannot distinguish a
// route-change close (focus → document start) from a normal close (focus → trigger), and giving
// it the route would be forbidden knowledge (§26.4). This watcher fires first, then the
// drawer's own `open` watcher returns focus to the trigger during the same flush; blurring on
// the following tick lands last and wins. Both rules in §33.6 hold, in the order stated.
watch(
  () => route.path,
  async () => {
    const wasOpen = isMobileMenuOpen.value
    isMobileMenuOpen.value = false
    if (!wasOpen || !import.meta.client) return
    await nextTick()
    ;(document.activeElement as HTMLElement | null)?.blur()
  }
)

// The body scroll lock moved to AppDrawer in Phase 5: §26.4 assigns it to the drawer, and
// §33.3 mandates the iOS-safe method (position: fixed + top: -scrollY + exact restore) because
// `overflow: hidden` on <body> does not reliably lock scroll in iOS Safari. What stays here is
// the state-machine wiring: the drawer is one of the four state dimensions (§5.1), and I4 +
// FG-12 both depend on the machine knowing.
watch(isMobileMenuOpen, setDrawerOpen)
</script>

<template>
  <div class="flex min-h-screen flex-col bg-white">
    <!-- §33.6 / D.2 — Skip to content is REQUIRED: WCAG 2.4.1 Bypass Blocks is Level A, and the
         site repeats 7 nav links on every page with no bypass mechanism. This is a fix for a
         live Level-A failure, not a content change. It must be the FIRST focusable element in
         the DOM, so it precedes the header. -->
    <a
      class="skip-link"
      href="#main"
    >
      {{ t({ vi: 'Đến nội dung chính', en: 'Skip to content' }) }}
    </a>

    <AppHeader @open-menu="isMobileMenuOpen = true" />

    <AppDrawer
      :open="isMobileMenuOpen"
      @close="isMobileMenuOpen = false"
    />

    <!-- tabindex="-1" so the skip link's target can actually receive focus: without it the jump
         moves the viewport but not the focus ring, and the next Tab returns to the nav. -->
    <main
      id="main"
      class="grow"
      tabindex="-1"
    >
      <NuxtPage />
    </main>

    <AppFooter />
  </div>
</template>
