import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Problem from "@/components/Problem";
import Solution from "@/components/Solution";
import Funnel from "@/components/Funnel";
import HowItWorks from "@/components/HowItWorks";
import WhoItsFor from "@/components/WhoItsFor";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import FinalCTA from "@/components/FinalCTA";

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <Problem />
      <Solution />
      <Funnel />
      <HowItWorks />
      <WhoItsFor />
      <Pricing />
      <FAQ />
      <FinalCTA />
    </main>
  );
}
