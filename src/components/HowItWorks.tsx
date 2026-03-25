"use client";

import { useReveal } from "@/hooks/useReveal";

const steps = [
  {
    week: "Week 1",
    title: "Strategy & Research",
    description:
      "30-minute onboarding call. We define your ideal buyer profile, research your market, and build a custom prospect list of decision-makers.",
    detail: "ICP definition + prospect list built",
  },
  {
    week: "Week 2",
    title: "Campaign Build",
    description:
      "We write personalized email sequences, set up sending infrastructure, and warm everything up. You review and approve.",
    detail: "Email sequences + infrastructure ready",
  },
  {
    week: "Week 3",
    title: "Launch & First Replies",
    description:
      "Campaign goes live. Targeted emails reach your ideal buyers. First qualified replies land within days, not weeks.",
    detail: "First qualified conversations",
  },
  {
    week: "Week 4+",
    title: "Optimize & Scale",
    description:
      "We analyze what's working, double down on winning angles, and continuously fill your calendar. You focus on closing.",
    detail: "Steady flow of booked meetings",
  },
];

export default function HowItWorks() {
  const ref = useReveal();

  return (
    <section className="relative py-24 md:py-32 border-t border-border bg-surface">
      <div ref={ref} className="reveal max-w-5xl mx-auto px-6">
        <div className="flex items-center gap-3 mb-6">
          <span className="font-mono text-sm text-accent tracking-widest uppercase">
            How It Works
          </span>
        </div>

        <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-6 max-w-3xl">
          From zero to qualified meetings
          <br />
          <span className="text-accent">in 3 weeks.</span>
        </h2>

        <p className="text-text-secondary text-lg mb-16 max-w-xl">
          No month-long onboarding. No &quot;comprehensive discovery
          phase.&quot; We move fast because your pipeline can&apos;t wait.
        </p>

        <div className="relative">
          {/* Vertical connector line */}
          <div className="absolute left-[39px] top-0 bottom-0 w-px bg-border hidden md:block" />

          <div className="space-y-2">
            {steps.map((step, index) => (
              <div
                key={step.week}
                className="relative grid md:grid-cols-[80px_1fr] gap-6 group"
              >
                {/* Timeline dot */}
                <div className="hidden md:flex items-start justify-center pt-8">
                  <div
                    className={`w-5 h-5 rounded-full border-2 z-10 transition-colors ${
                      index === 2
                        ? "bg-accent border-accent"
                        : "bg-background border-border group-hover:border-accent"
                    }`}
                  />
                </div>

                <div className="bg-background border border-border p-8 hover:border-accent/30 transition-colors">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="font-mono text-accent text-sm font-semibold">
                      {step.week}
                    </span>
                    <div className="h-px flex-1 bg-border" />
                    <span className="font-mono text-muted text-xs">
                      {step.detail}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-text-secondary leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mid-page CTA */}
        <div className="mt-16 text-center">
          <a
            href="#book"
            className="inline-flex items-center gap-3 border border-accent text-accent font-semibold px-8 py-4 rounded-sm hover:bg-accent hover:text-background transition-colors"
          >
            Start Your Pipeline Sprint
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
