"use client";

import { motion } from "framer-motion";

const included = [
  "Partner Match Report - 50 best-fit operators mapped for your destination",
  "Done-for-you personalized outreach to operators in your target markets",
  "3 introductions to get started",
  "Destination exclusivity - we never work with a competing DMC in your area",
];

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
            The Offer
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[var(--color-primary)] mt-4 leading-tight"
          >
            The Partner Pipeline Pilot
          </motion.h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto bg-[var(--color-surface-lowest)] rounded-2xl p-10 md:p-14 shadow-ambient"
        >
          {/* What's included */}
          <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--color-on-surface-variant)]/60 mb-6">
            What&apos;s included
          </h3>
          <div className="space-y-4 mb-10">
            {included.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-[var(--color-secondary)] shrink-0 mt-0.5"
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

          {/* Pricing */}
          <div className="border-t border-[var(--color-outline-variant)]/20 pt-8 mb-10">
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-10">
              <div>
                <span className="text-3xl md:text-4xl font-extrabold text-[var(--color-primary)]">$750</span>
                <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">
                  Setup - ICP research + campaign infrastructure
                </p>
              </div>
              <div>
                <span className="text-3xl md:text-4xl font-extrabold text-[var(--color-primary)]">$150</span>
                <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">
                  Per booked meeting after that
                </p>
              </div>
            </div>
            <p className="mt-5 text-[var(--color-secondary)] font-semibold text-sm">
              You only pay when a meeting happens
            </p>
          </div>

          {/* Guarantee */}
          <div className="bg-[var(--color-surface-low)] rounded-xl p-6 mb-10">
            <p className="text-[var(--color-on-surface)] leading-relaxed">
              Your first 3 introductions are your test drive. If you&apos;re not happy with the quality - keep the ICP report, walk away. No contract, no commitment.
            </p>
          </div>

          {/* CTA */}
          <div className="text-center">
            <a
              href="#book"
              className="inline-block bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-secondary-container)] text-white px-10 py-4 rounded-md font-bold text-lg hover:opacity-90 transition-opacity"
            >
              Book a Free Strategy Call
            </a>
            <p className="mt-6 text-sm text-[var(--color-on-surface-variant)]/50">
              A single trade show booth costs $15,000-$40,000. This is less than 5%.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
