import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Problem from "@/components/Problem";
import Funnel from "@/components/Funnel";
import Origin from "@/components/Origin";
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
      <Origin />
      <Pricing />
      <FAQ />
      <FinalCTA />
    </main>
  );
}
