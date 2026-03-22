<script setup>
useHead({
  meta: [{ name: "viewport", content: "width=device-width, initial-scale=1" }],
  link: [{ rel: "icon", href: "/favicon.ico" }],
  htmlAttrs: {
    lang: "vi",
  },
});

const title = "Lai Huy Interior - Thiết kế nội thất hiện đại & đẳng cấp";
const description =
  "Thiết kế nội thất hiện đại, sang trọng và đẳng cấp cho không gian sống của bạn. Chúng tôi mang lại giải pháp nội thất toàn diện từ tư vấn đến thi công.";

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  twitterCard: "summary_large_image",
});

const route = useRoute();
const isScrolled = ref(false);
const isMobileMenuOpen = ref(false);
const isHome = computed(() => route.path === "/");

function onScroll() {
  isScrolled.value = window.scrollY > 50;
}

onMounted(() => {
  window.addEventListener("scroll", onScroll, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener("scroll", onScroll);
});

watch(
  () => route.path,
  () => {
    isMobileMenuOpen.value = false;
  },
);

watch(isMobileMenuOpen, (val) => {
  if (import.meta.client) {
    document.body.style.overflow = val ? "hidden" : "";
  }
});

const navLinks = [
  { label: "Trang chủ", to: "/" },
  { label: "Giới thiệu", to: "/gioi-thieu" },
  { label: "Dự án", to: "/du-an" },
  { label: "Liên hệ", to: "/lien-he" },
];
</script>

<template>
  <div class="min-h-screen flex flex-col bg-white">
    <!-- Header -->
    <header
      class="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      :class="[
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm'
          : isHome
            ? 'bg-transparent'
            : 'bg-white shadow-sm',
      ]"
    >
      <nav
        class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between"
      >
        <!-- Logo -->
        <NuxtLink to="/" class="shrink-0">
          <img
            src="/images/logo.png"
            alt="Lai Huy Interior"
            class="h-10 w-auto transition-all duration-300"
            :class="{ 'brightness-0 invert': isHome && !isScrolled }"
          />
        </NuxtLink>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center gap-1">
          <NuxtLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            class="relative px-4 py-2 text-sm font-medium transition-colors duration-300 rounded-full"
            :class="[
              isScrolled || !isHome
                ? 'text-gray-700 hover:text-orange-500 hover:bg-orange-50'
                : 'text-white/80 hover:text-white hover:bg-white/10',
              route.path === link.to
                ? isScrolled || !isHome
                  ? 'text-orange-500 bg-orange-50'
                  : 'text-white bg-white/15'
                : '',
            ]"
          >
            {{ link.label }}
          </NuxtLink>

          <NuxtLink
            to="/lien-he"
            class="ml-4 px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300"
            :class="[
              isScrolled || !isHome
                ? 'bg-orange-500 text-white hover:bg-orange-600'
                : 'bg-white/15 text-white backdrop-blur-sm hover:bg-white/25 border border-white/20',
            ]"
          >
            Tư vấn miễn phí
          </NuxtLink>
        </div>

        <!-- Mobile Menu Button -->
        <button
          class="md:hidden p-2 rounded-lg transition-colors"
          :class="[
            isScrolled || !isHome
              ? 'text-gray-700 hover:bg-gray-100'
              : 'text-white hover:bg-white/10',
          ]"
          @click="isMobileMenuOpen = true"
        >
          <Icon name="i-lucide-menu" class="w-6 h-6" />
        </button>
      </nav>
    </header>

    <!-- Mobile Menu Backdrop -->
    <Transition name="fade">
      <div
        v-if="isMobileMenuOpen"
        class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden"
        @click="isMobileMenuOpen = false"
      />
    </Transition>

    <!-- Mobile Menu Panel -->
    <Transition name="slide-right">
      <nav
        v-if="isMobileMenuOpen"
        class="fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-white z-50 md:hidden flex flex-col shadow-2xl"
      >
        <!-- Close -->
        <div
          class="flex items-center justify-between p-6 border-b border-gray-100"
        >
          <img
            src="/images/logo.png"
            alt="Lai Huy Interior"
            class="h-8 w-auto"
          />
          <button
            class="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
            @click="isMobileMenuOpen = false"
          >
            <Icon name="i-lucide-x" class="w-5 h-5" />
          </button>
        </div>

        <!-- Links -->
        <div class="flex-1 py-6 px-6 space-y-1">
          <NuxtLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            class="block px-4 py-3 rounded-xl text-base font-medium transition-colors"
            :class="[
              route.path === link.to
                ? 'text-orange-500 bg-orange-50'
                : 'text-gray-700 hover:text-orange-500 hover:bg-orange-50',
            ]"
          >
            {{ link.label }}
          </NuxtLink>
        </div>

        <!-- CTA -->
        <div class="p-6 border-t border-gray-100">
          <NuxtLink
            to="/lien-he"
            class="block w-full text-center bg-orange-500 text-white py-3 rounded-full font-semibold hover:bg-orange-600 transition-colors"
          >
            Tư vấn miễn phí
          </NuxtLink>
        </div>
      </nav>
    </Transition>

    <!-- Main Content -->
    <main class="grow">
      <NuxtPage />
    </main>

    <!-- Footer -->
    <footer class="bg-gray-950 text-white">
      <!-- Main Footer -->
      <div class="max-w-7xl mx-auto px-6 pt-20 pb-12">
        <div
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16"
        >
          <!-- Brand -->
          <div class="lg:col-span-1">
            <h3 class="text-2xl font-bold mb-3">
              Lai <span class="text-orange-500">Huy</span>
            </h3>
            <p class="text-gray-400 text-sm leading-relaxed mb-6">
              Thiết kế nội thất hiện đại & đẳng cấp. Biến không gian sống thành
              tác phẩm nghệ thuật.
            </p>
            <div class="flex gap-3">
              <a
                href="#"
                class="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-orange-500 transition-colors"
              >
                <Icon name="i-simple-icons-facebook" class="w-4 h-4" />
              </a>
              <a
                href="#"
                class="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-orange-500 transition-colors"
              >
                <Icon name="i-simple-icons-instagram" class="w-4 h-4" />
              </a>
            </div>
          </div>

          <!-- Quick Links -->
          <div>
            <h4
              class="font-semibold mb-5 text-sm uppercase tracking-wider text-gray-300"
            >
              Điều hướng
            </h4>
            <ul class="space-y-3">
              <li v-for="link in navLinks" :key="link.to">
                <NuxtLink
                  :to="link.to"
                  class="text-gray-400 hover:text-orange-400 transition-colors text-sm"
                >
                  {{ link.label }}
                </NuxtLink>
              </li>
            </ul>
          </div>

          <!-- Services -->
          <div>
            <h4
              class="font-semibold mb-5 text-sm uppercase tracking-wider text-gray-300"
            >
              Dịch vụ
            </h4>
            <ul class="space-y-3 text-gray-400 text-sm">
              <li>Tư vấn thiết kế</li>
              <li>Thi công cải tạo</li>
              <li>Quản lý dự án</li>
              <li>Nội thất trọn gói</li>
            </ul>
          </div>

          <!-- Contact -->
          <div>
            <h4
              class="font-semibold mb-5 text-sm uppercase tracking-wider text-gray-300"
            >
              Liên hệ
            </h4>
            <ul class="space-y-3 text-gray-400 text-sm">
              <li class="flex items-center gap-2">
                <Icon name="i-lucide-phone" class="w-4 h-4 text-orange-500" />
                +84 (0) 903 102 012
              </li>
              <li class="flex items-center gap-2">
                <Icon name="i-lucide-mail" class="w-4 h-4 text-orange-500" />
                noithatlaihuy@gmail.com
              </li>
              <li class="flex items-start gap-2">
                <Icon
                  name="i-lucide-map-pin"
                  class="w-4 h-4 text-orange-500 mt-0.5"
                />

                557E1 - KP2 - Phường Phú Khương - TP. Bến Tre - Bến Tre, Tỉnh
                Bến Tre, Vietnam, 930000
              </li>
            </ul>
          </div>
        </div>

        <!-- Bottom Bar -->
        <div
          class="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-gray-500 text-sm"
        >
          <p>
            &copy; {{ new Date().getFullYear() }} Lai Huy Interior. Tất cả quyền
            được bảo lưu.
          </p>
          <p class="text-gray-600">
            Thiết kế với
            <span class="text-orange-500">&hearts;</span>
            tại Việt Nam
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>
