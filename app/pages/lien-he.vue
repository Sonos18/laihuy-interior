<script setup>
useSeoMeta({
  title: "Liên Hệ - Lai Huy Interior | Thiết kế nội thất",
  description: "Liên hệ với Lai Huy Interior để nhận tư vấn thiết kế miễn phí",
});

const form = reactive({
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
});

const isSubmitting = ref(false);

const submitForm = async () => {
  isSubmitting.value = true;
  // Simulate form submission
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log("Form submitted:", form);
  form.name = "";
  form.email = "";
  form.phone = "";
  form.subject = "";
  form.message = "";
  isSubmitting.value = false;
};
const contactInfo = [
  {
    icon: "i-lucide-map-pin",
    title: "Địa Chỉ",
    lines: [
      "557E1 - KP2 - Phường Phú Khương",
      "TP. Bến Tre - Bến Tre, Tỉnh Bến Tre, Vietnam",
    ],
  },
  {
    icon: "i-lucide-phone",
    title: "Liên Hệ",
    lines: ["+84 (0) 123 456 789", "info@laihuy.vn"],
  },
  {
    icon: "i-lucide-clock",
    title: "Giờ Làm Việc",
    lines: ["Thứ 2 - Thứ 6: 8:00 - 18:00", "Thứ 7 - Chủ nhật: 9:00 - 17:00"],
  },
];

const services = [
  "Tư vấn thiết kế miễn phí",
  "Lên bản vẽ 3D chi tiết",
  "Thi công chuyên nghiệp",
  "Hỗ trợ sau bán hàng",
];

const faqs = [
  {
    question: "Tư vấn thiết kế có mất phí không?",
    answer:
      "Không, chúng tôi cung cấp tư vấn thiết kế miễn phí cho tất cả khách hàng. Bạn chỉ cần liên hệ với chúng tôi để đặt lịch.",
  },
  {
    question: "Thời gian hoàn thành dự án như thế nào?",
    answer:
      "Thời gian hoàn thành phụ thuộc vào quy mô và độ phức tạp của dự án. Chúng tôi sẽ cung cấp lịch trình chi tiết sau khi tư vấn với bạn.",
  },
  {
    question: "Bạn có bảo hành cho công trình không?",
    answer:
      "Có, chúng tôi cung cấp bảo hành 2 năm cho tất cả các công trình thi công. Ngoài ra, chúng tôi cũng hỗ trợ bảo trì và sửa chữa.",
  },
];

// Scroll reveal refs
const contactCardRefs = ref([]);
const formRef = ref(null);
const mapRef = ref(null);
const faqHeaderRef = ref(null);
const faqCardRefs = ref([]);

useScrollReveal(formRef, { direction: "left" });
useScrollReveal(mapRef, { direction: "right" });
useScrollReveal(faqHeaderRef);

contactInfo.forEach((_, index) => {
  useScrollReveal(
    computed(() => contactCardRefs.value[index]),
    { delay: index * 150 },
  );
});

faqs.forEach((_, index) => {
  useScrollReveal(
    computed(() => faqCardRefs.value[index]),
    { delay: index * 100 },
  );
});
</script>

<template>
  <div>
    <AppHero
      topic="Contact"
      title="Liên Hệ Với"
      special-title="Chúng Tôi"
      subtitle="Chúng tôi sẵn sàng lắng nghe ý tưởng của bạn"
      bg-image="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&h=800&fit=crop"
    />

    <!-- ==================== CONTACT INFO ==================== -->
    <section class="section-spacing bg-white">
      <div class="max-w-7xl mx-auto">
        <!-- Info Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div
            v-for="(info, index) in contactInfo"
            :key="info.title"
            :ref="
              (el) => {
                if (el) contactCardRefs[index] = el;
              }
            "
          >
            <div
              class="group relative bg-white border border-gray-100 rounded-2xl p-8 hover:shadow-2xl transition-all duration-500 overflow-hidden"
            >
              <div
                class="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-orange-400 to-orange-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
              />
              <div
                class="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center mb-6 group-hover:bg-orange-500 group-hover:scale-110 transition-all duration-300"
              >
                <Icon
                  :name="info.icon"
                  class="w-7 h-7 text-orange-500 group-hover:text-white transition-colors"
                />
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-3">
                {{ info.title }}
              </h3>
              <p
                v-for="line in info.lines"
                :key="line"
                class="text-gray-500 leading-relaxed"
              >
                {{ line }}
              </p>
            </div>
          </div>
        </div>

        <!-- Form + Map Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          <!-- Contact Form -->
          <div ref="formRef">
            <div>
              <span
                class="text-orange-500 uppercase tracking-[0.2em] text-xs font-semibold"
              >
                Gửi tin nhắn
              </span>
              <h2
                class="text-4xl md:text-5xl font-bold text-gray-900 mt-3 mb-8"
              >
                Liên Hệ <span class="text-orange-500">Ngay</span>
              </h2>

              <form class="space-y-6" @submit.prevent="submitForm">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label
                      for="name"
                      class="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Tên của bạn
                    </label>
                    <input
                      id="name"
                      v-model="form.name"
                      type="text"
                      placeholder="Nhập tên của bạn"
                      class="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label
                      for="email"
                      class="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      v-model="form.email"
                      type="email"
                      placeholder="email@example.com"
                      class="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label
                      for="phone"
                      class="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Số Điện Thoại
                    </label>
                    <input
                      id="phone"
                      v-model="form.phone"
                      type="tel"
                      placeholder="+84 (0) 123 456 789"
                      class="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label
                      for="subject"
                      class="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Chủ Đề
                    </label>
                    <input
                      id="subject"
                      v-model="form.subject"
                      type="text"
                      placeholder="Tư vấn thiết kế"
                      class="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label
                    for="message"
                    class="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Tin Nhắn
                  </label>
                  <textarea
                    id="message"
                    v-model="form.message"
                    rows="5"
                    placeholder="Nội dung tin nhắn của bạn..."
                    class="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  :disabled="isSubmitting"
                  class="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Icon
                    v-if="isSubmitting"
                    name="i-lucide-loader-2"
                    class="w-5 h-5 animate-spin"
                  />
                  {{ isSubmitting ? "Đang gửi..." : "Gửi Tin Nhắn" }}
                </button>
              </form>
            </div>
          </div>

          <!-- Right Column: Map + Services -->
          <div ref="mapRef">
            <div>
              <span
                class="text-orange-500 uppercase tracking-[0.2em] text-xs font-semibold"
              >
                Vị trí
              </span>
              <h2
                class="text-4xl md:text-5xl font-bold text-gray-900 mt-3 mb-8"
              >
                Tìm <span class="text-orange-500">Chúng Tôi</span>
              </h2>

              <!-- Map Placeholder -->
              <div
                class="rounded-2xl overflow-hidden h-80 bg-gray-100 border border-gray-200 flex items-center justify-center"
              >
                <div class="text-center">
                  <div
                    class="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center mx-auto mb-4"
                  >
                    <Icon
                      name="i-lucide-map-pin"
                      class="w-8 h-8 text-orange-500"
                    />
                  </div>
                  <p class="text-gray-500 font-medium">
                    Bản đồ sẽ hiển thị ở đây
                  </p>
                  <p class="text-sm text-gray-400 mt-1">
                    TP. Hồ Chí Minh, Việt Nam
                  </p>
                </div>
              </div>

              <!-- Services Checklist -->
              <div class="mt-10">
                <h3 class="text-xl font-bold text-gray-900 mb-6">
                  Dịch Vụ <span class="text-orange-500">Tư Vấn</span>
                </h3>
                <ul class="space-y-4">
                  <li
                    v-for="service in services"
                    :key="service"
                    class="flex items-center gap-4 p-4 rounded-xl hover:bg-orange-50 transition-colors"
                  >
                    <div
                      class="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center shrink-0"
                    >
                      <Icon
                        name="i-lucide-check"
                        class="w-4 h-4 text-orange-500"
                      />
                    </div>
                    <span class="text-gray-600 font-medium">{{ service }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ==================== FAQ ==================== -->
    <section class="section-spacing bg-gray-50">
      <div class="max-w-4xl mx-auto">
        <div ref="faqHeaderRef">
          <div class="text-center mb-16">
            <span
              class="text-orange-500 uppercase tracking-[0.2em] text-xs font-semibold"
            >
              FAQ
            </span>
            <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mt-3">
              Câu Hỏi
              <span class="text-orange-500">Thường Gặp</span>
            </h2>
          </div>
        </div>

        <div class="space-y-4">
          <div
            v-for="(faq, index) in faqs"
            :key="index"
            :ref="
              (el) => {
                if (el) faqCardRefs[index] = el;
              }
            "
          >
            <details
              class="group bg-white border border-gray-100 rounded-2xl p-6 cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden"
            >
              <summary
                class="font-bold text-gray-900 flex items-center justify-between gap-4"
              >
                {{ faq.question }}
                <div
                  class="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center shrink-0 group-open:bg-orange-500 transition-colors"
                >
                  <Icon
                    name="i-lucide-chevron-down"
                    class="w-4 h-4 text-orange-500 group-open:text-white group-open:rotate-180 transition-all"
                  />
                </div>
              </summary>
              <p class="text-gray-500 mt-4 leading-relaxed">
                {{ faq.answer }}
              </p>
            </details>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
