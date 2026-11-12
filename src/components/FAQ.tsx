"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const faqs = [
  {
    q: "Does cold outreach actually work?",
    a: "Yes - when the offer fits the people we reach, it works well. That's why we start with a test and a pilot: to prove the fit before you scale.",
  },
  {
    q: "How do I know if cold outreach works for me?",
    a: "That's what the test campaign and the pilot are for. The 14-day test shows whether your market responds, at no cost. The 60-day pilot turns that response into booked calls with qualified clients.",
  },
  {
    q: "What if my niche is too specific?",
    a: "That's an advantage. The more specific your offer, the easier it is to find buyers looking for exactly that. Your niche is the wedge - we put your offer in front of the right people.",
  },
  {
    q: "What if I'm not happy with the results?",
    a: "That's what the free test is for. We run your first campaign for 14 days at no cost, so you see it works for your business before you pay anything. If it isn't there, you cancel.",
  },
  {
    q: "How long does it take to see results?",
    a: "That's exactly what the 60-day pilot is for: high volume, 4-5 angles, to find what books you calls with qualified clients. If you need more time or more reach, we can extend it to a 90-day pilot or raise the volume.",
  },
  {
    q: "Are there any hidden fees or contracts?",
    a: "No hidden fees. The test is free, and after it you can stop anytime.",
  },
  {
    q: "How much does it cost?",
    a: "The price is for the pilot, and it depends on your offer, the test results and how many people we need to reach. If this sounds interesting, let's jump on a quick call and work it out.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 md:py-32 bg-white">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-16 lg:gap-24">
          {/* Left - heading */}
          <div className="lg:sticky lg:top-32 self-start">
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[var(--color-primary)] leading-tight"
            >
              Questions We Get Asked
            </h2>
          </div>

          {/* Right - accordion */}
          <div className="flex flex-col">
            {faqs.map((faq, i) => {
              const isOpen = openIndex === i;
              return (
                <div
                  key={i}
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
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
