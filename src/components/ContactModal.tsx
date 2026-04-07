"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FORMSPREE_URL = "https://formspree.io/f/xwvwyodd";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
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

    try {
      const res = await fetch(FORMSPREE_URL, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  function handleClose() {
    onClose();
    // Reset form state after close animation
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
          {/* Backdrop */}
          <div className="absolute inset-0 bg-[var(--color-primary)]/60 backdrop-blur-sm" />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative bg-white rounded-2xl shadow-ambient w-full max-w-lg p-8 md:p-10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
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
                <h3 className="text-xl font-bold text-[var(--color-primary)]">Message sent!</h3>
                <p className="mt-2 text-[var(--color-on-surface-variant)]">
                  We&apos;ll get back to you within 24 hours.
                </p>
                <button
                  onClick={handleClose}
                  className="mt-6 text-sm font-semibold text-[var(--color-secondary)] hover:underline"
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-bold text-[var(--color-primary)]">Get in touch</h3>
                <p className="mt-2 text-[var(--color-on-surface-variant)] text-sm">
                  Tell us about your destination and goals. We&apos;ll get back to you within 24 hours.
                </p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <div>
                    <label htmlFor="contact-name" className="block text-sm font-semibold text-[var(--color-primary)] mb-1.5">
                      Name <span className="text-[var(--color-secondary)]">*</span>
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      name="name"
                      required
                      className="w-full px-4 py-3 rounded-lg border border-[var(--color-outline-variant)]/30 bg-[var(--color-surface-low)] text-[var(--color-on-surface)] placeholder:text-[var(--color-on-surface-variant)]/40 focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]/40 focus:border-[var(--color-secondary)] transition-colors"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-email" className="block text-sm font-semibold text-[var(--color-primary)] mb-1.5">
                      Email <span className="text-[var(--color-secondary)]">*</span>
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      name="email"
                      required
                      className="w-full px-4 py-3 rounded-lg border border-[var(--color-outline-variant)]/30 bg-[var(--color-surface-low)] text-[var(--color-on-surface)] placeholder:text-[var(--color-on-surface-variant)]/40 focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]/40 focus:border-[var(--color-secondary)] transition-colors"
                      placeholder="you@company.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-company" className="block text-sm font-semibold text-[var(--color-primary)] mb-1.5">
                      Company / Destination <span className="text-[var(--color-secondary)]">*</span>
                    </label>
                    <input
                      id="contact-company"
                      type="text"
                      name="company"
                      required
                      className="w-full px-4 py-3 rounded-lg border border-[var(--color-outline-variant)]/30 bg-[var(--color-surface-low)] text-[var(--color-on-surface)] placeholder:text-[var(--color-on-surface-variant)]/40 focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]/40 focus:border-[var(--color-secondary)] transition-colors"
                      placeholder="Your company or destination"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-message" className="block text-sm font-semibold text-[var(--color-primary)] mb-1.5">
                      Message
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      rows={3}
                      className="w-full px-4 py-3 rounded-lg border border-[var(--color-outline-variant)]/30 bg-[var(--color-surface-low)] text-[var(--color-on-surface)] placeholder:text-[var(--color-on-surface-variant)]/40 focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]/40 focus:border-[var(--color-secondary)] transition-colors resize-none"
                      placeholder="Tell us what you're looking for..."
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
                    {status === "submitting" ? "Sending..." : "Send Message"}
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
