<script setup lang="ts">
import { company } from '~/data/company'
import { navLinks, uiText } from '~/data/ui'

defineOptions({
  name: 'CinematicFooter'
})

/**
 * The journey's final chapter: a full-viewport closing scene that replaces the
 * global site footer on the homepage. Keeps the cinematic dark / wood / serif
 * language and surfaces the company details, contact info, addresses, social
 * link and a final CTA — the calm bookend to the opening blueprint.
 */
type Props = {
  /** Chapter eyebrow number (kept in sync with the rail). */
  number?: string
}

withDefaults(defineProps<Props>(), {
  number: '10'
})

const { t, ta } = useLanguage()

const telHref = computed(() => `tel:${company.phone.replaceAll(' ', '')}`)
</script>

<template>
  <section class="closing">
    <div class="closing-grid" />
    <div class="closing-inner">
      <header class="closing-head">
        <p
          class="closing-eyebrow"
          data-reveal
        >
          <span>{{ number }}</span>
          <span class="closing-rule" />
          {{ t({ vi: 'Hợp tác', en: 'Let\'s build' }) }}
        </p>
        <h2
          class="closing-title font-display"
          data-reveal
        >
          {{ t({ vi: 'Cùng kiến tạo điều phi thường', en: 'Let\'s build something extraordinary' }) }}
        </h2>
        <p
          class="closing-positioning"
          data-reveal
        >
          {{ t(company.shortPositioning) }}
        </p>
        <div
          class="closing-actions"
          data-reveal
        >
          <NuxtLink
            to="/lien-he"
            class="closing-cta"
          >
            {{ t(uiText.cta.quote24h) }}
            <Icon
              name="i-lucide-arrow-right"
              class="closing-cta-icon"
            />
          </NuxtLink>
          <a
            :href="telHref"
            class="closing-phone"
          >
            <Icon
              name="i-lucide-phone"
              class="closing-inline-icon"
            />
            {{ company.phone }}
          </a>
        </div>
      </header>

      <div class="closing-details">
        <div
          class="closing-col"
          data-reveal
        >
          <h3 class="closing-col-title">
            {{ t(uiText.labels.contact) }}
          </h3>
          <ul class="closing-list">
            <li>
              <Icon
                name="i-lucide-mail"
                class="closing-list-icon"
              />
              <a :href="`mailto:${company.email}`">{{ company.email }}</a>
            </li>
            <li>
              <Icon
                name="i-lucide-clock"
                class="closing-list-icon"
              />
              <span>
                <span
                  v-for="line in ta(company.workingHours)"
                  :key="line"
                  class="closing-block-line"
                >{{ line }}</span>
              </span>
            </li>
            <li>
              <Icon
                name="i-simple-icons-facebook"
                class="closing-list-icon"
              />
              <a
                :href="company.facebook"
                target="_blank"
                rel="noopener noreferrer"
              >Facebook</a>
            </li>
          </ul>
        </div>

        <div
          class="closing-col"
          data-reveal
        >
          <h3 class="closing-col-title">
            {{ t({ vi: 'Địa chỉ', en: 'Addresses' }) }}
          </h3>
          <ul class="closing-list">
            <li
              v-for="address in company.addresses"
              :key="t(address.label)"
            >
              <Icon
                name="i-lucide-map-pin"
                class="closing-list-icon"
              />
              <a
                :href="address.mapUrl"
                target="_blank"
                rel="noopener noreferrer"
              >
                <strong class="closing-block-strong">{{ t(address.label) }}</strong>
                {{ t(address.address) }}
              </a>
            </li>
          </ul>
        </div>

        <nav
          class="closing-col"
          data-reveal
          :aria-label="t(uiText.labels.navigation)"
        >
          <h3 class="closing-col-title">
            {{ t(uiText.labels.navigation) }}
          </h3>
          <ul class="closing-nav">
            <li
              v-for="link in navLinks"
              :key="link.to"
            >
              <NuxtLink :to="link.to">
                {{ t(link.label) }}
              </NuxtLink>
            </li>
          </ul>
        </nav>
      </div>

      <p
        class="closing-copyright"
        data-reveal
      >
        &copy; {{ new Date().getFullYear() }} {{ company.name }}. All rights reserved.
      </p>
    </div>
  </section>
</template>

<style scoped>
.closing {
  position: relative;
  display: flex;
  align-items: center;
  min-height: 100vh;
  min-height: 100svh;
  overflow: hidden;
  background-color: var(--color-ink-950, #0b0a09);
  color: #fff;
}

/* Faint drafting grid — bookends the opening blueprint linework. */
.closing-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(197, 155, 117, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(197, 155, 117, 0.05) 1px, transparent 1px);
  background-size: 56px 56px;
  mask-image: radial-gradient(120% 100% at 50% 40%, #000 35%, transparent 80%);
}

.closing-inner {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 80rem;
  margin: 0 auto;
  padding: 7rem 1.5rem 3rem;
}

@media (min-width: 1024px) {
  .closing-inner {
    padding-inline: 2rem;
  }
}

.closing-eyebrow {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: var(--color-wood-300, #c59b75);
}

.closing-rule {
  width: 2.5rem;
  height: 1px;
  background: currentColor;
  opacity: 0.6;
}

.closing-title {
  margin-top: 1.25rem;
  font-weight: 300;
  line-height: 1.03;
  letter-spacing: -0.01em;
  font-size: clamp(2.2rem, 5vw, 4rem);
  max-width: 42rem;
}

.closing-positioning {
  margin-top: 1.25rem;
  max-width: 40rem;
  font-size: clamp(0.98rem, 1.2vw, 1.15rem);
  line-height: 1.65;
  color: rgba(255, 255, 255, 0.7);
}

.closing-actions {
  margin-top: 2rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1.25rem 2.5rem;
}

.closing-cta {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding-bottom: 0.4rem;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #fff;
  border-bottom: 1px solid var(--color-wood-400, #b8875a);
  transition: color 0.3s ease, gap 0.3s ease;
}

.closing-cta:hover {
  color: var(--color-wood-300, #c59b75);
  gap: 1rem;
}

.closing-cta-icon {
  width: 1rem;
  height: 1rem;
}

.closing-phone {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  font-size: 0.95rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.86);
  transition: color 0.3s ease;
}

.closing-phone:hover {
  color: #fff;
}

.closing-inline-icon {
  width: 1rem;
  height: 1rem;
  color: var(--color-wood-300, #c59b75);
}

.closing-details {
  margin-top: 2.75rem;
  display: grid;
  gap: 2rem 2.5rem;
  grid-template-columns: 1fr;
}

@media (min-width: 768px) {
  .closing-details {
    grid-template-columns: repeat(3, 1fr);
  }
}

.closing-col-title {
  margin-bottom: 1.25rem;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.5);
}

.closing-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  font-size: 0.92rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.72);
}

.closing-list li {
  display: flex;
  gap: 0.7rem;
}

.closing-list a:hover {
  color: #fff;
}

.closing-list-icon {
  margin-top: 0.2rem;
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
  color: var(--color-wood-300, #c59b75);
}

.closing-block-line,
.closing-block-strong {
  display: block;
}

.closing-block-strong {
  color: rgba(255, 255, 255, 0.92);
}

.closing-nav {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem 1.25rem;
  font-size: 0.92rem;
  color: rgba(255, 255, 255, 0.72);
}

.closing-nav a:hover {
  color: #fff;
}

.closing-copyright {
  margin-top: 2.25rem;
  padding-top: 1.25rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 0.82rem;
  color: rgba(255, 255, 255, 0.42);
}
</style>
