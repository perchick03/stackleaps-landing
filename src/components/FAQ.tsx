"use client";

import { useReveal } from "@/hooks/useReveal";

const faqs = [
  {
    question: "How fast can you get started?",
    answer:
      "We launch campaigns within 2 weeks of your onboarding call. Week 1 is research and list building. Week 2 is campaign setup and infrastructure. Week 3, emails go out and you start getting replies.",
  },
  {
    question: "What if the meetings aren't qualified?",
    answer:
      "We define your ideal buyer profile together before any emails are sent. Every prospect is researched and vetted against your criteria. If a meeting doesn't match your qualification standards, it doesn't count — and we keep working until you're satisfied.",
  },
  {
    question: "How many meetings can I expect?",
    answer:
      "It depends on your market and offer, but most campaigns generate 5-15 qualified meetings per month. Our pilot campaign delivered 7 booked calls from 1,200 prospects in just 10 days — with a 9% positive reply rate (industry average is 1-3%).",
  },
  {
    question: "Won't cold email hurt my brand?",
    answer:
      "Not when it's done right. We send personalized, relevant messages to people who genuinely need what you offer. No spam. No mass blasts. Our 9% positive reply rate proves people welcome these conversations. We also use dedicated sending infrastructure — your main domain stays untouched.",
  },
  {
    question: "What do I need to provide?",
    answer:
      "A 30-minute onboarding call to understand your business, your ideal buyer, and your offer. That's it. We handle everything else: prospect research, list building, email copy, infrastructure, campaign management, and meeting booking.",
  },
  {
    question: "What makes you different from other lead gen agencies?",
    answer:
      "Three things. First, we're engineers, not marketers — every campaign is built as a system, not guesswork. Second, we're transparent: you see our pricing, process, and results upfront. Third, we guarantee results. If we don't deliver qualified meetings, we keep working at no extra cost.",
  },
  {
    question: "Is there a long-term contract?",
    answer:
      "No. Month-to-month. Cancel anytime. We earn your business every single month. If you want even less commitment, start with our pay-per-meeting pilot — you only pay for qualified calls that actually land on your calendar.",
  },
];

export default function FAQ() {
  const ref = useReveal();

  return (
    <section className="relative py-24 md:py-32 border-t border-border bg-surface">
      <div ref={ref} className="reveal max-w-3xl mx-auto px-6">
        <div className="flex items-center gap-3 mb-6">
          <span className="font-mono text-sm text-accent tracking-widest uppercase">
            FAQ
          </span>
        </div>

        <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-16">
          Questions you&apos;re
          <br />
          probably asking.
        </h2>

        <div className="space-y-px">
          {faqs.map((faq) => (
            <details
              key={faq.question}
              className="group bg-background border border-border"
            >
              <summary className="flex items-center justify-between p-6 hover:bg-surface-2 transition-colors">
                <span className="font-semibold text-lg pr-8">
                  {faq.question}
                </span>
                <span className="faq-icon text-accent text-2xl font-light shrink-0 transition-transform duration-200">
                  +
                </span>
              </summary>
              <div className="px-6 pb-6 pt-2">
                <p className="text-text-secondary leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
