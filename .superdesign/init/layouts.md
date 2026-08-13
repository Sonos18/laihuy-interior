# Shared layouts and shell source

The application has no separate `app/layouts/` directory. The shared shell is implemented by `app/app.vue` and the following navigation/footer components.

## app/app.vue

```vue
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
  // Â§34.2 â€” the pre-hydration guard. SSR renders p = 0 (COVER), which is correct for any page
  // loaded at the top. A reload with a browser-RESTORED mid-page scroll would otherwise paint a
  // transparent header with a dark scrim over white content for a frame â€” white-on-white nav.
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

// Â§5.1 â€” the drawer is one of the four state dimensions, so the machine has to know about it:
// I4 (DRAWER_OPEN âŸ¹ REVEALED âˆ§ p frozen) and FG-12 (the screen's one blur belongs to the
// drawer overlay while it is open) both depend on it.
const { setDrawerOpen } = useHeaderState()

// Â§33.6 â€” a route change closes the drawer AND resets focus to document start.
//
// The reset is sequenced here rather than in AppDrawer because the drawer cannot distinguish a
// route-change close (focus â†’ document start) from a normal close (focus â†’ trigger), and giving
// it the route would be forbidden knowledge (Â§26.4). This watcher fires first, then the
// drawer's own `open` watcher returns focus to the trigger during the same flush; blurring on
// the following tick lands last and wins. Both rules in Â§33.6 hold, in the order stated.
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

// The body scroll lock moved to AppDrawer in Phase 5: Â§26.4 assigns it to the drawer, and
// Â§33.3 mandates the iOS-safe method (position: fixed + top: -scrollY + exact restore) because
// `overflow: hidden` on <body> does not reliably lock scroll in iOS Safari. What stays here is
// the state-machine wiring: the drawer is one of the four state dimensions (Â§5.1), and I4 +
// FG-12 both depend on the machine knowing.
watch(isMobileMenuOpen, setDrawerOpen)
</script>

<template>
  <div class="flex min-h-screen flex-col bg-white">
    <!-- Â§33.6 / D.2 â€” Skip to content is REQUIRED: WCAG 2.4.1 Bypass Blocks is Level A, and the
         site repeats 7 nav links on every page with no bypass mechanism. This is a fix for a
         live Level-A failure, not a content change. It must be the FIRST focusable element in
         the DOM, so it precedes the header. -->
    <a
      class="skip-link"
      href="#main"
    >
      {{ t({ vi: 'Äáº¿n ná»™i dung chÃ­nh', en: 'Skip to content' }) }}
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
```

## app/components/AppHeader.vue

```vue
<script setup lang="ts">
// Phase 4 â€” the header is part of the cover, not a bar above it (Â§1).
// At rest it owns no background, no border and no blur â€” only a scrim that protects
// legibility (Â§5.2). It is the signature on the photograph.
//
// This component owns MARKUP only. Scroll state, direction, visibility, route hooks and every
// CSS-var write belong to useHeaderState (Â§2, Â§26.1, Â§27). Forbidden knowledge (Â§26.1): the
// current route, hero mode/atmosphere/focal, whether a hero exists, any page's DOM, and its own
// height in pixels â€” it reads --header-h.
import { company } from '~/data/company'
import { navLinks, uiText } from '~/data/ui'

const props = withDefaults(defineProps<{
  /**
   * I9 escape hatch, and the ONLY prop this component has (Â§26.1). A page that cannot open with
   * a dark cover must opt into permanent NAVIGATION chrome. Also the Â§28.4 kill switch: `solid`
   * globally reproduces a conventional, accessible header on every page.
   */
  solid?: boolean
}>(), { solid: false })

const emit = defineEmits<{ openMenu: [] }>()

const { locale, t } = useLanguage()
const { isActive } = useActiveLink()
const { register, setSolid, chromeState, drawerOpen } = useHeaderState()

const headerEl = ref<HTMLElement | null>(null)

// Â§34.1 â€” the first measurement runs synchronously in onMounted, before paint.
onMounted(() => {
  setSolid(props.solid)
  if (headerEl.value) register(headerEl.value)
})

watch(() => props.solid, value => setSolid(value))
</script>

<template>
  <header
    ref="headerEl"
    class="app-header"
    data-blur="off"
    data-chrome-state="cover"
  >
    <!-- Two prebuilt layers, animated by opacity alone (ADR-006b). Complementary, never
         additive: Î±_scrim + Î±_glass â‰¤ 1 at every p (I7). -->
    <div
      class="chrome-layer chrome-scrim"
      aria-hidden="true"
    />
    <div
      class="chrome-layer chrome-glass"
      aria-hidden="true"
    />

    <nav
      class="shell chrome-bar"
      :aria-label="t({ vi: 'Äiá»u hÆ°á»›ng chÃ­nh', en: 'Main navigation' })"
    >
      <NuxtLink
        to="/"
        class="chrome-logo"
        aria-label="Lai Huy Interior"
      >
        <!-- Â§35 â€” mono-white is in the LCP viewport and must never pop in after the cover.
             mono-ink is opacity:0 but must be DECODED before the user scrolls, or the
             cross-fade flashes an empty box. Both carry explicit width/height (FG-15). -->
        <img
          src="/logo-mono-white.png"
          alt="Lai Huy Interior"
          width="424"
          height="212"
          loading="eager"
          fetchpriority="high"
          class="chrome-logo-img chrome-logo-white"
        >
        <img
          src="/logo-mono-ink.png"
          alt=""
          aria-hidden="true"
          width="424"
          height="212"
          loading="eager"
          fetchpriority="low"
          class="chrome-logo-img chrome-logo-ink"
        >
      </NuxtLink>

      <!-- Â§9 â€” the desktop nav breakpoint is `xl`, not `lg`. A narrative decision, not a width
           workaround: at tablet the 7-link index would crowd the logo, so the cover becomes
           purer and the index moves into the drawer, where it reads as a contents page. -->
      <div class="chrome-nav hidden xl:flex">
        <NuxtLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="nav-link chrome-nav-color"
          :aria-current="isActive(link.to) ? 'page' : undefined"
        >
          {{ t(link.label) }}
        </NuxtLink>
      </div>

      <div class="chrome-right hidden xl:flex">
        <!-- Â§9 â€” VI/EN is part of the masthead at rest. Phone and CTA are not: the hero below
             already carries the single primary action. They arrive on scroll. -->
        <AppLangToggle :surface="chromeState === 'nav' ? 'light' : 'dark'" />

        <!-- I8 â€” never tab into an invisible control. `opacity: 0` alone is not hiding (FG-09):
             inert + aria-hidden while p < 0.5.

             O3 RESOLUTION: the phone is NOT here. The VI NAVIGATION row needed 1421px against
             1216px at 1280 (âˆ’205px, where V11 requires +8px), and FG-16's sanctioned levers
             could not close it. The phone moved to the drawer's foot â€” where Â§9 says it belongs
             ("mobile is where it belongs") â€” and the CTA stays, because Â§9 calls it the action
             the header takes over conversion with. See --nav-item-px in main.css. -->
        <div
          class="chrome-actions"
          :inert="chromeState === 'cover'"
          :aria-hidden="chromeState === 'cover'"
        >
          <NuxtLink
            to="/lien-he"
            class="btn-primary"
          >
            {{ t(uiText.cta.quote24h) }}
          </NuxtLink>
        </div>
      </div>

      <!-- Below `xl` the header carried a logo and a menu button and nothing else: the entire
           `.chrome-right` group above is `hidden xl:flex`, so phone and CTA did not exist on
           phone or tablet. On the longest page (/du-an/[slug], ~25 viewports at 390px) that
           left roughly 24 viewports with no visible way to make contact â€” the conversion path
           existed in code and was switched off for the devices most visitors use.

           A PHONE, not the CTA. Three reasons, in order:
             1. The CTA's copy and its 206px width are frozen (D.1) as a hard input to the
                header overflow budget, and changing CTA copy requires a new ADR (D.3). At
                390px the rail gives 342px of content; logo (80) + group gap (32) + 206 + 44
                does not fit. A 44px icon does, with ~138px to spare.
             2. Â§9 already places the phone at the drawer's foot on the grounds that "tapping a
                phone number is the natural, expected act" on mobile. This surfaces that same
                action one tap earlier; it does not introduce a new one.
             3. It is not gated on scroll. `.chrome-actions` deliberately arrives at p â‰¥ 0.5
                because the hero below carries the primary action â€” correct for desktop, but
                the point here is PERSISTENCE. `chrome-nav-color` keeps it legible over both
                the cover and the glass by the same colour-mix the menu trigger uses, so it
                needs no state gating to stay readable. -->
      <div class="flex items-center gap-1 xl:hidden">
        <a
          :href="`tel:${company.phone.replaceAll(' ', '')}`"
          class="chrome-trigger chrome-nav-color"
          :aria-label="locale === 'vi' ? `Gá»i ${company.phone}` : `Call ${company.phone}`"
        >
          <Icon
            name="i-lucide-phone"
            class="h-5 w-5"
          />
        </a>

        <button
          type="button"
          class="chrome-trigger chrome-nav-color"
          :aria-label="locale === 'vi' ? 'Má»Ÿ menu' : 'Open menu'"
          :aria-expanded="drawerOpen"
          @click="emit('openMenu')"
        >
          <Icon
            name="i-lucide-menu"
            class="h-6 w-6"
          />
        </button>
      </div>
    </nav>
  </header>
</template>
```

## app/components/AppDrawer.vue

```vue
<script setup lang="ts">
// Phase 5 â€” the drawer becomes a real modal (docs/header-footer-art-direction.md Â§26.4, Â§33).
//
// Owns: the modal panel, focus trap, Esc, focus return, body scroll lock, page inert, its own
// overlay. Does NOT decide when it may open â€” the header's breakpoint owns that â€” and does not
// render its own nav content: it renders the same `navLinks` (Â§26.4).
//
// Forbidden knowledge (Â§26.4): --header-p, scroll progress, which page it is on.
// Invariant: DRAWER_OPEN âŸ¹ header REVEALED âˆ§ header blur disabled (I4, FG-12) â€” wired by
// app.vue through useHeaderState.setDrawerOpen, which is where the drawer dimension of the
// state machine already lives (Â§5.1). This component never touches chrome state itself.
import { company } from '~/data/company'
import { navLinks, uiText } from '~/data/ui'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: [] }>()

const { locale, t } = useLanguage()
const { isActive } = useActiveLink()

const panelEl = ref<HTMLElement | null>(null)
const overlayEl = ref<HTMLElement | null>(null)
const closeEl = ref<HTMLElement | null>(null)

/** Â§33.6 â€” focus returns to the TRIGGER, always. Captured at open: the element that had focus
 *  when the drawer opened IS the trigger, so the drawer never needs a reference to it â€” which
 *  would be knowledge Â§26.4 does not grant it. */
let returnFocusTo: HTMLElement | null = null

/** Â§33.3 â€” the exact scroll position, restored to the pixel on close. */
let lockedY = 0

/** The page elements made inert while the modal is open â€” captured so they can be restored
 *  exactly, without re-querying a DOM that may have changed. */
let inerted: HTMLElement[] = []

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])'
].join(',')

const focusables = () =>
  panelEl.value ? Array.from(panelEl.value.querySelectorAll<HTMLElement>(FOCUSABLE)) : []

/**
 * Â§33.6 â€” the rest of the page is inert.
 *
 * Derived from the drawer's own siblings rather than a hardcoded `header, main, footer` list:
 * the skip link is a sibling too, and a selector list would silently miss anything app.vue
 * gains later. The drawer's own two roots are excluded â€” they are the modal, not the page.
 *
 * C.2 â€” `inert` is well supported, but the JS focus trap below is implemented REGARDLESS and is
 * never relied on alone.
 */
const setInert = (on: boolean) => {
  if (!on) {
    for (const el of inerted) el.inert = false
    inerted = []
    return
  }
  const parent = panelEl.value?.parentElement
  if (!parent) return
  inerted = Array.from(parent.children).filter(
    (el): el is HTMLElement =>
      el instanceof HTMLElement && el !== panelEl.value && el !== overlayEl.value
  )
  for (const el of inerted) el.inert = true
}

/**
 * Â§33.3 â€” the iOS-safe method. `overflow: hidden` on <body> does NOT reliably lock scroll in
 * iOS Safari, which is a Tier-1 mandatory surface (C.1) and the primary mobile browser for this
 * audience.
 *
 * The header is `position: fixed` and is therefore unaffected by the body becoming fixed. The
 * machine freezes while the drawer is open (I4) â€” without that, the fixed body would report
 * scrollY: 0 and drive the header to COVER *behind* the open drawer (T10).
 */
const lockScroll = () => {
  lockedY = window.scrollY
  const style = document.body.style
  style.position = 'fixed'
  style.top = `-${lockedY}px`
  style.left = '0'
  style.right = '0'
  style.overflow = 'hidden'
}

const unlockScroll = () => {
  const style = document.body.style
  style.position = ''
  style.top = ''
  style.left = ''
  style.right = ''
  style.overflow = ''
  // Restored EXACTLY, with instant (non-smooth) scroll. This is a modal scroll lock, not
  // scroll-jacking (Â§6.5) â€” the distinction is consent: the user opened a modal.
  window.scrollTo(0, lockedY)
}

const onKeydown = (event: KeyboardEvent) => {
  // Â§33.6 â€” Esc closes the drawer, from anywhere within it.
  if (event.key === 'Escape') {
    event.preventDefault()
    emit('close')
    return
  }

  // Â§33.6 â€” Tab / Shift+Tab cycle WITHIN the panel.
  if (event.key !== 'Tab') return

  const items = focusables()
  if (!items.length) return

  const first = items[0]!
  const last = items[items.length - 1]!
  const active = document.activeElement
  const inside = panelEl.value?.contains(active) ?? false

  if (event.shiftKey && (!inside || active === first)) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && (!inside || active === last)) {
    event.preventDefault()
    first.focus()
  }
}

watch(() => props.open, async (open) => {
  if (!import.meta.client) return

  if (open) {
    returnFocusTo = document.activeElement as HTMLElement | null
    lockScroll()
    await nextTick() // the panel does not exist until the Transition has rendered it
    setInert(true)
    // Â§33.6 â€” focus moves to the close button.
    closeEl.value?.focus()
    document.addEventListener('keydown', onKeydown)
    return
  }

  document.removeEventListener('keydown', onKeydown)
  // Order is load-bearing: an inert element cannot receive focus, and unlocking scroll moves
  // the viewport â€” so uninert, restore the exact position, and only then hand focus back.
  setInert(false)
  unlockScroll()
  returnFocusTo?.focus({ preventScroll: true })
  returnFocusTo = null
})

// A.5 â€” zero retained listeners after unmount, and never leave the page locked or inert.
onScopeDispose(() => {
  if (!import.meta.client) return
  document.removeEventListener('keydown', onKeydown)
  setInert(false)
  if (props.open) unlockScroll()
})
</script>

<template>
  <!-- The overlay is aria-hidden and non-focusable: it sits OUTSIDE the panel, so a focusable
       overlay would be a tab stop the trap cannot reach â€” it would break "Tab cycles within the
       panel" (Â§33.6). Esc and the close button are the accessible paths; the click is a
       pointer convenience on top of them. -->
  <Transition name="drawer-overlay">
    <div
      v-if="open"
      ref="overlayEl"
      class="app-drawer-overlay xl:hidden"
      aria-hidden="true"
      @click="emit('close')"
    />
  </Transition>

  <Transition name="drawer-panel">
    <div
      v-if="open"
      ref="panelEl"
      class="app-drawer xl:hidden"
      role="dialog"
      aria-modal="true"
      :aria-label="t({ vi: 'Menu Ä‘iá»u hÆ°á»›ng', en: 'Navigation menu' })"
    >
      <div class="app-drawer-head">
        <!-- Â§35 â€” reuses the header's mono-ink asset: same URL, already cached, zero extra
             request. Explicit width/height, like both header logos (FG-15). -->
        <img
          src="/logo-mono-ink.png"
          alt="Lai Huy Interior"
          width="424"
          height="212"
          class="app-drawer-logo"
        >
        <button
          ref="closeEl"
          type="button"
          class="drawer-close"
          :aria-label="locale === 'vi' ? 'ÄÃ³ng menu' : 'Close menu'"
          @click="emit('close')"
        >
          <Icon
            name="i-lucide-x"
            class="h-5 w-5"
          />
        </button>
      </div>

      <nav
        class="app-drawer-body"
        :aria-label="t({ vi: 'Äiá»u hÆ°á»›ng chÃ­nh', en: 'Main navigation' })"
      >
        <NuxtLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="drawer-link"
          :aria-current="isActive(link.to) ? 'page' : undefined"
        >
          {{ t(link.label) }}
        </NuxtLink>
      </nav>

      <!-- Â§9 â€” phone + CTA sit at the drawer's foot, where tapping a phone number is the
           natural, expected act. The phone is not "restored" on mobile; mobile is where it
           belongs. Â§33.2 keeps them clear of the home indicator.

           The phone is now here ONLY: the O3 resolution removed it from the desktop
           NAVIGATION row, which could not fit it in Vietnamese at 1280. Phase 1 extracted a
           drawer that never had one, so this also closes a Â§9/Â§33.2 gap that predates it. -->
      <div class="app-drawer-foot">
        <AppLangToggle
          class="mb-4"
          surface="light"
        />
        <a
          :href="`tel:${company.phone.replaceAll(' ', '')}`"
          class="drawer-phone mb-4 block"
        >
          {{ company.phone }}
        </a>
        <NuxtLink
          to="/lien-he"
          class="btn-dark w-full"
        >
          {{ t(uiText.cta.quote24h) }}
        </NuxtLink>
      </div>
    </div>
  </Transition>
</template>
```

## app/components/AppFooter.vue

```vue
<script setup lang="ts">
// The footer, rebuilt to docs/design/footer-reference.png.
//
// FOUR BANDS, each with exactly one job:
//   1. Brand + Navigation + Services + Contact   (4 columns)
//   2. Office + Factory addresses                (2 columns)
//   3. Trust strip                               (4 items)
//   4. Copyright + Facebook + Legal              (3 groups)
//
// The previous revision had the same four blocks grouped differently: the masthead owned a
// full-width band of its own, the trust signals were a fourth column of the index, and the
// addresses sat in band 3. Folding the masthead into column 1 is what makes the footer shorter â€”
// its height is now absorbed by the tallest of the three list columns beside it instead of being
// added on top of them.
//
// PURELY PRESENTATIONAL (Â§26.3, Â§30.2). No state, no composable, no lifecycle hooks. Forbidden
// knowledge: scroll position, header state, route â€” everything. The `navRows` computation that
// used to live here is gone with the two-column navigation split, so the component is back to
// zero logic, which is the contract this file is supposed to hold.
import { company } from '~/data/company'
import { legalLinks, navLinks, uiText } from '~/data/ui'

const { t, ta } = useLanguage()
</script>

<template>
  <footer class="app-footer">
    <div class="shell">
      <!-- â”€â”€ BAND 1 â€” BRAND Â· NAVIGATION Â· SERVICES Â· CONTACT â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
           Four columns, divided by hairlines. Column 1 carries the whole brand statement
           (logo, positioning, ONE action); columns 2-4 are three lists under wood eyebrows.

           ONE action, not two. The second used to be `uiText.cta.factory` -> /nha-xuong, the
           character-for-character same label as the secondary action in the `.section-cta` band
           directly above the footer on six of eight pages. /nha-xuong is reachable from the
           navigation column immediately to the right. -->
      <div class="footer-primary">
        <div class="footer-brand">
          <!-- Â§35 â€” below fold, always: lazy + fetchpriority auto. Explicit width/height like
               every other logo in the system (FG-15). -->
          <img
            src="/logo-mono-white.png"
            alt="Lai Huy Interior"
            width="424"
            height="212"
            loading="lazy"
            fetchpriority="auto"
            class="footer-logo"
          >

          <p class="footer-statement">
            {{ t(company.positioning) }}
          </p>

          <NuxtLink
            to="/lien-he"
            class="btn-primary footer-cta"
          >
            {{ t(uiText.cta.contact) }}
          </NuxtLink>
        </div>

        <!-- The landmark takes its accessible name FROM the visible heading rather than a
             duplicated aria-label, so the two can never drift apart under translation.
             Heading levels stay at h2 deliberately: footer column labels at h2 sit alongside
             the page's content sections, which is what makes them reachable by heading
             navigation. Demoting them would only make them harder to find. -->
        <nav
          class="footer-col"
          aria-labelledby="footer-nav-heading"
        >
          <h2
            id="footer-nav-heading"
            class="footer-eyebrow"
          >
            {{ t(uiText.labels.navigation) }}
          </h2>
          <!-- Single file, all seven. The previous revision split these into two sub-columns to
               buy back height; the reference sets them in one column, and the fold of the
               masthead into column 1 is what pays for that height now. -->
          <ul class="footer-list">
            <li
              v-for="link in navLinks"
              :key="link.to"
            >
              <NuxtLink
                :to="link.to"
                class="footer-link"
              >
                {{ t(link.label) }}
              </NuxtLink>
            </li>
          </ul>
        </nav>

        <div class="footer-col">
          <h2 class="footer-eyebrow">
            {{ t(uiText.labels.services) }}
          </h2>
          <!-- These are LINKS, not labels. Five items that look like navigation and do nothing
               is a dead end. /dich-vu has no per-service anchors, so all five resolve to the
               page itself. -->
          <ul class="footer-list">
            <li
              v-for="service in ta(company.footerServices)"
              :key="service"
            >
              <NuxtLink
                to="/dich-vu"
                class="footer-link"
              >
                {{ service }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <div class="footer-col">
          <h2 class="footer-eyebrow">
            {{ t(uiText.labels.contact) }}
          </h2>
          <!-- Still a description list â€” these are label/value pairs â€” but the label is now
               carried by a GLYPH plus a screen-reader-only string rather than an uppercase
               eyebrow above each value, which is what the reference shows and what lets three
               contact channels occupy three lines instead of six.
               The visually-hidden text is what keeps this honest: a sighted reader gets the
               icon, a screen reader still hears "Äiá»‡n thoáº¡i: +84 903 102 012" rather than a
               bare number with no field name. -->
          <dl class="footer-contact">
            <div>
              <dt>
                <Icon
                  name="i-lucide-phone"
                  class="footer-contact-icon"
                  aria-hidden="true"
                />
                <span class="sr-only">{{ t(uiText.labels.phone) }}</span>
              </dt>
              <dd>
                <a
                  :href="`tel:${company.phone.replaceAll(' ', '')}`"
                  class="footer-link footer-link-lead"
                >
                  {{ company.phone }}
                </a>
              </dd>
            </div>

            <div>
              <dt>
                <Icon
                  name="i-lucide-mail"
                  class="footer-contact-icon"
                  aria-hidden="true"
                />
                <span class="sr-only">{{ t(uiText.labels.email) }}</span>
              </dt>
              <dd>
                <a
                  :href="`mailto:${company.email}`"
                  class="footer-link footer-link-lead"
                >
                  {{ company.email }}
                </a>
              </dd>
            </div>

            <div>
              <dt>
                <Icon
                  name="i-lucide-clock"
                  class="footer-contact-icon"
                  aria-hidden="true"
                />
                <span class="sr-only">{{ t(uiText.labels.workingHours) }}</span>
              </dt>
              <dd class="footer-value">
                <span
                  v-for="line in ta(company.workingHours)"
                  :key="line"
                  class="block"
                >
                  {{ line }}
                </span>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <!-- â”€â”€ BAND 2 â€” WHERE THE COMPANY PHYSICALLY IS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
           Two equal halves, divided by one hairline. Each is a large wood glyph beside a title
           and an address â€” the icon is the block's only ornament, and it differs per entry
           (pin / factory, bound from `address.icon`) so it carries information rather than
           decorating two identical rows.

           The address is ONE string and stays one string: it wraps to two lines because it is
           long, not because it has been split into fields. -->
      <dl class="footer-locations">
        <!-- The wrapper <div> contains ONLY <dt> and <dd>. That is a hard requirement, not a
             style preference: a <dl> may only directly contain dt/dd groups (optionally wrapped
             one level deep in a div), and an earlier revision of this band nested the pair
             inside a second div with the glyph as its sibling â€” which broke the list into
             orphaned dt/dd elements and tripped three axe rules (definition-list, dlitem,
             only-dlitems) on all eight pages.
             The glyph therefore lives INSIDE the <dt>, where it is phrasing content and legal,
             and is lifted out of the text flow by absolute positioning so it can still sit
             centred against the whole two-line block. See `.footer-place-icon`. -->
        <div
          v-for="address in company.addresses"
          :key="address.label.vi"
        >
          <dt class="footer-place-title">
            <Icon
              :name="address.icon"
              class="footer-place-icon"
              aria-hidden="true"
            />
            {{ t(address.label) }}
          </dt>
          <dd>
            <a
              :href="address.mapUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="footer-link"
            >
              {{ t(address.address) }}
            </a>
          </dd>
        </div>
      </dl>

      <!-- â”€â”€ BAND 3 â€” TRUST STRIP â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
           Four equal items, glyph + short label, divided by hairlines. No heading, no
           description, no card, no shadow, no per-item background: four identical quiet cells
           read as guarantees precisely because nothing frames them.

           Content is bound, never authored. `company.trustSignals` restates claims the site
           already publishes, with the glyphs /gioi-thieu already assigns to them â€” one claim,
           one glyph, site-wide. A footer that invents credentials is worse than one that omits
           them. -->
      <ul class="footer-trust">
        <li
          v-for="signal in company.trustSignals"
          :key="signal.icon"
        >
          <Icon
            :name="signal.icon"
            class="footer-trust-icon"
            aria-hidden="true"
          />
          <span>{{ t(signal.label) }}</span>
        </li>
      </ul>

      <!-- â”€â”€ BAND 4 â€” BOTTOM BAR â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
           Three groups: copyright, Facebook, legal. The middle group is CENTRED on the rail and
           stays centred at every width â€” the grid is `1fr auto 1fr`, so the centre cell is
           positioned by the rail rather than by the width of the two groups flanking it. That
           is the whole point of the band: earlier revisions put Facebook at the far right edge
           (`space-between`) where it read as an object marooned in ~1,000px of void. -->
      <div class="footer-meta">
        <p class="footer-copyright">
          &copy; {{ new Date().getFullYear() }} {{ company.name }}. {{ t(uiText.labels.rightsReserved) }}
        </p>

        <div class="footer-social">
          <a
            :href="company.facebook"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon
              name="i-simple-icons-facebook"
              class="footer-social-icon"
              aria-hidden="true"
            />
            <span>Facebook</span>
          </a>
        </div>

        <!-- Driven by `legalLinks`, so a third document is a data change and needs no template
             or CSS work. Both entries resolve to real prerendered routes. -->
        <ul class="footer-legal">
          <li
            v-for="link in legalLinks"
            :key="link.to"
          >
            <NuxtLink :to="link.to">
              {{ t(link.label) }}
            </NuxtLink>
          </li>
        </ul>
      </div>
    </div>
  </footer>
</template>
```
