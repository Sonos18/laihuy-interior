<script setup>
const route = useRoute()
const slug = route.params.slug

useSeoMeta({
  title: `Chi Tiết Dự Án - Lai Huy Interior`,
  description: 'Xem chi tiết dự án thiết kế nội thất của Lai Huy Interior'
})

// Sample project data
const projectsData = {
  'apartment-modern': {
    title: 'Căn Hộ Phong Cách Hiện Đại',
    category: 'Căn Hộ',
    location: 'Quận 1, TP. Hồ Chí Minh',
    area: '120m²',
    duration: '3 tháng',
    budget: 'Tương ứng',
    description: 'Thiết kế căn hộ cao cấp với phong cách hiện đại tối giản. Tập trung vào công năng và thẩm mỹ, tạo nên một không gian sống thoáng đãng, sang trọng.',
    images: [
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&h=600&fit=crop',
      'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1200&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=600&fit=crop'
    ],
    highlights: [
      'Phòng khách rộng rãi với cách bố trí công năng tối ưu',
      'Phòng bếp hiện đại với các tủ bếp cao cấp',
      'Phòng ngủ chính với hệ thống lưu trữ thông minh',
      'Phòng tắm sang trọng với thiết bị cao cấp'
    ],
    materials: [
      'Sàn gỗ nhân tạo cao cấp',
      'Tường sơn trắng sữa',
      'Đèn LED thông minh',
      'Nội thất gỗ tự nhiên'
    ]
  },
  'villa-luxury': {
    title: 'Biệt Thự Hạng Sang',
    category: 'Biệt Thự',
    location: 'Thủ Đức, TP. Hồ Chí Minh',
    area: '500m²',
    duration: '8 tháng',
    budget: 'Tương ứng',
    description: 'Biệt thự sang trọng với thiết kế đẳng cấp quốc tế. Kết hợp hài hòa giữa kiến trúc hiện đại và nội thất sang trọng, tạo nên một không gian sống đẳng cấp.',
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=600&fit=crop',
      'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1200&h=600&fit=crop',
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&h=600&fit=crop'
    ],
    highlights: [
      'Sảnh chính rộng lớn với thiết kế hiện đại',
      'Phòng khách hạng sang với tầng cao',
      'Phòng ăn cho 12-15 người',
      'Sân vườn cảnh quan chuyên nghiệp'
    ],
    materials: [
      'Đá tự nhiên cao cấp',
      'Gỗ veneer nhập khẩu',
      'Hệ thống chiếu sáng thông minh',
      'Nội thất cao cấp nhập khẩu'
    ]
  },
  'office-modern': {
    title: 'Không Gian Làm Việc Hiện Đại',
    category: 'Văn Phòng',
    location: 'Quận 3, TP. Hồ Chí Minh',
    area: '300m²',
    duration: '4 tháng',
    budget: 'Tương ứng',
    description: 'Thiết kế văn phòng tối ưu hiệu suất làm việc. Không gian mở, linh hoạt, với các khu vực chức năng rõ ràng và thoáng đãng.',
    images: [
      'https://images.unsplash.com/photo-1565183938294-e75ce55eb4ca?w=1200&h=600&fit=crop',
      'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1200&h=600&fit=crop',
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&h=600&fit=crop'
    ],
    highlights: [
      'Khu vực làm việc mở với ghế cao cấp',
      'Phòng họp với trang thiết bị hiện đại',
      'Phòng giải lao thoáng đãng',
      'Hệ thống chiếu sáng tối ưu sức khỏe'
    ],
    materials: [
      'Sàn bê tông polished',
      'Vách kính laminat',
      'Nội thất văn phòng ergonomic',
      'Hệ thống HVAC hiện đại'
    ]
  },
  'restaurant-elegant': {
    title: 'Nhà Hàng Sang Trọng',
    category: 'Nhà Hàng',
    location: 'Quận 1, TP. Hồ Chí Minh',
    area: '200m²',
    duration: '5 tháng',
    budget: 'Tương ứng',
    description: 'Không gian ăn uống với phong cách ẩm thực cao cấp. Tạo ra một trải nghiệm ẩm thực tuyệt vời kết hợp với thiết kế sang trọng.',
    images: [
      'https://images.unsplash.com/photo-1554118811-1e0d58224e24?w=1200&h=600&fit=crop',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&h=600&fit=crop',
      'https://images.unsplash.com/photo-1517457373614-b7152f800fd1?w=1200&h=600&fit=crop'
    ],
    highlights: [
      'Khu vực ăn uống chính với ánh sáng ấm',
      'Quầy bar sang trọng với ghế cao',
      'Phòng riêng cho các buổi tiệc',
      'Bếp mở với thiết kế hiện đại'
    ],
    materials: [
      'Gỗ veneer cao cấp',
      'Đèn chân đế thiết kế',
      'Bàn ghế nhập khẩu',
      'Mặt bàn đá tự nhiên'
    ]
  },
  'boutique-retail': {
    title: 'Showroom Thời Trang',
    category: 'Bán Lẻ',
    location: 'Quận 1, TP. Hồ Chí Minh',
    area: '150m²',
    duration: '3 tháng',
    budget: 'Tương ứng',
    description: 'Thiết kế showroom thời trang tạo trải nghiệm mua sắm tuyệt vời. Không gian thoáng đãng với hệ thống chiếu sáng tối ưu để tôn lên các sản phẩm.',
    images: [
      'https://images.unsplash.com/photo-1576183404207-991ff501b5fb?w=1200&h=600&fit=crop',
      'https://images.unsplash.com/photo-1441984904556-0ab63e351378?w=1200&h=600&fit=crop',
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&h=600&fit=crop'
    ],
    highlights: [
      'Khu trưng bày sản phẩm sang trọng',
      'Phòng thử đồ hiện đại',
      'Quầy thanh toán cao cấp',
      'Hệ thống chiếu sáng spotlight'
    ],
    materials: [
      'Tường gỗ veneer',
      'Sàn polished concrete',
      'Tủ trưng bày thép kính',
      'Đèn LED spotlight'
    ]
  },
  'spa-wellness': {
    title: 'Spa & Wellness Center',
    category: 'Spa',
    location: 'Quận 2, TP. Hồ Chí Minh',
    area: '250m²',
    duration: '6 tháng',
    budget: 'Tương ứng',
    description: 'Không gian thư giãn và chăm sóc sức khỏe đẳng cấp. Tạo môi trường yên tĩnh, thư giãn với thiết kế spa hiện đại.',
    images: [
      'https://images.unsplash.com/photo-1541123603104-852fc1296e27?w=1200&h=600&fit=crop',
      'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1200&h=600&fit=crop',
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&h=600&fit=crop'
    ],
    highlights: [
      'Phòng chờ sang trọng',
      'Phòng massage thư giãn',
      'Phòng tắm hơi sauna',
      'Khu vực thư giãn với ghế nằm'
    ],
    materials: [
      'Đá tự nhiên sáng',
      'Gỗ thơm tự nhiên',
      'Tường sơn màu nhẹ',
      'Hệ thống âm thanh xung quanh'
    ]
  }
}

const project = computed(() => projectsData[slug] || projectsData['apartment-modern'])
const currentImageIndex = ref(0)

const nextImage = () => {
  currentImageIndex.value = (currentImageIndex.value + 1) % project.value.images.length
}

const prevImage = () => {
  currentImageIndex.value = (currentImageIndex.value - 1 + project.value.images.length) % project.value.images.length
}
</script>

<template>
  <div>
    <!-- Hero Image Gallery -->
    <section class="relative h-96 md:h-screen overflow-hidden group">
      <img
        :src="project.images[currentImageIndex]"
        :alt="project.title"
        class="w-full h-full object-cover"
      />
      
      <!-- Navigation Buttons -->
      <button
        @click="prevImage"
        class="absolute left-6 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white p-3 rounded-full transition-all opacity-0 group-hover:opacity-100"
      >
        <Icon name="i-lucide-chevron-left" class="w-6 h-6" />
      </button>
      
      <button
        @click="nextImage"
        class="absolute right-6 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white p-3 rounded-full transition-all opacity-0 group-hover:opacity-100"
      >
        <Icon name="i-lucide-chevron-right" class="w-6 h-6" />
      </button>

      <!-- Image Counter -->
      <div class="absolute bottom-6 right-6 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
        {{ currentImageIndex + 1 }} / {{ project.images.length }}
      </div>

      <!-- Image Thumbnails -->
      <div class="absolute bottom-6 left-6 flex gap-2">
        <button
          v-for="(image, index) in project.images"
          :key="index"
          @click="currentImageIndex = index"
          :class="[
            'w-16 h-16 rounded-lg overflow-hidden border-2 transition-all',
            currentImageIndex === index ? 'border-white scale-105' : 'border-white/30 opacity-60 hover:opacity-100'
          ]"
        >
          <img :src="image" :alt="`Image ${index + 1}`" class="w-full h-full object-cover" />
        </button>
      </div>
    </section>

    <!-- Project Details -->
    <section class="section-spacing bg-white">
      <div class="max-w-6xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <!-- Main Content -->
          <div class="md:col-span-2">
            <h1 class="text-5xl font-bold mb-4 text-slate-900">{{ project.title }}</h1>
            <p class="text-xl text-gray-600 mb-8 leading-relaxed">{{ project.description }}</p>

            <!-- Project Highlights -->
            <div class="mb-12">
              <h3 class="text-3xl font-bold mb-6 text-slate-900">Điểm Nổi Bật</h3>
              <ul class="space-y-3">
                <li v-for="(highlight, index) in project.highlights" :key="index" class="flex items-start gap-3">
                  <Icon name="i-lucide-check-circle-2" class="w-6 h-6 text-orange-500 flex-shrink-0 mt-0.5" />
                  <span class="text-gray-700 text-lg">{{ highlight }}</span>
                </li>
              </ul>
            </div>

            <!-- Materials -->
            <div>
              <h3 class="text-3xl font-bold mb-6 text-slate-900">Vật Liệu Sử Dụng</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div v-for="(material, index) in project.materials" :key="index" class="p-4 bg-gray-50 rounded-lg">
                  <Icon name="i-lucide-package" class="w-5 h-5 text-orange-500 mb-2" />
                  <p class="text-gray-700 font-semibold">{{ material }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Project Info Card -->
          <div>
            <div class="bg-gray-50 rounded-2xl p-8 sticky top-24">
              <h3 class="text-2xl font-bold mb-6 text-slate-900">Thông Tin Dự Án</h3>
              
              <div class="space-y-6 mb-8">
                <div class="pb-6 border-b border-gray-200">
                  <p class="text-gray-600 text-sm font-semibold mb-1">Danh Mục</p>
                  <p class="text-lg font-bold text-orange-500">{{ project.category }}</p>
                </div>
                
                <div class="pb-6 border-b border-gray-200">
                  <p class="text-gray-600 text-sm font-semibold mb-1">Vị Trí</p>
                  <p class="text-lg font-semibold text-slate-900">{{ project.location }}</p>
                </div>

                <div class="pb-6 border-b border-gray-200">
                  <p class="text-gray-600 text-sm font-semibold mb-1">Diện Tích</p>
                  <p class="text-lg font-semibold text-slate-900">{{ project.area }}</p>
                </div>

                <div class="pb-6 border-b border-gray-200">
                  <p class="text-gray-600 text-sm font-semibold mb-1">Thời Gian Thực Hiện</p>
                  <p class="text-lg font-semibold text-slate-900">{{ project.duration }}</p>
                </div>

                <div>
                  <p class="text-gray-600 text-sm font-semibold mb-1">Ngân Sách</p>
                  <p class="text-lg font-semibold text-slate-900">{{ project.budget }}</p>
                </div>
              </div>

              <NuxtLink to="/lien-he" class="btn-primary w-full text-center block">
                Liên Hệ Tư Vấn
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Related Projects -->
    <section class="section-spacing bg-gray-50">
      <div class="max-w-7xl mx-auto">
        <h2 class="text-4xl font-bold mb-8 text-slate-900">Các Dự Án Khác</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <NuxtLink
            to="/du-an/apartment-modern"
            class="card-luxury group cursor-pointer"
          >
            <div class="relative h-72 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop"
                alt="Căn Hộ Phong Cách Hiện Đại"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            
            <div class="p-6 bg-white">
              <p class="text-orange-500 font-semibold mb-2 text-sm">Căn Hộ</p>
              <h3 class="text-xl font-bold text-slate-900">Căn Hộ Phong Cách Hiện Đại</h3>
            </div>
          </NuxtLink>

          <NuxtLink
            to="/du-an/villa-luxury"
            class="card-luxury group cursor-pointer"
          >
            <div class="relative h-72 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop"
                alt="Biệt Thự Hạng Sang"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            
            <div class="p-6 bg-white">
              <p class="text-orange-500 font-semibold mb-2 text-sm">Biệt Thự</p>
              <h3 class="text-xl font-bold text-slate-900">Biệt Thự Hạng Sang</h3>
            </div>
          </NuxtLink>

          <NuxtLink
            to="/du-an/office-modern"
            class="card-luxury group cursor-pointer"
          >
            <div class="relative h-72 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1565183938294-e75ce55eb4ca?w=600&h=400&fit=crop"
                alt="Không Gian Làm Việc Hiện Đại"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            
            <div class="p-6 bg-white">
              <p class="text-orange-500 font-semibold mb-2 text-sm">Văn Phòng</p>
              <h3 class="text-xl font-bold text-slate-900">Không Gian Làm Việc Hiện Đại</h3>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="section-spacing bg-slate-900 text-white">
      <div class="max-w-4xl mx-auto text-center">
        <h2 class="text-4xl md:text-5xl font-bold mb-6">
          Sẵn Sàng Cho Dự Án Của Bạn?
        </h2>
        <p class="text-xl text-gray-300 mb-8">
          Hãy liên hệ với chúng tôi để tạo nên không gian sống hoặc làm việc tuyệt vời
        </p>
        <NuxtLink to="/lien-he" class="btn-primary bg-orange-500 hover:bg-orange-600">
          Bắt Đầu Dự Án
        </NuxtLink>
      </div>
    </section>
  </div>
</template>
