<script setup lang="ts">
import { careerBenefits, jobs } from '~/data/careers'
import { company } from '~/data/company'

useSeoMeta({
  title: company.seo.careers.title,
  description: company.seo.careers.description,
  ogTitle: company.seo.careers.title,
  ogDescription: company.seo.careers.description,
  ogImage: company.seo.careers.ogImage
})
</script>

<template>
  <div>
    <AppHero
      topic="Careers"
      title="Tuyển dụng"
      special-title="Lai Huy Interior"
      subtitle="Gia nhập môi trường sản xuất và thi công nội thất dự án chuyên nghiệp, nơi thiết kế, kỹ thuật, xưởng và công trình làm việc cùng một mục tiêu."
      bg-image="/images/about_workspace.jpg"
    />

    <section class="section-spacing bg-white">
      <div class="section-shell grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p class="eyebrow">
            Môi trường làm việc
          </p>
          <h2 class="mt-4 text-3xl font-black uppercase leading-tight text-ink-950 md:text-5xl">
            Cùng phát triển năng lực nội thất dự án
          </h2>
        </div>
        <div>
          <p class="text-lg leading-9 text-ink-600">
            Lai Huy Interior đang mở rộng đội ngũ cho mảng sản xuất, kỹ thuật, thiết kế, giám sát và kinh doanh dự án. Chúng tôi tìm kiếm những nhân sự muốn làm việc trong môi trường rõ quy trình, có sản phẩm thực tế và có cơ hội tham gia các công trình khách sạn, villa, căn hộ và thương mại.
          </p>
          <div class="mt-8 grid gap-3 md:grid-cols-2">
            <div
              v-for="benefit in careerBenefits"
              :key="benefit"
              class="border border-ink-200 p-4 text-sm font-semibold leading-6 text-ink-700"
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
            Open positions
          </p>
          <h2 class="mt-4 text-3xl font-black uppercase text-ink-950 md:text-5xl">
            Vị trí đang tuyển
          </h2>
        </div>

        <div class="grid gap-5 md:grid-cols-2">
          <article
            v-for="job in jobs"
            :key="job.id"
            class="border border-ink-200 bg-white p-6"
          >
            <div class="mb-5 flex flex-wrap gap-2 text-xs font-bold text-ink-600">
              <span class="border border-ink-200 px-3 py-2">
                {{ job.location }}
              </span>
              <span class="border border-ink-200 px-3 py-2">
                {{ job.type }}
              </span>
            </div>
            <h3 class="text-2xl font-black text-ink-950">
              {{ job.title }}
            </h3>
            <p class="mt-3 text-sm leading-6 text-ink-600">
              {{ job.description }}
            </p>
            <ul class="mt-5 space-y-3">
              <li
                v-for="requirement in job.requirements"
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
            Ứng tuyển
          </p>
          <h2 class="mt-4 max-w-3xl text-3xl font-black uppercase md:text-5xl">
            Gửi hồ sơ để cùng Lai Huy triển khai những dự án lớn hơn
          </h2>
          <p class="mt-4 text-white/62">
            Email tuyển dụng hiện dùng chung với kênh liên hệ công ty.
          </p>
        </div>
        <a
          :href="`mailto:${company.email}?subject=${encodeURIComponent('Ứng tuyển Lai Huy Interior')}`"
          class="btn-primary"
        >
          Gửi CV qua email
        </a>
      </div>
    </section>
  </div>
</template>
