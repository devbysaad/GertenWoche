# Gartenwoche — Teammate Onboarding & Task Brief

> Read this end-to-end before touching anything. It captures the **exact** runtime
> state of the codebase as of 2026-05-27, every upstream API you'll call, every
> workaround in place, and the work that still needs doing.

---

## 1. Project at a glance

- **Goal.** Build a SvelteKit 2 / Svelte 5 front-end that is a 1:1 visual clone of
  [gartenwoche.ch](http://www.gartenwoche.ch/), pulling all content from the live
  WordPress install via REST.
- **Repo.** [github.com/idreesahmed1257/gartenwoche-website](https://github.com/idreesahmed1257/gartenwoche-website)
  (origin) / `devbysaad/GertenWoche` (mirror).
- **Local URL.** `http://localhost:5173`
- **Deploy targets.** `@sveltejs/adapter-vercel` (primary) and `@sveltejs/adapter-node`.
- **Reference UI doc (REQUIRED reading).**
  [UI Changes — Google Doc](https://docs.google.com/document/d/15a5F63h81XSoCmSPiAJ20ZHhkekrAWDW8O1d_MG9Rs4/edit?usp=sharing).
  Every visual decision on a new component must match this doc.

---

## 2. Tech stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | SvelteKit 2.57 + Svelte 5.55 | Uses Svelte 5 runes: `$state`, `$derived`, `$props`, `$effect` |
| Language | TypeScript 6 | Strict mode |
| Build | Vite 8 | |
| CSS | Tailwind v4 via `@tailwindcss/vite` | Used sparingly; most styling is per-component CSS using design tokens in `src/app.css` |
| Icons | `lucide-svelte` | |
| Dates | `date-fns` + custom helpers in `src/lib/utils/date.ts` (German locale) |
| Markdown | `marked` | Article body parsing |
| Runtime | Node 20+ | |
| Unused deps (legacy) | `better-sqlite3`, `bcryptjs`, `better-auth` | Safe to remove once we're certain we won't need local auth |

---

## 3. Environment setup

### 3.1 Required `.env`

Copy `.env.example` to `.env` and fill it in. Working values:

```env
# Public, exposed to client
PUBLIC_SITE_URL=http://localhost:5173
PUBLIC_WP_URL=https://gartenwoche.ch/wp-json

# Server-only — NEVER reference in *.svelte
WP_API_BASE=https://gartenwoche.ch/wp-json/wp/v2
WP_HEADLESSKEY_BASE=https://gartenwoche.ch/wp-json/headlesskey/v1

# Legacy / reference only — see §5
WP_JWT_AUTH_URL=https://gartenwoche.ch/wp-json/jwt-auth/v1/token
WP_JWT_VALIDATE_URL=https://gartenwoche.ch/wp-json/jwt-auth/v1/token/validate

# Session-cookie signing key. Generate with:
#   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
AUTH_SECRET=change-me-to-32-random-bytes

# Reserved — currently unused at runtime
BETTER_AUTH_URL=http://localhost:5173
BETTER_AUTH_SECRET=change-me
```

**Rules.** `WP_API_BASE`, `WP_HEADLESSKEY_BASE`, `AUTH_SECRET`, and `BETTER_AUTH_SECRET`
must NEVER appear in `+page.svelte`, `+layout.svelte`, or any module that gets
bundled into the client. Use them only in `+page.server.ts`, `+layout.server.ts`,
`hooks.server.ts`, and `src/routes/api/**/+server.ts`. Grep the production
client bundle (`.svelte-kit/output/client/`) for those strings before shipping —
they must be absent.

### 3.2 Commands

```bash
npm install            # one-time
npm run dev            # dev server at http://localhost:5173
npm run check          # svelte-check (currently 0 errors, 98 pre-existing warnings)
npm run build          # SSR build for Vercel
```

---

## 4. Upstream APIs you'll call

All endpoints are on `https://gartenwoche.ch/wp-json`. Anything that talks to
WordPress goes through the helpers in `src/lib/api/*` — **don't** sprinkle raw
`fetch()` calls into route loaders or components.

### 4.1 Content (no auth)

| Purpose | Endpoint | Helper |
|---|---|---|
| Posts (articles) | `GET /wp/v2/posts?_embed&per_page=...` | `getArticles`, `getArticlesByCategory`, `getArticleBySlug` in `src/lib/api/wordpress.ts` |
| Categories | `GET /wp/v2/categories` | `getCategories` |
| Featured author | derived from `_embedded.author` | `src/lib/utils/article.ts` |
| Industries (Branchenverzeichnis) | `GET /wp/v2/industries` | Currently bypassed — see §6.4 |
| Industry taxonomy categories | `GET /wp/v2/categories?taxonomy=industry` | not yet wired |
| Available taxonomies | `GET /wp/v2/taxonomies` | not yet wired |

### 4.2 Events (no auth)

**Endpoint to use:** `GET /tribe/events/v1/events` (The Events Calendar / Tribe).
Helper: `src/lib/api/events.ts`.

```
GET https://gartenwoche.ch/wp-json/tribe/events/v1/events
  ?per_page=50
  &page=1
  &start_date=2000-01-01 00:00:00
  &end_date=2099-12-31 23:59:59
```

**Why the wide window?** Tribe defaults `start_date` to **today** when omitted,
which silently hides every past event. We always pass `2000-01-01 → 2099-12-31`
and filter past/future locally with `applyTimeFilter`.

**Don't use** `GET /wp/v2/tribe_events` — that route is structurally broken on
this server and always returns `[]` even when events exist. The fallback path
that used to call it has been removed.

**Single event:** `fetchEventBySlug(slug)` currently scans the full upcoming +
past list and matches by `slug`. If perf becomes a concern, Tribe also exposes
`GET /tribe/events/v1/events/by-slug/{slug}` — wire it in `fetchEventBySlug`.

**Current calendar state.** As of 2026-05-27 the upstream calendar has 4 events,
**all in the past**: Paysalia 2025, Garten München, Giardina, RHS Chelsea Flower
Show. The homepage `EventsWidget` and `/veranstaltungen` both auto-fall-back to
showing the most recent past events when no upcoming exist, with a clear hint
banner. When the WP admins publish a new future event it will appear
automatically — no code change required.

### 4.3 Authentication

There are **two** JWT auth backends on this server. They are mutually independent.

#### HeadlessKey (`/headlesskey/v1/*`) — this is what the app currently uses

| Action | Endpoint | Body | Auth header |
|---|---|---|---|
| Register | `POST /headlesskey/v1/register` | `{ username, email, password, name }` | none |
| Login | `POST /headlesskey/v1/token` | `{ username, password }` | none |
| Validate | `POST /headlesskey/v1/token/validate` | `{ token }` | none |
| Refresh | `POST /headlesskey/v1/token/refresh` | `{ token }` | none |
| Revoke | `POST /headlesskey/v1/revoke` | `{ token }` | none |
| Forgot password | `POST /headlesskey/v1/forgot-password` | `{ email }` | none |
| Change password | `POST /headlesskey/v1/change-password` | `{ token, current_password, new_password }` | none |

#### Plain JWT plugin (`/jwt-auth/v1/*`) — partially working

| Action | Endpoint | Status |
|---|---|---|
| Token | `POST /jwt-auth/v1/token` (body: `{ username, password }`) | Working per latest team note; **but** historically returned 403 because `JWT_AUTH_SECRET_KEY` was missing from `wp-config.php`. Treat as fragile until verified. |
| Validate | `POST /jwt-auth/v1/token/validate` (header: `Authorization: Bearer …`) | Working when token endpoint works |
| `GET /wp/v2/users/me` | with `Authorization: Bearer …` | Returns the user, but `POST /wp/v2/users/me` updates are blocked on most accounts |
| `POST /wp/v2/users` (register) | with admin JWT | **Restricted to admins** — public signup is disabled, see §6.2 |

**Why HeadlessKey is the primary.** It accepts plain `username + password` with
no admin token, its `/token` response already includes the full user object
(so we skip a follow-up `/users/me` call), and it has its own working signing
key. The plain `jwt-auth/v1` plugin's server config was unreliable. If `jwt-auth`
becomes fully reliable upstream, swap the helper inside `src/lib/server/auth.ts`
and the rest of the app keeps working unchanged.

### 4.4 Account profile/billing — local JSON workaround

`POST /wp/v2/users/me` cannot reliably update fields on this server, so user
edits to profile + billing persist to a local JSON file:

- Store module: `src/lib/server/userStore.ts`
- File: `data/user-profiles.json` (gitignored, created on first save)
- API routes: `POST/GET /api/account/profile`, `POST/GET /api/account/billing`

When upstream is fixed, replace `userStore.ts` with a thin WP REST wrapper. The
HTTP contract of `/api/account/*` does not need to change.

### 4.5 Jobs (Stellenangebote)

Endpoint: `GET https://gartenwoche.ch/jm-ajax/get_listings/`
Helper: `src/lib/api/jobs.ts`.

### 4.6 Weather

Open-Meteo, no key needed. Helper: `src/routes/api/weather/+server.ts` calls
`https://api.open-meteo.com/v1/forecast?latitude=47.3769&longitude=8.5417&current=temperature_2m`.
The current rate-limit handling logs `[Weather] Open-Meteo fetch failed: Error: HTTP 429`
on 429 — acceptable, the cache absorbs it.

### 4.7 Podcast

Static catalogue inside `src/lib/api/video.ts` → `PODCAST_EPISODES`. Audio
served through `proxiedAudioUrl()` so mixed-content + CORS aren't an issue:

```
20090309_dickmaulruessler.mp3
Die-Sitkafichtenlaus.mp3
podcast-braune-thuja.mp3
Rosenschaedlinge-Teil-1.mp3
Rosenschaedlinge-Teil-2.mp3
Der-Birnengitterrost.mp3
Ratgeber_11-05-2018-1108.1526034486838.mp3
```

(`http://` originals are upgraded to `https://` by the proxy.)

---

## 5. Project layout (where to find things)

```
src/
├── app.css                       # CSS design tokens (--color-primary, --max-width, etc.)
├── app.d.ts                      # Typed $env/dynamic/private + App.Locals
├── app.html                      # Base HTML template
├── hooks.server.ts               # Session middleware (Vary: Cookie, private cache,
│                                 #   transparent token refresh) — see §7
├── lib/
│   ├── api/
│   │   ├── wordpress.ts          # Articles + categories
│   │   ├── events.ts             # Tribe v1 — events fetcher (see §4.2)
│   │   ├── jobs.ts               # Stellenangebote
│   │   ├── cache.ts              # In-memory TTL cache (5/10/15/30 min tiers)
│   │   ├── fallback.ts           # Static fallback content for upstream outages
│   │   ├── video.ts              # PODCAST_EPISODES + getVideoOfWeek()
│   │   └── index.ts              # Barrel
│   ├── server/
│   │   ├── auth.ts               # HeadlessKey wrapper — login/validate/refresh/...
│   │   └── userStore.ts          # File-backed profile + billing store
│   ├── components/
│   │   ├── articles/             # ArticleCard variants + AuthorMeta + CategoryBadge
│   │   ├── blocks/               # Home/category page blocks (Hero, MagazineGrid,
│   │   │                         #   PflanzenStrip, RasenGartenBlock, VideoBlock,
│   │   │                         #   EventsWidget, DirectoryLogos, ...)
│   │   ├── events/               # EventCard, EventListView, EventMonthView,
│   │   │                         #   EventSearch, MonthNavigator, CalendarExport
│   │   ├── directory/            # DirectoryCard, DirectoryLogos
│   │   ├── layout/               # TopBar, HeaderMain, NavPrimary, MegaMenu,
│   │   │                         #   Footer, Logo, SocialIcons
│   │   └── ui/                   # AdBanner*, LoginModal, SearchOverlay, Pagination,
│   │                             #   SearchBar, AuthorMeta, CategoryBadge, ProBadge
│   ├── stores/
│   │   ├── auth.store.ts         # currentUser, login(), register(), logout()
│   │   ├── modal.store.ts        # Auth modal visibility
│   │   ├── nav.store.ts          # Mobile nav drawer state
│   │   ├── search.store.ts       # Search overlay state
│   │   └── weather.store.ts      # Cached weather data
│   ├── types/
│   │   ├── index.ts              # GartenEvent, Article, Author, Category, ...
│   │   ├── article.ts            # WP article shapes
│   │   ├── author.ts
│   │   ├── category.ts
│   │   ├── event.ts              # GartenEvent
│   │   ├── job.ts
│   │   ├── user.ts               # WPUser
│   │   └── directory.ts
│   └── utils/
│       ├── article.ts            # Article URL builders, excerpt helpers
│       ├── date.ts               # German date formatting
│       ├── seo.ts                # JSON-LD + meta helpers
│       ├── slug.ts
│       └── weather.ts
└── routes/
    ├── +layout.svelte            # Topbar + header + nav + footer + main slot
    ├── +layout.server.ts         # Loads categories, locals.user, weather
    ├── +page.{server,svelte}.ts  # Home — 13 content slots, see §6.1
    ├── +error.svelte             # 404/500
    ├── api/
    │   ├── auth/
    │   │   ├── login/+server.ts
    │   │   ├── register/+server.ts
    │   │   ├── logout/+server.ts
    │   │   ├── refresh/+server.ts
    │   │   ├── forgot-password/+server.ts
    │   │   ├── change-password/+server.ts
    │   │   ├── me/+server.ts
    │   │   └── [...all]/+server.ts
    │   ├── account/
    │   │   ├── profile/+server.ts
    │   │   └── billing/+server.ts
    │   ├── cache-stats/+server.ts
    │   ├── search/+server.ts
    │   └── weather/+server.ts
    ├── [category]/                          # Category index (mosaic hero variant)
    ├── [cat]/[subcat]/[slug]/               # Article detail (3-segment)
    ├── [category]/[slug]/                   # Article detail (2-segment)
    ├── [...path]/                           # Catch-all article fallback
    ├── category/[...slug]/                  # Alt category prefix matching WP permalinks
    ├── anmelden-registrieren/               # Login + register page (not iframe)
    ├── mein-konto/                          # Profile + billing (auth-required)
    ├── search/                              # Search results
    ├── author/[slug]/                       # Author archive
    ├── veranstaltungen/                     # Events list + month + day views
    ├── veranstaltung/[slug]/                # Event detail
    ├── stellenangebote-fuer-die-gruene-branche/  # Jobs
    ├── branchenverzeichnis/                 # Industry directory (iframe — see §6.4)
    ├── podcast-garten/                      # Podcast player (single-active episode)
    ├── abonnement/                          # Subscription CTA
    ├── impressum/                           # Legal
    ├── datenschutzerklaerung/               # Privacy
    ├── allgemeine-geschaeftsbedingungen/    # T&Cs
    ├── schreiben-sie-uns/                   # Contact form
    ├── robots.txt/+server.ts
    └── sitemap.xml/+server.ts
```

---

## 6. Page-by-page status (what's done / what isn't)

### 6.1 Home (`/`)

- 13 content slots, all wired via `Promise.all` in `+page.server.ts`.
- Hero (`HeroSpotlight.svelte`) rebuilt to match the Google Doc reference.
- Sidebar `EventsWidget` shows upcoming events, **falls back to most recent past
  events with an italic hint** when nothing is scheduled.
- Every other block still needs a pixel-perfect audit against the Google Doc:
  `MagazineGrid`, `FeaturedGrid`, `MixedArticleBlock`, `ThreeColBlock`,
  `PflanzenStrip`, `RasenGartenBlock`, `VideoBlock` (Video der Woche),
  `ExclusiveBlock`, `RotatingCarousel`, `FourColBottomSection`,
  `ProductSidebar`, `DirectoryLogos`, `EventsWidget`.

### 6.2 Auth (`/anmelden-registrieren`, `/mein-konto`)

- Login + register + recover password — all wired to HeadlessKey via
  `src/lib/server/auth.ts`. Session cookie is `wp_token`, `HttpOnly`,
  `SameSite=Lax`, `Secure` in production.
- Login & register pages: real Svelte forms (not iframe). After successful
  submit we use `window.location.assign()` to force a hard navigation so the
  cookie is on the next request and no SvelteKit race conditions kick in.
- Logged-in users hitting `/anmelden-registrieren` get server-redirected away.
- `/mein-konto`: profile (name + email + display name + bio) and billing
  (company, street, postcode, city, country, VAT ID) editable. Both persist to
  `data/user-profiles.json` via `src/lib/server/userStore.ts`. Password change
  is wired to `/api/auth/change-password`.

**Open task.** The instant the WP `JWT_AUTH_SECRET_KEY` is fixed upstream, swap
`userStore.ts` for a real `POST /wp/v2/users/me` adapter. Keep the
`/api/account/{profile,billing}` HTTP contract unchanged.

### 6.3 Events (`/veranstaltungen`, `/veranstaltung/[slug]`)

- Three views: list (default), monthly calendar, day view.
- Month navigator + search + view switcher in a single integrated topbar.
- Past-events fallback notice appears on the default list view when no
  upcoming events exist.
- Calendar export via `CalendarExport.svelte` (downloads `.ics`).
- All four current events render: Paysalia 2025, Garten München, Giardina,
  RHS Chelsea Flower Show. Detail pages all return 200.

### 6.4 Branchenverzeichnis (`/branchenverzeichnis`)

- **Iframe** to `https://gartenwoche.ch/branchenverzeichnis/` via a server-side
  proxy at `/branchenverzeichnis/proxy/+server.ts` that strips the upstream's
  `Content-Security-Policy: frame-ancestors …` header and injects a `<base>` so
  links keep working.
- The 15-second timeout shows a fallback "open in new tab" panel only on
  actual proxy failure.

**Cleaner fix for prod.** Ask the WP admins to add the production domain to
`frame-ancestors` — then we can iframe directly and drop the proxy. Helper API
endpoints (`GET /wp/v2/industries`, `?taxonomy=industry`) are documented but not
yet consumed in code — the iframe is the workaround until UI is rebuilt natively.

### 6.5 Podcast (`/podcast-garten`)

- All 7 episodes from `PODCAST_EPISODES` render with a custom HTML5 player.
- **Single-active-episode** behaviour: starting a new episode pauses the others.
- Audio served through `proxiedAudioUrl()` to avoid mixed-content + CORS.

### 6.6 Static / legal

- `/impressum`, `/datenschutzerklaerung`, `/allgemeine-geschaeftsbedingungen`,
  `/abonnement`, `/schreiben-sie-uns` — all rendered, content is placeholder
  prose until WP admin provides final copy.

---

## 7. Caching, CSP, and the "wrong user" bug fix

A previous regression: logged out from account A, logged in as account B, but
the page still showed A's name. Root cause was browser HTTP caching of
pre-auth HTML. `src/hooks.server.ts` enforces:

- `Vary: Cookie` on every response.
- `Cache-Control: private, no-store, must-revalidate` for any authenticated
  request, any `/mein-konto/*` URL, any `/anmelden-registrieren` URL, and
  any `/api/auth/*` or `/api/account/*` URL.
- Transparent token refresh when `wp_token` is within 24 h of expiry.
- 12 s timeout on `validateToken` (aligned with `AUTH_TIMEOUT_MS` in
  `src/lib/server/auth.ts`).

**Do not weaken these.** If you add a new authenticated route, make sure
`isAuthSensitive()` picks it up.

---

## 8. Coding conventions (follow strictly)

1. **Zero `border-radius`** anywhere in the UI. The brand uses sharp corners.
2. **Server-only secrets** live only in `*.server.ts`, `hooks.server.ts`, and
   `src/routes/api/**/+server.ts`. Never imported by `.svelte` files.
3. **Every upstream call** wrapped in a try/catch in the helper, returns `[]`
   / `null` / a typed empty object on failure. Never let a 500 from WordPress
   crash a page.
4. **Cache reads** via `src/lib/api/cache.ts`. Don't reinvent.
5. **Svelte 5 runes only** — no legacy `<script>` reactive statements (`$:`),
   no `export let` props. Use `$state`, `$derived`, `$props`, `$effect`.
6. **CSS lives in components.** Reach for global CSS only for tokens in
   `src/app.css` and the shared utilities (`.container`, `.section-heading`,
   `.prose`, `.skip-link`).
7. **No new dependencies** without checking the existing `package.json`. We
   already ship `lucide-svelte`, `date-fns`, `marked`. Reuse before installing.
8. **Comments.** Only when intent isn't obvious from the code. No "// import
   foo" / "// loop over array" noise.
9. **TypeScript strictness**: don't paper over with `as any`. If a type fights
   you, fix the type at the source.

---

## 9. Tasks for the teammate

Ordered by priority. Each item is self-contained and verifiable.

### High priority

1. **Pixel-perfect UI clone** against the Google Doc, block by block on the
   home page. Visual audit + per-component CSS tweaks. Start with sections
   2–13 (section 1 — hero — is already rebuilt).
2. **Fix the two pre-existing `svelte-check` warnings** that aren't yet
   addressed:
   - `SearchOverlay.svelte` calls `searchStore.close()` which the store doesn't
     export. Either add `close()` to the store or call the existing reset
     method.
   - One `+page.svelte` (search results page) passes a prop shape to
     `ExclusiveBlock` that doesn't match its declared type. Reconcile the type
     or the call site.
3. **Swap `userStore.ts` for a `POST /wp/v2/users/me` adapter** once WP
   server-side `JWT_AUTH_SECRET_KEY` is in place. Keep the API contract for
   `/api/account/profile` and `/api/account/billing` unchanged.
4. **Remove unused deps** (`better-sqlite3`, `bcryptjs`, `better-auth`) once
   we're certain we won't fall back to local auth. Run `npm run check` and
   `npm run build` after removal.

### Medium priority

5. **Rebuild `/branchenverzeichnis` natively** using `GET /wp/v2/industries`
   and `GET /wp/v2/categories?taxonomy=industry`. Match the existing iframe's
   layout: 4-column grid of company logos with the styling described in the
   Google Doc. Drop the proxy + iframe once parity is reached.
6. **Wire `/jm-ajax/get_listings/`** properly in `src/lib/api/jobs.ts` and
   render against `/stellenangebote-fuer-die-gruene-branche`.
7. **Optimize `fetchEventBySlug`** in `src/lib/api/events.ts` to use Tribe's
   `GET /tribe/events/v1/events/by-slug/{slug}` instead of fetching the
   full list twice. Keep the existing helper signature.
8. **Pre-existing `state_referenced_locally` lints** in
   `src/routes/veranstaltungen/+page.svelte` (lines ~25–28): wrap the initial
   reads of `data` inside `$derived` so Svelte tracks subsequent server
   reloads correctly.

### Low priority

9. **`branchenverzeichnis/eintrag/[slug]`** detail page is a stub. Hook it to
   the single-industry endpoint once §6 is rebuilt natively.
10. **Subscription page (`/abonnement`)** needs the real WooCommerce / Stripe
    flow if/when commerce is added. Currently a static CTA.
11. **`/schreiben-sie-uns` contact form** has no submit endpoint yet — pick
    a WP Contact Form plugin or a server route + outbound SMTP.

### Don't touch unless explicitly asked

- Anything inside `src/hooks.server.ts` related to session reading, cookie
  setting, or cache headers.
- `src/lib/server/auth.ts` token-expiry parsing (the `exp` claim handling has
  a subtle bug-fix history — read the comments before changing).
- The `wp_token` cookie name (referenced in middleware and several API
  routes).

---

## 10. Verification checklist before opening a PR

Run all of these locally. Every box must tick.

**Build / lint:**
- [ ] `npm run check` → 0 errors. Warning count must not increase beyond 98.
- [ ] `npm run build` → succeeds.
- [ ] No new file imports private env vars from a client-bundled module.
  - `rg "WP_API_BASE|WP_HEADLESSKEY_BASE|AUTH_SECRET|BETTER_AUTH_SECRET" src/lib/components src/lib/stores src/routes --glob '!*.server.ts' --glob '!*+server.ts'`
    must print nothing.

**Auth:**
- [ ] Register a fresh user → cookie set → redirected to `/mein-konto`.
- [ ] Logout → cookie gone → `/mein-konto` redirects to `/anmelden-registrieren`.
- [ ] Login with wrong password → inline German error.
- [ ] Hard-refresh while logged in → session survives.

**Content:**
- [ ] Home page: all 13 blocks render, hero matches the Google Doc.
- [ ] Category pages paginate and show category-coloured strap.
- [ ] Article body renders WP HTML cleanly (Georgia 17px, 1.75 line-height).
- [ ] Events page: all 4 events render with the past-events notice.
- [ ] Podcast page: all 7 episodes load, single-active-episode behaviour.

**Responsive:**
- [ ] 375 px mobile: single column, hamburger drawer works.
- [ ] 768 px tablet: 2-col grid maximum.
- [ ] 1280 px desktop: full layout.

**Security:**
- [ ] `Network` tab: no JWT in any response body or URL.
- [ ] `wp_token` cookie is `HttpOnly` and `SameSite=Lax`.
- [ ] `/mein-konto` HTML response has `Cache-Control: private, no-store`.

---

## 11. Known issues to be aware of (not your problem to fix unless asked)

- **WP server config.** `JWT_AUTH_SECRET_KEY` is missing from `wp-config.php`
  on `gartenwoche.ch`, which is why we use HeadlessKey and the local
  `userStore`. The "right" fix is on the WP side, not ours.
- **CSP `frame-ancestors`.** Upstream WP currently allows iframing only from
  `https://gartenwoche-website.vercel.app`. The proxy at
  `/branchenverzeichnis/proxy` is the workaround.
- **Tribe calendar emptiness.** All four real events on the upstream calendar
  are now in the past. New events appear automatically once an admin publishes
  them — no code change required.
- **Open-Meteo 429s.** Free-tier rate-limiting occasionally trips on hot reload.
  The cache absorbs it; the only symptom is a single `[Weather] Open-Meteo
  fetch failed: Error: HTTP 429` log line.

---

## 12. Quick local-dev workflow

```bash
# clone
git clone https://github.com/idreesahmed1257/gartenwoche-website.git
cd gartenwoche-website

# install + env
npm install
cp .env.example .env   # then fill the secrets per §3.1

# run
npm run dev            # http://localhost:5173

# in another shell, smoke-test before pushing:
npm run check
npm run build
```

Smoke URLs to spot-check after any non-trivial change:
- `http://localhost:5173/`
- `http://localhost:5173/veranstaltungen`
- `http://localhost:5173/veranstaltung/giardina`
- `http://localhost:5173/anmelden-registrieren`
- `http://localhost:5173/mein-konto` (after login)
- `http://localhost:5173/branchenverzeichnis`
- `http://localhost:5173/podcast-garten`

---

## 13. When you're stuck

1. Re-read the relevant section of this brief.
2. Re-read the Google Doc UI spec.
3. Probe the upstream API directly with `curl` to confirm what it actually
   returns (don't trust assumptions — that's what masked the events bug for a
   week).
4. Check `npm run check` output. The 98 warnings have been the same for
   months; any new entry is on you.
5. Ping in chat with: route URL, HTTP method, expected vs actual, console
   logs, and what you've already tried.

Welcome aboard.
