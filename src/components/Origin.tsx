"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function Origin() {
  return (
    <section id="origin" className="py-24 md:py-32 bg-white">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left - photo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
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
          </motion.div>

          {/* Right - story */}
          <div>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-[var(--color-secondary)] font-bold tracking-widest uppercase text-sm"
            >
              The Story
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-[2.75rem] font-extrabold text-[var(--color-primary)] mt-4 leading-tight"
            >
              I Didn&apos;t Build This as an Agency. I Built It for My Own DMC.
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mt-8 space-y-5 text-[var(--color-on-surface-variant)] text-lg leading-relaxed"
            >
              <p>
                I&apos;m co-founder of a Balkans Wanders DMC. My partner runs ground
                operations - I joined as the technical side. When we struggled to
                find tour operator partners, I built an outreach system to fix it.
              </p>
              <p>
                It worked. <strong className="text-[var(--color-primary)] font-semibold">7 quality introductions in 10 days.</strong> We had to pause
                the campaign because we couldn&apos;t handle the volume.
              </p>
              <p>
                Other DMC owners started asking how we did it. That&apos;s how
                StackLeaps started - the same system, opened up to{" "}
                <strong className="text-[var(--color-primary)] font-semibold relative inline">
                  one DMC per destination.
                  <svg className="absolute -bottom-1 left-0 w-full h-[6px]" viewBox="0 0 200 8" fill="none" preserveAspectRatio="none">
                    <path d="M2 5.5C30 2 60 6 100 3.5C140 1 170 5.5 198 3" stroke="var(--color-secondary)" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </strong>
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
