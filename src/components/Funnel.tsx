"use client";

import { motion, useInView } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

const stages = [
  {
    label: "Prospects",
    leftStat: "100%",
    leftDesc: "Everyone matching your ideal client profile",
    rightStat: "100%",
    rightDesc: "Verified decision-makers in your target markets",
  },
  {
    label: "Open Rate",
    leftStat: "50–70%",
    leftDesc: "Personalized subject lines that get noticed",
    rightStat: "50–70%",
    rightDesc: "Tested and optimized until we hit this benchmark",
  },
  {
    label: "Replies",
    leftStat: "5–20%",
    leftDesc: "Prospects responding to personalized outreach",
    rightStat: "5–20%",
    rightDesc: "Warm leads ready to discuss working with your destination",
  },
  {
    label: "Booked Calls",
    leftStat: "1–2%",
    leftDesc: "Qualified meetings on your calendar",
    rightStat: "1–2%",
    rightDesc: "Decision-makers who want to partner with you",
  },
];

const funnelWidths = [100, 78, 55, 35];

const FUNNEL_TOP_GAP = 120;
const STAGE_HEIGHT = 100;
const FUNNEL_TOTAL = FUNNEL_TOP_GAP + stages.length * STAGE_HEIGHT;

const FIRST_HIT_DELAY = 2000;
const STAGE_INTERVAL = 3500;

const PROFILE_IMAGES = [
  "/images/bubble-funnel/bubble-man1.jpg",
  "/images/bubble-funnel/bubble-woman1.jpg",
  "/images/bubble-funnel/bubble-man2.jpg",
  "/images/bubble-funnel/bubble-woman2.jpg",
  "/images/bubble-funnel/bubble-man3.jpg",
  "/images/bubble-funnel/bubble-woman3.jpg",
  "/images/bubble-funnel/bubble-man4.jpg",
];

export default function Funnel() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activeStage, setActiveStage] = useState(-1);

  useEffect(() => {
    if (!isInView) return;
    const timers: ReturnType<typeof setTimeout>[] = [];

    function runCycle() {
      setActiveStage(-1);
      stages.forEach((_, i) => {
        timers.push(
          setTimeout(() => setActiveStage(i), FIRST_HIT_DELAY + i * STAGE_INTERVAL)
        );
      });
    }

    runCycle();
    const cycleLength = FIRST_HIT_DELAY + stages.length * STAGE_INTERVAL + 4000;
    const loop = setInterval(runCycle, cycleLength);
    timers.push(loop);
    return () => timers.forEach(clearTimeout);
  }, [isInView]);

  return (
    <section className="py-20 md:py-32 bg-[var(--color-primary)] overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="text-center mb-12 md:mb-20">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[var(--color-secondary-container)] font-bold tracking-widest uppercase text-sm"
          >
            Our Process
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mt-4 leading-tight"
          >
            From Prospect List to Booked Meeting
          </motion.h2>
        </div>

        {/* ─── Desktop layout (lg+) ─── */}
        <div ref={ref} className="relative max-w-6xl mx-auto hidden lg:block">
          {isInView && <ContinuousBubbles />}

          <div style={{ height: FUNNEL_TOP_GAP }} />

          {/* SVG funnel outline */}
          <div
            className="absolute pointer-events-none z-0"
            style={{
              top: FUNNEL_TOP_GAP,
              left: "50%",
              transform: "translateX(-50%)",
              width: "clamp(220px, 38vw, 480px)",
              bottom: 0,
            }}
          >
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full" fill="none">
              <line x1="0" y1="18" x2="32.5" y2="97" stroke="rgba(255,255,255,0.12)" strokeWidth="0.3" />
              <line x1="100" y1="18" x2="67.5" y2="97" stroke="rgba(255,255,255,0.12)" strokeWidth="0.3" />
            </svg>
          </div>

          <div className="flex flex-col gap-6 relative z-[1]">
            {stages.map((stage, i) => {
              const isActive = activeStage >= i;
              const isCurrently = activeStage === i;
              const w = funnelWidths[i];

              return (
                <div key={stage.label}>
                  <div className="grid grid-cols-[1fr_auto_1fr] items-stretch gap-6">
                    {/* Left stat card */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.15 }}
                      className="flex justify-end"
                    >
                      <StatCard stat={stage.leftStat} desc={stage.leftDesc} isActive={isActive} />
                    </motion.div>

                    {/* Center funnel */}
                    <FunnelBar stage={stage} index={i} isActive={isActive} isCurrently={isCurrently} width={w} activeStage={activeStage} />

                    {/* Right stat card */}
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.15 }}
                      className="flex justify-start"
                    >
                      <StatCard stat={stage.rightStat} desc={stage.rightDesc} isActive={isActive} />
                    </motion.div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ─── Mobile layout (< lg) ─── */}
        <div className="lg:hidden">
          <div className="flex flex-col items-center gap-2">
            {stages.map((stage, i) => {
              const isActive = activeStage >= i;
              const isCurrently = activeStage === i;
              const w = funnelWidths[i];

              return (
                <motion.div
                  key={stage.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="w-full flex flex-col items-center"
                >
                  {/* Connector */}
                  {i > 0 && (
                    <div
                      className={`w-0.5 h-6 transition-colors duration-1000 ${
                        isActive ? "bg-[var(--color-secondary-container)]" : "bg-white/15"
                      }`}
                    />
                  )}

                  {/* Stage bar */}
                  <div
                    className={`relative py-4 text-center font-bold text-sm tracking-wide uppercase transition-all duration-1000 ${
                      isCurrently
                        ? "bg-white text-[var(--color-primary)]"
                        : isActive
                        ? "bg-white/20 text-white"
                        : "bg-white/8 text-white/40"
                    }`}
                    style={{
                      width: `${w}%`,
                      maxWidth: 360,
                      borderRadius:
                        i === 0
                          ? "1rem 1rem 0.25rem 0.25rem"
                          : i === stages.length - 1
                          ? "0.25rem 0.25rem 1rem 1rem"
                          : "0.25rem",
                    }}
                  >
                    {isCurrently && (
                      <motion.div
                        initial={{ opacity: 0.4, scale: 1 }}
                        animate={{ opacity: 0, scale: 1.06 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                        className="absolute inset-0 bg-white rounded-[inherit]"
                      />
                    )}
                    <span className="relative z-10">{stage.label}</span>
                  </div>

                  {/* Stat row - both cards side by side */}
                  <div className="flex gap-3 mt-3 w-full max-w-[360px]">
                    <div
                      className={`flex-1 rounded-lg p-3 border transition-all duration-1000 ${
                        isActive
                          ? "bg-white/15 border-white/30"
                          : "bg-white/5 border-white/10"
                      }`}
                    >
                      <span
                        className={`text-xl font-extrabold block transition-colors duration-1000 ${
                          isActive ? "text-[var(--color-secondary-container)]" : "text-white/30"
                        }`}
                      >
                        {stage.leftStat}
                      </span>
                      <p className="text-white/60 text-xs mt-1 leading-snug">
                        {stage.leftDesc}
                      </p>
                    </div>
                    <div
                      className={`flex-1 rounded-lg p-3 border transition-all duration-1000 ${
                        isActive
                          ? "bg-white/15 border-white/30"
                          : "bg-white/5 border-white/10"
                      }`}
                    >
                      <span
                        className={`text-xl font-extrabold block transition-colors duration-1000 ${
                          isActive ? "text-[var(--color-secondary-container)]" : "text-white/30"
                        }`}
                      >
                        {stage.rightStat}
                      </span>
                      <p className="text-white/60 text-xs mt-1 leading-snug">
                        {stage.rightDesc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Shared components ─── */

function StatCard({ stat, desc, isActive }: { stat: string; desc: string; isActive: boolean }) {
  return (
    <div
      className={`rounded-xl p-4 md:p-5 w-[260px] h-full flex flex-col justify-center border transition-all duration-1000 ${
        isActive
          ? "bg-white/15 border-white/30"
          : "bg-white/5 border-white/10"
      }`}
    >
      <span
        className={`text-2xl md:text-3xl font-extrabold block transition-colors duration-1000 ${
          isActive ? "text-[var(--color-secondary-container)]" : "text-white/30"
        }`}
      >
        {stat}
      </span>
      <p className="text-white/60 text-xs md:text-sm mt-1 leading-snug">
        {desc}
      </p>
    </div>
  );
}

function FunnelBar({
  stage,
  index: i,
  isActive,
  isCurrently,
  width: w,
  activeStage,
}: {
  stage: typeof stages[number];
  index: number;
  isActive: boolean;
  isCurrently: boolean;
  width: number;
  activeStage: number;
}) {
  return (
    <div
      className="flex flex-col items-center"
      style={{ width: "clamp(220px, 38vw, 480px)" }}
    >
      {i > 0 && (
        <div
          className={`w-0.5 h-8 transition-colors duration-1000 ${
            isActive ? "bg-[var(--color-secondary-container)]" : "bg-white/15"
          }`}
        />
      )}
      <div
        data-funnel-stage={i}
        className={`relative py-5 md:py-6 text-center font-bold text-base md:text-lg tracking-wide uppercase transition-all duration-1000 ${
          isCurrently
            ? "bg-white text-[var(--color-primary)]"
            : isActive
            ? "bg-white/20 text-white"
            : "bg-white/8 text-white/40"
        }`}
        style={{
          width: `${w}%`,
          borderRadius:
            i === 0
              ? "1rem 1rem 0.25rem 0.25rem"
              : i === stages.length - 1
              ? "0.25rem 0.25rem 1rem 1rem"
              : "0.25rem",
        }}
      >
        {isCurrently && (
          <motion.div
            initial={{ opacity: 0.4, scale: 1 }}
            animate={{ opacity: 0, scale: 1.06 }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
            className="absolute inset-0 bg-white rounded-[inherit]"
          />
        )}
        <span className="relative z-10">{stage.label}</span>
      </div>
      {i < stages.length - 1 && (
        <div
          className={`w-0.5 h-8 transition-colors duration-1000 ${
            activeStage > i ? "bg-[var(--color-secondary-container)]" : "bg-white/15"
          }`}
        />
      )}
    </div>
  );
}

/* ─── Continuous random profile bubbles (desktop only) ─── */

interface Bubble {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
  drift: number;
  profileIndex: number;
}

function ContinuousBubbles() {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const idRef = useRef(0);

  const spawnBubble = useCallback((initialDelay = 0): Bubble => {
    idRef.current += 1;
    return {
      id: idRef.current,
      x: (Math.random() - 0.5) * 140,
      size: 44 + Math.random() * 20,
      duration: 5 + Math.random() * 3,
      delay: initialDelay,
      opacity: 0.6 + Math.random() * 0.35,
      drift: (Math.random() - 0.5) * 50,
      profileIndex: Math.floor(Math.random() * PROFILE_IMAGES.length),
    };
  }, []);

  useEffect(() => {
    const initial: Bubble[] = [];
    for (let i = 0; i < 5; i++) {
      initial.push(spawnBubble(Math.random() * 4));
    }
    setBubbles(initial);

    let mounted = true;
    function scheduleNext() {
      if (!mounted) return;
      const wait = 1000 + Math.random() * 2000;
      setTimeout(() => {
        if (!mounted) return;
        setBubbles((prev) => {
          const cleaned = prev.length > 10 ? prev.slice(-7) : prev;
          return [...cleaned, spawnBubble()];
        });
        scheduleNext();
      }, wait);
    }
    scheduleNext();

    return () => { mounted = false; };
  }, [spawnBubble]);

  return (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
      {bubbles.map((b) => (
        <motion.div
          key={b.id}
          initial={{
            opacity: 0,
            y: -40,
            scale: 0.4,
          }}
          animate={{
            opacity: [0, b.opacity, b.opacity, b.opacity * 0.6, 0],
            y: [-40, FUNNEL_TOTAL + 40],
            scale: [0.4, 1, 0.9, 0.75, 0.5],
          }}
          transition={{
            duration: b.duration,
            delay: b.delay,
            ease: [0.25, 0.1, 0.25, 1],
            times: [0, 0.15, 0.5, 0.8, 1],
          }}
          className="absolute"
          style={{
            left: `calc(50% + ${b.x}px)`,
            top: 0,
            marginLeft: -b.size / 2,
          }}
        >
          <div
            className="rounded-full overflow-hidden border-2 border-white/40"
            style={{
              width: b.size,
              height: b.size,
              boxShadow: `0 0 ${b.size * 0.5}px rgba(255,255,255,0.15)`,
            }}
          >
            <Image
              src={PROFILE_IMAGES[b.profileIndex]}
              alt=""
              width={64}
              height={64}
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
