const steps = [
  {
    title: "We build and run the campaign",
    body: "You cover the sending infrastructure to keep it live. During the pilot that is the only thing you pay for.",
  },
  {
    title: "We book you three calls",
    body: "Real buyers in your market, on your calendar. Those first three are free.",
  },
  {
    title: "Then you decide",
    body: "Three calls in you know whether this becomes a repeatable source of client calls, and which markets it opens for you. Keep going, or stop.",
  },
];

const assurances = [
  {
    lead: "If it isn't for you, you walk.",
    body: "No contract, no notice period, and nothing owed for the three calls we booked you.",
  },
  {
    lead: "Past the pilot you pay per booked call.",
    body: "Only calls that match the profile you approved are billable. We make our money when your calendar fills.",
  },
];

export default function Offer() {
  return (
    <section id="offer" className="py-24 md:py-32 bg-[var(--color-surface-low)]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-12 lg:gap-20">
        <div className="lg:sticky lg:top-32 self-start">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[var(--color-primary)] leading-tight">
            Start With a Pilot
          </h2>
          <p className="mt-6 text-lg md:text-xl text-[var(--color-on-surface-variant)] leading-relaxed">
            See whether outbound can become a repeatable source of client calls
            and reach markets you don&apos;t sell into today.{" "}
            <strong className="text-[var(--color-primary)] font-semibold">
              Run a pilot before you buy.
            </strong>
          </p>
        </div>

        <div className="bg-[var(--color-surface-lowest)] rounded-2xl p-8 sm:p-12 md:p-14 shadow-ambient">
          {/* The spine makes the three steps read as one sequence rather than
              three badges. Drawn once, behind the markers. */}
          <ol>
            {steps.map((step, i) => (
              <li
                key={step.title}
                className={`relative flex gap-6 ${i === steps.length - 1 ? "" : "pb-9 md:pb-10"}`}
              >
                {i < steps.length - 1 && (
                  <span
                    className="absolute left-[19px] top-11 bottom-0 w-px bg-[var(--color-outline-variant)]/45"
                    aria-hidden="true"
                  />
                )}
                <span className="relative z-[1] shrink-0 w-10 h-10 rounded-full bg-[var(--color-secondary)] text-white flex items-center justify-center font-serif text-lg font-semibold leading-none">
                  {i + 1}
                </span>
                <div className="pt-1.5">
                  <h3 className="text-lg md:text-xl font-bold text-[var(--color-primary)] leading-snug">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-[var(--color-on-surface-variant)] leading-relaxed max-w-[58ch]">
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-10 pt-9 border-t border-[var(--color-outline-variant)]/30 space-y-6">
            {assurances.map((a) => (
              <p
                key={a.lead}
                className="text-[var(--color-on-surface)] leading-relaxed max-w-[62ch]"
              >
                <strong className="text-[var(--color-primary)] font-semibold">
                  {a.lead}
                </strong>{" "}
                {a.body}
              </p>
            ))}
          </div>

          <div className="mt-10 pt-9 border-t border-[var(--color-outline-variant)]/30 flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-8">
            <a
              href="#book"
              className="shrink-0 inline-block text-center bg-[var(--color-secondary)] text-white px-9 py-4 rounded-md font-bold text-lg hover:opacity-90 transition-opacity"
            >
              Book a call
            </a>
            <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
              One client per niche - while you&apos;re with us we don&apos;t run
              this for a competitor in your market.
            </p>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}
