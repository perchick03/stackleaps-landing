"use client";

import {
  MotionConfig,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
  type TargetAndTransition,
  type Variants,
} from "framer-motion";
import Image from "next/image";
import { useRef, type ReactNode } from "react";

const EASE = [0.16, 1, 0.3, 1] as const;

// Load sequence (seconds): the paper goes out, one prospect replies (typed live),
// we answer with the booking link, the call books. Plays once, then the scene rests.
const T = { rows: 0.45, replied: 1.1, reply: 1.2, type: 1.5, answer: 2.4, booked: 3.2 };

// Each step hangs off an "on" variant: the paper's on mount, the scene's once it is on
// screen (on phones it sits below the copy).
const step = (off: TargetAndTransition, on: TargetAndTransition, delay: number, duration = 0.5): Variants => ({
  off,
  on: { ...on, transition: { duration, delay, ease: EASE } },
});

// Typewriter. Every character is laid out from the start (no reflow) and switched
// on in turn, cps characters per second.
function Typed({ text, at, cps }: { text: string; at: number; cps: number }) {
  return [...text].map((ch, i) => (
    <motion.span key={i} variants={step({ opacity: 0 }, { opacity: 1 }, at + i / cps, 0.01)}>
      {ch}
    </motion.span>
  ));
}

/* ─── Paper in flight ───
   Photographed envelopes and letters (generated, cut out with macOS Vision, see
   .tmp/2026-10-04-hero-depth) at three depths. Light comes from the upper right on
   every piece and on the backdrop. Far paper lags the scroll, near paper rushes past. */
const DEPTH = {
  far: { shift: 6, lag: 16, look: "blur-[2.5px] brightness-[0.62] saturate-[0.8]" },
  mid: { shift: 14, lag: 7, look: "brightness-[0.92]" },
  near: { shift: 42, lag: -4, look: "blur-[7px]" },
} as const;

type Paper = { n: number; w: number; h: number; depth: keyof typeof DEPTH; at: string; spin: number; delay: number };

// at: position + size (and phone visibility). w/h: the file's pixels.
const PAPERS: Paper[] = [
  { n: 9, w: 381, h: 412, depth: "far", at: "left-[44%] top-[9%] w-[9vw] max-w-[84px]", spin: 8, delay: 0.1 },
  { n: 2, w: 490, h: 597, depth: "far", at: "right-[3%] top-[14%] w-[7vw] max-w-[78px] hidden lg:block", spin: -6, delay: 0.2 },
  { n: 5, w: 524, h: 524, depth: "far", at: "left-[37%] bottom-[5%] w-[8vw] max-w-[96px] hidden lg:block", spin: 10, delay: 0.3 },
  { n: 6, w: 376, h: 527, depth: "far", at: "left-[3%] top-[16%] w-[6vw] max-w-[64px] hidden lg:block", spin: -8, delay: 0.25 },
  { n: 3, w: 667, h: 597, depth: "mid", at: "left-[-5%] top-[57%] w-[30vw] max-w-[170px] lg:left-[47%] lg:top-[21%] lg:w-[13vw]", spin: -12, delay: 0.35 },
  { n: 10, w: 524, h: 452, depth: "mid", at: "right-[3%] bottom-[24%] w-[24vw] max-w-[130px] lg:right-auto lg:left-[49%] lg:bottom-[16%] lg:w-[10vw]", spin: 14, delay: 0.45 },
  { n: 7, w: 535, h: 458, depth: "mid", at: "right-[-4%] top-[7%] w-[22vw] max-w-[150px] lg:right-[-2%] lg:top-[42%] lg:w-[11vw]", spin: -10, delay: 0.4 },
  { n: 1, w: 628, h: 528, depth: "near", at: "right-[-9%] bottom-[-4%] w-[46vw] max-w-[400px] lg:bottom-[-19%] lg:w-[26vw]", spin: -18, delay: 0.5 },
  { n: 8, w: 559, h: 484, depth: "near", at: "left-[-6%] bottom-[-24%] w-[30vw] max-w-[330px] hidden lg:block", spin: 16, delay: 0.6 },
];

export default function Hero() {
  const reduce = useReducedMotion();
  const scene = useRef<HTMLDivElement>(null);
  // Natural-flow hero: progress runs from the resting position until the scene has left the top.
  const { scrollYProgress } = useScroll({ target: scene, offset: ["start 240px", "end start"] });
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const depth: Depth = {
    x: useSpring(pointerX, { stiffness: 70, damping: 20 }),
    y: useSpring(pointerY, { stiffness: 70, damping: 20 }),
    scroll: scrollYProgress,
    on: !reduce,
  };

  const paper = (d: keyof typeof DEPTH) =>
    PAPERS.filter((p) => p.depth === d).map((p) => (
      <Plane key={p.n} depth={depth} shift={DEPTH[d].shift} lag={DEPTH[d].lag} spin={p.spin} className={`absolute ${p.at}`}>
        <motion.div variants={step({ opacity: 0, y: 90, rotate: -p.spin }, { opacity: 1, y: 0, rotate: 0 }, p.delay, 1.4)}>
          <Image
            src={`/images/hero/paper-${String(p.n).padStart(2, "0")}.webp`}
            alt=""
            width={p.w}
            height={p.h}
            sizes={d === "near" ? "(max-width: 1024px) 46vw, 440px" : "(max-width: 1024px) 22vw, 170px"}
            className={`h-auto w-full drop-shadow-[0_24px_30px_rgba(5,12,20,0.45)] ${DEPTH[d].look}`}
          />
        </motion.div>
      </Plane>
    ));

  return (
    // reducedMotion="user": transforms snap, opacity still carries the sequence.
    <MotionConfig reducedMotion="user">
      <section
        id="hero"
        className="relative isolate bg-[var(--color-ink)] text-[var(--color-paper)]"
        onPointerMove={(e) => {
          if (e.pointerType !== "mouse") return;
          pointerX.set(e.clientX / window.innerWidth - 0.5);
          pointerY.set(e.clientY / window.innerHeight - 0.5);
        }}
        onPointerLeave={() => {
          pointerX.set(0);
          pointerY.set(0);
        }}
      >
        {/* Back: the lit backdrop, then far and mid paper. Clipped to the hero. */}
        <motion.div initial="off" animate="on" aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          {/* overscanned so the pointer and the scroll lag never show an edge */}
          <Plane depth={depth} shift={8} lag={14} className="absolute -inset-x-[3%] -top-[16svw] h-[115svh] lg:h-auto lg:-bottom-[3%]">
            <Image src="/images/hero/plate.webp" alt="" fill priority sizes="100vw" className="object-cover object-[8%_0%] lg:object-[70%_30%]" />
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-b from-transparent to-[var(--color-ink)] lg:hidden" />
          </Plane>
          {/* scrim only where the header sits; the light source lives top right */}
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[var(--color-ink)]/70 to-transparent" />
          {paper("far")}
          {paper("mid")}
        </motion.div>

        <div className="max-w-[1400px] mx-auto px-6 md:px-10 w-full min-h-[100svh] pt-24 grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-16 items-center">
          {/* Left - Copy */}
          <div className="flex flex-col gap-10 py-14 md:py-20 lg:py-28">
            <div className="space-y-7">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="text-4xl sm:text-5xl lg:text-[3.25rem] xl:text-[3.75rem] font-extrabold text-[var(--color-paper)] leading-[1.08] tracking-tight"
              >
                We book your calls. You close the sales.
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
                className="text-lg md:text-xl text-[var(--color-paper)]/75 font-light max-w-lg leading-relaxed"
              >
                Pipeline that books meetings,{" "}
                <em className="relative inline-block italic text-white font-normal">
                  run entirely for you
                  <svg
                    className="absolute -bottom-1.5 left-0 w-full h-[8px]"
                    viewBox="0 0 240 10"
                    fill="none"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M3 7C20 3 45 8 80 4C115 0 150 7 180 3C200 1 225 6 237 4"
                      stroke="var(--color-secondary-container)"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </em>
              </motion.p>
            </div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
            >
              <a
                href="#book"
                className="inline-block bg-[var(--color-secondary-container)] text-[var(--color-primary)] px-10 py-4 rounded-md font-bold text-lg shadow-[0_18px_40px_rgba(255,142,59,0.18)] hover:bg-[#ffa05a] transition-colors"
              >
                Book a call
              </a>
            </motion.div>

            {/* Pilot - jumps to the pilot section */}
            <motion.a
              href="#offer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="group block max-w-lg rounded-xl bg-white/[0.07] px-6 py-5 ring-1 ring-white/10 backdrop-blur-md transition-colors hover:bg-white/[0.11]"
            >
              <span className="block text-lg md:text-xl font-extrabold text-[var(--color-paper)]">
                Run a pilot before you buy
              </span>
              <span className="mt-2 block text-[15px] leading-relaxed text-[var(--color-paper)]/70">
                First we get you 3 calls - then you decide if you want it.
              </span>
              <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-[var(--color-secondary-container)]">
                See how the pilot works
                <svg className="w-4 h-4 transition-transform duration-300 ease-out group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </motion.a>
          </div>

          {/* Right - the pipeline as planes: outreach (far), the reply thread (focal),
              the booked call (near). Far planes lag the scroll, so the scene converges
              on the calendar as it leaves. */}
          <motion.div
            initial="off"
            whileInView="on"
            viewport={{ once: true, amount: 0.15 }}
            variants={{
              off: { opacity: 0, y: 30 },
              on: { opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.2, ease: "easeOut" } },
            }}
            className="relative flex justify-center lg:justify-end lg:mb-[-3rem]"
          >
            <div
              ref={scene}
              role="img"
              aria-label="Outreach emails go out on your behalf, a prospect replies, we answer with your booking link, and an intro call lands on Thursday in your calendar."
              className="@container relative h-[550px] w-full max-w-[540px] mb-20 sm:h-[500px] lg:mb-0 lg:h-[600px] xl:h-[500px]"
            >
              <Plane depth={depth} shift={12} lag={20} className="absolute inset-x-[2%] top-2 sm:inset-x-[4%] sm:top-4">
                <SentLedger />
              </Plane>

              {/* top = ledger top + its 216px height - 16px of overlap */}
              <Plane depth={depth} shift={24} lag={8} className="absolute -right-[3%] top-[208px] flex w-[86%] flex-col items-end gap-2.5 sm:top-[216px] sm:w-[76%]">
                <Reply />
                <Answer />
              </Plane>

              <Plane depth={depth} shift={38} lag={0} className="absolute -bottom-10 -left-3 sm:-bottom-8 md:-left-10 lg:-left-6 xl:-left-16">
                <Calendar />
              </Plane>
            </div>
          </motion.div>
        </div>

        {/* Front: near paper passes in front of everything, clipped to the hero */}
        <motion.div initial="off" animate="on" aria-hidden="true" className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
          {paper("near")}
        </motion.div>
      </section>
    </MotionConfig>
  );
}

/* ─── Depth plane ─── */
type Depth = {
  x: MotionValue<number>;
  y: MotionValue<number>;
  scroll: MotionValue<number>;
  on: boolean;
};

// shift: pointer travel in px (nearer planes move more).
// lag: how far the plane falls behind the scroll, in % of the scene width (cqw; outside
// the scene that resolves to the viewport), so phones get proportionally less travel.
// Negative lag runs ahead of the scroll. spin: degrees turned across the exit.
function Plane({
  depth,
  shift,
  lag,
  spin = 0,
  className,
  children,
}: {
  depth: Depth;
  shift: number;
  lag: number;
  spin?: number;
  className: string;
  children: ReactNode;
}) {
  const k = depth.on ? 1 : 0;
  const x = useTransform(depth.x, (v) => v * -shift * k);
  const py = useTransform(depth.y, (v) => v * -shift * k);
  const sy = useTransform(depth.scroll, (v) => v * lag * k);
  const rotate = useTransform(depth.scroll, (v) => v * spin * k);
  const y = useMotionTemplate`calc(${py}px + ${sy}cqw)`;
  return (
    <motion.div style={{ x, y, rotate }} className={className}>
      {children}
    </motion.div>
  );
}

/* ─── Far: outreach ledger ─── */
// ponytail: roles and clock times only - no names, companies or dates to go stale.
const SENT = [
  ["Head of Sales", "8:02"],
  ["Managing Director", "8:05"],
  ["COO", "8:09"],
  ["Founder", "8:14"],
  ["VP Operations", "8:20"],
] as const;
const REPLIED = 2; // the COO

function SentLedger() {
  return (
    <div className="rounded-2xl bg-[var(--color-paper)]/[0.93] px-4 pb-2.5 pt-4 shadow-[0_30px_60px_rgba(5,12,20,0.35)] sm:px-5">
      <div className="flex items-baseline justify-between gap-3 px-1">
        <span className="font-serif text-[15px] font-bold text-[var(--color-primary)]">Outreach</span>
        <span className="text-[11px] text-[var(--color-on-surface-variant)]">Sent on your behalf</span>
      </div>
      <ul className="mt-2">
        {SENT.map(([role, time], i) => (
          <motion.li
            key={role}
            variants={step({ opacity: 0, y: 8 }, { opacity: 1, y: 0 }, T.rows + i * 0.1)}
            className="relative flex items-center gap-2 px-1 py-[7px] text-[12px] text-[var(--color-on-surface-variant)]"
          >
            {i === REPLIED && (
              <motion.span
                variants={step({ opacity: 0 }, { opacity: 1 }, T.replied, 0.4)}
                className="absolute inset-y-0.5 -inset-x-1.5 rounded-md bg-[var(--color-secondary-fixed)]/70"
              />
            )}
            <span className="relative">To</span>
            <span className="relative whitespace-nowrap font-semibold text-[var(--color-primary)]">{role}</span>
            <span className="relative ml-auto hidden tabular-nums sm:inline">{time} AM</span>
            <span className="relative ml-auto w-[52px] text-right sm:ml-0">
              {i === REPLIED ? (
                <>
                  <motion.span
                    variants={step({ opacity: 1 }, { opacity: 0 }, T.replied, 0.2)}
                    className="absolute right-0"
                  >
                    Sent
                  </motion.span>
                  <motion.span
                    variants={step({ opacity: 0 }, { opacity: 1 }, T.replied + 0.1, 0.3)}
                    className="font-bold text-[var(--color-secondary)]"
                  >
                    Replied
                  </motion.span>
                </>
              ) : (
                "Sent"
              )}
            </span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

/* ─── Focal: the reply thread ─── */
const QUOTE = ["\u201CGood timing.", "Does Thursday at 10 work?\u201D"];
const QUOTE_CPS = 60;

function Reply() {
  return (
    <motion.div
      variants={step(
        { opacity: 0, y: -28, scale: 0.92, filter: "blur(10px)" },
        { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", transitionEnd: { filter: "none" } },
        T.reply,
        0.7,
      )}
      style={{ transformOrigin: "50% 0%" }}
      className="w-full rounded-2xl bg-white px-5 py-4 shadow-[0_30px_60px_rgba(5,12,20,0.4)] sm:px-6 sm:py-5"
    >
      <div className="flex items-baseline justify-between gap-3 text-[12px] text-[var(--color-on-surface-variant)]">
        <span>
          <span className="font-bold text-[var(--color-primary)]">COO</span> replied
        </span>
        <span className="tabular-nums">9:14 AM</span>
      </div>
      {/* cqw: the quote scales with the scene on phones so it always holds two lines */}
      <p className="mt-2.5 font-serif text-[5.6cqw] leading-snug text-[var(--color-primary)] sm:text-[1.5rem]">
        <span className="block indent-[-0.42em]">
          <Typed text={QUOTE[0]} at={T.type} cps={QUOTE_CPS} />
        </span>
        <span className="block">
          <Typed text={QUOTE[1]} at={T.type + QUOTE[0].length / QUOTE_CPS + 0.1} cps={QUOTE_CPS} />
        </span>
      </p>
    </motion.div>
  );
}

// Our answer, sent for the client. The link is the real one (#book); it stays out
// of the tab order because the scene is one role="img" and the CTA already covers it.
const ANSWER = "Great! Here is my ";
const ANSWER_CPS = 70;

function Answer() {
  return (
    <motion.div
      variants={step({ opacity: 0, y: 12, scale: 0.96 }, { opacity: 1, y: 0, scale: 1 }, T.answer, 0.45)}
      style={{ transformOrigin: "100% 100%" }}
      className="max-w-full rounded-2xl rounded-br-md bg-[var(--color-secondary-container)] px-5 py-3.5 text-[var(--color-primary)] shadow-[0_24px_50px_rgba(5,12,20,0.4)]"
    >
      <div className="flex items-baseline justify-between gap-6 text-[11px] text-[var(--color-primary)]/75">
        <span>Replied for you</span>
        <span className="tabular-nums">9:16 AM</span>
      </div>
      <p className="mt-1 whitespace-nowrap font-serif text-[4.9cqw] leading-snug sm:text-[1.15rem]">
        <Typed text={ANSWER} at={T.answer + 0.2} cps={ANSWER_CPS} />
        <a
          href="#book"
          tabIndex={-1}
          className="font-semibold underline decoration-[var(--color-primary)]/60 underline-offset-4 hover:decoration-[var(--color-primary)]"
        >
          <Typed text="booking link" at={T.answer + 0.2 + ANSWER.length / ANSWER_CPS} cps={ANSWER_CPS} />
        </a>
      </p>
    </motion.div>
  );
}

/* ─── Near: the booked call ─── */
// ponytail: no day-of-month anywhere - a hardcoded date goes stale and a live one
// can't be prerendered without a hydration mismatch. Day names never expire.
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const BOOKED_DAY = 3; // Thursday

function Calendar() {
  return (
    // Kicks in once the booking link is out: the card arrives, then Thursday fills.
    <motion.div
      variants={step({ opacity: 0, y: 24, scale: 0.94 }, { opacity: 1, y: 0, scale: 1 }, T.booked, 0.55)}
      style={{ transformOrigin: "0% 100%" }}
      className="w-64 overflow-hidden rounded-2xl bg-white shadow-[0_28px_60px_rgba(5,12,20,0.4)]"
    >
      {/* Header */}
      <div className="px-5 pt-4 pb-3 flex items-center justify-between">
        <span className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider">
          This week
        </span>
        <motion.div
          variants={step({ opacity: 0 }, { opacity: 1 }, T.booked + 0.6, 0.4)}
          className="flex items-center gap-1.5"
        >
          <div className="w-2 h-2 rounded-full bg-[var(--color-secondary)]" />
          <span className="text-[10px] font-medium text-[var(--color-on-surface-variant)]">
            1 new booking
          </span>
        </motion.div>
      </div>

      {/* Days row */}
      <div className="px-4 pb-3 grid grid-cols-5 gap-1">
        {DAYS.map((day, i) => (
          <div
            key={day}
            className="relative h-9 rounded-lg flex items-center justify-center text-[11px] font-semibold text-[var(--color-on-surface-variant)]"
          >
            {day}
            {i === BOOKED_DAY && (
              <motion.span
                variants={step({ opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1 }, T.booked + 0.35, 0.45)}
                className="absolute inset-0 rounded-lg bg-[var(--color-secondary)] text-white flex items-center justify-center"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                  <motion.path
                    variants={step({ pathLength: 0 }, { pathLength: 1 }, T.booked + 0.5, 0.35)}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </motion.span>
            )}
          </div>
        ))}
      </div>

      {/* Meeting strip */}
      <motion.div
        variants={step(
          { opacity: 0, clipPath: "inset(0 100% 0 0 round 8px)" },
          { opacity: 1, clipPath: "inset(0 0% 0 0 round 8px)" },
          T.booked + 0.45,
          0.55,
        )}
        className="mx-4 mb-4 bg-[var(--color-secondary)]/8 rounded-lg px-3 py-2.5 flex items-center gap-2.5"
      >
        <div className="w-1 h-8 rounded-full bg-[var(--color-secondary)]" />
        <div>
          <p className="text-[11px] font-bold text-[var(--color-primary)]">Intro call with the COO</p>
          <p className="text-[10px] text-[var(--color-on-surface-variant)]">Thursday · 10:00 AM</p>
        </div>
      </motion.div>
    </motion.div>
  );
}
