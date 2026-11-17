<script setup lang="ts">
// The contact action bar (owner, 2026-11-15): Gọi / Zalo / Gửi bản vẽ, pinned to the foot of the
// viewport below 1024px, where the header carries no CTA and hides on scroll down. DESIGN.md
// "Navigation", Action bar.
//
// Visible only once the page has scrolled past most of its first screen (the hero carries its
// own actions), and never while: the footer is on screen (it lists the same channels), the drawer
// is open, a form field has focus (the on-screen keyboard), or the visitor is on /lien-he.
//
// Hot path: one passive scroll listener, rAF-coalesced, reading scrollY and innerHeight only;
// the footer is watched by an IntersectionObserver, never measured.
import { company } from '~/data/company'
import { uiText } from '~/data/ui'

const { t, localePath } = useLanguage()
const route = useRoute()
const { drawerOpen } = useHeaderState()

const phoneHref = `tel:${company.phone.replaceAll(' ', '')}`

const pastFold = ref(false)
const footerInView = ref(false)
const fieldFocused = ref(false)

const visible = computed(() =>
  pastFold.value
  && !footerInView.value
  && !fieldFocused.value
  && !drawerOpen.value
  && stripLocalePrefix(route.path) !== '/lien-he'
)

/** Share of the first screen to scroll past before the bar arrives. */
const FOLD_RATIO = 0.6

const isField = (target: EventTarget | null) =>
  target instanceof HTMLElement && target.matches('input, textarea, select, [contenteditable="true"]')

let frame = 0
let observer: IntersectionObserver | undefined

const measure = () => {
  frame = 0
  pastFold.value = window.scrollY > window.innerHeight * FOLD_RATIO
}

const onScroll = () => {
  if (!frame) frame = requestAnimationFrame(measure)
}

const onFocusIn = (event: FocusEvent) => {
  fieldFocused.value = isField(event.target)
}

const onFocusOut = () => {
  fieldFocused.value = false
}

const observeFooter = () => {
  observer?.disconnect()
  const footer = document.querySelector('footer')
  if (!footer) return
  observer = new IntersectionObserver(([entry]) => {
    footerInView.value = Boolean(entry?.isIntersecting)
  })
  observer.observe(footer)
}

onMounted(() => {
  // Deferred to the next frame, never read during mount: reading layout here forces a style
  // flush in the middle of the header's hydration hand-off (useHeaderState), which then plays
  // the lang toggle's colour transition on pinned routes (warm-canvas WARM-08).
  onScroll()
  observeFooter()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll, { passive: true })
  document.addEventListener('focusin', onFocusIn)
  document.addEventListener('focusout', onFocusOut)
})

// A new page starts at its top: re-read the position once the route has painted.
watch(() => route.fullPath, () => nextTick(onScroll))

onBeforeUnmount(() => {
  if (frame) cancelAnimationFrame(frame)
  observer?.disconnect()
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onScroll)
  document.removeEventListener('focusin', onFocusIn)
  document.removeEventListener('focusout', onFocusOut)
})
</script>

<template>
  <nav
    class="action-bar"
    data-testid="action-bar"
    data-track-location="action-bar"
    :data-visible="visible ? 'on' : 'off'"
    :aria-label="t(uiText.actionBar.label)"
    :inert="!visible"
    :aria-hidden="!visible"
  >
    <a
      :href="phoneHref"
      class="action-bar__item"
      :aria-label="t(uiText.labels.callNow)"
    >
      <Icon
        name="i-lucide-phone"
        class="action-bar__icon"
        aria-hidden="true"
      />
      <span>{{ t(uiText.actionBar.call) }}</span>
    </a>
    <a
      :href="company.zalo"
      target="_blank"
      rel="noopener noreferrer"
      class="action-bar__item"
      :aria-label="t(uiText.labels.chatZalo)"
    >
      <Icon
        name="lh:zalo"
        class="action-bar__icon"
        aria-hidden="true"
      />
      <span>Zalo</span>
    </a>
    <NuxtLink
      :to="localePath('/lien-he#cach-gui-ho-so')"
      class="action-bar__primary"
    >
      <Icon
        name="i-lucide-file-up"
        class="action-bar__icon"
        aria-hidden="true"
      />
      <span>{{ t(uiText.actionBar.sendDrawings) }}</span>
    </NuxtLink>
  </nav>
</template>

<style scoped>
/* Floating chrome, the sibling of the floating header bar: the same Obsidian glass, white
   hairline and 16px corner, inset 8px from the viewport edges, at the foot instead of the top. */
.action-bar {
  position: fixed;
  right: var(--header-float-inset);
  bottom: calc(var(--header-float-inset) + env(safe-area-inset-bottom, 0px));
  left: var(--header-float-inset);
  z-index: var(--z-action-bar);
  display: grid;
  grid-template-columns: 1fr 1fr 1.6fr;
  gap: 0.25rem;
  align-items: center;
  height: 3.5rem;
  padding: 0.375rem;
  border: 1px solid var(--rule-chrome-float);
  border-radius: 1rem;
  background: var(--surface-chrome-float);
  -webkit-backdrop-filter: blur(16px);
  backdrop-filter: blur(16px);
  color: rgb(255 255 255 / 0.92);
  transform: translateY(calc(100% + var(--header-float-inset) + 1rem));
  visibility: hidden;
  transition:
    transform var(--dur-state) var(--ease-exit),
    visibility 0s linear var(--dur-state);
}

.action-bar[data-visible="on"] {
  transform: none;
  visibility: visible;
  transition:
    transform var(--dur-state) var(--ease-editorial),
    visibility 0s;
}

.action-bar__item,
.action-bar__primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-height: 2.75rem;
  border-radius: 9999px;
  font-size: 0.8125rem;
  font-weight: 600;
  line-height: 1;
  white-space: nowrap;
  transition:
    background-color var(--dur-hover) var(--ease-editorial),
    transform 160ms var(--ease-editorial);
}

.action-bar__item:active,
.action-bar__primary:active {
  transform: scale(0.97);
}

.action-bar__item:hover {
  background-color: rgb(255 255 255 / 0.08);
}

.action-bar__primary {
  border: 1px solid var(--bronze);
  background-color: var(--bronze);
  color: var(--color-obsidian);
}

.action-bar__primary:hover {
  background-color: var(--bronze-light);
}

.action-bar__item:focus-visible,
.action-bar__primary:focus-visible {
  outline: 2px solid var(--bronze);
  outline-offset: 2px;
}

.action-bar__icon {
  width: 1.125rem;
  height: 1.125rem;
  flex: 0 0 auto;
}

@media (min-width: 1024px) {
  .action-bar {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .action-bar,
  .action-bar[data-visible="on"],
  .action-bar__item,
  .action-bar__primary {
    transition: none;
  }

  .action-bar__item:active,
  .action-bar__primary:active {
    transform: none;
  }
}

@media print {
  .action-bar {
    display: none;
  }
}
</style>
