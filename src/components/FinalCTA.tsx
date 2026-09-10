export default function FinalCTA() {
  return (
    <section id="book" className="py-24 md:py-32 bg-[var(--color-primary)]">
      <div className="max-w-3xl mx-auto px-6 md:px-10 text-center">
        <h2
          className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight"
        >
          Ready to Meet Your Next Client?
        </h2>
        <p
          className="mt-6 text-xl text-white/80 max-w-xl mx-auto"
        >
          We&apos;ll go through your offer, your ideal customer, and whether outbound is the right fit for you -{" "}
          <span className="relative inline-block">
            one founder to another.
            <svg className="absolute -bottom-1 left-0 w-full h-[8px]" viewBox="0 0 240 10" fill="none" preserveAspectRatio="none">
              <path d="M3 7C20 3 45 8 80 4C115 0 150 7 180 3C200 1 225 6 237 4" stroke="var(--color-secondary-container)" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </span>
        </p>

        {/* Calendly embed placeholder */}
        <div
          className="mt-12 bg-white rounded-2xl p-2 shadow-ambient max-w-2xl mx-auto"
        >
          <iframe
            src="https://calendly.com/stackleaps/30min?hide_gdpr_banner=1"
            className="w-full rounded-xl h-[1100px] sm:h-[900px]"
            style={{ border: "none" }}
            title="Book a Strategy Call"
            loading="lazy"
          />
        </div>

        <div
          className="mt-8 space-y-2 text-sm"
        >
          <p className="text-white/70 font-semibold">
            Start with a pilot - your first three calls are free
          </p>
          <p className="text-white/50">
            One client per niche - no conflicts
          </p>
        </div>
      </div>
    </section>
  );
}
