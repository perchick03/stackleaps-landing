"use client";

import { useReveal } from "@/hooks/useReveal";

const differentiators = [
  {
    label: "Hyper-targeted",
    description:
      "We don't blast 10,000 emails and hope. We send 200 carefully researched messages to exactly the right people.",
  },
  {
    label: "Done-for-you",
    description:
      "List building, email infrastructure, copywriting, campaign execution, follow-ups — all handled. You just show up to calls.",
  },
  {
    label: "Engineered",
    description:
      "Built by a senior software engineer, not a marketing agency. Every workflow is automated, tested, and optimized with data.",
  },
];

export default function Solution() {
  const ref = useReveal();

  return (
    <section className="relative py-24 md:py-32 border-t border-border">
      {/* Subtle gradient accent */}
      <div className="absolute top-0 left-0 w-full h-px gradient-line" />

      <div ref={ref} className="reveal max-w-5xl mx-auto px-6">
        <div className="flex items-center gap-3 mb-6">
          <span className="font-mono text-sm text-accent tracking-widest uppercase">
            The Solution
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-16 items-start">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-6">
              The Pipeline
              <br />
              <span className="text-accent">Sprint</span>
            </h2>
            <p className="text-text-secondary text-lg leading-relaxed mb-8">
              A systematic, repeatable outreach engine that puts qualified
              buyers on your calendar every week. Not a campaign — a system.
            </p>
            <p className="text-text-secondary leading-relaxed">
              Most agencies send generic blasts to bought lists and call it
              &quot;lead generation.&quot; We build precision-targeted campaigns
              based on who your ideal buyer actually is, what they care about,
              and exactly when to reach them.
            </p>
          </div>

          <div className="space-y-px">
            {differentiators.map((item) => (
              <div
                key={item.label}
                className="bg-surface p-8 border-l-2 border-accent hover:bg-surface-2 transition-colors"
              >
                <h3 className="font-semibold text-lg mb-2">{item.label}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
