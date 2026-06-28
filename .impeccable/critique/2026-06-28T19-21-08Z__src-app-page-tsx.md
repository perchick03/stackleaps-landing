---
target: landing page
total_score: 33
p0_count: 0
p1_count: 2
timestamp: 2026-06-28T19-21-08Z
slug: src-app-page-tsx
---
# Critique: StackLeaps landing page (`src/app/page.tsx`)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Hover-opacity only on the primary CTA; no pressed/loading state on book action |
| 2 | Match System / Real World | 4 | Plain, jargon-free language throughout |
| 3 | User Control and Freedom | 3 | FAQ + modal close fine; Calendly iframe is a dead-end if it fails to load |
| 4 | Consistency and Standards | 4 | Highly consistent tokens and CTA, arguably too consistent (eyebrow on every section) |
| 5 | Error Prevention | 3 | ContactModal validation unverified; low error surface |
| 6 | Recognition Rather Than Recall | 4 | Single page, everything visible, clear labels |
| 7 | Flexibility and Efficiency | 3 | One path (book a call); fine for a landing page |
| 8 | Aesthetic and Minimalist Design | 3 | Per-section eyebrows, gradient buttons, muted-text whisper undercut the premium goal |
| 9 | Error Recovery | 3 | Mostly delegated to Calendly iframe; no local fallback |
| 10 | Help and Documentation | 3 | FAQ section covers this well |
| **Total** | | **33/40** | **Good — solid foundation, specific weak spots** |

## Anti-Patterns Verdict

**Does this look AI-generated? Partly, and fixably.** This is clearly hand-built above the median: a custom animated funnel with floating profile bubbles, a floating calendar card, real founder photography, hand-drawn underline SVGs. None of that is slop. But four reflex tells keep it from reading as genuinely premium/distinctive:

- **Eyebrow on every section** (absolute ban). Six tiny-uppercase-tracked kickers: "Built for B2B", "Sound familiar?", "Our Process", "The Story", "The Offer", "FAQ". This is the single loudest AI-grammar pattern on the page.
- **Identical 3-card grid** (absolute ban) in the Problem section: icon + heading + text × 3.
- **Single reflex-default font.** Plus Jakarta Sans (on the reflex-reject list) carries the whole page in one weight family; Instrument Serif is declared in tokens but never used.
- **Gradient fill on the primary button** — mild SaaS sheen, and it breaks contrast (see P1 below).

**Deterministic scan:** `detect.mjs` returned `[]` (no findings). Caveat: the bundled detector has limited reach into Tailwind-class JSX with CSS-variable colors, so absence of findings is not a clean bill. The contrast failures below were found by direct WCAG computation, not the scanner.

## Overall Impression

A good, credible, clearly human-made page that whispers where it should command. The bones are strong; the founder-as-the-product angle is the right one. The single biggest opportunity: stop hiding the things that build trust (the proof stat, the price) behind muted low-contrast text, and drop the template grammar (eyebrows, identical cards, one reflex font) that flattens an otherwise distinctive page.

## What's Working

1. **The founder-led narrative.** Real photos (hero, Kotor selfie), the Balkan Wanders origin story, "one founder to another." This is the un-copyable asset and the page leans on it. Exactly right for the trust goal.
2. **Custom motion that earns its place.** The animated funnel, rising profile bubbles, and floating calendar card are genuine craft, not stock scroll-fades. They demonstrate competence (the site is the sample).
3. **Honest, specific copy.** "Keep the ICP report, walk away", "$750/mo + $150/meeting", "7 quality introductions in 10 days". Concrete numbers, no buzzwords. This is the antidote to the cheesy-agency reflex.

## Priority Issues

### [P1] Primary CTA text fails contrast on the gradient's light half
- **Why it matters:** The orange gradient runs `#984800 → #ff8e3b`. White text is 6.44:1 on the dark left (good) but **2.29:1 on the light right** — below even the 3:1 large-text floor. This is the single conversion button, repeated in the Header, Hero, Funnel, and Pricing. Low-vision users can't read the right edge; everyone sees it wash out.
- **Fix:** Drop the gradient for a solid `#984800` (6.44:1), or move the light stop darker, or set the label to a dark ink on the orange. Solid is the premium move anyway.
- **Suggested command:** `/impeccable colorize` (or fold into `/impeccable polish`)

### [P1] Eyebrow-on-every-section is the loudest AI tell
- **Why it matters:** Six identical tiny-uppercase-tracked kickers are template grammar. It directly contradicts the "not generic SaaS template" anti-reference and caps how premium the page can feel.
- **Fix:** Remove most. Keep at most one as a deliberate, named device, or replace the rhythm with a real display typeface and stronger heading hierarchy. Numbers belong only where a section is a true sequence (the Funnel).
- **Suggested command:** `/impeccable typeset`

### [P2] One reflex-default font carries everything
- **Why it matters:** Plus Jakarta Sans is a training-data default, used in a single bold weight across every section; Instrument Serif is defined but unused. One geometric sans in extrabold reads as "picked by reflex" and flattens the editorial/premium feel.
- **Fix:** Choose a distinctive display face for headings paired on a contrast axis, or commit Instrument Serif intentionally for the founder-story voice. Tune the modular scale (≥1.25 steps).
- **Suggested command:** `/impeccable typeset`

### [P2] Muted "elegance" text drops below AA exactly where it sells
- **Why it matters:** The price-anchor line "Most agencies charge $5,000-$10,000/mo" is 2.43:1; the hero "Built for B2B" eyebrow 3.17:1; captions 3.81:1; inactive funnel stat 2.57:1. These carry selling information (price anchor, proof) yet are the hardest text to read. This is the classic "light gray for elegance" failure.
- **Fix:** Raise opacity floors. Body/captions to full `--on-surface-variant` or a verified ≥4.5:1; make the price-anchor and proof lines high-contrast, not whispered.
- **Suggested command:** `/impeccable polish`

### [P2] Identical 3-card grid in the Problem section
- **Why it matters:** Same-size icon+heading+text cards × 3 is the canonical "AI made this" layout, and another hit on the generic-SaaS anti-reference.
- **Fix:** Break the symmetry — vary card sizes/weight, or restructure as an asymmetric editorial list. Let one pain dominate.
- **Suggested command:** `/impeccable layout` (or `/impeccable bolder`)

### [P3] No reduced-motion path; infinite bounce reads gimmicky
- **Why it matters:** The floating calendar card's infinite y-bounce, the funnel pulse loops, and the rising bubbles have no `prefers-reduced-motion` alternative (accessibility gap), and the perpetual bounce slightly undercuts "quiet confidence."
- **Fix:** Add `@media (prefers-reduced-motion: reduce)` to halt loops; consider a single settle instead of an infinite bounce.
- **Suggested command:** `/impeccable harden` (or `/impeccable animate`)

## Persona Red Flags

**Jordan (First-Timer):** The funnel relies on abstract two-word stats ("Your Niche", "Personal", "Vetted", "Booked" / "No Tire-Kickers") that only make sense once the animation runs; on a static first glance they read as vague. The offer and price are clear, which saves it.

**Casey (Distracted Mobile):** The Calendly iframe is a fixed `minHeight: 900px` loaded eagerly with no `loading="lazy"` — heavy on 3G and a long scroll on a phone. The hero's absolute-positioned floating card (`-bottom-14 -left-8`) plus `overflow-hidden` on mobile risks clipping/collision; the `mb-20 sm:mb-24` compensation hints the overlap is already known.

**Riley (Stress Tester):** If Calendly fails to load, the final CTA is an empty white box with no fallback link. ContactModal form validation/success feedback is unverified. Index-based React keys in Pricing/FAQ.

**Dana (project persona — skeptical service-business owner who's been burned by agencies):** Wants proof above all. The proof stat "7 quality introductions in 10 days" is present and repeated — good — but styled muted/small in the hero and at `white/70` in the final CTA, i.e. quietest exactly where it should be loudest. The money-back ("keep the ICP report, walk away") and one-client-per-niche exclusivity land well.

## Minor Observations

- `Instrument Serif` is declared in `globals.css` but used nowhere — dead token or unrealized intent.
- `docs/DESIGN.md` is still DMC/travel-flavored ("Digital Curator") and out of sync with the now-generic page.
- Warm cream `--surface-low #F3F1E6` (the flagged 2026 AI-default neutral band) alternates with cool near-white `#f8f9ff` — slight warm/cool palette incoherence.
- Header `className` has a trailing space; Calendly iframe isn't lazy-loaded.
- Index used as React `key` in Pricing and FAQ.

## Questions to Consider

- What if the proof ("7 introductions in 10 days") were the loudest element in the hero instead of the smallest?
- If every section eyebrow vanished, what carries the rhythm — and could one real display typeface do the work of six kickers?
- Does the button gradient add any meaning, or just a SaaS sheen that also breaks contrast?
