"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useSpring } from "framer-motion";
import ProposalHeader from "@/components/ProposalHeader";

const PROSPECT_SLUG = "dmc-discover-montenegro";
const WHATSAPP_NUMBER = "972549256286";

interface Lead {
  full_name: string;
  title: string;
  company: string;
  company_website: string;
  company_country: string;
  company_description: string;
  company_logo: string;
  email: string;
  linkedin: string;
  seniority_level: string;
}

interface ProspectData {
  prospect_company: string;
  matched_to: string;
  generated_at: string;
  leads: Lead[];
}

const SECTIONS = [
  { id: "intro", label: "Intro" },
  { id: "opportunity", label: "Opportunity" },
  { id: "what-we-do", label: "What we do" },
  { id: "scope", label: "Scope" },
  { id: "process", label: "Process" },
  { id: "pricing", label: "Pricing" },
  { id: "why", label: "Why us" },
  { id: "sample", label: "Sample list" },
  { id: "next", label: "Next step" },
] as const;

declare global {
  interface Window {
    Calendly?: {
      initInlineWidget: (opts: { url: string; parentElement: HTMLElement }) => void;
    };
  }
}

export default function ProposalPage() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.2 });

  const [data, setData] = useState<ProspectData | null>(null);
  const [currentSection, setCurrentSection] = useState<string>("Intro");

  useEffect(() => {
    fetch(`/data/${PROSPECT_SLUG}.json`)
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData(null));
  }, []);

  const sampleLeads = useMemo(() => (data?.leads ?? []).slice(0, 3), [data]);

  // Scroll-aware section indicator — pick the last section whose top crossed the trigger line
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const triggerY = 140;
      let active: string = SECTIONS[0].label;
      for (const { id, label } of SECTIONS) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= triggerY) active = label;
      }
      setCurrentSection(active);
    };
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Calendly — explicit init so the empty-iframe case can't happen
  const calendlyRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const initCalendly = () => {
      if (!calendlyRef.current || !window.Calendly) return;
      if (calendlyRef.current.dataset.initialized === "1") return;
      window.Calendly.initInlineWidget({
        url: "https://calendly.com/stackleaps/30min?hide_gdpr_banner=1",
        parentElement: calendlyRef.current,
      });
      calendlyRef.current.dataset.initialized = "1";
    };

    if (window.Calendly) {
      initCalendly();
      return;
    }
    const id = "calendly-widget-script";
    let s = document.getElementById(id) as HTMLScriptElement | null;
    if (!s) {
      s = document.createElement("script");
      s.id = id;
      s.src = "https://assets.calendly.com/assets/external/widget.js";
      s.async = true;
      document.body.appendChild(s);
    }
    s.addEventListener("load", initCalendly);
    return () => s?.removeEventListener("load", initCalendly);
  }, []);

  const handlePrint = () => window.print();

  return (
    <main className="proposal-root">
      <motion.div
        aria-hidden
        style={{ scaleX: progress, transformOrigin: "0% 50%" }}
        className="fixed top-0 left-0 right-0 h-[2px] bg-[var(--color-secondary-container)] z-[60] print:hidden"
      />

      <ProposalHeader onDownload={handlePrint} currentSection={currentSection} />

      {/* =================== COVER =================== */}
      <section id="intro" className="cover-page bg-[var(--color-surface)]">
        <Container>
          <div className="pt-8 md:pt-10 pb-5 flex items-center justify-between font-mono text-[11px] tracking-[0.22em] uppercase text-[var(--color-on-surface-variant)] border-b border-[var(--color-on-surface)]/10">
            <span className="font-semibold text-[var(--color-primary)]">
              Proposal · Confidential
            </span>
            <span>May 18, 2026</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-10 lg:gap-14 items-center pt-10 md:pt-12 pb-12 md:pb-16">
            <div className="space-y-7">
              <h1 className="cover-title text-[var(--color-primary)] leading-[1.02] tracking-[-0.025em] text-[clamp(2.5rem,5.2vw,4.5rem)]">
                <span className="block">StackLeaps</span>
                <span className="block">
                  <span className="text-[var(--color-secondary)] font-light">×</span>{" "}
                  Discover&nbsp;Montenegro
                </span>
              </h1>

              <p className="text-[17px] md:text-[19px] leading-[1.55] text-[var(--color-on-surface-variant)] max-w-xl">
                60 days. Done-for-you outreach and booked calls with the kind of
                operators who should be selling Montenegro to their clients.
              </p>

              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[var(--color-on-surface)]/12">
                <CoverMeta label="Presented to" value="Sanya Milo" sub="Discover Montenegro" />
                <CoverMeta label="Presented by" value="Peretz Levinov" sub="StackLeaps" />
                <CoverMeta label="Engagement" value="60-day pilot" />
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-3 bg-[var(--color-secondary-fixed)]/45 -z-10 rounded-sm" />
              <div className="relative w-full aspect-[5/6] overflow-hidden">
                <Image
                  src="/images/proposals/montenegro.jpg"
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 100vw, 600px"
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* =================== OPPORTUNITY =================== */}
      <Page id="opportunity" no="02" total="08" title="Where you stand" runner="§ I · Opportunity">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 max-w-5xl">
          <div>
            <BlockHeading icon={<CheckCircleIcon />} tone="primary">
              What you already have
            </BlockHeading>
            <ul className="space-y-3 text-[16px] leading-[1.6] mt-5">
              <SmallBullet>A strong network of local luxury providers</SmallBullet>
              <SmallBullet>A team that delivers them on the ground</SmallBullet>
              <SmallBullet>A working website open to partners</SmallBullet>
              <SmallBullet>High-quality custom itineraries for Montenegro</SmallBullet>
            </ul>
          </div>

          <div>
            <BlockHeading icon={<TargetIcon />} tone="secondary">
              The opportunity
            </BlockHeading>
            <div className="space-y-4 text-[16px] leading-[1.65] mt-5">
              <p>
                We connect you with tour operators and luxury travel advisors who want
                to expand into Montenegro - or open new markets through your
                itineraries.
              </p>
              <p className="italic text-[var(--color-primary)] text-[18px] leading-snug pt-2">
                This pilot is about making sure you get in touch with them personally,
                over a call.
              </p>
            </div>
          </div>
        </div>

        <ProofPanel />
      </Page>

      {/* =================== WHAT WE DO =================== */}
      <Page id="what-we-do" no="03" total="08" title="What we do" runner="§ II · Offer">
        <p className="text-[17px] leading-[1.7] mb-10 max-w-3xl">
          We do all the outreach for you - finding the right operators, writing the
          emails, handling the replies - and book the meetings on your calendar. Four
          stages:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <PhaseCard
            tone="cream"
            phase="Phase 01"
            weeks="Weeks 1–2"
            title="Setup & infrastructure"
            icon={<GearIcon />}
            summary="Get the engine ready to send."
            bullets={[
              "Purchase the domains and mailboxes you'll send from",
              "Stand up the deliverability stack",
              "Run a warmup so inboxes land in primary, not spam",
              "Hand you an infrastructure ready to send at volume",
            ]}
          />

          <PhaseCard
            tone="blue"
            phase="Phase 02"
            weeks="Weeks 1–2"
            title="Partner Match Report"
            icon={<TargetIcon />}
            summary="Qualify and narrow until the audience is unmistakably yours."
            bullets={[
              "Define your ideal buyer",
              "Categorize best-fit clients",
              "Hand you the top 50 best-suited operators",
              "You approve the shortlist before we launch the full campaign",
            ]}
          />

          <PhaseCard
            tone="blue"
            phase="Phase 03"
            weeks="Weeks 3–6"
            title="Finding the best angle"
            icon={<BeakerIcon />}
            summary="Send slowly, learn fast, then scale what works."
            bullets={[
              "Build 3–5 message angles for your offer",
              "Send them against the top operators we pick",
              "Measure reply quality, not just open rates",
              "Gradually increase volume on the angle that wins",
            ]}
          />

          <PhaseCard
            tone="cream"
            phase="Phase 04"
            weeks="Week 7 onward"
            title="Scale & qualifying calls"
            icon={<TrendingUpIcon />}
            summary="Volume up. Real conversations on your calendar."
            bullets={[
              "Roll the winning angle out to the full matched audience",
              "Replies handled instantly in your voice and tone",
              "Booking + reminder sequence so meetings actually happen",
              "Retarget leads every 3 months",
            ]}
          />
        </div>

        <Funnel />
      </Page>

      {/* =================== SCOPE =================== */}
      <Page id="scope" no="04" total="08" title="Inclusion / Exclusion" runner="§ III · Scope">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
          <ScopeColumn
            title="Included"
            tone="in"
            items={[
              "Partner Match Report - 50-operator sample, your approval before launch",
              "Personalised outreach to your ideal audience",
              "Email infrastructure - domains, inboxes, warmup, deliverability",
              "Replies in your voice and tone",
              "Instant replies - 394% higher conversion when answered in the first minute",
              "Booking + reminder sequences",
              "Destination exclusivity in Montenegro",
            ]}
          />
          <ScopeColumn
            title="Not included"
            tone="out"
            items={[
              "The sales call itself - you take it",
              "Post-call follow-up",
              "Website / brand / pricing redesign",
              "Partnership / equity / revenue-share - open to revisit later",
            ]}
          />
        </div>
      </Page>

      {/* =================== PROCESS =================== */}
      <Page id="process" no="05" total="08" title="Process & timeline" runner="§ IV · Process">
        <div className="border-t border-[var(--color-on-surface)]/15">
          <ProcessRow
            week="Week 1"
            headline="Kickoff. Voice + offer scoping."
            sub="Partner Match Report drafted. Sample asset drafted."
          />
          <ProcessRow
            week="Week 1–2"
            headline="Infrastructure warm. Match shape approved."
            sub="Domains warmed. Mailboxes set up. Your sign-off before launch."
          />
          <ProcessRow
            week="Week 3–6"
            headline="First batch sent. Testing what resonates."
            sub="Learning phase - see what works."
          />
          <ProcessRow
            week="Week 7–8"
            headline="Best angle scales. First meetings booked."
            sub="Real conversations land on your calendar."
          />
          <div className="grid grid-cols-[100px_1fr] md:grid-cols-[180px_1fr] gap-4 md:gap-8 py-7 bg-[var(--color-secondary-fixed)]/55 -mx-4 md:-mx-8 px-4 md:px-8 mt-1">
            <div className="font-mono text-[12px] tracking-[0.1em] font-semibold text-[var(--color-secondary)] uppercase">
              Day 60
            </div>
            <div className="cover-title text-2xl md:text-[28px] leading-[1.2] text-[var(--color-primary)]">
              Target: 3 booked meetings. Monthly cadence set from here.
            </div>
          </div>
        </div>
      </Page>

      {/* =================== PRICING =================== */}
      <Page id="pricing" no="06" total="08" title="Pricing" runner="§ V · Pricing">
        <div className="border-t border-[var(--color-on-surface)]/15">
          <PriceRow item="Monthly retainer" amount="$750" suffix="/ month" note="Covers infrastructure - domains, mailboxes, deliverability" />
          <PriceRow item="Per booked meeting" amount="$150" suffix="/ meeting" note="Paid only when the meeting happens" />
          <PriceRow item="Setup fee" amount="None" suffix="" note="No upfront commitment" />
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-5">
          <Callout label="Transparency · cost & margin" tone="blue">
            The $750/mo covers our infrastructure cost. We make our margin on the $150
            per booked meeting, which means we only earn when you do.
          </Callout>
          <Callout label="Quality guardrail" tone="cream">
            Billable meetings = operators inside the approved match shape. We
            don&apos;t bill for anyone outside the agreed profile.
          </Callout>
        </div>

        <div className="mt-8 bg-[var(--color-secondary-fixed)]/55 border-l-[3px] border-[var(--color-secondary)] px-8 py-8">
          <div className="font-mono text-[10px] tracking-[0.28em] uppercase font-semibold text-[var(--color-secondary)] mb-3">
            3-Call walkaway
          </div>
          <div className="cover-title text-[28px] md:text-[34px] leading-[1.1] text-[var(--color-primary)] mb-3 tracking-[-0.01em]">
            Your first three meetings are your test drive.
          </div>
          <p className="text-[15.5px] leading-[1.65]">
            If the quality isn&apos;t there, you keep the Partner Match Report and the
            sample asset, and walk - no contract, no further charge.
          </p>
        </div>

        <p className="mt-10 italic text-[var(--color-on-surface-variant)] text-[15px] leading-[1.65] max-w-2xl">
          For context: trade shows and partnership trials run $15K–$40K with no
          guarantee of fit. The pilot is &lt; 5% of that, with destination exclusivity
          included.
        </p>
      </Page>

      {/* =================== WHY US =================== */}
      <Page id="why" no="07" total="08" title="Why this fits Discover Montenegro" runner="§ VI · Why us">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <WhyCard
            label="Peer · not vendor"
            icon={<HandshakeIcon />}
          >
            Technical co-founder of Balkan Wanders, a luxury DMC. The engine on this
            page was built from inside a DMC - not bolted on from a marketing agency.
          </WhyCard>
          <WhyCard
            label="Native to this stack"
            icon={<SparkIcon />}
          >
            Matching, personalisation, and instant replies. We scale from 50 to
            thousands without losing quality.
          </WhyCard>
          <WhyCard
            label="Exclusivity"
            icon={<ShieldIcon />}
          >
            While you&apos;re a client, no competing Montenegro luxury DMC gets this
            engine.
          </WhyCard>
          <WhyCard
            label="Easy out"
            icon={<ExitIcon />}
          >
            Worst case: you keep the Partner Match Report with 50 approved leads and 3
            free sales calls.
          </WhyCard>
        </div>
      </Page>

      {/* =================== SAMPLE LIST =================== */}
      <Page id="sample" no="07" total="08" title="Sample List" runner="§ VI · Sample">
        <p className="text-[15.5px] leading-[1.65] text-[var(--color-on-surface-variant)] max-w-2xl mb-10">
          Three operators from a working sample built for Discover Montenegro -
          boutique luxury tour operators and high-end travel advisors already selling
          Adriatic / Mediterranean itineraries.
        </p>

        {sampleLeads.length === 0 ? (
          <div className="text-sm text-[var(--color-on-surface-variant)]/60">
            Loading sample…
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {sampleLeads.map((lead) => (
              <LeadSampleCard key={lead.company_website} lead={lead} />
            ))}
          </div>
        )}

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Link
            href={`/top_icp/${PROSPECT_SLUG}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)] hover:text-[var(--color-secondary)] transition-colors"
          >
            View the full sample list
            <ArrowIcon />
          </Link>
          <span className="text-xs text-[var(--color-on-surface-variant)]/60">
            (Demo - the live Partner Match Report at kickoff will be 50 operators in
            your approved shape.)
          </span>
        </div>
      </Page>

      {/* =================== NEXT STEP =================== */}
      <Page id="next" no="08" total="08" title="Next step" runner="§ VII · Next step" last>
        <p className="text-[18px] leading-[1.6] max-w-2xl mb-8">
          A 20-minute call to confirm voice, what your audience looks like, and the
          shape of the match. If aligned, onboarding starts the same week.
        </p>

        <div className="cover-title text-[26px] md:text-[32px] leading-[1.15] tracking-[-0.01em] text-[var(--color-primary)] mb-2">
          <span className="text-[var(--color-secondary)]">→</span> Pick a time below,
          or reply with what works.
        </div>

        <div className="mt-8 print:hidden">
          <div
            ref={calendlyRef}
            className="calendly-target overflow-hidden border border-[var(--color-on-surface)]/15"
            style={{ minWidth: "320px", height: "700px" }}
          />
        </div>

        <div className="hidden print:block mt-8 bg-[var(--color-surface-low)] px-6 py-5 text-sm">
          Book at <strong>calendly.com/stackleaps/30min</strong>
        </div>

        <div className="mt-12 pt-6 border-t border-[var(--color-on-surface)]/15 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="font-mono text-sm text-[var(--color-on-surface-variant)] leading-[1.8]">
            — <span className="font-bold text-[var(--color-primary)]">Peretz Levinov</span>
            <br />
            stackleaps.com
          </div>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp Peretz"
            className="inline-flex items-center gap-2 px-3.5 py-3 bg-[#25D366] hover:bg-[#1ebc59] text-white rounded-md transition-colors"
          >
            <WhatsAppIcon />
            <span className="font-semibold text-sm">Message on WhatsApp</span>
          </a>
        </div>
      </Page>

      <footer className="bg-[var(--color-primary)] text-white print:hidden">
        <Container>
          <div className="py-8 flex flex-col md:flex-row md:items-center md:justify-between gap-2 font-mono text-[11px] tracking-[0.18em] uppercase">
            <span>stackleaps.com</span>
            <span className="opacity-70">
              Proposal · DMC Discover Montenegro · 2026-05-18
            </span>
          </div>
        </Container>
      </footer>

      <style jsx global>{`
        .proposal-root {
          font-family: var(--font-plex-sans), system-ui, sans-serif;
          background: var(--color-surface);
          color: var(--color-on-surface);
        }
        .proposal-root .font-mono {
          font-family: var(--font-plex-mono), ui-monospace, monospace;
        }
        .proposal-root .cover-title,
        .proposal-root h1,
        .proposal-root h2,
        .proposal-root h3 {
          font-family: var(--font-bricolage), system-ui, sans-serif;
          font-variation-settings: "wdth" 95;
          font-weight: 500;
        }
        .proposal-root .cover-title {
          font-weight: 600;
        }
        @media print {
          html,
          body,
          .proposal-root {
            background: #ffffff !important;
          }
          .cover-page,
          .doc-page {
            page-break-inside: avoid;
            page-break-after: always;
          }
        }
      `}</style>
    </main>
  );
}

/* ─────────────── containers ─────────────── */

function Container({ children }: { children: React.ReactNode }) {
  return <div className="max-w-[1400px] mx-auto px-6 md:px-10">{children}</div>;
}

function Page({
  id,
  no,
  total,
  title,
  runner,
  children,
  last,
}: {
  id: string;
  no: string;
  total: string;
  title: string;
  runner: string;
  children: React.ReactNode;
  last?: boolean;
}) {
  return (
    <section
      id={id}
      className={`doc-page bg-[var(--color-surface)] ${last ? "pb-24" : "pb-20"} pt-16 md:pt-20`}
    >
      <Container>
        <div className="flex items-baseline justify-between pb-3 mb-10 border-b border-[var(--color-on-surface)]/12 font-mono text-[10.5px] tracking-[0.22em] uppercase text-[var(--color-on-surface-variant)]">
          <span className="font-semibold text-[var(--color-primary)]">StackLeaps · Proposal</span>
          <span className="opacity-70 hidden md:inline">{runner}</span>
          <span className="opacity-70">{no} / {total}</span>
        </div>
        <h2 className="text-[2.25rem] md:text-[2.75rem] leading-[1.05] tracking-[-0.02em] text-[var(--color-primary)] mb-12 max-w-3xl">
          {title}
        </h2>
        {children}
      </Container>
    </section>
  );
}

/* ─────────────── cover bits ─────────────── */

function CoverMeta({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div>
      <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-[var(--color-on-surface-variant)]/70 mb-1.5">
        {label}
      </div>
      <div className="font-semibold text-[15px] text-[var(--color-primary)] leading-tight">
        {value}
      </div>
      {sub && (
        <div className="font-mono text-[10.5px] tracking-[0.08em] text-[var(--color-on-surface-variant)]/80 mt-0.5">
          {sub}
        </div>
      )}
    </div>
  );
}

/* ─────────────── opportunity blocks ─────────────── */

function BlockHeading({
  icon,
  tone,
  children,
}: {
  icon: React.ReactNode;
  tone: "primary" | "secondary";
  children: React.ReactNode;
}) {
  const color = tone === "primary" ? "text-[var(--color-primary)]" : "text-[var(--color-secondary)]";
  return (
    <h3 className={`cover-title text-[24px] md:text-[28px] leading-tight tracking-[-0.01em] ${color} flex items-center gap-3`}>
      <span className={`shrink-0 ${color}`}>{icon}</span>
      <span>{children}</span>
    </h3>
  );
}

function SmallBullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="mt-[10px] w-1.5 h-1.5 rounded-full bg-[var(--color-secondary)] shrink-0" />
      <span>{children}</span>
    </li>
  );
}

/* ─────────────── proof ─────────────── */

function ProofPanel() {
  return (
    <div className="mt-14 bg-[var(--color-surface-low)] px-8 md:px-12 py-12 md:py-14">
      <div className="font-mono text-[11px] tracking-[0.24em] uppercase font-semibold text-[var(--color-secondary)] mb-2">
        Proof · Same engine, run for a peer
      </div>
      <p className="italic text-[var(--color-primary)] text-[18px] md:text-[20px] leading-snug mb-10 max-w-2xl">
        &ldquo;Same script we ran for our own{" "}
        <a
          href="https://balkanwanders.com"
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-[var(--color-secondary)] decoration-1 underline-offset-[3px] hover:text-[var(--color-secondary)] transition-colors"
        >
          Balkan Wanders
        </a>{" "}
        DMC.&rdquo;
      </p>

      <div className="grid grid-cols-3 gap-y-8 md:gap-y-0">
        <StatCol num="10" label="Days" />
        <StatCol num="7" label="Booked sales calls" accent withDivider />
        <StatCol num="1,200" label="Operators contacted" withDivider />
      </div>

      <p className="mt-8 font-mono text-[10.5px] tracking-[0.18em] uppercase text-[var(--color-on-surface-variant)]/70">
        Luxury planning cycles run long - the remaining 6 are warm and pending.
      </p>
    </div>
  );
}

function StatCol({
  num,
  label,
  accent,
  withDivider,
}: {
  num: string;
  label: string;
  accent?: boolean;
  withDivider?: boolean;
}) {
  return (
    <div className={`relative px-4 md:px-6 ${withDivider ? "md:border-l md:border-[var(--color-on-surface)]/15" : ""}`}>
      <div
        className={`cover-title text-[2.25rem] md:text-[3rem] leading-none tracking-[-0.025em] tabular-nums ${
          accent ? "text-[var(--color-secondary)]" : "text-[var(--color-primary)]"
        }`}
      >
        {num}
      </div>
      <div className="mt-3 font-mono text-[10.5px] tracking-[0.2em] uppercase font-semibold text-[var(--color-on-surface-variant)] leading-snug">
        {label}
      </div>
    </div>
  );
}

/* ─────────────── phase cards ─────────────── */

function PhaseCard({
  tone,
  phase,
  weeks,
  title,
  summary,
  bullets,
  icon,
}: {
  tone: "blue" | "cream";
  phase: string;
  weeks: string;
  title: string;
  summary: string;
  bullets: string[];
  icon: React.ReactNode;
}) {
  const bg = tone === "blue" ? "bg-[var(--color-surface-container)]" : "bg-[var(--color-surface-low)]";
  return (
    <div className={`${bg} p-8 md:p-10 flex flex-col gap-5 h-full relative overflow-hidden`}>
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] tracking-[0.26em] uppercase font-semibold text-[var(--color-secondary)]">
          {phase}
        </span>
        <span className="font-mono text-[10.5px] tracking-[0.1em] text-[var(--color-on-surface-variant)]/80">
          {weeks}
        </span>
      </div>

      <div className="flex items-start gap-4">
        <div className="w-11 h-11 rounded-lg bg-white/70 border border-[var(--color-on-surface)]/10 flex items-center justify-center text-[var(--color-primary)] shrink-0">
          {icon}
        </div>
        <h3 className="cover-title text-[22px] md:text-[26px] leading-[1.15] text-[var(--color-primary)] tracking-[-0.01em]">
          {title}
        </h3>
      </div>

      <p className="italic text-[var(--color-primary)]/85 text-[14px] leading-[1.5]">
        {summary}
      </p>
      <ul className="space-y-3 text-[14.5px] leading-[1.55] mt-1">
        {bullets.map((b) => (
          <li key={b} className="flex gap-3">
            <span className="mt-[9px] w-1.5 h-1.5 rounded-full bg-[var(--color-secondary)] shrink-0" />
            <span>{b}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ─────────────── funnel (4 stages) ─────────────── */

function Funnel() {
  const stages = [
    { num: "~50", label1: "Approved", label2: "Match samples" },
    { num: "Refined", label1: "Clear target", label2: "Outreach" },
    { num: "Thousands", label1: "Contacts", label2: "Rotated quarterly" },
    { num: "∎", label1: "Meetings", label2: "Booked", accent: true },
  ];
  return (
    <div className="mt-14 bg-white border border-[var(--color-on-surface)]/12 px-6 md:px-10 py-10">
      <div className="font-mono text-[10px] tracking-[0.24em] uppercase font-semibold text-[var(--color-on-surface-variant)] mb-7">
        From approval to booked
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] gap-4 md:gap-2 items-stretch">
        {stages.map((s, i) => (
          <div key={s.label1} className="contents">
            <FunnelBlock {...s} index={i + 1} />
            {i < stages.length - 1 && <FunnelConnector />}
          </div>
        ))}
      </div>
    </div>
  );
}

function FunnelBlock({
  num,
  label1,
  label2,
  accent,
  index,
}: {
  num: string;
  label1: string;
  label2: string;
  accent?: boolean;
  index: number;
}) {
  return (
    <div
      className={`relative px-5 py-6 border ${
        accent
          ? "border-[var(--color-secondary)]/70 bg-[var(--color-secondary-fixed)]/40"
          : "border-[var(--color-on-surface)]/15 bg-[var(--color-surface-low)]/60"
      } flex flex-col gap-3`}
    >
      <div className="absolute top-2 right-3 font-mono text-[9px] tracking-[0.2em] uppercase opacity-50">
        0{index}
      </div>
      <div
        className={`cover-title text-[1.75rem] md:text-[2.25rem] leading-none tracking-[-0.025em] ${
          accent ? "text-[var(--color-secondary)]" : "text-[var(--color-primary)]"
        }`}
      >
        {num}
      </div>
      <div className="font-mono text-[10.5px] tracking-[0.18em] uppercase font-semibold text-[var(--color-on-surface)] leading-snug">
        {label1}
        <br />
        <span className="opacity-60 font-normal">{label2}</span>
      </div>
    </div>
  );
}

function FunnelConnector() {
  return (
    <div className="hidden md:flex items-center justify-center text-[var(--color-on-surface-variant)]/50 px-1">
      <svg width="22" height="10" viewBox="0 0 22 10" fill="none">
        <line x1="0" y1="5" x2="16" y2="5" stroke="currentColor" strokeWidth="1" />
        <polyline points="12,1 20,5 12,9" stroke="currentColor" strokeWidth="1" fill="none" />
      </svg>
    </div>
  );
}

/* ─────────────── scope columns ─────────────── */

function ScopeColumn({
  title,
  tone,
  items,
}: {
  title: string;
  tone: "in" | "out";
  items: string[];
}) {
  const dotColor = tone === "in" ? "bg-[var(--color-secondary)]" : "bg-[var(--color-on-surface-variant)]/45";
  const textColor = tone === "in" ? "text-[var(--color-on-surface)]" : "text-[var(--color-on-surface-variant)]";
  const heading = tone === "in" ? "text-[var(--color-primary)]" : "text-[var(--color-on-surface-variant)]/70";
  return (
    <div>
      <div className={`font-mono text-[11px] tracking-[0.24em] uppercase font-semibold ${heading} pb-3 mb-5 border-b border-[var(--color-on-surface)]/15`}>
        {title}
      </div>
      <ul className={`space-y-3.5 text-[15.5px] leading-[1.6] ${textColor}`}>
        {items.map((line) => (
          <li key={line} className="flex gap-3">
            <span className={`mt-[10px] w-1.5 h-1.5 rounded-full shrink-0 ${dotColor}`} />
            <span>{line}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ─────────────── process / pricing / callout ─────────────── */

function ProcessRow({
  week,
  headline,
  sub,
}: {
  week: string;
  headline: string;
  sub?: string;
}) {
  return (
    <div className="grid grid-cols-[100px_1fr] md:grid-cols-[180px_1fr] gap-4 md:gap-8 py-6 border-b border-[var(--color-on-surface)]/12">
      <div className="font-mono text-[12px] tracking-[0.1em] font-semibold text-[var(--color-primary)] uppercase">
        {week}
      </div>
      <div>
        <div className="text-[16px] leading-[1.5] text-[var(--color-on-surface)] font-medium">
          {headline}
        </div>
        {sub && (
          <div className="text-[14px] leading-[1.55] text-[var(--color-on-surface-variant)] mt-1">
            {sub}
          </div>
        )}
      </div>
    </div>
  );
}

function PriceRow({
  item,
  amount,
  suffix,
  note,
}: {
  item: string;
  amount: string;
  suffix: string;
  note: string;
}) {
  return (
    <div className="grid grid-cols-[1fr_auto] items-baseline gap-4 py-7 border-b border-[var(--color-on-surface)]/12">
      <div>
        <div className="font-mono text-[11.5px] tracking-[0.22em] uppercase font-semibold text-[var(--color-on-surface-variant)] mb-2">
          {item}
        </div>
        <div className="text-[14px] italic text-[var(--color-on-surface-variant)]/80">
          {note}
        </div>
      </div>
      <div className="text-right">
        <div className="cover-title text-[2.5rem] md:text-[3rem] text-[var(--color-primary)] tracking-[-0.025em] tabular-nums leading-none">
          {amount}
          {suffix && (
            <span className="ml-1 text-[14px] font-normal text-[var(--color-on-surface-variant)]/80 tracking-normal">
              {suffix}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function Callout({
  label,
  tone,
  children,
}: {
  label: string;
  tone: "blue" | "cream";
  children: React.ReactNode;
}) {
  const bg = tone === "blue" ? "bg-[var(--color-surface-container)]" : "bg-[var(--color-surface-low)]";
  return (
    <div className={`${bg} px-8 py-7`}>
      <div className="font-mono text-[10px] tracking-[0.26em] uppercase font-semibold text-[var(--color-primary-container)] mb-3">
        {label}
      </div>
      <p className="text-[15.5px] leading-[1.65]">{children}</p>
    </div>
  );
}

/* ─────────────── why-us card ─────────────── */

function WhyCard({
  label,
  icon,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white border border-[var(--color-on-surface)]/12 px-7 py-7 flex gap-5 items-start hover:border-[var(--color-secondary-container)]/60 transition-colors">
      <div className="w-11 h-11 rounded-lg bg-[var(--color-surface-low)] flex items-center justify-center text-[var(--color-secondary)] shrink-0">
        {icon}
      </div>
      <div className="flex-1">
        <div className="font-mono text-[10px] tracking-[0.28em] uppercase font-bold text-[var(--color-secondary)] mb-2">
          {label}
        </div>
        <p className="text-[15.5px] leading-[1.6] text-[var(--color-on-surface)]">{children}</p>
      </div>
    </div>
  );
}

/* ─────────────── sample lead card — mirrors top_icp ─────────────── */

function LeadSampleCard({ lead }: { lead: Lead }) {
  const [logoError, setLogoError] = useState(false);
  const safeUrl = lead.company_website?.startsWith("http")
    ? lead.company_website
    : `https://${lead.company_website || ""}`;

  return (
    <div className="bg-white rounded-2xl border border-[var(--color-outline-variant)]/30 shadow-ambient overflow-hidden hover:border-[var(--color-primary)]/20 transition-colors">
      <div className="relative bg-gradient-to-br from-[var(--color-primary)]/[0.04] to-[var(--color-secondary-fixed)]/30 px-6 pt-6 pb-5">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white border border-[var(--color-outline-variant)]/20 flex items-center justify-center shrink-0 shadow-sm text-[var(--color-primary)]/40">
            <PersonGlyph />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-base font-semibold text-[var(--color-on-surface)] leading-tight">
              {lead.full_name}
            </h4>
            {lead.title && lead.title !== "--" && (
              <p className="text-[13px] text-[var(--color-on-surface-variant)] leading-snug mt-0.5 line-clamp-2">
                {lead.title}
              </p>
            )}
            <div className="flex items-center gap-2 mt-2">
              {logoError || !lead.company_logo ? (
                <span className="w-5 h-5 rounded bg-[var(--color-primary)]/8 inline-flex items-center justify-center text-[10px] font-bold text-[var(--color-primary)]">
                  {lead.company.charAt(0).toUpperCase()}
                </span>
              ) : (
                <Image
                  src={lead.company_logo}
                  alt=""
                  width={20}
                  height={20}
                  className="rounded bg-white object-contain shrink-0"
                  onError={() => setLogoError(true)}
                  unoptimized
                />
              )}
              <span className="text-[13px] font-medium text-[var(--color-primary)] truncate">
                {lead.company}
              </span>
            </div>
            {lead.company_country && (
              <div className="flex items-center gap-1 text-[12px] text-[var(--color-on-surface-variant)] mt-1.5">
                <LocationIcon />
                {lead.company_country}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="px-6 py-4 space-y-2.5">
        {lead.email && (
          <a
            href={`mailto:${lead.email}`}
            className="flex items-center gap-3 text-[13px] text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors"
          >
            <span className="w-7 h-7 rounded-md bg-[var(--color-primary)]/6 flex items-center justify-center text-[var(--color-primary)]">
              <EnvelopeIcon />
            </span>
            <span className="truncate font-medium">{lead.email}</span>
          </a>
        )}
        {lead.linkedin && (
          <a
            href={lead.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-[13px] text-[var(--color-on-surface-variant)] hover:text-[#0A66C2] transition-colors"
          >
            <span className="w-7 h-7 rounded-md bg-[#0A66C2]/8 flex items-center justify-center text-[#0A66C2]">
              <LinkedInIcon />
            </span>
            <span className="truncate font-medium">View Profile</span>
          </a>
        )}
        {lead.company_website && (
          <a
            href={safeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-[13px] text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors"
          >
            <span className="w-7 h-7 rounded-md bg-[var(--color-primary)]/6 flex items-center justify-center text-[var(--color-primary)]">
              <GlobeIcon />
            </span>
            <span className="truncate font-medium">
              {lead.company_website.replace(/^https?:\/\/(www\.)?/, "")}
            </span>
          </a>
        )}
      </div>
    </div>
  );
}

/* ─────────────── icons ─────────────── */

function CheckCircleIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="8 12 11 15 16 9" />
    </svg>
  );
}
function TargetIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
    </svg>
  );
}
function GearIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h0a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h0a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v0a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}
function BeakerIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 3h6" />
      <path d="M10 3v6.5L4.5 19a2 2 0 0 0 1.8 3h11.4a2 2 0 0 0 1.8-3L14 9.5V3" />
      <path d="M6.5 14h11" />
    </svg>
  );
}
function TrendingUpIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  );
}
function HandshakeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 17l2 2a1 1 0 0 0 3 0c0-.6-.6-1.2-1-1.5L12 14" />
      <path d="M14 14l2 2a1 1 0 1 0 3 0c0-.6-.6-1.2-1-1.5L15 11" />
      <path d="M17 11l2 2a1 1 0 1 0 3 0c0-1-.5-1.7-1-2L17 6" />
      <path d="M21 6l-3-3-3 3-2-2-6 6" />
      <path d="M3 13l4 4 4-4" />
    </svg>
  );
}
function SparkIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l1.8 5.2L19 9l-5.2 1.8L12 16l-1.8-5.2L5 9l5.2-1.8L12 2z" />
      <path d="M19 14l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7.7-2z" />
    </svg>
  );
}
function ShieldIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l8 4v6c0 5-4 9-8 10-4-1-8-5-8-10V6l8-4z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  );
}
function ExitIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}
function ArrowIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}
function PersonGlyph() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
function EnvelopeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}
function LinkedInIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}
function GlobeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  );
}
function LocationIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}
function WhatsAppIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 32 32" fill="currentColor">
      <path d="M19.1 17.2c-.3-.1-1.6-.8-1.9-.9-.3-.1-.4-.1-.6.1-.2.3-.7.9-.8 1.1-.2.2-.3.2-.6.1s-1.3-.5-2.5-1.5c-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5s-.6-1.5-.9-2.1c-.2-.5-.5-.4-.6-.5h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.2 0 1.3.9 2.5 1 2.7.1.2 1.8 2.8 4.4 3.9.6.3 1.1.4 1.5.5.6.2 1.2.2 1.6.1.5-.1 1.6-.6 1.8-1.3.2-.6.2-1.2.2-1.3-.1-.1-.3-.2-.6-.3zM16 4C9.4 4 4 9.4 4 16c0 2.1.6 4.2 1.6 6L4 28l6.2-1.6c1.7.9 3.7 1.5 5.8 1.5 6.6 0 12-5.4 12-12S22.6 4 16 4zm0 22c-1.9 0-3.7-.5-5.3-1.4l-.4-.2-3.7 1 1-3.6-.2-.4c-1-1.7-1.5-3.5-1.5-5.4 0-5.5 4.5-10 10.1-10S26 10.5 26 16s-4.5 10-10 10z" />
    </svg>
  );
}
