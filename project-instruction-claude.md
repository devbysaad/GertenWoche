# PROJECT INSTRUCTIONS — Gartenwoche SvelteKit Clone
> Step-by-step technical build instructions for every part of the project

---

## 1. TECH STACK (EXACT)

| Tool | Version | Purpose |
|---|---|---|
| SvelteKit | Latest (^2.x) | Full-stack framework |
| Svelte | ^5.x | UI components (runes mode) |
| TypeScript | ^5.x | Type safety |
| TailwindCSS | ^4.x | Utility styling |
| Vite | ^6.x | Build tool (bundled with SvelteKit) |
| PocketBase / SQLite | Latest | Backend DB (or mock JSON files for static) |
| Lucia Auth | ^3.x | Authentication (login/register/sessions) |
| SvelteKit Superforms | Latest | Form handling (login, contact, register) |
| Zod | Latest | Schema validation |
| @sveltejs/adapter-node | Latest | Node.js SSR adapter |

---

## 2. PROJECT INITIALIZATION

```bash
# Create SvelteKit project
npm create svelte@latest gartenwoche-clone
# Choose: Skeleton project, TypeScript, ESLint, Prettier

cd gartenwoche-clone

# Install TailwindCSS v4
npm install -D tailwindcss @tailwindcss/vite

# Install additional packages
npm install -D @sveltejs/adapter-node
npm install zod sveltekit-superforms lucia
npm install @lucide-svelte/icons  # or use custom SVG icons

# Install utility packages
npm install date-fns              # date formatting (German locale)
npm install marked                # Markdown/HTML content rendering
npm install @types/marked
```

### vite.config.ts
```typescript
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [tailwindcss(), sveltekit()]
});
```

### svelte.config.js
```javascript
import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter(),
    alias: {
      '$components': './src/lib/components',
      '$stores': './src/lib/stores',
      '$types': './src/lib/types',
      '$data': './src/lib/data',
      '$utils': './src/lib/utils'
    }
  }
};

export default config;
```

---

## 3. FOLDER STRUCTURE (COMPLETE)

```
gartenwoche-clone/
├── src/
│   ├── app.css                          # Global CSS + CSS variables + font imports
│   ├── app.html                         # HTML shell (meta, font preload links)
│   ├── hooks.server.ts                  # Auth session handling
│   │
│   ├── lib/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── TopBar.svelte
│   │   │   │   ├── HeaderMain.svelte
│   │   │   │   ├── NavPrimary.svelte
│   │   │   │   ├── MegaMenu.svelte
│   │   │   │   ├── Footer.svelte
│   │   │   │   ├── FooterCTA.svelte
│   │   │   │   └── Breadcrumb.svelte
│   │   │   │
│   │   │   ├── ui/
│   │   │   │   ├── Logo.svelte
│   │   │   │   ├── WeatherWidget.svelte
│   │   │   │   ├── SearchBar.svelte
│   │   │   │   ├── LoginModal.svelte
│   │   │   │   ├── CategoryBadge.svelte
│   │   │   │   ├── AuthorMeta.svelte
│   │   │   │   ├── SocialIcons.svelte
│   │   │   │   ├── ProBadge.svelte
│   │   │   │   ├── Pagination.svelte
│   │   │   │   └── VideoEmbed.svelte
│   │   │   │
│   │   │   ├── articles/
│   │   │   │   ├── ArticleCard.svelte
│   │   │   │   ├── ArticleCardLarge.svelte
│   │   │   │   ├── ArticleCardSmall.svelte
│   │   │   │   ├── ArticleCardHorizontal.svelte
│   │   │   │   ├── ArticleList.svelte
│   │   │   │   ├── ArticleGrid.svelte
│   │   │   │   ├── ArticleHero.svelte
│   │   │   │   ├── ArticleBody.svelte
│   │   │   │   └── ArticleCarousel.svelte
│   │   │   │
│   │   │   ├── blocks/
│   │   │   │   ├── HeroSpotlight.svelte
│   │   │   │   ├── FeaturedGrid.svelte
│   │   │   │   ├── PflanzenStrip.svelte
│   │   │   │   ├── RasenGartenBlock.svelte
│   │   │   │   ├── VideoBlock.svelte
│   │   │   │   ├── MixedArticleBlock.svelte
│   │   │   │   ├── RotatingCarousel.svelte
│   │   │   │   ├── ProductSidebar.svelte
│   │   │   │   ├── ThreeColBlock.svelte
│   │   │   │   ├── DirectoryLogos.svelte
│   │   │   │   └── EventsWidget.svelte
│   │   │   │
│   │   │   ├── directory/
│   │   │   │   ├── DirectoryCard.svelte
│   │   │   │   └── DirectoryGrid.svelte
│   │   │   │
│   │   │   └── events/
│   │   │       ├── EventCard.svelte
│   │   │       ├── EventListView.svelte
│   │   │       ├── EventMonthView.svelte
│   │   │       └── CalendarExport.svelte
│   │   │
│   │   ├── data/                        # Mock JSON seed data
│   │   │   ├── articles.ts
│   │   │   ├── categories.ts
│   │   │   ├── authors.ts
│   │   │   ├── events.ts
│   │   │   └── directory.ts
│   │   │
│   │   ├── stores/
│   │   │   ├── auth.store.ts            # User session store
│   │   │   ├── search.store.ts          # Search state
│   │   │   ├── modal.store.ts           # Login modal visibility
│   │   │   └── weather.store.ts         # Weather data
│   │   │
│   │   ├── types/
│   │   │   ├── article.ts
│   │   │   ├── category.ts
│   │   │   ├── author.ts
│   │   │   ├── event.ts
│   │   │   ├── directory.ts
│   │   │   └── user.ts
│   │   │
│   │   └── utils/
│   │       ├── date.ts                  # German date formatting
│   │       ├── slug.ts                  # Slug generation helpers
│   │       ├── weather.ts               # Weather API fetch
│   │       └── seo.ts                   # Meta tag generators
│   │
│   └── routes/
│       ├── +layout.svelte               # Root layout (header + footer)
│       ├── +layout.server.ts            # Auth load, weather prefetch
│       ├── +page.svelte                 # Homepage
│       ├── +page.server.ts              # Homepage data loader
│       │
│       ├── (auth)/
│       │   ├── anmelden-registrieren/
│       │   │   ├── +page.svelte
│       │   │   └── +page.server.ts
│       │   └── mein-konto/
│       │       ├── +page.svelte
│       │       └── +page.server.ts      # Protected route
│       │
│       ├── category/
│       │   └── [...slug]/
│       │       ├── +page.svelte         # Generic category archive
│       │       └── +page.server.ts
│       │
│       ├── [category]/
│       │   └── [slug]/
│       │       ├── +page.svelte         # Single article (2-level)
│       │       └── +page.server.ts
│       │
│       ├── [cat]/
│       │   └── [subcat]/
│       │       └── [slug]/
│       │           ├── +page.svelte     # Single article (3-level)
│       │           └── +page.server.ts
│       │
│       ├── veranstaltungen/
│       │   ├── +page.svelte
│       │   ├── list/+page.svelte
│       │   ├── monat/+page.svelte
│       │   └── heute/+page.svelte
│       │
│       ├── veranstaltung/
│       │   └── [slug]/
│       │       ├── +page.svelte
│       │       └── +page.server.ts
│       │
│       ├── branchenverzeichnis/
│       │   ├── +page.svelte
│       │   └── eintrag/
│       │       └── [slug]/
│       │           ├── +page.svelte
│       │           └── +page.server.ts
│       │
│       ├── author/
│       │   └── [slug]/
│       │       ├── +page.svelte
│       │       └── +page.server.ts
│       │
│       ├── search/
│       │   └── +page.svelte
│       │
│       ├── impressum/+page.svelte
│       ├── datenschutzerklaerung/+page.svelte
│       ├── allgemeine-geschaeftsbedingungen/+page.svelte
│       ├── abonnement/+page.svelte
│       ├── schreiben-sie-uns/+page.svelte
│       ├── podcast-garten/+page.svelte
│       ├── stellenangebote-fuer-die-gruene-branche/+page.svelte
│       │
│       └── api/
│           ├── weather/+server.ts       # Weather proxy endpoint
│           ├── search/+server.ts        # Search endpoint
│           └── auth/
│               ├── login/+server.ts
│               ├── register/+server.ts
│               └── logout/+server.ts
│
├── static/
│   ├── fonts/                           # Self-host fonts (optional)
│   ├── images/
│   │   ├── logo.svg
│   │   └── placeholder.jpg
│   └── favicon.ico
│
├── package.json
├── svelte.config.js
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js (if needed)
└── .env                                 # WEATHER_API_KEY etc.
```

---

## 4. GLOBAL CSS (app.css) — COMPLETE

```css
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;800;900&family=Open+Sans:wght@400;600;700&family=Lora:wght@700&display=swap');
@import 'tailwindcss';

:root {
  --color-primary:        #2D1B69;
  --color-primary-hover:  #4a0e4e;
  --color-accent:         #F7C900;
  --color-bg:             #F7F7F7;
  --color-surface:        #FFFFFF;
  --color-text:           #222222;
  --color-text-muted:     #555555;
  --color-text-faint:     #999999;
  --color-border:         #E0E0E0;
  --color-tag-bg:         #FFF9D6;
  --color-tag-text:       #2D1B69;

  --font-heading:         'Roboto', Verdana, Geneva, sans-serif;
  --font-body:            'Open Sans', Verdana, Geneva, sans-serif;
  --font-editorial:       'Lora', Georgia, serif;

  --header-height:        60px;
  --topbar-height:        36px;
  --max-width:            1200px;
  --sidebar-width:        300px;
  --gap:                  20px;
}

*, *::before, *::after { box-sizing: border-box; }

html { scroll-behavior: smooth; }

body {
  font-family: var(--font-body);
  background-color: var(--color-bg);
  color: var(--color-text);
  font-size: 16px;
  line-height: 1.6;
  margin: 0;
}

/* Fallback for p, body */
p { font-family: Verdana, Geneva, sans-serif; }
p.open-sans { font-family: var(--font-body); }

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading);
  line-height: 1.2;
  font-weight: 700;
  color: var(--color-text);
}

a {
  color: inherit;
  text-decoration: none;
  transition: color 0.2s ease;
}
a:hover { color: var(--color-primary); }

img { max-width: 100%; height: auto; display: block; }

/* Container */
.container {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 20px;
}

/* Category Badge */
.cat-badge {
  display: inline-block;
  background: var(--color-accent);
  color: var(--color-primary);
  font-family: var(--font-heading);
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 3px 8px;
  border-radius: 2px;
}

/* PRO Badge */
.pro-badge {
  background: var(--color-accent);
  color: var(--color-primary);
  font-size: 10px;
  font-weight: 900;
  padding: 2px 6px;
  border-radius: 2px;
  letter-spacing: 0.08em;
}
```

---

## 5. ROOT LAYOUT (+layout.svelte)

```svelte
<script lang="ts">
  import '../app.css';
  import TopBar from '$components/layout/TopBar.svelte';
  import HeaderMain from '$components/layout/HeaderMain.svelte';
  import NavPrimary from '$components/layout/NavPrimary.svelte';
  import Footer from '$components/layout/Footer.svelte';
  import LoginModal from '$components/ui/LoginModal.svelte';
  import SearchBar from '$components/ui/SearchBar.svelte';
  import { modalStore } from '$stores/modal.store';

  let { data, children } = $props();
</script>

<LoginModal bind:open={$modalStore.loginOpen} />
<SearchBar bind:open={$modalStore.searchOpen} />

<TopBar />
<HeaderMain weather={data.weather} />
<NavPrimary />

<main>
  {@render children()}
</main>

<Footer />
```

---

## 6. TOPBAR COMPONENT (exact structure)

```svelte
<!-- TopBar.svelte -->
<script lang="ts">
  import { modalStore } from '$stores/modal.store';

  const quickLinks = [
    { label: 'Aktuelles', href: '/category/aktuelles' },
    { label: 'Schweiz', href: '/category/aktuelles/schweiz' },
    { label: 'Europa', href: '/category/aktuelles/europa' },
    { label: 'Welt', href: '/category/aktuelles/welt' },
    { label: 'Produktschau', href: '/category/produktschau' },
    { label: 'Wissen', href: '/category/wissen' },
    { label: 'Gartenpraxis', href: '/category/gartenpraxis' },
    { label: 'Pflanzenschutz', href: '/category/pflanzenschutz' },
    { label: 'Pflanzenempfehlungen', href: '/category/pflanzen/pflanzenempfehlungen' },
    { label: 'Stauden', href: '/category/pflanzen/stauden' },
    { label: 'Veranstaltungen', href: '/veranstaltungen' },
    { label: 'Stellenangebote für die grüne Branche', href: '/stellenangebote-fuer-die-gruene-branche' },
  ];
</script>

<div class="topbar">
  <div class="container topbar-inner">
    <nav class="topbar-links">
      {#each quickLinks as link}
        <a href={link.href}>{link.label}</a>
      {/each}
    </nav>
    <div class="topbar-auth">
      <button onclick={() => modalStore.openLogin()}>Anmelden</button>
      <button onclick={() => modalStore.openRegister()}>Beitreten</button>
    </div>
  </div>
</div>

<style>
  .topbar {
    background: var(--color-primary);
    height: var(--topbar-height);
    font-family: var(--font-heading);
    font-size: 12px;
  }
  .topbar-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 100%;
  }
  .topbar-links {
    display: flex;
    gap: 16px;
    overflow: hidden;
  }
  .topbar-links a {
    color: rgba(255,255,255,0.85);
    white-space: nowrap;
    transition: color 0.2s;
  }
  .topbar-links a:hover { color: var(--color-accent); }
  .topbar-auth {
    display: flex;
    gap: 10px;
    flex-shrink: 0;
  }
  .topbar-auth button {
    color: rgba(255,255,255,0.9);
    background: none;
    border: none;
    cursor: pointer;
    font-family: var(--font-heading);
    font-size: 12px;
    padding: 0;
  }
  .topbar-auth button:hover { color: var(--color-accent); }
</style>
```

---

## 7. NAVIGATION STRUCTURE (exact menu)

```typescript
// nav.config.ts
export const primaryNav = [
  { label: 'Gartenpraxis', href: '/category/gartenpraxis' },
  {
    label: 'Pflanzen',
    href: '/category/pflanzen',
    children: [
      { label: 'Stauden', href: '/category/pflanzen/stauden' },
      { label: 'Sommerflor', href: '/category/pflanzen/sommerflor' },
      { label: 'Rosen', href: '/category/pflanzen/rosen' },
      { label: 'Pflanzenempfehlungen', href: '/category/pflanzen/pflanzenempfehlungen' },
      { label: 'Pflanzenschutz', href: '/category/pflanzenschutz' },
    ]
  },
  { label: 'Rasen', href: '/category/rasen' },
  { label: 'Wissen', href: '/category/wissen' },
  {
    label: 'Aktuelles',
    href: '/category/aktuelles',
    children: [
      { label: 'Schweiz', href: '/category/aktuelles/schweiz' },
      { label: 'Europa', href: '/category/aktuelles/europa' },
      { label: 'Welt', href: '/category/aktuelles/welt' },
    ]
  },
  { label: 'Gartentechnik', href: '/category/gartentechnik' },
  { label: 'Podcast Garten', href: '/podcast-garten' },
];
```

---

## 8. LOGIN MODAL (exact flow)

```
Modal has 3 states controlled by a tab variable:
  'login'    → "Herzlich willkommen! Melde dich in deinem Konto an"
               Fields: Benutzername, Passwort
               Links: "Passwort vergessen?" | "Ein Konto erstellen"
               Link to: Datenschutzerklärung

  'register' → "Herzlich willkommen! Registrieren Sie sich für ein Konto"
               Fields: E-Mail-Adresse, Benutzername
               Note: "Ein Passwort wird Ihnen per Email zugeschickt."
               Link to: Datenschutzerklärung

  'recover'  → "Passwort-Wiederherstellung" / "Passwort zurücksetzen"
               Fields: E-Mail-Adresse
```

---

## 9. HOMEPAGE LAYOUT (exact section order)

```
+--------------------------------------------------+
|  TOP BAR (purple, quick nav + login)             |
+--------------------------------------------------+
|  HEADER MAIN (logo + weather + social)           |
+--------------------------------------------------+
|  NAV PRIMARY (sticky, mega-dropdown)             |
+--------------------------------------------------+
|                                                  |
|  SECTION 1: HERO SPOTLIGHT                       |
|  Full-width: Latest article (large image)        |
|  Category badge + Title + Author + Date          |
|                                                  |
+--------------------------------------------------+
|                                                  |
|  SECTION 2: FEATURED GRID (4-col)                |
|  [ Card ] [ Card ] [ Card ] [ Card ]             |
|  Mixed categories with yellow cat labels         |
|                                                  |
+--------------------------------------------------+
|                                                  |
|  SECTION 3: PFLANZENEMPFEHLUNGEN STRIP           |
|  Section header + horizontal 5-card carousel     |
|                                                  |
+--------------------------------------------------+
|                                                  |
|  SECTION 4: RASEN + GARTENPRAXIS DUO             |
|  [ Rasen article (large) ] [ Gartenpraxis (small)]|
|                                                  |
+--------------------------------------------------+
|                                                  |
|  SECTION 5: VIDEO DER WOCHE                      |
|  "Video der Woche" heading + iframe embed        |
|  Caption text below                              |
|                                                  |
+--------------------------------------------------+
|                                                  |
|  SECTION 6: MIXED ARTICLE BLOCK                  |
|  [ Gartenpraxis col ] [ Wissen col ] [ Europa col]|
|  Vertical article lists per column               |
|                                                  |
+--------------------------------------------------+
|                                                  |
|  SECTION 7: ROTATING CAROUSEL                    |
|  Auto-play featured article slider (2 articles)  |
|                                                  |
+--------------------------------------------------+
|                      |                           |
|  MAIN (2/3 width)    |   SIDEBAR (1/3 width)    |
|                      |                           |
|  SECTION 9:          |   SECTION 8:              |
|  Three-col block     |   Produktvorschläge       |
|  Pflanzenschutz      |   (5 product cards)       |
|  Produktschau        |                           |
|  Rasen               |   SECTION 10:             |
|                      |   Branchenverzeichnis     |
|                      |   (logo strip)            |
|                      |                           |
|                      |   SECTION 11:             |
|                      |   Events Widget           |
|                      |                           |
+--------------------------------------------------+
|                                                  |
|  FOOTER (dark purple)                            |
|  Logo+PRO | Pro Links | Legal Links              |
|  Subscription CTA + AWIN affiliate banner        |
|  Copyright © 2025 Gartenwoche                    |
|                                                  |
+--------------------------------------------------+
```

---

## 10. ARTICLE PAGE LAYOUT

```
+--------------------------------------------------+
| Breadcrumb: Start > Category > Article title     |
+--------------------------------------------------+
|                      |                           |
|  ARTICLE CONTENT     |   RIGHT SIDEBAR           |
|  (70% width)         |   (30% width)             |
|                      |                           |
|  - Category badge    |   - Produktvorschläge     |
|  - Title (h1, Lora)  |   - Directory logos       |
|  - Author + Date     |   - Events widget         |
|  - Thumbnail image   |   - Related articles      |
|  - Article body      |                           |
|  - Tags              |                           |
|  - Comment count     |                           |
|  - Social share      |                           |
|                      |                           |
+--------------------------------------------------+
| Related Articles (grid)                          |
+--------------------------------------------------+
| Comments section                                 |
+--------------------------------------------------+
```

---

## 11. CATEGORY PAGE LAYOUT

```
+--------------------------------------------------+
| Category heading + article count                 |
+--------------------------------------------------+
|                      |                           |
|  ARTICLE GRID (2col) |   SIDEBAR (same as above) |
|                      |                           |
|  Sorted by date desc |                           |
|  With pagination     |                           |
+--------------------------------------------------+
```

---

## 12. WEATHER API INTEGRATION

```typescript
// src/lib/utils/weather.ts
export async function fetchWeather(city = 'Zurich') {
  const apiKey = process.env.WEATHER_API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  const res = await fetch(url);
  const data = await res.json();

  return {
    temp: Math.round(data.main.temp),
    city: 'Zürich',
  };
}

// Display format: "10.7 C Zürich"
// Shown in HeaderMain.svelte
```

---

## 13. GERMAN DATE FORMATTING

```typescript
// src/lib/utils/date.ts
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

export function formatGermanDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return format(d, 'd. MMMM yyyy', { locale: de });
  // Output: "19. Februar 2026"
}

export function formatGermanShort(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return format(d, 'd. MMM yyyy', { locale: de });
}

export function getDayOfWeek(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return format(d, 'EEEE', { locale: de });
  // Output: "Donnerstag"
}
```

---

## 14. SEO & META TAGS

Every page must have:
```svelte
<!-- In each +page.svelte or +layout.svelte -->
<svelte:head>
  <title>{title} | Gartenwoche</title>
  <meta name="description" content={description} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content={thumbnail} />
  <meta name="robots" content="max-image-preview:large" />
  <link rel="canonical" href={canonicalUrl} />
</svelte:head>
```

---

## 15. EVENTS CALENDAR PAGE

### Tabs to implement:
- **Liste** (default): article-style list with date badges
- **Monat**: calendar grid (month view, CSS grid 7 columns)
- **Tag**: single day view

### Export buttons:
```svelte
<a href={googleCalUrl}>zu Google Kalender hinzufügen</a>
<a href={icalUrl}>iCalendar</a>
<a href={outlook365Url}>Outlook 365</a>
<a href={outlookLiveUrl}>Outlook Live</a>
<a href="/veranstaltungen/list/?ical=1">.ics-Datei exportieren</a>
```

---

## 16. ENVIRONMENT VARIABLES (.env)

```env
WEATHER_API_KEY=your_openweathermap_key
DATABASE_URL=./db.sqlite
AWIN_ADVERTISER_ID=602261
PUBLIC_SITE_URL=https://gartenwoche.ch
```

---

## 17. RESPONSIVE BREAKPOINTS

```
Mobile:   < 640px    → single column, hamburger menu
Tablet:   640–1024px → 2-column grid, simplified nav
Desktop:  > 1024px   → full 3-column layouts, full nav
Wide:     > 1200px   → max-width container (1200px) centered
```

---

## 18. ACCESSIBILITY REQUIREMENTS

- All images have descriptive `alt` attributes (German)
- Navigation has `aria-label="Hauptnavigation"` / `aria-label="Schnellnavigation"`
- Modal has `role="dialog"` + `aria-modal="true"` + focus trap
- Skip to main content link (`#main-content`)
- Color contrast minimum AA (purple on white ✓, yellow on purple ✓)
- Category badges not rely on color alone

---

## 19. PERFORMANCE TARGETS

- Lazy load all images below the fold (`loading="lazy"`)
- Preload hero image (`<link rel="preload">`)
- Font display swap (`font-display: swap`)
- SvelteKit SSR for all public pages
- Static generation where possible (categories, static pages)
- Image optimization via Vite imagetools or SvelteKit enhanced images