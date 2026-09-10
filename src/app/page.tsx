import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Problem from "@/components/Problem";
import Funnel from "@/components/Funnel";
import Origin from "@/components/Origin";
import Offer from "@/components/Offer";
import FAQ from "@/components/FAQ";
import FinalCTA from "@/components/FinalCTA";

export default function Home() {
  return (
    <main className="paper-grain">
      <Header />
      <Hero />
      <Problem />
      <Funnel />
      <Origin />
      <Offer />
      <FAQ />
      <FinalCTA />
    </main>
  );
}
