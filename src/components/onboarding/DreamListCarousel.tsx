"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { Fit, LeadCardData, VerdictEntry } from "./types";

// 1-5 fit scale. Replaces the old binary approve/reject - a dentist can be
// "probably" and that's the signal we actually want.
const FIT_SCALE: { score: Fit; emoji: string; label: string }[] = [
  { score: 1, emoji: "👎", label: "Not a fit" },
  { score: 2, emoji: "🙁", label: "Weak" },
  { score: 3, emoji: "😐", label: "Maybe" },
  { score: 4, emoji: "🙂", label: "Good" },
  { score: 5, emoji: "🤩", label: "Dream fit" },
];

function FitScale({ value, onPick }: { value: Fit | null; onPick: (v: Fit | null) => void }) {
  const picked = FIT_SCALE.find((f) => f.score === value);
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-[var(--color-on-surface-variant)]">Fit</span>
        <span className="text-xs font-semibold text-[var(--color-primary)] h-4">{picked?.label ?? ""}</span>
      </div>
      <div className="flex gap-1.5">
        {FIT_SCALE.map((f) => {
          const on = value === f.score;
          return (
            <button
              key={f.score}
              type="button"
              onClick={() => onPick(on ? null : f.score)}
              aria-label={`${f.score} - ${f.label}`}
              title={f.label}
              className={`flex-1 flex flex-col items-center gap-0.5 py-2 rounded-xl border text-sm transition-all cursor-pointer ${
                on
                  ? "border-[var(--color-secondary)] bg-[var(--color-secondary)]/10 ring-2 ring-[var(--color-secondary)]/25"
                  : "border-[var(--color-outline-variant)]/40 hover:border-[var(--color-secondary)]/50 hover:bg-[var(--color-surface-low)] opacity-60 hover:opacity-100"
              }`}
            >
              <span className="text-lg leading-none">{f.emoji}</span>
              <span className="text-[10px] font-bold text-[var(--color-on-surface-variant)]">{f.score}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

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

function LocationIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function LeadLogo({ src, name }: { src?: string; name: string }) {
  const [err, setErr] = useState(false);
  return (
    <span className="w-14 h-14 rounded-2xl bg-[var(--color-surface-lowest)] border border-[var(--color-outline-variant)]/20 grid place-items-center overflow-hidden shrink-0 shadow-sm">
      {src && !err ? (
        <Image src={src} alt="" width={32} height={32} unoptimized className="object-contain" onError={() => setErr(true)} />
      ) : (
        <span className="text-xl font-bold text-[var(--color-primary)]">{name.charAt(0).toUpperCase()}</span>
      )}
    </span>
  );
}

function LinkChip({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--color-surface-low)] text-sm font-medium text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] hover:bg-[var(--color-surface-high)] transition-colors"
    >
      {children}
      {label}
    </a>
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
  onVerdict: (v: Fit | null) => void;
  onNote: (note: string) => void;
}) {
  const fit = entry.fit ?? null;
  const domain = lead.company_website?.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

  return (
    <div
      className={`flex flex-col bg-[var(--color-surface-lowest)] rounded-2xl border overflow-hidden shadow-ambient transition-colors ${
        fit === null
          ? "border-[var(--color-outline-variant)]/20"
          : fit >= 4
            ? "border-green-500/40"
            : fit <= 2
              ? "border-red-400/40"
              : "border-amber-400/40"
      }`}
    >
      {/* Identity header */}
      <div className="relative bg-gradient-to-br from-[var(--color-primary)]/[0.04] to-[var(--color-secondary-fixed)]/30 px-6 pt-6 pb-5">
        <div className="flex items-start gap-4">
          <LeadLogo src={lead.company_logo} name={lead.company} />
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-semibold text-[var(--color-on-surface)] leading-tight">{lead.full_name}</h3>
            {lead.title && (
              <p className="text-sm text-[var(--color-on-surface-variant)] leading-snug mt-0.5 line-clamp-2">
                {lead.title}
              </p>
            )}
            <div className="flex items-center gap-x-2 gap-y-1 mt-2 flex-wrap">
              <span className="text-sm font-medium text-[var(--color-primary)]">{lead.company}</span>
              {lead.company_country && (
                <span className="inline-flex items-center gap-1 text-xs text-[var(--color-on-surface-variant)]">
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
      <div className="px-6 py-4 flex-1 space-y-4">
        {/* Inspect links */}
        {(lead.company_website || lead.linkedin || lead.email) && (
          <div className="flex flex-wrap gap-2">
            {lead.company_website && (
              <LinkChip href={lead.company_website} label={domain ?? "Website"}>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                  <circle cx="12" cy="12" r="9" />
                  <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
                </svg>
              </LinkChip>
            )}
            {lead.linkedin && (
              <LinkChip href={lead.linkedin} label="LinkedIn">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
                </svg>
              </LinkChip>
            )}
            {lead.email && (
              <LinkChip href={`mailto:${lead.email}`} label="Email">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-10 6L2 7" />
                </svg>
              </LinkChip>
            )}
          </div>
        )}

        {lead.company_description && (
          <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed line-clamp-6">
            {lead.company_description}
          </p>
        )}

        {lead.whyFit && (
          <div className="rounded-xl bg-[var(--color-secondary-fixed)]/30 px-4 py-3">
            <span className="text-xs font-semibold text-[var(--color-secondary)]">Why it fits</span>
            <p className="text-sm text-[var(--color-on-surface)] mt-0.5 leading-relaxed">{lead.whyFit}</p>
          </div>
        )}
      </div>

      {/* Fit footer */}
      <div className="px-6 pb-5 pt-4 border-t border-[var(--color-outline-variant)]/15">
        <FitScale value={fit} onPick={onVerdict} />
        <textarea
          value={entry.note ?? ""}
          onChange={(e) => onNote(e.target.value)}
          rows={2}
          placeholder="Optional note: why, or anyone like them?"
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
  const reduce = useReducedMotion();

  if (leads.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[var(--color-outline-variant)]/40 bg-[var(--color-surface-low)]/40 px-6 py-12 text-center text-[var(--color-on-surface-variant)]">
        Sample dream-fit leads are being sourced. They&apos;ll appear here shortly.
      </div>
    );
  }

  const decided = leads.filter((l) => getVerdict(l.id).fit !== null).length;
  const clamped = Math.min(index, leads.length - 1);
  const current = leads[clamped];
  // Ratings live in localStorage until Submit is pressed. Say so, loudly, the moment
  // they rate anything -- otherwise they rate all five, see "Saved", close the tab,
  // and we never receive a thing.
  const allDone = decided === leads.length;

  const cardProps = (lead: LeadCardData) => ({
    lead,
    entry: getVerdict(lead.id),
    onVerdict: (v: Fit | null) => setVerdict(lead.id, { ...getVerdict(lead.id), fit: v }),
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
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
                initial={reduce ? { opacity: 0 } : { opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, x: -24 }}
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

      {decided > 0 && (
        <div
          className={`mt-6 flex items-start gap-3 rounded-xl border px-4 py-3 ${
            allDone
              ? "border-[var(--color-secondary)]/50 bg-[var(--color-secondary)]/10"
              : "border-amber-400/50 bg-amber-50"
          }`}
        >
          <svg
            className={`w-5 h-5 shrink-0 mt-0.5 ${allDone ? "text-[var(--color-secondary)]" : "text-amber-600"}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d={
                allDone
                  ? "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  : "M12 9v2m0 4h.01M5 19h14a2 2 0 001.84-2.75L13.74 4a2 2 0 00-3.48 0L3.16 16.25A2 2 0 005 19z"
              }
            />
          </svg>
          <p className="text-sm text-[var(--color-on-surface)]">
            {allDone ? (
              <>
                <span className="font-bold">All {leads.length} rated.</span> Your ratings are saved in{" "}
                <span className="font-semibold">this browser only</span> — they don&apos;t reach us until you press{" "}
                <span className="font-bold">Submit onboarding</span> at the bottom of the page.
              </>
            ) : (
              <>
                <span className="font-bold">
                  {decided} of {leads.length} rated.
                </span>{" "}
                Ratings are saved in <span className="font-semibold">this browser only</span> — press{" "}
                <span className="font-bold">Submit onboarding</span> at the bottom when you&apos;re done, or we
                won&apos;t see them.
              </>
            )}
          </p>
        </div>
      )}
    </div>
  );
}
