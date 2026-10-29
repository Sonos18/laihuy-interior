<script setup lang="ts">
// The footer, compact direction ("C · Gọn", owner-approved 2026-10-29).
//
// THREE TIERS, each with exactly one job:
//   1. Logo + primary navigation                       (one bar)
//   2. Positioning + contact + office + factory        (one row of four)
//   3. Copyright + Facebook + legal                    (one line)
//
// What the previous four-band revision carried and this one drops, deliberately:
//   - the "Nhận báo giá" button: every page already closes on the `.section-cta` band directly
//     above the footer, so the footer repeated the same action a second time;
//   - the six-entry services column: /dich-vu and the navigation link to it carry those entries;
//   - the four-cell trust strip: it restated claims /gioi-thieu already illustrates.
// Dropping them is what takes the phone footer from ~1,560px to roughly half that.
//
// PURELY PRESENTATIONAL (§26.3, §30.2). No state, no composable beyond the locale helpers, no
// lifecycle hooks. Forbidden knowledge: scroll position, header state, route — everything.
import { company } from '~/data/company'
import { legalLinks, navLinks, uiText } from '~/data/ui'

const { t, ta } = useLanguage()
</script>

<template>
  <footer class="app-footer">
    <div class="shell">
      <!-- ── TIER 1 — LOGO · NAVIGATION ─────────────────────────────────────── -->
      <div class="footer-bar">
        <!-- The colour-reverse master, not a derived mono mark — matches the header and every
             other logo in the system (FG-15). -->
        <img
          src="/logo-color-reverse.png"
          alt="Lai Huy Interior"
          width="424"
          height="212"
          loading="lazy"
          fetchpriority="auto"
          class="footer-logo"
        >

        <!-- The heading is visually hidden: in one horizontal bar beside the logo the links are
             self-evidently the site's navigation, but heading navigation still finds it. -->
        <nav
          class="footer-nav"
          aria-labelledby="footer-nav-heading"
        >
          <h2
            id="footer-nav-heading"
            class="sr-only"
          >
            {{ t(uiText.labels.navigation) }}
          </h2>
          <ul class="footer-nav-list">
            <li
              v-for="link in navLinks"
              :key="link.to"
            >
              <NuxtLink
                :to="link.to"
                class="footer-link"
              >
                {{ t(link.label) }}
              </NuxtLink>
            </li>
          </ul>
        </nav>
      </div>

      <!-- ── TIER 2 — POSITIONING · CONTACT · OFFICE · FACTORY ───────────────── -->
      <div class="footer-info">
        <p class="footer-statement">
          {{ t(company.positioning) }}
        </p>

        <div class="footer-info-group">
          <h2 class="footer-eyebrow">
            {{ t(uiText.labels.contact) }}
          </h2>
          <!-- Field names stay as screen-reader text: a sighted reader recognises a phone number
               and an email address on sight, a screen reader should still hear what each is. -->
          <dl class="footer-contact">
            <dt class="sr-only">
              {{ t(uiText.labels.phone) }}
            </dt>
            <dd>
              <a
                :href="`tel:${company.phone.replaceAll(' ', '')}`"
                class="footer-link footer-phone"
              >
                {{ t(company.phoneDisplay) }}
              </a>
            </dd>
            <dt class="sr-only">
              {{ t(uiText.labels.email) }}
            </dt>
            <dd>
              <a
                :href="`mailto:${company.email}`"
                class="footer-link footer-email"
              >
                {{ company.email }}
              </a>
            </dd>
            <dt class="sr-only">
              {{ t(uiText.labels.workingHours) }}
            </dt>
            <dd class="footer-hours">
              <span
                v-for="line in ta(company.workingHours)"
                :key="line"
                class="block"
              >
                {{ line }}
              </span>
            </dd>
          </dl>
        </div>

        <!-- Each address is ONE string and stays one string; it links to its map. -->
        <div
          v-for="address in company.addresses"
          :key="address.label.vi"
          class="footer-info-group"
        >
          <h2 class="footer-eyebrow">
            {{ t(address.label) }}
          </h2>
          <a
            :href="address.mapUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="footer-link footer-address"
            :aria-label="`${t(address.address)} (${t(address.mapAction)})`"
          >
            {{ t(address.address) }}
          </a>
        </div>
      </div>

      <!-- ── TIER 3 — COPYRIGHT · FACEBOOK · LEGAL ───────────────────────────── -->
      <div class="footer-meta">
        <p class="footer-copyright">
          &copy; {{ new Date().getFullYear() }} {{ company.name }}. {{ t(uiText.labels.rightsReserved) }}
        </p>

        <!-- Facebook leads the legal list: one cluster of quiet links on the right of the line,
             rather than a lone glyph floating in the middle of it. Driven by `legalLinks`, so a
             third legal document is a data change. -->
        <ul class="footer-legal">
          <li>
            <a
              :href="company.facebook"
              target="_blank"
              rel="noopener noreferrer"
              class="footer-social"
            >
              <Icon
                name="i-simple-icons-facebook"
                class="footer-social-icon"
                aria-hidden="true"
              />
              <span>Facebook</span>
            </a>
          </li>
          <li
            v-for="link in legalLinks"
            :key="link.to"
          >
            <NuxtLink :to="link.to">
              {{ t(link.label) }}
            </NuxtLink>
          </li>
        </ul>
      </div>
    </div>
  </footer>
</template>
