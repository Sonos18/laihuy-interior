<script setup>
useHead({
  meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
  link: [{ rel: 'icon', href: '/favicon.ico' }],
  htmlAttrs: {
    lang: 'vi'
  }
})

const title = 'Lai Huy Interior - Thiết kế nội thất hiện đại & đẳng cấp'
const description
  = 'Thiết kế nội thất hiện đại, sang trọng và đẳng cấp cho không gian sống của bạn. Chúng tôi mang lại giải pháp nội thất toàn diện từ tư vấn đến thi công.'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  twitterCard: 'summary_large_image'
})

const isHeaderSolid = ref(false)

onMounted(() => {
  window.addEventListener('scroll', () => {
    isHeaderSolid.value = window.scrollY > 10
  })
})
</script>

<template>
  <div class="min-h-screen flex flex-col bg-white">
    <!-- Header -->
    <header
      class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      :class="isHeaderSolid ? 'bg-white shadow-md' : 'bg-transparent'"
    >
      <nav
        class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between"
      >
        <!-- Logo -->
        <NuxtLink
          to="/"
          class="shrink-0"
        >
          <div class="text-2xl font-bold text-slate-900">Lai Huy</div>
        </NuxtLink>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center gap-8">
          <NuxtLink
            to="/"
            class="text-slate-700 hover:text-orange-500 transition-colors font-medium relative group"
          >
            Trang chủ
            <span
              class="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-500 group-hover:w-full transition-all duration-300"
            />
          </NuxtLink>
          <NuxtLink
            to="/gioi-thieu"
            class="text-slate-700 hover:text-orange-500 transition-colors font-medium relative group"
          >
            Giới thiệu
            <span
              class="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-500 group-hover:w-full transition-all duration-300"
            />
          </NuxtLink>
          <NuxtLink
            to="/du-an"
            class="text-slate-700 hover:text-orange-500 transition-colors font-medium relative group"
          >
            Dự án
            <span
              class="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-500 group-hover:w-full transition-all duration-300"
            />
          </NuxtLink>
          <NuxtLink
            to="/lien-he"
            class="text-slate-700 hover:text-orange-500 transition-colors font-medium relative group"
          >
            Liên hệ
            <span
              class="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-500 group-hover:w-full transition-all duration-300"
            />
          </NuxtLink>
        </div>

        <!-- Mobile Menu Button -->
        <div class="md:hidden">
          <UButton
            icon="i-lucide-menu"
            color="slate"
            variant="ghost"
            size="lg"
          />
        </div>
      </nav>
    </header>

    <!-- Main Content -->
    <main class="grow pt-20">
      <NuxtPage />
    </main>

    <!-- Footer -->
    <footer class="bg-slate-900 text-white py-16 px-6">
      <div class="max-w-7xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 class="text-2xl font-bold mb-2">
              Lai Huy
            </h3>
            <p class="text-gray-300 text-sm">
              Thiết kế nội thất hiện đại & đẳng cấp
            </p>
          </div>
          <div>
            <h4 class="font-semibold mb-4">
              Công ty
            </h4>
            <ul class="space-y-2 text-gray-300 text-sm">
              <li>
                <NuxtLink
                  to="/"
                  class="hover:text-orange-500 transition-colors"
                >Trang chủ</NuxtLink>
              </li>
              <li>
                <NuxtLink
                  to="/gioi-thieu"
                  class="hover:text-orange-500 transition-colors"
                >Về chúng tôi</NuxtLink>
              </li>
              <li>
                <NuxtLink
                  to="/du-an"
                  class="hover:text-orange-500 transition-colors"
                >Dự án</NuxtLink>
              </li>
            </ul>
          </div>
          <div>
            <h4 class="font-semibold mb-4">
              Liên hệ
            </h4>
            <ul class="space-y-2 text-gray-300 text-sm">
              <li>+84 (0) 123 456 789</li>
              <li>info@laihuy.vn</li>
              <li>TP. Hồ Chí Minh, Việt Nam</li>
            </ul>
          </div>
          <div>
            <h4 class="font-semibold mb-4">
              Theo dõi
            </h4>
            <div class="flex gap-4">
              <a
                href="#"
                class="text-gray-300 hover:text-orange-500 transition-colors"
              >
                <Icon
                  name="i-simple-icons-facebook"
                  class="w-5 h-5"
                />
              </a>
              <a
                href="#"
                class="text-gray-300 hover:text-orange-500 transition-colors"
              >
                <Icon
                  name="i-simple-icons-instagram"
                  class="w-5 h-5"
                />
              </a>
            </div>
          </div>
        </div>

        <div
          class="border-t border-gray-700 pt-8 text-center text-gray-400 text-sm"
        >
          <p>
            &copy; {{ new Date().getFullYear() }} Lai Huy Interior. Tất cả quyền
            được bảo lưu.
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>
