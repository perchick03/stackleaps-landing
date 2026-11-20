This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Hero work log (Sep 30 – Oct 4, 2026)

Where the home-page hero stands, and how to pick it up again.

### Versions (all on `main`, oldest first)

| Commit | What it is |
|---|---|
| `195fa8b` | Before: founder photo on the right, white hero |
| `2453ad6` | v1: photo replaced by a layered pipeline scene (outreach ledger, prospect reply, booked call) on an apricot panel |
| `9ee7965` | v2: the reply types in live, a "Replied for you" bubble answers with the booking link, then the This week card arrives |
| `0a9457b` | Headings back in Plus Jakarta Sans (Spectral serif from `28866d8` dropped; body stays Hanken Grotesk) |
| `0d139e8` | Header `overlay` mode: transparent over a dark hero, ink glass while scrolling over it, cream bar after |
| `2cabbf8` | v3 (current, live): dark ink hero with photographed paper in flight around the scene |

Look at an older one without losing anything: `git switch -c try-v2 9ee7965`.

### How v3 works

- `src/components/Hero.tsx`
  - `PAPERS`: the paper pieces, each with a depth (`far`, `mid`, `near`), position and size.
  - `DEPTH`: per-depth mouse travel, scroll lag and look (blur, dim).
  - `Plane`: moves one layer by mouse and scroll.
  - `T`: the load-sequence timings.
- Motion:
  - Far paper lags the scroll; near paper keeps pace so it never covers the copy.
  - Reduced motion gets a still, complete picture.
  - On phones, the conversation sequence starts when the scene scrolls into view.
- `src/components/Header.tsx`: `<Header overlay />` is used on the home page only. It looks for the `#hero` section.
- `src/app/globals.css`: colour tokens `--color-ink` (hero ground) and `--color-paper` (text on it).
- Assets in `public/images/hero/` (368 KB in total, with `public/images/stackleaps-logo-v2-light.webp`):
  - `plate.webp`: the backdrop.
  - `paper-01..10.webp`: cut-out envelopes and letters.
  - All mirrored so the light comes from the upper right.

### How the images were made

1. Generated with `google/gemini-3.1-flash-image-preview` through OpenRouter, using the key in `~/stackleaps/infra/.env`, at 2K and about $0.10 per image.
   - The paper was generated as several objects spread on a plain light-grey background.
   - Shared style line: *editorial still-life photograph, medium-format, 85mm, warm low late-afternoon sun from the upper left, cream paper, apricot light, ink navy, no text/logos/people*.
   - The backdrop prompt: *empty ink-navy seamless paper backdrop, one warm apricot beam from the upper left with dust motes*.
2. Each object was cut out locally and free with macOS Vision (`VNGenerateForegroundInstanceMaskRequest`).
3. Everything was mirrored and converted to WebP.

The scripts, raw images, prompts and spend log are in `.tmp/2026-10-04-hero-depth/`:

- `gen.py`: budget-capped generation, logged to `~/stackleaps/data/logs/costs-llm.csv`.
- `lift.swift`: the cut-out step.
- `process.py`: mirroring and WebP conversion.
- `notes.md`: the prompts, the spend and what was rejected.

That folder is gitignored, so it only exists on this machine.

Budget: $2 approved, $0.31 spent (3 images), $1.69 left.

### Open items and ideas

- **Next tests worth the remaining budget:**
  - a 4K backdrop;
  - more paper variety;
  - a light-theme backdrop to compare against.
- **Not verified yet:**
  - a real phone (only headless Chrome);
  - a Lighthouse run; the backdrop is likely the largest paint, and it loads with `priority`.
- **Docs out of date:**
  - `docs/PRODUCT.md` still says "A face, not a logo / lead with the founder". The face now only appears in the Origin section.
  - `docs/PRODUCT.md` also has an unused `## Register` section.
  - `docs/DESIGN.md` still names Plus Jakarta-only typography and doesn't cover the dark hero.
- **Illustration copy:** the roles and the "Good timing. Does Thursday at 10 work?" reply are made up, not real prospects.
- **Unused file:** `public/images/peretz-hero.avif` (the old photo) is kept for a revert.
- **Known noise:**
  - 5 lint errors and 1 warning were already there before this work, in `Funnel.tsx`, `ProposalHeader.tsx`, `dmc/Funnel.tsx` and `ebb-list/EbbHeader.tsx`. The header's error was fixed along the way.
  - A dev-only framer-motion "non-static position" warning comes from the hero's scroll tracking.
  - A dev-only hydration warning on `<html>` comes from a browser extension.
- **Dev server tips:**
  - `next.config.ts` allows `127.0.0.1` and `192.168.*.*`, so phone testing over the LAN works.
  - If a `globals.css` edit doesn't show up in dev, make any second edit to the file. Turbopack can serve a stale compile when that file changes at the same moment as another file.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
