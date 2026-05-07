# GARTENWOCHE.CH — MASTER PROJECT FILE
# SvelteKit 2 + Svelte 5 (runes) + TailwindCSS v4 + adapter-node
# Exact pixel-perfect clone. Read every word before writing a single line of code.

---

## WHAT THE PREVIOUS BUILD GOT WRONG (fix all of these)

1. **Images not loading** — The WP REST API returns real image URLs in `_embedded['wp:featuredmedia'][0].source_url`. Use them. Never use placeholders if real images exist.
2. **Category page layout wrong** — Gartentechnik has a 3-article featured block (large left + 2 small right), then a "Weitere Artikel" sidebar. Not a simple grid.
3. **Missing sidebar on category pages** — Every category page has a RIGHT SIDEBAR with "Weitere Artikel" (5 recent articles from any category).
4. **Video not embedded** — Homepage has "Video der Woche" section using Vimeo: `https://player.vimeo.com/video/106571242`
5. **Wrong fonts** — Must be Roboto (headings) + Open Sans (body) + Lora (article h1). NOT Barlow Condensed. NOT Verdana as primary.
6. **Wrong container width** — Max-width is 1200px NOT 1280px.
7. **Wrong accent color** — Accent yellow is `#F7C900` NOT `#FFD700`.
8. **Podcast page wrong** — Real page has actual audio players (HTML5 `<audio>` tags with SRF podcast URLs).
9. **Missing pages** — `/category/pflanzen/wasserpflanzen`, `/category/pflanzen/sommerflor`, `/category/pflanzen/rosen` must all work.
10. **Article URL structure wrong** — URLs follow WP slug: `/gartenpraxis/[slug]`, `/pflanzen/stauden/[slug]`, `/aktuelles/schweiz/[slug]` etc. NOT `/[category]/[slug]`.

---

## LIVE DATA SOURCES (server-side fetch only, never client-side)

```
Posts (all articles):
  https://gartenwoche.ch/wp-json/wp/v2/posts?per_page=100&_embed&page=1
  https://gartenwoche.ch/wp-json/wp/v2/posts?per_page=100&_embed&page=2
  (keep paginating until X-WP-TotalPages is reached)

Categories:
  https://gartenwoche.ch/wp-json/wp/v2/categories?per_page=100

Authors/Users:
  https://gartenwoche.ch/wp-json/wp/v2/users?per_page=100

Tags:
  https://gartenwoche.ch/wp-json/wp/v2/tags?per_page=100

Events (The Events Calendar plugin):
  https://gartenwoche.ch/wp-json/tribe/v1/events
  Fallback if 404: return [] (empty array, no crash)

Media (only fetch when needed by slug/id):
  https://gartenwoche.ch/wp-json/wp/v2/media/[id]
```

### Data mapping from WP REST API response:

```typescript
// From a post object with _embed:
thumbnail  = post._embedded?.['wp:featuredmedia']?.[0]?.source_url ?? ''
authorName = post._embedded?.['author']?.[0]?.name ?? ''
authorSlug = post._embedded?.['author']?.[0]?.slug ?? ''
category   = post._embedded?.['wp:term']?.[0]?.[0]  // first primary category
content    = post.content.rendered    // raw HTML — render with {@html}
excerpt    = post.excerpt.rendered    // raw HTML — strip tags for plain text
title      = post.title.rendered      // may contain HTML entities — decode
date       = new Date(post.date)
slug       = post.slug
link       = post.link               // full canonical URL e.g. https://gartenwoche.ch/gartenpraxis/lebende-alternative/
// Extract path from link for internal routing:
path       = new URL(post.link).pathname  // e.g. /gartenpraxis/lebende-alternative/
```

---

## DESIGN SYSTEM (non-negotiable, match exactly)

### Colors
```css
:root {
  --color-primary:       #2D1B69;   /* dark purple — topbar bg, footer bg, buttons */
  --color-primary-hover: #4a0e4e;   /* deeper purple on hover */
  --color-accent:        #F7C900;   /* intense yellow — category badges, CTAs */
  --color-bg:            #F7F7F7;   /* page/body background */
  --color-surface:       #FFFFFF;   /* cards, header, article bg */
  --color-text:          #222222;   /* primary body text */
  --color-text-muted:    #555555;   /* author, date, meta */
  --color-text-faint:    #999999;   /* placeholders, disabled */
  --color-border:        #E0E0E0;   /* card borders, dividers */
  --color-tag-bg:        #FFF9D6;   /* light yellow tag background */
  --color-tag-text:      #2D1B69;   /* purple tag text */
}
```

### Fonts (Google Fonts — load in app.html)
```
https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;800;900&family=Open+Sans:wght@400;600;700&family=Lora:ital,wght@0,700;1,700&display=swap
```
- **Roboto** → headings (h1–h6), nav, labels, category badges, UI buttons
- **Open Sans** → body text, excerpts, article paragraphs, form fields
- **Lora** → article single page H1 title ONLY (font-family: 'Lora', Georgia, serif)
- **Verdana, Geneva** → fallback only, never primary

### Spacing & Layout
```css
--max-width:      1200px;   /* container max-width — EXACTLY 1200px */
--topbar-height:  36px;
--header-height:  80px;
--nav-height:     50px;
--sidebar-width:  300px;
--gap:            20px;
```

---

## EXACT PAGE STRUCTURE & LAYOUTS

### TOPBAR (36px, #2D1B69 background)
Left side — 12 quick-links in white Roboto 12px:
```
Aktuelles | Schweiz | Europa | Welt | Produktschau | Wissen |
Gartenpraxis | Pflanzenschutz | Pflanzenempfehlungen | Stauden |
Veranstaltungen | Stellenangebote für die grüne Branche
```
Right side: "Anmelden" + "Beitreten" buttons (open login modal)
Hover color on all: #F7C900

### HEADER MAIN (white, ~80px)
- Left: Gartenwoche logo (SVG text logo — "Gartenwoche" in italic serif style + tagline "DAS UNABHÄNGIGE GARTENMAGAZIN")
- Center: thermometer icon + temperature + "Zürich" + date "Donnerstag, Mai 7, 2026"
- Right: Facebook + Instagram + X icons | "Mein Konto" dropdown

### PRIMARY NAV (white, sticky, 50px)
```
Gartenpraxis | Pflanzen ▾ | Rasen | Wissen | Aktuelles ▾ | Gartentechnik | Podcast Garten
```
Pflanzen dropdown: Stauden / Sommerflor / Rosen / Pflanzenempfehlungen / Pflanzenschutz
Aktuelles dropdown: Schweiz / Europa / Welt
Right side: search icon (🔍)

---

## HOMEPAGE LAYOUT (exact section order)

### Section 1 — HERO (full width)
- 1 large featured article: big image left (60%), title + excerpt + author + date right
- Category badge (yellow) over image bottom-left
- Links to article

### Section 2 — FEATURED GRID (4 columns)
- 4 article cards side by side
- Each: image top, category badge, title, author + date
- Mixed categories

### Section 3 — PFLANZENEMPFEHLUNGEN STRIP
- Section heading "Pflanzenempfehlungen" with arrow link right
- Horizontal scroll carousel of 5 article cards

### Section 4 — RASEN + GARTENPRAXIS DUO
- Left 60%: 1 large Rasen article (ArticleCardLarge)
- Right 40%: heading "Gartenpraxis" + 3 small ArticleCardSmall stacked

### Section 5 — VIDEO DER WOCHE
```html
<!-- Exact embed code from original site -->
<div class="video-wrapper">
  <h3>Video der Woche</h3>
  <div class="iframe-container">
    <iframe 
      src="https://player.vimeo.com/video/106571242?title=0&byline=0&portrait=0"
      width="640" height="360"
      frameborder="0"
      allow="autoplay; fullscreen; picture-in-picture"
      allowfullscreen>
    </iframe>
  </div>
  <p>In einem Gewächshaus lauert eine fleischfressende Pflanze auf Beute...</p>
</div>
```

### Section 6 — MIXED 3-COLUMN BLOCK
- Col 1: Gartenpraxis articles (3 small cards)
- Col 2: Wissen articles (3 small cards)  
- Col 3: Europa articles (3 small cards)
- Each column has category heading + "Mehr [category] →" at bottom

### Section 7 — ROTATING CAROUSEL (auto-play slider)
- 2–4 articles, auto-advances every 5s
- Full width image with text overlay (same as hero style)
- Dot indicators

### Section 8–11 — 2-COLUMN WRAPPER (main 2/3 + sidebar 1/3)

**Main column (2/3):**
Section 9 — ThreeColBlock:
- Col A: Pflanzenschutz (2 articles)
- Col B: Produktschau (2 articles)
- Col C: Rasen (2 articles)

**Sidebar (1/3):**
Section 8 — Produktvorschläge:
- Heading "Produktvorschläge"
- 5 stacked ArticleCardSmall from Produktschau

Section 10 — Branchenverzeichnis logos:
- Heading "Branchenverzeichnis" + "Mehr →"
- 8 company logos in scrollable strip

Section 11 — Events Widget:
- Heading "Events"
- Date badge + title + location
- "Kalenderansicht →" link

---

## CATEGORY PAGE LAYOUT (exact — from gartentechnik analysis)

```
+--------------------------------------------------+
| Breadcrumb: Start > Gartentechnik                |
+--------------------------------------------------+
| H1: "GARTENTECHNIK"                              |
+--------------------------------------------------+
|                          |                       |
|  MAIN (70%)              |  SIDEBAR (30%)        |
|                          |                       |
|  FEATURED BLOCK:         |  "Weitere Artikel"    |
|  [Large article left]    |  heading              |
|  [2 small right col]     |  5 recent articles    |
|                          |  from any category    |
|  ─────────────────       |  (ArticleCardSmall)   |
|                          |                       |
|  "Keine Beiträge         |                       |
|  vorhanden" if empty     |                       |
|                          |                       |
+--------------------------------------------------+
```

**Featured block structure for categories with 3+ articles:**
- Article 1: Large card (60% width, full image)
- Article 2 + 3: Two small cards stacked (40% width right)

**For categories with 1–2 articles:**
- Just show the cards normally (no special layout)

**"Weitere Artikel" sidebar** (always present):
- Shows 5 most recent articles from ALL categories (not just current)
- Each: small thumbnail (60x60) + title (2-line clamp) + author + date

---

## ARTICLE PAGE LAYOUT

```
+--------------------------------------------------+
| Breadcrumb: Start > Category > Article Title     |
+--------------------------------------------------+
|                          |                       |
|  ARTICLE (70%)           |  SIDEBAR (30%)        |
|                          |                       |
|  CategoryBadge           |  "Weitere Artikel"    |
|  H1 in Lora 700 32px     |  (5 recent any cat)   |
|  Author · Date           |                       |
|  Full-width thumbnail    |  "Branchenverzeichnis"|
|  Article HTML body       |  (logo strip)         |
|                          |                       |
|  Tags row                |  "Events" widget      |
|  Social share            |                       |
|                          |                       |
+--------------------------------------------------+
|  "Ähnliche Artikel" — 4 cards same category      |
+--------------------------------------------------+
```

Article body prose styles:
- p: Open Sans 16px, line-height 1.8, color #222
- h2: Roboto 22px 700
- h3: Roboto 18px 700
- img: 100% width, border-radius 4px
- blockquote: border-left 4px solid #F7C900, padding-left 1em, italic, color #555
- a: color #2D1B69, text-decoration underline
- ul/ol: Open Sans 16px, padding-left 1.5em

---

## URL ROUTING (exact — derived from live site)

Article URLs follow this pattern (extracted from `post.link`):
```
/gartenpraxis/[slug]
/pflanzen/stauden/[slug]
/pflanzen/pflanzenempfehlungen/[slug]
/pflanzen/wasserpflanzen/[slug]
/pflanzen/sommerflor/[slug]
/pflanzen/rosen/[slug]
/pflanzenschutz/[slug]
/rasen/[slug]
/wissen/[slug]
/aktuelles/schweiz/[slug]
/aktuelles/europa/[slug]
/aktuelles/welt/[slug]
/gartentechnik/[slug]
/produktschau/[slug]
/allgemeines/[slug]      ← extra category found in live site
```

SvelteKit routes to handle ALL of these with ONE catch-all:
```
src/routes/[...path]/+page.svelte       ← handles any depth URL
src/routes/[...path]/+page.server.ts    ← extracts slug from path, fetches article
```

Category pages (separate from article pages):
```
src/routes/category/[...slug]/+page.svelte
```
But the live site uses `/category/[slug]` only for the main WP archive URL.
The nav links already point to `/category/gartenpraxis` etc.

---

## PODCAST PAGE (exact content from live site)

URL: `/podcast-garten`

Real content — HTML5 audio players:
```
Podcast zum Thema Pflanzenschutz im Garten der Fachhochschule Wädenswil...

Episodes (use real SRF audio embed or HTML5 audio):
1. Der Dickmaulrüssler: Biologie und seine Bekämpfung
2. Die Schildläusetanz: Schildbild und Bekämpfung
3. Meine Thuja ist braun
4. Rosenschäcklinge Teil 1
5. Rosenschäcklinge Teil 2
6. Der Einwegtornist

Also: Audiobeiträge vom SRF zum Thema Garten:
7. Gestaltungstipp: Insektenbienen im Rasen passen in jeden Garten
```

Use `<audio controls>` HTML5 players. Styling: dark gray player background, 
full width, rounded 4px.

---

## CONFIRMED ARTICLE SLUGS (from live site)

These MUST resolve and load real content from WP API:

```
/aktuelles/schweiz/nuesslisalat-ganzjaehriger-vitaminchampion/
/produktschau/kress-voyager-hohe-maehleistung-fuer-profis/
/aktuelles/schweiz/zeitliche-veraenderungen-im-laubfall-haben-folgen-fuer-flohkrebse/
/wissen/biohybride-pflanzen-unibz-entwickelt-superpflanzen-fuer-eine-bessere-umwelt/
/gartenpraxis/zwitschern-laesst-sich-pflanzen-wie-sie-mit-stauden-fuer-die-vogelwelt-sorgen/
/pflanzen/pflanzenempfehlungen/neue-hortensie-runaway-bride/
/pflanzen/stauden/der-steppensalbei-salvia-nemorosa-die-besten-sorten/
/pflanzen/pflanzenempfehlungen/alternative-zur-lorbeerkirsche-der-glaenzende-liguster/
/rasen/hirse-im-rasen/
/gartenpraxis/lebende-alternative-zum-sonnenschirm/
/pflanzenschutz/die-maulwurfsgrille-oder-werre/
/produktschau/hydro-mousse-spruehen-fertig-rasen/
/aktuelles/welt/der-schwarze-diamant-ein-ungewoehlicher-apfel-aus-tibet/
/wissen/was-blueht-da-am-wegesrand/
/aktuelles/europa/von-der-strasse-auf-den-teller-salat-nimmt-giftige-zusatzstoffe-aus-reifenabrieb-auf/
/pflanzen/pflanzenempfehlungen/cornus-kuosa-scarlet-fire-blumenhartriegel/
/pflanzen/wasserpflanzen/seerosen-in-kleinen-gefaessen/
/pflanzen/pflanzenempfehlungen/neue-katzenminze-nepeta-neptune/
/pflanzen/pflanzenempfehlungen/euonymus-japonicus-paloma-blanca/
/gartentechnik/stiftung-warentest-maehroboter-gefaehrden-kinder/
/gartentechnik/akkublasgeraet-stihl-bga-85/
/gartentechnik/268-2/
/allgemeines/herbstpflege-die-summt-den-garten-und-wildbienen-fit-fuer-den-winter-machen/
/pflanzen/stauden/staudengiganten-fuer-den-garten/
```

---

## SIDEBAR "WEITERE ARTIKEL" — exact 5 confirmed articles

Always show these 5 in sidebar (sorted by date desc):
```
1. Nüsslisalat: Ganzjähriger Vitaminchampion (News-Redaktion, 19. Feb 2026)
2. Biohybride Pflanzen: unibz entwickelt Superpflanzen (Redaktion Wissen, 19. Feb 2026)
3. Kress Voyager: hohe Mähleistung für Profis (Redaktion Gartenpraxis, 15. Feb 2026)
4. Zeitliche Veränderungen im Laubfall (News-Redaktion, 15. Feb 2026)
5. Herbstpflege, die summt (News-Redaktion, 26. Sep 2025)
```

---

## BRANCHENVERZEICHNIS (8 confirmed entries)

```
slug: pflanzenschau-ag-2        → Pflanzenschau AG
slug: erni-gartenbau-ag-2       → Erni Gartenbau AG
slug: spross-ga-la-bau-ag-2     → Spross Ga-La-Bau AG
slug: eibe-ag-2                 → eibe AG
slug: trend-und-blumenboerse-luzern-2 → Trend und Blumenbörse Luzern
slug: zebra-ag-garten-und-pool-2 → Zebra AG Garten und Pool
slug: gartenbijoux-2            → Gartenbijoux
slug: il-vivaio-2               → Il Vivaio
```

Logo images: fetch from WP custom posts or use company-initial placeholder.
Logo container: white bg, 1px border #E0E0E0, 120×80px, object-contain.

---

## EVENTS (confirmed from live site)

```
Title: RHS Chelsea Flower Show
Dates: 19. Mai – 23. Mai 2026
Location: London, UK
URL: /veranstaltung/rhs-chelsea-flower-show/

Date badge shows: "19" (day, large) + "MAI" (month, small) in purple block
```

Events widget on homepage sidebar shows this one event.
Events page: `/veranstaltungen/` with list view default.

---

## FOOTER (exact structure)

```
+----------------------------------------------------------+
| [Gartenwoche logo] PRO |  PRO LINKS    | RECHTLICHES      |
|                        |               |                  |
| Das unabhängige        | Branchenverz. | Datenschutz      |
| Gartenmagazin          | Stellenangebote| AGB             |
| für die Schweiz        | Veranstaltungen| Abonnement      |
|                        |               | Impressum        |
|                        |               | Kontaktformular  |
+----------------------------------------------------------+
| "Hinweis in eigener Sache" text + "Hier registrieren" CTA|
+----------------------------------------------------------+
| [AWIN 300×250 banner]                                    |
| https://www.awin1.com/cread.php?s=2436107&v=15934&q=368245&r=602261 |
+----------------------------------------------------------+
| © 2025 Gartenwoche. Alle Rechte vorbehalten.             |
+----------------------------------------------------------+
```

Footer text (exact):
```
"Hinweis in eigener Sache"
"Dieser Blog ist unabhängig und wird privat betrieben. Wenn Ihnen die Inhalte 
gefallen und Sie die Fortführung unterstützen möchten, können Sie dies mit einem 
Abonnement tun."
Button: "Hier registrieren" → /anmelden-registrieren/?signup
```

---

## COMPANY INFO (for Impressum page)

```
Gartenmedien Ltd.
Via Campagna 19, 6595 Riazzino, Switzerland
Phone: +41 (0)76 24 200 25
Email: info@gartenwoche.ch
Responsible: Peter Sturm
Note: "Dieser Blog ist unabhängig und wird privat betrieben."
```

---

## SOCIAL LINKS

```
Facebook:  https://www.facebook.com/gartenwoche
Instagram: https://www.instagram.com/gartenwoche/
X:         https://x.com/PeterRedaktion
```

---

## LOGIN MODAL (exact 3-tab structure)

Tab 1 "Anmelden":
- H: "Herzlich willkommen!"
- Sub: "Melde dich in deinem Konto an"
- Fields: "Ihr Benutzername", "Ihr Passwort"
- Link: "Passwort vergessen?"
- Link: "Ein Konto erstellen"
- Footer: link to Datenschutzerklärung

Tab 2 "Registrieren":
- H: "Herzlich willkommen!"
- Sub: "Registrieren Sie sich für ein Konto"
- Fields: "Ihre E-Mail-Adresse", "Ihr Benutzername"
- Note: "Ein Passwort wird Ihnen per Email zugeschickt."
- Footer: link to Datenschutzerklärung

Tab 3 "Passwort vergessen":
- H: "Passwort-Wiederherstellung"
- Sub: "Passwort zurücksetzen"
- Field: "Ihre E-Mail-Adresse"

---

## SEARCH OVERLAY

- Triggered by 🔍 icon in nav
- Full dark overlay
- Input placeholder: "type here..."
- Real-time results below (debounced 300ms)
- ESC to close

---

## TECH STACK

```
SvelteKit 2 (latest stable)
Svelte 5 with runes ($state, $props, $effect, $derived)
TypeScript 5
TailwindCSS v4 (@tailwindcss/vite plugin)
@sveltejs/adapter-node
date-fns (German locale for date formatting)
zod + sveltekit-superforms (contact form)
```

---

## ENVIRONMENT VARIABLES

```env
WEATHER_API_KEY=     # OpenWeatherMap key (mock 10.7°C Zürich if missing)
PUBLIC_SITE_URL=https://gartenwoche.ch
NODE_ENV=development
```

---

## CACHE STRATEGY

All WP API fetches → in-memory Map cache with TTL:
```
articles:    5 min
categories:  30 min
authors:     30 min
events:      10 min
weather:     15 min
directory:   60 min
```

Fallback: if API unreachable → return hardcoded fallback data (never crash).

---

## 5-PHASE BUILD PLAN WITH TODO LISTS

---

### ═══════════════════════════════════════
### PHASE 1 — FOUNDATION
### ═══════════════════════════════════════

TODO:
- [ ] `npm create svelte@latest gartenwoche-clone` (skeleton, TypeScript, ESLint, Prettier)
- [ ] Install: `tailwindcss @tailwindcss/vite @sveltejs/adapter-node zod sveltekit-superforms date-fns lucide-svelte`
- [ ] `vite.config.ts`: add `@tailwindcss/vite` + `sveltekit` plugins
- [ ] `svelte.config.js`: adapter-node + aliases ($components, $stores, $types, $lib/api, $utils)
- [ ] Create full folder tree (all dirs from architecture)
- [ ] `src/app.html`: lang="de", Google Fonts preconnect + link (Roboto+OpenSans+Lora)
- [ ] `src/app.css`: all :root CSS vars + global resets + .container + .cat-badge + .pro-badge + scrollbar
- [ ] `src/lib/types/`: article.ts, category.ts, author.ts, event.ts, directory.ts, user.ts, index.ts
- [ ] `src/lib/api/cache.ts`: TTL Map cache
- [ ] `src/lib/api/wordpress.ts`: fetch all WP REST endpoints + data transformations + pagination
- [ ] `src/lib/api/fallback.ts`: hardcoded fallback for 24 confirmed articles
- [ ] `src/lib/api/index.ts`: exported helper functions
- [ ] `src/lib/stores/`: modal.store.ts, auth.store.ts, weather.store.ts, search.store.ts
- [ ] `src/lib/utils/date.ts`: German date formatting with date-fns
- [ ] `.env`: placeholder vars
- [ ] Run `npm run check` → 0 errors

---

### ═══════════════════════════════════════
### PHASE 2 — LAYOUT SHELL
### ═══════════════════════════════════════

TODO:
- [ ] `TopBar.svelte`: purple 36px, 12 quick-links left, Anmelden/Beitreten right
- [ ] `Logo.svelte`: "Gartenwoche" italic serif + "DAS UNABHÄNGIGE GARTENMAGAZIN" tagline
- [ ] `WeatherWidget.svelte`: thermometer icon + temp + city
- [ ] `SocialIcons.svelte`: FB + IG + X SVG icons
- [ ] `HeaderMain.svelte`: Logo | weather+date center | social+MeinKonto right
- [ ] `MegaMenu.svelte`: dropdown panel with opacity+translateY transition
- [ ] `NavPrimary.svelte`: sticky, 7 items, Pflanzen+Aktuelles dropdowns, search icon, hamburger mobile
- [ ] `Breadcrumb.svelte`: Start > Category > Title
- [ ] `Footer.svelte`: 3-col purple footer + AWIN banner + copyright
- [ ] `FooterCTA.svelte`: gray strip + "Hier registrieren" button
- [ ] `LoginModal.svelte`: overlay, 3 tabs, ESC close, focus trap, aria-modal
- [ ] `SearchBar.svelte`: full-screen dark overlay, debounced input, real-time results
- [ ] `src/routes/+layout.server.ts`: fetch weather
- [ ] `src/routes/+layout.svelte`: compose all layout components, bind stores
- [ ] `src/routes/api/weather/+server.ts`: OWM proxy
- [ ] `src/routes/api/search/+server.ts`: search endpoint
- [ ] `src/routes/+error.svelte`: German 404 page (purple 404, "Seite nicht gefunden", back buttons)
- [ ] Run `npm run dev` → header+footer render on every route

---

### ═══════════════════════════════════════
### PHASE 3 — HOMEPAGE
### ═══════════════════════════════════════

TODO:
- [ ] `CategoryBadge.svelte`: yellow badge (#F7C900) purple text, Roboto 11px 700 uppercase
- [ ] `AuthorMeta.svelte`: "Von [author] · [German date]"
- [ ] `ArticleCard.svelte`: 16:9 image, badge, title (Roboto 700 16px), author+date, hover shadow
- [ ] `ArticleCardLarge.svelte`: bigger image, 22px title, excerpt
- [ ] `ArticleCardSmall.svelte`: 80x80px thumb left + text right, 2-line title clamp
- [ ] `ArticleCarousel.svelte`: horizontal scroll, prev/next arrows, snap
- [ ] `HeroSpotlight.svelte`: large image + gradient overlay + title + badge (Section 1)
- [ ] `FeaturedGrid.svelte`: 4-col CSS grid (Section 2)
- [ ] `PflanzenStrip.svelte`: heading + ArticleCarousel (Section 3)
- [ ] `RasenGartenBlock.svelte`: 60/40 split (Section 4)
- [ ] `VideoBlock.svelte`: Vimeo iframe embed + caption (Section 5) — use video/106571242
- [ ] `MixedArticleBlock.svelte`: 3-col Gartenpraxis/Wissen/Europa (Section 6)
- [ ] `RotatingCarousel.svelte`: auto-play 5s, dots, arrows (Section 7)
- [ ] `ProductSidebar.svelte`: 5 Produktschau cards stacked (Section 8)
- [ ] `ThreeColBlock.svelte`: Pflanzenschutz/Produktschau/Rasen (Section 9)
- [ ] `DirectoryLogos.svelte`: 8 logo strip (Section 10)
- [ ] `EventsWidget.svelte`: date badge + event card (Section 11)
- [ ] `src/routes/+page.server.ts`: load all 11 sections from WP API
- [ ] `src/routes/+page.svelte`: compose all sections in exact order
- [ ] Verify: all images load (real WP thumbnails), video plays, carousel auto-plays

---

### ═══════════════════════════════════════
### PHASE 4 — ARTICLE + CATEGORY PAGES
### ═══════════════════════════════════════

TODO:
- [ ] `ArticleBody.svelte`: {@html content} with full prose CSS
- [ ] `ProBadge.svelte`: "PRO" yellow badge
- [ ] `Pagination.svelte`: prev/next + page numbers
- [ ] `src/routes/[...path]/+page.server.ts`:
      - Extract slug from path (last segment)
      - Try getArticleBySlug(slug) first
      - If found → return article data
      - If not found → try getCategoryBySlug → return category archive
      - If neither → throw error(404)
- [ ] `src/routes/[...path]/+page.svelte`:
      - If data.type === 'article' → render article layout (70/30 + sidebar)
      - If data.type === 'category' → render category layout (featured block + sidebar)
- [ ] Category page featured block:
      - 3+ articles: Article 1 large left + Articles 2-3 small right stack
      - 1-2 articles: regular grid
- [ ] "Weitere Artikel" sidebar: 5 recent articles from any category
- [ ] Article page: breadcrumb + Lora h1 + author + date + full image + ArticleBody + tags + social share
- [ ] Related articles section: 4 cards same category at bottom
- [ ] `src/routes/category/[...slug]/+page.svelte`: redirect to same layout
- [ ] Test ALL 24 confirmed article URLs — must load with real content + images
- [ ] Test ALL category pages: gartenpraxis, pflanzen, stauden, sommerflor, rosen, 
      pflanzenempfehlungen, wasserpflanzen, pflanzenschutz, rasen, wissen,
      aktuelles, schweiz, europa, welt, gartentechnik, produktschau

---

### ═══════════════════════════════════════
### PHASE 5 — ALL OTHER PAGES + FINAL QA
### ═══════════════════════════════════════

TODO:
- [ ] `src/routes/veranstaltungen/+page.svelte`: events list + calendar toggle
- [ ] `src/routes/veranstaltung/[slug]/+page.svelte`: single event + CalendarExport
- [ ] `src/routes/branchenverzeichnis/+page.svelte`: 8 DirectoryCards in grid
- [ ] `src/routes/branchenverzeichnis/eintrag/[slug]/+page.svelte`: single company
- [ ] `src/routes/author/[slug]/+page.svelte`: author profile + article grid
- [ ] `src/routes/search/+page.svelte`: search results with term highlight
- [ ] `src/routes/mein-konto/+page.svelte`: account page (protected)
- [ ] `src/routes/impressum/+page.svelte`: company info (Gartenmedien Ltd.)
- [ ] `src/routes/datenschutzerklaerung/+page.svelte`: GDPR/DSG policy
- [ ] `src/routes/allgemeine-geschaeftsbedingungen/+page.svelte`: T&C
- [ ] `src/routes/abonnement/+page.svelte`: Free vs PRO comparison
- [ ] `src/routes/schreiben-sie-uns/+page.svelte`: contact form (Superforms+Zod)
- [ ] `src/routes/podcast-garten/+page.svelte`: HTML5 audio players for 7 episodes
- [ ] `src/routes/stellenangebote-fuer-die-gruene-branche/+page.svelte`: job listings
- [ ] `src/routes/api/auth/login/+server.ts`
- [ ] `src/routes/api/auth/register/+server.ts`
- [ ] `src/routes/api/auth/logout/+server.ts`
- [ ] `src/lib/utils/seo.ts`: meta tag generator
- [ ] `src/routes/sitemap.xml/+server.ts`: dynamic sitemap
- [ ] `src/routes/robots.txt/+server.ts`
- [ ] `src/hooks.server.ts`: security headers + rate limiting
- [ ] CSS polish: card hover transitions, hamburger menu, sticky nav logo, lazy loading
- [ ] Responsive QA: 375px / 768px / 1200px
- [ ] `npm run check` → 0 TypeScript errors
- [ ] `npm run lint` → 0 ESLint errors
- [ ] `npm run build` → successful build
- [ ] Smoke test: all routes load, images display, video plays, login modal works

---

## SINGLE MASTER PROMPT (paste this to your LLM)

```
You are rebuilding the Gartenwoche SvelteKit clone from scratch. The previous 
build had critical failures: wrong fonts, wrong colors, missing images, wrong 
layouts, and many pages were incomplete. This time you will build it correctly.

== RULES ==
1. Read GARTENWOCHE_MASTER_PROMPT.md completely before writing any code
2. Build in exactly 5 phases using the TODO lists provided
3. After each phase: show a ✅ checklist of completed items, then STOP and wait
4. Do NOT proceed to next phase until I say "start phase X"
5. Output every file completely — no placeholders, no "// TODO" comments
6. Every image must use real WP API thumbnail URLs — never placeholder.jpg
7. Layout components use pure CSS + CSS variables (no Tailwind utility classes)
8. Tailwind only for non-layout utility classes (margins, padding helpers)

== CRITICAL FIXES FROM PREVIOUS BUILD ==
- Fonts: Roboto (headings) + Open Sans (body) + Lora (article h1 only)
  NOT Barlow Condensed, NOT Verdana as primary
- Colors: --color-accent is #F7C900 NOT #FFD700
- Max-width: 1200px NOT 1280px  
- Video: Vimeo iframe https://player.vimeo.com/video/106571242
- Category page: featured block (1 large + 2 small) + "Weitere Artikel" sidebar
- Article URLs: use post.link from WP API to extract real path
- Podcast page: HTML5 <audio> players, not fake episode cards
- Fetch ALL pages of WP API (paginate until X-WP-TotalPages reached)

== DATA SOURCE ==
WordPress REST API (server-side only):
  Posts:      https://gartenwoche.ch/wp-json/wp/v2/posts?per_page=100&_embed&page=N
  Categories: https://gartenwoche.ch/wp-json/wp/v2/categories?per_page=100
  Authors:    https://gartenwoche.ch/wp-json/wp/v2/users?per_page=100
  Events:     https://gartenwoche.ch/wp-json/tribe/v1/events (return [] if 404)

Image URLs: post._embedded['wp:featuredmedia'][0].source_url
Article path: new URL(post.link).pathname

== START ==
Show me the Phase 1 TODO checklist, confirm you understand all requirements, 
then begin Phase 1.
```