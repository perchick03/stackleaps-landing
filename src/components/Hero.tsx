"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

export default function Hero() {
  const [videoOpen, setVideoOpen] = useState(false);

  return (
    <section className="relative overflow-hidden bg-white">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 w-full grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-16 items-center">
        {/* Left — Copy */}
        <div className="flex flex-col gap-10 py-20 md:py-28 lg:py-36">
          <div className="space-y-7">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-4xl sm:text-5xl lg:text-[3.25rem] xl:text-[3.75rem] font-extrabold text-[var(--color-primary)] leading-[1.08] tracking-tight"
            >
              Fill Your Calendar With Vetted Client Meetings
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
              className="text-lg md:text-xl text-[var(--color-on-surface-variant)] font-light max-w-lg leading-relaxed"
            >
              We find and reach out to tour operators, travel advisors, and
              event planners in your target markets — and book qualified
              introductions directly on your calendar.
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
              Free 30-min consultation — no commitment
            </p>
          </motion.div>

          {/* Proof + exclusivity */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row sm:items-center gap-4 pt-6 border-t border-[var(--color-outline-variant)]/20"
          >
            <span className="text-sm font-semibold text-[var(--color-primary)]">
              7 calls booked in 10 days
            </span>
            <span className="hidden sm:block w-1 h-1 rounded-full bg-[var(--color-outline)]" />
            <span className="text-sm text-[var(--color-on-surface-variant)]">
              One DMC per destination — no conflicts
            </span>
          </motion.div>
        </div>

        {/* Right — Image with arch, aligned to bottom */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          className="relative flex justify-center lg:justify-end lg:mb-[-3rem]"
        >
          {/* Apricot arch behind image */}
          <div className="absolute -top-16 -right-8 w-[105%] h-[105%] bg-[var(--color-secondary-fixed)]/45 rounded-[2.5rem] -z-10" />

          {/* Image + play button */}
          <div
            className="relative group cursor-pointer w-full max-w-[540px]"
            onClick={() => setVideoOpen(true)}
          >
            <div className="relative overflow-hidden rounded-[2rem] aspect-[3/4]">
              <Image
                src="/images/peretz.png"
                alt="Peretz, founder of StackLeaps"
                fill
                sizes="(max-width: 768px) 100vw, 540px"
                className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                priority
              />
              <div className="absolute inset-0 bg-[var(--color-primary)]/5 transition-opacity opacity-0 group-hover:opacity-100" />
            </div>

            {/* Play button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 bg-white/90 glass-effect rounded-full flex items-center justify-center shadow-ambient transition-transform duration-300 group-hover:scale-110">
                <svg
                  className="w-8 h-8 text-[var(--color-secondary)] ml-1"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>

            {/* Floating stats card */}
            <FloatingCard />
          </div>
        </motion.div>
      </div>

      {/* Video modal */}
      {videoOpen && <VideoModal onClose={() => setVideoOpen(false)} />}
    </section>
  );
}

/* ─── Floating Card ─── */
function FloatingCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.7, ease: "easeOut" }}
      className="absolute bottom-12 -left-16 sm:-left-24"
    >
      <motion.div
        animate={{ y: [0, -14, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        className="bg-white rounded-2xl p-7 shadow-ambient border border-[var(--color-outline-variant)]/10 w-80"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="relative w-14 h-14">
            <svg viewBox="0 0 36 36" className="w-14 h-14">
              <circle cx="18" cy="18" r="14" fill="none" stroke="#eef4ff" strokeWidth="4" />
              <circle
                cx="18" cy="18" r="14" fill="none"
                stroke="var(--color-secondary-container)"
                strokeWidth="4" strokeDasharray="66 22"
                strokeLinecap="round" transform="rotate(-90 18 18)"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-5 h-5 text-[var(--color-secondary)]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z" />
              </svg>
            </div>
          </div>
          <span className="text-sm font-bold text-[var(--color-primary)]">
            Qualified Meetings
          </span>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-[var(--color-secondary)]">Booking...</span>
            <span className="text-[var(--color-on-surface-variant)]">75%</span>
          </div>
          <div className="w-full h-2 bg-[var(--color-surface-low)] rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "75%" }}
              transition={{ duration: 1.2, delay: 1, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-secondary-container)]"
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Video Modal ─── */
function VideoModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-3xl mx-4 aspect-video rounded-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <video
          src="/images/peretz-intro.mp4"
          controls
          autoPlay
          className="w-full h-full object-cover bg-black"
        />
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 bg-black/50 glass-effect rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </motion.div>
    </div>
  );
}
