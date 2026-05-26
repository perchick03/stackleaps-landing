"use client";

import { motion, useMotionValue } from "framer-motion";
import { useEffect, useState } from "react";

export default function PageCanvas() {
  const [pageHeight, setPageHeight] = useState(0);
  const y = useMotionValue(0);

  useEffect(() => {
    const measure = () =>
      setPageHeight(document.documentElement.scrollHeight);
    const onScroll = () => y.set(-window.scrollY);

    measure();
    onScroll();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      ro.disconnect();
    };
  }, [y]);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <motion.div
        style={{
          y,
          height: pageHeight || "100vh",
          background: `linear-gradient(
            180deg,
            #FDFCF7 0%,
            #F3F1E6 12%,
            #C5BFA8 20%,
            #4A4A6A 26%,
            #0F0F2D 34%,
            #0F0F2D 44%,
            #4A4A6A 49%,
            #E8E4D0 54%,
            #EDEAD7 62%,
            #E2DDC8 74%,
            #D5CFB5 84%,
            #4A4A6A 92%,
            #0F0F2D 100%
          )`,
        }}
        className="absolute inset-x-0 top-0 w-full"
      />
    </div>
  );
}
