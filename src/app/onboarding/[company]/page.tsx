"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import EditableField from "@/components/onboarding/EditableField";
import EditableList from "@/components/onboarding/EditableList";
import DreamListCarousel from "@/components/onboarding/DreamListCarousel";
import FaqEditor from "@/components/onboarding/FaqEditor";
import { useLocalStorageDraft } from "@/hooks/useLocalStorageDraft";
import type { FaqItem, Icp, OnboardingData } from "@/components/onboarding/types";

// Dedicated onboarding Formspree form (own 50/mo cap, separate from Contact-Us).
// TODO: replace REPLACE_ME with the form id once the form is created.
const FORMSPREE_ENDPOINT = "https://formspree.io/f/REPLACE_ME";

function Section({
  index,
  title,
  subtitle,
  children,
}: {
  index: number;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
    >
      <div className="flex items-baseline gap-3 mb-1">
        <span className="text-sm font-mono text-[var(--color-secondary)]">{String(index).padStart(2, "0")}</span>
        <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-primary)]">{title}</h2>
      </div>
      {subtitle && <p className="text-[var(--color-on-surface-variant)] mb-6 ml-9">{subtitle}</p>}
      <div className="mt-6">{children}</div>
    </motion.section>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-[var(--color-outline-variant)]/20 bg-[var(--color-surface-lowest)] p-6 sm:p-8 shadow-ambient space-y-5">
      {children}
    </div>
  );
}

function OnboardingContent({ data }: { data: OnboardingData }) {
  const { overlay, saved, getValue, setField, clearField, getVerdict, setVerdict } = useLocalStorageDraft(
    data.client,
  );
  const [activeIcp, setActiveIcp] = useState(data.icps[0]?.id ?? "");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  // Commit helpers — empty or equals-default reverts to our default (deletes the override).
  const commit = (path: string, def: string) => (raw: string) => {
    const t = raw.trim();
    if (!t || t === def) clearField(path);
    else setField(path, t);
  };
  const commitList = (path: string) => (arr: string[]) => {
    if (arr.length === 0) clearField(path);
    else setField(path, arr);
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
    if (status === "submitting" || status === "success") return;
    setStatus("submitting");
    const payload = buildPayload();
    const approved = payload.dreamList.filter((d) => d.verdict === "approve").length;
    const rejected = payload.dreamList.filter((d) => d.verdict === "reject").length;

    const fd = new FormData();
    fd.append("_subject", `Onboarding submitted — ${data.hero.display.company} (${data.client})`);
    fd.append("_replyto", payload.hero.fields.primaryCompanyEmail || data.hero.display.email);
    fd.append("client", data.client);
    fd.append("client_name", data.hero.display.clientName);
    fd.append("client_email", data.hero.display.email);
    fd.append("company", data.hero.display.company);
    fd.append("campaign_name", payload.hero.fields.campaignName);
    fd.append("approved_count", String(approved));
    fd.append("rejected_count", String(rejected));
    fd.append("source", "onboarding");
    fd.append("payload_json", JSON.stringify(payload));

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

      {/* 00 — Hero + onboarding details */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="relative h-56 sm:h-72 rounded-3xl overflow-hidden shadow-ambient">
            {data.hero.image ? (
              <Image src={data.hero.image} alt="" fill className="object-cover" priority />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-container)] flex items-center justify-center">
                <span className="text-7xl font-bold text-white/20">
                  {data.hero.display.company.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-primary)]/80 via-[var(--color-primary)]/10 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6 sm:p-8 text-white">
              <p className="text-xs uppercase tracking-[0.18em] text-white/70 mb-1">StackLeaps Onboarding</p>
              <h1 className="text-3xl sm:text-4xl font-bold leading-tight">{data.hero.display.company}</h1>
              <p className="mt-1 text-white/85">
                {data.hero.display.clientName}
                {data.hero.display.title ? ` · ${data.hero.display.title}` : ""}
                {data.hero.display.email ? ` · ${data.hero.display.email}` : ""}
              </p>
            </div>
          </div>
        </motion.div>

        <p className="mt-8 text-[var(--color-on-surface-variant)] leading-relaxed">
          We pre-filled everything below with our best starting point.{" "}
          <span className="font-semibold text-[var(--color-on-surface)]">Edit any field to correct us</span> —
          your changes save automatically as you go. Clearing a field puts our default back.
        </p>
      </section>

      <Section index={1} title="Campaign details" subtitle="What we'll use to run your outreach.">
        <Card>
          <EditableField
            label="Full name to use in campaigns"
            value={getValue("hero.campaignName", data.hero.fields.campaignName)}
            onCommit={commit("hero.campaignName", data.hero.fields.campaignName)}
          />
          <EditableField
            label="Primary company email"
            value={getValue("hero.primaryCompanyEmail", data.hero.fields.primaryCompanyEmail)}
            onCommit={commit("hero.primaryCompanyEmail", data.hero.fields.primaryCompanyEmail)}
          />
          <EditableField
            label="Business name to use in outreach"
            value={getValue("hero.outreachBusinessName", data.hero.fields.outreachBusinessName)}
            onCommit={commit("hero.outreachBusinessName", data.hero.fields.outreachBusinessName)}
          />
          <EditableField
            label="Website the campaign domains should redirect to"
            value={getValue("hero.redirectWebsite", data.hero.fields.redirectWebsite)}
            onCommit={commit("hero.redirectWebsite", data.hero.fields.redirectWebsite)}
          />
        </Card>
      </Section>

      {/* 02 — ICP(s) */}
      <Section index={2} title="The ICP we built" subtitle="Who we'll target on your behalf. Tune anything that's off.">
        {data.icps.length > 1 && (
          <div className="flex flex-wrap gap-2 mb-5">
            {data.icps.map((i) => (
              <button
                key={i.id}
                type="button"
                onClick={() => setActiveIcp(i.id)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors cursor-pointer ${
                  i.id === icp?.id
                    ? "bg-[var(--color-primary)] text-white"
                    : "bg-[var(--color-surface-low)] text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-high)]"
                }`}
              >
                {i.label}
              </button>
            ))}
          </div>
        )}

        {icp && (
          <Card>
            {icp.estTam && (
              <div className="flex items-baseline gap-2 pb-2">
                <span className="text-3xl font-bold text-[var(--color-primary)]">
                  {icp.estTam.value.toLocaleString()}
                </span>
                <span className="text-sm text-[var(--color-on-surface-variant)]">{icp.estTam.label}</span>
              </div>
            )}
            <EditableField
              label="Target industry (for outreach)"
              multiline
              value={getValue(`icps.${icp.id}.industryDescription`, icp.fields.industryDescription)}
              onCommit={commit(`icps.${icp.id}.industryDescription`, icp.fields.industryDescription)}
            />
            <EditableList
              label="Job titles to reach"
              value={getValue(`icps.${icp.id}.jobTitles`, icp.fields.jobTitles)}
              onCommit={commitList(`icps.${icp.id}.jobTitles`)}
              itemPlaceholder="e.g. Director of Logistics"
              addLabel="Add title"
            />
            <EditableList
              label="Countries / regions to target"
              value={getValue(`icps.${icp.id}.countries`, icp.fields.countries)}
              onCommit={commitList(`icps.${icp.id}.countries`)}
              itemPlaceholder="e.g. United States"
              addLabel="Add region"
            />
            <EditableField
              label="Ideal company size (employees, revenue, volume)"
              value={getValue(`icps.${icp.id}.companySize`, icp.fields.companySize)}
              onCommit={commit(`icps.${icp.id}.companySize`, icp.fields.companySize)}
            />
            <EditableField
              label="Industries / companies we should NOT target"
              multiline
              value={getValue(`icps.${icp.id}.exclusions`, icp.fields.exclusions)}
              onCommit={commit(`icps.${icp.id}.exclusions`, icp.fields.exclusions)}
            />
          </Card>
        )}
      </Section>

      {/* 03 — Dream list */}
      <Section
        index={3}
        title="Sample dream-fit leads"
        subtitle="Real companies we can reach for you. Mark each one — it sharpens the targeting."
      >
        <DreamListCarousel leads={data.dreamList} getVerdict={getVerdict} setVerdict={setVerdict} />
      </Section>

      {/* 04 — Offer */}
      <Section index={4} title="Your offer" subtitle="What we'll promote. Correct anything we got wrong.">
        <Card>
          <EditableField
            label="Brief description of the service we can promote"
            multiline
            value={getValue("offer.serviceDescription", data.offer.serviceDescription)}
            onCommit={commit("offer.serviceDescription", data.offer.serviceDescription)}
          />
          <EditableField
            label="What makes your version unique to the ideal client"
            multiline
            value={getValue("offer.uniqueAngle", data.offer.uniqueAngle)}
            onCommit={commit("offer.uniqueAngle", data.offer.uniqueAngle)}
          />
          <EditableList
            label="Guarantees / risk reversals"
            value={getValue("offer.guarantees", data.offer.guarantees)}
            onCommit={commitList("offer.guarantees")}
            itemPlaceholder="e.g. No pay for unqualified calls"
            addLabel="Add guarantee"
          />
          <EditableList
            label="Problems your ideal client has that this offer solves"
            value={getValue("offer.problemsSolved", data.offer.problemsSolved)}
            onCommit={commitList("offer.problemsSolved")}
            itemPlaceholder="e.g. OTIF retail chargebacks"
            addLabel="Add problem"
          />
          <EditableField
            label="Quantifiable results we can reference (real numbers only)"
            multiline
            value={getValue("offer.quantifiableResults", data.offer.quantifiableResults)}
            onCommit={commit("offer.quantifiableResults", data.offer.quantifiableResults)}
          />
          <EditableList
            label="What a client experiences if they start today (3–4 steps)"
            value={getValue("offer.process", data.offer.process)}
            onCommit={commitList("offer.process")}
            itemPlaceholder="e.g. We build + verify the lead list"
            addLabel="Add step"
          />
        </Card>
      </Section>

      {/* 05 — FAQ handling */}
      <Section
        index={5}
        title="Reply & objection handling"
        subtitle="How should we answer when prospects ask? Add anything you want us to handle a certain way."
      >
        <FaqEditor
          items={getValue("faq.items", data.faq.items)}
          onItems={(items: FaqItem[]) => setField("faq.items", items)}
          global={getValue("faq.global", "")}
          onGlobal={(text: string) => (text ? setField("faq.global", text) : clearField("faq.global"))}
        />
      </Section>

      {/* Sticky submit bar */}
      <div className="fixed bottom-0 inset-x-0 z-40 border-t border-[var(--color-outline-variant)]/20 bg-[var(--color-surface-lowest)]/90 glass-effect">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
          <span className="text-sm text-[var(--color-on-surface-variant)] min-w-[6rem]">
            {status === "success"
              ? "Sent — thank you!"
              : saved === "saving"
                ? "Saving…"
                : saved === "saved"
                  ? "Saved ✓"
                  : "Edits save automatically"}
          </span>
          {status === "success" ? (
            <span className="inline-flex items-center gap-2 text-green-700 font-semibold">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Submitted
            </span>
          ) : (
            <div className="flex items-center gap-3">
              {status === "error" && (
                <span className="text-sm text-red-600">Something went wrong — try again.</span>
              )}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={status === "submitting"}
                className="bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-secondary-container)] text-white px-6 py-3 rounded-lg font-bold hover:opacity-90 transition-opacity disabled:opacity-60 cursor-pointer"
              >
                {status === "submitting" ? "Sending…" : "Submit onboarding"}
              </button>
            </div>
          )}
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
