"use client";

import { useState } from "react";
import Image from "next/image";
import ListImpressionModal from "./ListImpressionModal";

interface EbbHeaderProps {
  prefill: {
    name: string;
    email: string;
    company: string;
    brief_slug: string;
  };
}

export default function EbbHeader({ prefill }: EbbHeaderProps) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[var(--color-surface-low)]/85 glass-effect">
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
        <button
          onClick={() => setOpen(true)}
          className="group inline-flex items-center gap-2 pl-5 pr-2 py-2 rounded-full bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-secondary-container)] text-white font-semibold text-sm hover:opacity-95 active:scale-[0.98] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
        >
          <span>Leave list impression</span>
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-white/20 group-hover:bg-white/30 group-hover:translate-x-[1px] group-hover:-translate-y-[1px] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 17 17 7M9 7h8v8" />
            </svg>
          </span>
        </button>
      </div>
      <ListImpressionModal isOpen={open} onClose={() => setOpen(false)} prefill={prefill} />
    </header>
  );
}
