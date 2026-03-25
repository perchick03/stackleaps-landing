"use client";

import { useReveal } from "@/hooks/useReveal";

const qualifiers = [
  {
    text: "B2B companies where every new client is worth $5K+",
    icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  {
    text: "Sales teams that need 10+ meetings per month to hit quota",
    icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
  },
  {
    text: "Founders who are done doing their own prospecting",
    icon: "M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  {
    text: "Companies spending $10K+ on trade shows with mixed results",
    icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
  },
  {
    text: "Teams that know cold email works — but don't have time to run it",
    icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
  },
];

export default function WhoItsFor() {
  const ref = useReveal();

  return (
    <section className="relative py-24 md:py-32 border-t border-border">
      <div ref={ref} className="reveal max-w-5xl mx-auto px-6">
        <div className="flex items-center gap-3 mb-6">
          <span className="font-mono text-sm text-accent tracking-widest uppercase">
            Who It&apos;s For
          </span>
        </div>

        <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-16 max-w-3xl">
          This is for you if...
        </h2>

        <div className="space-y-4">
          {qualifiers.map((item) => (
            <div
              key={item.text}
              className="flex items-center gap-6 p-6 border border-border hover:border-accent/30 transition-colors group"
            >
              <div className="shrink-0 w-12 h-12 rounded-sm bg-surface flex items-center justify-center group-hover:bg-accent/10 transition-colors">
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
                    d={item.icon}
                  />
                </svg>
              </div>
              <p className="text-lg">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
