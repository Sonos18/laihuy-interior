<script setup lang="ts">
import { company } from '~/data/company'
import { services } from '~/data/services'
import { uiText } from '~/data/ui'

const { t, ta } = useLanguage()

const seoTitle = computed(() => t(company.seo.services.title))
const seoDescription = computed(() => t(company.seo.services.description))

useSeoMeta({
  title: seoTitle,
  description: seoDescription,
  ogTitle: seoTitle,
  ogDescription: seoDescription,
  ogImage: company.seo.services.ogImage
})
</script>

<template>
  <div>
    <AppHero
      :topic="t({ vi: 'Dịch vụ nội thất B2B', en: 'B2B interior services' })"
      :title="t({ vi: 'Dịch vụ', en: 'Services' })"
      :special-title="t({ vi: 'nội thất dự án', en: 'for project interiors' })"
      :subtitle="t({ vi: 'Thiết kế, sản xuất tại xưởng và lắp đặt nội thất cho khách sạn 3-5 sao, villa, căn hộ, thương mại và đơn hàng gia công.', en: 'Design, factory production, and installation for 3-5 star hotels, villas, apartments, commercial spaces, and production-from-drawings orders.' })"
      bg-image="/images/projects/hotel/codi/reception_desk.jpg"
    />

    <section class="section-spacing bg-white">
      <div class="section-shell">
        <div class="mb-12 max-w-3xl">
          <p class="eyebrow">
            {{ t({ vi: 'Dịch vụ tích hợp', en: 'Integrated service' }) }}
          </p>
          <h2 class="mt-4 text-3xl font-black uppercase leading-tight text-ink-950 md:text-5xl">
            {{ t({ vi: 'Một đầu mối cho thiết kế, sản xuất và thi công', en: 'One accountable partner for design, production, and installation' }) }}
          </h2>
          <p class="mt-5 text-lg leading-8 text-ink-600">
            {{ t({ vi: 'Lai Huy Interior làm việc với chủ đầu tư, tổng thầu, kiến trúc sư và đơn vị vận hành để đưa bản vẽ thành sản phẩm thực tế, đúng vật liệu, đúng tiến độ và phù hợp ngân sách dự án.', en: 'Lai Huy Interior works with owners, contractors, architects, and operators to turn drawings into real products with controlled materials, schedule, and project budget.' }) }}
          </p>
        </div>

        <div class="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <article
            v-for="service in services"
            :key="service.id"
            class="industrial-card"
          >
            <Icon
              :name="service.icon"
              class="h-8 w-8 text-wood-500"
            />
            <h3 class="mt-6 text-2xl font-black text-ink-950">
              {{ t(service.title) }}
            </h3>
            <p class="mt-4 text-sm leading-6 text-ink-600">
              {{ t(service.description) }}
            </p>
            <ul class="mt-6 space-y-3">
              <li
                v-for="detail in ta(service.details)"
                :key="detail"
                class="flex gap-3 text-sm leading-6 text-ink-700"
              >
                <Icon
                  name="i-lucide-check"
                  class="mt-1 h-4 w-4 shrink-0 text-wood-500"
                />
                {{ detail }}
              </li>
            </ul>
          </article>
        </div>
      </div>
    </section>

    <section class="section-spacing bg-ink-50">
      <div class="section-shell grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <p class="eyebrow">
            {{ t({ vi: 'Hồ sơ dự án', en: 'Project documents' }) }}
          </p>
          <h2 class="mt-4 max-w-3xl text-3xl font-black uppercase text-ink-950 md:text-5xl">
            {{ t({ vi: 'Có bản vẽ? Hãy gửi để nhận tư vấn phạm vi và BOQ sơ bộ', en: 'Have drawings? Send them for scope review and a preliminary BOQ' }) }}
          </h2>
        </div>
        <NuxtLink
          to="/lien-he"
          class="btn-dark"
        >
          {{ t(uiText.cta.sendDrawings) }}
        </NuxtLink>
      </div>
    </section>
  </div>
</template>
