import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Problem from "@/components/Problem";
import Funnel from "@/components/Funnel";
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
      <Funnel />
      <WhoItsFor />
      <Pricing />
      <FAQ />
      <FinalCTA />
    </main>
  );
}
