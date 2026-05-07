# PROJECT WORKFLOW — Gartenwoche SvelteKit Clone
> Phase-by-phase execution plan. Every task is atomic, ordered, and completable.

---

## WORKFLOW OVERVIEW

```
Phase 0 → Project Setup & Scaffold
Phase 1 → Global Styles, Fonts, CSS Variables
Phase 2 → Layout Shell (TopBar, Header, Nav, Footer)
Phase 3 → Mock Data Layer (all content types)
Phase 4 → Homepage (all 11 sections)
Phase 5 → Article Single Page
Phase 6 → Category Archive Pages
Phase 7 → Events Calendar System
Phase 8 → Business Directory
Phase 9 → Auth System (Login/Register Modal)
Phase 10 → Static Pages (Impressum, AGB, etc.)
Phase 11 → Search System
Phase 12 → Author Pages
Phase 13 → Weather Widget + API
Phase 14 → Membership/PRO System
Phase 15 → SEO, Meta, Sitemap
Phase 16 → Polish, Animations, Responsive QA
Phase 17 → Final Review & Deploy
```

---

## PHASE 0 — PROJECT SETUP & SCAFFOLD

### 0.1 Initialize SvelteKit project
```bash
npm create svelte@latest gartenwoche-clone
# Options: Skeleton, TypeScript, ESLint, Prettier, Vitest
cd gartenwoche-clone
```

### 0.2 Install all dependencies
```bash
# Core
npm install -D tailwindcss @tailwindcss/vite
npm install -D @sveltejs/adapter-node

# Forms & Validation
npm install zod sveltekit-superforms

# Auth
npm install lucia @lucia-auth/adapter-sqlite

# Date handling (German locale)
npm install date-fns

# HTML content rendering
npm install marked @types/marked

# Icons (Lucide for SVG fallback)
npm install lucide-svelte
```

### 0.3 Configure vite.config.ts
- Add tailwindcss plugin
- Add sveltekit plugin

### 0.4 Configure svelte.config.js
- Set adapter-node
- Add path aliases: $components, $stores, $types, $data, $utils

### 0.5 Create full folder structure
```bash
mkdir -p src/lib/components/{layout,ui,articles,blocks,directory,events}
mkdir -p src/lib/{data,stores,types,utils}
mkdir -p src/routes/{category,author,search,veranstaltungen,veranstaltung}
mkdir -p src/routes/branchenverzeichnis/eintrag
mkdir -p static/{images,fonts}
```

### 0.6 Create .env file
```
WEATHER_API_KEY=your_key
DATABASE_URL=./db.sqlite
PUBLIC_SITE_URL=http://localhost:5173
```

**✅ Phase 0 complete when**: `npm run dev` starts with no errors, all folders exist.

---

## PHASE 1 — GLOBAL STYLES, FONTS, CSS VARIABLES

### 1.1 Edit app.html
- Add Google Fonts preconnect links
- Add Google Fonts stylesheet link (Roboto, Open Sans, Lora)
- Add meta viewport, charset
- Add `data-sveltekit-preload-data="hover"` on body

```html
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;800;900&family=Open+Sans:wght@400;600;700&family=Lora:wght@700&display=swap" rel="stylesheet" />
  %sveltekit.head%
</head>
<body data-sveltekit-preload-data="hover">
  <div style="display: contents">%sveltekit.body%</div>
</body>
</html>
```

### 1.2 Write app.css
- @import tailwindcss
- Define all :root CSS variables (colors, fonts, spacing, radii)
- Global element resets (body, h1-h6, a, img, p)
- Global utility classes: .container, .cat-badge, .pro-badge, .section-heading
- Scrollbar styling (thin, gray)

### 1.3 Define Tailwind config (if using tailwind.config.js)
- Extend theme with custom colors matching CSS variables
- Add custom font families to theme
- Add custom breakpoints: sm(640), md(768), lg(1024), xl(1200)

### 1.4 Test fonts load
- Temporarily put `<h1 class="font-heading">Test Roboto</h1>` and verify in browser
- Verify Open Sans on body, Lora on editorial class

**✅ Phase 1 complete when**: All 3 fonts render correctly in browser, CSS vars work.

---

## PHASE 2 — LAYOUT SHELL

### 2.1 Create src/lib/stores/modal.store.ts
```typescript
import { writable } from 'svelte/store';

export const modalStore = writable({
  loginOpen: false,
  searchOpen: false,
  activeTab: 'login' as 'login' | 'register' | 'recover',
});

export function openLogin() {
  modalStore.update(s => ({ ...s, loginOpen: true, activeTab: 'login' }));
}
export function openRegister() {
  modalStore.update(s => ({ ...s, loginOpen: true, activeTab: 'register' }));
}
export function closeModal() {
  modalStore.update(s => ({ ...s, loginOpen: false, searchOpen: false }));
}
```

### 2.2 Create src/lib/stores/auth.store.ts
```typescript
import { writable } from 'svelte/store';
import type { User } from '$types/user';

export const authStore = writable<{ user: User | null; loading: boolean }>({
  user: null,
  loading: true,
});
```

### 2.3 Build TopBar.svelte
- Dark purple background (#2D1B69)
- Height: 36px
- Left: scrollable links row (12 category quick-links — exact labels from PROJECT_DETAIL.md)
- Right: "Anmelden" + "Beitreten" buttons
- Font: Roboto 12px, white text, yellow on hover
- Mobile: hide quick-links, keep auth buttons only

### 2.4 Build Logo.svelte
- SVG or img of gartenwoche logo
- Use placeholder text "Gartenwoche" in Roboto bold with green styling if SVG not available
- Should have compact variant (for sticky nav)

### 2.5 Build WeatherWidget.svelte
- Display: `{temp}°C {city}` (e.g. "10.7°C Zürich")
- Uses weather store data passed from layout
- Small thermometer icon left of text
- Font: Roboto 13px, mid-gray

### 2.6 Build SocialIcons.svelte
- 3 icon links: Facebook, Instagram, X
- Use SVG icons inline
- Dark gray color, hover → primary purple
- Props: `size?: number` (default 18)

### 2.7 Build HeaderMain.svelte
- White background
- Left: Logo (full size)
- Center: PRO badge + (optional) date + weather widget
- Right: Social icons + "Mein Konto" button
- Height: ~80px
- Container max-width 1200px

### 2.8 Build MegaMenu.svelte
- Absolute positioned dropdown panel
- Appears on hover of parent nav item
- Shows child links in column
- White bg, 1px border, subtle shadow
- Smooth CSS transition (opacity + translateY)
- Props: `items: NavItem[]`, `open: boolean`

### 2.9 Build NavPrimary.svelte
- White background, 1px bottom border
- Sticky (position: sticky, top: 0, z-index: 100)
- Left: Logo (compact, hidden on initial, visible when scrolled past HeaderMain)
- Center: nav items with dropdown support (Pflanzen ▾, Aktuelles ▾)
- Right: Search icon button (onclick → open search overlay)
- Font: Roboto 14px weight 700
- Active/hover: purple text
- Use MegaMenu for dropdowns
- Mobile: hamburger menu button, collapsible sidebar

### 2.10 Build Footer.svelte
- Background: var(--color-primary) dark purple
- 3-column layout:
  - Col 1: Logo + PRO badge
  - Col 2: "Pro Links" → Branchenverzeichnis, Stellenangebote, Veranstaltungen
  - Col 3: "Legal" → Datenschutzerklärung, AGB, Abonnement, Impressum, Schreiben Sie uns
- Below columns: AWIN affiliate iframe/link (300×250)
- Bottom bar: "© 2025 Gartenwoche. Alle Rechte vorbehalten."
- All text: white / light gray
- Hover on links: yellow

### 2.11 Build FooterCTA.svelte
- Light gray section above footer
- Text: "Dieser Blog ist unabhängig und wird privat betrieben. Wenn Ihnen die Inhalte gefallen, unterstützen Sie uns durch eine kostenlose Registrierung."
- Button: "Hier registrieren" → opens modal register tab

### 2.12 Build Breadcrumb.svelte
- Props: `crumbs: Array<{label: string, href?: string}>`
- Output: `Start > Gartenpraxis > Article title`
- Font: 12px Open Sans gray

### 2.13 Build root +layout.svelte
- Import all layout components
- Render in correct order: TopBar → HeaderMain → NavPrimary → slot → FooterCTA → Footer
- Bind modal stores

### 2.14 Build root +layout.server.ts
- Load weather data from API (or mock)
- Pass to layout via `data`

**✅ Phase 2 complete when**: Full header + nav + footer render on every route. Sticky nav works. Dropdowns open on hover.

---

## PHASE 3 — MOCK DATA LAYER

### 3.1 Create src/lib/types/ (all type files)
- `article.ts` → Article, ArticlePreview
- `category.ts` → Category
- `author.ts` → Author
- `event.ts` → GartenEvent
- `directory.ts` → DirectoryEntry
- `user.ts` → User

### 3.2 Create src/lib/data/authors.ts
Seed with all 4 confirmed authors:
- redaktion-aktuelles (News-Redaktion)
- redaktion-wissen (Redaktion Wissen)
- redaktion-gartenpraxis (Redaktion Gartenpraxis)
- stemalo (Peter Sturm)

### 3.3 Create src/lib/data/categories.ts
Seed all 16 categories with slugs, names, parent refs.

### 3.4 Create src/lib/data/articles.ts
Seed at minimum 20 articles (all confirmed slugs from PROJECT_DETAIL.md):
- Each article must have: id, slug, title, excerpt, content (HTML), category, author, publishedAt, thumbnail (placeholder), isPro

### 3.5 Create src/lib/data/events.ts
Seed 2+ confirmed events:
- RHS Chelsea Flower Show (19-23 Mai 2026, London)
- Wyss Gartenakademie

### 3.6 Create src/lib/data/directory.ts
Seed all 8 confirmed business directory entries.

### 3.7 Create data helper functions
```typescript
// getArticles(filter?: {category?, limit?, page?})
// getArticleBySlug(slug: string)
// getArticlesByCategory(categorySlug: string, limit?: number)
// getCategories()
// getCategoryBySlug(slug: string)
// getEvents(filter?: {past?: boolean})
// getDirectoryEntries()
// getAuthorBySlug(slug: string)
// searchArticles(query: string)
```

**✅ Phase 3 complete when**: All helper functions return typed data without errors.

---

## PHASE 4 — HOMEPAGE (ALL 11 SECTIONS)

Build each homepage section as its own block component, then compose in `+page.svelte`.

### 4.1 Build ArticleCard.svelte (base component, needed by all blocks)
- Props: `article: ArticlePreview`
- Thumbnail (16:9 ratio, object-cover)
- Category badge (yellow)
- Title (Roboto bold, links to article)
- Author name + date (Open Sans 12px gray)
- Hover: title color → purple

### 4.2 Build HeroSpotlight.svelte (Section 1)
- Full-width container
- Large article image (aspect ratio 2:1)
- Overlay gradient (bottom 50% → black)
- Category badge top-left over image
- Title (large, white, Roboto 900) over image
- Author + date bottom-left
- Link: entire card is clickable

### 4.3 Build FeaturedGrid.svelte (Section 2)
- 4-column CSS grid
- Desktop: 4 cols, Tablet: 2 cols, Mobile: 1 col
- Each cell: ArticleCard component
- Mixed categories (Schweiz, Produktschau, Welt, Gartenpraxis)

### 4.4 Build ArticleCarousel.svelte (base carousel)
- Props: `articles: ArticlePreview[]`, `title?: string`
- Horizontal scroll with prev/next arrow buttons
- Smooth scroll behavior
- Section heading with "Mehr Artikel →" link on right

### 4.5 Build PflanzenStrip.svelte (Section 3)
- Section heading: "Pflanzenempfehlungen"
- Uses ArticleCarousel with 5 cards
- Cards: compact image + category badge + short title

### 4.6 Build RasenGartenBlock.svelte (Section 4)
- 2-column layout (60/40 split)
- Left: Large featured Rasen article
- Right: Compact Gartenpraxis article list (3-4 items)

### 4.7 Build VideoBlock.svelte (Section 5)
- Section heading: "Video der Woche"
- iframe embed (YouTube or Vimeo — responsive 16:9)
- Caption text below in Open Sans 14px gray

### 4.8 Build MixedArticleBlock.svelte (Section 6)
- 3-column layout
- Column 1: Gartenpraxis — vertical list
- Column 2: Wissen — vertical list
- Column 3: Europa — vertical list
- Each column has sub-heading with category name
- Each uses ArticleCardSmall

### 4.9 Build RotatingCarousel.svelte (Section 7)
- Full-width auto-playing carousel
- Auto-advances every 5 seconds
- Manual prev/next arrows
- Dot indicators at bottom
- Large image with text overlay (same as HeroSpotlight style)

### 4.10 Build ProductSidebar.svelte (Section 8 — sidebar)
- Section heading: "Produktvorschläge"
- 5 product article cards stacked vertically
- Each: small thumbnail (80x80) + title + category

### 4.11 Build ThreeColBlock.svelte (Section 9)
- 3-column block
- Col 1: Latest Pflanzenschutz articles (2)
- Col 2: Latest Produktschau articles (2)
- Col 3: Latest Rasen articles (2)
- Each column: heading + article list

### 4.12 Build DirectoryLogos.svelte (Section 10)
- Section heading: "Branchenverzeichnis"
- Horizontally scrollable logo strip
- 8 logos from directory entries
- Each logo: links to directory entry page
- Gray border on each logo container, hover: purple border

### 4.13 Build EventsWidget.svelte (Section 11 — sidebar)
- Section heading: "Veranstaltungen"
- List of upcoming events (2-3)
- Each: date badge (day + month) + title + location
- Link: "Mehr Veranstaltungen →"

### 4.14 Compose all sections in src/routes/+page.svelte
- Load all required data in +page.server.ts
- Render in exact order: 1→2→3→4→5→6→7→(main+sidebar wrapper)→8→9→10→11
- 2/3 + 1/3 sidebar layout for sections 8-11

**✅ Phase 4 complete when**: Homepage renders all 11 sections with real mock data, matches original layout exactly.

---

## PHASE 5 — ARTICLE SINGLE PAGE

### 5.1 Create route src/routes/[category]/[slug]/+page.server.ts
- Load article by slug
- Handle 3-level routes ([cat]/[subcat]/[slug])
- Return 404 if not found

### 5.2 Build ArticleHero.svelte
- Full-width thumbnail (max-height 500px)
- Category badge overlay
- Photo credit (if any)

### 5.3 Build ArticleBody.svelte
- Props: `content: string` (HTML)
- Render using `{@html content}` with sanitization
- Prose styles: paragraphs, headings, lists, blockquotes, images
- All text in Open Sans 16px, line-height 1.8
- H2/H3 subheadings in Roboto bold

### 5.4 Build article +page.svelte
- 70/30 split layout (article / sidebar)
- Top: Breadcrumb
- Article: HeroSpotlight thumbnail + category badge + h1 title (Lora 700) + author + date + body
- Sidebar: ProductSidebar + DirectoryLogos + EventsWidget
- Bottom: Tags row + "Ähnliche Artikel" related grid (4 articles same category)
- Social share buttons (Facebook, X, copy link)
- PRO content gate: blur overlay + "Upgrade auf PRO" if isPro = true and user not PRO

**✅ Phase 5 complete when**: Articles render correctly, sidebar shows, related articles work.

---

## PHASE 6 — CATEGORY ARCHIVE PAGES

### 6.1 Create src/routes/category/[...slug]/+page.server.ts
- Parse slug array to determine category (and optional sub-category)
- Load articles for that category
- Support pagination (?page=2)

### 6.2 Build category +page.svelte
- Category heading (h1 in Roboto) + article count
- 2-column article grid (ArticleCard) with pagination
- Sidebar (same components as article page)

### 6.3 Test all 16 category routes
- /category/gartenpraxis
- /category/pflanzen
- /category/pflanzen/stauden
- /category/pflanzen/sommerflor
- /category/pflanzen/rosen
- /category/pflanzen/pflanzenempfehlungen
- /category/pflanzen/wasserpflanzen
- /category/pflanzenschutz
- /category/rasen
- /category/wissen
- /category/aktuelles
- /category/aktuelles/schweiz
- /category/aktuelles/europa
- /category/aktuelles/welt
- /category/gartentechnik
- /category/produktschau

**✅ Phase 6 complete when**: All 16 category URLs load with correct filtered articles.

---

## PHASE 7 — EVENTS CALENDAR SYSTEM

### 7.1 Create events data helper
- getUpcomingEvents()
- getPastEvents()
- getEventBySlug(slug: string)
- getEventsByMonth(year: number, month: number)
- getEventsOnDate(date: Date)

### 7.2 Build EventCard.svelte
- Date badge (day + month blocks, purple bg)
- Title, location, time range
- Thumbnail
- Calendar export mini-buttons

### 7.3 Build EventListView.svelte
- Grouped by month heading
- EventCard per event
- "Vergangene Veranstaltungen" toggle/link

### 7.4 Build EventMonthView.svelte
- 7-column CSS grid (Mon–Sun)
- Current month name + year heading
- Prev/Next month arrows
- Days with events: highlighted with purple dot
- Click day → show events for that day

### 7.5 Build CalendarExport.svelte
- Export buttons:
  - Google Kalender (external link with gcal URL format)
  - iCalendar download
  - Outlook 365 link
  - Outlook Live link

### 7.6 Build events +page.svelte (main)
- Tab bar: Liste | Monat | Tag
- Tab switching via URL params or Svelte state
- Renders EventListView, EventMonthView, or day view based on active tab
- "Vergangene Veranstaltungen anzeigen" link at bottom

### 7.7 Build single event /veranstaltung/[slug] page
- Event title, date range, location, description
- CalendarExport buttons
- Map placeholder (optional)
- Related events

**✅ Phase 7 complete when**: All 4 event views work, single event page renders, export buttons functional.

---

## PHASE 8 — BUSINESS DIRECTORY

### 8.1 Build DirectoryCard.svelte
- Company logo (square 80px container)
- Company name
- Short description
- Category tag
- Website link + phone
- Hover: purple border

### 8.2 Build DirectoryGrid.svelte
- 3-column grid of DirectoryCards
- Responsive: 2-col tablet, 1-col mobile

### 8.3 Build /branchenverzeichnis +page.svelte
- Heading: "Branchenverzeichnis"
- DirectoryGrid with all 8+ entries
- Optional category filter tabs

### 8.4 Build /branchenverzeichnis/eintrag/[slug] +page.svelte
- Company logo (large)
- Full description
- Contact details: address, phone, email, website
- "Zur Webseite" button (purple)

**✅ Phase 8 complete when**: All 8 directory entries render, individual pages work.

---

## PHASE 9 — AUTH SYSTEM

### 9.1 Build LoginModal.svelte
- Overlay (fixed, full screen, dark bg 50% opacity)
- White centered card (max-width 420px)
- Close button (×) top-right
- 3 tabs: Anmelden | Registrieren | Passwort vergessen

**Anmelden tab:**
- Heading: "Herzlich willkommen!"
- Sub: "Melde dich in deinem Konto an"
- Input: Benutzername
- Input: Passwort (type="password")
- "Passwort vergessen?" link → switches to recover tab
- Button: "Anmelden" (full-width, purple)
- Divider: "oder"
- Link: "Ein Konto erstellen" → switches to register tab
- Note: Datenschutzerklärung link at bottom

**Registrieren tab:**
- Heading: "Herzlich willkommen!"
- Sub: "Registrieren Sie sich für ein Konto"
- Input: E-Mail-Adresse
- Input: Benutzername
- Note: "Ein Passwort wird Ihnen per Email zugeschickt."
- Button: "Registrieren" (full-width, purple)
- Datenschutzerklärung link

**Passwort vergessen tab:**
- Heading: "Passwort zurücksetzen"
- Input: E-Mail-Adresse
- Button: "Senden" (full-width, purple)
- Link: "Zurück zum Anmelden"

### 9.2 Keyboard + accessibility
- ESC key closes modal
- Focus trap inside modal
- aria-modal="true", role="dialog"
- Focus first input on open

### 9.3 Wire to API routes
- POST /api/auth/login → validate + set session cookie
- POST /api/auth/register → create user + send password email
- POST /api/auth/logout → clear session
- Use SvelteKit form actions (superforms)

### 9.4 Auth session in +layout.server.ts
- Read session cookie → load user → pass to all pages via `data.user`
- Protect /mein-konto/ — redirect to login if not authenticated

### 9.5 Build /mein-konto page
- Welcome message with username
- Subscription tier (Free / PRO)
- Upgrade CTA if Free tier
- Change password section
- Logout button

**✅ Phase 9 complete when**: Modal opens/closes, tabs switch, form submissions work, session persists on refresh.

---

## PHASE 10 — STATIC PAGES

### Build each with basic layout (heading + prose content):

#### 10.1 /impressum
- Company: Gartenmedien Ltd.
- Address: Via Campagna 19, 6595 Riazzino
- Phone: +41 (0)76 24 200 25
- Email: info@gartenwoche.ch
- Note: "Dieser Blog ist unabhängig und wird privat betrieben"

#### 10.2 /datenschutzerklaerung
- German GDPR/DSG privacy policy
- Covers: data processing, cookies, Google Fonts, AWIN affiliate
- Links to: impressum

#### 10.3 /allgemeine-geschaeftsbedingungen
- Swiss law governed
- Subscription terms, user content, liability

#### 10.4 /abonnement
- Pricing tiers: Free / PRO
- Benefits comparison table
- "Jetzt registrieren" CTA button
- Payment info placeholder

#### 10.5 /schreiben-sie-uns (Contact)
- Form: Name, E-Mail, Betreff, Nachricht, Submit
- Uses Superforms + Zod validation
- Success / error state

#### 10.6 /podcast-garten
- Podcast episode list
- Each: episode number, title, description, duration, play button

#### 10.7 /stellenangebote-fuer-die-gruene-branche
- Job board heading
- Job listing cards: title, company, location, date
- Empty state: "Keine aktuellen Stellenangebote" if no data

**✅ Phase 10 complete when**: All 7 static pages render with correct German content and layout.

---

## PHASE 11 — SEARCH SYSTEM

### 11.1 Build SearchBar.svelte
- Full-screen overlay (dark bg)
- Large centered input field
- Placeholder: "type here..."
- X button to close
- Results appear below input in real-time
- Keyboard: ESC → close, Enter → go to /search?q=...

### 11.2 Build /api/search/+server.ts
- GET /api/search?q=query
- Searches article titles + excerpts (basic string match or fuse.js)
- Returns: ArticlePreview[] as JSON

### 11.3 Build /search +page.svelte
- Shows full results page for ?q=term
- Article grid with count: "X Ergebnisse für 'stichwort'"
- Pagination if > 10 results
- Empty state if no results

**✅ Phase 11 complete when**: Typing in search shows real-time results, search page works.

---

## PHASE 12 — AUTHOR PAGES

### 12.1 Create /author/[slug] route
- Load author by slug
- Load all articles by that author

### 12.2 Build author +page.svelte
- Author avatar (placeholder if none)
- Author name (h1)
- Bio (if available)
- Article count
- Article grid (same as category page)

### 12.3 Wire author links
- Every ArticleCard and article page: author name is a link → /author/[slug]

**✅ Phase 12 complete when**: All 4 author pages render with their articles.

---

## PHASE 13 — WEATHER WIDGET + API

### 13.1 Create /api/weather/+server.ts
```typescript
export async function GET() {
  const apiKey = process.env.WEATHER_API_KEY;
  const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=Zurich&appid=${apiKey}&units=metric`);
  const data = await res.json();
  return json({ temp: Math.round(data.main.temp * 10) / 10, city: 'Zürich' });
}
```

### 13.2 Update +layout.server.ts
- Fetch weather from API endpoint
- Pass to layout: `data.weather = { temp: 10.7, city: 'Zürich' }`

### 13.3 Update HeaderMain.svelte
- Receive `weather` prop
- Display: `{weather.temp}°C {weather.city}`
- Handle loading state (show skeleton)
- Fallback: "—°C Zürich" if API fails

**✅ Phase 13 complete when**: Live temperature shows in header. Graceful fallback on API error.

---

## PHASE 14 — MEMBERSHIP / PRO SYSTEM

### 14.1 Add isPro flag to user session
- Check user.tier === 'pro' in layout

### 14.2 Build ProBadge.svelte
- Shows "PRO" badge next to logo in header when user is PRO
- Hidden for free/anonymous users

### 14.3 Build content gate for PRO articles
- In article page: if article.isPro && !user?.isPro:
  - Show first ~3 paragraphs
  - Blur overlay with "Upgrade auf PRO" CTA over rest of content
  - CTA links to /abonnement

### 14.4 Build /abonnement page properly
- Free vs PRO comparison table
- List PRO benefits: full article access, no ads, early access
- "Jetzt upgraden" button (links to payment, placeholder for now)

**✅ Phase 14 complete when**: PRO articles blurred for free users. PRO users see full content.

---

## PHASE 15 — SEO, META, SITEMAP

### 15.1 Add svelte:head to all routes
Every page needs:
```svelte
<svelte:head>
  <title>{title} | Gartenwoche</title>
  <meta name="description" content={description} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content={thumbnail} />
  <meta name="robots" content="max-image-preview:large" />
  <link rel="canonical" href={canonical} />
</svelte:head>
```

### 15.2 Create /sitemap.xml route
```typescript
// src/routes/sitemap.xml/+server.ts
// Generate XML with all static + dynamic URLs
```

### 15.3 Create /robots.txt
```
User-agent: *
Allow: /
Sitemap: https://gartenwoche.ch/sitemap.xml
```

### 15.4 Schema.org structured data
- Article pages: `Article` schema
- Events: `Event` schema
- Directory: `LocalBusiness` schema
- Homepage: `WebSite` schema + `SearchAction`

**✅ Phase 15 complete when**: All pages have correct meta tags, sitemap accessible.

---

## PHASE 16 — POLISH, ANIMATIONS, RESPONSIVE QA

### 16.1 Hover transitions
- All links: `transition: color 0.2s ease`
- All cards: `transition: box-shadow 0.2s ease` on hover (slight lift)
- Buttons: `transition: background-color 0.15s ease, transform 0.1s`
- Category badge: no transition
- Nav mega-menu: `transition: opacity 0.2s ease, transform 0.2s ease`

### 16.2 Mobile hamburger menu
- Hidden on desktop (>1024px)
- Visible on mobile (<1024px)
- Full-screen slide-in sidebar on click
- Same nav links + auth buttons
- Background overlay closes menu

### 16.3 Sticky nav scroll behavior
- On scroll past HeaderMain: compact logo appears in NavPrimary
- Add `scrolled` class to body via scroll event
- Logo in NavPrimary: hidden by default, `opacity: 1` when scrolled

### 16.4 Carousel polish
- Auto-play 5s interval on RotatingCarousel
- Pause on hover
- Smooth CSS transitions
- Dot indicators sync with current slide

### 16.5 Image placeholders
- All article thumbnails: `loading="lazy"` + placeholder blur while loading
- Use CSS `background-color: #e0e0e0` as placeholder base

### 16.6 Responsive QA checklist
```
Mobile (375px):
  ✓ TopBar: only auth buttons visible
  ✓ HeaderMain: logo centered, social icons row
  ✓ NavPrimary: hamburger only
  ✓ Homepage: all sections single column
  ✓ Article: full width, no sidebar
  ✓ Footer: stacked columns

Tablet (768px):
  ✓ TopBar: partial quick-links
  ✓ NavPrimary: condensed links or hamburger
  ✓ Homepage: 2-col grid
  ✓ Article: 2/3 article + 1/3 sidebar

Desktop (1200px):
  ✓ Full layout as designed
  ✓ All 11 homepage sections visible
  ✓ Sticky nav works
  ✓ Mega dropdown on hover
```

**✅ Phase 16 complete when**: Site looks correct on 375px, 768px, and 1200px breakpoints.

---

## PHASE 17 — FINAL REVIEW & DEPLOY

### 17.1 Final checklist
```
□ All 47+ pages/routes load without errors
□ All 16 category pages filter correctly
□ All 4 event calendar views work
□ All 8 directory entries have their own pages
□ All 4 author pages work
□ Login modal all 3 tabs work
□ Search real-time results work
□ Weather widget shows temperature
□ PRO content gate works
□ Sitemap.xml accessible
□ robots.txt in place
□ All fonts loading (Roboto, Open Sans, Lora)
□ Colors match original (#2D1B69, #F7C900, #F7F7F7)
□ Footer AWIN banner in place
□ Social links correct (FB, IG, X)
□ Contact email: info@gartenwoche.ch
□ Copyright: © 2025 Gartenwoche
□ German language throughout
□ No TypeScript errors (npm run check)
□ No ESLint errors (npm run lint)
```

### 17.2 Build and preview
```bash
npm run build
npm run preview
```

### 17.3 Deploy
```bash
# Option A: Node server
node build

# Option B: Vercel
npx vercel --prod

# Option C: Netlify
npx netlify deploy --prod
```

### 17.4 Environment variables on deploy
Set in host dashboard:
```
WEATHER_API_KEY=...
PUBLIC_SITE_URL=https://your-domain.com
```

**✅ Phase 17 complete when**: Site is live, all routes resolve, no console errors.

---

## QUICK REFERENCE — BUILD ORDER SUMMARY

```
0  → Scaffold + Install
1  → CSS Variables + Fonts
2  → TopBar + Header + Nav + Footer
3  → Data Types + Mock Data + Helper Functions
4  → Homepage (all 11 blocks)
5  → Single Article Page
6  → Category Archive Pages (all 16)
7  → Events Calendar (all 4 views + single event)
8  → Business Directory (index + 8 entries)
9  → Login/Register Modal + Auth Routes
10 → Static Pages (impressum, AGB, podcast, etc.)
11 → Search (overlay + results page)
12 → Author Archive Pages
13 → Weather API Integration
14 → PRO Membership Gate
15 → SEO Meta + Sitemap + robots.txt
16 → Polish + Animations + Mobile Responsive QA
17 → Final Checklist + Build + Deploy
```

**Total estimated components**: 50+
**Total routes**: 60+
**Total distinct URLs**: 150+