<script setup>
useSeoMeta({
  title: "Trang chủ - Lai Huy Interior | Thiết kế nội thất hiện đại & đẳng cấp",
  description:
    "Thiết kế nội thất hiện đại, sang trọng cho không gian sống của bạn. Chúng tôi cung cấp giải pháp nội thất toàn diện.",
});

const projects = [
  {
    id: 1,
    slug: "hotel-modern",
    title: "Khách Sạn Phong Cách Hiện Đại",
    category: "Khách sạn",
    image: "/images/projects/hotel/reception_desk.jpg",
    description: "Thiết kế khách sạn cao cấp với phong cách hiện đại tối giản",
  },
  {
    id: 2,
    slug: "villa-luxury",
    title: "Biệt Thự Sang Trọng",
    category: "Biệt Thự",
    image: "/images/projects/villa/bed.png",
    description: "Biệt thự sang trọng với thiết kế đẳng cấp quốc tế",
  },
  {
    id: 3,
    slug: "office-modern",
    title: "Không Gian Làm Việc Hiện Đại",
    category: "Văn Phòng",
    image: "/images/projects/office/long_desk.jpg",
    description: "Thiết kế văn phòng tối ưu hiệu suất làm việc",
  },
];

const services = [
  {
    icon: "i-lucide-pencil-ruler",
    title: "Tư vấn Thiết kế",
    description:
      "Tư vấn miễn phí về phong cách, màu sắc, vật liệu và bố cục không gian phù hợp nhất.",
  },
  {
    icon: "i-lucide-hammer",
    title: "Thi Công Cải Tạo",
    description:
      "Thi công chất lượng cao với đội ngũ kỹ thuật viên giàu kinh nghiệm và tận tâm.",
  },
  {
    icon: "i-lucide-home",
    title: "Nội Thất Trọn Gói",
    description:
      "Quản lý toàn bộ dự án từ lên kế hoạch, thiết kế đến hoàn thiện chi tiết cuối cùng.",
  },
];

const reasons = [
  {
    num: "01",
    icon: "i-lucide-gem",
    title: "Chất Lượng Cao Cấp",
    description:
      "Sử dụng vật liệu cao cấp nhập khẩu và kỹ thuật thi công tiên tiến nhất.",
  },
  {
    num: "02",
    icon: "i-lucide-users",
    title: "Đội Ngũ Chuyên Nghiệp",
    description:
      "Kiến trúc sư và nhà thiết kế giàu kinh nghiệm, sáng tạo không ngừng.",
  },
  {
    num: "03",
    icon: "i-lucide-clock",
    title: "Cam Kết Đúng Hẹn",
    description:
      "Luôn đảm bảo tiến độ dự án đúng kế hoạch, không phát sinh chi phí.",
  },
  {
    num: "04",
    icon: "i-lucide-heart",
    title: "Hỗ Trợ Tận Tâm",
    description:
      "Đồng hành cùng khách hàng từ ý tưởng ban đầu đến khi hoàn thiện.",
  },
];

// Scroll reveal refs
const featuredHeaderRef = ref(null);
const featuredLargeRef = ref(null);
const featuredSmallRefs = ref([]);
const servicesHeaderRef = ref(null);
const serviceCardRefs = ref([]);
const aboutImageRef = ref(null);
const aboutTextRef = ref(null);
const whyHeaderRef = ref(null);
const reasonCardRefs = ref([]);
const ctaRef = ref(null);

useScrollReveal(featuredHeaderRef);
useScrollReveal(featuredLargeRef);
useScrollReveal(servicesHeaderRef);
useScrollReveal(aboutImageRef, { direction: "left" });
useScrollReveal(aboutTextRef, { direction: "right" });
useScrollReveal(whyHeaderRef);
useScrollReveal(ctaRef);

// v-for items with staggered delays
projects.slice(1).forEach((_, index) => {
  useScrollReveal(
    computed(() => featuredSmallRefs.value[index]),
    { delay: (index + 1) * 150 },
  );
});

services.forEach((_, index) => {
  useScrollReveal(
    computed(() => serviceCardRefs.value[index]),
    { delay: index * 150 },
  );
});

reasons.forEach((_, index) => {
  useScrollReveal(
    computed(() => reasonCardRefs.value[index]),
    { delay: index * 100 },
  );
});
</script>

<template>
  <div>
    <!-- ==================== HERO ==================== -->
    <section class="relative min-h-screen flex items-center overflow-hidden">
      <!-- Background Image -->
      <img
        src="/images/banner_home.jpg"
        alt=""
        class="absolute inset-0 w-full h-full object-cover"
      />
      <div class="hero-overlay" />

      <!-- Decorative Elements -->
      <div
        class="absolute top-1/4 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"
      />
      <div
        class="absolute bottom-1/3 left-1/3 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl"
      />

      <!-- Content -->
      <div class="relative z-10 max-w-7xl mx-auto px-6 w-full pt-32 pb-40">
        <div class="max-w-2xl">
          <span
            class="inline-block text-orange-400 uppercase tracking-[0.2em] text-xs font-semibold mb-6 animate-fade-in-up"
            style="animation-delay: 0ms"
          >
            Interior Design Studio
          </span>

          <h1
            class="text-5xl md:text-7xl font-bold text-white leading-[1.1] mb-8 animate-fade-in-up"
            style="animation-delay: 150ms"
          >
            Thiết kế
            <br />
            nội thất
            <span
              class="text-transparent bg-clip-text bg-linear-to-r from-orange-400 to-orange-500"
            >
              hiện đại
            </span>
            <br />
            & đẳng cấp
          </h1>

          <p
            class="text-lg md:text-xl text-gray-300 mb-10 max-w-lg leading-relaxed animate-fade-in-up"
            style="animation-delay: 300ms"
          >
            Chúng tôi biến không gian thành những tác phẩm nghệ thuật sống động,
            nơi mỗi chi tiết đều mang dấu ấn cá nhân.
          </p>

          <div
            class="flex flex-col sm:flex-row gap-4 animate-fade-in-up"
            style="animation-delay: 450ms"
          >
            <NuxtLink to="/du-an" class="btn-primary">
              Khám phá dự án
            </NuxtLink>
            <NuxtLink
              to="/lien-he"
              class="btn-secondary border-white/30 text-white hover:bg-white hover:text-gray-900 hover:border-white"
            >
              Liên hệ tư vấn
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Stats Bar -->
      <div
        class="absolute bottom-0 left-0 right-0 bg-white/5 backdrop-blur-md border-t border-white/10"
      >
        <div
          class="max-w-7xl mx-auto px-6 py-6 grid grid-cols-3 divide-x divide-white/10"
        >
          <div
            class="text-center px-4 animate-fade-in"
            style="animation-delay: 600ms"
          >
            <div class="text-3xl md:text-4xl font-bold text-orange-400">
              15+
            </div>
            <div class="text-xs md:text-sm text-gray-400 mt-1">
              Năm kinh nghiệm
            </div>
          </div>
          <div
            class="text-center px-4 animate-fade-in"
            style="animation-delay: 750ms"
          >
            <div class="text-3xl md:text-4xl font-bold text-orange-400">
              500+
            </div>
            <div class="text-xs md:text-sm text-gray-400 mt-1">
              Dự án hoàn thành
            </div>
          </div>
          <div
            class="text-center px-4 animate-fade-in"
            style="animation-delay: 900ms"
          >
            <div class="text-3xl md:text-4xl font-bold text-orange-400">
              100%
            </div>
            <div class="text-xs md:text-sm text-gray-400 mt-1">
              Khách hàng hài lòng
            </div>
          </div>
        </div>
      </div>

      <!-- Scroll Indicator -->
      <div
        class="absolute bottom-24 left-1/2 -translate-x-1/2 animate-bounce hidden md:block"
      >
        <Icon name="i-lucide-chevron-down" class="w-6 h-6 text-white/50" />
      </div>
    </section>

    <!-- ==================== FEATURED PROJECTS ==================== -->
    <section class="section-spacing bg-white">
      <div class="max-w-7xl mx-auto">
        <!-- Section Header -->
        <div ref="featuredHeaderRef">
          <div
            class="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16"
          >
            <div>
              <span
                class="text-orange-500 uppercase tracking-[0.2em] text-xs font-semibold"
              >
                Dự án nổi bật
              </span>
              <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mt-3">
                Những Dự Án
                <span class="text-orange-500">Tiêu Biểu</span>
              </h2>
            </div>
            <NuxtLink
              to="/du-an"
              class="group flex items-center gap-2 text-orange-500 font-semibold hover:gap-3 transition-all"
            >
              Xem tất cả
              <Icon
                name="i-lucide-arrow-right"
                class="w-4 h-4 transition-transform group-hover:translate-x-1"
              />
            </NuxtLink>
          </div>
        </div>

        <!-- Bento Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-6">
          <!-- Large Project Card -->
          <div ref="featuredLargeRef" class="md:col-span-2 md:row-span-2">
            <NuxtLink
              :to="`/du-an/${projects[0].slug}`"
              class="group relative block h-80 md:h-full min-h-100 rounded-2xl overflow-hidden"
            >
              <BaseImage
                :src="projects[0].image"
                :alt="projects[0].title"
                class="absolute inset-0"
                img-class="group-hover:scale-110 transition-transform duration-700"
              />
              <div
                class="absolute inset-0 bg-linear-to-t from-gray-950/80 via-gray-950/20 to-transparent"
              />
              <div
                class="absolute inset-0 bg-orange-500/0 group-hover:bg-orange-500/20 transition-colors duration-500"
              />

              <!-- Center Icon -->
              <div
                class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 scale-50 group-hover:scale-100 transition-all duration-500"
              >
                <div
                  class="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
                >
                  <Icon
                    name="i-lucide-arrow-up-right"
                    class="w-7 h-7 text-white"
                  />
                </div>
              </div>

              <!-- Content -->
              <div class="absolute bottom-0 left-0 right-0 p-8">
                <span class="text-orange-300 text-sm font-semibold">
                  {{ projects[0].category }}
                </span>
                <h3 class="text-white text-2xl md:text-3xl font-bold mt-2">
                  {{ projects[0].title }}
                </h3>
                <p
                  class="text-white/70 mt-2 max-w-md opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500"
                >
                  {{ projects[0].description }}
                </p>
              </div>
            </NuxtLink>
          </div>

          <!-- Small Project Cards -->
          <div
            v-for="(project, index) in projects.slice(1)"
            :key="project.id"
            :ref="
              (el) => {
                if (el) featuredSmallRefs[index] = el;
              }
            "
          >
            <NuxtLink
              :to="`/du-an/${project.slug}`"
              class="group relative block h-80 rounded-2xl overflow-hidden"
            >
              <BaseImage
                :src="project.image"
                :alt="project.title"
                class="absolute inset-0"
                img-class="group-hover:scale-110 transition-transform duration-700"
              />
              <div
                class="absolute inset-0 bg-linear-to-t from-gray-950/80 via-gray-950/20 to-transparent"
              />
              <div
                class="absolute inset-0 bg-orange-500/0 group-hover:bg-orange-500/20 transition-colors duration-500"
              />

              <div class="absolute bottom-0 left-0 right-0 p-6">
                <span class="text-orange-300 text-sm font-semibold">
                  {{ project.category }}
                </span>
                <h3 class="text-white text-xl font-bold mt-1">
                  {{ project.title }}
                </h3>
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- ==================== SERVICES ==================== -->
    <section class="section-spacing bg-gray-50">
      <div class="max-w-7xl mx-auto">
        <!-- Section Header -->
        <div ref="servicesHeaderRef">
          <div class="text-center mb-16">
            <span
              class="text-orange-500 uppercase tracking-[0.2em] text-xs font-semibold"
            >
              Dịch vụ
            </span>
            <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mt-3">
              Giải Pháp Nội Thất
              <span class="text-orange-500">Toàn Diện</span>
            </h2>
            <p class="text-gray-500 mt-4 max-w-2xl mx-auto text-lg">
              Từ ý tưởng ban đầu đến khi hoàn thiện, chúng tôi đồng hành cùng
              bạn trong từng bước
            </p>
          </div>
        </div>

        <!-- Service Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div
            v-for="(service, index) in services"
            :key="service.title"
            :ref="
              (el) => {
                if (el) serviceCardRefs[index] = el;
              }
            "
          >
            <div
              class="group relative bg-white border border-gray-100 rounded-2xl p-8 hover:shadow-2xl transition-all duration-500 overflow-hidden"
            >
              <!-- Animated top line -->
              <div
                class="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-orange-400 to-orange-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
              />

              <!-- Icon -->
              <div
                class="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center mb-6 group-hover:bg-orange-500 group-hover:scale-110 transition-all duration-300"
              >
                <Icon
                  :name="service.icon"
                  class="w-7 h-7 text-orange-500 group-hover:text-white transition-colors"
                />
              </div>

              <h3 class="text-xl font-bold text-gray-900 mb-3">
                {{ service.title }}
              </h3>
              <p class="text-gray-500 leading-relaxed">
                {{ service.description }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ==================== ABOUT ==================== -->
    <section class="section-spacing bg-white">
      <div class="max-w-7xl mx-auto">
        <div
          class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center"
        >
          <!-- Image with decorative accent -->
          <div ref="aboutImageRef">
            <div class="relative">
              <BaseImage
                src="/images/about_workspace.jpg"
                alt="Lai Huy Interior workspace"
                class="rounded-2xl aspect-4/5 w-full"
              />
              <!-- Orange accent block -->
              <div
                class="absolute -bottom-6 -right-6 w-40 h-40 bg-linear-to-br from-orange-400 to-orange-500 rounded-2xl -z-10"
              />
              <!-- Small floating card -->
              <div
                class="absolute -bottom-4 left-6 bg-white rounded-xl shadow-xl p-4 flex items-center gap-3"
              >
                <div
                  class="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center"
                >
                  <Icon name="i-lucide-award" class="w-6 h-6 text-white" />
                </div>
                <div>
                  <div class="text-2xl font-bold text-gray-900">15+</div>
                  <div class="text-xs text-gray-500">Năm kinh nghiệm</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Text Content -->
          <div ref="aboutTextRef">
            <div>
              <span
                class="text-orange-500 uppercase tracking-[0.2em] text-xs font-semibold"
              >
                Về chúng tôi
              </span>
              <h2
                class="text-4xl md:text-5xl font-bold text-gray-900 mt-3 mb-6"
              >
                Lai Huy
                <span class="text-orange-500">Interior</span>
              </h2>
              <p class="text-gray-500 text-lg leading-relaxed mb-4">
                Với hơn 15 năm kinh nghiệm trong lĩnh vực thiết kế nội thất, Lai
                Huy đã tạo nên những không gian sống tinh tế, đẳng cấp cho hàng
                nghìn gia đình và doanh nghiệp.
              </p>
              <p class="text-gray-500 text-lg leading-relaxed mb-10">
                Chúng tôi tin rằng thiết kế tốt không chỉ là về thẩm mỹ, mà còn
                về việc tạo ra những không gian nơi mọi người yêu thích để sống
                và làm việc.
              </p>

              <!-- Stats -->
              <div class="grid grid-cols-2 gap-6">
                <div class="border-l-4 border-orange-500 pl-4">
                  <div class="text-3xl font-bold text-gray-900">500+</div>
                  <div class="text-sm text-gray-500">Dự án hoàn thành</div>
                </div>
                <div class="border-l-4 border-orange-300 pl-4">
                  <div class="text-3xl font-bold text-gray-900">100%</div>
                  <div class="text-sm text-gray-500">Khách hàng hài lòng</div>
                </div>
              </div>

              <NuxtLink
                to="/gioi-thieu"
                class="btn-primary inline-flex items-center gap-2 mt-10"
              >
                Tìm hiểu thêm
                <Icon name="i-lucide-arrow-right" class="w-4 h-4" />
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ==================== WHY CHOOSE US ==================== -->
    <section class="section-spacing bg-gray-50">
      <div class="max-w-7xl mx-auto">
        <div ref="whyHeaderRef">
          <div class="text-center mb-16">
            <span
              class="text-orange-500 uppercase tracking-[0.2em] text-xs font-semibold"
            >
              Tại sao chọn chúng tôi
            </span>
            <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mt-3">
              Sự Khác Biệt Của
              <span class="text-orange-500">Lai Huy</span>
            </h2>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div
            v-for="(reason, index) in reasons"
            :key="reason.num"
            :ref="
              (el) => {
                if (el) reasonCardRefs[index] = el;
              }
            "
          >
            <div
              class="group text-center p-8 rounded-2xl hover:bg-white hover:shadow-xl transition-all duration-500"
            >
              <!-- Number -->
              <div
                class="text-5xl font-bold text-orange-500/20 group-hover:text-orange-500/40 transition-colors mb-4"
              >
                {{ reason.num }}
              </div>

              <!-- Icon -->
              <div
                class="w-14 h-14 rounded-full bg-orange-50 flex items-center justify-center mx-auto mb-5 group-hover:bg-orange-500 transition-colors duration-300"
              >
                <Icon
                  :name="reason.icon"
                  class="w-6 h-6 text-orange-500 group-hover:text-white transition-colors"
                />
              </div>

              <h3 class="text-lg font-bold text-gray-900 mb-3">
                {{ reason.title }}
              </h3>
              <p class="text-gray-500 text-sm leading-relaxed">
                {{ reason.description }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ==================== CTA ==================== -->
    <section class="relative py-24 md:py-32 overflow-hidden">
      <!-- Orange Gradient Background -->
      <div
        class="absolute inset-0 bg-linear-to-br from-orange-500 via-orange-500 to-orange-600"
      />

      <!-- Decorative Elements -->
      <div
        class="absolute top-0 right-0 w-125 h-125 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"
      />
      <div
        class="absolute bottom-0 left-0 w-100 h-100 bg-orange-400/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"
      />

      <!-- Content -->
      <div ref="ctaRef">
        <div class="relative z-10 max-w-4xl mx-auto text-center px-6">
          <h2 class="text-4xl md:text-5xl font-bold text-white mb-6">
            Sẵn sàng biến đổi
            <br class="hidden md:block" />
            không gian của bạn?
          </h2>
          <p class="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            Hãy liên hệ với chúng tôi ngay hôm nay để nhận tư vấn thiết kế miễn
            phí và bắt đầu hành trình tạo nên không gian mơ ước.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <NuxtLink
              to="/lien-he"
              class="inline-block bg-white text-orange-600 hover:bg-gray-50 px-10 py-4 rounded-full font-bold text-lg transition-colors shadow-lg"
            >
              Liên hệ ngay
            </NuxtLink>
            <NuxtLink
              to="/du-an"
              class="inline-block border-2 border-white/40 text-white hover:bg-white/10 px-10 py-4 rounded-full font-bold text-lg transition-colors"
            >
              Xem dự án
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
