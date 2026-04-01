"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const faqs = [
  {
    q: "Does cold outreach actually work in travel?",
    a: "Yes - when it's relevant and personalized. Every message is tailored to the operator and your destination. Not a mass blast.",
  },
  {
    q: "What if my destination is different from the Balkans?",
    a: "The methodology is destination-agnostic. Tour operators are always looking for ground partners. Your destination is the offer - we put it in front of the right people.",
  },
  {
    q: "What if I'm not happy with the results?",
    a: "Your first 3 introductions are your test drive. If the quality isn't there, keep the ICP report and walk away. No contract.",
  },
  {
    q: "You run a DMC - don't you compete with me?",
    a: "We're in the Balkans, and we only work with one DMC per destination. Your campaign data and strategy are completely confidential.",
  },
  {
    q: "Are there any hidden fees or contracts?",
    a: "$750/month covers your campaign infrastructure and management. $150 per meeting on top of that. No long-term contract - you can stop anytime after the pilot.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 md:py-32 bg-white">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-16 lg:gap-24">
          {/* Left - heading */}
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

          {/* Right - accordion */}
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
