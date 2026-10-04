"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useMotionValueEvent, useScroll } from "framer-motion";
import ContactModal from "./ContactModal";

// overlay: the header floats transparent over the dark #hero, then turns back into
// the cream bar once the hero has scrolled out from under it.
export default function Header({ overlay = false }: { overlay?: boolean }) {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [overHero, setOverHero] = useState(overlay);
  const [atTop, setAtTop] = useState(true);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (y) => {
    if (!overlay) return;
    const hero = document.getElementById("hero");
    setOverHero(!!hero && hero.getBoundingClientRect().bottom > 80);
    setAtTop(y < 12);
  });
  const dark = overlay && overHero;

  return (
    <header
      className={`${overlay ? "fixed inset-x-0" : "sticky"} top-0 z-50 transition-colors duration-300 ${
        !dark ? "bg-[var(--color-surface-low)]/90 glass-effect" : atTop ? "bg-transparent" : "bg-[var(--color-ink)]/75 glass-effect"
      }`}
    >
      <div className="max-w-[1400px] mx-auto flex justify-between items-center px-6 md:px-10 py-5">
        <Link href="/" className="relative block">
          <Image
            src="/images/stackleaps-logo-v2.webp"
            alt="StackLeaps"
            width={180}
            height={40}
            className={`h-10 w-auto transition-opacity duration-300 ${dark ? "opacity-0" : ""}`}
            priority
          />
          {overlay && (
            <Image
              src="/images/stackleaps-logo-v2-light.webp"
              alt=""
              width={180}
              height={40}
              className={`absolute inset-0 h-10 w-auto transition-opacity duration-300 ${dark ? "" : "opacity-0"}`}
              priority
            />
          )}
        </Link>
        <button
          onClick={() => setIsContactOpen(true)}
          className={`px-6 py-3 rounded-md font-semibold text-sm transition-colors duration-300 ${
            dark
              ? "bg-[var(--color-secondary-container)] text-[var(--color-primary)] hover:bg-[#ffa05a]"
              : "bg-[var(--color-secondary)] text-white hover:opacity-90"
          }`}
        >
          Contact Us
        </button>
      </div>
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </header>
  );
}
