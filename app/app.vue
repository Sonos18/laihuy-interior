<script setup lang="ts">
import { company } from '~/data/company'

const { locale, t } = useLanguage()
const { resolve: mediaUrl } = useMediaUrl()

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
  ogImage: mediaUrl(company.seo.home.ogImage.path),
  twitterCard: 'summary_large_image'
})

const route = useRoute()
const isMobileMenuOpen = ref(false)

// Both watchers stay here, on the ref that owns the state — exactly as before the extraction.
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
    <AppHeader @open-menu="isMobileMenuOpen = true" />

    <AppDrawer
      :open="isMobileMenuOpen"
      @close="isMobileMenuOpen = false"
    />

    <main class="grow">
      <NuxtPage />
    </main>

    <AppFooter />
  </div>
</template>
