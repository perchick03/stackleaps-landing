// Shared types for the client onboarding page (/onboarding/[client]).
// JSON in public/data/onboarding/{client}.json holds DEFAULTS; client edits
// live in localStorage as a sparse Overlay (see useLocalStorageDraft).

export interface LeadCardData {
  id: string; // stable id; verdicts key on this, never on email/index
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
  whyFit?: string; // grounded reason this lead fits the ICP (optional)
}

export interface IcpFields {
  industryDescription: string;
  jobTitles: string[];
  countries: string[];
  companySize: string;
  exclusions: string; // "do not target", anti-ICP, rendered in the dream-list section
  idealClientWebsites?: string; // client's own current / wished-for clients (comma-separated); renders when present
}

export interface Icp {
  id: string; // stable id, overlay edits key on this
  label: string;
  fields: IcpFields;
  estTam?: { value: string | number; label: string }; // display-only snapshot (string allows a range, e.g. "8K-10K")
}

export interface HeroFields {
  campaignName: string; // email signature name
  primaryCompanyEmail: string;
  outreachBusinessName: string;
  redirectWebsite: string;
  // Contact person we coordinate with during the campaign (may differ from hero identity).
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
  contactCommMethod?: string; // WhatsApp | Email | Slack
}

export interface FrontEndItem {
  name: string;
  url?: string;
  note?: string; // "best for..." framing
}

export interface OfferFields {
  serviceDescription: string;
  uniqueAngle: string;
  guarantees: string[];
  problemsSolved: string[];
  quantifiableResults: string;
  process: string[];
  frontEndOffer?: string; // the first-touch hook / lead magnet; renders when present
  exampleEmail?: string; // sample first-touch email; renders under the front-end offer
  frontEndItems?: FrontEndItem[]; // named instances of the hook (e.g. sample itineraries)
}

export interface FaqItem {
  id: string;
  q: string;
  a: string;
  ask?: string; // our open question for the client to answer/validate (e.g. "net rates vs commission?")
  reply?: string; // client's answer to our ask
}

export interface OnboardingData {
  client: string;
  generated_at?: string;
  hero: {
    image?: string;
    logo?: string; // logo image url; falls back to a favicon derived from the website
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
  icps: Icp[];
  dreamList: LeadCardData[];
  offer: OfferFields;
  faq: { items: FaqItem[] };
}

export type Verdict = "approve" | "reject";

export interface VerdictEntry {
  verdict: Verdict | null;
  note?: string;
}

// Sparse overlay, only what the client changed. Render = overlay value ?? default.
export interface Overlay {
  v: number;
  updatedAt?: string;
  hero?: Partial<HeroFields>;
  icps?: Record<string, Partial<IcpFields>>;
  offer?: Partial<OfferFields>;
  verdicts?: Record<string, VerdictEntry>;
  faq?: { items?: FaqItem[]; global?: string };
}
