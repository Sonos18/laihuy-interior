<script setup lang="ts">
// Phase 5 — the a11y contract lands (docs/header-footer-art-direction.md §26.5, §32, §32.1).
//
// This component exists because its logic was duplicated between the header and the drawer (§2).
// Re-duplicating it is a regression, not a shortcut.
//
// Owns: rendering VI/EN, calling setLocale, role="group" + aria-pressed.
// Does NOT own: locale state (that is useLanguage), or styling itself for a surface.
// Forbidden knowledge (§26.5): header state, scroll, route.
import { localeOptions, uiText } from '~/data/ui'

// `surface` is a PROP, never a detection — the toggle must never inspect its own background to
// decide its colour. The parent knows the surface; the child is told (§26.5).
//
// Phase 1 carried a third value, 'drawer', because the drawer's toggle was drawn differently
// from the scrolled header's (px-4 py-2 vs px-3 py-1.5, bg-ink-50 vs bg-white, no hover). That
// drift was pre-existing and preserved verbatim so the extraction stayed pixel-identical. The
// §29 tokens now exist, so 'drawer' collapses into 'light' and the prop matches §26.5 exactly.
defineProps<{ surface: 'dark' | 'light' }>()

const { locale, setLocale, t } = useLanguage()
</script>

<template>
  <!-- §11 — role="group" is what makes the label real: the aria-label previously sat on a bare
       <div>, where assistive tech ignores it. That was a live defect, not a new requirement. -->
  <div
    class="lang-toggle"
    :class="`lang-toggle-${surface}`"
    role="group"
    :aria-label="t(uiText.language)"
  >
    <!-- §32.1 — NO chrome control is ever `disabled`, not even the currently-active language:
         `disabled` removes an element from the tab order and from most screen readers, so a
         VI-speaking user on the VI locale would find the language control had vanished. The
         active option stays focusable and carries aria-pressed="true". -->
    <button
      v-for="option in localeOptions"
      :key="option.value"
      type="button"
      class="lang-option"
      :aria-pressed="locale === option.value"
      @click="setLocale(option.value)"
    >
      {{ option.label }}
    </button>
  </div>
</template>
