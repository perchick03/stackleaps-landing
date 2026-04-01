"use client";

import { motion } from "framer-motion";

const pains = [
  {
    title: "Waiting for inbound that never comes",
    body: "You have an incredible destination — but the right clients don't know you exist. You're invisible to operators who'd love to work with you.",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: "Relying on word-of-mouth and hope",
    body: "Your best partnerships came from referrals or chance meetings. That's great — but it doesn't scale, and you can't control when the next one comes.",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
      </svg>
    ),
  },
  {
    title: "You run operations AND chase new business",
    body: "You're managing ground logistics, client experiences, and supplier relationships — and somehow you're also supposed to be doing sales and marketing on top of it.",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
  },
];

export default function Problem() {
  return (
    <section id="problem" className="py-24 md:py-32 bg-[var(--color-surface-low)]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="max-w-2xl mb-16 md:mb-20">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[var(--color-secondary)] font-bold tracking-widest uppercase text-sm"
          >
            Sound familiar?
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[var(--color-primary)] mt-4 leading-tight"
          >
            Great Destinations Don&apos;t Sell Themselves
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          {pains.map((pain, i) => (
            <motion.div
              key={pain.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              className="group bg-[var(--color-surface-lowest)] rounded-xl p-8 md:p-10 shadow-ambient hover:shadow-lg transition-shadow duration-300"
            >
              <div className="w-14 h-14 rounded-xl bg-[var(--color-surface-high)] flex items-center justify-center text-[var(--color-primary)] mb-6 group-hover:bg-[var(--color-secondary)] group-hover:text-white transition-colors duration-300">
                {pain.icon}
              </div>
              <h3 className="text-xl font-bold text-[var(--color-primary)] mb-4">
                {pain.title}
              </h3>
              <p className="text-[var(--color-on-surface-variant)] leading-relaxed">
                {pain.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
