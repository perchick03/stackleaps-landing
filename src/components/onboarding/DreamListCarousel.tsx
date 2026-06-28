"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import type { LeadCardData, VerdictEntry } from "./types";

function seniorityLabel(level: string): string {
  const map: Record<string, string> = {
    c_suite: "C-Suite",
    vp: "VP",
    director: "Director",
    manager: "Manager",
    senior: "Senior",
    founder: "Founder",
    owner: "Owner",
  };
  return map[level] || level.replace(/_/g, " ");
}

function PersonIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-primary)]/30">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function DreamCard({
  lead,
  entry,
  onVerdict,
  onNote,
}: {
  lead: LeadCardData;
  entry: VerdictEntry;
  onVerdict: (v: VerdictEntry["verdict"]) => void;
  onNote: (note: string) => void;
}) {
  const [logoError, setLogoError] = useState(false);
  const approved = entry.verdict === "approve";
  const rejected = entry.verdict === "reject";

  return (
    <div
      className={`flex flex-col bg-[var(--color-surface-lowest)] rounded-2xl border overflow-hidden shadow-ambient transition-colors ${
        approved
          ? "border-green-500/40"
          : rejected
            ? "border-red-400/40"
            : "border-[var(--color-outline-variant)]/20"
      }`}
    >
      {/* Identity header */}
      <div className="relative bg-gradient-to-br from-[var(--color-primary)]/[0.04] to-[var(--color-secondary-fixed)]/30 px-6 pt-6 pb-5">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[var(--color-surface-lowest)] border border-[var(--color-outline-variant)]/20 flex items-center justify-center shrink-0 shadow-sm">
            <PersonIcon />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-semibold text-[var(--color-on-surface)] leading-tight">
              {lead.full_name}
            </h3>
            {lead.title && (
              <p className="text-sm text-[var(--color-on-surface-variant)] leading-snug mt-0.5 line-clamp-2">
                {lead.title}
              </p>
            )}
            <div className="flex items-center gap-2 mt-2">
              {!logoError && lead.company_logo ? (
                <Image
                  src={lead.company_logo}
                  alt=""
                  width={18}
                  height={18}
                  unoptimized
                  className="rounded object-contain shrink-0"
                  onError={() => setLogoError(true)}
                />
              ) : (
                <span className="w-5 h-5 rounded bg-[var(--color-primary)]/10 flex items-center justify-center text-[10px] font-bold text-[var(--color-primary)] shrink-0">
                  {lead.company.charAt(0).toUpperCase()}
                </span>
              )}
              <span className="text-sm font-medium text-[var(--color-primary)] truncate">{lead.company}</span>
              {lead.company_country && (
                <span className="flex items-center gap-1 text-xs text-[var(--color-on-surface-variant)] shrink-0">
                  <LocationIcon />
                  {lead.company_country}
                </span>
              )}
            </div>
          </div>
        </div>
        {(lead.seniority_level || lead.functional_level) && (
          <div className="flex flex-wrap gap-2 mt-4">
            {lead.seniority_level && (
              <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                {seniorityLabel(lead.seniority_level)}
              </span>
            )}
            {lead.functional_level && (
              <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-[var(--color-secondary)]/8 text-[var(--color-secondary)] capitalize">
                {lead.functional_level.replace(/_/g, " ")}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="px-6 py-4 flex-1 space-y-3">
        {lead.company_description && (
          <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed line-clamp-4">
            {lead.company_description}
          </p>
        )}
        {lead.company_website && (
          <p className="text-sm font-medium text-[var(--color-primary)] truncate">
            {lead.company_website.replace(/^https?:\/\/(www\.)?/, "")}
          </p>
        )}
      </div>

      {/* Verdict footer — Tinder-style */}
      <div className="px-6 pb-5 pt-1 border-t border-[var(--color-outline-variant)]/15">
        <div className="flex gap-3 mt-4">
          <button
            type="button"
            onClick={() => onVerdict(rejected ? null : "reject")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm border transition-colors cursor-pointer ${
              rejected
                ? "bg-red-500 text-white border-red-500"
                : "border-[var(--color-outline-variant)]/40 text-[var(--color-on-surface-variant)] hover:border-red-300 hover:text-red-600"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Not a fit
          </button>
          <button
            type="button"
            onClick={() => onVerdict(approved ? null : "approve")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm border transition-colors cursor-pointer ${
              approved
                ? "bg-green-600 text-white border-green-600"
                : "border-[var(--color-outline-variant)]/40 text-[var(--color-on-surface-variant)] hover:border-green-400 hover:text-green-700"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Dream fit
          </button>
        </div>
        <textarea
          value={entry.note ?? ""}
          onChange={(e) => onNote(e.target.value)}
          rows={2}
          placeholder="Optional — why, or anyone like them?"
          className="mt-3 w-full px-3 py-2 text-sm rounded-lg border border-[var(--color-outline-variant)]/30 bg-[var(--color-surface-low)] text-[var(--color-on-surface)] placeholder:text-[var(--color-on-surface-variant)]/40 focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]/40 focus:border-[var(--color-secondary)] transition-colors resize-none"
        />
      </div>
    </div>
  );
}

interface DreamListCarouselProps {
  leads: LeadCardData[];
  getVerdict: (id: string) => VerdictEntry;
  setVerdict: (id: string, entry: VerdictEntry) => void;
}

export default function DreamListCarousel({ leads, getVerdict, setVerdict }: DreamListCarouselProps) {
  const [view, setView] = useState<"carousel" | "grid">("carousel");
  const [index, setIndex] = useState(0);

  if (leads.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[var(--color-outline-variant)]/40 bg-[var(--color-surface-low)]/40 px-6 py-12 text-center text-[var(--color-on-surface-variant)]">
        Sample dream-fit leads are being sourced — they&apos;ll appear here shortly.
      </div>
    );
  }

  const decided = leads.filter((l) => getVerdict(l.id).verdict !== null).length;
  const clamped = Math.min(index, leads.length - 1);
  const current = leads[clamped];

  const cardProps = (lead: LeadCardData) => ({
    lead,
    entry: getVerdict(lead.id),
    onVerdict: (v: VerdictEntry["verdict"]) => setVerdict(lead.id, { ...getVerdict(lead.id), verdict: v }),
    onNote: (note: string) => setVerdict(lead.id, { ...getVerdict(lead.id), note }),
  });

  return (
    <div>
      {/* Controls bar */}
      <div className="flex items-center justify-between gap-4 mb-5">
        <span className="text-sm text-[var(--color-on-surface-variant)]">
          <span className="font-semibold text-[var(--color-on-surface)]">{decided}</span> of {leads.length} reviewed
        </span>
        <div className="inline-flex rounded-lg border border-[var(--color-outline-variant)]/30 p-0.5 bg-[var(--color-surface-low)]">
          {(["carousel", "grid"] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setView(v)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md capitalize transition-colors cursor-pointer ${
                view === v
                  ? "bg-[var(--color-surface-lowest)] text-[var(--color-primary)] shadow-sm"
                  : "text-[var(--color-on-surface-variant)]"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {view === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {leads.map((lead) => (
            <DreamCard key={lead.id} {...cardProps(lead)} />
          ))}
        </div>
      ) : (
        <div>
          <div className="relative max-w-xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              >
                <DreamCard {...cardProps(current)} />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Nav */}
          <div className="flex items-center justify-center gap-6 mt-6">
            <button
              type="button"
              onClick={() => setIndex(Math.max(0, clamped - 1))}
              disabled={clamped === 0}
              aria-label="Previous"
              className="w-10 h-10 flex items-center justify-center rounded-full border border-[var(--color-outline-variant)]/40 text-[var(--color-primary)] hover:bg-[var(--color-surface-low)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="flex items-center gap-1.5">
              {leads.map((l, i) => (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Go to card ${i + 1}`}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    i === clamped ? "w-6 bg-[var(--color-primary)]" : "w-2 bg-[var(--color-outline-variant)]/50"
                  }`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => setIndex(Math.min(leads.length - 1, clamped + 1))}
              disabled={clamped === leads.length - 1}
              aria-label="Next"
              className="w-10 h-10 flex items-center justify-center rounded-full border border-[var(--color-outline-variant)]/40 text-[var(--color-primary)] hover:bg-[var(--color-surface-low)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
