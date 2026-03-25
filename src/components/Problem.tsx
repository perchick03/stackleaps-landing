"use client";

import { useReveal } from "@/hooks/useReveal";

const problems = [
  {
    number: "01",
    title: "Your pipeline is a guessing game",
    description:
      "One good month, two bad ones. You never know where the next client is coming from. Referrals are great — until they dry up.",
  },
  {
    number: "02",
    title: "Outreach eats your entire week",
    description:
      "You spend hours writing emails, researching prospects, and following up — only to hear crickets. Meanwhile, the actual work piles up.",
  },
  {
    number: "03",
    title: "Your competitors aren't waiting",
    description:
      "While you're at the same trade show hoping for a good conversation, they're booking 10 meetings a month from their desk. The game has changed.",
  },
];

export default function Problem() {
  const ref = useReveal();

  return (
    <section className="relative py-24 md:py-32 border-t border-border">
      <div ref={ref} className="reveal max-w-5xl mx-auto px-6">
        {/* Section label */}
        <div className="flex items-center gap-3 mb-6">
          <span className="font-mono text-sm text-accent tracking-widest uppercase">
            The Problem
          </span>
        </div>

        <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-16 max-w-3xl">
          Most B2B companies are{" "}
          <span className="text-text-secondary line-through decoration-muted">
            doing outreach
          </span>
          .
          <br />
          Almost none are{" "}
          <span className="text-accent">doing it right</span>.
        </h2>

        <div className="grid md:grid-cols-3 gap-px bg-border">
          {problems.map((problem) => (
            <div
              key={problem.number}
              className="bg-background p-8 md:p-10 group hover:bg-surface transition-colors"
            >
              <span className="font-mono text-accent text-sm">
                {problem.number}
              </span>
              <h3 className="text-xl font-semibold mt-4 mb-3">
                {problem.title}
              </h3>
              <p className="text-text-secondary leading-relaxed text-sm">
                {problem.description}
              </p>
            </div>
          ))}
        </div>

        <p className="text-center text-text-secondary text-lg mt-16 italic">
          Sound familiar? You&apos;re not alone. And it doesn&apos;t have to be
          this way.
        </p>
      </div>
    </section>
  );
}
