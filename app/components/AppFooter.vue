<script setup lang="ts">
// The footer, rebuilt to docs/design/footer-reference.png.
//
// FOUR BANDS, each with exactly one job:
//   1. Brand + Navigation + Services + Contact   (4 columns)
//   2. Office + Factory addresses                (2 columns)
//   3. Trust strip                               (4 items)
//   4. Copyright + Facebook + Legal              (3 groups)
//
// The previous revision had the same four blocks grouped differently: the masthead owned a
// full-width band of its own, the trust signals were a fourth column of the index, and the
// addresses sat in band 3. Folding the masthead into column 1 is what makes the footer shorter —
// its height is now absorbed by the tallest of the three list columns beside it instead of being
// added on top of them.
//
// PURELY PRESENTATIONAL (§26.3, §30.2). No state, no composable, no lifecycle hooks. Forbidden
// knowledge: scroll position, header state, route — everything. The `navRows` computation that
// used to live here is gone with the two-column navigation split, so the component is back to
// zero logic, which is the contract this file is supposed to hold.
import { company } from '~/data/company'
import { legalLinks, navLinks, uiText } from '~/data/ui'

const { t, ta } = useLanguage()
</script>

<template>
  <footer class="app-footer">
    <div class="shell">
      <!-- ── BAND 1 — BRAND · NAVIGATION · SERVICES · CONTACT ──────────────────
           Four columns, divided by hairlines. Column 1 carries the whole brand statement
           (logo, positioning, ONE action); columns 2-4 are three lists under wood eyebrows.

           ONE action, not two. The second used to be `uiText.cta.factory` -> /nha-xuong, the
           character-for-character same label as the secondary action in the `.section-cta` band
           directly above the footer on six of eight pages. /nha-xuong is reachable from the
           navigation column immediately to the right. -->
      <div class="footer-primary">
        <div class="footer-brand">
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

          <p class="footer-statement">
            {{ t(company.positioning) }}
          </p>

          <NuxtLink
            to="/lien-he"
            class="btn-primary footer-cta"
          >
            {{ t(uiText.cta.contact) }}
          </NuxtLink>
        </div>

        <!-- The landmark takes its accessible name FROM the visible heading rather than a
             duplicated aria-label, so the two can never drift apart under translation.
             Heading levels stay at h2 deliberately: footer column labels at h2 sit alongside
             the page's content sections, which is what makes them reachable by heading
             navigation. Demoting them would only make them harder to find. -->
        <nav
          class="footer-col"
          aria-labelledby="footer-nav-heading"
        >
          <h2
            id="footer-nav-heading"
            class="footer-eyebrow"
          >
            {{ t(uiText.labels.navigation) }}
          </h2>
          <!-- Single file, all seven. The previous revision split these into two sub-columns to
               buy back height; the reference sets them in one column, and the fold of the
               masthead into column 1 is what pays for that height now. -->
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

        <div class="footer-col">
          <h2 class="footer-eyebrow">
            {{ t(uiText.labels.services) }}
          </h2>
          <!-- These are LINKS, not labels. Five items that look like navigation and do nothing
               is a dead end. /dich-vu has no per-service anchors, so all five resolve to the
               page itself. -->
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

        <div class="footer-col">
          <h2 class="footer-eyebrow">
            {{ t(uiText.labels.contact) }}
          </h2>
          <!-- Still a description list — these are label/value pairs — but the label is now
               carried by a GLYPH plus a screen-reader-only string rather than an uppercase
               eyebrow above each value, which is what the reference shows and what lets three
               contact channels occupy three lines instead of six.
               The visually-hidden text is what keeps this honest: a sighted reader gets the
               icon, a screen reader still hears "Điện thoại: +84 903 102 012" rather than a
               bare number with no field name. -->
          <dl class="footer-contact">
            <div>
              <dt>
                <Icon
                  name="i-lucide-phone"
                  class="footer-contact-icon"
                  aria-hidden="true"
                />
                <span class="sr-only">{{ t(uiText.labels.phone) }}</span>
              </dt>
              <dd>
                <a
                  :href="`tel:${company.phone.replaceAll(' ', '')}`"
                  class="footer-link footer-link-lead"
                >
                  {{ company.phone }}
                </a>
              </dd>
            </div>

            <div>
              <dt>
                <Icon
                  name="i-lucide-mail"
                  class="footer-contact-icon"
                  aria-hidden="true"
                />
                <span class="sr-only">{{ t(uiText.labels.email) }}</span>
              </dt>
              <dd>
                <a
                  :href="`mailto:${company.email}`"
                  class="footer-link footer-link-lead"
                >
                  {{ company.email }}
                </a>
              </dd>
            </div>

            <div>
              <dt>
                <Icon
                  name="i-lucide-clock"
                  class="footer-contact-icon"
                  aria-hidden="true"
                />
                <span class="sr-only">{{ t(uiText.labels.workingHours) }}</span>
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
            </div>
          </dl>
        </div>
      </div>

      <!-- ── BAND 2 — WHERE THE COMPANY PHYSICALLY IS ─────────────────────────
           Two equal halves, divided by one hairline. Each is a large wood glyph beside a title
           and an address — the icon is the block's only ornament, and it differs per entry
           (pin / factory, bound from `address.icon`) so it carries information rather than
           decorating two identical rows.

           The address is ONE string and stays one string: it wraps to two lines because it is
           long, not because it has been split into fields. -->
      <dl class="footer-locations">
        <!-- The wrapper <div> contains ONLY <dt> and <dd>. That is a hard requirement, not a
             style preference: a <dl> may only directly contain dt/dd groups (optionally wrapped
             one level deep in a div), and an earlier revision of this band nested the pair
             inside a second div with the glyph as its sibling — which broke the list into
             orphaned dt/dd elements and tripped three axe rules (definition-list, dlitem,
             only-dlitems) on all eight pages.
             The glyph therefore lives INSIDE the <dt>, where it is phrasing content and legal,
             and is lifted out of the text flow by absolute positioning so it can still sit
             centred against the whole two-line block. See `.footer-place-icon`. -->
        <div
          v-for="address in company.addresses"
          :key="address.label.vi"
        >
          <dt class="footer-place-title">
            <Icon
              :name="address.icon"
              class="footer-place-icon"
              aria-hidden="true"
            />
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

      <!-- ── BAND 3 — TRUST STRIP ─────────────────────────────────────────────
           Four equal items, glyph + short label, divided by hairlines. No heading, no
           description, no card, no shadow, no per-item background: four identical quiet cells
           read as guarantees precisely because nothing frames them.

           Content is bound, never authored. `company.trustSignals` restates claims the site
           already publishes, with the glyphs /gioi-thieu already assigns to them — one claim,
           one glyph, site-wide. A footer that invents credentials is worse than one that omits
           them. -->
      <ul class="footer-trust">
        <li
          v-for="signal in company.trustSignals"
          :key="signal.icon"
        >
          <Icon
            :name="signal.icon"
            class="footer-trust-icon"
            aria-hidden="true"
          />
          <span>{{ t(signal.label) }}</span>
        </li>
      </ul>

      <!-- ── BAND 4 — BOTTOM BAR ──────────────────────────────────────────────
           Three groups: copyright, Facebook, legal. The middle group is CENTRED on the rail and
           stays centred at every width — the grid is `1fr auto 1fr`, so the centre cell is
           positioned by the rail rather than by the width of the two groups flanking it. That
           is the whole point of the band: earlier revisions put Facebook at the far right edge
           (`space-between`) where it read as an object marooned in ~1,000px of void. -->
      <div class="footer-meta">
        <p class="footer-copyright">
          &copy; {{ new Date().getFullYear() }} {{ company.name }}. {{ t(uiText.labels.rightsReserved) }}
        </p>

        <div class="footer-social">
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
        </div>

        <!-- Driven by `legalLinks`, so a third document is a data change and needs no template
             or CSS work. Both entries resolve to real prerendered routes. -->
        <ul class="footer-legal">
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
