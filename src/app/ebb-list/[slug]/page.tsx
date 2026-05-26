"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { track } from "@vercel/analytics";
import EbbHeader from "@/components/ebb-list/EbbHeader";

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
  if (n >= 1_000) return `$${Math.round(n / 1_000)}K`;
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
    "sponsor_name", "sponsor_state", "sponsor_employee_count", "sponsor_industry_name",
    "sponsor_current_broker", "sponsor_annual_commission_usd", "sponsor_next_renewal",
    "sponsor_renewal_in_days", "contact_full_name", "contact_title", "contact_email", "contact_linkedin",
  ];
  const rows = targets.map((t) => [
    t.sponsor.name, t.sponsor.state, t.sponsor.employee_count, t.sponsor.industry_name,
    t.sponsor.current_broker, t.sponsor.annual_commission_usd, t.sponsor.next_renewal,
    t.sponsor.renewal_in_days, t.contact.full_name, t.contact.title, t.contact.email, t.contact.linkedin,
  ]);
  return [headers.join(","), ...rows.map((r) => r.map(csvEscape).join(","))].join("\n");
}

// ---------- urgency helpers ----------

function urgencyTone(days: number | null): "good" | "warn" | "neutral" {
  if (days == null) return "neutral";
  if (days <= 14) return "good";
  if (days <= 30) return "warn";
  return "neutral";
}

function urgencyLabel(days: number | null): string {
  if (days == null) return "Renews TBD";
  if (days === 0) return "Renews today";
  if (days < 0) return `Overdue ${Math.abs(days)}d`;
  return `Renews in ${days} days`;
}

// ---------- icons (ultra-light hairline strokes) ----------

const stroke = { fill: "none" as const, stroke: "currentColor", strokeWidth: 1.2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

function ArrowUpRight({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...stroke}>
      <path d="M7 17 17 7M9 7h8v8" />
    </svg>
  );
}
function MailIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" {...stroke}>
      <rect width="18" height="14" x="3" y="5" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}
function LinkedInBrand() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}
function CopyOutline() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" {...stroke}>
      <rect x="8" y="8" width="13" height="13" rx="2" />
      <path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3" />
    </svg>
  );
}
function DownloadOutline() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" {...stroke}>
      <path d="M12 4v12m0 0 4-4m-4 4-4-4M4 20h16" />
    </svg>
  );
}
function ChevronDown({ open }: { open: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" {...stroke}
      style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 500ms cubic-bezier(0.32,0.72,0,1)" }}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
function DotPulse({ tone }: { tone: "good" | "warn" | "neutral" }) {
  const color = tone === "good" ? "bg-emerald-500" : tone === "warn" ? "bg-amber-500" : "bg-on-surface-variant/40";
  return (
    <span className="relative inline-flex w-1.5 h-1.5 shrink-0">
      <span className={`absolute inset-0 rounded-full ${color} opacity-40 animate-ping`} />
      <span className={`relative rounded-full w-1.5 h-1.5 ${color}`} />
    </span>
  );
}

// ---------- urgency pill ----------

function UrgencyPill({ days }: { days: number | null }) {
  const tone = urgencyTone(days);
  const styles: Record<typeof tone, string> = {
    good: "bg-emerald-50/80 text-emerald-800 ring-emerald-200/70",
    warn: "bg-amber-50/80 text-amber-800 ring-amber-200/70",
    neutral: "bg-white text-on-surface-variant ring-black/[0.06]",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium ring-1 ring-inset ${styles[tone]}`}>
      <DotPulse tone={tone} />
      {urgencyLabel(days)}
    </span>
  );
}

// ---------- meta chips ----------

function MetaChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium text-on-surface-variant bg-[var(--color-surface-low)] ring-1 ring-inset ring-black/[0.04]">
      {children}
    </span>
  );
}

function SeniorityChip({ tier }: { tier: string }) {
  const labels: Record<string, string> = { c_suite: "C-Suite", vp: "VP", director: "Director", manager: "Manager", other: "Other" };
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium tracking-wide uppercase text-on-surface-variant bg-white ring-1 ring-inset ring-black/[0.06]">
      {labels[tier] || tier}
    </span>
  );
}

function TierTick({ tier }: { tier: string }) {
  const level = tier === "large" ? 3 : tier === "medium" ? 2 : 1;
  return (
    <span className="inline-flex items-center gap-0.5" title={`${tier} commission tier`}>
      {[1, 2, 3].map((i) => (
        <span key={i} className={`block w-1 h-3 rounded-full ${i <= level ? "bg-on-surface" : "bg-on-surface/15"}`} />
      ))}
    </span>
  );
}

// ---------- card ----------

function TargetCard({ target, index, slug }: { target: SwitchTarget; index: number; slug: string }) {
  const [copied, setCopied] = useState(false);
  const { sponsor, contact } = target;
  const sponsorDisplay = titleCase(sponsor.name);
  const brokerDisplay = titleCase(sponsor.current_broker);
  const tone = urgencyTone(sponsor.renewal_in_days);
  const railColor =
    tone === "good" ? "bg-emerald-400/80" : tone === "warn" ? "bg-amber-400/80" : "bg-on-surface-variant/15";

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(contact.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
      track("email_copied", { slug, sponsor: sponsor.name, contact: contact.full_name });
    } catch {
      // ignore
    }
  }

  function onLinkedInClick() {
    track("linkedin_clicked", { slug, sponsor: sponsor.name, contact: contact.full_name });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ delay: Math.min(index * 0.04, 0.3), duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="group relative"
    >
      {/* Outer shell — Double-Bezel */}
      <div className="rounded-[1.75rem] bg-gradient-to-b from-black/[0.04] to-black/[0.02] p-[5px] ring-1 ring-inset ring-black/[0.04] hover:ring-black/[0.08] transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]">
        {/* Inner core */}
        <div className="relative rounded-[calc(1.75rem-5px)] bg-[var(--color-surface-lowest)] overflow-hidden shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_1px_2px_rgba(14,29,43,0.04),0_20px_50px_-30px_rgba(14,29,43,0.18)]">
          {/* Urgency rail */}
          <div className={`absolute left-0 top-0 bottom-0 w-[3px] ${railColor}`} />

          <div className="px-7 sm:px-8 pt-7 pb-6 grid grid-cols-12 gap-6">
            {/* Left: sponsor + meta */}
            <div className="col-span-12 md:col-span-7 min-w-0">
              <div className="flex items-start justify-between gap-3 mb-3 md:hidden">
                <UrgencyPill days={sponsor.renewal_in_days} />
              </div>
              <h3 className="font-serif text-[1.7rem] sm:text-[1.9rem] leading-[1.05] tracking-[-0.01em] text-on-surface">
                {sponsorDisplay}
              </h3>

              <div className="mt-3 flex flex-wrap gap-1.5">
                <MetaChip>{sponsor.state}</MetaChip>
                {sponsor.employee_count != null && <MetaChip>{sponsor.employee_count} employees</MetaChip>}
                {sponsor.industry_name && <MetaChip>{sponsor.industry_name}</MetaChip>}
              </div>

              <p className="mt-4 text-[13px] text-on-surface-variant">
                Currently with <span className="font-medium text-on-surface">{brokerDisplay}</span>
              </p>
            </div>

            {/* Right: urgency + commission hero */}
            <div className="col-span-12 md:col-span-5 flex flex-col items-start md:items-end gap-3">
              <div className="hidden md:block">
                <UrgencyPill days={sponsor.renewal_in_days} />
              </div>
              {sponsor.next_renewal && sponsor.renewal_in_days != null && sponsor.renewal_in_days <= 30 && (
                <span className="text-[10px] uppercase tracking-[0.18em] text-on-surface-variant/80">
                  {shortDate(sponsor.next_renewal)}
                </span>
              )}

              <div className="mt-1 md:text-right">
                <div className="flex items-baseline gap-2 md:justify-end">
                  <span className="font-serif text-4xl sm:text-[2.75rem] leading-none tracking-[-0.02em] text-on-surface">
                    {moneyShort(sponsor.annual_commission_usd)}
                  </span>
                </div>
                <div className="mt-1.5 flex items-center gap-2 md:justify-end text-[11px] text-on-surface-variant uppercase tracking-[0.16em]">
                  <TierTick tier={sponsor.commission_tier} />
                  <span>annual commission</span>
                </div>
              </div>
            </div>
          </div>

          {/* Hairline divider */}
          <div className="mx-7 sm:mx-8 border-t border-black/[0.05]" />

          {/* Contact row */}
          <div className="px-7 sm:px-8 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-b from-transparent to-black/[0.015]">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[15px] font-semibold text-on-surface">{contact.full_name}</span>
                <SeniorityChip tier={contact.seniority_tier} />
              </div>
              <p className="text-[12.5px] text-on-surface-variant mt-0.5 leading-snug">{contact.title}</p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {contact.email && (
                <button
                  onClick={copyEmail}
                  className="group/cta inline-flex items-center gap-2 pl-3.5 pr-2 py-1.5 rounded-full bg-white ring-1 ring-inset ring-black/[0.06] hover:ring-black/[0.12] active:scale-[0.98] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
                  title="Copy email"
                >
                  <span className="text-on-surface/70 group-hover/cta:text-on-surface transition-colors">
                    <MailIcon />
                  </span>
                  <span className="text-[12px] font-mono text-on-surface truncate max-w-[200px] sm:max-w-[260px]">
                    {contact.email}
                  </span>
                  {contact.email_verified && (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium tracking-wide uppercase bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200/70">
                      <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                      Verified
                    </span>
                  )}
                  <span className="ml-0.5 inline-flex items-center justify-center w-6 h-6 rounded-full bg-black/[0.04] group-hover/cta:bg-black/[0.08] text-on-surface/70 group-hover/cta:translate-x-[1px] group-hover/cta:-translate-y-[1px] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]">
                    <CopyOutline />
                  </span>
                  {copied && <span className="text-[10px] text-emerald-600 font-medium ml-1">Copied</span>}
                </button>
              )}
              {contact.linkedin && (
                <a
                  href={contact.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={onLinkedInClick}
                  className="group/cta inline-flex items-center gap-2 pl-3.5 pr-2 py-1.5 rounded-full bg-white ring-1 ring-inset ring-black/[0.06] hover:ring-black/[0.12] active:scale-[0.98] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
                >
                  <span className="text-[#0A66C2]">
                    <LinkedInBrand />
                  </span>
                  <span className="text-[12px] text-on-surface">in/{linkedinHandle(contact.linkedin)}</span>
                  <span className="ml-0.5 inline-flex items-center justify-center w-6 h-6 rounded-full bg-black/[0.04] group-hover/cta:bg-black/[0.08] text-on-surface/70 group-hover/cta:translate-x-[1px] group-hover/cta:-translate-y-[1px] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]">
                    <ArrowUpRight size={12} />
                  </span>
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

function MethodologyBlock({ methodology, prospect }: { methodology: Methodology; prospect: Prospect }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="rounded-[1.75rem] bg-gradient-to-b from-black/[0.04] to-black/[0.02] p-[5px] ring-1 ring-inset ring-black/[0.04]">
      <div className="rounded-[calc(1.75rem-5px)] bg-[var(--color-surface-lowest)] overflow-hidden shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_1px_2px_rgba(14,29,43,0.04)]">
        <button
          onClick={() => setOpen(!open)}
          className="w-full px-7 sm:px-8 py-5 flex items-center justify-between text-left hover:bg-black/[0.015] transition-colors duration-500 ease-cinematic cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <span className="text-[10px] uppercase tracking-[0.22em] text-on-surface-variant/70">Methodology</span>
            <span className="text-[15px] font-medium text-on-surface">How this list was built</span>
          </div>
          <ChevronDown open={open} />
        </button>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="px-7 sm:px-8 pb-7"
          >
            <p className="font-serif italic text-lg text-on-surface/80 mb-4 leading-relaxed">
              {methodology.source}
            </p>
            <ul className="space-y-2">
              {methodology.filters.map((f, i) => (
                <li key={i} className="flex gap-3 text-[13.5px] text-on-surface-variant leading-relaxed">
                  <span className="mt-2 w-1 h-1 rounded-full bg-on-surface-variant/50 shrink-0" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-[13.5px] text-on-surface-variant leading-relaxed">{methodology.enrichment}</p>
            <p className="mt-5 pt-4 border-t border-black/[0.05] text-[11px] text-on-surface-variant/70">
              Built for {firstName(prospect.full_name)} at {prospect.company_name} only — do not share.
            </p>
          </motion.div>
        )}
      </div>
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
        if (missing.length > 0) { setValidationErrors(missing); setLoading(false); return; }
        setData(json);
        setLoading(false);
        track("brief_opened", {
          slug,
          broker: json.prospect.company_name,
          targets: json.switch_targets.length,
        });
      })
      .catch(() => { setError(true); setLoading(false); });
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
          <p className="text-on-surface-variant">This brief may have expired or the link is incorrect.</p>
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

  // Urgency summary — Next 2 weeks / Next month / Next 3 months
  const next2Weeks = data.switch_targets.filter((t) => t.sponsor.renewal_in_days != null && t.sponsor.renewal_in_days <= 14).length;
  const nextMonth = data.switch_targets.filter((t) => t.sponsor.renewal_in_days != null && t.sponsor.renewal_in_days > 14 && t.sponsor.renewal_in_days <= 30).length;
  const next3Months = data.switch_targets.filter((t) => t.sponsor.renewal_in_days != null && t.sponsor.renewal_in_days > 30 && t.sponsor.renewal_in_days <= 90).length;
  const totalCommission = data.switch_targets.reduce((sum, t) => sum + (t.sponsor.annual_commission_usd || 0), 0);

  return (
    <div className="min-h-[100dvh] bg-[var(--color-surface-low)]/40 paper-grain relative">
      {/* Soft background glow */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 h-[60vh] -z-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(255,142,59,0.06), transparent 60%), radial-gradient(ellipse 50% 50% at 90% 10%, rgba(22,49,74,0.05), transparent 60%)",
        }}
      />

      <div className="relative z-10">
        <EbbHeader
          prefill={{
            name: data.prospect.full_name,
            email: data.prospect.email,
            company: data.prospect.company_name,
            brief_slug: slug,
          }}
        />

        {/* Hero — Editorial Split */}
        <section className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-10 pt-20 sm:pt-28 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white ring-1 ring-inset ring-black/[0.06] mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-secondary-container)]" />
              <span className="text-[10px] uppercase tracking-[0.22em] font-medium text-on-surface-variant">
                Switch-Target Brief
              </span>
            </div>

            <div className="grid grid-cols-12 gap-8 lg:gap-12 items-end">
              {/* Left: massive editorial headline */}
              <div className="col-span-12 lg:col-span-8">
                <p className="text-[13px] text-on-surface-variant mb-5">
                  Built for <span className="font-medium text-on-surface">{fname}</span> at{" "}
                  <span className="font-medium text-on-surface">{data.prospect.company_name}</span>{" "}
                  <span className="text-on-surface-variant/50 mx-1">·</span>
                  {humanDate(data.generated_at)}
                </p>

                {targetsCount > 0 && (
                  <h1 className="font-serif leading-[0.95] tracking-[-0.02em] text-on-surface">
                    <span className="block text-[clamp(3.5rem,9vw,7rem)]">
                      {targetsCount}
                      <span className="text-on-surface-variant/40"> </span>
                    </span>
                    <span className="block text-[clamp(1.35rem,2.2vw,1.75rem)] mt-3 font-sans font-light text-on-surface/85 max-w-2xl leading-[1.25]">
                      <span className="font-serif italic">{stateAbbr}</span> mid-market employers
                      with switchable broker-of-record relationships, renewing in the next
                      <span className="font-serif italic"> 120 days</span>.
                    </span>
                  </h1>
                )}
              </div>

              {/* Right: at-a-glance metrics panel */}
              {targetsCount > 0 && (
                <div className="col-span-12 lg:col-span-4">
                  <div className="rounded-[1.5rem] bg-gradient-to-b from-black/[0.04] to-black/[0.02] p-[5px] ring-1 ring-inset ring-black/[0.04]">
                    <div className="rounded-[calc(1.5rem-5px)] bg-[var(--color-surface-lowest)] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
                      <div className="text-[10px] uppercase tracking-[0.22em] text-on-surface-variant/70 mb-3">
                        At a glance
                      </div>
                      <dl className="grid grid-cols-3 gap-3">
                        <div>
                          <dt className="text-[10.5px] text-on-surface-variant leading-tight">Next<br />2 weeks</dt>
                          <dd className="font-serif text-2xl mt-1.5 leading-none">
                            <span className={next2Weeks > 0 ? "text-emerald-700" : "text-on-surface/40"}>{next2Weeks}</span>
                          </dd>
                        </div>
                        <div>
                          <dt className="text-[10.5px] text-on-surface-variant leading-tight">Next<br />month</dt>
                          <dd className="font-serif text-2xl mt-1.5 leading-none">
                            <span className={nextMonth > 0 ? "text-amber-700" : "text-on-surface/40"}>{nextMonth}</span>
                          </dd>
                        </div>
                        <div>
                          <dt className="text-[10.5px] text-on-surface-variant leading-tight">Next<br />3 months</dt>
                          <dd className="font-serif text-2xl mt-1.5 leading-none text-on-surface">
                            {next3Months}
                          </dd>
                        </div>
                        <div className="col-span-3 pt-3 border-t border-black/[0.05]">
                          <dt className="text-[11px] text-on-surface-variant">Total commission in scope</dt>
                          <dd className="font-serif text-3xl text-on-surface mt-1 leading-none">
                            {moneyShort(totalCommission)}
                          </dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </section>

        {/* Empty / partial states */}
        {targetsCount === 0 && (
          <section className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-10 pb-10">
            <div className="rounded-[1.75rem] bg-gradient-to-b from-black/[0.04] to-black/[0.02] p-[5px] ring-1 ring-inset ring-black/[0.04]">
              <div className="rounded-[calc(1.75rem-5px)] bg-[var(--color-surface-lowest)] p-8">
                {data.stats?.candidates_filtered === 0 ? (
                  <p className="text-on-surface leading-relaxed">
                    No mid-market employers in {stateAbbr} are listed as having a broker-of-record renewing in the next 120 days. We&apos;ll re-check on the next cycle.
                  </p>
                ) : (
                  <p className="text-on-surface leading-relaxed">
                    No usable matches in your state and 120-day window this round. We&apos;ll re-check on the next renewal cycle and email if anything moves into range.
                  </p>
                )}
              </div>
            </div>
          </section>
        )}

        {targetsCount > 0 && targetsCount < 10 && (
          <section className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-10 pb-4">
            <p className="text-[13px] text-on-surface-variant italic">
              Found {targetsCount} strong {targetsCount === 1 ? "match" : "matches"} in your state and renewal window.
              {data.flagged_targets.length > 0 && (
                <> {data.flagged_targets.length} more {data.flagged_targets.length === 1 ? "is" : "are"} pending review and may follow in a separate brief.</>
              )}
            </p>
          </section>
        )}

        {/* Methodology */}
        <section className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-10 py-8">
          <MethodologyBlock methodology={data.methodology} prospect={data.prospect} />
        </section>

        {/* Section eyebrow + list */}
        {targetsCount > 0 && (
          <section className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-10 pb-20">
            <div className="flex items-end justify-between mb-8">
              <div>
                <div className="text-[10px] uppercase tracking-[0.22em] text-on-surface-variant/70 mb-2">
                  The list
                </div>
                <h2 className="font-serif text-[2rem] leading-none tracking-[-0.01em] text-on-surface">
                  Sorted by urgency
                </h2>
              </div>
              <p className="hidden sm:block text-[12px] text-on-surface-variant/70 max-w-xs text-right">
                Most urgent renewal first, then largest commission.
              </p>
            </div>

            <div className="flex flex-col gap-5">
              {data.switch_targets.map((t, i) => (
                <TargetCard key={`${t.sponsor.name}-${i}`} target={t} index={i} slug={slug} />
              ))}
            </div>
          </section>
        )}

        {/* Action footer */}
        {targetsCount > 0 && (
          <section className="border-t border-black/[0.06] bg-gradient-to-b from-transparent to-black/[0.02]">
            <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-10 py-20">
              <div className="text-center max-w-2xl mx-auto">
                <div className="text-[10px] uppercase tracking-[0.22em] text-on-surface-variant/70 mb-4">
                  Next move
                </div>
                <h3 className="font-serif text-[2rem] sm:text-[2.5rem] leading-tight tracking-[-0.01em] text-on-surface">
                  Take the list to your Monday calls.
                </h3>
                <p className="mt-4 text-[14px] text-on-surface-variant max-w-md mx-auto">
                  Export the table to CSV, or reply to discuss any of these rows directly.
                </p>

                <div className="mt-8 flex flex-wrap gap-3 justify-center">
                  <a
                    href={csvHref}
                    download={csvFilename}
                    onClick={() => track("csv_downloaded", { slug, targets: targetsCount })}
                    className="group inline-flex items-center gap-3 pl-5 pr-2 py-2 rounded-full bg-on-surface text-white font-medium text-[14px] hover:opacity-95 active:scale-[0.98] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
                  >
                    <span>Download CSV</span>
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/15 group-hover:bg-white/25 group-hover:translate-x-[1px] group-hover:-translate-y-[1px] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]">
                      <DownloadOutline />
                    </span>
                  </a>
                  <a
                    href={mailto}
                    onClick={() => track("reply_clicked", { slug })}
                    className="group inline-flex items-center gap-3 pl-5 pr-2 py-2 rounded-full bg-white text-on-surface font-medium text-[14px] ring-1 ring-inset ring-black/[0.08] hover:ring-black/[0.16] active:scale-[0.98] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
                  >
                    <span>Reply to discuss</span>
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-black/[0.04] group-hover:bg-black/[0.08] group-hover:translate-x-[1px] group-hover:-translate-y-[1px] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]">
                      <ArrowUpRight />
                    </span>
                  </a>
                </div>

                <p className="text-[11px] text-on-surface-variant/60 mt-10">
                  Built for {fname} at {data.prospect.company_name} only — do not share.
                </p>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
