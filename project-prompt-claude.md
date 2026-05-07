# MASTER AI PROMPT — Gartenwoche SvelteKit Clone
> Copy-paste these prompts into Claude / Cursor / Windsurf / GitHub Copilot to build every part.
> Use them in exact order. Each prompt builds on the previous one.

---

## HOW TO USE THIS FILE

1. Open your AI coding assistant (Claude Code, Cursor, Windsurf, etc.)
2. Start at PROMPT 01 and go in order
3. After each prompt, verify the output works before moving to the next
4. Do NOT skip prompts — each one depends on the previous
5. Paste the full prompt text including all context

---

## ══════════════════════════════════════════
## PROMPT 01 — PROJECT SCAFFOLD + PACKAGES
## ══════════════════════════════════════════

```
You are building an exact pixel-perfect clone of the Swiss gardening website gartenwoche.ch using SvelteKit 2 with Svelte 5, TypeScript, and TailwindCSS v4.

Set up the project from scratch:

1. Initialize a SvelteKit project (skeleton, TypeScript, ESLint, Prettier, Vitest)
2. Install these exact packages:
   - tailwindcss @tailwindcss/vite (TailwindCSS v4)
   - @sveltejs/adapter-node
   - zod sveltekit-superforms
   - date-fns
   - marked @types/marked
   - lucide-svelte

3. Configure vite.config.ts:
   - Add @tailwindcss/vite plugin
   - Add sveltekit plugin

4. Configure svelte.config.js:
   - Use adapter-node
   - Add these path aliases:
     $components → ./src/lib/components
     $stores → ./src/lib/stores
     $types → ./src/lib/types
     $data → ./src/lib/data
     $utils → ./src/lib/utils

5. Create this complete folder structure:
   src/lib/components/layout/
   src/lib/components/ui/
   src/lib/components/articles/
   src/lib/components/blocks/
   src/lib/components/directory/
   src/lib/components/events/
   src/lib/data/
   src/lib/stores/
   src/lib/types/
   src/lib/utils/
   static/images/
   static/fonts/

6. Create .env with:
   WEATHER_API_KEY=placeholder_key
   PUBLIC_SITE_URL=http://localhost:5173

Run npm run dev and confirm it starts without errors. Output the complete package.json and all config files.
```

---

## ══════════════════════════════════════════
## PROMPT 02 — GLOBAL CSS + DESIGN SYSTEM
## ══════════════════════════════════════════

```
We are cloning gartenwoche.ch (Swiss gardening magazine). The original uses the Newspaper "Pulses PRO" theme by TagDiv.

Design system to implement exactly:

FONTS (load via Google Fonts):
- Roboto: weights 400, 500, 700, 800, 900 → headlines, nav, labels, UI
- Open Sans: weights 400, 600, 700 → body text, excerpts
- Lora: weight 700 → serif editorial article titles
- Fallback: Verdana, Geneva, sans-serif

COLORS:
- --color-primary: #2D1B69 (dark purple — top bar bg, footer bg, buttons, accents)
- --color-primary-hover: #4a0e4e (deeper purple on hover)
- --color-accent: #F7C900 (intense yellow — category badges, CTAs)
- --color-bg: #F7F7F7 (page background)
- --color-surface: #FFFFFF (cards, header)
- --color-text: #222222 (primary body text)
- --color-text-muted: #555555 (author names, dates, secondary text)
- --color-text-faint: #999999 (placeholders, disabled)
- --color-border: #E0E0E0 (card borders, dividers)
- --color-tag-bg: #FFF9D6 (light yellow, tag backgrounds)
- --color-tag-text: #2D1B69 (purple, tag text)

SPACING:
- --header-height: 60px
- --topbar-height: 36px
- --max-width: 1200px
- --sidebar-width: 300px
- --gap: 20px

Now do:
1. Rewrite app.html with Google Fonts preconnect + stylesheet link (Roboto, Open Sans, Lora), lang="de"
2. Rewrite app.css with:
   - @import tailwindcss
   - All CSS custom properties above in :root
   - Global resets: body, h1-h6, a, img, p
   - Body: font-family var(--font-body), background var(--color-bg), color var(--color-text)
   - p tag: font-family Verdana, Geneva, sans-serif (exact original fallback)
   - .container: max-width 1200px, margin 0 auto, padding 0 20px
   - .cat-badge: yellow bg (#F7C900), purple text, Roboto 11px 700, uppercase, letter-spacing 0.06em, padding 3px 8px, border-radius 2px
   - .pro-badge: same colors, 10px 900 weight, padding 2px 6px
   - .section-heading: Roboto 18px 700, dark text, with yellow underline accent
   - Global link hover color: var(--color-primary)
   - Smooth transitions on a: color 0.2s ease
   - font-display: swap on @font-face

Output the complete app.html and app.css files.
```

---

## ══════════════════════════════════════════
## PROMPT 03 — TYPE DEFINITIONS
## ══════════════════════════════════════════

```
Create all TypeScript type definition files for the Gartenwoche clone in src/lib/types/:

FILE: article.ts
interface ArticlePreview {
  id: string; slug: string; title: string; excerpt: string;
  category: Category; subCategory?: Category; author: Author;
  publishedAt: Date; thumbnail: string; isPro: boolean;
}
interface Article extends ArticlePreview {
  content: string; // HTML
  tags: string[];
  updatedAt: Date;
  commentCount: number;
}

FILE: category.ts
interface Category {
  id: string; name: string; slug: string; parent?: string; count: number;
}

FILE: author.ts
interface Author {
  id: string; name: string; slug: string; avatar?: string; bio?: string;
  articleCount?: number;
}

FILE: event.ts
interface GartenEvent {
  id: string; slug: string; title: string; description: string;
  startDate: Date; endDate: Date; location: string; city: string;
  country: string; thumbnail: string; organizer?: string; websiteUrl?: string;
}

FILE: directory.ts
interface DirectoryEntry {
  id: string; slug: string; name: string; logo: string; description: string;
  address: string; phone?: string; email?: string; website?: string; category: string;
}

FILE: user.ts
interface User {
  id: string; username: string; email: string;
  tier: 'free' | 'pro'; createdAt: Date;
}

Export all interfaces from each file and create a barrel src/lib/types/index.ts.
```

---

## ══════════════════════════════════════════
## PROMPT 04 — MOCK DATA SEED
## ══════════════════════════════════════════

```
Create all mock data files for the Gartenwoche clone. This is a Swiss German gardening magazine. All content must be in German.

FILE: src/lib/data/authors.ts
Seed these exact 4 authors:
1. id: "1", name: "News-Redaktion", slug: "redaktion-aktuelles", bio: "Die Redaktion für aktuelle Gartennachrichten"
2. id: "2", name: "Redaktion Wissen", slug: "redaktion-wissen", bio: "Fachwissen rund um den Garten"
3. id: "3", name: "Redaktion Gartenpraxis", slug: "redaktion-gartenpraxis", bio: "Praxistipps für Gartenfreunde"
4. id: "4", name: "Peter Sturm", slug: "stemalo", bio: "Chefredakteur und Gründer von Gartenwoche"

FILE: src/lib/data/categories.ts
Seed all 16 categories with correct slugs, German names, and parent relationships:
gartenpraxis, pflanzen, stauden (parent: pflanzen), sommerflor (parent: pflanzen),
rosen (parent: pflanzen), pflanzenempfehlungen (parent: pflanzen),
wasserpflanzen (parent: pflanzen), pflanzenschutz, rasen, wissen,
aktuelles, schweiz (parent: aktuelles), europa (parent: aktuelles),
welt (parent: aktuelles), gartentechnik, produktschau

FILE: src/lib/data/articles.ts
Seed these 20 real articles (real slugs, German titles, 3-paragraph German content each):
1. slug: "nuesslisalat-ganzjaehriger-vitaminchampion", category: schweiz, title: "Nüsslisalat – ganzjähriger Vitaminchampion"
2. slug: "kress-voyager-hohe-maehleistung-fuer-profis", category: produktschau, title: "Kress Voyager – hohe Mähleistung für Profis"
3. slug: "biohybride-pflanzen-unibz", category: wissen, title: "Biohybride Pflanzen: Uni Bozen entwickelt Superpflanzen"
4. slug: "zwitschern-laesst-sich-pflanzen", category: gartenpraxis, title: "So pflanzen Sie für die Vogelwelt"
5. slug: "neue-hortensie-runaway-bride", category: pflanzenempfehlungen, title: "Neue Hortensie: Runaway Bride"
6. slug: "der-steppensalbei-salvia-nemorosa", category: stauden, title: "Der Steppensalbei (Salvia nemorosa) – die besten Sorten"
7. slug: "alternative-zur-lorbeerkirsche", category: pflanzenempfehlungen, title: "Alternative zur Lorbeerkirsche: Der glänzende Liguster"
8. slug: "hirse-im-rasen", category: rasen, title: "Hirse im Rasen – erkennen und bekämpfen"
9. slug: "lebende-alternative-zum-sonnenschirm", category: gartenpraxis, title: "Lebende Alternative zum Sonnenschirm"
10. slug: "die-maulwurfsgrille-oder-werre", category: pflanzenschutz, title: "Die Maulwurfsgrille oder Werre"
11. slug: "hydro-mousse-spruehen-fertig-rasen", category: produktschau, title: "Hydro-Mousse: Sprühen, fertig, Rasen"
12. slug: "mit-gartenpalmen-den-spaetsommer-geniessen", category: pflanzenempfehlungen, title: "Mit Gartenpalmen den Spätsommer geniessen"
13. slug: "der-schwarze-diamant-apfel-tibet", category: welt, title: "Der schwarze Diamant – ein ungewöhnlicher Apfel aus Tibet"
14. slug: "was-blueht-da-am-wegesrand", category: wissen, title: "Was blüht da am Wegesrand?"
15. slug: "von-der-strasse-auf-den-teller-salat", category: europa, title: "Salat nimmt giftige Zusatzstoffe aus Reifenabrieb auf"
16. slug: "blumeninseln-im-gruenen-rasenmeer", category: gartenpraxis, title: "Blumeninseln im grünen Rasenmeer"
17. slug: "natuerlichkeit-und-handwerkskunst", category: schweiz, title: "Natürlichkeit und Handwerkskunst im Hier und Jetzt"
18. slug: "seerosen-in-kleinen-gefaessen", category: wasserpflanzen, title: "Seerosen in kleinen Gefässen"
19. slug: "cornus-kuosa-scarlet-fire", category: pflanzenempfehlungen, title: "Cornus 'Scarlet Fire' – der Blumenhartriegel"
20. slug: "zeitliche-veraenderungen-laubfall", category: schweiz, title: "Zeitliche Veränderungen im Laubfall haben Folgen für Flohkrebse"

For each article write realistic 3-paragraph German content. Set isPro: true for articles 5, 11, 15.

FILE: src/lib/data/events.ts
Seed 2 events:
1. RHS Chelsea Flower Show, 19-23 Mai 2026, London, UK
2. Wyss Gartenakademie, Gartenhaus Zuchwil, Switzerland

FILE: src/lib/data/directory.ts
Seed all 8 businesses:
pflanzenschau-ag-2, erni-gartenbau-ag-2, spross-ga-la-bau-ag-2, eibe-ag-2,
trend-und-blumenboerse-luzern-2, zebra-ag-garten-und-pool-2, gartenbijoux-2, il-vivaio-2

FILE: src/lib/data/index.ts
Export all data getter functions:
- getArticles(filter?: {category?: string, limit?: number, page?: number})
- getArticleBySlug(slug: string)
- getArticlesByCategory(categorySlug: string, limit?: number)
- getCategories(parentSlug?: string)
- getCategoryBySlug(slug: string)
- getEvents(filter?: {past?: boolean})
- getEventBySlug(slug: string)
- getDirectoryEntries()
- getDirectoryEntryBySlug(slug: string)
- getAuthorBySlug(slug: string)
- searchArticles(query: string)

Output all files completely.
```

---

## ══════════════════════════════════════════
## PROMPT 05 — STORES
## ══════════════════════════════════════════

```
Create all Svelte stores for the Gartenwoche clone:

FILE: src/lib/stores/modal.store.ts
- Writable store with { loginOpen: boolean, searchOpen: boolean, activeTab: 'login' | 'register' | 'recover' }
- Export functions: openLogin(), openRegister(), openRecover(), openSearch(), closeModal(), closeSearch()

FILE: src/lib/stores/auth.store.ts
- Writable store with { user: User | null, loading: boolean }
- Export: setUser(user), clearUser(), setLoading(v)

FILE: src/lib/stores/weather.store.ts
- Writable store with { temp: number | null, city: string, loading: boolean }
- Export: setWeather(temp, city)

FILE: src/lib/stores/search.store.ts
- Writable store with { query: string, results: ArticlePreview[], loading: boolean }
- Export: setQuery(q), setResults(r), clearSearch()

All stores must be typed. Import types from $types/index.ts.
```

---

## ══════════════════════════════════════════
## PROMPT 06 — LAYOUT COMPONENTS (TopBar + Header + Nav)
## ══════════════════════════════════════════

```
Build these 3 layout components for the Gartenwoche clone. Match the exact structure of the original site.

COMPONENT 1: src/lib/components/layout/TopBar.svelte
- Background: #2D1B69 (dark purple), height: 36px
- Left side: horizontal scrollable nav with these exact 12 links in German:
  "Aktuelles" → /category/aktuelles
  "Schweiz" → /category/aktuelles/schweiz
  "Europa" → /category/aktuelles/europa
  "Welt" → /category/aktuelles/welt
  "Produktschau" → /category/produktschau
  "Wissen" → /category/wissen
  "Gartenpraxis" → /category/gartenpraxis
  "Pflanzenschutz" → /category/pflanzenschutz
  "Pflanzenempfehlungen" → /category/pflanzen/pflanzenempfehlungen
  "Stauden" → /category/pflanzen/stauden
  "Veranstaltungen" → /veranstaltungen
  "Stellenangebote für die grüne Branche" → /stellenangebote-fuer-die-gruene-branche
- Right side: "Anmelden" and "Beitreten" buttons that open the login modal
- Font: Roboto 12px, white text, yellow on hover (#F7C900)
- Mobile: hide all quick-links, keep only auth buttons

COMPONENT 2: src/lib/components/layout/HeaderMain.svelte
Props: weather: { temp: number | null, city: string }
- White background
- Container max-width 1200px
- Left: Logo (gartenwoche text logo or SVG)
- Center: current date in German format (e.g. "Donnerstag, 07. Mai 2026") + weather "10.7°C Zürich"
- Right: social icons (Facebook, Instagram, X) + "Mein Konto" button → /mein-konto
- Height: ~80px
- Use SvelteKit's page store for current date

COMPONENT 3: src/lib/components/layout/NavPrimary.svelte
- White background, 1px bottom border (#E0E0E0)
- position: sticky, top: 0, z-index: 100
- Container max-width 1200px
- Left: compact logo (hidden until scrolled)
- Center: these nav items with dropdown support:
  "Gartenpraxis" → /category/gartenpraxis
  "Pflanzen ▾" → dropdown: Stauden, Sommerflor, Rosen, Pflanzenempfehlungen, Pflanzenschutz
  "Rasen" → /category/rasen
  "Wissen" → /category/wissen
  "Aktuelles ▾" → dropdown: Schweiz, Europa, Welt
  "Gartentechnik" → /category/gartentechnik
  "Podcast Garten" → /podcast-garten
- Right: search icon button that opens search overlay
- Font: Roboto 14px bold
- Active link: purple color
- Hover: purple color
- Dropdowns: white card, absolute position, smooth opacity transition
- Mobile: hamburger menu button, slide-in sidebar panel

Include all scoped CSS inside each component's <style> block.
Do NOT use Tailwind for these components — use pure CSS with CSS variables.
```

---

## ══════════════════════════════════════════
## PROMPT 07 — FOOTER COMPONENTS
## ══════════════════════════════════════════

```
Build the footer for the Gartenwoche clone (gartenwoche.ch).

COMPONENT 1: src/lib/components/layout/FooterCTA.svelte
- Light gray background (#F7F7F7)
- Centered text: "Dieser Blog ist unabhängig und wird privat betrieben. Wenn Ihnen die Inhalte gefallen, unterstützen Sie uns durch eine kostenlose Registrierung."
- Below text: large button "Hier registrieren" in purple (#2D1B69) that opens the register modal tab
- Padding: 32px top and bottom

COMPONENT 2: src/lib/components/layout/Footer.svelte
- Background: #2D1B69 (dark purple)
- Padding: 40px top, 24px bottom
- 3-column layout:
  Col 1 (left): Logo in white + "PRO" yellow badge beside it. Description: "Das unabhängige Gartenmagazin für die Schweiz"
  Col 2 (center, heading "Pro Links"):
    - Branchenverzeichnis → /branchenverzeichnis
    - Stellenangebote für die grüne Branche → /stellenangebote-fuer-die-gruene-branche
    - Veranstaltungen → /veranstaltungen
  Col 3 (right, heading "Rechtliches"):
    - Datenschutzerklärung → /datenschutzerklaerung
    - Allgemeine Geschäftsbedingungen → /allgemeine-geschaeftsbedingungen
    - Abonnement → /abonnement
    - Impressum → /impressum
    - Schreiben Sie uns → /schreiben-sie-uns
- Below columns: centered AWIN affiliate banner div (300x250 placeholder with gray bg)
  URL: https://www.awin1.com/cread.php?s=2436107&v=15934&q=368245&r=602261
- Bottom bar:
  - "© 2025 Gartenwoche. Alle Rechte vorbehalten."
  - Font: Open Sans 13px, white/light gray text
  - Links: white, yellow on hover

All text is white or rgba(255,255,255,0.8). Use CSS variables throughout.
Responsive: stack columns on mobile.
```

---

## ══════════════════════════════════════════
## PROMPT 08 — ROOT LAYOUT + LAYOUT.SERVER
## ══════════════════════════════════════════

```
Build the root layout for the Gartenwoche SvelteKit clone.

FILE: src/routes/+layout.server.ts
- Fetch weather data from /api/weather endpoint (or use mock { temp: 10.7, city: 'Zürich' } as fallback)
- Return: { weather: { temp: number, city: string } }

FILE: src/routes/+layout.svelte
- Import app.css
- Import all layout components: TopBar, HeaderMain, NavPrimary, FooterCTA, Footer
- Import LoginModal and SearchBar from $components/ui/
- Import modalStore from $stores/modal.store.ts
- Receive data prop from layout server (data.weather)
- Render order:
  <LoginModal bind:open={$modalStore.loginOpen} activeTab={$modalStore.activeTab} />
  <SearchBar bind:open={$modalStore.searchOpen} />
  <TopBar />
  <HeaderMain weather={data.weather} />
  <NavPrimary />
  <main id="main-content">
    {@render children()}
  </main>
  <FooterCTA />
  <Footer />
- Add skip to main content link at very top (accessibility)
- Use Svelte 5 runes syntax ($props(), $state(), etc.)

FILE: src/routes/api/weather/+server.ts
- GET handler
- Fetch from OpenWeatherMap: https://api.openweathermap.org/data/2.5/weather?q=Zurich&appid={WEATHER_API_KEY}&units=metric
- Return JSON: { temp: number, city: 'Zürich' }
- On error: return fallback { temp: null, city: 'Zürich' }
```

---

## ══════════════════════════════════════════
## PROMPT 09 — LOGIN MODAL
## ══════════════════════════════════════════

```
Build the LoginModal component for the Gartenwoche clone. This modal appears as an overlay — not a separate page.

FILE: src/lib/components/ui/LoginModal.svelte

Props:
- open: boolean (controls visibility)
- activeTab: 'login' | 'register' | 'recover' (default: 'login')

Structure:
- Fixed overlay: full screen, dark semi-transparent background (rgba(0,0,0,0.5))
- Centered white card: max-width 420px, border-radius 8px, padding 32px
- Close button (×) at top-right corner

TAB 1 — ANMELDEN (Login):
- H2: "Herzlich willkommen!"
- P: "Melde dich in deinem Konto an"
- Input: "Benutzername" (text, with label)
- Input: "Passwort" (password, with label)
- "Passwort vergessen?" link (right-aligned, small gray) → switches activeTab to 'recover'
- Button: "Anmelden" (full-width, background #2D1B69, white text, 44px height, border-radius 4px)
- Divider: horizontal line with "oder" in center
- "Noch kein Konto? Ein Konto erstellen" → switches activeTab to 'register'
- Footer note: small text with link to /datenschutzerklaerung

TAB 2 — REGISTRIEREN (Register):
- H2: "Herzlich willkommen!"
- P: "Registrieren Sie sich für ein Konto"
- Input: "E-Mail-Adresse" (email)
- Input: "Benutzername" (text)
- P small: "Ein Passwort wird Ihnen per Email zugeschickt."
- Button: "Registrieren" (full-width, same purple style)
- Footer note with Datenschutzerklärung link

TAB 3 — PASSWORT VERGESSEN (Recover):
- H2: "Passwort zurücksetzen"
- P: "Geben Sie Ihre E-Mail-Adresse ein"
- Input: "E-Mail-Adresse" (email)
- Button: "Link senden" (full-width, purple)
- "Zurück zum Anmelden" link → switches to 'login'

Behavior:
- ESC key closes modal
- Click overlay closes modal
- Focus first input when opened
- Smooth transition: opacity + scale from 0.95 to 1
- Use Svelte 5 runes: $props(), $state(), $effect()
- Add aria-modal="true", role="dialog", aria-labelledby

All labels and text in German.
```

---

## ══════════════════════════════════════════
## PROMPT 10 — SEARCH OVERLAY
## ══════════════════════════════════════════

```
Build the search overlay component for the Gartenwoche clone.

FILE: src/lib/components/ui/SearchBar.svelte
Props: open: boolean

- Full-screen overlay (position: fixed, z-index: 200)
- Dark background (rgba(0,0,0,0.9))
- Centered content area (top 20%, max-width 700px)
- Large search input: font-size 24px, white text on transparent bg, bottom border only (white 2px)
- Placeholder text: "Suchen..." (German)
- X close button top-right
- Below input: results list (max 6 items)
  - Each result: thumbnail (50px) + category badge + title → link to article
  - Highlight query match in title (bold)
- Shows "Keine Ergebnisse gefunden" if empty results

Behavior:
- ESC key closes
- Debounce input 300ms
- On input change: fetch /api/search?q={query}
- On Enter: navigate to /search?q={query}
- Loading spinner while fetching

FILE: src/routes/api/search/+server.ts
- GET endpoint
- Param: q (string)
- Import searchArticles() from $data
- Return JSON array of ArticlePreview (max 6)
- Filter by title + excerpt containing query (case-insensitive)
```

---

## ══════════════════════════════════════════
## PROMPT 11 — ARTICLE CARD COMPONENTS
## ══════════════════════════════════════════

```
Build the core article card components for the Gartenwoche clone.

COMPONENT 1: src/lib/components/ui/CategoryBadge.svelte
Props: category: Category
- Renders .cat-badge span with category.name
- Background: #F7C900, color: #2D1B69, Roboto 11px 700, uppercase, no-wrap

COMPONENT 2: src/lib/components/ui/AuthorMeta.svelte
Props: author: Author, publishedAt: Date
- "Von [author.name] · [formatted date in German]"
- Font: Open Sans 12px, color #555555
- Author name links to /author/[author.slug]
- Use formatGermanDate() from $utils/date.ts

COMPONENT 3: src/lib/components/articles/ArticleCard.svelte
Props: article: ArticlePreview
- White card, border 1px #E0E0E0, border-radius 6px, overflow hidden
- Thumbnail: 100% width, 56.25% padding-bottom (16:9), object-cover
  If article.thumbnail empty: gray placeholder (#E0E0E0 bg)
  loading="lazy"
- Body padding: 12px
- CategoryBadge component
- Title: Roboto 16px 700, color #222, link to article URL, hover color #2D1B69
  Line-clamp: 3 lines
- AuthorMeta component
- Hover entire card: box-shadow 0 4px 16px rgba(0,0,0,0.12)
- Article URL: /[category.slug]/[article.slug] (or /[parent.slug]/[category.slug]/[article.slug] for subcategories)

COMPONENT 4: src/lib/components/articles/ArticleCardLarge.svelte
Props: article: ArticlePreview
- Same as ArticleCard but image is 60% of height
- Title: Roboto 22px 800, 4-line clamp
- Excerpt: first 120 chars, Open Sans 14px gray

COMPONENT 5: src/lib/components/articles/ArticleCardSmall.svelte
Props: article: ArticlePreview
- Horizontal layout: 80px thumbnail left + text right
- Thumbnail: 80x80px square, object-cover
- Title: Roboto 13px 700, 2-line clamp
- Date: 11px gray
- No category badge on this variant

COMPONENT 6: src/lib/components/articles/ArticleCarousel.svelte
Props: articles: ArticlePreview[], title?: string, linkAll?: string
- Section heading (title prop) with "Mehr Artikel →" link (linkAll prop)
- Horizontal scroll container (overflow-x: auto, scroll-snap-type: x mandatory)
- ArticleCard per item, min-width 280px, scroll-snap-align: start
- Prev/Next arrow buttons (absolutely positioned, purple bg, white arrow icon)
- Gap: 16px between cards
- Hide scrollbar (scrollbar-width: none)
```

---

## ══════════════════════════════════════════
## PROMPT 12 — HOMEPAGE BLOCKS (Sections 1-7)
## ══════════════════════════════════════════

```
Build the homepage block components for the Gartenwoche clone. These make up sections 1-7 of the homepage.

SECTION 1 — src/lib/components/blocks/HeroSpotlight.svelte
Props: article: ArticlePreview
- Full-width container (max-width 1200px)
- Large image: height 500px on desktop, 280px mobile, object-cover, border-radius 0
- Bottom gradient overlay: linear-gradient(transparent, rgba(0,0,0,0.8))
- Over image (positioned absolutely bottom-left, padding 24px):
  - CategoryBadge
  - H1: Roboto 36px 900, white, line-clamp 3, max-width 70%
  - AuthorMeta (white text)
- Entire block is a link to article
- Hover: image scale 1.02 transition 0.3s

SECTION 2 — src/lib/components/blocks/FeaturedGrid.svelte
Props: articles: ArticlePreview[] (expects 4)
- Section wrapper, margin-top 24px
- CSS grid: 4 columns desktop, 2 tablet, 1 mobile
- Gap: 20px
- ArticleCard for each

SECTION 3 — src/lib/components/blocks/PflanzenStrip.svelte
Props: articles: ArticlePreview[]
- Section heading: "Pflanzenempfehlungen" with link to /category/pflanzen/pflanzenempfehlungen
- ArticleCarousel with passed articles (5 items)

SECTION 4 — src/lib/components/blocks/RasenGartenBlock.svelte
Props: rasenArticles: ArticlePreview[], gartenpraxisArticles: ArticlePreview[]
- 2-column layout: 60% / 40%
- Left: ArticleCardLarge for first rasenArticle
- Right: heading "Gartenpraxis" + vertical list of 3 ArticleCardSmall items

SECTION 5 — src/lib/components/blocks/VideoBlock.svelte
Props: videoUrl: string, caption: string
- Section heading: "Video der Woche"
- Responsive iframe: 100% width, 56.25% height ratio (padding-bottom trick), border-radius 6px
- Caption text below: Open Sans 14px gray
- Note: videoUrl is a YouTube embed URL

SECTION 6 — src/lib/components/blocks/MixedArticleBlock.svelte
Props: gartenpraxisArticles: ArticlePreview[], wissenArticles: ArticlePreview[], europaArticles: ArticlePreview[]
- 3-column equal layout (33.3% each), gap 20px
- Each column:
  - Sub-heading: category name in Roboto 16px bold + bottom border
  - 3 ArticleCardSmall stacked
  - "Mehr [category] →" link at bottom

SECTION 7 — src/lib/components/blocks/RotatingCarousel.svelte
Props: articles: ArticlePreview[] (2-5 articles)
- Full-width (100% of container)
- One article displayed at a time (same as HeroSpotlight style)
- Auto-advances every 5 seconds
- Pause auto-play on hover
- Dot indicators at bottom center
- Left/right arrow buttons
- Smooth fade or slide transition between articles
- Use $state and $effect (Svelte 5 runes)
```

---

## ══════════════════════════════════════════
## PROMPT 13 — HOMEPAGE BLOCKS (Sections 8-11) + COMPOSE
## ══════════════════════════════════════════

```
Build the remaining homepage block components and compose the full homepage.

SECTION 8 — src/lib/components/blocks/ProductSidebar.svelte
Props: articles: ArticlePreview[] (5 product articles from Produktschau)
- Heading: "Produktvorschläge"
- 5 vertical ArticleCardSmall items stacked
- Each card: 70x70px thumbnail + title + category badge
- "Zur Produktschau →" link at bottom

SECTION 9 — src/lib/components/blocks/ThreeColBlock.svelte
Props: pflanzenschutzArticles, produktschauArticles, rasenArticles (each: ArticlePreview[2])
- 3-column layout (equal widths)
- Same structure as MixedArticleBlock but for Pflanzenschutz / Produktschau / Rasen

SECTION 10 — src/lib/components/blocks/DirectoryLogos.svelte
Props: entries: DirectoryEntry[]
- Heading: "Branchenverzeichnis" + "Zum Verzeichnis →" link right side
- Horizontal scrollable logo strip
- Each entry: 120x80 white card with border 1px #E0E0E0, border-radius 4px
  - Logo img or placeholder with company initials
  - Company name below logo (11px, center)
  - Link to /branchenverzeichnis/eintrag/[entry.slug]
  - Hover: border-color #2D1B69
- Gap: 12px

SECTION 11 — src/lib/components/blocks/EventsWidget.svelte
Props: events: GartenEvent[]
- Heading: "Veranstaltungen" + "Alle Veranstaltungen →" link
- 2-3 upcoming events stacked vertically
- Each event:
  - Left: date badge (day number large, month short, purple bg white text)
  - Right: title (Roboto 14px bold) + location (gray 12px) + city, country
- "Mehr Veranstaltungen" link at bottom → /veranstaltungen

NOW compose the full homepage:

FILE: src/routes/+page.server.ts
Load all required data using data functions:
- heroArticle: getArticlesByCategory('all', 1)[0]
- featuredArticles: 4 recent mixed articles
- pflanzenArticles: 5 pflanzenempfehlungen articles
- rasenArticles: 2 rasen articles
- gartenpraxisArticles: 4 articles
- wissenArticles: 3 wissen articles
- europaArticles: 3 europa articles
- carouselArticles: 2 featured articles
- productArticles: 5 produktschau articles
- directoryEntries: getDirectoryEntries() (all 8)
- events: getEvents({ past: false })
- videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' (placeholder)
- videoCaption: 'Video der Woche – Fleischfressende Pflanzen in der Wildnis'

FILE: src/routes/+page.svelte
Import all 11 block components and render in this exact order:
1. HeroSpotlight (heroArticle)
2. FeaturedGrid (featuredArticles)
3. PflanzenStrip (pflanzenArticles)
4. RasenGartenBlock (rasenArticles, gartenpraxisArticles)
5. VideoBlock (videoUrl, videoCaption)
6. MixedArticleBlock (gartenpraxisArticles, wissenArticles, europaArticles)
7. RotatingCarousel (carouselArticles)
8-11: Two-column wrapper (2/3 main + 1/3 sidebar):
  Main: ThreeColBlock
  Sidebar: ProductSidebar + DirectoryLogos + EventsWidget

Use gap: 24px between all sections. Container max-width 1200px centered.
```

---

## ══════════════════════════════════════════
## PROMPT 14 — ARTICLE SINGLE PAGE
## ══════════════════════════════════════════

```
Build the single article page for the Gartenwoche clone.

FILE: src/routes/[category]/[slug]/+page.server.ts
- Load article by slug (getArticleBySlug(params.slug))
- Load related articles (same category, limit 4, exclude current)
- If not found: throw error(404, 'Artikel nicht gefunden')
- Return: { article, relatedArticles, directoryEntries, upcomingEvents }

Also handle 3-level routes: src/routes/[cat]/[subcat]/[slug]/+page.server.ts
(Same logic, just grab params.slug)

FILE: src/lib/components/articles/ArticleBody.svelte
Props: content: string (HTML)
- Renders {@html content} inside .prose wrapper
- Prose styles (scoped CSS):
  p: Open Sans 16px, line-height 1.8, color #222, margin-bottom 1.2em, font-family Verdana Geneva sans-serif
  h2: Roboto 24px 700, margin-top 2em
  h3: Roboto 20px 700
  img: width 100%, border-radius 4px, margin 1.5em 0
  blockquote: border-left 4px solid #F7C900, padding-left 1em, font-style italic, color #555
  a: color #2D1B69, underline
  ul, ol: Open Sans 16px, padding-left 1.5em

FILE: src/lib/components/layout/Breadcrumb.svelte
Props: crumbs: Array<{label: string, href?: string}>
- Renders: Start > Category > Article title
- Font: Open Sans 12px, color #555
- Links are gray, last item is darker (current page, no link)
- Separator: " > "

FILE: src/routes/[category]/[slug]/+page.svelte
Layout (70/30 split with sidebar on right):

Left column (70%):
- Breadcrumb (Start > category.name > article.title)
- CategoryBadge
- H1: article.title in font-family: 'Lora', Georgia, serif, 700, 32px
- AuthorMeta (author name → /author/[slug], date formatted German)
- Thumbnail: full-width, max-height 500px, object-cover, loading="eager"
- ArticleBody (article.content)
- Tags row (if article.tags.length): "Tags:" + tag pills (gray bg, border-radius 20px)
- Social share row: "Teilen:" + Facebook button + X button + copy link button

PRO content gate:
- If article.isPro AND user is not PRO:
  - Show only first 3 paragraphs
  - Blurred overlay beneath with: "🔒 Dieser Artikel ist nur für PRO-Mitglieder"
  - Button: "Jetzt PRO werden" → /abonnement

Right sidebar (30%):
- ProductSidebar
- DirectoryLogos
- EventsWidget
- AdBlock (AWIN placeholder 300x250)

Below full width:
- "Ähnliche Artikel" heading + 4-column ArticleCard grid (relatedArticles)
```

---

## ══════════════════════════════════════════
## PROMPT 15 — CATEGORY ARCHIVE PAGES
## ══════════════════════════════════════════

```
Build the category archive pages for the Gartenwoche clone.

FILE: src/routes/category/[...slug]/+page.server.ts
- Parse params.slug (array) to get category slug
- e.g. ['pflanzen', 'stauden'] → subcat = stauden, parent = pflanzen
- Get category data: getCategoryBySlug(lastSlug)
- Get articles: getArticlesByCategory(lastSlug, 12)
- Support pagination via url.searchParams.get('page')
- If category not found: throw error(404)
- Return: { category, articles, totalCount, page }

FILE: src/routes/category/[...slug]/+page.svelte
- Breadcrumb: Start > [parent category if exists] > [category name]
- Category heading: H1 Roboto 28px 900 + "(X Artikel)" count in muted gray
- If category has description: show it in italic gray below heading
- 2-column article grid (gap 20px), ArticleCard per item
  - Desktop: 2 columns
  - Tablet: 2 columns
  - Mobile: 1 column
- Right sidebar (same as article page: ProductSidebar + DirectoryLogos + EventsWidget)
- Pagination below grid:
  - "← Vorherige" | page numbers | "Nächste →"
  - Current page: purple bg, white text
  - Other pages: gray border button

Test these exact routes must resolve:
/category/gartenpraxis
/category/pflanzen
/category/pflanzen/stauden
/category/pflanzen/sommerflor
/category/pflanzen/rosen
/category/pflanzen/pflanzenempfehlungen
/category/pflanzen/wasserpflanzen
/category/pflanzenschutz
/category/rasen
/category/wissen
/category/aktuelles
/category/aktuelles/schweiz
/category/aktuelles/europa
/category/aktuelles/welt
/category/gartentechnik
/category/produktschau
```

---

## ══════════════════════════════════════════
## PROMPT 16 — EVENTS CALENDAR
## ══════════════════════════════════════════

```
Build the events calendar system for the Gartenwoche clone.

FILE: src/lib/components/events/EventCard.svelte
Props: event: GartenEvent
- Left: date badge block (square 64px, purple #2D1B69 bg, white text)
  Top half: day number (28px bold)
  Bottom half: short month in German (e.g. "Mai", "Jun") (12px)
- Right content:
  Title: Roboto 16px 700, links to /veranstaltung/[slug]
  Location: Open Sans 13px gray (city, country)
  Date range: formatted German (e.g. "19. – 23. Mai 2026")
- Card: white bg, border 1px #E0E0E0, border-radius 6px, padding 16px
- Hover: box-shadow lift

FILE: src/lib/components/events/CalendarExport.svelte
Props: event: GartenEvent
- 4 small buttons in a row:
  "zu Google Kalender hinzufügen" → external Google Cal URL
  "iCalendar" → /api/events/[slug]/ical
  "Outlook 365" → Outlook web URL
  "Outlook Live" → Outlook live URL
- Style: tiny pill buttons, gray bg, 11px font

FILE: src/routes/veranstaltungen/+page.svelte
- Tab bar: "Liste" | "Monat" | "Tag" (purple underline on active, gray on inactive)
- Use $page.url.searchParams or $state to track active view
- "Vergangene Veranstaltungen" toggle link

LIST VIEW (default):
- Group events by month: heading "Mai 2026", "Juni 2026" etc. in Roboto 18px
- EventCard per event within each group
- "Vergangene Veranstaltungen anzeigen →" link at bottom

MONTH VIEW:
- CSS grid: 7 columns, rows auto
- Month/Year heading: "Mai 2026" + prev/next arrows
- Day cells: number in top-right, gray border
- Days with events: small purple dot indicator + event title truncated (11px)
- Today: yellow bg background on cell

DAY VIEW:
- Shows events for today
- If none: "Keine Veranstaltungen für heute"

FILE: src/routes/veranstaltung/[slug]/+page.svelte
- H1: event.title (Roboto 32px)
- Date: large formatted German date range
- Location badge: purple pill with city + country
- Description: full HTML body
- CalendarExport component
- "← Zurück zu Veranstaltungen" link
```

---

## ══════════════════════════════════════════
## PROMPT 17 — BUSINESS DIRECTORY
## ══════════════════════════════════════════

```
Build the business directory for the Gartenwoche clone.

FILE: src/lib/components/directory/DirectoryCard.svelte
Props: entry: DirectoryEntry
- White card, border 1px #E0E0E0, border-radius 8px, padding 20px
- Logo: 100px × 80px container, object-contain, centered
  If no logo: gray placeholder with company initials (2 letters, Roboto bold, purple)
- Company name: Roboto 16px 700, margin-top 12px
- Category tag: .cat-badge (small)
- Short description: 2-line clamp, Open Sans 13px gray
- Phone + website links (small, gray with icon)
- "Mehr erfahren →" link at bottom → /branchenverzeichnis/eintrag/[slug]
- Hover: box-shadow + border-color #2D1B69

FILE: src/routes/branchenverzeichnis/+page.svelte
- H1: "Branchenverzeichnis" (Roboto 28px)
- Sub: "Professionelle Anbieter für die grüne Branche"
- 3-column grid of DirectoryCards (2-col tablet, 1-col mobile)
- All 8 entries shown

FILE: src/routes/branchenverzeichnis/eintrag/[slug]/+page.server.ts
- Load entry by slug or throw 404

FILE: src/routes/branchenverzeichnis/eintrag/[slug]/+page.svelte
- Breadcrumb: Start > Branchenverzeichnis > [company name]
- Logo: 200x160px, object-contain, left aligned
- H1: company name (Roboto 32px)
- Category badge
- Description: full text (ArticleBody style)
- Contact block (gray bg, border-radius 8px, padding 16px):
  - Address, Phone, Email, Website
  - Each with appropriate icon
- "Zur Webseite" external link button (purple, full-width on mobile)
```

---

## ══════════════════════════════════════════
## PROMPT 18 — STATIC PAGES
## ══════════════════════════════════════════

```
Build all static pages for the Gartenwoche clone. All content in German. Each page uses the standard 2/3 + 1/3 layout (content + sidebar).

Operator info (use on Impressum):
Company: Gartenmedien Ltd.
Address: Via Campagna 19, 6595 Riazzino, Switzerland
Phone: +41 (0)76 24 200 25
Email: info@gartenwoche.ch
Note: "Dieser Blog ist unabhängig und wird privat betrieben."

BUILD THESE PAGES (one by one, complete implementation):

1. /impressum — Legal imprint with operator details above. Include: Angaben gemäß § / Inhaber: Peter Sturm / Kontakt block.

2. /datenschutzerklaerung — GDPR/Swiss DSG privacy policy. Covers: collected data, Google Fonts (loaded from Google servers), AWIN affiliate tracking, cookies (session only), contact form, no data sale, user rights.

3. /allgemeine-geschaeftsbedingungen — Swiss-law terms. Covers: subscription terms, free/pro tiers, content rights, limitation of liability, governing law: Switzerland.

4. /abonnement — Subscription page:
   - Comparison table: Gratis vs PRO
   - Gratis: article browsing, limited access
   - PRO: full access, no ads, early access, price placeholder "CHF X/Monat"
   - Big "Jetzt PRO werden" button (opens register modal)

5. /schreiben-sie-uns — Contact page:
   - Intro: "Haben Sie Fragen oder Anregungen?"
   - Form fields: Ihr Name, E-Mail, Betreff, Nachricht (textarea)
   - Submit button: "Nachricht senden" (purple)
   - Use Superforms + Zod validation
   - Success message: "Danke! Ihre Nachricht wurde gesendet."
   - Error handling for empty fields

6. /podcast-garten — Podcast page:
   - Heading: "Podcast Garten"
   - Description: "Der Gartenwoche Podcast – für Gartenfreunde"
   - 5 fake episode cards: each with episode number, German title, description, duration, play button

7. /stellenangebote-fuer-die-gruene-branche — Jobs page:
   - Heading: "Stellenangebote für die grüne Branche"
   - 3 fake job listings: title, company, location, date posted
   - Each job card links to # (placeholder)
   - Empty state component ready

Each page must have svelte:head with title and meta description.
```

---

## ══════════════════════════════════════════
## PROMPT 19 — AUTHOR PAGES + SEARCH PAGE
## ══════════════════════════════════════════

```
Build author archive pages and the full search results page.

FILE: src/routes/author/[slug]/+page.server.ts
- Load author by slug (getAuthorBySlug(params.slug)) or throw 404
- Load all articles by that author
- Return: { author, articles }

FILE: src/routes/author/[slug]/+page.svelte
- Breadcrumb: Start > Autoren > [author name]
- Author section (top, horizontal):
  - Avatar: 80px circle (placeholder if none, with initials)
  - Name: Roboto 24px 700
  - Bio: Open Sans 14px gray
  - Article count: "X Artikel veröffentlicht"
- Below: Article grid (same as category page, 2-column)

Make sure these 4 author slugs work:
/author/redaktion-aktuelles
/author/redaktion-wissen
/author/redaktion-gartenpraxis
/author/stemalo

FILE: src/routes/search/+page.svelte
- Get q param from URL: url.searchParams.get('q')
- Load search results in +page.server.ts via searchArticles(q)
- Page heading: "Suchergebnisse für '{query}'" + "(X Treffer)"
- If query empty: "Bitte geben Sie einen Suchbegriff ein"
- If no results: "Keine Ergebnisse für '{query}' gefunden" + suggestions
- Article grid (same as category page)
- Highlight query terms in titles (wrap in <mark> tag, yellow bg)
```

---

## ══════════════════════════════════════════
## PROMPT 20 — MEIN KONTO + AUTH ROUTES
## ══════════════════════════════════════════

```
Build the account page and API auth routes for the Gartenwoche clone.

FILE: src/routes/mein-konto/+page.server.ts
- Protected route: if no user session, redirect to /?login=1
- Return: { user }

FILE: src/routes/mein-konto/+page.svelte
- Heading: "Mein Konto"
- Welcome: "Willkommen zurück, [username]!"
- Tier badge: "Gratis" (gray) or "PRO" (yellow/purple)
- PRO upgrade CTA (if tier is free):
  Heading: "Upgrade auf PRO"
  Text: "Erhalten Sie vollen Zugang zu allen Artikeln"
  Button: "Jetzt upgraden" → /abonnement
- Account details section:
  - E-Mail anzeigen (blurred)
  - Mitglied seit: [date]
- Security section:
  - "Passwort ändern" button (opens inline form)
- Logout button (form action → /api/auth/logout)

FILE: src/routes/api/auth/login/+server.ts
- POST handler
- Validate: username (string, min 3), password (string, min 6)
- Mock: check against hardcoded test user { username: 'testuser', password: 'test1234', tier: 'free' }
- On success: set session cookie + return { success: true }
- On fail: return { error: 'Ungültige Zugangsdaten' }

FILE: src/routes/api/auth/register/+server.ts
- POST handler
- Validate: email, username
- Mock: always succeed, return { success: true, message: 'Passwort wurde an Ihre E-Mail gesendet' }

FILE: src/routes/api/auth/logout/+server.ts
- POST handler
- Clear session cookie
- Return redirect to /
```

---

## ══════════════════════════════════════════
## PROMPT 21 — SEO + SITEMAP + ROBOTS
## ══════════════════════════════════════════

```
Add complete SEO to the Gartenwoche clone.

1. Create src/lib/utils/seo.ts:
   function generateMeta(title, description, image?, canonical?)
   Returns: { title: string, description: string, ogTitle: string, ogDesc: string, ogImage: string, canonical: string }
   Default image: /images/og-default.jpg
   Title format: "[title] | Gartenwoche"

2. Add svelte:head to ALL pages:
   - / → "Gartenwoche – Das unabhängige Gartenmagazin für die Schweiz"
   - /category/[slug] → "[Category name] | Gartenwoche"
   - /[cat]/[slug] → "[Article title] | Gartenwoche" (use article.title)
   - Events → "Veranstaltungen | Gartenwoche"
   - Directory → "Branchenverzeichnis | Gartenwoche"
   - Impressum → "Impressum | Gartenwoche"
   - etc.

3. Add robots meta on all public pages:
   <meta name="robots" content="max-image-preview:large" />

4. Create src/routes/sitemap.xml/+server.ts:
   - Generate XML sitemap including:
     - All static pages
     - All category pages
     - All article slugs (from getArticles())
     - All event slugs
     - All directory entry slugs
   - Return with Content-Type: application/xml
   - Add lastmod dates

5. Create src/routes/robots.txt/+server.ts:
   - Return: User-agent: * / Allow: / / Sitemap: {PUBLIC_SITE_URL}/sitemap.xml

6. Add JSON-LD structured data to article pages:
   - @type: Article
   - headline, datePublished, author, image, publisher

7. Add canonical URLs to all pages using SvelteKit's $page.url.href
```

---

## ══════════════════════════════════════════
## PROMPT 22 — FINAL POLISH + RESPONSIVE
## ══════════════════════════════════════════

```
Final polish pass for the Gartenwoche SvelteKit clone.

1. TRANSITIONS:
   - All links: transition: color 0.2s ease
   - All cards: transition: box-shadow 0.2s, transform 0.2s
   - Card hover: transform: translateY(-2px), box-shadow: 0 8px 24px rgba(0,0,0,0.12)
   - Buttons: transition: background-color 0.15s, opacity 0.15s
   - Nav dropdown: opacity 0→1, translateY(-4px)→0, transition 0.2s ease

2. HAMBURGER MENU (mobile, complete implementation):
   - Hidden at > 1024px, visible at ≤ 1024px
   - 3-line SVG icon, animated to X when open
   - Full-height slide-in sidebar from left (translateX(-100%)→0)
   - Dark overlay closes it
   - Contains all primary nav links + TopBar auth buttons
   - Transition: 0.3s ease

3. STICKY NAV SCROLL BEHAVIOR:
   In NavPrimary.svelte:
   - Listen to window scroll event
   - scrolled = scrollY > 120
   - When scrolled: show compact logo (opacity 1, transition 0.2s)
   - When not scrolled: hide compact logo (opacity 0)

4. IMAGE LAZY LOADING:
   - Add loading="lazy" to all ArticleCard thumbnails
   - Add loading="eager" to hero/spotlight images
   - CSS placeholder: background-color #E0E0E0 with animate-pulse effect

5. MOBILE RESPONSIVE CHECK:
   Verify at 375px these work:
   - TopBar: only shows auth buttons
   - HeaderMain: logo centered, social row below
   - NavPrimary: hamburger only, no visible links
   - Homepage sections: all single-column
   - Article page: no sidebar (sidebar moves below article)
   - Cards: full width

   Verify at 768px:
   - FeaturedGrid: 2 columns
   - Category grid: 2 columns
   - Sidebar: hidden or below on article pages

6. GERMAN DATE IN HEADER:
   Show current date in German: "Donnerstag, 07. Mai 2026"
   Use date-fns format(new Date(), "EEEE, dd. MMMM yyyy", { locale: de })

7. SCROLLBAR:
   Add to app.css:
   ::-webkit-scrollbar { width: 6px; height: 6px; }
   ::-webkit-scrollbar-track { background: #f0f0f0; }
   ::-webkit-scrollbar-thumb { background: #2D1B69; border-radius: 3px; }

8. FOCUS STYLES:
   :focus-visible { outline: 2px solid #2D1B69; outline-offset: 2px; }

Run npm run check (TypeScript), npm run lint (ESLint), npm run build.
Fix all errors. Output a clean build.
```

---

## ══════════════════════════════════════════
## PROMPT 23 — FINAL QA CHECKLIST
## ══════════════════════════════════════════

```
Run a complete QA audit of the Gartenwoche SvelteKit clone. Check each item and fix any issues found.

ROUTES (test each loads without error):
□ /
□ /category/gartenpraxis
□ /category/pflanzen
□ /category/pflanzen/stauden
□ /category/pflanzen/sommerflor
□ /category/pflanzen/rosen
□ /category/pflanzen/pflanzenempfehlungen
□ /category/pflanzen/wasserpflanzen
□ /category/pflanzenschutz
□ /category/rasen
□ /category/wissen
□ /category/aktuelles
□ /category/aktuelles/schweiz
□ /category/aktuelles/europa
□ /category/aktuelles/welt
□ /category/gartentechnik
□ /category/produktschau
□ /nuesslisalat-ganzjaehriger-vitaminchampion (or correct path)
□ /veranstaltungen
□ /veranstaltungen/list
□ /veranstaltungen/monat
□ /veranstaltungen/heute
□ /veranstaltung/rhs-chelsea-flower-show
□ /branchenverzeichnis
□ /branchenverzeichnis/eintrag/pflanzenschau-ag-2
□ /author/redaktion-aktuelles
□ /author/stemalo
□ /search?q=rose
□ /mein-konto (redirects to login if not authenticated)
□ /impressum
□ /datenschutzerklaerung
□ /allgemeine-geschaeftsbedingungen
□ /abonnement
□ /schreiben-sie-uns
□ /podcast-garten
□ /stellenangebote-fuer-die-gruene-branche
□ /sitemap.xml
□ /robots.txt

VISUAL:
□ Fonts: Roboto on headings, Open Sans on body, Lora on article h1
□ Colors: purple nav bar, yellow category badges, gray body background
□ Login modal: all 3 tabs work
□ Search overlay: opens, real-time results, ESC closes
□ Weather: displays temperature in header
□ Sticky nav: compact logo appears on scroll
□ Hamburger menu: works on mobile
□ PRO gate: blurs content for non-PRO articles

FINAL BUILD:
Run: npm run build && npm run preview
Verify no TypeScript errors, no ESLint warnings.
```

---

## QUICK PROMPT REFERENCE

| Prompt | What it builds |
|---|---|
| 01 | Project scaffold + packages |
| 02 | Global CSS, fonts, design system |
| 03 | TypeScript type definitions |
| 04 | Mock data (20 articles, events, directory) |
| 05 | Svelte stores (modal, auth, search, weather) |
| 06 | TopBar, HeaderMain, NavPrimary |
| 07 | Footer + FooterCTA |
| 08 | Root layout + layout.server |
| 09 | Login/Register modal (3 tabs) |
| 10 | Search overlay + API endpoint |
| 11 | Article card components (5 variants) |
| 12 | Homepage sections 1-7 |
| 13 | Homepage sections 8-11 + compose homepage |
| 14 | Single article page + PRO gate |
| 15 | Category archive pages (all 16) |
| 16 | Events calendar (4 views + single event) |
| 17 | Business directory (index + entries) |
| 18 | All 7 static pages |
| 19 | Author pages + search results page |
| 20 | Mein Konto + auth API routes |
| 21 | SEO + sitemap.xml + robots.txt |
| 22 | Final polish + responsive + transitions |
| 23 | Full QA checklist + build verification |