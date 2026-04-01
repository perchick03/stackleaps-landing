"use client";

import { motion } from "framer-motion";

const qualifiers = [
  "You're a DMC that wants to grow your partner network but doesn't have time for outbound",
  "You want qualified introductions to tour operators, travel advisors, or event planners in specific source markets",
  "You'd rather focus on running your destination than chasing new business",
  "You want a done-for-you service — not another tool or platform to manage",
];

export default function WhoItsFor() {
  return (
    <section id="who-its-for" className="py-24 md:py-32 bg-white">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left */}
          <div>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-[var(--color-secondary)] font-bold tracking-widest uppercase text-sm"
            >
              Is This a Fit?
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[var(--color-primary)] mt-4 leading-tight"
            >
              Built for DMCs Who&apos;d Rather Close Than Chase
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mt-6 text-lg text-[var(--color-on-surface-variant)] leading-relaxed max-w-lg"
            >
              Whether you&apos;re a 5-person DMC in Montenegro or a 50-person MICE operator in Dubai — if this sounds like you, we should talk.
            </motion.p>
          </div>

          {/* Right — qualifier checklist */}
          <div className="flex flex-col gap-5">
            {qualifiers.map((q, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-4 bg-[var(--color-surface-low)] rounded-xl p-6"
              >
                <div className="shrink-0 w-8 h-8 rounded-lg bg-[var(--color-secondary)]/10 flex items-center justify-center mt-0.5">
                  <svg
                    className="w-5 h-5 text-[var(--color-secondary)]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-[var(--color-on-surface)] font-medium leading-relaxed">
                  {q}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
