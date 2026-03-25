"use client";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Grid pattern background */}
      <div className="absolute inset-0 grid-pattern opacity-30" />

      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,255,136,0.08)_0%,transparent_70%)]" />

      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 py-24 md:py-32">
        <div className="stagger">
          {/* Eyebrow */}
          <div className="animate-reveal flex items-center gap-3 mb-8">
            <div className="h-px w-12 bg-accent" />
            <span className="text-accent font-mono text-sm tracking-widest uppercase">
              Cold Email Outreach Agency
            </span>
          </div>

          {/* Main headline */}
          <h1 className="animate-reveal text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95] tracking-tight mb-8">
            We Book
            <br />
            <span className="text-accent">Qualified Meetings.</span>
            <br />
            <span className="text-text-secondary">You Close Deals.</span>
          </h1>

          {/* Subheadline */}
          <p className="animate-reveal text-lg md:text-xl text-text-secondary max-w-xl mb-12 leading-relaxed">
            Done-for-you cold email campaigns that fill your calendar with
            decision-makers who actually want to talk. No guesswork. No
            spray-and-pray.
          </p>

          {/* CTA + trust signal */}
          <div className="animate-reveal flex flex-col sm:flex-row items-start gap-6">
            <a
              href="#book"
              className="cta-glow inline-flex items-center gap-3 bg-accent text-background font-semibold text-lg px-8 py-4 rounded-sm hover:bg-accent-dim transition-colors"
            >
              Book a Free Strategy Call
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
            <div className="flex items-center gap-2 text-muted text-sm">
              <svg
                className="w-4 h-4 text-accent"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Meetings guaranteed or we keep working for free
            </div>
          </div>
        </div>

        {/* Proof stats bar */}
        <div className="mt-24 pt-12 border-t border-border">
          <div className="grid grid-cols-3 gap-8 stagger">
            <div className="animate-reveal">
              <div className="font-mono text-4xl md:text-5xl font-bold text-accent">
                7
              </div>
              <div className="text-muted text-sm mt-1">
                Calls booked in 10 days
              </div>
            </div>
            <div className="animate-reveal">
              <div className="font-mono text-4xl md:text-5xl font-bold text-foreground">
                9%
              </div>
              <div className="text-muted text-sm mt-1">
                Positive reply rate
              </div>
            </div>
            <div className="animate-reveal">
              <div className="font-mono text-4xl md:text-5xl font-bold text-foreground">
                1-3%
              </div>
              <div className="text-muted text-sm mt-1">
                Industry average
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted animate-bounce">
        <span className="text-xs font-mono tracking-widest uppercase">
          Scroll
        </span>
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}
