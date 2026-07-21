"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useSpring } from "framer-motion";
import ProposalHeader from "@/components/ProposalHeader";

const PROSPECT_SLUG = "dmc-cheyf";
const WHATSAPP_NUMBER = "972549256286";

const SECTIONS = [
  { id: "intro", label: "Intro" },
  { id: "opportunity", label: "Opportunity" },
  { id: "what-we-do", label: "What we do" },
  { id: "scope", label: "Scope" },
  { id: "process", label: "Process" },
  { id: "pricing", label: "Pricing" },
  { id: "why", label: "Why us" },
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

  const [currentSection, setCurrentSection] = useState<string>("Intro");

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

  return (
    <main className="proposal-root">
      <motion.div
        aria-hidden
        style={{ scaleX: progress, transformOrigin: "0% 50%" }}
        className="fixed top-0 left-0 right-0 h-[2px] bg-[var(--color-secondary-container)] z-[60] print:hidden"
      />

      <ProposalHeader
        downloadHref={`/proposals/${PROSPECT_SLUG}.pdf`}
        downloadFilename={`StackLeaps-${PROSPECT_SLUG}-proposal.pdf`}
        currentSection={currentSection}
      />

      {/* =================== COVER =================== */}
      <section id="intro" className="cover-page bg-[var(--color-surface)]">
        <Container>
          <div className="pt-8 md:pt-10 pb-5 flex items-center justify-between font-mono text-[11px] tracking-[0.22em] uppercase text-[var(--color-on-surface-variant)] border-b border-[var(--color-on-surface)]/10">
            <span className="font-semibold text-[var(--color-primary)]">
              Proposal · Confidential
            </span>
            <span>July 21, 2026</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-10 lg:gap-14 items-center pt-10 md:pt-12 pb-12 md:pb-16">
            <div className="space-y-7">
              <h1 className="cover-title text-[var(--color-primary)] leading-[1.02] tracking-[-0.025em] text-[clamp(2.5rem,5.2vw,4.5rem)]">
                <span className="block">StackLeaps</span>
                <span className="block">
                  <span className="text-[var(--color-secondary)] font-light">×</span>{" "}
                  .Cheyf
                </span>
              </h1>

              <p className="text-[17px] md:text-[19px] leading-[1.55] text-[var(--color-on-surface-variant)] max-w-xl">
                60 days. Done-for-you outreach and booked introductions with the
                organisations that bring groups to Bosnia &amp; Herzegovina - and buy
                your itinerary instead of dictating their own.
              </p>

              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[var(--color-on-surface)]/12">
                <CoverMeta label="Presented to" value="Nermin Numić" sub=".Cheyf · Sarajevo" />
                <CoverMeta label="Presented by" value="Peretz Levinov" sub="StackLeaps" />
                <CoverMeta label="Engagement" value="60-day pilot" sub="September start" />
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-3 bg-[var(--color-secondary-fixed)]/45 -z-10 rounded-sm" />
              <div className="relative w-full aspect-[5/6] overflow-hidden">
                <Image
                  src="/images/proposals/cheif.avif"
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
      <Page id="opportunity" no="01" total="07" title="Where you stand" runner="§ I · Opportunity">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 max-w-5xl">
          <div>
            <BlockHeading icon={<CheckCircleIcon />} tone="primary">
              What you already have
            </BlockHeading>
            <ul className="space-y-3 text-[16px] leading-[1.6] mt-5">
              <SmallBullet>
                A premium, deliberately slow product - small groups, signature tours, and
                a brand that means something locally
              </SmallBullet>
              <SmallBullet>
                ~30 personalised itineraries last year, closing 95-99% of the people who
                take the video call
              </SmallBullet>
              <SmallBullet>
                Guests booking a third and fourth time, plus a German-speaking audience
                built organically on social and long-form video
              </SmallBullet>
              <SmallBullet>
                An operation that finally runs without you - and a guide you trust, with
                days to fill
              </SmallBullet>
            </ul>
          </div>

          <div>
            <BlockHeading icon={<TargetIcon />} tone="secondary">
              The opportunity
            </BlockHeading>
            <div className="space-y-4 text-[16px] leading-[1.65] mt-5">
              <p>
                You&apos;ve deliberately stayed away from the agencies that push the price
                down, hand you their own itinerary, and hold your hotel space with no
                guarantee of volume. That was the right call for the brand. It also meant
                the only repeatable B2B channel stayed shut.
              </p>
              <p>
                We open a different door: organisations that bring their own people and
                buy <em>your</em> programme - NGOs, foundations, companies, and
                educational and study-travel organisers - plus the small-group specialist
                operators that genuinely fit a premium, slow-travel brand.
              </p>
              <p className="italic text-[var(--color-primary)] text-[18px] leading-snug pt-2">
                You already close almost everyone who gets on a call with you. The
                constraint was never your selling - it&apos;s how few of those calls
                exist.
              </p>
            </div>
          </div>
        </div>

        <ProofPanel />
      </Page>

      {/* =================== WHAT WE DO =================== */}
      <Page id="what-we-do" no="02" total="07" title="What we do" runner="§ II · Offer">
        <p className="text-[17px] leading-[1.7] mb-10 max-w-3xl">
          We do all the outreach for you - finding the right organisations, writing the
          emails in German and English, handling the replies - and book the introductions
          on your calendar. Your side stays light: one kickoff call, approve the
          shortlist, then take the introductions. Four stages:
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
              "Purchase the domains and mailboxes you'll send from - registered in your name",
              "Stand up the deliverability stack",
              "Run a warmup so inboxes land in primary, not spam",
              "If we ever part ways, the domains and mailboxes transfer to you",
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
              "Define your ideal partner - NGOs, foundations, corporates, educational organisers, brand-fit operators",
              "Find the actual decision-makers behind each organisation",
              "Hand you the top 50 best-fit contacts to review",
              "Nothing is sent until you've approved the list",
            ]}
          />

          <PhaseCard
            tone="blue"
            phase="Phase 03"
            weeks="Weeks 3–6"
            title="Finding the best angle"
            icon={<BeakerIcon />}
            summary="Send slowly, learn fast, keep only what converts."
            bullets={[
              "Build 3–5 message angles - including Building Bridges Through Tourism as its own angle",
              "Test German-language and English outreach separately",
              "Measure reply quality, not just open rates",
              "Scale the winning angle to your capacity - never past it",
            ]}
          />

          <PhaseCard
            tone="cream"
            phase="Phase 04"
            weeks="Week 7 onward"
            title="Booked calls, at your pace"
            icon={<TrendingUpIcon />}
            summary="Paced to your guide's capacity. Real conversations on your calendar."
            bullets={[
              "Roll the winning angle out - throttled to what you can actually deliver",
              "Replies handled in your voice and tone, in the prospect's language",
              "Booking + reminder sequence so the calls actually happen",
              "Retarget the pool every 3 months - timing is most of why people reply",
            ]}
          />
        </div>

        <Funnel />
      </Page>

      {/* =================== SCOPE =================== */}
      <Page id="scope" no="03" total="07" title="Inclusion / Exclusion" runner="§ III · Scope">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
          <ScopeColumn
            title="Included"
            tone="in"
            items={[
              "Partner Match Report - 50 best-fit contacts, your approval before anything sends",
              "Outreach to NGOs, foundations, corporates, educational organisers and brand-fit specialist operators",
              "Outreach written in German and English",
              "Email infrastructure - domains, inboxes, warmup, deliverability - registered in your name and transferable to you",
              "Replies handled in your voice and tone",
              "Booking + reminder sequences",
              "Exclusivity - while you're a client, we won't take on a new competing Bosnia & Herzegovina DMC",
            ]}
          />
          <ScopeColumn
            title="Not included"
            tone="out"
            items={[
              "The introductory call itself - you take it, and that's where you close 95%",
              "Itinerary building and post-call follow-up",
              "Website, brand, SEO or social work - that side already works",
              "Price-driven mass-market agencies that impose their own itineraries - deliberately out of scope",
              "B2C guest acquisition - this engine is B2B only",
              "Partnership / equity / revenue-share - open to revisit later",
            ]}
          />
        </div>
      </Page>

      {/* =================== PROCESS =================== */}
      <Page id="process" no="04" total="07" title="Process & timeline" runner="§ IV · Process">
        <p className="text-[16px] leading-[1.65] mb-10 max-w-3xl text-[var(--color-on-surface-variant)]">
          You said no decision before 1 September, and that&apos;s the right call
          mid-season - this timeline assumes it. Two weeks of warmup plus a couple of
          months of conversion means a September start aims at the 2027 season, which is
          the window you&apos;re preparing for anyway.
        </p>

        <div className="border-t border-[var(--color-on-surface)]/15">
          <ProcessRow
            week="By Sept 1"
            headline="Your decision. No pressure before it."
            sub="Season winds down, your partner is back, and you've had the proposal for six weeks."
          />
          <ProcessRow
            week="Week 1"
            headline="Kickoff. Voice + partner profile scoped."
            sub="Who counts as a good organisation for you, and who explicitly doesn't."
          />
          <ProcessRow
            week="Week 1–2"
            headline="Infrastructure warm. Match list approved."
            sub="Domains warmed, mailboxes set up, your sign-off before a single email goes out."
          />
          <ProcessRow
            week="Week 3–6"
            headline="First batch sent. Testing what resonates."
            sub="German vs English, and which angle - including Building Bridges."
          />
          <ProcessRow
            week="Week 7–8"
            headline="Best angle scales. First introductions booked."
            sub="Real conversations land on your calendar, paced to your guide's capacity."
          />
          <div className="grid grid-cols-[100px_1fr] md:grid-cols-[180px_1fr] gap-4 md:gap-8 py-7 bg-[var(--color-secondary-fixed)]/55 -mx-4 md:-mx-8 px-4 md:px-8 mt-1">
            <div className="font-mono text-[12px] tracking-[0.1em] font-semibold text-[var(--color-secondary)] uppercase">
              Day 60
            </div>
            <div>
              <div className="cover-title text-2xl md:text-[28px] leading-[1.2] text-[var(--color-primary)]">
                Target: 3 booked introductions - and a clear answer on whether this
                channel works for a brand like yours.
              </div>
              <div className="text-[14px] leading-[1.55] text-[var(--color-on-surface-variant)] mt-2">
                Cost per call, reply quality, fit - real numbers instead of a guess,
                before you commit anything to 2027.
              </div>
            </div>
          </div>
        </div>
      </Page>

      {/* =================== PRICING =================== */}
      <Page id="pricing" no="05" total="07" title="Pricing" runner="§ V · Pricing">
        <div className="border-t border-[var(--color-on-surface)]/15">
          <PriceRow item="Monthly retainer" amount="$750" suffix="/ month" note="Covers infrastructure - domains, mailboxes, deliverability" />
          <PriceRow item="Per booked call" amount="$150" suffix="/ call" note="Paid only when the call happens" />
          <PriceRow item="Setup fee" amount="None" suffix="" note="No upfront commitment" />
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-5">
          <Callout label="Transparency · cost & margin" tone="blue">
            The $750/mo covers our infrastructure cost. We make our margin on the $150 per
            booked meeting, which means we only earn when you do.
          </Callout>
          <Callout label="Quality guardrail" tone="cream">
            Billable calls = organisations inside the approved match profile. We
            don&apos;t bill for anyone outside the agreed shape - including the agency
            type you told us to stay away from.
          </Callout>
        </div>

        <div className="mt-8 bg-[var(--color-secondary-fixed)]/55 border-l-[3px] border-[var(--color-secondary)] px-8 py-8">
          <div className="font-mono text-[10px] tracking-[0.28em] uppercase font-semibold text-[var(--color-secondary)] mb-3">
            3-Call walkaway
          </div>
          <div className="cover-title text-[28px] md:text-[34px] leading-[1.1] text-[var(--color-primary)] mb-3 tracking-[-0.01em]">
            Your first three introductions are your test drive.
          </div>
          <p className="text-[15.5px] leading-[1.65]">
            If the quality isn&apos;t there, you keep the Partner Match Report and the
            domains, and walk - no contract, no further charge. Around{" "}
            <strong>$1,500 total</strong> is what you actually risk to find out whether
            this pipeline works for you.
          </p>
        </div>

        {/* The one number we still need */}
        <div className="mt-8 bg-[var(--color-surface-low)] px-8 md:px-10 py-9">
          <div className="font-mono text-[10px] tracking-[0.28em] uppercase font-semibold text-[var(--color-primary-container)] mb-3">
            One number we still need
          </div>
          <p className="text-[15.5px] leading-[1.65] max-w-3xl mb-7">
            On our call we got interrupted before you answered what one good partner is
            worth to you over the life of the relationship. That number - not this pricing
            page - is what decides whether the channel makes sense. Here&apos;s the maths
            ready for your figure:
          </p>

          <div className="border-t border-[var(--color-on-surface)]/15 max-w-3xl">
            <MathRow label="Infrastructure, one month" value="$750" />
            <MathRow label="10 booked introductions × $150" value="$1,500" />
            <MathRow label="Total to reach 10 real conversations" value="$2,250" />
            <MathRow
              label="If you close 1 in 10 → cost per new partner"
              value="≈ $2,250"
              accent
            />
          </div>

          <p className="text-[15px] leading-[1.65] max-w-3xl mt-7">
            One-in-ten is deliberately pessimistic - you close nearly everyone who takes a
            call with you today. At a 3× return, a partner worth more than roughly{" "}
            <strong>$7,000</strong> over its life makes this channel pay. Worth less than
            that, and we should both say so before you spend anything.
          </p>
          <p className="text-[15px] leading-[1.65] max-w-3xl mt-4 italic text-[var(--color-on-surface-variant)]">
            Bring your number to the follow-up call and we&apos;ll run it properly
            together.
          </p>
        </div>
      </Page>

      {/* =================== WHY US =================== */}
      <Page id="why" no="06" total="07" title="Why this fits .Cheyf" runner="§ VI · Why us">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <WhyCard label="Peer · not vendor" icon={<HandshakeIcon />}>
            Technical co-founder of Balkan Wanders, a DMC working the same region you do.
            The engine on this page was built from inside a Balkan DMC - not bolted on
            from a marketing agency.
          </WhyCard>
          <WhyCard label="Built for a premium brand" icon={<SparkIcon />}>
            We throttle to your guide&apos;s capacity rather than blasting volume, and we
            filter out the price-driven agencies you don&apos;t want anywhere near your
            brand.
          </WhyCard>
          <WhyCard label="Exclusivity" icon={<ShieldIcon />}>
            While you&apos;re a client, we won&apos;t take on a new competing Bosnia
            &amp; Herzegovina DMC.
          </WhyCard>
          <WhyCard label="Easy out" icon={<ExitIcon />}>
            Worst case: you keep the Partner Match Report with 50 approved contacts, 3
            free introductions, and the domains and mailboxes in your own name.
          </WhyCard>
        </div>
      </Page>

      {/* =================== NEXT STEP =================== */}
      <Page id="next" no="07" total="07" title="Next step" runner="§ VII · Next step" last>
        <p className="text-[18px] leading-[1.6] max-w-2xl mb-8">
          A short call in the first week of August - once your partner is back and you
          two have had time with this. We confirm what a good organisation looks like for
          you, run the maths on your number, and you decide by September. Nothing needs
          deciding before then.
        </p>

        <div className="cover-title text-[26px] md:text-[32px] leading-[1.15] tracking-[-0.01em] text-[var(--color-primary)] mb-2">
          <span className="text-[var(--color-secondary)]">→</span> Pick a time below, or
          reply with what works.
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
            <span className="opacity-70">Proposal · .Cheyf · 2026-07-21</span>
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
        Proof · The campaign you saw on our call
      </div>
      <p className="italic text-[var(--color-primary)] text-[18px] md:text-[20px] leading-snug mb-10 max-w-2xl">
        &ldquo;Same engine we ran for our own{" "}
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
        <StatCol num="1,200" label="Contacted" />
        <StatCol num="38" label="Genuinely interested" withDivider />
        <StatCol num="7" label="Booked calls · 10 days" accent withDivider />
      </div>

      <p className="mt-8 font-mono text-[10.5px] tracking-[0.18em] uppercase text-[var(--color-on-surface-variant)]/70">
        Two converted into repeat partners - one is running four separate itineraries with
        us in a single season.
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
    { num: "Paced", label1: "High-fit only", label2: "Throttled to capacity" },
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

function MathRow({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="grid grid-cols-[1fr_auto] items-baseline gap-4 py-4 border-b border-[var(--color-on-surface)]/12">
      <div className={`text-[15px] leading-[1.5] ${accent ? "font-semibold text-[var(--color-primary)]" : "text-[var(--color-on-surface-variant)]"}`}>
        {label}
      </div>
      <div
        className={`cover-title tabular-nums tracking-[-0.02em] leading-none ${
          accent
            ? "text-[1.75rem] md:text-[2rem] text-[var(--color-secondary)]"
            : "text-[1.35rem] md:text-[1.5rem] text-[var(--color-primary)]"
        }`}
      >
        {value}
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
function WhatsAppIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 32 32" fill="currentColor">
      <path d="M19.1 17.2c-.3-.1-1.6-.8-1.9-.9-.3-.1-.4-.1-.6.1-.2.3-.7.9-.8 1.1-.2.2-.3.2-.6.1s-1.3-.5-2.5-1.5c-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5s-.6-1.5-.9-2.1c-.2-.5-.5-.4-.6-.5h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.2 0 1.3.9 2.5 1 2.7.1.2 1.8 2.8 4.4 3.9.6.3 1.1.4 1.5.5.6.2 1.2.2 1.6.1.5-.1 1.6-.6 1.8-1.3.2-.6.2-1.2.2-1.3-.1-.1-.3-.2-.6-.3zM16 4C9.4 4 4 9.4 4 16c0 2.1.6 4.2 1.6 6L4 28l6.2-1.6c1.7.9 3.7 1.5 5.8 1.5 6.6 0 12-5.4 12-12S22.6 4 16 4zm0 22c-1.9 0-3.7-.5-5.3-1.4l-.4-.2-3.7 1 1-3.6-.2-.4c-1-1.7-1.5-3.5-1.5-5.4 0-5.5 4.5-10 10.1-10S26 10.5 26 16s-4.5 10-10 10z" />
    </svg>
  );
}
