<script setup lang="ts">
import { company } from '~/data/company'
import { factoryCapabilities, qualityControl } from '~/data/factory'

const values = [
  {
    icon: 'i-lucide-factory',
    title: 'Sản xuất trực tiếp',
    description:
      'Chủ động xưởng giúp kiểm soát vật liệu, tiến độ và chất lượng hoàn thiện cho từng hạng mục nội thất.'
  },
  {
    icon: 'i-lucide-list-checks',
    title: 'Quản lý dự án rõ ràng',
    description:
      'Quy trình phối hợp giữa thiết kế, kỹ thuật, sản xuất, QC và lắp đặt giúp giảm sai lệch khi triển khai.'
  },
  {
    icon: 'i-lucide-hard-hat',
    title: 'Thi công thực chiến',
    description:
      'Đội ngũ lắp dựng làm việc tại công trình, phối hợp hiện trường và nghiệm thu theo từng giai đoạn.'
  }
]

useSeoMeta({
  title: company.seo.about.title,
  description: company.seo.about.description,
  ogTitle: company.seo.about.title,
  ogDescription: company.seo.about.description,
  ogImage: company.seo.about.ogImage
})
</script>

<template>
  <div>
    <AppHero
      topic="About Lai Huy"
      title="Đơn vị sản xuất & thi công"
      special-title="nội thất dự án"
      subtitle="Lai Huy Interior phát triển theo mô hình xưởng trực tiếp, kết hợp thiết kế, sản xuất và lắp đặt cho khách sạn, villa, căn hộ và công trình thương mại."
      bg-image="/images/projects/hotel/eo_gio/table.png"
    />

    <section class="section-spacing bg-white">
      <div class="section-shell grid gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <img
            src="/images/company-story.jpg"
            alt="Lai Huy Interior"
            class="aspect-[4/3] w-full object-cover"
          >
        </div>
        <div>
          <p class="eyebrow">
            Định vị doanh nghiệp
          </p>
          <h2 class="mt-4 text-3xl font-black uppercase leading-tight text-ink-950 md:text-5xl">
            Không chỉ làm đẹp không gian, Lai Huy giải quyết bài toán triển khai
          </h2>
          <div class="mt-6 space-y-5 text-lg leading-8 text-ink-600">
            <p>
              {{ company.positioning }}
            </p>
            <p>
              Trong ngành nội thất dự án, khách hàng không chỉ mua hình ảnh đẹp. Chủ đầu tư cần năng lực quản lý, tiến độ, chất lượng, sản xuất ổn định và đội ngũ có thể xử lý thực tế tại công trình.
            </p>
            <p>
              Lai Huy Interior xây dựng năng lực quanh mô hình factory + project capability: bản vẽ được bóc tách kỹ thuật, sản phẩm được gia công tại xưởng, chất lượng được kiểm tra trước khi giao hàng và đội lắp đặt triển khai theo kế hoạch bàn giao.
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="section-spacing bg-ink-50">
      <div class="section-shell">
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <article
            v-for="capability in factoryCapabilities"
            :key="capability.label"
            class="metric-card"
          >
            <p class="text-sm font-bold text-wood-600">
              {{ capability.label }}
            </p>
            <p class="mt-3 text-3xl font-black text-ink-950">
              {{ capability.value }}
            </p>
            <p class="mt-4 text-sm leading-6 text-ink-600">
              {{ capability.description }}
            </p>
          </article>
        </div>
      </div>
    </section>

    <section class="section-spacing bg-white">
      <div class="section-shell">
        <div class="mb-12 max-w-3xl">
          <p class="eyebrow">
            Giá trị vận hành
          </p>
          <h2 class="mt-4 text-3xl font-black uppercase text-ink-950 md:text-5xl">
            Điều Lai Huy tập trung trong từng dự án
          </h2>
        </div>

        <div class="grid gap-5 md:grid-cols-3">
          <article
            v-for="value in values"
            :key="value.title"
            class="industrial-card"
          >
            <Icon
              :name="value.icon"
              class="h-8 w-8 text-wood-500"
            />
            <h3 class="mt-6 text-2xl font-black text-ink-950">
              {{ value.title }}
            </h3>
            <p class="mt-4 text-sm leading-6 text-ink-600">
              {{ value.description }}
            </p>
          </article>
        </div>
      </div>
    </section>

    <section class="section-spacing bg-ink-950 text-white">
      <div class="section-shell grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p class="eyebrow text-wood-300">
            Kiểm soát chất lượng
          </p>
          <h2 class="mt-4 text-3xl font-black uppercase leading-tight md:text-5xl">
            Quy trình giúp dự án không phụ thuộc vào may rủi
          </h2>
        </div>
        <div class="space-y-4">
          <div
            v-for="item in qualityControl"
            :key="item"
            class="border-b border-white/12 pb-4 text-base font-semibold leading-7 text-white/72"
          >
            {{ item }}
          </div>
        </div>
      </div>
    </section>

    <section class="bg-white px-6 py-16">
      <div class="section-shell grid gap-8 border border-ink-200 p-8 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <p class="eyebrow">
            Hợp tác dự án
          </p>
          <h2 class="mt-4 max-w-3xl text-3xl font-black uppercase text-ink-950 md:text-5xl">
            Cần một đối tác sản xuất và thi công nội thất đáng tin cậy?
          </h2>
        </div>
        <NuxtLink
          to="/lien-he"
          class="btn-dark"
        >
          Liên hệ tư vấn dự án
        </NuxtLink>
      </div>
    </section>
  </div>
</template>
