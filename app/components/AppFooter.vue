<script setup lang="ts">
// Phase 1 — pure extraction from app.vue. DOM, classes, behaviour unchanged.
// The redesign lands in Phase 6 (docs/header-footer-art-direction.md §10).
import { company } from '~/data/company'
import { navLinks, uiText } from '~/data/ui'

const { t, ta } = useLanguage()
</script>

<template>
  <footer class="bg-ink-950 text-white">
    <div class="shell py-16">
      <div class="grid gap-12 lg:grid-cols-[1.3fr_0.8fr_0.9fr_1.2fr]">
        <div>
          <img
            src="/logo-white.png"
            alt="Lai Huy Interior"
            class="mb-6 h-20 w-auto"
          >
          <p class="max-w-sm text-sm leading-7 text-white/68">
            {{ t(company.positioning) }}
          </p>
          <div class="mt-7 flex flex-wrap gap-3">
            <NuxtLink
              to="/lien-he"
              class="btn-primary"
            >
              {{ t(uiText.cta.contact) }}
            </NuxtLink>
            <NuxtLink
              to="/nha-xuong"
              class="btn-secondary"
            >
              {{ t(uiText.cta.factory) }}
            </NuxtLink>
          </div>
        </div>

        <div>
          <h4 class="mb-5 text-sm font-bold uppercase tracking-[0.2em] text-white/55">
            {{ t(uiText.labels.navigation) }}
          </h4>
          <ul class="space-y-3">
            <li
              v-for="link in navLinks"
              :key="link.to"
            >
              <NuxtLink
                :to="link.to"
                class="text-sm text-white/62 transition-colors hover:text-white"
              >
                {{ t(link.label) }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <div>
          <h4 class="mb-5 text-sm font-bold uppercase tracking-[0.2em] text-white/55">
            {{ t(uiText.labels.services) }}
          </h4>
          <ul class="space-y-3 text-sm text-white/62">
            <li
              v-for="service in ta(company.footerServices)"
              :key="service"
            >
              {{ service }}
            </li>
          </ul>
        </div>

        <div>
          <h4 class="mb-5 text-sm font-bold uppercase tracking-[0.2em] text-white/55">
            {{ t(uiText.labels.contact) }}
          </h4>
          <ul class="space-y-4 text-sm text-white/68">
            <li class="flex gap-3">
              <Icon
                name="i-lucide-phone"
                class="mt-0.5 h-4 w-4 shrink-0 text-wood-300"
              />
              <a :href="`tel:${company.phone.replaceAll(' ', '')}`">
                {{ company.phone }}
              </a>
            </li>
            <li class="flex gap-3">
              <Icon
                name="i-lucide-mail"
                class="mt-0.5 h-4 w-4 shrink-0 text-wood-300"
              />
              <a :href="`mailto:${company.email}`">
                {{ company.email }}
              </a>
            </li>
            <li
              v-for="address in company.addresses"
              :key="t(address.label)"
              class="flex gap-3"
            >
              <Icon
                name="i-lucide-map-pin"
                class="mt-0.5 h-4 w-4 shrink-0 text-wood-300"
              />
              <a
                :href="address.mapUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="leading-6 hover:text-white"
              >
                <strong class="block text-white/86">{{ t(address.label) }}</strong>
                {{ t(address.address) }}
              </a>
            </li>
            <li class="flex gap-3">
              <Icon
                name="i-lucide-clock"
                class="mt-0.5 h-4 w-4 shrink-0 text-wood-300"
              />
              <span>
                <span
                  v-for="line in ta(company.workingHours)"
                  :key="line"
                  class="block"
                >
                  {{ line }}
                </span>
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div class="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm text-white/42 md:flex-row md:items-center md:justify-between">
        <p>
          &copy; {{ new Date().getFullYear() }} Lai Huy Interior. All rights reserved.
        </p>
        <a
          :href="company.facebook"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-2 transition-colors hover:text-white"
        >
          <Icon
            name="i-simple-icons-facebook"
            class="h-4 w-4"
          />
          Facebook
        </a>
      </div>
    </div>
  </footer>
</template>
