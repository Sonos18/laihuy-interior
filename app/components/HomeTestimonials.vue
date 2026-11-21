<script setup lang="ts">
// Client testimonials (owner-approved Stitch mockup, 2026-11-21): white cards on the warm canvas,
// 4px edges and a hairline, the quote first and the author, role and project under it. The section
// renders only when company.testimonials holds real, owner-supplied quotes; there are no ratings,
// stars or placeholder reviews.
import { company } from '~/data/company'
import { homePageContent } from '~/data/home-page'

const { t } = useLanguage()

const testimonials = company.testimonials
</script>

<template>
  <section
    v-if="testimonials.length"
    data-testid="home-testimonials"
    class="home-testimonials section-y border-t border-[var(--rule-light)]"
  >
    <div class="shell">
      <SectionHead
        layout="rail"
        eyebrow-class="eyebrow home-eyebrow-text text-wood-600"
        :eyebrow="t(homePageContent.testimonials.eyebrow)"
        :title="t(homePageContent.testimonials.title)"
      />

      <ul
        class="home-testimonials__list mt-12"
        role="list"
      >
        <li
          v-for="(item, index) in testimonials"
          :key="index"
          v-reveal="index * 80"
          class="home-testimonials__card reveal"
        >
          <figure class="flex h-full flex-col">
            <blockquote class="flex-1 text-base leading-[1.7] text-ink-950">
              <p>“{{ t(item.quote) }}”</p>
            </blockquote>
            <figcaption class="mt-6 border-t border-[var(--rule-light)] pt-4">
              <p class="text-sm font-semibold text-ink-950">
                {{ t(item.author) }}
              </p>
              <p
                v-if="item.role"
                class="mt-1 text-sm text-ink-600"
              >
                {{ t(item.role) }}
              </p>
              <p
                v-if="item.project"
                class="mt-1 text-sm text-wood-600"
              >
                {{ t(item.project) }}
              </p>
            </figcaption>
          </figure>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.home-testimonials__list {
  display: grid;
  gap: 1rem;
}

@media (min-width: 768px) {
  .home-testimonials__list {
    grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
    gap: 1.5rem;
  }
}

.home-testimonials__card {
  padding: 1.5rem;
  border: 1px solid var(--rule-light);
  border-radius: 4px;
  background: #fff;
}
</style>
