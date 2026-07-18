<script setup lang="ts">
// Phase 4 — the header is part of the cover, not a bar above it (§1).
// At rest it owns no background, no border and no blur — only a scrim that protects
// legibility (§5.2). It is the signature on the photograph.
//
// This component owns MARKUP only. Scroll state, direction, visibility, route hooks and every
// CSS-var write belong to useHeaderState (§2, §26.1, §27). Forbidden knowledge (§26.1): the
// current route, hero mode/atmosphere/focal, whether a hero exists, any page's DOM, and its own
// height in pixels — it reads --header-h.
import { navLinks, uiText } from '~/data/ui'

const props = withDefaults(defineProps<{
  /**
   * I9 escape hatch, and the ONLY prop this component has (§26.1). A page that cannot open with
   * a dark cover must opt into permanent NAVIGATION chrome. Also the §28.4 kill switch: `solid`
   * globally reproduces a conventional, accessible header on every page.
   */
  solid?: boolean
}>(), { solid: false })

const emit = defineEmits<{ openMenu: [] }>()

const { locale, t } = useLanguage()
const { isActive } = useActiveLink()
const { register, setSolid, chromeState, drawerOpen } = useHeaderState()

const headerEl = ref<HTMLElement | null>(null)

// §34.1 — the first measurement runs synchronously in onMounted, before paint.
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
         additive: α_scrim + α_glass ≤ 1 at every p (I7). -->
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
      :aria-label="t({ vi: 'Điều hướng chính', en: 'Main navigation' })"
    >
      <NuxtLink
        to="/"
        class="chrome-logo"
        aria-label="Lai Huy Interior"
      >
        <!-- §35 — mono-white is in the LCP viewport and must never pop in after the cover.
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

      <!-- §9 — the desktop nav breakpoint is `xl`, not `lg`. A narrative decision, not a width
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
        <!-- §9 — VI/EN is part of the masthead at rest. Phone and CTA are not: the hero below
             already carries the single primary action. They arrive on scroll. -->
        <AppLangToggle :surface="chromeState === 'nav' ? 'light' : 'dark'" />

        <!-- I8 — never tab into an invisible control. `opacity: 0` alone is not hiding (FG-09):
             inert + aria-hidden while p < 0.5.

             O3 RESOLUTION: the phone is NOT here. The VI NAVIGATION row needed 1421px against
             1216px at 1280 (−205px, where V11 requires +8px), and FG-16's sanctioned levers
             could not close it. The phone moved to the drawer's foot — where §9 says it belongs
             ("mobile is where it belongs") — and the CTA stays, because §9 calls it the action
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

      <button
        type="button"
        class="chrome-trigger chrome-nav-color xl:hidden"
        :aria-label="locale === 'vi' ? 'Mở menu' : 'Open menu'"
        :aria-expanded="drawerOpen"
        @click="emit('openMenu')"
      >
        <Icon
          name="i-lucide-menu"
          class="h-6 w-6"
        />
      </button>
    </nav>
  </header>
</template>
