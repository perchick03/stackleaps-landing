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
  };
  return map[level] || level;
}

function LogoFallback({ company }: { company: string }) {
  return (
    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
      <span className="text-xl font-bold text-primary">
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
      className="group bg-surface-lowest rounded-2xl border border-outline-variant/30 shadow-ambient overflow-hidden hover:border-outline-variant/60 transition-colors duration-300"
    >
      <div className="p-6">
        {/* Header: Logo + Name + Title */}
        <div className="flex items-start gap-4 mb-5">
          {logoError ? (
            <LogoFallback company={lead.company} />
          ) : (
            <Image
              src={lead.company_logo}
              alt={`${lead.company} logo`}
              width={56}
              height={56}
              className="rounded-2xl bg-surface-low object-contain shrink-0"
              onError={() => setLogoError(true)}
              unoptimized
            />
          )}
          <div className="min-w-0">
            <h3 className="text-lg font-semibold text-on-surface leading-tight truncate">
              {lead.full_name}
            </h3>
            <p className="text-sm text-on-surface-variant leading-snug mt-0.5">
              {lead.title}
            </p>
            <p className="text-sm font-medium text-primary mt-1">
              {lead.company}
            </p>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-5">
          <span className="px-2.5 py-1 text-xs font-medium rounded-lg bg-primary/8 text-primary">
            {seniorityLabel(lead.seniority_level)}
          </span>
          <span className="px-2.5 py-1 text-xs font-medium rounded-lg bg-secondary/8 text-secondary capitalize">
            {lead.functional_level}
          </span>
        </div>

        {/* Quick info grid */}
        <div className="grid grid-cols-1 gap-3 text-sm">
          <InfoRow label="Email" value={lead.email} href={`mailto:${lead.email}`} />
          {lead.linkedin && (
            <InfoRow
              label="LinkedIn"
              value="View Profile"
              href={lead.linkedin}
              external
            />
          )}
          {lead.company_website && (
            <InfoRow
              label="Website"
              value={lead.company_website.replace(/^https?:\/\/(www\.)?/, "")}
              href={lead.company_website}
              external
            />
          )}
        </div>

        {/* Expandable section */}
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="mt-4 pt-4 border-t border-outline-variant/30"
          >
            <div className="grid grid-cols-1 gap-3 text-sm">
              {lead.company_description && (
                <div>
                  <span className="text-xs font-medium text-on-surface-variant uppercase tracking-wide">
                    About {lead.company}
                  </span>
                  <p className="text-on-surface-variant mt-1 leading-relaxed">
                    {lead.company_description}
                  </p>
                </div>
              )}
              {lead.company_address && (
                <InfoRow label="Address" value={lead.company_address} />
              )}
              {lead.company_phone && (
                <InfoRow
                  label="Phone"
                  value={lead.company_phone}
                  href={`tel:${lead.company_phone}`}
                />
              )}
              {lead.headline && (
                <InfoRow label="Headline" value={lead.headline} />
              )}
            </div>
          </motion.div>
        )}
      </div>

      {/* Expand toggle */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-6 py-3 text-xs font-medium text-on-surface-variant hover:text-primary border-t border-outline-variant/20 hover:bg-surface-low/50 transition-colors cursor-pointer"
      >
        {expanded ? "Show less" : "+ Show more enriched data"}
      </button>
    </motion.div>
  );
}

function InfoRow({
  label,
  value,
  href,
  external,
}: {
  label: string;
  value: string;
  href?: string;
  external?: boolean;
}) {
  return (
    <div className="flex items-baseline gap-3">
      <span className="text-xs font-medium text-on-surface-variant uppercase tracking-wide w-20 shrink-0">
        {label}
      </span>
      {href ? (
        <a
          href={href}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
          className="text-primary hover:text-secondary-container font-medium truncate transition-colors"
        >
          {value}
        </a>
      ) : (
        <span className="text-on-surface truncate">{value}</span>
      )}
    </div>
  );
}

export default function TopICPPage() {
  const params = useParams();
  const company = params.company as string;
  const [data, setData] = useState<ProspectData | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!company) return;

    fetch(`/data/${company}.json`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((json) => {
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

  if (error || !data) {
    return (
      <div className="min-h-[100dvh] bg-surface flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-on-surface mb-2">
            Page not found
          </h1>
          <p className="text-on-surface-variant">
            This lead list may have expired or the link is incorrect.
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
          <Image
            src="/images/logo.png"
            alt="StackLeaps"
            width={120}
            height={32}
            className="h-8 w-auto"
          />
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
            Your Top 10 ICP Leads
          </h1>
          <p className="mt-4 text-lg text-on-surface-variant max-w-2xl leading-relaxed">
            Hand-picked decision-makers in the{" "}
            <span className="font-semibold text-on-surface">{data.icp}</span>{" "}
            space — verified contacts ready for outreach.
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
              <span className="font-semibold text-on-surface">{data.leads.length}</span> verified leads
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-secondary-container" />
            <span className="text-on-surface-variant">
              ICP: <span className="font-semibold text-on-surface capitalize">{data.icp}</span>
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
            Want us to book meetings with leads like these?
          </h2>
          <p className="text-on-surface-variant mb-6 max-w-lg mx-auto">
            We handle the outreach, you take the meetings. Let&apos;s talk about filling your pipeline.
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
