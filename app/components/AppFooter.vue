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
      <!-- The cover band: the masthead group and the trust layer share one row at md+, which is
           what keeps the trust layer free. Below md it collapses to a single column and the two
           stack in reading order — claim, then evidence. -->
      <div class="footer-cover">
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

        <!-- The trust layer, and the reason it costs the footer no height: the masthead band was
             measured leaving the rail 55% empty to the right of a 655px-wide text column. This
             fills that void rather than adding a band under it — at md+ the two sit side by side,
             so four new lines of type land inside space the logo group was already reserving.

             Content is bound, never authored here: `company.trustSignals` restates claims the site
             already publishes (see the comment on that field). A footer that invents credentials is
             worse than one that omits them. -->
        <ul class="footer-trust">
          <li
            v-for="signal in ta(company.trustSignals)"
            :key="signal"
          >
            {{ signal }}
          </li>
        </ul>
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

      <!-- Locations, PROMOTED OUT of the index — the same structural gesture §10 already makes
           for the masthead, applied to the other content that does not fit a column.

           The two addresses are the widest strings in the footer, and inside a 395px index
           column they were the tallest thing in it: the contact column measured 436px of content
           against 270px and 191px beside it, so 31% of the column band rendered empty and all of
           that void pooled bottom-left. Given the full width they set on ONE line each at lg
           instead of 2-3 ragged ones, and the contact column drops to ~217px.

           It stays a <dl>: these are still label/value pairs. The wrapper div per pair is
           permitted inside <dl> and is what lets each dt/dd group act as a single grid cell —
           without it, dt and dd would become separate grid items and sit side by side. -->
      <dl class="footer-locations">
        <div
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
        </div>
      </dl>

      <!-- §10 — separated by space alone: no border.
           Measured before this change: two children, 269px and 60px, inside a 1360px rail — 1,031px
           of void between them, which is what made the row read as unfinished rather than calm.
           The right-hand side is now a GROUP, so the two ends balance and the row has somewhere to
           put legal links when they exist.

           No placeholder Privacy/Terms links are rendered: those pages do not exist yet, and a
           footer full of dead links is a worse failure than a footer missing them. When they are
           written, add a sibling <ul class="footer-legal"> inside `.footer-meta-end` — the layout
           already accommodates it and needs no CSS change. -->
      <div class="footer-meta">
        <p>
          &copy; {{ new Date().getFullYear() }} {{ company.name }}. {{ t(uiText.labels.rightsReserved) }}
        </p>

        <div class="footer-meta-end">
          <ul class="footer-social">
            <li>
              <a
                :href="company.facebook"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon
                  name="i-simple-icons-facebook"
                  class="footer-social-icon"
                  aria-hidden="true"
                />
                <span>Facebook</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
</template>
