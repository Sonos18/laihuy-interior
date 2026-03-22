<script setup>
useSeoMeta({
  title:
    "Giới thiệu - Lai Huy Interior | Thiết kế nội thất hiện đại & đẳng cấp",
  description:
    "Tìm hiểu về Lai Huy Interior - công ty thiết kế nội thất hàng đầu với 15 năm kinh nghiệm",
});

const values = [
  {
    icon: "i-lucide-heart",
    title: "Tình Yêu Với Thiết Kế",
    description:
      "Chúng tôi yêu thích từng chi tiết, từ đó tạo nên những không gian hoàn hảo",
  },
  {
    icon: "i-lucide-users",
    title: "Phục Vụ Khách Hàng",
    description: "Sự hài lòng của khách hàng là ưu tiên hàng đầu của chúng tôi",
  },
  {
    icon: "i-lucide-zap",
    title: "Đổi Mới Sáng Tạo",
    description: "Luôn tìm kiếm cách mới, công nghệ mới để nâng cao chất lượng",
  },
];

const stats = [
  { value: "15+", label: "Năm kinh nghiệm" },
  { value: "1000+", label: "Dự án hoàn thành" },
  { value: "500+", label: "Khách hàng hài lòng" },
  { value: "50+", label: "Giải thưởng" },
];
</script>

<template>
  <div>
    <!-- ==================== HERO ==================== -->
    <section class="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      <!-- Background Image -->
      <img
        src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&h=800&fit=crop"
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
          Về chúng tôi
        </span>
        <h1
          class="text-5xl md:text-6xl font-bold text-white mb-6 animate-fade-in-up"
          style="animation-delay: 150ms"
        >
          Giới Thiệu <span class="text-orange-500">Lai Huy</span>
        </h1>
        <p
          class="text-xl text-gray-400 max-w-2xl animate-fade-in-up"
          style="animation-delay: 300ms"
        >
          Hơn 15 năm tạo nên những không gian sống tinh tế, đẳng cấp
        </p>
      </div>
    </section>

    <!-- ==================== COMPANY STORY ==================== -->
    <section class="section-spacing bg-white">
      <div class="max-w-7xl mx-auto">
        <div
          class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center"
        >
          <!-- Image with decorative accent -->
          <ScrollReveal direction="left">
            <div class="relative">
              <BaseImage
                src="https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600&h=750&fit=crop"
                alt="Lai Huy Interior"
                class="rounded-2xl aspect-4/5 w-full"
              />
              <div
                class="absolute -bottom-6 -right-6 w-40 h-40 bg-linear-to-br from-orange-400 to-orange-500 rounded-2xl -z-10"
              />
              <div
                class="absolute -bottom-4 left-6 bg-white rounded-xl shadow-xl p-4 flex items-center gap-3"
              >
                <div
                  class="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center"
                >
                  <Icon name="i-lucide-award" class="w-6 h-6 text-white" />
                </div>
                <div>
                  <div class="text-2xl font-bold text-gray-900">2009</div>
                  <div class="text-xs text-gray-500">Năm thành lập</div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          <!-- Text Content -->
          <ScrollReveal direction="right">
            <div>
              <span
                class="text-orange-500 uppercase tracking-[0.2em] text-xs font-semibold"
              >
                Câu chuyện của chúng tôi
              </span>
              <h2
                class="text-4xl md:text-5xl font-bold text-gray-900 mt-3 mb-6"
              >
                Hành Trình
                <span class="text-orange-500">Sáng Tạo</span>
              </h2>
              <p class="text-gray-500 text-lg leading-relaxed mb-4">
                Lai Huy Interior được thành lập vào năm 2009 bởi những người đam
                mê thiết kế nội thất và kiến trúc. Chúng tôi bắt đầu từ một nhóm
                nhỏ với những ý tưởng lớn và tầm nhìn rõ ràng.
              </p>
              <p class="text-gray-500 text-lg leading-relaxed mb-4">
                Qua những năm, chúng tôi đã phát triển thành một công ty hàng
                đầu với đội ngũ thiết kế chuyên nghiệp, kiến trúc sư tài năng và
                thợ thủ công lành nghề.
              </p>
              <p class="text-gray-500 text-lg leading-relaxed">
                Hôm nay, Lai Huy tự hào là người bạn đáng tin cậy của hàng nghìn
                gia đình và doanh nghiệp trong việc tạo nên những không gian
                sống và làm việc tuyệt vời.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>

    <!-- ==================== VALUES ==================== -->
    <section class="section-spacing bg-gray-50">
      <div class="max-w-7xl mx-auto">
        <ScrollReveal>
          <div class="text-center mb-16">
            <span
              class="text-orange-500 uppercase tracking-[0.2em] text-xs font-semibold"
            >
              Giá trị cốt lõi
            </span>
            <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mt-3">
              Điều Chúng Tôi
              <span class="text-orange-500">Tin Tưởng</span>
            </h2>
          </div>
        </ScrollReveal>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <ScrollReveal
            v-for="(value, index) in values"
            :key="value.title"
            :delay="index * 150"
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
                  :name="value.icon"
                  class="w-7 h-7 text-orange-500 group-hover:text-white transition-colors"
                />
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-3">
                {{ value.title }}
              </h3>
              <p class="text-gray-500 leading-relaxed">
                {{ value.description }}
              </p>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>

    <!-- ==================== STATS ==================== -->
    <section class="section-spacing bg-white">
      <div class="max-w-7xl mx-auto">
        <ScrollReveal>
          <div class="text-center mb-16">
            <span
              class="text-orange-500 uppercase tracking-[0.2em] text-xs font-semibold"
            >
              Thành tựu
            </span>
            <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mt-3">
              Những Con Số
              <span class="text-orange-500">Nói Lên</span>
            </h2>
          </div>
        </ScrollReveal>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
          <ScrollReveal
            v-for="(stat, index) in stats"
            :key="stat.label"
            :delay="index * 100"
          >
            <div
              class="group text-center p-8 rounded-2xl hover:bg-gray-50 hover:shadow-xl transition-all duration-500"
            >
              <div
                class="text-5xl md:text-6xl font-bold text-orange-500 mb-3 group-hover:scale-110 transition-transform"
              >
                {{ stat.value }}
              </div>
              <p class="text-gray-500 font-medium">{{ stat.label }}</p>
            </div>
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
            Hãy Liên Hệ
            <br class="hidden md:block" />
            Với Chúng Tôi
          </h2>
          <p class="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            Để tìm hiểu thêm hoặc đặt lịch tư vấn thiết kế miễn phí
          </p>
          <NuxtLink
            to="/lien-he"
            class="inline-block bg-white text-orange-600 hover:bg-gray-50 px-10 py-4 rounded-full font-bold text-lg transition-colors shadow-lg"
          >
            Liên hệ ngay
          </NuxtLink>
        </div>
      </ScrollReveal>
    </section>
  </div>
</template>
