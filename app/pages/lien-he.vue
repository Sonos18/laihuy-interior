<script setup lang="ts">
import { company } from '~/data/company'
import { uiText } from '~/data/ui'

const { t, ta } = useLanguage()

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
    title: t(address.label),
    lines: [t(address.address)],
    href: address.mapUrl,
    action: t(uiText.labels.openMaps)
  })),
  {
    icon: 'i-lucide-phone',
    title: t(uiText.labels.phone),
    lines: [company.phone],
    href: `tel:${company.phone.replaceAll(' ', '')}`,
    action: t(uiText.labels.callNow)
  },
  {
    icon: 'i-lucide-mail',
    title: t(uiText.labels.email),
    lines: [company.email],
    href: `mailto:${company.email}`,
    action: t(uiText.labels.sendEmail)
  },
  {
    icon: 'i-lucide-clock',
    title: t(uiText.labels.workingHours),
    lines: ta(company.workingHours),
    href: '',
    action: ''
  }
])

const projectTypes = computed(() => [
  t({ vi: 'Thi công nội thất khách sạn', en: 'Hotel interior contracting' }),
  t({ vi: 'Sản xuất nội thất tại xưởng', en: 'Factory furniture production' }),
  t({ vi: 'Villa / căn hộ / nhà phố', en: 'Villa / apartment / townhouse' }),
  t({ vi: 'Thương mại / văn phòng', en: 'Commercial / office' }),
  t({ vi: 'Gia công theo bản vẽ / xuất khẩu', en: 'Production from drawings / export' })
])

const submitForm = () => {
  const subject = t({
    vi: `Yêu cầu tư vấn dự án - ${form.projectType || 'Lai Huy Interior'}`,
    en: `Project consultation request - ${form.projectType || 'Lai Huy Interior'}`
  })
  const body = [
    `${t({ vi: 'Họ tên', en: 'Name' })}: ${form.name}`,
    `Email: ${form.email}`,
    `${t({ vi: 'Điện thoại', en: 'Phone' })}: ${form.phone}`,
    `${t({ vi: 'Loại dự án', en: 'Project type' })}: ${form.projectType}`,
    '',
    `${t({ vi: 'Nội dung', en: 'Message' })}:`,
    form.message
  ].join('\n')

  window.location.href = `mailto:${company.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

const seoTitle = computed(() => t(company.seo.contact.title))
const seoDescription = computed(() => t(company.seo.contact.description))

useSeoMeta({
  title: seoTitle,
  description: seoDescription,
  ogTitle: seoTitle,
  ogDescription: seoDescription,
  ogImage: company.seo.contact.ogImage
})
</script>

<template>
  <div>
    <AppHero
      :topic="t({ vi: 'Liên hệ', en: 'Contact' })"
      :title="t({ vi: 'Liên hệ tư vấn', en: 'Contact' })"
      :special-title="t({ vi: 'dự án', en: 'our team' })"
      :subtitle="t({ vi: 'Gửi bản vẽ, BOQ hoặc thông tin công trình để Lai Huy Interior tư vấn phương án sản xuất và thi công phù hợp.', en: 'Send drawings, BOQ, or project information so Lai Huy Interior can advise on production and installation solutions.' })"
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
        <div class="rounded-2xl border border-ink-200 bg-white p-6 md:p-8">
          <p class="eyebrow">
            {{ t(uiText.cta.quote24h) }}
          </p>
          <h2 class="mt-4 text-3xl font-black uppercase text-ink-950 md:text-5xl">
            {{ t({ vi: 'Gửi yêu cầu tư vấn dự án', en: 'Send a project consultation request' }) }}
          </h2>
          <p class="mt-4 text-sm leading-6 text-ink-600">
            {{ t({ vi: 'Biểu mẫu sẽ mở email trên thiết bị của bạn với nội dung đã điền sẵn. Website hiện chưa kết nối backend gửi form tự động.', en: 'This form opens your email app with a prepared message. The website does not use a fake backend submission.' }) }}
          </p>

          <form
            class="mt-8 space-y-5"
            @submit.prevent="submitForm"
          >
            <div class="grid gap-5 md:grid-cols-2">
              <label class="block">
                <span class="text-sm font-bold text-ink-800">{{ t({ vi: 'Họ tên', en: 'Name' }) }}</span>
                <input
                  v-model="form.name"
                  type="text"
                  required
                  class="mt-2 w-full rounded-2xl border border-ink-200 px-4 py-3 outline-none focus:border-wood-500"
                  :placeholder="t({ vi: 'Tên của bạn', en: 'Your name' })"
                >
              </label>
              <label class="block">
                <span class="text-sm font-bold text-ink-800">{{ t(uiText.labels.phone) }}</span>
                <input
                  v-model="form.phone"
                  type="tel"
                  required
                  class="mt-2 w-full rounded-2xl border border-ink-200 px-4 py-3 outline-none focus:border-wood-500"
                  placeholder="+84..."
                >
              </label>
            </div>

            <div class="grid gap-5 md:grid-cols-2">
              <label class="block">
                <span class="text-sm font-bold text-ink-800">{{ t(uiText.labels.email) }}</span>
                <input
                  v-model="form.email"
                  type="email"
                  required
                  class="mt-2 w-full rounded-2xl border border-ink-200 px-4 py-3 outline-none focus:border-wood-500"
                  placeholder="email@example.com"
                >
              </label>
              <label class="block">
                <span class="text-sm font-bold text-ink-800">{{ t({ vi: 'Loại dự án', en: 'Project type' }) }}</span>
                <select
                  v-model="form.projectType"
                  required
                  class="mt-2 w-full rounded-2xl border border-ink-200 bg-white px-4 py-3 outline-none focus:border-wood-500"
                >
                  <option value="">
                    {{ t({ vi: 'Chọn loại dự án', en: 'Select project type' }) }}
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
              <span class="text-sm font-bold text-ink-800">{{ t({ vi: 'Thông tin công trình', en: 'Project information' }) }}</span>
              <textarea
                v-model="form.message"
                rows="6"
                required
                class="mt-2 w-full resize-none rounded-2xl border border-ink-200 px-4 py-3 outline-none focus:border-wood-500"
                :placeholder="t({ vi: 'Quy mô, số phòng, vật liệu mong muốn, tiến độ dự kiến...', en: 'Scale, room count, preferred materials, target schedule...' })"
              />
            </label>

            <button
              type="submit"
              class="btn-dark w-full"
            >
              {{ t({ vi: 'Gửi yêu cầu qua email', en: 'Send request by email' }) }}
            </button>
          </form>
        </div>

        <div>
          <p class="eyebrow">
            {{ t({ vi: 'Bản đồ', en: 'Map' }) }}
          </p>
          <h2 class="mt-4 text-3xl font-black uppercase text-ink-950 md:text-5xl">
            {{ t({ vi: 'Văn phòng và nhà xưởng', en: 'Office and factory' }) }}
          </h2>
          <a
            :href="company.addresses[1]?.mapUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="mt-8 block overflow-hidden rounded-2xl border border-ink-200 bg-white"
          >
            <img
              src="/images/map_address.png"
              alt="Lai Huy Interior map"
              class="h-80 w-full object-cover"
            >
          </a>
          <div class="mt-6 space-y-4">
            <a
              v-for="address in company.addresses"
              :key="t(address.label)"
              :href="address.mapUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="block rounded-2xl border border-ink-200 bg-white p-5"
            >
              <strong class="text-ink-950">{{ t(address.label) }}</strong>
              <span class="mt-2 block text-sm leading-6 text-ink-600">
                {{ t(address.address) }}
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
