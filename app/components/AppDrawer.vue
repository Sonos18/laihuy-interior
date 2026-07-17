<script setup lang="ts">
// Phase 5 — the drawer becomes a real modal (docs/header-footer-art-direction.md §26.4, §33).
//
// Owns: the modal panel, focus trap, Esc, focus return, body scroll lock, page inert, its own
// overlay. Does NOT decide when it may open — the header's breakpoint owns that — and does not
// render its own nav content: it renders the same `navLinks` (§26.4).
//
// Forbidden knowledge (§26.4): --header-p, scroll progress, which page it is on.
// Invariant: DRAWER_OPEN ⟹ header REVEALED ∧ header blur disabled (I4, FG-12) — wired by
// app.vue through useHeaderState.setDrawerOpen, which is where the drawer dimension of the
// state machine already lives (§5.1). This component never touches chrome state itself.
import { company } from '~/data/company'
import { navLinks, uiText } from '~/data/ui'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: [] }>()

const { locale, t } = useLanguage()
const { isActive } = useActiveLink()

const panelEl = ref<HTMLElement | null>(null)
const overlayEl = ref<HTMLElement | null>(null)
const closeEl = ref<HTMLElement | null>(null)

/** §33.6 — focus returns to the TRIGGER, always. Captured at open: the element that had focus
 *  when the drawer opened IS the trigger, so the drawer never needs a reference to it — which
 *  would be knowledge §26.4 does not grant it. */
let returnFocusTo: HTMLElement | null = null

/** §33.3 — the exact scroll position, restored to the pixel on close. */
let lockedY = 0

/** The page elements made inert while the modal is open — captured so they can be restored
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
 * §33.6 — the rest of the page is inert.
 *
 * Derived from the drawer's own siblings rather than a hardcoded `header, main, footer` list:
 * the skip link is a sibling too, and a selector list would silently miss anything app.vue
 * gains later. The drawer's own two roots are excluded — they are the modal, not the page.
 *
 * C.2 — `inert` is well supported, but the JS focus trap below is implemented REGARDLESS and is
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
 * §33.3 — the iOS-safe method. `overflow: hidden` on <body> does NOT reliably lock scroll in
 * iOS Safari, which is a Tier-1 mandatory surface (C.1) and the primary mobile browser for this
 * audience.
 *
 * The header is `position: fixed` and is therefore unaffected by the body becoming fixed. The
 * machine freezes while the drawer is open (I4) — without that, the fixed body would report
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
  // scroll-jacking (§6.5) — the distinction is consent: the user opened a modal.
  window.scrollTo(0, lockedY)
}

const onKeydown = (event: KeyboardEvent) => {
  // §33.6 — Esc closes the drawer, from anywhere within it.
  if (event.key === 'Escape') {
    event.preventDefault()
    emit('close')
    return
  }

  // §33.6 — Tab / Shift+Tab cycle WITHIN the panel.
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
    // §33.6 — focus moves to the close button.
    closeEl.value?.focus()
    document.addEventListener('keydown', onKeydown)
    return
  }

  document.removeEventListener('keydown', onKeydown)
  // Order is load-bearing: an inert element cannot receive focus, and unlocking scroll moves
  // the viewport — so uninert, restore the exact position, and only then hand focus back.
  setInert(false)
  unlockScroll()
  returnFocusTo?.focus({ preventScroll: true })
  returnFocusTo = null
})

// A.5 — zero retained listeners after unmount, and never leave the page locked or inert.
onScopeDispose(() => {
  if (!import.meta.client) return
  document.removeEventListener('keydown', onKeydown)
  setInert(false)
  if (props.open) unlockScroll()
})
</script>

<template>
  <!-- The overlay is aria-hidden and non-focusable: it sits OUTSIDE the panel, so a focusable
       overlay would be a tab stop the trap cannot reach — it would break "Tab cycles within the
       panel" (§33.6). Esc and the close button are the accessible paths; the click is a
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
      :aria-label="t({ vi: 'Menu điều hướng', en: 'Navigation menu' })"
    >
      <div class="app-drawer-head">
        <!-- §35 — reuses the header's mono-ink asset: same URL, already cached, zero extra
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
          :aria-label="locale === 'vi' ? 'Đóng menu' : 'Close menu'"
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
        :aria-label="t({ vi: 'Điều hướng chính', en: 'Main navigation' })"
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

      <!-- §9 — phone + CTA sit at the drawer's foot, where tapping a phone number is the
           natural, expected act. The phone is not "restored" on mobile; mobile is where it
           belongs. §33.2 keeps them clear of the home indicator.

           The phone is now here ONLY: the O3 resolution removed it from the desktop
           NAVIGATION row, which could not fit it in Vietnamese at 1280. Phase 1 extracted a
           drawer that never had one, so this also closes a §9/§33.2 gap that predates it. -->
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
