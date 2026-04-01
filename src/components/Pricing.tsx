"use client";

import { motion } from "framer-motion";

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 md:py-32 bg-[var(--color-surface-low)]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[var(--color-secondary)] font-bold tracking-widest uppercase text-sm"
          >
            Pricing
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[var(--color-primary)] mt-4 leading-tight"
          >
            You Only Pay for Meetings That Happen
          </motion.h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto bg-[var(--color-surface-lowest)] rounded-2xl p-10 md:p-14 shadow-ambient"
        >
          <div className="text-center mb-10">
            <span className="text-5xl md:text-6xl font-extrabold text-[var(--color-primary)]">
              Pay-per-intro
            </span>
            <p className="mt-4 text-lg text-[var(--color-on-surface-variant)] max-w-md mx-auto">
              No retainer. No setup fee. No long-term contract. You only pay for qualified introductions that show up on your calendar.
            </p>
          </div>

          <div className="space-y-4 mb-10">
            {[
              "Qualified meetings booked directly on your calendar",
              "Personalized outreach — no templates, no mass blasts",
              "Dedicated campaign built for your destination",
              "Ongoing optimization and reporting",
              "One DMC per destination — no conflicts",
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <svg
                  className="w-5 h-5 text-[var(--color-secondary)] shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-[var(--color-on-surface)]">{item}</span>
              </div>
            ))}
          </div>

          <div className="text-center">
            <a
              href="#book"
              className="inline-block bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-secondary-container)] text-white px-10 py-4 rounded-md font-bold text-lg hover:opacity-90 transition-opacity"
            >
              Book a Free Strategy Call
            </a>
            <p className="mt-3 text-sm text-[var(--color-on-surface-variant)]/70">
              We&apos;ll cover exact pricing on the call based on your target markets
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
