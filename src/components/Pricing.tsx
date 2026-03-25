"use client";

import { useReveal } from "@/hooks/useReveal";

const included = [
  "Custom prospect list building",
  "Email infrastructure setup & warmup",
  "Personalized email sequence copywriting",
  "Campaign execution & daily management",
  "Reply handling & meeting booking",
  "Weekly performance reports",
  "Continuous A/B testing & optimization",
];

export default function Pricing() {
  const ref = useReveal();

  return (
    <section className="relative py-24 md:py-32 border-t border-border">
      <div ref={ref} className="reveal max-w-5xl mx-auto px-6">
        <div className="flex items-center gap-3 mb-6">
          <span className="font-mono text-sm text-accent tracking-widest uppercase">
            Investment
          </span>
        </div>

        <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-6 max-w-3xl">
          Transparent pricing.
          <br />
          <span className="text-accent">No surprises.</span>
        </h2>

        <p className="text-text-secondary text-lg mb-16 max-w-xl">
          Most agencies hide pricing behind &quot;Book a call.&quot; We
          don&apos;t. Here&apos;s what it costs — and exactly what you get.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Main pricing card */}
          <div className="border-2 border-accent p-8 md:p-10 relative">
            <div className="absolute -top-3 left-8 bg-accent text-background text-xs font-mono font-semibold px-3 py-1 uppercase tracking-wider">
              Most Popular
            </div>

            <div className="mb-8">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl md:text-6xl font-bold font-mono">
                  $2,500
                </span>
                <span className="text-text-secondary">/month</span>
              </div>
              <p className="text-muted text-sm mt-2">
                No setup fees. No long-term contract. Cancel anytime.
              </p>
            </div>

            <div className="space-y-4 mb-10">
              {included.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-accent shrink-0 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>

            <a
              href="#book"
              className="block text-center bg-accent text-background font-semibold px-8 py-4 rounded-sm hover:bg-accent-dim transition-colors"
            >
              Book a Free Strategy Call
            </a>
          </div>

          {/* Comparison card */}
          <div className="border border-border p-8 md:p-10 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-semibold mb-6">
                Compare that to...
              </h3>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="shrink-0 font-mono text-2xl font-bold text-text-secondary">
                    $20K
                  </div>
                  <div>
                    <p className="font-semibold">One trade show</p>
                    <p className="text-text-secondary text-sm">
                      Flights, hotel, booth, staff time — for 3 days of
                      hoping the right person walks by
                    </p>
                  </div>
                </div>

                <div className="h-px bg-border" />

                <div className="flex items-start gap-4">
                  <div className="shrink-0 font-mono text-2xl font-bold text-text-secondary">
                    $6K+
                  </div>
                  <div>
                    <p className="font-semibold">A full-time SDR</p>
                    <p className="text-text-secondary text-sm">
                      Salary, training, tools, management overhead — and
                      they still might not deliver
                    </p>
                  </div>
                </div>

                <div className="h-px bg-border" />

                <div className="flex items-start gap-4">
                  <div className="shrink-0 font-mono text-2xl font-bold text-accent">
                    $2.5K
                  </div>
                  <div>
                    <p className="font-semibold text-accent">StackLeaps</p>
                    <p className="text-text-secondary text-sm">
                      Qualified meetings on your calendar every week.
                      Guaranteed.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 p-4 bg-surface border border-border rounded-sm">
              <p className="text-sm text-text-secondary">
                <span className="text-accent font-semibold">Pilot option:</span>{" "}
                Not ready for a monthly commitment? Start with a pay-per-meeting
                pilot. $100–$150 per booked call. Zero risk.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
