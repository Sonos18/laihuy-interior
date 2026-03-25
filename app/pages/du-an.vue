<script setup>
useSeoMeta({
  title: "Dự Án - Lai Huy Interior | Xem các dự án thiết kế nội thất",
  description:
    "Khám phá những dự án thiết kế nội thất nổi bật của Lai Huy Interior",
});

const projects = [
  {
    id: 1,
    slug: "apartment-modern",
    title: "Căn Hộ Phong Cách Hiện Đại",
    category: "Căn Hộ",
    image:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop",
    description: "Thiết kế căn hộ cao cấp với phong cách hiện đại tối giản",
  },
  {
    id: 2,
    slug: "villa-luxury",
    title: "Biệt Thự Hạng Sang",
    category: "Biệt Thự",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop",
    description: "Biệt thự sang trọng với thiết kế đẳng cấp quốc tế",
  },
  {
    id: 3,
    slug: "office-modern",
    title: "Không Gian Làm Việc Hiện Đại",
    category: "Văn Phòng",
    image:
      "https://images.unsplash.com/photo-1565183938294-e75ce55eb4ca?w=600&h=400&fit=crop",
    description: "Thiết kế văn phòng tối ưu hiệu suất làm việc",
  },
  {
    id: 4,
    slug: "restaurant-elegant",
    title: "Nhà Hàng Sang Trọng",
    category: "Nhà Hàng",
    image:
      "https://images.unsplash.com/photo-1554118811-1e0d58224e24?w=600&h=400&fit=crop",
    description: "Không gian ăn uống với phong cách ẩm thực cao cấp",
  },
  {
    id: 5,
    slug: "boutique-retail",
    title: "Showroom Thời Trang",
    category: "Bán Lẻ",
    image:
      "https://images.unsplash.com/photo-1576183404207-991ff501b5fb?w=600&h=400&fit=crop",
    description:
      "Thiết kế showroom thời trang tạo trải nghiệm mua sắm tuyệt vời",
  },
  {
    id: 6,
    slug: "spa-wellness",
    title: "Spa & Wellness Center",
    category: "Spa",
    image:
      "https://images.unsplash.com/photo-1541123603104-852fc1296e27?w=600&h=400&fit=crop",
    description: "Không gian thư giãn và chăm sóc sức khỏe đẳng cấp",
  },
];

const selectedCategory = ref("Tất cả");
const categories = ["Tất cả", ...new Set(projects.map((p) => p.category))];

const filteredProjects = computed(() => {
  if (selectedCategory.value === "Tất cả") {
    return projects;
  }
  return projects.filter((p) => p.category === selectedCategory.value);
});

// Scroll reveal refs
const filterRef = ref(null);
const projectCardRefs = ref([]);
const ctaRef = ref(null);

useScrollReveal(filterRef);
useScrollReveal(ctaRef);

projects.forEach((_, index) => {
  useScrollReveal(
    computed(() => projectCardRefs.value[index]),
    { delay: index * 100 },
  );
});
</script>

<template>
  <div>
    <!-- ==================== HERO ==================== -->
    <section class="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      <!-- Background Image -->
      <img
        src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&h=800&fit=crop"
        alt=""
        class="absolute inset-0 w-full h-full object-cover"
      />
      <div class="hero-overlay" />

      <!-- Decorative Elements -->
      <div
        class="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"
      />
      <div
        class="absolute bottom-0 left-1/4 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl"
      />

      <div class="relative z-10 max-w-7xl mx-auto px-6">
        <span
          class="text-orange-400 uppercase tracking-[0.2em] text-xs font-semibold mb-4 block animate-fade-in-up"
        >
          Portfolio
        </span>
        <h1
          class="text-5xl md:text-6xl font-bold text-white mb-6 animate-fade-in-up"
          style="animation-delay: 150ms"
        >
          Danh Sách <span class="text-orange-500">Dự Án</span>
        </h1>
        <p
          class="text-xl text-gray-400 max-w-2xl animate-fade-in-up"
          style="animation-delay: 300ms"
        >
          Khám phá những dự án thiết kế nội thất nổi bật của chúng tôi
        </p>
      </div>
    </section>

    <!-- ==================== PROJECTS ==================== -->
    <section class="section-spacing bg-white">
      <div class="max-w-7xl mx-auto">
        <!-- Filter -->
        <div ref="filterRef">
          <div class="flex flex-wrap gap-3 mb-16 justify-center">
            <button
              v-for="category in categories"
              :key="category"
              :class="[
                'px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-300',
                selectedCategory === category
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25'
                  : 'bg-gray-100 text-gray-600 hover:bg-orange-50 hover:text-orange-500',
              ]"
              @click="selectedCategory = category"
            >
              {{ category }}
            </button>
          </div>
        </div>

        <!-- Projects Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            v-for="(project, index) in filteredProjects"
            :key="project.id"
            :ref="
              (el) => {
                if (el) projectCardRefs[index] = el;
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

              <!-- Center Icon -->
              <div
                class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 scale-50 group-hover:scale-100 transition-all duration-500"
              >
                <div
                  class="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
                >
                  <Icon
                    name="i-lucide-arrow-up-right"
                    class="w-6 h-6 text-white"
                  />
                </div>
              </div>

              <!-- Content -->
              <div class="absolute bottom-0 left-0 right-0 p-6">
                <span class="text-orange-300 text-sm font-semibold">
                  {{ project.category }}
                </span>
                <h3 class="text-white text-xl font-bold mt-1">
                  {{ project.title }}
                </h3>
                <p
                  class="text-white/70 text-sm mt-2 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500"
                >
                  {{ project.description }}
                </p>
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- ==================== CTA ==================== -->
    <section class="relative py-24 md:py-32 overflow-hidden">
      <div
        class="absolute inset-0 bg-linear-to-br from-orange-500 via-orange-500 to-orange-600"
      />
      <div
        class="absolute top-0 right-0 w-125 h-125 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"
      />
      <div
        class="absolute bottom-0 left-0 w-100 h-100 bg-orange-400/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"
      />

      <div ref="ctaRef">
        <div class="relative z-10 max-w-4xl mx-auto text-center px-6">
          <h2 class="text-4xl md:text-5xl font-bold text-white mb-6">
            Các Dự Án Của Bạn
            <br class="hidden md:block" />
            Sắp Tới
          </h2>
          <p class="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            Hãy liên hệ với chúng tôi để bắt đầu dự án thiết kế nội thất của bạn
          </p>
          <NuxtLink
            to="/lien-he"
            class="inline-block bg-white text-orange-600 hover:bg-gray-50 px-10 py-4 rounded-full font-bold text-lg transition-colors shadow-lg"
          >
            Bắt đầu dự án
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>
