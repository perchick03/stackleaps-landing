"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { track } from "@vercel/analytics";

const FORMSPREE_URL = "https://formspree.io/f/xwvwyodd";

interface ListImpressionModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefill: {
    name: string;
    email: string;
    company: string;
    brief_slug: string;
  };
}

export default function ListImpressionModal({ isOpen, onClose, prefill }: ListImpressionModalProps) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    const form = e.currentTarget;
    const data = new FormData(form);
    data.append("_subject", `Switch-Target Brief impression — ${prefill.company}`);
    data.append("source", "ebb-list");
    data.append("brief_slug", prefill.brief_slug);

    try {
      const res = await fetch(FORMSPREE_URL, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        setStatus("success");
        form.reset();
        track("impression_submitted", { slug: prefill.brief_slug, broker: prefill.company });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  function handleClose() {
    onClose();
    setTimeout(() => setStatus("idle"), 300);
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center px-4"
          onClick={handleClose}
        >
          <div className="absolute inset-0 bg-[var(--color-primary)]/60 backdrop-blur-sm" />

          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative bg-white rounded-2xl shadow-ambient w-full max-w-lg p-8 md:p-10"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-[var(--color-on-surface-variant)]/50 hover:text-[var(--color-on-surface-variant)] transition-colors"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {status === "success" ? (
              <div className="text-center py-8">
                <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-[var(--color-secondary)]/10 flex items-center justify-center">
                  <svg className="w-7 h-7 text-[var(--color-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[var(--color-primary)]">Thanks for the feedback!</h3>
                <p className="mt-2 text-[var(--color-on-surface-variant)]">
                  We&apos;ll read it and get back to you within 24 hours.
                </p>
                <button onClick={handleClose} className="mt-6 text-sm font-semibold text-[var(--color-secondary)] hover:underline">
                  Close
                </button>
              </div>
            ) : (
              <>
                <div className="text-[10px] uppercase tracking-[0.22em] text-[var(--color-on-surface-variant)]/70 mb-2">
                  Switch-Target Brief
                </div>
                <h3 className="font-serif text-3xl text-[var(--color-primary)] leading-tight tracking-[-0.01em]">
                  Your impression of this list
                </h3>
                <p className="mt-3 text-[var(--color-on-surface-variant)] text-sm leading-relaxed">
                  Anything off? Anyone you want us to dig deeper on? Tell us in a sentence or two — it shapes the next brief.
                </p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="li-name" className="block text-sm font-semibold text-[var(--color-primary)] mb-1.5">Name</label>
                      <input
                        id="li-name"
                        type="text"
                        name="name"
                        defaultValue={prefill.name}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-[var(--color-outline-variant)]/30 bg-[var(--color-surface-low)] text-[var(--color-on-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]/40 focus:border-[var(--color-secondary)] transition-colors"
                      />
                    </div>
                    <div>
                      <label htmlFor="li-email" className="block text-sm font-semibold text-[var(--color-primary)] mb-1.5">Email</label>
                      <input
                        id="li-email"
                        type="email"
                        name="email"
                        defaultValue={prefill.email}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-[var(--color-outline-variant)]/30 bg-[var(--color-surface-low)] text-[var(--color-on-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]/40 focus:border-[var(--color-secondary)] transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="li-message" className="block text-sm font-semibold text-[var(--color-primary)] mb-1.5">
                      Your impression <span className="text-[var(--color-secondary)]">*</span>
                    </label>
                    <textarea
                      id="li-message"
                      name="message"
                      rows={5}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-[var(--color-outline-variant)]/30 bg-[var(--color-surface-low)] text-[var(--color-on-surface)] placeholder:text-[var(--color-on-surface-variant)]/40 focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]/40 focus:border-[var(--color-secondary)] transition-colors resize-none"
                      placeholder="e.g. Row 3 looks great — I already pitched them last year. Skip retail next time. Add anyone on the OneDigital book if you can."
                    />
                  </div>

                  {status === "error" && (
                    <p className="text-sm text-red-600">Something went wrong. Please try again.</p>
                  )}

                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="w-full bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-secondary-container)] text-white px-6 py-3.5 rounded-lg font-bold text-base hover:opacity-90 transition-opacity disabled:opacity-60"
                  >
                    {status === "submitting" ? "Sending..." : "Send Impression"}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
