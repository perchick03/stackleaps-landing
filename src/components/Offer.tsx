const steps = [
  {
    title: "We define your ideal customer and offer together",
    body: "On a first call we pin down who buys from you and what makes your offer worth a reply.",
  },
  {
    title: "We build and launch a test campaign",
    body: "Our team builds your lead list and your campaign, and runs it for 14 days on our infrastructure, free. You approve every angle before it goes out.",
  },
  {
    title: "We tell you what works",
    body: "We go through the results with you: which angles and audiences got a response, and why.",
  },
  {
    title: "You book a 60-day pilot",
    body: "High volume, 4-5 angles, booking calls with your ideal customers.",
  },
  {
    title: "You get a repeatable pipeline",
    body: "Based on the pilot, we build a long-term strategy, so new client calls keep coming.",
  },
];

const assurances = [
  {
    lead: "Nothing upfront.",
    body: "The test runs on our domains and inboxes, at our cost. If it isn't for you, you cancel.",
  },
];

export default function Offer() {
  return (
    <section id="offer" className="py-24 md:py-32 bg-[var(--color-surface-low)]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-12 lg:gap-20">
        <div className="lg:sticky lg:top-32 self-start">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[var(--color-primary)] leading-tight">
            How It Works
          </h2>
          <p className="mt-6 text-lg md:text-xl text-[var(--color-on-surface-variant)] leading-relaxed">
            <strong className="text-[var(--color-primary)] font-semibold">
              Start with a free 14-day test campaign.
            </strong>{" "}
            See whether outbound can become a repeatable source of client calls,
            and reach markets you don&apos;t sell into today, before you commit.
          </p>
        </div>

        <div className="bg-[var(--color-surface-lowest)] rounded-2xl p-8 sm:p-12 md:p-14 shadow-ambient">
          {/* The spine makes the steps read as one sequence rather than
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
              We take on only 3 clients at a time, so every campaign gets our
              full attention.
            </p>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}
