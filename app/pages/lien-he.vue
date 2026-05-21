<script setup lang="ts">
import { company } from '~/data/company'

const form = reactive({
  name: '',
  email: '',
  phone: '',
  projectType: '',
  message: ''
})

const contactCards = computed(() => [
  ...company.addresses.map(address => ({
    icon: 'i-lucide-map-pin',
    title: address.label,
    lines: [address.address],
    href: address.mapUrl,
    action: 'Mở Google Maps'
  })),
  {
    icon: 'i-lucide-phone',
    title: 'Điện thoại',
    lines: [company.phone],
    href: `tel:${company.phone.replaceAll(' ', '')}`,
    action: 'Gọi ngay'
  },
  {
    icon: 'i-lucide-mail',
    title: 'Email',
    lines: [company.email],
    href: `mailto:${company.email}`,
    action: 'Gửi email'
  },
  {
    icon: 'i-lucide-clock',
    title: 'Giờ làm việc',
    lines: company.workingHours,
    href: '',
    action: ''
  }
])

const projectTypes = [
  'Thi công nội thất khách sạn',
  'Sản xuất nội thất tại xưởng',
  'Villa / căn hộ / nhà phố',
  'Thương mại / văn phòng',
  'Gia công theo bản vẽ / xuất khẩu'
]

const submitForm = () => {
  const subject = `Yêu cầu tư vấn dự án - ${form.projectType || 'Lai Huy Interior'}`
  const body = [
    `Họ tên: ${form.name}`,
    `Email: ${form.email}`,
    `Điện thoại: ${form.phone}`,
    `Loại dự án: ${form.projectType}`,
    '',
    'Nội dung:',
    form.message
  ].join('\n')

  window.location.href = `mailto:${company.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

useSeoMeta({
  title: company.seo.contact.title,
  description: company.seo.contact.description,
  ogTitle: company.seo.contact.title,
  ogDescription: company.seo.contact.description,
  ogImage: company.seo.contact.ogImage
})
</script>

<template>
  <div>
    <AppHero
      topic="Contact"
      title="Liên hệ tư vấn"
      special-title="dự án"
      subtitle="Gửi bản vẽ, BOQ hoặc thông tin công trình để Lai Huy Interior tư vấn phương án sản xuất và thi công phù hợp."
      bg-image="/images/projects/house/anhduy_house/gieng_troi.jpg"
    />

    <section class="section-spacing bg-white">
      <div class="section-shell">
        <div class="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <article
            v-for="card in contactCards"
            :key="card.title"
            class="industrial-card"
          >
            <Icon
              :name="card.icon"
              class="h-7 w-7 text-wood-500"
            />
            <h2 class="mt-5 text-xl font-black text-ink-950">
              {{ card.title }}
            </h2>
            <p
              v-for="line in card.lines"
              :key="line"
              class="mt-2 text-sm leading-6 text-ink-600"
            >
              {{ line }}
            </p>
            <a
              v-if="card.href"
              :href="card.href"
              target="_blank"
              rel="noopener noreferrer"
              class="mt-5 inline-flex text-sm font-bold text-wood-600"
            >
              {{ card.action }}
            </a>
          </article>
        </div>
      </div>
    </section>

    <section class="section-spacing bg-ink-50">
      <div class="section-shell grid gap-12 lg:grid-cols-[1fr_0.9fr]">
        <div class="border border-ink-200 bg-white p-6 md:p-8">
          <p class="eyebrow">
            Nhận báo giá trong 24h
          </p>
          <h2 class="mt-4 text-3xl font-black uppercase text-ink-950 md:text-5xl">
            Gửi yêu cầu tư vấn dự án
          </h2>
          <p class="mt-4 text-sm leading-6 text-ink-600">
            Biểu mẫu sẽ mở email trên thiết bị của bạn với nội dung đã điền sẵn. Website hiện chưa kết nối backend gửi form tự động.
          </p>

          <form
            class="mt-8 space-y-5"
            @submit.prevent="submitForm"
          >
            <div class="grid gap-5 md:grid-cols-2">
              <label class="block">
                <span class="text-sm font-bold text-ink-800">Họ tên</span>
                <input
                  v-model="form.name"
                  type="text"
                  required
                  class="mt-2 w-full border border-ink-200 px-4 py-3 outline-none focus:border-wood-500"
                  placeholder="Tên của bạn"
                >
              </label>
              <label class="block">
                <span class="text-sm font-bold text-ink-800">Điện thoại</span>
                <input
                  v-model="form.phone"
                  type="tel"
                  required
                  class="mt-2 w-full border border-ink-200 px-4 py-3 outline-none focus:border-wood-500"
                  placeholder="+84..."
                >
              </label>
            </div>

            <div class="grid gap-5 md:grid-cols-2">
              <label class="block">
                <span class="text-sm font-bold text-ink-800">Email</span>
                <input
                  v-model="form.email"
                  type="email"
                  required
                  class="mt-2 w-full border border-ink-200 px-4 py-3 outline-none focus:border-wood-500"
                  placeholder="email@example.com"
                >
              </label>
              <label class="block">
                <span class="text-sm font-bold text-ink-800">Loại dự án</span>
                <select
                  v-model="form.projectType"
                  required
                  class="mt-2 w-full border border-ink-200 bg-white px-4 py-3 outline-none focus:border-wood-500"
                >
                  <option value="">
                    Chọn loại dự án
                  </option>
                  <option
                    v-for="type in projectTypes"
                    :key="type"
                    :value="type"
                  >
                    {{ type }}
                  </option>
                </select>
              </label>
            </div>

            <label class="block">
              <span class="text-sm font-bold text-ink-800">Thông tin công trình</span>
              <textarea
                v-model="form.message"
                rows="6"
                required
                class="mt-2 w-full resize-none border border-ink-200 px-4 py-3 outline-none focus:border-wood-500"
                placeholder="Quy mô, số phòng, vật liệu mong muốn, tiến độ dự kiến..."
              />
            </label>

            <button
              type="submit"
              class="btn-dark w-full"
            >
              Gửi yêu cầu qua email
            </button>
          </form>
        </div>

        <div>
          <p class="eyebrow">
            Bản đồ
          </p>
          <h2 class="mt-4 text-3xl font-black uppercase text-ink-950 md:text-5xl">
            Văn phòng và nhà xưởng
          </h2>
          <a
            :href="company.addresses[1]?.mapUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="mt-8 block overflow-hidden border border-ink-200 bg-white"
          >
            <img
              src="/images/map_address.png"
              alt="Bản đồ Lai Huy Interior"
              class="h-80 w-full object-cover"
            >
          </a>
          <div class="mt-6 space-y-4">
            <a
              v-for="address in company.addresses"
              :key="address.label"
              :href="address.mapUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="block border border-ink-200 bg-white p-5"
            >
              <strong class="text-ink-950">{{ address.label }}</strong>
              <span class="mt-2 block text-sm leading-6 text-ink-600">
                {{ address.address }}
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
