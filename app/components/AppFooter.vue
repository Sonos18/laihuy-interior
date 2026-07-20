<script setup lang="ts">
// Phase 6 — the footer redesign (docs/header-footer-art-direction.md §10).
//
// The footer is the final page of the magazine, not the bottom of the document (§1). It closes
// the loop the hero opened: the site begins on ink-950 + wood over photography and ends on
// ink-950 + wood in type.
//
// PURELY PRESENTATIONAL (§26.3, §30.2). No state, no composable, no lifecycle hooks. Forbidden
// knowledge: scroll position, header state, route — everything. If this component ever needs
// state, the requirement is wrong: it is the one component in the system with zero moving
// parts, and that is a feature to be defended.
import { company } from '~/data/company'
import { navLinks, uiText } from '~/data/ui'

const { t, ta } = useLanguage()
</script>

<template>
  <footer class="app-footer">
    <div class="shell">
      <!-- §10 — the masthead is promoted OUT of the grid. -->
      <div class="footer-masthead">
        <!-- §35 — below fold, always: lazy + fetchpriority auto. Explicit width/height like
             every other logo in the system (FG-15). -->
        <img
          src="/logo-mono-white.png"
          alt="Lai Huy Interior"
          width="424"
          height="212"
          loading="lazy"
          fetchpriority="auto"
          class="footer-logo"
        >

        <p class="text-lead footer-statement max-w-xl">
          {{ t(company.positioning) }}
        </p>

        <!-- ONE action, not two. The second was `uiText.cta.factory` -> /nha-xuong, which is the
             SAME destination and the character-for-character same label as the secondary action
             in the `.section-cta` band that sits directly above the footer on six of the eight
             pages — two conversion blocks with identical destinations inside the last ~900px.
             On the homepage that one string rendered three times.

             It was also self-referential: because this component is static by contract, the
             link pointed at the current page on /nha-xuong. Removing it is the fix that respects
             that contract; making it route-aware would breach it (§26.3/§30.2). /nha-xuong
             remains reachable from the navigation column immediately below. -->
        <div class="footer-actions">
          <NuxtLink
            to="/lien-he"
            class="btn-primary"
          >
            {{ t(uiText.cta.contact) }}
          </NuxtLink>
        </div>
      </div>

      <!-- §10 — 3 equal columns, beneath the ONE hairline. -->
      <div class="footer-index">
        <div>
          <!-- The landmark takes its accessible name FROM the visible heading rather than a
               duplicated aria-label, so the two can never drift apart under translation.
               Heading levels stay at h2 deliberately: footer column labels at h2 sit alongside
               the page's content sections, which is what makes them reachable by heading
               navigation. Demoting them would only make them harder to find. -->
          <nav aria-labelledby="footer-nav-heading">
            <h2
              id="footer-nav-heading"
              class="footer-eyebrow"
            >
              {{ t(uiText.labels.navigation) }}
            </h2>
            <ul class="footer-list">
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

        <div>
          <h2 class="footer-eyebrow">
            {{ t(uiText.labels.services) }}
          </h2>
          <!-- These are LINKS, not labels. They previously rendered as `.footer-value` — plain
               text styled identically to the `.footer-link` list one column to the left, under a
               matching heading. Five items that look exactly like navigation and do nothing is a
               dead end, and it left /dich-vu with no internal link from the footer.
               /dich-vu has no per-service anchors, so all five resolve to the page itself. -->
          <ul class="footer-list">
            <li
              v-for="service in ta(company.footerServices)"
              :key="service"
            >
              <NuxtLink
                to="/dich-vu"
                class="footer-link"
              >
                {{ service }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <div>
          <h2 class="footer-eyebrow">
            {{ t(uiText.labels.contact) }}
          </h2>
          <!-- §10 — one lucide icon per line becomes an eyebrow LABEL per value. A description
               list is what this data actually is: label/value pairs. -->
          <dl class="footer-contact">
            <dt class="footer-label">
              {{ t(uiText.labels.phone) }}
            </dt>
            <dd>
              <a
                :href="`tel:${company.phone.replaceAll(' ', '')}`"
                class="footer-link"
              >
                {{ company.phone }}
              </a>
            </dd>

            <dt class="footer-label">
              {{ t(uiText.labels.email) }}
            </dt>
            <dd>
              <a
                :href="`mailto:${company.email}`"
                class="footer-link"
              >
                {{ company.email }}
              </a>
            </dd>

            <template
              v-for="address in company.addresses"
              :key="t(address.label)"
            >
              <dt class="footer-label">
                {{ t(address.label) }}
              </dt>
              <dd>
                <a
                  :href="address.mapUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="footer-link"
                >
                  {{ t(address.address) }}
                </a>
              </dd>
            </template>

            <dt class="footer-label">
              {{ t(uiText.labels.workingHours) }}
            </dt>
            <dd class="footer-value">
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
      </div>

      <!-- §10 — separated by space alone: no border. -->
      <div class="footer-meta">
        <p>
          &copy; {{ new Date().getFullYear() }} {{ company.name }}. {{ t(uiText.labels.rightsReserved) }}
        </p>
        <a
          :href="company.facebook"
          target="_blank"
          rel="noopener noreferrer"
        >
          Facebook
        </a>
      </div>
    </div>
  </footer>
</template>
