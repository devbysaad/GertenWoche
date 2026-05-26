# 🌿 GartenWoche – Swiss Garden Magazine Clone

A SvelteKit web application cloning the editorial style of [gartenwoche.ch](https://gartenwoche.ch)

---

## 🗂️ Project Structure

```
GartenWoche/
├── src/
│   ├── app.css                     ← Global CSS: design tokens, resets, utilities
│   ├── app.html                    ← Root HTML shell (where SvelteKit injects the app)
│   ├── app.d.ts                    ← TypeScript ambient declarations (extends SvelteKit types)
│   ├── hooks.server.ts             ← Server hooks: auth session handling, request interception
│   │
│   ├── lib/                        ← Shared code (aliased as $lib)
│   │   ├── api/                    ← API client functions (fetch wrappers for the backend)
│   │   ├── auth/                   ← Auth helpers (session, user state)
│   │   ├── auth.ts                 ← Better-Auth configuration
│   │   ├── auth-client.ts          ← Client-side auth instance
│   │   ├── data/                   ← Static/seed data files (e.g. mock articles)
│   │   ├── server/                 ← Server-only helpers (DB, secrets — never sent to browser)
│   │   ├── stores/                 ← Svelte stores (reactive shared state)
│   │   ├── types/                  ← TypeScript interfaces and types
│   │   ├── utils/                  ← Pure utility functions (date formatting, slugs, etc.)
│   │   └── components/             ← All UI components, organized by purpose:
│   │       ├── articles/           ← Article card variants (small, large, featured)
│   │       ├── blocks/             ← Full-width page sections (Hero, MagazineGrid, etc.)
│   │       ├── directory/          ← Branchenverzeichnis (business directory) components
│   │       ├── events/             ← Event listing and search components
│   │       ├── layout/             ← App shell (Header, Footer, Nav, Sidebar, Breadcrumb)
│   │       └── ui/                 ← Small reusable UI primitives (Badge, Button, Pagination)
│   │
│   └── routes/                     ← SvelteKit file-based routing (each folder = a URL)
│       ├── +layout.svelte          ← Root layout: wraps all pages with Header + Footer
│       ├── +layout.server.ts       ← Loads session/auth data for the root layout
│       ├── +page.svelte            ← Homepage (/)
│       ├── +page.server.ts         ← Homepage data loader (hero, featured articles, etc.)
│       │
│       ├── category/[...slug]/     ← Category pages (e.g. /category/gartenpraxis)
│       ├── branchenverzeichnis/    ← Business directory listing + single entry pages
│       ├── search/                 ← Search results page
│       ├── veranstaltungen/        ← Events listing page
│       ├── veranstaltung/[slug]/   ← Single event detail page
│       ├── author/[slug]/          ← Author profile page
│       ├── stellenangebote-*/      ← Job listings for the green industry
│       ├── mein-konto/             ← User account area (protected)
│       ├── anmelden-registrieren/  ← Login / Register page
│       ├── api/                    ← Internal SvelteKit API endpoints (+server.ts files)
│       ├── sitemap.xml/            ← Auto-generated sitemap
│       ├── robots.txt/             ← robots.txt generation
│       └── [...path]/              ← Catch-all: renders individual article pages
```

---

## 🧩 Key Components Reference

| Component | Location | Purpose |
|---|---|---|
| `HeroSpotlight.svelte` | `blocks/` | Homepage hero (large image + stacked side articles) + category page mosaic |
| `MagazineGrid.svelte` | `blocks/` | 3×2 photo grid (first 5 articles) + 2-col card list (remaining) |
| `MixedArticleBlock.svelte` | `blocks/` | 3 rotating columns: Gartenpraxis / Wissen / Europa |
| `PflanzenStrip.svelte` | `blocks/` | Horizontal carousel for Pflanzen articles |
| `RasenGartenBlock.svelte` | `blocks/` | 60/40 split: big feature + stacked text articles |
| `ExclusiveBlock.svelte` | `blocks/` | Premium/exclusive article showcase |
| `VideoBlock.svelte` | `blocks/` | "Video der Woche" embedded video section |
| `DirectoryLogos.svelte` | `blocks/` | Branchenverzeichnis logo strip on homepage |
| `EventsWidget.svelte` | `blocks/` | Upcoming events sidebar widget |
| `ArticleCard.svelte` | `articles/` | Standard article card with image + title + excerpt |
| `ArticleCardLarge.svelte` | `articles/` | Large featured article card |
| `ArticleCardSmall.svelte` | `articles/` | Compact text-only article row |
| `CategoryBadge.svelte` | `ui/` | Black badge pill with white text (links to category) |
| `Pagination.svelte` | `ui/` | Square-button pagination (Brown active state) |
| `NavPrimary.svelte` | `layout/` | Main horizontal navigation bar |
| `Header.svelte` | `layout/` | Top header with logo + search + auth |
| `Footer.svelte` | `layout/` | Site footer |
| `Breadcrumb.svelte` | `layout/` | Breadcrumb trail navigation |

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# → Fill in DATABASE_URL, AUTH_SECRET, etc.

# Start dev server
npm run dev

# Build for production
npm run build
```

---

## 🎨 Design System

Defined in `src/app.css` as CSS custom properties:

| Token | Value | Usage |
|---|---|---|
| `--color-primary` | `#5a9e3a` | Nav active/hover ONLY |
| `--color-bg` | `#f7f7f7` | Page background |
| `--color-surface` | `#ffffff` | Cards, panels |
| `--color-text` | `#222222` | Body text |
| `--color-border` | `#e0e0e0` | Dividers, card borders |
| `--font-heading` | Roboto | All headings |
| `--font-body` | Open Sans | Body copy |

**Category badges / section headings use `background: #111; color: #fff`** — solid black, not green.

---

## 📄 Data Flow (How pages get their data)

```
Browser Request
    ↓
+layout.server.ts  ← Loads auth session (user info)
    ↓
+page.server.ts    ← Loads page-specific data (articles, entries, etc.)
    ↓
+page.svelte       ← Renders the page with `let { data } = $props()`
    ↓
Components         ← Receive article/entry arrays as props
```

---

## 🔧 Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `AUTH_SECRET` | Better-Auth secret key |
| `WORDPRESS_URL` | WordPress REST API base URL (for article content) |
| `PUBLIC_SITE_URL` | Canonical site URL |
