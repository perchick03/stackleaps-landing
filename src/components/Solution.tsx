"use client";

import { motion } from "framer-motion";

const benefits = [
  {
    number: "01",
    title: "We find the right partners in your target markets",
    body: "Vetted tour operators, travel advisors, and event planners — matched to your destination, your niche, and the type of groups you want.",
  },
  {
    number: "02",
    title: "We reach out on your behalf — personalized, not spam",
    body: "Every message is tailored to the operator and your destination. No templates. No mass blasts. The kind of outreach that gets replies.",
  },
  {
    number: "03",
    title: "Qualified introductions land on your calendar",
    body: "We handle everything from first contact to booking. You show up to the call with a partner who's already interested in what you offer.",
  },
];

export default function Solution() {
  return (
    <section id="solution" className="py-24 md:py-32 bg-white">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-16 lg:gap-24 items-start">
          {/* Left — sticky headline */}
          <div className="lg:sticky lg:top-32">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-[var(--color-secondary)] font-bold tracking-widest uppercase text-sm"
            >
              The Solution
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[var(--color-primary)] mt-4 leading-tight"
            >
              We Do the Outreach. You Take the Meetings.
            </motion.h2>
          </div>

          {/* Right — benefit cards */}
          <div className="flex flex-col gap-8">
            {benefits.map((b, i) => (
              <motion.div
                key={b.number}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group bg-[var(--color-surface-low)] rounded-xl p-8 md:p-10 hover:bg-[var(--color-surface-lowest)] hover:shadow-ambient transition-all duration-300"
              >
                <div className="flex items-start gap-6">
                  <span className="text-4xl font-black text-[var(--color-outline-variant)]/30 group-hover:text-[var(--color-secondary)]/40 transition-colors shrink-0">
                    {b.number}
                  </span>
                  <div>
                    <h3 className="text-xl font-bold text-[var(--color-primary)] mb-3">
                      {b.title}
                    </h3>
                    <p className="text-[var(--color-on-surface-variant)] leading-relaxed">
                      {b.body}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
