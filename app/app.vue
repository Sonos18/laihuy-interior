<script setup lang="ts">
import { company } from '~/data/company'
import { navLinks, uiText } from '~/data/ui'

const { locale, setLocale, t, ta } = useLanguage()

useHead({
  meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
  link: [{ rel: 'icon', href: '/logo_favicon.png' }],
  htmlAttrs: {
    lang: locale
  }
})

const title = computed(() => t(company.seo.home.title))
const description = computed(() => t(company.seo.home.description))

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogImage: company.seo.home.ogImage,
  twitterCard: 'summary_large_image'
})

const route = useRoute()
const isScrolled = ref(false)
const isMobileMenuOpen = ref(false)

const localeOptions = [
  { label: 'VI', value: 'vi' as const },
  { label: 'EN', value: 'en' as const }
]

const onScroll = () => {
  isScrolled.value = window.scrollY > 40
}

const isActive = (to: string) =>
  to === '/' ? route.path === '/' : route.path.startsWith(to)

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})

watch(
  () => route.path,
  () => {
    isMobileMenuOpen.value = false
  }
)

watch(isMobileMenuOpen, (value) => {
  if (import.meta.client) {
    document.body.style.overflow = value ? 'hidden' : ''
  }
})
</script>

<template>
  <div class="flex min-h-screen flex-col bg-white">
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
            src="/images/logo_white_bg-removebg-preview.png"
            alt="Lai Huy Interior"
            class="h-14 w-auto"
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
          <div
            class="inline-flex rounded-full border p-1"
            :class="isScrolled ? 'border-ink-200 bg-white' : 'border-white/20 bg-white/8'"
            :aria-label="t(uiText.language)"
          >
            <button
              v-for="option in localeOptions"
              :key="option.value"
              type="button"
              class="rounded-full px-3 py-1.5 text-xs font-black transition-colors"
              :class="locale === option.value
                ? isScrolled ? 'bg-ink-950 text-white' : 'bg-white text-ink-950'
                : isScrolled ? 'text-ink-500 hover:text-ink-950' : 'text-white/62 hover:text-white'"
              @click="setLocale(option.value)"
            >
              {{ option.label }}
            </button>
          </div>
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
          @click="isMobileMenuOpen = true"
        >
          <Icon
            name="i-lucide-menu"
            class="h-6 w-6"
          />
        </button>
      </nav>
    </header>

    <Transition name="fade">
      <button
        v-if="isMobileMenuOpen"
        type="button"
        class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
        :aria-label="locale === 'vi' ? 'Đóng menu' : 'Close menu'"
        @click="isMobileMenuOpen = false"
      />
    </Transition>

    <Transition name="slide-right">
      <nav
        v-if="isMobileMenuOpen"
        class="fixed bottom-0 right-0 top-0 z-50 flex w-84 max-w-[88vw] flex-col bg-white shadow-2xl lg:hidden"
      >
        <div class="flex items-center justify-between border-b border-ink-100 p-6">
          <img
            src="/images/logo.png"
            alt="Lai Huy Interior"
            class="h-9 w-auto"
          >
          <button
            type="button"
            class="p-2 text-ink-500"
            :aria-label="locale === 'vi' ? 'Đóng menu' : 'Close menu'"
            @click="isMobileMenuOpen = false"
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

    <main class="grow">
      <NuxtPage />
    </main>

    <footer class="bg-ink-950 text-white">
      <div class="section-shell px-6 py-16">
        <div class="grid gap-12 lg:grid-cols-[1.3fr_0.8fr_0.9fr_1.2fr]">
          <div>
            <img
              src="/images/logo_white_bg-removebg-preview.png"
              alt="Lai Huy Interior"
              class="mb-6 h-20 w-auto"
            >
            <p class="max-w-sm text-sm leading-7 text-white/68">
              {{ t(company.positioning) }}
            </p>
            <div class="mt-7 flex flex-wrap gap-3">
              <NuxtLink
                to="/lien-he"
                class="btn-primary"
              >
                {{ t(uiText.cta.contact) }}
              </NuxtLink>
              <NuxtLink
                to="/nha-xuong"
                class="btn-secondary"
              >
                {{ t(uiText.cta.factory) }}
              </NuxtLink>
            </div>
          </div>

          <div>
            <h4 class="mb-5 text-sm font-bold uppercase tracking-[0.2em] text-white/55">
              {{ t(uiText.labels.navigation) }}
            </h4>
            <ul class="space-y-3">
              <li
                v-for="link in navLinks"
                :key="link.to"
              >
                <NuxtLink
                  :to="link.to"
                  class="text-sm text-white/62 transition-colors hover:text-white"
                >
                  {{ t(link.label) }}
                </NuxtLink>
              </li>
            </ul>
          </div>

          <div>
            <h4 class="mb-5 text-sm font-bold uppercase tracking-[0.2em] text-white/55">
              {{ t(uiText.labels.services) }}
            </h4>
            <ul class="space-y-3 text-sm text-white/62">
              <li
                v-for="service in ta(company.footerServices)"
                :key="service"
              >
                {{ service }}
              </li>
            </ul>
          </div>

          <div>
            <h4 class="mb-5 text-sm font-bold uppercase tracking-[0.2em] text-white/55">
              {{ t(uiText.labels.contact) }}
            </h4>
            <ul class="space-y-4 text-sm text-white/68">
              <li class="flex gap-3">
                <Icon
                  name="i-lucide-phone"
                  class="mt-0.5 h-4 w-4 shrink-0 text-wood-300"
                />
                <a :href="`tel:${company.phone.replaceAll(' ', '')}`">
                  {{ company.phone }}
                </a>
              </li>
              <li class="flex gap-3">
                <Icon
                  name="i-lucide-mail"
                  class="mt-0.5 h-4 w-4 shrink-0 text-wood-300"
                />
                <a :href="`mailto:${company.email}`">
                  {{ company.email }}
                </a>
              </li>
              <li
                v-for="address in company.addresses"
                :key="t(address.label)"
                class="flex gap-3"
              >
                <Icon
                  name="i-lucide-map-pin"
                  class="mt-0.5 h-4 w-4 shrink-0 text-wood-300"
                />
                <a
                  :href="address.mapUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="leading-6 hover:text-white"
                >
                  <strong class="block text-white/86">{{ t(address.label) }}</strong>
                  {{ t(address.address) }}
                </a>
              </li>
              <li class="flex gap-3">
                <Icon
                  name="i-lucide-clock"
                  class="mt-0.5 h-4 w-4 shrink-0 text-wood-300"
                />
                <span>
                  <span
                    v-for="line in ta(company.workingHours)"
                    :key="line"
                    class="block"
                  >
                    {{ line }}
                  </span>
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div class="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm text-white/42 md:flex-row md:items-center md:justify-between">
          <p>
            &copy; {{ new Date().getFullYear() }} Lai Huy Interior. All rights reserved.
          </p>
          <a
            :href="company.facebook"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-2 transition-colors hover:text-white"
          >
            <Icon
              name="i-simple-icons-facebook"
              class="h-4 w-4"
            />
            Facebook
          </a>
        </div>
      </div>
    </footer>
  </div>
</template>
