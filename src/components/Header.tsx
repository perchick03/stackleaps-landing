"use client";

import Image from "next/image";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-[var(--color-surface-low)]/90 glass-effect border-b border-[var(--color-outline-variant)]/10">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 md:px-8 py-5">
        <Image
          src="/images/logo.png"
          alt="StackLeaps"
          width={180}
          height={40}
          className="h-10 w-auto"
          priority
        />
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
