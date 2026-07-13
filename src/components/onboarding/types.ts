// Shared types for the client onboarding page (/onboarding/[client]).
// JSON in public/data/onboarding/{client}.json holds DEFAULTS; client edits
// live in localStorage as a sparse Overlay (see useLocalStorageDraft).
//
// Shape: hero + agenda + ownership sit above a tab bar. Everything else lives
// in a tab (offer / icp / replies / expectations / questions). One line per
// idea - this is a working session, not homework.

export interface LeadCardData {
  id: string; // stable id; fit scores key on this, never on email/index
  full_name: string;
  title?: string;
  company: string;
  company_country?: string;
  company_website?: string;
  company_description?: string;
  company_logo?: string;
  seniority_level?: string;
  functional_level?: string;
  email?: string;
  linkedin?: string;
  whyFit?: string; // ONE short line. Not a paragraph.
}

/* ---- targeting ---- */

export interface IcpFields {
  companySize: string; // a range, free text
  jobTitles: string[]; // titles & personas
  countries: string[]; // location
  signals: string[]; // buying triggers we can filter a list on ("recently founded", "2nd location")
}

export interface Icp {
  id: string;
  label: string; // the target vertical, e.g. "Dental Practices"
  fields: IcpFields;
}

export interface Targeting {
  idealCustomers: string[]; // their current / dream-fit clients - we find lookalikes
  doNotTarget: string[]; // anti-ICP
}

/* ---- offer ---- */

export interface ServiceLine {
  id: string;
  name: string; // "Tax Planning"
  line: string; // the offer in ONE sentence
}

// Rendered to LOOK like an email (subject line + body), not a wall of text.
// Body keeps {{merge_tags}} - they get highlighted on render.
export interface ExampleEmail {
  id: string;
  subject: string;
  body: string;
}

export interface OfferFields {
  services: ServiceLine[];
  guarantees: string[]; // uniqueness / risk reversal / guarantees - one line each
  problemsSolved: string[];
  proof: string[]; // numerical proof - one line each
  guidingQuestion?: string; // the one question the front-end offer has to answer
  frontEndOffer: string; // the hook, one short line
  emails: ExampleEmail[]; // 1-2 SHORT examples
  leadMagnets: string[]; // candidate magnets, one per line
}

/* ---- replies ---- */

export interface FaqItem {
  id: string;
  q: string;
  a: string;
  ask?: string; // what we still need from the client on this one
  reply?: string; // their answer
}

/* ---- expectations ---- */

export interface RiskItem {
  id: string;
  risk: string;
  prevention: string;
}

export interface TimelinePhase {
  id: string;
  phase: string; // "MONTH 0"
  title: string; // "Onboarding, warm-up, kickoff and launch"
  bullets: string[];
  dates?: { label: string; value: string }[]; // only where we can name a real date
}

export interface Expectations {
  risks: RiskItem[];
  greatMeeting: string; // what a great meeting looks like for them
  timeline: TimelinePhase[];
}

/* ---- open questions ---- */

// What we need from the CLIENT before we can build. Distinct from FaqItem,
// which is how we answer a PROSPECT. Keep `q` to one line.
export interface OpenQuestion {
  id: string;
  q: string;
  why?: string; // one short line - what this decides
  priority?: "blocking" | "important";
}

/* ---- page ---- */

export interface HeroFields {
  primaryCompanyEmail: string;
  outreachBusinessName: string;
  redirectWebsite: string;
}

export interface OnboardingData {
  client: string;
  generated_at?: string;
  hero: {
    image?: string;
    logo?: string;
    display: {
      clientName: string;
      title: string;
      company: string;
      email: string;
      phone?: string;
      website?: string;
    };
    fields: HeroFields;
  };
  agenda?: string[];
  ownership?: { us: string[]; them: string[] };
  // Says out loud that the pre-filled content is a stand-in, not us telling the
  // client how their own business works. Shown atop the Offer + Ideal Customer tabs.
  placeholderNote?: string;
  icps: Icp[];
  targeting?: Targeting;
  dreamList: LeadCardData[];
  offer: OfferFields;
  faq: { items: FaqItem[] };
  expectations?: Expectations;
  openQuestions?: OpenQuestion[];
}

/* ---- client edits ---- */

// 1-5 fit score, replacing the old binary approve/reject.
export type Fit = 1 | 2 | 3 | 4 | 5;

export interface VerdictEntry {
  fit: Fit | null;
  note?: string;
}

// Sparse overlay, only what the client changed. Render = overlay value ?? default.
export interface Overlay {
  v: number;
  updatedAt?: string;
  icps?: Record<string, Partial<IcpFields>>;
  targeting?: Partial<Targeting>;
  offer?: Partial<OfferFields>;
  verdicts?: Record<string, VerdictEntry>;
  faq?: { items?: FaqItem[]; global?: string };
  expectations?: { greatMeeting?: string };
  openQuestions?: Record<string, string>; // question id -> answer
  cancelTrigger?: string;
  notes?: string; // free-text scratchpad, filled live on the call
}
