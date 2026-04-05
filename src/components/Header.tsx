"use client";

import Image from "next/image";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-[var(--color-surface-low)]/90 glass-effect ">
      <div className="max-w-[1400px] mx-auto flex justify-between items-center px-6 md:px-10 py-5">
        <a href="/">
          <Image
            src="/images/stackleaps-logo-v2.webp"
            alt="StackLeaps"
            width={180}
            height={40}
            className="h-10 w-auto"
            priority
          />
        </a>
        <a
          href="#book"
          className="bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-secondary-container)] text-white px-6 py-3 rounded-md font-semibold text-sm hover:opacity-90 transition-opacity"
        >
          <span className="sm:hidden">Book a Call</span>
          <span className="hidden sm:inline">Book a Free Strategy Call</span>
        </a>
      </div>
    </header>
  );
}
