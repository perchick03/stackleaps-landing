# Project Overview

You are a senior UI designer and frontend developer.

This repo is public landing page for **StackLeaps** — a B2B lead generation agency that books qualified sales meetings via cold email campaigns. Single-page static site. No backend, no database, no auth. Calendly for booking. Vercel for hosting. Domain: stackleaps.com.

## Commands

```bash
npm run dev          # Start dev server (Turbopack) — http://localhost:3000
npm run build        # Production build (static export)
npm run start        # Serve production build locally
npm run lint         # ESLint (flat config, eslint.config.mjs)
```

No test framework is configured yet.

## Architecture

- **Next.js 16** with App Router, TypeScript, Tailwind CSS 4
- **Static site** — no server components that fetch data, no API routes
- `src/app/page.tsx` — main landing page (all sections composed here)
- `src/app/layout.tsx` — root layout, fonts (Geist), global metadata
- `src/app/globals.css` — Tailwind imports + CSS custom properties
- Path alias: `@/*` maps to `./src/*`

### Planned page structure (9 sections, single page)

Hero → Problem → Solution → How It Works → Who It's For → Trust Stack → Pricing → FAQ → Final CTA

Each section will be a component in `src/components/`. No navigation menu (intentional — reduces conversion leaks per landing page research).

### Key integrations

- **Calendly** — embedded booking widget (hero + final CTA sections). Use `@calendly/react` or inline embed script.
- **Framer Motion** — scroll-based animations, section entrance effects. Use `useScroll` + `useTransform` for image sequences.
- **Vercel Analytics** — add `@vercel/analytics` package, one-line setup in layout.
- **next/image** — mandatory for all images (automatic WebP, responsive sizing).

## Performance Requirements

- Lighthouse Performance > 90, LCP < 2.5s
- Lazy load all below-fold media (`loading="lazy"`)
- Hero video: `preload="none"` or `preload="metadata"`, keep under 2MB, WebM + MP4 fallback
- Use `next/image` for all images — never raw `<img>` tags

## Design Constraints

- Mobile-first responsive design (Tailwind breakpoints)
- No dark mode needed — landing page only
- Copy framework: PAS (Problem-Agitate-Solution)
- Going wide across niches — qualify by situation, not industry
- Reference `docs/research/landing_page_playbook.md` for copy and conversion guidance

## Key Context

- Founder has Python/C++ background, not JS/TS — keep code straightforward
- No over-engineering: if it works and ships, it's good enough
- Domain DNS needs pointing to Vercel (currently on GoDaddy placeholder)
- Next.js 16 has breaking changes from older versions — check `node_modules/next/dist/docs/` when unsure about APIs
