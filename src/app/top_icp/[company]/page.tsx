"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";

interface Lead {
  full_name: string;
  title: string;
  headline: string;
  functional_level: string;
  seniority_level: string;
  email: string;
  company: string;
  company_address: string;
  company_website: string;
  company_description: string;
  company_phone: string;
  linkedin: string;
  company_logo: string;
}

interface ProspectData {
  prospect_email: string;
  prospect_company: string;
  icp: string;
  generated_at: string;
  leads: Lead[];
}

function seniorityLabel(level: string): string {
  const map: Record<string, string> = {
    c_suite: "C-Suite",
    vp: "VP",
    director: "Director",
    manager: "Manager",
    senior: "Senior",
    founder: "Founder",
  };
  return map[level] || level;
}

function EnvelopeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  );
}

function BuildingIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
      <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
      <path d="M9 22v-4h6v4" />
      <path d="M8 6h.01" /><path d="M16 6h.01" />
      <path d="M8 10h.01" /><path d="M16 10h.01" />
      <path d="M8 14h.01" /><path d="M16 14h.01" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function PersonIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary/30">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function LogoFallback({ company }: { company: string }) {
  return (
    <div className="w-12 h-12 rounded-xl bg-primary/8 flex items-center justify-center shrink-0">
      <span className="text-lg font-bold text-primary">
        {company.charAt(0).toUpperCase()}
      </span>
    </div>
  );
}

function LeadCard({ lead, index }: { lead: Lead; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const [logoError, setLogoError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.08,
        type: "spring",
        stiffness: 100,
        damping: 20,
      }}
      className="group bg-surface-lowest rounded-2xl border border-outline-variant/30 shadow-ambient overflow-hidden hover:border-primary/20 hover:shadow-[0_20px_50px_rgba(14,29,43,0.1)] transition-all duration-300"
    >
      {/* Top section: gradient bg with avatar + identity */}
      <div className="relative bg-gradient-to-br from-primary/[0.04] to-secondary-fixed/30 px-6 pt-6 pb-5">
        <div className="flex items-start gap-4">
          {/* Profile placeholder */}
          <div className="w-16 h-16 rounded-2xl bg-surface-lowest border border-outline-variant/20 flex items-center justify-center shrink-0 shadow-sm">
            <PersonIcon />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="text-lg font-semibold text-on-surface leading-tight">
                  {lead.full_name}
                </h3>
                <p className="text-sm text-on-surface-variant leading-snug mt-0.5 line-clamp-2">
                  {lead.title}
                </p>
              </div>
            </div>
            {/* Company with logo */}
            <div className="flex items-center gap-2 mt-2">
              {logoError ? (
                <LogoFallback company={lead.company} />
              ) : (
                <Image
                  src={lead.company_logo}
                  alt={`${lead.company} logo`}
                  width={20}
                  height={20}
                  className="rounded bg-surface-lowest object-contain shrink-0"
                  onError={() => setLogoError(true)}
                  unoptimized
                />
              )}
              <span className="text-sm font-medium text-primary">{lead.company}</span>
            </div>
          </div>
        </div>
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-4">
          <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary border border-primary/10">
            {seniorityLabel(lead.seniority_level)}
          </span>
          <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-secondary/8 text-secondary border border-secondary/10 capitalize">
            {lead.functional_level.replace(/_/g, " ")}
          </span>
        </div>
      </div>

      {/* Contact links */}
      <div className="px-6 py-4 space-y-3">
        <a
          href={`mailto:${lead.email}`}
          className="flex items-center gap-3 text-sm text-on-surface-variant hover:text-primary transition-colors group/link"
        >
          <span className="w-8 h-8 rounded-lg bg-primary/6 flex items-center justify-center text-primary group-hover/link:bg-primary/12 transition-colors">
            <EnvelopeIcon />
          </span>
          <span className="truncate font-medium">{lead.email}</span>
        </a>

        {lead.linkedin && (
          <a
            href={lead.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-sm text-on-surface-variant hover:text-[#0A66C2] transition-colors group/link"
          >
            <span className="w-8 h-8 rounded-lg bg-[#0A66C2]/8 flex items-center justify-center text-[#0A66C2] group-hover/link:bg-[#0A66C2]/15 transition-colors">
              <LinkedInIcon />
            </span>
            <span className="truncate font-medium">
              {lead.linkedin.replace(/^https?:\/\/(www\.)?/, "").length > 40
                ? "View Profile"
                : lead.linkedin.replace(/^https?:\/\/(www\.)?/, "")}
            </span>
          </a>
        )}

        {lead.company_website && (
          <a
            href={lead.company_website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-sm text-on-surface-variant hover:text-primary transition-colors group/link"
          >
            <span className="w-8 h-8 rounded-lg bg-primary/6 flex items-center justify-center text-primary group-hover/link:bg-primary/12 transition-colors">
              <GlobeIcon />
            </span>
            <span className="truncate font-medium">{lead.company_website.replace(/^https?:\/\/(www\.)?/, "")}</span>
          </a>
        )}
      </div>

      {/* Expandable section */}
      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="px-6 pb-4"
        >
          <div className="pt-4 border-t border-outline-variant/20 space-y-4">
            {lead.company_description && (
              <div>
                <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                  About {lead.company}
                </span>
                <p className="text-sm text-on-surface-variant mt-1.5 leading-relaxed">
                  {lead.company_description}
                </p>
              </div>
            )}
            <div className="space-y-3">
              {lead.company_address && (
                <div className="flex items-center gap-3 text-sm">
                  <span className="w-8 h-8 rounded-lg bg-primary/6 flex items-center justify-center text-primary">
                    <BuildingIcon />
                  </span>
                  <div className="min-w-0">
                    <span className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">Company Address</span>
                    <p className="text-on-surface truncate">{lead.company_address}</p>
                  </div>
                </div>
              )}
              {lead.company_phone && (
                <a href={`tel:${lead.company_phone}`} className="flex items-center gap-3 text-sm hover:text-primary transition-colors group/link">
                  <span className="w-8 h-8 rounded-lg bg-primary/6 flex items-center justify-center text-primary group-hover/link:bg-primary/12 transition-colors">
                    <PhoneIcon />
                  </span>
                  <div className="min-w-0">
                    <span className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">Company Phone</span>
                    <p className="text-on-surface">{lead.company_phone}</p>
                  </div>
                </a>
              )}
              {lead.headline && (
                <div className="flex items-start gap-3 text-sm">
                  <div className="min-w-0">
                    <span className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">Headline</span>
                    <p className="text-on-surface">{lead.headline}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Expand toggle */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-6 py-3 text-xs font-medium text-on-surface-variant hover:text-primary border-t border-outline-variant/15 hover:bg-surface-low/50 transition-colors cursor-pointer"
      >
        {expanded ? "Show less" : "+ Show more"}
      </button>
    </motion.div>
  );
}

export default function TopICPPage() {
  const params = useParams();
  const company = params.company as string;
  const [data, setData] = useState<ProspectData | null>(null);
  const [error, setError] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!company) return;

    fetch(`/data/${company}.json`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((json) => {
        const missing: string[] = [];
        if (!json.prospect_company) missing.push("prospect_company");
        if (!json.icp) missing.push("icp");
        if (!json.generated_at) missing.push("generated_at");
        if (!json.leads || !Array.isArray(json.leads) || json.leads.length === 0)
          missing.push("leads");
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
  }, [company]);

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
          <h1 className="text-2xl font-bold text-red-600 mb-2">
            Invalid JSON data
          </h1>
          <p className="text-on-surface-variant mb-4">
            Missing required fields:
          </p>
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
          <h1 className="text-2xl font-bold text-on-surface mb-2">
            Page not found
          </h1>
          <p className="text-on-surface-variant">
            This report may have expired or the link is incorrect.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-surface">
      {/* Header */}
      <header className="border-b border-outline-variant/30 bg-surface-lowest/80 glass-effect sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <a href="https://stackleaps.com">
            <Image
              src="/images/logo.png"
              alt="StackLeaps"
              width={120}
              height={32}
              className="h-8 w-auto"
            />
          </a>
          <a
            href="https://stackleaps.com"
            className="text-sm font-medium text-primary hover:text-secondary transition-colors"
          >
            stackleaps.com
          </a>
        </div>
      </header>

      {/* Hero section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
        >
          <p className="text-sm font-medium text-secondary uppercase tracking-wider mb-3">
            Curated for {data.prospect_company}
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-on-surface leading-tight tracking-tight">
            Your Top 10 Business Partners
          </h1>
          <p className="mt-4 text-lg text-on-surface-variant max-w-2xl leading-relaxed">
            Tour operators and travel companies matched to your destination and
            niche - the kind of partners that would actually want to work with you.
          </p>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, type: "spring", stiffness: 100, damping: 20 }}
          className="mt-8 flex flex-wrap gap-6 text-sm"
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-on-surface-variant">
              <span className="font-semibold text-on-surface">{data.leads.length}</span> verified contacts
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-secondary-container" />
            <span className="text-on-surface-variant">
              Matched to: <span className="font-semibold text-on-surface capitalize">{data.icp}</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-on-surface-variant">
              Generated {data.generated_at}
            </span>
          </div>
        </motion.div>
      </section>

      {/* Lead cards grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {data.leads.map((lead, i) => (
            <LeadCard key={lead.email} lead={lead} index={i} />
          ))}
        </div>
      </section>

      {/* CTA footer */}
      <section className="border-t border-outline-variant/30 bg-surface-lowest">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h2 className="text-2xl font-bold text-on-surface mb-3">
            Want us to turn matches like these into meetings on your calendar?
          </h2>
          <p className="text-on-surface-variant mb-6 max-w-lg mx-auto">
            We handle the outreach, you take the meetings. No cold calling, no trade shows - just qualified introductions.
          </p>
          <a
            href="https://stackleaps.com/#book"
            className="inline-flex items-center px-6 py-3 rounded-xl bg-secondary-container text-white font-semibold hover:bg-secondary transition-colors shadow-ambient"
          >
            Book a Call
          </a>
        </div>
      </section>
    </div>
  );
}
