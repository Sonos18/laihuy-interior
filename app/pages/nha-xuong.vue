<script setup lang="ts">
import { company } from '~/data/company'
import {
  factoryCapabilities,
  factoryGallery,
  machinery,
  productionWorkflow,
  qualityControl
} from '~/data/factory'
import { uiText } from '~/data/ui'

const { t } = useLanguage()

const seoTitle = computed(() => t(company.seo.factory.title))
const seoDescription = computed(() => t(company.seo.factory.description))

useSeoMeta({
  title: seoTitle,
  description: seoDescription,
  ogTitle: seoTitle,
  ogDescription: seoDescription,
  ogImage: company.seo.factory.ogImage
})
</script>

<template>
  <div>
    <AppHero
      :topic="t({ vi: 'Năng lực nhà xưởng', en: 'Factory capability' })"
      :title="t({ vi: 'Năng lực', en: 'Factory' })"
      :special-title="t({ vi: 'nhà xưởng', en: 'capability' })"
      :subtitle="t({ vi: 'Hệ thống xưởng sản xuất trực tiếp hỗ trợ kiểm soát tiến độ, chất lượng và tính đồng bộ trong từng hạng mục nội thất.', en: 'A direct production system that supports schedule control, quality consistency, and coordinated delivery across interior packages.' })"
      bg-image="/images/about_workspace.jpg"
    />

    <section class="section-spacing bg-white">
      <div class="section-shell grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p class="eyebrow">
            {{ t(uiText.labels.factoryDirectContractor) }}
          </p>
          <h2 class="mt-4 text-3xl font-black uppercase leading-tight text-ink-950 md:text-5xl">
            {{ t({ vi: 'Chủ động sản xuất cho khách sạn và dự án quy mô lớn', en: 'Direct production control for hotels and large-scale projects' }) }}
          </h2>
        </div>
        <p class="text-lg leading-9 text-ink-600">
          {{ t({ vi: 'Lai Huy Interior sở hữu hệ thống xưởng sản xuất trực tiếp, hỗ trợ kiểm soát tiến độ, chất lượng và tính đồng bộ trong từng hạng mục nội thất. Quy trình làm việc kết nối thiết kế, kỹ thuật, sản xuất, QC và đội lắp dựng để giảm sai lệch giữa bản vẽ và công trình thực tế.', en: 'Lai Huy Interior operates through direct factory production, connecting design, technical detailing, manufacturing, QC, and installation teams to reduce gaps between drawings and site execution.' }) }}
        </p>
      </div>
    </section>

    <section class="section-spacing bg-ink-50">
      <div class="section-shell">
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <article
            v-for="capability in factoryCapabilities"
            :key="t(capability.label)"
            class="metric-card"
          >
            <p class="text-sm font-bold text-wood-600">
              {{ t(capability.label) }}
            </p>
            <p class="mt-3 text-3xl font-black text-ink-950">
              {{ capability.value }}
            </p>
            <p class="mt-4 text-sm leading-6 text-ink-600">
              {{ t(capability.description) }}
            </p>
          </article>
        </div>
      </div>
    </section>

    <section class="section-spacing bg-white">
      <div class="section-shell">
        <div class="mb-12 max-w-3xl">
          <p class="eyebrow">
            {{ t(uiText.labels.machinery) }}
          </p>
          <h2 class="mt-4 text-3xl font-black uppercase text-ink-950 md:text-5xl">
            {{ t({ vi: 'Máy móc phục vụ gia công nội thất dự án', en: 'Machinery for project interior manufacturing' }) }}
          </h2>
        </div>

        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <article
            v-for="item in machinery"
            :key="t(item.name)"
            class="industrial-card"
          >
            <h3 class="text-xl font-black text-ink-950">
              {{ t(item.name) }}
            </h3>
            <p class="mt-3 text-sm leading-6 text-ink-600">
              {{ t(item.description) }}
            </p>
          </article>
        </div>
      </div>
    </section>

    <section class="section-spacing bg-ink-950 text-white">
      <div class="section-shell grid gap-12 lg:grid-cols-[0.75fr_1.25fr]">
        <div>
          <p class="eyebrow text-wood-300">
            {{ t(uiText.labels.productionWorkflow) }}
          </p>
          <h2 class="mt-4 text-3xl font-black uppercase leading-tight md:text-5xl">
            {{ t({ vi: 'Quy trình sản xuất và bàn giao có kiểm soát', en: 'Controlled production and handover workflow' }) }}
          </h2>
        </div>
        <div class="space-y-4">
          <article
            v-for="(step, index) in productionWorkflow"
            :key="t(step.title)"
            class="grid gap-4 rounded-2xl border border-white/12 p-6 md:grid-cols-[4rem_1fr]"
          >
            <span class="text-xl font-black text-wood-300">
              {{ String(index + 1).padStart(2, '0') }}
            </span>
            <div>
              <h3 class="text-xl font-black text-white">
                {{ t(step.title) }}
              </h3>
              <p class="mt-2 text-sm leading-6 text-white/62">
                {{ t(step.description) }}
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
            {{ t(uiText.labels.qualityControl) }}
          </p>
          <h2 class="mt-4 text-3xl font-black uppercase leading-tight text-ink-950 md:text-5xl">
            {{ t({ vi: 'Kiểm soát chất lượng từ vật tư đến nghiệm thu', en: 'Quality control from materials to handover' }) }}
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
            {{ t({ vi: 'Hình ảnh nhà xưởng', en: 'Factory gallery' }) }}
          </p>
          <h2 class="mt-4 text-3xl font-black uppercase text-ink-950 md:text-5xl">
            {{ t({ vi: 'Hình ảnh nhà xưởng', en: 'Factory images' }) }}
          </h2>
        </div>
        <div class="grid gap-5 md:grid-cols-3">
          <article
            v-for="item in factoryGallery"
            :key="item.image"
            class="overflow-hidden rounded-2xl bg-white"
          >
            <img
              :src="item.image"
              :alt="t(item.title)"
              class="aspect-[4/3] w-full object-cover"
            >
            <div class="border border-t-0 border-ink-200 p-5">
              <h3 class="font-black text-ink-950">
                {{ t(item.title) }}
              </h3>
              <p
                v-if="item.description"
                class="mt-2 text-sm leading-6 text-ink-600"
              >
                {{ t(item.description) }}
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
            {{ t({ vi: 'Tư vấn năng lực sản xuất', en: 'Production capability review' }) }}
          </p>
          <h2 class="mt-4 max-w-3xl text-3xl font-black uppercase md:text-5xl">
            {{ t({ vi: 'Cần kiểm tra khả năng sản xuất cho dự án của bạn?', en: 'Need to assess production capacity for your project?' }) }}
          </h2>
        </div>
        <NuxtLink
          to="/lien-he"
          class="btn-primary"
        >
          {{ t(uiText.cta.contact) }}
        </NuxtLink>
      </div>
    </section>
  </div>
</template>
