# Report 4 — Performance Review

All figures below were measured against a real production build (`pnpm build`) served by `node .output/server/index.mjs`, loaded in Chromium at 1536×864 / DPR 1.25.

## Baseline

```
Homepage, cold load
────────────────────────────────────────
stylesheet + payload   2 req    210 KB
JS chunks              8 req     38 KB
"other" (css, payload) 8 req    453 KB
fonts                  3 req    141 KB
images (Supabase)      4 req      —      (cross-origin, size not exposed)
logo PNG               1 req     69 KB
────────────────────────────────────────
TOTAL                           ~911 KB
```

```
Client bundle          761 KB raw across _nuxt/*.js
  largest chunk        401,173 B raw → 118,045 B gzip
entry.css              214,908 B raw →  29,299 B gzip
fonts on disk          1.6 MB (22 files, 69 @font-face rules)
```

Ranked by impact on the critical path:

---

## P1 — The hero image is downloaded twice

**Impact: Critical (LCP)** · Difficulty: Low · ~2h

`AppHero.vue:23-32` and `index.vue:45-54` both emit an unconditional image preload:

```ts
useHead({
  link: [{ rel: 'preload', as: 'image',
           href: resolve(props.image.path, { width: 1600 }),
           fetchpriority: 'high' }]
})
```

The rendered `<img>`, meanwhile, advertises a `srcset` that includes the full master:

```
1-2-w800.webp    640w
1-2-w800.webp    768w
1-2-w1600.webp  1024w
1-2-w1600.webp  1280w
1-2-w1600.webp  1536w
1-2.webp        2048w   ← 2560×1417, 243 KB
1-2.webp        2560w   ← same
```

`sizes` resolves to `100vw` at every breakpoint. At viewport 1536 px and DPR 1.25 the browser needs a **1920 px** candidate, so it selects the `2048w` entry — the master. But the preload has **no `imagesrcset` / `imagesizes`**, so it is a separate, unconditional fetch of `-w1600`.

Both were fetched on a single homepage load:

```js
performance.getEntriesByType('resource').filter(e => /1-2(-w\d+)?\.webp/.test(e.name))
→ ["1-2-w1600.webp", "1-2.webp"]
```

| File | Size | Used? |
|---|---:|---|
| `1-2-w1600.webp` | 91 KB | **no** — preloaded, discarded |
| `1-2.webp` | 243 KB | yes |

**91 KB is burned on the LCP path**, and the image actually rendered is 2.7× larger than intended. This affects every hero on the site, on every retina laptop and every display wider than ~1638 CSS px.

**Fix.** A preload for a responsive image must carry the same `srcset`/`sizes` the `<img>` will use:

```html
<link rel="preload" as="image"
      :imagesrcset="heroSrcset" :imagesizes="heroSizes" fetchpriority="high">
```

`@nuxt/image` exposes this via `<NuxtImg preload>` — which generates the correct `imagesrcset` automatically. **Delete both hand-rolled `useHead` preloads and pass `preload` to `<NuxtImg>` instead.** This also fixes `[slug].vue`, whose hero has *no* preload at all despite being the LCP element.

---

## P2 — `srcset` offers the 2560 px master because the variant ladder stops at 1600

**Impact: High** · Difficulty: Low · ~2h

```ts
// app/shared/media/constants.ts
export const MEDIA_VARIANT_WIDTHS = [400, 800, 1600] as const

// scripts/media/optimize.ts
const MASTER_MAX_EDGE = 2560
```

```ts
// app/media/url.ts
export const snapToVariantWidth = (width: number): number | null => {
  for (const variantWidth of MEDIA_VARIANT_WIDTHS) {
    if (width <= variantWidth) return variantWidth
  }
  return null          // ← above 1600: serve the master
}
```

Any requested width above 1600 falls through to the master. The gap between 1600 and 2560 is a **2.7× file-size cliff** (91 KB → 243 KB) and it lands squarely on the most common desktop configuration.

**Fix — pick one:**

- **(a) Add a rung.** `MEDIA_VARIANT_WIDTHS = [400, 800, 1200, 1600, 2200]`. Costs one more variant per asset (~160 extra objects, cheap) and smooths the ladder. `variantPath` / `snapToVariantWidth` need no logic change; re-run `media:optimize && media:upload`.
- **(b) Cap the srcset.** Stop advertising the master. Since `MASTER_MAX_EDGE` is 2560 and the largest variant is 1600, the master is only ever ~1.6× the largest variant — declaring `sizes` more honestly (heroes are `100vw`, so they genuinely need large candidates) means (a) is the better answer.

Also worth doing: **Supabase Storage's public object endpoint does not transform images**, so this ladder is the only lever. Confirm whether the project's plan includes the Image Transformation add-on — if it does, `?width=` on the render endpoint removes the need to pre-generate variants entirely, and the whole `optimize`/`variantPath` machinery could be retired. (Confidence: medium — depends on plan tier and egress pricing; measure before switching.)

---

## P3 — 117 KB of build metadata ships to every browser

**Impact: High** · Difficulty: Low · ~2h

`app/media/fallback.ts`:

```ts
import manifest from '../shared/media/manifest.json'    // 188 KB on disk
const assets = (manifest as MediaManifest).assets
export const fallbackPaths: ReadonlyMap<string, string> = new Map(
  assets.flatMap(a => (a.oldPublicPath ? [[a.path, a.oldPublicPath] as const] : []))
)
```

The map is built at **runtime**, so the bundler cannot tree-shake the JSON. `fallback.ts` is imported by `useMediaUrl()` (a client composable) and by the image provider, so the entire manifest lands in the main client chunk. Confirmed:

```console
$ grep -c "sourceChecksum" .output/public/_nuxt/BaYBXIu8.js
160
```

160 assets, each carrying `sourceChecksum`, `checksum`, `sourceFile`, `uploadedAt`, `supersedes`, `bytes`, `status`, and a nested `variants[]`.

| | raw | gzip |
|---|---:|---:|
| Shipped | 131,809 B | 21,940 B |
| Actually needed (`path` → `oldPublicPath`) | 14,415 B | 1,350 B |
| **Waste** | **117,394 B** | **20,590 B** |

That is **17% of the 118 KB gzipped main chunk**.

And it is entirely dead in production. `buildMediaUrl` only consults `fallbackPaths` when `!context.useSupabaseMedia`:

```ts
if (!context.useSupabaseMedia) {
  const fallback = context.fallbackPaths?.get(path)
  if (fallback) return fallback
}
```

With `NUXT_PUBLIC_USE_SUPABASE_MEDIA=true` (the production setting), the map is never read. It also leaks internal build paths (`public/images/banner_home.jpg`) and SHA-256 content hashes to the browser — not a vulnerability, but needless disclosure.

**Fix — in order of preference:**

1. **Generate the map, don't derive it.** Have `pnpm media:catalog` emit `app/media/fallback.generated.ts` containing only the ~14 KB of `[path, oldPublicPath]` pairs. Deletes the `manifest.json` import from the app graph entirely.
2. **Make it conditional.** Wrap the import so it only exists in the fallback build. With `useSupabaseMedia` known at build time (it is read in `nuxt.config.ts`), a Vite `define` + dead-code elimination removes it cleanly.
3. **Both.** (1) is a 20-line change to `scripts/media/catalog.ts` and needs no runtime branch.

Expected saving: **~20.6 KB gzip off the main chunk**, plus one fewer 188 KB file in the SSR bundle.

---

## P4 — Project detail pages are server-rendered and uncacheable

**Impact: High (TTFB)** · Difficulty: Low · ~2h

`nuxt.config.ts` prerenders seven routes. `/du-an/[slug]` is not among them. The build emits seven HTML files and no project pages.

Their content is fully static — it comes from `projects.ts` and `catalog.generated.ts`, both compile-time constants. Yet every request pays for a server render, and the response is:

```
HTTP/1.1 200 OK
set-cookie: lai-huy-locale=vi; Path=/; SameSite=Lax
content-type: text/html;charset=utf-8
```

**No `Cache-Control`. No `Vary`. A `Set-Cookie` on every response**, which causes virtually every CDN to refuse to cache the page. The eleven portfolio pages — the highest-intent pages on the site — are the slowest.

**Fix.**

```ts
// nuxt.config.ts
import { projects } from './app/data/projects'

export default defineNuxtConfig({
  routeRules: { /* … */ '/du-an/**': { prerender: true } },
  nitro: { prerender: { routes: projects.map(p => `/du-an/${p.slug}`) } }
})
```

Eleven more static files, near-zero TTFB, full edge caching. The `Set-Cookie` disappears because `useCookie` is not evaluated per-request. This also makes the soft-404 fix (Report 5) trivial — unknown slugs fall through to Nuxt's real 404.

---

## P5 — Fonts: wrong weights loaded, italics shipped unused, no preload

**Impact: Medium (FOUT / CLS)** · Difficulty: Low · ~3h

Inter is self-hosted via `@nuxt/fonts`, which arrives transitively through `@nuxt/ui`. This is good — no third-party request, and metric-override fallback faces (`"Inter Fallback: Segoe UI"` etc.) are generated, which suppresses layout shift on swap. Credit where due.

But:

```
64 real Inter @font-face rules  (weights 400/500/600/700 × normal+italic × 8 subsets)
 5 metric-only fallback faces
22 font files on disk (1.6 MB)
 0 <link rel=preload> for any font
```

Measured in the page:

```js
[...document.querySelectorAll('.font-black')].length     → 45
getComputedStyle(h1).fontWeight                          → "900"
[...document.fonts].filter(f => f.family === 'Inter' && f.status === 'loaded')
  .map(f => f.weight)                                    → ["400","400","400","600","600","600","700","700","700"]
```

**Weight 900 is never loaded.** All 45 `font-black` elements — every `h1`, `h2`, `h3`, and every metric value on the site — are rendered as **browser-synthesised faux-bold** from the 700 face. The heavy editorial look the design is built around does not ship.

Separately, `document.querySelectorAll('*')` filtered by `fontStyle === 'italic'` returns **0**. Thirty-two italic `@font-face` rules are declared and their files sit in `_fonts/`. They are lazily fetched (so they cost no bytes today), but they bloat `entry.css`.

And there is **no font preload**, so the first paint uses the fallback face and swaps — a visible FOUT on the hero headline.

**Fix.**

```ts
// nuxt.config.ts
fonts: {
  families: [
    { name: 'Inter', weights: [400, 600, 700, 900], styles: ['normal'], subsets: ['latin', 'vietnamese'] }
  ]
}
```

- Add **900** (or switch `font-black` → `font-bold` throughout and drop 900).
- Drop `italic` and weight `500` (used nowhere: `font-medium` appears zero times).
- Confirm the **`vietnamese`** subset is included — the site is primarily Vietnamese, and the default Google Fonts CSS splits it into its own unicode-range.
- Preload the single face used by the `h1`.

---

## P6 — `@nuxt/ui` inflates CSS for two components that are never rendered

**Impact: Medium** · Difficulty: Medium · ~half day

`entry.css` is **214,908 B raw / 29,299 B gzip**. It carries 34 distinct `--ui-*` custom properties and the Nuxt UI reset, for a site whose only Nuxt UI usage is:

```
app/components/TemplateMenu.vue:19:  <UDropdownMenu
app/components/TemplateMenu.vue:27:  <UButton
```

`TemplateMenu.vue` is dead (referenced by nothing). The `<Icon>` component used across the pages comes from `@nuxt/icon`, which Nuxt UI installs transitively.

Note the trade-off, though: removing `@nuxt/ui` also removes `@nuxt/fonts` (P5) and `@nuxt/icon`, both of which you want. And a real contact form (Report 3, U9) would benefit from `UForm`/`UInput` validation. **Recommendation: keep `@nuxt/ui`, delete `TemplateMenu.vue`, and actually use `UForm` for the contact form.** Revisit only if the CSS budget becomes binding.

---

## P7 — Dead dependencies

**Impact: Low (install/CI time)** · Difficulty: Trivial · ~15m

| Package | Where | Status |
|---|---|---|
| `motion` `^12.38.0` | **`dependencies`** | Only consumer is `useScrollReveal.ts`, which nothing imports. Verified absent from the client bundle (`grep motion-dom\|motionValue` → no match). |
| `@nuxtjs/device` `4.0.0` | **`dependencies`** | Not registered in `modules`. `useDevice`/`$device` appear nowhere. Completely inert. |

Both are production dependencies. Remove them and delete `app/composables/useScrollReveal.ts`.

The surviving scroll-reveal (`app/plugins/reveal.ts`) is a plain `IntersectionObserver` + CSS transition, weighs almost nothing, respects `prefers-reduced-motion`, and degrades without JS. It is the better implementation.

---

## P8 — Rendering and hydration

**Impact: Medium** · Difficulty: (fixed by Report 2, A3)

- Every prerendered page throws `Hydration completed but contains mismatches.` in the console when the locale cookie is `en`. Vue must then discard and re-render the mismatched subtrees on the client — measurable work on top of a wasted render.
- `app.vue` attaches a `scroll` listener (`{ passive: true }`, correctly) that writes a `ref` on every frame. `isScrolled` only ever changes at the 40 px threshold, so the writes are cheap, but the handler runs unthrottled. Low priority; a `rAF` guard or a sentinel `IntersectionObserver` would be cleaner.
- `[slug].vue` computes `relatedCandidates` by sorting **all** projects on every page setup. At eleven projects this is free. At 200 it is not. It also runs during SSR for each request today (see P4).
- `du-an/index.vue` re-derives `sortedProjects` and then `filteredProjects` on every filter click, mapping `projectCoverAsset` across all projects each time. Memoise the cover lookup.

No unnecessary client components were found. There is no `<ClientOnly>` misuse and no large client-only islands. The component tree is appropriately server-rendered.

---

## Expected impact

| Fix | Bytes saved (gzip) | Effect |
|---|---:|---|
| P3 — generate the fallback map | **−20.6 KB** | main chunk −17% |
| P1 — `<NuxtImg preload>` | **−91 KB** (image) | removes a wasted LCP-path fetch |
| P2 — add a `2200w` rung | **−~150 KB** (image) | hero 243 KB → ~110 KB on common desktops |
| P5 — trim font families | ~−3 KB CSS | + removes FOUT, + real 900 weight |
| P7 — drop `motion`, `@nuxtjs/device` | 0 (already unbundled) | faster installs, honest manifest |
| P4 — prerender `/du-an/**` | — | TTFB → static, edge-cacheable |

**Net on a typical desktop homepage load: roughly 240 KB less transferred and one fewer render-blocking image fetch, for about one day of work.**

Recommended order: **P3 → P1 → P2 → P4 → P5 → P7 → P6.** P3 and P1 are independent and together deliver most of the benefit.

---

## What to measure next

There is **no performance telemetry in this project** — no analytics, no RUM, no Lighthouse CI. Every number above is a lab measurement on one machine. Before optimising further:

1. Add Vercel Analytics / Speed Insights (or Plausible + `web-vitals`) to get field LCP/INP/CLS.
2. Add a Lighthouse CI step to `.github/workflows/ci.yml` with a budget, so the hero regressions above cannot recur.
3. Note that CI currently runs `lint`, `lint:media`, `test`, `typecheck` — but **never `pnpm build`**. A build-breaking change would reach `main`. Add it.
