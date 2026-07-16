<script setup lang="ts">
// Phase 1 — pure extraction from app.vue. DOM, classes, behaviour unchanged.
// The redesign lands in Phase 4 (docs/header-footer-art-direction.md §5).
import { company } from '~/data/company'
import { navLinks, uiText } from '~/data/ui'

const emit = defineEmits<{ openMenu: [] }>()

const { locale, t } = useLanguage()
const { isActive } = useActiveLink()

const isScrolled = ref(false)

const onScroll = () => {
  isScrolled.value = window.scrollY > 40
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<template>
  <header
    class="fixed inset-x-0 top-0 z-50 border-b transition-all duration-300"
    :class="[
      isScrolled
        ? 'border-ink-200 bg-white/95 text-ink-950 shadow-sm backdrop-blur-md'
        : 'border-white/10 bg-ink-950/10 text-white backdrop-blur-sm'
    ]"
  >
    <nav class="section-shell flex h-20 items-center justify-between px-6">
      <NuxtLink
        to="/"
        class="flex shrink-0 items-center gap-3"
        aria-label="Lai Huy Interior"
      >
        <img
          src="/logo-white.png"
          alt="Lai Huy Interior"
          class="h-16 w-auto md:h-[4.5rem]"
        >
      </NuxtLink>

      <div class="hidden items-center gap-1 lg:flex">
        <NuxtLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="px-3 py-2 text-sm font-semibold transition-colors"
          :class="[
            isActive(link.to)
              ? isScrolled ? 'text-wood-600' : 'text-white'
              : isScrolled ? 'text-ink-600 hover:text-wood-600' : 'text-white/72 hover:text-white'
          ]"
        >
          {{ t(link.label) }}
        </NuxtLink>
      </div>

      <div class="hidden items-center gap-3 lg:flex">
        <AppLangToggle :surface="isScrolled ? 'light' : 'dark'" />
        <a
          :href="`tel:${company.phone.replaceAll(' ', '')}`"
          class="text-sm font-bold"
          :class="isScrolled ? 'text-ink-800' : 'text-white'"
        >
          {{ company.phone }}
        </a>
        <NuxtLink
          to="/lien-he"
          class="btn-primary py-3"
        >
          {{ t(uiText.cta.quote24h) }}
        </NuxtLink>
      </div>

      <button
        type="button"
        class="p-2 lg:hidden"
        :class="isScrolled ? 'text-ink-950' : 'text-white'"
        :aria-label="locale === 'vi' ? 'Mở menu' : 'Open menu'"
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
