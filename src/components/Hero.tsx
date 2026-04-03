"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative overflow-hidden md:overflow-visible bg-white">
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
              We book the calls. You close the sales.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
              className="text-lg md:text-xl text-[var(--color-on-surface-variant)] font-light max-w-lg leading-relaxed"
            >
              We connect you with tour operators and travel advisors who
              want to work with your destination.
            </motion.p>
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
            className="space-y-3"
          >
            <a
              href="#book"
              className="inline-block bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-secondary-container)] text-white px-10 py-4 rounded-md font-bold text-lg shadow-ambient hover:opacity-90 transition-opacity"
            >
              Book a Free Strategy Call
            </a>
            <p className="text-sm text-[var(--color-on-surface-variant)]/70 font-medium pl-1">
              Free 30-min call
            </p>
          </motion.div>

          {/* Proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="pt-6 border-t border-[var(--color-outline-variant)]/20"
          >
            <span className="text-sm font-semibold text-[var(--color-primary)]">
              7 qualified introductions in 10 days - built for our own DMC
            </span>
          </motion.div>
        </div>

        {/* Right - Founder photo */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          className="relative flex justify-center lg:justify-end lg:mb-[-3rem]"
        >
          {/* Apricot arch behind image */}
          <div className="absolute -top-16 -right-8 w-[105%] h-[105%] bg-[var(--color-secondary-fixed)]/45 rounded-[2.5rem] -z-10" />

          <div className="relative w-full max-w-[540px] mb-20 sm:mb-24 lg:mb-0">
            <div className="relative overflow-hidden rounded-[2rem] aspect-[4/5] sm:aspect-square">
              <Image
                src="/images/peretz-hero.avif"
                alt="Peretz, founder of StackLeaps"
                fill
                sizes="(max-width: 768px) 100vw, 540px"
                className="object-cover"
                priority
              />
            </div>

            {/* Floating stats card */}
            <FloatingCard />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Floating Calendar Card ─── */
function FloatingCard() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const dates = [12, 13, 14, 15, 16];
  const bookedDay = 3; // Thursday

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.7, ease: "easeOut" }}
      className="absolute -bottom-14 -left-8 sm:-left-16"
    >
      <motion.div
        animate={{ y: [0, -14, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        className="bg-white rounded-2xl shadow-ambient border border-[var(--color-outline-variant)]/10 w-64 overflow-hidden"
      >
        {/* Header */}
        <div className="px-5 pt-4 pb-3 flex items-center justify-between">
          <span className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider">
            May 2026
          </span>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-[var(--color-secondary)]" />
            <span className="text-[10px] font-medium text-[var(--color-on-surface-variant)]">
              1 new booking
            </span>
          </div>
        </div>

        {/* Days row */}
        <div className="px-4 pb-3 grid grid-cols-5 gap-1">
          {days.map((day, i) => (
            <div key={day} className="flex flex-col items-center gap-1">
              <span className="text-[10px] font-medium text-[var(--color-on-surface-variant)]/60">
                {day}
              </span>
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-semibold transition-colors ${
                  i === bookedDay
                    ? "bg-[var(--color-secondary)] text-white"
                    : "text-[var(--color-on-surface-variant)]"
                }`}
              >
                {i === bookedDay ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  dates[i]
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Booked meeting strip */}
        <div className="mx-4 mb-4 bg-[var(--color-secondary)]/8 rounded-lg px-3 py-2.5 flex items-center gap-2.5">
          <div className="w-1 h-8 rounded-full bg-[var(--color-secondary)]" />
          <div>
            <p className="text-[11px] font-bold text-[var(--color-primary)]">
              UK Tour Operator
            </p>
            <p className="text-[10px] text-[var(--color-on-surface-variant)]">
              Thu 15 · 10:00 AM · Introduction call
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
