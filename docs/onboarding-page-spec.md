# Onboarding Page, Content Spec

The per-client onboarding page we send during onboarding. One reusable template, authored per client via a single JSON file. This doc is the **content** reference: what each section asks, what changes per client, and how to author a new one. (Not the UI/code.)

- **Live at:** `/onboarding/{client}` (private, `noindex`)
- **Authored from:** `public/data/onboarding/{client}.json`, the filename slug = the URL
- **First instance:** `aries.json` (freight / F&B)

## What the page does

Two jobs in one scroll: **prove** we did the work (the ICP we built, real dream-fit leads, the offer), then **capture** the client's input (they edit our pre-filled values and react to leads). Proof comes first so filling feels like co-creating, not a blank form.

**How it behaves (so the copy makes sense):**
- Every value is pre-filled with our best guess. The client clicks to edit. **Clearing a field reverts it to our default**, there is no blank state.
- Edits autosave as they go (per browser). One **Submit** at the end sends the whole thing to us.

## The 5 sections

| # | Section | What we put in it | What the client does | Tier |
|---|---------|-------------------|----------------------|------|
| 1 | **Hero + campaign details** | Their company/identity + 4 operational fields we'll use to run outreach | Confirms/edits the 4 fields | per-client |
| 2 | **The ICP we built** (tabs) | Our targeting definition per ICP + an estimated reach number | Tunes the targeting | per-ICP |
| 3 | **Sample dream-fit leads** | Real companies we can reach (cards, read-only) | Approves ✓ / rejects ✗ each + optional note | per-ICP |
| 4 | **Your offer** | What we'll promote, the edge, guarantees, problems, proof, process | Corrects anything wrong | per-client |
| 5 | **Reply & objection handling** | Seeded Q&A on how to answer prospects + a free-text box | Edits/adds Q&A, adds notes, **Submits** | template |

### 1 · Hero + campaign details
- **Display identity** (not editable): client name, title, company, email. The "we know who you are" header. Optional hero image.
- **Editable fields** (the 4 things we operationally need):
  - Full name to use in campaigns
  - Primary company email
  - Business name to use in outreach
  - Website the campaign domains redirect to

### 2 · The ICP we built (tabs, one client can have several ICPs)
Per ICP:
- **Target industry**, prose description of who we go after
- **Job titles to reach**, list (shown as chips)
- **Countries / regions**, list (chips)
- **Ideal company size**, employees / revenue / volume, plus the floor
- **Do not target**, competitors, exclusions, regions we don't serve
- **Estimated reach (TAM)**, a **display-only snapshot**. It does not recompute when the client edits the ICP. Frame it as "≈N contacts, based on the definition above," never as a live counter.

### 3 · Sample dream-fit leads
- 3-5 **read-only** cards: company, region, size, sub-vertical, a target title, a grounded why-fit line.
- Client marks each **Dream fit / Not a fit** + an optional note. Carousel or grid view; a "reviewed" counter.
- **Grounding rule:** real, verifiable companies only; why-fit checked against their actual profile; named person only if LinkedIn + email verified, else show title. No invented data.
- If real leads aren't sourced yet, ship **clearly-labelled placeholders** and swap them before sending, never pass fake companies off as real.

### 4 · Your offer
- **What we promote**, the service in one tight paragraph
- **Your edge for this client**, what makes our version of it unique to them
- **Guarantees / risk reversals**, list
- **Problems your ideal client has that this solves**, list (3-4)
- **Proof we can reference, real numbers only**, quantifiable results. **Never fabricate.** If there's no result for this niche yet, say so and label any adjacent proof as adjacent.
- **What a client experiences if they start today**, 3-4 numbered steps

### 5 · Reply & objection handling
- Seeded **Q&A pairs** with suggested answers (e.g. how to handle pricing requests) the client edits.
- Client can **add/remove** questions.
- A final **"Anything else we should know?"** free-text box.
- **Submit** sends the full state to us.

## Reuse tiers

What you re-author each time, and what stays put:

- **Template** (same every client), the 5 sections, the campaign-details questions, the FAQ free-text + submit, and every field label/format. Lives in the page, not the JSON.
- **Per-ICP** (changes per niche), section 2 (the ICP definition + TAM) and section 3 (the leads).
- **Per-client** (changes per company), section 1 (identity + the 4 fields) and section 4 (the offer).

## Authoring a new client

1. Copy `public/data/onboarding/aries.json` → `public/data/onboarding/{client}.json`. The filename is the slug and the URL: `/onboarding/{client}`.
2. Set `client` to that same slug.
3. Fill the sections below.
4. (Optional) drop a hero image in `public/` and point `hero.image` at it; omit for a branded gradient.
5. Send the client `https://stackleaps.com/onboarding/{client}`.

### File shape (field reference)

```jsonc
{
  "client": "aries",                  // must equal the filename slug
  "generated_at": "Jun 28, 2026",     // shown as the "as of" date

  "hero": {
    "image": "",                      // path under public/, or "" for gradient fallback
    "display": {                      // NOT editable, identity header
      "clientName": "...", "title": "...", "company": "...", "email": "..."
    },
    "fields": {                       // editable defaults (the 4 operational fields)
      "campaignName": "...", "primaryCompanyEmail": "...",
      "outreachBusinessName": "...", "redirectWebsite": "..."
    }
  },

  "icps": [                           // one entry per ICP = one tab
    {
      "id": "icp-fnb",                // stable id, unique within the file
      "label": "Food & Beverage",     // tab label
      "fields": {
        "industryDescription": "...",
        "jobTitles": ["...", "..."],
        "countries": ["..."],
        "companySize": "...",
        "exclusions": "..."
      },
      "estTam": { "value": 8100, "label": "..." }   // display-only snapshot
    }
  ],

  "dreamList": [                      // read-only cards; [] renders an empty state
    {
      "id": "lead-1",                 // stable id (verdicts key on this, not email)
      "full_name": "...", "title": "...",
      "company": "...", "company_country": "...",
      "company_website": "...", "company_description": "...",
      "company_logo": "",             // omit/"" -> letter-avatar fallback
      "seniority_level": "director",  // c_suite | vp | director | manager | owner | founder
      "functional_level": "operations"
    }
  ],

  "offer": {
    "serviceDescription": "...",
    "uniqueAngle": "...",
    "guarantees": ["..."],
    "problemsSolved": ["..."],
    "quantifiableResults": "...",     // real numbers only
    "process": ["...", "...", "..."]
  },

  "faq": {
    "items": [ { "id": "faq-1", "q": "...", "a": "..." } ]
  }
}
```

### Rules to keep
- **Stable `id`s** on `icps`, `dreamList`, and `faq.items`, the client's edits and verdicts attach to these. Don't renumber on reorder.
- **Empty defaults are fine** (e.g. a blank email), the field just shows a placeholder for the client to fill.
- **TAM is a snapshot**, not live. **Proof is real numbers only.** **Leads are real or clearly labelled placeholders.**
- Pages are private (`noindex`); the link is the only way in.

## Where the rest is documented
- Build/implementation details (schema validation, autosave, Submit/Formspree) live in the code under `src/app/onboarding/` and `src/components/onboarding/`, and in the implementation plan at `~/.claude/plans/`.
- This doc is the content/authoring reference only.
