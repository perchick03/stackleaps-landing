import type { Metadata } from "next";
import Header from "@/components/Header";
import Hero from "@/components/dmc/Hero";
import Problem from "@/components/dmc/Problem";
import Funnel from "@/components/dmc/Funnel";
import Origin from "@/components/dmc/Origin";
import Pricing from "@/components/dmc/Pricing";
import FAQ from "@/components/dmc/FAQ";
import FinalCTA from "@/components/dmc/FinalCTA";

export const metadata: Metadata = {
  title: "StackLeaps for DMCs - Vetted Partner Meetings on Your Calendar",
  description:
    "We connect DMCs with tour operators, travel advisors, and event planners through personalized outreach. One DMC per destination.",
  openGraph: {
    title: "StackLeaps for DMCs - Vetted Partner Meetings on Your Calendar",
    description:
      "We connect DMCs with tour operators, travel advisors, and event planners through personalized outreach. One DMC per destination.",
    url: "https://stackleaps.com/dmc",
    siteName: "StackLeaps",
    type: "website",
  },
};

export default function DMCHome() {
  return (
    <main>
      <Header />
      <Hero />
      <Problem />
      <Funnel />
      <Origin />
      <Pricing />
      <FAQ />
      <FinalCTA />
    </main>
  );
}
