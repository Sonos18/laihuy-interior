<script setup>
const route = useRoute();
const slug = route.params.slug;

// Sample project data
const projectsData = {
  "apartment-modern": {
    title: "Căn Hộ Phong Cách Hiện Đại",
    category: "Căn Hộ",
    location: "Quận 1, TP. Hồ Chí Minh",
    area: "120m²",
    duration: "3 tháng",
    budget: "Tương ứng",
    description:
      "Thiết kế căn hộ cao cấp với phong cách hiện đại tối giản. Tập trung vào công năng và thẩm mỹ, tạo nên một không gian sống thoáng đãng, sang trọng.",
    images: [
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&h=600&fit=crop",
      "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1200&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=600&fit=crop",
    ],
    highlights: [
      "Phòng khách rộng rãi với cách bố trí công năng tối ưu",
      "Phòng bếp hiện đại với các tủ bếp cao cấp",
      "Phòng ngủ chính với hệ thống lưu trữ thông minh",
      "Phòng tắm sang trọng với thiết bị cao cấp",
    ],
    materials: [
      "Sàn gỗ nhân tạo cao cấp",
      "Tường sơn trắng sữa",
      "Đèn LED thông minh",
      "Nội thất gỗ tự nhiên",
    ],
  },
  "villa-luxury": {
    title: "Biệt Thự Hạng Sang",
    category: "Biệt Thự",
    location: "Thủ Đức, TP. Hồ Chí Minh",
    area: "500m²",
    duration: "8 tháng",
    budget: "Tương ứng",
    description:
      "Biệt thự sang trọng với thiết kế đẳng cấp quốc tế. Kết hợp hài hòa giữa kiến trúc hiện đại và nội thất sang trọng, tạo nên một không gian sống đẳng cấp.",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=600&fit=crop",
      "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1200&h=600&fit=crop",
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&h=600&fit=crop",
    ],
    highlights: [
      "Sảnh chính rộng lớn với thiết kế hiện đại",
      "Phòng khách hạng sang với tầng cao",
      "Phòng ăn cho 12-15 người",
      "Sân vườn cảnh quan chuyên nghiệp",
    ],
    materials: [
      "Đá tự nhiên cao cấp",
      "Gỗ veneer nhập khẩu",
      "Hệ thống chiếu sáng thông minh",
      "Nội thất cao cấp nhập khẩu",
    ],
  },
  "office-modern": {
    title: "Không Gian Làm Việc Hiện Đại",
    category: "Văn Phòng",
    location: "Quận 3, TP. Hồ Chí Minh",
    area: "300m²",
    duration: "4 tháng",
    budget: "Tương ứng",
    description:
      "Thiết kế văn phòng tối ưu hiệu suất làm việc. Không gian mở, linh hoạt, với các khu vực chức năng rõ ràng và thoáng đãng.",
    images: [
      "https://images.unsplash.com/photo-1565183938294-e75ce55eb4ca?w=1200&h=600&fit=crop",
      "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1200&h=600&fit=crop",
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&h=600&fit=crop",
    ],
    highlights: [
      "Khu vực làm việc mở với ghế cao cấp",
      "Phòng họp với trang thiết bị hiện đại",
      "Phòng giải lao thoáng đãng",
      "Hệ thống chiếu sáng tối ưu sức khỏe",
    ],
    materials: [
      "Sàn bê tông polished",
      "Vách kính laminat",
      "Nội thất văn phòng ergonomic",
      "Hệ thống HVAC hiện đại",
    ],
  },
  "restaurant-elegant": {
    title: "Nhà Hàng Sang Trọng",
    category: "Nhà Hàng",
    location: "Quận 1, TP. Hồ Chí Minh",
    area: "200m²",
    duration: "5 tháng",
    budget: "Tương ứng",
    description:
      "Không gian ăn uống với phong cách ẩm thực cao cấp. Tạo ra một trải nghiệm ẩm thực tuyệt vời kết hợp với thiết kế sang trọng.",
    images: [
      "https://images.unsplash.com/photo-1554118811-1e0d58224e24?w=1200&h=600&fit=crop",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&h=600&fit=crop",
      "https://images.unsplash.com/photo-1517457373614-b7152f800fd1?w=1200&h=600&fit=crop",
    ],
    highlights: [
      "Khu vực ăn uống chính với ánh sáng ấm",
      "Quầy bar sang trọng với ghế cao",
      "Phòng riêng cho các buổi tiệc",
      "Bếp mở với thiết kế hiện đại",
    ],
    materials: [
      "Gỗ veneer cao cấp",
      "Đèn chân đế thiết kế",
      "Bàn ghế nhập khẩu",
      "Mặt bàn đá tự nhiên",
    ],
  },
  "boutique-retail": {
    title: "Showroom Thời Trang",
    category: "Bán Lẻ",
    location: "Quận 1, TP. Hồ Chí Minh",
    area: "150m²",
    duration: "3 tháng",
    budget: "Tương ứng",
    description:
      "Thiết kế showroom thời trang tạo trải nghiệm mua sắm tuyệt vời. Không gian thoáng đãng với hệ thống chiếu sáng tối ưu để tôn lên các sản phẩm.",
    images: [
      "https://images.unsplash.com/photo-1576183404207-991ff501b5fb?w=1200&h=600&fit=crop",
      "https://images.unsplash.com/photo-1441984904556-0ab63e351378?w=1200&h=600&fit=crop",
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&h=600&fit=crop",
    ],
    highlights: [
      "Khu trưng bày sản phẩm sang trọng",
      "Phòng thử đồ hiện đại",
      "Quầy thanh toán cao cấp",
      "Hệ thống chiếu sáng spotlight",
    ],
    materials: [
      "Tường gỗ veneer",
      "Sàn polished concrete",
      "Tủ trưng bày thép kính",
      "Đèn LED spotlight",
    ],
  },
  "spa-wellness": {
    title: "Spa & Wellness Center",
    category: "Spa",
    location: "Quận 2, TP. Hồ Chí Minh",
    area: "250m²",
    duration: "6 tháng",
    budget: "Tương ứng",
    description:
      "Không gian thư giãn và chăm sóc sức khỏe đẳng cấp. Tạo môi trường yên tĩnh, thư giãn với thiết kế spa hiện đại.",
    images: [
      "https://images.unsplash.com/photo-1541123603104-852fc1296e27?w=1200&h=600&fit=crop",
      "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1200&h=600&fit=crop",
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&h=600&fit=crop",
    ],
    highlights: [
      "Phòng chờ sang trọng",
      "Phòng massage thư giãn",
      "Phòng tắm hơi sauna",
      "Khu vực thư giãn với ghế nằm",
    ],
    materials: [
      "Đá tự nhiên sáng",
      "Gỗ thơm tự nhiên",
      "Tường sơn màu nhẹ",
      "Hệ thống âm thanh xung quanh",
    ],
  },
};

const relatedProjects = [
  {
    slug: "apartment-modern",
    title: "Căn Hộ Phong Cách Hiện Đại",
    category: "Căn Hộ",
    image:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop",
  },
  {
    slug: "villa-luxury",
    title: "Biệt Thự Hạng Sang",
    category: "Biệt Thự",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop",
  },
  {
    slug: "office-modern",
    title: "Không Gian Làm Việc Hiện Đại",
    category: "Văn Phòng",
    image:
      "https://images.unsplash.com/photo-1565183938294-e75ce55eb4ca?w=600&h=400&fit=crop",
  },
];

const project = computed(
  () => projectsData[slug] || projectsData["apartment-modern"],
);
const currentImageIndex = ref(0);

useSeoMeta({
  title: `${project.value.title} - Lai Huy Interior`,
  description: project.value.description,
});

const nextImage = () => {
  currentImageIndex.value =
    (currentImageIndex.value + 1) % project.value.images.length;
};

const prevImage = () => {
  currentImageIndex.value =
    (currentImageIndex.value - 1 + project.value.images.length) %
    project.value.images.length;
};

const infoItems = computed(() => [
  {
    icon: "i-lucide-tag",
    label: "Danh Mục",
    value: project.value.category,
    highlight: true,
  },
  {
    icon: "i-lucide-map-pin",
    label: "Vị Trí",
    value: project.value.location,
  },
  {
    icon: "i-lucide-ruler",
    label: "Diện Tích",
    value: project.value.area,
  },
  {
    icon: "i-lucide-clock",
    label: "Thời Gian",
    value: project.value.duration,
  },
  {
    icon: "i-lucide-wallet",
    label: "Ngân Sách",
    value: project.value.budget,
  },
]);
</script>

<template>
  <div>
    <!-- ==================== HERO IMAGE GALLERY ==================== -->
    <section class="relative h-[50vh] md:h-screen overflow-hidden group">
      <img
        :src="project.images[currentImageIndex]"
        :alt="project.title"
        class="w-full h-full object-cover transition-transform duration-700"
      />

      <!-- Gradient Overlay -->
      <div
        class="absolute inset-0 bg-linear-to-t from-gray-950/60 via-transparent to-gray-950/30"
      />

      <!-- Navigation Buttons -->
      <button
        class="absolute left-6 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white p-3 rounded-full transition-all opacity-0 group-hover:opacity-100 border border-white/20"
        @click="prevImage"
      >
        <Icon name="i-lucide-chevron-left" class="w-6 h-6" />
      </button>

      <button
        class="absolute right-6 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white p-3 rounded-full transition-all opacity-0 group-hover:opacity-100 border border-white/20"
        @click="nextImage"
      >
        <Icon name="i-lucide-chevron-right" class="w-6 h-6" />
      </button>

      <!-- Image Counter -->
      <div
        class="absolute bottom-6 right-6 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm border border-white/20"
      >
        {{ currentImageIndex + 1 }} / {{ project.images.length }}
      </div>

      <!-- Image Thumbnails -->
      <div class="absolute bottom-6 left-6 flex gap-2">
        <button
          v-for="(image, index) in project.images"
          :key="index"
          :class="[
            'w-16 h-16 rounded-xl overflow-hidden border-2 transition-all',
            currentImageIndex === index
              ? 'border-orange-500 scale-105 shadow-lg shadow-orange-500/30'
              : 'border-white/30 opacity-60 hover:opacity-100',
          ]"
          @click="currentImageIndex = index"
        >
          <img
            :src="image"
            :alt="`Image ${index + 1}`"
            class="w-full h-full object-cover"
          />
        </button>
      </div>
    </section>

    <!-- ==================== PROJECT DETAILS ==================== -->
    <section class="section-spacing bg-white">
      <div class="max-w-7xl mx-auto">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <!-- Main Content -->
          <div class="lg:col-span-2">
            <ScrollReveal>
              <span
                class="text-orange-500 uppercase tracking-[0.2em] text-xs font-semibold"
              >
                {{ project.category }}
              </span>
              <h1
                class="text-4xl md:text-5xl font-bold text-gray-900 mt-3 mb-6"
              >
                {{ project.title }}
              </h1>
              <p class="text-gray-500 text-lg leading-relaxed mb-12">
                {{ project.description }}
              </p>
            </ScrollReveal>

            <!-- Project Highlights -->
            <ScrollReveal :delay="150">
              <div class="mb-12">
                <h3 class="text-2xl font-bold text-gray-900 mb-6">
                  Điểm <span class="text-orange-500">Nổi Bật</span>
                </h3>
                <ul class="space-y-4">
                  <li
                    v-for="(highlight, index) in project.highlights"
                    :key="index"
                    class="flex items-start gap-4 p-4 rounded-xl hover:bg-orange-50 transition-colors"
                  >
                    <div
                      class="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center shrink-0"
                    >
                      <Icon
                        name="i-lucide-check"
                        class="w-4 h-4 text-orange-500"
                      />
                    </div>
                    <span class="text-gray-600 text-lg">{{ highlight }}</span>
                  </li>
                </ul>
              </div>
            </ScrollReveal>

            <!-- Materials -->
            <ScrollReveal :delay="300">
              <div>
                <h3 class="text-2xl font-bold text-gray-900 mb-6">
                  Vật Liệu <span class="text-orange-500">Sử Dụng</span>
                </h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div
                    v-for="(material, index) in project.materials"
                    :key="index"
                    class="group flex items-center gap-4 p-5 bg-gray-50 rounded-xl border border-gray-100 hover:border-orange-200 hover:shadow-lg transition-all duration-300"
                  >
                    <div
                      class="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center group-hover:bg-orange-500 transition-colors duration-300"
                    >
                      <Icon
                        name="i-lucide-package"
                        class="w-5 h-5 text-orange-500 group-hover:text-white transition-colors"
                      />
                    </div>
                    <p class="text-gray-700 font-medium">{{ material }}</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>

          <!-- Project Info Card -->
          <div>
            <ScrollReveal direction="right">
              <div
                class="bg-gray-50 rounded-2xl p-8 sticky top-24 border border-gray-100"
              >
                <h3 class="text-xl font-bold text-gray-900 mb-6">
                  Thông Tin <span class="text-orange-500">Dự Án</span>
                </h3>

                <div class="space-y-5 mb-8">
                  <div
                    v-for="item in infoItems"
                    :key="item.label"
                    class="flex items-center gap-4 pb-5 border-b border-gray-200 last:border-0 last:pb-0"
                  >
                    <div
                      class="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center shrink-0"
                    >
                      <Icon :name="item.icon" class="w-5 h-5 text-orange-500" />
                    </div>
                    <div>
                      <p
                        class="text-gray-500 text-xs font-semibold uppercase tracking-wider"
                      >
                        {{ item.label }}
                      </p>
                      <p
                        :class="[
                          'font-semibold mt-0.5',
                          item.highlight ? 'text-orange-500' : 'text-gray-900',
                        ]"
                      >
                        {{ item.value }}
                      </p>
                    </div>
                  </div>
                </div>

                <NuxtLink
                  to="/lien-he"
                  class="btn-primary w-full text-center block"
                >
                  Liên Hệ Tư Vấn
                </NuxtLink>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>

    <!-- ==================== RELATED PROJECTS ==================== -->
    <section class="section-spacing bg-gray-50">
      <div class="max-w-7xl mx-auto">
        <ScrollReveal>
          <div
            class="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16"
          >
            <div>
              <span
                class="text-orange-500 uppercase tracking-[0.2em] text-xs font-semibold"
              >
                Khám phá thêm
              </span>
              <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mt-3">
                Các Dự Án <span class="text-orange-500">Khác</span>
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
        </ScrollReveal>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <ScrollReveal
            v-for="(rp, index) in relatedProjects"
            :key="rp.slug"
            :delay="index * 150"
          >
            <NuxtLink
              :to="`/du-an/${rp.slug}`"
              class="group relative block h-80 rounded-2xl overflow-hidden"
            >
              <BaseImage
                :src="rp.image"
                :alt="rp.title"
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
                  {{ rp.category }}
                </span>
                <h3 class="text-white text-xl font-bold mt-1">
                  {{ rp.title }}
                </h3>
              </div>
            </NuxtLink>
          </ScrollReveal>
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

      <ScrollReveal>
        <div class="relative z-10 max-w-4xl mx-auto text-center px-6">
          <h2 class="text-4xl md:text-5xl font-bold text-white mb-6">
            Sẵn Sàng Cho
            <br class="hidden md:block" />
            Dự Án Của Bạn?
          </h2>
          <p class="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            Hãy liên hệ với chúng tôi để tạo nên không gian sống hoặc làm việc
            tuyệt vời
          </p>
          <NuxtLink
            to="/lien-he"
            class="inline-block bg-white text-orange-600 hover:bg-gray-50 px-10 py-4 rounded-full font-bold text-lg transition-colors shadow-lg"
          >
            Bắt Đầu Dự Án
          </NuxtLink>
        </div>
      </ScrollReveal>
    </section>
  </div>
</template>
