"use client";

import Image from "next/image";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-[var(--color-surface-low)]/90 glass-effect border-b border-[var(--color-outline-variant)]/10">
      <div className="max-w-[1400px] mx-auto flex justify-between items-center px-6 md:px-10 py-5">
        <a href="/">
          <Image
            src="/images/logo.avif"
            alt="StackLeaps"
            width={180}
            height={40}
            className="h-10 w-auto"
            priority
          />
        </a>
        <a
          href="#book"
          className="bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-secondary-container)] text-white px-6 py-2.5 rounded-md font-semibold text-sm hover:opacity-90 transition-opacity"
        >
          Book a Free Strategy Call
        </a>
      </div>
    </header>
  );
}
