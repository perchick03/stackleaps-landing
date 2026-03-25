"use client";

import { useReveal } from "@/hooks/useReveal";
import CalendlyEmbed from "@/components/CalendlyEmbed";

const steps = [
  {
    number: "1",
    text: "Book a free 30-minute strategy call below",
  },
  {
    number: "2",
    text: "We'll audit your market and build a custom outreach plan",
  },
  {
    number: "3",
    text: "You'll receive a campaign proposal within 48 hours",
  },
];

export default function FinalCTA() {
  const ref = useReveal();

  return (
    <section
      id="book"
      className="relative py-24 md:py-32 border-t border-border"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(0,255,136,0.06)_0%,transparent_60%)]" />

      <div ref={ref} className="reveal relative z-10 max-w-3xl mx-auto px-6 text-center">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="h-px w-12 bg-accent" />
          <span className="font-mono text-sm text-accent tracking-widest uppercase">
            Let&apos;s Talk
          </span>
          <div className="h-px w-12 bg-accent" />
        </div>

        <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-6">
          Stop chasing leads.
          <br />
          <span className="text-accent">Start taking meetings.</span>
        </h2>

        <p className="text-text-secondary text-lg mb-12 max-w-xl mx-auto leading-relaxed">
          Your competitors are already filling their pipelines with cold email.
          Every week you wait is another week of empty calendar slots.
        </p>

        {/* Calendly inline embed */}
        <div className="mb-12">
          <CalendlyEmbed />
        </div>

        {/* What happens next */}
        <div className="text-left max-w-md mx-auto">
          <p className="text-sm font-mono text-accent uppercase tracking-widest mb-6">
            What happens next
          </p>
          <div className="space-y-4">
            {steps.map((step) => (
              <div key={step.number} className="flex items-start gap-4">
                <span className="shrink-0 w-8 h-8 rounded-full border border-accent flex items-center justify-center font-mono text-accent text-sm">
                  {step.number}
                </span>
                <p className="text-text-secondary text-sm pt-1">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer-like info */}
        <div className="mt-24 pt-8 border-t border-border">
          <p className="text-muted text-xs font-mono">
            &copy; {new Date().getFullYear()} StackLeaps. Built with precision.
          </p>
        </div>
      </div>
    </section>
  );
}
