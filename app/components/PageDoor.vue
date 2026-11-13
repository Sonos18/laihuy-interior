<script setup lang="ts">
// DESIGN.md "Page door": the last thing on a page, between its closing CTA and the footer. A
// full-bleed photograph that is the next page's hero, with one line of copy; the whole frame is
// the link. Following it lands on the same picture, so moving through the site reads as walking
// through a door rather than jumping.
//
// The <img> uses the hero's own `sizes` (AppHero/HomeHero), so the browser picks the same
// candidate the next hero will ask for. `loading="lazy"` starts that download as the reader
// nears the end of the page, which leaves the next hero already in the cache.
import { pageDoors, type PageDoorFrom } from '~/data/closing'
import { pageHeroAssets } from '~/media/page-heroes'
import { heroPlaceholders } from '~/media/placeholders.generated'

const props = defineProps<{ from: PageDoorFrom }>()

const { t } = useLanguage()
const door = computed(() => pageDoors[props.from])
const image = computed(() => pageHeroAssets[door.value.hero])
const placeholder = computed(() => heroPlaceholders[image.value.path])
</script>

<template>
  <NuxtLink
    :to="door.to"
    data-page-door
    class="page-door group"
  >
    <div
      v-if="placeholder"
      class="hero-placeholder"
      :style="{ backgroundImage: `url(${placeholder})` }"
      aria-hidden="true"
    />
    <NuxtImg
      :src="image.path"
      alt=""
      :width="image.width"
      :height="image.height"
      sizes="1536px xl:100vw"
      loading="lazy"
      decoding="async"
      class="page-door__image"
    />
    <div
      class="page-door__wash"
      aria-hidden="true"
    />
    <div class="page-door__body">
      <div class="shell page-door__row">
        <div>
          <p class="page-door__text">
            {{ t(door.text) }}
          </p>
          <span class="page-door__label">{{ t(door.linkLabel) }}</span>
        </div>
        <span
          class="page-door__arrow"
          aria-hidden="true"
        >
          <Icon
            name="i-lucide-arrow-right"
            class="h-5 w-5"
          />
        </span>
      </div>
    </div>
  </NuxtLink>
</template>

<style scoped>
.page-door {
  position: relative;
  display: block;
  height: clamp(20rem, 42vw, 35rem);
  overflow: hidden;
  isolation: isolate;
  background-color: var(--color-ink-950);
  color: #fff;
  text-decoration: none;
}

.page-door__image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--dur-image) var(--ease-editorial);
}

/* Copy sits on a floor wash, Obsidian under the 0.8 ceiling (HL-04), released by 85% so the
   room reads above the line. */
.page-door__wash {
  position: absolute;
  inset: 0;
  background: linear-gradient(0deg, rgb(11 10 9 / 0.8) 0%, rgb(11 10 9 / 0.6) 40%, transparent 85%);
}

.page-door__body {
  position: absolute;
  inset: auto 0 0;
  padding-bottom: clamp(1.75rem, 4vw, 3rem);
}

.page-door__row {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1.5rem;
}

.page-door__text {
  max-width: 22ch;
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 1.1rem + 1.6vw, 2.5rem);
  font-weight: 500;
  line-height: 1.12;
  letter-spacing: -0.02em;
  text-wrap: balance;
}

.page-door__label {
  display: inline-block;
  margin-top: 0.875rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--accent-dark);
}

.page-door__arrow {
  display: none;
  flex: none;
  width: 3.5rem;
  height: 3.5rem;
  place-items: center;
  border: 1px solid rgb(255 255 255 / 0.4);
  border-radius: 9999px;
  transition: background-color var(--dur-hover) var(--ease-editorial), border-color var(--dur-hover) var(--ease-editorial), color var(--dur-hover) var(--ease-editorial);
}

@media (min-width: 768px) {
  .page-door__arrow { display: grid; }
}

.page-door:hover .page-door__image,
.page-door:focus-visible .page-door__image {
  transform: scale(1.03);
}

.page-door:hover .page-door__arrow,
.page-door:focus-visible .page-door__arrow {
  border-color: var(--color-wood-400);
  background-color: var(--color-wood-400);
  color: var(--color-ink-950);
}

.page-door:focus-visible {
  outline: 2px solid var(--color-wood-500);
  outline-offset: -6px;
}

@media (prefers-reduced-motion: reduce) {
  .page-door__image,
  .page-door__arrow {
    transition: none;
  }

  .page-door:hover .page-door__image,
  .page-door:focus-visible .page-door__image {
    transform: none;
  }
}
</style>
