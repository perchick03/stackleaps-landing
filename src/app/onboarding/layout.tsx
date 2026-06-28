import type { Metadata } from "next";

// Private per-client pages — keep them out of search indexes.
export const metadata: Metadata = {
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
