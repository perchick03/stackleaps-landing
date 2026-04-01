"use client";

import { motion, useInView } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

const stages = [
  {
    label: "Prospects",
    leftStat: "100%",
    leftDesc: "Everyone who might be interested based on your ideal client profile",
    rightStat: "100%",
    rightDesc: "Full list of verified decision-makers in your target markets",
  },
  {
    label: "Open Rate",
    leftStat: "50–70%",
    leftDesc: "Personalized subject lines that get noticed in crowded inboxes",
    rightStat: "50–70%",
    rightDesc: "We test and optimize until open rates hit this benchmark",
  },
  {
    label: "Replies",
    leftStat: "5–20%",
    leftDesc: "Engaged prospects responding to personalized outreach content",
    rightStat: "5–20%",
    rightDesc: "Warm leads ready to discuss working with your destination",
  },
  {
    label: "Booked Calls",
    leftStat: "1–2%",
    leftDesc: "Qualified meetings booked directly on your calendar",
    rightStat: "1–2%",
    rightDesc: "Decision-makers who want to partner with you",
  },
];

const funnelWidths = [100, 75, 50, 32];

// Total funnel height in px (approximate: gap + 4 stages with connectors)
const FUNNEL_TOP_GAP = 120; // space above first stage where bubbles fall
const STAGE_HEIGHT = 100;   // each stage row height approx
const FUNNEL_TOTAL = FUNNEL_TOP_GAP + stages.length * STAGE_HEIGHT;

// When each stage activates: first bubble takes ~2s to reach stage 0,
// then each subsequent stage activates ~3.5s later
const FIRST_HIT_DELAY = 2000;
const STAGE_INTERVAL = 3500;

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
    <section className="py-24 md:py-32 bg-[var(--color-primary)] overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="text-center mb-16 md:mb-20">
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

        <div ref={ref} className="relative max-w-6xl mx-auto">
          {isInView && <ContinuousBubbles />}

          {/* Gap above funnel — bubbles fall through this space first */}
          <div style={{ height: FUNNEL_TOP_GAP }} />

          <div className="flex flex-col">
            {stages.map((stage, i) => {
              const isActive = activeStage >= i;
              const isCurrently = activeStage === i;
              const w = funnelWidths[i];

              return (
                <div key={stage.label}>
                  <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 md:gap-6">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.15 }}
                      className="flex justify-end"
                    >
                      <div
                        className={`rounded-xl p-4 md:p-5 max-w-[240px] w-full border transition-all duration-1000 ${
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
                          {stage.leftStat}
                        </span>
                        <p className="text-white/60 text-xs md:text-sm mt-1 leading-snug">
                          {stage.leftDesc}
                        </p>
                      </div>
                    </motion.div>

                    <div
                      className="flex flex-col items-center"
                      style={{ width: "clamp(180px, 35vw, 420px)" }}
                    >
                      {i > 0 && (
                        <div
                          className={`w-0.5 h-8 transition-colors duration-1000 ${
                            isActive ? "bg-[var(--color-secondary-container)]" : "bg-white/15"
                          }`}
                        />
                      )}
                      <div
                        className={`relative py-5 md:py-6 text-center font-bold text-sm md:text-base tracking-wide uppercase transition-all duration-1000 ${
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

                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.15 }}
                      className="flex justify-start"
                    >
                      <div
                        className={`rounded-xl p-4 md:p-5 max-w-[240px] w-full border transition-all duration-1000 ${
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
                          {stage.rightStat}
                        </span>
                        <p className="text-white/60 text-xs md:text-sm mt-1 leading-snug">
                          {stage.rightDesc}
                        </p>
                      </div>
                    </motion.div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Continuous random bubbles ─── */

interface Bubble {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
  drift: number;
}

function ContinuousBubbles() {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const idRef = useRef(0);

  const spawnBubble = useCallback((initialDelay = 0): Bubble => {
    idRef.current += 1;
    return {
      id: idRef.current,
      x: (Math.random() - 0.5) * 120,
      size: 14 + Math.random() * 10, // 14-24px diameter
      duration: 3.5 + Math.random() * 2.5, // 3.5-6s to fall through
      delay: initialDelay,
      opacity: 0.5 + Math.random() * 0.4, // 0.5-0.9
      drift: (Math.random() - 0.5) * 50,
    };
  }, []);

  useEffect(() => {
    // Initial wave — stagger across first few seconds
    const initial: Bubble[] = [];
    for (let i = 0; i < 8; i++) {
      initial.push(spawnBubble(Math.random() * 3));
    }
    setBubbles(initial);

    // Keep spawning at random intervals
    let mounted = true;
    function scheduleNext() {
      if (!mounted) return;
      const wait = 400 + Math.random() * 1200;
      setTimeout(() => {
        if (!mounted) return;
        setBubbles((prev) => {
          const cleaned = prev.length > 18 ? prev.slice(-12) : prev;
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
            ease: [0.25, 0.1, 0.25, 1], // smooth cubic
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
            className="rounded-full bg-[var(--color-secondary-container)] flex items-center justify-center"
            style={{
              width: b.size,
              height: b.size,
              boxShadow: `0 0 ${b.size * 0.8}px rgba(255,142,59,0.35)`,
            }}
          >
            <svg
              className="text-white"
              style={{ width: b.size * 0.55, height: b.size * 0.55 }}
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
