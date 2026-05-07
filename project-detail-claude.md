# PROJECT DETAIL — Gartenwoche.ch SvelteKit Clone
> Exact 1:1 pixel-perfect clone of gartenwoche.ch using SvelteKit

---

## 1. PROJECT OVERVIEW

| Field | Value |
|---|---|
| **Project Name** | Gartenwoche SvelteKit Clone |
| **Original Site** | https://gartenwoche.ch |
| **Goal** | Exact pixel-perfect clone — every section, color, font, layout, interaction |
| **Framework** | SvelteKit (latest stable) |
| **Language** | TypeScript |
| **Styling** | TailwindCSS v4 + Custom CSS Variables |
| **Type** | Full-stack SSR Web Application |
| **Language of Content** | German (Swiss) |

---

## 2. ORIGINAL SITE TECHNICAL ANALYSIS

### 2.1 CMS & Theme
- **CMS**: WordPress 6.9.4
- **Theme**: Newspaper by TagDiv — "Pulses PRO" demo template
- **Page Builder**: tagDiv Composer
- **Membership**: TagDiv Paywall (PRO tier subscription)
- **Events Plugin**: The Events Calendar by Modern Tribe
- **Affiliate**: AWIN network

### 2.2 Typography System
| Font | Role | Weights | Source |
|---|---|---|---|
| **Roboto** | Headlines, nav, meta, UI labels | 400, 500, 700, 800, 900 | Google Fonts |
| **Open Sans** | Body text, excerpts, form fields | 400, 600, 700 | Google Fonts |
| **Lora** | Serif editorial / featured titles | 700 | Google Fonts |
| **Verdana, Geneva** | System fallback on body/p tags | 400 | System |
| **Newspaper Icon Font** | TagDiv custom SVG icons | — | TagDiv CDN |

Google Fonts URL (exact):
```
https://fonts.googleapis.com/css?family=Roboto:400,500,700,800,900|Open+Sans:400,600,700|Lora:700&display=swap
```

### 2.3 Color Palette (Pulses PRO)
| Name | Hex | Usage |
|---|---|---|
| **Dark Purple** | `#2D1B69` | Primary accent, top bar bg, footer bg, buttons, hover states |
| **Medium Purple** | `#4a0e4e` | Hover variant, deeper accent |
| **Intense Yellow** | `#F7C900` | Category labels, highlight badges, CTA accent |
| **Light Gray** | `#F7F7F7` | Page/body background |
| **White** | `#FFFFFF` | Cards, header, article backgrounds |
| **Near Black** | `#222222` | Primary body text, headings |
| **Mid Gray** | `#555555` | Secondary text, meta info, bylines |
| **Border Gray** | `#E0E0E0` | Card borders, dividers, separators |
| **Soft Gray** | `#999999` | Placeholder text, disabled states |
| **Tag Yellow BG** | `#FFF9D6` | Category pill background (light) |

### 2.4 CSS Variables (to define in app.css)
```css
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

  --radius-sm:            4px;
  --radius-md:            6px;
  --radius-lg:            8px;

  --header-height:        60px;
  --topbar-height:        36px;
  --max-width:            1200px;
  --sidebar-width:        300px;
  --gap:                  20px;
}
```

---

## 3. COMPLETE SITE STRUCTURE

### 3.1 URL Map — Every Page

#### A. Static Pages
| Route | SvelteKit Path | Description |
|---|---|---|
| `/` | `src/routes/+page.svelte` | Homepage |
| `/impressum` | `src/routes/impressum/+page.svelte` | Legal imprint |
| `/datenschutzerklaerung` | `src/routes/datenschutzerklaerung/+page.svelte` | Privacy policy |
| `/allgemeine-geschaeftsbedingungen` | `src/routes/agb/+page.svelte` | Terms & conditions |
| `/abonnement` | `src/routes/abonnement/+page.svelte` | Subscription page |
| `/schreiben-sie-uns` | `src/routes/kontakt/+page.svelte` | Contact form |
| `/podcast-garten` | `src/routes/podcast-garten/+page.svelte` | Podcast page |
| `/stellenangebote-fuer-die-gruene-branche` | `src/routes/stellenangebote/+page.svelte` | Job listings |
| `/branchenverzeichnis` | `src/routes/branchenverzeichnis/+page.svelte` | Business directory index |
| `/mein-konto` | `src/routes/mein-konto/+page.svelte` | Member account |
| `/anmelden-registrieren` | `src/routes/auth/+page.svelte` | Login/Register |

#### B. Category Archives
| Route | SvelteKit Path |
|---|---|
| `/category/gartenpraxis` | `src/routes/category/gartenpraxis/+page.svelte` |
| `/category/pflanzen` | `src/routes/category/pflanzen/+page.svelte` |
| `/category/pflanzen/stauden` | `src/routes/category/pflanzen/stauden/+page.svelte` |
| `/category/pflanzen/sommerflor` | `src/routes/category/pflanzen/sommerflor/+page.svelte` |
| `/category/pflanzen/rosen` | `src/routes/category/pflanzen/rosen/+page.svelte` |
| `/category/pflanzen/pflanzenempfehlungen` | `src/routes/category/pflanzen/pflanzenempfehlungen/+page.svelte` |
| `/category/pflanzen/wasserpflanzen` | `src/routes/category/pflanzen/wasserpflanzen/+page.svelte` |
| `/category/pflanzenschutz` | `src/routes/category/pflanzenschutz/+page.svelte` |
| `/category/rasen` | `src/routes/category/rasen/+page.svelte` |
| `/category/wissen` | `src/routes/category/wissen/+page.svelte` |
| `/category/aktuelles` | `src/routes/category/aktuelles/+page.svelte` |
| `/category/aktuelles/schweiz` | `src/routes/category/aktuelles/schweiz/+page.svelte` |
| `/category/aktuelles/europa` | `src/routes/category/aktuelles/europa/+page.svelte` |
| `/category/aktuelles/welt` | `src/routes/category/aktuelles/welt/+page.svelte` |
| `/category/gartentechnik` | `src/routes/category/gartentechnik/+page.svelte` |
| `/category/produktschau` | `src/routes/category/produktschau/+page.svelte` |

#### C. Dynamic / Template Routes
| Route Pattern | SvelteKit Path |
|---|---|
| `/[category]/[slug]` | `src/routes/[category]/[slug]/+page.svelte` |
| `/[cat]/[subcat]/[slug]` | `src/routes/[cat]/[subcat]/[slug]/+page.svelte` |
| `/branchenverzeichnis/eintrag/[slug]` | `src/routes/branchenverzeichnis/eintrag/[slug]/+page.svelte` |
| `/veranstaltung/[slug]` | `src/routes/veranstaltung/[slug]/+page.svelte` |
| `/author/[slug]` | `src/routes/author/[slug]/+page.svelte` |
| `/search` | `src/routes/search/+page.svelte` |

#### D. Events Calendar Routes
| Route | SvelteKit Path |
|---|---|
| `/veranstaltungen` | `src/routes/veranstaltungen/+page.svelte` |
| `/veranstaltungen/list` | `src/routes/veranstaltungen/list/+page.svelte` |
| `/veranstaltungen/monat` | `src/routes/veranstaltungen/monat/+page.svelte` |
| `/veranstaltungen/heute` | `src/routes/veranstaltungen/heute/+page.svelte` |

---

## 4. COMPONENT INVENTORY

### 4.1 Layout Components
```
src/lib/components/layout/
  ├── TopBar.svelte              # Utility top bar (login, quick nav)
  ├── HeaderMain.svelte          # Logo + weather + social icons zone
  ├── NavPrimary.svelte          # Main sticky navigation with dropdowns
  ├── MegaMenu.svelte            # Dropdown mega-menu for Pflanzen/Aktuelles
  ├── Footer.svelte              # Footer with PRO badge + links + affiliate
  ├── FooterCTA.svelte           # "Hier registrieren" subscription call-to-action
  └── Breadcrumb.svelte          # Page breadcrumb trail
```

### 4.2 UI / Micro Components
```
src/lib/components/ui/
  ├── Logo.svelte                # SVG logo component
  ├── WeatherWidget.svelte       # Live weather display (Zürich)
  ├── SearchBar.svelte           # Search overlay with autocomplete
  ├── LoginModal.svelte          # Ajax-style login/register/recover overlay
  ├── CategoryBadge.svelte       # Yellow category pill/tag
  ├── AuthorMeta.svelte          # Author name + date display
  ├── SocialIcons.svelte         # Facebook / Instagram / X icons
  ├── ProBadge.svelte            # "PRO" subscription badge
  ├── Pagination.svelte          # Article list pagination
  └── VideoEmbed.svelte          # "Video der Woche" iframe embed
```

### 4.3 Article / Content Components
```
src/lib/components/articles/
  ├── ArticleCard.svelte         # Standard article card (image + title + meta)
  ├── ArticleCardLarge.svelte    # Featured hero card (large image overlay)
  ├── ArticleCardSmall.svelte    # Compact sidebar/list card
  ├── ArticleCardHorizontal.svelte # Horizontal thumbnail + text layout
  ├── ArticleList.svelte         # Vertical list of article cards
  ├── ArticleGrid.svelte         # Grid of article cards (responsive)
  ├── ArticleHero.svelte         # Full-width hero/spotlight module
  ├── ArticleBody.svelte         # Article body content renderer
  └── ArticleCarousel.svelte     # Horizontal sliding strip carousel
```

### 4.4 Block / Section Components (Homepage)
```
src/lib/components/blocks/
  ├── HeroSpotlight.svelte       # Section 1 — Large featured article
  ├── FeaturedGrid.svelte        # Section 2 — 4-column news card grid
  ├── PflanzenStrip.svelte       # Section 3 — Pflanzenempfehlungen horizontal
  ├── RasenGartenBlock.svelte    # Section 4 — Rasen + Gartenpraxis duo
  ├── VideoBlock.svelte          # Section 5 — Video der Woche
  ├── MixedArticleBlock.svelte   # Section 6 — Multi-category vertical lists
  ├── RotatingCarousel.svelte    # Section 7 — Auto-rotating feature slider
  ├── ProductSidebar.svelte      # Section 8 — Produktvorschläge sidebar
  ├── ThreeColBlock.svelte       # Section 9 — Pflanzenschutz/Produkt/Rasen
  ├── DirectoryLogos.svelte      # Section 10 — Branchenverzeichnis logo strip
  └── EventsWidget.svelte        # Section 11 — Upcoming events mini-widget
```

### 4.5 Directory & Events Components
```
src/lib/components/directory/
  ├── DirectoryCard.svelte       # Business directory listing card
  └── DirectoryGrid.svelte       # Directory entries grid

src/lib/components/events/
  ├── EventCard.svelte           # Single event card
  ├── EventListView.svelte       # Events in list layout
  ├── EventMonthView.svelte      # Events in calendar/month layout
  └── EventCalendarExport.svelte # iCal / Google Calendar export buttons
```

---

## 5. DATA MODELS

### 5.1 Article / Post
```typescript
interface Article {
  id:          string;
  slug:        string;
  title:       string;
  excerpt:     string;
  content:     string;          // HTML rich content
  category:    Category;
  subCategory?: Category;
  author:      Author;
  publishedAt: Date;
  updatedAt:   Date;
  thumbnail:   string;          // image URL
  tags:        string[];
  isPro:       boolean;         // paywall flag
  commentCount: number;
}
```

### 5.2 Category
```typescript
interface Category {
  id:       string;
  name:     string;
  slug:     string;
  parent?:  string;             // parent category slug
  count:    number;
}
```

### 5.3 Author
```typescript
interface Author {
  id:       string;
  name:     string;
  slug:     string;
  avatar?:  string;
  bio?:     string;
}
```

### 5.4 Event
```typescript
interface GartenEvent {
  id:          string;
  slug:        string;
  title:       string;
  description: string;
  startDate:   Date;
  endDate:     Date;
  location:    string;
  city:        string;
  country:     string;
  thumbnail:   string;
  organizer?:  string;
  websiteUrl?: string;
}
```

### 5.5 DirectoryEntry
```typescript
interface DirectoryEntry {
  id:          string;
  slug:        string;
  name:        string;
  logo:        string;
  description: string;
  address:     string;
  phone?:      string;
  email?:      string;
  website?:    string;
  category:    string;
}
```

### 5.6 User / Member
```typescript
interface User {
  id:        string;
  username:  string;
  email:     string;
  tier:      'free' | 'pro';
  createdAt: Date;
}
```

---

## 6. AUTHORS (confirmed)

| Slug | Display Name | Role |
|---|---|---|
| `redaktion-aktuelles` | News-Redaktion | News editorial team |
| `redaktion-wissen` | Redaktion Wissen | Knowledge/science team |
| `redaktion-gartenpraxis` | Redaktion Gartenpraxis | Garden practice team |
| `stemalo` | Peter Sturm | Main author / owner |

---

## 7. CONFIRMED CONTENT ENTRIES

### 7.1 Confirmed Articles
| Slug | Category | Author |
|---|---|---|
| nuesslisalat-ganzjaehriger-vitaminchampion | Schweiz | News-Redaktion |
| kress-voyager-hohe-maehleistung-fuer-profis | Produktschau | — |
| zeitliche-veraenderungen-im-laubfall... | Schweiz | News-Redaktion |
| biohybride-pflanzen-unibz... | Wissen | Redaktion Wissen |
| zwitschern-laesst-sich-pflanzen... | Gartenpraxis | Redaktion Gartenpraxis |
| neue-hortensie-runaway-bride | Pflanzenempfehlungen | News-Redaktion |
| der-steppensalbei-salvia-nemorosa... | Stauden | Peter Sturm |
| alternative-zur-lorbeerkirsche... | Pflanzenempfehlungen | Redaktion Gartenpraxis |
| hirse-im-rasen | Rasen | — |
| lebende-alternative-zum-sonnenschirm | Gartenpraxis | Redaktion Gartenpraxis |
| die-maulwurfsgrille-oder-werre | Pflanzenschutz | — |
| hydro-mousse-spruehen-fertig-rasen | Produktschau | Peter Sturm |
| mit-gartenpalmen-den-spaetsommer-geniessen | Pflanzenempfehlungen | — |
| der-schwarze-diamant-ein-ungewoehlicher-apfel-aus-tibet | Welt | — |
| was-blueht-da-am-wegesrand | Wissen | Redaktion Wissen |

### 7.2 Confirmed Events
| Slug | Title | Date | Location |
|---|---|---|---|
| rhs-chelsea-flower-show | RHS Chelsea Flower Show | 19–23 Mai 2026 | London, UK |
| wyss-gartenakademie | Wyss Gartenakademie | — | Gartenhaus Zuchwil |

### 7.3 Confirmed Directory Entries
| Slug | Name |
|---|---|
| pflanzenschau-ag-2 | Pflanzenschau AG |
| erni-gartenbau-ag-2 | Erni Gartenbau AG |
| spross-ga-la-bau-ag-2 | Spross Ga-La-Bau AG |
| eibe-ag-2 | eibe AG |
| trend-und-blumenboerse-luzern-2 | Trend und Blumenbörse Luzern |
| zebra-ag-garten-und-pool-2 | Zebra AG Garten und Pool |
| gartenbijoux-2 | Gartenbijoux |
| il-vivaio-2 | Il Vivaio |

---

## 8. OPERATOR INFORMATION

| Field | Value |
|---|---|
| **Company** | Gartenmedien Ltd. |
| **Address** | Via Campagna 19, 6595 Riazzino, Switzerland |
| **Phone** | +41 (0)76 24 200 25 |
| **Email** | info@gartenwoche.ch |
| **Website** | www.gartenwoche.ch |
| **Copyright** | © 2025 Gartenwoche. Alle Rechte vorbehalten. |
| **Note** | Privately operated independent gardening blog |

---

## 9. SPECIAL FEATURES TO IMPLEMENT

### 9.1 Login/Register Modal
- Overlay modal (not a separate page) triggered by click
- 3 tabs: Anmelden (Login) / Registrieren (Register) / Passwort vergessen
- Fields: Benutzername, Passwort
- Privacy policy link inside modal
- "Herzlich willkommen!" heading

### 9.2 Weather Widget
- Display: Temperature (°C) + City name (Zürich)
- Position: secondary header bar, left of social icons
- Uses OpenWeatherMap API or static mock

### 9.3 PRO Membership System
- Free users: all articles visible
- PRO users: unlocked exclusive content
- PRO badge shown in header (next to logo)
- /abonnement/ page for upgrade

### 9.4 Events Calendar
- List view (default)
- Month grid view
- Day/Today view
- Past events filter
- Export to: Google Calendar, iCal, Outlook 365, Outlook Live

### 9.5 Search
- Full-text search overlay
- Appears on nav icon click
- Placeholder: "type here..."
- Real-time results

### 9.6 "Video der Woche"
- iframe embed section in homepage
- Caption text below video

### 9.7 Affiliate Banner
- Footer: AWIN 300×250 affiliate banner
- Link: awin1.com/cread.php?s=2436107&v=15934&q=368245&r=602261

---

## 10. SOCIAL MEDIA LINKS

| Platform | URL |
|---|---|
| Facebook | https://www.facebook.com/gartenwoche |
| Instagram | https://www.instagram.com/gartenwoche/ |
| X (Twitter) | https://x.com/PeterRedaktion |