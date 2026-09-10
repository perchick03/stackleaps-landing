import Image from "next/image";

export default function Origin() {
  return (
    <section id="origin" className="py-24 md:py-32 bg-white">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left - photo */}
          <div
            className="relative"
          >
            <div className="absolute -top-6 -left-6 w-[105%] h-[105%] bg-[var(--color-secondary-fixed)]/40 rounded-[2rem] -z-10" />
            <div className="overflow-hidden rounded-[1.5rem]">
              <Image
                src="/images/kotor-selfie.webp"
                alt="Peretz in Kotor, Montenegro"
                width={800}
                height={600}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

          {/* Right - story */}
          <div>
            <h2
              className="text-3xl sm:text-4xl md:text-[2.75rem] font-extrabold text-[var(--color-primary)] leading-tight"
            >
              We Run This System on Our Own Company First.
            </h2>

            <div
              className="mt-8 space-y-5 text-[var(--color-on-surface-variant)] text-lg leading-relaxed"
            >
              <p>
                I co-founded{" "}
                <a
                  href="https://balkanwanders.com/balkan-destination-management-company"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--color-primary)] font-semibold underline decoration-[var(--color-secondary)] decoration-2 underline-offset-4 hover:opacity-80 transition-opacity"
                >
                  Balkan Wanders
                </a>
                , a Balkan destination management company. My partner runs
                ground operations; I built the outreach engine that fills our
                calendar - the same engine we now run for clients.
              </p>
              <p>
                The first campaign booked <strong className="text-[var(--color-primary)] font-semibold">7 quality introductions in 10 days.</strong> We
                paused it - the pipeline was running ahead of what ground
                operations could absorb.
              </p>
              <p>
                Founders in other markets asked for the same engine. We run it
                for{" "}
                <strong className="text-[var(--color-primary)] font-semibold relative inline">
                  one client per niche
                  <svg className="absolute -bottom-1 left-0 w-full h-[6px]" viewBox="0 0 200 8" fill="none" preserveAspectRatio="none">
                    <path d="M2 5.5C30 2 60 6 100 3.5C140 1 170 5.5 198 3" stroke="var(--color-secondary)" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </strong>
                {" "}- so your buyers, your campaign data and your angle stay
                yours.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
