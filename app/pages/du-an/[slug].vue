<script setup>
import { projects } from "~/data/projects";

const route = useRoute();
const slug = route.params.slug;

const project = projects.find((p) => p.slug === slug);

if (project) {
  useSeoMeta({
    title: `${project.name} - Lai Huy Interior`,
    description: project.shortDescription,
  });
}

const allImages = project ? [...project.image, ...project.gallery] : [];
const currentImageIndex = ref(0);

const nextImage = () => {
  currentImageIndex.value = (currentImageIndex.value + 1) % allImages.length;
};

const prevImage = () => {
  currentImageIndex.value =
    (currentImageIndex.value - 1 + allImages.length) % allImages.length;
};

const relatedProjects = projects.filter((p) => p.slug !== slug).slice(0, 3);

const infoItems = project
  ? [
      {
        icon: "i-lucide-tag",
        label: "Danh Mục",
        value: project.categoryName,
        highlight: true,
      },
      {
        icon: "i-lucide-map-pin",
        label: "Vị Trí",
        value: project.location,
        highlight: false,
      },
    ]
  : [];

// Scroll reveal refs
const detailsRef = ref(null);
const infoCardRef = ref(null);
const galleryRef = ref(null);
const relatedHeaderRef = ref(null);
const relatedCardRefs = ref([]);
const ctaRef = ref(null);

useScrollReveal(detailsRef);
useScrollReveal(infoCardRef, { direction: "right" });
useScrollReveal(galleryRef, { delay: 150 });
useScrollReveal(relatedHeaderRef);
useScrollReveal(ctaRef);

relatedProjects.forEach((_, index) => {
  useScrollReveal(
    computed(() => relatedCardRefs.value[index]),
    { delay: index * 150 },
  );
});
</script>

<template>
  <div>
    <!-- ==================== 404 ==================== -->
    <template v-if="!project">
      <section class="section-spacing bg-white">
        <div class="max-w-7xl mx-auto text-center">
          <p class="text-8xl font-bold text-orange-500 mb-6">404</p>
          <h1 class="text-3xl font-bold text-gray-900 mb-4">
            Không tìm thấy dự án
          </h1>
          <p class="text-gray-500 text-lg mb-10">
            Dự án bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
          </p>
          <NuxtLink to="/du-an" class="btn-primary inline-block">
            Quay lại danh sách dự án
          </NuxtLink>
        </div>
      </section>
    </template>

    <template v-else>
      <!-- ==================== HERO IMAGE GALLERY ==================== -->
      <section class="relative h-[50vh] md:h-screen overflow-hidden group">
        <img
          :src="allImages[currentImageIndex]"
          :alt="project.name"
          class="w-full h-full object-cover transition-transform duration-700"
        />

        <!-- Gradient Overlay -->
        <div
          class="absolute inset-0 bg-linear-to-t from-gray-950/60 via-transparent to-gray-950/30"
        />

        <!-- Navigation Buttons -->
        <button
          v-if="allImages.length > 1"
          class="absolute left-6 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white p-3 rounded-full transition-all opacity-0 group-hover:opacity-100 border border-white/20"
          @click="prevImage"
        >
          <Icon name="i-lucide-chevron-left" class="w-6 h-6" />
        </button>

        <button
          v-if="allImages.length > 1"
          class="absolute right-6 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white p-3 rounded-full transition-all opacity-0 group-hover:opacity-100 border border-white/20"
          @click="nextImage"
        >
          <Icon name="i-lucide-chevron-right" class="w-6 h-6" />
        </button>

        <!-- Image Counter -->
        <div
          v-if="allImages.length > 1"
          class="absolute bottom-6 right-6 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm border border-white/20"
        >
          {{ currentImageIndex + 1 }} / {{ allImages.length }}
        </div>

        <!-- Image Thumbnails -->
        <div
          v-if="allImages.length > 1"
          class="absolute bottom-6 left-6 flex gap-2"
        >
          <button
            v-for="(image, index) in allImages"
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
              <div ref="detailsRef">
                <span
                  class="text-orange-500 uppercase tracking-[0.2em] text-xs font-semibold"
                >
                  {{ project.categoryName }}
                </span>
                <h1
                  class="text-4xl md:text-5xl font-bold text-gray-900 mt-3 mb-6"
                >
                  {{ project.name }}
                </h1>
                <div class="space-y-5">
                  <p
                    v-for="(paragraph, index) in project.description"
                    :key="index"
                    class="text-gray-500 text-lg leading-relaxed"
                  >
                    {{ paragraph }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Project Info Card -->
            <div>
              <div ref="infoCardRef">
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
                        <Icon
                          :name="item.icon"
                          class="w-5 h-5 text-orange-500"
                        />
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
                            item.highlight
                              ? 'text-orange-500'
                              : 'text-gray-900',
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
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ==================== GALLERY ==================== -->
      <section
        v-if="project.gallery.length > 0"
        class="section-spacing bg-gray-50"
      >
        <div class="max-w-7xl mx-auto">
          <div ref="galleryRef">
            <div class="text-center mb-16">
              <span
                class="text-orange-500 uppercase tracking-[0.2em] text-xs font-semibold"
              >
                Hình ảnh thực tế
              </span>
              <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mt-3">
                Bộ Sưu Tập <span class="text-orange-500">Ảnh</span>
              </h2>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div
                v-for="(img, index) in project.gallery"
                :key="index"
                class="group relative rounded-2xl overflow-hidden aspect-video"
              >
                <BaseImage
                  :src="img"
                  :alt="`${project.name} - ${index + 1}`"
                  class="absolute inset-0"
                  img-class="group-hover:scale-110 transition-transform duration-700"
                />
                <div
                  class="absolute inset-0 bg-gray-950/0 group-hover:bg-gray-950/20 transition-colors duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ==================== RELATED PROJECTS ==================== -->
      <section class="section-spacing bg-white">
        <div class="max-w-7xl mx-auto">
          <div ref="relatedHeaderRef">
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
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div
              v-for="(rp, index) in relatedProjects"
              :key="rp.slug"
              :ref="
                (el) => {
                  if (el) relatedCardRefs[index] = el;
                }
              "
            >
              <NuxtLink
                :to="`/du-an/${rp.slug}`"
                class="group relative block h-80 rounded-2xl overflow-hidden"
              >
                <BaseImage
                  :src="rp.image[0]"
                  :alt="rp.name"
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
                    {{ rp.categoryName }}
                  </span>
                  <h3 class="text-white text-xl font-bold mt-1">
                    {{ rp.name }}
                  </h3>
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
        </div>
      </section>
    </template>
  </div>
</template>
