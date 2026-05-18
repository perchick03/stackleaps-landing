"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

export default function ProposalHeader({
  downloadHref,
  downloadFilename,
  currentSection,
}: {
  downloadHref: string;
  downloadFilename?: string;
  currentSection?: string;
}) {
  return (
    <header className="sticky top-0 z-50 bg-[var(--color-surface-low)]/90 glass-effect print:hidden">
      <div className="max-w-[1400px] mx-auto grid grid-cols-[1fr_auto_1fr] items-center px-6 md:px-10 py-5 gap-4">
        <a href="/" className="justify-self-start">
          <Image
            src="/images/stackleaps-logo-v2.webp"
            alt="StackLeaps"
            width={180}
            height={40}
            className="h-10 w-auto"
            priority
          />
        </a>

        <div className="justify-self-center hidden md:flex items-center gap-3 font-mono text-[11px] tracking-[0.24em] uppercase text-[var(--color-on-surface-variant)] min-h-[14px]">
          <span className="hidden lg:inline opacity-50">Proposal</span>
          <span className="hidden lg:inline opacity-30">/</span>
          <AnimatePresence mode="wait">
            <motion.span
              key={currentSection || "intro"}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="font-semibold text-[var(--color-primary)]"
            >
              {currentSection || "Intro"}
            </motion.span>
          </AnimatePresence>
        </div>

        <a
          href={downloadHref}
          download={downloadFilename}
          target="_blank"
          rel="noopener noreferrer"
          className="justify-self-end bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-secondary-container)] text-white px-6 py-3 rounded-md font-semibold text-sm hover:opacity-90 transition-opacity inline-flex items-center gap-2"
        >
          <DownloadIcon />
          <span className="hidden sm:inline">Download PDF</span>
          <span className="sm:hidden">PDF</span>
        </a>
      </div>
    </header>
  );
}

function DownloadIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}
