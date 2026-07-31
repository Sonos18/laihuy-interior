<script setup lang="ts">
import { company } from '~/data/company'
import { termsOfUse } from '~/data/legal'

const { t } = useLanguage()

const seoTitle = computed(() => t(company.seo.terms.title))
const seoDescription = computed(() => t(company.seo.terms.description))

usePageSeo({
  path: '/terms-of-use',
  title: seoTitle,
  description: seoDescription,
  imagePath: company.seo.terms.ogImage.path,
  jsonLd: ({ base }) => [
    buildBreadcrumbLd(base, t, [
      { name: { vi: 'Trang chủ', en: 'Home' }, path: '/' },
      { name: termsOfUse.title, path: '/terms-of-use' }
    ]),
    buildOrganizationLd(base, t)
  ]
})
</script>

<template>
  <LegalPage
    :document="termsOfUse"
    :topic="t({ vi: 'Pháp lý', en: 'Legal' })"
  />
</template>
