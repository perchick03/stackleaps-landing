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
import EmailPreview from "@/components/onboarding/EmailPreview";
import { useLocalStorageDraft } from "@/hooks/useLocalStorageDraft";
import type {
  ExampleEmail,
  FaqItem,
  OnboardingData,
  OpenQuestion,
  ServiceLine,
} from "@/components/onboarding/types";

// Shared Formspree form (also used by ContactModal). Submissions are tagged
// source=onboarding. Swap to a dedicated form id later if onboarding volume grows.
const FORMSPREE_ENDPOINT = "https://formspree.io/f/xwvwyodd";

const TABS = [
  { id: "offer", label: "Offer" },
  { id: "icp", label: "Ideal Customer" },
  { id: "replies", label: "Replies & Objections" },
  { id: "expectations", label: "Expectations" },
  { id: "questions", label: "Open Questions" },
] as const;
type TabId = (typeof TABS)[number]["id"];

const CANCEL_Q =
  "What is the single thing that, if it happened, would make you want to immediately cancel the partnership?";

function Section({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
  return (
    <section className="mb-12">
      <h3 className="text-lg font-bold text-[var(--color-primary)] tracking-tight">{title}</h3>
      {sub && <p className="mt-1 mb-4 text-sm text-[var(--color-on-surface-variant)]">{sub}</p>}
      <div className={sub ? "" : "mt-4"}>{children}</div>
    </section>
  );
}

// The pre-filled content is a stand-in so the client can react instead of stare at a
// blank form. Say that out loud, or it reads as us telling them their own business.
function PlaceholderNote({ text }: { text: string }) {
  return (
    <div className="flex gap-3 rounded-2xl bg-[var(--color-secondary)]/8 ring-1 ring-[var(--color-secondary)]/20 px-5 py-4 mb-10">
      <svg
        className="w-5 h-5 shrink-0 mt-0.5 text-[var(--color-secondary)]"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth={2}
      >
        <circle cx="12" cy="12" r="9" />
        <path strokeLinecap="round" d="M12 8h.01M11 12h1v4h1" />
      </svg>
      <p className="text-sm text-[var(--color-on-surface)] leading-relaxed">{text}</p>
    </div>
  );
}

function Band({ tone = "base", children }: { tone?: "base" | "tint"; children: React.ReactNode }) {
  return (
    <section className={tone === "tint" ? "bg-[var(--color-surface-low)]/40" : ""}>
      <div className="max-w-5xl mx-auto px-5 sm:px-8 py-12 sm:py-14">{children}</div>
    </section>
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
  const { overlay, saved, getValue, setField, clearField, getVerdict, setVerdict, reset } =
    useLocalStorageDraft(data.client);
  const [tab, setTab] = useState<TabId>("offer");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const reduce = useReducedMotion();

  const d = data.hero.display;
  const logoSrc = data.hero.logo ?? faviconFor(d.website ?? data.hero.fields.redirectWebsite);

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
    if (window.confirm("Reset all edits back to our defaults? This cannot be undone.")) {
      reset();
      setStatus("idle");
    }
  };

  const offer = { ...data.offer, ...(overlay.offer ?? {}) };
  const targeting = { ...(data.targeting ?? { idealCustomers: [], doNotTarget: [] }), ...(overlay.targeting ?? {}) };
  const services: ServiceLine[] = getValue("offer.services", data.offer.services);
  const openQs: OpenQuestion[] = data.openQuestions ?? [];
  const answeredQs = openQs.filter((q) => getValue(`openQuestions.${q.id}`, "").trim()).length;

  function buildPayload() {
    const icps = data.icps.map((i) => ({
      id: i.id,
      label: i.label,
      fields: { ...i.fields, ...(overlay.icps?.[i.id] ?? {}) },
    }));
    const dreamList = data.dreamList.map((l) => {
      const v = getVerdict(l.id);
      return { id: l.id, company: l.company, full_name: l.full_name, fit: v.fit, note: v.note ?? "" };
    });
    const faqItems = (overlay.faq?.items ?? data.faq.items).filter((it) => it.q.trim() || it.a.trim());
    return {
      client: data.client,
      hero: { display: d, fields: data.hero.fields },
      icps,
      targeting,
      dreamList,
      offer,
      faq: { items: faqItems, global: overlay.faq?.global ?? "" },
      expectations: {
        greatMeeting: getValue("expectations.greatMeeting", data.expectations?.greatMeeting ?? ""),
      },
      cancelTrigger: getValue("cancelTrigger", ""),
      openQuestions: openQs.map((q) => ({
        id: q.id,
        q: q.q,
        priority: q.priority ?? "blocking",
        reply: getValue(`openQuestions.${q.id}`, ""),
      })),
      notes: getValue("notes", ""),
    };
  }

  async function handleSubmit() {
    if (status === "submitting") return;
    setStatus("submitting");
    const p = buildPayload();

    const fullForm = [
      `ONBOARDING SUBMISSION: ${d.company}`,
      `Client slug: ${data.client}`,
      `Contact: ${d.clientName}${d.title ? `, ${d.title}` : ""} - ${d.email || "(no email)"}`,
      ``,
      `OPEN QUESTIONS (${p.openQuestions.filter((q) => q.reply).length}/${p.openQuestions.length} answered)`,
      ...p.openQuestions.flatMap((q) => [
        `  [${q.priority.toUpperCase()}] ${q.q}`,
        `    -> ${q.reply || "(unanswered)"}`,
      ]),
      ``,
      `CANCEL TRIGGER`,
      `  Q: ${CANCEL_Q}`,
      `  -> ${p.cancelTrigger || "(unanswered)"}`,
      ``,
      `SERVICES`,
      ...p.offer.services.map((s) => `  ${s.name}: ${s.line}`),
      ``,
      `GUARANTEES / RISK REVERSAL`,
      ...p.offer.guarantees.map((g) => `  - ${g}`),
      ``,
      `PROBLEMS SOLVED`,
      ...p.offer.problemsSolved.map((x) => `  - ${x}`),
      ``,
      `NUMERICAL PROOF`,
      ...p.offer.proof.map((x) => `  - ${x}`),
      ``,
      `FRONT-END OFFER`,
      `  ${p.offer.frontEndOffer}`,
      `  Lead magnets:`,
      ...p.offer.leadMagnets.map((m) => `    - ${m}`),
      `  Example emails:`,
      ...p.offer.emails.flatMap((e) => [
        `    Subject: ${e.subject}`,
        ...e.body.split("\n").map((l) => `      ${l}`),
        ``,
      ]),
      ``,
      `TARGETING`,
      ...p.icps.flatMap((i) => [
        `  VERTICAL: ${i.label}`,
        `    Company size: ${i.fields.companySize}`,
        `    Titles: ${i.fields.jobTitles.join(", ")}`,
        `    Location: ${i.fields.countries.join(", ")}`,
        `    Signals: ${(i.fields.signals ?? []).join(", ") || "(none)"}`,
      ]),
      `  Ideal customers: ${p.targeting.idealCustomers.join(" | ") || "(none given)"}`,
      `  Do NOT target: ${p.targeting.doNotTarget.join(" | ") || "(none given)"}`,
      ``,
      `DREAM LEADS (1-5 fit)`,
      ...p.dreamList.map(
        (l) => `  [${l.fit ?? "-"}/5] ${l.full_name}, ${l.company}${l.note ? `   note: ${l.note}` : ""}`,
      ),
      ``,
      `REPLIES / OBJECTIONS`,
      ...p.faq.items.map((it) => {
        let s = `  Q: ${it.q}\n  A: ${it.a}`;
        if (it.ask) s += `\n  >> WE NEED: ${it.ask}`;
        if (it.reply) s += `\n  >> THEIR ANSWER: ${it.reply}`;
        return s;
      }),
      ...(p.faq.global ? [``, `Anything else: ${p.faq.global}`] : []),
      ``,
      `A GREAT MEETING LOOKS LIKE`,
      `  ${p.expectations.greatMeeting || "(not set)"}`,
      ``,
      `NOTES (from the call)`,
      ...(p.notes ? p.notes.split("\n").map((l) => `  ${l}`) : ["  (none)"]),
    ].join("\n");

    const fd = new FormData();
    fd.append("_subject", `Onboarding submitted: ${d.company} (${data.client})`);
    if (d.email) fd.append("_replyTo", d.email);
    fd.append("company", d.company);
    fd.append("client_slug", data.client);
    fd.append("name", d.clientName);
    fd.append("email", d.email);
    fd.append("source", "onboarding");
    fd.append("questions_answered", `${p.openQuestions.filter((q) => q.reply).length}/${p.openQuestions.length}`);
    fd.append("full_form", fullForm);
    fd.append("payload_json", JSON.stringify(p, null, 2));

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
            <Image
              src={data.hero.image}
              alt=""
              fill
              // Without sizes, `fill` defaults to 100vw and Next upscales to 3840.
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="object-cover"
              priority
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-container)]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-primary)]/85 via-[var(--color-primary)]/15 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6 sm:p-10 text-white">
            <p className="text-[13px] font-medium uppercase tracking-[0.2em] text-white/70 mb-3">
              StackLeaps onboarding
            </p>
            <div className="flex items-center gap-3">
              <BrandLogo src={logoSrc} name={d.company} />
              <h1 className="font-serif text-4xl sm:text-5xl font-bold leading-[1.05] tracking-tight">{d.company}</h1>
            </div>
            {(d.clientName || d.title) && (
              <p className="mt-2 text-white/85">{[d.clientName, d.title].filter(Boolean).join("  ·  ")}</p>
            )}
          </div>
        </motion.div>

        <p className="mt-6 max-w-2xl text-[var(--color-on-surface-variant)] leading-relaxed">
          Everything below is pre-filled with our best guess.{" "}
          <span className="font-semibold text-[var(--color-on-surface)]">Click any line to correct us.</span> Edits save
          as you go.
        </p>
      </section>

      {/* Agenda */}
      {data.agenda && data.agenda.length > 0 && (
        <Band>
          <h2 className="text-2xl font-bold text-[var(--color-primary)] tracking-tight mb-6">What we cover today</h2>
          <ol className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
            {data.agenda.map((item, i) => (
              <li key={item} className="flex items-center gap-3">
                <span className="grid place-items-center w-7 h-7 shrink-0 rounded-full bg-[var(--color-secondary)]/12 text-[var(--color-secondary)] text-xs font-bold">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-[var(--color-on-surface)]">{item}</span>
              </li>
            ))}
          </ol>
        </Band>
      )}

      {/* Ownership */}
      {data.ownership && (
        <Band tone="tint">
          <h2 className="text-2xl font-bold text-[var(--color-primary)] tracking-tight">
            An operator partner, not a vendor
          </h2>
          <p className="mt-1 mb-7 text-[var(--color-on-surface-variant)]">
            We own the outcome with you. Here are the ownership lines, explicit from day one.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              { who: "StackLeaps owns", items: data.ownership.us, accent: "var(--color-secondary)" },
              { who: `${d.company} owns`, items: data.ownership.them, accent: "var(--color-primary)" },
            ].map((col) => (
              <div
                key={col.who}
                className="rounded-2xl bg-[var(--color-surface-lowest)] ring-1 ring-[var(--color-outline-variant)]/15 p-5 sm:p-6"
              >
                <span className="block text-xs font-bold uppercase tracking-wider mb-4" style={{ color: col.accent }}>
                  {col.who}
                </span>
                <ul className="space-y-3">
                  {col.items.map((t) => (
                    <li key={t} className="flex gap-2.5 text-[var(--color-on-surface)] leading-relaxed">
                      <span
                        className="mt-2 w-1.5 h-1.5 shrink-0 rounded-full"
                        style={{ backgroundColor: col.accent }}
                      />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Band>
      )}

      {/* Tab bar */}
      <div className="sticky top-0 z-30 bg-[var(--color-surface)]/85 glass-effect border-y border-[var(--color-outline-variant)]/15">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <div className="flex gap-1 overflow-x-auto py-2.5 -mb-px">
            {TABS.map((t) => {
              const on = tab === t.id;
              const badge =
                t.id === "questions" && openQs.length ? `${answeredQs}/${openQs.length}` : null;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  className={`shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-colors cursor-pointer ${
                    on
                      ? "bg-[var(--color-primary)] text-white"
                      : "text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-low)] hover:text-[var(--color-primary)]"
                  }`}
                >
                  {t.label}
                  {badge && (
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                        on ? "bg-white/20 text-white" : "bg-red-500/15 text-red-600"
                      }`}
                    >
                      {badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-5 sm:px-8 py-12">
        {/* ---------- TAB: OFFER ---------- */}
        {tab === "offer" && (
          <div>
            {data.placeholderNote && <PlaceholderNote text={data.placeholderNote} />}
            <Section title="Services we lead with" sub="One sentence each - in your words, how you'd say it to a client.">
              <div className="space-y-3">
                {services.map((s, i) => (
                  <div
                    key={s.id}
                    className="rounded-2xl bg-[var(--color-surface-lowest)] ring-1 ring-[var(--color-outline-variant)]/15 p-4 sm:p-5"
                  >
                    <span className="block text-xs font-bold uppercase tracking-wider text-[var(--color-secondary)] mb-1">
                      {s.name}
                    </span>
                    <EditableField
                      value={s.line}
                      onCommit={(v) => {
                        const next = services.slice();
                        next[i] = { ...s, line: v };
                        setField("offer.services", next);
                      }}
                      ariaLabel={`${s.name} offer line`}
                      multiline
                      placeholder="The offer in one sentence…"
                      className="text-[var(--color-on-surface)] leading-relaxed"
                    />
                  </div>
                ))}
              </div>
            </Section>

            <Section
              title="Uniqueness, risk reversal & guarantees"
              sub="Any guarantee or risk-reversal you'd put your name to?"
            >
              <EditableList
                value={getValue("offer.guarantees", data.offer.guarantees)}
                onCommit={commitList("offer.guarantees")}
                variant="lines"
                marker="check"
                itemPlaceholder="Add a guarantee you'd stand behind"
                addLabel="Add guarantee"
              />
            </Section>

            <Section
              title="Problems your ideal client has that this solves"
              sub="What's the #1 problem a client has right before they hire you - what made them finally pick up the phone?"
            >
              <EditableList
                value={getValue("offer.problemsSolved", data.offer.problemsSolved)}
                onCommit={commitList("offer.problemsSolved")}
                variant="lines"
                marker="dot"
                itemPlaceholder="The problem, in your words"
                addLabel="Add problem"
              />
            </Section>

            <Section
              title="Proof we can point to"
              sub="Anything you'd stand behind in writing - reviews, client stories, credentials, results."
            >
              <EditableList
                value={getValue("offer.proof", data.offer.proof)}
                onCommit={commitList("offer.proof")}
                variant="lines"
                marker="check"
                itemPlaceholder="Proof we can use in an email"
                addLabel="Add proof"
              />
            </Section>

            <Section title="Front-end offer" sub="What a prospect gets before they ever talk to you. We decide this together today.">
              {data.offer.guidingQuestion && (
                <blockquote className="mb-5 rounded-2xl bg-[var(--color-primary)] text-white px-6 py-5">
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-white/60 mb-2">
                    The question we&apos;re here to answer
                  </span>
                  <p className="font-serif text-xl sm:text-2xl font-bold leading-snug">
                    &ldquo;{data.offer.guidingQuestion}&rdquo;
                  </p>
                </blockquote>
              )}
              <div className="rounded-2xl bg-[var(--color-surface-lowest)] ring-1 ring-[var(--color-outline-variant)]/15 p-5">
                <EditableField
                  value={getValue("offer.frontEndOffer", data.offer.frontEndOffer)}
                  onCommit={commit("offer.frontEndOffer", data.offer.frontEndOffer)}
                  ariaLabel="Front-end offer"
                  multiline
                  className="text-[var(--color-on-surface)] leading-relaxed"
                />
              </div>

              <div className="mt-5">
                <span className="block text-sm font-semibold text-[var(--color-primary)]">
                  Two ways we could build it
                </span>
                <p className="text-xs text-[var(--color-on-surface-variant)] mb-2">
                  Both are zero extra work for you. Which one fits?
                </p>
                <EditableList
                  value={getValue("offer.leadMagnets", data.offer.leadMagnets)}
                  onCommit={commitList("offer.leadMagnets")}
                  variant="lines"
                  marker="number"
                  itemPlaceholder="A one-page illustration, generated from their own filing"
                  addLabel="Add magnet"
                />
              </div>

              <div className="mt-6">
                <span className="block text-sm font-semibold text-[var(--color-primary)] mb-2">Example emails</span>
                <EmailPreview
                  emails={getValue("offer.emails", data.offer.emails)}
                  from={`${d.clientName} · ${data.hero.fields.outreachBusinessName}`}
                  onEmails={(next: ExampleEmail[]) => setField("offer.emails", next)}
                />
              </div>
            </Section>

            <Section title="Notes" sub="Scratchpad for the call. Nothing here gets cleaned up or overwritten.">
              <div className="rounded-2xl bg-amber-50/60 ring-1 ring-amber-300/40 p-5">
                <EditableField
                  value={getValue("notes", "")}
                  onCommit={(v) => (v.trim() ? setField("notes", v) : clearField("notes"))}
                  ariaLabel="Call notes"
                  multiline
                  placeholder="Type anything here during the call…"
                  className="text-[var(--color-on-surface)] leading-relaxed min-h-[6rem]"
                />
              </div>
            </Section>
          </div>
        )}

        {/* ---------- TAB: ICP ---------- */}
        {tab === "icp" && (
          <div>
            {data.placeholderNote && <PlaceholderNote text={data.placeholderNote} />}
            <Section title="Who we go after" sub="One card per vertical. Correct anything that's off.">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {data.icps.map((icp) => (
                  <div
                    key={icp.id}
                    className="rounded-2xl bg-[var(--color-surface-lowest)] ring-1 ring-[var(--color-outline-variant)]/15 p-5 sm:p-6"
                  >
                    <span className="block text-xs font-bold uppercase tracking-wider text-[var(--color-secondary)] mb-4">
                      {icp.label}
                    </span>
                    <div className="space-y-4">
                      <div>
                        <span className="block text-xs font-medium text-[var(--color-on-surface-variant)] mb-0.5">
                          Company size
                        </span>
                        <EditableField
                          value={getValue(`icps.${icp.id}.companySize`, icp.fields.companySize)}
                          onCommit={commit(`icps.${icp.id}.companySize`, icp.fields.companySize)}
                          ariaLabel="Company size"
                          className="text-[var(--color-on-surface)]"
                        />
                      </div>
                      <div>
                        <span className="block text-xs font-medium text-[var(--color-on-surface-variant)] mb-1.5">
                          Titles &amp; personas
                        </span>
                        <EditableList
                          value={getValue(`icps.${icp.id}.jobTitles`, icp.fields.jobTitles)}
                          onCommit={commitList(`icps.${icp.id}.jobTitles`)}
                          variant="chips"
                          itemPlaceholder="Owner"
                          addLabel="Add title"
                        />
                      </div>
                      <div>
                        <span className="block text-xs font-medium text-[var(--color-on-surface-variant)] mb-1.5">
                          Location
                        </span>
                        <EditableList
                          value={getValue(`icps.${icp.id}.countries`, icp.fields.countries)}
                          onCommit={commitList(`icps.${icp.id}.countries`)}
                          variant="chips"
                          itemPlaceholder="United States"
                          addLabel="Add location"
                        />
                      </div>
                      <div>
                        <span className="block text-xs font-medium text-[var(--color-on-surface-variant)] mb-0.5">
                          Signals
                        </span>
                        <p className="text-[11px] text-[var(--color-on-surface-variant)]/70 mb-1.5">
                          Buying triggers we can filter a list on. Fine to leave empty.
                        </p>
                        <EditableList
                          value={getValue(`icps.${icp.id}.signals`, icp.fields.signals ?? [])}
                          onCommit={commitList(`icps.${icp.id}.signals`)}
                          variant="chips"
                          itemPlaceholder="Recently founded"
                          addLabel="Add signal"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-12">
              <div className="rounded-2xl bg-[var(--color-surface-lowest)] ring-1 ring-[var(--color-outline-variant)]/15 p-5 sm:p-6">
                <span className="block text-sm font-semibold text-[var(--color-primary)]">Your ideal customers</span>
                <p className="text-xs text-[var(--color-on-surface-variant)] mb-3">
                  Current or dream-fit clients. We find lookalikes.
                </p>
                <EditableList
                  value={getValue("targeting.idealCustomers", targeting.idealCustomers)}
                  onCommit={commitList("targeting.idealCustomers")}
                  variant="lines"
                  marker="dot"
                  itemPlaceholder="acme-dental.com"
                  addLabel="Add customer"
                />
              </div>
              <div className="rounded-2xl bg-[var(--color-surface-lowest)] ring-1 ring-red-400/25 p-5 sm:p-6">
                <span className="block text-sm font-semibold text-red-600">Do not target</span>
                <p className="text-xs text-[var(--color-on-surface-variant)] mb-3">
                  Anti-ideal customers. Not competitors.
                </p>
                <EditableList
                  value={getValue("targeting.doNotTarget", targeting.doNotTarget)}
                  onCommit={commitList("targeting.doNotTarget")}
                  variant="lines"
                  marker="dot"
                  itemPlaceholder="DSO-owned practices"
                  addLabel="Add exclusion"
                />
              </div>
            </div>

            <Section title="Sample dream-fit leads" sub="Real companies we can reach. Score each 1-5.">
              <DreamListCarousel leads={data.dreamList} getVerdict={getVerdict} setVerdict={setVerdict} />
            </Section>
          </div>
        )}

        {/* ---------- TAB: REPLIES ---------- */}
        {tab === "replies" && (
          <div>
            <Section title="Replies & objection handling" sub="How we answer when prospects push back.">
              <FaqEditor
                items={getValue("faq.items", data.faq.items)}
                onItems={(items: FaqItem[]) => setField("faq.items", items)}
                global={getValue("faq.global", "")}
                onGlobal={(text: string) => (text ? setField("faq.global", text) : clearField("faq.global"))}
              />
            </Section>
          </div>
        )}

        {/* ---------- TAB: EXPECTATIONS ---------- */}
        {tab === "expectations" && data.expectations && (
          <div>
            <Section
              title="Our honest risks, and what prevents them"
              sub="We would rather name the failure modes than promise there are none."
            >
              <div className="space-y-3">
                {data.expectations.risks.map((r) => (
                  <div
                    key={r.id}
                    className="rounded-2xl bg-[var(--color-surface-lowest)] ring-1 ring-[var(--color-outline-variant)]/15 p-5"
                  >
                    <div className="flex items-start gap-3">
                      <span className="mt-1.5 w-2 h-2 shrink-0 rounded-full bg-amber-500" />
                      <div>
                        <p className="font-semibold text-[var(--color-on-surface)]">{r.risk}</p>
                        <p className="mt-1 text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
                          <span className="font-bold text-[var(--color-secondary)]">PREVENTION: </span>
                          {r.prevention}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            <Section title="What a great meeting looks like for you" sub="We agree the definition here.">
              <div className="rounded-2xl bg-[var(--color-secondary-fixed)]/40 p-5">
                <EditableField
                  value={getValue("expectations.greatMeeting", data.expectations.greatMeeting)}
                  onCommit={commit("expectations.greatMeeting", data.expectations.greatMeeting)}
                  ariaLabel="What a great meeting looks like"
                  multiline
                  placeholder="A qualified meeting for you means…"
                  className="text-[var(--color-on-surface)] leading-relaxed"
                />
              </div>
            </Section>

            {/* Cancel trigger - the early-warning system gets built around this answer. */}
            <Section title="">
              <div className="rounded-2xl bg-red-50/70 ring-1 ring-red-300/40 p-6">
                <span className="block text-[11px] font-bold uppercase tracking-wider text-red-600 mb-3">
                  Your answer · captured live
                </span>
                <p className="text-xl font-bold text-[var(--color-on-surface)] leading-snug mb-5">{CANCEL_Q}</p>
                <div className="rounded-xl bg-[var(--color-surface-lowest)] ring-1 ring-red-300/40 px-4 py-3">
                  <EditableField
                    value={getValue("cancelTrigger", "")}
                    onCommit={(v) => (v.trim() ? setField("cancelTrigger", v) : clearField("cancelTrigger"))}
                    ariaLabel="Cancel trigger"
                    multiline
                    placeholder="Your answer…"
                    className="text-[var(--color-on-surface)] leading-relaxed"
                  />
                </div>
                <p className="mt-5 pt-4 border-t border-red-300/30 text-sm italic text-red-700/80 leading-relaxed">
                  We watch for this one specifically, and tell you the moment it starts to look likely.
                </p>
              </div>
            </Section>

            <Section title="How this rolls out" sub="Month one is setup, not results. Here's the honest shape of it.">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {data.expectations.timeline.map((ph) => (
                  <div
                    key={ph.id}
                    className="flex flex-col rounded-2xl bg-[var(--color-surface-lowest)] ring-1 ring-[var(--color-outline-variant)]/15 p-5"
                  >
                    <span className="block text-[11px] font-bold uppercase tracking-wider text-[var(--color-on-surface-variant)]/70 mb-1.5">
                      {ph.phase}
                    </span>
                    <span className="block text-base font-bold text-[var(--color-primary)] leading-snug mb-4">
                      {ph.title}
                    </span>
                    <ul className="space-y-2.5 flex-1">
                      {ph.bullets.map((b) => (
                        <li key={b} className="flex gap-2.5 text-sm text-[var(--color-on-surface)] leading-relaxed">
                          <span className="mt-1.5 w-1.5 h-1.5 shrink-0 rounded-full bg-[var(--color-secondary)]" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                    {ph.dates && ph.dates.length > 0 && (
                      <div className="mt-5 pt-4 border-t border-[var(--color-outline-variant)]/20 space-y-1.5">
                        {ph.dates.map((dt) => (
                          <div
                            key={dt.label}
                            className="flex items-center justify-between gap-2 px-3 py-1.5 rounded-lg bg-[var(--color-surface-low)]"
                          >
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-on-surface-variant)]">
                              {dt.label}
                            </span>
                            <span className="font-mono text-sm font-semibold text-[var(--color-primary)]">
                              {dt.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Section>
          </div>
        )}

        {/* ---------- TAB: OPEN QUESTIONS ---------- */}
        {tab === "questions" && (
          <div>
            <Section
              title="What we need from you"
              sub={
                openQs.length
                  ? `${answeredQs} of ${openQs.length} answered. Red = we can't launch without it.`
                  : undefined
              }
            >
              {openQs.length === 0 && (
                <div className="rounded-2xl border border-dashed border-[var(--color-outline-variant)]/40 bg-[var(--color-surface-low)]/40 px-6 py-12 text-center text-[var(--color-on-surface-variant)]">
                  No questions yet. Add them to{" "}
                  <code className="font-mono text-sm text-[var(--color-primary)]">openQuestions</code> in{" "}
                  <code className="font-mono text-sm text-[var(--color-primary)]">{data.client}.json</code>.
                </div>
              )}
              <div className="space-y-3">
                {openQs.map((q) => {
                  const blocking = q.priority !== "important";
                  return (
                    <div
                      key={q.id}
                      className={`rounded-2xl bg-[var(--color-surface-lowest)] p-5 ring-1 ${
                        blocking ? "ring-red-500/25" : "ring-[var(--color-outline-variant)]/20"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className={`mt-1.5 w-2 h-2 shrink-0 rounded-full ${
                            blocking ? "bg-red-500" : "bg-amber-500"
                          }`}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-[var(--color-on-surface)] leading-snug">{q.q}</p>
                          {q.why && (
                            <p className="mt-0.5 text-sm text-[var(--color-on-surface-variant)]">{q.why}</p>
                          )}
                          <div className="mt-3 rounded-xl border border-[var(--color-outline-variant)]/25 bg-[var(--color-surface-low)]/50 px-4 py-2.5">
                            <EditableField
                              value={getValue(`openQuestions.${q.id}`, "")}
                              onCommit={(v) =>
                                v.trim()
                                  ? setField(`openQuestions.${q.id}`, v.trim())
                                  : clearField(`openQuestions.${q.id}`)
                              }
                              ariaLabel={q.q}
                              multiline
                              placeholder="Your answer…"
                              className="text-[var(--color-on-surface)] leading-relaxed"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Section>
          </div>
        )}
      </div>

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
              className="text-sm text-[var(--color-on-surface-variant)]/70 hover:text-red-600 underline-offset-2 hover:underline transition-colors cursor-pointer"
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
              className="bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-secondary-container)] text-white px-6 py-3 rounded-lg font-bold hover:opacity-90 transition-opacity disabled:opacity-60 cursor-pointer"
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
        // v2 offer shape. Pre-tabs files (tiernan, aries) fail here rather than
        // white-screening on offer.services.map - migrate them if they're needed again.
        if (!json.offer) miss.push("offer");
        else if (!Array.isArray(json.offer.services)) miss.push("offer.services (old schema - needs migration)");
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
              <li key={f} className="text-red-700">
                - {f}
              </li>
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
