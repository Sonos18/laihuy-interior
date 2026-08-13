# Application routes

Nuxt file-based routing is used; there is no custom router configuration.

| Route | Source | Purpose |
| --- | --- | --- |
| `/` | `app/pages/index.vue` | Homepage |
| `/gioi-thieu` | `app/pages/gioi-thieu.vue` | Company introduction |
| `/du-an` | `app/pages/du-an/index.vue` | Project portfolio |
| `/du-an/[slug]` | `app/pages/du-an/[slug].vue` | Project detail |
| `/nha-xuong` | `app/pages/nha-xuong.vue` | Workshop and manufacturing |
| `/dich-vu` | `app/pages/dich-vu.vue` | Services and delivery journey |
| `/tuyen-dung` | `app/pages/tuyen-dung.vue` | Careers |
| `/lien-he` | `app/pages/lien-he.vue` | Contact; frontend-only form |
| `/privacy-policy` | `app/pages/privacy-policy.vue` | Privacy policy |
| `/terms-of-use` | `app/pages/terms-of-use.vue` | Terms of use |

`app/error.vue` provides the custom bilingual error shell for unknown routes. Locale is state/cookie based with Vietnamese as default, not URL-prefixed.
