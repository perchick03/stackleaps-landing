const pains = [
  {
    title: "Waiting for inbound calls that never come",
    body: "You have an incredible offer - but the right buyers don't know you exist. You're invisible to companies that would love to work with you.",
  },
  {
    title: "Relying on word-of-mouth and hope",
    body: "Your best clients came from referrals or chance introductions. That's great - but it doesn't scale, and you can't control when the next one comes.",
  },
  {
    title: "You run the business AND chase new business",
    body: "You're delivering the work, managing the team, and dealing with clients - and somehow you're also supposed to be doing sales and marketing on top of it.",
  },
];

export default function Problem() {
  return (
    <section id="problem" className="py-24 md:py-32 bg-[var(--color-surface-low)]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-12 lg:gap-20">
          {/* Left - heading (sticky on desktop) */}
          <div className="lg:sticky lg:top-32 self-start">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[var(--color-primary)] leading-tight">
              Great Products Don&apos;t Sell Themselves
            </h2>
            <p className="mt-6 text-lg text-[var(--color-on-surface-variant)] leading-relaxed max-w-md">
              The best offer in your market means nothing if the right buyers never hear it. Three reasons growth stalls:
            </p>
          </div>

          {/* Right - editorial entries. Type scale and rules carry the hierarchy,
              so the section reads as a written argument, not a card grid. */}
          <div>
            {pains.map((pain, i) => (
              <div
                key={pain.title}
                className={i === 0 ? "" : "mt-12 md:mt-16"}
              >
                <span className="rule-mark" aria-hidden="true" />
                <h3
                  className={`mt-5 font-bold text-[var(--color-primary)] leading-snug ${
                    i === 0
                      ? "text-2xl md:text-[2rem]"
                      : "text-xl md:text-2xl"
                  }`}
                >
                  {pain.title}
                </h3>
                <p className="mt-3 text-[var(--color-on-surface-variant)] leading-relaxed max-w-[62ch]">
                  {pain.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
