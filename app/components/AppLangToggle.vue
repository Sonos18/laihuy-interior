<script setup lang="ts">
// Phase 1 — pure extraction from AppHeader + AppDrawer. DOM, classes, behaviour unchanged.
// The a11y contract (role="group", aria-pressed, no `disabled` on the active option) lands in
// Phase 5 (docs/header-footer-art-direction.md §26.5, §32.1) — deliberately NOT added here, so
// this stays a pure refactor. The bare <div aria-label> below is a known live defect (§11).
//
// This component exists because its logic was duplicated between the header and the drawer (§2).
import { localeOptions, uiText } from '~/data/ui'

// `surface` is a prop, never a detection — the parent knows the surface, the child is told (§26.5).
//
// §26.5 specifies 'dark' | 'light'. There are three values here because the drawer's toggle is
// drawn differently from the scrolled header's TODAY: px-4 py-2 vs px-3 py-1.5, bg-ink-50 vs
// bg-white, and no hover state. That drift is pre-existing; Phase 1 preserves it verbatim rather
// than unifying it, because unifying it would change pixels. Phase 5/6 collapses 'drawer' into
// 'light' once the §29 tokens exist — at which point this prop matches §26.5 exactly.
const props = defineProps<{ surface: 'dark' | 'light' | 'drawer' }>()

const { locale, setLocale, t } = useLanguage()

const surfaces = {
  dark: {
    container: 'border-white/20 bg-white/8',
    item: 'px-3 py-1.5',
    active: 'bg-white text-ink-950',
    inactive: 'text-white/62 hover:text-white'
  },
  light: {
    container: 'border-ink-200 bg-white',
    item: 'px-3 py-1.5',
    active: 'bg-ink-950 text-white',
    inactive: 'text-ink-500 hover:text-ink-950'
  },
  drawer: {
    container: 'border-ink-200 bg-ink-50',
    item: 'px-4 py-2',
    active: 'bg-ink-950 text-white',
    inactive: 'text-ink-500'
  }
} as const

const style = computed(() => surfaces[props.surface])
</script>

<template>
  <div
    class="inline-flex rounded-full border p-1"
    :class="style.container"
    :aria-label="t(uiText.language)"
  >
    <button
      v-for="option in localeOptions"
      :key="option.value"
      type="button"
      class="rounded-full text-xs font-black transition-colors"
      :class="[style.item, locale === option.value ? style.active : style.inactive]"
      @click="setLocale(option.value)"
    >
      {{ option.label }}
    </button>
  </div>
</template>
