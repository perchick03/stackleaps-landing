// Shared types for the client onboarding page (/onboarding/[client]).
// JSON in public/data/onboarding/{client}.json holds DEFAULTS; client edits
// live in localStorage as a sparse Overlay (see useLocalStorageDraft).

export interface LeadCardData {
  id: string; // stable id — verdicts key on this, never on email/index
  full_name: string;
  title?: string;
  company: string;
  company_country?: string;
  company_website?: string;
  company_description?: string;
  company_logo?: string;
  seniority_level?: string;
  functional_level?: string;
}

export interface IcpFields {
  industryDescription: string;
  jobTitles: string[];
  countries: string[];
  companySize: string;
  exclusions: string;
}

export interface Icp {
  id: string; // stable id — overlay edits key on this
  label: string;
  fields: IcpFields;
  estTam?: { value: number; label: string }; // display-only snapshot, never recomputes
}

export interface HeroFields {
  campaignName: string;
  primaryCompanyEmail: string;
  outreachBusinessName: string;
  redirectWebsite: string;
}

export interface OfferFields {
  serviceDescription: string;
  uniqueAngle: string;
  guarantees: string[];
  problemsSolved: string[];
  quantifiableResults: string;
  process: string[];
}

export interface FaqItem {
  id: string;
  q: string;
  a: string;
}

export interface OnboardingData {
  client: string;
  generated_at?: string;
  hero: {
    image?: string;
    display: { clientName: string; title: string; company: string; email: string };
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

// Sparse overlay — only what the client changed. Render = overlay value ?? default.
export interface Overlay {
  v: number;
  updatedAt?: string;
  hero?: Partial<HeroFields>;
  icps?: Record<string, Partial<IcpFields>>;
  offer?: Partial<OfferFields>;
  verdicts?: Record<string, VerdictEntry>;
  faq?: { items?: FaqItem[]; global?: string };
}
