# PAPAS Willow Cricket Store — Next.js Frontend

A production-ready Next.js 14 frontend built from Figma designs for PAPAS Willow Cricket Store.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 3
- **Images**: Next.js `<Image />` with Figma asset URLs

---

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Pages

| Route | Description |
|---|---|
| `/` | Homepage — hero, departments, essentials, shoes, featured products, other departments, about |
| `/products` | Product listing — sidebar filters, sort, grid/list toggle |
| `/products/[slug]` | Product detail — gallery, size picker, add to cart, tabs, reviews, related |
| `/cricket/[category]` | Category listing (bats, shoes, helmets…) |
| `/cart` | Shopping cart with promo codes |
| `/checkout` | 3-step checkout: delivery → payment → review |
| `/account` | Login / Register + dashboard (orders, addresses, preferences, profile) |
| `/not-found` | Custom 404 page |

---

## Project Structure

```
src/
├── app/                         # Next.js App Router pages
│   ├── layout.tsx               # Root layout with nav + footer
│   ├── globals.css              # Tailwind + custom utilities
│   ├── page.tsx                 # Homepage
│   ├── not-found.tsx            # 404 page
│   ├── cart/page.tsx            # Cart
│   ├── checkout/page.tsx        # Checkout (3-step)
│   ├── account/page.tsx         # Account / login / register
│   ├── products/page.tsx        # Product listing
│   ├── products/[slug]/page.tsx # Product detail
│   └── cricket/[category]/page.tsx
│
├── components/
│   ├── layout/
│   │   ├── AnnouncementBar.tsx  # Orange top bar
│   │   ├── Navigation.tsx       # Header + mega-menu + mobile drawer
│   │   └── Footer.tsx           # Full footer with trust badges
│   ├── home/
│   │   ├── HeroBanner.tsx       # Full-width hero
│   │   ├── ShopByDepartment.tsx # Orange department cards strip
│   │   ├── ContentTileGrid.tsx  # Reusable 4-col / 2-col image tiles
│   │   ├── FeaturedProductsSection.tsx # Sticky player + product grid
│   │   ├── OtherDepartments.tsx # 5-column department grid
│   │   └── AboutSection.tsx     # Brand story (collapsible)
│   └── shared/
│       └── ProductCard.tsx      # Reusable product card with wishlist
│
└── lib/
    └── data.ts                  # All static data, types, Figma asset URLs
```

---

## Brand Colours

| Token | Value | Usage |
|---|---|---|
| Brand Orange | `#f69a39` | Primary CTA, accents, prices |
| Dark Text | `#1e1e21` | Body text, nav background |
| Section Dark | `#1a1a1a` | Section backgrounds |
| Off-black | `#010101` | Deepest backgrounds |

---

## Making It Dynamic

All data lives in `src/lib/data.ts`. To connect a real API:

1. Replace `PRODUCTS` array with a `fetch()` call to your product API
2. Replace `ASSETS` image URLs with your CDN/media URLs
3. Add server components where needed — the `"use client"` directive is only on components with interactivity

---

## Notes

- Figma image assets expire after **7 days** — replace with permanent CDN URLs before production
- `next.config.js` already whitelists `www.figma.com` for `next/image`
- All components are fully responsive (mobile-first)
- TypeScript strict mode is enabled — `tsc --noEmit` passes clean
