"use client";

import { motion } from "framer-motion";

export default function FinalCTA() {
  return (
    <section id="book" className="py-24 md:py-32 bg-[var(--color-primary)]">
      <div className="max-w-3xl mx-auto px-6 md:px-10 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight"
        >
          Ready to Meet Your Next Partner?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mt-6 text-xl text-white/80 max-w-xl mx-auto"
        >
          Book a free 30-minute strategy call. We&apos;ll discuss your destination, your ideal partners, and whether this is the right fit. Free 30-min call -{" "}
          <span className="relative inline-block">
            one DMC operator to another.
            <svg className="absolute -bottom-1 left-0 w-full h-[8px]" viewBox="0 0 240 10" fill="none" preserveAspectRatio="none">
              <path d="M3 7C20 3 45 8 80 4C115 0 150 7 180 3C200 1 225 6 237 4" stroke="var(--color-secondary-container)" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </span>
        </motion.p>

        {/* Calendly embed placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-12 bg-white rounded-2xl p-2 shadow-ambient max-w-2xl mx-auto"
        >
          <iframe
            src="https://calendly.com/stackleaps/30min?hide_gdpr_banner=1"
            className="w-full rounded-xl"
            style={{ minHeight: 900, border: "none" }}
            title="Book a Strategy Call"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-8 space-y-2 text-sm"
        >
          <p className="text-white/70 font-semibold">
            7 quality introductions in 10 days - built for our own DMC
          </p>
          <p className="text-white/50">
            One DMC per destination - no conflicts
          </p>
        </motion.div>
      </div>
    </section>
  );
}
