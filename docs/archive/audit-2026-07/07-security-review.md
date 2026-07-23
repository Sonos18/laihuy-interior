# Report 7 — Security Review

Scope: a public marketing site with no authentication, no user accounts, no database reads at runtime, and no server API routes. The attack surface is genuinely small. Findings are correspondingly modest — but two of them are worth fixing before a public launch.

---

## What is already right

**No secrets leak into the build.** I scanned all 440 files in `.output/` for the literal values of every key in the local `.env`:

```
SUPABASE_SERVICE_ROLE_KEY (len 219) -> not present in build ✓
NUXT_PUBLIC_SUPABASE_KEY  (len 46)  -> not present in build ✓
SUPABASE_URL in public assets: 8 file(s) (public storage URL — expected and correct)
```

The service-role key is confined to local migration scripts, exactly as `.env.example` documents:

```
# Service-role key — LOCAL MIGRATION/UPLOAD SCRIPTS ONLY.
# Never commit a real value, never add it to Vercel/CI env, never prefix with NUXT_PUBLIC_.
```

**Privileged operations refuse to run in CI.** `scripts/media/lib.ts:54`:

```ts
export const assertNotCI = (action: string) => {
  if (process.env.CI || process.env.VERCEL) {
    console.error(`[media] Refusing to ${action} in a CI/deploy environment …`)
    process.exit(1)
  }
}
```

Called by `upload.ts` before any write. This is a genuinely good guard — it makes it structurally hard to expose the service-role key to a build environment.

**Storage writes are immutability-enforced.** `upload.ts` uses `upsert: false` and computes a remote SHA-256 to classify each object as `upload` / `skip` / `resume` / `conflict`. A content change to an existing path is reported as a **conflict**, not silently overwritten. Combined with `cacheControl: 31536000` this is a correct immutable-asset design.

**No dangerous rendering.** Zero occurrences of `v-html`, `innerHTML`, `eval`, `new Function`, or `dangerouslySetInnerHTML` anywhere in `app/`. All user-visible strings pass through Vue's escaping mustache interpolation.

**Path traversal is defended.** `app/shared/media/validation.ts:64`:

```ts
if (!path || path.includes('\\') || path.includes('..') || path.startsWith('/') || path.endsWith('/')) return false
```
plus a strict top-level-folder allowlist and a filename regex. `curl /du-an/../etc` correctly returns 404.

**A CI guard enforces the media boundary.** `scripts/check-media-literals.mjs` fails the build on any hardcoded `/images/` path or `supabase.co` URL outside the media layer. It passes.

---

## SEC-1 — No security headers at all

**Severity: High** · Difficulty: Low · ~2h

Full response headers from the production server:

```
HTTP/1.1 200 OK
set-cookie: lai-huy-locale=vi; Path=/; SameSite=Lax
content-type: text/html;charset=utf-8
x-powered-by: Nuxt
Connection: keep-alive
```

Absent: `Content-Security-Policy`, `Strict-Transport-Security`, `X-Content-Type-Options`, `X-Frame-Options` / `frame-ancestors`, `Referrer-Policy`, `Permissions-Policy`.

Present and unwanted: `x-powered-by: Nuxt` (framework disclosure).

Concretely, today this means the site can be **framed by any origin** (clickjacking a `mailto:` CTA or the phone link), the browser will **MIME-sniff** responses, and full URLs leak in the `Referer` header to Facebook and Google Maps when users click those outbound links.

**Fix.** Nitro route rules cover all of it without a new dependency:

```ts
// nuxt.config.ts
routeRules: {
  '/**': {
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
    }
  }
}
```

Then remove the powered-by banner:

```ts
nitro: { serverAssets: [], routeRules: { … } },
// and:
nitro: { experimental: {} , },   // set NITRO_NO_POWERED_BY / `nitro.headers` per deploy target
```

(Simplest reliable route: strip it at the CDN/`vercel.json`, or set `nitro: { routeRules }` + `nitro.hooks` — verify on the actual deploy target.)

**CSP deserves its own pass.** The site loads images from a single Supabase origin, fonts from self, and no third-party scripts. That makes a strict CSP unusually easy:

```
default-src 'self';
img-src 'self' data: https://<project-ref>.supabase.co;
font-src 'self';
style-src 'self' 'unsafe-inline';        /* Nuxt injects inline <style> for icons */
script-src 'self' 'nonce-…';
frame-ancestors 'none';
base-uri 'self';
form-action 'self';
```

Note `style-src 'unsafe-inline'` is currently required: the rendered HTML contains an inline `<style id="nuxt-ui-colors">` and inline icon-mask styles. Use `@nuxtjs/security` or hash them.

**Do this before adding analytics or a form backend**, because both will want CSP allowances and it is easier to start strict.

---

## SEC-2 — The SSR route sets a cookie and declares no `Vary`

**Severity: Medium** · Difficulty: Low · ~1h (or free, via Report 4 P4)

`/du-an/[slug]` is the only server-rendered route. Its response varies by the `lai-huy-locale` cookie — verified:

```console
$ curl                                localhost:3000/du-an/nha-anh-nam | grep title
<title>Nhà phố anh Nam | Dự án nội thất | Lai Huy Interior</title>
$ curl -H 'Cookie: lai-huy-locale=en' localhost:3000/du-an/nha-anh-nam | grep title
<title>Anh Nam Townhouse | Interior project | Lai Huy Interior</title>
```

…and yet the response carries **no `Vary: Cookie`**. A shared cache in front of this origin could serve a Vietnamese render to an English user, or vice versa.

It escapes this today only *by accident*: the response also carries `Set-Cookie`, which causes essentially every CDN to refuse to cache it. So the current state is "correct but uncacheable" — the worst of both.

**Fix.** Prerender the route (Report 4, P4). `useCookie` then never runs per-request, `Set-Cookie` disappears, the page becomes a static file, and the whole class of problem evaporates. If for some reason SSR must stay, add `Vary: Cookie` explicitly.

---

## SEC-3 — The contact form has no validation, rate limiting, or spam defence

**Severity: Medium (today) → High (once a backend exists)** · Difficulty: Medium

`lien-he.vue:62-78`:

```ts
const submitForm = () => {
  const subject = t({ vi: `Yêu cầu tư vấn dự án - ${form.projectType || 'Lai Huy Interior'}`, … })
  const body = [ `${t({vi:'Họ tên',en:'Name'})}: ${form.name}`, `Email: ${form.email}`, … ].join('\n')
  window.location.href = `mailto:${company.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}
```

Because it is a client-side `mailto:` with no server, the **current** security exposure is close to nil: nothing is persisted, nothing is executed, and both `subject` and `body` are `encodeURIComponent`-escaped, which prevents header injection into the mailto URL. Input validation is browser-native `required` only.

The risk is **prospective**. The moment a real backend lands (Report 3, U9 — and it must), this form becomes an unauthenticated, unthrottled write endpoint. Build it correctly from the start:

- **Server-side schema validation** (Zod / Valibot) — never trust `required`
- **Rate limiting** by IP (`nitro` + an upstream limiter, or Vercel's)
- **Spam defence** — a honeypot field plus Turnstile/hCaptcha. A B2B quote form is a high-value spam target.
- **Email-header sanitisation** if the backend forwards to SMTP — strip `\r`, `\n` from `name`, `email`, `projectType` before they touch a header
- **File uploads**: the copy explicitly invites drawings and BOQs. If you accept uploads, enforce type allowlists, size caps, and store them **outside** the public `media` bucket — the current bucket is `public`.
- **No PII in logs**

---

## SEC-4 — Supabase Storage bucket exposure

**Severity: Low** · **Confidence: Medium — cannot verify bucket policy from the repo**

`MEDIA_BUCKET = 'media'` is served via `/storage/v1/object/public/media/...`, i.e. a **public** bucket. That is correct for marketing imagery.

Two things to confirm on the Supabase side, which are not visible in this repository:

1. **The bucket allows public `SELECT` only.** RLS/storage policies must not permit anonymous `INSERT`/`UPDATE`/`DELETE`. `upload.ts` uses the service-role key, so nothing in the app needs write access.
2. **`NUXT_PUBLIC_SUPABASE_KEY` is the anon key, not a service key.** It exists in the local `.env`, is *absent* from `.env.example`, and is **referenced nowhere in the codebase** — it is not declared in `runtimeConfig.public`, so it does not reach the client (verified). It is undocumented drift. Either delete it or document it.

Also note that `upload.ts` recursively lists the bucket with `--audit` to detect objects not in the manifest ("dashboard uploads are unsupported"). That is a good drift-detection habit; run it periodically.

---

## SEC-5 — Dependency risk

**Severity: Low** · Difficulty: Trivial

Renovate is configured (`renovate.json`, extending `github>nuxt/renovate-config-nuxt`, with `lockFileMaintenance` enabled). Good.

Two dependencies are dead and should be removed to shrink the supply-chain surface (see Report 4, P7):

| Package | Type | Status |
|---|---|---|
| `motion@^12.38.0` | `dependencies` | never bundled; only consumer is dead code |
| `@nuxtjs/device@4.0.0` | `dependencies` | not registered as a module; unused |

`@supabase/supabase-js` is correctly in `devDependencies` — it is only used by the migration scripts and never ships.

**No `pnpm audit` step exists in CI.** Add one. Also note CI never runs `pnpm build`, so a build-time supply-chain failure would not be caught (Report 8).

---

## SEC-6 — Information disclosure via the client bundle

**Severity: Low** · Difficulty: (fixed by Report 4, P3)

The whole of `manifest.json` ships to the browser (Report 4, P3). Beyond the 117 KB of wasted bytes, it discloses:

- SHA-256 checksums of every source and output asset
- **local filesystem paths**: `"sourceFile": "public/images/banner_home.jpg"`
- upload timestamps and internal `status` / `version` / `supersedes` lineage

None of this is exploitable. It is unnecessary, and it disappears when P3 is fixed.

---

## Authentication & authorization

There is none, and none is needed. There are no user accounts, no sessions, no protected routes, no server API handlers (`server/` does not exist), and no runtime database access. The only credential in the system is the service-role key, and it never leaves a developer's machine.

**This changes the moment a CMS lands** (`docs/media-migration/phase-5-roadmap.md`). When it does, that document should gain a section on: admin authn, RLS policies for the media tables, and separating the public read path from the authoring write path.

---

## Priority summary

| ID | Issue | Severity | Effort | Notes |
|---|---|---|---|---|
| SEC-1 | Zero security headers; `x-powered-by` disclosed | High | 2h | Do before adding analytics/CSP-affecting scripts |
| SEC-3 | Form backend must be built securely | Medium→High | with U9 | Currently inert; becomes real on day one of the backend |
| SEC-2 | `Set-Cookie` + no `Vary` on the SSR route | Medium | 1h | Free if you prerender (Report 4, P4) |
| SEC-4 | Confirm bucket policy is read-only; undocumented `.env` key | Low | 30m | Verify in the Supabase dashboard |
| SEC-5 | Two dead prod deps; no `pnpm audit` in CI | Low | 30m | |
| SEC-6 | Manifest metadata in the client bundle | Low | — | Resolved by Report 4, P3 |

**Overall posture: good for what this is.** The genuinely dangerous thing in the repo — the service-role key — is handled with more care than most projects manage. The gap is the standard hardening layer (headers, CSP) that no one has gotten to yet, plus the forward-looking discipline needed the moment the contact form gains a server.
