<script setup lang="ts">
import { company } from '~/data/company'
import { uiText } from '~/data/ui'
import type { NuxtError } from '#app'

/**
 * The error route — the ONE route Nuxt renders outside app.vue.
 *
 * That is the whole reason this file exists and why it looks the way it does. Nuxt swaps
 * app.vue out entirely on a fatal error, so nothing app.vue provides comes along: no header,
 * no footer, no skip link, no drawer wiring, no lang attribute. A visitor who mistypes a URL
 * was landing on Nuxt's built-in page — English-only, unstyled, and with no way back into the
 * site except the browser's back button.
 *
 * So the shell below is a DELIBERATE duplication of app.vue's, not a missed abstraction.
 * Extracting the two into a shared layout component was the obvious alternative and was not
 * taken: app.vue owns route-change behaviour (drawer close + focus reset on navigation) that
 * has no meaning here, where there is exactly one route and no navigation within it. The
 * shared surface is three components and a skip link; the unshared surface is the entire
 * state machine around them. Duplicating the smaller half keeps app.vue's contract intact.
 *
 * If a fourth chrome element is ever added, add it in both places — or extract then, when
 * there is enough shared weight to justify the indirection.
 */
const props = defineProps<{ error: NuxtError }>()

const { locale, t } = useLanguage()

const isNotFound = computed(() => props.error?.statusCode === 404)
const copy = computed(() => isNotFound.value ? uiText.errorPage.notFound : uiText.errorPage.serverError)

useHead({
  meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
  link: [{ rel: 'icon', href: '/logo_favicon.png' }],
  htmlAttrs: {
    'lang': locale,
    // `<AppHeader solid />` pins NAVIGATION once mounted; this attribute does the same for the
    // first paint and for a JavaScript-off visit (main.css, `data-chrome-solid`).
    'data-chrome-solid': ''
  },
  // The header's pre-hydration chrome guard, identical to app.vue's. Without it this route
  // paints a transparent header over white content for a frame on a restored scroll position.
  script: [{
    innerHTML: 'document.documentElement.dataset.chrome=scrollY>0?"nav":"cover"',
    tagPosition: 'head'
  }]
})

useSeoMeta({
  title: () => `${t(copy.value.title)} | Lai Huy Interior`,
  // An error page must never be indexed — it returns a real status code, but a crawler that
  // reaches it through a stale link should not keep the URL in the index either way.
  robots: 'noindex, follow'
})

const isMobileMenuOpen = ref(false)
const { setDrawerOpen } = useHeaderState()
watch(isMobileMenuOpen, setDrawerOpen)

// `clearError` restores the app for a client-side recovery; a hard reload is the honest action
// for a 500, where the failure may be in the payload this page was rendered from.
const goHome = () => clearError({ redirect: '/' })
const reload = () => {
  if (import.meta.client) window.location.reload()
}

/** The routes a lost visitor is most likely to have wanted, in commercial order. */
const recoveryLinks = [
  {
    to: '/du-an',
    icon: 'i-lucide-layout-grid',
    label: { vi: 'Dự án', en: 'Projects' },
    description: { vi: 'Khách sạn, villa, nhà phố và văn phòng', en: 'Hotels, villas, townhouses and offices' }
  },
  {
    to: '/dich-vu',
    icon: 'i-lucide-hard-hat',
    label: { vi: 'Dịch vụ', en: 'Services' },
    description: { vi: 'Thiết kế, sản xuất và thi công', en: 'Design, production and fit-out' }
  },
  {
    to: '/lien-he',
    icon: 'i-lucide-messages-square',
    label: { vi: 'Liên hệ', en: 'Contact' },
    description: { vi: 'Gọi điện hoặc gửi email trực tiếp', en: 'Call or email directly' }
  }
]
</script>

<template>
  <!-- The error shell is one Linen surface: no photograph, so no dark band (DESIGN.md Warm Light
       Rule). `home-page` only supplies the Headline/Title type tokens used below. -->
  <div class="home-page flex min-h-screen flex-col bg-wood-50 text-ink-950">
    <a
      class="skip-link"
      href="#main"
    >
      {{ t({ vi: 'Đến nội dung chính', en: 'Skip to content' }) }}
    </a>

    <!-- `solid` is the I9 escape hatch and this is exactly the case it was written for: the
         header's rest state is a scrim over a dark cover photograph, and this page has no
         cover. Without it the white logo and nav paint over a white surface at p = 0 — the
         white-on-white failure app.vue's pre-hydration guard exists to prevent for ONE frame,
         made permanent. `solid` pins the chrome to NAVIGATION, so the section below has to
         clear the fixed header itself (the same reason LegalPage.vue pads its masthead). -->
    <AppHeader
      solid
      @open-menu="isMobileMenuOpen = true"
    />

    <AppDrawer
      :open="isMobileMenuOpen"
      @close="isMobileMenuOpen = false"
    />

    <main
      id="main"
      class="grow"
      tabindex="-1"
    >
      <!-- Bottom pad is the standard body rhythm; the top adds --header-h because `solid`
           chrome is opaque and fixed, so nothing may start underneath it. -->
      <section class="pb-[var(--section-py)] pt-[calc(var(--header-h)+var(--section-py))]">
        <div class="shell">
          <div class="max-w-3xl">
            <!-- The status code is set as a display numeral rather than a heading: it is a
                 reference for anyone reporting the problem, not the page's title. The <h1>
                 is the sentence below it, which is what the page is actually about. -->
            <p
              class="font-display text-7xl font-medium leading-none tracking-tight text-ink-200 md:text-8xl"
              aria-hidden="true"
            >
              {{ t(copy.code) }}
            </p>

            <p class="eyebrow mt-6">
              {{ t(copy.eyebrow) }}
            </p>

            <h1 class="home-display-title mt-4 font-display font-medium text-ink-950">
              {{ t(copy.title) }}
            </h1>

            <p class="home-lead-text mt-6 max-w-2xl text-ink-600">
              {{ t(copy.body) }}
            </p>

            <div class="mt-9 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                class="btn-bronze"
                @click="goHome"
              >
                {{ t(uiText.errorPage.home) }}
              </button>
              <button
                v-if="!isNotFound"
                type="button"
                class="btn-outline"
                @click="reload"
              >
                {{ t(uiText.errorPage.retry) }}
              </button>
              <a
                :href="`tel:${company.phone.replaceAll(' ', '')}`"
                class="btn-outline"
              >
                {{ t(uiText.labels.callNow) }}
              </a>
            </div>
          </div>

          <div class="mt-16 grid gap-5 md:mt-20 md:grid-cols-3">
            <NuxtLink
              v-for="link in recoveryLinks"
              :key="link.to"
              :to="link.to"
              class="group card-link p-6 lg:p-7"
            >
              <Icon
                :name="link.icon"
                class="h-7 w-7 text-wood-600"
                aria-hidden="true"
              />
              <h2 class="home-card-heading mt-5 text-ink-950">
                {{ t(link.label) }}
              </h2>
              <p class="mt-2 text-base leading-[1.7] text-ink-600">
                {{ t(link.description) }}
              </p>
              <span class="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-wood-600">
                {{ t({ vi: 'Xem', en: 'View' }) }}
                <Icon
                  name="i-lucide-arrow-right"
                  class="h-4 w-4 transition-transform duration-[var(--dur-hover)] ease-[var(--ease-editorial)] group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
                  aria-hidden="true"
                />
              </span>
            </NuxtLink>
          </div>
        </div>
      </section>
    </main>

    <AppFooter />
  </div>
</template>
