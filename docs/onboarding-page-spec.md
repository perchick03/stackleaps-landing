# Onboarding Page, Content Spec

The per-client onboarding page we send during onboarding. One reusable template, authored per client via a single JSON file. This doc is the **content** reference: what each section asks, what changes per client, and how to author a new one. (Not the UI/code.)

- **Live at:** `/onboarding/{client}` (private: `noindex` meta + robots.txt disallow)
- **Authored from:** `public/data/onboarding/{client}.json`, the filename slug = the URL
- **Fullest example to copy:** `tiernan.json` (every section populated, correct framing). `aries.json` is an older, minimal example.

## What the page does

Two jobs in one scroll: **prove** we did the work (the ICP we built, real dream-fit leads, the offer), then **capture** the client's input (they edit our pre-filled values and react to leads). Proof comes first so filling feels like co-creating, not a blank form.

**How it behaves (so the copy makes sense):**
- Every value is pre-filled with our best guess. The client clicks to edit in place. **Clearing a field reverts it to our default**, there is no blank state.
- Edits autosave to the browser (localStorage) as they go. A **Reset** control wipes their edits back to our defaults.
- **Submit** emails us the whole thing (a readable `full_form` plus the full JSON). They can keep editing and submit again.

## The 5 sections

| # | Section | What we put in it | What the client does | Tier |
|---|---------|-------------------|----------------------|------|
| 1 | **Campaign Details** | Identity header + the operational fields we run outreach with + a contact-person card | Confirms/edits the fields | per-client |
| 2 | **Ideal Customer Profile (ICP)** (tabs) | Our targeting definition per ICP + an estimated reach (TAM) | Tunes the targeting | per-ICP |
| 3 | **Your Ideal Customers** | Ideal-customer-websites box, do-not-target box, and sample dream-fit lead cards | Adds dream clients, marks each lead ✓/✗ | per-ICP |
| 4 | **Your Offer** | What we promote, the edge, guarantees, problems, proof, process, the front-end hook | Corrects anything wrong | per-client |
| 5 | **Reply & Objection Handling** | Seeded Q&A + our open "we need from you" questions + a free-text box | Edits/answers, **Submits** | template |

### 1 · Campaign Details
- **Identity header** (not editable): logo (auto-pulled favicon, or a `logo` override), company name, contact name + title, and a contact strip (website, email, phone). Optional hero image.
- **Editable campaign fields**, each with a `?` info tooltip where it helps:
  - **Email signature name** (`campaignName`): how outreach emails sign off
  - **Primary company email**: tooltip explains we register lookalike sending domains
  - **Business name to use in outreach**
  - **Website the campaign domains redirect to**: tooltip explains the redirect
- **Contact Person card** (editable): name, phone, email, and a **preferred-channel dropdown** (WhatsApp / Email / Slack). Who we coordinate with; may differ from the identity header.

### 2 · Ideal Customer Profile (ICP)  (tabs when a client has several)
- **Title:** `estTam.label` is shown as the section's title (e.g. "US Luxury Leisure Travel Advisor Contacts").
- **TAM line:** `≈ {estTam.value}` highlighted, labelled "Est. Total Addressable Market (TAM)" with a `?` hint. **Display-only snapshot**, it does not recompute as the client edits. `value` may be a number or a range string (e.g. `"8K-10K"`).
- **Target industry:** a free-text lead paragraph (no field label).
- **Job titles** and **Countries / regions:** lists shown as chips.
- **Ideal company size:** employees / revenue / volume, plus the floor.
- (Do-not-target lives in section 3, not here.)

### 3 · Your Ideal Customers
- **Ideal customer websites** (`idealClientWebsites`): a box prompting the client for 5-10 of their current or dream-fit client sites, comma-separated. We find lookalikes. Include the key (even as `""`) to render the box.
- **Do not target** (`exclusions`): a red-marked box for anti-ideal customers (e.g. large corporate agencies). This is *not* competitors.
- **Sample dream-fit leads:** 3-5 cards (carousel or grid, a "reviewed" counter). Each shows company logo, name + title, location, description, clickable **website / LinkedIn / email**, and a **"Why it fits"** line. Client marks each **Dream fit / Not a fit** and can add a note. Cards are read-only otherwise.
- **Grounding rule:** real, verifiable companies only; why-fit checked against their actual profile; named person only if LinkedIn + email verified, else show title. No invented data. If leads aren't sourced yet, ship clearly-labelled placeholders and swap them before sending.

### 4 · Your Offer
This is the **client's** offer that we promote to *their* prospects, not StackLeaps' service.
- **What we promote** (`serviceDescription`) and **Your edge** (`uniqueAngle`)
- **Guarantees / risk reversals**, **Problems your ideal client has that this solves** (lists)
- **Proof we can reference** (`quantifiableResults`): **real numbers only**, never fabricate; label any adjacent proof as adjacent
- **What a client experiences if they start today** (`process`): numbered steps
- **Front-end offer (the hook)** (`frontEndOffer`): the first-touch lead magnet. Renders when present, and unlocks:
  - **Example first-touch email** (`exampleEmail`): a sample email shown in a preview box (line breaks preserved)
  - **Sample itineraries** (`frontEndItems`): named hooks, each `{ name, url, note }`, with a clickable "View" link

### 5 · Reply & Objection Handling
- **Q&A pairs:** the prospect's question (`q`) and our drafted answer (`a`), both editable.
- **"We Need From You"** (`ask`): an open question *we* attach to an item that the client must answer/validate (e.g. "net rates vs commission?"). Shown in a highlighted callout with a **reply** field (`reply`) for the client. This is how our open questions get surfaced without being forgotten.
- Client can **add/remove** questions, plus a final **"Anything else we should know?"** free-text box.
- **Submit** sends the full state to us.

## Reuse tiers

- **Template** (same every client): the 5 sections, the contact-person card, the `?` hint copy (auto-built from the client's own domain), the FAQ submit/free-text, the reset/submit behavior, and every label/format. Lives in the page, not the JSON.
- **Per-ICP** (changes per niche): section 2 (TAM title + value, industry, titles, countries, size) and section 3 (`exclusions`, `idealClientWebsites`, and the leads).
- **Per-client** (changes per company): section 1 (identity + editable fields + contact person) and section 4 (the whole offer, including the front-end hook, example email, and itineraries).

## Authoring a new client

1. Copy `public/data/onboarding/tiernan.json` → `public/data/onboarding/{client}.json`. The filename is the slug and the URL: `/onboarding/{client}`.
2. Set `client` to that same slug.
3. Fill the sections (see the field reference below). Remember the offer is the *client's* offering, not ours.
4. (Optional) drop a hero image beside the JSON (`public/data/onboarding/{client}-hero.webp`) and point `hero.image` at `/data/onboarding/{client}-hero.webp`. Omit for a branded gradient. The logo auto-resolves from the website; override with `hero.logo` if needed.
5. Send the client `https://stackleaps.com/onboarding/{client}`.

### File shape (field reference)

```jsonc
{
  "client": "tiernan",                // must equal the filename slug
  "generated_at": "Jun 29, 2026",     // shown as the "as of" date

  "hero": {
    "image": "/data/onboarding/tiernan-hero.webp", // or "" for gradient fallback
    "logo": "",                       // optional; falls back to a favicon of the website
    "display": {                      // NOT editable, identity header + contact strip
      "clientName": "...", "title": "...", "company": "...", "email": "...",
      "phone": "",                    // optional
      "website": "tiernantravel.com"  // optional; shown in the contact strip + drives the logo
    },
    "fields": {                       // editable campaign defaults
      "campaignName": "...",          // shown as "Email signature name"
      "primaryCompanyEmail": "...",
      "outreachBusinessName": "...",
      "redirectWebsite": "...",
      "contactName": "...",           // Contact Person card (all optional)
      "contactPhone": "",
      "contactEmail": "...",
      "contactCommMethod": ""         // "" | "WhatsApp" | "Email" | "Slack"
    }
  },

  "icps": [                           // one entry per ICP = one tab
    {
      "id": "icp-advisors",           // stable id, unique within the file
      "label": "US Luxury Travel Advisors", // tab label (tabs show only when >1 ICP)
      "fields": {
        "industryDescription": "...",
        "jobTitles": ["..."],         // chips
        "countries": ["..."],         // chips
        "companySize": "...",
        "exclusions": "...",          // "Do not target", rendered in section 3
        "idealClientWebsites": ""     // optional; include (even "") to show the box
      },
      "estTam": {
        "value": "8K-10K",            // number or range string; display-only snapshot
        "label": "US Luxury Leisure Travel Advisor Contacts" // shown as the SECTION TITLE
      }
    }
  ],

  "dreamList": [                      // read-only cards; [] renders an empty state
    {
      "id": "lead-1",                 // stable id (verdicts key on this, not email)
      "full_name": "...", "title": "...",
      "company": "...", "company_country": "City, ST",
      "company_website": "https://...", "company_description": "...",
      "company_logo": "https://www.google.com/s2/favicons?domain=...&sz=128", // or "" -> letter avatar
      "seniority_level": "owner",     // c_suite | vp | director | manager | owner | founder
      "functional_level": "leadership",
      "email": "...",                 // optional; clickable chip
      "linkedin": "https://...",      // optional; clickable chip
      "whyFit": "..."                 // optional; renders a "Why it fits" block
    }
  ],

  "offer": {                          // the CLIENT's offer (what we promote), not StackLeaps'
    "serviceDescription": "...",
    "uniqueAngle": "...",
    "guarantees": ["..."],
    "problemsSolved": ["..."],
    "quantifiableResults": "...",     // real numbers only
    "process": ["...", "...", "..."],
    "frontEndOffer": "...",           // optional; the first-touch hook (unlocks the block)
    "exampleEmail": "Line 1\n\nLine 2...", // optional; sample first-touch email (\n preserved)
    "frontEndItems": [                // optional; named hooks
      { "name": "...", "url": "https://...", "note": "Best for..." }
    ]
  },

  "faq": {
    "items": [
      { "id": "faq-1", "q": "...", "a": "...",
        "ask": "...",                 // optional; our open question for the client
        "reply": "" }                 // optional; the client's answer to our ask
    ]
  }
}
```

### Rules to keep
- **Stable `id`s** on `icps`, `dreamList`, and `faq.items`. The client's edits and verdicts attach to these, so don't renumber on reorder.
- **The offer is the client's offering**, framed to *their* prospects. Don't paste StackLeaps' service in there.
- **TAM is a snapshot**, not live. **Proof is real numbers only.** **Leads are real or clearly-labelled placeholders.**
- **Empty defaults are fine** (e.g. a blank phone), the field just shows a placeholder for the client to fill.
- **Optional fields render only when present:** `idealClientWebsites`, `frontEndOffer`, `exampleEmail`, `frontEndItems`, lead `email`/`linkedin`/`whyFit`, and faq `ask`/`reply`. Include the key (even empty) to surface its UI.
- **No em dashes** in any copy (project-wide rule). Use commas, colons, periods, or parentheses.
- Pages are private (`noindex` + robots.txt disallow); the link is the only way in.

## What we receive on submit
The submission email contains a readable **`full_form`** (every field with the client's edits, each lead's verdict + note, the FAQ answers including their replies to our "we need from you" questions) plus a pretty-printed **`payload_json`**, with `company`, `approved_count`, `rejected_count`, and `source: onboarding`. Capture happens client-side then posts to a form endpoint; no backend.

## Where the rest is documented
- Build/implementation (schema validation, autosave overlay, submit/email) lives in the code under `src/app/onboarding/` and `src/components/onboarding/`.
- This doc is the content/authoring reference only.
