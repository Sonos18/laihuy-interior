<script setup lang="ts">
// Phase 1 — pure extraction from app.vue. DOM, classes, transitions, behaviour unchanged.
// The modal contract (focus trap, Esc, aria-modal, inert, focus return) lands in Phase 5
// (docs/header-footer-art-direction.md §26.4, §33) — it is deliberately NOT added here, so
// this commit stays a pure refactor.
import { localeOptions, navLinks, uiText } from '~/data/ui'

// Plain prop + emit, deliberately NOT defineModel. defineModel derives its value from the
// prop, so `watch(open, ...)` would fire a component-update cycle later than the original
// `watch(isMobileMenuOpen, ...)` in app.vue. Behaviour preservation outranks API modernisation
// in a pure extraction — so the ref and both its watchers stay where they were.
defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: [] }>()

const { locale, setLocale, t } = useLanguage()
const { isActive } = useActiveLink()
</script>

<template>
  <Transition name="fade">
    <button
      v-if="open"
      type="button"
      class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
      :aria-label="locale === 'vi' ? 'Đóng menu' : 'Close menu'"
      @click="emit('close')"
    />
  </Transition>

  <Transition name="slide-right">
    <nav
      v-if="open"
      class="fixed bottom-0 right-0 top-0 z-50 flex w-84 max-w-[88vw] flex-col bg-white shadow-2xl lg:hidden"
    >
      <div class="flex items-center justify-between border-b border-ink-100 p-6">
        <img
          src="/logo.png"
          alt="Lai Huy Interior"
          class="h-9 w-auto"
        >
        <button
          type="button"
          class="p-2 text-ink-500"
          :aria-label="locale === 'vi' ? 'Đóng menu' : 'Close menu'"
          @click="emit('close')"
        >
          <Icon
            name="i-lucide-x"
            class="h-5 w-5"
          />
        </button>
      </div>

      <div class="flex-1 space-y-1 px-6 py-6">
        <NuxtLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="block border-b border-ink-100 py-4 text-base font-bold"
          :class="isActive(link.to) ? 'text-wood-600' : 'text-ink-800'"
        >
          {{ t(link.label) }}
        </NuxtLink>
      </div>

      <div class="border-t border-ink-100 p-6">
        <div
          class="mb-4 inline-flex rounded-full border border-ink-200 bg-ink-50 p-1"
          :aria-label="t(uiText.language)"
        >
          <button
            v-for="option in localeOptions"
            :key="option.value"
            type="button"
            class="rounded-full px-4 py-2 text-xs font-black transition-colors"
            :class="locale === option.value ? 'bg-ink-950 text-white' : 'text-ink-500'"
            @click="setLocale(option.value)"
          >
            {{ option.label }}
          </button>
        </div>
        <NuxtLink
          to="/lien-he"
          class="btn-dark w-full"
        >
          {{ t(uiText.cta.quote24h) }}
        </NuxtLink>
      </div>
    </nav>
  </Transition>
</template>
