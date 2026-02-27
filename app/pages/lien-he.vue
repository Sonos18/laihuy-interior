<script setup>
useSeoMeta({
  title: 'Liên Hệ - Lai Huy Interior | Thiết kế nội thất',
  description: 'Liên hệ với Lai Huy Interior để nhận tư vấn thiết kế miễn phí'
})

const form = reactive({
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: ''
})

const isSubmitting = ref(false)

const submitForm = async () => {
  isSubmitting.value = true
  // Simulate form submission
  await new Promise(resolve => setTimeout(resolve, 1000))
  console.log('Form submitted:', form)
  form.name = ''
  form.email = ''
  form.phone = ''
  form.subject = ''
  form.message = ''
  isSubmitting.value = false
}
</script>

<template>
  <div>
    <!-- Hero Section -->
    <section class="section-spacing bg-gradient-to-br from-brand-blue-900 to-brand-blue-700 text-white">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-5xl md:text-6xl font-bold mb-6">Liên Hệ Với Chúng Tôi</h1>
        <p class="text-xl md:text-2xl text-brand-blue-200">
          Chúng tôi sẵn sàng lắng nghe ý tưởng của bạn
        </p>
      </div>
    </section>

    <!-- Contact Section -->
    <section class="section-spacing bg-white">
      <div class="max-w-6xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <!-- Contact Info -->
          <div>
            <h3 class="text-xl font-bold mb-4 text-slate-900">Địa Chỉ</h3>
            <p class="text-gray-600">
              Tầng 5, Tòa nhà Central Plaza<br />
              123 Nguyễn Hữu Cảnh<br />
              Quận 1, TP. Hồ Chí Minh
            </p>
          </div>

          <div>
            <h3 class="text-xl font-bold mb-4 text-slate-900">Liên Hệ</h3>
            <p class="text-gray-600 mb-2">
              <strong>Điện thoại:</strong> +84 (0) 123 456 789
            </p>
            <p class="text-gray-600">
              <strong>Email:</strong> info@laihuy.vn
            </p>
          </div>

          <div>
            <h3 class="text-xl font-bold mb-4 text-slate-900">Giờ Làm Việc</h3>
            <p class="text-gray-600 mb-2">
              Thứ 2 - Thứ 6: 8:00 - 18:00
            </p>
            <p class="text-gray-600">
              Thứ 7 - Chủ nhật: 9:00 - 17:00
            </p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
          <!-- Contact Form -->
          <div>
            <h2 class="text-3xl font-bold mb-6 text-slate-900">Gửi Tin Nhắn</h2>
            <form @submit.prevent="submitForm" class="space-y-6">
              <div>
                <label for="name" class="block text-sm font-semibold text-slate-900 mb-2">Tên của bạn</label>
                <input
                  v-model="form.name"
                  type="text"
                  id="name"
                  placeholder="Nhập tên của bạn"
                  class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>

              <div>
                <label for="email" class="block text-sm font-semibold text-slate-900 mb-2">Email</label>
                <input
                  v-model="form.email"
                  type="email"
                  id="email"
                  placeholder="email@example.com"
                  class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>

              <div>
                <label for="phone" class="block text-sm font-semibold text-slate-900 mb-2">Số Điện Thoại</label>
                <input
                  v-model="form.phone"
                  type="tel"
                  id="phone"
                  placeholder="+84 (0) 123 456 789"
                  class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>

              <div>
                <label for="subject" class="block text-sm font-semibold text-slate-900 mb-2">Chủ Đề</label>
                <input
                  v-model="form.subject"
                  type="text"
                  id="subject"
                  placeholder="Tư vấn thiết kế"
                  class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>

              <div>
                <label for="message" class="block text-sm font-semibold text-slate-900 mb-2">Tin Nhắn</label>
                <textarea
                  v-model="form.message"
                  id="message"
                  rows="5"
                  placeholder="Nội dung tin nhắn của bạn..."
                  class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                :disabled="isSubmitting"
                class="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ isSubmitting ? 'Đang gửi...' : 'Gửi Tin Nhắn' }}
              </button>
            </form>
          </div>

          <!-- Map or Info -->
          <div>
            <h2 class="text-3xl font-bold mb-6 text-slate-900">Vị Trí Của Chúng Tôi</h2>
            <div class="rounded-2xl overflow-hidden shadow-lg h-96 bg-gray-200 flex items-center justify-center">
              <div class="text-center">
                <Icon name="i-lucide-map-pin" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p class="text-gray-600">
                  Bản đồ sẽ được hiển thị ở đây
                </p>
                <p class="text-sm text-gray-500 mt-2">
                  TP. Hồ Chí Minh, Việt Nam
                </p>
              </div>
            </div>

            <!-- Services -->
            <div class="mt-8">
              <h3 class="text-xl font-bold mb-4 text-slate-900">Dịch Vụ Tư Vấn</h3>
              <ul class="space-y-3">
                <li class="flex items-start gap-3">
                  <Icon name="i-lucide-check-circle" class="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                  <span class="text-gray-600">Tư vấn thiết kế miễn phí</span>
                </li>
                <li class="flex items-start gap-3">
                  <Icon name="i-lucide-check-circle" class="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                  <span class="text-gray-600">Lên bản vẽ 3D chi tiết</span>
                </li>
                <li class="flex items-start gap-3">
                  <Icon name="i-lucide-check-circle" class="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                  <span class="text-gray-600">Thi công chuyên nghiệp</span>
                </li>
                <li class="flex items-start gap-3">
                  <Icon name="i-lucide-check-circle" class="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                  <span class="text-gray-600">Hỗ trợ sau bán hàng</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="section-spacing bg-gray-50">
      <div class="max-w-4xl mx-auto">
        <h2 class="text-4xl font-bold mb-12 text-center text-slate-900">Câu Hỏi Thường Gặp</h2>
        
        <div class="space-y-4">
          <details class="group border border-gray-200 rounded-lg p-6 cursor-pointer">
            <summary class="font-semibold text-slate-900 flex items-center justify-between">
              Tư vấn thiết kế có mất phí không?
              <Icon name="i-lucide-chevron-down" class="w-5 h-5 group-open:rotate-180 transition-transform" />
            </summary>
            <p class="text-gray-600 mt-4">
              Không, chúng tôi cung cấp tư vấn thiết kế miễn phí cho tất cả khách hàng. Bạn chỉ cần liên hệ với chúng tôi để đặt lịch.
            </p>
          </details>

          <details class="group border border-gray-200 rounded-lg p-6 cursor-pointer">
            <summary class="font-semibold text-slate-900 flex items-center justify-between">
              Thời gian hoàn thành dự án như thế nào?
              <Icon name="i-lucide-chevron-down" class="w-5 h-5 group-open:rotate-180 transition-transform" />
            </summary>
            <p class="text-gray-600 mt-4">
              Thời gian hoàn thành phụ thuộc vào quy mô và độ phức tạp của dự án. Chúng tôi sẽ cung cấp lịch trình chi tiết sau khi tư vấn với bạn.
            </p>
          </details>

          <details class="group border border-gray-200 rounded-lg p-6 cursor-pointer">
            <summary class="font-semibold text-slate-900 flex items-center justify-between">
              Bạn có bảo hành cho công trình không?
              <Icon name="i-lucide-chevron-down" class="w-5 h-5 group-open:rotate-180 transition-transform" />
            </summary>
            <p class="text-gray-600 mt-4">
              Có, chúng tôi cung cấp bảo hành 2 năm cho tất cả các công trình thi công. Ngoài ra, chúng tôi cũng hỗ trợ bảo trì và sửa chữa.
            </p>
          </details>
        </div>
      </div>
    </section>
  </div>
</template>
