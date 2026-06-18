import { Hero } from "@/components/sections/Hero";
import { Problem } from "@/components/sections/Problem";
import { Steps } from "@/components/sections/Steps";
import { ScoreSection } from "@/components/sections/ScoreSection";
import { Pricing } from "@/components/sections/Pricing";
import { Founder } from "@/components/sections/Founder";
import { Faq } from "@/components/sections/Faq";
import { FinalCTA } from "@/components/sections/FinalCTA";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Problem />
      <Steps />
      <ScoreSection />
      <Pricing />
      <Founder />
      <Faq />
      <FinalCTA />
    </>
  );
}
