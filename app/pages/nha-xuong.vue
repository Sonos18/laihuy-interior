<script setup lang="ts">
import { company } from '~/data/company'
import {
  factoryCapabilities,
  factoryGallery,
  machinery,
  productionWorkflow,
  qualityControl
} from '~/data/factory'

useSeoMeta({
  title: company.seo.factory.title,
  description: company.seo.factory.description,
  ogTitle: company.seo.factory.title,
  ogDescription: company.seo.factory.description,
  ogImage: company.seo.factory.ogImage
})
</script>

<template>
  <div>
    <AppHero
      topic="Factory capability"
      title="Năng lực"
      special-title="nhà xưởng"
      subtitle="Hệ thống xưởng sản xuất trực tiếp hỗ trợ kiểm soát tiến độ, chất lượng và tính đồng bộ trong từng hạng mục nội thất."
      bg-image="/images/about_workspace.jpg"
    />

    <section class="section-spacing bg-white">
      <div class="section-shell grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p class="eyebrow">
            Factory direct
          </p>
          <h2 class="mt-4 text-3xl font-black uppercase leading-tight text-ink-950 md:text-5xl">
            Chủ động sản xuất cho khách sạn và dự án quy mô lớn
          </h2>
        </div>
        <p class="text-lg leading-9 text-ink-600">
          Lai Huy Interior sở hữu hệ thống xưởng sản xuất trực tiếp, hỗ trợ kiểm soát tiến độ, chất lượng và tính đồng bộ trong từng hạng mục nội thất. Quy trình làm việc kết nối thiết kế, kỹ thuật, sản xuất, QC và đội lắp dựng để giảm sai lệch giữa bản vẽ và công trình thực tế.
        </p>
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
            Machinery
          </p>
          <h2 class="mt-4 text-3xl font-black uppercase text-ink-950 md:text-5xl">
            Máy móc phục vụ gia công nội thất dự án
          </h2>
        </div>

        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <article
            v-for="item in machinery"
            :key="item.name"
            class="industrial-card"
          >
            <h3 class="text-xl font-black text-ink-950">
              {{ item.name }}
            </h3>
            <p class="mt-3 text-sm leading-6 text-ink-600">
              {{ item.description }}
            </p>
          </article>
        </div>
      </div>
    </section>

    <section class="section-spacing bg-ink-950 text-white">
      <div class="section-shell grid gap-12 lg:grid-cols-[0.75fr_1.25fr]">
        <div>
          <p class="eyebrow text-wood-300">
            Production workflow
          </p>
          <h2 class="mt-4 text-3xl font-black uppercase leading-tight md:text-5xl">
            Quy trình sản xuất và bàn giao có kiểm soát
          </h2>
        </div>
        <div class="space-y-4">
          <article
            v-for="(step, index) in productionWorkflow"
            :key="step.title"
            class="grid gap-4 border border-white/12 p-6 md:grid-cols-[4rem_1fr]"
          >
            <span class="text-xl font-black text-wood-300">
              {{ String(index + 1).padStart(2, '0') }}
            </span>
            <div>
              <h3 class="text-xl font-black text-white">
                {{ step.title }}
              </h3>
              <p class="mt-2 text-sm leading-6 text-white/62">
                {{ step.description }}
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section class="section-spacing bg-white">
      <div class="section-shell grid gap-10 lg:grid-cols-2">
        <div>
          <p class="eyebrow">
            Quality control
          </p>
          <h2 class="mt-4 text-3xl font-black uppercase leading-tight text-ink-950 md:text-5xl">
            Kiểm soát chất lượng từ vật tư đến nghiệm thu
          </h2>
        </div>
        <div class="space-y-4">
          <div
            v-for="item in qualityControl"
            :key="item"
            class="border-b border-ink-200 pb-4 text-base font-semibold leading-7 text-ink-800"
          >
            {{ item }}
          </div>
        </div>
      </div>
    </section>

    <section
      v-if="factoryGallery.length"
      class="section-spacing bg-ink-50"
    >
      <div class="section-shell">
        <div class="mb-10 max-w-3xl">
          <p class="eyebrow">
            Factory gallery
          </p>
          <h2 class="mt-4 text-3xl font-black uppercase text-ink-950 md:text-5xl">
            Hình ảnh nhà xưởng
          </h2>
        </div>
        <div class="grid gap-5 md:grid-cols-3">
          <article
            v-for="item in factoryGallery"
            :key="item.image"
            class="bg-white"
          >
            <img
              :src="item.image"
              :alt="item.title"
              class="aspect-[4/3] w-full object-cover"
            >
            <div class="border border-t-0 border-ink-200 p-5">
              <h3 class="font-black text-ink-950">
                {{ item.title }}
              </h3>
              <p
                v-if="item.description"
                class="mt-2 text-sm leading-6 text-ink-600"
              >
                {{ item.description }}
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section class="bg-ink-950 px-6 py-16 text-white">
      <div class="section-shell grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <p class="eyebrow text-wood-300">
            Tư vấn năng lực sản xuất
          </p>
          <h2 class="mt-4 max-w-3xl text-3xl font-black uppercase md:text-5xl">
            Cần kiểm tra khả năng sản xuất cho dự án của bạn?
          </h2>
        </div>
        <NuxtLink
          to="/lien-he"
          class="btn-primary"
        >
          Liên hệ tư vấn dự án
        </NuxtLink>
      </div>
    </section>
  </div>
</template>
