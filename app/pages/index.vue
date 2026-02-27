<script setup>
useSeoMeta({
  title: "Trang chủ - Lai Huy Interior | Thiết kế nội thất hiện đại & đẳng cấp",
  description:
    "Thiết kế nội thất hiện đại, sang trọng cho không gian sống của bạn. Chúng tôi cung cấp giải pháp nội thất toàn diện.",
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
];
</script>

<template>
  <div>
    <!-- Hero Section -->
    <section
      class="relative h-screen flex items-center justify-center overflow-hidden"
    >
      <div
        class="absolute inset-0 bg-cover bg-center"
        style="
          background-image: url(&quot;https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&h=600&fit=crop&quot;);
        "
      />
      <div class="hero-overlay" />

      <div class="relative z-10 text-center text-white px-6 max-w-3xl mx-auto">
        <h1 class="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          Thiết kế nội thất <span class="text-orange-500">hiện đại</span> & đẳng
          cấp
        </h1>
        <p class="text-xl md:text-2xl mb-8 text-gray-200">
          Chúng tôi biến không gian thành những tác phẩm nghệ thuật sống động
        </p>

        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink to="/du-an" class="btn-primary"> Khám phá dự án </NuxtLink>
          <NuxtLink
            to="/lien-he"
            class="btn-secondary bg-white text-slate-900 hover:bg-gray-100"
          >
            Liên hệ tư vấn
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- About Preview Section -->
    <section class="section-spacing bg-white">
      <div class="max-w-7xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <!-- Text Content -->
          <div>
            <h2 class="text-4xl md:text-5xl font-bold mb-6 text-slate-900">
              Về Lai Huy
            </h2>
            <p class="text-lg text-gray-600 mb-4 leading-relaxed">
              Với hơn 15 năm kinh nghiệm trong lĩnh vực thiết kế nội thất, Lai
              Huy đã tạo nên những không gian sống tinh tế, đẳng cấp cho hàng
              nghìn gia đình và doanh nghiệp.
            </p>
            <p class="text-lg text-gray-600 mb-8 leading-relaxed">
              Chúng tôi tin rằng thiết kế tốt không chỉ là về thẩm mỹ, mà còn về
              việc tạo ra những không gian nơi mọi người yêu thích để sống và
              làm việc.
            </p>
            <NuxtLink to="/gioi-thieu" class="btn-primary inline-block">
              Tìm hiểu thêm
            </NuxtLink>
          </div>

          <!-- Image -->
          <div class="rounded-2xl overflow-hidden shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600&h=600&fit=crop"
              alt="Không gian hiện đại"
              class="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Projects Section -->
    <section class="section-spacing bg-gray-50">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-16">
          <h2 class="text-4xl md:text-5xl font-bold mb-4 text-slate-900">
            Dự Án Nổi Bật
          </h2>
          <p class="text-xl text-gray-600">
            Những dự án tiêu biểu của chúng tôi
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <NuxtLink
            v-for="project in projects"
            :key="project.id"
            :to="`/du-an/${project.slug}`"
            class="card-luxury group cursor-pointer"
          >
            <div class="relative h-72 overflow-hidden">
              <img
                :src="project.image"
                :alt="project.title"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div
                class="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors"
              />
            </div>

            <div class="p-6 bg-white">
              <p class="text-orange-500 font-semibold mb-2 text-sm">
                {{ project.category }}
              </p>
              <h3 class="text-xl md:text-2xl font-bold text-slate-900 mb-2">
                {{ project.title }}
              </h3>
              <p class="text-gray-600 text-sm">
                {{ project.description }}
              </p>
            </div>
          </NuxtLink>
        </div>

        <div class="text-center mt-12">
          <NuxtLink to="/du-an" class="btn-secondary">
            Xem tất cả dự án
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Services Section -->
    <section class="section-spacing bg-white">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-16">
          <h2 class="text-4xl md:text-5xl font-bold mb-4 text-slate-900">
            Dịch Vụ Của Chúng Tôi
          </h2>
          <p class="text-xl text-gray-600">
            Cung cấp giải pháp nội thất toàn diện
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div
            class="p-8 rounded-2xl bg-gray-50 hover:shadow-lg transition-shadow"
          >
            <Icon
              name="i-lucide-pencil-ruler"
              class="w-12 h-12 text-orange-500 mb-4"
            />
            <h3 class="text-2xl font-bold mb-3 text-slate-900">
              Tư vấn Thiết kế
            </h3>
            <p class="text-gray-600">
              Tư vấn miễn phí về phong cách, màu sắc, vật liệu và bố cục không
              gian
            </p>
          </div>

          <div
            class="p-8 rounded-2xl bg-gray-50 hover:shadow-lg transition-shadow"
          >
            <Icon
              name="i-lucide-hammer"
              class="w-12 h-12 text-orange-500 mb-4"
            />
            <h3 class="text-2xl font-bold mb-3 text-slate-900">
              Thi Công Cải Tạo
            </h3>
            <p class="text-gray-600">
              Thi công chất lượng cao với đội ngũ kỹ thuật viên giàu kinh nghiệm
            </p>
          </div>

          <div
            class="p-8 rounded-2xl bg-gray-50 hover:shadow-lg transition-shadow"
          >
            <Icon name="i-lucide-home" class="w-12 h-12 text-orange-500 mb-4" />
            <h3 class="text-2xl font-bold mb-3 text-slate-900">
              Quản lý Dự Án
            </h3>
            <p class="text-gray-600">
              Quản lý toàn bộ dự án từ lên kế hoạch đến hoàn thiện chi tiết
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="section-spacing bg-slate-900 text-white">
      <div class="max-w-4xl mx-auto text-center">
        <h2 class="text-4xl md:text-5xl font-bold mb-6">
          Sẵn sàng để bắt đầu dự án của bạn?
        </h2>
        <p class="text-xl text-gray-300 mb-8">
          Hãy liên hệ với chúng tôi ngay để nhận tư vấn thiết kế miễn phí
        </p>
        <NuxtLink
          to="/lien-he"
          class="btn-primary bg-orange-500 hover:bg-orange-600"
        >
          Liên hệ ngay
        </NuxtLink>
      </div>
    </section>
  </div>
</template>
