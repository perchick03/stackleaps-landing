"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const faqs = [
  {
    q: "How is this different from what marketing agencies offer?",
    a: "Most agencies run ads or social media. We do direct, personalized outreach to specific operators and planners in your target markets. Every conversation is with someone who's already a potential fit for your destination.",
  },
  {
    q: "Does cold outreach actually work in the travel industry?",
    a: "Yes — when it's relevant and personalized. We don't send mass emails. We reach the right person at the right company with a message about their business, not a generic pitch.",
  },
  {
    q: "What if my destination is too niche?",
    a: "That's actually an advantage. The more specific your destination or specialization, the easier it is to find operators who are looking for exactly that. Your niche is the offer.",
  },
  {
    q: "How much time do I need to invest?",
    a: "30 minutes for the onboarding call. After that, we handle everything. You just show up to the meetings we book.",
  },
  {
    q: "What if it doesn't work?",
    a: "You only pay for qualified introductions that actually happen. No retainer, no setup fee, no long-term contract. If we don't deliver, you don't pay.",
  },
  {
    q: "What does it cost?",
    a: "Our pilot is pay-per-introduction — you only pay for qualified meetings that show up on your calendar. No retainer, no minimum commitment. We'll cover exact pricing on the strategy call based on your target markets and volume.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 md:py-32 bg-white">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-16 lg:gap-24">
          {/* Left — heading */}
          <div className="lg:sticky lg:top-32 self-start">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-[var(--color-secondary)] font-bold tracking-widest uppercase text-sm"
            >
              FAQ
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[var(--color-primary)] mt-4 leading-tight"
            >
              Questions We Get Asked
            </motion.h2>
          </div>

          {/* Right — accordion */}
          <div className="flex flex-col">
            {faqs.map((faq, i) => {
              const isOpen = openIndex === i;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="border-b border-[var(--color-outline-variant)]/15"
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="w-full flex items-center justify-between py-6 text-left gap-4"
                  >
                    <span className="text-lg font-semibold text-[var(--color-primary)]">
                      {faq.q}
                    </span>
                    <motion.span
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-[var(--color-on-surface-variant)] shrink-0"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <p className="pb-6 text-[var(--color-on-surface-variant)] leading-relaxed max-w-2xl">
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
