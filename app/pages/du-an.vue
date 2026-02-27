<script setup>
useSeoMeta({
  title: 'Dự Án - Lai Huy Interior | Xem các dự án thiết kế nội thất',
  description: 'Khám phá những dự án thiết kế nội thất nổi bật của Lai Huy Interior'
})

const projects = [
  {
    id: 1,
    slug: 'apartment-modern',
    title: 'Căn Hộ Phong Cách Hiện Đại',
    category: 'Căn Hộ',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop',
    description: 'Thiết kế căn hộ cao cấp với phong cách hiện đại tối giản'
  },
  {
    id: 2,
    slug: 'villa-luxury',
    title: 'Biệt Thự Hạng Sang',
    category: 'Biệt Thự',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop',
    description: 'Biệt thự sang trọng với thiết kế đẳng cấp quốc tế'
  },
  {
    id: 3,
    slug: 'office-modern',
    title: 'Không Gian Làm Việc Hiện Đại',
    category: 'Văn Phòng',
    image: 'https://images.unsplash.com/photo-1565183938294-e75ce55eb4ca?w=600&h=400&fit=crop',
    description: 'Thiết kế văn phòng tối ưu hiệu suất làm việc'
  },
  {
    id: 4,
    slug: 'restaurant-elegant',
    title: 'Nhà Hàng Sang Trọng',
    category: 'Nhà Hàng',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224e24?w=600&h=400&fit=crop',
    description: 'Không gian ăn uống với phong cách ẩm thực cao cấp'
  },
  {
    id: 5,
    slug: 'boutique-retail',
    title: 'Showroom Thời Trang',
    category: 'Bán Lẻ',
    image: 'https://images.unsplash.com/photo-1576183404207-991ff501b5fb?w=600&h=400&fit=crop',
    description: 'Thiết kế showroom thời trang tạo trải nghiệm mua sắm tuyệt vời'
  },
  {
    id: 6,
    slug: 'spa-wellness',
    title: 'Spa & Wellness Center',
    category: 'Spa',
    image: 'https://images.unsplash.com/photo-1541123603104-852fc1296e27?w=600&h=400&fit=crop',
    description: 'Không gian thư giãn và chăm sóc sức khỏe đẳng cấp'
  }
]

const selectedCategory = ref('Tất cả')
const categories = ['Tất cả', ...new Set(projects.map(p => p.category))]

const filteredProjects = computed(() => {
  if (selectedCategory.value === 'Tất cả') {
    return projects
  }
  return projects.filter(p => p.category === selectedCategory.value)
})
</script>

<template>
  <div>
    <!-- Hero Section -->
    <section class="section-spacing bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-5xl md:text-6xl font-bold mb-6">Danh Sách Dự Án</h1>
        <p class="text-xl md:text-2xl text-gray-300">
          Khám phá những dự án thiết kế nội thất nổi bật
        </p>
      </div>
    </section>

    <!-- Filter Section -->
    <section class="section-spacing bg-white">
      <div class="max-w-7xl mx-auto">
        <div class="flex flex-wrap gap-3 mb-8 justify-center">
          <button
            v-for="category in categories"
            :key="category"
            @click="selectedCategory = category"
            :class="[
              'px-6 py-2 rounded-full font-semibold transition-all',
              selectedCategory === category
                ? 'bg-orange-500 text-white shadow-lg'
                : 'bg-gray-100 text-slate-900 hover:bg-gray-200'
            ]"
          >
            {{ category }}
          </button>
        </div>

        <!-- Projects Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <NuxtLink
            v-for="project in filteredProjects"
            :key="project.id"
            :to="`/du-an/${project.slug}`"
            class="card-luxury group cursor-pointer overflow-hidden"
          >
            <div class="relative h-72 overflow-hidden bg-gray-200">
              <img
                :src="project.image"
                :alt="project.title"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div class="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors" />
            </div>
            
            <div class="p-6 bg-white">
              <p class="text-orange-500 font-semibold mb-2 text-sm">{{ project.category }}</p>
              <h3 class="text-xl md:text-2xl font-bold text-slate-900 mb-2 group-hover:text-orange-500 transition-colors">
                {{ project.title }}
              </h3>
              <p class="text-gray-600 text-sm line-clamp-2">
                {{ project.description }}
              </p>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="section-spacing bg-slate-900 text-white">
      <div class="max-w-4xl mx-auto text-center">
        <h2 class="text-4xl md:text-5xl font-bold mb-6">
          Các Dự Án Của Bạn Sắp Tới
        </h2>
        <p class="text-xl text-gray-300 mb-8">
          Hãy liên hệ với chúng tôi để bắt đầu dự án thiết kế nội thất của bạn
        </p>
        <NuxtLink to="/lien-he" class="btn-primary bg-orange-500 hover:bg-orange-600">
          Bắt đầu dự án
        </NuxtLink>
      </div>
    </section>
  </div>
</template>
