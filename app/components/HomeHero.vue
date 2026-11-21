<script setup lang="ts">
import { company } from '~/data/company'
import { homePageContent } from '~/data/home-page'
import { projects } from '~/data/projects'
import type { MediaAsset } from '~/shared/media/types'

defineProps<{
  image: MediaAsset
}>()

const { t, localePath } = useLanguage()

const fill = (text: string) => text
  .replaceAll('{year}', company.foundingYear ?? '')
  .replaceAll('{count}', String(projects.length))

// The founding-year fact only makes sense while a founding year is authored.
const facts = homePageContent.hero.facts.filter(fact => fact.id !== 'since' || company.foundingYear)
</script>

<template>
  <section
    data-testid="home-hero"
    data-track-location="hero"
    class="home-hero relative min-h-[var(--hero-min-h-home)] overflow-hidden bg-[var(--bg-dark)] text-[var(--text-main)]"
  >
    <NuxtImg
      :src="image.path"
      :alt="t({ vi: 'Khách sạn Eo Gió, Vĩnh Long: nội thất do Lai Huy thiết kế, sản xuất và thi công', en: 'Eo Gio Hotel, Vinh Long: interiors designed, produced and fitted out by Lai Huy' })"
      :width="image.width"
      :height="image.height"
      sizes="1536px xl:100vw"
      loading="eager"
      fetchpriority="high"
      class="hero-image hero-media home-hero__image absolute inset-0 h-full w-full object-cover"
    />
    <div
      class="home-hero__wash pointer-events-none absolute inset-0"
      aria-hidden="true"
    />

    <div class="shell relative z-10 flex min-h-[var(--hero-min-h-home)] flex-col justify-end pb-10 pt-28 md:pb-14">
      <div class="home-hero__copy">
        <p
          v-reveal
          class="hero-kicker home-eyebrow-text reveal"
        >
          {{ t(homePageContent.hero.eyebrow) }}
        </p>
        <!-- The headline arrives word by word in CSS (HeroWords), so it carries no scroll reveal. -->
        <h1 class="home-hero__title home-display-title font-display text-white">
          <HeroWords :text="t(homePageContent.hero.title)" />
        </h1>
        <p
          v-reveal="160"
          class="home-hero__sublead home-lead-text reveal mt-5 text-white/80"
        >
          {{ t(homePageContent.hero.description) }}
        </p>

        <div
          v-reveal="240"
          class="reveal mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
        >
          <NuxtLink
            :to="localePath('/lien-he#cach-gui-ho-so')"
            class="btn-bronze btn-bronze--on-dark group"
          >
            {{ t(homePageContent.hero.primaryCta) }}
            <Icon
              name="i-lucide-arrow-up-right"
              class="h-4 w-4 transition-transform duration-[var(--dur-hover)] ease-[var(--ease-editorial)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </NuxtLink>
          <a
            :href="company.zalo"
            target="_blank"
            rel="noopener noreferrer"
            class="btn-luxury-outline"
            data-testid="home-hero-zalo"
          >
            <Icon
              name="lh:zalo"
              class="h-5 w-5"
              aria-hidden="true"
            />
            {{ t(homePageContent.hero.zaloCta) }} {{ t(company.phoneDisplay) }}
          </a>
        </div>

        <dl
          v-reveal="320"
          :aria-label="t(homePageContent.hero.factsLabel)"
          data-testid="home-hero-facts"
          class="home-hero__facts reveal"
        >
          <div
            v-for="fact in facts"
            :key="fact.id"
            :data-fact="fact.id"
            class="home-hero__fact"
          >
            <dt class="home-hero__fact-label">
              {{ t(fact.label) }}
            </dt>
            <dd class="home-hero__fact-value font-display">
              {{ fill(t(fact.value)) }}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Scrim: the photograph carries the hero, so the wash is a LOCAL block behind the copy and
   nothing else. It is one flat Obsidian layer (0.78, under the 0.8 HL-04 ceiling) shaped by an
   intersected horizontal and vertical mask: full strength under the copy column (to 46% of the
   width, the bottom four fifths of the hero), then a long fall-off to nothing, so the room reads
   on the right and across the top. From 768 to 1023px the copy spans nearly the whole width, so
   the horizontal fall-off is only a gentle taper there.

   Copy contrast is measured, not assumed: against the real Supabase hero photograph, the
   built page with the text hidden and the wash applied, the lightest pixel behind each line of
   copy (every line box, Range.getClientRects), white and bronze-light text composited over it.
   Minimum over 1920x1080, 1440x900, 1280x800, 1024x768 and 768x1024, vi and en: eyebrow 4.8:1
   (need 4.5), h1 4.8:1 (need 3), sublead 6.2:1 (need 4.5), outline button label 6.2:1 (need 4.5);
   the bronze button is a solid fill, so its label does not depend on the wash.

   Below 768px the copy stacks full width over a tall crop, so a mask cannot shape the wash and
   it is re-cut to the copy's rhythm instead: 0.6 under the buttons, 0.78 behind the eyebrow,
   h1 and sublead, falling away above them so the furnished room (shelving, sofa; see the image's
   object-position) reads above the copy. Measured the same way at 320, 360, 375, 390 and 414px,
   vi and en: eyebrow 4.9:1, h1 7.0:1, sublead 5.0:1, outline button label 5.2:1. The 2026-11-21
   hero (longer headline, proof row under the actions) made the copy taller, so the 0.78 band now
   runs from 36% to 84% of the height and the 0.6 band holds the actions and the proof row; on
   desktop the vertical mask holds full strength to 80% so the eyebrow stays covered on short
   screens (1366x625).
   Re-measure if the copy length, the hero photograph, the object-position or these stops
   change. */
.home-hero__wash {
  --wash-x: linear-gradient(90deg, #000 0, #000 46%, rgb(0 0 0 / 0.6) 68%, transparent 92%);
  --wash-y: linear-gradient(0deg, #000 0, #000 80%, rgb(0 0 0 / 0.45) 90%, transparent 100%);

  /* A flat layer written as a gradient so the computed style still lists its alpha (HL-04). */
  background: linear-gradient(rgb(11 10 9 / 0.78), rgb(11 10 9 / 0.78));
  mask-image: var(--wash-x), var(--wash-y);
  mask-composite: intersect;
  -webkit-mask-image: var(--wash-x), var(--wash-y);
  -webkit-mask-composite: source-in;
}

@media (max-width: 1023px) {
  .home-hero__wash {
    --wash-x: linear-gradient(90deg, #000 0, #000 72%, rgb(0 0 0 / 0.55) 100%);
  }
}

/* Art direction: the photograph is 1499x830 and the hero is height-bound everywhere, so only
   the horizontal position is free. On a phone the visible slice is about a quarter of the width,
   and the centre of the frame is the hallway and the ceiling; the furnished room (shelving,
   armchair and sofa) sits at 56 to 95% of the width. */
.home-hero__image {
  object-position: 50% 50%;
}

@media (max-width: 767px) {
  .home-hero__image {
    object-position: 78% 50%;
  }

  .home-hero__wash {
    background: linear-gradient(
      0deg,
      rgb(11 10 9 / 0.6) 0%,
      rgb(11 10 9 / 0.6) 30%,
      rgb(11 10 9 / 0.78) 36%,
      rgb(11 10 9 / 0.78) 84%,
      rgb(11 10 9 / 0.3) 91%,
      transparent 97%
    );
    mask-image: none;
    -webkit-mask-image: none;
  }
}

.home-hero__copy {
  max-width: 68rem;
}

.home-hero__title {
  max-width: 64rem;
  font-weight: 500;
}

/* Proof row: three facts on hairlines under the actions, inside the copy column so the wash
   covers it. The figure leads visually (dd is ordered before dt) and every column starts at the
   same baseline, so a label that wraps never pushes its figure out of line. */
.home-hero__facts {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  max-width: 40rem;
  margin-top: 2rem;
  border-top: 1px solid rgb(255 255 255 / 0.2);
}

.home-hero__fact {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 0.25rem;
  padding: 0.875rem 1rem 0 0;
}

.home-hero__fact + .home-hero__fact {
  padding-left: 1rem;
  border-left: 1px solid rgb(255 255 255 / 0.2);
}

.home-hero__fact-value {
  order: -1;
  font-size: clamp(1rem, 0.9rem + 0.5vw, 1.25rem);
  font-weight: 500;
  line-height: 1.2;
  color: #fff;
}

.home-hero__fact-label {
  font-size: 0.75rem;
  line-height: 1.4;
  color: rgb(255 255 255 / 0.85);
}

@media (max-width: 767px) {
  .home-hero__facts {
    margin-top: 1.5rem;
  }

  .home-hero__fact {
    padding-right: 0.5rem;
  }

  .home-hero__fact + .home-hero__fact {
    padding-left: 0.75rem;
  }
}

/* A reading measure for the lead: about 60 characters, which also keeps it inside the wash. */
.home-hero__sublead {
  max-width: 38rem;
}
</style>
