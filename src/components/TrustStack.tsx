"use client";

import { useReveal } from "@/hooks/useReveal";

const tools = [
  "Apollo",
  "Instantly",
  "n8n",
  "Calendly",
  "OpenAI",
];

export default function TrustStack() {
  const ref = useReveal();

  return (
    <section className="relative py-24 md:py-32 border-t border-border bg-surface noise">
      <div ref={ref} className="reveal relative z-10 max-w-5xl mx-auto px-6">
        <div className="flex items-center gap-3 mb-6">
          <span className="font-mono text-sm text-accent tracking-widest uppercase">
            Why Trust Us
          </span>
        </div>

        <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-16 max-w-3xl">
          No testimonials yet.
          <br />
          <span className="text-accent">Here&apos;s what we have instead.</span>
        </h2>

        <div className="grid md:grid-cols-2 gap-px bg-border">
          {/* Guarantee */}
          <div className="bg-background p-8 md:p-10">
            <div className="w-12 h-12 rounded-sm bg-accent/10 flex items-center justify-center mb-6">
              <svg
                className="w-6 h-6 text-accent"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">
              Performance Guarantee
            </h3>
            <p className="text-text-secondary leading-relaxed">
              If we don&apos;t deliver qualified meetings, we keep working at no
              extra cost. We&apos;re betting on ourselves because the system
              works.
            </p>
          </div>

          {/* ROI Math */}
          <div className="bg-background p-8 md:p-10">
            <div className="w-12 h-12 rounded-sm bg-accent/10 flex items-center justify-center mb-6">
              <svg
                className="w-6 h-6 text-accent"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">The Math</h3>
            <div className="space-y-2 font-mono text-sm">
              <div className="flex justify-between text-text-secondary">
                <span>10 meetings/month</span>
                <span className="text-foreground">booked</span>
              </div>
              <div className="flex justify-between text-text-secondary">
                <span>&times; 30% close rate</span>
                <span className="text-foreground">= 3 clients</span>
              </div>
              <div className="flex justify-between text-text-secondary">
                <span>&times; $10K avg deal</span>
                <span className="text-accent font-semibold">= $30K/mo</span>
              </div>
              <div className="h-px bg-border my-3" />
              <div className="flex justify-between text-text-secondary">
                <span>Your investment</span>
                <span className="text-foreground">$2,500/mo</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span className="text-accent">ROI</span>
                <span className="text-accent">12x return</span>
              </div>
            </div>
          </div>

          {/* Founder */}
          <div className="bg-background p-8 md:p-10">
            <div className="w-12 h-12 rounded-sm bg-accent/10 flex items-center justify-center mb-6">
              <svg
                className="w-6 h-6 text-accent"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">
              Built by an Engineer
            </h3>
            <p className="text-text-secondary leading-relaxed mb-4">
              Peretz Levinov — ex-senior software engineer ($250K/yr) who left
              tech to build outreach systems that actually work. Every campaign
              is engineered, not guessed.
            </p>
            <a
              href="https://www.linkedin.com/in/peretz-levinov/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-accent text-sm hover:underline"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              Connect on LinkedIn
            </a>
          </div>

          {/* Proof from pilot */}
          <div className="bg-background p-8 md:p-10">
            <div className="w-12 h-12 rounded-sm bg-accent/10 flex items-center justify-center mb-6">
              <svg
                className="w-6 h-6 text-accent"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Proven in the Field</h3>
            <p className="text-text-secondary leading-relaxed mb-4">
              Our pilot campaign delivered 7 qualified calls from 1,200
              prospects in 10 days. 4 moved to proposal stage. 9% positive
              reply rate — 3x the industry average.
            </p>
            <p className="text-muted text-sm italic">
              Real results. Real conversations. Real pipeline.
            </p>
          </div>
        </div>

        {/* Tool stack */}
        <div className="mt-16 text-center">
          <p className="text-muted text-sm font-mono uppercase tracking-widest mb-6">
            Built on
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8">
            {tools.map((tool) => (
              <span
                key={tool}
                className="text-text-secondary text-sm font-mono border border-border px-4 py-2 rounded-sm"
              >
                {tool}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
