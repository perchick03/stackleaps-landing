# StackLeaps — Business Context Document

**Last updated:** 2026-03-25
**Purpose:** Background context for AI assistants working on StackLeaps-related tasks. Go-to reference for understanding the business, niche, positioning, and current state.

---

## The Business

**StackLeaps** is a B2B lead generation service founded by Peretz Levinov. We run cold email outreach campaigns that book qualified sales calls for our clients. Solo operator model — no employees, AI-augmented workflows, occasional hired services only.

**Revenue target:** 4–5 clients at ~$2,500/mo each = $10K–$12.5K/mo.

**Business model:** Done-for-you cold email outreach. We handle list building, email infrastructure, copywriting, campaign execution, and call booking. Client's only job is to show up to calls.

---

## The Founder

**Peretz Levinov** — Senior software engineer who left a $250K/yr job to build this. Based in Bulgaria (EET timezone). ~1 year of runway. Deep technical background means strong infrastructure and automation capabilities, but also a tendency to over-engineer. Prefers direct, no-fluff communication.

---

## Current Niche: DMC (Destination Management Companies)

### What is a DMC?
A local ground operator in a tourism destination that provides logistics, guides, transport, accommodations, and experiences for incoming travelers. They work B2B — tour operators and travel advisors send them clients. Think of them as the invisible hands behind a vacation.

### Why this niche?
- **Validated proof:** Ran a pilot for Balkan Wanders (a Balkans DMC) — 7 booked calls from 1,200 leads in 10 days, 4 moved to sample itinerary, 2 serious prospects.
- **Low cold email saturation:** Only 7.8% of the travel industry uses cold email. Blue ocean.
- **Clear pain point:** DMCs rely on trade shows ($15K–$40K per event) and referrals. Both plateau. We offer a cheaper, continuous alternative.
- **Domain expertise:** Peretz understands DMC operations from the Balkan Wanders campaign.

### Industry snapshot
- Global DMC market: $9.3B (2025), 10,000+ companies worldwide
- 67% have ≤25 employees, 80% have ≤50
- Revenue: $500K–$10M depending on size
- Marketing spend: $50K–$70K/year (~17% of revenue)
- Primary growth channels: trade shows (IMEX, IBTM, ITB, WTM), referrals, directories
- Decision makers: Owner/Founder/Managing Director (≤25 employees), Account Executive/Market Director (25–50)

### Niche evaluation score: 117/185 (Promising)
**Strengths:** Direct proof, low saturation, fast sales cycle (30–45 days for TO partnerships), operational expertise
**Weaknesses:** Small TAM (3,000–6,000 reachable DMCs), tight deal economics at low end, category education needed, weak triggers

---

## ICP — Who We Sell TO (Our Clients)

Small DMCs (1–50 employees) headquartered in tourism destinations (Southern Europe, SE Asia, Latin America, Middle East, Africa). They operate on the ground with local guides, vehicles, and supplier networks. They need international tour operator and travel advisor partners but can't do outbound sales themselves because the owner is running operations.

**Ideal client profile:**
- 5–50 employees, $500K–$10M revenue
- 3+ years in operation, established reputation
- Based in a high-demand Western tourism destination
- No dedicated sales team — owner does sales
- English-speaking, comfortable on Zoom
- Currently spends on trade shows or wants to grow beyond referrals

---

## ICP — Who We Email FOR Them (Their Prospects)

Tour operators and boutique travel advisors in source markets (US, UK, Canada, Australia, DACH, Benelux, Scandinavia) who need reliable DMC partners in new destinations.

**Decision makers we target:** Product Manager, Contracting Manager, Sales Director, CEO/Owner at tour operators; Owner/Advisor at luxury travel advisory firms.

---

## Pricing

| Tier | Price | Use Case |
|------|-------|----------|
| Pilot | $100–$150/booked call, no retainer | First 1–2 clients, build case studies |
| Standard | $2,500/month flat | Positioned against trade show costs |
| Premium | $750/month + $200/booked call | Performance-based hybrid |

**Positioning:** "Replace your next trade show. $2,500/month gets you more qualified conversations than a $20,000 booth — and you don't have to fly anywhere."

---

## Proof / Case Studies

### Balkan Wanders (Pilot — 2026-03)
- **Client:** Balkan Wanders (DMC, Balkans region), owner: Niki
- **Campaign:** Cold email targeting UK-based tour operators and travel advisors
- **Results:** 7 booked calls from ~1,200 leads in 10 days
- **Conversion:** 4 moved to sample itinerary stage, 2 serious prospects, 1 wants a large deal
- **Reply rate:** ~9% positive (industry benchmark: 1–3%)
- **Key insight:** Activity-niche operators (cycling, wine, walking) and boutique advisors converted best. "Luxury" as a keyword had slightly negative lift.

---

## Lead Pool

- **25,000** travel industry leads (Apollo-sourced)
- **3,091** tagged as DMCs (wide-net AI classifier)
- **137** confirmed European DMCs scraped from dmc.travel directory
- Top countries in DMC pool: US (719), Australia (478), UK (317), Spain (209), Italy (201)
- Additional sources identified: DMCFinder (10K+), ADMEI directory, trade association member lists, Google Maps

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| **Instantly** | Email sending platform, campaign management |
| **Apollo** | Lead sourcing, contact enrichment |
| **Custom Python system** | Lead processing, tagging, AI classifiers |
| **OpenRouter (Gemini)** | AI classification and enrichment of leads |
| **n8n** | Reply automation (human-in-loop) |
| **Calendly** | Booking link for prospects |
| **nlm (NotebookLM CLI)** | Deep research tool |
| **Tavily API** | Web scraping and data extraction |
| **Vite + React + TS** | Launch week dashboard app |

---

## Current Campaign Plan

**A/B test on 1,000 DMC leads (Tier B):**

| Split | Leads | Angle |
|-------|-------|-------|
| Test A | 500 | **Value-first:** "I found 10 travel companies in [market] that could be sending you clients. Want me to send the list?" |
| Test B | 500 | **Proof-led:** "A Balkans DMC booked 7 meetings with tour operators in 10 days — no trade show. Curious how?" |

- Low-friction CTA in first email (no selling, no call booking)
- 3-email sequence: E1 = hook + value, E2 = proof, E3 = the ask
- Measure for 7–10 days: open rate, reply rate, positive reply rate, objections
- Winner becomes default for Tier A (premium leads via LinkedIn DM)

---

## Competitive Landscape

- **Digital tourism representation firms** — already exist, offer ~20 qualified introductions/month. We're positioning similarly but at lower cost with performance-based pricing.
- **Generic lead gen agencies** — don't understand travel industry. We have domain expertise.
- **Trade shows** — the incumbent. $15K–$40K per event, declining attendance, 3-day window. We're the always-on alternative.

---

## Other Niches Evaluated

DMCs are the launch niche. Other niches were evaluated for future expansion:

| Niche | Score | Status |
|-------|-------|--------|
| Commercial Insurance Brokers | 125.5/185 | Promising — highest score, no proof yet |
| DMC (Tour Operators) | 116/185 | Promising — has proof, launching now |
| Accounting / CFO Advisory | 113/185 | Promising — needs validation |
| DMC (Luxury) | 112.5/185 | Promising — add-on to TO play |
| Commercial Cleaning | TBD | Research done, not scored |

---

## Key Documents

| Document | Path | What It Contains |
|----------|------|-----------------|
| AI Handoff (original) | `docs/AI_Handoff_Peretz_LeadGen_Launch.md` | Founder context, weekly task list, behavioral guardrails |
| DMC Research Handoff | `docs/research/DMC_Niche_Research_Handoff.md` | Full research session summary, campaign plan, next steps |
| DMC Client ICP | `docs/niche-eval/dmc-client-icp.md` | Detailed ICP with decision makers, geography, Apollo search strategy |
| DMC Niche Summary | `docs/niche-eval/dmc-niche-summary.md` | Industry overview, pain points, honest assessment |
| Offer Angles | `docs/offer/dmc-offer-angles.md` | Hormozi framework applied, 3 offers, A/B test plan, objection handling |
| Niche Eval Framework | `docs/niche-eval/niche-eval-framework.md` | 11-dimension scoring system with weights |
| Market Research | `docs/research/dmc_market_research.md` | Deal economics, sales cycles, acquisition channels |
| Balkan Wanders ICP | `docs/case-study/Balkan Wanders DMC ICP.md` | Original ICP used for the pilot campaign |

---

## Research Notebooks (NLM)

| Notebook ID | Topic |
|-------------|-------|
| b38da413 | DMC Market Research (29 sources) |
| 4004df71 | DMC Tour Operators & Luxury Eval (29 sources) |
| c26eea1e | DMC ICP Validation (28 sources) |
| e0fa5c19 | Offer Building — Hormozi + Pain Points (27 sources) |
| e9a6b658 | DMC Cold Outreach Research (29 sources) |
| 3a091f68 | Commercial Insurance Brokers Eval |
| 1b4951e0 | Commercial Cleaning Eval |
