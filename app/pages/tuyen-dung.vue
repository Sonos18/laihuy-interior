<script setup lang="ts">
import { careerBenefits, jobs, jobsPostedDate } from '~/data/careers'
import { company } from '~/data/company'
import { uiText } from '~/data/ui'
import { brandMedia, workshopMedia } from '~/media/catalog.generated'
import { withAlt } from '~/media/project-media'

const { t, ta } = useLanguage()

// Hero: a real production-floor photo, distinct from About/Factory (image ownership,
// docs/hero-art-direction.md §10, Recruitment · Culture). The workers photo is the
// ideal "Culture" frame but too low-res for full-bleed; use a high-res hall until
// authentic hero-resolution people photography exists (Hero Lifecycle §15).
const workshopHero = workshopMedia.find(asset => asset.path.endsWith('/5.webp'))
  ?? workshopMedia.find(asset => asset.width > asset.height)
  ?? brandMedia.bannerHome
const heroImage = withAlt(workshopHero, {
  vi: 'Không gian sản xuất tại xưởng Lai Huy',
  en: 'The production floor at the Lai Huy workshop'
})

const seoTitle = computed(() => t(company.seo.careers.title))
const seoDescription = computed(() => t(company.seo.careers.description))

usePageSeo({
  path: '/tuyen-dung',
  title: seoTitle,
  description: seoDescription,
  imagePath: company.seo.careers.ogImage.path,
  jsonLd: ({ base }) => [
    buildBreadcrumbLd(base, t, [
      { name: { vi: 'Trang chủ', en: 'Home' }, path: '/' },
      { name: { vi: 'Tuyển dụng', en: 'Careers' }, path: '/tuyen-dung' }
    ]),
    buildOrganizationLd(base, t),
    ...jobs.map(job => ({
      '@context': 'https://schema.org',
      '@type': 'JobPosting',
      'title': t(job.title),
      'description': t(job.description),
      'datePosted': jobsPostedDate,
      'employmentType': 'FULL_TIME',
      'hiringOrganization': { '@id': `${base}#organization` },
      'jobLocation': {
        '@type': 'Place',
        'address': {
          '@type': 'PostalAddress',
          'addressLocality': t(job.location),
          'addressCountry': 'VN'
        }
      }
    }))
  ]
})
</script>

<template>
  <!-- `home-page` only supplies the shared Headline/Title/Label type tokens that
       `.home-section-heading` and friends read. Below the hero the page is one warm-light
       canvas: Linen, one Raw Silk step for the open positions, Plaster hairlines between. -->
  <div class="home-page bg-wood-50 text-ink-950">
    <AppHero
      :topic="t({ vi: 'Tuyển dụng', en: 'Careers' })"
      :title="t({ vi: 'Nơi tay nghề', en: 'Where craft' })"
      :special-title="t({ vi: 'làm nên công trình', en: 'builds real projects' })"
      :subtitle="t({ vi: 'Gia nhập môi trường sản xuất và thi công nội thất dự án chuyên nghiệp, nơi thiết kế, kỹ thuật, xưởng và công trình làm việc cùng một mục tiêu.', en: 'Join a professional project interior environment where design, technical detailing, factory production, and on-site contracting work toward one delivery goal.' })"
      :image="heroImage"
      focal="50% 40%"
    />

    <section class="section-y">
      <div class="shell grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p class="eyebrow">
            {{ t({ vi: 'Môi trường làm việc', en: 'Work environment' }) }}
          </p>
          <h2 class="home-section-heading mt-4 text-ink-950">
            {{ t({ vi: 'Cùng phát triển năng lực nội thất dự án', en: 'Build project interior capability with us' }) }}
          </h2>
        </div>
        <div>
          <p class="home-lead-text text-ink-600">
            {{ t({ vi: 'Lai Huy Interior đang mở rộng đội ngũ cho mảng sản xuất, kỹ thuật, thiết kế, giám sát và kinh doanh dự án. Chúng tôi tìm kiếm những nhân sự muốn làm việc trong môi trường rõ quy trình, có sản phẩm thực tế và có cơ hội tham gia các công trình khách sạn, villa, căn hộ và thương mại.', en: 'Lai Huy Interior is expanding its production, technical, design, site supervision, and project sales teams. We welcome people who want clear processes, real products, and exposure to hotel, villa, apartment, and commercial projects.' }) }}
          </p>
          <div class="mt-8 grid gap-4 md:grid-cols-2">
            <div
              v-for="benefit in careerBenefits"
              :key="benefit.vi"
              class="flex gap-3 rounded-[4px] border border-ink-200 bg-white p-4 text-base font-semibold leading-[1.7] text-ink-700 shadow-[var(--shadow-rest)]"
            >
              <Icon
                name="i-lucide-check"
                class="mt-1 h-4 w-4 shrink-0 text-wood-600"
                aria-hidden="true"
              />
              <span>{{ t(benefit) }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section-y border-t border-[var(--rule-light)] bg-[var(--color-ivory)]">
      <div class="shell">
        <div class="mb-12 max-w-3xl">
          <p class="eyebrow">
            {{ t(uiText.labels.openPositions) }}
          </p>
          <h2 class="home-section-heading mt-4 text-ink-950">
            {{ t({ vi: 'Vị trí đang tuyển', en: 'Open positions' }) }}
          </h2>
        </div>

        <div class="grid gap-5 md:grid-cols-2">
          <article
            v-for="job in jobs"
            :key="job.id"
            class="rounded-[4px] border border-ink-200 bg-white p-6 shadow-[var(--shadow-rest)] lg:p-7"
          >
            <!-- Location and type are facts about the role, not controls, so they take the 4px
                 content edge rather than the pill reserved for things you press. -->
            <div class="home-meta-text mb-5 flex flex-wrap gap-2 font-semibold text-ink-600">
              <span class="rounded-[4px] border border-ink-200 px-3 py-1.5">
                {{ t(job.location) }}
              </span>
              <span class="rounded-[4px] border border-ink-200 px-3 py-1.5">
                {{ t(job.type) }}
              </span>
            </div>
            <h3 class="home-card-heading text-ink-950">
              {{ t(job.title) }}
            </h3>
            <p class="mt-3 text-base leading-[1.7] text-ink-600">
              {{ t(job.description) }}
            </p>
            <ul class="mt-5 space-y-3">
              <li
                v-for="requirement in ta(job.requirements)"
                :key="requirement"
                class="flex gap-3 text-base leading-[1.7] text-ink-700"
              >
                <Icon
                  name="i-lucide-dot"
                  class="mt-1.5 h-4 w-4 shrink-0 text-wood-600"
                  aria-hidden="true"
                />
                {{ requirement }}
              </li>
            </ul>
          </article>
        </div>
      </div>
    </section>

    <section class="section-cta">
      <div class="shell grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <p class="eyebrow">
            {{ t({ vi: 'Ứng tuyển', en: 'Apply' }) }}
          </p>
          <h2 class="home-section-heading mt-4 max-w-3xl text-ink-950">
            {{ t({ vi: 'Gửi hồ sơ để cùng Lai Huy triển khai những dự án lớn hơn', en: 'Send your profile and help Lai Huy deliver larger projects' }) }}
          </h2>
          <p class="home-lead-text mt-4 text-ink-600">
            {{ t({ vi: 'Email tuyển dụng hiện dùng chung với kênh liên hệ công ty.', en: 'Recruitment applications currently use the company contact email.' }) }}
          </p>
        </div>
        <a
          :href="`mailto:${company.email}?subject=${encodeURIComponent(t({ vi: 'Ứng tuyển Lai Huy Interior', en: 'Career application - Lai Huy Interior' }))}`"
          class="btn-bronze"
          data-testid="careers-apply"
        >
          {{ t(uiText.cta.sendCv) }}
        </a>
      </div>
    </section>
  </div>
</template>
