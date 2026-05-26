"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Header from "@/components/Header";

interface Sponsor {
  name: string;
  state: string;
  employee_count: number | null;
  naics: string;
  industry_name: string;
  current_broker: string;
  annual_commission_usd: number | null;
  commission_tier: "small" | "medium" | "large" | string;
  plan_year_end: string;
  next_renewal: string;
  renewal_in_days: number | null;
}

interface Contact {
  full_name: string;
  title: string;
  seniority_tier: "c_suite" | "vp" | "director" | "manager" | "other" | string;
  email: string;
  email_verified: boolean;
  linkedin: string;
}

interface SwitchTarget {
  sponsor: Sponsor;
  contact: Contact;
  quality: { flag: string; reasons: string[] };
}

interface Prospect {
  email: string;
  full_name: string;
  company_name: string;
  company_domain: string;
  state_abbr: string;
  state: string;
  linkedin: string;
  job_title: string;
}

interface Methodology {
  source: string;
  filters: string[];
  enrichment: string;
}

interface ReportStats {
  candidates_filtered: number;
}

interface Report {
  prospect: Prospect;
  matched_to: string;
  generated_at: string;
  methodology: Methodology;
  stats: ReportStats;
  switch_targets: SwitchTarget[];
  flagged_targets: unknown[];
}

const REPLY_EMAIL = "reply@stackleaps.com";

// ---------- formatters ----------

function titleCase(s: string): string {
  if (!s) return s;
  const lowers = new Set(["of", "and", "the", "for", "to", "a", "an", "in", "on", "at", "by"]);
  return s
    .toLowerCase()
    .split(/(\s+|[-/])/)
    .map((part, i) => {
      if (/^\s+$/.test(part) || part === "-" || part === "/") return part;
      if (i > 0 && lowers.has(part)) return part;
      // preserve common all-caps tokens like LLC, INC, CPA, MBA, SHRM, USA, AKA
      const upperWhitelist = new Set([
        "llc", "inc", "inc.", "llc.", "co", "co.", "corp", "corp.", "ltd", "ltd.",
        "cpa", "mba", "sphr", "shrm", "shrm-cp", "usa", "us", "dba", "aka", "hr",
      ]);
      if (upperWhitelist.has(part)) return part.toUpperCase();
      return part.charAt(0).toUpperCase() + part.slice(1);
    })
    .join("");
}

function moneyShort(n: number | null | undefined): string {
  if (n == null) return "—";
  if (n >= 1_000_000) {
    const m = n / 1_000_000;
    return `$${m >= 10 ? Math.round(m) : m.toFixed(1)}M`;
  }
  if (n >= 1_000) {
    return `$${Math.round(n / 1_000)}K`;
  }
  return `$${n}`;
}

function humanDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function shortDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function linkedinHandle(url: string): string {
  if (!url) return "";
  const m = url.match(/\/in\/([^/?#]+)/);
  return m ? m[1] : url.replace(/^https?:\/\/(www\.)?/, "");
}

function firstName(full: string): string {
  if (!full) return "";
  return full.trim().split(/\s+/)[0];
}

// ---------- CSV ----------

function csvEscape(v: unknown): string {
  if (v == null) return "";
  const s = String(v);
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function buildCsv(targets: SwitchTarget[]): string {
  const headers = [
    "sponsor_name",
    "sponsor_state",
    "sponsor_employee_count",
    "sponsor_industry_name",
    "sponsor_current_broker",
    "sponsor_annual_commission_usd",
    "sponsor_next_renewal",
    "sponsor_renewal_in_days",
    "contact_full_name",
    "contact_title",
    "contact_email",
    "contact_linkedin",
  ];
  const rows = targets.map((t) => [
    t.sponsor.name,
    t.sponsor.state,
    t.sponsor.employee_count,
    t.sponsor.industry_name,
    t.sponsor.current_broker,
    t.sponsor.annual_commission_usd,
    t.sponsor.next_renewal,
    t.sponsor.renewal_in_days,
    t.contact.full_name,
    t.contact.title,
    t.contact.email,
    t.contact.linkedin,
  ]);
  return [headers.join(","), ...rows.map((r) => r.map(csvEscape).join(","))].join("\n");
}

// ---------- badges ----------

function UrgencyBadge({ days }: { days: number | null }) {
  let label: string;
  if (days == null) label = "Renews TBD";
  else if (days === 0) label = "Renews today";
  else if (days < 0) label = `Overdue ${Math.abs(days)}d`;
  else label = `Renews in ${days} days`;

  let cls = "bg-on-surface-variant/10 text-on-surface-variant border-outline-variant/30";
  if (days != null) {
    if (days <= 14) cls = "bg-red-50 text-red-700 border-red-200";
    else if (days <= 30) cls = "bg-amber-50 text-amber-700 border-amber-200";
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${cls}`}>
      {label}
    </span>
  );
}

function CommissionTierBadge({ tier }: { tier: string }) {
  const map: Record<string, string> = {
    large: "bg-emerald-50 text-emerald-700 border-emerald-200",
    medium: "bg-on-surface-variant/10 text-on-surface-variant border-outline-variant/30",
    small: "bg-on-surface-variant/5 text-on-surface-variant/70 border-outline-variant/20",
  };
  const cls = map[tier] || map.medium;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider border ${cls}`}>
      {tier}
    </span>
  );
}

function SeniorityBadge({ tier }: { tier: string }) {
  const labels: Record<string, string> = {
    c_suite: "C-Suite",
    vp: "VP",
    director: "Director",
    manager: "Manager",
    other: "Other",
  };
  const styles: Record<string, string> = {
    c_suite: "bg-primary/10 text-primary border-primary/20",
    vp: "bg-primary/8 text-primary border-primary/15",
    director: "bg-secondary/8 text-secondary border-secondary/15",
    manager: "bg-on-surface-variant/8 text-on-surface-variant border-outline-variant/20",
    other: "bg-on-surface-variant/5 text-on-surface-variant border-outline-variant/15",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider border ${styles[tier] || styles.other}`}>
      {labels[tier] || tier}
    </span>
  );
}

// ---------- icons ----------

function EnvelopeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" x2="12" y1="15" y2="3" />
    </svg>
  );
}

function ReplyIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
      <polyline points="9 17 4 12 9 7" />
      <path d="M20 18v-2a4 4 0 0 0-4-4H4" />
    </svg>
  );
}

// ---------- card ----------

function TargetCard({ target, index }: { target: SwitchTarget; index: number }) {
  const [copied, setCopied] = useState(false);
  const { sponsor, contact } = target;
  const sponsorDisplay = titleCase(sponsor.name);
  const brokerDisplay = titleCase(sponsor.current_broker);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(contact.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  }

  const subline: string[] = [];
  subline.push(sponsor.state);
  if (sponsor.employee_count != null) subline.push(`${sponsor.employee_count} employees`);
  if (sponsor.industry_name) subline.push(sponsor.industry_name);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, type: "spring", stiffness: 100, damping: 20 }}
      className="bg-surface-lowest rounded-2xl border border-outline-variant/30 shadow-ambient overflow-hidden hover:border-primary/20 hover:shadow-[0_20px_50px_rgba(14,29,43,0.08)] transition-all duration-300"
    >
      <div className="px-6 pt-6 pb-5">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-xl font-bold text-on-surface leading-tight font-serif">
            {sponsorDisplay}
          </h3>
          <UrgencyBadge days={sponsor.renewal_in_days} />
        </div>
        {sponsor.next_renewal && sponsor.renewal_in_days != null && sponsor.renewal_in_days <= 30 && (
          <div className="text-xs text-on-surface-variant mt-1 text-right">
            {shortDate(sponsor.next_renewal)}
          </div>
        )}

        <p className="text-sm text-on-surface-variant mt-2">
          {subline.join(" · ")}
        </p>

        <div className="mt-4 pt-4 border-t border-outline-variant/20 space-y-1.5">
          <p className="text-sm text-on-surface-variant">
            Currently with{" "}
            <span className="font-medium text-on-surface">{brokerDisplay}</span>
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-on-surface">
              {moneyShort(sponsor.annual_commission_usd)}
            </span>
            <span className="text-xs text-on-surface-variant">annual commission</span>
            <CommissionTierBadge tier={sponsor.commission_tier} />
          </div>
        </div>
      </div>

      <div className="px-6 pb-6 pt-4 border-t border-outline-variant/15 bg-surface-low/30">
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-on-surface">{contact.full_name}</span>
              <SeniorityBadge tier={contact.seniority_tier} />
            </div>
            <p className="text-xs text-on-surface-variant mt-0.5">{contact.title}</p>

            <div className="mt-3 flex flex-col gap-2">
              {contact.email && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={copyEmail}
                    className="group inline-flex items-center gap-2 text-xs font-mono text-on-surface hover:text-primary transition-colors cursor-pointer"
                    title="Copy email"
                  >
                    <EnvelopeIcon />
                    <span>{contact.email}</span>
                    <CopyIcon />
                  </button>
                  {contact.email_verified && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                      ✓ Verified
                    </span>
                  )}
                  {copied && (
                    <span className="text-[10px] text-emerald-600 font-medium">Copied!</span>
                  )}
                </div>
              )}
              {contact.linkedin && (
                <a
                  href={contact.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs text-[#0A66C2] hover:underline w-fit"
                >
                  <LinkedInIcon />
                  <span>in/{linkedinHandle(contact.linkedin)}</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ---------- methodology ----------

function Methodology({ methodology, prospect }: { methodology: Methodology; prospect: Prospect }) {
  const [open, setOpen] = useState(true);

  return (
    <div className="border border-outline-variant/30 rounded-2xl bg-surface-lowest overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-surface-low/40 transition-colors cursor-pointer"
      >
        <span className="text-sm font-semibold text-on-surface">How this list was built</span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && (
        <div className="px-6 pb-5 space-y-3">
          <p className="text-sm text-on-surface-variant italic">{methodology.source}</p>
          <ul className="text-sm text-on-surface-variant space-y-1.5 list-disc list-inside marker:text-on-surface-variant/60">
            {methodology.filters.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
          <p className="text-sm text-on-surface-variant">{methodology.enrichment}</p>
          <p className="text-xs text-on-surface-variant/70 pt-2 border-t border-outline-variant/20">
            Built for {firstName(prospect.full_name)} at {prospect.company_name} only — do not share.
          </p>
        </div>
      )}
    </div>
  );
}

// ---------- page ----------

export default function EbbListPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [data, setData] = useState<Report | null>(null);
  const [error, setError] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    fetch(`/ebb-data/${slug}.json`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((json: Report) => {
        const missing: string[] = [];
        if (!json.prospect) missing.push("prospect");
        if (!json.methodology) missing.push("methodology");
        if (!json.generated_at) missing.push("generated_at");
        if (!Array.isArray(json.switch_targets)) missing.push("switch_targets");
        if (missing.length > 0) {
          setValidationErrors(missing);
          setLoading(false);
          return;
        }
        setData(json);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [slug]);

  const csvHref = useMemo(() => {
    if (!data) return "";
    const csv = buildCsv(data.switch_targets);
    return `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`;
  }, [data]);

  if (loading) {
    return (
      <div className="min-h-[100dvh] bg-surface flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (validationErrors.length > 0) {
    return (
      <div className="min-h-[100dvh] bg-surface flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Invalid JSON data</h1>
          <p className="text-on-surface-variant mb-4">Missing required fields:</p>
          <ul className="text-left inline-block text-sm font-mono bg-red-50 border border-red-200 rounded-lg px-4 py-3">
            {validationErrors.map((field) => (
              <li key={field} className="text-red-700">- {field}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-[100dvh] bg-surface flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-on-surface mb-2">Page not found</h1>
          <p className="text-on-surface-variant">
            This brief may have expired or the link is incorrect.
          </p>
        </div>
      </div>
    );
  }

  const fname = firstName(data.prospect.full_name);
  const targetsCount = data.switch_targets.length;
  const stateAbbr = data.prospect.state_abbr;
  const replySubject = `Switch-Target Brief — ${data.prospect.company_name}`;
  const mailto = `mailto:${REPLY_EMAIL}?subject=${encodeURIComponent(replySubject)}`;
  const csvFilename = `${slug}-switch-targets.csv`;

  return (
    <div className="min-h-[100dvh] bg-surface">
      <Header />

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6">
        <div className="flex items-center justify-between mb-6">
          <p className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">
            Switch-Target Brief
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
        >
          <p className="text-sm text-on-surface-variant mb-3">
            Built for <span className="font-semibold text-on-surface">{fname}</span>{" "}
            at <span className="font-semibold text-on-surface">{data.prospect.company_name}</span>
            {" — "}
            {humanDate(data.generated_at)}
          </p>

          {targetsCount > 0 && (
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-on-surface leading-tight tracking-tight">
              <span className="text-primary">{targetsCount}</span> {stateAbbr} mid-market employers
              <br />
              with switchable broker-of-record relationships
              <br />
              renewing in the next 120 days.
            </h1>
          )}
        </motion.div>
      </section>

      {/* Empty / partial states */}
      {targetsCount === 0 && (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
          <div className="bg-surface-lowest border border-outline-variant/30 rounded-2xl px-6 py-8">
            {data.stats?.candidates_filtered === 0 ? (
              <p className="text-on-surface">
                No mid-market employers in {stateAbbr} are listed as having a broker-of-record renewing in the next 120 days. We&apos;ll re-check on the next cycle.
              </p>
            ) : (
              <p className="text-on-surface">
                No usable matches in your state and 120-day window this round. We&apos;ll re-check on the next renewal cycle and email if anything moves into range.
              </p>
            )}
          </div>
        </section>
      )}

      {targetsCount > 0 && targetsCount < 10 && (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-2">
          <p className="text-sm text-on-surface-variant italic">
            Found {targetsCount} strong {targetsCount === 1 ? "match" : "matches"} in your state and renewal window.
            {data.flagged_targets.length > 0 && (
              <>
                {" "}
                {data.flagged_targets.length} more {data.flagged_targets.length === 1 ? "is" : "are"} pending review and may follow in a separate brief.
              </>
            )}
          </p>
        </section>
      )}

      {/* Methodology */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Methodology methodology={data.methodology} prospect={data.prospect} />
      </section>

      {/* Target cards */}
      {targetsCount > 0 && (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
          <div className="grid grid-cols-1 gap-5">
            {data.switch_targets.map((t, i) => (
              <TargetCard key={`${t.sponsor.name}-${i}`} target={t} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* Action footer */}
      {targetsCount > 0 && (
        <section className="border-t border-outline-variant/30 bg-surface-lowest">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex flex-wrap gap-3 justify-center">
              <a
                href={csvHref}
                download={csvFilename}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-primary text-white font-semibold hover:opacity-90 transition-opacity shadow-ambient"
              >
                <DownloadIcon />
                Download CSV
              </a>
              <a
                href={mailto}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-surface border border-outline-variant/40 text-on-surface font-semibold hover:bg-surface-low transition-colors"
              >
                <ReplyIcon />
                Reply to discuss
              </a>
            </div>
            <p className="text-xs text-on-surface-variant/70 text-center mt-5">
              Built for {fname} at {data.prospect.company_name} only — do not share.
            </p>
          </div>
        </section>
      )}
    </div>
  );
}
