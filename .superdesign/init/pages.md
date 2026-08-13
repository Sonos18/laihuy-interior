# Page dependency map

## `/dich-vu` — active design scope

```text
app/app.vue
├── AppHeader.vue
├── AppDrawer.vue
├── NuxtPage → app/pages/dich-vu.vue
│   ├── AppHero.vue
│   │   └── MediaImage.vue
│   ├── ServicesJourneyRail.vue
│   │   └── app/data/services-page.ts
│   ├── ServicesProgramList.vue
│   │   └── app/data/services-page.ts
│   ├── app/data/services.ts
│   ├── app/composables/useLocale.ts
│   ├── app/composables/useSeo.ts
│   └── app/composables/useMediaUrl.ts
└── AppFooter.vue
```

## Other main routes

```text
index.vue → bespoke home sections + shared shell/media
gioi-thieu.vue → AppHero + company data + shared shell/media
du-an/index.vue → project data + project cards + shared shell/media
du-an/[slug].vue → project record + project detail media + shared shell
nha-xuong.vue → AppHero + workshop data/media + shared shell
tuyen-dung.vue → AppHero + careers data + shared shell
lien-he.vue → AppHero + client-side validation + shared shell
legal pages → localized legal content + shared shell
```

The `/dich-vu` mockup must keep existing localized claims and media identities. It must not imply that drawings are uploaded, sent, stored, or processed by a backend.
