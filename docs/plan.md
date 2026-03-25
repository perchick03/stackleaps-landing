# Landing Page Build Plan — StackLeaps Lead Gen Agency

## Context

Peretz is launching a B2B lead generation agency (cold email outreach → booked meetings for clients). Launch date: Monday March 30, 2026. He needs a public-facing landing page to showcase the offer and let prospects book calls. He has zero testimonials/social proof (new agency), wants to go wide across niches, and wants visually distinctive design with scroll-based animations. The landing page playbook research is complete at `docs/research/landing_page_playbook.md`.

## Decisions Made

| Decision | Choice | Why |
|----------|--------|-----|
| Repo | New repo | Separate from internal dashboard |
| Framework | Next.js | SEO, image optimization, SSG, tutorial compatibility |
| Hosting | Vercel | Free tier, instant deploys, custom domain, CDN |
| Contact method | Calendly embed | Zero backend, handles scheduling + reminders + timezone |
| Lead qualification | Calendly form questions | 2-3 qualifying Qs in booking flow (role, company size, budget) |
| Analytics | Vercel Analytics | Zero config, free tier, no cookie banner needed |
| Animations | Scroll-based video/image sequences | Not heavy 3D — AI-generated video + image swap on scroll |
| Domain | Has one already | Point DNS to Vercel |
| Database | None needed | Calendly + spreadsheet until volume justifies CRM |
| CRM | None at launch | Calendly email notifications → manual follow-up |
| Backend | None | Fully static site (SSG) |
| Pages | Single page | One landing page, no multi-page site |

## What You DON'T Need (Cutting Scope)

- **No database** — Calendly stores bookings, you get email notifications
- **No CRM** — Track leads in a spreadsheet/Notion. Add a CRM (HubSpot free, Pipedrive) when you hit ~20+ leads/month
- **No backend/API** — Static site. Calendly is the only integration.
- **No form service** — Calendly IS your form. If you later want a "send a message" form, add Formspree (2 min setup)
- **No auth** — Public page, no login needed
- **No email automation** — Calendly sends booking confirmations automatically

## Tech Stack

```
Next.js 15 (App Router, Static Export)
TypeScript
Tailwind CSS 4 (utility-first, fast to build)
Framer Motion (scroll animations, page transitions)
Calendly embed (@calendly/react or inline script)
Vercel (hosting + analytics + domain)
```

**Why Tailwind?** You're building from scratch with custom design. Tailwind lets you move fast without writing CSS files, handles responsive/mobile-first out of the box, and plays perfectly with Next.js.

**Why Framer Motion?** You already know it (used in your dashboard). Handles scroll-triggered animations, parallax effects, and the image sequence transitions you described.

## Page Structure (Single Page, 9 Sections)

Based on the research playbook — PAS (Problem-Agitate-Solution) copy framework:

```
┌─────────────────────────────────────────┐
│ 1. HERO (Above the Fold)                │
│    - Outcome headline (6-8 words)       │
│    - Subheadline (who + how)            │
│    - Primary CTA → Calendly             │
│    - Scroll-based video/animation       │
│    - One trust signal (guarantee badge) │
├─────────────────────────────────────────┤
│ 2. PROBLEM                              │
│    - 3 pain points (PAS: agitate)       │
│    - "Sound familiar?" hook             │
├─────────────────────────────────────────┤
│ 3. SOLUTION                             │
│    - Named methodology intro            │
│    - "Here's what we do differently"    │
├─────────────────────────────────────────┤
│ 4. HOW IT WORKS                         │
│    - 3-4 steps with timelines           │
│    - Visual process flow                │
│    - Image sequence animation here      │
├─────────────────────────────────────────┤
│ 5. WHO IT'S FOR                         │
│    - Situation-based qualifiers         │
│    - NOT industry list (going wide)     │
├─────────────────────────────────────────┤
│ 6. TRUST STACK                          │
│    - Performance guarantee              │
│    - ROI math / calculator              │
│    - Founder photo + LinkedIn           │
│    - Tool logos ("Built on")            │
├─────────────────────────────────────────┤
│ 7. PRICING SIGNAL                       │
│    - Range or "starting at"             │
│    - What's included per tier           │
│    - Secondary CTA                      │
├─────────────────────────────────────────┤
│ 8. FAQ                                  │
│    - 5-7 objection-handling questions   │
│    - Accordion/expandable               │
├─────────────────────────────────────────┤
│ 9. FINAL CTA                            │
│    - Repeat headline promise            │
│    - Calendly embed (inline or popup)   │
│    - "What happens next" copy           │
└─────────────────────────────────────────┘
```

**No navigation menu.** Research says: remove nav from landing pages — it's a leak point. Single page, scroll down, one goal.

## Animation Strategy

Two effects based on your tutorials:

1. **Hero section**: AI-generated video (muted autoplay, optimized for web). Use `<video>` tag with `next/video` or manual optimization. Compress to WebM + MP4 fallback. Keep under 2MB for fast load.

2. **Scroll-triggered image sequence**: As user scrolls through a section (likely "How It Works" or "Solution"), images swap frame-by-frame creating a motion effect. Implement with Framer Motion `useScroll` + `useTransform` hooks. Preload images for smooth playback.

**Performance guard rails:**
- Lazy load video (don't block LCP)
- Use `loading="lazy"` on below-fold images
- Serve images via Next.js `<Image>` (automatic WebP, sizing)
- Video: `preload="none"` or `preload="metadata"`
- Target: LCP < 2.5s (hero text renders first, video loads after)

## Build Steps (Ordered)

### Phase 1: Project Setup (30 min)
1. Create new repo (`stackleaps-landing` or similar)
2. `npx create-next-app@latest` with TypeScript + Tailwind + App Router
3. Connect to GitHub repo
4. Deploy to Vercel (connect repo, takes 2 min)
5. Point custom domain DNS to Vercel
6. Verify site is live at your domain

### Phase 2: Content + Structure (3-4 hours)
7. Write all 9 sections' copy (use playbook as guide)
8. Build page skeleton — all sections with real content, no styling yet
9. Add Calendly embed component (hero CTA + bottom section)
10. Add Calendly qualifying questions (role, company size, budget range)

### Phase 3: Design + Styling (3-4 hours)
11. Tailwind base setup (colors, fonts, spacing)
12. Mobile-first responsive layout for all sections
13. Hero section design
14. Section-by-section styling
15. FAQ accordion component
16. CTA button design + hover states

### Phase 4: Animations (2-3 hours)
17. Hero video integration (compress + optimize first)
18. Scroll-triggered image sequence
19. Framer Motion section entrance animations
20. Smooth scroll behavior

### Phase 5: Polish + Launch (1-2 hours)
21. SEO meta tags (title, description, OG image)
22. Favicon + OG image
23. Mobile testing (real device)
24. Vercel Analytics setup (one line of code)
25. Speed test (Lighthouse, target 90+ performance)
26. Final review + go live

**Total estimated: ~10-14 hours of hands-on work**

## Tradeoffs Acknowledged

| Choice | Upside | Downside | Mitigation |
|--------|--------|----------|------------|
| Scroll animations | Visually distinctive, memorable | Adds complexity, performance risk | Lazy load everything, test on mobile, cut if slow |
| No CRM | Simple, no cost | Manual lead tracking | Spreadsheet now, add CRM at ~20 leads/month |
| No nav menu | Higher conversion (research-backed) | Visitors can't jump to sections | Add smooth scroll anchors if needed later |
| Calendly only | Zero backend | Dependent on Calendly uptime | Calendly has 99.9% uptime, add email fallback if worried |
| Going wide (no niche) | Larger addressable market | Risk of looking generic | Problem-centric copy, qualify by situation not industry |
| Next.js (new to you) | Better for landing pages, SEO, images | Learning curve | App Router is simpler than Pages Router. One page = minimal Next.js knowledge needed |

## Verification

1. **Loads fast**: Lighthouse Performance score > 90, LCP < 2.5s
2. **Mobile works**: Test on real iPhone/Android, all CTAs tappable, text readable
3. **Calendly works**: Can book a test call, qualifying questions appear
4. **Analytics work**: Vercel dashboard shows page views after deploy
5. **Domain works**: Custom domain loads with HTTPS
6. **Animations smooth**: No jank on scroll, video plays on mobile
7. **Content complete**: All 9 sections have real copy, no lorem ipsum

## Key Files (Expected Structure)

```
stackleaps-landing/
├── app/
│   ├── layout.tsx          # Root layout, fonts, metadata
│   ├── page.tsx            # Main landing page (all 9 sections)
│   └── globals.css         # Tailwind base + custom styles
├── components/
│   ├── Hero.tsx
│   ├── Problem.tsx
│   ├── Solution.tsx
│   ├── HowItWorks.tsx
│   ├── WhoItsFor.tsx
│   ├── TrustStack.tsx
│   ├── Pricing.tsx
│   ├── FAQ.tsx
│   ├── FinalCTA.tsx
│   ├── CalendlyEmbed.tsx
│   └── ScrollAnimation.tsx # Reusable scroll-triggered wrapper
├── public/
│   ├── video/              # Hero video (WebM + MP4)
│   ├── images/             # Scroll sequence frames + founder photo
│   └── favicon.ico
├── next.config.ts
├── tailwind.config.ts
└── package.json
```

## What to Research Before Building

1. **Calendly React integration** — check if `@calendly/react` works with Next.js App Router, or use inline embed script
2. **Your tutorial** — follow it for the video/scroll animation, adapt to this project structure
3. **Tailwind + Next.js setup** — `create-next-app` handles this automatically now
4. **Vercel domain setup** — add CNAME/A records from your domain registrar

## Open Items for Peretz

- [ ] What's your domain name? (for Vercel setup)
- [ ] Do you have the AI-generated video ready, or is that still to be created?
- [ ] Do you have a Calendly account set up?
- [ ] Founder photo ready for Trust Stack section?
- [ ] Have you decided on your named methodology / framework name?
