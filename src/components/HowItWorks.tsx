"use client";

import { motion } from "framer-motion";

const steps = [
  {
    step: "1",
    title: "We learn your destination",
    body: "30-minute onboarding call. We understand your destination, your ideal partners, your specialization, and the source markets you want to grow in.",
  },
  {
    step: "2",
    title: "We build your campaign",
    body: "We research and curate a list of operators in your target markets, write personalized outreach, and set up the infrastructure.",
  },
  {
    step: "3",
    title: "Outreach goes live",
    body: "Your destination gets in front of the right people. Qualified responses come in. Meetings get booked on your calendar.",
  },
  {
    step: "4",
    title: "We optimize what's working",
    body: "We track results, refine targeting, and double down on what converts. Your pipeline grows over time.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 md:py-32 bg-[var(--color-primary)] text-white">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="max-w-2xl mb-16 md:mb-20">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[var(--color-secondary-container)] font-bold tracking-widest uppercase text-sm"
          >
            How It Works
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold mt-4 leading-tight"
          >
            From Onboarding to Meetings in Weeks
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6">
          {steps.map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative"
            >
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-white/15 -translate-x-4" />
              )}
              <div className="flex flex-col gap-5">
                <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-2xl font-black text-[var(--color-secondary-container)]">
                  {s.step}
                </div>
                <h3 className="text-xl font-bold">{s.title}</h3>
                <p className="text-white/70 leading-relaxed">{s.body}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 md:mt-20"
        >
          <a
            href="#book"
            className="inline-block bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-secondary-container)] text-white px-10 py-4 rounded-md font-bold text-lg hover:opacity-90 transition-opacity"
          >
            Book a Free Strategy Call
          </a>
        </motion.div>
      </div>
    </section>
  );
}
