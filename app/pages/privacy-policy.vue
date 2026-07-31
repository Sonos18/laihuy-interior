<script setup lang="ts">
import { company } from '~/data/company'
import { privacyPolicy } from '~/data/legal'

const { t } = useLanguage()

const seoTitle = computed(() => t(company.seo.privacy.title))
const seoDescription = computed(() => t(company.seo.privacy.description))

usePageSeo({
  path: '/privacy-policy',
  title: seoTitle,
  description: seoDescription,
  imagePath: company.seo.privacy.ogImage.path,
  jsonLd: ({ base }) => [
    buildBreadcrumbLd(base, t, [
      { name: { vi: 'Trang chủ', en: 'Home' }, path: '/' },
      { name: privacyPolicy.title, path: '/privacy-policy' }
    ]),
    buildOrganizationLd(base, t)
  ]
})
</script>

<template>
  <LegalPage
    :document="privacyPolicy"
    :topic="t({ vi: 'Pháp lý', en: 'Legal' })"
  />
</template>
