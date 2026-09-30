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
import { useRef, type ReactNode } from "react";

const EASE = [0.16, 1, 0.3, 1] as const;

// Load sequence (seconds): outreach goes out, one prospect replies, the call books.
// Plays once, then the scene rests.
const T = { rows: 0.55, replied: 1.3, reply: 1.45, booked: 2.2 };

// Each step hangs off the scene's "on" variant, so the sequence waits until the
// scene is on screen (on phones it sits below the copy).
const step = (off: TargetAndTransition, on: TargetAndTransition, delay: number, duration = 0.5): Variants => ({
  off,
  on: { ...on, transition: { duration, delay, ease: EASE } },
});

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

  return (
    // reducedMotion="user": transforms snap, opacity still carries the sequence.
    <MotionConfig reducedMotion="user">
      <section
        className="relative overflow-hidden md:overflow-visible bg-white"
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
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 w-full grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-16 items-center">
          {/* Left - Copy */}
          <div className="flex flex-col gap-10 py-20 md:py-28 lg:py-36">
            <div className="space-y-7">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="text-4xl sm:text-5xl lg:text-[3.25rem] xl:text-[3.75rem] font-extrabold text-[var(--color-primary)] leading-[1.08] tracking-tight"
              >
                We book your calls. You close the sales.
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
                className="text-lg md:text-xl text-[var(--color-on-surface-variant)] font-light max-w-lg leading-relaxed"
              >
                Pipeline that books meetings,{" "}
                <em className="relative inline-block italic text-[var(--color-primary)] font-normal">
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
                      stroke="var(--color-secondary)"
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
                className="inline-block bg-[var(--color-secondary)] text-white px-10 py-4 rounded-md font-bold text-lg shadow-ambient hover:opacity-90 transition-opacity"
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
              className="group block max-w-lg rounded-xl bg-[var(--color-secondary-fixed)]/45 px-6 py-5 transition-colors hover:bg-[var(--color-secondary-fixed)]/70"
            >
              <span className="block text-lg md:text-xl font-extrabold text-[var(--color-primary)]">
                Run a pilot before you buy
              </span>
              <span className="mt-2 block text-[15px] leading-relaxed text-[var(--color-on-surface-variant)]">
                First we get you 3 calls - then you decide if you want it.
              </span>
              <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-[var(--color-secondary)]">
                See how the pilot works
                <svg className="w-4 h-4 transition-transform duration-300 ease-out group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </motion.a>
          </div>

          {/* Right - the pipeline as three planes: outreach (far), the reply (focal),
              the booked call (near). Far planes lag the scroll, so the scene converges
              on the calendar as it leaves. */}
          <motion.div
            initial="off"
            whileInView="on"
            viewport={{ once: true, amount: 0.3 }}
            variants={{
              off: { opacity: 0, y: 30 },
              on: { opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.2, ease: "easeOut" } },
            }}
            className="relative flex justify-center lg:justify-end lg:mb-[-3rem]"
          >
            <div
              ref={scene}
              role="img"
              aria-label="Outreach emails go out on your behalf, a prospect replies, and an intro call lands on Thursday in your calendar."
              className="@container relative h-[460px] w-full max-w-[540px] mb-20 sm:h-[500px] lg:mb-0"
            >
              {/* Apricot window, lit from the top left - clips the far plane */}
              <div className="absolute inset-0 overflow-hidden rounded-[2.5rem] bg-[var(--color-secondary-fixed)] bg-[radial-gradient(110%_80%_at_10%_0%,rgba(255,255,255,0.6),transparent_62%)]">
                <Plane depth={depth} shift={12} lag={20} className="absolute inset-x-[5%] top-6 sm:inset-x-[7%] sm:top-9">
                  <SentLedger />
                </Plane>
              </div>

              {/* top = ledger top + its 216px height - 16px of overlap */}
              <Plane depth={depth} shift={24} lag={8} className="absolute -right-[3%] top-[224px] w-[86%] sm:top-[236px] sm:w-[76%]">
                <Reply />
              </Plane>

              <Plane depth={depth} shift={38} lag={0} className="absolute -bottom-10 -left-3 sm:-bottom-8 md:-left-10 lg:-left-6 xl:-left-16">
                <Calendar />
              </Plane>
            </div>
          </motion.div>
        </div>
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
// lag: how far the plane falls behind the scroll, in % of the scene width (cqw),
// so phones get proportionally less travel.
function Plane({
  depth,
  shift,
  lag,
  className,
  children,
}: {
  depth: Depth;
  shift: number;
  lag: number;
  className: string;
  children: ReactNode;
}) {
  const k = depth.on ? 1 : 0;
  const x = useTransform(depth.x, (v) => v * -shift * k);
  const py = useTransform(depth.y, (v) => v * -shift * k);
  const sy = useTransform(depth.scroll, (v) => v * lag * k);
  const y = useMotionTemplate`calc(${py}px + ${sy}cqw)`;
  return (
    <motion.div style={{ x, y }} className={className}>
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
    <div className="rounded-2xl bg-white/65 px-4 pb-2.5 pt-4 sm:px-5">
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

/* ─── Focal: the reply ─── */
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
      className="rounded-2xl bg-white px-5 py-4 shadow-ambient sm:px-6 sm:py-5"
    >
      <div className="flex items-baseline justify-between gap-3 text-[12px] text-[var(--color-on-surface-variant)]">
        <span>
          <span className="font-bold text-[var(--color-primary)]">COO</span> replied
        </span>
        <span className="tabular-nums">9:14 AM</span>
      </div>
      {/* cqw: the quote scales with the scene on phones so it always holds two lines */}
      <p className="mt-2.5 font-serif text-[5.6cqw] leading-snug text-[var(--color-primary)] sm:text-[1.5rem]">
        <span className="block indent-[-0.42em]">&ldquo;Good timing.</span>
        <span className="block">Does Thursday at 10 work?&rdquo;</span>
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
    <div className="w-64 overflow-hidden rounded-2xl bg-white shadow-[0_28px_60px_rgba(14,29,43,0.12)]">
      {/* Header */}
      <div className="px-5 pt-4 pb-3 flex items-center justify-between">
        <span className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider">
          This week
        </span>
        <motion.div
          variants={step({ opacity: 0 }, { opacity: 1 }, T.booked + 0.2, 0.4)}
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
                variants={step({ opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1 }, T.booked, 0.45)}
                className="absolute inset-0 rounded-lg bg-[var(--color-secondary)] text-white flex items-center justify-center"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                  <motion.path
                    variants={step({ pathLength: 0 }, { pathLength: 1 }, T.booked + 0.15, 0.35)}
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

      {/* Meeting strip: empty until the reply lands */}
      <div className="relative mx-4 mb-4">
        <motion.p
          variants={step({ opacity: 1 }, { opacity: 0 }, T.booked, 0.2)}
          className="absolute inset-0 flex items-center px-3 text-[11px] text-[var(--color-on-surface-variant)]"
        >
          Nothing booked yet
        </motion.p>
        <motion.div
          variants={step(
            { opacity: 0, clipPath: "inset(0 100% 0 0 round 8px)" },
            { opacity: 1, clipPath: "inset(0 0% 0 0 round 8px)" },
            T.booked + 0.1,
            0.55,
          )}
          className="bg-[var(--color-secondary)]/8 rounded-lg px-3 py-2.5 flex items-center gap-2.5"
        >
          <div className="w-1 h-8 rounded-full bg-[var(--color-secondary)]" />
          <div>
            <p className="text-[11px] font-bold text-[var(--color-primary)]">Intro call with the COO</p>
            <p className="text-[10px] text-[var(--color-on-surface-variant)]">Thursday · 10:00 AM</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
