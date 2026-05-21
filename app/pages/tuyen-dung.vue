<script setup lang="ts">
import { careerBenefits, jobs } from '~/data/careers'
import { company } from '~/data/company'
import { uiText } from '~/data/ui'

const { t, ta } = useLanguage()

const seoTitle = computed(() => t(company.seo.careers.title))
const seoDescription = computed(() => t(company.seo.careers.description))

useSeoMeta({
  title: seoTitle,
  description: seoDescription,
  ogTitle: seoTitle,
  ogDescription: seoDescription,
  ogImage: company.seo.careers.ogImage
})
</script>

<template>
  <div>
    <AppHero
      :topic="t({ vi: 'Tuyển dụng', en: 'Careers' })"
      :title="t({ vi: 'Tuyển dụng', en: 'Careers' })"
      special-title="Lai Huy Interior"
      :subtitle="t({ vi: 'Gia nhập môi trường sản xuất và thi công nội thất dự án chuyên nghiệp, nơi thiết kế, kỹ thuật, xưởng và công trình làm việc cùng một mục tiêu.', en: 'Join a professional project interior environment where design, technical detailing, factory production, and site installation work toward one delivery goal.' })"
      bg-image="/images/about_workspace.jpg"
    />

    <section class="section-spacing bg-white">
      <div class="section-shell grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p class="eyebrow">
            {{ t({ vi: 'Môi trường làm việc', en: 'Work environment' }) }}
          </p>
          <h2 class="mt-4 text-3xl font-black uppercase leading-tight text-ink-950 md:text-5xl">
            {{ t({ vi: 'Cùng phát triển năng lực nội thất dự án', en: 'Build project interior capability with us' }) }}
          </h2>
        </div>
        <div>
          <p class="text-lg leading-9 text-ink-600">
            {{ t({ vi: 'Lai Huy Interior đang mở rộng đội ngũ cho mảng sản xuất, kỹ thuật, thiết kế, giám sát và kinh doanh dự án. Chúng tôi tìm kiếm những nhân sự muốn làm việc trong môi trường rõ quy trình, có sản phẩm thực tế và có cơ hội tham gia các công trình khách sạn, villa, căn hộ và thương mại.', en: 'Lai Huy Interior is expanding its production, technical, design, site supervision, and project sales teams. We welcome people who want clear processes, real products, and exposure to hotel, villa, apartment, and commercial projects.' }) }}
          </p>
          <div class="mt-8 grid gap-3 md:grid-cols-2">
            <div
              v-for="benefit in careerBenefits"
              :key="benefit"
              class="rounded-2xl border border-ink-200 p-4 text-sm font-semibold leading-6 text-ink-700"
            >
              {{ benefit }}
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section-spacing bg-ink-50">
      <div class="section-shell">
        <div class="mb-12 max-w-3xl">
          <p class="eyebrow">
            {{ t(uiText.labels.openPositions) }}
          </p>
          <h2 class="mt-4 text-3xl font-black uppercase text-ink-950 md:text-5xl">
            {{ t({ vi: 'Vị trí đang tuyển', en: 'Open positions' }) }}
          </h2>
        </div>

        <div class="grid gap-5 md:grid-cols-2">
          <article
            v-for="job in jobs"
            :key="job.id"
            class="rounded-2xl border border-ink-200 bg-white p-6"
          >
            <div class="mb-5 flex flex-wrap gap-2 text-xs font-bold text-ink-600">
              <span class="rounded-full border border-ink-200 px-3 py-2">
                {{ t(job.location) }}
              </span>
              <span class="rounded-full border border-ink-200 px-3 py-2">
                {{ t(job.type) }}
              </span>
            </div>
            <h3 class="text-2xl font-black text-ink-950">
              {{ t(job.title) }}
            </h3>
            <p class="mt-3 text-sm leading-6 text-ink-600">
              {{ t(job.description) }}
            </p>
            <ul class="mt-5 space-y-3">
              <li
                v-for="requirement in ta(job.requirements)"
                :key="requirement"
                class="flex gap-3 text-sm leading-6 text-ink-700"
              >
                <Icon
                  name="i-lucide-dot"
                  class="mt-1 h-4 w-4 shrink-0 text-wood-500"
                />
                {{ requirement }}
              </li>
            </ul>
          </article>
        </div>
      </div>
    </section>

    <section class="bg-ink-950 px-6 py-16 text-white">
      <div class="section-shell grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <p class="eyebrow text-wood-300">
            {{ t({ vi: 'Ứng tuyển', en: 'Apply' }) }}
          </p>
          <h2 class="mt-4 max-w-3xl text-3xl font-black uppercase md:text-5xl">
            {{ t({ vi: 'Gửi hồ sơ để cùng Lai Huy triển khai những dự án lớn hơn', en: 'Send your profile and help Lai Huy deliver larger projects' }) }}
          </h2>
          <p class="mt-4 text-white/62">
            {{ t({ vi: 'Email tuyển dụng hiện dùng chung với kênh liên hệ công ty.', en: 'Recruitment applications currently use the company contact email.' }) }}
          </p>
        </div>
        <a
          :href="`mailto:${company.email}?subject=${encodeURIComponent(t({ vi: 'Ứng tuyển Lai Huy Interior', en: 'Career application - Lai Huy Interior' }))}`"
          class="btn-primary"
        >
          {{ t(uiText.cta.sendCv) }}
        </a>
      </div>
    </section>
  </div>
</template>
