<script setup lang="ts">
import { company } from '~/data/company'
import { factoryCapabilities, machinery, productionWorkflow } from '~/data/factory'
import { projects } from '~/data/projects'
import { services } from '~/data/services'

const featuredProjects = computed(() =>
  projects.filter(project => project.featured).slice(0, 3)
)

useSeoMeta({
  title: company.seo.home.title,
  description: company.seo.home.description,
  ogTitle: company.seo.home.title,
  ogDescription: company.seo.home.description,
  ogImage: company.seo.home.ogImage
})
</script>

<template>
  <div>
    <section class="relative min-h-screen overflow-hidden bg-ink-950 text-white">
      <img
        src="/images/projects/hotel/eo_gio/reception.png"
        alt="Thi công nội thất khách sạn Lai Huy Interior"
        class="absolute inset-0 h-full w-full object-cover"
      >
      <div class="absolute inset-0 bg-ink-950/78" />
      <div class="absolute inset-x-0 bottom-0 h-48 bg-linear-to-t from-ink-950 to-transparent" />

      <div class="section-shell relative z-10 flex min-h-screen flex-col justify-end px-6 pb-12 pt-32 md:pb-18">
        <div class="max-w-5xl">
          <p class="eyebrow mb-6 text-wood-300">
            Factory direct interior contractor
          </p>
          <h1 class="max-w-5xl text-4xl font-black uppercase leading-[1.05] text-white md:text-6xl lg:text-7xl">
            Thi công & sản xuất nội thất khách sạn 3-5 sao
          </h1>
          <p class="mt-6 max-w-3xl text-xl font-semibold text-white/86 md:text-2xl">
            Xưởng sản xuất trực tiếp - Kiểm soát chất lượng - Thi công toàn quốc
          </p>
          <p class="mt-5 max-w-2xl text-base leading-8 text-white/68 md:text-lg">
            Lai Huy Interior cung cấp giải pháp thiết kế, sản xuất và lắp đặt nội thất trọn gói cho khách sạn, villa, căn hộ và các công trình quy mô lớn.
          </p>

          <div class="mt-9 flex flex-col gap-3 sm:flex-row">
            <NuxtLink
              to="/du-an"
              class="btn-primary"
            >
              Xem dự án
              <Icon
                name="i-lucide-arrow-right"
                class="h-4 w-4"
              />
            </NuxtLink>
            <NuxtLink
              to="/lien-he"
              class="btn-secondary"
            >
              Nhận báo giá
            </NuxtLink>
          </div>
        </div>

        <div class="mt-14 grid border border-white/12 bg-white/[0.04] backdrop-blur-sm sm:grid-cols-2 lg:grid-cols-4">
          <div
            v-for="capability in factoryCapabilities"
            :key="capability.label"
            class="border-b border-white/10 p-5 sm:border-r lg:border-b-0"
          >
            <p class="text-xs uppercase tracking-[0.18em] text-white/45">
              {{ capability.label }}
            </p>
            <p class="mt-2 text-2xl font-black text-white">
              {{ capability.value }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="section-spacing bg-white">
      <div class="section-shell">
        <div class="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p class="eyebrow">
              Năng lực nhà xưởng
            </p>
            <h2 class="mt-4 max-w-xl text-3xl font-black uppercase leading-tight text-ink-950 md:text-5xl">
              Kiểm soát tiến độ, chất lượng và chi phí từ xưởng trực tiếp
            </h2>
          </div>
          <p class="max-w-3xl text-lg leading-8 text-ink-600">
            Hệ thống sản xuất trực tiếp giúp Lai Huy Interior chủ động bóc tách bản vẽ, kiểm soát vật liệu, sản xuất theo module và điều phối lắp đặt cho các dự án khách sạn, villa, căn hộ và thương mại.
          </p>
        </div>

        <div class="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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

        <div class="mt-10">
          <NuxtLink
            to="/nha-xuong"
            class="btn-outline"
          >
            Xem năng lực nhà xưởng
          </NuxtLink>
        </div>
      </div>
    </section>

    <section class="section-spacing bg-ink-50">
      <div class="section-shell">
        <div class="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p class="eyebrow">
              Case studies
            </p>
            <h2 class="mt-4 text-3xl font-black uppercase text-ink-950 md:text-5xl">
              Dự án khách sạn & công trình tiêu biểu
            </h2>
          </div>
          <NuxtLink
            to="/du-an"
            class="btn-outline w-fit"
          >
            Xem tất cả dự án
          </NuxtLink>
        </div>

        <div class="grid gap-6 lg:grid-cols-3">
          <NuxtLink
            v-for="project in featuredProjects"
            :key="project.slug"
            :to="`/du-an/${project.slug}`"
            class="group block bg-white"
          >
            <div class="relative aspect-[4/3] overflow-hidden bg-ink-100">
              <img
                :src="project.image[0]"
                :alt="project.name"
                class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              >
              <div class="absolute left-4 top-4 bg-ink-950 px-3 py-2 text-xs font-bold uppercase tracking-[0.16em] text-white">
                {{ project.categoryName }}
              </div>
            </div>
            <div class="border border-t-0 border-ink-200 p-6">
              <h3 class="text-2xl font-black text-ink-950">
                {{ project.name }}
              </h3>
              <p class="mt-3 line-clamp-3 text-sm leading-6 text-ink-600">
                {{ project.shortDescription }}
              </p>
              <div class="mt-5 flex flex-wrap gap-2 text-xs font-bold text-ink-700">
                <span
                  v-if="project.rooms"
                  class="border border-ink-200 px-3 py-2"
                >
                  {{ project.rooms }}
                </span>
                <span
                  v-if="project.duration"
                  class="border border-ink-200 px-3 py-2"
                >
                  {{ project.duration }}
                </span>
                <span
                  v-if="project.scope?.[0]"
                  class="border border-ink-200 px-3 py-2"
                >
                  {{ project.scope[0] }}
                </span>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <section class="section-spacing bg-ink-950 text-white">
      <div class="section-shell">
        <div class="grid gap-12 lg:grid-cols-[0.7fr_1.3fr]">
          <div>
            <p class="eyebrow text-wood-300">
              Quy trình triển khai
            </p>
            <h2 class="mt-4 text-3xl font-black uppercase leading-tight md:text-5xl">
              Từ bản vẽ đến bàn giao công trình
            </h2>
          </div>
          <div class="grid gap-4 md:grid-cols-2">
            <article
              v-for="(step, index) in productionWorkflow"
              :key="step.title"
              class="border border-white/12 p-6"
            >
              <span class="text-sm font-black text-wood-300">
                {{ String(index + 1).padStart(2, '0') }}
              </span>
              <h3 class="mt-5 text-xl font-black text-white">
                {{ step.title }}
              </h3>
              <p class="mt-3 text-sm leading-6 text-white/62">
                {{ step.description }}
              </p>
            </article>
          </div>
        </div>
      </div>
    </section>

    <section class="section-spacing bg-white">
      <div class="section-shell">
        <div class="mb-12 max-w-3xl">
          <p class="eyebrow">
            Dịch vụ
          </p>
          <h2 class="mt-4 text-3xl font-black uppercase text-ink-950 md:text-5xl">
            Giải pháp nội thất cho chủ đầu tư, tổng thầu và đơn vị vận hành
          </h2>
        </div>

        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <article
            v-for="service in services"
            :key="service.id"
            class="industrial-card"
          >
            <Icon
              :name="service.icon"
              class="h-8 w-8 text-wood-500"
            />
            <h3 class="mt-6 text-xl font-black text-ink-950">
              {{ service.title }}
            </h3>
            <p class="mt-3 text-sm leading-6 text-ink-600">
              {{ service.description }}
            </p>
          </article>
        </div>
      </div>
    </section>

    <section class="section-spacing bg-ink-50">
      <div class="section-shell grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
        <div>
          <img
            src="/images/about_workspace.jpg"
            alt="Không gian làm việc và sản xuất Lai Huy Interior"
            class="aspect-[4/3] w-full object-cover"
          >
        </div>
        <div>
          <p class="eyebrow">
            Máy móc & năng lực sản xuất
          </p>
          <h2 class="mt-4 text-3xl font-black uppercase leading-tight text-ink-950 md:text-5xl">
            Hệ thống máy hỗ trợ gia công nội thất dự án
          </h2>
          <div class="mt-8 grid gap-3 sm:grid-cols-2">
            <div
              v-for="item in machinery"
              :key="item.name"
              class="border border-ink-200 bg-white p-4"
            >
              <h3 class="text-base font-black text-ink-950">
                {{ item.name }}
              </h3>
              <p class="mt-2 text-sm leading-6 text-ink-600">
                {{ item.description }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="bg-ink-950 px-6 py-16 text-white">
      <div class="section-shell grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <p class="eyebrow text-wood-300">
            Tư vấn dự án
          </p>
          <h2 class="mt-4 max-w-3xl text-3xl font-black uppercase md:text-5xl">
            Gửi bản vẽ để nhận BOQ sơ bộ cho dự án khách sạn
          </h2>
          <p class="mt-4 max-w-2xl text-white/62">
            Đội ngũ Lai Huy Interior sẽ tư vấn phạm vi sản xuất, vật liệu, tiến độ và phương án thi công phù hợp mục tiêu đầu tư.
          </p>
        </div>
        <div class="flex flex-col gap-3 sm:flex-row md:flex-col">
          <NuxtLink
            to="/lien-he"
            class="btn-primary"
          >
            Nhận báo giá trong 24h
          </NuxtLink>
          <NuxtLink
            to="/nha-xuong"
            class="btn-secondary"
          >
            Xem năng lực nhà xưởng
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>
