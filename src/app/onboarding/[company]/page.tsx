"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import Header from "@/components/Header";
import EditableField from "@/components/onboarding/EditableField";
import EditableList from "@/components/onboarding/EditableList";
import DreamListCarousel from "@/components/onboarding/DreamListCarousel";
import FaqEditor from "@/components/onboarding/FaqEditor";
import FrontEndEditor from "@/components/onboarding/FrontEndEditor";
import { useLocalStorageDraft } from "@/hooks/useLocalStorageDraft";
import type { FaqItem, Icp, OnboardingData } from "@/components/onboarding/types";

// Shared Formspree form (also used by ContactModal). Submissions are tagged
// source=onboarding. Swap to a dedicated form id later if onboarding volume grows.
const FORMSPREE_ENDPOINT = "https://formspree.io/f/xwvwyodd";

const valueText = "text-lg font-medium text-[var(--color-on-surface)]";
const proseText = "text-base sm:text-lg text-[var(--color-on-surface)] leading-relaxed";

// Content is always visible (no scroll-reveal gating; a blank onboarding
// section is far worse than no entrance animation). Motion lives on the
// hero and on interactions instead.
function Band({
  tone = "base",
  width = "prose",
  children,
}: {
  tone?: "base" | "tint";
  width?: "prose" | "wide";
  children: React.ReactNode;
}) {
  return (
    <section className={tone === "tint" ? "bg-[var(--color-surface-low)]/40" : ""}>
      <div className={`${width === "wide" ? "max-w-5xl" : "max-w-3xl"} mx-auto px-5 sm:px-8 py-16 sm:py-20`}>
        {children}
      </div>
    </section>
  );
}

function SectionHead({ title, sub }: { title: string; sub?: string }) {
  return (
    <header className="mb-8">
      <h2 className="text-2xl sm:text-[2rem] font-bold text-[var(--color-primary)] tracking-tight">{title}</h2>
      {sub && <p className="mt-2 text-[var(--color-on-surface-variant)] leading-relaxed">{sub}</p>}
    </header>
  );
}

function InfoHint({ text }: { text: string }) {
  return (
    <span className="relative inline-flex group/hint align-middle">
      <button
        type="button"
        onClick={(e) => e.preventDefault()}
        aria-label="More info"
        className="w-4 h-4 grid place-items-center rounded-full bg-[var(--color-on-surface-variant)]/15 text-[var(--color-on-surface-variant)] text-[10px] font-bold leading-none hover:bg-[var(--color-primary)] hover:text-white transition-colors"
      >
        ?
      </button>
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 z-50 rounded-lg bg-[var(--color-primary)] text-white text-xs leading-relaxed p-3 shadow-ambient whitespace-pre-line opacity-0 translate-y-1 group-hover/hint:opacity-100 group-hover/hint:translate-y-0 group-focus-within/hint:opacity-100 group-focus-within/hint:translate-y-0 transition-all duration-150"
      >
        {text}
      </span>
    </span>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="flex items-center gap-1.5 text-sm font-medium text-[var(--color-on-surface-variant)] mb-1">
        {label}
        {hint && <InfoHint text={hint} />}
      </span>
      {children}
    </label>
  );
}

const COMM_OPTIONS = ["WhatsApp", "Email", "Slack"];

function CommMethodSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label="Preferred contact method"
      className={`${valueText} w-full bg-[var(--color-surface-low)] rounded-lg px-3 py-2 border border-[var(--color-outline-variant)]/25 focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]/30 focus:border-[var(--color-secondary)] transition-colors cursor-pointer`}
    >
      <option value="">Choose a channel…</option>
      {COMM_OPTIONS.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}

function hostOf(url?: string): string {
  if (!url) return "";
  try {
    return new URL(url.startsWith("http") ? url : `https://${url}`).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

function faviconFor(url?: string): string | undefined {
  const host = hostOf(url);
  return host ? `https://www.google.com/s2/favicons?domain=${host}&sz=128` : undefined;
}

function BrandLogo({ src, name }: { src?: string; name: string }) {
  const [err, setErr] = useState(false);
  return (
    <span className="w-11 h-11 rounded-xl bg-white grid place-items-center overflow-hidden shadow-sm shrink-0">
      {src && !err ? (
        <Image src={src} alt="" width={28} height={28} unoptimized className="object-contain" onError={() => setErr(true)} />
      ) : (
        <span className="text-lg font-bold text-[var(--color-primary)]">{name.charAt(0).toUpperCase()}</span>
      )}
    </span>
  );
}

function OnboardingContent({ data }: { data: OnboardingData }) {
  const {
    overlay,
    saved,
    getValue,
    setField: rawSetField,
    clearField: rawClearField,
    getVerdict,
    setVerdict: rawSetVerdict,
    reset,
  } = useLocalStorageDraft(data.client);
  const [activeIcp, setActiveIcp] = useState(data.icps[0]?.id ?? "");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  // Any edit after a successful send clears the "sent" state so the client can resubmit.
  const touch = () => setStatus((s) => (s === "success" || s === "error" ? "idle" : s));
  const setField = (path: string, value: unknown) => {
    touch();
    rawSetField(path, value);
  };
  const clearField = (path: string) => {
    touch();
    rawClearField(path);
  };
  const setVerdict = (id: string, entry: Parameters<typeof rawSetVerdict>[1]) => {
    touch();
    rawSetVerdict(id, entry);
  };
  const reduce = useReducedMotion();
  const logoSrc = data.hero.logo ?? faviconFor(data.hero.display.website ?? data.hero.fields.redirectWebsite);
  const d = data.hero.display;
  const baseDomain = hostOf(data.hero.fields.redirectWebsite || data.hero.display.website);
  const altDomain = baseDomain ? `try${baseDomain}` : "tryyourbrand.com";
  const sigHint = `The name your outreach emails are signed with at the bottom of each message.\n\nExample:\n${data.hero.fields.campaignName || "Jane Doe, Founder"}\n${data.hero.fields.outreachBusinessName || "Your Business"}`;
  const emailHint = `We register lookalike sending domains (e.g. ${altDomain}) and send from inboxes like name@${altDomain}, so your real domain stays clean and protected from deliverability risk.`;
  const siteHint = `We point the campaign domain (e.g. ${altDomain}) to redirect here, so links in your emails reach your real site while the sending domain stays separate.`;
  const tamHint =
    "An estimate of the total people we could realistically contact for this ICP, based on the baseline data we have. It depends heavily on the country/region, company or employee size, and job titles above, so it shifts as we tune the ICP.";

  // Empty or equals-default reverts to our default (deletes the override).
  const commit = (path: string, def: string) => (raw: string) => {
    const t = raw.trim();
    if (!t || t === def) clearField(path);
    else setField(path, t);
  };
  const commitList = (path: string) => (arr: string[]) => {
    if (arr.length === 0) clearField(path);
    else setField(path, arr);
  };

  const handleReset = () => {
    if (window.confirm("Reset all your edits back to our defaults? This cannot be undone.")) {
      reset();
      setStatus("idle");
    }
  };

  const icp: Icp | undefined = data.icps.find((i) => i.id === activeIcp) ?? data.icps[0];

  function buildPayload() {
    const heroFields = { ...data.hero.fields, ...(overlay.hero ?? {}) };
    const icps = data.icps.map((i) => ({
      id: i.id,
      label: i.label,
      fields: { ...i.fields, ...(overlay.icps?.[i.id] ?? {}) },
      estTam: i.estTam,
    }));
    const offer = { ...data.offer, ...(overlay.offer ?? {}) };
    const dreamList = data.dreamList.map((l) => {
      const v = getVerdict(l.id);
      return { id: l.id, company: l.company, full_name: l.full_name, verdict: v.verdict, note: v.note ?? "" };
    });
    const faqItems = (overlay.faq?.items ?? data.faq.items).filter((it) => it.q.trim() || it.a.trim());
    const faqGlobal = overlay.faq?.global ?? "";
    return {
      client: data.client,
      hero: { display: data.hero.display, fields: heroFields },
      icps,
      dreamList,
      offer,
      faq: { items: faqItems, global: faqGlobal },
    };
  }

  async function handleSubmit() {
    if (status === "submitting") return;
    setStatus("submitting");
    const payload = buildPayload();
    const approved = payload.dreamList.filter((d) => d.verdict === "approve").length;
    const rejected = payload.dreamList.filter((d) => d.verdict === "reject").length;

    const h = payload.hero;
    const fullForm = [
      `ONBOARDING SUBMISSION: ${h.display.company}`,
      `Client slug: ${data.client}`,
      ``,
      `CONTACT (identity)`,
      `  ${h.display.clientName}${h.display.title ? `, ${h.display.title}` : ""}`,
      `  ${h.display.email || "(no email)"}`,
      ``,
      `CAMPAIGN DETAILS`,
      `  Email signature name: ${h.fields.campaignName}`,
      `  Primary company email: ${h.fields.primaryCompanyEmail || "(none)"}`,
      `  Business name in outreach: ${h.fields.outreachBusinessName}`,
      `  Redirect website: ${h.fields.redirectWebsite}`,
      `  Contact person: ${h.fields.contactName || "(none)"}`,
      `    phone: ${h.fields.contactPhone || "(none)"}`,
      `    email: ${h.fields.contactEmail || "(none)"}`,
      `    preferred channel: ${h.fields.contactCommMethod || "(not chosen)"}`,
      ``,
      ...payload.icps.flatMap((icp) => [
        `ICP: ${icp.label}   (est. reach: ${icp.estTam?.value ?? "n/a"})`,
        `  Target industry: ${icp.fields.industryDescription}`,
        `  Job titles: ${icp.fields.jobTitles.join(", ")}`,
        `  Countries / regions: ${icp.fields.countries.join(", ")}`,
        `  Company size: ${icp.fields.companySize}`,
        `  Ideal customer websites: ${icp.fields.idealClientWebsites || "(none given)"}`,
        `  Do NOT target: ${icp.fields.exclusions}`,
        ``,
      ]),
      `DREAM LEADS for ${payload.icps.map((i) => i.label).join(" / ")}: ${approved} approved, ${rejected} rejected (of ${payload.dreamList.length})`,
      ...payload.dreamList.map((l) => {
        const mark = l.verdict === "approve" ? "[APPROVED]" : l.verdict === "reject" ? "[REJECTED]" : "[no verdict]";
        return `  ${mark} ${l.full_name}, ${l.company}${l.note ? `   note: ${l.note}` : ""}`;
      }),
      ``,
      `OFFER`,
      `  Service: ${payload.offer.serviceDescription}`,
      `  Edge: ${payload.offer.uniqueAngle}`,
      `  Guarantees: ${payload.offer.guarantees.join(" | ")}`,
      `  Problems solved: ${payload.offer.problemsSolved.join(" | ")}`,
      `  Proof: ${payload.offer.quantifiableResults}`,
      `  Process: ${payload.offer.process.join(" > ")}`,
      ...(payload.offer.frontEndOffer ? [`  Front-end offer: ${payload.offer.frontEndOffer}`] : []),
      ...(payload.offer.exampleEmail
        ? [`  Example first-touch email:`, ...payload.offer.exampleEmail.split("\n").map((l) => `    ${l}`)]
        : []),
      ...(payload.offer.frontEndItems && payload.offer.frontEndItems.length
        ? [
            `  Sample itineraries:`,
            ...payload.offer.frontEndItems.map(
              (it) => `    - ${it.name}${it.url ? ` (${it.url})` : ""}${it.note ? `: ${it.note}` : ""}`,
            ),
          ]
        : []),
      ``,
      `REPLY / OBJECTION HANDLING`,
      ...payload.faq.items.map((it) => {
        let s = `  Q: ${it.q}\n  A: ${it.a}`;
        if (it.ask) s += `\n  >> WE NEED FROM YOU: ${it.ask}`;
        if (it.reply) s += `\n  >> CLIENT ANSWER: ${it.reply}`;
        return s;
      }),
      ...(payload.faq.global ? [``, `Anything else: ${payload.faq.global}`] : []),
    ].join("\n");

    const fd = new FormData();
    fd.append("_subject", `Onboarding submitted: ${data.hero.display.company} (${data.client})`);
    fd.append("company", data.hero.display.company);
    fd.append("approved_count", String(approved));
    fd.append("rejected_count", String(rejected));
    fd.append("source", "onboarding");
    fd.append("full_form", fullForm);
    fd.append("payload_json", JSON.stringify(payload, null, 2));

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        body: fd,
        headers: { Accept: "application/json" },
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="min-h-[100dvh] bg-[var(--color-surface)] pb-28">
      <Header />

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-5 sm:px-8 pt-10">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative h-60 sm:h-80 rounded-[1.75rem] overflow-hidden shadow-ambient"
        >
          {data.hero.image ? (
            <Image src={data.hero.image} alt="" fill className="object-cover" priority />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-container)] flex items-center justify-center">
              <span className="font-serif text-[8rem] leading-none text-white/15">
                {data.hero.display.company.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-primary)]/85 via-[var(--color-primary)]/15 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6 sm:p-10 text-white">
            <p className="text-[13px] font-medium uppercase tracking-[0.2em] text-white/70 mb-3">
              StackLeaps onboarding
            </p>
            <div className="flex items-center gap-3">
              <BrandLogo src={logoSrc} name={d.company} />
              <h1 className="font-serif text-4xl sm:text-5xl font-bold leading-[1.05] tracking-tight">
                {d.company}
              </h1>
            </div>
            {(d.clientName || d.title) && (
              <p className="mt-2 text-white/85">{[d.clientName, d.title].filter(Boolean).join("  ·  ")}</p>
            )}
          </div>
        </motion.div>

        {/* Contact details strip */}
        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-[var(--color-on-surface-variant)]">
          {d.website && (
            <a
              href={d.website.startsWith("http") ? d.website : `https://${d.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-[var(--color-primary)] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                <circle cx="12" cy="12" r="9" />
                <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
              </svg>
              {d.website.replace(/^https?:\/\/(www\.)?/, "")}
            </a>
          )}
          {d.email && (
            <a href={`mailto:${d.email}`} className="inline-flex items-center gap-1.5 hover:text-[var(--color-primary)] transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-10 6L2 7" />
              </svg>
              {d.email}
            </a>
          )}
          {d.phone && (
            <span className="inline-flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.09 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              {d.phone}
            </span>
          )}
        </div>

        <p className="mt-7 max-w-2xl text-lg text-[var(--color-on-surface-variant)] leading-relaxed">
          We pre-filled everything below with our best starting point.{" "}
          <span className="font-semibold text-[var(--color-on-surface)]">Click any value to correct us</span>. Your
          edits save as you go, and clearing one puts our default back.
        </p>
      </section>

      {/* Campaign details: fact sheet */}
      <Band tone="base">
        <SectionHead title="Campaign Details" sub="What we'll use to run your outreach." />
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-7">
          <Field label="Email signature name" hint={sigHint}>
            <EditableField
              value={getValue("hero.campaignName", data.hero.fields.campaignName)}
              onCommit={commit("hero.campaignName", data.hero.fields.campaignName)}
              ariaLabel="Email signature name"
              placeholder="Your name as it signs off emails"
              className={valueText}
            />
          </Field>
          <Field label="Primary company email" hint={emailHint}>
            <EditableField
              value={getValue("hero.primaryCompanyEmail", data.hero.fields.primaryCompanyEmail)}
              onCommit={commit("hero.primaryCompanyEmail", data.hero.fields.primaryCompanyEmail)}
              ariaLabel="Primary company email"
              placeholder="you@company.com"
              className={valueText}
            />
          </Field>
          <Field label="Business name to use in outreach">
            <EditableField
              value={getValue("hero.outreachBusinessName", data.hero.fields.outreachBusinessName)}
              onCommit={commit("hero.outreachBusinessName", data.hero.fields.outreachBusinessName)}
              ariaLabel="Business name to use in outreach"
              placeholder="Business name"
              className={valueText}
            />
          </Field>
          <Field label="Website the campaign domains redirect to" hint={siteHint}>
            <EditableField
              value={getValue("hero.redirectWebsite", data.hero.fields.redirectWebsite)}
              onCommit={commit("hero.redirectWebsite", data.hero.fields.redirectWebsite)}
              ariaLabel="Website the campaign domains redirect to"
              placeholder="https://…"
              className={valueText}
            />
          </Field>
        </dl>

        {/* Contact person */}
        <div className="mt-8 rounded-2xl bg-[var(--color-surface-lowest)] ring-1 ring-[var(--color-outline-variant)]/15 p-5 sm:p-6">
          <h3 className="text-base font-semibold text-[var(--color-primary)]">Contact Person</h3>
          <p className="text-sm text-[var(--color-on-surface-variant)] mb-4">
            Who we&apos;ll coordinate with during the campaign. Edit if it&apos;s someone else.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6">
            <Field label="Name">
              <EditableField
                value={getValue("hero.contactName", data.hero.fields.contactName ?? "")}
                onCommit={commit("hero.contactName", data.hero.fields.contactName ?? "")}
                ariaLabel="Contact name"
                placeholder="Full name"
                className={valueText}
              />
            </Field>
            <Field label="Phone">
              <EditableField
                value={getValue("hero.contactPhone", data.hero.fields.contactPhone ?? "")}
                onCommit={commit("hero.contactPhone", data.hero.fields.contactPhone ?? "")}
                ariaLabel="Contact phone"
                placeholder="Add a number"
                className={valueText}
              />
            </Field>
            <Field label="Email">
              <EditableField
                value={getValue("hero.contactEmail", data.hero.fields.contactEmail ?? "")}
                onCommit={commit("hero.contactEmail", data.hero.fields.contactEmail ?? "")}
                ariaLabel="Contact email"
                placeholder="you@company.com"
                className={valueText}
              />
            </Field>
            <Field label="Preferred contact method">
              <CommMethodSelect
                value={getValue("hero.contactCommMethod", data.hero.fields.contactCommMethod ?? "")}
                onChange={(v) =>
                  v ? setField("hero.contactCommMethod", v) : clearField("hero.contactCommMethod")
                }
              />
            </Field>
          </div>
        </div>
      </Band>

      {/* ICP dossier */}
      <Band tone="tint">
        <SectionHead title="The Ideal Customer Profile (ICP) We Built" sub="Who we'll target on your behalf. Tune anything that's off." />

        {data.icps.length > 1 && (
          <div className="flex flex-wrap gap-2 mb-7">
            {data.icps.map((i) => (
              <button
                key={i.id}
                type="button"
                onClick={() => setActiveIcp(i.id)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                  i.id === icp?.id
                    ? "bg-[var(--color-primary)] text-white"
                    : "bg-[var(--color-surface-lowest)] text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)]"
                }`}
              >
                {i.label}
              </button>
            ))}
          </div>
        )}

        {icp && (
          <div className="space-y-9">
            {icp.estTam && (
              <div>
                {icp.estTam.label && (
                  <h3 className="text-xl sm:text-2xl font-bold text-[var(--color-primary)] mb-2">
                    {icp.estTam.label}
                  </h3>
                )}
                <p className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                  <span className="font-serif text-2xl sm:text-3xl font-bold text-[var(--color-primary)] bg-[var(--color-secondary-container)]/40 rounded-md px-2.5 py-0.5 box-decoration-clone">
                    ≈ {typeof icp.estTam.value === "number" ? icp.estTam.value.toLocaleString() : icp.estTam.value}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-sm text-[var(--color-on-surface-variant)]">
                    Est. Total Addressable Market (TAM)
                    <InfoHint text={tamHint} />
                  </span>
                </p>
              </div>
            )}

            {/* Target industry: free text, no label */}
            <EditableField
              value={getValue(`icps.${icp.id}.industryDescription`, icp.fields.industryDescription)}
              onCommit={commit(`icps.${icp.id}.industryDescription`, icp.fields.industryDescription)}
              ariaLabel="Target industry"
              multiline
              className={proseText}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-7">
              <Field label="Job titles to reach">
                <EditableList
                  value={getValue(`icps.${icp.id}.jobTitles`, icp.fields.jobTitles)}
                  onCommit={commitList(`icps.${icp.id}.jobTitles`)}
                  variant="chips"
                  itemPlaceholder="Director of Logistics"
                  addLabel="Add title"
                />
              </Field>
              <Field label="Countries / regions to target">
                <EditableList
                  value={getValue(`icps.${icp.id}.countries`, icp.fields.countries)}
                  onCommit={commitList(`icps.${icp.id}.countries`)}
                  variant="chips"
                  itemPlaceholder="United States"
                  addLabel="Add region"
                />
              </Field>
            </div>

            <Field label="Ideal company size (employees, revenue, volume)">
              <EditableField
                value={getValue(`icps.${icp.id}.companySize`, icp.fields.companySize)}
                onCommit={commit(`icps.${icp.id}.companySize`, icp.fields.companySize)}
                ariaLabel="Ideal company size"
                multiline
                className={valueText}
              />
            </Field>
          </div>
        )}
      </Band>

      {/* Dream list + targeting boxes */}
      <Band tone="base" width="wide">
        <SectionHead
          title="Your Ideal Customers"
          sub="Add your own dream clients and the kinds of company to avoid, then mark the sample leads we found."
        />

        {icp && (
          <div
            className={`grid grid-cols-1 ${
              icp.fields.idealClientWebsites !== undefined ? "lg:grid-cols-2" : ""
            } gap-5 mb-12`}
          >
            {icp.fields.idealClientWebsites !== undefined && (
              <div className="rounded-2xl bg-[var(--color-surface-lowest)] ring-1 ring-[var(--color-outline-variant)]/15 p-5 sm:p-6">
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-primary)] mb-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <circle cx="12" cy="12" r="9" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="12" cy="12" r="0.5" fill="currentColor" />
                  </svg>
                  Ideal Customer Websites
                </span>
                <p className="text-xs text-[var(--color-on-surface-variant)] mb-2">
                  5-10 sites of your current or dream-fit clients, comma-separated. We find lookalikes.
                </p>
                <EditableField
                  value={getValue(`icps.${icp.id}.idealClientWebsites`, icp.fields.idealClientWebsites ?? "")}
                  onCommit={commit(`icps.${icp.id}.idealClientWebsites`, icp.fields.idealClientWebsites ?? "")}
                  ariaLabel="Ideal customer websites"
                  multiline
                  placeholder="acme-travel.com, example.com, ..."
                  className="text-[var(--color-on-surface)] leading-relaxed"
                />
              </div>
            )}

            <div className="rounded-2xl bg-[var(--color-surface-lowest)] ring-1 ring-[var(--color-outline-variant)]/15 p-5 sm:p-6">
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-red-600 mb-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <circle cx="12" cy="12" r="9" />
                  <path strokeLinecap="round" d="M5.6 5.6l12.8 12.8" />
                </svg>
                Do Not Target
              </span>
              <p className="text-xs text-[var(--color-on-surface-variant)] mb-2">
                Anti-ideal customers to steer clear of (e.g. large corporate agencies). Not competitors.
              </p>
              <EditableField
                value={getValue(`icps.${icp.id}.exclusions`, icp.fields.exclusions)}
                onCommit={commit(`icps.${icp.id}.exclusions`, icp.fields.exclusions)}
                ariaLabel="Do not target"
                multiline
                className="text-[var(--color-on-surface-variant)] leading-relaxed"
              />
            </div>
          </div>
        )}

        <h3 className="text-xl font-bold text-[var(--color-primary)] mb-1">Sample Dream-Fit Leads</h3>
        <p className="text-[var(--color-on-surface-variant)] mb-6">Real companies we can reach for you. Mark each one.</p>
        <DreamListCarousel leads={data.dreamList} getVerdict={getVerdict} setVerdict={setVerdict} />
      </Band>

      {/* Offer */}
      <Band tone="tint">
        <SectionHead title="Your Offer" sub="What we'll promote. Correct anything we got wrong." />
        <div className="space-y-9">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-7">
            <Field label="What we promote">
              <EditableField
                value={getValue("offer.serviceDescription", data.offer.serviceDescription)}
                onCommit={commit("offer.serviceDescription", data.offer.serviceDescription)}
                ariaLabel="What we promote"
                multiline
                className={proseText}
              />
            </Field>
            <Field label="Your edge for this client">
              <EditableField
                value={getValue("offer.uniqueAngle", data.offer.uniqueAngle)}
                onCommit={commit("offer.uniqueAngle", data.offer.uniqueAngle)}
                ariaLabel="Your edge"
                multiline
                className={proseText}
              />
            </Field>
          </div>

          <Field label="Guarantees / risk reversals">
            <EditableList
              value={getValue("offer.guarantees", data.offer.guarantees)}
              onCommit={commitList("offer.guarantees")}
              variant="lines"
              marker="check"
              itemPlaceholder="No pay for unqualified calls"
              addLabel="Add guarantee"
            />
          </Field>

          <Field label="Problems your ideal client has that this solves">
            <EditableList
              value={getValue("offer.problemsSolved", data.offer.problemsSolved)}
              onCommit={commitList("offer.problemsSolved")}
              variant="lines"
              marker="dot"
              itemPlaceholder="OTIF retail chargebacks"
              addLabel="Add problem"
            />
          </Field>

          <div className="rounded-2xl bg-[var(--color-secondary-fixed)]/40 p-5 sm:p-6">
            <span className="block text-sm font-semibold text-[var(--color-secondary)] mb-1.5">
              Proof we can reference (real numbers only)
            </span>
            <EditableField
              value={getValue("offer.quantifiableResults", data.offer.quantifiableResults)}
              onCommit={commit("offer.quantifiableResults", data.offer.quantifiableResults)}
              ariaLabel="Quantifiable results"
              multiline
              className="text-[var(--color-on-surface)] leading-relaxed"
            />
          </div>

          <Field label="What a client experiences if they start today">
            <EditableList
              value={getValue("offer.process", data.offer.process)}
              onCommit={commitList("offer.process")}
              variant="lines"
              marker="number"
              itemPlaceholder="We build and verify the lead list"
              addLabel="Add step"
            />
          </Field>

          {data.offer.frontEndOffer !== undefined && (
            <div className="rounded-2xl bg-[var(--color-surface-lowest)] ring-1 ring-[var(--color-outline-variant)]/15 p-5 sm:p-6">
              <span className="block text-sm font-semibold text-[var(--color-primary)] mb-1.5">
                Front-End Offer: The First-Touch Hook
              </span>
              <EditableField
                value={getValue("offer.frontEndOffer", data.offer.frontEndOffer ?? "")}
                onCommit={commit("offer.frontEndOffer", data.offer.frontEndOffer ?? "")}
                ariaLabel="Front-end offer"
                multiline
                className="text-[var(--color-on-surface)] leading-relaxed"
              />

              {data.offer.exampleEmail !== undefined && (
                <div className="mt-4 rounded-xl border border-[var(--color-outline-variant)]/25 bg-[var(--color-surface-low)]/50 overflow-hidden">
                  <div className="flex items-center gap-1.5 px-4 py-2 border-b border-[var(--color-outline-variant)]/20 text-xs font-semibold text-[var(--color-on-surface-variant)]">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <path d="m22 7-10 6L2 7" />
                    </svg>
                    Example First-Touch Email
                  </div>
                  <div className="px-4 py-3">
                    <EditableField
                      value={getValue("offer.exampleEmail", data.offer.exampleEmail ?? "")}
                      onCommit={commit("offer.exampleEmail", data.offer.exampleEmail ?? "")}
                      ariaLabel="Example first-touch email"
                      multiline
                      className="text-sm text-[var(--color-on-surface)] leading-relaxed whitespace-pre-line"
                    />
                  </div>
                </div>
              )}

              <div className="mt-4">
                <span className="block text-sm font-medium text-[var(--color-on-surface-variant)] mb-2">
                  Sample Itineraries
                </span>
                <FrontEndEditor
                  items={getValue("offer.frontEndItems", data.offer.frontEndItems ?? [])}
                  onItems={(items) =>
                    items.length ? setField("offer.frontEndItems", items) : clearField("offer.frontEndItems")
                  }
                />
              </div>
            </div>
          )}
        </div>
      </Band>

      {/* FAQ */}
      <Band tone="base">
        <SectionHead
          title="Reply & Objection Handling"
          sub="How should we answer when prospects ask? Add anything you want handled a certain way."
        />
        <FaqEditor
          items={getValue("faq.items", data.faq.items)}
          onItems={(items: FaqItem[]) => setField("faq.items", items)}
          global={getValue("faq.global", "")}
          onGlobal={(text: string) => (text ? setField("faq.global", text) : clearField("faq.global"))}
        />
      </Band>

      {/* Sticky submit bar */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-[var(--color-surface-lowest)]/80 glass-effect shadow-[0_-12px_30px_rgba(14,29,43,0.06)]">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2 text-sm text-[var(--color-on-surface-variant)]">
              <span
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  saved === "saving" ? "bg-[var(--color-secondary-container)]" : "bg-green-500"
                }`}
              />
              {saved === "saving" ? "Saving…" : saved === "saved" ? "Saved" : "Edits save automatically"}
            </span>
            <button
              type="button"
              onClick={handleReset}
              className="text-sm text-[var(--color-on-surface-variant)]/70 hover:text-red-600 underline-offset-2 hover:underline transition-colors"
            >
              Reset
            </button>
          </div>
          <div className="flex items-center gap-3">
            {status === "error" && <span className="text-sm text-red-600">Something went wrong. Try again.</span>}
            {status === "success" && (
              <span className="inline-flex items-center gap-1.5 text-green-700 font-semibold text-sm">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Sent
              </span>
            )}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={status === "submitting"}
              className="bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-secondary-container)] text-white px-6 py-3 rounded-lg font-bold hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {status === "submitting" ? "Sending…" : status === "success" ? "Submit again" : "Submit onboarding"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  const params = useParams();
  const company = params.company as string;
  const [data, setData] = useState<OnboardingData | null>(null);
  const [error, setError] = useState(false);
  const [missing, setMissing] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!company) return;
    fetch(`/data/onboarding/${company}.json`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((json: OnboardingData) => {
        const miss: string[] = [];
        if (!json.client) miss.push("client");
        if (!json.hero) miss.push("hero");
        if (!Array.isArray(json.icps) || json.icps.length === 0) miss.push("icps");
        if (!Array.isArray(json.dreamList)) miss.push("dreamList");
        if (!json.offer) miss.push("offer");
        if (!json.faq) miss.push("faq");
        if (miss.length) {
          setMissing(miss);
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
      <div className="min-h-[100dvh] bg-[var(--color-surface)] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[var(--color-primary)]/20 border-t-[var(--color-primary)] rounded-full animate-spin" />
      </div>
    );
  }

  if (missing.length) {
    return (
      <div className="min-h-[100dvh] bg-[var(--color-surface)] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Invalid onboarding data</h1>
          <p className="text-[var(--color-on-surface-variant)] mb-4">Missing required fields:</p>
          <ul className="text-left inline-block text-sm font-mono bg-red-50 border border-red-200 rounded-lg px-4 py-3">
            {missing.map((f) => (
              <li key={f} className="text-red-700">- {f}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-[100dvh] bg-[var(--color-surface)] flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[var(--color-on-surface)] mb-2">Page not found</h1>
          <p className="text-[var(--color-on-surface-variant)]">This onboarding link may be incorrect or expired.</p>
        </div>
      </div>
    );
  }

  return <OnboardingContent data={data} />;
}
